# JavaScript (자바스크립트)

## 📝 정의

JavaScript는 **브라우저에서 페이지의 동작을 맡는 프로그래밍 언어**다.

규격보다 언어가 먼저였다. 브렌던 아이크가 넷스케이프에서 만들어 Navigator 2.0 브라우저에 처음 실렸고, 그 뒤 1997년에 ECMA-262 라는 규격 문서로 정리됐다. 규격 이름과 언어 이름이 다른 이유가 여기 있다.

### 비유
전등 스위치. 방과 벽지는 그대로 있는데, 불이 켜지고 꺼지는 일은 스위치가 있을 때만 생긴다.

### 예
검색창에 글자를 치는 동안 아래로 추천어가 따라 내려오는 그 움직임을 맡는 쪽이다.

## 🖼️ 그림으로 보기

```도해
층: 한 페이지에서 HTML·CSS·JavaScript 는 각각 무엇을 맡나
JavaScript :: 동작. 누르면 무엇이 달라지나
CSS :: 생김새. 색·글꼴·자리를 정한다
HTML :: 뜻. 제목인지 문단인지 표인지
= 아래가 있어야 위가 성립한다. 그중 움직임을 맡는 층이 JavaScript 다
```

## ⚠️ 해결하는 문제

```도해
대조: JavaScript 가 없으면 웹 페이지는 어떻게 되나
JavaScript 없이 || JavaScript 로
시계 :: 새로고침해야 바뀐다 || 초가 흘러간다
화면 갱신 :: 문서를 새로 받는다 || 바뀐 데만 고친다
지도·그래프 :: 그림 한 장뿐 || 끌고 확대한다
= 문서를 다시 받지 않고 그 자리에서 고치는 일, 그게 이 언어의 몫이다
```

MDN 은 이 언어를 "웹 페이지에 복잡한 기능을 넣을 수 있게 하는 언어" 라고 적어두었다. 그리고 판정 기준을 함께 준다 — 페이지가 가만히 앉아 정적인 정보만 보여주는 것 이상을 할 때는 대개 JavaScript 가 끼어 있다는 것이다.

바꿔 말하면, HTML 과 CSS 만으로 만든 페이지는 받은 그대로 멈춰 있다. 무언가를 누르거나 입력해서 화면이 달라지려면 문서를 서버에서 다시 받아 와야 한다. JavaScript 는 **받아 둔 문서를 그 자리에서 고칠 수 있는 자리**를 하나 만들어 이 왕복을 없앤다.

## 🧱 구성

```도해
층: 브라우저에서 JavaScript 한 줄은 무엇에 실려 도나
내 코드 :: 내가 쓴 스크립트
브라우저 API :: `document`·`fetch` 같은 것들
언어 자체 :: 문법과 내장 객체. ECMAScript 가 정한다
엔진 :: 읽어서 이진 형식으로 바꿔 돈다
= 문법은 규격이 정하고, 화면을 만질 힘은 브라우저가 얹어 준다
```

## ⚙️ 작동 원리

규격은 언어의 속만 정한다. ECMA-262 의 범위 조항은 "이 표준은 ECMAScript 라는 범용 프로그래밍 언어를 정의한다" 한 줄이고, `document` 나 `fetch` 같은 것은 여기 없다.

그 나머지를 주는 쪽이 브라우저다. 규격은 이것을 **host environment(호스트 환경)** 라고 부르면서, 웹 브라우저가 창·메뉴·팝업·대화상자·글 상자·이력·쿠키·입출력을 나타내는 객체들을 제공한다고 적어두었다. 그리고 ECMAScript 를 지원하는 브라우저와 서버는 **각자 자기 호스트 환경을 공급해서 실행 환경을 완성한다**고 못 박는다. 그래서 같은 문법이 브라우저 밖에서도 도는데, [[DOM]] 을 붙잡는 `document` 는 브라우저 안에서만 있다.

엔진이 그 코드를 실제로 돌린다. MDN 은 JavaScript 를 인터프리터 언어로 부르면서도, 요즘 인터프리터는 대개 **just-in-time 컴파일**을 써서 돌리는 중에 소스를 더 빠른 이진 형식으로 바꾼다고 적었다. 컴파일을 안 하는 것이 아니라 미리 하지 않는 것이다.

