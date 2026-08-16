#!/usr/bin/env python3
"""content/*.md -> data/index.js + data/terms/<book>.js

    python3 tools/build.py              # 전체를 굽는다
    python3 tools/build.py --dry-run    # 무엇이 잡히는지만 본다

두 갈래로 굽는다. 목록·검색·퀴즈는 단어의 이름과 한 줄 뜻만 있으면 되는데,
예전에는 본문까지 한 파일에 담아 앱을 열 때마다 전부 파싱했다. 227단어에서
이미 1.33MB 였고, 이 앱은 단어가 계속 늘어나는 것을 전제로 한다.

    data/index.js          가벼운 것. 항상 읽는다.        약 50KB
    data/terms/<book>.js   본문. 단어를 펼칠 때만 읽는다.  권당 39~176KB

무엇을 어느 쪽에 두는지는 소비처가 정한다. aliases 는 관련 용어 링크를 풀 때
'전 단어'를 뒤지므로 인덱스에 있어야 하고, related 의 단어 이름은 퀴즈가
전체 풀에서 쓰므로 역시 인덱스에 있어야 한다. 관계 설명(note)은 상세 화면
전용이라 본문으로 간다.

content/ 가 원본이다. Obsidian vault 를 읽지 않는다 —
2026년 8월에 vault 를 이 repo 안으로 들여왔고 그 뒤로는 여기가 유일한 사본이다.
content/ 폴더는 그대로 Obsidian vault 로 열 수 있다. 동기화 대신 git 이 이력을 갖는다.

읽는 구조:
    # Term (원어)
    ## 📝 정의            -> 첫 문단 = 한 줄 뜻, 나머지 = 정의 본문
    ## 🖼️ 그림으로 보기     -> figure   (접지 않는다)
    ## ⚠️ 해결하는 문제     -> why
    ## ⚙️ 작동 원리        -> how
    ## 📊 비교             -> compare
    ## 💡 실제 사례         -> example
    ## ✅ 장단점           -> tradeoff
    ## 🚫 흔한 오해         -> myth
    ## 🚨 주의사항          -> caution
    ## 📝 정리             -> summary
    ## ❓ 이해했는지         -> check    (접지 않는다)
    ## 🔗 관련 용어         -> related

새 단어를 쓰는 형식은 docs/TERM-TEMPLATE.md 에 있다.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

# 표제어가 아닌 문서. 단어장에 넣지 않는다.
NOT_TERMS = {"INDEX.md", "IT_Expert_로드맵.md"}

# vault 의 이모지 제목을 앱의 의미론적 슬롯에 매핑한다.
# 한 슬롯에 여러 원본 제목이 들어올 수 있다 (노트마다 표기가 조금씩 다름).
SECTION_MAP = [
    ("definition", ["📝 정의"]),
    ("figure", ["🖼️ 그림으로 보기"]),
    ("concept", ["🎯 핵심 개념", "🎯 특징", "🎯 핵심"]),
    ("why", ["⚠️ 해결하는 문제", "🤔 왜 필요한가? (문제와 해결)", "🤔 왜 필요한가?", "🤔 왜 필요한가"]),
    ("how", ["⚙️ 작동 원리", "🔄 작동 원리 (상세 단계)", "🏗️ 구조"]),
    ("compare", ["📊 비교"]),
    ("example", ["💡 실제 사례", "💡 실제 사용 사례", "💡 예시", "🎯 실제 사례 (P3 시스템)", "💼 P3 시스템 실제 사례"]),
    ("tradeoff", ["✅ 장단점", "✅ 모범 사례 (Best Practices)"]),
    ("myth", ["🚫 흔한 오해"]),
    ("caution", ["🚨 주의사항"]),
    ("summary", ["📝 정리"]),
    ("check", ["❓ 이해했는지"]),
    ("related", ["🔗 관련 용어"]),
]

# 표제어 아래 접어서 보여줄 순서. UI 의 progressive disclosure 순서와 같다.
# figure 와 check 는 여기 없다 — 펼쳐진 채로 두는 자리라서 접이식에 들어가면 안 된다.
DISCLOSURE_ORDER = ["why", "how", "concept", "compare", "example", "tradeoff", "myth", "caution"]

# 앞에 세우는 자리. 접이식에서 빼고 따로 내보낸다.
#
# summary(📝 정리)가 여기 있는 이유: 접이식 상한이 6칸인데 정리는 순서상 맨 뒤라
# 229편 중 199편에서 통째로 잘려 나갔다. 템플릿의 필수 항목이 화면에 아예
# 닿지 못한 것이다. 정리는 카드가 아니라 마무리 문단 하나이고, 바로 뒤의
# 확인 질문과 짝을 이룬다(되짚고 나서 스스로 물어본다). 접이식에 두고
# 순서로 다투게 하는 대신 고정 자리로 뺀다.
PINNED = ("definition", "figure", "check", "related", "summary")

# 접기 버튼에 쓰는 이름. NN/g 의 원칙대로 "더보기" 같은 모호한 말 대신
# 열면 뭐가 나오는지 알 수 있는 이름을 쓴다.
SLOT_LABELS = {
    "concept": "핵심 개념",
    "why": "왜 필요한가",
    "how": "어떻게 작동하나",
    "compare": "무엇과 비교되나",
    "example": "실제 사례",
    "tradeoff": "장단점",
    "myth": "흔히 잘못 아는 것",
    "caution": "주의할 점",
    "summary": "한 번 더 정리",
}

# 한 단어당 접이식 섹션 상한. 스크롤 피로도를 관리한다.
# 그림과 확인 질문이 접이식 밖으로 나갔으므로 접히는 쪽에 한 칸을 더 줬다.
MAX_SECTIONS = 6

# 단어장 구성. 폴더를 그대로 쓰면 이름이 "AI_ML" 이 되고 크기가 1개에서 34개까지
# 들쭉날쭉해진다. 여기서 이름과 소개를 붙이고, 혼자 남는 폴더는 가까운 곳에 합친다.
# id 는 학습 기록의 열쇠다(localStorage 가 "{id}--{단어}" 로 저장한다). 바꾸지 말 것.
BOOKS = [
    {"id": "cs",    "name": "컴퓨터과학 기초", "blurb": "면접에서도, 설계에서도 계속 나온다",
     "folders": ["컴퓨터과학", "."]},
    {"id": "lang",  "name": "프로그래밍",     "blurb": "코드를 이루는 말들",
     "folders": ["프로그래밍", "데이터_형식"]},
    {"id": "net",   "name": "네트워크",       "blurb": "요청이 오가는 길",
     "folders": ["네트워크"]},
    {"id": "web",   "name": "웹 개발",        "blurb": "브라우저와 서버 사이에서 벌어지는 일",
     "folders": ["웹개발"]},
    {"id": "db",    "name": "데이터베이스",    "blurb": "데이터를 어디에 어떻게 두나",
     "folders": ["데이터베이스"]},
    {"id": "arch",  "name": "아키텍처 패턴",   "blurb": "규모가 커질 때 쓰는 구조",
     "folders": ["아키텍처"]},
    {"id": "sec",   "name": "보안 · 인증",    "blurb": "누구인지 확인하고 지키는 법",
     "folders": ["보안"]},
    {"id": "cloud", "name": "클라우드",       "blurb": "남의 컴퓨터를 빌려 쓰는 법",
     "folders": ["클라우드"]},
    {"id": "infra", "name": "인프라 · 운영",  "blurb": "띄우고, 굴리고, 지켜본다",
     "folders": ["인프라"]},
    {"id": "tool",  "name": "개발 도구",      "blurb": "매일 손에 잡는 것들",
     "folders": ["개발도구"]},
    {"id": "ai",    "name": "AI · LLM",      "blurb": "요즘 제품에 들어가는 말들",
     "folders": ["AI_ML"]},
    {"id": "pm",    "name": "제품 관리",      "blurb": "무엇을 왜 만드는지 정하는 말",
     "folders": ["제품관리", "비즈니스"]},
]

FOLDER_TO_BOOK = {f: b["id"] for b in BOOKS for f in b["folders"]}


def log(message: str) -> None:
    """CLI 진행 상황 보고. stdout 은 비워두고 stderr 로만 말한다."""
    sys.stderr.write(message + "\n")


# ---------------------------------------------------------------- 파싱


def nfc(s: str) -> str:
    """macOS/iCloud 는 파일명을 NFD 로 준다. 비교 전에 정규화한다."""
    return unicodedata.normalize("NFC", s)


def slugify(text: str, fallback: str) -> str:
    """URL 에 쓸 id.

    한글만 있는 이름은 ascii 가 한 글자도 안 남는다. 예전에는 그럴 때 fallback
    ("term")을 쓰고 겹치면 뒤에 순번을 붙였는데, 그러면 id 가 **목록에서의 자리**에
    묶인다. 보안 책에 한글 이름 노트를 하나 더 넣으면 sec--term-2 가 가리키던 단어가
    바뀌고, 그 열쇠로 저장해둔 학습 기록이 엉뚱한 단어에 가서 붙는다.

    그래서 이름에서 바로 뽑아내는 값을 쓴다. 목록이 어떻게 바뀌든 이름이 같으면
    id 도 같다. 읽어서 뜻을 알 수 있는 값은 아니지만, id 는 열쇠지 읽을거리가 아니다.
    """
    slug = re.sub(r"[^a-z0-9]+", "-", nfc(text).lower()).strip("-")
    if slug:
        return slug
    digest = hashlib.sha1(nfc(text).encode("utf-8")).hexdigest()[:8]
    return f"{fallback}-{digest}"


def strip_leading_emoji(h: str) -> str:
    """'💡 HTTP 메서드' -> 'HTTP 메서드'. 앱은 이모지를 아이콘으로 쓰지 않는다."""
    return re.sub(r"^[^\w가-힣(]+", "", h.strip()).strip()


def split_sections(text: str) -> dict[str, str]:
    """H2 단위로 본문을 자른다. 원본 순서와 표기를 그대로 보존한다.

    코드펜스 안은 건드리지 않는다. 정규식으로만 자르면 ```bash 블록 안의
    "## 주석" 한 줄이 새 섹션을 열어서 그 아래 본문이 통째로 다른 자리로 간다.
    검사기(check_template.py)는 펜스를 세고 있어서, 그대로 두면 검사기는
    통과시키는데 빌드에서만 깨지는 노트가 생긴다.
    """
    out: dict[str, str] = {}
    heading, buf, fenced = None, [], False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            fenced = not fenced
        if not fenced and re.match(r"^## (.+)$", line):
            if heading is not None and heading not in out:
                out[heading] = "\n".join(buf).strip()
            heading, buf = nfc(re.sub(r"^##\s+", "", line).strip()), []
            continue
        if heading is not None:
            buf.append(line)
    if heading is not None and heading not in out:
        out[heading] = "\n".join(buf).strip()
    return out


def pick(sections: dict[str, str], names: list[str]) -> str | None:
    for n in names:
        if n in sections:
            return sections[n]
    # 접두 매칭 (예: "📊 RAG 작동 원리" 같이 용어명이 낀 제목)
    for n in names:
        key = n.split(" ", 1)[-1] if " " in n else n
        for h, body in sections.items():
            if key in h:
                return body
    return None


def clean_body(body: str) -> str:
    """mermaid 블록과 문서 푸터를 제거한다. 나머지 마크다운은 그대로 둔다."""
    body = re.sub(r"```mermaid.*?```", "", body, flags=re.S)
    body = re.sub(r"^---\s*$.*\Z", "", body, flags=re.S | re.M)
    body = re.sub(r"^\*카테고리:.*$", "", body, flags=re.M)
    body = re.sub(r"^\*생성일:.*$", "", body, flags=re.M)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def first_paragraph(body: str) -> str:
    """정의의 첫 문단."""
    for block in body.split("\n\n"):
        b = block.strip()
        if not b or b.startswith(("#", "```", "- ", "|", ">")):
            continue
        return b
    return ""


