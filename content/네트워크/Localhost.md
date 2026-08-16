# Localhost (로컬호스트)

## 📝 정의

Localhost는 **자기 자신의 컴퓨터를 가리키는 특별한 호스트명**입니다. IP 주소 `127.0.0.1`로 매핑되며, 네트워크를 통하지 않고 자신의 컴퓨터 내에서 통신할 때 사용합니다.

### 핵심 개념

- **IP 주소**: 127.0.0.1 (IPv4), ::1 (IPv6)
- **용도**: 로컬 개발, 테스트
- **특징**: 외부 접근 불가, 빠름

## 💡 사용 예시

### 웹 개발

```python
# Flask 서버 실행
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from localhost!"

if __name__ == '__main__':
    # localhost:5000에서 실행
    app.run(host='localhost', port=5000)
    # 또는
    # app.run(host='127.0.0.1', port=5000)
```

**접속:**
```
브라우저에서:
- http://localhost:5000
- http://127.0.0.1:5000

→ 둘 다 같은 곳!
```

### 데이터베이스 연결

```python
import mysql.connector

# MySQL 로컬 연결
connection = mysql.connector.connect(
    host='localhost',  # 또는 '127.0.0.1'
    user='root',
    password='password',
    database='mydb'
)

cursor = connection.cursor()
cursor.execute("SELECT * FROM users")
```

### Node.js 서버

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from localhost!');
});

// localhost:3000에서 실행
app.listen(3000, 'localhost', () => {
    console.log('Server running on http://localhost:3000');
});
```

## 🔍 Localhost vs 0.0.0.0

```python
"""
차이점 이해하기
"""

# localhost (127.0.0.1)
app.run(host='localhost', port=5000)
# → 자기 컴퓨터에서만 접근 가능
# → 같은 네트워크의 다른 PC에서 접근 불가

# 0.0.0.0
app.run(host='0.0.0.0', port=5000)
# → 모든 네트워크 인터페이스에서 접근 가능
# → 같은 네트워크의 다른 PC에서도 접근 가능
# → 외부 IP로도 접근 가능
```

**테스트:**
```bash
# localhost로 실행
python app.py
# → 본인만 http://localhost:5000 접근 가능

# 0.0.0.0으로 실행
python app.py
# → 본인: http://localhost:5000
# → 다른 PC: http://192.168.0.10:5000 접근 가능
```

## 🎯 활용 사례

### 1. 로컬 개발 환경

```bash
# 프론트엔드 개발
npm run dev
# → http://localhost:3000

# 백엔드 API
python manage.py runserver
# → http://localhost:8000

# 데이터베이스
mysql -h localhost -u root -p
# → localhost MySQL 접속
```

### 2. 포트 충돌 확인

```bash
# macOS/Linux
lsof -i :3000
# → localhost:3000을 사용 중인 프로세스 확인

# Windows
netstat -ano | findstr :3000
```

### 3. 여러 서비스 동시 실행

```bash
# 동일 localhost, 다른 포트
프론트엔드: localhost:3000
백엔드 API: localhost:8000
데이터베이스: localhost:3306
Redis: localhost:6379

→ 포트만 다르면 동시 실행 가능!
```

## 🚨 주의사항

### 보안

```python
# ❌ 프로덕션에서 localhost 바인딩
app.run(host='localhost')
# → 외부에서 접근 불가
# → 서비스 불가능

# ✅ 프로덕션
app.run(host='0.0.0.0')  # 모든 인터페이스
# 또는
app.run(host='특정_IP')  # 특정 인터페이스만
```

### /etc/hosts 파일

```bash
# macOS/Linux: /etc/hosts
# Windows: C:\Windows\System32\drivers\etc\hosts

127.0.0.1   localhost
127.0.0.1   myapp.local
127.0.0.1   api.local

# 커스텀 도메인 설정 가능
# → http://myapp.local 로 접속 가능
```

## 📝 정리

**핵심:**
```
localhost = 127.0.0.1
→ 내 컴퓨터
→ 외부 접근 불가
→ 로컬 개발/테스트용
```

**vs 0.0.0.0:**
```
localhost: 내부만
0.0.0.0: 모든 네트워크
```

---
*카테고리: 네트워크*
