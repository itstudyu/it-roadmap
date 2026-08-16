# Object (객체)

## 📝 정의

Object(객체)는 **클래스로 만든 실제 인스턴스**입니다. 데이터(속성)와 기능(메서드)을 가진 프로그램의 기본 단위입니다.

### 핵심 개념

- **무엇인가?**: 클래스의 구체적인 실체
- **왜 필요한가?**: 현실 세계를 코드로 표현
- **어떻게 작동하나?**: 클래스로 객체 생성(인스턴스화)

### Object가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 분산된 데이터
car1_brand = "Tesla"
car1_model = "Model 3"
car1_year = 2023
car1_color = "Black"

car2_brand = "BMW"
car2_model = "i4"
car2_year = 2023
car2_color = "White"

# 관련 정보가 흩어져 있음! 😱
# 자동차 하나에 변수 4개씩! 😱

😱 시나리오 2: 함수만으로 관리
def drive_car(brand, model, year, speed):
    print(f"{brand} {model} running at {speed}km/h")

def stop_car(brand, model):
    print(f"{brand} {model} stopped")

# 모든 정보를 매번 전달! 😱
# 함수와 데이터가 분리! 😱

😱 시나리오 3: 딕셔너리로만 관리
car1 = {"brand": "Tesla", "model": "Model 3"}
car2 = {"brand": "BMW", "model": "i4"}

# 메서드가 없음! 😱
# 타입 체크 불가! 😱
```

**Object의 해결**:
```python
✅ 시나리오 1: 데이터 통합
class Car:
    def __init__(self, brand, model, year, color):
        self.brand = brand
        self.model = model
        self.year = year
        self.color = color

car1 = Car("Tesla", "Model 3", 2023, "Black")
car2 = Car("BMW", "i4", 2023, "White")

# 모든 정보가 객체 안에! ✅

✅ 시나리오 2: 데이터와 기능 통합
class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        self.speed = 0

    def drive(self, speed):
        self.speed = speed
        print(f"{self.brand} {self.model} running at {speed}km/h")

    def stop(self):
        self.speed = 0
        print(f"{self.brand} {self.model} stopped")

car = Car("Tesla", "Model 3")
car.drive(100)  # 데이터와 기능이 함께! ✅
car.stop()

✅ 시나리오 3: 타입과 메서드
car = Car("Tesla", "Model 3")
print(type(car))  # <class '__main__.Car'>

# 메서드 사용 가능
car.drive(100)
car.stop()
# 명확한 구조! ✅
```

## 📊 객체 vs 클래스


### 클래스 vs 객체

| 구분 | 클래스 (Class) | 객체 (Object) |
|------|---------------|---------------|
| **정의** | 설계도, 틀 | 실제 인스턴스 |
| **존재** | 코드에만 존재 | 메모리에 존재 |
| **개수** | 하나 | 여러 개 가능 |
| **비유** | 붕어빵 틀 | 실제 붕어빵 |

```python
# 클래스 정의 (한 번)
class Car:
    def __init__(self, brand):
        self.brand = brand

# 객체 생성 (여러 개)
car1 = Car("Tesla")   # 객체 1
car2 = Car("BMW")     # 객체 2
car3 = Car("Audi")    # 객체 3

# 각 객체는 독립적
car1.brand = "Mercedes"
print(car2.brand)  # "BMW" (영향 없음)
```

## 💡 객체 사용법

### Python

```python
# 클래스 정의
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"저는 {self.name}이고, {self.age}세입니다"

# 객체 생성
alice = Person("Alice", 25)
bob = Person("Bob", 30)

# 속성 접근
print(alice.name)  # "Alice"
print(bob.age)     # 30

# 메서드 호출
print(alice.introduce())  # "저는 Alice이고, 25세입니다"

# 속성 수정
alice.age = 26
print(alice.age)  # 26

