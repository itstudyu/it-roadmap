# 2026-08-23 · vocab-roadmap (표준 로드맵 빈칸)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 에서도 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| Event Loop (이벤트 루프) | `content/컴퓨터과학/Event Loop.md` | `cs--event-loop` |
| Code Coverage (코드 커버리지) | `content/프로그래밍/Code Coverage.md` | `lang--code-coverage` |

## 권별 단어 수 (1번 단계, `build.py --dry-run`)

시작 629개 → 631개.

```
컴퓨터과학 기초 40(→41)   프로그래밍 36(→37)   네트워크 76        웹 개발 34
데이터베이스 69           아키텍처 패턴 48      보안·인증 84       클라우드 61
인프라·운영 80            개발 도구 32          AI·LLM 41         제품 관리 28
```

**상한(60)에 닿은 권이 다섯이다** — 네트워크 76, 데이터베이스 69, 보안 84,
클라우드 61, 인프라 80. 이 다섯은 이번 후보에서 아예 뺐다. 남은 일곱 권 중
가장 얇은 것은 제품 관리 28, 개발 도구 32, 웹 개발 34, 프로그래밍 36 순이다.

전략 문단은 "가장 얇은 권을 우선" 이라고 하지만, 실제로는 **출처가 먼저 걸렀다**
(아래 참조). 가장 얇은 세 권(제품 관리·개발 도구·웹 개발)은 근거로 쓸 도메인이
이번 세션에서 전부 막혀 있었다. 그래서 닿는 출처가 있는 권 중 가장 얇은
프로그래밍(36)과 그다음 컴퓨터과학(40)에 한 편씩 넣었다.

## 이번 실행을 지배한 제약 — egress 정책

`sources.allowlist.md` 의 경고가 세 번째 실행에서도 그대로다. 40여 개 도메인을
직접 찔러 본 결과 **닿는 것은 다섯 개뿐**이었다.

- 닿음: `pkg.go.dev`, `nodejs.org`, `pypi.org`, `registry.npmjs.org`, `json-schema.org`
- CONNECT 실패(응답 자체가 없음): MDN, RFC/IETF, W3C, WHATWG, OWASP, NIST,
  `scrumguides.org`, `agilemanifesto.org`, `kanbanguides.org`, `sre.google`,
  `12factor.net`, `docs.github.com`, `git-scm.com`, `eslint.org`, `prettier.io`,
  `openfeature.dev`, `kubernetes.io`, `docs.docker.com`, `postgresql.org`,
  `redis.io`, `sqlite.org`, `docs.python.org`, `graphql.org`, `grpc.io`,
  `openapis.org`, `kernel.org`, `gnu.org`, `unicode.org`, `iana.org`,
  `web.dev`, `arxiv.org`, `huggingface.co`, `docs.anthropic.com`,
  `learn.microsoft.com`, `tc39.es`, `v8.dev`, `doc.rust-lang.org`,
  `docs.libuv.org`, `openjdk.org`, `docs.oracle.com`, `deno.land`, `bun.sh`

**`cloud.google.com` 이 지난 실행보다 더 나빠졌다.** 지난번에는 "루트만 200" 이었는데,
지금은 모든 문서 경로가 `docs.cloud.google.com` 으로 301 리다이렉트되고 그 새
호스트가 403 이다. 즉 이제 GCP 문서는 **한 쪽도** 못 읽는다.

**반대로 새로 닿는 것이 넷 있었다** — 지난 두 실행의 기록에 없던 것들이다.

| 도메인 | 성격 | 판정 |
|---|---|---|
| `developer.android.com` | 안드로이드 공식 API 레퍼런스 | 허용 목록의 "그 기술을 만든 조직이 직접 운영하는 문서" 에 해당. 이번에 실제로 인용했다 |
| `developer.apple.com` | 애플 공식 문서 | 닿지만 본문이 스크립트로 그려져 평문 추출이 잘 안 된다. 이번엔 안 썼다 |
| `spring.io` | Spring 공식 | 닿음. 이번 후보에 해당 없음 |
| `dotnet.microsoft.com` | .NET 홍보 페이지 | 닿지만 실제 문서는 `learn.microsoft.com` 이고 그쪽은 막혀 있다. 쓸모 없음 |

## 후보와 판단

### 고른 것

