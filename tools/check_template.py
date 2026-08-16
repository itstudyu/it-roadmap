#!/usr/bin/env python3
"""단어 노트가 docs/TERM-TEMPLATE.md 를 지켰는지 검사한다.

읽기만 한다. 어떤 파일도 고치지 않는다.

    python3 tools/check_template.py content/네트워크/DNS.md
    python3 tools/check_template.py content/            # 폴더째, 아래의 .md 전부
    python3 tools/check_template.py --strict content/   # 경고까지 실패로 센다

판정은 두 층이다.

    실패(✗)  고치기 전에는 못 내보낸다. 종료 코드 1.
    경고(△)  사람이 봐야 할 자리지만 막지는 않는다. 종료 코드에 안 걸린다.

경고를 따로 둔 이유는 tools/verify_new_terms.py 다. 자동 수집 루틴이 새벽에
새 노트에만 이 검사기를 돌리고, 0 이 아니면 그 밤의 결과를 통째로 버린다.
"이렇게 쓰면 더 좋다" 는 조언까지 실패로 만들면 루틴은 매번 빈손으로 끝난다.
그래서 새로 들인 규칙은 화면에서 내용이 사라지는 한 가지(접이식 칸 넘침)만
실패고 나머지는 전부 경고다. 사람이 전수로 훑을 때는 --strict 로 조인다.

규칙을 문서에만 적어두면 아무도 안 지킨다. 지킬 수 있게 만들려면
"어겼다"고 말해주는 게 있어야 한다. 그래서 체크리스트를 그대로 코드로 옮겼다.
"""

from __future__ import annotations

import os
import re
import sys
import unicodedata

REQUIRED = [
    "📝 정의",
    "🖼️ 그림으로 보기",
    "⚠️ 해결하는 문제",
    "💡 실제 사례",
    "🚫 흔한 오해",
    "📝 정리",
    "❓ 이해했는지",
    "🔗 관련 용어",
]

# 문서(docs/TERM-TEMPLATE.md)가 적어둔 선택 섹션과 같아야 한다. 한쪽에만 있는 항목이
# 생기면 문서를 지킨 노트가 검사기에서 떨어지거나 그 반대가 된다.
# "💻 코드 구현" 은 뺐다. 코드 덤프를 걷어내려고 만든 템플릿이 코드 자리를 열어두면 앞뒤가 안 맞고,
# 지금 그 자리를 쓰는 노트도 없다.
OPTIONAL = ["⚙️ 작동 원리", "📊 비교", "✅ 장단점", "🚨 주의사항"]

MYTH_RANGE = (2, 3)
CHECK_COUNT = 3
CHECK_MIN = 12  # 확인 질문 최소 길이. "DNS 란?" 같은 되묻기를 막는다.

GIST_MAX = 60      # 정의 첫 문단
NAME_MAX = 8       # 흐름 마디의 이름
CELL_MAX = 14      # 대조 한 칸
FLOW_RANGE = (4, 7)
LAYER_RANGE = (3, 5)
COMPARE_RANGE = (3, 4)
RELATED_RANGE = (3, 5)
SUMMARY_MAX = 3    # 정리 문장 수

# 물음표 없이도 묻는 한국어가 많다. "왜/어떻게/무엇" 으로 시작하거나
# "-나 / -가 / -까" 로 끝나면 묻고 있다고 본다.
ASKING = re.compile(r"(\?|나$|가$|까$|는가$|은가$|무엇|어떻게|왜|어디)")

DIA_BLOCK = re.compile(r"```도해\r?\n(.*?)\r?\n```", re.S)

# `- **앞부분** — 뒷부분` 한 줄. 흔한 오해와 실제 사례가 같은 모양을 쓴다.
# 굵은 앞부분이 눈이 걸리는 자리고, 대시가 거기까지가 이름이라고 알려준다.
ITEM_LINE = re.compile(r"^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$", re.M)

