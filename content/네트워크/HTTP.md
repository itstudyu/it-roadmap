# HTTP (HyperText Transfer Protocol)

## 📝 정의

HTTP(HyperText Transfer Protocol)는 **웹에서 데이터를 주고받기 위한 프로토콜**로, 클라이언트와 서버 간 통신의 기본 규칙입니다.

### 핵심 개념

- **무엇인가?**: 웹 통신 프로토콜
- **왜 필요한가?**: 표준화된 통신 규칙 필요
- **어떻게 작동하나?**: 요청(Request) → 응답(Response)

### HTTP가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 표준 프로토콜 없이
각 웹사이트 → 자체 통신 방식
→ 브라우저마다 별도 지원 필요
→ 호환성 없음! 😱
```

**HTTP의 해결**:
```
✅ 표준화:
모든 웹사이트 → HTTP 사용
모든 브라우저 → HTTP 지원
→ 어디서나 동작! ✅
```

**비유**:
- **표준 없음** = 나라마다 다른 언어
- **HTTP** = 공용어 (영어)

## 📊 HTTP 요청/응답

```도해
흐름: HTTP, 무슨 순서로 오가나
브라우저 :: HTTP Request GET /index.html
웹 서버 :: 파일 찾기
웹 서버 :: HTTP Response 200 OK
```

## 💡 HTTP 메서드

### GET (조회)
```http
GET /users/123 HTTP/1.1
Host: api.example.com

→ 사용자 정보 조회
```

```python
import requests

response = requests.get('https://api.example.com/users/123')
user = response.json()
```

### POST (생성)
```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{"name": "John", "email": "john@example.com"}

→ 새 사용자 생성
```

```python
response = requests.post(
    'https://api.example.com/users',
    json={'name': 'John', 'email': 'john@example.com'}
)
```

### PUT (전체 수정)
```http
PUT /users/123 HTTP/1.1
Content-Type: application/json

{"name": "John Doe", "email": "john.doe@example.com"}

→ 사용자 정보 전체 교체
```

### PATCH (부분 수정)
```http
PATCH /users/123 HTTP/1.1
Content-Type: application/json

{"email": "newemail@example.com"}

→ 이메일만 수정
```

### DELETE (삭제)
```http
DELETE /users/123 HTTP/1.1

→ 사용자 삭제
```

## 💡 HTTP 상태 코드

### 2xx: 성공
```
200 OK          성공
201 Created     생성 성공
204 No Content  성공 (응답 본문 없음)
```

### 3xx: 리다이렉션
```
301 Moved Permanently    영구 이동
302 Found                임시 이동
304 Not Modified         캐시 사용 가능
```

### 4xx: 클라이언트 오류
```
400 Bad Request          잘못된 요청
401 Unauthorized         인증 필요
403 Forbidden            권한 없음
404 Not Found            찾을 수 없음
429 Too Many Requests    요청 과다
```

### 5xx: 서버 오류
```
500 Internal Server Error    서버 오류
502 Bad Gateway              게이트웨이 오류
503 Service Unavailable      서비스 불가
504 Gateway Timeout          게이트웨이 타임아웃
```

## 💡 HTTP 헤더

### 요청 헤더
```http
GET /api/data HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0)
Accept: application/json
Accept-Language: ko-KR
Authorization: Bearer abc123
Cookie: session_id=xyz789
```

### 응답 헤더
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Set-Cookie: session_id=xyz789; HttpOnly
Cache-Control: max-age=3600
Access-Control-Allow-Origin: *
```

## 💡 Flask HTTP 서버

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """GET: 사용자 조회"""
    user = db.users.find_one({'id': user_id})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user), 200

@app.route('/users', methods=['POST'])
def create_user():
    """POST: 사용자 생성"""
    data = request.json
    
    # 필수 필드 확인
    if not data.get('email'):
        return jsonify({'error': 'Email required'}), 400
    
    user_id = db.users.insert(data)
    
    return jsonify({
        'id': user_id,
        'message': 'User created'
    }), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """PUT: 사용자 수정"""
    data = request.json
    
    db.users.update({'id': user_id}, data)
    
    return jsonify({'message': 'User updated'}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """DELETE: 사용자 삭제"""
    db.users.delete({'id': user_id})
    
    return '', 204  # No Content
```

## 💡 HTTP/1.1 vs HTTP/2 vs HTTP/3

| 특성 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|--------|--------|
| **연결** | 순차 | 멀티플렉싱 | QUIC 기반 |
| **헤더** | 텍스트 | 압축 | 압축 |
| **속도** | 느림 | 빠름 | 매우 빠름 |
| **프로토콜** | TCP | TCP | UDP |

### HTTP/2 예시
```python
# 하나의 연결로 여러 요청 동시 처리
import httpx

async with httpx.AsyncClient(http2=True) as client:
    # 동시 요청
    responses = await asyncio.gather(
        client.get('https://example.com/api/users'),
        client.get('https://example.com/api/posts'),
        client.get('https://example.com/api/comments')
    )
    # → 하나의 TCP 연결로 처리
```

## 💡 CORS (Cross-Origin Resource Sharing)

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 모든 도메인 허용

# 또는 특정 도메인만
CORS(app, origins=[
    'https://frontend.example.com',
    'https://app.example.com'
])

@app.route('/api/data')
def get_data():
    # CORS 헤더 자동 추가
    return jsonify({'data': 'sensitive'})
```

## 💡 Keep-Alive

```python
import requests

# Session 사용 (연결 재사용)
session = requests.Session()

# 여러 요청이 같은 연결 사용
response1 = session.get('https://api.example.com/users')
response2 = session.get('https://api.example.com/posts')
response3 = session.get('https://api.example.com/comments')

# 연결 닫기
session.close()
```

## 💡 캐싱

### Cache-Control 헤더
```python
from flask import make_response

@app.route('/static/image.jpg')
def get_image():
    response = make_response(open('image.jpg', 'rb').read())
    
    # 1시간 캐싱
    response.headers['Cache-Control'] = 'public, max-age=3600'
    
    return response

@app.route('/api/realtime')
def get_realtime():
    """실시간 데이터 (캐싱 안 함)"""
    response = jsonify({'time': datetime.now()})
    response.headers['Cache-Control'] = 'no-cache, no-store'
    
    return response
```

### ETag
```python
from hashlib import md5

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = db.users.find_one({'id': user_id})
    
    # ETag 생성 (데이터 해시)
    etag = md5(json.dumps(user).encode()).hexdigest()
    
    # 클라이언트 ETag 확인
    if request.headers.get('If-None-Match') == etag:
        return '', 304  # Not Modified (캐시 사용)
    
    # 새 데이터 반환
    response = jsonify(user)
    response.headers['ETag'] = etag
    
    return response
```

## 🔗 관련 용어

- [[HTTPS]]: HTTP + SSL/TLS
- [[REST API]]: HTTP 기반 API
- [[WebSocket]]: 양방향 통신

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
