/* ============================================================
   6단계 학습 — 한 단어를 "남에게 설명할 수 있는" 데까지 끌고 간다

   읽기 화면은 단어를 보여준다. 이 화면은 단어를 **끝낸다.** 차이는 마지막
   두 단계에 있다 — 내 말로 다시 쓰고, 답을 떠올려 확인해야 넘어간다.

   여섯 칸은 단어마다 새로 쓰는 것이 아니라 그 단어가 이미 가진 절에 붙는다.
   634편 전부가 정의·해결하는 문제·흔한 오해·열 살에게·이해했는지를 갖고
   있으므로, 여섯 칸이 자동으로 찬다.

     01 필요  ⚠️ 해결하는 문제      왜 이런 게 있어야 하나
     02 핵심  📝 정의 + 빗대기       한 문장으로 무엇인가
     03 흐름  🖼️ 네 컷을 하나씩      입력 · 일 · 출력 · 경계
     04 오해  🚫 흔한 오해          헷갈리는 경계를 고친다
     05 설명  🧒 열 살에게          내 말로 써 보고 모범과 견준다
     06 확인  ❓ 이해했는지          답을 떠올려 마무리한다

   셋째 칸이 이 화면의 심장이다. 그림을 한 번에 다 보여주면 눈이 네 컷을
   훑고 지나간다. 한 칸씩 열면 각 칸에서 멈추게 되고, 그 멈춤이 넷째 컷
   (경계)까지 데려간다. 경계를 못 보고 지나간 사람이 남에게 설명할 때
   "DNS 가 웹사이트를 열어 준다" 라고 말한다.
   ============================================================ */

