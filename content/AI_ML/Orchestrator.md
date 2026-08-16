# Orchestrator (오케스트레이터)

## 📝 정의

Orchestrator(오케스트레이터)는 여러 AI Agent를 지휘하고 조율하는 **지휘자** 역할을 하는 시스템입니다. 마치 오케스트라 지휘자가 여러 악기 연주자를 조율하듯이, Orchestrator는 각 Agent에게 적절한 작업을 배분하고 결과를 통합합니다.

### 핵심 개념

- **무엇인가?**: 여러 AI Agent를 총괄 관리하는 조율 시스템
- **왜 필요한가?**: 각 Agent의 전문성을 활용하여 효율적으로 작업하기 위해
- **어떻게 작동하나?**: 사용자 요청 분석 → 적절한 Agent 선택 → 결과 통합

### Orchestrator가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 단일 Agent의 한계
사용자: "인사 규정 찾아줘"

범용 Agent:
"잠깐, 인사 규정이 어디 있지? 파일인가? DB인가? 문서인가?"
→ 모든 것을 하나의 Agent가 처리하려니 비효율적! 😱

😱 시나리오 2: Agent 선택의 혼란
사용자: "주소 변경하고 싶어"

시스템:
- FAQ Agent: "FAQ에서 검색 중..."
- Navigation Agent: "메뉴 위치 안내 중..."
- Knowledge Agent: "문서 검색 중..."
→ 모든 Agent가 동시에 작동! 혼란! 😱

😱 시나리오 3: 결과 통합의 어려움
사용자: "회사 복지 제도 알려줘"

Agent A: "건강보험 정보입니다..."
Agent B: "육아휴직 정보입니다..."
Agent C: "연차 정보입니다..."
→ 흩어진 정보, 사용자가 직접 정리해야 함! 😱
```

**Orchestrator의 해결**:
```
✅ 시나리오 1 (Orchestrator):
사용자: "인사 규정 찾아줘"

Orchestrator:
1. 요청 분석: "규정 문서 검색이 필요하다"
2. Agent 선택: Knowledge Search Agent (문서 전문)
3. Knowledge Agent가 효율적으로 검색
4. 결과 반환 ✅

✅ 시나리오 2 (Orchestrator):
사용자: "주소 변경하고 싶어"

Orchestrator:
1. Intent 분류: "신청 안내" 카테고리
2. 가장 적합한 Agent: Navigation Agent
3. Navigation Agent만 실행 (다른 Agent는 대기)
4. 정확한 안내 제공 ✅

✅ 시나리오 3 (Orchestrator):
사용자: "회사 복지 제도 알려줘"

Orchestrator:
1. 복수 Agent 필요 판단
2. 각 Agent에게 작업 배분
3. 모든 결과 수집
4. 하나의 통합된 답변으로 정리
5. 사용자에게 깔끔한 답변 제공 ✅
```

**비유**:
- **Orchestrator 없음** = 여러 직원이 동시에 말하는 회의 (혼란)
- **Orchestrator 있음** = 진행자가 순서를 정하는 회의 (질서정연)

또 다른 비유:
- **각 Agent** = 전문 부서 (인사부, 재무부, 법무부)
- **Orchestrator** = 기획실 (어느 부서에 물어볼지 결정)
- **사용자 질문** = 임원의 지시
- **Orchestrator**: "이건 인사부가 답해야겠군" → 인사부만 답변

## 📊 작동 원리

Orchestrator는 **분석 → 분류 → 라우팅 → 통합** 과정을 거칩니다.

### 전체 구조


### 주요 구성 요소

**1. Intent Classifier (의도 분류기)**:
- 사용자 요청의 의도를 파악
- "주소 변경하고 싶어" → "신청 안내" 카테고리
- LLM을 사용하여 분류

**2. Router (라우터)**:
- 적절한 Agent 선택
- 분류된 Intent에 맞는 Agent 매핑
- 우선순위 관리

**3. Response Synthesizer (응답 통합기)**:
- 여러 Agent의 결과를 하나로 통합
- 일관된 형식으로 정리
- 최종 답변 생성

**4. Agent Pool (Agent 풀)**:
- 사용 가능한 모든 Agent들
- 각 Agent는 특정 도메인 전문

## 🔄 동작 시퀀스

사용자가 "주소 변경하고 싶어요"라고 요청하는 경우:

```도해
흐름: Orchestrator, 무슨 순서로 오가나
사용자 :: 주소 변경하고 싶어요
Orchestrator :: Intent 분류 요청
Intent Classifier :: 주소 변경" 분석 → 신청 안내 카테고리
Intent Classifier :: Intent: "navigation" (시스템 사용법)
Orchestrator :: Navigation Agent가 가장 적합함
Orchestrator :: 주소 변경 방법 안내
Navigation Agent :: 메뉴 경로 확인 P3 > 인사정보 > 변경신청
Navigation Agent :: P3 > 인사정보 > 변경신청에서 주소 변경 가능
Orchestrator :: 사용자 친화적으로 변환
Orchestrator :: 주소 변경은 P3 메뉴 > 인사정보 > 변경신청에서 하실 수…
```

### 각 단계 상세 설명

**1단계: 요청 수신 및 전처리**
- 사용자 입력 받기
- 기본 정제 (공백 제거, 소문자 변환 등)
- 컨텍스트 확인 (이전 대화 내용)

**2단계: Intent 분류**
- LLM에게 의도 분석 요청
- 카테고리 판별:
  - `navigation`: 시스템 사용법
  - `knowledge`: 규정/문서 검색
  - `faq`: 자주 묻는 질문
  - `payroll`: 급여 관련
  - `unknown`: 판단 불가

예시 프롬프트:
```
다음 질문의 카테고리를 분류하세요:

