# Structured Concurrency (구조적 동시성)

## 📝 정의

구조적 동시성은 시작한 일이 **태어난 자리보다 오래 못 살게** 하는 원칙이다.

스위프트 문서는 이것을 "작업이 자기가 만들어진 범위보다 오래 살지 못하도록 프로그램과 작업을 짜는 방식" 이라고 적는다. 코틀린 문서는 같은 원칙을 반대편에서 적는다 — 코루틴들이 부모와 자식으로 이어진 나무를 이루고 수명이 서로 묶인다. 어느 쪽으로 읽어도 결론은 하나다. 안쪽은 바깥쪽이 끝나기 전에 끝난다.

### 비유
놀이터에 아이들을 데리고 나온 어른처럼, 아이가 다 모이기 전에는 집에 가지 못하고 어른이 돌아가면 아이들도 함께 돌아간다.

### 예
화면을 이미 나왔는데 잠시 뒤 그 화면이 시작했던 일이 뒤늦게 결과를 들고 오는 상황, 그것을 규칙으로 막는 것이다.

## 🖼️ 그림으로 보기

```도해
층: 구조적 동시성은 무엇을 무엇 안에 가두나
시작한 자리 :: 일을 띄울 수 있는 범위. 여기서 태어난 것은 여기서 끝난다
부모 작업 :: 자식이 다 끝나기 전에는 자기도 안 끝난다
자식 작업 :: 부모보다 오래 못 산다. 부모가 접히면 같이 접힌다
손자 작업 :: 자식이 다시 띄운 것도 같은 규칙을 그대로 물려받는다
= 안쪽은 바깥쪽보다 오래 못 산다. 그래서 바깥이 끝나면 남는 것이 없다
```

## ⚠️ 해결하는 문제

```도해
대조: 띄운 일을 아무도 안 붙들면 무엇이 곤란한가
묶어 두지 않으면 || 범위에 묶으면
바깥이 끝났을 때 :: 하던 일이 남는다 || 함께 정리된다
그만두라고 할 때 :: 하나씩 찾아야 || 계층을 타고 퍼진다
하나가 실패하면 :: 형제는 계속 돈다 || 함께 접힌다
= 띄운 자리가 곧 거두는 자리다. 그래야 새는 것이 없다
```

스위프트 문서는 구조 밖 작업의 성질을 이렇게 적는다 — 손잡이를 버려도 그 작업은 계속 돈다. 손잡이를 버린 대가는 결과를 기다릴 수도, 취소할 수도 없게 되는 것이다. 하나 띄우는 자리에서는 별일 아니지만, 화면 하나가 열 개를 띄우고 그 화면이 사라지는 자리에서는 아무도 그것들을 거둘 수 없다는 뜻이 된다.

그래서 두 언어 다 "띄울 수 있는 자리" 를 먼저 정한다. 코틀린은 새 코루틴을 반드시 코루틴 스코프 안에서만 띄우게 하고, 그 스코프가 수명을 정하고 관리한다. 스위프트는 작업 그룹을 만들어 그 안에 자식을 넣고, 그룹은 자식이 전부 끝나기 전에는 반환하지 않는다. 취소도 같은 길을 탄다. 코틀린 문서는 코루틴을 취소하면 그 자식이 전부 함께 취소되는 것이 구조적 동시성이 보장하는 일이라고 적고, 안드로이드 문서는 취소가 계층을 따라 자동으로 퍼진다고 적는다.

## 📊 비교: 구조 안의 작업과 구조 밖의 작업

```도해
대조: 구조 안에 둘 일과 구조 밖에 둘 일은 무엇이 다른가
구조 안의 작업 |=| 구조 밖의 작업
수명 :: 부모 안에서 끝난다 || 부모보다 길 수 있다
기다림 :: 범위가 기다려 준다 || 직접 붙들어야 한다
취소 :: 위에서 퍼져 내려온다 || 손잡이가 있어야 한다
= 범위보다 오래 살아야 하는 일만 밖으로 낸다
```

구조 밖의 작업이 틀린 것은 아니다. 스위프트는 그런 작업을 만드는 길을 따로 열어 두었고, 화면 하나보다 오래 살아야 하는 일에는 그것이 맞다. 대신 밖으로 낸 순간부터 기다리는 일도 취소하는 일도 사람이 손으로 해야 한다. 구조 안에 두는 자식 작업은 그 대신 부모의 우선순위 같은 성질을 물려받고, 수명이 부모를 넘지 않는 것이 보장된다.

## 💡 실제 사례

- **화면을 벗어나면 하던 일 접기** — 안드로이드 문서는 구조적 동시성으로 범위 안에서 돌리면 새는 자리가 줄어들고, 그만두라는 신호가 계층을 따라 자동으로 퍼진다고 적는다.
- **여러 갈래를 한꺼번에 띄우고 다 모으기** — 스위프트의 작업 그룹은 그 안에서 만든 자식이 전부 끝나기 전에는 반환하지 않는다. 첫 결과만 받아 돌려주는 코드를 써도 나머지를 자동으로 기다린다.
- **하나가 실패했을 때 나머지 접기** — 코틀린 문서는 부모가 실패하거나 취소되면 자식이 재귀적으로 함께 취소된다고 적는다. 실패한 요청 하나 때문에 나머지가 헛일을 계속하지 않는다.

