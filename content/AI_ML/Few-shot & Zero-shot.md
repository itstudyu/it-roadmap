# Few-shot & Zero-shot Learning

## 📝 정의

Few-shot과 Zero-shot은 **LLM이 예시의 개수에 따라 작업을 수행하는 방식**입니다. 추가 학습 없이 프롬프트만으로 새로운 작업을 수행할 수 있습니다.

### 핵심 개념

- **Zero-shot**: 예시 없이 지시만으로 작업 수행
- **Few-shot**: 몇 개의 예시를 보고 패턴을 학습해 작업 수행
- **One-shot**: 1개의 예시만 제공
- **Many-shot**: 많은 예시 제공 (수십~수백 개)

### Few-shot/Zero-shot이 해결하는 문제

**기존 ML의 한계**:
```
😱 전통적인 ML
새 작업마다 수천~수만 개 학습 데이터 필요
→ 데이터 수집 어려움! 😱
→ 학습 시간 오래 걸림! 😱

😱 Fine-tuning
최소 50~100개 예시 필요
→ 비용 발생! 😱
→ 업데이트 어려움! 😱
```

**Few-shot/Zero-shot의 해결**:
```
✅ Zero-shot: 예시 0개
"다음 문장의 감정을 분류하세요"
→ 바로 작업 수행! ✅

✅ Few-shot: 예시 2~3개
예시 1: "좋아요" → 긍정
예시 2: "별로예요" → 부정
이제 분류: "최고예요" → ?
→ 패턴 학습 후 수행! ✅
```

## 📊 Zero-shot vs Few-shot 비교


**비교표**:
```python
comparison = {
    "Zero-shot": {
        "예시 개수": "0개",
        "토큰 사용": "적음",
        "정확도": "보통",
        "적합": "일반적인 작업",
        "예": "감정 분류, 요약, 번역"
    },
    "Few-shot": {
        "예시 개수": "2~10개",
        "토큰 사용": "많음",
        "정확도": "높음",
        "적합": "특정 형식, 도메인 지식",
        "예": "회사 규정 Q&A, 특정 형식 변환"
    },
    "Many-shot": {
        "예시 개수": "수십~수백 개",
        "토큰 사용": "매우 많음",
        "정확도": "매우 높음",
        "적합": "복잡한 패턴 학습",
        "예": "코드 생성, 복잡한 추론"
    }
}
```

## 💡 구현 예시

### 1. Zero-shot

```python
def zero_shot_classification(text: str) -> str:
    """Zero-shot 감정 분류"""
    
    prompt = f"""
다음 문장의 감정을 분류하세요: 긍정, 부정, 중립

문장: {text}
감정:
"""
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    return response.choices[0].message.content

# 사용
print(zero_shot_classification("이 제품 정말 좋아요!"))  # 긍정
print(zero_shot_classification("별로예요"))              # 부정
print(zero_shot_classification("그냥 그래요"))           # 중립
```

### 2. Few-shot

```python
def few_shot_classification(text: str) -> str:
    """Few-shot 감정 분류 (더 정확)"""
    
    prompt = f"""
다음 예시처럼 문장의 감정을 분류하세요:

예시 1:
문장: "정말 최고예요!"
감정: 긍정

예시 2:
문장: "실망스럽네요"
감정: 부정

예시 3:
문장: "보통이에요"
감정: 중립

이제 분류하세요:
문장: {text}
감정:
"""
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    return response.choices[0].message.content

# 사용
print(few_shot_classification("별로 좋지 않아요"))  # 부정 (더 정확)
```

### 3. P3 시스템에서의 Few-shot

