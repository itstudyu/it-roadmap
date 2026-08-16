# RAM (Random Access Memory)

## 📝 정의

RAM(Random Access Memory, 램)은 컴퓨터의 **임시 작업 공간**으로, 실행 중인 프로그램과 데이터를 저장하는 주 메모리입니다. 전원이 꺼지면 데이터가 사라지는 휘발성 메모리입니다.

### 핵심 개념

- **무엇인가?**: 임시 데이터 저장 공간
- **왜 필요한가?**: CPU가 빠르게 데이터에 접근
- **어떻게 작동하나?**: 전기적 신호로 데이터 읽기/쓰기

### RAM이 중요한 이유

**문제 상황**:
```
😱 시나리오 1: RAM 부족
8GB RAM에 20개 크롬 탭 + 포토샵
→ RAM 100% 사용
→ 디스크 스왑 발생 (느림)
→ 컴퓨터 엄청 느려짐! 😱

😱 시나리오 2: 메모리 누수
프로그램이 메모리를 계속 할당만 함
→ RAM이 점점 차오름
→ 시스템이 점점 느려짐
→ 결국 프로그램 크래시! 😱

😱 시나리오 3: RAM vs 디스크 오해
"64GB SSD면 충분하지 않나?"
→ SSD는 저장 공간
→ RAM은 작업 공간
→ RAM 부족하면 여전히 느림! 😱
```

**올바른 이해**:
```
✅ 시나리오 1:
16GB 이상 RAM으로 업그레이드
→ 모든 프로그램이 RAM에서 실행
→ 디스크 스왑 없음
→ 쾌적한 멀티태스킹! ✅

✅ 시나리오 2:
적절한 메모리 관리
→ 사용 후 메모리 해제
→ Python: del, JavaScript: null
→ 안정적인 프로그램! ✅

✅ 시나리오 3:
RAM과 저장 공간 구분
→ RAM: 작업 공간 (빠르고 임시)
→ SSD/HDD: 저장 공간 (느리고 영구)
→ 둘 다 충분해야 함! ✅
```

## 📊 메모리 계층 구조


### 속도 비교

| 메모리 타입 | 접근 시간 | 크기 | 휘발성 |
|------------|-----------|------|--------|
| CPU Register | ~1ns | KB | ✅ |
| L1 Cache | ~2ns | 수십 KB | ✅ |
| L2 Cache | ~10ns | 수백 KB | ✅ |
| L3 Cache | ~50ns | 수 MB | ✅ |
| **RAM** | **~100ns** | **GB** | **✅** |
| SSD | ~100μs | TB | ❌ |
| HDD | ~10ms | TB | ❌ |

```
1ms(밀리초) = 1,000μs(마이크로초)
1μs = 1,000ns(나노초)

RAM은 SSD보다 1000배 빠름!
```

## 💡 Python에서 RAM 사용

### 메모리 확인

```python
import psutil

# 시스템 RAM 정보
memory = psutil.virtual_memory()

print(f"전체 RAM: {memory.total / (1024**3):.1f}GB")
print(f"사용 중: {memory.used / (1024**3):.1f}GB")
print(f"사용 가능: {memory.available / (1024**3):.1f}GB")
print(f"사용률: {memory.percent}%")
```

**실행 결과**:
```
전체 RAM: 16.0GB
사용 중: 10.8GB
사용 가능: 5.2GB
사용률: 67.5%
```

### 프로세스 메모리 사용량

```python
import os
import psutil

# 현재 프로세스의 메모리 사용량
process = psutil.Process(os.getpid())
memory_info = process.memory_info()

print(f"RSS: {memory_info.rss / (1024**2):.1f}MB")  # 실제 사용
print(f"VMS: {memory_info.vms / (1024**2):.1f}MB")  # 가상 메모리

# 객체별 메모리 사용
import sys

data = [1, 2, 3, 4, 5]
print(f"리스트 크기: {sys.getsizeof(data)} bytes")

big_data = list(range(1_000_000))
print(f"큰 리스트 크기: {sys.getsizeof(big_data) / (1024**2):.2f}MB")
```

