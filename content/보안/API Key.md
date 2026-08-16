# API Key

## 📝 정의

**API Key는 API 사용자를 식별하고 인증하는 고유한 문자열입니다.**

API를 호출할 때 "이게 누구냐?"를 증명하는 일종의 **디지털 출입증**입니다. 서버는 이 Key를 보고 누가 요청했는지 확인하고, 접근 권한을 판단하고, 사용량을 추적합니다.

## 🎯 핵심 개념

### 1. **고유 식별자**
- 각 사용자/앱마다 다른 Key 발급
- 보통 무작위 문자열 (예: `sk_live_1a2b3c4d5e`)
- 재사용 불가능

### 2. **인증 방식**
- HTTP Header에 포함
- Query Parameter로 전달
- Bearer Token 형태

### 3. **권한 수준**
- Read-only Key: 조회만 가능
- Write Key: 수정 가능
- Admin Key: 모든 권한

## 🤔 왜 필요한가? (문제와 해결)

### 문제 1: 무분별한 API 호출
```
상황: 날씨 API를 누구나 무료로 호출
문제: 서버 부하 폭증, 비용 감당 불가
→ 누가 얼마나 쓰는지 추적 불가능
```

**API Key 해결법:**
```python
# 각 사용자에게 고유 Key 발급
user1_key = "sk_user1_abc123"
user2_key = "sk_user2_def456"

# Key별로 사용량 추적
api_calls = {
    "sk_user1_abc123": 150,  # 하루 150번 호출
    "sk_user2_def456": 2000  # 하루 2000번 호출
}

# 제한 초과 시 차단
if api_calls[key] > 1000:
    return "Rate limit exceeded"
```

### 문제 2: 보안 없는 민감 API
```
상황: 결제 API를 아무나 호출 가능
문제: 악의적인 사용자가 임의로 결제 시도
→ 서비스 남용, 금전적 손실
```

**API Key 해결법:**
```
1. Key 발급 시 신원 확인 (이메일, 카드 등록)
2. 각 Key에 권한 설정
3. 의심스러운 패턴 감지 시 Key 비활성화
4. Key 유출 시 즉시 재발급
```

### 문제 3: 유료 서비스 과금 어려움
```
상황: OpenAI API를 사용한 만큼 돈 내야 함
문제: 누가 얼마나 썼는지 측정 불가
```

**API Key 해결법:**
```python
# Key별 사용량 정확히 측정
usage = {
    "sk_user1_abc": {
        "tokens": 50000,
        "cost": 0.25,  # $0.25
        "calls": 100
    }
}

# 월말에 청구서 발송
send_invoice(user1, cost=0.25)
```

## 📊 구조

```도해
층: API Key, 어떻게 나뉘어 있나
API Key 생성 :: 사용자 가입] --> B[Key 생성 요청
API Key 사용 :: 클라이언트] -->|"Header: API-Key: sk_xxx"| G[서버
```

## 🔄 작동 원리


### 동작 과정 설명

1. **요청 수신**: 클라이언트가 API Key를 Header에 넣어 전송
2. **캐시 확인**: 빠른 응답을 위해 Redis에서 먼저 확인
3. **DB 조회**: 캐시 미스 시 DB에서 Key 정보 가져오기
4. **Rate Limiting**: 시간당/일일 호출 횟수 제한 확인
5. **권한 검사**: 해당 API 엔드포인트 접근 권한 확인
6. **API 실행**: 모든 검증 통과 시 실제 로직 수행
7. **사용량 기록**: 과금/분석을 위한 로그 저장

## 🏠 일상적 비유

API Key는 **헬스장 회원카드**와 같습니다:

| 헬스장 회원카드 | API Key |
|---|---|
| 회원 고유 번호 | sk_user123abc |
| 출입 시 카드 찍기 | 요청 시 Key 전송 |
| 회원권 등급 (일반/프리미엄) | 권한 수준 (Read/Write) |
| 하루 이용 횟수 제한 | Rate Limit |
| 카드 분실 시 재발급 | Key 유출 시 재생성 |
| 이용 기록 추적 | API 호출 로그 |

카드를 잃어버리면 다른 사람이 내 이름으로 운동할 수 있듯이, API Key가 유출되면 다른 사람이 내 계정으로 API를 호출할 수 있습니다!

## 💼 P3 시스템 실제 사례

### 상황: OpenAI API 사용

P3 RAG 챗봇은 OpenAI API를 사용해 답변을 생성합니다. API Key 관리가 필수입니다.

```python
# .env 파일 (절대 Git에 올리지 않음!)
OPENAI_API_KEY=sk-proj-abc123xyz789...
OPENAI_ORG_ID=org-abc123

# settings.py - 환경변수로 관리
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment")

# openai_client.py - 실제 사용
from openai import OpenAI

client = OpenAI(api_key=OPENAI_API_KEY)

def get_answer(question: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "취업규칙 전문가"},
                {"role": "user", "content": question}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"OpenAI API 호출 실패: {e}")
        raise
```

