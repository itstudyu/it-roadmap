# RAG (Retrieval-Augmented Generation)

## 📝 정의

RAG(Retrieval-Augmented Generation, 검색 증강 생성)는 AI가 답변할 때 **실제 문서를 먼저 찾아보고** 그 내용을 바탕으로 답변을 생성하는 기술입니다.

### 핵심 개념

- **무엇인가?**: AI의 기억력을 외부 자료로 보완하는 기술
- **왜 필요한가?**: AI가 지어낸 정보가 아닌, 실제 문서 기반 정확한 답변을 위해
- **언제 사용하나?**: 회사 문서 검색, 고객 지원, 전문 분야 Q&A 시스템

### RAG가 해결하는 문제

**일반 LLM의 한계**:

```
😱 문제 1: 환각 (Hallucination)
질문: "우리 회사 육아휴직 기간은?"
일반 AI: "보통 1년입니다" (← 지어낸 답변!)
→ 실제 회사 규정은 2년일 수도 있음

😱 문제 2: 지식 한계
질문: "2026년 2월 신제품 가격은?"
일반 AI: "모르겠습니다" (← 학습 데이터에 없음)
→ 최신 정보를 알 수 없음

😱 문제 3: 도메인 특화 불가
질문: "내부 보안 규정 3.2조는?"
일반 AI: "모르겠습니다" (← 회사 내부 문서를 모름)
→ 특정 조직의 문서는 접근 불가
```

**RAG의 해결**:

```
✅ 같은 상황:
질문: "우리 회사 육아휴직 기간은?"

[1단계: 검색]
→ 회사 취업규칙 문서에서 "육아휴직" 검색
→ "제32조: 육아휴직은 최대 2년..." 발견

[2단계: 답변]
→ 찾은 내용을 바탕으로 답변 생성
AI: "취업규칙 제32조에 따르면, 육아휴직은 최대 2년입니다"
→ 실제 문서 기반, 정확한 답변!
```

**비유**:
- **일반 LLM** = 혼자 기억에 의존하는 학생 (가끔 착각)
- **RAG** = 시험 중에 교과서를 참고할 수 있는 학생 (정확)

또는

- **일반 LLM** = 모든 것을 외우려는 사람
- **RAG** = 필요할 때 도서관에서 찾아보는 사람 (효율적)

## 📊 RAG 작동 원리

RAG는 **2단계 프로세스**로 작동합니다:

### 전체 구조

```도해
층: RAG, 어떻게 나뉘어 있나
사전 준비 (한 번만) :: 문서 수집] --> D2[문서 분할
실시간 처리 (질문마다) :: 사용자 질문] --> E[질문 임베딩
```

### 1단계: 검색 (Retrieval)

**목적**: 질문과 관련 있는 문서를 찾기

```
사용자 질문: "육아휴직 기간은?"
↓
1. 질문을 숫자 배열(벡터)로 변환
   "육아휴직 기간" → [0.23, 0.87, 0.12, ...]
↓
2. 벡터 DB에서 유사한 문서 검색
   (벡터 공간에서 가까운 것 = 의미가 비슷한 것)
↓
3. Top 3~5개 관련 문서 추출
   - 취업규칙 제32조 (관련도: 95%)
   - 인사 FAQ 문서 (관련도: 87%)
   - ...
```

**왜 벡터로 변환?**
- 컴퓨터는 의미를 직접 이해 못함
- 숫자로 바꿔야 "비슷한지" 계산 가능
- 같은 의미는 비슷한 숫자 배열을 가짐

### 2단계: 생성 (Generation)

**목적**: 찾은 문서를 바탕으로 답변 작성

```
[검색 결과]
문서 1: "제32조 육아휴직: 1세 미만 자녀를 둔 종업원은
        최대 2년의 육아휴직을 신청할 수 있다..."

문서 2: "육아휴직 신청은 1개월 전에..."
↓
[LLM에게 전달]
"다음 문서를 참고하여 질문에 답하세요:

<문서>
제32조 육아휴직: 1세 미만 자녀를 둔 종업원은...
</문서>

질문: 육아휴직 기간은?"
↓
[LLM 답변]
"취업규칙 제32조에 따르면, 1세 미만 자녀를 둔 종업원은
최대 2년의 육아휴직을 신청할 수 있습니다."
```

