# 2026-08-25 · vocab-trend (최신 실무 용어)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 에서도 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| A2A (Agent2Agent Protocol) | `content/AI_ML/A2A.md` | `ai--a2a` |
| TypeScript (타입스크립트) | `content/프로그래밍/TypeScript.md` | `lang--typescript` |

## 권별 단어 수 (1번 단계, `build.py --dry-run`)

시작 631개 → 633개.

```
컴퓨터과학 기초 41   프로그래밍 37(→38)   네트워크 76        웹 개발 34
데이터베이스 69      아키텍처 패턴 48      보안·인증 84       클라우드 61
인프라·운영 80       개발 도구 32          AI·LLM 41(→42)   제품 관리 28
```

상한(60)에 닿은 권이 다섯이다 — 네트워크 76, 데이터베이스 69, 보안 84,
클라우드 61, 인프라 80. 이 다섯은 후보에서 뺐다. 남은 일곱 권 중 얇은 순서는
제품 관리 28, 개발 도구 32, 웹 개발 34, 프로그래밍 37, AI·LLM 41, 컴퓨터과학 41,
아키텍처 48 이다.

## 이번 실행을 지배한 제약 — egress 정책 (네 번째 실행, 그대로다)

`sources.allowlist.md` 의 경고가 또 맞았다. 40여 개 도메인을 직접 찔러 본 결과
**닿는 것은 다섯 개뿐**이고, 지난 두 실행과 같은 다섯이다.

- 닿음(200): `pkg.go.dev`, `nodejs.org`, `pypi.org`, `registry.npmjs.org`,
  `json-schema.org`. 덤으로 `proxy.golang.org`, `api.github.com`,
  `raw.githubusercontent.com`(301), `cloud.google.com` 루트가 열린다.
- 000(CONNECT 자체가 안 됨): MDN, RFC/IETF, W3C, WHATWG, OWASP, NIST,
  `modelcontextprotocol.io`, `docs.anthropic.com`, `platform.openai.com`,
  `kubernetes.io`, `docs.docker.com`, `web.dev`, `openfeature.dev`,
  `12factor.net`, `docs.github.com`, `opentelemetry.io`, `learn.microsoft.com`,
  `arxiv.org`, `huggingface.co`, `go.dev`, `postgresql.org`, `grpc.io`,
  `protobuf.dev`, `ecma-international.org`, `iana.org`, `iso.org`,
  `agents.md`, `a2a-protocol.org`, `jsonrpc.org`, `dora.dev`, `finops.org`,
  `docs.astral.sh`, `biomejs.dev`, `vitest.dev`, `slsa.dev`, `sigstore.dev`,
  `spdx.dev`, `containers.dev`, `opencontainers.org`, `cncf.io`,
  `linuxfoundation.org`, `deps.dev`, `openjsf.org`

그래서 이번에도 후보가 **"무엇이 중요한가" 가 아니라 "다섯 도메인으로 서로 다른
출처 2개를 세울 수 있는가"** 로 결정됐다. 다만 이번에는 앞선 실행들과 달리
**패키지 레지스트리를 정면으로 썼다** — 어떤 기술의 *공식* SDK 가 pypi 와 npm 에
동시에 올라가 있으면, 그 두 README 가 서로 다른 도메인의 1차 출처 두 개가 된다.
스펙 사이트가 막혀 있어도 그 스펙을 만든 조직이 쓴 문서를 읽을 수 있는 길이다.

## 후보와 판단

### 고른 것

**A2A (Agent2Agent Protocol)** — 이번 전략(트렌드)에 가장 정확히 맞는다.
규격 1.0 이 나와 있고, 공식 SDK 가 두 생태계에 다 올라가 있다.

- `registry.npmjs.org/@a2a-js/sdk` — "the official TypeScript / JavaScript SDK
  for the A2A Protocol". README 가 길고 내용이 짙다: 서버는 능력을 내걸고
  클라이언트는 그것을 찾아 부른다, 전송 셋(JSON-RPC · HTTP+JSON/REST · gRPC),
  명함으로 전송 고르기(`createFromUrl` / `supportedInterfaces` /
  `preferredTransports`), 작업 수명(submitted → working → artifact → completed),
  스트림 이벤트(task · status-update · artifact-update), 웹훅 푸시 알림
  (`capabilities.pushNotifications`, `taskPushNotificationConfig`),
  명함 서명(JWS · JWKS), 401/403 에서 Authorization 을 붙여 재시도.
