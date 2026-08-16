# Port (포트)

## 📝 정의

Port는 **컴퓨터에서 네트워크 통신을 위한 가상의 문**입니다. 0-65535번까지 있으며, 각 서비스는 고유한 포트 번호를 사용합니다.

### 핵심 개념

- **범위**: 0-65535 (총 65,536개)
- **Well-known ports**: 0-1023 (시스템 예약)
- **용도**: 서비스 구분

## 💡 주요 포트 번호

```python
well_known_ports = {
    20: "FTP Data",
    21: "FTP Control",
    22: "SSH",
    23: "Telnet",
    25: "SMTP (메일 전송)",
    53: "DNS",
    80: "HTTP",
    110: "POP3 (메일 수신)",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    5432: "PostgreSQL",
    6379: "Redis",
    27017: "MongoDB",
    3000: "React (개발)",
    8000: "Django (개발)",
    8080: "대체 HTTP",
    9000: "다양한 앱"
}
```

## 🎯 사용 예시

### 웹 서버 포트 설정

```python
from flask import Flask

app = Flask(__name__)

# 포트 5000에서 실행
app.run(port=5000)

# URL: http://localhost:5000
```

```javascript
// Express.js
const app = require('express')();

// 포트 3000에서 실행
app.listen(3000, () => {
    console.log('Server on port 3000');
});
```

### 포트 확인

```bash
# 사용 중인 포트 확인 (macOS/Linux)
lsof -i :8000
# 또는
netstat -an | grep 8000

# Windows
netstat -ano | findstr :8000
```

### 포트 포워딩

```bash
# SSH 터널링
ssh -L 3000:localhost:8000 user@remote
# → 로컬 3000 → 원격 8000으로 연결
```

## 🔍 포트 종류

### 1. Well-Known Ports (0-1023)

```
시스템 예약, 관리자 권한 필요

80: HTTP 웹 서버
443: HTTPS 보안 웹 서버
22: SSH 원격 접속
```

### 2. Registered Ports (1024-49151)

```
등록된 서비스용

3306: MySQL
5432: PostgreSQL
8080: 대체 웹 서버
```

### 3. Dynamic/Private Ports (49152-65535)

```
임시 사용, 클라이언트 포트
```

## 🚨 포트 충돌

```python
# 문제: 포트 이미 사용 중
app.run(port=3000)
# Error: Address already in use

# 해결 1: 다른 포트 사용
app.run(port=3001)

# 해결 2: 기존 프로세스 종료
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
# 프로세스 ID 확인 후
taskkill /PID <PID> /F
```

## 📝 정리

**핵심:**
```
Port = 네트워크 통신의 문 번호
→ IP:Port 조합으로 서비스 식별
→ 192.168.0.1:8000
```

**주요 포트:**
```
80: HTTP
443: HTTPS
22: SSH
3306: MySQL
```

---
*카테고리: 네트워크*
