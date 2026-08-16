# MCP (Model Context Protocol)

## 📝 정의
**MCP (Model Context Protocol)**는 **AI 모델이 외부 데이터 소스 및 도구와 안전하게 통신하기 위한 표준 프로토콜**입니다.

Anthropic에서 개발했으며, LLM이 다양한 외부 시스템과 통합할 수 있는 표준화된 방법을 제공합니다.

### 한 줄 요약
> AI와 외부 도구를 연결하는 표준 통신 프로토콜 (JSON-RPC 2.0 기반)

### 비유
- 🔌 **USB 표준**: 다양한 장치를 같은 포트로 연결
- 📞 **전화 프로토콜**: 어떤 전화기든 같은 방식으로 통화 가능
- 🔧 **공구 규격**: 표준화된 나사와 볼트

## 🎯 핵심 개념

### 1. 표준화된 인터페이스 (Standardized Interface)
모든 외부 도구가 같은 방식으로 AI와 통신합니다.

```
Before MCP:
AI ─[Custom API 1]─> Tool A
AI ─[Custom API 2]─> Tool B
AI ─[Custom API 3]─> Tool C
→ 각 도구마다 다른 통합 방식

After MCP:
AI ─[MCP]─> Tool A
AI ─[MCP]─> Tool B
AI ─[MCP]─> Tool C
→ 하나의 표준 프로토콜
```

### 2. 클라이언트-서버 아키텍처 (Client-Server)
AI 애플리케이션이 클라이언트, 외부 도구가 서버입니다.

```
┌─────────────┐         MCP         ┌─────────────┐
│   Claude    │ ◄─────────────────► │  MCP Server │
│   (Client)  │   JSON-RPC 2.0      │  (Slack)    │
└─────────────┘                     └─────────────┘

                                    ┌─────────────┐
                    ◄─────────────► │  MCP Server │
                                    │  (Gmail)    │
                                    └─────────────┘

                                    ┌─────────────┐
                    ◄─────────────► │  MCP Server │
                                    │  (GitHub)   │
                                    └─────────────┘
```

### 3. 다중 전송 방식 (Multiple Transports)
MCP는 다양한 통신 방식을 지원합니다.

```
1. stdio (Standard Input/Output)
   - 로컬 프로세스 간 통신
   - 가장 간단하고 빠름

2. HTTP + SSE (Server-Sent Events)
   - 원격 서버와 통신
   - 웹 기반 통합

3. Custom Transports
   - 필요에 따라 확장 가능
```

### 4. JSON-RPC 2.0 기반 (JSON-RPC 2.0)
요청과 응답이 JSON-RPC 2.0 형식을 따릅니다.

```json
// 요청
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "city": "Seoul"
    }
  },
  "id": 1
}

// 응답
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Seoul: 25°C, Sunny"
      }
    ]
  },
  "id": 1
}
```

### 5. 리소스, 프롬프트, 도구 (Resources, Prompts, Tools)
MCP는 3가지 핵심 primitive를 제공합니다.

```
Resources (리소스):
- 읽을 수 있는 데이터 (파일, DB, API 등)
- 예: 문서, 이메일, 코드 파일

Prompts (프롬프트):
- 재사용 가능한 프롬프트 템플릿
- 예: "코드 리뷰 해줘", "요약해줘"

Tools (도구):
- AI가 호출할 수 있는 함수
- 예: send_email(), create_file(), search()
```

## ⚠️ 해결하는 문제

### 문제 1: AI 통합의 파편화 (Fragmentation)

**문제 상황**:
```python
# 각 서비스마다 다른 통합 방식
import slack_integration
import gmail_integration
import github_integration
import notion_integration

# 각각 다른 API, 다른 인증, 다른 데이터 형식
slack_client = slack_integration.Client(token, api_version="2.0")
gmail_client = gmail_integration.GmailAPI(credentials, scope="full")
github_client = github_integration.GitHub(pat, endpoint="v4")
notion_client = notion_integration.Client(api_key)
```

