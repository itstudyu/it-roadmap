# Escalation (에스컬레이션)

## 📝 정의

Escalation(에스컬레이션)은 AI Agent가 스스로 해결할 수 없는 문제를 **사람에게 넘기는** 과정입니다. AI의 한계를 인정하고 인간에게 도움을 요청하여 사용자 경험을 보장합니다.

### 핵심 개념

- **무엇인가?**: AI가 해결 못 하는 문제를 사람에게 전달
- **왜 필요한가?**: AI는 완벽하지 않고, 때로는 사람의 판단이 필요
- **언제 발생하나?**: 낮은 신뢰도, 반복 실패, 복잡한 문제 등

### Escalation이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: AI가 계속 잘못된 답변
사용자: "재택근무 신청 방법?"
AI: "FAQ에 없습니다"
사용자: "규정에 있을 텐데?"
AI: "찾을 수 없습니다"
사용자: (짜증) "도대체!"
→ 사용자 불만 폭발! 😱

😱 시나리오 2: 애매한 상황
사용자: "특별 휴가 승인해줘"
AI: "특별 휴가가 뭐죠?"
사용자: "결혼 휴가"
AI: "승인 권한이 없습니다"
→ AI가 처리 못함! 😱

😱 시나리오 3: 감정적 사용자
사용자: "화났어! 담당자 연결해!"
AI: "FAQ를 먼저 확인해보시겠어요?"
→ 사용자 더 화남! 😱
```

**Escalation의 해결**:
```
✅ 시나리오 1 (Escalation):
AI (2번 실패 후):
"죄송합니다. 담당자를 연결해드리겠습니다."
→ 사람이 정확한 답변
→ 사용자 만족! ✅

✅ 시나리오 2:
AI: "특별 휴가는 승인 권한이 필요합니다.
    티켓(ESC-001)을 생성했습니다.
    담당자가 곧 연락드리겠습니다."
→ 적절한 처리! ✅

✅ 시나리오 3:
AI (감정 감지):
"불편을 드려 죄송합니다.
 담당자를 즉시 연결해드리겠습니다."
→ 빠른 대응! ✅
```

**비유**:
- **Escalation 없음** = 초보 직원이 모르는 것도 답변 시도 (실수 증가)
- **Escalation 있음** = 초보가 모르면 선배에게 도움 요청 (정확성 향상)

## 💡 실제 구현

### 기본 Escalation 시스템

```python
from datetime import datetime
from dataclasses import dataclass

@dataclass
class EscalationTicket:
    """에스컬레이션 티켓"""
    ticket_id: str
    user_id: str
    issue: str
    priority: str  # low, medium, high, critical
    reason: str
    created_at: datetime

class EscalationManager:
    """에스컬레이션 관리자"""

    def __init__(self):
        self.confidence_threshold = 0.6  # 신뢰도 임계값
        self.max_retries = 3  # 최대 재시도

    def should_escalate(
        self,
        confidence: float,
        attempt_count: int,
        user_input: str
    ) -> tuple[bool, str]:
        """에스컬레이션 필요 여부 판단"""

        # 1. 낮은 신뢰도
        if confidence < self.confidence_threshold:
            return True, f"낮은 신뢰도 ({confidence:.0%})"

        # 2. 반복 실패
        if attempt_count >= self.max_retries:
            return True, f"{attempt_count}회 실패"

        # 3. 명시적 요청
        escalation_keywords = ["담당자", "상담원", "사람", "직원"]
        if any(kw in user_input for kw in escalation_keywords):
            return True, "담당자 요청"

        # 4. 감정 감지
        negative_keywords = ["화난다", "짜증", "최악", "어이없어"]
        if any(kw in user_input for kw in negative_keywords):
            return True, "부정적 감정 감지 (우선 처리)"

        return False, ""

    def create_ticket(
        self,
        user_id: str,
        issue: str,
        reason: str
    ) -> EscalationTicket:
        """티켓 생성 및 담당자 알림"""

        ticket_id = f"ESC-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # 우선순위 결정
        priority = "high" if "감정" in reason else "medium"

        ticket = EscalationTicket(
            ticket_id=ticket_id,
            user_id=user_id,
            issue=issue,
            priority=priority,
            reason=reason,
            created_at=datetime.now()
        )

        # 담당자에게 알림
        self._notify_operator(ticket)

        return ticket

    def _notify_operator(self, ticket: EscalationTicket):
        """담당자 알림"""
        print(f"""
🚨 에스컬레이션 알림
━━━━━━━━━━━━━━━━━
티켓 ID: {ticket.ticket_id}
사용자: {ticket.user_id}
우선순위: {ticket.priority.upper()}
사유: {ticket.reason}
내용: {ticket.issue}
━━━━━━━━━━━━━━━━━
""")

# 사용 예시
manager = EscalationManager()

# 테스트 1: 낮은 신뢰도
should, reason = manager.should_escalate(
    confidence=0.5,
    attempt_count=1,
    user_input="재택근무 신청 방법?"
)
if should:
    ticket = manager.create_ticket(
        user_id="user123",
        issue="재택근무 신청 방법?",
        reason=reason
    )
    print(f"✅ 티켓 생성: {ticket.ticket_id}")
```

## 🎯 우선순위 레벨

| 우선순위 | 조건 | 응답 목표 | 예시 |
|---------|------|---------|------|
| **Critical** | 시스템 장애, 보안 | 즉시 | "로그인이 안 돼요" |
| **High** | 불만, 감정 부정적 | 15분 | "화났어요!" |
| **Medium** | 반복 실패, 권한 필요 | 1시간 | 3회 실패 |
| **Low** | 정보 부족 | 당일 | "문서를 못 찾음" |

## 🔗 관련 용어

- [[AI Agent]]: Escalation의 주체
- [[Fallback]]: Escalation 전 시도하는 대안
- [[Guardrail]]: Escalation을 트리거하는 안전장치

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
