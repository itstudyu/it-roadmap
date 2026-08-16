# North Star Metric (북극성 지표)

## 📝 정의

North Star Metric은 **제품의 핵심 가치를 가장 잘 나타내는 단 하나의 지표**입니다. 팀 전체가 집중해야 할 방향을 제시하는 나침반 역할을 합니다.

### 핵심 개념

- **무엇인가?**: 제품 성공을 대표하는 핵심 지표
- **왜 필요한가?**: 팀 정렬, 집중, 우선순위 결정
- **특징**: 단순, 측정 가능, 가치 반영

### North Star Metric이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 지표 혼란
팀원 A: "가입자 수를 늘려야죠!"
팀원 B: "매출이 중요해요!"
팀원 C: "체류 시간을 늘려야 해요!"
→ 각자 다른 목표! 😱

😱 시나리오 2: 허상의 성공
가입자: 100만 명 달성! 🎉
하지만 활성 사용자: 5,000명
→ 의미 없는 성장! 😱

😱 시나리오 3: 우선순위 불명확
기능 A: 가입자 증가
기능 B: 매출 증가
기능 C: 체류 시간 증가
→ 뭘 먼저? 😱
```

**North Star Metric의 해결**:
```
✅ 시나리오 1: 하나의 방향
North Star: "월간 활성 사용자 (MAU)"
→ 모든 팀이 MAU 증가에 집중! ✅

✅ 시나리오 2: 진짜 가치 측정
가입자 ❌ → MAU ✅
→ 실제 사용하는 사람 수! ✅

✅ 시나리오 3: 명확한 우선순위
기능 평가: MAU에 미치는 영향
A: MAU +5%
B: MAU +1%
C: MAU +10% ← 우선!
→ C부터 실행! ✅
```

## 💡 유명 제품의 North Star Metric

### 1. 제품별 예시

```python
north_star_examples = {
    "Facebook": {
        "nsm": "DAU (Daily Active Users)",
        "이유": "매일 사용 = 가치 경험",
        "매출 연결": "활성 사용자 ↑ → 광고 수익 ↑"
    },

    "Airbnb": {
        "nsm": "Nights Booked (예약된 숙박 일수)",
        "이유": "예약 = 핵심 가치 제공",
        "매출 연결": "예약 ↑ → 수수료 ↑"
    },

    "Spotify": {
        "nsm": "Time Spent Listening (청취 시간)",
        "이유": "음악 듣기 = 핵심 경험",
        "매출 연결": "청취 시간 ↑ → 구독 전환 ↑"
    },

    "Slack": {
        "nsm": "Messages Sent (전송 메시지 수)",
        "이유": "메시지 = 팀 협업 활용",
        "매출 연결": "메시지 ↑ → 유료 전환 ↑"
    },

    "Amazon": {
        "nsm": "Purchases per Month (월간 구매 수)",
        "이유": "구매 = 가치 실현",
        "매출 연결": "구매 ↑ → 매출 직접 ↑"
    },

    "Uber": {
        "nsm": "Rides per Week (주간 탑승 수)",
        "이유": "탑승 = 서비스 이용",
        "매출 연결": "탑승 ↑ → 수익 ↑"
    },

    "Medium": {
        "nsm": "Total Reading Time (총 독서 시간)",
        "이유": "읽기 = 콘텐츠 소비",
        "매출 연결": "독서 시간 ↑ → 구독 ↑"
    },

    "Netflix": {
        "nsm": "Hours Watched (시청 시간)",
        "이유": "시청 = 가치 경험",
        "매출 연결": "시청 ↑ → Retention ↑"
    }
}

# 출력
for product, info in north_star_examples.items():
    print(f"\n{product}")
    print(f"  NSM: {info['nsm']}")
    print(f"  이유: {info['이유']}")
    print(f"  매출: {info['매출 연결']}")
```

### 2. 비즈니스 모델별

```python
nsm_by_business_model = {
    "SaaS B2B": {
        "예시": ["활성 팀 수", "주간 활동 팀", "기능 사용률"],
        "설명": "팀 단위 활성화가 핵심"
    },

    "E-commerce": {
        "예시": ["월간 구매자 수", "반복 구매율", "GMV"],
        "설명": "구매와 재구매가 핵심"
    },

    "Marketplace": {
        "예시": ["거래 성사 수", "활성 공급자 & 수요자"],
        "설명": "양쪽 매칭이 핵심"
    },

    "Social Network": {
        "예시": ["DAU", "콘텐츠 생성량", "인게이지먼트"],
        "설명": "활성 참여가 핵심"
    },

    "Media/Content": {
        "예시": ["콘텐츠 소비 시간", "완독률", "공유 수"],
        "설명": "콘텐츠 소비가 핵심"
    },

    "Gaming": {
        "예시": ["DAU", "세션 시간", "레벨 진행"],
        "설명": "참여와 진행이 핵심"
    }
}
```

## 🎯 North Star Metric 선정 과정

### 1. 핵심 가치 정의

```python
def define_core_value(product):
    """제품의 핵심 가치 정의"""

    # 질문: 사용자가 제품에서 얻는 핵심 가치는?

    examples = {
        "Spotify": {
            "핵심 가치": "원하는 음악을 언제든지 들을 수 있음",
            "가치 측정": "청취 시간",
            "NSM": "Monthly Listening Hours"
        },

        "Notion": {
            "핵심 가치": "생산성 향상, 정보 정리",
            "가치 측정": "페이지 생성 및 편집",
            "NSM": "Weekly Active Users × Pages Created"
        },

        "Zoom": {
            "핵심 가치": "원활한 화상 회의",
            "가치 측정": "회의 진행",
            "NSM": "Weekly Meeting Minutes"
        }
    }

    return examples.get(product)