# ------------------------------------------------------------ 새로 들인 표기
#
# 도해는 Obsidian 에서 평문으로도 읽혀야 해서 기호를 아껴 쓴다. 여기 둘이 전부다.
#
#   @ 무엇        흐름의 반복 마디. "@ 누구 :: 무엇" 도 된다. 마지막 줄에만.
#   A |=| B       대조의 칸 이름 줄. 우열을 가리지 않는 중립 비교라는 뜻.
LOOP_MARK = "@"
EVEN_MARK = "|=|"

# 흐름의 "<" 응답 줄에 이 말이 있으면 대개 되돌아가는 마디다. 화살표를 아래로만
# 그리면 "다시 시도한다" 가 그냥 다음 단계처럼 보여서, 읽는 사람은 그 그림이
# 순환이라는 걸 놓친다. 그럴 때 쓰라고 "@" 를 만들었다.
REPEATING = ("다시", "반복", "되풀이", "주기", "매번", "계속", "루프")

# 층의 마디 이름이 시간을 가리키면 그건 층이 아니라 흐름이다. 층은 위아래로
# 쌓여 동시에 존재하는 것이고, 흐름은 앞뒤로 지나가는 것이다.
STAGING = ("먼저", "처음", "다음", "그다음", "이후", "이전", "나중", "마지막", "끝으로")
STEP_NAME = re.compile(r"^\d+\s*단계")

# ------------------------------------------------------------ build.py 에서 옮겨 적은 것
#
# 아래 세 뭉치는 tools/build.py 의 PINNED · SLOT_LABELS · MAX_SECTIONS 와 같은 값이다.
# import 하지 않고 베꼈다. build.py 는 남이 부르라고 만든 라이브러리가 아니라
# 나란히 선 스크립트고, 이 검사기는 자동 수집 루틴의 마지막 관문이다. 빌드 쪽이
# 반쯤 고쳐진 상태여도 관문은 혼자 서 있어야 한다 — 거기서 import 에러가 나면
# 노트가 멀쩡한지 아닌지도 못 본 채로 그 밤의 결과가 버려진다.
# 대신 저쪽 값을 고치면 여기도 같이 고쳐야 한다.

# 접이식 밖에 자기 자리가 있는 섹션들(build.py 의 PINNED).
PINNED_HEADS = {"📝 정의", "🖼️ 그림으로 보기", "❓ 이해했는지", "🔗 관련 용어", "📝 정리"}

# 한 편이 접어서 보여줄 수 있는 칸 수(build.py 의 MAX_SECTIONS).
MAX_PANELS = 6

# 접기 단추에 찍히는 이름(build.py 의 SLOT_LABELS + SECTION_MAP). 저자는 마크다운
# 제목으로 생각하고 쓰지만("→ 주의사항") 화면에 보이는 이름은 다르다("주의할 점").
# 둘 다 같은 자리를 가리키므로 둘 다 받는다 — 단, 그 섹션이 이 노트에 있을 때만이다.
# 없는 섹션의 화면 이름까지 통과시키면 검사기는 조용하고 앱에서는 단추가 아무 데도
# 못 가서, 저자는 자기가 적은 화살표가 죽은 줄 모른다.
SCREEN_LABELS = {
    "🎯 핵심 개념": "핵심 개념",
    "⚠️ 해결하는 문제": "왜 필요한가",
    "⚙️ 작동 원리": "어떻게 작동하나",
    "📊 비교": "무엇과 비교되나",
    "💡 실제 사례": "실제 사례",
    "✅ 장단점": "장단점",
    "🚫 흔한 오해": "흔히 잘못 아는 것",
    "🚨 주의사항": "주의할 점",
    "📝 정리": "한 번 더 정리",
}

# 답이 있을 수 없는 자리. 확인 질문이 자기 자신을 가리킬 수는 없고,
# 관련 용어는 다른 단어로 가는 문일 뿐 이 노트의 답을 담지 않는다.
# 앱도 이 둘에는 id 를 주지 않는다 — 두 표가 같은 이름을 담아야 한다.
NOT_ANSWERS = {"❓ 이해했는지", "🔗 관련 용어"}

