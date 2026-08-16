# OAuth 2.0

## 📝 정의

**OAuth 2.0은 제3자 애플리케이션에게 사용자 정보 접근 권한을 안전하게 위임하는 표준 프로토콜입니다.**

사용자가 비밀번호를 직접 공유하지 않고도, 다른 앱이 내 Google 사진, Facebook 친구 목록 등에 접근할 수 있도록 **제한적인 권한**을 부여하는 메커니즘입니다.

## 🎯 핵심 개념

### 1. **4가지 역할 (Roles)**


| 역할 | 설명 | 예시 |
|---|---|---|
| **Resource Owner** | 자원(데이터)의 소유자 | 당신 (사용자) |
| **Client** | 자원에 접근하려는 앱 | 캔바, 노션, Zoom |
| **Authorization Server** | 권한을 부여하는 서버 | Google 로그인 서버 |
| **Resource Server** | 실제 자원을 제공하는 서버 | Google Photos API |

### 2. **Access Token**
- 자원에 접근할 수 있는 **임시 열쇠**
- 보통 1시간 정도 유효
- Bearer Token 형태: `Authorization: Bearer eyJhbGc...`

### 3. **Refresh Token**
- Access Token이 만료되면 **새로 발급받기** 위한 토큰
- 장기간 유효 (주 ~ 월)
- 더 엄격하게 보안 관리

### 4. **Scope (권한 범위)**
- 앱이 요청하는 **구체적인 권한**
- 예: `email`, `profile`, `photos.read`, `calendar.write`

## 🤔 왜 필요한가? (문제와 해결)

### 문제 1: 비밀번호 공유의 위험

```
옛날 방식 (OAuth 이전):
Canva: "Google 사진 쓰려면 구글 비밀번호 알려주세요"
사용자: "hunter2" ← 비밀번호 직접 입력

문제점:
1. Canva가 내 Gmail도 읽을 수 있음 (과도한 권한)
2. Canva가 비밀번호를 저장할 수 있음 (보안 위험)
3. 비밀번호 변경 시 모든 앱에서 다시 로그인
4. Canva만 차단할 방법이 없음 (비밀번호 바꾸면 전부 차단)
```

**OAuth 해결법:**
```
1. 사용자: "Google로 로그인" 버튼 클릭
2. Google 로그인 페이지로 이동 (비밀번호는 Google에만 입력)
3. Canva가 요청하는 권한 확인:
   "Canva가 다음 권한을 요청합니다:
   - 이메일 주소 보기 ✓
   - Google 사진 보기 및 업로드 ✓
   - Gmail 읽기 ✗ (요청 안 함)"
4. 사용자: "허용" 버튼 클릭
5. Canva는 "사진"만 접근할 수 있는 Token 받음
6. Gmail은 여전히 안전함!
```

### 문제 2: 권한 회수 불가능

```
옛날 방식:
- 앱 10개에 비밀번호를 줌
- 1개 앱이 믿음직스럽지 않음
→ 해결: 비밀번호 변경 (나머지 9개도 다 로그아웃됨!)
```

**OAuth 해결법:**
```python
# Google 계정 설정 > 보안 > 제3자 앱 액세스
connected_apps = [
    {"name": "Canva", "scopes": ["photos"], "revoke": lambda: revoke("canva")},
    {"name": "Zoom", "scopes": ["email"], "revoke": lambda: revoke("zoom")},
    {"name": "의심스러운 앱", "scopes": ["contacts"], "revoke": lambda: revoke("suspicious")}
]

# 의심스러운 앱만 차단
revoke("suspicious")  # 이 앱의 Token만 무효화

# 나머지 앱들은 정상 작동
```

### 문제 3: 세밀한 권한 제어 불가능

```
비밀번호 공유 방식:
앱: "비밀번호 주세요"
→ 모든 권한 (이메일, 사진, 캘린더, 연락처 등)
```

**OAuth 해결법:**
```json
{
  "client_id": "canva-app",
  "scopes": [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/photoslibrary.readonly"
  ],
  "explanation": "이메일 주소와 사진 읽기만 허용, 쓰기는 불가"
}
```

## 📊 구조

```도해
층: OAuth 2.0, 어떻게 나뉘어 있나
OAuth 2.0 구성 요소 :: Client 제3자 앱 캔바, 노션 · Authorization Server 인증 서버 accounts.g…
발급되는 것들 :: Authorization Code 1회용 인증 코드 · Access Token 1시간 유효 · Refres…
```

## 🔄 작동 원리 (Authorization Code Flow)


### 동작 과정 설명

