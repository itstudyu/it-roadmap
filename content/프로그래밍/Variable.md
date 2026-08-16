# Variable (변수)

## 📝 정의

Variable(변수)은 **데이터를 저장하는 공간**으로, 값을 담아두고 나중에 사용할 수 있는 이름이 붙은 메모리 위치입니다.

### 핵심 개념

- **무엇인가?**: 데이터를 저장하는 이름이 붙은 상자
- **왜 필요한가?**: 값을 재사용하고 관리하기 위해
- **어떻게 작동하나?**: 메모리에 값을 저장하고 이름으로 접근

### Variable이 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 값 재사용 불가
print(10 + 5)    # 15
print(10 * 2)    # 20
print(10 - 3)    # 7
# 10을 계속 반복! 나중에 20으로 바꾸려면? 😱
# 모든 10을 찾아서 수정해야 함!

😱 시나리오 2: 의미 파악 어려움
total = 5000 * 0.1 + 5000 * 0.9 * 0.2
# 이게 뭘 계산하는 건지 알 수 없음! 😱

😱 시나리오 3: 계산 결과 손실
10 + 20  # 30이 나왔지만...
# 결과가 어디 갔지? 😱
# 다시 계산해야 함!
```

**Variable의 해결**:
```python
✅ 시나리오 1: 값 재사용
price = 10
print(price + 5)  # 15
print(price * 2)  # 20
print(price - 3)  # 7
# price만 바꾸면 모든 계산이 자동 변경! ✅

✅ 시나리오 2: 의미 명확
price = 5000
vat_rate = 0.1
discount_rate = 0.2

vat = price * vat_rate
discounted_price = price * (1 - discount_rate)
total = vat + discounted_price
# 무엇을 계산하는지 한눈에! ✅

✅ 시나리오 3: 결과 저장
result = 10 + 20
print(result)  # 30
print(result * 2)  # 60
# 계산 결과를 계속 사용! ✅
```

## 📊 변수 작동 원리


### 변수 생명주기

**1. 선언 (Declaration)**:
```python
age  # 변수 이름만 선언 (Python은 자동)
```

**2. 할당 (Assignment)**:
```python
age = 25  # 값 할당
```

**3. 사용 (Usage)**:
```python
print(age)  # 변수 사용
next_age = age + 1
```

**4. 재할당 (Reassignment)**:
```python
age = 26  # 새 값으로 변경
```

**5. 소멸 (Destruction)**:
```python
del age  # 명시적 삭제
# 또는 스코프를 벗어나면 자동 소멸
```

## 💡 변수 사용법

### Python

```python
# 변수 선언 및 할당
name = "Alice"
age = 25
height = 165.5
is_student = True

# 여러 변수 동시 할당
x, y, z = 1, 2, 3

# 같은 값으로 여러 변수 할당
a = b = c = 0

# 변수 출력
print(name)  # Alice
print(f"{name}님의 나이는 {age}세입니다")

# 변수 값 변경
age = 26
print(age)  # 26

# 변수 타입 확인
print(type(name))   # <class 'str'>
print(type(age))    # <class 'int'>
```

### JavaScript

```javascript
// 변수 선언 방식
var oldWay = "옛날 방식";      // 함수 스코프
let modernWay = "최신 방식";    // 블록 스코프
const CONSTANT = "상수";        // 변경 불가

// 변수 사용
let name = "Alice";
let age = 25;

console.log(name);  // Alice
console.log(`${name}님의 나이는 ${age}세입니다`);

// 재할당
age = 26;  // ✅ let은 재할당 가능
// CONSTANT = "변경";  // ❌ const는 재할당 불가

// 타입 확인
console.log(typeof name);  // string
console.log(typeof age);   // number
```

## 🎯 변수 네이밍 규칙

### 좋은 이름

```python
✅ 의미 있는 이름
user_age = 25          # 무엇인지 명확
total_price = 10000    # 목적이 분명
is_valid = True        # 불린 값 명확

✅ Camel Case (JavaScript 주로 사용)
userName = "Alice"
totalPrice = 10000
isValid = true

✅ Snake Case (Python 주로 사용)
user_name = "Alice"
total_price = 10000
is_valid = True

✅ 상수는 대문자
MAX_SIZE = 100
DEFAULT_TIMEOUT = 30
PI = 3.14159
```

### 나쁜 이름

```python
❌ 의미 불명확
a = 25              # 무엇을 의미?
x = 10000           # 뭘 나타내는 숫자?
flag = True         # 무슨 플래그?

❌ 한글/특수문자 (가능하지만 비추천)
나이 = 25           # 영어 권장
가격! = 10000       # 특수문자 사용 불가

❌ 예약어 사용
class = "A"         # SyntaxError!
for = 10            # SyntaxError!
```

## 🔍 변수 스코프

### 지역 변수 (Local Variable)

```python
def my_function():
    local_var = "함수 안"
    print(local_var)  # ✅ 작동

my_function()
# print(local_var)  # ❌ NameError: 함수 밖에서 접근 불가
```

### 전역 변수 (Global Variable)

```python
global_var = "전역"

