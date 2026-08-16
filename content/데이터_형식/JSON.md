# JSON (JavaScript Object Notation)

## 📝 정의

JSON(JavaScript Object Notation)은 **데이터를 저장하고 전송하기 위한 경량 텍스트 형식**입니다. 사람이 읽기 쉽고 기계가 파싱하기 쉽습니다.

### 핵심 개념

- **무엇인가?**: 키-값 쌍의 텍스트 데이터 형식
- **왜 필요한가?**: API 통신, 설정 파일 등
- **어떻게 작동하나?**: 문자열 ↔ 객체 변환

## 💡 JSON 형식

```json
{
  "name": "Alice",
  "age": 25,
  "email": "alice@example.com",
  "hobbies": ["독서", "영화", "코딩"],
  "address": {
    "city": "Seoul",
    "country": "Korea"
  },
  "isStudent": false,
  "grade": null
}
```

### JSON 데이터 타입

- **문자열**: `"hello"`
- **숫자**: `42`, `3.14`
- **불린**: `true`, `false`
- **null**: `null`
- **배열**: `[1, 2, 3]`
- **객체**: `{"key": "value"}`

## 🎯 사용법

### Python

```python
import json

# Python → JSON (직렬화)
data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["독서", "영화"]
}

json_string = json.dumps(data, ensure_ascii=False, indent=2)
print(json_string)

# JSON → Python (역직렬화)
json_data = '{"name": "Bob", "age": 30}'
python_dict = json.loads(json_data)
print(python_dict["name"])  # "Bob"

# 파일 저장
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 파일 읽기
with open("data.json", "r", encoding="utf-8") as f:
    loaded_data = json.load(f)
```

### JavaScript

```javascript
// JavaScript → JSON
const data = {
    name: "Alice",
    age: 25,
    hobbies: ["독서", "영화"]
};

const jsonString = JSON.stringify(data, null, 2);
console.log(jsonString);

// JSON → JavaScript
const jsonData = '{"name": "Bob", "age": 30}';
const obj = JSON.parse(jsonData);
console.log(obj.name);  // "Bob"
```

## 📊 실전 활용

### 1. API 응답

```python
# Flask API
@app.route('/api/user')
def get_user():
    user = {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
    }
    return jsonify(user)

# 클라이언트
response = requests.get('/api/user')
user = response.json()
print(user["name"])
```

### 2. 설정 파일

```json
// config.json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  },
  "debug": true,
  "max_connections": 100
}
```

```python
# 설정 읽기
with open("config.json") as f:
    config = json.load(f)

db_host = config["database"]["host"]
```

### 3. 데이터 저장

```python
# 사용자 데이터 저장
users = [
    {"id": 1, "name": "Alice", "age": 25},
    {"id": 2, "name": "Bob", "age": 30}
]

with open("users.json", "w") as f:
    json.dump(users, f, indent=2)
```

## 🚨 주의사항

### JSON 규칙

```json
// ✅ 올바른 JSON
{
  "name": "Alice",
  "age": 25,
  "active": true
}

// ❌ 잘못된 JSON
{
  name: "Alice",        // 키에 따옴표 필수
  'age': 25,            // 큰따옴표만 가능
  "active": True,       // true (소문자)
  "comment": "hello",   // 마지막 쉼표 불가
}
```

## 🔗 관련 용어

- [[XML]]: 다른 데이터 형식
- [[YAML]]: 더 읽기 쉬운 형식
- [[Dictionary]]: JSON과 유사한 구조

## 📝 정리

**JSON의 핵심**:
```
JSON = 가벼운 데이터 교환 형식
→ API 통신에 주로 사용
→ 키-값 쌍의 텍스트
→ 모든 언어에서 지원
```

---
*카테고리: 데이터_형식*
*생성일: 2026-02-15*
