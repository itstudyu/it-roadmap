# VM (Virtual Machine, 가상 머신)

## 📝 정의

VM은 **하드웨어를 소프트웨어로 에뮬레이션하여 만든 가상 컴퓨터**입니다. 한 컴퓨터 안에 또 다른 컴퓨터를 만드는 기술입니다.

### 핵심 개념

- **무엇인가?**: 소프트웨어로 만든 가상 컴퓨터
- **왜 필요한가?**: 다른 OS 실행, 완전한 격리
- **어떻게 작동하나?**: Hypervisor가 하드웨어 에뮬레이션

## 🤔 왜 VM이 필요한가?

### VM이 없을 때의 문제

**문제 1: 다른 OS 테스트 불가**
```
Mac에서 Windows 앱 테스트:
→ Windows 컴퓨터 별도 구매 ❌
→ 비용: 수십만원+

Linux 서버 환경 테스트:
→ 실제 서버 필요 ❌
→ 비용 + 관리 부담
```

**문제 2: 위험한 소프트웨어 실행**
```
의심스러운 파일 실행:
→ 바이러스 감염 위험
→ 시스템 전체 망가질 수 있음 ❌

테스트 중 오류:
→ OS 재설치 필요
→ 데이터 손실 위험
```

**문제 3: 환경 설정 복잡**
```
여러 개발 환경 필요:
→ Python 2.7 프로젝트
→ Python 3.9 프로젝트
→ 충돌 발생 ❌
```

### VM의 해결

```
✅ 여러 OS 동시 실행
→ Mac에서 Windows 실행
→ Windows에서 Linux 실행
→ 컴퓨터 한 대로 모두 가능

✅ 완전한 격리
→ VM이 망가져도 Host는 안전
→ 바이러스도 VM 안에만 격리
→ 스냅샷으로 즉시 복구

✅ 테스트 환경
→ 개발: Mac
→ 테스트: Linux VM
→ 프로덕션과 동일한 환경
```

## 📊 구조

### VM의 구조


### Hypervisor의 역할

```
Hypervisor (가상화 소프트웨어):
→ VM들을 관리
→ 하드웨어 리소스 할당
→ CPU, 메모리, 디스크 가상화

Type 1 (Bare-metal):
→ 하드웨어에 직접 설치
→ ESXi, Hyper-V
→ 서버용

Type 2 (Hosted):
→ OS 위에 설치
→ VMware, VirtualBox
→ 개발/테스트용
```

## 🔄 작동 원리

### VM 실행 흐름

```도해
흐름: VM, 무슨 순서로 오가나
사용자 :: 앱 실행
VM (Guest OS) :: CPU/메모리 요청
Hypervisor :: 가상화 처리
Hypervisor :: 실제 하드웨어 사용
< 하드웨어 :: 결과
< Hypervisor :: 전달
< VM (Guest OS) :: 앱 실행 완료
```

### VM vs Container

```
VM (가상머신):
┌──────────────┐
│   Guest OS   │ ← 전체 OS
│   (Linux)    │
├──────────────┤
│     App      │
└──────────────┘
   ↓ 무거움 (GB)

Container (컨테이너):
┌──────────────┐
│     App      │ ← 앱만
│  + Library   │
└──────────────┘
   ↓ 가벼움 (MB)
```

## 💡 일상적 비유로 이해하기

### VM = 집 안의 독립된 방

```
Host OS = 집
VM = 방

VM 1 (Windows):
→ 완전히 독립된 방
→ 자체 전기, 수도
→ 문 잠그면 완전 격리

VM 2 (Linux):
→ 또 다른 독립된 방
→ VM 1과 완전 분리
→ 서로 영향 없음

하지만:
→ 방마다 전체 시설 필요
→ 비용이 많이 듦 (메모리)
```

### Container = 아파트 호수

```
Container:
→ 건물(OS) 공유
→ 전기, 수도 공유
→ 효율적

VM:
→ 각 방이 독립된 집
→ 모든 시설 독립
→ 비효율적이지만 격리는 강력
```

## 🎯 실제 사례

### 개발 환경 구성

```
Mac에서 개발:
→ VM 1: Ubuntu 20.04 (Backend 테스트)
→ VM 2: Windows 11 (Frontend IE 테스트)
→ VM 3: CentOS 7 (프로덕션 환경)

장점:
→ Mac 하나로 모든 OS 테스트
→ 스냅샷으로 빠른 복구
→ 망가뜨려도 Host는 안전
```

### 서버 가상화

