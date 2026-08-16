# Fallback (폴백)

## 📝 정의

Fallback(폴백)은 첫 번째 시도가 실패했을 때 자동으로 실행되는 **대체 방법**입니다. 하나의 방법이 실패해도 다른 방법을 순차적으로 시도하여 최대한 사용자에게 답변을 제공합니다.

### 핵심 개념

- **무엇인가?**: 실패 시 자동으로 다른 방법 시도
- **왜 필요한가?**: 하나의 실패가 전체 실패로 이어지지 않게
- **어떻게 작동하나?**: 1차 시도 → 실패 → 2차 시도 → 실패 → 3차 시도...

### Fallback이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 단일 실패점
사용자: "재택근무 규정?"

시스템 (Fallback 없음):
→ FAQ Agent: "FAQ에 없습니다"
→ 끝! 사용자에게 빈 응답
→ 불만족! 😱

😱 시나리오 2: 데이터 소스 하나만 의존
사용자: "육아휴직 기간?"

시스템:
→ Knowledge DB: [오프라인]
→ "서비스를 이용할 수 없습니다"
→ 시스템 장애! 😱

😱 시나리오 3: Agent 과부하
사용자: "급여명세서 조회"

시스템:
→ Payroll Agent: [과부하로 응답 없음]
→ 타임아웃... 응답 없음
→ 사용자 이탈! 😱
```

**Fallback의 해결**:
```
✅ 시나리오 1 (Fallback 체인):
1차: FAQ Agent → "없음"
2차: Knowledge Agent → "취업규칙 제15조..."
→ 답변 성공! ✅

✅ 시나리오 2:
1차: Knowledge DB → [오프라인]
2차: 웹 검색 Agent → "육아휴직은..."
3차: 일반 LLM → "일반적으로..."
→ 답변 제공! ✅

✅ 시나리오 3:
1차: Payroll Agent → [타임아웃]
2차: 백업 Payroll Agent → "급여명세서는..."
→ 서비스 지속! ✅
```

**비유**:
- **Fallback 없음** = 주문 음식이 품절이면 굶음
- **Fallback 있음** = 품절이면 다른 메뉴 추천 받음

## 💡 실제 구현

### 기본 Fallback 체인

```python
from typing import List, Callable, Optional

class FallbackChain:
    """Fallback 체인 관리자"""

    def __init__(self, agents: List[Callable]):
        """
        Args:
            agents: Agent 함수 리스트 (우선순위 순)
        """
        self.agents = agents

    def execute(self, user_input: str) -> str:
        """Fallback 체인 실행"""

        for i, agent in enumerate(self.agents, 1):
            agent_name = agent.__name__
            print(f"[Try {i}/{len(self.agents)}] {agent_name}")

            try:
                result = agent(user_input)

                # 결과 검증
                if self._is_valid(result):
                    print(f"✅ {agent_name} 성공!")
                    return result
                else:
                    print(f"❌ {agent_name} 실패 (결과 없음)")

            except Exception as e:
                print(f"❌ {agent_name} 오류: {e}")
                continue

        # 모든 시도 실패
        return self._default_response(user_input)

    def _is_valid(self, result: Optional[str]) -> bool:
        """결과 유효성 검사"""
        if not result:
            return False

        # 불충분한 응답 필터링
        invalid_keywords = [
            "찾을 수 없",
            "결과가 없",
            "모르겠"
        ]
        return not any(kw in result for kw in invalid_keywords)

    def _default_response(self, user_input: str) -> str:
        """최종 기본 응답"""
        return f"죄송합니다. '{user_input}'에 대한 정보를 찾을 수 없습니다."


# Agent 정의
def faq_agent(query: str) -> Optional[str]:
    """FAQ 검색"""
    faq_db = {
        "비밀번호": "비밀번호는 초기화 메뉴에서 재설정하세요."
    }
    return faq_db.get(query)

def knowledge_agent(query: str) -> Optional[str]:
    """Knowledge Base 검색"""
    if "연차" in query:
        return "취업규칙 제10조: 연차는 연간 20일입니다."
    return None

def web_search_agent(query: str) -> Optional[str]:
    """웹 검색 (최후 수단)"""
    return f"'{query}'에 대한 웹 검색 결과입니다..."


# Fallback 체인 구성 (우선순위 순)
chain = FallbackChain([
    faq_agent,           # 1순위: 가장 빠름
    knowledge_agent,     # 2순위: 정확함
    web_search_agent     # 3순위: 최후 수단
])

# 실행
result = chain.execute("연차")
print(f"\n최종 결과: {result}")
```

**실행 과정**:
```
[Try 1/3] faq_agent
❌ faq_agent 실패 (결과 없음)
[Try 2/3] knowledge_agent
✅ knowledge_agent 성공!

최종 결과: 취업규칙 제10조: 연차는 연간 20일입니다.
```

### Intent별 Fallback 전략

서로 다른 Intent에 맞는 Fallback 체인:

```python
class SmartFallbackRouter:
    """Intent별 최적화된 Fallback"""

    def __init__(self):
        # Intent별로 다른 Fallback 체인
        self.fallback_strategies = {
            "faq": [faq_agent, knowledge_agent],
            "knowledge": [knowledge_agent, web_search_agent],
            "navigation": [navigation_agent, general_help_agent]
        }

    def execute(self, user_input: str, intent: str) -> str:
        """Intent에 맞는 Fallback 실행"""

        agents = self.fallback_strategies.get(intent, [])
        if not agents:
            return "적절한 Agent를 찾을 수 없습니다."

        chain = FallbackChain(agents)
        return chain.execute(user_input)
```

**사용 예시**:
```python
router = SmartFallbackRouter()

# FAQ Intent
result1 = router.execute("비밀번호 찾기", intent="faq")
# → faq_agent 시도 → knowledge_agent 시도

# Knowledge Intent
result2 = router.execute("육아휴직 규정", intent="knowledge")
# → knowledge_agent 시도 → web_search_agent 시도
```

## 🎯 Fallback 전략 비교

| 전략 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **Sequential** | 순차적 시도 | 간단, 명확 | 느릴 수 있음 |
| **Parallel** | 동시 실행 | 빠름 | 리소스 소모 많음 |
| **Weighted** | 우선순위 기반 | 효율적 | 설정 필요 |
| **Adaptive** | 과거 성공률 기반 | 최적화됨 | 복잡함 |

**실제 선택 가이드**:
```
속도보다 정확성이 중요 → Sequential
빠른 응답이 중요 → Parallel
리소스 제한 있음 → Weighted
장기 운영 시스템 → Adaptive
```

## 📊 Fallback vs Escalation

| 특성 | Fallback | Escalation |
|------|----------|------------|
| **목적** | 대안 방법 찾기 | 사람에게 인계 |
| **자동화** | 완전 자동 | 사람 개입 필요 |
| **비용** | 낮음 | 높음 |
| **속도** | 빠름 | 느림 |
| **시점** | Agent 실패 시 | AI 한계 도달 시 |

**실제 흐름**:
```
1. 요청 수신
2. Primary Agent 시도
3. 실패 → Fallback Agent들 시도
4. 모든 Fallback 실패 → Escalation (사람에게)
```

## 🔗 관련 용어

- [[AI Agent]]: Fallback의 주체
- [[Routing]]: 첫 Agent 선택
- [[Escalation]]: Fallback 실패 후 단계
- [[RAG]]: Fallback에서 사용할 수 있는 기술

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