def split_gist(paragraph: str, limit: int = 150) -> tuple[str, str]:
    """첫 문단을 '한 줄 뜻' 과 '나머지' 로 나눈다.

    항상 보이는 자리에 8줄짜리 문단이 들어가면 훑어볼 수가 없다.
    문장 경계에서 끊고 나머지는 본문으로 내린다. 원본 문장은 자르지 않는다.
    """
    if len(paragraph) <= limit:
        return paragraph, ""

    ends = [m.end() for m in re.finditer(r"(?:다|요)\.\s|[.!?]\s", paragraph)]
    for end in ends:
        if end >= limit * 0.4:
            return paragraph[:end].strip(), paragraph[end:].strip()
    return paragraph, ""


def parse_related(body: str) -> list[dict]:
    out = []
    for line in body.splitlines():
        m = re.match(r"^\s*-\s*\[\[([^\]\|]+)\]?\]?\s*:?\s*(.*)$", line)
        if m:
            out.append({"term": m.group(1).strip(), "note": m.group(2).strip()})
    return out


def parse_title(h1: str) -> tuple[str, str]:
    """'HTTP (HyperText Transfer Protocol)' -> ('HTTP', 'HyperText Transfer Protocol')"""
    m = re.match(r"^(.+?)\s*\((.+)\)\s*$", h1.strip())
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return h1.strip(), ""


