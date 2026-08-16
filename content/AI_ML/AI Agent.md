# AI Agent (AI 에이전트)

## 📝 정의

AI Agent(AI 에이전트)는 목표를 달성하기 위해 **스스로 생각하고, 계획하고, 행동하는** AI 시스템입니다. 단순히 질문에 답하는 것을 넘어, 복잡한 작업을 여러 단계로 나누고, 필요한 도구를 사용하며, 실패하면 다시 시도하는 등 자율적으로 일합니다.

### 핵심 개념

- **무엇인가?**: 자율적으로 작업을 수행하는 AI 시스템
- **왜 필요한가?**: 복잡한 작업을 인간의 개입 없이 완수하기 위해
- **어떻게 다른가?**: 일반 AI는 한 번 답변, Agent는 목표 달성까지 반복

### AI Agent가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 일반 AI의 한계
사용자: "내일 서울 날씨 알아보고, 비 온다면 우산 사이트에서 가격 비교해줘"

일반 AI:
"죄송합니다. 날씨 API에 접근할 수 없고, 웹사이트도 검색할 수 없습니다."
→ 한 번의 응답으로 끝! 😱

😱 시나리오 2: 여러 단계 필요한 작업
사용자: "내 이메일에서 회의 일정 찾아서, 참석자들에게 알림 보내고, 회의실 예약해줘"

일반 AI:
"이메일을 직접 확인하고, 알림을 수동으로 보내고, 회의실 예약 시스템에 접속하세요."
→ 사용자가 직접 해야 함! 😱

😱 시나리오 3: 실패 시 재시도
사용자: "이 데이터를 분석해줘"

일반 AI:
[오류 발생] "에러가 발생했습니다."
→ 그대로 멈춤! 😱
```

**AI Agent의 해결**:
```
✅ 시나리오 1 (Agent):
1. 날씨 API 호출 → "내일 서울 비"
2. 웹 검색 도구 사용 → 우산 쇼핑몰 3곳 발견
3. 각 사이트 가격 추출 → 비교 결과 생성
4. 사용자에게 보고 ✅

✅ 시나리오 2 (Agent):
1. 이메일 도구로 회의 일정 검색
2. 참석자 목록 추출
3. 알림 전송 API 호출
4. 회의실 예약 시스템 접속
5. 예약 완료 후 확인 ✅

✅ 시나리오 3 (Agent):
1. 데이터 분석 시도
2. [오류 감지] "형식이 잘못됐군"
3. 데이터 정제 도구 사용
4. 다시 분석 시도
5. 성공! ✅
```

**비유**:
- **일반 AI** = 백과사전 (질문하면 답만 줌)
- **AI Agent** = 비서 (목표를 말하면 알아서 처리)

또 다른 비유:
- **일반 AI** = GPS (길만 알려줌)
- **AI Agent** = 운전기사 (목적지까지 직접 데려다줌)

## 📊 작동 원리

AI Agent는 **생각(Thought) → 행동(Action) → 관찰(Observation)** 사이클을 반복합니다.

### 전체 구조

```도해
층: AI Agent, 어떻게 나뉘어 있나
AI Agent 구조 :: Planning 계획 수립 · Memory 기억 · LLM 추론 엔진
Tools (도구함) :: 웹 검색 · 코드 실행 · 파일 접근 · API 호출 · 계산기
```

### 주요 구성 요소

**1. Planning (계획 수립)**:
- 큰 목표를 작은 단계로 분해
- "내일 날씨 알아보고 우산 비교" → [1. 날씨 확인, 2. 우산 검색, 3. 가격 비교]
- 최적의 전략 선택

**2. Memory (기억)**:
- **단기 기억**: 현재 대화와 작업 진행 상황
- **장기 기억**: 과거 경험과 학습 내용 (벡터 DB에 저장)
- 이전 실수를 기억하여 개선

**3. LLM (추론 엔진)**:
- Agent의 "두뇌"
- 상황을 판단하고 다음 행동 결정
- GPT-4, Claude 등

**4. Tools (도구)**:
- Agent가 사용할 수 있는 기능들
- 웹 검색, 파일 읽기, API 호출, 코드 실행 등
- MCP를 통해 다양한 도구 연결 가능

## 🔄 ReAct 패턴

ReAct(Reasoning + Acting)는 가장 널리 사용되는 Agent 동작 방식입니다.

```도해
흐름: AI Agent, 무슨 순서로 오가나
사용자 :: 내일 서울 날씨 알려줘
AI Agent :: 무엇을 해야 하나?
LLM (두뇌) :: 날씨 정보가 필요해. 날씨 API를 사용하자.
AI Agent :: 날씨 API 호출 get_weather("서울", "내일")
도구 :: 맑음, 기온 15°C
AI Agent :: 결과를 확인했어: "맑음, 15°C
LLM (두뇌) :: 정보 충분함. 사용자에게 전달하자.
AI Agent :: 내일 서울 날씨는 맑음이며 기온은 15°C입니다.
```

### 각 단계 상세 설명

**1. Thought (생각)**:
- 현재 상황 파악
- 목표 달성을 위해 무엇이 필요한가?
- 어떤 도구를 사용할까?

예시:
```
Thought: "사용자가 날씨 정보를 원한다.
         실시간 날씨 데이터가 필요하다.
         날씨 API 도구를 사용해야겠다."
