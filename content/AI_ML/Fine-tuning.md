# Fine-tuning (파인튜닝, 미세 조정)

## 📝 정의

Fine-tuning은 **사전 학습된 LLM을 특정 작업에 맞게 추가 학습**시키는 기법입니다. 모델을 처음부터 학습시키지 않고, 기존 모델의 지식을 활용해 효율적으로 맞춤화합니다.

### 핵심 개념

- **무엇인가?**: 기존 LLM + 특정 도메인 데이터로 재학습
- **왜 필요한가?**: 특정 업무나 스타일에 최적화하기 위해
- **어떻게 작동하나?**: Base Model + Custom Dataset → Fine-tuned Model

### Fine-tuning이 해결하는 문제

**Base Model의 한계**:
```
😱 시나리오 1: 도메인 지식 부족
질문: "제32조는?"
GPT-4: "일반적인 법률 용어로..." 😱
→ 우리 회사 취업규칙을 모름!

😱 시나리오 2: 톤앤매너 불일치
회사: 격식 있는 답변 필요
GPT-4: "그거요? 육아휴직은요..." 😱
→ 캐주얼한 톤!

😱 시나리오 3: 매번 프롬프트 필요
매 질문마다: "당신은 취업규칙 전문가입니다..."
→ 토큰 낭비! 비용 증가! 😱
```

**Fine-tuning의 해결**:
```
✅ 도메인 지식 내재화
질문: "제32조는?"
Fine-tuned Model: "제32조 육아휴직 규정입니다. 기간은 최대 2년이며..." ✅
→ 회사 규정을 모델이 학습함!

✅ 톤앤매너 일관성
Fine-tuned Model: "제32조에 따르면, 육아휴직 기간은..." ✅
→ 격식 있는 답변!

✅ 프롬프트 간소화
매번 긴 프롬프트 불필요
→ 토큰 절감! 비용 감소! ✅
```

## 📊 Fine-tuning vs 다른 방법


**비교표**:
```python
comparison = {
    "Prompt Engineering": {
        "비용": "$0 (추가 비용 없음)",
        "학습 시간": "즉시",
        "데이터 필요": "없음",
        "최신 정보": "프롬프트에 포함",
        "적합": "일반적인 작업, 빠른 프로토타입"
    },
    "RAG": {
        "비용": "$50~500/월 (Vector DB)",
        "학습 시간": "즉시",
        "데이터 필요": "문서 (임베딩)",
        "최신 정보": "즉시 반영",
        "적합": "자주 변경되는 정보, 문서 기반 Q&A"
    },
    "Fine-tuning": {
        "비용": "$100~10,000 (학습 비용)",
        "학습 시간": "수 시간~수일",
        "데이터 필요": "수백~수천 예시",
        "최신 정보": "재학습 필요",
        "적합": "고정된 도메인, 톤앤매너, 특화 작업"
    }
}
```

## 💡 Fine-tuning 구현

### 1. OpenAI Fine-tuning

```python
from openai import OpenAI
import json

client = OpenAI()

# 1. 학습 데이터 준비
training_data = [
    {
        "messages": [
            {"role": "system", "content": "당신은 P3 취업규칙 전문가입니다. 격식 있게 답변하세요."},
            {"role": "user", "content": "육아휴직은 몇 년?"},
            {"role": "assistant", "content": "제32조에 따르면, 육아휴직 기간은 최대 2년입니다."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "당신은 P3 취업규칙 전문가입니다. 격식 있게 답변하세요."},
            {"role": "user", "content": "연차는 며칠?"},
            {"role": "assistant", "content": "제30조에 따르면, 입사 1년 후부터 연차휴가 15일을 사용할 수 있습니다."}
        ]
    },
    # ... 최소 10개 이상, 권장 50~100개
]

# 2. 데이터 파일 저장
with open("p3_training.jsonl", "w", encoding="utf-8") as f:
    for item in training_data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

# 3. 파일 업로드
with open("p3_training.jsonl", "rb") as f:
    training_file = client.files.create(
        file=f,
        purpose="fine-tune"
    )

print(f"File ID: {training_file.id}")

# 4. Fine-tuning 작업 시작
fine_tune_job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model="gpt-3.5-turbo",  # 또는 gpt-4
    hyperparameters={
        "n_epochs": 3  # 학습 반복 횟수
    }
)

print(f"Job ID: {fine_tune_job.id}")

# 5. 진행 상황 확인
job = client.fine_tuning.jobs.retrieve(fine_tune_job.id)
print(f"Status: {job.status}")

# 6. 완료 후 모델 사용
# job.fine_tuned_model: "ft:gpt-3.5-turbo:org:custom_suffix:id"

# Fine-tuned 모델로 추론
response = client.chat.completions.create(
    model=job.fine_tuned_model,
    messages=[
        {"role": "user", "content": "병가는 어떻게 신청?"}
    ]
)

print(response.choices[0].message.content)
# 출력: "제31조에 따르면, 병가 신청 시 의사 진단서를 제출해야 합니다."
```

