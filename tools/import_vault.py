#!/usr/bin/env python3
"""Obsidian vault 를 repo 의 content/ 로 한 번 들여온다.

    python3 tools/import_vault.py --dry-run
    python3 tools/import_vault.py

vault 는 **읽기만 한다.** 쓰는 곳은 content/ 뿐이다.
이 도구는 이전용이라 한 번 쓰고 나면 다시 돌릴 일이 없다.
그래도 남겨둔다 — 무엇이 어떻게 바뀌었는지 나중에 확인할 데가 있어야 한다.

하는 일
  1. .md 를 content/ 로 복사한다 (폴더 구조 유지, skills/ 는 빼고)
  2. mermaid 를 도해로 옮긴다. 못 옮기는 건 지운다
  3. 지우고 나서 껍데기만 남는 섹션을 같이 지운다

왜 mermaid 를 버리나
  graph 는 가로로 넓어져 390px 에서 못 읽는다. mermaid.js 를 넣으면 1MB 가 붙고,
  넣어봐야 그 폭 문제는 그대로다. 세로 한 폭에서 읽히는 도해로 옮길 수 있는 것만
  옮기고 나머지는 버린다. 버린 것은 git 이 기억한다.
"""

from __future__ import annotations

import argparse
import collections
import os
import re
import sys

VAULT = os.path.expanduser(
    "~/Library/Mobile Documents/iCloud~md~obsidian/Documents/IT단어장"
)
DEST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content")

SKIP_DIRS = {".obsidian", "skills", ".git"}

MERMAID = re.compile(r"```mermaid\r?\n(.*?)\r?\n```", re.S)

# sequenceDiagram 의 메시지 한 줄:  CPU->>L1: 2. L1에서 찾기
SEQ_MSG = re.compile(r"^\s*(\w+)\s*(-->>|->>|-->|->)\s*(\w+)\s*:\s*(.+?)\s*$")
SEQ_ACTOR = re.compile(r"^\s*participant\s+(\w+)(?:\s+as\s+(.+?))?\s*$")

# graph 의 간선 한 줄:  Browser -->|도메인 조회| OSCache
GRAPH_EDGE = re.compile(
    r"^\s*(\w[\w\d_]*)\s*(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?"
    r"\s*-{2,3}>?\s*(?:\|([^|]*)\|)?\s*"
    r"(\w[\w\d_]*)\s*(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?\s*$"
)
GRAPH_NODE = re.compile(r"^\s*(\w[\w\d_]*)\s*[\[\(\{]\"?(.*?)\"?[\]\)\}]\s*$")

# 손으로 쓰는 도해는 4~7 마디로 줄이라고 템플릿에 적어뒀다. 여기는 다르다.
# 이건 이미 있는 그림을 살리는 일이라, 줄이라고 말할 저자가 없다.
# 12 를 넘으면 그때는 그림이 아니라 목록이라 버린다.
MAX_STEPS = 12
MIN_STEPS = 2

SUBGRAPH = re.compile(r"^\s*subgraph\s+\"?([^\"\[\]]+?)\"?\s*(?:\[.*\])?\s*$")
MAX_LAYERS = 6
MIN_LAYERS = 2


def clean_label(text: str) -> str:
    """mermaid 라벨을 사람이 읽는 한 줄로 만든다."""
    text = re.sub(r"<br\s*/?>", " ", text)
    text = re.sub(r'^["\']|["\']$', "", text.strip())
    # 라벨 앞머리의 장식 이모지는 뗀다. 도해에서 뜻을 나르는 건 글자와 자리다.
    text = re.sub(r"^[\U0001F300-\U0001FAFF☀-➿]️?\s*", "", text)
    text = re.sub(r"\s*-\s+", " · ", text)
    return re.sub(r"\s{2,}", " ", text).strip(" ·")


def shorten(text: str, limit: int) -> str:
    text = clean_label(text)
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def sequence_steps(lines: list[str]) -> list[tuple[bool, str, str]]:
    names = {}
    for line in lines:
        m = SEQ_ACTOR.match(line)
        if m:
            names[m.group(1)] = clean_label(m.group(2) or m.group(1))

    steps = []
    for line in lines:
        m = SEQ_MSG.match(line)
        if not m:
            continue
        src, arrow, _, text = m.groups()
        what = re.sub(r"^\d+[.)]\s*", "", clean_label(text))
        if not what:
            continue
        # 마디의 이름은 그 일을 "하는" 쪽이다. A->>B 에서 말하는 건 A 다.
        # 받는 쪽(B)을 이름으로 쓰면 "브라우저 :: 데이터 주세요" 처럼
        # 요청한 적 없는 쪽이 요청한 것처럼 읽힌다.
        # 점선 화살표(-->)는 관례적으로 응답이다.
        steps.append((arrow.startswith("--"), shorten(names.get(src, src), 18), shorten(what, 34)))
    return steps