1. **사용자가 "Google로 로그인" 클릭** → Canva가 Google 인증 페이지로 리다이렉트
2. **사용자가 Google에 로그인** → 비밀번호는 Google에만 전달 (Canva는 모름)
3. **권한 승인 화면** → "Canva가 이메일, 사진 접근을 요청합니다"
4. **사용자가 "허용" 클릭** → Google이 Authorization Code 발급 (1회용)
5. **Canva가 Code를 Google에 제출** → Access Token + Refresh Token 받음
6. **Canva가 Token으로 API 호출** → Google Photos API에서 사진 가져옴
7. **Token 만료 시** → Refresh Token으로 새 Access Token 받음

## 🏠 일상적 비유

OAuth는 **대리인에게 특정 업무만 맡기는 위임장**과 같습니다:

| 전통적인 비밀번호 공유 | OAuth |
|---|---|
| 집 열쇠를 청소업체에 줌 | 청소업체에게 "청소만" 가능한 임시 카드 발급 |
| 금고도 열 수 있음 (과도한 권한) | 금고는 열 수 없음 (제한된 권한) |
| 열쇠 분실 시 전체 교체 | 임시 카드만 무효화, 내 열쇠는 그대로 |
| 누가 언제 들어왔는지 모름 | 카드 사용 기록 추적 가능 |
| 열쇠 회수 어려움 | 카드 원격 비활성화 가능 |

**또 다른 비유: 호텔 룸카드**
- 호텔 마스터 키(비밀번호) vs 룸카드(Access Token)
- 룸카드는 특정 방만 열 수 있음
- 체크아웃하면 자동으로 무효화
- 분실해도 마스터 키는 안전

## 💼 P3 시스템 실제 사례

### 상황: Google OAuth로 로그인 구현

P3 관리자 대시보드에 Google OAuth 로그인을 추가합니다.

```python
# settings.py - OAuth 설정
GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
GOOGLE_OAUTH_REDIRECT_URI = "https://p3-admin.example.com/auth/callback"

OAUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

# auth/oauth.py - OAuth 흐름 구현
from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse

app = FastAPI()
oauth = OAuth()

oauth.register(
    name='google',
    client_id=GOOGLE_OAUTH_CLIENT_ID,
    client_secret=GOOGLE_OAUTH_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.get("/login")
async def login(request: Request):
    """1단계: 로그인 시작"""
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    """2단계: 콜백 처리"""
    try:
        # Google에서 Authorization Code로 Token 교환
        token = await oauth.google.authorize_access_token(request)

        # Token으로 사용자 정보 가져오기
        user_info = token.get('userinfo')
        if not user_info:
            user_info = await oauth.google.parse_id_token(request, token)

        # 이메일 도메인 검증 (회사 이메일만 허용)
        email = user_info['email']
        if not email.endswith('@company.com'):
            return {"error": "회사 이메일만 사용 가능합니다"}

        # DB에서 사용자 조회 또는 생성
        user = db.get_or_create_user(
            email=email,
            name=user_info['name'],
            picture=user_info['picture']
        )

        # 세션 또는 JWT 생성
        session_token = create_session(user.id)

        # 대시보드로 리다이렉트
        response = RedirectResponse(url='/dashboard')
        response.set_cookie('session', session_token, httponly=True, secure=True)
        return response

    except Exception as e:
        logger.error(f"OAuth 로그인 실패: {e}")
        return RedirectResponse(url='/login?error=oauth_failed')

@app.get("/api/me")
async def get_current_user(request: Request):
    """현재 로그인한 사용자 정보"""
    session_token = request.cookies.get('session')
    if not session_token:
        return {"error": "Unauthorized"}, 401

    user_id = verify_session(session_token)
    user = db.get_user(user_id)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture
    }
```

### Token 저장 및 갱신

