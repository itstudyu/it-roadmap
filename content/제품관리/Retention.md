# Retention (리텐션, 유지율)

## 📝 정의

Retention은 **사용자가 제품을 계속 사용하는 비율**입니다. 신규 사용자를 끌어들이는 것보다 중요한, 제품 성공의 핵심 지표입니다.

### 핵심 개념

- **무엇인가?**: 사용자가 다시 돌아오는 비율
- **왜 중요한가?**: "구멍 난 양동이에 물 붓기" 방지
- **언제 측정?**: Day 1, Day 7, Day 30

### Retention이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 구멍 난 양동이
신규 가입: 매달 10,000명
→ 다음 달 사용자: 500명
→ 9,500명 이탈! 😱
→ 아무리 마케팅해도 성장 안 함!

😱 시나리오 2: 허상의 성장
월간 가입자: 증가 중 📈
월간 활성 사용자: 정체 중 😱
→ 가입만 하고 안 씀!

😱 시나리오 3: 비용 낭비
고객 획득 비용: 10,000원
1달 사용 후 이탈
→ 10,000원 날림! 😱
```

**Retention의 해결**:
```
✅ 시나리오 1: 건강한 성장
신규 가입: 10,000명
30일 Retention: 60%
→ 6,000명 유지! ✅
→ 매달 누적 성장!

✅ 시나리오 2: 진짜 성장
가입자: 증가
활성 사용자: 같이 증가
→ 실제 사용! ✅

✅ 시나리오 3: 투자 회수
고객 획득: 10,000원
12개월 유지 (LTV: 50,000원)
→ 5배 수익! ✅
```

## 💡 Retention 측정

### 1. 기본 계산

```python
def calculate_retention(cohort_data):
    """
    Retention Rate 계산

    cohort_data: {
        'day_0': 1000,  # 가입일
        'day_1': 800,   # 1일 후
        'day_7': 600,   # 7일 후
        'day_30': 400   # 30일 후
    }
    """

    retention = {}

    for day, users in cohort_data.items():
        if day == 'day_0':
            rate = 100.0
        else:
            rate = (users / cohort_data['day_0']) * 100

        retention[day] = {
            'users': users,
            'rate': f"{rate:.1f}%"
        }

    return retention

# 예시
cohort = {
    'day_0': 1000,
    'day_1': 800,
    'day_7': 600,
    'day_30': 400,
    'day_90': 300
}

result = calculate_retention(cohort)

print("Retention Rate:")
for day, data in result.items():
    print(f"{day}: {data['users']}명 ({data['rate']})")

# 출력:
# day_0: 1000명 (100.0%)
# day_1: 800명 (80.0%)  ✅ 좋음
# day_7: 600명 (60.0%)  ✅ 좋음
# day_30: 400명 (40.0%)  🟡 보통
# day_90: 300명 (30.0%)  🟡 개선 필요
```

### 2. Cohort Analysis

```python
import pandas as pd
import matplotlib.pyplot as plt

def cohort_retention_analysis(data):
    """
    코호트별 리텐션 분석

    data: {
        '2024-01': [100, 80, 60, 40, 30],  # 1월 가입자
        '2024-02': [100, 85, 65, 45, 35],  # 2월 가입자
        '2024-03': [100, 90, 70, 50, 40]   # 3월 가입자
    }
    """

    # 데이터프레임 생성
    df = pd.DataFrame(data).T
    df.columns = ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4']

    # 시각화
    plt.figure(figsize=(12, 6))

    for cohort in df.index:
        plt.plot(df.columns, df.loc[cohort], marker='o', label=cohort)

    plt.xlabel('Week')
    plt.ylabel('Retention (%)')
    plt.title('Cohort Retention Analysis')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('cohort_retention.png')

    return df

# 예시
cohorts = {
    '2024-01': [100, 75, 55, 40, 32],
    '2024-02': [100, 80, 60, 45, 38],
    '2024-03': [100, 85, 68, 52, 45]  # 개선 추세!
}