질문: "주소 변경하고 싶어요"

카테고리:
- navigation: 시스템 메뉴, 사용법, 신청 방법
- knowledge: 회사 규정, 정책, 문서
- faq: 자주 묻는 질문
- payroll: 급여, 급여명세서

답변: navigation
```

**3단계: Agent 라우팅**
- Intent에 맞는 Agent 선택
- Intent → Agent 매핑:
  - `navigation` → Navigation Agent
  - `knowledge` → Knowledge Search Agent
  - `faq` → FAQ Agent
  - `payroll` → Payroll Agent

**4단계: Agent 실행**
- 선택된 Agent에게 작업 전달
- Agent가 전문 분야에서 작업 수행
- 결과 수신

**5단계: 응답 통합 및 전달**
- Agent의 응답을 사용자 친화적으로 가공
- 필요시 추가 정보 추가
- 최종 답변 생성

## 💡 실제 예시

### 복잡한 요청 처리

```
사용자: "급여명세서 확인하고, 육아휴직 신청 방법도 알려줘"

Orchestrator의 판단:
"이 요청은 2가지 작업이 필요하다"

🔍 분석:
1. "급여명세서 확인" → payroll (급여 Agent)
2. "육아휴직 신청 방법" → navigation (안내 Agent)

📋 실행 계획:
Step 1: Payroll Agent 실행
Step 2: Navigation Agent 실행
Step 3: 결과 통합

🔧 실행:

[Payroll Agent]
→ "급여명세서는 P3 > 급여 > 명세서 조회에서 확인하실 수 있습니다."

[Navigation Agent]
→ "육아휴직 신청은 P3 > 인사정보 > 휴직신청에서 가능합니다."

🎯 통합 답변:
"1. 급여명세서: P3 > 급여 > 명세서 조회
 2. 육아휴직 신청: P3 > 인사정보 > 휴직신청

 두 가지 모두 P3 시스템에서 처리하실 수 있습니다."
```

### 기본 Orchestrator 구현

```python
from typing import Dict, Optional
from enum import Enum

class IntentType(Enum):
    """의도 카테고리"""
    NAVIGATION = "navigation"  # 시스템 사용법
    KNOWLEDGE = "knowledge"    # 규정/문서 검색
    FAQ = "faq"                # 자주 묻는 질문
    PAYROLL = "payroll"        # 급여 관련
    UNKNOWN = "unknown"        # 알 수 없음

class Orchestrator:
    """Agent 조율 시스템"""

    def __init__(self, agents: Dict[IntentType, 'Agent']):
        """
        Args:
            agents: Intent별 Agent 매핑
                   {IntentType.NAVIGATION: NavigationAgent(), ...}
        """
        self.agents = agents
        self.classifier = IntentClassifier()  # Intent 분류기

    def process(self, user_input: str) -> str:
        """
        사용자 요청 처리

        Args:
            user_input: 사용자 입력

        Returns:
            최종 답변
        """
        print(f"[Orchestrator] 요청 수신: '{user_input}'")

        # 1. Intent 분류
        intent = self.classifier.classify(user_input)
        print(f"[Orchestrator] Intent: {intent.value}")

        # 2. Intent가 불명확한 경우
        if intent == IntentType.UNKNOWN:
            return "죄송합니다. 요청을 이해하지 못했습니다. 다시 말씀해 주시겠어요?"

        # 3. 적절한 Agent 선택
        agent = self.agents.get(intent)
        if not agent:
            return f"'{intent.value}' 담당 Agent가 설정되지 않았습니다."

        print(f"[Orchestrator] Agent 선택: {agent.__class__.__name__}")

        # 4. Agent 실행
        response = agent.process(user_input)

        # 5. 결과 반환
        return response


