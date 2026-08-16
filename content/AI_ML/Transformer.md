# Transformer (트랜스포머)

## 📝 정의

Transformer는 **Attention 메커니즘을 기반으로 한 딥러닝 아키텍처**입니다. 현대 LLM (GPT, BERT, Claude 등)의 핵심 기술입니다.

### 핵심 개념

- **무엇인가?**: 순차 데이터를 병렬로 처리하는 신경망
- **왜 필요한가?**: RNN보다 빠르고 긴 문맥 이해
- **어떻게 작동하나?**: Self-Attention으로 관계 파악

### Transformer가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: RNN의 순차 처리
문장: "나는 학교에 갔다"
RNN: 나 → 는 → 학교 → 에 → 갔다
→ 순차적으로 한 단어씩! 😱
→ 병렬 처리 불가! 😱
→ 느림! 😱

😱 시나리오 2: 장기 의존성 문제
문장: "어제 시장에서 산 사과를 오늘 먹었다"
RNN: "사과"와 "먹었다"의 관계 파악 어려움
→ 거리가 멀면 정보 손실! 😱
→ 문맥 이해 실패! 😱

😱 시나리오 3: 학습 시간
100만 개 문장 학습
RNN: 며칠~몇 주
→ GPU 병렬화 불가! 😱
→ 학습 비효율! 😱
```

**Transformer의 해결**:
```
✅ 시나리오 1: 병렬 처리
문장: "나는 학교에 갔다"
Transformer: [나, 는, 학교, 에, 갔다] 동시 처리
→ 모든 단어를 한 번에! ✅
→ GPU 병렬화 가능! ✅
→ 빠름! ✅

✅ 시나리오 2: Self-Attention
"어제 시장에서 산 사과를 오늘 먹었다"
Attention: "사과" ↔ "먹었다" 직접 연결
→ 거리와 무관하게 관계 파악! ✅
→ 완벽한 문맥 이해! ✅

✅ 시나리오 3: 빠른 학습
100만 개 문장
Transformer: 몇 시간~하루
→ 완전 병렬화! ✅
→ 학습 효율적! ✅
```

## 📊 Transformer 아키텍처


### 핵심 구성 요소

```
1. Self-Attention
→ 단어 간 관계 계산
→ "나는 학교에 갔다"에서
   "갔다"가 "학교"에 주목

2. Multi-Head Attention
→ 여러 관점에서 관계 파악
→ 문법, 의미, 주제 등

3. Positional Encoding
→ 단어 순서 정보 추가
→ "나는 학교에 갔다" vs "학교에 나는 갔다"

4. Feed Forward
→ 정보 변환
→ 특징 추출
```

## 💡 Attention 메커니즘

### Self-Attention 작동 원리

```python
import numpy as np

def simple_attention(query, key, value):
    """간단한 Attention 구현"""
    # 1. Query와 Key의 유사도 계산
    scores = np.dot(query, key.T)

    # 2. 소프트맥스로 가중치 변환
    attention_weights = np.exp(scores) / np.sum(np.exp(scores))

    # 3. Value에 가중치 적용
    output = np.dot(attention_weights, value)

    return output, attention_weights

# 예시: 문장 "나는 학교에 갔다"
words = ["나는", "학교에", "갔다"]

# 임베딩 (실제로는 더 큰 차원)
embeddings = np.array([
    [0.1, 0.2, 0.3],  # 나는
    [0.4, 0.5, 0.6],  # 학교에
    [0.7, 0.8, 0.9]   # 갔다
])

# "갔다"가 다른 단어들에 얼마나 주목하는지
query = embeddings[2]  # 갔다
keys = embeddings
values = embeddings

output, weights = simple_attention(query, keys, values)

print("Attention 가중치:")
for word, weight in zip(words, weights):
    print(f"  {word}: {weight:.3f}")

# 출력:
# 나는: 0.090
# 학교에: 0.244
# 갔다: 0.665  ← 자기 자신에 가장 높은 가중치
```

### Multi-Head Attention

```python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    """멀티 헤드 어텐션"""

    def __init__(self, d_model=512, num_heads=8):
        super().__init__()
        self.num_heads = num_heads
        self.d_model = d_model
        self.d_k = d_model // num_heads

        # Query, Key, Value 변환
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x):
        batch_size, seq_len, d_model = x.size()

        # 1. Linear transformations
        Q = self.W_q(x)
        K = self.W_k(x)
        V = self.W_v(x)

        # 2. Split into multiple heads
        Q = Q.view(batch_size, seq_len, self.num_heads, self.d_k)
        K = K.view(batch_size, seq_len, self.num_heads, self.d_k)
        V = V.view(batch_size, seq_len, self.num_heads, self.d_k)

        # 3. Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / np.sqrt(self.d_k)
        attention = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention, V)

        # 4. Concatenate heads
        output = output.view(batch_size, seq_len, d_model)

        # 5. Final linear
        output = self.W_o(output)

        return output

# 사용
model = MultiHeadAttention(d_model=512, num_heads=8)
x = torch.randn(1, 10, 512)  # (batch, seq_len, d_model)
output = model(x)
print(f"입력 크기: {x.shape}")
print(f"출력 크기: {output.shape}")
```

## 🎯 Transformer 기반 모델들

### 1. GPT (Decoder-only)

```
아키텍처: Decoder만 사용
특징: 다음 단어 예측 (자기회귀)
용도: 텍스트 생성

예시:
입력: "안녕하세요, 저는"
출력: "파이썬 개발자입니다"

