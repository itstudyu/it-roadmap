# YAML (YAML Ain't Markup Language)

## 📝 정의

YAML은 **사람이 읽기 쉬운 데이터 직렬화 형식**입니다. 설정 파일에 주로 사용되며 JSON보다 간결합니다.

### 핵심 개념

- **무엇인가?**: 들여쓰기 기반 데이터 형식
- **왜 필요한가?**: 읽기 쉬운 설정 파일
- **어떻게 작동하나?**: 공백으로 구조 표현

## 💡 YAML 형식

```yaml
name: Alice
age: 25
email: alice@example.com

hobbies:
  - 독서
  - 영화
  - 코딩

address:
  city: Seoul
  country: Korea

isStudent: false
grade: null
```

### JSON vs YAML

**JSON**:
```json
{
  "name": "Alice",
  "age": 25,
  "hobbies": ["독서", "영화"]
}
```

**YAML**:
```yaml
name: Alice
age: 25
hobbies:
  - 독서
  - 영화
```

## 🎯 사용법

### Python

```python
import yaml

# 딕셔너리 → YAML
data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["독서", "영화"]
}

yaml_string = yaml.dump(data, allow_unicode=True)
print(yaml_string)

# YAML → 딕셔너리
yaml_content = """
name: Bob
age: 30
city: Seoul
"""

python_dict = yaml.safe_load(yaml_content)
print(python_dict["name"])

# 파일 읽기/쓰기
with open("config.yaml", "w") as f:
    yaml.dump(data, f, allow_unicode=True)

with open("config.yaml") as f:
    config = yaml.safe_load(f)
```

## 📊 실전 활용

### Docker Compose

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html

  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: secret
```

### CI/CD 설정

```yaml
# GitHub Actions
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```

### Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: web
      image: nginx:latest
      ports:
        - containerPort: 80
```

## 🚨 주의사항

- 탭 사용 불가 (스페이스만)
- 들여쓰기가 구조를 결정
- 따옴표 선택적

## 🔗 관련 용어

- [[JSON]]: 비슷한 데이터 형식
- [[Docker]]: YAML 사용
- [[Kubernetes]]: YAML로 설정

## 📝 정리

**YAML의 핵심**:
```
YAML = 읽기 쉬운 설정 형식
→ 들여쓰기로 구조 표현
→ Docker, K8s 설정에 사용
→ JSON보다 간결
```

---
*카테고리: 데이터_형식*
*생성일: 2026-02-15*
