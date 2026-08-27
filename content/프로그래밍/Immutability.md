# Immutability (불변성)

## 📝 정의

불변성은 **한 번 만든 값을 고치지 않는** 성질이다.

바꾸지 못하게 막아 두는 것이 아니라, 바꿀 일이 생기면 그 자리를 손보는 대신 새 값을 만들어 돌려주는 것이다. Go 언어는 문자열을 아예 이렇게 못 박는다 — "문자열 타입의 값은 불변이다". 그래서 문자열의 일부를 갈아 끼우는 함수도 원본을 고치지 못하고, 자기 설명에 "s 의 복사본을 돌려준다" 고 적는다.

### 이름
Im :: 아니다
Mutable :: 바꿀 수 있는
= 붙여 읽으면 "바꿀 수 없는". 값에 손을 못 대니 새로 만들 수밖에 없다

### 비유
볼펜으로 쓴 장부. 틀린 줄을 지울 수 없으니 아래에 새 줄을 쓰고, 먼저 쓴 줄은 그대로 남는다.

### 예
문자열을 대문자로 바꾸는 함수를 부르면 새 문자열이 나온다. 돌려받은 값을 안 챙기면 원래 문자열은 그대로다.

## 🖼️ 그림으로 보기

```도해
대조: 값을 바꾸면 옛 값은 어떻게 되나
고칠 수 있는 값 |=| 못 고치는 값
바꾸는 법 :: 그 자리를 고친다 || 새 값을 만든다
바꾼 뒤 옛 값 :: 사라진다 || 그대로 남는다
이름이 보는 곳 :: 그대로다 || 새 값으로 옮긴다
= 불변성은 값을 고치는 대신 새 값을 만들고, 옛 값은 그대로 두는 성질이다
```

## ⚠️ 해결하는 문제

```도해
대조: 값을 아무 데서나 고칠 수 있으면 무엇이 곤란한가
막지 않으면 || 못 고치게 하면
같은 값을 든 둘 :: 한쪽이 고치면 다 || 서로 영향 없다
남에게 넘길 때 :: 복사해서 줘야 한다 || 그대로 줘도 된다
여러 갈래가 쓸 때 :: 잠금을 걸어야 한다 || 그냥 나눠 쓴다
= 못 고치는 값은 누구에게 줘도 안전하다. 지켜야 할 것이 없어서다
```

값 하나를 여러 자리에서 들고 있다가 한쪽이 그것을 고치면, 나머지 자리는 자기가 손대지도 않은 값이 달라진 채로 일을 계속한다. 안드로이드 앱 구조 문서가 이 상황을 "같은 정보에 대한 참이 여러 개가 되는 일" 이라 부르고, 그 결과가 앞뒤가 안 맞는 값과 잡기 어려운 버그라고 적는다.

불변성은 넘겨줄 때 지킬 것을 없앤다. 같은 문서가 아래층에서 내주는 값은 불변이어야 다른 쪽이 손댈 수 없어 값이 어긋날 위험이 사라지고, 덧붙여 **불변인 값은 여러 갈래가 동시에 다뤄도 안전하다**고 못 박는다. 복사해서 주지 않아도 되고, 잠금을 걸지 않아도 된다.

## ✅ 장단점

**얻는 것**
- 값을 넘겨줄 때 방어용 복사본을 만들지 않아도 된다. 받는 쪽이 고칠 수 없어서다.
- 여러 갈래가 같은 값을 동시에 읽어도 잠금이 필요 없다.
- "언제 누가 이 값을 바꿨나" 를 뒤질 일이 없다. 바뀐 적이 없기 때문이다.

**내주는 것**
- 바꿀 때마다 값이 하나씩 새로 생긴다. Go 문서도 문자열을 복제하면 새로 자리를 잡는다고 적는다.
- 큰 값의 한 귀퉁이만 자주 고치는 일은 고쳐 쓰는 쪽이 값싸다.

## 💡 실제 사례

- **화면 상태** — 화면이 그릴 상태를 불변 객체로 두고, 바꿀 때는 복사본을 새로 만들어 통째로 갈아 끼운다. 안드로이드 앱 구조 문서가 이 방식을 표준으로 적는다.
- **여러 갈래가 함께 읽는 값** — 불변이면 잠금 없이 나눠 쓴다. 고칠 수 있는 값을 캐시에 두면 그 자리에 잠금을 걸어야 한다.
- **문자열 다루기** — 일부를 갈아 끼우거나 대문자로 바꾸면 원본은 그대로 두고 새 문자열이 나온다.

