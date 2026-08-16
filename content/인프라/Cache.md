# Cache (캐시)

## 📝 정의

Cache는 **자주 사용하는 데이터를 빠른 저장소에 미리 저장**하는 기법입니다.

### 핵심 개념

- **무엇인가?**: 임시 고속 저장소
- **왜 필요한가?**: 속도 100배↑, 비용 70%↓
- **어디에?**: Redis, 메모리, CDN

## 💡 캐시 레이어

```
속도 빠름 ←─────────────────────→ 속도 느림
용량 적음                            용량 많음

L1: CPU 캐시     (나노초)
L2: 메모리       (마이크로초)
L3: Redis        (밀리초)
L4: SSD          (10밀리초)
L5: DB           (100밀리초)
```

## 🔍 캐시 전략

```python
def get_data(key):
    # 1. 캐시 확인
    cached = redis.get(key)
    if cached:
        return cached  # Cache Hit! 0.001초

    # 2. DB 조회 (느림)
    data = db.query(key)  # 0.1초

    # 3. 캐시에 저장
    redis.setex(key, ttl=3600, value=data)

    return data
```

## 📝 정리

**Cache = 자주 쓰는 걸 가까이**
- Hit: 캐시에 있음 (빠름!)
- Miss: 캐시에 없음 (DB 조회)
- TTL: 자동 만료 시간

**P3: FAQ 답변 캐싱으로 비용 70% 절감**

---
*카테고리: 인프라*
*생성일: 2026-02-15*
