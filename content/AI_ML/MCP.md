# MCP (Model Context Protocol)

## 📝 정의

MCP(Model Context Protocol)는 AI 애플리케이션이 **외부 도구와 데이터를 안전하게 연결**할 수 있도록 만든 표준 프로토콜입니다. 마치 USB가 모든 기기를 컴퓨터에 연결하는 표준인 것처럼, MCP는 AI가 다양한 서비스에 접근하는 표준 방식입니다.

### 핵심 개념

- **무엇인가?**: AI와 외부 도구를 연결하는 표준 규약
- **왜 필요한가?**: 도구마다 다른 연동 방식을 통일하기 위해
- **누가 만들었나?**: Anthropic이 개발한 오픈 프로토콜

### MCP가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: AI 앱 개발자의 고민
개발자: "AI가 파일을 읽고, DB를 조회하고, API도 호출하게 하고 싶어"
→ 각 기능마다 다른 연동 코드 작성 필요
→ 파일용 코드 + DB용 코드 + API용 코드... 너무 복잡! 😱

😱 시나리오 2: 보안 관리의 어려움
개발자: "파일 접근 권한은 어떻게 관리하지?"
→ 각 도구마다 다른 권한 관리 방식
→ 보안 취약점 발생 위험! 😱

😱 시나리오 3: 확장의 어려움
개발자: "새 기능을 추가하고 싶은데..."
→ 전체 코드를 다시 수정해야 함
→ 유지보수 지옥! 😱
```

**MCP의 해결**:
```
✅ 같은 상황:
모든 도구가 MCP 프로토콜을 따름
→ 표준화된 방식으로 통신
→ 한 번 배우면 모든 도구 사용 가능! ✅

✅ 보안:
MCP 서버가 권한 관리
→ 중앙화된 보안 정책
→ 안전한 데이터 접근! ✅

