/* ============================================================
   도해(圖解) 렌더러 — ```도해 블록을 그림으로 바꾼다

   설계 원칙
   1. 원문이 먼저다. Obsidian 에서 그냥 열어도 읽히는 평문이어야 한다.
      그래서 문법은 표시 5개뿐이고, 렌더링 없이도 뜻이 통한다.
   2. 모양은 셋뿐이다 — 흐름 / 대조 / 층.
      노트에서 실제로 반복되는 설명 형태가 이 셋이다(작동원리, 해결하는 문제, 구조).
      넷째를 만들고 싶어지면 그건 대개 글로 써야 할 내용이다.
   3. 모바일 세로 한 폭에서 읽힌다. 가로 스크롤이 필요한 그림은 그림이 아니다.
      mermaid 를 쓰지 않는 이유가 이것이다 — graph 는 넓어지고, 390px 에서는 못 읽는다.

   문법
     첫 줄     모양: 이 그림이 답하는 질문
     마디      이름 :: 하는 일
     되돌아옴  < 이름 :: 하는 일          (흐름에서만. 응답/반환 구간)
     두 칸     이름 :: 왼쪽 || 오른쪽      (대조에서만)
     결론      = 한 줄로 남길 말           (선택)
   ============================================================ */

window.Dohae = (function () {
  "use strict";

  var SHAPES = { "흐름": "flow", "대조": "compare", "층": "layer" };
  var MAX_DEPTH = 5; // 층 배경 단계. 이보다 깊어지면 층으로 설명할 내용이 아니다.

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* 도해 안에서는 강조와 코드만 산다. 링크나 이미지까지 받으면
     "한눈에"가 무너진다 — 그림 안에서 읽을거리가 늘어나기 때문이다. */
  function inline(text) {
    return esc(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }

  // ---------------------------------------------------------------- 파싱

  function parseRow(raw) {
    var text = raw.trim();
    var back = /^<\s/.test(text) || text === "<";
    if (back) text = text.replace(/^<\s*/, "");

    var who = "";
    var cut = text.indexOf("::");
    if (cut !== -1) {
      who = text.slice(0, cut).trim();
      text = text.slice(cut + 2).trim();
    }

    // 대조에서만 의미가 있다. 다른 모양에서는 || 가 그냥 글자로 남는다.
    var halves = text.split("||");
    return {
      back: back,
      who: who,
      what: text,
      left: halves[0].trim(),
      right: (halves[1] || "").trim(),
    };
  }

  function parse(source) {
    var lines = String(source).split("\n").filter(function (l) { return l.trim(); });
    if (!lines.length) return null;

    var head = lines[0].match(/^\s*(흐름|대조|층)\s*:\s*(.*)$/);
    if (!head) return null; // 모양 선언이 없으면 도해가 아니다. 부르는 쪽에서 처리한다.

    var dia = { shape: SHAPES[head[1]], title: head[2].trim(), rows: [], sum: "" };
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      var end = line.match(/^=\s*(.+)$/);
      if (end) { dia.sum = end[1].trim(); continue; }
      dia.rows.push(parseRow(line));
    }
    return dia.rows.length ? dia : null;
  }

  // ---------------------------------------------------------------- 그리기

  /* 흐름. 왼쪽 척추선을 따라 번호가 내려간다.
     응답 구간(<)은 척추 색이 바뀌고 한 번 접힌 표시가 들어간다.
     화살표를 위로 돌리지 않는 이유: 목록은 어차피 아래로 읽힌다.
     방향을 거스르는 화살표는 그림을 설명이 필요한 물건으로 만든다. */
  function flow(dia) {
    var out = "";
    var step = 0;
    var turned = false;

    for (var i = 0; i < dia.rows.length; i++) {
      var row = dia.rows[i];
      if (row.back && !turned) {
        turned = true;
        out +=
          '<li class="dia__turn">' +
          '<span class="dia__turnmark" aria-hidden="true">' + arrowBack() + "</span>" +
          "<span>여기서부터 돌아오는 길</span></li>";
      }
      step++;
      out +=
        '<li class="dia__step' + (row.back ? " is-back" : "") + '">' +
        '<span class="dia__mark" aria-hidden="true">' + step + "</span>" +
        '<span class="dia__body">' +
        (row.who ? '<b class="dia__who">' + inline(row.who) + "</b>" : "") +
        '<span class="dia__what">' + inline(row.what) + "</span>" +
        "</span></li>";
    }
    return '<ol class="dia__steps">' + out + "</ol>";
  }

  function arrowBack() {
    return (
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>'
    );
  }

  /* 대조. 두 칸을 항상 나란히 둔다.
     위아래로 쌓으면 각 칸은 편해지지만 비교가 기억력 문제가 되어버린다.
     대조의 값어치는 눈이 좌우로 한 번 움직이는 데 있다. */
  function compare(dia) {
    /* 첫 줄이 이름 없이 두 칸만 가지고 있으면 그게 칸 이름이다.
       제목에서 잘라 쓰지 않는 이유: 제목은 질문이어야 하고,
       "DNS 없이 / DNS 로" 를 제목으로 쓰면 이 그림이 뭘 묻는지가 사라진다. */
    var rows = dia.rows.slice();
    var left = "이전";
    var right = "이후";
    if (rows.length > 1 && !rows[0].who && rows[0].right) {
      left = rows[0].left;
      right = rows[0].right;
      rows.shift();
    }

    var head =
      '<div class="dia__vshead">' +
      '<span class="dia__col dia__col--bad"><span class="dia__sign" aria-hidden="true">✕</span>' +
      esc(left) + "</span>" +
      '<span class="dia__col dia__col--good"><span class="dia__sign" aria-hidden="true">✓</span>' +
      esc(right) + "</span></div>";

    var body = rows.map(function (row) {
      return (
        '<div class="dia__vsrow">' +
        (row.who ? '<b class="dia__k">' + inline(row.who) + "</b>" : "") +
        '<span class="dia__cell dia__cell--bad">' + inline(row.left) + "</span>" +
        '<span class="dia__cell dia__cell--good">' + inline(row.right) + "</span>" +
        "</div>"
      );
    }).join("");

    return '<div class="dia__vs">' + head + body + "</div>";
  }

  /* 층. 위에서 아래로 깊어진다. 깊이는 배경 농도로만 말한다.
     계단처럼 들여쓰면 폭이 깎여서 390px 에서 글이 두 줄씩 더 늘어난다. */
  function layer(dia) {
    var body = dia.rows.map(function (row, i) {
      var depth = Math.min(i, MAX_DEPTH);
      return (
        '<li class="dia__layer dia__layer--d' + depth + '">' +
        '<b class="dia__who">' + inline(row.who || String(i + 1)) + "</b>" +
        '<span class="dia__what">' + inline(row.what) + "</span></li>"
      );
    }).join("");

    /* 깊이를 가리키는 세로 눈금자를 옆에 세워봤지만 지웠다.
       한글은 세로쓰기에서 글자가 한 자씩 쌓여 두 줄로 접히고, 그 폭만큼
       정작 설명이 좁아진다. 배경이 짙어지는 것으로 이미 깊이는 전해진다. */
    return '<ol class="dia__layers">' + body + "</ol>";
  }

  var DRAW = { flow: flow, compare: compare, layer: layer };

  function render(source) {
    var dia = parse(source);
    if (!dia) return null;

    return (
      '<figure class="dia dia--' + dia.shape + '">' +
      (dia.title ? '<figcaption class="dia__cap">' + inline(dia.title) + "</figcaption>" : "") +
      DRAW[dia.shape](dia) +
      (dia.sum ? '<p class="dia__sum">' + inline(dia.sum) + "</p>" : "") +
      "</figure>"
    );
  }

  return { render: render, parse: parse };
})();