## 🚫 흔한 오해

- **못 바꾸게 선언하면 불변이다** — 아니다. 그건 이름이 다른 것을 가리키지 못하게 묶는 것이지 가리키는 대상 속까지 잠그지 않는다. 코틀린 문서는 `val` 에 담은 목록도 항목을 더 넣고 뺄 수 있다고 못 박는다.
- **불변이 항상 낫다** — 바꿀 때마다 새 값이 생기니 그만큼 자리를 새로 잡는다. 큰 값을 잦게 고치는 자리에서는 그 자리를 고쳐 쓰는 편이 맞다.
- **불변이면 화면 값이 안 변한다** — 변하는 것은 값이 아니라 이름이 보는 곳이다. 새 값을 만들어 이름을 그쪽으로 옮기면, 다음에 읽는 쪽에는 바뀐 것으로 보인다.

## 📝 정리

**"한 번 만들면 고치지 않는 그 성질"** 이라고 읽으면 된다. 값을 고치는 대신 새 값을 만들고 옛 값은 자리에 남기는 것이 전부이고, 그 덕에 남에게 그냥 넘겨도 되고 여러 갈래가 같이 읽어도 된다. 이름을 못 바꾸게 묶는 것과는 다른 이야기다.

## 🧒 열 살에게

볼펜으로 쓴 일기장 알지? 한 번 쓰면 못 지우니까, 틀렸으면 아래에 새로 쓰고 위에 쓴 건 그냥 둬. 그래서 동생이 몰래 봐도 네가 쓴 줄을 고칠 수가 없고, 언제 뭐가 달라졌는지 나중에 봐도 다 남아 있어.

## ❓ 이해했는지

- 못 고치는 값에서 한 글자만 바꾸면 무엇이 새로 생기나 → 그림
- 같은 값을 두 곳이 들고 있는데 한쪽이 고쳐도 다른 쪽이 멀쩡한 이유는 무엇인가 → 해결하는 문제
- 이름을 못 바꾸게 묶어 뒀는데도 그 안의 목록에 항목이 늘어나는 일이 왜 생기나 → 흔한 오해

## 🔗 관련 용어

- [[Functional Programming]] — 값을 고치지 않는다는 이 규칙을 짜기 방식으로 삼은 갈래
- [[Variable]] — 이름과 값을 잇는 자리. 불변성은 그중 값 쪽을 잠근다
- [[Immutable Infrastructure]] — 같은 생각을 서버에 옮겨, 고치는 대신 새로 만들어 갈아 끼운다
- [[Event Sourcing]] — 상태를 덮어쓰지 않고 일어난 일을 덧붙여 쌓는 저장 방식

---

**출처**

- https://pkg.go.dev/builtin (Go — builtin 패키지. `string`: "Values of string type are immutable.")
- https://pkg.go.dev/strings (Go — strings 패키지. `Replace`: "returns a copy of the string s with …", `Clone`: "returns a fresh copy of s. It guarantees to make a copy of s into a new allocation")
- https://kotlinlang.org/docs/collections-overview.html (Kotlin Docs — Collections overview. "a mutable collection doesn't have to be assigned to a `val`. Write operations with a mutable collection are still possible even if it is assigned to a `val`. The benefit … is that you protect the reference … from modification")
- https://kotlinlang.org/docs/basic-syntax.html (Kotlin Docs — Basic syntax. `val` 은 한 번만 대입하는 읽기 전용, `var` 는 다시 대입할 수 있는 이름)
- https://developer.android.com/topic/architecture/data-layer (Android Developers — Data layer. "The data exposed by this layer should be immutable so that it cannot be tampered with by other classes, which would risk putting its values in an inconsistent state. Immutable data can also be safely handled by multiple threads.")
- https://developer.android.com/topic/architecture/ui-layer (Android Developers — UI layer. "immutable objects provide guarantees regarding the state of the application at an instant in time"; 위반 시 "multiple sources of truth for the same piece of information, leading to data inconsistencies and subtle bugs"; `.copy()` 로 새 인스턴스를 만들어 갈아 끼운다)
