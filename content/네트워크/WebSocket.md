# WebSocket

## 📝 정의
**WebSocket**은 **클라이언트와 서버 간 양방향 실시간 통신을 제공하는 프로토콜**입니다.

HTTP와 달리 한 번 연결하면 지속적으로 데이터를 주고받을 수 있습니다.

### 한 줄 요약
> 클라이언트 ↔ 서버 양방향 실시간 통신 프로토콜

### 비유
- 📞 **전화 통화**: 양쪽이 동시에 말하고 들을 수 있음
- 🎮 **멀티플레이 게임**: 모든 플레이어가 실시간으로 상호작용
- 💬 **메신저 채팅**: 양방향 즉시 메시지 전송

## 🎯 핵심 개념

### 1. 양방향 통신 (Bidirectional)
클라이언트와 서버가 동시에 데이터를 주고받을 수 있습니다.

```
Client <──────────> Server
       (양방향 통신)
```

```javascript
// 클라이언트 → 서버
ws.send('Hello from client');

// 서버 → 클라이언트
ws.onmessage = (event) => {
  console.log('From server:', event.data);
};
```

### 2. 지속적인 연결 (Persistent Connection)
HTTP와 달리 연결을 계속 유지합니다.

```
HTTP:  연결 → 요청 → 응답 → 종료 → 연결 → ...
       (매번 새로운 연결)

WebSocket: 연결 → 데이터 주고받기 → 데이터 주고받기 → ...
          (한 번 연결, 계속 사용)
```

### 3. 낮은 지연 시간 (Low Latency)
헤더 오버헤드가 최소화되어 빠릅니다.

```
HTTP 요청/응답:
- 요청 헤더: 500-1000 바이트
- 응답 헤더: 300-500 바이트
- 실제 데이터: 100 바이트
→ 총 1000+ 바이트

WebSocket 프레임:
- 프레임 헤더: 2-14 바이트
- 실제 데이터: 100 바이트
→ 총 102-114 바이트 (90% 감소!)
```

### 4. 프로토콜 전환 (Protocol Upgrade)
HTTP로 시작해서 WebSocket으로 전환됩니다.

```http
// 1단계: HTTP 핸드셰이크
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade

// 2단계: 서버 응답
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade

// 3단계: WebSocket 통신 시작
```

### 5. 프레임 기반 통신 (Frame-Based)
데이터는 프레임 단위로 전송됩니다.

```javascript
// 텍스트 프레임
ws.send('Hello');

// 바이너리 프레임
const buffer = new ArrayBuffer(8);
ws.send(buffer);

// JSON 프레임
ws.send(JSON.stringify({ type: 'message', text: 'Hi' }));
```

## ⚠️ 해결하는 문제

### 문제 1: HTTP 폴링의 비효율성

**문제 상황**:
```javascript
// HTTP 폴링: 매 1초마다 요청
setInterval(() => {
  fetch('/api/messages')
    .then(res => res.json())
    .then(messages => updateChat(messages));
}, 1000);
```

**문제점**:
- 🔴 초당 1000명 × 1요청 = 1000개 요청
- 🔴 각 요청마다 헤더 1KB → 초당 1MB 낭비
- 🔴 메시지 없어도 계속 요청
- 🔴 서버 부하 극심

**WebSocket 해결**:
```javascript
// WebSocket: 한 번 연결, 메시지 있을 때만 전송
const ws = new WebSocket('ws://example.com/chat');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateChat(message);
};
```

**결과**:
- 네트워크 트래픽 99% 감소
- 서버 부하 95% 감소
- 실시간 응답 (지연 시간 < 50ms)

### 문제 2: 실시간 채팅의 지연

**문제 상황 (HTTP)**:
```
A: "안녕" → 서버 → 폴링 대기 (1초) → B: 수신
B: "반가워" → 서버 → 폴링 대기 (1초) → A: 수신

평균 지연: 0.5 ~ 1초
```

**WebSocket 해결**:
```
A: "안녕" → 서버 → 즉시 전송 → B: 수신 (50ms)
B: "반가워" → 서버 → 즉시 전송 → A: 수신 (50ms)

평균 지연: 50ms (20배 빠름)
```

### 문제 3: 온라인 게임의 동기화

**문제 상황**:
```javascript
// HTTP로 게임 상태 업데이트 (불가능)
setInterval(() => {
  fetch('/game/state', {
    method: 'POST',
    body: JSON.stringify({ x: player.x, y: player.y })
  });

  fetch('/game/state')
    .then(res => res.json())
    .then(state => updateGame(state));
}, 100); // 초당 10회 요청 × 100명 = 1000개 요청

// 문제: 지연이 심해서 게임이 끊김
```

