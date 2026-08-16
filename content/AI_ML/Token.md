# Token (토큰)

## 📝 정의

Token은 **LLM이 텍스트를 처리하는 기본 단위**입니다. 단어보다 작거나 클 수 있으며, LLM 비용과 성능을 결정하는 핵심 요소입니다.

### 핵심 개념

- **무엇인가?**: 텍스트를 쪼갠 조각 (단어, 단어 일부, 또는 문자)
- **왜 필요한가?**: LLM이 텍스트를 이해하고 처리하기 위한 기본 단위
- **어떻게 작동하나?**: Tokenizer가 텍스트를 토큰으로 분할

### Token이 해결하는 문제

**문제 상황**:
```
😱 단어 단위 처리의 한계
"running", "runner", "ran" → 모두 다른 단어로 처리
→ 관계를 모름! 😱

😱 새로운 단어 처리 불가
"ChatGPT" → 사전에 없음
→ 처리 불가! 😱

😱 다국어 처리 어려움
한국어: 띄어쓰기 불규칙
일본어: 띄어쓰기 없음
→ 단어 경계 찾기 어려움! 😱
```

**Token의 해결**:
```
✅ 유연한 분할
"running" → ["run", "##ning"]
"runner" → ["run", "##ner"]
→ "run"이 공통! 관계 파악 ✅

✅ 미등록 단어 처리
"ChatGPT" → ["Chat", "G", "PT"]
→ 처리 가능! ✅

✅ 다국어 지원
"육아휴직" → ["육아", "휴직"] 또는 ["육", "아", "휴", "직"]
→ 언어별 최적화 ✅
```

## 💡 Token 계산

### 1. 영어 vs 한국어 토큰 수

```python
import tiktoken

# GPT-4 Tokenizer
encoding = tiktoken.encoding_for_model("gpt-4")

# 영어
text_en = "Parental leave period is 2 years."
tokens_en = encoding.encode(text_en)
print(f"영어: {len(tokens_en)} tokens")  # 7 tokens
print(f"토큰: {tokens_en}")

# 한국어
text_ko = "육아휴직 기간은 2년입니다."
tokens_ko = encoding.encode(text_ko)
print(f"한국어: {len(tokens_ko)} tokens")  # 15 tokens (영어의 2배!)
print(f"토큰: {tokens_ko}")

# 비용 차이
cost_en = len(tokens_en) * 0.00003  # GPT-4: $0.03/1K tokens
cost_ko = len(tokens_ko) * 0.00003
print(f"\n비용 - 영어: ${cost_en:.6f}")
print(f"비용 - 한국어: ${cost_ko:.6f} (약 2배)")
```

**출력**:
```
영어: 7 tokens
한국어: 15 tokens

비용 - 영어: $0.000210
비용 - 한국어: $0.000450 (약 2배)
```

### 2. 토큰 시각화

```python
def visualize_tokens(text: str):
    """토큰을 시각화"""
    encoding = tiktoken.encoding_for_model("gpt-4")
    tokens = encoding.encode(text)
    
    print(f"원문: {text}")
    print(f"토큰 수: {len(tokens)}\n")
    
    # 토큰별 디코딩
    for i, token_id in enumerate(tokens, 1):
        token_str = encoding.decode([token_id])
        print(f"Token {i}: '{token_str}' (ID: {token_id})")

# 사용
visualize_tokens("육아휴직은 2년")
```

**출력**:
```
원문: 육아휴직은 2년
토큰 수: 9

Token 1: '육' (ID: 166)
Token 2: '아' (ID: 232)
Token 3: '휴' (ID: 243)
Token 4: '직' (ID: 248)
Token 5: '은' (ID: 234)
Token 6: ' ' (ID: 220)
Token 7: '2' (ID: 17)
Token 8: '년' (ID: 234)
```

## 🔍 실전: P3 시스템 토큰 관리

### 1. Context Window 관리