```
물리 서버 1대:
→ VM 1: Web Server
→ VM 2: DB Server
→ VM 3: Cache Server

리소스 할당:
→ Web: CPU 4코어, 8GB
→ DB: CPU 8코어, 16GB
→ Cache: CPU 2코어, 4GB

총 28GB 중 사용
→ 유연한 리소스 관리 ✅
```

## 💻 코드 구현 (간단하게)

### VirtualBox 사용

```bash
# VM 생성
VBoxManage createvm --name "Ubuntu-VM" --register

# 메모리 설정 (4GB)
VBoxManage modifyvm "Ubuntu-VM" --memory 4096

# CPU 설정 (2 코어)
VBoxManage modifyvm "Ubuntu-VM" --cpus 2

# 디스크 생성 (20GB)
VBoxManage createhd --filename "Ubuntu.vdi" --size 20480

# VM 시작
VBoxManage startvm "Ubuntu-VM"

# VM 중지
VBoxManage controlvm "Ubuntu-VM" poweroff
```

### 스냅샷 관리

```bash
# 스냅샷 생성 (현재 상태 저장)
VBoxManage snapshot "Ubuntu-VM" take "Clean-Install"

# 스냅샷 목록
VBoxManage snapshot "Ubuntu-VM" list

# 스냅샷 복원
VBoxManage snapshot "Ubuntu-VM" restore "Clean-Install"

# 사용 시나리오:
# 1. Clean Install 스냅샷 생성
# 2. 테스트 진행
# 3. 망가짐
# 4. 스냅샷으로 즉시 복구 ✅
```

## 🔍 VM vs Container vs Bare Metal

| 특성 | VM | Container | Bare Metal |
|------|-----|-----------|-----------|
| 격리 | OS 수준 | 프로세스 수준 | 물리적 |
| 크기 | GB 단위 | MB 단위 | 전체 |
| 부팅 | 30초+ | 1초 | 수 분 |
| 오버헤드 | 높음 | 낮음 | 없음 |
| 보안 | 강함 | 약함 | 최강 |

```
VM 적합:
→ 다른 OS 필요
→ 강한 격리 필요
→ 레거시 앱
→ 위험한 소프트웨어 테스트

Container 적합:
→ 마이크로서비스
→ 빠른 배포
→ 리소스 효율
→ 같은 OS 내에서

Bare Metal 적합:
→ 최고 성능 필요
→ GPU 집약적
→ 대용량 데이터베이스
```

## 🚨 주의사항

### 1. 리소스 오버헤드

```
Host: 16GB 메모리

VM 3개 실행:
→ VM 1: 4GB
→ VM 2: 4GB
→ VM 3: 4GB
→ Host: 나머지 4GB

→ Host가 느려질 수 있음 ⚠️

해결:
→ 필요한 VM만 실행
→ 메모리 적절히 할당
```

### 2. 성능 저하

```
VM은 에뮬레이션:
→ 실제 하드웨어보다 느림
→ CPU: 70~90% 성능
→ 디스크 I/O: 더 느림

Container는 네이티브:
→ 거의 100% 성능
→ 오버헤드 거의 없음

성능 중요하면 Container 고려
```

### 3. 라이선스

```
Windows VM:
→ Windows 라이선스 필요
→ VM마다 별도 라이선스

Linux VM:
→ 대부분 무료
→ 라이선스 걱정 없음
```

## 🔗 관련 용어

- [[Container]]: VM보다 가벼운 대안
- [[Docker]]: Container 기술
- [[Hypervisor]]: VM을 관리하는 소프트웨어
- [[Cloud]]: 클라우드 VM (AWS EC2)
- [[Snapshot]]: VM 상태 저장

## 📝 정리

**VM 핵심 3줄**:
```
1. 소프트웨어로 만든 가상 컴퓨터
2. 다른 OS 실행 + 강한 격리
3. 무겁지만 완전한 독립 환경

→ Container와 용도에 맞게 선택!
```

**VM vs Container**:
```
VM:
→ 전체 OS 포함
→ 무거움 (GB)
→ 느림 (30초 부팅)
→ 격리 강함

Container:
→ 앱만 포함
→ 가벼움 (MB)
→ 빠름 (1초 부팅)
→ 격리 약함

핵심 = 격리 수준 vs 효율성!
```

**언제 뭘 쓸까?**:
```
VM 사용:
→ Windows에서 Linux 실행
→ 위험한 소프트웨어 테스트
→ 레거시 앱
→ 강한 격리 필요

Container 사용:
→ 마이크로서비스
→ 빠른 배포
→ 개발 환경 일치
→ 리소스 절약
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
