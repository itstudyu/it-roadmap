# 디자인·UX 검수 루틴 설계

작성 2026-08-16 · 상태 **승인 대기** · 아직 아무것도 만들지 않았다

---

## 결론 먼저

요청은 "루틴이 taste-skill 과 impeccable 로 모바일/랩톱 디자인·UX·애니메이션을
검수하고 개선한다" 였다. 조사해 보니 **그대로는 안 된다.** 세 가지 벽이 있다.

| 벽 | 사실 |
|---|---|
| 클라우드 루틴은 **화면을 볼 수 없다** | 브라우저도 디스플레이도 없다. impeccable 의 핵심 절차가 "만들고 → 데스크톱·모바일 스크린샷 → 보이는 걸 고친다" 인데 그 눈이 없다 |
| **taste-skill 은 이 앱에 안 맞는다** | 스킬 첫 줄이 스스로 범위를 긋는다: 랜딩·포트폴리오·리디자인용, "not dashboards, not data tables, **not multi-step product UI**". 이 앱이 정확히 그 multi-step product UI 다 |
| 디자인 자동 push 는 **단어 자동 push 와 위험도가 다르다** | 단어는 파일을 *더한다*. 디자인은 `css/app.css` 3071줄을 *고친다*. 선택자 하나 잘못 건드리면 전 화면이 깨지고, 그대로 서비스 워커 캐시에 박힌다. `check_template.py` 같은 판정기가 CSS 에는 없다 |

그래서 **"루틴이 디자인을 고친다"가 아니라 "루틴이 정찰하고 사람이 고친다"** 로
설계를 바꿔 제안한다. 클라우드는 정찰병, 로컬 세션이 외과의다.

---

## 1. 조사해서 확인한 것

### 1.1 impeccable — 적합. 단, 23개 명령 중 일부만

`~/.claude/plugins/cache/impeccable/4.1.1` · Apache 2.0 · 저자 Paul Bakaus.

명령을 클라우드 실행 가능 여부로 갈라 보면 이렇다.

| 클라우드에서 되는 것 | 눈이 필요해서 안 되는 것 |
|---|---|
| `audit` (a11y·성능·반응형 정적 점검) | `polish` — "마지막 육안 점검" 이 정의 |
| `critique` (휴리스틱 채점 UX 리뷰) | `live` — 브라우저에서 요소 찍어 변형 생성 |
| `adapt` (기기·화면 크기 대응, 코드 판독 가능) | `bolder` / `quieter` / `delight` — 인상 판단 |
| `harden` (에러·엣지·i18n) | `colorize` / `typeset` / `layout` — 봐야 안다 |
| `clarify` (UX 문구·라벨·에러 메시지) | `animate` — 타이밍은 눈으로 잰다 |

**결론: `audit` · `critique` · `clarify` 셋이 클라우드의 몫.** 나머지는 로컬.

이 프로젝트에는 이미 `DESIGN.md` 344줄이 있다 (impeccable `document` 산출물로 보인다).
이건 굉장한 자산이다 — 감사의 **계약서** 가 되어준다. 44px 터치 영역, `100dvh`,
`transform`/`opacity`/`filter` 만 애니메이션, `safe-area-inset-bottom`, 입력 16px,
색만으로 뜻 전달 금지, `transform` 이 자식 `fixed` 를 데려가는 함정까지 전부 적혀 있다.

### 1.2 taste-skill — 부적합. 쓰지 말자

`~/.claude/plugins/cache/taste-skill/1.0.0` · MIT · 저자 Leonxlnx.

세 갈래(`design-taste-frontend`, `v1`, `gpt-taste`) 전부 요구하는 스택이 이렇다.

- React / Next.js, Server Components
- Tailwind CSS v3/v4
- GSAP ScrollTrigger (핀·스크럽·카드 스택)
- `@phosphor-icons/react` 또는 `@radix-ui/react-icons`
- Satoshi / Cabinet Grotesk / Outfit / Geist

이 앱은 **바닐라 JS · 빌드 없음 · 자체 호스팅 서브셋 폰트 · 오프라인 우선** 이다.
그 결정은 이미 내렸고 이유가 있었다. taste-skill 을 따르면 그걸 전부 되돌린다.
게다가 `gpt-taste` 는 "히어로는 시네마틱 센터", "섹션마다 `py-32 md:py-48`",
"무한 마퀴", "카드 스태킹" 을 요구한다 — **랜딩 페이지 문법이다.**
단어를 읽는 앱에 넣으면 그냥 망가진다.

