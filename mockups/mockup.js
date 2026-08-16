/* ============================================================
   목업 조립기

   템플릿대로 쓴 Markdown 한 편을 앱의 단어 화면으로 옮긴다.
   실제 앱은 tools/obsidian_adapter.py 가 미리 JSON 으로 굽지만,
   여기서는 "이 원문이 이 화면이 된다"를 눈으로 확인하는 게 목적이라
   브라우저에서 곧바로 파싱한다.
   ============================================================ */

(function () {
  "use strict";

  var esc = UI.esc;

  /* vault 의 이모지 제목 -> 화면에 쓸 이름.
     "더보기" 같은 모호한 말 대신 열면 뭐가 나오는지 알 수 있는 이름을 쓴다. */
  var LABELS = {
    "⚠️ 해결하는 문제": "왜 필요한가",
    "⚙️ 작동 원리": "어떻게 작동하나",
    "📊 비교": "무엇과 비교되나",
    "💡 실제 사례": "실제 사례",
    "✅ 장단점": "장단점",
    "🚫 흔한 오해": "흔히 잘못 아는 것",
    "🚨 주의사항": "주의할 점",
    "📝 정리": "한 번 더 정리",
  };

  var DIA = /```도해\r?\n([\s\S]*?)\r?\n```/g;

  // ---------------------------------------------------------------- 파싱

  function splitSections(src) {
    var lines = src.split("\n");
    var title = "";
    var out = [];
    var cur = null;
    var fenced = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (/^\s*```/.test(line)) fenced = !fenced;

      if (!fenced && /^#\s+/.test(line)) { title = line.replace(/^#\s+/, "").trim(); continue; }
      if (!fenced && /^##\s+/.test(line)) {
        cur = { head: line.replace(/^##\s+/, "").trim(), body: [] };
        out.push(cur);
        continue;
      }
      if (cur) cur.body.push(line);
    }

    return {
      title: title,
      sections: out.map(function (s) {
        return { head: s.head, body: s.body.join("\n").trim() };
      }),
    };
  }

  // "DNS (Domain Name System)" -> 표제어와 원어
  function parseTitle(title) {
    var m = title.match(/^(.+?)\s*\((.+)\)\s*$/);
    return m ? { term: m[1].trim(), reading: m[2].trim() } : { term: title, reading: "" };
  }

  function bySection(sections, head) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].head === head) return sections[i];
    }
    return null;
  }

  // ---------------------------------------------------------------- 렌더

  /* 도해 블록만 떼어내 그림으로 만들고 나머지는 기존 마크다운 렌더러에 맡긴다.
     도해 문법이 틀렸으면 그냥 코드블록으로 떨어뜨린다 — 원문이 사라지는 것보다는 낫다. */
  function renderBody(md) {
    var out = "";
    var last = 0;
    var m;
    DIA.lastIndex = 0;
    while ((m = DIA.exec(md))) {
      out += UI.markdown(md.slice(last, m.index));
      out += Dohae.render(m[1]) || UI.markdown("```\n" + m[1] + "\n```");
      last = DIA.lastIndex;
    }
    return out + UI.markdown(md.slice(last));
  }

  /* 접기 버튼의 미리보기. 안에 도해가 있으면 그 그림이 던지는 질문을 그대로 쓴다 —
     열기 전에 "여기 무슨 그림이 있다"까지 알려주는 편이 낫다. */
  function peek(md, limit) {
    DIA.lastIndex = 0;
    var dia = DIA.exec(md);
    if (dia) {
      var parsed = Dohae.parse(dia[1]);
      if (parsed && parsed.title) return parsed.title;
    }
    var text = md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/^\s*\|.*$/gm, " ")
      .replace(/[#>*`\[\]|-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 6) return "";
    return text.length > limit ? text.slice(0, limit).trim() + "…" : text;
  }

  // 섹션마다 본문을 그리는 법이 다르다. 없으면 평범한 마크다운으로 떨어진다.
  var DRAW = { "🚫 흔한 오해": myths };

  function disclose(head, label, md, open) {
    var hint = peek(md, 46);
    var draw = DRAW[head] || renderBody;
    return (
      '<details class="disclose"' + (open ? " open" : "") + ">" +
      '<summary class="disclose__btn"><span class="disclose__text">' +
      '<span class="disclose__label">' + esc(label) + "</span>" +
      (hint ? '<span class="disclose__peek">' + esc(hint) + "</span>" : "") +
      '</span><span class="disclose__icon">' + UI.icon("chevron", 18) + "</span></summary>" +
      '<div class="disclose__panel prose">' + draw(md) + "</div></details>"
    );
  }

  /* 흔한 오해. 반쯤 이해한 사람이 막히는 건 정보가 없어서가 아니라
     틀린 그림을 갖고 있어서다. 맞는 말을 열 번 더 해도 그 그림은 안 지워진다 —
     "이건 틀렸다"고 이름을 불러줘야 지워진다. 그래서 목록이 아니라
     틀린 문장을 앞에 세우고 그 밑에서 부수는 모양으로 그린다. */
  function myths(md) {
    var items = [];
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (m) items.push({ wrong: m[1].trim(), right: m[2].trim() });
    });
    if (!items.length) return UI.markdown(md);

    return '<ul class="myth">' + items.map(function (it) {
      return (
        '<li class="myth__item">' +
        '<b class="myth__wrong"><span class="myth__x" aria-hidden="true">✕</span>' +
        UI.markdown(it.wrong).replace(/^<p>|<\/p>$/g, "") + "</b>" +
        '<span class="myth__right">' +
        UI.markdown(it.right).replace(/^<p>|<\/p>$/g, "") + "</span></li>"
      );
    }).join("") + "</ul>";
  }

  /* 이해했는지. 접지 않고 맨 아래 펼쳐둔다 —
     읽고 나서 바로 스스로 물어보고, 그 자리에서 다음 버튼을 누르게 된다. */
  function selfcheck(md) {
    var asks = md.split("\n")
      .filter(function (l) { return /^\s*-\s+/.test(l); })
      .map(function (l) { return l.replace(/^\s*-\s+/, "").trim(); });
    if (!asks.length) return "";

    return (
      '<section class="selfcheck">' +
      '<h2 class="selfcheck__head">이 셋에 답할 수 있으면 이해한 것이다</h2>' +
      '<ol class="selfcheck__list">' +
      asks.map(function (q, i) {
        return '<li><span class="selfcheck__n" aria-hidden="true">' + (i + 1) + "</span>" +
          '<span class="selfcheck__q">' + esc(q) + "</span></li>";
      }).join("") +
      "</ol></section>"
    );
  }

  function related(md) {
    var items = [];
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\s*-\s*\[\[([^\]]+)\]\]\s*[—–-]?\s*(.*)$/);
      if (m) items.push({ term: m[1].trim(), note: m[2].trim() });
    });
    if (!items.length) return "";

    var rows = items.map(function (r) {
      return (
        '<button class="related__item" type="button">' +
        '<span class="related__term">' + esc(r.term) + "</span>" +
        '<span class="related__note">' + esc(r.note) + "</span></button>"
      );
    }).join("");

    var names = items.map(function (r) { return r.term; }).join(" · ");
    return (
      '<details class="disclose"><summary class="disclose__btn"><span class="disclose__text">' +
      '<span class="disclose__label">관련 개념 ' + items.length + "개</span>" +
      '<span class="disclose__peek">' + esc(names) + "</span></span>" +
      '<span class="disclose__icon">' + UI.icon("chevron", 18) + "</span></summary>" +
      '<div class="disclose__panel"><div class="related">' + rows + "</div></div></details>"
    );
  }

  /* 정의 덩어리를 셋으로 나눈다.
     첫 문단은 표제어 바로 아래 큰 글씨로, 나머지는 본문으로,
     "### 비유" 는 따로 떼어 눈에 띄는 자리에 둔다 —
     처음 보는 개념에서 사람을 건너가게 하는 건 대개 비유 한 줄이다. */
  function splitDefinition(md) {
    var analogy = "";
    var rest = md.replace(/^###\s+비유\s*\n([\s\S]*?)(?=\n##|\n###|$)/m, function (_, body) {
      analogy = body.trim();
      return "";
    });

    var paras = rest.trim().split(/\n{2,}/);
    return { gist: paras.shift() || "", body: paras.join("\n\n"), analogy: analogy };
  }

  // ---------------------------------------------------------------- 조립

  function head(name, parts) {
    return (
      '<header class="detail__head">' +
      '<p class="detail__cat">네트워크 기초</p>' +
      '<h1 class="detail__term">' + esc(name.term) + "</h1>" +
      (name.reading ? '<p class="detail__reading">' + esc(name.reading) + "</p>" : "") +
      '<p class="detail__status"><span class="badge badge--reading">읽는 중</span></p>' +
      "</header>" +
      '<div class="gist">' + UI.markdown(parts.gist).replace(/^<p>|<\/p>$/g, "") + "</div>" +
      (parts.body ? '<div class="prose prose--def">' + UI.markdown(parts.body) + "</div>" : "") +
      (parts.analogy
        ? '<aside class="analogy"><b class="analogy__k">비유</b>' +
          UI.markdown(parts.analogy).replace(/^<p>|<\/p>$/g, "") + "</aside>"
        : "")
    );
  }

  /* 펼쳐진 채로 두는 자리가 셋이다 — 맨 위의 정의, 그 밑의 그림, 맨 아래의 확인 질문.
     그림으로 들어와서 확인 질문으로 나간다. 접히는 건 그 사이의 설명들이다. */
  var FIXED = ["📝 정의", "🖼️ 그림으로 보기", "❓ 이해했는지", "🔗 관련 용어"];

  function panels(sections) {
    var opened = false;
    return sections
      .filter(function (s) { return FIXED.indexOf(s.head) === -1; })
      .map(function (s) {
        var open = !opened;
        opened = true;
        return disclose(s.head, LABELS[s.head] || s.head.replace(/^\S+\s*/, ""), s.body, open);
      })
      .join("");
  }

  function build() {
    var src = document.getElementById("src").textContent.replace(/^\n+/, "");
    document.getElementById("raw").textContent = src;

    var note = splitSections(src);
    var def = bySection(note.sections, "📝 정의");
    var figure = bySection(note.sections, "🖼️ 그림으로 보기");
    var check = bySection(note.sections, "❓ 이해했는지");
    var rel = bySection(note.sections, "🔗 관련 용어");

    var html = head(parseTitle(note.title), splitDefinition(def ? def.body : ""));

    // 그림은 접지 않는다. 이 화면에서 가장 빨리 이해를 만드는 요소를
    // 한 번 더 누르게 하면 아무도 안 본다.
    if (figure) html += '<section class="figure-slot">' + renderBody(figure.body) + "</section>";
    html += '<div class="panels">' + panels(note.sections) + (rel ? related(rel.body) : "") + "</div>";
    if (check) html += selfcheck(check.body);

    document.getElementById("detail").innerHTML = html; // security-ok: OWASP-A03-4 — 입력은 이 파일 안의 <script type="text/markdown"> 하나뿐이고, 모든 문자열이 UI.esc / Dohae 의 esc 를 통과한다.
  }

  // ---------------------------------------------------------------- 밝기 토글

  function paintTheme(btn) {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = UI.icon(dark ? "sun" : "moon", 18); // security-ok: OWASP-A03-4 — UI.icon() 은 하드코딩된 아이콘 표로만 만들어진다. 외부 입력이 닿지 않는다.
  }

  function theme() {
    var btn = document.getElementById("theme");
    var root = document.documentElement;
    var dark = matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", dark ? "dark" : "light");
    paintTheme(btn);
    btn.addEventListener("click", function () {
      root.setAttribute("data-theme", root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      paintTheme(btn);
    });
  }

  build();
  theme();
})();
