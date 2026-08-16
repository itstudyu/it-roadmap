# Vector DB (벡터 데이터베이스)

## 📝 정의

Vector DB(벡터 데이터베이스)는 **벡터(숫자 배열)로 데이터를 저장하고 유사도 검색을 수행하는 데이터베이스**입니다. AI 임베딩을 저장하여 "의미적으로 비슷한" 데이터를 빠르게 찾는 데 사용됩니다.

### 핵심 개념

- **무엇인가?**: 텍스트/이미지를 숫자 배열(벡터)로 변환하여 저장하는 DB
- **왜 필요한가?**: 전통 DB는 정확히 일치하는 것만 찾음, Vector DB는 "비슷한 것" 찾음
- **어떻게 작동하나?**: 데이터 → AI로 벡터 변환 → 저장 → 유사도 검색

### Vector DB가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 의미 검색 불가능
MySQL에서 "파이썬 배우기" 검색
→ "Python 학습"은 못 찾음 (단어가 다름)
→ 같은 의미인데 검색 실패! 😱

😱 시나리오 2: 이미지 검색
"고양이 사진" 검색하고 싶음
→ 전통 DB: 파일명에 "cat" 있어야만 찾음
→ 이미지 내용 기반 검색 불가! 😱

😱 시나리오 3: 챗봇 답변 찾기
사용자: "비밀번호를 까먹었어요"
→ DB에는 "비밀번호 분실 시" FAQ만 있음
→ 정확히 일치하는 것만 찾아서 실패! 😱
```

**Vector DB의 해결**:
```
✅ 시나리오 1 (의미 검색):
"파이썬 배우기" → Vector로 변환
→ "Python 학습", "파이썬 튜토리얼" 모두 찾음
→ 의미가 비슷하면 검색! ✅

✅ 시나리오 2 (이미지 검색):
이미지 → Vector로 변환
→ 비슷한 이미지 자동 검색
→ 내용 기반 검색 가능! ✅

✅ 시나리오 3 (유사 질문):
"비밀번호를 까먹었어요" → Vector
→ "비밀번호 분실 시" FAQ와 유사도 높음
→ 적절한 답변 찾기! ✅
```

**비유**:
- **전통 DB** = 사전 (정확한 철자로만 찾기)
- **Vector DB** = 구글 검색 (비슷한 의미도 찾기)

## 💡 벡터와 임베딩

### 벡터란?

```python
# 텍스트를 벡터로 변환
text = "파이썬 배우기"

# AI 모델로 변환 (OpenAI 예시)
vector = embedding_model.encode(text)

# 결과: 1536차원 벡터
print(vector)
# [0.023, -0.015, 0.041, 0.087, ..., -0.019]
# 총 1536개의 숫자
```

**벡터의 특징**:
```
비슷한 의미 → 비슷한 벡터

"파이썬 배우기": [0.2, 0.8, 0.1, ...]
"Python 학습":  [0.3, 0.7, 0.2, ...]  # 비슷함!

"고양이":       [-0.5, 0.3, 0.9, ...]
"Python 학습":  [0.3, 0.7, 0.2, ...]  # 다름!
```

### 유사도 계산

```python
import numpy as np

def cosine_similarity(vec1, vec2):
    """코사인 유사도 계산"""
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    return dot_product / (norm1 * norm2)

# 예시
query = [0.2, 0.8, 0.1]
doc1 = [0.3, 0.7, 0.2]  # 비슷함
doc2 = [-0.5, 0.3, 0.9]  # 다름

print(f"유사도 1: {cosine_similarity(query, doc1)}")  # 0.98 (매우 유사)
print(f"유사도 2: {cosine_similarity(query, doc2)}")  # 0.35 (다름)
```

## 🎯 Vector DB 사용 예시

### 1. 의미 검색 (Semantic Search)

```python
from chromadb import Client

# Chroma DB 초기화
client = Client()
collection = client.create_collection("documents")

# 문서 추가
documents = [
    "파이썬은 배우기 쉬운 프로그래밍 언어입니다",
    "Python은 데이터 과학에 많이 사용됩니다",
    "고양이는 귀여운 동물입니다"
]

collection.add(
    documents=documents,
    ids=["doc1", "doc2", "doc3"]
)

# 검색
results = collection.query(
    query_texts=["프로그래밍 배우기"],
    n_results=2
)

