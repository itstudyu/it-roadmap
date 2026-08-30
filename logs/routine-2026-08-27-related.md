# 2026-08-27 · vocab-related (관련 용어 따라가기)

**후보 2개 중 1개 추가.** `lang--immutability` (Immutability).

지난 금요일(08-20)에는 미해소 후보가 0개였다. 그 뒤 로드맵·최신 용어 루틴이
넣은 편들과 사람이 몰아 넣은 편들로 저장소가 329편 → 633편이 되면서
후보가 다시 생겼다. **미리 0개라고 단정하지 말고 매번 세는 것이 맞다.**

## 어떻게 세었나

`content/` 아래 `.md` 635편 전부를 읽고, 각 편의 `## 🔗 관련 용어` 섹션에서
`[[...]]` 이름을 뽑아 기존 단어와 대조했다. 대조 축은 본문 3번 단계가 시키는 셋이다.

- 파일명
- H1 제목에서 괄호를 뺀 본체 (`# DNS (Domain Name System)` → `DNS`)
- H1 괄호 안 원어 (`Domain Name System`)

정규화는 NFKC → 소문자 → 공백/하이픈/밑줄/`·`/구두점 제거.

```
관련 용어 섹션이 있는 파일   635 / 635
고유 related 이름            531
그중 기존 단어로 해소된 것    529
자기 파일이 없는 이름           2
```

범위를 본문 전체의 `[[링크]]` 로 넓혀도 미해소는 셋뿐이었고, 늘어난 하나는
`content/IT_Expert_로드맵.md` 의 `[[용어]]` — 단어가 아니라 백로그 문서의
자리표시자다(지난 실행과 같다). 후보 아님.

## 후보와 판단

### 고른 것 — Immutability (프로그래밍, 38편 → 39편)

`content/프로그래밍/Functional Programming.md` 가 본문과 관련 용어 두 군데에서
`[[Immutability]]` 를 걸어 두는데 그 파일이 없었다. FP 노트가 "둘째 규칙은 값을
고치지 않는 것" 이라고 적고 짝으로 지목하는 개념이라, 눌러도 안 열리는 링크가
바로 그 자리에 있었다.

권 선택: 링크가 걸린 곳이 lang 권이고 lang 은 38편으로 상한(60) 아래다.

출처가 **세 도메인**에서 섰다.

- `pkg.go.dev` — `builtin` 이 `string` 을 "Values of string type are immutable."
  로 못 박는다. `strings` 의 `Replace` 가 "returns a copy of the string s with …",
  `Clone` 이 "guarantees to make a copy of s into a new allocation" 이다.
  뒤의 한 줄이 ✅ 장단점의 "내주는 것"(바꿀 때마다 자리를 새로 잡는다)을
  감이 아니라 문서의 문장으로 세워 줬다.
- `kotlinlang.org` — Collections overview 의 "a mutable collection doesn't have to
  be assigned to a `val`. Write operations with a mutable collection are still
  possible even if it is assigned to a `val`. The benefit … is that you protect
  the **reference** … from modification". 이 한 문단이 🚫 흔한 오해의 첫 항목
  ("못 바꾸게 선언하면 불변이다")을 통째로 지탱한다. Basic syntax 에서 `val`(한 번만
  대입하는 읽기 전용) 과 `var`(다시 대입 가능) 의 정의를 확인했다.
- `developer.android.com` — Data layer 의 "The data exposed by this layer should be
  immutable so that it cannot be tampered with by other classes, which would risk
  putting its values in an inconsistent state. **Immutable data can also be safely
  handled by multiple threads.**" 가 ⚠️ 해결하는 문제의 세 줄(복사·잠금·어긋남)을
  한 문장에 다 담고 있다. UI layer 는 어길 때 생기는 일을 "multiple sources of
  truth … data inconsistencies and subtle bugs" 로 적고, 상태를 `.copy()` 로
  새로 만들어 갈아 끼우는 예를 든다.

중복 확인: `immutability` / `불변` / `불변성` 으로 세 축 대조.
`Immutable Infrastructure`(인프라)·`Immutable Storage`(클라우드)·
`Object Versioning`(클라우드) 이 이름은 스쳤지만 서버·저장소에 적용한 별개 개념이라
관련 용어로 이어 두고 끝냈다. slug `lang--immutability` 도 lang 권 기존 slug 38개
어디와도 안 부딪힌다.

### 버린 것

| 후보 | 왜 버렸나 |
|---|---|
| **Materialized View** (`content/아키텍처/CQRS.md` 의 `[[Materialized View]]`) | **이미 있는 단어다.** `content/데이터베이스/View & Materialized View.md` 가 그 개념을 담고 있다. 기계 대조가 못 잡은 이유는 H1 이 `# View & Materialized View (뷰와 구체화 뷰)` 라서 정규화한 제목이 `viewmaterializedview` 가 되고 `materializedview` 와 안 겹치기 때문이다. 새로 쓰면 같은 개념이 db 권과 arch 권에 둘로 갈라진다. 게다가 db 권은 69편으로 상한(60) 초과라 제자리에 넣을 수도 없었다 |

즉 이번 미해소 2건 중 **하나는 진짜 빈칸, 하나는 링크 표기 문제**였다.

## 권별 단어 수

