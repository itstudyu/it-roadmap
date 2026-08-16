# CSV (Comma-Separated Values)

## 📝 정의

CSV는 **쉼표로 구분된 값들의 텍스트 파일 형식**입니다. 표 형태의 데이터를 저장하는 가장 간단한 방법입니다.

### 핵심 개념

- **무엇인가?**: 쉼표로 구분된 텍스트
- **왜 필요한가?**: 표 데이터 저장/교환
- **어떻게 작동하나?**: 각 줄이 행, 쉼표가 열 구분

## 💡 CSV 형식

```csv
name,age,email
Alice,25,alice@example.com
Bob,30,bob@example.com
Charlie,35,charlie@example.com
```

## 🎯 사용법

### Python

```python
import csv

# CSV 읽기
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'], row['age'])

# CSV 쓰기
data = [
    {'name': 'Alice', 'age': 25},
    {'name': 'Bob', 'age': 30}
]

with open('output.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(data)

# pandas 사용
import pandas as pd

df = pd.read_csv('data.csv')
print(df)

df.to_csv('output.csv', index=False)
```

## 📊 실전 활용

### 데이터 분석

```python
import pandas as pd

# CSV 로드
df = pd.read_csv('sales.csv')

# 통계
print(df.describe())
print(df['price'].mean())

# 필터링
high_sales = df[df['amount'] > 1000]

# 저장
high_sales.to_csv('high_sales.csv', index=False)
```

### Excel 호환

```python
# Excel에서 CSV 내보내기/가져오기 가능
# 데이터 교환에 편리
```

## 🚨 주의사항

- 쉼표가 데이터에 있으면 따옴표 필요
- 인코딩 주의 (UTF-8 권장)
- 헤더 행 확인

**예시**:
```csv
name,description
"Smith, John","CEO, Company"
```

## 🔗 관련 용어

- [[JSON]]: 더 복잡한 구조
- [[Excel]]: CSV 지원
- [[Pandas]]: CSV 처리 라이브러리

## 📝 정리

**CSV의 핵심**:
```
CSV = 쉼표로 구분된 값
→ 표 형태 데이터
→ 엑셀과 호환
→ 가장 단순한 데이터 형식
```

---
*카테고리: 데이터_형식*
*생성일: 2026-02-15*
