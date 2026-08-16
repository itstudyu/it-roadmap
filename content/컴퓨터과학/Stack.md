# Stack (스택)

## 📝 정의

Stack(스택)은 **LIFO(Last In First Out)** 원칙을 따르는 자료구조로, 가장 나중에 들어간 데이터가 가장 먼저 나오는 구조입니다. 접시를 쌓는 것처럼 위에서만 넣고 빼낼 수 있습니다.

### 핵심 개념

- **무엇인가?**: 후입선출(LIFO) 자료구조
- **왜 필요한가?**: 함수 호출, 실행 취소 등에 사용
- **어떻게 작동하나?**: push(넣기), pop(빼기) 연산

### Stack이 해결하는 문제

**문제 상황**:
```
😱 시나리오 1: 함수 호출 관리
함수 A → 함수 B → 함수 C 호출
→ 어떤 순서로 돌아가야 할까?
→ C 끝 → B로? A로? 😱

😱 시나리오 2: 괄호 검증
"((a+b) * (c-d))" 올바른가?
"((a+b) * (c-d)" 올바른가?
→ 어떻게 확인하지? 😱

😱 시나리오 3: 브라우저 뒤로 가기
페이지 1 → 2 → 3 → 4
뒤로 가기 클릭
→ 어디로 가야 할까? 😱
```

**Stack의 해결**:
```
✅ 시나리오 1: 콜 스택
A 호출 → Stack: [A]
B 호출 → Stack: [A, B]
C 호출 → Stack: [A, B, C]
C 끝   → Stack: [A, B] ← B로 복귀
B 끝   → Stack: [A]   ← A로 복귀
→ 정확한 순서로 돌아감! ✅

✅ 시나리오 2: 괄호 매칭
'(' 만나면 push
')' 만나면 pop
마지막에 스택이 비었으면 올바름
→ 간단하게 검증! ✅

✅ 시나리오 3: 히스토리
페이지 이동마다 push
뒤로 가기는 pop
→ Stack: [1, 2, 3, 4]
→ 뒤로: Stack: [1, 2, 3] ← 3으로!
→ 완벽한 탐색! ✅
```

## 📊 Stack 구조


### Stack 연산

**Push (삽입)**:
```
스택의 맨 위에 데이터 추가
Stack: [1, 2]
Push(3)
Stack: [1, 2, 3]
```

**Pop (제거)**:
```
스택의 맨 위 데이터 제거 및 반환
Stack: [1, 2, 3]
Pop() → 3 반환
Stack: [1, 2]
```

**Peek/Top (조회)**:
```
스택의 맨 위 데이터 조회 (제거 안 함)
Stack: [1, 2, 3]
Peek() → 3 반환
Stack: [1, 2, 3] (그대로)
```

## 💡 Python 구현

### 리스트로 Stack 구현

```python
class Stack:
    """Stack 자료구조"""

    def __init__(self):
        self.items = []

    def push(self, item):
        """스택에 추가"""
        self.items.append(item)

    def pop(self):
        """스택에서 제거"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()

    def peek(self):
        """맨 위 확인"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]

    def is_empty(self):
        """비었는지 확인"""
        return len(self.items) == 0

    def size(self):
        """스택 크기"""
        return len(self.items)

    def __str__(self):
        return f"Stack({self.items})"

# 사용
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)

print(stack)           # Stack([1, 2, 3])
print(stack.peek())    # 3
print(stack.pop())     # 3
print(stack)           # Stack([1, 2])
```

### Python 내장 자료구조 활용

```python
# 리스트를 Stack처럼 사용
stack = []

# Push
stack.append(1)
stack.append(2)
stack.append(3)

# Peek
top = stack[-1]  # 3

# Pop
item = stack.pop()  # 3

# Size
size = len(stack)

print(stack)  # [1, 2]
```

## 🎯 실전 활용

### 1. 괄호 검증

```python
def is_valid_parentheses(s):
    """괄호가 올바른지 검증"""
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in '({[':
            # 여는 괄호: push
            stack.append(char)
        elif char in ')}]':
            # 닫는 괄호: pop하여 매칭 확인
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    # 스택이 비어야 올바름
    return len(stack) == 0

# 테스트
print(is_valid_parentheses("()"))          # True
print(is_valid_parentheses("()[]{}"))      # True
print(is_valid_parentheses("(]"))          # False
print(is_valid_parentheses("([)]"))        # False
print(is_valid_parentheses("{[]}"))        # True
```

### 2. 함수 호출 스택

```python
def function_a():
    """함수 A"""
    print("A 시작")
    function_b()
    print("A 끝")

def function_b():
    """함수 B"""
    print("B 시작")
    function_c()
    print("B 끝")

def function_c():
    """함수 C"""
    print("C 시작")
    print("C 끝")

# 실행
function_a()

# 출력:
# A 시작
# B 시작
# C 시작
# C 끝     ← C 종료, Stack에서 pop, B로 복귀
# B 끝     ← B 종료, Stack에서 pop, A로 복귀
# A 끝     ← A 종료, Stack에서 pop

# 콜 스택 변화:
# [A]
# [A, B]
# [A, B, C]
# [A, B]    ← C pop
# [A]       ← B pop
# []        ← A pop
```

### 3. 실행 취소 (Undo)