### 비용 관리

```python
# usage_tracker.py - 사용량 모니터링
from datetime import datetime
import redis

redis_client = redis.Redis()

def track_api_usage(tokens_used: int, cost: float):
    """API 사용량 추적"""
    today = datetime.now().strftime("%Y-%m-%d")

    # 일일 사용량 누적
    redis_client.hincrby(f"usage:{today}", "tokens", tokens_used)
    redis_client.hincrbyfloat(f"usage:{today}", "cost", cost)

    # 알림 임계값
    daily_cost = float(redis_client.hget(f"usage:{today}", "cost") or 0)
    if daily_cost > 50:  # $50 초과 시
        send_alert(f"⚠️ 일일 API 비용 ${daily_cost:.2f} 초과!")

# 매 API 호출 후 실행
tokens = response.usage.total_tokens
cost = (tokens / 1000) * 0.03  # GPT-4: $0.03/1K tokens
track_api_usage(tokens, cost)
```

## 💻 코드 구현 (간단하게)

### 1. API Key 생성

```python
import secrets
import hashlib
from datetime import datetime, timedelta

def generate_api_key(user_id: int, key_type: str = "standard") -> str:
    """API Key 생성"""
    # 안전한 무작위 문자열 생성 (32바이트)
    random_part = secrets.token_urlsafe(32)

    # 프리픽스로 Key 타입 표시
    prefix = {
        "test": "sk_test",
        "live": "sk_live",
        "standard": "sk"
    }[key_type]

    api_key = f"{prefix}_{random_part}"

    # DB에 해시 저장 (원본 저장 X)
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()

    db.execute("""
        INSERT INTO api_keys (user_id, key_hash, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    """, (user_id, key_hash, datetime.now(), datetime.now() + timedelta(days=365)))

    # 사용자에게는 원본 반환 (이때만 볼 수 있음!)
    return api_key
```

### 2. API Key 검증 (Middleware)

```python
from fastapi import Header, HTTPException
import hashlib

async def verify_api_key(api_key: str = Header(None, alias="X-API-Key")):
    """API Key 검증 미들웨어"""
    if not api_key:
        raise HTTPException(status_code=401, detail="API Key required")

    # Key 해시 계산
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()

    # DB에서 확인
    key_info = db.execute("""
        SELECT user_id, permissions, rate_limit, expires_at
        FROM api_keys
        WHERE key_hash = ? AND is_active = TRUE
    """, (key_hash,)).fetchone()

    if not key_info:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    # 만료 확인
    if key_info['expires_at'] < datetime.now():
        raise HTTPException(status_code=401, detail="API Key expired")

    # Rate Limiting (Redis)
    call_count = redis_client.incr(f"rate_limit:{key_hash}")
    redis_client.expire(f"rate_limit:{key_hash}", 3600)  # 1시간

    if call_count > key_info['rate_limit']:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    return key_info['user_id']

# FastAPI 라우트에 적용
@app.get("/api/users")
async def get_users(user_id: int = Depends(verify_api_key)):
    # user_id로 API 호출한 사용자 식별
    return {"users": [...]}
```

### 3. Rate Limiting

```python
from datetime import datetime, timedelta
import redis

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client

    def check_limit(self, api_key: str, limit: int, window: int) -> bool:
        """
        Rate limit 확인
        limit: 허용 횟수
        window: 시간 창 (초)
        """
        now = datetime.now()
        key = f"rate_limit:{api_key}:{now.strftime('%Y%m%d%H')}"

        # 현재 카운트
        current = self.redis.get(key)

        if current and int(current) >= limit:
            return False  # 제한 초과

        # 카운트 증가
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.execute()

        return True  # 통과

# 사용 예시
limiter = RateLimiter(redis_client)

if not limiter.check_limit(api_key, limit=100, window=3600):
    raise HTTPException(429, "Too many requests")
```

## 🔄 다른 인증 방법과 비교

| 특성 | API Key | JWT Token | OAuth 2.0 |
|---|---|---|---|
| **복잡도** | ⭐ 매우 간단 | ⭐⭐ 중간 | ⭐⭐⭐ 복잡 |
| **보안성** | ⭐⭐ 보통 | ⭐⭐⭐ 높음 | ⭐⭐⭐⭐ 매우 높음 |
| **만료 관리** | 수동 (1년+) | 자동 (분~시간) | 자동 (분~시간) |
| **사용자 정보** | ❌ 없음 | ✅ Payload에 포함 | ✅ 별도 조회 |
| **제3자 권한** | ❌ 불가능 | ❌ 불가능 | ✅ 가능 (Scope) |
| **갱신** | 전체 재발급 | Refresh Token | Refresh Token |
| **적용 사례** | 외부 API 호출 | 웹앱 인증 | 소셜 로그인 |

