/* ============================================================
   상황별 경로 — "이 단어들을 이 순서로 보면 한 상황이 이해된다"

   단어장은 낱말을 가나다순으로 늘어놓는다. 그러면 DNS 를 읽고 IP 를 읽어도
   둘이 어떻게 이어지는지는 끝내 안 보인다. 경로는 그 사이를 잇는다 —
   "웹사이트가 열리는 길" 은 URL·DNS·IP·TCP·HTTPS·HTTP·Load Balancer 를
   그 순서로 지난다.

   데이터는 tools/build_paths.py 가 paths/paths.json 에서 굽는다. 굽는 동안
   단어 이름이 id 로 바뀌므로, 여기서는 실행 중에 이름을 찾을 일이 없다.
   ============================================================ */

window.Paths = (function () {
  "use strict";

  function data() {
    return window.VOCAB_PATHS || { groups: [], books: {} };
  }

  /* 12권을 네 갈래 학습 목적으로 묶는다. 권 자체는 그대로 두고 묶음만 얹는다 —
     권 id 는 진도의 열쇠라 건드릴 수 없다. */
  function groups() {
    return data().groups.map(function (group) {
      return {
        id: group.id,
        name: group.name,
        books: group.books
          .map(function (id) { return window.Store.bookById(id); })
          .filter(Boolean),
      };
    });
  }

  function meta(bookId) {
    return data().books[bookId] || null;
  }

  function pathsFor(bookId) {
    var found = data().books[bookId];
    return found ? found.paths : [];
  }

  /* 범위 밖이면 null 이다. 0번으로 눕히면 주소는 3번인데 화면은 0번을 보이고,
     그 어긋남이 스스로 고쳐지지 않는다 — 공유한 주소가 다른 길을 연다. */
  function pathAt(bookId, index) {
    var list = pathsFor(bookId);
    var i = Number(index);
    if (!Number.isInteger(i) || i < 0 || i >= list.length) return null;
    return list[i];
  }

  /* 이 단어가 들어간 경로 전부. 하나의 낱말이 여러 상황에 겹쳐 드는 것이
     오히려 이 앱이 보여주려는 것이라, 첫 하나에서 멈추지 않는다. */
  function pathsContaining(termId) {
    var out = [];
    Object.keys(data().books).forEach(function (bookId) {
      pathsFor(bookId).forEach(function (path, index) {
        var hit = path.nodes.some(function (node) { return node.id === termId; });
        if (hit) out.push({ bookId: bookId, index: index, path: path });
      });
    });
    return out;
  }

  /* 경로 하나의 진도. 노드가 전부 '설명 가능' 이 되면 그 상황을 통과한 것이다. */
  function progressOf(path) {
    var S = window.Store.STATUS;
    var done = 0;
    var reading = 0;
    path.nodes.forEach(function (node) {
      var status = window.Store.statusOf(node.id);
      if (status === S.PASSED || status === S.LEARNED) done += 1;
      else if (status === S.READING || status === S.REVIEW) reading += 1;
    });
    return {
      done: done,
      reading: reading,
      total: path.nodes.length,
      percent: path.nodes.length ? Math.round((done / path.nodes.length) * 100) : 0,
    };
  }

  /* 이 경로에서 다음에 볼 단어. 앞에서부터 아직 설명 못 하는 첫 칸이다.
     전부 됐으면 null 을 돌려 "이 길은 끝났다" 를 알린다. */
  function nextNode(path) {
    var S = window.Store.STATUS;
    return path.nodes.find(function (node) {
      var status = window.Store.statusOf(node.id);
      return status !== S.PASSED && status !== S.LEARNED;
    }) || null;
  }

  /* 오늘 이어서 갈 길. 이미 손댄 길 중 가장 많이 나아간 것을 고르고,
     손댄 길이 없으면 네트워크의 첫 길에서 시작한다 — 웹사이트가 열리는
     과정은 누구나 매일 겪는 일이라 첫 문으로 삼기에 낫다. */
  function todayPath() {
    var best = null;
    Object.keys(data().books).forEach(function (bookId) {
      pathsFor(bookId).forEach(function (path, index) {
        var progress = progressOf(path);
        if (!progress.done && !progress.reading) return;
        if (progress.done === progress.total) return;
        if (!best || progress.done > best.progress.done) {
          best = { bookId: bookId, index: index, path: path, progress: progress };
        }
      });
    });
    if (best) return best;
    var first = pathAt("net", 0);
    return first
      ? { bookId: "net", index: 0, path: first, progress: progressOf(first) }
      : null;
  }

  return {
    groups: groups,
    meta: meta,
    pathsFor: pathsFor,
    pathAt: pathAt,
    pathsContaining: pathsContaining,
    progressOf: progressOf,
    nextNode: nextNode,
    todayPath: todayPath,
  };
})();
