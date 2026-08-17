# Isolation Level (격리 수준)

## 📝 정의

Isolation Level은 **동시에 도는 트랜잭션을 서로에게서 얼마나 가릴지 정하는 단계**다.

표준이 정한 단계는 넷이다 — READ UNCOMMITTED · READ COMMITTED · REPEATABLE READ · SERIALIZABLE. 단계마다 어떤 이상 현상을 허용하는지가 표로 정해져 있고, 어느 단계에서 시작하는지는 표준이 아니라 제품이 정한다. PostgreSQL 의 기본은 Read Committed 이고, MySQL InnoDB 의 기본은 REPEATABLE READ 다.

### 비유
열람실 칸막이 높이 — 낮으면 옆 사람이 쓰다 지운 글씨까지 보이고, 높이면 아무것도 안 보이는 대신 자리를 오래 붙잡아야 한다.

## 🖼️ 그림으로 보기

```도해
층: 수준을 올리면 무엇이 더 금지되나
READ UNCOMMITTED :: 확정 안 된 값까지 보인다. 더티 리드
READ COMMITTED :: 확정된 것만 보이지만, 다시 읽으면 값이 바뀐다
REPEATABLE READ :: 처음 읽은 시점의 스냅숏으로 계속 읽는다
SERIALIZABLE :: 새로 끼어든 줄과 직렬화 이상까지 막는다
= 아래로 갈수록 허용되는 이상 현상이 줄고, 그만큼 잠금과 재시도가 늘어난다
```

## ⚠️ 해결하는 문제

```도해
대조: 이상 현상 셋은 어떻게 다른가
가장 낮은 수준 || 가장 높은 수준
남의 미확정값 :: 그대로 읽힌다 || 안 보인다
같은 줄 재조회 :: 값이 바뀐다 || 그대로다
같은 조건 재조회 :: 줄이 늘어난다 || 늘지 않는다
= 어긋나는 방식이 셋으로 나뉘고, 수준이 어디까지 막을지를 정한다
```

동시성 때문에 조회가 어긋나는 방식은 한 가지가 아니다. PostgreSQL 문서는 이것들에 이름을 하나씩 붙여 둔다. 아직 커밋되지 않은 트랜잭션이 쓴 데이터를 읽는 것이 **더티 리드**, 앞서 읽은 데이터를 다시 읽었더니 그 사이에 커밋한 다른 트랜잭션 때문에 값이 달라진 것이 **반복 불가 읽기**, 같은 조건으로 질의를 다시 돌렸더니 조건을 만족하는 줄의 집합이 달라진 것이 **팬텀 읽기**다. 하나 더 있다. 커밋에 성공한 트랜잭션들의 결과가 그것들을 하나씩 차례로 돌린 어떤 순서와도 맞지 않는 **직렬화 이상**이다.

이름이 붙으면 "동시성 때문에 이상하다" 가 "이 조회는 팬텀을 허용한다" 로 바뀐다. 그래야 수준을 올릴지, 아니면 그 조회만 잠글지를 고를 수 있다.

## 📊 비교: PostgreSQL 과 MySQL InnoDB

| | PostgreSQL | MySQL InnoDB |
|---|---|---|
| 기본 수준 | Read Committed | REPEATABLE READ |
| READ UNCOMMITTED | Read Committed 처럼 동작 | 옛 버전을 읽는 더티 리드 |
| REPEATABLE READ 의 팬텀 | 허용하지 않는다 | 일반 `SELECT` 은 첫 읽기의 스냅숏을 본다 |
| SERIALIZABLE | 술어 잠금으로 감시. 막기보다 실패시킨다 | 일반 `SELECT` 을 `SELECT ... FOR SHARE` 로 바꾼다 |

네 단계를 요청할 수는 있지만 실제로 구별되는 수준은 제품마다 다르다. PostgreSQL 은 내부적으로 세 수준만 구현하고 있어서 Read Uncommitted 요청이 Read Committed 처럼 동작한다. 반대로 MySQL 의 READ UNCOMMITTED 는 옛 버전의 줄이 쓰일 수 있어 읽기가 정합하지 않고, 문서가 그것을 더티 리드라고 부른다.

## 💡 실제 사례

