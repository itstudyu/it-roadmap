# Circuit Breaker (회로 차단기)

## 📝 정의

Circuit Breaker는 **장애가 계속되면 자동으로 차단**하여 시스템을 보호하는 패턴입니다.

### 핵심 개념

- **무엇인가?**: 자동 장애 차단
- **왜 필요한가?**: 연쇄 장애 방지
- **3가지 상태**: Closed → Open → Half-Open

## 💡 3가지 상태

```
[Closed - 정상]
요청 → 서비스 → 응답 ✅

[Open - 차단]
에러 50% 발생! → Circuit Open
요청 → Circuit Breaker → 즉시 에러 반환
(서비스 호출 안 함)

[Half-Open - 시험]
30초 후 일부 요청만 테스트
→ 성공하면 Closed로 복귀
```

## 🔍 구현

```javascript
const breaker = new CircuitBreaker(agent.call, {
  timeout: 3000,
  errorThreshold: 50,   // 에러율 50%
  resetTimeout: 30000    // 30초 후 재시도
});

breaker.fire(request)
  .then(response => console.log(response))
  .catch(err => console.log("Circuit Open!"));
```

## 📝 정리

**Circuit Breaker = 자동 차단기**
- 장애 감지 → 자동 차단
- 시스템 보호
- 30초 후 재시도

---
*카테고리: 인프라*
*생성일: 2026-02-15*
