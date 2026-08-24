#!/usr/bin/env python3
"""각본(JSON) 하나를 컷 만화 SVG 하나로 조립한다.

부품은 한 손, 각본은 여럿 — 그림을 그리는 규칙이 여기 한 곳에만 있어야
327편이 같은 세계에 산다. 각본은 "누가 어디서 무엇을" 만 말하고, 어디에
몇 픽셀로 놓일지는 전부 이 파일이 정한다.

문법 (딥리서치로 뽑아 블라인드 테스트 두 번으로 다듬은 것):

    ① 세로로 쌓은 컷. 문제 → 동작 → 결과 세 컷. 왕복이 본질인 개념만 네 컷.
    ② 같은 배우는 매 컷 같은 자리. 자리가 흔들리면 같은 배우로 안 읽힌다.
    ③ 화살표는 전부 회색 점선. 파랑은 이동이 아니라 **옮겨지는 사물** 의 색이다.
    ④ 파랑은 컷당 한 군데. 마지막 컷만 사물과 마침 체크 둘을 허용한다.
       파랑만 눈으로 따라가도 이야기가 되게 하는 것이 이 규칙의 전부다.
    ⑤ 얼굴은 그 컷에서 행동하는 쪽에만. 구경꾼은 눈과 일자 입.
    ⑥ 글자는 아껴 쓴다. 캡션 열 자, 말풍선 여덟 자, 한 편 마흔 자 안팎.
    ⑦ 정의에 없는 것은 그리지 않는다. 배경 소품도 없다.

각본 형식:

    {
      "id": "net--dhcp",
      "alt": "그림을 못 보는 사람에게 읽어 줄 한 문장",
      "cuts": [
        {
          "caption": "주소가 없다",
          "actors": [
            {"part": "폰", "slot": "left", "face": "sad",
             "tag": {"text": "?", "tone": "blue-dash"}},
            {"part": "공유기", "slot": "right"}
          ],
          "move": {"from": "right", "to": "left",
                   "payload": {"text": "192.168.0.7", "tone": "blue"}},
          "bubble": {"slot": "right", "text": "이거 써!"},
          "mark": "x",          # 옮겨지던 사물이 죽었다
          "check": true         # 마지막 컷의 마침 표시
        }
      ]
    }

    slot 은 left · mid · right 셋뿐이다. 컷 안에 셋을 다 채우면 글자 자리가
    없어지므로 배우는 컷당 셋까지다(문법 ④의 "등장 사물 3개 이하").
"""

from __future__ import annotations

from . import parts as P

W = 400          # 컷 폭. 화면 폭을 다 쓴다 — 컷 안 글자가 11px 이라 좁히면 못 읽는다.
H = 122          # 컷 높이
GUTTER = 8       # 컷 사이

SLOT_X = {"left": 64, "mid": 200, "right": 316}
GROUND = 72      # 배우가 서는 바닥 (컷 위에서부터)
LANE_Y = 52      # 화살표가 지나는 높이
TAG_TOP = 76     # 이름표가 붙는 자리
NAME_Y = 88      # 이름이 앉는 기준선. 이름표 자리보다 아래, 캡션보다 위.
CAP_Y = 113      # 캡션 글자의 기준선. 이름표 아래로 넉넉히 띄운다
BUBBLE_BOTTOM = 26


class SceneError(ValueError):
    """각본이 문법을 어겼다. 그림을 반쯤 그려 내보내느니 여기서 멈춘다."""


def _actor(cut_top: float, spec: dict) -> tuple[str, tuple, dict]:
    part = spec.get("part", "")
    draw = P.ACTORS.get(part)
    if not draw:
        raise SceneError(f"모르는 부품이다 — {part}")
    slot = spec.get("slot", "left")
    if slot not in SLOT_X:
        raise SceneError(f"모르는 자리다 — {slot}")
    svg, box = draw(SLOT_X[slot], cut_top + GROUND, spec.get("face", "flat"))
    return svg, box, spec


def _cast(cut: dict, top: float) -> tuple[str, dict]:
    """배우들을 자리에 세우고 이름표를 붙인다. 자리 -> 상자 표를 함께 돌려준다."""
    actors = cut.get("actors", [])
    if len(actors) > 3:
        raise SceneError(f"한 컷에 배우가 {len(actors)}명이다 (3명까지)")
    boxes: dict[str, tuple] = {}
    body = ""
    for spec in actors:
        art, box, spec = _actor(top, spec)
        boxes[spec.get("slot", "left")] = box
        body += art
        label = spec.get("tag")
        # 이름표가 없으면 부품 이름을 대신 단다. 각본이 "who" 로 따로
        # 불러 준 이름이 있으면 그쪽이 우선이다 — 같은 부품 둘을 가를 때
        # 쓰는 이름이라 부품 이름보다 정확하다.
        if not label:
            who = spec.get("who")
            nm = who if who and who != spec.get("part") else P.NAMES.get(spec.get("part"))
            if nm:
                body += P.name(SLOT_X[spec["slot"]], top + NAME_Y, nm)
        if label:
            # 이름표는 배우 밑이 기본이다. 옮겨지는 사물(소포·문서)에 붙는
            # 이름표만 위로 올린다 — 상자 위에 붙은 송장처럼 읽히고, 컷 아래의
            # 캡션과 한 덩어리로 뭉치지 않는다.
            at = box[1] - 23 if label.get("at") == "above" else top + TAG_TOP
            body += P.tag(SLOT_X[spec["slot"]], at,
                          label.get("text", ""), label.get("tone", "plain"))[0]
    return body, boxes


