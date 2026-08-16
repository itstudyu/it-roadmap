# Class (클래스)

## 📝 정의

Class(클래스)는 **객체를 만들기 위한 설계도(blueprint)**입니다. 관련된 데이터(속성)와 기능(메서드)을 하나로 묶어서 정의합니다.

### 핵심 개념

- **무엇인가?**: 객체의 틀, 설계도
- **왜 필요한가?**: 코드 재사용과 구조화
- **어떻게 작동하나?**: 클래스로 객체(인스턴스) 생성

### Class가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 관련 데이터 분산
user1_name = "Alice"
user1_age = 25
user1_email = "alice@example.com"

user2_name = "Bob"
user2_age = 30
user2_email = "bob@example.com"

# 관련 데이터가 흩어져 있음! 😱
# 사용자 추가할 때마다 변수 3개씩! 😱

😱 시나리오 2: 기능과 데이터 분리
def print_user_info(name, age, email):
    print(f"{name}, {age}세, {email}")

def update_user_email(name, age, old_email, new_email):
    # 모든 정보를 파라미터로... 😱
    pass

# 함수와 데이터가 따로! 😱

😱 시나리오 3: 같은 구조 반복
def create_dog(name, breed):
    return {"name": name, "breed": breed, "age": 0}

def create_cat(name, color):
    return {"name": name, "color": color, "age": 0}

# 비슷한 코드 반복! 😱
```

**Class의 해결**:
```python
✅ 시나리오 1: 데이터 묶음
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

user1 = User("Alice", 25, "alice@example.com")
user2 = User("Bob", 30, "bob@example.com")
# 관련 데이터가 한 곳에! ✅

✅ 시나리오 2: 데이터와 기능 통합
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

    def print_info(self):
        print(f"{self.name}, {self.age}세")

    def update_email(self, new_email):
        self.email = new_email

user = User("Alice", 25, "old@example.com")
user.print_info()
user.update_email("new@example.com")
# 데이터와 기능이 함께! ✅

✅ 시나리오 3: 공통 구조 상속
class Animal:
    def __init__(self, name):
        self.name = name
        self.age = 0

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)
        self.color = color

# 공통 부분 재사용! ✅
```

## 📊 클래스 구조


### 클래스 구성 요소

**1. 속성 (Attributes)**:
```python
class User:
    def __init__(self, name, age):
        self.name = name  # 인스턴스 속성
        self.age = age
```

**2. 메서드 (Methods)**:
```python
class User:
    def greet(self):  # 메서드
        print(f"안녕하세요, {self.name}입니다")
```

**3. 생성자 (Constructor)**:
```python
class User:
    def __init__(self, name):  # 생성자
        self.name = name
```

**4. 클래스 변수**:
```python
class User:
    count = 0  # 클래스 변수 (모든 인스턴스 공유)

    def __init__(self, name):
        self.name = name  # 인스턴스 변수
        User.count += 1
```

## 💡 클래스 사용법

### Python

```python
# 클래스 정의
class Person:
    """사람 클래스"""

    # 생성자
    def __init__(self, name, age):
        self.name = name
        self.age = age

    # 메서드
    def introduce(self):
        return f"저는 {self.name}이고, {self.age}세입니다"

    def birthday(self):
        self.age += 1
        print(f"생일 축하합니다! 이제 {self.age}세")

# 객체 생성 (인스턴스화)
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

# 메서드 호출
print(person1.introduce())  # 저는 Alice이고, 25세입니다
person1.birthday()          # 생일 축하합니다! 이제 26세

# 속성 접근
print(person1.name)  # Alice
print(person1.age)   # 26
```

### JavaScript

```javascript
// 클래스 정의
class Person {
    // 생성자
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 메서드
    introduce() {
        return `저는 ${this.name}이고, ${this.age}세입니다`;
    }

    birthday() {
        this.age++;
        console.log(`생일 축하합니다! 이제 ${this.age}세`);
    }
}

// 객체 생성
const person1 = new Person("Alice", 25);
const person2 = new Person("Bob", 30);

// 메서드 호출
console.log(person1.introduce());
person1.birthday();
```

## 🎯 실전 활용

### 1. 은행 계좌 클래스

```python
class BankAccount:
    """은행 계좌"""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.transactions = []

    def deposit(self, amount):
        """입금"""
        if amount > 0:
            self.balance += amount
            self.transactions.append(f"입금: +{amount}")
            print(f"{amount}원 입금됨. 잔액: {self.balance}원")
        else:
            print("입금액은 0보다 커야 합니다")

    def withdraw(self, amount):
        """출금"""
        if amount > self.balance:
            print("잔액 부족!")
        elif amount <= 0:
            print("출금액은 0보다 커야 합니다")
        else:
            self.balance -= amount
            self.transactions.append(f"출금: -{amount}")
            print(f"{amount}원 출금됨. 잔액: {self.balance}원")

    def get_balance(self):
        """잔액 조회"""
        return self.balance

    def show_transactions(self):
        """거래 내역"""
        print(f"\n=== {self.owner}님의 거래 내역 ===")
        for transaction in self.transactions:
            print(transaction)
        print(f"현재 잔액: {self.balance}원\n")

# 사용
account = BankAccount("Alice", 10000)
account.deposit(5000)
account.withdraw(3000)
account.show_transactions()
```

**실행 결과**:
```
5000원 입금됨. 잔액: 15000원
3000원 출금됨. 잔액: 12000원

=== Alice님의 거래 내역 ===
입금: +5000
출금: -3000
현재 잔액: 12000원
```

### 2. 상속 (Inheritance)

```python
# 부모 클래스
class Animal:
    """동물 기본 클래스"""

    def __init__(self, name):
        self.name = name

    def speak(self):
        pass  # 자식 클래스에서 구현

