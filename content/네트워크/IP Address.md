# IP Address (IP 주소)

## 📝 정의

IP Address(IP 주소)는 **네트워크상에서 장치를 식별하는 고유한 숫자 주소**로, 인터넷 통신의 기본 주소 체계입니다.

### 핵심 개념

- **무엇인가?**: 네트워크 장치의 고유 식별자
- **왜 필요한가?**: 데이터를 올바른 목적지로 전송
- **어떻게 작동하나?**: IPv4 (32비트) / IPv6 (128비트)

### IP Address가 해결하는 문제

**문제 상황**:
```
😱 시나리오: IP 주소 없이 통신
컴퓨터 A → 인터넷에 데이터 전송
→ 어디로 보낼지 모름
→ 수신자를 특정할 수 없음! 😱
```

**IP Address의 해결**:
```
✅ 고유 주소로 식별:
컴퓨터 A (192.168.1.10)
서버 B (203.0.113.5)
→ A가 B로 데이터 전송
→ 라우터가 주소 보고 경로 찾기
→ 정확한 전달! ✅
```

**비유**:
- **IP 주소 없음** = 우편번호 없는 주소
- **IP 주소** = 정확한 우편번호 + 주소

## 📊 IP 주소 구조

### IPv4


### IPv6
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
→ 총 128비트 (8개 그룹, 각 16비트)
```

## 💡 IP 주소 클래스 (IPv4)

### 클래스 구분
```
Class A: 0.0.0.0 ~ 127.255.255.255
- 대규모 네트워크
- 네트워크 8비트, 호스트 24비트
- 예: 10.0.0.0/8

Class B: 128.0.0.0 ~ 191.255.255.255
- 중규모 네트워크
- 네트워크 16비트, 호스트 16비트
- 예: 172.16.0.0/16

Class C: 192.0.0.0 ~ 223.255.255.255
- 소규모 네트워크
- 네트워크 24비트, 호스트 8비트
- 예: 192.168.1.0/24
```

## 💡 공인 IP vs 사설 IP

### 사설 IP 대역 (Private IP)
```
10.0.0.0 ~ 10.255.255.255       (Class A)
172.16.0.0 ~ 172.31.255.255     (Class B)
192.168.0.0 ~ 192.168.255.255   (Class C)

→ 인터넷에서 라우팅 안 됨
→ 내부 네트워크에서만 사용
```

### NAT (Network Address Translation)
```python
# 사설 IP → 공인 IP 변환
내부 네트워크:
- PC 1: 192.168.1.10
- PC 2: 192.168.1.11
- PC 3: 192.168.1.12

↓ 라우터 (NAT)

외부 인터넷: 203.0.113.5 (하나의 공인 IP)

# 외부에서는 모두 같은 IP로 보임
```

## 💡 서브넷 마스크

### CIDR 표기
```
192.168.1.0/24
→ /24: 앞 24비트가 네트워크 주소
→ 뒤 8비트가 호스트 주소
→ 사용 가능 IP: 192.168.1.1 ~ 192.168.1.254 (256개 - 2)
```

### Python으로 서브넷 계산
```python
import ipaddress

# 네트워크 생성
network = ipaddress.IPv4Network('192.168.1.0/24')

# 네트워크 정보
print(f"Network: {network.network_address}")  # 192.168.1.0
print(f"Broadcast: {network.broadcast_address}")  # 192.168.1.255
print(f"Netmask: {network.netmask}")  # 255.255.255.0
print(f"Hosts: {network.num_addresses - 2}")  # 254

# 모든 호스트 IP
for ip in network.hosts():
    print(ip)  # 192.168.1.1 ~ 192.168.1.254

# IP가 네트워크에 속하는지 확인
ip = ipaddress.IPv4Address('192.168.1.100')
if ip in network:
    print(f"{ip} is in {network}")
```

## 💡 IP 주소 확인

### Python으로 IP 가져오기
```python
import socket

# 로컬 IP 주소
hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)
print(f"Local IP: {local_ip}")

# 외부 IP 주소 (공인 IP)
import requests

response = requests.get('https://api.ipify.org')
public_ip = response.text
print(f"Public IP: {public_ip}")

# 도메인의 IP 주소
ip = socket.gethostbyname('google.com')
print(f"google.com IP: {ip}")
```

### Linux 명령어
```bash
# 로컬 IP 확인
ip addr show
ifconfig

# 공인 IP 확인
curl ifconfig.me
curl icanhazip.com

# 라우팅 테이블
ip route show
```

## 💡 정적 IP vs 동적 IP (DHCP)

### 정적 IP 설정
```python
# Linux에서 고정 IP 설정
# /etc/network/interfaces
"""
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8
"""
```

### DHCP (동적 IP)
```python
# DHCP 서버 시뮬레이션
class DHCPServer:
    def __init__(self):
        self.pool = [f"192.168.1.{i}" for i in range(100, 200)]
        self.leases = {}  # {mac_address: ip}
    
    def request_ip(self, mac_address):
        """IP 주소 할당"""
        # 이미 할당된 IP 있으면 재사용
        if mac_address in self.leases:
            return self.leases[mac_address]
        
        # 새 IP 할당
        if self.pool:
            ip = self.pool.pop(0)
            self.leases[mac_address] = ip
            print(f"Assigned {ip} to {mac_address}")
            return ip
        
        return None  # IP 풀 고갈
    
    def release_ip(self, mac_address):
        """IP 반환"""
        if mac_address in self.leases:
            ip = self.leases[mac_address]
            del self.leases[mac_address]
            self.pool.append(ip)
            print(f"Released {ip} from {mac_address}")

# 사용
dhcp = DHCPServer()
ip1 = dhcp.request_ip("AA:BB:CC:DD:EE:01")  # 192.168.1.100
ip2 = dhcp.request_ip("AA:BB:CC:DD:EE:02")  # 192.168.1.101
```

## 💡 IPv6

### IPv6 주소 형식
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334

# 축약 표기
2001:db8:85a3::8a2e:370:7334
→ 연속된 0은 ::로 생략 (한 번만 가능)
```

### Python으로 IPv6
```python
import ipaddress

# IPv6 주소
ipv6 = ipaddress.IPv6Address('2001:db8::1')
print(ipv6.compressed)  # 2001:db8::1
print(ipv6.exploded)    # 2001:0db8:0000:0000:0000:0000:0000:0001

# IPv6 네트워크
network = ipaddress.IPv6Network('2001:db8::/32')
print(f"Hosts: {network.num_addresses}")  # 약 7.9 x 10^28
```

## 💡 루프백 주소

```
IPv4: 127.0.0.1 (localhost)
IPv6: ::1

# 자기 자신을 가리킴
# 로컬 테스트용
```

### Python 서버 예시
```python
import socket

# 127.0.0.1에서만 접속 가능 (외부 차단)
server = socket.socket()
server.bind(('127.0.0.1', 8000))
server.listen(1)

# 모든 인터페이스에서 접속 가능
server = socket.socket()
server.bind(('0.0.0.0', 8000))  # 또는 '::'
server.listen(1)
```

## 🎯 특수 IP 주소

```
0.0.0.0         모든 인터페이스
127.0.0.1       루프백 (localhost)
255.255.255.255 브로드캐스트 (모든 호스트)
169.254.x.x     링크 로컬 (DHCP 실패 시)
```

## 🔗 관련 용어

- [[DNS]]: 도메인을 IP로 변환
- [[NAT]]: 사설 IP ↔ 공인 IP 변환
- [[Subnet]]: IP 주소 범위 분할

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
