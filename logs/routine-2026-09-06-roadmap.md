# 2026-09-06 · vocab-roadmap (표준 로드맵 빈칸)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 에서 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| Stack Trace (스택 추적) | `content/개발도구/Stack Trace.md` | `tool--stack-trace` |
| REPL (Read-Eval-Print Loop) | `content/개발도구/REPL.md` | `tool--repl` |

## 권별 단어 수 (1번 단계, `build.py --dry-run`)

시작 638개 → 640개.

```
컴퓨터과학 기초 43   프로그래밍 41   네트워크 76   웹 개발 34
데이터베이스 69      아키텍처 패턴 48   보안·인증 84   클라우드 61
인프라·운영 80       개발 도구 32(→34)  AI·LLM 42     제품 관리 28
```

상한(60) 초과는 지난 실행과 같은 다섯 권이다 — 네트워크 76, 데이터베이스 69,
보안 84, 클라우드 61, 인프라 80. 후보에서 아예 뺐다.

남은 일곱 권 중 얇은 순서는 제품 관리 28, 개발 도구 32, 웹 개발 34,
프로그래밍 41, AI 42, 컴퓨터과학 43, 아키텍처 48이다.
**이번에는 두 번째로 얇은 개발 도구(32)에 두 편이 다 들어갔다.**
가장 얇은 제품 관리는 이번에도 출처가 전부 막혀 있었다(아래 참조).

## egress 정책 — 이번 세션에서 닿은 것

지난 세 번의 실행과 큰 틀은 같다. 새로 확인한 것 몇을 적어 둔다.

- 닿음: `pkg.go.dev`, `nodejs.org`, `pypi.org`, `registry.npmjs.org`,
  `json-schema.org`, `kotlinlang.org`, `developer.android.com`, `spring.io`,
  `gradle.org`(루트만), `cloud.google.com`(루트만)
- **이번에 새로 닿은 것**: `www.ruby-lang.org`, `www.haskell.org`,
  `developer.apple.com/documentation`, `swift.org`(302), `rubygems.org`,
  `packagist.org`, `nuget.org`, `hub.docker.com`
- 막힘(코드 000): MDN, RFC/IETF, W3C, WHATWG, OWASP, `web.dev`,
  `git-scm.com`, `docs.github.com`, `kubernetes.io`, `docs.docker.com`,
  `react.dev`, `graphql.org`, `grpc.io`, `protobuf.dev`, `docs.python.org`,
  `www.php.net`, `docs.swift.org`, `dart.dev`, `typescriptlang.org`,
  `scala-lang.org`, `erlang.org`, `elixir-lang.org`, `openjdk.org`,
  `isocpp.org`, `ecma-international.org`, `postgresql.org`, `docs.rs`,
  `maven.apache.org`, `docs.gradle.org`, `opencontainers.org`, `cncf.io`,
  `eslint.org`, `prettier.io`, `openfeature.dev`, `arxiv.org`,
  `learn.microsoft.com`, `docs.aws.amazon.com`, `opentelemetry.io`,
  `prometheus.io`, `developer.chrome.com`, `webkit.org` 외
- 방법론 규범 문서는 **하나도 안 열린다**: `scrumguides.org`, `kanbanguides.org`,
  `agilemanifesto.org`, `12factor.net`, `sre.google`, `netpromotersystem.com`.
  제품 관리 권(28개, 가장 얇음)이 네 번째 실행 연속으로 손을 못 대는 이유가 이것이다.

`www.ruby-lang.org` 가 새로 닿은 것이 이번 실행의 두 번째 단어를 만들었다.
`nodejs.org` 하나로는 두 도메인을 못 채우던 후보가 갈라졌다.

## 후보와 판단

기준은 전략 문단대로 "확립된 커리큘럼에 있는데 12권에 없는 핵심 개념" 이고,
얇은 권부터 봤다. 개발 도구 권에는 Debugger · Breakpoint · IDE · CLI · Shell ·
Terminal 이 이미 있는데, **그 도구들이 실제로 다루는 대상 두 가지**가 비어 있었다.

### 고른 것

**Stack Trace (스택 추적)** — 기초 쪽이다. Debugger 와 Exception 이 둘 다 있으면서
"터졌을 때 화면에 쏟아지는 그 목록" 자체를 다루는 단어가 없었다. 에러를 처음
만나는 사람이 가장 먼저 보는 것이 이것인데 읽는 법이 어디에도 없었다.

