# Component (컴포넌트)

## 📝 정의
**Component**는 **재사용 가능한 독립적인 UI 조각**입니다.

레고 블록처럼 작은 부품들을 조합해서 큰 애플리케이션을 만드는 방식입니다.

### 한 줄 요약
> 재사용 가능한 독립적인 UI 코드 단위

### 비유
- 🧩 **레고 블록**: 작은 블록들을 조합해서 큰 작품을 만듦
- 🏗️ **건축 자재**: 같은 창문, 문을 여러 건물에 재사용
- 🍱 **도시락 칸**: 각 칸이 독립적이면서도 하나의 도시락 구성

## 🎯 핵심 개념

### 1. 재사용성 (Reusability)
한 번 만든 컴포넌트를 여러 곳에서 사용할 수 있습니다.

**예시**:
```jsx
// Button 컴포넌트를 한 번만 만들고
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// 여러 곳에서 재사용
<Button text="저장" onClick={handleSave} />
<Button text="취소" onClick={handleCancel} />
<Button text="삭제" onClick={handleDelete} />
```

### 2. 독립성 (Independence)
각 컴포넌트는 독립적으로 동작합니다.

**특징**:
- 자체 로직과 스타일을 가짐
- 다른 컴포넌트에 영향을 주지 않음
- 테스트와 유지보수가 쉬움

### 3. 계층 구조 (Hierarchy)
컴포넌트는 트리 구조로 조합됩니다.

```
App
├── Header
│   ├── Logo
│   └── Navigation
├── Main
│   ├── Sidebar
│   └── Content
└── Footer
```

### 4. Props (속성)
부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달합니다.

```jsx
// 부모 → 자식으로 데이터 전달
<UserCard
  name="홍길동"
  email="hong@example.com"
  age={25}
/>
```

### 5. State (상태)
컴포넌트 내부의 변경 가능한 데이터입니다.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

## ⚠️ 해결하는 문제

### 문제 1: 코드 중복 (Code Duplication)
**문제 상황**:
```jsx
// 같은 버튼 코드를 계속 반복
<button className="primary-btn" onClick={handleSave}>저장</button>
<button className="primary-btn" onClick={handleEdit}>수정</button>
<button className="primary-btn" onClick={handleDelete}>삭제</button>
```

**해결 방법**:
```jsx
// 컴포넌트로 한 번만 정의
function PrimaryButton({ children, onClick }) {
  return (
    <button className="primary-btn" onClick={onClick}>
      {children}
    </button>
  );
}

// 재사용
<PrimaryButton onClick={handleSave}>저장</PrimaryButton>
<PrimaryButton onClick={handleEdit}>수정</PrimaryButton>
<PrimaryButton onClick={handleDelete}>삭제</PrimaryButton>
```

### 문제 2: 복잡한 UI 관리 (Complex UI Management)
**문제 상황**:
수천 줄의 HTML/CSS/JS 코드가 한 파일에 있어서 유지보수가 어려움

**해결 방법**:
```jsx
// 작은 컴포넌트로 분리
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
}
```

각 컴포넌트를 독립적으로 개발하고 관리할 수 있습니다.

### 문제 3: 팀 협업 충돌 (Team Collaboration)
**문제 상황**:
여러 개발자가 같은 파일을 수정하면서 충돌 발생

**해결 방법**:
```
팀원 A: Header.jsx 작업
팀원 B: Sidebar.jsx 작업
팀원 C: Footer.jsx 작업
→ 파일이 분리되어 충돌 없음
```

### 문제 4: 테스트 어려움 (Testing Difficulty)
**문제 상황**:
전체 애플리케이션을 테스트해야 버튼 하나를 검증 가능

**해결 방법**:
```jsx
// 컴포넌트 단위로 독립 테스트 가능
test('Button renders correctly', () => {
  render(<Button text="클릭" />);
  expect(screen.getByText('클릭')).toBeInTheDocument();
});
```

## ⚙️ 작동 원리

### 1단계: 컴포넌트 정의

```jsx
// 함수형 컴포넌트 정의
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 또는 클래스형 컴포넌트
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 2단계: 컴포넌트 사용

```jsx
// JSX로 컴포넌트 사용
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

### 3단계: 렌더링 과정


### 4단계: State 변경 시 재렌더링

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 버튼 클릭 → State 변경 → 자동 재렌더링
  const handleClick = () => {
    setCount(count + 1);  // State 변경
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>증가</button>
    </div>
  );
}
```

### 라이프사이클


## 💻 코드 구현

### 예시 1: 기본 함수형 컴포넌트

```jsx
// UserCard.jsx
function UserCard({ name, email, role }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span className="role">{role}</span>
    </div>
  );
}

// 사용
function App() {
  return (
    <div>
      <UserCard
        name="홍길동"
        email="hong@example.com"
        role="개발자"
      />
      <UserCard
        name="김철수"
        email="kim@example.com"
        role="디자이너"
      />
    </div>
  );
}
```

### 예시 2: State를 가진 컴포넌트

```jsx
// TodoList.jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-list">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일 입력"
      />
      <button onClick={addTodo}>추가</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 예시 3: 컴포넌트 조합

```jsx
// Button.jsx
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Modal.jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-footer">
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}

// App.jsx - 컴포넌트 조합
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        모달 열기
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="알림"
      >
        <p>이것은 모달 내용입니다.</p>
        <Button onClick={() => alert('확인!')}>
          확인
        </Button>
      </Modal>
    </div>
  );
}
```

### 예시 4: Props 타입 검증