**문제점**:
- 🔴 각 서비스마다 통합 코드 작성 필요
- 🔴 API 변경 시 모든 통합 코드 수정
- 🔴 일관성 없는 에러 처리
- 🔴 개발 시간 증가

**MCP 해결**:
```python
# MCP로 표준화된 통합
from mcp import MCPClient

client = MCPClient()

# 모든 서버를 같은 방식으로 사용
slack = client.connect("slack")
gmail = client.connect("gmail")
github = client.connect("github")
notion = client.connect("notion")

# 일관된 인터페이스
result = await slack.call_tool("send_message", {"text": "Hello"})
```

### 문제 2: 도구 발견의 어려움 (Tool Discovery)

**문제 상황**:
```python
# AI가 사용 가능한 도구를 모름
# 개발자가 수동으로 도구 목록 작성 필요

available_tools = [
    {
        "name": "send_email",
        "description": "이메일 전송",
        "parameters": {...}
    },
    {
        "name": "create_calendar_event",
        "description": "일정 생성",
        "parameters": {...}
    },
    # ... 100개 도구
]
```

**MCP 해결**:
```python
# MCP 서버가 자동으로 도구 목록 제공
tools = await client.list_tools()

# AI가 자동으로 도구 발견
for tool in tools:
    print(f"{tool.name}: {tool.description}")

# send_email: 이메일 전송
# search_slack: Slack 메시지 검색
# create_file: 파일 생성
# ...
```

### 문제 3: 컨텍스트 관리의 복잡성

**문제 상황**:
```python
# AI에게 맥락을 전달하기 어려움

# 파일 내용을 읽어서 AI에게 전달
with open('document.txt', 'r') as f:
    content = f.read()

# DB 데이터를 읽어서 AI에게 전달
db_data = database.query("SELECT * FROM users")

# API 데이터를 읽어서 AI에게 전달
api_data = requests.get("https://api.example.com/data").json()

# 모두 수동으로 포매팅해서 전달
context = format_context(content, db_data, api_data)
ai_response = ai.generate(context)
```

**MCP 해결**:
```python
# MCP Resources로 자동 관리
resources = await client.list_resources()

# AI가 필요할 때 자동으로 리소스 읽기
# "document.txt 요약해줘" → MCP가 자동으로 파일 읽기
# "사용자 목록 보여줘" → MCP가 자동으로 DB 쿼리
```

## 🏗️ 구조

### MCP 아키텍처


### MCP 프로토콜 스택


### 통신 방식 비교

```도해
층: MCP, 어떻게 나뉘어 있나
stdio Transport :: MCP Client] <-->|stdin/stdout| Server1[MCP Server 같은 머신
HTTP + SSE Transport :: MCP Client] -->|HTTP POST| Server2[MCP Server 원격 서버
```

## ⚙️ 작동 원리

### 연결 및 통신 흐름


### JSON-RPC 2.0 메시지 흐름

```
클라이언트 → 서버 (요청):
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_slack",
    "arguments": {
      "query": "MCP 프로토콜",
      "limit": 10
    }
  },
  "id": 42
}

서버 → 클라이언트 (응답):
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "10개 결과 발견:\n1. MCP 프로토콜 설명\n2. ..."
      }
    ]
  },
  "id": 42
}

에러 응답:
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": "query는 필수 파라미터입니다"
  },
  "id": 42
}
```

## 💻 코드 구현

### 예시 1: MCP 서버 구현 (Python + FastMCP)

