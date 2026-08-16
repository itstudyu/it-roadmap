/* ============================================================
   떠올리기 — 읽기와 퀴즈 사이에 빠져 있던 단계

   읽고 나서 바로 객관식으로 가면 "보니까 알겠다"는 착각을 준다.
   보기 네 개를 주는 순간 그건 재인(recognition)이지 회상(recall)이 아니다.
   Anki 도, 클래스카드도, Quizlet Learn 도 그 사이에 한 단계를 둔다.

     Anki        답을 가리고 스스로 떠올린 뒤 Again/Hard/Good/Easy 로 자가 평가
     클래스카드   암기 -> 리콜 -> 스펠 세 단계
     Quizlet     객관식으로 시작해 잘하면 서술형으로 승급

   여기서는 가장 단순한 형태만 가져온다. 용어를 보여주고, 뜻을 가리고,
   스스로 떠올린 다음 확인한다. 자가 평가는 두 갈래로만 둔다 —
   네 갈래는 고르는 데 시간이 걸리고, 목업에서 그 차이를 쓸 데가 없다.

   이 단계는 간격 반복 일정을 건드리지 않는다. 예약은 퀴즈가 한다.
   읽기 -> 떠올리기(학습 완료) -> 퀴즈(통과 + 다음 복습 예약) -> 복습
   ============================================================ */

