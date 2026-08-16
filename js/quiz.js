/* ============================================================
   퀴즈 생성
   목표는 암기 확인이 아니라 이해 확인이다.
   그래서 문제를 세 종류로 섞는다.

     1) 설명 -> 용어   : 뜻을 읽고 이름을 떠올릴 수 있는가
     2) 용어 -> 설명   : 이름을 보고 뜻을 고를 수 있는가 (오답이 그럴듯해야 한다)
     3) 관계          : 이 개념과 같이 다니는 개념을 아는가

   오답 선택지는 같은 단어장 안에서 뽑는다. 전혀 다른 분야에서 뽑으면
   내용을 몰라도 소거법으로 맞힐 수 있어서 이해를 확인하지 못한다.
   ============================================================ */

window.Quiz = (function () {
  "use strict";

  var KINDS = {
    MEANING: "설명에서 용어 찾기",
    DEFINE: "용어의 뜻 고르기",
    RELATED: "같이 쓰이는 개념",
  };

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /* 빼는 기준은 id 다. 참조로 비교하면 안 된다 — Store.allTerms() 는 부를 때마다
     Object.assign 으로 새 객체를 만들기 때문에, 정답과 후보 목록을 서로 다른
     호출에서 얻으면 같은 단어인데도 다른 객체가 되어 필터를 통과한다.
     그러면 정답이 오답 자리에 한 번 더 실리고, 보기 둘이 같은 단어가 된다.
     중복 자체가 정답을 알려주는 힌트가 되어 몰라도 찍을 수 있게 된다. */
  function sample(list, n, exclude) {
    var pool = list.filter(function (x) { return !exclude || x.id !== exclude.id; });
    return shuffle(pool).slice(0, n);
  }

  /* 노트의 한 줄 뜻은 거의 항상 "<용어>는 ..." 으로 시작한다.
     이 앞머리를 찾아낸다. 용어명 필드에 기대지 않는 이유는,
     노트마다 제목은 영문인데 본문은 한글 이름으로 쓰는 경우가 있기 때문이다.
     ("# Load Balancer" 인데 본문은 "로드 밸런서는 ...") */
  var LEAD = /^\s*(?:\*\*)?(.{1,40}?)(는|은|이란|란|이라는)(\s|\*)/;

  function stripEmphasis(text) {
    return String(text || "").replace(/^\s*\*\*/, "").replace(/\*\*\s*$/, "");
  }

  /* 선택지는 버튼 한 줄이라 마크다운을 렌더하지 않는다.
     굵게 표시가 하나만 남으면 그것 자체가 정답 힌트가 되기도 한다. */
  function plainText(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* 용어를 "이것" 으로 바꾸면 뒤따르는 조사가 틀어진다.
     "DNS가" -> "이것가" 가 되어버린다. "이것" 은 받침이 있으므로 조사를 맞춰준다. */
  var PARTICLE_FIX = { "가": "이", "는": "은", "를": "을", "와": "과", "로": "으로" };

  function fixParticles(text, after) {
    return text.replace(new RegExp(after + "([가는를와로])", "g"), function (_, p) {
      return after + (PARTICLE_FIX[p] || p);
    });
  }

  function replaceName(text, term, replacement) {
    var out = String(text || "");
    [term.term, term.reading].forEach(function (p) {
      if (!p) return;
      var safe = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp("\\s*\\(" + safe + "[^)]*\\)", "gi"), "");
      out = out.replace(new RegExp(safe, "gi"), replacement);
    });
    return replacement === "이것" ? fixParticles(out, "이것") : out;
  }

  /* 빈칸 뒤 조사를 원문 그대로 두면 정답의 받침이 새어 나간다.
     "____은" 이면 받침 있는 말, "____는" 이면 없는 말로 좁혀진다.
     CDN(씨디엔)만 "은" 을 받는 식이라 실제로 답이 찍힌다.
     시험지에서 쓰는 병기 표기로 눕혀서 단서를 없앤다. */
  var NEUTRAL_PARTICLE = { "는": "은(는)", "은": "은(는)", "이란": "(이)란", "란": "(이)란", "이라는": "(이)라는" };

  /* 설명에서 용어 찾기용. 앞머리를 빈칸으로 바꾼다.
     빈칸 형태가 모든 보기에서 같아야 모양만 보고 답을 고르지 못한다. */
  function blankSubject(text, term) {
    var out = stripEmphasis(text);
    var lead = out.match(LEAD);
    if (lead) {
      out = "____" + (NEUTRAL_PARTICLE[lead[2]] || lead[2]) + out.slice(lead[0].length - lead[3].length);
    }
    out = replaceName(out, term, "____");
    return out.replace(/(____[\s,·]*){2,}/g, "____ ").trim();
  }

  /* 뜻 고르기용. 앞머리를 빈칸으로 두지 않고 통째로 들어낸다.
     보기 네 개가 모두 "____는 ..." 이면 읽기 괴롭고,
     하나만 빈칸이 없으면 그게 곧 정답 표시가 된다. */
  function stripSubject(text, term) {
    var out = stripEmphasis(text);
    var lead = out.match(LEAD);
    if (lead) out = out.slice(lead[0].length).trim();
    out = replaceName(out, term, "이것").replace(/(이것[\s,·]*){2,}/g, "이것 ");
    return out.trim();
  }

  /* 보기 길이를 고르게 맞춘다.
     한 보기만 유난히 길면 그것만 눈에 띄고, 읽는 부담도 커진다.
     문장 경계에서 끊어서 "..." 로 잘리는 일이 없게 한다. */
  function firstSentence(text, maxLen) {
    var s = String(text || "").replace(/\s+/g, " ").trim();
    var limit = maxLen || 110;

    // 문장 끝 위치를 모은다
    var ends = [];
    var re = /(?:다|요)\.\s|[.!?。]\s/g;
    var m;
    while ((m = re.exec(s)) !== null) ends.push(m.index + m[0].trimEnd().length);

    /* 뜻이 통하는 최소 길이(18자)를 넘기는 첫 문장에서 끊는다.

       한도를 넘을 때만 자르면 안 된다. 어떤 뜻풀이는 두 문장이 합쳐서 95자라
       한도(110자) 안에 들어오는데, 그러면 그 보기만 두 문장이 되어 혼자 길어진다.
       내용을 몰라도 길이만 보고 고를 수 있게 되는 지점이 여기다.
       길이와 상관없이 항상 첫 문장에서 끊어야 보기가 고르게 보인다. */
    for (var i = 0; i < ends.length; i++) {
      if (ends[i] >= 18) return s.slice(0, ends[i]).trim();
    }

    if (s.length <= limit) return s;
    // 문장 경계가 없으면 중간에서 자르지 않고 한도까지만 보여준다.
    return ends.length ? s.slice(0, ends[ends.length - 1]).trim() : s.slice(0, limit).trim() + "...";
  }

  function makeMeaningQuestion(target, siblings) {
    var distractors = sample(siblings, 3, target);
    if (distractors.length < 3) return null;

    // sourceId 는 이 보기가 어느 단어에서 왔는지다. 틀렸을 때
    // "고른 게 뭐였는지"를 되짚어 설명하려면 이 연결이 있어야 한다.
    var options = shuffle([target].concat(distractors)).map(function (t) {
      return { id: t.id, sourceId: t.id, text: t.term, correct: t.id === target.id };
    });

    return {
      kind: KINDS.MEANING,
      termId: target.id,
      prompt: "다음 설명에 해당하는 용어는?",
      quote: blankSubject(target.summary, target),
      options: options,
      explain: target.summary,
    };
  }

  /* 길이가 비슷한 오답을 고른다.
     정답만 유난히 길거나 짧으면 내용을 몰라도 그것만 보고 고를 수 있다.
     보기가 고르게 보이는 건 덤이다. */
  function sampleSimilarLength(candidates, target, n) {
    var targetLen = optionText(target).length;
    var ranked = candidates
      .filter(function (t) { return t.id !== target.id; })
      .map(function (t) {
        return { term: t, gap: Math.abs(optionText(t).length - targetLen) };
      })
      .sort(function (a, b) { return a.gap - b.gap; });

    // 가장 가까운 후보들 안에서 무작위로 뽑는다. 매번 같은 오답이 나오면 외워버린다.
    return shuffle(ranked.slice(0, Math.max(n * 2, 6)))
      .slice(0, n)
      .map(function (r) { return r.term; });
  }

  function optionText(term) {
    return plainText(firstSentence(stripSubject(term.summary, term), 110));
  }

  function makeDefineQuestion(target, siblings) {
    var distractors = sampleSimilarLength(siblings, target, 3);
    if (distractors.length < 3) return null;

    var options = shuffle([target].concat(distractors)).map(function (t) {
      return { id: t.id, sourceId: t.id, text: optionText(t), correct: t.id === target.id };
    });

    return {
      kind: KINDS.DEFINE,
      termId: target.id,
      prompt: target.term + "의 설명으로 맞는 것은?",
      quote: null,
      options: options,
      explain: target.summary,
    };
  }

  /* 관계 문제는 노트의 "관련 용어"를 정답으로 쓴다.
     내가 직접 연결해둔 개념이라 정답 근거가 노트 안에 있다. */
  function makeRelatedQuestion(target, siblings) {
    if (!target.related || !target.related.length) return null;

    var linked = {};
    target.related.forEach(function (r) { linked[r.term.toLowerCase()] = true; });

    var answer = target.related[Math.floor(Math.random() * target.related.length)];
    var unrelated = siblings.filter(function (t) {
      return t.id !== target.id && !linked[t.term.toLowerCase()];
    });
    if (unrelated.length < 3) return null;

    // 정답은 노트의 "관련 용어"라서 이 목업에 단어로 없을 수 있다. sourceId 는 null 이 된다.
    var options = shuffle([{ term: answer.term, correct: true, sourceId: null }].concat(
      sample(unrelated, 3).map(function (t) {
        return { term: t.term, correct: false, sourceId: t.id };
      })
    )).map(function (o, i) {
      return { id: target.id + "-rel-" + i, sourceId: o.sourceId, text: o.term, correct: o.correct };
    });

    return {
      kind: KINDS.RELATED,
      termId: target.id,
      /* "X 와(과)" 는 조사를 고르지 못해 병기한 흔적이라 서비스에서 바로 티가 난다.
         영문 약어는 한글 읽기의 받침을 알아야 와/과가 정해지는데 그 정보가 없다.
         조사가 필요 없는 문장으로 바꾼다. */
      prompt: target.term + " 하면 같이 나오는 개념은?",
      quote: null,
      options: options,
      explain: answer.note ? answer.term + ": " + answer.note : target.summary,
    };
  }

  var BUILDERS = [makeMeaningQuestion, makeDefineQuestion, makeRelatedQuestion];

  /* 단어 하나에 대해 만들 수 있는 문제 중 하나를 고른다.
     같은 단어가 항상 같은 형식으로 나오면 문제 유형을 외워버린다. */
  function buildFor(target, siblings) {
    var made = shuffle(BUILDERS)
      .map(function (fn) { return fn(target, siblings); })
      .filter(Boolean);
    return made.length ? made[0] : null;
  }

  /* 출제 범위를 받아서 문제 묶음을 만든다.
     targets 가 부족하면 있는 만큼만 낸다. 억지로 채우지 않는다. */
  function build(targets, pool, limit) {
    var questions = [];
    shuffle(targets).forEach(function (t) {
      if (questions.length >= (limit || 8)) return;
      var siblings = pool.filter(function (x) { return x.bookId === t.bookId; });
      // 같은 단어장에 후보가 모자라면 전체에서 보충한다
      if (siblings.length < 4) siblings = pool;
      var q = buildFor(t, siblings);
      if (q) questions.push(q);
    });
    return questions;
  }

  /* 범위를 고르기 전에 "몇 문제인지" 알려주기 위한 셈.

     build() 를 미리 돌려서 세면 안 된다 — 그 안에서 섞기 때문에 미리 본 개수와
     실제로 나오는 개수가 달라질 수 있다. 화면이 코드가 하지 않는 말을 하게 된다.
     그래서 섞지 않고 "문제를 만들 수 있는 단어"만 센다. */
  function askable(target, pool) {
    var siblings = pool.filter(function (x) { return x.bookId === target.bookId; });
    if (siblings.length < 4) siblings = pool;
    return BUILDERS.some(function (fn) { return !!fn(target, siblings); });
  }

  function countQuestions(targets, pool, limit) {
    var n = 0;
    var cap = limit || 8;
    for (var i = 0; i < targets.length && n < cap; i++) {
      if (askable(targets[i], pool)) n++;
    }
    return n;
  }

  return { build: build, countQuestions: countQuestions, KINDS: KINDS };
})();
