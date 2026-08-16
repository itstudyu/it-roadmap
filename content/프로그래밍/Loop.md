# Loop (반복문)

## 📝 정의

Loop(반복문)는 **같은 코드를 여러 번 반복 실행하는 제어 구조**입니다. 조건이 만족되는 동안 또는 정해진 횟수만큼 코드를 반복합니다.

### 핵심 개념

- **무엇인가?**: 코드 반복 실행 구조
- **왜 필요한가?**: 반복 작업 자동화
- **어떻게 작동하나?**: 조건 확인 → 실행 → 반복

### Loop가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 같은 코드 반복
print("Hello")
print("Hello")
print("Hello")
print("Hello")
print("Hello")
# 100번 출력하려면? 😱
# 복사-붙여넣기 100번? 😱

😱 시나리오 2: 리스트 처리
numbers = [1, 2, 3, 4, 5]
print(numbers[0])
print(numbers[1])
print(numbers[2])
print(numbers[3])
print(numbers[4])
# 요소가 100개면? 😱

😱 시나리오 3: 조건부 반복
# 사용자가 'quit' 입력할 때까지
# 계속 입력 받으려면? 😱
```

**Loop의 해결**:
```python
✅ 시나리오 1: for 반복
for i in range(100):
    print("Hello")
# 한 줄로 100번! ✅

✅ 시나리오 2: 리스트 순회
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num)
# 요소 개수 상관없이 처리! ✅

✅ 시나리오 3: while 반복
while True:
    user_input = input("입력: ")
    if user_input == "quit":
        break
    process(user_input)
# 조건에 따라 반복! ✅
```

## 💡 사용법

### Python

**for 반복문**:
```python
# 범위 반복
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# 리스트 반복
fruits = ["사과", "바나나", "오렌지"]
for fruit in fruits:
    print(fruit)

# 인덱스와 함께
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# 딕셔너리 반복
person = {"name": "Alice", "age": 25}
for key, value in person.items():
    print(f"{key}: {value}")
```

**while 반복문**:
```python
# 조건 반복
count = 0
while count < 5:
    print(count)
    count += 1

# 무한 루프
while True:
    command = input("명령: ")
    if command == "exit":
        break
    process(command)
```

**제어문**:
```python
# break: 루프 종료
for i in range(10):
    if i == 5:
        break  # 5에서 종료
    print(i)

# continue: 다음 반복으로
for i in range(10):
    if i % 2 == 0:
        continue  # 짝수 건너뛰기
    print(i)  # 홀수만 출력
```

### JavaScript

```javascript
// for 반복문
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// 배열 반복
const fruits = ["사과", "바나나", "오렌지"];

// for...of
for (const fruit of fruits) {
    console.log(fruit);
}

// forEach
fruits.forEach((fruit, index) => {
    console.log(`${index}: ${fruit}`);
});

// while 반복문
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}
```

## 🎯 실전 활용

### 1. 합계 계산

```python
numbers = [1, 2, 3, 4, 5]

total = 0
for num in numbers:
    total += num

print(f"합계: {total}")  # 15
```

### 2. 최댓값 찾기

```python
numbers = [3, 7, 2, 9, 1, 5]

max_value = numbers[0]
for num in numbers:
    if num > max_value:
        max_value = num

print(f"최댓값: {max_value}")  # 9
```

### 3. 필터링

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = []
for num in numbers:
    if num % 2 == 0:
        evens.append(num)

print(evens)  # [2, 4, 6, 8, 10]
```

### 4. 중첩 반복문

```python
# 구구단
for i in range(2, 10):
    for j in range(1, 10):
        print(f"{i} x {j} = {i*j}")
    print()  # 빈 줄

# 2차원 배열
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for cell in row:
        print(cell, end=' ')
    print()
```

### 5. 무한 루프 (게임/서버)

```python
# 게임 메인 루프
running = True
while running:
    # 입력 처리
    user_input = get_input()

    # 게임 로직
    update_game_state()

    # 화면 렌더링
    render()

    # 종료 조건
    if game_over:
        running = False

# 서버 루프
while True:
    # 클라이언트 연결 대기
    client = accept_connection()

    # 요청 처리
    process_request(client)

    # 응답 전송
    send_response(client)
```

## 🔍 반복문 패턴

### 1. 순회 (Iteration)

```python
# 모든 요소 처리
for item in items:
    process(item)
```

### 2. 변환 (Transformation)

```python
# 리스트 컴프리헨션
doubled = [x * 2 for x in numbers]
```

### 3. 필터 (Filtering)

```python
# 조건에 맞는 것만
filtered = [x for x in numbers if x > 5]
```

### 4. 집계 (Aggregation)

```python
# 합계, 평균 등
total = sum(numbers)
average = sum(numbers) / len(numbers)
```

### 5. 검색 (Search)

```python
# 요소 찾기
for item in items:
    if item == target:
        found = item
        break
```

## 🚨 주의사항

### 1. 무한 루프

```python
# ❌ 무한 루프 (종료 조건 없음)
while True:
    print("무한 반복")
    # break가 없으면 영원히 실행!

# ✅ 종료 조건 있음
count = 0
while count < 10:
    print(count)
    count += 1  # 증가 필수!
```

### 2. 반복 중 리스트 수정

```python
# ❌ 위험한 패턴
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    if num % 2 == 0:
        numbers.remove(num)  # 반복 중 수정!

# ✅ 안전한 방법
numbers = [1, 2, 3, 4, 5]
numbers = [num for num in numbers if num % 2 != 0]
```

### 3. 인덱스 범위

```python
# ❌ 인덱스 초과
numbers = [1, 2, 3]
for i in range(10):  # 10번 반복
    print(numbers[i])  # IndexError!

# ✅ 올바른 범위
for i in range(len(numbers)):
    print(numbers[i])
```

## 📊 시간 복잡도

```python
# O(n): 선형
for item in items:  # n번
    print(item)

# O(n²): 이차
for i in items:     # n번
    for j in items:  # n번
        print(i, j)

# O(n³): 삼차
for i in items:
    for j in items:
        for k in items:
            print(i, j, k)
```

## 🔗 관련 용어

- [[Array]]: 반복문으로 순회하는 자료구조
- [[Function]]: 반복문을 포함하는 단위
- [[Recursion]]: 반복문의 대안
- [[Variable]]: 반복 카운터로 사용

## 📝 정리

**반복문의 핵심**:
```
Loop = 같은 코드 반복 실행
→ for: 정해진 횟수/요소 순회
→ while: 조건이 참인 동안
→ break/continue로 제어
```

**for vs while**:
```
for: 횟수를 알 때
→ range(10), 리스트 순회

while: 조건을 알 때
→ 사용자 입력, 무한 루프
```

**비유로 기억하기**:
```
Loop = 체조 반복 동작
→ "10회 반복" = for
→ "지칠 때까지" = while
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
