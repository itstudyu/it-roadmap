/* ============================================================
   목업 조립기 — "이 글자들이 저 화면이 된다" 를 나란히 본다

   앱은 content/*.md 를 tools/build.py 로 구워서 그리는데, 이 목업은 같은
   Markdown 을 브라우저에서 바로 조립한다. 그래서 원문을 고치자마자
   화면이 어떻게 되는지 볼 수 있다.

   지켜야 할 선:
   그리는 코드를 여기 베끼지 않는다. 도해와 마크다운은 앱 것(js/ui.js)을
   그대로 부르고, 스타일도 앱 것(css/app.css)을 그대로 쓴다. 사본을 두면
   반드시 갈라진다 — 목업에서 멀쩡하던 것이 앱에서 깨진다.
   이 파일이 아는 것은 "섹션을 어떤 순서로 세우나" 뿐이다.
   ============================================================ */

(function () {
  "use strict";

  var esc = UI.esc;

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

  /* ---------------------------------------------------------- 파싱 */

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
  /* 도해는 앱의 UI.dohae 가 그린다. UI.markdown 이 ```도해 펜스를 알아보고
     알아서 넘기므로, 여기서 할 일은 없다. */
  function renderBody(md) {
    return UI.markdown(md);
  }


  function dohaeTitle(source) {
    var first = String(source).split("\n").find(function (l) { return l.trim(); }) || "";
    var m = first.match(/^\s*(?:흐름|대조|층)\s*:\s*(.+)$/);
    return m ? m[1].trim() : "";
  }

  function peek(md, limit) {
    DIA.lastIndex = 0;
    var dia = DIA.exec(md);
    if (dia) {
      var title = dohaeTitle(dia[1]);
      if (title) return title;
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

  /* 오해 슬롯의 미리보기는 따로 만든다.
     틀린 문장 앞부분만 ✕ 를 붙여 잇고 정정문은 뺀다. 지금은 46자에서
     잘리면서 정정문 앞부분이 어중간하게 붙어, 훑는 사람이 틀린 명제를
     사실로 주워 담는다. */
  function mythPeek(md) {
    var wrongs = parseMyths(md).map(function (it) {
      return '<span class="x" aria-hidden="true">✕</span> ' + esc(UI.plain(it.wrong));
    });
    if (!wrongs.length) return "";
    return '<span class="disclose__peek disclose__peek--myth">' +
      wrongs.join(" · ") + "</span>";
  }

  /* 접기 버튼. 확인 질문이 여기로 건너뛸 수 있게 id 를 붙인다. */
  var DRAW = { "🚫 흔한 오해": myths };

  function slugOf(label) {
    return "p-" + label.replace(/\s+/g, "-");
  }

  /* 원문의 "→ 뒤" 를 실제 칸으로 잇는 표.
     저자는 마크다운 제목으로 생각하고 쓴다("→ 주의사항"). 화면의 이름은
     "주의할 점" 이다. 둘 다 같은 자리로 가야 한다. 한 편을 그릴 때마다 비운다. */
  var TARGETS = {};

  function aim(name, id) {
    if (name) TARGETS[name.replace(/\s+/g, "")] = id;
  }

  function findTarget(name) {
    return TARGETS[String(name).replace(/\s+/g, "")] || "";
  }

  function disclose(head, label, md, open) {
    var draw = DRAW[head] || renderBody;
    var id = slugOf(label);
    var hint = head === "🚫 흔한 오해"
      ? mythPeek(md)
      : (function () {
          var t = peek(md, 46);
          return t ? '<span class="disclose__peek">' + esc(t) + "</span>" : "";
        })();

    aim(label, id);
    aim(head.replace(/^\S+\s*/, ""), id); // 이모지를 뗀 원문 제목
    aim(head, id);

    return (
      '<details class="disclose" id="' + esc(id) + '"' + (open ? " open" : "") + ">" +
      '<summary class="disclose__btn"><span class="disclose__text">' +
      '<span class="disclose__label">' + esc(label) + "</span>" + hint +
      '</span><span class="disclose__icon">' + UI.icon("chevron", 18) + "</span></summary>" +
      '<div class="disclose__panel prose">' + draw(md) + "</div></details>"
    );
  }

  function parseMyths(md) {
    var items = [];
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (m) items.push({ wrong: m[1].trim(), right: m[2].trim() });
    });
    return items;
  }

  function myths(md) {
    var items = parseMyths(md);
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

  /* 확인 질문. 원문이 "- 질문 → 주의할 점" 이면 답이 있는 자리로 가는 단추가 붙는다.
     질문만 던져놓고 끝나면 회상 연습은 절반만 된다 — 유저는 자기 답이 맞았는지
     알 길이 없고, 답의 절반은 접힌 칸 안에 있다. */
  function selfcheck(md) {
    var asks = md.split("\n")
      .filter(function (l) { return /^\s*-\s+/.test(l); })
      .map(function (l) {
        var text = l.replace(/^\s*-\s+/, "").trim();
        var cut = text.lastIndexOf("→");
        if (cut === -1) return { q: text, at: "" };
        return { q: text.slice(0, cut).trim(), at: text.slice(cut + 1).trim() };
      });
    if (!asks.length) return "";


    return (
      '<section class="selfcheck">' +
      '<h2 class="selfcheck__head">이 셋에 답할 수 있으면 이해한 것이다</h2>' +
      '<ol class="selfcheck__list">' +
      asks.map(function (a, i) {
        return '<li><span class="selfcheck__n" aria-hidden="true">' + (i + 1) + "</span>" +
          '<span class="selfcheck__body">' +
          '<span class="selfcheck__q">' + esc(a.q) + "</span>" +
          (a.at
            ? '<button class="selfcheck__jump" type="button" data-jump="' + esc(findTarget(a.at)) + '">' +
              '답이 있는 자리 <span aria-hidden="true">→</span> ' + esc(a.at) + "</button>"
            : "") +
          "</span></li>";
      }).join("") +
      "</ol></section>"
    );
  }

  function parseRelated(md) {
    var items = [];
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\s*-\s*\[\[([^\]]+)\]\]\s*[—–-]?\s*(.*)$/);
      if (m) items.push({ term: m[1].trim(), note: m[2].trim() });
    });
    return items;
  }

  function related(items) {
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

  function splitDefinition(md) {
    var analogy = "";
    var rest = md.replace(/^###\s+비유\s*\n([\s\S]*?)(?=\n##|\n###|$)/m, function (_, body) {
      analogy = body.trim();
      return "";
    });

    var paras = rest.trim().split(/\n{2,}/);
    return { gist: paras.shift() || "", body: paras.join("\n\n"), analogy: analogy };
  }

  /* ---------------------------------------------------------- 조립 */

  /* 비유가 배경 문단을 앞지른다.
     지금 순서는 한 줄 정의 → 배경 → 비유 → 그림이라, 구체적 앵커인 비유와
     형태를 주는 그림이 유래 산문 뒤로 밀린다. 원문은 그대로 두고 그리는
     순서만 바꾼다 — 비유는 한 문장·일상 사물 규칙이라 배경에 기대지 않는다. */
  function head(cat, name, parts) {
    return (
      '<header class="detail__head">' +
      '<p class="detail__cat">' + esc(cat) + "</p>" +
      '<h1 class="detail__term">' + esc(name.term) + "</h1>" +
      (name.reading ? '<p class="detail__reading">' + esc(name.reading) + "</p>" : "") +
      '<p class="detail__status"><span class="badge badge--reading">읽는 중</span></p>' +
      "</header>" +
      '<div class="gist">' + UI.markdown(parts.gist).replace(/^<p>|<\/p>$/g, "") + "</div>" +
      (parts.analogy
        ? '<aside class="analogy"><b class="analogy__k">비유</b>' +
          UI.markdown(parts.analogy).replace(/^<p>|<\/p>$/g, "") + "</aside>"
        : "") +
      (parts.body ? '<div class="prose prose--def">' + UI.markdown(parts.body) + "</div>" : "")
    );
  }

  var FIXED = ["📝 정의", "🖼️ 그림으로 보기", "❓ 이해했는지", "🔗 관련 용어", "📝 정리"];

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

  function recap(md) {
    return '<section class="recap"><h2 class="recap__head">한 번 더 정리</h2>' +
      '<div class="prose">' + UI.markdown(md) + "</div></section>";
  }


  /* 확인 질문에서 답이 있는 자리로. 그 칸을 열고 거기로 데려간다. */
  function wireJumps(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".selfcheck__jump"), function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.dataset.jump);
        if (!target) {
          UI.toast("그런 섹션이 없다 — 원문의 → 뒤를 확인하라");
          return;
        }
        target.open = true;
        clearTimeout(target.__land);
        target.classList.add("is-landed");
        target.__land = setTimeout(function () {
          target.classList.remove("is-landed");
        }, 1600);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* @ 난간이 마지막 마디의 원 중심에서 끝나게 한다.
     끝까지 내려오면 그림 바닥으로 삐져나가 길이 이어지는 것처럼 보인다.
     21 = 위 여백 8 + 원 반지름 13. */
  function fitLoopRails(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".dia__steps--loop"), function (list) {
      var last = list.querySelector(".dia__loop");
      if (!last) return;
      var gap = list.clientHeight - last.offsetTop - 21;
      list.style.setProperty("--loop-gap", Math.max(gap, 0) + "px");
    });
  }

  function build(id) {
    var node = document.getElementById(id);
    var src = node.textContent.replace(/^\n+/, "");
    document.getElementById("raw").textContent = src;

    var note = splitSections(src);
    var def = bySection(note.sections, "📝 정의");
    var figure = bySection(note.sections, "🖼️ 그림으로 보기");
    var sum = bySection(note.sections, "📝 정리");
    var check = bySection(note.sections, "❓ 이해했는지");
    var rel = bySection(note.sections, "🔗 관련 용어");
    var relItems = rel ? parseRelated(rel.body) : [];

    TARGETS = {};

    var html = head(node.dataset.cat || "", parseTitle(note.title), splitDefinition(def ? def.body : ""));

    if (figure) {
      ["그림", "그림으로 보기", "🖼️ 그림으로 보기", "도해"].forEach(function (n) { aim(n, "p-그림"); });
      html += '<section class="figure-slot" id="p-그림">' + renderBody(figure.body) + "</section>";
    }
    html += '<div class="panels">' + panels(note.sections) + related(relItems) + "</div>";
    if (sum) html += recap(sum.body);
    if (check) html += selfcheck(check.body);

    var detail = document.getElementById("detail");
    detail.innerHTML = html; // security-ok: OWASP-A03-4 — 입력은 이 파일 안의 <script type="text/markdown"> 뿐이고, 모든 문자열이 UI.esc / UI.markdown / UI.dohae 의 esc 를 통과한다.

    wireJumps(detail);
    fitLoopRails(detail);

  }

  /* ---------------------------------------------------------- 목업 장치 */

  /* 노트 바꾸기. 주소의 #note-cb 로 바로 열 수도 있다 —
     "이 그림 좀 보라"고 링크를 건네려면 이게 있어야 한다. */
  function show(id, smooth) {
    var btns = document.querySelectorAll(".switch__btn");
    var found = false;
    Array.prototype.forEach.call(btns, function (b) {
      var on = b.dataset.note === id;
      b.setAttribute("aria-pressed", String(on));
      if (on) found = true;
    });
    if (!found) return false;
    build(id);
    if (smooth) window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  function switcher() {
    Array.prototype.forEach.call(document.querySelectorAll(".switch__btn"), function (btn) {
      btn.addEventListener("click", function () {
        location.hash = btn.dataset.note;
        show(btn.dataset.note, true);
      });
    });
    window.addEventListener("hashchange", function () {
      show(location.hash.slice(1), true);
    });
  }


  function paintTheme(btn) {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = UI.icon(dark ? "sun" : "moon", 18); // security-ok: OWASP-A03-4 — UI.icon() 은 하드코딩된 아이콘 표로만 만들어진다. 외부 입력이 닿지 않는다.
  }

  function theme() {
    var btn = document.getElementById("theme");
    var root = document.documentElement;
    root.setAttribute("data-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    paintTheme(btn);
    btn.addEventListener("click", function () {
      root.setAttribute("data-theme", root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      paintTheme(btn);
    });
  }

  switcher();
  theme();
  if (!show(location.hash.slice(1), false)) show("note-dns", false);

  /* 폰트가 늦게 오면 줄 높이가 바뀐다. 난간은 실측값이라 그때 다시 맞춰야 한다. */
  window.addEventListener("resize", function () { fitLoopRails(document); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { fitLoopRails(document); });
  }
})();
