// 이 파일은 tools/obsidian_adapter.py 가 생성한다. 직접 고치지 말 것.
// 원본: /Users/yu_s/Library/Mobile Documents/iCloud~md~obsidian/Documents/IT단어장
// 원본 Markdown 은 읽기만 하며 수정하지 않는다.
// 전역 변수로 내보낸다. ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.

window.VOCABULARY_DATA = [
  {
    "id": "net",
    "name": "네트워크 기초",
    "blurb": "요청이 오가는 길을 이해한다",
    "terms": [
      {
        "term": "HTTP",
        "reading": "HyperText Transfer Protocol",
        "category": "네트워크 기초",
        "summary": "HTTP(HyperText Transfer Protocol)는 **웹에서 데이터를 주고받기 위한 프로토콜**로, 클라이언트와 서버 간 통신의 기본 규칙입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "HTTP가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 표준 프로토콜 없이\n각 웹사이트 → 자체 통신 방식\n→ 브라우저마다 별도 지원 필요\n→ 호환성 없음! 😱\n```\n\n**HTTP의 해결**:\n```\n✅ 표준화:\n모든 웹사이트 → HTTP 사용\n모든 브라우저 → HTTP 지원\n→ 어디서나 동작! ✅\n```\n\n**비유**:\n- **표준 없음** = 나라마다 다른 언어\n- **HTTP** = 공용어 (영어)"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 웹 통신 프로토콜\n- **왜 필요한가?**: 표준화된 통신 규칙 필요\n- **어떻게 작동하나?**: 요청(Request) → 응답(Response)"
          },
          {
            "slot": "compare",
            "label": "HTTP/1.1 vs HTTP/2 vs HTTP/3",
            "body": "| 특성 | HTTP/1.1 | HTTP/2 | HTTP/3 |\n|------|----------|--------|--------|\n| **연결** | 순차 | 멀티플렉싱 | QUIC 기반 |\n| **헤더** | 텍스트 | 압축 | 압축 |\n| **속도** | 느림 | 빠름 | 매우 빠름 |\n| **프로토콜** | TCP | TCP | UDP |\n\n### HTTP/2 예시\n```python\n# 하나의 연결로 여러 요청 동시 처리\nimport httpx\n\nasync with httpx.AsyncClient(http2=True) as client:\n    # 동시 요청\n    responses = await asyncio.gather(\n        client.get('https://example.com/api/users'),\n        client.get('https://example.com/api/posts'),\n        client.get('https://example.com/api/comments')\n    )\n    # → 하나의 TCP 연결로 처리\n```"
          },
          {
            "slot": "example",
            "label": "HTTP 메서드",
            "body": "### GET (조회)\n```http\nGET /users/123 HTTP/1.1\nHost: api.example.com\n\n→ 사용자 정보 조회\n```\n\n```python\nimport requests\n\nresponse = requests.get('https://api.example.com/users/123')\nuser = response.json()\n```\n\n### POST (생성)\n```http\nPOST /users HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{\"name\": \"John\", \"email\": \"john@example.com\"}\n\n→ 새 사용자 생성\n```\n\n```python\nresponse = requests.post(\n    'https://api.example.com/users',\n    json={'name': 'John', 'email': 'john@example.com'}\n)\n```\n\n### PUT (전체 수정)\n```http\nPUT /users/123 HTTP/1.1\nContent-Type: application/json\n\n{\"name\": \"John Doe\", \"email\": \"john.doe@example.com\"}\n\n→ 사용자 정보 전체 교체\n```\n\n### PATCH (부분 수정)\n```http\nPATCH /users/123 HTTP/1.1\nContent-Type: application/json\n\n{\"email\": \"newemail@example.com\"}\n\n→ 이메일만 수정\n```\n\n### DELETE (삭제)\n```http\nDELETE /users/123 HTTP/1.1\n\n→ 사용자 삭제\n```"
          },
          {
            "slot": "example",
            "label": "HTTP 상태 코드",
            "body": "### 2xx: 성공\n```\n200 OK          성공\n201 Created     생성 성공\n204 No Content  성공 (응답 본문 없음)\n```\n\n### 3xx: 리다이렉션\n```\n301 Moved Permanently    영구 이동\n302 Found                임시 이동\n304 Not Modified         캐시 사용 가능\n```\n\n### 4xx: 클라이언트 오류\n```\n400 Bad Request          잘못된 요청\n401 Unauthorized         인증 필요\n403 Forbidden            권한 없음\n404 Not Found            찾을 수 없음\n429 Too Many Requests    요청 과다\n```\n\n### 5xx: 서버 오류\n```\n500 Internal Server Error    서버 오류\n502 Bad Gateway              게이트웨이 오류\n503 Service Unavailable      서비스 불가\n504 Gateway Timeout          게이트웨이 타임아웃\n```"
          }
        ],
        "related": [
          {
            "term": "HTTPS",
            "note": "HTTP + SSL/TLS"
          },
          {
            "term": "REST API",
            "note": "HTTP 기반 API"
          },
          {
            "term": "WebSocket",
            "note": "양방향 통신"
          }
        ],
        "id": "net--http"
      },
      {
        "term": "HTTPS",
        "reading": "HTTP Secure",
        "category": "네트워크 기초",
        "summary": "HTTPS(HTTP Secure)는 **HTTP에 SSL/TLS 암호화를 추가한 보안 프로토콜**로, 안전한 웹 통신을 제공합니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "HTTPS가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: HTTP 사용\n사용자 → 로그인 (ID/PW)\n→ 평문으로 전송\n→ 중간자가 가로채기 가능\n→ 비밀번호 유출! 😱\n```\n\n**HTTPS의 해결**:\n```\n✅ 암호화:\n사용자 → 로그인 (ID/PW)\n→ SSL/TLS로 암호화\n→ 중간자가 가로채도 해독 불가\n→ 안전! ✅\n```\n\n**비유**:\n- **HTTP** = 엽서 (내용 다 보임)\n- **HTTPS** = 봉인된 편지 (안전)"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 암호화된 HTTP\n- **왜 필요한가?**: HTTP는 평문 전송 → 도청 가능\n- **어떻게 작동하나?**: SSL/TLS로 데이터 암호화"
          },
          {
            "slot": "compare",
            "label": "HTTP vs HTTPS 차이",
            "body": "| 항목 | HTTP | HTTPS |\n|------|------|-------|\n| **포트** | 80 | 443 |\n| **암호화** | ❌ | ✅ |\n| **인증서** | 불필요 | 필요 |\n| **속도** | 빠름 | 약간 느림 |\n| **SEO** | 불리 | 유리 |\n| **브라우저 표시** | 안전하지 않음 | 🔒 자물쇠 |"
          },
          {
            "slot": "example",
            "label": "인증서 발급",
            "body": "### Let's Encrypt (무료)\n```bash\n# Certbot 설치 (Ubuntu)\nsudo apt-get install certbot python3-certbot-nginx\n\n# Nginx용 인증서 자동 발급\nsudo certbot --nginx -d example.com -d www.example.com\n\n# 자동 갱신 설정 (90일마다)\nsudo certbot renew --dry-run\n```\n\n### 수동 인증서 생성 (개발용)\n```bash\n# 자체 서명 인증서 (Self-Signed)\nopenssl req -x509 -newkey rsa:4096 \\\n  -keyout key.pem \\\n  -out cert.pem \\\n  -days 365 \\\n  -nodes\n```"
          },
          {
            "slot": "example",
            "label": "Nginx HTTPS 설정",
            "body": "```nginx\nserver {\n    listen 80;\n    server_name example.com;\n    \n    # HTTP → HTTPS 리다이렉션\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name example.com;\n    \n    # SSL 인증서\n    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n    \n    # SSL 설정\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';\n    ssl_prefer_server_ciphers on;\n    \n    # HSTS (브라우저에게 항상 HTTPS 사용 지시)\n    add_header Strict-Transport-Security \"max-age=31536000\" always;\n    \n    location / {\n        proxy_pass http://localhost:8000;\n    }\n}\n```"
          }
        ],
        "related": [
          {
            "term": "SSL/TLS",
            "note": "HTTPS의 기반 기술"
          },
          {
            "term": "인증서",
            "note": "HTTPS 필수 요소"
          },
          {
            "term": "HTTP",
            "note": "기본 프로토콜"
          }
        ],
        "id": "net--https"
      },
      {
        "term": "TCP",
        "reading": "Transmission Control Protocol",
        "category": "네트워크 기초",
        "summary": "TCP는 인터넷 프로토콜 스위트의 핵심 프로토콜로, 두 컴퓨터 간에 신뢰성 있고 순서가 보장된 데이터 전송을 담당합니다.",
        "definition": "TCP는 연결을 먼저 설정한 후 데이터를 송수신하는 연결 지향 프로토콜이며, 손상되거나 손실된 패킷을 감지하여 자동으로 재전송하는 기능을 제공합니다. 이러한 신뢰성 보장으로 인해 TCP는 이메일, 웹 브라우징, 파일 다운로드 등 정확한 데이터 전달이 중요한 애플리케이션에 널리 사용됩니다.\n\nTCP의 가장 대표적인 특징은 3-way handshake라는 연결 설정 메커니즘입니다. 데이터를 보내기 전에 양쪽 끝점이 준비되었는지 확인하는 3단계 과정을 거쳐 안정적인 연결을 보장합니다. 또한 흐름 제어(flow control)와 혼잡 제어(congestion control)를 통해 송신자가 수신자가 처리할 수 있는 속도로 데이터를 보내도록 조절합니다.\n\n> **한 줄 요약**: 신뢰성과 순서를 보장하는 대신 속도를 포기하는 연결 기반의 통신 프로토콜\n\n> **비유**: 🔵편지 배송 - 편지가 반드시 도착하고 순서대로 받으며, 분실되면 다시 보냄 / 🟡전화 통화 - 먼저 전화를 걸어 연결을 확인한 후 대화를 시작하는 것처럼, 데이터 전송 전에 연결을 설정함",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 데이터 손실 및 중복\n네트워크상에서 패킷이 손실되거나 중복으로 도착할 수 있습니다. TCP는 각 패킷에 일련번호를 부여하고 수신자로부터의 ACK를 확인함으로써 손실된 패킷을 감지합니다. 손실된 패킷은 자동으로 재전송되며, 중복된 패킷은 일련번호를 통해 제거됩니다. 이를 통해 애플리케이션은 완전하고 정확한 데이터를 받을 수 있습니다.\n\n### 문제 2: 데이터 순서 뒤바뀜\n여러 경로를 통해 전송된 패킷들이 다양한 속도로 도착하면서 순서가 뒤바뀔 수 있습니다. TCP는 각 패킷의 일련번호를 사용하여 도착한 패킷들을 올바른 순서로 정렬한 후 애플리케이션에 전달합니다. 수신자는 모든 패킷이 올바른 순서로 도착할 때까지 대기하므로, 데이터는 항상 원래 순서대로 재구성됩니다.\n\n### 문제 3: 수신자 과부하\n높은 속도로 데이터를 보낼 경우 수신자의 버퍼가 가득 차서 패킷이 손실될 수 있습니다. TCP의 흐름 제어 메커니즘은 수신자가 처리할 수 있는 속도를 수신 윈도우 크기로 송신자에게 알려줍니다. 송신자는 이 정보를 바탕으로 전송 속도를 조절하여 수신자가 과부하되지 않도록 합니다.\n\n### 문제 4: 네트워크 혼잡으로 인한 패킷 폭주\n모든 송신자가 최대 속도로 데이터를 보낼 경우 네트워크 전체가 혼잡해져 대량의 패킷 손실이 발생합니다. TCP의 혼잡 제어는 패킷 손실을 네트워크 혼잡의 신호로 해석하여 송신 속도를 조절합니다. 이를 통해 네트워크 자원을 공정하게 분배하고 전체 처리량을 최대화합니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "TCP 통신은 크게 세 단계로 나뉩니다. 첫 번째 단계는 연결 설정 단계로, 3-way handshake를 통해 클라이언트와 서버가 통신 준비를 확인합니다. 클라이언트가 SYN 패킷을 보내면 서버는 이를 수신하고 SYN-ACK 패킷을 응답합니다. 클라이언트는 다시 ACK 패킷을 보내 연결을 확립합니다.\n\n두 번째 단계는 데이터 전송 단계입니다. 연결이 확립된 후, 양쪽은 자유롭게 데이터를 주고받을 수 있습니다. 송신자는 데이터를 패킷으로 나누어 일련번호를 부여하고 전송합니다. 수신자는 패킷을 받으면 체크섬으로 손상 여부를 확인하고, 문제가 없으면 ACK를 송신자에게 보냅니다. 송신자는 이 ACK를 통해 패킷이 성공적으로 도착했음을 확인합니다.\n\n흐름 제어와 혼잡 제어는 데이터 전송 중 지속적으로 작동합니다. 수신자는 자신의 버퍼 상태를 윈도우 크기로 표현하여 송신자에게 알려주고, 송신자는 이 정보에 따라 전송 속도를 조절합니다. 또한 패킷 손실이 감지되면 송신 속도를 줄여 네트워크 혼잡을 완화합니다.\n\n세 번째 단계는 연결 종료 단계입니다. 한쪽이 더 이상 데이터를 보낼 것이 없으면 FIN 플래그를 설정한 패킷을 보냅니다. 상대방은 이를 수신하고 ACK로 응답합니다. 그 다음 상대방도 FIN 패킷을 보내고, 처음 FIN을 보낸 쪽이 ACK로 응답하면 연결이 완전히 종료됩니다. 이를 4-way handshake라고 부릅니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 3-Way Handshake\nTCP 연결을 시작하기 위한 3단계 과정입니다. 첫 번째로 클라이언트가 SYN 플래그를 설정한 세그먼트를 서버에 보냅니다. 두 번째로 서버는 SYN-ACK 플래그를 설정한 응답을 클라이언트에 보냅니다. 세 번째로 클라이언트가 ACK 플래그를 설정한 세그먼트를 서버에 보내면 연결이 수립됩니다. 이 과정을 통해 양쪽이 통신 준비가 되어 있음을 확인할 수 있습니다.\n\n### 2. 순서 보장 (Sequencing)\nTCP는 각 바이트에 일련번호(sequence number)를 부여하여 송신된 데이터의 순서를 추적합니다. 수신자는 이 일련번호를 통해 받은 패킷들을 올바른 순서로 재조립할 수 있습니다. 만약 패킷이 순서대로 도착하지 않으면, TCP는 모든 패킷이 도착할 때까지 대기했다가 올바른 순서로 애플리케이션에 전달합니다.\n\n### 3. 재전송 메커니즘 (Retransmission)\nTCP는 보낸 패킷에 대한 응답(ACK)을 일정 시간 동안 기다립니다. 설정된 시간 내에 응답이 없으면, 해당 패킷이 손실되었다고 판단하고 자동으로 재전송합니다. 이 과정을 통해 네트워크상의 손실이 발생해도 모든 데이터가 최종적으로 수신자에게 도달함을 보장합니다.\n\n### 4. 흐름 제어 (Flow Control)\n수신자가 처리할 수 있는 속도로만 데이터를 보내도록 송신자를 제어하는 메커니즘입니다. 수신자는 자신의 버퍼 상태를 송신자에게 알려(window size), 송신자는 이 크기만큼만 데이터를 보냅니다. 이를 통해 수신자가 데이터 처리로 인해 과부하되는 것을 방지합니다.\n\n### 5. 혼잡 제어 (Congestion Control)\n네트워크 전체의 혼잡 상태를 감지하여 송신 속도를 조절하는 메커니즘입니다. 패킷 손실이 발생하면 네트워크가 혼잡하다고 판단하여 송신 속도를 줄입니다. AIMD(Additive Increase Multiplicative Decrease) 알고리즘 등을 사용하여 최적의 전송 속도를 찾아갑니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | TCP | UDP |\n|------|-----|-----|\n| **연결 방식** | 연결 지향 (Connection-oriented) | 비연결형 (Connectionless) |\n| **신뢰성** | 높음 (모든 패킷 보장) | 낮음 (손실 허용) |\n| **속도** | 느림 (오버헤드 많음) | 빠름 (오버헤드 적음) |\n| **순서 보장** | 예 (일련번호 사용) | 아니오 (순서 미보장) |\n| **흐름 제어** | 있음 (윈도우 기반) | 없음 |\n| **혼잡 제어** | 있음 (속도 조절) | 없음 |\n| **헤더 크기** | 20-60 바이트 | 8 바이트 |\n| **사용 예** | HTTP, HTTPS, 이메일, FTP | 스트리밍, 온라인 게임, DNS |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "웹 브라우징(HTTP/HTTPS)은 TCP를 가장 많이 사용하는 분야입니다. 사용자가 브라우저에 URL을 입력하면, 브라우저는 먼저 3-way handshake를 통해 웹 서버와 TCP 연결을 설정합니다. 그 다음 HTTP 요청을 보내고 서버의 응답을 받습니다. 웹 페이지의 이미지, 스크립트, CSS 등 모든 리소스는 신뢰성 있게 다운로드되어야 하므로 TCP를 사용합니다.\n\n이메일 전송(SMTP, POP3, IMAP)도 TCP 기반입니다. 메일 클라이언트는 메일 서버와 TCP 연결을 통해 메시지를 송수신합니다. 이메일은 절대로 손실되거나 손상되면 안 되므로 신뢰성이 가장 중요합니다.\n\n파일 전송(FTP, SFTP)은 대용량 파일을 정확하게 전송해야 하므로 TCP를 사용합니다. 파일의 한 바이트라도 손상되면 파일 전체가 손상될 수 있으므로, TCP의 신뢰성 메커니즘은 필수적입니다.\n\n원격 접속(SSH, Telnet)도 TCP를 사용합니다. 사용자의 명령어와 응답이 정확한 순서로 전달되어야 하고, 명령 실행 결과를 정확히 받아야 하므로 TCP가 필요합니다."
          }
        ],
        "related": [],
        "id": "net--tcp"
      },
      {
        "term": "DNS",
        "reading": "Domain Name System",
        "category": "네트워크 기초",
        "summary": "DNS는 도메인 이름을 IP 주소로 변환하는 시스템입니다. 인터넷의 전화번호부 역할을 하며, 사용자가 google.com을 입력하면 DNS가 이를 해당 서버의 IP 주소로 변환합니다.",
        "definition": "이를 통해 사용자는 기억하기 어려운 IP 주소 대신 간단한 도메인 이름으로 웹사이트에 접속할 수 있습니다.\n\nDNS는 1983년 Paul Mockapetris에 의해 개발되어 1984년부터 사용되기 시작했습니다. 초기 인터넷은 중앙 호스트 파일에서 도메인을 관리했지만, 인터넷 규모가 커지면서 분산된 DNS 시스템이 필요했습니다. 현재 DNS는 전 세계의 수조 개의 도메인을 관리하는 핵심 인프라이며, 매일 수십억 건의 DNS 쿼리가 처리되고 있습니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 도메인 주소 기억의 어려움\n\n사람은 숫자 주소를 기억하기 어렵습니다. 모든 웹사이트에 접속할 때마다 IP 주소를 직접 입력해야 한다면, 인터넷 사용은 거의 불가능했을 것입니다. 초기 인터넷 시대에 사용자들은 자주 방문하는 웹사이트의 IP 주소를 종이에 적거나 외워야 했으며, 많은 사용자가 인터넷 사용을 꺼렸습니다.\n\nDNS는 이 문제를 해결하여 사용자가 의미 있는 도메인 이름을 사용할 수 있도록 합니다. 사용자는 간단한 도메인 이름을 입력하고, DNS가 자동으로 IP 주소로 변환하여 네트워크 통신을 수행합니다. 덕분에 인터넷은 훨씬 사용자 친화적이 되었으며, 누구나 쉽게 인터넷을 이용할 수 있게 되었습니다. 이것이 인터넷 대중화의 핵심 요소 중 하나입니다.\n\n### 문제 2: 중앙집중식 관리의 비효율성\n\n만약 하나의 중앙 DNS 서버가 전 세계 모든 도메인을 관리한다면, 그 서버의 부하가 극심하고 한 번의 장애가 인터넷 전체를 마비시킵니다. 매초 수백만 건의 조회 요청을 처리해야 하므로 응답 속도도 매우 느려질 것입니다. 중앙 서버의 물리적 위치 때문에 먼 지역의 사용자는 특히 느린 응답을 받을 것입니다.\n\nDNS의 계층적 구조와 분산 설계는 이 문제를 완벽하게 해결합니다. 여러 수준의 DNS 서버가 협력하여 전 세계의 조회 요청을 처리합니다. 각 수준에서 캐싱이 일어나기 때문에 루트 DNS 서버로 가는 요청의 양도 제한됩니다. 또한 13개의 루트 네임서버가 전 세계에 분산되어 있어서, 근처의 루트 서버에서 빠르게 응답을 받을 수 있습니다.\n\n### 문제 3: 서버 이전 시 사용자 혼란\n\n서버의 IP 주소가 변경되어야 할 때, IP 주소로 직접 접속한다면 새로운 주소를 공지하고 변경할 때까지 서비스를 이용할 수 없습니다. 특히 대규모 사용자 기반을 가진 서비스는 이러한 변경 중에 상당한 혼란이 발생합니다. 사용자들의 북마크도 모두 업데이트해야 합니다.\n\nDNS는 이러한 변경을 투명하게 처리합니다. 도메인은 변경 없이 유지되며, DNS 레코드만 새로운 IP 주소로 업데이트하면 됩니다. 사용자는 여전히 같은 도메인으로 접속하지만, 자동으로 새로운 서버에 연결됩니다. DNS TTL이 낮게 설정되어 있다면 변경사항이 몇 분 내에 전 세계에 반영됩니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "DNS 조회는 다음과 같은 단계로 진행됩니다. 첫째, 사용자가 브라우저에서 도메인을 입력합니다. 브라우저는 자신의 캐시를 확인하고, 캐시된 결과가 있으면 즉시 사용합니다. 캐시가 없으면 운영체제 수준의 DNS 캐시를 확인합니다. OS 캐시에도 없으면 로컬 DNS 서버에 질의합니다. 로컬 DNS는 자신의 캐시를 확인한 후, 없으면 루트 DNS에 질의합니다. 루트 DNS는 해당 TLD 서버의 주소를 반환합니다. 로컬 DNS는 TLD 서버에 질의하고, TLD는 권한 있는 네임서버의 주소를 반환합니다. 로컬 DNS는 권한 있는 서버에 최종 질의하여 IP 주소를 획득합니다. 획득한 IP는 TTL 기간 동안 로컬 DNS에 캐시되고, 클라이언트에도 반환됩니다. 클라이언트는 이 IP로 웹 서버에 접속합니다.\n\n### DNS 조회 시퀀스 (캐시 MISS 경로)"
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "DNS 조회 과정의 계층 구조는 다음과 같습니다. 사용자의 브라우저에서 시작하여 로컬 DNS 서버, 루트 DNS 서버, TLD 서버, 권한 있는 네임서버로 이어집니다. 각 단계에서 캐싱이 이루어지므로, 자주 조회되는 도메인은 상위 계층에서 빠르게 응답됩니다."
          },
          {
            "slot": "concept",
            "label": "비유",
            "body": "- 🔵 비유 1: 전화번호부와 같습니다. 친구의 이름으로 전화번호를 찾는 것처럼, 도메인 이름으로 IP 주소를 찾습니다.\n- 🟡 비유 2: 병원의 접수 데스크와 같습니다. 환자가 이름을 말하면 직원이 병실 번호를 알려주는 것처럼, 도메인을 입력하면 IP 주소를 알려줍니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 계층적 DNS 구조\n\nDNS는 위계 구조로 되어 있으며, 루트 DNS에서 시작하여 TLD, 권한 있는 네임서버로 이어집니다. 루트 DNS는 13개의 루트 네임서버로 구성되어 전 세계에 배치되어 있습니다. 사용자가 도메인을 조회할 때, 로컬 DNS 서버는 루트 DNS에 먼저 질의합니다. 루트 DNS는 해당 도메인의 TLD 서버 주소를 반환합니다. 예를 들어 google.com을 조회할 때, 루트 DNS는 .com TLD 서버의 주소를 제공합니다. 그 다음 로컬 DNS는 .com TLD 서버에 google.com의 주소를 묻고, TLD 서버는 google.com의 권한 있는 네임서버 주소를 반환합니다. 마지막으로 로컬 DNS는 google.com의 권한 있는 네임서버에서 실제 IP 주소를 획득합니다. 이러한 계층 구조 덕분에 전 세계의 도메인을 효율적으로 관리할 수 있습니다.\n\n### 2. DNS 레코드 타입\n\nDNS는 도메인에 대한 다양한 정보를 담는 여러 종류의 레코드를 지원합니다. A 레코드는 도메인을 IPv4 주소로 매핑하는 가장 기본적인 레코드입니다. AAAA 레코드는 IPv6 주소로 매핑하며, 차세대 인터넷 프로토콜의 확산에 따라 중요성이 높아지고 있습니다. CNAME 레코드는 한 도메인을 다른 도메인으로 리다이렉트하며, www.example.com을 example.com으로 매핑할 때 사용됩니다. MX 레코드는 메일 서버의 위치를 지정하며, 이메일 전송 시 SMTP 서버를 찾는 데 필수적입니다. TXT 레코드는 텍스트 기반 정보를 저장하며, 이메일 보안과 도메인 검증에 중요합니다. NS 레코드는 특정 도메인을 관리하는 네임서버를 가리키며, 서브도메인 관리에 사용됩니다. 이러한 다양한 레코드 타입으로 인해 DNS는 단순한 주소 변환을 넘어 복잡한 네트워크 구성을 지원합니다.\n\n### 3. TTL과 캐싱\n\nTTL은 DNS 응답을 얼마나 오래 캐시할 수 있는지를 초 단위로 지정합니다. TTL이 300초이면, DNS 조회 결과를 300초간 저장했다가 그 이후에 다시 조회합니다. 낮은 TTL은 도메인 변경사항이 빠르게 반영되지만, DNS 서버에 더 많은 부하를 줍니다. 높은 TTL은 DNS 트래픽을 줄이지만, 도메인 변경 시 반영 시간이 깁니다. 도메인을 자주 변경하는 서비스는 낮은 TTL을 설정하고, 안정적인 서비스는 높은 TTL을 사용합니다. DNS 조회 과정은 여러 단계를 거치기 때문에 성능 향상을 위해 각 계층에서 캐싱이 일어납니다. 브라우저, 운영체제, ISP 로컬 DNS, 루트 DNS 등 모든 계층에서 캐싱이 지원되므로, 전체 DNS 조회 요청의 대부분은 루트까지 도달하지 않고도 해결됩니다.\n\n### 4. 재귀 조회와 반복 조회"
          }
        ],
        "related": [],
        "id": "net--dns"
      },
      {
        "term": "Load Balancer",
        "reading": "",
        "category": "네트워크 기초",
        "summary": "로드 밸런서(Load Balancer)는 들어오는 네트워크 트래픽을 여러 개의 서버에 균등하게 분배하는 장치 또는 소프트웨어입니다.",
        "definition": "마치 식당의 홀 매니저처럼, 많은 손님들이 들어올 때 한 테이블에만 집중되지 않도록 여러 테이블에 분산시키는 역할을 합니다. 이를 통해 각 서버가 처리해야 할 부하를 낮추고, 전체 시스템의 성능과 신뢰성을 높입니다.\n\n로드 밸런서가 필요해진 이유는 인터넷 서비스의 사용자 수가 급증하면서 단일 서버로는 모든 요청을 처리할 수 없게 되었기 때문입니다. 또한 특정 서버가 다운되었을 때를 대비해 여러 서버를 준비해두고, 그 중 정상 작동하는 서버에만 요청을 보내야 합니다. 이는 고가용성(High Availability) 확보에 필수적입니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 단일 서버의 용량 한계\n온라인 쇼핑 시즌이나 인기 있는 이벤트가 발생하면, 웹사이트의 방문객 수가 급증합니다. 단일 서버는 동시에 처리할 수 있는 요청 수가 제한되어 있으므로, 초과하는 요청은 처리되지 않거나 응답이 매우 느려집니다. 이는 사용자 이탈과 수익 손실로 이어집니다. 로드 밸런서를 사용하면 10개의 서버가 있을 때 단일 서버의 10배 이상의 요청을 처리할 수 있습니다. 결과적으로 사용자 경험이 개선되고, 비즈니스 기회를 잃지 않습니다.\n\n### 문제 2: 서버 장애로 인한 서비스 중단\n하나의 서버가 다운되면, 그 서버로 할당된 모든 요청이 실패합니다. 특히 중요한 업무를 담당하는 시스템이 다운되면 회사의 손실이 매우 큽니다. 기존에는 서버 다운을 감지한 후 수동으로 다른 서버로 전환하거나 재시작해야 했습니다. 로드 밸런서의 자동 헬스 체크 기능을 사용하면 장애를 즉시 감지하고, 자동으로 다른 서버로 요청을 분배합니다. 서비스 중단 시간을 최소화할 수 있습니다.\n\n### 문제 3: 서버 성능의 불균형\n웹 서비스에는 여러 역할의 서버가 있습니다. 일부 서버는 높은 성능의 하드웨어를 가지고 있고, 일부는 낮은 성능입니다. 또는 같은 성능의 서버라도 실행 중인 프로세스에 따라 현재 부하가 다를 수 있습니다. Round Robin처럼 모든 서버에 균등하게 분배하면, 성능이 낮은 서버는 과부하가 되고 성능이 높은 서버는 여유가 생깁니다. 로드 밸런서는 Weighted Round Robin이나 Least Connection 같은 지능형 알고리즘을 사용하여, 각 서버의 현재 상태에 맞춰 요청을 분배합니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 단계별 과정\n\n1. **요청 도착**: 사용자 요청이 로드 밸런서의 가상 IP(VIP) 주소로 들어옵니다. 모든 사용자 트래픽이 로드 밸런서를 거칩니다.\n\n2. **로드 밸런싱 알고리즘 적용**: 로드 밸런서는 설정된 알고리즘에 따라 백엔드 서버 중 하나를 선택합니다. 예를 들어, Round Robin이면 순서대로, Least Connection이면 연결 수가 적은 서버를 선택합니다.\n\n3. **선택된 서버로 전달**: 로드 밸런서는 요청의 출발지 IP와 포트를 변경하여(NAT: Network Address Translation), 마치 해당 서버가 클라이언트의 직접 서버인 것처럼 위장합니다. 그리고 선택된 서버로 요청을 전달합니다.\n\n4. **헬스 체크 실시**: 로드 밸런서는 주기적으로(보통 5초~30초마다) 각 서버에 테스트 요청을 보냅니다. HTTP 요청을 보내거나, TCP 연결을 시도하거나, 특정 포트에 핑(Ping)을 보냅니다.\n\n5. **서버 응답**: 정상 서버는 응답을 돌려주고, 로드 밸런서는 이를 기록합니다. 만약 서버가 응답하지 않으면, 로드 밸런서는 그 서버의 상태를 \"DOWN\"으로 표시합니다.\n\n6. **비정상 서버 제외**: DOWN 상태인 서버는 로드 밸런싱 목록에서 제외되므로, 새로운 요청이 할당되지 않습니다. 이미 할당된 연결은 타임아웃될 때까지 유지되거나 강제 종료됩니다.\n\n7. **응답 반환**: 백엔드 서버의 응답이 로드 밸런서를 거쳐 클라이언트에게 돌아갑니다. 클라이언트는 응답이 로드 밸런서에서 온 것처럼 봅니다."
          },
          {
            "slot": "concept",
            "label": "비유",
            "body": "- 🔵 **비유 1**: 여러 계산대가 있는 마트에서 계산원이 손님들을 각 계산대에 균등하게 배치하는 것. 모든 손님이 한 계산대에 줄을 서지 않도록 분배합니다.\n- 🟡 **비유 2**: 콜센터의 자동 응답 시스템이 들어오는 전화를 여러 상담원에게 분배하는 것. 대기 시간이 짧은 상담원 또는 최근 통화를 덜 많이 받은 상담원에게 우선 배치됩니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 요청 분배 (Request Distribution)\n로드 밸런서는 들어오는 요청을 분석하여 어느 서버로 보낼지 결정합니다. 이때 다양한 알고리즘이 사용됩니다. Round Robin은 순서대로 서버에 분배하고, Least Connection은 현재 연결 수가 가장 적은 서버로 보냅니다. IP Hash는 클라이언트의 IP를 기반으로 같은 서버로 계속 보내므로, 세션 정보를 유지하기에 좋습니다. 서버의 성능이 다르면 Weighted Round Robin을 사용하여 성능이 좋은 서버에 더 많은 요청을 할당합니다.\n\n### 2. 헬스 체크 (Health Check)\n로드 밸런서는 주기적으로 백엔드 서버들의 상태를 확인합니다. 서버에 정기적으로 요청을 보내서 응답을 받는지 확인하는 것입니다. 만약 서버가 응답하지 않으면, 로드 밸런서는 그 서버를 목록에서 제외하고, 다른 정상 서버에만 요청을 분배합니다. 서버가 다시 복구되면 자동으로 목록에 포함됩니다. 이를 통해 장애 서버로의 요청이 낭비되는 것을 방지합니다.\n\n### 3. 고가용성 (High Availability)\n로드 밸런서 자체도 단일 장애점이 될 수 있으므로, 보통 두 개 이상의 로드 밸런서를 구성합니다. 주 로드 밸런서가 다운되면 자동으로 대기 로드 밸런서가 그 역할을 수행합니다. 이를 Failover라고 합니다. 또한 백엔드 서버 중 일부가 다운되어도 나머지 서버가 계속 서비스를 제공하므로, 전체 시스템이 중단되지 않습니다.\n\n### 4. 세션 관리 (Session Management)\n일부 애플리케이션은 사용자의 세션 정보(로그인 상태, 장바구니 내용 등)를 서버에 저장합니다. 같은 사용자의 요청이 매번 다른 서버로 분배되면 세션 정보를 찾을 수 없게 됩니다. 로드 밸런서는 IP 기반 분배, 쿠키 기반 분배, 또는 중앙화된 세션 저장소(Redis 등)를 사용하여 이 문제를 해결합니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | Load Balancer | Reverse Proxy | Firewall | Gateway |\n|------|---------------|---------------|----------|---------|\n| 위치 | 서버 앞 | 서버 앞 | 네트워크 경계 | 네트워크 진입점 |\n| 주요 기능 | 요청 분산 | 로드밸런싱, SSL 종료 | 접근 제어 | 라우팅, 프로토콜 변환 |\n| 요청 분배 | 여러 서버에 분산 | 여러 서버에 분산 | 트래픽 필터링 | 네트워크 간 라우팅 |\n| 헬스 체크 | 필수 기능 | 선택적 기능 | 미포함 | 선택적 기능 |\n| 세션 관리 | 지원 | 선택적 | 미포함 | 미포함 |\n| 동작 계층 | Layer 4 (TCP/UDP) 또는 Layer 7 (HTTP) | Layer 7 (HTTP) | Layer 3~4 | Layer 3~4 |"
          }
        ],
        "related": [],
        "id": "net--load-balancer"
      },
      {
        "term": "CDN",
        "reading": "Content Delivery Network",
        "category": "네트워크 기초",
        "summary": "CDN은 **전 세계 여러 위치에 서버를 배치하여 사용자에게 가장 가까운 서버에서 콘텐츠를 제공하는 네트워크**입니다. 이미지, 비디오, CSS, JavaScript 등의 정적 파일을 빠르게 전달하는 데 최적화되어 있습니다.",
        "definition": "CDN은 1990년대 후반 높은 대역폭의 콘텐츠(특히 스트리밍 비디오)를 효율적으로 배포하기 위해 등장했습니다. 오늘날 전체 인터넷 트래픽의 40% 이상이 CDN을 통과하고 있으며, Netflix, YouTube, Facebook 같은 대규모 서비스들이 필수적으로 사용하고 있습니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 지리적 거리에 따른 응답 시간 증가\n\n대규모 서비스가 한 곳의 원본 서버에서만 콘텐츠를 제공하면, 원본 서버에서 멀리 떨어진 사용자들은 매우 느린 응답을 받습니다. 미국의 서버에서 아시아 사용자에게 비디오를 스트리밍한다면, 수백 밀리초의 네트워크 지연으로 인해 버퍼링이 계속 발생합니다.\n\nCDN은 이를 해결하기 위해 전 세계에 에지 서버를 배치합니다. 각 지역의 사용자는 가까운 에지 서버에서 콘텐츠를 받으므로, 네트워크 지연이 극적으로 줄어듭니다. 아시아 사용자는 아시아의 에지 서버에서 비디오를 받으면 되므로, 스트리밍이 매끄럽게 진행됩니다.\n\n### 문제 2: 원본 서버의 높은 부하\n\n대규모 사용자들이 원본 서버에 동시에 요청을 보내면, 서버의 대역폭과 처리 능력이 한계에 도달합니다. 특히 대용량 파일(비디오, 소프트웨어)을 배포할 때 더욱 심합니다. 이러한 높은 부하는 서버 비용을 증가시키고, 모든 사용자에게 느린 응답 시간을 제공하게 됩니다.\n\nCDN은 대부분의 요청을 에지 서버가 처리하므로, 원본 서버에 도달하는 요청이 극히 적습니다. 원본 서버는 새로운 콘텐츠 생성에만 집중할 수 있고, 기존 콘텐츠는 전 세계의 에지 서버에서 효율적으로 배포됩니다. 결과적으로 원본 서버의 부하가 획기적으로 줄어들고, 인프라 비용도 감소합니다.\n\n### 문제 3: DDoS 공격에 대한 취약성\n\n집중된 원본 서버가 DDoS 공격의 대상이 되면, 한 번의 공격으로 전체 서비스가 다운될 수 있습니다. 악의적인 트래픽이 원본 서버를 압도하면, 정상 사용자도 서비스를 이용할 수 없습니다.\n\nCDN은 이 문제를 구조적으로 해결합니다. 공격 트래픽이 여러 에지 서버에 분산되기 때문에, 하나의 서버가 감당하는 부하는 상대적으로 줄어듭니다. 또한 CDN 사업자들은 고급 DDoS 방어 기술을 갖추고 있어서, 악의적인 트래픽을 필터링하고 정상 트래픽만 통과시킵니다. 원본 서버는 CDN의 보호 뒤에 숨겨져 공격으로부터 안전합니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "CDN을 통한 콘텐츠 배송은 다음과 같이 작동합니다. 사용자가 example.com의 이미지 파일을 요청합니다. 브라우저는 DNS 조회를 통해 이미지 URL을 CDN의 에지 서버 주소로 해석합니다. 사용자는 자신과 가장 가까운 에지 서버에 요청을 전송합니다. 에지 서버가 해당 콘텐츠를 캐시하고 있으면 즉시 반환합니다. 캐시가 없거나 TTL이 만료되었다면, 에지 서버는 원본 서버에서 콘텐츠를 가져온 후 사용자에게 전달하고 캐시합니다. 이후 같은 지역의 다른 사용자들은 에지 서버의 캐시에서 빠르게 콘텐츠를 받게 됩니다.\n\n### CDN 콘텐츠 배송 시퀀스 (캐시 HIT vs MISS)"
          },
          {
            "slot": "concept",
            "label": "비유",
            "body": "- 🔵 **비유 1**: 유통 시스템과 같습니다. 중앙 창고에서만 배송하는 것이 아니라, 전국 각지의 지역 창고에서 가장 가까운 곳으로 배송하듯이, CDN도 전 세계 에지 서버에서 사용자에게 가장 가까운 곳으로 콘텐츠를 배송합니다.\n- 🟡 **비유 2**: 약국 체인과 같습니다. 본사의 약국과 각 지점의 약국이 있어서, 약을 사려는 고객이 가장 가까운 지점으로 갈 수 있듯이, CDN도 전 세계 에지 서버를 두어 사용자가 가장 가까운 서버에서 콘텐츠를 받을 수 있습니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 에지 서버 (Edge Server)\n\nCDN은 전 세계 수백 개의 전략적 위치에 에지 서버를 배치합니다. 이 서버들은 원본 서버(Origin Server)의 콘텐츠를 캐시하여 저장하고, 사용자의 요청을 받으면 즉시 응답합니다. 사용자는 원본 서버의 지리적 위치와 상관없이, 자신과 가장 가까운 에지 서버에서 콘텐츠를 받으므로, 네트워크 지연 시간(레이턴시)이 크게 감소합니다. 예를 들어 한국의 사용자가 미국의 원본 서버에서 콘텐츠를 받으려면 수백 밀리초가 걸리지만, 한국의 에지 서버에서 받으면 수십 밀리초로 단축됩니다.\n\n### 2. 콘텐츠 캐싱과 TTL\n\nCDN의 에지 서버는 원본 서버의 콘텐츠를 캐시합니다. 처음 요청이 들어오면 원본 서버에서 콘텐츠를 가져오고, 그 이후의 요청들은 캐시된 복사본을 전달합니다. TTL(Time To Live) 설정에 따라 캐시 유효 기간이 결정되며, TTL이 만료되면 원본 서버에서 최신 콘텐츠를 다시 가져옵니다. 자주 변경되는 콘텐츠는 낮은 TTL을, 거의 변경되지 않는 콘텐츠는 높은 TTL을 설정합니다. 이러한 캐싱 메커니즘으로 인해 원본 서버의 부하가 대폭 줄어들고, 사용자가 받는 콘텐츠의 전송 속도가 빨라집니다.\n\n### 3. 지리적 라우팅 (Geo-routing)\n\nCDN은 사용자의 IP 주소를 기반으로 위치를 파악하고, 가장 가까운 에지 서버로 자동 연결합니다. 이를 위해 CDN 사업자들은 정확한 지리적 위치 데이터베이스를 유지합니다. 또한 네트워크 지연 시간, 서버 부하, 서버의 가용성 등을 고려하여 최적의 서버를 동적으로 선택합니다. 특정 지역의 서버가 다운되었다면 다음으로 가까운 서버로 요청을 우회시킵니다. 이러한 지능형 라우팅으로 인해 사용자는 항상 최상의 성능을 경험하게 됩니다.\n\n### 4. 원본 서버 보호\n\nCDN은 원본 서버를 사용자 접근으로부터 보호합니다. 대부분의 요청이 에지 서버에서 처리되므로 원본 서버로 도달하는 요청이 극히 적습니다. 또한 DDoS 공격이 발생해도 에지 서버들이 공격을 분산 처리하고, CDN 사업자의 보안 인프라가 악의적 트래픽을 필터링합니다. 비용이 많이 드는 원본 서버의 대역폭 사용량도 크게 줄어듭니다. 이러한 이유로 CDN은 단순한 성능 도구를 넘어 보안과 가용성을 위한 필수 요소가 되었습니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "CDN과 다른 콘텐츠 배송 방식들을 비교한 표입니다.\n\n| 항목 | CDN | 일반 웹서버 | 오브젝트 스토리지 |\n|------|-----|-----------|-----------------|\n| **주요 목적** | 빠른 콘텐츠 전달 | 동적 콘텐츠 처리 | 파일 저장 및 관리 |\n| **지연시간** | 매우 낮음 (가까운 에지 서버) | 높음 (거리에 따라 다름) | 높음 (원본 서버에서만) |\n| **캐싱 기능** | 자동 (에지 서버) | 없음 | 없음 |\n| **비용 모델** | 트래픽 기반 과금 | 서버 사양 기반 | 저렴한 스토리지 비용 |\n| **DDoS 방어** | 내장 | 별도 설정 필요 | 제한적 |\n| **적합한 콘텐츠** | 이미지, JS, CSS, 동영상 | API, HTML 페이지 | 원본 파일 저장소 |\n| **예시 서비스** | Cloudflare, Akamai, AWS CloudFront | Apache, Nginx | AWS S3, Google Cloud Storage |\n| **설정 복잡도** | 중간 (TTL, 캐싱 정책) | 낮음 (기본 설정) | 낮음 (업로드만) |\n\n### 각 기술의 특징\n\n- **CDN**: 정적 콘텐츠의 빠른 배송에 최적화되어 있으며, 전 세계 사용자에게 일관된 성능을 제공합니다. 초기 설정 후 자동으로 캐싱되므로 운영 부담이 적습니다.\n\n- **일반 웹서버** (Apache, Nginx): 동적 콘텐츠 생성, API 처리, 데이터베이스 쿼리 등 서버 사이드 처리가 필요한 경우에 사용합니다. 로드 밸런싱과 함께 사용하면 성능을 개선할 수 있습니다.\n\n- **오브젝트 스토리지** (S3, GCS): 파일을 저장하고 관리하는 데 중점을 두고 있으며, 비용이 저렴하고 무제한 확장성을 제공합니다. CDN과 함께 사용하면 저장 비용은 줄이고 배송 성능은 높일 수 있습니다."
          }
        ],
        "related": [],
        "id": "net--cdn"
      }
    ]
  },
  {
    "id": "arch",
    "name": "아키텍처 패턴",
    "blurb": "규모가 커질 때 쓰는 구조",
    "terms": [
      {
        "term": "API Gateway",
        "reading": "API 게이트웨이",
        "category": "아키텍처 패턴",
        "summary": "API Gateway(API 게이트웨이)는 **모든 클라이언트 요청의 단일 진입점**으로, 라우팅, 인증, 속도 제한 등을 처리하는 서버입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "API Gateway가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: Gateway 없이 직접 호출\n클라이언트 → 서비스A (인증 체크)\n클라이언트 → 서비스B (인증 체크)\n클라이언트 → 서비스C (인증 체크)\n→ 인증 로직 중복! 😱\n```\n\n**API Gateway의 해결**:\n```\n✅ Gateway에서 통합 처리:\n클라이언트 → API Gateway (인증 체크)\n→ 서비스A로 라우팅\n→ 서비스B로 라우팅\n→ 서비스C로 라우팅\n→ 한 곳에서 관리! ✅\n```\n\n**비유**:\n- **Gateway 없음** = 각 부서마다 경비실\n- **Gateway** = 건물 입구 통합 경비실"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 마이크로서비스 앞에 있는 단일 진입점\n- **왜 필요한가?**: 각 서비스마다 인증/로깅하면 중복 코드 발생\n- **어떻게 작동하나?**: 클라이언트 → API Gateway → 적절한 서비스로 라우팅"
          },
          {
            "slot": "concept",
            "label": "주요 기능",
            "body": "### 1. 라우팅\n```javascript\n// API Gateway 설정\n{\n  \"/api/users/*\": \"http://user-service:8001\",\n  \"/api/orders/*\": \"http://order-service:8002\",\n  \"/api/products/*\": \"http://product-service:8003\"\n}\n```\n\n### 2. 인증\n```javascript\n// 모든 요청에 대해 토큰 검증\napp.use(async (req, res, next) => {\n  const token = req.headers.authorization;\n  \n  if (!isValidToken(token)) {\n    return res.status(401).json({ error: \"Unauthorized\" });\n  }\n  \n  next();  // 인증 성공 → 서비스로 전달\n});\n```\n\n### 3. 속도 제한 (Rate Limiting)\n```javascript\n// 사용자당 분당 100개 요청 제한\nconst rateLimit = require('express-rate-limit');\n\nconst limiter = rateLimit({\n  windowMs: 60 * 1000,  // 1분\n  max: 100,             // 최대 100개\n  message: \"Too many requests\"\n});\n\napp.use(limiter);\n```\n\n### 4. 응답 변환\n```javascript\n// 여러 서비스 응답 조합\napp.get('/api/dashboard', async (req, res) => {\n  const [user, orders, stats] = await Promise.all([\n    fetch('http://user-service/profile'),\n    fetch('http://order-service/recent'),\n    fetch('http://analytics-service/stats')\n  ]);\n  \n  res.json({ user, orders, stats });  // 통합 응답\n});\n```"
          },
          {
            "slot": "example",
            "label": "주요 서비스",
            "body": "| 서비스 | 특징 | 사용 사례 |\n|--------|------|----------|\n| **Amazon API Gateway** | AWS 관리형, 서버리스 | Lambda 통합 |\n| **Kong** | 오픈소스, 플러그인 풍부 | 엔터프라이즈 |\n| **Nginx** | 경량, 리버스 프록시 | 간단한 라우팅 |\n| **Apigee** | Google, 분석 강력 | API 관리 |"
          },
          {
            "slot": "caution",
            "label": "성능 고려사항",
            "body": "```\n장점:\n✅ 중앙 집중식 관리\n✅ 보안 강화\n✅ 모니터링 용이\n\n단점:\n⚠️ 단일 장애점 (SPOF)\n⚠️ 추가 네트워크 홉\n⚠️ 병목 가능성\n```"
          }
        ],
        "related": [
          {
            "term": "Load Balancing",
            "note": "Gateway 뒤에서 사용"
          },
          {
            "term": "Rate Limiting",
            "note": "Gateway의 주요 기능"
          },
          {
            "term": "Microservices",
            "note": "Gateway가 필수적"
          }
        ],
        "id": "arch--api-gateway"
      },
      {
        "term": "Circuit Breaker",
        "reading": "서킷 브레이커",
        "category": "아키텍처 패턴",
        "summary": "Circuit Breaker(서킷 브레이커)는 **장애가 발생한 서비스 호출을 자동으로 차단**하여, 연쇄 장애를 방지하는 패턴입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Circuit Breaker가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 서비스 A가 다운된 경우\n서비스 B → 서비스 A 호출 (타임아웃 5초)\n→ 계속 시도 → 쓰레드 고갈\n→ 서비스 B도 다운\n→ 연쇄 장애! 😱\n```\n\n**Circuit Breaker의 해결**:\n```\n✅ 자동 차단:\n서비스 B → 서비스 A (3회 실패)\n→ Circuit Breaker OPEN\n→ 즉시 실패 응답 (fallback)\n→ 서비스 B 정상 유지! ✅\n```\n\n**비유**:\n- **Circuit Breaker 없음** = 끊어진 전선에 계속 전기 공급\n- **Circuit Breaker** = 누전 차단기 (자동 차단)"
          },
          {
            "slot": "how",
            "label": "상태별 동작",
            "body": "### 1. CLOSED (정상)\n```\n요청 → 서비스 호출\n성공 → 카운터 리셋\n실패 → 카운터 증가\n실패 5회 → OPEN\n```\n\n### 2. OPEN (차단)\n```\n요청 → 즉시 실패 (fallback)\n30초 대기\n→ HALF-OPEN\n```\n\n### 3. HALF-OPEN (테스트)\n```\n요청 → 1개만 허용\n성공 → CLOSED\n실패 → OPEN\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 실패하는 서비스 호출을 자동으로 차단\n- **왜 필요한가?**: 한 서비스 장애가 전체 시스템으로 전파됨\n- **어떻게 작동하나?**: 실패 임계값 초과 시 회로 차단"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "```python\nfrom circuitbreaker import circuit\n\n@circuit(failure_threshold=5, recovery_timeout=30)\ndef call_external_service():\n    \"\"\"\n    - failure_threshold=5: 5회 실패 시 OPEN\n    - recovery_timeout=30: 30초 후 HALF-OPEN\n    \"\"\"\n    response = requests.get('http://api.example.com')\n    return response.json()\n\n# 사용\ntry:\n    data = call_external_service()\nexcept CircuitBreakerError:\n    # Circuit이 OPEN 상태\n    data = get_cached_data()  # Fallback\n```\n\n### Fallback 패턴\n```python\ndef get_user_recommendations(user_id):\n    try:\n        # 추천 서비스 호출\n        return recommendation_service.get(user_id)\n    except CircuitBreakerError:\n        # Circuit OPEN → 기본값 반환\n        return get_popular_items()  # Fallback\n```"
          },
          {
            "slot": "example",
            "label": "주요 라이브러리",
            "body": "| 라이브러리 | 언어 | 특징 |\n|-----------|------|------|\n| **Hystrix** | Java | Netflix, 강력한 모니터링 |\n| **Resilience4j** | Java | 경량, Spring Boot 통합 |\n| **pybreaker** | Python | 간단한 구현 |\n| **opossum** | Node.js | Promise 기반 |"
          }
        ],
        "related": [
          {
            "term": "Fallback",
            "note": "Circuit 차단 시 대체 로직"
          },
          {
            "term": "Retry Pattern",
            "note": "Circuit Breaker와 함께 사용"
          },
          {
            "term": "Timeout",
            "note": "실패 판단 기준"
          }
        ],
        "id": "arch--circuit-breaker"
      },
      {
        "term": "Message Queue",
        "reading": "메시지 큐",
        "category": "아키텍처 패턴",
        "summary": "Message Queue(메시지 큐)는 **컴포넌트 간 통신을 비동기적으로 처리**하기 위해, 메시지를 큐(대기열)에 넣고 순서대로 처리하는 시스템입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Message Queue가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 동기 처리\n이메일 발송 요청 → 이메일 전송(5초)\n→ 사용자 5초 대기\n→ 답답함! 😱\n```\n\n**Message Queue의 해결**:\n```\n✅ 비동기 처리:\n이메일 발송 요청 → Queue에 넣음(0.01초)\n→ 사용자 즉시 응답 받음\n→ 백그라운드에서 이메일 전송\n→ 빠른 응답! ✅\n```\n\n**비유**:\n- **동기** = 은행 창구 (순서대로 기다림)\n- **비동기 Queue** = 번호표 뽑고 자유롭게 대기"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 작업을 대기열에 넣고 순차 처리\n- **왜 필요한가?**: 동기 처리는 느림, 비동기로 성능 향상\n- **어떻게 작동하나?**: Producer → Queue → Consumer"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "```python\n# Producer (생산자)\nqueue.send_message({\n    \"type\": \"send_email\",\n    \"to\": \"user@example.com\",\n    \"subject\": \"환영합니다\"\n})\n\n# Consumer (소비자)\nwhile True:\n    message = queue.receive_message()\n    send_email(message['to'], message['subject'])\n    queue.delete_message(message)\n```"
          },
          {
            "slot": "example",
            "label": "주요 서비스",
            "body": "| 서비스 | 특징 | 사용 사례 |\n|--------|------|----------|\n| **Amazon SQS** | AWS 관리형, 간단 | 일반적인 큐 |\n| **RabbitMQ** | 오픈소스, 유연 | 복잡한 라우팅 |\n| **Apache Kafka** | 초고성능, 스트리밍 | 실시간 데이터 |"
          }
        ],
        "related": [
          {
            "term": "Pub/Sub",
            "note": "메시지를 여러 곳에 전달"
          },
          {
            "term": "Async Processing",
            "note": "비동기 처리"
          },
          {
            "term": "Event-Driven",
            "note": "이벤트 기반 아키텍처"
          }
        ],
        "id": "arch--message-queue"
      },
      {
        "term": "Rate Limiting",
        "reading": "속도 제한",
        "category": "아키텍처 패턴",
        "summary": "Rate Limiting(속도 제한)은 **일정 시간 동안 허용되는 요청 수를 제한**하여, 서버를 과부하와 남용으로부터 보호하는 기술입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Rate Limiting이 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 제한 없는 API\n악의적 사용자 → 초당 10,000개 요청\n→ 서버 CPU 100%\n→ 정상 사용자 접속 불가\n→ 서비스 다운! 😱\n```\n\n**Rate Limiting의 해결**:\n```\n✅ 요청 제한:\n사용자 → 분당 100개 요청 허용\n101번째 요청 → 429 에러 반환\n→ 서버 안정적 운영\n→ 정상 사용자 보호! ✅\n```\n\n**비유**:\n- **제한 없음** = 무한정 시식 가능 (재고 소진)\n- **Rate Limiting** = 1인 1회 시식 (공평한 분배)"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 사용자별 요청 횟수 제한\n- **왜 필요한가?**: 무제한 요청 시 서버 다운, 비용 폭증\n- **어떻게 작동하나?**: 임계값 초과 시 요청 거부"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### Token Bucket 구현\n```python\nimport time\nfrom threading import Lock\n\nclass TokenBucket:\n    def __init__(self, capacity, refill_rate):\n        \"\"\"\n        capacity: 최대 토큰 수\n        refill_rate: 초당 충전되는 토큰 수\n        \"\"\"\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate\n        self.last_refill = time.time()\n        self.lock = Lock()\n    \n    def consume(self, tokens=1):\n        \"\"\"토큰 소비 시도\"\"\"\n        with self.lock:\n            self._refill()\n            \n            if self.tokens >= tokens:\n                self.tokens -= tokens\n                return True  # 허용\n            else:\n                return False  # 거부\n    \n    def _refill(self):\n        \"\"\"시간에 따라 토큰 충전\"\"\"\n        now = time.time()\n        elapsed = now - self.last_refill\n        \n        # 충전할 토큰 수 계산\n        new_tokens = elapsed * self.refill_rate\n        self.tokens = min(self.capacity, self.tokens + new_tokens)\n        self.last_refill = now\n\n# 사용\nbucket = TokenBucket(capacity=100, refill_rate=10)  # 초당 10개 충전\n\nif bucket.consume():\n    # 요청 처리\n    process_request()\nelse:\n    # 429 Too Many Requests\n    return error(429, \"Rate limit exceeded\")\n```\n\n### Redis 기반 구현\n```python\nimport redis\nfrom datetime import timedelta\n\nr = redis.Redis()"
          },
          {
            "slot": "example",
            "label": "Rate Limiting 알고리즘",
            "body": "### 1. Token Bucket\n\n### 2. Leaky Bucket\n```\n요청들 → 버킷 (큐)\n→ 일정 속도로 처리\n→ 버킷 가득 차면 거부\n```\n\n### 3. Fixed Window\n```\n00:00 ~ 00:59 → 100개 허용\n01:00 ~ 01:59 → 100개 허용 (리셋)\n```\n\n### 4. Sliding Window\n```\n현재 시각 기준 최근 1분간\n요청 횟수 계산\n```"
          },
          {
            "slot": "example",
            "label": "실제 서비스 제한",
            "body": "| 서비스 | 제한 | 용도 |\n|--------|------|------|\n| **GitHub API** | 5,000 req/hour | 인증된 요청 |\n| **Twitter API** | 900 req/15min | 트윗 조회 |\n| **Stripe API** | 100 req/sec | 결제 처리 |"
          }
        ],
        "related": [
          {
            "term": "API Gateway",
            "note": "Rate Limiting 구현"
          },
          {
            "term": "DDoS Protection",
            "note": "Rate Limiting으로 방어"
          },
          {
            "term": "Throttling",
            "note": "유사 개념"
          }
        ],
        "id": "arch--rate-limiting"
      },
      {
        "term": "Pub/Sub",
        "reading": "Publish-Subscribe",
        "category": "아키텍처 패턴",
        "summary": "Pub/Sub(발행-구독)는 **하나의 메시지를 여러 구독자가 동시에 받을 수 있는** 메시징 패턴입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Pub/Sub이 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 주문 완료 시\n주문 서비스 → 결제 서비스 호출\n주문 서비스 → 재고 서비스 호출\n주문 서비스 → 알림 서비스 호출\n→ 결합도 높음, 관리 어려움! 😱\n```\n\n**Pub/Sub의 해결**:\n```\n✅ Topic 사용:\n주문 서비스 → \"주문 완료\" Topic 발행\n→ 결제 서비스 자동 수신\n→ 재고 서비스 자동 수신\n→ 알림 서비스 자동 수신\n→ 느슨한 결합! ✅\n```\n\n**비유**:\n- **직접 호출** = 전화 (1:1)\n- **Pub/Sub** = 유튜브 알림 (1:N)"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 1개 발행 → N개 구독자 수신\n- **왜 필요한가?**: 한 이벤트에 여러 서비스가 반응해야 함\n- **어떻게 작동하나?**: Publisher → Topic → Subscribers"
          },
          {
            "slot": "compare",
            "label": "Pub/Sub vs Message Queue",
            "body": "| 항목 | Message Queue | Pub/Sub |\n|------|--------------|---------|\n| **수신자** | 1명만 | 여러 명 |\n| **메시지** | 소비되면 삭제 | 모두 복사본 받음 |\n| **사용 사례** | 작업 분산 | 이벤트 브로드캐스트 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "```python\n# Publisher\npubsub.publish(\n    topic=\"order_completed\",\n    message={\"order_id\": \"123\", \"amount\": 50000}\n)\n\n# Subscriber 1: 재고 서비스\n@subscribe(\"order_completed\")\ndef update_inventory(message):\n    decrease_stock(message['order_id'])\n\n# Subscriber 2: 알림 서비스\n@subscribe(\"order_completed\")\ndef send_notification(message):\n    notify_user(message['order_id'])\n```"
          }
        ],
        "related": [
          {
            "term": "Message Queue",
            "note": "1:1 메시징"
          },
          {
            "term": "Event-Driven Architecture",
            "note": "Pub/Sub 기반"
          },
          {
            "term": "Kafka",
            "note": "Pub/Sub 구현체"
          }
        ],
        "id": "arch--pub-sub"
      },
      {
        "term": "Sharding",
        "reading": "샤딩",
        "category": "아키텍처 패턴",
        "summary": "Sharding(샤딩)은 **대용량 데이터를 여러 데이터베이스에 분산 저장**하여, 성능과 확장성을 높이는 기술입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Sharding이 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 단일 DB 사용\n사용자 1억 명 데이터 → DB 1대\n→ 쿼리 느림 (10초)\n→ 디스크 용량 부족\n→ 확장 불가! 😱\n```\n\n**Sharding의 해결**:\n```\n✅ 데이터 분산:\n사용자 1억 명 → 10개 DB로 분산\n각 DB: 1천만 명\n→ 쿼리 빠름 (1초)\n→ 수평 확장 가능! ✅\n```\n\n**비유**:\n- **Sharding 없음** = 도서관 1곳에 모든 책\n- **Sharding** = 지역별로 도서관 10곳"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 데이터를 여러 DB 서버에 나눠 저장\n- **왜 필요한가?**: 하나의 DB로는 대용량 데이터 처리 한계\n- **어떻게 작동하나?**: 데이터를 기준(Shard Key)으로 분할"
          },
          {
            "slot": "compare",
            "label": "Sharding vs Partitioning",
            "body": "| 항목 | Sharding | Partitioning |\n|------|----------|--------------|\n| **위치** | 여러 DB 서버 | 하나의 DB 서버 |\n| **목적** | 확장성, 성능 | 관리 편의성 |\n| **복잡도** | 높음 | 낮음 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "```python\nclass ShardedDatabase:\n    def __init__(self):\n        self.shards = {\n            0: connect_db('shard_0'),\n            1: connect_db('shard_1'),\n            2: connect_db('shard_2')\n        }\n    \n    def get_shard(self, user_id):\n        \"\"\"user_id로 적절한 shard 선택\"\"\"\n        shard_id = user_id % len(self.shards)\n        return self.shards[shard_id]\n    \n    def get_user(self, user_id):\n        \"\"\"사용자 조회\"\"\"\n        shard = self.get_shard(user_id)\n        return shard.query(\n            \"SELECT * FROM users WHERE id = ?\", \n            (user_id,)\n        )\n    \n    def save_user(self, user_id, data):\n        \"\"\"사용자 저장\"\"\"\n        shard = self.get_shard(user_id)\n        shard.execute(\n            \"INSERT INTO users VALUES (?, ?)\",\n            (user_id, data)\n        )\n\n# 사용\ndb = ShardedDatabase()\nuser = db.get_user(12345)  # 자동으로 올바른 shard 조회\n```"
          },
          {
            "slot": "example",
            "label": "Sharding 전략",
            "body": "### 1. Hash Sharding\n```python\ndef get_shard(user_id, num_shards=3):\n    \"\"\"\n    user_id를 해시해서 분산\n    균등 분배 보장\n    \"\"\"\n    shard_id = hash(user_id) % num_shards\n    return f\"shard_{shard_id}\"\n\n# 예시\nget_shard(123)  # → shard_0\nget_shard(456)  # → shard_2\n```\n\n### 2. Range Sharding\n```python\ndef get_shard_by_range(user_id):\n    \"\"\"\n    user_id 범위로 분산\n    관리 간단하지만 불균형 가능\n    \"\"\"\n    if user_id < 1000000:\n        return \"shard_0\"\n    elif user_id < 2000000:\n        return \"shard_1\"\n    else:\n        return \"shard_2\"\n```\n\n### 3. Geography Sharding\n```python\ndef get_shard_by_location(country):\n    \"\"\"\n    지역별로 분산\n    지연 시간 감소\n    \"\"\"\n    shards = {\n        'KR': 'shard_asia',\n        'JP': 'shard_asia',\n        'US': 'shard_americas',\n        'UK': 'shard_europe'\n    }\n    return shards.get(country, 'shard_default')\n```"
          }
        ],
        "related": [
          {
            "term": "Consistent Hashing",
            "note": "Sharding 키 분배"
          },
          {
            "term": "Replication",
            "note": "Sharding과 함께 사용"
          },
          {
            "term": "Horizontal Scaling",
            "note": "Sharding의 목적"
          }
        ],
        "id": "arch--sharding"
      }
    ]
  },
  {
    "id": "ai",
    "name": "AI · LLM",
    "blurb": "요즘 제품에 들어가는 말들",
    "terms": [
      {
        "term": "LLM",
        "reading": "Large Language Model",
        "category": "AI · LLM",
        "summary": "LLM은 **엄청나게 많은 텍스트를 읽고 학습한 AI**입니다. 마치 수백만 권의 책을 읽은 사람처럼, 거의 모든 주제에 대해 대화하고 글을 쓸 수 있습니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 LLM이 필요한가?",
            "body": "### 기존 AI의 한계\n\n**규칙 기반 챗봇 (2010년대)**:\n```\n사용자: \"육아휴직 신청하려면?\"\n봇: [정확히 \"육아휴직\" 단어 찾기]\n→ \"육아휴직 규정을 찾았습니다\" ✅\n\n사용자: \"아이 키우려고 쉬고 싶은데?\"\n봇: [단어 매칭 실패]\n→ \"무슨 말인지 모르겠습니다\" ❌\n\n문제: 같은 의미를 다르게 표현하면 이해 못함\n```\n\n**도메인 특화 AI (2020년 이전)**:\n```\n번역 AI: 번역만 가능\n요약 AI: 요약만 가능\n감정 분석 AI: 감정만 분석\n\n→ 각 작업마다 AI를 따로 만들어야 함\n→ 새 작업이 생기면? 처음부터 다시 학습\n```\n\n### LLM의 혁신\n\n```\n하나의 모델로 모든 작업:\n- 번역 ✅\n- 요약 ✅\n- 코딩 ✅\n- 분석 ✅\n- 대화 ✅\n- 글쓰기 ✅\n\n게다가 문맥도 이해:\n\"그는 돈이 필요해서 은행에 갔다\"\n→ 금융기관이라고 이해!\n\n\"그는 물고기를 잡으려고 은행에 갔다\"\n→ 강가라고 이해!\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 1. 학습 과정\n\n**학습 방식**: 다음 단어 맞히기\n```\n입력: \"날씨가 좋으니 공원에\"\nLLM 예측: \"가자\" (90%), \"갑시다\" (5%), \"가요\" (3%)...\n\n수조 번 반복하면서 패턴 학습\n→ 문법, 의미, 상식 등을 자연스럽게 이해\n```\n\n### 2. 사용 과정"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 수십억~수조 개의 연결(파라미터)을 가진 거대 AI 모델\n- **왜 필요한가?**: 사람처럼 자연스럽게 대화하고, 다양한 작업을 수행하기 위해\n- **어떻게 작동하나?**: 다음에 올 단어를 예측하는 방식으로 학습"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### LLM = 엄청나게 많이 읽은 사람\n\n```\n일반인:\n- 책 100권 읽음\n- 특정 분야만 알음\n- 새로운 주제는 어려움\n\nLLM:\n- 인터넷의 절반을 읽음 (수백억 페이지)\n- 거의 모든 분야 알음\n- 새로운 질문에도 답변 가능\n\n하지만:\n- 2023년 이후 일은 모름 (학습 종료일 기준)\n- 가끔 착각함 (Hallucination)\n- 계산은 약함\n```\n\n### LLM의 강점과 약점\n\n| 강점 ✅ | 약점 ❌ |\n|--------|--------|\n| 자연스러운 대화 | 최신 정보 모름 |\n| 다양한 작업 수행 | 가끔 거짓말 (Hallucination) |\n| 문맥 이해 능력 | 정확한 계산 약함 |\n| 창의적 글쓰기 | 회사별 정보 모름 |"
          },
          {
            "slot": "example",
            "label": "P3 시스템에서의 활용",
            "body": "### P3는 LLM을 어떻게 사용하나?\n\n**핵심**: LLM 단독으로는 회사 규정을 모름\n→ RAG로 문서를 찾아서 LLM에게 전달\n→ LLM이 문서를 읽고 답변 생성\n\n### 주요 LLM 비교\n\n**P3 권장**:\n- 메인: GPT-4 (정확도 최우선)\n- 백업: Claude 3.5 (긴 문서 처리)\n- 개발: 로컬 Llama (비용 0)"
          }
        ],
        "related": [
          {
            "term": "Token",
            "note": "LLM의 처리 단위"
          },
          {
            "term": "Context Window",
            "note": "LLM의 기억 용량"
          },
          {
            "term": "Prompt",
            "note": "LLM에게 주는 지시"
          },
          {
            "term": "Hallucination",
            "note": "LLM의 거짓 생성"
          },
          {
            "term": "RAG",
            "note": "LLM + 외부 지식"
          },
          {
            "term": "Fine-tuning",
            "note": "LLM 맞춤 학습"
          }
        ],
        "id": "ai--llm"
      },
      {
        "term": "RAG",
        "reading": "Retrieval-Augmented Generation",
        "category": "AI · LLM",
        "summary": "RAG는 **LLM에게 교과서를 찾아주는 시스템**입니다. LLM 혼자서는 최신 정보나 회사별 정보를 모르지만, RAG가 관련 문서를 찾아주면 정확한 답변을 할 수 있습니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 RAG가 필요한가?",
            "body": "### LLM 단독 사용의 문제\n\n**1. 최신 정보 모름**:\n```\n사용자: \"2024년 육아휴직 개정 내용은?\"\nLLM 단독: \"2023년까지만 알아요...\" ❌\n→ 학습 데이터가 낡음!\n\nRAG 사용: [2024년 문서 검색]\n→ \"2024년 3월 개정: 기간 2년→3년\" ✅\n```\n\n**2. 회사별 정보 모름**:\n```\n사용자: \"우리 회사 육아휴직 규정은?\"\nLLM 단독: \"일반적으로는...\" ❌\n→ A회사 규정을 모름!\n\nRAG 사용: [A회사 취업규칙 검색]\n→ \"A회사는 최대 2년입니다\" ✅\n```\n\n**3. Hallucination (환각)**:\n```\n사용자: \"제40조 내용은?\"\nLLM 단독: \"제40조는 퇴직금...\" ❌\n→ 없는 조항을 지어냄!\n\nRAG 사용: [문서 검색 → 없음]\n→ \"문서에 제40조가 없습니다\" ✅\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 전체 흐름\n\n### 단계별 설명\n\n**1단계: 질문 이해**\n```\n\"육아휴직은 몇 년?\"\n→ 벡터로 변환: [0.3, 0.5, 0.7, ...]\n(의미를 숫자로 표현)\n```\n\n**2단계: 유사 문서 검색**\n```\nVector DB에서 유사한 문서 찾기:\n제32조 (육아휴직): 유사도 0.89 ✅\n제30조 (연차휴가): 유사도 0.43\n제33조 (경조사): 유사도 0.38\n\n→ Top-3 선택\n```\n\n**3단계: LLM에게 전달**\n```\nLLM에게:\n\"다음 문서를 참고해서 답변하세요:\n제32조: 육아휴직 기간은 최대 2년...\"\n\n질문: \"육아휴직은 몇 년?\"\n```\n\n**4단계: 답변 생성**\n```\nLLM: \"제32조에 따르면,\n      육아휴직 기간은 최대 2년입니다.\"\n\n→ 출처와 함께 정확한 답변!\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 검색(Retrieval) + LLM 생성(Generation)의 결합\n- **왜 필요한가?**: LLM의 지식 한계와 환각(Hallucination)을 해결하기 위해\n- **어떻게 작동하나?**: 질문 → 관련 문서 검색 → LLM에 전달 → 답변 생성"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### RAG = 시험에 교과서 들고 가기\n\n**LLM 단독 (교과서 없이 시험)**:\n```\n학생: 기억에만 의존\n→ 2023년에 공부한 내용만 앎\n→ 가끔 기억 착각\n→ 회사별 규정은 모름\n\n점수: 60점\n```\n\n**RAG (교과서 보면서 시험)**:\n```\n학생: 책 찾아보면서 답변\n→ 최신 개정판도 확인 가능\n→ 정확한 조항 찾아서 인용\n→ 출처도 명시\n\n점수: 95점\n```\n\n### RAG의 장점\n\n| 기능 | LLM 단독 | RAG |\n|------|----------|-----|\n| 최신 정보 | ❌ (학습 시점까지) | ✅ (문서 업데이트하면 즉시) |\n| 회사별 정보 | ❌ (모름) | ✅ (문서에 있으면 찾음) |\n| Hallucination | ⚠️ (자주 발생) | ✅ (문서 기반으로 방어) |\n| 출처 제공 | ❌ | ✅ (어느 조항인지 명시) |\n| 비용 | 낮음 | 중간 (Vector DB 필요) |"
          },
          {
            "slot": "compare",
            "label": "RAG vs 다른 방법",
            "body": "### 방법 비교\n\n**P3 선택: RAG**\n```\n이유:\n1. 취업규칙 자주 변경 → Fine-tuning 비실용적\n2. 정확도 중요 → Prompt만으로는 부족\n3. 비용 효율적 → Vector DB $100/월\n\n결론: RAG가 최적!\n```"
          }
        ],
        "related": [
          {
            "term": "LLM",
            "note": "RAG의 생성 부분"
          },
          {
            "term": "Embedding",
            "note": "텍스트 → 벡터 변환"
          },
          {
            "term": "Vector DB",
            "note": "벡터 저장소"
          },
          {
            "term": "Chunking",
            "note": "문서 분할"
          },
          {
            "term": "Semantic Search",
            "note": "의미 기반 검색"
          },
          {
            "term": "Reranking",
            "note": "검색 결과 재정렬"
          }
        ],
        "id": "ai--rag"
      },
      {
        "term": "Embedding",
        "reading": "임베딩",
        "category": "AI · LLM",
        "summary": "Embedding은 **텍스트를 숫자로 번역하는 기술**입니다. 마치 GPS가 \"강남역\"을 좌표(위도, 경도)로 바꾸듯, Embedding은 \"육아휴직\"을 숫자 벡터로 바꿉니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 Embedding이 필요한가?",
            "body": "### 텍스트 그대로는 비교 불가능\n\n**문제 상황**:\n```\n\"육아휴직\"과 \"양육휴가\"는 얼마나 비슷한가?\n\n컴퓨터가 텍스트만 보면:\n\"육아휴직\" = [육, 아, 휴, 직]\n\"양육휴가\" = [양, 육, 휴, 가]\n→ 글자가 다르네? 전혀 다른 것 같은데? ❌\n\n사람은 안다:\n→ 거의 같은 뜻! ✅\n```\n\n**키워드 검색의 한계**:\n```\n사용자: \"아이 키우려고 쉬고 싶어요\"\n시스템: [\"육아휴직\" 단어 찾기]\n→ 못 찾음! ❌\n\n문제: 같은 의미를 다르게 표현하면 찾지 못함\n```\n\n### Embedding의 해결\n\n```\n텍스트 → 숫자 벡터로 변환:\n\n\"육아휴직\" → [0.8, 0.2, 0.9, 0.1, ...]\n\"양육휴가\" → [0.7, 0.3, 0.8, 0.2, ...]\n\"연차휴가\" → [0.3, 0.6, 0.4, 0.8, ...]\n\n거리 계산:\n육아휴직 ↔ 양육휴가: 거리 0.1 (매우 가까움!) ✅\n육아휴직 ↔ 연차휴가: 거리 0.9 (멀음)\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 의미가 비슷하면 벡터도 비슷\n\n### 2D로 시각화하면\n\n```\n       육아휴직 ● ● 양육휴가\n                   (가까움!)\n\n    연차휴가 ●\n\n              ● 자동차\n           (완전 다름)\n```\n\n실제로는 768차원이지만 개념은 같습니다!"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 텍스트 → 수백 개의 숫자 배열 (벡터)\n- **왜 필요한가?**: 컴퓨터가 단어의 \"의미\"를 이해하고 비교하기 위해\n- **어떻게 작동하나?**: 비슷한 의미 = 비슷한 숫자"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### Embedding = GPS 좌표\n\n**주소 (텍스트)**:\n```\n\"강남역\" vs \"홍대입구\"는 얼마나 가까운가?\n→ 글자만 보면 알 수 없음\n```\n\n**GPS 좌표 (Embedding)**:\n```\n강남역: (37.498, 127.028)\n홍대입구: (37.557, 126.924)\n\n거리 계산: 약 9km ✅\n→ 숫자로 변환하니 비교 가능!\n```\n\n**Embedding도 마찬가지**:\n```\n\"육아휴직\" → [0.8, 0.2, 0.9, ...]\n\"양육휴가\" → [0.7, 0.3, 0.8, ...]\n\n유사도 계산: 0.95 (매우 비슷함!) ✅\n```"
          },
          {
            "slot": "example",
            "label": "P3 시스템에서의 활용",
            "body": "### RAG의 핵심 = Embedding\n\n### P3에서 Embedding을 쓰는 이유\n\n```\n1. 의미 기반 검색\n   \"아이 키우기\" → \"육아휴직\" 찾음 ✅\n\n2. 오타 허용\n   \"육아휴지\" → \"육아휴직\" 찾음 ✅\n\n3. 유사 표현 인식\n   \"양육휴가\" = \"육아휴직\" 인식 ✅\n\n4. 다국어 지원\n   \"parental leave\" = \"육아휴직\" 매칭 가능 ✅\n```"
          }
        ],
        "related": [
          {
            "term": "Vector DB",
            "note": "Embedding 저장소"
          },
          {
            "term": "Cosine Similarity",
            "note": "벡터 유사도 측정"
          },
          {
            "term": "RAG",
            "note": "Embedding으로 문서 검색"
          },
          {
            "term": "Semantic Search",
            "note": "의미 기반 검색"
          },
          {
            "term": "Chunking",
            "note": "Embedding 전 문서 분할"
          }
        ],
        "id": "ai--embedding"
      },
      {
        "term": "Vector DB",
        "reading": "벡터 데이터베이스",
        "category": "AI · LLM",
        "summary": "Vector DB는 **Embedding 벡터를 저장하고 의미로 검색하는 특수 데이터베이스**입니다. 마치 똑똑한 도서관 사서처럼, 정확한 제목을 몰라도 \"의미\"만으로 관련 문서를 찾아줍니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 Vector DB가 필요한가?",
            "body": "### 일반 DB의 한계\n\n**문제 1: 유사도 검색 불가능**\n```\nPostgreSQL 같은 일반 DB:\nSELECT * FROM documents\nWHERE title = '육아휴직'  ✅ 정확한 매칭만 가능\n\nSELECT * FROM documents\nWHERE title 의미가_비슷한 '아이 키우기'  ❌ 불가능!\n\n→ 정확한 단어만 찾음, 의미 검색 안 됨\n```\n\n**문제 2: 벡터 검색이 너무 느림**\n```\n100만 개 문서에서 유사 벡터 찾기:\n\n일반 DB (전체 스캔):\n→ 모든 벡터와 하나씩 비교\n→ 100만 번 계산\n→ 10초 이상 ❌\n\n필요한 속도:\n→ 0.1초 이내\n→ 실시간 검색\n```\n\n**문제 3: 메모리 낭비**\n```\n100만 문서 × 768차원 = 7억 개 숫자\n→ 약 3GB 메모리 필요\n→ 전부 메모리에 로드 불가능\n```\n\n### Vector DB의 해결\n\n```\n핵심: 똑똑한 인덱싱 (ANN)\n\n전체 스캔 X\n→ \"대충 비슷한\" 벡터만 확인 (ANN)\n→ 정확도 95% + 속도 1000배 ✅\n\n100만 개 벡터에서 검색:\n→ 0.01초 (초고속) ✅\n→ 메모리 효율적 (압축 저장) ✅\n→ 수평 확장 가능 (수억 개까지) ✅\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### ANN (Approximate Nearest Neighbor)\n\n### 전체 스캔 vs ANN\n\n```\n전체 스캔 (일반 DB):\n100만 개 전부 확인\n→ 1,000,000번 계산\n→ 10초 ❌\n\nANN (Vector DB):\n1. 클러스터링으로 1,000개 후보 선택\n2. 1,000개만 정확히 계산\n→ 1,000번 계산 (1000배 빠름)\n→ 0.01초 ✅\n→ 정확도: 95% (충분히 높음)\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 고차원 벡터(768차원)를 저장하고 유사도로 검색하는 DB\n- **왜 필요한가?**: 수백만 개의 벡터에서 0.01초 안에 비슷한 의미 찾기\n- **어떻게 작동하나?**: ANN (근사 최근접 이웃) 알고리즘으로 빠른 검색"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### Vector DB = 똑똑한 도서관 사서\n\n**일반 DB (카드 목록)**:\n```\n사용자: \"육아휴직 책 있어요?\"\n사서: [카드 목록 뒤적] \"육아휴직\" 제목 검색\n→ 정확히 \"육아휴직\"이라는 제목만 찾음\n→ \"양육휴가\"라는 비슷한 책은 못 찾음 ❌\n```\n\n**Vector DB (의미 기반 도서관)**:\n```\n사용자: \"아이 키우기 위한 휴가 책 있어요?\"\n사서: \"아, 육아휴직 관련이시군요!\"\n→ 의미를 이해하고 관련 책 모두 찾아줌\n→ \"육아휴직\", \"양육휴가\", \"출산휴가\" 모두 추천 ✅\n\n게다가 100만 권 중에서도 0.01초 만에 찾아줌!\n```"
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "### 선택 가이드\n\n| Vector DB | 비용 | 속도 | 관리 | 추천 |\n|-----------|------|------|------|------|\n| **Pinecone** | $70/월 | 매우 빠름 | 쉬움 | 프로덕션 |\n| **ChromaDB** | $0 | 빠름 | 직접 | 개발, 비용 절감 |\n| **Milvus** | $0~200 | 빠름 | 중간 | 대규모 (수억 개) |\n| **Elasticsearch** | $50~200 | 중간 | 중간 | Hybrid Search |\n\n### 문서 수별 추천\n\n```\n< 1만 개 문서:\n→ ChromaDB 로컬 실행\n→ 비용 $0, 충분히 빠름\n\n1만~100만 개:\n→ Pinecone\n→ 관리 쉽고 빠름\n\n100만 개 이상:\n→ Milvus (분산 처리)\n→ 수평 확장 가능\n\n키워드 + 벡터 동시 필요:\n→ Elasticsearch\n→ Hybrid Search\n```"
          }
        ],
        "related": [
          {
            "term": "Embedding",
            "note": "Vector DB에 저장할 벡터 생성"
          },
          {
            "term": "Cosine Similarity",
            "note": "유사도 측정 방법"
          },
          {
            "term": "Semantic Search",
            "note": "Vector DB로 의미 검색"
          },
          {
            "term": "RAG",
            "note": "Vector DB 활용"
          },
          {
            "term": "ANN",
            "note": "근사 최근접 이웃 알고리즘"
          }
        ],
        "id": "ai--vector-db"
      },
      {
        "term": "Token",
        "reading": "토큰",
        "category": "AI · LLM",
        "summary": "Token은 **LLM이 텍스트를 처리하는 기본 단위**입니다. 단어보다 작거나 클 수 있으며, LLM 비용과 성능을 결정하는 핵심 요소입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Token이 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 단어 단위 처리의 한계\n\"running\", \"runner\", \"ran\" → 모두 다른 단어로 처리\n→ 관계를 모름! 😱\n\n😱 새로운 단어 처리 불가\n\"ChatGPT\" → 사전에 없음\n→ 처리 불가! 😱\n\n😱 다국어 처리 어려움\n한국어: 띄어쓰기 불규칙\n일본어: 띄어쓰기 없음\n→ 단어 경계 찾기 어려움! 😱\n```\n\n**Token의 해결**:\n```\n✅ 유연한 분할\n\"running\" → [\"run\", \"##ning\"]\n\"runner\" → [\"run\", \"##ner\"]\n→ \"run\"이 공통! 관계 파악 ✅\n\n✅ 미등록 단어 처리\n\"ChatGPT\" → [\"Chat\", \"G\", \"PT\"]\n→ 처리 가능! ✅\n\n✅ 다국어 지원\n\"육아휴직\" → [\"육아\", \"휴직\"] 또는 [\"육\", \"아\", \"휴\", \"직\"]\n→ 언어별 최적화 ✅\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 텍스트를 쪼갠 조각 (단어, 단어 일부, 또는 문자)\n- **왜 필요한가?**: LLM이 텍스트를 이해하고 처리하기 위한 기본 단위\n- **어떻게 작동하나?**: Tokenizer가 텍스트를 토큰으로 분할"
          },
          {
            "slot": "example",
            "label": "Token 계산",
            "body": "### 1. 영어 vs 한국어 토큰 수\n\n```python\nimport tiktoken\n\n# GPT-4 Tokenizer\nencoding = tiktoken.encoding_for_model(\"gpt-4\")\n\n# 영어\ntext_en = \"Parental leave period is 2 years.\"\ntokens_en = encoding.encode(text_en)\nprint(f\"영어: {len(tokens_en)} tokens\")  # 7 tokens\nprint(f\"토큰: {tokens_en}\")\n\n# 한국어\ntext_ko = \"육아휴직 기간은 2년입니다.\"\ntokens_ko = encoding.encode(text_ko)\nprint(f\"한국어: {len(tokens_ko)} tokens\")  # 15 tokens (영어의 2배!)\nprint(f\"토큰: {tokens_ko}\")\n\n# 비용 차이\ncost_en = len(tokens_en) * 0.00003  # GPT-4: $0.03/1K tokens\ncost_ko = len(tokens_ko) * 0.00003\nprint(f\"\\n비용 - 영어: ${cost_en:.6f}\")\nprint(f\"비용 - 한국어: ${cost_ko:.6f} (약 2배)\")\n```\n\n**출력**:\n```\n영어: 7 tokens\n한국어: 15 tokens\n\n비용 - 영어: $0.000210\n비용 - 한국어: $0.000450 (약 2배)\n```\n\n### 2. 토큰 시각화\n\n```python\ndef visualize_tokens(text: str):\n    \"\"\"토큰을 시각화\"\"\"\n    encoding = tiktoken.encoding_for_model(\"gpt-4\")\n    tokens = encoding.encode(text)\n    \n    print(f\"원문: {text}\")\n    print(f\"토큰 수: {len(tokens)}\\n\")\n    \n    # 토큰별 디코딩\n    for i, token_id in enumerate(tokens, 1):\n        token_str = encoding.decode([token_id])\n        print(f\"Token {i}: '{token_str}' (ID: {token_id})\")\n\n# 사용\nvisualize_tokens(\"육아휴직은 2년\")\n```\n\n**출력**:\n```\n원문: 육아휴직은 2년\n토큰 수: 9\n\nToken 1: '육' (ID: 166)\nToken 2: '아' (ID: 232)\nToken 3: '휴' (ID: 243)\nToken 4: '직' (ID: 248)\nToken 5: '은' (ID: 234)\nToken 6: ' ' (ID: 220)\nToken 7: '2' (ID: 17)\nToken 8: '년' (ID: 234)\n```"
          },
          {
            "slot": "example",
            "label": "실전: P3 시스템 토큰 관리",
            "body": "### 1. Context Window 관리\n\n```python\nclass P3TokenManager:\n    \"\"\"P3 시스템 토큰 관리\"\"\"\n    \n    def __init__(self, model=\"gpt-4\"):\n        self.encoding = tiktoken.encoding_for_model(model)\n        self.max_tokens = 8192  # GPT-4 기본\n        self.max_response_tokens = 2000\n        \n    def count_tokens(self, text: str) -> int:\n        \"\"\"텍스트의 토큰 수 계산\"\"\"\n        return len(self.encoding.encode(text))\n    \n    def can_process(self, prompt: str, context: str) -> bool:\n        \"\"\"처리 가능 여부 확인\"\"\"\n        total_tokens = (\n            self.count_tokens(prompt) +\n            self.count_tokens(context) +\n            self.max_response_tokens\n        )\n        return total_tokens <= self.max_tokens\n    \n    def truncate_context(self, context: str, max_tokens: int) -> str:\n        \"\"\"컨텍스트를 토큰 수에 맞게 자르기\"\"\"\n        tokens = self.encoding.encode(context)\n        \n        if len(tokens) <= max_tokens:\n            return context\n        \n        # 토큰 수 제한\n        truncated_tokens = tokens[:max_tokens]\n        return self.encoding.decode(truncated_tokens)\n    \n    def estimate_cost(self, input_text: str, output_text: str) -> float:\n        \"\"\"비용 추정\"\"\"\n        input_tokens = self.count_tokens(input_text)\n        output_tokens = self.count_tokens(output_text)\n        \n        # GPT-4 가격 (2024년 기준)\n        input_cost = input_tokens * 0.00003   # $0.03/1K tokens\n        output_cost = output_tokens * 0.00006"
          },
          {
            "slot": "example",
            "label": "토큰 최적화 전략",
            "body": "### 1. 불필요한 토큰 제거\n\n```python\n# 비효율적 (토큰 낭비)\nprompt = \"\"\"\n안녕하세요! 저는 친절한 AI 비서입니다.\n무엇을 도와드릴까요?\n궁금하신 점이 있으시면 언제든지 물어보세요!\n\n그럼 질문 주세요: 육아휴직은?\n\"\"\"\n# 토큰: ~50개\n\n# 효율적 (핵심만)\nprompt = \"질문: 육아휴직은?\"\n# 토큰: ~10개\n\n# 비용 절감: 80%!\n```\n\n### 2. 프롬프트 압축\n\n```python\n# 장황한 프롬프트 (비효율)\nlong_prompt = \"\"\"\n당신은 취업규칙 전문가입니다.\n사용자의 질문에 친절하게 답변해주세요.\n문서를 참고하여 정확한 답변을 제공하세요.\n답변은 3줄 이내로 간결하게 작성하세요.\n출처를 명시하세요.\n\n질문: {question}\n문서: {context}\n답변:\n\"\"\"\n# 토큰: ~100개\n\n# 압축된 프롬프트 (효율)\nshort_prompt = \"\"\"\n취업규칙 Q&A. 문서 참고, 3줄 이내, 출처 명시.\n\nQ: {question}\nDoc: {context}\nA:\n\"\"\"\n# 토큰: ~40개\n\n# 비용 절감: 60%!\n```"
          }
        ],
        "related": [
          {
            "term": "Context Window",
            "note": "토큰의 최대 개수"
          },
          {
            "term": "LLM",
            "note": "토큰을 처리하는 모델"
          },
          {
            "term": "Prompt",
            "note": "입력 토큰"
          },
          {
            "term": "Embedding",
            "note": "토큰을 벡터로 변환"
          },
          {
            "term": "Fine-tuning",
            "note": "토큰 효율성 개선"
          }
        ],
        "id": "ai--token"
      },
      {
        "term": "Hallucination",
        "reading": "환각, 할루시네이션",
        "category": "AI · LLM",
        "summary": "Hallucination은 **LLM이 사실이 아닌 정보를 그럴듯하게 생성하는 현상**입니다. RAG 시스템에서 반드시 방어해야 하는 핵심 문제입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Hallucination이 만드는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오 1: 없는 정보 지어냄\n질문: \"제40조 내용은?\"\n문서: 제30~35조만 존재\nLLM: \"제40조는 퇴직금 관련 규정입니다...\" 😱\n→ 완전히 지어낸 답변!\n\n😱 시나리오 2: 그럴듯한 거짓말\n질문: \"육아휴직 급여는?\"\n문서: 급여 정보 없음\nLLM: \"육아휴직 중 급여는 기본급의 80%입니다\" 😱\n→ 사실처럼 들리지만 거짓!\n\n😱 시나리오 3: 날짜/숫자 조작\n질문: \"회사 창립일은?\"\n문서: 창립일 정보 없음\nLLM: \"1995년 3월 15일에 창립되었습니다\" 😱\n→ 구체적인 날짜까지 지어냄!\n```\n\n**방어 전략의 효과**:\n```\n✅ RAG (Retrieval-Augmented Generation)\n문서에 있는 정보만 참고\n→ 없는 정보는 \"문서에 없음\" 답변 ✅\n\n✅ Citation (출처 명시)\n\"제32조에 따르면...\" (출처 링크)\n→ 검증 가능 ✅\n\n✅ Confidence Score\n유사도 0.3 → \"관련 정보를 찾지 못했습니다\"\n→ 낮은 신뢰도는 답변 거부 ✅\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: LLM이 거짓 정보를 마치 사실처럼 답변\n- **왜 발생하나?**: 학습 데이터 한계, 확률적 텍스트 생성\n- **어떻게 방어하나?**: RAG, Citation, Confidence Score"
          },
          {
            "slot": "example",
            "label": "Hallucination 방어 구현",
            "body": "### 1. RAG로 방어\n\n```python\nfrom sentence_transformers import SentenceTransformer\nfrom sklearn.metrics.pairwise import cosine_similarity\nimport openai\n\nclass HallucinationDefender:\n    \"\"\"Hallucination 방어 시스템\"\"\"\n    \n    def __init__(self):\n        self.embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')\n        self.threshold = 0.5  # 유사도 임계값\n    \n    def search_documents(self, query: str, documents: list) -> dict:\n        \"\"\"문서에서 관련 정보 검색\"\"\"\n        # 질문 임베딩\n        query_vec = self.embedding_model.encode([query])\n        \n        # 문서들 임베딩\n        doc_vecs = self.embedding_model.encode(documents)\n        \n        # 유사도 계산\n        similarities = cosine_similarity(query_vec, doc_vecs)[0]\n        \n        # 가장 유사한 문서\n        max_idx = similarities.argmax()\n        max_sim = similarities[max_idx]\n        \n        return {\n            'document': documents[max_idx],\n            'similarity': float(max_sim),\n            'found': max_sim >= self.threshold\n        }\n    \n    def generate_answer(self, query: str, documents: list) -> dict:\n        \"\"\"Hallucination 방어하며 답변 생성\"\"\"\n        # 1. 문서 검색\n        search_result = self.search_documents(query, documents)\n        \n        # 2. 유사도 낮으면 답변 거부\n        if not search_result['found']:\n            return {\n                'answer': \"죄송합니다. 해당 질문에 대한 정보를 문서에서 찾을 수 없습니다.\",\n                'confidence': search_result['similar"
          },
          {
            "slot": "example",
            "label": "Hallucination 감지 방법",
            "body": "### 1. 자가 일관성 체크\n\n```python\ndef check_consistency(query: str, n_samples: int = 3) -> bool:\n    \"\"\"같은 질문에 여러 번 답변 → 일관성 체크\"\"\"\n    answers = []\n    \n    for _ in range(n_samples):\n        response = openai.ChatCompletion.create(\n            model=\"gpt-4\",\n            messages=[{\"role\": \"user\", \"content\": query}],\n            temperature=0.7  # 약간의 변동성\n        )\n        answers.append(response.choices[0].message.content)\n    \n    # 답변들이 비슷한지 확인\n    # (실제로는 임베딩 유사도로 비교)\n    unique_answers = set(answers)\n    \n    if len(unique_answers) == 1:\n        return True  # 일관성 높음\n    else:\n        return False # 일관성 낮음 (Hallucination 가능성)\n\n# 사용\nis_consistent = check_consistency(\"육아휴직 기간은?\")\nif not is_consistent:\n    print(\"⚠️ 답변이 일관되지 않음 - Hallucination 의심\")\n```\n\n### 2. 사실 검증 (Fact Checking)\n\n```python\ndef fact_check(claim: str, documents: list) -> dict:\n    \"\"\"주장이 문서에 있는지 검증\"\"\"\n    \n    # 주장을 문서에서 검색\n    embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')\n    \n    claim_vec = embedding_model.encode([claim])\n    doc_vecs = embedding_model.encode(documents)\n    \n    sims = cosine_similarity(claim_vec, doc_vecs)[0]\n    max_sim = sims.max()\n    \n    if max_sim >= 0.8:\n        return {'verified': True, 'confidence': float(max_sim)}\n    else:\n        return {'verified': False, 'confidence': float(max_sim)}\n\n# 사용\nclaim = \"육아휴직은 3년이다\"\nresult = fact_check(claim, documents)"
          },
          {
            "slot": "caution",
            "label": "주의할 점",
            "body": "### 1. Temperature 설정\n\n```python\n# Temperature 높음 → Hallucination 증가\nresponse = openai.ChatCompletion.create(\n    model=\"gpt-4\",\n    temperature=1.0,  # 😱 창의적이지만 사실 왜곡 위험\n    messages=[...]\n)\n\n# Temperature 낮음 → Hallucination 감소\nresponse = openai.ChatCompletion.create(\n    model=\"gpt-4\",\n    temperature=0,  # ✅ 사실에 충실\n    messages=[...]\n)\n\n# P3 시스템 권장: temperature=0 (사실 기반 답변)\n```\n\n### 2. 프롬프트 설계\n\n```python\n# 나쁜 프롬프트 (Hallucination 유발)\nbad_prompt = \"육아휴직에 대해 자세히 설명해줘\"\n# → LLM이 추측으로 채움\n\n# 좋은 프롬프트 (Hallucination 방지)\ngood_prompt = \"\"\"\n다음 문서를 참고해서만 답하세요.\n문서에 없는 내용은 \"정보 없음\"이라고 답하세요.\n\n문서: {document}\n질문: 육아휴직에 대해 설명해줘\n답변:\n\"\"\"\n# → 문서 범위 제한\n```\n\n### 3. 검증 메커니즘\n\n```python\n# P3 시스템의 검증 체크리스트\nverification_checklist = {\n    \"RAG 사용\": True,          # 문서 기반 답변\n    \"Citation 포함\": True,      # 출처 명시\n    \"Confidence 체크\": True,    # 유사도 임계값\n    \"Temperature=0\": True,      # 창의성 제한\n    \"답변 검증\": True,           # 사실 체크\n    \"일관성 체크\": False,        # 선택사항 (비용↑)\n}\n\n# 모든 항목 체크 → Hallucination 위험 최소화\n```"
          }
        ],
        "related": [
          {
            "term": "RAG",
            "note": "Hallucination 방어의 핵심"
          },
          {
            "term": "Prompt",
            "note": "프롬프트 설계로 방어"
          },
          {
            "term": "Embedding",
            "note": "유사도 기반 검증"
          },
          {
            "term": "Reranking",
            "note": "검색 품질 향상"
          },
          {
            "term": "Agent",
            "note": "자율 판단 시 위험 증가"
          }
        ],
        "id": "ai--hallucination"
      }
    ]
  },
  {
    "id": "sec",
    "name": "보안 · 인증",
    "blurb": "누구인지 확인하고 지키는 법",
    "terms": [
      {
        "term": "JWT",
        "reading": "JSON Web Token",
        "category": "보안 · 인증",
        "summary": "JWT는 **사용자 인증 정보를 JSON 형태로 안전하게 전달하는 토큰**입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "```\nHeader.Payload.Signature\n\n예시:\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\neyJ1c2VySWQiOiIxMjMiLCJuYW1lIjoiSm9obiJ9.\nSflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\n```"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "```python\nimport jwt\n\n# JWT 생성\npayload = {'user_id': 123, 'name': 'John'}\nsecret = 'my-secret-key'\n\ntoken = jwt.encode(payload, secret, algorithm='HS256')\nprint(f\"JWT: {token}\")\n\n# JWT 검증\ndecoded = jwt.decode(token, secret, algorithms=['HS256'])\nprint(f\"User: {decoded}\")  # {'user_id': 123, 'name': 'John'}\n```"
          },
          {
            "slot": "summary",
            "label": "한 번 더 정리",
            "body": "```\nJWT = 자체 포함 토큰\n→ 서버에 세션 불필요\n→ stateless\n→ API 인증에 많이 사용\n```"
          }
        ],
        "related": [],
        "id": "sec--jwt"
      },
      {
        "term": "OAuth 2.0",
        "reading": "",
        "category": "보안 · 인증",
        "summary": "**OAuth 2.0은 제3자 애플리케이션에게 사용자 정보 접근 권한을 안전하게 위임하는 표준 프로토콜입니다.**",
        "definition": "사용자가 비밀번호를 직접 공유하지 않고도, 다른 앱이 내 Google 사진, Facebook 친구 목록 등에 접근할 수 있도록 **제한적인 권한**을 부여하는 메커니즘입니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 비밀번호 공유의 위험\n\n```\n옛날 방식 (OAuth 이전):\nCanva: \"Google 사진 쓰려면 구글 비밀번호 알려주세요\"\n사용자: \"hunter2\" ← 비밀번호 직접 입력\n\n문제점:\n1. Canva가 내 Gmail도 읽을 수 있음 (과도한 권한)\n2. Canva가 비밀번호를 저장할 수 있음 (보안 위험)\n3. 비밀번호 변경 시 모든 앱에서 다시 로그인\n4. Canva만 차단할 방법이 없음 (비밀번호 바꾸면 전부 차단)\n```\n\n**OAuth 해결법:**\n```\n1. 사용자: \"Google로 로그인\" 버튼 클릭\n2. Google 로그인 페이지로 이동 (비밀번호는 Google에만 입력)\n3. Canva가 요청하는 권한 확인:\n   \"Canva가 다음 권한을 요청합니다:\n   - 이메일 주소 보기 ✓\n   - Google 사진 보기 및 업로드 ✓\n   - Gmail 읽기 ✗ (요청 안 함)\"\n4. 사용자: \"허용\" 버튼 클릭\n5. Canva는 \"사진\"만 접근할 수 있는 Token 받음\n6. Gmail은 여전히 안전함!\n```\n\n### 문제 2: 권한 회수 불가능\n\n```\n옛날 방식:\n- 앱 10개에 비밀번호를 줌\n- 1개 앱이 믿음직스럽지 않음\n→ 해결: 비밀번호 변경 (나머지 9개도 다 로그아웃됨!)\n```\n\n**OAuth 해결법:**\n```python\n# Google 계정 설정 > 보안 > 제3자 앱 액세스\nconnected_apps = [\n    {\"name\": \"Canva\", \"scopes\": [\"photos\"], \"revoke\": lambda: revoke(\"canva\")},\n    {\"name\": \"Zoom\", \"scopes\": [\"email\"], \"revoke\": lambda: revoke(\"zoom\")},\n    {\"name\": \"의심스러운 앱\", \"scopes\": [\"contacts\"], \"revoke\": lambda: revoke(\"suspicious\")}\n]\n\n# 의심스러운 앱만 차단\nrevoke(\"suspicious\")  # 이 앱의 Token만 무효화\n\n# 나머지 앱들은 정상 작동\n```\n\n### 문제 3: 세밀한 권한 제어 불가능\n\n```\n비밀번호 공유 방식:\n앱: \"비밀번호 주세요\"\n→ 모든 권한 (이메일, 사진, 캘린더, 연락처 등)\n```\n\n**OAuth 해결법:**\n```json\n{\n  \"client_id\": \"canva-app\",\n  \"scopes\": [\n    \"https://www.googleapis.com/auth/userinfo.email\",\n    \"https://www.googleapis.com/auth/photoslibrary.readonly\"\n  ],\n  \"explanation\": \"이메일 주소와 사진 읽기만 허용, 쓰기는 불가\"\n}\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 동작 과정 설명\n\n1. **사용자가 \"Google로 로그인\" 클릭** → Canva가 Google 인증 페이지로 리다이렉트\n2. **사용자가 Google에 로그인** → 비밀번호는 Google에만 전달 (Canva는 모름)\n3. **권한 승인 화면** → \"Canva가 이메일, 사진 접근을 요청합니다\"\n4. **사용자가 \"허용\" 클릭** → Google이 Authorization Code 발급 (1회용)\n5. **Canva가 Code를 Google에 제출** → Access Token + Refresh Token 받음\n6. **Canva가 Token으로 API 호출** → Google Photos API에서 사진 가져옴\n7. **Token 만료 시** → Refresh Token으로 새 Access Token 받음"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. **4가지 역할 (Roles)**\n\n| 역할 | 설명 | 예시 |\n|---|---|---|\n| **Resource Owner** | 자원(데이터)의 소유자 | 당신 (사용자) |\n| **Client** | 자원에 접근하려는 앱 | 캔바, 노션, Zoom |\n| **Authorization Server** | 권한을 부여하는 서버 | Google 로그인 서버 |\n| **Resource Server** | 실제 자원을 제공하는 서버 | Google Photos API |\n\n### 2. **Access Token**\n- 자원에 접근할 수 있는 **임시 열쇠**\n- 보통 1시간 정도 유효\n- Bearer Token 형태: `Authorization: Bearer eyJhbGc...`\n\n### 3. **Refresh Token**\n- Access Token이 만료되면 **새로 발급받기** 위한 토큰\n- 장기간 유효 (주 ~ 월)\n- 더 엄격하게 보안 관리\n\n### 4. **Scope (권한 범위)**\n- 앱이 요청하는 **구체적인 권한**\n- 예: `email`, `profile`, `photos.read`, `calendar.write`"
          },
          {
            "slot": "concept",
            "label": "일상적 비유",
            "body": "OAuth는 **대리인에게 특정 업무만 맡기는 위임장**과 같습니다:\n\n| 전통적인 비밀번호 공유 | OAuth |\n|---|---|\n| 집 열쇠를 청소업체에 줌 | 청소업체에게 \"청소만\" 가능한 임시 카드 발급 |\n| 금고도 열 수 있음 (과도한 권한) | 금고는 열 수 없음 (제한된 권한) |\n| 열쇠 분실 시 전체 교체 | 임시 카드만 무효화, 내 열쇠는 그대로 |\n| 누가 언제 들어왔는지 모름 | 카드 사용 기록 추적 가능 |\n| 열쇠 회수 어려움 | 카드 원격 비활성화 가능 |\n\n**또 다른 비유: 호텔 룸카드**\n- 호텔 마스터 키(비밀번호) vs 룸카드(Access Token)\n- 룸카드는 특정 방만 열 수 있음\n- 체크아웃하면 자동으로 무효화\n- 분실해도 마스터 키는 안전"
          },
          {
            "slot": "compare",
            "label": "OAuth vs API Key vs JWT",
            "body": "| 특성 | OAuth 2.0 | API Key | JWT |\n|---|---|---|---|\n| **목적** | 제3자 권한 위임 | 개발자 식별 | 상태 없는 인증 |\n| **복잡도** | ⭐⭐⭐⭐ 매우 복잡 | ⭐ 간단 | ⭐⭐ 중간 |\n| **사용자 동의** | ✅ 필수 | ❌ 필요 없음 | ❌ 필요 없음 |\n| **권한 범위** | Scope로 세밀하게 제어 | 전체 또는 없음 | Claim으로 제어 |\n| **Token 갱신** | Refresh Token | 수동 재발급 | 새로 발급 |\n| **적용 사례** | \"Google로 로그인\" | 날씨 API 호출 | 마이크로서비스 인증 |\n| **보안성** | ⭐⭐⭐⭐⭐ 매우 높음 | ⭐⭐ 보통 | ⭐⭐⭐⭐ 높음 |\n\n### 언제 OAuth를 쓸까?\n\n✅ **OAuth가 적합한 경우:**\n- 소셜 로그인 (Google, Facebook, GitHub)\n- 제3자 앱에 내 데이터 접근 허용\n- 사용자 대신 API 호출 (위임)\n- 세밀한 권한 제어 필요\n\n❌ **OAuth가 과한 경우:**\n- 자체 서비스 간 통신 (JWT 사용)\n- 단순 API 인증 (API Key 사용)\n- 복잡한 구현이 부담스러움"
          }
        ],
        "related": [],
        "id": "sec--oauth-2-0"
      },
      {
        "term": "SSO",
        "reading": "Single Sign-On",
        "category": "보안 · 인증",
        "summary": "SSO(Single Sign-On, 단일 인증)는 **한 번의 로그인으로 여러 서비스에 접근**할 수 있는 인증 시스템입니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "SSO가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 회사 시스템 10개\n직원 → 이메일 로그인 (ID/PW 1)\n직원 → 인사 시스템 로그인 (ID/PW 2)\n직원 → 급여 시스템 로그인 (ID/PW 3)\n...\n→ 10개 비밀번호 기억\n→ 비밀번호 재사용 (보안 취약)! 😱\n```\n\n**SSO의 해결**:\n```\n✅ 한 번만 로그인:\n직원 → SSO 로그인 (한 번만!)\n→ 이메일 자동 로그인\n→ 인사 시스템 자동 로그인\n→ 급여 시스템 자동 로그인\n→ 편리 + 보안! ✅\n```\n\n**비유**:\n- **SSO 없음** = 건물마다 다른 출입증\n- **SSO** = 하나의 사원증으로 모든 건물 출입"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 하나의 계정으로 여러 서비스 사용\n- **왜 필요한가?**: 여러 계정 관리의 복잡성과 보안 위험\n- **어떻게 작동하나?**: 중앙 인증 서버 → 모든 서비스에 인증 정보 공유"
          },
          {
            "slot": "example",
            "label": "SSO 프로토콜",
            "body": "### 1. SAML 2.0 (가장 일반적)\n```xml\n<!-- SAML Assertion (인증 정보) -->\n<saml:Assertion>\n  <saml:Subject>\n    <saml:NameID>user@company.com</saml:NameID>\n  </saml:Subject>\n  <saml:Conditions>\n    <saml:AudienceRestriction>\n      <saml:Audience>https://app.example.com</saml:Audience>\n    </saml:AudienceRestriction>\n  </saml:Conditions>\n  <saml:AttributeStatement>\n    <saml:Attribute Name=\"email\">\n      <saml:AttributeValue>user@company.com</saml:AttributeValue>\n    </saml:Attribute>\n    <saml:Attribute Name=\"role\">\n      <saml:AttributeValue>admin</saml:AttributeValue>\n    </saml:Attribute>\n  </saml:AttributeStatement>\n</saml:Assertion>\n```\n\n### 2. OAuth 2.0 / OIDC\n```python\nfrom flask import Flask, redirect, request, session\nfrom authlib.integrations.flask_client import OAuth\n\napp = Flask(__name__)\noauth = OAuth(app)\n\n# SSO Provider 설정 (Google)\ngoogle = oauth.register(\n    name='google',\n    client_id='YOUR_CLIENT_ID',\n    client_secret='YOUR_CLIENT_SECRET',\n    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',\n    client_kwargs={'scope': 'openid email profile'}\n)\n\n@app.route('/login')\ndef login():\n    \"\"\"SSO 로그인 시작\"\"\"\n    redirect_uri = url_for('authorize', _external=True)\n    return google.authorize_redirect(redirect_uri)"
          },
          {
            "slot": "example",
            "label": "엔터프라이즈 SSO 구현",
            "body": "### Identity Provider 설정 (Okta 예시)\n```python\nimport okta\n\n# Okta 설정\nokta_config = {\n    'orgUrl': 'https://dev-123456.okta.com',\n    'token': 'YOUR_API_TOKEN'\n}\n\n# 사용자 프로비저닝\ndef create_user(email, first_name, last_name):\n    \"\"\"Okta에 사용자 생성\"\"\"\n    user_profile = {\n        'email': email,\n        'firstName': first_name,\n        'lastName': last_name,\n        'login': email\n    }\n    \n    okta_client = okta.UsersClient(okta_config)\n    user = okta_client.create_user(user_profile)\n    \n    return user\n\n# 앱에 사용자 할당\ndef assign_app(user_id, app_id):\n    \"\"\"사용자에게 앱 접근 권한 부여\"\"\"\n    okta_client = okta.AppsClient(okta_config)\n    okta_client.assign_user_to_app(app_id, {\n        'id': user_id\n    })\n```\n\n### Service Provider 구현\n```python\nfrom flask import Flask, redirect, request\nfrom onelogin.saml2.auth import OneLogin_Saml2_Auth\n\napp = Flask(__name__)"
          },
          {
            "slot": "example",
            "label": "주요 SSO 제공업체",
            "body": "| 제공업체 | 특징 | 사용 사례 |\n|---------|------|----------|\n| **Okta** | 엔터프라이즈 표준 | 대기업 |\n| **Auth0** | 개발자 친화적 | 스타트업 |\n| **Azure AD** | Microsoft 생태계 | Office 365 통합 |\n| **Google Workspace** | Google 생태계 | Gmail, Drive 통합 |\n| **Keycloak** | 오픈소스 | 자체 호스팅 |"
          }
        ],
        "related": [
          {
            "term": "OAuth",
            "note": "SSO에서 사용되는 프로토콜"
          },
          {
            "term": "SAML",
            "note": "SSO 표준 프로토콜"
          },
          {
            "term": "MFA",
            "note": "SSO와 함께 사용되는 보안 강화"
          }
        ],
        "id": "sec--sso"
      },
      {
        "term": "SQL Injection",
        "reading": "",
        "category": "보안 · 인증",
        "summary": "SQL Injection은 악의적인 SQL 코드를 입력 필드에 삽입하여, 데이터베이스에 대한 비정상적인 쿼리를 실행시키는 보안 공격입니다.",
        "definition": "애플리케이션이 사용자 입력값을 검증하지 않고 직접 SQL 쿼리에 연결할 때 발생하며, 공격자는 데이터베이스 조회, 수정, 삭제는 물론 관리자 권한 획득까지 가능합니다.\n\nSQL Injection은 가장 오래되고 치명적인 웹 보안 취약점 중 하나입니다. 공격자가 데이터베이스에 직접 접근하므로, 애플리케이션의 보안 메커니즘을 모두 우회할 수 있고, 전체 데이터베이스가 노출되거나 손상될 수 있습니다.\n\n> **한 줄 요약**: SQL Injection은 악의적인 SQL 코드를 입력값에 삽입하여 데이터베이스를 조작하는 공격\n\n**비유 1**: SQL Injection은 정상적인 편지에 몰래 추가 지시문을 써 넣는 것과 같습니다. 편지를 받는 사람은 원래 요청과 추가된 악의적인 지시문을 구분하지 못하고 모두 따릅니다.\n\n**비유 2**: SQL Injection은 정상적인 약속에 공격자가 숨어서 끼어드는 것과 같습니다. 마치 원래 초대받은 손님인 것처럼 행동하여 집 안의 모든 것에 접근하고 조작할 수 있습니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 전체 데이터베이스 탈취\n공격자가 SELECT 쿼리를 조작하여, 사용자가 접근할 수 없는 민감한 데이터(다른 사용자의 정보, 신용카드 번호, 의료 기록 등)를 읽을 수 있습니다.\n\n### 문제 2: 데이터 무결성 훼손\nUPDATE나 DELETE 쿼리를 악용하여, 데이터를 임의로 수정하거나 삭제할 수 있습니다. 예를 들어 모든 사용자의 잔액을 0으로 만들거나, 중요한 레코드를 삭제할 수 있습니다.\n\n### 문제 3: 관리자 권한 획득\nINSERT 쿼리를 조작하여 새로운 관리자 계정을 생성하거나, UPDATE를 통해 사용자 권한을 관리자로 상향 조정하여, 시스템에 대한 완전한 제어권을 획득할 수 있습니다.\n\n### 문제 4: 데이터베이스 시스템 명령 실행\n일부 데이터베이스(MSSQL, MySQL 등)에서는 SQL 확장 기능을 통해 운영체제 명령을 실행할 수 있으므로, 악의적인 파일을 생성하거나 서버 시스템을 장악할 수 있습니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "SQL Injection 공격은 다음과 같은 단계로 진행됩니다:\n\n1. **취약점 발견**: 공격자가 로그인 폼, 검색창, 필터 등 사용자 입력을 받는 부분을 찾습니다.\n\n2. **페이로드 구성**: 공격자가 SQL 문법을 이용한 악의적인 입력값(페이로드)을 구성합니다. 예: `' OR '1'='1`, `UNION SELECT ...` 등\n\n3. **입력값 전송**: 공격자가 악의적인 입력값을 폼이나 URL 파라미터를 통해 애플리케이션에 전송합니다.\n\n4. **쿼리 문자열 생성**: 애플리케이션이 입력값을 검증하지 않고, SQL 쿼리 문자열에 직접 연결합니다.\n\n5. **데이터베이스 실행**: 조작된 SQL 쿼리가 데이터베이스에 전송되어 실행됩니다.\n\n6. **결과 반환**: 비정상적인 쿼리 결과가 애플리케이션을 통해 공격자에게 반환되거나, 데이터가 조작됩니다."
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "### Mermaid 1: SQL Injection 공격 흐름\n\n### Mermaid 2: 취약한 쿼리 vs 안전한 쿼리\n\n### Mermaid 3: SQL Injection 유형 분류"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 입력값의 직접 삽입\n개발자가 사용자 입력값을 검증하거나 이스케이프하지 않고, SQL 쿼리 문자열에 직접 연결할 때 SQL Injection 취약점이 발생합니다.\n\n### 2. SQL 문법의 해석\n데이터베이스는 최종적으로 전달받은 SQL 문자열을 분석하여 실행하므로, 문자열에 포함된 모든 SQL 키워드가 명령으로 해석됩니다.\n\n### 3. 공격의 종류\n**Classic SQL Injection**: 에러 메시지를 통해 데이터베이스 구조를 파악합니다. **Blind SQL Injection**: 참/거짓 응답을 통해 정보를 추출합니다. **Time-based Injection**: 쿼리 실행 시간 차이를 이용합니다. **Union-based Injection**: UNION 연산자를 통해 다른 테이블의 데이터를 조회합니다.\n\n### 4. 파라미터 바인딩 (Prepared Statement)\nSQL 쿼리의 구조와 데이터를 분리하여, 데이터베이스가 입력값을 문자열이 아닌 데이터로 처리하도록 하는 방어 기법입니다.\n\n### 5. 입력 검증 및 필터링\n화이트리스트를 통해 허용된 입력만 받거나, 특수 문자를 제거/변환하여 SQL 구문이 되지 않도록 합니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | SQL Injection | XSS | CSRF |\n|------|---------------|----|------|\n| 공격 대상 | 데이터베이스 | 클라이언트(브라우저) | 사용자 세션/요청 |\n| 취약점 원인 | 입력값 직접 삽입 | 출력값 이스케이프 부재 | 요청 출처 검증 부재 |\n| 공격자 접근 | 데이터베이스 직접 접근 | 쿠키/세션 탈취 | 세션 악용 |\n| 피해 범위 | 전체 데이터베이스 | 개인 정보, 계정 | 의도하지 않은 행동 |\n| 주요 방어 | Prepared Statement, ORM | 입력 검증, 출력 이스케이프 | CSRF 토큰, SameSite |\n| 복잡도 | 높음(다양한 유형) | 중간 | 낮음~중간 |\n| 공격 난이도 | 고급 기술 필요 | 낮음 | 낮음 |\n| 검출 용이성 | 상대적으로 쉬움 | 보통 | 어려움 |"
          }
        ],
        "related": [],
        "id": "sec--sql-injection"
      },
      {
        "term": "XSS",
        "reading": "Cross-Site Scripting",
        "category": "보안 · 인증",
        "summary": "XSS(Cross-Site Scripting)는 공격자가 악의적인 JavaScript 코드를 웹 애플리케이션에 삽입하여, 피해자가 웹 페이지를 방문할 때 해당 코드가 피해자의 브라우저에서 실행되게 하는 보안 취약점입니다.",
        "definition": "이를 통해 공격자는 피해자의 쿠키, 세션, 개인 정보 등에 접근하거나 악의적인 행동을 수행할 수 있습니다.\n\nXSS 공격은 입력 값을 제대로 검증하고 살균하지 않아서 발생하며, 가장 흔한 웹 보안 취약점 중 하나입니다. 공격자가 삽입한 스크립트는 웹 브라우저의 Same-Origin Policy를 우회하여 원래 웹사이트의 컨텍스트에서 실행되므로, 마치 정상적인 웹사이트 코드인 것처럼 작동합니다.\n\n> **한 줄 요약**: XSS는 악의적인 스크립트를 웹 페이지에 삽입하여 사용자의 브라우저에서 실행시키는 공격\n\n**비유 1**: XSS는 극장 무대에 몰래 혼입된 배우와 같습니다. 정상 배우처럼 보이지만, 예상하지 못한 대사와 행동(악의적인 스크립트)을 하여 관객(사용자)에게 해를 끼칩니다.\n\n**비유 2**: XSS는 신뢰하는 음식에 몰래 든 독약과 같습니다. 겉으로는 정상 음식으로 보이지만, 섭취 시(페이지 로드 시) 독성 물질(악의적 코드)이 작용하여 피해를 입힙니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 쿠키 및 세션 탈취\n공격자가 삽입한 스크립트는 `document.cookie`를 통해 사용자의 세션 쿠키, 인증 토큰 등을 열람하고 외부 서버로 전송하여, 사용자의 계정을 탈취할 수 있습니다.\n\n### 문제 2: 개인 정보 유출\n스크립트가 페이지의 DOM을 조작하여 사용자의 민감한 정보(신용카드 번호, 주소, 전화번호 등)를 열람하고 수집할 수 있습니다.\n\n### 문제 3: 악의적인 리다이렉션\n공격자의 스크립트가 사용자를 악성 웹사이트로 자동 리다이렉션하여 피싱 페이지에 접속하게 하거나, 악성 파일 다운로드를 유도할 수 있습니다.\n\n### 문제 4: 사용자 행동 조작\n스크립트가 마우스 클릭, 폼 제출 등 사용자의 행동을 감지하거나 조작하여, 사용자 의도와 무관한 거래, 메시지 발송, 계정 설정 변경 등을 강제할 수 있습니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "XSS 공격은 다음과 같은 단계로 진행됩니다:\n\n1. **악성 스크립트 작성**: 공격자가 악의적인 JavaScript 코드를 작성합니다 (쿠키 탈취, 리다이렉션, 정보 수집 등).\n\n2. **웹 애플리케이션에 삽입**: 공격자가 악성 스크립트를 댓글, 메시지, 폼 입력, URL 파라미터 등을 통해 웹 애플리케이션에 전달합니다.\n\n3. **검증 부재**: 웹 애플리케이션이 입력값을 적절히 검증하거나 살균하지 않으면, 악성 스크립트가 그대로 저장되거나 응답에 포함됩니다.\n\n4. **피해자 접근**: 피해자가 해당 웹 페이지에 접근하면, 브라우저는 HTML 응답을 파싱하고 포함된 악성 스크립트를 실행합니다.\n\n5. **악의적 행동 수행**: 실행된 스크립트는 쿠키 탈취, 페이지 조작, 피싱 페이지로 리다이렉션, 악성 코드 다운로드 등의 악의적인 행동을 수행합니다."
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "### Mermaid 1: Stored XSS 공격 흐름\n\n### Mermaid 2: XSS 유형별 공격 경로\n\n### Mermaid 3: XSS 방어 계층"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. Stored XSS (저장형)\n악의적인 스크립트가 데이터베이스나 서버에 저장되어, 이후 다른 사용자가 해당 콘텐츠를 조회할 때마다 스크립트가 실행됩니다. 가장 위험한 형태의 XSS입니다.\n\n### 2. Reflected XSS (반사형)\n악의적인 스크립트가 URL 매개변수나 폼 데이터를 통해 전달되어, 해당 요청에 대한 응답 페이지에서만 스크립트가 실행됩니다. 보통 피싱 이메일에 포함된 악의적인 링크를 통해 전달됩니다.\n\n### 3. DOM-Based XSS\n클라이언트 측 JavaScript 코드가 사용자 입력을 부적절하게 처리하여, DOM(Document Object Model)을 직접 조작함으로써 발생하는 XSS입니다. 서버가 응답을 조작하지 않아도 발생할 수 있습니다.\n\n### 4. 입력값 살균 및 이스케이프\n사용자로부터 받은 입력값에 포함된 HTML, JavaScript 등의 특수 문자를 변환하여 스크립트로 해석되지 않도록 만드는 방어 기법입니다.\n\n### 5. Content Security Policy (CSP)\n웹 브라우저에 지시하여 외부 스크립트 로드, 인라인 스크립트 실행 등을 제한하는 HTTP 헤더 기반 보안 정책입니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | XSS | CSRF | SQL Injection |\n|------|-----|------|---------------|\n| 공격 대상 | 클라이언트(브라우저) | 사용자 세션/권한 | 데이터베이스 |\n| 공격 방식 | 악성 스크립트 실행 | 의도하지 않은 요청 전송 | 악성 SQL 삽입 |\n| 데이터 접근 | 브라우저 메모리, 쿠키 | 세션을 통한 간접 조작 | 데이터베이스 직접 조작 |\n| 검증 대상 | 입력값, 출력값 | 요청 출처, CSRF 토큰 | SQL 쿼리 파라미터 |\n| 주요 방어 | 입력 검증, CSP | CSRF 토큰, SameSite 쿠키 | 파라미터 바인딩, ORM |\n| 피해 범위 | 개인 정보, 계정 탈취 | 사용자 의도하지 않은 행동 | 전체 데이터베이스 손상 |\n| 복잡도 | 상대적으로 쉬움 | 중간 | 고도의 기술 필요 |\n| 발생 위치 | 프론트엔드 | 요청 전송 구간 | 백엔드 데이터베이스 |"
          }
        ],
        "related": [],
        "id": "sec--xss"
      },
      {
        "term": "제로 트러스트",
        "reading": "Zero Trust",
        "category": "보안 · 인증",
        "summary": "제로 트러스트는 모든 사용자, 디바이스, 네트워크 요청이 신뢰할 수 없다고 가정하고, 각 접근 시도마다 철저한 인증과 권한 검사를 수행하는 보안 패러다임입니다.",
        "definition": "기존의 \"경계 내부는 안전하다\"는 가정을 버리고, 위치(내부/외부)와 관계없이 모든 트래픽을 검증합니다. 디바이스의 현재 상태, 사용자의 신원, 접근 시도의 컨텍스트를 실시간으로 검증하여 최소한의 필요한 권한만 부여합니다.\n\n현대적 보안 위협은 내부 침투, 클라우드 환경, 원격근무 등으로 인해 기존의 경계 기반 보안이 더 이상 효과적이지 않습니다. 제로 트러스트는 이러한 환경에서 지속적인 검증을 통해 잠재적 위협을 조기에 탐지하고 차단합니다. Google의 BeyondCorp, Microsoft의 Zero Trust Roadmap 등 대형 기술 기업들이 채택하고 있는 표준 보안 프레임워크입니다.\n\n> **한 줄 요약**: \"절대 신뢰하지 말고, 항상 검증하라 (Never Trust, Always Verify)\"\n\n**비유**:\n- **은행 비유**: 직원이든 손님이든 자산실에 들어갈 때마다 신분증을 확인하고, 출입 카드로 인증한 후, CCTV에 기록하는 방식. 직원이라고 해서 자유롭게 접근하지 못합니다.\n- **아파트 현관 비유**: 거주자도 매번 출입할 때 얼굴 인식으로 인증하고, 비정상적인 시간의 출입은 추가 확인을 받는 방식. 현관 잠금만으로는 부족합니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 내부 침해에 대한 무방비 상태\n기존 경계 보안은 외부 침입자만 차단하고, 일단 내부 네트워크에 들어오면 매우 취약합니다. 악의적인 내부자나 내부 네트워크에 침투한 공격자는 다른 시스템에 자유롭게 접근할 수 있습니다. 제로 트러스트는 내부 네트워크라도 각 자원에 대한 접근을 개별적으로 검증하므로, 내부 침해의 영향 범위를 제한합니다.\n\n### 문제 2: 클라우드와 원격근무 환경의 보안 공백\n원격근무 직원이 VPN을 통해 연결하면, 마치 사무실에 있는 것처럼 모든 내부 시스템에 접근할 수 있습니다. 하지만 공공 와이파이, 감염된 노트북 등의 위험에 노출되어 있습니다. 제로 트러스트는 위치나 네트워크 상태와 관계없이, 각 접근 요청의 안전성을 검증합니다.\n\n### 문제 3: 과도한 권한 사용으로 인한 정보 유출\n직원이 자신의 직무와 무관한 데이터에도 접근 가능하면, 실수로 또는 의도적으로 정보가 유출될 수 있습니다. 제로 트러스트는 필요한 자원에만 접근을 제한하고, 비정상적인 접근 패턴을 감지하면 즉시 경고하고 차단합니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 1단계: 초기 접근 요청\n사용자가 특정 애플리케이션이나 서비스에 접근하려고 하면, 즉시 정책 엔진으로 요청이 전달됩니다. 이때 사용자의 신원, 디바이스 정보, 현재 위치, 접근하려는 자원 등의 컨텍스트가 함께 수집됩니다.\n\n### 2단계: ID 인증 (Authentication)\n정책 엔진은 사용자의 신원을 확인합니다. 단순한 비밀번호가 아닌 다단계 인증(MFA)을 사용하여, 사용자가 자신이 주장하는 사람임을 확인합니다. 생체 인식, 보안 키, OTP 앱 등 여러 방식을 조합합니다.\n\n### 3단계: 디바이스 검증\n사용자가 사용하는 디바이스의 상태를 확인합니다. 디바이스가 회사에서 관리하는 승인된 디바이스인지, 보안 패치가 최신인지, 악성 소프트웨어가 없는지 검증합니다. 감염되거나 관리되지 않는 디바이스라면 접근을 거부합니다.\n\n### 4단계: 권한 및 컨텍스트 확인\n사용자가 실제로 요청한 자원에 접근할 권한이 있는지 확인합니다. 역할, 부서, 프로젝트, 데이터 분류 등의 정보를 기반으로 권한을 결정합니다. 또한 접근 시간, 위치, 네트워크 상태 등 컨텍스트 정보도 함께 고려합니다.\n\n### 5단계: 행동 분석 및 실시간 모니터링\n접근이 허용되어도 세션 중에 사용자의 행동을 지속적으로 분석합니다. 평소와 다른 패턴의 데이터 다운로드, 비정상적인 쿼리, 야간 접근 등을 감지하면 즉시 추가 검증을 요청하거나 세션을 차단합니다.\n\n### 6단계: 최소 권한 부여 및 세션 관리\n접근이 최종 승인되면, 사용자에게는 그 순간에 필요한 최소한의 권한만 부여됩니다. 예를 들어, 임시 토큰이나 세션 키를 발급하고, 정해진 시간이 경과하면 자동으로 만료됩니다. 모든 행동은 감시 로그에 기록됩니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. Never Trust, Always Verify (ZTNA - Zero Trust Network Access)\n모든 접근 요청은 기본적으로 거부되며, 명시적인 허가가 있을 때만 접근이 가능합니다. 사용자가 직원이거나 내부 네트워크에 있다고 해서 자동으로 신뢰되지 않습니다. 각 요청마다 ID 인증(MFA), 디바이스 상태 검증, 위치 확인, 행동 패턴 분석 등을 수행합니다.\n\n### 2. 최소 권한 원칙 (Principle of Least Privilege)\n사용자는 자신의 작업에 필요한 최소한의 권한만 부여받습니다. 마케팅 직원이 개발 서버에 접근해야 한다면, 특정 데이터베이스의 읽기 권한만 부여하고, 쓰기 권한이나 관리 기능은 제한합니다. 권한은 시간, 디바이스, 위치에 따라 동적으로 조정됩니다.\n\n### 3. 마이크로 세그멘테이션 (Microsegmentation)\n네트워크를 작은 영역으로 나누어 각 영역 간의 통신을 세밀하게 제어합니다. 웹 서버와 데이터베이스, API 서버와 스토리지는 물리적으로 연결되어 있어도 논리적으로 분리됩니다. 한 영역이 침해되어도 다른 영역으로의 확산을 방지합니다.\n\n### 4. 지속적인 검증과 모니터링\n한 번의 인증으로 장시간 접근을 허용하지 않습니다. 세션 중에도 사용자의 행동을 분석하고, 비정상적인 패턴을 감지하면 즉시 세션을 차단합니다. 모든 접근 시도와 행동은 로깅되며, 이후 분석과 감시에 활용됩니다.\n\n### 5. ID 기반 접근 제어 (Identity-based Access Control)\nIP 주소나 네트워크 위치가 아닌 사용자의 실제 신원을 기반으로 접근을 결정합니다. 원격근무 중인 직원도, 출장 중인 직원도 동일한 수준의 검증을 받고, 필요한 자원에 접근할 수 있습니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | 제로 트러스트 | 경계 보안 | VPN 접근 | IAM(신원 관리) |\n|------|-------------|---------|---------|--------------|\n| **신뢰 모델** | 모든 요청 검증 | 내부는 신뢰 | IP 기반 신뢰 | 신원 기반 신뢰 |\n| **내부망 신뢰** | 신뢰 안 함 | 완전 신뢰 | 신뢰 | 부분적 신뢰 |\n| **검증 시점** | 매번, 지속적 | 경계 진입 시만 | 초기 연결 시만 | 초기 인증 시 |\n| **접근 범위** | 최소 권한 | 직무 기반 | 전체 내부 자원 | 직무 기반 |\n| **내부 침해 대응** | 강함(세그멘테이션) | 약함 | 매우 약함 | 중간 |\n| **구현 복잡도** | 매우 높음 | 낮음 | 중간 | 중간 |\n| **인프라 비용** | 높음 | 낮음 | 중간 | 중간 |\n| **적합 환경** | 클라우드/원격 | 폐쇄형 네트워크 | 소규모 원격팀 | 중소 기업 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### 1. Google BeyondCorp\nGoogle은 2010년부터 기업 내부 경계(VPN, 경계 방화벽)를 완전히 제거하고 제로 트러스트 아키텍처인 BeyondCorp를 구축했습니다. 모든 직원이 공개 인터넷을 통해 Google 애플리케이션에 접근하며, 각 요청마다 디바이스 상태, 신원, 위치를 검증합니다. 이를 통해 내부 네트워크 보안에 드는 비용을 줄이면서도 보안을 높였습니다.\n\n### 2. 재택근무 환경의 보안\npandemic 이후 많은 기업들이 일시적인 VPN 확대 대신 제로 트러스트로 전환했습니다. 직원이 어디서든 MFA와 함께 회사 애플리케이션에 접근할 수 있으며, 감염된 개인 노트북에서의 접근 시도를 감지하고 차단합니다. AWS IAM + MFA + 조건부 접근 정책으로 구현하는 경우가 많습니다.\n\n### 3. 클라우드 네이티브 애플리케이션 보호\n마이크로서비스 아키텍처에서 서비스 간 통신도 제로 트러스트를 적용합니다. 각 서비스는 mTLS(상호 TLS)로 인증하고, 서비스 메시 도구(Istio, Linkerd)가 서비스 간 통신을 세밀하게 제어합니다. 서비스 A가 서비스 B에 접근할 때도 매번 신원 검증과 권한 확인을 수행합니다."
          }
        ],
        "related": [],
        "id": "sec--term"
      }
    ]
  },
  {
    "id": "infra",
    "name": "클라우드 · 인프라",
    "blurb": "코드가 실제로 돌아가는 곳",
    "terms": [
      {
        "term": "Docker",
        "reading": "컨테이너 플랫폼",
        "category": "클라우드 · 인프라",
        "summary": "Docker는 **애플리케이션과 실행 환경을 하나의 \"컨테이너\"로 패키징하는 플랫폼**입니다. 마치 택배 상자처럼, 앱을 포장해서 어디서든 동일하게 실행할 수 있게 해줍니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 Docker가 필요한가?",
            "body": "### Docker가 없을 때의 문제\n\n**문제 1: 환경 차이로 인한 오류**\n```\n개발자 컴퓨터:\n→ Python 3.9\n→ 잘 작동! ✅\n\n서버:\n→ Python 3.7\n→ 에러 발생! ❌\n\n\"내 컴퓨터에서는 되는데요?\"\n→ 환경 차이 때문에 안 됨\n```\n\n**문제 2: 복잡한 설치 과정**\n```\n새 팀원이 합류:\n1. Python 3.9 설치\n2. Node.js 18 설치\n3. PostgreSQL 설치\n4. Redis 설치\n5. 환경변수 설정\n6. 의존성 패키지 설치\n\n→ 반나절 소요 ❌\n→ 설치 과정에서 오류\n→ 버전 불일치 가능성\n```\n\n**문제 3: 서버 리소스 낭비**\n```\nVM (가상머신) 사용 시:\n→ 각 앱마다 전체 OS 필요\n→ 메모리 수 GB씩 소모\n→ 부팅 시간 수십 초\n\n→ 무겁고 느림 ❌\n```\n\n### Docker의 해결\n\n```\n✅ 일관된 환경\n→ 개발/테스트/프로덕션 모두 같은 환경\n→ \"내 컴퓨터에서는 되는데\" 문제 해결\n→ 한 번 만들면 어디서나 동일\n\n✅ 간편한 배포\n→ Docker 이미지 하나면 끝\n→ 설치 과정 자동화\n→ 새 팀원도 5분 안에 시작\n\n✅ 가벼움\n→ VM보다 10배 이상 가벼움\n→ 부팅 시간 1초 이내\n→ 메모리 효율적 (OS 공유)\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### Docker 실행 흐름\n\n### VM vs Docker"
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "### Docker의 핵심 구조\n\n### 각 요소의 역할\n\n```\nDockerfile (레시피):\n→ 이미지를 만드는 방법이 적힌 파일\n→ \"Python 3.9 설치하고, 패키지 설치하고...\"\n→ 텍스트 파일이라 Git 관리 가능\n\nImage (템플릿):\n→ 앱 + 실행 환경이 패키징된 것\n→ 붕어빵 틀처럼 여러 번 사용 가능\n→ 변경 불가능 (Immutable)\n\nContainer (실행 중인 인스턴스):\n→ Image를 실행한 것\n→ 붕어빵 틀로 만든 붕어빵\n→ 각각 독립적으로 실행\n\nDocker Hub (저장소):\n→ 이미지를 공유하는 곳\n→ npm, pip 같은 패키지 저장소\n→ 공식 이미지들 다운로드 가능\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 앱을 격리된 환경에서 실행하는 도구\n- **왜 필요한가?**: \"내 컴퓨터에서는 되는데요?\" 문제 해결\n- **어떻게 작동하나?**: 이미지를 만들고 컨테이너로 실행"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### Docker = 택배 상자\n\n```\n앱 배포 (Docker 없이):\n→ 컴퓨터 옮기기\n→ 모든 환경 설정 다시 해야 함\n→ 무겁고 오래 걸림 ❌\n\n앱 배포 (Docker):\n→ 택배 상자에 포장\n→ 상자만 옮기면 끝\n→ 어디서 열어도 똑같은 내용물 ✅\n```\n\n### Dockerfile = 요리 레시피\n\n```\nDockerfile:\n1. Python 3.9 준비 (재료)\n2. 패키지 설치 (조리 과정)\n3. 앱 복사 (플레이팅)\n4. 실행 명령 (서빙)\n\n→ 레시피대로 만들면 누구나 같은 요리\n→ 한 번 작성하면 반복 가능\n```\n\n### Image = 붕어빵 틀\n\n```\nImage:\n→ 한 번 만들면 여러 번 사용\n→ 틀은 변하지 않음\n\nContainer:\n→ 틀로 찍어낸 붕어빵\n→ 각각 독립적\n→ 하나 먹어도 다른 건 그대로\n```"
          }
        ],
        "related": [
          {
            "term": "Container",
            "note": "Docker가 만드는 실행 환경"
          },
          {
            "term": "VM",
            "note": "가상머신, Docker보다 무거움"
          },
          {
            "term": "Kubernetes",
            "note": "다수의 컨테이너 관리"
          },
          {
            "term": "CI/CD",
            "note": "Docker로 자동 배포"
          },
          {
            "term": "Microservices",
            "note": "Docker로 독립 배포"
          }
        ],
        "id": "infra--docker"
      },
      {
        "term": "Kubernetes",
        "reading": "K8s",
        "category": "클라우드 · 인프라",
        "summary": "Kubernetes는 Docker 컨테이너를 대규모로 자동 관리하고 오케스트레이션하는 오픈소스 플랫폼입니다.",
        "definition": "여러 서버(노드)에 산재된 수백 개의 컨테이너를 마치 하나의 시스템처럼 관리하여, 자동 배포, 스케일링, 업데이트, 장애 복구를 수행합니다. Google이 내부적으로 사용하던 Borg 시스템을 기반으로 개발되었으며, 현재 클라우드 네이티브 표준 플랫폼입니다.\n\n> **한 줄 요약**: 컨테이너 오케스트레이션 플랫폼으로, 자동 배포/스케일링/자가 치유를 제공합니다.\n\n**비유 1**: 쿠버네티스는 마치 데이터센터의 운영 체제(OS)처럼, 수많은 물리 서버와 컨테이너를 효율적으로 관리합니다.\n\n**비유 2**: 오케스트라 지휘자처럼, 많은 수의 악기(컨테이너)를 조화롭게 연주하도록 지휘하고, 악기가 고장나면 즉시 대체합니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 대규모 컨테이너 관리의 복잡성\n수백 개의 컨테이너를 수동으로 관리하는 것은 불가능하므로, 자동화 도구가 필수입니다.\n\n### 문제 2: 컨테이너 장애와 자동 복구\n컨테이너가 갑자기 중단되었을 때 자동으로 새 컨테이너를 생성하여 서비스 가용성을 보장해야 합니다.\n\n### 문제 3: 트래픽 증감에 따른 자동 스케일링\n수요 변화에 따라 자동으로 컨테이너 개수를 증감하여 비용과 성능을 최적화해야 합니다.\n\n### 문제 4: 무중단 업데이트\n서비스 중단 없이 새 버전으로 업데이트하기 위한 방식이 필요합니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "1. **선언적 상태 관리**: 사용자가 원하는 상태(Deployment yaml)를 쿠버네티스에 선언하면, 현재 상태를 자동으로 맞춥니다.\n\n2. **API Server와 컨트롤러**: Master Node의 API Server가 모든 요청을 받고, Controller Manager가 현재 상태를 지속적으로 감시합니다.\n\n3. **etcd 데이터베이스**: 클러스터의 모든 상태 정보(Pod, Node, Service 등)를 저장합니다.\n\n4. **kubelet 에이전트**: 각 Worker Node에서 실행되어 Pod의 생성, 삭제, 상태 관리를 수행합니다.\n\n5. **스케줄러**: 새로운 Pod을 어느 Node에 배치할지 결정합니다 (리소스, 레이블 등을 고려).\n\n6. **자동 복구**: Pod 또는 Node 장애를 감지하면 자동으로 새로운 Pod을 생성하여 원하는 상태를 유지합니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. Pod (포드)\n쿠버네티스의 최소 배포 단위로, 하나 이상의 컨테이너를 포함합니다. 보통 하나의 메인 컨테이너와 사이드카 컨테이너로 구성되며, 같은 Pod 내 컨테이너들은 네트워크와 스토리지를 공유합니다.\n\n### 2. Node (노드)\nPod이 실행되는 물리 또는 가상 서버입니다. 각 Node는 kubelet(에이전트), Container Runtime(Docker), kube-proxy를 실행하며, Master Node가 할당한 작업을 수행합니다.\n\n### 3. Cluster (클러스터)\nMaster Node(제어 평면)와 Worker Node들의 집합입니다. Master Node는 클러스터 전체의 상태를 관리하고, Worker Node는 Pod을 실행합니다.\n\n### 4. Service (서비스)\nPod들의 네트워크 엔드포인트를 추상화하여 일정한 IP와 DNS 이름으로 접근 가능하게 합니다. Pod이 동적으로 생성/삭제되어도 Service를 통해 안정적으로 접근할 수 있습니다.\n\n### 5. Deployment (배포)\nPod의 배포와 업데이트를 관리합니다. 원하는 상태(desired state)를 선언하면 쿠버네티스가 현재 상태를 자동으로 맞춥니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | Kubernetes | Docker Compose | ECS (AWS) |\n|------|-----------|-----------------|-----------|\n| **규모** | 대규모 (수천 개 컨테이너) | 소규모 (단일 호스트) | 중규모 (AWS 통합) |\n| **학습 곡선** | 높음 | 낮음 | 중간 |\n| **자동 스케일링** | 지원 (자동) | 미지원 | 지원 (설정 필요) |\n| **장애 자동 복구** | 지원 | 미지원 | 제한적 |\n| **버전 관리** | Helm, GitOps | 단순 | CloudFormation |\n| **학습 시간** | 몇 주 | 몇 일 | 1-2주 |\n| **커뮤니티** | 매우 큼 (CNCF) | 중간 | AWS 커뮤니티 |\n| **독립성** | 클라우드 무관 | 클라우드 무관 | AWS 종속 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### Case 1: Netflix의 마이크로서비스 관리\nNetflix는 Kubernetes를 사용하여 Hystrix, Eureka 등의 마이크로서비스를 AWS에서 관리합니다. 자동 스케일링으로 트래픽 급증 시 자동으로 인스턴스를 증가시키고, 장애 시 자동 복구하여 높은 가용성을 유지합니다.\n\n### Case 2: Google Cloud Platform (GKE)\nGoogle은 자체 개발한 Kubernetes를 GCP의 관리형 서비스(GKE, Google Kubernetes Engine)로 제공합니다. 사용자는 컨테이너 배포에만 집중하고, Google이 마스터 노드와 인프라를 관리합니다.\n\n### Case 3: 스타트업의 비용 최적화\n팀 규모가 작은 스타트업에서도 Kubernetes를 사용하여 자동 스케일링으로 비용을 절감합니다. 야간에는 워커 노드를 줄이고, 피크 시간에만 확대하여 인프라 비용을 최적화합니다.\n\n### Case 4: 다중 클라우드 운영\n기업이 AWS, Google Cloud, Azure 등 여러 클라우드를 사용할 때, Kubernetes를 공통 플랫폼으로 사용하여 벤더 종속성을 줄입니다."
          }
        ],
        "related": [],
        "id": "infra--kubernetes"
      },
      {
        "term": "Serverless",
        "reading": "서버리스",
        "category": "클라우드 · 인프라",
        "summary": "Serverless는 **서버 관리 없이 애플리케이션을 실행하는 클라우드 컴퓨팅 모델**입니다. 개발자는 코드만 작성하고, 서버 관리는 클라우드 제공자가 담당합니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Serverless가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오 1: 서버 관리 지옥\nEC2 서버 10대 운영\n→ OS 업데이트, 보안 패치\n→ 스케일링 설정\n→ 로드밸런서 구성\n→ 모니터링 설정\n→ 코드보다 서버 관리에 시간 소비! 😱\n\n😱 시나리오 2: 비용 낭비\n24시간 서버 가동\n→ 새벽 2시: 사용자 0명\n→ 서버는 100% 가동\n→ 전기세만 낭비! 😱\n\n😱 시나리오 3: 트래픽 폭발\n평소: 사용자 100명\n이벤트: 사용자 10,000명\n→ 수동으로 서버 증설?\n→ 시간 부족! 서버 다운! 😱\n```\n\n**Serverless의 해결**:\n```\n✅ 시나리오 1: 관리 불필요\n코드만 배포\n→ AWS가 서버 관리\n→ 업데이트, 패치 자동\n→ 개발에만 집중! ✅\n\n✅ 시나리오 2: 사용량 기반 과금\n실행할 때만 비용\n→ 새벽 2시: $0\n→ 피크 타임: 사용량만큼만\n→ 비용 80% 절감! ✅\n\n✅ 시나리오 3: 자동 스케일링\n트래픽 급증\n→ 자동으로 확장\n→ 10,000명 동시 처리\n→ 걱정 끝! ✅\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 서버 관리를 클라우드에 위임\n- **왜 필요한가?**: 인프라 관리 부담 제거\n- **어떻게 작동하나?**: 이벤트 기반 자동 실행"
          },
          {
            "slot": "compare",
            "label": "Serverless vs 기존 서버",
            "body": "| 특성 | Serverless | 기존 서버 |\n|------|-----------|----------|\n| **서버 관리** | 불필요 | 필요 |\n| **비용** | 사용량 기반 | 고정 비용 |\n| **스케일링** | 자동 | 수동/자동 |\n| **시작 시간** | 즉시 | 서버 부팅 |\n| **상태 유지** | Stateless | Stateful 가능 |\n| **실행 시간** | 제한 있음 | 무제한 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### 간단한 API\n\n```python\n# Lambda 함수\nimport json\nimport boto3\n\ndynamodb = boto3.resource('dynamodb')\ntable = dynamodb.Table('Users')\n\ndef lambda_handler(event, context):\n    \"\"\"사용자 조회 API\"\"\"\n    \n    user_id = event['pathParameters']['id']\n    \n    # DynamoDB 조회\n    response = table.get_item(Key={'userId': user_id})\n    \n    if 'Item' in response:\n        return {\n            'statusCode': 200,\n            'body': json.dumps(response['Item'])\n        }\n    else:\n        return {\n            'statusCode': 404,\n            'body': json.dumps({'error': 'User not found'})\n        }\n```\n\n**인프라 코드 (Serverless Framework)**:\n```yaml\nservice: user-service\n\nprovider:\n  name: aws\n  runtime: python3.9\n\nfunctions:\n  getUser:\n    handler: handler.lambda_handler\n    events:\n      - http:\n          path: users/{id}\n          method: get\n\nresources:\n  Resources:\n    UsersTable:\n      Type: AWS::DynamoDB::Table\n      Properties:\n        TableName: Users\n        AttributeDefinitions:\n          - AttributeName: userId\n            AttributeType: S\n        KeySchema:\n          - AttributeName: userId\n            KeyType: HASH\n```\n\n**배포**:\n```bash\nserverless deploy\n# → API 엔드포인트 자동 생성\n# → https://abc123.execute-api.us-east-1.amazonaws.com/users/{id}\n```\n\n### 이미지 처리 파이프라인"
          },
          {
            "slot": "example",
            "label": "Serverless 아키텍처",
            "body": "### 주요 서비스\n\n**AWS**:\n- Lambda: 함수 실행\n- API Gateway: API 관리\n- DynamoDB: NoSQL DB\n- S3: 파일 저장\n- EventBridge: 이벤트 버스\n\n**Azure**:\n- Azure Functions\n- Cosmos DB\n- Blob Storage\n\n**Google Cloud**:\n- Cloud Functions\n- Firestore\n- Cloud Storage"
          }
        ],
        "related": [
          {
            "term": "Lambda",
            "note": "AWS의 서버리스 컴퓨팅"
          },
          {
            "term": "API Gateway",
            "note": "서버리스 API 관리"
          },
          {
            "term": "DynamoDB",
            "note": "서버리스 데이터베이스"
          },
          {
            "term": "S3",
            "note": "서버리스 스토리지"
          },
          {
            "term": "CloudFormation",
            "note": "인프라 as 코드"
          }
        ],
        "id": "infra--serverless"
      },
      {
        "term": "CI/CD",
        "reading": "",
        "category": "클라우드 · 인프라",
        "summary": "CI/CD는 소프트웨어 개발 과정을 자동화하여 개발자가 작성한 코드를 빠르고 안정적으로 운영 환경에 배포하는 방식입니다.",
        "definition": "CI(Continuous Integration, 지속적 통합)는 개발자들이 작성한 코드를 중앙 저장소에 자주 통합하고, 자동으로 빌드와 테스트를 수행합니다. CD(Continuous Delivery/Deployment, 지속적 전달/배포)는 테스트를 통과한 코드를 자동으로 또는 수동 승인을 거쳐 운영 환경에 배포합니다.\n\n> **한 줄 요약**: 코드 변경 → 자동 빌드/테스트 → 자동/수동 배포의 반복 프로세스\n\n**비유 1**: 공장의 컨베이어 벨트 같이, 제품이 계속 생산되고 자동으로 품질 검사를 거친 후 출하됩니다.\n\n**비유 2**: 음악을 작곡한 후 즉시 자동으로 음질 검사를 거쳐 스트리밍 서비스에 배포하는 것처럼, 코드도 지속적으로 품질 보증과 함께 배포됩니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 배포 속도와 안정성의 trade-off\n수동 배포는 느리고 실수가 많지만, CI/CD는 자동화를 통해 빠르면서도 안정적인 배포를 가능하게 합니다.\n\n### 문제 2: 코드 품질 관리\n통합되지 않은 코드의 문제는 운영 환경에서 발견되어 비용이 증가하지만, CI는 즉시 문제를 감지합니다.\n\n### 문제 3: 배포 간 시간 격차\n릴리즈 주기가 길수록 변경 사항이 많아져 위험이 증가하지만, CI/CD는 자주, 작은 단위로 배포하여 위험을 줄입니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "1. **코드 변경 감지**: 개발자가 코드를 저장소(GitHub, GitLab)에 push하면 webhook이 CI 서버를 자동으로 트리거합니다.\n\n2. **자동 빌드**: CI 서버가 코드를 체크아웃하여 컴파일, 의존성 설치, 빌드를 수행합니다.\n\n3. **자동 테스트**: 단위 테스트, 통합 테스트, 성능 테스트 등이 자동으로 실행됩니다.\n\n4. **테스트 결과 판단**: 모든 테스트가 통과하면 다음 단계로 진행하고, 실패하면 개발자에게 알림을 보냅니다.\n\n5. **배포**: 스테이징 환경에 자동 배포 후 수동 검증을 거쳐 운영 환경에 배포합니다.\n\n6. **모니터링**: 배포 후 로그, 성능, 에러를 실시간으로 모니터링합니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. Continuous Integration (CI)\n소스 코드 저장소(Git)에 코드가 push될 때마다 자동으로 빌드, 컴파일, 테스트가 실행되는 과정입니다. 개발자들의 작업 충돌을 조기에 발견하고 품질 문제를 빠르게 파악할 수 있습니다.\n\n### 2. Continuous Delivery/Deployment (CD)\nCI를 통과한 코드를 스테이징(테스트) 환경과 운영 환경으로 자동으로 배포하는 과정입니다. Delivery는 수동 승인 후 배포, Deployment는 완전 자동 배포를 의미합니다.\n\n### 3. 자동화 파이프라인\n코드 push → 빌드 → 단위 테스트 → 통합 테스트 → 스테이징 배포 → 운영 배포의 전체 과정을 자동화하여 수동 개입을 최소화합니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | CI | CD | DevOps |\n|------|----|----|--------|\n| **목표** | 코드 통합 및 테스트 자동화 | 배포 자동화 | 개발과 운영의 통합 |\n| **범위** | 빌드/테스트 단계 | 배포 단계 | 전체 개발/운영 라이프사이클 |\n| **배포 방식** | 자동화 없음 | 자동 또는 수동 승인 | 완전 자동화 |\n| **피드백 주기** | 수 분 | 수 시간 | 즉시 |\n| **주요 도구** | Jenkins, GitHub Actions | Spinnaker, Argo CD | Kubernetes, Terraform |\n| **실패 처리** | 빌드 실패 알림 | 배포 실패 시 자동 롤백 | 무중단 배포 |\n| **문화적 영향** | 개발팀 중심 | 개발 + QA 협업 | 개발 + 운영 완전 통합 |\n| **비용** | 낮음 | 중간 | 높음 (자동화 도구/인력) |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### Case 1: GitHub Actions로 자동 테스트 및 배포\n개발자가 Pull Request를 생성하면 GitHub Actions가 자동으로 테스트를 실행하고, main 브랜치로 merge되면 자동으로 AWS S3와 CloudFront에 배포하는 정적 웹사이트 호스팅 사례입니다.\n\n### Case 2: Jenkins와 Docker를 활용한 마이크로서비스 배포\n대규모 회사에서 Jenkins를 중앙 빌드 서버로 사용하여 수십 개의 마이크로서비스를 자동으로 빌드/테스트하고, Docker 이미지로 생성한 후 Kubernetes에 배포하는 사례입니다.\n\n### Case 3: GitLab CI/CD와 자동 성능 테스트\nGitLab CI를 사용하여 코드 push 시 자동 빌드, 테스트, 성능 벤치마크를 수행하고, 성능 저하 시 자동으로 배포를 차단하는 품질 보증 사례입니다."
          }
        ],
        "related": [],
        "id": "infra--ci-cd"
      },
      {
        "term": "Container",
        "reading": "컨테이너",
        "category": "클라우드 · 인프라",
        "summary": "Container는 **애플리케이션과 실행에 필요한 모든 것을 담은 격리된 실행 환경**입니다. 마치 아파트 각 호수처럼, 독립적으로 실행되지만 건물(OS)은 공유합니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "왜 Container가 필요한가?",
            "body": "### 기존 방식의 문제\n\n**문제 1: VM은 너무 무겁다**\n```\nVM (가상머신):\n→ 앱마다 전체 OS 필요\n→ 메모리: 2GB+\n→ 부팅: 30초+\n→ 디스크: 수십 GB\n\n앱 3개 실행하려면:\n→ 6GB 메모리 + 90초 부팅\n→ 너무 비효율적 ❌\n```\n\n**문제 2: 직접 설치는 충돌 위험**\n```\n서버에 앱 직접 설치:\n→ App A: Python 3.7 필요\n→ App B: Python 3.9 필요\n→ 충돌 발생! ❌\n\n라이브러리 버전 충돌:\n→ numpy 1.20 vs 1.24\n→ 한쪽은 반드시 오류\n```\n\n### Container의 해결\n\n```\n✅ 가볍고 빠름\n→ OS 커널 공유\n→ 메모리: 50MB 정도\n→ 부팅: 1초 이내\n\n✅ 격리된 환경\n→ 각 앱이 독립적\n→ Python 버전 충돌 없음\n→ 서로 영향 안 줌\n\n✅ 이식성\n→ 한 번 만들면 어디서나 실행\n→ 개발/테스트/프로덕션 동일\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### Container의 격리 메커니즘\n\n```\nContainer가 사용하는 Linux 기술:\n\n1. Namespace (네임스페이스):\n→ 프로세스, 네트워크, 파일시스템 격리\n→ 각 Container는 자신만의 공간\n\n2. Cgroups (Control Groups):\n→ CPU, 메모리 리소스 제한\n→ Container A가 전체 메모리 독점 방지\n\n3. Union File System:\n→ 레이어 방식으로 파일시스템 구성\n→ 효율적인 이미지 관리\n```\n\n### Container 생명주기"
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "### Container의 격리 구조\n\n### Container vs VM"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 앱 + 라이브러리를 패키징한 격리 환경\n- **왜 필요한가?**: 가볍고 빠른 격리 실행 위해\n- **어떻게 작동하나?**: OS 커널 공유, 프로세스 수준 격리"
          },
          {
            "slot": "concept",
            "label": "일상적 비유로 이해하기",
            "body": "### Container = 아파트 호수\n\n```\nVM (가상머신) = 독립된 집:\n→ 각 집마다 전기, 수도, 난방 독립\n→ 각 집마다 모든 시설 필요\n→ 비용이 많이 듦 ❌\n\nContainer = 아파트 호수:\n→ 전기, 수도, 난방 공유 (OS 커널)\n→ 각 호수는 독립적 (격리)\n→ 경제적이고 효율적 ✅\n```\n\n### Container의 특성\n\n```\n독립성:\n→ 101호와 201호는 서로 몰라도 됨\n→ 101호가 시끄러워도 201호는 조용\n\n공유:\n→ 같은 건물, 같은 엘리베이터\n→ 같은 OS 커널 공유\n\n빠른 입주:\n→ 집 짓기: 몇 달 (VM)\n→ 아파트 입주: 며칠 (Container)\n```"
          }
        ],
        "related": [
          {
            "term": "Docker",
            "note": "Container를 만들고 실행하는 플랫폼"
          },
          {
            "term": "VM",
            "note": "가상머신, Container보다 무거움"
          },
          {
            "term": "Kubernetes",
            "note": "다수 Container 관리"
          },
          {
            "term": "Microservices",
            "note": "Container로 구현"
          },
          {
            "term": "Image",
            "note": "Container의 템플릿"
          }
        ],
        "id": "infra--container"
      },
      {
        "term": "VPC",
        "reading": "Virtual Private Cloud",
        "category": "클라우드 · 인프라",
        "summary": "VPC는 Virtual Private Cloud의 약자로, 클라우드 제공업체(AWS, GCP, Azure 등)의 공용 클라우드 인프라 내에서 논리적으로 격리된 사설 네트워크 환경을 의미합니다.",
        "definition": "마치 공용 시설(인터넷) 위에 자신의 사설 네트워크를 구축하는 것과 같으며, VPC 내의 모든 리소스(서버, 데이터베이스, 로드밸런서 등)는 자신이 정의한 네트워크 규칙에 따라 통신하게 됩니다.\n\nVPC는 클라우드 컴퓨팅의 가장 기본적이면서도 중요한 개념으로, 온프레미스(온사이트) 데이터센터의 네트워크처럼 동작합니다. 고객은 VPC 내에서 IP 주소 범위를 결정하고, 서브넷을 구성하고, 방화벽 규칙을 설정하며, 인터넷 접근을 제어할 수 있습니다. 이를 통해 기업은 클라우드에서도 온프레미스만큼의 네트워크 제어와 보안을 달성할 수 있게 되었습니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 클라우드 환경에서의 네트워크 보안\n퍼블릭 클라우드는 매우 많은 사용자가 사용하는 공용 인프라이므로, 기본적으로 보안 위험이 높습니다. 자신의 리소스가 클라우드의 어디에 위치하든 다른 조직의 리소스와 물리적으로 가까울 수 있으며, 인터넷을 통해 어디서든 접근 가능한 상태입니다. VPC는 이러한 문제를 해결하여, 클라우드 내에서도 자신의 네트워크를 논리적으로 격리하고 완전히 통제할 수 있게 합니다. 보안 그룹과 네트워크 ACL을 통해 어떤 트래픽을 허용할지를 세밀하게 제어할 수 있으므로, 온프레미스 데이터센터 수준의 보안을 달성할 수 있습니다. 이를 통해 기업은 클라우드의 비용 효율성을 누리면서도 보안을 타협하지 않을 수 있습니다.\n\n### 문제 2: 복잡한 네트워크 아키텍처 관리\n전통적인 온프레미스 환경에서 기업은 여러 부서나 팀을 위해 복잡한 네트워크 구조를 구축해야 했습니다. 각 부서는 자신의 IP 주소 범위를 가져야 하고, 부서 간 통신 정책을 정의해야 하며, 외부 인터넷과의 연결을 제어해야 했습니다. 이러한 작업은 물리적 라우터와 방화벽 설정을 통해 수행되었으므로 매우 복잡했습니다. VPC는 이를 코드처럼 정의할 수 있게 함으로써, 복잡한 네트워크 아키텍처를 빠르게 구축하고 수정할 수 있게 합니다. Infrastructure as Code 원칙에 따라 네트워크 설정을 버전 관리하고 자동화할 수 있으므로, 재현 가능하고 일관성 있는 환경 구축이 가능합니다.\n\n### 문제 3: 멀티 테넌트 환경에서의 데이터 격리\n클라우드 제공업체는 수많은 고객을 동시에 서빙합니다. 각 고객의 데이터와 리소스가 서로 격리되어야 하는데, VPC가 없다면 모든 리소스가 공용 네트워크에 노출됩니다. VPC를 통해 각 고객은 자신만의 격리된 네트워크 환경을 가질 수 있으므로, 한 고객의 리소스가 다른 고객의 리소스에 접근할 수 없게 합니다. 이는 네트워크 수준의 자연스러운 격리를 제공하므로, 멀티 테넌트 환경의 기본 보안 요구사항을 충족합니다. 더군다나 각 VPC는 자신만의 라우팅 테이블, 보안 규칙, 주소 공간을 가지므로, 완전히 독립적인 네트워크처럼 동작합니다.\n\n### 문제 4: 고가용성과 재해 복구\n단일 지역의 단일 데이터센터에 모든 리소스를 배치하면, 그 데이터센터에 장애가 발생할 경우 전체 서비스가 다운됩니다. VPC는 여러 가용 영역(Availability Zone)에 걸쳐 리소스를 배포할 수 있게 하므로, 한 데이터센터의 장애로부터 자동으로 복구될 수 있습니다. 각 가용 영역에 서브넷을 배치하고, 로드 밸런서를 앞에 두면 자동으로 트래픽이 정상 가용 영역으로 전달됩니다. 또한 VPC는 여러 지역에 복제할 수 있으므로, 지역 전체의 재해로부터도 복구할 수 있는 아키텍처를 구축할 수 있습니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 1단계: VPC 생성 및 IP 주소 공간 할당\nVPC를 생성할 때 먼저 CIDR 블록을 지정합니다. 예를 들어 10.0.0.0/16으로 설정하면, VPC 내에서 10.0.0.1부터 10.0.255.254까지의 주소를 사용할 수 있습니다. 이 주소들은 VPC 내에서만 유효하며, 인터넷에서 직접 라우팅되지 않습니다(RFC 1918 사설 주소). 이렇게 설정된 IP 주소 공간은 VPC의 기초가 되며, 이 범위 내에서만 서브넷과 리소스를 생성할 수 있습니다.\n\n### 2단계: 서브넷 생성 및 가용 영역 배치\nVPC를 생성한 후, 이를 더 작은 서브넷으로 나눕니다. 각 서브넷은 특정 가용 영역에 속하며, 고가용성을 위해 여러 가용 영역에 걸쳐 배치합니다. 예를 들어 10.0.1.0/24는 가용 영역 1a에, 10.0.2.0/24는 가용 영역 1b에 배치합니다. 각 서브넷 내에서도 첫 4개(10.0.1.0~10.0.1.3)와 마지막 주소(10.0.1.255)는 AWS가 예약하므로, 실제로 사용 가능한 주소는 10.0.1.4부터 10.0.1.254까지입니다.\n\n### 3단계: 라우팅 테이블 설정\n라우팅 테이블은 트래픽이 어디로 이동해야 하는지를 정의합니다. 예를 들어 \"0.0.0.0/0(모든 외부 트래픽)은 Internet Gateway로 보내라\"는 규칙을 설정하면 퍼블릭 서브넷이 됩니다. 반면 \"0.0.0.0/0(모든 외부 트래픽)은 NAT Gateway로 보내라\"는 규칙을 설정하면, 내부에서 인터넷 요청을 할 수 있으면서도 외부에서 들어오는 요청은 차단됩니다. VPC 내부의 트래픽(10.0.0.0/16)은 기본적으로 로컬 라우팅되어 같은 VPC 내의 다른 서브넷으로 이동합니다.\n\n### 4단계: 인터넷 게이트웨이와 NAT 게이트웨이 구성\n인터넷 게이트웨이(IGW)는 VPC와 인터넷을 연결하는 게이트웨이입니다. IGW가 없으면 VPC의 리소스가 인터넷에 접근할 수 없습니다. IGW를 통한 통신은 공용 IP 주소를 필요로 하므로, 인터넷에 노출되려는 리소스만 공용 IP를 할당받습니다. NAT 게이트웨이는 프라이빗 리소스가 아웃바운드 인터넷 통신을 할 수 있게 해주는 게이트웨이입니다. NAT 게이트웨이를 통과하는 트래픽은 NAT 게이트웨이의 공용 IP에서 출발하는 것으로 보이므로, 프라이빗 리소스의 IP 주소가 인터넷에 노출되지 않습니다."
          },
          {
            "slot": "how",
            "label": "구조",
            "body": "### VPC의 전체 아키텍처\n\n```\n┌──────────────────────────────────────────────────────────────┐\n│ AWS 클라우드                                                  │\n│ ┌────────────────────────────────────────────────────────────┤\n│ │ VPC (10.0.0.0/16)                                           │\n│ │ ┌──────────────────┐  ┌──────────────────┐                 │\n│ │ │ Availability     │  │ Availability     │                 │\n│ │ │ Zone 1 (us-east- │  │ Zone 2 (us-east- │                 │\n│ │ │ 1a)              │  │ 1b)              │                 │\n│ │ │ ┌──────────────┐ │  │ ┌──────────────┐ │                 │\n│ │ │ │ Public       │ │  │ │ Public       │ │                 │\n│ │ │ │ Subnet       │ │  │ │ Subnet       │ │                 │\n│ │ │ │10.0.1.0/24  │ │  │ │10.0.2.0/24  │ │                 │\n│ │ │ │ +──────────+ │ │  │ │ +──────────+ │ │                 │\n│ │ │ │ │ EC2      │ │ │  │ │ │ EC2      │ │ │                 │\n│ │ │ │ │ Instance │ │ │  │ │ │ Instance │ │ │                 │\n│ │ │ │ +──────────+ │ │  │ │ +──────────+ │ │                 │\n│ │ │ └──────────────┘ │  │ └──────────────┘ │                 │\n│ │ │ ┌──────────────┐ │  │ ┌──────────────┐ │                 │\n│ │ │ │ Private      │ │  │ │ Private      │ │                 │\n│ │ │ │ Subnet       │ │  │ │ Subnet       │ │                 │\n│ │ │ │10.0.11.0/24 │ │  │ │10.0.12.0/24 │ │                 │\n│ │ │ │ +──────────"
          },
          {
            "slot": "concept",
            "label": "비유",
            "body": "- 🔵 **비유 1**: 아파트 단지와 같은 개념. 전체 클라우드는 거대한 도시이지만, VPC는 철저히 보안된 담장이 있는 아파트 단지 같은 별도의 공간입니다. 단지 안의 건물들(인스턴스)만 안의 도로(네트워크)를 통해 서로 통신합니다.\n- 🟡 **비유 2**: 은행의 사설 네트워크와 같습니다. 인터넷 어딘가의 클라우드 위에 있지만, 은행만의 독립된 네트워크 규칙과 보안 정책이 적용됩니다.\n- 🟢 **비유 3**: 회사의 사무실 건물. 건물 안에는 여러 부서(서브넷)가 있고, 각 부서는 건물 내 복도(라우팅)를 통해 소통합니다."
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. VPC의 기본 구성 요소\nVPC는 여러 핵심 구성 요소로 이루어집니다. 첫째, IP 주소 공간(CIDR 블록)으로, VPC 내 모든 리소스의 사설 IP 주소 범위를 정의합니다. AWS에서는 보통 10.0.0.0/16 같은 범위를 사용합니다. 둘째, 서브넷(Subnet)으로, VPC를 더 작은 네트워크로 나누는 단위입니다. 셋째, 라우트 테이블(Route Table)로, 트래픽이 어디로 이동해야 하는지를 정의합니다. 넷째, 인터넷 게이트웨이(Internet Gateway)로, VPC 내의 리소스가 인터넷과 통신하게 해줍니다. 다섯째, NAT 게이트웨이(NAT Gateway)로, 프라이빗 리소스가 아웃바운드 인터넷 통신을 할 수 있게 해줍니다. 여섯째, 보안 그룹(Security Group)과 네트워크 ACL(Access Control List)로, 인/아웃바운드 트래픽을 제어합니다.\n\n### 2. 퍼블릭과 프라이빗 서브넷\nVPC 내의 서브넷은 크게 두 가지 유형으로 나뉩니다. 퍼블릭 서브넷은 인터넷 게이트웨이로 직접 연결되어 있어서, 이 서브넷 내의 리소스(예: 웹 서버)가 인터넷으로부터 직접 요청을 받을 수 있습니다. 반면 프라이빗 서브넷은 인터넷과 직접 연결되지 않아서, 이 서브넷 내의 리소스(예: 데이터베이스)는 외부에서 직접 접근할 수 없습니다. 대신 NAT 게이트웨이를 통해 아웃바운드 통신을 할 수 있으므로, 인터넷에서 패치를 다운로드할 수 있으면서도 인바운드 접근으로부터 보호됩니다. 이러한 구조는 \"다중 계층 아키텍처\"의 기반이 되어, 웹 계층은 퍼블릭 서브넷에 배치하고 데이터베이스 계층은 프라이빗 서브넷에 배치할 수 있습니다.\n\n### 3. 네트워크 보안과 접근 제어\nVPC에서 네트워크 보안은 여러 계층에서 구현됩니다. 첫째, 보안 그룹(Security Group)은 인스턴스 수준의 가상 방화벽으로, 각 인스턴스에 대한 인/아웃바운드 트래픽을 제어합니다. 예를 들어 웹 서버의 보안 그룹은 80번(HTTP)과 443번(HTTPS) 포트만 허용하고 나머지는 차단할 수 있습니다. 둘째, 네트워크 ACL(NACL)은 서브넷 수준의 방화벽으로, 서브넷 내외의 트래픽을 제어합니다. 셋째, VPC 내의 리소스들은 기본적으로 사설 IP 주소를 가지고 있어서 인터넷으로부터 직접 접근이 불가능하므로, 이미 상당한 보안이 구현되어 있습니다. 이러한 다층 방어 체계는 네트워크 레벨의 공격으로부터 인프라를 보호합니다."
          }
        ],
        "related": [],
        "id": "infra--vpc"
      }
    ]
  },
  {
    "id": "cs",
    "name": "컴퓨터과학 기초",
    "blurb": "면접에서도, 설계에서도 계속 나온다",
    "terms": [
      {
        "term": "Cache",
        "reading": "캐시",
        "category": "컴퓨터과학 기초",
        "summary": "Cache(캐시)는 **자주 사용하는 데이터를 빠르게 접근할 수 있도록 임시 저장**하는 고속 메모리입니다. CPU와 RAM 사이, 또는 애플리케이션과 데이터베이스 사이에 위치하여 성능을 향상시킵니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Cache가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오 1: 반복적인 DB 조회\n사용자 프로필 조회 API\n→ 매 요청마다 DB 쿼리\n→ DB: 50ms, 초당 100 요청\n→ DB 부하 높고 응답 느림! 😱\n\n😱 시나리오 2: 무거운 계산 반복\n복잡한 통계 계산 (10초 소요)\n→ 같은 데이터로 반복 계산\n→ 매번 10초씩 기다림\n→ 사용자 불만! 😱\n\n😱 시나리오 3: CPU와 RAM 속도 차이\nCPU: 초당 수십억 연산\nRAM: 100ns 접근 시간\n→ CPU가 RAM 대기에 시간 낭비\n→ CPU 성능 활용 못 함! 😱\n```\n\n**Cache의 해결**:\n```\n✅ 시나리오 1:\nRedis 캐시 도입\n→ 첫 요청: DB 조회 (50ms)\n→ 결과를 Redis에 저장 (1ms)\n→ 이후 요청: Redis에서 조회 (1ms)\n→ 50배 빠름! ✅\n\n✅ 시나리오 2:\n계산 결과 캐싱\n→ 첫 계산: 10초 소요\n→ 결과를 메모리에 캐싱\n→ 이후 요청: 1ms\n→ 10,000배 빠름! ✅\n\n✅ 시나리오 3:\nCPU Cache 활용\n→ L1 Cache: 1ns (100배 빠름)\n→ 자주 쓰는 데이터 L1에 저장\n→ CPU가 대기 시간 최소화\n→ 성능 대폭 향상! ✅\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### 캐시 레벨\n\n**L1 Cache (Level 1)**:\n```\n크기: 32-64KB\n속도: ~1ns\n위치: CPU 코어 내부\n특징: 가장 빠르지만 가장 작음\n```\n\n**L2 Cache (Level 2)**:\n```\n크기: 256-512KB\n속도: ~3ns\n위치: CPU 코어별 또는 공유\n특징: L1보다 느리지만 더 큼\n```\n\n**L3 Cache (Level 3)**:\n```\n크기: 2-32MB\n속도: ~12ns\n위치: 모든 코어가 공유\n특징: 가장 크지만 가장 느림 (캐시 중에서)\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 자주 쓰는 데이터의 임시 저장소\n- **왜 필요한가?**: 느린 저장소 접근 횟수 줄이기\n- **어떻게 작동하나?**: 빠른 메모리에 복사본 저장"
          },
          {
            "slot": "example",
            "label": "소프트웨어 캐싱",
            "body": "### Python: 함수 결과 캐싱\n\n```python\nfrom functools import lru_cache\nimport time\n\n# 캐싱 없이\ndef fibonacci_slow(n):\n    \"\"\"피보나치 (느림)\"\"\"\n    if n < 2:\n        return n\n    return fibonacci_slow(n-1) + fibonacci_slow(n-2)\n\n# 캐싱 있음\n@lru_cache(maxsize=128)\ndef fibonacci_cached(n):\n    \"\"\"피보나치 (캐시 사용)\"\"\"\n    if n < 2:\n        return n\n    return fibonacci_cached(n-1) + fibonacci_cached(n-2)\n\n# 비교\nstart = time.time()\nresult1 = fibonacci_slow(30)\nprint(f\"캐싱 없음: {time.time() - start:.3f}초\")  # ~0.3초\n\nstart = time.time()\nresult2 = fibonacci_cached(30)\nprint(f\"캐싱 있음: {time.time() - start:.6f}초\")  # ~0.000015초\n\n# 캐시 정보 확인\nprint(fibonacci_cached.cache_info())\n```\n\n**실행 결과**:\n```\n캐싱 없음: 0.312초\n캐싱 있음: 0.000015초\nCacheInfo(hits=28, misses=31, maxsize=128, currsize=31)\n```\n\n### Redis 캐싱\n\n```python\nimport redis\nimport json\nimport time\n\n# Redis 연결\nr = redis.Redis(host='localhost', port=6379, decode_responses=True)\n\ndef get_user_profile(user_id):\n    \"\"\"사용자 프로필 조회 (캐싱 적용)\"\"\"\n    cache_key = f\"user:{user_id}\"\n\n    # 1. 캐시 확인\n    cached = r.get(cache_key)\n    if cached:\n        print(\"✅ 캐시 히트!\")\n        return json.loads(cached)\n\n    # 2. 캐시 미스 - DB 조회\n    print(\"❌ 캐시 미스 - DB 조회\")\n    time.sleep(0.05)  # DB 쿼리 시뮬레이션\n\n    user = {\n        'id': user_id,\n        'name': f'User{user_id}',\n        'email': f'user{user_id}@example.com'\n    }"
          },
          {
            "slot": "example",
            "label": "캐시 전략",
            "body": "### 1. Cache-Aside (Lazy Loading)\n\n```python\ndef cache_aside(key):\n    \"\"\"가장 일반적인 패턴\"\"\"\n    # 1. 캐시 확인\n    data = cache.get(key)\n\n    if data is None:\n        # 2. 캐시 미스 - DB 조회\n        data = database.query(key)\n\n        # 3. 캐시에 저장\n        cache.set(key, data, ttl=3600)\n\n    return data\n```\n\n### 2. Write-Through\n\n```python\ndef write_through(key, value):\n    \"\"\"쓰기 시 캐시와 DB 모두 업데이트\"\"\"\n    # 1. DB에 쓰기\n    database.save(key, value)\n\n    # 2. 동시에 캐시에도 쓰기\n    cache.set(key, value)\n\n    # 장점: 캐시 항상 최신 상태\n    # 단점: 쓰기가 느림\n```\n\n### 3. Write-Back\n\n```python\ndef write_back(key, value):\n    \"\"\"캐시에만 쓰고 나중에 DB 동기화\"\"\"\n    # 1. 캐시에만 쓰기\n    cache.set(key, value)\n\n    # 2. 비동기로 DB 업데이트 예약\n    queue.enqueue(lambda: database.save(key, value))\n\n    # 장점: 쓰기가 빠름\n    # 단점: 캐시 서버 죽으면 데이터 손실\n```"
          }
        ],
        "related": [
          {
            "term": "CPU",
            "note": "L1/L2/L3 캐시를 가진 프로세서"
          },
          {
            "term": "RAM",
            "note": "캐시의 다음 계층 메모리"
          },
          {
            "term": "Redis",
            "note": "인메모리 캐시 DB"
          },
          {
            "term": "CDN",
            "note": "콘텐츠 전송 네트워크 캐시"
          }
        ],
        "id": "cs--cache"
      },
      {
        "term": "Stack",
        "reading": "스택",
        "category": "컴퓨터과학 기초",
        "summary": "Stack(스택)은 **LIFO(Last In First Out)** 원칙을 따르는 자료구조로, 가장 나중에 들어간 데이터가 가장 먼저 나오는 구조입니다. 접시를 쌓는 것처럼 위에서만 넣고 빼낼 수 있습니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Stack이 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오 1: 함수 호출 관리\n함수 A → 함수 B → 함수 C 호출\n→ 어떤 순서로 돌아가야 할까?\n→ C 끝 → B로? A로? 😱\n\n😱 시나리오 2: 괄호 검증\n\"((a+b) * (c-d))\" 올바른가?\n\"((a+b) * (c-d)\" 올바른가?\n→ 어떻게 확인하지? 😱\n\n😱 시나리오 3: 브라우저 뒤로 가기\n페이지 1 → 2 → 3 → 4\n뒤로 가기 클릭\n→ 어디로 가야 할까? 😱\n```\n\n**Stack의 해결**:\n```\n✅ 시나리오 1: 콜 스택\nA 호출 → Stack: [A]\nB 호출 → Stack: [A, B]\nC 호출 → Stack: [A, B, C]\nC 끝   → Stack: [A, B] ← B로 복귀\nB 끝   → Stack: [A]   ← A로 복귀\n→ 정확한 순서로 돌아감! ✅\n\n✅ 시나리오 2: 괄호 매칭\n'(' 만나면 push\n')' 만나면 pop\n마지막에 스택이 비었으면 올바름\n→ 간단하게 검증! ✅\n\n✅ 시나리오 3: 히스토리\n페이지 이동마다 push\n뒤로 가기는 pop\n→ Stack: [1, 2, 3, 4]\n→ 뒤로: Stack: [1, 2, 3] ← 3으로!\n→ 완벽한 탐색! ✅\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### Stack 연산\n\n**Push (삽입)**:\n```\n스택의 맨 위에 데이터 추가\nStack: [1, 2]\nPush(3)\nStack: [1, 2, 3]\n```\n\n**Pop (제거)**:\n```\n스택의 맨 위 데이터 제거 및 반환\nStack: [1, 2, 3]\nPop() → 3 반환\nStack: [1, 2]\n```\n\n**Peek/Top (조회)**:\n```\n스택의 맨 위 데이터 조회 (제거 안 함)\nStack: [1, 2, 3]\nPeek() → 3 반환\nStack: [1, 2, 3] (그대로)\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 후입선출(LIFO) 자료구조\n- **왜 필요한가?**: 함수 호출, 실행 취소 등에 사용\n- **어떻게 작동하나?**: push(넣기), pop(빼기) 연산"
          },
          {
            "slot": "compare",
            "label": "Stack vs Queue",
            "body": "| 특성 | Stack | Queue |\n|------|-------|-------|\n| **원칙** | LIFO (후입선출) | FIFO (선입선출) |\n| **비유** | 접시 쌓기 | 줄 서기 |\n| **삽입** | Top에서 | Rear에서 |\n| **제거** | Top에서 | Front에서 |\n| **용도** | 함수 호출, Undo | 작업 대기열, BFS |\n\n**비유**:\n```\nStack = 접시 쌓기\n→ 위에 놓은 접시를 먼저 꺼냄\n\nQueue = 줄 서기\n→ 먼저 선 사람이 먼저 나감\n```"
          },
          {
            "slot": "example",
            "label": "Python 구현",
            "body": "### 리스트로 Stack 구현\n\n```python\nclass Stack:\n    \"\"\"Stack 자료구조\"\"\"\n\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        \"\"\"스택에 추가\"\"\"\n        self.items.append(item)\n\n    def pop(self):\n        \"\"\"스택에서 제거\"\"\"\n        if self.is_empty():\n            raise IndexError(\"Stack is empty\")\n        return self.items.pop()\n\n    def peek(self):\n        \"\"\"맨 위 확인\"\"\"\n        if self.is_empty():\n            raise IndexError(\"Stack is empty\")\n        return self.items[-1]\n\n    def is_empty(self):\n        \"\"\"비었는지 확인\"\"\"\n        return len(self.items) == 0\n\n    def size(self):\n        \"\"\"스택 크기\"\"\"\n        return len(self.items)\n\n    def __str__(self):\n        return f\"Stack({self.items})\"\n\n# 사용\nstack = Stack()\nstack.push(1)\nstack.push(2)\nstack.push(3)\n\nprint(stack)           # Stack([1, 2, 3])\nprint(stack.peek())    # 3\nprint(stack.pop())     # 3\nprint(stack)           # Stack([1, 2])\n```\n\n### Python 내장 자료구조 활용\n\n```python\n# 리스트를 Stack처럼 사용\nstack = []\n\n# Push\nstack.append(1)\nstack.append(2)\nstack.append(3)\n\n# Peek\ntop = stack[-1]  # 3\n\n# Pop\nitem = stack.pop()  # 3\n\n# Size\nsize = len(stack)\n\nprint(stack)  # [1, 2]\n```"
          }
        ],
        "related": [
          {
            "term": "Queue",
            "note": "FIFO 자료구조"
          },
          {
            "term": "Heap",
            "note": "우선순위 기반 자료구조"
          },
          {
            "term": "Process",
            "note": "콜 스택을 가진 실행 단위"
          },
          {
            "term": "Recursion",
            "note": "Stack을 사용하는 재귀 호출"
          }
        ],
        "id": "cs--stack"
      },
      {
        "term": "Queue",
        "reading": "큐",
        "category": "컴퓨터과학 기초",
        "summary": "Queue(큐)는 **FIFO(First In First Out)** 원칙을 따르는 자료구조로, 가장 먼저 들어간 데이터가 가장 먼저 나오는 구조입니다. 줄을 서서 기다리는 것처럼 작동합니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Queue가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오 1: 작업 순서 관리\n3개의 작업이 동시에 도착\n→ 어떤 순서로 처리하지?\n→ 늦게 온 게 먼저 처리되면 불공평! 😱\n\n😱 시나리오 2: 프린터 대기열\n여러 문서가 프린터로 전송\n→ 순서 없이 처리하면?\n→ 나중에 보낸 게 먼저 인쇄됨! 😱\n\n😱 시나리오 3: BFS 탐색\n그래프를 레벨별로 탐색하고 싶음\n→ 어떤 자료구조를 써야 하지? 😱\n```\n\n**Queue의 해결**:\n```\n✅ 시나리오 1: 공정한 처리\n작업 A 도착 → Queue: [A]\n작업 B 도착 → Queue: [A, B]\n작업 C 도착 → Queue: [A, B, C]\n처리 시작   → A 먼저! (공정함) ✅\n\n✅ 시나리오 2: 순서 보장\n문서1 전송 → Queue: [문서1]\n문서2 전송 → Queue: [문서1, 문서2]\n인쇄 시작  → 문서1 먼저! ✅\n\n✅ 시나리오 3: BFS\nQueue 사용!\n→ 레벨 0 노드들 먼저\n→ 레벨 1 노드들 다음\n→ 순서대로 탐색! ✅\n```"
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "### Queue 연산\n\n**Enqueue (삽입)**:\n```\n큐의 뒤(Rear)에 데이터 추가\nQueue: [1, 2]\nEnqueue(3)\nQueue: [1, 2, 3]\n```\n\n**Dequeue (제거)**:\n```\n큐의 앞(Front)에서 데이터 제거 및 반환\nQueue: [1, 2, 3]\nDequeue() → 1 반환\nQueue: [2, 3]\n```\n\n**Peek/Front (조회)**:\n```\n큐의 앞 데이터 조회 (제거 안 함)\nQueue: [1, 2, 3]\nPeek() → 1 반환\nQueue: [1, 2, 3] (그대로)\n```"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 선입선출(FIFO) 자료구조\n- **왜 필요한가?**: 순서대로 처리해야 하는 작업 관리\n- **어떻게 작동하나?**: enqueue(넣기), dequeue(빼기) 연산"
          },
          {
            "slot": "concept",
            "label": "Queue 종류",
            "body": "### 1. Simple Queue (일반 큐)\n\n```python\nfrom collections import deque\n\nqueue = deque()\nqueue.append(1)  # Enqueue\nqueue.popleft()  # Dequeue\n```\n\n### 2. Circular Queue (순환 큐)\n\n```python\n# 고정 크기, 꼬리가 앞으로 연결\n# 버퍼, 스트리밍에 사용\n```\n\n### 3. Priority Queue (우선순위 큐)\n\n```python\nimport heapq\n\n# 우선순위에 따라 Dequeue\n# 작업 스케줄링에 사용\n```\n\n### 4. Deque (양방향 큐)\n\n```python\nfrom collections import deque\n\ndq = deque()\ndq.append(1)       # 뒤에 추가\ndq.appendleft(2)   # 앞에 추가\ndq.pop()           # 뒤에서 제거\ndq.popleft()       # 앞에서 제거\n```"
          },
          {
            "slot": "compare",
            "label": "Queue vs Stack",
            "body": "| 특성 | Queue | Stack |\n|------|-------|-------|\n| **원칙** | FIFO (선입선출) | LIFO (후입선출) |\n| **비유** | 줄 서기 | 접시 쌓기 |\n| **추가** | Rear | Top |\n| **제거** | Front | Top |\n| **용도** | 작업 대기열, BFS | 함수 호출, DFS |\n\n**비유**:\n```\nQueue = 줄 서기\n→ 먼저 온 사람이 먼저 나감\n\nStack = 접시 쌓기\n→ 나중에 놓은 접시를 먼저 꺼냄\n```"
          }
        ],
        "related": [
          {
            "term": "Stack",
            "note": "LIFO 자료구조"
          },
          {
            "term": "Heap",
            "note": "우선순위 큐에 사용"
          },
          {
            "term": "Deque",
            "note": "양방향 큐"
          },
          {
            "term": "BFS",
            "note": "Queue를 사용하는 탐색 알고리즘"
          }
        ],
        "id": "cs--queue"
      },
      {
        "term": "Thread",
        "reading": "스레드",
        "category": "컴퓨터과학 기초",
        "summary": "Thread(스레드)는 **프로세스 내에서 실행되는 작업의 단위**로, 하나의 프로그램이 여러 작업을 동시에 처리할 수 있게 합니다.",
        "definition": "",
        "sections": [
          {
            "slot": "why",
            "label": "Thread가 해결하는 문제",
            "body": "**문제 상황**:\n```\n😱 시나리오: 단일 스레드 프로그램\n웹 서버 → 요청 1개 처리 중\n→ 요청 2가 도착\n→ 요청 1 완료까지 대기\n→ 느린 응답! 😱\n```\n\n**Thread의 해결**:\n```\n✅ 동시 처리:\n웹 서버 → 스레드 1: 요청 1 처리\n         → 스레드 2: 요청 2 처리\n→ 동시에 처리\n→ 빠른 응답! ✅\n```\n\n**비유**:\n- **단일 스레드** = 은행 창구 1개 (한 명씩 처리)\n- **멀티 스레드** = 은행 창구 여러 개 (동시 처리)"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "- **무엇인가?**: 프로그램 실행의 최소 단위\n- **왜 필요한가?**: 여러 작업을 동시에 수행\n- **어떻게 작동하나?**: 프로세스 내 메모리 공유하며 독립 실행"
          },
          {
            "slot": "compare",
            "label": "Thread vs Process vs Async",
            "body": "| 항목 | Thread | Process | Async |\n|------|--------|---------|-------|\n| **메모리** | 공유 | 독립 | 공유 |\n| **생성 비용** | 낮음 | 높음 | 매우 낮음 |\n| **GIL** | 영향 있음 | 영향 없음 | 영향 있음 |\n| **용도** | I/O 작업 | CPU 작업 | I/O 작업 |\n| **복잡도** | 중간 | 높음 | 중간 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "### 웹 크롤러\n```python\nimport requests\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef fetch_url(url):\n    \"\"\"URL 가져오기\"\"\"\n    print(f\"Fetching {url}\")\n    response = requests.get(url)\n    return {\n        'url': url,\n        'status': response.status_code,\n        'length': len(response.content)\n    }\n\nurls = [\n    'https://www.google.com',\n    'https://www.github.com',\n    'https://www.stackoverflow.com',\n    'https://www.python.org',\n    'https://www.wikipedia.org'\n]\n\n# 병렬 다운로드\nwith ThreadPoolExecutor(max_workers=5) as executor:\n    results = list(executor.map(fetch_url, urls))\n\nfor result in results:\n    print(f\"{result['url']}: {result['status']} ({result['length']} bytes)\")\n```\n\n### 주기적 작업\n```python\ndef periodic_task(interval, task_func):\n    \"\"\"주기적으로 실행되는 스레드\"\"\"\n    def wrapper():\n        while not stop_event.is_set():\n            task_func()\n            time.sleep(interval)\n    \n    return wrapper\n\nstop_event = threading.Event()\n\ndef check_status():\n    \"\"\"상태 체크\"\"\"\n    print(f\"[{time.strftime('%H:%M:%S')}] 상태 체크\")\n\n# 5초마다 실행\nthread = threading.Thread(\n    target=periodic_task(5, check_status)\n)\nthread.start()\n\n# 20초 후 종료\ntime.sleep(20)\nstop_event.set()\nthread.join()\n```"
          },
          {
            "slot": "example",
            "label": "Python Threading",
            "body": "### 기본 사용법\n```python\nimport threading\nimport time\n\ndef task(name, duration):\n    \"\"\"스레드에서 실행될 작업\"\"\"\n    print(f\"[{name}] 시작\")\n    time.sleep(duration)\n    print(f\"[{name}] 완료\")\n\n# 스레드 생성\nthread1 = threading.Thread(target=task, args=(\"Thread-1\", 2))\nthread2 = threading.Thread(target=task, args=(\"Thread-2\", 3))\n\n# 스레드 시작\nthread1.start()\nthread2.start()\n\n# 메인 스레드는 계속 실행\nprint(\"메인 스레드 실행 중...\")\n\n# 스레드 종료 대기\nthread1.join()\nthread2.join()\n\nprint(\"모든 스레드 완료\")\n\n# 출력:\n# [Thread-1] 시작\n# [Thread-2] 시작\n# 메인 스레드 실행 중...\n# [Thread-1] 완료\n# [Thread-2] 완료\n# 모든 스레드 완료\n```\n\n### 클래스로 Thread 생성\n```python\nclass WorkerThread(threading.Thread):\n    \"\"\"커스텀 스레드 클래스\"\"\"\n    \n    def __init__(self, name, task_id):\n        super().__init__()\n        self.name = name\n        self.task_id = task_id\n    \n    def run(self):\n        \"\"\"스레드 실행 시 호출됨\"\"\"\n        print(f\"[{self.name}] Task {self.task_id} 시작\")\n        time.sleep(2)\n        print(f\"[{self.name}] Task {self.task_id} 완료\")\n\n# 사용\nworkers = []\nfor i in range(3):\n    worker = WorkerThread(f\"Worker-{i}\", i)\n    worker.start()\n    workers.append(worker)\n\n# 모든 워커 대기\nfor worker in workers:\n    worker.join()\n```"
          }
        ],
        "related": [
          {
            "term": "Multi-thread",
            "note": "여러 스레드 사용"
          },
          {
            "term": "Process",
            "note": "프로그램 실행 단위"
          },
          {
            "term": "Concurrency",
            "note": "동시성"
          }
        ],
        "id": "cs--thread"
      },
      {
        "term": "Big O 표기법",
        "reading": "Big O Notation",
        "category": "컴퓨터과학 기초",
        "summary": "Big O 표기법은 알고리즘의 시간 복잡도와 공간 복잡도를 나타내는 수학적 표기법입니다. 입력 데이터의 크기(n)가 증가할 때 알고리즘이 얼마나 빠르게 성능이 저하되는지를 분석합니다.",
        "definition": "단순히 실행 시간을 측정하는 것이 아니라, 입력 크기에 따른 알고리즘의 상대적 성능 변화를 파악하는 것이 핵심입니다.\n\nBig O 표기법은 '최악의 경우(Worst Case)'를 기준으로 합니다. 즉, 가장 오래 걸리는 경우의 시간 복잡도를 나타냅니다. 이를 통해 알고리즘의 성능 상한을 명확히 할 수 있으며, 대규모 데이터셋에서의 예측 가능한 성능을 파악할 수 있습니다. 개발자는 Big O 표기법을 통해 서로 다른 알고리즘을 객관적으로 비교하고, 실제 상황에 맞는 최적의 알고리즘을 선택할 수 있습니다.\n\n> Big O 표기법 = 입력 크기에 따른 알고리즘 성능의 상대적 변화를 수학적으로 나타낸 표기법\n\n**비유 1**: Big O는 마치 자동차의 가속도 같습니다. 처음 1km 달리는 데 10초가 걸렸다고 해서 10km를 예측할 수 없습니다. 입력이 10배 늘어났을 때 시간이 10배, 100배, 또는 1000배 늘어나는지 파악하는 것이 Big O입니다.\n\n**비유 2**: Big O는 병원 대기시간과 같습니다. 환자 1명일 때 5분, 10명일 때 50분이면 O(n)이고, 10명일 때 100분이면 O(n²)입니다. 시스템이 얼마나 효율적으로 확장하는가를 나타냅니다.",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 알고리즘 성능 예측 불가능\n프로그래머가 단순히 '몇 초가 걸린다'는 경험적 정보만으로는 데이터가 10배, 100배 증가했을 때의 성능을 예측할 수 없습니다. Big O를 통해 입력 크기 증가에 따른 성능 변화를 수학적으로 예측할 수 있습니다.\n\n### 문제 2: 알고리즘 비교의 객관성 부족\n서로 다른 두 알고리즘 중 어느 것이 더 효율적인지 판단할 때, 단순 실행 시간 비교는 하드웨어, 환경, 데이터 크기에 따라 결과가 달라집니다. Big O는 이론적, 객관적 기준을 제공합니다.\n\n### 문제 3: 프로젝트 규모 결정의 어려움\n초기 개발 시 몇 백 개 데이터로는 문제없던 알고리즘도, 데이터가 백만 개로 증가하면 치명적으로 느려질 수 있습니다. Big O를 미리 분석하면 이러한 스케일링 문제를 사전에 파악할 수 있습니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "Big O 표기법의 계산 방법은 다음과 같습니다:\n\n**1단계: 기본 연산 식별**\n알고리즘의 모든 연산을 나열하고, 각 연산이 입력 크기 n에 따라 몇 번 실행되는지 파악합니다. 예를 들어, `for i in range(n):`이면 n번 실행됩니다.\n\n**2단계: 총 연산 횟수 계산**\n중첩된 루프나 조건문을 고려하여 총 연산 횟수를 식으로 표현합니다. 이중 루프라면 n × n = n² 번입니다.\n\n**3단계: 지배항(Dominant Term) 추출**\n3n² + 2n + 5 같은 식에서 가장 큰 영향을 미치는 항 3n²를 선택합니다.\n\n**4단계: 계수 제거**\n3n²에서 상수 계수 3을 제거하여 O(n²)로 표현합니다. n이 무한대에 가까워질수록 상수의 영향은 미미해지기 때문입니다.\n\n**예시: 이중 루프 분석**\n```\nfor i in range(n):\n    for j in range(n):\n        print(i, j)\n```\n외부 루프: n번, 내부 루프: n번 → 총 n × n = n² → **O(n²)**"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 주요 시간 복잡도 계층\nBig O 표기법은 가장 빠른 O(1)부터 가장 느린 O(n!)까지 여러 단계로 나뉩니다. 각 단계는 입력 크기가 증가할 때 성능 저하의 정도를 나타내며, 알고리즘 선택의 중요한 기준이 됩니다.\n\n### 2. 상수항과 계수 무시\nBig O 표기법에서는 O(2n)과 O(n)을 같은 O(n)으로 표현합니다. 상수 계수와 낮은 차수 항은 무시하고, 가장 영향력 있는 항만 고려합니다. 이는 n이 충분히 커질 때 상수의 영향이 미미해지기 때문입니다.\n\n### 3. 최악의 경우 분석\nBig O는 항상 '최악의 경우'를 기준으로 합니다. 평균적인 경우(Theta)나 최선의 경우(Omega)와는 다르며, 알고리즘이 보장할 수 있는 최대 성능 저하를 나타냅니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 표기법 | 이름 | n=100일 때 연산 수 | 대표 알고리즘 | 실용성 |\n|--------|------|-----------------|----------|--------|\n| O(1) | 상수 | 1 | 배열 인덱싱, 해시맵 조회 | 매우 우수 ⭐⭐⭐⭐⭐ |\n| O(log n) | 로그 | 약 7 | 이진탐색, 이진 트리 | 매우 우수 ⭐⭐⭐⭐⭐ |\n| O(n) | 선형 | 100 | 선형 탐색, 배열 순회 | 우수 ⭐⭐⭐⭐ |\n| O(n log n) | 선형 로그 | 약 700 | 병합 정렬, 퀵 정렬 | 우수 ⭐⭐⭐⭐ |\n| O(n²) | 이차 | 10,000 | 버블 정렬, 삽입 정렬 | 보통 ⭐⭐⭐ |\n| O(n³) | 삼차 | 1,000,000 | 삼중 루프 | 나쁨 ⭐⭐ |\n| O(2ⁿ) | 지수 | 약 1.27 × 10³⁰ | 부분집합 생성 | 매우 나쁨 ⭐ |\n| O(n!) | 팩토리얼 | 약 9.33 × 10¹⁵⁷ | 전순열 생성 | 사용 불가능 ❌ |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "**사례 1: 배열 탐색**\n```\n// 선형 탐색 - O(n)\nfunction linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}\n\n// 해시맵 탐색 - O(1)\nconst map = new Map();\n// 전처리: O(n)\narr.forEach(item => map.set(item, true));\n// 조회: O(1)\nmap.has(target);\n```\n데이터가 100개일 때는 선형 탐색(100회)과 해시맵(1회) 모두 충분하지만, 1,000만 개 데이터에서는 선형 탐색(1,000만 회)은 불가능하고 해시맵(1회)은 순식간에 결과를 반환합니다.\n\n**사례 2: 정렬 알고리즘 선택**\n초기에 1,000개 데이터는 버블 정렬 O(n²) = 1,000,000 연산으로도 충분하지만, 데이터가 100,000개로 증가하면 버블 정렬은 10,000,000,000 연산이 필요합니다. 반면 병합 정렬 O(n log n) = 1,600,000 연산으로 훨씬 빠릅니다.\n\n**사례 3: 데이터베이스 인덱스**\n인덱스 없이 100만 건의 레코드를 탐색하면 O(n)으로 평균 500,000번 조회가 필요합니다. B-tree 인덱스를 사용하면 O(log n)으로 약 20번의 조회만 필요합니다."
          }
        ],
        "related": [],
        "id": "cs--big-o"
      },
      {
        "term": "Hash / 해시",
        "reading": "",
        "category": "컴퓨터과학 기초",
        "summary": "해시(Hash)는 임의의 크기를 가진 데이터를 입력받아 고정된 크기의 값(해시값)으로 변환하는 함수이자, 그 결과값을 의미합니다.",
        "definition": "해시 함수는 일방향 함수로서 같은 입력에는 항상 같은 출력을 생성하지만, 출력으로부터 원래 입력을 복원할 수 없습니다. 해시는 컴퓨터 과학의 가장 기본적이면서도 강력한 개념 중 하나로, 데이터 검색, 저장, 보안, 검증 등 거의 모든 분야에서 사용됩니다.\n\n해시 함수의 핵심 특성은 결정론적(Deterministic)입니다. 동일한 입력에는 항상 동일한 해시값을 반환해야 하며, 입력의 아주 작은 부분만 변경되어도 완전히 다른 해시값이 생성됩니다. 이를 통해 데이터의 무결성을 검증할 수 있으며, 대용량 데이터를 효율적으로 저장하고 검색할 수 있습니다. 현대 정보 보안의 기초가 되는 핵심 기술입니다.\n\n> 해시 = 임의 크기 데이터를 고정 크기 값으로 변환하는 일방향 함수, 암호화와 검색에 필수\n\n**비유 1**: 해시는 마치 도서관의 책 분류 체계와 같습니다. 책의 제목과 내용을 보고 특정 섹션(해시값)을 결정하지만, 섹션 번호만 가지고는 원래 책의 내용을 복원할 수 없습니다. 그러나 같은 책은 항상 같은 섹션에 분류됩니다.\n\n**비유 2**: 해시는 신분증 사진과 같습니다. 사진으로 본인을 확인할 수 있지만(검증), 사진만으로 신분증의 다른 정보를 알 수 없으며, 사진은 일정하게 유지되어야 합니다(결정론적).",
        "sections": [
          {
            "slot": "why",
            "label": "왜 필요한가",
            "body": "### 문제 1: 대용량 데이터 효율적 검색\n파일이나 데이터베이스에서 특정 데이터를 찾을 때, 전체를 순회하면 시간이 많이 걸립니다. 해시 테이블을 사용하면 O(n)의 선형 탐색을 O(1)의 상수 시간 탐색으로 단축할 수 있습니다.\n\n### 문제 2: 비밀번호 안전한 저장\n사용자 비밀번호를 평문으로 저장하면 해킹 시 모든 계정이 노출됩니다. 비밀번호를 해시화하여 저장하면, 해킹되어도 원본 비밀번호는 알 수 없습니다. 사용자가 로그인할 때는 입력한 비밀번호를 해시화하여 저장된 값과 비교합니다.\n\n### 문제 3: 데이터 무결성 검증\n다운로드한 파일이 손상되었는지 확인해야 합니다. 파일의 해시값을 계산하고 제공처의 해시값과 비교하면, 파일의 변조 여부를 즉시 파악할 수 있습니다."
          },
          {
            "slot": "how",
            "label": "어떻게 작동하나",
            "body": "**해시 함수의 동작 과정:**\n\n**1단계: 입력 데이터 처리**\n사용자가 제공한 데이터(문자열, 파일, 숫자 등)가 해시 함수의 입력으로 들어옵니다. 입력의 크기는 제한이 없습니다.\n\n**2단계: 비트 조작(Bitwise Operations)**\n해시 함수는 입력 데이터의 각 비트를 복잡한 수학 연산으로 처리합니다. XOR, 회전, 치환, 덧셈 등 다양한 연산을 통해 입력의 특성을 섞습니다.\n\n**3단계: 고정 크기 축약**\n계산된 결과를 정해진 크기로 축약합니다. SHA-256은 256비트(32바이트)의 고정 크기로 축약합니다.\n\n**4단계: 16진수 표현**\n최종 해시값을 16진수 문자열로 표현합니다. 예: `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3`\n\n**해시 테이블에서의 활용:**\n\n해시 테이블은 키-값 쌍을 빠르게 검색하기 위해 해시 함수를 사용합니다. 예를 들어, 사용자 ID를 키로 하여 사용자 정보를 저장할 때:\n1. 사용자 ID → 해시 함수 → 배열 인덱스 도출\n2. 해당 인덱스의 버킷에 (사용자 ID, 사용자 정보) 저장\n3. 검색 시 같은 방식으로 해시 값을 계산하여 O(1)에 찾음"
          },
          {
            "slot": "concept",
            "label": "핵심 개념",
            "body": "### 1. 단방향성(One-Way Function)\n해시 함수의 가장 중요한 특성은 되돌릴 수 없다는 것입니다. 원본 데이터 → 해시값 방향은 쉽지만, 해시값 → 원본 데이터는 사실상 불가능합니다. 이를 통해 비밀번호를 안전하게 저장할 수 있으며, 데이터의 기밀성을 보장합니다.\n\n### 2. 결정론적(Deterministic)과 고정 길이\n같은 입력에는 항상 같은 해시값이 나와야 하며, 입력의 크기와 관계없이 출력은 항상 고정 길이입니다. SHA-256이면 항상 256비트, MD5면 항상 128비트의 해시값이 생성됩니다. 이를 통해 데이터의 변조를 감지하고 검색을 최적화할 수 있습니다.\n\n### 3. 충돌 최소화(Collision Resistance)\n서로 다른 두 입력이 같은 해시값을 생성하는 '충돌'이 발생할 수 있습니다. 좋은 해시 함수는 충돌을 최소화하도록 설계됩니다. 암호용 해시는 의도적으로 충돌을 찾기가 사실상 불가능하도록 만들어집니다."
          },
          {
            "slot": "compare",
            "label": "무엇과 비교되나",
            "body": "| 항목 | Hash Table | Array | Binary Search Tree | LinkedList |\n|------|-----------|-------|------------------|-----------|\n| 평균 조회 | O(1) | O(1) | O(log n) | O(n) |\n| 평균 삽입 | O(1) | O(n) | O(log n) | O(n) |\n| 평균 삭제 | O(1) | O(n) | O(log n) | O(n) |\n| 순서 보장 | 없음 | 예 | 정렬 순서 | 삽입 순서 |\n| 메모리 효율 | 중간 | 우수 | 중간 | 낮음 |\n| 최악 조회 | O(n) | O(1) | O(n) | O(n) |\n| 캐시 친화성 | 낮음 | 높음 | 중간 | 낮음 |\n| 범위 검색 | 어려움 | 쉬움 | 쉬움 | 쉬움 |"
          },
          {
            "slot": "example",
            "label": "실제 사례",
            "body": "**사례 1: 비밀번호 저장 (bcrypt)**\n```\n원본 비밀번호: \"MySecurePass123\"\nbcrypt 해시: \"$2b$12$N9qo8uLOickgx2ZMRZoHK...\"\n\n로그인 시:\n입력된 비밀번호 → bcrypt 해시 → 저장된 해시와 비교\n```\n사용자가 입력한 비밀번호를 bcrypt로 해시하여 저장된 값과 비교합니다. 서버 해킹 시에도 원본 비밀번호는 노출되지 않습니다.\n\n**사례 2: Git 커밋 ID (SHA-1)**\n```\n커밋 내용: 변경된 코드 + 작성자 정보 + 타임스탬프\n↓\nSHA-1 해시\n↓\n40자 16진수 문자열\n예: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0\n```\n각 Git 커밋은 해시값으로 고유하게 식별되며, 커밋 내용이 조금이라도 변경되면 해시값도 완전히 달라집니다.\n\n**사례 3: 파일 다운로드 무결성 확인**\n```\n다운로드 전:\n제공처: \"파일 SHA-256: 3a7f8b2c...\"\n\n다운로드 후:\n내 파일 SHA-256 계산: 3a7f8b2c...\n\n비교:\n동일 → 파일 손상 없음 ✓\n다름 → 파일 손상 또는 위변조 ✗\n```\n대용량 파일 다운로드 시 네트워크 오류로 파일이 손상되었는지 확인합니다."
          }
        ],
        "related": [],
        "id": "cs--hash"
      }
    ]
  }
];