출처가 두 도메인에서 정확히 섰고, 둘이 서로 **다른 것을 정의해서** 노트가 넓어졌다.

- `nodejs.org/api/errors.html` — "Error objects capture a 'stack trace' detailing
  the point in the code at which the Error was **instantiated**." 여기서 노트의
  뼈대 셋이 나왔다. (1) 자취는 던질 때가 아니라 **만들 때** 담긴다. (2) 첫 줄이
  `<error class name>: <error message>` 이고 그 아래 `at` 줄 하나가 호출 자리
  하나다. (3) "Stack traces extend only to either (a) the beginning of
  synchronous code execution, or (b) the number of frames given by
  Error.stackTraceLimit, whichever is smaller." — 기본 10프레임.
  흔한 오해 세 항목이 전부 이 문서에서 나왔다.
- `pkg.go.dev/runtime/debug` + `pkg.go.dev/runtime` — `Stack()` 이 "자기를 부른
  고루틴의 형식화된 스택 추적을 돌려준다", `PrintStack()` 은 그것을 표준 에러로
  찍는다. `GOTRACEBACK` 항목은 기본값이 "현재 고루틴 하나의 자취를 찍고 런타임
  내부 함수는 뺀다" 이고 `all` 이 "사용자가 만든 고루틴 전부" 를 더한다고 적는다.

  Go 를 넣은 이유는 도메인 수를 채우려는 것이 아니다. Node 만 보면 "자취는
  예외에 딸린 것" 으로 읽히는데, Go 쪽은 예외 없이도 **아무 때나 꺼내는 값**이다.
  둘을 같이 보면 자취가 에러의 부속이 아니라는 것이 드러난다.

  위가 터진 자리이고 아래가 출발점이라는 순서는 Node 문서의 `cheetahify` 예제가
  보여준다(`at speedy` → `at makeFaster` → `at Object.<anonymous>` → 모듈 적재).
  문장으로 적혀 있지는 않고 예제로만 있어서, 그림의 근거가 예제라는 점을 적어 둔다.

**REPL (Read-Eval-Print Loop)** — 이름 네 글자가 곧 한 바퀴라 `@` 흐름 도해가
그대로 나오는 단어다. 개발 도구 권에 Terminal · Shell · CLI 가 있는데 "한 줄이
곧 실행" 인 창은 없었다. 기초 쪽이고, 언어를 처음 배울 때 실제로 가장 먼저
여는 창이다.

- `nodejs.org/api/repl.html` — "instances of repl.REPLServer will accept
  individual lines of user input, evaluate those according to a user-defined
  evaluation function, then output the result." 정의 첫 문장이 여기서 나왔다.
  기본 평가 함수가 내장 모듈에 접근하게 해 주고 갈아끼울 수 있다는 것,
  블록·함수 밖 변수가 전역 범위에 놓인다는 것(흔한 오해 2번의 근거),
  `.editor` · `.save` · `.load` · `.break` · `.clear`,
  홈 디렉터리 `.node_repl_history` 와 `NODE_REPL_HISTORY_SIZE` 기본 1000줄,
  `> 1 + 1` → `2` 예제(직접 절)까지 전부 이 문서다.
- `www.ruby-lang.org/en/documentation/quickstart/` — IRB 가 "the result of the
  last expression it evaluated" 를 `=>` 로 보여준다는 것. 두 언어가 같은 모양을
  각자 부르는 이름으로 갖고 있다는 것을 확인하는 데 썼다.

### 버린 것

- **Profiler (프로파일러)** — 개발 도구 권에 Debugger 는 있고 Profiler 는 없어서
  가장 먼저 고른 후보였고, `pkg.go.dev/runtime/pprof` 와 `nodejs.org/api/cli.html`
  (`--cpu-prof` · `--heap-prof`) 로 출처도 두 도메인이 섰다. **그런데 인프라 권에
  `Continuous Profiling` 이 이미 있다.** 그 노트가 표본 뜨기 · 호출 나무 · 오버헤드를
  이미 다 설명하고 있어서, 새 노트는 같은 그림을 한 번 더 그리는 것이 된다.
  제목과 slug 는 안 부딪히지만 내용이 부딪힌다. 버렸다.
- **제품 관리 권 전체** — 가장 얇은 권(28)이라 1순위로 봤다. 후보는 있었다
  (Stakeholder, Prioritization, Customer Journey Map 등). 그러나 허용 목록의
  방법론 규범 문서 여섯 도메인이 **전부** 막혀 있어 어느 것도 1차 출처를 못 세운다.
  기억으로 쓰지 않았다.