## 📊 비교: ECMAScript 와 JavaScript

| | ECMAScript | JavaScript |
|---|---|---|
| **정체** | 규격 문서 (ECMA-262) | 그 규격대로 도는 언어 |
| **정하는 곳** | Ecma International 의 TC39 | 브라우저·런타임을 만드는 쪽이 구현 |
| **담는 범위** | 문법과 내장 객체까지 | 여기에 브라우저가 준 API 를 더한 것 |
| **나온 순서** | 1997년 1판. 2016년판부터 해마다 한 판 | 규격보다 먼저 있었다 (Navigator 2.0) |

규격 쪽 문서는 이 관계를 스스로 밝혀둔다 — ECMAScript 는 여러 기술에서 나왔고 그중 가장 잘 알려진 것이 넷스케이프의 JavaScript 와 마이크로소프트의 JScript 라는 것이다. 표준이 먼저 있고 구현이 따라온 것이 아니라, 서로 다른 구현이 먼저 퍼진 뒤에 그 공통분모를 표준으로 묶었다.

## 💡 실제 사례

- **입력 검사** — 이메일 칸을 비운 채 보내기를 누르면 서버에 가기 전에 그 자리에서 빨간 글씨가 붙는다.
- **끝없이 이어지는 목록** — 아래로 내릴 때마다 다음 묶음만 받아 와 이어 붙인다. 주소는 그대로다.
- **브라우저 밖에서 쓰는 같은 언어** — 규격이 브라우저에 묶여 있지 않아서 서버와 임베디드에서도 널리 쓰인다. Node.js 가 대표적이다.

## 🚫 흔한 오해

- **Java 를 줄여 부르는 말이다** — 다른 언어다. 이 언어는 넷스케이프에서 만들어 Navigator 2.0 에 처음 실렸고, 규격 이름도 Java 가 아니라 ECMAScript 다.
- **인터프리터 언어니까 컴파일을 안 한다** — 요즘 엔진은 돌리는 중에 소스를 이진 형식으로 컴파일한다. 미리 컴파일하지 않는다는 뜻일 뿐이다. [[Compile vs Interpret]] 의 경계가 여기서 흐려진다.
- **움직이는 것은 다 JavaScript 로 만든다** — 아니다. MDN 은 가능한 한 애니메이션을 CSS 전환·애니메이션으로 만들라고 권한다. 레이아웃과 페인트를 건드리지 않는 속성이면 브라우저가 그 계산을 화면을 그리는 주 흐름에서 빼내 GPU 에 맡길 수 있어서다.

## 📝 정리

JavaScript 는 브라우저에서 페이지의 동작을 맡는 언어다. 문법과 내장 객체는 ECMA-262 규격이 정하고, 화면과 네트워크를 만질 힘은 브라우저가 호스트 환경으로 얹어 준다. 그래서 같은 문법이 브라우저 밖에서도 도는데 `document` 는 브라우저 안에서만 있다.

## ❓ 이해했는지

- Java 와 이름만 닮았을 뿐 관계가 없다는 근거는 무엇인가 → 흔한 오해
- 같은 코드가 서버에서도 도는데 그 안에서 `document` 를 못 쓰는 까닭은 → 작동 원리
- 페이지의 글꼴을 바꾸는 일을 이 언어가 맡지 않는 까닭은 → 그림

## 🔗 관련 용어

- [[HTML]] — 같은 페이지에서 뜻과 뼈대를 맡는 층
- [[CSS]] — 같은 페이지에서 생김새를 맡는 층
- [[DOM]] — 스크립트가 화면을 만질 때 붙잡는 손잡이
- [[Compile vs Interpret]] — 이 언어를 인터프리터 쪽으로 부르는 까닭이 여기 있다
- [[Service Worker]] — 브라우저가 준 실행 자리 가운데 화면 밖에서 도는 것

---

**출처**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript (JavaScript — MDN)
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript (What is JavaScript? — MDN)
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance (CSS and JavaScript animation performance — MDN)
- https://ecma-international.org/publications-and-standards/standards/ecma-262/ (ECMA-262 — Ecma International)
- https://262.ecma-international.org/ (ECMAScript 2026 Language Specification, Introduction · 1 Scope · 4.1 Web Scripting — Ecma International)
