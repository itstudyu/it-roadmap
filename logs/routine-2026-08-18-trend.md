# 2026-08-18 · vocab-trend (최신 실무 용어)

추가 2편. 검증 통과 (`verify_new_terms.py --expect 2`), 두 편 다 `--strict` 에서도 경고 0.

## 이번에 추가한 단어

| 단어 | 파일 | id |
|---|---|---|
| Post-Quantum Cryptography (양자내성암호) | `content/보안/Post-Quantum Cryptography.md` | `sec--post-quantum-cryptography` |
| JSON Schema | `content/데이터_형식/JSON Schema.md` | `lang--json-schema` |

## 권별 단어 수 (시작 시점, `build.py --dry-run`)

전체 327개 → 329개.

```
컴퓨터과학 기초 40   프로그래밍 19(→20)   네트워크 43   웹 개발 34
데이터베이스 34      아키텍처 패턴 20      보안·인증 34(→35)   클라우드 13
인프라·운영 13       개발 도구 31          AI·LLM 27     제품 관리 19
```

상한(60) 에 닿은 권은 없다. 가장 얇은 권은 클라우드·인프라(각 13)인데, 아래 출처
제약 때문에 이번에는 두 권 다 채우지 못했다.

## 이번 실행을 지배한 제약 — egress 정책

`sources.allowlist.md` 의 경고가 이번에도 그대로였다. 실제로 열어 본 결과
**허용 목록 중 클라우드 세션에서 닿는 도메인은 다섯 개뿐**이다.

- 닿음: `nodejs.org`, `pkg.go.dev`, `json-schema.org`, `pypi.org`, `registry.npmjs.org`
- CONNECT 403: MDN, RFC/IETF, W3C, WHATWG, OWASP, NIST, `opentelemetry.io`,
  `kubernetes.io`, `docs.docker.com`, `developer.hashicorp.com`, `semver.org`,
  `openapis.org`, `12factor.net`, `sre.google`, `scrumguides.org`,
  `openfeature.dev`, `prometheus.io`, `grafana.com`, `iana.org`, `unicode.org`,
  `gnu.org`, `docs.python.org`, `peps.python.org`, `packaging.python.org`,
  `docs.github.com`, `graphql.org`, `protobuf.dev`, `webassembly.org`,
  `openai.com`, `ai.google.dev`, `aws.amazon.com`, `azure.microsoft.com`
- `cloud.google.com` 은 **루트만** 200 이고 `/…/docs/…` 로 들어가면 막힌다.
  허용 목록에 "문서 서브도메인으로 넘어가면 막힘" 이라고 적힌 것보다 더 좁다 —
  같은 도메인의 문서 경로 자체가 막힌다.
- `docs.anthropic.com` 은 403 (막힘과 구분되게 게이트웨이가 답을 준다).

그래서 후보 선정이 "무엇이 중요한가" 가 아니라 **"다섯 도메인으로 서로 다른
출처 2개를 세울 수 있는가"** 로 결정됐다.

## 후보와 판단

### 고른 것

**Post-Quantum Cryptography** — 트렌드 조건(공식 스펙·공식 문서 존재)을 가장 확실히
만족한다. Go 표준 라이브러리 `crypto/mlkem` 이 ML-KEM 을 FIPS 203 으로 못 박고,
`crypto/tls` 가 "Go 1.24부터 기본값에 X25519MLKEM768 하이브리드가 들어간다" 고
적어 둔다. Node.js 는 `encapsulate`/`decapsulate` 와 `ml-kem-*` 키 타입,
`crypto.sign` 의 "ML-DSA signing" 지원을 문서화한다. 두 도메인 다 허용 목록에 있고
표준 라이브러리 문서라 "그 기술을 만든 조직의 자기 서술" 기준에도 어긋나지 않는다.
보안 권(34편)에 중복 없음 — `Encryption`, `SSL_TLS`, `Certificate`, `mTLS` 를
파일명·H1·괄호 원어 세 축으로 대조했고 겹치는 것이 없었다.