- `pypi.org/project/a2a-sdk` — "A2A Python SDK", 규격 1.0 구현과 0.3 호환,
  전송별 클라이언트·서버 지원표.

두 도메인 다 그 프로젝트가 직접 올린 공식 패키지라 "그 기술을 만든 조직의
자기 서술" 기준에 맞는다. AI·LLM 권(41편)에 중복 없음 —
`A2A`, `Agent2Agent` 를 파일명·H1·괄호 원어 세 축으로 대조했고 아무것도
안 걸렸다. slug `a2a` 도 ai 권에서 비어 있었다.

**TypeScript** — 12권 어디에도 없었다(`^# .*[Tt]ype[Ss]cript` 로 전수 grep,
`content/아키텍처/tRPC.md` 본문 언급 하나뿐). 프로그래밍 권 37편에 이 이름이
없는 것은 큰 구멍이다.

트렌드성은 "요즘 생긴 말" 이 아니라 **"요즘 달라진 것"** 쪽으로 잡았다 —
런타임이 `.ts` 를 그대로 받아 돌리기 시작한 것. `nodejs.org/api/typescript.html`
이 그 변화를 정확히 적어 둔다(타입 지우기가 v23.6.0/v22.18.0 부터 기본,
v25.2.0/v24.12.0 부터 안정, v26.0.0 에서 `--experimental-transform-types` 제거).
그리고 그 문서가 노트에 필요한 사실을 거의 다 준다: 타입 표기를 **공백으로
치환**한다, **타입 검사는 하지 않는다**, 그래서 소스맵이 필요 없다,
지울 수 없는 문법(`enum` · 값이 든 `namespace` · 매개변수 속성 · import 별칭 ·
데코레이터)은 오류, `import type` 을 안 적으면 실행 중 오류,
`node_modules` 안의 TypeScript 파일은 아예 안 다룬다.

### 버린 것

- **MCP** — 이미 있다. `content/네트워크/MCP.md`. 후보로 올렸다가 grep 에서
  걸렸다. 전략 문단의 "권 이름만 보고 판단하지 마라" 가 정확히 이 경우다 —
  AI·LLM 권만 봤으면 없다고 결론 내렸을 것이다.
- **Structured Output** — 트렌드성은 최상급인데 **근거를 못 세웠다.**
  `platform.openai.com` 이 막혀 있어 공식 패키지 README 로 우회하려 했으나,
  `registry.npmjs.org/openai` 와 `pypi.org/project/openai` 의 README 에
  "structured output" 도 `json_schema` 도 한 번도 안 나온다.
  `registry.npmjs.org/@anthropic-ai/sdk` 는 README 가 1,948자짜리 안내문이라
  개념 서술이 없다. 기억으로 쓸 수는 없으니 버렸다.
- **uv (Astral)** — pypi 는 열리는데 `@astral-sh/uv` 가 npm 에 없다(404).
  둘째 도메인을 못 세워서 버렸다.
- **WebAssembly** — 12권에 없어서 값이 큰 후보였다. 그런데 닿는 출처가
  `nodejs.org/api/wasi.html`(WASI 클래스 API 레퍼런스)과
  `pypi.org/project/wasmtime`(임베딩 사용법)뿐이라, 정작 **"WebAssembly 가
  무엇인가" 를 정의하는 문장이 두 곳 어디에도 없다.** 정의를 기억으로 쓰게
  되므로 버렸다. `webassembly.org` 와 `w3.org` 가 열리는 날 다시 본다.
- **Structured Logging** — `pkg.go.dev/log/slog` + `pypi.org/project/structlog`
  로 근거는 섰다. 그런데 이 단어의 제자리는 인프라·운영이고 그 권은 80편으로
  상한을 넘었다. 상한을 피하려고 프로그래밍 권에 넣는 것은 분류를 비트는
  일이라 안 했다(인프라 권에 이미 `Logging` · `Log Routing` · `Observability`
  가 있다).
- **Parquet · Apache Arrow** — `pkg.go.dev` 로 Apache 모듈 문서를 읽는 방법이
  있었지만, 허용 목록의 `pkg.go.dev` 항목은 "Go 표준 라이브러리·명령 공식
  문서" 로 범위가 적혀 있다. 제3자 모듈 문서까지 늘려 잡는 것은 애매해서
  "판단이 애매하면 탈락" 을 적용했다.
