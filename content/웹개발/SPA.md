# SPA (Single Page Application)

## 📝 정의
SPA는 **하나의 HTML 페이지로 작동하는 웹 애플리케이션**입니다. 페이지 전체를 다시 로드하지 않고 동적으로 내용을 변경합니다.

### 핵심 개념
- 한 페이지에서 모든 것
- JavaScript로 동적 업데이트
- 빠른 사용자 경험

## 💡 예시

```javascript
// React SPA
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
        </BrowserRouter>
    );
}
// 페이지 이동 시 새로고침 없음!
```

## 🎯 장단점

**장점**:
- 빠른 페이지 전환
- 앱 같은 경험
- API로 분리 가능

**단점**:
- 초기 로딩 느림
- SEO 어려움
- 브라우저 히스토리 관리 복잡

## 🔗 관련 용어
- [[CSR]]: SPA의 렌더링 방식
- [[Frontend]]: SPA는 프론트엔드 패턴

---
*카테고리: 웹개발*
