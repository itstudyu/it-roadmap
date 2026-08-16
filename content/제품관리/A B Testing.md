# A/B Testing (A/B 테스트)

## 📝 정의

A/B Testing은 **두 가지 버전(A와 B)을 동시에 테스트하여 어느 것이 더 나은지 데이터로 확인하는 실험 방법**입니다. 데이터 기반 의사결정의 핵심 도구입니다.

### 핵심 개념

- **무엇인가?**: 통제된 실험 (Controlled Experiment)
- **왜 필요한가?**: 추측이 아닌 데이터로 결정
- **어떻게?**: 사용자를 랜덤으로 나눠 다른 버전 노출

### A/B Testing이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 의견 충돌
디자이너: "빨간 버튼이 더 눈에 띄어요!"
개발자: "파란 버튼이 브랜드 컬러예요!"
마케터: "초록 버튼이 전환율 높을 거예요!"
→ 누구 말이 맞아? 😱

😱 시나리오 2: 위험한 변경
전체 사용자에게 새 디자인 적용
→ 전환율 30% 하락! 😱
→ 되돌리기엔 너무 늦음!

😱 시나리오 3: HiPPO 의사결정
CEO: "내 생각엔 이게 좋을 것 같은데?"
팀: "네, 그렇게 하겠습니다"
→ HiPPO (Highest Paid Person's Opinion) 😱
→ 실제 사용자 의견 무시!
```

**A/B Testing의 해결**:
```
✅ 시나리오 1: 데이터로 결정
A안: 빨간 버튼 → 전환율 3.2%
B안: 파란 버튼 → 전환율 2.8%
C안: 초록 버튼 → 전환율 4.1%
→ 초록 버튼 선택! ✅
→ 객관적 근거!

✅ 시나리오 2: 안전한 배포
50% 사용자만 새 디자인 노출
→ 결과 확인 후 결정
→ 문제 발견 시 쉽게 롤백! ✅

✅ 시나리오 3: 사용자 중심
CEO 의견: "A가 좋을 것 같다"
테스트 결과: B가 20% 더 좋음
→ B 선택! ✅
→ 데이터 기반 결정!
```

## 💡 A/B Testing 구현

### 1. 간단한 A/B 테스트

```python
import random

def ab_test(user_id):
    """사용자를 A/B 그룹으로 분할"""

    # 사용자 ID 기반 해싱 (일관성 유지)
    hash_value = hash(str(user_id))

    # 50/50 분할
    if hash_value % 2 == 0:
        return "A"  # 기존 버전
    else:
        return "B"  # 새 버전

# 테스트
user_groups = {}
for user_id in range(1000):
    group = ab_test(user_id)
    user_groups[group] = user_groups.get(group, 0) + 1

print(f"그룹 A: {user_groups['A']}명")
print(f"그룹 B: {user_groups['B']}명")

# 출력:
# 그룹 A: 500명
# 그룹 B: 500명
```

### 2. 버튼 색상 테스트

```python
# 웹 애플리케이션에서 A/B 테스트

from flask import Flask, session, render_template
import uuid

app = Flask(__name__)
app.secret_key = 'your-secret-key'

@app.route('/')
def index():
    # 세션에 사용자 ID 없으면 생성
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())

    # A/B 그룹 할당
    user_id = session['user_id']
    group = ab_test(user_id)

    # 그룹별 버튼 색상
    button_colors = {
        "A": "blue",   # 기존
        "B": "green"   # 테스트
    }

    button_color = button_colors[group]

    # 로그 기록 (분석용)
    log_impression(user_id, group, button_color)

    return render_template(
        'index.html',
        button_color=button_color,
        group=group
    )

@app.route('/click')
def click():
    """버튼 클릭 이벤트"""
    user_id = session.get('user_id')
    group = ab_test(user_id)

    # 클릭 로그
    log_click(user_id, group)

    return "Success"

def log_impression(user_id, group, color):
    """노출 로그"""
    print(f"Impression: {user_id}, {group}, {color}")

