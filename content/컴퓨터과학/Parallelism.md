# Parallelism (병렬성)

## 📝 정의

Parallelism(병렬성)은 **여러 작업을 실제로 동시에 실행**하는 것입니다. 여러 개의 CPU 코어를 사용하여 진짜로 동시에 처리합니다.

### 핵심 개념

- **무엇인가?**: 여러 CPU 코어로 동시 실행
- **왜 필요한가?**: CPU 집약적 작업의 성능 향상
- **어떻게 작동하나?**: 작업을 여러 코어에 분산

### Parallelism이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 무거운 계산
이미지 1000장 처리 프로그램
→ 1장당 1초 소요
→ 1개 CPU 코어로 순차 처리
→ 총 1000초 (16분 40초)! 😱

4개 코어가 있는데 1개만 사용 중!

😱 시나리오 2: 비디오 인코딩
4K 비디오 인코딩 (1시간 분량)
→ 1개 코어로 인코딩: 5시간 소요
→ 다른 코어 3개는 놀고 있음
→ CPU 사용률 25%! 😱

😱 시나리오 3: 과학 계산
복잡한 시뮬레이션 실행
→ 순차 처리: 24시간 소요
→ 8코어 CPU인데 1개만 사용
→ 하루 종일 기다려야 함! 😱
```

**Parallelism의 해결**:
```
✅ 시나리오 1:
4개 코어로 병렬 처리
→ 코어 1: 이미지 1-250
→ 코어 2: 이미지 251-500
→ 코어 3: 이미지 501-750
→ 코어 4: 이미지 751-1000
→ 총 250초 (4분 10초)! ✅
→ 4배 빠름!

✅ 시나리오 2:
4개 코어로 병렬 인코딩
→ 각 코어가 영상의 다른 부분 처리
→ 5시간 → 1.5시간으로 단축
→ CPU 사용률 100%! ✅

✅ 시나리오 3:
8개 코어로 병렬 계산
→ 계산을 8개로 분할
→ 24시간 → 3시간으로 단축
→ 8배 빠름! ✅
```

## 📊 작동 원리


### Parallelism 과정

**1. 작업 분할 (Divide)**:
```
큰 작업을 여러 개의 작은 작업으로 나누기
예: 1000장 이미지 → 250장씩 4개 그룹
```

**2. 병렬 실행 (Execute)**:
```
각 CPU 코어에 작업 할당
→ 실제로 동시에 실행됨
```

**3. 결과 합치기 (Combine)**:
```
각 코어의 결과를 모아서 최종 결과 생성
```

## 💡 실제 구현

### Python: multiprocessing

```python
from multiprocessing import Pool
import time

def process_image(image_id):
    """이미지 처리 (CPU 집약적)"""
    # 무거운 계산 시뮬레이션
    result = 0
    for i in range(10_000_000):
        result += i ** 2
    return f"Image {image_id} processed"

if __name__ == '__main__':
    images = list(range(8))  # 8개 이미지

    # 순차 처리
    start = time.time()
    results = [process_image(i) for i in images]
    print(f"순차 처리: {time.time() - start:.2f}초")

    # 병렬 처리 (4개 코어)
    start = time.time()
    with Pool(processes=4) as pool:
        results = pool.map(process_image, images)
    print(f"병렬 처리: {time.time() - start:.2f}초")
```

**실행 결과** (4코어 CPU):
```
순차 처리: 8.45초
병렬 처리: 2.31초  # ~4배 빠름!
```

### 실전 예시: 이미지 처리

```python
from multiprocessing import Pool
from PIL import Image
import os

def resize_image(args):
    """이미지 리사이즈 (CPU 집약적)"""
    input_path, output_path, size = args

    # 이미지 로드
    img = Image.open(input_path)

    # 리사이즈 (CPU 집약적 작업)
    resized = img.resize(size, Image.LANCZOS)

    # 저장
    resized.save(output_path)
    return f"Processed: {input_path}"