# 예시
notion_nsm = define_core_value("Notion")
print(f"Notion NSM 선정:")
print(f"  핵심 가치: {notion_nsm['핵심 가치']}")
print(f"  측정 방법: {notion_nsm['가치 측정']}")
print(f"  NSM: {notion_nsm['NSM']}")
```

### 2. 후보 지표 평가

```python
def evaluate_nsm_candidates(candidates):
    """NSM 후보 평가"""

    criteria = {
        "고객 가치": 0.3,    # 30%
        "매출 연결": 0.25,   # 25%
        "측정 가능": 0.2,    # 20%
        "실행 가능": 0.15,   # 15%
        "이해 용이": 0.1     # 10%
    }

    results = []

    for candidate in candidates:
        score = (
            candidate['customer_value'] * criteria['고객 가치'] +
            candidate['revenue_link'] * criteria['매출 연결'] +
            candidate['measurable'] * criteria['측정 가능'] +
            candidate['actionable'] * criteria['실행 가능'] +
            candidate['understandable'] * criteria['이해 용이']
        )

        results.append({
            'metric': candidate['name'],
            'score': score
        })

    # 점수순 정렬
    return sorted(results, key=lambda x: x['score'], reverse=True)

# 예시: SaaS 제품
candidates = [
    {
        'name': '가입자 수',
        'customer_value': 3,      # 낮음 (가입만 하고 안 씀)
        'revenue_link': 5,
        'measurable': 10,
        'actionable': 8,
        'understandable': 10
    },
    {
        'name': '주간 활성 사용자 (WAU)',
        'customer_value': 9,      # 높음 (실제 가치 경험)
        'revenue_link': 9,
        'measurable': 10,
        'actionable': 9,
        'understandable': 9
    },
    {
        'name': '페이지뷰',
        'customer_value': 5,
        'revenue_link': 6,
        'measurable': 10,
        'actionable': 7,
        'understandable': 8
    }
]

results = evaluate_nsm_candidates(candidates)

print("NSM 후보 평가:")
for r in results:
    print(f"  {r['metric']}: {r['score']:.1f}점")

# 출력:
# 주간 활성 사용자 (WAU): 9.15점 ← 최적!
# 페이지뷰: 6.85점
# 가입자 수: 5.75점
```

## 🔍 North Star Framework

### Input Metrics (입력 지표)

```python
"""
NSM을 움직이는 하위 지표들
"""

nsm_framework = {
    "North Star": "MAU (월간 활성 사용자)",

    "Input Metrics": [
        {
            "metric": "신규 가입",
            "impact": "MAU ↑",
            "owner": "마케팅/성장팀"
        },
        {
            "metric": "활성화율",
            "impact": "신규 → 활성",
            "owner": "제품팀"
        },
        {
            "metric": "Retention",
            "impact": "재방문 ↑",
            "owner": "제품팀"
        },
        {
            "metric": "Resurrection",
            "impact": "이탈자 복귀",
            "owner": "마케팅팀"
        }
    ]
}

def calculate_nsm_from_inputs(inputs):
    """입력 지표로 NSM 계산"""

    new_users = inputs['new_signups'] * inputs['activation_rate']
    retained_users = inputs['existing_mau'] * inputs['retention_rate']
    resurrected_users = inputs['churned_users'] * inputs['resurrection_rate']

    mau = new_users + retained_users + resurrected_users

    return {
        'mau': int(mau),
        'breakdown': {
            'new': int(new_users),
            'retained': int(retained_users),
            'resurrected': int(resurrected_users)
        }
    }

# 예시
current_month = {
    'new_signups': 10000,
    'activation_rate': 0.4,       # 40%
    'existing_mau': 50000,
    'retention_rate': 0.6,        # 60%
    'churned_users': 20000,
    'resurrection_rate': 0.05     # 5%
}

result = calculate_nsm_from_inputs(current_month)

