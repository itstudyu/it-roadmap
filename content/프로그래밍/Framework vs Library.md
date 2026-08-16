# Framework vs Library (프레임워크 vs 라이브러리)

## 📝 정의

**Framework(프레임워크)**와 **Library(라이브러리)**는 둘 다 재사용 가능한 코드 모음이지만, **제어의 흐름(Control Flow)**이 누구에게 있느냐에 따라 구분됩니다.

### 핵심 차이

| 구분 | Framework | Library |
|------|-----------|---------|
| **제어권** | Framework가 코드 호출 | 개발자가 코드 호출 |
| **관계** | IoC (Inversion of Control) | 직접 호출 |
| **비유** | 집의 구조 (틀) | 가구 (도구) |
| **자유도** | 낮음 (규칙 따라야 함) | 높음 (원하는 대로) |
| **예시** | Django, React, Spring | requests, lodash, pandas |

### Framework vs Library가 중요한 이유

**문제 상황**:
```
😱 시나리오 1: 잘못된 선택
팀원: "간단한 API만 만들면 되는데 Django 쓸까요?"
→ Django: 인증, ORM, 템플릿, Admin 등 전부 포함
→ 학습 곡선 높고, 오버엔지니어링! 😱

올바른 선택: Flask(작은 프레임워크) 또는 requests(라이브러리)

😱 시나리오 2: Library를 Framework처럼 사용
개발자: "jQuery로 대규모 SPA 만들자!"
→ 라우팅, 상태관리, 컴포넌트 구조 전부 직접 구현
→ 유지보수 지옥! 😱

올바른 선택: React/Vue 같은 Framework 사용

😱 시나리오 3: 제어권 오해
신입: "React에서 내 방식대로 컴포넌트 만들어야지"
→ Hooks 규칙 무시, 생명주기 무시
→ 버그 투성이! 😱

이해 필요: Framework는 규칙을 따라야 함
```

**올바른 이해**:
```
✅ 시나리오 1:
간단한 프로젝트 → Library 선택
"requests로 API 호출만 하면 돼!" ✅

복잡한 프로젝트 → Framework 선택
"Django로 전체 구조 잡고 개발!" ✅

✅ 시나리오 2:
대규모 SPA → React(Framework)
"상태관리, 라우팅 다 제공!" ✅

유틸리티 기능 → lodash(Library)
"필요한 함수만 가져다 쓰기!" ✅

✅ 시나리오 3:
React 사용 → Hooks 규칙 준수
"useEffect는 이렇게 써야 해!" ✅
프레임워크의 규칙 = 베스트 프랙티스
```

## 📊 작동 원리

### 제어 흐름(Control Flow) 비교

```도해
층: Framework vs Library, 어떻게 나뉘어 있나
Library 사용 :: 내 코드] --> B1[Library 함수 호출
Framework 사용 :: Framework 시작] --> B2[내 코드 호출
```

**Library**: **내가 주도권** - 필요할 때 호출
```
내 코드 → Library 호출 → 결과 받음 → 내 코드 계속
```

**Framework**: **Framework가 주도권** - Framework가 내 코드 호출
```
Framework 시작 → 내 코드 호출 → 내 코드 실행 → Framework로 복귀
```

## 💡 실제 예시

### Library 사용 예시

**requests (HTTP Library)**:
```python
import requests  # Library 가져오기

# 내가 제어권을 가짐
def fetch_user_data(user_id):
    # 내가 원할 때 Library 호출
    response = requests.get(f'https://api.example.com/users/{user_id}')

    # 내가 원하는 대로 처리
    if response.status_code == 200:
        return response.json()
    else:
        return None

# 내가 실행 흐름 결정
user = fetch_user_data(123)
if user:
    print(f"User: {user['name']}")
```

**lodash (JavaScript Utility Library)**:
```javascript
import _ from 'lodash';  // Library 가져오기

// 내가 제어권을 가짐
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 35 }
];

// 내가 원할 때 Library 함수 호출
const sorted = _.sortBy(users, ['age']);  // 나이순 정렬
const grouped = _.groupBy(users, 'age');  // 나이별 그룹화
const names = _.map(users, 'name');       // 이름만 추출

// 내가 실행 흐름 결정
console.log(names);
```

