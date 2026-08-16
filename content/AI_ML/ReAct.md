# ReAct (Reasoning + Acting)

## 📝 정의

ReAct는 **Reasoning(추론) + Acting(행동)**을 반복하는 AI Agent 패턴입니다.

### 핵심 개념

- **무엇인가?**: 생각 → 행동 → 관찰 순환
- **왜 필요한가?**: 복잡한 문제를 단계별로 해결
- **어떻게?**: Thought → Action → Observation 반복

## 💡 ReAct 흐름

```
사용자: "내일 서울 날씨 어때?"

[순환 1]
Thought: "날씨 정보가 필요함. 날씨 API 호출해야겠다"
Action: weather_api.get("서울", "내일")
Observation: "맑음, 15도"

[순환 2]
Thought: "정보를 얻었으니 답변하자"
Action: ANSWER
Final: "내일 서울은 맑고 15도입니다"
```

## 🔍 vs 단순 LLM

```python
# 단순 LLM
사용자: "내일 날씨?"
LLM: "저는 실시간 정보를 확인할 수 없습니다" ← 끝

# ReAct Agent
사용자: "내일 날씨?"
Agent:
  1. 생각: 날씨 API 필요
  2. 행동: API 호출
  3. 관찰: 맑음, 15도
  4. 답변: "내일은 맑고 15도"
```

## 📝 정리

**ReAct = 생각하고 행동하는 Agent**
- Thought: 무엇을 할지 판단
- Action: 도구 실행
- Observation: 결과 확인
- 반복하여 목표 달성

**P3 Chatbot Agent가 이 패턴 사용**

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
