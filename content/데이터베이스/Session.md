# Session (세션)

## 📝 정의

Session은 **서버에 저장되는 사용자 상태 정보**입니다. 쿠키보다 안전합니다.

## 💡 작동 원리

```
1. 사용자 로그인
2. 서버가 세션 생성 (서버 메모리/DB)
3. 세션 ID를 쿠키로 브라우저에 전달
4. 이후 요청 시 세션 ID로 사용자 식별
```

## 🎯 Python 예시

```python
# Flask
from flask import session

app.secret_key = 'your-secret-key'

@app.route('/login', methods=['POST'])
def login():
    session['user_id'] = 123
    session['username'] = 'John'
    return "Logged in"

@app.route('/profile')
def profile():
    user_id = session.get('user_id')
    if user_id:
        return f"User: {user_id}"
    return "Not logged in"

@app.route('/logout')
def logout():
    session.clear()
    return "Logged out"
```

## 🔍 Cookie vs Session

```python
comparison = {
    "Cookie": {
        "저장 위치": "브라우저",
        "보안": "낮음 (사용자가 볼 수 있음)",
        "크기": "4KB 제한",
        "용도": "간단한 데이터"
    },
    "Session": {
        "저장 위치": "서버",
        "보안": "높음 (서버에만 있음)",
        "크기": "제한 없음",
        "용도": "민감한 데이터"
    }
}
```

## 📝 정리

```
Session = 서버 저장소
→ 로그인 상태
→ 장바구니
→ Cookie보다 안전
```

---
*카테고리: 데이터베이스*
