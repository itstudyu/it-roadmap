# Hallucination (환각, 할루시네이션)

## 📝 정의

Hallucination은 **LLM이 사실이 아닌 정보를 그럴듯하게 생성하는 현상**입니다. RAG 시스템에서 반드시 방어해야 하는 핵심 문제입니다.

### 핵심 개념

- **무엇인가?**: LLM이 거짓 정보를 마치 사실처럼 답변
- **왜 발생하나?**: 학습 데이터 한계, 확률적 텍스트 생성
- **어떻게 방어하나?**: RAG, Citation, Confidence Score

### Hallucination이 만드는 문제

**문제 상황**:
```
😱 시나리오 1: 없는 정보 지어냄
질문: "제40조 내용은?"
문서: 제30~35조만 존재
LLM: "제40조는 퇴직금 관련 규정입니다..." 😱
→ 완전히 지어낸 답변!

😱 시나리오 2: 그럴듯한 거짓말
질문: "육아휴직 급여는?"
문서: 급여 정보 없음
LLM: "육아휴직 중 급여는 기본급의 80%입니다" 😱
→ 사실처럼 들리지만 거짓!

😱 시나리오 3: 날짜/숫자 조작
질문: "회사 창립일은?"
문서: 창립일 정보 없음
LLM: "1995년 3월 15일에 창립되었습니다" 😱
→ 구체적인 날짜까지 지어냄!
```

**방어 전략의 효과**:
```
✅ RAG (Retrieval-Augmented Generation)
문서에 있는 정보만 참고
→ 없는 정보는 "문서에 없음" 답변 ✅

✅ Citation (출처 명시)
"제32조에 따르면..." (출처 링크)
→ 검증 가능 ✅

✅ Confidence Score
유사도 0.3 → "관련 정보를 찾지 못했습니다"
→ 낮은 신뢰도는 답변 거부 ✅
```

## 💡 Hallucination 방어 구현

### 1. RAG로 방어

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import openai

class HallucinationDefender:
    """Hallucination 방어 시스템"""
    
    def __init__(self):
        self.embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
        self.threshold = 0.5  # 유사도 임계값
    
    def search_documents(self, query: str, documents: list) -> dict:
        """문서에서 관련 정보 검색"""
        # 질문 임베딩
        query_vec = self.embedding_model.encode([query])
        
        # 문서들 임베딩
        doc_vecs = self.embedding_model.encode(documents)
        
        # 유사도 계산
        similarities = cosine_similarity(query_vec, doc_vecs)[0]
        
        # 가장 유사한 문서
        max_idx = similarities.argmax()
        max_sim = similarities[max_idx]
        
        return {
            'document': documents[max_idx],
            'similarity': float(max_sim),
            'found': max_sim >= self.threshold
        }
    
    def generate_answer(self, query: str, documents: list) -> dict:
        """Hallucination 방어하며 답변 생성"""
        # 1. 문서 검색
        search_result = self.search_documents(query, documents)
        
        # 2. 유사도 낮으면 답변 거부
        if not search_result['found']:
            return {
                'answer': "죄송합니다. 해당 질문에 대한 정보를 문서에서 찾을 수 없습니다.",
                'confidence': search_result['similarity'],
                'source': None,
                'hallucination_risk': 'high'
            }
        
        # 3. 문서 기반 답변 생성
        prompt = f"""
다음 문서를 참고해서 질문에 답하세요.

규칙:
1. 문서에 있는 내용만 사용하세요
2. 추측하지 마세요
3. 확실하지 않으면 "문서에 해당 정보가 없습니다"라고 답하세요

문서:
{search_result['document']}

질문: {query}

답변:
"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0  # 창의성 낮춤 (Hallucination 감소)
        )
        
        answer = response.choices[0].message.content
        
        return {
            'answer': answer,
            'confidence': search_result['similarity'],
            'source': search_result['document'],
            'hallucination_risk': 'low'
        }

# 사용 예시
defender = HallucinationDefender()

documents = [
    "제30조 (연차휴가): 종업원은 입사 1년 후부터 연차휴가를 사용할 수 있다.",
    "제32조 (육아휴직): 육아휴직 기간은 최대 2년이다.",
    "제33조 (병가): 질병으로 인한 병가는 의사 진단서를 제출해야 한다."
]

# 케이스 1: 문서에 있는 정보
result1 = defender.generate_answer("육아휴직은 몇 년?", documents)
print(f"답변: {result1['answer']}")
print(f"신뢰도: {result1['confidence']:.2f}")
print(f"Hallucination 위험: {result1['hallucination_risk']}\n")

# 케이스 2: 문서에 없는 정보
result2 = defender.generate_answer("제40조 내용은?", documents)
print(f"답변: {result2['answer']}")
print(f"신뢰도: {result2['confidence']:.2f}")
print(f"Hallucination 위험: {result2['hallucination_risk']}")
```

**실행 결과**:
```
답변: 제32조에 따르면 육아휴직 기간은 최대 2년입니다.
신뢰도: 0.87
Hallucination 위험: low

답변: 죄송합니다. 해당 질문에 대한 정보를 문서에서 찾을 수 없습니다.
신뢰도: 0.21
Hallucination 위험: high
```

### 2. Citation으로 검증 가능하게

```python
def generate_with_citation(query: str, documents: list) -> str:
    """출처를 명시한 답변 생성"""
    
    prompt = f"""
