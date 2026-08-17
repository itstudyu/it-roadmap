# 단어 대량 추가 계획 — 229편 → 462편

> 세운 날: 2026-08-17
> 후보는 인터넷에서 찾았고, 기존 단어와의 대조는 눈이 아니라 스크립트가 했다.

---

## 1. 지금 어디에 있나 (측정값)

```
단어 229편 · 퀴즈 2,491문항 · 단어당 10.9문항
data/index.js 148KB (gzip 37KB, 첫 화면에서 통째로 읽는다)
data/terms/ 1.5MB (권별로 나눠 필요할 때 읽는다)
```

권별 분포가 크게 기울어 있다. 이게 이번 작업의 출발점이다.

| 권 | 단어 | | 권 | 단어 |
|---|---:|---|---|---:|
| 보안 · 인증 | 34 | | 프로그래밍 | 19 |
| 네트워크 | 30 | | 제품 관리 | 19 |
| AI · LLM | 27 | | 클라우드 | 13 |
| 컴퓨터과학 기초 | 21 | | 인프라 · 운영 | 13 |
| 아키텍처 패턴 | 20 | | 웹 개발 | 13 |
| | | | 데이터베이스 | 11 |
| | | | 개발 도구 | 9 |

**개발 도구 9편으로는 책 한 권이 안 된다.** 웹 개발 13편인데 HTML·CSS·JavaScript·DOM이
넷 다 없다. 데이터베이스 11편인데 ACID도 정규화도 JOIN도 없다. 얇은 권은 그냥 얇은 게
아니라 **기초가 비어 있다.**

---

## 2. 후보를 어떻게 찾았나

### 2.1 로드맵 15종을 통째로 대조

`roadmap.sh` 의 원본 저장소(`kamranahmedse/developer-roadmap`)에서 각 로드맵의 노드
목록을 파일 단위로 받았다. 화면은 클라이언트 렌더링이라 긁히지 않아서 저장소를 직접 읽었다.

```
backend 156 · devops 138 · software-architect 112 · ai-engineer 194
system-design 147 · cyber-security 301 · computer-science 188 · api-design 99
network-engineer 196 · data-engineer 190 · product-manager 172
software-design-architecture 94 · devsecops 94 · mlops 62 · ai-agents 101
                                              → 고유 노드 1,887개
```

이 1,887개를 기존 229편과 대조했다. 대조 축은 셋이다 — 파일명, H1 제목, H1 괄호 안 원어,
그리고 `data/index.js` 의 별칭. 대소문자·공백·한영 표기를 정규화해서 비교했다.
**1,794개가 기존에 없었다.**

### 2.2 1,794개를 233개로 줄인 기준

1,794개를 그대로 넣을 수는 없다. 대부분이 제품명(`datadog`, `artifactory`), 자격증
이름(`cissp`, `comptia-a`), 언어 이름(`ruby`, `scala`), 그리고 노드 제목이 아닌
안내문(`learn-the-basics`, `what-is-system-design`)이다. 다음을 걸렀다:

- **개념이 아닌 것을 뺐다** — 특정 벤더 제품, 자격증, 도구 브랜드. 단 이미 앱에
  Redis·Nginx·Docker가 들어 있으므로, 그 분야를 대표하고 공식 문서가 있는 것은 남겼다
  (Terraform, Prometheus, Grafana, Helm).
- **이 앱의 독자와 무관한 것을 뺐다** — 침투 테스트 실습 사이트, 포렌식 도구, 무선 공격 기법.
  독자는 아키텍처 설계로 가는 길에 있지 레드팀이 아니다.
- **기존 단어에 이미 들어 있는 것을 뺐다** — 예를 들어 `sharding` 은 데이터베이스가 아니라
  `content/아키텍처/` 에 있고, `websockets` 는 웹개발이 아니라 `content/네트워크/` 에 있다.
  권 이름만 보고 판단했으면 둘 다 중복으로 넣었을 것이다.
- **1차 출처를 못 여는 것을 뺐다** (4장 참조).

### 2.3 중복·id 충돌 검사는 스크립트가 했다

`tools/build.py` 의 `slugify()` 를 그대로 불러서 233편의 id 를 미리 계산하고
기존 229개 id 와 대조했다. **기존 id 와의 충돌 0건, 후보끼리의 충돌 0건.**