**WebSocket 해결**:
```javascript
// WebSocket으로 실시간 동기화
const ws = new WebSocket('ws://game.example.com');

// 플레이어 위치 업데이트
ws.send(JSON.stringify({
  type: 'move',
  x: player.x,
  y: player.y
}));

// 다른 플레이어 위치 수신
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateOtherPlayers(data);
};
```

**결과**:
- 초당 100회 업데이트 가능 (10배 향상)
- 지연 시간 100ms → 20ms (5배 빠름)
- 부드러운 게임 플레이

### 문제 4: 협업 도구의 실시간 편집

**문제 상황 (Google Docs 같은 도구)**:
```javascript
// HTTP로는 실시간 동시 편집 불가능
// A가 타이핑 → 폴링 → B가 확인 (지연)
// B가 타이핑 → 폴링 → A가 확인 (지연)
// → 충돌 발생, 덮어쓰기 문제
```

**WebSocket 해결**:
```javascript
// 실시간 동시 편집
ws.onmessage = (event) => {
  const change = JSON.parse(event.data);

  // 다른 사용자의 변경사항 즉시 반영
  applyChange(change);

  // 커서 위치도 실시간 표시
  if (change.type === 'cursor') {
    updateCursor(change.userId, change.position);
  }
};

// 내 변경사항 전송
editor.on('change', (change) => {
  ws.send(JSON.stringify({
    type: 'edit',
    change: change
  }));
});
```

## ⚙️ 작동 원리

### 전체 흐름

```도해
흐름: WebSocket, 무슨 순서로 오가나
Client (Browser) :: HTTP GET /chat Upgrade: websocket…
Server (WebSocket… :: HTTP 101 Switching Protocols Upgr…
Client (Browser) :: onopen 이벤트 발생
Client (Browser) :: Text Frame: "Hello
Server (WebSocket… :: Text Frame: "Hi there!
Client (Browser) :: Binary Frame: [이미지 데이터]
Server (WebSocket… :: Text Frame: "Image received
Server (WebSocket… :: Ping Frame
Client (Browser) :: Pong Frame
Client (Browser) :: Close Frame (code: 1000)
Server (WebSocket… :: Close Frame (code: 1000)
Client (Browser) :: onclose 이벤트 발생
```

### 핸드셰이크 상세

```도해
흐름: WebSocket, 무슨 순서로 오가나
Browser :: new WebSocket('ws://...')
Client Code :: GET /chat HTTP/1.1 Host: example.…
Server :: HTTP/1.1 101 Switching Protocols…
Client Code :: onopen 이벤트
Browser :: WebSocket ready!
```

### 메시지 전송 과정

```
1. 애플리케이션 데이터 생성
   "Hello World"

2. 프레임 생성
   [FIN=1][Opcode=0x1(Text)][Mask=1][Length=11][MaskingKey][Payload]

3. TCP로 전송
   WebSocket Frame → TCP Segment → IP Packet → Network

4. 서버 수신
   Network → IP Packet → TCP Segment → WebSocket Frame

5. 프레임 파싱
   마스킹 해제 → 페이로드 추출 → "Hello World"

6. 애플리케이션 핸들러 호출
   onmessage(event)
```

## 💻 코드 구현

### 예시 1: 클라이언트 기본 구현

```javascript
// WebSocket 연결 생성
const ws = new WebSocket('ws://localhost:8080/chat');

// 연결 열림
ws.onopen = (event) => {
  console.log('Connected to server');

  // 서버에 메시지 전송
  ws.send('Hello Server!');

  // JSON 데이터 전송
  ws.send(JSON.stringify({
    type: 'join',
    username: '홍길동'
  }));
};

// 메시지 수신
ws.onmessage = (event) => {
  console.log('Received:', event.data);

  // JSON 파싱
  try {
    const data = JSON.parse(event.data);
    handleMessage(data);
  } catch (e) {
    console.log('Plain text:', event.data);
  }
};

// 에러 처리
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// 연결 종료
ws.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);

  if (event.code === 1006) {
    console.log('Abnormal closure, attempting reconnect...');
    reconnect();
  }
};

// 메시지 전송 함수
function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open');
  }
}

// 연결 종료
function disconnect() {
  ws.close(1000, 'User initiated close');
}
```

