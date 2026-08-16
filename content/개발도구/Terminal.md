# Terminal (터미널)

## 📝 정의

Terminal은 **CLI 명령어를 입력하고 실행 결과를 보는 프로그램**입니다. 명령어와 컴퓨터 사이의 "창구" 역할을 합니다.

### 핵심 개념

- **무엇인가?**: CLI를 사용하기 위한 프로그램
- **왜 필요한가?**: 명령어 입출력 인터페이스 제공
- **어떻게 작동하나?**: Shell과 통신하며 명령어 전달

## 🤔 Terminal과 Shell의 차이

```
Terminal (터미널):
→ 창 (프로그램)
→ 입력 받고 출력 보여줌
→ 예: iTerm2, Windows Terminal

Shell (셸):
→ 통역사 (명령어 해석기)
→ 명령어를 해석하고 실행
→ 예: Bash, Zsh, PowerShell

비유:
Terminal = 전화기
Shell = 교환원
OS = 실제 업무 담당자
```

## 📊 구조

### Terminal의 구조


### Terminal의 구성 요소

```
┌─────────────────────────────────────┐
│ Terminal Window                     │
│                                     │
│ user@mac ~ % ls -la                │  ← 프롬프트 + 입력
│ drwxr-xr-x  10 user  staff   320   │  ← 출력
│ -rw-r--r--   1 user  staff  1234   │
│                                     │
│ user@mac ~ % █                     │  ← 커서
└─────────────────────────────────────┘

프롬프트 (Prompt):
→ user@mac: 사용자명@컴퓨터명
→ ~: 현재 위치 (홈 디렉토리)
→ %: 명령 대기 중

커서 (Cursor):
→ 입력 위치 표시
→ 깜빡이는 사각형/줄
```

## 🔄 작동 원리

### Terminal 실행 흐름

```도해
흐름: Terminal, 무슨 순서로 오가나
사용자 :: Terminal 실행
Terminal 앱 :: Shell 시작
Shell :: 프롬프트 표시
Terminal 앱 :: user@mac ~ %
사용자 :: python app.py" 입력
Terminal 앱 :: 명령어 전달
Shell :: Python 실행
프로그램 :: app.py 실행
프로그램 :: 결과/출력
Shell :: 전달
Terminal 앱 :: 화면에 출력
```

## 💡 일상적 비유로 이해하기

### Terminal = 은행 창구

```
은행 업무 보기:

고객 (사용자)
→ 창구 직원 (Terminal)
→ 내부 담당자 (Shell)
→ 금고/시스템 (OS)

Terminal:
→ 고객과 직접 대면
→ 요청 받고 결과 전달
→ 하지만 실제 일은 안 함

Shell:
→ 요청 해석
→ 적절한 담당자에게 전달
→ 결과 받아서 전달
```

## 🎯 실제 사례 (P3 프로젝트)

### P3 개발 시 Terminal 사용

```
하루 일과:

09:00 - Terminal 실행
→ iTerm2 열기
→ 프로젝트 폴더로 이동

09:10 - Git 작업
→ git pull origin main
→ git checkout -b feature/new

10:00 - 개발 서버 실행
→ docker-compose up
→ 여러 Tab에서 로그 확인

15:00 - 테스트
→ pytest tests/
→ 결과 확인

17:00 - 커밋 & 푸시
→ git add .
→ git commit
→ git push
```

### Tab과 Window 활용

```
Tab 1: 개발 서버
→ uvicorn main:app --reload

Tab 2: Git 작업
→ git status
→ git commit

Tab 3: 로그 확인
→ tail -f logs/app.log

Tab 4: Docker 관리
→ docker ps
→ docker logs backend

→ 여러 작업 동시 진행 ✅
```

## 💻 코드 구현 (간단하게)

### Terminal 기본 사용

```bash
# 새 Terminal 열기
Cmd + T (macOS)
Ctrl + Shift + T (Linux)

# Tab 이동
Cmd + 숫자 (macOS)
Ctrl + Tab (Linux)

# 화면 지우기
clear
또는 Cmd + K

# 명령어 중단
Ctrl + C

# 프로세스 일시정지
Ctrl + Z
```

### 유용한 단축키

```bash
# 이동
Ctrl + A: 줄 처음
Ctrl + E: 줄 끝
Ctrl + U: 줄 전체 삭제
Ctrl + W: 단어 삭제

# 검색
Ctrl + R: 명령어 이력 검색
Ctrl + L: 화면 지우기 (clear)

# 복사/붙여넣기
Cmd + C: 복사
Cmd + V: 붙여넣기
```

### Shell 변경

```bash
# 현재 Shell 확인
echo $SHELL
→ /bin/bash 또는 /bin/zsh

# 사용 가능한 Shell 목록
cat /etc/shells

# Shell 변경 (Bash → Zsh)
chsh -s /bin/zsh

# 다시 로그인하면 적용
```

## 🔍 주요 Terminal 프로그램

### macOS

**Terminal (기본)**:
- 가볍고 빠름
- 기본 기능만

**iTerm2 (추천)**:
- Split Panes (화면 분할)
- 검색 강화
- 테마/폰트 커스터마이징
- Hotkey Window

### Windows

**PowerShell**:
- Windows 기본
- 강력한 스크립팅
- .NET 통합

**Windows Terminal (추천)**:
- 여러 Shell 지원
- Tab 기능
- GPU 가속
- 테마 지원

**Git Bash**:
- Linux 명령어 사용 가능
- Git과 통합

### Linux

**GNOME Terminal (기본)**:
- 간단하고 빠름

**Terminator**:
- 화면 분할
- 여러 Terminal 동시

## 🚨 주의사항

### 1. Shell 설정 파일

```bash
# Bash
~/.bashrc     # 설정 파일
~/.bash_profile

# Zsh
~/.zshrc      # 설정 파일

# 수정 후 적용
source ~/.zshrc
```

### 2. PATH 환경 변수

```bash
# PATH 확인
echo $PATH

# PATH 추가 (임시)
export PATH=$PATH:/new/path

# PATH 추가 (영구)
# ~/.zshrc에 추가:
export PATH=$PATH:/new/path
```

### 3. 한글 깨짐

```bash
# 인코딩 확인
locale

# UTF-8로 설정
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8
```

## 🔗 관련 용어

- [[CLI]]: Terminal에서 사용하는 인터페이스
- [[Shell]]: Terminal에서 실행되는 명령어 해석기
- [[Bash]]: 가장 흔한 Shell
- [[SSH]]: 원격 Terminal 접속
- [[tmux]]: Terminal 멀티플렉서

## 📝 정리

**Terminal 핵심 3줄**:
```
1. CLI 명령어를 입력하는 "창"
2. Shell과 통신하며 명령 전달
3. 개발자의 작업 공간

→ Terminal ≠ Shell (자주 헷갈림!)
```

**비유로 기억하기**:
```
Terminal = 은행 창구
→ 고객(사용자)과 대면
→ 요청 받고 결과 전달
→ 실제 일은 Shell이 함

Shell = 내부 담당자
→ 요청 해석
→ 실제 업무 처리
→ 결과 Terminal로 전달
```

**Terminal vs Shell**:
```
Terminal (프로그램):
→ iTerm2, Windows Terminal
→ 입출력 인터페이스
→ 창 (Window)

Shell (해석기):
→ Bash, Zsh, PowerShell
→ 명령어 해석/실행
→ 로직 처리

둘은 다른 것!
```

---
*카테고리: 개발도구*
*생성일: 2026-02-15*
*마지막 업데이트: 2026-02-15*
