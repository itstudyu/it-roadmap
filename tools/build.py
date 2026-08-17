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
    ## ❓ 이해했는지         -> check    (접지 않는다. "- 물음 → 답이 있는 절" 로 자리를 가리킬 수 있다)
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

# 슬롯 이름 -> 그 슬롯이 받아주는 원본 제목들. 구조를 굽는 파서들이 이걸 통해
# 절을 찾는다. 제목 목록을 두 벌 두면 SECTION_MAP 에 표기를 하나 더해도
# 구조 쪽은 못 찾는 일이 생긴다 — 화면에는 보이는데 퀴즈에는 안 나오는 절이 된다.
SLOT_NAMES = {slot: names for slot, names in SECTION_MAP}

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


def short_path(path: str) -> str:
    """경고에 적을 경로. 저장소 안이면 'content/네트워크/DNS.md' 로 줄인다.

    밖이면 relpath 가 '../../..' 를 길게 늘어놓아 오히려 못 읽는다. 그럴 땐 그대로 쓴다.
    """
    rel = os.path.relpath(path, ROOT)
    return path if rel.startswith("..") else rel


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


def pick_entry(sections: dict[str, str], names: list[str]) -> tuple[str, str] | None:
    """(원본 제목, 본문). 어느 제목이 걸렸는지까지 알아야 하는 자리가 있다.

    접이식 칸은 원문 제목을 함께 싣는다. 확인 질문의 "→ 작동 원리" 는 저자가
    마크다운 제목으로 쓰는데 화면 이름표는 "어떻게 작동하나" 라, 두 이름을 다
    들고 있어야 그 질문이 실제 칸으로 이어진다.
    """
    for n in names:
        if n in sections:
            return n, sections[n]
    # 접두 매칭 (예: "📊 RAG 작동 원리" 같이 용어명이 낀 제목)
    for n in names:
        key = n.split(" ", 1)[-1] if " " in n else n
        for h, body in sections.items():
            if key in h:
                return h, body
    return None


def pick(sections: dict[str, str], names: list[str]) -> str | None:
    entry = pick_entry(sections, names)
    return entry[1] if entry else None


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


def own_sections(sections: dict[str, str], used: set[str]) -> list[dict]:
    """노트가 자기만의 제목을 쓰는 경우(예: "## 💡 HTTP 메서드")를 그대로 살린다.

    매핑에 없다고 버리면 그 노트는 읽을 게 정의밖에 남지 않는다.
    """
    found = []
    for heading, raw in sections.items():
        if heading in used or heading.startswith("📚"):
            continue
        cleaned = clean_body(raw)
        if len(cleaned) < 40:
            continue
        label = strip_leading_emoji(heading)
        found.append({"slot": guess_slot(label), "label": label,
                      "head": heading, "body": trim(cleaned)})
    return found


def warn_overflow(path: str, found: list[dict]) -> None:
    """상한을 넘겨 잘려나가는 칸이 있으면 말한다.

    조용히 버리면 저자는 자기가 쓴 절이 화면에 아예 없다는 것을 모른다.
    229편 중 199편에서 '정리'가 통째로 잘려 나갔던 것도 아무도 못 봤기 때문이다.
    경고일 뿐이라 종료 코드는 건드리지 않고, stdout 도 비워둔다 —
    거기로는 산출물 경로가 나갈 수 있다.
    """
    if len(found) <= MAX_SECTIONS:
        return
    where = short_path(path) if path else "(경로 모름)"
    log(f"  ⚠️ {where}: 접이식 {MAX_SECTIONS}칸을 넘어 잘림 — "
        + ", ".join(s["label"] for s in found[MAX_SECTIONS:]))


