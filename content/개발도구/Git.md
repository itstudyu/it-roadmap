# Git (형상 관리 시스템)

## 📝 정의

Git은 **코드 변경 이력을 추적하고 관리하는 버전 관리 시스템**입니다. 마치 코드의 "타임머신"처럼, 언제든 과거로 돌아가거나 여러 개발자가 동시에 작업할 수 있게 해줍니다.

### 핵심 개념

- **무엇인가?**: 코드의 변경 이력을 저장하는 시스템
- **왜 필요한가?**: 협업, 백업, 실수 복구를 위해
- **어떻게 작동하나?**: 변경사항을 스냅샷으로 저장

## 🤔 왜 Git이 필요한가?

### Git이 없을 때의 문제

**문제 1: 파일명으로 버전 관리**
```
project.js
project_final.js
project_final_real.js
project_final_real_v2.js
project_final_real_v2_최종.js ❌

→ 어느 게 최신인지 모름
→ 뭐가 바뀌었는지 모름
→ 되돌리기 불가능
```

**문제 2: 협업 시 충돌**
```
A 개발자: login.js 수정 중...
B 개발자: login.js 수정 중...

→ 누구 코드를 쓸 것인가?
→ A의 작업이 B의 작업을 덮어씀 ❌
→ 충돌 해결 불가능
```

**문제 3: 실수 복구 불가**
```
중요한 코드 삭제...
→ 되돌릴 방법이 없음 ❌
→ 처음부터 다시 작성

버그 발생...
→ 언제부터 버그가 생겼는지 모름 ❌
→ 원인 파악 불가능
```

### Git의 해결

```
✅ 버전 관리
→ 모든 변경사항 자동 기록
→ 언제든 과거로 복구 가능
→ 변경 이력 추적 가능

✅ 협업
→ 각자 독립적으로 작업 (브랜치)
→ 자동 병합 + 충돌 감지
→ 누가 언제 뭘 바꿨는지 기록

✅ 백업
→ 원격 저장소에 자동 백업
→ 컴퓨터 고장나도 복구 가능
→ 여러 곳에 동기화
```

## 📊 구조

### Git의 3단계 구조


### 각 영역의 역할

```
Working Directory (작업 공간):
→ 실제 파일을 수정하는 곳
→ git add 전 상태

Staging Area (스테이징):
→ 커밋할 변경사항을 준비하는 곳
→ 선택적으로 파일 추가 가능
→ git commit 전 상태

Repository (로컬 저장소):
→ 변경 이력이 저장되는 곳
→ 커밋된 스냅샷들
→ git push 전 상태

Remote Repository (원격 저장소):
→ GitHub, GitLab 등
→ 백업 + 협업 공간
→ 다른 개발자와 공유
```

## 🔄 작동 원리

### 기본 워크플로우

```도해
흐름: Git, 무슨 순서로 오가나
Working Directory :: login.js 수정
Working Directory :: git add login.js
Staging Area :: git commit -m "로그인 기능 추가
Repository :: git push origin main
```

### 브랜치 작업 흐름


## 💡 일상적 비유로 이해하기

### Git = 게임의 세이브 포인트

```
게임 플레이:
→ 보스 앞에서 세이브 (git commit)
→ 보스 도전
→ 실패하면 로드 (git reset)
→ 다시 도전!

코드 작업:
→ 기능 완성 후 커밋 (git commit)
→ 새 기능 추가
→ 버그 발생하면 복구 (git reset)
→ 다시 작업!
```

### 브랜치 = 평행 우주

```
main 브랜치 (현실 세계):
→ 안정적인 코드

feature 브랜치 (평행 우주):
→ 실험적인 기능 개발
→ 망가져도 main에 영향 없음
→ 성공하면 main에 병합 (merge)
```

### GitHub = 클라우드 저장소

```
로컬 Git:
→ 내 컴퓨터에만 저장
→ 컴퓨터 고장나면 끝

GitHub (원격):
→ 클라우드에 백업
→ 다른 컴퓨터에서도 접근
→ 팀원들과 공유
```

## 🎯 실제 사례 (P3 프로젝트)

### P3 개발 시나리오

```
1. 새 기능 개발
main (프로덕션) ─┬─ feature/rag-improvement
                 │  → RAG 정확도 개선 작업
                 │  → 실험 중이라 불안정
                 │
                 └─ 영향 없음 ✅

2. 기능 완성 후 병합
feature/rag-improvement ─→ main
→ 테스트 완료 후 프로덕션에 반영

3. 버그 발견
git log → 언제 버그가 생겼나?
git diff → 무엇이 바뀌었나?
git revert → 해당 커밋 되돌리기
```

### 협업 시나리오

```
개발자 A: 육아휴직 검색 개선
→ git checkout -b feature/parental-leave
→ 작업 완료 후 git push

개발자 B: 연차휴가 검색 개선
→ git checkout -b feature/annual-leave
→ 독립적으로 작업 ✅

나중에 병합:
→ git merge feature/parental-leave
→ git merge feature/annual-leave
→ 충돌 발생 시 자동 감지
```

