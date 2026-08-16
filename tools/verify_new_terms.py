#!/usr/bin/env python3
"""새로 추가한 단어가 실제로 앱에 들어갔는지 검사한다.

    python3 tools/verify_new_terms.py --expect 2

자동 수집 루틴의 마지막 관문이다. 루틴은 사람이 안 보는 새벽에 돌고 결과를
바로 main 에 올리므로, "빌드가 성공했다"는 것만으로는 부족하다.

build.py 는 FOLDER_TO_BOOK 에 없는 폴더의 단어를 제외하고도 0 을 반환한다.
제외 사유는 stderr 로만 흘러간다. 그래서 루틴이 실수로 content/새폴더/ 를
만들면 단어를 잘 쓰고 템플릿도 통과하고 빌드도 성공한 채로, 앱에서는
그 단어가 조용히 사라진다. 몇 주 뒤에나 알게 된다.

여기서는 세 가지를 본다.

    1. 제외(dropped) 가 0 건인가        — 조용히 버려진 단어가 없다
    2. 단어 수가 정확히 +N 인가          — 새 단어가 들어갔고, 기존 단어를
                                          밀어내지도 않았다
    3. 새 단어 파일이 전부 템플릿을 통과하는가

읽기만 한다. 어떤 파일도 고치지 않는다.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "data", "index.js")


def fail(message: str) -> int:
    sys.stderr.write("FAIL  " + message + "\n")
    return 1


def ok(message: str) -> None:
    sys.stderr.write("ok    " + message + "\n")


def count_terms(path: str) -> int:
    """구워진 인덱스에서 단어 수를 센다."""
    with open(path, encoding="utf-8") as f:
        text = f.read()
    payload = text[text.index("[") : text.rindex("]") + 1]
    return sum(len(b["terms"]) for b in json.loads(payload))


def terms_before() -> int:
    """이번 변경 전 단어 수. HEAD 의 index.js 를 읽는다."""
    r = subprocess.run(
        ["git", "show", "HEAD:data/index.js"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if r.returncode != 0:
        return -1
    text = r.stdout
    payload = text[text.index("[") : text.rindex("]") + 1]
    return sum(len(b["terms"]) for b in json.loads(payload))


def check_dry_run() -> tuple[bool, str]:
    """build.py 를 다시 돌려 제외 건수를 본다. stderr 에만 나오므로 붙잡는다."""
    r = subprocess.run(
        [sys.executable, os.path.join(ROOT, "tools", "build.py"), "--dry-run"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if r.returncode != 0:
        return False, f"build.py --dry-run 이 {r.returncode} 로 끝났다"
    m = re.search(r"제외 (\d+)건: (.*)", r.stderr)
    if m:
        return False, f"제외 {m.group(1)}건 — {m.group(2)[:200]}"
    return True, ""


def new_term_files() -> list[str]:
    """이번 변경으로 새로 생긴 content/ 아래 .md 파일."""
    r = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=A", "HEAD", "--", "content/"],
        cwd=ROOT, capture_output=True, text=True,
    )
    return [p for p in r.stdout.splitlines() if p.endswith(".md")]


def check_template(paths: list[str]) -> tuple[bool, str]:
    bad = []
    for p in paths:
        r = subprocess.run(
            [sys.executable, os.path.join(ROOT, "tools", "check_template.py"), p],
            cwd=ROOT, capture_output=True, text=True,
        )
        if r.returncode != 0:
            bad.append(f"{p}: {r.stdout.strip().splitlines()[:2]}")
    return (not bad), "; ".join(bad)


def check_count(expect: int) -> int:
    before, after = terms_before(), count_terms(INDEX)
    if before < 0:
        return fail("HEAD 의 data/index.js 를 읽을 수 없다")
    if after - before != expect:
        return fail(
            f"단어 수가 {before} -> {after} ({after - before:+d}) 인데 {expect:+d} 를 기대했다.\n"
            "      제목이 기존 단어와 겹치면 build.py 가 한쪽을 조용히 버린다.\n"
            "      파일명·H1 제목·괄호 안 원어 셋 다 대조했는지 확인해라."
        )
    ok(f"단어 수 {before} -> {after} ({expect:+d})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--expect", type=int, required=True, help="추가한 단어 수")
    args = ap.parse_args()

    if not os.path.exists(INDEX):
        return fail("data/index.js 가 없다. tools/build.py 를 먼저 돌려라")

    clean, why = check_dry_run()
    if not clean:
        return fail(
            "빌드가 단어를 버렸다. " + why + "\n"
            "      FOLDER_TO_BOOK 에 없는 폴더에 파일을 만들었을 가능성이 높다.\n"
            "      새 폴더를 만들지 말고 tools/build.py 의 BOOKS 에 있는 폴더에만 써라."
        )
    ok("빌드 제외 0건")

    if check_count(args.expect):
        return 1

    files = new_term_files()
    if len(files) != args.expect:
        sys.stderr.write(f"warn  새 파일이 {len(files)}개다 (단어 수는 맞음)\n")
    passed, why = check_template(files)
    if not passed:
        return fail("템플릿 미통과 — " + why)
    ok(f"템플릿 {len(files)}/{len(files)} 통과")

    sys.stderr.write("\n통과. 커밋해도 된다.\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
