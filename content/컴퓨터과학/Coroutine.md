# Coroutine (코루틴)

## 📝 정의

코루틴은 **멈췄다가 이어서 하는** 일감이다.

코틀린 문서는 이것을 "정지할 수 있는 계산" 이라고 적고, 그 덕분에 동시에 도는 코드를 위에서 아래로 읽히는 모양 그대로 쓸 수 있다고 한다. 안드로이드 문서는 같은 것을 "비동기로 도는 코드를 단순하게 만드는 동시성 설계 패턴" 이라고 부른다. 앞의 것은 무엇인지를, 뒤의 것은 무엇에 쓰는지를 말한다.

### 비유
라면 물이 끓기를 기다리는 동안 불 앞에 서 있지 않고 그 시간에 반찬을 꺼내 놓는 요리사와 같다.

### 예
버튼을 눌러 목록을 불러오는 동안에도 화면이 굳지 않고 그대로 스크롤되는 그 순간이다.

## 🖼️ 그림으로 보기

```도해
흐름: 코루틴은 기다리는 동안 무엇을 하나
코루틴 :: 하던 일을 하다 기다릴 일을 만난다
멈춤 :: 어디까지 했는지 적어 두고 스스로 멈춘다
스레드 :: 붙잡히지 않고 풀려나 다른 코루틴을 돌린다
기다리던 일 :: 응답이 오거나 시간이 다 된다
< 코루틴 :: 적어 둔 자리에서 이어 한다. 아까 그 스레드가 아니어도 된다
= 기다리는 동안 자리를 비켜 준다. 멈춘 자리를 기억하니 이어서 할 수 있다
```

## ⚠️ 해결하는 문제

```도해
대조: 기다리는 동안 스레드를 붙잡고 있으면 무엇이 곤란한가
스레드를 붙잡으면 || 코루틴으로 멈추면
기다리는 동안 :: 그 스레드는 논다 || 다른 일을 돌린다
5만 개를 띄우면 :: 100GB까지 든다 || 500MB쯤 든다
화면 담당이 막히면 :: 앱이 굳는다 || 계속 움직인다
= 기다림은 자리를 지키는 일이 아니다. 비켜 주는 일이다
```

기다리는 방식에는 두 가지가 있다. 하나는 응답이 올 때까지 그 스레드를 붙잡고 있는 것이고, 다른 하나는 자리를 비켜 주고 물러나는 것이다. 앞의 방식이 비싼 이유는 스레드가 비싸기 때문이다. 코틀린 문서는 스레드를 만들 때마다 운영체제가 스택으로 쓸 메모리를 떼어 주고 스레드 사이를 오갈 때 커널이 나선다고 적는다. 그래서 스레드 하나가 보통 몇 메가바이트를 쓰고, JVM 이 한 번에 다룰 수 있는 스레드는 대개 수천 개다.

코루틴은 특정 스레드에 묶여 있지 않다. 멈추는 동안 그 스레드는 막히지 않고 남아서 다른 일을 돌린다. 코틀린 문서가 든 예에서 5만 개를 각각 5초씩 기다리게 하면 코루틴은 500MB 쯤으로 끝나지만 같은 수의 스레드는 100GB 까지 필요해서, 설정에 따라 메모리 부족으로 죽거나 스레드 만들기가 느려진다. 안드로이드 문서가 코루틴을 "가볍다" 고 적는 것도 같은 이야기다 — 막지 않고 멈추기 때문에 한 스레드 위에서 많은 수를 굴릴 수 있다.

## ⚙️ 작동 원리

코루틴의 가장 작은 부품은 **정지 함수**다. `suspend` 를 붙인 함수는 하던 일을 잠시 멈췄다가 나중에 이어 할 수 있고, 코틀린 문서는 이 표시가 코드의 구조를 바꾸지 않는다는 점을 강조한다. 대신 규칙이 하나 붙는다 — 정지 함수는 다른 정지 함수 안에서만 부를 수 있다. 그래서 시작점인 `main()` 에 `suspend` 를 붙이거나, 그럴 수 없는 곳에서는 스레드를 막아 가며 부르는 `runBlocking()` 을 쓴다.

코루틴 하나를 띄우려면 정지 함수와, 그것이 돌 [[Scope]](이름이 살아 있는 범위)에 해당하는 코루틴 스코프와, 시작을 지시하는 빌더와, 어느 스레드를 쓸지 정하는 디스패처가 있어야 한다. 빌더는 둘이 대표적이다. `launch()` 는 결과를 안 쓸 일을 띄우고 `Job` 손잡이를 돌려주며, `async()` 는 나중에 받을 결과를 뜻하는 `Deferred` 를 돌려주어 `await()` 로 그 값이 준비될 때까지 멈춰 기다린다. 디스패처 중 `Dispatchers.Default` 는 CPU 코어 수만큼(최소 둘) 스레드를 둔 공용 풀에서 돌린다.

`suspend` 키워드 자체는 언어에 들어 있지만 나머지 기능은 대부분 `kotlinx.coroutines` 라이브러리가 준다. 코틀린 문서가 코루틴을 쓰려면 그 라이브러리를 의존성에 넣으라고 적는 이유다.

## 💡 실제 사례