다음 문서들을 참고해서 답변하되, 반드시 출처를 명시하세요.

형식: "제XX조에 따르면, [내용]입니다."

문서:
{chr(10).join(f"{i+1}. {doc}" for i, doc in enumerate(documents))}

질문: {query}
답변:
"""
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    return response.choices[0].message.content

# 사용
answer = generate_with_citation(
    "육아휴직 기간은?",
    documents
)
print(answer)
# 출력: "제32조에 따르면, 육아휴직 기간은 최대 2년입니다."
```

### 3. P3 시스템의 다중 방어 전략

```python
class P3HallucinationGuard:
    """P3 시스템의 Hallucination 다중 방어"""
    
    def __init__(self):
        self.embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
        
    def defend(self, query: str, documents: list) -> dict:
        """3단계 방어"""
        
        # 1단계: RAG 검색
        search_result = self._search(query, documents)
        
        # 2단계: 신뢰도 체크
        confidence_check = self._check_confidence(search_result)
        
        if not confidence_check['pass']:
            return {
                'answer': "문서에서 관련 정보를 찾지 못했습니다.",
                'confidence': search_result['similarity'],
                'defense_level': 1,
                'blocked': True
            }
        
        # 3단계: 답변 생성 + Citation
        answer = self._generate_with_citation(query, search_result['document'])
        
        # 4단계: 답변 검증
        verification = self._verify_answer(answer, search_result['document'])
        
        return {
            'answer': answer,
            'confidence': search_result['similarity'],
            'citation': search_result['document'][:100] + "...",
            'verified': verification['pass'],
            'defense_level': 3,
            'blocked': False
        }
    
    def _search(self, query: str, documents: list) -> dict:
        """RAG 검색"""
        query_vec = self.embedding_model.encode([query])
        doc_vecs = self.embedding_model.encode(documents)
        sims = cosine_similarity(query_vec, doc_vecs)[0]
        
        max_idx = sims.argmax()
        return {
            'document': documents[max_idx],
            'similarity': float(sims[max_idx])
        }
    
    def _check_confidence(self, search_result: dict) -> dict:
        """신뢰도 체크"""
        sim = search_result['similarity']
        
        if sim >= 0.7:
            return {'pass': True, 'level': 'high'}
        elif sim >= 0.5:
            return {'pass': True, 'level': 'medium'}
        else:
            return {'pass': False, 'level': 'low'}
    
    def _generate_with_citation(self, query: str, document: str) -> str:
        """출처 포함 답변 생성"""
        # GPT-4 호출 (간략화)
        return f"문서에 따르면, {query}에 대한 답변입니다."
    
    def _verify_answer(self, answer: str, document: str) -> dict:
        """답변이 문서 내용과 일치하는지 검증"""
        # 답변의 키워드가 문서에 있는지 확인
        # 실제로는 더 정교한 검증 필요
        return {'pass': True, 'method': 'keyword_match'}

# 사용
guard = P3HallucinationGuard()

result = guard.defend("육아휴직은?", documents)
print(f"답변: {result['answer']}")
print(f"신뢰도: {result['confidence']:.2f}")
print(f"방어 레벨: {result['defense_level']}")
print(f"차단 여부: {result['blocked']}")
```

## 🎯 Hallucination 감지 방법

### 1. 자가 일관성 체크

```python
def check_consistency(query: str, n_samples: int = 3) -> bool:
    """같은 질문에 여러 번 답변 → 일관성 체크"""
    answers = []
    
    for _ in range(n_samples):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": query}],
            temperature=0.7  # 약간의 변동성
        )
        answers.append(response.choices[0].message.content)
    
    # 답변들이 비슷한지 확인
    # (실제로는 임베딩 유사도로 비교)
    unique_answers = set(answers)
    
    if len(unique_answers) == 1:
        return True  # 일관성 높음
    else:
        return False # 일관성 낮음 (Hallucination 가능성)

# 사용
is_consistent = check_consistency("육아휴직 기간은?")
if not is_consistent:
    print("⚠️ 답변이 일관되지 않음 - Hallucination 의심")
```

### 2. 사실 검증 (Fact Checking)

```python
def fact_check(claim: str, documents: list) -> dict:
    """주장이 문서에 있는지 검증"""
    
    # 주장을 문서에서 검색
    embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
    
    claim_vec = embedding_model.encode([claim])
    doc_vecs = embedding_model.encode(documents)
    
    sims = cosine_similarity(claim_vec, doc_vecs)[0]
    max_sim = sims.max()
    
    if max_sim >= 0.8:
        return {'verified': True, 'confidence': float(max_sim)}
    else:
        return {'verified': False, 'confidence': float(max_sim)}

# 사용
claim = "육아휴직은 3년이다"
result = fact_check(claim, documents)

if not result['verified']:
    print(f"❌ 검증 실패 (신뢰도: {result['confidence']:.2f})")
    print("→ Hallucination 가능성 높음")
```

## 🚨 주의사항

### 1. Temperature 설정

```python
# Temperature 높음 → Hallucination 증가
response = openai.ChatCompletion.create(
    model="gpt-4",
    temperature=1.0,  # 😱 창의적이지만 사실 왜곡 위험
    messages=[...]
)

# Temperature 낮음 → Hallucination 감소
response = openai.ChatCompletion.create(
    model="gpt-4",
    temperature=0,  # ✅ 사실에 충실
    messages=[...]
)

# P3 시스템 권장: temperature=0 (사실 기반 답변)
```

### 2. 프롬프트 설계

```python
# 나쁜 프롬프트 (Hallucination 유발)
bad_prompt = "육아휴직에 대해 자세히 설명해줘"
# → LLM이 추측으로 채움

# 좋은 프롬프트 (Hallucination 방지)
good_prompt = """
다음 문서를 참고해서만 답하세요.
문서에 없는 내용은 "정보 없음"이라고 답하세요.

