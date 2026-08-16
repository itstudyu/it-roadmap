# Sharding (샤딩)

## 📝 정의

Sharding(샤딩)은 **대용량 데이터를 여러 데이터베이스에 분산 저장**하여, 성능과 확장성을 높이는 기술입니다.

### 핵심 개념

- **무엇인가?**: 데이터를 여러 DB 서버에 나눠 저장
- **왜 필요한가?**: 하나의 DB로는 대용량 데이터 처리 한계
- **어떻게 작동하나?**: 데이터를 기준(Shard Key)으로 분할

### Sharding이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 단일 DB 사용
사용자 1억 명 데이터 → DB 1대
→ 쿼리 느림 (10초)
→ 디스크 용량 부족
→ 확장 불가! 😱
```

**Sharding의 해결**:
```
✅ 데이터 분산:
사용자 1억 명 → 10개 DB로 분산
각 DB: 1천만 명
→ 쿼리 빠름 (1초)
→ 수평 확장 가능! ✅
```

**비유**:
- **Sharding 없음** = 도서관 1곳에 모든 책
- **Sharding** = 지역별로 도서관 10곳

## 💡 Sharding 전략

### 1. Hash Sharding
```python
def get_shard(user_id, num_shards=3):
    """
    user_id를 해시해서 분산
    균등 분배 보장
    """
    shard_id = hash(user_id) % num_shards
    return f"shard_{shard_id}"

# 예시
get_shard(123)  # → shard_0
get_shard(456)  # → shard_2
```

### 2. Range Sharding
```python
def get_shard_by_range(user_id):
    """
    user_id 범위로 분산
    관리 간단하지만 불균형 가능
    """
    if user_id < 1000000:
        return "shard_0"
    elif user_id < 2000000:
        return "shard_1"
    else:
        return "shard_2"
```

### 3. Geography Sharding
```python
def get_shard_by_location(country):
    """
    지역별로 분산
    지연 시간 감소
    """
    shards = {
        'KR': 'shard_asia',
        'JP': 'shard_asia',
        'US': 'shard_americas',
        'UK': 'shard_europe'
    }
    return shards.get(country, 'shard_default')
```

## 💡 구현 예시

```python
class ShardedDatabase:
    def __init__(self):
        self.shards = {
            0: connect_db('shard_0'),
            1: connect_db('shard_1'),
            2: connect_db('shard_2')
        }
    
    def get_shard(self, user_id):
        """user_id로 적절한 shard 선택"""
        shard_id = user_id % len(self.shards)
        return self.shards[shard_id]
    
    def get_user(self, user_id):
        """사용자 조회"""
        shard = self.get_shard(user_id)
        return shard.query(
            "SELECT * FROM users WHERE id = ?", 
            (user_id,)
        )
    
    def save_user(self, user_id, data):
        """사용자 저장"""
        shard = self.get_shard(user_id)
        shard.execute(
            "INSERT INTO users VALUES (?, ?)",
            (user_id, data)
        )

# 사용
db = ShardedDatabase()
user = db.get_user(12345)  # 자동으로 올바른 shard 조회
```

## ⚠️ Sharding의 도전 과제

### 1. Cross-Shard 조인
```sql
-- 문제: 서로 다른 shard에 있는 데이터 조인 불가
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
-- → users와 orders가 다른 shard면?
```

### 2. Rebalancing
```python
# 샤드 추가 시 데이터 재분배 필요
# 기존: 3개 shard
user_123 → shard 0 (123 % 3 = 0)

# 샤드 추가: 4개 shard
user_123 → shard 3 (123 % 4 = 3)
# → 데이터 마이그레이션 필요!
```

## 🎯 Sharding vs Partitioning

| 항목 | Sharding | Partitioning |
|------|----------|--------------|
| **위치** | 여러 DB 서버 | 하나의 DB 서버 |
| **목적** | 확장성, 성능 | 관리 편의성 |
| **복잡도** | 높음 | 낮음 |

## 🔗 관련 용어

- [[Consistent Hashing]]: Sharding 키 분배
- [[Replication]]: Sharding과 함께 사용
- [[Horizontal Scaling]]: Sharding의 목적

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