이 검사가 중요한 이유: id 는 `{권}--{제목slug}` 이고 그게 사용자 학습 기록의 열쇠다.
새 단어의 slug 가 기존 단어와 부딪히면 새 단어가 남의 id 를 빼앗고, 그 사람이 쌓아둔
진도가 엉뚱한 단어에 가서 붙는다. 조용히 일어나고 되돌릴 수 없다.

---

## 3. 넣을 233편

권별 변화:

| 권 | 현재 | 추가 | 합계 | 퀴즈 예상 |
|---|---:|---:|---:|---:|
| 컴퓨터과학 기초 | 21 | 19 | 40 | 436 |
| 프로그래밍 | 19 | 21 | 40 | 436 |
| 네트워크 | 30 | 13 | 43 | 469 |
| 웹 개발 | 13 | 21 | 34 | 371 |
| 데이터베이스 | 11 | 22 | 33 | 360 |
| 아키텍처 패턴 | 20 | 24 | 44 | 480 |
| 보안 · 인증 | 34 | 11 | 45 | 490 |
| 클라우드 | 13 | 17 | 30 | 327 |
| 인프라 · 운영 | 13 | 26 | 39 | 425 |
| 개발 도구 | 9 | 23 | 32 | 349 |
| AI · LLM | 27 | 18 | 45 | 490 |
| 제품 관리 | 19 | 18 | 37 | 403 |
| **합계** | **229** | **233** | **462** | **약 5,040** |

편차가 9~34에서 **30~45로 좁혀진다.** 얇은 권을 많이 채우도록 일부러 기울였다.
퀴즈는 단어당 10.9문항이 실측값이라 그대로 곱했다.

### 3.1 컴퓨터과학 기초 (+19)

동시성 5편이 통째로 비어 있다. Multi-thread·Concurrency는 있는데 그것들이 왜 어려운지를
설명하는 단어가 하나도 없다.

Deadlock · Mutex vs Semaphore · Race Condition · Context Switch · Blocking vs Non-blocking ·
Garbage Collection · Virtual Memory · System Call · Kernel · File System · Interrupt ·
Character Encoding · Floating Point · Linked List · Hash Table · Tree · Graph ·
Binary Search · Sorting

> Hash Table 은 기존 `Hash` 와 다르다. 기존 것은 해시 **함수**(지문 만들기)이고
> 새 것은 해시 **테이블**(자료구조)이다. 새 노트 첫 문단이 이 구분부터 해야 한다.

### 3.2 프로그래밍 (+21)

테스트라는 말이 앱 전체에 한 번도 안 나온다.

Exception · Type System · Null Safety · Scope · Closure · Interface · Generic · OOP ·
Functional Programming · Immutability · Design Pattern · SOLID · Dependency Injection ·
Unit Test · Integration Test · TDD · Refactoring · Serialization · Base64 ·
Protocol Buffers · Memory Leak

### 3.3 네트워크 (+13)

이미 30편으로 두꺼워서 구멍만 메운다. **패킷이 없다.**

Packet · HTTP 2 · HTTP 3 · QUIC · CIDR · DHCP · ARP · MAC Address · Router vs Switch ·
ICMP · Bandwidth · mTLS · Long Polling

### 3.4 웹 개발 (+21)

Frontend·Backend는 있는데 HTML·CSS·JavaScript·DOM이 없다. 이 권이 가장 이상하다.

HTML · CSS · JavaScript · DOM · Browser Rendering · Same-Origin Policy · HTTP Caching ·
Local Storage & Session Storage · Service Worker · PWA · Core Web Vitals · SSG ·
Hydration · Code Splitting · Responsive Design · Accessibility · OpenAPI · Pagination ·
API Versioning · Idempotency Key · SOAP

> Same-Origin Policy 는 기존 CORS 노트의 **전제**다. 무엇을 푸는 규칙인지 모르는 채로
> CORS 를 읽고 있었다는 뜻이다.

### 3.5 데이터베이스 (+22)

Transaction 은 있는데 ACID 가 없고, SQL 은 있는데 JOIN 이 없다.

ACID · CAP Theorem · Isolation Level · Eventual Consistency · Normalization ·
Denormalization · Primary Key & Foreign Key · JOIN · View & Materialized View ·
Stored Procedure · Replication · Partitioning · WAL · B-Tree · Query Plan · N+1 Problem ·
Migration · OLTP vs OLAP · Data Warehouse · Data Lake · ETL · Key-Value Store

