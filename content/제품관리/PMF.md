# PMF (Product Market Fit)

## 📝 정의

PMF (Product Market Fit)는 **제품이 시장의 니즈를 충족하여 고객이 적극적으로 사용하고 추천하는 상태**입니다. 스타트업 성공의 가장 중요한 이정표입니다.

### 핵심 개념

- **무엇인가?**: 제품과 시장의 완벽한 조화
- **왜 중요한가?**: PMF 없이는 성장 불가
- **언제 달성?**: 고객이 제품을 열광적으로 사용

### PMF가 해결하는 문제

**문제 상황**:
```
😱 PMF 이전 (Before PMF)

시나리오 1: 아무도 안 씀
100명 가입 → 5명만 활성 사용자
→ 제품이 필요 없는 것! 😱

시나리오 2: 이탈이 빠름
신규 사용자: 많음
재방문율: 5%
→ 가치를 못 느낌! 😱

시나리오 3: 추천 없음
"주변에 추천하시겠어요?" → "아니요"
NPS: -20
→ 만족도 낮음! 😱

시나리오 4: 마케팅 비효율
광고비: 천만 원
신규 가입: 100명
→ 돈만 날림! 😱
```

**PMF 달성 후 (After PMF)**:
```
✅ 시나리오 1: 자발적 사용
100명 가입 → 80명 활성 사용자
→ 제품이 필요함! ✅

✅ 시나리오 2: 높은 재방문
신규 사용자: 많음
재방문율: 60%
→ 가치 제공! ✅

✅ 시나리오 3: 입소문
"주변에 추천하시겠어요?" → "당연하죠!"
NPS: +50
→ 열광적 반응! ✅

✅ 시나리오 4: 자연 성장
광고 안 해도 → 입소문으로 확산
바이럴 계수 > 1
→ 유기적 성장! ✅
```

## 💡 PMF 측정 방법

### 1. Sean Ellis Test (40% Rule)

```python
"""
"이 제품이 사라진다면 어떻게 느끼시겠어요?"

A. 매우 실망할 것이다
B. 조금 실망할 것이다
C. 별로 실망하지 않을 것이다
D. 상관없다 (이미 안 쓰고 있음)

PMF 기준: 40% 이상이 "매우 실망할 것이다"
"""

def sean_ellis_test(responses):
    """Sean Ellis Test 계산"""
    total = len(responses)
    very_disappointed = sum(
        1 for r in responses if r == "매우 실망할 것이다"
    )

    percentage = (very_disappointed / total) * 100

    if percentage >= 40:
        return f"✅ PMF 달성! ({percentage:.1f}%)"
    else:
        return f"❌ PMF 미달성 ({percentage:.1f}% < 40%)"

# 예시
survey_responses = [
    "매우 실망할 것이다",
    "매우 실망할 것이다",
    "조금 실망할 것이다",
    "매우 실망할 것이다",
    "별로 실망하지 않을 것이다",
    "매우 실망할 것이다",
    "매우 실망할 것이다",
    "조금 실망할 것이다",
    "매우 실망할 것이다",
    "매우 실망할 것이다"
]

result = sean_ellis_test(survey_responses)
print(result)  # ✅ PMF 달성! (70.0%)
```

### 2. Retention Curve (리텐션 곡선)

```python
import matplotlib.pyplot as plt
import numpy as np

# PMF 전: 계속 하락
before_pmf = [100, 60, 40, 25, 15, 10, 8, 6, 5, 4, 3, 2]

# PMF 후: 평탄화
after_pmf = [100, 80, 70, 65, 62, 60, 60, 60, 60, 60, 60, 60]

weeks = list(range(len(before_pmf)))

plt.figure(figsize=(12, 6))

plt.plot(weeks, before_pmf, 'r--', label='PMF 전', linewidth=2)
plt.plot(weeks, after_pmf, 'g-', label='PMF 후', linewidth=2)

plt.xlabel('Week')
plt.ylabel('Active Users (%)')
plt.title('Retention Curve: PMF 전 vs 후')
plt.legend()
plt.grid(True, alpha=0.3)
plt.axhline(y=40, color='gray', linestyle=':', label='40% 라인')

plt.savefig('retention_curve.png')

"""
PMF 전:
→ 리텐션 계속 하락
→ 최종 2-3% 수준

PMF 후:
→ 일정 수준에서 평탄화
→ 40-60% 유지 (좋은 신호!)
"""
```

