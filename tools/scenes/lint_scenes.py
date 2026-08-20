#!/usr/bin/env python3
"""각본이 컷 문법을 지켰는지 전수로 잰다. 읽기만 한다.

    python3 tools/scenes/lint_scenes.py            # scenes/*.json 전부
    python3 tools/scenes/lint_scenes.py net web    # 고른 권만

사람 눈으로 "좋은 그림인가" 를 재면 327편에서 기준이 흔들린다. 흔들리지
않는 것만 여기서 잰다 — 컷 수, 글자 수, 파랑 개수, 배우 자리, 그리고
실제로 그려지는가. 나머지(이야기가 말이 되는가)는 블라인드 테스트가 맡는다.

문법의 핵심은 규칙 ④ 다. **파랑은 컷당 한 군데.** 파랑만 눈으로 따라가도
이야기가 되게 하는 장치라, 둘이 되는 순간 눈이 어느 쪽을 따라갈지 잃는다.
마지막 컷만 사물과 마침 체크 둘을 허용한다.
"""

from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from scenes import parts as P  # noqa: E402
from scenes import render as R  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
SOURCE = os.path.join(ROOT, "scenes")

CAPTION_MAX = 10   # 컷 아래 한 줄
BUBBLE_MAX = 8     # 말풍선
TAG_MAX = 12       # 이름표
LETTERS_MAX = 48   # 한 편의 캡션 + 말풍선 글자 총합
BLUE_TONES = ("blue", "blue-dash")


def blues(cut: dict) -> int:
    """이 컷에서 파랑을 입은 것의 수."""
    count = sum(1 for a in cut.get("actors", [])
                if (a.get("tag") or {}).get("tone", "plain") in BLUE_TONES)
    load = (cut.get("move") or {}).get("payload")
    if load and load.get("tone", "blue") in BLUE_TONES:
        count += 1
    return count


def check_cut(cut: dict, i: int, last: bool, out: list[str]) -> None:
    where = f"컷{i + 1}"
    cap = cut.get("caption", "")
    if not cap:
        out.append(f"{where}: 캡션이 없다")
    elif len(cap) > CAPTION_MAX:
        out.append(f"{where}: 캡션이 {len(cap)}자다 ({CAPTION_MAX}자 이내) — {cap}")

    speech = cut.get("bubble")
    if speech and len(speech.get("text", "")) > BUBBLE_MAX:
        out.append(f"{where}: 말풍선이 {len(speech['text'])}자다 ({BUBBLE_MAX}자 이내)")

    slots = [a.get("slot") for a in cut.get("actors", [])]
    if len(slots) != len(set(slots)):
        out.append(f"{where}: 한 자리에 배우가 둘이다 — {slots}")
    # 같은 부품이 한 컷에 둘 있으면(폰 둘이 주고받는 편) 누가 누구인지
    # 이름을 붙여야 자리 검사가 성립한다.
    parts = [a.get("part") for a in cut.get("actors", [])]
    for a in cut.get("actors", []):
        if parts.count(a.get("part")) > 1 and not a.get("who"):
            out.append(f"{where}: 같은 부품이 둘인데 who 가 없다 — {a.get('part')}")
    for a in cut.get("actors", []):
        if a.get("part") not in P.ACTORS:
            out.append(f"{where}: 없는 부품이다 — {a.get('part')}")
        label = a.get("tag") or {}
        if len(str(label.get("text", ""))) > TAG_MAX:
            out.append(f"{where}: 이름표가 {len(label['text'])}자다 ({TAG_MAX}자 이내)")

    allowed = 2 if last else 1
    got = blues(cut) + (1 if cut.get("check", last) else 0)
    if got > allowed:
        out.append(f"{where}: 파랑이 {got}군데다 ({allowed}군데까지) — 눈이 따라갈 줄이 갈라진다")


def check_script(term_id: str, script: dict) -> list[str]:
    out: list[str] = []
    cuts = script.get("cuts") or []
    if len(cuts) not in (3, 4):
        out.append(f"컷이 {len(cuts)}개다 (3컷, 왕복이면 4컷)")
        return [f"{term_id} — {m}" for m in out]

    if not script.get("alt"):
        out.append("alt 가 없다 — 그림을 못 보는 사람에게 읽어 줄 한 문장이 필요하다")

    for i, cut in enumerate(cuts):
        check_cut(cut, i, i == len(cuts) - 1, out)

    # 같은 배우는 매 컷 같은 자리. 자리가 흔들리면 같은 배우로 안 읽힌다.
    seat: dict[str, str] = {}
    for i, cut in enumerate(cuts):
        for a in cut.get("actors", []):
            who, slot = a.get("who") or a.get("part"), a.get("slot")
            if who in seat and seat[who] != slot:
                out.append(f"컷{i + 1}: '{who}' 의 자리가 바뀌었다 ({seat[who]} → {slot})")
            seat.setdefault(who, slot)

    letters = sum(len(c.get("caption", "")) for c in cuts)
    letters += sum(len((c.get("bubble") or {}).get("text", "")) for c in cuts)
    if letters > LETTERS_MAX:
        out.append(f"글자가 {letters}자다 ({LETTERS_MAX}자 안팎) — 그림이 못 하는 말만 남긴다")

    try:
        R.render(script)
    except R.SceneError as exc:
        out.append(f"그려지지 않는다 — {exc}")

    return [f"{term_id} — {m}" for m in out]


def main(argv: list[str]) -> int:
    wanted = argv[1:]
    files = sorted(f for f in os.listdir(SOURCE) if f.endswith(".json"))
    if wanted:
        files = [f for f in files if f[:-5] in wanted]

    total, bad = 0, []
    for fn in files:
        with open(os.path.join(SOURCE, fn), encoding="utf-8") as f:
            scripts = json.load(f)
        for term_id, script in sorted(scripts.items()):
            total += 1
            bad += check_script(term_id, script)

    for line in bad:
        sys.stdout.write(f"  ✗ {line}\n")
    sys.stdout.write(f"각본 {total}편 — 어긋남 {len(bad)}건\n")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
