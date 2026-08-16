# SSH (Secure Shell)

## 📝 정의
**SSH (Secure Shell)**는 **네트워크를 통해 원격 컴퓨터에 안전하게 접속하고 명령을 실행하는 암호화된 프로토콜**입니다.

텔넷(Telnet)과 달리 모든 통신이 암호화되어 안전합니다.

### 한 줄 요약
> 암호화된 원격 접속 프로토콜 (TCP 기반)

### 비유
- 🔐 **비밀 통로**: 안전하게 다른 건물(서버)로 이동해서 작업
- 📞 **암호 전화**: 도청 불가능한 암호화된 통화
- 🚪 **보안 출입구**: 지문/카드로 안전하게 입장

## 🎯 핵심 개념

### 1. 암호화 통신 (Encrypted Communication)
모든 데이터가 암호화되어 전송됩니다.

```
Telnet (암호화 없음):
Client: "password123" → Network (평문) → Server
       ⚠️ 해커가 네트워크에서 가로채면 그대로 노출!

SSH (암호화):
Client: "password123" → 암호화 → Network (암호문) → 복호화 → Server
                       "a8f3k2d..."
       ✅ 해커가 가로채도 해독 불가능
```

### 2. 공개키 인증 (Public Key Authentication)
비밀번호 대신 키 쌍으로 인증합니다.

```
사용자가 가지는 것:
- Private Key (비밀키): 🔑 절대 공개하면 안 됨
- Public Key (공개키): 🔓 서버에 등록

로그인 과정:
1. Client: "나 홍길동이야" (공개키로 서명)
2. Server: 공개키로 검증 → "맞네, 들어와"
```

### 3. 포트 포워딩 (Port Forwarding)
SSH 터널을 통해 다른 서비스를 안전하게 사용합니다.

```
로컬 포트 포워딩:
[내 컴퓨터:3306] → SSH Tunnel → [서버:3306 MySQL]

원격 포트 포워딩:
[서버:8080] → SSH Tunnel → [내 컴퓨터:8080]

동적 포트 포워딩:
[브라우저] → SOCKS Proxy → SSH Tunnel → [인터넷]
```

### 4. 다중 기능 (Multiple Features)
SSH는 원격 접속뿐만 아니라 다양한 기능을 제공합니다.

```bash
# 원격 명령 실행
ssh user@server 'ls -la'

# 파일 전송 (SCP)
scp file.txt user@server:/path/

# 파일 전송 (SFTP)
sftp user@server

# X11 포워딩 (GUI 프로그램 실행)
ssh -X user@server
```

### 5. 연결 유지 (Keep-Alive)
네트워크 장비가 유휴 연결을 끊는 것을 방지합니다.

```bash
# 클라이언트 설정 (~/.ssh/config)
Host *
  ServerAliveInterval 60
  ServerAliveCountMax 3

# 60초마다 ping 전송
# 3번 응답 없으면 연결 종료
```

## ⚠️ 해결하는 문제

### 문제 1: 텔넷의 보안 취약점

**문제 상황 (Telnet)**:
```bash
# Telnet은 평문 전송
$ telnet server.com 23
login: admin
password: secret123  # ⚠️ 평문으로 네트워크 전송!
```

해커가 네트워크 패킷을 캡처하면:
```
Wireshark 캡처 결과:
username: admin
password: secret123
```

**SSH 해결**:
```bash
# SSH는 암호화
$ ssh admin@server.com
password: secret123  # ✅ 암호화되어 전송

Wireshark 캡처 결과:
암호화된 데이터: 3a8f2k9d1m4p7q...
→ 해독 불가능
```

### 문제 2: 비밀번호 관리의 어려움

**문제 상황**:
```
10개 서버 관리
→ 10개 비밀번호 기억
→ 비밀번호 변경 시 모두 업데이트
→ 비밀번호 노트에 적어둠 (보안 위험!)
```

**SSH 키 인증 해결**:
```bash
# 1. 한 번만 키 생성
ssh-keygen -t ed25519

# 2. 공개키를 모든 서버에 복사
ssh-copy-id user@server1.com
ssh-copy-id user@server2.com
# ...

# 3. 비밀번호 없이 로그인
ssh user@server1.com  # 즉시 접속!
ssh user@server2.com  # 즉시 접속!
```

