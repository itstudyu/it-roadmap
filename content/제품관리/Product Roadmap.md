# Product Roadmap (제품 로드맵)

## 📝 정의

Product Roadmap은 **제품의 비전, 방향, 우선순위를 시간 순으로 보여주는 전략 문서**입니다. 제품의 미래를 계획하고 이해관계자와 소통하는 핵심 도구입니다.

### 핵심 개념

- **무엇인가?**: 제품 개발 계획의 시각적 표현
- **왜 필요한가?**: 팀 정렬, 우선순위 결정, 기대치 관리
- **누가 만드나?**: Product Manager, PDMO

### Product Roadmap이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 방향성 부재
개발팀: "다음에 뭐 만들어야 하죠?"
디자이너: "어떤 기능이 우선순위인가요?"
경영진: "올해 목표가 뭐죠?"
→ 팀이 뿔뿔이 흩어짐! 😱

😱 시나리오 2: 요청 폭주
영업팀: "고객이 A 기능 요청했어요!"
마케팅: "B 기능 급해요!"
CEO: "C 기능 먼저 해주세요!"
→ 우선순위 없이 모든 것 동시 진행! 😱

😱 시나리오 3: 기대치 불일치
경영진: "Q1에 완성될 거죠?"
개발팀: "그건 Q3 계획인데요..."
→ 커뮤니케이션 실패! 😱
```

**Roadmap의 해결**:
```
✅ 시나리오 1: 명확한 방향
로드맵으로 모두가 같은 그림 확인
Q1: 사용자 인증 강화
Q2: 결제 시스템 개선
Q3: AI 추천 기능
→ 전체 팀이 같은 방향! ✅

✅ 시나리오 2: 우선순위 명확
로드맵에 우선순위 표시
지금: MVP 기능
다음: 성장 기능
나중: Nice-to-have
→ 집중 가능! ✅

✅ 시나리오 3: 현실적 기대
로드맵으로 일정 공유
Q1: 기본 기능 (80%)
Q2: 고급 기능 (20%)
→ 일정 투명성! ✅
```

## 💡 Roadmap 유형

### 1. Feature-based Roadmap (기능 중심)

```
시간축에 따라 출시될 기능 나열

Q1 2024:
  ✓ 소셜 로그인
  ✓ 프로필 사진 업로드
  ✓ 알림 기능

Q2 2024:
  → 친구 추가
  → 메시지 기능
  → 그룹 생성

장점: 구체적, 이해하기 쉬움
단점: 유연성 낮음, 변경 시 혼란
```

### 2. Theme-based Roadmap (테마 중심)

```
전략적 목표를 테마로 표현

Q1: "사용자 참여도 향상"
  - 알림 시스템
  - 게임화 요소
  - 소셜 기능

Q2: "수익화"
  - 프리미엄 구독
  - 광고 시스템
  - 기업 요금제

장점: 유연함, 전략적
단점: 덜 구체적
```

### 3. Now-Next-Later Roadmap

```
시간보다 우선순위 중심

NOW (진행 중):
  ✓ 모바일 앱 성능 개선
  ✓ 버그 수정

NEXT (다음):
  → AI 추천 기능
  → 다크 모드

LATER (향후):
  → VR 지원
  → 블록체인 연동

장점: 유연성 최고, 애자일 친화적
단점: 일정 불명확
```

### 4. Outcome-based Roadmap (결과 중심)

```
비즈니스 결과에 집중

목표: "사용자 유지율 20% 증가"
방법:
  - 개인화 기능
  - 푸시 알림 최적화
  - 리워드 프로그램

목표: "매출 50% 증가"
방법:
  - 프리미엄 기능
  - 기업용 패키지
  - 마켓플레이스

장점: 비즈니스 가치 명확
단점: 실행 계획 추상적
```

## 🎯 Roadmap 작성 프로세스

### 1. 전략 수립

```python
# 로드맵 작성 단계

