# LLM (Large Language Model)

## 📝 정의

LLM(Large Language Model, 대규모 언어 모델)은 방대한 텍스트 데이터로 학습된 AI로, **인간의 언어를 이해하고 생성**할 수 있습니다. ChatGPT, Claude, GPT-4가 대표적인 LLM입니다.

### 핵심 개념

- **무엇인가?**: 수십억~수조 개의 파라미터로 학습된 언어 AI
- **왜 필요한가?**: 다양한 언어 작업을 하나의 모델로 처리하기 위해
- **어떻게 작동하나?**: 다음에 올 단어를 확률적으로 예측

### LLM이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 작업별로 다른 AI 필요
과거: 번역 AI + 요약 AI + 코딩 AI + 질문답변 AI...
→ 각 작업마다 별도 모델 학습 필요
→ 관리 복잡, 비용 증가! 😱

😱 시나리오 2: 문맥 이해 부족
기존 AI: "사과"라는 단어
→ 과일? 사과문?
→ 문맥을 보지 못함! 😱

😱 시나리오 3: 새 작업 학습의 어려움
기존 AI: 새로운 작업할 때마다
→ 대량의 학습 데이터 필요
→ 몇 달씩 재학습! 😱
```

**LLM의 해결**:
```
✅ 시나리오 1:
하나의 LLM으로 모든 작업
→ 번역 + 요약 + 코딩 + QA 모두 가능
→ 범용 AI! ✅

✅ 시나리오 2:
문맥 이해 (Attention 메커니즘)
"나는 사과를 먹었다" → 과일
"그에게 사과를 했다" → 사과문
→ 문맥에 맞는 해석! ✅

✅ 시나리오 3:
Few-shot Learning
예시 2~3개만 보여주면
→ 새로운 작업 즉시 수행
→ 빠른 적응! ✅
```

**비유**:
- **기존 AI** = 전문가 (번역 전문가, 요약 전문가...)
- **LLM** = 만능 비서 (모든 일을 할 수 있는 사람)

## 📊 작동 원리

LLM은 **"다음에 올 단어"를 예측**하면서 텍스트를 생성합니다.


### 각 단계 설명

**1. 토큰화 (Tokenization)**:
- 텍스트를 작은 단위로 분해
- "날씨가 어떻" → ["날씨", "가", "어떻"]

**2. 임베딩 (Embedding)**:
- 각 단어를 숫자 벡터로 변환
- "날씨" → [0.2, -0.5, 0.8, ...]
- 의미가 비슷한 단어는 가까운 벡터

**3. Transformer 처리**:
- 문맥을 파악하여 의미 이해
- "어떻" 다음에는 "니?" 또는 "게"가 올 확률 높음

**4. 예측 및 생성**:
- 가장 적절한 다음 단어 선택
- 반복하여 전체 문장 생성

## 🔄 LLM의 핵심 기술: Attention


**Attention 메커니즘**:
- 문장의 각 단어가 다른 단어들과의 관계를 파악
- "사과" + "들고" = 과일
- "사과" + "그녀에게" = 사과문
- 이를 통해 문맥 이해

## 💡 실제 사용 예시

### Python으로 LLM 사용하기

```python
import anthropic

# Claude API 초기화
client = anthropic.Anthropic(api_key="your-api-key")

# LLM에게 질문
message = client.messages.create(
    model="claude-3-5-sonnet-20250929",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "RAG 기술을 초보자도 이해할 수 있게 설명해줘"
        }
    ]
)

print(message.content[0].text)
```

**이 코드의 의미**:
1. Claude API에 연결
2. 모델 선택 (Claude 3.5 Sonnet)
3. 최대 응답 길이 설정 (1024 토큰)
4. 질문 전달
5. 답변 받기

### Temperature 조절

LLM은 **Temperature** 파라미터로 답변의 창의성을 조절합니다.

```python
# Temperature = 0: 항상 같은 답변 (결정론적)
response_strict = client.messages.create(
    model="claude-3-5-sonnet-20250929",
    max_tokens=100,
    temperature=0,  # 창의성 최소
    messages=[{"role": "user", "content": "1+1은?"}]
)
# → 항상 "2입니다"

