# Socket (소켓)

## 📝 정의

Socket(소켓)은 **네트워크를 통해 데이터를 주고받기 위한 연결 지점**으로, 프로그램 간 통신의 양 끝단(endpoint)입니다.

### 핵심 개념

- **무엇인가?**: 네트워크 통신의 엔드포인트
- **왜 필요한가?**: 프로그램 간 데이터 교환 필요
- **어떻게 작동하나?**: IP 주소 + 포트 번호로 연결

### Socket이 해결하는 문제

**문제 상황**:
```
😱 시나리오: 프로그램 간 통신
서버 프로그램 → 클라이언트 프로그램
→ 어떻게 데이터 전송?
→ 파일? 메모리 공유? (복잡!)  😱
```

**Socket의 해결**:
```
✅ 표준화된 통신:
서버 → Socket 생성 (포트 9000 대기)
클라이언트 → Socket으로 연결 (IP:9000)
→ 데이터 송수신 (읽기/쓰기처럼 간단)
→ 표준화된 방식! ✅
```

**비유**:
- **Socket 없음** = 전화번호 없이 통화 시도
- **Socket** = 전화기 + 전화번호 (통화 연결)

## 📊 Socket 통신 흐름

```도해
흐름: Socket, 무슨 순서로 오가나
서버 :: socket() · 소켓 생성
서버 :: bind() · 포트 바인딩
서버 :: listen() · 연결 대기
클라이언트 :: socket() · 소켓 생성
클라이언트 :: connect() · 연결 요청
서버 :: accept() · 연결 수락
클라이언트 :: send() · 데이터 전송
서버 :: recv() · 데이터 수신
서버 :: send() · 응답 전송
클라이언트 :: recv() · 응답 수신
클라이언트 :: close() · 연결 종료
```

## 💡 TCP Socket 구현

### 서버 (Python)
```python
import socket

def start_server():
    """TCP 서버"""
    # 1. 소켓 생성
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # 주소 재사용 (재시작 시 바로 바인딩 가능)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    # 2. 포트 바인딩
    host = '0.0.0.0'  # 모든 인터페이스
    port = 9000
    server_socket.bind((host, port))
    
    # 3. 연결 대기 (최대 5개 대기)
    server_socket.listen(5)
    print(f"Server listening on {host}:{port}")
    
    while True:
        # 4. 클라이언트 연결 수락
        client_socket, address = server_socket.accept()
        print(f"Connected by {address}")
        
        try:
            # 5. 데이터 수신
            data = client_socket.recv(1024)  # 최대 1024 바이트
            
            if data:
                message = data.decode('utf-8')
                print(f"Received: {message}")
                
                # 6. 응답 전송
                response = f"Echo: {message}"
                client_socket.send(response.encode('utf-8'))
        
        finally:
            # 7. 연결 종료
            client_socket.close()

if __name__ == '__main__':
    start_server()
```

### 클라이언트 (Python)
```python
import socket

def start_client():
    """TCP 클라이언트"""
    # 1. 소켓 생성
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # 2. 서버 연결
    host = 'localhost'
    port = 9000
    client_socket.connect((host, port))
    
    try:
        # 3. 데이터 전송
        message = "Hello, Server!"
        client_socket.send(message.encode('utf-8'))
        
        # 4. 응답 수신
        response = client_socket.recv(1024)
        print(f"Received: {response.decode('utf-8')}")
    
    finally:
        # 5. 연결 종료
        client_socket.close()

if __name__ == '__main__':
    start_client()
```

## 💡 UDP Socket (비연결형)

### UDP 서버
```python
import socket

def udp_server():
    """UDP 서버 (빠르지만 신뢰성 낮음)"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', 9000))
    
    print("UDP Server listening on port 9000")
    
    while True:
        # 데이터 수신
        data, address = sock.recvfrom(1024)
        message = data.decode('utf-8')
        print(f"Received from {address}: {message}")
        
        # 응답 전송
        response = f"Echo: {message}"
        sock.sendto(response.encode('utf-8'), address)
```

### UDP 클라이언트
```python
import socket

def udp_client():
    """UDP 클라이언트"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # 연결 과정 없이 바로 전송
    message = "Hello, UDP Server!"
    sock.sendto(message.encode('utf-8'), ('localhost', 9000))
    
    # 응답 수신
    data, address = sock.recvfrom(1024)
    print(f"Received: {data.decode('utf-8')}")
    
    sock.close()
```

