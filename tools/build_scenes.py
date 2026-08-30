#!/usr/bin/env python3
"""scenes/<권>.json (각본) -> data/scenes/<권>.js (그림).

    python3 tools/build_scenes.py            # 전부 다시 굽는다
    python3 tools/build_scenes.py net web    # 고른 권만

각본은 사람이(그리고 에이전트가) 쓰고, 그림은 tools/scenes/render.py 가
부품으로 조립한다. 자유 드로잉이 없으므로 327편이 같은 세계에 산다.

내보내는 모양은 data/terms/*.js 와 같다 — 전역 변수 하나에 얹는다.
ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.

각본 파일 한 권의 모양:

    {
      "net--dhcp": { "alt": "…", "cuts": [ … ] },
      "net--dns":  { "alt": "…", "cuts": [ … ] }
    }

각본이 없는 편은 그냥 없다. 억지로 그린 그림은 없느니만 못하다 —
빈 자리는 오류가 아니라 판단이다.
"""

from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scenes import render as R  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "scenes")
OUT = os.path.join(ROOT, "data", "scenes")

BANNER = (
    "// 이 파일은 tools/build_scenes.py 가 scenes/*.json 에서 생성한다. 직접 고치지 말 것.\n"
    "// 그림을 고치려면 각본(scenes/<권>.json)을 고치고 다시 굽는다.\n"
    "// 전역 변수로 내보낸다. ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.\n\n"
)


def log(message: str) -> None:
    """진행 보고. build.py 와 같게 stderr 로만 말한다 — stdout 은 비워둔다."""
    sys.stderr.write(message + "\n")


def books() -> list[str]:
    """단어장 id 목록. data/terms 에 있는 것이 곧 있는 권이다."""
    terms = os.path.join(ROOT, "data", "terms")
    return sorted(f[:-3] for f in os.listdir(terms) if f.endswith(".js"))


def load(book: str) -> dict:
    path = os.path.join(SOURCE, f"{book}.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build(book: str) -> tuple[int, list[str]]:
    """한 권. (그린 편 수, 실패 목록)"""
    scripts = load(book)
    drawn, cuts, broken = {}, {}, []
    for term_id, script in sorted(scripts.items()):
        try:
            drawn[term_id] = R.render(script)
        except R.SceneError as exc:
            broken.append(f"{term_id}: {exc}")
            continue
        # 캡션도 같이 내보낸다. 앱의 학습 3단계가 컷을 하나씩 여는데, 그때
        # 그림 안의 작은 글자만으로는 뜻이 안 전해진다 — 폰에서 9px 남짓이다.
        # 같은 문장을 16px HTML 로 그림 옆에 세우려면 여기서 나와야 한다.
        # 컷 수도 함께 나간다. 마스크가 몇 칸으로 갈릴지 정하는 값이다.
        cuts[term_id] = [c.get("caption", "") for c in (script.get("cuts") or [])]

    os.makedirs(OUT, exist_ok=True)
    payload = json.dumps(drawn, ensure_ascii=False, separators=(",", ":"))
    caption_payload = json.dumps(cuts, ensure_ascii=False, separators=(",", ":"))
    body = (BANNER + "window.VOCAB_SCENES = window.VOCAB_SCENES || {};\n"
            f"window.VOCAB_SCENES[{json.dumps(book)}] = {payload};\n"
            "window.VOCAB_SCENE_CUTS = window.VOCAB_SCENE_CUTS || {};\n"
            f"window.VOCAB_SCENE_CUTS[{json.dumps(book)}] = {caption_payload};\n")
    with open(os.path.join(OUT, f"{book}.js"), "w", encoding="utf-8") as f:
        f.write(body)
    return len(drawn), broken


def main(argv: list[str]) -> int:
    wanted = argv[1:] or books()
    total, failures = 0, []
    for book in wanted:
        drawn, broken = build(book)
        total += drawn
        failures += broken
        if drawn or broken:
            log(f"  {book:<6} 장면 {drawn}편" + (f"  ✗ {len(broken)}" if broken else ""))
    for line in failures:
        log(f"  ✗ {line}")
    log(f"장면 {total}편 → data/scenes/*.js ({len(wanted)}권)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
