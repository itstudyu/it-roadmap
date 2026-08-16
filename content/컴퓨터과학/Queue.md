# Queue (큐)

## 📝 정의

Queue(큐)는 **FIFO(First In First Out)** 원칙을 따르는 자료구조로, 가장 먼저 들어간 데이터가 가장 먼저 나오는 구조입니다. 줄을 서서 기다리는 것처럼 작동합니다.

### 핵심 개념

- **무엇인가?**: 선입선출(FIFO) 자료구조
- **왜 필요한가?**: 순서대로 처리해야 하는 작업 관리
- **어떻게 작동하나?**: enqueue(넣기), dequeue(빼기) 연산

### Queue가 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 작업 순서 관리
3개의 작업이 동시에 도착
→ 어떤 순서로 처리하지?
→ 늦게 온 게 먼저 처리되면 불공평! 😱

😱 시나리오 2: 프린터 대기열
여러 문서가 프린터로 전송
→ 순서 없이 처리하면?
→ 나중에 보낸 게 먼저 인쇄됨! 😱

😱 시나리오 3: BFS 탐색
그래프를 레벨별로 탐색하고 싶음
→ 어떤 자료구조를 써야 하지? 😱
```

**Queue의 해결**:
```
✅ 시나리오 1: 공정한 처리
작업 A 도착 → Queue: [A]
작업 B 도착 → Queue: [A, B]
작업 C 도착 → Queue: [A, B, C]
처리 시작   → A 먼저! (공정함) ✅

✅ 시나리오 2: 순서 보장
문서1 전송 → Queue: [문서1]
문서2 전송 → Queue: [문서1, 문서2]
인쇄 시작  → 문서1 먼저! ✅

✅ 시나리오 3: BFS
Queue 사용!
→ 레벨 0 노드들 먼저
→ 레벨 1 노드들 다음
→ 순서대로 탐색! ✅
```

## 📊 Queue 구조


### Queue 연산

**Enqueue (삽입)**:
```
큐의 뒤(Rear)에 데이터 추가
Queue: [1, 2]
Enqueue(3)
Queue: [1, 2, 3]
```

**Dequeue (제거)**:
```
큐의 앞(Front)에서 데이터 제거 및 반환
Queue: [1, 2, 3]
Dequeue() → 1 반환
Queue: [2, 3]
```

**Peek/Front (조회)**:
```
큐의 앞 데이터 조회 (제거 안 함)
Queue: [1, 2, 3]
Peek() → 1 반환
Queue: [1, 2, 3] (그대로)
```

## 💡 Python 구현

### collections.deque 사용 (권장)

```python
from collections import deque

# Queue 생성
queue = deque()

# Enqueue (추가)
queue.append(1)
queue.append(2)
queue.append(3)

print(queue)  # deque([1, 2, 3])

# Peek (조회)
front = queue[0]  # 1

# Dequeue (제거)
item = queue.popleft()  # 1
print(queue)  # deque([2, 3])

# 크기
size = len(queue)

# 비었는지 확인
is_empty = len(queue) == 0
```

### 리스트로 구현 (비권장 - 느림)

```python
# ❌ 리스트로 Queue (O(n) 시간)
queue = []

queue.append(1)  # Enqueue
queue.append(2)
queue.append(3)

item = queue.pop(0)  # Dequeue - O(n) 느림!

# ✅ deque 사용 (O(1) 시간)
from collections import deque
queue = deque([1, 2, 3])
item = queue.popleft()  # O(1) 빠름!
```

### Queue 클래스 구현

```python
from collections import deque

class Queue:
    """Queue 자료구조"""

    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        """큐에 추가"""
        self.items.append(item)

    def dequeue(self):
        """큐에서 제거"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.popleft()

    def peek(self):
        """앞 확인"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]

    def is_empty(self):
        """비었는지 확인"""
        return len(self.items) == 0

    def size(self):
        """큐 크기"""
        return len(self.items)

    def __str__(self):
        return f"Queue({list(self.items)})"

# 사용
queue = Queue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)

print(queue)           # Queue([1, 2, 3])
print(queue.dequeue()) # 1
print(queue)           # Queue([2, 3])
```

## 🎯 실전 활용

### 1. BFS (너비 우선 탐색)

```python
from collections import deque

def bfs(graph, start):
    """BFS 탐색"""
    visited = set()
    queue = deque([start])
    visited.add(start)

    result = []

    while queue:
        # 큐에서 꺼내기
        node = queue.popleft()
        result.append(node)

        # 인접 노드를 큐에 추가
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# 그래프
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# BFS 실행
result = bfs(graph, 'A')
print(result)  # ['A', 'B', 'C', 'D', 'E', 'F']
```

### 2. 작업 큐 (Task Queue)

```python
from collections import deque
import time

class TaskQueue:
    """작업 대기열"""

    def __init__(self):
        self.queue = deque()

    def add_task(self, task):
        """작업 추가"""
        self.queue.append(task)
        print(f"작업 추가: {task}")

    def process_tasks(self):
        """모든 작업 처리"""
        while self.queue:
            task = self.queue.popleft()
            print(f"처리 중: {task}")
            time.sleep(1)  # 작업 시뮬레이션
            print(f"완료: {task}")

# 사용
task_queue = TaskQueue()
task_queue.add_task("이메일 전송")
task_queue.add_task("데이터 백업")
task_queue.add_task("리포트 생성")

task_queue.process_tasks()
```

**실행 결과**:
```
작업 추가: 이메일 전송
작업 추가: 데이터 백업
작업 추가: 리포트 생성
처리 중: 이메일 전송
완료: 이메일 전송
처리 중: 데이터 백업
완료: 데이터 백업
처리 중: 리포트 생성
완료: 리포트 생성
```

### 3. 슬라이딩 윈도우 최댓값

```python
from collections import deque