### 예시 2: 서버 구현 (Node.js + ws)

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// 연결된 클라이언트 관리
const clients = new Set();

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  clients.add(ws);

  // 클라이언트에게 환영 메시지
  ws.send(JSON.stringify({
    type: 'welcome',
    message: '채팅방에 오신 것을 환영합니다!'
  }));

  // 메시지 수신
  ws.on('message', (data) => {
    console.log('Received:', data);

    try {
      const message = JSON.parse(data);

      // 모든 클라이언트에게 브로드캐스트
      broadcast(message);
    } catch (e) {
      console.error('Invalid JSON');
    }
  });

  // 연결 종료
  ws.on('close', (code, reason) => {
    console.log('Client disconnected:', code, reason);
    clients.delete(ws);
  });

  // 에러 처리
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// 모든 클라이언트에게 브로드캐스트
function broadcast(message) {
  const data = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Keep-Alive (Ping/Pong)
setInterval(() => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.ping();
    }
  });
}, 30000);

console.log('WebSocket server running on port 8080');
```

### 예시 3: 채팅 애플리케이션

```javascript
// 클라이언트
class ChatClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.username = null;
    this.setupHandlers();
  }

  setupHandlers() {
    this.ws.onopen = () => {
      console.log('Connected to chat');
      this.showStatus('Connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from chat');
      this.showStatus('Disconnected');
      this.reconnect();
    };
  }

  handleMessage(message) {
    switch (message.type) {
      case 'chat':
        this.displayMessage(message.username, message.text);
        break;

      case 'user-joined':
        this.displaySystemMessage(`${message.username} joined`);
        break;

      case 'user-left':
        this.displaySystemMessage(`${message.username} left`);
        break;

      case 'users-online':
        this.updateUserList(message.users);
        break;
    }
  }

  join(username) {
    this.username = username;
    this.send({
      type: 'join',
      username: username
    });
  }

  sendMessage(text) {
    this.send({
      type: 'chat',
      username: this.username,
      text: text,
      timestamp: Date.now()
    });
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  displayMessage(username, text) {
    const chatBox = document.getElementById('chat-box');
    const messageEl = document.createElement('div');
    messageEl.innerHTML = `<strong>${username}:</strong> ${text}`;
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  displaySystemMessage(text) {
    const chatBox = document.getElementById('chat-box');
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.textContent = text;
    chatBox.appendChild(messageEl);
  }

  reconnect() {
    setTimeout(() => {
      console.log('Reconnecting...');
      this.ws = new WebSocket(this.ws.url);
      this.setupHandlers();
    }, 3000);
  }
}

// 사용
const chat = new ChatClient('ws://localhost:8080');

document.getElementById('join-btn').onclick = () => {
  const username = document.getElementById('username').value;
  chat.join(username);
};

document.getElementById('send-btn').onclick = () => {
  const text = document.getElementById('message-input').value;
  chat.sendMessage(text);
  document.getElementById('message-input').value = '';
};
```

### 예시 4: 실시간 게임 (간단한 멀티플레이어)

```javascript
// 클라이언트
class GameClient {
  constructor() {
    this.ws = new WebSocket('ws://localhost:8080/game');
    this.players = {};
    this.myId = null;

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleGameMessage(data);
    };
  }

  handleGameMessage(data) {
    switch (data.type) {
      case 'init':
        this.myId = data.playerId;
        this.players = data.players;
        break;

      case 'player-move':
        this.updatePlayerPosition(data.playerId, data.x, data.y);
        break;

      case 'player-joined':
        this.addPlayer(data.playerId, data.x, data.y);
        break;

      case 'player-left':
        this.removePlayer(data.playerId);
        break;
    }
  }

  move(x, y) {
    this.ws.send(JSON.stringify({
      type: 'move',
      x: x,
      y: y
    }));
  }

  updatePlayerPosition(playerId, x, y) {
    if (this.players[playerId]) {
      this.players[playerId].x = x;
      this.players[playerId].y = y;
      this.renderPlayer(playerId);
    }
  }
}

// 게임 루프
const game = new GameClient();

document.addEventListener('keydown', (e) => {
  const player = game.players[game.myId];
  if (!player) return;

  switch (e.key) {
    case 'ArrowUp':
      game.move(player.x, player.y - 10);
      break;
    case 'ArrowDown':
      game.move(player.x, player.y + 10);
      break;
    case 'ArrowLeft':
      game.move(player.x - 10, player.y);
      break;
    case 'ArrowRight':
      game.move(player.x + 10, player.y);
      break;
  }
});
```

### 예시 5: 바이너리 데이터 전송

```javascript
// 이미지를 바이너리로 전송
async function sendImage(ws, file) {
  const arrayBuffer = await file.arrayBuffer();

  // 바이너리 데이터 전송
  ws.send(arrayBuffer);
}