### 3.6 아키텍처 패턴 (+24)

로드맵 백로그의 미등록 용어가 대부분 여기다.

High Availability · Scalability · Fault Tolerance · SLA SLO SLI · Error Budget ·
Idempotency · Retry & Exponential Backoff · Back Pressure · Bulkhead ·
Cache Aside vs Write Through · CQRS · Event Sourcing · Saga · Two-Phase Commit ·
Distributed Lock · Leader Election · Sidecar · Service Mesh · BFF · Strangler Fig ·
DDD · Clean Architecture · MVC · Twelve-Factor App

### 3.7 보안 · 인증 (+11)

이미 34편으로 가장 두껍다. 개별 공격 기법을 늘리지 않고 **원칙과 최신 기준만** 넣는다.

OWASP Top 10 · Supply Chain Attack · Least Privilege · Defense in Depth ·
Password Hashing · Secret Management · CVE · Zero-Day · Phishing · CSP · HSTS

> OWASP Top 10 은 2025년판이 최신이고, A03이 **Software Supply Chain Failures** 로
> 새로 올라왔다. Supply Chain Attack 을 같이 넣는 이유다.

### 3.8 클라우드 (+17)

서비스 이름은 있는데 **돈과 책임**이 없다. 실무에서 사고가 나는 자리가 거기다.

Shared Responsibility Model · Well-Architected · Managed Service · Cold Start ·
Egress Cost · FinOps · Spot Instance · Reserved Instance · Object Storage ·
Block Storage · Security Group · Container Registry · Managed Kubernetes ·
VPC Peering · Multi-Region · Elastic IP · Cloud Migration

### 3.9 인프라 · 운영 (+26)

Logging 하나로 운영을 다루고 있다. 관측·배포·장애 대응이 통째로 없다.

Infrastructure as Code · Terraform · Ansible · GitOps · Observability · Metric ·
Distributed Tracing · OpenTelemetry · Prometheus · Grafana · Alerting · Health Check ·
SRE · Postmortem · On-call · Runbook · Blue-Green Deployment · Canary Release ·
Rollback · Graceful Shutdown · Load Test · Chaos Engineering ·
Disaster Recovery (RTO·RPO) · Helm · Ingress · Pod

### 3.10 개발 도구 (+23)

Git 한 편으로 Git 을 다루고 있다. 브랜치도 커밋도 충돌도 없다.

Git Branch · Git Commit · Merge vs Rebase · Merge Conflict · Pull Request · Git Flow ·
Trunk Based Development · Cherry-pick · Git Stash · Git Tag · Monorepo ·
Semantic Versioning · Dependency · Lock File · Linter & Formatter · Debugger ·
Breakpoint · Shell · Dockerfile · Docker Image · Docker Volume · Docker Compose ·
Feature Flag

### 3.11 AI · LLM (+18)

RAG·Agent는 두꺼운데 **모델을 실제로 부를 때 만지는 손잡이**가 없다.

Temperature & Top-p · Structured Output · Function Calling · Chain of Thought ·
Prompt Injection · Jailbreak · Eval · Attention · Parameter Count ·
Inference vs Training · Distillation · Quantization · LoRA · Multimodal ·
Open Weight · Prompt Caching · Agent Memory · Human in the Loop

> Prompt Injection 은 보안 권이 아니라 여기에 둔다. 기존 Guardrail 과 이어지고,
> 이 권을 읽는 사람이 만나는 문제이기 때문이다.

### 3.12 제품 관리 (+18)

지표는 있는데 **재는 방법**이 없다. 4장의 출처 문제가 이 권에 몰려 있다.

Churn Rate · DAU MAU · Cohort Analysis · Conversion Rate · NPS · RICE ·
Jobs to be Done · Value Proposition · PRD · Design Thinking · Usability Test ·
Kanban · Retrospective · Definition of Done · Story Point · Stakeholder ·
Scope Creep · Competitive Analysis

---

## 4. 진짜 병목은 글쓰기가 아니라 출처다

한 편에 **서로 다른 도메인의 1차 출처 2개**가 필요하다.
233편 × 2 = **466건을 실제로 열어서 읽어야 한다.** 이게 이 작업 비용의 대부분이다.

### 4.1 좋은 소식 — 이 자리에서는 다 열린다

