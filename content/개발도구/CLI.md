# CLI (Command Line Interface)

## 📝 정의

CLI는 **텍스트 명령어로 컴퓨터를 제어하는 인터페이스**입니다. 마우스 클릭 대신 키보드로 명령어를 입력해서 작업합니다.

### 핵심 개념

- **무엇인가?**: 텍스트 기반 컴퓨터 제어 방식
- **왜 필요한가?**: 빠르고 자동화 가능
- **어떻게 작동하나?**: 명령어 입력 → 실행 → 결과 출력

## 🤔 왜 CLI가 필요한가?

### GUI만 사용할 때의 문제

**문제 1: 반복 작업이 비효율적**
```
100개 파일 이름 바꾸기:

GUI:
→ 파일 하나씩 클릭
→ 이름 변경 클릭
→ 새 이름 입력
→ 100번 반복 ❌
→ 10분 소요

CLI:
→ for f in *.txt; do mv "$f" "new_$f"; done
→ 1초 완료 ✅
```

**문제 2: 원격 서버 접근 어려움**
```
클라우드 서버 관리:
→ GUI 화면 전송은 느림
→ 네트워크 대역폭 많이 사용
→ 보안 위험 ❌

CLI (SSH):
→ 텍스트만 전송
→ 빠르고 안전 ✅
```

**문제 3: 자동화 불가**
```
매일 같은 작업 반복:
→ GUI는 수동 클릭 필요
→ 사람이 직접 해야 함 ❌

CLI 스크립트:
→ 한 번 작성하면 자동 실행
→ 매일 자동으로 처리 ✅
```

### CLI의 해결

```
✅ 빠른 작업
→ 타이핑이 클릭보다 빠름
→ 키보드만으로 모든 작업
→ 마우스 이동 시간 제로

✅ 자동화 가능
→ 명령어를 파일로 저장 (스크립트)
→ 반복 작업 자동화
→ 일정에 따라 실행 (cron)

✅ 강력함
→ 복잡한 작업 조합 가능
→ 파이프(|)로 연결
→ GUI로는 불가능한 작업
```

## 📊 구조

### CLI의 작동 구조

```도해
흐름: CLI, 무슨 순서로 오가나
사용자 :: 명령어 입력 ls -la
Terminal :: 전달
Shell :: 명령어 해석
Shell :: 시스템 호출
OS :: 파일 목록 읽기
< OS :: 결과 반환
< Shell :: 포맷팅
< Terminal :: 화면에 출력
```

### CLI vs GUI

```도해
층: CLI, 어떻게 나뉘어 있나
CLI (명령줄) :: 사용자] -->|텍스트 입력| B1[Shell
GUI (그래픽) :: 사용자] -->|마우스 클릭| B2[윈도우
```

## 🔄 작동 원리

### 명령어 실행 과정

```
1. 입력:
   $ git commit -m "Fix bug"

2. 파싱:
   명령어: git
   인자: commit, -m, "Fix bug"

3. 실행:
   git 프로그램 찾기
   commit 명령 실행
   메시지와 함께 저장

4. 출력:
   [main abc1234] Fix bug
   1 file changed, 3 insertions(+)
```

### 파이프와 리다이렉션

```bash
# 파이프 (|): 명령어 연결
cat file.txt | grep "error" | wc -l
→ 파일 읽기 → "error" 찾기 → 개수 세기

# 리다이렉션 (>): 출력을 파일로
ls -la > list.txt
→ 목록을 파일에 저장

# 리다이렉션 (>>): 추가
echo "new line" >> log.txt
→ 파일 끝에 추가
```

## 💡 일상적 비유로 이해하기

### CLI = 마법 주문

```
GUI (그래픽):
→ 마법 지팡이로 클릭
→ 한 번에 하나씩만
→ 눈으로 보면서 작업

CLI (명령어):
→ 마법 주문 외우기
→ 한 번에 여러 개
→ 강력하지만 배워야 함

예:
"파일 100개 삭제" 주문(명령어):
rm *.tmp
→ 1초 완료 ✅
```

### Terminal = 마법사의 지팡이

```
초보 마법사 (GUI):
→ 보이는 버튼만 클릭
→ 간단하지만 제한적

고급 마법사 (CLI):
→ 주문(명령어) 자유자재
→ 어렵지만 강력함
→ 조합해서 새 마법 창조
```

## 🎯 실제 사례 (P3 프로젝트)

### P3 개발에서의 CLI 사용

