# Query (쿼리)

## 📝 정의

Query는 **저장된 데이터에서 원하는 것을 꺼내오라는 명령**이다.

PostgreSQL 문서는 쿼리를 "데이터베이스에서 데이터를 꺼내오는 과정, 또는 그렇게 하라는 명령" 이라고 적는다. 그 명령을 무슨 말로 적는지는 저장소마다 다르다 — SQL 의 `SELECT`, 시계열을 골라내는 PromQL 식, 주소의 물음표 뒤가 모두 같은 자리에 선다.

### 이름
= Query 는 본래 "묻는다" 는 말이다. 무엇을 달라고 묻는 그 자리가 곧 쿼리다

### 비유
장 볼 것만 적어 심부름꾼에게 건네는 쪽지. 어느 가게 어느 칸에서 집어 오는지는 적지 않는다.

### 예
검색 결과 화면에서 주소창을 보면 물음표 뒤에 방금 친 검색어가 그대로 붙어 있다.

### 직접
검색 사이트에서 아무 말이나 찾아본 뒤 주소창을 보라. 물음표 뒤에 방금 친 그 말이 그대로 붙어 있다.

## 🖼️ 그림으로 보기

```도해
층: 검색 한 번에 쿼리는 몇 겹으로 겹쳐 있나
주소창 :: `?q=python`. 표준이 이 자리를 query 라 부른다
서버 :: 받은 조건을 저장소에 물을 쿼리로 옮긴다
데이터베이스 :: `SELECT ... WHERE` 로 맞는 행만 골라낸다
= 겹마다 적는 말이 다를 뿐, 하는 일은 "이것만 달라" 하나다
```

## ⚠️ 해결하는 문제

```도해
대조: 거르는 일을 어디에서 하면 무엇이 달라지나
전부 받아 와서 거르면 || 쿼리로 물으면
옮기는 양 :: 표 전체가 온다 || 맞는 것만 온다
거르는 곳 :: 내 프로그램에서 || 데이터 옆에서
집계 :: 다 받아 더한다 || 합계만 받는다
= 거르고 더하는 일을 데이터가 있는 곳에 맡기는 것이 쿼리다
```

백만 행 중 열 건이 필요할 때 표를 통째로 받아 와서 내 코드로 거르면, 안 쓸 행을 옮기는 값과 담아 둘 자리를 전부 지불한 뒤에 버리는 셈이 된다. 데이터가 늘어날수록 버리는 몫만 커진다.

쿼리는 조건을 데이터가 있는 쪽으로 보낸다. PostgreSQL 의 집계 함수는 여러 행을 받아 결과 하나를 셈하므로, 백만 행을 세는 쿼리도 돌아오는 것은 숫자 한 줄이다.

## 📊 비교: 쿼리라고 부르는 것들

| 어디서 | 무엇에 묻나 | 어떻게 적나 |
|---|---|---|
| **SQL** | 표에 담긴 행 | `SELECT ... WHERE ...` |
| **DynamoDB `Query`** | 열쇠로 나뉜 항목 | 파티션 열쇠 값 하나 (+ 정렬 열쇠 범위) |
| **PromQL** | 시계열 | `http_requests_total{job="prometheus"}` |
| **쿼리 스트링** | 서버에 넘길 조건 | 주소의 `?q=text` |

## 💡 실제 사례

- **검색 결과 화면** — 주소의 `?q=` 에 적힌 조건이 서버를 거쳐 저장소에 물을 쿼리가 된다.
- **감시 대시보드** — 그래프 한 칸이 PromQL 식 하나다. 시계열을 골라 실시간으로 집계한다.
- **열쇠로 묻는 API** — DynamoDB 의 `Query` 는 파티션 열쇠 값 하나를 받아 그 열쇠의 항목을 모두 돌려준다.

## 🚫 흔한 오해

- **쿼리는 SQL 을 말한다** — SQL 은 쿼리를 적는 여러 말 중 하나다. PromQL 식도, DynamoDB 의 `Query` 호출도, 주소의 `?q=` 도 같은 자리를 차지한다.
- **주소의 물음표 뒤는 그냥 파라미터다** — 표준이 그 부분을 query 라고 부른다. URL 표준은 `https://localhost:8000/search?q=text#hello` 를 쪼개면서 `q=text` 를 query 로 적어 두었다.
- **무엇이든 쿼리로 물으면 된다** — 조건을 걸 문법이 없는 저장소도 있다. 열쇠-값 저장소에서 값으로 찾으려면 열쇠를 훑어야 하고, DynamoDB 의 `Query` 도 파티션 열쇠 값을 정확히 하나 줘야 시작한다.

## 🚨 주의사항

- **사용자가 적은 값을 쿼리 문장에 이어 붙이지 않는다.** OWASP 는 SQL Injection 을 클라이언트가 넣은 입력 데이터를 통해 SQL 쿼리를 끼워 넣는 공격으로 정의한다. 입력이 문장의 일부가 되면 쿼리를 적는 사람이 바뀐다.
- **주소의 조건도 손으로 이어 붙이지 않는다.** 값에 `&` 나 공백이 들어가면 조건의 경계가 깨진다. MDN 은 이 값을 다룰 때 `URLSearchParams` 로 넘기라고 안내한다.

## 📝 정리

**"필요한 것만 적어 보내는 그 쪽지"** 라고 읽으면 된다. 적는 말은 SQL, PromQL, 주소의 물음표 뒤처럼 저장소마다 다르지만 그 자리는 하나다. 거르고 더하는 일을 데이터가 있는 곳에 맡기는 것이 쿼리로 얻는 것이다.

## 🧒 열 살에게

심부름 쪽지에는 사 올 것만 적지, 어느 가게 몇 번째 칸에서 집으라고까지는 안 적지? 그렇게 적어 보내면 필요한 것만 담아 오니까 짐이 가벼워. 다 들고 와서 집에서 고르면 무거운 것만 실컷 나른 셈이야.

## ❓ 이해했는지

- 주소에 검색어가 이미 적혀 있는데 저장소에 쿼리를 또 보내는 이유는 → 그림
- 백만 행에서 열 건만 필요한데 전부 받아 와서 거르면 무엇이 문제인가 → 해결하는 문제
- Redis 에 담아 둔 값을 조건으로 골라내려 할 때 무엇에 막히나 → 흔한 오해

## 🔗 관련 용어

- [[SQL]] — 쿼리를 적는 가장 널리 쓰이는 말. 쿼리와 같은 말은 아니다
- [[URL]] — 물음표 뒤가 쿼리 스트링으로 불리는 자리
- [[Key-Value Store]] — 쿼리 대신 열쇠 하나로 꺼내는 쪽
- [[Index]] — 같은 쿼리를 훨씬 덜 읽고 답하게 하는 장치
- [[DB]] — 쿼리를 받아 답하는 상대

---

**출처**

- https://www.postgresql.org/docs/current/queries-overview.html (PostgreSQL Documentation — Chapter 7. Queries, Overview)
- https://www.postgresql.org/docs/current/tutorial-agg.html (PostgreSQL Documentation — 2.7. Aggregate Functions)
- https://url.spec.whatwg.org/ (URL Standard — WHATWG)
- https://developer.mozilla.org/en-US/docs/Web/API/URL/search (URL: search property — MDN)
- https://prometheus.io/docs/prometheus/latest/querying/basics/ (Querying basics — Prometheus Docs)
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html (Querying tables in DynamoDB)
- https://owasp.org/www-community/attacks/SQL_Injection (SQL Injection — OWASP)
