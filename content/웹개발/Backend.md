# Backend (백엔드)

## 📝 정의
Backend는 **서버에서 실행되는 부분**입니다. 데이터 처리, 비즈니스 로직, 데이터베이스 관리를 담당합니다.

### 핵심 역할
- 데이터베이스 관리
- API 제공
- 비즈니스 로직 처리
- 인증/보안

## 💡 예시

```python
# Flask API
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = database.get_user(user_id)
    return jsonify(user)

if __name__ == '__main__':
    app.run()
```

```javascript
// Node.js + Express
const express = require('express');
const app = express();

app.get('/api/users/:id', (req, res) => {
    const user = database.getUser(req.params.id);
    res.json(user);
});

app.listen(3000);
```

## 🎯 주요 기술
- 언어: Python, Node.js, Java, Go
- 프레임워크: Django, Express, Spring
- 데이터베이스: MySQL, PostgreSQL, MongoDB

## 🔗 관련 용어
- [[Frontend]]: 클라이언트 측
- [[REST]]: API 설계
- [[Database]]: 데이터 저장

---
*카테고리: 웹개발*