### 3. NPS (Net Promoter Score)

```python
def calculate_nps(scores):
    """
    NPS 계산

    점수 0-10:
    - 9-10: Promoter (추천자)
    - 7-8: Passive (중립)
    - 0-6: Detractor (비추천자)

    NPS = (Promoter % - Detractor %)
    """
    total = len(scores)

    promoters = sum(1 for s in scores if s >= 9)
    detractors = sum(1 for s in scores if s <= 6)

    nps = ((promoters - detractors) / total) * 100

    if nps >= 50:
        status = "✅ Excellent (PMF 가능성 높음)"
    elif nps >= 30:
        status = "🟡 Good"
    elif nps >= 0:
        status = "🟠 Needs Improvement"
    else:
        status = "❌ Critical"

    return {
        'nps': nps,
        'status': status,
        'promoters': (promoters/total)*100,
        'detractors': (detractors/total)*100
    }

# 예시
user_scores = [9, 10, 8, 9, 10, 7, 9, 10, 8, 9]
result = calculate_nps(user_scores)

print(f"NPS: {result['nps']:.1f}")
print(f"Status: {result['status']}")
print(f"Promoters: {result['promoters']:.1f}%")
print(f"Detractors: {result['detractors']:.1f}%")

# 출력:
# NPS: 70.0
# Status: ✅ Excellent (PMF 가능성 높음)
```

### 4. Organic Growth Rate

```python
def pmf_growth_metrics(data):
    """PMF 성장 지표"""
    metrics = {
        "월간 성장률": calculate_mom_growth(data),
        "바이럴 계수": calculate_viral_coefficient(data),
        "유기적 비율": calculate_organic_ratio(data)
    }

    # PMF 기준
    pmf_criteria = {
        "월간 성장률": metrics["월간 성장률"] >= 5,  # 5% 이상
        "바이럴 계수": metrics["바이럴 계수"] >= 1,  # 1 이상
        "유기적 비율": metrics["유기적 비율"] >= 30  # 30% 이상
    }

    pmf_score = sum(pmf_criteria.values())

    return {
        'metrics': metrics,
        'criteria': pmf_criteria,
        'pmf_score': f"{pmf_score}/3",
        'has_pmf': pmf_score >= 2
    }

def calculate_mom_growth(data):
    """월간 성장률"""
    current = data['current_month_users']
    previous = data['previous_month_users']
    return ((current - previous) / previous) * 100

def calculate_viral_coefficient(data):
    """바이럴 계수 = 초대당 신규 가입 수"""
    invites = data['invites_sent']
    signups = data['referral_signups']
    return signups / invites if invites > 0 else 0

def calculate_organic_ratio(data):
    """유기적 가입 비율"""
    total = data['total_signups']
    organic = data['organic_signups']
    return (organic / total) * 100

# 예시
growth_data = {
    'current_month_users': 10500,
    'previous_month_users': 10000,
    'invites_sent': 5000,
    'referral_signups': 6000,
    'total_signups': 1000,
    'organic_signups': 400
}

result = pmf_growth_metrics(growth_data)
print("PMF 성장 지표:")
for metric, value in result['metrics'].items():
    print(f"  {metric}: {value:.2f}")

print(f"\nPMF Score: {result['pmf_score']}")
print(f"PMF 달성: {'✅ Yes' if result['has_pmf'] else '❌ Not Yet'}")
```

## 🎯 PMF 달성 과정

### 1단계: Problem-Solution Fit

