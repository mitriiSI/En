/* Помощник «Митя» — без ИИ. При первом открытии сам читает все конспекты, карточки и тесты сайта,
   строит поисковый индекс (BM25 + простой русский стеммер) и отвечает выдержками со ссылкой на раздел.
   Плюс знает, как пользоваться сайтом, умеет называть даты лекций и устраивать мини-проверку. */
(function () {
  'use strict';

  /* ---------- текст ---------- */
  var STOP = ('и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее мне было вот от меня еще нет о из ему теперь когда даже ну вдруг ли если уже или ни быть был него до вас нибудь опять уж вам ведь там потом себя ничего ей может они тут где есть надо ней для мы тебя их чем была сам чтоб без будто чего раз тоже себе под будет ж тогда кто этот того потому этого какой совсем ним здесь этом один почти мой тем чтобы нее сейчас были куда зачем всех никогда можно при наконец два об другой хоть после над больше тот через эти нас про всего них какая много разве три эту моя впрочем хорошо свою этой перед иногда лучше чуть том нельзя такой им более всегда конечно всю между это такое такая такие это значит означает называется называют расскажи объясни скажи пожалуйста подскажи напомни какие каков какова каковы который которая которые чём кратко коротко нужно хочу знать мне про о об лекции лекция лекцию конспект конспекте').split(' ');
  var STOPS = {}; STOP.forEach(function (w) { STOPS[w] = 1; });
  var SUF = ['иями', 'ями', 'ами', 'иях', 'ией', 'ого', 'его', 'ому', 'ему', 'ыми', 'ими', 'ость', 'ости', 'ание', 'ения', 'ение', 'аний', 'ений', 'ия', 'ие', 'ий', 'ый', 'ой', 'ая', 'яя', 'ое', 'ее', 'ые', 'ов', 'ев', 'ей', 'ам', 'ям', 'ах', 'ях', 'ом', 'ем', 'ую', 'юю', 'ть', 'ти', 'ет', 'ит', 'ут', 'ют', 'ат', 'ят', 'ла', 'ли', 'ло', 'ны', 'а', 'я', 'о', 'е', 'ы', 'и', 'у', 'ю', 'ь', 'й'];
  function norm(t) { return String(t || '').toLowerCase().replace(/ё/g, 'е'); }
  function stem(w) {
    if (w.length <= 3 || /\d/.test(w)) return w;
    for (var i = 0; i < SUF.length; i++) {
      var s = SUF[i];
      if (w.length - s.length >= 3 && w.slice(-s.length) === s) { w = w.slice(0, -s.length); break; }
    }
    return w.slice(0, 7);
  }
  function words(t) { return norm(t).match(/[a-zа-я0-9]+/g) || []; }
  function terms(t) { return words(t).filter(function (w) { return !STOPS[w] && w.length > 1; }).map(stem); }
  function plain(md) {
    return String(md || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]+/g, '')
      .replace(/^\s{0,3}(#{1,6}|>|[-+*]|\d+[.)])\s+/gm, '')
      .replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function fmtDate(d) { return d ? d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4) : ''; }

  /* ---------- база знаний ---------- */
  var DB = null, loading = null;
  var SUBJ_KEYS = { ekonomika: ['эконом'], filosofiya: ['философ'], politucheniya: ['политич', 'учений', 'полит'], 'istoriya-rossii': ['истори росси', 'истори', 'росси'], pravovedenie: ['правовед', 'право'], upravlenie: ['управлен', 'менеджм'] };

  function load() {
    if (loading) return loading;
    loading = fetch('data/sections.json').then(function (r) { return r.json(); }).then(function (base) {
      var docs = [], chunks = [], items = [], testsBySrc = {};
      base.sections.forEach(function (s) {
        s.items.forEach(function (i) {
          var it = { sid: s.id, subj: s.title, id: i.id, type: i.type, title: i.title, date: i.date || null, src: i.src, topic: i.topic };
          items.push(it);
          if (i.type === 'markdown' && i.src) docs.push(it);
          if (i.type === 'cards' && i.cards) i.cards.forEach(function (c) {
            chunks.push({ k: 'card', it: it, head: 'Карточка', q: c.q, text: c.a, all: c.q + ' ' + c.q + ' ' + c.a });
          });
          if (i.type === 'test' && i.src) (testsBySrc[i.src] = testsBySrc[i.src] || []).push(it);
        });
      });
      var jobs = docs.map(function (it) {
        return fetch(it.src).then(function (r) { return r.ok ? r.text() : ''; }).then(function (md) { addDoc(it, md, chunks); }).catch(function () {});
      });
      Object.keys(testsBySrc).forEach(function (src) {
        jobs.push(fetch(src).then(function (r) { return r.json(); }).then(function (t) { addTests(testsBySrc[src], t, chunks); }).catch(function () {}));
      });
      return Promise.all(jobs).then(function () { DB = build(chunks, items, base.sections); return DB; });
    });
    return loading;
  }
  function addDoc(it, md, out) {
    var lines = md.replace(/\r/g, '').split('\n'), h2 = '', h3 = '', buf = [], inHtml = 0;
    function flush() {
      var raw = buf.join('\n').trim(); buf = [];
      if (!raw) return;
      var txt = plain(raw); if (txt.length < 25) return;
      var head = h3 || h2;
      out.push({ k: 'doc', it: it, head: head, h2: h2, text: txt, all: txt + ' ' + head + ' ' + head });
    }
    lines.forEach(function (ln) {
      var m = /^(#{1,3})\s+(.*)$/.exec(ln);
      if (/^\s*<(div|figure|section|details|script|style|iframe|canvas|svg)\b/i.test(ln)) inHtml++;
      if (inHtml) { if (/<\/(div|figure|section|details|script|style|iframe|canvas|svg)>\s*$/i.test(ln)) inHtml = Math.max(0, inHtml - 1); if (/\/>\s*$/.test(ln)) inHtml = Math.max(0, inHtml - 1); return; }
      if (m) {
        flush();
        var t = plain(m[2]);
        if (m[1].length === 1) { h2 = ''; h3 = ''; } else if (m[1].length === 2) { h2 = t; h3 = ''; } else h3 = t;
        if (m[1].length > 1) out.push({ k: 'head', it: it, head: t, h2: h2, text: '', all: t + ' ' + t + ' ' + t });
        return;
      }
      if (!ln.trim()) { flush(); return; }
      buf.push(ln);
    });
    flush();
  }
  function addTests(testItems, t, out) {
    (t.questions || []).forEach(function (q) {
      var it = testItems.filter(function (x) { return x.topic === q.t; })[0] || testItems[0];
      var right = q.o && q.o[q.a], why = q.w && q.w[q.a];
      out.push({ k: 'test', it: it, head: 'Тест', q: plain(q.q), raw: q, text: plain(right) + (why ? '. ' + plain(why) : ''), all: plain(q.q) + ' ' + plain(right) + ' ' + plain(why || '') });
    });
  }
  function build(chunks, items, sections) {
    var df = {}, N = chunks.length, total = 0;
    chunks.forEach(function (c) {
      var ts = terms(c.all), tf = {};
      ts.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
      c.tf = tf; c.len = ts.length || 1; total += c.len;
      Object.keys(tf).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
      c.headT = {}; terms(c.head + ' ' + (c.q || '')).forEach(function (t) { c.headT[t] = 1; });
    });
    return { chunks: chunks, df: df, N: N, avg: total / Math.max(1, N), items: items, sections: sections };
  }

  /* ---------- поиск ---------- */
  function subjOf(q) {
    var n = norm(q), hit = null;
    Object.keys(SUBJ_KEYS).forEach(function (sid) {
      if (hit) return;
      if (sid === 'istoriya-rossii' && /истори[а-я]*\s+росси/.test(n)) hit = sid;
    });
    if (hit) return hit;
    if (/полит[а-я]*\s+учен/.test(n)) return 'politucheniya';
    Object.keys(SUBJ_KEYS).forEach(function (sid) {
      if (hit || sid === 'istoriya-rossii' || sid === 'politucheniya') return;
      if (SUBJ_KEYS[sid].some(function (k) { return n.indexOf(k) >= 0; })) hit = sid;
    });
    return hit;
  }
  function search(q, opt) {
    opt = opt || {};
    var qt = terms(q), out = [];
    if (!qt.length) return out;
    var sid = opt.sid, def = /что так|что значит|что означает|определени|кто так|кто был|что есть|^что\b/.test(norm(q));
    var k1 = 1.4, b = 0.7;
    DB.chunks.forEach(function (c) {
      if (sid && c.it.sid !== sid) return;
      if (opt.kind && c.k !== opt.kind) return;
      var sc = 0, hit = 0;
      qt.forEach(function (t) {
        var f = c.tf[t]; if (!f) return;
        hit++;
        var idf = Math.log(1 + (DB.N - DB.df[t] + 0.5) / (DB.df[t] + 0.5));
        sc += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * c.len / DB.avg));
        if (c.headT[t]) sc += idf * 0.6;
      });
      if (!hit) return;
      sc *= 0.5 + 0.5 * (hit / qt.length);                       /* все ли слова вопроса нашлись */
      if (c.k === 'card') { var allQ = qt.every(function (t) { return c.headT[t]; }); sc *= allQ ? 1.1 : 0.7; }
      if (c.k === 'head') sc *= 0.55;
      if (c.k === 'test') sc *= 0.85;
      if (def && c.k === 'head' && /что так|что это|определ|поняти|кто так/.test(norm(c.head)) && qt.some(function (t) { return c.headT[t]; })) sc *= 4;
      if (def && c.k === 'doc') {
        /* определение: термин стоит в самом начале и дальше «—», «это», «называется» */
        var lead = norm(c.text.slice(0, 120)), lt = terms(lead.slice(0, 70));
        var allIn = qt.every(function (t) { return lt.indexOf(t) >= 0; });
        var first = terms(lead.slice(0, 30));
        if (allIn && /( — | - |это |называ|понима|означа)/.test(lead)) sc *= 2.2;
        else if (first.indexOf(qt[0]) >= 0 && / — /.test(lead.slice(0, 60))) sc *= 1.8;
        else if (allIn) sc *= 1.3;
      }
      c._ratio = hit / qt.length;
      out.push({ c: c, s: sc, hit: hit });
    });
    out.sort(function (a, b2) { return b2.s - a.s; });
    return out;
  }
  function snippet(text, q, max) {
    max = max || 380;
    var qt = terms(q), sents = text.split(/(?<=[.!?…])\s+/), best = 0, bi = 0;
    sents.forEach(function (s, i) {
      var st = terms(s), sc = 0; qt.forEach(function (t) { if (st.indexOf(t) >= 0) sc++; });
      if (sc > best) { best = sc; bi = i; }
    });
    var out = '', i = bi;
    while (i < sents.length && (out + sents[i]).length < max) out += (out ? ' ' : '') + sents[i++];
    if (!out) out = sents[bi].slice(0, max) + '…';
    else if (i < sents.length) out += ' …';
    if (bi > 0) out = '… ' + out;
    return mark(esc(out), qt);
  }
  function mark(html, qt) {
    return html.replace(/[a-zA-Zа-яА-ЯёЁ0-9]+/g, function (w) { return qt.indexOf(stem(norm(w))) >= 0 && w.length > 2 ? '<mark>' + w + '</mark>' : w; });
  }

  /* ---------- намерения про сам сайт ---------- */
  var HOW = [
    [/загруз|добав[а-я]* (файл|материал|конспект)|импорт/, 'Открой предмет и нажми <b>⇪</b> в шапке — можно выбрать .docx, .md, .txt, .html или .pdf. Кнопка <b>＋</b> рядом создаёт материал вручную. Загруженное хранится в этом браузере.'],
    [/порядок|перестав|передвин|сортир/, 'В списке материалов нажми <b>⇅</b> в шапке, двигай стрелками ▲▼, потом <b>✓</b>. Лекции из репозитория и так стоят по датам — от старой к новой.'],
    [/оглавлен|содержани|раздел[а-я]* (найти|перейти)|перейти к/, 'В начале каждого конспекта есть <b>Оглавление</b> — нажми на пункт, и страница перенесёт к нему. Когда оглавление уехало вверх, справа внизу появляется кнопка <b>☰</b>.'],
    [/карточк/, 'В карточках: нажми на карточку или <b>⟲</b>, чтобы перевернуть. <b>✓</b> — знаю, <b>✕</b> — повторить позже, <b>‹ ›</b> — листать, <b>🔀</b> — перемешать, <b>⏮</b> — сначала. На компьютере работают стрелки и пробел.'],
    [/(как|где).*тест|тест.*(как|где|работ)|решать|разбор/, 'В каждом предмете есть блок <b>Тесты</b>: отдельный тест на каждую лекцию и итоговый. После ответа сразу видно, почему он верный или нет, а в конце — разбор ошибок. Ещё могу погонять тебя здесь — напиши «проверь меня».'],
    [/3d|3д|модел|крутить|вращ/, '3D-модели можно крутить пальцем, приближать двумя пальцами и нажимать на детали — появится пояснение. Подсказка что нажимать — в углу сцены.'],
    [/офлайн|без интернет|установ|на экран|домой|ярлык|приложени/, 'Сайт работает как приложение: в Safari нажми «Поделиться» → «На экран „Домой“». Открытые материалы потом доступны и без интернета.'],
    [/поиск|найти материал/, 'На главном экране есть поиск по названиям, а я ищу внутри текста: спроси «что такое эластичность» или «кто такой Марсилий».']
  ];
  function intent(q) {
    var n = norm(q).trim();
    if (/^(привет|здравств|хай|hi|hello|добр(ый|ое|ой))/.test(n) && n.length < 25) return { html: 'Привет! Я знаю всё, что есть на сайте. Спроси термин, дату лекции или попроси проверить тебя.', chips: true };
    if (/^(спасибо|спс|благодар|круто|супер|ок|понял)/.test(n)) return { html: 'Обращайся 🙂' };
    if (/что (ты )?умеешь|помощ|help|кто ты/.test(n)) return { html: 'Я не нейросеть — я прочитал все конспекты, карточки и тесты сайта и ищу ответы в них.<br>• «что такое предельные издержки»<br>• «когда была лекция про Ницше»<br>• «последняя лекция по истории России»<br>• «какие предметы есть»<br>• «проверь меня по экономике»<br>• «как работают карточки»', chips: true };
    if (/провер|погоняй|экзамен|спроси меня|дай вопрос|тренир|квиз/.test(n)) return { quiz: subjOf(q) };
    if (/какие предмет|список предмет|что есть на сайте|какие курс/.test(n)) return { subjects: true };
    var sid = subjOf(q);
    if (/последн|свеж|нов(ая|ую|ой) лекц|недавн/.test(n) && /лекц|конспект|тем/.test(n + ' лекц')) return { latest: sid };
    if (/сколько/.test(n) && /лекц|конспект|материал|тест|карточ/.test(n)) return { count: sid, what: /тест/.test(n) ? 'test' : /карточ/.test(n) ? 'cards' : 'markdown' };
    if (/когда|какого числа|дата|в какой день/.test(n)) return { when: true };
    if (/(список|все|покажи|какие) (лекци|конспект|тем)/.test(n)) return { list: sid };
    for (var i = 0; i < HOW.length; i++) if (HOW[i][0].test(n) && /как|где|можно|не (могу|получ)|зачем|работ|помоги|что делать|кнопк/.test(n)) return { html: HOW[i][1] };
    return null;
  }
  function itemLink(it, head) {
    var ic = { markdown: '📝 ', cards: '🃏 ', test: '✅ ' }[it.type] || '';
    return '<button class="hp-go" data-sid="' + esc(it.sid) + '" data-iid="' + esc(it.id) + '"' + (head ? ' data-head="' + esc(head) + '"' : '') + '>' + ic + esc(cleanTitle(it.title)) + (head ? ' · ' + esc(head) : '') + ' →</button>';
  }
  function cleanTitle(t) { return String(t).replace(/^Тест:\s*/, '').replace(/\s*\(\d{1,2}\.\d{1,2}(\.\d{2,4})?\)\s*$/, ''); }
  function lectures(sid) {
    return DB.items.filter(function (i) { return i.type === 'markdown' && (!sid || i.sid === sid); });
  }
  function subjName(sid) { var s = DB.sections.filter(function (x) { return x.id === sid; })[0]; return s ? s.title : ''; }

  /* ---------- ответ ---------- */
  function answer(q) {
    var it = intent(q);
    if (it && it.html) return it;
    if (it && it.subjects) {
      return { html: 'Предметы на сайте:<div class="hp-links">' + DB.sections.filter(function (s) { return s.items.length; }).map(function (s) {
        var n = s.items.filter(function (i) { return i.type === 'markdown'; }).length;
        return '<button class="hp-go" data-sec="' + esc(s.id) + '">' + esc((s.icon || '') + ' ' + s.title) + (n ? ' · ' + n + ' конспект' + (n === 1 ? '' : n < 5 ? 'а' : 'ов') : '') + ' →</button>';
      }).join('') + '</div>' };
    }
    if (it && 'latest' in it) {
      var ls = lectures(it.latest).filter(function (i) { return i.date; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!ls.length) return { html: 'Не нашёл датированных лекций' + (it.latest ? ' по предмету «' + esc(subjName(it.latest)) + '»' : '') + '.' };
      var top = it.latest ? ls.slice(0, 1) : ls.slice(0, 3);
      return { html: (it.latest ? 'Последняя лекция по предмету «' + esc(subjName(it.latest)) + '»:' : 'Последние лекции:') + '<div class="hp-links">' + top.map(function (i) { return '<span class="hp-d">' + fmtDate(i.date) + (it.latest ? '' : ' · ' + esc(i.subj)) + '</span>' + itemLink(i); }).join('') + '</div>' };
    }
    if (it && it.count) {
      var kinds = { markdown: 'конспектов', test: 'тестов', cards: 'наборов карточек' };
      var arr = DB.items.filter(function (i) { return i.type === it.what && (!it.count || i.sid === it.count); });
      return { html: (it.count ? '«' + esc(subjName(it.count)) + '»: ' : 'Всего на сайте: ') + '<b>' + arr.length + '</b> ' + kinds[it.what] + '.' };
    }
    if (it && 'list' in it) {
      var L = lectures(it.list).slice().sort(function (a, b) { return (a.date || '0') < (b.date || '0') ? -1 : 1; });
      return { html: (it.list ? '«' + esc(subjName(it.list)) + '»' : 'Все конспекты') + ', от старых к новым:<div class="hp-links">' + L.map(function (i) { return (i.date ? '<span class="hp-d">' + fmtDate(i.date) + '</span>' : '') + itemLink(i); }).join('') + '</div>' };
    }
    if (it && it.when) {
      var cands = lectures(subjOf(q)), qt = terms(q.replace(/когда|какого числа|дата|в какой день|была|был|прошла|лекци[а-я]*/gi, ' ')), best = null, bs = 0;
      if (qt.length) {
        cands.forEach(function (i) {
          var tt = terms(i.title), sc = 0; qt.forEach(function (t) { if (tt.indexOf(t) >= 0) sc++; });
          if (sc > bs) { bs = sc; best = i; }
        });
        if (!best) {                                              /* тема может быть внутри лекции */
          var r = search(q, { kind: 'doc' })[0] || search(q)[0];
          if (r && r.c.it.type === 'markdown') best = r.c.it;
        }
      }
      if (best) return { html: best.date ? '«' + esc(cleanTitle(best.title)) + '» — лекция <b>' + fmtDate(best.date) + '</b> (' + esc(best.subj) + ').' + '<div class="hp-links">' + itemLink(best) + '</div>' : 'У «' + esc(cleanTitle(best.title)) + '» дата не указана.<div class="hp-links">' + itemLink(best) + '</div>' };
    }
    if (it && 'quiz' in it) return { quiz: it.quiz };

    var res = search(q, { sid: subjOf(q) && !/^(что|кто)/.test(norm(q)) ? subjOf(q) : null });
    if (!res.length || res[0].s < 1.2 || (res[0].hit / Math.max(1, terms(q).length) < 0.5 && terms(q).length > 1)) {
      var rel = res.length ? res : [];
      return { html: 'Не нашёл этого в материалах сайта. Попробуй другими словами — например, ключевым термином.' + (rel.length ? '<div class="hp-more">Может быть:</div><div class="hp-links">' + uniq(rel).slice(0, 3).map(function (r) { return itemLink(r.c.it, r.c.k === 'doc' || r.c.k === 'head' ? r.c.head : ''); }).join('') + '</div>' : ''), chips: true };
    }
    var best = res[0].c, html = '';
    if (best.k === 'card') {
      html = '<div class="hp-src">🃏 ' + esc(best.it.subj) + ' · карточка</div><div class="hp-q">' + esc(best.q) + '</div><div class="hp-a">' + mark(esc(best.text), terms(q)) + '</div>';
      var docR = res.filter(function (r) { return r.c.k === 'doc' && r.c.it.sid === best.it.sid; })[0];
      if (docR) html += '<div class="hp-a hp-a2">' + snippet(docR.c.text, q, 260) + '</div>';
      html += '<div class="hp-links">' + (docR ? itemLink(docR.c.it, docR.c.head) : '') + itemLink(best.it) + '</div>';
    } else if (best.k === 'test') {
      html = '<div class="hp-src">✅ ' + esc(best.it.subj) + ' · из теста</div><div class="hp-q">' + esc(best.q) + '</div><div class="hp-a">' + mark(esc(best.text), terms(q)) + '</div><div class="hp-links">' + itemLink(best.it) + '</div>';
    } else {
      var txt = best.text, sec = DB.chunks.filter(function (c) { return c.k === 'doc' && c.it === best.it && c.head === best.head; });
      if (best.k === 'head') {                                     /* совпал заголовок — берём лучший абзац этого раздела */
        var inSec = res.filter(function (r) { return r.c.k === 'doc' && r.c.it === best.it && r.c.head === best.head; })[0];
        txt = inSec ? inSec.c.text : sec[0] ? sec[0].text : '';
      }
      if (/что так|что значит|что означает|определени|кто так|^что\b/.test(norm(q))) {
        var defC = sec.filter(function (c) { var l = norm(c.text.slice(0, 80)); var pre = l.split(' — ')[0]; return / — /.test(l) && words(pre).length <= 5 && terms(pre).some(function (t) { return terms(q).indexOf(t) >= 0; }); })[0];
        if (defC) txt = defC.text;
      }
      var simple = sec.filter(function (c) { return /^💡?\s*Проще говоря/.test(c.text) && c.text !== txt; })[0];
      html = '<div class="hp-src">📝 ' + esc(best.it.subj) + (best.it.date ? ' · ' + fmtDate(best.it.date) : '') + '</div><div class="hp-q">' + esc(best.head || cleanTitle(best.it.title)) + '</div>' +
        (txt ? '<div class="hp-a">' + snippet(txt, q) + '</div>' : '') +
        (simple ? '<div class="hp-a hp-a2">' + esc(simple.text.length > 320 ? simple.text.slice(0, 320) + '…' : simple.text) + '</div>' : '') +
        '<div class="hp-links">' + itemLink(best.it, best.head) + '</div>';
    }
    var more = uniq(res.slice(1)).filter(function (r) { return !(r.c.it === best.it && r.c.head === best.head); }).slice(0, 2);
    if (more.length && res[1] && res[1].s > res[0].s * 0.45) html += '<div class="hp-more">Ещё по теме:</div><div class="hp-links">' + more.map(function (r) { return itemLink(r.c.it, r.c.k === 'doc' || r.c.k === 'head' ? r.c.head : ''); }).join('') + '</div>';
    return { html: html };
  }
  function uniq(rs) {
    var seen = {};
    return rs.filter(function (r) { var k = r.c.it.sid + r.c.it.id + (r.c.k === 'doc' || r.c.k === 'head' ? r.c.head : r.c.k); if (seen[k]) return false; seen[k] = 1; return true; });
  }

  /* ---------- мини-проверка ---------- */
  var quizN = 0, QUIZ = {};
  function quizHtml(sid) {
    var pool = DB.chunks.filter(function (c) { return c.k === 'test' && (!sid || c.it.sid === sid) && c.raw.o && c.raw.o.length > 1; });
    if (!pool.length) return 'Тестов по этому предмету пока нет.';
    var c = pool[Math.floor(Math.random() * pool.length)], q = c.raw, id = 'hq' + (++quizN);
    QUIZ[id] = c;
    return '<div class="hp-src">✅ ' + esc(c.it.subj) + ' · ' + esc(cleanTitle(c.it.title)) + '</div><div class="hp-q">' + q.q + '</div><div class="hp-opts" id="' + id + '" data-sid="' + esc(sid || '') + '">' +
      q.o.map(function (o, i) { return '<button class="hp-o" data-i="' + i + '">' + esc(plain(o)) + '</button>'; }).join('') + '</div>';
  }
  function wireQuiz(box) {
    var opts = box.querySelector('.hp-opts'); if (!opts) return;
    var src = QUIZ[opts.id];
    if (!src) return;
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('.hp-o'); if (!b || opts.dataset.done) return;
      opts.dataset.done = 1;
      var i = +b.dataset.i, q = src.raw, ok = i === q.a;
      Array.prototype.forEach.call(opts.children, function (x, k) { x.classList.add(k === q.a ? 'ok' : k === i ? 'bad' : 'dim'); });
      var why = '<div class="hp-why' + (ok ? '' : ' bad') + '">' + (ok ? '✓ Верно. ' : '✕ Неверно. ') + (q.w && q.w[i] ? esc(plain(q.w[i]).replace(/^(не)?верно[.:!—–-]*\s*/i, '')) : '') +
        (!ok && q.w && q.w[q.a] ? '<br><b>Правильно:</b> ' + esc(plain(q.o[q.a])) + ' — ' + esc(plain(q.w[q.a]).replace(/^(не)?верно[.:!—–-]*\s*/i, '')) : '') +
        '</div><div class="hp-links"><button class="hp-next" data-sid="' + esc(opts.dataset.sid) + '">Ещё вопрос →</button>' + itemLink(src.it) + '</div>';
      opts.insertAdjacentHTML('afterend', why);
      scrollDown();
    });
  }

  /* ---------- интерфейс ---------- */
  var css = '' +
    '#hp-fab{position:fixed;z-index:26;right:16px;bottom:calc(20px + var(--bot,0px));width:54px;height:54px;border-radius:18px;border:1px solid rgba(255,190,120,.6);color:#fff;font-size:24px;cursor:pointer;background:linear-gradient(145deg,#ff8a1f,#e2560a);box-shadow:inset 0 1px 0 rgba(255,255,255,.45),0 12px 30px -8px rgba(255,138,31,.9);transition:transform .5s cubic-bezier(.3,1.6,.45,1)}' +
    '#hp-fab:active{transform:scale(.92)}body.fs #hp-fab,body:has(.pagewrap) #hp-fab{display:none}' +
    '.toc-fab{bottom:calc(148px + var(--bot,0px))!important}' +
    '#hp{position:fixed;z-index:45;right:12px;bottom:calc(12px + var(--bot,0px));width:min(420px,calc(100vw - 24px));height:min(640px,calc(100dvh - var(--top,0px) - 24px));display:flex;flex-direction:column;border-radius:26px;overflow:hidden;opacity:0;transform:translateY(30px) scale(.94);transform-origin:100% 100%;pointer-events:none;transition:opacity .25s,transform .5s cubic-bezier(.3,1.5,.45,1);background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.02) 40%),rgba(10,22,56,.86);-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(150,200,255,.3);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 30px 60px -20px rgba(0,0,0,.85)}' +
    '#hp.on{opacity:1;transform:none;pointer-events:auto}' +
    '.hp-top{display:flex;align-items:center;gap:10px;padding:12px 12px 10px 16px;border-bottom:1px solid rgba(150,200,255,.15)}' +
    '.hp-top b{flex:1;font-size:16px}.hp-top b::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#3ddc97;box-shadow:0 0 10px #3ddc97;margin-right:9px;vertical-align:1px}' +
    '.hp-x{width:36px;height:36px;border-radius:12px;border:1px solid rgba(150,200,255,.3);background:rgba(255,255,255,.06);color:#eef3ff;font-size:16px;cursor:pointer}' +
    '.hp-log{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch}' +
    '.hp-m{max-width:92%;padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.5;animation:hpIn .45s cubic-bezier(.2,.8,.2,1)}' +
    '@keyframes hpIn{from{opacity:0;transform:translateY(10px)}}' +
    '.hp-m.me{align-self:flex-end;background:linear-gradient(135deg,#2f8cff,#1a5fe0);color:#fff;border-bottom-right-radius:6px}' +
    '.hp-m.bot{align-self:flex-start;background:rgba(19,33,74,.85);border:1px solid rgba(150,200,255,.18);border-bottom-left-radius:6px}' +
    '.hp-src{font-size:12px;font-weight:700;color:#ffa13d;margin-bottom:3px}.hp-q{font-weight:650;margin-bottom:4px}.hp-a2{margin-top:6px;color:#b9c6e6;font-size:14px}' +
    '.hp-m mark{background:rgba(255,138,31,.28);color:#fff;border-radius:4px;padding:0 2px}' +
    '.hp-links{display:flex;flex-direction:column;gap:6px;margin-top:8px}.hp-more{margin-top:10px;font-size:12px;color:#93a3cc;font-weight:650}.hp-d{font-size:12px;color:#ffa13d;font-weight:700;margin:4px 0 -2px}' +
    '.hp-go,.hp-next,.hp-chip{text-align:left;font:inherit;font-size:14px;color:#cfe7ff;background:rgba(47,140,255,.14);border:1px solid rgba(92,200,255,.35);border-radius:12px;padding:7px 10px;cursor:pointer;transition:background .2s,transform .4s cubic-bezier(.3,1.6,.45,1)}' +
    '.hp-go:hover,.hp-next:hover,.hp-chip:hover{background:rgba(47,140,255,.28)}.hp-go:active,.hp-o:active,.hp-chip:active{transform:scale(.96)}' +
    '.hp-next{background:rgba(255,138,31,.18);border-color:rgba(255,170,90,.45);color:#fff}' +
    '.hp-opts{display:flex;flex-direction:column;gap:6px;margin-top:8px}.hp-o{text-align:left;font:inherit;font-size:14px;color:#eef3ff;background:rgba(255,255,255,.05);border:1.5px solid rgba(150,200,255,.25);border-radius:12px;padding:8px 10px;cursor:pointer}' +
    '.hp-o.ok{border-color:#3ddc97;background:rgba(61,220,151,.18)}.hp-o.bad{border-color:#ff5a64;background:rgba(255,90,100,.16)}.hp-o.dim{opacity:.5}' +
    '.hp-why{margin-top:8px;padding:8px 10px;border-radius:12px;border-left:3px solid #3ddc97;background:rgba(61,220,151,.1);font-size:14px}.hp-why.bad{border-left-color:#ff5a64;background:rgba(255,90,100,.08)}' +
    '.hp-chips{display:flex;gap:6px;overflow-x:auto;padding:0 12px 8px;scrollbar-width:none}.hp-chips::-webkit-scrollbar{display:none}.hp-chip{flex:none;white-space:nowrap;border-radius:999px}' +
    '.hp-in{display:flex;gap:8px;padding:10px 12px calc(12px + var(--bot,0px));border-top:1px solid rgba(150,200,255,.15)}' +
    '.hp-in input{flex:1;min-width:0;font:inherit;font-size:16px;color:#eef3ff;background:rgba(5,11,30,.6);border:1px solid rgba(150,200,255,.25);border-radius:14px;padding:10px 12px;outline:none}' +
    '.hp-in input:focus{border-color:#2f8cff;box-shadow:0 0 0 3px rgba(47,140,255,.2)}' +
    '.hp-in button{width:46px;border-radius:14px;border:1px solid rgba(160,210,255,.6);background:linear-gradient(145deg,#2f8cff,#1a5fe0);color:#fff;font-size:18px;cursor:pointer}' +
    '.hp-dots span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#93a3cc;animation:hpDot 1s infinite}.hp-dots span:nth-child(2){animation-delay:.15s}.hp-dots span:nth-child(3){animation-delay:.3s}@keyframes hpDot{50%{opacity:.2;transform:translateY(-3px)}}' +
    '@media (max-width:520px){#hp{right:8px;left:8px;width:auto;bottom:calc(8px + var(--bot,0px));height:min(78dvh,640px)}}';

  var CHIPS = ['Что ты умеешь?', 'Последние лекции', 'Проверь меня', 'Какие предметы есть?', 'Как работают карточки?'];
  var panel, log, input, opened = false;

  function ui() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var fab = document.createElement('button'); fab.id = 'hp-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Помощник'); fab.textContent = '💬';
    panel = document.createElement('div'); panel.id = 'hp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Помощник');
    panel.innerHTML = '<div class="hp-top"><b>Помощник</b><button class="hp-x" type="button" aria-label="Закрыть">✕</button></div>' +
      '<div class="hp-log"></div><div class="hp-chips">' + CHIPS.map(function (c) { return '<button class="hp-chip" type="button">' + c + '</button>'; }).join('') + '</div>' +
      '<form class="hp-in"><input type="text" placeholder="Спроси…" enterkeyhint="send" autocomplete="off"><button type="submit" aria-label="Отправить">↑</button></form>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    log = panel.querySelector('.hp-log'); input = panel.querySelector('input');
    fab.onclick = function () { toggle(true); };
    panel.querySelector('.hp-x').onclick = function () { toggle(false); };
    panel.querySelector('form').onsubmit = function (e) { e.preventDefault(); ask(input.value); };
    panel.querySelector('.hp-chips').onclick = function (e) { var c = e.target.closest('.hp-chip'); if (c) ask(c.textContent); };
    log.addEventListener('click', function (e) {
      var g = e.target.closest('.hp-go');
      if (g) {
        if (g.dataset.sec) location.hash = '#/s/' + g.dataset.sec;
        else if (window.HubGoto) window.HubGoto(g.dataset.sid, g.dataset.iid, g.dataset.head || '');
        else location.hash = '#/s/' + g.dataset.sid + '/' + g.dataset.iid;
        if (window.innerWidth < 700) toggle(false);
        return;
      }
      var n = e.target.closest('.hp-next');
      if (n) { var box = bot(quizHtml(n.dataset.sid || null)); wireQuiz(box); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) toggle(false); });
  }
  function toggle(on) {
    opened = on; panel.classList.toggle('on', on);
    if (on) {
      if (!log.children.length) bot('Привет! Я помощник сайта: знаю все конспекты, карточки и тесты. Спрашивай.');
      load();
      if (window.matchMedia('(pointer:fine)').matches) setTimeout(function () { input.focus(); }, 300);
    }
  }
  function scrollDown() { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); }
  function bot(html) { var d = document.createElement('div'); d.className = 'hp-m bot'; d.innerHTML = html; log.appendChild(d); scrollDown(); return d; }
  function me(text) { var d = document.createElement('div'); d.className = 'hp-m me'; d.textContent = text; log.appendChild(d); scrollDown(); }
  function ask(q) {
    q = String(q || '').trim(); if (!q) return;
    input.value = ''; me(q);
    var wait = bot('<span class="hp-dots"><span></span><span></span><span></span></span>');
    var t0 = Date.now();
    load().then(function () {
      setTimeout(function () {
        var r;
        try {
          if (/^последние лекции$/i.test(q)) r = answer('последняя лекция');
          else r = answer(q);
        } catch (e) { r = { html: 'Что-то пошло не так. Спроси по-другому.' }; }
        if (r.quiz !== undefined) { wait.innerHTML = quizHtml(r.quiz); wireQuiz(wait); }
        else wait.innerHTML = r.html;
        scrollDown();
      }, Math.max(0, 350 - (Date.now() - t0)));
    }).catch(function () { wait.innerHTML = 'Не удалось прочитать материалы. Проверь интернет и попробуй ещё раз.'; loading = null; });
  }

  window.HubHelper = { ask: function (q) { return load().then(function () { return answer(q); }); }, search: function (q, n) { return load().then(function () { return search(q).slice(0, n || 5); }); },
    db: function () { return load(); }, howto: function () { return HOW.map(function (h) { return h[1].replace(/<[^>]+>/g, ''); }); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();
