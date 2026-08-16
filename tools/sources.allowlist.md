# 출처 허용 목록

자동 단어 수집 루틴과 검증자가 함께 읽는 파일이다.
여기 없는 출처를 인용한 단어는 검증에서 탈락한다.

원칙: **1차 출처만.** 표준 문서와 공식 문서. 해설이 아니라 정의의 원본.
각 단어는 서로 다른 도메인의 출처를 **최소 2개** 인용해야 한다.

## ⚠️ 클라우드 루틴에서는 대부분 막혀 있다

2026-08-16 첫 실행에서 확인한 것이다. 클라우드 세션의 egress 정책이 아래 목록의
**대부분을 CONNECT 단계에서 403 으로 막는다.** 정책을 우회하지 마라 — 못 여는
출처는 못 여는 것으로 보고하고 다른 후보를 골라라.

**닿은 것** — `nodejs.org`, `pkg.go.dev`, `json-schema.org`, `pypi.org`,
`registry.npmjs.org`, `cloud.google.com`(문서 서브도메인으로 넘어가면 막힘)

**막힌 것** — MDN, RFC/IETF, W3C, WHATWG, OWASP, NIST, MITRE,
`postgresql.org`, `dev.mysql.com`, `redis.io`, `mongodb.com`, `sqlite.org`,
`git-scm.com`, `docs.npmjs.com`, `packaging.python.org`, `kubernetes.io`,
`docs.docker.com`, `nginx.org`, `httpd.apache.org`, `docs.aws.amazon.com`,
`learn.microsoft.com`, `go.dev`, `react.dev`, `docs.python.org`, `grpc.io`,
`graphql.org`, `arxiv.org`, `huggingface.co`, `platform.openai.com`,
`modelcontextprotocol.io`, `opentelemetry.io`, `prometheus.io`,
`developer.hashicorp.com`, `oauth.net`, `openid.net`, `semver.org`, `eslint.org`

그래서 **후보 선정이 "무엇이 중요한가" 가 아니라 "무엇을 1차 출처로 확인할 수
있는가" 로 한 번 더 걸러진다.** 이건 제약이지 결함이 아니다. 근거를 못 여는 단어를
기억으로 쓰는 것보다, 이번 주에 한 개만 넣거나 빈손으로 끝나는 편이 낫다.

막힌 도메인 목록은 실행마다 달라질 수 있다. 실제로 열어 보고 판단해라.

## 허용

### 표준화 기구
- `rfc-editor.org`, `datatracker.ietf.org` — RFC / IETF
- `w3.org` — W3C 표준
- `whatwg.org` — HTML/DOM 리빙 스탠더드
- `ecma-international.org` — ECMAScript 등
- `iso.org` — ISO 표준 (초록만 공개라도 인용 가능)
- `ietf.org`, `iana.org`

### 보안
- `owasp.org` — OWASP
- `nvd.nist.gov`, `csrc.nist.gov`, `nist.gov` — NIST
- `cve.org`, `cwe.mitre.org`, `attack.mitre.org` — MITRE

### 웹 플랫폼 문서
- `developer.mozilla.org` — MDN (브라우저·웹 표준 사실상의 참조 문서)

### 프로젝트 공식 문서 (해당 기술의 자기 서술)
- `kubernetes.io`, `docker.com/docs`, `docs.docker.com`
- `git-scm.com`
- `nginx.org`, `httpd.apache.org`
- `postgresql.org`, `mysql.com/doc`, `dev.mysql.com`, `redis.io`, `mongodb.com/docs`
- `react.dev`, `nodejs.org`, `python.org/doc`, `docs.python.org`
- `graphql.org`, `grpc.io`, `openapis.org`, `json-schema.org`
- `pkg.go.dev` — Go 표준 라이브러리·명령 공식 문서
- `pypi.org`, `registry.npmjs.org` — 패키지 레지스트리 공식 메타데이터
- `oauth.net`, `openid.net`
- `prometheus.io`, `grafana.com/docs`, `opentelemetry.io`
- `terraform.io`, `developer.hashicorp.com`
- 그 밖의 프로젝트도 **그 기술의 공식 도메인 문서**라면 같은 자격으로 허용한다.
  판단 기준: 그 기술을 만든 조직이 직접 운영하는 문서인가.

### 클라우드 공식 문서
- `docs.aws.amazon.com`, `aws.amazon.com` (문서·아키텍처 센터에 한함)
- `cloud.google.com` (문서에 한함)
- `learn.microsoft.com`, `azure.microsoft.com` (문서에 한함)

### AI · LLM 공식 문서
- `platform.openai.com/docs`, `openai.com/research`
- `docs.anthropic.com`, `anthropic.com/research`
- `modelcontextprotocol.io` — MCP 스펙
- `arxiv.org` — 원 논문 (개념의 출처가 논문일 때. 예: Transformer → Attention Is All You Need)
- `huggingface.co/docs` (문서에 한함)

## 제외

- 개인·기업 블로그 (기술 블로그 포함. Medium, velog, Dev.to, 회사 엔지니어링 블로그)
- 튜토리얼·강의 사이트 (W3Schools, GeeksforGeeks, freeCodeCamp, Udemy, 인프런 등)
- 백과사전 (Wikipedia 포함 — 출발점으로는 좋지만 인용 출처로는 불가)
- Q&A (Stack Overflow, Reddit)
- AI 생성 요약 사이트
- 뉴스 기사 (발표 사실 확인용으로도 공식 발표문을 대신 인용할 것)

## 판단이 애매하면

탈락시킨다. 이 목록에 추가하고 싶은 출처가 있으면 사람이 커밋으로 추가한다.
루틴은 이 파일을 수정하지 않는다.