print(f"MAU: {result['mau']:,}명")
print(f"  신규 활성: {result['breakdown']['new']:,}명")
print(f"  유지: {result['breakdown']['retained']:,}명")
print(f"  복귀: {result['breakdown']['resurrected']:,}명")
```

## 🚨 잘못된 North Star Metric

### ❌ 피해야 할 지표

```python
bad_north_stars = {
    "1. Vanity Metrics (허영 지표)": {
        "예시": ["총 가입자 수", "총 다운로드 수", "페이지뷰"],
        "문제": "실제 가치 반영 안 함",
        "이유": "누적 숫자 = 의미 없음"
    },

    "2. 통제 불가능한 지표": {
        "예시": ["바이럴 계수", "언론 노출"],
        "문제": "팀이 직접 영향 못 줌",
        "이유": "실행 불가능"
    },

    "3. 너무 좁은 지표": {
        "예시": ["특정 기능 사용률"],
        "문제": "제품 전체 가치 미반영",
        "이유": "국소 최적화"
    },

    "4. 매출과 무관한 지표": {
        "예시": ["앱 오픈 횟수 (가치 없이)"],
        "문제": "비즈니스 성장과 단절",
        "이유": "지속 불가능"
    },

    "5. 복잡한 지표": {
        "예시": ["(MAU × 0.3 + DAU × 0.7) / Churn^2"],
        "문제": "이해 안 됨",
        "이유": "팀 정렬 실패"
    }
}

# ❌ 나쁜 예: 총 가입자 수
bad_nsm = {
    "지표": "총 가입자 수",
    "1월": 10000,
    "2월": 12000,  # +2000
    "3월": 14000,  # +2000
    "실제 활성": 500  # 3.5%만 사용
}
# → 성장하는 것처럼 보이지만 죽은 지표

# ✅ 좋은 예: MAU
good_nsm = {
    "지표": "MAU",
    "1월": 500,
    "2월": 800,   # +60%
    "3월": 1200,  # +50%
    "의미": "실제 사용하는 사람"
}
# → 진짜 성장
```

## 💻 NSM 대시보드

```python
class NorthStarDashboard:
    """North Star Metric 대시보드"""

    def __init__(self, nsm_name):
        self.nsm_name = nsm_name
        self.data = []

    def track(self, date, value, inputs=None):
        """NSM 추적"""
        self.data.append({
            'date': date,
            'value': value,
            'inputs': inputs or {}
        })

    def get_trend(self):
        """트렌드 분석"""
        if len(self.data) < 2:
            return "데이터 부족"

        current = self.data[-1]['value']
        previous = self.data[-2]['value']

        change = ((current - previous) / previous) * 100

        return {
            'current': current,
            'previous': previous,
            'change': f"{change:+.1f}%",
            'direction': '📈' if change > 0 else '📉'
        }

    def display(self):
        """대시보드 출력"""
        print(f"{'='*50}")
        print(f"North Star Metric: {self.nsm_name}")
        print(f"{'='*50}")

        trend = self.get_trend()
        print(f"\n현재: {trend['current']:,}")
        print(f"이전: {trend['previous']:,}")
        print(f"변화: {trend['change']} {trend['direction']}")

        # 입력 지표
        latest = self.data[-1]
        if latest['inputs']:
            print(f"\nInput Metrics:")
            for metric, value in latest['inputs'].items():
                print(f"  {metric}: {value}")

# 사용
dashboard = NorthStarDashboard("MAU")

dashboard.track('2024-01', 10000, {
    '신규': 4000,
    '유지': 5500,
    '복귀': 500
})

dashboard.track('2024-02', 12000, {
    '신규': 5000,
    '유지': 6500,
    '복귀': 500
})

dashboard.display()
```

## 🔗 관련 용어

- [[OKR]]: NSM이 Objective가 될 수 있음
- [[KPI]]: NSM이 가장 중요한 KPI
- [[PMF]]: NSM이 일정 수준 이상 = PMF 신호
- [[Funnel]]: NSM을 높이기 위한 과정
- [[Retention]]: 많은 제품의 NSM 구성 요소

## 📝 정리

**North Star Metric의 핵심**:
```
NSM = 제품 성공의 핵심 지표
→ 단 하나
→ 고객 가치 + 매출 연결
→ 팀 전체가 집중
```

**좋은 NSM 조건**:
```
✅ 고객 가치 반영
✅ 매출과 연결
✅ 측정 가능
✅ 실행 가능
✅ 이해하기 쉬움
```

**유명 NSM 예시**:
```
Facebook: DAU
Airbnb: Nights Booked
Spotify: Time Spent Listening
Slack: Messages Sent
Amazon: Purchases per Month
```

**비유로 기억하기**:
```
NSM = 북극성 (나침반)
→ 어디로 가야 할지 방향 제시
→ 팀 모두가 같은 별 보고 항해
→ 길 잃지 않음

"하나의 지표, 하나의 방향"
"모든 배가 같은 항구를 향해"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
