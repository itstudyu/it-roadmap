# LangGraph

## 📝 정의

LangGraph는 **LLM 애플리케이션의 복잡한 흐름을 그래프로 정의하고 실행하는 프레임워크**입니다. 상태 관리와 조건부 분기를 쉽게 구현할 수 있습니다.

### 핵심 개념

- **무엇인가?**: LLM 앱의 워크플로우를 그래프로 관리
- **왜 필요한가?**: 복잡한 AI 에이전트 로직을 체계적으로 관리
- **어떻게 작동하나?**: 노드(작업) + 엣지(흐름) → 그래프 실행

### LangGraph가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 복잡한 AI 에이전트
질문 분류 → 데이터 검색 → 답변 생성 → 검증
→ if/else 중첩으로 코드 복잡
→ 유지보수 어려움! 😱
```

**LangGraph의 해결**:
```
✅ 그래프로 정의:
graph.add_node("classify", classify_fn)
graph.add_node("search", search_fn)
graph.add_edge("classify", "search")
→ 흐름 명확, 관리 쉬움! ✅
```

## 💡 LangGraph 예시

```python
from langgraph.graph import StateGraph

# 상태 정의
class State(TypedDict):
    question: str
    context: str
    answer: str

# 그래프 생성
graph = StateGraph(State)

# 노드 추가
graph.add_node("retrieve", retrieve_docs)
graph.add_node("generate", generate_answer)

# 엣지 추가
graph.add_edge("retrieve", "generate")

# 실행
result = graph.invoke({"question": "RAG가 뭐에요?"})
```

## 🔗 관련 용어

- [[LangChain]]: LangGraph의 상위 프레임워크
- [[AI Agent]]: LangGraph의 사용 사례
- [[Workflow]]: LangGraph가 구현하는 것

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