### 문제 3: 방화벽으로 차단된 서비스 접근

**문제 상황**:
```
회사 내부 MySQL 서버 (포트 3306)
→ 외부에서 직접 접근 불가 (방화벽 차단)
→ 개발자가 집에서 작업 못 함
```

**SSH 터널링 해결**:
```bash
# SSH 터널 생성
ssh -L 3306:localhost:3306 user@company-server.com

# 이제 localhost:3306으로 접속하면
# 회사 내부 MySQL 서버에 연결됨
mysql -h localhost -P 3306 -u dbuser -p
```

### 문제 4: FTP의 보안 취약점

**문제 상황**:
```bash
# FTP는 평문 전송
ftp server.com
username: admin
password: secret  # ⚠️ 평문 전송
put sensitive-data.txt  # ⚠️ 파일도 평문 전송
```

**SFTP (SSH FTP) 해결**:
```bash
# SFTP는 SSH 터널 사용
sftp user@server.com
password: secret  # ✅ 암호화
put sensitive-data.txt  # ✅ 파일도 암호화
```

## ⚙️ 작동 원리

### 전체 연결 과정


### 공개키 인증 상세

```도해
흐름: SSH, 무슨 순서로 오가나
Client :: 개인키 생성 (id_rsa)
Client :: 공개키 생성 (id_rsa.pub)
Client :: 공개키 전송 (ssh-copy-id)
Server :: ~/.ssh/authorized_keys에 저장
Client :: 나 홍길동이야
Server :: 이 랜덤 데이터에 서명해" (Challenge)
Client :: 개인키로 서명 생성
Client :: 서명 전송
Server :: 공개키로 서명 검증
Server :: 인증 성공!
```

## 💻 코드 구현

### 예시 1: 기본 SSH 접속

```bash
# 기본 접속
ssh username@hostname

# 포트 지정
ssh -p 2222 username@hostname

# 특정 키 파일 사용
ssh -i ~/.ssh/my_key username@hostname

# 명령 실행 후 종료
ssh username@hostname 'uptime && df -h'

# X11 포워딩 (GUI 프로그램 실행)
ssh -X username@hostname
firefox  # 원격 서버의 Firefox가 내 화면에 표시됨
```

### 예시 2: SSH 키 생성 및 등록

```bash
# 1. SSH 키 생성 (ED25519 권장)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 또는 RSA (4096비트)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 출력:
# Generating public/private ed25519 key pair.
# Enter file in which to save the key: ~/.ssh/id_ed25519
# Enter passphrase: [비밀번호 입력 - 선택사항]

# 2. 공개키를 서버에 복사
ssh-copy-id username@hostname

# 또는 수동으로 복사
cat ~/.ssh/id_ed25519.pub | ssh username@hostname \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 3. 권한 설정 (중요!)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys  # 서버에서

# 4. 비밀번호 없이 로그인
ssh username@hostname  # 즉시 접속!
```

### 예시 3: SSH Config 파일

```bash
# ~/.ssh/config
# 편리한 SSH 설정 파일

# 개발 서버
Host dev
    HostName dev.example.com
    User developer
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60

# 프로덕션 서버
Host prod
    HostName prod.example.com
    User admin
    Port 2222
    IdentityFile ~/.ssh/prod_key
    ForwardAgent yes

# 회사 서버 (점프 호스트 사용)
Host company
    HostName internal.company.com
    User myname
    ProxyJump bastion.company.com

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_key

# 사용:
ssh dev      # dev.example.com에 접속
ssh prod     # prod.example.com에 접속
ssh company  # bastion을 거쳐 internal에 접속
```

### 예시 4: 포트 포워딩

```bash
# 로컬 포트 포워딩
# localhost:8080 → 서버:80
ssh -L 8080:localhost:80 user@server
# 이제 브라우저에서 http://localhost:8080 접속
# → 서버의 80번 포트로 연결됨

# 원격 MySQL 접근
ssh -L 3306:localhost:3306 user@db-server
mysql -h localhost -P 3306 -u dbuser -p

# 동적 포트 포워딩 (SOCKS 프록시)
ssh -D 1080 user@server
# 브라우저 프록시 설정: localhost:1080
# → 모든 트래픽이 서버를 통해 나감

# 원격 포트 포워딩
# 서버의 8080 → 내 컴퓨터의 3000
ssh -R 8080:localhost:3000 user@server
# 서버에서 localhost:8080 접속
# → 내 컴퓨터의 3000번 포트로 연결됨

# 백그라운드 실행
ssh -fNL 8080:localhost:80 user@server
# -f: 백그라운드
# -N: 명령 실행 안 함
# -L: 로컬 포트 포워딩
```

