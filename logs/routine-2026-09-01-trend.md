# 2026-09-01 · vocab-trend (최신 실무 용어)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 첫 시도에서 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| Coroutine (코루틴) | `content/컴퓨터과학/Coroutine.md` | `cs--coroutine` |
| Structured Concurrency (구조적 동시성) | `content/컴퓨터과학/Structured Concurrency.md` | `cs--structured-concurrency` |

## 권별 단어 수 (1번 단계, `build.py --dry-run`)

시작 636개 → 638개.

```
컴퓨터과학 기초 41(→43)   프로그래밍 41        네트워크 76      웹 개발 34
데이터베이스 69           아키텍처 패턴 48      보안·인증 84     클라우드 61
인프라·운영 80            개발 도구 32          AI·LLM 42       제품 관리 28
```

상한(60) 초과는 다섯 권 그대로다 — 네트워크 76, 데이터베이스 69, 보안 84,
클라우드 61, 인프라 80. 후보에서 뺐다. 남은 일곱 권 중 얇은 순서는 제품 관리 28,
개발 도구 32, 웹 개발 34, 프로그래밍 41, 컴퓨터과학 41, AI 42, 아키텍처 48이다.

## egress — 이번 세션에서 닿은 것

70여 개 도메인을 찔러 봤다. **닿는 집합이 지난 실행보다 또 넓어졌다.**

- 닿음: `kotlinlang.org`, **`developer.apple.com`**, `developer.android.com`,
  `pkg.go.dev`, `nodejs.org`, `pypi.org`, `registry.npmjs.org`,
  `json-schema.org`, `raw.githubusercontent.com`(200), `yarnpkg.com`,
  `swift.org`(302), `spring.io`, `www.docker.com`, `gitlab.com`(301),
  `cloud.google.com`(루트만 — 문서는 `docs.cloud.google.com` 으로 넘어가고 그쪽은 막힘)
- 막힘(CONNECT 403): MDN, W3C, WHATWG, RFC/IETF, OWASP, `web.dev`,
  `modelcontextprotocol.io`, `docs.anthropic.com`, `platform.openai.com`,
  `openai.com`, `anthropic.com`, `arxiv.org`, `huggingface.co`,
  `opentelemetry.io`, `openfeature.dev`, `containers.dev`, `docs.github.com`,
  `docs.pypi.org`, `docs.deno.com`, `bun.sh`, `deno.com`, `biomejs.dev`,
  `playwright.dev`, `vitest.dev`, `pnpm.io`, `turbo.build`, `nx.dev`,
  `astro.build`, `htmx.org`, `tailwindcss.com`, `dart.dev`, `openjdk.org`,
  `docs.gradle.org`, `docs.spring.io`, `docs.swift.org`, `tc39.es`,
  `webassembly.org`, `khronos.org`, `ecma-international.org`, `iana.org`,
  `unicode.org`, `kernel.org`, `sqlite.org`, `semver.org`, `12factor.net`,
  `sre.google`, `scrumguides.org`, `kanbanguides.org`, `agilemanifesto.org`,
  `trunkbaseddevelopment.com`, `conventionalcommits.org`, `opencontainers.org`,
  `helm.sh`, `jenkins.io`, `circleci.com`, `about.gitlab.com`, `dora.dev`,
  `agents.md`, `github.blog`, `developer.hashicorp.com`(403), `grafana.com`,
  `prettier.io`, `spec.openapis.org`, `esbuild.github.io`, `jetbrains.com`

**`developer.apple.com` 이 이번 실행을 만들었다.** 스위프트의 1차 출처가 하나
열리면서, 코틀린 문서 하나로는 둘째 도메인을 못 세우던 동시성 개념들이 후보가
됐다. (`docs.swift.org` 의 Swift book 은 여전히 막혀 있지만, API 레퍼런스인
`developer.apple.com/documentation/swift/...` 는 열린다. HTML 은 껍데기만
오므로 `developer.apple.com/tutorials/data/documentation/swift/<이름>.json`
을 읽으면 본문이 그대로 나온다.)

## 후보와 판단

### 고른 것