# 그림 자리는 제목이 하나인데 부르는 이름이 여럿이다. 앱도 이 넷을 다 받는다.
FIGURE_ALIASES = {"그림", "그림으로 보기", "🖼️ 그림으로 보기", "도해"}

# 표제어가 아닌 문서(build.py 의 NOT_TERMS). 단어장에 안 실리니 템플릿도 안 지킨다.
# 폴더를 통째로 받았을 때만 건너뛴다 — 이름을 대고 부르면 그때는 검사한다.
NOT_TERMS = {"INDEX.md", "IT_Expert_로드맵.md"}


# ---------------------------------------------------------------- 자르기

def split_sections(text: str) -> tuple[str, list[tuple[str, str]]]:
    """H1 제목과 (H2 제목, 본문) 목록으로 나눈다. 코드펜스 안은 건드리지 않는다."""
    title, out, cur, fenced = "", [], None, False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            fenced = not fenced
        if not fenced and re.match(r"^#\s+", line):
            title = re.sub(r"^#\s+", "", line).strip()
            continue
        if not fenced and re.match(r"^##\s+", line):
            cur = [re.sub(r"^##\s+", "", line).strip(), []]
            out.append(cur)
            continue
        if cur:
            cur[1].append(line)
    return title, [(h, "\n".join(b).strip()) for h, b in out]


def canonical(head: str) -> str | None:
    """'📊 비교: DNS vs 유사 기술' -> '📊 비교'.

    부제는 허용한다. 무엇을 비교하는지 제목에서 알려주는 편이 낫고,
    앞부분만 정확하면 앱이 섹션을 찾는 데 지장이 없다.
    """
    for name in REQUIRED + OPTIONAL:
        if head == name or head.startswith(name + ":"):
            return name
    return None


def diagrams(body: str) -> list[list[str]]:
    """본문 안의 도해 블록들을 빈 줄 없는 줄 목록으로 돌려준다."""
    return [
        [l.strip() for l in block.split("\n") if l.strip()]
        for block in DIA_BLOCK.findall(body)
    ]


# ---------------------------------------------------------------- 모양별 검사

def check_flow(rows: list[str], where: str, bad: list[str], warn: list[str]) -> None:
    low, high = FLOW_RANGE
    # 반복 마디("@")도 화면에서는 한 칸을 차지한다. 세로 한 폭에 담기는지를 재는
    # 자리라 여기서 빼면 안 된다.
    if not low <= len(rows) <= high:
        bad.append(f"{where}: 흐름 마디가 {len(rows)}개다 ({low}~{high})")
    for row in rows:
        if "::" in row:
            # "<" 와 "@" 는 마디의 머리표지 이름이 아니다. 떼고 센다.
            name = row.lstrip("<@ ").split("::")[0].strip()
            if len(name) > NAME_MAX:
                bad.append(f"{where}: 이름이 {len(name)}자다 ({NAME_MAX}자 이내) — {name}")
        if not row.startswith("<"):
            continue
        said = [w for w in REPEATING if w in row]
        if said:
            warn.append(
                f"{where}: 응답 줄에 '{said[0]}' 가 있다 — 되돌아가는 마디면 "
                f"'@' 로 적어야 순환으로 보인다 — {row[:30]}"
            )


