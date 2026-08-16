# Thread (스레드)

## 📝 정의

Thread(스레드)는 **프로세스 내에서 실행되는 작업의 단위**로, 하나의 프로그램이 여러 작업을 동시에 처리할 수 있게 합니다.

### 핵심 개념

- **무엇인가?**: 프로그램 실행의 최소 단위
- **왜 필요한가?**: 여러 작업을 동시에 수행
- **어떻게 작동하나?**: 프로세스 내 메모리 공유하며 독립 실행

### Thread가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 단일 스레드 프로그램
웹 서버 → 요청 1개 처리 중
→ 요청 2가 도착
→ 요청 1 완료까지 대기
→ 느린 응답! 😱
```

**Thread의 해결**:
```
✅ 동시 처리:
웹 서버 → 스레드 1: 요청 1 처리
         → 스레드 2: 요청 2 처리
→ 동시에 처리
→ 빠른 응답! ✅
```

**비유**:
- **단일 스레드** = 은행 창구 1개 (한 명씩 처리)
- **멀티 스레드** = 은행 창구 여러 개 (동시 처리)

## 📊 Process vs Thread

```도해
층: Thread, 어떻게 나뉘어 있나
Process :: 메모리 공간 독립적
T1 :: Stack · Register
T2 :: Stack · Register
T3 :: Stack · Register
```

## 💡 Python Threading

### 기본 사용법
```python
import threading
import time

def task(name, duration):
    """스레드에서 실행될 작업"""
    print(f"[{name}] 시작")
    time.sleep(duration)
    print(f"[{name}] 완료")

# 스레드 생성
thread1 = threading.Thread(target=task, args=("Thread-1", 2))
thread2 = threading.Thread(target=task, args=("Thread-2", 3))

# 스레드 시작
thread1.start()
thread2.start()

# 메인 스레드는 계속 실행
print("메인 스레드 실행 중...")

# 스레드 종료 대기
thread1.join()
thread2.join()

print("모든 스레드 완료")

# 출력:
# [Thread-1] 시작
# [Thread-2] 시작
# 메인 스레드 실행 중...
# [Thread-1] 완료
# [Thread-2] 완료
# 모든 스레드 완료
```

### 클래스로 Thread 생성
```python
class WorkerThread(threading.Thread):
    """커스텀 스레드 클래스"""
    
    def __init__(self, name, task_id):
        super().__init__()
        self.name = name
        self.task_id = task_id
    
    def run(self):
        """스레드 실행 시 호출됨"""
        print(f"[{self.name}] Task {self.task_id} 시작")
        time.sleep(2)
        print(f"[{self.name}] Task {self.task_id} 완료")

# 사용
workers = []
for i in range(3):
    worker = WorkerThread(f"Worker-{i}", i)
    worker.start()
    workers.append(worker)

# 모든 워커 대기
for worker in workers:
    worker.join()
```

## 💡 Thread 동기화

### 1. Lock (뮤텍스)
```python
import threading

counter = 0
lock = threading.Lock()

def increment():
    """카운터 증가 (Race Condition 위험)"""
    global counter
    
    # ❌ Lock 없이 (문제 발생 가능)
    # for _ in range(100000):
    #     counter += 1
    
    # ✅ Lock 사용 (안전)
    for _ in range(100000):
        with lock:  # 또는 lock.acquire() ... lock.release()
            counter += 1

threads = []
for _ in range(10):
    thread = threading.Thread(target=increment)
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()

print(f"Counter: {counter}")
# Lock 없이: 예측 불가 (Race Condition)
# Lock 사용: 1,000,000 (정확)
```

### 2. Semaphore (세마포어)
```python
# 동시 접속 제한 (예: 최대 3개 스레드만)
semaphore = threading.Semaphore(3)

def limited_access(thread_id):
    """동시에 3개까지만 실행"""
    print(f"Thread {thread_id} 대기 중...")
    
    with semaphore:
        print(f"Thread {thread_id} 실행 중")
        time.sleep(2)
        print(f"Thread {thread_id} 완료")

threads = []
for i in range(10):
    thread = threading.Thread(target=limited_access, args=(i,))
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()
```

### 3. Event (이벤트)
```python
event = threading.Event()

def waiter():
    """이벤트 대기"""
    print("이벤트 대기 중...")
    event.wait()  # 블로킹
    print("이벤트 발생! 작업 시작")

def setter():
    """이벤트 설정"""
    time.sleep(3)
    print("이벤트 설정")
    event.set()

thread1 = threading.Thread(target=waiter)
thread2 = threading.Thread(target=setter)

thread1.start()
thread2.start()

thread1.join()
thread2.join()
```

### 4. Queue (스레드 안전 큐)
```python
from queue import Queue

queue = Queue()