**Event Loop (컴퓨터과학, 40편)** — roadmap.sh 계열 커리큘럼(JavaScript/Node.js)의
표준 항목이고, 이 권에 `Async-Await` · `Blocking vs Non-blocking` · `Concurrency` ·
`Thread` 가 이미 다 있는데 **그것들을 하나로 묶는 기계 장치만 빠져 있었다.**
기초→심화 순서 기준으로도 이 자리가 먼저다.

출처가 두 도메인에서 정확히 섰다.

- `nodejs.org` — 국면 차례(타이머 → 미뤄 둔 입출력 → 준비 → 폴 → 체크 → 닫힘),
  국면마다 선입선출 줄이 하나씩, 줄이 비거나 상한을 넘기면 다음 국면으로.
  "적은 수의 스레드로 많은 손님", 막힘의 정의, 서비스 거부까지 원문에 있다.
- `developer.android.com` — `Looper` 가 같은 얼개를 다른 이름(메시지 루프)으로
  적어 둔다. "스레드는 기본적으로 루프가 없고, 붙여서 돌리면 멈출 때까지
  메시지를 처리한다." 한 회사의 구현 특성이 아니라는 것이 이 둘로 선다.

중복 확인: 파일명·H1 본체·괄호 안 원어 세 축을 정규화(NFKC → 소문자 →
공백/하이픈/구두점 제거)해서 `eventloop` 로 대조했고 631편 어디에도 없었다.
`Back Pressure`(아키텍처), `Signal`(인프라) 은 이름이 스쳤지만 다른 개념이다.
slug `cs--event-loop` 도 기존 cs 권과 충돌하지 않는다.

**Code Coverage (프로그래밍, 36편 — 닿는 출처가 있는 권 중 가장 얇다)** —
이 권에 `Unit Test` · `Integration Test` · `TDD` 가 있는데 "그래서 얼마나 했나"
를 재는 말이 없었다. 테스트 커리큘럼의 표준 항목이다.

- `pkg.go.dev` — `cmd/cover` 가 계측(instrumentation)의 정의와, 기본 블록 나누기가
  **원본을 훑어 얻은 어림값**이며 `&&` · `||` 안까지는 재지 않는다는 한계를
  스스로 적어 둔다. `testing` 이 `CoverMode` 의 set·count·atomic 과
  `Coverage()` 가 0~1 분수라는 것을, `cmd/go` 가 세 모드의 뜻과 atomic 의
  비용을 적는다.
- `pypi.org` — coverage.py 의 공식 메타데이터. "표준 라이브러리의 코드 분석
  도구와 추적 고리를 써서 **실행될 수 있는 줄**과 **실제로 실행된 줄**을 가른다."
  Go 와 재는 방식이 정반대(원본 고쳐쓰기 vs 추적 고리)라 ⚙️ 작동 원리가
  한 언어의 구현 설명으로 좁아지지 않았다.

`&&` · `||` 를 안 본다는 Go 문서의 한 줄이 🚫 흔한 오해의 두 번째 항목을
**근거 있는 문장**으로 만들어 줬다. "100% 인데 왜 버그가 나나" 를 감이 아니라
계측기의 한계로 설명할 수 있다.

중복 확인: `coverage` / `커버리지` 로 세 축 대조 — 0건.
`Continuous Profiling`(인프라) 과는 다른 개념이다.

### 버린 것

| 후보 | 왜 버렸나 |
|---|---|
| **제품 관리 권 전부** (Epic, Burndown, Velocity, Usability Testing, PRD…) | 가장 얇은 권(28)이라 1순위였는데 `scrumguides.org` · `kanbanguides.org` · `agilemanifesto.org` · `netpromotersystem.com` 이 **전부 막혔다**. 방법론 문단이 2026-08-17 에 허용 목록에 들어왔는데도 클라우드 루틴에서는 한 줄도 못 연다 |
| **개발 도구 권 전부** (git bisect, Rebase 심화, Pre-commit Hook…) | `git-scm.com` · `docs.github.com` · `eslint.org` · `prettier.io` 전부 막힘 |
| **웹 개발 권 전부** (CORS 심화, Service Worker, Web Vitals…) | MDN · W3C · WHATWG · `web.dev` 전부 막힘 |
| **상속 · 다형성 · 캡슐화** | 프로그래밍 권에 `OOP` · `Class` · `Object` · `Interface` 가 있는데 이 셋이 없다. **로드맵 기준으로는 이번 실행의 가장 큰 빈칸**이다. 그런데 닿는 다섯 도메인 중 이 셋을 정의하는 문서가 하나도 없다(Go 표준 라이브러리 문서는 상속을 다루지 않는다). Java/Swift/Kotlin 공식 문서는 전부 막혔다. 1차 출처를 두 도메인으로 못 세워 버렸다 — 사람이 로컬에서 넣을 자리다 |
| **Iterator / Generator** | `pkg.go.dev/iter` 라는 좋은 1차 출처가 하나 있는데 두 번째 도메인을 못 세웠다 |
| **Profiling** | `pkg.go.dev/runtime/pprof` + `nodejs.org` 로 출처는 섰을 텐데, `content/인프라/Continuous Profiling.md` 와 내용이 크게 겹친다. 제목은 안 겹치지만 겹치는 노트를 하나 더 만들 이유가 없다 |
| **Stream (I/O 스트림)** | `nodejs.org/api/stream.html` + `pkg.go.dev/io` 로 출처는 충분했다. 다만 `아키텍처/Back Pressure` 와 `데이터베이스/Batch vs Stream Processing` 사이에 끼어 경계가 흐려진다고 봤다. 다음 실행에서 다시 볼 만하다 |
| **Signal, Event Loop 이외의 OS 개념** | `인프라/Signal.md` 로 이미 있다 |