```jsx
import PropTypes from 'prop-types';

function UserProfile({ name, age, email, isAdmin }) {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      {isAdmin && <span className="badge">Admin</span>}
    </div>
  );
}

// Props 타입 정의
UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool
};

// 기본값 설정
UserProfile.defaultProps = {
  isAdmin: false
};
```

### 예시 5: Custom Hook으로 로직 재사용

```jsx
// useCounter.js - Custom Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Counter.jsx - Custom Hook 사용
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## 🔄 P3 프로젝트 적용 사례

### 사례 1: Dashboard 컴포넌트 분리

**Before (컴포넌트 없이)**:
```jsx
// 모든 코드가 한 파일에 2000줄
function Dashboard() {
  // 헤더 코드 200줄
  // 사이드바 코드 300줄
  // 차트 코드 500줄
  // 테이블 코드 400줄
  // 푸터 코드 100줄
  // ... 유지보수 악몽
}
```

**After (컴포넌트로 분리)**:
```jsx
// Dashboard.jsx - 50줄
function Dashboard() {
  return (
    <div className="dashboard">
      <DashboardHeader />
      <div className="dashboard-body">
        <Sidebar />
        <main>
          <MetricsChart data={metricsData} />
          <DataTable data={tableData} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

// DashboardHeader.jsx - 50줄
// Sidebar.jsx - 80줄
// MetricsChart.jsx - 150줄
// DataTable.jsx - 200줄
// Footer.jsx - 30줄
```

**결과**:
- 유지보수 시간: 3시간 → 30분
- 버그 발견률: 70% 향상
- 코드 재사용: 5개 페이지에서 동일 컴포넌트 사용

### 사례 2: Form 컴포넌트 재사용

```jsx
// FormInput.jsx - 재사용 가능한 입력 컴포넌트
function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required
}) {
  return (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// UserForm.jsx - FormInput 재사용
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  return (
    <form>
      <FormInput
        label="이름"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <FormInput
        label="이메일"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <FormInput
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
    </form>
  );
}
```

**결과**:
- Form 개발 시간: 2일 → 4시간
- 일관된 UI/UX
- 10개 Form에서 동일 컴포넌트 재사용

### 사례 3: Loading State 컴포넌트

```jsx
// LoadingSpinner.jsx
function LoadingSpinner({ size = 'medium', message }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
}

// DataFetcher.jsx - Loading 컴포넌트 활용
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner message="데이터 로딩 중..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <DataDisplay data={data} />;
}
```

**결과**:
- 로딩 상태 관리: 일관성 100%
- 사용자 경험 향상: 명확한 피드백

## 🎨 주요 프레임워크별 컴포넌트

### React
```jsx
function MyComponent() {
  return <div>Hello React</div>;
}
```

### Vue
```vue
<template>
  <div>Hello Vue</div>
</template>

<script>
export default {
  name: 'MyComponent'
}
</script>
```

### Angular
```typescript
@Component({
  selector: 'my-component',
  template: '<div>Hello Angular</div>'
})
export class MyComponent {}
```

### Svelte
```svelte
<script>
  let name = 'Svelte';
</script>

<div>Hello {name}</div>
```

## 📊 컴포넌트 vs 함수

| 구분 | 일반 함수 | 컴포넌트 |
|------|----------|----------|
| **목적** | 로직 처리 | UI 렌더링 |
| **반환값** | 데이터 | JSX/HTML |
| **재사용** | 코드 재사용 | UI 재사용 |
| **상태** | 없음 | State 관리 가능 |
| **렌더링** | 없음 | 자동 재렌더링 |

## ✅ 모범 사례 (Best Practices)

### 1. 단일 책임 원칙
```jsx
// ❌ 나쁜 예: 하나의 컴포넌트가 너무 많은 일을 함
function UserDashboard() {
  // 사용자 정보 + 통계 + 설정 + 알림 모두 처리
}

// ✅ 좋은 예: 역할별로 분리
function UserDashboard() {
  return (
    <>
      <UserProfile />
      <UserStats />
      <UserSettings />
      <Notifications />
    </>
  );
}
```

### 2. Props는 최소화
```jsx
// ❌ 나쁜 예: Props가 너무 많음
<UserCard
  name={name}
  email={email}
  age={age}
  phone={phone}
  address={address}
  company={company}
  // ... 10개 이상
/>

// ✅ 좋은 예: 객체로 묶기
<UserCard user={userData} />
```

### 3. 컴포넌트 이름은 명확하게
```jsx
// ❌ 나쁜 예
function Comp() {}
function Thing() {}

// ✅ 좋은 예
function UserProfileCard() {}
function ProductListItem() {}
```

### 4. 조건부 렌더링은 명확하게
```jsx
// ❌ 나쁜 예: 복잡한 삼항 연산자
return (
  <div>
    {isLoading ? <Spinner /> : hasError ? <Error /> : data ? <Content /> : null}
  </div>
);

// ✅ 좋은 예: Early return
if (isLoading) return <Spinner />;
if (hasError) return <Error />;
if (!data) return null;

return <Content data={data} />;
```

## 🔗 관련 용어
- [[React]]: 컴포넌트 기반 프론트엔드 라이브러리
- [[Props]]: 컴포넌트 간 데이터 전달 방식
- [[State]]: 컴포넌트 내부 상태 관리
- [[JSX]]: JavaScript XML, React 컴포넌트 문법
- [[Virtual DOM]]: 컴포넌트 렌더링 최적화
- [[Hooks]]: 함수형 컴포넌트의 State와 Lifecycle
- [[Vue]]: 컴포넌트 기반 프론트엔드 프레임워크
- [[Angular]]: 컴포넌트 기반 프론트엔드 프레임워크

---
*카테고리: 프로그래밍*
