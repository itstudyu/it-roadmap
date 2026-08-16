# Backlog (백로그)

## 📝 정의

Backlog은 **구현해야 할 기능, 개선사항, 버그를 우선순위 순으로 정리한 목록**입니다. 제품 개발의 대기열이자 계획입니다.

### 핵심 개념

- **무엇인가?**: 할 일 목록 (To-Do List)
- **왜 필요한가?**: 우선순위 관리, 투명성
- **누가 관리하나?**: Product Owner, PM

### Backlog가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 요청 난무
영업: "A 기능 급해요!"
마케팅: "B 기능 필요해요!"
CEO: "C 기능 만들어주세요!"
개발: "뭐부터 해야 하죠?" 😱

😱 시나리오 2: 아이디어 소실
회의에서: "좋은 아이디어네요!"
2주 후: "그게 뭐였더라?" 😱
→ 기록 없이 사라짐!

😱 시나리오 3: 중복 작업
개발자 A: "로그인 기능 만들었어요"
개발자 B: "저도 로그인 만들었는데..." 😱
→ 중복! 낭비!
```

**Backlog의 해결**:
```
✅ 시나리오 1: 우선순위 명확
Backlog:
1. 🔴 P0: 보안 취약점 수정
2. 🟡 P1: 결제 시스템
3. 🟢 P2: 다크 모드
→ 무엇부터 할지 명확! ✅

✅ 시나리오 2: 모든 아이디어 기록
Backlog에 추가:
- "AI 추천 기능" (나중에)
- "소셜 공유" (검토 중)
→ 아이디어 보존! ✅

✅ 시나리오 3: 투명한 작업 현황
Backlog 보면:
→ 누가 무엇을 하는지
→ 중복 방지
→ 협업 원활! ✅
```

## 💡 Backlog 종류

### 1. Product Backlog (제품 백로그)

```python
"""
전체 제품의 모든 요구사항

특징:
- Product Owner가 관리
- 우선순위대로 정렬
- 계속 변화함 (Living Document)
"""

product_backlog = [
    {
        "id": "PB-001",
        "title": "소셜 로그인",
        "priority": "P0",
        "story_points": 8,
        "status": "Ready",
        "sprint": None
    },
    {
        "id": "PB-002",
        "title": "비밀번호 재설정",
        "priority": "P0",
        "story_points": 5,
        "status": "Ready",
        "sprint": None
    },
    {
        "id": "PB-003",
        "title": "다크 모드",
        "priority": "P2",
        "story_points": 13,
        "status": "Backlog",
        "sprint": None
    }
]

# 우선순위대로 정렬
sorted_backlog = sorted(
    product_backlog,
    key=lambda x: (x['priority'], -x['story_points'])
)

print("Product Backlog (우선순위 순):")
for item in sorted_backlog:
    print(f"{item['priority']} {item['title']} ({item['story_points']}SP)")
```

### 2. Sprint Backlog (스프린트 백로그)

```python
"""
현재 Sprint에서 구현할 항목들

특징:
- Sprint Planning에서 선정
- Sprint 동안 변경 안 함
- 팀이 관리
"""

sprint_backlog = [
    {
        "id": "PB-001",
        "title": "소셜 로그인",
        "status": "In Progress",
        "assignee": "김개발",
        "remaining_hours": 12
    },
    {
        "id": "PB-002",
        "title": "비밀번호 재설정",
        "status": "To Do",
        "assignee": "이개발",
        "remaining_hours": 16
    }
]

# Sprint Burndown
total_points = sum(item['remaining_hours'] for item in sprint_backlog)
print(f"Sprint 남은 시간: {total_points}h")
```

## 🎯 Backlog 관리 (Grooming)

### Backlog Refinement

```python
class BacklogRefinement:
    """백로그 정제 프로세스"""

    def __init__(self):
        self.backlog = []

    def add_item(self, item):
        """새 항목 추가"""
        self.backlog.append({
            **item,
            'created_at': datetime.now(),
            'status': 'New'
        })

    def refine_item(self, item_id):
        """항목 정제"""
        steps = [
            "1. User Story 명확화",
            "2. Acceptance Criteria 작성",
            "3. Story Point 추정",
            "4. 의존성 확인",
            "5. Ready 상태로 변경"
        ]

        print(f"\n정제 중: {item_id}")
        for step in steps:
            print(f"  {step}")

    def prioritize(self):
        """우선순위 결정"""
        # RICE 스코어링
        for item in self.backlog:
            rice = (
                item['reach'] *
                item['impact'] *
                item['confidence']
            ) / item['effort']

            item['rice_score'] = rice
            item['priority'] = self._calculate_priority(rice)

        # 정렬
        self.backlog.sort(
            key=lambda x: x['rice_score'],
            reverse=True
        )

    def _calculate_priority(self, rice_score):
        """우선순위 레벨 계산"""
        if rice_score >= 100:
            return "P0"
        elif rice_score >= 50:
            return "P1"
        else:
            return "P2"

# 사용
refinement = BacklogRefinement()

