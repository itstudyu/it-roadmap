# Dictionary / Map (딕셔너리 / 맵)

## 📝 정의

Dictionary(딕셔너리) 또는 Map(맵)은 **키(Key)와 값(Value)의 쌍으로 데이터를 저장하는 자료구조**입니다. 키로 빠르게 값을 찾을 수 있습니다.

### 핵심 개념

- **무엇인가?**: 키-값 쌍의 집합
- **왜 필요한가?**: 의미 있는 이름으로 값 저장
- **어떻게 작동하나?**: 키로 O(1) 시간에 값 접근

### Dictionary가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 관련 정보 저장
name = "Alice"
age = 25
email = "alice@example.com"
city = "Seoul"
# 개별 변수로 흩어져 있음! 😱

😱 시나리오 2: 리스트의 한계
user = ["Alice", 25, "alice@example.com", "Seoul"]
# 인덱스로 접근: user[0], user[1]...
# 무엇이 무엇인지 헷갈림! 😱
# user[2]가 뭐였지? 😱

😱 시나리오 3: 데이터 찾기
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
# Alice의 나이는?
# 위치 찾아서 같은 인덱스로... 😱
```

**Dictionary의 해결**:
```python
✅ 시나리오 1: 한 곳에 저장
user = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com",
    "city": "Seoul"
}
# 모든 정보가 하나의 딕셔너리에! ✅

✅ 시나리오 2: 의미 있는 키
print(user["name"])   # "Alice" - 명확!
print(user["age"])    # 25 - 이해하기 쉬움!
print(user["email"])  # 무엇인지 바로 알 수 있음! ✅

✅ 시나리오 3: 빠른 검색
users = {
    "Alice": 25,
    "Bob": 30,
    "Charlie": 35
}
print(users["Alice"])  # 25 - 바로 찾기! ✅
```

## 💡 사용법

### Python Dictionary

```python
# 딕셔너리 생성
person = {
    "name": "Alice",
    "age": 25,
    "city": "Seoul"
}

# 값 접근
print(person["name"])  # "Alice"
print(person.get("age"))  # 25
print(person.get("country", "Unknown"))  # 기본값

# 값 추가/수정
person["email"] = "alice@example.com"  # 추가
person["age"] = 26  # 수정

# 값 삭제
del person["city"]
person.pop("email")

# 키 확인
if "name" in person:
    print("이름 있음")

# 모든 키/값
print(person.keys())    # dict_keys(['name', 'age'])
print(person.values())  # dict_values(['Alice', 26])
print(person.items())   # dict_items([('name', 'Alice')...])

# 순회
for key, value in person.items():
    print(f"{key}: {value}")
```

### JavaScript Object/Map

```javascript
// 객체 (딕셔너리처럼 사용)
const person = {
    name: "Alice",
    age: 25,
    city: "Seoul"
};

// 값 접근
console.log(person.name);  // "Alice"
console.log(person["age"]);  // 25

// 값 추가/수정
person.email = "alice@example.com";
person.age = 26;

// 값 삭제
delete person.city;

// Map (진짜 딕셔너리)
const map = new Map();
map.set("name", "Alice");
map.set("age", 25);

console.log(map.get("name"));  // "Alice"
map.delete("age");
```

## 🎯 실전 활용

### 1. 설정 관리

```python
config = {
    "debug": True,
    "port": 8080,
    "host": "localhost",
    "database": {
        "host": "db.example.com",
        "port": 5432,
        "name": "mydb"
    }
}

# 접근
print(config["port"])  # 8080
print(config["database"]["host"])  # db.example.com
```

### 2. 카운팅

```python
text = "hello world hello"
words = text.split()

# 단어 빈도수 세기
word_count = {}
for word in words:
    if word in word_count:
        word_count[word] += 1
    else:
        word_count[word] = 1

print(word_count)  # {'hello': 2, 'world': 1}

# 또는 get 사용
word_count = {}
for word in words:
    word_count[word] = word_count.get(word, 0) + 1
```

### 3. 데이터 그룹화

```python
students = [
    {"name": "Alice", "grade": "A"},
    {"name": "Bob", "grade": "B"},
    {"name": "Charlie", "grade": "A"},
    {"name": "David", "grade": "B"}
]

# 학점별로 그룹화
by_grade = {}
for student in students:
    grade = student["grade"]
    if grade not in by_grade:
        by_grade[grade] = []
    by_grade[grade].append(student["name"])

print(by_grade)
# {'A': ['Alice', 'Charlie'], 'B': ['Bob', 'David']}
```

### 4. 캐싱

```python
# 피보나치 캐시
fib_cache = {}

def fibonacci(n):
    if n in fib_cache:
        return fib_cache[n]

    if n <= 1:
        return n

    result = fibonacci(n-1) + fibonacci(n-2)
    fib_cache[n] = result
    return result

print(fibonacci(100))  # 빠름!
```

### 5. JSON 데이터

```python
import json

# 딕셔너리 → JSON
user = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["독서", "영화"]
}

json_str = json.dumps(user, ensure_ascii=False)
print(json_str)

# JSON → 딕셔너리
user_dict = json.loads(json_str)
print(user_dict["name"])
```

## 🔍 Dictionary vs List

| 특성 | Dictionary | List |
|------|-----------|------|
| **인덱스** | 키 (문자열, 숫자 등) | 숫자 (0, 1, 2...) |
| **순서** | 무순서* | 순서 있음 |
| **접근** | O(1) | O(1) 인덱스, O(n) 검색 |
| **용도** | 키-값 매핑 | 순서 있는 집합 |

*Python 3.7+는 삽입 순서 유지

```python
# List: 순서 중요
scores = [90, 85, 95]
print(scores[0])  # 첫 번째

# Dictionary: 의미 중요
scores = {
    "math": 90,
    "english": 85,
    "science": 95
}
print(scores["math"])  # 수학 점수
```

## 🚨 주의사항

### 1. 키 존재 확인

```python
person = {"name": "Alice"}

# ❌ KeyError 발생 가능
# print(person["age"])

# ✅ 안전한 방법
print(person.get("age"))  # None
print(person.get("age", 0))  # 기본값 0
```

### 2. 가변 키 불가

```python
# ❌ 리스트는 키로 사용 불가
# d = {[1, 2]: "value"}  # TypeError!

# ✅ 튜플은 가능
d = {(1, 2): "value"}
```

### 3. 딕셔너리 복사

```python
# 참조 복사
dict1 = {"a": 1}
dict2 = dict1
dict2["a"] = 2
print(dict1)  # {"a": 2} - 변경됨!

# 얕은 복사
dict1 = {"a": 1}
dict2 = dict1.copy()
dict2["a"] = 2
print(dict1)  # {"a": 1} - 변경 안 됨
```

## 🔗 관련 용어

- [[Array]]: 순서 있는 자료구조
- [[Object]]: 딕셔너리와 유사
- [[JSON]]: 딕셔너리 형태의 데이터 포맷

## 📝 정리

**딕셔너리의 핵심**:
```
Dictionary = 키-값 쌍의 집합
→ 키로 빠르게 값 찾기 O(1)
→ 의미 있는 이름으로 저장
→ 순서 대신 의미 중요
```

**비유로 기억하기**:
```
Dictionary = 사전
→ 단어(키)를 찾으면
→ 뜻(값)을 알 수 있음
→ 인덱스 대신 단어로 찾기
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