def trim(body: str, limit: int = 1400) -> str:
    """목업이므로 긴 코드 덤프가 화면을 잡아먹지 않게 문단 경계에서 자른다."""
    if len(body) <= limit:
        return body
    cut = body[:limit]
    boundary = cut.rfind("\n\n")
    return (cut[:boundary] if boundary > limit * 0.5 else cut).rstrip()


# 노트가 자기만의 제목을 쓸 때 어느 학습 단계인지 추측한다.
# 순서가 중요하다: "왜 필요한가" 가 "실제 사례" 보다 먼저 읽혀야 한다.
SLOT_HINTS = [
    ("why", ("왜", "필요", "문제")),
    ("how", ("작동", "원리", "구조", "동작", "흐름", "과정")),
    ("concept", ("비유", "개념", "이해", "종류", "기능", "특징")),
    ("compare", ("비교", " vs ", "vs ", "차이")),
    ("tradeoff", ("장단점", "장점", "단점", "트레이드")),
    ("caution", ("주의", "고려", "함정", "위험", "보안")),
    ("example", ("사례", "활용", "구현", "예시", "실전", "설정")),
]


def guess_slot(label: str) -> str:
    low = label.lower()
    for slot, keys in SLOT_HINTS:
        if any(k.strip().lower() in low for k in keys):
            return slot
    return "example"


