/* ============================================================
   코스 화면들 — 오늘 · 코스 · 카테고리 · 경로 · 단어 목록 · 찾기

   단어장은 낱말을 가나다순으로 늘어놓는다. 그러면 634개가 634개의 섬으로
   남는다. 여기서 세우는 것은 그 사이의 길이다.

     오늘        지금 이어서 갈 한 칸
     코스        네 갈래 학습 목적 -> 12권
     카테고리    그 권의 상황별 경로 셋
     경로        예: "웹사이트가 열리는 길" URL·DNS·IP·TCP·HTTPS·HTTP·분산기
     단어 목록   그 권 전체 (경로에 안 든 것도 여기 다 있다)
     찾기        이름으로 바로

   경로 데이터는 data/paths.js 에서 온다. 단어 이름이 아니라 id 로 굳어
   있으므로 실행 중에 이름을 찾다 빗나갈 일이 없다.
   ============================================================ */

(function () {
  "use strict";

  var App = window.App, Store = window.Store, UI = window.UI, Paths = window.Paths;

  var search = { query: "", book: "all" };
  var listState = { bookId: null, query: "" };

  function href(path) { return "#" + path; }
  function enc(v) { return encodeURIComponent(v); }

  /* 상태 뱃지. 목록에서 이 단어를 이미 설명할 수 있는지 한눈에 보이게 한다. */
  function badge(termId) {
    var S = Store.STATUS;
    var meta = {};
    meta[S.READING] = ["학습 중", "is-reading"];
    meta[S.LEARNED] = ["설명 가능", "is-learned"];
    meta[S.PASSED] = ["설명 가능", "is-passed"];
    meta[S.REVIEW] = ["복습 필요", "is-review"];
    var got = meta[Store.statusOf(termId)];
    return got ? '<em class="pill ' + got[1] + '">' + got[0] + "</em>" : "";
  }

  function ring(percent) {
    return '<span class="ring" style="--p:' + percent + '" aria-hidden="true"><b>' +
      percent + "</b></span>";
  }

  /* 경로 한 줄. 진도와 다음 칸을 같이 보인다 — 목록에서 바로 이어 갈 수 있어야
     "오늘 뭐 하지" 를 다시 묻지 않는다. */
  function pathRow(bookId, index, path) {
    var p = Paths.progressOf(path);
    var next = Paths.nextNode(path);
    return (
      '<a class="path-row" href="' + href("/course/" + enc(bookId) + "/" + index) + '">' +
        "<span>" + ring(p.percent) + "</span>" +
        "<span><b>" + UI.esc(path.name) + "</b><small>" +
          path.nodes.length + "칸 · 약 " + path.minutes + "분" +
          (next ? " · 다음 " + UI.esc(next.term) : " · 다 걸었습니다") +
        "</small></span>" +
        UI.icon("right", 18) +
      "</a>"
    );
  }

  /* ---------------------------------------------------------- 오늘 */

  App.register("/today", function () {
    var today = Paths.todayPath();
    var due = Store.reviewQueue();
    var streak = Store.streak();
    var stats = Store.overallStats();
    var recent = Store.recentlyStudied(3);

    var hero = "";
    if (today) {
      var node = Paths.nextNode(today.path);
      var meta = Paths.meta(today.bookId);
      var book = Store.bookById(today.bookId);
      hero = node
        ? '<section class="today-hero">' +
            '<span class="eyebrow">' + UI.esc(book ? book.name : today.bookId) + " · " +
              UI.esc(today.path.name) + "</span>" +
            "<h1>" + UI.esc(node.term) + "</h1>" +
            "<p>" + UI.esc(meta ? meta.topic : "") + "</p>" +
            '<div class="today-hero__meta">' + ring(today.progress.percent) +
              "<span><b>" + today.progress.done + " / " + today.progress.total +
              "</b><small>이 길에서 설명할 수 있는 칸</small></span></div>" +
            '<a class="cta" href="' + href("/learn/" + enc(node.id)) + '"' +
              ' data-from-book="' + UI.esc(today.bookId) + '" data-from-path="' + today.index + '">' +
              "<span>이어서 배우기</span>" + UI.icon("forward", 18) + "</a>" +
            '<a class="cta cta--quiet" href="' +
              href("/course/" + enc(today.bookId) + "/" + today.index) + '">이 길 전체 보기</a>' +
          "</section>"
        : '<section class="today-hero today-hero--done">' +
            '<span class="eyebrow">' + UI.esc(today.path.name) + "</span>" +
            "<h1>이 길은 다 걸었습니다.</h1>" +
            '<a class="cta" href="' + href("/course") + '"><span>다음 길 고르기</span>' +
              UI.icon("forward", 18) + "</a>" +
          "</section>";
    }

    var dueCard = due.length
      ? '<a class="today-card today-card--due" href="' + href("/review") + '">' +
          "<span><b>복습할 단어 " + due.length + "개</b>" +
          "<small>떠올려 보고 확인하면 다음 간격으로 밀립니다</small></span>" +
          UI.icon("right", 18) + "</a>"
      : '<div class="today-card today-card--calm"><span><b>오늘 복습할 것은 없습니다</b>' +
        "<small>배운 단어가 다시 올라올 때 여기에 뜹니다</small></span></div>";

    var recentRow = recent.length
      ? '<section class="today-recent"><h2>최근에 본 단어</h2><div>' +
          recent.map(function (t) {
            return '<a href="' + href("/term/" + enc(t.id)) + '"><b>' + UI.esc(t.term) +
              "</b>" + badge(t.id) + "</a>";
          }).join("") +
        "</div></section>"
      : "";

    return (
      '<main class="screen today" id="today">' +
        '<header class="screen-top"><div><span class="eyebrow">오늘</span>' +
          "<b>" + streak.count + "일째 · 설명 가능 " +
          Store.ableCount(stats.counts) + " / " + stats.total + "</b></div>" +
          '<button class="round-btn" type="button" data-action="theme" aria-label="밝기 바꾸기">' +
            UI.icon("moon", 18) + "</button></header>" +
        hero + dueCard + recentRow +
      "</main>"
    );
  });

  /* ---------------------------------------------------------- 코스 목록 */

  App.register("/course", function () {
    var groups = Paths.groups().map(function (group) {
      var books = group.books.map(function (book) {
        var stats = Store.bookStats(book);
        var meta = Paths.meta(book.id) || {};
        var able = Store.ableCount(stats.counts);
        return (
          '<a class="book-row" href="' + href("/course/" + enc(book.id)) + '">' +
            '<span class="book-row__mark">' + UI.esc(meta.mark || "") + "</span>" +
            "<span><b>" + UI.esc(book.name) + "</b><small>" +
              UI.esc(meta.topic || book.blurb || "") + "</small>" +
              '<small class="book-row__count">단어 ' + stats.total + "개 · 경로 " +
              Paths.pathsFor(book.id).length + "개 · 설명 가능 " + able + "개</small></span>" +
            UI.icon("right", 18) +
          "</a>"
        );
      }).join("");
      return '<section class="group"><h2>' + UI.esc(group.name) + "</h2>" + books + "</section>";
    }).join("");

    return (
      '<main class="screen catalog" id="catalog">' +
        '<header class="screen-head"><span class="eyebrow">코스</span>' +
          "<h1>무엇을 만들고 싶은지부터 고릅니다.</h1>" +
          "<p>열두 갈래를 네 가지 목적으로 묶었습니다. 어느 쪽부터 봐도 됩니다.</p></header>" +
        groups +
      "</main>"
    );
  });

  /* ---------------------------------------------------------- 카테고리 허브 */

  App.register("/course/:bookId", function (params) {
    var book = Store.bookById(params.bookId);
    if (!book) return notFound("그런 단어장이 없습니다.");
    var meta = Paths.meta(book.id) || {};
    var stats = Store.bookStats(book);
    var paths = Paths.pathsFor(book.id);

    return (
      '<main class="screen hub" id="hub">' +
        '<header class="screen-head"><button class="text-back" type="button" data-action="back">' +
          UI.icon("back", 16) + "<span>코스</span></button>" +
          '<span class="eyebrow">' + UI.esc(meta.mark || "") + " " + UI.esc(book.name) + "</span>" +
          "<h1>" + UI.esc(meta.topic || book.name) + "</h1>" +
          "<p>" + UI.esc(meta.blurb || book.blurb || "") + "</p></header>" +
        '<section class="hub-paths"><h2>상황별로 걷기</h2>' +
          paths.map(function (path, i) { return pathRow(book.id, i, path); }).join("") +
        "</section>" +
        '<a class="hub-all" href="' + href("/terms/" + enc(book.id)) + '">' +
          "<span><b>" + UI.esc(book.name) + " 전체 " + stats.total + "개</b>" +
          "<small>경로에 안 든 단어도 여기 다 있습니다</small></span>" + UI.icon("right", 18) +
        "</a>" +
      "</main>"
    );
  });

  /* ---------------------------------------------------------- 경로 */

  App.register("/course/:bookId/:pathIndex", function (params) {
    var book = Store.bookById(params.bookId);
    var path = book && Paths.pathAt(book.id, params.pathIndex);
    if (!path) return notFound("그런 경로가 없습니다.");

    var progress = Paths.progressOf(path);
    var next = Paths.nextNode(path);

    /* 번호가 붙은 칸은 본줄기, ↳ 는 곁가지다. 곁가지에 번호를 매기면
       "이것도 순서대로 봐야 하나" 로 읽혀서 길이 길어 보인다. */
    var nodes = path.nodes.map(function (node, i) {
      var status = Store.statusOf(node.id);
      var isNext = next && next.id === node.id;
      var done = status === Store.STATUS.PASSED || status === Store.STATUS.LEARNED;
      return (
        '<a class="node' + (done ? " is-done" : "") + (isNext ? " is-next" : "") + '" href="' +
          href("/learn/" + enc(node.id)) + '"' +
          // 어느 길을 걷다 들어왔는지. 학습을 끝냈을 때 그 길에서 다음 칸을 고른다.
          ' data-from-book="' + UI.esc(book.id) + '" data-from-path="' + Number(params.pathIndex) + '">' +
          '<span class="node__no">' + (done ? UI.icon("check", 14) : i + 1) + "</span>" +
          "<span><b>" + UI.esc(node.term) + "</b>" +
            (node.borrowed
              ? '<small class="node__borrowed">' + UI.esc(bookNameOf(node.bookId)) + " 에서 빌려 옴</small>"
              : "") +
          "</span>" + badge(node.id) + UI.icon("right", 18) +
        "</a>"
      );
    }).join("");

    return (
      '<main class="screen route" id="route">' +
        '<header class="screen-head"><button class="text-back" type="button" data-action="back">' +
          UI.icon("back", 16) + "<span>" + UI.esc(book.name) + "</span></button>" +
          '<span class="eyebrow">상황별 경로</span>' +
          "<h1>" + UI.esc(path.name) + "</h1>" +
          '<div class="route-meta">' + ring(progress.percent) +
            "<span><b>" + progress.done + " / " + progress.total +
            "</b><small>설명할 수 있는 칸 · 약 " + path.minutes + "분</small></span></div>" +
        "</header>" +
        '<ol class="node-list">' + nodes + "</ol>" +
        (next
          ? '<a class="cta cta--sticky" href="' + href("/learn/" + enc(next.id)) + '"' +
            ' data-from-book="' + UI.esc(book.id) + '" data-from-path="' + Number(params.pathIndex) + '">' +
            "<span>" + UI.esc(next.term) + " 부터 이어가기</span>" + UI.icon("forward", 18) + "</a>"
          : '<p class="route-done">이 길은 다 걸었습니다. 이제 남에게 설명해 보세요.</p>') +
      "</main>"
    );
  });

  function bookNameOf(bookId) {
    var book = Store.bookById(bookId);
    return book ? book.name : bookId;
  }

  function notFound(message) {
    return '<main class="screen"><p class="empty">' + UI.esc(message) + "</p>" +
      '<a class="cta" href="' + href("/course") + '">코스로 가기</a></main>';
  }

  /* ---------------------------------------------------------- 권 전체 단어 */

  var termsScreen = function (params) {
    var book = Store.bookById(params.bookId);
    if (!book) return notFound("그런 단어장이 없습니다.");
    if (listState.bookId !== book.id) listState = { bookId: book.id, query: "" };

    var q = listState.query.trim().toLowerCase();
    var list = book.terms.filter(function (t) {
      if (!q) return true;
      return (t.term + " " + (t.reading || "")).toLowerCase().indexOf(q) !== -1;
    });

    return (
      '<main class="screen list" id="list">' +
        '<header class="screen-head"><button class="text-back" type="button" data-action="back">' +
          UI.icon("back", 16) + "<span>" + UI.esc(book.name) + "</span></button>" +
          "<h1>" + UI.esc(book.name) + " 전체</h1>" +
          "<p>" + book.terms.length + "개 가운데 " + list.length + "개를 보고 있습니다.</p>" +
        "</header>" +
        '<label class="find" for="list-find">' + UI.icon("search", 18) +
          '<input id="list-find" type="search" value="' + UI.esc(listState.query) +
          '" placeholder="' + UI.esc(book.name) + ' 에서 찾기" autocomplete="off"></label>' +
        (list.length
          ? '<div class="term-rows">' + list.map(termRow).join("") + "</div>"
          : '<p class="empty">찾는 단어가 없습니다.</p>') +
      "</main>"
    );
  };
  App.register("/terms/:bookId", termsScreen);

  function termRow(t) {
    return (
      '<a class="term-row" href="' + href("/learn/" + enc(t.id)) + '">' +
        "<span><b>" + UI.esc(t.term) + "</b>" +
        (t.reading ? "<small>" + UI.esc(t.reading) + "</small>" : "") + "</span>" +
        badge(t.id) + UI.icon("right", 18) +
      "</a>"
    );
  }

  /* ---------------------------------------------------------- 찾기 */

  var searchScreen = function () {
    var q = search.query.trim().toLowerCase();
    var hits = [];
    if (q) {
      hits = Store.allTerms().filter(function (t) {
        if (search.book !== "all" && t.bookId !== search.book) return false;
        var hay = (t.term + " " + (t.reading || "") + " " + (t.aliases || []).join(" ")).toLowerCase();
        return hay.indexOf(q) !== -1;
      }).slice(0, 60);
    }

    var chips = [{ id: "all", name: "전체" }].concat(Store.books()).map(function (b) {
      return '<button type="button" class="chip' + (search.book === b.id ? " is-on" : "") +
        '" data-action="search-book" data-book="' + UI.esc(b.id) + '">' +
        UI.esc(b.name) + "</button>";
    }).join("");

    return (
      '<main class="screen find-screen" id="find">' +
        '<header class="screen-head"><span class="eyebrow">찾기</span>' +
          "<h1>이름을 알면 바로.</h1></header>" +
        '<label class="find" for="find-input">' + UI.icon("search", 18) +
          '<input id="find-input" type="search" value="' + UI.esc(search.query) +
          '" placeholder="예: DNS, 인증, 캐시" autocomplete="off" autofocus></label>' +
        '<div class="chips">' + chips + "</div>" +
        (q
          ? (hits.length
              ? '<div class="term-rows">' + hits.map(termRow).join("") + "</div>"
              : '<p class="empty">“' + UI.esc(search.query) + '” 로 찾은 단어가 없습니다.</p>')
          : '<p class="empty">단어 이름이나 우리말 뜻으로 찾습니다.</p>') +
      "</main>"
    );
  };
  App.register("/search", searchScreen);

  /* 칩을 눌러도 화면을 통째로 세우지 않는다. 그러면 입력칸이 새로 서면서
     초점이 제목으로 옮겨가고 폰에서는 자판이 내려간다 — swap() 을 만든 이유가
     바로 그것이다. 칩의 눌림 표시만 손으로 옮기고 결과만 갈아 끼운다. */
  App.on("search-book", function (data) {
    search.book = data.book;
    document.querySelectorAll("#find .chip").forEach(function (el) {
      el.classList.toggle("is-on", el.dataset.book === data.book);
    });
    swap("#find .term-rows, #find .empty", searchScreen());
  });

  /* 자판 입력은 다시 그리지 않는다 — 한 글자마다 화면을 세우면 커서가 튄다.
     찾기는 결과가 바로 나와야 하므로 목록만 갈아 끼운다. */
  document.addEventListener("input", function (event) {
    var el = event.target;
    if (el.id === "find-input") {
      search.query = el.value;
      swap("#find .term-rows, #find .empty", searchScreen());
    } else if (el.id === "list-find") {
      listState.query = el.value;
      swap("#list .term-rows, #list .empty", termsScreen({ bookId: listState.bookId }));
    }
  });

  /* 결과 부분만 갈아 끼운다. 화면 전체를 다시 그리면 입력칸이 새로 서면서
     자판이 내려간다 — 폰에서 한 글자 칠 때마다 자판이 사라지면 못 쓴다.

     화면 함수를 직접 부른다. 라우터에 "패턴으로 다시 그려 줘" 같은 문을
     새로 뚫지 않는다 — 이 화면 둘만 쓰는 일에 앱 전체의 API 를 넓히면
     다음 사람이 그 문으로 다른 것도 들여온다. */
  function swap(host, html) {
    var current = document.querySelector(host);
    if (!current) return;
    var wrap = document.createElement("div");
    // security-ok: OWASP-A03-4 — 값은 전부 UI.esc 를 거쳐 들어온다
    wrap.innerHTML = html;
    var fresh = wrap.querySelector(".term-rows") || wrap.querySelector(".empty");
    if (fresh) current.replaceWith(fresh);
    /* 머리글의 "N개 가운데 M개" 도 같이 갈아 끼운다. 목록만 바꾸면 숫자가
       거르기 전 값에 머물러 화면이 사실과 다른 말을 한다. */
    var headOld = document.querySelector(".screen-head p");
    var headNew = wrap.querySelector(".screen-head p");
    if (headOld && headNew) headOld.replaceWith(headNew);
  }
})();
