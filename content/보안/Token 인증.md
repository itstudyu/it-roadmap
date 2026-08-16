# Token 인증 (Token Authentication)

## 📝 정의

Token 인증은 사용자가 로그인 후 받는 **디지털 출입증(Token)**을 사용하여 신원을 증명하는 인증 방식입니다. 매번 ID/비밀번호를 보내지 않고, Token을 보내서 "나는 인증된 사용자입니다"를 증명합니다.

### 핵심 개념

- **무엇인가?**: 디지털 출입증을 통한 신원 증명
- **왜 필요한가?**: 비밀번호를 매번 전송하지 않아 보안 향상
- **어떻게 작동하나?**: 로그인 → Token 발급 → Token으로 인증 → 서버 검증

### Token 인증이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 매번 비밀번호 전송
사용자: API 호출마다 ID/비밀번호 전송
네트워크: 암호화되지 않은 경로에서 중간 탈취
→ 비밀번호 노출 위험! 😱

😱 시나리오 2: 서버에 세션 저장
서버1: 로그인 → 세션 저장
사용자: 다른 요청 → 서버2로 전송
서버2: "세션 없음, 다시 로그인하세요"
→ 확장 불가능! 😱

😱 시나리오 3: 모바일 앱 인증 어려움
모바일 앱: Cookie 지원 제한적
웹: Session 기반 인증만
→ 모바일 앱에서 사용 불가! 😱
```

**Token 인증의 해결**:
```
✅ 시나리오 1 (Token 사용):
로그인 1회: ID/비밀번호 → Token 발급
이후 요청: Token만 전송 (비밀번호 X)
→ 비밀번호 노출 최소화 ✅

✅ 시나리오 2 (무상태):
Token에 모든 정보 포함
서버1, 서버2 모두 Token 검증 가능
→ 어느 서버든 인증 가능 ✅

✅ 시나리오 3 (범용성):
Token은 HTTP Header에 첨부
웹, 모바일, API 모두 동일 방식
→ 모든 플랫폼 지원 ✅
```

**비유**:
- **비밀번호 인증** = 매번 신분증 제시 (번거롭고 위험)
- **Token 인증** = 출입증 발급받아 사용 (편리하고 안전)

## 📊 Token 인증 플로우

```도해
흐름: Token 인증, 무슨 순서로 오가나
클라이언트 :: 로그인 요청 (ID, Password)
서버 :: 사용자 확인
서버 :: Token 생성 (JWT 서명)
서버 :: Token 반환
클라이언트 :: API 요청 + Authorization: Bearer {T…
서버 :: Token 검증 (서명 확인)
서버 :: 데이터 반환
서버 :: 401 Unauthorized
```

## 💡 실제 구현

### 1. JWT Token 생성 및 검증

```python
import jwt
from datetime import datetime, timedelta

# 비밀 키 (환경변수로 관리)
SECRET_KEY = "your-secret-key-keep-it-safe"

def create_token(user_id: str, role: str) -> str:
    """JWT 토큰 생성"""

    # Payload (사용자 정보 + 메타데이터)
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=24),  # 만료 시간
        'iat': datetime.utcnow()  # 발급 시간
    }

    # Token 생성 (서명)
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

def verify_token(token: str) -> dict:
    """JWT 토큰 검증"""
    try:
        # Token 검증 및 디코딩
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload

    except jwt.ExpiredSignatureError:
        raise Exception("Token이 만료되었습니다")
    except jwt.InvalidTokenError:
        raise Exception("유효하지 않은 Token입니다")


# 사용 예시
print("=== Token 생성 ===")
token = create_token(user_id="user123", role="admin")
print(f"Token: {token[:50]}...\n")

print("=== Token 검증 ===")
try:
    payload = verify_token(token)
    print(f"✅ 사용자 ID: {payload['user_id']}")
    print(f"✅ 역할: {payload['role']}")
except Exception as e:
    print(f"❌ 검증 실패: {e}")
```

**JWT Token 구조**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcjEyMyIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

┌────────── Header ──────────┐
│   알고리즘 정보              │
│   {"alg":"HS256"}          │
└────────────────────────────┘
         ▼
┌────────── Payload ─────────┐
│   사용자 정보                │
│   {"user_id":"user123"}    │
└────────────────────────────┘
         ▼
┌────────── Signature ───────┐
│   서명 (변조 방지)           │
│   HMACSHA256(...)          │
└────────────────────────────┘
```

### 2. FastAPI Token 인증

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

app = FastAPI()
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

# 더미 사용자 DB
users_db = {
    "admin": {"password": "admin123", "role": "admin"},
    "user": {"password": "user123", "role": "user"}
}

@app.post("/login")
def login(request: LoginRequest):
    """로그인 - Token 발급"""

    user = users_db.get(request.username)

    # 사용자 확인
    if not user or user['password'] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 사용자명 또는 비밀번호"
        )

    # Token 생성
    token = create_token(
        user_id=request.username,
        role=user['role']
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """현재 사용자 정보 추출 (Token 검증)"""

    token = credentials.credentials

    try:
        payload = verify_token(token)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    """보호된 엔드포인트 (인증 필요)"""
    return {
        "message": f"안녕하세요, {current_user['user_id']}님!",
        "role": current_user['role']
    }

@app.get("/admin")
def admin_only(current_user: dict = Depends(get_current_user)):
    """관리자 전용 엔드포인트"""

    if current_user['role'] != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 필요합니다"
        )

    return {"message": "관리자 페이지입니다"}
