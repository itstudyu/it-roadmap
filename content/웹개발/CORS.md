# CORS (Cross-Origin Resource Sharing)

## 📝 정의

CORS는 웹 브라우저가 서로 다른 출처(도메인, 프로토콜, 포트)의 리소스에 접근하는 것을 제어하는 보안 정책입니다. 기본적으로 웹 브라우저는 동일 출처 정책(Same-Origin Policy)을 따르므로, 현재 페이지와 다른 출처의 API나 리소스에 자유롭게 접근할 수 없습니다. CORS는 서버가 특정 출처의 요청을 명시적으로 허용함으로써 이러한 제한을 완화하는 메커니즘입니다.

CORS의 핵심은 HTTP 헤더를 통한 통신입니다. 브라우저는 다른 출처로의 요청을 보낼 때, HTTP 요청 헤더에 자신의 출처를 명시합니다(Origin 헤더). 서버는 이를 확인하고 응답 헤더에 허용 여부를 명시합니다(Access-Control-Allow-Origin 헤더). 브라우저는 이 응답 헤더를 확인하여 응답을 JavaScript에 제공할지 말지를 결정합니다. 이러한 검증 과정으로 인해 악의적인 웹사이트가 사용자의 권한으로 다른 사이트의 API에 임의로 접근하는 것을 방지합니다.

> **한 줄 요약**: 서버가 명시적으로 허용한 출처에서만 브라우저가 리소스에 접근하도록 하는 보안 메커니즘

> **비유**: 🔵보안 게이트 - 클럽(서버)이 특정 사람(출처)만 들어오도록 명단을 작성하는 것처럼, 서버가 특정 출처의 요청만 허용함 / 🟡신분증 확인 - 입장할 때 신분증(Origin 헤더)을 제시하면 사용인이 명단(CORS 설정)을 확인하여 입장을 허용하거나 거부하는 것과 동일

---

## 🎯 핵심 개념

### 1. 동일 출처 정책 (Same-Origin Policy)
웹 브라우저는 보안상의 이유로 동일 출처 정책을 기본으로 따릅니다. 출처(origin)는 프로토콜(http/https), 도메인명(domain), 포트(port)의 조합으로 정의됩니다. 예를 들어 https://example.com:443에서 로드된 페이지는 https://example.com:443의 리소스는 자유롭게 접근할 수 있지만, https://api.example.com이나 http://example.com (프로토콜이 다름) 같은 다른 출처의 리소스는 접근할 수 없습니다. 이 정책이 없으면 악의적인 웹사이트가 사용자의 인증 정보를 사용하여 은행 계좌에 접근할 수 있는 등 심각한 보안 문제가 발생합니다.

### 2. Origin 헤더
브라우저는 다른 출처로 요청을 보낼 때, Origin 헤더에 현재 페이지의 출처를 자동으로 포함시킵니다. 예를 들어 https://frontend.com의 페이지에서 https://api.backend.com의 API를 호출하면, 브라우저는 요청 헤더에 "Origin: https://frontend.com"을 추가합니다. 서버는 이 Origin 값을 읽어 해당 출처의 요청을 허용할지 말지를 결정합니다. Origin 헤더는 JavaScript로 조작할 수 없으므로, 악의적인 페이지가 거짓 Origin을 전송할 수 없습니다.

### 3. Access-Control-Allow-Origin 헤더
서버는 응답 헤더에 Access-Control-Allow-Origin을 포함시켜 어떤 출처의 요청을 허용하는지 명시합니다. 예를 들어 "Access-Control-Allow-Origin: https://frontend.com"이라고 응답하면, 그 출처의 요청만 허용됩니다. 또는 "Access-Control-Allow-Origin: *"이라고 응답하면 모든 출처를 허용합니다. 하지만 와일드카드(*)는 보안상 위험하므로, 특정 출처를 명시하는 것이 권장됩니다.