def collect_disclosure_sections(sections: dict[str, str]) -> list[dict]:
    """접어서 보여줄 섹션들을 UI 노출 순서대로 모은다."""
    found, used = [], set()
    for slot, names in SECTION_MAP:
        raw = pick(sections, names)
        if slot in PINNED:
            # 정의·그림·확인 질문·관련 용어는 접이식 밖에 따로 자리가 있다.
            # 여기서 안 빼면 같은 내용이 두 번 나오고, 접기 이름표도 없어서 터진다.
            used.update(h for h, b in sections.items() if raw is not None and b == raw)
            continue
        if raw is None:
            continue
        used.update(h for h, b in sections.items() if b == raw)
        cleaned = clean_body(raw)
        if len(cleaned) >= 12:
            found.append({"slot": slot, "label": SLOT_LABELS[slot], "body": trim(cleaned)})

    # 노트가 자기만의 제목을 쓰는 경우(예: "## 💡 HTTP 메서드")를 그대로 살린다.
    # 매핑에 없다고 버리면 그 노트는 읽을 게 정의밖에 남지 않는다.
    for heading, raw in sections.items():
        if heading in used or heading.startswith("📚"):
            continue
        cleaned = clean_body(raw)
        if len(cleaned) < 40:
            continue
        label = strip_leading_emoji(heading)
        found.append({"slot": guess_slot(label), "label": label, "body": trim(cleaned)})

    order = {s: i for i, s in enumerate(DISCLOSURE_ORDER)}
    found.sort(key=lambda s: order.get(s["slot"], 99))
    return found[:MAX_SECTIONS]


def split_subsections(body: str) -> tuple[str, list[dict]]:
    """정의 본문을 첫 H3 앞에서 자른다.

    노트의 '정의'에는 '### 핵심 개념', '### X가 해결하는 문제' 같은 하위 절이
    딸려 있는 경우가 많다. 그것까지 항상 펼쳐두면 첫 화면이 길어져서
    progressive disclosure 가 무너진다. 앞부분만 남기고 나머지는 접는다.
    """
    parts = re.split(r"^###\s+(.+)$", body, flags=re.M)
    lead = parts[0].strip()
    subs = []
    for i in range(1, len(parts) - 1, 2):
        label = strip_leading_emoji(nfc(parts[i]))
        chunk = parts[i + 1].strip()
        if label == "비유":
            # 비유는 parse_analogy 가 이미 전용 자리로 가져갔다. 여기서 안 빼면
            # 같은 문장이 정의 밑의 비유 상자와 접이식 패널로 두 번 나온다.
            # 게다가 접이식 여섯 칸 중 하나를 잡아먹어서 뒤쪽의 주의사항이 밀려난다.
            continue
        if len(chunk) >= 40:
            subs.append({"slot": guess_slot(label), "label": label, "body": trim(chunk)})
    return lead, subs


def parse_analogy(definition: str) -> str:
    """정의 안의 '### 비유' 한 줄. 처음 보는 개념에서 사람을 건너가게 하는 건
    대개 이것이라 본문에 섞지 않고 따로 뽑는다."""
    m = re.search(r"^###\s+비유\s*$\n(.+?)(?=\n\s*\n|\n###|\Z)", definition, flags=re.M | re.S)
    if not m:
        return ""
    body = m.group(1).strip()
    # 목록으로 쓴 노트가 있다. 첫 항목만 쓴다 — 비유가 셋이면 하나도 안 남는다.
    first = next((l for l in body.split("\n") if l.strip()), "")
    return re.sub(r"^\s*[-*]\s*", "", first).strip()


DIA_BLOCK = re.compile(r"```도해\r?\n.*?\r?\n```\n?", re.S)

# 대표 그림을 어디서 먼저 찾을지. 작동 원리에 있는 그림이 그 단어를 가장 잘 말한다.
LIFT_FROM = ["⚙️ 작동 원리", "🏗️ 구조", "📊 구조", "🔄 작동 원리", "🎯 핵심 개념", "⚠️ 해결하는 문제"]


def lift_figure(sections: dict[str, str]) -> str:
    """'🖼️ 그림으로 보기' 가 없는 노트에서 도해 하나를 끌어올린다.

    vault 에서 들여온 노트는 그림이 접이식 안에 들어 있다. 거기 두면
    펼쳐야만 보이는데, 그러면 그림을 맨 앞에 세운 이유가 없어진다.
    끌어올린 자리에서는 지운다 — 같은 그림이 두 번 나오면 안 된다.
    """
    order = [h for h in LIFT_FROM if h in sections] + [h for h in sections if h not in LIFT_FROM]
    for heading in order:
        found = DIA_BLOCK.search(sections[heading])
        if not found:
            continue
        sections[heading] = DIA_BLOCK.sub("", sections[heading], count=1).strip()
        return found.group(0).strip()
    return ""