건질 것은 원칙 몇 줄뿐이다: AI 보라색 금지, 액센트 1개, 중앙 정렬 편향 깨기,
로딩·빈 상태·에러 상태를 반드시 만들 것. 그런데 **그 원칙들은 이미 `DESIGN.md` 에
더 구체적으로 들어 있다.** "브랜드 색을 따로 두지 않았다 — 정답 초록과 오답 빨강이
이미 자리를 차지했으므로" 는 "액센트 1개" 보다 훨씬 강한 규칙이다.

> **제안: taste-skill 은 이번 루틴에서 뺀다.** 넣으면 DESIGN.md 와 싸운다.
> 다만 이건 되돌릴 수 있는 결정이다 — 나중에 별도 랜딩 페이지를 만들 일이 생기면
> 그때가 taste-skill 의 자리다.

### 1.3 정적 규칙 감사는 지금 **아무것도 못 잡는다**

계획을 쓰기 전에 시험 삼아 돌려봤다. 결과가 계획을 바꿨다.

| 점검 | 결과 |
|---|---|
| `100vh` 사용 (DESIGN.md 는 `100dvh` 만 허용) | 0건 |
| `transition` 이 `width`/`height`/`padding` 을 건드림 | 0건 |
| `app.css` 의 raw hex | 2건 — 둘 다 `mask-image` 라 정당함 |
| `safe-area-inset` | 4곳 적용 |
| `prefers-reduced-motion` | 전역 리셋이 `@keyframes` 9개를 전부 덮음 |

**코드가 이미 깨끗하다.** 그러니 grep 규칙만으로 짠 루틴은 매주 "위반 0건" 을
출력하는 장식품이 된다. 규칙 검사는 *회귀 방지 철조망* 으로만 값어치가 있고,
루틴의 진짜 값어치는 **판단** 에서 나와야 한다.

### 1.4 클라우드에서 스킬을 쓸 수 있는가 — 경로는 있다, 미검증

기존 트리거 설정을 읽어보니 모든 트리거에 이 두 필드가 있다.

```
"enabled_plugins": [],
"extra_marketplaces": []
```

즉 **마켓플레이스를 붙여 플러그인을 설치하는 경로가 API 에 존재한다.**
저장소에 스킬을 통째로 베껴 넣는(vendoring) 것보다 훨씬 깨끗하다.

- impeccable → `https://github.com/pbakaus/impeccable.git` (plugin: `impeccable`)
- `budget-ios` 루틴이 `allowed_tools` 에 `Agent` 를 쓰고 있다 → **서브에이전트는 확실히 된다**
- `Skill` 이 유효한 `allowed_tools` 값인지는 **아직 아무도 안 써봤다**

이건 추측으로 넘어갈 수 없다. 0단계 탐침으로 측정한다 (§5).

---

## 2. 설계 — 2층 구조

```
┌─ 클라우드 (주 1회, 자동) ─────────────────────────┐
│ design-audit 루틴                                 │
│   DESIGN.md 를 계약서로 읽고                       │
│   css/js/index.html 를 감사한다                    │
│   impeccable audit · critique · clarify            │
│      ↓                                             │
│   docs/design-audit-YYYY-MM-DD.md  (main 에 push)  │
│   — 심각도순 지적 목록 + 근거 file:line + 제안      │
└────────────────────────────────────────────────────┘
                      ↓  안건을 넘긴다
┌─ 로컬 (사람이 있을 때) ───────────────────────────┐
│ 감사 보고서를 열고                                 │
│ /impeccable polish · animate · layout · live       │
│ 실제 브라우저로 iPhone 390x844 + 랩톱에서 확인      │
│ 고치고 커밋                                        │
└────────────────────────────────────────────────────┘
```

**클라우드는 무엇을 볼지 정해주고, 로컬은 보고 고친다.**
매주 "이번 주 디자인 안건 5건" 이 저장소에 쌓이는 구조다.

### 왜 이렇게 나누나

루틴이 CSS 를 직접 고쳐 main 에 밀면, 검증 없이 바뀐 화면이
**설치된 PWA 캐시로 바로 들어간다.** 되돌리려면 되돌리는 커밋 + `CACHE_VERSION`
재계산 + 재배포가 필요하다. iPhone 하나 보자고 만든 앱인데 그 앱이 깨진 채로
며칠 갈 수 있다. 단어는 이상하면 그 단어만 이상하지만, CSS 는 전부가 이상해진다.

---

## 3. 루틴 사양

