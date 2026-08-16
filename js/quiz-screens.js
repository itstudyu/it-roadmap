/* ============================================================
   퀴즈 화면 — 범위 고르기, 문제 풀기, 결과

   단어를 읽었다고 이해한 것은 아니다. 그래서 퀴즈는 부가 기능이 아니라
   학습 루프를 닫는 자리다. 읽기 -> 학습 완료 -> 퀴즈 -> 복습.
   ============================================================ */

(function () {
  "use strict";

  var UI = window.UI;
  var Store = window.Store;
  var App = window.App;
  var Parts = window.Parts;
  var esc = UI.esc;

  /* 진행 중인 퀴즈 한 판. 새로고침하면 사라진다.
     목업이므로 중간에 나갔다 오는 상황까지는 다루지 않는다. */
  var session = null;

  function startSession(questions, scopeLabel) {
    if (!questions.length) {
      UI.toast("출제할 단어가 아직 부족합니다", "inbox");
      return;
    }
    session = {
      questions: questions,
      scopeLabel: scopeLabel,
      index: 0,
      correct: 0,
      answers: [],
      picked: null,
    };
    App.navigate("/quiz/run");
  }

  /* ---------------------------------------------------------- 범위 고르기 */

  function scopeOptions() {
    var review = Store.reviewQueue();
    var learned = Store.allTerms().filter(function (t) {
      var s = Store.statusOf(t.id);
      return s === Store.STATUS.LEARNED || s === Store.STATUS.PASSED;
    });

    var list = [
      {
        key: "review",
        name: "복습이 필요한 단어",
        meta: review.length ? review.length + "개 대기 중" : "지금은 없습니다",
        count: review.length,
        icon: "rotate",
      },
      {
        key: "learned",
        name: "학습 완료한 단어",
        meta: learned.length ? learned.length + "개 중에서 출제" : "먼저 단어를 읽어주세요",
        count: learned.length,
        icon: "check",
      },
    ];

    (window.VOCABULARY_DATA || []).forEach(function (b) {
      var stats = Store.bookStats(b);
      list.push({
        key: "book:" + b.id,
        name: b.name,
        meta: b.terms.length + "개 전체에서 출제",
        count: b.terms.length,
        icon: "book",
      });
    });

    return list;
  }

  function scopeCard(o) {
    var disabled = o.count < 1;
    return '<button class="scope" data-action="start-scope" data-key="' + esc(o.key) + '"' +
      (disabled ? " disabled" : "") + ">" +
      UI.icon(o.icon, 20) +
      '<span class="scope__body">' +
      '<span class="scope__name">' + esc(o.name) + "</span>" +
      '<span class="scope__meta">' + esc(o.meta) + "</span></span>" +
      '<span class="scope__check">' + UI.icon("right", 18) + "</span></button>";
  }

  function scopeRow(o) {
    return '<button class="scope-row" data-action="start-scope" data-key="' + esc(o.key) + '">' +
      '<span class="scope-row__name">' + esc(o.name) + "</span>" +
      '<span class="scope-row__count num">' + o.count + "</span>" +
      '<span class="row__chevron">' + UI.icon("right", 16) + "</span></button>";
  }

  App.register("/quiz", function () {
    var all = scopeOptions();
    // 상태로 고르는 두 가지가 대부분의 경우 정답이므로 앞에 크게 둔다.
    // 단어장 목록은 그 다음이라 가벼운 줄로 내린다.
    // 같은 크기 카드를 여덟 개 늘어놓으면 무엇을 먼저 눌러야 할지 알 수 없다.
    var suggested = all.slice(0, 2);
    var books = all.slice(2);

    return Parts.topbar({ title: "퀴즈", right: Parts.themeButton() }) +
      '<main class="screen"><div class="quiz-intro">' +
      '<h1 class="screen-title">무엇을 확인할까요</h1>' +
      '<p class="quiz-intro__lead">뜻을 외웠는지가 아니라 개념을 구분할 수 있는지 묻습니다. ' +
      "선택지는 같은 분야에서 뽑기 때문에 대충 찍기는 어렵습니다.</p>" +
      '<div class="stack" style="margin-top:28px">' + suggested.map(scopeCard).join("") + "</div>" +
      '<section class="block"><h2 class="section-title" style="margin-bottom:4px">단어장에서 고르기</h2>' +
      '<div class="scope-rows">' + books.map(scopeRow).join("") + "</div></section>" +
      "</div></main>";
  });

  App.on("start-scope", function (data) {
    var pool = Store.allTerms();
    var targets;
    var label;

    if (data.key === "review") {
      targets = Store.reviewQueue();
      label = "복습";
    } else if (data.key === "learned") {
      targets = pool.filter(function (t) {
        var s = Store.statusOf(t.id);
        return s === Store.STATUS.LEARNED || s === Store.STATUS.PASSED;
      });
      label = "학습 완료한 단어";
    } else {
      var bookId = data.key.replace("book:", "");
      var book = Store.bookById(bookId);
      targets = pool.filter(function (t) { return t.bookId === bookId; });
      label = book ? book.name : "단어장";
    }

    startSession(window.Quiz.build(targets, pool, 8), label);
  });

  // 홈의 복습 알림에서 바로 들어오는 길
  App.on("start-review", function () {
    var pool = Store.allTerms();
    startSession(window.Quiz.build(Store.reviewQueue(), pool, 8), "복습");
  });

  // 단어 상세에서 그 단어 하나만 확인하고 싶을 때
  App.on("quiz-one", function (data) {
    var pool = Store.allTerms();
    var term = Store.termById(data.id);
    if (!term) return;
    startSession(window.Quiz.build([term], pool, 1), term.term);
  });

  /* ---------------------------------------------------------- 문제 풀기 */

  function renderOptions(question, picked) {
    var keys = ["A", "B", "C", "D"];

    return question.options.map(function (opt, i) {
      var cls = "option";
      var mark = "";

      if (picked) {
        // 답을 고른 뒤에는 정답을 항상 같이 보여준다.
        // 틀렸을 때 뭐가 맞는지 모르면 배우지 못한다.
        if (opt.correct) {
          cls += " option--correct";
          mark = UI.icon("check", 20, "option__mark");
        } else if (opt.id === picked) {
          cls += " option--wrong";
          mark = UI.icon("close", 20, "option__mark");
        } else {
          cls += " option--muted";
        }
      }

      // --i 는 물러나는 순서를 매기는 데 쓴다
      return '<button class="' + cls + '" style="--i:' + i + '" data-action="answer" data-id="' +
        esc(opt.id) + '"' + (picked ? " disabled" : "") + ">" +
        '<span class="option__key">' + keys[i] + "</span>" +
        '<span class="option__text">' + esc(opt.text) + "</span>" +
        (mark || '<span class="option__mark"></span>') + "</button>";
    }).join("");
  }

  function renderFeedback(question, picked) {
    var chosen = question.options.find(function (o) { return o.id === picked; });
    var right = chosen && chosen.correct;
    var isLast = session.index >= session.questions.length - 1;

    return '<div class="feedback" role="status">' +
      '<p class="feedback__head feedback__head--' + (right ? "ok" : "no") + '">' +
      UI.icon(right ? "check" : "close", 20) +
      (right ? "맞았습니다" : "다시 볼 단어입니다") + "</p>" +
      '<div class="feedback__body">' + UI.markdown(question.explain) + "</div>" +
      '<div class="feedback__actions">' +
      // 아이콘만 있는 버튼은 무슨 일이 일어날지 알기 어렵다. 글자를 같이 둔다.
      '<button class="btn btn--secondary" data-action="open-term" data-id="' + esc(question.termId) + '">' +
      UI.icon("book", 18) + "다시 읽기</button>" +
      '<button class="btn btn--primary" data-action="next-question">' +
      (isLast ? "결과 보기" : "다음 문제") + UI.icon("forward", 18) + "</button>" +
      "</div></div>";
  }

  App.register("/quiz/run", function () {
    if (!session) {
      App.navigate("/quiz", true);
      return "";
    }

    var q = session.questions[session.index];
    var total = session.questions.length;
    var percent = Math.round((session.index / total) * 100);

    return '<div class="quiz-head">' +
      '<div class="quiz-head__row">' +
      '<button class="icon-btn" data-action="quit-quiz" aria-label="퀴즈 그만두기">' +
      UI.icon("close", 20) + "</button>" +
      '<span class="quiz-head__count num">' + (session.index + 1) + " / " + total + "</span>" +
      '<span class="quiz-head__score num">' + UI.icon("check", 14) + session.correct + "</span>" +
      "</div>" +
      Parts.progressBar(percent) +
      "</div>" +

      '<main class="screen" style="padding-inline:0">' +
      '<div class="question">' +
      '<p class="question__kind">' + esc(q.kind) + "</p>" +
      '<h1 class="question__text">' + esc(q.prompt) + "</h1>" +
      (q.quote ? '<div class="question__quote">' + UI.markdown(q.quote) + "</div>" : "") +
      "</div>" +
      '<div class="options">' + renderOptions(q, session.picked) + "</div>" +
      "</main>" +
      (session.picked ? renderFeedback(q, session.picked) : "");
  });

  App.on("answer", function (data) {
    if (!session || session.picked) return;

    var q = session.questions[session.index];
    var chosen = q.options.find(function (o) { return o.id === data.id; });
    var right = !!(chosen && chosen.correct);

    session.picked = data.id;
    session.answers.push({ termId: q.termId, correct: right });
    if (right) session.correct++;

    // 학습 상태를 바로 반영한다. 맞으면 통과, 틀리면 복습 대기열로.
    if (right) {
      Store.markPassed(q.termId);
    } else {
      Store.markWrong(q.termId);
    }

    App.render();
  });

  App.on("next-question", function () {
    if (!session) return;
    session.picked = null;
    session.index++;

    if (session.index >= session.questions.length) {
      App.navigate("/quiz/result");
      return;
    }
    App.render();
  });

  App.on("quit-quiz", function () {
    session = null;
    App.navigate("/quiz");
  });

  App.on("open-term", function (data) {
    App.navigate("/term/" + data.id);
  });

  /* ---------------------------------------------------------- 결과
     점수만 보여주고 끝내지 않는다. 틀린 단어를 바로 다시 읽을 수 있어야
     퀴즈가 학습으로 이어진다. */

  function resultCopy(score, total) {
    var ratio = total ? score / total : 0;
    if (ratio === 1) return { title: "전부 맞혔습니다", note: "이 범위는 당분간 넘어가도 됩니다. 며칠 뒤 복습에 다시 올라옵니다." };
    if (ratio >= 0.7) return { title: "대체로 이해했습니다", note: "틀린 단어만 복습 목록에 넣었습니다. 그것만 다시 보면 됩니다." };
    if (ratio >= 0.4) return { title: "절반쯤 왔습니다", note: "헷갈린 단어들을 복습 목록에 넣었습니다. 정의부터 다시 읽어보세요." };
    return { title: "다시 읽을 때입니다", note: "틀린 단어를 복습 목록에 넣었습니다. 급하지 않습니다, 하나씩 보면 됩니다." };
  }

  App.register("/quiz/result", function () {
    if (!session) {
      App.navigate("/quiz", true);
      return "";
    }

    var total = session.questions.length;
    var copy = resultCopy(session.correct, total);

    var wrong = session.answers.filter(function (a) { return !a.correct; });
    var right = session.answers.filter(function (a) { return a.correct; });

    var rowsFor = function (list, iconName) {
      return list.map(function (a) {
        var t = Store.termById(a.termId);
        if (!t) return "";
        return '<button class="result-row" data-action="go" data-to="/term/' + esc(t.id) + '">' +
          Parts.statusDot(Store.statusOf(t.id)) +
          '<span class="result-row__term">' + esc(t.term) + "</span>" +
          '<span class="meta">' + esc(t.bookName) + "</span>" +
          UI.icon(iconName, 16) + "</button>";
      }).join("");
    };

    return Parts.topbar({ right: Parts.themeButton() }) +
      '<main class="screen"><div class="result">' +
      '<p class="result__score">' + session.correct +
      '<span class="result__of"> / ' + total + "</span></p>" +
      '<h1 class="result__title">' + esc(copy.title) + "</h1>" +
      '<p class="result__note">' + esc(copy.note) + "</p>" +
      "</div>" +

      '<div class="stack" style="margin-top:36px">' +
      '<button class="btn btn--primary btn--block" data-action="go" data-to="/quiz">' +
      "다른 범위로 한 번 더</button>" +
      (wrong.length
        ? '<button class="btn btn--secondary btn--block" data-action="start-review">' +
          UI.icon("rotate", 18) + "틀린 단어 다시 읽기</button>"
        : "") +
      "</div>" +

      (wrong.length
        ? '<section class="block"><h2 class="section-title" style="margin-bottom:4px">복습 목록에 넣은 단어</h2>' +
          '<div class="result__list" style="margin-top:8px">' + rowsFor(wrong, "right") + "</div></section>"
        : "") +

      (right.length
        ? '<section class="block"><h2 class="section-title" style="margin-bottom:4px">통과한 단어</h2>' +
          '<div class="result__list" style="margin-top:8px">' + rowsFor(right, "right") + "</div></section>"
        : "") +
      "</main>";
  });
})();
