# Cache (캐시)

## 📝 정의

Cache(캐시)는 **자주 사용하는 데이터를 빠르게 접근할 수 있도록 임시 저장**하는 고속 메모리입니다. CPU와 RAM 사이, 또는 애플리케이션과 데이터베이스 사이에 위치하여 성능을 향상시킵니다.

### 핵심 개념

- **무엇인가?**: 자주 쓰는 데이터의 임시 저장소
- **왜 필요한가?**: 느린 저장소 접근 횟수 줄이기
- **어떻게 작동하나?**: 빠른 메모리에 복사본 저장

### Cache가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 반복적인 DB 조회
사용자 프로필 조회 API
→ 매 요청마다 DB 쿼리
→ DB: 50ms, 초당 100 요청
→ DB 부하 높고 응답 느림! 😱

😱 시나리오 2: 무거운 계산 반복
복잡한 통계 계산 (10초 소요)
→ 같은 데이터로 반복 계산
→ 매번 10초씩 기다림
→ 사용자 불만! 😱

😱 시나리오 3: CPU와 RAM 속도 차이
CPU: 초당 수십억 연산
RAM: 100ns 접근 시간
→ CPU가 RAM 대기에 시간 낭비
→ CPU 성능 활용 못 함! 😱
```

**Cache의 해결**:
```
✅ 시나리오 1:
Redis 캐시 도입
→ 첫 요청: DB 조회 (50ms)
→ 결과를 Redis에 저장 (1ms)
→ 이후 요청: Redis에서 조회 (1ms)
→ 50배 빠름! ✅

✅ 시나리오 2:
계산 결과 캐싱
→ 첫 계산: 10초 소요
→ 결과를 메모리에 캐싱
→ 이후 요청: 1ms
→ 10,000배 빠름! ✅

✅ 시나리오 3:
CPU Cache 활용
→ L1 Cache: 1ns (100배 빠름)
→ 자주 쓰는 데이터 L1에 저장
→ CPU가 대기 시간 최소화
→ 성능 대폭 향상! ✅
```

## 📊 캐시 계층 구조


### 캐시 레벨

**L1 Cache (Level 1)**:
```
크기: 32-64KB
속도: ~1ns
위치: CPU 코어 내부
특징: 가장 빠르지만 가장 작음
```

**L2 Cache (Level 2)**:
```
크기: 256-512KB
속도: ~3ns
위치: CPU 코어별 또는 공유
특징: L1보다 느리지만 더 큼
```

**L3 Cache (Level 3)**:
```
크기: 2-32MB
속도: ~12ns
위치: 모든 코어가 공유
특징: 가장 크지만 가장 느림 (캐시 중에서)
```

## 💡 소프트웨어 캐싱

### Python: 함수 결과 캐싱

```python
from functools import lru_cache
import time

# 캐싱 없이
def fibonacci_slow(n):
    """피보나치 (느림)"""
    if n < 2:
        return n
    return fibonacci_slow(n-1) + fibonacci_slow(n-2)

# 캐싱 있음
@lru_cache(maxsize=128)
def fibonacci_cached(n):
    """피보나치 (캐시 사용)"""
    if n < 2:
        return n
    return fibonacci_cached(n-1) + fibonacci_cached(n-2)

# 비교
start = time.time()
result1 = fibonacci_slow(30)
print(f"캐싱 없음: {time.time() - start:.3f}초")  # ~0.3초

start = time.time()
result2 = fibonacci_cached(30)
print(f"캐싱 있음: {time.time() - start:.6f}초")  # ~0.000015초

# 캐시 정보 확인
print(fibonacci_cached.cache_info())
```

**실행 결과**:
```
캐싱 없음: 0.312초
캐싱 있음: 0.000015초
CacheInfo(hits=28, misses=31, maxsize=128, currsize=31)
```

### Redis 캐싱

```python
import redis
import json
import time