`build.py --dry-run` 시작 시점 (633편):

```
컴퓨터과학 기초 41   프로그래밍 38   네트워크 76   웹 개발 34
데이터베이스 69      아키텍처 패턴 48   보안·인증 84   클라우드 61
인프라·운영 80       개발 도구 32      AI·LLM 42     제품 관리 28
```

종료 시점 634편 — 프로그래밍만 38 → 39.

상한(60) 초과는 다섯 권 그대로다(네트워크·데이터베이스·보안·클라우드·인프라).

## 이번에 추가한 단어

| id | 파일 | 권 |
|---|---|---|
| `lang--immutability` | `content/프로그래밍/Immutability.md` | 프로그래밍 |

`check_template.py --strict` 첫 시도 통과.
`verify_new_terms.py --expect 1` — 빌드 제외 0건 · 633 → 634 (+1) · 템플릿 1/1.

`--expect` 를 2 가 아니라 1 로 부른 이유는 위 표대로 후보가 실제로 하나뿐이어서다.
공통 본문 "아무것도 못 넣었을 때" 문단의 취지에 따라 빈칸을 지어내지 않았다.

## 이 문서나 도구가 틀렸다고 느낀 점

### 1. 관련 용어의 죽은 링크를 아무도 안 잡는다 — 그리고 related 전략이 그 위에 서 있다

`[[Materialized View]]` 는 앱에서 눌러도 아무 데도 못 간다. 실재하는 단어를
가리키는데 **이름을 다르게 적어서** 죽은 링크다(제목이 `View & Materialized View`).
`check_template.py` 는 이걸 잡지 않고, `build.py` 도 조용하다. 그래서 이런 링크는

- 앱에서는 눌러도 반응이 없는 단추가 되고,
- 이 루틴에서는 **없는 빈칸으로 잘못 보고된다.**

이번엔 사람 눈으로 걸렀지만, 다음에 같은 꼴이 여럿 나오면 루틴이 이미 있는
개념을 다시 쓸 위험이 있다. 도구 쪽에 한 줄이면 될 일로 보인다 — 빌드가
`[[이름]]` 을 해소하면서 **부분 일치는 되는데 완전 일치가 안 되는 이름**을
"이거 말씀이신가요" 로 찍어 주는 것. `tools/` 는 안 고치고 기록만 남긴다.

### 2. related 전략은 "0개가 기본" 이 아니라 "저장소가 자랄 때만 후보가 생긴다"

지난 실행 기록이 "related 전략은 구조적으로 빈손이 기본값" 이라고 적었는데,
이번 결과를 보면 절반만 맞다. 새 단어를 쓰는 사람이 이미 있는 단어만 링크하는
경향은 그대로지만, 저장소가 329 → 633 으로 자라는 동안 **본문에서 짝으로
지목만 하고 파일은 안 만든 자리**가 두 개 생겼다. 후보 공급원은 마르지 않았다.
다만 공급 속도가 주 1회 실행보다 느리므로, 금요일 실행이 자주 빈손인 것은
정상으로 봐야 한다.

### 3. 프롬프트의 "회당 2개" 와 전략 문단의 "0개면 만들지 마라" 사이가 비어 있다

공통 본문은 "이번 실행에서 단어를 정확히 2개 추가한다" 로 시작하고, 6번은
`--expect 2` 를 박아 두고, 전략 문단은 "0개면 아무것도 만들지 마라" 로 끝난다.
**1개일 때 어떻게 하라는 말이 어디에도 없다.** 6번 마지막 괄호("--expect 를 실제
개수로 바꿔서 다시 검증해라")가 사실상 그 답이지만, 그건 "쓰고 나서 버렸을 때"
문맥에 붙어 있어서 "애초에 후보가 하나일 때" 로는 안 읽힌다. 한 줄이면 될 일이다
— "후보가 2개보다 적으면 있는 만큼만 넣고 `--expect` 를 그 수로 부른다".

### 4. 검사기는 이번에도 문제 없었다

`--strict` 첫 시도 통과. 이 편은 대조 도해가 둘(그림·해결하는 문제)이라
`|=|` 와 `||` 를 한 편에서 둘 다 쓰게 됐는데, 템플릿의 "✕ 칸 자기검사"
(왼쪽에 장점이 한 줄이라도 있으면 `|=|`) 가 판단 기준으로 그대로 작동했다.
가변 vs 불변은 둘 다 정당한 선택이라 `|=|`, "막지 않으면 vs 못 고치게 하면" 은
왼쪽이 실제로 곤란한 상태라 `||` 로 갈랐다. 이 갈림이 같은 편의 🚫 흔한 오해
("불변이 항상 낫다") 와 어긋나지 않는지도 눈으로 한 번 더 봤다.

### 5. 각본(`scenes/`) 격차는 이번에도 벌어졌다

08-23 기록이 지적한 그대로다. `scenes/` 의 각본은 629편에서 멈춰 있는데
단어는 이번에 634편이 됐다 — **다섯 편이 장면 컷 만화 없이 산다.** 루틴이
한 편 넣을 때마다 격차가 한 편씩 늘어난다. 지시에 없는 일이라 이번에도
건드리지 않았다. 사람이 셋 중 하나를 정할 일이다(08-23 기록의 목록 참조).
