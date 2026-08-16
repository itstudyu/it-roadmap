# Step-up Auth (추가 인증)

## 📝 정의

Step-up Auth(추가 인증)는 이미 로그인한 사용자가 **민감한 작업을 할 때** 한 번 더 본인 확인을 요구하는 보안 메커니즘입니다.

### 핵심 개념

- **무엇인가?**: 로그인 후에도 중요한 작업 시 추가로 인증하는 것
- **왜 필요한가?**: 누군가 내 로그인된 기기를 잠깐 사용해도 중요한 작업은 막기 위해
- **언제 사용하나?**: 송금, 비밀번호 변경, 개인정보 조회 등 민감한 작업 시

### Step-up Auth가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1:
당신이 은행 앱에 로그인해 둔 상태로 자리를 비웠습니다.
누군가 당신의 폰을 들고 송금 버튼을 누릅니다.
→ 로그인되어 있으니 그냥 송금이 됩니다! 😱

😱 시나리오 2:
회사 인사 시스템에 로그인해둔 상태로 회의를 갑니다.
동료가 장난으로 당신의 PC에서 급여 정보를 조회합니다.
→ 이미 로그인되어 있으니 조회가 됩니다! 😱
```

**Step-up Auth의 해결**:
```
✅ 같은 상황:
송금 버튼을 누르면 → "비밀번호를 다시 입력하세요"
급여 조회 버튼을 누르면 → "지문 인증을 해주세요"
→ 본인이 아니면 진행할 수 없습니다! ✅
```

**비유**:
- 일반 로그인 = 건물 출입증 (건물에는 들어갈 수 있음)
- Step-up Auth = 금고실 생체인증 (중요한 곳은 한 번 더 확인)

## 📊 작동 원리

Step-up Auth는 **작업의 민감도**에 따라 추가 인증을 요구합니다.

### 인증 레벨 구조


### 작업별 요구 인증 레벨

| 작업 | 필요 레벨 | 추가 인증 |
|------|----------|----------|
| 프로필 보기 | Level 1 | ❌ 불필요 |
| 게시글 작성 | Level 1 | ❌ 불필요 |
| 이메일 변경 | Level 2 | ✅ 비밀번호 |
| 송금 | Level 2 | ✅ 비밀번호 + OTP |
| 계좌 삭제 | Level 2 | ✅ 생체인증 |

## 🔄 동작 시퀀스

사용자가 송금을 시도하는 경우:

```도해
흐름: Step-up Auth, 무슨 순서로 오가나
사용자 :: 송금" 버튼 클릭
앱 :: 송금 요청 + 현재 토큰
서버 :: 토큰 확인 (Level 1)
서버 :: 권한 부족 "Step-up 필요
앱 :: 비밀번호 입력 화면
사용자 :: 비밀번호 입력
앱 :: 비밀번호 검증
인증 시스템 :: 인증 성공
앱 :: 송금 요청 + 새 토큰 (Level 2, 10분 유효)
서버 :: 토큰 확인 (Level 2)
서버 :: 송금 완료
```

### 각 단계 상세 설명

1. **사용자가 민감한 작업 시도**:
   - 현재 Level 1 (일반 로그인)
   - Level 2가 필요한 작업 요청

2. **서버가 권한 부족 판단**:
   - 현재 토큰의 레벨 확인
   - Level 1 < Level 2 → 거부

3. **Step-up Auth 요구**:
   - 사용자에게 추가 인증 요청
   - 비밀번호, OTP, 생체인증 등

4. **인증 성공 시 Level 2 토큰 발급**:
   - 새 토큰에 Level 2 권한 부여
   - 제한된 시간(5-10분) 동안만 유효

5. **작업 수행**:
   - Level 2 토큰으로 작업 진행
   - 시간 만료 후 자동으로 Level 1로 강등

## 💡 실제 예시

### 은행 앱 시나리오

```
[일반 로그인 상태 - Level 1]
사용자: "잔액 조회" 클릭
앱: ✅ 바로 보여줌 (민감하지 않음)

사용자: "송금" 클릭
앱: ⚠️ "송금을 위해 비밀번호를 입력하세요"

사용자: 비밀번호 입력
앱: ✅ Level 2로 승격 (10분간 유효)

[이후 10분 내]
사용자: "또 다른 송금" 클릭
앱: ✅ 바로 진행 (Level 2 유지 중)

[10분 후]
사용자: "또 송금" 클릭
앱: ⚠️ "다시 비밀번호를 입력하세요" (Level 1로 강등)
```

### 기본 구현 예시

```python
from datetime import datetime, timedelta
from enum import Enum

class AuthLevel(Enum):
    """인증 레벨"""
    GUEST = 0      # 비로그인
    BASIC = 1      # 일반 로그인
    ELEVATED = 2   # Step-up 완료

class StepUpAuthManager:
    """Step-up 인증 관리"""

    def __init__(self):
        self.sessions = {}  # 사용자별 세션 저장

    def check_permission(self, user_id: str, required_level: AuthLevel) -> bool:
        """권한 확인"""
        session = self.sessions.get(user_id)

        # 세션이 없으면 거부
        if not session:
            return False

        # 시간 만료 확인
        if datetime.now() > session['expires_at']:
            # 만료된 경우 Level 1로 강등
            session['level'] = AuthLevel.BASIC
            session['expires_at'] = datetime.max

        # 현재 레벨이 요구 레벨보다 낮으면 거부
        return session['level'].value >= required_level.value

    def step_up_auth(self, user_id: str, password: str) -> bool:
        """Step-up 인증 수행"""

        # 비밀번호 검증 (실제로는 DB와 비교)
        if not self._verify_password(user_id, password):
            return False

        # Level 2로 승격 (10분간 유효)
        self.sessions[user_id] = {
            'level': AuthLevel.ELEVATED,
            'expires_at': datetime.now() + timedelta(minutes=10)
        }

        return True

    def _verify_password(self, user_id: str, password: str) -> bool:
        """비밀번호 검증 (더미)"""
        # 실제로는 해시 비교
        return password == "correct_password"