## 💻 코드 구현 (간단하게)

### 기본 명령어

```bash
# 1. 저장소 초기화
git init
# 현재 폴더를 Git 저장소로 만듦

# 2. 파일 추가 (스테이징)
git add login.js          # 특정 파일
git add .                 # 모든 변경 파일

# 3. 커밋 (스냅샷 저장)
git commit -m "로그인 기능 추가"
# 메시지는 무엇을 바꿨는지 명확히

# 4. 원격 저장소 연결
git remote add origin https://github.com/user/project.git

# 5. 푸시 (원격에 업로드)
git push origin main
```

### 브랜치 작업

```bash
# 브랜치 생성 + 이동
git checkout -b feature/new-search
# 또는 최신 방식:
git switch -c feature/new-search

# 작업 후 커밋
git add .
git commit -m "검색 기능 개선"

# main 브랜치로 돌아가기
git checkout main

# feature 브랜치 병합
git merge feature/new-search
```

### 실수 복구

```bash
# 마지막 커밋 취소 (작업 내용 유지)
git reset HEAD~1

# 특정 커밋으로 되돌리기
git reset --hard abc1234

# 특정 커밋 되돌리기 (새 커밋 생성)
git revert abc1234
# 이력은 남기면서 변경사항만 되돌림

# 파일 변경 취소
git checkout -- login.js
```

### 이력 확인

```bash
# 커밋 이력 보기
git log --oneline --graph
# 그래프로 브랜치 구조 확인

# 변경사항 확인
git diff                  # 아직 add 안 한 변경사항
git diff --staged         # add 한 변경사항
git diff main feature     # 브랜치 간 차이

# 파일별 변경 이력
git log -p login.js
```

## 🔍 Git vs 다른 버전 관리

| 특성 | Git | SVN |
|------|-----|-----|
| 방식 | 분산형 | 중앙집중형 |
| 속도 | 빠름 | 느림 |
| 오프라인 | 가능 | 불가능 |
| 브랜치 | 쉬움 | 어려움 |
| 사용 | 대부분 | 레거시 |

```
Git (분산형):
→ 각자 전체 이력 보유
→ 오프라인 작업 가능
→ 빠름

SVN (중앙집중형):
→ 서버에만 이력 보관
→ 항상 서버 연결 필요
→ 느림
```

## 🚨 주의사항

### 1. 커밋 메시지 잘 쓰기

```
❌ 나쁜 예:
git commit -m "수정"
git commit -m "버그 수정"

✅ 좋은 예:
git commit -m "육아휴직 검색 정확도 개선"
git commit -m "RAG 임계값 0.7로 조정"
git commit -m "벡터 DB 캐싱 추가로 속도 2배 향상"
```

### 2. 민감 정보 커밋 금지

```
절대 커밋하면 안 되는 것:
- API 키, 비밀번호
- .env 파일
- 개인정보
- 데이터베이스 덤프

해결: .gitignore 사용
.env
*.log
node_modules/
```

### 3. main 브랜치 직접 수정 피하기

```
❌ 나쁜 습관:
main 브랜치에서 직접 작업
→ 버그 생기면 프로덕션 영향

✅ 좋은 습관:
feature 브랜치 생성 → 작업 → 테스트 → main 병합
→ main은 항상 안정적
```

## 🔗 관련 용어

- [[GitHub]]: Git 원격 저장소 호스팅 서비스
- [[CLI]]: Git 명령어를 실행하는 환경
- [[Terminal]]: Git 명령어 입력 도구
- [[Docker]]: Git으로 Dockerfile 관리
- [[CI/CD]]: Git 푸시 시 자동 배포

## 📝 정리

**Git 핵심 3줄**:
```
1. 코드의 타임머신 = 언제든 과거로 복구
2. 브랜치 = 독립적 작업 공간
3. GitHub = 백업 + 협업 플랫폼

→ 협업 필수 도구!
```

**비유로 기억하기**:
```
Git = 게임의 세이브 포인트
→ 커밋 = 세이브
→ 체크아웃 = 로드
→ 브랜치 = 평행 우주
→ GitHub = 클라우드 저장
```

**Git 워크플로우**:
```
1. git checkout -b feature (브랜치 생성)
2. 코드 수정
3. git add . (스테이징)
4. git commit -m "메시지" (커밋)
5. git push origin feature (푸시)
6. git checkout main (메인으로)
7. git merge feature (병합)

핵심 = 독립적으로 작업 → 병합!
```

**협업 흐름**:
```
1. git clone (프로젝트 복사)
2. git checkout -b my-feature (브랜치)
3. 작업 + 커밋
4. git push (원격에 푸시)
5. Pull Request 생성
6. 코드 리뷰
7. main 병합

핵심 = 혼자 작업 → 리뷰 → 병합!
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