`tools/sources.allowlist.md` 에는 클라우드 루틴이 대부분의 도메인을 403으로 막힌다고
적혀 있다. 그래서 루틴은 회당 2편밖에 못 넣는다. **그건 클라우드 세션 얘기다.**

이 로컬 세션에서 실제로 열어 확인했다:

| 출처 | 결과 |
|---|---|
| `owasp.org/Top10/2025/` | ✅ 열림 — 2025년판 10개 항목 확보 |
| `rfc-editor.org/rfc/rfc9114` | ✅ 열림 — HTTP/3 정의 확보 |
| `developer.mozilla.org` | ✅ 열림 — Service Worker 정의 확보 |
| `kubernetes.io/docs` | ✅ 열림 |
| `opentelemetry.io/docs` | ✅ 열림 — 관측·트레이스·메트릭 정의 확보 |
| `learn.microsoft.com/azure/architecture/patterns/` | ✅ 열림 — 패턴 카탈로그 전체 확보 |
| `git-scm.com/docs` · `semver.org` · `12factor.net` | ✅ 열림 |

**대량 추가는 로컬에서 해야 한다.** 이건 이 계획의 근거이자, 왜 루틴에 맡기면 안 되는지의
이유다. 루틴 속도로는 233편에 **2년 3개월**이 걸린다.

### 4.2 아키텍처 24편의 출처 문제는 풀렸다

CQRS·Event Sourcing·Strangler Fig·Bulkhead·Sidecar·Saga·Cache-Aside·BFF의 원전은
Martin Fowler 개인 사이트인데, 허용 목록이 개인 블로그를 막고 있다.

**Azure Architecture Center 가 대체한다.** `learn.microsoft.com` 은 이미 허용 목록에
있고, 위 8개를 포함해 Retry · Leader Election · Materialized View · Rate Limiting ·
Circuit Breaker · Health Endpoint Monitoring 까지 공식 문서로 다룬다. 확인했다.

### 4.3 남는 문제 — 제품 관리 18편은 지금 규칙으로 못 들어간다

허용 목록에 제품 관리 1차 출처가 **하나도 없다.** 그리고 이 분야의 원전 상당수가
회사 사이트다. 규칙은 기업 블로그를 명시적으로 제외한다.

확인해 본 것:

| 단어 | 원전 | 현 규칙 판정 |
|---|---|---|
| Retrospective · Definition of Done · Story Point | `scrumguides.org` (Schwaber·Sutherland 공식 Scrum Guide 2020) | 규칙에 없음 → **추가하면 통과** |
| Kanban | `kanbanguides.org` | 규칙에 없음 → **추가하면 통과** |
| NPS | `netpromotersystem.com` (Bain, NPS 를 만든 곳) | 회사 사이트 → **판단 필요** |
| RICE | Intercom 블로그 | 기업 블로그 → **탈락** |
| Jobs to be Done | Christensen Institute | 판단 필요 |
| Design Thinking | IDEO / d.school | 판단 필요 |

허용 목록의 판정 기준은 "그 기술을 만든 조직이 직접 운영하는 문서인가" 다.
Bain 의 NPS 문서는 그 기준을 만족한다. 하지만 "기업 블로그 제외" 조항과 부딪힌다.
**이건 사람이 정할 일이고, 규칙 파일을 고치는 것도 사람만 한다.**

세 갈래가 있다:

- **(가) 허용 목록에 "방법론 원전" 항목을 새로 판다.** `scrumguides.org`,
  `kanbanguides.org`, `agilemanifesto.org`, `netpromotersystem.com` 을 넣는다.
  기준을 "그 개념을 만든 주체가 직접 쓴 규범 문서" 로 좁혀 쓰면 블로그 조항과 안 부딪힌다.
  → 18편 중 **약 12편**이 산다. RICE·JTBD·Design Thinking 은 여전히 탈락.
- **(나) 제품 관리를 이번 계획에서 뺀다.** 233 → 215편. 나머지 11권만 한다.
- **(다) 제품 관리에 한해 출처 기준을 낮춘다.** 권하지 않는다. 이 앱은 근거 없는 단어를
  안 넣는 것을 규칙으로 삼아 왔고, 한 권에 예외를 두면 그 규칙이 그냥 없어진다.

**(가) 를 권한다.** 다만 이건 결정이 필요하다.

### 4.4 같이 추가해야 할 허용 도메인

