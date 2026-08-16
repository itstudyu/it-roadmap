# Persona (페르소나)

## 📝 정의

Persona는 **실제 데이터를 바탕으로 만든 가상의 대표 사용자**입니다. 제품의 타겟 사용자를 구체적으로 이해하고 공감하기 위한 도구입니다.

### 핵심 개념

- **무엇인가?**: 데이터 기반 가상 사용자 프로필
- **왜 필요한가?**: 사용자 중심 의사결정
- **누가 만드나?**: PM, UX 리서처, 마케터

### Persona가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 모호한 타겟
팀 회의: "사용자들이 원할까요?"
→ "사용자들"이 누구? 😱
→ 20대 학생? 40대 직장인?
→ 모두를 위한 제품 = 아무도 만족 못함!

😱 시나리오 2: 의견 충돌
디자이너: "심플한 디자인이 좋아요"
개발자: "고급 기능이 필요해요"
마케터: "화려한 게 눈에 띄어요"
→ 누구를 위한 제품? 😱

😱 시나리오 3: 개인 취향 투영
PM: "나는 이 기능이 좋은데..."
→ PM의 취향 ≠ 사용자 니즈 😱
→ 주관적 의사결정!
```

**Persona의 해결**:
```
✅ 시나리오 1: 구체적 타겟
Persona: "민수 (28세, 스타트업 개발자)"
- 바쁜 일정
- 효율성 중시
- 기술에 능숙
→ 이 사람을 위한 제품! ✅

✅ 시나리오 2: 일관된 기준
회의: "민수라면 어떻게 생각할까?"
디자이너: "민수는 심플을 좋아해요"
개발자: "맞아요, 빠른 실행 중요하죠"
→ 공통 기준! ✅

✅ 시나리오 3: 데이터 기반
"민수 같은 사용자 50명 인터뷰 결과..."
→ 실제 데이터 ✅
→ 객관적 의사결정!
```

## 💡 Persona 작성법

### 1. 데이터 수집

```python
"""
Persona는 상상이 아닌 데이터로!
"""

data_sources = {
    "정량 데이터": [
        "Google Analytics (연령, 지역, 기기)",
        "앱 내 행동 데이터",
        "설문조사 결과",
        "구매 데이터"
    ],
    "정성 데이터": [
        "사용자 인터뷰 (1:1 심층 인터뷰)",
        "고객 지원 문의 내역",
        "리뷰/피드백",
        "소셜 미디어 댓글"
    ]
}

# 최소 인터뷰 수
minimum_interviews = 10-15  # 페르소나당
```

### 2. 패턴 찾기

```python
"""
데이터에서 공통 패턴 식별
"""