- **Hot Reload** — `nodejs.org` 의 `--watch` 와 `developer.android.com` 의
  Apply Changes 로 두 도메인은 되지만, 어느 쪽도 "hot reload" 라는 말을 정의하지
  않는다. 서로 다른 것을 하나의 이름으로 묶는 글이 되어 버려서 버렸다.
- **Enum · Inheritance · Pattern Matching** (프로그래밍 권) — `kotlinlang.org` 와
  새로 닿은 `www.ruby-lang.org` 로 출처는 섰겠지만, 프로그래밍 권(41)이
  개발 도구 권(32)보다 두껍다. 전략 문단의 "비슷하게 좋으면 얇은 권" 을 따랐다.
  다음 실행의 후보로 남겨 둔다.

## 중복 배제

세 축(파일명 · H1 제목 · 괄호 안 원어)을 `content/` 전체 H1 643개에 대고 봤다.

- `Stack Trace` — `Stack (스택)` 이 컴퓨터과학 권에 있으나 별개 단어이고
  slug 도 `cs--stack` vs `tool--stack-trace` 로 안 부딪힌다.
  "스택 추적" 을 본문에 쓴 노트는 아키텍처 권 `Dead Letter Queue` 한 편뿐이고,
  거기서도 지나가는 말이다.
- `REPL` — 같은 이름도, `Read-Eval-Print` 를 푼 노트도 없다.
  `Replication (복제)` 이 문자열로만 걸리지 별개다.
- 생성된 id 를 `data/index.js` 에서 확인했다 — `tool--stack-trace`, `tool--repl`.

## 이 문서나 도구가 틀렸다고 느낀 점

1. **`docs/TERM-TEMPLATE.md` 의 "🧒 열 살에게 1~3문장" 이 본문 프롬프트에는 없다.**
   `ROUTINE-PROMPT.md` 의 "특히 주의할 것" 목록에 열 살에게 항목이 아예 없어서
   4문장을 쓰고 검사기에 걸렸다(`열 살에게 가 4문장이다`). 템플릿을 읽으라는
   지시는 있으니 내 잘못이지만, 30자 이상·3문장 이하는 실제로 걸리기 쉬운
   자리라 주의 목록에 한 줄 있을 만하다.

2. **출처 재검사에서 두 문장을 깎았다 — 이 단계가 실제로 일한다.**
   6번 단계의 "쓸 때의 판단을 믿지 말고 URL 을 다시 열어라" 를 그대로 했더니
   두 군데가 걸렸다. (a) Stack Trace 의 `### 직접` 에 "브라우저 콘솔에 `null.x` 를
   치면 에러 **밑에** 어디서 났는지가 붙는다" 라고 썼는데, 콘솔이 위치를 어디에
   그리는지는 어느 1차 출처에도 없다. 절을 통째로 뺐다(선택 절이다).
   (b) REPL 사례에 "새 창에서 **위 화살표로** 꺼내진다" 라고 썼는데, 위 화살표를
   적어둔 것은 Ruby 문서이고 Node 문서는 "입력을 남긴다" 까지만 적는다.
   Node 에 Ruby 문서의 문장을 붙인 꼴이라 고쳤다.
   **두 도메인을 인용하면 어느 문장이 어느 문서에서 왔는지가 섞이기 쉽다.**
   이건 도구의 결함이 아니라 이 작업의 고유한 함정이고, 6번 단계가 그걸 잡는다.

3. **허용 목록의 "닿음/막힘" 표가 낡았다.** 파일 9~36행의 목록은 2026-08-16
   기준인데, 그 뒤 네 번의 실행에서 `kotlinlang.org` · `gradle.org` ·
   `www.ruby-lang.org` · `developer.apple.com` 등이 새로 닿았다. 파일 스스로
   "실행마다 달라질 수 있다. 실제로 열어 보고 판단해라" 라고 적어 두었으니
   틀린 것은 아니다. 다만 **매 실행이 80여 개 도메인을 다시 찔러 보는 데
   시간을 쓴다.** logs/ 의 직전 실행 기록을 먼저 읽고 거기서 출발하면 짧아진다는
   것을 이번에 했다 — 이 요령이 프롬프트 1번 단계에 한 줄 있으면 좋겠다.
   (도구는 고치지 않았다. 기록만 남긴다.)