print(results['documents'])
# [
#   "파이썬은 배우기 쉬운 프로그래밍 언어입니다",
#   "Python은 데이터 과학에 많이 사용됩니다"
# ]
# → "고양이"는 관련 없어서 제외!
```

### 2. RAG 시스템 구축

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 긴 문서를 청크로 분할
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
chunks = text_splitter.split_text(long_document)

# Vector DB에 저장
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(chunks, embeddings)

# 질문과 관련된 문서 찾기
def answer_question(question):
    # 유사한 청크 찾기
    relevant_docs = vectorstore.similarity_search(question, k=3)

    # LLM에게 전달
    context = "\n".join([doc.page_content for doc in relevant_docs])
    answer = llm(f"Context: {context}\n\nQuestion: {question}")

    return answer

# 사용
answer = answer_question("RAG가 뭐에요?")
print(answer)
```

### 3. 이미지 검색

```python
from PIL import Image
import clip
import torch

# CLIP 모델 (이미지 → 벡터)
model, preprocess = clip.load("ViT-B/32")

# 이미지 벡터화
def image_to_vector(image_path):
    image = preprocess(Image.open(image_path)).unsqueeze(0)
    with torch.no_grad():
        vector = model.encode_image(image)
    return vector.numpy()

# 이미지 100장을 Vector DB에 저장
for img_path in image_paths:
    vector = image_to_vector(img_path)
    vectordb.add(vector, metadata={"path": img_path})

# 텍스트로 이미지 검색
query = "고양이 사진"
query_vector = model.encode_text(clip.tokenize([query]))
similar_images = vectordb.search(query_vector, k=5)

print(f"'{query}'와 유사한 이미지 5장:")
for img in similar_images:
    print(img['metadata']['path'])
```

## 📊 주요 Vector DB 비교

| DB | 특징 | 사용 사례 |
|---|------|----------|
| **Pinecone** | 클라우드, 관리형 | 프로덕션, 스케일 중요 |
| **Chroma** | 오픈소스, 간단 | 프로토타입, 로컬 개발 |
| **Weaviate** | 오픈소스, 기능 풍부 | 복잡한 쿼리 필요 |
| **Milvus** | 오픈소스, 고성능 | 대용량 데이터 |
| **Qdrant** | Rust, 빠름 | 실시간 검색 |
| **FAISS** | 페이스북, 라이브러리 | 연구, 실험 |

**선택 가이드**:
```
빠른 프로토타입 → Chroma
프로덕션 (관리 맡기고 싶음) → Pinecone
프로덕션 (직접 관리) → Weaviate, Milvus
최고 성능 → Qdrant
연구/실험 → FAISS
```

## 🔧 Vector DB 최적화

### 1. 인덱싱 방법

```python
# HNSW (Hierarchical Navigable Small World)
# → 빠르지만 메모리 많이 사용

# IVF (Inverted File)
# → 메모리 적게 사용, 약간 느림

collection.create_index(
    index_type="HNSW",
    metric_type="COSINE",
    params={"M": 16, "efConstruction": 200}
)
```

### 2. 메타데이터 필터링

```python
# 벡터 검색 + 필터
results = collection.query(
    query_texts=["Python 튜토리얼"],
    n_results=5,
    where={"category": "programming"}  # 프로그래밍 카테고리만
)
```

### 3. 하이브리드 검색

```python
# 벡터 검색 + 키워드 검색 조합
def hybrid_search(query, filters=None):
    # 1. 벡터 검색 (의미 검색)
    vector_results = vectordb.search(query, k=20)

    # 2. 키워드 검색 (정확도)
    keyword_results = traditional_db.search(query)

    # 3. 결과 합치기 (Re-ranking)
    combined = merge_and_rerank(vector_results, keyword_results)

    return combined[:10]
```

## 🔗 관련 용어

- [[RAG 1]]: Vector DB의 주요 사용 사례
- [[Embedding]]: 벡터 변환 기술
- [[LLM 1]]: Vector DB와 함께 사용
- [[Semantic Search]]: 의미 기반 검색

## 📚 참고자료

- [Pinecone](https://www.pinecone.io/)
- [Chroma](https://www.trychroma.com/)
- [Weaviate](https://weaviate.io/)
- [Vector DB 비교](https://superlinked.com/vector-db-comparison/)

---
*카테고리: 데이터베이스*
*생성일: 2026-02-14*
