# Snowflake

## 📝 정의

Snowflake는 **클라우드 기반 데이터 웨어하우스 플랫폼**입니다. 대용량 데이터를 저장하고 분석하는 데 최적화되어 있으며, 자동 스케일링과 간편한 관리가 특징입니다.

### 핵심 개념

- **무엇인가?**: 클라우드에서 동작하는 대용량 데이터 분석 플랫폼
- **왜 필요한가?**: 전통 DB는 대용량 분석 느림, 서버 관리 복잡
- **어떻게 작동하나?**: 데이터 저장 → 자동 스케일링 → SQL로 빠른 분석

### Snowflake가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 빅데이터 분석 느림
전통 DB: 10억 건 데이터 집계
→ 쿼리 30분 소요
→ 분석 불가능! 😱

😱 시나리오 2: 서버 용량 관리
데이터 증가 → 서버 증설 필요
→ 직접 서버 구매/설치
→ 시간과 비용 낭비! 😱

😱 시나리오 3: 동시 사용자 처리
100명이 동시에 쿼리 실행
→ 서버 다운
→ 분석 중단! 😱
```

**Snowflake의 해결**:
```
✅ 시나리오 1 (고성능):
10억 건 데이터 → 분산 처리
→ 쿼리 30초 완료
→ 빠른 분석! ✅

✅ 시나리오 2 (자동 스케일링):
데이터 증가 → 자동으로 용량 증가
→ 서버 관리 불필요
→ 편리! ✅

✅ 시나리오 3 (무한 동시성):
100명 동시 쿼리 → 각자 별도 자원
→ 서로 영향 없음
→ 안정적! ✅
```

**비유**:
- **전통 DB** = 자가용 (직접 관리, 용량 제한)
- **Snowflake** = 우버 (필요할 때만 사용, 무제한 확장)

## 📊 Snowflake 아키텍처

```도해
층: Snowflake, 어떻게 나뉘어 있나
Storage :: S3/Azure Blob 데이터 저장
Compute :: Warehouse 1 ETL 작업 · Warehouse 2 분석 쿼리 · Warehouse 3 ML 작업
Services :: 메타데이터 쿼리 최적화 보안
```

**3계층 분리의 장점**:
1. **저장소**: 데이터는 한 곳에, 중복 없음
2. **컴퓨팅**: 사용자별 독립적인 자원
3. **서비스**: 중앙에서 최적화 및 보안 관리

## 💡 주요 기능

### 1. Virtual Warehouse (가상 컴퓨팅)

```sql
-- Warehouse 생성 (자원 할당)
CREATE WAREHOUSE analytics_wh
  WITH WAREHOUSE_SIZE = 'MEDIUM'
  AUTO_SUSPEND = 600          -- 10분 후 자동 정지
  AUTO_RESUME = TRUE;         -- 쿼리 시 자동 시작

-- Warehouse 사용
USE WAREHOUSE analytics_wh;

-- 쿼리 실행 (자동으로 시작)
SELECT COUNT(*) FROM large_table;
-- → 10억 건 데이터도 빠르게 처리

-- 10분간 사용 안 하면 자동 정지 (비용 절감)
```

**크기별 성능**:
| 크기 | 노드 | 사용 사례 | 시간당 비용 |
|------|------|----------|------------|
| X-Small | 1 | 소규모 쿼리 | $2 |
| Small | 2 | 일반 분석 | $4 |
| Medium | 4 | 복잡한 쿼리 | $8 |
| Large | 8 | 대용량 ETL | $16 |
| X-Large | 16 | 빅데이터 분석 | $32 |

### 2. 자동 스케일링

```sql
-- Multi-Cluster Warehouse (자동 확장/축소)
CREATE WAREHOUSE scaling_wh
  WITH WAREHOUSE_SIZE = 'MEDIUM'
  MIN_CLUSTER_COUNT = 1       -- 최소 1개
  MAX_CLUSTER_COUNT = 10      -- 최대 10개
  SCALING_POLICY = 'STANDARD'
  AUTO_SUSPEND = 300
  AUTO_RESUME = TRUE;

