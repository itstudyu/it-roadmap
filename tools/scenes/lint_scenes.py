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

컷 수는 3~6 이다. 예전에는 3컷(왕복이면 4컷)만 허용했는데, 단계가 정말
여럿인 단어 — OAuth 의 넘겨주고 로그인하고 표를 받는 춤 같은 것 — 을
세 칸에 우겨 넣으면 가운데 단계가 통째로 사라졌다. 그래서 풀었다.

그래도 위를 6 으로 막아 둔다. 일곱 컷을 넘어가면 읽는 사람이 줄거리를
놓치고, 그쯤 되면 대개 한 단어가 아니라 두 단어다. 제한이 없으면 다음에
어려운 단어를 만날 때마다 컷을 한 칸씩 늘리게 되고, 스무 편쯤 뒤에는
편마다 길이가 제각각인 책이 된다.
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
CUTS_MIN = 3       # 문제 · 동작 · 결과. 이보다 적으면 이야기가 아니다
CUTS_MAX = 6       # 아래 주석 참고

# 한 편의 캡션 + 말풍선 글자 총합. 컷이 늘면 같이 늘되, 컷당 몫은 오히려
# 줄인다 — 컷이 많을수록 한 컷이 지는 말이 적어야 눈이 안 지친다.
def letters_max(cuts: int) -> int:
    return max(48, 13 * cuts)
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

    # 마침 표시가 붙는 컷에만 파랑 둘을 허용한다. 예전에는 "마지막 컷" 으로
    # 적어 뒀는데, 컷이 늘면서 마침이 가운데(접힌 선 위)로 오게 되어
    # 자리가 아니라 역할로 다시 적는다.
    closing = bool(cut.get("check", last))
    allowed = 2 if closing else 1
    got = blues(cut) + (1 if closing else 0)
    if got > allowed:
        out.append(f"{where}: 파랑이 {got}군데다 ({allowed}군데까지) — 눈이 따라갈 줄이 갈라진다")


def check_script(term_id: str, script: dict) -> list[str]:
    out: list[str] = []
    cuts = script.get("cuts") or []
    if not CUTS_MIN <= len(cuts) <= CUTS_MAX:
        out.append(f"컷이 {len(cuts)}개다 ({CUTS_MIN}~{CUTS_MAX}컷)")
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
    cap = letters_max(len(cuts))
    if letters > cap:
        out.append(f"글자가 {letters}자다 ({cap}자 안팎) — 그림이 못 하는 말만 남긴다")

    # 다섯 컷부터는 폰에서 접힌 선 아래로 내려간다(390×844 에서 실측:
    # 4컷 448px 은 들어가고 5컷 562px 은 넘친다). 그러니 **앞 네 컷만으로도
    # 이야기가 서야 한다.** 마침 체크가 다섯째 컷 뒤에만 있으면 스크롤을
    # 안 한 사람은 결말을 못 본다.
    if len(cuts) > 4:
        early = any(c.get("check") for c in cuts[:4])
        if not early:
            out.append("다섯 컷을 넘는데 앞 네 컷 안에 마침 표시가 없다 — "
                       "접힌 선 위에서 이야기가 끝나야 한다")

    try:
        R.render(script)
    except R.SceneError as exc:
        out.append(f"그려지지 않는다 — {exc}")

    return [f"{term_id} — {m}" for m in out]


def check_names() -> list[str]:
    """부품마다 이름이 있는가, 그리고 그 이름이 자리에 들어가는가.

    금지어 대조를 여기 걸었다가 걷어냈다. 열 살 카드의 금지어 규칙은
    그 카드의 산문에 거는 것이지 그림 라벨에 걸 것이 아니다. 서버를
    "저쪽 기계" 라고 부르면 정작 배우려는 낱말이 그림에서 사라진다.
    열 살이 이해하는 힘은 낱말을 피하는 데서 오지 않고 무슨 일이
    벌어지는지가 그림에 다 보이는 데서 온다.
    """
    import re as _re
    out = []
    for part, nm in sorted(P.NAMES.items()):
        if _re.search(r"[A-Za-z]{2,}", nm):
            out.append(f"부품 이름 '{part}' -> '{nm}' 에 영문이 있다")
        if len(nm) > 7:
            out.append(f"부품 이름 '{part}' -> '{nm}' 이 {len(nm)}자다 (7자 이내)")
    missing = sorted(set(P.ACTORS) - set(P.NAMES))
    if missing:
        out.append("이름 없는 부품 — " + ", ".join(missing))
    return out


def paths_from(argv: list[str]) -> list[str]:
    """무엇을 잴지 고른다.

    권 이름이 기본이지만 임의 경로도 받는다. 각본을 여럿이 나눠 쓸 때는
    같은 파일에 동시에 쓰면 서로를 지우므로 조각 파일로 따로 쓰는데,
    그 조각도 합치기 전에 재 봐야 한다.
    """
    if argv and os.path.sep in argv[0]:
        return argv
    files = sorted(f for f in os.listdir(SOURCE) if f.endswith(".json"))
    if argv:
        files = [f for f in files if f[:-5] in argv]
    return [os.path.join(SOURCE, f) for f in files]


def main(argv: list[str]) -> int:
    total, bad = 0, list(check_names())
    for path in paths_from(argv[1:]):
        with open(path, encoding="utf-8") as f:
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
