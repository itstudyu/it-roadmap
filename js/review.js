/* ============================================================
   복습 — 떠올리기와 고르기를 한 자리에

   예전에는 퀴즈가 탭 하나를 통째로 쓰고 떠올리기는 그 안 어딘가에 있었다.
   둘 다 "기억을 꺼내는 일" 이라 사용자 머릿속에서는 한 개인데, 자리가
   갈려 있으면 오늘 무엇을 해야 하는지가 두 곳으로 흩어진다.

     떠올리기   화면을 가리고 말한 뒤 스스로 확인한다. 채점하지 않는다.
     고르기     객관식. 채점하고 다음 복습 날짜를 예약한다.

   순서가 있다. 보기 넷을 먼저 주면 그건 재인이지 회상이 아니다 —
   "보니까 알겠다" 는 착각이 남는다. 그래서 떠올리기를 위에 둔다.

   출제와 채점 로직은 js/quiz.js 가 그대로 맡는다. 여기서 바꾸는 것은
   무엇을 어디에 두느냐이지 어떻게 고르고 어떻게 매기느냐가 아니다.
   ============================================================ */

(function () {
  "use strict";

  var App = window.App, Store = window.Store, UI = window.UI;
  var NO_LIMIT = 1e9;

  /* 떠올릴 만한 단어. 아직 안 읽은 것은 떠올릴 근거가 없어 넣지 않는다.
     js/recall.js 의 candidates() 와 같은 판정이다. */
  function recallable() {
    return Store.allTerms().filter(function (t) {
      var s = Store.statusOf(t.id);
      return s === Store.STATUS.READING || s === Store.STATUS.REVIEW;
    });
  }

  function quizable() {
    return Store.allTerms().filter(function (t) {
      var s = Store.statusOf(t.id);
      return s === Store.STATUS.LEARNED || s === Store.STATUS.PASSED;
    });
  }

  function countFor(targets) {
    return window.Quiz.countQuestions(targets, Store.allTerms(), NO_LIMIT);
  }

  App.register("/review", function () {
    var due = Store.reviewQueue();
    var recall = recallable();
    var learned = quizable();
    var dueQuestions = countFor(due);
    var learnedQuestions = countFor(learned);

    /* 오늘 할 일이 하나면 그것만 크게 보인다. 둘 다 있으면 떠올리기가 위다. */
    var lead = due.length
      ? '<p class="review-lead"><b>' + due.length + "개</b> 가 다시 올라왔습니다. " +
        "떠올린 다음 확인하면 다음 간격으로 밀립니다.</p>"
      : recall.length
        ? '<p class="review-lead">읽던 단어 <b>' + recall.length + "개</b> 를 떠올려 볼 수 있습니다.</p>"
        : '<p class="review-lead">아직 꺼내 볼 것이 없습니다. 코스에서 한 단어를 끝내면 여기에 쌓입니다.</p>';

    var recallCard =
      '<article class="mode' + (recall.length ? "" : " is-off") + '">' +
        '<header><span class="mode__no">01</span><div><b>떠올리기</b>' +
          "<small>화면을 가리고 말해 보세요. 채점하지 않습니다.</small></div></header>" +
        '<p class="mode__meta">' +
          (recall.length ? "지금 " + Math.min(recall.length, 12) + "개까지 · 약 " +
            Math.max(2, Math.round(Math.min(recall.length, 12) * 0.5)) + "분"
                         : "읽던 단어가 없습니다") + "</p>" +
        (recall.length
          ? '<button class="cta" type="button" data-action="start-recall">' +
            "<span>떠올리기 시작</span>" + UI.icon("forward", 18) + "</button>"
          : '<a class="cta cta--quiet" href="#/course">코스에서 한 단어 끝내기</a>') +
      "</article>";

    var quizCard =
      '<article class="mode' + (learnedQuestions ? "" : " is-off") + '">' +
        '<header><span class="mode__no">02</span><div><b>고르기</b>' +
          "<small>객관식입니다. 맞히면 다음 복습 날짜가 밀립니다.</small></div></header>" +
        '<p class="mode__meta">' +
          (learnedQuestions ? learnedQuestions + "문제까지 낼 수 있습니다"
                            : "먼저 단어를 끝내야 낼 문제가 생깁니다") + "</p>" +
        (dueQuestions
          ? '<button class="cta" type="button" data-action="start-scope" data-key="review">' +
            "<span>복습할 것부터 (" + dueQuestions + "문제)</span>" + UI.icon("forward", 18) + "</button>"
          : "") +
        (learnedQuestions
          ? '<button class="cta' + (dueQuestions ? " cta--quiet" : "") + '" type="button" ' +
            'data-action="start-scope" data-key="learned"><span>끝낸 단어 전체 (' +
            learnedQuestions + "문제)</span></button>"
          : '<a class="cta cta--quiet" href="#/course">코스로 가기</a>') +
      "</article>";

    /* 권별 범위. 문제가 없는 권은 회색으로 두되 지우지 않는다 —
       사라지면 "내가 여기를 아직 안 했구나" 를 볼 자리가 없어진다. */
    var byBook = Store.books().map(function (b) {
      var targets = Store.allTerms().filter(function (t) { return t.bookId === b.id; });
      var n = countFor(targets);
      return '<button class="scope-line" type="button" data-action="start-scope" data-key="book:' +
        UI.esc(b.id) + '"' + (n ? "" : " disabled") + ">" +
        "<span>" + UI.esc(b.name) + "</span>" +
        "<em>" + (n ? n + "문제" : "—") + "</em>" + UI.icon("right", 16) + "</button>";
    }).join("");

    return (
      '<main class="screen review" id="review">' +
        '<header class="screen-head"><span class="eyebrow">복습</span>' +
          "<h1>먼저 떠올리고,<br>그다음 확인합니다.</h1>" + lead + "</header>" +
        recallCard + quizCard +
        '<section class="scope-list"><h2>단어장에서 고르기</h2>' + byBook + "</section>" +
      "</main>"
    );
  });
})();