(function () {
  "use strict";

  var UI = window.UI;
  var Store = window.Store;
  var App = window.App;
  var Parts = window.Parts;
  var esc = UI.esc;

  var session = null;

  /* 떠올릴 만한 단어. 읽던 것과 복습 대기 중인 것이 대상이다.
     아직 안 읽은 단어는 떠올릴 근거가 없으므로 넣지 않는다. */
  function candidates() {
    return Store.allTerms().filter(function (t) {
      var s = Store.statusOf(t.id);
      return s === Store.STATUS.READING || s === Store.STATUS.REVIEW;
    });
  }

  function start(terms, label) {
    var queue = (terms || []).slice(0, 12);
    if (!queue.length) {
      UI.toast("떠올릴 단어가 아직 없습니다", "inbox");
      return;
    }
    session = {
      queue: queue,
      label: label || "떠올리기",
      total: queue.length,
      seen: 0,       // 보여준 카드 수 (같은 단어를 다시 보면 또 센다)
      done: [],      // 떠올린 단어
      again: [],     // 다시 볼 단어 (중복 없이 센다)
      shown: false,  // 답을 폈는가
    };
    App.navigate("/recall/run");
  }

  App.on("start-recall", function () {
    start(candidates(), "떠올리기");
  });

  App.on("recall-one", function (data) {
    var term = Store.termById(data.id);
    if (term) start([term], term.term);
  });

  /* ---------------------------------------------------------- 카드 */

  App.register("/recall/run", function () {
    if (!session || !session.queue.length) {
      App.navigate(session ? "/recall/done" : "/home", true);
      return "";
    }

    var term = session.queue[0];
    // 진행률은 "떠올린 개수"로 잰다. 카드를 몇 장 넘겼는지가 아니라
    // 얼마나 남았는지를 알고 싶은 것이기 때문이다.
    var percent = session.total ? Math.round((session.done.length / session.total) * 100) : 0;

    return '<div class="quiz-head">' +
      '<div class="quiz-head__row">' +
      '<button class="icon-btn" data-action="quit-recall" aria-label="떠올리기 그만두기">' +
      UI.icon("close", 20) + "</button>" +
      '<span class="quiz-head__count num">' + Math.min(session.done.length + 1, session.total) +
      " / " + session.total + "</span>" +
      '<span class="quiz-head__score num">' + UI.icon("check", 14) + session.done.length + "</span>" +
      "</div>" +
      Parts.progressBar(percent) +
      "</div>" +

      '<main class="screen recall">' +
      '<p class="recall__book">' + esc(term.bookName) + "</p>" +
      '<h1 class="recall__term">' + esc(term.term) + "</h1>" +
      (term.reading ? '<p class="recall__reading">' + esc(term.reading) + "</p>" : "") +

      (session.shown
        ? '<div class="recall__answer prose">' + UI.markdown(term.summary) + "</div>"
        : '<p class="recall__cue">이 말이 무슨 뜻인지<br>머릿속으로 먼저 말해 보세요</p>') +
      "</main>" +

      '<div class="action-bar">' +
      (session.shown
        ? '<button class="btn btn--secondary" style="flex:1" data-action="recall-again">' +
          UI.icon("rotate", 18) + "아직</button>" +
          '<button class="btn btn--primary" style="flex:1" data-action="recall-got">' +
          UI.icon("check", 18) + "떠올랐다</button>"
        : '<button class="btn btn--primary btn--block" data-action="recall-show">' +
          "뜻 확인하기</button>") +
      "</div>";
  });

  App.on("recall-show", function () {
    if (!session) return;
    session.shown = true;
    App.render();
  });

  /* 떠올렸으면 학습 완료로 올린다. 이제 퀴즈에서 확인할 자격이 생긴다. */
  App.on("recall-got", function () {
    if (!session) return;
    var term = session.queue.shift();
    if (term) {
      // 앞서 "아직"이었다가 두 번째에 떠올린 단어는 다시 볼 목록에서 뺀다.
      // 안 그러면 마무리 화면의 두 목록에 같은 단어가 같이 올라온다.
      var pending = session.again.indexOf(term.id);
      if (pending !== -1) session.again.splice(pending, 1);

      if (session.done.indexOf(term.id) === -1) session.done.push(term.id);
      if (Store.statusOf(term.id) !== Store.STATUS.PASSED) Store.markLearned(term.id);
    }
    advance();
  });

  /* 못 떠올렸으면 이번 판 끝으로 보낸다. 상태는 건드리지 않는다 —
     "아직"은 실패가 아니라 아직 익지 않았다는 뜻이고, 벌을 줄 일이 아니다. */
  App.on("recall-again", function () {
    if (!session) return;
    var term = session.queue.shift();
    if (term) {
      if (session.again.indexOf(term.id) === -1) session.again.push(term.id);
      session.queue.push(term);
    }
    advance();
  });

  /* "아직"이면 카드가 판 끝으로 돌아가므로 큐가 저절로 비지 않는다.
     Anki 도 같은 판에서 다시 물어보지만, 여기엔 끝이 있어야 한다 —
     떠올릴 때까지 붙잡아두면 그만두는 것 말고는 빠져나갈 길이 없다.
     한 단어당 두 번까지만 보여주고 끊는다. */
  function advance() {
    session.shown = false;
    session.seen = (session.seen || 0) + 1;

    if (!session.queue.length || session.seen >= session.total * 2) {
      App.navigate("/recall/done");
      return;
    }
    App.render();
  }

  App.on("quit-recall", function () {
    var had = session && (session.done.length || session.again.length);
    if (!had) {
      session = null;
      App.navigate("/home");
      return;
    }
    App.navigate("/recall/done");
  });

  /* ---------------------------------------------------------- 마무리
     점수를 매기지 않는다. 떠올리기는 시험이 아니라 준비 운동이다.
     여기서 할 일은 다음 걸음을 가리키는 것뿐이다. */

  App.register("/recall/done", function () {
    if (!session) {
      App.navigate("/home", true);
      return "";
    }

    var got = session.done.length;
    var again = session.again.length;
    var readyForQuiz = Store.allTerms().filter(function (t) {
      return Store.statusOf(t.id) === Store.STATUS.LEARNED;
    }).length;

    var rows = function (ids) {
      return ids.map(function (id) {
        var t = Store.termById(id);
        if (!t) return "";
        return '<button class="result-row" data-action="go" data-to="/term/' + esc(t.id) + '">' +
          Parts.statusDot(Store.statusOf(t.id)) +
          '<span class="result-row__term">' + esc(t.term) + "</span>" +
          '<span class="meta">' + esc(t.bookName) + "</span>" +
          UI.icon("right", 16) + "</button>";
      }).join("");
    };

    return Parts.topbar({ right: Parts.themeButton() }) +
      '<main class="screen"><div class="result">' +
      '<p class="result__score">' + got + '<span class="result__of"> / ' + session.total + "</span></p>" +
      '<h1 class="result__title">' + (got ? "떠올린 만큼 남습니다" : "다시 읽고 오면 됩니다") + "</h1>" +
      '<p class="result__note">' +
      (again
        ? "아직 흐릿한 " + again + "개는 정의부터 다시 읽어보세요."
        : "이제 퀴즈로 확인할 차례입니다.") +
      "</p></div>" +

      '<div class="stack" style="margin-top:36px">' +
      (readyForQuiz
        ? '<button class="btn btn--primary btn--block" data-action="go" data-to="/quiz">' +
          UI.icon("quiz", 18) + "퀴즈로 확인하기</button>"
        : "") +
      '<button class="btn btn--secondary btn--block" data-action="go" data-to="/home">홈으로</button>' +
      "</div>" +

      (again
        ? '<section class="block"><h2 class="section-title" style="margin-bottom:4px">다시 읽을 단어</h2>' +
          '<div class="result__list" style="margin-top:8px">' + rows(session.again) + "</div></section>"
        : "") +
      (got
        ? '<section class="block"><h2 class="section-title" style="margin-bottom:4px">떠올린 단어</h2>' +
          '<div class="result__list" style="margin-top:8px">' + rows(session.done) + "</div></section>"
        : "") +
      "</main>";
  });

  window.Recall = { candidates: candidates };
})();
