#!/usr/bin/env python3
"""각본이 뜻을 지고 있는지 잰다. 컷 문법이 아니라 **내용** 쪽이다.

    python3 tools/scenes/audit_content.py
    python3 tools/scenes/audit_content.py net infra

lint_scenes.py 는 문법을 본다 — 컷이 셋인가, 파랑이 하나인가, 글자가 넘치나.
문법을 다 지켜도 그림이 아무 말도 안 할 수 있다. 그걸 여기서 잰다.

핵심 지표는 **그림이 스스로 말하는 글자 수** 다. 이름표와 옮겨지는 것에
적힌 글자만 세고 캡션과 말풍선은 뺀다. 캡션은 그림 밖에서 설명하는 글이라,
그것까지 세면 "그림만 봐도 읽히나" 를 잴 수 없다.

한 번 잘못 쟀던 기록을 남겨 둔다. 처음에는 '뼈대가 같은 편' 을 셌다 —
배우 구성과 화살표 방향이 같으면 같은 그림이라고 본 것이다. 629편 중
64편이 걸렸는데, 실제로 그려서 보니 전부 다른 그림이었다. 뼈대가 같아도
이름표와 짐에 적힌 글자가 달라서 눈에는 다르게 보인다. 사람이 보는 것을
기계가 흉내낼 때는, 재려는 것이 정말 그것인지 한 번은 그려 봐야 한다.
"""

from __future__ import annotations

import collections
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SOURCE = os.path.join(ROOT, "scenes")

THIN = 2          # 그림이 스스로 말하는 글자가 이보다 적으면 의심한다


def picture_words(script: dict) -> set[str]:
    """그림 안에 실제로 적힌 글자. 캡션과 말풍선은 그림 밖이라 뺀다."""
    words: set[str] = set()
    for cut in script.get("cuts", []):
        for actor in cut.get("actors", []):
            label = actor.get("tag") or {}
            if label.get("text"):
                words.add(label["text"])
        load = (cut.get("move") or {}).get("payload") or {}
        if load.get("text"):
            words.add(load["text"])
    return words


def load(books: list[str]) -> dict:
    out = {}
    for fn in sorted(os.listdir(SOURCE)):
        if not fn.endswith(".json"):
            continue
        if books and fn[:-5] not in books:
            continue
        out.update(json.load(open(os.path.join(SOURCE, fn), encoding="utf-8")))
    return out


def measure(scenes: dict) -> tuple[collections.Counter, list, dict]:
    """세 가지를 한 번에 센다 — 글자 수 분포, 얇은 편, 정말 같은 그림."""
    spread: collections.Counter = collections.Counter()
    thin: list[tuple[str, int, list[str]]] = []
    twins: dict[tuple, list[str]] = collections.defaultdict(list)
    for term_id, script in sorted(scenes.items()):
        words = picture_words(script)
        spread[len(words)] += 1
        if len(words) < THIN:
            thin.append((term_id, len(words), sorted(words)))
        # 그림 안 글자까지 똑같으면 그때는 정말 같은 그림이다
        parts = tuple(tuple(sorted(a["part"] for a in c.get("actors", [])))
                      for c in script["cuts"])
        twins[(parts, tuple(sorted(words)))].append(term_id)
    return spread, thin, twins


def report(scenes: dict, spread, thin, twins) -> None:
    sys.stdout.write(f"각본 {len(scenes)}편 — 그림이 스스로 말하는 글자 수\n")
    for k in sorted(spread):
        sys.stdout.write(f"  {k}개  {spread[k]:4d}편  " + "▏" * min(spread[k], 60) + "\n")

    same = {k: v for k, v in twins.items() if len(v) > 1}
    sys.stdout.write(f"\n그림 안 글자까지 똑같은 무리: {len(same)}개\n")
    for v in list(same.values())[:10]:
        sys.stdout.write("  " + ", ".join(v) + "\n")

    sys.stdout.write(f"\n글자가 {THIN}개 미만인 편: {len(thin)}편\n")
    for term_id, count, words in thin:
        sys.stdout.write(f"  {term_id:34s} {count}개 {words}\n")
    sys.stdout.write(
        "\n이 목록은 '고쳐라' 가 아니라 '가서 봐라' 다. 글자가 하나여도"
        "\n이름표가 상태를 지고 있으면 읽히는 편이 있다. 마지막 판단은 눈이 한다.\n")


def main(argv: list[str]) -> int:
    scenes = load(argv)
    if not scenes:
        sys.stdout.write("잴 각본이 없다\n")
        return 1
    report(scenes, *measure(scenes))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