```python
class P3FewShotQA:
    """P3 취업규칙 Few-shot Q&A"""
    
    def __init__(self):
        self.client = OpenAI()
        
        # Few-shot 예시 (P3 시스템의 표준 답변 형식)
        self.examples = [
            {
                "question": "연차는 몇 일?",
                "answer": "제30조에 따르면, 입사 1년 후부터 연차휴가 15일을 사용할 수 있습니다."
            },
            {
                "question": "병가 신청 방법은?",
                "answer": "제31조에 따르면, 병가 신청 시 의사 진단서를 제출해야 합니다."
            },
            {
                "question": "육아휴직 기간은?",
                "answer": "제32조에 따르면, 육아휴직 기간은 최대 2년입니다."
            }
        ]
    
    def generate_answer(self, question: str, context: str) -> str:
        """Few-shot으로 답변 생성"""
        
        # Few-shot 프롬프트 구성
        prompt = "다음 예시처럼 답변하세요:\n\n"
        
        # 예시 추가
        for i, example in enumerate(self.examples, 1):
            prompt += f"예시 {i}:\n"
            prompt += f"질문: {example['question']}\n"
            prompt += f"답변: {example['answer']}\n\n"
        
        # 실제 질문
        prompt += f"참고 문서:\n{context}\n\n"
        prompt += f"질문: {question}\n답변:"
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        
        return response.choices[0].message.content

# 사용
qa = P3FewShotQA()

context = "제33조 (경조사휴가): 결혼 시 5일, 직계가족 사망 시 5일의 유급휴가를 사용할 수 있다."

answer = qa.generate_answer("결혼하면 휴가 며칠?", context)
print(answer)
# 출력: "제33조에 따르면, 결혼 시 5일의 유급휴가를 사용할 수 있습니다."
```

## 🎯 Zero-shot vs Few-shot 성능 비교

### 실험: 취업규칙 Q&A 정확도

```python
evaluation = {
    "Zero-shot": {
        "정확도": "75%",
        "토큰": "50 tokens/query",
        "비용": "$0.0015/query",
        "특징": "일반적인 질문은 잘 답변"
    },
    "Few-shot (3개)": {
        "정확도": "88%",
        "토큰": "200 tokens/query",
        "비용": "$0.006/query",
        "특징": "형식 일관성, 출처 명시"
    },
    "Few-shot (10개)": {
        "정확도": "92%",
        "토큰": "500 tokens/query",
        "비용": "$0.015/query",
        "특징": "매우 정확, 도메인 특화"
    },
    "RAG + Zero-shot": {
        "정확도": "90%",
        "토큰": "300 tokens/query",
        "비용": "$0.009/query",
        "특징": "최신 정보, 유연성"
    }
}

# P3 권장: RAG + Few-shot (2~3개 예시)
# → 정확도 95% + 비용 효율
```

## 🚀 Few-shot 최적화 전략

### 1. 예시 선택이 중요

```python
# 나쁜 예시: 비슷한 예시들
bad_examples = [
    {"Q": "연차는?", "A": "..."},
    {"Q": "연차 며칠?", "A": "..."},
    {"Q": "연차 일수는?", "A": "..."}
]
# → 다양성 부족!

# 좋은 예시: 다양한 질문 유형
good_examples = [
    {"Q": "연차는?", "A": "..."},         # 수량 질문
    {"Q": "병가 신청 방법은?", "A": "..."}, # 절차 질문
    {"Q": "육아휴직 대상은?", "A": "..."}   # 자격 질문
]
# → 다양한 패턴 학습!
```

### 2. 예시 개수 최적화

```python
def optimize_few_shot_count(questions: list, max_examples: int = 10):
    """최적의 예시 개수 찾기"""
    
    results = []
    
    for n in range(1, max_examples + 1):
        # n개 예시로 테스트
        accuracy = test_with_n_examples(questions, n)
        cost = calculate_cost(n)
        
        results.append({
            'n': n,
            'accuracy': accuracy,
            'cost': cost,
            'score': accuracy / cost  # 비용 대비 정확도
        })
    
    # 최적점 찾기
    best = max(results, key=lambda x: x['score'])
    
    return best

# 결과: 보통 3~5개가 최적
```

### 3. Chain-of-Thought (CoT) 결합

```python
def few_shot_with_cot(question: str) -> str:
    """Few-shot + Chain-of-Thought"""
    
    prompt = """
다음 예시처럼 단계별로 생각하고 답변하세요:

예시 1:
질문: "사과 3개가 1,000원이면 7개는?"
생각:
1. 사과 1개 가격: 1,000 ÷ 3 = 333원
2. 7개 가격: 333 × 7 = 2,331원
답변: 약 2,331원입니다.

예시 2:
질문: "육아휴직 1년 쓰고 복직하면 또 쓸 수 있나?"
생각:
1. 제32조: 최대 2년
2. 이미 1년 사용
3. 남은 기간: 2 - 1 = 1년
답변: 제32조에 따르면 최대 2년이므로, 1년 더 사용 가능합니다.

이제 답변하세요:
질문: {question}
생각:
"""
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    return response.choices[0].message.content
```

