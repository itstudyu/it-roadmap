# HTTPS (HTTP Secure)

## 📝 정의

HTTPS(HTTP Secure)는 **HTTP에 SSL/TLS 암호화를 추가한 보안 프로토콜**로, 안전한 웹 통신을 제공합니다.

### 핵심 개념

- **무엇인가?**: 암호화된 HTTP
- **왜 필요한가?**: HTTP는 평문 전송 → 도청 가능
- **어떻게 작동하나?**: SSL/TLS로 데이터 암호화

### HTTPS가 해결하는 문제

**문제 상황**:
```
😱 시나리오: HTTP 사용
사용자 → 로그인 (ID/PW)
→ 평문으로 전송
→ 중간자가 가로채기 가능
→ 비밀번호 유출! 😱
```

**HTTPS의 해결**:
```
✅ 암호화:
사용자 → 로그인 (ID/PW)
→ SSL/TLS로 암호화
→ 중간자가 가로채도 해독 불가
→ 안전! ✅
```

**비유**:
- **HTTP** = 엽서 (내용 다 보임)
- **HTTPS** = 봉인된 편지 (안전)

## 📊 HTTPS 동작 과정

```도해
흐름: HTTPS, 무슨 순서로 오가나
클라이언트 :: ClientHello (지원 암호화 방식)
서버 :: ServerHello (선택한 암호화 + 인증서)
클라이언트 :: 인증서 검증
클라이언트 :: PreMasterSecret (공개키로 암호화)
클라이언트 :: 암호화된 HTTP 요청
서버 :: 암호화된 HTTP 응답
```

## 💡 HTTP vs HTTPS 차이

| 항목 | HTTP | HTTPS |
|------|------|-------|
| **포트** | 80 | 443 |
| **암호화** | ❌ | ✅ |
| **인증서** | 불필요 | 필요 |
| **속도** | 빠름 | 약간 느림 |
| **SEO** | 불리 | 유리 |
| **브라우저 표시** | 안전하지 않음 | 🔒 자물쇠 |

## 💡 인증서 발급

### Let's Encrypt (무료)
```bash
# Certbot 설치 (Ubuntu)
sudo apt-get install certbot python3-certbot-nginx

# Nginx용 인증서 자동 발급
sudo certbot --nginx -d example.com -d www.example.com

# 자동 갱신 설정 (90일마다)
sudo certbot renew --dry-run
```

### 수동 인증서 생성 (개발용)
```bash
# 자체 서명 인증서 (Self-Signed)
openssl req -x509 -newkey rsa:4096 \
  -keyout key.pem \
  -out cert.pem \
  -days 365 \
  -nodes
```

## 💡 Nginx HTTPS 설정

```nginx
server {
    listen 80;
    server_name example.com;
    
    # HTTP → HTTPS 리다이렉션
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    # SSL 인증서
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    
    # HSTS (브라우저에게 항상 HTTPS 사용 지시)
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    location / {
        proxy_pass http://localhost:8000;
    }
}
```

## 💡 Python HTTPS 서버

### Flask with SSL
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Secure HTTPS'

if __name__ == '__main__':
    # HTTPS로 실행
    app.run(
        host='0.0.0.0',
        port=443,
        ssl_context=('cert.pem', 'key.pem')
    )
```

### HTTPS 요청
```python
import requests

# HTTPS 요청
response = requests.get('https://api.example.com/data')

# 인증서 검증 비활성화 (개발용만!)
response = requests.get(
    'https://localhost:443/data',
    verify=False  # 프로덕션에서는 절대 사용 금지!
)

# 사용자 정의 CA 인증서
response = requests.get(
    'https://internal.company.com/api',
    verify='/path/to/ca-bundle.crt'
)
```

## 💡 인증서 검증

### 브라우저 검증 과정
```
1. 인증서 만료일 확인
2. 도메인 일치 확인
3. 인증 기관(CA) 신뢰 확인
4. 인증서 폐기 여부 확인

→ 모두 통과 시 🔒 표시
→ 하나라도 실패 시 ⚠️ 경고
```

### Python으로 인증서 확인
```python
import ssl
import socket
from datetime import datetime

def check_certificate(hostname, port=443):
    """인증서 정보 확인"""
    context = ssl.create_default_context()
    
    with socket.create_connection((hostname, port)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert()
            
            # 만료일
            expires = datetime.strptime(
                cert['notAfter'],
                '%b %d %H:%M:%S %Y %Z'
            )
            
            days_left = (expires - datetime.now()).days
            
            print(f"Issued to: {cert['subject']}")
            print(f"Issued by: {cert['issuer']}")
            print(f"Expires: {expires}")
            print(f"Days left: {days_left}")
            
            if days_left < 30:
                print("⚠️ Certificate expires soon!")

# 사용
check_certificate('google.com')
```

## 💡 HSTS (HTTP Strict Transport Security)

```nginx
# Nginx 설정
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 의미:
# - max-age=31536000: 1년간 HTTPS만 사용
# - includeSubDomains: 모든 서브도메인 포함
# - preload: 브라우저 내장 HSTS 목록에 추가
```

### Python에서 HSTS 헤더 추가
```python
from flask import Flask, make_response

@app.after_request
def add_security_headers(response):
    """보안 헤더 자동 추가"""
    response.headers['Strict-Transport-Security'] = \
        'max-age=31536000; includeSubDomains'
    
    return response
```

## 💡 Mixed Content (혼합 콘텐츠)

```html
<!-- ❌ 위험: HTTPS 페이지에서 HTTP 리소스 -->
<img src="http://example.com/image.jpg">
<script src="http://example.com/script.js"></script>

<!-- ✅ 안전: HTTPS 리소스 -->
<img src="https://example.com/image.jpg">
<script src="https://example.com/script.js"></script>

<!-- ✅ 프로토콜 상대 URL -->
<img src="//example.com/image.jpg">
<!-- 현재 페이지 프로토콜 따름 -->
```

## 💡 SSL/TLS 버전

```
SSL 2.0 ❌ (취약)
SSL 3.0 ❌ (취약)
TLS 1.0 ❌ (레거시)
TLS 1.1 ❌ (레거시)
TLS 1.2 ✅ (안전)
TLS 1.3 ✅ (최신, 가장 안전)
```

### 최신 TLS만 허용
```nginx
ssl_protocols TLSv1.2 TLSv1.3;

# 약한 암호화 방식 제외
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
```

## 💡 성능 최적화

### HTTP/2 활성화
```nginx
# Nginx
listen 443 ssl http2;

# → 멀티플렉싱으로 성능 향상
```

### SSL Session 캐싱
```nginx
# SSL 핸드셰이크 재사용
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### OCSP Stapling
```nginx
# 인증서 상태 확인 최적화
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /path/to/chain.pem;
```

## 🔗 관련 용어

- [[SSL/TLS]]: HTTPS의 기반 기술
- [[인증서]]: HTTPS 필수 요소
- [[HTTP]]: 기본 프로토콜

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
