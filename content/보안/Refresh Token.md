# Refresh Token (리프레시 토큰)

## 📝 정의

Refresh Token(리프레시 토큰)은 **만료된 Access Token을 갱신하기 위한 장기 유효 토큰**으로, 사용자가 재로그인 없이 서비스를 계속 이용할 수 있게 합니다.

### 핵심 개념

- **무엇인가?**: Access Token 재발급용 장기 토큰
- **왜 필요한가?**: 짧은 Access Token 수명 + 편리한 사용자 경험
- **어떻게 작동하나?**: Access Token 만료 → Refresh Token으로 재발급

### Refresh Token이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: Access Token만 사용
Access Token 유효기간 30일
→ 토큰 탈취 시 30일간 악용 가능
→ 보안 위험! 😱

😱 시나리오 2: 짧은 Access Token
Access Token 유효기간 1시간
→ 1시간마다 재로그인 필요
→ 사용자 불편! 😱
```

**Refresh Token의 해결**:
```
✅ 보안 + 편의성:
Access Token: 1시간 (짧음)
Refresh Token: 30일 (김)
→ 1시간마다 자동 갱신 (재로그인 불필요)
→ Access Token 탈취 시 피해 최소
→ 보안 + 편의성! ✅
```

**비유**:
- **Access Token만** = 1시간짜리 입장권 (매번 재구매)
- **Refresh Token** = 정기권 (만료 시 자동 재발급)

## 📊 Refresh Token 흐름

```도해
흐름: Refresh Token, 무슨 순서로 오가나
클라이언트 :: 로그인 (ID/PW)
인증 서버 :: Access Token (1시간) Refresh Token…
클라이언트 :: API 요청 + Access Token
API 서버 :: 응답
클라이언트 :: API 요청 + Access Token (만료됨)
API 서버 :: 401 Unauthorized
클라이언트 :: Refresh Token 전송
인증 서버 :: 새 Access Token 발급
클라이언트 :: API 요청 + 새 Access Token
API 서버 :: 응답
```

## 💡 토큰 발급 구현

### JWT 기반 토큰 생성
```python
import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'your-secret-key'
REFRESH_SECRET_KEY = 'your-refresh-secret-key'

def generate_tokens(user_id):
    """Access Token + Refresh Token 발급"""
    
    # Access Token (1시간)
    access_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')
    
    # Refresh Token (30일)
    refresh_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30),
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    refresh_token = jwt.encode(refresh_payload, REFRESH_SECRET_KEY, algorithm='HS256')
    
    return access_token, refresh_token

# 로그인 시 발급
@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    
    if authenticate(username, password):
        user_id = get_user_id(username)
        access_token, refresh_token = generate_tokens(user_id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        })
    
    return {'error': 'Invalid credentials'}, 401
```

### Refresh Token으로 갱신
```python
@app.route('/token/refresh', methods=['POST'])
def refresh():
    """Refresh Token으로 Access Token 재발급"""
    refresh_token = request.json.get('refresh_token')
    
    if not refresh_token:
        return {'error': 'Refresh token required'}, 400
    
    try:
        # Refresh Token 검증
        payload = jwt.decode(
            refresh_token,
            REFRESH_SECRET_KEY,
            algorithms=['HS256']
        )
        
        # 타입 확인
        if payload.get('type') != 'refresh':
            return {'error': 'Invalid token type'}, 401
        
        # 새 Access Token 발급
        user_id = payload['user_id']
        access_payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=1),
            'iat': datetime.utcnow(),
            'type': 'access'
        }
        new_access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'access_token': new_access_token,
            'token_type': 'Bearer'
        })
        
    except jwt.ExpiredSignatureError:
        return {'error': 'Refresh token expired'}, 401
    except jwt.InvalidTokenError:
        return {'error': 'Invalid refresh token'}, 401
