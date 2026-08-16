# IPSec VPN

## 📝 정의

IPSec VPN(Internet Protocol Security Virtual Private Network)은 **인터넷을 통해 안전한 사설 네트워크를 만드는 기술**입니다. 데이터를 암호화하여 전송하므로 외부에서 도청할 수 없습니다.

### 핵심 개념

- **무엇인가?**: 인터넷을 암호화된 터널로 만들어 안전하게 통신
- **왜 필요한가?**: 인터넷은 공개 네트워크라 도청 위험, 회사 내부망처럼 안전하게 만들기 위해
- **어떻게 작동하나?**: 데이터 암호화 → 터널 생성 → 안전하게 전송 → 복호화

### IPSec VPN이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 재택근무 시 회사 서버 접근
재택 개발자: "회사 DB에 접근하고 싶어"
인터넷: 공개 네트워크
→ 누군가 중간에서 데이터 도청 가능
→ 회사 기밀 유출! 😱

😱 시나리오 2: 지점 간 통신
서울 본사 ↔ 부산 지점
→ 인터넷으로 연결
→ 암호화 없이 데이터 전송
→ 해커가 중간에서 가로채기! 😱

😱 시나리오 3: 카페에서 업무
카페 Wi-Fi 사용
→ 같은 Wi-Fi 사용자가 패킷 스니핑
→ 로그인 정보 탈취
→ 계정 해킹! 😱
```

**IPSec VPN의 해결**:
```
✅ 시나리오 1 (암호화 터널):
재택 개발자 → IPSec VPN 연결
→ 모든 데이터 암호화
→ 회사 서버에 안전하게 접근
→ 도청 불가능! ✅

✅ 시나리오 2 (사이트 간 VPN):
서울 본사 ↔ IPSec 터널 ↔ 부산 지점
→ 모든 통신 암호화
→ 안전한 사설망처럼 사용
→ 보안 완벽! ✅

✅ 시나리오 3 (원격 접속 VPN):
카페 → IPSec VPN → 회사
→ Wi-Fi 도청해도 암호화된 데이터만
→ 안전하게 업무
→ 해킹 방지! ✅
```

**비유**:
- **인터넷 직접 연결** = 편지를 투명 봉투에 담아 보냄 (누구나 읽을 수 있음)
- **IPSec VPN** = 편지를 금고에 넣어 보냄 (열쇠 없으면 못 봄)

## 💡 IPSec VPN 동작 원리

### 1. VPN 연결 설정

```도해
흐름: IPSec VPN, 무슨 순서로 오가나
클라이언트 :: 연결 요청
VPN 게이트웨이 :: 인증서 요청
클라이언트 :: 인증서 전송
VPN 게이트웨이 :: 인증서 검증
VPN 게이트웨이 :: 인증 성공
클라이언트 :: 암호화된 데이터
VPN 게이트웨이 :: 복호화 후 전달
회사 서버 :: 응답 데이터
VPN 게이트웨이 :: 암호화 후 전달
```

### 2. 데이터 암호화 과정

```
원본 데이터:
  "SELECT * FROM users"

IPSec 처리:
  1. 암호화: AES-256 알고리즘
     → "a7f3b9c2d8e1..."

  2. 인증: HMAC-SHA256
     → 데이터 변조 방지

  3. 터널링: IP-in-IP
     → 원본 IP 숨김

전송 데이터:
  [암호화된 페이로드] + [인증 헤더] + [새 IP 헤더]

도청자가 보는 것:
  "a7f3b9c2d8e1..." (알아볼 수 없음)
```

## 🎯 IPSec VPN 유형

### 1. 원격 접속 VPN (Remote Access)

**사용 사례**: 재택근무, 출장

```
개인 PC → VPN Client → 인터넷 → VPN Gateway → 회사 내부망
```

**설정 예시**:
```yaml
# VPN 클라이언트 설정
vpn_config:
  type: "remote_access"
  server: "vpn.company.com"
  protocol: "IPSec"
  encryption: "AES-256"
  authentication: "certificate"
```

### 2. 사이트 간 VPN (Site-to-Site)

**사용 사례**: 본사-지점 연결

```
서울 본사 네트워크 ↔ VPN 터널 ↔ 부산 지점 네트워크
```

**설정 예시**:
```yaml
# 사이트 간 VPN 설정
site_to_site:
  local_network: "192.168.1.0/24"  # 서울 본사
  remote_network: "192.168.2.0/24" # 부산 지점
  gateway: "vpn.busan.company.com"
  always_on: true
```

## 🔒 IPSec 보안 메커니즘

### 1. 암호화 (Encryption)

```python
# AES-256 암호화
data = "민감한 데이터"
key = generate_key_256bit()

encrypted = AES_encrypt(data, key)
# → "a7f3b9c2d8e1..."

# 복호화 (회사 서버에서)
decrypted = AES_decrypt(encrypted, key)
# → "민감한 데이터"
```

### 2. 인증 (Authentication)

```python
# 인증서 기반 인증
client_certificate = load_certificate("client.crt")
vpn_server = connect_vpn("vpn.company.com")

