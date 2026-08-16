# AWS Bedrock

## 📝 정의

AWS Bedrock은 **아마존이 제공하는 관리형 AI 모델 서비스**입니다. Claude, Llama 등 다양한 LLM을 API로 간편하게 사용할 수 있습니다.

### 핵심 개념

- **무엇인가?**: AWS에서 제공하는 LLM 서비스
- **왜 필요한가?**: LLM 직접 운영은 복잡하고 비쌈
- **어떻게 작동하나?**: API 호출 → Bedrock → LLM 응답

### Bedrock이 해결하는 문제

**문제 상황**:
```
😱 시나리오: LLM 직접 운영
GPU 서버 구매 (수천만원)
→ 모델 다운로드 및 설치
→ 스케일링 관리
→ 비용과 시간 낭비! 😱
```

**Bedrock의 해결**:
```
✅ 관리형 서비스:
API 호출만으로 LLM 사용
→ 인프라 관리 불필요
→ 즉시 시작 가능! ✅
```

## 💡 Bedrock 사용 예시

```python
import boto3

# Bedrock 클라이언트 생성
bedrock = boto3.client('bedrock-runtime')

# Claude 모델 호출
response = bedrock.invoke_model(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    body={
        "messages": [{"role": "user", "content": "안녕하세요"}],
        "max_tokens": 1000
    }
)

print(response['content'][0]['text'])
```

## 📊 Bedrock vs OpenAI

| 항목 | Bedrock | OpenAI |
|------|---------|--------|
| **제공사** | AWS | OpenAI |
| **모델** | Claude, Llama 등 | GPT-4, GPT-3.5 |
| **장점** | AWS 통합 | 최신 모델 |
| **보안** | VPC 내부 가능 | 인터넷 통신 |

## 🔗 관련 용어

- [[LLM 1]]: Bedrock이 제공하는 모델
- [[AWS]]: Bedrock의 플랫폼
- [[Claude]]: Bedrock의 주요 모델

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