def max_sliding_window(nums, k):
    """크기 k 윈도우의 최댓값들"""
    result = []
    dq = deque()  # 인덱스 저장

    for i, num in enumerate(nums):
        # 윈도우 밖의 인덱스 제거
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # 현재 값보다 작은 값들 제거
        while dq and nums[dq[-1]] < num:
            dq.pop()

        dq.append(i)

        # 윈도우가 형성되면 최댓값 추가
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result

# 테스트
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
result = max_sliding_window(nums, k)
print(result)  # [3, 3, 5, 5, 6, 7]
```

### 4. 회전 큐 (Circular Queue)

```python
class CircularQueue:
    """고정 크기 순환 큐"""

    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = 0
        self.rear = 0
        self.count = 0

    def enqueue(self, item):
        """추가"""
        if self.is_full():
            raise Exception("Queue is full")

        self.queue[self.rear] = item
        self.rear = (self.rear + 1) % self.size
        self.count += 1

    def dequeue(self):
        """제거"""
        if self.is_empty():
            raise Exception("Queue is empty")

        item = self.queue[self.front]
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.size
        self.count -= 1
        return item

    def is_full(self):
        return self.count == self.size

    def is_empty(self):
        return self.count == 0

    def __str__(self):
        items = []
        idx = self.front
        for _ in range(self.count):
            items.append(self.queue[idx])
            idx = (idx + 1) % self.size
        return f"CircularQueue({items})"

# 사용
cq = CircularQueue(3)
cq.enqueue(1)
cq.enqueue(2)
cq.enqueue(3)
print(cq)  # CircularQueue([1, 2, 3])

cq.dequeue()
cq.enqueue(4)
print(cq)  # CircularQueue([2, 3, 4])
```

### 5. 우선순위 큐

```python
import heapq

class PriorityQueue:
    """우선순위 큐 (낮은 숫자 = 높은 우선순위)"""

    def __init__(self):
        self.heap = []

    def enqueue(self, priority, item):
        """우선순위와 함께 추가"""
        heapq.heappush(self.heap, (priority, item))

    def dequeue(self):
        """우선순위가 높은 항목 제거"""
        if self.is_empty():
            raise Exception("Queue is empty")
        return heapq.heappop(self.heap)[1]

    def is_empty(self):
        return len(self.heap) == 0

# 사용
pq = PriorityQueue()
pq.enqueue(3, "낮은 우선순위")
pq.enqueue(1, "높은 우선순위")
pq.enqueue(2, "중간 우선순위")

while not pq.is_empty():
    print(pq.dequeue())
```

**실행 결과**:
```
높은 우선순위
중간 우선순위
낮은 우선순위
```

## 🔍 Queue 종류

### 1. Simple Queue (일반 큐)

```python
from collections import deque

queue = deque()
queue.append(1)  # Enqueue
queue.popleft()  # Dequeue
```

### 2. Circular Queue (순환 큐)

```python
# 고정 크기, 꼬리가 앞으로 연결
# 버퍼, 스트리밍에 사용
```

### 3. Priority Queue (우선순위 큐)

```python
import heapq

# 우선순위에 따라 Dequeue
# 작업 스케줄링에 사용
```

### 4. Deque (양방향 큐)

```python
from collections import deque

dq = deque()
dq.append(1)       # 뒤에 추가
dq.appendleft(2)   # 앞에 추가
dq.pop()           # 뒤에서 제거
dq.popleft()       # 앞에서 제거
```

## 🚨 Queue vs Stack

| 특성 | Queue | Stack |
|------|-------|-------|
| **원칙** | FIFO (선입선출) | LIFO (후입선출) |
| **비유** | 줄 서기 | 접시 쌓기 |
| **추가** | Rear | Top |
| **제거** | Front | Top |
| **용도** | 작업 대기열, BFS | 함수 호출, DFS |

**비유**:
```
Queue = 줄 서기
→ 먼저 온 사람이 먼저 나감

Stack = 접시 쌓기
→ 나중에 놓은 접시를 먼저 꺼냄
```

## 💻 시간 복잡도

### deque 사용 (권장)

| 연산 | 시간 복잡도 |
|------|-------------|
| Enqueue | O(1) |
| Dequeue | O(1) |
| Peek | O(1) |
| Size | O(1) |

### 리스트 사용 (비권장)

| 연산 | 시간 복잡도 |
|------|-------------|
| Enqueue (append) | O(1) |
| Dequeue (pop(0)) | O(n) ❌ |

```python
# ❌ 느린 방법
queue = []
queue.pop(0)  # O(n) - 모든 원소 이동!

# ✅ 빠른 방법
from collections import deque
queue = deque()
queue.popleft()  # O(1) - 빠름!
```

## 🔗 관련 용어

- [[Stack]]: LIFO 자료구조
- [[Heap]]: 우선순위 큐에 사용
- [[Deque]]: 양방향 큐
- [[BFS]]: Queue를 사용하는 탐색 알고리즘

## 📝 정리

**Queue의 핵심**:
```
Queue = FIFO (First In First Out)
→ 먼저 들어간 것이 먼저 나옴
→ enqueue: 뒤에 추가
→ dequeue: 앞에서 제거
```

**사용 예**:
```
- 작업 대기열
- 프린터 스풀
- BFS 탐색
- 메시지 큐
```

**비유로 기억하기**:
```
Queue = 줄 서기
→ 먼저 온 사람이 먼저 나감
→ 공정한 순서 보장
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
