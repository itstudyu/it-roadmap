/* ============================================================
   읽기 화면의 두 장치 — 용어 풀이와 그림 단계 보기

   둘 다 화면이 이미 그려진 다음에 붙는다. screens.js 는 문자열로
   화면을 만들고, 여기서는 그 결과 DOM 을 손본다. 그래서 이 파일이
   없어도 앱은 그대로 읽힌다 — 없으면 점선이 안 그어지고 그림이
   처음부터 다 보일 뿐이다.

   ① 용어 풀이
      정의 한 줄과 그림 속의 낯선 용어에 점선 밑줄을 긋고, 탭하면
      그 줄 바로 아래에 한 줄 뜻을 편다. 사전은 따로 없다 —
      단어장 색인(327편의 제목·별칭·한 줄 뜻)이 그대로 사전이다.
      풀이를 멀리 두지 않는 이유: 글은 그림의 해당 부분 옆에 있을 때
      배워진다(Mayer, 공간 근접).

   ② 그림 단계 보기
      흐름 그림을 탭으로 한 마디씩 밝혀 간다. 지나온 마디는 사라지지
      않고, 자동 재생은 없다. 속도를 학습자가 정할 때 더 깊이 배우고
      (Mayer, 분절), 저절로 움직이는 그림은 기억에서 먼저 사라져
      정지 그림보다 못하다(Tversky·Morrison 2002).
   ============================================================ */

