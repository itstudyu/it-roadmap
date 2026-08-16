# Tenant (테넌트)

## 📝 정의

Tenant는 **멀티테넌시에서 각 고객사/회사**를 의미합니다.

### 핵심 개념

- **무엇인가?**: 하나의 시스템을 쓰는 각 고객
- **왜 필요한가?**: 데이터 격리, 비용 절감
- **핵심**: 서로의 데이터 못 봄

## 💡 멀티테넌시 구조

```
P3 시스템 (하나의 서버)
├── Tenant A (A회사)
│   ├── 직원 데이터
│   └── 취업 규칙
├── Tenant B (B회사)
│   ├── 직원 데이터
│   └── 취업 규칙
└── Tenant C (C회사)
    ├── 직원 데이터
    └── 취업 규칙

서로 완전 격리!
```

## 🔍 구현

```python
# RAG 검색 시 tenant_id 필터
def search(query: str, tenant_id: str):
    results = vector_db.search(
        query_vector,
        filter={"tenant_id": tenant_id}  # ← 격리!
    )
    return results

# A회사 직원 검색
search("육아휴직", tenant_id="A회사")
→ A회사 규약만 검색됨
```

## 📝 정리

**Tenant = 아파트 각 집**
- 하나의 건물 (시스템)
- 여러 세대 (Tenant)
- 각 집은 독립적
- 서로 못 들어감

---
*카테고리: 아키텍처*
*생성일: 2026-02-15*
