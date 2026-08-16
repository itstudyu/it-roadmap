# Guardrail (가드레일)

## 📝 정의

Guardrail(가드레일)은 AI Agent가 위험하거나 부적절한 행동을 하지 못하도록 막는 **안전장치**입니다. 도로의 가드레일이 차를 보호하듯, AI의 동작을 안전한 범위로 제한합니다.

### 핵심 개념

- **무엇인가?**: AI의 위험한 행동을 차단하는 안전장치
- **왜 필요한가?**: AI는 실수할 수 있고, 보안/개인정보 보호 필요
- **어떻게 작동하나?**: 입력/출력/행동을 검증하여 위험 요소 차단

### Guardrail이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 개인정보 노출
사용자: "내 주민번호 123456-1234567로 조회해줘"

AI (Guardrail 없음):
"네, 주민번호 123456-1234567로 조회했습니다.
 이름: 홍길동, 주소: 서울시..."
→ PII 그대로 노출! 😱

😱 시나리오 2: 권한 없는 데이터 접근
사용자: "모든 직원 급여 목록 보여줘"

AI (Guardrail 없음):
"전체 직원 급여:
 - 김철수: 5000만원
 - 이영희: 4500만원..."
→ 기밀 정보 유출! 😱

😱 시나리오 3: SQL Injection 공격
해커: "SELECT * FROM users; DROP TABLE users--"

AI (Guardrail 없음):
[쿼리 실행]
→ 데이터베이스 삭제! 😱
```

**Guardrail의 해결**:
```
✅ 시나리오 1 (Input Guardrail):
사용자 입력에서 주민번호 감지
→ ❌ 차단
→ "개인정보를 직접 입력하지 마세요" ✅

✅ 시나리오 2 (Action Guardrail):
권한 확인: "급여 데이터 접근 권한 없음"
→ ❌ 차단
→ "권한이 없습니다" ✅

✅ 시나리오 3 (Input Guardrail):
SQL Injection 패턴 감지
→ ❌ 차단
→ "잘못된 요청입니다" ✅
```

**비유**:
- **Guardrail 없음** = 안전벨트 없이 운전 (위험)
- **Guardrail 있음** = 안전벨트 + 에어백 (안전)

## 💡 실제 구현

### 1. Input Guardrail (입력 검증)

```python
import re
from typing import Tuple

class InputGuardrail:
    """사용자 입력 검증"""

    def __init__(self):
        # PII 패턴
        self.pii_patterns = {
            'ssn': r'\d{6}-\d{7}',  # 주민번호
            'phone': r'\d{3}-\d{4}-\d{4}',  # 전화번호
            'card': r'\d{4}-\d{4}-\d{4}-\d{4}'  # 카드번호
        }

        # 금지 키워드
        self.forbidden = ["해킹", "crack", "exploit", "DROP TABLE"]

    def validate(self, user_input: str) -> Tuple[bool, str]:
        """
        Returns:
            (안전 여부, 거부 사유)
        """

        # 1. PII 검사
        for pii_type, pattern in self.pii_patterns.items():
            if re.search(pattern, user_input):
                return False, f"⚠️ {pii_type} 정보를 직접 입력하지 마세요"

        # 2. 금지 키워드
        for keyword in self.forbidden:
            if keyword.lower() in user_input.lower():
                return False, f"🚫 금지된 키워드: {keyword}"

        # 3. SQL Injection
        sql_patterns = [
            r"';?\s*(DROP|DELETE|UPDATE)\s+",
            r"UNION\s+SELECT"
        ]
        for pattern in sql_patterns:
            if re.search(pattern, user_input, re.IGNORECASE):
                return False, "🚫 SQL Injection 시도 감지"

        return True, ""

# 사용
guard = InputGuardrail()

inputs = [
    "주소 변경하고 싶어",
    "내 주민번호 123456-1234567로 조회",
    "DROP TABLE users"
]

for inp in inputs:
    safe, reason = guard.validate(inp)
    if safe:
        print(f"✅ 안전: {inp}")
    else:
        print(f"❌ 차단: {inp}\n   {reason}")
