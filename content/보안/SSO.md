# SSO (Single Sign-On)

## 📝 정의

SSO(Single Sign-On, 단일 인증)는 **한 번의 로그인으로 여러 서비스에 접근**할 수 있는 인증 시스템입니다.

### 핵심 개념

- **무엇인가?**: 하나의 계정으로 여러 서비스 사용
- **왜 필요한가?**: 여러 계정 관리의 복잡성과 보안 위험
- **어떻게 작동하나?**: 중앙 인증 서버 → 모든 서비스에 인증 정보 공유

### SSO가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 회사 시스템 10개
직원 → 이메일 로그인 (ID/PW 1)
직원 → 인사 시스템 로그인 (ID/PW 2)
직원 → 급여 시스템 로그인 (ID/PW 3)
...
→ 10개 비밀번호 기억
→ 비밀번호 재사용 (보안 취약)! 😱
```

**SSO의 해결**:
```
✅ 한 번만 로그인:
직원 → SSO 로그인 (한 번만!)
→ 이메일 자동 로그인
→ 인사 시스템 자동 로그인
→ 급여 시스템 자동 로그인
→ 편리 + 보안! ✅
```

**비유**:
- **SSO 없음** = 건물마다 다른 출입증
- **SSO** = 하나의 사원증으로 모든 건물 출입

## 📊 SSO 흐름

```도해
흐름: SSO, 무슨 순서로 오가나
사용자 :: 앱 1 접속
앱 1 (Gmail) :: 인증 확인
SSO 서버 (Identity… :: 로그인 화면
사용자 :: ID/PW 입력
SSO 서버 (Identity… :: 인증 토큰
앱 1 (Gmail) :: 접속 허용
사용자 :: 앱 2 접속
앱 2 (Drive) :: 인증 확인
SSO 서버 (Identity… :: 인증 토큰 (재로그인 불필요!)
앱 2 (Drive) :: 접속 허용
```

## 💡 SSO 프로토콜

### 1. SAML 2.0 (가장 일반적)
```xml
<!-- SAML Assertion (인증 정보) -->
<saml:Assertion>
  <saml:Subject>
    <saml:NameID>user@company.com</saml:NameID>
  </saml:Subject>
  <saml:Conditions>
    <saml:AudienceRestriction>
      <saml:Audience>https://app.example.com</saml:Audience>
    </saml:AudienceRestriction>
  </saml:Conditions>
  <saml:AttributeStatement>
    <saml:Attribute Name="email">
      <saml:AttributeValue>user@company.com</saml:AttributeValue>
    </saml:Attribute>
    <saml:Attribute Name="role">
      <saml:AttributeValue>admin</saml:AttributeValue>
    </saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>
```

### 2. OAuth 2.0 / OIDC
```python
from flask import Flask, redirect, request, session
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
oauth = OAuth(app)

# SSO Provider 설정 (Google)
google = oauth.register(
    name='google',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route('/login')
def login():
    """SSO 로그인 시작"""
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    """SSO 콜백"""
    token = google.authorize_access_token()
    user_info = google.parse_id_token(token)
    
    # 세션에 사용자 정보 저장
    session['user'] = user_info
    
    return redirect('/')

@app.route('/')
def index():
    user = session.get('user')
    if not user:
        return redirect('/login')
    
    return f"Welcome {user['email']}!"
```

### 3. CAS (Central Authentication Service)
```python
from flask_cas import CAS

app = Flask(__name__)
cas = CAS(app)

app.config['CAS_SERVER'] = 'https://sso.company.com'
app.config['CAS_AFTER_LOGIN'] = 'index'

@app.route('/')
@cas.login_required
def index():
    """CAS로 보호된 페이지"""
    username = cas.username
    return f"Welcome {username}!"

@app.route('/logout')
def logout():
    cas.logout()
    return redirect('/')
```

## 💡 엔터프라이즈 SSO 구현

### Identity Provider 설정 (Okta 예시)
```python
import okta

# Okta 설정
okta_config = {
    'orgUrl': 'https://dev-123456.okta.com',
    'token': 'YOUR_API_TOKEN'
}

# 사용자 프로비저닝
def create_user(email, first_name, last_name):
    """Okta에 사용자 생성"""
    user_profile = {
        'email': email,
        'firstName': first_name,
        'lastName': last_name,
        'login': email
    }
    
    okta_client = okta.UsersClient(okta_config)
    user = okta_client.create_user(user_profile)
    
    return user

# 앱에 사용자 할당
def assign_app(user_id, app_id):
    """사용자에게 앱 접근 권한 부여"""
    okta_client = okta.AppsClient(okta_config)
    okta_client.assign_user_to_app(app_id, {
        'id': user_id
    })
```

### Service Provider 구현
```python
from flask import Flask, redirect, request
from onelogin.saml2.auth import OneLogin_Saml2_Auth

app = Flask(__name__)

def init_saml_auth(req):
    """SAML 인증 초기화"""
    auth = OneLogin_Saml2_Auth(req, {
        'sp': {
            'entityId': 'https://myapp.com/metadata',
            'assertionConsumerService': {
                'url': 'https://myapp.com/saml/acs',
            },
        },
        'idp': {
            'entityId': 'https://sso.company.com/metadata',
            'singleSignOnService': {
                'url': 'https://sso.company.com/sso',
            },
            'x509cert': 'MIICajCCAdOgAwIBAgIBAD...',
        }
    })
    return auth

@app.route('/saml/login')
def saml_login():
    """SAML SSO 로그인"""
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    
    return redirect(auth.login())

@app.route('/saml/acs', methods=['POST'])
def saml_acs():
    """SAML Assertion Consumer Service"""
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    
    auth.process_response()
    
    if not auth.is_authenticated():
        return "Authentication failed", 401
    
    # 사용자 정보 추출
    user_data = {
        'email': auth.get_nameid(),
        'attributes': auth.get_attributes()
    }
    
    session['user'] = user_data
    
    return redirect('/')
```

## 🎯 주요 SSO 제공업체

| 제공업체 | 특징 | 사용 사례 |
|---------|------|----------|
| **Okta** | 엔터프라이즈 표준 | 대기업 |
| **Auth0** | 개발자 친화적 | 스타트업 |
| **Azure AD** | Microsoft 생태계 | Office 365 통합 |
| **Google Workspace** | Google 생태계 | Gmail, Drive 통합 |
| **Keycloak** | 오픈소스 | 자체 호스팅 |

## 💡 SSO + MFA (Multi-Factor Authentication)

```python
# SSO와 2단계 인증 결합
@app.route('/login')
def login():
    # 1단계: SSO 로그인
    user = sso_login()
    
    # 2단계: MFA 확인
    if requires_mfa(user):
        send_otp(user.phone)
        return redirect('/verify-otp')
    
    return redirect('/')

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    otp = request.form['otp']
    
    if verify_otp_code(otp):
        session['mfa_verified'] = True
        return redirect('/')
    
    return "Invalid OTP", 401
```

## ⚠️ SSO 보안 고려사항

### 1. Session 타임아웃
```python
from datetime import timedelta

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=8)

@app.route('/')
def check_session():
    if 'user' not in session:
        return redirect('/login')
    
    # 마지막 활동 시간 확인
    if session.get('last_activity'):
        inactive_time = datetime.now() - session['last_activity']
        if inactive_time > timedelta(minutes=30):
            session.clear()
            return redirect('/login')
    
    session['last_activity'] = datetime.now()
```

### 2. Single Logout (SLO)
```python
@app.route('/logout')
def logout():
    """모든 연결된 서비스에서 로그아웃"""
    # 1. 로컬 세션 삭제
    session.clear()
    
    # 2. SSO Provider에 로그아웃 요청
    return redirect('https://sso.company.com/logout?returnTo=https://myapp.com')
```

## 🔗 관련 용어

- [[OAuth]]: SSO에서 사용되는 프로토콜
- [[SAML]]: SSO 표준 프로토콜
- [[MFA]]: SSO와 함께 사용되는 보안 강화

---
*카테고리: 보안*
*생성일: 2026-02-14*
