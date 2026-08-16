# CAC / LTV

## 📝 정의

**CAC (Customer Acquisition Cost)**는 고객 한 명을 획득하는 데 드는 비용이고, **LTV (Lifetime Value)**는 고객 한 명이 생애 동안 가져다주는 수익입니다. 비즈니스 건전성의 핵심 지표입니다.

### 핵심 개념

- **CAC**: 마케팅 비용 / 신규 고객 수
- **LTV**: 고객당 평균 수익 × 유지 기간
- **황금 비율**: LTV / CAC > 3

### CAC/LTV가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 적자 구조
고객 획득 비용: 50,000원
고객 평생 수익: 30,000원
→ 고객 늘수록 적자! 😱

😱 시나리오 2: 지속 불가능
월 마케팅 비용: 1억
월 매출: 5천만원
→ 돈만 날림! 😱

😱 시나리오 3: 성장의 착각
신규 고객: 계속 증가
이익: 계속 감소
→ 성장하는데 망함! 😱
```

**CAC/LTV의 해결**:
```
✅ 시나리오 1: 수익성 확인
CAC: 50,000원
LTV: 200,000원
LTV/CAC = 4배 ✅
→ 건강한 비즈니스!

✅ 시나리오 2: 투자 판단
LTV/CAC = 3배 이상
→ 마케팅에 더 투자 가능! ✅

✅ 시나리오 3: 진짜 성장
고객 증가 + LTV > CAC
→ 지속 가능한 성장! ✅
```

## 📊 CAC 계산

```python
def calculate_cac(marketing_spend, sales_spend, new_customers, period="월"):
    """
    CAC 계산

    marketing_spend: 마케팅 비용
    sales_spend: 영업 비용
    new_customers: 신규 고객 수
    """

    total_acquisition_cost = marketing_spend + sales_spend
    cac = total_acquisition_cost / new_customers

    return {
        'total_spend': total_acquisition_cost,
        'new_customers': new_customers,
        'cac': cac,
        'cac_formatted': f"{cac:,.0f}원"
    }

# 예시
result = calculate_cac(
    marketing_spend=10_000_000,  # 광고비 1천만원
    sales_spend=5_000_000,       # 영업비 5백만원
    new_customers=500             # 500명 획득
)

print(f"총 비용: {result['total_spend']:,}원")
print(f"신규 고객: {result['new_customers']}명")
print(f"CAC: {result['cac_formatted']}")

# 출력:
# 총 비용: 15,000,000원
# 신규 고객: 500명
# CAC: 30,000원
```

## 💡 LTV 계산

```python
def calculate_ltv_simple(
    average_purchase_value,
    purchase_frequency,
    customer_lifespan
):
    """
    간단한 LTV 계산

    average_purchase_value: 평균 구매 금액
    purchase_frequency: 연간 구매 횟수
    customer_lifespan: 고객 유지 기간 (년)
    """

    ltv = (
        average_purchase_value *
        purchase_frequency *
        customer_lifespan
    )

    return ltv

# 예시 1: E-commerce
ecommerce_ltv = calculate_ltv_simple(
    average_purchase_value=50_000,  # 평균 5만원
    purchase_frequency=4,            # 연 4회 구매
    customer_lifespan=3              # 3년 유지
)

print(f"E-commerce LTV: {ecommerce_ltv:,}원")
# LTV: 600,000원

# 예시 2: SaaS
saas_ltv = calculate_ltv_simple(
    average_purchase_value=10_000,   # 월 1만원
    purchase_frequency=12,           # 월 구독
    customer_lifespan=2              # 2년 유지
)

print(f"SaaS LTV: {saas_ltv:,}원")
# LTV: 240,000원
```

### LTV 고급 계산

```python
def calculate_ltv_advanced(
    monthly_revenue,
    gross_margin,
    churn_rate
):
    """
    고급 LTV 계산 (SaaS)

    monthly_revenue: 월 평균 수익 (ARPU)
    gross_margin: 총 이익률 (%)
    churn_rate: 월 이탈률 (%)
    """

    # LTV = ARPU × Gross Margin / Churn Rate
    ltv = (
        monthly_revenue *
        (gross_margin / 100) /
        (churn_rate / 100)
    )

    # 평균 고객 수명
    customer_lifespan_months = 1 / (churn_rate / 100)

    return {
        'ltv': ltv,
        'ltv_formatted': f"{ltv:,.0f}원",
        'avg_lifespan': f"{customer_lifespan_months:.1f}개월"
    }

