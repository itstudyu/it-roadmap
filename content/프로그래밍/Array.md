# Array / List (배열 / 리스트)

## 📝 정의

Array(배열) 또는 List(리스트)는 **여러 값을 순서대로 저장하는 자료구조**입니다. 인덱스로 각 요소에 접근할 수 있습니다.

### 핵심 개념

- **무엇인가?**: 순서가 있는 데이터 집합
- **왜 필요한가?**: 여러 값을 효율적으로 관리
- **어떻게 작동하나?**: 인덱스로 요소 접근

### Array가 해결하는 문제

**문제 상황**:
```python
😱 시나리오 1: 여러 값 저장
score1 = 90
score2 = 85
score3 = 95
score4 = 88
score5 = 92
# 변수가 너무 많음! 😱
# 평균 계산하려면? 😱

😱 시나리오 2: 값 추가/삭제 어려움
# 학생 1명 더 추가?
score6 = 87  # 변수 하나 더 만들어야 함 😱

😱 시나리오 3: 반복 처리 불가
# 모든 점수를 출력하려면?
print(score1)
print(score2)
print(score3)
# 하나씩 출력... 😱
```

**Array의 해결**:
```python
✅ 시나리오 1: 한 번에 관리
scores = [90, 85, 95, 88, 92]
# 모든 점수가 하나의 리스트에! ✅

✅ 시나리오 2: 쉬운 추가/삭제
scores.append(87)  # 추가
scores.remove(85)  # 삭제
# 간편한 관리! ✅

✅ 시나리오 3: 반복문으로 처리
for score in scores:
    print(score)
# 자동으로 모두 출력! ✅

# 평균 계산도 간단
average = sum(scores) / len(scores)
```

## 📊 배열 구조


### 인덱스

```python
numbers = [10, 20, 30, 40, 50]

# 양수 인덱스 (앞에서부터)
numbers[0]  # 10 (첫 번째)
numbers[1]  # 20 (두 번째)
numbers[4]  # 50 (다섯 번째)

# 음수 인덱스 (뒤에서부터)
numbers[-1]  # 50 (마지막)
numbers[-2]  # 40 (마지막에서 두 번째)
```

## 💡 사용법

### Python List

```python
# 리스트 생성
numbers = [1, 2, 3, 4, 5]
fruits = ["사과", "바나나", "오렌지"]
mixed = [1, "hello", 3.14, True]  # 다양한 타입 가능

# 요소 접근
print(fruits[0])   # "사과"
print(fruits[-1])  # "오렌지"

# 슬라이싱
numbers = [0, 1, 2, 3, 4, 5]
print(numbers[1:4])   # [1, 2, 3]
print(numbers[:3])    # [0, 1, 2]
print(numbers[3:])    # [3, 4, 5]
print(numbers[::2])   # [0, 2, 4] (2칸씩)

# 요소 추가
fruits.append("포도")         # 끝에 추가
fruits.insert(1, "딸기")      # 특정 위치에 추가
fruits.extend(["키위", "망고"])  # 여러 개 추가

# 요소 제거
fruits.remove("바나나")  # 값으로 제거
fruits.pop()           # 마지막 제거
fruits.pop(0)          # 인덱스로 제거
del fruits[1]          # 인덱스로 제거

# 리스트 연산
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2  # [1, 2, 3, 4, 5, 6]
repeated = list1 * 2      # [1, 2, 3, 1, 2, 3]

# 유용한 메서드
numbers = [3, 1, 4, 1, 5]
numbers.sort()           # [1, 1, 3, 4, 5] (정렬)
numbers.reverse()        # [5, 4, 3, 1, 1] (역순)
count = numbers.count(1) # 2 (개수)
index = numbers.index(4) # 1 (위치)
```

### JavaScript Array

```javascript
// 배열 생성
const numbers = [1, 2, 3, 4, 5];
const fruits = ["사과", "바나나", "오렌지"];

// 요소 접근
console.log(fruits[0]);   // "사과"
console.log(fruits[fruits.length - 1]);  // "오렌지"

// 요소 추가
fruits.push("포도");         // 끝에 추가
fruits.unshift("딸기");      // 앞에 추가

// 요소 제거
fruits.pop();               // 마지막 제거
fruits.shift();             // 첫 번째 제거

// 슬라이싱
numbers.slice(1, 4);        // [2, 3, 4]

// 유용한 메서드
numbers.map(x => x * 2);    // [2, 4, 6, 8, 10]
numbers.filter(x => x > 2); // [3, 4, 5]
numbers.reduce((sum, x) => sum + x, 0);  // 15
```

## 🎯 실전 활용

### 1. 통계 계산

```python
scores = [90, 85, 95, 88, 92, 78, 85]

# 평균
average = sum(scores) / len(scores)
print(f"평균: {average:.1f}")

# 최대/최소
print(f"최고점: {max(scores)}")
print(f"최저점: {min(scores)}")

# 정렬
sorted_scores = sorted(scores, reverse=True)
print(f"상위 3명: {sorted_scores[:3]}")
```

### 2. 필터링

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 짝수만
evens = [n for n in numbers if n % 2 == 0]
print(evens)  # [2, 4, 6, 8, 10]

# 5보다 큰 수
greater_than_5 = [n for n in numbers if n > 5]
print(greater_than_5)  # [6, 7, 8, 9, 10]
```

### 3. 변환

```python
names = ["alice", "bob", "charlie"]

# 대문자로 변환
upper_names = [name.upper() for name in names]
print(upper_names)  # ['ALICE', 'BOB', 'CHARLIE']

# 길이 계산
lengths = [len(name) for name in names]
print(lengths)  # [5, 3, 7]
```

### 4. 2차원 배열

```python
# 게임 보드
board = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# 접근
print(board[0][0])  # 1
print(board[1][2])  # 6

# 순회
for row in board:
    for cell in row:
        print(cell, end=' ')
    print()
```

## 🔍 Array vs List

| 언어 | 용어 | 특징 |
|------|------|------|
| Python | List | 동적 크기, 다양한 타입 |
| JavaScript | Array | 동적 크기, 다양한 타입 |
| Java | Array | 고정 크기, 같은 타입 |
| C | Array | 고정 크기, 같은 타입 |

## 🚨 주의사항

### 1. 인덱스 범위

```python
numbers = [1, 2, 3]
# print(numbers[5])  # IndexError!
```

### 2. 복사 vs 참조

```python
# 참조 (같은 리스트)
list1 = [1, 2, 3]
list2 = list1
list2.append(4)
print(list1)  # [1, 2, 3, 4] - 변경됨!

# 복사 (새 리스트)
list1 = [1, 2, 3]
list2 = list1.copy()
list2.append(4)
print(list1)  # [1, 2, 3] - 변경 안 됨
```

## 🔗 관련 용어

- [[Dictionary]]: 키-값 쌍의 자료구조
- [[Loop]]: 배열 순회에 사용
- [[Variable]]: 배열을 담는 변수

## 📝 정리

**배열의 핵심**:
```
Array = 순서 있는 값들의 집합
→ 인덱스로 접근 [0], [1], [2]...
→ 여러 값을 한 번에 관리
→ 반복문으로 쉽게 처리
```

**비유로 기억하기**:
```
Array = 사물함
→ 각 칸에 번호(인덱스)가 있고
→ 순서대로 물건(값)을 보관
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