**Coroutine (코루틴)** · **Structured Concurrency (구조적 동시성)** — 둘을 한 쌍으로
골랐다. 컴퓨터과학 권에 `Concurrency`·`Async-Await`·`Thread`·`Multi-thread`·
`Blocking vs Non-blocking`·`Event Loop` 가 다 있는데, **요즘 언어들이 실제로
쓰는 동시성 단위와 그 단위를 관리하는 원칙이 통째로 비어 있었다.** 12권 전수
grep 에서 `coroutine`·`코루틴`·`structured concurrency`·`구조적 동시성` 이
파일명·H1·본문 어디에도 한 번도 안 나왔다.

트렌드성은 "새로 생긴 말" 이 아니라 **"지금 표준이 된 말"** 로 잡았다. 코루틴은
코틀린 1.3 이후 안드로이드의 권장 비동기 방식이고, 구조적 동시성은 코틀린과
스위프트가 **각자의 공식 문서에서 같은 이름으로 같은 원칙을 규정**한다.
서로 독립적인 두 조직이 같은 용어를 규범으로 쓴다는 것이 이 말이 유행어가
아니라는 증거라고 봤다.

출처는 각각 서로 다른 두 도메인에서 섰다.

- 코루틴 — `kotlinlang.org/docs/coroutines-basics.html` ("A coroutine is a
  suspendable computation…", 스레드 대비 메모리 수치 5만 개 = 100GB vs 500MB) +
  `developer.android.com/kotlin/coroutines` ("a concurrency design pattern…",
  메인 스레드 차단과 ANR, 스코프 규칙).
- 구조적 동시성 — `developer.apple.com/documentation/swift/taskgroup`
  ("Structured concurrency is a way to organize your program, and tasks, in
  such a way that tasks don't outlive the scope in which they are created.") +
  `kotlinlang.org` (부모-자식 나무와 수명 결합, 재귀적 취소) +
  `developer.android.com` (취소가 계층을 따라 전파).

두 편이 서로를 받쳐 준다. 코루틴 편의 그림은 "멈췄다 이어 한다" 는 **형태**를,
구조적 동시성 편의 그림은 "안쪽은 바깥쪽보다 오래 못 산다" 는 **포함 관계**를
그린다. 서로 `[[링크]]` 로 걸었다.

인용문은 쓰고 나서 원문을 다시 열어 **26개 문장을 문자열로 대조**했다. 전부
원문에 그대로 있다(따옴표·공백 정규화 후 일치).

### 버린 것

- **MCP (Model Context Protocol)** — 이번 전략에 가장 잘 맞는 후보였고 출처도
  섰다(`pypi.org/pypi/mcp/json` 과 `registry.npmjs.org/@modelcontextprotocol/sdk`
  의 공식 README 두 개, 서로 다른 도메인). 그런데 **이미 있다** —
  `content/네트워크/MCP.md`. 08-25 실행에서도 같은 자리에서 걸렸다.
  "권 이름만 보고 판단하지 마라" 가 두 번 연속 맞았다.
- **Streamable HTTP** — MCP 의 표준 전송이고 두 SDK README 가 다 규정한다.
  그런데 제자리가 네트워크 권이고(같은 권에 `SSE`·`Long Polling`·`WebSocket`
  이 있다) 그 권은 76편으로 상한 초과다. 상한을 피하려고 웹 개발 권에 넣는 것은
  분류를 비트는 일이라 안 했다.
- **OpenTelemetry** — `pypi.org/pypi/opentelemetry-sdk` 와
  `registry.npmjs.org/@opentelemetry/api` 로 두 도메인이 섰지만
  `content/인프라/OpenTelemetry.md` 로 이미 있다.
- **uv · Ruff (Astral)** — pypi 는 열리는데 둘째 도메인이 없다. npm 의 `uv` 와
  `ruff` 는 **동명이인**이다(각각 "Ultrafast UTF-8 data validation", "Coroutine
  with ES6 generators"). 08-25 실행은 `@astral-sh/uv` 가 404 인 것만 봤는데,
  이름이 같은 남의 패키지를 출처로 쓰는 사고가 가능한 자리다. 버렸다.
- **Function Calling · Structured Output** — 트렌드성 최상급인데 근거를 또 못
  세웠다. `pypi.org/pypi/anthropic` 의 README 는 1,327자짜리 안내문이라
  "tool" 도 "structured" 도 한 번 안 나온다. `platform.openai.com`,
  `docs.anthropic.com`, `ai.google.dev` 다 막혔다. 08-25 와 같은 결론이다.
- **Vertex AI · Gemini 계열** — `cloud.google.com` 은 루트만 200 이고 실제
  문서는 `docs.cloud.google.com` 으로 301 되는데 그쪽이 403 이다. 허용 목록의
  "cloud.google.com(문서에 한함)" 은 이 세션에서 사실상 못 쓴다.
- **Devcontainer · Conventional Commits · Corepack · Zero-Install** — 개발 도구
  권(32편)이 얇아서 계속 노렸지만 `containers.dev`·`conventionalcommits.org`·
  `docs.npmjs.com` 이 다 막혔다. `yarnpkg.com` 이 처음 열렸으나 Yarn 단독
  도메인이라 둘째 도메인을 못 세운다.
- **Virtual Thread (Java 21)** — 코루틴과 짝이 되는 최고의 후보였는데
  `openjdk.org`·`docs.oracle.com`·`dev.java`·`docs.spring.io` 가 전부 막혔다.
  `spring.io` 루트는 열리지만 거기 있는 것은 블로그·제품 소개라 1차 출처가 아니다.
- **Kotlin Multiplatform** — `kotlinlang.org` + `developer.android.com` 으로
  출처는 섰다. 다만 이번에 고른 두 편이 같은 권의 같은 계열이라 셋째까지
  코틀린 문서에 기대는 것은 편중이라고 봤고, 회당 2개 규칙에도 걸린다.
  다음 실행에서 프로그래밍 권 후보로 남겨 둔다.

## 이 문서나 도구가 틀렸다고 느낀 점

1. **`sources.allowlist.md` 의 "닿은 것 / 막힌 것" 목록이 낡았다.** 그 절이
   스스로 "실행마다 달라질 수 있다" 고 적어 두긴 했지만, 지금은 실제와 꽤
   벌어졌다 — `kotlinlang.org`(08-27·08-30·오늘), `developer.android.com`,
   `developer.apple.com`, `swift.org`, `yarnpkg.com` 이 열리는데 목록에는
   아예 이름이 없다. 세 실행 연속 열린 도메인은 사람이 목록에 정식으로
   올려 주면 다음 루틴이 탐색에 쓰는 시간을 줄일 수 있다.
   (특히 `developer.apple.com` 은 스위프트·iOS 계열 단어를 여는 열쇠다.)
2. **`raw.githubusercontent.com` 이 200 으로 열린다.** 규격을 만든 조직의 공식
   저장소 원문(예: `modelcontextprotocol/modelcontextprotocol` 의 스펙 문서)을
   읽을 수 있다는 뜻이다. 허용 목록의 도메인 열거에는 없고, "그 기술을 만든
   조직이 직접 운영하는 문서인가" 기준으로는 통과할 것도 같다. **애매해서
   이번에는 인용하지 않았고 도달 확인용으로만 썼다.** 사람이 판단해서 목록에
   한 줄 적어 주면(허용이든 금지든) 다음 실행부터 고민이 없다.
3. **패키지 레지스트리를 출처로 쓸 때의 함정 하나.** 08-25 가 연 길(공식 SDK 가
   pypi 와 npm 에 동시에 있으면 두 도메인이 선다)은 좋은데, **이름이 같은 남의
   패키지**를 잡을 수 있다. 오늘 `npm:uv` 와 `npm:ruff` 가 정확히 그랬다.
   허용 목록의 레지스트리 항목에 "그 프로젝트가 직접 올린 패키지인지
   repository/homepage 로 확인할 것" 한 줄이 있으면 좋겠다.
4. 도구 자체는 이번에도 정확했다. `check_template.py` 와 `verify_new_terms.py`
   는 두 편 다 첫 시도에 통과시켰고, 잘못 통과시킨 자리는 못 찾았다.