// 바이너리 데이터 수신
ws.onmessage = (event) => {
  if (event.data instanceof Blob) {
    // Blob으로 수신
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      processImageData(arrayBuffer);
    };
    reader.readAsArrayBuffer(event.data);
  } else if (event.data instanceof ArrayBuffer) {
    // ArrayBuffer로 수신
    processImageData(event.data);
  } else {
    // 텍스트로 수신
    const message = JSON.parse(event.data);
    handleTextMessage(message);
  }
};

// 서버에서 바이너리 처리
ws.on('message', (data) => {
  if (Buffer.isBuffer(data)) {
    console.log('Received binary data:', data.length, 'bytes');
    // 이미지 저장 또는 처리
    processImage(data);
  } else {
    const message = JSON.parse(data);
    handleTextMessage(message);
  }
});
```

## 🔄 P3 프로젝트 적용 사례

### 사례 1: 실시간 협업 문서 편집

**Before (HTTP 폴링)**:
```javascript
// 매 2초마다 문서 변경사항 확인
setInterval(() => {
  fetch('/api/document/changes')
    .then(res => res.json())
    .then(changes => applyChanges(changes));
}, 2000);
```

**문제점**:
- 동시 편집 시 충돌 발생
- 2초 지연으로 부자연스러움
- 10명 편집 시 초당 5개 요청 = 높은 서버 부하

**After (WebSocket)**:
```javascript
const ws = new WebSocket('ws://example.com/document/123');

ws.onmessage = (event) => {
  const change = JSON.parse(event.data);

  // 다른 사용자의 변경사항 즉시 반영
  applyChange(change);

  // 커서 위치도 실시간 표시
  if (change.type === 'cursor') {
    updateCursor(change.userId, change.position);
  }
};

editor.on('change', (change) => {
  ws.send(JSON.stringify(change));
});
```

**결과**:
- 지연 시간: 2초 → 50ms (40배 빠름)
- 충돌 발생률: 95% 감소
- 서버 부하: 80% 감소
- 사용자 만족도: 60% 향상

### 사례 2: 실시간 주문 대시보드

```javascript
// 주문 관리 시스템
const orderWs = new WebSocket('ws://example.com/orders/live');

orderWs.onmessage = (event) => {
  const order = JSON.parse(event.data);

  switch (order.status) {
    case 'new':
      // 새 주문 알림 + 사운드
      playNotificationSound();
      addOrderToList(order);
      break;

    case 'preparing':
      updateOrderStatus(order.id, '준비 중');
      break;

    case 'ready':
      updateOrderStatus(order.id, '완료');
      highlightOrder(order.id);
      break;
  }

  // 실시간 매출 차트 업데이트
  updateRevenueChart(order.amount);
};

// 주문 상태 업데이트
function updateOrder(orderId, status) {
  orderWs.send(JSON.stringify({
    type: 'update-status',
    orderId: orderId,
    status: status
  }));
}
```

**결과**:
- 주문 처리 속도: 30% 향상
- 주문 누락: 0건 (이전 5-10건/일)
- 직원 만족도 향상

### 사례 3: 실시간 주식 트레이딩 플랫폼

```javascript
const stockWs = new WebSocket('wss://example.com/stocks');

// 관심 종목 구독
stockWs.onopen = () => {
  stockWs.send(JSON.stringify({
    type: 'subscribe',
    symbols: ['AAPL', 'GOOGL', 'MSFT']
  }));
};

stockWs.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'quote') {
    // 실시간 가격 업데이트
    updatePrice(data.symbol, data.price, data.change);

    // 가격 알림 조건 체크
    if (data.price >= priceAlerts[data.symbol]) {
      showAlert(`${data.symbol} reached target price!`);
    }
  }

  if (data.type === 'trade') {
    // 실시간 거래 내역
    addTradeToFeed(data);
  }
};