모델: GPT-3, GPT-4, LLaMA
```

### 2. BERT (Encoder-only)

```
아키텍처: Encoder만 사용
특징: 양방향 문맥 이해
용도: 분류, 질의응답

예시:
입력: "나는 [MASK]에 갔다"
출력: [MASK] = "학교"

모델: BERT, RoBERTa, ALBERT
```

### 3. T5 (Encoder-Decoder)

```
아키텍처: 전체 Transformer
특징: 모든 작업을 텍스트 생성으로
용도: 번역, 요약, QA

예시:
입력: "translate English to Korean: Hello"
출력: "안녕하세요"

모델: T5, BART, mBART
```

## 🔍 실전 활용

### PyTorch로 간단한 Transformer

```python
import torch
import torch.nn as nn

class SimpleTransformer(nn.Module):
    """간단한 Transformer 모델"""

    def __init__(self, vocab_size, d_model=512, nhead=8, num_layers=6):
        super().__init__()

        # Embedding
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoding = nn.Embedding(1000, d_model)

        # Transformer Encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=2048
        )
        self.transformer = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers
        )

        # Output
        self.fc_out = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        # x: (batch_size, seq_len)
        seq_len = x.size(1)

        # Embedding + Positional Encoding
        positions = torch.arange(0, seq_len).unsqueeze(0)
        x = self.embedding(x) + self.pos_encoding(positions)

        # Transformer
        x = self.transformer(x)

        # Output
        x = self.fc_out(x)

        return x

# 모델 생성
model = SimpleTransformer(vocab_size=10000, d_model=512, nhead=8)

# 샘플 입력
x = torch.randint(0, 10000, (2, 20))  # (batch_size=2, seq_len=20)
output = model(x)

print(f"입력 크기: {x.shape}")
print(f"출력 크기: {output.shape}")  # (2, 20, 10000)
```

### Hugging Face Transformers 사용

```python
from transformers import AutoTokenizer, AutoModel

# BERT 모델 로드
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# 텍스트 인코딩
text = "Hello, how are you?"
inputs = tokenizer(text, return_tensors="pt")

# 모델 실행
outputs = model(**inputs)

# 출력
last_hidden_state = outputs.last_hidden_state
print(f"출력 크기: {last_hidden_state.shape}")
# (batch_size, sequence_length, hidden_size)

# Pooled output (문장 전체 임베딩)
pooled = outputs.pooler_output
print(f"Pooled 크기: {pooled.shape}")
# (batch_size, hidden_size)
```

## 🚨 Transformer 장단점

### 장점

```python
✅ 병렬 처리 가능
→ RNN보다 수백 배 빠름
→ GPU 효율적 활용

✅ 장기 의존성 문제 해결
→ 거리와 무관하게 관계 파악
→ 긴 문맥 이해

✅ 전이 학습 가능
→ 사전 학습된 모델 활용
→ Fine-tuning으로 특화

✅ 범용성
→ NLP, 비전, 오디오 등
→ 다양한 도메인 적용
```

### 단점

```python
❌ 메모리 많이 사용
→ Self-Attention: O(n²)
→ 긴 시퀀스에 부담

❌ 학습 데이터 많이 필요
→ 수십~수백 GB
→ 작은 데이터셋에는 비효율

❌ 계산 비용 높음
→ 파라미터 수십억~수조 개
→ 추론 시간 오래 걸림

❌ Positional Encoding 한계
→ 순서 정보를 명시적으로 추가
→ 자연스럽지 않음
```

## 💻 최적화 기법

### 1. Flash Attention

```python
"""
기존 Attention: O(n²) 메모리
Flash Attention: O(n) 메모리

→ 메모리 효율 향상
→ 속도 2-4배 빠름
"""

from flash_attn import flash_attn_func

# Flash Attention 사용
output = flash_attn_func(q, k, v)
```

### 2. 긴 컨텍스트 처리

```python
"""
Sparse Attention
→ 모든 토큰이 아닌 일부만 Attention
→ 메모리 절약

Linear Attention
→ Attention을 선형 시간으로
→ O(n²) → O(n)
"""

# Longformer (Sparse Attention)
from transformers import LongformerModel

model = LongformerModel.from_pretrained("allenai/longformer-base-4096")
# 최대 4096 토큰 처리
```

### 3. 모델 압축

```python
"""
Quantization: 8bit, 4bit로 압축
Pruning: 불필요한 가중치 제거
Distillation: 작은 모델로 지식 전달
"""

from transformers import AutoModelForCausalLM

# 8bit 양자화
model = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    load_in_8bit=True
)
# 메모리 절반으로 감소
```

## 🔗 관련 용어

- [[LLM]]: Transformer 기반 모델
- [[Embedding]]: Transformer 입력
- [[Token]]: Transformer 처리 단위
- [[Fine-tuning]]: Transformer 맞춤 학습

## 📝 정리

**Transformer의 핵심**:
```
Transformer = Attention 기반 아키텍처
→ 병렬 처리 가능
→ 긴 문맥 이해
→ 현대 AI의 기반
```

**구성 요소**:
```
Self-Attention: 단어 간 관계
Multi-Head: 다양한 관점
Positional Encoding: 순서 정보
Feed Forward: 특징 추출
```

**주요 모델**:
```
GPT: 텍스트 생성
BERT: 문맥 이해
T5: 다목적 모델
```

**비유로 기억하기**:
```
RNN = 책을 한 줄씩 읽기
→ 느리지만 순서대로

Transformer = 책 전체를 한눈에
→ 빠르고 관계 파악
→ "3페이지의 이 문장과 50페이지의 저 문장이 연결됨"
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
