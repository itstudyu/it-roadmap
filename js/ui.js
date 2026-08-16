/* ============================================================
   UI 기본 도구 — 이스케이프, 아이콘, 마크다운 렌더러
   ============================================================ */

window.UI = (function () {
  "use strict";

  /* ---------------------------------------------------------- 아이콘
     Lucide(ISC) 의 24x24 스트로크 지오메트리. 굵기와 크기를 통일한다.
     이모지를 아이콘으로 쓰지 않는다. 플랫폼마다 모양이 달라진다. */
  var PATHS = {
    home:
      '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>' +
      '<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    book:
      '<path d="M12 7v14"/>' +
      '<path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    quiz: '<path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/>',
    chart:
      '<path d="M3 3v16a2 2 0 0 0 2 2h16"/>' +
      '<path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    forward: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    "check-double": '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    sun:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/>' +
      '<path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/>' +
      '<path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>',
    layers:
      '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>' +
      '<path d="M2 12.18a1 1 0 0 0 .6.9l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 .6-.91"/>' +
      '<path d="M2 17.18a1 1 0 0 0 .6.9l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 .6-.91"/>',
    inbox:
      '<path d="M22 12h-6l-2 3h-4l-2-3H2"/>' +
      '<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  };

  /* 화면에 들어가는 모든 문자열은 반드시 여기를 통과한다.
     Obsidian 노트는 내 파일이라 신뢰할 수 있지만, 그렇다고
     원문을 그대로 innerHTML 에 넣는 습관을 들이면 안 된다. */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function icon(name, size, className) {
    var px = size || 20;
    return (
      '<svg class="' + esc(className || "") + '" width="' + px + '" height="' + px +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (PATHS[name] || "") + "</svg>"
    );
  }

  /* ---------------------------------------------------------- 마크다운
     Obsidian 노트의 일부 문법만 다룬다. 전체 파서가 아니다.
     순서가 중요하다: 먼저 전부 이스케이프하고 그 다음에 서식을 입힌다.
     그래서 원문에 태그가 들어 있어도 태그로 해석되지 않는다. */

  // 인라인 코드 자리표시자. 본문에 나올 수 없는 private-use 문자를 쓴다.
  // 숫자만으로 표시하면 "최대 3 개" 같은 문구와 충돌한다.
  var OPEN = "\uE000";
  var CLOSE = "\uE001";
  var CODE_SLOT = new RegExp(OPEN + "(\\d+)" + CLOSE, "g");

  function inline(text) {
    var out = esc(text);
    // 코드를 먼저 빼둔다. 코드 안의 별표가 굵게로 해석되면 안 된다.
    var codes = [];
    out = out.replace(/`([^`]+)`/g, function (_, code) {
      codes.push(code);
      return OPEN + (codes.length - 1) + CLOSE;
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "<em>$1</em>");
    return out.replace(CODE_SLOT, function (_, i) {
      return "<code>" + codes[Number(i)] + "</code>";
    });
  }

  var BLOCK_START = /^\s*([-*]\s|\d+\.\s|>|#{3,6}\s|\||```)/;

  // 한 종류의 블록을 통째로 집어서 HTML 과 다음 줄 위치를 돌려준다.
  function takeWhile(lines, from, test) {
    var i = from;
    var got = [];
    while (i < lines.length && test(lines[i])) {
      got.push(lines[i]);
      i++;
    }
    return { lines: got, next: i };
  }

  function renderTable(rawLines) {
    var rows = rawLines.map(function (l) {
      return l.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); });
    });
    // 두 번째 줄이 --- 구분선이면 첫 줄은 머리글이다
    var hasHead = rows.length > 1 && /^:?-{2,}/.test(rows[1][0] || "");
    var html = "<table>";
    if (hasHead) {
      html += "<thead><tr>" + rows[0].map(function (c) {
        return "<th>" + inline(c) + "</th>";
      }).join("") + "</tr></thead>";
    }
    html += "<tbody>" + (hasHead ? rows.slice(2) : rows).map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return html + "</table>";
  }

  function renderList(rawLines, ordered) {
    var strip = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/;
    return "<ul>" + rawLines.map(function (l, n) {
      var text = inline(l.replace(strip, ""));
      return "<li>" + (ordered ? n + 1 + ". " : "") + text + "</li>";
    }).join("") + "</ul>";
  }

  /* ---------------------------------------------------------- 코드펜스
     노트의 ``` 블록 167개 중 113개는 코드가 아니다. 언어 태그가 없고,
     이모지와 화살표로 개념의 흐름을 그린 "도해"이거나 자리를 맞춘 표다.
     이걸 <pre><code> 로 내보내면 차분하게 짜놓은 화면을 콘텐츠가 뚫고 나온다.
     원본 Markdown 은 그대로 두고, 읽는 쪽에서 세 종류로 갈라 조판한다.

       언어 태그 있음        -> 진짜 코드. 고정폭 유지
       화살표/이모지 있음     -> 개념 도해. 본문 폰트로 눕힌다
       두 칸 이상 띄운 2열    -> 정렬 표. dt/dd 로 세운다  */

  // 노트에서 실제로 쓰인 것만 다룬다. 추측해서 넓히지 않는다.
  var TONES = [
    { chars: "😱❌✗", tone: "bad" },
    { chars: "⚠", tone: "warn" },
    { chars: "✅✓", tone: "good" },
  ];
  var TONE_CHARS = /[😱❌✗⚠✅✓]️?/gu;

  function toneOf(text) {
    var first = String(text).match(TONE_CHARS);
    if (!first) return null;
    var ch = first[0].replace(/️/g, "");
    for (var i = 0; i < TONES.length; i++) {
      if (TONES[i].chars.indexOf(ch) !== -1) return TONES[i].tone;
    }
    return null;
  }

  /* 블록 전체의 톤은 줄들의 톤이 한 방향일 때만 인정한다.
     한 블록 안에서 ✅ 와 ❌ 를 섞어 대조하는 노트가 많은데,
     "첫 이모지가 이긴다"로 하면 한계를 설명하는 블록이 초록색이 되어버린다.
     의견이 갈리면 블록은 중립으로 두고 톤은 줄에만 남긴다. */
  function agreedTone(tones) {
    var seen = tones.filter(Boolean);
    if (!seen.length) return null;
    for (var i = 1; i < seen.length; i++) {
      if (seen[i] !== seen[0]) return null;
    }
    return seen[0];
  }

  function stripTone(text) {
    return String(text).replace(TONE_CHARS, "").replace(/\s{2,}/g, " ").trim();
  }

  var HANGUL = /[가-힣]/;
  var ARROW = /[→⇒➜↓]/;
  var KV_ROW = /^(\S.*?)\s{2,}(\S.*)$/;

  /* 언어 태그를 안 붙이고 쓴 코드가 있다. 특히 SQL 은 한글 주석을 달아두는 일이 많아서
     "한글이 있으면 코드가 아니다" 규칙만으로는 도해로 새어 나간다.
     줄 첫머리의 키워드로 잡는다. 문장 중간의 단어는 보지 않는다 —
     "이 서비스는 UPDATE 가 잦다" 같은 설명문까지 코드로 끌고 가면 안 된다. */
  var CODE_LEAD = /^\s*(SELECT\s|INSERT\s+INTO\s|UPDATE\s+\w+\s+SET\s|DELETE\s+FROM\s|CREATE\s+(TABLE|INDEX)\s|ALTER\s+TABLE\s|WHERE\s|FROM\s+\w|def\s+\w+\s*\(|class\s+\w+|function\s+\w*\s*\(|import\s+\w|const\s+\w+\s*=|let\s+\w+\s*=|return\s|\$\s+\w|npm\s|pip\s+install|docker\s|curl\s+-)/im;

  function looksLikeCode(text) {
    if (CODE_LEAD.test(text)) return true;
    if (HANGUL.test(text)) return false;
    return /[{};()=<>]/.test(text) && (text.match(/[{};()=<>]/g) || []).length >= 3;
  }

  function renderCode(body, lang) {
    var tag = lang ? '<span class="code__lang">' + esc(lang) + "</span>" : "";
    return '<div class="code">' + tag + "<pre><code>" + esc(body) + "</code></pre></div>";
  }

  /* 자리를 맞춘 2열 블록. 왼쪽은 코드 토큰이라 고정폭, 오른쪽은 한글이라 본문 폰트.
     고정폭 안에 한글을 두면 글리프가 없어 자간이 들쭉날쭉해진다. */
  function renderKeyTable(rows) {
    return '<dl class="keytable">' + rows.map(function (r) {
      return '<div class="keytable__row"><dt>' + inline(r[1]) + "</dt><dd>" + inline(r[2]) + "</dd></div>";
    }).join("") + "</dl>";
  }

  function diagramLine(raw, blockTone) {
    var text = raw.trim();
    // 블록 전체가 한 방향이면 테두리와 배경이 이미 말하고 있다.
    // 거기에 줄마다 ✕ 를 또 찍으면 같은 말을 두 번 하는 셈이다.
    var tone = blockTone ? null : toneOf(text);
    var from = ARROW.test(text.charAt(0));            // "→ 결과" — 앞 줄에서 이어진다
    if (from) text = text.replace(/^[→⇒➜↓]\s*/, "");
    var bullet = /^[-*]\s+/.test(text);
    if (bullet) text = text.replace(/^[-*]\s+/, "");
    var head = !from && !bullet && /:$/.test(stripTone(text)); // "시나리오:" — 그룹 제목

    var cls = "diagram__line";
    if (from) cls += " diagram__line--from";
    if (bullet) cls += " diagram__line--item";
    if (head) cls += " diagram__line--head";
    if (tone) cls += " diagram__line--" + tone;

    // 줄 가운데의 화살표는 글자가 아니라 기호다. 따로 감싸서 색과 크기를 준다.
    var body = inline(stripTone(text)).replace(/\s*[→⇒➜]\s*/g,
      ' <span class="diagram__to" aria-hidden="true">→</span> ');

    return "<li class=\"" + cls + "\">" + body + "</li>";
  }

  function renderDiagram(body) {
    var lines = body.split("\n").filter(function (l) { return l.trim(); });
    var tone = agreedTone(lines.map(toneOf));
    var body = lines.map(function (l) { return diagramLine(l, tone); }).join("");
    return '<figure class="diagram' + (tone ? " diagram--" + tone : "") + '">' +
      '<ol class="diagram__flow">' + body + "</ol></figure>";
  }

  function takeFence(lines, i) {
    var lang = (lines[i].match(/^\s*```\s*([a-zA-Z0-9_+-]*)/) || [])[1] || "";
    var block = takeWhile(lines, i + 1, function (l) { return !/^\s*```/.test(l); });
    var body = block.lines.join("\n");
    var next = block.next + 1;

    if (lang || looksLikeCode(body)) return { html: renderCode(body, lang), next: next };

    var rows = block.lines.filter(function (l) { return l.trim(); });
    var kv = rows.map(function (l) { return l.match(KV_ROW); }).filter(Boolean);
    if (rows.length >= 2 && kv.length >= Math.ceil(rows.length * 0.7)) {
      return { html: renderKeyTable(kv), next: next };
    }

    return { html: renderDiagram(body), next: next };
  }

  function takeTable(lines, i) {
    var body = takeWhile(lines, i, function (l) { return /^\s*\|/.test(l); });
    return { html: renderTable(body.lines), next: body.next };
  }

  function takeBullets(lines, i) {
    var body = takeWhile(lines, i, function (l) { return /^\s*[-*]\s+/.test(l); });
    return { html: renderList(body.lines, false), next: body.next };
  }

  function takeNumbers(lines, i) {
    var body = takeWhile(lines, i, function (l) { return /^\s*\d+\.\s+/.test(l); });
    return { html: renderList(body.lines, true), next: body.next };
  }

  // 노트 안의 h3~h6 은 화면에서 같은 급으로 눕힌다. 계층을 더 만들지 않는다.
  function takeHeading(lines, i) {
    return { html: "<h3>" + inline(lines[i].replace(/^\s*#{3,6}\s+/, "")) + "</h3>", next: i + 1 };
  }

  function takeQuote(lines, i) {
    var body = takeWhile(lines, i, function (l) { return /^\s*>\s?/.test(l); });
    var text = body.lines.map(function (l) { return l.replace(/^\s*>\s?/, ""); }).join(" ");
    return { html: "<p>" + inline(text) + "</p>", next: body.next };
  }

  var BLOCKS = [
    { match: /^\s*```/, take: takeFence },
    { match: /^\s*\|/, take: takeTable },
    { match: /^\s*[-*]\s+/, take: takeBullets },
    { match: /^\s*\d+\.\s+/, take: takeNumbers },
    { match: /^\s*#{3,6}\s+/, take: takeHeading },
    { match: /^\s*>\s?/, take: takeQuote },
  ];

  function markdown(src) {
    if (!src) return "";
    var lines = String(src).split("\n");
    var html = "";
    var i = 0;

    while (i < lines.length) {
      if (!lines[i].trim()) {
        i++;
        continue;
      }

      var handler = null;
      for (var b = 0; b < BLOCKS.length; b++) {
        if (BLOCKS[b].match.test(lines[i])) {
          handler = BLOCKS[b];
          break;
        }
      }

      if (handler) {
        var result = handler.take(lines, i);
        html += result.html;
        i = result.next;
        continue;
      }

      // 남은 것은 문단. 다음 빈 줄이나 블록 시작 전까지 이어 붙인다.
      var para = takeWhile(lines, i, function (l) {
        return l.trim() && !BLOCK_START.test(l);
      });
      html += "<p>" + inline(para.lines.join(" ").trim()) + "</p>";
      i = para.next;
    }

    return html;
  }

  /* 목록의 한 줄 미리보기용. 마크다운을 렌더하지 않는 자리이므로
     기호만 걷어낸다. 그대로 두면 "**웹에서" 같은 별표가 그대로 보인다. */
  function plain(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* 검색어 강조. 이스케이프된 결과 위에서 동작하므로 안전하다. */
  function highlight(text, query) {
    var safe = esc(plain(text));
    if (!query) return safe;
    var needle = esc(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp("(" + needle + ")", "ig"), "<mark>$1</mark>");
  }

  var toastTimer = null;

  function toast(message, iconName) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    clearTimeout(toastTimer);

    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");

    if (iconName) {
      var holder = document.createElement("span");
      // security-ok: OWASP-A03-4 — icon() 은 하드코딩된 PATHS 표로만 만들어진다. 외부 입력이 닿지 않는다.
      holder.innerHTML = icon(iconName, 16);
      if (holder.firstChild) el.appendChild(holder.firstChild);
    }

    var label = document.createElement("span");
    label.textContent = message; // 문자열은 파싱하지 않고 텍스트로 넣는다
    el.appendChild(label);

    document.body.appendChild(el);
    toastTimer = setTimeout(function () { el.remove(); }, 2600);
  }

  return {
    esc: esc,
    plain: plain,
    icon: icon,
    markdown: markdown,
    highlight: highlight,
    toast: toast,
  };
})();