## 🚫 흔한 오해

- **취소하면 하던 일이 그 자리에서 딱 멈춘다** — 아니다. 스위프트 문서는 그룹을 취소해도 실행이 저절로 끊기지는 않고 자식이 스스로 신호를 보고 일찍 돌아와야 한다고 적는다. 코틀린도 취소를 확인하는 지점에 닿아야 예외가 던져진다고 적는다.
- **구조적 동시성은 특정 언어의 기능 이름이다** — 원칙의 이름이다. 코틀린은 코루틴 스코프로, 스위프트는 작업 그룹으로 같은 원칙을 각자 구현했고 두 문서가 같은 말을 쓴다.
- **일은 무조건 구조 안에 둬야 한다** — 범위보다 오래 살아야 하는 일도 있어서 스위프트는 구조 밖 작업을 만드는 길을 따로 둔다. 다만 그렇게 낸 것은 손잡이를 놓치는 순간 기다릴 수도 취소할 수도 없다.

## 📝 정리

**"띄운 자리를 못 벗어나게 묶는 그 원칙"** 이라고 읽으면 된다. 부모는 자식이 다 끝나야 끝나고, 부모가 접히면 자식도 함께 접힌다. 그래서 바깥이 끝난 뒤에 뒤늦게 살아 움직이는 것이 남지 않는다.

## 🧒 열 살에게

놀러 나갈 때 어른이 아이들 손을 잡고 나가지? 아이들이 다 모이기 전에는 어른이 집에 안 들어가고, 어른이 그만 놀자고 하면 아이들도 다 따라 들어와. 그래서 아무도 밖에 남지 않아.

## ❓ 이해했는지

- 바깥이 끝났는데 안에서 띄운 일이 남아 있으면 왜 곤란한가 → 해결하는 문제
- 부모가 취소되면 자식들은 어떻게 되나 → 그림
- 그만두라고 알렸는데도 자식이 한참 더 도는 일이 왜 생기나 → 흔한 오해

## 🔗 관련 용어

- [[Coroutine]] — 이 원칙이 부모와 자식으로 묶어 다스리는 대상
- [[Concurrency]] — 여러 일을 동시에 진행시키는 성질. 이 원칙은 그것에 수명 규칙을 씌운다
- [[Async-Await]] — 자식 작업을 띄우고 그 결과를 기다리는 문법
- [[Scope]] — 이름이 살아 있는 범위. 여기서는 작업이 살아 있는 범위로 쓰인다
- [[Thread]] — 구조가 없던 시절에는 이 단위를 하나씩 손으로 붙들어야 했다

---

**출처**

- https://developer.apple.com/documentation/swift/taskgroup (Apple Developer Documentation — `TaskGroup`. "Structured concurrency is a way to organize your program, and tasks, in such a way that tasks don't outlive the scope in which they are created."; "Within a structured task hierarchy, no child task remains running longer than its parent task."; "A task group is the primary way to create structured concurrency tasks in Swift. Another way of creating structured tasks is an `async let` declaration."; "A child task inherits the parent's priority, task-local values, and is structured in the sense that its lifetime never exceeds the lifetime of the parent task."; "A task group always waits for all child tasks to complete before it's destroyed … `with...TaskGroup` APIs don't return until all the child tasks created in the group's scope have completed running."; "even if you await a single task result and return it from a `withTaskGroup` function body, the group automatically waits for all the remaining tasks before returning"; "You can use `group.cancelAll()` to signal cancellation to the remaining in-progress tasks, however this doesn't interrupt their execution automatically. Rather, the child tasks need to cooperatively react to the cancellation, and return early if that's possible."; "To create unstructured concurrency tasks, you can use `Task.init`, `Task.detached` or `Task.immediate`." — 그리고 `Task` 문서의 "It's not a programming error to discard a reference to a task without waiting for that task to finish or canceling it. A task runs regardless of whether you keep a reference to it. However, if you discard the reference to a task, you give up the ability to wait for that task's result or cancel the task.")
- https://kotlinlang.org/docs/coroutines-basics.html (Kotlin Docs — Coroutines basics, "Coroutine scope and structured concurrency". "Kotlin coroutines rely on a principle called structured concurrency … coroutines form a tree hierarchy of parent and child tasks with linked lifecycles."; "A parent coroutine waits for its children to complete before it finishes. If the parent coroutine fails or gets canceled, all its child coroutines are recursively canceled too."; "To maintain structured concurrency, new coroutines can only be launched in a `CoroutineScope` that defines and manages their lifecycle."; "`coroutineScope()` executes the suspending block and waits until the block and any coroutines launched in it complete." — 그리고 https://kotlinlang.org/docs/coroutines-cancellation.html 의 "Structured concurrency ensures that canceling a coroutine also cancels all of its children."; "Cancellation works through the `Job` handle, which represents the lifecycle of a coroutine and its parent-child relationships."; "When a coroutine is canceled, it throws a `CancellationException` the next time it checks for cancellation.")
- https://developer.android.com/kotlin/coroutines (Android Developers — Kotlin coroutines on Android. "Fewer memory leaks: Use structured concurrency to run operations within a scope."; "Built-in cancellation support: Cancellation is propagated automatically through the running coroutine hierarchy.")