# 객체 비교
print(alice == bob)  # False (다른 객체)
print(id(alice))     # 메모리 주소
print(id(bob))       # 다른 메모리 주소
```

### JavaScript

```javascript
// 클래스 정의
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        return `저는 ${this.name}이고, ${this.age}세입니다`;
    }
}

// 객체 생성
const alice = new Person("Alice", 25);
const bob = new Person("Bob", 30);

// 속성 접근
console.log(alice.name);  // "Alice"

// 메서드 호출
console.log(alice.introduce());

// 객체 리터럴 (클래스 없이)
const person = {
    name: "Charlie",
    age: 35,
    introduce() {
        return `저는 ${this.name}입니다`;
    }
};
```

## 🎯 실전 활용

### 1. 쇼핑 카트 객체

```python
class ShoppingCart:
    """쇼핑 카트"""

    def __init__(self):
        self.items = []

    def add_item(self, product, quantity=1):
        """상품 추가"""
        self.items.append({
            'product': product,
            'quantity': quantity
        })
        print(f"{product} {quantity}개 추가됨")

    def remove_item(self, product):
        """상품 제거"""
        self.items = [item for item in self.items
                      if item['product'] != product]
        print(f"{product} 제거됨")

    def get_total(self, prices):
        """총액 계산"""
        total = 0
        for item in self.items:
            price = prices.get(item['product'], 0)
            total += price * item['quantity']
        return total

    def show_cart(self):
        """카트 내용 보기"""
        print("\n=== 장바구니 ===")
        for item in self.items:
            print(f"- {item['product']}: {item['quantity']}개")

# 사용
cart = ShoppingCart()
cart.add_item("사과", 3)
cart.add_item("바나나", 2)
cart.show_cart()

prices = {"사과": 1000, "바나나": 1500}
total = cart.get_total(prices)
print(f"\n총액: {total}원")
```

**실행 결과**:
```
사과 3개 추가됨
바나나 2개 추가됨

=== 장바구니 ===
- 사과: 3개
- 바나나: 2개

총액: 6000원
```

### 2. 게임 캐릭터 객체

```python
class Character:
    """게임 캐릭터"""

    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.attack = attack
        self.level = 1

    def take_damage(self, damage):
        """피해 받기"""
        self.hp -= damage
        if self.hp < 0:
            self.hp = 0
        print(f"{self.name}이(가) {damage} 피해를 받았습니다!")
        print(f"남은 HP: {self.hp}/{self.max_hp}")

    def attack_target(self, target):
        """공격하기"""
        print(f"{self.name}이(가) {target.name}을(를) 공격!")
        target.take_damage(self.attack)

    def is_alive(self):
        """생존 확인"""
        return self.hp > 0

    def heal(self, amount):
        """회복"""
        self.hp += amount
        if self.hp > self.max_hp:
            self.hp = self.max_hp
        print(f"{self.name}이(가) {amount} 회복!")

# 사용
player = Character("용사", 100, 20)
monster = Character("고블린", 50, 10)

player.attack_target(monster)
monster.attack_target(player)

if monster.is_alive():
    print(f"{monster.name} 아직 살아있음!")
```

### 3. 여러 객체 관리

```python
class Student:
    """학생 클래스"""

    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.scores = []

    def add_score(self, score):
        """점수 추가"""
        self.scores.append(score)

    def get_average(self):
        """평균 점수"""
        if not self.scores:
            return 0
        return sum(self.scores) / len(self.scores)

class Classroom:
    """교실 클래스"""

    def __init__(self, name):
        self.name = name
        self.students = []

    def add_student(self, student):
        """학생 추가"""
        self.students.append(student)

    def get_class_average(self):
        """반 평균"""
        if not self.students:
            return 0
        total = sum(s.get_average() for s in self.students)
        return total / len(self.students)

    def show_rankings(self):
        """성적 순위"""
        ranked = sorted(self.students,
                       key=lambda s: s.get_average(),
                       reverse=True)
        print(f"\n=== {self.name} 성적 순위 ===")
        for i, student in enumerate(ranked, 1):
            avg = student.get_average()
            print(f"{i}위: {student.name} - {avg:.1f}점")

