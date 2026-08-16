# Caching (캐싱)

## 📝 정의

Caching(캐싱)은 **자주 접근하는 데이터를 메모리에 저장**해두고, DB까지 가지 않고 빠르게 응답하는 기술입니다.

### 핵심 개념

- **무엇인가?**: 자주 쓰는 데이터를 빠른 저장소에 임시 보관
- **왜 필요한가?**: DB 조회는 느림(ms), 메모리는 빠름(μs)
- **어떻게 작동하나?**: 캐시 확인 → 있으면 반환(Hit), 없으면 DB 조회(Miss)

### Caching이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 매번 DB 조회
"회사 규정" 조회 → DB 쿼리 100ms
1000명 조회 → 100초 소요
→ 느림! 😱
```

**Caching의 해결**:
```
✅ 첫 조회: DB → 캐시 저장
✅ 이후 조회: 캐시에서 0.1ms
1000명 조회 → 0.1초!
→ 1000배 빠름! ✅
```

**비유**:
- **캐시 없음** = 매번 도서관 가서 책 빌림
- **캐시** = 자주 보는 책은 책상에 놓음

## 📊 캐시 레벨

```
속도 ◄──────────────────────── 용량
빠름                            많음
적음                            느림

CPU 캐시 → 앱 캐시 → 분산 캐시 → DB
(ns)      (Redis)   (Redis 클러스터) (ms)
```

## 💡 캐시 전략

### 1. Cache-Aside (Lazy Loading)
```python
def get_data(key):
    # 1. 캐시 확인
    data = cache.get(key)
    if data:
        return data  # Cache Hit
    
    # 2. DB 조회
    data = db.query(key)
    
    # 3. 캐시 저장
    cache.set(key, data, ttl=300)  # 5분
    return data
```

### 2. Write-Through
```python
def save_data(key, value):
    # 1. DB 저장
    db.save(key, value)
    
    # 2. 캐시 저장
    cache.set(key, value)
```

### 3. Write-Behind
```python
def save_data(key, value):
    # 1. 캐시 저장 (빠름)
    cache.set(key, value)
    
    # 2. 비동기로 DB 저장
    queue.enqueue(lambda: db.save(key, value))
```

## 🔧 주요 캐시 도구

| 도구 | 특징 | 사용 사례 |
|------|------|----------|
| **Redis** | 인메모리, 다양한 자료구조 | 세션, API 캐시 |
| **Memcached** | 단순, 빠름 | 간단한 캐시 |
| **CDN** | 정적 파일 캐시 | 이미지, JS, CSS |

## ⚠️ 캐시 무효화

```python
# TTL (Time To Live)
cache.set(key, value, ttl=300)  # 5분 후 자동 만료

# 명시적 삭제
cache.delete(key)

# 업데이트 시 무효화
def update_data(key, value):
    db.update(key, value)
    cache.delete(key)  # 캐시 삭제
```

## 🔗 관련 용어

- [[Redis]]: 대표적인 캐시 솔루션
- [[CDN]]: 콘텐츠 캐싱
- [[Performance]]: 캐싱으로 개선

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