def log_click(user_id, group):
    """클릭 로그"""
    print(f"Click: {user_id}, {group}")
```

### 3. 통계 분석

```python
import scipy.stats as stats

def analyze_ab_test(group_a, group_b):
    """
    A/B 테스트 결과 분석

    group_a, group_b = {
        'impressions': 노출 수,
        'conversions': 전환 수
    }
    """

    # 전환율 계산
    rate_a = group_a['conversions'] / group_a['impressions']
    rate_b = group_b['conversions'] / group_b['impressions']

    # 차이
    lift = ((rate_b - rate_a) / rate_a) * 100

    # 통계적 유의성 (Chi-Square Test)
    contingency_table = [
        [group_a['conversions'], group_a['impressions'] - group_a['conversions']],
        [group_b['conversions'], group_b['impressions'] - group_b['conversions']]
    ]

    chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)

    # 결과
    result = {
        'group_a_rate': f"{rate_a * 100:.2f}%",
        'group_b_rate': f"{rate_b * 100:.2f}%",
        'lift': f"{lift:+.2f}%",
        'p_value': p_value,
        'significant': p_value < 0.05,  # 95% 신뢰수준
        'winner': 'B' if rate_b > rate_a and p_value < 0.05 else 'A' if rate_a > rate_b and p_value < 0.05 else 'No winner'
    }

    return result

# 예시
group_a = {
    'impressions': 10000,
    'conversions': 320  # 3.2%
}

group_b = {
    'impressions': 10000,
    'conversions': 410  # 4.1%
}

result = analyze_ab_test(group_a, group_b)

print("A/B 테스트 결과:")
print(f"그룹 A 전환율: {result['group_a_rate']}")
print(f"그룹 B 전환율: {result['group_b_rate']}")
print(f"개선율: {result['lift']}")
print(f"P-value: {result['p_value']:.4f}")
print(f"통계적 유의성: {'✅ Yes' if result['significant'] else '❌ No'}")
print(f"승자: {result['winner']}")

# 출력:
# 그룹 A 전환율: 3.20%
# 그룹 B 전환율: 4.10%
# 개선율: +28.13%
# P-value: 0.0012
# 통계적 유의성: ✅ Yes
# 승자: B
```

## 🎯 A/B Testing 모범 사례

### 1. 샘플 크기 계산

```python
import math

def calculate_sample_size(
    baseline_rate,
    minimum_detectable_effect,
    significance_level=0.05,
    power=0.8
):
    """
    필요한 샘플 크기 계산

    baseline_rate: 기존 전환율 (예: 0.03 = 3%)
    minimum_detectable_effect: 최소 감지 차이 (예: 0.2 = 20% 개선)
    significance_level: 유의수준 (보통 0.05 = 5%)
    power: 검정력 (보통 0.8 = 80%)
    """

    # Z 점수
    z_alpha = 1.96  # 95% 신뢰수준
    z_beta = 0.84   # 80% 검정력

    # 새로운 전환율
    new_rate = baseline_rate * (1 + minimum_detectable_effect)

    # 평균
    p_avg = (baseline_rate + new_rate) / 2

    # 샘플 크기
    n = (
        2 * (z_alpha + z_beta) ** 2 * p_avg * (1 - p_avg)
    ) / (baseline_rate - new_rate) ** 2

    return math.ceil(n)

# 예시
baseline = 0.03  # 3% 전환율
mde = 0.2        # 20% 개선 감지하고 싶음

sample_size = calculate_sample_size(baseline, mde)

print(f"기존 전환율: {baseline * 100}%")
print(f"최소 감지 효과: {mde * 100}%")
print(f"필요한 샘플 크기: 그룹당 {sample_size:,}명")
print(f"총 필요 인원: {sample_size * 2:,}명")

