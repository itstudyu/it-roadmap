# Frontend (프론트엔드)

## 📝 정의
Frontend는 **사용자가 직접 보고 상호작용하는 부분**입니다. 웹사이트의 화면과 사용자 경험을 담당합니다.

### 핵심 기술
- HTML: 구조
- CSS: 디자인
- JavaScript: 동작

## 💡 예시

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .button { background: blue; color: white; }
    </style>
</head>
<body>
    <button class="button" onclick="alert('클릭!')">
        클릭하세요
    </button>
</body>
</html>
```

```javascript
// React 컴포넌트
function Button() {
    return <button onClick={() => alert('클릭!')}>클릭하세요</button>;
}
```

## 🎯 주요 프레임워크
- React
- Vue
- Angular

## 🔗 관련 용어
- [[Backend]]: 서버 측 개발
- [[SPA]]: 프론트엔드 패턴

---
*카테고리: 웹개발*
