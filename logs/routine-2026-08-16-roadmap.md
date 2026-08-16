# 2026-08-16 단어 수집 루틴

추가 2개 — `tool--package-manager`, `db--connection-pool`

## 1. 시작 시점 권별 단어 수 (227개)

| 권 | 이름 | 개수 |
|---|---|---|
| cs | 컴퓨터과학 기초 | 21 |
| lang | 프로그래밍 | 19 |
| net | 네트워크 | 30 |
| web | 웹 개발 | 13 |
| db | 데이터베이스 | 10 |
| arch | 아키텍처 패턴 | 20 |
| sec | 보안 · 인증 | 34 |
| cloud | 클라우드 | 13 |
| infra | 인프라 · 운영 | 13 |
| tool | 개발 도구 | 8 |
| ai | AI · LLM | 27 |
| pm | 제품 관리 | 19 |

끝난 뒤: tool 8 → 9, db 10 → 11, 합계 227 → 229. 40개를 넘는 권은 없다(sec 34 가 최대).

## 2. 이번 실행을 지배한 제약 — 출처 도메인이 대부분 막혀 있다

`tools/sources.allowlist.md` 가 허용하는 도메인 대부분이 이 세션의 egress 정책에
막혀 있었다. 프록시가 CONNECT 에 403 을 돌려준다(`/root/.ccr/README.md` 는 정책
거부를 우회하지 말고 보고하라고 한다).

막힌 것 — `developer.mozilla.org`, `rfc-editor.org`, `datatracker.ietf.org`,
`w3.org`, `whatwg.org`, `owasp.org`, `csrc.nist.gov`, `cwe.mitre.org`,
`postgresql.org`, `dev.mysql.com`, `redis.io`, `mongodb.com`, `sqlite.org`,
`git-scm.com`, `docs.github.com`, `docs.npmjs.com`, `packaging.python.org`,
`kubernetes.io`, `docs.docker.com`, `nginx.org`, `httpd.apache.org`,
`docs.aws.amazon.com`, `learn.microsoft.com`, `docs.cloud.google.com`,
`go.dev`, `react.dev`, `docs.python.org`, `grpc.io`, `graphql.org`,
`arxiv.org`, `huggingface.co`, `platform.openai.com`, `modelcontextprotocol.io`,
`opentelemetry.io`, `prometheus.io`, `developer.hashicorp.com`, `oauth.net`,
`openid.net`, `semver.org`, `eslint.org`.

닿은 것 — `nodejs.org`, `pkg.go.dev`, `json-schema.org`, `pypi.org`,
`registry.npmjs.org`, `cloud.google.com`(문서는 `docs.cloud.google.com` 으로
넘어가면서 막힘).

그래서 **후보 선정이 "무엇이 중요한가" 가 아니라 "무엇을 1차 출처로 확인할 수
있는가" 로 한 번 더 걸러졌다.** 아래 탈락 목록의 상당수가 이 이유다.

## 3. 검토한 후보

얇은 권(tool 8, db 10, cloud/infra/web 13)을 우선으로 roadmap.sh 계열 커리큘럼의
빠진 핵심 개념을 훑었다.

### 고른 것

**Package Manager (패키지 매니저) → tool** — 가장 얇은 권(8개)이고, 이 권에는
CLI·Git·IDE·SDK·Terminal 이 있는데 정작 매일 치는 `npm install` 이 없었다.
`content/프로그래밍/Package.md`("Package / Module")와는 다른 개념이다 — 그쪽은
코드를 묶는 단위이고, 이쪽은 그 단위를 받아다 놓는 도구다. 제목·파일명·괄호
원어 셋 다 겹치지 않고 slug 도 `tool--package-manager` 로 충돌 없음.
결정적으로 `nodejs.org` 와 `pkg.go.dev` 가 둘 다 열려 있어 1차 출처 2개를
실제로 읽을 수 있었다.

**Connection Pool (커넥션 풀) → db** — 두 번째로 얇은 권(10개). DB·SQL·Index·
Transaction·ORM 이 있는데 "왜 연결을 돌려쓰는가" 가 없었다. 백엔드에서 장애
원인으로 가장 자주 나오는 자리 중 하나다. `Socket`(net), `Latency`(arch) 와
붙지만 그 단어들 어디에도 풀 이야기는 없다(grep 확인). slug
`db--connection-pool` 충돌 없음.

### 버린 것

| 후보 | 버린 이유 |
|---|---|
| JOIN → db | postgresql.org, dev.mysql.com 둘 다 egress 차단. 1차 출처 0개 |
| 정규화 / Primary Key / Replication → db | 같은 이유. DB 공식 문서 도메인이 전부 막힘 |
| Linter → tool | eslint.org 차단. 기억으로 쓸 수 없어 포기 |
| Semantic Versioning → tool/lang | semver.org 차단. npm 쪽 언급만으로는 규격을 설명할 수 없다 |
| DOM / CSS / Service Worker → web | MDN·WHATWG·W3C 전부 차단 |
| Blue-Green / Canary / SLO → infra | cloud.google.com 문서가 docs 서브도메인으로 넘어가며 차단 |
| Health Check → infra | 같은 이유. 서로 다른 도메인 2개를 못 채움 |
| Prepared Statement → db | pkg.go.dev 하나는 되지만 둘째 도메인을 못 구함 |
| Event Loop → cs/lang | nodejs.org 하나뿐. 둘째 도메인(MDN) 차단 |
| WebSocket, Sharding 등 | 이미 있음(net, arch). 권 이름만 보면 없어 보이는 것들이라 grep 으로 확인 |

## 4. 인용 출처 (전부 실제로 열어 읽음)