| 항목 | 값 | 근거 |
|---|---|---|
| 이름 | `design-audit` | |
| cron | `0 15 * * 5` = **토요일 00:00 KST** | 금요일 `vocab-related` 직후, 월요일 `vocab-roadmap` 과 이틀 간격 |
| 주기 | 주 1회 | 코드가 깨끗해서 매일 볼 게 없다 |
| model | `claude-opus-5` | 기존 vocab 루틴과 동일 |
| `allowed_tools` | `Bash, Read, Write, Edit, Glob, Grep` + (탐침 통과 시) `Skill`, `Agent` | **WebSearch/WebFetch 는 뺀다** — 감사는 저장소 안에서 끝난다 |
| `enabled_plugins` | `impeccable` (탐침 통과 시) | |
| `extra_marketplaces` | `https://github.com/pbakaus/impeccable.git` | |
| MCP 커넥터 | **전부 뗀다** | vocab 루틴에 Canva·Figma·Gmail·Slack 등 8개가 붙어 있는데 이 작업엔 하나도 필요 없다 |
| 프롬프트 | `tools/DESIGN-ROUTINE-PROMPT.md` 를 저장소에서 읽는다 | vocab 루틴과 같은 방식 — 트리거를 안 건드리고 프롬프트를 고칠 수 있다 |

### 쓰기 권한 — 여기가 승인 필요 지점

| 대상 | 권한 | |
|---|---|---|
| `docs/design-audit-*.md` | **main 직 push 허용** | 새 파일만 더한다. 되돌릴 것도 없다 |
| `css/**`, `js/**`, `index.html` | **금지** | ← 여기가 요청과 다른 부분 |
| `DESIGN.md` | 금지 | 계약서를 피감사자가 고치면 감사가 아니다 |

단어 루틴 때는 "PR 말고 자동 push" 로 정하셨고 그건 맞는 판단이었다.
여기서는 위험 계산이 다르다는 것만 말씀드린다 — **결정은 §6 에서 고르시면 된다.**

---

## 4. 새로 만들 파일

### 4.1 `tools/DESIGN-ROUTINE-PROMPT.md` — 루틴 본문

담을 것:

1. **계약서 읽기** — `DESIGN.md` 전문. 이게 유일한 판단 기준이다.
   "내 취향에 안 맞는다" 는 지적이 아니다. "DESIGN.md 8번 규칙과 어긋난다" 가 지적이다.
2. **감사 범위** — `css/app.css`, `css/tokens.css`, `js/screens.js`,
   `js/quiz-screens.js`, `js/recall.js`, `js/ui.js`, `index.html`, `mockups/`
3. **impeccable 사용법** — `audit` → `critique` → `clarify` 순서.
   `polish`/`animate`/`live` 는 **호출 금지** (눈이 없으므로 결과가 거짓이 된다)
4. **모바일 우선 관점 못 박기** — 기준 뷰포트 390x844. 랩톱은 768px 이상 분기만 확인.
   DESIGN.md 가 이미 "이 앱은 손에 들고 쓰는 물건" 이라고 선언했으므로 그 순서를 지킨다
5. **지적 1건의 형식** —
   ```
   ### [심각] 하단 액션 바가 키보드 위에 겹친다
   근거   css/app.css:1544  DESIGN.md 「모바일 기준」 3번째 줄
   상황   검색 입력에 포커스 → iOS 키보드 → fixed 바가 키보드에 가림
   제안   visualViewport 로 바를 접는다 (코드 스케치)
   확인법 로컬에서 iPhone 시뮬레이터 세로, 검색 화면
   ```
   **"확인법" 이 필수다.** 루틴은 못 봤으므로 사람이 볼 방법을 반드시 남긴다
6. **금지** — 추측으로 지적하지 않는다. 근거 `file:line` 없는 항목은 버린다
7. **0건이면 0건이라고 쓴다** — 억지로 채우면 다음 주부터 아무도 안 읽는다
8. **커밋 순서** — vocab 루틴에서 이미 한 번 틀렸던 부분이라 그대로 가져온다:
   `git add -A` → `commit` → `pull --rebase` → `push`

### 4.2 `tools/check_design.py` — 회귀 철조망

§1.3 에서 지금 0건이라 확인한 규칙들을 **고정한다**. 값어치는 오늘이 아니라
누군가(사람이든 루틴이든) CSS 를 고친 다음에 나온다.

```
100vh 사용                         → 실패
transition 이 레이아웃 속성 포함     → 실패
tokens.css 밖의 raw hex            → 경고 (mask-image 예외 목록)
fixed 요소에 safe-area-inset 없음   → 경고
16px 미만 input font-size          → 실패
44px 미만 터치 타깃                 → 경고
@keyframes 인데 transform/opacity/filter 밖을 건드림 → 실패
```

`check_template.py` 와 같은 자리에 두고 로컬에서도 돌린다.

### 4.3 `docs/design-audit-YYYY-MM-DD.md` — 산출물