def from_sequence(body: str, name: str) -> str | None:
    """sequenceDiagram -> 흐름 도해.

    시퀀스는 그 자체가 흐름이다. 되돌아오는 화살표(-->>)가 응답 구간이라
    도해의 `<` 표시와 그대로 맞아떨어진다.
    """
    steps = sequence_steps([l for l in body.split("\n") if l.strip()])
    if not MIN_STEPS <= len(steps) <= MAX_STEPS:
        return None

    # 도해의 `<` 는 길이 한 번 접히는 자리를 뜻한다. 응답이 뒤쪽에 몰려 있을 때만
    # 그 뜻이 맞는다. 요청과 응답이 번갈아 오가는 그림(CPU→L1→CPU→RAM…)에
    # `<` 를 줄마다 붙이면 접힌 데가 네 군데가 되어 접힘이라는 말이 무의미해진다.
    # 그럴 때는 표시를 떼고 그냥 순서대로 나열한다 — 내용은 그대로 남는다.
    first_back = next((i for i, s in enumerate(steps) if s[0]), None)
    folds_once = first_back is None or all(s[0] for s in steps[first_back:])

    out = [f"흐름: {name}, 무슨 순서로 오가나"]
    for back, who, what in steps:
        out.append(("< " if (back and folds_once) else "") + who + " :: " + what)
    return "\n".join(out)


def from_graph(body: str, name: str) -> str | None:
    """선형 사슬인 graph -> 흐름 도해. 분기가 있으면 포기한다."""
    lines = [l for l in body.split("\n") if l.strip()]
    if any(re.match(r"\s*(subgraph|classDef|linkStyle|style)\b", l) for l in lines):
        return None

    labels = {}
    for line in lines:
        m = GRAPH_NODE.match(line)
        if m:
            labels[m.group(1)] = clean_label(m.group(2))

    edges = []
    for line in lines:
        m = GRAPH_EDGE.match(line)
        if m:
            edges.append((m.group(1), clean_label(m.group(2) or ""), m.group(3)))
    if not MIN_STEPS <= len(edges) <= MAX_STEPS:
        return None

    outgoing = collections.Counter(a for a, _, _ in edges)
    if max(outgoing.values()) > 1:
        return None  # 분기. 흐름이 아니다

    steps = [(labels.get(edges[0][0], edges[0][0]), "")]
    for _, note, dst in edges:
        steps.append((labels.get(dst, dst), note))

    out = [f"흐름: {name}, 어떤 순서로 이어지나"]
    for who, note in steps:
        name = shorten(who, 18)
        out.append(name + " :: " + (shorten(note, 34) if note else name))
    return "\n".join(out)


def from_subgraphs(body: str, name: str) -> str | None:
    """subgraph 로 묶인 graph -> 층 도해.

    subgraph 는 "이것들은 한 덩어리다" 라는 뜻이고, 그게 곧 층이다.
    선을 다 살릴 수는 없지만 무엇이 무엇 안에 있는지는 그대로 남는다 —
    복잡한 graph 에서 사람이 실제로 읽어가는 것도 대개 그 묶음이다.
    """
    layers: list[tuple[str, list[str]]] = []
    current: tuple[str, list[str]] | None = None

    for line in body.split("\n"):
        if not line.strip():
            continue
        head = SUBGRAPH.match(line)
        if head:
            current = (clean_label(head.group(1).replace("_", " ")), [])
            layers.append(current)
            continue
        if re.match(r"^\s*end\s*$", line):
            current = None
            continue
        node = GRAPH_NODE.match(line)
        if node and current is not None:
            label = clean_label(node.group(2))
            if label:
                current[1].append(label)

    layers = [(name, nodes) for name, nodes in layers if name and nodes]
    if not MIN_LAYERS <= len(layers) <= MAX_LAYERS:
        return None

    out = [f"층: {name}, 어떻게 나뉘어 있나"]
    for name, nodes in layers:
        out.append(shorten(name, 24) + " :: " + shorten(" · ".join(nodes), 60))
    return "\n".join(out)