### 4. Preflight 요청
일부 요청(POST, PUT, DELETE 등)은 브라우저가 자동으로 Preflight 요청을 보냅니다. 이는 실제 요청을 보내기 전에 OPTIONS 메서드로 서버에 "이런 요청을 보낼 수 있나요?"라고 묻는 과정입니다. Preflight 요청에 포함되는 헤더는 Access-Control-Request-Method(실제 요청의 메서드), Access-Control-Request-Headers(실제 요청의 헤더)입니다. 서버는 이 요청에 대해 Access-Control-Allow-Methods, Access-Control-Allow-Headers로 응답하여 허용하는 메서드와 헤더를 명시합니다. 이 과정으로 인해 브라우저는 서버가 지원하는 CORS 설정을 먼저 확인한 후 실제 요청을 보냅니다.

### 5. Simple Request vs Preflight Request
GET, HEAD, POST 요청 중 특정 조건(Content-Type이 application/x-www-form-urlencoded, multipart/form-data, text/plain 중 하나)을 만족하는 요청은 Simple Request로 분류되며, Preflight 없이 바로 전송됩니다. 반면 POST 요청에 application/json을 사용하거나 커스텀 헤더를 포함하거나 PUT, DELETE 메서드를 사용하는 요청은 Preflight Request로 분류되어 OPTIONS 요청을 먼저 보냅니다. 이는 서버에 불필요한 요청이 도착하지 않도록 사전에 검증하는 메커니즘입니다.

---

## ⚠️ 해결하는 문제

### 문제 1: 악의적인 사이트의 API 무단 접근
사용자가 은행 웹사이트(bank.com)에 로그인한 후, 실수로 악의적인 사이트(malicious.com)를 방문했다고 가정합니다. 만약 CORS가 없다면, 악의적인 사이트의 JavaScript가 사용자의 인증 쿠키를 사용하여 bank.com의 송금 API를 호출할 수 있습니다. 사용자 모르게 돈이 이체될 수 있는 것입니다. CORS와 동일 출처 정책은 이를 방지합니다. 브라우저는 악의적인 사이트에서 bank.com으로의 API 요청을 차단하고, bank.com이 명시적으로 해당 출처를 허용하지 않는 한 응답을 JavaScript에 제공하지 않습니다.

### 문제 2: 정당한 크로스 도메인 요청의 거부
현실에서는 정당한 크로스 도메인 요청이 많습니다. 예를 들어 frontend.com에서 api.backend.com의 서비스를 사용해야 하는 경우입니다. 동일 출처 정책만으로는 이러한 정당한 요청도 차단됩니다. CORS는 서버가 명시적으로 특정 출처를 허용함으로써 이 문제를 해결합니다. 서버는 Access-Control-Allow-Origin을 설정하여 frontend.com의 요청을 수락하고, 다른 악의적인 사이트의 요청은 여전히 차단합니다.

### 문제 3: API 접근 제어의 세분화 부족
동일 출처 정책은 단순 허용/차단만 가능합니다. 하지만 실제로는 어떤 요청 메서드(GET, POST 등)를 허용할지, 어떤 헤더를 포함할 수 있는지 등을 세분화하여 제어해야 합니다. CORS의 Access-Control-Allow-Methods, Access-Control-Allow-Headers 등의 헤더를 사용하면 이러한 세분화된 제어가 가능합니다. 예를 들어 GET 요청은 허용하지만 DELETE 요청은 허용하지 않을 수 있습니다.

### 문제 4: 인증 정보의 안전한 전송
CORS 요청에서 쿠키나 인증 헤더(Authorization)를 포함할지 여부를 제어해야 합니다. 기본적으로 크로스 도메인 요청은 인증 정보를 포함하지 않습니다. 만약 인증 정보가 필요하면 요청에 credentials 옵션을 설정해야 하고, 서버는 Access-Control-Allow-Credentials 헤더로 응답해야 합니다. 이를 통해 인증 정보가 필요한 경우에만 전송되도록 제어할 수 있습니다.

---

## 🏗️ 구조


```도해
흐름: CORS, 무슨 순서로 오가나
브라우저 :: OPTIONS /api/resource Origin: htt…
서버 :: 200 OK Access-Control-Allow-Origi…
브라우저 :: POST /api/resource Origin: https:…
서버 :: 200 OK Access-Control-Allow-Origi…
브라우저 :: CORS 헤더 검증 출처 확인
브라우저 :: 응답을 JS에 제공 가능
```

