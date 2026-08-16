# User Story (사용자 스토리)

## 📝 정의

User Story는 **사용자 관점에서 작성한 기능 요구사항**입니다. 사용자가 "무엇을" "왜" 원하는지를 간결하게 표현합니다.

### 핵심 개념

- **무엇인가?**: 사용자 중심의 기능 설명
- **왜 필요한가?**: 개발자가 사용자 가치 이해
- **형식**: As a [사용자], I want [기능], So that [이유]

### User Story가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 기술 중심 요구사항
요구사항: "OAuth 2.0 기반 인증 시스템 구축"
개발자: "왜 만들어야 하죠?"
→ 목적 불명확! 😱
→ 사용자 가치 모름! 😱

😱 시나리오 2: 지나치게 상세한 명세
100페이지 요구사항 문서
→ 아무도 안 읽음! 😱
→ 시간 낭비! 😱

😱 시나리오 3: 의사소통 단절
기획자: "로그인 기능 만들어주세요"
개발자: (소셜 로그인? 이메일? 2FA?)
→ 세부사항 불명확! 😱
```

**User Story의 해결**:
```
✅ 시나리오 1: 사용자 가치 명확
User Story:
"As a user,
I want to log in with Google,
So that I don't have to remember another password"

→ 목적 명확! ✅
→ 사용자 가치 이해! ✅

✅ 시나리오 2: 간결한 표현
한 장으로 요약
→ 누구나 읽음 ✅
→ 빠른 이해 ✅

✅ 시나리오 3: 대화 촉진
Story는 시작점
→ 팀과 논의
→ 세부사항 협의
→ 공동 이해! ✅
```

## 📊 User Story 형식


### 기본 템플릿

```
As a [사용자 역할],
I want [수행할 작업],
So that [얻을 가치/이유]
```

### 실제 예시

```
✅ 좋은 User Story:

As a busy professional,
I want to save articles for later,
So that I can read them during my commute

(바쁜 직장인으로서,
나중에 읽을 기사를 저장하고 싶다,
출퇴근 시간에 읽을 수 있도록)
```

## 💡 User Story 작성법

### INVEST 원칙

```python
"""
좋은 User Story는 INVEST를 따름
"""

class INVESTCriteria:
    """INVEST 체크리스트"""

    def check_independent(self, story):
        """I - Independent (독립적)"""
        # 다른 스토리와 독립적으로 개발 가능?
        return "다른 스토리에 의존하지 않음"

    def check_negotiable(self, story):
        """N - Negotiable (협상 가능)"""
        # 구현 방법은 유연한가?
        return "How는 열려있고, What만 정의"

    def check_valuable(self, story):
        """V - Valuable (가치 있음)"""
        # 사용자/비즈니스에 가치 제공?
        return "So that 절에 가치 명시"

    def check_estimable(self, story):
        """E - Estimable (추정 가능)"""
        # 개발 시간 추정 가능?
        return "팀이 크기 예상 가능"

    def check_small(self, story):
        """S - Small (작음)"""
        # 한 Sprint 안에 완료 가능?
        return "1-2주 내 완료 가능"

    def check_testable(self, story):
        """T - Testable (테스트 가능)"""
        # 완료 여부 확인 가능?
        return "Acceptance Criteria로 검증"

# 예시
story = """
As a user,
I want to reset my password,
So that I can regain access if I forget it
"""

invest = INVESTCriteria()
print("✅ Independent:", invest.check_independent(story))
print("✅ Negotiable:", invest.check_negotiable(story))
print("✅ Valuable:", invest.check_valuable(story))
print("✅ Estimable:", invest.check_estimable(story))
print("✅ Small:", invest.check_small(story))
print("✅ Testable:", invest.check_testable(story))
```

### Acceptance Criteria (인수 기준)

```python
"""
User Story의 완료 조건
"""

story = """
As a user,
I want to search for products,
So that I can find what I need quickly
"""

acceptance_criteria = """
Acceptance Criteria:
✓ Given I am on the homepage
  When I enter a search term
  Then I see relevant products

✓ Given I search for "laptop"
  When no results are found
  Then I see "No results" message

✓ Given I search for products
  When I get results
  Then I can sort by price/rating

✓ Given I perform a search
  When results load
  Then it completes within 2 seconds
"""