```

## 💡 클라이언트 구현

### 자동 토큰 갱신
```javascript
// Axios Interceptor로 자동 갱신
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 응답 인터셉터
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // 401 에러 && 재시도 아님
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // 이미 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      try {
        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post('/token/refresh', {
          refresh_token: refreshToken
        });
        
        const { access_token } = response.data;
        
        // 새 토큰 저장
        localStorage.setItem('access_token', access_token);
        
        // 대기 중인 요청들에 새 토큰 전달
        processQueue(null, access_token);
        
        // 원래 요청 재시도
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        return axios(originalRequest);
        
      } catch (err) {
        // Refresh Token도 만료됨 → 로그아웃
        processQueue(err, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
        
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

### React Hook
```javascript
import { useState, useEffect } from 'react';

function useAuth() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('access_token')
  );
  
  useEffect(() => {
    // 토큰 만료 5분 전에 자동 갱신
    const checkTokenExpiry = async () => {
      if (!accessToken) return;
      
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      
      // 5분 이내 만료 예정
      if (expiresIn < 5 * 60 * 1000) {
        const refreshToken = localStorage.getItem('refresh_token');
        
        try {
          const response = await fetch('/token/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
          });
          
          const data = await response.json();
          localStorage.setItem('access_token', data.access_token);
          setAccessToken(data.access_token);
          
        } catch (error) {
          // 갱신 실패 → 로그아웃
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    };
    
    // 1분마다 체크
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    return () => clearInterval(interval);
    
  }, [accessToken]);
  
  return { accessToken };
}
```

## 💡 보안 강화

### 1. Refresh Token Rotation
```python
@app.route('/token/refresh', methods=['POST'])
def refresh_with_rotation():
    """토큰 갱신 시 Refresh Token도 교체"""
    refresh_token = request.json.get('refresh_token')
    
    # 검증
    payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=['HS256'])
    user_id = payload['user_id']
    
    # 기존 Refresh Token 무효화
    revoke_token(refresh_token)
    
    # 새 Access Token + 새 Refresh Token 발급
    new_access_token, new_refresh_token = generate_tokens(user_id)
    
    return jsonify({
        'access_token': new_access_token,
        'refresh_token': new_refresh_token  # 새로 발급!
    })
```

### 2. Token Family (재사용 감지)
```python
class RefreshTokenFamily:
    """Refresh Token 계보 추적"""
    
    def __init__(self, db):
        self.db = db
    
    def create_family(self, user_id, refresh_token):
        """최초 Refresh Token 발급"""
        family_id = generate_id()
        
        self.db.tokens.insert({
            'family_id': family_id,
            'user_id': user_id,
            'token_hash': hash(refresh_token),
            'generation': 1,
            'revoked': False
        })
        
        return family_id
    
    def rotate_token(self, old_token, new_token):
        """토큰 교체"""
        old_record = self.db.tokens.find_one({'token_hash': hash(old_token)})
        
        if old_record['revoked']:
            # 이미 사용된 토큰 재사용 시도 → 해킹 의심
            # 해당 family 전체 무효화
            self.db.tokens.update_many(
                {'family_id': old_record['family_id']},
                {'$set': {'revoked': True}}
            )
            raise SecurityError("Token reuse detected")
        
        # 기존 토큰 무효화
        self.db.tokens.update_one(
            {'token_hash': hash(old_token)},
            {'$set': {'revoked': True}}
        )
        
        # 새 토큰 등록
        self.db.tokens.insert({
            'family_id': old_record['family_id'],
            'user_id': old_record['user_id'],
            'token_hash': hash(new_token),
            'generation': old_record['generation'] + 1,
            'revoked': False
        })
```

## 🎯 저장 위치

| 위치 | 장점 | 단점 | 권장 |
|------|------|------|------|
| **localStorage** | 간단 | XSS 취약 | ⚠️ |
| **httpOnly Cookie** | XSS 방어 | CSRF 취약 | ✅ |
| **메모리 (state)** | 가장 안전 | 새로고침 시 소멸 | ⚠️ |

### httpOnly Cookie 사용 (권장)
```python
@app.route('/login', methods=['POST'])
def login_with_cookie():
    # 인증 후
    access_token, refresh_token = generate_tokens(user_id)
    
    response = jsonify({'success': True})
    
    # Refresh Token은 httpOnly 쿠키에 저장
    response.set_cookie(
        'refresh_token',
        value=refresh_token,
        httponly=True,      # JavaScript 접근 불가
        secure=True,        # HTTPS only
        samesite='Strict',  # CSRF 방어
        max_age=30*24*60*60 # 30일
    )
    
    # Access Token은 JSON으로 반환
    return response
```

## 🔗 관련 용어

- [[JWT]]: Refresh Token 구현 방식
- [[API Token]]: 유사한 토큰 인증
- [[OAuth]]: Refresh Token 사용

---
*카테고리: 보안*
*생성일: 2026-02-14*