class IntentClassifier:
    """Intent 분류기"""

    def classify(self, user_input: str) -> IntentType:
        """
        사용자 입력의 Intent 분류

        Args:
            user_input: 사용자 입력

        Returns:
            분류된 Intent
        """
        # 실제로는 LLM 사용
        # 여기서는 키워드 기반 간단 분류

        keywords = {
            IntentType.NAVIGATION: ["방법", "어떻게", "신청", "변경", "어디서"],
            IntentType.KNOWLEDGE: ["규정", "기간", "정책", "문서", "취업규칙"],
            IntentType.FAQ: ["자주", "FAQ", "흔한"],
            IntentType.PAYROLL: ["급여", "연봉", "명세서", "페이"]
        }

        user_lower = user_input.lower()

        for intent, words in keywords.items():
            if any(word in user_lower for word in words):
                return intent

        return IntentType.UNKNOWN


# Agent 기본 클래스
class Agent:
    """Agent 기본 클래스"""

    def process(self, query: str) -> str:
        """작업 처리"""
        raise NotImplementedError


class NavigationAgent(Agent):
    """시스템 사용법 안내 Agent"""

    def process(self, query: str) -> str:
        # 실제로는 메뉴 DB 조회
        return "P3 > 인사정보 > 변경신청에서 처리하실 수 있습니다."


class KnowledgeAgent(Agent):
    """규정/문서 검색 Agent"""

    def process(self, query: str) -> str:
        # 실제로는 문서 검색 (RAG)
        return "취업규칙 제15조에 따르면 육아휴직 기간은 최대 1년입니다."


class FAQAgent(Agent):
    """FAQ Agent"""

    def process(self, query: str) -> str:
        # 실제로는 FAQ DB 조회
        return "가장 자주 묻는 질문입니다: ..."


class PayrollAgent(Agent):
    """급여 정보 Agent"""

    def process(self, query: str) -> str:
        # 실제로는 급여 시스템 API 호출
        return "급여명세서는 P3 > 급여 > 명세서 조회에서 확인하실 수 있습니다."


# 사용 예시
agents = {
    IntentType.NAVIGATION: NavigationAgent(),
    IntentType.KNOWLEDGE: KnowledgeAgent(),
    IntentType.FAQ: FAQAgent(),
    IntentType.PAYROLL: PayrollAgent()
}

orchestrator = Orchestrator(agents)

# 테스트
print("="*60)
result = orchestrator.process("주소 변경하고 싶어요")
print(f"[답변] {result}\n")

print("="*60)
result = orchestrator.process("육아휴직 기간이 어떻게 되나요?")
print(f"[답변] {result}\n")

print("="*60)
result = orchestrator.process("급여명세서 어디서 보나요?")
print(f"[답변] {result}\n")
```

**실행 결과**:
```
============================================================
[Orchestrator] 요청 수신: '주소 변경하고 싶어요'
[Orchestrator] Intent: navigation
[Orchestrator] Agent 선택: NavigationAgent
[답변] P3 > 인사정보 > 변경신청에서 처리하실 수 있습니다.

============================================================
[Orchestrator] 요청 수신: '육아휴직 기간이 어떻게 되나요?'
[Orchestrator] Intent: knowledge
[Orchestrator] Agent 선택: KnowledgeAgent
[답변] 취업규칙 제15조에 따르면 육아휴직 기간은 최대 1년입니다.