### 2. 학습 데이터 생성

```python
def generate_training_data(documents: list) -> list:
    """취업규칙 문서로부터 학습 데이터 생성"""
    
    training_data = []
    
    for doc in documents:
        # 문서에서 조항 추출
        import re
        section_match = re.search(r'제(\d+)조', doc)
        section_num = section_match.group(1) if section_match else "?"
        
        # 다양한 질문 패턴 생성
        questions = [
            f"제{section_num}조는?",
            f"{section_num}조 내용 알려줘",
            f"{section_num}조에 대해 설명해줘"
        ]
        
        for question in questions:
            training_data.append({
                "messages": [
                    {"role": "system", "content": "당신은 P3 취업규칙 전문가입니다."},
                    {"role": "user", "content": question},
                    {"role": "assistant", "content": doc}
                ]
            })
    
    return training_data

# 사용
documents = [
    "제30조 (연차휴가): 종업원은 입사 1년 후부터 연차휴가 15일을 사용할 수 있다.",
    "제32조 (육아휴직): 육아휴직 기간은 최대 2년이다.",
    # ... 더 많은 문서
]

training_data = generate_training_data(documents)
print(f"생성된 학습 데이터: {len(training_data)}개")
```

### 3. P3 시스템 Fine-tuning 파이프라인

```python
class P3FineTuningPipeline:
    """P3 취업규칙 Fine-tuning 파이프라인"""
    
    def __init__(self):
        self.client = OpenAI()
        
    def prepare_data(self, company_id: str) -> str:
        """회사별 학습 데이터 준비"""
        
        # 1. DB에서 취업규칙 가져오기
        regulations = self.fetch_regulations(company_id)
        
        # 2. 학습 데이터 생성
        training_data = []
        
        for reg in regulations:
            # 다양한 질문 형태
            questions = self.generate_questions(reg)
            
            for question in questions:
                training_data.append({
                    "messages": [
                        {
                            "role": "system",
                            "content": f"{company_id} 취업규칙 전문가입니다. 격식 있게 답변하세요."
                        },
                        {"role": "user", "content": question},
                        {"role": "assistant", "content": self.format_answer(reg)}
                    ]
                })
        
        # 3. 파일 저장
        filename = f"{company_id}_training.jsonl"
        with open(filename, "w", encoding="utf-8") as f:
            for item in training_data:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
        
        return filename
    
    def generate_questions(self, regulation: dict) -> list:
        """조항에 대한 다양한 질문 생성"""
        section = regulation['section']
        title = regulation['title']
        
        return [
            f"제{section}조는?",
            f"{title}에 대해 알려줘",
            f"{title} 규정은?",
            f"{title} 어떻게 해?",
            # LLM으로 더 다양한 질문 생성 가능
        ]
    
    def format_answer(self, regulation: dict) -> str:
        """표준화된 답변 형식"""
        return f"제{regulation['section']}조 ({regulation['title']})에 따르면, {regulation['content']}"
    
    def fine_tune(self, company_id: str) -> str:
        """Fine-tuning 실행"""
        
        # 1. 데이터 준비
        filename = self.prepare_data(company_id)
        
        # 2. 파일 업로드
        with open(filename, "rb") as f:
            training_file = self.client.files.create(file=f, purpose="fine-tune")
        
        # 3. Fine-tuning 시작
        job = self.client.fine_tuning.jobs.create(
            training_file=training_file.id,
            model="gpt-3.5-turbo",
            suffix=f"p3-{company_id}",
            hyperparameters={"n_epochs": 3}
        )
        
        print(f"Fine-tuning 시작: {job.id}")
        print(f"완료까지 약 30분~2시간 소요")
        
        # 4. DB에 저장
        self.save_job_info(company_id, job.id)
        
        return job.id
    
    def check_status(self, job_id: str) -> dict:
        """Fine-tuning 진행 상황"""
        job = self.client.fine_tuning.jobs.retrieve(job_id)
        
        return {
            'status': job.status,
            'trained_tokens': job.trained_tokens,
            'model': job.fine_tuned_model
        }

# 사용
pipeline = P3FineTuningPipeline()

# A회사 Fine-tuning
job_id = pipeline.fine_tune("A회사")

# 진행 상황 확인
status = pipeline.check_status(job_id)
print(f"상태: {status['status']}")

# 완료 후 사용
if status['status'] == 'succeeded':
    model_name = status['model']
    # P3 시스템에서 이 모델 사용
```