def check_compare(rows: list[str], where: str, bad: list[str], warn: list[str]) -> None:
    # warn 을 안 쓴다. 대조에서 새로 볼 것("|=|" 의 자리)은 check_marks 가 이미 봤고,
    # 셋의 손 모양은 SHAPE_CHECK 표에서 같이 불리므로 맞춰 둔다.
    #
    # 첫 줄은 칸 이름이라 비교 줄 수에서 뺀다. 흐름과 층은 세면서 대조만 안 셌더니
    # 390px 에서 열 줄짜리 대조가 그대로 통과했다.
    low, high = COMPARE_RANGE
    rest = len(rows) - 1
    if not low <= rest <= high:
        bad.append(f"{where}: 대조 줄이 {rest}개다 ({low}~{high})")
    if not rows or "::" in rows[0]:
        bad.append(f"{where}: 둘째 줄이 칸 이름이 아니다 ('왼쪽 || 오른쪽')")
        return
    for row in rows[1:]:
        cells = row.split("::")[-1].split("||")
        if len(cells) != 2:
            bad.append(f"{where}: '||' 로 두 칸이 안 나뉜다 — {row[:30]}")
            continue
        for cell in cells:
            if len(cell.strip()) > CELL_MAX:
                bad.append(f"{where}: 칸이 {len(cell.strip())}자다 ({CELL_MAX}자 이내) — {cell.strip()}")


def check_layer(rows: list[str], where: str, bad: list[str], warn: list[str]) -> None:
    low, high = LAYER_RANGE
    if not low <= len(rows) <= high:
        bad.append(f"{where}: 층이 {len(rows)}개다 ({low}~{high})")
    for row in rows:
        name = row.split("::")[0].strip()
        said = [w for w in STAGING if w in name]
        if said or STEP_NAME.match(name):
            warn.append(
                f"{where}: 층 이름이 순서를 가리킨다 — {name} "
                "(시간이 흐르면 층이 아니라 흐름이다)"
            )


SHAPE_CHECK = {"흐름": check_flow, "대조": check_compare, "층": check_layer}


def check_marks(shape: str, rows: list[str], where: str, warn: list[str]) -> None:
    """새로 들인 두 표기가 제자리에 있는지 본다.

    자리를 어겨도 그림은 그려진다 — 다만 엉뚱하게 그려진다. "@" 가 중간에 있으면
    앱은 마지막 하나만 반복 마디로 쓰고 나머지는 조용히 버리고, "|=|" 가 값 줄에
    있으면 그 줄은 두 칸으로 안 쪼개진다. 그래서 실패가 아니라 경고로 둔다.
    """
    loops = [i for i, r in enumerate(rows) if r.startswith(LOOP_MARK)]
    evens = [i for i, r in enumerate(rows) if EVEN_MARK in r]
    # "= 요약" 은 마디가 아니다. 반복 마디가 마지막인지 볼 때는 빼고 센다.
    steps = [i for i, r in enumerate(rows) if not r.startswith("=")]

    if loops and shape != "흐름":
        warn.append(f"{where}: '{LOOP_MARK}' 는 흐름의 반복 마디다 — {shape} 도해에는 쓰지 않는다")
    elif loops:
        if len(loops) > 1:
            warn.append(f"{where}: '{LOOP_MARK}' 줄이 {len(loops)}개다 — 반복 마디는 하나뿐이다")
        if steps and loops[-1] != steps[-1]:
            warn.append(f"{where}: '{LOOP_MARK}' 줄이 마지막 마디가 아니다 — '= 요약' 바로 앞에 둔다")

    if evens and shape != "대조":
        warn.append(f"{where}: '{EVEN_MARK}' 는 대조의 칸 이름 줄에만 쓴다 — {shape} 도해에 있다")
    elif evens and evens != [0]:
        warn.append(f"{where}: '{EVEN_MARK}' 가 칸 이름 줄(제목 다음 첫 줄)이 아닌 곳에 있다")


def check_diagram(lines: list[str], where: str, bad: list[str], warn: list[str]) -> None:
    head = re.match(r"^(흐름|대조|층)\s*:\s*(.+)$", lines[0])
    if not head:
        bad.append(f"{where}: 첫 줄이 '모양: 질문' 이 아니다 — {lines[0][:30]}")
        return

    question = head.group(2).strip()
    if not ASKING.search(question):
        bad.append(f'{where}: 도해 제목이 물음이 아니다 — "{question}"')
    if not any(l.startswith("=") for l in lines[1:]):
        bad.append(f"{where}: '= 한 줄 결론' 이 없다")

    check_marks(head.group(1), lines[1:], where, warn)
    SHAPE_CHECK[head.group(1)](
        [l for l in lines[1:] if not l.startswith("=")], where, bad, warn
    )