window.Reading = (function () {
  "use strict";

  /* ---------------------------------------------------------- 사전

     색인의 별칭을 그대로 열쇠로 쓴다. 한 단어가 "HTTPS" · "https" ·
     "HTTP Secure" 로 불리는 것을 이미 색인이 알고 있으므로 여기서
     다시 정리하지 않는다.

     한 글자 열쇠는 버린다. "큐" 는 "큐레이션" 한가운데서도 걸리고,
     그렇게 걸린 풀이는 도움이 아니라 방해다. */
  var MIN_KEY = 2;

  var dict = null;   // { 소문자열쇠: { name, text, id } }
  var finder = null; // 열쇠 전부를 담은 정규식 하나

  function normKey(s) {
    return String(s || "").trim().toLowerCase();
  }

  /* 같은 별칭을 두 단어가 가질 때가 있다("인증서" 는 Certificate 와
     인증서 양쪽의 별칭이다). 제목이 그 별칭과 같은 쪽이 이긴다 —
     별칭으로만 걸린 쪽보다 그 이름을 제 이름으로 쓰는 쪽이 맞다. */
  function claim(key, term) {
    var found = dict[key];
    if (!found) return true;
    return normKey(term.term) === key && normKey(found.name) !== key;
  }

  /* 긴 열쇠를 앞에 세운다. 정규식의 선택지는 같은 자리에서 적힌 순서대로
     시도되므로, 이 정렬 하나가 "IP 주소" 를 "IP" 보다 먼저 잡게 한다.

     앞: 글자 한가운데가 아니어야 한다("재호출" 의 호출은 안 잡는다).
     뒤: 라틴·숫자가 이어지면 다른 낱말이다("HTTPS" 의 HTTP 는 안 잡는다).
     한글이 이어지는 것은 조사로 본다("HTTP를", "인증서를"). */
  function buildFinder(keys) {
    var body = keys
      .slice()
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); })
      .join("|");
    return new RegExp("(^|[^A-Za-z0-9가-힣])(" + body + ")(?![A-Za-z0-9])", "gi");
  }

  function addTerm(t) {
    var text = window.UI.plain(t.summary || "");
    if (!text) return;
    var names = t.aliases && t.aliases.length ? t.aliases : [t.term];
    names.forEach(function (a) {
      var key = normKey(a);
      if (key.length < MIN_KEY || !claim(key, t)) return;
      dict[key] = { name: t.term, text: text, id: t.id, book: t.bookId };
    });
  }

  function buildDict() {
    dict = {};
    window.Store.allTerms().forEach(addTerm);
    finder = buildFinder(Object.keys(dict));
  }

  /* ---------------------------------------------------------- 표시할 자리

     칸 이름(.dia__col)은 뺀다 — 대조의 뼈대라 풀이 대상이 아니고,
     2열 머리 안에 카드가 끼면 판이 깨진다. `=` 요약 줄(.dia__sum)과
     그림 제목(.dia__cap)도 뺀다. 거기는 그림이 스스로 말하는 자리다. */
  var NO_MARK = "code, .tmark, .xref, .dia__sum, .dia__cap, .dia__col, .gloss, button";

  /* 그림 하나당 이 페이지에 처음 나오는 용어 셋까지. 넷을 넘으면
     그림이 사전이 되어 정작 그림이 안 읽힌다. 이미 이 페이지에서
     점선을 받은 용어가 또 나오는 것은 예산을 쓰지 않는다. */
  var PER_SCOPE = 3;

  function textNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (var p = n.parentNode; p && p !== root; p = p.parentNode) {
          if (p.matches && p.matches(NO_MARK)) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var found = [];
    while (walker.nextNode()) found.push(walker.currentNode);
    return found;
  }

  /* 이 글자 안에서 점선을 그을 첫 자리. 건너뛴 열쇠 뒤에서 계속 찾는다 —
     한 번 걸렸다고 멈추면 "TLS 는 TCP 위에 있다" 에서 TCP 를 놓친다. */
  function firstHit(text, ctx) {
    finder.lastIndex = 0;
    var m;
    while ((m = finder.exec(text))) {
      var raw = m[2];
      var key = normKey(raw);
      var at = m.index + m[1].length;
      var fresh = !ctx.page[key];
      if (!ctx.scope[key] && !ctx.skip[key] && ctx.ok(key, dict[key]) &&
          (!fresh || ctx.left > 0)) {
        return { at: at, raw: raw, key: key, fresh: fresh };
      }
      finder.lastIndex = at + raw.length;
    }
    return null;
  }

  function markNode(node, ctx) {
    var hit = firstHit(node.nodeValue, ctx);
    if (!hit) return;

    var word = node.splitText(hit.at);
    var tail = word.splitText(hit.raw.length);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tmark";
    btn.dataset.key = hit.key;
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = word.nodeValue;
    word.parentNode.replaceChild(btn, word);

    ctx.scope[hit.key] = true;
    if (hit.fresh) {
      ctx.page[hit.key] = true;
      ctx.left--;
    }
    markNode(tail, ctx); // 같은 글자의 나머지도 마저 훑는다
  }

  function markScope(el, page, skip, ok) {
    var ctx = { page: page, skip: skip, ok: ok, scope: {}, left: PER_SCOPE };
    textNodes(el).forEach(function (n) { markNode(n, ctx); });
  }

  /* 이미 열어 본 용어는 조용히 시작한다. 진한 점선이 하나씩 줄어드는
     것이 곧 진도고, 남은 옅은 선이 "다시 볼 수 있다" 를 말한다. */
  function hush(root, key) {
    Array.prototype.forEach.call(
      root.querySelectorAll('.tmark[data-key="' + (window.CSS ? CSS.escape(key) : key) + '"]'),
      function (m) { m.dataset.known = "1"; }
    );
  }

  var HINT = "점선 밑줄 단어를 탭하면 바로 아래에 풀이가 열린다";

  /* 밑줄의 뜻은 처음 한 번만 글로 가르친다. 장식을 키우는 대신 규칙을
     배우게 하고, 한 번 배웠으면 다시 말하지 않는다. */
  function teachOnce(root) {
    if (window.Store.readState().hintSeen) return;
    var gist = root.querySelector(".gist");
    if (!gist || !root.querySelector(".tmark")) return;
    var line = document.createElement("p");
    line.className = "glosshint";
    line.textContent = HINT;
    gist.parentNode.insertBefore(line, gist.nextSibling);
  }

  /* 자기 자신은 풀지 않는다. 제목·원어·별칭 전부를 뺀다 —
     "HTTPS" 노트에서 "HTTP Secure" 에 점선이 그어지면 우스워진다. */
  function ownKeys(term) {
    var skip = {};
    var names = (term.aliases || []).concat([term.term, term.reading || ""]);
    names.forEach(function (n) {
      var key = normKey(n);
      if (key) skip[key] = true;
    });
    return skip;
  }

  var HANGUL = /[가-힣]/;

  /* 동음이의어 가드.

     "토큰" 은 AI 에서는 모델이 글을 자르는 조각이고 보안에서는 로그인 증표다.
     별칭 표는 그중 하나만 갖고 있어서, JWT 노트에서 "토큰" 을 누르면
     "모델이 글을 다루는 최소 조각" 이 나왔다. 틀린 풀이는 없는 풀이보다 나쁘다.

     겹침이 생기는 자리는 **번역 별칭** 이다. 그 단어의 제 이름은 "Token" 인데
     한국어로 옮긴 이름 하나가 별칭 표에 올라 있는 경우다. 다른 분야가 같은
     한국어 낱말을 쓰면 그때 부딪힌다.

     그래서 어디서 나와도 푸는 것은 둘이다.
       - 라틴 약자(HTTP·TLS·DB·CPU) — IT 안에서 뜻이 하나다
       - 그 낱말이 단어의 **제 이름**인 한글 용어(암호화·인증서·자료구조) —
         단어장이 그 한국어를 표제어로 삼았다는 건 그 뜻이 대표라는 뜻이다

     남는 것은 번역 별칭뿐이고, 그건 **가까울 때만** 푼다 — 같은 단어장에
     있거나, 이 노트가 관련 용어로 걸어둔 단어이거나.

     느슨하게 잡아 틀리는 것보다 몇 개 못 잡고 마는 편이 낫다. */
  function nearby(term) {
    var near = {};
    near[term.bookId] = true;
    var ids = {};
    (term.related || []).forEach(function (r) {
      var found = dict[normKey(r.term)];
      if (found) ids[found.id] = true;
    });
    return function (key, entry) {
      if (!HANGUL.test(key)) return true;
      if (normKey(entry.name) === key) return true;
      return near[entry.book] === true || ids[entry.id] === true;
    };
  }

  function applyGloss(root, term) {
    if (!dict) buildDict();
    var page = {};
    var skip = ownKeys(term);
    var ok = nearby(term);

    var gist = root.querySelector(".gist");
    if (gist) markScope(gist, page, skip, ok);
    Array.prototype.forEach.call(
      root.querySelectorAll(".figure-slot .dia, .pinsec .dia"),
      function (fig) { markScope(fig, page, skip, ok); }
    );

    window.Store.readState().gloss.forEach(function (k) { hush(root, k); });
    teachOnce(root);
  }

  /* ---------------------------------------------------------- 풀이 카드 */

  var open = null; // 열린 풀이는 한 번에 하나

  function closeGloss() {
    if (!open) return;
    open.card.remove();
    open.mark.setAttribute("aria-expanded", "false");
    open = null;
    document.dispatchEvent(new CustomEvent("dia:changed"));
  }

  /* 풀이는 탭한 자리 바로 아래에 선다. 멀리 띄우지 않는다.
     그림 안이면 그 마디의 몸통 안, 대조면 그 줄 다음, 본문이면 그 문단 다음. */
  function slotFor(mark, card) {
    var inStep = mark.closest(".dia__body") || mark.closest(".dia__layer");
    if (inStep) { inStep.appendChild(card); return; }
    var row = mark.closest(".dia__vsrow");
    if (row) { row.parentNode.insertBefore(card, row.nextSibling); return; }
    var block = mark.closest(".gist, p, li, dd");
    if (block) { block.parentNode.insertBefore(card, block.nextSibling); return; }
    mark.parentNode.appendChild(card);
  }

  function cardFor(entry) {
    var card = document.createElement("span");
    card.className = "gloss";
    card.setAttribute("role", "note");
    var name = document.createElement("b");
    name.className = "gloss__term";
    name.textContent = entry.name;
    card.appendChild(name);
    card.appendChild(document.createTextNode(entry.text));
    return card;
  }

  function toggleGloss(mark, root) {
    if (open && open.mark === mark) { closeGloss(); return; }
    closeGloss();

    var key = mark.dataset.key;
    var entry = dict && dict[key];
    if (!entry) return;

    var card = cardFor(entry);
    slotFor(mark, card);
    mark.setAttribute("aria-expanded", "true");
    open = { mark: mark, card: card };

    // 규칙을 한 번 썼으면 안내는 더 필요 없다
    if (!window.Store.readState().hintSeen) {
      window.Store.markHintSeen();
      var line = document.querySelector(".glosshint");
      if (line) line.remove();
    }

    hush(root, key);
    window.Store.markGlossSeen(key);
    document.dispatchEvent(new CustomEvent("dia:changed"));
  }

  /* ---------------------------------------------------------- ② 단계 보기 */

  /* "돌아오는 길" 표지(.dia__turn)는 뒤따르는 마디와 한 몸으로 움직인다.
     혼자 밝아지면 아무 데도 안 닿은 화살표만 떠 있게 된다. */
  function unitsOf(list) {
    var units = [];
    var turn = null;
    Array.prototype.forEach.call(list.children, function (li) {
      if (li.classList.contains("dia__turn")) { turn = li; return; }
      units.push({ li: li, turn: turn });
      turn = null;
    });
    return units;
  }

  var WALK_HINT = "그림을 탭하면 다음 단계가 밝아진다";

  function setupWalk(root, termId) {
    var fig = root.querySelector(".figure-slot .dia--flow");
    var list = fig && fig.querySelector(".dia__steps");
    if (!list) return;

    var units = unitsOf(list);
    if (units.length < 2) return;

    var sum = fig.querySelector(".dia__sum");
    fig.classList.add("dia--walk");

    var hint = document.createElement("span");
    hint.className = "walkhint";
    hint.textContent = WALK_HINT;
    fig.appendChild(hint);

    // 지난번에 끝까지 봤으면 전체가 보인 채로 연다
    var at = window.Store.readState().walked[termId] ? units.length - 1 : 0;

    function paint() {
      var done = at >= units.length - 1;
      units.forEach(function (u, n) {
        var later = n > at;
        u.li.classList.toggle("is-later", later);
        u.li.classList.toggle("is-now", n === at && !done);
        if (u.turn) u.turn.classList.toggle("is-later", later);
      });
      if (sum) sum.classList.toggle("is-later", !done);
      hint.hidden = done;
      fig.classList.toggle("is-walking", !done);
      if (done) window.Store.markWalked(termId);
    }

    /* 그림 어디를 탭해도 다음 단계. 흐린 줄을 탭하면 거기까지 한 번에.
       다 밝힌 그림은 그냥 그림이다 — 더 반응하지 않는다. */
    fig.addEventListener("click", function (e) {
      if (e.target.closest(".tmark, .gloss")) return; // 용어 점선은 제 일을 한다
      if (at >= units.length - 1) return;
      var li = e.target.closest("li.is-later");
      if (!li) { at++; paint(); return; }
      for (var n = 0; n < units.length; n++) {
        if (units[n].li === li || units[n].turn === li) { at = n; break; }
      }
      paint();
    });

    paint();
  }

  /* ---------------------------------------------------------- 붙이기 */

  function enhance(root, term) {
    open = null; // 화면이 새로 그려졌으니 앞 화면의 카드는 이미 사라졌다
    applyGloss(root, term);
    setupWalk(root, term.id);
  }

  /* 점선은 화면을 다시 그릴 때마다 새로 그어지므로 위임으로 받는다.
     단추마다 리스너를 달면 다시 그릴 때 전부 사라진다. */
  document.addEventListener("click", function (e) {
    var mark = e.target.closest(".tmark");
    if (!mark) return;
    var root = mark.closest(".detail");
    if (root) toggleGloss(mark, root);
  });

  return { enhance: enhance };
})();