# 인증서 검증
if vpn_server.verify(client_certificate):
    print("✅ 인증 성공 - VPN 연결")
else:
    print("❌ 인증 실패 - 접근 거부")
```

### 3. 무결성 (Integrity)

```python
# HMAC으로 데이터 변조 방지
data = "SELECT * FROM users"
hash = HMAC_SHA256(data, secret_key)

# 전송: data + hash

# 수신 측 검증
received_data = "SELECT * FROM users"
received_hash = "abc123..."

if HMAC_SHA256(received_data, secret_key) == received_hash:
    print("✅ 데이터 변조 없음")
else:
    print("❌ 데이터 변조 감지!")
```

## 📊 IPSec vs SSL/TLS VPN

| 항목 | IPSec VPN | [[SSL/TLS]] VPN |
|------|-----------|----------------|
| **계층** | 네트워크 계층 (Layer 3) | 애플리케이션 계층 (Layer 7) |
| **설치** | 클라이언트 소프트웨어 필요 | 웹 브라우저만 있으면 가능 |
| **성능** | 빠름 | 약간 느림 |
| **보안** | 매우 높음 | 높음 |
| **관리** | 복잡 | 간단 |
| **사용 사례** | 본사-지점, 전체 네트워크 | 웹 애플리케이션 접근 |

**선택 가이드**:
```
IPSec VPN 선택:
  - 사이트 간 연결 (본사-지점)
  - 전체 네트워크 액세스 필요
  - 고성능 필요

SSL/TLS VPN 선택:
  - 웹 애플리케이션만 접근
  - 클라이언트 설치 불가
  - 간단한 설정 필요
```

## 🔧 IPSec VPN 설정 예시

### Linux에서 IPSec VPN 서버 구축

```bash
# StrongSwan 설치
sudo apt-get install strongswan

# 인증서 생성
ipsec pki --gen --type rsa --size 4096 --outform pem > server-key.pem

# VPN 설정
cat > /etc/ipsec.conf <<EOF
config setup
    charondebug="ike 1, knl 1, cfg 0"
    uniqueids=no

conn ikev2-vpn
    auto=add
    compress=no
    type=tunnel
    keyexchange=ikev2
    fragmentation=yes
    forceencaps=yes
    ike=aes256-sha256-modp2048!
    esp=aes256-sha256!
    dpdaction=clear
    dpddelay=300s
    rekey=no
    left=%any
    leftid=@vpn.company.com
    leftcert=server-cert.pem
    leftsendcert=always
    leftsubnet=0.0.0.0/0
    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=10.10.10.0/24
    rightdns=8.8.8.8,8.8.4.4
    rightsendcert=never
    eap_identity=%identity
EOF

# VPN 시작
sudo ipsec start
```

### 클라이언트 연결 (Windows)

```powershell
# PowerShell에서 VPN 연결 추가
Add-VpnConnection `
    -Name "Company VPN" `
    -ServerAddress "vpn.company.com" `
    -TunnelType "IKEv2" `
    -EncryptionLevel "Maximum" `
    -AuthenticationMethod "EAP"

# VPN 연결
rasdial "Company VPN" username password
```

## 🎯 보안 Best Practices

### 1. 강력한 암호화 사용

```yaml
# 권장 설정
encryption:
  algorithm: "AES-256"  # 최소 AES-128 이상
  key_size: 256
  mode: "CBC"

authentication:
  method: "certificate"  # 인증서 기반 (비밀번호보다 안전)
  hash: "SHA-256"
```

### 2. 정기적인 키 갱신

```python
# 24시간마다 키 재생성
KEY_LIFETIME = timedelta(hours=24)

def rotate_keys():
    """VPN 키 자동 갱신"""
    new_key = generate_key()
    update_vpn_config(new_key)
    log_key_rotation()
```

### 3. 접속 로그 모니터링

```python
# VPN 접속 로그
def log_vpn_connection(user, ip, timestamp):
    """VPN 연결 기록"""
    audit_log.write({
        "user": user,
        "client_ip": ip,
        "timestamp": timestamp,
        "action": "vpn_connect"
    })

# 이상 접속 감지
def detect_anomaly():
    """비정상 접속 탐지"""
    if connection_count > 100:  # 1분에 100회 이상
        alert_admin("DDoS 의심")
```

## 🔗 관련 용어

- [[SSL/TLS]]: 다른 종류의 VPN 프로토콜
- [[암호화]]: IPSec의 핵심 기술
- [[인증서]]: IPSec 인증 방법
- [[네트워크 보안]]: IPSec이 속한 분야

## 📚 참고자료

- [IPSec RFC](https://datatracker.ietf.org/doc/html/rfc4301)
- [StrongSwan Documentation](https://www.strongswan.org/)

---
*카테고리: 보안*
*생성일: 2026-02-14*
