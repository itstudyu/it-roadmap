/* ============================================================
   학습 상태 저장소
   서버도 DB 도 없다. localStorage 에 넣어서 앱을 껐다 켜도
   "내가 어디까지 했는지"가 남아 있게 한다.

   저장 키는 바꾸지 않는다. 키가 바뀌면 이미 공부해 둔 기록이
   그 자리에 남은 채로 앱에서만 사라진다.
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

  /* 간격 반복. Leitner 상자를 그대로 쓴다.
     통과할 때마다 한 칸 올라가고 간격이 길어진다. 틀리면 1번 칸으로 떨어진다.

     Anki 의 FSRS 같은 걸 흉내내지 않는다. 목업에 필요한 건 정확한 스케줄이 아니라
     "통과하면 한동안 안 보이고, 시간이 지나면 스스로 돌아온다"는 사실 하나다.
     이 표가 없으면 결과 화면의 "며칠 뒤 복습에 다시 올라옵니다"가 거짓말이 된다. */
  var BOXES = [1, 3, 7, 16, 35];

  function intervalDays(box) {
    return BOXES[Math.min(Math.max(box, 1), BOXES.length) - 1];
  }

  var state = load();

  /* read 는 읽기 화면이 기억하는 것들이다. 진도(terms)와 섞지 않는다 —
     "이 용어 풀이를 열어봤다" 는 학습 상태가 아니라 화면이 조용해지는 조건이고,
     퀴즈·복습 어디에도 영향을 주지 않는다. 다만 같은 열쇠 안에 두어야
     초기화가 이것까지 함께 지운다. 따로 두면 지웠다고 말해놓고 남는다.

       hintSeen  점선 밑줄의 뜻을 한 번 배웠나 (배웠으면 안내 줄을 다시 안 낸다)
       gloss     풀이를 열어 본 용어들. 이 단어들은 점선이 옅어진다
       walked    그림을 끝까지 밟아 본 단어들. 다시 오면 전체가 보인 채로 연다 */
  function blank() {
    return {
      terms: {}, history: [], studyDays: [], lastSeenAt: null,
      read: { hintSeen: false, gloss: [], walked: {} },
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.terms) return blank();
      return Object.assign(blank(), parsed);
    } catch (err) {
      // 저장소를 쓸 수 없어도(시크릿 모드 등) 앱은 돌아가야 한다.
      return blank();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* 저장 실패는 조용히 넘긴다. 메모리 상태로는 계속 동작한다. */
    }
  }

  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  /* ---------------------------------------------------------- 조회 */

  /* 저장된 상태를 그대로 돌려주지 않는다. 통과한 단어는 시간이 지나면
     스스로 복습으로 돌아온다. 판정은 읽을 때 계산한다 — 저장값을 고쳐 쓰면
     앱을 안 열어둔 동안에는 아무 일도 일어나지 않기 때문이다. */
  function statusOf(termId) {
    var rec = state.terms[termId];
    if (!rec) return STATUS.NEW;
    if (rec.status === STATUS.PASSED && rec.dueAt && rec.dueAt <= Date.now()) {
      return STATUS.REVIEW;
    }
    return rec.status;
  }

  /* 복습까지 남은 날. 통과 직후 "며칠 뒤에 다시 물어볼지"를 알려주는 데 쓴다. */
  function dueInDays(termId) {
    var rec = state.terms[termId];
    if (!rec || !rec.dueAt) return null;
    return Math.max(0, Math.ceil((rec.dueAt - Date.now()) / DAY));
  }

  function recordOf(termId) {
    return state.terms[termId] || null;
  }

  /* ---------------------------------------------------------- 단어 데이터

     데이터는 두 갈래로 구워진다 (tools/build.py).

         data/index.js         이름과 한 줄 뜻. 항상 읽는다.        66KB
         data/terms/<권>.js    본문. 단어를 펼칠 때만 읽는다.       권당 39~176KB
         data/scenes/<권>.js   장면 컷 만화(SVG). 본문과 같이 온다.

     목록·검색·퀴즈·회상은 전부 인덱스만으로 그려진다. 본문을 지고 시작하면
     단어가 늘어날수록 첫 화면이 늦어지는데, 이 앱은 단어가 계속 늘어난다. */

  function books() {
    return window.VOCABULARY_INDEX || [];
  }

  /* allTerms() 는 렌더 한 번에 네 번까지 불린다(nextUp). 매번 227개를 새로
     만들면 그 비용이 화면 전환마다 붙는다. 목록은 다시 구울 때만 바뀌므로
     한 번 만들어 두고 재사용한다. 진도는 statusOf() 가 그때그때 읽으니
     이 배열이 낡을 일은 없다. */
  var termsCache = null;

  function allTerms() {
    if (termsCache) return termsCache;
    var out = [];
    books().forEach(function (book) {
      book.terms.forEach(function (t) {
        out.push(Object.assign({ bookId: book.id, bookName: book.name }, t));
      });
    });
    termsCache = out;
    return out;
  }

  var byId = null;

  function bookById(id) {
    return books().find(function (b) { return b.id === id; }) || null;
  }

  function termById(id) {
    if (!byId) {
      byId = {};
      allTerms().forEach(function (t) { byId[t.id] = t; });
    }
    var base = byId[id] || null;
    if (!base) return null;

    // 본문이 와 있으면 얹어서 준다. 아직이면 인덱스만 — 화면이 알아서 기다린다.
    var body = (window.VOCAB_TERMS || {})[base.bookId];
    return body && body[id] ? Object.assign({}, base, body[id]) : base;
  }

  /* ---------------------------------------------------------- 본문 불러오기 */

  var loading = {};

  function hasBody(bookId) {
    return !!(window.VOCAB_TERMS && window.VOCAB_TERMS[bookId]);
  }

  /* 실패한 권을 기억한다. 화면이 "다시 그리면 되겠지" 하고 되돌아오는 것을 막는
     자리다. 이게 없으면 로드 실패 -> 재렌더 -> 아직 없네 -> 다시 요청 -> 실패로
     도는 고리가 생긴다. 실측으로 6초에 2만 번 돌았다. */
  var failed = {};

  function bodyFailed(bookId) {
    return !!failed[bookId];
  }

  /* fetch 가 아니라 script 태그로 받는다. file:// 로 열었을 때 fetch 는
     CORS 에 막히지만 script 는 통과한다. 이 앱은 index.html 을 더블클릭해서
     여는 것도 지원한다. */
  function inject(src, done) {
    var el = document.createElement("script");
    el.src = src;
    el.onload = function () { el.remove(); done(true); };
    el.onerror = function () { el.remove(); done(false); };
    document.head.appendChild(el);
  }

  /* 본문과 장면을 같이 받는다.

     장면(그림)이 본문보다 늦게 오면 글을 읽기 시작한 자리에서 그림이
     끼어들며 판이 밀린다. 그래서 둘 다 온 다음에 그린다. 대신 성패는
     본문만 가른다 — 장면은 없어도 판이 서는 자리라, 그림 파일 하나
     때문에 단어 전체를 못 읽게 만들 이유가 없다.

     retry 를 true 로 주면 실패 기록을 지우고 다시 시도한다. 사용자가 "다시
     시도" 를 눌렀을 때만 쓴다 — 저절로 다시 시도하지 않는다. */
  function loadBody(bookId, done, retry) {
    if (retry) delete failed[bookId];
    if (hasBody(bookId)) { if (done) done(true); return; }
    if (failed[bookId]) { if (done) done(false); return; }
    if (loading[bookId]) { loading[bookId].push(done); return; }
    loading[bookId] = [done];

    var left = 2, ok = false;
    function settle(isBody, got) {
      if (isBody) ok = got;
      if (--left === 0) finish(bookId, ok);
    }
    inject("data/terms/" + encodeURIComponent(bookId) + ".js",
      function (got) { settle(true, got); });
    inject("data/scenes/" + encodeURIComponent(bookId) + ".js",
      function (got) { settle(false, got); });
  }

  function finish(bookId, ok) {
    // 스크립트가 실행됐는데 전역이 안 채워진 경우도 실패로 친다.
    // (배포 중에 빈 파일이나 HTML 오류 페이지가 200 으로 오는 일이 있다)
    if (!ok || !hasBody(bookId)) failed[bookId] = true;
    var waiting = loading[bookId] || [];
    delete loading[bookId];
    waiting.forEach(function (cb) { if (cb) cb(hasBody(bookId)); });
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

  /* 오늘을 무조건 밀어 넣으면 한 번도 공부하지 않은 사람에게 "1일째" 와
     오늘 칸이 켜진 격자를 보여준다. 앱이 하지 않은 일을 했다고 말하는 셈이다.
     오늘 실제로 무언가를 했을 때만 센다. */
  function streak() {
    var days = state.studyDays.slice();

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
  /* 단어를 처음 열었을 때. 여기서도 기록을 남긴다.
     예전에는 안 남겼는데, 화면의 "최근에 본 단어" 와 "읽기 시작" 줄은 목업
     seed 가 넣어둔 가짜였다. 그걸 걷어내고 나니 실제로 읽어도 그 자리가
     영영 비어 있었다. 읽은 것도 학습이므로 연속 일수에도 들어가야 한다. */
  function markOpened(termId) {
    if (statusOf(termId) !== STATUS.NEW) return;
    var rec = touch(termId, STATUS.READING);
    rec.readAt = Date.now();
    logHistory(termId, "reading");
    save();
  }

  /* 이미 복습 차례가 된 단어를 여기서 LEARNED 로 내리면 복습 대기열에서
     사라진다. 예약(dueAt)은 남아 있는데 statusOf 가 REVIEW 를 안 돌려주니
     그 단어는 다시는 안 올라온다 — 간격 반복 고리가 거기서 끊긴다.
     한 번 더 읽은 것은 진도가 아니라 복습이므로 그대로 둔다. */
  function markLearned(termId) {
    if (statusOf(termId) === STATUS.REVIEW) {
      logHistory(termId, "learned");
      save();
      return;
    }
    var rec = touch(termId, STATUS.LEARNED);
    rec.readAt = Date.now();
    logHistory(termId, "learned");
    save();
  }

  /* 맞히면 상자를 한 칸 올리고 그만큼 멀리 예약한다.
     돌려주는 값은 "며칠 뒤에 다시 봅니다"를 화면에 그대로 쓰기 위한 것이다. */
  function markPassed(termId) {
    var rec = touch(termId, STATUS.PASSED);
    var box = Math.min((rec.box || 0) + 1, BOXES.length);
    var days = intervalDays(box);
    rec.box = box;
    rec.passedAt = Date.now();
    rec.dueAt = Date.now() + days * DAY;
    logHistory(termId, "passed");
    save();
    return days;
  }

  /* 퀴즈에서 틀리면 복습 대기열로 간다. 학습 루프가 닫히는 지점이다.

     상자를 1이 아니라 0으로 내린다. 1로 내리면 다음에 맞혔을 때 바로 2번 상자(3일)로
     올라가서, 틀렸던 단어가 처음 보는 단어(1일)보다 더 좋은 대우를 받는다.
     쌓아온 간격을 처음부터 다시 벌게 하는 게 이 방식의 핵심이다. */
  function markWrong(termId) {
    var rec = touch(termId, STATUS.REVIEW);
    rec.box = 0;
    rec.dueAt = Date.now();
    rec.wrong = (rec.wrong || 0) + 1;
    logHistory(termId, "review");
    save();
  }

  /* 전부 지운다. 예전에는 지운 뒤 "며칠 써본 사람" 을 흉내 낸 가짜 진도를
     다시 채웠는데, 그건 화면을 판단하려고 목업 시절에 넣은 장치였다.
     실제로 공부하는 자리에서 그러면 지웠다고 말해놓고 남의 기록을 보여주는 셈이다.
     되돌릴 수 없으므로 부르는 쪽에서 한 번 더 묻는다. */
  function reset() {
    state = blank();
    save();
  }

  /* ---------------------------------------------------------- 읽기 화면 기억

     저장된 것이 옛 판이면 read 가 아예 없거나 반만 있다. 쓰는 쪽마다
     그걸 확인하게 두면 언젠가 한 곳이 빠지고 그 자리에서만 터진다.
     읽을 때 한 번 세워 두고, 이후로는 있다고 믿는다. */
  function readState() {
    var r = state.read;
    if (!r || typeof r !== "object") r = state.read = {};
    if (typeof r.hintSeen !== "boolean") r.hintSeen = false;
    if (!Array.isArray(r.gloss)) r.gloss = [];
    if (!r.walked || typeof r.walked !== "object") r.walked = {};
    return r;
  }

  /* 풀이를 연 용어를 적어 둔다. 이미 있으면 저장하지 않는다 —
     같은 단어를 두 번 눌렀다고 디스크에 두 번 쓸 이유가 없다. */
  function markGlossSeen(key) {
    var r = readState();
    if (r.gloss.indexOf(key) !== -1) return;
    r.gloss.push(key);
    save();
  }

  function markHintSeen() {
    var r = readState();
    if (r.hintSeen) return;
    r.hintSeen = true;
    save();
  }

  function markWalked(termId) {
    var r = readState();
    if (r.walked[termId]) return;
    r.walked[termId] = true;
    save();
  }

  return {
    STATUS: STATUS,
    STATUS_META: STATUS_META,
    statusOf: statusOf,
    dueInDays: dueInDays,
    recordOf: recordOf,
    books: books,
    allTerms: allTerms,
    bookById: bookById,
    termById: termById,
    hasBody: hasBody,
    loadBody: loadBody,
    bodyFailed: bodyFailed,
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
    readState: readState,
    markGlossSeen: markGlossSeen,
    markHintSeen: markHintSeen,
    markWalked: markWalked,
    reset: reset,
  };
})();
