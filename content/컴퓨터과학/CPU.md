# CPU (Central Processing Unit)

## 📝 정의

CPU(Central Processing Unit, 중앙처리장치)는 컴퓨터의 **두뇌**로, 모든 계산과 명령을 처리하는 핵심 하드웨어입니다.

### 핵심 개념

- **무엇인가?**: 명령어를 실행하는 프로세서
- **왜 필요한가?**: 모든 프로그램 실행의 중심
- **어떻게 작동하나?**: Fetch → Decode → Execute 사이클

### CPU가 중요한 이유

**문제 상황**:
```
😱 시나리오 1: CPU 병목
8코어 CPU인데 1코어만 사용
→ 다른 7개 코어는 놀고 있음
→ 성능의 87.5%를 낭비! 😱

😱 시나리오 2: CPU 100%
무거운 계산 작업 실행
→ CPU 사용률 100%
→ 다른 프로그램 느려짐
→ 컴퓨터 전체가 버벅! 😱

😱 시나리오 3: 클럭 속도 오해
3GHz CPU vs 2GHz CPU
"3GHz가 무조건 빠르다!"
→ 코어 수, 아키텍처도 중요! 😱
```

**올바른 이해**:
```
✅ 시나리오 1:
멀티스레드/멀티프로세스 사용
→ 8개 코어 모두 활용
→ 8배 빠른 처리! ✅

✅ 시나리오 2:
작업 분산 및 우선순위 관리
→ 중요한 작업 우선 처리
→ 백그라운드 작업은 낮은 우선순위
→ 쾌적한 사용 환경! ✅

✅ 시나리오 3:
종합적인 성능 고려
→ 코어 수 × 클럭 속도 × 효율성
→ 2GHz 8코어 > 3GHz 2코어 (병렬 작업시)
```

## 📊 CPU 구조


### CPU 구성 요소

**1. Control Unit (제어 장치)**:
```
명령어를 해석하고 제어 신호 생성
→ "이 명령어는 덧셈이구나"
→ ALU에 덧셈 신호 전달
```

**2. ALU (Arithmetic Logic Unit)**:
```
실제 계산을 수행
→ 산술 연산: +, -, ×, ÷
→ 논리 연산: AND, OR, NOT
```

**3. Registers (레지스터)**:
```
CPU 내부의 초고속 메모리
→ 현재 처리 중인 데이터 저장
→ 가장 빠른 메모리
```

**4. Cache (캐시)**:
```
RAM과 CPU 사이의 버퍼
→ 자주 사용하는 데이터 저장
→ RAM보다 훨씬 빠름
```

## 💡 CPU 작동 원리

### Fetch-Decode-Execute 사이클

```python
# CPU가 프로그램을 실행하는 과정

while True:  # CPU는 계속 반복
    # 1. Fetch (가져오기)
    instruction = fetch_instruction_from_memory()

    # 2. Decode (해석)
    operation, operands = decode(instruction)

    # 3. Execute (실행)
    result = execute(operation, operands)

    # 4. Store (저장)
    store_result(result)
```

**예시**:
```
프로그램: a = 5 + 3

1. Fetch: 메모리에서 "5 + 3" 명령어 가져오기
2. Decode: "덧셈 연산" 해석
3. Execute: ALU가 5 + 3 = 8 계산
4. Store: 결과 8을 레지스터에 저장
```

## 🎯 CPU 성능 지표

### 1. 클럭 속도 (Clock Speed)

```
단위: GHz (기가헤르츠)
의미: 초당 사이클 수

3.5GHz = 초당 35억 번 명령 실행 가능

⚠️ 하지만 클럭만으로 성능 판단 불가!
→ 코어 수, 아키텍처도 중요
```

### 2. 코어 수 (Core Count)

```
단일 코어: 1개의 처리 장치
듀얼 코어: 2개의 처리 장치
쿼드 코어: 4개의 처리 장치
옥타 코어: 8개의 처리 장치

멀티코어 = 병렬 처리 가능
→ 여러 작업 동시 실행
```

### 3. 스레드 (Thread)

```
물리적 코어: 실제 하드웨어
논리적 코어: 하이퍼스레딩으로 생성

4코어 8스레드:
→ 물리 코어 4개
→ 각 코어가 2개 작업 동시 처리
→ OS에는 8코어처럼 보임
```

## 💻 Python에서 CPU 정보 확인

```python
import psutil
import multiprocessing

# CPU 정보 확인
print(f"물리적 코어: {psutil.cpu_count(logical=False)}")
print(f"논리적 코어: {psutil.cpu_count(logical=True)}")
print(f"CPU 사용률: {psutil.cpu_percent(interval=1)}%")

# 코어별 사용률
for i, percent in enumerate(psutil.cpu_percent(interval=1, percpu=True)):
    print(f"코어 {i}: {percent}%")

# CPU 주파수
freq = psutil.cpu_freq()
print(f"현재 속도: {freq.current:.0f}MHz")
print(f"최대 속도: {freq.max:.0f}MHz")
```

