# Routing (라우팅)

## 📝 정의

Routing(라우팅)은 사용자 요청을 분석하여 **적절한 Agent나 서비스로 전달**하는 과정입니다. 마치 우체국이 편지를 올바른 주소로 배달하듯이, 요청을 정확한 처리자에게 보냅니다.

### 핵심 개념

- **무엇인가?**: 요청을 올바른 Agent로 연결하는 과정
- **왜 필요한가?**: 각 Agent의 전문성을 활용하기 위해
- **어떻게 작동하나?**: Intent 분류 → 매핑 규칙 → Agent 선택

### Routing이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 잘못된 Agent 선택
사용자: "급여명세서 보고 싶어"

잘못된 시스템:
→ Navigation Agent: "메뉴를 찾을 수 없습니다"
→ 시간 낭비, 사용자 불만! 😱

올바른 Agent는 Payroll Agent!

😱 시나리오 2: 모든 Agent가 응답
사용자: "주소 변경"

시스템:
→ FAQ Agent: "FAQ 검색 중..."
→ Knowledge Agent: "문서 검색 중..."
→ Navigation Agent: "메뉴 안내 중..."
→ 3개가 동시에 응답! 혼란! 😱

😱 시나리오 3: 라우팅 규칙 없음
개발자: "새 Agent 추가했는데..."
시스템: "어디로 보내야 하지?"
→ 수동으로 코드 수정 필요! 😱
```

**Routing의 해결**:
```
✅ 시나리오 1:
Intent 분류: "payroll" (급여)
→ Payroll Agent만 선택
→ 정확한 답변! ✅

✅ 시나리오 2:
Router가 하나만 선택
"주소 변경" → Intent: navigation
→ Navigation Agent만 실행
→ 깔끔한 응답! ✅

✅ 시나리오 3:
Router에 규칙만 추가
{IntentType.NEW_TASK: new_agent}
→ 자동으로 라우팅! ✅
```

**비유**:
- **Routing 없음** = 모든 전화가 대표번호로 → 직접 찾아야 함
- **Routing 있음** = 자동 교환 "영업은 1번, 고객센터는 2번" → 자동 연결

## 📊 작동 원리


### Routing 과정

**1단계: Intent 파악**
```
사용자: "주소 변경하고 싶어"
→ Intent Classifier 호출
→ Intent: "navigation" (신뢰도 95%)
```

**2단계: 라우팅 규칙 적용**
```python
routing_rules = {
    "navigation": NavigationAgent,
    "knowledge": KnowledgeAgent,
    "faq": FAQAgent,
    "payroll": PayrollAgent
}

# Intent "navigation"에 맞는 Agent 선택
selected_agent = routing_rules["navigation"]
```

**3단계: Agent 실행**
```
NavigationAgent.process("주소 변경하고 싶어")
→ "P3 > 인사정보 > 변경신청에서 가능합니다"
```

## 💡 실제 구현

### 기본 Router

```python
from typing import Dict, Callable
from enum import Enum

class IntentType(Enum):
    """Intent 카테고리"""
    NAVIGATION = "navigation"
    KNOWLEDGE = "knowledge"
    FAQ = "faq"
    PAYROLL = "payroll"
    UNKNOWN = "unknown"

class Router:
    """기본 라우터"""

    def __init__(
        self,
        intent_classifier,
        agents: Dict[IntentType, Callable]
    ):
        """
        Args:
            intent_classifier: Intent 분류기
            agents: Intent → Agent 매핑
        """
        self.classifier = intent_classifier
        self.agents = agents

    def route(self, user_input: str) -> str:
        """요청을 적절한 Agent로 라우팅"""

        # 1. Intent 분류
        result = self.classifier.classify(user_input)
        intent = IntentType(result['intent'])
        confidence = result['confidence']

        print(f"[Router] Intent: {intent.value} ({confidence:.0%})")

        # 2. 신뢰도 체크
        if confidence < 0.7:
            print("[Router] 낮은 신뢰도 → Fallback")
            intent = IntentType.UNKNOWN

        # 3. Agent 선택
        agent = self.agents.get(intent)
        if not agent:
            agent = self.agents[IntentType.UNKNOWN]

        # 4. Agent 실행
        return agent(user_input)

# 사용 예시
agents = {
    IntentType.NAVIGATION: lambda x: f"[메뉴 안내] {x}",
    IntentType.KNOWLEDGE: lambda x: f"[규정 검색] {x}",
    IntentType.FAQ: lambda x: f"[FAQ] {x}",
    IntentType.PAYROLL: lambda x: f"[급여 정보] {x}",
    IntentType.UNKNOWN: lambda x: "죄송합니다. 이해하지 못했습니다."
}

