# Multi-thread (멀티 스레드)

## 📝 정의

Multi-thread(멀티 스레드)는 **하나의 프로세스가 여러 스레드를 동시에 실행**하여, 작업을 병렬로 처리하는 프로그래밍 기법입니다.

### 핵심 개념

- **무엇인가?**: 여러 스레드 동시 실행
- **왜 필요한가?**: 작업 속도 향상, 응답성 개선
- **어떻게 작동하나?**: CPU가 스레드 간 빠르게 전환하며 실행

### Multi-thread가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 단일 스레드 웹 서버
클라이언트 A → 요청 (5초 소요)
클라이언트 B → 대기...
클라이언트 C → 대기...
→ 순차 처리로 느림! 😱
```

**Multi-thread의 해결**:
```
✅ 병렬 처리:
클라이언트 A → 스레드 1 (처리 중)
클라이언트 B → 스레드 2 (처리 중)
클라이언트 C → 스레드 3 (처리 중)
→ 동시에 처리! ✅
```

**비유**:
- **단일 스레드** = 요리사 1명 (한 요리씩)
- **멀티 스레드** = 요리사 여러 명 (동시 조리)

## 💡 Python Multi-threading

### 기본 패턴
```python
import threading
import time

def download_file(file_id):
    """파일 다운로드 시뮬레이션"""
    print(f"File {file_id} 다운로드 시작")
    time.sleep(2)  # I/O 작업 시뮬레이션
    print(f"File {file_id} 다운로드 완료")
    return f"file_{file_id}.dat"

# 단일 스레드 (순차 실행)
start = time.time()
for i in range(5):
    download_file(i)
print(f"단일 스레드 소요 시간: {time.time() - start:.2f}초")
# → 약 10초

# 멀티 스레드 (병렬 실행)
start = time.time()
threads = []
for i in range(5):
    thread = threading.Thread(target=download_file, args=(i,))
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()

print(f"멀티 스레드 소요 시간: {time.time() - start:.2f}초")
# → 약 2초 (5배 빠름!)
```

### ThreadPoolExecutor 사용
```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_data(data_id):
    """데이터 처리"""
    print(f"Processing {data_id}")
    time.sleep(1)
    return f"Result-{data_id}"

# 스레드 풀로 병렬 처리
with ThreadPoolExecutor(max_workers=10) as executor:
    # 작업 제출
    futures = {
        executor.submit(process_data, i): i 
        for i in range(20)
    }
    
    # 완료되는 대로 결과 수집
    for future in as_completed(futures):
        data_id = futures[future]
        try:
            result = future.result()
            print(f"Task {data_id}: {result}")
        except Exception as e:
            print(f"Task {data_id} 실패: {e}")
```

## 💡 실전 예시

### 1. 웹 크롤러
```python
import requests
from concurrent.futures import ThreadPoolExecutor

def scrape_page(url):
    """페이지 크롤링"""
    try:
        response = requests.get(url, timeout=5)
        return {
            'url': url,
            'status': response.status_code,
            'size': len(response.content)
        }
    except Exception as e:
        return {'url': url, 'error': str(e)}

# 100개 URL 병렬 크롤링
urls = [f'https://example.com/page/{i}' for i in range(100)]

with ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(scrape_page, urls))

# 성공/실패 통계
success = sum(1 for r in results if 'status' in r)
failed = sum(1 for r in results if 'error' in r)
print(f"성공: {success}, 실패: {failed}")
```

### 2. 이미지 처리
```python
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import os

def process_image(filename):
    """이미지 리사이즈"""
    try:
        img = Image.open(filename)
        img.thumbnail((800, 600))
        
        output = f"resized_{os.path.basename(filename)}"
        img.save(output)
        
        return f"{filename} → {output}"
    except Exception as e:
        return f"{filename} 실패: {e}"

# 100개 이미지 병렬 처리
image_files = [f'image_{i}.jpg' for i in range(100)]

with ThreadPoolExecutor(max_workers=8) as executor:
    results = executor.map(process_image, image_files)
    
    for result in results:
        print(result)
```

### 3. API 요청 병렬 처리
```python
def fetch_user_data(user_id):
    """사용자 데이터 가져오기"""
    response = requests.get(f'https://api.example.com/users/{user_id}')
    return response.json()

def fetch_user_posts(user_id):
    """사용자 게시물 가져오기"""
    response = requests.get(f'https://api.example.com/users/{user_id}/posts')
    return response.json()

def fetch_user_comments(user_id):
    """사용자 댓글 가져오기"""
    response = requests.get(f'https://api.example.com/users/{user_id}/comments')
    return response.json()

def get_complete_user_info(user_id):
    """사용자 정보 통합 (병렬 요청)"""
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_user = executor.submit(fetch_user_data, user_id)
        future_posts = executor.submit(fetch_user_posts, user_id)
        future_comments = executor.submit(fetch_user_comments, user_id)
        
        # 모든 결과 대기
        user = future_user.result()
        posts = future_posts.result()
        comments = future_comments.result()
    
    return {
        'user': user,
        'posts': posts,
        'comments': comments
    }

