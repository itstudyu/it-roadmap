# Process (프로세스)

## 📝 정의

Process(프로세스)는 **실행 중인 프로그램**을 의미합니다. 디스크에 저장된 프로그램 파일을 메모리에 올려서 실행하면 프로세스가 됩니다.

### 핵심 개념

- **무엇인가?**: 실행 중인 프로그램 인스턴스
- **왜 필요한가?**: 여러 프로그램을 동시에 실행하기 위해
- **어떻게 작동하나?**: OS가 메모리와 CPU를 할당하여 독립적으로 실행

### Process가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 프로그램 구분 없음
컴퓨터에 프로세스 개념이 없다면?
→ 브라우저 실행 중 → 음악 플레이어 시작 불가
→ 한 번에 하나의 프로그램만! 😱

😱 시나리오 2: 메모리 충돌
Process A: 메모리 주소 0x1000에 데이터 저장
Process B: 메모리 주소 0x1000에 데이터 저장
→ 데이터 덮어쓰기! 크래시! 😱

😱 시나리오 3: 무한 루프
프로그램이 무한루프에 빠짐
→ 컴퓨터 전체가 먹통
→ 재부팅밖에 답이 없음! 😱
```

**Process의 해결**:
```
✅ 시나리오 1:
여러 프로세스 동시 실행
→ 브라우저 (PID 1234)
→ 음악 플레이어 (PID 5678)
→ 멀티태스킹 가능! ✅

✅ 시나리오 2:
각 프로세스는 독립된 메모리 공간
→ Process A: 0x1000 (가상 주소)
→ Process B: 0x1000 (가상 주소)
→ 실제로는 다른 물리 메모리
→ 충돌 없음! ✅

✅ 시나리오 3:
프로세스별 독립 실행
→ 프로그램 A가 멈춤
→ 다른 프로세스는 정상 작동
→ 작업 관리자에서 종료 가능! ✅
```

## 📊 프로세스 구조


### 프로세스 구성 요소

**1. Code (코드 영역)**:
```
실행할 프로그램 코드가 저장됨
→ 읽기 전용 (수정 불가)
→ 여러 프로세스가 공유 가능
```

**2. Data (데이터 영역)**:
```
전역 변수, 정적 변수 저장
→ 프로그램 시작 시 할당
→ 프로그램 종료 시 해제
```

**3. Heap (힙 영역)**:
```
동적으로 할당되는 메모리
→ malloc(), new 등으로 할당
→ 프로그래머가 직접 관리
```

**4. Stack (스택 영역)**:
```
함수 호출과 지역 변수 저장
→ 함수 호출 시 자동 할당
→ 함수 종료 시 자동 해제
```

## 💡 프로세스 상태


### 상태 전이

**1. New → Ready**:
```
프로세스 생성됨 → 실행 대기 중
예: 프로그램 더블클릭 → 메모리 로딩 완료
```

**2. Ready → Running**:
```
CPU 스케줄러가 선택 → CPU 할당받음
예: CPU가 비었을 때 내 차례
```

**3. Running → Waiting**:
```
I/O 작업 대기 → CPU 반납
예: 파일 읽기, 네트워크 응답 대기
```

**4. Waiting → Ready**:
```
I/O 작업 완료 → 다시 실행 대기
예: 파일 읽기 완료 → 다시 CPU 받을 준비
```

**5. Running → Terminated**:
```
프로세스 종료 → 자원 반납
예: 프로그램 종료, exit() 호출
```

## 🔍 실제 예시

### Python에서 프로세스 생성

```python
import multiprocessing
import os
import time

def worker_process(name):
    """작업을 수행하는 프로세스"""
    print(f"[{name}] 시작 (PID: {os.getpid()})")
    time.sleep(2)
    print(f"[{name}] 완료")

if __name__ == '__main__':
    print(f"메인 프로세스 (PID: {os.getpid()})")

    # 자식 프로세스 3개 생성
    processes = []
    for i in range(3):
        p = multiprocessing.Process(
            target=worker_process,
            args=(f"Worker-{i}",)
        )
        processes.append(p)
        p.start()  # 프로세스 시작

    # 모든 프로세스가 끝날 때까지 대기
    for p in processes:
        p.join()

    print("모든 작업 완료!")
```

**실행 결과**:
```
메인 프로세스 (PID: 12345)
[Worker-0] 시작 (PID: 12346)
[Worker-1] 시작 (PID: 12347)
[Worker-2] 시작 (PID: 12348)
[Worker-0] 완료
[Worker-1] 완료
[Worker-2] 완료
모든 작업 완료!
```

### 프로세스 간 통신 (IPC)

프로세스는 독립된 메모리를 사용하므로, 데이터를 공유하려면 **IPC(Inter-Process Communication)**가 필요합니다.

**Queue 사용**:
```python
from multiprocessing import Process, Queue

def producer(queue):
    """데이터를 생산하는 프로세스"""
    for i in range(5):
        data = f"Item-{i}"
        queue.put(data)
        print(f"[생산자] {data} 생산")

def consumer(queue):
    """데이터를 소비하는 프로세스"""
    while True:
        data = queue.get()
        if data is None:  # 종료 신호
            break
        print(f"[소비자] {data} 소비")

