# 2026-08-30 · vocab-roadmap (표준 로드맵 빈칸)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 첫 시도에서 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| Iterator (반복자) | `content/프로그래밍/Iterator.md` | `lang--iterator` |
| Reflection (리플렉션) | `content/프로그래밍/Reflection.md` | `lang--reflection` |

## 권별 단어 수 (1번 단계, `build.py --dry-run`)

시작 634개 → 636개.

```
컴퓨터과학 기초 41   프로그래밍 39(→41)   네트워크 76   웹 개발 34
데이터베이스 69      아키텍처 패턴 48      보안·인증 84   클라우드 61
인프라·운영 80       개발 도구 32          AI·LLM 42     제품 관리 28
```

상한(60) 초과는 다섯 권 그대로다 — 네트워크 76, 데이터베이스 69, 보안 84,
클라우드 61, 인프라 80. 이 다섯은 후보에서 아예 뺐다.

남은 일곱 권 중 얇은 순서는 제품 관리 28, 개발 도구 32, 웹 개발 34,
프로그래밍 39, 컴퓨터과학 41, AI 42, 아키텍처 48이다. 전략 문단은 "가장 얇은
권 우선" 이지만 이번에도 **출처가 먼저 걸렀다** — 앞의 세 권(제품 관리·개발
도구·웹 개발)을 받쳐 줄 도메인은 이번 세션에서도 전부 막혀 있었다. 그래서
닿는 출처가 있는 권 중 가장 얇은 **프로그래밍(39)** 에 두 편을 넣었다.

## egress 정책 — 이번 세션에서 닿은 것

80여 개 도메인을 직접 찔러 봤다. 지난 실행(08-23)과 거의 같지만 **셋이 새로
닿았다.**

- 닿음(200/307): `pkg.go.dev`, `nodejs.org`, `pypi.org`, `registry.npmjs.org`,
  `json-schema.org`, `developer.android.com`, `spring.io`,
  **`kotlinlang.org`**, **`gradle.org`**, `cloud.google.com`(루트만)
- 막힘(응답 없음, 코드 000): MDN, RFC/IETF, W3C, WHATWG, OWASP,
  `git-scm.com`, `docs.github.com`, `kubernetes.io`, `docs.docker.com`,
  `docs.python.org`, `react.dev`, `graphql.org`, `grpc.io`, `openapis.org`,
  `redis.io`, `postgresql.org`, `sqlite.org`, `web.dev`, `scrumguides.org`,
  `kanbanguides.org`, `agilemanifesto.org`, `12factor.net`, `sre.google`,
  `eslint.org`, `prettier.io`, `openfeature.dev`, `arxiv.org`,
  `docs.anthropic.com`, `learn.microsoft.com`, `docs.aws.amazon.com`,
  `opentelemetry.io`, `prometheus.io`, `doc.rust-lang.org`, `docs.oracle.com`,
  `dev.java`, **`docs.spring.io`**, `maven.apache.org`, `python.org`, `go.dev`,
  `tc39.es`, `v8.dev`, `vuejs.org`, `angular.dev`, `svelte.dev`, `jestjs.io`,
  `vitejs.dev`, `webpack.js.org`, `developer.hashicorp.com`, `helm.sh`,
  `istio.io`, `grafana.com`, `mongodb.com`, `dev.mysql.com`, `gnu.org`,
  `kernel.org`, `pubs.opengroup.org`, `unicode.org`, `iana.org`, `ieee.org`,
  `platform.openai.com`, `huggingface.co`, `modelcontextprotocol.io`,
  `protobuf.dev`, `swagger.io`, `kafka.apache.org`, `elastic.co` 외

`kotlinlang.org` 이 닿는 것이 이번 실행을 만들었다. **언어 자체를 정의하는
1차 출처가 하나 늘면서**, `pkg.go.dev` 하나로는 두 도메인을 못 채우던 언어
개념들(반복자·리플렉션·제네릭 심화)이 한꺼번에 후보가 됐다. 08-27 관련 용어
루틴도 이 도메인을 썼으니 두 번 연속 닿은 셈이다.

`gradle.org` 는 닿지만 실제 문서는 `docs.gradle.org` 에 있고 그쪽은 막혀
있다. `spring.io` 도 같은 꼴이다(`docs.spring.io` 막힘). 즉 **개발 도구 권을
열어 줄 것처럼 보이지만 실제로는 못 쓴다.**

