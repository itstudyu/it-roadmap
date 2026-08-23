#!/usr/bin/env python3
"""content/INDEX.md 를 폴더에서 다시 만든다. 옵시디언에서 훑어보는 용도다.

    python3 tools/build_index.py

이 파일은 스스로 "자동으로 업데이트됩니다" 라고 적어 두고도 손으로
고쳐 왔다. 그래서 327편에서 멈춘 채 300편이 낡아 있었다. 거짓이 되는
문장은 지우거나 참으로 만들어야 하는데, 여기서는 참으로 만드는 쪽이 싸다.

data/index.js 가 아니라 content/ 를 읽는다. 이 파일을 읽는 사람은 앱이
아니라 옵시디언 금고를 여는 사람이고, 그쪽의 사실은 파일이기 때문이다.
"""

from __future__ import annotations

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
OUT = os.path.join(CONTENT, "INDEX.md")

NOT_TERMS = {"INDEX.md", "IT_Expert_로드맵.md"}

# 보이는 이름과 얼굴. 폴더 이름만으로는 훑을 때 눈에 안 걸린다.
FACES = [
    ("AI_ML", "🤖 AI / ML"),
    ("개발도구", "🛠️ 개발도구"),
    ("네트워크", "🌐 네트워크"),
    ("데이터베이스", "🗄️ 데이터베이스"),
    ("데이터_형식", "📄 데이터 형식"),
    ("보안", "🔒 보안"),
    ("비즈니스", "💼 비즈니스"),
    ("아키텍처", "🏗️ 아키텍처"),
    ("웹개발", "🖥️ 웹개발"),
    ("인프라", "⚙️ 인프라"),
    ("클라우드", "☁️ 클라우드"),
    ("컴퓨터과학", "💻 컴퓨터과학"),
    ("프로그래밍", "👨‍💻 프로그래밍"),
    ("제품관리", "📊 제품관리"),
]
LOOSE = "🖥️ OS / 시스템"   # content/ 바로 밑에 있는 몇 편


def terms_in(folder: str) -> list[str]:
    path = os.path.join(CONTENT, folder)
    if not os.path.isdir(path):
        return []
    return sorted(f[:-3] for f in os.listdir(path) if f.endswith(".md"))


def loose_terms() -> list[str]:
    return sorted(f[:-3] for f in os.listdir(CONTENT)
                  if f.endswith(".md") and f not in NOT_TERMS)


def main(argv: list[str]) -> int:
    groups = [(face, terms_in(folder)) for folder, face in FACES]
    groups.append((LOOSE, loose_terms()))
    groups = [(face, ts) for face, ts in groups if ts]

    total = sum(len(ts) for _, ts in groups)
    today = os.environ.get("INDEX_DATE", "")
    if not today:
        import datetime
        today = datetime.date.today().isoformat()

    out = ["# 📚 IT단어장 전체 인덱스", ""]
    out.append(f"> 총 **{total}개** 용어 | 카테고리 **{len(groups)}개**")
    out.append(f"> 마지막 업데이트: {today}")
    out.append("")
    for face, ts in groups:
        out += ["---", "", f"## {face} ({len(ts)}개)", ""]
        out += [f"- [[{t}]]" for t in ts]
        out.append("")
    out += ["---", "",
            "*이 파일은 `python3 tools/build_index.py` 가 만든다. 손으로 고치지 마라 —",
            "다음 번에 덮어쓰인다.*", ""]

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    sys.stdout.write(f"{OUT} — {total}편, {len(groups)}묶음\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