def my_function():
    print(global_var)  # ✅ 전역 변수 읽기 가능

my_function()
print(global_var)  # ✅ 어디서든 접근 가능

# 전역 변수 수정
def modify_global():
    global global_var
    global_var = "수정됨"

modify_global()
print(global_var)  # "수정됨"
```

### 블록 스코프 (JavaScript)

```javascript
// var: 함수 스코프
function testVar() {
    if (true) {
        var x = 10;
    }
    console.log(x);  // 10 - if 밖에서도 접근 가능
}

// let: 블록 스코프
function testLet() {
    if (true) {
        let y = 20;
    }
    // console.log(y);  // ReferenceError - if 밖에서 접근 불가
}
```

## 💻 실전 활용

### 설정 값 관리

```python
# ❌ 나쁜 예: 매직 넘버
def calculate_price(quantity):
    return quantity * 1000 * 0.9 * 1.1
    # 1000은? 0.9는? 1.1은? 😱

# ✅ 좋은 예: 의미 있는 변수
def calculate_price(quantity):
    UNIT_PRICE = 1000
    DISCOUNT_RATE = 0.9
    TAX_RATE = 1.1

    base_price = quantity * UNIT_PRICE
    discounted = base_price * DISCOUNT_RATE
    final_price = discounted * TAX_RATE

    return final_price
```

### 중간 결과 저장

```python
# ❌ 복잡한 한 줄
result = ((10 + 20) * 3 - 5) / ((30 - 10) * 2 + 15)

# ✅ 단계별 변수
sum_value = 10 + 20          # 30
multiplied = sum_value * 3   # 90
numerator = multiplied - 5   # 85

diff_value = 30 - 10         # 20
multiplied2 = diff_value * 2 # 40
denominator = multiplied2 + 15  # 55

result = numerator / denominator  # 명확!
```

### 스왑 (값 교환)

```python
# Python: 간단한 스왑
a = 10
b = 20
a, b = b, a
print(a, b)  # 20 10

# 다른 언어: 임시 변수 필요
a = 10
b = 20
temp = a
a = b
b = temp
print(a, b)  # 20 10
```

### 누적 계산

```python
# 합계 계산
total = 0
for i in range(1, 11):
    total += i  # total = total + i
print(total)  # 55

# 곱셈 누적
product = 1
for i in range(1, 6):
    product *= i  # product = product * i
print(product)  # 120 (5!)
```

## 🚨 변수 사용 주의사항

### 1. 초기화하지 않은 변수

```python
# ❌ 에러 발생
print(undefined_var)  # NameError

# ✅ 먼저 초기화
undefined_var = None
print(undefined_var)  # None
```

### 2. 변수 재사용 주의

```python
# ❌ 같은 변수를 다른 용도로
data = fetch_user_data()
# ... 100 lines later ...
data = fetch_order_data()  # 위 data 덮어씀!

# ✅ 명확한 이름 사용
user_data = fetch_user_data()
order_data = fetch_order_data()
```

### 3. 가변 객체 조심

```python
# ❌ 예상치 못한 동작
list1 = [1, 2, 3]
list2 = list1  # 같은 객체 참조!
list2.append(4)
print(list1)  # [1, 2, 3, 4] - list1도 변경됨!

# ✅ 복사본 생성
list1 = [1, 2, 3]
list2 = list1.copy()  # 또는 list1[:]
list2.append(4)
print(list1)  # [1, 2, 3] - 변경 안 됨
```

## 📊 변수 vs 상수

| 특성 | Variable (변수) | Constant (상수) |
|------|----------------|----------------|
| **값 변경** | 가능 | 불가 |
| **네이밍** | snake_case/camelCase | UPPER_CASE |
| **용도** | 변하는 값 | 고정된 값 |
| **예시** | count, total | MAX_SIZE, PI |

```python
# Python (관례로 상수 표현)
MAX_USERS = 100  # 대문자로 상수 표시
user_count = 0   # 소문자로 변수 표시

user_count += 1  # ✅ 변경 가능
# MAX_USERS = 200  # 가능하지만 하지 말아야 함

# JavaScript (진짜 상수)
const MAX_USERS = 100;
let userCount = 0;

userCount += 1;        // ✅ 변경 가능
// MAX_USERS = 200;    // ❌ TypeError
```

## 🔗 관련 용어

- [[Function]]: 변수를 파라미터로 받음
- [[Class]]: 변수를 속성으로 가짐
- [[Object]]: 변수들의 집합
- [[Loop]]: 변수로 반복 제어

## 📝 정리

**변수의 핵심**:
```
Variable = 데이터를 담는 이름 있는 상자
→ 값을 저장하고 재사용
→ 코드 가독성 향상
→ 유지보수 용이
```

**좋은 변수 사용**:
```
1. 의미 있는 이름 사용
2. 적절한 스코프 유지
3. 초기화 후 사용
4. 용도에 맞게 네이밍
```

**비유로 기억하기**:
```
Variable = 이름표가 붙은 상자
→ 물건(값)을 담아두고
→ 이름표로 찾아서 사용
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