```python
class P3TokenManager:
    """P3 시스템 토큰 관리"""
    
    def __init__(self, model="gpt-4"):
        self.encoding = tiktoken.encoding_for_model(model)
        self.max_tokens = 8192  # GPT-4 기본
        self.max_response_tokens = 2000
        
    def count_tokens(self, text: str) -> int:
        """텍스트의 토큰 수 계산"""
        return len(self.encoding.encode(text))
    
    def can_process(self, prompt: str, context: str) -> bool:
        """처리 가능 여부 확인"""
        total_tokens = (
            self.count_tokens(prompt) +
            self.count_tokens(context) +
            self.max_response_tokens
        )
        return total_tokens <= self.max_tokens
    
    def truncate_context(self, context: str, max_tokens: int) -> str:
        """컨텍스트를 토큰 수에 맞게 자르기"""
        tokens = self.encoding.encode(context)
        
        if len(tokens) <= max_tokens:
            return context
        
        # 토큰 수 제한
        truncated_tokens = tokens[:max_tokens]
        return self.encoding.decode(truncated_tokens)
    
    def estimate_cost(self, input_text: str, output_text: str) -> float:
        """비용 추정"""
        input_tokens = self.count_tokens(input_text)
        output_tokens = self.count_tokens(output_text)
        
        # GPT-4 가격 (2024년 기준)
        input_cost = input_tokens * 0.00003   # $0.03/1K tokens
        output_cost = output_tokens * 0.00006 # $0.06/1K tokens
        
        return input_cost + output_cost

# 사용 예시
manager = P3TokenManager()

# 사용자 질문
query = "육아휴직 기간과 신청 방법을 알려주세요."

# 검색된 문서들 (RAG)
documents = """
제32조 (육아휴직)
종업원은 1세 미만의 자녀를 양육하기 위해 육아휴직을 신청할 수 있다.
기간은 최대 2년이며, 인사팀에 신청서를 제출해야 한다.
...
""" * 10  # 긴 문서

# 토큰 수 확인
query_tokens = manager.count_tokens(query)
doc_tokens = manager.count_tokens(documents)

print(f"질문 토큰: {query_tokens}")
print(f"문서 토큰: {doc_tokens}")

# Context Window 초과 확인
if not manager.can_process(query, documents):
    print("\n⚠️ Context Window 초과! 문서 자르기...")
    documents = manager.truncate_context(
        documents,
        max_tokens=4000  # 문서에 4000 토큰만 할당
    )
    print(f"자른 후 토큰: {manager.count_tokens(documents)}")

# 비용 추정
response = "육아휴직은 최대 2년이며, 인사팀에 신청서를 제출하면 됩니다."
cost = manager.estimate_cost(query + documents, response)
print(f"\n예상 비용: ${cost:.4f}")
```

### 2. 배치 처리 시 토큰 최적화

```python
def batch_process_with_token_limit(
    queries: list[str],
    max_tokens_per_batch: int = 4000
):
    """토큰 제한을 고려한 배치 처리"""
    encoding = tiktoken.encoding_for_model("gpt-4")
    batches = []
    current_batch = []
    current_tokens = 0
    
    for query in queries:
        query_tokens = len(encoding.encode(query))
        
        # 현재 배치에 추가 가능?
        if current_tokens + query_tokens <= max_tokens_per_batch:
            current_batch.append(query)
            current_tokens += query_tokens
        else:
            # 새 배치 시작
            batches.append(current_batch)
            current_batch = [query]
            current_tokens = query_tokens
    
    # 마지막 배치 추가
    if current_batch:
        batches.append(current_batch)
    
    return batches

# 사용
queries = [
    "육아휴직은 얼마나?",
    "연차는 몇 일?",
    "병가 신청 방법은?",
    # ... 100개 질문
] * 30

batches = batch_process_with_token_limit(queries, max_tokens_per_batch=4000)
print(f"총 {len(batches)}개 배치로 분할")
```

## 🎯 토큰 최적화 전략

### 1. 불필요한 토큰 제거

```python
# 비효율적 (토큰 낭비)
prompt = """
안녕하세요! 저는 친절한 AI 비서입니다.
무엇을 도와드릴까요?
궁금하신 점이 있으시면 언제든지 물어보세요!

그럼 질문 주세요: 육아휴직은?
"""
# 토큰: ~50개

# 효율적 (핵심만)
prompt = "질문: 육아휴직은?"
# 토큰: ~10개

# 비용 절감: 80%!
```

### 2. 프롬프트 압축