```python
# models.py - OAuth Token 저장
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime

class OAuthToken(Base):
    __tablename__ = 'oauth_tokens'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    provider = Column(String)  # 'google', 'github', 'facebook'
    access_token = Column(String)  # 암호화 저장
    refresh_token = Column(String)  # 암호화 저장
    expires_at = Column(DateTime)
    scopes = Column(JSON)  # ['email', 'profile', 'photos']
    created_at = Column(DateTime, default=datetime.now)

# services/token_refresh.py - Token 갱신
import httpx
from datetime import datetime, timedelta

async def refresh_access_token(user_id: int):
    """Access Token 갱신"""
    # DB에서 Refresh Token 가져오기
    oauth_token = db.query(OAuthToken).filter_by(user_id=user_id).first()

    if not oauth_token:
        raise ValueError("OAuth token not found")

    # Token 만료 확인
    if oauth_token.expires_at > datetime.now():
        return oauth_token.access_token  # 아직 유효함

    # Google에 Refresh Token으로 새 Access Token 요청
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://oauth2.googleapis.com/token',
            data={
                'client_id': GOOGLE_OAUTH_CLIENT_ID,
                'client_secret': GOOGLE_OAUTH_CLIENT_SECRET,
                'refresh_token': oauth_token.refresh_token,
                'grant_type': 'refresh_token'
            }
        )

    token_data = response.json()

    # DB 업데이트
    oauth_token.access_token = token_data['access_token']
    oauth_token.expires_at = datetime.now() + timedelta(seconds=token_data['expires_in'])
    db.commit()

    return token_data['access_token']

# 사용 예시
@app.get("/api/user-photos")
async def get_user_photos(user_id: int):
    """사용자 Google Photos 가져오기"""
    access_token = await refresh_access_token(user_id)  # 자동 갱신

    async with httpx.AsyncClient() as client:
        response = await client.get(
            'https://photoslibrary.googleapis.com/v1/mediaItems',
            headers={'Authorization': f'Bearer {access_token}'}
        )

    return response.json()
```

## 💻 코드 구현 (간단하게)

### 1. Authorization URL 생성

```python
from urllib.parse import urlencode

def build_authorization_url(client_id: str, redirect_uri: str, scopes: list) -> str:
    """OAuth 인증 URL 생성"""
    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',  # Authorization Code Flow
        'scope': ' '.join(scopes),
        'state': generate_random_state(),  # CSRF 방지
        'access_type': 'offline',  # Refresh Token 받기 위함
        'prompt': 'consent'  # 매번 권한 확인 (선택사항)
    }

    base_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    return f"{base_url}?{urlencode(params)}"

# 사용 예시
auth_url = build_authorization_url(
    client_id='abc123.apps.googleusercontent.com',
    redirect_uri='https://myapp.com/callback',
    scopes=['email', 'profile', 'https://www.googleapis.com/auth/photoslibrary.readonly']
)
print(auth_url)
# https://accounts.google.com/o/oauth2/v2/auth?client_id=abc123&redirect_uri=...
```

### 2. Authorization Code → Access Token 교환

```python
import httpx

async def exchange_code_for_token(code: str) -> dict:
    """Authorization Code를 Access Token으로 교환"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': REDIRECT_URI,
                'grant_type': 'authorization_code'
            }
        )

    token_data = response.json()
    return {
        'access_token': token_data['access_token'],
        'refresh_token': token_data.get('refresh_token'),  # 첫 인증 시만 제공
        'expires_in': token_data['expires_in'],  # 3600 (1시간)
        'scope': token_data['scope']
    }
```

### 3. Access Token으로 API 호출

```python
async def call_google_api(access_token: str, endpoint: str):
    """Google API 호출"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'https://www.googleapis.com/oauth2/v1/{endpoint}',
            headers={'Authorization': f'Bearer {access_token}'}
        )

    if response.status_code == 401:
        # Token 만료 → Refresh 필요
        raise TokenExpiredError("Access token expired")

    return response.json()

# 사용자 정보 가져오기
user_info = await call_google_api(access_token, 'userinfo')
print(user_info)
# {
#   "id": "1234567890",
#   "email": "user@gmail.com",
#   "verified_email": true,
#   "name": "홍길동",
#   "picture": "https://..."
# }
```

## 🔄 OAuth vs API Key vs JWT

| 특성 | OAuth 2.0 | API Key | JWT |
|---|---|---|---|
| **목적** | 제3자 권한 위임 | 개발자 식별 | 상태 없는 인증 |
| **복잡도** | ⭐⭐⭐⭐ 매우 복잡 | ⭐ 간단 | ⭐⭐ 중간 |
| **사용자 동의** | ✅ 필수 | ❌ 필요 없음 | ❌ 필요 없음 |
| **권한 범위** | Scope로 세밀하게 제어 | 전체 또는 없음 | Claim으로 제어 |
| **Token 갱신** | Refresh Token | 수동 재발급 | 새로 발급 |
| **적용 사례** | "Google로 로그인" | 날씨 API 호출 | 마이크로서비스 인증 |
| **보안성** | ⭐⭐⭐⭐⭐ 매우 높음 | ⭐⭐ 보통 | ⭐⭐⭐⭐ 높음 |

### 언제 OAuth를 쓸까?