## 🔄 동작 시퀀스

실제로 RAG 시스템에 질문했을 때 일어나는 일:

```도해
흐름: RAG, 무슨 순서로 오가나
사용자 :: 육아휴직 기간은?
RAG 시스템 :: 질문을 벡터로 변환
RAG 시스템 :: 유사 문서 검색
벡터 DB :: Top 3 문서 반환 (취업규칙, FAQ 등)
RAG 시스템 :: 프롬프트 구성 (질문 + 찾은 문서)
RAG 시스템 :: 컨텍스트 + 질문
LLM :: 제32조에 따르면...
RAG 시스템 :: 답변 + 출처
```

### 각 단계 상세 설명

1. **질문 접수**:
   - 사용자가 자연어로 질문
   - "육아휴직 기간은 며칠이야?"

2. **질문 임베딩**:
   - 질문을 숫자 벡터로 변환
   - 의미를 수학적으로 표현

3. **유사도 검색**:
   - 벡터 공간에서 가장 가까운 문서 찾기
   - 코사인 유사도 등으로 계산
   - "거리가 가까움 = 의미가 비슷함"

4. **문서 추출**:
   - 유사도 Top K개 선택 (보통 3~5개)
   - 관련도 순으로 정렬

5. **컨텍스트 구성**:
   - 찾은 문서를 LLM에게 전달할 형식으로 정리
   - "이 문서들을 참고해서 답변하세요"

6. **답변 생성**:
   - LLM이 문서 내용을 바탕으로 답변 작성
   - 지어내지 않고, 문서에 있는 내용만 사용

## 💡 실제 예시

### 기본 RAG 구현

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader

# === 사전 준비 (한 번만) ===

# 1. 문서 로드
loader = TextLoader("company_rules.txt")
documents = loader.load()
# documents = [
#   "제32조 육아휴직: 최대 2년...",
#   "제33조 연차휴가: 연 20일..."
# ]

# 2. 임베딩 생성 및 벡터 DB에 저장
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(
    documents=documents,
    embedding=embeddings
)
# 내부적으로:
# - 각 문서를 벡터로 변환
# - 벡터 DB에 저장

# === 실시간 질문 처리 ===

# 3. RAG 체인 구성
llm = OpenAI(temperature=0)  # 정확성 위해 temperature=0
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # 문서를 전부 컨텍스트에 넣기
    retriever=vectordb.as_retriever(
        search_kwargs={"k": 3}  # Top 3 문서
    )
)

# 4. 질문하기
question = "육아휴직 기간은?"
answer = qa_chain.run(question)
print(answer)
# → "제32조에 따르면, 육아휴직은 최대 2년입니다"
```

**각 부분 설명**:

1. **TextLoader**: 텍스트 파일을 읽어서 문서 리스트로 변환
2. **OpenAIEmbeddings**: 텍스트를 벡터로 변환하는 모델
3. **Chroma**: 벡터 DB (다른 대안: FAISS, Pinecone 등)
4. **RetrievalQA**: 검색 + 답변 생성을 자동화하는 체인
5. **k=3**: 상위 3개 문서만 사용

### RAG 내부 동작 확인

```python
# 검색 단계만 확인
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

question = "육아휴직 기간은?"
docs = retriever.get_relevant_documents(question)

print("=== 검색된 문서 ===")
for i, doc in enumerate(docs, 1):
    print(f"\n[문서 {i}]")
    print(doc.page_content)
    print(f"관련도: {doc.metadata.get('score', 'N/A')}")

# 출력:
# [문서 1]
# 제32조 육아휴직: 1세 미만 자녀를 둔 종업원은
# 최대 2년의 육아휴직을 신청할 수 있다...
# 관련도: 0.95
#
# [문서 2]
# FAQ: 육아휴직 신청은 1개월 전에...
# 관련도: 0.87
```

**이제 LLM에게 전달되는 프롬프트**:

```
다음 문서를 참고하여 질문에 답하세요:

