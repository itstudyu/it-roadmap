# GTM (Go-to-Market, 시장 진입 전략)

## 📝 정의

GTM은 **제품을 시장에 출시하고 고객에게 전달하기 위한 전략적 계획**입니다. 누구에게, 어떻게, 무엇을 팔 것인지 정의합니다.

### 핵심 개념

- **무엇인가?**: 제품 출시 및 판매 전략
- **왜 필요한가?**: 성공적인 시장 진입
- **구성**: 타겟, 포지셔닝, 채널, 가격

### GTM이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 준비 없는 출시
제품 완성! → 바로 런칭!
→ 아무도 모름 😱
→ 판매 없음 😱

😱 시나리오 2: 타겟 불명확
"모든 사람을 위한 제품!"
→ 누구한테 팔지? 😱
→ 마케팅 메시지 산만

😱 시나리오 3: 채널 미스매치
B2B 제품인데
→ Instagram 광고 집행
→ 예산 낭비! 😱
```

**GTM의 해결**:
```
✅ 시나리오 1: 계획적 출시
출시 3개월 전부터:
- 베타 테스터 모집
- 콘텐츠 제작
- 파트너십 구축
→ 런칭날 대기 고객 1000명! ✅

✅ 시나리오 2: 명확한 타겟
"25-35세 스타트업 개발자"
→ 구체적 메시지
→ 효율적 마케팅! ✅

✅ 시나리오 3: 적합한 채널
B2B SaaS
→ LinkedIn, 웨비나, 영업팀
→ ROI 5배! ✅
```

## 💡 GTM 전략 수립 프로세스

### 1. 타겟 시장 정의

```python
"""
누구에게 팔 것인가?
"""

target_market = {
    "TAM (Total Addressable Market)": {
        "정의": "전체 시장 크기",
        "예시": "전 세계 모든 기업 = 3억 개",
        "용도": "시장 기회 파악"
    },

    "SAM (Serviceable Addressable Market)": {
        "정의": "도달 가능한 시장",
        "예시": "한국 기업 중 IT 기업 = 10만 개",
        "용도": "현실적 목표 시장"
    },

    "SOM (Serviceable Obtainable Market)": {
        "정의": "실제 목표 시장",
        "예시": "서울 스타트업 = 5천 개",
        "용도": "초기 집중 타겟"
    }
}

def calculate_market_size():
    """시장 크기 계산"""

    # Bottom-up 방식
    target_customers = 5000       # 서울 스타트업
    conversion_rate = 0.05        # 5% 전환
    arpu = 100000                 # 월 10만원

    som_customers = target_customers * conversion_rate
    annual_revenue = som_customers * arpu * 12

    return {
        'target': target_customers,
        'expected_customers': int(som_customers),
        'annual_revenue': f"{annual_revenue:,}원"
    }

result = calculate_market_size()
print(f"목표 시장: {result['target']:,}개")
print(f"예상 고객: {result['expected_customers']:,}개")
print(f"예상 매출: {result['annual_revenue']}")

# 출력:
# 목표 시장: 5,000개
# 예상 고객: 250개
# 예상 매출: 300,000,000원
```

### 2. 가치 제안 (Value Proposition)

```python
"""
왜 우리 제품을 사야 하나?
"""

value_proposition_template = {
    "고객 Pain Point": "반복 작업으로 시간 낭비",

    "우리 솔루션": "AI 자동화 도구",

    "핵심 가치": [
        "시간 80% 절감",
        "에러 0%",
        "클릭 3번으로 완료"
    ],

    "경쟁 우위": {
        "vs 수동 작업": "10배 빠름",
        "vs 경쟁사 A": "가격 50% 저렴",
        "vs 경쟁사 B": "설정 5분 vs 3일"
    },

    "메시지": """
    For [스타트업 개발자]
    Who [반복 작업으로 시간 낭비]
    Our product [AI 자동화 도구]
    That provides [시간 80% 절감]
    Unlike [수동 작업 or 경쟁사]
    """
}
```

### 3. 채널 전략

```python
"""
어떻게 고객에게 도달할 것인가?
"""

channel_strategy = {
    "B2B SaaS": {
        "인지": ["LinkedIn 광고", "기술 블로그", "웨비나"],
        "고려": ["무료 체험", "데모 요청", "케이스 스터디"],
        "전환": ["영업팀 미팅", "POC", "계약"],
        "확장": ["고객 성공 팀", "업셀", "추천"]
    },

    "B2C 앱": {
        "인지": ["앱스토어 ASO", "소셜 미디어", "인플루언서"],
        "고려": ["앱 스토어 리뷰", "무료 버전 제공"],
        "전환": ["In-app 구매", "프리미엄 업그레이드"],
        "확장": ["푸시 알림", "추천 프로그램", "이벤트"]
    },

    "Marketplace": {
        "공급자": ["직접 영업", "파트너십", "인센티브"],
        "수요자": ["SEO", "광고", "프로모션"],
        "양쪽": ["네트워크 효과", "리뷰/평점"]
    }
}