def parse_check(body: str) -> list[str]:
    """'❓ 이해했는지' 의 질문 목록."""
    return [
        re.sub(r"^\s*[-*]\s*", "", l).strip()
        for l in body.split("\n")
        if re.match(r"^\s*[-*]\s+\S", l)
    ]


def split_definition(sections: dict[str, str]) -> tuple[str, str, str] | None:
    """정의를 (한 줄 뜻, 본문, 원본) 으로 나눈다."""
    raw = pick(sections, ["📝 정의"])
    if not raw:
        return None

    definition = clean_body(raw)
    opening = first_paragraph(definition)
    # 첫 문단은 정의 본문에서 빼서 중복 노출을 막는다.
    rest = definition[len(opening):].strip() if definition.startswith(opening) else definition
    summary, overflow = split_gist(opening)
    if overflow:
        rest = overflow + "\n\n" + rest if rest else overflow
    return summary, rest, definition


def ordered_sections(subs: list[dict], sections: dict[str, str]) -> list[dict]:
    """접이식 섹션을 화면에 나올 순서대로 세운다. 왜 -> 어떻게 -> 개념 -> ... 순이다."""
    found = subs + collect_disclosure_sections(sections)
    order = {s: i for i, s in enumerate(DISCLOSURE_ORDER)}
    found.sort(key=lambda s: order.get(s["slot"], 99))
    return found


def pinned_parts(sections: dict[str, str]) -> dict:
    """접이식 밖에 고정으로 두는 자리들을 한 번에 꺼낸다.

    접이식을 모으기 전에 불러야 한다. lift_figure 가 끌어올린 도해를
    원래 자리에서 지우기 때문에, 순서가 바뀌면 같은 그림이 두 번 나온다.
    """
    figure_raw = pick(sections, ["🖼️ 그림으로 보기"])
    recap_raw = pick(sections, ["📝 정리"])
    check_raw = pick(sections, ["❓ 이해했는지"])
    related_raw = pick(sections, ["🔗 관련 용어"])
    return {
        "figure": clean_body(figure_raw) if figure_raw else lift_figure(sections),
        "recap": clean_body(recap_raw) if recap_raw else "",
        "check": parse_check(check_raw) if check_raw else [],
        "related": parse_related(related_raw) if related_raw else [],
    }


def parse_note(path: str, category: str) -> dict | None:
    with open(path, encoding="utf-8") as f:
        text = f.read()

    title = re.search(r"^#\s+(.+)$", text, flags=re.M)
    if not title:
        return None

    sections = split_sections(text)
    split = split_definition(sections)
    if not split:
        return None
    summary, rest, definition = split

    pinned = pinned_parts(sections)
    lead, subs = split_subsections(rest)
    term, reading = parse_title(nfc(title.group(1)))

    return {
        "term": term,
        "reading": reading,
        "category": category,
        "summary": summary,
        "definition": lead,
        "analogy": parse_analogy(definition),
        "sections": ordered_sections(subs, sections)[:MAX_SECTIONS],
        **pinned,
    }


# ---------------------------------------------------------------- 수집


def note_paths() -> list[tuple[str, str]]:
    """(폴더, 경로) 목록. content/ 아래를 훑는다."""
    found = []
    for base, dirs, files in os.walk(CONTENT):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        rel = os.path.relpath(base, CONTENT)
        folder = "." if rel == "." else nfc(rel.split(os.sep)[0])
        for fn in sorted(files):
            if fn.endswith(".md") and nfc(fn) not in NOT_TERMS:
                found.append((folder, os.path.join(base, fn)))
    return found


def is_converted(path: str) -> bool:
    """새 템플릿으로 쓰인 노트인가. 그림 자리가 있으면 그렇다."""
    with open(path, encoding="utf-8") as f:
        return "## 🖼️ 그림으로 보기" in f.read()


def pick_one(paths: list[str]) -> str:
    """같은 이름의 노트가 여러 폴더에 있을 때 하나만 고른다.

    vault 에는 CDN 이 네트워크·아키텍처·인프라 세 곳에 있었다. 하나는 12,000자짜리
    본체고 나머지는 900자짜리 껍데기다 — 다른 단어장에서 가리키려고 둔 것이다.
    셋 다 넣으면 같은 단어가 퀴즈에 세 번 나오고, 그중 둘은 읽을 게 없다.

    크기로만 고르면 안 된다. 새 템플릿으로 다시 쓴 노트는 코드 덤프가 빠져서
    오히려 짧아지기 때문에, 잘 쓴 4천 자가 안 고친 8천 자에 진다.
    템플릿을 지키는 쪽을 먼저 보고, 그다음에 크기로 가른다.
    """
    return max(paths, key=lambda p: (is_converted(p), os.path.getsize(p)))


