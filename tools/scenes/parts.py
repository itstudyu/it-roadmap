#!/usr/bin/env python3
"""장면 컷 만화의 부품 — 배우·사물·표시를 한 손으로 그린다.

각본은 여럿이 쓰고 그림은 여기 하나가 그린다. 327편의 그림이 같은 세계에
살게 하는 유일한 방법이다 — 편마다 자유롭게 그리면 스무 편째에 이미 다른
앱처럼 보인다.

한 규격:
    선 굵기   배우 1.8 · 표정 1.7 · 이름표 1.5 · 지시선 1.3
    모서리    배우 6 · 이름표 5 · 컷 12
    색        var(--ink) 배우 · var(--ink-3) 화살표와 구경꾼 · var(--st-reading) 이야기의 사물
    키        art 상자는 48 을 넘지 않는다. 위 22px 은 말풍선 자리다.

부품은 (svg, box) 를 돌려준다. box 는 (x, y, w, h) 로, 화살표와 이름표가
어디서 시작하고 끝나는지 계산하는 데 쓴다. 좌표는 전부 절대값이다 —
컷 안에서 상대 좌표를 쓰면 컷 순서를 바꿀 때마다 그림이 흐트러진다.

얼굴은 그 컷에서 **행동하는 쪽**에만 붙이고 표정이 상태를 말한다.
구경꾼은 눈과 일자 입만 — 그래야 눈이 주인공을 먼저 찾는다.
"""

from __future__ import annotations

INK = "var(--ink)"
INK2 = "var(--ink-2)"
INK3 = "var(--ink-3)"
LINE = "var(--line-strong)"
AC = "var(--st-reading)"
ACBG = "var(--st-reading-bg)"
SUF = "var(--surface)"
SUNK = "var(--surface-sunken)"
MONO = "var(--font-mono)"

ART_MAX_H = 48   # 배우 그림의 최대 높이. 위쪽 22px 을 말풍선에 남긴다.


