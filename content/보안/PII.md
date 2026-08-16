# PII (Personally Identifiable Information)

## 📝 정의

PII(Personally Identifiable Information, 개인식별정보)는 **특정 개인을 식별할 수 있는 모든 정보**입니다. 이름, 주민번호, 전화번호, 이메일, 주소 등 개인을 직접 또는 간접적으로 식별 가능한 데이터를 말합니다.

### 핵심 개념

- **무엇인가?**: 개인을 식별할 수 있는 모든 정보
- **왜 중요한가?**: 유출 시 개인 피해, 법적 처벌, 기업 신뢰 손상
- **어떻게 보호하나?**: 감지 → 마스킹 → 암호화 → 접근 제어

### PII가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: PII가 그대로 노출
챗봇: "주민번호를 입력해주세요"
사용자: "123456-1234567"
시스템: "김철수님, 주민번호 123456-1234567로 조회했습니다"
→ 로그에 주민번호 그대로 저장!
→ 해커가 로그 접근 시 개인정보 유출! 😱

😱 시나리오 2: 권한 없는 사람이 PII 조회
직원: "급여팀 주민번호 전부 보여줘"
시스템 (권한 확인 없음):
"김철수: 123456-1234567
 이영희: 654321-7654321..."
→ 기밀 정보 무단 접근! 😱

😱 시나리오 3: 여러 정보 조합으로 개인 식별
해커: "이름 + 생년월일 + 주소" 수집
→ 데이터 조합하여 특정 개인 식별
→ 피싱, 사기 범죄 악용! 😱
```

**PII 보호의 해결**:
```
✅ 시나리오 1 (자동 마스킹):
사용자: "123456-1234567"
시스템 (PII 감지):
→ 입력: 차단 "⚠️ 주민번호를 직접 입력하지 마세요"
→ 출력: 마스킹 "******-*******"
→ 로그: 안전! ✅

✅ 시나리오 2 (접근 제어):
직원: "주민번호 보여줘"
시스템 (권한 확인):
→ ❌ "급여 PII 조회 권한 없음"
HR 담당자만 접근 가능 ✅

✅ 시나리오 3 (수집 최소화):
시스템: 주민번호 수집 안 함
→ 이름만 저장 (식별 불가)
→ 조합해도 개인 특정 불가 ✅
```

**비유**:
- **PII 보호 없음** = 집 주소를 길거리에 써놓음 (누구나 접근)
- **PII 보호 있음** = 집 주소를 금고에 보관 (허가받은 사람만 접근)

## 🔒 PII 분류 상세

### 직접 식별자 (고위험)
**단독으로 개인을 특정**할 수 있는 정보

| PII 항목 | 예시 | 위험도 |
|---------|------|-------|
| 주민번호 | 123456-1234567 | ⚠️ 매우 높음 |
| 여권번호 | M12345678 | ⚠️ 매우 높음 |
| 운전면허번호 | 12-34-567890-12 | ⚠️ 높음 |
| 계좌번호 | 110-123-456789 | ⚠️ 높음 |
| 신용카드번호 | 1234-5678-9012-3456 | ⚠️ 매우 높음 |

### 간접 식별자 (중위험)
**여러 개가 조합**되면 개인 식별 가능

| PII 항목 | 예시 | 위험도 | 조합 시 |
|---------|------|-------|---------|
| 이름 | 김철수 | ⚡ 낮음 | 이름 + 생년월일 → 식별 가능 |
| 생년월일 | 1990-01-01 | ⚡ 낮음 | 생년월일 + 주소 → 식별 가능 |
| 전화번호 | 010-1234-5678 | ⚡ 중간 | 단독으로도 연락 가능 |
| 이메일 | hong@company.com | ⚡ 중간 | 이메일 + 이름 → 식별 가능 |
| 주소 | 서울시 강남구 | ⚡ 낮음 | 주소 + 이름 → 식별 가능 |

### PII가 아닌 것

| 항목 | 이유 |
|-----|------|
| 회사 규정 문서 | 개인 식별 불가 |
| FAQ 내용 | 일반적인 정보 |
| 직급명 (부장, 과장) | 개인 특정 불가 |
| 익명화된 통계 | 개인 정보 제거됨 |

## 💡 실제 구현

### 1. PII 감지기

```python
import re
from typing import List, Dict