### 예시 5: SFTP 파일 전송

```bash
# SFTP 접속
sftp user@hostname

# SFTP 명령어
sftp> ls                    # 원격 디렉터리 목록
sftp> lls                   # 로컬 디렉터리 목록
sftp> pwd                   # 원격 현재 디렉터리
sftp> lpwd                  # 로컬 현재 디렉터리

sftp> get file.txt          # 다운로드
sftp> put file.txt          # 업로드
sftp> get -r folder/        # 폴더 다운로드
sftp> put -r folder/        # 폴더 업로드

sftp> mkdir backup          # 원격 디렉터리 생성
sftp> rm file.txt           # 원격 파일 삭제
sftp> bye                   # 종료

# SCP (간단한 파일 복사)
scp file.txt user@host:/path/
scp user@host:/path/file.txt .
scp -r folder/ user@host:/path/

# rsync over SSH (더 효율적)
rsync -avz -e ssh folder/ user@host:/path/
# -a: 아카이브 모드
# -v: 상세 출력
# -z: 압축
```

### 예시 6: SSH 터널 자동화 스크립트

```bash
#!/bin/bash
# ssh-tunnel.sh

# SSH 터널 자동 생성 및 유지

REMOTE_HOST="user@server.com"
LOCAL_PORT=3306
REMOTE_PORT=3306

while true; do
    echo "Creating SSH tunnel..."

    ssh -N -L ${LOCAL_PORT}:localhost:${REMOTE_PORT} ${REMOTE_HOST}

    # 연결이 끊어지면 재시도
    echo "Tunnel disconnected. Retrying in 5 seconds..."
    sleep 5
done
```

### 예시 7: SSH Agent (키 관리)

```bash
# SSH Agent 시작
eval $(ssh-agent -s)

# 키 추가
ssh-add ~/.ssh/id_ed25519

# 추가된 키 목록
ssh-add -l

# 모든 키 삭제
ssh-add -D

# Agent Forwarding (점프 호스트)
ssh -A user@bastion
# bastion에서 다시 SSH 접속 시 내 키 사용 가능
ssh internal-server
```

## 🔄 P3 프로젝트 적용 사례

### 사례 1: 개발 서버 안전한 접속

**Before (비밀번호 로그인)**:
```bash
# 매번 비밀번호 입력
ssh dev@dev-server.com
Password: ********

# 문제점:
# - 비밀번호 타이핑 귀찮음
# - 비밀번호 노출 위험
# - Brute force 공격 취약
```

**After (SSH 키 인증)**:
```bash
# 1. 한 번만 키 생성 및 등록
ssh-keygen -t ed25519
ssh-copy-id dev@dev-server.com

# 2. 즉시 접속
ssh dev@dev-server.com  # 비밀번호 없이 즉시!

# 3. Config 파일로 더 간단하게
# ~/.ssh/config
Host dev
    HostName dev-server.com
    User dev

ssh dev  # 이제 이것만 입력!
```

**결과**:
- 로그인 시간: 10초 → 1초
- Brute force 공격 차단 (키 인증만 허용)
- 개발자 만족도 향상

### 사례 2: 프로덕션 DB 안전한 접근

**Before (직접 접근)**:
```
[개발자 컴퓨터] → 인터넷 → [프로덕션 DB]
⚠️ 문제:
- DB 포트(3306)를 인터넷에 오픈
- 보안 위험 극대화
- DDoS 공격 표적
```

**After (SSH 터널)**:
```bash
# SSH 터널 생성
ssh -L 3306:localhost:3306 user@bastion-server.com

# 로컬호스트로 안전하게 접속
mysql -h localhost -P 3306 -u dbuser -p

[개발자] → localhost:3306 → SSH Tunnel → [Bastion] → [DB]
✅ 장점:
- DB 포트는 내부망에서만 접근 가능
- 모든 트래픽 암호화
- Bastion 서버에서 접근 로그 관리
```

