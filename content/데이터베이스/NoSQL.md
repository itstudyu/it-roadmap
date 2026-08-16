# NoSQL

## 📝 정의

NoSQL은 **비관계형 데이터베이스**입니다. SQL의 테이블 구조 대신 유연한 형태로 데이터를 저장합니다.

## 💡 종류

```python
nosql_types = {
    "Document": {
        "예시": "MongoDB, CouchDB",
        "구조": "JSON 형태",
        "용도": "유연한 스키마"
    },
    "Key-Value": {
        "예시": "Redis, DynamoDB",
        "구조": "키-값 쌍",
        "용도": "캐시, 세션"
    },
    "Column-Family": {
        "예시": "Cassandra, HBase",
        "구조": "열 기반",
        "용도": "대용량 데이터"
    },
    "Graph": {
        "예시": "Neo4j",
        "구조": "노드-관계",
        "용도": "소셜 네트워크"
    }
}
```

## 🎯 MongoDB 예시

```python
from pymongo import MongoClient

# 연결
client = MongoClient('localhost', 27017)
db = client['mydb']
users = db['users']

# 삽입
users.insert_one({
    'name': 'John',
    'email': 'john@example.com',
    'age': 30
})

# 조회
user = users.find_one({'name': 'John'})

# 수정
users.update_one(
    {'name': 'John'},
    {'$set': {'age': 31}}
)

# 삭제
users.delete_one({'name': 'John'})
```

## 🔍 SQL vs NoSQL

```python
comparison = {
    "SQL": {
        "구조": "고정 스키마",
        "확장": "수직 (서버 업그레이드)",
        "관계": "JOIN 사용",
        "용도": "복잡한 쿼리, 트랜잭션"
    },
    "NoSQL": {
        "구조": "유연한 스키마",
        "확장": "수평 (서버 추가)",
        "관계": "임베딩",
        "용도": "빠른 읽기/쓰기, 대용량"
    }
}
```

## 📝 정리

```
NoSQL = 비관계형 DB
→ 유연한 스키마
→ 수평 확장
→ MongoDB, Redis 등
```

---
*카테고리: 데이터베이스*
