# API Token (API 토큰)

## 📝 정의

API Token(API 토큰)은 **API 접근 권한을 인증하기 위한 고유 문자열**로, 사용자 대신 API를 호출할 수 있는 자격증명입니다.

### 핵심 개념

- **무엇인가?**: API 호출 시 사용하는 인증 키
- **왜 필요한가?**: 비밀번호 없이 안전하게 API 접근
- **어떻게 작동하나?**: 요청 헤더에 토큰 포함 → 서버 검증

### API Token이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 비밀번호로 API 호출
스크립트에 비밀번호 하드코딩
→ 코드 유출 시 계정 탈취
→ 모든 권한 노출! 😱

😱 시나리오 2: 권한 제어 없음
개발자 → 모든 API 접근 가능
→ 필요 이상의 권한
→ 보안 위험! 😱
```

**API Token의 해결**:
```
✅ 제한된 권한:
개발자 → API Token 발급 (읽기 전용)
→ 토큰 유출 시 해당 권한만 노출
→ 토큰 삭제로 즉시 차단
→ 안전! ✅
```

**비유**:
- **비밀번호** = 집 열쇠 (모든 방 접근)
- **API Token** = 방문객 출입증 (특정 구역만)

## 📊 API Token 흐름

```도해
흐름: API Token, 무슨 순서로 오가나
사용자 :: Token 발급 요청
애플리케이션 :: 인증 (ID/PW)
API 서버 :: Token 발급 abc123xyz
애플리케이션 :: API 호출 Authorization: Bearer abc1…
API 서버 :: Token 검증
API 서버 :: 데이터 반환
```

## 💡 Token 생성

### 1. 간단한 Token 생성
```python
import secrets
import hashlib

def generate_token():
    """
    암호학적으로 안전한 토큰 생성
    """
    # 32바이트 랜덤 바이트
    random_bytes = secrets.token_bytes(32)
    
    # 16진수 문자열로 변환
    token = secrets.token_hex(32)
    
    return token

# 사용
token = generate_token()
# → "a1b2c3d4e5f6..."
```

### 2. Token 저장 (서버)
```python
import bcrypt
from datetime import datetime, timedelta

class TokenManager:
    def __init__(self, db):
        self.db = db
    
    def create_token(self, user_id, scopes=['read']):
        """Token 생성 및 저장"""
        # Token 생성
        token = secrets.token_urlsafe(32)
        
        # Hash (DB에 hash만 저장)
        token_hash = bcrypt.hashpw(
            token.encode(), 
            bcrypt.gensalt()
        )
        
        # 만료 시간 (30일)
        expires_at = datetime.now() + timedelta(days=30)
        
        # DB 저장
        self.db.tokens.insert({
            'user_id': user_id,
            'token_hash': token_hash,
            'scopes': scopes,
            'expires_at': expires_at,
            'created_at': datetime.now()
        })
        
        # 원본 token 반환 (한 번만!)
        return token
    
    def verify_token(self, token):
        """Token 검증"""
        # DB에서 모든 토큰 조회
        tokens = self.db.tokens.find({'expires_at': {'$gt': datetime.now()}})
        
        for record in tokens:
            if bcrypt.checkpw(token.encode(), record['token_hash']):
                return record  # 유효한 토큰
        
        return None  # 유효하지 않음
```

## 💡 Token 사용

### 1. Bearer Token (가장 일반적)
```python
import requests

API_TOKEN = "your_api_token_here"

response = requests.get(
    'https://api.github.com/user',
    headers={
        'Authorization': f'Bearer {API_TOKEN}'
    }
)

if response.status_code == 200:
    user_data = response.json()
else:
    print(f"Error: {response.status_code}")
```

### 2. Query Parameter (비추천)
```python
# URL에 토큰 노출 (로그에 남음 - 보안 취약)
response = requests.get(
    f'https://api.example.com/data?token={API_TOKEN}'
)
```

### 3. Custom Header
```python
response = requests.get(
    'https://api.example.com/data',
    headers={
        'X-API-Key': API_TOKEN
    }
)
```

## 💡 Flask에서 Token 인증

```python
from flask import Flask, request, jsonify
from functools import wraps

app = Flask(__name__)

def require_token(scopes=[]):
    """Token 인증 데코레이터"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Authorization 헤더 확인
            auth_header = request.headers.get('Authorization')
            
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'No token provided'}), 401
            
            # Token 추출
            token = auth_header.split(' ')[1]
            
            # Token 검증
            token_data = token_manager.verify_token(token)
            
            if not token_data:
                return jsonify({'error': 'Invalid token'}), 401
            
            # 만료 확인
            if token_data['expires_at'] < datetime.now():
                return jsonify({'error': 'Token expired'}), 401
            
            # 권한 확인
            if scopes and not any(s in token_data['scopes'] for s in scopes):
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            # 요청 처리
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

# 사용
@app.route('/api/users')
@require_token(scopes=['read:users'])
def get_users():
    return jsonify({'users': [...]})

@app.route('/api/users', methods=['POST'])
@require_token(scopes=['write:users'])
def create_user():
    return jsonify({'created': True})
```

## 🎯 Token 권한 범위 (Scopes)

```python
# GitHub API 예시
SCOPES = {
    'repo': '저장소 전체 접근',
    'repo:status': '커밋 상태만 접근',
    'public_repo': '공개 저장소만',
    'read:user': '사용자 정보 읽기',
    'user:email': '이메일 주소만'
}

# Token 생성 시 권한 지정
token = create_token(
    user_id=123,
    scopes=['read:user', 'public_repo']
)
```

## ⚠️ 보안 고려사항

### 1. Token 저장
```python
# ❌ 절대 코드에 하드코딩 금지
TOKEN = "sk_live_abc123"

# ✅ 환경 변수 사용
import os
TOKEN = os.getenv('API_TOKEN')

# ✅ 설정 파일 (.gitignore에 추가)
import json
with open('config.json') as f:
    config = json.load(f)
    TOKEN = config['api_token']
```

### 2. Token 만료
```python
# 짧은 만료 시간 + Refresh Token
access_token = create_token(expires_in=3600)      # 1시간
refresh_token = create_token(expires_in=2592000)  # 30일
```

### 3. Token 교체
```python
# 주기적 교체
if days_since_created > 90:
    new_token = rotate_token(old_token)
    notify_user("Token rotated")
```

## 🔗 관련 용어

- [[OAuth]]: Token 기반 인증 프로토콜
- [[JWT]]: 자체 포함형 Token
- [[API Key]]: API Token과 유사

---
*카테고리: 보안*
*생성일: 2026-02-14*