# ---------------------------------------------------------------- 섹션별 검사

def check_structure(title: str, sections: list[tuple[str, str]], bad: list[str]) -> None:
    found = {canonical(h) for h, _ in sections}
    if not title:
        bad.append("H1 제목이 없다")
    for need in REQUIRED:
        if need not in found:
            bad.append(f"필수 섹션이 없다 — ## {need}")
    for head, body in sections:
        if not body:
            bad.append(f"빈 섹션 — ## {head}")
        if canonical(head) is None:
            bad.append(f"템플릿에 없는 제목 — ## {head}")
    # 같은 제목이 두 번 나오면 빌드는 앞의 것을, 사람은 대개 뒤의 것을 본다.
    # 어느 쪽이 실리는지 알 수 없는 상태로 두지 않는다.
    heads = [h for h, _ in sections]
    for dup in sorted({h for h in heads if heads.count(h) > 1}):
        bad.append(f"같은 제목이 {heads.count(dup)}번 나온다 — ## {dup}")


def check_panels(sections: list[tuple[str, str]], bad: list[str]) -> None:
    """접이식으로 갈 섹션이 몇 칸인지 센다.

    앱은 접이식을 여섯 칸까지만 그린다(build.py 의 MAX_SECTIONS). 일곱 번째부터는
    잘려서 화면에 아예 닿지 못한다. 쓴 사람은 썼다고 믿고, 읽는 사람은 그런 게
    있었는지도 모른다. 조용히 사라지는 쪽이라 이것만은 경고가 아니라 실패다.

    정의·그림·확인 질문·관련 용어·정리는 접이식 밖에 자기 자리가 있어서 안 센다.
    "📚" 로 시작하는 제목도 빌드가 건너뛰므로 여기서도 뺀다.
    """
    panels = [
        h for h, _ in sections
        if canonical(h) not in PINNED_HEADS and not h.startswith("📚")
    ]
    if len(panels) > MAX_PANELS:
        names = ", ".join(panels)
        bad.append(
            f"접이식 섹션이 {len(panels)}개다 ({MAX_PANELS}칸까지만 화면에 나온다 — "
            f"{len(panels) - MAX_PANELS}칸이 잘린다) — "
            + (names if len(names) <= 60 else names[:60] + "…")
        )


def check_definition(body: str, bad: list[str]) -> None:
    if not body:
        return
    gist = re.sub(r"[*`]", "", body.split("\n\n")[0].strip())
    if len(gist) > GIST_MAX:
        bad.append(f"정의 첫 문단이 {len(gist)}자다 ({GIST_MAX}자 이내)")
    # 마침표 뒤에 글이 이어지면 이미 두 문장이다. >= 2 로 두면 세 문장부터 걸려서
    # "한 문장" 이라고 적어놓고 두 문장을 통과시킨다. 227편 전부 한 문장이라 조여도 오탐이 없다.
    if gist.count(". ") >= 1:
        bad.append("정의 첫 문단이 한 문장이 아니다")
    if "### 비유" not in body:
        bad.append("정의 안에 '### 비유' 가 없다")


def check_figure(body: str, bad: list[str]) -> None:
    found = diagrams(body)
    if len(found) != 1:
        bad.append(f"'그림으로 보기' 안의 도해가 {len(found)}개다 (1개)")
    if DIA_BLOCK.sub("", body).strip():
        bad.append("'그림으로 보기' 에 그림 말고 글이 있다")


def check_related(body: str, bad: list[str]) -> None:
    links = re.findall(r"^\s*-\s*\[\[([^\]]+)\]\]\s*(.*)$", body, re.M)
    low, high = RELATED_RANGE
    if not low <= len(links) <= high:
        bad.append(f"관련 용어가 {len(links)}개다 ({low}~{high})")
    for name, note in links:
        if len(note.strip().lstrip("—–-").strip()) < 4:
            bad.append(f"관련 용어에 관계 설명이 없다 — {name}")


