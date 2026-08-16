# MCP (Model Context Protocol)

## 📝 정의

MCP는 **AI 애플리케이션과 외부 시스템을 연결하는 표준 프로토콜**입니다. Anthropic이 개발한 오픈소스 표준으로, LLM이 데이터베이스, API, 파일 시스템 등에 안전하게 접근할 수 있게 합니다.

### 핵심 개념

- **무엇인가?**: LLM ↔ 외부 시스템 연결 표준
- **왜 필요한가?**: LLM이 실시간 데이터와 외부 도구를 사용하게 하기 위해
- **어떻게 작동하나?**: Host (AI 앱) ↔ MCP Server ↔ External System

### MCP가 해결하는 문제

**기존 방식의 문제**:
```
😱 시나리오 1: 커스텀 통합마다 새로 개발
DB 연결: 커스텀 코드
API 연결: 또 다른 커스텀 코드
파일 시스템: 또 다른 커스텀 코드
→ 중복 작업! 표준 없음! 😱

😱 시나리오 2: 보안 문제
LLM이 DB에 직접 접근
→ SQL Injection 위험! 😱
→ 권한 관리 어려움! 😱

😱 시나리오 3: 재사용 불가
A 프로젝트에서 만든 DB 통합
→ B 프로젝트에서 사용 불가! 😱
→ 매번 새로 만들어야 함! 😱
```

**MCP의 해결**:
```
✅ 표준 프로토콜
MCP Server 한 번 만들면
→ 모든 MCP 클라이언트에서 사용 가능! ✅
→ Claude Desktop, VSCode, 웹앱 모두 호환 ✅

✅ 보안 강화
MCP Server가 중간에서 검증
→ 안전한 접근만 허용 ✅
→ 권한 관리 쉬움 ✅

✅ 재사용 가능
한 번 만든 MCP Server
→ 여러 프로젝트에서 재사용 ✅
→ 커뮤니티 공유 가능 ✅
```

## 📊 MCP 아키텍처


**구성 요소**:
```python
mcp_components = {
    "MCP Host": {
        "역할": "AI 애플리케이션 (Claude, GPT)",
        "기능": "MCP Server 연결 관리",
        "예시": "Claude Desktop, VSCode Extension"
    },
    "MCP Server": {
        "역할": "외부 시스템 연결 제공",
        "기능": "Tools, Prompts, Resources 제공",
        "예시": "DB MCP, File MCP, Slack MCP"
    },
    "External System": {
        "역할": "실제 데이터/기능 제공",
        "기능": "DB, API, 파일 등",
        "예시": "PostgreSQL, GitHub API, Local Files"
    }
}
```

## 💡 MCP Server 구현

### 1. 기본 MCP Server (FastMCP)

```python
from fastmcp import FastMCP

# MCP Server 생성
mcp = FastMCP("P3 Regulations")

# Tool 정의
@mcp.tool()
def search_regulation(query: str) -> str:
    """취업규칙 검색
    
    Args:
        query: 검색 질문
    
    Returns:
        관련 조항 내용
    """
    # Vector DB 검색
    results = vector_db.search(query, top_k=3)
    
    # 결과 포매팅
    output = []
    for result in results:
        output.append(f"제{result['section']}조: {result['content']}")
    
    return "\n\n".join(output)

@mcp.tool()
def get_regulation(section: int) -> str:
    """특정 조항 조회
    
    Args:
        section: 조항 번호 (예: 32)
    
    Returns:
        조항 전체 내용
    """
    doc = db.query(f"SELECT * FROM regulations WHERE section = {section}")
    
    if not doc:
        return f"제{section}조를 찾을 수 없습니다."
    
    return doc['content']

# Resource 정의
@mcp.resource("regulation://section/{section}")
def get_regulation_resource(section: int) -> str:
    """조항을 Resource로 제공"""
    return get_regulation(section)

# Prompt 정의
@mcp.prompt()
def regulation_qa_prompt(question: str) -> str:
    """취업규칙 Q&A 프롬프트"""
    return f"""
당신은 취업규칙 전문가입니다.

질문: {question}

규칙:
1. 조항 번호 명시
2. 정확한 답변
3. 출처 제공

답변:
"""

# 서버 실행
if __name__ == "__main__":
    mcp.run()
```