# 항목 추가
refinement.add_item({
    'title': '푸시 알림',
    'reach': 1000,      # 영향받는 사용자 수
    'impact': 3,        # 영향도 (1-3)
    'confidence': 0.8,  # 확신도 (0-1)
    'effort': 5         # 노력 (Story Points)
})

# 정제 및 우선순위 결정
refinement.refine_item('푸시 알림')
refinement.prioritize()
```

## 🔍 우선순위 결정 방법

### 1. MoSCoW 방법

```python
"""
Must have: 반드시 필요
Should have: 있으면 좋음
Could have: 있어도 됨
Won't have: 하지 않음
"""

moscow_backlog = {
    "Must have": [
        "사용자 인증",
        "결제 시스템",
        "상품 검색"
    ],
    "Should have": [
        "위시리스트",
        "리뷰 기능",
        "추천 시스템"
    ],
    "Could have": [
        "소셜 공유",
        "다크 모드",
        "음성 검색"
    ],
    "Won't have": [
        "VR 지원",
        "블록체인 통합"
    ]
}

print("MoSCoW 우선순위:")
for category, items in moscow_backlog.items():
    print(f"\n{category}:")
    for item in items:
        print(f"  - {item}")
```

### 2. RICE 스코어링

```python
def calculate_rice(reach, impact, confidence, effort):
    """
    RICE Score 계산

    Reach: 도달 범위 (affected users)
    Impact: 영향도 (0.25, 0.5, 1, 2, 3)
    Confidence: 확신도 (0-100%)
    Effort: 노력 (person-months)
    """
    return (reach * impact * confidence) / effort

# 예시
features = [
    {
        "name": "소셜 로그인",
        "reach": 10000,    # 10,000명 사용 예상
        "impact": 2,       # 큰 영향
        "confidence": 0.9, # 90% 확신
        "effort": 2        # 2 person-months
    },
    {
        "name": "다크 모드",
        "reach": 5000,
        "impact": 0.5,     # 작은 영향
        "confidence": 1.0, # 100% 확신
        "effort": 1
    },
    {
        "name": "AI 추천",
        "reach": 15000,
        "impact": 3,       # 매우 큰 영향
        "confidence": 0.5, # 50% 확신
        "effort": 6
    }
]

# RICE 계산 및 정렬
for feature in features:
    feature['rice'] = calculate_rice(
        feature['reach'],
        feature['impact'],
        feature['confidence'],
        feature['effort']
    )

sorted_features = sorted(
    features,
    key=lambda x: x['rice'],
    reverse=True
)

print("RICE 우선순위:")
for f in sorted_features:
    print(f"{f['name']}: {f['rice']:.0f}")

# 출력:
# 소셜 로그인: 9000
# AI 추천: 3750
# 다크 모드: 2500
```

### 3. Value vs Effort 매트릭스

```python
import matplotlib.pyplot as plt

features = [
    {"name": "소셜 로그인", "value": 9, "effort": 3},
    {"name": "검색 기능", "value": 8, "effort": 5},
    {"name": "다크 모드", "value": 4, "effort": 2},
    {"name": "VR 지원", "value": 2, "effort": 9},
    {"name": "푸시 알림", "value": 7, "effort": 3}
]

# 시각화
plt.figure(figsize=(10, 8))

for f in features:
    plt.scatter(f['effort'], f['value'], s=200)
    plt.annotate(
        f['name'],
        (f['effort'], f['value']),
        ha='center',
        va='bottom'
    )

# 사분면
plt.axvline(x=5.5, color='gray', linestyle='--')
plt.axhline(y=5.5, color='gray', linestyle='--')

plt.text(2, 8.5, "Quick Wins\n(높은 가치, 낮은 노력)",
         fontsize=11, color='green', weight='bold')
plt.text(7, 8.5, "Big Bets\n(높은 가치, 높은 노력)",
         fontsize=11, color='blue', weight='bold')
plt.text(2, 2, "Fill-ins\n(낮은 가치, 낮은 노력)",
         fontsize=11, color='orange')
plt.text(7, 2, "Money Pits\n(낮은 가치, 높은 노력)",
         fontsize=11, color='red', weight='bold')

plt.xlabel("Effort (노력)")
plt.ylabel("Value (가치)")
plt.title("Feature Prioritization Matrix")
plt.grid(True, alpha=0.3)
plt.savefig("backlog_matrix.png")
```

## 💻 Backlog 도구

### Jira Backlog

```python
from jira import JIRA

# Jira 연결
jira = JIRA('https://your-company.atlassian.net',
            basic_auth=('email', 'token'))

# Backlog 조회
backlog = jira.search_issues(
    'project = PROJ AND status = "Backlog"',
    maxResults=50,
    fields='summary,priority,story_points'
)

print("Product Backlog:")
for issue in backlog:
    print(f"{issue.key}: {issue.fields.summary}")
    print(f"  Priority: {issue.fields.priority.name}")
    print(f"  Story Points: {issue.fields.customfield_10016}\n")

