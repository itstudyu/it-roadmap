# Context Window (컨텍스트 윈도우)

## 📝 정의

Context Window는 **LLM이 한 번에 처리할 수 있는 텍스트 길이**입니다. 토큰 단위로 측정됩니다.

### 핵심 개념

- **무엇인가?**: LLM의 입력+출력 최대 길이
- **왜 중요한가?**: 비용, 속도, 대화 길이 결정
- **단위**: 토큰 (Token)

## 💡 모델별 Context Window

| 모델 | Context Window | 대략 분량 |
|------|----------------|----------|
| GPT-4 Turbo | 128K 토큰 | 책 1권 (300페이지) |
| Claude 3.5 Sonnet | 200K 토큰 | 책 1.5권 |
| Gemini 1.5 Pro | 1M 토큰 | 책 7-8권 |
| GPT-3.5 | 4K 토큰 | 짧은 글 3-4페이지 |

## 🚨 제한 사항

```python
# Context Window 초과 시
long_text = "..." * 100000  # 매우 긴 텍스트
response = llm.generate(long_text)
# Error: Context length exceeded!

# 해결 1: 요약
summary = summarize(long_text)
response = llm.generate(summary)

# 해결 2: 청킹 + RAG
chunks = chunk(long_text)
relevant = search(chunks, question)
response = llm.generate(relevant)
```

## 📝 정리

**Context Window = LLM 메모리 크기**
- 작으면: 긴 대화/문서 처리 불가
- 크면: 비용↑, 속도↓
- RAG로 필요한 부분만 넣어 절약

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
