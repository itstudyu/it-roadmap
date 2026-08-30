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

  /* from 은 어느 길을 걷다 들어왔는지다. 이게 없으면 끝낸 뒤 '다음 칸' 을
     데이터 순서상 첫 길에서 고르게 되어, 사용자가 걷던 이야기가 아닌 다른
     이야기로 옮겨진다. 빌려 온 칸에서는 권까지 바뀐다. */
  var state = { termId: null, step: 0, cut: 0, teach: "", peeked: false, checked: {}, from: null };

  var pendingFrom = null;

  function reset(termId) {
    state = { termId: termId, step: 0, cut: 0, teach: "", peeked: false, checked: {},
              from: pendingFrom };
    pendingFrom = null;
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

  /* 못 받았을 때. 그냥 비워 두면 사용자는 앱이 멈춘 줄 안다. 무엇이 없는지
     말하고 다시 시도할 문을 준다 — 저절로 다시 시도하지는 않는다. */
  function failed(term) {
    return (
      '<main class="learn" id="learn">' +
      '<header class="learn-top"><button class="round-btn" type="button" data-action="back" aria-label="뒤로">' +
        UI.icon("back", 20) + "</button><div><b>" + UI.esc(term.term) + "</b></div></header>" +
      '<div class="learn-loading"><p>이 단어장의 내용을 못 받았습니다.</p>' +
        '<button class="learn-more" type="button" data-action="learn-retry" ' +
        'data-book="' + UI.esc(term.bookId) + '" data-term="' + UI.esc(term.id) + '">' +
        UI.icon("rotate", 16) + "다시 시도</button></div></main>"
    );
  }

  function render(params) {
    var term = Store.termById(params.termId);
    if (!term) {
      return '<main class="learn"><p class="learn-empty">그런 단어가 없습니다.</p>' +
        '<a class="learn-more" href="#/course">코스로 가기</a></main>';
    }
    if (state.termId !== term.id) reset(term.id);

    /* 실패는 반드시 성공과 갈라서 다뤄야 한다. 실패한 채로 다시 그리면
       hasBody 가 여전히 false 라 또 부르고, 그런데 loadBody 는 이미 실패로
       적힌 권에 대해 콜백을 **같은 틱에 동기로** 부른다. 그 콜백이 다시
       render 를 부르면 그 자리에서 스택이 넘친다.
       js/screens.js 가 같은 함정을 6초에 2만 번 돌고 나서 이 가드를 뒀는데,
       여기로 옮겨 오면서 빠뜨렸다. */
    if (Store.bodyFailed(term.bookId)) return failed(term);

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

  App.on("learn-retry", function (data) {
    Store.loadBody(data.book, function () {
      if (App.currentPath() === "/learn/" + encodeURIComponent(data.term)) App.render();
    }, true);
    App.render();
  });

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
    /* 걷던 길이 있으면 그 길에서 다음 칸을 고른다. 모르면(찾기나 목록에서 바로
       들어온 경우) 이 단어가 든 길 중 첫 길을 쓴다. */
    var hits = window.Paths.pathsContaining(term.id);
    var walking = state.from
      ? hits.find(function (h) {
          return h.bookId === state.from.bookId && h.index === state.from.index;
        })
      : null;
    var order = walking ? [walking].concat(hits) : hits;
    var next = null;
    order.some(function (hit) {
      var node = window.Paths.nextNode(hit.path);
      if (node && node.id !== term.id) { next = node; return true; }
      return false;
    });
    UI.toast(next ? "설명 가능으로 올렸습니다. 다음 칸으로 갑니다." : "설명 가능으로 올렸습니다.");
    var home = walking
      ? "/course/" + encodeURIComponent(walking.bookId) + "/" + walking.index
      : "/course/" + encodeURIComponent(term.bookId);
    App.navigate(next ? "/learn/" + encodeURIComponent(next.id) : home);
  });

  /* 링크를 누르는 순간 어느 길에서 왔는지를 담아 둔다. 주소가 바뀌기 전에
     잡아야 한다 — 주소에는 이 정보가 없고, 넣으면 같은 단어가 길마다 다른
     주소를 갖게 되어 진도와 북마크가 갈라진다. */
  document.addEventListener("click", function (event) {
    var el = event.target.closest && event.target.closest("[data-from-book]");
    if (!el) return;
    pendingFrom = {
      bookId: el.dataset.fromBook,
      index: Number(el.dataset.fromPath),
    };
  }, true);

  /* 자판 입력은 다시 그리면 안 된다. 한 글자 칠 때마다 화면을 새로 세우면
     커서가 맨 뒤로 튄다. 값만 상태에 담아 둔다. */
  document.addEventListener("input", function (event) {
    var el = event.target;
    if (el && el.id === "learn-write") state.teach = el.value;
  });
})();
