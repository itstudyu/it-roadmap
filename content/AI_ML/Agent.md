# Agent (AI 에이전트)

## 📝 정의

Agent는 **목표를 달성하기 위해 자율적으로 행동하는 AI 시스템**입니다. LLM에 도구 사용 능력과 계획 수립 능력을 부여한 것입니다.

### 핵심 개념

- **무엇인가?**: 자율적으로 작업을 수행하는 AI
- **왜 필요한가?**: 복잡한 작업을 단계별로 자동 해결
- **어떻게 작동하나?**: 관찰 → 사고 → 행동 반복

### Agent가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 단순 LLM 대화
사용자: "이메일 확인하고 중요한 건 요약해줘"
LLM: "죄송하지만 이메일에 접근할 수 없습니다"
→ 도구 사용 불가! 😱

😱 시나리오 2: 복잡한 작업
사용자: "경쟁사 분석 보고서 작성"
단계: 웹 검색 → 데이터 수집 → 분석 → 보고서 작성
→ 각 단계를 수동으로 해야 함! 😱
→ 자동화 불가! 😱

😱 시나리오 3: 동적 상황 대응
작업 중 오류 발생
→ 인간 개입 필요
→ 자율적 문제 해결 불가! 😱
```

**Agent의 해결**:
```
✅ 시나리오 1: 도구 사용
사용자: "이메일 확인하고 중요한 건 요약해줘"
Agent:
1. 이메일 API 호출
2. 최근 이메일 조회
3. 중요도 판단
4. 요약 생성
→ 자동으로 완료! ✅

✅ 시나리오 2: 복잡한 작업 자동화
사용자: "경쟁사 분석 보고서 작성"
Agent:
1. 웹 검색으로 정보 수집
2. 데이터 정리
3. 분석 수행
4. 보고서 작성
→ 전체 과정 자동화! ✅

✅ 시나리오 3: 오류 복구
오류 발생 시
Agent:
1. 오류 감지
2. 대안 방법 시도
3. 최종 목표 달성
→ 자율적 문제 해결! ✅
```

## 💡 Agent 구현

### 기본 Agent 구조

```python
import openai

class SimpleAgent:
    """간단한 AI Agent"""

    def __init__(self, tools):
        self.tools = tools  # 사용 가능한 도구들
        self.memory = []    # 대화 기록

    def think(self, user_input):
        """사고: 다음 행동 결정"""
        self.memory.append({
            "role": "user",
            "content": user_input
        })

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.memory + [
                {"role": "system", "content": self._get_tools_prompt()}
            ]
        )

        return response.choices[0].message

    def act(self, action):
        """행동: 도구 실행"""
        tool_name = action.get("tool")
        tool_args = action.get("args", {})

        if tool_name in self.tools:
            result = self.tools[tool_name](**tool_args)
            return result
        else:
            return {"error": f"Tool {tool_name} not found"}

    def run(self, task, max_iterations=5):
        """Agent 실행"""
        print(f"Task: {task}\n")

        for i in range(max_iterations):
            print(f"--- Iteration {i+1} ---")

            # 1. 사고
            thought = self.think(task)
            print(f"Thought: {thought.content}\n")

            # 2. 행동 파싱
            if "FINAL_ANSWER:" in thought.content:
                # 최종 답변
                answer = thought.content.split("FINAL_ANSWER:")[1].strip()
                print(f"Final Answer: {answer}")
                return answer

            # 3. 도구 사용
            # 간단한 파싱 (실제로는 더 정교하게)
            if "USE_TOOL:" in thought.content:
                action = self._parse_action(thought.content)
                result = self.act(action)
                print(f"Action: {action}")
                print(f"Result: {result}\n")

                # 결과를 메모리에 추가
                self.memory.append({
                    "role": "assistant",
                    "content": f"Tool result: {result}"
                })

        return "Max iterations reached"

    def _get_tools_prompt(self):
        """도구 설명 프롬프트"""
        tools_desc = "\n".join([
            f"- {name}: {tool.__doc__}"
            for name, tool in self.tools.items()
        ])

        return f"""
You are an AI agent with access to these tools:
{tools_desc}

To use a tool, write: USE_TOOL: tool_name(arg1=value1, arg2=value2)
When you have the final answer, write: FINAL_ANSWER: your answer
"""

    def _parse_action(self, content):
        """행동 파싱 (간단한 예시)"""
        # 실제로는 더 정교한 파싱 필요
        return {"tool": "search", "args": {"query": "example"}}