def title_of(path: str) -> str:
    """노트가 화면에 내걸 이름. 없으면 파일 이름으로 물러선다.

    중복을 파일 이름으로 세면 "LLM.md" 와 "LLM 1.md" 가 서로 다른 단어가 된다.
    실제로 그렇게 통과한 두 쌍이 있었고, 앱의 AI 단어장에 이름이 같은 카드가
    두 장씩 떴다. 사람이 보는 이름은 파일 이름이 아니라 제목이다.
    """
    with open(path, encoding="utf-8") as f:
        head = f.read(400)
    m = re.search(r"^#\s+(.+)$", head, flags=re.M)
    name = parse_title(nfc(m.group(1)))[0] if m else nfc(os.path.basename(path)[:-3])
    return name.strip()


def aliases_of(note: dict, path: str) -> list[str]:
    """이 단어를 부를 수 있는 이름들. `[[...]]` 를 여기에 맞춰 찾는다.

    노트 사이의 링크는 Obsidian 방식이라 **파일 이름**을 가리킨다. 그런데 화면에
    걸리는 이름은 H1 제목이다. 둘이 다른 노트가 많다 — 파일은 `Index.md` 인데
    제목은 `인덱스 (Index)` 인 식이다. 제목만 보고 찾으면 관련 용어 1,008개 중
    94개가 눌리지 않는 회색 글자로 남는다. 파일 이름과 괄호 안 원어까지 함께 싣는다.
    """
    names = [note["term"], note.get("reading") or "", nfc(os.path.basename(path)[:-3])]
    out: list[str] = []
    for n in names:
        n = n.strip().lower()
        if n and n not in out:
            out.append(n)
    return out


def collect() -> tuple[list[dict], list[str]]:
    by_name: dict[str, list[str]] = {}
    folder_of: dict[str, str] = {}
    for folder, path in note_paths():
        by_name.setdefault(title_of(path), []).append(path)
        folder_of.setdefault(path, folder)

    dropped = []
    chosen: dict[str, list[tuple[str, str]]] = {}
    for name, paths in sorted(by_name.items()):
        keep = pick_one(paths) if len(paths) > 1 else paths[0]
        dropped += [f"{name} ({folder_of[p]})" for p in paths if p != keep]
        book_id = FOLDER_TO_BOOK.get(folder_of[keep])
        if not book_id:
            dropped.append(f"{name}: 단어장이 없는 폴더 {folder_of[keep]}")
            continue
        chosen.setdefault(book_id, []).append((folder_of[keep], keep))

    books = []
    for spec in BOOKS:
        notes = []
        for _, path in chosen.get(spec["id"], []):
            parsed = parse_note(path, spec["name"])
            if parsed:
                parsed["aliases"] = aliases_of(parsed, path)
                notes.append(parsed)
            else:
                dropped.append(f"{os.path.basename(path)}: 정의 섹션 없음")
        if notes:
            books.append({"id": spec["id"], "name": spec["name"],
                          "blurb": spec["blurb"], "terms": notes})
    return books, dropped


# ---------------------------------------------------------------- 출력


def assign_ids(books: list[dict]) -> list[dict]:
    for b in books:
        seen: dict[str, int] = {}
        for t in b["terms"]:
            slug = slugify(t["term"], "term")
            seen[slug] = seen.get(slug, 0) + 1
            suffix = "" if seen[slug] == 1 else f"-{seen[slug]}"
            t["id"] = f"{b['id']}--{slug}{suffix}"
    return books


def report(books: list[dict], dropped: list[str]) -> None:
    total = sum(len(b["terms"]) for b in books)
    log(f"단어장 {len(books)}권, 단어 {total}개")
    for b in books:
        drawn = sum(1 for t in b["terms"] if t["figure"])
        log(f"  {b['name']:14} {len(b['terms']):3}개   그림 {drawn}개")
    if dropped:
        # 조용히 버리지 않는다. 무엇이 빠졌는지 말하지 않으면 다 들어간 것처럼 읽힌다.
        log(f"제외 {len(dropped)}건: " + ", ".join(dropped[:6]) + (" …" if len(dropped) > 6 else ""))


# ---------------------------------------------------------------- 나누기

# 목록·검색·퀴즈 선택이 쓰는 것. 이것만 있으면 상세 화면 밖의 모든 화면이 그려진다.
#
# aliases 와 related 는 크기만 보면 본문으로 내리고 싶지만 둘 다 '전 단어'를 훑는다.
#   aliases  관련 용어 링크를 풀 때 모든 단어의 별칭을 뒤진다 (js/screens.js)
#   related  관련 용어 퀴즈가 전체 풀에서 문제를 만든다 (js/quiz.js)
# 한 권만 로드된 상태에서 저 둘이 비면 링크가 끊기고 퀴즈 해설이 사라진다.
INDEX_FIELDS = ["id", "term", "reading", "category", "summary", "aliases", "related"]