def select_channels(budget, target):
    """예산과 타겟에 맞는 채널 선택"""

    if budget < 5000000:  # 500만원 미만
        return [
            "콘텐츠 마케팅 (무료)",
            "SEO",
            "소셜 미디어 유기적 성장",
            "추천 프로그램"
        ]
    elif budget < 50000000:  # 5천만원 미만
        return [
            "Google Ads (타겟팅)",
            "LinkedIn (B2B)",
            "콘텐츠 + SEO",
            "인플루언서 마이크로"
        ]
    else:  # 5천만원 이상
        return [
            "TV/라디오 광고",
            "대형 인플루언서",
            "전시회/컨퍼런스",
            "PR/언론",
            "다채널 캠페인"
        ]
```

### 4. 가격 전략

```python
"""
얼마에 팔 것인가?
"""

pricing_strategies = {
    "Cost-Plus": {
        "공식": "원가 + 마진",
        "예시": "원가 10,000원 + 50% = 15,000원",
        "장점": "간단, 이익 보장",
        "단점": "가치 무시"
    },

    "Value-Based": {
        "공식": "고객 가치 기준",
        "예시": "시간 절감 가치 100만원 → 50만원 가격",
        "장점": "최대 수익",
        "단점": "측정 어려움"
    },

    "Competition-Based": {
        "공식": "경쟁사 기준",
        "예시": "경쟁사 10만원 → 우리 9만원",
        "장점": "시장 적응",
        "단점": "가격 경쟁"
    },

    "Freemium": {
        "구조": "기본 무료 + 프리미엄 유료",
        "예시": "Spotify, Dropbox",
        "장점": "빠른 확산",
        "단점": "전환율 낮음"
    },

    "Tiered": {
        "구조": "Basic/Pro/Enterprise",
        "예시": "월 1만원/5만원/협의",
        "장점": "다양한 고객층",
        "단점": "복잡도"
    }
}

def calculate_pricing(cost, value, competition):
    """최적 가격 계산"""

    # 최소: 원가 + 30%
    floor_price = cost * 1.3

    # 최대: 고객 가치의 50%
    ceiling_price = value * 0.5

    # 시장 가격 고려
    market_price = competition * 0.9  # 10% 저렴

    # 최종 가격: 범위 내에서 시장 가격
    final_price = max(floor_price, min(ceiling_price, market_price))

    return {
        'floor': f"{floor_price:,}원",
        'ceiling': f"{ceiling_price:,}원",
        'market': f"{market_price:,}원",
        'recommended': f"{final_price:,}원"
    }

result = calculate_pricing(
    cost=50000,        # 원가 5만원
    value=500000,      # 고객 가치 50만원
    competition=100000 # 경쟁사 10만원
)

print("가격 분석:")
for key, value in result.items():
    print(f"  {key}: {value}")
```

## 🎯 GTM 실행 계획

### 런칭 타임라인

```python
"""
출시 전후 12주 계획
"""

gtm_timeline = {
    "Week -12 ~ -9": {
        "단계": "준비",
        "활동": [
            "베타 테스터 모집 (50-100명)",
            "콘텐츠 제작 (블로그 10개)",
            "랜딩 페이지 제작",
            "가격 확정"
        ]
    },

    "Week -8 ~ -5": {
        "단계": "예열",
        "활동": [
            "베타 테스트 진행",
            "피드백 수집 및 개선",
            "대기자 명단 구축",
            "PR 준비 (보도자료)"
        ]
    },

    "Week -4 ~ -1": {
        "단계": "발사 준비",
        "활동": [
            "Product Hunt 준비",
            "인플루언서 연락",
            "런칭 이벤트 기획",
            "고객 지원 준비"
        ]
    },

    "Week 0": {
        "단계": "런칭!",
        "활동": [
            "Product Hunt 런칭",
            "SNS 동시 발표",
            "이메일 발송 (대기자)",
            "PR 배포"
        ]
    },

    "Week 1 ~ 4": {
        "단계": "가속",
        "활동": [
            "피드백 빠른 반영",
            "콘텐츠 지속 발행",
            "유료 광고 시작",
            "케이스 스터디 제작"
        ]
    },

    "Week 5+": {
        "단계": "최적화",
        "활동": [
            "채널 최적화",
            "Funnel 개선",
            "확장 준비"
        ]
    }
}