def esc(text: str) -> str:
    return (str(text).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def n(v: float) -> str:
    """좌표를 짧게. 1.0 -> 1, 1.50 -> 1.5"""
    r = round(float(v), 1)
    return str(int(r)) if r == int(r) else str(r)


# ---------------------------------------------------------------- 표정

def face(cx: float, cy: float, mood: str, span: float = 11) -> str:
    """눈 둘과 입 하나. mood 는 happy · sad · flat · none.

    span 은 두 눈 사이 거리다. 배우가 작아도 눈 크기는 그대로 둔다 —
    눈이 작아지면 표정이 안 읽히고, 표정이 안 읽히면 얼굴을 붙인 뜻이 없다.
    """
    if mood in ("none", "", None):
        return ""
    half = span / 2
    eyes = (f'<circle cx="{n(cx - half)}" cy="{n(cy)}" r="2" fill="{INK}"/>'
            f'<circle cx="{n(cx + half)}" cy="{n(cy)}" r="2" fill="{INK}"/>')
    my = cy + 11
    w = span + 3
    if mood == "happy":
        mouth = (f'<path d="M{n(cx - w / 2)} {n(my - 2)}q{n(w / 2)} 6 {n(w)} 0" '
                 f'fill="none" stroke="{INK}" stroke-width="1.7" stroke-linecap="round"/>')
    elif mood == "sad":
        mouth = (f'<path d="M{n(cx - w / 2)} {n(my + 1)}q{n(w / 2)} -6 {n(w)} 0" '
                 f'fill="none" stroke="{INK}" stroke-width="1.7" stroke-linecap="round"/>')
    else:
        mouth = (f'<line x1="{n(cx - w / 2)}" y1="{n(my)}" x2="{n(cx + w / 2)}" y2="{n(my)}" '
                 f'stroke="{INK}" stroke-width="1.7" stroke-linecap="round"/>')
    return eyes + mouth


def box_of(cx: float, bottom: float, w: float, h: float) -> tuple[float, float, float, float]:
    """가운데 x 와 바닥 y 로 상자를 세운다. 배우는 전부 같은 바닥에 선다."""
    return (cx - w / 2, bottom - h, w, h)


def frame(x, y, w, h, rx=6, stroke=INK, sw=1.8, fill=SUF) -> str:
    return (f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="{n(rx)}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def line(x1, y1, x2, y2, stroke=INK, sw=1.8, dash="") -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" '
            f'stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"{d}/>')


# ---------------------------------------------------------------- 배우

def phone(cx, bottom, mood="flat"):
    """폰 30×48. 얼굴이 있으면 홈 버튼 줄을 그리지 않는다 — 입이 둘로 보인다."""
    x, y, w, h = box_of(cx, bottom, 30, 48)
    svg = frame(x, y, w, h)
    if mood in ("none", "", None):
        svg += line(cx - 5, y + h - 7, cx + 5, y + h - 7, INK, 1.7)
    else:
        svg += face(cx, y + h * 0.36, mood, 10)
    return svg, (x, y, w, h)


def router(cx, bottom, mood="flat"):
    """공유기 60×22. 안테나 둘이 위로 선다."""
    x, y, w, h = box_of(cx, bottom, 60, 22)
    svg = (line(x + 12, y, x + 12, y - 15, INK, 1.8)
           + line(x + w - 12, y, x + w - 12, y - 10, INK, 1.8)
           + frame(x, y, w, h))
    if mood in ("none", "", None):
        svg += (f'<circle cx="{n(x + w - 14)}" cy="{n(y + 11)}" r="1.8" fill="{INK3}"/>'
                f'<circle cx="{n(x + w - 23)}" cy="{n(y + 11)}" r="1.8" fill="{INK3}"/>')
    else:
        svg += face(cx - 8, y + 9, mood, 10)
    return svg, (x, y - 15, w, h + 15)


def desktop(cx, bottom, mood="flat"):
    """컴퓨터 58×48. 모니터와 받침. 폰과 헷갈리지 않는 몸집이라 보내는 쪽에 쓴다."""
    mw, mh = 58, 38
    x, y, w, h = box_of(cx, bottom, mw, 48)
    svg = (frame(x, y, mw, mh)
           + line(cx, y + mh, cx, y + mh + 7, INK, 1.8)
           + line(cx - 14, y + 48, cx + 14, y + 48, INK, 1.8))
    svg += face(cx, y + mh * 0.42, mood, 15)
    return svg, (x, y, w, h)


def server(cx, bottom, mood="flat"):
    """서버 36×48. 칸 셋으로 나뉜 상자. 램프가 왼쪽에 선다."""
    x, y, w, h = box_of(cx, bottom, 36, 48)
    svg = frame(x, y, w, h, rx=5)
    svg += line(x, y + h / 3, x + w, y + h / 3, INK, 1.3)
    svg += line(x, y + h * 2 / 3, x + w, y + h * 2 / 3, INK, 1.3)
    if mood in ("none", "", None):
        for i in range(3):
            svg += f'<circle cx="{n(x + 7)}" cy="{n(y + 8 + i * 16)}" r="1.8" fill="{INK3}"/>'
    else:
        svg += face(cx, y + h / 2, mood, 11)
    return svg, (x, y, w, h)


def person(cx, bottom, mood="flat"):
    """사람 28×46. 동그란 머리와 어깨."""
    x, y, w, h = box_of(cx, bottom, 28, 46)
    head_r = 11
    svg = (f'<circle cx="{n(cx)}" cy="{n(y + head_r)}" r="{n(head_r)}" '
           f'fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
    svg += (f'<path d="M{n(x)} {n(y + h)}a{n(w / 2)} 15 0 0 1 {n(w)} 0" '
            f'fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
    svg += face(cx, y + head_r - 2, mood, 8)
    return svg, (x, y, w, h)


def cloud(cx, bottom, mood="flat"):
    """구름 58×34. 바깥 어딘가, 남의 컴퓨터."""
    x, y, w, h = box_of(cx, bottom, 58, 34)
    svg = (f'<path d="M{n(x + 10)} {n(y + h)}h{n(w - 18)}a{n(11)} {n(11)} 0 0 0 -2 -21'
           f'a{n(15)} {n(15)} 0 0 0 -29 4a{n(9)} {n(9)} 0 0 0 2 17z" '
           f'fill="{SUF}" stroke="{INK}" stroke-width="1.8" stroke-linejoin="round"/>')
    svg += face(cx - 2, y + 18, mood, 11)
    return svg, (x, y, w, h)


def store(cx, bottom, mood="flat"):
    """저장통 40×46. 위가 둥근 원통 — 쌓아 두는 곳이다."""
    x, y, w, h = box_of(cx, bottom, 40, 46)
    rx, ry = w / 2, 7
    svg = (f'<path d="M{n(x)} {n(y + ry)}v{n(h - ry * 2)}a{n(rx)} {n(ry)} 0 0 0 {n(w)} 0'
           f'v-{n(h - ry * 2)}" fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
    svg += (f'<ellipse cx="{n(cx)}" cy="{n(y + ry)}" rx="{n(rx)}" ry="{n(ry)}" '
            f'fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
    svg += face(cx, y + 26, mood, 11)
    return svg, (x, y, w, h)


def lock(cx, bottom, mood="none"):
    """자물쇠 34×42. 잠긴 것과 열린 것을 mood 로 가르지 않는다 — 잠긴 모양만 그린다."""
    x, y, w, h = box_of(cx, bottom, 34, 42)
    body_y = y + 16
    svg = (f'<path d="M{n(cx - 9)} {n(body_y)}v-6a9 9 0 0 1 18 0v6" '
           f'fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>')
    svg += frame(x, body_y, w, h - 16, rx=5)
    svg += f'<circle cx="{n(cx)}" cy="{n(body_y + 13)}" r="2.4" fill="{INK}"/>'
    return svg, (x, y, w, h)


def key(cx, bottom, mood="none"):
    """열쇠 44×20. 눕혀 그린다 — 건네주는 물건이라 가로가 자연스럽다."""
    x, y, w, h = box_of(cx, bottom, 44, 20)
    cy = y + h / 2
    svg = (f'<circle cx="{n(x + 9)}" cy="{n(cy)}" r="8" fill="{SUF}" '
           f'stroke="{INK}" stroke-width="1.8"/>')
    svg += line(x + 17, cy, x + w, cy, INK, 1.8)
    svg += line(x + w - 9, cy, x + w - 9, cy + 6, INK, 1.8)
    svg += line(x + w - 3, cy, x + w - 3, cy + 6, INK, 1.8)
    return svg, (x, y, w, h)


def doc(cx, bottom, mood="none"):
    """문서 34×44. 모서리가 접힌 종이."""
    x, y, w, h = box_of(cx, bottom, 34, 44)
    svg = (f'<path d="M{n(x)} {n(y)}h{n(w - 10)}l10 10v{n(h - 10)}h-{n(w)}z" '
           f'fill="{SUF}" stroke="{INK}" stroke-width="1.8" stroke-linejoin="round"/>')
    svg += (f'<path d="M{n(x + w - 10)} {n(y)}v10h10" fill="none" '
            f'stroke="{INK}" stroke-width="1.4"/>')
    for i in range(3):
        svg += line(x + 7, y + 22 + i * 7, x + w - 7, y + 22 + i * 7, INK3, 1.4)
    return svg, (x, y, w, h)


def wall(cx, bottom, mood="none"):
    """벽 36×46. 벽돌 쌓기 — 막아서는 것."""
    x, y, w, h = box_of(cx, bottom, 36, 46)
    svg = frame(x, y, w, h, rx=3)
    rows = 4
    for i in range(1, rows):
        svg += line(x, y + h * i / rows, x + w, y + h * i / rows, INK, 1.3)
    for i in range(rows):
        mid = x + (w / 2 if i % 2 == 0 else 0)
        if i % 2 == 0:
            svg += line(mid, y + h * i / rows, mid, y + h * (i + 1) / rows, INK, 1.3)
        else:
            svg += line(x + w / 3, y + h * i / rows, x + w / 3, y + h * (i + 1) / rows, INK, 1.3)
            svg += line(x + w * 2 / 3, y + h * i / rows, x + w * 2 / 3, y + h * (i + 1) / rows, INK, 1.3)
    return svg, (x, y, w, h)


def door(cx, bottom, mood="none"):
    """문 34×46. 나가는 자리 — 게이트웨이·관문."""
    x, y, w, h = box_of(cx, bottom, 34, 46)
    svg = frame(x, y, w, h, rx=4)
    svg += f'<circle cx="{n(x + w - 8)}" cy="{n(y + h / 2)}" r="2.2" fill="{INK}"/>'
    svg += line(x + 6, y + 6, x + 6, y + h - 6, INK3, 1.3)
    return svg, (x, y, w, h)


def globe(cx, bottom, mood="none"):
    """지구 44×44. 인터넷 — 여기 밖의 전부."""
    x, y, w, h = box_of(cx, bottom, 44, 44)
    r = w / 2
    svg = (f'<circle cx="{n(cx)}" cy="{n(y + r)}" r="{n(r)}" fill="{SUF}" '
           f'stroke="{INK}" stroke-width="1.8"/>')
    svg += (f'<ellipse cx="{n(cx)}" cy="{n(y + r)}" rx="{n(r * 0.45)}" ry="{n(r)}" '
            f'fill="none" stroke="{INK}" stroke-width="1.4"/>')
    svg += line(x, y + r, x + w, y + r, INK, 1.4)
    return svg, (x, y, w, h)


def clock(cx, bottom, mood="none"):
    """시계 40×40. 기한과 시간."""
    x, y, w, h = box_of(cx, bottom, 40, 40)
    r = w / 2
    svg = (f'<circle cx="{n(cx)}" cy="{n(y + r)}" r="{n(r)}" fill="{SUF}" '
           f'stroke="{INK}" stroke-width="1.8"/>')
    svg += (f'<path d="M{n(cx)} {n(y + 7)}V{n(y + r)}l{n(r * 0.5)} {n(r * 0.42)}" '
            f'fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>')
    return svg, (x, y, w, h)


def glass(cx, bottom, mood="none"):
    """돋보기 40×40. 찾는 일."""
    x, y, w, h = box_of(cx, bottom, 40, 40)
    r = 13
    svg = (f'<circle cx="{n(x + r + 2)}" cy="{n(y + r + 2)}" r="{n(r)}" fill="{SUF}" '
           f'stroke="{INK}" stroke-width="1.8"/>')
    svg += line(x + r * 2 - 1, y + r * 2 - 1, x + w - 2, y + h - 2, INK, 2.2)
    return svg, (x, y, w, h)


def sign(cx, bottom, mood="none"):
    """갈림길 표지판 46×46. 길을 고르는 자리."""
    x, y, w, h = box_of(cx, bottom, 46, 46)
    svg = line(cx, y + 20, cx, y + h, INK, 1.8)
    svg += frame(x, y, 26, 15, rx=3)
    svg += frame(x + 20, y + 19, 26, 15, rx=3)
    return svg, (x, y, w, h)


def book(cx, bottom, mood="none"):
    """장부 40×44. 적어 두는 곳 — 목록·기록."""
    x, y, w, h = box_of(cx, bottom, 40, 44)
    svg = frame(x, y, w, h, rx=4)
    svg += line(x + 9, y, x + 9, y + h, INK, 1.4)
    for i in range(3):
        svg += line(x + 15, y + 13 + i * 9, x + w - 6, y + 13 + i * 9, INK3, 1.4)
    return svg, (x, y, w, h)


def parcel(cx, bottom, mood="none"):
    """소포 42×32. 옮겨지는 덩어리. 위에 이름표를 얹을 수 있다."""
    x, y, w, h = box_of(cx, bottom, 42, 32)
    svg = frame(x, y, w, h, rx=4)
    svg += line(cx, y, cx, y + h, INK, 1.4)
    return svg, (x, y, w, h)


def ring(cx, bottom, mood="none"):
    """고리 46×46. 둘레에 자리가 얹히는 원 — 해시 링·원형 버퍼."""
    x, y, w, h = box_of(cx, bottom, 46, 46)
    r = w / 2 - 3
    cy = y + h / 2
    svg = (f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="none" '
           f'stroke="{INK}" stroke-width="1.8" stroke-dasharray="1 0"/>')
    for dx, dy in ((0, -r), (r, 0), (0, r), (-r, 0)):
        svg += (f'<circle cx="{n(cx + dx)}" cy="{n(cy + dy)}" r="3.4" '
                f'fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
    return svg, (x, y, w, h)


def locker(cx, bottom, mood="none"):
    """사물함 52×26. 번호가 붙은 칸이 한 줄로 나뉜 것 — 배열."""
    x, y, w, h = box_of(cx, bottom, 52, 26)
    svg = frame(x, y, w, h, rx=3)
    for i in (1, 2, 3):
        svg += line(x + w * i / 4, y, x + w * i / 4, y + h, INK, 1.3)
    return svg, (x, y, w, h)


def stairs(cx, bottom, mood="none"):
    """계단 48×42. 층이 쌓인 모양 — 어디까지 내 몫인지 층으로 말한다."""
    x, y, w, h = box_of(cx, bottom, 48, 42)
    step = h / 3
    svg = ""
    for i in range(3):
        svg += frame(x, y + step * i, w - 16 * (2 - i), step, rx=2, sw=1.6)
    return svg, (x, y, w, h)


def fork(cx, bottom, mood="none"):
    """갈래 48×44. 한 줄이 둘로 갈라지는 자리 — 브랜치·분기."""
    x, y, w, h = box_of(cx, bottom, 48, 44)
    mid = y + h / 2
    svg = line(x, mid, x + w * 0.45, mid, INK, 1.8)
    svg += (f'<path d="M{n(x + w * 0.45)} {n(mid)}L{n(x + w)} {n(y + 6)}" fill="none" '
            f'stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>')
    svg += (f'<path d="M{n(x + w * 0.45)} {n(mid)}L{n(x + w)} {n(y + h - 6)}" fill="none" '
            f'stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>')
    for py in (y + 6, y + h - 6):
        svg += f'<circle cx="{n(x + w)}" cy="{n(py)}" r="3.6" fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>'
    svg += f'<circle cx="{n(x + w * 0.45)}" cy="{n(mid)}" r="3.6" fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>'
    return svg, (x, y, w, h)


def toggle(cx, bottom, mood="none"):
    """스위치 46×24. 켜고 끄는 것 — 기능 깃발."""
    x, y, w, h = box_of(cx, bottom, 46, 24)
    svg = frame(x, y, w, h, rx=h / 2)
    svg += (f'<circle cx="{n(x + w - h / 2)}" cy="{n(y + h / 2)}" r="{n(h / 2 - 4)}" '
            f'fill="{ACBG}" stroke="{AC}" stroke-width="1.8"/>')
    return svg, (x, y, w, h)


def bars(cx, bottom, mood="none"):
    """막대 46×42. 두 숫자를 나란히 견주는 자리."""
    x, y, w, h = box_of(cx, bottom, 46, 42)
    svg = line(x, y + h, x + w, y + h, INK, 1.6)
    for i, ratio in enumerate((0.45, 0.95, 0.7)):
        bw, gap = 10, 6
        bx = x + 3 + i * (bw + gap)
        bh = (h - 4) * ratio
        svg += frame(bx, y + h - bh, bw, bh, rx=2, sw=1.6)
    return svg, (x, y, w, h)


def funnel(cx, bottom, mood="none"):
    """깔때기 46×44. 넓게 들어와 좁게 나가는 자리."""
    x, y, w, h = box_of(cx, bottom, 46, 44)
    svg = (f'<path d="M{n(x)} {n(y)}h{n(w)}l-{n(w / 2 - 5)} {n(h * 0.55)}v{n(h * 0.45)}'
           f'h-10v-{n(h * 0.45)}z" fill="{SUF}" stroke="{INK}" stroke-width="1.8" '
           f'stroke-linejoin="round"/>')
    svg += line(x + 8, y + 12, x + w - 8, y + 12, INK3, 1.3)
    return svg, (x, y, w, h)


def coin(cx, bottom, mood="none"):
    """동전 40×34. 오가는 것이 돈일 때."""
    x, y, w, h = box_of(cx, bottom, 40, 34)
    for i in range(3):
        cy = y + h - 6 - i * 10
        svg_ellipse = (f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(w / 2 - 2)}" ry="6" '
                       f'fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>')
        svg = svg_ellipse if i == 0 else svg + svg_ellipse
    return svg, (x, y, w, h)


def stack(cx, bottom, mood="flat"):
    """겹친 서버 46×48. 한 대가 여러 대로 늘어난 모양."""
    x, y, w, h = box_of(cx, bottom, 46, 48)
    svg = frame(x, y + 6, 32, 42, rx=5, sw=1.4)
    svg += frame(x + 7, y + 3, 32, 42, rx=5, sw=1.4)
    svg += frame(x + 14, y, 32, 42, rx=5)
    svg += line(x + 14, y + 14, x + 46, y + 14, INK, 1.3)
    svg += line(x + 14, y + 28, x + 46, y + 28, INK, 1.3)
    svg += face(x + 30, y + 21, mood, 11)
    return svg, (x, y, w, h)


def graph(cx, bottom, mood="none"):
    """그래프 48×44. 마디 셋과 잇는 선 — 상태·의존 관계."""
    x, y, w, h = box_of(cx, bottom, 48, 44)
    pts = [(x + 7, y + 8), (x + w - 7, y + 14), (x + 20, y + h - 7)]
    svg = ""
    for a, b in ((0, 1), (1, 2), (0, 2)):
        svg += line(pts[a][0], pts[a][1], pts[b][0], pts[b][1], INK3, 1.4)
    for px, py in pts:
        svg += f'<circle cx="{n(px)}" cy="{n(py)}" r="6" fill="{SUF}" stroke="{INK}" stroke-width="1.8"/>'
    return svg, (x, y, w, h)


ACTORS = {
    "폰": phone, "공유기": router, "컴퓨터": desktop, "서버": server,
    "사람": person, "구름": cloud, "저장통": store, "자물쇠": lock,
    "열쇠": key, "문서": doc, "벽": wall, "문": door, "지구": globe,
    "시계": clock, "돋보기": glass, "표지판": sign, "장부": book, "소포": parcel,
    "고리": ring, "사물함": locker, "계단": stairs, "갈래": fork, "스위치": toggle,
    "막대": bars, "깔때기": funnel, "동전": coin, "겹친서버": stack, "그래프": graph,
}


# ---------------------------------------------------------------- 사물과 표시

def tag_width(text, fs, pad):
    """글자 폭 어림. 한글은 넓고 숫자와 점은 좁다."""
    wide = sum(1 for ch in text if ord(ch) > 0x2000)
    return max(24, wide * (fs * 1.0) + (len(text) - wide) * (fs * 0.58) + pad * 2)


def tag(cx, top, text, tone="plain", fs=11.5, pad=11, maxw=None, h=19):
    """이름표. 배우 밑에 붙거나 화살표에 얹힌다.

    tone: blue 이야기의 사물 · blue-dash 아직 없는 것 · plain 이미 있는 것

    maxw 는 화살표에 얹을 때 쓴다. 이름표가 길을 통째로 덮으면 회색 점선이
    한 칸도 안 남아서 "옮겨간다" 가 사라지고 사물만 떠 있는 그림이 된다.
    그럴 때는 여백과 글자를 줄여서라도 길이 양옆에 남게 한다.
    """
    text = str(text)
    wide = sum(1 for ch in text if ord(ch) > 0x2000)
    w = tag_width(text, fs, pad)
    if maxw and w > maxw:
        pad = 5
        w = tag_width(text, fs, pad)
    while maxw and w > maxw and fs > 9:
        fs -= 0.5
        w = tag_width(text, fs, pad)
    x = cx - w / 2
    if tone == "blue":
        rect = frame(x, top, w, h, rx=5, stroke=AC, sw=1.5, fill=ACBG)
        color = AC
    elif tone == "blue-dash":
        rect = (f'<rect x="{n(x)}" y="{n(top)}" width="{n(w)}" height="{n(h)}" rx="5" '
                f'fill="{ACBG}" stroke="{AC}" stroke-width="1.5" stroke-dasharray="4 3"/>')
        color = AC
    else:
        rect = frame(x, top, w, h, rx=5, stroke=INK, sw=1.4, fill=SUNK)
        color = INK2
    mono = f' font-family="{MONO}"' if not wide else ""
    svg = rect + (f'<text x="{n(cx)}" y="{n(top + h / 2 + fs * 0.36)}" text-anchor="middle" '
                  f'font-size="{n(fs)}"{mono} fill="{color}">{esc(text)}</text>')
    return svg, (x, top, w, h)


def arrow(x1, y, x2, head=True, color=INK3, style="dashed"):
    """이동. 기본은 점선, 작은 화면에서 선명해야 하는 장면은 실선을 쓴다.

    파랑은 계속 실려 가는 사물의 몫이다. ``solid``는 선만 진하게 만들어
    짧은 길 양옆에 점선 조각이 뭉쳐 보이는 문제를 피한다.
    """
    solid = style == "solid"
    stroke_width = 2.4 if solid else 1.8
    dash = "" if solid else "5 5"
    svg = line(x1, y, x2, y, color, stroke_width, dash=dash)
    if head:
        d = -1 if x2 < x1 else 1
        head_length = 10 if solid else 8
        head_height = 5.4 if solid else 3.9
        if solid:
            svg += (f'<path d="M{n(x2)} {n(y)}L{n(x2 - head_length * d)} {n(y - head_height)}'
                    f'L{n(x2 - head_length * d)} {n(y + head_height)}Z" fill="{color}"/>')
        else:
            svg += (f'<path d="M{n(x2 - head_length * d)} {n(y - head_height)}L{n(x2)} {n(y)}'
                    f'L{n(x2 - head_length * d)} {n(y + head_height)}" '
                    f'fill="none" stroke="{color}" stroke-width="{n(stroke_width)}" '
                    f'stroke-linecap="round" stroke-linejoin="round"/>')
    return svg


def pointer(x1, y1, x2, y2):
    """이름표에서 가리키는 곳으로. 화살촉 없는 파란 점선 — 이건 이동이 아니다."""
    return (f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" '
            f'stroke="{AC}" stroke-width="1.3" stroke-dasharray="3 3.5"/>')


def check(x, y, size=15):
    """마침 표시. 마지막 컷 오른쪽 위에만 선다."""
    return (f'<path d="M{n(x)} {n(y + size * 0.5)}l{n(size * 0.33)} {n(size * 0.37)}'
            f'L{n(x + size)} {n(y)}" fill="none" stroke="{AC}" stroke-width="2.6" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def cross(cx, cy, size=13):
    """죽은 것 위의 X. 검정이다 — 파랑은 살아 있는 사물의 색이다."""
    h = size / 2
    return (line(cx - h, cy - h, cx + h, cy + h, INK, 2.4)
            + line(cx + h, cy - h, cx - h, cy + h, INK, 2.4))


def bubble(cx, bottom, text, fs=11.5):
    """말풍선. 컷당 하나, 여덟 자 이내. 꼬리가 말하는 쪽을 가리킨다."""
    text = str(text)
    wide = sum(1 for ch in text if ord(ch) > 0x2000)
    w = max(40, wide * fs * 1.05 + (len(text) - wide) * fs * 0.6 + 22)
    h = 22
    x = cx - w / 2
    top = bottom - h
    svg = (f'<rect x="{n(x)}" y="{n(top)}" width="{n(w)}" height="{n(h)}" rx="{n(h / 2)}" '
           f'fill="{SUNK}" stroke="{LINE}" stroke-width="1.2"/>')
    svg += (f'<path d="M{n(cx + 4)} {n(bottom)}l-3 7 10-7" fill="{SUNK}" '
            f'stroke="{LINE}" stroke-width="1.2" stroke-linejoin="round"/>')
    svg += (f'<text x="{n(cx)}" y="{n(top + h / 2 + fs * 0.36)}" text-anchor="middle" '
            f'font-size="{n(fs)}" fill="{INK2}">{esc(text)}</text>')
    return svg, (x, top, w, h)


def panel(x, y, w, h, num=None):
    """컷 하나의 테두리와 번호. 번호가 읽는 순서를 가르친다."""
    svg = (f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="12" '
           f'fill="{SUF}" stroke="{LINE}" stroke-width="1.3"/>')
    if num is not None:
        svg += (f'<circle cx="{n(x + 17)}" cy="{n(y + 17)}" r="9" fill="none" '
                f'stroke="{INK3}" stroke-width="1.2"/>'
                f'<text x="{n(x + 17)}" y="{n(y + 21)}" text-anchor="middle" '
                f'font-size="11" fill="{INK3}">{num}</text>')
    return svg


# ---------------------------------------------------------------- 이름

# 부품이 스스로 무엇인지 말하게 한다. 캡션을 지우고 그림만 남겨 보면
# 줄 그어진 상자가 장부인지 문서인지 목록인지 알 수 없었다. 뜻을 글이
# 지고 있었다는 뜻이다. 이름을 달면 그림 혼자 설 수 있다.
#
# 이름표(tag)와 다르다. 이름표는 테두리 있는 칩이고 "옮겨지는 그것"이나
# 값을 말한다. 이름은 테두리 없는 잔글씨고 "이것이 무엇인가"를 말한다.
# 둘을 같은 모양으로 그리면 눈이 무엇을 따라가야 할지 잃는다.
NAMES = {
    # 부품이 스스로 무엇인지 말하게 한다. **진짜 용어로 부른다.**
    #
    # 한 번 잘못 갔다. 열 살 카드가 금지한 낱말(서버 등)을 그림에서도 빼려
    # 했는데, 그러면 정작 배우려는 낱말이 그림에서 사라진다. 금지어 규칙은
    # 열 살 카드의 산문에 거는 것이지 그림 라벨에 걸 것이 아니다.
    #
    # 열 살이 이해하는 힘은 낱말을 피하는 데서 오지 않는다. **무슨 일이
    # 벌어지는지가 그림에 다 보이는 데서** 온다. 사람이 이름을 보냈는데
    # 못 갔고, 장부에 물어 번호를 받았고, 그 번호로 닿았다 — 이 셋이
    # 보이면 "서버" 라고 적혀 있어도 열 살이 옮겨 말할 수 있다.
    "사람": "사람", "폰": "폰", "컴퓨터": "내 컴퓨터",
    "서버": "서버", "겹친서버": "서버 여럿",
    "공유기": "공유기", "구름": "인터넷", "지구": "전 세계",
    "저장통": "저장소", "사물함": "칸칸이", "장부": "이름 장부",
    "문서": "문서", "소포": "짐", "동전": "값",
    "자물쇠": "자물쇠", "열쇠": "열쇠", "문": "문", "벽": "벽",
    "시계": "시간", "돋보기": "찾기", "표지판": "이정표",
    "계단": "단계", "갈래": "갈림길", "고리": "이어짐",
    "스위치": "스위치", "깔때기": "거르개", "막대": "양", "그래프": "추이",
}


def name(cx, y, text, fs=9.5):
    """배우 밑에 붙는 잔글씨 이름. 테두리도 배경도 없다."""
    return (f'<text x="{n(cx)}" y="{n(y)}" text-anchor="middle" font-size="{n(fs)}" '
            f'fill="{INK3}" letter-spacing="0.02em">{esc(text)}</text>')


def caption(cx, y, text, fs=12):
    """컷 아래 한 줄. 그림이 못 하는 말만 한다 — 열 자 안팎."""
    return (f'<text x="{n(cx)}" y="{n(y)}" text-anchor="middle" font-size="{n(fs)}" '
            f'fill="{INK2}">{esc(text)}</text>')