# 예시
result = calculate_ltv_advanced(
    monthly_revenue=10_000,   # 월 1만원
    gross_margin=80,          # 80% 이익률
    churn_rate=5              # 월 5% 이탈
)

print(f"LTV: {result['ltv_formatted']}")
print(f"평균 고객 수명: {result['avg_lifespan']}")

# 출력:
# LTV: 160,000원
# 평균 고객 수명: 20.0개월
```

## 🎯 LTV/CAC 비율 분석

```python
def analyze_ltv_cac_ratio(ltv, cac):
    """
    LTV/CAC 비율 분석 및 평가
    """

    ratio = ltv / cac

    if ratio >= 3:
        status = "✅ 매우 건강"
        recommendation = "공격적 성장 가능"
        color = "green"
    elif ratio >= 1:
        status = "🟡 보통"
        recommendation = "효율 개선 필요"
        color = "yellow"
    else:
        status = "🚨 위험"
        recommendation = "즉시 개선 필요 (적자)"
        color = "red"

    payback_period = cac / (ltv / 12)  # 월 기준

    return {
        'ratio': ratio,
        'status': status,
        'recommendation': recommendation,
        'payback_months': f"{payback_period:.1f}개월"
    }

# 예시 1: 건강한 비즈니스
healthy = analyze_ltv_cac_ratio(
    ltv=240_000,
    cac=60_000
)

print("건강한 비즈니스:")
print(f"  LTV/CAC: {healthy['ratio']:.1f}배")
print(f"  상태: {healthy['status']}")
print(f"  권장: {healthy['recommendation']}")
print(f"  회수 기간: {healthy['payback_months']}")

# 예시 2: 위험한 비즈니스
risky = analyze_ltv_cac_ratio(
    ltv=50_000,
    cac=80_000
)

print("\n위험한 비즈니스:")
print(f"  LTV/CAC: {risky['ratio']:.1f}배")
print(f"  상태: {risky['status']}")
```

## 🔍 CAC/LTV 최적화

### 1. CAC 낮추기

```python
cac_reduction_strategies = {
    "1. 유기적 성장": {
        "방법": [
            "SEO 최적화",
            "콘텐츠 마케팅",
            "바이럴 루프",
            "추천 프로그램"
        ],
        "효과": "CAC 50-80% 감소",
        "예시": "Dropbox 추천 = 무료 저장공간"
    },

    "2. 전환율 최적화": {
        "방법": [
            "랜딩 페이지 A/B 테스트",
            "Funnel 최적화",
            "CTA 개선"
        ],
        "효과": "같은 비용에 고객 2배",
        "예시": "전환율 2% → 4% = CAC 절반"
    },

    "3. 타겟 정교화": {
        "방법": [
            "Persona 기반 타겟팅",
            "Lookalike Audience",
            "리타겟팅"
        ],
        "효과": "광고 효율 향상",
        "예시": "페르소나 맞춤 광고"
    },

    "4. 채널 최적화": {
        "방법": [
            "ROI 낮은 채널 중단",
            "ROI 높은 채널 집중",
            "채널 믹스 최적화"
        ],
        "효과": "전체 CAC 개선",
        "예시": "Google Ads CAC 1만원, Facebook CAC 5만원 → Google 집중"
    }
}

def calculate_cac_improvement(before_cac, strategy_impact):
    """CAC 개선 효과 계산"""

    after_cac = before_cac * (1 - strategy_impact)
    savings = before_cac - after_cac
    improvement = (savings / before_cac) * 100

    return {
        'before': f"{before_cac:,}원",
        'after': f"{after_cac:,}원",
        'savings': f"{savings:,}원",
        'improvement': f"{improvement:.0f}%"
    }

# 예시: 유기적 성장으로 CAC 50% 감소
result = calculate_cac_improvement(
    before_cac=50_000,
    strategy_impact=0.5  # 50% 감소
)

