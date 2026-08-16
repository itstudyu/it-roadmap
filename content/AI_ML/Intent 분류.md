# Intent 분류 (Intent Classification)

## 📝 정의

Intent 분류는 사용자 입력의 **의도(Intent)**를 파악하는 기술입니다. "사용자가 무엇을 원하는가?"를 자동으로 인식하여 적절한 작업을 수행할 수 있게 합니다.

### 핵심 개념

- **무엇인가?**: 텍스트에서 사용자의 의도를 자동 분류
- **왜 필요한가?**: 올바른 Agent/서비스로 요청을 전달하기 위해
- **어떻게 작동하나?**: 입력 → 분석 → 카테고리 판별

### Intent 분류가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 수동 분류의 어려움
고객 센터:
- 하루 1,000건의 문의
- 사람이 일일이 "이건 A팀, 저건 B팀" 분류
→ 느리고, 실수 많고, 비용 증가! 😱

😱 시나리오 2: 잘못된 라우팅
사용자: "주소 변경하고 싶어"

시스템:
→ FAQ Agent: "FAQ 검색 중..."
→ 급여 Agent: "급여 정보 검색 중..."
→ 모두 실패! 😱

올바른 Agent는 Navigation Agent인데!

😱 시나리오 3: 애매한 표현
사용자: "얼마나 남았어?"

의미가 여러 가지:
- 연차가 얼마나 남았어?
- 급여일까지 얼마나 남았어?
- 계약 기간이 얼마나 남았어?
→ 파악 불가! 😱
```

**Intent 분류의 해결**:
```
✅ 시나리오 1:
AI가 자동 분류
→ 1초에 수백 건 처리
→ 정확하고 빠름! ✅

✅ 시나리오 2:
"주소 변경하고 싶어" 분석
→ Intent: "navigation" (신청 안내)
→ Navigation Agent만 실행
→ 정확한 답변! ✅

✅ 시나리오 3:
이전 대화 맥락 참고
이전: "이번 달 휴가 계획 중이야"
현재: "얼마나 남았어?"
→ Intent: "연차 조회"
→ 정확한 답변! ✅
```

**비유**:
- **Intent 분류 없음** = 모든 전화가 대표번호로 → 혼란
- **Intent 분류 있음** = 자동 안내 "1번은 인사, 2번은 재무" → 효율

## 📊 작동 원리


### 분류 과정

**1단계: 전처리**
```
원본: "주소 변경하고 싶어요ㅠㅠ"
→ 소문자 변환
→ 특수문자 제거
→ 토큰화
결과: ["주소", "변경", "싶어"]
```

**2단계: Intent 후보 생성**
```
"주소 변경" 키워드 분석:
- navigation (90%) - "변경", "신청" 등의 단어
- knowledge (5%) - "주소" 관련 규정?
- faq (3%) - 자주 묻는 질문?
- payroll (2%) - 관련 없음
```

**3단계: 최종 Intent 선택**
```
가장 높은 확률: navigation (90%)
신뢰도 임계값: 70% 이상
→ ✅ "navigation" 선택
```

## 💡 실제 구현

### LLM 기반 Intent 분류

```python
from openai import OpenAI

class IntentClassifier:
    """LLM을 사용한 Intent 분류기"""

    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

        # 정의된 Intent 카테고리
        self.intents = {
            "navigation": "시스템 사용법, 메뉴 위치, 신청 방법",
            "knowledge": "회사 규정, 취업규칙, 정책 문서",
            "faq": "자주 묻는 질문",
            "payroll": "급여, 급여명세서"
        }

    def classify(self, user_input: str) -> dict:
        """Intent 분류"""

        prompt = f"""
사용자 입력의 의도를 분류하세요.

입력: "{user_input}"

Intent 카테고리:
- navigation: 시스템 사용법, 신청 방법
- knowledge: 회사 규정, 문서 검색
- faq: 자주 묻는 질문
- payroll: 급여 관련

JSON 형식으로 응답:
{{"intent": "카테고리명", "confidence": 0.95}}
"""

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0  # 일관된 분류
        )

        import json
        return json.loads(response.choices[0].message.content)

# 사용
classifier = IntentClassifier(api_key="your-key")
result = classifier.classify("주소 변경하고 싶어")