```python
from fastmcp import FastMCP

# MCP 서버 생성
mcp = FastMCP("My Tool Server")

# 도구 정의
@mcp.tool()
def calculate(operation: str, a: float, b: float) -> float:
    """
    간단한 계산기

    Args:
        operation: 연산 종류 (add, sub, mul, div)
        a: 첫 번째 숫자
        b: 두 번째 숫자
    """
    if operation == "add":
        return a + b
    elif operation == "sub":
        return a - b
    elif operation == "mul":
        return a * b
    elif operation == "div":
        return a / b if b != 0 else None

@mcp.tool()
async def send_email(to: str, subject: str, body: str) -> dict:
    """
    이메일 전송

    Args:
        to: 수신자 이메일
        subject: 제목
        body: 내용
    """
    # 실제 이메일 전송 로직
    import smtplib
    # ...

    return {"success": True, "message": f"Email sent to {to}"}

# 리소스 정의
@mcp.resource("file:///{path}")
def read_file(path: str) -> str:
    """파일 읽기"""
    with open(path, 'r') as f:
        return f.read()

# 프롬프트 템플릿
@mcp.prompt()
def code_review_prompt(code: str) -> str:
    """코드 리뷰 프롬프트"""
    return f"""
    다음 코드를 리뷰해주세요:

    ```
    {code}
    ```

    다음 관점에서 검토해주세요:
    1. 버그나 에러
    2. 성능 개선 가능 부분
    3. 코드 가독성
    4. 베스트 프랙티스
    """

# 서버 실행
if __name__ == "__main__":
    mcp.run()
```

### 예시 2: MCP 클라이언트 사용 (Claude Desktop)

```json
// Claude Desktop 설정 파일
// ~/Library/Application Support/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "filesystem": {
      "command": "python",
      "args": ["-m", "mcp_server_filesystem", "/Users/me/Documents"]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T12345"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token"
      }
    }
  }
}
```

### 예시 3: Node.js로 MCP 서버 구현

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// MCP 서버 생성
const server = new Server(
  {
    name: "weather-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 도구 목록
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "get_weather",
        description: "Get current weather for a city",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "City name",
            },
          },
          required: ["city"],
        },
      },
    ],
  };
});

// 도구 호출
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_weather") {
    const city = request.params.arguments?.city;

    // 날씨 API 호출
    const weather = await fetchWeather(city);

    return {
      content: [
        {
          type: "text",
          text: `${city}: ${weather.temp}°C, ${weather.description}`,
        },
      ],
    };
  }

  throw new Error("Unknown tool");
});

// stdio로 통신 시작
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 예시 4: 리소스와 프롬프트 구현

```python
from fastmcp import FastMCP

mcp = FastMCP("Document Server")

# 동적 리소스 (DB에서 읽기)
@mcp.resource("db://users/{user_id}")
async def get_user(user_id: int) -> dict:
    """사용자 정보 조회"""
    user = await db.query("SELECT * FROM users WHERE id = ?", user_id)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }

# 리소스 목록
@mcp.resource("db://users")
async def list_users() -> list:
    """모든 사용자 목록"""
    users = await db.query("SELECT * FROM users")
    return [{"id": u.id, "name": u.name} for u in users]

# 프롬프트 템플릿
@mcp.prompt()
def summarize_prompt(text: str, length: str = "medium") -> str:
    """문서 요약 프롬프트"""
    lengths = {
        "short": "1-2 문장",
        "medium": "1 문단",
        "long": "3-5 문단",
    }

    return f"""
    다음 텍스트를 {lengths[length]}으로 요약해주세요:

    {text}

    핵심 내용만 간결하게 요약해주세요.
    """

# 사용 예시 (Claude가 자동으로 호출)
# User: "db://users/123 정보 보여줘"
# → MCP가 get_user(123) 호출 → 결과 반환

# User: "이 문서 요약해줘"
# → MCP가 summarize_prompt() 호출 → 프롬프트 생성
```

### 예시 5: HTTP + SSE 전송 방식