# 자식 클래스
class Dog(Animal):
    """강아지 클래스"""

    def __init__(self, name, breed):
        super().__init__(name)  # 부모 생성자 호출
        self.breed = breed

    def speak(self):
        return f"{self.name}: 멍멍!"

    def fetch(self):
        return f"{self.name}가 공을 가져옵니다"

class Cat(Animal):
    """고양이 클래스"""

    def __init__(self, name, color):
        super().__init__(name)
        self.color = color

    def speak(self):
        return f"{self.name}: 야옹~"

    def scratch(self):
        return f"{self.name}가 할퀴려고 합니다"

# 사용
dog = Dog("바둑이", "진돗개")
cat = Cat("나비", "흰색")

print(dog.speak())     # 바둑이: 멍멍!
print(dog.fetch())     # 바둑이가 공을 가져옵니다
print(cat.speak())     # 나비: 야옹~
print(cat.scratch())   # 나비가 할퀴려고 합니다
```

### 3. 캡슐화 (Encapsulation)

```python
class User:
    """사용자 클래스 (비밀번호 보호)"""

    def __init__(self, username, password):
        self.username = username
        self.__password = password  # private 속성 (__)

    def check_password(self, password):
        """비밀번호 확인"""
        return self.__password == password

    def change_password(self, old_password, new_password):
        """비밀번호 변경"""
        if self.check_password(old_password):
            self.__password = new_password
            print("비밀번호가 변경되었습니다")
        else:
            print("현재 비밀번호가 틀립니다")

# 사용
user = User("alice", "secret123")

# print(user.__password)  # AttributeError: private 접근 불가
print(user.check_password("secret123"))  # True

user.change_password("secret123", "newpass456")
print(user.check_password("newpass456"))  # True
```

### 4. 클래스 메서드와 정적 메서드

```python
class MathUtils:
    """수학 유틸리티 클래스"""

    PI = 3.14159  # 클래스 변수

    def __init__(self, value):
        self.value = value

    @classmethod
    def from_string(cls, string):
        """클래스 메서드: 문자열에서 객체 생성"""
        value = float(string)
        return cls(value)

    @staticmethod
    def add(a, b):
        """정적 메서드: 객체 없이 사용"""
        return a + b

    def square(self):
        """인스턴스 메서드"""
        return self.value ** 2

# 사용
# 정적 메서드
result = MathUtils.add(5, 3)  # 8

# 클래스 메서드
math_obj = MathUtils.from_string("10.5")

# 인스턴스 메서드
squared = math_obj.square()  # 110.25
```

### 5. 특수 메서드 (Magic Methods)

```python
class Vector:
    """2D 벡터"""

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        """문자열 표현"""
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        """덧셈 연산자 오버로딩"""
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        """동등 비교"""
        return self.x == other.x and self.y == other.y

    def __len__(self):
        """길이"""
        return int((self.x**2 + self.y**2)**0.5)

# 사용
v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1)           # Vector(1, 2)
v3 = v1 + v2        # 덧셈 사용
print(v3)           # Vector(4, 6)
print(v1 == v2)     # False
print(len(v1))      # 2
```

## 🔍 OOP 4대 원칙

### 1. 캡슐화 (Encapsulation)
```python
관련 데이터와 기능을 하나로 묶기
→ 내부 구현 숨기기
→ 인터페이스만 공개
```

### 2. 상속 (Inheritance)
```python
기존 클래스의 특성을 물려받기
→ 코드 재사용
→ 계층 구조 생성
```

### 3. 다형성 (Polymorphism)
```python
같은 인터페이스, 다른 구현
→ 같은 메서드 이름
→ 다른 동작
```

### 4. 추상화 (Abstraction)
```python
복잡한 내부를 단순한 인터페이스로
→ 핵심만 노출
→ 세부사항 숨김
```

## 🚨 클래스 사용 주의사항

### 1. 과도한 상속 피하기

```python
# ❌ 너무 깊은 상속
class A: pass
class B(A): pass
class C(B): pass
class D(C): pass
class E(D): pass  # 5단계 상속... 😱

# ✅ 얕은 상속 구조
class Animal: pass
class Dog(Animal): pass  # 2단계면 충분
```

### 2. 단일 책임 원칙

```python
# ❌ 너무 많은 책임
class User:
    def save_to_db(self): pass
    def send_email(self): pass
    def generate_report(self): pass
    def process_payment(self): pass  # 너무 많은 일!

# ✅ 책임 분리
class User: pass
class UserRepository:
    def save(self, user): pass
class EmailService:
    def send(self, user): pass
```

### 3. 불필요한 클래스 지양

```python
# ❌ 메서드 하나만 있는 클래스
class Calculator:
    def add(self, a, b):
        return a + b

# ✅ 함수로 충분
def add(a, b):
    return a + b
```

## 🔗 관련 용어

- [[Object]]: 클래스로 만든 인스턴스
- [[Function]]: 클래스의 메서드 기반
- [[Variable]]: 클래스의 속성
- [[Inheritance]]: 클래스 상속

## 📝 정리

**클래스의 핵심**:
```
Class = 객체의 설계도
→ 데이터(속성) + 기능(메서드)
→ 재사용 가능한 구조
→ OOP의 기본 단위
```

**클래스 vs 객체**:
```
클래스 = 붕어빵 틀
객체 = 실제 붕어빵

class Car: ...     # 설계도
car1 = Car()       # 실제 자동차
car2 = Car()       # 또 다른 자동차
```

**비유로 기억하기**:
```
Class = 건축 설계도
Object = 설계도로 지은 실제 건물
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
