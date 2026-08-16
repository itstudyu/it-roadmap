# Chunking (청킹, 문서 분할)

## 📝 정의

Chunking은 **긴 문서를 작은 조각으로 나누는 과정**입니다. RAG(Retrieval-Augmented Generation)에서 필수적인 전처리 단계입니다.

### 핵심 개념

- **무엇인가?**: 문서를 검색 가능한 작은 단위로 분할
- **왜 필요한가?**: LLM Context Window 제한, 검색 정확도 향상
- **어떻게 작동하나?**: 의미 단위, 고정 크기, 또는 슬라이딩 윈도우로 분할

### Chunking이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 전체 문서 한 번에 처리
취업규칙 (100페이지) → LLM에 전부 입력
→ Context Window 초과! 😱
→ 비용 폭증! 😱

😱 시나리오 2: 검색 정확도 낮음
질문: "육아휴직 기간은?"
문서: 전체 취업규칙 (100페이지)
→ 관련 없는 내용도 함께 검색됨! 😱
→ 정확한 답변 어려움! 😱
```

**Chunking의 해결**:
```
✅ 시나리오 1: 효율적 처리
취업규칙 (100페이지)
→ 조항별로 청킹 (각 1-2페이지)
→ 필요한 조각만 LLM에 전달
→ 비용 절감 + 속도 향상! ✅

✅ 시나리오 2: 검색 정확도 향상
질문: "육아휴직 기간은?"
→ 제32조 (육아휴직 조항)만 검색
→ 정확한 답변! ✅
```

## 💡 Chunking 구현

### 1. 고정 크기 Chunking

```python
def fixed_size_chunking(text: str, chunk_size: int = 500, overlap: int = 50):
    """고정 크기로 문서 분할"""
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap  # 겹침 적용

    return chunks

# 사용
text = "긴 문서 내용..." * 100
chunks = fixed_size_chunking(text, chunk_size=500, overlap=50)
print(f"총 {len(chunks)}개 청크 생성")
# 총 20개 청크 생성
```

### 2. 의미 단위 Chunking

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def semantic_chunking(text: str):
    """의미 단위로 문서 분할"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
    )

    chunks = text_splitter.split_text(text)
    return chunks

# 사용
text = """
제30조 (연차휴가)
종업원은 입사 1년 후부터 연차휴가를 사용할 수 있다.

제31조 (병가)
종업원은 질병으로 인해 근무가 곤란한 경우 병가를 신청할 수 있다.

제32조 (육아휴직)
종업원은 1세 미만의 자녀를 양육하기 위해 육아휴직을 신청할 수 있다.
"""

chunks = semantic_chunking(text)
for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}:\n{chunk}\n")
```

### 3. 조항별 Chunking (문서 구조 활용)

```python
import re

def section_chunking(text: str):
    """조항별로 문서 분할"""
    # 제XX조 패턴으로 분할
    pattern = r'(제\d+조[^제]+)'
    chunks = re.findall(pattern, text)

    # 메타데이터와 함께 반환
    result = []
    for chunk in chunks:
        section_num = re.search(r'제(\d+)조', chunk).group(1)
        result.append({
            "section": section_num,
            "content": chunk.strip(),
            "metadata": {
                "type": "regulation",
                "section_number": int(section_num)
            }
        })

    return result

# 사용
chunks = section_chunking(text)
for chunk in chunks:
    print(f"제{chunk['section']}조: {chunk['content'][:50]}...")
```

## 🔍 실전 활용

### P3 시스템에서의 Chunking