-- 사용자 증가 → 자동으로 Cluster 추가
-- 사용자 감소 → 자동으로 Cluster 제거
```

### 3. Time Travel & Fail-safe

```sql
-- 실수로 데이터 삭제
DELETE FROM users WHERE age < 30;

-- 1시간 전 데이터 복구
SELECT * FROM users AT(OFFSET => -3600);

-- 특정 시점으로 복구
CREATE TABLE users_recovered CLONE users
  AT(TIMESTAMP => '2024-02-14 10:00:00'::timestamp);

-- Undrop (삭제한 테이블 복구)
DROP TABLE users;
UNDROP TABLE users;
```

**데이터 보호 기간**:
- Time Travel: 1~90일 (설정 가능)
- Fail-safe: 추가 7일 (Snowflake가 백업 보관)

## 🎯 실제 사용 예시

### 대용량 데이터 분석

```sql
-- 10억 건 주문 데이터 집계
SELECT
    product_category,
    DATE_TRUNC('month', order_date) AS month,
    COUNT(*) AS order_count,
    SUM(amount) AS total_revenue
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY product_category, month
ORDER BY total_revenue DESC;

-- 전통 DB: 30분
-- Snowflake: 30초
```

### ELT 파이프라인

```sql
-- 1. 외부 데이터 로드 (S3에서)
COPY INTO raw_data
FROM @s3_stage/data/
FILE_FORMAT = (TYPE = 'PARQUET');

-- 2. 변환
CREATE TABLE processed_data AS
SELECT
    user_id,
    DATE(timestamp) AS date,
    SUM(revenue) AS daily_revenue
FROM raw_data
GROUP BY user_id, DATE(timestamp);

-- 3. 분석용 테이블 생성
CREATE TABLE analytics_table AS
SELECT * FROM processed_data
WHERE daily_revenue > 1000;
```

## 📊 Snowflake vs 전통 DB

| 항목 | 전통 DB (Oracle, PostgreSQL) | Snowflake |
|------|--------------------------|-----------|
| **인프라** | 직접 관리 | 완전 관리형 |
| **확장** | 수동 (서버 증설) | 자동 |
| **비용** | 고정 (서버 비용) | 사용량 기반 |
| **동시성** | 제한적 | 무제한 |
| **백업** | 수동 | 자동 (Time Travel) |
| **성능** | 작은 데이터에 빠름 | 대용량 데이터에 빠름 |
| **용도** | OLTP (거래) | OLAP (분석) |

## 🔒 보안 기능

```sql
-- 1. 데이터 암호화 (자동)
-- → 모든 데이터 AES-256 암호화

-- 2. Row-Level Security
CREATE ROW ACCESS POLICY region_policy AS (region STRING)
RETURNS BOOLEAN ->
  CURRENT_ROLE() = 'ADMIN'
  OR region = CURRENT_REGION();

-- 3. Column Masking
CREATE MASKING POLICY ssn_mask AS (val STRING)
RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('ADMIN', 'HR') THEN val
    ELSE '***-**-****'
  END;

ALTER TABLE users MODIFY COLUMN ssn
  SET MASKING POLICY ssn_mask;
```

## 🔗 관련 용어

- [[Data Warehouse]]: Snowflake가 속한 카테고리
- [[ETL/ELT]]: Snowflake의 주요 사용 사례
- [[OLAP]]: Snowflake의 최적화 대상
- [[Cloud Computing]]: Snowflake의 기반

## 📚 참고자료

- [Snowflake 공식 문서](https://docs.snowflake.com/)
- [Snowflake University](https://www.snowflake.com/snowflake-university/) - 무료 교육

---
*카테고리: 데이터베이스*
*생성일: 2026-02-14*