router = Router(intent_classifier, agents)
response = router.route("주소 변경하고 싶어")
```

**실행 결과**:
```
[Router] Intent: navigation (95%)
[메뉴 안내] 주소 변경하고 싶어
```

### 조건부 Routing

특정 조건을 추가로 확인:

```python
class SmartRouter(Router):
    """조건을 확인하는 Router"""

    def route_with_conditions(
        self,
        user_input: str,
        user_context: dict
    ) -> str:
        """조건을 고려한 라우팅"""

        intent = self.classify_intent(user_input)

        # 조건 1: 권한 확인
        if intent == IntentType.PAYROLL:
            if not user_context.get('has_payroll_access'):
                return "❌ 급여 정보 조회 권한이 없습니다."

        # 조건 2: 업무 시간 확인
        if intent == IntentType.PAYROLL:
            from datetime import datetime
            hour = datetime.now().hour
            if not (9 <= hour < 18):
                return "⏰ 급여 조회는 업무시간(9-18시)만 가능합니다."

        # 조건 3: PII 감지
        if self.contains_pii(user_input):
            return "🔒 개인정보가 감지되어 처리할 수 없습니다."

        # 기본 라우팅
        return self.route(user_input)
```

**사용 예시**:
```python
user_context = {
    'user_id': 'user123',
    'has_payroll_access': False  # 권한 없음
}

response = router.route_with_conditions(
    "급여명세서 보여줘",
    user_context
)
# → "❌ 급여 정보 조회 권한이 없습니다."
```

## 🎯 Routing vs Orchestration

많은 사람들이 혼동하는 개념:

| 특성 | Routing | Orchestration |
|------|---------|---------------|
| **역할** | 1개 Agent 선택 | 여러 Agent 조율 |
| **복잡도** | 단순 | 복잡 |
| **결과 통합** | 없음 | 있음 |
| **Fallback** | 기본적 | 고급 |

**비유**:
- **Router** = 교환원 (전화를 담당 부서로 연결)
- **Orchestrator** = 프로젝트 매니저 (여러 팀을 조율)

**실제 예시**:

**Router**:
```
사용자: "주소 변경 방법?"
Router: Navigation Agent로 연결
→ 끝
```

**Orchestrator**:
```
사용자: "주소 변경하고, 육아휴직도 신청하고 싶어"
Orchestrator:
1. Navigation Agent: 주소 변경 방법
2. Knowledge Agent: 육아휴직 규정
3. 결과 통합: "1. 주소는... 2. 육아휴직은..."
→ 통합 답변
```

## 🔧 고급 Routing 기법

### 1. Semantic Routing (의미 기반)

벡터 유사도로 Agent 선택:

```python
class SemanticRouter:
    """의미 기반 라우터"""

    def __init__(self):
        # 각 Agent의 설명을 임베딩으로 변환
        self.agent_embeddings = {
            "navigation": embed("시스템 사용법 안내"),
            "knowledge": embed("회사 규정 검색"),
            "faq": embed("자주 묻는 질문")
        }

    def route(self, user_input: str) -> str:
        # 사용자 입력을 임베딩으로 변환
        input_embedding = embed(user_input)

        # 각 Agent와의 유사도 계산
        similarities = {
            agent: cosine_similarity(input_embedding, emb)
            for agent, emb in self.agent_embeddings.items()
        }

        # 가장 유사한 Agent 선택
        best_agent = max(similarities, key=similarities.get)
        return best_agent
```

### 2. Load Balancing (부하 분산)

여러 Agent 인스턴스 중 선택:

```python
class LoadBalancingRouter:
    """부하 분산 라우터"""

    def __init__(self, agent_pools):
        # Intent별 여러 Agent 인스턴스
        self.pools = {
            IntentType.FAQ: [agent1, agent2, agent3]
        }
        self.index = 0

    def route(self, user_input: str):
        intent = self.classify(user_input)
        pool = self.pools[intent]

        # 라운드 로빈으로 선택
        agent = pool[self.index % len(pool)]
        self.index += 1

        return agent.process(user_input)
```

## 🔗 관련 용어

- [[Intent 분류]]: Routing의 첫 단계
- [[Orchestrator]]: Routing의 확장 개념
- [[AI Agent]]: Routing의 대상
- [[Fallback]]: Routing 실패 시 대응

## 📚 참고자료

- [LangChain Routing](https://python.langchain.com/docs/how_to/routing/)
- [Semantic Routing](https://github.com/aurelio-labs/semantic-router)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