# 순차: 3초 + 2초 + 2초 = 7초
# 병렬: max(3, 2, 2) = 3초
```

## 💡 생산자-소비자 패턴

```python
from queue import Queue
import threading
import time
import random

# 작업 큐
task_queue = Queue()
result_queue = Queue()

def producer(queue, num_tasks):
    """작업 생성"""
    for i in range(num_tasks):
        task = f"Task-{i}"
        queue.put(task)
        print(f"생성: {task}")
        time.sleep(random.uniform(0.1, 0.3))
    
    # 종료 신호
    for _ in range(3):  # 소비자 수만큼
        queue.put(None)

def consumer(task_queue, result_queue, worker_id):
    """작업 처리"""
    while True:
        task = task_queue.get()
        
        if task is None:
            print(f"Worker {worker_id} 종료")
            break
        
        # 작업 처리
        print(f"Worker {worker_id} 처리 중: {task}")
        time.sleep(random.uniform(0.5, 1.5))
        
        result = f"{task} → Result"
        result_queue.put(result)
        task_queue.task_done()

# Producer 스레드
producer_thread = threading.Thread(
    target=producer,
    args=(task_queue, 20)
)
producer_thread.start()

# Consumer 스레드들
consumer_threads = []
for i in range(3):
    thread = threading.Thread(
        target=consumer,
        args=(task_queue, result_queue, i)
    )
    thread.start()
    consumer_threads.append(thread)

# 완료 대기
producer_thread.join()
for thread in consumer_threads:
    thread.join()

# 결과 수집
results = []
while not result_queue.empty():
    results.append(result_queue.get())

print(f"\n총 {len(results)}개 작업 완료")
```

## 💡 Thread-safe 자료구조

```python
from queue import Queue
import threading

# ❌ 스레드 안전하지 않음
unsafe_list = []

def unsafe_append(value):
    for _ in range(10000):
        unsafe_list.append(value)

# ✅ 스레드 안전한 Queue
safe_queue = Queue()

def safe_append(value):
    for _ in range(10000):
        safe_queue.put(value)

# ✅ Lock을 사용한 안전한 리스트
safe_list = []
list_lock = threading.Lock()

def locked_append(value):
    for _ in range(10000):
        with list_lock:
            safe_list.append(value)
```

## 💡 성능 측정

```python
import time
from concurrent.futures import ThreadPoolExecutor

def benchmark(func, n_threads):
    """벤치마크"""
    start = time.time()
    
    if n_threads == 1:
        # 단일 스레드
        for i in range(100):
            func(i)
    else:
        # 멀티 스레드
        with ThreadPoolExecutor(max_workers=n_threads) as executor:
            executor.map(func, range(100))
    
    elapsed = time.time() - start
    print(f"{n_threads} 스레드: {elapsed:.2f}초")

def io_task(n):
    """I/O 작업"""
    time.sleep(0.1)

def cpu_task(n):
    """CPU 작업"""
    sum(i*i for i in range(1000000))

# I/O 작업 벤치마크
print("I/O 작업:")
benchmark(io_task, 1)   # 단일
benchmark(io_task, 10)  # 멀티
# → 멀티가 훨씬 빠름!

# CPU 작업 벤치마크 (GIL)
print("\nCPU 작업:")
benchmark(cpu_task, 1)   # 단일
benchmark(cpu_task, 10)  # 멀티
# → 멀티가 느릴 수 있음 (GIL)
```

## 🎯 Multi-threading 적합한 경우

### ✅ 적합
```
- I/O 작업 (네트워크, 파일, DB)
- 웹 크롤링
- API 요청
- 파일 다운로드/업로드
- UI 응답성 유지
```

### ❌ 부적합
```
- CPU 집약적 작업 (Python GIL)
  → multiprocessing 사용
- 복잡한 공유 상태
  → 동기화 오버헤드
```

## 💡 Best Practices

```python
# 1. ThreadPoolExecutor 사용 (권장)
with ThreadPoolExecutor(max_workers=10) as executor:
    results = executor.map(func, data)

# 2. 적절한 워커 수
# I/O: CPU 코어 수 * 2~4
# CPU: CPU 코어 수

# 3. 타임아웃 설정
future = executor.submit(long_task)
try:
    result = future.result(timeout=10)
except TimeoutError:
    print("타임아웃!")

# 4. 예외 처리
for future in as_completed(futures):
    try:
        result = future.result()
    except Exception as e:
        print(f"에러: {e}")

# 5. 리소스 정리
with ThreadPoolExecutor() as executor:
    # 자동으로 cleanup
    pass
```

## 🔗 관련 용어

- [[Thread]]: 단일 스레드
- [[Concurrency]]: 동시성 개념
- [[Parallel]]: 병렬 처리

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-14*
