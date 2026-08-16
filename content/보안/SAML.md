# SAML (Security Assertion Markup Language)

## 📝 정의

**SAML은 기업용 Single Sign-On(SSO)을 위한 표준 XML 기반 프로토콜입니다.**

직원이 **한 번 로그인**하면 Gmail, Salesforce, Slack, Zoom 등 회사에서 사용하는 **모든 서비스**에 자동으로 로그인되는 마법 같은 기술입니다. 각 서비스마다 다시 로그인할 필요가 없습니다!

## 🎯 핵심 개념

### 1. **3가지 주체**


| 주체 | 역할 | 예시 |
|---|---|---|
| **User** | 서비스를 사용하려는 사람 | 회사 직원 |
| **Identity Provider (IdP)** | 신원 확인 및 인증 담당 | Okta, Auth0, Azure AD, Google Workspace |
| **Service Provider (SP)** | 실제 서비스 제공 | Salesforce, Slack, Zoom, AWS |

### 2. **SAML Assertion**
- **신원 보증서**: "이 사람은 우리 회사의 홍길동이 맞습니다"
- XML 형식으로 작성
- 디지털 서명으로 위조 방지
- 유효기간 포함 (보통 5분)

### 3. **SSO (Single Sign-On)**
- **한 번 로그인**으로 모든 서비스 접속
- 각 서비스마다 비밀번호 기억할 필요 없음
- 퇴사 시 IdP에서만 계정 비활성화하면 모든 서비스 접근 차단

## 🤔 왜 필요한가? (문제와 해결)

### 문제 1: 비밀번호 피로 (Password Fatigue)

```
SAML 없이 (직원이 사용하는 서비스):
- Gmail: gmail_pw_123
- Salesforce: sales_456
- Slack: slack_789
- Zoom: zoom_abc
- AWS: aws_def
- Jira: jira_ghi
... (총 20개 서비스)

문제점:
1. 20개 비밀번호 외우기 불가능
2. 같은 비밀번호 재사용 → 보안 위험
3. 비밀번호 찾기 요청 빈발 → 헬프데스크 업무 폭증
4. 각 서비스마다 로그인 → 시간 낭비
```

**SAML 해결법:**
```
1. 아침에 회사 PC 켜고 Windows(Azure AD)에 로그인
2. 이후 모든 서비스 자동 로그인!
   - Gmail 접속 → 자동 로그인
   - Salesforce 접속 → 자동 로그인
   - Slack 열기 → 자동 로그인
   - Zoom 시작 → 자동 로그인

3. 직원은 회사 비밀번호 1개만 기억
4. IT 팀은 IdP에서 중앙 관리
```

### 문제 2: 퇴사자 계정 관리의 악몽

```
SAML 없이 (직원 퇴사 시):
1. Gmail 계정 비활성화 ✓
2. Salesforce 계정 비활성화 ✓
3. Slack 계정 비활성화... 어? 깜빡했다!
4. AWS 계정은?
5. Jira는?
6. 누락된 서비스에서 전 직원이 여전히 접근 가능 🚨
```

**SAML 해결법:**
```python
# IdP에서 한 번만 비활성화
user = idp.get_user("honggildong@company.com")
user.deactivate()  # 이 명령 하나로 끝!

# 자동으로 모든 연결된 서비스에서 접근 차단:
# - Gmail ✓
# - Salesforce ✓
# - Slack ✓
# - Zoom ✓
# - AWS ✓
# - Jira ✓
# ... 모든 SAML 연동 서비스 ✓
```

### 문제 3: 각 서비스마다 사용자 관리

```
SAML 없이:
- Gmail에서 유저 추가
- Salesforce에서 유저 추가
- Slack에서 유저 추가
→ 같은 작업을 20번 반복
→ 실수로 누락하거나 잘못된 권한 부여

신입 입사 시:
IT 팀: "오늘 3명 입사했는데... 20개 서비스 × 3명 = 60번 계정 생성... 😭"
```

**SAML 해결법:**
```python
# IdP에서 한 번만 추가
new_employee = {
    "email": "newbie@company.com",
    "name": "신입이",
    "department": "개발팀",
    "role": "Engineer"
}
idp.create_user(new_employee)

# SAML 연동된 모든 서비스에 자동으로 계정 생성 (Just-In-Time Provisioning)
# 또는 첫 접속 시 자동 생성

# 권한도 부서/역할에 따라 자동 부여
if user.department == "개발팀":
    grant_access_to(["GitHub", "AWS", "Jira", "Confluence"])
elif user.department == "영업팀":
    grant_access_to(["Salesforce", "HubSpot", "Gmail"])
```