✅ 확장:
새 도구는 MCP 서버만 추가
→ 기존 코드 수정 불필요
→ 쉬운 확장! ✅
```

**비유**:
- **MCP 이전** = 각 가전제품마다 다른 플러그 (혼란)
- **MCP 이후** = USB처럼 표준 플러그 (간편)

또 다른 비유:
- **AI 앱** = 사장님
- **MCP** = 비서
- **MCP 서버들** = 각 부서 (파일부서, DB부서, API부서)
- 사장님이 "파일 가져와" → 비서가 파일부서에 전달 → 파일 반환

## 📊 작동 원리

MCP는 **클라이언트-서버 구조**로 작동합니다.

### 전체 구조

```도해
층: MCP, 어떻게 나뉘어 있나
MCP Client (AI 애플리케이션) :: Claude Desktop 또는 Custom AI App
MCP Protocol :: 표준 JSON-RPC 2.0 메시지 교환
MCP Servers (도구 제공자) :: Filesystem Server · Database Server · Slack Server · GitHub…
실제 시스템 :: (로컬 파일) · (PostgreSQL) · Slack API · GitHub API
```

### 주요 구성 요소

1. **MCP Client (클라이언트)**:
   - AI 애플리케이션 (예: Claude Desktop)
   - 사용자의 요청을 받아 MCP 서버에 전달
   - 결과를 받아 사용자에게 표시

2. **MCP Protocol (프로토콜)**:
   - JSON-RPC 2.0 기반의 표준 메시지 형식
   - 모든 MCP 서버가 이해하는 공통 언어

3. **MCP Server (서버)**:
   - 특정 기능을 제공하는 도구
   - 예: 파일 서버, DB 서버, API 서버
   - 각 서버는 자신의 기능을 MCP 형식으로 제공

## 🔄 동작 시퀀스

사용자가 "프로젝트 폴더의 파일 목록을 보여줘"라고 요청하는 경우:

```도해
흐름: MCP, 무슨 순서로 오가나
사용자 :: 프로젝트 폴더의 파일 목록 보여줘
MCP Client (AI Ap… :: JSON-RPC 요청 list_resources()
MCP Protocol :: 표준화된 요청
Filesystem Server :: 파일 시스템 조회
< 파일 시스템 :: 파일 목록 데이터
< Filesystem Server :: 표준 응답 형식 [file1.js, file2.py, ...]
< MCP Protocol :: JSON-RPC 응답
< MCP Client (AI Ap… :: 프로젝트 폴더에 3개의 파일이 있습니다: · file1.js…
```

### 각 단계 상세 설명

**1단계: 사용자 요청 분석**
- AI가 사용자의 자연어를 이해
- "파일 목록"이 필요하다는 것을 파악
- 어떤 MCP 서버를 사용할지 결정 (→ Filesystem Server)

**2단계: MCP 요청 변환**
- AI의 의도를 MCP 표준 메시지로 변환
- JSON-RPC 2.0 형식 사용
```json
{
  "jsonrpc": "2.0",
  "method": "resources/list",
  "params": {
    "path": "/project"
  },
  "id": 1
}
```

**3단계: MCP 서버 작업 수행**
- Filesystem Server가 요청 수신
- 실제 파일 시스템에 접근하여 데이터 조회
- 보안 정책 확인 (접근 권한이 있는가?)

**4단계: 표준 응답 반환**
- MCP 서버가 결과를 표준 형식으로 변환
```json
{
  "jsonrpc": "2.0",
  "result": {
    "resources": [
      {"uri": "file:///project/file1.js", "name": "file1.js"},
      {"uri": "file:///project/file2.py", "name": "file2.py"},
      {"uri": "file:///project/file3.md", "name": "file3.md"}
    ]
  },
  "id": 1
}
```

**5단계: 사용자 친화적 응답 생성**
- AI가 JSON 응답을 자연어로 변환
- 사용자에게 이해하기 쉬운 형태로 제공

## 💡 실제 예시

### MCP가 제공하는 3가지 기능


**1. Resources (리소스)** - "읽기 전용 데이터"
- 무엇인가? 읽을 수 있는 데이터 소스
- 예시: 파일 내용, DB 레코드, API 응답
- 특징: 변경하지 않고 조회만 함

**2. Tools (도구)** - "실행 가능한 작업"
- 무엇인가? AI가 호출할 수 있는 함수
- 예시: 파일 쓰기, DB 쿼리, 이메일 전송
- 특징: 실제 시스템을 변경할 수 있음

**3. Prompts (프롬프트)** - "재사용 템플릿"
- 무엇인가? 미리 정의된 프롬프트
- 예시: "코드 리뷰 해줘", "문서 요약해줘"
- 특징: 일관된 품질의 응답

### 기본 구현 예시

**Python으로 MCP 서버 만들기**:

```python
from mcp.server.fastmcp import FastMCP

# MCP 서버 초기화
mcp = FastMCP("My File Server")

# Tool 정의: 파일 읽기
@mcp.tool()
def read_file(path: str) -> str:
    """
    파일 내용을 읽습니다.

    Args:
        path: 읽을 파일 경로

    Returns:
        파일의 텍스트 내용
    """
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Tool 정의: 파일 목록 조회
@mcp.tool()
def list_files(directory: str) -> list[str]:
    """
    디렉토리의 파일 목록을 반환합니다.

    Args:
        directory: 조회할 디렉토리 경로

    Returns:
        파일명 리스트
    """
    import os
    return os.listdir(directory)

# Resource 정의: 파일을 리소스로 제공
@mcp.resource("file://{path}")
def get_file_resource(path: str) -> str:
    """
    파일을 리소스로 제공합니다.
    AI가 파일 내용에 직접 접근할 수 있게 합니다.
    """
    with open(path, 'r') as f:
        return f.read()

# 서버 실행
if __name__ == "__main__":
    mcp.run()
```

**각 부분 설명**:

1. **`@mcp.tool()` 데코레이터**:
   - 이 함수를 AI가 호출할 수 있는 "도구"로 등록
   - AI는 `read_file`이라는 이름으로 이 함수를 사용 가능

2. **함수 설명 (docstring)**:
   - AI가 이 도구를 언제 사용할지 판단하는 정보
   - 명확하게 작성할수록 AI가 적절히 사용

3. **`@mcp.resource()` 데코레이터**:
   - 데이터를 "리소스"로 제공
   - AI가 필요할 때 읽어갈 수 있음

### Claude Desktop에서 MCP 서버 설정하기

**설정 파일 위치**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    },
    "my-custom-server": {
      "command": "python",
      "args": ["/path/to/my_mcp_server.py"]
    }
  }
}
```

**설정 설명**:
- **filesystem**: 로컬 파일에 접근하는 MCP 서버
- **postgres**: PostgreSQL DB에 접근하는 MCP 서버
- **my-custom-server**: 내가 만든 커스텀 MCP 서버

설정 후 Claude를 재시작하면, Claude가 이 모든 서버를 사용할 수 있게 됩니다!

### 실제 사용 예시

```
사용자: "Documents 폴더에 어떤 파일들이 있어?"

Claude (내부):
1. filesystem MCP 서버에 list_files("/Users/username/Documents") 요청
2. MCP 서버가 파일 목록 반환: ["report.docx", "data.csv", "notes.txt"]
3. 결과를 사용자 친화적으로 변환

Claude (응답):
"Documents 폴더에 3개의 파일이 있습니다:
- report.docx (워드 문서)
- data.csv (데이터 파일)
- notes.txt (텍스트 노트)"
```

## 🎯 MCP vs 기존 방식

| 특성 | 기존 방식 | MCP |
|------|----------|-----|
| **통합 방식** | 도구마다 다름 | 표준 프로토콜 |
| **개발 난이도** | 각 도구별 학습 필요 | 한 번 학습으로 모든 도구 |
| **보안** | 각자 관리 | 중앙화된 권한 관리 |
| **확장성** | 새 도구마다 코드 수정 | 서버만 추가하면 됨 |
| **유지보수** | 복잡함 | 간단함 |

### 실제 비교 예시

**기존 방식 (MCP 없이)**:
```python
# 파일 접근용 코드
def read_file_old(path):
    with open(path) as f:
        return f.read()

# DB 접근용 코드
def query_db_old(sql):
    conn = psycopg2.connect(...)
    cursor = conn.cursor()
    cursor.execute(sql)
    return cursor.fetchall()

# Slack 접근용 코드
def send_slack_old(message):
    slack_client = WebClient(token=SLACK_TOKEN)
    response = slack_client.chat_postMessage(...)
    return response

# AI가 각각을 개별적으로 처리해야 함
# 새 도구 추가 시 전체 코드 수정 필요
```

**MCP 방식**:
```python
# 모든 도구가 표준 MCP 인터페이스 사용
# AI는 하나의 방식으로 모든 도구 사용
# 새 도구는 MCP 서버만 추가하면 됨

# Filesystem MCP Server
mcp.tool()(read_file)

# Database MCP Server
mcp.tool()(query_db)

# Slack MCP Server
mcp.tool()(send_slack)

# AI 입장에서는 모두 동일한 방식으로 호출
```

## 🔒 보안과 권한 관리

MCP는 **서버 수준에서 권한을 관리**합니다.


예시:
```python
# MCP 서버 설정 시 허용 경로 지정
{
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/username/Documents"  # ← 이 폴더만 접근 가능
    ]
  }
}

# AI가 "/Users/username/private" 접근 시도
# → MCP 서버가 차단
# → 사용자 보호
```

## 🔗 관련 용어

- [[AI Agent]]: MCP를 사용하여 다양한 도구에 접근하는 AI 시스템
- [[LLM]]: MCP 클라이언트의 핵심 추론 엔진
- [[JSON-RPC]]: MCP가 사용하는 통신 프로토콜
- [[RAG]]: MCP를 통해 외부 문서에 접근하는 패턴

## 📚 참고자료

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [FastMCP (Python)](https://github.com/jlowin/fastmcp)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
