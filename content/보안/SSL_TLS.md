# SSL/TLS

## 📝 정의

SSL/TLS(Secure Sockets Layer / Transport Layer Security)는 **인터넷 통신을 암호화하는 보안 프로토콜**입니다. HTTPS의 "S"가 바로 SSL/TLS를 의미하며, 웹사이트와 브라우저 간 데이터를 안전하게 전송합니다.

### 핵심 개념

- **무엇인가?**: 인터넷 데이터를 암호화하여 안전하게 전송하는 기술
- **왜 필요한가?**: 인터넷은 도청 가능, 비밀번호/카드번호 등 민감 정보 보호 필요
- **어떻게 작동하나?**: 암호화 키 교환 → 데이터 암호화 → 안전한 통신

### SSL/TLS가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: HTTP로 로그인
사용자: 비밀번호 "mypassword123" 입력
→ 네트워크를 통해 평문으로 전송
→ 중간에 누군가 패킷 캡처
→ 비밀번호 탈취! 😱

😱 시나리오 2: 카페 Wi-Fi에서 쇼핑
카드번호 입력 → HTTP로 전송
→ 같은 Wi-Fi 사용자가 스니핑
→ 카드번호 도난
→ 금융 사기! 😱

😱 시나리오 3: 중간자 공격
해커가 중간에 가짜 서버 설치
→ 사용자 ↔ 해커 ↔ 실제 서버
→ 모든 데이터 도청/변조
→ 피싱 사이트로 유도! 😱
```

**SSL/TLS의 해결**:
```
✅ 시나리오 1 (암호화):
비밀번호 입력 → SSL/TLS로 암호화
→ "a7f3b9c2..." (암호문)
→ 도청해도 해독 불가능
→ 안전! ✅

✅ 시나리오 2 (HTTPS):
카드번호 → HTTPS로 전송
→ 완전히 암호화
→ Wi-Fi 도청해도 무용지물
→ 보안 유지! ✅

✅ 시나리오 3 (인증서 검증):
웹사이트 인증서 확인
→ "이 사이트는 진짜 은행입니다"
→ 가짜 사이트는 인증서 없음
→ 피싱 차단! ✅
```

**비유**:
- **HTTP (SSL/TLS 없음)** = 엽서 (누구나 읽을 수 있음)
- **HTTPS (SSL/TLS 있음)** = 봉인된 편지 (받는 사람만 읽을 수 있음)

## 📊 SSL/TLS 동작 원리

```도해
흐름: SSL/TLS, 무슨 순서로 오가나
브라우저 :: Client Hello (지원하는 암호화 방식)
웹 서버 :: Server Hello (선택한 암호화 방식)
웹 서버 :: 인증서 전송
브라우저 :: 인증서 검증 (CA 확인)
브라우저 :: 임시 키 생성
브라우저 :: 임시 키 전송 (서버 공개키로 암호화)
웹 서버 :: 임시 키 복호화 (서버 개인키 사용)
브라우저 :: 암호화된 데이터
웹 서버 :: 암호화된 응답
```

## 💡 SSL/TLS 핵심 개념

### 1. 암호화 (Encryption)

**대칭키 암호화**:
```python
# 빠르지만 키 공유 문제
key = "secret123"

# 암호화
encrypted = AES_encrypt("비밀번호", key)
# → "a7f3b9c2..."

# 복호화
decrypted = AES_decrypt(encrypted, key)
# → "비밀번호"
```

**비대칭키 암호화** (RSA):
```python
# 느리지만 키 공유 안전
public_key, private_key = generate_keypair()

# 암호화 (공개키 사용)
encrypted = RSA_encrypt("비밀번호", public_key)

# 복호화 (개인키만 가능)
decrypted = RSA_decrypt(encrypted, private_key)
# → "비밀번호"
```

**SSL/TLS의 하이브리드 방식**:
```
1. 비대칭키로 세션 키 교환 (안전)
2. 세션 키로 실제 데이터 암호화 (빠름)
→ 보안 + 성능 모두 확보!
```

### 2. 인증서 (Certificate)

```
인증서 구조:
┌─────────────────────────────┐
│ 웹사이트: example.com       │
│ 발급 대상: Example Inc.     │
│ 발급 기관: Let's Encrypt    │ ← CA (인증 기관)
│ 유효 기간: 2024-01-01 ~     │
│            2025-01-01        │
│ 공개키: AAABBB...           │
│ 서명: XXX... (CA의 개인키)  │
└─────────────────────────────┘
```

**인증서 검증 과정**:
```python
def verify_certificate(cert):
    """인증서 검증"""

    # 1. 유효 기간 확인
    if not (cert.start_date <= now() <= cert.end_date):
        return False, "만료된 인증서"

    # 2. 도메인 일치 확인
    if cert.domain != current_url:
        return False, "도메인 불일치"

    # 3. CA 서명 확인
    if not verify_ca_signature(cert, ca_public_key):
        return False, "신뢰할 수 없는 인증서"

    return True, "✅ 신뢰할 수 있는 사이트"