```

**사용 예시**:
```bash
# 1. 로그인 (Token 받기)
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"admin123"}'

# 응답: {"access_token": "eyJhbGc...", "token_type": "bearer"}

# 2. 인증된 요청
curl http://localhost:8000/protected \
  -H "Authorization: Bearer eyJhbGc..."

# 응답: {"message": "안녕하세요, admin님!", "role": "admin"}
```

### 3. 클라이언트에서 Token 사용

```javascript
// JavaScript (axios 사용)

// 1. 로그인하여 Token 받기
async function login(username, password) {
  const response = await axios.post('/login', {
    username,
    password
  });

  const token = response.data.access_token;

  // Token 저장 (localStorage)
  localStorage.setItem('access_token', token);

  return token;
}

// 2. API 요청 시 Token 첨부
async function fetchProtectedData() {
  const token = localStorage.getItem('access_token');

  const response = await axios.get('/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}

// 3. Axios Interceptor로 자동으로 Token 첨부
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Token 만료 시 자동 갱신
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 만료 - 재로그인
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Refresh Token 패턴

Token을 2개로 분리하여 보안 강화:

```python
def create_tokens(user_id: str, role: str) -> dict:
    """Access Token + Refresh Token 생성"""

    # Access Token (짧은 수명: 15분)
    access_token = jwt.encode(
        {
            'user_id': user_id,
            'role': role,
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(minutes=15)
        },
        SECRET_KEY,
        algorithm='HS256'
    )

    # Refresh Token (긴 수명: 7일)
    refresh_token = jwt.encode(
        {
            'user_id': user_id,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=7)
        },
        SECRET_KEY,
        algorithm='HS256'
    )

    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

@app.post("/refresh")
def refresh_access_token(refresh_token: str):
    """Refresh Token으로 새 Access Token 발급"""

    try:
        payload = verify_token(refresh_token)

        # Refresh Token인지 확인
        if payload.get('type') != 'refresh':
            raise Exception("Refresh Token이 아닙니다")

        # 새 Access Token 발급
        user_id = payload['user_id']

        # 사용자 정보 조회 (DB에서)
        # user = get_user_from_db(user_id)

        new_access_token = create_token(user_id, "user")

        return {"access_token": new_access_token}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
```

**Refresh Token 플로우**:
```
로그인
 └─> Access Token (15분) + Refresh Token (7일)

15분 후...
 └─> Access Token 만료
      └─> Refresh Token으로 새 Access Token 발급
           └─> 다시 15분 사용 가능

7일 후...
 └─> Refresh Token 만료
      └─> 재로그인 필요
```

## 🎯 Token 저장 방법 비교

| 방법 | 장점 | 단점 | 보안 | 권장 |
|------|------|------|------|------|
| **localStorage** | 간단, 지속적 | XSS 취약 | ⚠️ 중간 | 개발용 |
| **Cookie (HttpOnly)** | XSS 방어 | CSRF 취약 | ✅ 높음 | **권장** |
| **메모리** | 가장 안전 | 새로고침 시 손실 | ✅ 매우 높음 | 특수 케이스 |
| **sessionStorage** | 탭마다 독립 | 새로고침 시 손실 | ⚠️ 중간 | 제한적 |

**권장 방법**: **HttpOnly Cookie + CSRF Token 조합**

## 🔒 Token 보안 Best Practices

### 1. Token 만료 시간 설정

```python
# ✅ 좋은 예
Access Token: 15분~1시간 (짧게)
Refresh Token: 7일~30일 (길게)

# ❌ 나쁜 예
Access Token: 30일 (너무 길어서 위험)
```

### 2. Token 블랙리스트

```python
# 로그아웃 시 Token 무효화
blacklisted_tokens = set()

def logout(token: str):
    """Token을 블랙리스트에 추가"""
    blacklisted_tokens.add(token)

def is_token_blacklisted(token: str) -> bool:
    """블랙리스트 확인"""
    return token in blacklisted_tokens
```

### 3. HTTPS 필수

```python
# Token은 반드시 HTTPS로 전송
if not request.is_secure:
    raise Exception("HTTPS 연결이 필요합니다")
```

### 4. Token에 민감 정보 포함 금지

```python
# ❌ 나쁜 예
payload = {
    'user_id': 'user123',
    'password': 'secret123',  # ❌ 비밀번호 포함 금지!
    'ssn': '123456-1234567'   # ❌ PII 포함 금지!
}

# ✅ 좋은 예
payload = {
    'user_id': 'user123',
    'role': 'admin',
    'exp': ...
}
```

## 🔗 관련 용어

- [[JWT]]: Token 인증의 구체적인 구현
- [[OAuth]]: 제3자 인증 프로토콜
- [[Session]]: Token 인증 이전 방식
- [[HTTPS]]: Token 전송 보안
- [[PII]]: Token에 포함하면 안 되는 정보

## 📚 참고자료

- [JWT.io](https://jwt.io/) - JWT 디버거
- [OAuth 2.0](https://oauth.net/2/) - OAuth 표준
- [OWASP Token Security](https://owasp.org/) - 보안 가이드

---
*카테고리: 보안*
*생성일: 2026-02-14*