**JSON Schema** — `json-schema.org` 가 스펙 원본이고, `pypi.org` 의 파이썬 구현
페이지가 두 번째 도메인이 된다. 트렌드성은 "최근에 생긴 말" 이라기보다
"최근 몇 년 사이에 실무 기본기가 된 말" 쪽이다(OpenAPI 3.1 이 2020-12 판을 그대로
품고, 모델 출력 고정에도 같은 스키마가 쓰인다). 이 판단은 강하지 않으므로 사람이
다시 볼 여지가 있다고 적어 둔다. 중복 확인: `content/데이터_형식/JSON.md` 와 별개
단어이고 slug 도 `lang--json` / `lang--json-schema` 로 갈린다. `웹개발/OpenAPI.md`
가 본문에서 JSON Schema 를 한 문단 설명하지만 자기 파일은 없었다.

### 버린 것

- **OpenTelemetry** — 인프라 권(13편, 가장 얇음)에 가장 넣고 싶었다. `opentelemetry.io`
  가 막혔다. `registry.npmjs.org/@opentelemetry/api` 의 README 는 열리지만 그것만으로는
  "신호 셋(트레이스·메트릭·로그)" 같은 정의를 세울 수 없고, 두 번째 도메인도 못 세운다.
- **구조화 로깅(Structured Logging)** — `pkg.go.dev/log/slog` 라는 좋은 1차 출처가 있는데,
  기존 `content/인프라/Logging.md` 가 이미 `📊 비교: 평문 로그와 구조화 로그` 절로
  같은 내용을 다룬다. 제목은 안 겹치지만 내용이 겹쳐서 버렸다.
- **Passkey / WebAuthn** — `w3.org`, `fidoalliance.org` 둘 다 막힘.
- **eBPF, GitOps, Service Mesh, Terraform/IaC, WebAssembly, SBOM, Sigstore/SLSA,
  Apache Iceberg, DuckDB** — 전부 공식 도메인이 막혀 1차 출처를 못 열었다.
- **Prompt Caching, Structured Output(LLM), Function Calling** — 트렌드로는 가장
  강한 후보였지만 공식 문서(Anthropic·OpenAI·Vertex AI)가 전부 막혀 있다.
  기억으로 쓰지 않고 버렸다.

## 인용한 출처 (실제로 열어서 읽음)

Post-Quantum Cryptography

- https://pkg.go.dev/crypto/mlkem — "quantum-resistant key encapsulation method
  ML-KEM (formerly known as Kyber), as specified in NIST FIPS 203", ML-KEM-768 권장,
  Encapsulate/Decapsulate 예제
- https://pkg.go.dev/crypto/tls — "From Go 1.24, the default includes the
  X25519MLKEM768 hybrid post-quantum key exchange", `GODEBUG=tlsmlkem=0`,
  Go 1.26 의 SecP256r1MLKEM768, CurveID 가 "hybrid post-quantum KEMs" 까지 확장됨
- https://nodejs.org/docs/latest/api/crypto.html — `crypto.encapsulate`/`decapsulate`,
  `ml-kem-512`/`768`/`1024`, ML-DSA·SLH-DSA 키 타입, "Add support for ML-DSA signing"
- https://nodejs.org/docs/latest/api/tls.html — `ecdhCurve` 에 `X25519MLKEM768`

JSON Schema

- https://json-schema.org/draft/2020-12/json-schema-core — `application/schema+json`,
  키워드 다섯 갈래(identifiers·assertions·annotations·applicators·reserved locations),
  "An instance can only fail an assertion that is present in the schema",
  `$schema`/`$vocabulary`/dialect, 모르는 키워드는 주석으로 수집됨
- https://json-schema.org/draft/2020-12/json-schema-validation — `type`·`enum`·
  `required`·`minimum`·`maxLength`, `maxLength` 가 숫자에는 안 걸린다는 예제,
  format 은 기본이 Format-Annotation 어휘
