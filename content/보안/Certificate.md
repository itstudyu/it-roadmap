# Certificate (인증서)

## 📝 정의

Certificate(인증서, 디지털 인증서)는 **웹사이트의 신원을 증명하는 전자 문서**로, HTTPS 통신에 필수적입니다.

### 핵심 개념

- **무엇인가?**: 웹사이트 신원 증명서
- **왜 필요한가?**: 가짜 사이트와 구별
- **어떻게 작동하나?**: 인증 기관(CA)이 발급 및 보증

### 인증서가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 인증서 없는 웹사이트
사용자 → bank.com 접속
공격자 → 가짜 사이트 운영
→ 진짜인지 구별 불가
→ 피싱 위험! 😱
```

**인증서의 해결**:
```
✅ 신원 증명:
진짜 bank.com → 인증서 있음 (CA 발급)
가짜 사이트 → 인증서 없음 또는 경고
브라우저 → 🔒 표시 (안전)
→ 신뢰할 수 있음! ✅
```

**비유**:
- **인증서 없음** = 신분증 없는 사람
- **인증서** = 정부 발급 신분증

## 💡 인증서 구성 요소

### 인증서 내용
```
Subject: example.com
Issuer: Let's Encrypt Authority X3
Valid From: 2026-01-01
Valid To: 2026-04-01
Public Key: RSA 2048 bits
Signature: SHA256withRSA
```

### 인증서 체인
```
1. Root Certificate (신뢰할 수 있는 최상위)
   └─ 2. Intermediate Certificate (중간)
      └─ 3. Domain Certificate (웹사이트)
```

## 💡 인증서 발급

### Let's Encrypt (무료)
```bash
# Certbot 설치
sudo apt-get install certbot

# 인증서 발급
sudo certbot certonly --standalone -d example.com -d www.example.com

# 인증서 위치
# /etc/letsencrypt/live/example.com/
# - fullchain.pem (인증서 + 체인)
# - privkey.pem (개인키)

# 자동 갱신 (90일마다)
sudo certbot renew
```

### 수동 생성 (개발용)
```bash
# 개인키 생성
openssl genrsa -out key.pem 2048

# CSR (Certificate Signing Request) 생성
openssl req -new -key key.pem -out csr.pem

# 자체 서명 인증서 (Self-Signed)
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

## 💡 인증서 확인

### OpenSSL로 확인
```bash
# 웹사이트 인증서 확인
openssl s_client -connect example.com:443 -showcerts

# 인증서 파일 정보
openssl x509 -in cert.pem -text -noout

# 만료일 확인
openssl x509 -in cert.pem -noout -dates
```

### Python으로 확인
```python
import ssl
import socket
from datetime import datetime

def check_certificate(hostname):
    """인증서 정보 확인"""
    context = ssl.create_default_context()
    
    with socket.create_connection((hostname, 443)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert()
            
            # Subject (발급 대상)
            subject = dict(x[0] for x in cert['subject'])
            print(f"Subject: {subject['commonName']}")
            
            # Issuer (발급자)
            issuer = dict(x[0] for x in cert['issuer'])
            print(f"Issuer: {issuer['commonName']}")
            
            # 유효 기간
            not_before = cert['notBefore']
            not_after = cert['notAfter']
            print(f"Valid From: {not_before}")
            print(f"Valid To: {not_after}")
            
            # 만료까지 남은 일수
            expires = datetime.strptime(not_after, '%b %d %H:%M:%S %Y %Z')
            days_left = (expires - datetime.now()).days
            print(f"Days Left: {days_left}")
            
            if days_left < 30:
                print("⚠️ Certificate expires soon!")

check_certificate('google.com')
```

## 💡 인증서 유형

### 1. DV (Domain Validation)
```
검증: 도메인 소유 확인만
발급: 자동, 빠름 (몇 분)
비용: 무료~저렴
사용: 블로그, 개인 사이트
예: Let's Encrypt
```

### 2. OV (Organization Validation)
```
검증: 도메인 + 조직 확인
발급: 수동, 며칠
비용: 중간
사용: 기업 웹사이트
```

### 3. EV (Extended Validation)
```
검증: 도메인 + 조직 + 법인 확인
발급: 수동, 1-2주
비용: 비쌈
사용: 은행, 금융
표시: 주소창에 회사명 표시
```

### 4. Wildcard Certificate
```
단일 인증서로 모든 서브도메인 커버
*.example.com → 모든 서브도메인 적용
- www.example.com ✅
- api.example.com ✅
- app.example.com ✅
```

## 💡 인증서 설치

### Nginx
```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    # 인증서 파일
    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;
    
    # 중간 인증서 (선택)
    ssl_trusted_certificate /etc/ssl/certs/chain.pem;
}
```

### Apache
```apache
<VirtualHost *:443>
    ServerName example.com
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/cert.pem
    SSLCertificateKeyFile /etc/ssl/private/key.pem
    SSLCertificateChainFile /etc/ssl/certs/chain.pem
</VirtualHost>
```

### Node.js
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/ssl/private/key.pem'),
  cert: fs.readFileSync('/etc/ssl/certs/cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure HTTPS Server\n');
}).listen(443);
```

## 💡 인증서 갱신

### 자동 갱신 (Let's Encrypt)
```bash
# Cron 설정
sudo crontab -e

# 매일 새벽 3시에 갱신 시도
0 3 * * * certbot renew --quiet

# 갱신 후 Nginx 재시작
0 3 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

### 만료 알림
```python
import smtplib
from datetime import datetime, timedelta

def check_and_alert(hostname):
    """인증서 만료 30일 전 알림"""
    expires = get_certificate_expiry(hostname)
    days_left = (expires - datetime.now()).days
    
    if days_left < 30:
        send_email(
            to='admin@example.com',
            subject=f'Certificate expires in {days_left} days',
            body=f'Please renew certificate for {hostname}'
        )
```

## 💡 인증서 문제 해결

### 브라우저 경고
```
"Your connection is not private"
"NET::ERR_CERT_AUTHORITY_INVALID"

원인:
1. 자체 서명 인증서 (Self-Signed)
2. 만료된 인증서
3. 도메인 불일치
4. 중간 인증서 누락
```

### 문제 진단
```bash
# SSL Labs 테스트
https://www.ssllabs.com/ssltest/

# 인증서 체인 확인
openssl s_client -connect example.com:443 -showcerts | grep -A 1 "Verify return code"

# 중간 인증서 확인
curl -I https://example.com
```

## 💡 인증서 포맷

```
PEM (.pem, .crt, .cer)
- Base64 인코딩
- 텍스트 형식
- -----BEGIN CERTIFICATE-----

DER (.der)
- 바이너리 형식

PKCS#12 (.p12, .pfx)
- 인증서 + 개인키
- 비밀번호로 보호
```

### 포맷 변환
```bash
# PEM → DER
openssl x509 -in cert.pem -outform DER -out cert.der

# DER → PEM
openssl x509 -in cert.der -inform DER -out cert.pem

# PEM → PKCS#12
openssl pkcs12 -export -in cert.pem -inkey key.pem -out cert.p12
```

## 🔗 관련 용어

- [[HTTPS]]: 인증서 사용
- [[SSL/TLS]]: 인증서 기반 프로토콜
- [[PKI]]: 공개키 기반 구조

---
*카테고리: 보안*
*생성일: 2026-02-14*