analysis = cohort_retention_analysis(cohorts)
print(analysis)
```

### 3. Retention Curve

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_retention_curve(good_product, bad_product):
    """
    좋은 제품 vs 나쁜 제품 리텐션 곡선
    """

    weeks = np.arange(0, 13)

    # 나쁜 제품: 계속 하락
    bad = [100, 60, 40, 28, 20, 15, 12, 10, 8, 6, 5, 4, 3]

    # 좋은 제품: 평탄화
    good = [100, 85, 75, 68, 65, 63, 62, 61, 60, 60, 60, 60, 60]

    plt.figure(figsize=(12, 6))
    plt.plot(weeks, bad, 'r--', label='나쁜 제품 (PMF 미달성)', linewidth=2)
    plt.plot(weeks, good, 'g-', label='좋은 제품 (PMF 달성)', linewidth=2)

    plt.axhline(y=40, color='gray', linestyle=':', label='40% 기준선')
    plt.xlabel('Week')
    plt.ylabel('Retention (%)')
    plt.title('Retention Curve: PMF 달성 vs 미달성')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('retention_curve.png')

    print("좋은 제품 특징:")
    print("→ 초기 하락 후 평탄화")
    print("→ 40-60% 수준 유지")
    print("→ PMF 신호!")

plot_retention_curve()
```

## 🎯 Retention 개선 전략

### 1. Onboarding 최적화

```python
"""
신규 사용자 온보딩 = Retention의 핵심
"""

onboarding_best_practices = {
    "1. 빠른 가치 제공": {
        "문제": "가입 후 아무것도 안 보임",
        "해결": "즉시 샘플 데이터 제공",
        "예시": "Slack: 가입하자마자 튜토리얼 채널"
    },

    "2. 점진적 학습": {
        "문제": "모든 기능 한 번에 설명",
        "해결": "필요할 때 하나씩 안내",
        "예시": "Duolingo: 레벨 업할 때마다 새 기능"
    },

    "3. 첫 성공 경험": {
        "문제": "어떻게 시작할지 모름",
        "해결": "첫 작업 가이드",
        "예시": "Canva: 템플릿으로 바로 시작"
    },

    "4. Aha Moment 유도": {
        "문제": "제품 가치 못 느낌",
        "해결": "핵심 가치 빠르게 경험",
        "예시": "Facebook: 7명 친구 추가 = Aha!"
    }
}

def calculate_onboarding_impact():
    """온보딩 개선 효과"""

    before = {
        "가입": 1000,
        "온보딩 완료": 300,  # 30%
        "Day 7 retention": 90  # 9%
    }

    after = {
        "가입": 1000,
        "온보딩 완료": 700,  # 70% (+133%)
        "Day 7 retention": 420  # 42% (+367%)
    }

    improvement = (
        (after['Day 7 retention'] - before['Day 7 retention'])
        / before['Day 7 retention']
    ) * 100

    print(f"온보딩 개선 효과: +{improvement:.0f}%")
    print(f"Before: {before['Day 7 retention']}명")
    print(f"After: {after['Day 7 retention']}명")

calculate_onboarding_impact()
```

### 2. Habit Building (습관 형성)

```python
"""
사용자 습관 만들기
"""

habit_loop = {
    "1. Trigger (방아쇠)": {
        "내부": "심심함, 외로움, 궁금함",
        "외부": "푸시 알림, 이메일, 친구 초대",
        "예시": "Instagram: 친구가 사진 올림 알림"
    },

    "2. Action (행동)": {
        "조건": "쉬워야 함 (1-2 클릭)",
        "예시": "앱 열기 → 피드 스크롤",
        "최적화": "마찰 최소화"
    },

    "3. Reward (보상)": {
        "종류": "변동 보상 (예측 불가)",
        "예시": "새로운 콘텐츠, 좋아요, 댓글",
        "원리": "도파민 분비"
    },

    "4. Investment (투자)": {
        "의미": "사용자가 무언가 남김",
        "예시": "팔로우, 프로필, 콘텐츠",
        "효과": "다음 사용 가능성 ⬆"
    }
}

# 습관 점수 계산
def calculate_habit_score(product):
    """제품의 습관 형성 점수"""

    score = 0

    if product.get('daily_trigger'):
        score += 25  # 매일 트리거
    if product.get('easy_action'):
        score += 25  # 쉬운 액션
    if product.get('variable_reward'):
        score += 25  # 변동 보상
    if product.get('user_investment'):
        score += 25  # 사용자 투자

    return {
        'score': score,
        'habit_forming': score >= 75
    }

# 예시
instagram = {
    'daily_trigger': True,   # 알림
    'easy_action': True,     # 스크롤
    'variable_reward': True, # 새 콘텐츠
    'user_investment': True  # 팔로우, 포스팅
}

result = calculate_habit_score(instagram)
print(f"습관 점수: {result['score']}/100")
print(f"습관 형성: {'✅' if result['habit_forming'] else '❌'}")
```