class RoadmapPlanning:
    """로드맵 계획 프로세스"""

    def step1_vision(self):
        """1단계: 비전 정의"""
        vision = """
        향후 1-3년 제품의 모습

        예시:
        "전 세계 1억 사용자가 사용하는
         AI 기반 개인 생산성 플랫폼"
        """
        return vision

    def step2_goals(self):
        """2단계: 목표 설정"""
        goals = [
            "사용자 기반 확대 (100만 → 500만)",
            "매출 성장 (3배 증가)",
            "시장 점유율 1위"
        ]
        return goals

    def step3_themes(self):
        """3단계: 테마 선정"""
        themes = {
            "Q1": "사용자 경험 개선",
            "Q2": "AI 기능 강화",
            "Q3": "글로벌 확장",
            "Q4": "수익화"
        }
        return themes

    def step4_initiatives(self):
        """4단계: 이니셔티브 정의"""
        initiatives = [
            {
                "theme": "사용자 경험 개선",
                "initiatives": [
                    "UI 리뉴얼",
                    "성능 최적화",
                    "접근성 개선"
                ]
            },
            {
                "theme": "AI 기능 강화",
                "initiatives": [
                    "AI 추천 알고리즘",
                    "자동 분류",
                    "스마트 검색"
                ]
            }
        ]
        return initiatives

    def step5_prioritize(self, initiatives):
        """5단계: 우선순위 결정"""
        # RICE 스코어링
        scored_initiatives = []
        for init in initiatives:
            rice_score = (
                init['reach'] *
                init['impact'] *
                init['confidence']
            ) / init['effort']

            scored_initiatives.append({
                'name': init['name'],
                'score': rice_score
            })

        # 점수순 정렬
        return sorted(
            scored_initiatives,
            key=lambda x: x['score'],
            reverse=True
        )
```

### 2. 우선순위 매트릭스

```python
import matplotlib.pyplot as plt
import numpy as np

# Impact vs Effort 매트릭스
features = [
    {"name": "AI 추천", "impact": 9, "effort": 8},
    {"name": "다크 모드", "impact": 5, "effort": 2},
    {"name": "소셜 로그인", "impact": 7, "effort": 3},
    {"name": "VR 지원", "impact": 3, "effort": 9},
    {"name": "알림 기능", "impact": 8, "effort": 4}
]

# 시각화
plt.figure(figsize=(10, 8))

for feature in features:
    plt.scatter(
        feature['effort'],
        feature['impact'],
        s=200
    )
    plt.annotate(
        feature['name'],
        (feature['effort'], feature['impact']),
        ha='center'
    )

# 사분면 구분선
plt.axvline(x=5.5, color='gray', linestyle='--')
plt.axhline(y=5.5, color='gray', linestyle='--')

# 사분면 레이블
plt.text(2, 8.5, "Quick Wins", fontsize=12, color='green')
plt.text(7, 8.5, "Big Bets", fontsize=12, color='blue')
plt.text(2, 2, "Fill-ins", fontsize=12, color='orange')
plt.text(7, 2, "Time Sinks", fontsize=12, color='red')

plt.xlabel("Effort (낮음 → 높음)")
plt.ylabel("Impact (낮음 → 높음)")
plt.title("Feature Prioritization Matrix")
plt.grid(True, alpha=0.3)
plt.savefig("prioritization.png")

"""
Quick Wins (낮은 노력, 높은 임팩트): 먼저!
Big Bets (높은 노력, 높은 임팩트): 계획적으로
Fill-ins (낮은 노력, 낮은 임팩트): 여유 시
Time Sinks (높은 노력, 낮은 임팩트): 피하기
"""
```

## 🔍 실전 예시

### Notion 스타일 Roadmap

```markdown
# 2024 제품 로드맵

## Q1: Foundation (기반 구축)
**목표**: 사용자 경험 개선 및 안정성 확보

| 기능 | 우선순위 | 상태 | 담당자 |
|------|----------|------|--------|
| 성능 최적화 | P0 | ✅ 완료 | 개발팀 |
| 모바일 반응형 | P0 | 🚧 진행중 | 디자인팀 |
| 다크 모드 | P1 | 📋 계획 | 디자인팀 |

## Q2: Growth (성장)
**목표**: 사용자 확대 및 참여도 증가

| 기능 | 우선순위 | 상태 | 담당자 |
|------|----------|------|--------|
| 소셜 공유 | P0 | 📋 계획 | 개발팀 |
| 추천 시스템 | P1 | 📋 계획 | AI팀 |
| 게임화 요소 | P2 | 📋 계획 | 기획팀 |

## Q3: Monetization (수익화)
**목표**: 지속 가능한 비즈니스 모델 구축

## Q4: Scale (확장)
**목표**: 글로벌 시장 진출
```

### Jira Roadmap

```python
# Jira API를 통한 로드맵 생성

from jira import JIRA

jira = JIRA('https://your-company.atlassian.net',
            basic_auth=('email', 'api_token'))

# Epic 생성 (테마별)
epics = [
    {
        'summary': 'Q1: 사용자 경험 개선',
        'description': '모바일 최적화 및 성능 개선',
        'labels': ['Q1-2024', 'UX']
    },
    {
        'summary': 'Q2: AI 기능 추가',
        'description': '추천 알고리즘 및 스마트 검색',
        'labels': ['Q2-2024', 'AI']
    }
]