def check_myths(body: str, bad: list[str]) -> None:
    """`- **틀리게 아는 말** — 실제로는` 형식인지 본다.

    굵은 앞부분이 없으면 그냥 설명 목록이다. 그러면 읽는 사람은
    자기가 뭘 잘못 알고 있었는지 모르고 지나간다.
    """
    items = ITEM_LINE.findall(body)
    bullets = len(re.findall(r"^\s*-\s+", body, re.M))
    low, high = MYTH_RANGE
    if not low <= len(items) <= high:
        bad.append(f"흔한 오해가 {len(items)}개다 ({low}~{high}, `- **틀린 말** — 실제로는` 형식)")
    if bullets > len(items):
        bad.append(f"흔한 오해 {bullets - len(items)}줄이 '**틀린 말** —' 형식이 아니다")


def check_example(body: str, warn: list[str]) -> None:
    """실제 사례도 `- **어디서** — 어떻게 쓰나` 형식인지 본다.

    굵은 앞부분과 설명 사이에 대시가 없으면 어디까지가 이름인지 눈이 못 자른다.
    훑어보는 사람은 굵은 글씨만 짚고 지나가는데, 그 뒤가 바로 붙어 있으면
    한 덩어리 문장으로 읽혀서 굵게 쓴 보람이 없다.

    오해 쪽과 달리 실패가 아닌 이유는, 지금 229편이 거의 다 대시 없이 쓰여 있어서다.
    한 편씩 고쳐 나가는 동안 자동 루틴이 멈추면 안 된다.
    """
    items = ITEM_LINE.findall(body)
    bullets = len(re.findall(r"^\s*-\s+", body, re.M))
    if bullets > len(items):
        warn.append(f"실제 사례 {bullets - len(items)}줄이 '**어디서** — 설명' 형식이 아니다")


def aim_of(ask: str) -> tuple[str, str]:
    """확인 질문 한 줄을 '물음' 과 '→ 뒤의 자리' 로 가른다.

    질문 안에 화살표가 또 있을 수 있으니(예: "요청 → 응답 사이") 마지막 것으로 자른다.
    앱도 같은 자리에서 자른다.
    """
    if "→" not in ask:
        return ask, ""
    q, at = ask.rsplit("→", 1)
    return q.strip(), at.strip()


def jump_targets(sections: list[tuple[str, str]]) -> set[str]:
    """확인 질문의 '→ 뒤' 가 가리킬 수 있는 이름들.

    앱은 공백을 지우고 견주므로 여기서도 지운다. 저자가 마크다운 제목을 그대로
    쓰든("주의사항"), 이모지까지 붙이든, 화면 이름표를 쓰든("주의할 점") 다 받는다.
    """
    names = set(FIGURE_ALIASES)
    for head, _ in sections:
        full = canonical(head)
        if (full or head) in NOT_ANSWERS:
            continue
        names.add(head)
        names.add(re.sub(r"^\S+\s*", "", head))  # 이모지를 뗀 제목
        if full:  # 부제가 붙은 제목("📊 비교: A vs B")은 본 이름으로도 받는다
            names.add(full)
            names.add(re.sub(r"^\S+\s*", "", full))
            if full in SCREEN_LABELS:  # 그 섹션이 있을 때만 화면 이름표를 받는다
                names.add(SCREEN_LABELS[full])
    return {re.sub(r"\s+", "", n) for n in names if n.strip()}