# 출력:
# 기존 전환율: 3.0%
# 최소 감지 효과: 20.0%
# 필요한 샘플 크기: 그룹당 6,210명
# 총 필요 인원: 12,420명
```

### 2. 테스트 기간 계산

```python
def calculate_test_duration(
    daily_visitors,
    sample_size_per_group,
    num_variants=2
):
    """
    테스트 소요 기간 계산

    daily_visitors: 일일 방문자 수
    sample_size_per_group: 그룹당 필요 샘플
    num_variants: 변형 수 (A/B = 2, A/B/C = 3)
    """

    total_needed = sample_size_per_group * num_variants
    days = total_needed / daily_visitors

    return {
        'days': math.ceil(days),
        'weeks': math.ceil(days / 7),
        'recommendation': '최소 1주일 이상 (요일 효과 제거)'
    }

# 예시
duration = calculate_test_duration(
    daily_visitors=1000,
    sample_size_per_group=6210,
    num_variants=2
)

print(f"예상 소요일: {duration['days']}일")
print(f"예상 소요 주: {duration['weeks']}주")
print(f"권장사항: {duration['recommendation']}")
```

## 🔍 다양한 A/B 테스트 유형

### 1. Multivariate Testing (MVT)

```python
"""
여러 요소를 동시에 테스트

예시:
- 버튼 색상 (빨강/파랑)
- 버튼 텍스트 ("구매하기"/"지금 구매")
- 이미지 (제품 사진/사용 장면)

총 조합: 2 × 2 × 2 = 8가지
"""

variants = {
    "A": {"color": "red", "text": "구매하기", "image": "product"},
    "B": {"color": "red", "text": "구매하기", "image": "usage"},
    "C": {"color": "red", "text": "지금 구매", "image": "product"},
    "D": {"color": "red", "text": "지금 구매", "image": "usage"},
    "E": {"color": "blue", "text": "구매하기", "image": "product"},
    "F": {"color": "blue", "text": "구매하기", "image": "usage"},
    "G": {"color": "blue", "text": "지금 구매", "image": "product"},
    "H": {"color": "blue", "text": "지금 구매", "image": "usage"}
}

# ⚠️ 주의: 트래픽이 많이 필요함
# 각 그룹당 충분한 샘플 필요
```

### 2. Sequential Testing

```python
"""
실시간으로 결과를 모니터링하며 조기 종료
"""

def sequential_test(data_stream):
    """순차 테스트"""
    threshold = 0.01  # 조기 종료 임계값

    for i, data in enumerate(data_stream):
        p_value = calculate_p_value(data)

        if p_value < threshold:
            return {
                'stop': True,
                'reason': '유의미한 차이 발견',
                'iterations': i
            }

        if i > max_iterations:
            return {
                'stop': True,
                'reason': '최대 반복 도달',
                'iterations': i
            }

    return {'stop': False}
```

### 3. Bandit Testing

```python
"""
Multi-Armed Bandit
- 더 나은 변형에 점점 더 많은 트래픽 할당
- A/B 테스트보다 빠른 최적화
"""

class MultiArmedBandit:
    """멀티 암드 밴딧"""

    def __init__(self, variants):
        self.variants = variants
        self.counts = {v: 0 for v in variants}
        self.rewards = {v: 0 for v in variants}

    def select_variant(self):
        """변형 선택 (UCB 알고리즘)"""
        total_counts = sum(self.counts.values())

        if total_counts < len(self.variants):
            # 초기: 모든 변형 한 번씩
            return self.variants[total_counts]

        # UCB 점수 계산
        ucb_scores = {}
        for variant in self.variants:
            avg_reward = self.rewards[variant] / self.counts[variant]
            exploration = math.sqrt(
                2 * math.log(total_counts) / self.counts[variant]
            )
            ucb_scores[variant] = avg_reward + exploration

        return max(ucb_scores, key=ucb_scores.get)

    def update(self, variant, reward):
        """결과 업데이트"""
        self.counts[variant] += 1
        self.rewards[variant] += reward

# 사용
bandit = MultiArmedBandit(['A', 'B', 'C'])