- **정산 보고서** — 여러 조회의 합계가 맞아야 하므로, 트랜잭션의 첫 읽기가 잡은 스냅숏을 끝까지 유지하는 수준을 쓴다.
- **같은 줄을 다투는 갱신** — REPEATABLE READ 에서 앞선 트랜잭션이 그 줄을 고치고 커밋했으면 내 트랜잭션은 되돌려진다. 문구가 `could not serialize access due to concurrent update` 다.
- **재시도 준비** — 높은 수준을 쓰는 애플리케이션은 직렬화 실패로 되돌려진 트랜잭션을 다시 시도할 준비가 되어 있어야 한다. PostgreSQL 문서가 그 수준들에 그렇게 못 박는다.

## 🚫 흔한 오해

- **SERIALIZABLE 이 가장 안전하니 항상 그걸 쓰면 된다** — 감시에 비용이 붙고, 직렬화 이상이 될 조건이 잡히면 트랜잭션이 실패한다. 실패한 것을 다시 시도하는 코드를 안 써두면 안전이 아니라 장애가 된다.
- **READ UNCOMMITTED 로 내리면 조금이라도 빨라진다** — PostgreSQL 에서는 그 요청이 Read Committed 처럼 동작한다. 네 단계를 다 받아주지만 내부적으로 구별되는 것은 세 수준뿐이다.
- **REPEATABLE READ 면 팬텀도 막힌다** — 표준은 그 수준에서 팬텀 읽기를 허용한다. PostgreSQL 은 자기 구현이 팬텀을 허용하지 않는다고 따로 밝히는데, 그건 표준이 보장해서가 아니라 그 제품이 그렇게 만들어져서다.

## 🚨 주의사항

- **기본값을 확인하고 시작한다.** PostgreSQL 은 Read Committed, MySQL InnoDB 는 REPEATABLE READ 다. 같은 코드를 두 제품에 올리면 같은 조회가 다르게 보인다.
- **MySQL 의 SERIALIZABLE 에는 조건이 붙는다.** `autocommit` 이 꺼져 있을 때 일반 `SELECT` 을 `SELECT ... FOR SHARE` 로 바꾼다. 그냥 조회라고 생각한 문장이 잠금을 걸게 된다.
- **PostgreSQL 의 SERIALIZABLE 은 막지 않고 실패시킨다.** 술어 잠금은 대기를 만들지 않아 데드락에도 끼지 않는다. 대신 조건이 잡히면 직렬화 실패가 나고, 그 트랜잭션은 되돌려진다.

## 📝 정리

Isolation Level 은 동시에 도는 트랜잭션이 서로를 얼마나 볼지 네 단계로 정해 둔 것이다. 단계마다 더티 리드 · 반복 불가 읽기 · 팬텀 읽기 중 무엇을 허용하는지가 정해져 있고, 올릴수록 허용은 줄고 잠금과 재시도는 늘어난다. 어느 단계에서 시작하는지는 표준이 아니라 제품이 정하므로, 무엇이 켜져 있는지부터 확인하고 시작한다.

## ❓ 이해했는지

- 같은 코드를 PostgreSQL 과 MySQL 에 올렸더니 같은 조회가 다르게 보인다. 왜 그런가 → 주의사항
- 수준을 가장 높이 올렸는데 오히려 장애가 났다. 무슨 일이 있었나 → 흔한 오해
- 한 트랜잭션 안에서 같은 줄을 두 번 읽었더니 값이 달라졌다. 지금 어느 단계에 있나 → 그림

## 🔗 관련 용어

- [[Transaction]] — 격리 수준은 이 묶음 하나하나에 걸리는 설정이다
- [[ACID]] — 네 글자 중 I 를 몇 단계로 지킬지 고르는 자리
- [[Concurrency]] — 이 수준이 다루려는 문제의 배경
- [[DB]] — 기본 단계를 제품이 정해서 내놓는 쪽

---

**출처**

- https://www.postgresql.org/docs/current/transaction-iso.html (PostgreSQL Documentation — Transaction Isolation)
- https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html (MySQL Reference Manual — Transaction Isolation Levels)
- https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html (MySQL Reference Manual — Consistent Nonlocking Reads)
