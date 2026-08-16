/* ============================================================
   앱 셸 — 라우터, 탭바, 화면 전환
   해시 라우팅을 쓴다. 브라우저 뒤로가기가 그대로 동작하고
   file:// 로 열어도 문제가 없다.
   ============================================================ */

window.App = (function () {
  "use strict";

  var root;
  var tabbarEl;

  /* 목적지 4개. Apple HIG 3~5개, Material 3~5개 권장 범위 안이다.
     라벨은 항상 보인다. 아이콘만 있는 내비게이션은 발견하기 어렵다. */
  var TABS = [
    { path: "/home", label: "홈", icon: "home" },
    { path: "/books", label: "단어장", icon: "book" },
    { path: "/quiz", label: "퀴즈", icon: "quiz" },
    { path: "/progress", label: "진도", icon: "chart" },
  ];

  var routes = {};
  var scrollMemory = {};
  var lastPath = null;
  var goingBack = false;

  function register(pattern, render) {
    routes[pattern] = render;
  }

  function currentPath() {
    var hash = location.hash.replace(/^#/, "");
    return hash || "/home";
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
          params[pp[i].slice(1)] = decodeURIComponent(parts[i]);
        } else if (pp[i] !== parts[i]) {
          return;
        }
      }
      best = { render: routes[pattern], params: params };
    });

    return best;
  }

  function navigate(path, replace) {
    if (replace) {
      location.replace("#" + path);
    } else {
      location.hash = path;
    }
  }

  function back() {
    goingBack = true;
    if (history.length > 1) {
      history.back();
    } else {
      navigate("/home");
    }
  }

  /* 탭바는 최상위 화면에서만 보인다.
     읽기 화면과 퀴즈 진행 화면은 하나의 일에 집중하는 모달성 화면이라
     Apple HIG 가 탭바를 감추는 것을 허용하는 경우에 해당한다. */
  function showsTabbar(path) {
    return TABS.some(function (t) { return path === t.path; }) || /^\/books\//.test(path);
  }

  function activeTab(path) {
    if (path === "/home") return "/home";
    if (path.indexOf("/books") === 0 || path.indexOf("/term") === 0) return "/books";
    if (path.indexOf("/quiz") === 0 || path.indexOf("/recall") === 0) return "/quiz";
    if (path.indexOf("/progress") === 0) return "/progress";
    return null;
  }

  function renderTabbar(path) {
    if (!showsTabbar(path)) {
      tabbarEl.hidden = true;
      return;
    }
    tabbarEl.hidden = false;

    var active = activeTab(path);
    var dueCount = window.Store.reviewQueue().length;

    // security-ok: OWASP-A03-4 — TABS 는 이 파일 상단의 고정 배열이고, 라벨은 UI.esc 를 거친다.
    tabbarEl.innerHTML = TABS.map(function (tab) {
      var isActive = tab.path === active;
      var badge =
        tab.path === "/quiz" && dueCount
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

    // 떠나는 화면의 스크롤 위치를 기억해 둔다. 뒤로 왔을 때 그 자리에 있어야 한다.
    if (lastPath) scrollMemory[lastPath] = window.scrollY;

    var found = match(path);
    if (!found) {
      navigate("/home", true);
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
    goingBack = false;

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
    window.addEventListener("popstate", function () { goingBack = true; });

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
  };
})();
