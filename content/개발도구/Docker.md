# Docker (컨테이너 플랫폼)

## 📝 정의

Docker는 **애플리케이션과 실행 환경을 하나의 "컨테이너"로 패키징하는 플랫폼**입니다. 마치 택배 상자처럼, 앱을 포장해서 어디서든 동일하게 실행할 수 있게 해줍니다.

### 핵심 개념

- **무엇인가?**: 앱을 격리된 환경에서 실행하는 도구
- **왜 필요한가?**: "내 컴퓨터에서는 되는데요?" 문제 해결
- **어떻게 작동하나?**: 이미지를 만들고 컨테이너로 실행

## 🤔 왜 Docker가 필요한가?

### Docker가 없을 때의 문제

**문제 1: 환경 차이로 인한 오류**
```
개발자 컴퓨터:
→ Python 3.9
→ 잘 작동! ✅

서버:
→ Python 3.7
→ 에러 발생! ❌

"내 컴퓨터에서는 되는데요?"
→ 환경 차이 때문에 안 됨
```

**문제 2: 복잡한 설치 과정**
```
새 팀원이 합류:
1. Python 3.9 설치
2. Node.js 18 설치
3. PostgreSQL 설치
4. Redis 설치
5. 환경변수 설정
6. 의존성 패키지 설치

→ 반나절 소요 ❌
→ 설치 과정에서 오류
→ 버전 불일치 가능성
```

**문제 3: 서버 리소스 낭비**
```
VM (가상머신) 사용 시:
→ 각 앱마다 전체 OS 필요
→ 메모리 수 GB씩 소모
→ 부팅 시간 수십 초

→ 무겁고 느림 ❌
```

### Docker의 해결

```
✅ 일관된 환경
→ 개발/테스트/프로덕션 모두 같은 환경
→ "내 컴퓨터에서는 되는데" 문제 해결
→ 한 번 만들면 어디서나 동일

✅ 간편한 배포
→ Docker 이미지 하나면 끝
→ 설치 과정 자동화
→ 새 팀원도 5분 안에 시작

✅ 가벼움
→ VM보다 10배 이상 가벼움
→ 부팅 시간 1초 이내
→ 메모리 효율적 (OS 공유)
```

## 📊 구조

### Docker의 핵심 구조


### 각 요소의 역할

```
Dockerfile (레시피):
→ 이미지를 만드는 방법이 적힌 파일
→ "Python 3.9 설치하고, 패키지 설치하고..."
→ 텍스트 파일이라 Git 관리 가능

Image (템플릿):
→ 앱 + 실행 환경이 패키징된 것
→ 붕어빵 틀처럼 여러 번 사용 가능
→ 변경 불가능 (Immutable)

Container (실행 중인 인스턴스):
→ Image를 실행한 것
→ 붕어빵 틀로 만든 붕어빵
→ 각각 독립적으로 실행

Docker Hub (저장소):
→ 이미지를 공유하는 곳
→ npm, pip 같은 패키지 저장소
→ 공식 이미지들 다운로드 가능
```

## 🔄 작동 원리

### Docker 실행 흐름

```도해
흐름: Docker, 무슨 순서로 오가나
개발자 :: Dockerfile 작성
개발자 :: docker build
Dockerfile :: 이미지 생성
개발자 :: docker run
Image :: 컨테이너 실행
개발자 :: docker push
Image :: 이미지 업로드
```

### VM vs Docker

```도해
층: Docker, 어떻게 나뉘어 있나
VM (가상머신) :: Host OS] --> B1[Hypervisor
Docker (컨테이너) :: Host OS] --> B2[Docker Engine
```

## 💡 일상적 비유로 이해하기

### Docker = 택배 상자

```
앱 배포 (Docker 없이):
→ 컴퓨터 옮기기
→ 모든 환경 설정 다시 해야 함
→ 무겁고 오래 걸림 ❌

앱 배포 (Docker):
→ 택배 상자에 포장
→ 상자만 옮기면 끝
→ 어디서 열어도 똑같은 내용물 ✅
```

### Dockerfile = 요리 레시피

```
Dockerfile:
1. Python 3.9 준비 (재료)
2. 패키지 설치 (조리 과정)
3. 앱 복사 (플레이팅)
4. 실행 명령 (서빙)

→ 레시피대로 만들면 누구나 같은 요리
→ 한 번 작성하면 반복 가능
```

### Image = 붕어빵 틀

```
Image:
→ 한 번 만들면 여러 번 사용
→ 틀은 변하지 않음

Container:
→ 틀로 찍어낸 붕어빵
→ 각각 독립적
→ 하나 먹어도 다른 건 그대로
```

## 🎯 실제 사례 (P3 프로젝트)

### P3의 Docker 구성

```
P3 시스템:
- Frontend (React)
- Backend (FastAPI)
- Vector DB (ChromaDB)
- PostgreSQL
- Redis

Docker Compose로 한 번에 실행:
docker-compose up

→ 모든 서비스가 1분 안에 시작 ✅
→ 새 팀원도 바로 개발 가능
→ 환경 차이 문제 제로
```

### Dockerfile 예시 (P3 Backend)

```dockerfile
# 1. 베이스 이미지
FROM python:3.9-slim

# 2. 작업 디렉토리
WORKDIR /app

# 3. 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. 앱 코드 복사
COPY . .

# 5. 포트 노출
EXPOSE 8000

# 6. 실행 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (P3 전체 시스템)

```yaml
version: '3.8'