- **화면을 막지 않고 불러오기** — 안드로이드 문서는 메인 스레드에서 요청을 보내면 화면이 그동안 멈춰 "응답 없음" 창까지 뜬다고 적고, 그 일을 코루틴으로 옮겨 화면을 놓아주라고 한다.
- **한꺼번에 아주 많이 띄우기** — 코틀린 문서의 예제는 코루틴 5만 개가 각자 5초를 기다렸다가 점을 하나씩 찍는다. 같은 수의 스레드로 같은 일을 하면 메모리가 200배쯤 든다.
- **여러 곳에 동시에 물어보고 다 모으기** — `async()` 로 둘을 띄워 두고 `await()` 로 각각의 결과를 받으면, 두 기다림이 겹쳐서 하나씩 하는 것보다 빨리 끝난다.

## 🚫 흔한 오해

- **코루틴은 그냥 가벼운 스레드다** — 스레드가 아니다. 코틀린 문서는 코루틴이 특정 스레드에 묶이지 않아서 한 스레드에서 멈췄다가 다른 스레드에서 이어질 수 있다고 적는다. 스레드는 운영체제가 관리하고, 코루틴은 그 위에 얹혀 돈다.
- **코루틴을 쓰면 뭐든 빨라진다** — 코루틴이 줄이는 것은 기다리는 동안 붙잡히는 자리이지 계산량이 아니다. JVM 과 네이티브에서는 코루틴도 결국 운영체제가 관리하는 스레드 위에서 돌기 때문에, 계산이 무거운 일은 코어 수를 넘어서 빨라지지 않는다.
- **정지 함수는 아무 데서나 부르면 된다** — 코틀린 문서는 정지 함수를 다른 정지 함수 안에서만 부를 수 있다고 못 박는다. 보통 함수 안에서 부르면 컴파일이 안 된다.

## 📝 정리

**"기다릴 때 자리를 비켜 주는 그 일감"** 이라고 읽으면 된다. 멈춘 자리를 적어 두기 때문에 다른 스레드에서 이어 해도 되고, 멈추는 동안 스레드가 풀려나기 때문에 수만 개를 띄워도 견딘다. 붙잡지 않고 멈춘다는 것 하나가 나머지를 다 만든다.

## 🧒 열 살에게

라면 물이 끓기를 기다릴 때 불 앞에 가만히 서 있으면 그 시간이 아깝지? 그래서 물이 끓는 동안 계란을 꺼내 놓고, 물이 끓으면 다시 라면으로 돌아와. 어디까지 했는지 기억해 두면 왔다 갔다 해도 안 헷갈려.

## ❓ 이해했는지

- 5만 개를 띄워도 견디는데 스레드 5만 개는 왜 못 견디나 → 해결하는 문제
- 멈췄던 코루틴이 아까와 다른 스레드에서 이어져도 되는 이유는 무엇인가 → 흔한 오해
- 정지 함수를 보통 함수 안에서 부르면 어떻게 되나 → 작동 원리

## 🔗 관련 용어

- [[Thread]] — 코루틴이 올라타 도는 실행 단위. 코루틴은 이것을 붙잡지 않는다
- [[Blocking vs Non-blocking]] — 기다릴 때 자리를 붙잡느냐 놓느냐의 구분
- [[Async-Await]] — 멈췄다 이어 하는 일을 순서대로 읽히게 적는 문법
- [[Concurrency]] — 여러 일을 번갈아 진행시키는 성질. 코루틴은 그것을 쓰는 한 방법이다
- [[Scope]] — 이름이 살아 있는 범위. 코루틴도 스코프 안에서만 태어난다

---

**출처**

- https://kotlinlang.org/docs/coroutines-basics.html (Kotlin Docs — Coroutines basics. "A coroutine is a suspendable computation that lets you write concurrent code in a clear, sequential style."; "Coroutines can suspend their execution instead of blocking a thread."; "On the JVM and in Kotlin/Native, all concurrent code, such as coroutines, runs on threads, managed by the operating system."; "You can only call a suspending function from another suspending function."; "While the `suspend` keyword is part of the core Kotlin language, most coroutine features are available through the `kotlinx.coroutines` library."; 코루틴 하나를 만들려면 "A suspending function. A coroutine scope … A coroutine builder like `CoroutineScope.launch()` … A dispatcher"; `launch()` 는 "returns a `Job` handle", `async()` 는 "returns a `Deferred` handle that represents an eventual result" 이고 `await()` 로 기다린다; `Dispatchers.Default` 는 "up to as many threads as there are CPU cores available at runtime, with a minimum of two threads"; Comparing coroutines and JVM threads — "When you create a thread, the operating system allocates memory for its stack and uses the kernel to switch between threads … Each thread usually needs a few megabytes of memory, and typically the JVM can only handle a few thousand threads at once."; "a coroutine isn't bound to a specific thread. It can suspend on one thread and resume on another"; "When a coroutine suspends, the thread isn't blocked and remains free to run other tasks."; 5만 개 예제 — "For 50,000 threads, that can be up to 100 GB, compared to roughly 500 MB for the same number of coroutines.")
- https://developer.android.com/kotlin/coroutines (Android Developers — Kotlin coroutines on Android. "A coroutine is a concurrency design pattern that you can use on Android to simplify code that executes asynchronously."; "Lightweight: You can run many coroutines on a single thread due to support for suspension, which doesn't block the thread where the coroutine is running."; "Making a network request on the main thread causes it to wait, or block, until it receives a response. Since the thread is blocked, the OS isn't able to call `onDraw()`, which causes your app to freeze and potentially leads to an Application Not Responding (ANR) dialog."; "all coroutines must run in a scope. A `CoroutineScope` manages one or more related coroutines."; "`launch` is a function that creates a coroutine and dispatches the execution of its function body to the corresponding dispatcher.")