def check_selfcheck(body: str, targets: set[str], bad: list[str], warn: list[str]) -> None:
    asks = [
        l.strip().lstrip("-").strip()
        for l in body.split("\n")
        if re.match(r"^\s*-\s+", l)
    ]
    if len(asks) != CHECK_COUNT:
        bad.append(f"확인 질문이 {len(asks)}개다 ({CHECK_COUNT}개)")

    # "→ 답이 있는 자리" 가 없는 질문 수. 한 줄씩 세 번 말하면 시끄러워서 묶어 말한다.
    aimless = 0
    for line in asks:
        # 아래 규칙들은 화살표 뒤를 뺀 물음만 본다. 안 그러면 "→ 주의할 점" 이 붙는
        # 순간 길이가 늘고 문장 끝이 바뀌어서, 되묻기 검사가 통째로 안 걸리게 된다.
        ask, at = aim_of(line)
        if not at:
            aimless += 1
        elif re.sub(r"\s+", "", at) not in targets:
            warn.append(f"확인 질문이 없는 자리를 가리킨다 — → {at}")
        if len(ask) < CHECK_MIN:
            bad.append(f"확인 질문이 너무 짧다 — {ask}")
        # "X 란 무엇인가" 는 외웠는지만 확인된다. 이해했는지는 상황을 줘야 나온다.
        # 되묻기는 용어가 문장 맨 앞에 설 때만 성립한다. 앞에 상황을 깔아둔
        # "...하게 만드는 실수는 무엇인가" 는 되묻기가 아니라 적용 문제다.
        # 용어가 한 낱말이라는 법이 없다. \S 하나만 보면 "Circuit Breaker 란
        # 무엇인가" 처럼 띄어쓴 용어는 그냥 빠져나간다. 낱말 셋까지 받는다.
        # 다만 "무엇" 뒤가 길어지면 되묻기가 아니다 — "A와 B는 무엇이 다른가" 는
        # 비교를 묻는 좋은 질문이라 여기서 걸리면 안 된다. 그래서 끝을 붙들어 둔다.
        if re.match(r"^\S{1,20}(\s+\S{1,20}){0,2}\s*(란|이란|은|는|이|가)\s*(무엇|뭔가|뭐)[^?]{0,4}\??$", ask):
            bad.append(f"정의를 되묻는 질문이다 — {ask}")

    # 질문만 던져놓고 끝나면 회상 연습이 절반만 된다. 답의 절반은 접힌 칸 안에
    # 있어서, 스스로 답해본 사람이 맞았는지 확인할 길이 없다.
    if aimless:
        warn.append(f"확인 질문 {aimless}개에 '→ 답이 있는 자리' 가 없다")


def check_summary(body: str, bad: list[str]) -> None:
    sentences = [s for s in re.split(r"(?<=다)\.\s*", body) if s.strip()]
    if len(sentences) > SUMMARY_MAX:
        bad.append(f"정리가 {len(sentences)}문장이다 ({SUMMARY_MAX}문장 이내)")


def check(path: str) -> tuple[list[str], list[str]]:
    """(실패, 경고) 를 돌려준다. 실패만 종료 코드에 걸린다."""
    # macOS 는 한글을 자모로 풀어 쓴 NFD 로 저장하는 자리가 많다. 눈으로는 같은
    # "📝 정의" 인데 바이트가 달라서, 정규화 없이 비교하면 멀쩡한 노트에
    # "필수 섹션이 없다" 가 스무 건 넘게 쏟아진다. build.py 는 이미 NFC 로 맞춘다.
    text = unicodedata.normalize("NFC", open(path, encoding="utf-8").read())
    title, sections = split_sections(text)
    body_of = {canonical(h): b for h, b in sections if canonical(h)}
    bad: list[str] = []
    warn: list[str] = []

    check_structure(title, sections, bad)
    check_panels(sections, bad)
    check_definition(body_of.get("📝 정의", ""), bad)
    check_figure(body_of.get("🖼️ 그림으로 보기", ""), bad)
    check_example(body_of.get("💡 실제 사례", ""), warn)
    check_myths(body_of.get("🚫 흔한 오해", ""), bad)
    check_summary(body_of.get("📝 정리", ""), bad)
    check_selfcheck(body_of.get("❓ 이해했는지", ""), jump_targets(sections), bad, warn)
    check_related(body_of.get("🔗 관련 용어", ""), bad)

    for head, body in sections:
        for i, lines in enumerate(diagrams(body)):
            check_diagram(lines, f"{head} 도해{i + 1}", bad, warn)

    if "```mermaid" in text:
        bad.append("mermaid 를 쓰고 있다 — 모바일에서 못 읽는다. 도해로 바꿀 것")

    return bad, warn