services:
  # FastAPI 백엔드
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/p3
    depends_on:
      - db
      - redis

  # PostgreSQL
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=p3
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # ChromaDB
  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma

volumes:
  postgres_data:
  chroma_data:
```

## 💻 코드 구현 (간단하게)

### 기본 명령어

```bash
# 1. 이미지 빌드
docker build -t p3-backend .
# Dockerfile을 읽어서 p3-backend 이미지 생성

# 2. 컨테이너 실행
docker run -p 8000:8000 p3-backend
# 이미지를 컨테이너로 실행
# 로컬 8000번 → 컨테이너 8000번 포트 매핑

# 3. 백그라운드 실행
docker run -d -p 8000:8000 p3-backend
# -d: detached mode (백그라운드)

# 4. 실행 중인 컨테이너 확인
docker ps
# 컨테이너 ID, 이름, 상태 확인

# 5. 컨테이너 중지
docker stop <container_id>

# 6. 컨테이너 삭제
docker rm <container_id>
```

### Docker Compose 사용

```bash
# 모든 서비스 시작
docker-compose up
# docker-compose.yml을 읽어서 실행

# 백그라운드로 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스만 재시작
docker-compose restart backend

# 모든 서비스 중지
docker-compose down

# 볼륨까지 삭제
docker-compose down -v
```

### 이미지 관리

```bash
# 이미지 목록
docker images

# 이미지 삭제
docker rmi p3-backend

# 이미지 태그
docker tag p3-backend:latest myrepo/p3-backend:v1.0

# Docker Hub에 푸시
docker push myrepo/p3-backend:v1.0

# Docker Hub에서 다운로드
docker pull postgres:15
```

### 디버깅

```bash
# 실행 중인 컨테이너 접속
docker exec -it <container_id> bash
# 내부에서 명령어 실행 가능

# 로그 확인
docker logs <container_id>
docker logs -f <container_id>  # 실시간 추적

# 리소스 사용량
docker stats
```

## 🔍 Docker vs VM

| 특성 | Docker | VM |
|------|--------|-----|
| 크기 | 작음 (MB 단위) | 큼 (GB 단위) |
| 부팅 | 1초 이내 | 수십 초 |
| 격리 | 프로세스 수준 | OS 수준 |
| 오버헤드 | 낮음 | 높음 |
| 이식성 | 높음 | 낮음 |

```
Docker (컨테이너):
→ Host OS 공유
→ 가볍고 빠름
→ 마이크로서비스에 적합

VM (가상머신):
→ 각자 Guest OS 보유
→ 무겁고 느림
→ 완전한 격리 필요 시
```

## 🚨 주의사항

### 1. 데이터 휘발성

```
문제:
컨테이너 삭제 시 내부 데이터도 삭제 ❌

해결: Volume 사용
docker run -v postgres_data:/var/lib/postgresql/data postgres
→ 데이터를 Host에 저장
→ 컨테이너 삭제해도 데이터 유지 ✅
```

### 2. 이미지 크기 최적화

```
❌ 나쁜 예:
FROM ubuntu:latest
RUN apt-get update && apt-get install python3
→ 1GB 이상

✅ 좋은 예:
FROM python:3.9-slim
→ 200MB 이하

추가 최적화:
- 멀티스테이지 빌드
- .dockerignore 사용
- 레이어 최소화
```

### 3. 보안

```
주의사항:
- Root 사용자로 실행 금지
- 민감 정보 이미지에 포함 금지
- 공식 이미지 사용
- 정기적으로 이미지 업데이트

좋은 습관:
USER appuser  # 일반 사용자로 실행
ENV secrets via environment variables
RUN apt-get clean  # 불필요한 파일 삭제
```

## 🔗 관련 용어

- [[Container]]: Docker가 만드는 실행 환경
- [[VM]]: 가상머신, Docker보다 무거움
- [[Kubernetes]]: 다수의 컨테이너 관리
- [[CI/CD]]: Docker로 자동 배포
- [[Microservices]]: Docker로 독립 배포

## 📝 정리

**Docker 핵심 3줄**:
```
1. 앱을 "택배 상자"로 포장 = 어디서나 동일 실행
2. VM보다 가볍고 빠름 (1초 부팅, MB 단위)
3. "내 컴퓨터에서는 되는데요?" 문제 해결

→ 현대 개발/배포의 필수 도구!
```

**비유로 기억하기**:
```
Docker = 택배 상자
→ Dockerfile = 포장 방법 (레시피)
→ Image = 포장된 상품 (템플릿)
→ Container = 배송된 택배 (실행 중)
→ Docker Hub = 물류 센터 (저장소)
```

**Docker vs VM**:
```
VM = 전체 컴퓨터 복사
→ 무겁고 (GB 단위)
→ 느림 (수십 초 부팅)

Docker = 앱만 격리
→ 가볍고 (MB 단위)
→ 빠름 (1초 부팅)

핵심 = OS 공유로 효율적!
```

**Docker 워크플로우**:
```
1. Dockerfile 작성 (레시피)
2. docker build (이미지 생성)
3. docker run (컨테이너 실행)
4. docker push (Hub에 공유)

팀원들:
5. docker pull (이미지 다운)
6. docker run (바로 실행)

핵심 = 한 번 만들면 어디서나 동일!
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