def collect_disclosure_sections(sections: dict[str, str], path: str = "") -> list[dict]:
    """접어서 보여줄 섹션들을 UI 노출 순서대로 모은다.

    각 칸은 화면 이름표(label)와 원문 제목(head)을 함께 들고 나간다.
    head 가 필요한 이유는 pick_entry 에 적었다.
    """
    found, used = [], set()
    for slot, names in SECTION_MAP:
        entry = pick_entry(sections, names)
        raw = entry[1] if entry else None
        if slot in PINNED:
            # 정의·그림·확인 질문·관련 용어는 접이식 밖에 따로 자리가 있다.
            # 여기서 안 빼면 같은 내용이 두 번 나오고, 접기 이름표도 없어서 터진다.
            used.update(h for h, b in sections.items() if raw is not None and b == raw)
            continue
        if entry is None:
            continue
        used.update(h for h, b in sections.items() if b == raw)
        cleaned = clean_body(raw)
        if len(cleaned) >= 12:
            found.append({"slot": slot, "label": SLOT_LABELS[slot],
                          "head": entry[0], "body": trim(cleaned)})

    found += own_sections(sections, used)
    order = {s: i for i, s in enumerate(DISCLOSURE_ORDER)}
    found.sort(key=lambda s: order.get(s["slot"], 99))
    warn_overflow(path, found)
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
        # 접이식과 같은 모양으로 낸다. head 가 있어야 확인 질문의 "→ 핵심 개념" 이
        # 정의 밑에서 접힌 하위 절에도 가서 닿는다.
        heading = nfc(parts[i]).strip()
        label = strip_leading_emoji(heading)
        chunk = parts[i + 1].strip()
        if label == "비유":
            # 비유는 parse_analogy 가 이미 전용 자리로 가져갔다. 여기서 안 빼면
            # 같은 문장이 정의 밑의 비유 상자와 접이식 패널로 두 번 나온다.
            # 게다가 접이식 여섯 칸 중 하나를 잡아먹어서 뒤쪽의 주의사항이 밀려난다.
            continue
        if len(chunk) >= 40:
            subs.append({"slot": guess_slot(label), "label": label,
                         "head": heading, "body": trim(chunk)})
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


# 도해 원문은 통째로 옮긴다 — 그리는 쪽은 js/ui.js 이고 figure 필드가 그 입력이다.
# 안쪽 줄까지 읽는 코드가 아래에 하나 생겼다(dia_parse). 퀴즈가 그림을 문제로
# 만들려면 마디를 낱개로 들어야 하는데, 화면 쪽에서 다시 파싱하면 두 파서가
# 갈라져서 화면과 퀴즈가 서로 다른 그림을 말하게 된다. 그래서 여기서 한 번 굽는다.
# 표기가 늘면 js/ui.js 의 diaParse 와 **함께** 고쳐야 한다.
#
# 도해 안에는 빈 줄이 없어서 한 덩어리가 한 문단으로 남고, clean_body 의 어떤
# 정규식도 여기에 걸리지 않는다. 다만 trim 은 길이로 자르니, 도해가 든 절이
# 1400자를 넘기면 펜스가 반토막 날 수 있다 (지금은 가장 긴 것이 665자다).
# 안쪽을 따로 잡는 정규식을 하나 더 두지 않고 이 하나에 괄호만 씌운다.
# 펜스를 찾는 길이 둘이면 언젠가 서로 다른 것을 찾는다.
DIA_BLOCK = re.compile(r"```도해\r?\n(.*?)\r?\n```\n?", re.S)

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


# 도해의 모양 셋. js/ui.js 는 이걸 CSS 클래스용 영문("flow"/"compare"/"layer")으로
# 바꿔 들지만 여기서는 원문 그대로 싣는다. 데이터에 화면 사정을 섞지 않는다.
DIA_SHAPES = ("흐름", "대조", "층")
DIA_HEAD = re.compile(r"^\s*(" + "|".join(DIA_SHAPES) + r")\s*:\s*(.*)$")


def dia_row(raw: str) -> dict:
    """도해 한 줄을 마디로 가른다. js/ui.js 의 diaRow 를 그대로 옮긴 것이다.

    표기 순서까지 같아야 한다 — 되돌아오는 표시(<)를 먼저 떼고, 이름(::)을 가르고,
    그다음에 두 칸(||)을 나눈다. 순서가 어긋나면 "< A :: B || C" 같은 줄에서
    두 파서가 다른 결과를 낸다.
    """
    text = raw.strip()
    back = bool(re.match(r"^<\s", text)) or text == "<"
    if back:
        text = re.sub(r"^<\s*", "", text)

    who = ""
    cut = text.find("::")
    if cut != -1:
        who = text[:cut].strip()
        text = text[cut + 2:].strip()

    # 중립 대조의 "A |=| B". 구분자가 다르니 그대로 "||" 로 가르면 한 칸도
    # 갈라지지 않는다. 우열을 뗄지 여부만 even 으로 남기고 구분자는 "||" 로 되돌린다.
    even = "|=|" in text
    if even:
        text = text.replace("|=|", "||")

    halves = text.split("||")  # 대조에서만 뜻이 있다
    row = {"who": who, "what": text}
    if back:
        row["back"] = True
    if len(halves) > 1:
        # 가른 두 칸은 대조 문제를 낼 때 쓴다. what 에도 "||" 가 그대로 남으므로
        # 원문이 필요한 쪽은 여전히 what 을 본다.
        row["left"] = halves[0].strip()
        row["right"] = halves[1].strip()
        if even:
            row["even"] = True
    return row