- **Devcontainer · Conventional Commits · SLSA · Sigstore · FinOps · DORA** —
  전부 공식 도메인이 막혀 있고 둘째 도메인이 없다.
- **Type Stripping 을 표제어로** — 후보였으나 TypeScript 를 표제어로 두고 그
  안에서 다루는 편이 배우는 사람에게 낫다고 봤다. 같은 출처를 쓴다.

## 인용 출처

**A2A**

- https://registry.npmjs.org/@a2a-js%2Fsdk
- https://pypi.org/project/a2a-sdk/

**TypeScript**

- https://nodejs.org/api/typescript.html
- https://registry.npmjs.org/typescript

집필 뒤 두 곳을 다시 열어 문장 단위로 대조했다. 인용한 표현
("replace TypeScript syntax with whitespace", "no type checking is performed",
"source maps are unnecessary", "refuses to handle TypeScript files inside
folders under a node_modules", "agents exposing their capabilities",
"fetches the agent card", "POSTs every task", "signed using JWS",
"retry on 401/403")이 지금도 원문에 그대로 있는 것을 확인했다.

## 이 문서·도구가 틀렸다고 느낀 점

1. **`pkg.go.dev` 항목의 범위가 좁게 적혀 있다.** 허용 목록은 "Go 표준
   라이브러리·명령 공식 문서" 라고 적어 뒀는데, 실제로 `pkg.go.dev` 는 아무
   Go 모듈의 공식 문서(그 프로젝트가 쓴 주석)를 렌더링한다. 이번에
   Apache Arrow/Parquet 후보를 여기서 버렸다. 사람이 판단해서, 늘릴 것이면
   "그 프로젝트가 스스로 쓴 패키지 문서" 까지로 한 줄 고쳐 주면 좋겠다.
   지금 상태로도 일은 되지만, 매주 같은 자리에서 후보 하나씩 버리게 된다.

2. **패키지 레지스트리가 이 세션에서 가장 값진 출처인데 목록에서는 곁다리다.**
   허용 목록에 `pypi.org`, `registry.npmjs.org` 가 "패키지 레지스트리 공식
   메타데이터" 로 적혀 있다. 그런데 클라우드 루틴에서는 이 둘이 사실상
   **유일하게 열려 있는 1차 출처 창구**다. 어떤 규격의 공식 SDK 가 양쪽에 다
   올라가 있으면 서로 다른 도메인 두 개가 서고, 그 README 는 그 조직이 직접
   쓴 문서다(이번 A2A 가 그 경우다). 이 사용법을 목록에 한 줄 적어 두면
   다음 실행들이 후보를 훨씬 빨리 좁힌다.

3. **README 의 두께가 후보 선정의 실제 기준이 된다.** 같은 "공식 패키지" 라도
   `@a2a-js/sdk` 는 15KB 짜리 개념 설명이고 `typescript` 는 README 가 아예
   비어 있어 한 줄짜리 description 뿐이다. TypeScript 편의 둘째 출처는
   그래서 얇다 — 형식상 두 도메인을 채우지만, 실질은 nodejs.org 한 곳이
   떠받친다. 이 편의 문장들은 전부 nodejs.org 에서 확인되는 것만 골라 썼고
   (편집기 자동완성 같은 흔한 주장은 근거가 없어 일부러 뺐다), 그래서 통과
   시켰다. 다만 규칙이 "도메인 2개" 만 세는 한 이런 얇은 짝은 계속 나온다.

4. **검사기·문서는 이번에 어긋난 데가 없었다.** 두 편 다 첫 검사에서
   `--strict` 경고 0으로 통과했다. 템플릿 문서에 적힌 것(도해 제목은 물음,
   `<` 는 응답이 실제로 돌아올 때만, 대조 왼쪽 칸에 장점 금지, 접이식 6칸)이
   그대로 검사기 코드와 맞는다. 다만 `### 예` 의 "굵게·링크·코드·목록을 쓰지
   않는다" 는 검사기가 안 잰다 — 처음에 백틱을 썼다가 문서를 다시 읽고
   고쳤다. 형식 규칙 중 기계가 안 재는 몇 개가 남아 있다는 뜻이다.