```python
from fastmcp import FastMCP
from fastmcp.server.sse import sse_server

mcp = FastMCP("Remote Server")

@mcp.tool()
def search_database(query: str) -> list:
    """데이터베이스 검색"""
    results = db.search(query)
    return results

# SSE 서버로 실행 (원격 접속 가능)
if __name__ == "__main__":
    sse_server(mcp, host="0.0.0.0", port=8080)

# 클라이언트는 HTTP로 연결
# http://server:8080/sse
```

## 🔄 실제 사용 사례

### 사례 1: Slack 통합

```python
# MCP Slack 서버 사용
# Claude: "Slack에서 'MCP' 검색해줘"

# MCP가 자동으로:
# 1. tools/list로 search_messages 도구 발견
# 2. tools/call로 search_messages("MCP") 호출
# 3. 결과 반환

# 개발자는 아무것도 안 해도 됨!
```

### 사례 2: 파일 시스템 통합

```python
# MCP 파일 시스템 서버 사용
# Claude: "/Users/me/project/README.md 읽어줘"

# MCP가 자동으로:
# 1. resources/read 호출
# 2. 파일 내용 읽기
# 3. 내용 반환

# Claude: "이 파일에 TODO 추가해줘"
# MCP가 자동으로:
# 1. tools/call edit_file 호출
# 2. 파일 수정
```

### 사례 3: GitHub 통합

```python
# MCP GitHub 서버 사용
# Claude: "내 레포의 open issues 보여줘"

# MCP가 자동으로:
# 1. resources/list resources://github/issues
# 2. GitHub API 호출
# 3. 이슈 목록 반환

# Claude: "버그 이슈 하나 만들어줘"
# MCP가 자동으로:
# 1. tools/call create_issue
# 2. GitHub 이슈 생성
```

## 📊 MCP vs 기존 통합 방식

| 구분 | MCP | 직접 API 통합 | LangChain Tools |
|------|-----|---------------|-----------------|
| **표준화** | ✅ 표준 프로토콜 | ❌ 각자 다름 | ⚠️ 프레임워크 종속 |
| **도구 발견** | ✅ 자동 | ❌ 수동 코딩 | ✅ 자동 |
| **재사용성** | ✅ 높음 | ❌ 낮음 | ⚠️ 중간 |
| **유지보수** | ✅ 쉬움 | ❌ 어려움 | ⚠️ 중간 |
| **원격 통신** | ✅ 지원 | ⚠️ 직접 구현 | ❌ 제한적 |
| **보안** | ✅ 표준화됨 | ⚠️ 직접 구현 | ⚠️ 직접 구현 |
| **에코시스템** | 🆕 성장 중 | ✅ 성숙 | ✅ 성숙 |

## 🔐 보안 고려사항

### 1. 인증 및 권한
```python
# MCP 서버는 인증 체크 필요
@mcp.tool()
async def delete_file(path: str, api_key: str) -> dict:
    # API 키 검증
    if not verify_api_key(api_key):
        raise PermissionError("Invalid API key")

    # 권한 체크
    if not has_permission(api_key, path):
        raise PermissionError("No permission")

    os.remove(path)
    return {"success": True}
```

### 2. 입력 검증
```python
@mcp.tool()
def execute_command(command: str) -> str:
    # ⚠️ 위험: 임의 명령 실행
    # ✅ 안전: 허용된 명령만 실행

    allowed_commands = ["ls", "pwd", "whoami"]

    if command.split()[0] not in allowed_commands:
        raise ValueError("Command not allowed")

    return subprocess.check_output(command, shell=True)
```

## 🔗 관련 용어
- [[JSON-RPC]]: MCP의 기반 프로토콜
- [[SSE]]: MCP의 HTTP 전송 방식
- [[stdio]]: MCP의 로컬 전송 방식
- [[LLM Tool Use]]: AI가 도구를 사용하는 개념
- [[API Gateway]]: 유사한 통합 패턴

---
*카테고리: 네트워크*

## 📚 참고 자료
- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [FastMCP](https://github.com/jlowin/fastmcp)
