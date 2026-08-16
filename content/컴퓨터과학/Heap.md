# Heap (힙)

## 📝 정의

Heap(힙)은 두 가지 의미를 가집니다:
1. **메모리 Heap**: 프로그램이 동적으로 할당하는 메모리 영역
2. **자료구조 Heap**: 최댓값/최솟값을 빠르게 찾는 트리 구조

### 핵심 개념

**메모리 Heap**:
- **무엇인가?**: 동적 메모리 할당 영역
- **왜 필요한가?**: 실행 시간에 크기가 결정되는 데이터 저장
- **어떻게 작동하나?**: malloc(), new 등으로 할당

**자료구조 Heap**:
- **무엇인가?**: 우선순위 기반 트리
- **왜 필요한가?**: 최댓값/최솟값 빠른 조회
- **어떻게 작동하나?**: 부모 > 자식 (Max Heap) 규칙 유지

## 📊 메모리 Heap


### Stack vs Heap 메모리

| 특성 | Stack | Heap |
|------|-------|------|
| **할당** | 자동 | 수동 (malloc, new) |
| **해제** | 자동 | 수동 (free, delete) |
| **크기** | 제한적 (MB) | 크다 (GB) |
| **속도** | 빠름 | 느림 |
| **관리** | 컴파일러 | 프로그래머 |
| **수명** | 함수 내 | 명시적 해제까지 |

### 메모리 Heap 문제점

**문제 상황**:
```python
😱 시나리오 1: 메모리 누수
def memory_leak():
    """메모리를 계속 할당만 함"""
    data = []
    while True:
        # 계속 할당만 하고 해제 안 함
        big_list = [0] * 1_000_000
        data.append(big_list)
    # Heap 메모리가 계속 증가! 😱
    # 결국 메모리 부족으로 크래시!

😱 시나리오 2: Dangling Pointer
ptr = malloc(100)  # Heap에 할당
free(ptr)          # 해제
*ptr = 10          # 해제된 메모리 접근! 😱
→ Segmentation Fault!

😱 시나리오 3: Heap Fragmentation
반복적인 할당/해제
→ Heap이 조각조각 나뉨
→ 큰 메모리 할당 실패 😱
```

**올바른 사용**:
```python
✅ 시나리오 1: 적절한 메모리 관리
def good_memory_management():
    """사용 후 해제"""
    data = [0] * 1_000_000
    process(data)
    del data  # 명시적 해제
    gc.collect()  # 가비지 컬렉션
    # 메모리 누수 방지! ✅

✅ 시나리오 2: 스마트 포인터 (C++)
std::unique_ptr<int> ptr = std::make_unique<int>(10);
// 자동으로 해제됨! ✅

✅ 시나리오 3: 메모리 풀
미리 큰 메모리 할당 후 재사용
→ Fragmentation 방지 ✅
```

### Python에서 Heap 메모리

```python
import sys
import gc

# 작은 객체 (Stack or Heap?)
small_number = 42
print(f"int 크기: {sys.getsizeof(small_number)} bytes")

# 큰 객체 (Heap)
large_list = [0] * 1_000_000
print(f"큰 리스트 크기: {sys.getsizeof(large_list) / (1024**2):.2f}MB")

# 명시적 삭제
del large_list
gc.collect()  # 가비지 컬렉션 강제 실행

# 메모리 사용량 확인
import psutil
process = psutil.Process()
memory_info = process.memory_info()
print(f"Heap 메모리 사용: {memory_info.rss / (1024**2):.2f}MB")
```

## 🎯 자료구조 Heap

### Max Heap (최대 힙)


**규칙**:
```
부모 노드 ≥ 자식 노드
→ 루트가 항상 최댓값
```

### Min Heap (최소 힙)


**규칙**:
```
부모 노드 ≤ 자식 노드
→ 루트가 항상 최솟값
```

## 💡 Python Heap 구현

### heapq 모듈 (Min Heap)

```python
import heapq

# Min Heap 생성
heap = []

# 원소 추가
heapq.heappush(heap, 5)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
heapq.heappush(heap, 1)

print(heap)  # [1, 3, 7, 5] - 완전 정렬은 아님

# 최솟값 제거 및 반환
min_value = heapq.heappop(heap)
print(f"최솟값: {min_value}")  # 1

# 최솟값 조회 (제거 안 함)
print(f"현재 최솟값: {heap[0]}")  # 3

# 리스트를 Heap으로 변환
data = [5, 3, 7, 1, 9, 2]
heapq.heapify(data)
print(data)  # [1, 3, 2, 5, 9, 7]
```

### Max Heap 구현 (음수 활용)

```python
import heapq

# Max Heap은 음수로 변환하여 구현
max_heap = []

# 추가 (음수로 변환)
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -7)

# 최댓값 제거 (음수로 변환했으므로 다시 양수로)
max_value = -heapq.heappop(max_heap)
print(f"최댓값: {max_value}")  # 7

# 현재 최댓값
print(f"현재 최댓값: {-max_heap[0]}")  # 5
```