# 단어를 펼쳤을 때만 필요한 것. 전체 무게의 87% 가 여기 있다.
BODY_FIELDS = ["definition", "analogy", "sections", "figure", "recap", "check"]

BANNER = (
    "// 이 파일은 tools/build.py 가 content/*.md 에서 생성한다. 직접 고치지 말 것.\n"
    "// 단어를 고치려면 content/ 의 Markdown 을 고치고 다시 굽는다.\n"
    "// 전역 변수로 내보낸다. ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.\n\n"
)


def split_payload(books: list[dict]) -> tuple[list[dict], dict[str, dict]]:
    """책 목록을 (인덱스, 권별 본문) 으로 가른다."""
    index, bodies = [], {}

    for b in books:
        idx_terms, body_terms = [], {}

        for t in b["terms"]:
            idx_terms.append({k: t[k] for k in INDEX_FIELDS if k in t})
            body_terms[t["id"]] = {k: t[k] for k in BODY_FIELDS if k in t}

        index.append({"id": b["id"], "name": b["name"], "blurb": b["blurb"], "terms": idx_terms})
        bodies[b["id"]] = body_terms

    return index, bodies


def write_js(path: str, statement: str) -> int:
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(BANNER + statement)
    return os.path.getsize(path)


def dumps(obj) -> str:
    """들여쓰기 없이 굽는다. 생성물이라 사람이 읽을 일이 없고, 13% 가 공백이었다."""
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def is_ours(path: str) -> bool:
    """이 저장소가 굽는 생성물 자리인가.

    비어 있으면 우리 것으로 친다(처음 굽는 경우). 아니면 안에 있는 .js 가
    전부 build.py 가 쓴 배너를 달고 있어야 한다. 사람이 쓴 파일이 하나라도
    섞여 있으면 여기는 우리 자리가 아니다.
    """
    names = [n for n in os.listdir(path) if n.endswith(".js")]
    if not names:
        return True
    marker = "tools/build.py 가"
    for n in names:
        try:
            with open(os.path.join(path, n), encoding="utf-8") as f:
                if marker not in f.read(400):
                    return False
        except (OSError, UnicodeDecodeError):
            return False
    return True


def write_bodies(terms_dir: str, bodies: dict[str, dict]) -> int:
    """권별 본문 청크를 쓴다. 쓰기 전에 옛 청크를 비운다.

    권이 사라졌는데 그 청크가 남아 있으면, 앱은 안 쓰지만 서비스 워커는 계속
    받아 간다. 오프라인 캐시에 유령이 쌓이는 것을 막는다.

    지우기 전에 이 디렉터리가 우리 것인지 확인한다. --out-dir 은 그냥 문자열이라
    오타 하나로 엉뚱한 곳을 가리킬 수 있는데, 그러면 그 안의 .js 를 확장자만 보고
    전부 지운다. 남의 소스 디렉터리에서 이 일이 벌어지면 되돌릴 수 없다.
    """
    if os.path.isdir(terms_dir) and not is_ours(terms_dir):
        raise ValueError(
            f"{terms_dir} 는 이 저장소의 생성물 디렉터리가 아니다. "
            "여기 있는 .js 를 지우지 않는다 — --out-dir 을 확인해라."
        )

    if os.path.isdir(terms_dir):
        for fn in os.listdir(terms_dir):
            if fn.endswith(".js"):
                os.remove(os.path.join(terms_dir, fn))

    total = 0
    for book_id, terms in bodies.items():
        total += write_js(
            os.path.join(terms_dir, f"{book_id}.js"),
            "window.VOCAB_TERMS = window.VOCAB_TERMS || {};\n"
            f"window.VOCAB_TERMS[{json.dumps(book_id)}] = " + dumps(terms) + ";\n",
        )
    return total


def emit(out_dir: str, books: list[dict]) -> None:
    index, bodies = split_payload(books)

    idx_size = write_js(
        os.path.join(out_dir, "index.js"),
        "window.VOCABULARY_INDEX = " + dumps(index) + ";\n",
    )
    body_total = write_bodies(os.path.join(out_dir, "terms"), bodies)

    log(f"작성함: data/index.js  ({idx_size / 1024:,.0f} KB)  <- 시작할 때 읽는 전부")
    log(f"        data/terms/*.js  {len(bodies)}개  ({body_total / 1024:,.0f} KB)  <- 펼칠 때만")

    # 옛 단일 파일이 남아 있으면 index.html 을 안 고쳤을 때 조용히 옛 데이터가 뜬다.
    legacy = os.path.join(out_dir, "vocabulary.js")
    if os.path.exists(legacy):
        os.remove(legacy)
        log("        data/vocabulary.js 삭제 (인덱스/본문으로 갈렸다)")

    bump_cache_version()


