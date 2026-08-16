/* ============================================================
   학습 상태 저장소
   목업이므로 서버도 DB 도 없다. localStorage 에 넣어서 앱을 껐다 켜도
   "내가 어디까지 했는지"가 남아 있게 한다.
   ============================================================ */

window.Store = (function () {
  "use strict";

  var KEY = "it-vocab-mockup:v1";

  /* 학습 상태. 이 다섯 개가 UI 전체의 어휘가 된다.
     new -> reading -> learned -> passed 로 나아가고, passed 는 시간이 지나면 review 로 돌아온다. */
  var STATUS = {
    NEW: "new",
    READING: "reading",
    LEARNED: "learned",
    PASSED: "passed",
    REVIEW: "review",
  };

  var STATUS_META = {
    new: { label: "안 봄", full: "아직 공부하지 않음", icon: "circle", order: 0 },
    reading: { label: "읽는 중", full: "읽는 중", icon: "book", order: 1 },
    learned: { label: "학습 완료", full: "학습 완료", icon: "check", order: 2 },
    passed: { label: "퀴즈 통과", full: "퀴즈 통과", icon: "check-double", order: 3 },
    review: { label: "복습", full: "복습 필요", icon: "rotate", order: 4 },
  };

  var DAY = 86400000;

  var state = load();

  function blank() {
    return { terms: {}, history: [], studyDays: [], lastSeenAt: null };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return seed();
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.terms) return seed();
      return Object.assign(blank(), parsed);
    } catch (err) {
      // 저장소를 쓸 수 없어도(시크릿 모드 등) 앱은 돌아가야 한다.
      return seed();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* 저장 실패는 조용히 넘긴다. 메모리 상태로는 계속 동작한다. */
    }
  }

  /* 첫 실행이 빈 화면이면 디자인을 판단할 수 없다.
     "며칠 써본 사람"의 상태를 만들어 둔다. 목업에서만 하는 일이다. */
  function seed() {
    var s = blank();
    var data = window.VOCABULARY_DATA || [];
    var now = Date.now();

    var plan = [
      { book: "net", passed: 3, learned: 1, reading: 1 },
      { book: "arch", passed: 1, learned: 1, reading: 0 },
      { book: "ai", passed: 2, learned: 1, reading: 1 },
    ];

    plan.forEach(function (p) {
      var book = data.find(function (b) { return b.id === p.book; });
      if (!book) return;
      var i = 0;
      var take = function (n, status, ageDays) {
        for (var k = 0; k < n && i < book.terms.length; k++, i++) {
          var t = book.terms[i];
          var at = now - ageDays * DAY - k * 3600000;
          s.terms[t.id] = {
            status: status,
            readAt: at,
            passedAt: status === "passed" ? at : null,
            wrong: 0,
          };
          s.history.unshift({ termId: t.id, term: t.term, action: status, at: at });
        }
      };
      take(p.passed, "passed", 5);
      take(p.learned, "learned", 2);
      take(p.reading, "reading", 0);
    });

    // 오래된 통과 항목 두 개는 복습 대상으로 돌려놓는다. 복습 UX 를 보여주기 위해서다.
    var passedIds = Object.keys(s.terms).filter(function (id) {
      return s.terms[id].status === "passed";
    });
    passedIds.slice(0, 2).forEach(function (id) {
      s.terms[id].status = "review";
      s.terms[id].passedAt = now - 9 * DAY;
    });

    s.history.sort(function (a, b) { return b.at - a.at; });
    s.history = s.history.slice(0, 12);
    s.studyDays = [4, 3, 2, 1, 0].map(function (d) { return dayKey(now - d * DAY); });
    s.lastSeenAt = now;
    return s;
  }

  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  /* ---------------------------------------------------------- 조회 */

  function statusOf(termId) {
    var rec = state.terms[termId];
    return rec ? rec.status : STATUS.NEW;
  }

  function recordOf(termId) {
    return state.terms[termId] || null;
  }

  function allTerms() {
    var out = [];
    (window.VOCABULARY_DATA || []).forEach(function (book) {
      book.terms.forEach(function (t) {
        out.push(Object.assign({ bookId: book.id, bookName: book.name }, t));
      });
    });
    return out;
  }

  function bookById(id) {
    return (window.VOCABULARY_DATA || []).find(function (b) { return b.id === id; }) || null;
  }

  function termById(id) {
    return allTerms().find(function (t) { return t.id === id; }) || null;
  }

  /* 단어장 하나의 진행 상황. 진도 화면과 목록 화면이 같은 숫자를 쓰게 한다. */
  function bookStats(book) {
    var counts = { new: 0, reading: 0, learned: 0, passed: 0, review: 0 };
    book.terms.forEach(function (t) {
      counts[statusOf(t.id)]++;
    });
    return {
      total: book.terms.length,
      counts: counts,
      touched: book.terms.length - counts.new,
      done: counts.passed,
      percent: book.terms.length ? Math.round((counts.passed / book.terms.length) * 100) : 0,
    };
  }

  function overallStats() {
    var terms = allTerms();
    var counts = { new: 0, reading: 0, learned: 0, passed: 0, review: 0 };
    terms.forEach(function (t) { counts[statusOf(t.id)]++; });
    return {
      total: terms.length,
      counts: counts,
      studied: counts.reading + counts.learned + counts.passed + counts.review,
      passed: counts.passed,
      review: counts.review,
    };
  }

  /* 복습 대상. 통과한 지 오래된 것과 퀴즈에서 틀린 것. */
  function reviewQueue() {
    return allTerms().filter(function (t) { return statusOf(t.id) === STATUS.REVIEW; });
  }

  /* "지금 뭘 하면 되지"에 대한 앱의 대답.
     복습이 밀렸으면 복습, 읽던 게 있으면 그것, 없으면 다음 새 단어. */
  function nextUp() {
    var reading = allTerms().filter(function (t) { return statusOf(t.id) === STATUS.READING; });
    if (reading.length) return { term: reading[0], reason: "reading" };

    var learned = allTerms().filter(function (t) { return statusOf(t.id) === STATUS.LEARNED; });
    if (learned.length >= 3) return { term: learned[0], reason: "quiz-ready" };

    var fresh = allTerms().filter(function (t) { return statusOf(t.id) === STATUS.NEW; });
    if (fresh.length) return { term: fresh[0], reason: "new" };

    var review = reviewQueue();
    if (review.length) return { term: review[0], reason: "review" };
    return null;
  }

  function recentlyStudied(limit) {
    var seen = {};
    return state.history
      .filter(function (h) {
        if (seen[h.termId]) return false;
        seen[h.termId] = true;
        return !!termById(h.termId);
      })
      .slice(0, limit || 3)
      .map(function (h) { return termById(h.termId); });
  }

  function history(limit) {
    return state.history.slice(0, limit || 10);
  }

  function streak() {
    var days = state.studyDays.slice();
    var today = dayKey(Date.now());
    if (days.indexOf(today) === -1) days.push(today);

    var count = 0;
    for (var i = 0; i < 60; i++) {
      if (days.indexOf(dayKey(Date.now() - i * DAY)) === -1) break;
      count++;
    }
    // 최근 7일의 학습 여부. 진도 화면의 작은 격자에 쓴다.
    var week = [];
    for (var d = 6; d >= 0; d--) {
      var key = dayKey(Date.now() - d * DAY);
      week.push({ on: days.indexOf(key) !== -1, today: d === 0 });
    }
    return { count: count, week: week };
  }

  /* ---------------------------------------------------------- 변경 */

  function touch(termId, status) {
    var rec = state.terms[termId] || { status: STATUS.NEW, readAt: null, passedAt: null, wrong: 0 };
    rec.status = status;
    state.terms[termId] = rec;
    return rec;
  }

  function logHistory(termId, action) {
    var t = termById(termId);
    state.history.unshift({ termId: termId, term: t ? t.term : termId, action: action, at: Date.now() });
    state.history = state.history.slice(0, 40);
    var key = dayKey(Date.now());
    if (state.studyDays.indexOf(key) === -1) state.studyDays.push(key);
  }

  /* 단어를 열면 자동으로 "읽는 중"이 된다. 사용자가 따로 누를 일이 아니다. */
  function markOpened(termId) {
    if (statusOf(termId) !== STATUS.NEW) return;
    var rec = touch(termId, STATUS.READING);
    rec.readAt = Date.now();
    save();
  }

  function markLearned(termId) {
    var rec = touch(termId, STATUS.LEARNED);
    rec.readAt = Date.now();
    logHistory(termId, "learned");
    save();
  }

  function markPassed(termId) {
    var rec = touch(termId, STATUS.PASSED);
    rec.passedAt = Date.now();
    logHistory(termId, "passed");
    save();
  }

  /* 퀴즈에서 틀리면 복습 대기열로 간다. 학습 루프가 닫히는 지점이다. */
  function markWrong(termId) {
    var rec = touch(termId, STATUS.REVIEW);
    rec.wrong = (rec.wrong || 0) + 1;
    logHistory(termId, "review");
    save();
  }

  function reset() {
    state = blank();
    save();
    state = seed();
    save();
  }

  return {
    STATUS: STATUS,
    STATUS_META: STATUS_META,
    statusOf: statusOf,
    recordOf: recordOf,
    allTerms: allTerms,
    bookById: bookById,
    termById: termById,
    bookStats: bookStats,
    overallStats: overallStats,
    reviewQueue: reviewQueue,
    nextUp: nextUp,
    recentlyStudied: recentlyStudied,
    history: history,
    streak: streak,
    markOpened: markOpened,
    markLearned: markLearned,
    markPassed: markPassed,
    markWrong: markWrong,
    reset: reset,
  };
})();