# 체크리스트 생성
for week, plan in gtm_timeline.items():
    print(f"\n{week}: {plan['단계']}")
    for activity in plan['활동']:
        print(f"  ☐ {activity}")
```

## 🔍 GTM 유형

### 1. Product-Led Growth

```python
"""
제품 자체가 성장 엔진
"""

plg_strategy = {
    "특징": [
        "무료 체험/프리미엄",
        "셀프 서비스",
        "바이럴 루프 내장"
    ],

    "예시": ["Slack", "Zoom", "Dropbox"],

    "장점": [
        "낮은 CAC",
        "빠른 확산",
        "제품 중심"
    ],

    "단점": [
        "초기 수익 낮음",
        "제품 품질 필수"
    ],

    "적합": "B2B SaaS, 협업 도구"
}
```

### 2. Sales-Led Growth

```python
"""
영업팀 중심 성장
"""

slg_strategy = {
    "특징": [
        "영업팀 직접 판매",
        "맞춤 솔루션",
        "장기 계약"
    ],

    "예시": ["Salesforce", "Oracle", "SAP"],

    "장점": [
        "큰 계약 금액",
        "맞춤화 가능",
        "관계 구축"
    ],

    "단점": [
        "높은 CAC",
        "느린 성장",
        "확장성 낮음"
    ],

    "적합": "Enterprise B2B"
}
```

### 3. Marketing-Led Growth

```python
"""
마케팅 중심 성장
"""

mlg_strategy = {
    "특징": [
        "콘텐츠 마케팅",
        "브랜드 구축",
        "인바운드"
    ],

    "예시": ["HubSpot", "Mailchimp"],

    "장점": [
        "브랜드 인지도",
        "교육 효과",
        "장기 자산"
    ],

    "단점": [
        "시간 소요",
        "측정 어려움"
    ],

    "적합": "B2B 마케팅 도구"
}
```

## 🚨 GTM 실수

### ❌ 피해야 할 것

```python
gtm_mistakes = {
    "1. 타겟 없이 출시": {
        "실수": "모든 사람에게!",
        "결과": "아무도 안 삼",
        "해결": "좁은 타겟부터 시작"
    },

    "2. 너무 늦게 시작": {
        "실수": "제품 완성 후 마케팅",
        "결과": "런칭날 아무도 모름",
        "해결": "3개월 전부터 준비"
    },

    "3. 채널 분산": {
        "실수": "모든 채널 동시 공략",
        "결과": "예산 분산, 효과 없음",
        "해결": "1-2개 채널 집중"
    },

    "4. 가격 실험 없음": {
        "실수": "처음 정한 가격 고수",
        "결과": "최적화 기회 상실",
        "해결": "A/B 테스트"
    },

    "5. 피드백 무시": {
        "실수": "계획대로만 진행",
        "결과": "시장 반응 놓침",
        "해결": "빠른 피봇"
    }
}
```

## 🔗 관련 용어

- [[MVP]]: GTM으로 MVP 출시
- [[PMF]]: GTM 전에 PMF 먼저
- [[Persona]]: GTM의 타겟 정의
- [[Funnel]]: GTM의 전환 과정
- [[North Star Metric]]: GTM 성공 측정

## 📝 정리

**GTM의 핵심**:
```
GTM = 시장 진입 전략
→ 누구에게? (타겟)
→ 무엇을? (가치)
→ 어떻게? (채널)
→ 얼마에? (가격)
```

**핵심 질문**:
```
1. 타겟 시장은? (TAM/SAM/SOM)
2. 고객 Pain Point는?
3. 우리 가치 제안은?
4. 도달 채널은?
5. 가격은?
6. 영업 방법은?
```

**GTM 유형**:
```
Product-Led: 제품으로 성장
Sales-Led: 영업으로 성장
Marketing-Led: 마케팅으로 성장
```

**타임라인**:
```
-12주: 준비 시작
-8주: 베타 테스트
-4주: 런칭 준비
Week 0: 런칭!
+4주: 가속
+8주: 최적화
```

**비유로 기억하기**:
```
GTM = 전쟁 작전 계획
→ 어디를 공격? (타겟)
→ 무슨 무기? (제품)
→ 어떤 경로? (채널)
→ 언제? (타이밍)

"좋은 제품 + 나쁜 GTM = 실패"
"보통 제품 + 좋은 GTM = 성공 가능"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