```python
class TextEditor:
    """실행 취소 기능이 있는 텍스트 에디터"""

    def __init__(self):
        self.text = ""
        self.history = []  # 실행 취소용 스택

    def write(self, text):
        """텍스트 추가"""
        # 현재 상태를 스택에 저장
        self.history.append(self.text)
        self.text += text

    def undo(self):
        """실행 취소"""
        if self.history:
            self.text = self.history.pop()
        else:
            print("실행 취소할 내용이 없습니다")

    def show(self):
        """현재 텍스트 출력"""
        print(f"텍스트: '{self.text}'")

# 사용
editor = TextEditor()
editor.write("Hello ")
editor.show()  # "Hello "

editor.write("World")
editor.show()  # "Hello World"

editor.undo()
editor.show()  # "Hello "

editor.undo()
editor.show()  # ""
```

### 4. 브라우저 히스토리

```python
class Browser:
    """뒤로 가기/앞으로 가기 기능"""

    def __init__(self):
        self.back_stack = []     # 뒤로 가기용
        self.forward_stack = []  # 앞으로 가기용
        self.current = None

    def visit(self, url):
        """페이지 방문"""
        if self.current:
            self.back_stack.append(self.current)

        self.current = url
        self.forward_stack = []  # 새 페이지 방문 시 앞으로 가기 초기화

        print(f"방문: {url}")

    def back(self):
        """뒤로 가기"""
        if not self.back_stack:
            print("뒤로 갈 페이지가 없습니다")
            return

        self.forward_stack.append(self.current)
        self.current = self.back_stack.pop()

        print(f"뒤로 가기: {self.current}")

    def forward(self):
        """앞으로 가기"""
        if not self.forward_stack:
            print("앞으로 갈 페이지가 없습니다")
            return

        self.back_stack.append(self.current)
        self.current = self.forward_stack.pop()

        print(f"앞으로 가기: {self.current}")

# 사용
browser = Browser()
browser.visit("google.com")
browser.visit("youtube.com")
browser.visit("github.com")

browser.back()      # github → youtube
browser.back()      # youtube → google
browser.forward()   # google → youtube
```

**실행 결과**:
```
방문: google.com
방문: youtube.com
방문: github.com
뒤로 가기: youtube.com
뒤로 가기: google.com
앞으로 가기: youtube.com
```

### 5. 역순 문자열

```python
def reverse_string(s):
    """Stack을 사용한 문자열 뒤집기"""
    stack = []

    # 모든 문자를 stack에 push
    for char in s:
        stack.append(char)

    # stack에서 pop하여 역순으로
    reversed_str = ""
    while stack:
        reversed_str += stack.pop()

    return reversed_str

# 테스트
print(reverse_string("Hello"))  # "olleH"
print(reverse_string("Python"))  # "nohtyP"
```

### 6. 표현식 평가 (후위 표기법)

```python
def evaluate_postfix(expression):
    """후위 표기법 계산
    예: "3 4 +" → 3 + 4 = 7
    """
    stack = []

    for token in expression.split():
        if token.isdigit():
            # 숫자면 push
            stack.append(int(token))
        else:
            # 연산자면 두 개 pop하여 계산
            b = stack.pop()
            a = stack.pop()

            if token == '+':
                result = a + b
            elif token == '-':
                result = a - b
            elif token == '*':
                result = a * b
            elif token == '/':
                result = a / b

            stack.append(result)

    return stack[0]

# 테스트
print(evaluate_postfix("3 4 +"))      # 7
print(evaluate_postfix("3 4 + 2 *"))  # 14 ((3+4)*2)
print(evaluate_postfix("5 1 2 + 4 * + 3 -"))  # 14
```

## 🔍 Stack vs Queue

| 특성 | Stack | Queue |
|------|-------|-------|
| **원칙** | LIFO (후입선출) | FIFO (선입선출) |
| **비유** | 접시 쌓기 | 줄 서기 |
| **삽입** | Top에서 | Rear에서 |
| **제거** | Top에서 | Front에서 |
| **용도** | 함수 호출, Undo | 작업 대기열, BFS |

**비유**:
```
Stack = 접시 쌓기
→ 위에 놓은 접시를 먼저 꺼냄

Queue = 줄 서기
→ 먼저 선 사람이 먼저 나감
```

## 🚨 Stack Overflow

```python
def recursive_function():
    """무한 재귀 → Stack Overflow"""
    print("호출")
    recursive_function()  # 자기 자신 계속 호출

# 실행하면 RecursionError 발생!
# Python은 재귀 깊이 제한이 있음 (기본 1000)

import sys
print(f"재귀 한도: {sys.getrecursionlimit()}")

# 재귀 한도 변경 (주의!)
# sys.setrecursionlimit(2000)
```

## 🔗 관련 용어

- [[Queue]]: FIFO 자료구조
- [[Heap]]: 우선순위 기반 자료구조
- [[Process]]: 콜 스택을 가진 실행 단위
- [[Recursion]]: Stack을 사용하는 재귀 호출

## 📝 정리

**Stack의 핵심**:
```
Stack = LIFO (Last In First Out)
→ 가장 나중에 들어간 것이 먼저 나옴
→ push: 추가, pop: 제거
→ 함수 호출, Undo 등에 사용
```

**시간 복잡도**:
```
Push: O(1)
Pop: O(1)
Peek: O(1)
```

**비유로 기억하기**:
```
Stack = 접시 쌓기
→ 위에서만 넣고 빼기
→ 마지막 것이 먼저 나옴
```

---
*카테고리: 컴퓨터과학*
*생성일: 2026-02-15*
