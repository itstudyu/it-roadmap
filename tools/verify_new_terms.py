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
    """아직 커밋되지 않은, content/ 아래 새로 생긴 .md 파일.

    `git status --porcelain -z` 를 쓴다. 두 가지를 한꺼번에 피하려는 것이다.

    첫째, `git diff --diff-filter=A HEAD` 는 **git add 를 한 파일만** 본다.
    루틴은 검증을 커밋 전에 부르므로 그 시점의 새 파일은 대개 untracked 고,
    diff 로 보면 0건이 나온다.

    둘째, git 은 기본 설정(core.quotepath=true)에서 비ASCII 경로를
    "content/\\352\\260..." 처럼 따옴표와 8진 이스케이프로 감싼다. 이 저장소의
    폴더는 거의 전부 한글이라 줄 단위로 받으면 .md 로 끝나지 않는다.
    -z 는 NUL 로 끊어 주고 따옴표를 씌우지 않는다.

    두 실패 모두 결과가 같다 — 빈 목록. 그러면 아래 템플릿 검사가 아무것도 안 보고
    "0/0 통과" 도장을 찍는다. 안전망이 뚫린 것을 통과로 읽는 쪽이 안전망이 아예
    없는 쪽보다 나쁘다. 실제로 첫 루틴 실행에서 이 일이 일어났다.
    """
    r = subprocess.run(
        ["git", "status", "--porcelain", "-z", "--", "content/"],
        cwd=ROOT, capture_output=True, text=True,
    )
    out = []
    for entry in r.stdout.split("\0"):
        # "XY <경로>" 꼴. X 는 인덱스, Y 는 작업트리 상태다.
        # A=추가됨, ?=untracked. 첫 글자만 본다 — 스테이징한 뒤 다시 고치면
        # "AM" 이 되는데 그것도 여전히 이번에 생긴 파일이다.
        if len(entry) > 3 and entry[0] in ("A", "?") and entry[3:].endswith(".md"):
            out.append(entry[3:])
    return out


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

    if check_new_files(args.expect):
        return 1

    sys.stderr.write("\n통과. 커밋해도 된다.\n")
    return 0


def check_new_files(expect: int) -> int:
    files = new_term_files()
    if len(files) != expect:
        # 경고로 넘기면 안 된다. 파일을 못 찾으면 아래 템플릿 검사가 빈 목록을 받고
        # "0/0 통과" 라는 거짓 통과를 낸다.
        return fail(
            f"새로 생긴 .md 가 {len(files)}개인데 {expect}개를 기대했다.\n"
            "      단어 수는 맞는데 파일 수가 다르면 기존 파일을 고쳤다는 뜻이다.\n"
            "      루틴은 추가만 한다 — 기존 단어를 고치지 마라. 아래로 확인해라:\n"
            "      git status --porcelain -- content/"
        )
    passed, why = check_template(files)
    if not passed:
        return fail("템플릿 미통과 — " + why)
    ok(f"템플릿 {len(files)}/{len(files)} 통과")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