class PIIDetector:
    """PII 자동 감지"""

    def __init__(self):
        # PII 패턴 정의
        self.patterns = {
            'ssn': {
                'pattern': r'\d{6}-\d{7}',
                'name': '주민번호',
                'risk': 'critical'
            },
            'phone': {
                'pattern': r'0\d{1,2}-\d{3,4}-\d{4}',
                'name': '전화번호',
                'risk': 'medium'
            },
            'email': {
                'pattern': r'[\w.-]+@[\w.-]+\.\w+',
                'name': '이메일',
                'risk': 'medium'
            },
            'credit_card': {
                'pattern': r'\d{4}-\d{4}-\d{4}-\d{4}',
                'name': '신용카드',
                'risk': 'critical'
            }
        }

    def detect(self, text: str) -> List[Dict]:
        """텍스트에서 PII 감지"""
        detected_pii = []

        for pii_type, info in self.patterns.items():
            matches = re.finditer(info['pattern'], text)

            for match in matches:
                detected_pii.append({
                    'type': pii_type,
                    'name': info['name'],
                    'value': match.group(),
                    'risk_level': info['risk']
                })

        return detected_pii

    def mask(self, text: str) -> str:
        """PII 자동 마스킹"""
        masked_text = text

        # 주민번호
        masked_text = re.sub(
            r'\d{6}-\d{7}',
            '******-*******',
            masked_text
        )

        # 전화번호
        masked_text = re.sub(
            r'0\d{1,2}-\d{3,4}-\d{4}',
            '***-****-****',
            masked_text
        )

        # 이메일
        masked_text = re.sub(
            r'([\w.-]+)@([\w.-]+\.\w+)',
            lambda m: f"{m.group(1)[0]}***@{m.group(2)}",
            masked_text
        )

        # 카드번호
        masked_text = re.sub(
            r'(\d{4})-(\d{4})-(\d{4})-(\d{4})',
            r'****-****-****-\4',
            masked_text
        )

        return masked_text


# 사용 예시
detector = PIIDetector()

test_text = """
김철수님의 정보입니다.
주민번호: 901231-1234567
전화번호: 010-1234-5678
이메일: chulsoo@example.com
"""

print("=== PII 감지 ===")
detected = detector.detect(test_text)
for pii in detected:
    print(f"⚠️ {pii['name']}: {pii['value']} (위험도: {pii['risk_level']})")

print("\n=== 마스킹된 텍스트 ===")
masked = detector.mask(test_text)
print(masked)
```

**출력**:
```
=== PII 감지 ===
⚠️ 주민번호: 901231-1234567 (위험도: critical)
⚠️ 전화번호: 010-1234-5678 (위험도: medium)
⚠️ 이메일: chulsoo@example.com (위험도: medium)

=== 마스킹된 텍스트 ===
김철수님의 정보입니다.
주민번호: ******-*******
전화번호: ***-****-****
이메일: c***@example.com
```

### 2. PII 접근 제어

```python
from functools import wraps
from enum import Enum

class PIIAccessLevel(Enum):
    """PII 접근 권한 레벨"""
    NONE = 0      # 접근 불가
    MASKED = 1    # 마스킹된 형태만
    PARTIAL = 2   # 일부만
    FULL = 3      # 전체 접근

class PIIAccessControl:
    """PII 접근 제어"""

    def __init__(self):
        # 역할별 권한 정의
        self.role_permissions = {
            'admin': PIIAccessLevel.FULL,
            'hr': PIIAccessLevel.FULL,
            'manager': PIIAccessLevel.PARTIAL,
            'employee': PIIAccessLevel.MASKED,
            'guest': PIIAccessLevel.NONE
        }

    def require_pii_permission(self, required_level: PIIAccessLevel):
        """PII 접근 권한 데코레이터"""
        def decorator(func):
            @wraps(func)
            def wrapper(user, *args, **kwargs):
                # 사용자 권한 확인
                user_level = self.get_user_access_level(user)

                if user_level.value < required_level.value:
                    raise PermissionError(
                        f"❌ PII 접근 권한이 부족합니다.\n"
                        f"   필요: {required_level.name}\n"
                        f"   현재: {user_level.name}"
                    )

                return func(user, *args, **kwargs)

            return wrapper
        return decorator

    def get_user_access_level(self, user: dict) -> PIIAccessLevel:
        """사용자의 PII 접근 권한 확인"""
        role = user.get('role', 'guest')
        return self.role_permissions.get(role, PIIAccessLevel.NONE)


# 사용 예시
access_control = PIIAccessControl()

