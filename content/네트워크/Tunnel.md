# Tunnel (터널링)

## 📝 정의

Tunnel은 **한 네트워크 프로토콜을 다른 프로토콜 안에 캡슐화하여 전송하는 기술**입니다. 마치 터널을 통과하듯 데이터를 안전하게 전송합니다.

### 핵심 개념

- **역할**: 안전한 통신 경로 생성
- **방식**: 데이터 캡슐화
- **용도**: 보안, 우회, 연결

## 💡 SSH Tunnel

### Local Port Forwarding

```bash
# 로컬 포트를 원격 서버로 포워딩
ssh -L [로컬포트]:localhost:[원격포트] user@server

# 예시: 로컬 3000 → 원격 8000
ssh -L 3000:localhost:8000 user@example.com

# 사용
# 브라우저에서 localhost:3000 접속
# → 원격 서버의 8000 포트로 연결됨
```

**활용 예시:**
```bash
# 원격 데이터베이스 접근
ssh -L 3306:localhost:3306 user@db-server.com

# 이제 로컬에서
mysql -h localhost -P 3306 -u root -p
# → 원격 DB에 안전하게 접속
```

### Remote Port Forwarding

```bash
# 원격 포트를 로컬로 포워딩
ssh -R [원격포트]:localhost:[로컬포트] user@server

# 예시: 로컬 웹서버를 외부에 노출
ssh -R 8080:localhost:3000 user@public-server.com

# → public-server.com:8080으로 접속하면
#   로컬 3000 포트로 연결됨
```

### Dynamic Port Forwarding (SOCKS Proxy)

```bash
# SOCKS 프록시 생성
ssh -D 1080 user@server.com

# 브라우저 설정:
# SOCKS5 프록시: localhost:1080
# → 모든 트래픽이 서버를 통해 나감
```

## 🎯 VPN Tunnel

```
Client ←[암호화 터널]→ VPN Server → Internet

1. 데이터 암호화
2. VPN 서버로 전송
3. VPN 서버에서 복호화
4. 목적지로 전달
```

## 🔍 터널링 프로토콜

### 1. SSH Tunnel

```python
"""
SSH 터널을 통한 데이터베이스 연결
"""

from sshtunnel import SSHTunnelForwarder
import mysql.connector

# SSH 터널 생성
tunnel = SSHTunnelForwarder(
    ('ssh-server.com', 22),
    ssh_username='user',
    ssh_password='password',
    remote_bind_address=('localhost', 3306)
)

tunnel.start()

# 터널을 통해 DB 연결
connection = mysql.connector.connect(
    host='localhost',
    port=tunnel.local_bind_port,
    user='dbuser',
    password='dbpass',
    database='mydb'
)

# 작업 수행
cursor = connection.cursor()
cursor.execute("SELECT * FROM users")

# 종료
connection.close()
tunnel.stop()
```

### 2. HTTP Tunnel

```bash
# HTTP CONNECT 메서드 사용
# 프록시를 통한 HTTPS 터널링

curl -x proxy-server:8080 https://api.example.com
```

### 3. WebSocket Tunnel

```javascript
// WebSocket을 통한 터널링
const WebSocket = require('ws');

const ws = new WebSocket('wss://tunnel-server.com');

ws.on('open', () => {
    // 터널을 통해 데이터 전송
    ws.send('tunneled data');
});
```

## 🚨 사용 사례

### 1. 방화벽 우회

```
회사 방화벽 → 특정 포트만 허용 (22)
SSH 터널 → 모든 트래픽을 22번 포트로
→ 방화벽 통과!
```

### 2. 안전한 원격 접속

```bash
# 원격 서버의 내부 서비스 접근
ssh -L 5432:db.internal:5432 user@jump-server.com

# 로컬에서
psql -h localhost -p 5432
# → 내부 DB 안전하게 접근
```

### 3. 개발 환경 노출

```bash
# 로컬 개발 서버를 외부에 임시 공개
# ngrok 등의 도구 사용
ngrok http 3000

# → https://random-id.ngrok.io
#   전 세계 어디서든 접속 가능
```

## 💻 실전 예시

### ngrok (개발용 터널)

```bash
# 설치
brew install ngrok  # macOS

# 로컬 서버 터널링
ngrok http 3000

# 출력:
# Forwarding: https://abc123.ngrok.io → localhost:3000
# → 외부에서 접속 가능!
```

### autossh (지속적 터널)

```bash
# SSH 터널을 자동으로 재연결
autossh -M 0 -L 3306:localhost:3306 user@server.com

# -M 0: 모니터링 포트 비활성화
# 연결 끊김 시 자동 재연결
```

## 📝 정리

**핵심:**
```
Tunnel = 프로토콜 안에 프로토콜
→ 안전한 통신 경로
→ 방화벽 우회
→ 암호화 전송
```

**SSH Tunnel:**
```
Local: -L (로컬→원격)
Remote: -R (원격→로컬)
Dynamic: -D (SOCKS)
```

**활용:**
```
✅ 안전한 DB 접근
✅ 방화벽 우회
✅ 개발 서버 공유
✅ VPN 구축
```

---
*카테고리: 네트워크*
