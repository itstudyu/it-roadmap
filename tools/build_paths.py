#!/usr/bin/env python3
"""paths/paths.json (상황별 경로) -> data/paths.js.

    python3 tools/build_paths.py

경로는 "이 단어들을 이 순서로 보면 한 상황이 이해된다" 는 큐레이션이다.
단어 자체(content/)와 달리 사람이 골라 엮는 것이라 원본을 따로 둔다.

여기서 하는 일은 하나다. **단어 이름을 id 로 굳힌다.**

원본에는 사람이 읽는 이름("Load Balancer")으로 적혀 있다. 그대로 두고 앱이
실행 시점에 찾게 하면, 단어 제목이 바뀌었을 때 앱이 조용히 그 노드만 빼고
그린다 — 경로가 일곱 칸에서 여섯 칸이 되는데 아무도 모른다. 여기서 미리 찾아
못 찾으면 빌드를 세운다. 깨지는 자리를 배포 전으로 당긴다.

같은 단어가 여러 경로에 들어가는 것은 정상이다. 하나의 낱말이 여러 상황에
쓰이는 것이 오히려 이 앱이 보여주려는 것이다.
"""

from __future__ import annotations

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "paths", "paths.json")
INDEX = os.path.join(ROOT, "data", "index.js")
OUT = os.path.join(ROOT, "data", "paths.js")

BANNER = (
    "// 이 파일은 tools/build_paths.py 가 paths/paths.json 에서 생성한다. 직접 고치지 말 것.\n"
    "// 경로를 고치려면 paths/paths.json 을 고치고 다시 굽는다.\n"
    "// 전역 변수로 내보낸다. ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.\n\n"
)


def log(message: str) -> None:
    sys.stdout.write(message + "\n")


def norm(value: str) -> str:
    """이름을 맞대 볼 모양으로 깎는다. 띄어쓰기·기호·대소문자를 지운다."""
    return re.sub(r"[^a-z0-9가-힣]", "", str(value or "").lower())


def load_index() -> list[dict]:
    with open(INDEX, encoding="utf-8") as f:
        body = f.read()
    head = "window.VOCABULARY_INDEX = "
    if head not in body:
        raise SystemExit("data/index.js 에서 단어 목록을 못 찾았다. tools/build.py 를 먼저 돌려라.")
    return json.loads(body.split(head, 1)[1].rsplit(";", 1)[0].strip().rstrip(";"))


def main() -> int:
    with open(SOURCE, encoding="utf-8") as f:
        source = json.load(f)

    books = load_index()
    terms = [dict(t, bookId=b["id"]) for b in books for t in b.get("terms", [])]

    # 이름 -> 단어. 표제어·읽는 이름·별칭을 다 받는다.
    by_name: dict[str, list[dict]] = {}
    for t in terms:
        for name in [t.get("term"), t.get("reading")] + list(t.get("aliases") or []):
            key = norm(name)
            if key:
                by_name.setdefault(key, []).append(t)

    def find(name: str, book_id: str) -> dict | None:
        hits = by_name.get(norm(name)) or []
        # 같은 권에 있으면 그것을 쓴다. 없으면 다른 권에서 빌려 온다.
        return next((h for h in hits if h["bookId"] == book_id), hits[0] if hits else None)

    missing: list[str] = []
    borrowed: list[str] = []
    out_books: dict[str, dict] = {}
    node_count = 0

    for book_id, spec in source["books"].items():
        if not any(b["id"] == book_id for b in books):
            missing.append(f"{book_id} — 그런 권이 없다")
            continue
        paths = []
        for path in spec["paths"]:
            nodes = []
            for name in path["terms"]:
                node_count += 1
                found = find(name, book_id)
                if not found:
                    missing.append(f"{book_id} / {path['name']} / {name}")
                    continue
                if found["bookId"] != book_id:
                    borrowed.append(f"{book_id} / {name} -> {found['id']}")
                nodes.append({
                    "id": found["id"],
                    "term": found["term"],
                    # 빌려 온 단어는 화면에서 그렇게 표시해야 한다. 이 권의 단어인 척하면
                    # "이 권 전체 보기" 에서 안 나와 사용자가 못 찾는다.
                    "borrowed": found["bookId"] != book_id,
                    "bookId": found["bookId"],
                })
            paths.append({"name": path["name"], "minutes": path["minutes"], "nodes": nodes})
        out_books[book_id] = {
            "mark": spec["mark"], "topic": spec["topic"], "blurb": spec["blurb"],
            "paths": paths,
        }

    if missing:
        for line in missing:
            log(f"  ✗ 못 찾은 단어 — {line}")
        raise SystemExit(f"경로가 가리키는 단어 {len(missing)}개를 못 찾았다. 굽지 않는다.")

    payload = {"groups": source["groups"], "books": out_books}
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(BANNER)
        f.write("window.VOCAB_PATHS = " + json.dumps(payload, ensure_ascii=False) + ";\n")

    size = os.path.getsize(OUT) / 1024
    log(f"묶음 {len(payload['groups'])}개 · 권 {len(out_books)}개 "
        f"· 경로 {sum(len(b['paths']) for b in out_books.values())}개 · 노드 {node_count}개")
    if borrowed:
        log(f"  · 다른 권에서 빌려 온 단어 {len(borrowed)}개")
        for line in borrowed:
            log(f"      {line}")
    log(f"작성함: data/paths.js  ({size:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
