# SSE (Server-Sent Events)

## 📝 정의
**SSE (Server-Sent Events)**는 **서버에서 클라이언트로 실시간 데이터를 단방향으로 푸시하는 웹 기술**입니다.

HTTP를 사용하여 서버가 클라이언트에게 자동으로 업데이트를 전송합니다.

### 한 줄 요약
> 서버 → 클라이언트 단방향 실시간 데이터 스트림

### 비유
- 📻 **라디오 방송**: 방송국(서버)이 청취자(클라이언트)에게 지속적으로 정보 전송
- 📰 **뉴스 속보 알림**: 신문사가 구독자에게 자동으로 새 뉴스 전송
- 🚨 **재난 문자**: 정부가 시민들에게 일방적으로 긴급 메시지 전송

## 🎯 핵심 개념

### 1. 단방향 통신 (Unidirectional)
서버 → 클라이언트 방향으로만 데이터가 흐릅니다.

```
Server ────────> Client
       (데이터 푸시)

Client ─────X──> Server
      (SSE로는 불가능)
```

클라이언트가 서버에 데이터를 보내려면 별도의 HTTP 요청이 필요합니다.

### 2. 지속적인 연결 (Persistent Connection)
한 번 연결하면 서버가 계속 데이터를 전송할 수 있습니다.

```javascript
// 연결 한 번 생성
const eventSource = new EventSource('/events');

// 서버가 계속 데이터 전송 가능
eventSource.onmessage = (event) => {
  console.log('New data:', event.data);
};
```

### 3. 자동 재연결 (Auto Reconnection)
연결이 끊어지면 브라우저가 자동으로 재연결을 시도합니다.

```javascript
eventSource.onerror = (error) => {
  console.log('Connection lost, auto-reconnecting...');
  // 브라우저가 자동으로 재연결 시도 (약 3초 후)
};
```

### 4. 이벤트 타입 (Event Types)
여러 종류의 이벤트를 구분해서 전송할 수 있습니다.

```javascript
// 서버에서 다양한 이벤트 전송
// event: notification
// data: 새 메시지가 도착했습니다

// event: update
// data: 데이터베이스 업데이트됨

// 클라이언트에서 이벤트별 처리
eventSource.addEventListener('notification', (e) => {
  showNotification(e.data);
});

eventSource.addEventListener('update', (e) => {
  refreshData(e.data);
});
```

### 5. 텍스트 기반 프로토콜 (Text-Based)
데이터는 텍스트 형식으로 전송됩니다.

```
event: message
id: 1
retry: 10000
data: {"user": "홍길동", "message": "안녕하세요"}

event: update
id: 2
data: {"status": "completed"}
```

## ⚠️ 해결하는 문제

### 문제 1: 폴링(Polling)의 비효율성

**문제 상황**:
```javascript
// 전통적인 폴링: 매 3초마다 서버에 요청
setInterval(() => {
  fetch('/api/updates')
    .then(res => res.json())
    .then(data => updateUI(data));
}, 3000);
```

**문제점**:
- 🔴 새 데이터가 없어도 계속 요청
- 🔴 서버 부하 증가 (100명이면 초당 33개 요청)
- 🔴 네트워크 낭비
- 🔴 배터리 소모

**SSE 해결**:
```javascript
// SSE: 서버가 새 데이터 있을 때만 전송
const eventSource = new EventSource('/api/updates');
eventSource.onmessage = (event) => {
  updateUI(JSON.parse(event.data));
};
```

**결과**:
- ✅ 불필요한 요청 99% 감소
- ✅ 서버 부하 90% 감소
- ✅ 실시간성 향상 (즉시 전송)

### 문제 2: Long Polling의 복잡성

**문제 상황**:
```javascript
// Long Polling: 복잡한 재연결 로직 필요
function longPoll() {
  fetch('/api/wait-for-update', { timeout: 60000 })
    .then(res => res.json())
    .then(data => {
      updateUI(data);
      longPoll(); // 수동 재연결
    })
    .catch(error => {
      setTimeout(longPoll, 5000); // 에러 시 재연결
    });
}
longPoll();
```

**SSE 해결**:
```javascript
// SSE: 브라우저가 자동으로 관리
const eventSource = new EventSource('/api/updates');
eventSource.onmessage = (event) => {
  updateUI(JSON.parse(event.data));
};
// 자동 재연결, 에러 처리 등 브라우저가 알아서 처리
```

### 문제 3: WebSocket의 과잉 (Overkill)

**문제 상황**:
```javascript
// 단방향 데이터만 필요한데 WebSocket 사용
const ws = new WebSocket('ws://example.com');
ws.onmessage = (event) => {
  // 서버 데이터만 받고, 클라이언트는 전송 안 함
  updateUI(event.data);
};
```