```python
class P3DocumentChunker:
    """P3 취업규칙 문서 청킹"""

    def __init__(self, chunk_size=1000, overlap=200):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_regulation(self, document: str, company_id: str):
        """취업규칙을 조항별로 청킹"""
        chunks = []

        # 조항별 분할
        sections = re.findall(r'(제\d+조[^제]+)', document)

        for section in sections:
            # 조항 번호 추출
            section_num = re.search(r'제(\d+)조', section)

            # 제목 추출
            title_match = re.search(r'제\d+조 \(([^)]+)\)', section)
            title = title_match.group(1) if title_match else "제목 없음"

            chunks.append({
                "content": section.strip(),
                "metadata": {
                    "company_id": company_id,
                    "section": section_num.group(1),
                    "title": title,
                    "doc_type": "regulation"
                }
            })

        return chunks

    def chunk_with_embedding(self, chunks):
        """청크를 임베딩과 함께 저장"""
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer('all-MiniLM-L6-v2')

        for chunk in chunks:
            # 임베딩 생성
            vector = model.encode(chunk['content'])
            chunk['vector'] = vector.tolist()

        return chunks

# 사용
chunker = P3DocumentChunker()
document = "제30조 (연차휴가)..."
chunks = chunker.chunk_regulation(document, company_id="A회사")
chunks = chunker.chunk_with_embedding(chunks)

# Vector DB에 저장
# vector_db.insert(chunks)
```

### Chunking 품질 평가

```python
def evaluate_chunks(chunks, original_text):
    """청킹 품질 평가"""
    # 1. 평균 청크 크기
    avg_size = sum(len(c) for c in chunks) / len(chunks)

    # 2. 청크 크기 분산 (균일성)
    sizes = [len(c) for c in chunks]
    variance = sum((s - avg_size)**2 for s in sizes) / len(sizes)

    # 3. 정보 손실 확인
    combined = ''.join(chunks)
    loss_rate = 1 - (len(combined) / len(original_text))

    return {
        "avg_chunk_size": avg_size,
        "variance": variance,
        "chunks_count": len(chunks),
        "info_loss_rate": loss_rate * 100
    }

# 평가
metrics = evaluate_chunks(chunks, text)
print(f"평균 청크 크기: {metrics['avg_chunk_size']:.0f}자")
print(f"총 청크 개수: {metrics['chunks_count']}개")
print(f"정보 손실률: {metrics['info_loss_rate']:.2f}%")
```

## 🚨 Chunking 주의사항

### 1. 청크 크기 선택

```python
# 너무 작으면
chunk_size = 100  # 😱
→ 문맥 부족
→ 검색 정확도 ↓
→ 청크 개수 ↑ (관리 어려움)

# 너무 크면
chunk_size = 5000  # 😱
→ 불필요한 정보 포함
→ LLM 비용 ↑
→ 처리 속도 ↓

# 적정 크기
chunk_size = 500-1500  # ✅
→ 문맥 충분
→ 비용 효율적
```

### 2. Overlap 설정

```python
# Overlap 없음
overlap = 0  # 😱
→ 경계에 걸친 정보 손실

# Overlap 너무 많음
overlap = 400 (chunk_size 500)  # 😱
→ 중복 저장
→ 저장 공간 낭비

# 적정 Overlap
overlap = 50-200  # ✅
→ 정보 손실 최소화
→ 효율적 저장
```

### 3. 언어별 고려사항

```python
# 한국어: 어절 단위 조심
text = "육아휴직기간은"
→ 단어 경계 고려 필요

# 영어: 단어 경계 쉬움
text = "parental leave period"
→ 공백으로 분리

# 해결: 언어별 Tokenizer 사용
from konlpy.tag import Okt
okt = Okt()
words = okt.morphs(text)
```

## 🔗 관련 용어

- [[Embedding]]: 청크를 벡터로 변환
- [[RAG]]: 청킹의 활용처
- [[Vector DB]]: 청크 저장소
- [[Semantic Search]]: 청크 검색

## 📝 정리

**Chunking의 핵심**:
```
긴 문서 → 작은 조각
→ 검색 가능
→ 효율적 처리
```

**주요 전략**:
```
1. 고정 크기: 균등 분할
2. 의미 단위: 문단/섹션
3. 슬라이딩: 겹치게 분할
```

**최적 설정 (일반적)**:
```
Chunk Size: 500-1500자
Overlap: 50-200자
Strategy: 의미 단위 + Overlap
```

**비유로 기억하기**:
```
책 전체 = 원본 문서
→ 너무 커서 한 번에 못 읽음

각 장/절 = 청크
→ 필요한 부분만 읽기 가능
→ 빠르게 찾기 가능
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
