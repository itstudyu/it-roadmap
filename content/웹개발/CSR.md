# CSR (Client Side Rendering)

## 📝 정의
CSR은 **브라우저(클라이언트)에서 페이지를 렌더링하는 방식**입니다. JavaScript가 HTML을 동적으로 생성합니다.

### 작동 방식
1. 빈 HTML 다운로드
2. JavaScript 다운로드
3. JavaScript가 페이지 생성
4. 사용자에게 표시

## 💡 예시

```html
<!-- 서버에서 받는 HTML (거의 비어있음) -->
<!DOCTYPE html>
<html>
<body>
    <div id="root"></div>
    <script src="bundle.js"></script>
</body>
</html>
```

```javascript
// JavaScript가 페이지 생성
ReactDOM.render(<App />, document.getElementById('root'));
```

## 🎯 장단점

**장점**:
- 서버 부담 적음
- 빠른 페이지 전환

**단점**:
- 초기 로딩 느림
- SEO 불리

## 🔗 관련 용어
- [[SSR]]: 서버에서 렌더링
- [[SPA]]: CSR 사용

---
*카테고리: 웹개발*
