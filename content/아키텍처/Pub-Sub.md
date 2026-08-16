# Pub/Sub (Publish-Subscribe)

## 📝 정의

Pub/Sub(발행-구독)는 **하나의 메시지를 여러 구독자가 동시에 받을 수 있는** 메시징 패턴입니다.

### 핵심 개념

- **무엇인가?**: 1개 발행 → N개 구독자 수신
- **왜 필요한가?**: 한 이벤트에 여러 서비스가 반응해야 함
- **어떻게 작동하나?**: Publisher → Topic → Subscribers

### Pub/Sub이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 주문 완료 시
주문 서비스 → 결제 서비스 호출
주문 서비스 → 재고 서비스 호출
주문 서비스 → 알림 서비스 호출
→ 결합도 높음, 관리 어려움! 😱
```

**Pub/Sub의 해결**:
```
✅ Topic 사용:
주문 서비스 → "주문 완료" Topic 발행
→ 결제 서비스 자동 수신
→ 재고 서비스 자동 수신
→ 알림 서비스 자동 수신
→ 느슨한 결합! ✅
```

**비유**:
- **직접 호출** = 전화 (1:1)
- **Pub/Sub** = 유튜브 알림 (1:N)

## 📊 Pub/Sub vs Message Queue

| 항목 | Message Queue | Pub/Sub |
|------|--------------|---------|
| **수신자** | 1명만 | 여러 명 |
| **메시지** | 소비되면 삭제 | 모두 복사본 받음 |
| **사용 사례** | 작업 분산 | 이벤트 브로드캐스트 |

## 💡 구현 예시

```python
# Publisher
pubsub.publish(
    topic="order_completed",
    message={"order_id": "123", "amount": 50000}
)

# Subscriber 1: 재고 서비스
@subscribe("order_completed")
def update_inventory(message):
    decrease_stock(message['order_id'])

# Subscriber 2: 알림 서비스
@subscribe("order_completed")
def send_notification(message):
    notify_user(message['order_id'])
```

## 🔗 관련 용어

- [[Message Queue]]: 1:1 메시징
- [[Event-Driven Architecture]]: Pub/Sub 기반
- [[Kafka]]: Pub/Sub 구현체

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