### 메모리 누수 예방

```python
import gc

# 나쁜 예 - 메모리 누수
class BadExample:
    def __init__(self):
        self.huge_data = [0] * 10_000_000  # 큰 데이터
        self._instances = []

    def create_objects(self):
        for _ in range(1000):
            obj = [0] * 1000
            self._instances.append(obj)  # 계속 쌓임!

# 좋은 예 - 적절한 메모리 관리
class GoodExample:
    def __init__(self):
        self.data = []

    def process_data(self):
        # 임시 데이터 사용
        temp_data = [0] * 10_000_000

        # 작업 수행
        result = sum(temp_data)

        # 명시적으로 삭제 (선택적)
        del temp_data
        gc.collect()  # 가비지 컬렉션 실행

        return result

# 메모리 모니터링하면서 실행
good = GoodExample()
print(f"Before: {psutil.Process().memory_info().rss / (1024**2):.1f}MB")
result = good.process_data()
print(f"After: {psutil.Process().memory_info().rss / (1024**2):.1f}MB")
```

## 🎯 RAM 사용 최적화

### 1. 대용량 파일 처리

```python
# ❌ 나쁜 방법 - 전체를 RAM에 로드
def bad_read_file(filename):
    with open(filename) as f:
        data = f.read()  # 파일 전체를 메모리에!
    return data

# ✅ 좋은 방법 - 청크로 읽기
def good_read_file(filename, chunk_size=1024*1024):
    """1MB씩 읽기"""
    with open(filename) as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            yield chunk  # 한 번에 하나씩 처리

# 사용
for chunk in good_read_file('large_file.txt'):
    process(chunk)  # 청크 단위로 처리
```

### 2. 리스트 대신 제너레이터

```python
import sys

# ❌ 리스트 - 모든 데이터를 메모리에
def get_numbers_list(n):
    return [i**2 for i in range(n)]

numbers_list = get_numbers_list(1_000_000)
print(f"리스트: {sys.getsizeof(numbers_list) / (1024**2):.2f}MB")

# ✅ 제너레이터 - 필요할 때만 생성
def get_numbers_generator(n):
    for i in range(n):
        yield i**2

numbers_gen = get_numbers_generator(1_000_000)
print(f"제너레이터: {sys.getsizeof(numbers_gen)} bytes")

# 제너레이터는 거의 메모리를 안 씀!
```

**실행 결과**:
```
리스트: 8.39MB
제너레이터: 112 bytes
```

### 3. 데이터 압축

```python
import gzip
import pickle

# 대용량 데이터
large_data = list(range(10_000_000))

# 일반 저장
with open('data.pkl', 'wb') as f:
    pickle.dump(large_data, f)

# 압축 저장
with gzip.open('data.pkl.gz', 'wb') as f:
    pickle.dump(large_data, f)

import os
print(f"일반: {os.path.getsize('data.pkl') / (1024**2):.2f}MB")
print(f"압축: {os.path.getsize('data.pkl.gz') / (1024**2):.2f}MB")
```

## 💻 실전 RAM 관리

### 메모리 프로파일링

```python
from memory_profiler import profile

@profile
def memory_heavy_function():
    """메모리를 많이 사용하는 함수"""
    # 큰 리스트 생성
    a = [1] * 1_000_000

    # 또 다른 큰 리스트
    b = [2] * 2_000_000

    # 합치기
    c = a + b

    return len(c)

# 실행하면 줄별로 메모리 사용량 표시
memory_heavy_function()
```

### 메모리 제한 설정

```python
import resource

def limit_memory(maxsize):
    """메모리 사용 제한 (Linux/Mac)"""
    soft, hard = resource.getrlimit(resource.RLIMIT_AS)
    resource.setrlimit(resource.RLIMIT_AS, (maxsize, hard))

# 1GB로 제한
try:
    limit_memory(1 * 1024 * 1024 * 1024)
    print("메모리 제한 설정됨")
except:
    print("Windows에서는 지원 안 됨")
```

### 메모리 캐싱