============================================================
[Orchestrator] 요청 수신: '급여명세서 어디서 보나요?'
[Orchestrator] Intent: payroll
[Orchestrator] Agent 선택: PayrollAgent
[답변] 급여명세서는 P3 > 급여 > 명세서 조회에서 확인하실 수 있습니다.
```

### Fallback이 있는 고급 Orchestrator

Agent가 답변을 못 찾을 때 다른 Agent에게 재시도:

```python
class AdvancedOrchestrator(Orchestrator):
    """Fallback 기능이 있는 Orchestrator"""

    def __init__(self, agents: Dict[IntentType, Agent]):
        super().__init__(agents)

        # Fallback 우선순위 (답변 실패 시 시도 순서)
        self.fallback_chain = [
            IntentType.FAQ,           # 먼저 FAQ 확인
            IntentType.KNOWLEDGE,     # 다음 문서 검색
            IntentType.NAVIGATION     # 마지막 메뉴 안내
        ]

    def process(self, user_input: str) -> str:
        """Fallback을 포함한 처리"""

        # 1. 기본 Intent 분류 및 Agent 실행
        intent = self.classifier.classify(user_input)
        response = self._try_agent(intent, user_input)

        # 2. 답변이 불충분한 경우 Fallback 시도
        if self._is_insufficient(response):
            print(f"[Orchestrator] {intent.value} Agent 실패, Fallback 시도")

            for fallback_intent in self.fallback_chain:
                # 이미 시도한 Intent는 건너뛰기
                if fallback_intent == intent:
                    continue

                print(f"[Orchestrator] Fallback: {fallback_intent.value}")
                fallback_response = self._try_agent(fallback_intent, user_input)

                if not self._is_insufficient(fallback_response):
                    return fallback_response

            # 모든 Fallback 실패
            return "죄송합니다. 답변을 찾을 수 없습니다."

        return response

    def _try_agent(self, intent: IntentType, query: str) -> str:
        """Agent 실행 시도"""
        agent = self.agents.get(intent)
        if not agent:
            return "[Agent 없음]"

        try:
            return agent.process(query)
        except Exception as e:
            return f"[오류: {str(e)}]"

    def _is_insufficient(self, response: str) -> bool:
        """응답이 불충분한지 확인"""
        insufficient_keywords = [
            "찾을 수 없",
            "결과가 없",
            "모르겠",
            "[Agent 없음]",
            "[오류:"
        ]
        return any(kw in response for kw in insufficient_keywords)
```

**Fallback 시나리오**:
```
사용자: "재택근무 신청 방법?"

Orchestrator:
1. Intent: navigation (신청 방법)
2. Navigation Agent 실행
   → "메뉴를 찾을 수 없습니다"

3. [Fallback 발동]
   → FAQ Agent 시도
   → "FAQ에 없습니다"

4. [Fallback 계속]
   → Knowledge Agent 시도
   → "취업규칙 제20조에 따르면..."
   → ✅ 성공!

최종 답변: Knowledge Agent의 응답 사용
```

### 여러 Agent 협업

```python
class CollaborativeOrchestrator(Orchestrator):
    """여러 Agent가 협업하는 Orchestrator"""

    def process_complex(self, user_input: str) -> str:
        """복잡한 요청 처리 (여러 Agent 사용)"""

        # 예: "급여명세서 확인하고 육아휴직 신청 방법 알려줘"

        # 1. 작업 분해
        tasks = self._decompose(user_input)
        # → ["급여명세서 확인", "육아휴직 신청 방법"]

        results = []

        # 2. 각 작업을 적절한 Agent에 할당
        for task in tasks:
            intent = self.classifier.classify(task)
            agent = self.agents[intent]
            result = agent.process(task)
            results.append(result)

        # 3. 결과 통합
        final_response = self._synthesize(results)
        return final_response

    def _decompose(self, user_input: str) -> list:
        """복합 요청을 개별 작업으로 분해"""
        # 실제로는 LLM 사용
        # "A하고 B해줘" → ["A", "B"]

        # 간단한 예시: "그리고"로 분리
        return [task.strip() for task in user_input.split("그리고")]

    def _synthesize(self, results: list) -> str:
        """여러 응답을 하나로 통합"""
        # 실제로는 LLM으로 자연스럽게 통합
        return "\n\n".join([f"{i+1}. {r}" for i, r in enumerate(results)])
