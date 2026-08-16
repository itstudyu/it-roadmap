# Funnel (퍼널, 전환 깔때기)

## 📝 정의

Funnel은 **사용자가 최종 목표(전환)에 도달하기까지 거치는 단계적 과정**입니다. 각 단계마다 사용자가 이탈하는 모습이 깔때기처럼 보여서 Funnel이라고 합니다.

### 핵심 개념

- **무엇인가?**: 사용자 여정의 단계별 전환율
- **왜 필요한가?**: 어디서 사용자가 이탈하는지 파악
- **형태**: 넓은 입구 → 좁은 출구 (깔때기 모양)

### Funnel이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 높은 이탈률
100명 방문 → 1명만 구매
"왜 안 사지?" 🤷
→ 어디서 이탈하는지 모름! 😱

😱 시나리오 2: 개선 포인트 불명확
"전환율을 올려야 하는데..."
→ 뭘 개선해야 할까? 😱
→ 전체가 문제? 특정 단계 문제?

😱 시나리오 3: 예산 낭비
마케팅 비용: 1,000만원
→ 방문자는 많은데 구매 없음
→ 돈만 날림! 😱
```

**Funnel의 해결**:
```
✅ 시나리오 1: 이탈 지점 발견
단계별 전환율:
- 방문 → 가입: 50% (100 → 50)
- 가입 → 상품 조회: 40% (50 → 20)
- 조회 → 장바구니: 70% (20 → 14)
- 장바구니 → 구매: 7% (14 → 1) ← 문제!

→ 결제 단계가 문제! ✅

✅ 시나리오 2: 개선 우선순위
가장 이탈 높은 단계 = 결제 (7%)
→ 결제 프로세스 개선 집중! ✅
→ 7% → 20%만 올려도 3배 증가!

✅ 시나리오 3: ROI 개선
문제: 방문자는 많은데 전환 낮음
해결: 퍼널 하단 개선
→ 같은 트래픽으로 3배 매출! ✅
```

## 💡 주요 Funnel 유형

### 1. AARRR (Pirate Metrics)

```python
"""
스타트업 필수 지표 (해적 지표)
"""

aarrr_funnel = {
    "Acquisition (획득)": {
        "정의": "사용자가 우리를 어떻게 찾는가?",
        "지표": [
            "방문자 수",
            "채널별 유입",
            "CAC (고객 획득 비용)"
        ],
        "예시": "Google 검색 → 블로그 → 홈페이지"
    },

    "Activation (활성화)": {
        "정의": "첫 경험이 좋은가?",
        "지표": [
            "가입률",
            "온보딩 완료율",
            "첫 핵심 기능 사용률"
        ],
        "예시": "가입 → 프로필 설정 → 첫 게시물 작성"
    },

    "Retention (유지)": {
        "정의": "다시 돌아오는가?",
        "지표": [
            "DAU/MAU",
            "재방문율",
            "Churn Rate"
        ],
        "예시": "일주일 후 재방문"
    },

    "Revenue (수익)": {
        "정의": "돈을 쓰는가?",
        "지표": [
            "전환율",
            "ARPU (사용자당 평균 수익)",
            "LTV"
        ],
        "예시": "무료 → 유료 전환"
    },

    "Referral (추천)": {
        "정의": "다른 사람에게 추천하는가?",
        "지표": [
            "바이럴 계수",
            "초대 수",
            "NPS"
        ],
        "예시": "친구 초대 → 신규 가입"
    }
}

# 각 단계 출력
for stage, info in aarrr_funnel.items():
    print(f"\n{stage}")
    print(f"  정의: {info['정의']}")
    print(f"  지표: {', '.join(info['지표'])}")
```

### 2. E-commerce Funnel

```python
"""
이커머스 구매 퍼널
"""

ecommerce_funnel = [
    {
        "단계": "1. 방문",
        "사용자": 10000,
        "전환율": 100,
        "액션": "홈페이지 접속"
    },
    {
        "단계": "2. 상품 조회",
        "사용자": 3000,
        "전환율": 30,
        "액션": "상품 상세 페이지 보기"
    },
    {
        "단계": "3. 장바구니",
        "사용자": 900,
        "전환율": 30,
        "액션": "장바구니 추가"
    },
    {
        "단계": "4. 결제 시작",
        "사용자": 450,
        "전환율": 50,
        "액션": "결제 페이지 진입"
    },
    {
        "단계": "5. 구매 완료",
        "사용자": 270,
        "전환율": 60,
        "액션": "결제 완료"
    }
]

