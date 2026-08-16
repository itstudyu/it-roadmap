# Container (컨테이너)

## 📝 정의

Container는 **애플리케이션과 실행에 필요한 모든 것을 담은 격리된 실행 환경**입니다. 마치 아파트 각 호수처럼, 독립적으로 실행되지만 건물(OS)은 공유합니다.

### 핵심 개념

- **무엇인가?**: 앱 + 라이브러리를 패키징한 격리 환경
- **왜 필요한가?**: 가볍고 빠른 격리 실행 위해
- **어떻게 작동하나?**: OS 커널 공유, 프로세스 수준 격리

## 🤔 왜 Container가 필요한가?

### 기존 방식의 문제

**문제 1: VM은 너무 무겁다**
```
VM (가상머신):
→ 앱마다 전체 OS 필요
→ 메모리: 2GB+
→ 부팅: 30초+
→ 디스크: 수십 GB

앱 3개 실행하려면:
→ 6GB 메모리 + 90초 부팅
→ 너무 비효율적 ❌
```

**문제 2: 직접 설치는 충돌 위험**
```
서버에 앱 직접 설치:
→ App A: Python 3.7 필요
→ App B: Python 3.9 필요
→ 충돌 발생! ❌

라이브러리 버전 충돌:
→ numpy 1.20 vs 1.24
→ 한쪽은 반드시 오류
```

### Container의 해결

```
✅ 가볍고 빠름
→ OS 커널 공유
→ 메모리: 50MB 정도
→ 부팅: 1초 이내

✅ 격리된 환경
→ 각 앱이 독립적
→ Python 버전 충돌 없음
→ 서로 영향 안 줌

✅ 이식성
→ 한 번 만들면 어디서나 실행
→ 개발/테스트/프로덕션 동일
```

## 📊 구조

### Container의 격리 구조

```도해
층: Container, 어떻게 나뉘어 있나
Host OS :: Kernel 공유됨
Container 1 :: App A Python 3.7 · 라이브러리
Container 2 :: App B Python 3.9 · 라이브러리
Container 3 :: App C Node.js · 라이브러리
```

### Container vs VM

```도해
층: Container, 어떻게 나뉘어 있나
VM 방식 :: Host OS] --> HV[Hypervisor
Container 방식 :: Host OS + Kernel] --> DE[Container Engine
```

## 🔄 작동 원리

### Container의 격리 메커니즘

```
Container가 사용하는 Linux 기술:

1. Namespace (네임스페이스):
→ 프로세스, 네트워크, 파일시스템 격리
→ 각 Container는 자신만의 공간

2. Cgroups (Control Groups):
→ CPU, 메모리 리소스 제한
→ Container A가 전체 메모리 독점 방지

3. Union File System:
→ 레이어 방식으로 파일시스템 구성
→ 효율적인 이미지 관리
```

### Container 생명주기


## 💡 일상적 비유로 이해하기

### Container = 아파트 호수

```
VM (가상머신) = 독립된 집:
→ 각 집마다 전기, 수도, 난방 독립
→ 각 집마다 모든 시설 필요
→ 비용이 많이 듦 ❌

Container = 아파트 호수:
→ 전기, 수도, 난방 공유 (OS 커널)
→ 각 호수는 독립적 (격리)
→ 경제적이고 효율적 ✅
```

### Container의 특성

```
독립성:
→ 101호와 201호는 서로 몰라도 됨
→ 101호가 시끄러워도 201호는 조용

공유:
→ 같은 건물, 같은 엘리베이터
→ 같은 OS 커널 공유

빠른 입주:
→ 집 짓기: 몇 달 (VM)
→ 아파트 입주: 며칠 (Container)
```

## 🎯 실제 사례 (P3 프로젝트)

### P3의 Container 구성

```
P3 시스템은 여러 Container로 구성:

1. Backend Container:
   - FastAPI 서버
   - Python 3.9
   - 메모리: 512MB

2. Frontend Container:
   - React 앱
   - Node.js 18
   - 메모리: 256MB

3. Database Container:
   - PostgreSQL 15
   - 메모리: 1GB

4. Cache Container:
   - Redis
   - 메모리: 256MB

5. Vector DB Container:
   - ChromaDB
   - 메모리: 512MB

총 메모리: 약 2.5GB
→ VM으로 했다면: 10GB+ 필요
```

### Container의 장점 (P3 실제 경험)