## 이 문서나 도구가 틀렸다고 느낀 점

### 1. 각본(scenes)이 프롬프트에 한 줄도 없다 — 새 단어마다 불변이 깨진다

`scenes/*.json` 에 각본이 **629편** 있고 직전 커밋 메시지가 "629편 전부가
그림을 갖는다" 라고 못 박는다. 그런데 `ROUTINE-PROMPT.md` 는 각본을 한 번도
언급하지 않고, `verify_new_terms.py` 도 `content/` 만 본다. 그래서 이번 실행 뒤
**631편 중 629편만 장면 컷 만화를 갖는다.** 루틴이 지시를 완벽히 따라도
매주 두 편씩 구멍이 늘어난다.

지시에 없는 일을 자동으로 하지 않는 편이 옳다고 보아 `scenes/` 는 건드리지
않았다. 사람이 정할 문제다 — 셋 중 하나일 것이다.

1. 프롬프트 5번에 "각본도 쓴다" 를 넣고 `lint_scenes.py` 를 6번 검증에 붙인다
2. 각본은 사람이 몰아서 쓰는 것으로 두고, 그 사실을 프롬프트에 명시한다
3. `build.py --dry-run` 이 "각본 없는 단어 N편" 을 같이 찍게 해서 격차가
   보이게 한다

지금은 셋 다 아니어서, 격차가 조용히 벌어진다.

### 2. `sources.allowlist.md` 의 "닿는 것 / 막힌 것" 목록이 낡았다

파일 스스로 "실행마다 달라질 수 있다" 고 적어 두었으니 결함은 아니다. 다만
이번에 **새로 닿는 도메인이 넷** 나왔고(위 표), 반대로 `cloud.google.com` 은
지난번보다 더 막혔다. 셋째 실행까지 세 번 다 같은 다섯 도메인이 나왔으므로,
목록을 "닿는 다섯 + 그때그때 찔러 볼 것" 으로 다시 쓰면 매 실행의 탐색
비용이 줄겠다.

### 3. 상한 60 은 이미 다섯 권에 닿았다 — 로드맵 전략의 여지가 좁다

공통 본문 5번은 "12권이 다 상한에 닿으면 사람이 상한을 다시 본다" 고 적었는데,
지금은 **5/12 가 이미 닿았다.** 남은 일곱 권 중 셋(제품 관리·개발 도구·웹 개발)은
클라우드 egress 로는 출처를 못 세우므로, 로드맵 루틴이 실제로 쓸 수 있는 권은
**컴퓨터과학 · 프로그래밍 · 아키텍처 · AI** 넷뿐이다. 이 넷도 40~48편이라
멀지 않아 상한에 닿는다. 상한을 다시 보거나, 얇은 권을 채울 방법(로컬 배치)을
따로 정할 시점이 곧 온다.

### 4. 검사기는 이번에도 문제 없었다

두 편 다 첫 시도에 `--strict` 통과였다. `--require=examples,aim,loop,even` 이
겨누는 네 자리는 템플릿 문서를 읽고 쓰면 걸리지 않는다는 것이 세 번째로
확인됐다. `check_template.py` 가 도해 칸 길이·마디 수·`@` 자리를 정확히 재준
덕에 눈으로 셀 일이 없었다.