## 🚨 주의사항

### 1. 토큰 비용

```python
# Few-shot은 토큰을 많이 사용
zero_shot_tokens = 50
few_shot_3_tokens = 200   # 4배
few_shot_10_tokens = 500  # 10배

# 월 비용 계산
monthly_queries = 100000

cost_zero = (monthly_queries * zero_shot_tokens / 1000) * 0.03
cost_few_3 = (monthly_queries * few_shot_3_tokens / 1000) * 0.03
cost_few_10 = (monthly_queries * few_shot_10_tokens / 1000) * 0.03

print(f"Zero-shot: ${cost_zero:.2f}/월")    # $150
print(f"Few-shot(3): ${cost_few_3:.2f}/월") # $600
print(f"Few-shot(10): ${cost_few_10:.2f}/월") # $1,500

# 절충안: Few-shot 3개 + RAG
```

### 2. Context Window 제한

```python
# GPT-4: 8K tokens
context_window = 8192

few_shot_examples = 10  # 예시
example_tokens = 50     # 예시당 토큰
query_tokens = 100
response_tokens = 200

total_needed = (few_shot_examples * example_tokens) + query_tokens + response_tokens
# = 500 + 100 + 200 = 800 tokens (OK)

# 예시가 너무 많으면?
few_shot_examples = 100  # 😱
total_needed = (100 * 50) + 100 + 200 = 5,300 tokens
# → Context Window 압박!

# 해결: 동적 예시 선택
def select_relevant_examples(query, all_examples, max_examples=5):
    """질문과 관련된 예시만 선택"""
    similarities = compute_similarities(query, all_examples)
    top_examples = sorted(similarities, reverse=True)[:max_examples]
    return top_examples
```

### 3. 예시 품질

```python
# 나쁜 예시
bad_example = {
    "Q": "육아휴직?",
    "A": "2년요"  # 😱 형식 불일치, 출처 없음
}

# 좋은 예시
good_example = {
    "Q": "육아휴직 기간은?",
    "A": "제32조에 따르면, 육아휴직 기간은 최대 2년입니다."  # ✅
}

# 일관성 있는 형식 사용!
```

## 🔗 관련 용어

- [[Prompt]]: Few-shot의 기반
- [[LLM]]: Few-shot 수행 주체
- [[Fine-tuning]]: Few-shot의 대안
- [[Context Window]]: Few-shot 제약
- [[Chain-of-Thought]]: Few-shot 응용

## 📝 정리

**Zero-shot vs Few-shot**:
```
Zero-shot: 예시 없이 지시만
→ 빠르고 저렴
→ 일반적인 작업

Few-shot: 예시로 패턴 학습
→ 정확하고 일관적
→ 도메인 특화 작업
```

**P3 시스템 권장**:
```
RAG + Few-shot (2~3개 예시)
→ 정확도: 95%
→ 비용: 중간
→ 유연성: 높음
```

**비유로 기억하기**:
```
Zero-shot = 설명만 듣고 작업
"감정 분류해줘"
→ 바로 시도

Few-shot = 예시 보고 작업
"이렇게 해줘: 좋아요→긍정, 별로→부정"
→ 패턴 파악 후 시도
→ 더 정확!
```

**예시 개수 가이드**:
```
0개 (Zero-shot): 일반 작업
1개 (One-shot): 형식 이해
2-3개 (Few-shot): 일반적 권장
5-10개: 복잡한 패턴
10개+: 토큰 낭비 (Fine-tuning 고려)
```

**P3 시스템 적용**:
```python
# 표준 답변 형식 학습
examples = [
    {"Q": "연차?", "A": "제30조에 따르면..."},
    {"Q": "병가?", "A": "제31조에 따르면..."},
    {"Q": "육아휴직?", "A": "제32조에 따르면..."}
]

# 3개 예시로 충분!
# → 출처 명시, 격식 있는 톤 학습
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