def dia_parse(source: str) -> dict | None:
    """도해 원문을 {shape, title, rows, sum, loop} 로 굽는다. js/ui.js 의 diaParse 와 같다.

    모양 선언이 없거나 마디가 하나도 없으면 도해가 아니다. 그럴 때 화면은
    코드블록으로 떨어뜨리는데, 여기서는 아예 싣지 않는다 — 퀴즈는 문법이 맞는
    그림만 문제로 낸다.
    """
    lines = [l for l in str(source).split("\n") if l.strip()]
    if not lines:
        return None

    head = DIA_HEAD.match(lines[0])
    if not head:
        return None  # 모양 선언이 없으면 도해가 아니다

    dia = {"shape": head.group(1), "title": head.group(2).strip(), "rows": [], "sum": ""}
    for raw in lines[1:]:
        line = raw.strip()
        end = re.match(r"^=\s*(.+)$", line)
        if end:
            dia["sum"] = end.group(1).strip()
            continue
        # @ 는 마디가 아니라 흐름 전체에 붙는 말이다 — "여기까지 오면 다시 처음으로".
        # 그래서 = 요약과 같은 방식으로 줄 목록에서 빼내 따로 든다.
        # 여러 줄이면 마지막 것만 남는다. 되돌아가는 길이 둘이면 그림은 길로 안 읽힌다.
        mark = re.match(r"^@\s+(.+)$", line)
        if mark:
            it = dia_row(mark.group(1))
            dia["loop"] = {"who": it["who"], "what": it["what"]}
            continue
        dia["rows"].append(dia_row(line))
    return dia if dia["rows"] else None


def parse_dia(figure: str, path: str) -> dict | None:
    """대표 그림 안의 도해를 구조로 굽는다. figure(원문 문자열)는 그대로 남긴다.

    화면이 그리는 것은 어디까지나 원문이고, 이건 퀴즈용 사본이다.
    """
    if not figure:
        return None
    found = DIA_BLOCK.search(figure)
    if not found:
        return None  # 그림 자리에 표나 문단만 있는 노트가 있다. 잘못은 아니다.
    dia = dia_parse(found.group(1))
    if dia is None:
        # 펜스는 있는데 안 풀렸다 = 문법이 어긋났다는 뜻이다. 화면에서는 코드블록으로
        # 떨어져 있어서 눈에 잘 안 띈다. 굽는 자리에서 말해주는 편이 낫다.
        log(f"  ⚠️ {short_path(path)}: 도해 문법이 어긋나 구조로 못 굽는다")
    return dia


def parse_check(body: str) -> list[dict]:
    """'❓ 이해했는지' 의 질문 목록. {"q": 물음, "at": 답이 있는 자리}.

    "- DNS 캐시는 왜 필요한가 → 작동 원리" 처럼 저자가 답이 있는 절을 적어두면
    갈라서 싣는다. 질문만 던지고 끝내면 회상 연습이 절반만 된다 — 답이 맞았는지
    확인할 길이 없고, 답의 절반은 접힌 칸 안에 있다. 화면은 at 을 보고 그 칸으로
    건너뛰는 단추를 붙인다.

    화살표는 **마지막** 것으로 자른다. 질문 본문에도 화살표가 들어간다
    ("요청 → 응답 사이에 무엇이 끼나 → 작동 원리").
    """
    out = []
    for line in body.split("\n"):
        if not re.match(r"^\s*[-*]\s+\S", line):
            continue
        text = re.sub(r"^\s*[-*]\s*", "", line).strip()
        question, arrow, at = text.rpartition("→")
        out.append({"q": question.strip(), "at": at.strip()} if arrow
                   else {"q": text, "at": ""})
    return out


# "- **앞** — 뒤" 한 줄. js/screens.js 의 parseMyths 와 **같은 정규식**이다.
# 대시는 em(—)·en(–)·하이픈 셋을 다 받는다. 저자가 셋을 섞어 쓰는데, 화면이
# 받아주는 줄을 여기서 못 받으면 같은 노트를 두고 화면과 퀴즈가 다른 말을 한다.
BOLD_PAIR = re.compile(r"^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$")