**Package Manager**
- https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager
  — "npm is the standard package manager for Node.js", `npm install` 이
  `node_modules` 를 만들어 채운다는 것, semver 를 따른다는 것,
  `npm install <pkg>@<version>`, `npm update` 가 "a newer version that
  satisfies your versioning constraints" 를 찾는다는 것, dependencies 와
  devDependencies 의 차이, `scripts` / `npm run`.
- https://nodejs.org/api/packages.html — "A package is a folder tree described
  by a package.json file."
- https://pkg.go.dev/cmd/go — `go get` 이 "resolves its command-line arguments
  to packages at specific module versions, updates go.mod ... and downloads
  source code into the module cache", `go mod tidy` 가 빠진 모듈을 채우고 안
  쓰는 모듈을 걷어낸다는 것, `go get pkg@v1.2.3`.

서로 다른 도메인 2개(nodejs.org, pkg.go.dev) 충족.

**Connection Pool**
- https://pkg.go.dev/database/sql — "DB is a database handle representing a
  pool of zero or more underlying connections", "It's safe for concurrent use
  by multiple goroutines", "maintains a free pool of idle connections",
  `SetMaxOpenConns` / `SetMaxIdleConns` / `SetConnMaxLifetime`("Expired
  connections may be closed lazily before reuse"), "Open may just validate its
  arguments without creating a connection ... call DB.Ping()".
- https://nodejs.org/api/http.html — Agent 는 "responsible for managing
  connection persistence and reuse", 소켓이 "either destroyed or put into a
  pool", 그 갈림이 `keepAlive` 에 달렸다는 것, `maxSockets` 가 origin 당 동시
  소켓 수라는 것, 서버가 유휴 연결을 닫으면 "removed from the pool" 이라는 것,
  "unused sockets consume OS resources".

서로 다른 도메인 2개(pkg.go.dev, nodejs.org) 충족.

### 사후 대조에서 고친 문장

집필 뒤 인용한 URL 을 다시 열어 문장 단위로 대조했고, 출처에 없는 말 셋을
걷어냈다.

- Package Manager 비교표의 "안 쓰는 것 정리 / 목록에서 지우고 다시 설치" 행 —
  npm 쪽이 문서에 없는 절차라 행을 통째로 뺐다.
- Connection Pool 주의사항 "수명이 지난 연결은 닫힌다" → "닫힐 수 있다"
  (원문은 "may be closed lazily").
- Connection Pool 의 "DB 가 받아 줄 수 있는 연결 수가 정해져 있다" 두 군데 —
  사실이지만 인용한 두 문서 어디에도 없어서 뺐다. 실제 사례 항목은 재사용
  수명(SetConnMaxLifetime)으로 갈아 끼웠다.

## 5. 추가한 단어

| id | 파일 | 권 |
|---|---|---|
| `tool--package-manager` | `content/개발도구/Package Manager.md` | 개발 도구 |
| `db--connection-pool` | `content/데이터베이스/Connection Pool.md` | 데이터베이스 |

검증:

```
python3 tools/build.py
python3 tools/verify_new_terms.py --expect 2
  ok    빌드 제외 0건
  ok    단어 수 227 -> 229 (+2)
  ok    템플릿 2/2 통과
```

## 6. 사람이 볼 것 두 가지 (루틴은 tools/ 를 안 고친다)

**(1) `## 🔎 출처` 를 쓰면 검사기에서 떨어진다.**
루틴 프롬프트는 단어 맨 아래에 `## 🔎 출처` 를 남기라고 하는데,
`check_template.py` 는 REQUIRED+OPTIONAL 에 없는 H2 를 "템플릿에 없는 제목" 으로
잡는다. 실제로 DNS.md 에 붙여 보고 확인했다. 그래서 이번에는 `---` 아래
`**출처**` 문단으로 남겼다 — `build.py` 의 `clean_body` 가 `^---$` 이후를
"문서 푸터" 로 잘라내므로 앱 화면에는 안 나가고 저장소에는 남는다(빌드 결과에
URL 이 안 실린 것 확인). 둘 중 하나를 사람이 정해 주면 좋겠다:
`check_template.py` 의 OPTIONAL 에 `🔎 출처` 를 넣든지, 프롬프트를 푸터 방식으로
고치든지.

**(2) `verify_new_terms.py` 가 한글 경로의 새 파일을 못 본다.**
`new_term_files()` 가 `git diff --name-only` 결과를 쓰는데, git 이 기본
설정(`core.quotepath=true`)에서 비ASCII 경로를 `"content/\352\260..."` 로 따옴표
안에 넣어 준다. 그래서 경로가 `.md` 로 끝나지 않고, 검사기는 조용히

```
warn  새 파일이 0개다 (단어 수는 맞음)
ok    템플릿 0/0 통과
```

를 내놓는다. **템플릿을 한 편도 안 보고 통과 도장을 찍는다** — 이 저장소의 새
단어는 거의 전부 한글 폴더에 들어가므로 사실상 항상 그렇다. 이번 실행은
저장소 로컬 설정으로 `git config core.quotepath false` 를 걸어 넘겼고(추적되는
파일은 안 건드렸다), 그 뒤 `템플릿 2/2 통과` 를 받았다. `new_term_files()` 가
`git -c core.quotepath=false` 로 부르거나 `-z` 를 쓰게 고치는 게 맞겠다.

## 7. 참고

`content/IT_Expert_로드맵.md` 백로그도 훑었으나, 거기 적힌 항목 상당수는 이미
구현돼 있고 나머지는 위 egress 제약으로 1차 출처를 못 여는 것들이었다.
다음 실행에서 도메인이 열려 있다면 db 의 JOIN·정규화, tool 의 Linter,
web 의 DOM 계열이 바로 다음 후보다.