주 1회 한 장. `logs/` 가 아니라 `docs/` 인 이유는 이게 실행 기록이 아니라
**읽으라고 만든 문서** 이기 때문이다.

---

## 5. 0단계 — 탐침 (만들기 전에 반드시)

`run_once_at` 짜리 일회용 트리거 하나로 다섯 개를 한 번에 잰다.
아무것도 커밋하지 않고 측정 결과만 출력한다.

| # | 재는 것 | 실패하면 |
|---|---|---|
| P1 | `enabled_plugins` / `extra_marketplaces` 를 create 가 받는가 | 저장소에 `.claude/skills/impeccable/` 로 vendoring (3.4MB, Apache 2.0, 공개 저장소라 라이선스 고지 필요) |
| P2 | `Skill` 이 유효한 `allowed_tools` 값인가 | impeccable 의 `reference/audit.md`·`critique.md` 본문을 프롬프트에 직접 인용 |
| P3 | `github.com` 클론이 되는가 | **이미 우려가 있다** — vocab 루틴에서 egress 대부분 차단됨을 측정했다 (`tools/sources.allowlist.md` ⚠️ 항목). 막히면 P1 실패와 같은 처리 |
| P4 | `node` 가 있는가 | impeccable 은 `scripts/context.mjs` 를 세션당 1회 요구한다. 없으면 스킬을 규약대로 못 쓴다 |
| P5 | headless 브라우저 설치·구동이 되는가 | **되면 판이 바뀐다** — 스크린샷이 생기면 `polish`/`layout`/`animate` 까지 클라우드로 넘길 수 있다. 안 되면 이 설계 그대로 간다 |

**P5 는 기대하지 않는 게 좋다.** P3 이 막히면 npm 도 막혔을 확률이 높고,
Playwright 는 브라우저 바이너리를 따로 받는다. 다만 값이 크므로 재보기는 한다.

---

## 6. 결정해 주실 것 셋

### ① taste-skill 을 뺄까

- **A. 뺀다 (추천)** — 이 앱과 스택·장르가 정면으로 안 맞는다. DESIGN.md 가 더 낫다
- B. 원칙만 발췌해 프롬프트에 한 문단으로 넣는다
- C. 그래도 정식으로 넣는다

### ② 루틴이 CSS 를 직접 고칠까

- **A. 보고서만 (추천)** — 클라우드는 안건을 만들고, 고치는 건 로컬에서 눈으로 보며
- B. 브랜치까지 — `design/YYYY-MM-DD` 브랜치에 수정을 올리되 main 에는 안 댄다.
  아침에 diff 만 보면 되는 절충안
- C. main 직 push — 단어 루틴과 동일. **CSS 는 판정기가 없다는 점만 다시 말씀드린다**

### ③ 언제 돌릴까

- **A. 토요일 00:00 KST 주 1회 (추천)**
- B. 격주 — 코드가 깨끗해서 주 1회도 잦을 수 있다
- C. 다른 요일

---

## 7. 구현 순서 (승인 후)

1. 탐침 트리거 1회 실행 → §5 다섯 항목 측정, 결과를 이 문서에 추가
2. 측정 결과에 따라 스킬 조달 경로 확정 (마켓플레이스 / vendoring / 본문 인용)
3. `tools/check_design.py` 작성 + 현 코드에 돌려 0건 확인 (기준선 고정)
4. `tools/DESIGN-ROUTINE-PROMPT.md` 작성
5. 트리거 생성, `enabled: false` 로 두고 **수동 1회 실행**
6. 첫 보고서를 사람이 읽고 판정 — 쓸모 있으면 활성화, 없으면 프롬프트 수정 후 재실행
7. 2주 돌려보고 유지/폐기 결정

3~4번은 로컬 작업이라 지금 다른 작업 중인 것과 겹치지 않게 별도 세션에서 하면 된다.

---

## 8. 기존 것과 부딪히는 지점

- **`CACHE_VERSION`** — `css/app.css` 와 `js/*.js` 는 `sw.js` 의 `PRECACHE` 에 들어 있다.
  루틴이 CSS 를 고치는 선택(②-B/C)을 하면 **반드시 `tools/build.py` 를 같이 돌려야 한다.**
  안 그러면 설치된 앱에는 영원히 안 보인다. ②-A 는 `docs/` 만 건드리므로 해당 없음
- **vocab 루틴 3개가 지금 전부 `enabled: false` 다** (2026-08-16 13:02 에 꺼짐).
  디자인 루틴과 별개 사안이지만, 셋 다 꺼져 있으니 확인이 필요하다
- **요일 충돌 없음** — vocab 은 월·수·금, 디자인은 토. 같은 날 두 루틴이 main 에
  push 하는 일은 없다
