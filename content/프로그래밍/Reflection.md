# Reflection (리플렉션)

## 📝 정의

리플렉션은 **제 구조를 실행 중에 들여다보는** 기능이다.

코틀린 문서는 이것을 "실행 중에 프로그램의 구조를 들여다보게 해 주는 언어·라이브러리 기능의 묶음" 으로 적는다. 고(Go) 문서는 같은 것을 쓰임새 쪽에서 적는다 — "실행 중 리플렉션을 구현해, 프로그램이 임의의 타입을 가진 값을 다룰 수 있게 한다". 어떤 타입이 올지 미리 모르고 짠 코드가 실행 중에 그것을 알아내는 자리다.

### 이름
Reflect :: 비춰 보다
-ion :: 그렇게 하는 일
= 붙여 읽으면 "제 모습을 비춰 보는 일". 거울에 비치는 것이 자기 구조다

### 비유
거울. 자기가 지금 어떤 모습인지는 눈으로 못 보고 비춰 봐야 알 수 있다.

### 예
객체를 그냥 넘겼을 뿐인데 필드 이름이 그대로 키가 되어 저장 형식으로 나오는 그 순간이다.

## 🖼️ 그림으로 보기

```도해
흐름: 무슨 타입이 올지 모르고 짠 코드가 값을 어떻게 다루나
쓰는 쪽 :: 아무 타입의 값이나 하나 건넨다
비추기 :: 그 값의 타입과 알맹이를 꺼내 본다
읽기 :: 필드 이름·타입·꼬리표를 하나씩 훑는다
다루기 :: 이름으로 값을 읽고, 되는 자리면 넣는다
< 쓰는 쪽 :: 타입마다 짜지 않고도 결과를 돌려받는다
= 미리 모르던 구조를 실행 중에 비춰 읽어서, 그 자리에서 다룬다
```

## ⚠️ 해결하는 문제

```도해
대조: 어떤 타입이 올지 미리 모르면 무엇이 곤란한가
비춰 볼 수 없으면 || 비춰 볼 수 있으면
새 타입이 생기면 :: 그 타입 코드를 짠다 || 그대로 돌아간다
저장하는 코드 :: 타입마다 하나씩 || 하나로 끝난다
필드 이름 :: 손으로 적어 둔다 || 값에서 읽는다
= 실행 중에 구조를 읽을 수 있으면, 타입마다 같은 코드를 다시 짤 일이 없다
```

값을 저장 형식으로 바꾸는 코드를 생각해 보자. 비춰 볼 방법이 없으면 이 코드는 어떤 타입이 올지 미리 다 알아야 한다. 타입이 하나 늘 때마다 그 타입 전용으로 필드를 하나씩 적어 넣는 코드를 또 짜야 하고, 필드 이름을 바꾸면 두 군데를 같이 고쳐야 한다.

리플렉션은 그 정보를 값 자신에게 물어본다. 고 문서는 구조체 필드에 붙이는 꼬리표(필드 옆에 적어 두는 짧은 문자열)의 표기를 `key:"value"` 꼴로 정해 두고, 저장 형식으로 바꾸는 표준 패키지는 필드 이름을 그대로 키로 쓰되 그 꼬리표에 적힌 이름이 있으면 그것을 쓴다고 적는다. 그래서 한 번 짠 코드가 아직 세상에 없는 타입까지 다룬다.

## ⚙️ 작동 원리

고 문서는 값을 넘기면 그것을 둘로 갈라 보여준다. 하나는 타입 쪽이고 하나는 알맹이 쪽이다. `TypeOf` 는 넘어온 값의 실제 타입을, `ValueOf` 는 그 안에 든 값을 돌려주고, `Kind` 는 그것이 구조체인지 슬라이스인지 같은 갈래를 말해 준다. 갈래를 알면 필드를 셀 수 있고, 필드마다 이름·타입·꼬리표를 꺼낼 수 있다.

코틀린 쪽은 이름을 그대로 가리키는 문법을 준다. `MyClass::class` 라고 쓰면 그 클래스를 가리키는 값이 나오고, 값에서 `값::class` 로도 얻을 수 있다. 함수와 프로퍼티도 같은 방식으로 가리켜서 이름과 타입을 실행 중에 물어볼 수 있는데, 문서는 함수와 프로퍼티가 일급 시민이라 이런 되묻기가 가능하다고 적는다.

## 🚨 주의사항

- **틀려도 컴파일러가 안 잡는다.** 고 문서는 못 고치는 자리에 값을 넣으려 하면 그 자리에서 프로그램이 멈춘다고 적는다. 컴파일할 때 걸리던 실수가 실행 중으로 미뤄진다.
- **밖에 안 내놓은 필드는 그대로 안 열린다.** 고 문서는 그런 필드에서 얻은 값은 꺼내 쓰려 해도, 바꾸려 해도 멈춘다고 못 박는다. 비춰 본다고 담이 없어지는 것은 아니다.
- **짐이 따라온다.** 코틀린은 JVM 에서 이 기능의 런타임을 별도 아티팩트로 떼어 두고, 쓰려면 의존성을 더하게 한다. 안 쓰는 앱의 런타임 크기를 줄이려는 조치라고 문서가 밝힌다.

## 💡 실제 사례