제품 관리와 무관하게 아래는 이번 계획의 다른 권에서도 필요하다:

| 도메인 | 필요한 단어 | 성격 |
|---|---|---|
| `web.dev` | Core Web Vitals, Browser Rendering | Chrome 팀 공식. Core Web Vitals 는 여기가 정의 원본이다 |
| `sre.google` | SLA SLO SLI, Error Budget, Postmortem, On-call, Runbook | Google SRE Book. SLI/SLO/SLA 정의 확인함 |
| `12factor.net` | Twelve-Factor App | 원전 |

---

## 5. 쓰기 전에 고쳐야 하는 것 (Phase 0)

### 5.1 루틴의 권당 40개 상한 — 지금 고치지 않으면 루틴이 죽는다

`tools/ROUTINE-PROMPT.md` 에 이렇게 적혀 있다:

> 5. 대상 권의 단어가 이미 40개 이상이면 그 권에는 추가하지 말고 다른 권을 골라라.
>    (지금은 sec 34 가 최대라 해당 없음)

이번 작업 뒤 12권 중 **6권이 40 이상**이 된다(sec 45, ai 45, arch 44, net 43, cs 40, lang 40).
루틴이 매주 후보를 고르는 폭이 좁아지고, 계속 채우면 결국 **모든 권이 막혀서 루틴이 매번
빈손으로 끝난다.** 상한을 60으로 올리고, 괄호 안의 낡은 문장을 지운다.

같은 파일의 이 문장도 낡는다:

> 지금 분포는 tool 8, db 10, cloud/infra/web 13 이 얇고 sec 34, net 30, ai 27 이 두껍다.

숫자를 박아 두지 말고 "`python3 tools/build.py --dry-run` 결과에서 가장 얇은 권을 우선한다"
로 바꾼다. 그래야 다시 낡지 않는다.

### 5.2 `vocab-related` 루틴이 되살아난다

지금 이 루틴은 할 일이 없다 — 기존 노트의 `🔗 관련 용어` 1,008개가 전부 기존 단어로
해소돼서 후보가 0이다. 233편이 새 링크를 만들면 **후보 풀이 생긴다.** 이건 고칠 게 아니라
예상되는 결과이고, 좋은 쪽이다. 루틴 재개 뒤 첫 금요일에 확인할 것.

### 5.3 `content/INDEX.md` 는 이미 낡았다

"총 **238개**" 라고 적혀 있는데 실제는 229편이다. 이번에 462편이 되면 더 벌어진다.
이 파일은 빌드에서 제외되므로 앱에는 안 나가지만 Obsidian 금고에서는 목차로 쓰인다.
**`build.py` 가 이 파일도 생성하게 만들어서** 다시 낡지 않게 한다.

### 5.4 대량 검증기

`tools/verify_new_terms.py` 는 `--expect 2` 로 회당 2편을 본다. 배치 단위(10~25편)를
받도록 인자만 바꾸면 된다. 새 도구를 만들 필요는 없다.

---

## 6. 실행 순서

**한 번에 233편을 커밋하지 않는다.** 권 단위 배치로 자르고, 배치마다 검증 → 커밋한다.
중간에 무엇이 깨지면 그 배치만 되돌린다.

### 파도 1 — 기초 (98편)

다른 단어를 설명할 때 이미 쓰이고 있는데 정작 자기 노트가 없는 것들이다.
이걸 먼저 넣어야 뒤의 노트들이 `[[링크]]` 를 걸 곳이 생긴다.

| 배치 | 권 | 편수 |
|---|---|---:|
| 1-1 | 웹 개발 | 21 |
| 1-2 | 데이터베이스 | 22 |
| 1-3 | 컴퓨터과학 기초 | 19 |
| 1-4 | 개발 도구 | 23 |
| 1-5 | 네트워크 | 13 (Packet·CIDR·ARP 부터) |

이 파도만 해도 가장 얇던 4권이 정상 두께가 된다. **여기서 멈춰도 앱은 훨씬 나아진다.**

### 파도 2 — 설계와 운영 (67편)

| 배치 | 권 | 편수 |
|---|---|---:|
| 2-1 | 아키텍처 패턴 | 24 |
| 2-2 | 인프라 · 운영 | 26 |
| 2-3 | 클라우드 | 17 |

파도 1의 ACID·복제·헬스 체크를 딛고 서는 내용이라 순서가 뒤집히면 안 된다.