print("E-commerce Funnel:")
for step in ecommerce_funnel:
    print(f"{step['단계']}: {step['사용자']:,}명 ({step['전환율']}%)")

# 출력:
# 1. 방문: 10,000명 (100%)
# 2. 상품 조회: 3,000명 (30%)
# 3. 장바구니: 900명 (30%)
# 4. 결제 시작: 450명 (50%)
# 5. 구매 완료: 270명 (60%)

# 최종 전환율: 2.7%
```

### 3. SaaS Funnel

```python
"""
SaaS 제품 퍼널
"""

saas_funnel = {
    "1. 인지": {
        "액션": "광고/블로그 발견",
        "전환율": "-",
        "목표": "브랜드 인지"
    },
    "2. 관심": {
        "액션": "홈페이지 방문",
        "전환율": "5%",
        "목표": "가치 이해"
    },
    "3. 평가": {
        "액션": "무료 체험 시작",
        "전환율": "20%",
        "목표": "제품 경험"
    },
    "4. 전환": {
        "액션": "유료 전환",
        "전환율": "25%",
        "목표": "고객 전환"
    },
    "5. 충성": {
        "액션": "장기 사용 + 추천",
        "전환율": "60%",
        "목표": "고객 유지"
    }
}
```

## 🎯 Funnel 분석

### 1. 전환율 계산

```python
def calculate_funnel(data):
    """퍼널 전환율 계산"""

    results = []

    for i, step in enumerate(data):
        if i == 0:
            conversion = 100.0
            drop_off = 0
        else:
            conversion = (step['users'] / data[i-1]['users']) * 100
            drop_off = 100 - conversion

        results.append({
            'step': step['name'],
            'users': step['users'],
            'conversion': f"{conversion:.1f}%",
            'drop_off': f"{drop_off:.1f}%"
        })

    # 전체 전환율
    overall = (data[-1]['users'] / data[0]['users']) * 100

    return {
        'steps': results,
        'overall_conversion': f"{overall:.2f}%"
    }

# 예시
funnel_data = [
    {'name': '방문', 'users': 10000},
    {'name': '가입', 'users': 2000},
    {'name': '활성화', 'users': 1000},
    {'name': '구매', 'users': 200}
]

result = calculate_funnel(funnel_data)

print("Funnel 분석:")
for step in result['steps']:
    print(f"{step['step']}: {step['users']:,}명")
    print(f"  전환율: {step['conversion']}")
    print(f"  이탈률: {step['drop_off']}\n")

print(f"전체 전환율: {result['overall_conversion']}")

# 출력:
# 방문: 10,000명
#   전환율: 100.0%
#   이탈률: 0.0%
#
# 가입: 2,000명
#   전환율: 20.0%
#   이탈률: 80.0%  ← 개선 필요!
# ...
```

### 2. 병목 지점 찾기

```python
def find_bottleneck(funnel_data):
    """가장 이탈이 높은 단계 찾기"""

    bottlenecks = []

    for i in range(1, len(funnel_data)):
        prev = funnel_data[i-1]['users']
        current = funnel_data[i]['users']

        drop_off = ((prev - current) / prev) * 100

        bottlenecks.append({
            'from': funnel_data[i-1]['name'],
            'to': funnel_data[i]['name'],
            'drop_off': drop_off,
            'lost_users': prev - current
        })

    # 이탈률 순 정렬
    sorted_bottlenecks = sorted(
        bottlenecks,
        key=lambda x: x['drop_off'],
        reverse=True
    )

    return sorted_bottlenecks[0]  # 최악의 병목

# 사용
bottleneck = find_bottleneck(funnel_data)

print(f"🚨 가장 큰 병목 지점:")
print(f"{bottleneck['from']} → {bottleneck['to']}")
print(f"이탈률: {bottleneck['drop_off']:.1f}%")
print(f"이탈 사용자: {bottleneck['lost_users']:,}명")
print(f"\n👉 이 단계 개선 우선!")
```

### 3. 시각화

```python
import matplotlib.pyplot as plt

def visualize_funnel(data):
    """퍼널 시각화"""

    steps = [d['name'] for d in data]
    users = [d['users'] for d in data]

    # 퍼널 차트
    fig, ax = plt.subplots(figsize=(10, 6))

    # 막대 그래프 (역순)
    colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800']
    ax.barh(steps, users, color=colors[:len(steps)])

    # 값 표시
    for i, (step, user) in enumerate(zip(steps, users)):
        ax.text(user, i, f' {user:,}명', va='center')

    ax.set_xlabel('사용자 수')
    ax.set_title('Conversion Funnel')
    ax.invert_yaxis()  # 위에서 아래로

    plt.tight_layout()
    plt.savefig('funnel.png')