if __name__ == '__main__':
    # 프로세스 간 공유 Queue 생성
    q = Queue()

    # 생산자, 소비자 프로세스 생성
    p1 = Process(target=producer, args=(q,))
    p2 = Process(target=consumer, args=(q,))

    p1.start()
    p2.start()

    p1.join()
    q.put(None)  # 소비자에게 종료 신호
    p2.join()
```

**실행 결과**:
```
[생산자] Item-0 생산
[소비자] Item-0 소비
[생산자] Item-1 생산
[소비자] Item-1 소비
[생산자] Item-2 생산
[소비자] Item-2 소비
...
```

## 🎯 Process vs Thread

| 특성 | Process | Thread |
|------|---------|--------|
| **메모리** | 독립적 | 공유 |
| **생성 비용** | 높음 | 낮음 |
| **통신** | IPC 필요 | 직접 가능 |
| **안정성** | 높음 (격리) | 낮음 (영향) |
| **컨텍스트 스위칭** | 느림 | 빠름 |

**비유**:
```
Process = 독립된 집
→ 각자 부엌, 화장실 있음
→ 이웃집에 가려면 문 나가야 함
→ 한 집이 무너져도 다른 집은 안전

Thread = 같은 집의 방
→ 부엌, 화장실 공유
→ 방 사이 이동 쉬움
→ 불이 나면 전체가 위험
```

### 언제 Process를 사용할까?

```python
# ✅ CPU 집약적 작업 → Process 사용
from multiprocessing import Pool

def calculate_heavy(n):
    """무거운 계산 작업"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

if __name__ == '__main__':
    # CPU 코어 수만큼 프로세스 생성
    with Pool(processes=4) as pool:
        results = pool.map(calculate_heavy, [1000000, 2000000, 3000000, 4000000])

    print(f"결과: {sum(results)}")

# Python의 GIL(Global Interpreter Lock) 회피!
# Process는 각자 독립된 Python 인터프리터 → GIL 영향 없음
```

## 🔧 프로세스 관리 명령어

### Linux/Mac

```bash
# 실행 중인 프로세스 보기
ps aux

# 프로세스 상세 정보
ps -ef

# 실시간 프로세스 모니터링
top
htop  # 더 보기 좋은 버전

# 특정 프로세스 찾기
ps aux | grep python

# 프로세스 종료
kill <PID>       # 정상 종료 요청
kill -9 <PID>    # 강제 종료

# 프로세스 트리 보기
pstree
```

### Windows

```powershell
# 실행 중인 프로세스 보기
Get-Process

# 프로세스 상세 정보
tasklist

# 프로세스 종료
Stop-Process -Id <PID>
Stop-Process -Name "chrome"

# 작업 관리자 (GUI)
Ctrl + Shift + Esc
```

## 💻 실전 활용

### 웹 크롤러 (멀티프로세스)

```python
from multiprocessing import Pool
import requests

def crawl_url(url):
    """URL을 크롤링하는 함수"""
    try:
        response = requests.get(url, timeout=5)
        return f"{url}: {len(response.content)} bytes"
    except Exception as e:
        return f"{url}: Error - {e}"

if __name__ == '__main__':
    urls = [
        'https://example.com',
        'https://python.org',
        'https://github.com',
        'https://stackoverflow.com'
    ] * 5  # 20개 URL

    # 4개의 프로세스로 병렬 크롤링
    with Pool(processes=4) as pool:
        results = pool.map(crawl_url, urls)

    for result in results:
        print(result)
```

### 프로세스 풀 패턴

```python
from multiprocessing import Pool
import time

def process_data(item):
    """데이터 처리 (시간이 오래 걸리는 작업)"""
    time.sleep(1)  # 무거운 작업 시뮬레이션
    return item * 2

if __name__ == '__main__':
    data = list(range(20))

    # 단일 프로세스 (순차 처리)
    start = time.time()
    results = [process_data(x) for x in data]
    print(f"단일 프로세스: {time.time() - start:.2f}초")  # ~20초

    # 멀티프로세스 (병렬 처리)
    start = time.time()
    with Pool(processes=4) as pool:
        results = pool.map(process_data, data)
    print(f"멀티프로세스: {time.time() - start:.2f}초")  # ~5초
```

## 🔗 관련 용어

- [[Thread]]: 프로세스 내의 실행 흐름
- [[Multi-thread]]: 여러 스레드를 사용한 병렬 처리
- [[Concurrency]]: 동시성 - 여러 작업을 번갈아 수행
- [[Parallelism]]: 병렬성 - 여러 작업을 동시에 수행
- [[CPU]]: 프로세스를 실행하는 하드웨어
- [[RAM]]: 프로세스가 사용하는 메모리
- [[Stack]]: 프로세스 메모리의 스택 영역
- [[Heap]]: 프로세스 메모리의 힙 영역

## 📝 정리

**프로세스의 핵심**:
```
프로세스 = 실행 중인 프로그램
→ 독립된 메모리 공간
→ OS가 관리하는 실행 단위
→ 안정적이지만 무거움
```

**비유로 기억하기**:
```
프로그램 = 요리 레시피 (파일)
프로세스 = 실제 요리 중 (실행 중)
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
