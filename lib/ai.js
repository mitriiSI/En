/* Кнопка «✨ ИИ»: GigaChat через прокси (ключ живёт только на прокси).
   Перед каждым ответом сама собирает контекст: карту сайта (предметы и лекции с датами),
   подходящие куски конспектов/карточек/тестов (индекс помощника), страницу, где ты сейчас,
   справку по сайту и — когда на сайте ответа нет или включён 🌐 — статьи из Википедии. */
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function getUrl() { try { return localStorage.getItem('mitya-ai-url') || window.MITYA_AI_URL || ''; } catch (e) { return window.MITYA_AI_URL || ''; } }
  function setUrl(u) { try { if (u) localStorage.setItem('mitya-ai-url', u); else localStorage.removeItem('mitya-ai-url'); } catch (e) {} }
  function fmtDate(d) { return d ? d.slice(8, 10) + '.' + d.slice(5, 7) : ''; }

  /* ---------- Википедия (работает прямо из браузера) ---------- */
  function wiki(q) {
    var base = 'https://ru.wikipedia.org/w/api.php?format=json&origin=*';
    return fetch(base + '&action=query&list=search&srlimit=3&srsearch=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var hits = (j.query && j.query.search) || [];
        if (!hits.length) return [];
        return fetch(base + '&action=query&prop=extracts&exintro=1&explaintext=1&exchars=900&pageids=' + hits.map(function (h) { return h.pageid; }).join('|'))
          .then(function (r) { return r.json(); })
          .then(function (j2) {
            var pages = (j2.query && j2.query.pages) || {};
            return hits.map(function (h) {
              var p = pages[h.pageid] || {};
              return { title: h.title, text: (p.extract || '').trim(), url: 'https://ru.wikipedia.org/wiki/' + encodeURIComponent(h.title.replace(/ /g, '_')) };
            }).filter(function (x) { return x.text; });
          });
      }).catch(function () { return []; });
  }

  /* ---------- контекст сайта ---------- */
  var LCODES = [];
  function siteMap(db) {
    LCODES = [];
    var lines = [];
    db.sections.forEach(function (s) {
      var its = s.items.filter(function (i) { return i.type === 'markdown' || i.type === 'video' || i.type === 'page'; });
      if (!its.length) return;
      lines.push(s.title + ':');
      its.slice().sort(function (a, b) { return (a.date || '0') < (b.date || '0') ? -1 : 1; }).forEach(function (i) {
        LCODES.push({ sid: s.id, iid: i.id, title: i.title });
        lines.push('  [L' + LCODES.length + '] ' + (i.date ? fmtDate(i.date) + ' ' : '') + String(i.title).replace(/\s*\(\d{1,2}\.\d{1,2}\)\s*$/, ''));
      });
      var tests = s.items.filter(function (i) { return i.type === 'test'; }).length, cards = s.items.filter(function (i) { return i.type === 'cards'; }).length;
      if (tests || cards) lines.push('  (тестов: ' + tests + ', наборов карточек: ' + cards + ')');
    });
    return lines.join('\n');
  }
  function currentPage() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    var title = (document.getElementById('title') || {}).textContent || '';
    if (p[0] !== 's' || !p[1]) return 'Сейчас открыт главный экран.';
    var heads = Array.prototype.map.call(document.querySelectorAll('.doc > h2'), function (h) { return h.textContent.trim(); }).slice(0, 30);
    return 'Сейчас открыто: «' + title.trim() + '»' + (heads.length ? '. Разделы этой страницы: ' + heads.join('; ') : '') + '.';
  }
  var WEB_RX = /интернет|в сети|найди|загугли|новост|сейчас|сегодня|актуальн|последн(ие|яя) (данн|новост)|википеди|202[5-9]/i;

  function buildContext(q, forceWeb) {
    var H = window.HubHelper;
    var dbP = H ? H.db() : Promise.resolve(null);
    /* сначала ищем в предмете, где открыт ИИ; если там пусто — по всему сайту */
    var hitsP = !H ? Promise.resolve([]) : H.scope().then(function (sid) {
      if (!sid || /везде|весь сайт|все(м|х)? предмет/i.test(q)) return H.search(q, 8);
      return H.search(q, 8, sid).then(function (r) { return r.length && r[0].s > 2 ? r : H.search(q, 8); });
    });
    return Promise.all([dbP, hitsP]).then(function (r) {
      var db = r[0], hits = (r[1] || []).filter(function (h) { return h.s > 0.9; });
      var seen = {}, src = [];
      hits.forEach(function (h) {
        var c = h.c, key = c.it.sid + c.it.id + (c.head || '') + c.k;
        if (seen[key] || src.length >= 5) return; seen[key] = 1;
        var body = c.k === 'card' ? 'Вопрос: ' + c.q + '\nОтвет: ' + c.text : c.k === 'test' ? 'Вопрос теста: ' + c.q + '\nВерный ответ и разбор: ' + c.text : c.text;
        if (c.k === 'head') return;
        src.push({ it: c.it, head: c.k === 'doc' ? c.head : '', kind: c.k, text: body.slice(0, 1100) });
      });
      var weak = !hits.length || hits[0].s < 2.2;
      var webP = (forceWeb || WEB_RX.test(q) || weak) ? wiki(q.replace(/[?!.]+$/, '')) : Promise.resolve([]);
      return webP.then(function (web) { return { db: db, src: src, web: web, weak: weak }; });
    });
  }
  function systemPrompt(ctx) {
    var howto = window.HubHelper && window.HubHelper.howto ? window.HubHelper.howto() : [];
    var s = 'Ты — ИИ-помощник учебного сайта «Митя» (конспекты лекций студента: 3D-модели, карточки, тесты с разбором). ' +
      'Отвечай по-русски, понятно и по делу, как хороший преподаватель: сначала короткий прямой ответ, потом объяснение простыми словами; сложные термины поясняй. ' +
      'Главный источник — материалы сайта [С1], [С2]…: опирайся на них в первую очередь и ставь метки источников прямо в тексте. ' +
      'Если в материалах сайта ответа нет, используй статьи [В1], [В2]… из Википедии и пометь это. Если нет и там — ответь по общим знаниям и честно скажи, что этого нет в конспектах. Не выдумывай даты, цитаты и слова лектора. ' +
      'Чтобы дать ссылку на лекцию сайта, пиши её код из карты сайта, например [L3] — на сайте это станет кнопкой перехода. ' +
      'Если просят проверить знания — задай 1–3 вопроса по материалам и после ответа объясни, почему верно или неверно. ' +
      'Форматирование: короткие абзацы, списки через «- », **жирный** для ключевых слов. Без таблиц и без длинных вступлений.\n\n' +
      'КАРТА САЙТА (лекции от старых к новым):\n' + (ctx.db ? siteMap(ctx.db) : '—') + '\n\n' +
      'КАК ПОЛЬЗОВАТЬСЯ САЙТОМ:\n- ' + howto.join('\n- ') + '\n- Внизу справа: 💬 помощник-поиск по сайту без ИИ, ✨ — это ты.\n\n' +
      currentPage() + '\n';
    if (ctx.src.length) s += '\nМАТЕРИАЛЫ САЙТА ПО ВОПРОСУ:\n' + ctx.src.map(function (x, i) {
      return '[С' + (i + 1) + '] ' + x.it.subj + ' — «' + String(x.it.title).replace(/^Тест:\s*/, '') + '»' + (x.head ? ', раздел «' + x.head + '»' : '') + (x.it.date ? ' (лекция ' + fmtDate(x.it.date) + ')' : '') + ':\n' + x.text;
    }).join('\n\n') + '\n';
    else s += '\nМАТЕРИАЛЫ САЙТА ПО ВОПРОСУ: ничего подходящего не найдено.\n';
    if (ctx.web.length) s += '\nИЗ ВИКИПЕДИИ:\n' + ctx.web.map(function (w, i) { return '[В' + (i + 1) + '] ' + w.title + ':\n' + w.text; }).join('\n\n') + '\n';
    return s;
  }

  /* ---------- оформление ответа ---------- */
  function md(text, ctx) {
    var out = [], inList = false;
    esc(text.trim()).split('\n').forEach(function (ln) {
      var m = /^\s*(?:[-•*]|(\d+)[.)])\s+(.*)$/.exec(ln);
      if (m) { if (!inList) { out.push('<ul>'); inList = true; } out.push('<li>' + (m[1] ? '<span class="ai-n">' + m[1] + '.</span> ' : '') + m[2] + '</li>'); return; }
      if (inList) { out.push('</ul>'); inList = false; }
      var hm = /^#{1,4}\s*(.+)$/.exec(ln);
      out.push(hm ? '<b>' + hm[1] + '</b><br>' : ln.trim() ? ln + '<br>' : '<br>');
    });
    if (inList) out.push('</ul>');
    var h = out.join('').replace(/(<br>){3,}/g, '<br><br>').replace(/<br>(<ul>)/g, '$1').replace(/<br>$/, '')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[\s(«])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
    h = h.replace(/\[(С|C)(\d+)\]/g, function (m, a, n) {
      var x = ctx.src[+n - 1]; if (!x) return '';
      return '<button class="ai-ref" data-sid="' + esc(x.it.sid) + '" data-iid="' + esc(x.it.id) + '" data-head="' + esc(x.head || '') + '" title="' + esc(x.it.title) + '">С' + n + '</button>';
    }).replace(/\[(В|B)(\d+)\]/g, function (m, a, n) {
      var w = ctx.web[+n - 1]; if (!w) return '';
      return '<a class="ai-ref web" href="' + esc(w.url) + '" target="_blank" rel="noopener" title="' + esc(w.title) + '">В' + n + '</a>';
    }).replace(/\[L(\d+)\]/g, function (m, n) {
      var l = LCODES[+n - 1]; if (!l) return '';
      return '<button class="ai-lec" data-sid="' + esc(l.sid) + '" data-iid="' + esc(l.iid) + '">' + esc(String(l.title).replace(/\s*\(\d{1,2}\.\d{1,2}\)\s*$/, '')) + '</button>';
    });
    return h;
  }
  function sources(ctx) {
    var out = '';
    if (ctx.src.length) out += ctx.src.map(function (x, i) {
      var ic = { doc: '📝', card: '🃏', test: '✅' }[x.kind] || '📝';
      return '<button class="hp-go" data-sid="' + esc(x.it.sid) + '" data-iid="' + esc(x.it.id) + '" data-head="' + esc(x.head || '') + '"><b>С' + (i + 1) + '</b> ' + ic + ' ' + esc(String(x.it.title).replace(/^Тест:\s*/, '')) + (x.head ? ' · ' + esc(x.head) : '') + '</button>';
    }).join('');
    if (ctx.web.length) out += ctx.web.map(function (w, i) { return '<a class="hp-go" href="' + esc(w.url) + '" target="_blank" rel="noopener"><b>В' + (i + 1) + '</b> 🌐 ' + esc(w.title) + ' — Википедия</a>'; }).join('');
    return out ? '<details class="ai-src"><summary>↗</summary><div class="hp-links">' + out + '</div></details>' : '';
  }

  /* ---------- интерфейс ---------- */
  var css = '' +
    '#ai-fab{position:fixed;z-index:26;right:16px;bottom:calc(88px + var(--bot,0px));width:58px;height:58px;border-radius:20px;border:1px solid rgba(160,210,255,.65);color:#fff;font-size:24px;cursor:pointer;background:linear-gradient(145deg,#5cc8ff,#2f8cff 45%,#1a46c9);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 12px 30px -8px rgba(47,140,255,.95);transition:transform .55s cubic-bezier(.3,1.6,.45,1);animation:aiGlow 3.6s ease-in-out infinite}' +
    '@keyframes aiGlow{50%{box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 12px 34px -6px rgba(92,200,255,1)}}#ai-fab:hover{transform:translateY(-2px) scale(1.04)}' +
    '#ai-fab:active{transform:scale(.92)}body.fs #ai-fab,body:has(.pagewrap) #ai-fab{display:none}' +
    '#ai .hp-top b::before{background:#5cc8ff;box-shadow:0 0 10px #5cc8ff}' +
    '#ai .hp-top small{color:#93a3cc;font-weight:500;font-size:12px;margin-left:6px}' +
    '.ai-ref{display:inline-block;vertical-align:1px;font:inherit;font-size:11px;font-weight:800;line-height:1;padding:3px 6px;margin:0 2px;border-radius:7px;cursor:pointer;color:#fff;background:rgba(47,140,255,.45);border:1px solid rgba(120,190,255,.6);text-decoration:none}' +
    '.ai-ref.web{background:rgba(255,138,31,.4);border-color:rgba(255,170,90,.6)}' +
    '.ai-lec{display:block;width:100%;text-align:left;font:inherit;font-size:14px;margin:6px 0;color:#cfe7ff;background:rgba(47,140,255,.14);border:1px solid rgba(92,200,255,.35);border-radius:12px;padding:7px 10px;cursor:pointer}' +
    '#ai .hp-m ul{margin:6px 0;padding-left:18px}#ai .hp-m li{margin:3px 0}.ai-n{color:#ffa13d;font-weight:700}' +
    '.ai-src{margin-top:8px;font-size:13px}.ai-src summary{cursor:pointer;color:#93a3cc;font-weight:650}' +
    'a.hp-go{display:block;text-decoration:none}' +
    '.ai-web{flex:none;width:46px;border-radius:14px;border:1px solid rgba(150,200,255,.3);background:rgba(255,255,255,.05);font-size:18px;cursor:pointer;opacity:.55;transition:opacity .2s,background .2s}' +
    '.ai-web.on{opacity:1;background:rgba(255,138,31,.25);border-color:rgba(255,170,90,.6)}' +
    '.ai-set{display:flex;flex-direction:column;gap:8px}.ai-set input{font:inherit;font-size:15px;color:#eef3ff;background:rgba(5,11,30,.6);border:1px solid rgba(150,200,255,.25);border-radius:12px;padding:9px 11px;outline:none}';

  var panel, log, input, webBtn, history = [], busy = false;
  function ui() {
    if (!document.getElementById('hp')) return setTimeout(ui, 200);   /* стили и разметку берём у помощника */
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var fab = document.createElement('button'); fab.id = 'ai-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'ИИ'); fab.textContent = '✨';
    panel = document.createElement('div'); panel.id = 'ai'; panel.className = ''; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'ИИ');
    panel.innerHTML = '<div class="hp-top"><span class="hp-ava"><span class="hp-orb"><i class="o1"></i><i class="o2"></i><i class="o3"></i></span></span><span class="hp-name"><b>Митя · ИИ</b><span class="hp-scope ai-scope"></span></span><button class="hp-x ai-cfg" type="button" aria-label="Настройки">⚙</button><button class="hp-x hp-clear ai-new" type="button" aria-label="Очистить чат" title="Очистить чат">🗑</button><button class="hp-x ai-close" type="button" aria-label="Закрыть">✕</button></div>' +
      '<div class="hp-log"></div>' +
      '<form class="hp-in"><button class="ai-web" type="button" aria-label="Искать в интернете" title="Искать в интернете">🌐</button><input type="text" placeholder="Спроси…" enterkeyhint="send" autocomplete="off"><button class="hp-send" type="submit" aria-label="Отправить">↑</button></form>';
    panel.id = 'ai';
    document.body.appendChild(fab); document.body.appendChild(panel);
    /* панель ИИ использует те же стили, что и помощник (#hp) */
    panel.classList.add('ai-panel', 'lg');
    var hpCss = document.createElement('style');
    hpCss.textContent = '#ai{position:fixed;z-index:46;right:12px;bottom:calc(12px + var(--bot,0px));width:min(440px,calc(100vw - 24px));height:min(680px,calc(100dvh - var(--top,0px) - 24px));display:flex;flex-direction:column;border-radius:26px;overflow:hidden;opacity:0;transform:translateY(40px) scale(.9);filter:blur(10px);transform-origin:100% 100%;pointer-events:none;transition:opacity .3s,filter .45s,transform .65s cubic-bezier(.3,1.5,.45,1)}#ai.on{opacity:1;transform:none;filter:none;pointer-events:auto}@media (max-width:520px){#ai{right:8px;left:8px;width:auto;bottom:calc(8px + var(--bot,0px));height:min(82dvh,680px)}}';
    document.head.appendChild(hpCss);
    log = panel.querySelector('.hp-log'); input = panel.querySelector('input'); webBtn = panel.querySelector('.ai-web');
    fab.onclick = function () { toggle(true); };
    panel.querySelector('.ai-close').onclick = function () { toggle(false); };
    panel.querySelector('.ai-new').onclick = function () {
      history = [];
      var ms = log.querySelectorAll('.hp-m');
      Array.prototype.forEach.call(ms, function (m, i) { m.style.animationDelay = Math.min(i * 0.03, 0.3) + 's'; m.classList.add('out'); });
      setTimeout(function () { log.innerHTML = ''; greet(); }, ms.length ? 380 + Math.min(ms.length * 30, 300) : 0);
    };
    panel.querySelector('.ai-cfg').onclick = settings;
    webBtn.onclick = function () { webBtn.classList.toggle('on'); };
    panel.querySelector('form').onsubmit = function (e) { e.preventDefault(); ask(input.value); };
    log.addEventListener('click', function (e) {
      var g = e.target.closest('button.hp-go, .ai-ref:not(.web), .ai-lec');
      if (g && g.dataset.sid) {
        if (window.HubGoto) window.HubGoto(g.dataset.sid, g.dataset.iid, g.dataset.head || ''); else location.hash = '#/s/' + g.dataset.sid + '/' + g.dataset.iid;
        if (window.innerWidth < 700) toggle(false);
      }
      var sv = e.target.closest('.ai-save');
      if (sv) { var v = log.querySelector('.ai-url').value.trim(); setUrl(v); sv.closest('.hp-m').innerHTML = v ? '✓' : '—'; }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('on')) toggle(false); });
  }
  function toggle(on) {
    panel.classList.toggle('on', on);
    var hp = document.getElementById('hp'); if (on && hp) hp.classList.remove('on');
    if (on) {
      if (window.HubHelper) window.HubHelper.db().then(function (db) { var m = /^#\/s\/([^/]+)/.exec(location.hash), s = m && db.sections.filter(function (x) { return x.id === m[1]; })[0]; panel.querySelector('.ai-scope').textContent = s ? (s.icon ? s.icon + ' ' : '') + s.title : 'Весь сайт'; });
      if (!log.children.length) greet(); if (window.matchMedia('(pointer:fine)').matches) setTimeout(function () { input.focus(); }, 300); }
  }
  function greet() {
    if (!getUrl()) { settings(); return; }
    if (!log.children.length) log.innerHTML = '<div class="hp-empty"><span class="hp-orb"><i class="o1"></i><i class="o2"></i><i class="o3"></i></span><div>Спроси — найду в лекциях и в интернете</div></div>';
  }
  function settings() {
    bot('<div class="ai-set"><input class="ai-url" type="url" placeholder="https://functions.yandexcloud.net/…" value="' + esc(getUrl()) + '"><button class="hp-next ai-save" type="button">Сохранить</button></div>');
  }
  function scrollDown() { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); }
  function bot(html) { var e0 = log.querySelector('.hp-empty'); if (e0) e0.remove(); var d = document.createElement('div'); d.className = 'hp-m bot'; d.innerHTML = html; log.appendChild(d); scrollDown(); return d; }
  function me(text) { var e0 = log.querySelector('.hp-empty'); if (e0) e0.remove(); var d = document.createElement('div'); d.className = 'hp-m me'; d.textContent = text; log.appendChild(d); scrollDown(); }

  function ask(q) {
    q = String(q || '').trim(); if (!q || busy) return;
    var url = getUrl();
    input.value = ''; me(q);
    if (!url) { settings(); return; }
    busy = true; panel.classList.add('busy');
    var wait = bot('<span class="hp-dots"><span></span><span></span><span></span></span>');
    var forceWeb = webBtn.classList.contains('on'), ctx;
    buildContext(q, forceWeb).then(function (c) {
      ctx = c;
      var msgs = [{ role: 'system', content: systemPrompt(ctx) }].concat(history.slice(-6), [{ role: 'user', content: q }]);
      return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify({ messages: msgs }) /* text/plain — без лишнего предзапроса CORS */ });
    }).then(function (r) {
      return r.json().catch(function () { return { error: 'Ответ прокси не JSON (' + r.status + ')' }; });
    }).then(function (j) {
      if (j.error || !j.answer) throw new Error(j.error || 'Пустой ответ');
      history.push({ role: 'user', content: q }, { role: 'assistant', content: j.answer });
      wait.innerHTML = md(j.answer, ctx) + sources(ctx);
      scrollDown();
    }).catch(function (e) {
      wait.innerHTML = '⚠ ' + esc(e.message || e);
    }).then(function () { busy = false; panel.classList.remove('busy'); });
  }

  window.HubAI = { context: function (q, web) { return buildContext(q, web).then(function (c) { return systemPrompt(c); }); }, md: md };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();