### 언제 API Key를 쓸까?

✅ **API Key가 좋은 경우:**
- 서버 to 서버 통신
- 장기 실행 배치 작업
- 간단한 외부 API 제공
- 개발자 도구/CLI

❌ **API Key가 부적절한 경우:**
- 웹 브라우저에서 직접 호출 (노출 위험)
- 세밀한 권한 제어 필요
- 사용자별 다른 데이터 접근
- 단기 세션 관리

## ⚠️ 보안 주의사항

### 1. 절대 하지 말아야 할 것

```python
# ❌ 코드에 하드코딩
API_KEY = "sk_live_abc123xyz789"

# ❌ Git에 커밋
# config.py에 API_KEY 직접 작성 후 Git push

# ❌ 클라이언트 코드에 포함
const apiKey = "sk_live_abc123";  // JS 파일에 포함
fetch(url, { headers: { "API-Key": apiKey } });

# ❌ URL에 포함
https://api.example.com/users?api_key=sk_live_abc123
// 브라우저 히스토리, 서버 로그에 남음!

# ❌ 로그에 출력
logger.info(f"API 호출: {api_key}")  # 로그 파일에 Key 노출
```

### 2. 올바른 관리 방법

```bash
# .env 파일 (로컬)
OPENAI_API_KEY=sk-proj-abc123

# .gitignore에 추가
echo ".env" >> .gitignore

# 프로덕션: 환경변수
export OPENAI_API_KEY=sk-proj-xyz789

# Docker
docker run -e OPENAI_API_KEY=sk-proj-xyz789 myapp

# Kubernetes Secret
kubectl create secret generic api-keys \
  --from-literal=openai-key=sk-proj-xyz789
```

### 3. Key 유출 시 대응

```python
# 1. 즉시 비활성화
db.execute("UPDATE api_keys SET is_active = FALSE WHERE key_hash = ?", (leaked_key_hash,))

# 2. 새 Key 발급
new_key = generate_api_key(user_id)
send_email(user, f"새 API Key: {new_key}")

# 3. 의심스러운 활동 로그 분석
suspicious_logs = db.execute("""
    SELECT * FROM api_logs
    WHERE key_hash = ? AND created_at > ?
""", (leaked_key_hash, leak_discovered_at))

# 4. 피해 범위 확인 및 알림
if suspicious_logs:
    notify_security_team(suspicious_logs)
```

### 4. 권한 최소화 원칙

```python
# ✅ 필요한 권한만 부여
api_keys = {
    "monitoring_key": ["read:metrics"],
    "admin_key": ["read:*", "write:*", "delete:*"],
    "public_key": ["read:public_data"]
}

def check_permission(api_key: str, action: str) -> bool:
    permissions = api_keys.get(api_key, [])
    return action in permissions or "*" in permissions

# 사용 예시
if not check_permission(api_key, "write:users"):
    raise HTTPException(403, "Permission denied")
```

## 🔗 관련 용어

- **[[OAuth]]**: 제3자 앱 권한 위임 프로토콜 (API Key보다 안전)
- **[[JWT]]**: 자체 검증 가능한 토큰 (만료 시간 포함)
- **[[Bearer Token]]**: HTTP Authorization Header에 "Bearer {token}" 형태로 전송
- **[[API Gateway]]**: API Key 검증, Rate Limiting을 한 곳에서 관리
- **[[Rate Limiting]]**: API 호출 횟수 제한 (초당/분당/일일)
- **[[CORS]]**: 브라우저의 Cross-Origin 요청 제한 (API Key와 함께 사용)

## 📝 정리

### 핵심 3줄
1. **API Key = 디지털 출입증**: 누가 API를 호출하는지 식별하고 사용량 추적
2. **환경변수로 관리**: 절대 코드에 하드코딩하지 말고 .env 파일 사용
3. **유출 시 즉시 재발급**: Key는 비밀번호처럼 철저히 보호해야 함

### 실무 체크리스트
- [ ] API Key를 .env 파일에 저장했는가?
- [ ] .gitignore에 .env를 추가했는가?
- [ ] Rate Limiting을 설정했는가?
- [ ] Key별 권한을 최소화했는가?
- [ ] Key 유출 대응 계획이 있는가?
- [ ] 프로덕션에서 환경변수로 주입하는가?
- [ ] 로그에 Key가 출력되지 않는가?

---
*카테고리: 보안*
*관련 프로젝트: P3 (OpenAI API 사용)*
*업데이트: 2024-02-15*
