# 출처 허용 목록

자동 단어 수집 루틴과 검증자가 함께 읽는 파일이다.
여기 없는 출처를 인용한 단어는 검증에서 탈락한다.

원칙: **1차 출처만.** 표준 문서와 공식 문서. 해설이 아니라 정의의 원본.
각 단어는 서로 다른 도메인의 출처를 **최소 2개** 인용해야 한다.

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
