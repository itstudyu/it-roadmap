/* ============================================================
   앱 셸 — 라우터, 탭바, 화면 전환
   해시 라우팅을 쓴다. 브라우저 뒤로가기가 그대로 동작하고
   file:// 로 열어도 문제가 없다.
   ============================================================ */

window.App = (function () {
  "use strict";

  var root;
  var tabbarEl;

  /* 목적지 5개. Apple HIG 3~5개, Material 3~5개 권장 범위의 위쪽 끝이다.
     라벨은 항상 보인다. 아이콘만 있는 내비게이션은 발견하기 어렵다.

     퀴즈가 따로 서 있지 않고 복습 안에 든다. 떠올리기(회상)와 고르기(퀴즈)는
     둘 다 "기억을 꺼내는 일" 이라 사용자 머릿속에서 한 개인데, 탭을 갈라 두면
     오늘 무엇을 해야 하는지가 두 곳으로 흩어진다. */
  var TABS = [
    { path: "/today", label: "오늘", icon: "home" },
    { path: "/course", label: "코스", icon: "book" },
    { path: "/search", label: "찾기", icon: "search" },
    { path: "/review", label: "복습", icon: "quiz" },
    { path: "/progress", label: "진도", icon: "chart" },
  ];

  /* 옛 주소를 새 주소로 넘긴다. 홈 화면에 바로가기를 만들어 둔 사람과
     퀴즈 결과를 공유한 사람이 빈 화면을 보지 않게 한다. 단어 주소
     (/term/:id) 는 안 바뀐다 — 그 주소가 진도의 열쇠이자 북마크다. */
  var LEGACY = {
    "/home": "/today",
    "/books": "/course",
    "/quiz": "/review",
    "/quiz/run": "/review/run",
    "/quiz/result": "/review/result",
  };

  function redirectOf(path) {
    if (LEGACY[path]) return LEGACY[path];
    var book = path.match(/^\/books\/(.+)$/);
    if (book) return "/course/" + book[1];
    return null;
  }

  var routes = {};
  var scrollMemory = {};
  var lastPath = null;
  var goingBack = false;

  /* 화면이 어느 쪽에서 미끄러져 들어올지, 스크롤을 복원할지 새로 시작할지를
     가르는 값이다. 그런데 "지금 뒤로 가는 중인가" 는 브라우저가 안 알려준다.

     popstate 로 판정하면 안 된다 — 앞으로 가는 해시 이동에도 똑같이 뜨고,
     hashchange 보다 먼저 뜬다. 실측으로 앞으로 네 번 이동한 화면이 전부
     뒤로 방향으로 그려졌고, 앞으로 갔는데 옛 스크롤 자리로 돌아갔다.

     그래서 두 갈래로 정한다.
       ① 우리가 일으킨 이동(navigate·back) — 방향을 우리가 안다. pendingDir.
       ② 밖에서 온 이동(OS·브라우저 뒤로/앞으로) — 이력 항목마다 번호를
          찍어 두고, 도착한 항목의 번호가 떠난 항목보다 작으면 뒤로다.
          방금 민 새 항목은 번호가 없으므로(0) 앞으로다. */
  var pendingDir = null;
  var navSeq = 0;
  var lastSeq = 0;

  function seqOf(state) {
    return state && typeof state.seq === "number" ? state.seq : 0;
  }

  /* 지금 이력 항목에 번호를 찍는다. 이미 번호가 있으면(뒤로 와서 다시 보는
     항목이면) 그대로 두고 기준만 옮긴다 — 다시 찍으면 순서가 뒤집힌다. */
  function stampSeq() {
    var seq = seqOf(history.state);
    if (!seq) {
      navSeq += 1;
      seq = navSeq;
      try {
        history.replaceState({ seq: seq }, "");
      } catch (err) {
        /* file:// 이나 사생활 보호 모드에서 막힐 수 있다. 막히면 방향 판정만
           둔해지고 화면은 그대로 그려진다. */
      }
    }
    lastSeq = seq;
  }

  function register(pattern, render) {
    routes[pattern] = render;
  }

  function currentPath() {
    var hash = location.hash.replace(/^#/, "");
    return hash || "/today";
  }

  /* 주소는 사용자가 직접 고칠 수 있는 값이다. "%E0%A4%A" 처럼 반쪽짜리 인코딩이
     들어오면 decodeURIComponent 가 URIError 를 던지는데, 그게 렌더 밖으로 빠져나가면
     화면을 그리는 코드에 아예 닿지 못한다. 주소만 바뀌고 화면은 앞의 것이 남아서
     둘이 어긋난 채 멈춘다. 못 읽으면 원문 그대로 넘겨서 "찾을 수 없다" 로 흐르게 한다. */
  function decodeParam(raw) {
    try {
      return decodeURIComponent(raw);
    } catch (e) {
      return raw;
    }
  }

  /* "/books/:id" 같은 패턴과 실제 경로를 맞춘다. */
  function match(path) {
    var parts = path.split("/").filter(Boolean);
    var best = null;

    Object.keys(routes).forEach(function (pattern) {
      var pp = pattern.split("/").filter(Boolean);
      if (pp.length !== parts.length) return;

      var params = {};
      for (var i = 0; i < pp.length; i++) {
        if (pp[i].charAt(0) === ":") {
          params[pp[i].slice(1)] = decodeParam(parts[i]);
        } else if (pp[i] !== parts[i]) {
          return;
        }
      }
      best = { render: routes[pattern], params: params };
    });

    return best;
  }

  function navigate(path, replace, dir) {
    pendingDir = dir || "forward";
    if (replace) {
      location.replace("#" + path);
    } else {
      location.hash = path;
    }
  }

  /* 이 화면의 한 단계 위. 상단바의 ← 가 가는 곳이다.

     history.back() 을 쓰면 안 된다. ← 는 계층을 올라가는 모양인데 이력을
     되감으면 다른 일을 한다 — 단어를 다섯 개 넘겨 본 사람은 목록으로
     나가려고 다섯 번 눌러야 한다(실측: 여섯 번 이동에 이력 항목 여덟 개).
     게다가 history.length 는 이 앱의 이력이 아니라 그 탭 전체를 세므로,
     다른 페이지를 거쳐 들어온 사람은 ← 한 번에 앱 밖으로 나간다.

     OS·브라우저 뒤로가기는 지금처럼 이력을 되감는다. 둘이 서로 다른
     일을 맡는 것이 맞다 — 하나는 "위로", 하나는 "아까 그 화면으로". */
  function parentOf(path) {
    var term = path.match(/^\/term\/(.+)$/);
    if (term) {
      var found = window.Store.termById(decodeParam(term[1]));
      return found ? "/course/" + found.bookId : "/course";
    }
    var route = path.match(/^\/course\/([^/]+)\/[^/]+$/);
    if (route) return "/course/" + route[1];
    if (/^\/terms\/.+/.test(path)) return "/course/" + path.split("/")[2];
    if (/^\/course\/.+/.test(path)) return "/course";
    return "/today";
  }

  function back() {
    var here = currentPath();
    var up = parentOf(here);
    // ← 는 이력을 쌓지 않는다. 위로 올라간 자리에서 OS 뒤로가기를 누르면
    // 방금 올라온 화면으로 되돌아가는 고리가 생기기 때문이다.
    if (up !== here) navigate(up, true, "back");
  }

  /* 탭바는 최상위 화면에서만 보인다.
     읽기 화면과 퀴즈 진행 화면은 하나의 일에 집중하는 모달성 화면이라
     Apple HIG 가 탭바를 감추는 것을 허용하는 경우에 해당한다. */
  function showsTabbar(path) {
    if (TABS.some(function (t) { return path === t.path; })) return true;
    // 카테고리 허브와 단어 목록은 아직 둘러보는 자리다. 탭바를 남긴다.
    // 경로 학습(/course/권/번호)과 단어 상세, 복습 진행은 한 가지 일에
    // 집중하는 자리라 감춘다 — Apple HIG 가 탭바를 감추도록 허용하는 경우다.
    return /^\/course\/[^/]+$/.test(path) || /^\/terms\//.test(path);
  }

  function activeTab(path) {
    if (path === "/today") return "/today";
    if (path.indexOf("/course") === 0 || path.indexOf("/terms") === 0 ||
        path.indexOf("/term") === 0) return "/course";
    if (path.indexOf("/search") === 0) return "/search";
    if (path.indexOf("/review") === 0 || path.indexOf("/recall") === 0) return "/review";
    if (path.indexOf("/progress") === 0) return "/progress";
    return null;
  }

  function renderTabbar(path) {
    if (!showsTabbar(path)) {
      tabbarEl.hidden = true;
      return;
    }
    tabbarEl.hidden = false;
    tabbarEl.style.setProperty("--tabs", TABS.length);

    var active = activeTab(path);
    var dueCount = window.Store.reviewQueue().length;

    // security-ok: OWASP-A03-4 — TABS 는 이 파일 상단의 고정 배열이고, 라벨은 UI.esc 를 거친다.
    tabbarEl.innerHTML = TABS.map(function (tab) {
      var isActive = tab.path === active;
      var badge =
        tab.path === "/review" && dueCount
          ? '<span class="tab__badge" aria-hidden="true">' + dueCount + "</span>"
          : "";
      return (
        '<a class="tab" href="#' + tab.path + '"' +
        (isActive ? ' aria-current="page"' : "") + ">" +
        window.UI.icon(tab.icon, 22) + badge +
        "<span>" + window.UI.esc(tab.label) + "</span></a>"
      );
    }).join("");
  }

  function render() {
    var path = currentPath();

    var moved = redirectOf(path);
    if (moved) {
      navigate(moved, true, pendingDir || "forward");
      return;
    }

    // 방향은 여기 한 곳에서만 정한다. 우리가 일으킨 이동이면 그 방향을 쓰고,
    // 밖에서 온 이동이면 이력 번호로 가른다.
    if (pendingDir) {
      goingBack = pendingDir === "back";
      pendingDir = null;
    } else {
      var seq = seqOf(history.state);
      goingBack = seq !== 0 && seq < lastSeq;
    }

    // 떠나는 화면의 스크롤 위치를 기억해 둔다. 뒤로 왔을 때 그 자리에 있어야 한다.
    if (lastPath) scrollMemory[lastPath] = window.scrollY;

    var found = match(path);
    if (!found) {
      navigate("/today", true);
      return;
    }

    var html = found.render(found.params);
    root.className = goingBack ? "screen-enter screen-enter--back" : "screen-enter";
    // 화면 함수는 문자열 템플릿으로 조립하되, 데이터가 들어가는 모든 지점에서
    // UI.esc 또는 UI.markdown(내부에서 먼저 이스케이프)을 통과시킨다.
    // 이스케이프 없이 값을 끼워 넣는 화면 함수는 이 프로젝트에서 버그로 취급한다.
    root.innerHTML = html; // security-ok: OWASP-A03-4 — 값은 전부 UI.esc / UI.markdown 을 거쳐 들어온다

    renderTabbar(path);
    document.body.dataset.route = path;

    // 앞으로 갈 때는 맨 위에서 시작하고, 뒤로 올 때는 보던 자리로 돌아간다.
    var restore = goingBack ? scrollMemory[path] || 0 : 0;
    window.scrollTo(0, restore);

    // 화면이 바뀌면 스크린리더 초점을 본문으로 옮긴다
    var heading = root.querySelector("h1, h2, [data-focus]");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }

    lastPath = path;
    stampSeq();

    if (typeof found.mounted === "function") found.mounted();
    document.dispatchEvent(new CustomEvent("screen:rendered", { detail: { path: path } }));
  }

  /* ---------------------------------------------------------- 테마 */

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem("it-vocab-mockup:theme");
    } catch (err) {
      /* 저장소를 못 쓰면 시스템 설정만 따른다 */
    }
    if (saved) document.documentElement.dataset.theme = saved;
  }

  function toggleTheme() {
    var el = document.documentElement;
    var isDark =
      el.dataset.theme === "dark" ||
      (!el.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    var next = isDark ? "light" : "dark";
    el.dataset.theme = next;
    try {
      localStorage.setItem("it-vocab-mockup:theme", next);
    } catch (err) {
      /* 저장 실패해도 이번 세션에는 적용된다 */
    }
    render();
  }

  /* ---------------------------------------------------------- 위임 이벤트
     화면을 통째로 다시 그리므로 리스너를 개별로 달지 않는다.
     data-action 하나로 모든 버튼을 받는다. */

  var actions = {};

  function on(name, handler) {
    actions[name] = handler;
  }

  function handleClick(event) {
    var el = event.target.closest("[data-action]");
    if (!el) return;
    var name = el.dataset.action;
    if (!actions[name]) return;
    event.preventDefault();
    actions[name](el.dataset, el, event);
  }

  function start() {
    root = document.getElementById("view");
    tabbarEl = document.getElementById("tabbar");

    initTheme();
    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", render);

    on("back", back);
    on("theme", toggleTheme);
    on("go", function (data) { navigate(data.to); });

    render();
  }

  return {
    register: register,
    navigate: navigate,
    back: back,
    on: on,
    start: start,
    render: render,
    currentPath: currentPath,
  };
})();
