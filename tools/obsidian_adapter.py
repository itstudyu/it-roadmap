#!/usr/bin/env python3
"""
Obsidian IT단어장 -> 학습 웹앱 데이터 어댑터

원본 Markdown 은 절대 수정하지 않는다. 읽기 전용이다.

vault 의 실제 구조를 파싱한다:
    # Term (한글 읽기)
    ## 📝 정의          -> 첫 문단 = 한 줄 뜻, 나머지 = 정의 본문
    ## 🎯 핵심 개념      -> concept
    ## ⚠️ 해결하는 문제   -> why      (## 🤔 왜 필요한가? 도 같은 슬롯)
    ## ⚙️ 작동 원리      -> how
    ## 📊 비교           -> compare
    ## 💡 실제 사례       -> example  (## 💡 예시 도 같은 슬롯)
    ## ✅ 장단점         -> tradeoff
    ## 🚨 주의사항        -> caution
    ## 🔗 관련 용어       -> related  (- [[X]]: 설명)

사용법:
    # 목업용 큐레이션 세트 (기본)
    python3 tools/obsidian_adapter.py --out data/vocabulary.js

    # vault 전체
    python3 tools/obsidian_adapter.py --all --out data/vocabulary.full.js

    # 확인만
    python3 tools/obsidian_adapter.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata

VAULT = os.path.expanduser(
    "~/Library/Mobile Documents/iCloud~md~obsidian/Documents/IT단어장"
)

# vault 의 이모지 제목을 앱의 의미론적 슬롯에 매핑한다.
# 한 슬롯에 여러 원본 제목이 들어올 수 있다 (노트마다 표기가 조금씩 다름).
SECTION_MAP = [
    ("definition", ["📝 정의"]),
    ("concept", ["🎯 핵심 개념", "🎯 특징", "🎯 핵심"]),
    ("why", ["⚠️ 해결하는 문제", "🤔 왜 필요한가? (문제와 해결)", "🤔 왜 필요한가?", "🤔 왜 필요한가"]),
    ("how", ["⚙️ 작동 원리", "🔄 작동 원리 (상세 단계)", "🏗️ 구조"]),
    ("compare", ["📊 비교"]),
    ("example", ["💡 실제 사례", "💡 실제 사용 사례", "💡 예시", "🎯 실제 사례 (P3 시스템)", "💼 P3 시스템 실제 사례"]),
    ("tradeoff", ["✅ 장단점", "✅ 모범 사례 (Best Practices)"]),
    ("caution", ["🚨 주의사항"]),
    ("summary", ["📝 정리"]),
    ("related", ["🔗 관련 용어"]),
]

# 표제어 아래 접어서 보여줄 순서. UI 의 progressive disclosure 순서와 같다.
DISCLOSURE_ORDER = ["why", "how", "concept", "compare", "example", "tradeoff", "caution", "summary"]

# 접기 버튼에 쓰는 이름. NN/g 의 원칙대로 "더보기" 같은 모호한 말 대신
# 열면 뭐가 나오는지 알 수 있는 이름을 쓴다.
SLOT_LABELS = {
    "concept": "핵심 개념",
    "why": "왜 필요한가",
    "how": "어떻게 작동하나",
    "compare": "무엇과 비교되나",
    "example": "실제 사례",
    "tradeoff": "장단점",
    "caution": "주의할 점",
    "summary": "한 번 더 정리",
}

# 한 단어당 접이식 섹션 상한. 스크롤 피로도를 관리한다.
MAX_SECTIONS = 5

# 목업용 큐레이션. 단어장 6개 x 5~6개. 전체 방향을 보여주는 게 목적이므로 일부러 작게 유지한다.
CURATED = [
    {
        "id": "net",
        "name": "네트워크 기초",
        "blurb": "요청이 오가는 길을 이해한다",
        "folder": "네트워크",
        "terms": ["HTTP", "HTTPS", "TCP", "DNS", "Load Balancer", "CDN"],
    },
    {
        "id": "arch",
        "name": "아키텍처 패턴",
        "blurb": "규모가 커질 때 쓰는 구조",
        "folder": "아키텍처",
        "terms": ["API Gateway", "Circuit Breaker", "Message Queue", "Rate Limiting", "Pub-Sub", "Sharding"],
    },
    {
        "id": "ai",
        "name": "AI · LLM",
        "blurb": "요즘 제품에 들어가는 말들",
        "folder": "AI_ML",
        "terms": ["LLM", "RAG", "Embedding", "Vector DB", "Token", "Hallucination"],
    },
    {
        "id": "sec",
        "name": "보안 · 인증",
        "blurb": "누구인지 확인하고 지키는 법",
        "folder": "보안",
        "terms": ["JWT", "OAuth", "SSO", "SQL Injection", "XSS", "Zero Trust"],
    },
    {
        "id": "infra",
        "name": "클라우드 · 인프라",
        "blurb": "코드가 실제로 돌아가는 곳",
        "folder": None,  # 여러 폴더에 걸쳐 있다
        "terms": ["Docker", "Kubernetes", "Serverless", "CI_CD", "Container", "VPC"],
    },
    {
        "id": "cs",
        "name": "컴퓨터과학 기초",
        "blurb": "면접에서도, 설계에서도 계속 나온다",
        "folder": "컴퓨터과학",
        "terms": ["Cache", "Stack", "Queue", "Thread", "Big O 표기법", "Hash"],
    },
]


def log(message: str) -> None:
    """CLI 진행 상황 보고. stdout 은 비워두고 stderr 로만 말한다."""
    sys.stderr.write(message + "\n")


# ---------------------------------------------------------------- 파싱


def nfc(s: str) -> str:
    """macOS/iCloud 는 파일명을 NFD 로 준다. 비교 전에 정규화한다."""
    return unicodedata.normalize("NFC", s)


def slugify(text: str, fallback: str) -> str:
    """URL 에 쓸 id. 한글만 있는 이름은 ascii 가 남지 않으므로 fallback 을 받는다."""
    return re.sub(r"[^a-z0-9]+", "-", nfc(text).lower()).strip("-") or fallback


def strip_leading_emoji(h: str) -> str:
    """'💡 HTTP 메서드' -> 'HTTP 메서드'. 앱은 이모지를 아이콘으로 쓰지 않는다."""
    return re.sub(r"^[^\w가-힣(]+", "", h.strip()).strip()


def split_sections(text: str) -> dict[str, str]:
    """H2 단위로 본문을 자른다. 원본 순서와 표기를 그대로 보존한다."""
    out: dict[str, str] = {}
    parts = re.split(r"^## (.+)$", text, flags=re.M)
    # parts[0] = H1 앞부분, 이후 (heading, body) 쌍
    for i in range(1, len(parts) - 1, 2):
        heading = nfc(parts[i].strip())
        body = parts[i + 1].strip()
        if heading not in out:
            out[heading] = body
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
        if slot in ("definition", "related"):
            # 이미 표제어 영역과 관련 개념 영역에서 쓰고 있다. 접이식에서는 뺀다.
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
        if len(chunk) >= 40:
            subs.append({"slot": guess_slot(label), "label": label, "body": trim(chunk)})
    return lead, subs


def parse_note(path: str, category: str) -> dict | None:
    with open(path, encoding="utf-8") as f:
        text = f.read()

    title = re.search(r"^#\s+(.+)$", text, flags=re.M)
    if not title:
        return None

    sections = split_sections(text)
    definition_raw = pick(sections, ["📝 정의"])
    if not definition_raw:
        return None

    definition = clean_body(definition_raw)
    opening = first_paragraph(definition)
    # 첫 문단은 정의 본문에서 빼서 중복 노출을 막는다.
    rest = definition[len(opening) :].strip() if definition.startswith(opening) else definition
    summary, overflow = split_gist(opening)
    if overflow:
        rest = overflow + "\n\n" + rest if rest else overflow
    lead, subs = split_subsections(rest)

    found = subs + collect_disclosure_sections(sections)
    order = {s: i for i, s in enumerate(DISCLOSURE_ORDER)}
    found.sort(key=lambda s: order.get(s["slot"], 99))

    term, reading = parse_title(nfc(title.group(1)))
    related_raw = pick(sections, ["🔗 관련 용어"])

    return {
        "term": term,
        "reading": reading,
        "category": category,
        "summary": summary,
        "definition": lead,
        "sections": found[:MAX_SECTIONS],
        "related": parse_related(related_raw) if related_raw else [],
    }


# ---------------------------------------------------------------- 수집


def find_note(folder: str | None, term: str) -> str | None:
    """폴더가 지정되면 거기서, 아니면 vault 전체에서 찾는다."""
    roots = [os.path.join(VAULT, folder)] if folder else [VAULT]
    for root in roots:
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in (".obsidian", "skills")]
            for fn in filenames:
                if not fn.endswith(".md"):
                    continue
                if nfc(fn[:-3]).lower() == nfc(term).lower():
                    return os.path.join(dirpath, fn)
    return None


def collect_curated() -> list[dict]:
    books = []
    for spec in CURATED:
        notes = []
        for term in spec["terms"]:
            path = find_note(spec["folder"], term)
            if not path:
                log(f"  [건너뜀] {spec['name']} / {term}: 노트를 찾지 못함")
                continue
            n = parse_note(path, spec["name"])
            if n:
                notes.append(n)
            else:
                log(f"  [건너뜀] {term}: 정의 섹션 없음")
        books.append(
            {"id": spec["id"], "name": spec["name"], "blurb": spec["blurb"], "terms": notes}
        )
    return books


def collect_all() -> list[dict]:
    books: dict[str, dict] = {}
    for dirpath, dirnames, filenames in os.walk(VAULT):
        dirnames[:] = [d for d in dirnames if d not in (".obsidian", "skills")]
        rel = os.path.relpath(dirpath, VAULT)
        category = "기본" if rel == "." else nfc(rel.split(os.sep)[0])
        for fn in sorted(filenames):
            if not fn.endswith(".md") or fn in ("INDEX.md",):
                continue
            n = parse_note(os.path.join(dirpath, fn), category)
            if not n:
                continue
            # 폴더명이 한글이면 ascii 슬러그가 비므로 폴더명 자체로 키를 잡는다.
            # 슬러그로 키를 잡으면 한글 폴더가 전부 하나로 합쳐진다.
            book = books.setdefault(
                category,
                {"id": slugify(category, f"book-{len(books) + 1}"), "name": category, "blurb": "", "terms": []},
            )
            book["terms"].append(n)
    return [b for b in books.values() if b["terms"]]


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


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="vault 전체를 변환")
    ap.add_argument("--out", help="출력 .js 경로")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not os.path.isdir(VAULT):
        log(f"vault 를 찾을 수 없음: {VAULT}")
        return 1

    books = assign_ids(collect_all() if args.all else collect_curated())
    total = sum(len(b["terms"]) for b in books)
    log(f"단어장 {len(books)}개, 단어 {total}개")

    if args.dry_run or not args.out:
        for b in books:
            log(f"  {b['name']}: {', '.join(t['term'] for t in b['terms'])}")
        return 0

    payload = json.dumps(books, ensure_ascii=False, indent=2)
    banner = (
        "// 이 파일은 tools/obsidian_adapter.py 가 생성한다. 직접 고치지 말 것.\n"
        f"// 원본: {VAULT}\n"
        "// 원본 Markdown 은 읽기만 하며 수정하지 않는다.\n"
        "// 전역 변수로 내보낸다. ES module 로 하면 file:// 로 열 때 CORS 에 막힌다.\n\n"
    )
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(banner + "window.VOCABULARY_DATA = " + payload + ";\n")
    log(f"작성함: {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