for _ in range(1000):
    variant = bandit.select_variant()
    # 사용자에게 변형 표시
    reward = get_conversion(variant)  # 0 or 1
    bandit.update(variant, reward)
```

## 🚨 A/B Testing 함정

### ❌ 흔한 실수

```python
# 1. 너무 빨리 종료
bad_practice_1 = {
    "테스트 시작": "월요일",
    "유의미한 결과": "화요일 발견",
    "즉시 종료": "❌ 잘못됨!"
}
# → 요일 효과 고려 안 함
# → 최소 1주일 이상 테스트

# 2. 여러 지표 동시 테스트
bad_practice_2 = {
    "지표들": ["클릭률", "가입률", "구매율", "체류시간", ...],
    "하나라도 유의미하면": "성공으로 간주"
}
# ❌ Multiple Comparison Problem
# → 거짓 양성 증가
# → 주요 지표 하나만 선택

# 3. 피킹 (Peeking)
bad_practice_3 = """
매일 결과 확인하며:
"오늘은 B가 이기네? 종료!"
"""
# ❌ 조기 종료 편향
# → 샘플 크기 도달할 때까지 기다리기

# 4. 샘플 크기 무시
bad_practice_4 = {
    "필요 샘플": 10000,
    "실제 샘플": 500,
    "종료 이유": "일주일 지났으니까"
}
# ❌ 통계적 파워 부족
# → 충분한 샘플 확보 필수

# 5. 세그먼트 과다 분석
bad_practice_5 = """
A가 전체적으로 졌지만...
- iOS에서는 이겼네?
- 25-30세는 이겼네?
- 화요일에는 이겼네?
"""
# ❌ P-hacking
# → 사전에 세그먼트 정의
```

### ✅ 올바른 방법

```python
# 1. 사전 계획
good_practice_1 = {
    "가설": "녹색 버튼이 클릭률을 20% 향상시킨다",
    "주요 지표": "클릭률 (CTR)",
    "샘플 크기": 10000,
    "기간": "최소 2주",
    "유의수준": 0.05
}

# 2. 단일 주요 지표
good_practice_2 = {
    "primary_metric": "전환율",
    "secondary_metrics": ["클릭률", "체류시간"],  # 참고용
    "decision_based_on": "primary_metric만"
}

# 3. 미리 정한 종료 조건
good_practice_3 = """
종료 조건:
1. 샘플 크기 도달 (10,000명)
2. 최소 기간 경과 (2주)
3. 통계적 유의성 (p < 0.05)

모두 충족 시에만 종료
"""

# 4. AA 테스트로 검증
aa_test = {
    "목적": "시스템 검증",
    "방법": "동일한 A 버전을 A/B로 분할",
    "기대": "유의미한 차이 없어야 함",
    "발견 시": "시스템 문제 해결"
}
```

## 🔗 관련 용어

- [[KPI]]: A/B 테스트의 성공 지표
- [[MVP]]: A/B 테스트로 검증
- [[PMF]]: A/B 테스트로 개선
- [[Product Roadmap]]: 테스트 결과 반영
- [[Analytics]]: 테스트 데이터 분석

## 📝 정리

**A/B Testing의 핵심**:
```
A/B Testing = 데이터 기반 의사결정
→ 추측 대신 실험
→ 통제된 환경
→ 통계적 검증
```

**프로세스**:
```
1. 가설 수립
2. 변수 설정
3. 샘플 크기 계산
4. 테스트 실행
5. 데이터 분석
6. 의사결정
```

**핵심 원칙**:
```
✅ 한 번에 하나씩 테스트
✅ 충분한 샘플 크기
✅ 적절한 테스트 기간
✅ 통계적 유의성 확인
✅ 세그먼트 사전 정의
```

**비유로 기억하기**:
```
A/B Testing = 요리 레시피 실험
→ A 레시피 vs B 레시피
→ 같은 조건에서 테스트
→ 맛평가 (데이터)
→ 더 맛있는 것 선택

"측정할 수 없으면 개선할 수 없다"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