## 💡 멀티 클라이언트 처리

### Threading 방식
```python
import socket
import threading

def handle_client(client_socket, address):
    """클라이언트 처리 (별도 스레드)"""
    print(f"New connection from {address}")
    
    try:
        while True:
            data = client_socket.recv(1024)
            
            if not data:
                break  # 연결 종료
            
            message = data.decode('utf-8')
            print(f"{address}: {message}")
            
            # Echo 응답
            response = f"Echo: {message}"
            client_socket.send(response.encode('utf-8'))
    
    finally:
        client_socket.close()
        print(f"Connection closed: {address}")

def multi_client_server():
    """멀티 클라이언트 서버"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind(('0.0.0.0', 9000))
    server_socket.listen(5)
    
    print("Multi-client server listening on port 9000")
    
    while True:
        client_socket, address = server_socket.accept()
        
        # 새 스레드에서 클라이언트 처리
        client_thread = threading.Thread(
            target=handle_client,
            args=(client_socket, address)
        )
        client_thread.start()
```

### 비동기 방식 (asyncio)
```python
import asyncio

async def handle_client(reader, writer):
    """비동기 클라이언트 처리"""
    address = writer.get_extra_info('peername')
    print(f"New connection from {address}")
    
    try:
        while True:
            data = await reader.read(1024)
            
            if not data:
                break
            
            message = data.decode('utf-8')
            print(f"{address}: {message}")
            
            # Echo 응답
            response = f"Echo: {message}"
            writer.write(response.encode('utf-8'))
            await writer.drain()
    
    finally:
        writer.close()
        await writer.wait_closed()

async def async_server():
    """비동기 멀티 클라이언트 서버"""
    server = await asyncio.start_server(
        handle_client,
        '0.0.0.0',
        9000
    )
    
    print("Async server listening on port 9000")
    
    async with server:
        await server.serve_forever()

# 실행
asyncio.run(async_server())
```

## 💡 WebSocket

### 서버 (Flask-SocketIO)
```python
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    """클라이언트 연결"""
    print('Client connected')

@socketio.on('message')
def handle_message(data):
    """메시지 수신"""
    print(f"Received: {data}")
    
    # 모든 클라이언트에게 브로드캐스트
    emit('message', {'data': f'Echo: {data}'}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    """클라이언트 연결 해제"""
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
```

### 클라이언트 (JavaScript)
```javascript
// WebSocket 연결
const socket = io('http://localhost:5000');

// 연결 성공
socket.on('connect', () => {
  console.log('Connected to server');
  
  // 메시지 전송
  socket.emit('message', 'Hello, WebSocket!');
});

// 메시지 수신
socket.on('message', (data) => {
  console.log('Received:', data);
});

// 연결 종료
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

## 🎯 TCP vs UDP

| 항목 | TCP | UDP |
|------|-----|-----|
| **연결** | 연결 지향 | 비연결 |
| **신뢰성** | 높음 (재전송) | 낮음 |
| **속도** | 느림 | 빠름 |
| **순서** | 보장 | 보장 안 함 |
| **사용 사례** | HTTP, 파일 전송 | 동영상, 게임 |

## 💡 채팅 서버 예시

```python
import socket
import threading

clients = []

def broadcast(message, sender_socket):
    """모든 클라이언트에게 메시지 전송"""
    for client in clients:
        if client != sender_socket:
            try:
                client.send(message)
            except:
                clients.remove(client)

def handle_client(client_socket, address):
    """채팅 클라이언트 처리"""
    print(f"{address} joined the chat")
    clients.append(client_socket)
    
    try:
        while True:
            message = client_socket.recv(1024)
            
            if not message:
                break
            
            # 모든 클라이언트에게 브로드캐스트
            broadcast(message, client_socket)
    
    finally:
        clients.remove(client_socket)
        client_socket.close()
        print(f"{address} left the chat")

def chat_server():
    """채팅 서버"""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(('0.0.0.0', 9000))
    server.listen(5)
    
    print("Chat server started on port 9000")
    
    while True:
        client_socket, address = server.accept()
        thread = threading.Thread(
            target=handle_client,
            args=(client_socket, address)
        )
        thread.start()
```

## 🔗 관련 용어

- [[TCP/IP]]: Socket의 기반 프로토콜
- [[WebSocket]]: 양방향 실시간 통신
- [[HTTP]]: Socket 기반 프로토콜

---
*카테고리: 네트워크*
*생성일: 2026-02-14*