# 도구 정의
def search(query):
    """웹 검색을 수행합니다"""
    # 실제 검색 로직
    return f"Search results for '{query}': ..."

def calculator(expression):
    """수식을 계산합니다"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except:
        return "Error in calculation"

# Agent 생성 및 실행
tools = {
    "search": search,
    "calculator": calculator
}

agent = SimpleAgent(tools)
result = agent.run("2024년 올림픽은 어디서 개최되었나요?")
```

### LangChain Agent

```python
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.llms import OpenAI
from langchain.utilities import GoogleSearchAPIWrapper

# LLM 초기화
llm = OpenAI(temperature=0)

# 도구 정의
search = GoogleSearchAPIWrapper()

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="useful for when you need to answer questions about current events"
    ),
    Tool(
        name="Calculator",
        func=lambda x: str(eval(x)),
        description="useful for when you need to do math"
    )
]

# Agent 초기화
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 실행
result = agent.run("2024년 올림픽은 어디서 개최되었고, 총 몇 개국이 참가했나요?")
print(result)
```

**실행 결과**:
```
> Entering new AgentExecutor chain...
I need to find information about the 2024 Olympics
Action: Search
Action Input: "2024 Olympics location countries"
Observation: The 2024 Summer Olympics were held in Paris, France with 206 countries participating...
Thought: I now know the final answer
Final Answer: 2024년 올림픽은 프랑스 파리에서 개최되었으며, 총 206개국이 참가했습니다.
```

## 🎯 Agent 패턴

### 1. ReAct (Reasoning + Acting)

```python
"""
Thought → Action → Observation 반복

예시:
Thought: 날씨 정보가 필요함
Action: search("오늘 서울 날씨")
Observation: 서울은 맑음, 15도
Thought: 이제 답변 가능
Answer: 오늘 서울은 맑고 15도입니다
"""

from langchain.agents import load_tools

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)
```

### 2. Plan-and-Execute

```python
"""
1. 전체 계획 수립
2. 단계별 실행
3. 결과 종합

예시:
Plan:
  1. 웹에서 정보 수집
  2. 데이터 분석
  3. 보고서 작성

Execute:
  Step 1: [검색 실행]
  Step 2: [분석 실행]
  Step 3: [작성 실행]
"""

from langchain.agents import AgentType

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.PLAN_AND_EXECUTE,
    verbose=True
)
```

### 3. Self-Ask

```python
"""
스스로 질문하며 문제 해결

예시:
Q: 파리 에펠탑의 높이는?
  → Are follow up questions needed? Yes
  → Follow up: 에펠탑 높이
  → Answer: 324m