## 후보와 판단

### 고른 것

**Iterator (반복자)** — 프로그래밍 권에 `Array` · `Loop` · `Interface` ·
`Generic` 이 다 있는데, 그것들을 잇는 "모아 둔 것을 어떤 방식으로 훑는가" 가
비어 있었다. 로드맵 계열 커리큘럼(자료구조 → 반복 → 제네릭)에서 기초 쪽
자리이고, 기초→심화 순서로 봐도 리플렉션보다 앞이다.

출처가 두 도메인에서 정확히 섰고, **둘이 서로 다른 모양을 정의한다는 점이
오히려 노트를 살렸다.**

- `kotlinlang.org/docs/iterators.html` — "objects that provide access to the
  elements sequentially without exposing the underlying structure of the
  collection." 정의 첫 문장이 이 한 줄에서 나왔다. `next()` 가 원소를 돌려주며
  자리를 옮긴다는 것, 마지막을 지나면 못 쓰고 되감을 수도 없어 다시 돌려면
  새로 만들어야 한다는 것, `for` 를 쓰면 반복자가 안 보이게 만들어진다는 것,
  `ListIterator` 만 양방향이라 끝에 닿아도 계속 쓸 수 있다는 것,
  `MutableIterator` 가 `remove()` 를 단다는 것이 전부 원문에 있다.
- `pkg.go.dev/iter` — "An iterator is a function that passes successive
  elements of a sequence to a callback function, conventionally named yield."
  코틀린과 정반대의 모양(미는 쪽)이다. yield 가 참/거짓으로 계속·정지를
  답하고 거짓 뒤에 부르면 panic, `Pull` 이 미는 모양을 꺼내 가는 모양으로
  바꿔 `next`·`stop` 을 주며 끝까지 안 받으면 `stop` 을 불러야 한다는 것,
  한 번만 쓰는 이터레이터, "Iterators provide only the values of the sequence,
  not any direct way to modify it" 까지 원문 그대로 썼다.

두 문서가 갈리는 덕에 ⚙️ 작동 원리를 `|=|` 대조(꺼내 가는 쪽 · 밀어 주는 쪽)로
세울 수 있었다. 한쪽 언어의 구현 설명으로 좁아지지 않은 편이다.

중복 확인: `iterator` / `이터레이터` / `반복자` 를 파일명·H1 본체·괄호 안 원어
세 축에 정규화(NFKC → 소문자 → 공백/하이픈/구두점 제거)해서 대조 — 636편
어디에도 없었다. `Loop`(프로그래밍) · `Batch vs Stream Processing`(데이터베이스)
가 이름이 스쳤지만 다른 개념이다. slug `lang--iterator` 도 lang 권 기존 39개
어디와도 안 부딪힌다.

**Reflection (리플렉션)** — 같은 권에 `Type System` · `Generic` ·
`Serialization` · `Dependency Injection` 이 있는데, 그것들이 실제로 어떻게
돌아가는지를 설명하는 기계 장치가 없었다. "타입을 미리 모르고 짠 코드가
실행 중에 알아낸다" 는 자리는 로드맵 계열에서 언어 심화의 표준 항목이다.

- `pkg.go.dev/reflect` — "Package reflect implements run-time reflection,
  allowing a program to manipulate objects with arbitrary types." `TypeOf` 가
  동적 타입을, `ValueOf` 가 그 안의 값을 준다는 것, `Kind` 의 뜻,
  `StructField` 가 이름·타입·꼬리표를 담는다는 것, `StructTag` 의 `key:"value"`
  규약, `Value.Interface` 는 "panics if the Value was obtained by accessing
  unexported struct fields", `CanSet` 은 "A Value can be changed only if it is
  addressable and was not obtained by the use of unexported struct fields" —
  🚨 주의사항과 🚫 흔한 오해 두 항목이 이 두 문장 위에 그대로 섰다.
- `kotlinlang.org/docs/reflection.html` — "Reflection is a set of language and
  library features that allows you to introspect the structure of your program
  at runtime." JVM 에서 리플렉션 런타임을 `kotlin-reflect.jar` 로 떼어 둔 이유가
  "to reduce the required size of the runtime library for applications that do
  not use reflection features" 라고 적혀 있다. **과잉 적용 오해("되도록
  비춰 보게 짜면 유연해진다")를 감이 아니라 문서의 문장으로 반박할 수 있었다.**