@access_control.require_pii_permission(PIIAccessLevel.FULL)
def view_ssn(user, employee_id: str):
    """주민번호 조회 (FULL 권한 필요)"""
    return f"주민번호: 901231-1234567"

@access_control.require_pii_permission(PIIAccessLevel.PARTIAL)
def view_phone(user, employee_id: str):
    """전화번호 조회 (PARTIAL 권한 필요)"""
    return f"전화번호: 010-1234-5678"


# 테스트
users = [
    {'id': 'user1', 'role': 'admin'},
    {'id': 'user2', 'role': 'manager'},
    {'id': 'user3', 'role': 'employee'}
]

for user in users:
    print(f"\n사용자: {user['role']}")

    # 주민번호 조회 시도
    try:
        print(f"  {view_ssn(user, 'EMP001')}")
    except PermissionError as e:
        print(f"  {e}")

    # 전화번호 조회 시도
    try:
        print(f"  {view_phone(user, 'EMP001')}")
    except PermissionError as e:
        print(f"  {e}")
```

**실행 결과**:
```
사용자: admin
  주민번호: 901231-1234567
  전화번호: 010-1234-5678

사용자: manager
  ❌ PII 접근 권한이 부족합니다.
     필요: FULL
     현재: PARTIAL
  전화번호: 010-1234-5678

사용자: employee
  ❌ PII 접근 권한이 부족합니다.
     필요: FULL
     현재: MASKED
  ❌ PII 접근 권한이 부족합니다.
     필요: PARTIAL
     현재: MASKED
```

## 🛡️ PII 보호 방법

### 1. 수집 최소화

**나쁜 예** (불필요한 PII 수집):
```python
user_data = {
    'name': '김철수',
    'ssn': '901231-1234567',  # ❌ 불필요
    'email': 'kim@example.com'
}
```

**좋은 예** (필요한 정보만):
```python
user_data = {
    'name': '김철수',
    'email': 'kim@example.com'
    # SSN 수집하지 않음 ✅
}
```

### 2. 암호화 저장

```python
from cryptography.fernet import Fernet

class PIIEncryptor:
    """PII 암호화"""

    def __init__(self, key: bytes):
        self.cipher = Fernet(key)

    def encrypt_pii(self, pii_value: str) -> bytes:
        """PII 암호화"""
        return self.cipher.encrypt(pii_value.encode())

    def decrypt_pii(self, encrypted: bytes) -> str:
        """PII 복호화 (권한 있는 경우만)"""
        return self.cipher.decrypt(encrypted).decode()


# 사용
key = Fernet.generate_key()
encryptor = PIIEncryptor(key)

ssn = "901231-1234567"
encrypted_ssn = encryptor.encrypt_pii(ssn)
print(f"암호화: {encrypted_ssn}")

# 복호화 (권한 있는 사용자만)
decrypted = encryptor.decrypt_pii(encrypted_ssn)
print(f"복호화: {decrypted}")
```

### 3. 익명화/가명화

```python
import hashlib

def anonymize_pii(pii_value: str, salt: str = "secret") -> str:
    """PII 익명화 (복구 불가능)"""
    combined = pii_value + salt
    return hashlib.sha256(combined.encode()).hexdigest()

# 원본 데이터를 복구할 수 없음
ssn = "901231-1234567"
anonymized = anonymize_pii(ssn)
print(f"익명화: {anonymized}")
# → 일방향 해시, 복구 불가능
```

## 🎯 PII 보호 체크리스트

| 단계 | 확인 사항 | 중요도 |
|------|----------|--------|
| **수집** | 필요한 PII만 수집 | ⚠️ 매우 높음 |
| **전송** | HTTPS로 암호화 전송 | ⚠️ 매우 높음 |
| **저장** | 암호화하여 저장 | ⚠️ 매우 높음 |
| **접근** | 권한 기반 접근 제어 | ⚠️ 높음 |
| **로그** | PII 자동 마스킹 | ⚠️ 높음 |
| **폐기** | 안전한 삭제 | ⚠️ 중간 |

## 🔗 관련 용어

- [[Guardrail]]: PII 입출력 차단
- [[Audit Log]]: PII 접근 기록
- [[Token 인증]]: 인증 정보 보호
- [[암호화]]: PII 보호 기술

## 📚 법적 근거

- [개인정보보호법](https://www.law.go.kr/) (한국)
- [GDPR](https://gdpr.eu/) (유럽)
- [CCPA](https://oag.ca.gov/privacy/ccpa) (캘리포니아)

---
*카테고리: 보안*
*생성일: 2026-02-14*