# Sprint Backlog로 이동
sprint_id = 123
issue = jira.issue('PROJ-100')
jira.add_issues_to_sprint(sprint_id, [issue.key])
```

### 간단한 Backlog 관리

```python
class SimpleBacklog:
    """간단한 백로그 관리 시스템"""

    def __init__(self):
        self.items = []

    def add(self, title, priority="P2", points=None):
        """항목 추가"""
        item = {
            'id': len(self.items) + 1,
            'title': title,
            'priority': priority,
            'points': points,
            'status': 'Backlog',
            'created_at': datetime.now()
        }
        self.items.append(item)
        print(f"✅ 추가됨: {title}")

    def prioritize(self, item_id, new_priority):
        """우선순위 변경"""
        for item in self.items:
            if item['id'] == item_id:
                old = item['priority']
                item['priority'] = new_priority
                print(f"📝 {item['title']}: {old} → {new_priority}")
                break

    def move_to_sprint(self, item_ids, sprint_name):
        """Sprint로 이동"""
        for item_id in item_ids:
            for item in self.items:
                if item['id'] == item_id:
                    item['status'] = f'Sprint: {sprint_name}'
                    print(f"🚀 {item['title']} → {sprint_name}")

    def display(self):
        """백로그 출력"""
        print("\n" + "="*60)
        print("Product Backlog")
        print("="*60)

        # 우선순위별로 그룹화
        by_priority = {}
        for item in self.items:
            pri = item['priority']
            if pri not in by_priority:
                by_priority[pri] = []
            by_priority[pri].append(item)

        # 출력
        for priority in ['P0', 'P1', 'P2']:
            if priority in by_priority:
                print(f"\n{priority}:")
                for item in by_priority[priority]:
                    points = f"({item['points']}SP)" if item['points'] else ""
                    status = f"[{item['status']}]"
                    print(f"  {item['id']}. {item['title']} {points} {status}")

# 사용
backlog = SimpleBacklog()

# 항목 추가
backlog.add("소셜 로그인", "P0", 8)
backlog.add("다크 모드", "P2", 5)
backlog.add("결제 시스템", "P0", 13)
backlog.add("푸시 알림", "P1", 5)

# 우선순위 변경
backlog.prioritize(2, "P1")

# Sprint로 이동
backlog.move_to_sprint([1, 3], "Sprint 10")

# 백로그 출력
backlog.display()
```

## 🚨 Backlog 안티패턴

### ❌ 피해야 할 것

```python
# 1. 백로그 비대화 (Backlog Bloat)
huge_backlog = [f"Feature {i}" for i in range(1, 501)]
# ❌ 500개 항목!
# → 관리 불가
# → 우선순위 무의미

# 해결: 정기적 정리
if len(backlog) > 50:
    remove_low_priority_items()

# 2. 영원한 "나중에"
eternal_backlog = {
    'created': '2020-01-01',
    'status': 'Backlog',  # 4년째 Backlog
    'title': 'VR 지원'
}
# ❌ 영원히 안 하는 항목
# → 삭제하거나 결정

# 3. 우선순위 없음
no_priority = [
    {'title': 'A', 'priority': 'P1'},
    {'title': 'B', 'priority': 'P1'},
    {'title': 'C', 'priority': 'P1'},  # 모두 P1?
]
# ❌ 모든 것이 우선순위
# → 우선순위 아님

# 4. 세부사항 없음
vague_item = {
    'title': '시스템 개선',  # ❌ 뭘?
    'description': None,
    'criteria': None
}
```

### ✅ 좋은 관행

```python
# 1. 적절한 크기 유지
max_backlog_size = 30-50  # ✅

# 2. 정기적 정리
def monthly_backlog_cleanup():
    """매월 백로그 정리"""
    # 6개월 이상 된 낮은 우선순위 항목 삭제
    # 중복 항목 병합
    # 완료된 항목 아카이브

# 3. 명확한 우선순위
# P0: 3-5개만
# P1: 10-15개
# P2: 나머지

# 4. 상세한 정보
good_item = {
    'title': '소셜 로그인',
    'description': 'As a user, I want to...',
    'acceptance_criteria': [...],
    'story_points': 8,
    'dependencies': [],
    'status': 'Ready'
}
```

## 🔗 관련 용어

- [[User Story]]: Backlog의 항목
- [[Sprint]]: Backlog에서 선택하여 실행
- [[Agile]]: Backlog를 사용하는 방법론
- [[Product Roadmap]]: Backlog의 장기 계획
- [[MVP]]: Backlog의 핵심 항목

## 📝 정리

**Backlog의 핵심**:
```
Backlog = 할 일 목록
→ 우선순위로 정렬
→ 지속적 정제
→ 투명한 관리
```

**종류**:
```
Product Backlog: 전체 요구사항
Sprint Backlog: 현재 Sprint 작업
```

**관리 원칙**:
```
✅ 우선순위 명확
✅ 정기적 정제 (Grooming)
✅ 적절한 크기 유지
✅ 상세 정보 포함
✅ 팀과 투명하게 공유
```

**비유로 기억하기**:
```
Backlog = 식당 주문 대기표
→ 번호순 (우선순위)
→ 새 주문 계속 추가
→ 완료되면 제거
→ 모두가 볼 수 있음

"무엇을 만들지, 언제 만들지"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