```bash
# 1. Git 작업 (매일)
git status
git add .
git commit -m "RAG 개선"
git push origin main

# 2. Docker 관리 (자주)
docker-compose up -d
docker ps
docker logs backend

# 3. 패키지 설치 (프로젝트 시작 시)
pip install -r requirements.txt
npm install

# 4. 서버 실행 (개발 중)
uvicorn main:app --reload

# 5. 로그 확인 (디버깅)
tail -f logs/app.log
grep "ERROR" logs/*.log
```

### 자동화 스크립트 예시

```bash
#!/bin/bash
# P3 배포 스크립트

echo "P3 시스템 배포 시작..."

# 1. 코드 업데이트
git pull origin main

# 2. 의존성 설치
pip install -r requirements.txt

# 3. 데이터베이스 마이그레이션
python manage.py migrate

# 4. 컨테이너 재시작
docker-compose restart backend

# 5. 헬스 체크
curl http://localhost:8000/health

echo "배포 완료!"
```

## 💻 코드 구현 (간단하게)

### 기본 명령어

```bash
# 파일 관리
ls              # 목록
ls -la          # 상세 목록
cd directory    # 이동
pwd             # 현재 위치
mkdir folder    # 폴더 생성
rm file.txt     # 삭제
cp src dst      # 복사
mv old new      # 이동/이름변경

# 텍스트 처리
cat file.txt    # 파일 내용 출력
grep "text"     # 텍스트 검색
sed 's/old/new/g'  # 치환
awk '{print $1}'   # 컬럼 추출
```

### 유용한 조합

```bash
# 에러 로그 찾기
grep "ERROR" *.log | wc -l
→ 에러 개수 세기

# 디스크 사용량 Top 10
du -sh * | sort -hr | head -10
→ 큰 파일/폴더 찾기

# 프로세스 확인
ps aux | grep python
→ Python 프로세스 찾기

# 파일 백업
tar -czf backup.tar.gz data/
→ 압축 백업
```

## 🔍 CLI vs GUI 비교

| 특성 | CLI | GUI |
|------|-----|-----|
| 속도 | 매우 빠름 | 느림 |
| 학습 | 어려움 | 쉬움 |
| 자동화 | 가능 | 어려움 |
| 원격 | 쉬움 | 어려움 |
| 정확성 | 높음 | 낮음 |

```
CLI 적합:
→ 반복 작업
→ 원격 서버 관리
→ 자동화
→ 대량 처리

GUI 적합:
→ 시각적 작업 (이미지, 디자인)
→ 탐색적 작업
→ 초보자
→ 직관적 필요
```

## 🚨 주의사항

### 1. 위험한 명령어

```bash
# ⚠️ 매우 위험!
rm -rf /
→ 모든 파일 삭제

rm -rf *
→ 현재 폴더 전체 삭제

# 안전하게:
rm -i file.txt
→ 삭제 전 확인
```

### 2. 권한 문제

```bash
# Permission denied
cat /etc/shadow
→ 권한 없음 ❌

# sudo 사용 (관리자 권한)
sudo cat /etc/shadow
→ 비밀번호 입력 후 실행 ✅

# 주의: sudo는 신중하게!
```

### 3. 명령어 이력

```bash
# 이전 명령어 보기
history

# 이전 명령어 재실행
!!

# 특정 명령어 검색
Ctrl + R
→ 타이핑하면 검색

# 이력 삭제 (민감 정보)
history -c
```

## 🔗 관련 용어

- [[Terminal]]: CLI를 실행하는 프로그램
- [[Shell]]: 명령어를 해석하는 프로그램
- [[Bash]]: 가장 흔한 Shell
- [[SSH]]: 원격 CLI 접속
- [[Script]]: CLI 명령어 모음

## 📝 정리

**CLI 핵심 3줄**:
```
1. 텍스트 명령어로 컴퓨터 제어
2. GUI보다 빠르고 자동화 가능
3. 개발자 필수 도구

→ 처음엔 어렵지만 익숙해지면 강력!
```

**비유로 기억하기**:
```
GUI = 마우스로 버튼 클릭
→ 쉽지만 느림
→ 반복 작업 비효율

CLI = 키보드로 주문 외우기
→ 어렵지만 빠름
→ 자동화 가능
→ 마법사의 지팡이
```

**CLI의 강점**:
```
속도:
→ 타이핑 > 마우스 이동

자동화:
→ 스크립트 작성
→ 반복 작업 자동

강력함:
→ 파이프로 명령어 조합
→ GUI 불가능한 작업

원격:
→ SSH로 서버 관리
→ 텍스트만 전송 (빠름)
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