- https://pypi.org/project/jsonschema/ — Draft 2020-12 지원,
  `'Invalid' is not of type 'number'` 예제, `check-jsonschema` 명령줄 도구,
  "the mere presence of these dependencies … do not activate format checking"

### 출처에 안 기댄 문장

정직하게 적어 둔다. 양자내성암호 편의 **"오늘 오간 암호문을 받아 적어뒀다가 나중에
푼다"** 는 위 네 문서에 그대로 적혀 있지 않다. 널리 확립된 사실(harvest now,
decrypt later)이고 이 단어가 존재하는 이유 자체라 넣었지만, 인용으로 뒷받침한
문장은 아니다. 나머지 문장은 전부 위 URL 을 다시 열어 대조했다.

## 도구·문서에 대해 느낀 점

1. **허용 목록의 "막힌 것" 목록이 실제보다 낙관적이다.** `cloud.google.com` 이
   "문서 서브도메인으로 넘어가면 막힘" 으로 적혀 있는데, 실제로는 같은 도메인의
   `/*/docs/*` 경로가 통째로 막힌다. 클라우드 3사 문서를 근거로 쓰는 후보는 클라우드
   루틴에서 사실상 전부 불가능하다. 목록을 갱신하거나, "클라우드 루틴에서 닿는
   도메인" 을 다섯 개 화이트리스트로 뒤집어 적는 편이 후보 선정에 더 도움이 된다.

2. **`raw.githubusercontent.com` 이 열린다.** 확인했다 —
   `open-telemetry/opentelemetry-specification` 의 README 가 200 으로 받아진다.
   그 조직이 직접 운영하는 저장소의 규범 문서라 "그 기술을 만든 조직이 직접 쓴
   문서" 기준에는 맞지만, 도메인은 GitHub 것이라 허용 목록의 "공식 도메인 문서"
   문구와 어긋난다. 애매해서 **이번에는 쓰지 않았다.** 다만 이게 허용되면 막혀 있는
   프로젝트(OpenTelemetry, OCI, SLSA, CycloneDX 등)의 스펙 원문을 클라우드 루틴에서
   쓸 수 있게 되므로, 사람이 한 번 판단해서 목록에 넣거나 명시적으로 금지해 주면
   좋겠다. 다만 그 경우에도 "서로 다른 도메인 2개" 규칙은 여전히 걸린다 —
   두 출처가 다 `raw.githubusercontent.com` 이면 한 도메인이다.

3. **`pkg.go.dev` 항목이 표준 라이브러리로만 적혀 있다.** 지금 문구는
   "Go 표준 라이브러리·명령 공식 문서" 다. `go.opentelemetry.io/otel` 처럼 제3자
   모듈의 공식 문서도 pkg.go.dev 에 렌더링되는데 이게 허용인지 아닌지가 문구로는
   안 갈린다. 이번에는 표준 라이브러리(`crypto/mlkem`, `crypto/tls`)만 썼다.

4. **트렌드 전략이 출처 제약과 정면으로 부딪힌다.** "최신 실무 용어" 는 대개 CNCF·
   벤더·표준화 기구 문서가 원본인데 그쪽이 거의 다 막혀 있다. 반면 열려 있는 다섯
   도메인(언어 런타임·패키지 레지스트리)은 기초 용어 쪽이 강하다. 이번에는 언어
   런타임이 최신 표준을 먼저 구현한다는 점을 이용해(Go·Node 의 PQC 지원) 트렌드
   단어를 하나 세울 수 있었지만, 이 우회로가 매주 통하지는 않을 것 같다. 수요일
   루틴이 자주 빈손이 되면 그건 전략의 실패가 아니라 egress 정책의 결과다.

5. 검사기와 문서는 이번에 어긋난 곳이 없었다. 두 편 다 처음 쓴 그대로
   `--strict` 를 통과했고, `--require=examples,aim,loop,even` 도 걸리지 않았다.