### 2. P3 DB MCP Server

```python
from fastmcp import FastMCP
import psycopg2

mcp = FastMCP("P3 Database MCP")

# DB 연결
conn = psycopg2.connect(
    host="localhost",
    database="p3_db",
    user="p3_user",
    password="secret"
)

@mcp.tool()
def query_database(sql: str, company_id: str) -> list:
    """데이터베이스 쿼리
    
    Args:
        sql: SQL 쿼리 (SELECT만 허용)
        company_id: 회사 ID (권한 확인)
    
    Returns:
        쿼리 결과
    """
    # 보안: SELECT만 허용
    if not sql.strip().upper().startswith("SELECT"):
        return {"error": "SELECT 쿼리만 허용됩니다"}
    
    # 보안: 회사 ID 필터링 강제
    if "WHERE" in sql.upper():
        sql += f" AND company_id = '{company_id}'"
    else:
        sql += f" WHERE company_id = '{company_id}'"
    
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        return results
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_employee_info(employee_id: str, company_id: str) -> dict:
    """직원 정보 조회
    
    Args:
        employee_id: 직원 ID
        company_id: 회사 ID
    
    Returns:
        직원 정보
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name, department, position, hire_date
        FROM employees
        WHERE employee_id = %s AND company_id = %s
    """, (employee_id, company_id))
    
    result = cursor.fetchone()
    
    if not result:
        return {"error": "직원을 찾을 수 없습니다"}
    
    return {
        "name": result[0],
        "department": result[1],
        "position": result[2],
        "hire_date": result[3].isoformat()
    }

if __name__ == "__main__":
    mcp.run()
```

### 3. MCP Client 사용 (Claude Desktop)

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "p3-regulations": {
      "command": "python",
      "args": ["/path/to/p3_mcp_server.py"],
      "env": {
        "DB_HOST": "localhost",
        "DB_NAME": "p3_db"
      }
    },
    "p3-database": {
      "command": "python",
      "args": ["/path/to/p3_db_mcp.py"]
    }
  }
}
```

**Claude Desktop에서 사용**:
```
User: 제32조 내용을 보여줘

Claude: [search_regulation tool 호출]
→ 제32조 (육아휴직): 종업원은 1세 미만의 자녀를 양육하기 위해 육아휴직을 신청할 수 있다. 기간은 최대 2년이다.

User: 직원 E001의 정보를 조회해줘

Claude: [get_employee_info tool 호출]
→ 이름: 홍길동
   부서: 개발팀
   직급: 선임
   입사일: 2020-03-15
```

## 🎯 P3 시스템의 MCP 활용

### P3 아키텍처에서 MCP 역할

```python
p3_mcp_architecture = {
    "Chatbot Agent": {
        "MCP 사용": "DB MCP, Slack MCP",
        "기능": "대화 + 데이터 조회 + 알림"
    },
    "Knowledge Search": {
        "MCP 사용": "Vector DB MCP",
        "기능": "취업규칙 검색"
    },
    "슈퍼코페루군": {
        "MCP 사용": "QueryPie MCP",
        "기능": "안전한 DB 쿼리"
    }
}
```

**예시: Chatbot Agent의 MCP 활용**:
```python
class P3ChatbotWithMCP:
    """MCP를 활용한 P3 Chatbot"""
    
    def __init__(self):
        # MCP Servers 연결
        self.regulation_mcp = MCPClient("p3-regulations")
        self.db_mcp = MCPClient("p3-database")
        self.slack_mcp = MCPClient("slack")
    
    def process_query(self, query: str, user_id: str, company_id: str):
        """쿼리 처리"""
        
        # 1. 의도 파악
        intent = self.classify_intent(query)
        
        if intent == "regulation_search":
            # MCP: 취업규칙 검색
            results = self.regulation_mcp.call_tool(
                "search_regulation",
                {"query": query}
            )
            answer = self.generate_answer(query, results)
            
        elif intent == "employee_info":
            # MCP: DB 조회
            info = self.db_mcp.call_tool(
                "get_employee_info",
                {"employee_id": user_id, "company_id": company_id}
            )
            answer = self.format_employee_info(info)
            
        elif intent == "notification":
            # MCP: Slack 알림
            self.slack_mcp.call_tool(
                "send_message",
                {"channel": "hr-notices", "text": query}
            )
            answer = "알림을 전송했습니다."
        
        return answer