---

## ⚙️ 작동 원리

CORS 요청 처리 과정은 먼저 브라우저가 요청의 출처를 확인하는 것부터 시작합니다. 현재 페이지의 프로토콜, 도메인, 포트와 요청 대상의 프로토콜, 도메인, 포트가 다르면 크로스 도메인 요청으로 간주됩니다.

GET이나 HEAD 요청, 또는 특정 Content-Type의 POST 요청(application/x-www-form-urlencoded, multipart/form-data, text/plain)은 Simple Request로 분류되어 바로 서버로 전송됩니다. 이때 브라우저는 요청 헤더에 Origin을 자동으로 추가합니다.

PUT이나 DELETE 요청, 또는 application/json을 Content-Type으로 사용하는 POST 요청, 또는 커스텀 헤더를 포함하는 요청은 Preflight Request가 필요합니다. 브라우저는 먼저 OPTIONS 메서드로 Preflight 요청을 보냅니다. 이 요청은 Origin, Access-Control-Request-Method, Access-Control-Request-Headers 헤더를 포함합니다. 서버는 이 요청에 대해 Access-Control-Allow-Methods, Access-Control-Allow-Headers 등으로 응답합니다. 브라우저가 응답을 확인하여 요청이 허용되면, 실제 요청을 보냅니다.

서버는 모든 크로스 도메인 요청에 대해 응답 헤더에 Access-Control-Allow-Origin을 포함시켜야 합니다. 만약 이 헤더가 없거나 요청의 Origin과 일치하지 않으면, 브라우저는 응답을 JavaScript에 제공하지 않고 CORS 에러를 발생시킵니다. 에러 메시지는 보안상의 이유로 자세한 정보를 제공하지 않으므로, 개발자는 브라우저의 개발자 도구 콘솔을 확인해야 합니다.

인증 정보(쿠키, Authorization 헤더)가 포함된 요청의 경우 추가 과정이 필요합니다. 클라이언트는 요청의 credentials 옵션을 'include'로 설정해야 하고, 서버는 응답 헤더에 Access-Control-Allow-Credentials: true를 포함시켜야 합니다. 또한 이 경우 Access-Control-Allow-Origin을 와일드카드(*)로 설정할 수 없으며, 반드시 특정 출처를 명시해야 합니다.

---

## 📊 비교

| 항목 | CORS 허용 | CORS 차단 |
|------|---------|---------|
| **설정 방식** | 서버의 응답 헤더에 허용 정책 명시 | 서버에서 응답 헤더 미설정 또는 Origin 불일치 |
| **Origin 처리** | 요청의 Origin을 확인 후 허용 | Origin 확인 후 거부 |
| **브라우저 동작** | 응답을 JavaScript에 제공 | 응답을 JavaScript에 제공하지 않음 |
| **에러** | 없음 (정상 처리) | CORS 에러 발생 |
| **네트워크** | 요청과 응답 모두 전송됨 | 요청은 전송되지만 응답이 제공되지 않음 |
| **Preflight** | Preflight 요청 필요 시 사전 검증 | Preflight 응답 실패로 실제 요청 미전송 |
| **인증 정보** | credentials 옵션과 헤더로 제어 | 인증 정보 전송 불가 |
| **사용 예** | 프론트엔드와 백엔드가 다른 도메인 | 같은 도메인 또는 CORS 미설정 |

| 항목 | Simple Request | Preflight Request |
|------|---|---|
| **메서드** | GET, HEAD, POST (특정 Content-Type) | PUT, DELETE, POST (application/json) |
| **Preflight** | 없음 | OPTIONS 메서드로 사전 요청 |
| **과정** | 1단계 (바로 요청 전송) | 2단계 (Preflight → 실제 요청) |
| **속도** | 빠름 | 느림 (오버헤드 있음) |
| **Content-Type** | application/x-www-form-urlencoded<br/>multipart/form-data<br/>text/plain | application/json, application/xml 등 |
| **커스텀 헤더** | 불가 (제한적) | 가능 |
| **브라우저 처리** | 간단 | 복잡 |

