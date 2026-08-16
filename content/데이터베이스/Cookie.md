# Cookie (쿠키)

## 📝 정의

Cookie는 **브라우저에 저장되는 작은 데이터 파일**입니다. 사용자 정보를 기억합니다.

## 💡 사용 예시

```javascript
// JavaScript로 쿠키 설정
document.cookie = "username=John; expires=Fri, 31 Dec 2024 23:59:59 GMT";

// 쿠키 읽기
console.log(document.cookie);
```

```python
# Flask (Python)
from flask import make_response

@app.route('/login')
def login():
    resp = make_response("Logged in")
    resp.set_cookie('user_id', '123', max_age=3600)
    return resp

# 쿠키 읽기
from flask import request
user_id = request.cookies.get('user_id')
```

## 🎯 특징

```
- 크기: 최대 4KB
- 저장 위치: 브라우저
- 자동 전송: 매 요청마다
- 만료: 시간 설정 가능
```

## 📝 정리

```
Cookie = 브라우저 저장소
→ 로그인 유지
→ 장바구니
→ 사용자 설정
```

---
*카테고리: 데이터베이스*
