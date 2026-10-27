/* 2D-схемы, графики и мини-тесты для конспектов «Теория управления» (лекции 1–4).
   В Markdown: @@graph:tu1-six@@ и т. д. Регистрируются через HubWidgets.register. */
(function () {
  'use strict';
  if (!window.HubWidgets) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, a, txt) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; }
  var COL = { blue: 'var(--accent)', green: 'var(--ok)', gold: 'var(--gold)', red: 'var(--bad)', orange: 'var(--supply)', purple: '#b49cf0', gray: 'var(--muted)' };
  function col(c) { return COL[c] || c || COL.blue; }
  function mk(box, badge, title, lead, inner) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">' + badge + '</span><b>' + title + '</b></div><p class="wg-lead">' + lead + '</p>' + inner;
    return function (s) { return box.querySelector(s); };
  }
  function txt(svg, x, y, s, o) {
    o = o || {}; var lines = String(s).split('\n'), fs = o.fs || 13;
    var t = el('text', { x: x, y: y - (lines.length - 1) * fs * 0.6 + fs * 0.35, 'text-anchor': o.anchor || 'middle', 'font-size': fs, 'font-weight': o.bold ? 700 : 500 });
    if (o.fill) t.setAttribute('style', 'fill:' + o.fill);
    lines.forEach(function (l, i) { var ts = el('tspan', { x: x, dy: i ? fs * 1.2 : 0 }, l); t.appendChild(ts); });
    t.style.pointerEvents = 'none'; svg.appendChild(t); return t;
  }
  function chips(container, list, api) {
    list.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'wg-chip';
      b.innerHTML = '<b>' + c.t + '</b>' + (c.small ? '<small>' + c.small + '</small>' : '');
      b.onclick = function () { Array.prototype.forEach.call(container.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); c.on(api); };
      container.appendChild(b);
    });
  }

  /* ---------- универсальная схема: блоки + стрелки ---------- */
  function diagram(name, o) {
    HubWidgets.register(name, function (box) {
      var q = mk(box, o.badge || 'Схема', o.title, o.lead, '<svg viewBox="0 0 ' + o.W + ' ' + o.H + '"></svg>' + (o.chips ? '<div class="wg-chips" style="margin-top:10px"></div>' : '') + '<div class="wg-out">' + (o.hint || 'Нажми на любой блок.') + '</div>');
      var svg = q('svg'), out = q('.wg-out'), N = {}, R = {};
      var defs = el('defs'); var mkr = el('marker', { id: 'ah-' + name, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
      mkr.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill:var(--muted)' })); defs.appendChild(mkr); svg.appendChild(defs);
      o.nodes.forEach(function (n) { N[n.id] = n; });
      function edge(n, dx, dy) {
        if (n.r) { var L = Math.hypot(dx, dy) || 1; return [n.x + dx / L * n.r, n.y + dy / L * n.r]; }
        var w = (n.w || 100) / 2, h = (n.h || 40) / 2, s = Math.min(dx ? w / Math.abs(dx) : 1e9, dy ? h / Math.abs(dy) : 1e9);
        return [n.x + dx * s, n.y + dy * s];
      }
      (o.links || []).forEach(function (l) {
        var a = N[l[0]], b = N[l[1]], dx = b.x - a.x, dy = b.y - a.y, p = edge(a, dx, dy), r = edge(b, -dx, -dy);
        var ln = el('line', { x1: p[0], y1: p[1], x2: r[0], y2: r[1], 'stroke-width': 2, style: 'stroke:' + (l[3] ? col(l[3]) : 'var(--muted)'), 'marker-end': l[4] === 'none' ? '' : 'url(#ah-' + name + ')' });
        if (l[4] === 'dash') ln.setAttribute('stroke-dasharray', '5 4');
        svg.appendChild(ln);
        if (l[2]) txt(svg, (p[0] + r[0]) / 2 + (l[5] || 0), (p[1] + r[1]) / 2 + (l[6] || -6), l[2], { fs: 11, fill: 'var(--muted)' });
      });
      o.nodes.forEach(function (n) {
        var g = el('g', { style: 'cursor:pointer' }), c = col(n.c);
        var shape = n.r ? el('circle', { cx: n.x, cy: n.y, r: n.r }) : el('rect', { x: n.x - (n.w || 100) / 2, y: n.y - (n.h || 40) / 2, width: n.w || 100, height: n.h || 40, rx: 10 });
        shape.setAttribute('style', 'fill:' + c + ';fill-opacity:.2;stroke:' + c + ';stroke-width:2');
        g.appendChild(shape); svg.appendChild(g);
        R[n.id] = { g: g, s: shape, t: txt(svg, n.x, n.y, n.t, { fs: n.fs || 12, bold: n.bold }) };
        g.addEventListener('click', function () { api.sel(n.id); });
      });
      var api = {
        say: function (h) { out.innerHTML = h; },
        sel: function (id) {
          Object.keys(R).forEach(function (k) { R[k].s.style.strokeWidth = 2; R[k].s.style.fillOpacity = 0.2; });
          if (R[id]) { R[id].s.style.strokeWidth = 4; R[id].s.style.fillOpacity = 0.45; if (N[id].i) out.innerHTML = N[id].i; }
        },
        many: function (ids) {
          Object.keys(R).forEach(function (k) { var on = ids.indexOf(k) >= 0; R[k].s.style.strokeWidth = on ? 4 : 2; R[k].s.style.fillOpacity = on ? 0.45 : 0.08; R[k].t.style.opacity = on ? 1 : 0.45; });
        },
        text: function (id, s) { var n = N[id], old = R[id].t; old.remove(); R[id].t = txt(svg, n.x, n.y, s, { fs: n.fs || 12, bold: n.bold }); },
        reset: function () { Object.keys(R).forEach(function (k) { R[k].s.style.strokeWidth = 2; R[k].s.style.fillOpacity = 0.2; R[k].t.style.opacity = 1; }); }
      };
      if (o.chips) chips(q('.wg-chips'), o.chips, api);
      if (o.extra) o.extra(svg, api);
    });
  }
  function radial(items, cx, cy, r, w, h, c0) {
    return items.map(function (it, i) { var a = -Math.PI / 2 + i / items.length * Math.PI * 2; return { id: it[0], t: it[1], i: it[2], c: it[3] || c0, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, w: w, h: h }; });
  }

  /* ---------- мини-тест ---------- */
  function quiz(name, o) {
    HubWidgets.register(name, function (box) {
      var q = mk(box, 'Проверь себя', o.title, o.lead, '<div class="wg-out" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-res wg-out" style="display:none"></div>');
      var Q = o.q, i = 0, score = 0, done = false, qo = q('.wg-out'), ch = q('.wg-chips'), res = q('.wg-res');
      function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.innerHTML = h; ch.appendChild(b); return b; }
      function draw() {
        ch.innerHTML = '';
        if (i >= Q.length) {
          qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= Q.length * 0.7 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить раздел.');
          res.style.display = 'none';
          var again = btn('<b>Ещё раз ↺</b>'); again.onclick = function () { i = 0; score = 0; done = false; draw(); }; return;
        }
        qo.innerHTML = '<small style="color:var(--muted)">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + Q[i][0];
        (o.opts || Q[i][3]).forEach(function (t, k) {
          var b = btn('<b>' + t + '</b>');
          b.onclick = function () {
            if (done) return; done = true;
            var ok = k === Q[i][1]; if (ok) score++;
            Array.prototype.forEach.call(ch.children, function (x, j) { if (j === Q[i][1]) x.classList.add('on'); else if (j === k) x.classList.add('off'); });
            res.style.display = ''; res.innerHTML = (ok ? '✅ Верно. ' : '❌ Правильно: <b>' + (o.opts || Q[i][3])[Q[i][1]] + '</b>. ') + (Q[i][2] || '');
            var nx = btn('<b>Дальше ›</b>'); nx.onclick = function () { i++; done = false; res.style.display = 'none'; draw(); };
          };
        });
      }
      draw();
    });
  }

  /* ---------- график с осями ---------- */
  function plotBox(name, o) {
    HubWidgets.register(name, function (box) {
      var q = mk(box, 'График', o.title, o.lead, '<svg viewBox="0 0 360 ' + (o.H || 260) + '"></svg>' + (o.slider ? '<div class="wg-ctl"><label><span class="n">' + o.slider.label + '</span><input type="range" min="' + o.slider.min + '" max="' + o.slider.max + '" step="' + (o.slider.step || 1) + '" value="' + o.slider.value + '"><b></b></label></div>' : '') + (o.chips ? '<div class="wg-chips" style="margin-top:10px"></div>' : '') + (o.legend ? '<div class="wg-legend">' + o.legend.map(function (l) { return '<span><i style="background:' + col(l[1]) + '"></i>' + l[0] + '</span>'; }).join('') + '</div>' : '') + '<div class="wg-out"></div>');
      var svg = q('svg'), out = q('.wg-out'), H = o.H || 260, st = { v: o.slider ? +o.slider.value : 0 };
      var F = { L: 44, R: 344, T: 18, B: H - 34 };
      F.X = function (x) { return F.L + (x - o.x[0]) / (o.x[1] - o.x[0]) * (F.R - F.L); };
      F.Y = function (y) { return F.B - (y - o.y[0]) / (o.y[1] - o.y[0]) * (F.B - F.T); };
      function axes() {
        svg.innerHTML = '';
        for (var k = 1; k <= 4; k++) svg.appendChild(el('line', { x1: F.L, x2: F.R, y1: F.T + (F.B - F.T) * k / 5, y2: F.T + (F.B - F.T) * k / 5, 'class': 'wg-grid' }));
        svg.appendChild(el('line', { x1: F.L, y1: F.T, x2: F.L, y2: F.B, 'class': 'wg-ax' }));
        svg.appendChild(el('line', { x1: F.L, y1: F.B, x2: F.R, y2: F.B, 'class': 'wg-ax' }));
        txt(svg, F.R, H - 10, o.xl, { anchor: 'end', fs: 12, fill: 'var(--muted)' });
        txt(svg, F.L + 6, F.T + 2, o.yl, { anchor: 'start', fs: 12, fill: 'var(--muted)' });
      }
      F.path = function (fn, c, w, dash) {
        var d = '', n = 80; for (var k = 0; k <= n; k++) { var x = o.x[0] + (o.x[1] - o.x[0]) * k / n; d += (k ? 'L' : 'M') + F.X(x).toFixed(1) + ',' + F.Y(fn(x)).toFixed(1); }
        var p = el('path', { d: d, fill: 'none', 'stroke-width': w || 3, 'stroke-linecap': 'round', style: 'stroke:' + col(c) }); if (dash) p.setAttribute('stroke-dasharray', dash); svg.appendChild(p); return p;
      };
      F.dot = function (x, y, c, r) { svg.appendChild(el('circle', { cx: F.X(x), cy: F.Y(y), r: r || 6, style: 'fill:' + col(c) + ';stroke:var(--panel);stroke-width:2' })); };
      F.vline = function (x, c, dash) { svg.appendChild(el('line', { x1: F.X(x), x2: F.X(x), y1: F.T, y2: F.B, 'stroke-width': 1.5, 'stroke-dasharray': dash || '4 4', style: 'stroke:' + col(c) })); };
      F.rect = function (x0, y0, x1, y1, c, op) { var r = el('rect', { x: F.X(x0), y: F.Y(y1), width: F.X(x1) - F.X(x0), height: F.Y(y0) - F.Y(y1), rx: 4, style: 'fill:' + col(c) + ';fill-opacity:' + (op == null ? 0.8 : op) }); svg.appendChild(r); return r; };
      F.text = function (x, y, s, opt) { return txt(svg, F.X(x), F.Y(y), s, opt); };
      F.svg = svg; F.el = el;
      function draw() { axes(); var msg = o.draw(F, st); if (msg) out.innerHTML = msg; if (o.slider) q('.wg-ctl b').textContent = (o.slider.fmt ? o.slider.fmt(st.v) : st.v); }
      if (o.slider) q('input').addEventListener('input', function (e) { st.v = +e.target.value; draw(); });
      if (o.chips) chips(q('.wg-chips'), o.chips.map(function (c) { return { t: c.t, small: c.small, on: function () { c.on(st); draw(); } }; }), null);
      draw();
    });
  }

  /* ================= ЛЕКЦИЯ 1 ================= */
  diagram('tu1-six', {
    title: 'Шесть смыслов слова «управление»', lead: 'Одно слово — шесть разных смыслов. Нажми на блок и посмотри пример.', W: 360, H: 330,
    nodes: [{ id: 'c', t: 'Управление', x: 180, y: 165, r: 46, c: 'gold', bold: true, i: 'Одно и то же слово, но шесть разных значений. На зачёте важно назвать все шесть.' }].concat(radial([
      ['p', 'Обыденное\nдействие', '<b>Обыденное управление, процесс.</b> Мама планирует семейный бюджет на месяц.', 'blue'],
      ['r', 'Отношение\nмежду людьми', '<b>Отношение:</b> власть, авторитет, доверие, подчинение. Начальник и сотрудник.', 'green'],
      ['pr', 'Профессия', '<b>Профессиональная деятельность:</b> директор завода, глава администрации.', 'orange'],
      ['d', 'Учебная\nдисциплина', '<b>Учебная дисциплина:</b> вот этот курс «Теория управления».', 'purple'],
      ['s', 'Наука', '<b>Наука управления:</b> учёный изучает, по каким законам работает управление.', 'blue'],
      ['a', 'Искусство', '<b>Искусство:</b> опытный руководитель действует по чутью, и это работает.', 'red']
    ], 180, 165, 122, 106, 42)),
    links: [['c', 'p', '', '', 'none'], ['c', 'r', '', '', 'none'], ['c', 'pr', '', '', 'none'], ['c', 'd', '', '', 'none'], ['c', 's', '', '', 'none'], ['c', 'a', '', '', 'none']]
  });

  diagram('tu1-goals', {
    title: 'Дерево целей', lead: 'Цели делят по трём признакам. Нажми на ветку или на кнопку.', W: 360, H: 350,
    nodes: [
      { id: 'root', t: 'Цели управления', x: 180, y: 26, w: 150, h: 34, c: 'gold', bold: true, i: 'Цели многообразны. Их классифицируют по горизонту, по уровню и по отрасли.' },
      { id: 'h', t: 'по горизонту', x: 62, y: 96, w: 110, h: 32, c: 'blue', i: '<b>По горизонту</b> — на какой срок.' },
      { id: 'l', t: 'по уровню', x: 180, y: 96, w: 110, h: 32, c: 'green', i: '<b>По уровню</b> — для кого: человек, группа, регион, страна, мир.' },
      { id: 'o', t: 'по отрасли', x: 298, y: 96, w: 110, h: 32, c: 'orange', i: '<b>По отрасли</b> — в какой сфере жизни.' },
      { id: 'h1', t: 'стратегические', x: 62, y: 160, w: 110, h: 28, c: 'blue', i: '<b>Стратегическая</b> — на годы: «стать лучшим вузом страны».' },
      { id: 'h2', t: 'тактические', x: 62, y: 196, w: 110, h: 28, c: 'blue', i: '<b>Тактическая</b> — на месяцы: «открыть программу к сентябрю».' },
      { id: 'h3', t: 'оперативные', x: 62, y: 232, w: 110, h: 28, c: 'blue', i: '<b>Оперативная</b> — на дни: «составить расписание к понедельнику».' },
      { id: 'l1', t: 'индивидуальные', x: 180, y: 160, w: 110, h: 28, c: 'green' }, { id: 'l2', t: 'групповые', x: 180, y: 196, w: 110, h: 28, c: 'green' },
      { id: 'l3', t: 'региональные', x: 180, y: 232, w: 110, h: 28, c: 'green' }, { id: 'l4', t: 'национальные', x: 180, y: 268, w: 110, h: 28, c: 'green' }, { id: 'l5', t: 'глобальные', x: 180, y: 304, w: 110, h: 28, c: 'green' },
      { id: 'o1', t: 'политические', x: 298, y: 160, w: 110, h: 28, c: 'orange' }, { id: 'o2', t: 'экономические', x: 298, y: 196, w: 110, h: 28, c: 'orange' },
      { id: 'o3', t: 'экологические', x: 298, y: 232, w: 110, h: 28, c: 'orange' }, { id: 'o4', t: 'социальные', x: 298, y: 268, w: 110, h: 28, c: 'orange' }, { id: 'o5', t: 'культурные', x: 298, y: 304, w: 110, h: 28, c: 'orange' }
    ],
    links: [['root', 'h'], ['root', 'l'], ['root', 'o'], ['h', 'h1'], ['l', 'l1'], ['o', 'o1']],
    chips: [
      { t: 'Горизонт', small: 'срок', on: function (a) { a.many(['root', 'h', 'h1', 'h2', 'h3']); a.say('Стратегические (годы) → тактические (месяцы) → оперативные (дни). Большая цель раскладывается на мелкие.'); } },
      { t: 'Уровень', small: 'для кого', on: function (a) { a.many(['root', 'l', 'l1', 'l2', 'l3', 'l4', 'l5']); a.say('От цели одного человека до глобальной цели человечества (например, климат).'); } },
      { t: 'Отрасль', small: 'сфера', on: function (a) { a.many(['root', 'o', 'o1', 'o2', 'o3', 'o4', 'o5']); a.say('Политические, экономические, экологические, социальные, культурные — и многие другие.'); } }
    ]
  });

  diagram('tu1-methods', {
    title: 'Откуда берутся методы и как ими пользуются', lead: 'Слева — три источника методов. Справа — четыре шага их применения в управлении.', W: 360, H: 300,
    nodes: [
      { id: 'g', t: 'Общенаучные', x: 70, y: 60, w: 120, h: 40, c: 'purple', i: '<b>Общенаучные</b>: индукция, дедукция, анализ, синтез, сравнение.' },
      { id: 'o', t: 'Других наук', x: 70, y: 150, w: 120, h: 40, c: 'purple', i: '<b>Методы других дисциплин</b>: математики, статистики, социологии, экономики, психологии.' },
      { id: 's', t: 'Собственные', x: 70, y: 240, w: 120, h: 40, c: 'purple', i: '<b>Собственные</b> методы науки управления.' },
      { id: 'a', t: '1. Сбор\nинформации', x: 275, y: 42, w: 130, h: 42, c: 'blue', i: '<b>Сбор информации</b>: опросы, статистика, отчёты, наблюдение.' },
      { id: 'b', t: '2. Обработка', x: 275, y: 112, w: 130, h: 36, c: 'blue', i: '<b>Обработка</b>: свести данные в таблицы, посчитать показатели.' },
      { id: 'c', t: '3. Результат', x: 275, y: 182, w: 130, h: 36, c: 'green', i: '<b>Получение результата</b>: вывод, прогноз, вариант решения.' },
      { id: 'd', t: '4. Представление', x: 275, y: 252, w: 130, h: 36, c: 'gold', i: '<b>Представление</b>: доклад, график, презентация для руководителя.' }
    ],
    links: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['g', 'a', '', '', 'dash'], ['o', 'b', '', '', 'dash'], ['s', 'c', '', '', 'dash']],
    hint: 'Требования к научному методу: строгость, однозначность, эффективность, экономичность, способность давать новые результаты.'
  });

  diagram('tu1-fayol14', {
    title: '14 принципов Файоля простыми словами', lead: 'Нажми на принцип — появится объяснение на пальцах.', W: 360, H: 312,
    nodes: [
      ['Разделение труда', 'Каждый делает своё и делает это хорошо.'], ['Власть', 'Право отдавать приказы — и ответственность за них.'], ['Дисциплина', 'Все соблюдают договорённости и правила.'], ['Единство\nраспорядительства', 'У работника <b>один</b> начальник — иначе два противоречивых приказа.'],
      ['Единство\nруководства', 'Одна цель — один план.'], ['Общее выше личного', 'Интересы организации важнее интересов одного человека.'], ['Вознаграждение', 'Справедливая оплата за труд.'], ['Централизация', 'Решить, какие решения принимает центр, а какие — на местах.'],
      ['Скалярная цепь', 'Лестница начальников сверху вниз. Есть «мостик Файоля» для связи по горизонтали.'], ['Порядок', 'Место для каждого и каждый на своём месте.'], ['Справедливость', 'Доброжелательность и равенство в отношении к людям.'], ['Стабильность\nперсонала', 'Текучка вредна: новичку нужно время, чтобы освоиться.'],
      ['Инициатива', 'Дать людям предлагать и делать сами.'], ['Корпоративный дух', '«Мы одна команда».']
    ].map(function (p, i) { return { id: 'p' + i, t: (i + 1) + '. ' + p[0], i: '<b>' + (i + 1) + '. ' + p[0].replace('\n', ' ') + '</b> — ' + p[1], x: i % 2 ? 268 : 92, y: 24 + Math.floor(i / 2) * 44, w: 172, h: 38, c: ['blue', 'green', 'gold', 'orange', 'purple', 'red', 'blue'][Math.floor(i / 2)], fs: 11.5 }; })
  });

  quiz('tu1-quiz', {
    title: 'Фундаментальная или прикладная?', lead: 'Определи, к какой группе лектор относит науку.', opts: ['Фундаментальная', 'Прикладная'],
    q: [['Философия', 0, 'Объясняет самые общие законы.'], ['Бухгалтерский учёт', 1, 'Инструмент для практики.'], ['Кибернетика', 0, 'Методологическая наука об управлении и связи.'], ['Конфликтология', 1, 'Прикладная: как разрешать конфликты.'], ['Теория управления', 0, 'Фундаментальные основы управления.'], ['Исследование операций', 1, 'Прикладная: оптимизация конкретных задач.'], ['Демография', 0, 'На слайде — среди фундаментальных.'], ['Информатика', 1, 'На слайде — среди прикладных.']]
  });

  /* ================= ЛЕКЦИЯ 2 ================= */
  plotBox('tu2-timeline', {
    title: 'Когда работала каждая школа', lead: 'Полосы — годы, когда школа была на пике. Выбери год: подсветятся школы, которые спорили в это время.', H: 300,
    x: [1895, 1975], y: [0, 8.6], xl: 'годы', yl: '',
    chips: [{ t: '1915', on: function (s) { s.v = 1915; } }, { t: '1935', on: function (s) { s.v = 1935; } }, { t: '1955', on: function (s) { s.v = 1955; } }, { t: '1965', on: function (s) { s.v = 1965; } }],
    draw: function (F, st) {
      var S = [['Научный менеджмент', 1900, 1930, 'blue'], ['Административная', 1910, 1940, 'blue'], ['Чел. отношения', 1920, 1960, 'green'], ['Поведенческие', 1950, 1970, 'green'], ['Эмпирическая', 1950, 1960, 'gold'], ['Количественная', 1950, 1960, 'orange'], ['Системный', 1960, 1970, 'purple'], ['Ситуационный', 1960, 1970, 'red']];
      for (var d = 1900; d <= 1970; d += 10) F.text(d, -0.25, String(d), { fs: 10, fill: 'var(--muted)' });
      var on = [];
      S.forEach(function (s, i) {
        var y = 8 - i, act = st.v && st.v >= s[1] && st.v < s[2];
        F.rect(s[1], y - 0.38, s[2], y + 0.38, s[3], st.v ? (act ? 0.9 : 0.2) : 0.75);
        if (s[1] >= 1950) F.text(s[1] - 0.8, y, s[0], { anchor: 'end', fs: 11, bold: act }); else F.text(s[1] + 0.8, y, s[0], { anchor: 'start', fs: 11, bold: act });
        if (act) on.push(s[0]);
      });
      if (st.v) { F.vline(st.v, 'gold', '3 3'); return '<b>' + st.v + ' год:</b> ' + on.join(', ') + '. Школы не сменяют друг друга мгновенно — они живут одновременно и спорят.'; }
      return 'Каждая школа отвечает на вызовы своего времени и «латает дыры» предыдущей.';
    }
  });

  diagram('tu2-xy', {
    title: 'Теория X и теория Y (Макгрегор)', lead: 'Во что руководитель верит о людях, так он ими и управляет — и получает соответствующий результат.', W: 360, H: 250,
    nodes: [
      { id: 'x0', t: 'X: «люди ленивы»', x: 90, y: 40, w: 150, h: 36, c: 'red', i: '<b>Теория X</b>: люди не любят работать и избегают ответственности.' },
      { id: 'x1', t: 'контроль, приказ,\nнаказание', x: 90, y: 125, w: 150, h: 46, c: 'red', i: 'Стиль: жёсткий контроль, кнут и пряник.' },
      { id: 'x2', t: 'делают минимум', x: 90, y: 210, w: 150, h: 36, c: 'red', i: 'Итог: люди работают «от и до» и только под надзором. Пророчество сбывается.' },
      { id: 'y0', t: 'Y: «люди хотят\nработать»', x: 270, y: 40, w: 150, h: 46, c: 'green', i: '<b>Теория Y</b>: работа естественна, если она осмысленна; люди готовы брать ответственность.' },
      { id: 'y1', t: 'доверие, цели,\nучастие', x: 270, y: 125, w: 150, h: 46, c: 'green', i: 'Стиль: делегирование, совместные цели, участие в решениях.' },
      { id: 'y2', t: 'инициатива\nи творчество', x: 270, y: 210, w: 150, h: 46, c: 'green', i: 'Итог: люди сами предлагают улучшения.' }
    ],
    links: [['x0', 'x1'], ['x1', 'x2'], ['y0', 'y1'], ['y1', 'y2']],
    chips: [{ t: 'Теория X', on: function (a) { a.many(['x0', 'x1', 'x2']); a.say('Руководитель X видит в людях лентяев — и своим контролем делает их такими.'); } }, { t: 'Теория Y', on: function (a) { a.many(['y0', 'y1', 'y2']); a.say('Руководитель Y доверяет — и получает инициативу. Это связано с верхними ярусами пирамиды Маслоу.'); } }]
  });

  plotBox('tu2-follett', {
    title: 'Фоллетт: интеграция вместо компромисса', lead: 'По осям — насколько довольна каждая сторона конфликта. Выбери способ решения.', H: 290,
    x: [0, 10], y: [0, 10], xl: 'довольна сторона A →', yl: '↑ довольна сторона B',
    chips: [{ t: '«Власть над»', small: 'победил сильный', on: function (s) { s.v = 1; } }, { t: 'Компромисс', small: 'все уступили', on: function (s) { s.v = 2; } }, { t: 'Интеграция', small: 'выиграли оба', on: function (s) { s.v = 3; } }],
    draw: function (F, st) {
      var P = [[9, 1.5, 'red', 'власть над'], [5, 5, 'gold', 'компромисс'], [9, 9, 'green', 'интеграция']];
      F.path(function (x) { return 10 - x; }, 'gray', 1.5, '4 4');
      P.forEach(function (p, i) { F.dot(p[0], p[1], p[2], st.v === i + 1 ? 10 : 6); F.text(p[0] - 0.2, p[1] + 0.9, p[3], { fs: 11, anchor: 'end', bold: st.v === i + 1 }); });
      return ['Пример Фоллетт: двое в библиотеке, один хочет открыть окно, другой — нет.', '<b>«Власть над»</b>: начальник решил — окно открыто. Один доволен, второй затаил обиду.', '<b>Компромисс</b>: окно приоткрыли наполовину. Каждый что-то потерял.', '<b>Интеграция</b>: открыли окно в соседней комнате — свежий воздух есть, сквозняка нет. Довольны оба. Это «власть вместе» (power with).'][st.v];
    }
  });

  plotBox('tu2-peter', {
    title: 'Принцип Питера', lead: 'Кривая — насколько хорошо сотрудник справляется на каждой ступени. Нажимай «Повысить»: его повышают, пока он хорош.', H: 270,
    x: [0.5, 6.5], y: [0, 10], xl: 'уровень должности →', yl: '↑ компетентность',
    chips: [{ t: 'Повысить ↑', on: function (s) { s.v = Math.min(6, (s.v || 1) + 1); } }, { t: 'Сначала', on: function (s) { s.v = 1; } }],
    draw: function (F, st) {
      var lv = st.v || 1, c = function (x) { return 9.5 - (x - 1) * 1.55; };
      F.rect(0.5, 0, 6.5, 4, 'red', 0.1); F.text(6.3, 3.4, 'зона некомпетентности', { anchor: 'end', fs: 11, fill: 'var(--bad)' });
      F.path(c, 'blue', 3);
      for (var k = 1; k <= 6; k++) F.dot(k, c(k), k === lv ? 'gold' : k < lv ? 'green' : 'gray', k === lv ? 9 : 5);
      var labels = ['', 'рабоч.', 'бригад.', 'мастер', 'цех', 'дир.', 'ген.'];
      for (var j = 1; j <= 6; j++) F.text(j, -0.6, labels[j], { fs: 9.5, fill: 'var(--muted)' });
      if (c(lv) < 4) return 'Ступень ' + lv + ': он уже <b>не справляется</b> — и тут его больше не повышают. Застрял на «уровне некомпетентности». Отсюда интерес Кука к оценке эффективности.';
      return 'Ступень ' + lv + ': справляется хорошо → его повышают дальше.';
    }
  });

  diagram('tu2-emerson', {
    title: '12 принципов эффективности Эмерсона', lead: 'Первые пять — про людей и отношения, остальные семь — про учёт, планы и стандарты. Нажми на принцип.', W: 360, H: 290,
    nodes: [['Чёткие цели', 'Знать, чего хотим.'], ['Здравый смысл', 'Видеть дело целиком.'], ['Компетентная\nконсультация', 'Звать экспертов.'], ['Дисциплина', 'Соблюдать правила.'], ['Честность', 'Справедливость к людям.'], ['Учёт', 'Быстрый, надёжный, постоянный.'], ['Диспетчеризация', 'Расписать, кто что и когда делает — как расписание поездов.'], ['Нормы\nи графики', 'Знать, сколько времени нужно.'], ['Стандартные\nусловия', 'Одинаковые условия работы.'], ['Стандартные\nоперации', 'Один лучший способ.'], ['Письменные\nинструкции', 'Записать стандарт.'], ['Вознаграждение', 'Платить за эффективность.']]
      .map(function (p, i) { return { id: 'e' + i, t: p[0], i: '<b>' + (i + 1) + '. ' + p[0].replace('\n', ' ') + '</b> — ' + p[1], x: 62 + (i % 3) * 118, y: 30 + Math.floor(i / 3) * 70, w: 110, h: 50, c: i < 5 ? 'green' : 'blue', fs: 11.5 }; }),
    hint: 'Эффективность — когда «нужная вещь сделана надлежащим образом подходящим работником в нужном месте в нужное время».'
  });

  quiz('tu2-quiz', {
    title: 'Какая это школа?', lead: 'Прочитай идею и угадай школу управления.',
    opts: ['Научное управление', 'Административная', 'Человеч. отношения', 'Количественная', 'Системный подход', 'Ситуационный'],
    q: [['«Найдём один наилучший способ выполнить операцию»', 0, 'Тейлор: one best way.'], ['«Управлять — значит предвидеть, организовывать, распоряжаться, координировать, контролировать»', 1, 'Файоль.'], ['«Выработка выросла, потому что на рабочих обратили внимание»', 2, 'Хоторнский эксперимент, Мейо.'], ['«Построим математическую модель запасов и найдём оптимум»', 3, 'Исследование операций.'], ['«Организация — открытая система взаимосвязанных частей»', 4, 'Берталанфи, Винер.'], ['«Всё зависит от обстоятельств»', 5, 'Моклер, Фидлер, Лоуренс и Лорш.'], ['«Сделаем диаграмму: какие работы идут параллельно»', 0, 'Гант — соратник Тейлора.'], ['«Механистическая структура хороша в стабильной среде, органическая — в бурной»', 5, 'Бёрнс и Сталкер.']]
  });

  /* ================= ЛЕКЦИЯ 3 ================= */
  plotBox('tu3-ermansky', {
    title: 'Физиологический оптимум Ерманского', lead: 'Условная модель. Двигай темп работы. Синяя линия — выработка за один день, зелёная — за месяц, с учётом усталости.', H: 270,
    x: [0, 100], y: [0, 100], xl: 'темп работы, % от предела', yl: '↑ выработка',
    slider: { label: 'Темп', min: 10, max: 100, value: 95, fmt: function (v) { return v + ' %'; } },
    draw: function (F, st) {
      var day = function (x) { return x * 0.95; }, month = function (x) { return 100 * Math.exp(-Math.pow((x - 68) / 32, 2)) * 0.9; };
      F.path(day, 'blue', 2.5, '6 4'); F.path(month, 'green', 3.5);
      F.vline(68, 'green'); F.text(68, 95, 'оптимум', { fs: 11, fill: 'var(--ok)' });
      F.dot(st.v, month(st.v), 'gold', 8);
      F.text(98, day(98) - 6, 'за день', { anchor: 'end', fs: 11, fill: 'var(--accent)' });
      if (st.v > 85) return '<b>Темп ' + st.v + ' %</b> — подход «выжать максимум сегодня». За день много, но через месяц рабочий выдохся: итог всего <b>' + Math.round(month(st.v)) + '</b>.';
      if (st.v < 50) return 'Слишком медленно: здоровью не вредно, но выработка мала — <b>' + Math.round(month(st.v)) + '</b>.';
      return '<b>Около оптимума:</b> наибольшая выработка <b>без вреда здоровью</b> — ' + Math.round(month(st.v)) + '. Это и есть физиологический оптимум.';
    },
    legend: [['за один день', 'blue'], ['за месяц', 'green']]
  });

  plotBox('tu3-lenin', {
    title: 'Как Ленин менял мнение о системе Тейлора', lead: 'Шкала от «против» до «за». Нажми на год.', H: 200,
    x: [0, 10], y: [0, 4], xl: '', yl: '',
    chips: [{ t: '1913', on: function (s) { s.v = 1; } }, { t: '1914', on: function (s) { s.v = 2; } }, { t: '1918', on: function (s) { s.v = 3; } }],
    draw: function (F, st) {
      F.rect(0.3, 1.7, 3.6, 2.3, 'red', 0.5); F.rect(3.6, 1.7, 6.6, 2.3, 'gold', 0.5); F.rect(6.6, 1.7, 9.7, 2.3, 'green', 0.5);
      F.text(1.9, 3.2, 'против', { fs: 13, bold: true }); F.text(5.1, 3.2, 'против, но…', { fs: 13, bold: true }); F.text(8.2, 3.2, 'за', { fs: 13, bold: true });
      var pos = [0, 1.5, 5, 8.6], P = [['1913', 1.5], ['1914', 5], ['1918', 8.6]];
      P.forEach(function (p, i) { F.dot(p[1], 2, st.v === i + 1 ? 'blue' : 'gray', st.v === i + 1 ? 11 : 5); F.text(p[1], 0.9, p[0], { fs: 12 }); });
      return ['Пока Ленин в оппозиции — Тейлор враг; у власти — союзник. Инструмент тот же, цель другая.', '<b>1913</b>, «"Научная" система выжимания пота»: прогресс техники при капитализме — «прогресс в искусстве выжимать пот».', '<b>1914</b>, «Система Тейлора — порабощение человека машиной»: против, но система «подготовляет время», когда пролетариат сам организует труд.', '<b>1918</b>, «Очередные задачи советской власти»: лучшие системы капитализма «должны быть приняты» — для учёта, контроля и роста производительности.'][st.v || 0];
    }
  });

  HubWidgets.register('tu3-hronokarta', function (box) {
    var q = mk(box, 'График', 'Хронокарта Лиги «Время»', 'Пример: так член лиги записывал, на что ушли 24 часа. Сравни день без учёта времени и после «борьбы за время».', '<svg viewBox="0 0 360 230"></svg><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out"></div>');
    var svg = q('svg'), out = q('.wg-out');
    var cats = [['Сон', 'purple'], ['Работа', 'blue'], ['Дорога', 'gray'], ['Заседания', 'red'], ['Учёба', 'green'], ['Потеряно', 'orange']];
    var D = [[8, 7, 2, 3, 0.5, 3.5], [8, 8, 1.5, 1, 3, 2.5]];
    function draw(k) {
      svg.innerHTML = ''; var a0 = -Math.PI / 2, cx = 110, cy = 115, R = 92, r = 50;
      D[k].forEach(function (h, i) {
        var a1 = a0 + h / 24 * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
        var p = 'M' + (cx + R * Math.cos(a0)) + ',' + (cy + R * Math.sin(a0)) + ' A' + R + ',' + R + ' 0 ' + big + ' 1 ' + (cx + R * Math.cos(a1)) + ',' + (cy + R * Math.sin(a1)) + ' L' + (cx + r * Math.cos(a1)) + ',' + (cy + r * Math.sin(a1)) + ' A' + r + ',' + r + ' 0 ' + big + ' 0 ' + (cx + r * Math.cos(a0)) + ',' + (cy + r * Math.sin(a0)) + ' Z';
        svg.appendChild(el('path', { d: p, style: 'fill:' + col(cats[i][1]) + ';stroke:var(--panel);stroke-width:2' }));
        a0 = a1;
        svg.appendChild(el('rect', { x: 220, y: 22 + i * 32, width: 14, height: 14, rx: 3, style: 'fill:' + col(cats[i][1]) }));
        txt(svg, 240, 29 + i * 32, cats[i][0] + ' — ' + String(h).replace('.', ',') + ' ч', { anchor: 'start', fs: 11 });
      });
      txt(svg, cx, cy, '24 ч', { fs: 16, bold: true });
      out.innerHTML = k ? 'После учёта: заседания сократили с 3 до 1 часа, потери — с 3,5 до 2,5. Освободилось время на учёбу. Это ранний <b>тайм-менеджмент</b> Керженцева («Организуй самого себя», 1925).' : 'Без учёта: 3 часа затянутых заседаний и 3,5 часа «неизвестно куда». Хронокарта делает потери видимыми.';
    }
    chips(q('.wg-chips'), [{ t: 'До', small: 'без учёта', on: function () { draw(0); } }, { t: 'После', small: 'с хронокартой', on: function () { draw(1); } }]);
    draw(0);
  });

  diagram('tu3-platforms', {
    title: 'Спор 1924 года: сверху или снизу?', lead: 'Слева — «Платформа 17-ти» (Керженцев): от общих законов и госаппарата вниз. Справа — «Группа 4-х» (Гастев): от рабочего места вверх.', W: 360, H: 320,
    nodes: [
      { id: 'k', t: 'Керженцев', x: 70, y: 28, w: 110, h: 32, c: 'blue', bold: true, i: '<b>«Платформа 17-ти»</b>: Керженцев, Бурдянский, Рудаков. Нужны широкие теоретические обобщения и порядок в госуправлении.' },
      { id: 'g', t: 'Гастев', x: 300, y: 300, w: 110, h: 32, c: 'orange', bold: true, i: '<b>«Группа 4-х»</b> (ЦИТ): главное — практическая рационализация рабочих мест, «узкая база».' },
      { id: 's', t: 'Государство', x: 180, y: 60, w: 130, h: 34, c: 'purple', i: 'Госаппарат: делопроизводство, отчётность.' },
      { id: 'o', t: 'Отрасль', x: 180, y: 125, w: 130, h: 34, c: 'purple', i: 'Отрасль народного хозяйства.' },
      { id: 'f', t: 'Завод', x: 180, y: 190, w: 130, h: 34, c: 'purple', i: 'Предприятие.' },
      { id: 'w', t: 'Рабочее место', x: 180, y: 255, w: 130, h: 34, c: 'purple', i: 'Одна операция одного рабочего.' }
    ],
    links: [['s', 'o', '', 'blue'], ['o', 'f', '', 'blue'], ['f', 'w', '', 'blue'], ['k', 's', '', 'blue']],
    extra: function (svg) {
      [[255, 238, 255, 145]].forEach(function (p) { svg.appendChild(el('line', { x1: p[0], y1: p[1], x2: p[2], y2: p[3], 'stroke-width': 3, style: 'stroke:var(--supply)', 'stroke-dasharray': '6 4' })); });
      txt(svg, 300, 190, 'снизу\nвверх', { fs: 11, fill: 'var(--supply)' }); txt(svg, 62, 160, 'сверху\nвниз', { fs: 11, fill: 'var(--accent)' });
      svg.appendChild(el('line', { x1: 105, y1: 70, x2: 105, y2: 245, 'stroke-width': 3, style: 'stroke:var(--accent)', 'stroke-dasharray': '6 4' }));
    }
  });

  plotBox('tu3-mgu', {
    title: 'МГУ: как росла наука управления', lead: 'Точки — события на шкале времени. Выбери период.', H: 240,
    x: [1938, 2010], y: [0, 6], xl: 'годы', yl: '',
    chips: [{ t: '1941–1958', small: 'экономфак', on: function (s) { s.v = 1; } }, { t: '1960–1970', small: 'математика и управление', on: function (s) { s.v = 2; } }, { t: '1994–2006', small: 'госуправление', on: function (s) { s.v = 3; } }],
    draw: function (F, st) {
      if (!st.v) st.v = 1;
      var E = [[1941, 'экономфак', 1], [1946, 'статистика', 1], [1949, 'учёт', 1], [1954, 'экон. промышл.', 1], [1962, 'мат. методы (Немчинов)', 2], [1963, 'планирование (Берри)', 2], [1965, 'лаборатория управления', 2], [1968, 'экон. кибернетика', 2], [1970, 'методы управления', 2], [1994, 'ИГУиСИ', 3], [2000, 'ФГУ', 3], [2001, 'Высшая школа бизнеса', 3], [2005, 'ВШГА', 3]];
      F.path(function () { return 3; }, 'gray', 2);
      E.forEach(function (e, i) { var on = st.v === e[2]; F.dot(e[0], 3, on ? ['', 'blue', 'green', 'gold'][e[2]] : 'gray', on ? 7 : 4); if (on) F.text(e[0], [4.3, 1.7, 5.3, 0.7][i % 4], String(e[0]), { fs: 10.5, bold: true }); });
      for (var d = 1940; d <= 2010; d += 10) F.text(d, 0.3, String(d), { fs: 10, fill: 'var(--muted)' });
      return ['Выбери период кнопкой.', '<b>1941</b> — экономический факультет; <b>1946</b> — статистика; <b>1949</b> — учёт и анализ; <b>1954</b> — экономика промышленности и сельского хозяйства.', '<b>1962</b> — математические методы (Немчинов); <b>1963</b> — планирование (Берри); <b>1965</b> — лаборатория проблем управления; <b>1968</b> — экономическая кибернетика; <b>1970</b> — кафедра организации и методов управления.', '<b>1994</b> — ИГУиСИ; <b>2000 — факультет государственного управления</b>; <b>2001</b> — Высшая школа бизнеса; <b>2005</b> — Высшая школа госадминистрирования.'][st.v || 0];
    }
  });

  quiz('tu3-quiz', {
    title: 'Кто это?', lead: 'Угадай учёного по его вкладу.',
    opts: ['Гастев', 'Керженцев', 'Ерманский', 'Дунаевский', 'Богданов', 'Канторович'],
    q: [['Создал ЦИТ — первый в мире институт труда', 0], ['Ввёл термин «НОТ» и принцип физиологического оптимума', 2], ['Написал «Принципы организации» (1921) — первый учебник', 1], ['Идея административной ёмкости руководителя', 3], ['«Тектология» — всеобщая организационная наука', 4], ['Линейное программирование, Нобелевская премия 1975', 5], ['Руководил Лигой «Время»', 1], ['Концепция трудовых установок и «узкой базы»', 0]]
  });

  /* ================= ЛЕКЦИЯ 4 ================= */
  diagram('tu4-components', {
    title: '8 компонентов управляющей подсистемы', lead: 'Это «мозг» организации. Нажми на компонент — увидишь, что он делает.', W: 360, H: 350,
    nodes: [{ id: 'c', t: 'Управляющая\nподсистема', x: 180, y: 175, r: 52, c: 'gold', bold: true, i: 'Совокупность всех элементов, осуществляющих управление в организации.' }].concat(radial([
      ['1', '1. Стратегия', 'Миссия, приоритеты, стратегические цели; пути — задачи, проекты, политика.', 'blue'],
      ['2', '2. Анализ среды,\nпрогноз', 'Внешняя и внутренняя среда, риски, сценарии развития.', 'blue'],
      ['3', '3. Планы\nи программы', 'Стратегические, тактические, операционные планы; программы — проекты, ресурсы, сроки.', 'green'],
      ['4', '4. Решения', 'Анализ альтернатив, выбор по критериям эффективности, безопасности, бюджета.', 'green'],
      ['5', '5. Организация', 'Оргструктура, делегирование, регламенты, координация.', 'orange'],
      ['6', '6. Контроль', 'Индикаторы, сравнение факта с планом, корректирующие воздействия.', 'red'],
      ['7', '7. Мотивация', 'Поощрения, ответственность, оргкультура и ценности.', 'purple'],
      ['8', '8. Коммуникации', 'Каналы связи, информационные системы, обратная связь, агрегирование данных.', 'purple']
    ], 180, 175, 118, 92, 40)),
    links: [['c', '1', '', '', 'none'], ['c', '2', '', '', 'none'], ['c', '3', '', '', 'none'], ['c', '4', '', '', 'none'], ['c', '5', '', '', 'none'], ['c', '6', '', '', 'none'], ['c', '7', '', '', 'none'], ['c', '8', '', '', 'none']]
  });

  diagram('tu4-orgtypes', {
    title: 'Коммерческая и некоммерческая организация', lead: 'Устройство одинаковое: цель и ресурсы на входе, продукция на выходе. Разница — в цели и в том, что выходит. Переключай.', W: 360, H: 230,
    nodes: [
      { id: 'g', t: 'Цель:\nприбыль', x: 70, y: 50, w: 120, h: 46, c: 'gold', i: 'Цель задаёт, ради чего работает организация.' },
      { id: 'r', t: 'Ресурсы', x: 70, y: 160, w: 120, h: 40, c: 'orange', i: 'Ресурсы — одинаковые для обоих типов.' },
      { id: 'org', t: 'Организация', x: 200, y: 105, w: 100, h: 60, c: 'blue', bold: true, i: 'Организация как система.' },
      { id: 'out', t: 'Продукция,\nуслуги', x: 310, y: 105, w: 86, h: 60, c: 'green', i: 'Выход системы.', fs: 10.5 }
    ],
    links: [['g', 'org'], ['r', 'org'], ['org', 'out']],
    extra: function (svg) { svg.appendChild(el('rect', { x: 4, y: 4, width: 352, height: 222, rx: 16, fill: 'none', 'stroke-dasharray': '6 5', style: 'stroke:var(--muted)' })); txt(svg, 180, 214, 'внешняя среда', { fs: 11, fill: 'var(--muted)' }); },
    chips: [
      { t: 'Коммерческая', small: 'предприятие', on: function (a) { a.text('g', 'Цель:\nприбыль'); a.text('out', 'Продукция,\nуслуги'); a.reset(); a.say('<b>Предприятие</b>: цель — получение прибыли.'); } },
      { t: 'Некоммерческая', small: 'в т. ч. госучреждение', on: function (a) { a.text('g', 'Цель:\nот учредителей'); a.text('out', '+ обществ.\nблага'); a.reset(); a.sel('out'); a.say('<b>НКО и госучреждения</b>: цели устанавливают учредители, а на выходе ещё и <b>общественные блага</b> — освещение, безопасность, чистый воздух.'); } }
    ]
  });

  plotBox('tu4-detail', {
    title: 'Сколько деталей нужно модели', lead: 'Двигай ползунок: от «пары стрелок» до «карты 1:1». Польза модели сначала растёт, потом падает.', H: 270,
    x: [0, 10], y: [0, 11], xl: 'детальность модели →', yl: '↑ польза',
    slider: { label: 'Детальность', min: 0, max: 10, step: 0.5, value: 1 },
    draw: function (F, st) {
      var u = function (x) { return 9.3 * Math.exp(-Math.pow((x - 5) / 2.6, 2)); };
      F.rect(0, 0, 2.5, 10, 'orange', 0.12); F.rect(7.5, 0, 10, 10, 'red', 0.12); F.rect(2.5, 0, 7.5, 10, 'green', 0.1);
      F.text(1.25, 1.2, 'переупро-\nщение', { fs: 10.5 }); F.text(5, 10.3, 'в самый раз', { fs: 10.5 }); F.text(8.75, 1.2, 'усложне-\nние', { fs: 10.5 });
      F.path(u, 'blue', 3.5); F.dot(st.v, u(st.v), 'gold', 8);
      if (st.v < 2.5) return '<b>Переупрощение</b>: система сведена к паре стрелок, важные связи выброшены. Как карта с одной точкой «город».';
      if (st.v > 7.5) return '<b>Чрезмерное усложнение</b>: нагромождение схем и зависимостей. Как карта в масштабе 1:1 — размером с город.';
      return '<b>Хорошая модель</b>: ровно столько деталей, сколько требует задача.';
    }
  });

  diagram('tu4-limits', {
    title: 'Ограничения системного подхода', lead: 'Слева — трудности самого метода, справа — то, что ломают люди и ведомства. Нажми на блок.', W: 360, H: 300,
    nodes: [
      { id: 'a', t: 'МЕТОД', x: 90, y: 22, w: 150, h: 30, c: 'blue', bold: true, i: 'Трудности, которые есть у метода даже при идеальных людях.' },
      { id: 'b', t: 'ЛЮДИ И ВЕДОМСТВА', x: 270, y: 22, w: 160, h: 30, c: 'red', bold: true, i: 'Ограничения, которые создают сами участники системы.' },
      { id: 'a1', t: 'сложно анализировать\nбольшие системы', x: 90, y: 76, w: 160, h: 40, c: 'blue' },
      { id: 'a2', t: 'чрезмерная\nабстракция', x: 90, y: 126, w: 160, h: 40, c: 'blue', i: 'Значимые явления могут быть упущены.' },
      { id: 'a3', t: 'трудно моделировать\nи измерять', x: 90, y: 176, w: 160, h: 40, c: 'blue' },
      { id: 'a4', t: 'неопределённость', x: 90, y: 226, w: 160, h: 34, c: 'blue' },
      { id: 'a5', t: 'нужны время, кадры,\nденьги на данные', x: 90, y: 274, w: 160, h: 40, c: 'blue' },
      { id: 'b1', t: 'изоляция\nподразделений', x: 270, y: 76, w: 160, h: 40, c: 'red', i: 'Ведомства не делятся информацией — целостность разрушается.' },
      { id: 'b2', t: 'конфликт целей\nподсистем', x: 270, y: 126, w: 160, h: 40, c: 'red' },
      { id: 'b3', t: 'фрагментарное\nмышление', x: 270, y: 176, w: 160, h: 40, c: 'red', i: 'Каждый видит только свой участок и не думает о соседях и общей цели.' },
      { id: 'b4', t: 'игнорируют\nобратную связь', x: 270, y: 226, w: 160, h: 40, c: 'red', i: 'Не слушают жалобы граждан и плохие новости — решения становятся неадекватными.' }
    ]
  });

  quiz('tu4-quiz', {
    title: 'Какая это характеристика системы?', lead: 'Прочитай пример и выбери характеристику.',
    opts: ['Целостность', 'Структурированность', 'Динамичность', 'Открытость', 'Синергия'],
    q: [['Вуз получает абитуриентов и выпускает специалистов', 3, 'Обмен со средой.'], ['Двое несут бревно, которое по одиночке не поднять', 4, 'Целое больше суммы частей.'], ['Компания перестроила работу, когда началась пандемия', 2, 'Адаптация к среде.'], ['В больнице есть приёмное, хирургия, бухгалтерия — у каждой своя функция', 1, 'Подсистемы с функциями.'], ['Оркестр звучит как одно целое, хотя музыкантов сорок', 0, 'Единое функционирование.'], ['Завод покупает сырьё и продаёт продукцию', 3], ['Команда, в которой все тянут в одну сторону, делает больше, чем те же люди по отдельности', 4]]
  });
})();