**결과**:
- 보안 사고 0건 (이전 연간 2-3건)
- 감사 통과
- DB 포트를 인터넷에서 완전 차단

### 사례 3: 자동화 배포 스크립트

```bash
#!/bin/bash
# deploy.sh

# 여러 서버에 동시 배포

SERVERS=(
    "prod1.example.com"
    "prod2.example.com"
    "prod3.example.com"
)

# 빌드
npm run build

# 모든 서버에 배포
for server in "${SERVERS[@]}"; do
    echo "Deploying to $server..."

    # 파일 전송
    scp -r dist/ user@$server:/var/www/app/

    # 서비스 재시작
    ssh user@$server 'sudo systemctl restart nginx'

    echo "$server deployment completed"
done

echo "All deployments completed!"
```

**결과**:
- 배포 시간: 30분 → 3분
- 휴먼 에러 감소
- 3개 서버 동시 배포 가능

### 사례 4: 로그 실시간 모니터링

```bash
# 여러 서버의 로그를 동시에 모니터링

# Terminal 1
ssh prod1 'tail -f /var/log/app.log'

# Terminal 2
ssh prod2 'tail -f /var/log/app.log'

# 또는 한 번에
for server in prod1 prod2 prod3; do
    ssh $server 'tail -f /var/log/app.log' &
done
```

**결과**:
- 장애 발견 시간: 10분 → 1분
- 실시간 디버깅 가능

## 📊 SSH vs Telnet vs RDP

| 구분 | SSH | Telnet | RDP |
|------|-----|--------|-----|
| **암호화** | ✅ 예 | ❌ 아니오 | ✅ 예 |
| **포트** | 22 | 23 | 3389 |
| **인증** | 키/비밀번호 | 비밀번호 | 비밀번호 |
| **GUI** | X11 포워딩 | 없음 | ✅ 원격 데스크톱 |
| **파일 전송** | SFTP, SCP | 없음 | 드라이브 공유 |
| **플랫폼** | Linux, Mac, Windows | 모든 플랫폼 | Windows |
| **용도** | 서버 관리 | 레거시 장비 | Windows 원격 제어 |
| **보안** | 매우 높음 | 매우 낮음 | 높음 |

## ⚠️ 보안 모범 사례

### 1. 서버 설정 강화

```bash
# /etc/ssh/sshd_config

# 비밀번호 로그인 비활성화
PasswordAuthentication no

# 루트 로그인 비활성화
PermitRootLogin no

# 포트 변경 (선택사항)
Port 2222

# 특정 사용자만 허용
AllowUsers developer admin

# 프로토콜 버전 2만 사용
Protocol 2

# 재시작
sudo systemctl restart sshd
```

### 2. 키 파일 권한

```bash
# 반드시 지켜야 하는 권한
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa           # 개인키
chmod 644 ~/.ssh/id_rsa.pub       # 공개키
chmod 600 ~/.ssh/authorized_keys  # 인증 키 목록
chmod 600 ~/.ssh/config           # 설정 파일

# 틀린 권한이면 SSH가 거부함
```

### 3. Fail2Ban 설정

```bash
# SSH Brute Force 공격 방어
sudo apt install fail2ban

# /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

# 5번 실패하면 1시간 차단
```

### 4. 2단계 인증 (2FA)

```bash
# Google Authenticator 설치
sudo apt install libpam-google-authenticator

# 설정
google-authenticator

# /etc/pam.d/sshd
auth required pam_google_authenticator.so

# /etc/ssh/sshd_config
ChallengeResponseAuthentication yes
```

## 🔗 관련 용어
- [[Telnet]]: SSH의 이전 프로토콜 (암호화 없음)
- [[TCP]]: SSH가 사용하는 전송 프로토콜
- [[포트 포워딩]]: SSH 터널링 기술
- [[공개키 암호화]]: SSH 인증 방식
- [[SFTP]]: SSH 기반 파일 전송 프로토콜
- [[SCP]]: SSH 기반 파일 복사 명령어
- [[VPN]]: SSH와 비슷한 보안 터널링

---
*카테고리: 보안*