```
빠른 배포:
→ 새 기능 개발 완료
→ Container 이미지 빌드: 1분
→ 서버에 배포: 30초
→ 총 1.5분 만에 프로덕션 반영 ✅

롤백 쉬움:
→ 버그 발견
→ 이전 Container로 즉시 전환
→ 5초 만에 복구 ✅

환경 일관성:
→ 로컬, 테스트, 프로덕션 모두 동일
→ "내 컴퓨터에서는 되는데" 없음 ✅
```

## 💻 코드 구현 (간단하게)

### Container 생명주기 관리

```bash
# Container 생성 (실행 안 함)
docker create --name my-app nginx

# Container 시작
docker start my-app

# Container 중지
docker stop my-app

# Container 재시작
docker restart my-app

# Container 일시 정지
docker pause my-app

# Container 재개
docker unpause my-app

# Container 삭제
docker rm my-app
```

### Container 정보 확인

```bash
# 실행 중인 Container
docker ps

# 모든 Container (중지된 것 포함)
docker ps -a

# Container 상세 정보
docker inspect my-app

# Container 로그
docker logs my-app
docker logs -f my-app  # 실시간

# Container 리소스 사용량
docker stats my-app
```

### Container 리소스 제한

```bash
# 메모리 제한
docker run -m 512m nginx
# 최대 512MB만 사용

# CPU 제한
docker run --cpus="1.5" nginx
# 최대 1.5 코어만 사용

# 메모리 + CPU 제한
docker run -m 512m --cpus="1.0" nginx
```

## 🔍 Container vs VM vs Bare Metal

| 특성 | Container | VM | Bare Metal |
|------|-----------|-----|-----------|
| 격리 수준 | 프로세스 | OS | 물리적 |
| 부팅 시간 | 1초 | 30초+ | 수 분 |
| 메모리 | MB 단위 | GB 단위 | 전체 |
| 이식성 | 높음 | 중간 | 낮음 |
| 오버헤드 | 거의 없음 | 있음 | 없음 |
| 보안 격리 | 약함 | 강함 | 최강 |

```
언제 뭘 쓸까?

Container:
→ 마이크로서비스 ✅
→ 빠른 배포 필요
→ 리소스 효율 중요

VM:
→ 강한 격리 필요
→ 다른 OS 필요
→ 레거시 앱

Bare Metal:
→ 최고 성능 필요
→ GPU 집약적
→ 데이터베이스 서버
```

## 🚨 주의사항

### 1. 보안 격리의 한계

```
Container는 프로세스 수준 격리:
→ VM보다 격리가 약함
→ 커널 버그 시 영향 받음
→ Root 권한 획득 시 위험

해결:
→ 최소 권한으로 실행
→ 보안 스캔 정기 실행
→ 중요 앱은 VM 고려
```

### 2. 상태 저장 문제

```
Container는 Stateless 권장:
→ 삭제 시 데이터 사라짐 ❌
→ 재시작 시 초기화됨

해결:
→ Volume 사용 (외부 저장)
→ 데이터베이스는 별도 관리
→ 중요 데이터는 백업
```

### 3. 네트워크 복잡성

```
Container 간 통신:
→ 내부 네트워크 필요
→ 포트 매핑 관리
→ DNS 설정

해결:
→ Docker Compose 사용
→ Kubernetes 같은 오케스트레이터
```

## 🔗 관련 용어

- [[Docker]]: Container를 만들고 실행하는 플랫폼
- [[VM]]: 가상머신, Container보다 무거움
- [[Kubernetes]]: 다수 Container 관리
- [[Microservices]]: Container로 구현
- [[Image]]: Container의 템플릿

## 📝 정리

**Container 핵심 3줄**:
```
1. 앱을 격리해서 실행하는 "아파트 호수"
2. VM보다 10배 가볍고 빠름 (OS 커널 공유)
3. 마이크로서비스의 필수 기술

→ 현대 클라우드 인프라의 기본!
```

**비유로 기억하기**:
```
Container = 아파트 호수
→ 독립적으로 살지만
→ 건물(OS)은 공유
→ 효율적이고 경제적

VM = 독립된 집
→ 모든 시설 독립
→ 비용이 많이 듦
```

**Container vs VM**:
```
Container:
→ 가볍다 (MB)
→ 빠르다 (1초)
→ 격리는 약함

VM:
→ 무겁다 (GB)
→ 느리다 (30초+)
→ 격리는 강함

핵심 = 용도에 맞게 선택!
```

**Container의 핵심 기술**:
```
1. Namespace: 프로세스/네트워크 격리
2. Cgroups: 리소스 제한
3. Union FS: 효율적 파일시스템

→ 이 3가지가 Container를 가능하게 함!
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