**문제점**:
- WebSocket은 양방향 통신이 필요할 때 적합
- 단방향만 필요하면 SSE가 더 간단하고 가벼움

**SSE 해결**:
```javascript
// 단방향 통신에는 SSE가 최적
const eventSource = new EventSource('/updates');
eventSource.onmessage = (event) => {
  updateUI(event.data);
};
```

### 문제 4: 주식 가격 같은 실시간 데이터 표시

**문제 상황**:
주식 가격을 실시간으로 업데이트해야 하는데, 폴링은 지연이 발생

**SSE 해결**:
```javascript
const stockSource = new EventSource('/api/stock-prices');

stockSource.addEventListener('price-update', (event) => {
  const data = JSON.parse(event.data);
  updateStockPrice(data.symbol, data.price);
});

// 서버가 가격 변동 시 즉시 전송
// 지연 시간: 1초 이내
```

## 🏗️ 구조

### SSE 프로토콜 구조


### 메시지 포맷

```
event: notification
id: 123
retry: 5000
data: {"message": "새 알림", "timestamp": 1234567890}

event: update
id: 124
data: {"status": "processing"}
data: {"progress": 50}

: 이것은 주석입니다 (클라이언트에 전송되지 않음)
```

**필드 설명**:
- `event`: 이벤트 타입 (기본값: "message")
- `id`: 이벤트 ID (재연결 시 lastEventId로 사용)
- `retry`: 재연결 대기 시간 (밀리초)
- `data`: 실제 데이터 (여러 줄 가능)
- `:`: 주석 (하트비트로도 사용)

## ⚙️ 작동 원리

### 전체 흐름

```도해
흐름: SSE, 무슨 순서로 오가나
Browser (EventSou… :: GET /events HTTP/1.1 Accept: text…
Server (SSE Endpo… :: HTTP/1.1 200 OK Content-Type: tex…
Server (SSE Endpo… :: data: {"msg": "첫 번째 이벤트"}\n\n
Browser (EventSou… :: onmessage 이벤트 발생
Server (SSE Endpo… :: event: notification data: {"msg":…
Browser (EventSou… :: notification 이벤트 발생
Server (SSE Endpo… :: :\n\n (하트비트)
Browser (EventSou… :: onerror 이벤트 발생
Browser (EventSou… :: GET /events HTTP/1.1 Last-Event-I…
Server (SSE Endpo… :: 연결 재개 및 데이터 전송
```

### 상세 단계별 설명

#### 1단계: 연결 생성
```javascript
// 클라이언트
const eventSource = new EventSource('/api/events');
```

브라우저가 서버에 HTTP GET 요청:
```http
GET /api/events HTTP/1.1
Host: example.com
Accept: text/event-stream
Cache-Control: no-cache
```

#### 2단계: 서버 응답
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

#### 3단계: 데이터 스트리밍
서버가 계속 데이터 전송:
```
data: 첫 번째 메시지

data: 두 번째 메시지

event: custom
data: 커스텀 이벤트
```

#### 4단계: 클라이언트 수신
```javascript
eventSource.onmessage = (event) => {
  console.log('Received:', event.data);
};

eventSource.addEventListener('custom', (event) => {
  console.log('Custom event:', event.data);
});
```

## 💻 코드 구현

### 예시 1: 클라이언트 기본 구현

```javascript
// 기본 SSE 연결
const eventSource = new EventSource('/api/notifications');

// 일반 메시지 수신
eventSource.onmessage = (event) => {
  console.log('Message:', event.data);
  const data = JSON.parse(event.data);
  displayNotification(data);
};

// 연결 열림
eventSource.onopen = () => {
  console.log('Connection opened');
  showConnectionStatus('connected');
};

// 에러 처리
eventSource.onerror = (error) => {
  console.error('Error:', error);
  showConnectionStatus('reconnecting');
};

// 연결 종료
function closeConnection() {
  eventSource.close();
  console.log('Connection closed');
}
```

### 예시 2: 서버 구현 (Node.js + Express)

```javascript
const express = require('express');
const app = express();

// SSE 엔드포인트
app.get('/api/events', (req, res) => {
  // SSE 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 클라이언트에게 즉시 응답
  res.write('retry: 10000\n\n');

  // 주기적으로 데이터 전송
  const interval = setInterval(() => {
    const data = {
      timestamp: Date.now(),
      message: 'Server update'
    };

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);

  // 연결 종료 시 정리
  req.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

app.listen(3000, () => {
  console.log('SSE server running on port 3000');
});
```