## 📊 구조

```도해
층: SAML, 어떻게 나뉘어 있나
SAML 생태계 :: 사용자 홍길동 · IdP Azure AD 회사 인증 서버 · SP1 Gmail · SP2 Salesforc…
SAML Assertion 내용 :: 사용자 정보 email, name, department · 권한 정보 role, groups · 유효기간…
```

### SAML Assertion 예시 (XML)

```xml
<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
    <saml:Issuer>https://idp.company.com</saml:Issuer>
    <saml:Subject>
        <saml:NameID>honggildong@company.com</saml:NameID>
    </saml:Subject>
    <saml:Conditions NotBefore="2024-02-15T09:00:00Z"
                     NotOnOrAfter="2024-02-15T09:05:00Z" />
    <saml:AttributeStatement>
        <saml:Attribute Name="email">
            <saml:AttributeValue>honggildong@company.com</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="name">
            <saml:AttributeValue>홍길동</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="department">
            <saml:AttributeValue>개발팀</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="role">
            <saml:AttributeValue>Senior Engineer</saml:AttributeValue>
        </saml:Attribute>
    </saml:AttributeStatement>
    <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <!-- IdP의 디지털 서명 -->
    </Signature>
</saml:Assertion>
```

## 🔄 작동 원리 (SP-Initiated Flow)


### 동작 과정 설명

1. **서비스 접근**: 사용자가 Salesforce 접속 시도
2. **IdP 리다이렉트**: Salesforce가 사용자를 회사 IdP로 보냄
3. **로그인 (필요 시)**: IdP 세션 없으면 로그인, 있으면 스킵
4. **Assertion 생성**: IdP가 사용자 정보 + 디지털 서명 담은 XML 생성
5. **Assertion 전달**: 사용자 브라우저를 통해 Salesforce로 전달 (POST)
6. **검증**: Salesforce가 서명, 유효기간, 대상 확인
7. **로그인 완료**: 검증 통과 시 Salesforce 세션 생성
8. **다른 서비스**: Slack 접속 시 IdP 세션 재사용 → 즉시 로그인

## 🏠 일상적 비유

SAML은 **VIP 라운지 회원권**과 같습니다:

| 일반 입장 (SAML 없이) | VIP 회원권 (SAML) |
|---|---|
| 클럽마다 별도 회원가입 필요 | VIP 회원권 하나로 모든 제휴 클럽 입장 |
| 각 클럽마다 신분증 제시 | 첫 클럽에서만 신분 확인, 이후 자동 |
| 회원권 분실 시 클럽마다 재발급 | VIP 라운지 1곳에서 관리 |
| 회원 탈퇴 시 각 클럽 개별 처리 | VIP 회원권 취소 시 모든 제휴 클럽 자동 차단 |

**또 다른 비유: 대사관 발급 외교관 카드**
- 외교부(IdP)가 발급한 카드 하나로
- 모든 관공서, 공항, 호텔 자동 인증
- 카드에 사진, 이름, 직급 포함 (SAML Assertion)
- 위조 방지 홀로그램 (디지털 서명)

## 💼 P3 시스템 실제 사례

### 상황: P3 관리자 대시보드에 SAML SSO 적용

회사 직원들이 P3 관리자 대시보드에 접속할 때 회사 계정(Azure AD)으로 자동 로그인되도록 설정합니다.

### 1. Azure AD에서 SAML 앱 등록

```bash
Azure Portal 설정:
1. Azure Active Directory > Enterprise applications
2. "New application" > "Create your own application"
3. Name: "P3 Admin Dashboard"
4. "Integrate any other application (Non-gallery)"

5. Single sign-on > SAML 선택

6. Basic SAML Configuration:
   - Identifier (Entity ID): https://p3-admin.company.com/saml/metadata
   - Reply URL (ACS URL): https://p3-admin.company.com/saml/acs
   - Sign on URL: https://p3-admin.company.com

7. User Attributes & Claims:
   - email: user.mail
   - name: user.displayname
   - department: user.department
   - role: user.jobtitle

8. SAML Signing Certificate:
   - Download: "Certificate (Base64)"
   - Copy: "Login URL", "Logout URL"
```

### 2. Python 백엔드 SAML 구현 (python3-saml)

