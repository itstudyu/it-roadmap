# SQL (Structured Query Language)

## 📝 정의

SQL은 **관계형 데이터베이스를 관리하는 표준 언어**입니다.

## 💡 기본 문법

```sql
-- 테이블 생성
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 데이터 삽입
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- 조회
SELECT * FROM users WHERE name = 'John';

-- 수정
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 삭제
DELETE FROM users WHERE id = 1;
```

## 🎯 JOIN

```sql
-- INNER JOIN
SELECT users.name, orders.product
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN
SELECT users.name, orders.product
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

## 📝 정리

```
SQL = 데이터베이스 언어
→ SELECT, INSERT, UPDATE, DELETE
→ JOIN으로 테이블 연결
→ MySQL, PostgreSQL 등
```

---
*카테고리: 데이터베이스*