def process_images_parallel(input_dir, output_dir, size=(800, 600)):
    """여러 이미지를 병렬로 처리"""
    # 작업 리스트 생성
    tasks = []
    for filename in os.listdir(input_dir):
        if filename.endswith(('.jpg', '.png')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            tasks.append((input_path, output_path, size))

    # 병렬 처리 (CPU 코어 수만큼)
    with Pool() as pool:
        results = pool.map(resize_image, tasks)

    return results

# 사용
if __name__ == '__main__':
    results = process_images_parallel('./input', './output')
    print(f"처리 완료: {len(results)}개 이미지")
```

## 🎯 Parallelism vs Concurrency

| 특성 | Parallelism | Concurrency |
|------|-------------|-------------|
| **실행 방식** | 실제로 동시 | 번갈아가며 |
| **CPU 요구** | 멀티코어 필수 | 싱글코어 가능 |
| **용도** | CPU 집약 작업 | I/O 대기 작업 |
| **예시** | 이미지 처리 | 웹 스크래핑 |
| **Python** | multiprocessing | asyncio |

**비유**:
```
Parallelism (병렬성):
4명의 요리사가 동시에 작업
→ 1번: 전채 요리
→ 2번: 메인 요리
→ 3번: 반찬 요리
→ 4번: 디저트 요리
→ 실제로 동시에 진행

Concurrency (동시성):
1명의 요리사가 번갈아가며
→ 국 끓이다가
→ 볶음 보다가
→ 다시 국 보기
→ 동시처럼 보일 뿐
```

## 🔍 언제 사용할까?

### ✅ Parallelism이 적합한 경우

```python
# CPU 집약적 작업

# 1. 복잡한 계산
def calculate_primes(n):
    """소수 찾기"""
    primes = []
    for i in range(2, n):
        is_prime = all(i % j != 0 for j in range(2, int(i**0.5) + 1))
        if is_prime:
            primes.append(i)
    return primes

# 2. 이미지/비디오 처리
def process_video_frame(frame):
    """프레임 처리 (필터, 인코딩 등)"""
    # CPU 집약적 작업
    pass

# 3. 데이터 분석
def analyze_large_dataset(data):
    """통계 계산, 머신러닝 등"""
    # CPU 집약적 작업
    pass

# 4. 암호화
def encrypt_data(data):
    """암호화 연산"""
    # CPU 집약적 작업
    pass
```

### ❌ Parallelism이 효과 없는 경우

```python
# I/O 대기 작업 - Concurrency 사용해야 함

# 1. 네트워크 요청
def fetch_url(url):
    """웹 페이지 다운로드"""
    response = requests.get(url)  # 네트워크 대기
    return response.text

# 2. 파일 I/O
def read_files(filenames):
    """파일 읽기"""
    for filename in filenames:
        with open(filename) as f:  # 디스크 대기
            data = f.read()

# 3. 데이터베이스 쿼리
def query_database(query):
    """DB 조회"""
    cursor.execute(query)  # DB 응답 대기
    return cursor.fetchall()
```

## 💻 고급 패턴

### Map-Reduce 패턴

```python
from multiprocessing import Pool
from functools import reduce

def square(x):
    """제곱 계산"""
    return x ** 2

def add(x, y):
    """합 계산"""
    return x + y

if __name__ == '__main__':
    numbers = list(range(1, 1001))  # 1~1000

    with Pool(processes=4) as pool:
        # Map: 각 숫자를 제곱 (병렬)
        squared = pool.map(square, numbers)

        # Reduce: 모든 제곱값을 합침
        total = reduce(add, squared)

    print(f"1²+2²+...+1000² = {total}")
```

### Chunk 처리

```python
from multiprocessing import Pool
import numpy as np

def process_chunk(chunk):
    """데이터 청크 처리"""
    # 복잡한 계산
    return np.mean(chunk) * 2

def process_large_array(data, num_workers=4):
    """큰 배열을 청크로 나눠 병렬 처리"""
    # 데이터를 청크로 분할
    chunk_size = len(data) // num_workers
    chunks = [
        data[i:i+chunk_size]
        for i in range(0, len(data), chunk_size)
    ]

    # 병렬 처리
    with Pool(processes=num_workers) as pool:
        results = pool.map(process_chunk, chunks)

    return results

if __name__ == '__main__':
    # 큰 데이터
    large_data = np.random.rand(10_000_000)

    # 병렬 처리
    results = process_large_array(large_data, num_workers=4)
    print(f"결과: {results}")
```

## 🔧 성능 측정

### Speedup 계산

```python
import time
from multiprocessing import Pool, cpu_count

def heavy_task(n):
    """무거운 작업"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

def measure_speedup():
    """속도 향상 측정"""
    tasks = [10_000_000] * 8  # 8개 작업

    # 순차 처리
    start = time.time()
    results = [heavy_task(n) for n in tasks]
    sequential_time = time.time() - start

    # 병렬 처리
    for num_workers in [2, 4, 8]:
        start = time.time()
        with Pool(processes=num_workers) as pool:
            results = pool.map(heavy_task, tasks)
        parallel_time = time.time() - start

        speedup = sequential_time / parallel_time
        efficiency = speedup / num_workers * 100

        print(f"{num_workers} 코어:")
        print(f"  시간: {parallel_time:.2f}초")
        print(f"  Speedup: {speedup:.2f}x")
        print(f"  효율: {efficiency:.1f}%\n")

if __name__ == '__main__':
    print(f"CPU 코어 수: {cpu_count()}")
    measure_speedup()
```

**실행 결과**:
```
CPU 코어 수: 8
2 코어:
  시간: 17.23초
  Speedup: 1.89x
  효율: 94.5%

4 코어:
  시간: 8.91초
  Speedup: 3.65x
  효율: 91.3%

8 코어:
  시간: 4.78초
  Speedup: 6.81x
  효율: 85.1%
```

## 🚨 주의사항

### 1. Overhead

```
병렬 처리에는 비용이 있음:
→ 프로세스 생성 비용
→ 데이터 전달 비용
→ 결과 수집 비용

작은 작업은 순차가 더 빠를 수 있음!
```

**예시**:
```python
# ❌ 작은 작업 - 병렬 처리 비효율
def small_task(x):
    return x * 2

# Overhead가 실제 작업보다 큼!
with Pool() as pool:
    results = pool.map(small_task, range(10))

# ✅ 작은 작업 - 순차 처리가 더 빠름
results = [small_task(x) for x in range(10)]
```

### 2. 공유 데이터

```
프로세스는 메모리를 공유하지 않음:
→ 데이터를 복사해서 전달
→ 큰 데이터는 비효율적

해결: 공유 메모리 사용
```

### 3. Python GIL

```
Python의 멀티스레드는 진짜 병렬이 아님!
→ GIL(Global Interpreter Lock) 때문
→ CPU 작업은 multiprocessing 필수
```

## 🔗 관련 용어

- [[Concurrency]]: 동시성 - 번갈아가며 실행
- [[Process]]: 독립적인 실행 단위
- [[Multi-thread]]: 여러 스레드 사용
- [[CPU]]: 병렬 처리를 수행하는 하드웨어
- [[Async-Await]]: 비동기 프로그래밍

## 📝 정리

**Parallelism의 핵심**:
```
병렬성 = 여러 CPU 코어로 실제 동시 실행
→ CPU 집약적 작업에 효과적
→ 멀티코어 CPU 필요
→ Python은 multiprocessing 사용
```

**선택 기준**:
```
CPU 집약적 (계산, 이미지 처리) → Parallelism
I/O 대기 (네트워크, 파일) → Concurrency
```

**비유로 기억하기**:
```
Parallelism = 여러 명이 동시에 일함
Concurrency = 1명이 빠르게 전환하며 일함
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