```python
# p3_backend/auth/saml_config.py
import os
from onelogin.saml2.settings import OneLogin_Saml2_Settings

SAML_SETTINGS = {
    "strict": True,
    "debug": False,
    "sp": {  # Service Provider (P3)
        "entityId": "https://p3-admin.company.com/saml/metadata",
        "assertionConsumerService": {
            "url": "https://p3-admin.company.com/saml/acs",
            "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        },
        "singleLogoutService": {
            "url": "https://p3-admin.company.com/saml/sls",
            "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
        },
        "NameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "x509cert": os.getenv("SAML_SP_CERT"),  # SP 인증서 (선택)
        "privateKey": os.getenv("SAML_SP_KEY")  # SP Private Key (선택)
    },
    "idp": {  # Identity Provider (Azure AD)
        "entityId": "https://sts.windows.net/{tenant-id}/",
        "singleSignOnService": {
            "url": "https://login.microsoftonline.com/{tenant-id}/saml2",
            "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
        },
        "singleLogoutService": {
            "url": "https://login.microsoftonline.com/{tenant-id}/saml2",
            "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
        },
        "x509cert": """-----BEGIN CERTIFICATE-----
        MIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBaMQswCQYDVQQGEwJJ
        ... (Azure AD에서 다운로드한 인증서)
        -----END CERTIFICATE-----"""
    }
}

# p3_backend/auth/saml_routes.py
from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse
from onelogin.saml2.auth import OneLogin_Saml2_Auth

router = APIRouter()

def prepare_flask_request(request: Request):
    """FastAPI Request를 python3-saml 형식으로 변환"""
    return {
        'https': 'on' if request.url.scheme == 'https' else 'off',
        'http_host': request.url.hostname,
        'script_name': request.url.path,
        'server_port': request.url.port,
        'get_data': dict(request.query_params),
        'post_data': {},  # POST 시 채워짐
    }

@router.get("/saml/login")
async def saml_login(request: Request):
    """SAML SSO 시작"""
    req = prepare_flask_request(request)
    auth = OneLogin_Saml2_Auth(req, SAML_SETTINGS)

    # IdP로 리다이렉트
    return RedirectResponse(auth.login())

@router.post("/saml/acs")
async def saml_acs(request: Request):
    """Assertion Consumer Service - SAML Assertion 수신"""
    req = prepare_flask_request(request)
    req['post_data'] = await request.form()

    auth = OneLogin_Saml2_Auth(req, SAML_SETTINGS)
    auth.process_response()

    errors = auth.get_errors()
    if errors:
        logger.error(f"SAML 인증 실패: {', '.join(errors)}")
        return {"error": "Authentication failed"}

    if not auth.is_authenticated():
        return {"error": "Not authenticated"}

    # SAML Assertion에서 사용자 정보 추출
    attributes = auth.get_attributes()
    user_data = {
        "email": attributes.get("email", [None])[0],
        "name": attributes.get("name", [None])[0],
        "department": attributes.get("department", [None])[0],
        "role": attributes.get("role", [None])[0]
    }

    # 이메일 도메인 검증
    if not user_data["email"].endswith("@company.com"):
        return {"error": "회사 이메일만 허용됩니다"}

    # DB에서 사용자 조회 또는 생성 (JIT Provisioning)
    user = db.get_or_create_user(**user_data)

    # 부서/역할에 따라 권한 자동 부여
    if user_data["department"] == "인사팀":
        assign_role(user, "P3_ADMIN")
    elif user_data["department"] == "개발팀":
        assign_role(user, "P3_DEVELOPER")
    else:
        assign_role(user, "P3_VIEWER")

    # 세션 또는 JWT 생성
    session_token = create_session(user.id)

    # 대시보드로 리다이렉트
    response = RedirectResponse(url="/dashboard")
    response.set_cookie("session", session_token, httponly=True, secure=True)
    return response

@router.get("/saml/metadata")
async def saml_metadata(request: Request):
    """SP Metadata 제공 (IdP 설정 시 필요)"""
    req = prepare_flask_request(request)
    auth = OneLogin_Saml2_Auth(req, SAML_SETTINGS)
    settings = auth.get_settings()
    metadata = settings.get_sp_metadata()

    return Response(content=metadata, media_type="application/xml")

@router.get("/saml/logout")
async def saml_logout(request: Request):
    """SAML SSO 로그아웃"""
    req = prepare_flask_request(request)
    auth = OneLogin_Saml2_Auth(req, SAML_SETTINGS)

    # IdP에 로그아웃 요청
    return RedirectResponse(auth.logout())
```

### 3. Just-In-Time (JIT) Provisioning

