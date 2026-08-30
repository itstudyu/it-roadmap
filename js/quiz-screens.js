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
    App.navigate("/review/run");
  }

  /* ---------------------------------------------------------- 본문 미리 받기

     새 유형이 쓰는 재료(흔한 오해 · 실제 사례 · 대표 도해 · 비유)는 인덱스가 아니라
     본문(data/terms/<권>.js)에 실린다. js/quiz.js 는 본문이 없으면 그 유형을 조용히
     건너뛰므로, 본문을 안 받아두면 화면은 "30문제" 라 적어 놓고 12문제를 내게 된다.
     세는 쪽과 내는 쪽이 같은 재료를 봐야 그 어긋남이 없다. 받아두는 일은 화면 몫이다 —
     build() 를 기다리게 만들면 문제 만들기가 비동기가 되고 계약이 통째로 바뀐다.

     서비스워커가 설치할 때 12권을 이미 받아 두므로 대개 디스크에서 바로 온다. */

  function loadBooks(ids, done) {
    if (!ids.length) { done(); return; }
    var left = ids.length;
    ids.forEach(function (id) {
      // 실패해도 콜백은 온다(Store 가 실패를 기억한다). 못 받은 권은 유형이 줄어든 채로 낸다.
      Store.loadBody(id, function () {
        left--;
        if (left === 0) done();
      });
    });
  }

  /* 범위 화면에 들어오면 12권을 통째로 받아둔다. 여기서 세는 숫자가 12권 전부에
     걸쳐 있기 때문이다(복습 · 학습 완료는 권을 가리지 않는다).

     받을 게 없으면 아무것도 부르지 않고 돌아간다. 여기서 done 을 부르면 다시 그리기가
     또 이 함수를 부르고 그게 또 다시 그리기를 불러서 스택이 넘친다. 실제로 넘겨봤다. */
  function warmBodies(done) {
    var missing = Store.books().filter(function (b) {
      return !Store.hasBody(b.id) && !Store.bodyFailed(b.id);
    });
    if (!missing.length) return;

    loadBooks(missing.map(function (b) { return b.id; }), done);
  }

  /* 한 판을 시작하기 전에는 그 범위가 걸친 권만 받는다. 홈의 복습 알림처럼
     범위 화면을 거치지 않고 바로 들어오는 길이 있어서, 여기서 한 번 더 확인한다. */
  function withBodies(targets, done) {
    var need = [];
    targets.forEach(function (t) {
      if (!Store.hasBody(t.bookId) && need.indexOf(t.bookId) === -1) need.push(t.bookId);
    });
    loadBooks(need, done);
  }

  /* ---------------------------------------------------------- 한 판 길이

     나누지 않는다. 그 범위에 있는 문제를 전부 낸다.

     8문제 고정이었다가 짧게 8 · 보통 15 · 길게 30 으로 고르게 만들어 봤는데,
     어느 쪽이든 화면에는 고른 숫자가 열두 줄에 똑같이 찍혔다. 권마다 재고가
     98~372문제로 크게 다른데 그 차이가 사라지고, 읽는 사람은 그 숫자를 판 길이가
     아니라 "이 단어장에 있는 문제 수" 로 읽는다 — "8개뿐이네" 가 된다.

     길이를 미리 정할 이유도 없다. 언제든 상단바에서 그만둘 수 있고, 그만둔 자리까지가
     그날의 한 판이다. 몇 문제를 풀지는 시작 전에 고르는 것이 아니라 풀면서 정해진다.
     그래서 범위마다 진짜 재고를 적고, 상한은 두지 않는다. */

  // countQuestions·build 는 상한을 받게 되어 있다. 재고보다 큰 수를 주면 전부 낸다.
  var NO_LIMIT = 100000;

  /* 범위마다 재고를 미리 센다. 눌러보고 나서야 몇 문제짜리인지 알게 되면 안 된다.
     상한이 없으니 이 숫자가 곧 그 범위의 크기다 — 권마다 98~372문제로 다르고,
     그 차이가 어느 단어장을 고를지 정하는 정보가 된다. */
  /* /review 허브는 js/review.js 가 맡는다. 떠올리기와 고르기를 한 화면에
     모으면서 옮겼다. 여기 남겨 두면 로드 순서에 따라 어느 쪽이 이기는지가
     갈려서, 파일 순서를 바꾼 날 조용히 옛 화면이 돌아온다. */


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

    withBodies(targets, function () {
      startSession(window.Quiz.build(targets, pool, NO_LIMIT), label);
    });
  });

  // 홈의 복습 알림에서 바로 들어오는 길
  App.on("start-review", function () {
    var pool = Store.allTerms();
    var targets = Store.reviewQueue();
    withBodies(targets, function () {
      startSession(window.Quiz.build(targets, pool, NO_LIMIT), "복습");
    });
  });

  // 단어 상세에서 그 단어 하나만 확인하고 싶을 때
  App.on("quiz-one", function (data) {
    var pool = Store.allTerms();
    var term = Store.termById(data.id);
    if (!term) return;
    /* 여기서는 길이를 따르지 않는다. 읽던 단어 하나를 짚고 넘어가는 자리라
       30문제가 나오면 읽기가 끊긴다. 한 판은 범위 화면에서 시작한다. */
    withBodies([term], function () {
      startSession(window.Quiz.build([term], pool, 1), term.term);
    });
  });

  /* ---------------------------------------------------------- 문제 풀기 */

  var UNSURE = "__unsure__";

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
        // 계약은 보기 넷이지만 그 약속은 이 파일 밖에서 지켜진다.
        // 다섯 번째가 오면 글자 자리에 undefined 가 찍히므로 숫자로 받아둔다.
        '<span class="option__key">' + (keys[i] || i + 1) + "</span>" +
        '<span class="option__text">' + esc(opt.text) + "</span>" +
        (mark || '<span class="option__mark"></span>') + "</button>";
    }).join("");
  }

  /* 유형마다 "고른 것" 의 정체가 다르다. 용어 이름을 고른 문제에서는 "고른 답" 이면
     충분하지만, 보기가 문장인 문제에서는 그 문장이 무엇이었는지를 말해줘야 한다.
     여기 없는 유형은 마지막 줄로 떨어진다 — 유형이 늘어도 이 화면은 깨지지 않는다.

     조사 병기("은(는)")를 만들지 않는 문장으로 쓴다. 영문 용어 뒤에 붙는 조사는
     한글 읽기의 받침을 알아야 정해지는데, 그 정보가 노트에 없다. */
  function contrastLead(kind, name) {
    var K = window.Quiz.KINDS;
    if (kind === K.DEFINE) return "고른 설명은 " + name + "의 것입니다";
    if (kind === K.MYTH_PICK) return "고른 문장은 " + name + " 쪽 이야기입니다";
    return "고른 답: " + name;
  }

  /* 틀렸을 때 정답 설명만 다시 보여주는 건 도움이 안 된다 —
     방금 지문에서 읽은 문장을 한 번 더 읽게 될 뿐이다.
     배우는 지점은 "내가 고른 게 사실은 무엇이었나"에 있다.
     보기마다 출처 단어를 달아둔 이유가 이것이다. */
  function contrast(question, chosen) {
    if (!chosen || chosen.correct || !chosen.sourceId) return "";
    var source = Store.termById(chosen.sourceId);
    if (!source || source.id === question.termId) return "";

    var line = contrastLead(question.kind, source.term);

    return '<div class="feedback__contrast">' +
      '<p class="feedback__contrast-head">' + esc(line) + "</p>" +
      '<p class="feedback__contrast-body">' + esc(UI.plain(source.summary)) + "</p></div>";
  }

  var HEAD_COPY = {
    ok: { tone: "ok", icon: "check", text: "맞았습니다" },
    no: { tone: "no", icon: "close", text: "다시 볼 단어입니다" },
    unsure: { tone: "unsure", icon: "rotate", text: "모르는 게 확인됐습니다" },
  };

  function renderFeedback(question, picked) {
    var chosen = question.options.find(function (o) { return o.id === picked; });
    var right = chosen && chosen.correct;
    var isLast = session.index >= session.questions.length - 1;
    var head = HEAD_COPY[picked === UNSURE ? "unsure" : right ? "ok" : "no"];

    return '<div class="feedback" role="status">' +
      '<p class="feedback__head feedback__head--' + head.tone + '">' +
      UI.icon(head.icon, 20) + head.text + "</p>" +
      contrast(question, chosen) +
      '<div class="feedback__body">' + UI.markdown(question.explain) + "</div>" +
      '<div class="feedback__actions">' +
      // 아이콘만 있는 버튼은 무슨 일이 일어날지 알기 어렵다. 글자를 같이 둔다.
      '<button class="btn btn--secondary" data-action="open-term" data-id="' + esc(question.termId) + '">' +
      UI.icon("book", 18) + "다시 읽기</button>" +
      '<button class="btn btn--primary" data-action="next-question">' +
      (isLast ? "결과 보기" : "다음 문제") + UI.icon("forward", 18) + "</button>" +
      "</div></div>";
  }

  App.register("/review/run", function () {
    if (!session) {
      App.navigate("/review", true);
      return "";
    }
    /* 마지막 문제를 풀면 index 가 문제 수와 같아진 채로 결과 화면으로 넘어간다.
       거기서 뒤로가기를 누르면 이 자리로 돌아오는데, 그때 questions[index] 가
       undefined 라 아래에서 터진다. 예외가 나면 render 가 innerHTML 을 대입하지
       못해서 주소는 /quiz/run 인데 화면은 결과 화면인 채로 어긋난다. */
    if (session.index >= session.questions.length) {
      App.navigate("/review/result", true);
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

      '<main class="screen quiz-run">' +
      '<div class="question">' +
      '<p class="question__kind">' + esc(q.kind) + "</p>" +
      '<h1 class="question__text">' + esc(q.prompt) + "</h1>" +
      (q.quote ? '<div class="question__quote">' + UI.markdown(q.quote) + "</div>" : "") +
      "</div>" +
      '<div class="options">' + renderOptions(q, session.picked) + "</div>" +
      /* 찍기를 강요하지 않는다. 모르는 걸 모른다고 말할 수 있어야
         복습 목록이 실제 실력과 맞아떨어진다. 네 개 중 하나를 찍어서 맞으면
         아는 것으로 기록되고, 그 단어는 한 달 뒤에나 다시 나온다. */
      (session.picked
        ? ""
        : '<div class="unsure"><button class="unsure__btn" data-action="answer" data-id="' +
          UNSURE + '">모르겠어요</button></div>') +
      "</main>" +
      (session.picked ? renderFeedback(q, session.picked) : "");
  });

  App.on("answer", function (data) {
    if (!session || session.picked) return;

    var q = session.questions[session.index];
    var chosen = q.options.find(function (o) { return o.id === data.id; });
    var right = !!(chosen && chosen.correct);

    session.picked = data.id;
    // 유형을 같이 적어 둔다. 한 판이 30문제까지 길어지면 결과 화면에서
    // "어디서 틀렸나" 를 물을 수 있어야 하는데, 그 답이 여기 없으면 셀 수가 없다.
    session.answers.push({
      termId: q.termId,
      kind: q.kind,
      correct: right,
      unsure: data.id === UNSURE,
    });
    if (right) session.correct++;

    /* 학습 상태를 바로 반영한다. 맞으면 통과, 틀리면 복습 대기열로.
       "모르겠어요"도 복습으로 간다 — 결과는 오답과 같지만 말투는 다르게 한다.
       모른다고 인정한 사람에게 틀렸다고 할 이유가 없다. */
    if (right) {
      Store.markPassed(q.termId);
    } else {
      Store.markWrong(q.termId);
    }

    App.render();
    revealFeedback();
  });

  App.on("next-question", function () {
    if (!session) return;
    session.picked = null;
    session.index++;

    if (session.index >= session.questions.length) {
      App.navigate("/review/result");
      return;
    }
    App.render();
  });

  App.on("quit-quiz", function () {
    session = null;
    App.navigate("/review");
  });

  /* 해설이 나타나면 그 자리까지 내려준다.

     해설은 흐름 안에 있으면서 sticky 로 바닥에 붙는데, 스크롤이 맨 위에 있으면
     붙어 있는 동안 마지막 보기를 25px 쯤 덮는다. 스크롤을 끝까지 내리면
     제자리로 돌아가 겹치지 않는다. 답을 고른 뒤 읽어야 할 것은 아래에 있으니
     시선을 따라가게 하는 편이 맞다.

     App.render() 가 매번 맨 위로 올리므로 그 뒤에 실행되어야 한다. */
  function revealFeedback() {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }

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

  /* 30문제짜리 한 판에서 "18 / 30" 만으로는 무엇을 다시 읽어야 할지 알 수 없다.
     틀린 문제가 어느 유형에 몰렸는지가 그 답이다 — 뜻 고르기에서 몰렸으면 정의를,
     순서에서 몰렸으면 도해를 다시 볼 일이다.

     표로 펼치지 않는다. 유형별 정답률표는 성적표이지 다음에 할 일이 아니고,
     이 화면이 하려는 말은 "다음에 무엇을 하라" 하나다. 그래서 한 줄로 둔다. */
  function missedByKind(answers) {
    var groups = [];
    answers.forEach(function (a) {
      if (a.correct || !a.kind) return;
      var hit = groups.find(function (g) { return g.kind === a.kind; });
      if (hit) hit.n++;
      else groups.push({ kind: a.kind, n: 1 });
    });
    if (!groups.length) return "";

    groups.sort(function (x, y) { return y.n - x.n; });
    // 세 가지까지만 적는다. 여섯 유형을 다 늘어놓으면 한 줄이 세 줄이 된다.
    var head = groups.slice(0, 3).map(function (g) { return g.kind + " " + g.n; }).join(" · ");
    var rest = groups.length - 3;
    return "틀린 곳 — " + head + (rest > 0 ? " 외 " + rest + "가지" : "");
  }

  /* 한 단어를 여러 각도로 물으면 같은 이름이 답안에 여러 번 들어온다.
     목록에 같은 이름이 두 번 뜨면 왜 두 번인지부터 생각하게 되므로 한 번만 싣는다.
     한 번이라도 틀린 단어는 복습 쪽에만 둔다 — Store 가 매기는 상태와도 그게 맞다. */
  function splitTerms(answers) {
    var missed = {};
    answers.forEach(function (a) { if (!a.correct) missed[a.termId] = true; });

    var seen = {};
    var out = { wrong: [], right: [] };
    answers.forEach(function (a) {
      if (seen[a.termId]) return;
      seen[a.termId] = true;
      out[missed[a.termId] ? "wrong" : "right"].push(a.termId);
    });
    return out;
  }

  App.register("/review/result", function () {
    if (!session) {
      App.navigate("/review", true);
      return "";
    }

    var total = session.questions.length;
    var copy = resultCopy(session.correct, total);
    var missed = missedByKind(session.answers);

    var split = splitTerms(session.answers);
    var wrong = split.wrong;
    var right = split.right;

    var rowsFor = function (list, iconName) {
      return list.map(function (termId) {
        var t = Store.termById(termId);
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
      (missed ? '<p class="result__missed">' + esc(missed) + "</p>" : "") +
      "</div>" +

      '<div class="stack" style="margin-top:36px">' +
      '<button class="btn btn--primary btn--block" data-action="go" data-to="/review">' +
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
