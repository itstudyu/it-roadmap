# Consistent Hashing (일관된 해싱)

## 📝 정의

Consistent Hashing(일관된 해싱)은 **서버 추가/제거 시 최소한의 데이터만 재분배**하는 해싱 기법입니다.

### 핵심 개념

- **무엇인가?**: 서버 변경 시 영향을 최소화하는 해싱
- **왜 필요한가?**: 일반 해싱은 서버 변경 시 대부분 데이터 이동
- **어떻게 작동하나?**: 해시 링에서 시계방향으로 가장 가까운 서버 선택

### Consistent Hashing이 해결하는 문제

**문제 상황 (일반 해싱)**:
```
😱 시나리오: 서버 3대 → 4대 증설
일반 해싱: key % 3
key_123 → 서버 0 (123 % 3 = 0)

서버 4대로 증가:
key_123 → 서버 3 (123 % 4 = 3)
→ 대부분 키가 다른 서버로!
→ 캐시 전부 무효화! 😱
```

**Consistent Hashing의 해결**:
```
✅ 최소 재분배:
서버 4대 추가 시
→ 전체 데이터의 1/4만 이동
→ 나머지 3/4는 그대로
→ 효율적! ✅
```

**비유**:
- **일반 해싱** = 사물함 개수 변경 시 전체 재배치
- **Consistent Hashing** = 새 사물함 추가 시 일부만 이동

## 💡 동작 원리

### 1. 해시 링
```
0 ──────────────────────────── 2^32
│         │         │         │
서버1      서버2      서버3
(100)    (500)    (900)
```

### 2. 키 할당
```
key_A (hash=150) → 시계방향 서버 찾기
→ 서버2 (500)

key_B (hash=600) → 시계방향 서버 찾기
→ 서버3 (900)

key_C (hash=50) → 시계방향 서버 찾기
→ 서버1 (100)
```

### 3. 서버 추가
```
기존: 서버1(100), 서버2(500), 서버3(900)
추가: 서버4(300)

영향받는 키:
- 150 ~ 300 범위 키들만 서버4로 이동
- 나머지 키는 그대로!
```

## 💡 구현 예시

```python
import hashlib
from bisect import bisect_right

class ConsistentHash:
    def __init__(self, nodes=None, replicas=3):
        """
        nodes: 초기 서버 목록
        replicas: 가상 노드 수 (부하 분산)
        """
        self.replicas = replicas
        self.ring = {}  # hash -> node
        self.sorted_keys = []  # 정렬된 hash 값
        
        if nodes:
            for node in nodes:
                self.add_node(node)
    
    def _hash(self, key):
        """문자열을 해시값으로 변환"""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
    
    def add_node(self, node):
        """서버 추가"""
        for i in range(self.replicas):
            # 가상 노드 생성
            virtual_key = f"{node}:{i}"
            hash_val = self._hash(virtual_key)
            
            self.ring[hash_val] = node
            self.sorted_keys.append(hash_val)
        
        self.sorted_keys.sort()
    
    def remove_node(self, node):
        """서버 제거"""
        for i in range(self.replicas):
            virtual_key = f"{node}:{i}"
            hash_val = self._hash(virtual_key)
            
            del self.ring[hash_val]
            self.sorted_keys.remove(hash_val)
    
    def get_node(self, key):
        """키가 저장될 서버 찾기"""
        if not self.ring:
            return None
        
        hash_val = self._hash(key)
        
        # 시계방향으로 가장 가까운 서버 찾기
        idx = bisect_right(self.sorted_keys, hash_val)
        
        if idx == len(self.sorted_keys):
            idx = 0  # 링의 처음으로
        
        return self.ring[self.sorted_keys[idx]]

# 사용 예시
ch = ConsistentHash(['server1', 'server2', 'server3'])

# 키 할당
print(ch.get_node('user_123'))  # server2
print(ch.get_node('user_456'))  # server1

# 서버 추가 (일부 키만 재분배됨)
ch.add_node('server4')
print(ch.get_node('user_123'))  # 대부분 그대로
```

## 🎯 Virtual Nodes (가상 노드)

```python
# 문제: 서버마다 부하 불균형
서버1 → 70% 데이터
서버2 → 20% 데이터
서버3 → 10% 데이터

# 해결: 가상 노드
서버1 → 100개 가상 노드
서버2 → 100개 가상 노드
서버3 → 100개 가상 노드
→ 균등 분배!
```

## 💡 실제 사용 사례

| 서비스 | 용도 |
|--------|------|
| **Amazon DynamoDB** | 데이터 파티셔닝 |
| **Cassandra** | 노드 간 데이터 분산 |
| **Memcached** | 캐시 서버 분산 |
| **Chord (P2P)** | DHT 구현 |

## 📊 일반 해싱 vs Consistent Hashing

| 항목 | 일반 해싱 | Consistent Hashing |
|------|-----------|-------------------|
| **서버 추가 시** | 대부분 데이터 이동 | 1/N만 이동 |
| **캐시 히트율** | 급감 | 유지 |
| **구현 복잡도** | 간단 | 복잡 |
| **사용 사례** | 고정 서버 | 동적 서버 |

## 🔗 관련 용어

- [[Sharding]]: Consistent Hashing 활용
- [[Load Balancing]]: 균등 분산
- [[Caching]]: Consistent Hashing로 캐시 서버 관리

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
