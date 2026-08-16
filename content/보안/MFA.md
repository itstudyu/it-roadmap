# MFA (Multi-Factor Authentication)

## 📝 정의

MFA는 **두 가지 이상의 인증 방법을 사용하는 보안 기술**입니다. 2FA (2단계 인증)가 가장 흔합니다.

## 💡 인증 요소

```
1. 알고 있는 것: 비밀번호
2. 가지고 있는 것: 스마트폰, OTP
3. 자신의 것: 지문, 얼굴
```

## 🎯 예시

```python
# TOTP (Time-based OTP) 생성
import pyotp

# 비밀 키 생성
secret = pyotp.random_base32()

# OTP 생성기
totp = pyotp.TOTP(secret)

# 현재 OTP 코드
current_code = totp.now()
print(f"OTP 코드: {current_code}")  # 6자리 숫자

# 검증
is_valid = totp.verify(current_code)
```

## 📝 정리

```
MFA = 다중 인증
→ 비밀번호 + OTP
→ 해킹 방지
→ Google Authenticator 등
```

---
*카테고리: 보안*