# Temperature = 1.0: 균형잡힌 답변
response_balanced = client.messages.create(
    model="claude-3-5-sonnet-20250929",
    max_tokens=500,
    temperature=1.0,  # 균형
    messages=[{"role": "user", "content": "창의적인 이야기 만들어줘"}]
)
# → 다양하고 자연스러운 이야기

# Temperature = 2.0: 매우 창의적
response_creative = client.messages.create(
    model="claude-3-5-sonnet-20250929",
    max_tokens=500,
    temperature=2.0,  # 창의성 최대
    messages=[{"role": "user", "content": "미래 도시 상상해봐"}]
)
# → 예측 불가능하고 독특한 답변
```

**비유**:
- **Temperature 0** = 교과서 답변 (정확하지만 단조로움)
- **Temperature 1** = 일반 대화 (자연스러움)
- **Temperature 2** = 예술가의 상상 (독창적이지만 산만할 수 있음)

## ⚠️ LLM의 한계

### 1. 환각 (Hallucination)

**문제**: LLM이 그럴듯하지만 **거짓 정보**를 생성

```
사용자: "2024년 노벨 물리학상 수상자는?"

LLM (환각):
"김철수 박사입니다. 그는 양자 컴퓨팅 연구로..."
→ 완전히 지어낸 답변! 하지만 그럴듯함

이유:
- LLM은 "그럴듯한" 답을 생성하도록 학습됨
- 사실 검증 능력이 없음
```

**해결책**: [[RAG 1]] 사용
- 실제 문서를 먼저 검색
- 검색된 내용을 바탕으로 답변
- 출처 명시

### 2. 지식 한계 (Knowledge Cutoff)

**문제**: 학습 데이터 이후의 정보를 **모름**

```
GPT-4 학습 데이터: 2023년 4월까지
Claude 3 학습 데이터: 2025년 중반까지

사용자: "오늘 날씨는?"
LLM: "죄송하지만 실시간 정보는 모릅니다"

사용자: "2026년 올림픽 개최지는?"
LLM: (2025년 이전 학습) "아직 결정되지 않았습니다"
→ 2026년에는 이미 결정되었을 수도!
```

**해결책**:
- 웹 검색 연동
- RAG로 최신 문서 참조
- 실시간 API 연결

### 3. 컨텍스트 윈도우 제한

**문제**: 한 번에 처리할 수 있는 **텍스트 길이 제한**

```
모델별 제한:
- GPT-4: 8K ~ 128K 토큰
- Claude 3: 200K 토큰
- Gemini 1.5: 1M 토큰

1 토큰 ≈ 0.75 단어 (영어 기준)
       ≈ 0.4 단어 (한국어 기준)

문제 시나리오:
사용자: "이 500페이지 계약서를 요약해줘"
LLM: "너무 길어서 한 번에 처리할 수 없습니다"
```

**해결책**:
- 문서를 작은 청크로 분할
- 각 청크 요약 후 통합
- 긴 컨텍스트 모델 사용 (Claude, Gemini)

## 🔧 주요 LLM 모델

| 모델 | 제공사 | 특징 |
|------|--------|------|
| **GPT-4** | OpenAI | 강력한 추론, 다국어 |
| **Claude 3.5** | Anthropic | 긴 컨텍스트, 안전성 |
| **Gemini 1.5** | Google | 멀티모달, 초장문 |
| **Llama 3** | Meta | 오픈소스, 커스터마이징 |

## 🔗 관련 용어

- [[AI Agent]]: LLM을 두뇌로 사용하는 자율 시스템
- [[RAG 1]]: LLM의 환각 문제를 해결하는 기술
- [[MCP]]: LLM이 외부 도구와 연결하는 프로토콜
- [[Prompt Engineering]]: LLM을 효과적으로 사용하는 방법

## 📚 참고자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Attention Is All You Need (Transformer 논문)](https://arxiv.org/abs/1706.03762)

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
