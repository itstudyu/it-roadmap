# JWT (JSON Web Token)

## 📝 정의

JWT는 **사용자 인증 정보를 JSON 형태로 안전하게 전달하는 토큰**입니다.

## 💡 구조

```
Header.Payload.Signature

예시:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoiSm9obiJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## 🎯 Python 예시

```python
import jwt

# JWT 생성
payload = {'user_id': 123, 'name': 'John'}
secret = 'my-secret-key'

token = jwt.encode(payload, secret, algorithm='HS256')
print(f"JWT: {token}")

# JWT 검증
decoded = jwt.decode(token, secret, algorithms=['HS256'])
print(f"User: {decoded}")  # {'user_id': 123, 'name': 'John'}
```

## 📝 정리

```
JWT = 자체 포함 토큰
→ 서버에 세션 불필요
→ stateless
→ API 인증에 많이 사용
```

---
*카테고리: 보안*