## 🎯 Fine-tuning 적합성 판단

### P3 시스템: RAG vs Fine-tuning

```python
p3_decision = {
    "RAG 선택": {
        "이유": [
            "취업규칙이 자주 변경됨",
            "회사별로 다른 규정",
            "최신 정보 즉시 반영 필요",
            "비용 효율적"
        ],
        "비용": "$100/월 (Vector DB)",
        "업데이트": "즉시"
    },
    "Fine-tuning 선택할 경우": {
        "조건": [
            "취업규칙이 거의 변경 안 됨",
            "톤앤매너가 매우 중요",
            "프롬프트 토큰 절약 필요",
            "응답 속도 최우선"
        ],
        "비용": "$500 초기 + $50/월",
        "업데이트": "재학습 필요 (비용 재발생)"
    },
    "P3 권장": "RAG",
    "이유": "취업규칙은 자주 변경되므로 RAG가 더 적합"
}
```

### Fine-tuning이 적합한 경우

```python
good_use_cases = {
    "코딩 어시스턴트": {
        "예시": "회사 코딩 스타일 학습",
        "데이터": "코드 리뷰 히스토리",
        "효과": "일관된 코드 스타일"
    },
    "고객 응대 챗봇": {
        "예시": "브랜드 톤앤매너",
        "데이터": "과거 고객 응대 로그",
        "효과": "브랜드 목소리 일관성"
    },
    "번역 시스템": {
        "예시": "법률/의료 전문 번역",
        "데이터": "전문 용어 번역 쌍",
        "효과": "전문 용어 정확도 향상"
    }
}
```

## 🚨 주의사항

### 1. 충분한 데이터 필요

```python
# 최소 데이터
minimum = {
    "OpenAI 권장": "10개 이상",
    "실용적": "50~100개",
    "고품질": "500~1000개"
}

# 데이터 부족 시
if len(training_data) < 50:
    print("⚠️ 데이터 부족 - 과적합 위험")
    print("→ Prompt Engineering 또는 RAG 고려")
```

### 2. 비용

```python
# OpenAI Fine-tuning 비용 (2024년 기준)
costs = {
    "GPT-3.5 Turbo": {
        "학습": "$0.008/1K tokens",
        "추론": "$0.012/1K tokens (Base: $0.0005)"
    },
    "GPT-4": {
        "학습": "아직 미지원",
        "추론": "N/A"
    }
}

# 예상 비용 계산
training_tokens = 100000  # 10만 토큰
training_cost = (training_tokens / 1000) * 0.008
print(f"학습 비용: ${training_cost:.2f}")  # $0.80

monthly_queries = 100000  # 월 10만 쿼리
monthly_cost = (monthly_queries / 1000) * 0.012
print(f"월 추론 비용: ${monthly_cost:.2f}")  # $1.20
```

### 3. 업데이트 어려움

```python
# 규정 변경 시
regulation_updated = True

if regulation_updated:
    # RAG: 즉시 반영
    vector_db.update(new_regulation)  # 1분
    
    # Fine-tuning: 재학습 필요
    pipeline.fine_tune("A회사")  # 1~2시간 + 비용
```

## 🔗 관련 용어

- [[LLM]]: Fine-tuning 대상
- [[Prompt]]: Fine-tuning 대안
- [[RAG]]: Fine-tuning 대안
- [[Few-shot]]: 학습 데이터 형식
- [[Token]]: Fine-tuning 비용 계산

## 📝 정리

**Fine-tuning의 핵심**:
```
Base Model + Custom Data
→ 특화된 모델
→ 도메인 지식 내재화
```

**P3 시스템 결론**:
```
Fine-tuning: X (규정 자주 변경)
RAG: O (유연하고 비용 효율적)

Fine-tuning 고려 조건:
- 규정이 거의 변경 안 됨
- 톤앤매너가 최우선
- 재학습 비용 감당 가능
```

**비유로 기억하기**:
```
Base Model = 일반 의사
Fine-tuning = 전문의 (추가 수련)
→ 특정 분야 전문가

RAG = 일반 의사 + 의학 도서관
→ 필요할 때 자료 참고
```

**의사결정 트리**:
```
정보가 자주 변경되나?
→ Yes: RAG
→ No: Fine-tuning 고려

톤앤매너가 최우선인가?
→ Yes: Fine-tuning 고려
→ No: RAG

학습 데이터 100개 이상 있나?
→ Yes: Fine-tuning 가능
→ No: Few-shot Prompting
```

---
*카테고리: AI_ML*
*생성일: 2026-02-15*