print(story)
print("\n" + acceptance_criteria)
```

## 1. 장바구니 기능

**User Story:**
As a shopper,
I want to add items to a cart,
So that I can purchase multiple items at once

**Acceptance Criteria:**
- [ ] 상품 페이지에서 "장바구니에 추가" 버튼 표시
- [ ] 버튼 클릭 시 즉시 장바구니에 추가
- [ ] 장바구니 아이콘에 아이템 개수 표시
- [ ] 동일 상품 추가 시 수량 증가

**Story Points:** 5
**Priority:** High
**Sprint:** Sprint 12

---

## 2. 위시리스트 기능

**User Story:**
As a shopper,
I want to save items to a wishlist,
So that I can buy them later

**Acceptance Criteria:**
- [ ] 상품 페이지에 하트 아이콘 표시
- [ ] 클릭 시 위시리스트에 저장
- [ ] 마이페이지에서 위시리스트 확인 가능
- [ ] 위시리스트에서 장바구니로 이동 가능

**Story Points:** 3
**Priority:** Medium
**Sprint:** Sprint 13
```

### SaaS 제품 예시

```python
# Jira/Notion 스타일 User Story

user_stories = [
    {
        "id": "US-101",
        "title": "소셜 로그인",
        "story": """
        As a new user,
        I want to sign up with Google,
        So that I don't have to create another account
        """,
        "acceptance_criteria": [
            "Google OAuth 버튼 표시",
            "클릭 시 Google 로그인 페이지로 이동",
            "인증 성공 시 자동 회원가입",
            "프로필 정보 자동 입력"
        ],
        "priority": "P0",
        "points": 8,
        "assignee": "개발팀",
        "status": "In Progress"
    },
    {
        "id": "US-102",
        "title": "대시보드 커스터마이징",
        "story": """
        As a power user,
        I want to customize my dashboard layout,
        So that I can see the metrics I care about
        """,
        "acceptance_criteria": [
            "위젯 드래그 앤 드롭 가능",
            "위젯 크기 조절 가능",
            "레이아웃 저장 및 불러오기",
            "기본 레이아웃으로 초기화"
        ],
        "priority": "P1",
        "points": 13,
        "assignee": "프론트엔드팀",
        "status": "Backlog"
    }
]

# Story 출력
for story in user_stories:
    print(f"\n{story['id']}: {story['title']}")
    print(f"Priority: {story['priority']} | Points: {story['points']}")
    print(story['story'])
    print("\nAcceptance Criteria:")
    for i, criteria in enumerate(story['acceptance_criteria'], 1):
        print(f"  {i}. {criteria}")
```

## 🔍 User Story vs 다른 형식

| 구분 | User Story | Use Case | Requirement |
|------|------------|----------|-------------|
| **길이** | 짧음 (3줄) | 중간 (1-2페이지) | 김 (여러 페이지) |
| **관점** | 사용자 | 시스템 | 기술 |
| **상세도** | 낮음 | 중간 | 높음 |
| **유연성** | 높음 | 중간 | 낮음 |
| **용도** | 애자일 | 설계 | 폭포수 |

### User Story

```
As a user,
I want to export my data,
So that I can backup my information

✅ 사용자 중심
✅ 간결함
✅ 대화 시작점
```

### Use Case

```
Use Case: 데이터 내보내기

Actor: 사용자
Preconditions: 로그인 상태
Main Flow:
  1. 사용자가 설정 메뉴 선택
  2. "데이터 내보내기" 클릭
  3. 시스템이 파일 형식 선택 화면 표시
  4. 사용자가 CSV 선택
  5. 시스템이 파일 생성
  6. 사용자가 다운로드

✅ 상세한 흐름
✅ 예외 처리 포함
```

### Requirement

```
REQ-101: 데이터 내보내기 기능

시스템은 다음을 수행해야 함:
1. CSV, JSON, XML 형식 지원
2. 최대 파일 크기 100MB
3. 암호화된 다운로드 링크 제공
4. 24시간 후 링크 만료
5. UTF-8 인코딩 사용
6. ...

✅ 기술적 상세
✅ 명확한 스펙
```

## 🚨 흔한 실수

### ❌ 나쁜 User Story