def parse_pairs(body: str) -> list[tuple[str, str]]:
    """'- **앞** — 뒤' 목록을 (앞, 뒤) 로 모은다.

    형식을 벗어난 줄은 건너뛴다. 슬롯에는 목록 말고도 문단·표·코드가 섞여 들어오고,
    그것까지 억지로 가르면 반쪽짜리 항목이 나온다. 한 줄도 못 뽑은 경우는
    부르는 쪽에서 알린다 — 여기서 조용히 빈 목록을 돌려주면 슬롯이 비었는지
    형식이 어긋났는지 구별할 수가 없다.
    """
    out = []
    for line in str(body or "").split("\n"):
        m = BOLD_PAIR.match(line)
        if m:
            out.append((m.group(1).strip(), m.group(2).strip()))
    return out


def structured_pairs(sections: dict[str, str], slot: str,
                     keys: tuple[str, str], path: str) -> list[dict]:
    """슬롯의 Markdown 목록을 구조로 굽는다. sections 는 손대지 않는다.

    화면은 지금도 이 슬롯의 **원문 Markdown** 을 받아 그린다(js/screens.js 의 mythPanel).
    여기서 뽑는 것은 그것과 별개로 퀴즈가 쓸 사본이다. 원문을 지우고 구조만
    남기면 파싱이 어긋나는 날 그 절이 화면에서 통째로 사라진다. 더하기만 한다.
    """
    raw = pick(sections, SLOT_NAMES[slot])
    if not raw:
        return []
    pairs = parse_pairs(raw)
    if not pairs:
        # 조용히 넘기면 형식이 어긋난 노트가 그대로 굳는다. 퀴즈에서 그 단어만
        # 안 나오는 것은 앱을 켜도 보이지 않는 종류의 고장이다.
        log(f"  ⚠️ {short_path(path)}: {slot} 에서 '- **앞** — 뒤' 를 한 줄도 못 뽑았다")
        return []
    return [{keys[0]: a, keys[1]: b} for a, b in pairs]


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


def ordered_sections(subs: list[dict], sections: dict[str, str], path: str = "") -> list[dict]:
    """접이식 섹션을 화면에 나올 순서대로 세운다. 왜 -> 어떻게 -> 개념 -> ... 순이다.

    path 는 잘려나가는 칸을 경고할 때 어느 노트인지 말하려고 들고 다닌다.
    """
    found = subs + collect_disclosure_sections(sections, path)
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

    note = {
        "term": term,
        "reading": reading,
        "category": category,
        "summary": summary,
        "definition": lead,
        "analogy": parse_analogy(definition),
        "sections": ordered_sections(subs, sections, path)[:MAX_SECTIONS],
        **pinned,
    }

    # 퀴즈가 쓰는 구조 사본. 셋 다 sections·figure 의 원문에서 뽑아낸 것이고
    # 원문은 그대로 남는다 — 화면은 지금도 원문으로 그린다.
    # 비면 아예 싣지 않는다. 빈 배열을 실어도 소비처가 하는 일은 같은데
    # 권별 본문만 무거워진다.
    for key, value in (
        ("myths", structured_pairs(sections, "myth", ("wrong", "right"), path)),
        ("cases", structured_pairs(sections, "example", ("label", "note"), path)),
        ("dia", parse_dia(pinned["figure"], path)),
    ):
        if value:
            note[key] = value
    return note


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


_ALIAS_SPLIT = re.compile(r"\s+vs\.?\s+|\s*&\s*|\s*/\s*|\s*_\s*|\s*·\s*", re.I)

# 쪼개도 별칭으로 삼지 않을 조각. 혼자서는 아무 단어도 가리키지 않는다.
_ALIAS_STOP = {"vs", "and", "or", "the", "a", "an", "of", "등", "및"}


def _alias_parts(name: str) -> list[str]:
    """복합 이름을 조각으로 쪼갠다. 쪼갤 게 없으면 빈 목록.

    `SSL/TLS` 의 별칭이 `ssl/tls` 와 `ssl_tls` 뿐이어서 본문의 "TLS" 가 이 앱이
    아는 말이 아니었다. HTTPS 의 정의 첫 문장이 "HTTP를 TLS로 감싸서" 인데
    그 TLS 를 누를 수 있게 만들어 줄 수조차 없었다는 뜻이다.

    공백은 함부로 쪼개지 않는다 — `HTTP Status Code` 를 쪼개면 "http" 가 나와서
    net--http 의 이름을 빼앗는다. 전부 대문자 약어가 늘어선 이름만 예외로
    공백에서도 쪼갠다(`SLA SLO SLI`, `DAU MAU`).
    """
    if not name:
        return []
    parts = [p.strip() for p in _ALIAS_SPLIT.split(name) if p.strip()]
    if len(parts) > 1:
        # 조각 하나가 한 글자면 구분자가 이름 안쪽에 있었다는 뜻이다.
        # `A/B Testing` 은 A 와 B 를 가른 것이 아니라 "A/B" 가 한 낱말이다.
        # 이걸 쪼개면 "B Testing" 같은 아무것도 아닌 별칭이 생긴다.
        if any(len(p) < 2 for p in parts):
            return []
        return parts
    toks = name.split()
    if len(toks) > 1 and all(re.fullmatch(r"[A-Z][A-Z0-9-]+", t) for t in toks):
        return toks
    return []