### 예시 3: 커스텀 이벤트 타입

```javascript
// 서버
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 알림 이벤트
  function sendNotification(message) {
    res.write(`event: notification\n`);
    res.write(`data: ${JSON.stringify({ message })}\n\n`);
  }

  // 업데이트 이벤트
  function sendUpdate(status) {
    res.write(`event: update\n`);
    res.write(`data: ${JSON.stringify({ status })}\n\n`);
  }

  // 주기적 전송
  setInterval(() => sendNotification('New alert'), 10000);
  setInterval(() => sendUpdate('All systems operational'), 30000);
});

// 클라이언트
const eventSource = new EventSource('/api/events');

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  showAlert(data.message);
});

eventSource.addEventListener('update', (event) => {
  const data = JSON.parse(event.data);
  updateStatus(data.status);
});
```

### 예시 4: 이벤트 ID와 재연결

```javascript
// 서버
let eventId = 0;

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 마지막 이벤트 ID 확인
  const lastEventId = req.headers['last-event-id'];
  console.log('Last Event ID:', lastEventId);

  // 이벤트 전송
  setInterval(() => {
    eventId++;
    res.write(`id: ${eventId}\n`);
    res.write(`data: ${JSON.stringify({ id: eventId, message: 'Update' })}\n\n`);
  }, 5000);
});

// 클라이언트
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  console.log('Event ID:', event.lastEventId);
  console.log('Data:', event.data);
};
```

### 예시 5: 실시간 주식 가격 모니터링

```javascript
// 서버
const stocks = ['AAPL', 'GOOGL', 'MSFT'];

app.get('/api/stock-prices', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    // 랜덤 주식 선택
    const symbol = stocks[Math.floor(Math.random() * stocks.length)];
    const price = (Math.random() * 1000 + 100).toFixed(2);

    const data = {
      symbol,
      price,
      timestamp: new Date().toISOString()
    };

    res.write(`event: price-update\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// 클라이언트
const stockSource = new EventSource('/api/stock-prices');

stockSource.addEventListener('price-update', (event) => {
  const { symbol, price, timestamp } = JSON.parse(event.data);

  // UI 업데이트
  const element = document.getElementById(`stock-${symbol}`);
  if (element) {
    element.textContent = `$${price}`;
    element.className = 'price-update-animation';
  }

  console.log(`${symbol}: $${price} at ${timestamp}`);
});
```

### 예시 6: 하트비트 (Keep-Alive)

```javascript
// 서버
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 하트비트 (30초마다 주석 전송)
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // 실제 데이터 전송
  const dataInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ message: 'Update' })}\n\n`);
  }, 5000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clearInterval(dataInterval);
  });
});
```

## 🔄 P3 프로젝트 적용 사례

### 사례 1: 실시간 알림 시스템

**Before (Polling)**:
```javascript
// 5초마다 서버에 알림 확인 요청
setInterval(() => {
  fetch('/api/notifications')
    .then(res => res.json())
    .then(notifications => {
      updateNotificationBadge(notifications.length);
    });
}, 5000);
```

**문제점**:
- 사용자 1000명 × 초당 0.2회 = 초당 200개 요청
- 알림 없어도 계속 요청
- 서버 부하 높음

**After (SSE)**:
```javascript
// SSE로 실시간 알림
const notificationSource = new EventSource('/api/notifications/stream');

notificationSource.addEventListener('new-notification', (event) => {
  const notification = JSON.parse(event.data);

  // 즉시 알림 표시
  showNotification(notification);
  updateBadge();
});
```

**결과**:
- 서버 요청 95% 감소 (200개/초 → 10개/초)
- 알림 지연 시간: 5초 → 0.5초
- 서버 CPU 사용량: 60% → 15%

### 사례 2: 대시보드 실시간 업데이트

```javascript
// 서버 (Node.js)
const dashboardClients = new Set();

app.get('/api/dashboard/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  dashboardClients.add(res);

  req.on('close', () => {
    dashboardClients.delete(res);
  });
});

// 데이터 변경 시 모든 클라이언트에게 전송
function broadcastUpdate(metric, value) {
  const data = JSON.stringify({ metric, value, timestamp: Date.now() });

  dashboardClients.forEach(client => {
    client.write(`event: metric-update\n`);
    client.write(`data: ${data}\n\n`);
  });
}

// 예: 매출 업데이트
salesDatabase.on('change', (newSales) => {
  broadcastUpdate('sales', newSales);
});

// 클라이언트
const dashboardSource = new EventSource('/api/dashboard/stream');

dashboardSource.addEventListener('metric-update', (event) => {
  const { metric, value, timestamp } = JSON.parse(event.data);

  // 차트 업데이트
  updateChart(metric, value);

  // 애니메이션 효과
  animateMetric(metric);
});
```

