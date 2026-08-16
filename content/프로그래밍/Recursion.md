# Recursion (재귀)

## 📝 정의

Recursion(재귀)은 **함수가 자기 자신을 호출하는 프로그래밍 기법**입니다. 문제를 더 작은 같은 문제로 나누어 해결합니다.

### 핵심 개념

- **무엇인가?**: 자기 자신을 호출하는 함수
- **왜 필요한가?**: 복잡한 문제를 간단하게 표현
- **어떻게 작동하나?**: 기본 사례 + 재귀 호출

### Recursion이 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 팩토리얼 계산
# 5! = 5 × 4 × 3 × 2 × 1
result = 1
for i in range(1, 6):
    result *= i
# 반복문으로는 복잡! 😱

😱 시나리오 2: 트리 구조 순회
# 폴더 안의 모든 파일 찾기
# 폴더 안에 또 폴더가...
# 깊이를 알 수 없음! 😱

😱 시나리오 3: 분할 정복
# 큰 문제를 작은 문제로
# 어떻게 나누지? 😱
```

**Recursion의 해결**:
```python
✅ 시나리오 1: 간단한 표현
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

print(factorial(5))  # 120
# 수학 공식 그대로! ✅

✅ 시나리오 2: 자연스러운 순회
def find_files(directory):
    files = []
    for item in directory:
        if is_file(item):
            files.append(item)
        else:  # 폴더면
            files.extend(find_files(item))  # 재귀!
    return files
# 깊이 상관없이 처리! ✅

✅ 시나리오 3: 분할 정복
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # 재귀
    right = merge_sort(arr[mid:])   # 재귀
    return merge(left, right)
# 자동으로 나누고 합침! ✅
```

## 📊 재귀 작동 원리


### 재귀 구조

**1. 기본 사례 (Base Case)**:
```python
if n <= 1:
    return 1  # 재귀 종료!
```

**2. 재귀 호출 (Recursive Case)**:
```python
return n * factorial(n-1)  # 자신을 호출
```

## 💡 재귀 예시

### Python

**팩토리얼**:
```python
def factorial(n):
    """n! 계산"""
    # 기본 사례
    if n <= 1:
        return 1

    # 재귀 호출
    return n * factorial(n - 1)

print(factorial(5))  # 120
# 5! = 5 × 4 × 3 × 2 × 1
```

**피보나치 수열**:
```python
def fibonacci(n):
    """n번째 피보나치 수"""
    # 기본 사례
    if n <= 1:
        return n

    # 재귀 호출
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(6))  # 8
# 0, 1, 1, 2, 3, 5, 8
```

**리스트 합계**:
```python
def sum_list(numbers):
    """리스트 합계 (재귀)"""
    # 기본 사례
    if not numbers:
        return 0

    # 재귀 호출
    return numbers[0] + sum_list(numbers[1:])

print(sum_list([1, 2, 3, 4, 5]))  # 15
```

## 🎯 실전 활용

### 1. 거듭제곱

```python
def power(base, exp):
    """base^exp 계산"""
    # 기본 사례
    if exp == 0:
        return 1

    # 재귀 호출
    return base * power(base, exp - 1)

print(power(2, 10))  # 1024
```

### 2. 역순 문자열

```python
def reverse_string(s):
    """문자열 뒤집기"""
    # 기본 사례
    if len(s) <= 1:
        return s

    # 재귀 호출
    return s[-1] + reverse_string(s[:-1])

print(reverse_string("hello"))  # "olleh"
```

### 3. 트리 순회

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def traverse(node):
    """트리 순회 (전위)"""
    if node is None:
        return

    print(node.value)        # 현재 노드
    traverse(node.left)      # 왼쪽 서브트리
    traverse(node.right)     # 오른쪽 서브트리

# 사용
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
traverse(root)  # 1, 2, 3
```

### 4. 이진 검색

```python
def binary_search(arr, target, left, right):
    """이진 검색 (재귀)"""
    # 기본 사례: 못 찾음
    if left > right:
        return -1

    mid = (left + right) // 2

    # 기본 사례: 찾음
    if arr[mid] == target:
        return mid

    # 재귀 호출
    if arr[mid] > target:
        return binary_search(arr, target, left, mid - 1)
    else:
        return binary_search(arr, target, mid + 1, right)

arr = [1, 3, 5, 7, 9, 11, 13]
index = binary_search(arr, 7, 0, len(arr) - 1)
print(f"7은 인덱스 {index}에 있음")  # 3
```

### 5. 디렉토리 탐색

```python
import os

def find_all_files(directory, extension):
    """특정 확장자 파일 모두 찾기"""
    result = []

    for item in os.listdir(directory):
        path = os.path.join(directory, item)

        if os.path.isfile(path):
            # 파일이면 확장자 확인
            if path.endswith(extension):
                result.append(path)
        else:
            # 디렉토리면 재귀 탐색
            result.extend(find_all_files(path, extension))

    return result

# 모든 .py 파일 찾기
py_files = find_all_files("/project", ".py")
```

## 🔍 재귀 vs 반복

| 특성 | 재귀 | 반복 |
|------|------|------|
| **가독성** | 높음 (간결) | 낮음 (복잡) |
| **성능** | 느림 (오버헤드) | 빠름 |
| **메모리** | 많이 사용 (스택) | 적게 사용 |
| **적합한 경우** | 트리, 분할정복 | 단순 반복 |

**재귀로 표현**:
```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)
```

**반복문으로 표현**:
```python
def factorial(n):
    result = 1
    for i in range(1, n+1):
        result *= i
    return result
```

## 🚨 주의사항

### 1. 무한 재귀

```python
# ❌ 기본 사례 없음
def infinite():
    return infinite()  # RecursionError!

# ✅ 기본 사례 있음
def countdown(n):
    if n <= 0:  # 기본 사례
        return
    print(n)
    countdown(n-1)
```

### 2. 재귀 깊이 제한

```python
import sys

# 기본 재귀 한도 확인
print(sys.getrecursionlimit())  # 1000

# ❌ 깊은 재귀
def deep(n):
    if n == 0:
        return
    deep(n-1)

# deep(2000)  # RecursionError!

# 필요시 한도 증가 (주의!)
sys.setrecursionlimit(3000)
```

### 3. 비효율적인 재귀

```python
# ❌ 비효율적 (중복 계산)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
# fibonacci(40) → 매우 느림!

# ✅ 메모이제이션
memo = {}
def fibonacci_memo(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1) + fibonacci_memo(n-2)
    return memo[n]
# fibonacci_memo(40) → 빠름!
```

## 🔗 관련 용어

- [[Function]]: 재귀의 기본 단위
- [[Stack]]: 재귀 호출이 저장되는 곳
- [[Loop]]: 재귀의 대안
- [[Algorithm]]: 재귀를 사용하는 알고리즘

## 📝 정리

**재귀의 핵심**:
```
Recursion = 자기 자신을 호출
→ 기본 사례 (종료 조건) 필수
→ 재귀 호출 (작은 문제로)
→ 간결하지만 오버헤드 있음
```

**재귀 패턴**:
```python
def recursive(problem):
    # 1. 기본 사례
    if is_simple(problem):
        return solve_directly(problem)

    # 2. 문제를 작게 나누기
    subproblems = divide(problem)

    # 3. 재귀 호출
    results = [recursive(sub) for sub in subproblems]

    # 4. 결과 합치기
    return combine(results)
```

**비유로 기억하기**:
```
Recursion = 러시아 인형
→ 큰 인형 안에 작은 인형
→ 작은 인형 안에 더 작은 인형
→ 가장 작은 인형이 기본 사례
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
