# curl (Client URL)

## 📝 정의

curl(Client URL)은 URL을 사용하여 데이터를 전송하고 받는 **명령줄 도구**입니다. HTTP, HTTPS, FTP 등 다양한 프로토콜을 지원하며, API 테스트, 파일 다운로드, 웹 스크래핑 등에 널리 사용됩니다.

### 핵심 개념

- **무엇인가?**: 터미널에서 HTTP 요청을 보내는 명령어
- **왜 필요한가?**: GUI 없이 빠르게 API 테스트, 자동화, 스크립트 작성 가능
- **어떻게 작동하나?**: 서버에 요청 전송 → 응답 수신 → 결과 출력/저장

### curl이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: API 테스트가 번거로움
개발자: "API 테스트하려면..."
→ Postman 실행
→ 요청 설정 입력
→ 매번 GUI 조작
→ 시간 낭비! 😱

😱 시나리오 2: 자동화 불가능
DevOps: "매일 API 상태 확인하고 싶어"
GUI 도구: 수동으로만 가능
→ 자동화 불가! 😱

😱 시나리오 3: 서버에서 테스트 필요
서버 (GUI 없음): "API 테스트하려면?"
Postman: 설치 불가
→ 테스트 못 함! 😱

😱 시나리오 4: 빠른 다운로드 필요
사용자: "100개 파일 다운로드"
브라우저: 하나씩 클릭...
→ 시간 오래 걸림! 😱
```

**curl의 해결**:
```
✅ 시나리오 1 (한 줄 명령어):
curl https://api.example.com/users
→ 즉시 응답 확인! ✅

✅ 시나리오 2 (스크립트 자동화):
#!/bin/bash
curl https://api.example.com/health
→ cron으로 매일 자동 실행 ✅

✅ 시나리오 3 (서버에서 실행):
ssh server
curl https://api.example.com/test
→ 어디서든 테스트 가능 ✅

✅ 시나리오 4 (병렬 다운로드):
cat urls.txt | xargs -P 10 curl -O
→ 10개 동시 다운로드! ✅
```

**비유**:
- **Postman (GUI)** = 레스토랑에서 직접 주문 (편하지만 느림)
- **curl (CLI)** = 전화로 주문 (빠르고 자동화 가능)

## 📊 curl 작동 원리

```도해
흐름: curl, 무슨 순서로 오가나
사용자 (터미널) :: 명령 실행
curl 명령어 :: HTTP GET 요청 GET /users HTTP/1.1
서버 :: 요청 처리
< 서버 :: HTTP 응답 200 OK + JSON 데이터
< curl 명령어 :: 결과 출력 (터미널)
```

## 💡 실제 사용

### 1. GET 요청 (조회)

```bash
# 기본 GET 요청
curl https://api.example.com/users

# 응답을 파일로 저장
curl https://api.example.com/users -o users.json

# 응답 헤더 포함 (디버깅)
curl -i https://api.example.com/users

# 자세한 정보 출력 (요청/응답 전체)
curl -v https://api.example.com/users
```

**출력 예시**:
```json
{
  "users": [
    {"id": 1, "name": "김철수"},
    {"id": 2, "name": "이영희"}
  ]
}
```

### 2. POST 요청 (생성)

```bash
# JSON 데이터 전송
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"김철수","email":"kim@example.com"}'

# 파일에서 데이터 읽기
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @data.json

# Form 데이터 전송
curl -X POST https://api.example.com/login \
  -d "username=admin&password=1234"

# 파일 업로드
curl -X POST https://api.example.com/upload \
  -F "file=@document.pdf" \
  -F "description=계약서"
```

**옵션 설명**:
- `-X POST`: HTTP 메서드를 POST로 지정
- `-H`: HTTP 헤더 추가
- `-d`: 데이터 전송 (data)
- `-d @파일명`: 파일에서 데이터 읽기
- `-F`: 파일 업로드 (form-data)

### 3. 인증

```bash
# Basic Auth (사용자명:비밀번호)
curl -u username:password https://api.example.com/protected

# Bearer Token (JWT)
curl -H "Authorization: Bearer your-token-here" \
  https://api.example.com/protected

# API Key
curl -H "X-API-Key: your-api-key" \
  https://api.example.com/data
```

### 4. PUT / DELETE 요청

```bash
# PUT (수정)
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"이영희"}'

# DELETE (삭제)
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer token"
```

## 🎯 실용 예시

### API 테스트 스크립트

```bash
#!/bin/bash

API_URL="https://api.example.com"
TOKEN="your-jwt-token"

echo "=== 1. 사용자 목록 조회 ==="
curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_URL/users" | jq .

echo "\n=== 2. 새 사용자 생성 ==="
curl -s -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","email":"test@example.com"}' \
  | jq .

echo "\n=== 3. 사용자 정보 수정 ==="
curl -s -X PUT "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"수정됨"}' \
  | jq .

echo "\n=== 4. 사용자 삭제 ==="
curl -s -X DELETE "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN"

echo "\n✅ 테스트 완료"
```

**실행**:
```bash
chmod +x api-test.sh
./api-test.sh
```

### 파일 다운로드

```bash
# 단순 다운로드 (원본 파일명)
curl -O https://example.com/file.zip