for epic_data in epics:
    epic = jira.create_issue(
        project='PROD',
        summary=epic_data['summary'],
        description=epic_data['description'],
        issuetype={'name': 'Epic'},
        labels=epic_data['labels']
    )
    print(f"Epic 생성: {epic.key}")

# Story 생성
stories = [
    {
        'summary': '모바일 UI 반응형 개선',
        'epic_link': 'PROD-1',  # Q1 Epic
        'story_points': 8,
        'priority': 'Highest'
    }
]
```

## 🚨 로드맵 실수

### ❌ 하지 말아야 할 것

```python
# 1. 지나치게 구체적인 날짜
bad_roadmap = {
    "2024-03-15": "로그인 기능 완료",  # ❌ 너무 구체적
    "2024-03-20": "결제 시스템 런칭"   # ❌ 변경 시 신뢰 하락
}

# 2. 너무 많은 항목
bad_roadmap = {
    "Q1": [
        "기능1", "기능2", "기능3", ..., "기능50"  # ❌ 집중력 분산
    ]
}

# 3. 이유 없는 기능 나열
bad_roadmap = {
    "Q1": ["VR 지원", "블록체인", "AI"]  # ❌ Why? 전략은?
}

# 4. 업데이트 안 함
roadmap_last_updated = "2022-01-01"  # ❌ 2년 전 로드맵
```

### ✅ 해야 할 것

```python
# 1. 유연한 시간 표현
good_roadmap = {
    "Now": "사용자 인증",
    "Next": "결제 시스템",
    "Later": "AI 기능"
}

# 2. 집중된 우선순위
good_roadmap = {
    "Q1": ["핵심 기능 1", "핵심 기능 2", "핵심 기능 3"]  # ✅ 3-5개
}

# 3. 전략적 근거
good_roadmap = {
    "Q1": {
        "theme": "사용자 유지율 개선",
        "why": "Churn Rate 30% → 10% 목표",
        "features": ["알림", "개인화", "리워드"]
    }
}

# 4. 정기 업데이트
def update_roadmap_monthly():
    """매월 로드맵 검토 및 업데이트"""
    review_progress()
    adjust_priorities()
    communicate_changes()
```

## 💻 로드맵 도구

### ProductPlan 스타일

```python
# 간단한 로드맵 생성기

class SimpleRoadmap:
    """간단한 로드맵 시각화"""

    def __init__(self):
        self.quarters = {
            "Q1": [],
            "Q2": [],
            "Q3": [],
            "Q4": []
        }

    def add_feature(self, quarter, name, priority, team):
        """기능 추가"""
        self.quarters[quarter].append({
            "name": name,
            "priority": priority,
            "team": team
        })

    def display(self):
        """로드맵 출력"""
        print("=" * 60)
        print("2024 Product Roadmap")
        print("=" * 60)

        for quarter, features in self.quarters.items():
            print(f"\n{quarter}")
            print("-" * 60)

            for feature in features:
                priority_symbol = {
                    "P0": "🔴",
                    "P1": "🟡",
                    "P2": "🟢"
                }.get(feature['priority'], "⚪")

                print(f"{priority_symbol} {feature['name']}")
                print(f"   Team: {feature['team']}")

# 사용
roadmap = SimpleRoadmap()
roadmap.add_feature("Q1", "모바일 최적화", "P0", "개발팀")
roadmap.add_feature("Q1", "다크 모드", "P1", "디자인팀")
roadmap.add_feature("Q2", "AI 추천", "P0", "AI팀")
roadmap.display()
```

## 🔗 관련 용어

- [[MVP]]: 로드맵의 첫 단계
- [[OKR]]: 로드맵의 목표 설정
- [[Agile]]: 로드맵 실행 방법론
- [[Sprint]]: 로드맵의 실행 단위
- [[Backlog]]: 로드맵의 상세 항목

## 📝 정리

**Product Roadmap의 핵심**:
```
Roadmap = 제품의 전략적 계획
→ 방향 제시
→ 우선순위 결정
→ 기대치 관리
→ 팀 정렬
```

**좋은 로드맵 조건**:
```
✅ 전략과 연결됨
✅ 유연함 (변경 가능)
✅ 명확한 우선순위
✅ 정기적 업데이트
✅ 이해관계자 동의
```

**로드맵 유형**:
```
Feature-based: 구체적 기능
Theme-based: 전략적 테마
Now-Next-Later: 우선순위 중심
Outcome-based: 비즈니스 결과
```

**비유로 기억하기**:
```
Roadmap = 여행 계획
→ 목적지: 비전
→ 경로: 전략
→ 체크포인트: 마일스톤
→ 여행 동반자: 팀

"지도 없이 여행하지 마라"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