문서 1:
제32조 육아휴직: 1세 미만 자녀를 둔 종업원은...

문서 2:
FAQ: 육아휴직 신청은 1개월 전에...

질문: 육아휴직 기간은?

답변:
```

### 고급 RAG 패턴

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. 문서를 적절한 크기로 분할 (Chunking)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # 각 조각 크기
    chunk_overlap=50     # 조각 간 겹침 (문맥 유지)
)
chunks = text_splitter.split_documents(documents)
# 왜? 문서가 너무 길면 LLM이 처리 못함
#     적당한 크기로 나눔

# 2. 더 정교한 검색 (MMR: Maximum Marginal Relevance)
retriever = vectordb.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 5,              # 최종 5개 반환
        "fetch_k": 20,       # 후보 20개 먼저 찾기
        "lambda_mult": 0.5   # 유사도 vs 다양성 균형
    }
)
# MMR: 비슷한 내용만 반복하지 않고
#      다양한 관점의 문서를 섞어서 가져옴

# 3. 출처 표시
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True  # 출처 문서도 반환
)

result = qa_chain({"query": "육아휴직 기간은?"})
print(f"답변: {result['result']}")
print(f"\n출처:")
for doc in result['source_documents']:
    print(f"- {doc.metadata.get('source', '알 수 없음')}")
```

## 🎯 RAG vs Fine-tuning vs 일반 LLM

| 특성 | 일반 LLM | RAG | Fine-tuning |
|------|---------|-----|-------------|
| **지식 출처** | 학습 데이터 | 외부 문서 | 재학습 데이터 |
| **최신 정보** | ❌ 불가능 | ✅ 실시간 | ❌ 재학습 필요 |
| **정확도** | ⚠️ 환각 가능 | ✅ 문서 기반 | ✅ 높음 |
| **비용** | 낮음 | 중간 | 높음 |
| **업데이트** | 불가 | 즉시 | 재학습 필요 |
| **도메인 특화** | ❌ 어려움 | ✅ 쉬움 | ✅ 가능 |

### 언제 무엇을 사용할까?

✅ **RAG 사용**:
- 자주 업데이트되는 정보 (뉴스, 제품 정보)
- 회사 내부 문서 검색
- 고객 지원 시스템
- 법률/의료 등 정확성 중요한 분야

✅ **Fine-tuning 사용**:
- 특정 스타일/톤 학습
- 도메인 특화 언어 (의학 용어 등)
- RAG로 부족한 경우

✅ **RAG + Fine-tuning 결합**:
- Fine-tuning으로 도메인 언어 학습
- RAG로 최신 지식 보완
- 최고의 성능

## ⚠️ RAG 한계와 해결

### 1. 검색 실패

**문제**: 관련 문서를 못 찾으면 답변 불가

```python
# 해결: 하이브리드 검색
# - 벡터 검색 (의미적 유사도)
# - 키워드 검색 (정확한 단어 매칭)
# 두 가지를 결합
```

### 2. 문서가 너무 많음

**문제**: 수백만 개 문서에서 검색 → 느림

```python
# 해결: 계층적 검색
# 1. 먼저 카테고리 선택 (인사/재무/기술)
# 2. 해당 카테고리 내에서만 검색
```

### 3. 문서 품질

**문제**: 잘못된 정보가 문서에 있으면 잘못 답변

```python
# 해결:
# - 문서 검증 프로세스
# - 정기적 문서 업데이트
# - 여러 문서 교차 확인
```

## 🔗 관련 용어

- [[LLM 1]]: RAG가 사용하는 기반 모델
- [[Vector DB]]: RAG의 문서 저장소
- [[임베딩]]: 텍스트를 벡터로 변환
- [[AI Agent]]: RAG를 활용하는 상위 시스템
- [[Semantic Search]]: RAG의 검색 기술

## 📚 참고자료

- [RAG Paper (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) - 원본 논문
- [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