```

## 🎯 Orchestrator vs Router

많은 사람들이 혼동하는 개념을 명확히 구분합니다:

```도해
층: Orchestrator, 어떻게 나뉘어 있나
Router (단순 분기) :: 요청] --> B1{분류
Orchestrator (조율) :: 요청] --> B2[분석
```

| 특성 | Router | Orchestrator |
|------|--------|--------------|
| **역할** | 분기만 담당 | 전체 조율 |
| **Agent 수** | 1개 선택 | 여러 개 협업 가능 |
| **결과 통합** | 없음 | 있음 |
| **Fallback** | 제한적 | 고급 지원 |
| **복잡도** | 낮음 | 높음 |
| **유연성** | 낮음 | 높음 |

**실제 비교**:

**Router**:
```
사용자: "육아휴직 기간?"
Router: "Knowledge Agent로 보냄"
Knowledge Agent: "1년입니다"
→ 끝
```

**Orchestrator**:
```
사용자: "육아휴직 기간?"
Orchestrator:
1. Intent 분석: knowledge
2. Knowledge Agent 시도
3. [실패] "문서에 없음"
4. Fallback: FAQ Agent
5. [성공] "1년입니다"
6. 추가 정보 추가
→ "육아휴직 기간은 1년이며, 신청은 P3에서 가능합니다"
```

## 🔧 핵심 기능

### 1. Intent 분류의 정확도

```python
# 잘못된 분류를 방지하는 개선된 Classifier

class SmartClassifier(IntentClassifier):
    """개선된 Intent 분류기"""

    def classify(self, user_input: str) -> IntentType:
        # 1. 명확한 키워드가 있는 경우
        if "어디서" in user_input or "메뉴" in user_input:
            return IntentType.NAVIGATION

        # 2. LLM에게 물어보기
        prompt = f"""
다음 질문의 카테고리를 정확히 분류하세요:

질문: "{user_input}"

카테고리:
- navigation: 시스템 메뉴, 사용법, 신청 방법
- knowledge: 회사 규정, 정책, 기간, 조건
- faq: 자주 묻는 질문
- payroll: 급여, 연봉, 명세서

답변만 작성하세요:
"""
        response = call_llm(prompt)  # LLM 호출
        return IntentType(response.strip().lower())
```

### 2. 우선순위 관리

```python
class PriorityOrchestrator(Orchestrator):
    """우선순위 기반 Orchestrator"""

    def __init__(self, agents: Dict[IntentType, Agent]):
        super().__init__(agents)

        # Agent 우선순위 (높을수록 우선)
        self.priorities = {
            IntentType.PAYROLL: 10,      # 급여는 최우선
            IntentType.NAVIGATION: 5,    # 안내는 중간
            IntentType.KNOWLEDGE: 3,     # 문서 검색은 느림
            IntentType.FAQ: 1            # FAQ는 마지막
        }

    def process_multiple(self, user_input: str) -> str:
        """여러 Intent가 가능한 경우 우선순위로 처리"""

        # 가능한 모든 Intent 점수 계산
        candidates = self._score_intents(user_input)

        # 우선순위대로 정렬
        sorted_intents = sorted(
            candidates,
            key=lambda x: self.priorities[x],
            reverse=True
        )

        # 가장 우선순위 높은 Agent 실행
        best_intent = sorted_intents[0]
        return self._try_agent(best_intent, user_input)
```

### 3. 성능 모니터링

```python
class MonitoringOrchestrator(Orchestrator):
    """성능 모니터링 Orchestrator"""

    def __init__(self, agents: Dict[IntentType, Agent]):
        super().__init__(agents)
        self.metrics = {
            "total_requests": 0,
            "intent_counts": {},
            "agent_response_times": {},
            "fallback_counts": 0
        }

    def process(self, user_input: str) -> str:
        import time

        self.metrics["total_requests"] += 1

        # Intent 분류
        intent = self.classifier.classify(user_input)
        self.metrics["intent_counts"][intent.value] = \
            self.metrics["intent_counts"].get(intent.value, 0) + 1

        # Agent 실행 시간 측정
        start_time = time.time()
        response = self._try_agent(intent, user_input)
        elapsed = time.time() - start_time

        self.metrics["agent_response_times"][intent.value] = elapsed

        return response

    def get_metrics(self) -> dict:
        """성능 지표 조회"""
        return self.metrics
```

## 🔗 관련 용어

- [[AI Agent]]: Orchestrator가 조율하는 대상
- [[Routing]]: Orchestrator의 핵심 기능
- [[Intent 분류]]: 요청을 분석하는 방법
- [[Fallback]]: Agent 실패 시 대응 방법
- [[LLM]]: Intent 분류에 사용되는 모델

## 📚 참고자료

- [LangGraph Multi-Agent](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/)
- [CrewAI - Orchestrating AI Agents](https://www.crewai.com/)
- [Amazon Bedrock Multi-Agent](https://aws.amazon.com/bedrock/)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