**실행 결과**:
```
물리적 코어: 4
논리적 코어: 8
CPU 사용률: 23.5%
코어 0: 15.2%
코어 1: 32.8%
코어 2: 18.4%
코어 3: 27.6%
...
현재 속도: 2800MHz
최대 속도: 3500MHz
```

### CPU 집약적 작업 시뮬레이션

```python
import time
import psutil

def cpu_intensive_task():
    """CPU를 많이 사용하는 작업"""
    result = 0
    for i in range(50_000_000):
        result += i ** 2
    return result

# CPU 사용률 모니터링하면서 실행
print("작업 시작 전:", psutil.cpu_percent())

start = time.time()
result = cpu_intensive_task()
elapsed = time.time() - start

print(f"작업 완료: {elapsed:.2f}초")
print("작업 중 CPU 사용률:", psutil.cpu_percent())
```

## 🔍 멀티코어 활용

### 단일 코어 vs 멀티 코어

```python
from multiprocessing import Pool
import time

def heavy_calculation(n):
    """무거운 계산"""
    result = sum(i**2 for i in range(n))
    return result

# 순차 처리 (1코어)
start = time.time()
results = [heavy_calculation(10_000_000) for _ in range(8)]
print(f"1코어: {time.time() - start:.2f}초")

# 병렬 처리 (멀티코어)
start = time.time()
with Pool(processes=8) as pool:
    results = pool.map(heavy_calculation, [10_000_000] * 8)
print(f"8코어: {time.time() - start:.2f}초")
```

**실행 결과**:
```
1코어: 32.45초
8코어: 4.18초  # ~8배 빠름!
```

## 🚨 CPU 사용 최적화

### 1. CPU Bound vs I/O Bound

```python
# CPU Bound - CPU가 병목
def cpu_bound():
    """계산만 함 → CPU 100%"""
    return sum(i**2 for i in range(10_000_000))

# I/O Bound - 대기가 병목
import time
def io_bound():
    """대기만 함 → CPU 거의 안 씀"""
    time.sleep(5)
    return "done"

# CPU Bound → multiprocessing 사용
# I/O Bound → asyncio 사용
```

### 2. CPU 친화성 설정

```python
import os
import psutil

# 현재 프로세스를 특정 코어에만 할당
process = psutil.Process(os.getpid())

# 코어 0, 1번만 사용
process.cpu_affinity([0, 1])

print(f"사용 가능한 코어: {process.cpu_affinity()}")
```

### 3. 우선순위 조정

```python
import psutil
import os

process = psutil.Process(os.getpid())

# 우선순위 낮추기 (백그라운드 작업)
try:
    if os.name == 'nt':  # Windows
        process.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
    else:  # Linux/Mac
        process.nice(10)  # 높을수록 낮은 우선순위
    print("우선순위 낮춤")
except:
    print("권한 필요")
```

## 📊 CPU 모니터링

```python
import psutil
import time

def monitor_cpu(duration=10):
    """CPU 사용률 실시간 모니터링"""
    print("CPU 모니터링 시작...\n")

    for i in range(duration):
        # 전체 CPU 사용률
        cpu_percent = psutil.cpu_percent(interval=1)

        # 메모리 정보
        memory = psutil.virtual_memory()

        print(f"[{i+1:2d}초] "
              f"CPU: {cpu_percent:5.1f}% | "
              f"메모리: {memory.percent:5.1f}%")

        time.sleep(1)

# 실행
monitor_cpu(5)
```

**실행 결과**:
```
CPU 모니터링 시작...

[ 1초] CPU:  23.5% | 메모리:  67.2%
[ 2초] CPU:  18.3% | 메모리:  67.3%
[ 3초] CPU:  25.7% | 메모리:  67.2%
[ 4초] CPU:  21.4% | 메모리:  67.4%
[ 5초] CPU:  19.8% | 메모리:  67.3%
```

## 🔗 관련 용어

- [[RAM]]: CPU가 사용하는 주 메모리
- [[Cache]]: CPU와 RAM 사이의 고속 메모리
- [[Process]]: CPU가 실행하는 프로그램
- [[Thread]]: CPU가 실행하는 실행 흐름
- [[Parallelism]]: 여러 CPU 코어로 동시 실행

## 📝 정리

**CPU의 핵심**:
```
CPU = 컴퓨터의 두뇌
→ 모든 계산과 명령 처리
→ 코어 수 ↑ = 병렬 처리 능력 ↑
→ 클럭 속도 ↑ = 처리 속도 ↑
```

**성능 공식**:
```
CPU 성능 = 코어 수 × 클럭 속도 × IPC(명령어당 사이클)
```

**비유로 기억하기**:
```
CPU = 요리사
코어 수 = 요리사 수
클럭 속도 = 요리 속도
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