visualize_funnel(funnel_data)
```

## 🔍 Funnel 최적화

### 1. A/B 테스트로 개선

```python
"""
병목 단계 A/B 테스트
"""

# 문제: 가입 페이지 전환율 20%

ab_test = {
    "A (기존)": {
        "방문자": 5000,
        "가입": 1000,
        "전환율": "20%"
    },
    "B (개선)": {
        "변경사항": [
            "간단한 폼 (이메일만)",
            "소셜 로그인 추가",
            "가입 혜택 강조"
        ],
        "방문자": 5000,
        "가입": 1750,
        "전환율": "35%"  # +75% 개선!
    }
}

# 전체 퍼널에 미치는 영향
before = 10000 * 0.20 * 0.50 * 0.20  # 200명 구매
after = 10000 * 0.35 * 0.50 * 0.20   # 350명 구매

print(f"개선 전: {before}명 구매")
print(f"개선 후: {after}명 구매")
print(f"증가: +{(after-before)/before*100:.0f}%")
```

### 2. 단계 간소화

```python
"""
불필요한 단계 제거
"""

# Before: 5단계
before = {
    "steps": 5,
    "conversion_per_step": 0.6,  # 각 단계 60%
    "overall": 0.6 ** 5  # 7.8%
}

# After: 3단계로 축소
after = {
    "steps": 3,
    "conversion_per_step": 0.6,
    "overall": 0.6 ** 3  # 21.6%
}

print(f"단계 축소 효과:")
print(f"Before (5단계): {before['overall']*100:.1f}%")
print(f"After (3단계): {after['overall']*100:.1f}%")
print(f"개선: +{(after['overall']/before['overall']-1)*100:.0f}%")
```

## 🚨 Funnel 분석 주의사항

### ❌ 흔한 실수

```python
# 1. 너무 많은 단계
too_many_steps = [
    "방문", "홈", "카테고리", "검색", "필터",
    "상품1", "상품2", "비교", "장바구니",
    "쿠폰", "배송", "결제", "완료"
]
# ❌ 13단계! 분석 복잡
# ✅ 핵심 3-5단계로 단순화

# 2. 모든 사용자를 같게 취급
all_users_same = {
    "신규": "첫 방문",
    "재방문": "10번째 방문"
}
# ❌ 행동 패턴 다름
# ✅ 세그먼트별 퍼널 분석

# 3. 시간 무시
no_time_context = {
    "1일차 전환": "5%",
    "30일차 전환": "5%"
}
# ❌ 맥락 다름
# ✅ 시간 기반 퍼널 (Time-based Cohort)
```

### ✅ 모범 사례

```python
good_practices = {
    "핵심 단계만": "3-5개 단계",
    "세그먼트 분석": "신규/재방문 구분",
    "시간 고려": "코호트 분석",
    "정기 모니터링": "주간 리뷰",
    "A/B 테스트": "개선 검증"
}
```

## 🔗 관련 용어

- [[Retention]]: 퍼널의 유지 단계
- [[A B Testing]]: 퍼널 최적화 방법
- [[KPI]]: 퍼널 각 단계 지표
- [[Cohort Analysis]]: 시간별 퍼널 분석
- [[User Journey]]: 퍼널의 상세 여정

## 📝 정리

**Funnel의 핵심**:
```
Funnel = 단계별 전환 과정
→ 넓은 입구 (많은 방문자)
→ 좁은 출구 (적은 전환)
→ 병목 지점 개선
```

**분석 방법**:
```
1. 단계 정의 (3-5개)
2. 각 단계 전환율 측정
3. 병목 지점 찾기
4. A/B 테스트로 개선
5. 전체 전환율 향상
```

**최적화**:
```
✅ 가장 이탈 높은 단계 우선
✅ 불필요한 단계 제거
✅ 각 단계 마찰 감소
✅ 가치 제안 명확화
```

**비유로 기억하기**:
```
Funnel = 물 깔때기
→ 위: 넓음 (많은 물)
→ 아래: 좁음 (적은 물)
→ 구멍 있으면 물 새 나감
→ 구멍 막으면 더 많이 통과

"작은 개선 × 여러 단계 = 큰 성과"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
