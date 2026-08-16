# DB (Database, 데이터베이스)

## 📝 정의

DB(Database, 데이터베이스)는 **체계적으로 구조화된 데이터의 집합**으로, 효율적으로 저장, 검색, 수정할 수 있는 시스템입니다.

### 핵심 개념

- **무엇인가?**: 구조화된 데이터 저장소
- **왜 필요한가?**: 파일로 데이터 관리 → 비효율, 중복, 무결성 문제
- **어떻게 작동하나?**: DBMS(Database Management System)로 관리

### DB가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 파일로 데이터 관리
사용자 정보: users.txt
주문 정보: orders.txt
→ 사용자 삭제 시 주문은?
→ 동시 수정 시 충돌
→ 데이터 일관성 보장 불가! 😱
```

**DB의 해결**:
```
✅ 체계적 관리:
관계형 DB → 테이블 간 관계 설정
→ 사용자 삭제 시 관련 주문 자동 처리
→ 트랜잭션으로 일관성 보장
→ 동시성 제어
→ 안전하고 효율적! ✅
```

**비유**:
- **파일** = 서랍에 서류 무작위 보관
- **DB** = 도서관 시스템 (분류, 색인, 대출 관리)

## 💡 관계형 DB (RDBMS)

### 테이블 구조
```sql
-- 사용자 테이블
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 주문 테이블
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product VARCHAR(100),
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### CRUD 연산
```sql
-- Create (생성)
INSERT INTO users (username, email)
VALUES ('john', 'john@example.com');

-- Read (조회)
SELECT * FROM users WHERE username = 'john';

-- Update (수정)
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;

-- Delete (삭제)
DELETE FROM users WHERE id = 1;
```

### 관계 (Relationship)
```sql
-- 1:N 관계 (한 사용자, 여러 주문)
SELECT u.username, o.product, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id = 1;

-- 집계
SELECT u.username, COUNT(o.id) as order_count, SUM(o.amount) as total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

## 💡 NoSQL DB

### 문서형 (MongoDB)
```javascript
// 유연한 스키마
db.users.insertOne({
  username: "john",
  email: "john@example.com",
  profile: {
    age: 30,
    address: {
      city: "Seoul",
      country: "Korea"
    }
  },
  tags: ["developer", "python"]
});

// 조회
db.users.find({ "profile.age": { $gt: 25 } });

// 중첩된 객체 저장 가능
```

### Key-Value (Redis)
```python
import redis

r = redis.Redis()

# 저장
r.set('user:1:name', 'John')
r.set('user:1:email', 'john@example.com')

# 조회
name = r.get('user:1:name')

# 만료 시간 설정 (캐싱)
r.setex('session:abc123', 3600, 'user_data')

# Hash
r.hset('user:1', mapping={
    'name': 'John',
    'email': 'john@example.com'
})
```

## 💡 Python으로 DB 사용

### MySQL (관계형)
```python
import mysql.connector

# 연결
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='password',
    database='mydb'
)

cursor = conn.cursor()

# 데이터 삽입
cursor.execute(
    "INSERT INTO users (username, email) VALUES (%s, %s)",
    ('john', 'john@example.com')
)
conn.commit()

# 조회
cursor.execute("SELECT * FROM users WHERE username = %s", ('john',))
user = cursor.fetchone()
print(user)

# 닫기
cursor.close()
conn.close()
```

### SQLAlchemy (ORM)
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    """사용자 모델"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))

# DB 연결
engine = create_engine('mysql://user:pass@localhost/mydb')
Session = sessionmaker(bind=engine)
session = Session()

# Create
user = User(username='john', email='john@example.com')
session.add(user)
session.commit()

# Read
user = session.query(User).filter_by(username='john').first()
print(user.email)

# Update
user.email = 'newemail@example.com'
session.commit()

# Delete
session.delete(user)
session.commit()
```

### MongoDB (NoSQL)
```python
from pymongo import MongoClient

# 연결
client = MongoClient('mongodb://localhost:27017/')
db = client['mydb']
users = db['users']

# Create
users.insert_one({
    'username': 'john',
    'email': 'john@example.com',
    'age': 30
})

# Read
user = users.find_one({'username': 'john'})

# Update
users.update_one(
    {'username': 'john'},
    {'$set': {'age': 31}}
)

# Delete
users.delete_one({'username': 'john'})

# 복잡한 쿼리
results = users.find({
    'age': {'$gte': 25},
    'email': {'$regex': '@example.com$'}
})
```

## 💡 트랜잭션 (ACID)

```python
# 은행 송금 예시
def transfer(from_account, to_account, amount):
    """트랜잭션: 모두 성공 or 모두 실패"""
    
    try:
        # 트랜잭션 시작
        conn.start_transaction()
        
        # 출금
        cursor.execute(
            "UPDATE accounts SET balance = balance - %s WHERE id = %s",
            (amount, from_account)
        )
        
        # 입금
        cursor.execute(
            "UPDATE accounts SET balance = balance + %s WHERE id = %s",
            (amount, to_account)
        )
        
        # 커밋 (둘 다 성공)
        conn.commit()
        print("Transfer successful")
        
    except Exception as e:
        # 롤백 (하나라도 실패 시 모두 취소)
        conn.rollback()
        print(f"Transfer failed: {e}")
```

## 🎯 관계형 vs NoSQL

| 항목 | 관계형 (RDBMS) | NoSQL |
|------|---------------|-------|
| **스키마** | 고정 (엄격) | 유연 |
| **확장** | 수직 (서버 성능) | 수평 (서버 수) |
| **관계** | 강력 (JOIN) | 약함 |
| **일관성** | 강력 (ACID) | 결과적 일관성 |
| **사용 사례** | 금융, ERP | SNS, 로그, 캐시 |

## 💡 인덱스 (Index)

```sql
-- 인덱스 없이
SELECT * FROM users WHERE email = 'john@example.com';
-- → 100만 행 전체 스캔 (느림)

-- 인덱스 생성
CREATE INDEX idx_email ON users(email);

-- 인덱스 사용
SELECT * FROM users WHERE email = 'john@example.com';
-- → 인덱스로 즉시 찾기 (빠름)

-- 복합 인덱스
CREATE INDEX idx_name_age ON users(username, age);

-- 설명 보기
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';
```

## 🔗 관련 용어

- [[SQL]]: 관계형 DB 쿼리 언어
- [[ORM]]: 객체-관계 매핑
- [[NoSQL]]: 비관계형 DB
- [[인덱스]]: 검색 성능 향상

---
*카테고리: 데이터베이스*
*생성일: 2026-02-14*