```python
from functools import lru_cache

# 메모리에 결과 캐싱
@lru_cache(maxsize=128)
def expensive_function(n):
    """무거운 계산"""
    print(f"계산: {n}")
    return sum(i**2 for i in range(n))

# 첫 호출 - 계산 수행
result1 = expensive_function(1000)  # "계산: 1000" 출력

# 두 번째 호출 - 캐시에서 가져옴
result2 = expensive_function(1000)  # 출력 없음 (캐시 사용)

print(expensive_function.cache_info())
```

**실행 결과**:
```
계산: 1000
CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)
```

## 🔍 RAM vs 가상 메모리

### 가상 메모리 (Swap)

```
RAM이 부족하면?
→ OS가 디스크를 RAM처럼 사용
→ Swap 파일/파티션 사용
→ 매우 느림 (1000배 차이!)

예시:
RAM: 8GB
사용 중: 10GB
→ 2GB를 디스크에서 처리
→ 디스크 스왑 발생
→ 시스템 느려짐
```

```python
import psutil

# Swap 메모리 정보
swap = psutil.swap_memory()

print(f"Swap 전체: {swap.total / (1024**3):.1f}GB")
print(f"Swap 사용: {swap.used / (1024**3):.1f}GB")
print(f"Swap 사용률: {swap.percent}%")

if swap.percent > 50:
    print("⚠️ Swap 사용량이 높습니다. RAM 업그레이드 권장!")
```

## 🚨 RAM 문제 진단

```python
import psutil
import time

def diagnose_memory():
    """메모리 문제 진단"""
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()

    print("=== 메모리 진단 ===")
    print(f"RAM 사용률: {memory.percent}%")
    print(f"Swap 사용률: {swap.percent}%")

    # RAM 부족
    if memory.percent > 90:
        print("⚠️ 심각: RAM 사용률이 90% 초과!")
        print("   → 프로그램 종료 또는 RAM 업그레이드 필요")

    elif memory.percent > 75:
        print("⚠️ 경고: RAM 사용률이 75% 초과")
        print("   → 불필요한 프로그램 종료 권장")

    # Swap 사용 중
    if swap.percent > 0:
        print(f"⚠️ Swap 사용 중: {swap.percent}%")
        print("   → 성능 저하 발생 중. RAM 부족")

    # 프로세스별 메모리 사용 상위 5개
    print("\n=== 메모리 많이 쓰는 프로그램 Top 5 ===")
    processes = []
    for proc in psutil.process_iter(['name', 'memory_info']):
        try:
            processes.append((
                proc.info['name'],
                proc.info['memory_info'].rss / (1024**2)
            ))
        except:
            pass

    processes.sort(key=lambda x: x[1], reverse=True)

    for name, memory_mb in processes[:5]:
        print(f"{name}: {memory_mb:.1f}MB")

diagnose_memory()
```

**실행 결과**:
```
=== 메모리 진단 ===
RAM 사용률: 78.3%
Swap 사용률: 0.0%
⚠️ 경고: RAM 사용률이 75% 초과
   → 불필요한 프로그램 종료 권장

=== 메모리 많이 쓰는 프로그램 Top 5 ===
chrome: 1243.5MB
python: 856.2MB
slack: 542.8MB
spotify: 385.1MB
vscode: 312.4MB
```

## 🔗 관련 용어

- [[CPU]]: RAM의 데이터를 처리
- [[Cache]]: RAM보다 빠른 임시 저장소
- [[Heap]]: RAM에서 동적 할당되는 영역
- [[Stack]]: RAM에서 함수 호출이 저장되는 영역
- [[Process]]: RAM을 사용하는 실행 단위

## 📝 정리

**RAM의 핵심**:
```
RAM = 컴퓨터의 작업 공간
→ 빠른 임시 저장소
→ 전원 꺼지면 데이터 사라짐
→ 많을수록 멀티태스킹 유리
```

**권장 RAM 용량**:
```
일반 사용: 8GB
개발/작업: 16GB
전문 작업: 32GB+
```

**비유로 기억하기**:
```
RAM = 책상 크기
큰 책상 = 여러 작업 동시에 가능
작은 책상 = 한 가지 작업만 가능
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