### 파도 3 — 심화와 최신 (68편)

| 배치 | 권 | 편수 |
|---|---|---:|
| 3-1 | 프로그래밍 | 21 |
| 3-2 | AI · LLM | 18 |
| 3-3 | 보안 · 인증 | 11 |
| 3-4 | 제품 관리 | 18 또는 12 (4.3의 결정에 따름) |

### 배치 하나의 절차

```
1. 후보 확정   — id 미리 계산해서 충돌 재확인 (권마다 다시 한다)
2. 출처 조사   — 편당 서로 다른 도메인 2건, 반드시 원문을 연다
3. 집필        — docs/TERM-TEMPLATE.md + content/네트워크/DNS.md 본보기
4. 빌드        — python3 tools/build.py
5. 템플릿 검사 — python3 tools/check_template.py --require=examples,aim,loop,even <새 파일들>
6. 사실 재검사 — 인용 URL 을 다시 열어 문장 대조. 확신 없으면 그 편을 버린다
7. id 대조     — 기존 229개 id 가 한 글자도 안 변했는지
8. 비밀 스캔   — 공개 저장소다. 추가된 줄만 훑는다
9. 커밋        — 배치 하나가 커밋 하나
```

**6번을 건너뛰지 않는다.** 집필할 때의 판단을 믿으면 안 된다. 애매한 것을 통과시키느니
그 편을 버리는 게 낫다.

---

## 7. 위험

| 위험 | 왜 무서운가 | 대책 |
|---|---|---|
| **id 가 바뀐다** | 사용자 학습 기록이 통째로 날아간다. 조용히, 되돌릴 수 없이 | 기존 파일을 **열지도 않는다**. 배치마다 229개 id 대조를 강제 |
| **slug 충돌** | 새 단어가 남의 id 를 빼앗아 진도가 엉뚱한 단어에 붙는다 | `build.py` 의 `slugify()` 로 미리 계산 (현재 233편 충돌 0건) |
| **중복 단어** | `build.py` 가 제목 겹치면 한쪽을 조용히 버린다 | 파일명·H1·괄호 원어·별칭 4축 정규화 대조 |
| **접이식 6칸 초과** | 7번째 섹션부터 화면에 안 나온다. 쓴 사람은 모른다 | 선택 섹션을 4개 다 쓰지 않는다. `build.py` 의 `warn_overflow` 를 본다 |
| **`index.js` 가 커진다** | 첫 화면에서 통째로 읽는다. 37KB → 약 75KB (gzip) | 462편까지는 감당한다. 그 이상이면 색인을 권별로 쪼갠다 |
| **없는 사실을 쓴다** | 학습 앱에서 가장 나쁜 실패다 | 6번 사실 재검사. 못 여는 출처는 후보 탈락 |
| **Obsidian 금고와 어긋난다** | 금고는 읽기 전용이고 `import_vault.py` 는 1회용이라 이미 끝났다 | `content/` 가 원본이다. 금고에 되돌려 쓰지 않는다 |

---

## 8. 완료 기준

- [ ] `content/` 462편, 기존 229개 id **전부 무변경**
- [ ] `check_template.py content/` 실패 0건
- [ ] 새 파일 전부 `--require=examples,aim,loop,even` 통과
- [ ] 편당 서로 다른 도메인 1차 출처 2건 이상, `---` 아래 문단으로 기재
- [ ] 퀴즈 약 5,040문항, 권별 최소 327문항
- [ ] `ROUTINE-PROMPT.md` 상한·분포 문장 갱신
- [ ] `sources.allowlist.md` 갱신 (4.3·4.4의 결정 반영)
- [ ] `INDEX.md` 자동 생성으로 전환
- [ ] 390px 실기기 폭에서 새 노트 표본 확인
- [ ] 배포 후 실서버 `CACHE_VERSION` 이 저장소와 일치

---

## 9. 지금 정해야 하는 것

1. **어디까지 갈 것인가** — 파도 1(98편)만, 파도 2까지(165편), 아니면 전부(233편).
2. **제품 관리 18편** — 4.3의 (가)/(나)/(다) 중 무엇으로 할 것인가.
3. **허용 목록** — `web.dev` · `sre.google` · `12factor.net` 추가에 동의하는가.
   이건 사람만 고칠 수 있는 파일이다.