class PersonaAnalysis:
    """페르소나 분석"""

    def cluster_users(self, user_data):
        """사용자 군집화"""
        # 유사한 특성 그룹화

        clusters = {
            "파워 유저": {
                "특징": "매일 사용, 모든 기능 활용",
                "비율": "10%",
                "사용 시간": "하루 2시간+"
            },
            "일반 유저": {
                "특징": "주 2-3회, 기본 기능만",
                "비율": "60%",
                "사용 시간": "주 30분"
            },
            "라이트 유저": {
                "특징": "월 1-2회, 특정 목적만",
                "비율": "30%",
                "사용 시간": "월 10분"
            }
        }

        return clusters

    def identify_pain_points(self, feedback):
        """주요 고충점 파악"""
        pain_points = {}

        # 빈도수 분석
        for issue in feedback:
            pain_points[issue] = pain_points.get(issue, 0) + 1

        # 상위 5개
        top_pains = sorted(
            pain_points.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        return top_pains

# 사용
analyzer = PersonaAnalysis()
clusters = analyzer.cluster_users(user_data)

for segment, info in clusters.items():
    print(f"{segment}: {info['비율']}")
    print(f"  특징: {info['특징']}")
```

### 3. Persona 문서 작성

```markdown
# Persona: 민수 (개발자 민수)

![프로필 사진](persona_minsu.jpg)

## 기본 정보
- **나이**: 28세
- **직업**: 스타트업 백엔드 개발자
- **거주지**: 서울 강남
- **학력**: 컴퓨터공학 학사
- **연봉**: 6,000만원

## 한 줄 소개
> "효율적인 도구로 더 많은 가치를 만들고 싶은 개발자"

## 하루 일과
- 09:00 - 출근, 이메일/슬랙 확인
- 10:00 - 스탠드업 미팅
- 10:30 - 코딩 (집중 시간)
- 12:30 - 점심
- 14:00 - 코드 리뷰, 협업
- 18:00 - 퇴근
- 저녁 - 개인 프로젝트, 학습

## 기술 사용
- **개발**: VS Code, GitHub, Docker
- **커뮤니케이션**: Slack, Notion, Jira
- **학습**: YouTube, Medium, 기술 블로그
- **기기**: MacBook Pro, iPhone 13

## 목표 & 동기
### 직업적 목표
1. 더 나은 코드 작성 (클린 코드, 성능)
2. 새로운 기술 학습 (AI, 클라우드)
3. 시니어 개발자로 성장

### 제품 사용 이유
- 반복 작업 자동화
- 생산성 향상
- 협업 효율화

## 고충점 (Pain Points)
1. **시간 부족**: "배우고 싶은 건 많은데 시간이 없어요"
2. **반복 작업**: "매번 같은 설정하는 게 번거로워요"
3. **정보 과부하**: "너무 많은 도구, 뭘 써야 할지 모르겠어요"
4. **협업 마찰**: "팀원들과 컨텍스트 공유가 어려워요"

## 제품 사용 시나리오
### 사용 상황
- 새 프로젝트 시작할 때
- 반복 작업 자동화 필요할 때
- 팀과 코드 공유할 때

### 기대하는 것
- 5분 안에 설정 완료
- 직관적인 UI (문서 안 봐도 사용 가능)
- 기존 도구와 통합 (GitHub, Slack)

### 사용 안 할 때
- 설정이 복잡하면
- 느리면 (1초 이상 로딩)
- 광고/스팸 많으면

## 영향력 있는 사람/채널
- YouTube: 노마드코더, 드림코딩
- 커뮤니티: 개발자 커뮤니티, Reddit
- 추천: 동료 개발자 의견 중요

## 인용구
> "도구는 단순해야 해요. 복잡하면 차라리 직접 만들어요."
> "무료면 좋지만, 값어치 있으면 기꺼이 돈 냅니다."
> "GitHub 연동 안 되면 안 써요."
```

## 🎯 실전 활용

### 1. 제품 결정에 활용

```python
"""
기능 우선순위 결정
"""

def prioritize_feature(feature, persona):
    """페르소나 기반 기능 우선순위"""

    # 민수 페르소나
    minsu = {
        "pain_points": [
            "시간 부족",
            "반복 작업",
            "정보 과부하"
        ],
        "goals": [
            "생산성 향상",
            "자동화"
        ],
        "tech_savvy": True
    }

    # 기능 평가
    feature_scores = {
        "AI 자동 완성": {
            "solves_pain": "반복 작업",  # ✅
            "supports_goal": "생산성 향상",  # ✅
            "fits_tech_level": True,  # ✅
            "score": 9
        },
        "화려한 애니메이션": {
            "solves_pain": None,  # ❌
            "supports_goal": None,  # ❌
            "fits_tech_level": False,  # ❌ (오히려 느려짐)
            "score": 2
        },
        "GitHub 통합": {
            "solves_pain": "협업 마찰",  # ✅
            "supports_goal": "협업 효율",  # ✅
            "fits_tech_level": True,  # ✅
            "score": 10
        }
    }

    return sorted(
        feature_scores.items(),
        key=lambda x: x[1]['score'],
        reverse=True
    )

# 우선순위: GitHub 통합 > AI 자동 완성 > 애니메이션
```

### 2. 마케팅 메시지

```python
"""
페르소나별 메시지 최적화
"""

marketing_messages = {
    "민수 (개발자)": {
        "메시지": "GitHub 연동으로 3초 만에 시작",
        "채널": "개발자 커뮤니티, 기술 블로그",
        "톤": "간결, 기술적, 데이터 중심",
        "CTA": "무료로 시작하기"
    },

    "지혜 (디자이너)": {
        "메시지": "아름다운 디자인, 쉬운 협업",
        "채널": "Instagram, Behance, Dribbble",
        "톤": "비주얼, 감성적, 창의적",
        "CTA": "포트폴리오 만들기"
    },

    "영희 (마케터)": {
        "메시지": "전환율 20% 증가 사례",
        "채널": "LinkedIn, 마케팅 뉴스레터",
        "톤": "성과 중심, ROI, 사례",
        "CTA": "무료 체험 시작"
    }
}

def create_ad_copy(persona_name):
    """페르소나별 광고 문구"""
    persona = marketing_messages[persona_name]

    return f"""
[{persona_name}를 위한 광고]

헤드라인: {persona['메시지']}
바디: [페르소나 pain point 해결]
CTA: {persona['CTA']}

채널: {persona['채널']}
톤: {persona['톤']}
"""

print(create_ad_copy("민수 (개발자)"))
```

### 3. User Story 작성

```python
"""
Persona → User Story
"""

def persona_to_user_story(persona):
    """페르소나에서 User Story 생성"""

    # 민수의 pain point: "반복 작업"
    story = f"""
As a {persona['role']},
I want to {persona['goal']},
So that I can {persona['outcome']}

Persona: {persona['name']}
Pain Point: {persona['pain_point']}
Context: {persona['context']}
"""

    return story

# 예시
minsu_story = {
    "name": "민수 (개발자)",
    "role": "busy developer",
    "goal": "automate repetitive tasks",
    "outcome": "focus on creative work",
    "pain_point": "반복 작업으로 시간 낭비",
    "context": "매일 같은 설정 작업 반복"
}

print(persona_to_user_story(minsu_story))

# As a busy developer,
# I want to automate repetitive tasks,
# So that I can focus on creative work
```

## 🔍 Persona 유형

### Primary Persona (주 페르소나)

```
제품의 주요 타겟
- 가장 많은 비중 (60-70%)
- 제품 결정의 주 기준
- 예: "민수" - 개발자
```

### Secondary Persona (부 페르소나)

```
부차적 타겟
- 20-30% 비중
- 주 페르소나 방해 안 하는 선에서 고려
- 예: "지혜" - 디자이너
```

### Anti-Persona (안티 페르소나)

```
타겟이 아닌 사용자
- 명확히 제외
- 리소스 낭비 방지
- 예: "기술 싫어하는 50대"
```

## 🚨 Persona 실수

### ❌ 피해야 할 것

```python
# 1. 상상으로 만들기
bad_persona = {
    "근거": "우리 생각에...",
    "데이터": None,
    "인터뷰": 0
}
# ❌ 실제 사용자와 다를 수 있음

# 2. 너무 많은 Persona
too_many = ["민수", "지혜", "영희", "철수", "순이", ...]
# ❌ 10명 = 타겟 없는 것
# ✅ 2-3명으로 집중

# 3. 인구통계만
demographic_only = {
    "나이": 28,
    "성별": "남",
    "직업": "개발자"
}
# ❌ 행동, 목표, pain point 없음

# 4. 업데이트 안 함
old_persona = {
    "created": "2020-01-01",
    "last_updated": "2020-01-01"  # 4년 전!
}
# ❌ 사용자는 변함
# ✅ 6개월-1년마다 업데이트
```

### ✅ 좋은 Persona

```python
good_persona = {
    "데이터 기반": "50명 인터뷰",
    "구체적": "민수, 28세, 스타트업 개발자",
    "행동 중심": "매일 아침 9시 깃헙 체크",
    "목표/Pain": "생산성 향상 / 시간 부족",
    "인용구": "실제 사용자 말",
    "업데이트": "분기별 검토"
}
```

## 💻 Persona Template

```python
"""
Persona 생성 템플릿
"""

persona_template = {
    "header": {
        "name": "이름 (별명)",
        "photo": "프로필 사진 URL",
        "tagline": "한 줄 소개"
    },

    "demographics": {
        "age": 0,
        "occupation": "",
        "location": "",
        "education": "",
        "income": ""
    },

    "psychographics": {
        "goals": ["목표1", "목표2", "목표3"],
        "motivations": ["동기1", "동기2"],
        "pain_points": ["고충1", "고충2", "고충3"],
        "values": ["가치관1", "가치관2"]
    },

    "behavior": {
        "daily_routine": ["일과1", "일과2"],
        "tech_usage": {
            "devices": ["기기1", "기기2"],
            "apps": ["앱1", "앱2"],
            "tech_savviness": "high/medium/low"
        },
        "shopping_behavior": {
            "research": "어떻게 조사?",
            "decision_factors": ["요소1", "요소2"],
            "price_sensitivity": "high/medium/low"
        }
    },

    "product_usage": {
        "use_case": "언제 사용?",
        "frequency": "얼마나 자주?",
        "expectations": ["기대1", "기대2"],
        "deal_breakers": ["거부요소1", "거부요소2"]
    },

    "influences": {
        "people": ["영향력 있는 사람"],
        "channels": ["주로 보는 채널"],
        "communities": ["속한 커뮤니티"]
    },

    "quotes": [
        "실제 사용자 인용구 1",
        "실제 사용자 인용구 2"
    ]
}

# JSON으로 저장
import json
with open('persona_minsu.json', 'w', encoding='utf-8') as f:
    json.dump(persona_template, f, ensure_ascii=False, indent=2)
```

## 🔗 관련 용어

- [[User Story]]: Persona 기반 스토리 작성
- [[User Journey]]: Persona의 경험 흐름
- [[MVP]]: Persona의 핵심 니즈 해결
- [[PMF]]: Persona가 열광하는가?
- [[A B Testing]]: Persona별 반응 테스트

## 📝 정리

**Persona의 핵심**:
```
Persona = 데이터 기반 대표 사용자
→ 추상적 "사용자들" → 구체적 "민수"
→ 공감과 이해
→ 일관된 의사결정
```

**작성 요소**:
```
✅ 인구통계 (나이, 직업)
✅ 행동 패턴 (하루 일과)
✅ 목표/동기 (왜 사용?)
✅ 고충점 (Pain Points)
✅ 사용 환경 (언제, 어디서)
```

**활용**:
```
제품 기능 우선순위 결정
디자인 방향 설정
마케팅 메시지 작성
User Story 생성
팀 커뮤니케이션 기준
```

**비유로 기억하기**:
```
Persona = 영화 주인공
→ 이름, 직업, 성격 있음
→ 목표와 갈등 있음
→ 구체적으로 상상 가능

"모두를 위한 제품은 아무도 위한 제품이 아니다"
```

---
*카테고리: 제품관리*
*생성일: 2026-02-15*
