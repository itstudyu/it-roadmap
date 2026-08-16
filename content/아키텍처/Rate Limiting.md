# Rate Limiting (속도 제한)

## 📝 정의

Rate Limiting(속도 제한)은 **일정 시간 동안 허용되는 요청 수를 제한**하여, 서버를 과부하와 남용으로부터 보호하는 기술입니다.

### 핵심 개념

- **무엇인가?**: 사용자별 요청 횟수 제한
- **왜 필요한가?**: 무제한 요청 시 서버 다운, 비용 폭증
- **어떻게 작동하나?**: 임계값 초과 시 요청 거부

### Rate Limiting이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 제한 없는 API
악의적 사용자 → 초당 10,000개 요청
→ 서버 CPU 100%
→ 정상 사용자 접속 불가
→ 서비스 다운! 😱
```

**Rate Limiting의 해결**:
```
✅ 요청 제한:
사용자 → 분당 100개 요청 허용
101번째 요청 → 429 에러 반환
→ 서버 안정적 운영
→ 정상 사용자 보호! ✅
```

**비유**:
- **제한 없음** = 무한정 시식 가능 (재고 소진)
- **Rate Limiting** = 1인 1회 시식 (공평한 분배)

## 📊 Rate Limiting 알고리즘

### 1. Token Bucket


### 2. Leaky Bucket
```
요청들 → 버킷 (큐)
→ 일정 속도로 처리
→ 버킷 가득 차면 거부
```

### 3. Fixed Window
```
00:00 ~ 00:59 → 100개 허용
01:00 ~ 01:59 → 100개 허용 (리셋)
```

### 4. Sliding Window
```
현재 시각 기준 최근 1분간
요청 횟수 계산
```

## 💡 구현 예시

### Token Bucket 구현
```python
import time
from threading import Lock

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        """
        capacity: 최대 토큰 수
        refill_rate: 초당 충전되는 토큰 수
        """
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()
        self.lock = Lock()
    
    def consume(self, tokens=1):
        """토큰 소비 시도"""
        with self.lock:
            self._refill()
            
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True  # 허용
            else:
                return False  # 거부
    
    def _refill(self):
        """시간에 따라 토큰 충전"""
        now = time.time()
        elapsed = now - self.last_refill
        
        # 충전할 토큰 수 계산
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

# 사용
bucket = TokenBucket(capacity=100, refill_rate=10)  # 초당 10개 충전

if bucket.consume():
    # 요청 처리
    process_request()
else:
    # 429 Too Many Requests
    return error(429, "Rate limit exceeded")
```

### Redis 기반 구현
```python
import redis
from datetime import timedelta

r = redis.Redis()

def is_rate_limited(user_id, limit=100, window=60):
    """
    user_id: 사용자 ID
    limit: 허용 횟수
    window: 시간 윈도우 (초)
    """
    key = f"rate_limit:{user_id}"
    
    # 현재 요청 횟수
    current = r.get(key)
    
    if current and int(current) >= limit:
        return True  # 제한 초과
    
    # 카운터 증가
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, window)
    pipe.execute()
    
    return False  # 허용

# Flask 예시
from flask import request, jsonify

@app.before_request
def check_rate_limit():
    user_id = get_user_id()
    
    if is_rate_limited(user_id, limit=100, window=60):
        return jsonify({
            'error': 'Too many requests',
            'retry_after': 60
        }), 429
```

## 🎯 실제 서비스 제한

| 서비스 | 제한 | 용도 |
|--------|------|------|
| **GitHub API** | 5,000 req/hour | 인증된 요청 |
| **Twitter API** | 900 req/15min | 트윗 조회 |
| **Stripe API** | 100 req/sec | 결제 처리 |

## 💡 응답 헤더

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100          # 전체 한도
X-RateLimit-Remaining: 75       # 남은 횟수
X-RateLimit-Reset: 1640000000   # 리셋 시각
Retry-After: 60                 # 재시도 대기 시간
```

## ⚠️ 고려사항

```
1. 사용자 식별:
   - IP 주소 (NAT 문제)
   - API 키 (가장 정확)
   - 세션 ID

2. 분산 환경:
   - Redis 같은 중앙 저장소 필요
   - 각 서버마다 제한 → 비효율

3. 우회 공격:
   - IP 변경
   - 다중 계정
   → API 키 기반 제한 권장
```

## 🔗 관련 용어

- [[API Gateway]]: Rate Limiting 구현
- [[DDoS Protection]]: Rate Limiting으로 방어
- [[Throttling]]: 유사 개념

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
