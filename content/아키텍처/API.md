# API (Application Programming Interface)

## 📝 정의

API는 **소프트웨어 간 상호작용을 위한 인터페이스**입니다. 다른 프로그램의 기능을 사용할 수 있도록 정의된 규칙과 방법의 집합입니다.

### 핵심 개념

- **무엇인가?**: 프로그램끼리 대화하는 방법
- **왜 필요한가?**: 모든 기능을 직접 만들 수 없음, 재사용 필요
- **어떻게 작동하나?**: 요청 → API → 응답

### API가 해결하는 문제

**문제 상황**:
```
😱 시나리오: 날씨 기능 추가
개발자: "날씨 정보를 앱에 넣고 싶어"
→ 기상청 데이터 수집
→ 예측 알고리즘 개발
→ 수개월 소요! 😱
```

**API의 해결**:
```
✅ 날씨 API 사용:
날씨 API 호출
→ 현재 날씨 데이터 수신
→ 5분 만에 구현! ✅
```

**비유**:
- **API 없음** = 레스토랑에서 직접 요리 (복잡)
- **API** = 메뉴판 보고 주문 (간단)

## 📊 API 종류

### REST API
```http
GET /users/123
POST /users
PUT /users/123
DELETE /users/123
```

### GraphQL
```graphql
query {
  user(id: "123") {
    name
    email
  }
}
```

## 💡 API 사용 예시

```python
import requests

# OpenWeather API 호출
response = requests.get(
    'https://api.openweathermap.org/data/2.5/weather',
    params={'q': 'Seoul', 'appid': 'YOUR_KEY'}
)

weather = response.json()
print(f"현재 온도: {weather['main']['temp']}°C")
```

## 🔗 관련 용어

- [[REST]]: API 설계 방식
- [[HTTP]]: API 통신 프로토콜
- [[JSON]]: API 데이터 형식

---
*카테고리: 아키텍처*
*생성일: 2026-02-14*