(function () {
  "use strict";

  var App = window.App, Store = window.Store, UI = window.UI, Art = window.Art;

  var STEPS = [
    { no: "01", name: "필요", hint: "왜 이런 게 있어야 하나" },
    { no: "02", name: "핵심", hint: "한 문장으로 무엇인가" },
    { no: "03", name: "흐름", hint: "입력 · 일 · 출력 · 경계" },
    { no: "04", name: "오해", hint: "헷갈리는 경계를 고친다" },
    { no: "05", name: "설명", hint: "내 말로 다시 조립한다" },
    { no: "06", name: "확인", hint: "답을 떠올려 마무리한다" },
  ];

  var state = { termId: null, step: 0, cut: 0, teach: "", peeked: false, checked: {} };

  function reset(termId) {
    state = { termId: termId, step: 0, cut: 0, teach: "", peeked: false, checked: {} };
  }

  function body(term) {
    var book = (window.VOCAB_TERMS || {})[term.bookId];
    return (book && book[term.id]) || null;
  }

  function cutsOf(term) {
    var book = (window.VOCAB_SCENE_CUTS || {})[term.bookId];
    return (book && book[term.id]) || [];
  }

  function sectionBySlot(detail, slot) {
    var list = (detail && detail.sections) || [];
    return list.find(function (s) { return s.slot === slot; }) || null;
  }

  /* ---------------------------------------------------------- 단계별 본문 */

  function stepNeed(term, detail) {
    var why = detail.why;
    if (!why) return '<p class="learn-empty">이 단어에는 아직 “왜 필요한가” 가 없습니다.</p>';
    return '<div class="learn-prose">' + UI.markdown(why.body) + "</div>";
  }

  function stepCore(term, detail) {
    var out = '<p class="learn-lede">' + UI.markdown(detail.definition).replace(/^<p>|<\/p>$/g, "") + "</p>";
    if (detail.analogy) {
      out += '<aside class="learn-analogy"><span>빗대면</span><p>' +
        UI.markdown(detail.analogy).replace(/^<p>|<\/p>$/g, "") + "</p></aside>";
    }
    if (term.reading) {
      out += '<p class="learn-reading"><span>우리말로</span><b>' + UI.esc(term.reading) + "</b></p>";
    }
    return out;
  }

  /* 셋째 칸. 그림을 컷 단위로 연다.

     마스크는 그림 위에 덮는 종이다. 컷 수만큼 칸을 나눠 덮고, 열린 칸만
     걷는다. 칸 수를 --cuts 로 넘기는 이유는 그림마다 컷이 넷이라는 보장을
     코드가 아니라 데이터에서 받기 위해서다. 컷이 셋인 옛 그림이 하나라도
     남아 있으면 넷으로 나눈 종이가 컷 경계와 어긋난다. */
  function stepFlow(term) {
    var svg = Art.scene(term);
    var caps = cutsOf(term);
    if (!svg || !caps.length) {
      return '<p class="learn-empty">이 단어에는 아직 그림이 없습니다.</p>';
    }
    var open = Math.min(state.cut, caps.length - 1);
    var masks = caps.map(function (_, i) {
      return '<span class="learn-mask' + (i <= open ? " is-open" : "") + '"></span>';
    }).join("");
    var dots = caps.map(function (cap, i) {
      return '<button class="learn-dot' + (i === open ? " is-current" : "") +
        (i < open ? " is-done" : "") + '" type="button" data-action="learn-cut" data-cut="' + i + '"' +
        ' aria-current="' + (i === open ? "step" : "false") + '">' +
        "<i>" + (i + 1) + "</i><b>" + UI.esc(cap) + "</b></button>";
    }).join("");
    var last = open === caps.length - 1;
    return (
      '<figure class="learn-figure">' +
        '<div class="learn-art" style="--cuts:' + caps.length + '">' +
          svg + '<div class="learn-masks" aria-hidden="true">' + masks + "</div>" +
        "</div>" +
        '<figcaption class="learn-cap"><span>' + (open + 1) + " / " + caps.length +
          "</span><strong>" + UI.esc(caps[open]) + "</strong></figcaption>" +
      "</figure>" +
      '<div class="learn-dots" role="group" aria-label="그림 단계">' + dots + "</div>" +
      (last
        ? '<p class="learn-edge">마지막 칸이 <b>경계</b>입니다. 여기서 이 단어의 일이 끝나고 다음은 다른 것이 맡습니다.</p>'
        : '<button class="learn-more" type="button" data-action="learn-cut" data-cut="' + (open + 1) + '">' +
          "다음 칸 열기" + UI.icon("forward", 16) + "</button>")
    );
  }

  function stepMyth(term, detail) {
    var list = detail.myths || [];
    if (!list.length) return '<p class="learn-empty">이 단어에는 아직 “흔한 오해” 가 없습니다.</p>';
    return '<ul class="learn-myths">' + list.map(function (m) {
      return "<li><b>" + UI.markdown(m.wrong).replace(/^<p>|<\/p>$/g, "") + "</b>" +
        "<span>" + UI.markdown(m.right).replace(/^<p>|<\/p>$/g, "") + "</span></li>";
    }).join("") + "</ul>";
  }

  /* 다섯째 칸. 이 앱의 성공 기준이 여기서 재어진다 — 남에게 설명할 수 있는가.

     모범 답을 먼저 보여주면 읽고 고개만 끄덕이고 끝난다. 그래서 자기 말로
     쓰기 전에는 가려 둔다. 강제하지는 않는다(건너뛸 수 있다) — 지하철에서
     자판을 못 칠 때가 있고, 막으면 그날로 앱을 닫는다. */
  function stepTeach(term, detail) {
    var out =
      '<p class="learn-ask">이 단어를 열 살 아이에게 설명한다면 뭐라고 하시겠어요?</p>' +
      '<textarea class="learn-write" id="learn-write" rows="5" ' +
        'placeholder="IT 낱말을 하나도 안 쓰고 써 보세요" ' +
        'data-action-input="learn-teach">' + UI.esc(state.teach) + "</textarea>";
    if (state.peeked) {
      out += '<section class="learn-model"><span>이렇게도 말할 수 있습니다</span><p>' +
        UI.markdown(detail.kid || "").replace(/^<p>|<\/p>$/g, "") + "</p></section>";
    } else {
      out += '<button class="learn-more" type="button" data-action="learn-peek">' +
        "쓴 다음 모범 설명 보기" + UI.icon("forward", 16) + "</button>";
    }
    return out;
  }

  function stepCheck(term, detail) {
    var list = detail.check || [];
    if (!list.length) {
      return '<p class="learn-empty">이 단어에는 확인 질문이 없습니다. 바로 마무리하세요.</p>';
    }
    return '<ol class="learn-checks">' + list.map(function (item, i) {
      var open = !!state.checked[i];
      return "<li>" +
        '<button type="button" data-action="learn-check" data-i="' + i + '" aria-expanded="' + open + '">' +
          "<span>" + UI.esc(item.q) + "</span>" + UI.icon("chevron", 18) + "</button>" +
        (open ? '<p class="learn-where">답은 <b>' + UI.esc(item.at) + "</b> 에 있습니다. 떠올려 보고 그 자리를 다시 펴 보세요.</p>" : "") +
        "</li>";
    }).join("") + "</ol>";
  }

  var BODIES = [stepNeed, stepCore, stepFlow, stepMyth, stepTeach, stepCheck];

  /* ---------------------------------------------------------- 화면 */

  function loading(term) {
    return (
      '<main class="learn" id="learn">' +
      '<header class="learn-top"><button class="round-btn" type="button" data-action="back" aria-label="뒤로">' +
        UI.icon("back", 20) + "</button><b>" + UI.esc(term.term) + "</b></header>" +
      '<div class="learn-loading"><span class="spinner" aria-hidden="true"></span>' +
        "<p>내용을 가져오는 중입니다</p></div></main>"
    );
  }

  function render(params) {
    var term = Store.termById(params.termId);
    if (!term) {
      return '<main class="learn"><p class="learn-empty">그런 단어가 없습니다.</p>' +
        '<a class="learn-more" href="#/course">코스로 가기</a></main>';
    }
    if (state.termId !== term.id) reset(term.id);

    if (!Store.hasBody(term.bookId)) {
      Store.loadBody(term.bookId, function (ok) {
        if (!ok && !Store.bodyFailed(term.bookId)) return;
        if (App.currentPath() === "/learn/" + params.termId) App.render();
      });
      return loading(term);
    }

    var detail = body(term);
    if (!detail) {
      return '<main class="learn"><p class="learn-empty">이 단어의 내용을 못 찾았습니다.</p>' +
        '<a class="learn-more" href="#/term/' + encodeURIComponent(term.id) + '">단어 상세로</a></main>';
    }

    Store.markOpened(term.id);

    var i = state.step;
    var step = STEPS[i];
    var percent = Math.round((i / (STEPS.length - 1)) * 100);
    var rail = STEPS.map(function (s, n) {
      var cls = n < i ? " is-done" : n === i ? " is-current" : "";
      return '<button class="learn-rail__step' + cls + '" type="button" ' +
        'data-action="learn-step" data-step="' + n + '" ' +
        'aria-current="' + (n === i ? "step" : "false") + '">' +
        '<i>' + (n < i ? UI.icon("check", 13) : s.no) + "</i>" +
        "<span><b>" + s.name + "</b><small>" + s.hint + "</small></span></button>";
    }).join("");

    var last = i === STEPS.length - 1;
    var nextLabel = last ? "다 배웠다고 표시" : "다음 · " + STEPS[i + 1].name;

    return (
      '<main class="learn" id="learn">' +
        '<header class="learn-top">' +
          '<button class="round-btn" type="button" data-action="back" aria-label="뒤로">' +
            UI.icon("back", 20) + "</button>" +
          "<div><b>" + UI.esc(term.term) + "</b><small>" + UI.esc(term.category) + "</small></div>" +
          '<a class="learn-full" href="#/term/' + encodeURIComponent(term.id) + '">전체 보기</a>' +
        "</header>" +
        '<div class="learn-bar"><i style="transform:scaleX(' + (percent / 100) + ')"></i></div>' +
        '<nav class="learn-rail" aria-label="학습 단계">' + rail + "</nav>" +
        '<section class="learn-stage">' +
          '<span class="learn-eyebrow">' + step.no + " · " + step.name + "</span>" +
          "<h1>" + UI.esc(step.hint) + "</h1>" +
          '<div class="learn-body">' + BODIES[i](term, detail) + "</div>" +
        "</section>" +
        '<footer class="learn-foot">' +
          '<button class="round-btn" type="button" data-action="learn-prev" aria-label="' +
            (i === 0 ? "학습 나가기" : "이전 단계") + '">' + UI.icon("back", 20) + "</button>" +
          '<button class="learn-next" type="button" data-action="learn-next">' +
            "<span>" + nextLabel + "</span>" + UI.icon("forward", 18) + "</button>" +
        "</footer>" +
      "</main>"
    );
  }

  App.register("/learn/:termId", render);

  /* ---------------------------------------------------------- 조작 */

  App.on("learn-step", function (data) { state.step = Number(data.step); App.render(); });
  App.on("learn-cut", function (data) { state.cut = Number(data.cut); App.render(); });
  App.on("learn-peek", function () { state.peeked = true; App.render(); });
  App.on("learn-check", function (data) {
    state.checked[data.i] = !state.checked[data.i];
    App.render();
  });

  App.on("learn-prev", function () {
    if (state.step === 0) { App.back(); return; }
    state.step -= 1;
    App.render();
  });

  App.on("learn-next", function () {
    if (state.step < STEPS.length - 1) {
      state.step += 1;
      App.render();
      return;
    }
    /* 마지막 칸. 여기까지 온 사람은 여섯 칸을 다 지났다는 뜻이므로
       '설명 가능' 으로 올린다. 다음 칸이 있으면 그리로 이어 준다 —
       길을 걷는 중에 매번 목록으로 돌려보내면 흐름이 끊긴다. */
    var term = Store.termById(state.termId);
    if (!term) return;
    Store.markLearned(term.id);
    var next = null;
    window.Paths.pathsContaining(term.id).some(function (hit) {
      var node = window.Paths.nextNode(hit.path);
      if (node && node.id !== term.id) { next = node; return true; }
      return false;
    });
    UI.toast(next ? "설명 가능으로 올렸습니다. 다음 칸으로 갑니다." : "설명 가능으로 올렸습니다.");
    App.navigate(next ? "/learn/" + encodeURIComponent(next.id)
                      : "/course/" + encodeURIComponent(term.bookId));
  });

  /* 자판 입력은 다시 그리면 안 된다. 한 글자 칠 때마다 화면을 새로 세우면
     커서가 맨 뒤로 튄다. 값만 상태에 담아 둔다. */
  document.addEventListener("input", function (event) {
    var el = event.target;
    if (el && el.id === "learn-write") state.teach = el.value;
  });
})();