### Framework 사용 예시

**Django (Python Web Framework)**:
```python
# Django가 제어권을 가짐
from django.http import HttpResponse
from django.urls import path

# Django가 호출할 함수 정의 (Django 규칙 따름)
def user_detail(request, user_id):
    """Django가 이 함수를 호출함"""
    # request 객체는 Django가 제공
    user = User.objects.get(id=user_id)  # Django ORM 사용
    return HttpResponse(f"User: {user.name}")  # Django 형식으로 반환

# Django에게 라우팅 규칙 알려줌 (Django 방식 따름)
urlpatterns = [
    path('users/<int:user_id>/', user_detail),
]

# Django가 서버 시작, 요청 처리, 함수 호출 모두 관리
# python manage.py runserver
```

**React (JavaScript UI Framework)**:
```javascript
import React, { useState, useEffect } from 'react';

// React가 호출할 컴포넌트 정의 (React 규칙 따름)
function UserProfile({ userId }) {
    // React Hooks 사용 (React가 정한 규칙)
    const [user, setUser] = useState(null);

    // React가 적절한 시점에 이 함수 호출
    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [userId]);  // React가 의존성 배열 관리

    // React가 렌더링 시점 결정
    return (
        <div>
            {user ? <h1>{user.name}</h1> : <p>Loading...</p>}
        </div>
    );
}

// React가 렌더링, 업데이트, 생명주기 모두 관리
export default UserProfile;
```

## 🎯 실전 비교

### 같은 기능을 Library vs Framework로 구현

**시나리오**: 사용자 목록을 보여주는 웹 페이지

**Library 방식 (Vanilla JS + axios)**:
```javascript
// 모든 제어를 내가 함
const loadUsers = async () => {
    // 1. 내가 API 호출 시점 결정
    const response = await axios.get('/api/users');
    const users = response.data;

    // 2. 내가 DOM 조작 방법 결정
    const container = document.getElementById('users');
    container.innerHTML = '';

    // 3. 내가 렌더링 로직 결정
    users.forEach(user => {
        const div = document.createElement('div');
        div.textContent = user.name;
        container.appendChild(div);
    });
};

// 4. 내가 실행 시점 결정
document.addEventListener('DOMContentLoaded', loadUsers);
```

**Framework 방식 (React)**:
```javascript
function UserList() {
    // React가 상태 관리
    const [users, setUsers] = useState([]);

    // React가 호출 시점 결정 (컴포넌트 마운트 시)
    useEffect(() => {
        axios.get('/api/users')
            .then(res => setUsers(res.data));
    }, []);  // React가 의존성 체크

    // React가 렌더링 시점과 방법 결정
    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </div>
    );
}

// React가 DOM 업데이트, 최적화 등 모두 처리
```

## 🔍 선택 가이드

### Library를 선택해야 할 때

```
✅ 특정 기능만 필요할 때
예: HTTP 요청, 날짜 포맷팅, 이미지 처리

✅ 기존 코드에 추가할 때
예: 프로젝트에 차트 기능만 추가

✅ 자유도가 중요할 때
예: 독특한 구조의 앱 개발

✅ 학습 곡선을 낮추고 싶을 때
예: 빠른 프로토타입

예시:
- requests (HTTP)
- pandas (데이터 분석)
- lodash (유틸리티)
- Chart.js (차트)
```

### Framework를 선택해야 할 때

```
✅ 대규모 프로젝트일 때
예: 여러 개발자가 협업하는 앱

✅ 전체 구조가 필요할 때
예: 인증, 라우팅, DB, 템플릿 등 모두 필요

✅ 베스트 프랙티스를 따르고 싶을 때
예: 검증된 패턴으로 개발

✅ 빠른 개발이 중요할 때
예: 많은 기능을 빨리 구현

예시:
- Django (웹 풀스택)
- React (UI)
- Spring (Java 엔터프라이즈)
- Angular (웹 풀스택)
```