# 다른 이름으로 저장
curl -o my-file.zip https://example.com/file.zip

# 이어받기 (Resume, 중단된 다운로드 계속)
curl -C - -O https://example.com/large-file.zip

# 진행 표시 바
curl --progress-bar -O https://example.com/file.zip

# 여러 파일 동시 다운로드
cat urls.txt | xargs -n 1 -P 10 curl -O
```

### 성능 측정

```bash
# 응답 시간 측정
curl -w "\n응답 시간: %{time_total}초\n" \
  -o /dev/null -s https://api.example.com

# 상세 성능 정보
curl -w "DNS 조회: %{time_namelookup}s\n연결: %{time_connect}s\n전송 시작: %{time_starttransfer}s\n총 시간: %{time_total}s\n" \
  -o /dev/null -s https://api.example.com
```

**출력 예시**:
```
DNS 조회: 0.050s
연결: 0.120s
전송 시작: 0.250s
총 시간: 0.300s
```

### 웹 스크래핑

```bash
# HTML 가져오기
curl https://example.com > page.html

# 특정 요소만 추출 (grep 사용)
curl -s https://example.com | grep "<title>"

# 리다이렉트 따라가기
curl -L https://example.com

# User-Agent 변경 (봇 차단 우회)
curl -A "Mozilla/5.0" https://example.com
```

## 📊 주요 옵션

| 옵션 | 설명 | 예시 |
|------|------|------|
| `-X` | HTTP 메서드 지정 | `-X POST`, `-X DELETE` |
| `-H` | 헤더 추가 | `-H "Content-Type: application/json"` |
| `-d` | 데이터 전송 | `-d '{"key":"value"}'` |
| `-o` | 파일로 저장 (이름 지정) | `-o output.json` |
| `-O` | 원본 파일명으로 저장 | `-O` |
| `-i` | 응답 헤더 포함 | `-i` |
| `-v` | 상세 정보 출력 (verbose) | `-v` |
| `-s` | 진행 표시 숨김 (silent) | `-s` |
| `-u` | 인증 정보 | `-u user:pass` |
| `-L` | 리다이렉트 따라가기 | `-L` |
| `-k` | SSL 인증서 검증 무시 | `-k` (개발용만!) |
| `-C -` | 이어받기 | `-C -` |

## 🔧 고급 사용

### 쿠키 관리

```bash
# 쿠키 저장
curl -c cookies.txt https://example.com/login \
  -d "username=admin&password=1234"

# 저장된 쿠키 사용
curl -b cookies.txt https://example.com/dashboard

# 쿠키 직접 전송
curl -b "session_id=abc123" https://example.com/api
```

### 프록시 사용

```bash
# HTTP 프록시
curl -x http://proxy.example.com:8080 https://api.example.com

# 인증이 필요한 프록시
curl -x http://proxy.example.com:8080 \
  -U proxyuser:proxypass \
  https://api.example.com
```

### 조건부 요청

```bash
# 파일이 변경된 경우만 다운로드
curl -z file.txt -O https://example.com/file.txt

# 특정 날짜 이후 변경된 경우만
curl -z "2024-01-01" -O https://example.com/file.txt
```

## 🎯 curl vs 다른 도구

| 도구 | 특징 | 사용 시기 |
|------|------|----------|
| **curl** | 명령줄, 스크립트 자동화 | 서버, 자동화, 빠른 테스트 |
| **wget** | 파일 다운로드 특화, 재귀 다운로드 | 웹사이트 전체 다운로드 |
| **Postman** | GUI, 시각적, 컬렉션 관리 | 복잡한 API 개발/문서화 |
| **httpie** | 사용자 친화적 CLI | 터미널에서 예쁜 출력 |

**선택 가이드**:
```
빠른 테스트 → curl
자동화 스크립트 → curl
파일 다운로드 → curl / wget
GUI 필요 → Postman
예쁜 CLI → httpie
```

## 🔗 유용한 조합

### curl + jq (JSON 파싱)

```bash
# 사용자 이름만 추출
curl -s https://api.example.com/users | jq '.users[].name'

# 특정 필드만 추출
curl -s https://api.example.com/users | jq '.users[] | {id, name}'
```

### curl + grep (텍스트 검색)

```bash
# 특정 키워드 검색
curl -s https://example.com | grep "keyword"

# 이메일 주소 추출
curl -s https://example.com | grep -oE '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
```

### 반복 실행 (모니터링)

```bash
# 10초마다 API 상태 확인
watch -n 10 'curl -s https://api.example.com/health | jq .'

# 실패 시 알림
while true; do
  curl -f https://api.example.com/health || echo "⚠️ API 다운!"
  sleep 60
done
```

## 🔗 관련 용어

- [[HTTP]]: curl이 사용하는 주요 프로토콜
- [[API]]: curl로 테스트하는 대상
- [[Token 인증]]: curl로 인증 테스트
- [[JSON]]: curl 응답 데이터 형식

## 📚 참고자료

- [curl 공식 문서](https://curl.se/docs/)
- [curl Cheat Sheet](https://devhints.io/curl)
- [Everything curl](https://everything.curl.dev/) - 완전한 가이드

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
