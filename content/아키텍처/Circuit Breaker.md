# Circuit Breaker (서킷 브레이커)

## 📝 정의

Circuit Breaker(서킷 브레이커)는 **장애가 발생한 서비스 호출을 자동으로 차단**하여, 연쇄 장애를 방지하는 패턴입니다.

### 핵심 개념

- **무엇인가?**: 실패하는 서비스 호출을 자동으로 차단
- **왜 필요한가?**: 한 서비스 장애가 전체 시스템으로 전파됨
- **어떻게 작동하나?**: 실패 임계값 초과 시 회로 차단

### Circuit Breaker가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 서비스 A가 다운된 경우
서비스 B → 서비스 A 호출 (타임아웃 5초)
→ 계속 시도 → 쓰레드 고갈
→ 서비스 B도 다운
→ 연쇄 장애! 😱
```

**Circuit Breaker의 해결**:
```
✅ 자동 차단:
서비스 B → 서비스 A (3회 실패)
→ Circuit Breaker OPEN
→ 즉시 실패 응답 (fallback)
→ 서비스 B 정상 유지! ✅
```

**비유**:
- **Circuit Breaker 없음** = 끊어진 전선에 계속 전기 공급
- **Circuit Breaker** = 누전 차단기 (자동 차단)

## 💡 상태별 동작

### 1. CLOSED (정상)
```
요청 → 서비스 호출
성공 → 카운터 리셋
실패 → 카운터 증가
실패 5회 → OPEN
```

### 2. OPEN (차단)
```
요청 → 즉시 실패 (fallback)
30초 대기
→ HALF-OPEN
```

### 3. HALF-OPEN (테스트)
```
요청 → 1개만 허용
성공 → CLOSED
실패 → OPEN
```

## 💡 구현 예시

```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30)
def call_external_service():
    """
    - failure_threshold=5: 5회 실패 시 OPEN
    - recovery_timeout=30: 30초 후 HALF-OPEN
    """
    response = requests.get('http://api.example.com')
    return response.json()

# 사용
try:
    data = call_external_service()
except CircuitBreakerError:
    # Circuit이 OPEN 상태
    data = get_cached_data()  # Fallback
```

### Fallback 패턴
```python
def get_user_recommendations(user_id):
    try:
        # 추천 서비스 호출
        return recommendation_service.get(user_id)
    except CircuitBreakerError:
        # Circuit OPEN → 기본값 반환
        return get_popular_items()  # Fallback
```

## 🎯 주요 라이브러리

| 라이브러리 | 언어 | 특징 |
|-----------|------|------|
| **Hystrix** | Java | Netflix, 강력한 모니터링 |
| **Resilience4j** | Java | 경량, Spring Boot 통합 |
| **pybreaker** | Python | 간단한 구현 |
| **opossum** | Node.js | Promise 기반 |

## 📊 모니터링

```javascript
// Circuit Breaker 상태 모니터링
breaker.on('open', () => {
  console.log('Circuit OPEN - 서비스 차단');
  alert.send('Circuit breaker opened');
});

breaker.on('halfOpen', () => {
  console.log('Circuit HALF-OPEN - 테스트 중');
});

breaker.on('close', () => {
  console.log('Circuit CLOSED - 정상 복구');
});
```

## 🔗 관련 용어

- [[Fallback]]: Circuit 차단 시 대체 로직
- [[Retry Pattern]]: Circuit Breaker와 함께 사용
- [[Timeout]]: 실패 판단 기준

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