```python
# p3_backend/auth/jit_provisioning.py

def get_or_create_user(email: str, name: str, department: str, role: str):
    """SAML 로그인 시 사용자 자동 생성"""
    user = db.query(User).filter_by(email=email).first()

    if not user:
        logger.info(f"신규 사용자 생성: {email}")
        user = User(
            email=email,
            name=name,
            department=department,
            role=role,
            auth_method="SAML",
            created_at=datetime.now()
        )
        db.add(user)
        db.commit()

        # Slack 알림
        send_slack_message(
            f"🆕 P3 신규 사용자: {name} ({department})"
        )
    else:
        # 기존 사용자 정보 업데이트
        user.name = name
        user.department = department
        user.role = role
        user.last_login = datetime.now()
        db.commit()

    return user

def assign_role(user: User, role_name: str):
    """부서/역할에 따른 권한 자동 부여"""
    role_permissions = {
        "P3_ADMIN": ["read", "write", "delete", "admin"],
        "P3_DEVELOPER": ["read", "write"],
        "P3_VIEWER": ["read"]
    }

    permissions = role_permissions.get(role_name, ["read"])

    user.permissions = permissions
    db.commit()
    logger.info(f"권한 부여: {user.email} → {permissions}")
```

## 💻 코드 구현 (간단하게)

### 1. SAML 라이브러리 선택

```bash
# Python
pip install python3-saml

# Node.js
npm install passport-saml

# Java (Spring Boot)
# spring-boot-starter-security-saml2
```

### 2. 간단한 SAML 흐름

```python
from onelogin.saml2.auth import OneLogin_Saml2_Auth

# 1. 로그인 시작
@app.route('/saml/login')
def saml_login():
    auth = OneLogin_Saml2_Auth(request, saml_settings)
    return redirect(auth.login())  # IdP로 리다이렉트

# 2. SAML Assertion 수신
@app.route('/saml/acs', methods=['POST'])
def saml_acs():
    auth = OneLogin_Saml2_Auth(request, saml_settings)
    auth.process_response()

    if auth.is_authenticated():
        user_data = {
            'email': auth.get_nameid(),  # user@company.com
            'attributes': auth.get_attributes()  # {name, department, ...}
        }

        # 세션 생성
        session['user'] = user_data
        return redirect('/dashboard')
    else:
        return "Authentication failed", 401
```

### 3. SAML Metadata 생성

```python
from onelogin.saml2.settings import OneLogin_Saml2_Settings

settings = OneLogin_Saml2_Settings(saml_settings)
metadata = settings.get_sp_metadata()

# XML 형식의 SP Metadata
print(metadata)
# <?xml version="1.0"?>
# <md:EntityDescriptor ...>
#   <md:SPSSODescriptor ...>
#     <md:AssertionConsumerService .../>
#   </md:SPSSODescriptor>
# </md:EntityDescriptor>
```

## 🔄 SAML vs OAuth vs LDAP

| 특성 | SAML | OAuth 2.0 | LDAP |
|---|---|---|---|
| **목적** | 기업 SSO | 권한 위임 | 디렉터리 서비스 |
| **사용자** | 기업 직원 | 일반 사용자 | 기업 내부 |
| **프로토콜** | XML | JSON/HTTP | Binary |
| **모바일 지원** | ⭐⭐ 보통 | ⭐⭐⭐⭐ 우수 | ⭐ 약함 |
| **복잡도** | ⭐⭐⭐⭐ 복잡 | ⭐⭐⭐ 중간 | ⭐⭐ 간단 |
| **적용 사례** | 회사 내부 서비스 SSO | 소셜 로그인 | Active Directory |
| **표준화** | ✅ OASIS 표준 | ✅ IETF 표준 | ✅ IETF 표준 |

### 언제 SAML을 쓸까?

✅ **SAML이 적합한 경우:**
- 기업 내부 서비스 SSO
- 직원 계정 중앙 관리
- Okta, Azure AD 같은 IdP 사용 중
- B2B SaaS 제품 (고객사 SSO 연동)

❌ **SAML이 과한 경우:**
- B2C 서비스 (일반 소비자 대상) → OAuth 사용
- 모바일 앱 주력 서비스 → OAuth/OIDC 사용
- 간단한 내부 인증 → LDAP 직접 연동

## ⚠️ 보안 주의사항

### 1. Assertion 서명 검증 필수