```python
"""
문제를 정확히 파악했는가?
"""

problem_solution_fit = {
    "단계": "Problem-Solution Fit",
    "목표": "진짜 문제 찾기",
    "방법": [
        "고객 인터뷰 (100명+)",
        "문제 가설 검증",
        "MVP 테스트"
    ],
    "성공 지표": [
        "40% 이상이 이 문제가 중요하다고 응답",
        "현재 해결 방법에 불만족",
        "돈 낼 의향 있음"
    ]
}
```

### 2단계: Product-Solution Fit

```python
"""
솔루션이 문제를 해결하는가?
"""

product_solution_fit = {
    "단계": "Product-Solution Fit",
    "목표": "솔루션 검증",
    "방법": [
        "프로토타입 테스트",
        "얼리 어답터 피드백",
        "반복 개선"
    ],
    "성공 지표": [
        "사용자가 실제로 사용",
        "재사용률 > 30%",
        "긍정적 피드백"
    ]
}
```

### 3단계: Product-Market Fit

```python
"""
제품이 시장에 맞는가?
"""

product_market_fit = {
    "단계": "Product-Market Fit",
    "목표": "시장 적합성",
    "방법": [
        "Sean Ellis Test",
        "Retention 분석",
        "NPS 측정"
    ],
    "성공 지표": [
        "40% 이상 '매우 실망'",
        "Retention 평탄화",
        "NPS > 50",
        "유기적 성장"
    ]
}
```

## 🔍 PMF 사례 연구

### Slack의 PMF

```python
"""
Slack의 PMF 지표 (초기)

2013년 런칭 후:
- Day 1 Retention: 93%
- Daily Active Users: 빠르게 증가
- Word of Mouth: 강력한 바이럴

왜 성공?
1. 진짜 문제 해결 (이메일 혼잡)
2. 즉각적인 가치 제공
3. 팀 전체가 쓰면 더 좋음 (네트워크 효과)
"""

slack_pmf_signs = {
    "retention": "93% Day 1",
    "growth": "월 10-15%",
    "nps": "70+",
    "organic": "대부분이 입소문",
    "sean_ellis": "60%+ 매우 실망",
    "time_to_value": "< 5분"
}
```

### Airbnb의 PMF

```python
"""
Airbnb의 PMF 여정

초기 실패:
- 아무도 안 씀
- 사진이 별로
- 신뢰 문제

PMF 찾기:
1. 직접 집 방문해서 전문 사진 촬영
2. 호스트-게스트 신뢰 시스템
3. 특정 이벤트 타겟 (컨퍼런스)

결과:
- 예약률 2-3배 증가
- 입소문 확산
- PMF 달성!
"""

airbnb_before_pmf = {
    "bookings_per_month": 10,
    "growth": "정체",
    "problem": "신뢰 부족, 낮은 품질"
}

airbnb_after_pmf = {
    "bookings_per_month": 200,
    "growth": "월 20-30%",
    "solution": "전문 사진, 리뷰 시스템"
}
```

## 🚨 PMF 착각 (False PMF)

### 잘못된 신호들

```python
"""
PMF로 착각하기 쉬운 것들
"""

false_pmf_signals = {
    "초기 열광": {
        "현상": "얼리 어답터들의 높은 관심",
        "함정": "틈새 시장일 수 있음",
        "확인": "일반 사용자도 같은 반응?"
    },

    "높은 가입률": {
        "현상": "많은 사람이 가입",
        "함정": "하지만 사용 안 함",
        "확인": "Activation Rate는?"
    },

    "미디어 주목": {
        "현상": "언론에 많이 소개됨",
        "함정": "일시적 관심",
        "확인": "지속적 성장?"
    },

    "투자 유치": {
        "현상": "VC가 투자함",
        "함정": "미래 가능성 투자",
        "확인": "실제 사용자 만족도는?"
    }
}

# 진짜 PMF 체크리스트
real_pmf_checklist = [
    "사용자가 제품 없으면 매우 실망 (40%+)",
    "Retention이 평탄화됨 (40%+)",
    "NPS가 높음 (50+)",
    "유기적 성장 (5-7% MoM)",
    "사용자가 적극 추천",
    "Churn Rate이 낮음 (<5%)"
]
```

