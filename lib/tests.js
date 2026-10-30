/* Тесты с разбором каждого варианта ответа.
   Данные: data/tests/<предмет>.json
   { subject, title, topics: [{ id, title, date }], questions: [{ t: темa, q: вопрос, o: [варианты], a: индекс верного, w: [почему по каждому варианту] }] }
   В конспекте итоговый тест вставляется строкой  @@graph:test-<предмет>__<тема>@@
   В разделе «Тесты» предмета — элемент { type: "test", src: "data/tests/<предмет>.json" }. */
(function () {
  'use strict';
  var cache = {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  // в вопросах разрешены только <b>, <i>, <br>
  var rich = function (s) { return esc(s).replace(/&lt;(\/?)(b|i|br)&gt;/g, '<$1$2>'); };

  function load(src) {
    if (!cache[src]) cache[src] = fetch(src).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    return cache[src];
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('hub.test.' + k)); localStorage.setItem('hub.test.' + k, JSON.stringify(v)); } catch (e) { return null; } }
  function fmtDate(d) { if (!d) return ''; var p = d.split('-'); return p[2] + '.' + p[1]; }
  function byDate(a, b) { return (a.date || '0000') < (b.date || '0000') ? -1 : (a.date || '0000') > (b.date || '0000') ? 1 : 0; }

  /* Один прогон теста. box — контейнер, qs — вопросы, o: { title, badge, lead, key, topicTitle(t) } */
  function run(box, qs, o) {
    o = o || {};
    box.classList.add('wg', 'tq');
    var list = qs.map(function (q) { return { q: q, ord: shuffle(q.o.map(function (_, k) { return k; })) }; });
    var i = 0, score = 0, picked = null, wrong = [];
    function head() {
      return '<div class="wg-h"><span class="wg-badge">' + esc(o.badge || 'Тест') + '</span><b>' + esc(o.title || 'Проверь себя') + '</b></div>' +
        (o.lead ? '<p class="wg-lead">' + rich(o.lead) + '</p>' : '');
    }
    function draw() {
      if (i >= list.length) return finish();
      var it = list[i], q = it.q, pct = Math.round(i / list.length * 100);
      var h = head() + '<div class="tq-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="tq-q"><small>Вопрос ' + (i + 1) + ' из ' + list.length + (o.topicTitle ? ' · ' + esc(o.topicTitle(q.t)) : '') + '</small>' + rich(q.q) + '</div><div class="tq-opts">';
      it.ord.forEach(function (k, n) {
        var cls = '';
        if (picked !== null) cls = k === q.a ? ' ok' : k === picked ? ' bad' : ' dim';
        h += '<button class="tq-o' + cls + '" data-k="' + k + '"><span class="tq-l">' + 'АБВГДЕ'[n] + '</span><span>' + rich(q.o[k]) + '</span></button>';
      });
      h += '</div>';
      if (picked !== null) {
        var ok = picked === q.a;
        h += '<div class="tq-why ' + (ok ? 'ok' : 'bad') + '">' +
          (ok ? '<p><b>✅ Верно.</b> ' + rich(q.w[q.a]) + '</p>'
              : '<p><b>❌ «' + rich(q.o[picked]) + '» — неверно.</b> ' + rich(q.w[picked]) + '</p><p><b>✅ Правильно: «' + rich(q.o[q.a]) + '».</b> ' + rich(q.w[q.a]) + '</p>') +
          '<details><summary>Разбор всех вариантов</summary><ul>' +
          it.ord.map(function (k) { return '<li>' + (k === q.a ? '✅' : '✖️') + ' <b>' + rich(q.o[k]) + '</b> — ' + rich(q.w[k]) + '</li>'; }).join('') +
          '</ul></details></div><button class="ib primary tq-next">' + (i + 1 < list.length ? 'Дальше ›' : 'Результат ›') + '</button>';
      }
      box.innerHTML = h;
      Array.prototype.forEach.call(box.querySelectorAll('.tq-o'), function (b) {
        b.onclick = function () {
          if (picked !== null) return;
          picked = +b.getAttribute('data-k');
          if (picked === q.a) score++; else wrong.push(q);
          draw();
          var w = box.querySelector('.tq-why'); if (w && w.scrollIntoView) try { w.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
        };
      });
      var nx = box.querySelector('.tq-next');
      if (nx) nx.onclick = function () { i++; picked = null; draw(); try { box.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} };
    }
    function finish() {
      var n = list.length, p = Math.round(score / n * 100);
      if (o.key) { var best = store(o.key) || 0; if (p > best) store(o.key, p); }
      var verdict = p === 100 ? 'Отлично, тема усвоена!' : p >= 80 ? 'Хорошо. Перечитай разбор ошибок ниже.' : p >= 50 ? 'Неплохо, но тему стоит повторить.' : 'Стоит вернуться к конспекту и пройти тест ещё раз.';
      var h = head() + '<div class="tq-res"><div class="tq-score">' + score + ' / ' + n + '</div><div>' + p + ' % · ' + verdict + '</div></div>';
      if (wrong.length) {
        h += '<h4 class="tq-h4">Ошибки — и почему так</h4><ol class="tq-err">' + wrong.map(function (q) {
          return '<li><b>' + rich(q.q) + '</b><br>✅ ' + rich(q.o[q.a]) + ' — ' + rich(q.w[q.a]) + '</li>';
        }).join('') + '</ol>';
      }
      h += '<div class="tq-btns"><button class="ib primary" data-a="again">Ещё раз ↺</button>' + (wrong.length ? '<button class="ib" data-a="wrong">Только ошибки</button>' : '') + (o.onBack ? '<button class="ib" data-a="back">' + (o.backLabel || 'К выбору темы') + '</button>' : '') + '</div>';
      box.innerHTML = h;
      var errs = wrong.slice();
      box.querySelector('[data-a=again]').onclick = function () { run(box, shuffle(qs), o); };
      var bw = box.querySelector('[data-a=wrong]'); if (bw) bw.onclick = function () { run(box, errs, o); };
      var bb = box.querySelector('[data-a=back]'); if (bb) bb.onclick = o.onBack;
    }
    draw();
  }

  /* Итоговый тест внутри конспекта */
  function mountSlot(slot, name) {
    var m = /^test-([a-z0-9-]+)__([a-z0-9_-]+)$/.exec(name); if (!m) return;
    slot.classList.remove('wg-slot');
    slot.innerHTML = '<div class="wg-out">Загрузка теста…</div>';
    load('data/tests/' + m[1] + '.json').then(function (d) {
      var tp = (d.topics || []).filter(function (t) { return t.id === m[2]; })[0] || {};
      var qs = d.questions.filter(function (q) { return q.t === m[2]; });
      if (!qs.length) { slot.innerHTML = ''; return; }
      slot.innerHTML = '';
      run(slot, qs, { title: 'Итоговый тест: ' + (tp.title || ''), badge: 'Тест', key: m[1] + '/' + m[2],
        lead: qs.length + ' вопросов. После ответа увидишь, <b>почему</b> выбранный вариант верный или неверный. Больше заданий — в разделе «Тесты» предмета.' });
    }).catch(function () { slot.innerHTML = '<div class="wg-out">Не удалось загрузить тест. Проверь интернет.</div>'; });
  }

  /* Раздел «Тесты»: выбор темы и режима */
  function page(v, it, footer) {
    v.innerHTML = '<div class="page">Загрузка…</div>';
    load(it.src).then(function (d) {
      var topics = (d.topics || []).slice().sort(byDate);
      var tt = {}; topics.forEach(function (t) { tt[t.id] = t.title + (t.date ? ' (' + fmtDate(t.date) + ')' : ''); });
      var one = it.topic && tt[it.topic] ? it.topic : null, sel = one || 'all', mode = one ? 'all' : 'ten';
      function menu() {
        var cnt = function (id) { return d.questions.filter(function (q) { return id === 'all' || q.t === id; }).length; };
        var row = function (id, title, sub) {
          var best = store(d.subject + '/' + (id === 'all' ? '*' : id));
          return '<button class="tq-topic' + (sel === id ? ' on' : '') + '" data-t="' + esc(id) + '"><b>' + esc(title) + '</b><small>' + cnt(id) + ' вопр.' + (sub ? ' · ' + esc(sub) : '') + (best != null ? ' · лучший результат ' + best + ' %' : '') + '</small></button>';
        };
        var best1 = one && store(d.subject + '/' + one);
        v.innerHTML = '<div class="page"><div class="wg tq"><div class="wg-h"><span class="wg-badge">Тест</span><b>' + esc(one ? tt[one] : d.title) + '</b></div>' +
          (one ? '<p class="wg-lead">Тест по конспекту: ' + cnt(one) + ' вопросов' + (best1 != null ? ', твой лучший результат — ' + best1 + ' %' : '') + '. После каждого ответа — объяснение, почему вариант верный или неверный.</p>'
               : '<p class="wg-lead">Выбери тему (темы идут по датам лекций, от старой к новой) и режим. После каждого ответа — объяснение, почему вариант верный или неверный.</p>' +
          '<div class="tq-topics">' + row('all', 'Все темы предмета', '') + topics.map(function (t) { return row(t.id, t.title, t.date ? 'лекция ' + fmtDate(t.date) : 'ранняя тема'); }).join('') + '</div>') +
          '<div class="wg-seg wg-chips" style="margin-top:14px">' +
          '<button class="wg-chip' + (mode === 'ten' ? ' on' : '') + '" data-m="ten">10 случайных</button>' +
          '<button class="wg-chip' + (mode === 'all' ? ' on' : '') + '" data-m="all">Все вопросы</button>' +
          (one ? '' : '<button class="wg-chip' + (mode === 'exam' ? ' on' : '') + '" data-m="exam">Экзамен: 25</button>') + '</div>' +
          '<button class="ib primary" id="tqGo" style="width:100%;margin-top:6px">Начать тест ›</button></div>' + (footer || '') + '</div>';
        Array.prototype.forEach.call(v.querySelectorAll('[data-t]'), function (b) { b.onclick = function () { sel = b.getAttribute('data-t'); menu(); }; });
        Array.prototype.forEach.call(v.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { mode = b.getAttribute('data-m'); menu(); }; });
        v.querySelector('#tqGo').onclick = start;
      }
      function start() {
        var pool = d.questions.filter(function (q) { return sel === 'all' || q.t === sel; });
        var qs = mode === 'all' ? (sel === 'all' ? shuffle(pool) : pool.slice()) : shuffle(pool).slice(0, mode === 'ten' ? 10 : 25);
        v.innerHTML = '<div class="page"><div id="tqBox"></div>' + (footer || '') + '</div>';
        run(v.querySelector('#tqBox'), qs, { title: sel === 'all' ? d.title + ': все темы' : tt[sel], key: d.subject + '/' + (sel === 'all' ? '*' : sel),
          topicTitle: sel === 'all' ? function (t) { return tt[t] || ''; } : null, onBack: menu, backLabel: one ? 'К настройкам теста' : null });
      }
      menu();
    }).catch(function () { v.innerHTML = '<div class="page">Не удалось загрузить тест ' + esc(it.src) + '.</div>'; });
  }

  window.HubTests = { load: load, run: run, mountSlot: mountSlot, page: page };
})();