```python
# ❌ 나쁜 예: 서명 검증 안 함
def verify_saml_assertion(assertion):
    # 그냥 XML 파싱만 함
    user_email = parse_xml(assertion).get("email")
    return user_email  # 위험! 위조된 Assertion일 수 있음

# ✅ 좋은 예: 서명 검증
def verify_saml_assertion(assertion, idp_cert):
    # 1. IdP Public Key로 서명 검증
    if not verify_signature(assertion, idp_cert):
        raise Exception("Invalid signature")

    # 2. 유효기간 확인
    if is_expired(assertion):
        raise Exception("Assertion expired")

    # 3. Audience 확인 (이 Assertion이 우리한테 온 게 맞나?)
    if assertion.audience != "https://p3-admin.company.com":
        raise Exception("Invalid audience")

    return parse_user_data(assertion)
```

### 2. Assertion 재사용 방지

```python
# Assertion ID 추적 (Redis)
def check_assertion_reuse(assertion_id: str) -> bool:
    """Assertion 재사용 방지"""
    key = f"saml_assertion:{assertion_id}"

    if redis_client.exists(key):
        logger.warning(f"⚠️ Assertion 재사용 시도: {assertion_id}")
        return False  # 이미 사용됨

    # 5분간 저장 (Assertion 유효기간)
    redis_client.setex(key, 300, "used")
    return True  # 처음 사용
```

### 3. HTTPS 필수

```nginx
# ❌ 나쁜 예: HTTP로 SAML
server {
    listen 80;
    server_name p3-admin.company.com;
    # SAML Assertion이 평문으로 전송됨 → 탈취 위험
}

# ✅ 좋은 예: HTTPS만 허용
server {
    listen 443 ssl http2;
    server_name p3-admin.company.com;

    ssl_certificate /etc/letsencrypt/live/p3-admin.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/p3-admin.company.com/privkey.pem;
}
```

### 4. Metadata 보안

```python
# ❌ 나쁜 예: IdP Metadata를 공개 URL에서 매번 가져옴
def get_idp_metadata():
    response = requests.get("https://idp.company.com/metadata")
    return response.text  # MITM 공격에 취약

# ✅ 좋은 예: Metadata를 로컬에 저장
# 1. IdP Metadata를 다운로드 (최초 1회)
# 2. 환경변수 또는 config 파일에 저장
# 3. 주기적으로 수동 업데이트
IDP_METADATA = os.getenv("IDP_METADATA")  # 로컬에서 읽기
```

## 🔗 관련 용어

- **[[SSO]]**: Single Sign-On (한 번 로그인으로 여러 서비스 접근)
- **[[OAuth]]**: 권한 위임 프로토콜 (SAML보다 현대적)
- **[[OpenID Connect (OIDC)]]**: OAuth 2.0 기반 인증 (SAML의 현대적 대안)
- **[[IdP]]**: Identity Provider (신원 확인 서버)
- **[[Azure AD]]**: Microsoft의 클라우드 IdP
- **[[Okta]]**: 인기 있는 클라우드 IdP
- **[[LDAP]]**: Lightweight Directory Access Protocol (기업 디렉터리 서비스)

## 📝 정리

### 핵심 3줄
1. **SAML = 기업용 마스터키**: 한 번 로그인으로 모든 회사 서비스 자동 접속
2. **중앙 관리**: IdP에서 계정 생성/삭제하면 모든 서비스에 자동 반영
3. **XML + 디지털 서명**: 신원 보증서(SAML Assertion)를 안전하게 전달

### SAML vs OAuth 선택 가이드
| 상황 | 추천 |
|---|---|
| 회사 직원용 내부 서비스 | SAML |
| 일반 사용자 대상 서비스 | OAuth/OIDC |
| 모바일 앱 | OAuth/OIDC |
| Azure AD/Okta 사용 중 | SAML (둘 다 지원) |
| 간단한 소셜 로그인 | OAuth |
| 기업 고객 SSO 연동 (B2B SaaS) | SAML |

### 실무 체크리스트
- [ ] IdP 선택 (Azure AD, Okta, Auth0 등)
- [ ] SP Metadata 생성 및 IdP 등록
- [ ] IdP 인증서 다운로드 및 검증 로직 구현
- [ ] HTTPS 사용 (필수!)
- [ ] Assertion 서명 검증 구현
- [ ] Assertion 재사용 방지 (Redis)
- [ ] JIT Provisioning 구현 (자동 계정 생성)
- [ ] 부서/역할 기반 권한 자동 부여
- [ ] 로그아웃 (SLO - Single Logout) 구현

---
*카테고리: 보안*
*관련 프로젝트: P3 (관리자 대시보드 SAML SSO)*
*업데이트: 2024-02-15*