```python
# 1. 기술 중심
bad_story_1 = """
As a developer,
I want to implement Redis caching,
So that the database load decreases
"""
# ❌ 사용자가 아닌 개발자 관점
# ❌ 기술 구현 세부사항

# 2. 지나치게 큼
bad_story_2 = """
As a user,
I want a complete e-commerce platform,
So that I can buy products
"""
# ❌ 너무 큼 (Epic 수준)
# ❌ 한 Sprint에 완료 불가

# 3. 가치 없음
bad_story_3 = """
As a user,
I want to see a loading spinner,
So that I know something is happening
"""
# ❌ 이건 UI 요구사항, 독립적 가치 없음
# ❌ 다른 스토리의 일부

# 4. 해결책 명시
bad_story_4 = """
As a user,
I want a blue button on the top right,
So that I can submit the form
"""
# ❌ 구현 방법을 지정 (Negotiable 위배)
# ❌ "What"이 아닌 "How"
```

### ✅ 좋은 User Story

```python
# 1. 사용자 가치 중심
good_story_1 = """
As a shopper,
I want to see product recommendations,
So that I can discover items I might like
"""
# ✅ 사용자 관점
# ✅ 비즈니스 가치 명확

# 2. 적절한 크기
good_story_2 = """
As a user,
I want to add items to my cart,
So that I can purchase multiple items together
"""
# ✅ 한 Sprint에 완료 가능
# ✅ 독립적

# 3. 명확한 가치
good_story_3 = """
As a user,
I want to receive order confirmation emails,
So that I have a record of my purchase
"""
# ✅ 사용자에게 실질적 가치
# ✅ 독립적 기능

# 4. 유연한 구현
good_story_4 = """
As a user,
I want to quickly submit my form,
So that I don't lose my progress
"""
# ✅ "What"만 정의
# ✅ "How"는 팀이 결정 (버튼, 단축키 등)
```

## 💻 Story Mapping

```python
"""
User Story Mapping
- 사용자 여정에 따라 스토리 배치
- 우선순위와 릴리스 계획 시각화
"""

user_journey_map = {
    "발견": [
        "검색으로 상품 찾기",
        "카테고리 탐색",
        "추천 상품 보기"
    ],
    "평가": [
        "상품 상세 정보 보기",
        "리뷰 읽기",
        "가격 비교"
    ],
    "구매": [
        "장바구니 추가",
        "결제 진행",
        "배송지 입력"
    ],
    "사후": [
        "주문 추적",
        "리뷰 작성",
        "재구매"
    ]
}

# MVP (Release 1)
mvp_stories = [
    "검색으로 상품 찾기",
    "상품 상세 정보 보기",
    "장바구니 추가",
    "결제 진행"
]

# Release 2
release_2 = [
    "추천 상품 보기",
    "리뷰 읽기",
    "주문 추적"
]

print("User Story Map\n")
for phase, stories in user_journey_map.items():
    print(f"\n{phase}:")
    for story in stories:
        marker = "🚀 MVP" if story in mvp_stories else "📋 R2" if story in release_2 else "💡 Later"
        print(f"  {marker} {story}")
```

## 🔗 관련 용어

- [[Agile]]: User Story를 사용하는 방법론
- [[Sprint]]: Story를 구현하는 단위
- [[Backlog]]: Story가 쌓이는 곳
- [[MVP]]: 핵심 Story 모음
- [[Product Roadmap]]: Story의 우선순위 계획

## 📝 정리

**User Story의 핵심**:
```
User Story = 사용자 관점의 기능 요구사항
→ As a [역할]
→ I want [기능]
→ So that [가치]
```

**INVEST 원칙**:
```
I - Independent (독립적)
N - Negotiable (협상 가능)
V - Valuable (가치 있음)
E - Estimable (추정 가능)
S - Small (작음)
T - Testable (테스트 가능)
```

**핵심 요소**:
```
✅ 사용자 관점
✅ 가치 명시
✅ 간결함
✅ 대화 시작점
✅ Acceptance Criteria
```

**비유로 기억하기**:
```
User Story = 메뉴판
→ "무엇"만 보여줌
→ "어떻게" 요리하는지는 주방장에게

"사용자가 원하는 것"에 집중
"어떻게 만들지"는 나중에
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