- **저장 형식으로 바꾸기** — 고 표준 패키지는 구조체 필드 이름을 그대로 키로 쓰고, 필드에 붙은 꼬리표에 다른 이름이 적혀 있으면 그것을 쓴다고 문서가 적는다.
- **함수를 값처럼 넘기기** — 코틀린은 함수 이름 앞에 `::` 를 붙여 그 함수를 가리키는 값을 만들고, 다른 함수에 그대로 넘긴다.
- **무엇이 왔는지 찍어 보기** — 코틀린 문서의 예가 값에서 클래스를 꺼내 그 이름을 확인 실패 메시지에 적는다. 어떤 것이 왔는지를 실행 중에 이름으로 남긴다.

## 🚫 흔한 오해

- **비춰 보면 남의 비밀 필드까지 다 열린다** — 고 문서는 밖에 안 내놓은 필드에서 얻은 값은 꺼내 쓸 수도, 바꿀 수도 없다고 적는다. 구조를 읽는 것과 담을 넘는 것은 다른 일이다.
- **타입을 다루니 컴파일이 대신 검사해 준다** — 반대다. 컴파일할 때 끝나던 판정을 실행 중으로 미루는 일이라, 틀리면 그 자리에서 프로그램이 멈춘다.
- **되도록 비춰 보게 짜면 유연해진다** — 안 쓰는 프로그램까지 짐을 진다. 코틀린이 JVM 에서 이 기능의 런타임을 아예 떼어 둔 이유가 그것이다. 미리 정할 수 있는 것은 미리 정하는 편이 낫다.

## 📝 정리

**"제 구조를 실행 중에 비춰 보는 일"** 이라고 읽으면 된다. 어떤 타입이 올지 모르고 짠 코드가 값에게 이름과 타입을 직접 물어보기 때문에, 아직 없는 타입까지 한 코드로 다룰 수 있다. 대신 컴파일러가 봐 주던 검사가 실행 중으로 미뤄지고, 안 쓰는 쪽에도 짐이 남는다.

## 🧒 열 살에게

네가 지금 어떻게 생겼는지는 눈으로 직접 못 보지? 거울 앞에 서야 머리가 헝클어졌는지 알 수 있어. 어떤 물건은 스스로 거울을 볼 줄 알아서, 처음 보는 물건이 와도 "너는 이런 모양이구나" 하고 알아본 다음에 다룰 수 있어.

## ❓ 이해했는지

- 아직 세상에 없는 타입까지 한 코드로 저장할 수 있는 이유는 무엇인가 → 해결하는 문제
- 값에게 필드 이름을 물어볼 때 실제로 무엇을 꺼내 보는가 → 작동 원리
- 이 기능을 안 쓰는 앱까지 짐을 지지 않게 하려고 무엇을 해 두었나 → 주의사항

## 🔗 관련 용어

- [[Type System]] — 타입을 언제 판정하나. 리플렉션은 그 판정을 실행 중으로 미룬다
- [[Serialization]] — 값을 저장·전송 형태로 바꾸는 일. 필드 이름을 여기서 읽어 온다
- [[Generic]] — 타입을 미리 안 정하고 짜는 다른 길. 이쪽은 컴파일할 때 정해진다
- [[Class]] — 실행 중에 물어보는 대상. 이름·필드·함수가 여기 담겨 있다

---

**출처**

- https://pkg.go.dev/reflect (Go — reflect 패키지. "Package reflect implements run-time reflection, allowing a program to manipulate objects with arbitrary types."; `Type` 은 "the representation of a Go type", `Value` 는 "the reflection interface to a Go value"; `TypeOf` 는 인터페이스 값의 동적 타입을, `ValueOf` 는 "a new Value initialized to the concrete value stored in the interface i" 를 돌려준다; `Kind` 는 "the specific kind of type that a Type represents"; `StructTag` — "By convention, tag strings are a concatenation of optionally space-separated key:\"value\" pairs", encoding/json 이 이 규약을 읽는다; `Value.Interface` 는 "panics if the Value was obtained by accessing unexported struct fields"; `Value.Set` 은 "panics if CanSet returns false … must not be derived from an unexported field"; "A Value can be changed only if it is addressable and was not obtained by the use of unexported struct fields.")
- https://pkg.go.dev/encoding/json (Go — encoding/json 패키지. 구조체를 바꿀 때 "using the field name as the object key"; "The encoding of each struct field can be customized by the format string stored under the \"json\" key in the struct field's tag." — reflect 의 꼬리표 규약을 실제로 읽는 쪽)
- https://kotlinlang.org/docs/reflection.html (Kotlin Docs — Reflection. "Reflection is a set of language and library features that allows you to introspect the structure of your program at runtime."; "Functions and properties are first-class citizens in Kotlin, and the ability to introspect them (for example, learning the name or the type of a property or function at runtime) is essential"; `MyClass::class` 로 `KClass` 를 얻고, `widget::class.qualifiedName` 처럼 값에서도 얻는다; JVM 에서 리플렉션 런타임은 별도 아티팩트 `kotlin-reflect.jar` 이고 "This is done to reduce the required size of the runtime library for applications that do not use reflection features" — 쓰려면 `implementation(kotlin("reflect"))` 의존성을 더한다; 함수 참조 `::isOdd`, 프로퍼티 참조 `::x`)
