# API Gateway (API 게이트웨이)

## 📝 정의

API Gateway(API 게이트웨이)는 **모든 클라이언트 요청의 단일 진입점**으로, 라우팅, 인증, 속도 제한 등을 처리하는 서버입니다.

### 핵심 개념

- **무엇인가?**: 마이크로서비스 앞에 있는 단일 진입점
- **왜 필요한가?**: 각 서비스마다 인증/로깅하면 중복 코드 발생
- **어떻게 작동하나?**: 클라이언트 → API Gateway → 적절한 서비스로 라우팅

### API Gateway가 해결하는 문제

**문제 상황**:
```
😱 시나리오: Gateway 없이 직접 호출
클라이언트 → 서비스A (인증 체크)
클라이언트 → 서비스B (인증 체크)
클라이언트 → 서비스C (인증 체크)
→ 인증 로직 중복! 😱
```

**API Gateway의 해결**:
```
✅ Gateway에서 통합 처리:
클라이언트 → API Gateway (인증 체크)
→ 서비스A로 라우팅
→ 서비스B로 라우팅
→ 서비스C로 라우팅
→ 한 곳에서 관리! ✅
```

**비유**:
- **Gateway 없음** = 각 부서마다 경비실
- **Gateway** = 건물 입구 통합 경비실

## 💡 주요 기능

### 1. 라우팅
```javascript
// API Gateway 설정
{
  "/api/users/*": "http://user-service:8001",
  "/api/orders/*": "http://order-service:8002",
  "/api/products/*": "http://product-service:8003"
}
```

### 2. 인증
```javascript
// 모든 요청에 대해 토큰 검증
app.use(async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!isValidToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  next();  // 인증 성공 → 서비스로 전달
});
```

### 3. 속도 제한 (Rate Limiting)
```javascript
// 사용자당 분당 100개 요청 제한
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1분
  max: 100,             // 최대 100개
  message: "Too many requests"
});

app.use(limiter);
```

### 4. 응답 변환
```javascript
// 여러 서비스 응답 조합
app.get('/api/dashboard', async (req, res) => {
  const [user, orders, stats] = await Promise.all([
    fetch('http://user-service/profile'),
    fetch('http://order-service/recent'),
    fetch('http://analytics-service/stats')
  ]);
  
  res.json({ user, orders, stats });  // 통합 응답
});
```

## 🎯 주요 서비스

| 서비스 | 특징 | 사용 사례 |
|--------|------|----------|
| **Amazon API Gateway** | AWS 관리형, 서버리스 | Lambda 통합 |
| **Kong** | 오픈소스, 플러그인 풍부 | 엔터프라이즈 |
| **Nginx** | 경량, 리버스 프록시 | 간단한 라우팅 |
| **Apigee** | Google, 분석 강력 | API 관리 |

## ⚡ 성능 고려사항

```
장점:
✅ 중앙 집중식 관리
✅ 보안 강화
✅ 모니터링 용이

단점:
⚠️ 단일 장애점 (SPOF)
⚠️ 추가 네트워크 홉
⚠️ 병목 가능성
```

## 🔗 관련 용어

- [[Load Balancing]]: Gateway 뒤에서 사용
- [[Rate Limiting]]: Gateway의 주요 기능
- [[Microservices]]: Gateway가 필수적

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