# ---------------------------------------------------------------- CLI

def say(line: str) -> None:
    sys.stdout.write(line + "\n")


def notes(raw: str) -> list[str]:
    """인자 하나를 검사할 노트 목록으로 편다.

    폴더를 주면 그 아래 .md 를 전부 훑는다. 전수 점검을 셸의 find 로 넘기면
    이름에 공백이 든 파일이 두 토막 나는데, 이 저장소에는 그런 파일이 많다.

    무엇이 단어 노트인지는 build.py 와 같게 본다. 안 그러면 "content/ 전부 통과"가
    영영 못 오는 도장이 된다 — 목차와 로드맵은 템플릿을 지킬 이유가 없는 글이다.
    """
    path = os.path.expanduser(raw)
    if not os.path.isdir(path):
        return [path]
    found = []
    for here, dirs, names in os.walk(path):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for n in names:
            # 파일 이름도 NFC 로 맞춰 견준다. macOS 가 한글 이름을 NFD 로 적어 둬서
            # 그냥 비교하면 "IT_Expert_로드맵.md" 가 목록에 없는 이름이 된다.
            if n.endswith(".md") and unicodedata.normalize("NFC", n) not in NOT_TERMS:
                found.append(os.path.join(here, n))
    return sorted(found)


def report(path: str, strict: bool) -> tuple[bool, int, int]:
    """한 편을 검사하고 결과를 찍는다. (실패했나, 실패 건수, 경고 건수)"""
    name = os.path.basename(path)
    try:
        bad, warn = check(path)
    except OSError as exc:
        say(f"✗ {name} — 읽을 수 없다: {exc}")
        return True, 1, 0

    if not bad and not warn:
        say(f"✓ {name}")
        return False, 0, 0

    # --strict 는 경고도 막아 세운다. 사람이 전수로 훑을 때 쓴다.
    down = bool(bad) or (strict and bool(warn))
    counts = f"실패 {len(bad)}건" if bad else ""
    if warn:
        counts += (" · " if counts else "") + f"경고 {len(warn)}건"
    say(f"{'✗' if down else '△'} {name} — {counts}")
    for line in bad:
        say(f"    ✗ {line}")
    for line in warn:
        say(f"    △ {line}")
    return down, len(bad), len(warn)


def main(argv: list[str]) -> int:
    strict = "--strict" in argv[1:]
    args = [a for a in argv[1:] if a != "--strict"]
    if not args or any(a.startswith("-") for a in args):
        sys.stderr.write(f"쓰는 법: {argv[0]} [--strict] <노트.md | 폴더> [...]\n")
        return 2

    paths = [p for raw in args for p in notes(raw)]
    if not paths:
        # 빈 폴더를 받고 조용히 0 을 돌려주면 아무것도 안 본 것이 통과로 읽힌다.
        # 자동 루틴이 그 도장을 그대로 믿는다.
        sys.stderr.write(f"검사할 .md 가 없다: {' '.join(args)}\n")
        return 2

    files = failed = warned = bad_lines = warn_lines = 0
    for path in paths:
        down, nbad, nwarn = report(path, strict)
        files += 1
        failed += 1 if down else 0
        warned += 1 if nwarn else 0
        bad_lines += nbad
        warn_lines += nwarn

    # 한 편만 보는 자리(자동 루틴이 그렇다)에서 다 통과했으면 요약은 군더더기다.
    if files > 1 or bad_lines or warn_lines:
        say(
            f"\n{files}편 — 실패 {bad_lines}건 · 경고 {warn_lines}건"
            f"  (통과 {files - failed}편 · 걸린 {failed}편 · 경고 있는 편 {warned}"
            + (", --strict 라 경고도 걸린다)" if strict and warn_lines else ")")
        )

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
