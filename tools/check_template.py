#!/usr/bin/env python3
"""단어 노트가 docs/TERM-TEMPLATE.md 를 지켰는지 검사한다.

읽기만 한다. 어떤 파일도 고치지 않는다.

    python3 tools/check_template.py content/네트워크/DNS.md
    python3 tools/check_template.py content/보안/JWT.md

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

def check_flow(rows: list[str], where: str, bad: list[str]) -> None:
    low, high = FLOW_RANGE
    if not low <= len(rows) <= high:
        bad.append(f"{where}: 흐름 마디가 {len(rows)}개다 ({low}~{high})")
    for row in rows:
        if "::" not in row:
            continue
        name = row.lstrip("< ").split("::")[0].strip()
        if len(name) > NAME_MAX:
            bad.append(f"{where}: 이름이 {len(name)}자다 ({NAME_MAX}자 이내) — {name}")


def check_compare(rows: list[str], where: str, bad: list[str]) -> None:
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


def check_layer(rows: list[str], where: str, bad: list[str]) -> None:
    low, high = LAYER_RANGE
    if not low <= len(rows) <= high:
        bad.append(f"{where}: 층이 {len(rows)}개다 ({low}~{high})")


SHAPE_CHECK = {"흐름": check_flow, "대조": check_compare, "층": check_layer}


def check_diagram(lines: list[str], where: str, bad: list[str]) -> None:
    head = re.match(r"^(흐름|대조|층)\s*:\s*(.+)$", lines[0])
    if not head:
        bad.append(f"{where}: 첫 줄이 '모양: 질문' 이 아니다 — {lines[0][:30]}")
        return

    question = head.group(2).strip()
    if not ASKING.search(question):
        bad.append(f'{where}: 도해 제목이 물음이 아니다 — "{question}"')
    if not any(l.startswith("=") for l in lines[1:]):
        bad.append(f"{where}: '= 한 줄 결론' 이 없다")

    SHAPE_CHECK[head.group(1)]([l for l in lines[1:] if not l.startswith("=")], where, bad)


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
    items = re.findall(r"^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$", body, re.M)
    bullets = len(re.findall(r"^\s*-\s+", body, re.M))
    low, high = MYTH_RANGE
    if not low <= len(items) <= high:
        bad.append(f"흔한 오해가 {len(items)}개다 ({low}~{high}, `- **틀린 말** — 실제로는` 형식)")
    if bullets > len(items):
        bad.append(f"흔한 오해 {bullets - len(items)}줄이 '**틀린 말** —' 형식이 아니다")


def check_selfcheck(body: str, bad: list[str]) -> None:
    asks = [
        l.strip().lstrip("-").strip()
        for l in body.split("\n")
        if re.match(r"^\s*-\s+", l)
    ]
    if len(asks) != CHECK_COUNT:
        bad.append(f"확인 질문이 {len(asks)}개다 ({CHECK_COUNT}개)")
    for ask in asks:
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


def check_summary(body: str, bad: list[str]) -> None:
    sentences = [s for s in re.split(r"(?<=다)\.\s*", body) if s.strip()]
    if len(sentences) > SUMMARY_MAX:
        bad.append(f"정리가 {len(sentences)}문장이다 ({SUMMARY_MAX}문장 이내)")


def check(path: str) -> list[str]:
    # macOS 는 한글을 자모로 풀어 쓴 NFD 로 저장하는 자리가 많다. 눈으로는 같은
    # "📝 정의" 인데 바이트가 달라서, 정규화 없이 비교하면 멀쩡한 노트에
    # "필수 섹션이 없다" 가 스무 건 넘게 쏟아진다. build.py 는 이미 NFC 로 맞춘다.
    text = unicodedata.normalize("NFC", open(path, encoding="utf-8").read())
    title, sections = split_sections(text)
    body_of = {canonical(h): b for h, b in sections if canonical(h)}
    bad: list[str] = []

    check_structure(title, sections, bad)
    check_definition(body_of.get("📝 정의", ""), bad)
    check_figure(body_of.get("🖼️ 그림으로 보기", ""), bad)
    check_myths(body_of.get("🚫 흔한 오해", ""), bad)
    check_summary(body_of.get("📝 정리", ""), bad)
    check_selfcheck(body_of.get("❓ 이해했는지", ""), bad)
    check_related(body_of.get("🔗 관련 용어", ""), bad)

    for head, body in sections:
        for i, lines in enumerate(diagrams(body)):
            check_diagram(lines, f"{head} 도해{i + 1}", bad)

    if "```mermaid" in text:
        bad.append("mermaid 를 쓰고 있다 — 모바일에서 못 읽는다. 도해로 바꿀 것")

    return bad


# ---------------------------------------------------------------- CLI

def say(line: str) -> None:
    sys.stdout.write(line + "\n")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        sys.stderr.write(f"쓰는 법: {argv[0]} <노트.md> [노트.md ...]\n")
        return 2

    failed = 0
    for raw in argv[1:]:
        path = os.path.expanduser(raw)
        name = os.path.basename(path)
        try:
            bad = check(path)
        except OSError as exc:
            say(f"✗ {name} — 읽을 수 없다: {exc}")
            failed += 1
            continue

        if not bad:
            say(f"✓ {name}")
            continue

        failed += 1
        say(f"✗ {name} — {len(bad)}건")
        for line in bad:
            say(f"    {line}")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
