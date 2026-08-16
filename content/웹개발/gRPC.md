# gRPC

## 📝 정의

gRPC(gRPC Remote Procedure Call)는 Google이 개발한 고성능 오픈소스 RPC 프레임워크입니다. RPC(Remote Procedure Call)는 원격의 컴퓨터에 있는 프로세스를 마치 로컬 함수를 호출하듯이 호출할 수 있게 해주는 기술입니다. gRPC는 HTTP/2 프로토콜을 기반으로 하며, 데이터 직렬화를 위해 Protocol Buffers(Protobuf)를 사용합니다. REST API와 달리 바이너리 형식을 사용하여 더 빠르고 효율적인 통신을 제공하며, 양방향 스트리밍을 지원하므로 실시간 데이터 처리에 우수합니다.

gRPC는 2015년 Google에서 처음 발표되었으며, 마이크로서비스 아키텍처의 확산과 함께 인기를 얻기 시작했습니다. Netflix, Uber, Slack, Square 등 대규모 기업들이 채택했으며, 특히 마이크로서비스 간의 내부 통신 프로토콜로 널리 사용됩니다. gRPC의 핵심 특징은 성능(전송 속도, 메모리 효율), 개발 경험(자동 코드 생성), 다언어 지원(Java, Go, Python, Node.js, C# 등)입니다.

> **한 줄 요약**: gRPC는 HTTP/2와 Protocol Buffers를 기반으로 하는 고성능 RPC 프레임워크로, 마이크로서비스 간 통신과 실시간 양방향 스트리밍을 효율적으로 지원합니다.

**비유 1**: gRPC는 마치 전화 통화와 같습니다. REST API는 편지(요청을 보내고 응답을 받는 단방향 통신)라면, gRPC는 전화통화(양방향 실시간 통신)처럼 서로가 동시에 데이터를 주고받을 수 있습니다. 또한 바이너리 형식으로 통신하므로 데이터가 압축되어 빠릅니다.

**비유 2**: gRPC와 REST를 비유하면, REST는 우편 배송(느리지만 확실하고 누구나 이해)이고, gRPC는 택배 배송(빠르고 추적 가능하며, 특정 택배사만 사용)과 같습니다. gRPC는 REST보다 빠르지만, 특정 라이브러리와 설정이 필요합니다.

---

## 🎯 핵심 개념

### 1. Protocol Buffers (Protobuf)

Protobuf는 Google에서 만든 데이터 직렬화 형식으로, JSON이나 XML보다 훨씬 빠르고 효율적입니다. .proto 파일에 메시지(데이터 구조)와 서비스(RPC 메서드)를 정의하면, protoc 컴파일러가 각 언어에 맞는 코드를 자동으로 생성합니다. 예를 들어:

```proto
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc CreateUser(User) returns (User);
}
```

이를 컴파일하면 자동으로 Java, Python, Go 등의 클래스가 생성되므로, 개발자는 비즈니스 로직에 집중할 수 있습니다. Protobuf의 장점은 **타입 안정성**(컴파일 시 타입 체크), **자동 코드 생성**, **버전 호환성**(필드 추가해도 기존 코드 작동)입니다.

### 2. 4가지 통신 방식

gRPC는 다양한 통신 패턴을 지원합니다:

**Unary RPC (Unary = 단일)**: 클라이언트가 하나의 요청을 보내고 서버가 하나의 응답을 반환합니다. REST API의 일반적인 GET/POST와 유사합니다.
```
Client → Request → Server → Response → Client
```

**Server Streaming**: 클라이언트가 요청을 보내면, 서버가 여러 개의 응답을 스트리밍합니다. 예: 주식 시세 실시간 전송, 로그 파일 스트리밍.
```
Client → Request → Server → Response1 → Response2 → Response3 → Client
```

**Client Streaming**: 클라이언트가 여러 개의 요청을 스트리밍하고, 서버가 하나의 응답을 반환합니다. 예: 파일 업로드, 배치 데이터 전송.
```
Client → Request1 → Request2 → Request3 → Server → Response → Client
```

**Bidirectional Streaming**: 클라이언트와 서버가 동시에 여러 메시지를 주고받습니다. 실시간 채팅, 멀티플레이어 게임 등에 최적화.
```
Client ← Response1 → Request1 →
       ← Response2 → Request2 →
       ← Response3 → Request3 →
Server
```

### 3. HTTP/2의 역할

gRPC는 HTTP/2 위에서 작동하므로, HTTP/2의 장점을 모두 활용합니다. HTTP/1.1은 하나의 요청이 완료되어야 다음 요청을 보낼 수 있지만(Head-of-line blocking), HTTP/2는 **다중화(Multiplexing)**를 지원하여 여러 요청을 동시에 처리합니다. 또한 **헤더 압축**으로 오버헤드를 줄이고, **스트림**이라는 개념으로 양방향 통신을 효율적으로 구현합니다.

결과적으로 gRPC는 HTTP/2의 다중화와 스트리밍을 활용하여, REST API보다 훨씬 빠르고 효율적인 통신을 달성합니다.

---

## ⚠️ 해결하는 문제

### 문제 1: 마이크로서비스 간 통신의 성능 저하

**문제**: 마이크로서비스 아키텍처에서 여러 서비스가 REST API(JSON + HTTP/1.1)로 통신하면, 네트워크 오버헤드와 파싱 비용이 매우 커집니다. JSON 직렬화/역직렬화, HTTP/1.1의 요청당 연결 생성, 큰 헤더 크기 등으로 인해 지연시간이 증가합니다.

**해결 방법**: gRPC는 바이너리 형식(Protobuf)으로 훨씬 작은 메시지 크기를 달성하고, HTTP/2의 다중화로 여러 요청을 동시에 처리합니다. 실제 벤치마크에서 gRPC는 REST API보다 7배 이상 빠릅니다. 마이크로서비스 간 내부 통신이 주 목적이므로, REST의 캐싱이나 웹 호환성이 필요 없는 환경에서 최적화됩니다.

### 문제 2: 실시간 양방향 통신의 복잡성

**문제**: REST API는 기본적으로 단방향(요청-응답) 통신입니다. 실시간 데이터 업데이트(예: 주식 시세, 알림, 채팅)를 구현하려면 WebSocket이나 Polling 같은 별도의 기술을 추가로 배워야 합니다.

**해결 방법**: gRPC의 Bidirectional Streaming은 양방향 통신을 자연스럽게 지원합니다. 클라이언트와 서버가 동시에 데이터를 주고받을 수 있으므로, 실시간 채팅, 알림, 스트리밍 분석 등을 쉽게 구현할 수 있습니다. 별도의 WebSocket 설정이 필요 없고, gRPC 라이브러리가 모두 처리합니다.

### 문제 3: 다언어 개발의 일관성 부족

**문제**: 마이크로서비스가 다양한 언어(Java, Python, Go 등)로 작성되면, 각 서비스 간 데이터 형식 정의와 코드 작성이 불일치할 수 있습니다. 이로 인해 호환성 문제와 개발 시간이 증가합니다.

**해결 방법**: Protobuf의 .proto 파일은 모든 언어의 단일 정의로 작동합니다. protoc 컴파일러가 각 언어에 맞는 클래스를 자동 생성하므로, 개발자는 원하는 언어로 구현할 수 있으면서도 호환성을 보장할 수 있습니다. 새로운 필드를 추가할 때도 기존 코드가 깨지지 않습니다(버전 호환성).

---

## 🏗️ 구조

### Mermaid 1: gRPC 통신 구조


### Mermaid 2: Unary RPC vs Server Streaming 흐름

```도해
흐름: gRPC, 무슨 순서로 오가나
클라이언트 :: GetUser(id=1)
서버 :: 데이터베이스 조회
서버 :: User{id:1, name:"John"}
클라이언트 :: WatchPrices(symbol="AAPL")
서버 :: Price{value:150.5}
서버 :: Price{value:150.6}
서버 :: Price{value:150.7}
서버 :: (지속적인 스트리밍...)
```

---

## ⚙️ 작동 원리

### 1단계: Proto 파일 정의
개발자는 .proto 파일에 메시지와 서비스를 정의합니다:
```proto
message GetUserRequest { int32 id = 1; }
message User { int32 id = 1; string name = 2; }
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

### 2단계: 코드 생성
protoc 컴파일러가 .proto 파일을 컴파일하여 각 언어의 클래스를 자동 생성합니다. 클라이언트 스텁(Client Stub)과 서버 스켈레톤(Server Skeleton)이 생성됩니다.

### 3단계: 서버 구현
개발자는 생성된 서버 스켈레톤을 상속받아 비즈니스 로직을 구현합니다:
```java
class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
  @Override
  public void getUser(GetUserRequest req, StreamObserver<User> resp) {
    User user = database.findById(req.getId());
    resp.onNext(user);
    resp.onCompleted();
  }
}
```

### 4단계: 클라이언트 호출
클라이언트는 생성된 스텁을 사용하여 원격 메서드를 호출합니다:
```java
UserServiceGrpc.UserServiceStub stub = UserServiceGrpc.newStub(channel);
GetUserRequest req = GetUserRequest.newBuilder().setId(1).build();
stub.getUser(req, new StreamObserver<User>() {
  public void onNext(User user) { /* 결과 처리 */ }
  public void onCompleted() { /* 완료 */ }
  public void onError(Throwable t) { /* 오류 처리 */ }
});
```

### 5단계: HTTP/2 전송
gRPC 라이브러리가 요청을 Protobuf 바이너리로 직렬화하고, HTTP/2 스트림을 통해 전송합니다. 다중화로 여러 요청이 동시에 처리됩니다.

### 6단계: 서버 처리 및 응답
서버가 요청을 받아 바이너리로 역직렬화하고, 핸들러를 호출합니다. 결과를 Protobuf 바이너리로 직렬화하여 응답합니다.

### 7단계: 클라이언트 수신
클라이언트의 StreamObserver가 응답을 받아 처리합니다. 스트리밍의 경우 `onNext()`가 여러 번 호출되고, 완료되면 `onCompleted()`가 호출됩니다.

---

## 📊 비교

| 항목 | gRPC | REST | GraphQL | WebSocket |
|------|------|------|---------|-----------|
| **프로토콜** | HTTP/2 | HTTP/1.1 또는 HTTP/2 | HTTP/1.1 또는 HTTP/2 | TCP (WebSocket) |
| **데이터 형식** | Protocol Buffers (바이너리) | JSON (텍스트) | JSON (텍스트) | JSON/바이너리 (텍스트) |
| **직렬화 속도** | 매우 빠름 (바이너리) | 느림 (JSON 파싱) | 중간 (쿼리 파싱) | 중간 (JSON 파싱) |
| **메시지 크기** | 작음 (바이너리 압축) | 중간-큼 (JSON 형식) | 중간 (쿼리 문자열) | 중간-큼 (JSON) |
| **양방향 스트리밍** | 지원 (Bidirectional Streaming) | 미지원 | 미지원 | 지원 (Full Duplex) |
| **캐싱** | 어려움 (바이너리) | 쉬움 (HTTP 캐시) | 중간 (쿼리 기반) | 불가능 |
| **웹 브라우저 지원** | 제한적 (gRPC-Web 필요) | 완벽 지원 | 완벽 지원 | 지원 |
| **사용 사례** | 마이크로서비스, 실시간 통신 | 공개 API, 웹 서비스 | 유연한 쿼리, 모바일 API | 실시간 채팅, 알림, 멀티플레이 |

---

## ✅ 장단점

### 장점

1. **뛰어난 성능**: Protocol Buffers 바이너리 형식으로 크기가 작고, HTTP/2 다중화로 처리량이 높습니다. REST API 대비 5-7배 빠릅니다.

2. **양방향 스트리밍**: Bidirectional Streaming으로 실시간 데이터 전송이 자연스럽습니다. WebSocket 추가 학습 불필요.

3. **자동 코드 생성**: Proto 정의에서 모든 언어의 클래스가 자동 생성되므로, 개발 시간이 크게 줄어듭니다.

4. **강력한 타입 안정성**: Protobuf의 명시적 타입 정의로 컴파일 시 오류를 잡을 수 있습니다.

5. **버전 호환성**: Proto에 새 필드를 추가해도 기존 클라이언트가 깨지지 않습니다. 선택적 필드와 기본값으로 처리됩니다.

6. **다언어 지원**: Java, Python, Go, C#, Node.js, C++, Ruby, PHP 등 거의 모든 주요 언어를 지원합니다.

### 단점

1. **학습 곡선**: Proto 문법, protoc 컴파일러, 생성된 코드 이해 등 추가 학습이 필요합니다.

2. **브라우저 미지원**: gRPC는 HTTP/2를 사용하는데, 브라우저에서 직접 호출하려면 gRPC-Web이라는 별도 프록시가 필요합니다.

3. **캐싱 어려움**: 바이너리 형식이므로 HTTP 캐싱(ETag, If-Modified-Since 등)을 활용하기 어렵습니다.

4. **디버깅 복잡성**: 바이너리 형식이므로 cURL 같은 일반 도구로 디버깅하기 어렵습니다. grpcurl 같은 특수 도구가 필요합니다.

5. **공개 API에 부적절**: 보안, 캐싱, CORS 등의 이유로 공개 API로는 REST가 더 나습니다.

6. **의존성**: gRPC 라이브러리 설치 및 관리가 필요하므로, 순수 HTTP API보다 배포가 복잡할 수 있습니다.

---

## 💡 실제 사례

### 사례 1: 마이크로서비스 간 내부 통신

Uber의 마이크로서비스 아키텍처에서:
- 사용자 서비스(User Service)
- 결제 서비스(Payment Service)
- 주행 정보 서비스(Trip Service)

이들 서비스 간 통신을 gRPC로 구현하면:
```
Trip Service → (gRPC) → User Service: GetUser(user_id)
Trip Service → (gRPC) → Payment Service: ProcessPayment(trip_id, amount)
```

JSON 기반 REST 대비 통신 시간이 10배 빨라져, 전체 시스템 응답 속도가 향상됩니다.

### 사례 2: 실시간 주식 시세 스트리밍

트레이딩 애플리케이션에서:
```proto
service StockService {
  rpc WatchPrices(WatchRequest) returns (stream Price);
}
```

클라이언트는 한 번의 요청으로 지속적인 스트리밍을 받습니다:
```
Client → WatchPrices(symbols=["AAPL", "GOOGL"])
Server → Price{symbol:"AAPL", value:150.5}
Server → Price{symbol:"GOOGL", value:2800.3}
Server → Price{symbol:"AAPL", value:150.6}
... (계속 스트리밍)
```

WebSocket 없이도 실시간 데이터 전송이 가능합니다.

### 사례 3: 모바일 앱 백엔드 API

Netflix는 모바일 앱의 권장 영화 목록, 시청 기록 업데이트, 재생 상태 동기화 등을 gRPC로 처리합니다. 바이너리 형식과 효율적인 네트워크 사용으로 모바일 데이터 사용량을 절감하고, 배터리 소비를 줄입니다.

---

## 🔗 관련 용어

- **Protocol Buffers (Protobuf)**: gRPC에서 사용하는 데이터 직렬화 형식
- **HTTP/2**: gRPC가 기반하는 프로토콜
- **RPC (Remote Procedure Call)**: 원격 함수 호출 개념
- **마이크로서비스 아키텍처**: gRPC가 주로 사용되는 구조
- **Unary/Streaming**: gRPC의 4가지 통신 방식
- **Channel**: 클라이언트와 서버 간의 연결
- **Service**: gRPC에서 제공하는 메서드 집합
- **gRPC-Web**: 브라우저에서 gRPC를 사용하게 해주는 프록시
- **WebSocket**: 실시간 통신을 위한 대안 기술
- **REST API**: gRPC와 비교되는 전통적 API 스타일

---
*카테고리: 웹개발*