def _lane(cut: dict, top: float, boxes: dict) -> str:
    """이동 한 줄. 화살표는 회색이고, 옮겨지는 사물이 그 위에 올라탄다."""
    move = cut.get("move")
    if not move:
        return ""
    src, dst = move.get("from"), move.get("to")
    if src not in boxes or dst not in boxes:
        raise SceneError(f"화살표가 없는 배우를 오간다 — {src} → {dst}")
    s_box, d_box = boxes[src], boxes[dst]
    y = top + LANE_Y
    if SLOT_X[dst] > SLOT_X[src]:
        x1, x2 = s_box[0] + s_box[2] + 8, d_box[0] - 8
    else:
        x1, x2 = s_box[0] - 8, d_box[0] + d_box[2] + 8

    # 닿지 못한 이동은 화살촉이 없다. 길도 중간에서 끊고, 끊긴 자리에 X 를
    # 세운다 — 사물 위에 X 를 얹으면 무엇이 죽었는지 글자가 가려서 안 읽힌다.
    head = move.get("head", True)
    dead = x1 + (x2 - x1) * 0.66 if not head else x2

    # 실려 가는 사물을 먼저 앉힌다. X 자리를 그 오른쪽(또는 왼쪽) 끝 밖으로
    # 밀어야 하기 때문이다. 짧은 길에서는 이름표와 X 가 그대로 겹친다.
    load = move.get("payload")
    tail = ""
    if load:
        at = x1 + (dead - x1) * (0.5 if head else 0.38)
        room = max(30, abs(dead - x1) - (40 if cut.get("mark") else 26))
        tail, box = P.tag(at, y - 9.5, load.get("text", ""), load.get("tone", "blue"),
                          maxw=room)
        if cut.get("mark") == "x":
            edge = box[0] + box[2] + 13 if x2 > x1 else box[0] - 13
            dead = max(dead, edge) if x2 > x1 else min(dead, edge)

    body = P.arrow(x1, y, dead, head=head) + tail
    if cut.get("mark") == "x":
        body += P.cross(dead, y)
    return body


def _speech(cut: dict, top: float, boxes: dict) -> str:
    """말풍선. 컷당 하나뿐이고, 오른쪽 끝의 마침 체크와 겹치지 않게 붙든다."""
    speech = cut.get("bubble")
    if not speech:
        return ""
    slot = speech.get("slot", "left")
    if slot not in boxes:
        raise SceneError(f"말풍선이 없는 배우에게 붙었다 — {slot}")
    return P.bubble(min(SLOT_X[slot], 326), top + BUBBLE_BOTTOM, speech.get("text", ""))[0]


def _cut(cut: dict, top: float, num: int, last: bool) -> str:
    cast, boxes = _cast(cut, top)
    body = P.panel(0, top, W, H, num) + cast
    body += _lane(cut, top, boxes)
    body += _speech(cut, top, boxes)
    # 마침 체크는 마지막 컷의 몫이다. 중간 컷에 두면 이야기가 거기서 끝난 것처럼
    # 읽히고, 마지막 컷에서 빼면 "그래서 됐다" 를 말할 자리가 없어진다.
    if cut.get("check", last):
        body += P.check(360, top + 17)
    if cut.get("caption"):
        body += P.caption(W / 2, top + CAP_Y, cut["caption"])
    return body


def render(script: dict) -> str:
    """각본 하나 → SVG 하나."""
    cuts = script.get("cuts") or []
    if len(cuts) not in (3, 4):
        raise SceneError(f"컷이 {len(cuts)}개다 (3컷 또는 왕복 4컷)")

    height = len(cuts) * H + (len(cuts) - 1) * GUTTER
    body = ""
    for i, cut in enumerate(cuts):
        body += _cut(cut, i * (H + GUTTER), i + 1, i == len(cuts) - 1)

    alt = script.get("alt") or ""
    return (f'<svg viewBox="0 0 {W} {height}" role="img" aria-label="{P.esc(alt)}">'
            + body + "</svg>")