## 🔍 실전 활용

### 1. Top K 원소 찾기

```python
import heapq

def find_top_k(nums, k):
    """가장 큰 k개 원소 찾기"""
    # Min Heap 사용 (크기 k 유지)
    heap = []

    for num in nums:
        heapq.heappush(heap, num)

        # Heap 크기가 k 초과하면 최솟값 제거
        if len(heap) > k:
            heapq.heappop(heap)

    # Heap에 남은 것이 Top K
    return sorted(heap, reverse=True)

# 테스트
numbers = [3, 2, 1, 5, 6, 4, 7, 8, 9, 10]
top_3 = find_top_k(numbers, 3)
print(f"Top 3: {top_3}")  # [10, 9, 8]
```

### 2. 우선순위 큐

```python
import heapq

class PriorityQueue:
    """우선순위 큐"""

    def __init__(self):
        self.heap = []

    def push(self, priority, item):
        """우선순위와 함께 추가"""
        heapq.heappush(self.heap, (priority, item))

    def pop(self):
        """우선순위가 가장 높은 항목 제거"""
        if self.heap:
            return heapq.heappop(self.heap)[1]
        return None

    def peek(self):
        """우선순위가 가장 높은 항목 조회"""
        if self.heap:
            return self.heap[0][1]
        return None

    def is_empty(self):
        return len(self.heap) == 0

# 사용
pq = PriorityQueue()

# 우선순위 숫자가 작을수록 높은 우선순위
pq.push(3, "작업 C")
pq.push(1, "작업 A")  # 가장 높은 우선순위
pq.push(2, "작업 B")

while not pq.is_empty():
    task = pq.pop()
    print(f"처리: {task}")
```

**실행 결과**:
```
처리: 작업 A
처리: 작업 B
처리: 작업 C
```

### 3. 병합 정렬된 리스트

```python
import heapq

def merge_k_sorted_lists(lists):
    """K개의 정렬된 리스트 병합"""
    heap = []
    result = []

    # 각 리스트의 첫 원소를 Heap에 추가
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))

    while heap:
        value, list_idx, element_idx = heapq.heappop(heap)
        result.append(value)

        # 다음 원소가 있으면 Heap에 추가
        if element_idx + 1 < len(lists[list_idx]):
            next_value = lists[list_idx][element_idx + 1]
            heapq.heappush(heap, (next_value, list_idx, element_idx + 1))

    return result

# 테스트
lists = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]

merged = merge_k_sorted_lists(lists)
print(merged)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 4. 중간값 스트림

```python
import heapq

class MedianFinder:
    """스트리밍 데이터의 중간값 찾기"""

    def __init__(self):
        # 작은 값들 (Max Heap)
        self.small = []
        # 큰 값들 (Min Heap)
        self.large = []

    def add_num(self, num):
        """숫자 추가"""
        # 작은 쪽에 추가 (Max Heap이므로 음수로)
        heapq.heappush(self.small, -num)

        # 균형 맞추기
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)

        # 크기 균형
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def find_median(self):
        """중간값 반환"""
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2

# 사용
mf = MedianFinder()
mf.add_num(1)
print(mf.find_median())  # 1

mf.add_num(2)
print(mf.find_median())  # 1.5

mf.add_num(3)
print(mf.find_median())  # 2
```

## 🚨 Heap 시간 복잡도

| 연산 | 시간 복잡도 |
|------|-------------|
| 삽입 (push) | O(log n) |
| 삭제 (pop) | O(log n) |
| 최댓값/최솟값 조회 | O(1) |
| Heapify | O(n) |

**비교**:
```
정렬된 배열:
- 삽입: O(n)
- 최솟값: O(1)

Heap:
- 삽입: O(log n)  ✅ 더 빠름
- 최솟값: O(1)
```

## 🔗 관련 용어

- [[Stack]]: LIFO 메모리 영역
- [[Queue]]: FIFO 자료구조
- [[Process]]: Stack과 Heap을 가진 실행 단위
- [[RAM]]: Stack과 Heap이 위치하는 메모리

## 📝 정리

**메모리 Heap**:
```
Heap = 동적 메모리 할당 영역
→ malloc(), new로 할당
→ free(), delete로 해제
→ 프로그래머가 직접 관리
```

**자료구조 Heap**:
```
Heap = 우선순위 기반 트리
→ 최댓값/최솟값 빠른 조회 O(1)
→ 삽입/삭제 O(log n)
→ 우선순위 큐에 사용
```

**비유로 기억하기**:
```
메모리 Heap = 큰 창고 (동적 할당)
Stack = 작은 선반 (고정 할당)

자료구조 Heap = 피라미드
→ 꼭대기가 최대/최소
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