print(f"Intent: {result['intent']}")  # "navigation"
print(f"확률: {result['confidence']}")  # 0.95
```

**각 부분 설명**:

1. **`self.intents`**: 분류할 카테고리 정의
   - 명확한 설명이 정확도 향상

2. **`temperature=0`**: 결정론적 분류
   - 같은 입력 → 항상 같은 결과
   - 일관성 중요

3. **신뢰도(confidence)**: 분류의 확실성
   - 0.9 이상: 매우 확실
   - 0.7~0.9: 확실
   - 0.7 미만: 불확실 → Fallback 고려

### Few-shot Learning

더 정확한 분류를 위해 **예시**를 제공:

```python
def classify_with_examples(self, user_input: str) -> str:
    """예시를 활용한 분류"""

    prompt = f"""
예시를 보고 Intent를 분류하세요:

예시 1: "주소 변경 어떻게 해?" → navigation
예시 2: "급여 언제 나와?" → payroll
예시 3: "육아휴직 기간은?" → knowledge
예시 4: "로그인이 안 돼" → faq

이제 분류하세요:
입력: "{user_input}" → Intent:
"""

    # LLM 호출...
```

**Few-shot의 장점**:
- 예시를 보고 학습
- 설명 없이도 패턴 파악
- 정확도 향상

## 📊 분류 방법 비교

| 방법 | 장점 | 단점 | 사용 시나리오 |
|------|------|------|--------------|
| **LLM 기반** | 높은 정확도<br/>문맥 이해<br/>Few-shot | API 비용<br/>느린 속도 | 복잡한 의도<br/>다양한 표현 |
| **ML 기반** | 빠른 속도<br/>저렴한 비용<br/>오프라인 | 학습 데이터 필요<br/>제한된 정확도 | 정해진 패턴<br/>대량 처리 |
| **규칙 기반** | 단순 명확<br/>즉시 응답 | 유연성 부족<br/>유지보수 어려움 | 키워드 기반<br/>단순 분류 |

### 실제 선택 가이드

```
복잡도 낮음 (키워드만으로 판별 가능)
→ 규칙 기반 (예: "급여" 포함 → payroll)

복잡도 중간 (패턴이 있지만 다양함)
→ ML 기반 (예: Naive Bayes, SVM)

복잡도 높음 (맥락/뉘앙스 중요)
→ LLM 기반 (예: GPT-4, Claude)
```

## 🎯 정확도 향상 팁

### 1. 명확한 Intent 정의

```python
# ❌ 나쁜 예
intents = {
    "general": "일반적인 질문",  # 너무 애매
    "info": "정보"  # 불명확
}

# ✅ 좋은 예
intents = {
    "navigation": "시스템 메뉴 위치, 신청 방법, 화면 사용법",
    "policy": "회사 규정, 취업규칙 제15조 같은 정책 문서"
}
```

### 2. 불확실할 때 사용자에게 물어보기

```python
result = classifier.classify(user_input)

if result['confidence'] < 0.7:
    # 불확실함 → 사용자에게 확인
    return "다음 중 어느 것을 원하시나요?\n1. 신청 방법\n2. 규정 확인\n3. FAQ"
else:
    # 확실함 → 바로 실행
    return route_to_agent(result['intent'])
```

### 3. 이전 대화 맥락 활용

```python
# 맥락 고려
conversation_history = [
    "사용자: 연차 신청하고 싶어요",
    "봇: 연차 신청은 P3에서 가능합니다",
    "사용자: 얼마나 남았어?"  # ← 이게 무슨 의미?
]

# Intent 분류 시 이전 대화 참고
# "연차" 관련 대화 → "얼마나 남았어" = "연차 잔여일수 조회"
```

## 🔗 관련 용어

- [[Routing]]: Intent 분류 후 Agent 선택
- [[Orchestrator]]: 여러 Intent를 조율
- [[LLM]]: Intent 분류에 사용되는 모델
- [[AI Agent]]: Intent에 따라 작업하는 시스템

## 📚 참고자료

- [Rasa NLU - Intent Classification](https://rasa.com/docs/rasa/nlu/)
- [Hugging Face Intent Detection](https://huggingface.co/tasks/text-classification)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