- `pkg.go.dev/encoding/json` (같은 도메인, 보강용) — "using the field name as
  the object key", "The encoding of each struct field can be customized by the
  format string stored under the \"json\" key in the struct field's tag."
  첫 초안은 reflect 문서가 "표준 패키지가 그 규약을 읽는다" 고 적는 것처럼
  썼는데, 다시 열어 보니 reflect 쪽에는 예시로만 나오고 그 문장은 json 쪽에
  있었다. 6번 단계의 재검증에서 잡아 문장과 출처를 고쳤다.

중복 확인: `reflection` / `리플렉션` / `반사` 로 세 축 대조 — 0건.
`content/` 전체에서 "reflect" 를 grep 해도 0건이었다.
slug `lang--reflection` 충돌 없음.

### 버린 것

| 후보 | 왜 버렸나 |
|---|---|
| **제품 관리 권 전부** (Epic, Velocity, Burndown, PRD…) | 가장 얇은 권(28)이라 1순위였는데 `scrumguides.org` · `kanbanguides.org` · `agilemanifesto.org` · `netpromotersystem.com` 이 **네 번째 실행에서도 전부 막혔다.** 방법론 문단이 허용 목록에 들어온 지 2주가 됐는데 클라우드 루틴은 아직 한 줄도 못 열었다 |
| **개발 도구 권 전부** (git bisect, Pre-commit Hook, Build Cache…) | `git-scm.com` · `docs.github.com` · `eslint.org` · `prettier.io` 막힘. `gradle.org` 가 새로 닿아서 잠깐 기대했으나 실제 문서(`docs.gradle.org`)는 막혀 있었다 |
| **웹 개발 권 전부** | MDN · W3C · WHATWG · `web.dev` 막힘. 그대로다 |
| **상속 · 다형성 · 캡슐화** | 08-23 기록이 "로드맵 기준 가장 큰 빈칸" 이라 적은 셋이다. `kotlinlang.org` 가 닿으면서 한 도메인은 생겼지만(Inheritance 문서), **둘째 도메인을 여전히 못 세웠다.** 고는 상속이 없고, Java/Swift 공식 문서는 막혀 있으며, `developer.android.com` 은 이 셋을 정의하지 않는다. 한 도메인짜리 근거로 쓰지 않았다 — 사람이 로컬에서 넣을 자리다 |
| **Coroutine** | `kotlinlang.org` + `developer.android.com` 으로 출처는 넉넉히 섰다. 다만 cs 권에 `Async-Await` · `Concurrency` · `Thread` · `Event Loop` 가 이미 있어 경계가 흐려진다고 봤다. 다음 실행에서 "이 넷과 무엇이 다른가" 를 세울 수 있으면 좋은 후보다 |
| **Type Inference** | `kotlinlang.org` 한 도메인은 되는데, 고 쪽은 정의가 언어 명세(`go.dev`, 막힘)에 있고 `pkg.go.dev` 는 이 개념을 설명하지 않는다 |
| **Annotation** | 같은 이유. 코틀린 문서는 좋지만 둘째 도메인이 없다. Spring 은 `docs.spring.io` 가 막혀 못 썼다 |
| **Thread Pool / Memory Leak** | `content/컴퓨터과학/Thread.md` · `Memory.md` 와 겹친다 |
| **Stream (I/O)** | 08-23 기록이 남긴 후보. `nodejs.org` + `pkg.go.dev/io` 로 출처는 되지만 `아키텍처/Back Pressure` · `데이터베이스/Batch vs Stream Processing` 사이 경계 문제가 그대로라 이번에도 안 골랐다 |

## 이 문서나 도구가 틀렸다고 느낀 점

### 1. 6번의 "다시 열어 대조하라" 가 실제로 한 건을 잡았다

이 지시가 형식적인 절차가 아니라는 것이 이번에 확인됐다. Reflection 초안이
"고 문서가 *표준 패키지가 그 규약을 읽는다고 적는다*" 고 썼는데, `pkg.go.dev/reflect`
를 다시 열어 보니 그 문장은 없었다 — 꼬리표 규약만 정의하고, "필드 이름을 키로
쓰고 꼬리표에 적힌 이름이 있으면 그것을 쓴다" 는 문장은 `encoding/json` 쪽에
있었다. 집필 시점에는 두 문서에서 읽은 것이 머릿속에서 한 덩어리가 되어
있었다. 출처를 하나 더 달고 문장을 고쳤다.