## 🔧 혼합 사용

실제로는 Framework + Library를 함께 사용:

```javascript
// React Framework + Library들
import React from 'react';           // Framework
import axios from 'axios';           // Library
import moment from 'moment';         // Library
import { Chart } from 'chart.js';    // Library

function Dashboard() {
    // React Framework가 제어
    const [data, setData] = useState([]);

    useEffect(() => {
        // axios Library를 내가 제어
        axios.get('/api/stats')
            .then(res => {
                // moment Library를 내가 제어
                const formatted = res.data.map(item => ({
                    ...item,
                    date: moment(item.date).format('YYYY-MM-DD')
                }));
                setData(formatted);
            });
    }, []);

    return (
        <div>
            {/* Chart.js Library를 내가 제어 */}
            <Chart data={data} />
        </div>
    );
}
```

## 💭 비유로 이해하기

### Library = 도구 상자
```
🔧 내가 집을 짓는 중
→ 필요할 때 망치(Library) 꺼내서 사용
→ 못 박고 다시 도구 상자에 넣음
→ 내가 건축 과정 전체 제어
```

### Framework = 공사 현장 관리자
```
👷 현장 관리자(Framework)가 전체 지휘
→ "벽돌공! 벽 쌓아!" (내 코드 호출)
→ "배관공! 파이프 연결!" (내 코드 호출)
→ 관리자가 전체 공정 제어
→ 나는 내 역할만 수행
```

### 다른 비유
```
🎭 Library = 배우가 소품 사용
   "내가 이 칼을 들고 연기할게"

🎬 Framework = 감독이 배우 지시
   "이제 나와서 이 대사 해!"
```

## 🎓 용어 정리

### IoC (Inversion of Control)
```
전통적 방식: 내 코드 → Library 호출
Framework: Framework → 내 코드 호출

제어권이 역전됨 = IoC
```

### Hollywood Principle
```
"Don't call us, we'll call you"
"우리한테 전화하지 마, 우리가 전화할게"

→ Framework의 작동 원리
→ Framework가 내 코드를 호출함
```

## 📚 실전 예시

### Backend

**Library 방식**:
```python
# Flask (Micro Framework - Library에 가까움)
from flask import Flask, request
app = Flask(__name__)

# 라우팅을 내가 자유롭게 정의
@app.route('/users/<id>')
def get_user(id):
    # DB 연결을 내가 선택
    user = my_custom_db.query(id)
    # 응답 형식을 내가 결정
    return {'name': user.name}

# 서버 시작을 내가 제어
if __name__ == '__main__':
    app.run()
```

**Framework 방식**:
```python
# Django (Full Framework)
from django.db import models
from django.views import View

# Django가 정한 방식으로 모델 정의
class User(models.Model):
    name = models.CharField(max_length=100)
    # Django ORM 규칙 따름

# Django가 정한 방식으로 뷰 정의
class UserDetailView(View):
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        return JsonResponse({'name': user.name})

# Django가 서버 시작, 라우팅, 미들웨어 모두 관리
```

## 🔗 관련 용어

- [[Django]]: Python Web Framework
- [[React]]: JavaScript UI Framework/Library (논쟁 있음)
- [[Spring]]: Java Enterprise Framework
- [[Flask]]: Python Micro Framework
- [[Module]]: 코드를 구조화하는 단위
- [[Package]]: 여러 모듈의 묶음

## 📝 정리

**간단히 기억하기**:
```
Library: "내가 호출한다"
→ requests.get()
→ lodash.sortBy()
→ pandas.read_csv()

Framework: "나를 호출한다"
→ Django가 내 view 함수 호출
→ React가 내 컴포넌트 호출
→ Spring이 내 Controller 호출
```

**선택 기준**:
```
작은 프로젝트 + 자유도 → Library
큰 프로젝트 + 구조화 → Framework
```

---
*카테고리: 프로그래밍*
*생성일: 2026-02-15*
