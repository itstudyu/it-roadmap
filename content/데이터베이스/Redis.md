# Redis

## 📝 정의

Redis는 **메모리 기반 키-값 저장소**입니다. 캐시, 세션, 실시간 데이터에 사용됩니다.

## 💡 특징

```
- 인메모리: 매우 빠름 (마이크로초)
- 데이터 구조: String, List, Set, Hash
- 영속성: 디스크 저장 가능
- Pub/Sub: 메시징 지원
```

## 🎯 Python 사용

```python
import redis

# 연결
r = redis.Redis(host='localhost', port=6379, db=0)

# String
r.set('name', 'John')
print(r.get('name'))  # b'John'

# 만료 시간 (초)
r.setex('session', 3600, 'user123')

# List
r.lpush('tasks', 'task1', 'task2')
print(r.lrange('tasks', 0, -1))

# Hash
r.hset('user:1', 'name', 'John')
r.hset('user:1', 'age', 30)
print(r.hgetall('user:1'))
```

## 📝 정리

```
Redis = 초고속 캐시
→ 메모리 기반
→ 캐시, 세션 저장
→ 실시간 데이터
```

---
*카테고리: 데이터베이스*
