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

컷 수는 **4 다.** 넷도 셋도 여섯도 아니라 정확히 넷이다.

    1컷 입력   — 무엇이 들어오나
    2컷 일     — 이 단어가 하는 일
    3컷 출력   — 무엇이 나오나
    4컷 경계   — 여기서 끝나고, 다음은 누구 일인가

넷째 칸이 있어야 하는 이유가 이 자의 존재 이유와 같다. 열 살에게 설명할 때
가장 많이 틀리는 것은 그 단어가 무엇인지가 아니라 **어디까지 하는가** 다.
DNS 를 "웹사이트를 열어 주는 것" 이라고 말하는 오해가 정확히 여기서 난다.
셋으로 그리면 그 자리가 없어서, 틀린 채로 끝나는 편이 나온다.

수를 고정하는 이유는 따로 있다. 3~6 으로 열어 두었더니 어려운 단어를 만날
때마다 컷을 한 칸씩 늘리게 되고, 편마다 길이가 제각각인 책이 됐다. 넷으로
못박으면 "칸이 모자라다" 가 "무엇을 뺄까" 로 바뀐다. 그리고 넷은 390×844
에서 접힌 선 위에 그대로 들어가는 마지막 수다(4컷 448px, 5컷 562px).
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
CUTS = 4           # 입력 · 일 · 출력 · 경계. 위 설명 참고

# 한 편의 캡션 + 말풍선 글자 총합. 컷이 넷으로 굳었으니 상수다.
# 52 는 3컷 시절의 실측에서 나왔다 — 608편 중 가장 말이 많은 편이 40자였고,
# 거기에 넷째 캡션(10자 이내)을 더해도 넘지 않는 값이다.
LETTERS_MAX = 52
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
    if len(cuts) != CUTS:
        out.append(f"컷이 {len(cuts)}개다 (입력·일·출력·경계 {CUTS}컷)")
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

    # 접힌 선 규칙은 컷 수를 넷으로 못박으면서 검사할 것이 없어졌다.
    # 4컷 448px 은 390×844 의 접힌 선 위에 그대로 들어간다. 이야기가 화면
    # 밖에서 끝나는 일이 구조적으로 안 생긴다.

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


def coverage() -> tuple[list[str], list[str]]:
    """단어 목록과 각본 목록이 짝이 맞는가.

    build_scenes.py 는 "각본이 없는 편은 그냥 없다, 빈 자리는 오류가 아니라
    판단이다" 라고 적어 두었다. 그 판단은 그림이 곁들임이던 때의 것이다.
    개편에서 그림은 6단계 학습의 뼈대가 된다 — 입력·일·출력·경계 네 컷이
    곧 학습 단계 넷이라, 그림이 없는 단어는 코스를 돌 수가 없다.

    그래서 아직 어긋남으로 세지 않고 따로 센다. 판단을 조용히 뒤집는 대신
    수를 눈에 보이게 두고, Phase 1 이 끝나면 이 수가 0 이 되어야 한다.
    """
    index = os.path.join(ROOT, "data", "index.js")
    if not os.path.exists(index):
        return [], []
    with open(index, encoding="utf-8") as f:
        body = f.read()
    head = "window.VOCABULARY_INDEX = "
    if head not in body:
        return [], []
    books = json.loads(body.split(head, 1)[1].rsplit(";", 1)[0].strip().rstrip(";"))
    words = {t["id"] for b in books for t in b.get("terms", [])}

    drawn = set()
    for name in sorted(os.listdir(SOURCE)):
        if name.endswith(".json"):
            with open(os.path.join(SOURCE, name), encoding="utf-8") as f:
                drawn |= set(json.load(f).keys())

    return sorted(words - drawn), sorted(drawn - words)


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

    # 권을 골라 잰 때는 짝을 못 센다. 전수로 잴 때만 보고한다.
    if len(argv) <= 1:
        undrawn, orphan = coverage()
        if undrawn:
            sys.stdout.write(f"  · 그림 없는 단어 {len(undrawn)}편 — "
                             + ", ".join(undrawn[:6])
                             + (" …" if len(undrawn) > 6 else "") + "\n")
        if orphan:
            sys.stdout.write(f"  ✗ 단어가 없는 각본 {len(orphan)}편 — "
                             + ", ".join(orphan[:6]) + "\n")
            bad += orphan
        if not undrawn and not orphan:
            sys.stdout.write("  · 단어와 각본이 짝이 맞는다\n")

    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