```

### 2. Output Guardrail (출력 검증)

```python
class OutputGuardrail:
    """AI 응답 검증"""

    def filter(self, ai_response: str) -> str:
        """PII 마스킹 및 부적절한 내용 차단"""

        filtered = ai_response

        # 1. PII 마스킹
        # 주민번호
        filtered = re.sub(
            r'\d{6}-\d{7}',
            '******-*******',
            filtered
        )

        # 전화번호
        filtered = re.sub(
            r'\d{3}-\d{4}-\d{4}',
            '***-****-****',
            filtered
        )

        # 2. 기밀 키워드 검사
        confidential = ["password", "secret_key", "api_key"]
        if any(kw in filtered.lower() for kw in confidential):
            return "❌ 보안상 공개할 수 없는 정보입니다."

        return filtered

# 사용
output_guard = OutputGuardrail()

responses = [
    "귀하의 주소는 서울시 강남구입니다.",
    "귀하의 주민번호는 123456-1234567입니다.",
    "API KEY는 abc123xyz입니다."
]

for resp in responses:
    filtered = output_guard.filter(resp)
    print(f"원본: {resp}")
    print(f"필터: {filtered}\n")
```

### 3. Action Guardrail (행동 검증)

```python
class ActionGuardrail:
    """AI 행동 검증"""

    def __init__(self, user_permissions: dict):
        self.permissions = user_permissions

    def can_execute(self, action: str, target: str) -> Tuple[bool, str]:
        """행동 허용 여부"""

        # 1. 권한 확인
        permission_key = f"can_{action}_{target}"
        if not self.permissions.get(permission_key, False):
            return False, f"❌ {target}에 대한 {action} 권한 없음"

        # 2. 위험한 작업 차단
        dangerous = [
            ("delete", "all_users"),
            ("write", "admin_config")
        ]
        if (action, target) in dangerous:
            return False, f"⚠️ 위험한 작업: {action} {target}"

        # 3. 업무시간 확인 (급여 데이터)
        if target == "payroll" and not self._is_business_hours():
            return False, "⏰ 급여 데이터는 업무시간만 접근 가능"

        return True, ""

    def _is_business_hours(self) -> bool:
        from datetime import datetime
        return 9 <= datetime.now().hour < 18

# 사용
permissions = {
    'can_read_payroll': True,
    'can_delete_all_users': False
}

action_guard = ActionGuardrail(permissions)

actions = [
    ("read", "payroll"),
    ("delete", "all_users")
]

for action, target in actions:
    allowed, reason = action_guard.can_execute(action, target)
    print(f"{'✅' if allowed else '❌'} {action} {target}")
    if not allowed:
        print(f"   {reason}")
```

## 🎯 Guardrail 유형

| 유형 | 시점 | 차단 대상 | 예시 |
|------|------|----------|------|
| **Input** | 요청 받을 때 | 악의적 입력 | PII, SQL Injection |
| **Output** | 응답 전 | 부적절한 응답 | 기밀 정보 노출 |
| **Action** | 작업 전 | 위험한 행동 | 권한 없는 접근 |
| **Runtime** | 실행 중 | 이상 동작 | 무한루프, 과도한 API 호출 |

## 🛡️ 보안 vs 사용성

Guardrail은 **보안**과 **사용성** 사이의 균형이 중요합니다:

```
너무 엄격 → 사용자 불편
너무 느슨 → 보안 위험

✅ 적절한 균형:
- 명확한 위험은 즉시 차단
- 애매한 경우 사용자에게 확인
- 차단 시 이유 명확히 설명
```

## 🔗 관련 용어

- [[PII]]: Guardrail이 보호하는 정보
- [[AI Agent]]: Guardrail의 대상
- [[Escalation]]: Guardrail 차단 시 조치
- [[Audit Log]]: Guardrail 활동 기록

---
*카테고리: AI-ML*
*생성일: 2026-02-14*