---

## ✅ 장단점

### 장점
- **보안 강화**: 악의적인 웹사이트가 사용자의 권한으로 다른 사이트의 API를 호출하는 것을 방지합니다.
- **세분화된 접근 제어**: 메서드, 헤더, 출처 등을 세분화하여 제어할 수 있습니다.
- **표준 기반**: W3C 표준으로 모든 주요 브라우저에서 지원합니다.
- **명시적 허용**: 서버가 명시적으로 출처를 허용해야 하므로 실수로 인한 보안 문제를 줄입니다.
- **유연한 정책**: 특정 출처만 허용하거나 모든 출처를 허용하거나, 조건부로 허용할 수 있습니다.

### 단점
- **구현의 복잡성**: 개발자가 CORS를 이해하고 올바르게 설정해야 하므로 학습 곡선이 있습니다.
- **Preflight 오버헤드**: Simple Request가 아닌 경우 추가 OPTIONS 요청으로 인해 지연이 발생합니다.
- **디버깅의 어려움**: CORS 에러 메시지가 자세하지 않아 원인 파악이 어려울 수 있습니다.
- **와일드카드의 보안 위험**: 모든 출처를 허용(*)하는 설정은 보안 효과를 감소시킵니다.
- **캐시 문제**: Preflight 요청의 캐싱 시간이 짧으면 성능 저하가 발생합니다.

---

## 💡 실제 사례

프론트엔드가 localhost:3000에서 작동하고 백엔드가 api.example.com에서 작동하는 일반적인 웹 애플리케이션을 생각해봅시다. 프론트엔드에서 백엔드의 API를 호출하려면 CORS를 설정해야 합니다. 백엔드 서버는 응답 헤더에 "Access-Control-Allow-Origin: http://localhost:3000"을 추가합니다. 또한 POST 요청에 application/json을 사용한다면 Preflight 요청을 처리하기 위해 OPTIONS 메서드를 지원해야 합니다.

Facebook API를 이용하는 경우, Facebook이 허용한 출처(도메인)에 대해서만 API 요청이 성공합니다. 승인되지 않은 도메인에서 API를 호출하려고 하면 CORS 에러가 발생합니다. 이는 Facebook 계정 정보나 개인정보가 승인되지 않은 사이트로 유출되는 것을 방지합니다.

Google Maps API를 임베드하는 경우, Google이 CORS를 통해 특정 도메인에서만 API 키를 사용할 수 있도록 제한합니다. 악의적인 사이트가 다른 곳의 API 키를 훔쳐서 자신의 사이트에서 사용하려고 해도, Google 서버가 CORS를 통해 도메인을 검증하므로 사용할 수 없습니다.

마이크로프론트엔드 아키텍처에서 여러 팀이 개발한 서로 다른 애플리케이션들을 한 페이지에서 로드할 때도 CORS가 중요합니다. 각 마이크로 앱이 다른 도메인에 호스팅되어 있다면, 통신을 위해 CORS를 설정해야 합니다.

---

## 🔗 관련 용어

- **Same-Origin Policy (동일 출처 정책)**: CORS의 기반이 되는 브라우저 보안 정책
- **Origin (출처)**: 프로토콜, 도메인, 포트의 조합
- **Preflight 요청**: CORS 검증을 위한 사전 OPTIONS 요청
- **Access-Control-Allow-Origin**: 허용된 출처를 명시하는 응답 헤더
- **Access-Control-Allow-Methods**: 허용된 HTTP 메서드를 명시하는 헤더
- **Access-Control-Allow-Headers**: 허용된 요청 헤더를 명시하는 헤더
- **Access-Control-Allow-Credentials**: 인증 정보 포함 허용 여부를 명시하는 헤더
- **credentials 옵션**: 요청에 인증 정보를 포함할지 여부를 지정하는 JavaScript 옵션

---

*카테고리: 웹개발*