def precache_paths(sw_text: str) -> list[str]:
    """sw.js 의 PRECACHE 배열에 적힌 경로들."""
    block = re.search(r"var PRECACHE = \[(.*?)\];", sw_text, re.S)
    if not block:
        return []
    return [p for p in re.findall(r'"([^"]+)"', block.group(1)) if p != "./"]


def precache_digest(paths: list[str]) -> str:
    """precache 대상 파일들의 바이트를 전부 넣어 해시를 만든다.

    처음에는 인덱스만 해싱했는데, 그건 무게의 13% 밖에 안 덮는다. 단어 본문만
    고치면(data/terms/*.js 는 바뀌고 data/index.js 는 안 바뀜) 해시가 그대로라
    sw.js 도 그대로고, 서비스 워커가 재설치되지 않는다. fetch 핸들러가 캐시
    우선이라 홈 화면에 설치한 사람은 **영원히 옛 본문을 본다.** css·js 를 고쳐도
    마찬가지였다.

    그래서 서비스 워커가 실제로 담는 것을 그대로 해싱한다. 무엇이 바뀌든
    담기는 것이 바뀌면 버전이 오른다.

    파일이 없으면 여기서 크게 실패한다. PRECACHE 는 손으로 적은 목록이고
    build.py 가 굽는 파일 이름과 어긋날 수 있는데, 그대로 배포되면 install 의
    addAll 이 통째로 실패해서 **서비스 워커가 아예 설치되지 않는다.** 사용자에게는
    "오프라인이 안 되네" 정도로만 보이는 조용한 실패다. 빌드에서 잡는 게 맞다.
    """
    h = hashlib.sha1()
    for rel in sorted(paths):
        full = os.path.join(ROOT, rel)
        if not os.path.exists(full):
            raise FileNotFoundError(
                f"sw.js 의 PRECACHE 에 있는 {rel} 이 없다. "
                "이대로 배포하면 서비스 워커가 설치되지 않아 오프라인이 통째로 죽는다."
            )
        h.update(rel.encode("utf-8"))
        with open(full, "rb") as f:
            h.update(f.read())
    return h.hexdigest()[:12]


def replace_version(text: str, digest: str) -> str:
    new_text, n = re.subn(
        r'(CACHE_VERSION = ")[^"]*(")',
        lambda m: m.group(1) + digest + m.group(2),
        text,
        count=1,
    )
    if not n:
        raise ValueError(
            "sw.js 에서 CACHE_VERSION 을 못 찾았다. 이대로 두면 데이터를 새로 구워도 "
            "설치된 앱에는 영원히 안 보인다."
        )
    return new_text


def bump_cache_version() -> None:
    """sw.js 의 CACHE_VERSION 을 precache 대상 전체의 해시로 맞춘다.

    서비스 워커는 '그 파일의 바이트'가 바뀌어야 재설치된다. 데이터만 새로 굽고
    이 값을 그대로 두면, 홈 화면에 설치한 앱에는 새 단어가 영원히 안 보인다.
    사람이 기억해서 올리는 방식은 언젠가 잊는다 — 특히 이걸 굽는 게 사람이
    아니라 주 3회 도는 루틴이 되면 반드시 잊는다. 그래서 굽는 김에 같이 고친다.

    내용 해시라서 아무것도 안 바뀌면 값도 안 바뀐다. 의미 없는 커밋이 안 생긴다.
    """
    sw = os.path.join(ROOT, "sw.js")
    if not os.path.exists(sw):
        log("  ⚠️ sw.js 가 없다 — 오프라인 갱신 표시를 건너뛴다")
        return

    with open(sw, encoding="utf-8") as f:
        text = f.read()

    paths = precache_paths(text)
    if not paths:
        raise ValueError("sw.js 에서 PRECACHE 목록을 못 찾았다. 오프라인 갱신이 막힌다")

    digest = precache_digest(paths)
    new_text = replace_version(text, digest)
    if new_text == text:
        log(f"        sw.js CACHE_VERSION 그대로 ({digest}, precache {len(paths)}개)")
        return

    with open(sw, "w", encoding="utf-8") as f:
        f.write(new_text)
    log(f"        sw.js CACHE_VERSION -> {digest} (precache {len(paths)}개)")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=os.path.join(ROOT, "data"))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not os.path.isdir(CONTENT):
        log(f"content/ 를 찾을 수 없음: {CONTENT}")
        return 1

    books, dropped = collect()
    assign_ids(books)
    report(books, dropped)

    if args.dry_run:
        return 0

    emit(args.out_dir, books)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
