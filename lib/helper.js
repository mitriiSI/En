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
  /* предмет, в котором открыт помощник; «везде» / «весь сайт» снимает ограничение */
  function curSid() {
    var m = /^#\/s\/([^/]+)/.exec(location.hash || '');
    if (!m || !DB) return null;
    return DB.sections.some(function (s) { return s.id === m[1] && s.items.some(function (i) { return i.type === 'markdown' || i.type === 'cards' || i.type === 'test'; }); }) ? m[1] : null;
  }
  function scopeOf(q) {
    if (/везде|весь сайт|всему сайту|все(м|х)? предмет|по всему/.test(norm(q))) return null;
    return subjOf(q) || curSid();
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
    if (/^(привет|здравств|хай|hi|hello|добр(ый|ое|ой))/.test(n) && n.length < 25) return { html: 'Привет! Спрашивай.' };
    if (/^(спасибо|спс|благодар|круто|супер|ок|понял)/.test(n)) return { html: 'Обращайся 🙂' };
    if (/что (ты )?умеешь|помощ|help|кто ты/.test(n)) return { html: 'Я не нейросеть — я прочитал все конспекты, карточки и тесты сайта и ищу ответы в них.<br>• «что такое предельные издержки»<br>• «когда была лекция про Ницше»<br>• «последняя лекция по истории России»<br>• «какие предметы есть»<br>• «проверь меня по экономике»<br>• «как работают карточки»', chips: true };
    if (/провер|погоняй|экзамен|спроси меня|дай вопрос|тренир|квиз/.test(n)) return { quiz: scopeOf(q) };
    if (/какие предмет|список предмет|что есть на сайте|какие курс/.test(n)) return { subjects: true };
    var sid = scopeOf(q);
    if (/последн|свеж|нов(ая|ую|ой) лекц|недавн/.test(n) && /лекц|конспект|тем/.test(n + ' лекц')) return { latest: sid };
    if (/сколько/.test(n) && /лекц|конспект|материал|тест|карточ/.test(n)) return { count: sid, what: /тест/.test(n) ? 'test' : /карточ/.test(n) ? 'cards' : 'markdown' };
    if (/когда|какого числа|дата|в какой день/.test(n)) return { when: true };
    if (/(список|все|покажи|какие) (лекци|конспект|тем)/.test(n)) return { list: sid };
    for (var i = 0; i < HOW.length; i++) if (HOW[i][0].test(n) && /как|где|можно|не (могу|получ)|зачем|работ|помоги|что делать|кнопк/.test(n)) return { html: HOW[i][1] };
    return null;
  }
  function itemLink(it, head) {
    var ic = { markdown: '📝 ', cards: '🃏 ', test: '✅ ' }[it.type] || '';
    return '<button class="hp-go" data-sid="' + esc(it.sid) + '" data-iid="' + esc(it.id) + '"' + (head ? ' data-head="' + esc(head) + '"' : '') + ' title="' + esc(cleanTitle(it.title)) + '">' + ic + esc(head || cleanTitle(it.title).replace(/^Лекция\s+\d+\.\s*/, '')) + '</button>';
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
      return { html: '<div class="hp-links">' + DB.sections.filter(function (s) { return s.items.length; }).map(function (s) {
        var n = s.items.filter(function (i) { return i.type === 'markdown'; }).length;
        return '<button class="hp-go" data-sec="' + esc(s.id) + '">' + esc((s.icon || '') + ' ' + s.title) + (n ? ' · ' + n + ' конспект' + (n === 1 ? '' : n < 5 ? 'а' : 'ов') : '') + '</button>';
      }).join('') + '</div>' };
    }
    if (it && 'latest' in it) {
      var ls = lectures(it.latest).filter(function (i) { return i.date; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!ls.length) return { html: 'Не нашёл датированных лекций' + (it.latest ? ' по предмету «' + esc(subjName(it.latest)) + '»' : '') + '.' };
      var top = it.latest ? ls.slice(0, 1) : ls.slice(0, 3);
      return { html: '<div class="hp-links">' + top.map(function (i) { return '<span class="hp-d">' + fmtDate(i.date) + (it.latest ? '' : ' · ' + esc(i.subj)) + '</span>' + itemLink(i); }).join('') + '</div>' };
    }
    if (it && it.count) {
      var kinds = { markdown: 'конспектов', test: 'тестов', cards: 'наборов карточек' };
      var arr = DB.items.filter(function (i) { return i.type === it.what && (!it.count || i.sid === it.count); });
      return { html: '<b>' + arr.length + '</b> ' + kinds[it.what] };
    }
    if (it && 'list' in it) {
      var L = lectures(it.list).slice().sort(function (a, b) { return (a.date || '0') < (b.date || '0') ? -1 : 1; });
      return { html: '<div class="hp-links">' + L.map(function (i) { return (i.date ? '<span class="hp-d">' + fmtDate(i.date) + '</span>' : '') + itemLink(i); }).join('') + '</div>' };
    }
    if (it && it.when) {
      var cands = lectures(scopeOf(q)).length ? lectures(scopeOf(q)) : lectures(null), qt = terms(q.replace(/когда|какого числа|дата|в какой день|была|был|прошла|лекци[а-я]*/gi, ' ')), best = null, bs = 0;
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

    var sc = scopeOf(q); q = q.replace(/\s*(везде|по всему сайту|на всём сайте|на всем сайте|во всех предметах)\s*/gi, ' ').trim() || q;
    var res = search(q, { sid: sc });
    function weak(r) { return !r.length || r[0].s < 1.2 || (r[0].hit / Math.max(1, terms(q).length) < 0.5 && terms(q).length > 1); }
    if (sc) { var all = search(q); if (!weak(all) && (weak(res) || all[0].s > res[0].s * 1.8)) res = all; }   /* в этом предмете нет — ищем по всему сайту */
    if (!res.length || res[0].s < 1.2 || (res[0].hit / Math.max(1, terms(q).length) < 0.5 && terms(q).length > 1)) {
      var rel = res.length ? res : [];
      return { html: 'Не нашёл.' + (rel.length ? '<div class="hp-links">' + uniq(rel).slice(0, 3).map(function (r) { return itemLink(r.c.it, r.c.k === 'doc' || r.c.k === 'head' ? r.c.head : ''); }).join('') + '</div>' : ''), chips: true };
    }
    var best = res[0].c, html = '';
    if (best.k === 'card') {
      html = '<div class="hp-q">' + esc(best.q) + '</div><div class="hp-a">' + mark(esc(best.text), terms(q)) + '</div>';
      var docR = res.filter(function (r) { return r.c.k === 'doc' && r.c.it.sid === best.it.sid; })[0];
      html += '<div class="hp-links">' + (docR ? itemLink(docR.c.it, docR.c.head) : '') + itemLink(best.it) + '</div>';
    } else if (best.k === 'test') {
      html = '<div class="hp-q">' + esc(best.q) + '</div><div class="hp-a">' + mark(esc(best.text), terms(q)) + '</div><div class="hp-links">' + itemLink(best.it) + '</div>';
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
      html = '<div class="hp-q">' + esc(best.head || cleanTitle(best.it.title)) + '</div>' +
        (txt ? '<div class="hp-a">' + snippet(txt, q, 280) + '</div>' : '') +
        (simple ? '<div class="hp-a hp-a2">' + esc(simple.text.replace(/^💡?\s*Проще говоря[:,.]?\s*/, '').slice(0, 200)) + (simple.text.length > 220 ? '…' : '') + '</div>' : '') +
        '<div class="hp-links">' + itemLink(best.it, best.head) + '</div>';
    }
    var more = uniq(res.slice(1)).filter(function (r) { return !(r.c.it === best.it && r.c.head === best.head); }).slice(0, 2);
    if (more.length && res[1] && res[1].s > res[0].s * 0.45) html += '<div class="hp-links hp-more-l">' + more.map(function (r) { return itemLink(r.c.it, r.c.k === 'doc' || r.c.k === 'head' ? r.c.head : ''); }).join('') + '</div>';
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
    if (!pool.length) return 'Тестов нет.';
    var c = pool[Math.floor(Math.random() * pool.length)], q = c.raw, id = 'hq' + (++quizN);
    QUIZ[id] = c;
    return '<div class="hp-q">' + q.q + '</div><div class="hp-opts" id="' + id + '" data-sid="' + esc(sid || '') + '">' +
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
        '</div><div class="hp-links"><button class="hp-next" data-sid="' + esc(opts.dataset.sid) + '">Ещё</button>' + itemLink(src.it) + '</div>';
      opts.insertAdjacentHTML('afterend', why);
      scrollDown();
    });
  }

  /* ---------- интерфейс ---------- */
  var E = 'cubic-bezier(.22,1,.36,1)';   /* плавное замедление без «прыжков» */
  var css = '' +
    /* кнопка: тёмное стекло, внутри медленно плавают синий и оранжевый шарики */
    '#hp-fab{position:fixed;z-index:26;right:14px;bottom:calc(16px + var(--bot,0px));width:50px;height:50px;border-radius:17px;padding:0;cursor:pointer;overflow:hidden;isolation:isolate;' +
      'background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.015) 50%),rgba(4,9,26,.82);-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);' +
      'border:1px solid rgba(130,180,255,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 10px 28px -12px rgba(0,0,0,.9),0 0 22px -10px rgba(47,140,255,.7);transition:transform .6s ' + E + ',opacity .4s ' + E + ',box-shadow .6s ' + E + '}' +
    '#hp-fab:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 14px 30px -12px rgba(0,0,0,.9),0 0 26px -8px rgba(255,138,31,.6)}#hp-fab:active{transform:scale(.94)}' +
    'body.hp-open #hp-fab{opacity:0;transform:scale(.6);pointer-events:none}body.fs #hp-fab,body:has(.pagewrap) #hp-fab{display:none}' +
    '.hp-orb{position:relative;display:block;width:26px;height:26px;margin:auto}' +
    '.hp-orb i{position:absolute;border-radius:50%}' +
    '.hp-orb .o1{width:17px;height:17px;left:0;top:1px;background:radial-gradient(circle at 32% 28%,#bfe9ff,#2f8cff 55%,#1546c9);box-shadow:0 0 10px rgba(47,140,255,.7);animation:hpO1 6s ease-in-out infinite}' +
    '.hp-orb .o2{width:14px;height:14px;right:0;bottom:1px;background:radial-gradient(circle at 32% 28%,#ffd6a8,#ff8a1f 55%,#e2560a);box-shadow:0 0 10px rgba(255,138,31,.7);animation:hpO2 6s ease-in-out infinite}' +
    '.hp-orb .o3{width:21px;height:6px;left:2px;top:10px;border-radius:6px;background:linear-gradient(90deg,rgba(255,255,255,.6),rgba(255,255,255,.1));transform:rotate(-24deg);opacity:.7}' +
    '@keyframes hpO1{50%{transform:translate(2px,2px) scale(.95)}}@keyframes hpO2{50%{transform:translate(-2px,-2px) scale(1.06)}}' +
    '#hp.busy .hp-orb .o1{animation:hpSpin1 1.6s linear infinite}#hp.busy .hp-orb .o2{animation:hpSpin2 1.6s linear infinite}' +
    '@keyframes hpSpin1{to{transform:rotate(360deg) translate(3px) rotate(-360deg)}}@keyframes hpSpin2{to{transform:rotate(-360deg) translate(3px) rotate(360deg)}}' +
    '.toc-fab{bottom:calc(76px + var(--bot,0px))!important}body.ai-on .toc-fab{bottom:calc(140px + var(--bot,0px))!important}' +
    /* панель: компактная, тёмная, раскрывается из угла кнопки */
    '#hp{position:fixed;z-index:45;right:12px;bottom:calc(12px + var(--bot,0px));width:min(360px,calc(100vw - 24px));height:min(520px,calc(100dvh - var(--top,0px) - 24px));display:flex;flex-direction:column;border-radius:24px;overflow:hidden;' +
      'background:linear-gradient(165deg,rgba(255,255,255,.07),rgba(255,255,255,.01) 35%),rgba(3,8,24,.9);-webkit-backdrop-filter:blur(24px) saturate(150%);backdrop-filter:blur(24px) saturate(150%);' +
      'border:1px solid rgba(130,180,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 30px 70px -24px rgba(0,0,0,.95),0 0 0 1px rgba(0,0,0,.3);' +
      'opacity:0;transform:translateY(16px) scale(.94);transform-origin:calc(100% - 25px) calc(100% - 25px);clip-path:inset(calc(100% - 50px) 0 0 calc(100% - 50px) round 17px);pointer-events:none;' +
      'transition:opacity .35s ' + E + ',transform .6s ' + E + ',clip-path .6s ' + E + '}' +
    '#hp.on{opacity:1;transform:none;clip-path:inset(0 0 0 0 round 24px);pointer-events:auto}' +
    '#hp::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;padding:1px;background:linear-gradient(140deg,rgba(92,200,255,.35),transparent 30%,transparent 70%,rgba(255,138,31,.3));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}' +
    '.hp-top{display:flex;align-items:center;gap:9px;padding:9px 9px 9px 11px;border-bottom:1px solid rgba(130,180,255,.1)}' +
    '.hp-ava{flex:none;width:32px;height:32px;border-radius:11px;display:grid;place-items:center;background:rgba(0,0,0,.35);border:1px solid rgba(130,180,255,.18)}.hp-ava .hp-orb{transform:scale(.78)}' +
    '.hp-name{flex:1;min-width:0;display:flex;align-items:center;gap:8px}.hp-name b{font-size:15px;font-weight:750;color:#eef3ff;letter-spacing:-.01em}' +
    '.hp-scope{min-width:0;font-size:11px;font-weight:650;color:#ffa45a;background:rgba(255,138,31,.1);border:1px solid rgba(255,138,31,.25);border-radius:999px;padding:1px 7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.hp-x{flex:none;width:32px;height:32px;display:grid;place-items:center;border-radius:10px;border:1px solid transparent;background:transparent;color:#8a9bc4;cursor:pointer;transition:background .35s ' + E + ',color .35s ' + E + ',transform .5s ' + E + '}' +
    '.hp-x svg{width:16px;height:16px}.hp-x:hover{background:rgba(255,255,255,.06);color:#eef3ff}.hp-x:active{transform:scale(.9)}.hp-clear:hover{color:#ff8a8f}' +
    '.hp-log{flex:1;overflow-y:auto;padding:12px 10px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch;scroll-behavior:smooth;overscroll-behavior:contain;' +
      '-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 calc(100% - 8px),transparent);mask-image:linear-gradient(to bottom,transparent 0,#000 14px,#000 calc(100% - 8px),transparent)}' +
    '.hp-empty{margin:auto;animation:hpFade 1s ' + E + ' both}.hp-empty .hp-orb{transform:scale(2);opacity:.85}' +
    /* сообщения */
    '.hp-m{position:relative;max-width:90%;padding:8px 11px;border-radius:16px;font-size:14px;line-height:1.45;animation:hpIn .55s ' + E + ' both}' +
    '@keyframes hpIn{from{opacity:0;transform:translateY(8px);filter:blur(3px)}}@keyframes hpFade{from{opacity:0}}' +
    '.hp-m.me{align-self:flex-end;background:linear-gradient(135deg,#2a7ff0,#1650c8);color:#fff;border-bottom-right-radius:5px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}' +
    '.hp-m.bot{align-self:flex-start;background:rgba(255,255,255,.045);border:1px solid rgba(130,180,255,.12);border-bottom-left-radius:5px;color:#dfe7fb}' +
    '.hp-q{font-weight:700;margin-bottom:3px;color:#fff}.hp-a2{margin-top:6px;padding:6px 9px;border-radius:10px;color:#b9c8ea;font-size:13px;background:rgba(47,140,255,.08);border-left:2px solid #2f8cff}' +
    '.hp-m mark{background:linear-gradient(transparent 60%,rgba(255,138,31,.38) 60%);color:inherit;padding:0}' +
    '.hp-links{display:flex;flex-direction:column;gap:5px;margin-top:8px}.hp-d{font-size:11px;color:#ff8a1f;font-weight:750;margin:3px 0 -2px}' +
    '.hp-links>*{animation:hpIn .5s ' + E + ' both}.hp-links>*:nth-child(2){animation-delay:.06s}.hp-links>*:nth-child(3){animation-delay:.12s}.hp-links>*:nth-child(n+4){animation-delay:.18s}' +
    '.hp-go,.hp-next{position:relative;display:block;width:100%;text-align:left;font:inherit;font-size:13px;line-height:1.3;color:#cfe0ff;padding:7px 26px 7px 10px;border-radius:11px;cursor:pointer;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
      'background:rgba(47,140,255,.08);border:1px solid rgba(92,170,255,.18);transition:background .35s ' + E + ',border-color .35s ' + E + ',transform .5s ' + E + '}' +
    '.hp-go::after,.hp-next::after{content:"›";position:absolute;right:10px;top:50%;transform:translateY(-54%);font-size:17px;color:#6f82b0;transition:transform .45s ' + E + ',color .35s}' +
    '.hp-go:hover,.hp-next:hover{background:rgba(47,140,255,.16);border-color:rgba(92,200,255,.4)}.hp-go:hover::after,.hp-next:hover::after{transform:translate(3px,-54%);color:#ff8a1f}' +
    '.hp-next{background:rgba(255,138,31,.12);border-color:rgba(255,160,80,.3);color:#ffd2a8}' +
    '.hp-go:active,.hp-next:active,.hp-o:active{transform:scale(.97)}' +
    '.hp-opts{display:flex;flex-direction:column;gap:5px;margin-top:8px}.hp-o{text-align:left;font:inherit;font-size:13px;color:#dfe7fb;padding:7px 10px;border-radius:11px;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(130,180,255,.16);transition:background .35s ' + E + ',border-color .35s ' + E + ',opacity .4s,transform .5s ' + E + '}' +
    '.hp-o:hover{border-color:rgba(92,200,255,.45)}.hp-o.ok{border-color:#3ddc97;background:rgba(61,220,151,.14)}.hp-o.bad{border-color:#ff5a64;background:rgba(255,90,100,.12)}.hp-o.dim{opacity:.4}' +
    '.hp-why{margin-top:7px;padding:7px 9px;border-radius:10px;border-left:2px solid #3ddc97;background:rgba(61,220,151,.07);font-size:13px;animation:hpIn .5s ' + E + ' both}.hp-why.bad{border-left-color:#ff5a64;background:rgba(255,90,100,.06)}' +
    /* поле ввода */
    '.hp-in{display:flex;gap:6px;padding:8px 9px calc(9px + var(--bot,0px));border-top:1px solid rgba(130,180,255,.1)}' +
    '.hp-in input{flex:1;min-width:0;font:inherit;font-size:16px;color:#eef3ff;background:rgba(0,0,0,.3);border:1px solid rgba(130,180,255,.16);border-radius:13px;padding:8px 12px;outline:none;transition:border-color .35s ' + E + ',box-shadow .35s ' + E + '}' +
    '.hp-in input:focus{border-color:rgba(47,140,255,.7);box-shadow:0 0 0 3px rgba(47,140,255,.15)}.hp-in input::placeholder{color:#6f82b0}' +
    '.hp-send{flex:none;width:40px;display:grid;place-items:center;border-radius:13px;border:0;background:linear-gradient(135deg,#2f8cff,#1650c8);color:#fff;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 6px 16px -8px rgba(47,140,255,.9);transition:transform .5s ' + E + ',opacity .3s}' +
    '.hp-send svg{width:17px;height:17px}.hp-send:active{transform:scale(.9)}.hp-in input:placeholder-shown+.hp-send{opacity:.55}' +
    /* Митя думает */
    '.hp-dots{display:inline-flex;gap:5px;padding:3px 1px}.hp-dots span{width:7px;height:7px;border-radius:50%;animation:hpDot 1.4s ease-in-out infinite}' +
    '.hp-dots span:nth-child(1){background:#2f8cff}.hp-dots span:nth-child(2){background:#5cc8ff;animation-delay:.18s}.hp-dots span:nth-child(3){background:#ff8a1f;animation-delay:.36s}' +
    '@keyframes hpDot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}' +
    '.hp-m.out{animation:hpOut .4s ' + E + ' forwards}@keyframes hpOut{to{opacity:0;transform:translateY(-8px);filter:blur(4px)}}' +
    '@media (prefers-reduced-motion:reduce){#hp,#hp-fab,.hp-m,.hp-orb i{animation:none!important;transition:opacity .2s!important}}' +
    '@media (max-width:520px){#hp{right:8px;left:8px;width:auto;bottom:calc(8px + var(--bot,0px));height:min(70dvh,520px)}}';

  var panel, log, input, opened = false;

  function ui() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var fab = document.createElement('button'); fab.id = 'hp-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Митя'); fab.innerHTML = '<span class="hp-orb"><i class="o1"></i><i class="o2"></i><i class="o3"></i></span>';
    panel = document.createElement('div'); panel.id = 'hp'; panel.className = 'lg'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Митя');
    panel.innerHTML = '<div class="hp-top"><span class="hp-ava"><span class="hp-orb"><i class="o1"></i><i class="o2"></i><i class="o3"></i></span></span><span class="hp-name"><b>Митя</b><span class="hp-scope"></span></span>' +
      '<button class="hp-x hp-clear" type="button" aria-label="Очистить чат"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/></svg></button><button class="hp-x hp-close" type="button" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="hp-log"></div>' +
      '<form class="hp-in"><input type="text" placeholder="Вопрос…" enterkeyhint="send" autocomplete="off"><button class="hp-send" type="submit" aria-label="Отправить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></button></form>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    log = panel.querySelector('.hp-log'); input = panel.querySelector('input');
    fab.onclick = function () { toggle(true); };
    panel.querySelector('.hp-close').onclick = function () { toggle(false); };
    panel.querySelector('.hp-clear').onclick = clearChat;
    panel.querySelector('form').onsubmit = function (e) { e.preventDefault(); ask(input.value); };
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
    window.addEventListener('hashchange', function () { if (opened && DB) showScope(); });
  }
  function toggle(on) {
    opened = on; panel.classList.toggle('on', on); document.body.classList.toggle('hp-open', on);
    if (on) {
      var ai = document.getElementById('ai'); if (ai) ai.classList.remove('on');
      if (!log.children.length) empty();
      load().then(showScope);
      if (window.matchMedia('(pointer:fine)').matches) setTimeout(function () { input.focus(); }, 300);
    }
  }
  /* в шапке панели — предмет, по которому идёт поиск */
  function showScope() {
    var el = panel.querySelector('.hp-scope'), sid = curSid(), s = sid && DB.sections.filter(function (x) { return x.id === sid; })[0];
    el.textContent = s ? (s.icon ? s.icon + ' ' : '') + s.title : 'Весь сайт';
  }
  /* одинаковые ссылки (тот же конспект и раздел) показываем один раз */
  function dedupe(box) {
    var seen = {};
    Array.prototype.forEach.call(box.querySelectorAll('.hp-go'), function (g) {
      var k = (g.dataset.sec || '') + '|' + (g.dataset.sid || '') + '|' + (g.dataset.iid || '') + '|' + (g.dataset.head || '');
      if (seen[k]) g.remove(); else seen[k] = 1;
    });
    Array.prototype.forEach.call(box.querySelectorAll('.hp-links'), function (l) { if (!l.children.length) l.remove(); });
  }
  function empty() { log.innerHTML = '<div class="hp-empty"><span class="hp-orb"><i class="o1"></i><i class="o2"></i><i class="o3"></i></span></div>'; }
  /* очистка: сообщения уходят вверх с размытием, потом — пустой экран */
  function clearChat() {
    var ms = log.querySelectorAll('.hp-m');
    if (!ms.length) return;
    Array.prototype.forEach.call(ms, function (m, i) { m.style.animationDelay = Math.min(i * 0.03, 0.3) + 's'; m.classList.add('out'); });
    setTimeout(empty, 380 + Math.min(ms.length * 30, 300));
  }
  function scrollDown() { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); }
  function bot(html) { var e0 = log.querySelector('.hp-empty'); if (e0) e0.remove(); var d = document.createElement('div'); d.className = 'hp-m bot'; d.innerHTML = html; log.appendChild(d); scrollDown(); return d; }
  function me(text) { var e0 = log.querySelector('.hp-empty'); if (e0) e0.remove(); var d = document.createElement('div'); d.className = 'hp-m me'; d.textContent = text; log.appendChild(d); scrollDown(); }
  function ask(q) {
    q = String(q || '').trim(); if (!q) return;
    input.value = ''; me(q);
    var wait = bot('<span class="hp-dots"><span></span><span></span><span></span></span>');
    var t0 = Date.now(); panel.classList.add('busy');
    load().then(function () {
      setTimeout(function () {
        var r;
        try {
          if (/^последние лекции$/i.test(q)) r = answer('последняя лекция');
          else r = answer(q);
        } catch (e) { r = { html: 'Не понял, спроси по-другому.' }; }
        if (r.quiz !== undefined) { wait.innerHTML = quizHtml(r.quiz); wireQuiz(wait); }
        else wait.innerHTML = r.html;
        dedupe(wait); panel.classList.remove('busy');
        scrollDown();
      }, Math.max(0, 350 - (Date.now() - t0)));
    }).catch(function () { wait.innerHTML = 'Нет связи.'; loading = null; });
  }

  window.HubHelper = { ask: function (q) { return load().then(function () { return answer(q); }); }, search: function (q, n, sid) { return load().then(function () { return search(q, { sid: sid === undefined ? null : sid }).slice(0, n || 5); }); },
    scope: function () { return load().then(function () { return curSid(); }); },
    db: function () { return load(); }, howto: function () { return HOW.map(function (h) { return h[1].replace(/<[^>]+>/g, ''); }); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();
