(function () {
  "use strict";

  var VARIANTS = [
    { key: "a", label: "FINAL — Mobile Guided Atlas", name: "지하철 학습용 최종 목업" }
  ];

  var COURSE = [
    { no: "01", name: "필요", hint: "왜 이름 장부가 필요한가" },
    { no: "02", name: "핵심", hint: "입력·출력·경계를 잡기" },
    { no: "03", name: "흐름", hint: "질문·응답·연결을 보기" },
    { no: "04", name: "오해", hint: "헷갈리는 경계를 고치기" },
    { no: "05", name: "설명", hint: "내 말로 다시 조립하기" },
    { no: "06", name: "확인", hint: "답을 떠올려 마무리하기" }
  ];

  var CATEGORY_GROUPS = [
    { id: "build", name: "코드와 웹 만들기", ids: ["cs", "lang", "tool", "web"] },
    { id: "data", name: "데이터와 AI 활용하기", ids: ["db", "ai"] },
    { id: "service", name: "서비스 연결·배포·운영하기", ids: ["net", "cloud", "infra"] },
    { id: "product", name: "안전하고 확장 가능한 제품 설계", ids: ["arch", "sec", "pm"] }
  ];

  var CATEGORIES = [
    { id: "cs", mark: "CS", name: "컴퓨터과학 기초", count: 40, topic: "실행과 메모리", blurb: "컴퓨터가 코드를 실제 일로 바꾸는 밑바닥을 이해합니다.",
      path: { name: "프로그램이 실행되는 길", minutes: 8, terms: ["CPU", "Memory", "Process", "Thread", "Context Switch"] } },
    { id: "lang", mark: "<>", name: "프로그래밍", count: 36, topic: "코드의 구성", blurb: "값과 함수가 모여 실행 가능한 프로그램이 되는 과정을 봅니다.",
      path: { name: "코드가 프로그램이 되는 길", minutes: 7, terms: ["Variable", "Type System", "Function", "Package / Module", "Compile", "Build"] } },
    { id: "tool", mark: "GIT", name: "개발 도구", count: 32, topic: "협업과 자동화", blurb: "코드를 함께 고치고 안전하게 합치는 도구의 역할을 잇습니다.",
      path: { name: "Git으로 함께 작업하는 길", minutes: 8, terms: ["Git", "Git Branch", "Git Commit", "Pull Request", "Merge vs Rebase", "Merge Conflict"] } },
    { id: "web", mark: "WEB", name: "웹 개발", count: 34, topic: "브라우저와 화면", blurb: "서버의 응답이 브라우저 화면으로 바뀌는 흐름을 배웁니다.",
      path: { name: "브라우저가 화면을 만드는 길", minutes: 9, terms: ["HTML", "CSS", "JavaScript", "DOM", "Browser Rendering", "Accessibility"] } },
    { id: "db", mark: "DB", name: "데이터베이스", count: 69, topic: "저장과 조회", blurb: "데이터를 빠르게 찾고 안전하게 바꾸는 원리를 연결합니다.",
      path: { name: "데이터를 안전하게 바꾸는 길", minutes: 9, terms: ["Query", "Transaction", "Isolation Level", "Optimistic vs Pessimistic Lock", "WAL", "Replication"] } },
    { id: "ai", mark: "AI", name: "AI · LLM", count: 41, topic: "모델과 검색", blurb: "질문이 모델과 외부 지식을 거쳐 답으로 나오는 흐름을 봅니다.",
      path: { name: "RAG 답변이 만들어지는 길", minutes: 10, terms: ["Token", "Chunking", "Embedding", "Vector DB", "Semantic Search", "RAG", "Eval"] } },
    { id: "net", mark: "NET", name: "네트워크", count: 76, topic: "주소와 이름", blurb: "기기와 서버가 서로를 찾고 연결해 대화하는 순서를 배웁니다.",
      path: { name: "웹사이트가 열리는 길", minutes: 9, terms: ["URL", "DNS", "IP Address", "TCP", "HTTPS", "HTTP", "Load Balancer"] } },
    { id: "cloud", mark: "CLD", name: "클라우드", count: 61, topic: "배포와 확장", blurb: "코드를 여러 사용자가 쓸 수 있는 서비스로 내보내는 길을 봅니다.",
      path: { name: "컨테이너를 서비스로 내보내는 길", minutes: 10, terms: ["Dockerfile", "Docker Image", "Container Registry", "Managed Kubernetes", "Deployment", "Service", "Load Balancer"] } },
    { id: "infra", mark: "OPS", name: "인프라 · 운영", count: 80, topic: "관측과 복구", blurb: "문제를 발견하고 원인을 좁혀 안전하게 되돌리는 흐름을 익힙니다.",
      path: { name: "느린 서비스를 찾아 복구하는 길", minutes: 9, terms: ["Metric", "Logging", "Distributed Tracing", "Alerting", "Runbook", "Rollback"] } },
    { id: "arch", mark: "ARC", name: "아키텍처 패턴", count: 48, topic: "분리와 연결", blurb: "서비스를 나누고 다시 안전하게 연결하는 설계 판단을 배웁니다.",
      path: { name: "요청이 여러 서비스를 지나는 길", minutes: 10, terms: ["API Gateway", "Rate Limiting", "Service Discovery", "Message Queue", "Back Pressure", "Circuit Breaker"] } },
    { id: "sec", mark: "SEC", name: "보안 · 인증", count: 84, topic: "신원과 권한", blurb: "누구인지 확인하고 어디까지 허용할지 정하는 경계를 익힙니다.",
      path: { name: "로그인 뒤 권한을 얻는 길", minutes: 10, terms: ["Cookie", "세션", "OAuth 2.0", "OpenID Connect", "JWT", "RBAC"] } },
    { id: "pm", mark: "PM", name: "제품 관리", count: 28, topic: "가설과 검증", blurb: "누구의 어떤 문제를 풀지 정하고 결과를 숫자로 확인합니다.",
      path: { name: "아이디어를 제품으로 검증하는 길", minutes: 8, terms: ["Persona", "User Story", "MVP", "Funnel", "A/B Testing", "Retention", "KPI"] } }
  ];

  var EXTRA_PATHS = {
    cs: [
      { name: "느려진 프로그램의 원인 찾기", minutes: 9, terms: ["CPU", "Memory", "Cache", "Big O 표기법", "자료구조", "알고리즘"] },
      { name: "여러 일을 안전하게 동시에 처리하기", minutes: 10, terms: ["Process", "Thread", "Concurrency", "Race Condition", "Mutex vs Semaphore", "Deadlock"] }
    ],
    lang: [
      { name: "입력 데이터를 안전한 값으로 바꾸기", minutes: 9, terms: ["JSON", "JSON Schema", "Serialization", "Type System", "Null Safety", "Exception"] },
      { name: "변경해도 깨지지 않는 코드 만들기", minutes: 10, terms: ["Function", "Interface", "Dependency Injection", "Unit Test", "Integration Test", "TDD"] }
    ],
    tool: [
      { name: "로컬 코드를 컨테이너로 실행하기", minutes: 9, terms: ["Terminal", "환경 변수", "Dockerfile", "Docker Image", "Docker Compose", "Docker Volume"] },
      { name: "의존성을 고정해 안전하게 출시하기", minutes: 9, terms: ["Package Manager", "Dependency", "Lock File", "Semantic Versioning", "Git Tag", "Feature Flag"] }
    ],
    web: [
      { name: "빠르게 뜨고 오프라인에서도 되는 웹 만들기", minutes: 10, terms: ["Browser Rendering", "Code Splitting", "Core Web Vitals", "HTTP Caching", "Service Worker", "PWA"] },
      { name: "프론트엔드와 API를 안전하게 연결하기", minutes: 10, terms: ["Frontend", "REST", "Same-Origin Policy", "CORS", "HTTP Status Code", "API Versioning"] }
    ],
    db: [
      { name: "느린 조회가 어디서 막혔는지 찾기", minutes: 10, terms: ["Query", "N+1 Problem", "Query Plan", "Cardinality", "인덱스", "B-Tree"] },
      { name: "장애 뒤 데이터를 잃지 않고 복구하기", minutes: 10, terms: ["Transaction", "WAL", "Replication", "Point-in-Time Recovery", "Query"] }
    ],
    ai: [
      { name: "에이전트가 도구를 골라 작업하게 하기", minutes: 10, terms: ["Prompt", "Intent 분류", "Routing", "AI Agent", "ReAct", "Human in the Loop"] },
      { name: "안전하고 믿을 수 있는 AI 운영하기", minutes: 10, terms: ["Hallucination", "Eval", "Guardrail", "Prompt Injection", "Fallback", "Escalation"] }
    ],
    net: [
      { name: "웹 연결이 어디서 막혔는지 찾기", minutes: 10, terms: ["URL", "DNS", "IP Address", "Port", "TCP Three-Way Handshake", "HTTPS"] },
      { name: "실시간 연결을 끊김 없이 유지하기", minutes: 10, terms: ["DNS", "Load Balancer", "TCP", "HTTP", "WebSocket", "Session Affinity"] }
    ],
    cloud: [
      { name: "장애에 강한 멀티 리전 서비스 만들기", minutes: 10, terms: ["Region", "Availability Zone", "Multi-Region", "Storage Redundancy", "Disk Snapshot", "Deletion Protection"] },
      { name: "클라우드 비용을 보이게 하고 줄이기", minutes: 9, terms: ["Cost Allocation Tag", "Budget Alert", "Rightsizing", "Reserved Instance", "Spot Instance", "Egress Cost"] }
    ],
    infra: [
      { name: "Kubernetes 앱이 요청을 받게 만들기", minutes: 10, terms: ["Kubernetes", "Pod", "Deployment", "Service", "Ingress", "Health Check"] },
      { name: "배포 실패를 발견하고 안전하게 되돌리기", minutes: 10, terms: ["CI/CD", "Canary Release", "Health Check", "Alerting", "Rollback", "Postmortem"] }
    ],
    arch: [
      { name: "트래픽 급증에도 버티는 서비스 만들기", minutes: 10, terms: ["Load Balancing", "Stateless Workload", "Caching", "Auto Scaling", "Rate Limiting", "Scalability"] },
      { name: "분산 작업 실패를 견디게 만들기", minutes: 10, terms: ["Message Queue", "Retry & Exponential Backoff", "Dead Letter Queue", "Idempotency", "Circuit Breaker", "Bulkhead"] }
    ],
    sec: [
      { name: "비밀번호를 넘기지 않고 안전하게 로그인하기", minutes: 10, terms: ["OAuth 2.0", "OpenID Connect", "SSO", "MFA", "Short-Lived Credential", "Least Privilege"] },
      { name: "웹 공격을 막고 사고를 조사하기", minutes: 10, terms: ["OWASP Top 10", "SQL Injection", "XSS", "Web Application Firewall", "Audit Log", "Incident Response"] }
    ],
    pm: [
      { name: "사용자가 떠나는 지점 찾아 고치기", minutes: 9, terms: ["Funnel", "Conversion Rate", "Cohort Analysis", "Retention", "Churn Rate", "A/B Testing"] },
      { name: "팀이 우선순위를 정해 실행하기", minutes: 9, terms: ["OKR", "Product Roadmap", "Backlog", "User Story", "Sprint", "Retrospective"] }
    ]
  };

  var REVIEW_QUEUE = [
    { term: "DNS", category: "네트워크", cue: "이름 · 주소 · 끝나는 지점", prompt: "DNS가 무엇이고 어디까지 하는지 20초 안에 설명해보세요.",
      answer: "DNS는 도메인 이름을 받아 그 이름에 붙은 IP 주소 같은 기록을 찾는 분산형 체계입니다. 주소를 돌려주면 DNS의 일은 끝나고, 브라우저가 그 주소로 연결합니다." },
    { term: "Index", category: "데이터베이스", cue: "책 뒤 색인 · 읽기 · 쓰기 비용", prompt: "DB 인덱스가 조회를 빠르게 만드는 대신 치르는 비용은 무엇일까요?",
      answer: "인덱스는 찾을 열의 값을 정렬된 별도 구조에 보관해 전체 행을 훑지 않게 합니다. 대신 저장 공간이 들고, 데이터를 추가·수정할 때 인덱스도 함께 고쳐야 합니다." },
    { term: "OAuth", category: "보안 · 인증", cue: "비밀번호 대신 · 권한 위임", prompt: "OAuth를 로그인 자체라고 부르면 왜 정확하지 않은지 설명해보세요.",
      answer: "OAuth의 핵심은 비밀번호를 건네지 않고 특정 자원에 접근할 권한을 위임하는 것입니다. 사용자 신원 확인까지 표준화한 것은 OAuth 위에 얹힌 OpenID Connect입니다." },
    { term: "Container", category: "클라우드", cue: "프로세스 · 격리 · 커널 공유", prompt: "컨테이너와 가상 머신의 가장 중요한 차이를 말해보세요.",
      answer: "컨테이너는 호스트 커널을 공유하면서 프로세스와 파일·네트워크를 격리합니다. 가상 머신은 각자 운영체제와 커널을 가지므로 더 무겁지만 경계도 더 큽니다." },
    { term: "RAG", category: "AI · LLM", cue: "검색 · 근거 · 생성", prompt: "RAG가 모델의 기억만으로 답하는 방식과 어떻게 다른지 설명해보세요.",
      answer: "RAG는 질문과 가까운 외부 자료를 먼저 검색하고, 그 자료를 문맥에 넣어 답을 생성합니다. 모델 자체를 다시 학습시키지 않고도 최신·사내 지식을 근거로 쓸 수 있습니다." }
  ];

  var PROGRESS_GROUPS = [
    { name: "코드와 웹 만들기", learned: 7, total: 142, color: "#315fda" },
    { name: "데이터와 AI 활용하기", learned: 2, total: 110, color: "#7c65cf" },
    { name: "연결·배포·운영하기", learned: 6, total: 217, color: "#278b72" },
    { name: "설계·보안·제품", learned: 3, total: 160, color: "#b06a45" }
  ];

  var TERM_DETAILS = {
    "db--connection-pool": {
      definition: "Connection Pool은 앱이 데이터베이스 연결을 매 요청마다 새로 만들지 않고, 여러 개를 미리 열어 두었다가 빌려 쓰고 반납하는 관리 방식입니다.",
      why: "DB 연결에는 네트워크 연결·인증·세션 준비 비용이 듭니다. 이 비용을 매번 내지 않고, DB가 감당할 연결 수도 제한하려고 풀을 씁니다.",
      steps: ["앱이 시작할 때 일정 수의 DB 연결을 열어 풀에 놓습니다.", "요청이 오면 빈 연결 하나를 빌려 쿼리를 실행합니다.", "작업이 끝나면 연결을 닫지 않고 풀에 반납합니다.", "빈 연결이 없으면 대기하거나 timeout으로 실패합니다."],
      traps: ["연결을 담는 곳이지, 쿼리 결과를 담는 Cache가 아닙니다.", "풀이 크다고 항상 빠른 것은 아닙니다. DB 처리 한계보다 커지면 오히려 경쟁이 늘어납니다.", "빌린 연결을 반납하지 않으면 connection leak로 풀이 고갈됩니다."],
      teach: "Connection Pool은 DB 연결을 미리 열어 두고 여러 요청이 빌려 쓰게 해, 연결 생성 비용과 동시 연결 수를 관리하는 방식이야. 작업 후에는 반드시 풀에 반납해야 해.",
      paths: ["API 요청이 DB를 쓰는 길", "느린 DB 연결을 찾는 길"]
    },
    "db--change-data-capture": {
      definition: "Change Data Capture(CDC)는 데이터베이스의 insert·update·delete 변경을 감지해, 바뀐 내용만 다른 시스템으로 흘려보내는 방식입니다.",
      why: "전체 테이블을 반복해 복사하지 않고도 검색 인덱스·스트림·분석 시스템을 거의 실시간으로 갱신할 수 있습니다.",
      steps: ["DB가 변경 내용을 transaction log에 남깁니다.", "CDC connector가 log에서 새 변경을 순서대로 읽습니다.", "변경을 event로 바꿔 broker나 다음 시스템에 전달합니다.", "소비자가 재시도·중복 처리·순서를 고려해 반영합니다."],
      traps: ["CDC는 backup 자체가 아닙니다.", "두 시스템이 항상 동시에 같은 상태를 보장하지는 않습니다.", "재전송으로 중복 event가 올 수 있어 소비자의 멱등성이 필요합니다."],
      teach: "CDC는 DB의 전체 내용을 복사하는 대신, log에서 바뀐 행만 읽어 event로 전달하는 방식이야. 다운스트림은 중복과 재시도를 감당해야 해.",
      paths: ["주문 변경을 검색에 반영하는 길", "DB 변경을 이벤트로 보내는 길"]
    },
    "net--dns": {
      definition: "DNS는 도메인 이름을 받아 그 이름에 붙은 IP 주소·메일 서버·별칭 같은 기록을 찾아주는 분산형 체계입니다.",
      why: "사람은 고정된 이름을 기억하고, 운영자는 서버 주소를 바꿔도 됩니다. DNS 기록만 바꾸면 같은 이름을 유지할 수 있습니다.",
      steps: ["브라우저가 도메인 이름의 기록을 묻습니다.", "캐시에 없으면 재귀 DNS가 루트→TLD→권한 서버를 따라 찾습니다.", "IP 주소와 TTL을 받아 요청자에게 돌려줍니다.", "이제 브라우저가 그 주소로 직접 연결합니다."],
      traps: ["DNS가 웹서버와의 연결까지 만드는 것은 아닙니다.", "루트 서버가 모든 도메인의 IP를 아는 것은 아닙니다.", "TTL이 남아 있으면 변경 전 주소가 잠시 보일 수 있습니다."],
      teach: "DNS는 도메인 이름에 붙은 IP 주소 같은 기록을 찾아주는 분산형 체계야. 주소를 받은 뒤 실제 연결은 브라우저와 TCP·HTTPS가 맡아.",
      paths: ["웹사이트가 열리는 길", "DNS 변경이 퍼지는 길", "이름 조회 장애를 찾는 길"]
    }
  };

  var STORY = [
    {
      eyebrow: "01 · 입력",
      title: "브라우저에 사람이 기억하는 이름을 입력합니다.",
      caption: "site.com은 사람이 읽기 쉬운 도메인 이름입니다.",
      short: "이름을 입력"
    },
    {
      eyebrow: "02 · 질문",
      title: "브라우저가 DNS에 그 이름의 주소를 묻습니다.",
      caption: "질문의 입력은 도메인 이름입니다.",
      short: "DNS에 질문"
    },
    {
      eyebrow: "03 · 응답",
      title: "DNS가 찾아갈 IP 주소를 브라우저에 돌려줍니다.",
      caption: "DNS의 출력은 93.184… 같은 IP 주소입니다.",
      short: "IP 주소를 받음"
    },
    {
      eyebrow: "04 · 연결",
      title: "브라우저가 받은 주소로 서버에 직접 연결합니다.",
      caption: "DNS의 일은 끝났고, 여기부터 TCP와 HTTPS가 맡습니다.",
      short: "서버에 연결"
    }
  ];

  var CONCEPTS = {
    domain: {
      name: "Domain Name",
      ko: "사람이 기억하는 이름",
      summary: "google.com처럼 사람이 읽고 기억할 수 있게 붙인 인터넷 이름입니다.",
      relation: "DNS에 맡기는 입력",
      next: "DNS"
    },
    dns: {
      name: "DNS",
      ko: "이름에 붙은 기록을 찾는 체계",
      summary: "도메인 이름을 받아 그 이름에 붙은 주소·메일 서버·별칭 같은 기록을 찾아주는 분산형 체계입니다.",
      relation: "이 경로의 번역 지점",
      next: "IP Address"
    },
    ip: {
      name: "IP Address",
      ko: "컴퓨터가 찾아갈 번호",
      summary: "네트워크에서 데이터를 어느 장비로 보낼지 가리키는 숫자 주소입니다.",
      relation: "DNS가 돌려주는 출력",
      next: "TCP"
    },
    tcp: {
      name: "TCP",
      ko: "연결을 맺고 순서를 지키는 규칙",
      summary: "DNS에서 받은 주소로 간 뒤, 빠진 조각 없이 순서대로 주고받게 연결을 관리합니다.",
      relation: "주소를 받은 뒤 시작",
      next: "HTTP"
    },
    http: {
      name: "HTTP",
      ko: "웹 내용을 주고받는 규칙",
      summary: "연결 위에서 페이지를 달라고 요청하고 HTML·이미지 같은 응답을 받는 규칙입니다.",
      relation: "실제 웹 대화",
      next: "페이지"
    },
    cache: {
      name: "Cache · TTL",
      ko: "전에 찾은 주소를 잠깐 기억",
      summary: "한 번 받은 답을 정해진 시간 동안 가까운 곳에 두어 다음 조회를 더 빨리 끝냅니다.",
      relation: "DNS 조회의 지름길",
      next: "DNS"
    }
  };

  var state = {
    variant: getVariant(),
    view: "today",
    category: "net",
    categoryOpen: false,
    termOpen: false,
    selectedTermId: "net--dns",
    searchQuery: "",
    searchCategory: "all",
    reviewIndex: 0,
    reviewRevealed: false,
    todayCategory: "net",
    todayRouteIndex: 0,
    routeIndex: 0,
    catalogScroll: 0,
    hubScroll: 0,
    courseScroll: 0,
    termListQuery: "",
    courseStarted: false,
    courseStep: 0,
    storyStep: 0,
    technical: false,
    answer: false,
    teachText: "",
    concept: "dns"
  };

  var root = document.getElementById("prototype-root");
  var switcher = document.getElementById("prototype-switcher");
  var label = document.getElementById("prototype-label");
  var toast = document.getElementById("prototype-toast");
  var revealObserver = null;
  var chapterObserver = null;
  var toastTimer = null;
  var termCache = null;

  function getVariant() {
    var value = new URLSearchParams(window.location.search).get("variant");
    return VARIANTS.some(function (item) { return item.key === value; }) ? value : "a";
  }

  function card() {
    var cards = (window.MOCK && window.MOCK.cards) || [];
    return cards.find(function (item) { return item.term === "DNS"; }) || cards[0] || { svg: "" };
  }

  function dnsSceneSvg() {
    var scenes = window.VOCAB_SCENES && window.VOCAB_SCENES.net;
    return (scenes && scenes["net--dns"]) || card().svg || "";
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>\"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char];
    });
  }

  function plain(value) {
    return String(value || "")
      .replace(/\*\*/g, "")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/`/g, "")
      .trim();
  }

  function allTerms() {
    if (termCache) return termCache;
    var books = window.VOCABULARY_INDEX || [];
    termCache = books.reduce(function (out, book) {
      return out.concat((book.terms || []).map(function (term) {
        return Object.assign({}, term, { bookId: book.id, bookName: book.name });
      }));
    }, []);
    return termCache;
  }

  function termById(id) {
    return allTerms().find(function (term) { return term.id === id; }) || null;
  }

  function termByName(name, bookId) {
    var wanted = String(name || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
    var terms = allTerms();
    var inBook = bookId ? terms.filter(function (term) { return term.bookId === bookId; }) : terms;
    return inBook.find(function (term) {
      var names = [term.term, term.reading].concat(term.aliases || []);
      return names.some(function (item) {
        return String(item || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "") === wanted;
      });
    }) || terms.find(function (term) {
      var names = [term.term, term.reading].concat(term.aliases || []);
      return names.some(function (item) {
        return String(item || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "") === wanted;
      });
    }) || null;
  }

  function termsForCategory(categoryId) {
    return allTerms().filter(function (term) { return term.bookId === categoryId; });
  }

  function pathsForCategory(category) {
    return [category.path].concat(EXTRA_PATHS[category.id] || []);
  }

  function selectedPath(category) {
    return pathsForCategory(category)[state.routeIndex] || category.path;
  }

  function pathsContainingTerm(term) {
    var matches = [];
    CATEGORIES.forEach(function (category) {
      pathsForCategory(category).forEach(function (path) {
        var contains = path.terms.some(function (name) {
          var record = termByName(name, category.id);
          return record && record.id === term.id;
        });
        if (contains) matches.push({ category: category, path: path });
      });
    });
    return matches;
  }

  function termStatus(index) {
    if (index === 0) return ["학습 중", "is-reading"];
    if (index === 1 || index === 4) return ["설명 가능", "is-mastered"];
    if (index === 2) return ["복습 필요", "is-review"];
    return ["학습 전", ""];
  }

  function icon(name) {
    var paths = {
      today: '<path d="M6 5.5h12v13H6z"/><path d="M9 3.5v4M15 3.5v4M6 9.5h12"/><path d="m9.5 14 1.7 1.7 3.4-3.7"/>',
      course: '<path d="M6 4.5h8.5a3.5 3.5 0 0 1 0 7H9a3 3 0 0 0 0 6h9"/><path d="m15.5 15 2.5 2.5-2.5 2.5"/>',
      search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/>',
      recall: '<path d="M6.2 8.5a6.5 6.5 0 1 1-.2 6"/><path d="M6 4.5v4h4"/><path d="M12 8.5v4l2.5 1.5"/>',
      progress: '<path d="M5 19V9M12 19V4M19 19v-6"/><path d="M3.5 19.5h17"/>',
      arrow: '<path d="M5 12h13M14 7l5 5-5 5"/>',
      chevron: '<path d="m7 9.5 5 5 5-5"/>',
      back: '<path d="M19 12H6M10 7l-5 5 5 5"/>',
      book: '<path d="M4.5 5.5A3.5 3.5 0 0 1 8 3.8c2.2 0 4 1.7 4 3.7v12c0-2-1.8-3.7-4-3.7a3.5 3.5 0 0 0-3.5 1.7z"/><path d="M19.5 5.5A3.5 3.5 0 0 0 16 3.8c-2.2 0-4 1.7-4 3.7v12c0-2 1.8-3.7 4-3.7a3.5 3.5 0 0 1 3.5 1.7z"/>',
      map: '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="m8.3 7.8 7.4-1.1M7.3 9.1l3.5 6.7M16.7 8.1l-3.4 7.4"/>',
      check: '<path d="m5 12.5 4 4L19 6.5"/>',
      sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
      layers: '<path d="m12 3 8 4.5-8 4.5-8-4.5z"/><path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/>'
    };
    return '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths.book) + '</svg>';
  }

  function nestedArrow() {
    return '<span class="button-orbit" aria-hidden="true">' + icon("arrow") + '</span>';
  }

  function appMark(dark) {
    return '<a class="app-mark' + (dark ? " app-mark--dark" : "") + '" href="#prototype-main" aria-label="IT 단어 홈">' +
      '<span class="app-mark__glyph">ㄷ</span><span><b>단어</b><small>IT CONCEPT STUDIO</small></span></a>';
  }

  function navItems(active) {
    var items = [
      ["today", "오늘", "today"], ["course", "코스", "catalog"], ["search", "찾기", "search"],
      ["recall", "복습", "review"], ["progress", "진도", "progress"]
    ];
    return items.map(function (item) {
      var isActive = item[0] === active;
      return '<button class="app-nav__item' + (isActive ? " is-active" : "") + '" type="button"' +
        ' aria-current="' + (isActive ? "page" : "false") + '" data-action="nav-view" data-view="' + item[2] + '">' +
        icon(item[0]) + '<span>' + item[1] + '</span></button>';
    }).join("");
  }

  function conceptTrail(compact) {
    var keys = ["domain", "dns", "ip", "tcp", "http", "cache"];
    var items = keys.map(function (key, index) {
      var concept = CONCEPTS[key];
      var selected = state.concept === key;
      var badge = key === "cache" ? "↳" : "0" + (index + 1);
      return '<button class="concept-trail__node trail-' + key + (selected ? " is-selected" : "") + (key === "dns" ? " is-course" : "") + '" type="button" data-action="trail-concept" data-concept="' + key + '" aria-pressed="' + selected + '">' +
        '<span>' + badge + '</span><b>' + esc(concept.name) + '</b><small>' + esc(concept.ko) + '</small></button>';
    }).join("");
    var selected = CONCEPTS[state.concept];
    if (compact) {
      return '<section class="concept-mini" aria-label="현재 개념의 전체 경로"><span>DOMAIN</span><i>→</i><b>DNS</b><i>→</i><span>IP</span><i>→</i><span>TCP</span><i>→</i><span>HTTP</span></section>';
    }
    return '<section class="concept-trail" aria-label="웹사이트 경로에서 DNS 주변 개념을 확대한 지도">' +
      '<div class="concept-trail__head"><span>웹사이트 경로 · DNS 2 / 7 지점</span><b>DNS 주변 개념 지도</b><small><em>선택 · ' + esc(selected.name) + '</em> · ' + esc(selected.ko) + '</small></div>' +
      '<div class="concept-trail__map">' +
        '<svg class="concept-trail__lines concept-trail__lines--wide" viewBox="0 0 1000 210" aria-hidden="true"><path d="M92 78C190 78 200 48 290 48S402 88 500 88 610 48 705 48 820 84 914 84"/><path class="is-branch" d="M290 62C298 118 350 158 445 164"/></svg>' +
        '<svg class="concept-trail__lines concept-trail__lines--mobile" viewBox="0 0 340 540" aria-hidden="true"><path d="M76 48C205 48 250 104 250 138L250 255C250 305 78 320 78 365S214 424 252 475"/><path class="is-branch" d="M248 147C213 161 175 190 88 211"/></svg>' +
        items +
      '</div>' +
      '<p class="concept-trail__summary"><strong>선택 · ' + esc(selected.name) + '</strong><span>' + esc(selected.summary) + '</span></p>' +
    '</section>';
  }

  function routeTrail(category) {
    if (category.id === "net" && state.routeIndex === 0) return conceptTrail(false);
    var path = selectedPath(category);
    var stepNotes = ["이 경로의 출발점", "다음 개념이 필요한 이유", "실제로 일이 바뀌는 지점", "앞뒤를 이어 주는 단계", "안전성과 성능을 보완", "결과를 검증하는 단계", "다음 흐름으로 넘기는 경계"];
    var nodes = path.terms.map(function (term, index) {
      var record = termByName(term, category.id);
      var action = record ? ' data-action="term-open" data-term="' + record.id + '"' :
        ' data-demo-toast="전체 적용 시 이 단어의 상세 설명으로 연결됩니다"';
      var count = record ? pathsContainingTerm(record).length : 0;
      return '<button class="generic-trail__node" type="button"' + action + '><span>0' + (index + 1) + '</span><b>' + esc(term) + '</b><small>' + stepNotes[index] + '</small>' + (count > 1 ? '<em>' + count + '개 경로</em>' : '') + '</button>';
    }).join("");
    return '<section class="concept-trail generic-trail" aria-label="' + esc(path.name) + ' 개념 경로">' +
      '<div class="concept-trail__head"><span>' + esc(category.name) + ' · ' + esc(category.topic) + '</span><b>' + esc(path.name) + '</b><small>' + path.terms.length + '개 개념 · ' + path.minutes + '분</small></div>' +
      '<div class="generic-trail__map">' + nodes + '</div>' +
      '<p class="generic-trail__outcome"><strong>이 경로를 마치면</strong><span>' + esc(category.blurb) + '</span></p>' +
    '</section>';
  }

  function progressRing(value) {
    return '<span class="progress-ring" style="--progress:' + value + '" aria-hidden="true"><i></i></span>';
  }

  function storyboard(options) {
    var opts = options || {};
    var step = opts.step == null ? state.storyStep : opts.step;
    var masks = STORY.map(function (_, index) {
      return '<span class="storyboard__mask' + (index === step || opts.all ? " is-active" : "") + '"></span>';
    }).join("");
    var controls = STORY.map(function (item, index) {
      return '<button class="story-step' + (index === step ? " is-active" : "") + '" type="button" data-action="story-step" data-step="' + index + '"' +
        ' aria-pressed="' + (index === step) + '"><span>0' + (index + 1) + '</span><b>' + item.short + '</b></button>';
    }).join("");
    return '<figure class="story-figure">' +
      '<div class="storyboard" data-step="' + step + '">' +
        '<div class="storyboard__art">' + dnsSceneSvg() + '</div>' +
        '<div class="storyboard__masks" aria-hidden="true">' + masks + '</div>' +
      '</div>' +
      '<figcaption class="story-caption"><span>' + STORY[step].eyebrow + '</span><strong>' + STORY[step].caption + '</strong></figcaption>' +
      (opts.controls === false ? "" : '<div class="story-controls" aria-label="DNS 설명 단계">' + controls + '</div>') +
    '</figure>';
  }

  function technicalDiagram() {
    return '<div class="technical-wrap' + (state.technical ? " is-open" : "") + '">' +
      '<button class="quiet-toggle" type="button" data-action="technical" aria-expanded="' + state.technical + '">' +
        icon("layers") + '<span><b>처음 찾는 이름은 어디까지 물어볼까?</b><small>재귀 DNS · 루트 · .com · 권한 서버</small></span><i>＋</i>' +
      '</button>' +
      (state.technical ? '<div class="technical-diagram"><ol class="resolver-route">' +
          '<li><span>1</span><p><b>내 기기 → 재귀 DNS</b><small>“site.com의 주소를 끝까지 찾아줘.”</small></p></li>' +
          '<li><span>2</span><p><b>재귀 DNS → 루트</b><small>루트는 최종 주소 대신 “.com 담당은 저쪽”이라고 알려줍니다.</small></p></li>' +
          '<li><span>3</span><p><b>재귀 DNS → .com 담당</b><small>.com 담당은 “site.com의 권한 서버는 저쪽”이라고 안내합니다.</small></p></li>' +
          '<li><span>4</span><p><b>재귀 DNS → 권한 서버</b><small>마지막 담당이 IP 주소와 TTL을 돌려줍니다.</small></p></li>' +
        '</ol><p class="resolver-note"><b>중요:</b> 브라우저가 이곳을 모두 직접 도는 게 아닙니다. 보통은 재귀 DNS에 한 번 부탁하고, 재귀 DNS가 대신 찾아갑니다.</p></div>' : "") +
    '</div>';
  }

  function guidedStepBody() {
    if (state.courseStep === 0) {
      return '<section class="guided-question" aria-labelledby="guided-step-title">' +
        '<div class="guided-copy" data-reveal>' +
          '<span class="eyebrow">01 · 왜 필요한가</span>' +
          '<h1 id="guided-step-title">사람은 이름을,<br>인터넷은 주소를 씁니다.</h1>' +
          '<p class="guided-lede">우리는 <b>site.com</b>을 기억하지만, 네트워크는 <b>93.184…</b> 같은 IP 주소로 목적지를 찾습니다. DNS는 사람이 쓰는 이름과 기계가 쓰는 주소를 떨어뜨려 둡니다.</p>' +
          '<div class="reason-lines" aria-label="DNS가 필요한 두 가지 이유">' +
            '<div><span>01</span><p><b>숫자를 외우지 않아도 됩니다.</b><small>사람은 같은 이름만 기억하면 됩니다.</small></p></div>' +
            '<div><span>02</span><p><b>서버를 옮겨도 이름은 그대로입니다.</b><small>DNS에 적힌 주소만 새 주소로 바꾸면 됩니다.</small></p></div>' +
          '</div>' +
          '<div class="micro-fact"><span>지하철 학습 모드</span><b>한 단계 약 90초 · 중간에 멈춰도 단계가 나뉘어 있어요.</b></div>' +
        '</div>' +
        '<div class="guided-visual" data-reveal>' + storyboard({ step: 0, all: true, controls: false }) + '</div>' +
      '</section>';
    }
    if (state.courseStep === 1) {
      return '<section class="meaning-stage" aria-labelledby="guided-step-title">' +
        '<div class="meaning-title" data-reveal>' +
          '<span class="eyebrow">02 · 한 줄로 잡기</span>' +
          '<p class="term-kicker">NETWORK · DOMAIN NAME SYSTEM</p>' +
          '<h1 id="guided-step-title">DNS</h1>' +
          '<p class="definition"><mark>도메인 이름</mark>을 받아 그 이름에 붙은 <mark>기록을 찾아주는 분산형 체계</mark>입니다.</p>' +
        '</div>' +
        '<div class="io-strip" data-reveal aria-label="DNS의 입력과 출력">' +
          '<div><span>입력</span><b>site.com</b><small>사람이 쓰는 이름</small></div>' +
          '<div><span>찾는 일</span><b>기록 조회</b><small>캐시 또는 담당 서버</small></div>' +
          '<div><span>출력</span><b>93.184… + TTL</b><small>주소와 기억할 시간</small></div>' +
          '<div><span>경계</span><b>주소까지만</b><small>연결과 페이지 전송은 다음</small></div>' +
        '</div>' +
        '<div class="meaning-grid" data-reveal>' +
          '<details class="name-breakdown"><summary>이름을 뜯어보면</summary><dl>' +
            '<div><dt>Domain</dt><dd>이름이 미치는 구역</dd></div>' +
            '<div><dt>Name</dt><dd>이름</dd></div>' +
            '<div><dt>System</dt><dd>체계</dd></div>' +
          '</dl><p>붙여 읽으면 <b>“이름을 다루는 체계”</b>입니다.</p></details>' +
          '<article class="analogy-plate"><span>가장 가까운 비유</span><h2>친구 이름을 대면<br>번호를 찾는 연락처</h2><p>비유는 입구일 뿐입니다. 실제 DNS는 한 권의 책이 아니라 여러 담당 서버가 나눠 가진 장부이고, IP뿐 아니라 메일 서버·별칭 같은 기록도 찾습니다.</p></article>' +
        '</div>' +
        '<div class="precision-grid" data-reveal>' +
          '<details open><summary>DNS가 찾는 기록은 IP만이 아닙니다</summary><dl class="record-list">' +
            '<div><dt>A</dt><dd>이름에 붙은 IPv4 주소</dd><code>site.com → 192.0.2.10</code></div>' +
            '<div><dt>AAAA</dt><dd>이름에 붙은 IPv6 주소</dd><code>site.com → 2001:db8::10</code></div>' +
            '<div><dt>CNAME</dt><dd>다른 이름을 가리키는 별칭</dd><code>www → app.example.net</code></div>' +
            '<div><dt>MX</dt><dd>메일을 받을 서버</dd><code>example.com → mail.example.com</code></div>' +
            '<div><dt>TXT</dt><dd>소유 확인·메일 정책용 문자열</dd><code>service-verification=…</code></div>' +
          '</dl></details>' +
          '<details><summary>도메인 이름과 URL은 무엇이 다를까?</summary><p><b>https://site.com/products/42</b>가 전체 URL이라면 DNS가 주소를 찾을 때 보는 핵심은 <b>site.com</b>이라는 호스트 이름입니다. <b>https</b> 방식과 <b>/products/42</b> 경로를 해석하는 일은 DNS의 몫이 아닙니다.</p></details>' +
        '</div>' +
      '</section>';
    }
    if (state.courseStep === 2) {
      return '<section class="work-stage" aria-labelledby="guided-step-title">' +
        '<header class="stage-heading" data-reveal><span class="eyebrow">03 · 전체 흐름</span>' +
          '<h1 id="guided-step-title">질문하고, 답을 받고,<br>그 주소로 연결합니다.</h1><p>파란 칩만 따라가세요. <b>site.com?</b>은 DNS로 가고, <b>93.184…</b>는 브라우저로 돌아옵니다.</p></header>' +
        '<div class="bezel lesson-bezel" data-reveal><div class="bezel__core">' + storyboard({}) + '</div></div>' +
        '<div class="flow-facts" data-reveal>' +
          '<p><span>캐시가 있으면</span><b>전에 받은 답을 바로 써서 중간 조회를 건너뜁니다.</b></p>' +
          '<p><span>TTL이 끝나면</span><b>오래된 답을 버리고 담당 서버에 다시 묻습니다.</b></p>' +
          '<p><span>DNS가 끝나면</span><b>브라우저가 TCP·HTTPS로 서버와 실제 대화를 시작합니다.</b></p>' +
        '</div>' +
        technicalDiagram() +
      '</section>';
    }
    if (state.courseStep === 3) {
      return '<section class="myth-stage" aria-labelledby="guided-step-title">' +
        '<header class="stage-heading" data-reveal><span class="eyebrow">04 · 경계와 오해</span>' +
          '<h1 id="guided-step-title">이 세 가지를 구분하면<br>DNS를 제대로 압니다.</h1><p>오해 문장을 눌러 이유까지 확인하세요.</p></header>' +
        '<div class="myth-list" data-reveal>' +
          '<details open><summary><span>01</span><b>“DNS가 사이트까지 데려다준다.”</b><i>아님</i></summary><p>DNS는 주소를 돌려주고 끝납니다. 받은 주소로 실제 연결을 여는 것은 브라우저와 운영체제입니다.</p></details>' +
          '<details><summary><span>02</span><b>“DNS를 바꾸면 다운로드가 빨라진다.”</b><i>대개 아님</i></summary><p>이름을 찾는 첫 지연은 조금 달라질 수 있지만, 파일을 받는 속도는 그 뒤의 회선과 서버가 결정합니다.</p></details>' +
          '<details><summary><span>03</span><b>“주소를 바꾸면 모두 즉시 새 주소를 받는다.”</b><i>아님</i></summary><p>이미 받은 옛 주소는 TTL이 끝날 때까지 캐시에 남습니다. 사용자마다 다시 묻는 시점이 다릅니다.</p></details>' +
        '</div>' +
        '<p class="memory-line" data-reveal><b>기억 문장</b> “번호부가 전화를 걸어주지는 않는다.”</p>' +
      '</section>';
    }
    if (state.courseStep === 4) {
      return '<section class="teach-stage" aria-labelledby="guided-step-title">' +
        '<header class="stage-heading" data-reveal><span class="eyebrow">05 · 내 설명 만들기</span>' +
          '<h1 id="guided-step-title">화면을 가리고<br>30초로 설명해보세요.</h1><p>지하철에서는 소리 내지 않아도 됩니다. 속으로 말하거나 짧게 적고, 네 재료가 들어갔는지 확인하세요.</p></header>' +
        '<div class="teach-materials" data-reveal aria-label="설명에 넣을 네 가지 재료"><span>사람은 이름</span><span>기계는 주소</span><span>DNS는 기록 조회</span><span>연결은 그다음</span></div>' +
        '<div class="teach-prompt bezel" data-reveal><div class="bezel__core">' +
          '<div class="teach-prompt__head"><span>내 설명</span><small>완벽한 문장보다 인과 순서가 중요합니다</small></div>' +
          '<label class="sr-only" for="teach-input">DNS를 내 말로 설명</label>' +
          '<textarea id="teach-input" rows="5" placeholder="사람은 ___을 기억하고, 컴퓨터는 ___가 필요해. 그래서 DNS가…">' + esc(state.teachText) + '</textarea>' +
          '<ul><li><span>1</span>입력</li><li><span>2</span>DNS의 일</li><li><span>3</span>출력</li><li><span>4</span>DNS 이후</li></ul>' +
          '<button class="secondary-cta" type="button" data-action="answer">' + (state.answer ? "모범 설명 닫기" : "모범 설명과 비교") + '</button>' +
          (state.answer ? '<div class="model-answer"><span>모범 설명</span><p>DNS는 사람이 쓰는 도메인 이름을 받아 그 이름에 붙은 기록을 찾아주는 분산형 체계야. 브라우저는 DNS에서 IP 주소와 TTL을 받은 뒤, 그 주소로 서버에 직접 연결해. DNS는 주소를 알려준 곳에서 끝나.</p></div>' : "") +
        '</div></div>' +
      '</section>';
    }
    return '<section class="check-stage" aria-labelledby="guided-step-title">' +
      '<header class="stage-heading" data-reveal><span class="eyebrow">06 · 떠올려 확인하기</span>' +
        '<h1 id="guided-step-title">먼저 답한 뒤<br>정답을 펼쳐보세요.</h1><p>읽으면서 아는 느낌과, 화면 없이 떠올리는 것은 다릅니다.</p></header>' +
      '<div class="check-list" data-reveal>' +
        '<details><summary><span>01</span><h2>site.com을 두 번째로 열면 왜 더 빨리 답을 받을 수 있을까?</h2></summary><p>TTL이 남은 주소가 브라우저·운영체제·재귀 DNS의 캐시에 있을 수 있기 때문입니다.</p></details>' +
        '<details><summary><span>02</span><h2>서버 주소를 바꿨는데 일부 사용자가 잠깐 옛 서버로 가는 이유는?</h2></summary><p>그 사용자가 쓰는 캐시에 옛 주소의 TTL이 아직 남아 있기 때문입니다.</p></details>' +
        '<details><summary><span>03</span><h2>DNS가 IP 주소를 돌려준 직후, 다음에는 누가 무엇을 할까?</h2></summary><p>브라우저가 받은 주소로 TCP 또는 QUIC 연결을 열고 HTTP(S) 요청을 보냅니다.</p></details>' +
      '</div>' +
      '<div class="finish-panel" data-reveal><div>' + icon("check") + '<span><b>DNS를 설명할 준비가 됐습니다</b><small>다음 복습은 1일 뒤에 돌아옵니다.</small></span></div>' +
        '<button class="primary-cta" type="button" data-demo-toast="실제 앱에서는 3문제 확인 퀴즈로 이어집니다"><span>3문제로 확인</span>' + nestedArrow() + '</button></div>' +
    '</section>';
  }

  function selectedCategory() {
    return CATEGORIES.find(function (item) { return item.id === state.category; }) || CATEGORIES[0];
  }

  function categoryTrigger(labelText) {
    return '<button class="category-trigger" type="button" data-action="category-open" aria-haspopup="dialog" aria-expanded="' + state.categoryOpen + '">' +
      '<span>' + esc(labelText) + '</span>' + icon("chevron") + '</button>';
  }

  function categorySheet() {
    if (!state.categoryOpen) return "";
    var groups = CATEGORY_GROUPS.map(function (group) {
      var categories = group.ids.map(function (id) {
        var item = CATEGORIES.find(function (category) { return category.id === id; });
        var current = item.id === state.category;
        return '<button class="category-option' + (current ? " is-current" : "") + '" type="button" data-action="category-select" data-category="' + item.id + '" aria-current="' + (current ? "true" : "false") + '">' +
          '<span class="category-option__mark">' + esc(item.mark) + '</span><span><b>' + esc(item.name) + '</b><small>' + item.count + '개 · ' + esc(item.topic) + '</small></span>' +
          (current ? '<i aria-hidden="true">✓</i>' : '') + '</button>';
      }).join("");
      return '<section class="category-sheet__group"><h3>' + esc(group.name) + '</h3><div>' + categories + '</div></section>';
    }).join("");
    return '<div class="category-sheet">' +
      '<button class="category-sheet__backdrop" type="button" data-action="category-close" aria-label="카테고리 선택 닫기"></button>' +
      '<section class="category-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="category-sheet-title" tabindex="-1">' +
        '<header><div><span>COURSE LIBRARY</span><h2 id="category-sheet-title">카테고리 선택</h2><p>4개 분야 안의 12개 카테고리 · 총 629개 단어</p></div>' +
          '<button class="round-action" type="button" data-action="category-close" aria-label="닫기">×</button></header>' +
        '<div class="category-sheet__scroll">' + groups + '</div>' +
      '</section></div>';
  }

  function termSheet() {
    if (!state.termOpen) return "";
    var term = termById(state.selectedTermId);
    if (!term) return "";
    var category = CATEGORIES.find(function (item) { return item.id === term.bookId; }) || CATEGORIES[0];
    var detail = TERM_DETAILS[term.id] || null;
    var related = (term.related || []).slice(0, 4).map(function (item) {
      var record = termByName(item.term);
      var tag = record ? 'button type="button" data-action="term-open" data-term="' + record.id + '"' : "span";
      return '<' + tag + '><b>' + esc(item.term) + '</b><small>' + esc(plain(String(item.note || "").replace(/^\s*[—-]\s*/, ""))) + '</small>' + (record ? icon("arrow") : "") + '</' + (record ? "button" : "span") + '>';
    }).join("");
    var steps = detail ? detail.steps.map(function (step, index) {
      return '<li><span>0' + (index + 1) + '</span><p>' + esc(step) + '</p></li>';
    }).join("") : "";
    var traps = detail ? detail.traps.map(function (trap) {
      return '<li>' + esc(trap) + '</li>';
    }).join("") : "";
    var memberships = pathsContainingTerm(term);
    var pathNames = memberships.length ? memberships.map(function (item) { return item.path.name; }) : (detail ? detail.paths : []);
    var paths = pathNames.map(function (path, index) {
      return '<span><i>' + String(index + 1).padStart(2, "0") + '</i><b>' + esc(path) + '</b></span>';
    }).join("");
    var primaryAction = term.id === "net--dns" ? ' data-action="term-learn"' :
      ' data-action="term-course" data-category="' + category.id + '"';
    var primaryLabel = term.id === "net--dns" ? "DNS 상세 학습" : category.name + " 코스 보기";
    var visualByTerm = {
      "net--dns": ["site.com 입력", "DNS 기록 조회", "IP · TTL 출력", "연결은 브라우저가 시작"],
      "db--connection-pool": ["DB 작업 요청", "풀에서 연결 대여", "쿼리 후 반납", "쿼리 결과 Cache가 아님"],
      "db--change-data-capture": ["DB 변경 log", "CDC가 순서대로 읽음", "event로 전달", "backup 자체가 아님"]
    };
    var visual = visualByTerm[term.id];
    var visualMarkup = visual ? '<div class="term-meaning-visual" aria-label="' + esc(term.term) + ' 핵심 흐름"><div><span>INPUT</span><b>' + esc(visual[0]) + '</b></div>' + icon("arrow") + '<div><span>ROLE</span><b>' + esc(visual[1]) + '</b></div>' + icon("arrow") + '<div><span>OUTPUT</span><b>' + esc(visual[2]) + '</b></div><p><span>경계</span>' + esc(visual[3]) + '</p></div>' : "";
    return '<div class="category-sheet term-sheet">' +
      '<button class="category-sheet__backdrop" type="button" data-action="term-close" aria-label="단어 미리보기 닫기"></button>' +
      '<section class="category-sheet__panel term-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="term-sheet-title" tabindex="-1">' +
        '<header><div><span>' + esc(category.name) + ' · ' + (detail ? "상세 설명 구조 체험" : "단어 미리보기") + '</span><h2 id="term-sheet-title">' + esc(term.term) + '</h2><p>' + esc(term.reading || category.topic) + '</p></div>' +
          '<button class="round-action" type="button" data-action="term-close" aria-label="닫기">×</button></header>' +
        '<div class="term-sheet__body"><section class="term-sheet__section"><span class="term-sheet__label">핵심 한 문장</span><p class="term-sheet__summary">' + esc(detail ? detail.definition : plain(term.summary)) + '</p></section>' +
          '<section class="term-sheet__section term-sheet__why"><h3>' + (detail ? "왜 필요한가" : "이 카테고리에서의 위치") + '</h3><p>' + esc(detail ? detail.why : category.blurb) + '</p></section>' +
          visualMarkup +
          (detail ? '<section class="term-sheet__section term-detail-teach"><span>남에게 이렇게 설명</span><p>' + esc(detail.teach) + '</p></section>' +
            '<details class="term-detail-disclosure"><summary><span><b>정확히 보기</b><small>작동 ' + detail.steps.length + '단계 · 헷갈리는 경계 ' + detail.traps.length + '개</small></span>' + icon("chevron") + '</summary><div><section class="term-sheet__section"><h3>어떻게 동작하나</h3><ol class="term-detail-flow">' + steps + '</ol></section>' +
            '<section class="term-sheet__section term-detail-traps"><h3>헷갈리는 경계</h3><ul>' + traps + '</ul></section></div></details>' :
            '<aside class="term-detail-scope"><b>전면 개편에서 보강되는 내용</b><p>이 단어도 작동 순서·예시·오해·설명 문장을 전문 검수해 같은 구조로 채웁니다.</p></aside>') +
          '<details class="term-detail-disclosure term-detail-disclosure--connected"><summary><span><b>연결된 학습</b><small>' + pathNames.length + '개 경로 · 관련 단어 ' + ((term.related || []).slice(0, 4).length) + '개</small></span>' + icon("chevron") + '</summary><div><section class="term-sheet__section term-detail-paths"><h3>이 단어가 들어간 경로</h3>' + (paths ? '<div>' + paths + '</div><small>하나의 단어가 여러 실전 경로에 중복해 들어갈 수 있습니다.</small>' : '<p class="term-detail-paths__empty">전면 개편에서 실전 상황 기준으로 연결할 경로를 검수해 배치합니다.</p>') + '</section>' +
          (related ? '<div class="term-sheet__related"><strong>이어 보면 좋은 단어</strong><div>' + related + '</div></div>' : '') + '</div></details>' +
        '</div><footer class="term-sheet__actions"><button class="primary-cta" type="button"' + primaryAction + '><span>' + esc(primaryLabel) + '</span>' + nestedArrow() + '</button>' +
          '<button class="secondary-cta" type="button" data-action="category-terms" data-category="' + category.id + '">' + esc(category.name) + ' 전체 ' + category.count + '개</button></footer>' +
      '</section></div>';
  }

  function hubShell(active, title, meta, body, extraClass) {
    return '<div class="prototype-page guided-page is-hub ' + (extraClass || "") + '">' +
      '<aside class="guided-sidebar">' + appMark(false) + '<nav class="app-nav" aria-label="주요 화면">' + navItems(active) + '</nav>' +
        '<div class="sidebar-note"><span>OFFLINE READY</span><p>Wi-Fi에서 한 번 준비하면 지하철에서도 설명·그림·복습을 그대로 볼 수 있습니다.</p></div></aside>' +
      '<main class="hub-main" id="prototype-main">' +
        '<header class="guided-topbar hub-topbar"><div><span>' + esc(title) + '</span><b>' + esc(meta) + '</b></div><div class="guided-progress"><i style="transform:scaleX(0)"></i></div></header>' +
        '<div class="hub-scroll">' + body + '</div>' +
      '</main>' +
      '<nav class="mobile-island app-nav" aria-label="모바일 주요 화면">' + navItems(active) + '</nav>' +
      categorySheet() +
      termSheet() +
    '</div>';
  }

  function todayTemplate() {
    var category = CATEGORIES.find(function (item) { return item.id === state.todayCategory; }) || CATEGORIES[6];
    var path = pathsForCategory(category)[state.todayRouteIndex] || category.path;
    var isDnsPath = category.id === "net" && state.todayRouteIndex === 0;
    var terms = path.terms.map(function (term) { return '<span>' + esc(term) + '</span>'; }).join("");
    var primaryLabel = isDnsPath ? "DNS 이어서 학습" : "경로 이어서 보기";
    var heroGoal = isDnsPath ? "DNS를 설명할 수 있어요." : category.topic + "의 흐름을 설명할 수 있어요.";
    var reviewNames = REVIEW_QUEUE.slice(0, 3).map(function (item) { return item.term; }).join(" · ");
    var recentNames = [["DNS", "net"], ["TCP", "net"], ["인덱스", "db"]];
    var recent = recentNames.map(function (entry) {
      var term = termByName(entry[0], entry[1]);
      if (!term) return "";
      return '<button type="button" data-action="term-open" data-term="' + term.id + '"><span><b>' + esc(term.term) + '</b><small>' + esc(term.bookName) + '</small></span><em>다시 보기</em></button>';
    }).join("");
    var body = '<div class="today-shell">' +
      '<header class="today-hero" data-reveal><div><span class="eyebrow">SAT · 지하철 학습 모드</span><i><b>4</b>일 연속</i></div><h1>오늘은 ' + path.minutes + '분이면<br><em>' + esc(heroGoal) + '</em></h1><p>길게 하지 않아도 괜찮아요. 한 개를 내 말로 설명하면 오늘 진도입니다.</p></header>' +
      '<section class="today-focus" data-reveal><div class="today-focus__meta"><span>오늘의 경로 · ' + esc(category.name) + '</span><small>' + path.minutes + '분</small></div>' +
        '<h2>' + esc(path.name) + '</h2><p>' + esc(category.blurb) + '</p><div class="today-focus__terms">' + terms + '</div>' +
        '<div class="today-focus__progress"><span><i style="width:' + (isDnsPath ? "33" : "0") + '%"></i></span><small>' + (isDnsPath ? "2 / 6 단계" : "시작 전") + '</small></div>' +
        '<button class="primary-cta" type="button" data-action="today-primary"><span>' + primaryLabel + '</span>' + nestedArrow() + '</button></section>' +
      '<div class="today-grid" data-reveal><button class="today-review" type="button" data-action="nav-view" data-view="review"><span class="eyebrow">오늘 복습</span><b>3개가 기다려요</b><small>' + esc(reviewNames) + ' · 약 4분</small>' + icon("recall") + '</button>' +
        '<article class="today-offline"><span>' + icon("check") + '</span><b>오프라인 준비 완료</b><small>12개 카테고리 · 629개 단어</small></article></div>' +
      '<section class="today-recent" data-reveal><header><h2>최근 배운 단어</h2><button type="button" data-action="nav-view" data-view="progress">진도 보기</button></header><div>' + recent + '</div></section>' +
    '</div>';
    return hubShell("today", "오늘 · 8월 30일", "4일 연속", body, "is-today");
  }

  function filteredSearchTerms() {
    var query = state.searchQuery.trim().toLowerCase();
    var recommended = [
      termByName("DNS", "net"), termByName("TCP", "net"), termByName("인덱스", "db"),
      termByName("OAuth 2.0", "sec"), termByName("Container", "tool"), termByName("RAG", "ai"),
      termByName("HTML", "web"), termByName("Git", "tool")
    ].filter(Boolean).map(function (term) { return term.id; });
    var pool = allTerms().filter(function (term) {
      if (state.searchCategory !== "all" && term.bookId !== state.searchCategory) return false;
      if (!query) return recommended.indexOf(term.id) !== -1;
      var haystack = [term.term, term.reading, term.summary].concat(term.aliases || []).join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
    return pool.slice(0, 24);
  }

  function searchResultsMarkup() {
    var results = filteredSearchTerms();
    if (!results.length) return '<div class="search-empty"><span>' + icon("search") + '</span><b>맞는 단어를 찾지 못했습니다</b><p>영문·한글 이름을 바꿔 입력하거나 카테고리를 전체로 바꿔보세요.</p></div>';
    return results.map(function (term) {
      return '<button class="search-result" type="button" data-action="term-open" data-term="' + term.id + '"><span class="search-result__mark">' + esc(term.bookId.toUpperCase()) + '</span><span><small>' + esc(term.bookName) + '</small><b>' + esc(term.term) + '</b><p>' + esc(plain(term.summary)) + '</p></span>' + icon("arrow") + '</button>';
    }).join("");
  }

  function updateSearchResults() {
    var list = document.getElementById("search-results-list");
    var count = document.getElementById("search-results-count");
    var title = document.getElementById("search-results-title");
    if (list) list.innerHTML = searchResultsMarkup();
    if (count) count.textContent = state.searchQuery.trim() ? filteredSearchTerms().length + "개 결과" : "추천 8개";
    if (title) title.textContent = state.searchQuery.trim() ? "“" + state.searchQuery + "”" : "지금 많이 보는 단어";
  }

  function searchTemplate() {
    var options = ['<option value="all">전체 카테고리</option>'].concat(CATEGORIES.map(function (item) {
      return '<option value="' + item.id + '"' + (state.searchCategory === item.id ? " selected" : "") + '>' + esc(item.name) + ' · ' + item.count + '</option>';
    })).join("");
    var body = '<div class="search-shell"><header class="screen-heading" data-reveal><span class="eyebrow">629 WORDS · ONE SEARCH</span><h1>모르는 단어를<br>바로 찾아보세요.</h1><p>영문 이름, 한글 읽기, 별칭까지 함께 찾습니다.</p></header>' +
      '<section class="search-tools" data-reveal><label class="search-box" for="search-input">' + icon("search") + '<input id="search-input" type="search" value="' + esc(state.searchQuery) + '" placeholder="예: DNS, 인증, 캐시" autocomplete="off"><button type="button" data-action="search-clear" aria-label="검색어 지우기">×</button></label>' +
        '<label class="search-select"><span>범위</span><select id="search-category">' + options + '</select></label></section>' +
      '<section class="search-results"><header><h2 id="search-results-title">' + (state.searchQuery.trim() ? '“' + esc(state.searchQuery) + '”' : "지금 많이 보는 단어") + '</h2><span id="search-results-count">' + (state.searchQuery.trim() ? filteredSearchTerms().length + "개 결과" : "추천 8개") + '</span></header><div id="search-results-list">' + searchResultsMarkup() + '</div></section></div>';
    return hubShell("search", "찾기", "629개", body, "is-search");
  }

  function reviewTemplate() {
    var reviewTotal = 3;
    var item = REVIEW_QUEUE[state.reviewIndex % reviewTotal];
    var reviewNames = REVIEW_QUEUE.slice(0, reviewTotal).map(function (reviewItem) { return reviewItem.term; }).join(" · ");
    var body = '<div class="review-shell"><header class="screen-heading review-heading" data-reveal><span class="eyebrow">SPACED RECALL · 약 4분</span><h1>먼저 떠올리고,<br>그다음 확인하세요.</h1><p>오늘 다시 볼 ' + esc(reviewNames) + ' 3개를 하나씩 떠올립니다.</p></header>' +
      '<div class="review-session"><div class="review-progress"><span><i style="width:' + ((state.reviewIndex + 1) / reviewTotal * 100) + '%"></i></span><b>' + (state.reviewIndex + 1) + ' / ' + reviewTotal + '</b></div>' +
        '<article class="recall-card' + (state.reviewRevealed ? " is-revealed" : "") + '" data-reveal><header><span>' + esc(item.category) + '</span><small>화면을 가리고 말해보세요</small></header><h2>' + esc(item.term) + '</h2><p class="recall-card__prompt">' + esc(item.prompt) + '</p><div class="recall-cues"><span>힌트</span><b>' + esc(item.cue) + '</b></div>' +
          (state.reviewRevealed ? '<div class="recall-answer"><span>모범 설명</span><p>' + esc(item.answer) + '</p></div><div class="recall-grade" role="group" aria-label="기억 정도"><button type="button" data-action="review-grade" data-grade="again">다시</button><button type="button" data-action="review-grade" data-grade="hard">어려움</button><button type="button" data-action="review-grade" data-grade="good">알겠음</button></div>' :
            '<button class="primary-cta" type="button" data-action="review-reveal"><span>말한 뒤 정답 확인</span>' + nestedArrow() + '</button>') +
        '</article></div></div>';
    return hubShell("recall", "복습", "3개", body, "is-review");
  }

  function progressTemplate() {
    var groups = PROGRESS_GROUPS.map(function (group) {
      var pct = Math.round(group.learned / group.total * 100);
      return '<article><header><span style="--group-color:' + group.color + '"></span><b>' + esc(group.name) + '</b><small>' + group.learned + ' / ' + group.total + '</small></header><div><i style="width:' + pct + '%;background:' + group.color + '"></i></div><p>' + pct + '% · 설명 가능한 단어</p></article>';
    }).join("");
    var learnedByCategory = { net: 6, cs: 3, web: 2, sec: 2, tool: 1, db: 1, lang: 1, arch: 1, ai: 1, cloud: 0, infra: 0, pm: 0 };
    var categoryRows = CATEGORIES.slice().sort(function (a, b) { return learnedByCategory[b.id] - learnedByCategory[a.id]; }).map(function (item) {
      var learned = learnedByCategory[item.id];
      return '<button type="button" data-action="progress-course" data-category="' + item.id + '"><span><b>' + esc(item.name) + '</b><small>' + learned + '개 설명 가능 · 전체 ' + item.count + '개</small></span><em>' + Math.round(learned / item.count * 100) + '%</em></button>';
    }).join("");
    var bars = [32, 58, 42, 76, 51, 88, 64].map(function (height, index) {
      return '<span><i style="height:' + height + '%"></i><small>' + ["일", "월", "화", "수", "목", "금", "토"][index] + '</small></span>';
    }).join("");
    var body = '<div class="progress-shell"><header class="screen-heading" data-reveal><span class="eyebrow">YOUR LEARNING MAP</span><h1>27개를 공부했고,<br><em>18개를 설명할 수 있어요.</em></h1><p>읽은 수보다 화면 없이 설명 가능한 수를 먼저 봅니다.</p></header>' +
      '<section class="progress-overview" data-reveal><div class="mastery-ring" style="--mastery:4"><span><b>27</b><small>/ 629</small></span></div><div><span>이번 주</span><b>4일 학습 · 7개 복습</b><small>새로 배운 단어는 12개예요.</small></div></section>' +
      '<section class="weekly-chart" data-reveal><header><h2>최근 7일</h2><span>목표 5분 / 일</span></header><div>' + bars + '</div></section>' +
      '<section class="progress-groups" data-reveal><header><h2>4개 분야</h2><span>설명 가능 기준</span></header><div>' + groups + '</div></section>' +
      '<section class="progress-categories" data-reveal><header><h2>카테고리별 진도</h2><button type="button" data-action="nav-view" data-view="catalog">코스에서 보기</button></header><div>' + categoryRows + '</div></section></div>';
    return hubShell("progress", "진도", "27 / 629", body, "is-progress");
  }

  function courseRouteRow(category) {
    var routePreview = category.path.terms.slice(0, 3).map(esc).join(" → ");
    return '<article class="course-route-row" data-reveal>' +
      '<button class="course-route-row__main" type="button" data-action="category-detail" data-category="' + category.id + '">' +
        '<span class="course-route-row__mark">' + esc(category.mark) + '</span><span class="course-route-row__copy"><small>' + esc(category.name) + ' · 3개 경로 · ' + category.count + '개</small><b>' + esc(category.path.name) + '</b><em>' + routePreview + ' → +' + (category.path.terms.length - 3) + '</em></span>' + icon("chevron") +
      '</button><div class="course-route-row__actions">' +
        '<button type="button" data-action="route-open" data-category="' + category.id + '"><span>경로 보기</span>' + icon("arrow") + '</button>' +
        '<button type="button" data-action="category-terms" data-category="' + category.id + '"><span>' + esc(category.name) + ' 전체 ' + category.count + '개</span>' + icon("arrow") + '</button>' +
      '</div></article>';
  }

  function courseCatalogTemplate() {
    var todayCategory = CATEGORIES.find(function (item) { return item.id === state.todayCategory; }) || CATEGORIES[6];
    var todayPath = pathsForCategory(todayCategory)[state.todayRouteIndex] || todayCategory.path;
    var isDnsPath = todayCategory.id === "net" && state.todayRouteIndex === 0;
    var resumeMeta = isDnsPath ? "DNS · 2 / 6 · 흐름" : todayPath.terms.slice(0, 3).map(esc).join(" → ") + " · 시작 전";
    var groups = CATEGORY_GROUPS.map(function (group) {
      var rows = group.ids.map(function (id) {
        return courseRouteRow(CATEGORIES.find(function (category) { return category.id === id; }));
      }).join("");
      var total = group.ids.reduce(function (sum, id) {
        return sum + CATEGORIES.find(function (category) { return category.id === id; }).count;
      }, 0);
      return '<section class="course-group"><header><span>' + esc(group.name) + '</span><small>' + total + '개</small></header><div>' + rows + '</div></section>';
    }).join("");
    var body = '<div class="course-home-shell">' +
      '<header class="screen-heading screen-heading--compact" data-reveal><span class="eyebrow">4개 학습 분야 · 12개 카테고리</span><h1>짧은 경로로 배우고,<br><em>629개는 사전에서 찾으세요.</em></h1><p>경로는 이해할 순서, 전체 목록은 업무 중 찾아보는 사전입니다.</p></header>' +
      '<section class="course-resume" data-reveal><div><span>이어 배우기 · ' + esc(todayCategory.name) + '</span><h2>' + esc(todayPath.name) + '</h2><p>' + resumeMeta + '</p></div><button class="primary-cta" type="button" data-action="today-primary"><span>' + (isDnsPath ? "DNS 이어 배우기" : "선택한 경로 보기") + '</span>' + nestedArrow() + '</button></section>' +
      '<div class="course-groups">' + groups + '</div></div>';
    return hubShell("course", "코스", "12개 카테고리", body, "is-course-home");
  }

  function filteredCategoryTerms() {
    var query = state.termListQuery.trim().toLowerCase();
    return termsForCategory(state.category).filter(function (term) {
      if (!query) return true;
      return [term.term, term.reading, term.summary].concat(term.aliases || []).join(" ").toLowerCase().indexOf(query) !== -1;
    }).sort(function (a, b) { return a.term.localeCompare(b.term, "ko"); });
  }

  function categoryTermsMarkup() {
    var terms = filteredCategoryTerms();
    if (!terms.length) return '<div class="search-empty"><span>' + icon("search") + '</span><b>맞는 단어가 없어요</b><p>영문·한글 표기를 바꿔서 찾아보세요.</p></div>';
    return terms.map(function (term, index) {
      var status = termStatus(index);
      return '<button class="term-list-row" type="button" data-action="term-open" data-term="' + term.id + '">' +
        '<span class="term-list-row__index">' + String(index + 1).padStart(2, "0") + '</span><span class="term-list-row__copy"><b>' + esc(term.term) + '</b><small>' + esc(term.reading || plain(term.summary)) + '</small></span>' +
        '<em class="term-status ' + status[1] + '">' + status[0] + '</em>' + icon("arrow") + '</button>';
    }).join("");
  }

  function updateCategoryTerms() {
    var list = document.getElementById("category-term-results");
    var count = document.getElementById("category-term-count");
    if (list) list.innerHTML = categoryTermsMarkup();
    if (count) count.textContent = filteredCategoryTerms().length + '개';
  }

  function categoryTermsTemplate() {
    var category = selectedCategory();
    var body = '<div class="term-library-shell"><button class="inline-back" type="button" data-action="category-detail" data-category="' + category.id + '">' + icon("back") + '<span>' + esc(category.name) + '로 돌아가기</span></button>' +
      '<header class="screen-heading screen-heading--compact" data-reveal><span class="eyebrow">' + esc(category.mark) + ' DICTIONARY</span><h1>' + esc(category.name) + '<br><em>전체 ' + category.count + '개 단어</em></h1><p>경로에 들지 않은 단어까지 하나도 빼지 않고 보여줍니다.</p></header>' +
      '<label class="search-box term-library-search" for="category-term-search">' + icon("search") + '<input id="category-term-search" type="search" value="' + esc(state.termListQuery) + '" placeholder="' + esc(category.name) + '에서 찾기" autocomplete="off"><button type="button" data-action="category-search-clear" aria-label="검색어 지우기">×</button></label>' +
      '<section class="term-library-results"><header><h2>전체 단어</h2><span id="category-term-count">' + filteredCategoryTerms().length + '개</span></header><div id="category-term-results">' + categoryTermsMarkup() + '</div></section></div>';
    return hubShell("course", category.name, category.count + "개", body, "is-term-library");
  }

  function categoryHubTemplate() {
    var category = selectedCategory();
    var group = CATEGORY_GROUPS.find(function (item) { return item.ids.indexOf(category.id) !== -1; });
    var paths = pathsForCategory(category);
    var pathTerms = paths[0].terms.map(function (term, index) {
      return (index ? '<i aria-hidden="true">→</i>' : '') + '<span>' + esc(term) + '</span>';
    }).join("");
    var extraCards = paths.slice(1).map(function (path, index) {
      var preview = path.terms.slice(0, 4).map(function (term) { return '<span>' + esc(term) + '</span>'; }).join('<i>→</i>');
      return '<article class="category-path-option" data-reveal><div><span>보조 경로 0' + (index + 1) + '</span><small>' + path.terms.length + '개 개념 · ' + path.minutes + '분</small></div><h3>' + esc(path.name) + '</h3><div class="category-path-option__terms">' + preview + '<em>+' + (path.terms.length - 4) + '</em></div><button type="button" data-action="route-open" data-category="' + category.id + '" data-route="' + (index + 1) + '"><span>이 경로 보기</span>' + icon("arrow") + '</button></article>';
    }).join("");
    var body = '<div class="category-detail-shell"><button class="inline-back" type="button" data-action="nav-view" data-view="catalog">' + icon("back") + '<span>전체 코스로 돌아가기</span></button>' +
      '<header class="category-detail-heading" data-reveal><div><span class="eyebrow">' + esc(group.name) + '</span><h1>' + esc(category.name) + '</h1><p>' + esc(category.blurb) + '</p><small>3개 학습 경로 · 전체 ' + category.count + '개 단어</small></div><button type="button" data-action="category-open">' + esc(category.name) + icon("chevron") + '</button></header>' +
      '<section class="category-paths"><header><h2>실전 상황으로 배우기</h2><span>단어는 여러 경로에 중복해 들어갑니다</span></header><article class="catalog-path" data-reveal><div class="catalog-path__meta"><span>대표 경로 · ' + esc(category.topic) + '</span><small>' + paths[0].terms.length + '개 개념 · 기초 · ' + paths[0].minutes + '분</small></div>' +
        '<h2>' + esc(paths[0].name) + '</h2><p>한 번에 외우지 않고, 앞 단어가 다음 단어를 필요로 하는 이유를 따라갑니다.</p>' +
        '<div class="catalog-path__nodes" aria-label="경로에 포함된 단어">' + pathTerms + '</div>' +
        '<button class="primary-cta" type="button" data-action="route-open" data-category="' + category.id + '" data-route="0"><span>대표 경로 보기</span>' + nestedArrow() + '</button></article><div class="category-paths__extras">' + extraCards + '</div></section>' +
      '<button class="catalog-all-terms" type="button" data-action="category-terms" data-category="' + category.id + '"><span><b>' + esc(category.name) + ' 전체 ' + category.count + '개</b><small>경로에 없는 단어까지 전체 사전에서 찾기</small></span>' + icon("arrow") + '</button></div>';
    return hubShell("course", category.name, category.count + "개", body, "is-category-detail");
  }

  function guidedTemplate() {
    if (state.view === "today") return todayTemplate();
    if (state.view === "catalog") return courseCatalogTemplate();
    if (state.view === "category") return categoryHubTemplate();
    if (state.view === "terms") return categoryTermsTemplate();
    if (state.view === "search") return searchTemplate();
    if (state.view === "review") return reviewTemplate();
    if (state.view === "progress") return progressTemplate();
    var category = selectedCategory();
    var started = state.courseStarted;
    var isDnsRoute = category.id === "net" && state.routeIndex === 0;
    var done = Math.round((state.courseStep / (COURSE.length - 1)) * 100);
    var routeContext = started ? conceptTrail(true) : routeTrail(category);
    var rail = COURSE.map(function (item, index) {
      var status = index < state.courseStep ? " is-done" : (index === state.courseStep ? " is-current" : "");
      return '<button class="course-rail__step' + status + '" type="button" data-action="course-step" data-step="' + index + '"' +
        ' aria-current="' + (index === state.courseStep ? "step" : "false") + '"><span class="course-rail__no">' +
        (index < state.courseStep ? icon("check") : item.no) + '</span><span><b>' + item.name + '</b><small>' + item.hint + '</small></span></button>';
    }).join("");
    var workspace = started && isDnsRoute ?
      '<div class="guided-workspace">' +
        '<aside class="course-rail" aria-label="학습 단계"><div class="course-rail__head">' + progressRing(done) + '<span><b>' + done + '%</b><small>설명 준비도</small></span></div>' + rail + '</aside>' +
        '<div class="guided-stage">' + guidedStepBody() + '</div>' +
      '</div>' : '';
    var nextName = state.courseStep < COURSE.length - 1 ? COURSE[state.courseStep + 1].name : "퀴즈";
    var nextLabel = state.courseStep < COURSE.length - 1 ? "다음 단계" : "퀴즈로";
    var topControl = started ? categoryTrigger(category.name + " · DNS") : '<button class="route-topback" type="button" data-action="category-detail" data-category="' + category.id + '">' + icon("back") + '<span>' + esc(category.name) + '</span></button>';
    var previewActions = !started ? '<section class="route-preview-actions"><div><span>' + (isDnsRoute ? "DNS 상세 체험" : "경로 구성 미리보기") + '</span><h2>' + (isDnsRoute ? "DNS를 남에게 설명할 때까지 배웁니다." : "이 순서를 오늘의 학습 경로로 선택할 수 있어요.") + '</h2><p>' + (isDnsRoute ? "필요 → 핵심 → 흐름 → 오해 → 설명 → 확인의 6단계입니다." : "각 노드를 누르면 실제 단어 설명을 먼저 확인할 수 있습니다. 상세 학습 깊이는 DNS 편에서 완성했습니다.") + '</p></div><div>' +
      (isDnsRoute ? '<button class="primary-cta" type="button" data-action="course-next"><span>DNS 상세 학습 시작</span>' + nestedArrow() + '</button>' : '<button class="primary-cta" type="button" data-action="route-save"><span>오늘 경로로 선택</span>' + nestedArrow() + '</button>') +
      '<button class="secondary-cta" type="button" data-action="category-terms" data-category="' + category.id + '">' + esc(category.name) + ' 전체 ' + category.count + '개 보기</button></div></section>' : '';
    return '<div class="prototype-page guided-page ' + (started ? "is-session" : "is-hub is-route-preview") + '">' +
      '<aside class="guided-sidebar">' + appMark(false) + '<nav class="app-nav" aria-label="주요 화면">' + navItems("course") + '</nav>' +
        '<div class="sidebar-note"><span>오늘의 약속</span><p>한 단어를 읽고 끝내지 않고, 남에게 설명할 때까지 갑니다.</p></div></aside>' +
      '<main class="guided-main" id="prototype-main">' +
        '<header class="guided-topbar"><div>' + topControl + '<b>' + (started ? (state.courseStep + 1) + ' / ' + COURSE.length : "경로 소개") + '</b></div>' +
          '<div class="guided-progress"><i style="transform:scaleX(' + (done / 100) + ')"></i></div></header>' +
        '<div class="guided-scroll"><div class="guided-context">' + routeContext + '</div>' + workspace + previewActions + '</div>' +
        (started ? '<footer class="course-actions"><button class="round-action" type="button" data-action="course-prev" aria-label="' + (state.courseStep === 0 ? "경로 소개로 돌아가기" : "이전 단계") + '">' + icon("back") + '</button>' +
          '<span><small>다음</small><b>' + nextName + '</b></span>' +
          '<button class="primary-cta" type="button" data-action="course-next"><span>' + nextLabel + '</span>' + nestedArrow() + '</button></footer>' : '') +
      '</main>' +
      '<nav class="mobile-island app-nav" aria-label="모바일 주요 화면">' + navItems("course") + '</nav>' +
      categorySheet() +
      termSheet() +
    '</div>';
  }

  function atlasNode(key, className) {
    var concept = CONCEPTS[key];
    var selected = state.concept === key;
    return '<button class="atlas-node ' + className + (selected ? " is-selected" : "") + '" type="button" data-action="concept" data-concept="' + key + '" aria-pressed="' + selected + '">' +
      '<span class="atlas-node__dot"></span><span><small>' + esc(concept.relation) + '</small><b>' + esc(concept.name) + '</b><em>' + esc(concept.ko) + '</em></span></button>';
  }

  function atlasInspector() {
    var item = CONCEPTS[state.concept];
    var isDns = state.concept === "dns";
    return '<aside class="atlas-inspector" aria-live="polite">' +
      '<div class="atlas-inspector__top"><span class="eyebrow">SELECTED CONCEPT</span><span class="atlas-index">0' + (Object.keys(CONCEPTS).indexOf(state.concept) + 1) + ' / 06</span></div>' +
      '<h1>' + esc(item.name) + '</h1><p class="atlas-ko">' + esc(item.ko) + '</p>' +
      '<p class="atlas-summary">' + esc(item.summary) + '</p>' +
      (isDns ? '<div class="atlas-memory">' + storyboard({ step: 1, controls: false }) + '</div>' :
        '<div class="concept-symbol" aria-hidden="true"><span>' + icon(state.concept === "cache" ? "recall" : "map") + '</span><i></i><b>' + esc(item.name.charAt(0)) + '</b></div>') +
      '<dl class="atlas-facts"><div><dt>이 경로에서</dt><dd>' + esc(item.relation) + '</dd></div><div><dt>다음 개념</dt><dd>' + esc(item.next) + '</dd></div></dl>' +
      '<button class="atlas-cta" type="button" data-action="open-guided"><span>가이드 코스로 배우기</span>' + nestedArrow() + '</button>' +
    '</aside>';
  }

  function atlasTemplate() {
    return '<div class="prototype-page atlas-page">' +
      '<header class="atlas-nav island-nav">' + appMark(true) + '<nav class="atlas-nav__links" aria-label="개념 지도 메뉴">' +
        '<button class="is-active" type="button">오늘 경로</button><button type="button" data-demo-toast="전체 629개 개념 지도는 후속 범위입니다">전체 지도</button><button type="button" data-demo-toast="검색은 실제 앱 데이터와 연결할 예정입니다">검색</button></nav>' +
        '<button class="atlas-review" type="button" data-demo-toast="복습할 단어 14개"><span></span>복습 14</button></header>' +
      '<main class="atlas-main" id="prototype-main">' +
        '<section class="atlas-canvas" aria-labelledby="atlas-title">' +
          '<div class="atlas-intro"><span class="eyebrow">TODAY’S CONCEPT PATH · 06 MIN</span><h1 id="atlas-title">웹사이트를 여는 순간,<br><em>다섯 개념이 이어집니다.</em></h1><p>노드를 눌러 “누가 무엇을 넘기는지” 따라가 보세요.</p></div>' +
          '<div class="atlas-map" role="group" aria-label="Domain에서 HTTP까지의 개념 연결 지도">' +
            '<svg class="atlas-lines" viewBox="0 0 900 580" aria-hidden="true"><path d="M110 285C220 285 230 150 345 150"/><path d="M420 175C485 220 490 280 555 300"/><path d="M625 300C710 300 730 215 825 215"/><path d="M620 330C710 350 730 430 825 430"/><path d="M350 175C330 250 365 340 455 415"/></svg>' +
            atlasNode("domain", "node-domain") + atlasNode("dns", "node-dns") + atlasNode("ip", "node-ip") + atlasNode("tcp", "node-tcp") + atlasNode("http", "node-http") + atlasNode("cache", "node-cache") +
            '<div class="atlas-legend"><span><i></i>오늘 경로</span><span><i></i>지름길</span></div>' +
          '</div>' +
          '<div class="atlas-teachline"><span>한 줄로 연결하면</span><p><b>이름</b>을 DNS에 맡기고 <b>주소</b>를 받으면, TCP로 연결해 HTTP로 내용을 주고받습니다.</p></div>' +
        '</section>' + atlasInspector() +
      '</main>' +
      '<nav class="mobile-island app-nav app-nav--dark" aria-label="모바일 주요 화면">' + navItems("search") + '</nav>' +
    '</div>';
  }

  function handbookTemplate() {
    return '<div class="prototype-page handbook-page" data-handbook data-chapter="meaning">' +
      '<header class="handbook-nav island-nav">' + appMark(false) + '<nav aria-label="그림 사전 메뉴"><button class="is-active" type="button">오늘의 글</button><button type="button" data-demo-toast="12개 분야 에디션은 후속 범위입니다">분야</button><button type="button" data-demo-toast="검색은 실제 앱 데이터와 연결할 예정입니다">찾기</button><button type="button" data-demo-toast="복습할 단어 14개">복습 <i>14</i></button></nav><button class="theme-dot" type="button" data-demo-toast="실제 앱의 밝게/어둡게 보기를 유지합니다" aria-label="화면 테마">' + icon("sun") + '</button></header>' +
      '<main id="prototype-main">' +
        '<section class="handbook-cover">' +
          '<div class="handbook-cover__copy" data-reveal><span class="eyebrow">THE NETWORK EDITION · ARTICLE 11</span><h1>DNS<span>.</span></h1><p class="handbook-deck">이름을 주소로 바꾸는<br>인터넷의 조용한 안내소.</p><div class="handbook-meta"><span>6분 읽기</span><span>그림 2개</span><span>확인 3문제</span></div><a class="underlined-link" href="#handbook-article">그림부터 읽기 ' + icon("arrow") + '</a></div>' +
          '<div class="handbook-cover__visual" data-reveal>' + storyboard({ step: 1, all: true, controls: false }) + '<span class="plate-note">FIG. 01 · NAME → ADDRESS</span></div>' +
        '</section>' +
        '<section class="handbook-article" id="handbook-article">' +
          '<aside class="handbook-stage" aria-label="현재 설명 장면"><div class="handbook-stage__shell"><div class="handbook-stage__image">' +
            '<div class="handbook-stage__scene">' + dnsSceneSvg() + '</div></div>' +
            '<div class="handbook-stage__caption"><span id="chapter-kicker">01 · 무엇인가</span><p id="chapter-caption">사람이 읽는 이름을 컴퓨터가 찾아갈 주소로 바꿉니다.</p></div></div>' +
            '<nav class="chapter-ticks" aria-label="글의 절"><a class="is-active" href="#chapter-meaning" data-chapter-link="meaning">01</a><a href="#chapter-why" data-chapter-link="why">02</a><a href="#chapter-work" data-chapter-link="work">03</a><a href="#chapter-myth" data-chapter-link="myth">04</a><a href="#chapter-teach" data-chapter-link="teach">05</a></nav>' +
          '</aside>' +
          '<article class="handbook-copy">' +
            '<section id="chapter-meaning" data-chapter-section="meaning" data-reveal><span class="chapter-no">01</span><span class="eyebrow">WHAT IT IS · 무엇인가</span><h2>사람의 이름과<br>컴퓨터의 주소 사이.</h2><p class="chapter-lede">DNS는 <mark>도메인 이름을 IP 주소로 바꿔주는 체계</mark>입니다.</p><p>친구 이름을 말하면 전화번호를 찾아주는 번호부와 같습니다. 번호가 바뀌어도 친구 이름은 그대로인 것처럼, 서버 주소가 바뀌어도 우리는 같은 도메인을 씁니다.</p><div class="word-parts"><span>DOMAIN<small>이름이 미치는 구역</small></span><i>＋</i><span>NAME<small>이름</small></span><i>＋</i><span>SYSTEM<small>체계</small></span></div></section>' +
            '<section id="chapter-why" data-chapter-section="why" data-reveal><span class="chapter-no">02</span><span class="eyebrow">WHY IT EXISTS · 왜 필요한가</span><h2>숫자 주소를<br>외우지 않기 위해.</h2><p class="chapter-lede">이름과 주소를 떼어 두면 <mark>기억하기 쉽고, 옮기기도 쉽습니다.</mark></p><p>DNS가 없다면 서버를 옮길 때마다 모든 사용자에게 새 숫자 주소를 알려야 합니다. 지금은 주소록의 값 하나만 바꾸면 됩니다.</p><blockquote>사람은 이름을, 기계는 숫자를 쓴다.<br>DNS는 그 사이의 번역기다.</blockquote></section>' +
            '<section id="chapter-work" data-chapter-section="work" data-reveal><span class="chapter-no">03</span><span class="eyebrow">HOW IT WORKS · 어떻게 되나</span><h2>묻고, 돌려받고,<br>그 주소로 간다.</h2><p class="chapter-lede">DNS가 하는 일은 <mark>두 번째 장면에서 끝납니다.</mark></p><ol class="editorial-steps"><li><span>1</span><p><b>브라우저가 이름을 맡깁니다.</b><small>naver.com의 주소를 알려줘.</small></p></li><li><span>2</span><p><b>DNS가 맞는 주소를 돌려줍니다.</b><small>전에 찾은 답이 있으면 캐시에서 바로 줍니다.</small></p></li><li><span>3</span><p><b>브라우저가 그 주소로 직접 갑니다.</b><small>이제 TCP와 HTTPS가 일을 이어받습니다.</small></p></li></ol>' +
              '<div class="handbook-tech">' + card().svg + '<p>기술 도해는 정확한 왕복 순서를, 큰 장면은 기억할 이야기를 담당합니다.</p></div></section>' +
            '<section id="chapter-myth" data-chapter-section="myth" data-reveal><span class="chapter-no">04</span><span class="eyebrow">THE TRAP · 흔한 오해</span><h2>번호부가 전화를<br>걸어주지는 않습니다.</h2><p class="chapter-lede">DNS는 사이트에 연결하지 않고 <mark>IP 주소를 알려준 뒤 끝납니다.</mark></p><p>“DNS를 바꾸면 다운로드가 빨라진다”도 대부분 틀립니다. 이름을 찾는 몇십 밀리초는 줄어들 수 있지만, 파일을 받는 회선 속도는 그대로입니다.</p><div class="myth-stamp"><span>DON’T CONFUSE</span><b>주소 찾기 ≠ 연결하기</b></div></section>' +
            '<section id="chapter-teach" data-chapter-section="teach" data-reveal><span class="chapter-no">05</span><span class="eyebrow">TEACH IT · 남에게 설명하기</span><h2>이제 화면을 덮고<br>두 문장으로 말해보세요.</h2><p class="chapter-lede">설명 안에 <mark>이름, 주소, DNS가 끝나는 지점</mark>이 있으면 됩니다.</p><div class="editorial-prompt"><p>“친구 이름과 전화번호” 비유로 시작해도 좋습니다.</p><button type="button" data-action="answer">' + (state.answer ? "모범 설명 닫기" : "말한 뒤 모범 설명 보기") + '</button>' +
              (state.answer ? '<div class="model-answer"><span>모범 설명</span><p>DNS는 친구 이름을 말하면 전화번호를 찾아주는 번호부처럼, 도메인 이름을 IP 주소로 바꿔줘. 주소를 받은 뒤 실제로 서버에 연결하는 건 브라우저와 TCP가 해.</p></div>' : "") + '</div></section>' +
          '</article>' +
        '</section>' +
      '</main>' +
      '<footer class="handbook-footer"><span>다음 글</span><a href="#" data-demo-toast="다음 단어는 IP Address입니다"><b>IP Address</b>' + icon("arrow") + '</a></footer>' +
      '<nav class="mobile-island app-nav" aria-label="모바일 주요 화면">' + navItems("today") + '</nav>' +
    '</div>';
  }

  function render() {
    document.body.dataset.variant = state.variant;
    document.body.dataset.sheet = (state.categoryOpen || state.termOpen) ? "open" : "closed";
    document.documentElement.style.colorScheme = state.variant === "b" ? "dark" : "light";
    root.innerHTML = state.variant === "a" ? guidedTemplate() : (state.variant === "b" ? atlasTemplate() : handbookTemplate());
    label.textContent = VARIANTS.find(function (item) { return item.key === state.variant; }).label;
    afterRender();
  }

  function afterRender() {
    if (revealObserver) revealObserver.disconnect();
    if (chapterObserver) chapterObserver.disconnect();

    var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    } else {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.12 });
      revealItems.forEach(function (item) { revealObserver.observe(item); });
    }

    if (state.variant === "c") {
      var sections = Array.prototype.slice.call(document.querySelectorAll("[data-chapter-section]"));
      chapterObserver = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
        if (visible) updateChapter(visible.target.dataset.chapterSection);
      }, { rootMargin: "-25% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] });
      sections.forEach(function (section) { chapterObserver.observe(section); });
    }

    if (state.categoryOpen || state.termOpen) {
      var openDialog = document.querySelector(state.termOpen ? ".term-sheet__panel" : ".category-sheet__panel");
      if (openDialog) openDialog.focus({ preventScroll: true });
    }

    window.requestAnimationFrame(function () {
      var currentCategoryChip = document.querySelector(".category-chip.is-current");
      if (currentCategoryChip && currentCategoryChip.parentElement) {
        var chipRail = currentCategoryChip.parentElement;
        chipRail.scrollLeft = Math.max(0, currentCategoryChip.offsetLeft - (chipRail.clientWidth - currentCategoryChip.offsetWidth) / 2);
      }
      var catalogScroller = document.querySelector(".catalog-main");
      if (catalogScroller) catalogScroller.scrollTop = state.catalogScroll;
      var courseScroller = document.querySelector(".guided-scroll");
      if (courseScroller) courseScroller.scrollTop = state.courseScroll;
      var hubScroller = document.querySelector(".hub-scroll");
      if (hubScroller) hubScroller.scrollTop = state.hubScroll;
    });
  }

  function updateChapter(chapter) {
    var page = document.querySelector("[data-handbook]");
    if (!page) return;
    page.dataset.chapter = chapter;
    document.querySelectorAll("[data-chapter-link]").forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.chapterLink === chapter);
    });
    var copy = {
      meaning: ["01 · 무엇인가", "사람이 읽는 이름을 컴퓨터가 찾아갈 주소로 바꿉니다."],
      why: ["02 · 왜 필요한가", "이름과 주소를 떼어 두면 외우기 쉽고 옮기기도 쉽습니다."],
      work: ["03 · 어떻게 되나", "이름을 묻고, 주소를 받고, 브라우저가 그 주소로 직접 갑니다."],
      myth: ["04 · 흔한 오해", "DNS는 연결하지 않습니다. 번호부가 전화를 걸어주지는 않습니다."],
      teach: ["05 · 남에게 설명하기", "이름, 주소, DNS가 끝나는 지점을 두 문장에 담아보세요."]
    }[chapter];
    var kicker = document.getElementById("chapter-kicker");
    var caption = document.getElementById("chapter-caption");
    if (kicker && copy) kicker.textContent = copy[0];
    if (caption && copy) caption.textContent = copy[1];
  }

  function switchVariant(delta) {
    var index = VARIANTS.findIndex(function (item) { return item.key === state.variant; });
    state.variant = VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length].key;
    state.view = "route";
    state.category = "net";
    state.categoryOpen = false;
    state.catalogScroll = 0;
    state.courseScroll = 0;
    state.courseStarted = false;
    state.courseStep = 0;
    state.storyStep = 0;
    state.answer = false;
    var url = new URL(window.location.href);
    url.searchParams.set("variant", state.variant);
    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "auto" });
    render();
    showToast(VARIANTS.find(function (item) { return item.key === state.variant; }).label);
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  function isTyping(target) {
    return target && (target.matches("input, textarea, select") || target.isContentEditable);
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("button, a");
    if (!target) return;
    if (target.dataset.switch) {
      switchVariant(target.dataset.switch === "next" ? 1 : -1);
      return;
    }
    if (target.dataset.action === "nav-view") {
      state.view = target.dataset.view;
      state.categoryOpen = false;
      state.termOpen = false;
      state.hubScroll = 0;
      state.catalogScroll = 0;
      state.courseScroll = 0;
      state.courseStarted = false;
      state.courseStep = 0;
      render();
      return;
    }
    if (target.dataset.action === "category-open") {
      state.categoryOpen = true;
      state.termOpen = false;
      render();
      return;
    }
    if (target.dataset.action === "category-close") {
      state.categoryOpen = false;
      render();
      return;
    }
    if (target.dataset.action === "category-select") {
      state.category = target.dataset.category;
      state.routeIndex = 0;
      state.categoryOpen = false;
      state.view = "category";
      state.hubScroll = 0;
      state.catalogScroll = 0;
      state.courseScroll = 0;
      state.courseStarted = false;
      state.courseStep = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.action === "category-detail") {
      state.category = target.dataset.category || state.category;
      if (target.dataset.category) state.routeIndex = 0;
      state.view = "category";
      state.categoryOpen = false;
      state.termOpen = false;
      state.termListQuery = "";
      state.hubScroll = 0;
      state.courseScroll = 0;
      state.courseStarted = false;
      render();
      return;
    }
    if (target.dataset.action === "category-terms") {
      state.category = target.dataset.category || state.category;
      state.view = "terms";
      state.categoryOpen = false;
      state.termOpen = false;
      state.termListQuery = "";
      state.hubScroll = 0;
      state.courseStarted = false;
      render();
      return;
    }
    if (target.dataset.action === "term-open") {
      state.selectedTermId = target.dataset.term;
      state.termOpen = true;
      state.categoryOpen = false;
      render();
      return;
    }
    if (target.dataset.action === "term-close") {
      state.termOpen = false;
      render();
      return;
    }
    if (target.dataset.action === "term-learn") {
      state.termOpen = false;
      state.category = "net";
      state.routeIndex = 0;
      state.view = "route";
      state.courseStarted = true;
      state.courseStep = 0;
      state.courseScroll = 0;
      render();
      return;
    }
    if (target.dataset.action === "term-course") {
      state.termOpen = false;
      state.category = target.dataset.category || state.category;
      state.routeIndex = 0;
      state.view = "category";
      state.hubScroll = 0;
      render();
      return;
    }
    if (target.dataset.action === "today-primary") {
      state.category = state.todayCategory;
      state.routeIndex = state.todayRouteIndex;
      state.view = "route";
      state.courseStarted = state.category === "net" && state.routeIndex === 0;
      state.courseStep = state.courseStarted ? 2 : 0;
      state.courseScroll = 0;
      render();
      return;
    }
    if (target.dataset.action === "route-save") {
      state.todayCategory = state.category;
      state.todayRouteIndex = state.routeIndex;
      state.view = "today";
      state.courseStarted = false;
      state.hubScroll = 0;
      render();
      showToast(selectedPath(selectedCategory()).name + "을 오늘 경로로 선택했습니다");
      return;
    }
    if (target.dataset.action === "review-reveal") {
      state.reviewRevealed = true;
      render();
      return;
    }
    if (target.dataset.action === "review-grade") {
      state.reviewIndex = (state.reviewIndex + 1) % 3;
      state.reviewRevealed = false;
      state.hubScroll = 0;
      render();
      showToast(target.dataset.grade === "good" ? "기억함 · 복습 간격을 늘렸습니다" : "다시 볼 단어로 저장했습니다");
      return;
    }
    if (target.dataset.action === "progress-course") {
      state.category = target.dataset.category;
      state.routeIndex = 0;
      state.view = "category";
      state.hubScroll = 0;
      render();
      return;
    }
    if (target.dataset.action === "search-clear") {
      state.searchQuery = "";
      var searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = "";
      updateSearchResults();
      return;
    }
    if (target.dataset.action === "category-search-clear") {
      state.termListQuery = "";
      var termSearch = document.getElementById("category-term-search");
      if (termSearch) termSearch.value = "";
      updateCategoryTerms();
      return;
    }
    if (target.dataset.action === "course-catalog") {
      state.categoryOpen = false;
      state.view = "catalog";
      state.catalogScroll = 0;
      state.courseScroll = 0;
      state.courseStarted = false;
      state.courseStep = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.action === "route-open") {
      state.category = target.dataset.category || state.category;
      state.routeIndex = Number(target.dataset.route || 0);
      state.view = "route";
      state.courseScroll = 0;
      state.courseStarted = false;
      state.courseStep = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.demoToast) {
      event.preventDefault();
      showToast(target.dataset.demoToast);
      return;
    }
    if (target.dataset.action === "course-step") {
      state.courseStarted = true;
      state.courseScroll = 0;
      state.courseStep = Number(target.dataset.step);
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.action === "course-next") {
      if (!state.courseStarted) state.courseStarted = true;
      else if (state.courseStep < COURSE.length - 1) state.courseStep += 1;
      else showToast("실제 앱에서는 확인 퀴즈로 이어집니다");
      state.courseScroll = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.action === "course-prev") {
      if (!state.courseStarted) state.view = "catalog";
      else if (state.courseStep === 0) state.courseStarted = false;
      else state.courseStep -= 1;
      state.courseScroll = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (target.dataset.action === "story-step") {
      state.storyStep = Number(target.dataset.step);
      render();
      return;
    }
    if (target.dataset.action === "technical") {
      state.technical = !state.technical;
      render();
      return;
    }
    if (target.dataset.action === "answer") {
      state.answer = !state.answer;
      render();
      return;
    }
    if (target.dataset.action === "concept" || target.dataset.action === "trail-concept") {
      state.concept = target.dataset.concept;
      render();
      return;
    }
    if (target.dataset.action === "open-guided") {
      state.variant = "a";
      state.view = "route";
      state.category = "net";
      state.categoryOpen = false;
      state.catalogScroll = 0;
      state.courseScroll = 0;
      state.courseStarted = false;
      state.courseStep = 0;
      var guidedUrl = new URL(window.location.href);
      guidedUrl.searchParams.set("variant", "a");
      window.history.replaceState({}, "", guidedUrl);
      render();
      return;
    }
  });

  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "teach-input") state.teachText = event.target.value;
    if (event.target && event.target.id === "search-input") {
      state.searchQuery = event.target.value;
      updateSearchResults();
    }
    if (event.target && event.target.id === "category-term-search") {
      state.termListQuery = event.target.value;
      updateCategoryTerms();
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "search-category") {
      state.searchCategory = event.target.value;
      updateSearchResults();
    }
  });

  document.addEventListener("scroll", function (event) {
    if (event.target && event.target.classList) {
      if (event.target.classList.contains("catalog-main")) state.catalogScroll = event.target.scrollTop;
      if (event.target.classList.contains("guided-scroll")) state.courseScroll = event.target.scrollTop;
      if (event.target.classList.contains("hub-scroll")) state.hubScroll = event.target.scrollTop;
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab" && (state.categoryOpen || state.termOpen)) {
      var dialog = document.querySelector(state.termOpen ? ".term-sheet__panel" : ".category-sheet__panel");
      var focusable = dialog ? Array.prototype.slice.call(dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), details > summary')) : [];
      if (focusable.length) {
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (document.activeElement === dialog) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (event.key === "Escape" && (state.categoryOpen || state.termOpen)) {
      event.preventDefault();
      state.categoryOpen = false;
      state.termOpen = false;
      render();
      return;
    }
    if (isTyping(event.target)) return;
    if (VARIANTS.length < 2) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      switchVariant(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      switchVariant(1);
    }
  });

  switcher.hidden = true;
  render();
})();