print("CAC 개선 효과:")
for key, value in result.items():
    print(f"  {key}: {value}")
```

### 2. LTV 높이기

```python
ltv_improvement_strategies = {
    "1. Retention 향상": {
        "방법": [
            "제품 개선",
            "고객 성공 팀",
            "온보딩 최적화"
        ],
        "효과": "이탈률 감소 = LTV 증가",
        "예시": "Churn 5% → 3% = LTV 67% 증가"
    },

    "2. ARPU 증가": {
        "방법": [
            "업셀/크로스셀",
            "프리미엄 기능",
            "가격 최적화"
        ],
        "효과": "고객당 수익 증가",
        "예시": "월 1만원 → 1.5만원 = LTV 50% 증가"
    },

    "3. 구매 빈도 증가": {
        "방법": [
            "구독 모델",
            "자동 재구매",
            "리마인더"
        ],
        "효과": "거래 횟수 증가",
        "예시": "연 2회 → 4회 = LTV 2배"
    }
}

def ltv_vs_churn_impact():
    """이탈률이 LTV에 미치는 영향"""

    base_ltv = calculate_ltv_advanced(
        monthly_revenue=10_000,
        gross_margin=80,
        churn_rate=5  # 5% 이탈
    )

    improved_ltv = calculate_ltv_advanced(
        monthly_revenue=10_000,
        gross_margin=80,
        churn_rate=3  # 3% 이탈 (40% 개선)
    )

    impact = (
        (improved_ltv['ltv'] - base_ltv['ltv']) /
        base_ltv['ltv']
    ) * 100

    print(f"이탈률 5% → 3% 개선 효과:")
    print(f"  Before LTV: {base_ltv['ltv_formatted']}")
    print(f"  After LTV: {improved_ltv['ltv_formatted']}")
    print(f"  LTV 증가: +{impact:.0f}%")

ltv_vs_churn_impact()
```

## 🚨 산업별 벤치마크

```python
ltv_cac_benchmarks = {
    "SaaS B2B": {
        "LTV/CAC": "3-5배",
        "Payback": "12개월 이내",
        "CAC": "고객 연 매출의 1/3 이하"
    },

    "E-commerce": {
        "LTV/CAC": "3배+",
        "Payback": "6-12개월",
        "CAC": "첫 구매 금액의 30% 이하"
    },

    "Consumer App": {
        "LTV/CAC": "3배+",
        "Payback": "3-6개월",
        "CAC": "$1-10 (무료 앱)"
    },

    "Enterprise Software": {
        "LTV/CAC": "5-7배",
        "Payback": "12-18개월",
        "CAC": "계약 금액의 1/5 이하"
    }
}

def evaluate_metrics(industry, ltv, cac):
    """산업 대비 평가"""

    ratio = ltv / cac
    benchmark = ltv_cac_benchmarks[industry]

    print(f"\n산업: {industry}")
    print(f"현재 LTV/CAC: {ratio:.1f}배")
    print(f"업계 기준: {benchmark['LTV/CAC']}")
    print(f"Payback 기준: {benchmark['Payback']}")
```

## 📝 정리

**CAC/LTV의 핵심**:
```
CAC = 고객 획득 비용
LTV = 고객 생애 가치
LTV/CAC > 3 = 건강한 비즈니스
```

**계산 공식**:
```
CAC = (마케팅비 + 영업비) / 신규 고객 수
LTV = 평균 구매액 × 구매 빈도 × 유지 기간
또는
LTV = ARPU × Margin / Churn Rate
```

**최적화**:
```
CAC 낮추기:
- 유기적 성장 (SEO, 추천)
- 전환율 개선
- 채널 최적화

LTV 높이기:
- Retention 향상
- ARPU 증가 (업셀)
- 구매 빈도 증가
```

**비유로 기억하기**:
```
CAC = 친구 사귀는 비용 (선물, 시간)
LTV = 평생 우정의 가치

좋은 관계: 가치 > 비용
나쁜 관계: 비용 > 가치

"돈 들여 고객 모으고, 가치로 유지한다"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