✅ **OAuth가 적합한 경우:**
- 소셜 로그인 (Google, Facebook, GitHub)
- 제3자 앱에 내 데이터 접근 허용
- 사용자 대신 API 호출 (위임)
- 세밀한 권한 제어 필요

❌ **OAuth가 과한 경우:**
- 자체 서비스 간 통신 (JWT 사용)
- 단순 API 인증 (API Key 사용)
- 복잡한 구현이 부담스러움

## ⚠️ 보안 주의사항

### 1. State 파라미터 (CSRF 방지)

```python
import secrets

# 로그인 시작 시
state = secrets.token_urlsafe(32)
redis.setex(f"oauth_state:{state}", 600, user_session_id)  # 10분 유효

auth_url = f"https://accounts.google.com/o/oauth2/auth?state={state}&..."

# 콜백에서 검증
@app.get("/callback")
async def callback(code: str, state: str):
    saved_session = redis.get(f"oauth_state:{state}")
    if not saved_session:
        raise Exception("Invalid state - possible CSRF attack")

    redis.delete(f"oauth_state:{state}")  # 1회용
    # 이후 Token 교환 진행
```

### 2. Redirect URI 검증

```python
# Google Cloud Console에 등록된 Redirect URI만 허용
ALLOWED_REDIRECT_URIS = [
    "https://myapp.com/callback",
    "http://localhost:3000/callback"  # 개발 환경
]

if redirect_uri not in ALLOWED_REDIRECT_URIS:
    raise ValueError("Invalid redirect URI")
```

### 3. Token 안전하게 저장

```python
from cryptography.fernet import Fernet

# Token 암호화 저장
def encrypt_token(token: str) -> str:
    f = Fernet(ENCRYPTION_KEY)
    return f.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    f = Fernet(ENCRYPTION_KEY)
    return f.decrypt(encrypted_token.encode()).decode()

# DB에 저장
db.execute("""
    INSERT INTO oauth_tokens (user_id, access_token, refresh_token)
    VALUES (?, ?, ?)
""", (user_id, encrypt_token(access_token), encrypt_token(refresh_token)))
```

### 4. Scope 최소화

```python
# ❌ 나쁜 예: 필요 이상의 권한 요청
scopes = [
    'https://www.googleapis.com/auth/drive',  # 모든 Drive 접근
    'https://www.googleapis.com/auth/gmail.modify',  # Gmail 수정
    'https://www.googleapis.com/auth/contacts'  # 연락처
]

# ✅ 좋은 예: 필요한 최소 권한만
scopes = [
    'https://www.googleapis.com/auth/userinfo.email',  # 이메일만
    'https://www.googleapis.com/auth/userinfo.profile'  # 프로필만
]
```

## 🔗 관련 용어

- **[[API Key]]**: 간단한 인증 방식 (OAuth보다 단순)
- **[[JWT]]**: OAuth와 함께 사용되는 Token 포맷
- **[[SAML]]**: 기업용 SSO (OAuth의 대안)
- **[[OpenID Connect]]**: OAuth 2.0 기반의 인증 레이어
- **[[PKCE]]**: 모바일 앱에서 OAuth를 안전하게 쓰는 방법
- **[[Bearer Token]]**: Access Token을 전송하는 방식

## 📝 정리

### 핵심 3줄
1. **OAuth = 권한 위임**: 비밀번호 공유 없이 제3자 앱에 제한적 권한 부여
2. **Access Token (1시간) + Refresh Token (30일)**: 단기 토큰으로 보안 강화
3. **Scope로 권한 제어**: 필요한 최소한의 권한만 요청 (이메일만, 사진만 등)

### OAuth 2.0 흐름 요약
1. 사용자: "Google로 로그인" 클릭
2. Google 로그인 → 권한 승인 화면
3. Authorization Code 발급 (1회용, 10분)
4. Code → Access Token + Refresh Token 교환
5. Access Token으로 API 호출 (1시간)
6. 만료 시 Refresh Token으로 갱신

### 실무 체크리스트
- [ ] State 파라미터로 CSRF 방지했는가?
- [ ] Redirect URI를 엄격하게 검증하는가?
- [ ] Token을 암호화해서 저장하는가?
- [ ] 필요한 최소 Scope만 요청하는가?
- [ ] Refresh Token으로 자동 갱신 구현했는가?
- [ ] HTTPS 사용하는가? (HTTP는 절대 안 됨)
- [ ] Client Secret을 안전하게 관리하는가?

---
*카테고리: 보안*
*관련 프로젝트: P3 (Google OAuth 로그인)*
*업데이트: 2024-02-15*