# 사용
classroom = Classroom("1반")

# 학생 객체 생성
alice = Student("Alice", "001")
alice.add_score(90)
alice.add_score(85)
alice.add_score(95)

bob = Student("Bob", "002")
bob.add_score(80)
bob.add_score(75)
bob.add_score(85)

# 반에 추가
classroom.add_student(alice)
classroom.add_student(bob)

# 통계
classroom.show_rankings()
print(f"\n반 평균: {classroom.get_class_average():.1f}점")
```

### 4. 객체 복사

```python
import copy

class Box:
    def __init__(self, items):
        self.items = items

# 얕은 복사 (Shallow Copy)
box1 = Box([1, 2, 3])
box2 = box1  # 같은 객체 참조!

box2.items.append(4)
print(box1.items)  # [1, 2, 3, 4] - box1도 변경됨!

# 깊은 복사 (Deep Copy)
box3 = Box([1, 2, 3])
box4 = copy.deepcopy(box3)  # 완전히 새로운 객체

box4.items.append(4)
print(box3.items)  # [1, 2, 3] - box3은 변경 안 됨!
```

## 🔍 객체 지향 프로그래밍 (OOP)

### 장점

```python
✅ 코드 재사용성
같은 클래스로 여러 객체 생성

✅ 유지보수 용이
객체 단위로 수정 가능

✅ 현실 세계 모델링
자동차, 사람 등을 그대로 표현

✅ 복잡도 관리
큰 프로그램을 작은 객체들로 분할
```

### 실제 사용 예

```python
# 웹 프레임워크
request = Request()
response = Response()
user = User.objects.get(id=1)

# 데이터베이스
connection = Database.connect()
query = Query().filter(age=25)

# GUI
button = Button(text="클릭")
window = Window(title="앱")
```

## 🚨 객체 사용 주의사항

### 1. 객체 비교

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p1 = Point(1, 2)
p2 = Point(1, 2)

# ❌ 기본 비교는 메모리 주소
print(p1 == p2)  # False (다른 객체)

# ✅ __eq__ 메서드 구현 필요
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1 == p2)  # True (값이 같음)
```

### 2. 가변 기본값 주의

```python
# ❌ 위험한 패턴
class MyList:
    def __init__(self, items=[]):  # 위험!
        self.items = items

list1 = MyList()
list1.items.append(1)

list2 = MyList()
print(list2.items)  # [1] - 공유됨!

# ✅ 올바른 방법
class MyList:
    def __init__(self, items=None):
        self.items = items if items is not None else []
```

### 3. 순환 참조

```python
# ❌ 순환 참조
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

node1 = Node(1)
node2 = Node(2)
node1.next = node2
node2.next = node1  # 순환!

# 메모리 누수 가능
# Python은 GC가 처리하지만 주의 필요
```

## 🔗 관련 용어

- [[Class]]: 객체를 만드는 설계도
- [[Variable]]: 객체의 속성
- [[Function]]: 객체의 메서드
- [[Inheritance]]: 객체 간 관계

## 📝 정리

**객체의 핵심**:
```
Object = 클래스의 인스턴스
→ 데이터 + 기능을 가진 실체
→ 독립적인 메모리 공간
→ 프로그램의 기본 단위
```

**클래스 vs 객체**:
```
클래스 = 붕어빵 틀 (설계도)
객체 = 실제 붕어빵 (인스턴스)

class Car: ...      # 1개의 틀
car1 = Car()        # 붕어빵 1
car2 = Car()        # 붕어빵 2
```

**비유로 기억하기**:
```
Class = 건축 설계도
Object = 설계도로 지은 실제 건물
여러 건물을 같은 설계도로 지을 수 있음
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