```

### 3. TLS 버전

| 버전 | 출시 | 상태 | 비고 |
|------|------|------|------|
| SSL 2.0 | 1995 | ❌ 폐기 | 심각한 보안 취약점 |
| SSL 3.0 | 1996 | ❌ 폐기 | POODLE 공격 취약 |
| TLS 1.0 | 1999 | ❌ 폐기 | 비권장 |
| TLS 1.1 | 2006 | ❌ 폐기 | 비권장 |
| **TLS 1.2** | 2008 | ✅ 사용 | 현재 표준 |
| **TLS 1.3** | 2018 | ✅ 권장 | 최신, 더 빠름 |

**TLS 1.3의 개선점**:
```
1. 더 빠른 연결 (1-RTT)
2. 더 강력한 암호화
3. 불필요한 암호화 방식 제거
4. Forward Secrecy 강화
```

## 🎯 HTTPS 구현

### 1. Let's Encrypt로 무료 인증서 발급

```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# 인증서 발급 (자동으로 Nginx 설정)
sudo certbot --nginx -d example.com -d www.example.com

# 인증서 자동 갱신 (90일마다)
sudo certbot renew --dry-run
```

### 2. Nginx HTTPS 설정

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL/TLS 설정
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # TLS 1.2, 1.3만 허용
    ssl_protocols TLSv1.2 TLSv1.3;

    # 강력한 암호화 방식만 사용
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;

    # HSTS (브라우저가 항상 HTTPS 사용하도록)
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://localhost:3000;
    }
}

# HTTP를 HTTPS로 리다이렉트
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Python에서 HTTPS 요청

```python
import requests

# HTTPS 요청 (인증서 자동 검증)
response = requests.get('https://example.com')

# 인증서 검증 결과
print(f"Status: {response.status_code}")
print(f"SSL Verified: {response.url.startswith('https')}")

# 인증서 정보 확인
import ssl
import socket

context = ssl.create_default_context()
with socket.create_connection(('example.com', 443)) as sock:
    with context.wrap_socket(sock, server_hostname='example.com') as ssock:
        cert = ssock.getpeercert()
        print(f"Subject: {cert['subject']}")
        print(f"Issuer: {cert['issuer']}")
        print(f"Version: {cert['version']}")
```

## 🔒 SSL/TLS 보안 Best Practices

### 1. 최신 TLS 버전 사용

```nginx
# ✅ 좋은 예
ssl_protocols TLSv1.2 TLSv1.3;

# ❌ 나쁜 예
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;  # 취약한 버전 포함
```

### 2. 강력한 암호화 방식

```nginx
# ✅ 권장 암호화 방식
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305';

# 서버가 암호화 방식 우선 선택
ssl_prefer_server_ciphers on;
```

### 3. HSTS (HTTP Strict Transport Security)

```nginx
# 1년간 HTTPS만 사용하도록 강제
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 4. 정기적인 인증서 갱신

```bash
# Cron으로 자동 갱신 (매일 오전 2시)
0 2 * * * certbot renew --quiet
```

## 📊 HTTP vs HTTPS

| 항목 | HTTP | HTTPS |
|------|------|-------|
| **포트** | 80 | 443 |
| **암호화** | ❌ 없음 | ✅ SSL/TLS |
| **보안** | 낮음 | 높음 |
| **속도** | 빠름 | 약간 느림 (무시 가능) |
| **인증서** | 불필요 | 필요 |
| **SEO** | 불이익 | 우대 |
| **브라우저 경고** | "주의" 표시 | 자물쇠 아이콘 |

**현재 권장사항**: **모든 웹사이트는 HTTPS 필수**

## 🔍 SSL/TLS 문제 해결

### 인증서 오류 확인

```bash
# OpenSSL로 인증서 확인
openssl s_client -connect example.com:443 -servername example.com

# 인증서 만료일 확인
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 일반적인 오류

```
1. "인증서가 신뢰할 수 없음"
   → CA에서 발급받은 인증서가 아님
   → Let's Encrypt 등 신뢰할 수 있는 CA 사용

2. "인증서가 만료됨"
   → 인증서 유효기간 지남
   → 새 인증서 발급 필요

3. "도메인 불일치"
   → 인증서의 도메인과 실제 도메인이 다름
   → 올바른 도메인으로 재발급

4. "혼합 콘텐츠"
   → HTTPS 페이지에서 HTTP 리소스 로드
   → 모든 리소스를 HTTPS로 변경
```

## 🔗 관련 용어

- [[HTTPS]]: SSL/TLS를 사용하는 HTTP
- [[암호화]]: SSL/TLS의 핵심 기술
- [[인증서]]: 웹사이트 신원 증명
- [[IPSec VPN]]: 다른 보안 프로토콜

## 📚 참고자료

- [Let's Encrypt](https://letsencrypt.org/) - 무료 SSL/TLS 인증서
- [SSL Labs](https://www.ssllabs.com/ssltest/) - SSL/TLS 설정 테스트
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

---
*카테고리: 보안*
*생성일: 2026-02-14*
