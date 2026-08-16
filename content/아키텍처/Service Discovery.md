# Service Discovery (서비스 디스커버리)

## 📝 정의

Service Discovery(서비스 디스커버리)는 **마이크로서비스의 위치를 자동으로 찾아주는** 메커니즘입니다.

### 핵심 개념

- **무엇인가?**: 서비스 IP/포트를 자동으로 찾아줌
- **왜 필요한가?**: 서비스가 동적으로 생성/삭제되면 IP가 계속 변함
- **어떻게 작동하나?**: 서비스 등록 → 레지스트리 조회 → 호출

### Service Discovery가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 하드코딩된 IP
주문 서비스 → 결제 서비스(192.168.1.100:8080)
→ 결제 서비스 재시작 → IP 변경됨
→ 연결 실패! 😱
```

**Service Discovery의 해결**:
```
✅ 자동 발견:
결제 서비스 → 레지스트리에 등록
주문 서비스 → 레지스트리 조회
→ 최신 IP 자동 발견
→ 항상 연결 성공! ✅
```

**비유**:
- **하드코딩** = 친구 이사 시 새 주소 못 찾음
- **Service Discovery** = 주소록 자동 업데이트

## 💡 동작 방식

### 1. 서비스 등록
```python
# 결제 서비스 시작 시
import consul

service = consul.Consul()

service.agent.service.register(
    name='payment-service',
    service_id='payment-1',
    address='192.168.1.50',
    port=8080,
    check={
        'http': 'http://192.168.1.50:8080/health',
        'interval': '10s'  # 10초마다 헬스체크
    }
)
```

### 2. 서비스 조회
```python
# 주문 서비스에서 결제 서비스 찾기
def get_payment_service():
    # 레지스트리 조회
    services = consul.agent.services()
    
    payment = services.get('payment-service')
    if payment:
        url = f"http://{payment['address']}:{payment['port']}"
        return url
    else:
        raise ServiceNotFound("payment-service")

# 사용
payment_url = get_payment_service()
response = requests.post(f"{payment_url}/pay", data=...)
```

### 3. 헬스체크
```python
from flask import Flask

app = Flask(__name__)

@app.route('/health')
def health():
    """
    레지스트리가 주기적으로 호출
    응답 없으면 서비스 제거됨
    """
    return {'status': 'healthy'}, 200
```

## 🎯 주요 도구

| 도구 | 특징 | 사용 사례 |
|------|------|----------|
| **Consul** | HashiCorp, 헬스체크 강력 | 엔터프라이즈 |
| **Eureka** | Netflix, Spring 통합 | Spring Cloud |
| **Zookeeper** | Apache, 강력하지만 복잡 | Kafka 통합 |
| **etcd** | CNCF, Kubernetes 통합 | 클라우드 네이티브 |

## 💡 클라이언트 vs 서버 사이드

### Client-Side Discovery
```
클라이언트 → 레지스트리 조회
→ 직접 서비스 호출
장점: 간단
단점: 클라이언트가 복잡
```

### Server-Side Discovery
```
클라이언트 → 로드 밸런서
로드 밸런서 → 레지스트리 조회
→ 서비스 호출
장점: 클라이언트 단순
단점: 로드 밸런서 필요
```

## 🔗 관련 용어

- [[Load Balancing]]: Discovery 후 밸런싱
- [[API Gateway]]: Discovery 활용
- [[Microservices]]: Discovery 필수

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
