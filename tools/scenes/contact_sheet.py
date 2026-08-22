#!/usr/bin/env python3
"""각본을 한 장에 늘어놓아 사람 눈으로 보게 한다.

    python3 tools/scenes/contact_sheet.py infra --out /tmp/infra.html
    python3 tools/scenes/contact_sheet.py --new --out /tmp/new.html

lint_scenes.py 는 흔들리지 않는 것만 잰다 — 컷 수, 글자 수, 파랑 개수.
"이야기가 말이 되는가" 는 기계가 못 잰다. 그래서 이 파일이 있다.
한 편씩 앱에서 열어 보면 100편에 한 시간이 걸리고, 그러다 보면 안 본다.

권 하나를 한 페이지에 세로로 쌓아 놓으면 다른 것이 보인다 — 같은 부품을
매번 같은 자리에 세웠는지, 파랑이 한 줄로 흐르는지, 캡션 말투가 편마다
따로 노는지. 이건 한 편만 봐서는 절대 안 보인다.
"""

from __future__ import annotations

import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from scenes import render as R  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
SOURCE = os.path.join(ROOT, "scenes")

PAGE_HEAD = """<!doctype html><meta charset="utf-8">
<title>장면 검수 — {title}</title>
<style>
  :root { --ink: #1b1d21; --ink-2: #5b6068; --ink-3: #a8adb5;
          --st-reading: #2f6df6; --paper: #fbfbfc; --line: #e6e8ec; }
  body { margin: 0; background: var(--paper); color: var(--ink);
         font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif; }
  header { position: sticky; top: 0; background: var(--paper); border-bottom: 1px solid var(--line);
           padding: 14px 20px; z-index: 2; }
  h1 { font-size: 16px; margin: 0; }
  .count { color: var(--ink-2); font-size: 13px; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px; padding: 20px; align-items: start; }
  figure { margin: 0; background: #fff; border: 1px solid var(--line); border-radius: 12px;
           padding: 12px; }
  figcaption { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
  figcaption span { display: block; font-weight: 400; color: var(--ink-2); font-size: 12px;
                    margin-top: 3px; }
  svg { width: 100%; height: auto; display: block; }
  .bad { border-color: #d33; }
  .bad figcaption { color: #d33; }
</style>
<header><h1>{title}</h1><div class="count">{count}</div></header>
<div class="grid">
"""


def log(message: str) -> None:
    sys.stderr.write(message + "\n")


def books_from_args(names: list[str], only_new: bool) -> list[str]:
    """어느 권을 그릴지 고른다. 인자가 없으면 전부."""
    if names:
        return names
    found = sorted(f[:-5] for f in os.listdir(SOURCE) if f.endswith(".json"))
    if not only_new:
        return found
    return found


def one_card(term_id: str, script: dict) -> str:
    """각본 하나를 카드 하나로. 못 그리면 왜 못 그렸는지를 카드에 적는다."""
    try:
        art = R.render(script)
        cls = ""
    except Exception as err:  # 렌더 실패도 검수 대상이다 — 조용히 빼지 않는다
        art = ""
        cls = " bad"
        script = dict(script, alt=f"렌더 실패: {err}")
    alt = script.get("alt", "")
    return (f'<figure class="{cls.strip()}"><figcaption>{term_id}'
            f'<span>{alt}</span></figcaption>{art}</figure>\n')


def sheet(book: str, wanted: set[str] | None) -> tuple[str, int]:
    """권 하나의 카드들."""
    path = os.path.join(SOURCE, f"{book}.json")
    scripts = json.load(open(path, encoding="utf-8"))
    body = ""
    drawn = 0
    for term_id in sorted(scripts):
        if wanted is not None and term_id not in wanted:
            continue
        body += one_card(term_id, scripts[term_id])
        drawn += 1
    return body, drawn


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("books", nargs="*", help="권 id. 없으면 전부")
    ap.add_argument("--out", required=True, help="쓸 HTML 경로")
    ap.add_argument("--only", help="이 id 만 그린다 (쉼표로 구분)")
    args = ap.parse_args()

    wanted = set(args.only.split(",")) if args.only else None
    body = ""
    total = 0
    for book in books_from_args(args.books, False):
        part, drawn = sheet(book, wanted)
        if drawn:
            body += f'</div><header><h1>{book}</h1><div class="count">{drawn}편</div></header><div class="grid">'
            body += part
            total += drawn

    title = ", ".join(books_from_args(args.books, False))
    head = PAGE_HEAD.replace("{title}", title).replace("{count}", f"{total}편")
    with open(args.out, "w", encoding="utf-8") as fh:
        fh.write(head + body + "</div>")
    log(f"{args.out} — {total}편")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
