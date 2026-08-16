# Multi-tenancy (멀티 테넌시)

## 📝 정의

Multi-tenancy(멀티 테넌시)는 **하나의 시스템을 여러 고객(테넌트)이 독립적으로 사용하는 아키텍처**입니다. SaaS 서비스의 핵심 구조로, 각 고객의 데이터와 설정을 논리적으로 분리합니다.

### 핵심 개념

- **무엇인가?**: 하나의 앱을 여러 회사가 독립적으로 사용
- **왜 필요한가?**: 고객마다 별도 서버 운영은 비효율적
- **어떻게 작동하나?**: 데이터 분리 + 권한 제어 → 독립 환경 제공

### Multi-tenancy가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 고객마다 별도 시스템
회사 A용 서버 + 회사 B용 서버 + ...
→ 100개 고객 = 100대 서버
→ 관리 복잡, 비용 폭증! 😱
```

**Multi-tenancy의 해결**:
```
✅ 하나의 시스템 공유:
1대 서버로 100개 회사 서비스
→ 각 회사 데이터 완전 분리
→ 비용 절감, 관리 간편! ✅
```

**비유**:
- **Single-tenant** = 단독 주택 (각자 건물)
- **Multi-tenant** = 아파트 (한 건물, 독립 세대)

## 📊 Multi-tenancy 구조

```도해
층: Multi-tenancy, 어떻게 나뉘어 있나
T1 :: 사용자 A1 · 사용자 A2 · 데이터 A
T2 :: 사용자 B1 · 사용자 B2 · 데이터 B
T3 :: 사용자 C1 · 데이터 C
```

## 💡 데이터 분리 방법

### 1. 스키마 분리 (Schema-based)

```sql
-- 테넌트별 스키마
CREATE SCHEMA tenant_a;
CREATE SCHEMA tenant_b;

-- 각 테넌트의 테이블
CREATE TABLE tenant_a.users (...);
CREATE TABLE tenant_b.users (...);
```

### 2. Row-Level 분리

```sql
-- 하나의 테이블에 tenant_id 컬럼
CREATE TABLE users (
    id INT,
    tenant_id INT,  -- 테넌트 구분자
    name VARCHAR(100)
);

-- 조회 시 자동 필터링
SELECT * FROM users WHERE tenant_id = :current_tenant;
```

### 3. 데이터베이스 분리

```yaml
# 테넌트별 DB
tenants:
  - tenant_a: db_tenant_a
  - tenant_b: db_tenant_b
  - tenant_c: db_tenant_c
```

## 🎯 Multi-tenancy 구현 예시

```python
from flask import Flask, g, request

app = Flask(__name__)

# 테넌트 식별
@app.before_request
def identify_tenant():
    """요청에서 테넌트 식별"""
    # 방법 1: 서브도메인
    # companyA.saas.com → tenant_id = "companyA"
    subdomain = request.host.split('.')[0]
    g.tenant_id = subdomain

    # 방법 2: 헤더
    # g.tenant_id = request.headers.get('X-Tenant-ID')

# 자동 필터링
@app.route('/users')
def get_users():
    """현재 테넌트의 사용자만 조회"""
    tenant_id = g.tenant_id

    users = db.query(f"""
        SELECT * FROM users
        WHERE tenant_id = '{tenant_id}'
    """)

    return jsonify(users)
```

## 🔒 보안 고려사항

### 1. 데이터 격리

```python
# ❌ 나쁜 예 (테넌트 검증 없음)
def get_user(user_id):
    return db.query(f"SELECT * FROM users WHERE id = {user_id}")
    # → 다른 테넌트 데이터 접근 가능!

# ✅ 좋은 예 (테넌트 검증)
def get_user(user_id, tenant_id):
    return db.query(f"""
        SELECT * FROM users
        WHERE id = {user_id} AND tenant_id = {tenant_id}
    """)
```

### 2. 성능 격리

```python
# 한 테넌트의 과부하가 다른 테넌트에 영향
# → 리소스 제한 설정

rate_limits = {
    'tenant_a': 1000,  # 시간당 1000 요청
    'tenant_b': 5000,
    'tenant_c': 10000
}
```

## 📊 Single-tenant vs Multi-tenant

| 항목 | Single-tenant | Multi-tenant |
|------|--------------|--------------|
| **인프라** | 고객별 서버 | 공유 서버 |
| **비용** | 높음 | 낮음 |
| **커스터마이징** | 쉬움 | 제한적 |
| **보안** | 완전 격리 | 논리적 격리 |
| **확장** | 복잡 | 간단 |
| **유지보수** | 개별 업데이트 | 한 번에 업데이트 |

**사용 사례**:
```
Multi-tenant 선택:
  - SaaS 서비스 (Notion, Slack)
  - 중소기업 대상
  - 빠른 확장 필요

Single-tenant 선택:
  - 대기업 고객 (보안 중요)
  - 높은 커스터마이징 필요
  - 규제 산업 (금융, 의료)
```

## 🔗 관련 용어

- [[SaaS]]: Multi-tenancy의 주요 사용처
- [[데이터 격리]]: Multi-tenancy의 핵심 요구사항
- [[클라우드]]: Multi-tenancy의 인프라

## 📚 참고자료

- [Multi-tenancy Architecture](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/multi-tenancy.html)
- [SaaS Tenant Isolation](https://aws.amazon.com/blogs/apn/saas-tenant-isolation-strategies/)

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
