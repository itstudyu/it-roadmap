# Function (함수)

## 📝 정의

Function(함수)은 **특정 작업을 수행하는 재사용 가능한 코드 블록**입니다. 입력을 받아 처리한 후 결과를 반환합니다.

### 핵심 개념

- **무엇인가?**: 이름이 붙은 코드 묶음
- **왜 필요한가?**: 코드 재사용과 구조화
- **어떻게 작동하나?**: 호출하면 정의된 코드 실행

### Function이 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 같은 코드 반복
# 사용자 1 인사
print("=" * 30)
print(f"안녕하세요, Alice님!")
print(f"환영합니다!")
print("=" * 30)

# 사용자 2 인사
print("=" * 30)
print(f"안녕하세요, Bob님!")
print(f"환영합니다!")
print("=" * 30)

# 똑같은 코드를 계속 복사! 😱
# 형식 바꾸려면 모두 수정! 😱

😱 시나리오 2: 복잡한 계산 반복
# 원의 넓이 계산
area1 = 3.14159 * 5 * 5
area2 = 3.14159 * 10 * 10
area3 = 3.14159 * 7 * 7
# 공식 틀리면 다 틀림! 😱

😱 시나리오 3: 긴 코드 관리
# 500줄의 코드가 한 파일에
# 어디가 어딘지 모르겠음! 😱
```

**Function의 해결**:
```python
✅ 시나리오 1: 코드 재사용
def greet(name):
    """인사 함수"""
    print("=" * 30)
    print(f"안녕하세요, {name}님!")
    print(f"환영합니다!")
    print("=" * 30)

greet("Alice")
greet("Bob")
greet("Charlie")
# 함수 한 번만 수정하면 모든 곳에 적용! ✅

✅ 시나리오 2: 계산 캡슐화
def circle_area(radius):
    """원의 넓이 계산"""
    PI = 3.14159
    return PI * radius * radius

area1 = circle_area(5)
area2 = circle_area(10)
area3 = circle_area(7)
# 공식 한 곳만 수정! ✅

✅ 시나리오 3: 코드 구조화
def login(): ...
def process_order(): ...
def send_email(): ...
# 기능별로 분리! 가독성 향상! ✅
```

## 📊 함수 구조


### 함수 구성 요소

**1. 함수 이름**:
```python
def calculate_total():  # calculate_total이 이름
```

**2. 파라미터 (Parameter)**:
```python
def greet(name, age):  # name, age가 파라미터
    pass
```

**3. 함수 본문 (Body)**:
```python
def greet(name):
    # 아래가 함수 본문
    message = f"안녕하세요, {name}님"
    print(message)
```

**4. 반환값 (Return)**:
```python
def add(a, b):
    return a + b  # 결과 반환
```

## 💡 함수 사용법

### Python

```python
# 기본 함수
def say_hello():
    """파라미터 없는 함수"""
    print("Hello!")

say_hello()  # 호출

# 파라미터가 있는 함수
def greet(name):
    """파라미터 1개"""
    print(f"안녕하세요, {name}님!")

greet("Alice")

# 여러 파라미터
def add(a, b):
    """파라미터 2개"""
    return a + b

result = add(5, 3)
print(result)  # 8

# 기본값이 있는 파라미터
def greet(name, greeting="안녕하세요"):
    """기본값 사용"""
    print(f"{greeting}, {name}님!")

greet("Alice")              # 안녕하세요, Alice님!
greet("Bob", "반갑습니다")   # 반갑습니다, Bob님!

# 키워드 인자
def introduce(name, age, city):
    print(f"{name}, {age}세, {city} 거주")

introduce(name="Alice", age=25, city="서울")  # 순서 무관

# 가변 인자
def sum_all(*numbers):
    """개수 제한 없는 인자"""
    return sum(numbers)

print(sum_all(1, 2, 3))           # 6
print(sum_all(1, 2, 3, 4, 5))     # 15

# 여러 값 반환
def get_user_info():
    return "Alice", 25, "서울"

name, age, city = get_user_info()
```

### JavaScript

```javascript
// 함수 선언
function sayHello() {
    console.log("Hello!");
}

sayHello();

// 파라미터와 반환값
function add(a, b) {
    return a + b;
}

const result = add(5, 3);
console.log(result);  // 8

// 화살표 함수 (Arrow Function)
const multiply = (a, b) => a * b;
console.log(multiply(4, 5));  // 20

// 기본 파라미터
function greet(name, greeting = "안녕하세요") {
    console.log(`${greeting}, ${name}님!`);
}

greet("Alice");  // 안녕하세요, Alice님!