Final Answer: 324m
"""

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.SELF_ASK_WITH_SEARCH,
    verbose=True
)
```

## 🔍 실전 활용

### 1. 데이터 분석 Agent

```python
class DataAnalystAgent:
    """데이터 분석 Agent"""

    def __init__(self):
        self.tools = {
            "load_data": self.load_data,
            "analyze": self.analyze,
            "visualize": self.visualize
        }

    def load_data(self, file_path):
        """데이터 로드"""
        import pandas as pd
        df = pd.read_csv(file_path)
        return f"Loaded {len(df)} rows"

    def analyze(self, data, analysis_type):
        """데이터 분석"""
        # 실제 분석 로직
        return {"mean": 42, "median": 40, "std": 5}

    def visualize(self, data, chart_type):
        """시각화"""
        # 차트 생성
        return "chart_saved.png"

    def run(self, task):
        """분석 실행"""
        # Agent 로직
        pass

# 사용
agent = DataAnalystAgent()
agent.run("sales.csv 파일을 분석하고 트렌드 차트를 만들어줘")
```

### 2. 코딩 Assistant Agent

```python
class CodingAgent:
    """코딩 도우미 Agent"""

    def __init__(self):
        self.tools = {
            "write_code": self.write_code,
            "run_code": self.run_code,
            "debug": self.debug,
            "test": self.test
        }

    def write_code(self, spec):
        """코드 작성"""
        # LLM으로 코드 생성
        code = generate_code(spec)
        return code

    def run_code(self, code):
        """코드 실행"""
        try:
            exec(code)
            return "Success"
        except Exception as e:
            return f"Error: {e}"

    def debug(self, code, error):
        """디버깅"""
        # 오류 분석 및 수정
        fixed_code = fix_code(code, error)
        return fixed_code

    def test(self, code):
        """테스트"""
        # 단위 테스트 실행
        return test_results

    def run(self, task):
        """개발 실행"""
        # 1. 코드 작성
        code = self.write_code(task)

        # 2. 실행
        result = self.run_code(code)

        # 3. 오류 시 디버깅
        while "Error" in result:
            code = self.debug(code, result)
            result = self.run_code(code)

        # 4. 테스트
        self.test(code)

        return code

# 사용
agent = CodingAgent()
code = agent.run("파일을 읽어서 단어 빈도를 계산하는 함수 작성")
```

### 3. 개인 비서 Agent

```python
class PersonalAssistant:
    """개인 비서 Agent"""

    def __init__(self):
        self.tools = {
            "check_email": self.check_email,
            "send_email": self.send_email,
            "schedule": self.schedule,
            "search": self.search,
            "summarize": self.summarize
        }

    def check_email(self):
        """이메일 확인"""
        # Gmail API 사용
        emails = fetch_emails()
        return emails

    def send_email(self, to, subject, body):
        """이메일 전송"""
        # 이메일 전송
        return "Email sent"

    def schedule(self, event, time):
        """일정 추가"""
        # 캘린더 API 사용
        return "Event scheduled"

    def search(self, query):
        """웹 검색"""
        # 검색 API 사용
        return search_results

    def summarize(self, text):
        """요약"""
        # LLM으로 요약
        return summary

    def run(self, task):
        """작업 실행"""
        # Agent 로직
        pass

# 사용
assistant = PersonalAssistant()
assistant.run("이메일 확인하고 중요한 건 요약해서 알려줘")
```

## 🚨 Agent 한계와 주의사항

### 1. 비용

```python
# Agent는 여러 번 LLM 호출
# → 비용 증가

task = "복잡한 분석"
# LLM 호출: 10-20회
# 비용: 일반 대화의 10-20배

# 해결: 비용 제한 설정
agent = Agent(max_iterations=5, budget=1.0)
```

### 2. 신뢰성

```python
# Agent가 잘못된 도구 선택 가능
# → 오류 발생

# 해결: 사람 확인 단계 추가
if critical_action:
    confirm = input("실행할까요? (y/n)")
    if confirm != 'y':
        return
```

### 3. 보안

```python
# Agent가 민감한 작업 수행 가능
# → 보안 위험

# 해결: 권한 제한
allowed_tools = ["search", "calculator"]  # 안전한 도구만
dangerous_tools = ["delete", "system"]    # 차단
```

## 🔗 관련 용어

- [[LLM]]: Agent의 두뇌
- [[Prompt Engineering]]: Agent 설계
- [[RAG]]: Agent의 지식 확장
- [[Fine-tuning]]: Agent 맞춤화

## 📝 정리

**Agent의 핵심**:
```
Agent = LLM + Tools + Autonomy
→ 자율적 작업 수행
→ 복잡한 문제 해결
→ 도구 사용 능력
```

**구성 요소**:
```
LLM: 사고/추론
Tools: 행동/실행
Memory: 기억/학습
Planning: 계획 수립
```

**주요 패턴**:
```
ReAct: 추론 + 행동
Plan-Execute: 계획 + 실행
Self-Ask: 스스로 질문
```

**비유로 기억하기**:
```
LLM = 머리 좋은 사람
→ 대화만 가능

Agent = 머리 좋은 + 손발 있는 사람
→ 직접 행동 가능
→ 도구 사용 가능
→ 목표 달성 위해 자율 행동
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