// 주문 실행
function placeOrder(symbol, quantity, price) {
  stockWs.send(JSON.stringify({
    type: 'order',
    symbol: symbol,
    quantity: quantity,
    price: price,
    timestamp: Date.now()
  }));
}
```

**결과**:
- 가격 업데이트: 초당 100회 (이전 10회)
- 주문 실행 속도: 500ms → 50ms
- 사용자 거래량: 40% 증가

## 📊 WebSocket vs SSE vs Long Polling

| 구분 | WebSocket | SSE | Long Polling |
|------|-----------|-----|--------------|
| **방향** | 양방향 | 단방향 (서버→클라) | 단방향 |
| **프로토콜** | ws:// / wss:// | HTTP | HTTP |
| **재연결** | 수동 | 자동 | 수동 |
| **바이너리** | 지원 | 미지원 | 미지원 |
| **복잡도** | 중간 | 낮음 | 높음 |
| **지연시간** | 매우 낮음 (10-50ms) | 낮음 (50-200ms) | 높음 (500-2000ms) |
| **서버 부하** | 낮음 | 낮음 | 높음 |
| **적합한 용도** | 채팅, 게임, 협업 | 알림, 피드, 로그 | 간단한 업데이트 |
| **프록시** | 어려움 | 쉬움 | 쉬움 |

## ⚠️ 제약사항 및 주의사항

### 1. 방화벽 및 프록시 문제
```javascript
// 일부 프록시는 WebSocket 차단
// wss:// (보안 WebSocket) 사용 권장
const ws = new WebSocket('wss://example.com');

// 폴백 전략
if (!ws) {
  // SSE 또는 Long Polling으로 대체
  fallbackToSSE();
}
```

### 2. 연결 제한
```javascript
// 브라우저당 도메인당 연결 수 제한
// Chrome: 255개
// Firefox: 200개

// ❌ 나쁜 예: 과도한 연결
for (let i = 0; i < 1000; i++) {
  new WebSocket('ws://example.com/' + i);
}

// ✅ 좋은 예: 하나의 연결로 여러 채널
const ws = new WebSocket('ws://example.com');
ws.send(JSON.stringify({ action: 'subscribe', channels: [1, 2, 3] }));
```

### 3. 메모리 관리
```javascript
// ❌ 나쁜 예: 연결 종료 안 함
const ws = new WebSocket('ws://example.com');
// 페이지 이동 시에도 연결 유지

// ✅ 좋은 예: 정리
window.addEventListener('beforeunload', () => {
  ws.close();
});
```

### 4. 메시지 순서 보장
```javascript
// WebSocket은 순서를 보장하지만, 재연결 시 주의
let messageId = 0;

function sendMessage(data) {
  ws.send(JSON.stringify({
    id: messageId++,
    data: data
  }));
}

// 서버에서 순서 확인
ws.on('message', (data) => {
  const message = JSON.parse(data);
  if (message.id !== expectedId) {
    requestResend(expectedId);
  }
});
```

## ✅ 모범 사례 (Best Practices)

### 1. 재연결 로직
```javascript
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.reconnectAttempts = 0;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    };

    this.ws.onclose = () => {
      console.log('Disconnected, reconnecting...');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  reconnect() {
    this.reconnectAttempts++;

    setTimeout(() => {
      console.log(`Reconnect attempt ${this.reconnectAttempts}`);
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      this.maxReconnectDelay
    );
  }
}
```

### 2. Heartbeat (Keep-Alive)
```javascript
// 클라이언트
let heartbeatInterval;

ws.onopen = () => {
  // 30초마다 ping 전송
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
};

ws.onclose = () => {
  clearInterval(heartbeatInterval);
};

// 서버
ws.on('message', (data) => {
  const message = JSON.parse(data);

  if (message.type === 'ping') {
    ws.send(JSON.stringify({ type: 'pong' }));
  }
});
```

### 3. 메시지 큐잉
```javascript
class QueuedWebSocket {
  constructor(url) {
    this.url = url;
    this.queue = [];
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      // 큐에 있는 메시지 전송
      while (this.queue.length > 0) {
        const message = this.queue.shift();
        this.ws.send(message);
      }
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      // 연결 안 되어 있으면 큐에 저장
      this.queue.push(data);
    }
  }
}
```

## 🔗 관련 용어
- [[SSE]]: 서버 → 클라이언트 단방향 실시간 통신
- [[HTTP]]: WebSocket 핸드셰이크에 사용
- [[TCP]]: WebSocket의 기반 프로토콜
- [[Socket.io]]: WebSocket 래퍼 라이브러리
- [[Protocol Upgrade]]: HTTP에서 WebSocket으로 전환
- [[Full Duplex]]: 양방향 동시 통신

---
*카테고리: 네트워크*