def widen_aliases(books: list[dict]) -> list[tuple[str, list[str]]]:
    """복합 이름의 조각을 별칭에 더한다. 남이 쓰는 이름은 빼앗지 않는다.

    충돌 검사가 전체를 봐야 하므로 노트별로는 못 하고 후처리로 한다.
    이미 누가 그 이름을 갖고 있으면 조용히 건너뛴다 — 별칭이 겹치면
    `[[링크]]` 가 엉뚱한 노트로 가고, 그건 조각 하나 얻는 값어치보다 나쁘다.
    """
    owned: dict[str, str] = {}
    for b in books:
        for t in b["terms"]:
            for a in t.get("aliases", ()):
                owned.setdefault(a, t["id"])

    gained: list[tuple[str, list[str]]] = []
    for b in books:
        for t in b["terms"]:
            add: list[str] = []
            for source in (t["term"], t.get("reading") or "",):
                for part in _alias_parts(source):
                    p = part.strip().lower()
                    if len(p) < 2 or p in _ALIAS_STOP or p.isdigit():
                        continue
                    if p in owned or p in add:
                        continue
                    add.append(p)
            if add:
                t["aliases"] = list(t["aliases"]) + add
                for p in add:
                    owned[p] = t["id"]
                gained.append((t["id"], add))
    return gained


def report_stock(books: list[dict]) -> None:
    """퀴즈가 쓸 재료가 몇 편에 실렸는지 센다.

    이 셋은 비어도 빌드가 통과한다(필드를 안 실을 뿐이다). 그래서 숫자를 안 찍으면
    파싱이 반쯤 깨진 채로 오래 간다 — 앱을 켜도 "그 유형이 안 나오네" 정도로만
    보이고, 그건 문제가 원래 적은 것과 구별이 안 된다. 편수는 사람이 노트를 세어
    맞춰볼 수 있는 유일한 값이라 여기서 매번 내놓는다.
    """
    terms = [t for b in books for t in b["terms"]]
    myth_notes = sum(1 for t in terms if t.get("myths"))
    myth_items = sum(len(t.get("myths", ())) for t in terms)
    case_notes = sum(1 for t in terms if t.get("cases"))
    case_items = sum(len(t.get("cases", ())) for t in terms)

    shapes: dict[str, int] = {}
    for t in terms:
        if t.get("dia"):
            shapes[t["dia"]["shape"]] = shapes.get(t["dia"]["shape"], 0) + 1
    drawn = sum(shapes.values())
    detail = " ".join(f"{s} {n}" for s, n in sorted(shapes.items(), key=lambda kv: -kv[1]))

    log(f"  퀴즈 재료      오해 {myth_notes}편 {myth_items}항목 · "
        f"사례 {case_notes}편 {case_items}항목 · 도해 {drawn}편 ({detail})")


def report(books: list[dict], dropped: list[str]) -> None:
    total = sum(len(b["terms"]) for b in books)
    log(f"단어장 {len(books)}권, 단어 {total}개")
    for b in books:
        drawn = sum(1 for t in b["terms"] if t["figure"])
        log(f"  {b['name']:14} {len(b['terms']):3}개   그림 {drawn}개")
    report_stock(books)
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
#
# myths·cases·dia 는 퀴즈가 쓰는데도 여기 있다. 퀴즈가 인덱스에서 문제를 만드는
# 유형(한 줄 뜻·관련 용어)과 달리, 이 셋으로 내는 문제는 **고른 범위의 권**을
# 이미 읽어놓은 상태에서만 만들면 된다. 인덱스로 올리면 시작할 때 항상 읽는
# 파일에 오해 687항목과 도해 229개가 얹혀 첫 화면이 그만큼 늦어진다.
BODY_FIELDS = ["definition", "analogy", "sections", "figure", "recap", "check",
               "myths", "cases", "dia"]

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
    widen_aliases(books)
    report(books, dropped)

    if args.dry_run:
        return 0

    emit(args.out_dir, books)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
