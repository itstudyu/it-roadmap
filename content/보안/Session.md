# 세션 (Session)

## 📝 정의

세션(Session)은 **사용자가 웹사이트에 접속한 시점부터 종료할 때까지의 상태 정보**를 서버에 저장하는 메커니즘입니다.

### 핵심 개념

- **무엇인가?**: 사용자의 상태를 서버에 저장
- **왜 필요한가?**: HTTP는 상태가 없어서 (Stateless) 로그인 유지 불가
- **어떻게 작동하나?**: 로그인 → Session ID 발급 → 쿠키에 저장 → 매 요청마다 전송

### 세션이 해결하는 문제

**문제 상황**:
```
😱 시나리오: HTTP Stateless 특성
사용자 → 로그인 성공
사용자 → 다음 페이지 이동
서버 → "누구세요?" (이전 로그인 정보 없음)
→ 매번 로그인 필요! 😱
```

**세션의 해결**:
```
✅ 상태 유지:
사용자 → 로그인 성공
서버 → Session ID 발급 (예: abc123)
브라우저 → 쿠키에 저장
다음 요청 → Session ID 전송
서버 → "아, abc123님이시군요!" (인증 유지)
→ 한 번 로그인으로 계속 사용! ✅
```

**비유**:
- **세션 없음** = 식당 방문할 때마다 신분증 제시
- **세션** = 회원카드 (한 번만 확인 후 계속 사용)

## 📊 세션 동작 흐름

```도해
흐름: 세션, 무슨 순서로 오가나
브라우저 :: 로그인 (ID/PW)
서버 :: 인증 확인
서버 :: 세션 생성 Session ID: abc123 User: us…
서버 :: Set-Cookie: session_id=abc123
브라우저 :: 요청 + Cookie: session_id=abc123
서버 :: 세션 조회 (abc123)
세션 저장소 :: User: user@example.com
서버 :: 인증된 사용자로 응답
```

## 💡 세션 구현

### Flask 세션
```python
from flask import Flask, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # 세션 암호화 키

@app.route('/login', methods=['POST'])
def login():
    """로그인 시 세션 생성"""
    username = request.form['username']
    password = request.form['password']
    
    if authenticate(username, password):
        # 세션에 사용자 정보 저장
        session['user_id'] = username
        session['logged_in'] = True
        session['role'] = 'admin'
        
        return redirect('/dashboard')
    else:
        return 'Login failed', 401

@app.route('/dashboard')
def dashboard():
    """세션 확인"""
    if not session.get('logged_in'):
        return redirect('/login')
    
    user_id = session.get('user_id')
    return f'Welcome {user_id}!'

@app.route('/logout')
def logout():
    """세션 삭제"""
    session.clear()
    return redirect('/')
```

### Express 세션
```javascript
const express = require('express');
const session = require('express-session');

const app = express();

// 세션 미들웨어 설정
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,  // 24시간
    httpOnly: true,                // XSS 방지
    secure: true                   // HTTPS only
  }
}));

// 로그인
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (authenticate(username, password)) {
    // 세션에 저장
    req.session.userId = username;
    req.session.loggedIn = true;
    
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 세션 확인 미들웨어
function requireAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// 보호된 라우트
app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ user: req.session.userId });
});

// 로그아웃
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});
```

## 💡 세션 저장소

### 1. 메모리 (기본, 비추천)
```python
# Flask 기본 - 서버 메모리에 저장
# 단점: 서버 재시작 시 소멸, 다중 서버 불가
```

### 2. Redis (권장)
```python
from flask import Flask, session
from flask_session import Session
import redis

app = Flask(__name__)

# Redis에 세션 저장
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.Redis(
    host='localhost',
    port=6379,
    db=0
)

Session(app)

# 이제 session 사용 시 Redis에 저장됨
@app.route('/login')
def login():
    session['user_id'] = 'user123'
    # Redis에 저장: SET session:abc123 "{'user_id': 'user123'}"
```