```

**2. Action (행동)**:
- 선택한 도구 실행
- 필요한 매개변수 전달

예시:
```
Action: weather_api
Action Input: {"city": "서울", "date": "내일"}
```

**3. Observation (관찰)**:
- 도구 실행 결과 확인
- 성공했는가? 실패했는가?
- 추가 작업이 필요한가?

예시:
```
Observation: "맑음, 기온 15°C"
```

**4. 재평가 및 반복**:
- 목표 달성했는가? → YES: 종료
- 목표 미달성? → 다시 1단계(Thought)로

## 💡 실제 예시

### 복잡한 작업 처리 예시

```
사용자: "내 프로젝트 폴더에서 Python 파일을 찾아서,
        각 파일의 줄 수를 세고, 가장 큰 파일을 알려줘"

Agent의 사고 과정:

🤔 Thought 1: "여러 단계가 필요하다. 계획을 세우자."
    계획:
    1. 프로젝트 폴더 탐색
    2. Python 파일 필터링 (*.py)
    3. 각 파일의 줄 수 카운트
    4. 최대값 찾기
    5. 결과 보고

🔧 Action 1: list_files("/project")
👁️ Observation 1: ["main.py", "utils.py", "test.py", "README.md"]

🤔 Thought 2: "Python 파일만 필터링하자."
🔧 Action 2: filter_by_extension(files, ".py")
👁️ Observation 2: ["main.py", "utils.py", "test.py"]

🤔 Thought 3: "각 파일의 줄 수를 세자."
🔧 Action 3: count_lines("main.py")
👁️ Observation 3: 150줄

🔧 Action 4: count_lines("utils.py")
👁️ Observation 4: 200줄

🔧 Action 5: count_lines("test.py")
👁️ Observation 5: 80줄

🤔 Thought 4: "최대값을 찾자."
    main.py: 150줄
    utils.py: 200줄 ← 최대
    test.py: 80줄

🤔 Thought 5: "목표 달성! 사용자에게 보고하자."

✅ 최종 답변:
"프로젝트 폴더에서 3개의 Python 파일을 찾았습니다.
 가장 큰 파일은 utils.py로 200줄입니다."
```

### 기본 Agent 구현

```python
from typing import List, Dict, Callable