**결과**:
- 실시간 반영: 데이터 변경 후 1초 이내 모든 대시보드 업데이트
- 폴링 대비 서버 부하 80% 감소
- 사용자 만족도 40% 향상

### 사례 3: 로그 스트리밍

```javascript
// 서버 로그를 실시간으로 브라우저에 스트리밍
app.get('/api/logs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 로그 파일 감시
  const tail = require('tail').Tail;
  const logFile = new tail('/var/log/application.log');

  logFile.on('line', (line) => {
    res.write(`data: ${JSON.stringify({ log: line })}\n\n`);
  });

  req.on('close', () => {
    logFile.unwatch();
  });
});

// 클라이언트
const logSource = new EventSource('/api/logs/stream');

logSource.onmessage = (event) => {
  const { log } = JSON.parse(event.data);

  // 로그 콘솔에 추가
  const logElement = document.createElement('div');
  logElement.textContent = log;

  // 에러 로그는 빨간색
  if (log.includes('ERROR')) {
    logElement.className = 'log-error';
  }

  document.getElementById('log-console').appendChild(logElement);
};
```

**결과**:
- 개발자가 실시간으로 프로덕션 로그 모니터링 가능
- 디버깅 시간 50% 단축

## 📊 SSE vs WebSocket vs Polling

| 구분 | SSE | WebSocket | Polling |
|------|-----|-----------|---------|
| **방향** | 단방향 (서버→클라이언트) | 양방향 | 단방향 (클라이언트→서버) |
| **프로토콜** | HTTP | WebSocket (ws://) | HTTP |
| **재연결** | 자동 | 수동 | 수동 |
| **복잡도** | 낮음 | 중간 | 낮음 |
| **브라우저 지원** | 대부분 (IE 제외) | 모든 최신 브라우저 | 모든 브라우저 |
| **프록시 통과** | 쉬움 | 어려움 | 쉬움 |
| **적합한 용도** | 알림, 피드, 로그 | 채팅, 게임 | 간단한 업데이트 |
| **서버 부하** | 낮음 | 낮음 | 높음 |

## ⚠️ 제약사항

### 1. 단방향 통신만 가능
```javascript
// ❌ SSE로는 클라이언트 → 서버 전송 불가
eventSource.send('message'); // 이런 메서드 없음

// ✅ 별도 HTTP 요청으로 전송해야 함
fetch('/api/send-message', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
});
```

### 2. 브라우저 연결 제한
대부분 브라우저는 도메인당 6개 연결만 허용:
```javascript
// ❌ 나쁜 예: 7개 SSE 연결 시도
const source1 = new EventSource('/stream1');
const source2 = new EventSource('/stream2');
// ... source7까지
// → 마지막 연결이 블록될 수 있음

// ✅ 좋은 예: 하나의 스트림으로 통합
const source = new EventSource('/unified-stream');
```

### 3. 텍스트만 전송 가능
```javascript
// ❌ 바이너리 데이터 직접 전송 불가

// ✅ Base64로 인코딩해서 전송
res.write(`data: ${base64EncodedImage}\n\n`);
```

## ✅ 모범 사례 (Best Practices)

### 1. 하트비트 구현
```javascript
// 서버
setInterval(() => {
  res.write(': heartbeat\n\n');
}, 30000);
```

### 2. 에러 처리
```javascript
// 클라이언트
let retryCount = 0;
const MAX_RETRIES = 5;

eventSource.onerror = (error) => {
  retryCount++;

  if (retryCount > MAX_RETRIES) {
    eventSource.close();
    showError('연결 실패. 페이지를 새로고침해주세요.');
  }
};

eventSource.onopen = () => {
  retryCount = 0; // 성공 시 카운트 리셋
};
```

### 3. 연결 관리
```javascript
// 페이지 언로드 시 연결 종료
window.addEventListener('beforeunload', () => {
  eventSource.close();
});

// 페이지 비활성화 시 연결 종료
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    eventSource.close();
  } else {
    // 페이지 활성화 시 재연결
    eventSource = new EventSource('/api/events');
  }
});
```

## 🔗 관련 용어
- [[WebSocket]]: 양방향 실시간 통신 기술
- [[HTTP]]: SSE가 사용하는 기반 프로토콜
- [[Long Polling]]: 실시간 통신의 이전 방식
- [[REST API]]: SSE와 함께 사용되는 API 아키텍처
- [[EventSource]]: SSE 클라이언트 API
- [[Stream]]: 지속적인 데이터 흐름

---
*카테고리: 네트워크*