### 3. Engagement 촉진

```python
"""
사용자 참여 유도
"""

engagement_tactics = [
    {
        "전술": "Streak (연속 기록)",
        "예시": "Duolingo: 100일 연속 학습",
        "효과": "이탈 두려움"
    },
    {
        "전술": "Social Proof",
        "예시": "LinkedIn: '프로필 조회 5배 증가!'",
        "효과": "경쟁심, 호기심"
    },
    {
        "전술": "Progress Bar",
        "예시": "프로필 완성도 60%",
        "효과": "완성 욕구"
    },
    {
        "전술": "Personalization",
        "예시": "Netflix: '당신을 위한 추천'",
        "효과": "관련성 ⬆"
    },
    {
        "전술": "Community",
        "예시": "Reddit: 서브레딧 커뮤니티",
        "효과": "소속감"
    }
]
```

## 🔍 Retention 벤치마크

### 산업별 기준

```python
retention_benchmarks = {
    "Consumer App": {
        "Day 1": "40%+",
        "Day 7": "20%+",
        "Day 30": "10%+",
        "비고": "일반 소비자 앱"
    },

    "Social Media": {
        "Day 1": "60%+",
        "Day 7": "40%+",
        "Day 30": "30%+",
        "비고": "네트워크 효과"
    },

    "SaaS B2B": {
        "Day 1": "70%+",
        "Day 7": "60%+",
        "Day 30": "50%+",
        "비고": "업무 필수 도구"
    },

    "E-commerce": {
        "Day 1": "30%+",
        "Day 7": "15%+",
        "Day 30": "8%+",
        "비고": "구매 주기 영향"
    },

    "Gaming": {
        "Day 1": "40%+",
        "Day 7": "15%+",
        "Day 30": "5%+",
        "비고": "높은 이탈률"
    }
}

# 내 제품 평가
my_product = {
    "industry": "Consumer App",
    "day_1": 50,  # 50%
    "day_7": 25,  # 25%
    "day_30": 12  # 12%
}

benchmark = retention_benchmarks[my_product['industry']]

print(f"산업: {my_product['industry']}")
print(f"Day 1: {my_product['day_1']}% (기준: {benchmark['Day 1']})")
print(f"Day 7: {my_product['day_7']}% (기준: {benchmark['Day 7']})")
print(f"Day 30: {my_product['day_30']}% (기준: {benchmark['Day 30']})")
```

## 🚨 Retention 개선 실수

### ❌ 피해야 할 것

```python
# 1. 스팸 알림
bad_practice_1 = {
    "알림 횟수": "하루 10번+",
    "결과": "앱 삭제",
    "올바른 방법": "의미 있는 알림만, 설정 가능"
}

# 2. 복잡한 온보딩
bad_practice_2 = {
    "단계": "10단계 튜토리얼",
    "결과": "중간에 이탈",
    "올바른 방법": "점진적, 필요할 때만"
}

# 3. 기능 폭탄
bad_practice_3 = {
    "접근": "모든 기능 한 번에",
    "결과": "압도당함",
    "올바른 방법": "핵심 기능부터, 단계적"
}
```

## 🔗 관련 용어

- [[PMF]]: 40%+ Retention = PMF 신호
- [[Funnel]]: Retention은 Funnel의 마지막 단계
- [[Cohort Analysis]]: Retention 측정 방법
- [[Churn Rate]]: Retention의 반대 개념
- [[LTV]]: Retention이 높으면 LTV 증가

## 📝 정리

**Retention의 핵심**:
```
Retention = 다시 돌아오는 비율
→ 제품 건강도 지표
→ 성장의 기반
→ PMF의 증거
```

**측정 기준**:
```
Day 1: 80%+ (우수)
Day 7: 40%+ (좋음)
Day 30: 20%+ (보통)

Curve: 평탄화 = PMF
```

**개선 방법**:
```
✅ 온보딩 최적화
✅ Aha Moment 빠르게
✅ 습관 형성
✅ 참여 유도
✅ 가치 지속 제공
```

**비유로 기억하기**:
```
Retention = 친구 관계
→ 첫 만남: 좋은 인상 (온보딩)
→ 재미있음: 다시 만남 (가치)
→ 습관: 매주 만남 (리텐션)
→ 오래 유지: 진한 친구 (충성 고객)

"신규 획득 < 기존 유지"
"구멍 난 양동이 먼저 막아라"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
