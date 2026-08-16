# Message Queue (메시지 큐)

## 📝 정의

Message Queue(메시지 큐)는 **컴포넌트 간 통신을 비동기적으로 처리**하기 위해, 메시지를 큐(대기열)에 넣고 순서대로 처리하는 시스템입니다.

### 핵심 개념

- **무엇인가?**: 작업을 대기열에 넣고 순차 처리
- **왜 필요한가?**: 동기 처리는 느림, 비동기로 성능 향상
- **어떻게 작동하나?**: Producer → Queue → Consumer

### Message Queue가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 동기 처리
이메일 발송 요청 → 이메일 전송(5초)
→ 사용자 5초 대기
→ 답답함! 😱
```

**Message Queue의 해결**:
```
✅ 비동기 처리:
이메일 발송 요청 → Queue에 넣음(0.01초)
→ 사용자 즉시 응답 받음
→ 백그라운드에서 이메일 전송
→ 빠른 응답! ✅
```

**비유**:
- **동기** = 은행 창구 (순서대로 기다림)
- **비동기 Queue** = 번호표 뽑고 자유롭게 대기

## 💡 사용 예시

```python
# Producer (생산자)
queue.send_message({
    "type": "send_email",
    "to": "user@example.com",
    "subject": "환영합니다"
})

# Consumer (소비자)
while True:
    message = queue.receive_message()
    send_email(message['to'], message['subject'])
    queue.delete_message(message)
```

## 🎯 주요 서비스

| 서비스 | 특징 | 사용 사례 |
|--------|------|----------|
| **Amazon SQS** | AWS 관리형, 간단 | 일반적인 큐 |
| **RabbitMQ** | 오픈소스, 유연 | 복잡한 라우팅 |
| **Apache Kafka** | 초고성능, 스트리밍 | 실시간 데이터 |

## 🔗 관련 용어

- [[Pub/Sub]]: 메시지를 여러 곳에 전달
- [[Async Processing]]: 비동기 처리
- [[Event-Driven]]: 이벤트 기반 아키텍처

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