# 사용 예시
auth_manager = StepUpAuthManager()

# 사용자가 로그인 (Level 1)
auth_manager.sessions["user123"] = {
    'level': AuthLevel.BASIC,
    'expires_at': datetime.max  # 일반 세션은 만료 없음
}

# 잔액 조회 (Level 1 필요)
if auth_manager.check_permission("user123", AuthLevel.BASIC):
    print("✅ 잔액: 1,000,000원")

# 송금 시도 (Level 2 필요)
if auth_manager.check_permission("user123", AuthLevel.ELEVATED):
    print("✅ 송금 진행")
else:
    print("⚠️ 추가 인증이 필요합니다")

    # Step-up Auth 수행
    password = input("비밀번호를 입력하세요: ")
    if auth_manager.step_up_auth("user123", password):
        print("✅ 인증 성공! 송금을 진행합니다")
    else:
        print("❌ 인증 실패")
```

**각 부분 설명**:

1. **AuthLevel**: 인증 레벨을 정의 (GUEST < BASIC < ELEVATED)
2. **check_permission**: 현재 레벨이 요구 레벨보다 높은지 확인
3. **step_up_auth**: 추가 인증을 통해 Level 2로 승격
4. **expires_at**: Level 2는 10분 후 자동 만료

### 실무 구현 예시

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer

app = FastAPI()
security = HTTPBearer()
auth_manager = StepUpAuthManager()

@app.get("/balance")
def get_balance(token: str = Depends(security)):
    """잔액 조회 (Level 1 필요)"""
    user_id = extract_user_id(token)

    if not auth_manager.check_permission(user_id, AuthLevel.BASIC):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    return {"balance": 1000000}

@app.post("/transfer")
def transfer_money(
    amount: int,
    to_account: str,
    token: str = Depends(security)
):
    """송금 (Level 2 필요)"""
    user_id = extract_user_id(token)

    # Step-up 인증 확인
    if not auth_manager.check_permission(user_id, AuthLevel.ELEVATED):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Step-up authentication required"
        )

    # 송금 진행
    return {"message": f"{amount}원이 {to_account}로 송금되었습니다"}

@app.post("/step-up")
def step_up(password: str, token: str = Depends(security)):
    """Step-up 인증"""
    user_id = extract_user_id(token)

    if auth_manager.step_up_auth(user_id, password):
        return {"message": "Step-up 인증 성공", "expires_in": 600}
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
```

**동작 흐름**:
```
1. 사용자가 /balance 호출 → Level 1이면 OK
2. 사용자가 /transfer 호출 → Level 2 필요 → 403 에러
3. 사용자가 /step-up 호출 (비밀번호 전송) → Level 2로 승격
4. 사용자가 다시 /transfer 호출 → 이제 OK
```

## 🎯 Step-up Auth vs 일반 로그인

| 특성 | 일반 로그인 | Step-up Auth |
|------|------------|--------------|
| **시점** | 앱 실행 시 | 민감한 작업 시 |
| **빈도** | 1회 (세션 유지) | 매번 또는 주기적 |
| **유효 기간** | 길다 (일주일~한달) | 짧다 (5-10분) |
| **보호 대상** | 전체 앱 접근 | 특정 민감 작업 |
| **사용자 경험** | 편리 (한번만) | 약간 불편 (반복) |
| **보안 수준** | 기본 | 높음 |

### 언제 어떤 것을 사용할까?

```
일반 로그인만으로 충분:
- 게시글 보기/쓰기
- 친구 목록 보기
- 일반 설정 변경

Step-up Auth 필요:
- 송금, 결제
- 비밀번호 변경
- 개인정보 조회
- 계정 삭제
- 권한 변경
```

## 🔒 보안 Best Practices

### 1. 적절한 시간 제한

```python
# 너무 길면 위험, 너무 짧으면 불편
STEP_UP_DURATION = {
    '송금': timedelta(minutes=5),   # 짧게
    '설정 변경': timedelta(minutes=15),  # 좀 길게
    '관리자 작업': timedelta(minutes=3)   # 매우 짧게
}
```

### 2. 인증 방법 다양화

```python
# 작업의 민감도에 따라 다른 인증 방법
STEP_UP_METHODS = {
    '비밀번호 변경': ['password', 'otp'],  # 2가지 필요
    '소액 송금': ['password'],  # 비밀번호만
    '대액 송금': ['password', 'otp', 'biometric']  # 3가지 필요
}
```

### 3. 로깅 및 모니터링

```python
def step_up_with_audit(user_id: str, action: str):
    """Step-up 시도 기록"""
    log_security_event(
        user_id=user_id,
        action=f"step_up_attempt: {action}",
        timestamp=datetime.now(),
        ip_address=request.remote_addr
    )
```

## 🔗 관련 용어

- [[Token 인증]]: Step-up Auth의 기반이 되는 인증 방식
- [[MFA]]: Step-up Auth의 한 형태 (Multi-Factor Authentication)
- [[Audit Log]]: Step-up 시도를 기록하는 로그
- [[세션 관리]]: Step-up 상태를 관리하는 방법

## 📚 참고자료

- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [OAuth 2.0 Step-up Authentication](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-step-up-authn-challenge)

---
*카테고리: 보안*
*생성일: 2026-02-14*