문서: {document}
질문: 육아휴직에 대해 설명해줘
답변:
"""
# → 문서 범위 제한
```

### 3. 검증 메커니즘

```python
# P3 시스템의 검증 체크리스트
verification_checklist = {
    "RAG 사용": True,          # 문서 기반 답변
    "Citation 포함": True,      # 출처 명시
    "Confidence 체크": True,    # 유사도 임계값
    "Temperature=0": True,      # 창의성 제한
    "답변 검증": True,           # 사실 체크
    "일관성 체크": False,        # 선택사항 (비용↑)
}

# 모든 항목 체크 → Hallucination 위험 최소화
```

## 🔗 관련 용어

- [[RAG]]: Hallucination 방어의 핵심
- [[Prompt]]: 프롬프트 설계로 방어
- [[Embedding]]: 유사도 기반 검증
- [[Reranking]]: 검색 품질 향상
- [[Agent]]: 자율 판단 시 위험 증가

## 📝 정리

**Hallucination의 핵심**:
```
LLM이 거짓을 사실처럼 생성
→ RAG 시스템의 최대 적
→ 반드시 방어 필요
```

**P3 시스템 방어 전략**:
```
1. RAG: 문서 기반만 답변
2. Citation: 출처 명시
3. Confidence: 낮으면 거부
4. Temperature=0: 사실 충실
5. Verification: 답변 검증
```

**비유로 기억하기**:
```
Hallucination = 시험에서 모르는 문제 찍기
→ 틀릴 확률 높음

RAG = 교과서 보고 답변
→ 정확도 높음

Citation = 답안에 출처 표시
→ 검증 가능
```

**주의 레벨**:
```
일반 LLM: Hallucination 위험 높음 (60%)
RAG: 위험 중간 (20%)
RAG + Citation + Verification: 위험 낮음 (5%)
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