### 3. 데이터베이스
```python
from flask_sqlalchemy import SQLAlchemy

# DB 테이블
class Session(db.Model):
    id = db.Column(db.String(255), primary_key=True)
    data = db.Column(db.Text)
    expiry = db.Column(db.DateTime)
    
    def is_expired(self):
        return datetime.now() > self.expiry
```

## 💡 세션 보안

### 1. Session Hijacking 방어
```python
from flask import session, request
import hashlib

def create_session_token(user_id):
    """세션 생성 시 추가 보안"""
    # User Agent + IP로 추가 검증
    user_agent = request.headers.get('User-Agent', '')
    ip_address = request.remote_addr
    
    session['user_id'] = user_id
    session['fingerprint'] = hashlib.sha256(
        f"{user_agent}{ip_address}".encode()
    ).hexdigest()

def verify_session():
    """세션 검증"""
    if 'user_id' not in session:
        return False
    
    # Fingerprint 확인
    user_agent = request.headers.get('User-Agent', '')
    ip_address = request.remote_addr
    current_fingerprint = hashlib.sha256(
        f"{user_agent}{ip_address}".encode()
    ).hexdigest()
    
    if session.get('fingerprint') != current_fingerprint:
        # 세션 탈취 의심
        session.clear()
        return False
    
    return True
```

### 2. 세션 타임아웃
```python
from datetime import datetime, timedelta

@app.before_request
def check_session_timeout():
    """비활성 시간 체크"""
    if 'user_id' in session:
        last_activity = session.get('last_activity')
        
        if last_activity:
            inactive_time = datetime.now() - datetime.fromisoformat(last_activity)
            
            # 30분 비활성 시 로그아웃
            if inactive_time > timedelta(minutes=30):
                session.clear()
                return redirect('/login')
        
        # 마지막 활동 시간 업데이트
        session['last_activity'] = datetime.now().isoformat()
```

### 3. CSRF 방지
```python
import secrets

@app.route('/form')
def show_form():
    """CSRF 토큰 생성"""
    csrf_token = secrets.token_hex(16)
    session['csrf_token'] = csrf_token
    
    return render_template('form.html', csrf_token=csrf_token)

@app.route('/submit', methods=['POST'])
def submit_form():
    """CSRF 토큰 검증"""
    token = request.form.get('csrf_token')
    
    if token != session.get('csrf_token'):
        return 'CSRF attack detected', 403
    
    # 정상 처리
    return 'Success'
```

## 🎯 세션 vs 쿠키 vs 토큰

| 항목 | 세션 | 쿠키 | JWT 토큰 |
|------|------|------|----------|
| **저장 위치** | 서버 | 클라이언트 | 클라이언트 |
| **보안** | 높음 | 낮음 | 중간 |
| **확장성** | 낮음 (서버 상태) | 높음 | 높음 |
| **크기** | 제한 없음 | 4KB | 수 KB |
| **사용 사례** | 전통적 웹앱 | 간단한 정보 | API, SPA |

## 💡 실전 예시

### 장바구니 세션
```python
@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    """장바구니에 상품 추가"""
    product_id = request.json['product_id']
    
    # 세션에 장바구니 초기화
    if 'cart' not in session:
        session['cart'] = []
    
    # 상품 추가
    session['cart'].append(product_id)
    session.modified = True  # 변경 사항 저장
    
    return {'cart_count': len(session['cart'])}

@app.route('/cart')
def view_cart():
    """장바구니 조회"""
    cart = session.get('cart', [])
    products = [get_product(id) for id in cart]
    
    return render_template('cart.html', products=products)
```

## 🔗 관련 용어

- [[쿠키]]: 세션 ID 저장
- [[JWT]]: 세션 대안
- [[Redis]]: 세션 저장소

---
*카테고리: 보안*
*생성일: 2026-02-14*