class SimpleAgent:
    """기본 ReAct Agent"""

    def __init__(self, tools: Dict[str, Callable]):
        """
        Args:
            tools: 사용 가능한 도구들
                   {"도구명": 함수} 형태
        """
        self.tools = tools
        self.memory = []  # 작업 기록
        self.max_iterations = 10  # 최대 반복 횟수

    def think(self, goal: str, observation: str = "") -> tuple:
        """
        생각 단계: 다음에 무엇을 할지 결정

        Args:
            goal: 달성할 목표
            observation: 이전 행동의 결과

        Returns:
            (thought, action, action_input)
        """
        # 실제로는 LLM에게 물어봄
        # 여기서는 간단한 예시

        if "날씨" in goal and not observation:
            return (
                "날씨 정보가 필요하다",
                "get_weather",
                {"city": "서울"}
            )
        elif observation:
            return (
                "정보를 얻었다. 사용자에게 전달하자",
                "FINISH",
                observation
            )

    def act(self, action: str, action_input: dict) -> str:
        """
        행동 단계: 도구 실행

        Args:
            action: 도구 이름
            action_input: 도구 입력값

        Returns:
            도구 실행 결과
        """
        if action == "FINISH":
            return action_input

        if action not in self.tools:
            return f"오류: '{action}' 도구를 찾을 수 없습니다"

        tool = self.tools[action]
        result = tool(**action_input)

        # 기록 저장
        self.memory.append({
            "action": action,
            "input": action_input,
            "result": result
        })

        return result

    def run(self, goal: str) -> str:
        """
        Agent 실행: 목표 달성까지 반복

        Args:
            goal: 달성할 목표

        Returns:
            최종 결과
        """
        observation = ""

        for i in range(self.max_iterations):
            print(f"\n{'='*50}")
            print(f"반복 {i+1}/{self.max_iterations}")
            print(f"{'='*50}")

            # 1. Think (생각)
            thought, action, action_input = self.think(goal, observation)
            print(f"💭 Thought: {thought}")
            print(f"🎯 Action: {action}")
            print(f"📝 Input: {action_input}")

            # 종료 조건
            if action == "FINISH":
                print(f"\n✅ 목표 달성!")
                return action_input

            # 2. Act (행동)
            observation = self.act(action, action_input)
            print(f"👁️ Observation: {observation}")

        return "⚠️ 최대 반복 횟수 도달"


# 사용 예시
def get_weather(city: str) -> str:
    """날씨 조회 도구"""
    # 실제로는 API 호출
    return f"{city}의 날씨는 맑음, 15°C입니다"

tools = {
    "get_weather": get_weather
}

agent = SimpleAgent(tools)
result = agent.run("내일 서울 날씨 알려줘")
print(f"\n최종 결과: {result}")
```

**실행 결과**:
```
==================================================
반복 1/10
==================================================
💭 Thought: 날씨 정보가 필요하다
🎯 Action: get_weather
📝 Input: {'city': '서울'}
👁️ Observation: 서울의 날씨는 맑음, 15°C입니다

==================================================
반복 2/10
==================================================
💭 Thought: 정보를 얻었다. 사용자에게 전달하자
🎯 Action: FINISH
📝 Input: 서울의 날씨는 맑음, 15°C입니다

✅ 목표 달성!

최종 결과: 서울의 날씨는 맑음, 15°C입니다
```

### 실무에서 사용하는 Agent (LangChain)

```python
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.llms import OpenAI
from langchain.tools import DuckDuckGoSearchRun

# 1. 도구 정의
search = DuckDuckGoSearchRun()

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="최신 정보를 웹에서 검색할 때 사용합니다."
    ),
    Tool(
        name="Calculator",
        func=lambda x: eval(x),
        description="수학 계산이 필요할 때 사용합니다. 입력은 Python 수식이어야 합니다."
    )
]

# 2. LLM 설정 (Agent의 두뇌)
llm = OpenAI(temperature=0)

# 3. Agent 초기화
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,  # ReAct 패턴
    verbose=True  # 사고 과정 출력
)

# 4. Agent 실행
result = agent.run(
    "2024년 AI 관련 기업 수를 검색하고, "
    "전년 대비 25% 증가했다면 2023년에는 몇 개였는지 계산해줘"
)

print(result)
```

**Agent의 사고 과정 (verbose=True)**:
```
> Entering new AgentExecutor chain...

