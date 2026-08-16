# REST (Representational State Transfer)

## 📝 정의
REST는 **웹 API를 설계하는 아키텍처 스타일**입니다. HTTP를 활용하여 자원을 다루는 표준화된 방법입니다.

### 핵심 개념
- HTTP 메서드: GET, POST, PUT, DELETE
- 자원(Resource) 중심: URL로 자원 표현
- Stateless: 서버가 상태 저장 안 함

## 💡 REST API 예시

```
GET    /users         # 사용자 목록 조회
GET    /users/123     # 특정 사용자 조회
POST   /users         # 새 사용자 생성
PUT    /users/123     # 사용자 수정
DELETE /users/123     # 사용자 삭제
```

```python
import requests

# GET 요청
response = requests.get('https://api.example.com/users/123')
user = response.json()

# POST 요청
new_user = {'name': 'Alice', 'email': 'alice@example.com'}
response = requests.post('https://api.example.com/users', json=new_user)
```

## 🎯 REST 원칙

1. **자원 식별**: URL로 자원 표현
2. **HTTP 메서드**: 동작 표현
3. **Stateless**: 각 요청 독립적
4. **JSON/XML**: 데이터 형식

## 🔗 관련 용어
- [[HTTP]]: REST의 기반
- [[JSON]]: REST API 데이터 형식

---
*카테고리: 웹개발*