# Redis 연결
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_user_profile(user_id):
    """사용자 프로필 조회 (캐싱 적용)"""
    cache_key = f"user:{user_id}"

    # 1. 캐시 확인
    cached = r.get(cache_key)
    if cached:
        print("✅ 캐시 히트!")
        return json.loads(cached)

    # 2. 캐시 미스 - DB 조회
    print("❌ 캐시 미스 - DB 조회")
    time.sleep(0.05)  # DB 쿼리 시뮬레이션

    user = {
        'id': user_id,
        'name': f'User{user_id}',
        'email': f'user{user_id}@example.com'
    }

    # 3. 캐시에 저장 (TTL 10분)
    r.setex(cache_key, 600, json.dumps(user))

    return user

# 사용
print("첫 요청:")
user1 = get_user_profile(123)  # DB 조회

print("\n두 번째 요청:")
user2 = get_user_profile(123)  # 캐시에서 조회
```

**실행 결과**:
```
첫 요청:
❌ 캐시 미스 - DB 조회

두 번째 요청:
✅ 캐시 히트!
```

## 🎯 캐시 전략

### 1. Cache-Aside (Lazy Loading)

```python
def cache_aside(key):
    """가장 일반적인 패턴"""
    # 1. 캐시 확인
    data = cache.get(key)

    if data is None:
        # 2. 캐시 미스 - DB 조회
        data = database.query(key)

        # 3. 캐시에 저장
        cache.set(key, data, ttl=3600)

    return data
```

### 2. Write-Through

```python
def write_through(key, value):
    """쓰기 시 캐시와 DB 모두 업데이트"""
    # 1. DB에 쓰기
    database.save(key, value)

    # 2. 동시에 캐시에도 쓰기
    cache.set(key, value)

    # 장점: 캐시 항상 최신 상태
    # 단점: 쓰기가 느림
```

### 3. Write-Back

```python
def write_back(key, value):
    """캐시에만 쓰고 나중에 DB 동기화"""
    # 1. 캐시에만 쓰기
    cache.set(key, value)

    # 2. 비동기로 DB 업데이트 예약
    queue.enqueue(lambda: database.save(key, value))

    # 장점: 쓰기가 빠름
    # 단점: 캐시 서버 죽으면 데이터 손실
```

## 🔍 실전 캐싱 패턴

### API 응답 캐싱

```python
from flask import Flask, jsonify
from functools import wraps
import time

app = Flask(__name__)

# 간단한 메모리 캐시
cache = {}