```

## 🚀 MCP의 장점

### 1. 표준화

```python
# MCP 이전: 각각 다른 방식
claude_integration = {
    "method": "Custom API",
    "code": "1000 lines"
}
gpt_integration = {
    "method": "Function Calling",
    "code": "1200 lines"
}

# MCP 이후: 동일한 방식
mcp_server = {
    "method": "MCP Protocol",
    "code": "200 lines",
    "compatible": ["Claude", "GPT", "Gemini", "Custom Apps"]
}
```

### 2. 보안

```python
# MCP 없이: 직접 접근
llm_query = "DELETE FROM users"  # 😱 위험!
db.execute(llm_query)

# MCP 있음: 안전한 접근
@mcp.tool()
def safe_query(sql: str):
    # 검증
    if not sql.startswith("SELECT"):
        raise ValueError("SELECT만 허용")
    
    # 제한
    sql += " LIMIT 100"
    
    return db.execute(sql)  # ✅ 안전
```

### 3. 재사용성

```python
# 한 번 만든 MCP Server
# → 여러 곳에서 사용

# 프로젝트 A
claude_app_a.connect_mcp("p3-regulations")

# 프로젝트 B
gpt_app_b.connect_mcp("p3-regulations")

# 커뮤니티
published_mcp = {
    "name": "p3-regulations",
    "downloads": 1000,
    "stars": 50
}
```

## 🚨 주의사항

### 1. 보안 검증

```python
@mcp.tool()
def execute_query(sql: str):
    # ❌ 나쁜 예: 검증 없음
    return db.execute(sql)  # SQL Injection 위험!

@mcp.tool()
def execute_query(sql: str):
    # ✅ 좋은 예: 검증 포함
    if not sql.strip().upper().startswith("SELECT"):
        raise ValueError("SELECT만 허용")
    
    # Parameterized query 사용
    return db.execute_safe(sql)
```

### 2. 권한 관리

```python
@mcp.tool()
def delete_employee(employee_id: str, user_id: str):
    # 권한 확인
    user = get_user(user_id)
    if user.role != "admin":
        raise PermissionError("관리자만 삭제 가능")
    
    # 삭제
    return db.delete("employees", employee_id)
```

### 3. 에러 처리

```python
@mcp.tool()
def search_regulation(query: str):
    try:
        results = vector_db.search(query)
        return results
    except Exception as e:
        # 에러 로깅
        logger.error(f"Search error: {e}")
        
        # 사용자 친화적 메시지
        return {
            "error": "검색 중 오류가 발생했습니다. 다시 시도해주세요."
        }
```

## 🔗 관련 용어

- [[Agent]]: MCP로 도구 사용
- [[LLM]]: MCP로 외부 시스템 연결
- [[RAG]]: MCP로 Vector DB 연결
- [[Text-to-SQL]]: MCP로 DB 쿼리

## 📝 정리

**MCP의 핵심**:
```
LLM ↔ 외부 시스템 연결 표준
→ 재사용 가능
→ 안전하고 표준화된 접근
```

**P3 시스템 활용**:
```
DB MCP: 취업규칙 DB 접근
Vector DB MCP: RAG 검색
Slack MCP: 알림 전송
QueryPie MCP: 안전한 DB 쿼리
```

**비유로 기억하기**:
```
MCP = USB 표준
→ 한 번 만들면 모든 기기에서 사용
→ 표준 프로토콜로 호환성 보장

MCP 없음 = 각 기기마다 다른 케이블
→ 매번 새로 만들어야 함
→ 호환 안 됨
```

**주요 MCP Server 예시**:
```
@anthropic-ai/mcp-server-filesystem: 파일 접근
@anthropic-ai/mcp-server-postgres: PostgreSQL
@anthropic-ai/mcp-server-slack: Slack 연동
@anthropic-ai/mcp-server-github: GitHub API
```

---
*카테고리: 아키텍처*
*생성일: 2026-02-15*