**검사기는 이런 것을 절대 못 잡는다.** 형식은 완벽했고 `--strict` 는 첫 시도에
통과였다. 6번 후단(사실 재검증)이 없으면 그대로 나갔을 문장이다.

### 2. `sources.allowlist.md` 의 "닿는 것" 목록이 이번에도 낡았다

파일은 다섯 개(`nodejs.org` · `pkg.go.dev` · `json-schema.org` · `pypi.org` ·
`registry.npmjs.org`)를 적어 두는데, 실제로는 **열 개가 닿는다.** 08-23 이
`developer.android.com` · `spring.io` 를 더했고 이번에 `kotlinlang.org` ·
`gradle.org` 가 더 붙었다. 특히 `kotlinlang.org` 은 이번 실행 두 편을 다
받쳐 준 핵심 출처인데 목록에는 이름조차 없다("그 밖의 프로젝트도 공식
도메인이면 허용" 조항으로 통과시켰다).

닿는 목록을 그때그때 고치는 것보다, **매 실행 첫머리에 찔러 보고 그 결과를
기록에 남기는 지금 방식이 맞다고 본다.** 다만 `sources.allowlist.md` 의
"닿은 것" 문단이 다섯 개로 못 박혀 있어서, 그것만 믿고 후보를 좁히면 이번
같은 편을 못 쓴다. 그 문단을 "최근 실행 기록을 보라" 로 바꾸는 편이 낫겠다.
(`tools/` 는 안 고쳤다. 기록만 남긴다.)

### 3. 로드맵 전략이 쓸 수 있는 권은 여전히 넷이다

08-23 기록의 지적이 그대로 유효하다. 상한(60) 초과 다섯 권 + 출처를 못 여는
세 권(제품 관리·개발 도구·웹 개발)을 빼면 **컴퓨터과학 · 프로그래밍 ·
아키텍처 · AI** 넷이 전부다. 이번에 프로그래밍이 39 → 41 이 됐으니 넷 다
41~48 구간에 들어왔다. 지금 속도(주 2편)면 이 넷이 상한에 닿는 데 아직
여유가 있지만, **정작 가장 얇은 세 권은 클라우드 루틴으로는 영영 안 자란다.**
얇은 권은 사람이 로컬에서 채우거나, egress 정책을 손보거나, 둘 중 하나다.

### 4. 각본(`scenes/`) 격차 — 사람이 따라잡았고, 이번에 다시 두 편 벌어졌다

08-23 · 08-27 기록이 지적한 격차를 사람이 메웠다. `scenes/` 는 지금 **634편**
이다(커밋 `2a8b4cb` "634편 전부를 4컷으로 — Phase 1 완료"). 08-27 시점의
629편에서 다섯 편이 채워진 것이다.

그런데 이번 실행이 636편으로 늘렸으니 **두 편(`lang--iterator` ·
`lang--reflection`)이 다시 각본 없이 남는다.** 구조는 그대로다 — 루틴이
매주 두 편씩 격차를 벌리고 사람이 몰아서 따라잡는다. 지시에 없는 일이라
`scenes/` 는 이번에도 건드리지 않았다. 08-23 기록이 적은 세 갈래(프롬프트에
각본 쓰기를 넣기 / 사람이 몰아 쓰는 것으로 명문화 / `--dry-run` 이 격차를
찍게 하기) 중 셋째만이라도 있으면 이 항목을 매번 손으로 적을 일이 없겠다.

### 5. 검사기는 이번에도 문제 없었다

두 편 다 `--strict` 첫 시도 통과. Iterator 편은 한 편에서 `||` 대조와 `|=|`
대조를 둘 다 썼는데("속을 알고 꺼내면 || 반복자로 꺼내면" 은 왼쪽이 실제로
곤란한 상태, "꺼내 가는 쪽 |=| 밀어 주는 쪽" 은 둘 다 정당한 모양),
템플릿의 "✕ 칸 자기검사" 가 그대로 판단 기준이 됐다. 그림 자리의 `@` 순환
표기도 한 번에 맞았다 — 반복자는 "다음 있나 → 꺼낸다 → 쓴다 → 다시 물음으로"
가 본질이라 직선으로 펴면 정의가 틀려지는 개념이다.