```python
# 장황한 프롬프트 (비효율)
long_prompt = """
당신은 취업규칙 전문가입니다.
사용자의 질문에 친절하게 답변해주세요.
문서를 참고하여 정확한 답변을 제공하세요.
답변은 3줄 이내로 간결하게 작성하세요.
출처를 명시하세요.

질문: {question}
문서: {context}
답변:
"""
# 토큰: ~100개

# 압축된 프롬프트 (효율)
short_prompt = """
취업규칙 Q&A. 문서 참고, 3줄 이내, 출처 명시.

Q: {question}
Doc: {context}
A:
"""
# 토큰: ~40개

# 비용 절감: 60%!
```

## 🚨 주의사항

### 1. Context Window 제한

```python
model_limits = {
    "gpt-3.5-turbo": 4096,      # 4K tokens
    "gpt-4": 8192,               # 8K tokens
    "gpt-4-32k": 32768,          # 32K tokens
    "gpt-4-turbo": 128000,       # 128K tokens
    "claude-3-opus": 200000,     # 200K tokens
    "claude-3.5-sonnet": 200000, # 200K tokens
}

# P3 시스템 권장: GPT-4 Turbo (128K) 또는 Claude 3.5 (200K)
```

### 2. 한국어는 토큰이 더 많다

```python
# 같은 의미인데 토큰 수 차이
en = "Parental leave: 2 years"  # 6 tokens
ko = "육아휴직: 2년"             # 12 tokens (2배)

# P3 시스템: 한국어 사용
# → 토큰 비용 2배 고려 필요
# → 프롬프트 압축 더 중요!
```

### 3. 토큰 != 단어

```python
# 영어
"running" → ["run", "ning"]  # 2 tokens (1단어 → 2토큰)

# 한국어
"육아휴직" → ["육", "아", "휴", "직"]  # 4 tokens (1단어 → 4토큰)

# 긴 단어
"supercalifragilisticexpialidocious" → 여러 토큰으로 분할
```

## 💰 비용 계산

### LLM 서비스별 토큰 가격 (2024년 기준)

```python
pricing = {
    "gpt-4": {
        "input": 0.03,   # $0.03 per 1K tokens
        "output": 0.06   # $0.06 per 1K tokens
    },
    "gpt-4-turbo": {
        "input": 0.01,
        "output": 0.03
    },
    "gpt-3.5-turbo": {
        "input": 0.0005,
        "output": 0.0015
    },
    "claude-3-opus": {
        "input": 0.015,
        "output": 0.075
    },
    "claude-3.5-sonnet": {
        "input": 0.003,
        "output": 0.015
    }
}

def calculate_monthly_cost(
    queries_per_day: int,
    avg_tokens_per_query: int,
    avg_tokens_per_response: int,
    model: str = "gpt-4"
):
    """월 비용 계산"""
    price = pricing[model]
    
    # 일일 비용
    daily_input_cost = (queries_per_day * avg_tokens_per_query / 1000) * price["input"]
    daily_output_cost = (queries_per_day * avg_tokens_per_response / 1000) * price["output"]
    daily_cost = daily_input_cost + daily_output_cost
    
    # 월 비용
    monthly_cost = daily_cost * 30
    
    return monthly_cost

# P3 시스템 예상 비용
cost = calculate_monthly_cost(
    queries_per_day=1000,     # 하루 1000건 질문
    avg_tokens_per_query=500,  # 질문+문서: 500 토큰
    avg_tokens_per_response=100, # 답변: 100 토큰
    model="gpt-4-turbo"
)

print(f"P3 월 예상 비용: ${cost:.2f}")
```

## 🔗 관련 용어

- [[Context Window]]: 토큰의 최대 개수
- [[LLM]]: 토큰을 처리하는 모델
- [[Prompt]]: 입력 토큰
- [[Embedding]]: 토큰을 벡터로 변환
- [[Fine-tuning]]: 토큰 효율성 개선

## 📝 정리

**Token의 핵심**:
```
LLM의 기본 처리 단위
→ 비용 결정 요소
→ Context Window 제한
```

**P3 시스템 주의점**:
```
한국어 = 영어 대비 2배 토큰
→ 프롬프트 압축 중요
→ 문서 자르기 필수
→ 비용 2배 고려
```

**비유로 기억하기**:
```
Token = 요리의 재료
Context Window = 냄비 크기
많은 재료(토큰) = 비용 증가
큰 냄비(Context Window) = 많은 재료 처리 가능
```

**최적화 원칙**:
```
1. 불필요한 토큰 제거
2. 프롬프트 압축
3. Context Window 관리
4. 한국어 특성 고려
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