// 가변 인자
function sumAll(...numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

console.log(sumAll(1, 2, 3, 4, 5));  // 15
```

## 🎯 실전 활용

### 1. 검증 함수

```python
def is_valid_email(email):
    """이메일 유효성 검사"""
    if '@' not in email:
        return False
    if '.' not in email.split('@')[1]:
        return False
    return True

# 사용
email = "user@example.com"
if is_valid_email(email):
    print("유효한 이메일")
else:
    print("잘못된 이메일")
```

### 2. 데이터 변환

```python
def celsius_to_fahrenheit(celsius):
    """섭씨를 화씨로 변환"""
    return (celsius * 9/5) + 32

def fahrenheit_to_celsius(fahrenheit):
    """화씨를 섭씨로 변환"""
    return (fahrenheit - 32) * 5/9

# 사용
temp_c = 25
temp_f = celsius_to_fahrenheit(temp_c)
print(f"{temp_c}°C = {temp_f}°F")  # 25°C = 77.0°F
```

### 3. 계산 함수

```python
def calculate_discount(price, discount_rate):
    """할인가 계산"""
    discount = price * discount_rate
    final_price = price - discount
    return final_price, discount

# 사용
original = 10000
final, saved = calculate_discount(original, 0.2)
print(f"원가: {original}원")
print(f"할인: {saved}원")
print(f"최종: {final}원")
```

### 4. 리스트 처리

```python
def filter_even_numbers(numbers):
    """짝수만 필터링"""
    result = []
    for num in numbers:
        if num % 2 == 0:
            result.append(num)
    return result

def sum_list(numbers):
    """리스트 합계"""
    total = 0
    for num in numbers:
        total += num
    return total

# 사용
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = filter_even_numbers(data)
total = sum_list(evens)
print(f"짝수: {evens}")       # [2, 4, 6, 8, 10]
print(f"합계: {total}")        # 30
```

### 5. 고차 함수 (Higher-Order Function)

```python
def apply_operation(numbers, operation):
    """함수를 파라미터로 받기"""
    result = []
    for num in numbers:
        result.append(operation(num))
    return result

def double(x):
    return x * 2

def square(x):
    return x ** 2

# 사용
numbers = [1, 2, 3, 4, 5]
doubled = apply_operation(numbers, double)
squared = apply_operation(numbers, square)

print(doubled)  # [2, 4, 6, 8, 10]
print(squared)  # [1, 4, 9, 16, 25]

# 람다 함수와 함께
tripled = apply_operation(numbers, lambda x: x * 3)
print(tripled)  # [3, 6, 9, 12, 15]
```

### 6. 데코레이터 함수

```python
import time

def measure_time(func):
    """실행 시간 측정 데코레이터"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 실행 시간: {end-start:.4f}초")
        return result
    return wrapper

@measure_time
def slow_function():
    """느린 함수"""
    time.sleep(2)
    return "완료"

# 사용
result = slow_function()
# 출력: slow_function 실행 시간: 2.0023초
```

## 🔍 함수 vs 메서드

| 특성 | Function (함수) | Method (메서드) |
|------|----------------|----------------|
| **정의 위치** | 독립적 | 클래스 내부 |
| **호출 방식** | function() | object.method() |
| **self/this** | 없음 | 있음 |
| **예시** | print(), len() | list.append() |

```python
# 함수 (Function)
def greet(name):
    return f"Hello, {name}"

result = greet("Alice")

# 메서드 (Method)
class Person:
    def greet(self, name):
        return f"Hello, {name}"

person = Person()
result = person.greet("Alice")
```

## 🚨 함수 사용 주의사항

### 1. 함수는 한 가지 일만

```python
# ❌ 나쁜 예: 여러 일을 함
def process_user_and_send_email_and_log(user):
    # 사용자 처리
    # 이메일 전송
    # 로그 기록
    pass

# ✅ 좋은 예: 각자 역할 분리
def process_user(user):
    pass

def send_email(user):
    pass

def log_action(action):
    pass
```

### 2. 부작용(Side Effect) 주의

```python
# ❌ 부작용 있음
count = 0

def increment():
    global count
    count += 1  # 외부 변수 수정

# ✅ 순수 함수 (Pure Function)
def increment(count):
    return count + 1  # 새 값 반환

count = increment(count)
```

### 3. 함수 길이

```python
# ❌ 너무 긴 함수 (100+ 줄)
def do_everything():
    # ... 100 lines ...
    pass

# ✅ 작은 함수들로 분리
def step1(): pass
def step2(): pass
def step3(): pass

def do_everything():
    step1()
    step2()
    step3()
```

## 📊 함수 파라미터 전달 방식

### 값 전달 (Pass by Value)

```python
# 불변 객체 (숫자, 문자열)
def modify(x):
    x = 100

num = 10
modify(num)
print(num)  # 10 (변경 안 됨)
```

### 참조 전달 (Pass by Reference)

```python
# 가변 객체 (리스트, 딕셔너리)
def modify(lst):
    lst.append(4)

numbers = [1, 2, 3]
modify(numbers)
print(numbers)  # [1, 2, 3, 4] (변경됨!)
```

## 🔗 관련 용어

- [[Variable]]: 함수의 파라미터와 반환값
- [[Class]]: 함수를 메서드로 포함
- [[Object]]: 함수를 호출하는 주체
- [[Recursion]]: 자기 자신을 호출하는 함수
- [[Loop]]: 함수와 함께 자주 사용

## 📝 정리

**함수의 핵심**:
```
Function = 재사용 가능한 코드 블록
→ 입력(파라미터) 받기
→ 처리 수행
→ 결과(반환값) 돌려주기
```

**좋은 함수**:
```
1. 하나의 역할만 수행
2. 의미 있는 이름
3. 적절한 길이 (한 화면 안에)
4. 부작용 최소화
```

**비유로 기억하기**:
```
Function = 요리 레시피
→ 재료(파라미터) 넣으면
→ 조리 과정 거쳐서
→ 완성된 요리(반환값) 나옴
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