def cached(seconds=300):
    """캐싱 데코레이터"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # 캐시 키 생성
            cache_key = f"{f.__name__}:{args}:{kwargs}"

            # 캐시 확인
            if cache_key in cache:
                data, timestamp = cache[cache_key]
                if time.time() - timestamp < seconds:
                    print(f"캐시 히트: {cache_key}")
                    return data

            # 함수 실행
            result = f(*args, **kwargs)

            # 캐시 저장
            cache[cache_key] = (result, time.time())

            return result
        return wrapper
    return decorator

@app.route('/api/heavy-data')
@cached(seconds=60)  # 1분 캐싱
def get_heavy_data():
    """무거운 작업"""
    print("무거운 계산 수행 중...")
    time.sleep(2)  # 2초 소요
    return jsonify({'data': '결과'})
```

### 데이터베이스 쿼리 캐싱

```python
import hashlib
import pickle

class QueryCache:
    """SQL 쿼리 결과 캐싱"""

    def __init__(self):
        self.cache = {}

    def get_cache_key(self, query, params):
        """쿼리와 파라미터로 캐시 키 생성"""
        key_str = f"{query}:{params}"
        return hashlib.md5(key_str.encode()).hexdigest()

    def get(self, query, params=()):
        """캐시된 쿼리 결과 가져오기"""
        key = self.get_cache_key(query, params)
        return self.cache.get(key)

    def set(self, query, params, result, ttl=300):
        """쿼리 결과 캐싱"""
        key = self.get_cache_key(query, params)
        self.cache[key] = {
            'result': result,
            'expires_at': time.time() + ttl
        }

    def execute_query(self, db, query, params=()):
        """캐싱이 적용된 쿼리 실행"""
        # 캐시 확인
        cached = self.get(query, params)
        if cached and cached['expires_at'] > time.time():
            print("✅ 쿼리 캐시 히트")
            return cached['result']

        # DB 쿼리
        print("❌ 쿼리 캐시 미스 - DB 조회")
        cursor = db.cursor()
        cursor.execute(query, params)
        result = cursor.fetchall()

        # 캐시에 저장
        self.set(query, params, result)

        return result

# 사용
cache = QueryCache()
result = cache.execute_query(
    db,
    "SELECT * FROM users WHERE id = ?",
    (123,)
)
```

## 💻 캐시 무효화

### TTL (Time To Live)

```python
# Redis TTL 설정
r.setex('key', 300, 'value')  # 5분 후 자동 삭제

# Python 메모리 캐시
import time

class TTLCache:
    def __init__(self):
        self.cache = {}

    def set(self, key, value, ttl=300):
        """TTL과 함께 저장"""
        expires_at = time.time() + ttl
        self.cache[key] = {
            'value': value,
            'expires_at': expires_at
        }

    def get(self, key):
        """TTL 확인 후 반환"""
        if key not in self.cache:
            return None

        item = self.cache[key]
        if time.time() > item['expires_at']:
            # 만료됨
            del self.cache[key]
            return None

        return item['value']
```

### LRU (Least Recently Used)

```python
from collections import OrderedDict

class LRUCache:
    """가장 오래 사용 안 한 항목 제거"""

    def __init__(self, capacity=100):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return None

        # 최근 사용으로 이동
        self.cache.move_to_end(key)
        return self.cache[key]

    def set(self, key, value):
        if key in self.cache:
            # 이미 있으면 업데이트
            self.cache.move_to_end(key)
        else:
            # 용량 초과 시 가장 오래된 항목 제거
            if len(self.cache) >= self.capacity:
                self.cache.popitem(last=False)

        self.cache[key] = value

# 사용
cache = LRUCache(capacity=3)
cache.set('a', 1)
cache.set('b', 2)
cache.set('c', 3)
cache.set('d', 4)  # 'a'가 제거됨 (가장 오래됨)
```

## 🚨 캐싱 주의사항

### 1. Cache Stampede

```python
import threading
import time

# ❌ 문제: 동시 요청 시 모두 DB 조회
def bad_cache(key):
    data = cache.get(key)
    if data is None:
        # 여러 스레드가 동시에 여기 진입!
        data = expensive_db_query()  # 무거운 쿼리
        cache.set(key, data)
    return data

# ✅ 해결: Lock 사용
lock = threading.Lock()

def good_cache(key):
    data = cache.get(key)
    if data is None:
        with lock:  # 첫 번째 스레드만 DB 조회
            # Double-check
            data = cache.get(key)
            if data is None:
                data = expensive_db_query()
                cache.set(key, data)
    return data
```

### 2. Cache Inconsistency

```python
# ❌ 문제: 캐시와 DB 불일치
def update_user(user_id, new_data):
    # DB만 업데이트
    database.update(user_id, new_data)
    # 캐시는 그대로! → 오래된 데이터 반환

# ✅ 해결 1: 캐시 무효화
def update_user_v1(user_id, new_data):
    database.update(user_id, new_data)
    cache.delete(f"user:{user_id}")  # 캐시 삭제

# ✅ 해결 2: 캐시 업데이트
def update_user_v2(user_id, new_data):
    database.update(user_id, new_data)
    cache.set(f"user:{user_id}", new_data)  # 캐시도 업데이트
```

## 🔗 관련 용어

- [[CPU]]: L1/L2/L3 캐시를 가진 프로세서
- [[RAM]]: 캐시의 다음 계층 메모리
- [[Redis]]: 인메모리 캐시 DB
- [[CDN]]: 콘텐츠 전송 네트워크 캐시

## 📝 정리

**캐시의 핵심**:
```
Cache = 자주 쓰는 데이터의 빠른 복사본
→ 느린 저장소 접근 줄임
→ 성능 대폭 향상
→ TTL로 신선도 관리
```

**효과**:
```
DB 조회: 50ms → 캐시: 1ms (50배 향상)
무거운 계산: 10초 → 캐시: 1ms (10,000배 향상)
```

**비유로 기억하기**:
```
Cache = 책상 위 자주 쓰는 물건
RAM = 책상 서랍
SSD = 책장
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