def producer():
    """데이터 생성"""
    for i in range(5):
        item = f"Item-{i}"
        print(f"생성: {item}")
        queue.put(item)
        time.sleep(1)

def consumer():
    """데이터 소비"""
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"소비: {item}")
        time.sleep(2)
        queue.task_done()

# Producer 스레드
prod = threading.Thread(target=producer)
prod.start()

# Consumer 스레드들
consumers = []
for _ in range(3):
    cons = threading.Thread(target=consumer)
    cons.start()
    consumers.append(cons)

prod.join()

# 종료 신호
for _ in range(3):
    queue.put(None)

for cons in consumers:
    cons.join()
```

## 💡 Thread Pool

```python
from concurrent.futures import ThreadPoolExecutor

def task(n):
    """작업 함수"""
    print(f"Task {n} 시작")
    time.sleep(2)
    return n * n

# 스레드 풀 생성 (최대 5개 워커)
with ThreadPoolExecutor(max_workers=5) as executor:
    # 여러 작업 제출
    futures = [executor.submit(task, i) for i in range(10)]
    
    # 결과 수집
    results = [future.result() for future in futures]
    print(f"결과: {results}")

# map 사용 (간단한 경우)
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(task, range(10)))
```

## 💡 실전 예시

### 웹 크롤러
```python
import requests
from concurrent.futures import ThreadPoolExecutor

def fetch_url(url):
    """URL 가져오기"""
    print(f"Fetching {url}")
    response = requests.get(url)
    return {
        'url': url,
        'status': response.status_code,
        'length': len(response.content)
    }

urls = [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com',
    'https://www.python.org',
    'https://www.wikipedia.org'
]

# 병렬 다운로드
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch_url, urls))

for result in results:
    print(f"{result['url']}: {result['status']} ({result['length']} bytes)")
```

### 주기적 작업
```python
def periodic_task(interval, task_func):
    """주기적으로 실행되는 스레드"""
    def wrapper():
        while not stop_event.is_set():
            task_func()
            time.sleep(interval)
    
    return wrapper

stop_event = threading.Event()

def check_status():
    """상태 체크"""
    print(f"[{time.strftime('%H:%M:%S')}] 상태 체크")

# 5초마다 실행
thread = threading.Thread(
    target=periodic_task(5, check_status)
)
thread.start()

# 20초 후 종료
time.sleep(20)
stop_event.set()
thread.join()
```

## 🎯 Thread 사용 시 주의사항

### 1. Race Condition
```python
# ❌ 문제 있는 코드
balance = 1000

def withdraw(amount):
    global balance
    if balance >= amount:
        time.sleep(0.001)  # 다른 스레드에게 기회 제공
        balance -= amount

# 두 스레드가 동시에 실행하면?
# → 잔액이 음수가 될 수 있음!

# ✅ 올바른 코드
lock = threading.Lock()

def safe_withdraw(amount):
    global balance
    with lock:
        if balance >= amount:
            time.sleep(0.001)
            balance -= amount
```

### 2. Deadlock
```python
# ❌ Deadlock 발생 가능
lock1 = threading.Lock()
lock2 = threading.Lock()

def task1():
    with lock1:
        time.sleep(0.1)
        with lock2:  # lock2 대기
            pass

def task2():
    with lock2:
        time.sleep(0.1)
        with lock1:  # lock1 대기
            pass

# 두 스레드가 서로 대기 → Deadlock!

# ✅ 해결: 항상 같은 순서로 Lock 획득
def safe_task1():
    with lock1:
        with lock2:
            pass

def safe_task2():
    with lock1:  # 같은 순서!
        with lock2:
            pass
```

### 3. GIL (Global Interpreter Lock)
```python
# Python은 GIL로 인해
# 멀티 스레드가 CPU 작업에는 효과 없음

# ❌ CPU 작업 (GIL 때문에 느림)
def cpu_bound(n):
    return sum(i*i for i in range(n))

# ✅ I/O 작업 (스레드 효과적)
def io_bound(url):
    return requests.get(url)

# CPU 작업은 multiprocessing 사용!
from multiprocessing import Pool

with Pool(4) as pool:
    results = pool.map(cpu_bound, [10000000] * 4)
```

## 🎯 Thread vs Process vs Async

| 항목 | Thread | Process | Async |
|------|--------|---------|-------|
| **메모리** | 공유 | 독립 | 공유 |
| **생성 비용** | 낮음 | 높음 | 매우 낮음 |
| **GIL** | 영향 있음 | 영향 없음 | 영향 있음 |
| **용도** | I/O 작업 | CPU 작업 | I/O 작업 |
| **복잡도** | 중간 | 높음 | 중간 |

## 🔗 관련 용어

- [[Multi-thread]]: 여러 스레드 사용
- [[Process]]: 프로그램 실행 단위
- [[Concurrency]]: 동시성

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-14*