def convert(body: str, name: str) -> str | None:
    head = body.strip().split("\n")[0].strip().split()
    kind = head[0] if head else ""
    if kind == "sequenceDiagram":
        return from_sequence(body, name)
    if kind not in ("graph", "flowchart"):
        return None
    # 묶음이 있으면 층으로, 없으면 선형 흐름으로 본다
    return from_subgraphs(body, name) if "subgraph" in body else from_graph(body, name)


def strip_empty_sections(text: str) -> tuple[str, int]:
    """본문이 사라진 섹션을 제목째로 지운다.

    ## 🏗️ 구조 만 덩그러니 남는 것보다 아예 없는 편이 낫다.
    H3 만 줄줄이 남은 것도 마찬가지다 — 제목만 있고 읽을 게 없다.
    """
    parts = re.split(r"(?m)^(##\s+.+)$", text)
    if len(parts) < 3:
        return text, 0

    out, dropped = [parts[0]], 0
    for i in range(1, len(parts), 2):
        head, body = parts[i], parts[i + 1] if i + 1 < len(parts) else ""
        meat = re.sub(r"(?m)^#{3,}\s+.*$", "", body)      # H3 제목은 알맹이가 아니다
        meat = re.sub(r"(?m)^\s*[-*_]{3,}\s*$", "", meat)  # 구분선도 아니다
        if len(meat.strip()) < 12:
            dropped += 1
            continue
        out.append(head + body)
    return "".join(out), dropped


def title_of(text: str) -> str:
    """H1 에서 단어 이름만. '도해 제목은 물음이어야 한다' 는 규칙을 지키려면
    무엇에 대한 물음인지가 제목에 있어야 한다. 쉼표로 붙여 조사를 피한다."""
    m = re.search(r"^#\s+(.+)$", text, re.M)
    if not m:
        return "이것"
    return re.sub(r"\s*\(.*\)\s*$", "", m.group(1)).strip() or "이것"


def process(text: str, stat: collections.Counter) -> str:
    name = title_of(text)

    def swap(m: re.Match) -> str:
        stat["블록"] += 1
        dohae = convert(m.group(1), name)
        if dohae:
            stat["도해로"] += 1
            return "```도해\n" + dohae + "\n```"
        stat["버림"] += 1
        return ""

    text = MERMAID.sub(swap, text)
    text, dropped = strip_empty_sections(text)
    stat["빈 섹션"] += dropped
    return re.sub(r"\n{4,}", "\n\n\n", text).strip() + "\n"


def walk(root: str) -> list[str]:
    found = []
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        found += [os.path.join(base, f) for f in files if f.endswith(".md")]
    return sorted(found)


def blocked(args) -> bool:
    """이전이 이미 끝났는데 그냥 돌리려 하는가.

    2026-08-16 이후 content/ 의 노트는 전부 손으로 다시 썼다. 지금 이걸 돌리면
    vault 의 옛 판본이 229편을 덮어쓴다. 되돌릴 수는 있지만(git 이 갖고 있다)
    그 사실을 모른 채 돌리는 게 문제라서 앞을 막는다.
    """
    if args.dry_run or args.i_know_this_overwrites_content:
        return False
    sys.stderr.write(
        "이전은 이미 끝났다. 지금 돌리면 content/ 의 노트를 vault 의 옛 판본으로 덮어쓴다.\n"
        "무엇이 바뀌는지만 보려면 --dry-run 을 쓴다.\n"
        "정말 덮어쓰려면 --i-know-this-overwrites-content 를 붙인다.\n"
    )
    return True


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--vault", default=VAULT)
    ap.add_argument("--dest", default=DEST)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--i-know-this-overwrites-content", action="store_true")
    args = ap.parse_args(argv[1:])

    if blocked(args):
        return 2

    if not os.path.isdir(args.vault):
        sys.stderr.write(f"vault 를 못 찾음: {args.vault}\n")
        return 2

    notes = walk(args.vault)
    stat: collections.Counter = collections.Counter()

    for path in notes:
        rel = os.path.relpath(path, args.vault)
        text = open(path, encoding="utf-8").read()
        made = process(text, stat)
        stat["노트"] += 1
        if args.dry_run:
            continue
        out = os.path.join(args.dest, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(made)

    where = "(맛보기)" if args.dry_run else args.dest
    sys.stderr.write(
        f"노트 {stat['노트']}편 → {where}\n"
        f"  mermaid {stat['블록']}개 중 도해로 {stat['도해로']}개, 버림 {stat['버림']}개\n"
        f"  껍데기만 남아 지운 섹션 {stat['빈 섹션']}개\n"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