## 💻 PMF 대시보드

```python
class PMFDashboard:
    """PMF 측정 대시보드"""

    def __init__(self):
        self.metrics = {}

    def track_sean_ellis(self, responses):
        """Sean Ellis Test"""
        total = len(responses)
        very_disappointed = sum(
            1 for r in responses if r == "very_disappointed"
        )
        self.metrics['sean_ellis'] = (very_disappointed / total) * 100

    def track_retention(self, cohort_data):
        """Retention Rate"""
        # Week 4 retention
        week4_retention = cohort_data['week_4'] / cohort_data['week_0']
        self.metrics['retention'] = week4_retention * 100

    def track_nps(self, scores):
        """NPS"""
        promoters = sum(1 for s in scores if s >= 9) / len(scores)
        detractors = sum(1 for s in scores if s <= 6) / len(scores)
        self.metrics['nps'] = (promoters - detractors) * 100

    def track_growth(self, current, previous):
        """Growth Rate"""
        growth = ((current - previous) / previous) * 100
        self.metrics['growth'] = growth

    def calculate_pmf_score(self):
        """PMF Score 계산"""
        score = 0

        if self.metrics.get('sean_ellis', 0) >= 40:
            score += 25
        if self.metrics.get('retention', 0) >= 40:
            score += 25
        if self.metrics.get('nps', 0) >= 50:
            score += 25
        if self.metrics.get('growth', 0) >= 5:
            score += 25

        return score

    def display(self):
        """결과 표시"""
        print("="*50)
        print("PMF Dashboard")
        print("="*50)

        for metric, value in self.metrics.items():
            status = "✅" if self._is_passing(metric, value) else "❌"
            print(f"{status} {metric}: {value:.1f}")

        pmf_score = self.calculate_pmf_score()
        print(f"\nPMF Score: {pmf_score}/100")

        if pmf_score >= 75:
            print("🎉 PMF 달성!")
        elif pmf_score >= 50:
            print("🟡 PMF 근접")
        else:
            print("❌ PMF 미달성")

    def _is_passing(self, metric, value):
        """기준 통과 여부"""
        thresholds = {
            'sean_ellis': 40,
            'retention': 40,
            'nps': 50,
            'growth': 5
        }
        return value >= thresholds.get(metric, 0)

# 사용
dashboard = PMFDashboard()
dashboard.track_sean_ellis(['very_disappointed'] * 45 + ['somewhat'] * 55)
dashboard.track_retention({'week_0': 1000, 'week_4': 450})
dashboard.track_nps([9, 10, 8, 9, 10, 9, 8, 9, 10, 9])
dashboard.track_growth(10500, 10000)
dashboard.display()
```

## 🔗 관련 용어

- [[MVP]]: PMF 찾기 위한 첫 단계
- [[Product Roadmap]]: PMF 후 확장 계획
- [[OKR]]: PMF가 주요 목표
- [[KPI]]: PMF 측정 지표
- [[Pivot]]: PMF 못 찾으면 방향 전환

## 📝 정리

**PMF의 핵심**:
```
PMF = 제품 ❤️ 시장
→ 고객이 열광
→ 자발적 사용
→ 적극 추천
→ 유기적 성장
```

**측정 방법**:
```
Sean Ellis Test: 40% 매우 실망
Retention: 40% 이상 평탄화
NPS: 50 이상
Growth: 월 5-7% 유기적 성장
```

**달성 과정**:
```
1. Problem-Solution Fit
2. Product-Solution Fit
3. Product-Market Fit
```

**비유로 기억하기**:
```
PMF = 퍼즐 조각 맞추기
→ 제품(조각) + 시장(빈칸)
→ 딱 맞으면 → PMF!
→ 안 맞으면 → 조각 바꾸기 (Pivot)

"PMF 없이 성장 = 구멍 난 양동이에 물 붓기"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