💭 Thought: 먼저 2024년 AI 기업 수를 검색해야 한다.
🎯 Action: Search
📝 Action Input: "2024 AI companies count"
👁️ Observation: 2024년 전세계 AI 기업은 약 50,000개입니다.

💭 Thought: 이제 25% 증가했다면 2023년 수를 계산해야 한다.
           50000 = 2023년 수 * 1.25
           2023년 수 = 50000 / 1.25
🎯 Action: Calculator
📝 Action Input: "50000 / 1.25"
👁️ Observation: 40000.0

💭 Thought: 모든 정보를 얻었다. 최종 답변을 작성하자.
🎯 Action: FINISH

✅ Final Answer:
2024년에는 약 50,000개의 AI 기업이 있으며,
전년 대비 25% 증가한 것이라면 2023년에는 40,000개였습니다.

> Finished chain.
```

## 🎯 AI Agent vs 일반 LLM

```도해
층: AI Agent, 어떻게 나뉘어 있나
일반 LLM :: 질문] --> B1[LLM
AI Agent :: 목표] --> B2[계획
```

| 특성 | 일반 LLM | AI Agent |
|------|----------|----------|
| **작동 방식** | 1회 응답 | 목표 달성까지 반복 |
| **도구 사용** | 제한적 | 능동적으로 선택 |
| **계획 수립** | 없음 | 단계별 계획 |
| **오류 처리** | 즉시 중단 | 재시도 및 수정 |
| **메모리** | 대화 내용만 | 장기/단기 기억 |
| **자율성** | 낮음 | 높음 |

### 실제 비교

**일반 LLM**:
```
사용자: "내 프로젝트를 분석해줘"
LLM: "파일에 접근할 수 없습니다.
     파일 내용을 복사해서 보여주세요."
→ 사용자가 직접 작업해야 함
```

**AI Agent**:
```
사용자: "내 프로젝트를 분석해줘"

Agent:
1. 프로젝트 폴더 탐색 도구 사용
2. 파일 목록 확인
3. 각 파일 읽기
4. 코드 분석
5. 보고서 생성
→ "프로젝트는 Python Flask 앱입니다.
   10개 파일, 총 2,500줄이며..."
→ 자동으로 완료!
```

## 🔧 Agent의 핵심 능력

### 1. 자기 수정 (Self-Correction)

```
Agent: "파일을 읽어보자"
→ [오류: 파일 없음]

Agent: "경로가 잘못됐구나. 먼저 파일 목록을 확인하자"
→ [파일 목록 조회]

Agent: "아, 파일명이 'data.txt'가 아니라 'dataset.txt'구나"
→ [다시 읽기 시도]
→ [성공!]
```

### 2. 멀티 태스킹

```
사용자: "내일 날씨 확인하고, 이메일도 정리해줘"

Agent:
[작업 1] 날씨 API 호출 → 완료
[작업 2] 이메일 목록 조회 → 완료
[작업 3] 중요 이메일 필터링 → 완료
[작업 4] 결과 통합 → 완료
```

### 3. 학습 및 개선

Agent는 과거 경험을 기억하고 활용합니다:

```python
# Memory에 저장된 과거 경험
memory = {
    "실패 사례": [
        "파일 경로를 확인하지 않고 읽으려다 오류 발생"
    ],
    "성공 패턴": [
        "먼저 ls로 파일 목록 확인 → 파일명 확인 → 읽기"
    ]
}

# 다음 작업 시 이 경험을 활용
Agent: "파일을 읽기 전에 먼저 목록을 확인해야겠다"
      (과거 실패를 기억)
```

## 🔗 관련 용어

- [[LLM]]: Agent의 추론 엔진
- [[RAG]]: Agent가 외부 지식에 접근하는 방법
- [[MCP]]: Agent가 도구와 연결하는 프로토콜
- [[Orchestrator]]: 여러 Agent를 조율하는 시스템
- [[ReAct]]: Agent의 대표적인 동작 패턴

## 📚 참고자료

- [LangChain Agents](https://python.langchain.com/docs/modules/agents/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)
- [LangGraph](https://github.com/langchain-ai/langgraph)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
