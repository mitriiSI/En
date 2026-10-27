/* Интерактивные блоки для конспектов.
   В тексте конспекта (Markdown) пишется отдельной строкой:
     @@graph:budget@@   @@graph:marginal@@   @@graph:supplydemand@@   @@graph:externality@@
   и на этом месте появляется живой график. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, txt) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; return e; }
  function v(name) { return 'var(' + name + ')'; }
  function rub(x) { return x.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽'; }

  function frame(svg, W, H, L, R, T, B, xmax, ymax, xl, yl) {
    svg.innerHTML = '';
    var pw = W - L - R, ph = H - T - B;
    var X = function (n) { return L + n / xmax * pw; }, Y = function (n) { return T + ph - n / ymax * ph; };
    for (var i = 1; i <= 4; i++) svg.appendChild(el('line', { x1: L, x2: W - R, y1: T + ph * i / 5, y2: T + ph * i / 5, 'class': 'wg-grid' }));
    svg.appendChild(el('line', { x1: L, y1: T, x2: L, y2: T + ph, 'class': 'wg-ax' }));
    svg.appendChild(el('line', { x1: L, y1: T + ph, x2: W - R, y2: T + ph, 'class': 'wg-ax' }));
    svg.appendChild(el('text', { x: W - R, y: H - 8, 'text-anchor': 'end' }, xl));
    svg.appendChild(el('text', { x: L + 6, y: T + 12 }, yl));
    return { X: X, Y: Y, L: L, R: W - R, T: T, B: T + ph };
  }
  function line(svg, x1, y1, x2, y2, color, w, dash, op) {
    var a = { x1: x1, y1: y1, x2: x2, y2: y2, stroke: v(color), 'stroke-width': w || 3, 'stroke-linecap': 'round' };
    if (dash) a['stroke-dasharray'] = dash;
    if (op) a.opacity = op;
    svg.appendChild(el('line', a));
  }
  function dot(svg, x, y, r, color) { svg.appendChild(el('circle', { cx: x, cy: y, r: r, fill: v(color), stroke: v('--panel'), 'stroke-width': 2 })); }
  function shell(box, title, lead, extra) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Интерактив</span><b>' + title + '</b></div><p class="wg-lead">' + lead + '</p>' + extra;
    return function (s) { return box.querySelector(s); };
  }

  /* ---------- бюджет и выбор ---------- */
  function budget(box) {
    var BUDGET = 50000;
    var spend = [{ n: 'Продукты', v: 30000, i: '🛒' }, { n: 'Интернет и связь', v: 20000, i: '🌐' }, { n: 'Кино и отдых', v: 25000, i: '🎬' }];
    var chosen = {};
    var q = shell(box, 'Ограниченность и выбор', 'У семьи 50 000 ₽ в месяц. Нажимай на траты: бюджет не резиновый, каждый выбор — это отказ от альтернативы.',
      '<div class="wg-chips"></div><div class="wg-meter"><i></i></div><div class="wg-out"></div>');
    function draw() {
      var total = 0, chips = q('.wg-chips');
      spend.forEach(function (s, k) { if (chosen[k]) total += s.v; });
      chips.innerHTML = '';
      spend.forEach(function (s, k) {
        var b = document.createElement('button');
        var over = !chosen[k] && total + s.v > BUDGET;
        b.className = 'wg-chip' + (chosen[k] ? ' on' : '') + (over ? ' off' : '');
        b.innerHTML = '<span style="font-size:24px">' + s.i + '</span><br><b>' + s.n + '</b><small>' + rub(s.v) + '</small>';
        b.onclick = function () { chosen[k] = !chosen[k]; draw(); };
        chips.appendChild(b);
      });
      var m = q('.wg-meter'); m.classList.toggle('over', total > BUDGET);
      m.firstChild.style.width = Math.min(100, total / BUDGET * 100) + '%';
      var left = BUDGET - total, skipped = spend.filter(function (s, k) { return !chosen[k]; }).map(function (s) { return s.n; });
      var msg = 'Потрачено <b>' + rub(total) + '</b> из ' + rub(BUDGET) + '. ';
      if (total > BUDGET) msg += 'Не хватает <b>' + rub(-left) + '</b>. Придётся от чего-то отказаться.';
      else {
        msg += 'Осталось <b>' + rub(left) + '</b>.';
        if (skipped.length) msg += ' Альтернативные издержки: вы отказались от «' + skipped.join('», «') + '».';
      }
      q('.wg-out').innerHTML = msg;
    }
    draw();
  }

  /* ---------- предельная полезность ---------- */
  function marginal(box) {
    var MU = [10, 6, 3, 1, 0, -2];
    var q = shell(box, 'Предельная полезность', 'Сколько бутербродов съесть? Каждый следующий приносит всё меньше дополнительной пользы. Двигай ползунки.',
      '<svg viewBox="0 0 640 340"></svg>' +
      '<div class="wg-legend"><span><i style="background:var(--demand)"></i>предельная полезность</span><span><i style="background:var(--gold)"></i>общая полезность</span><span><i style="background:var(--bad)"></i>цена</span></div>' +
      '<div class="wg-ctl"><label><span class="n">Съедено бутербродов</span><input class="a" type="range" min="1" max="6" value="3"><b class="av"></b></label>' +
      '<label><span class="n">Цена (в «единицах пользы»)</span><input class="b" type="range" min="0" max="12" value="4"><b class="bv"></b></label></div><div class="wg-out"></div>');
    function draw() {
      var n = +q('.a').value, price = +q('.b').value;
      q('.av').textContent = n; q('.bv').textContent = price;
      var svg = q('svg'), f = frame(svg, 640, 340, 50, 16, 20, 40, 6.6, 12, 'бутерброды', 'польза');
      var bw = (f.R - f.L) / 6.6 * 0.6, total = 0, pts = [], i, run = 0;
      for (i = 0; i < 6; i++) {
        var cx = f.X(i + 0.5), val = MU[i], active = i < n, top = f.Y(Math.max(val, 0)), bs = f.Y(0);
        svg.appendChild(el('rect', { x: cx - bw / 2, y: top, width: bw, height: Math.max(2, bs - top), rx: 6, fill: v('--demand'), opacity: active ? 1 : 0.22 }));
        svg.appendChild(el('text', { x: cx, y: top - 6, 'text-anchor': 'middle' }, String(val)));
        svg.appendChild(el('text', { x: cx, y: f.B + 18, 'text-anchor': 'middle' }, '№' + (i + 1)));
        if (active) total += val;
      }
      for (i = 0; i < 6; i++) { run += MU[i]; pts.push([f.X(i + 0.5), f.Y(Math.max(0, Math.min(12, run)))]); }
      svg.appendChild(el('path', { d: pts.map(function (p, k) { return (k ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' '), fill: 'none', stroke: v('--gold'), 'stroke-width': 3, 'stroke-linejoin': 'round' }));
      pts.forEach(function (p, k) { if (k < n) dot(svg, p[0], p[1], 5, '--gold'); });
      line(svg, f.L, f.Y(price), f.R, f.Y(price), '--bad', 2.5, '7 6');
      var opt = 0; for (i = 0; i < 6; i++) { if (MU[i] >= price && MU[i] > 0) opt = i + 1; else break; }
      var last = MU[n - 1];
      var msg = 'Последний съеденный бутерброд дал <b>' + last + '</b> (это и есть предельная полезность). Общая полезность: <b>' + total + '</b>. ';
      msg += last > price ? 'Он стоил меньше пользы: есть смысл взять ещё.' : last === price ? 'Польза равна цене: это граница.' : 'Он не окупается: полезность меньше цены.';
      msg += '<br>Рациональный потребитель при цене ' + price + ' остановится на <b>' + opt + '</b> шт.';
      q('.wg-out').innerHTML = msg;
    }
    q('.a').addEventListener('input', draw); q('.b').addEventListener('input', draw); draw();
  }

  /* ---------- спрос и предложение ---------- */
  function supplydemand(box) {
    var q = shell(box, 'Спрос, предложение и «невидимая рука»', 'Рынок сам находит равновесную цену. Сдвигай спрос и предложение и смотри, как перемещается точка равновесия.',
      '<svg viewBox="0 0 640 340"></svg>' +
      '<div class="wg-legend"><span><i style="background:var(--demand)"></i>спрос D</span><span><i style="background:var(--supply)"></i>предложение S</span></div>' +
      '<div class="wg-ctl"><label><span class="n">Спрос (желание купить)</span><input class="a" type="range" min="-30" max="30" value="0"><b class="av"></b></label>' +
      '<label><span class="n">Предложение (издержки)</span><input class="b" type="range" min="-30" max="30" value="0"><b class="bv"></b></label></div><div class="wg-out"></div>');
    function draw() {
      var d = +q('.a').value, s = +q('.b').value;
      q('.av').textContent = (d > 0 ? '+' : '') + d; q('.bv').textContent = (s > 0 ? '+' : '') + s;
      var svg = q('svg'), f = frame(svg, 640, 340, 50, 16, 20, 40, 100, 160, 'количество', 'цена');
      var Dp = function (x) { return 100 + d - x; }, Sp = function (x) { return 20 + s + x; };
      line(svg, f.X(0), f.Y(100), f.X(100), f.Y(0), '--demand', 2, '4 6', 0.35);
      line(svg, f.X(0), f.Y(20), f.X(100), f.Y(120), '--supply', 2, '4 6', 0.35);
      line(svg, f.X(0), f.Y(Dp(0)), f.X(100), f.Y(Dp(100)), '--demand', 3.5);
      line(svg, f.X(0), f.Y(Sp(0)), f.X(100), f.Y(Sp(100)), '--supply', 3.5);
      var qe = (80 + d - s) / 2, p = Dp(qe);
      line(svg, f.X(qe), f.Y(p), f.X(qe), f.B, '--ink', 1.5, '4 4'); line(svg, f.L, f.Y(p), f.X(qe), f.Y(p), '--ink', 1.5, '4 4');
      dot(svg, f.X(qe), f.Y(p), 8, '--gold');
      svg.appendChild(el('text', { x: f.X(qe) + 12, y: f.Y(p) - 10 }, 'равновесие'));
      svg.appendChild(el('text', { x: f.X(88), y: f.Y(Dp(88)) - 8, fill: v('--demand') }, 'D'));
      svg.appendChild(el('text', { x: f.X(88), y: f.Y(Sp(88)) - 8, fill: v('--supply') }, 'S'));
      var msg = 'Равновесие: цена <b>' + p.toFixed(0) + '</b>, количество <b>' + qe.toFixed(0) + '</b>. ';
      if (d > 0 && s === 0) msg += 'Спрос вырос: цена и количество растут.';
      else if (d < 0 && s === 0) msg += 'Спрос упал: цена и количество падают.';
      else if (s > 0 && d === 0) msg += 'Предложение сократилось (издержки выросли): цена растёт, количество падает.';
      else if (s < 0 && d === 0) msg += 'Предложение выросло: цена падает, количество растёт.';
      else if (d || s) msg += 'Рынок снова пришёл к балансу без чьих-либо указаний: это и есть «невидимая рука» Смита.';
      q('.wg-out').innerHTML = msg;
    }
    q('.a').addEventListener('input', draw); q('.b').addEventListener('input', draw); draw();
  }

  /* ---------- внешние эффекты ---------- */
  function externality(box) {
    var q = shell(box, 'Внешние эффекты (экстерналии)', 'Двигай ползунок: вправо — внешний ущерб (завод и река), влево — внешняя польза (пасека у сада).',
      '<svg viewBox="0 0 640 340"></svg>' +
      '<div class="wg-legend"><span><i style="background:var(--demand)"></i>спрос</span><span><i style="background:var(--supply)"></i>частные издержки</span><span><i style="background:var(--gold)"></i>общественная кривая</span><span><i style="background:var(--bad)"></i>потери общества</span></div>' +
      '<div class="wg-ctl"><label><span class="n">Внешний эффект</span><input class="a" type="range" min="-30" max="40" value="20"><b class="av"></b></label></div><div class="wg-out"></div>');
    function draw() {
      var e = +q('.a').value;
      q('.av').textContent = (e > 0 ? '+' : '') + e;
      var svg = q('svg'), f = frame(svg, 640, 340, 50, 16, 20, 40, 100, 160, 'количество', 'цена');
      var cost = Math.max(e, 0), ben = Math.max(-e, 0), qm = 40, qs = (80 - cost + ben) / 2, poly = null, psx;
      var curves = [];
      if (e > 0) { psx = 100 - qs; poly = [[qs, psx], [qm, 60], [qm, 20 + qm + cost]]; }
      else if (e < 0) { psx = 20 + qs; poly = [[qm, 60], [qs, psx], [qm, 100 + ben - qm]]; }
      if (poly) svg.appendChild(el('polygon', { points: poly.map(function (p) { return f.X(p[0]) + ',' + f.Y(p[1]); }).join(' '), fill: v('--bad'), opacity: 0.45 }));
      line(svg, f.X(0), f.Y(100), f.X(100), f.Y(0), '--demand', 3.5);
      line(svg, f.X(0), f.Y(20), f.X(100), f.Y(120), '--supply', 3.5);
      if (e > 0) line(svg, f.X(0), f.Y(20 + cost), f.X(100), f.Y(120 + cost), '--gold', 3.5, '8 6');
      if (e < 0) line(svg, f.X(0), f.Y(100 + ben), f.X(100), f.Y(ben), '--gold', 3.5, '8 6');
      if (e !== 0) { line(svg, f.X(qs), f.Y(psx), f.X(qs), f.B, '--gold', 1.5, '4 4'); dot(svg, f.X(qs), f.Y(psx), 7, '--gold'); }
      line(svg, f.X(qm), f.Y(60), f.X(qm), f.B, '--ink', 1.5, '4 4'); dot(svg, f.X(qm), f.Y(60), 8, '--ink');
      svg.appendChild(el('text', { x: f.X(qm) + 10, y: f.B - 8 }, 'рынок: 40'));
      if (e !== 0) svg.appendChild(el('text', { x: f.X(qs) + (qs < qm ? -78 : 10), y: f.B - 24, fill: v('--gold') }, 'оптимум: ' + qs.toFixed(0)));
      var msg;
      if (e > 0) msg = 'Внешний ущерб <b>' + cost + '</b> на единицу не входит в цену. Рынок производит <b>' + qm + '</b>, а обществу выгодно <b>' + qs.toFixed(0) + '</b>: вредного производится слишком много. Красный треугольник — потери общества («провал рынка»).';
      else if (e < 0) msg = 'Внешняя польза <b>' + ben + '</b> на единицу достаётся третьим лицам бесплатно. Рынок производит <b>' + qm + '</b>, а обществу выгодно <b>' + qs.toFixed(0) + '</b>: полезного производится слишком мало. Красный треугольник — упущенная выгода.';
      else msg = 'Внешних эффектов нет: рыночное количество <b>' + qm + '</b> совпадает с общественным оптимумом.';
      q('.wg-out').innerHTML = msg;
    }
    q('.a').addEventListener('input', draw); draw();
  }

  /* ---------- философия: покрывало Майи ---------- */
  function maya(box) {
    var q = shell(box, 'Покрывало Майи', 'Сдвигай ползунок: покрывало становится прозрачнее, и за отдельными «вещами» мира представлений проступает единый поток воли.',
      '<svg viewBox="0 0 640 300"></svg><div class="wg-ctl"><label><span class="n">Прозрачность покрывала</span><input class="a" type="range" min="0" max="100" value="0"><b class="av"></b></label></div><div class="wg-out"></div>');
    var things = [['Я', 90, 80], ['Дом', 240, 60], ['Деньги', 390, 95], ['Другой', 545, 70], ['Наука', 150, 185], ['Успех', 320, 200], ['Слава', 490, 185]];
    function draw() {
      var t = +q('.a').value / 100, svg = q('svg');
      q('.av').textContent = Math.round(t * 100) + '%';
      svg.innerHTML = '';
      for (var k = 0; k < 6; k++) {
        var y = 40 + k * 45, d = 'M0 ' + y;
        for (var x = 0; x <= 640; x += 40) d += ' Q' + (x + 20) + ' ' + (y + (k % 2 ? 22 : -22)) + ' ' + (x + 40) + ' ' + y;
        svg.appendChild(el('path', { d: d, fill: 'none', stroke: v('--accent'), 'stroke-width': 6, opacity: 0.15 + 0.75 * t, 'stroke-linecap': 'round' }));
      }
      svg.appendChild(el('rect', { x: 0, y: 0, width: 640, height: 300, fill: v('--panel2'), opacity: 0.92 * (1 - t) }));
      things.forEach(function (o) {
        var g = el('g', { opacity: 1 - 0.8 * t });
        g.appendChild(el('rect', { x: o[1] - 60, y: o[2] - 26, width: 120, height: 52, rx: 12, fill: v('--panel'), stroke: v('--line'), 'stroke-width': 2 }));
        g.appendChild(el('text', { x: o[1], y: o[2] + 8, 'text-anchor': 'middle', style: 'font-size:22px' }, o[0]));
        svg.appendChild(g);
      });
      if (t > 0.6) svg.appendChild(el('text', { x: 320, y: 285, 'text-anchor': 'middle', style: 'font-size:24px;font-weight:700', opacity: (t - 0.6) / 0.4 }, 'ВОЛЯ — слепой поток становления'));
      var msg;
      if (t < 0.25) msg = '<b>Мир как представление.</b> Обычный человек видит отдельные вещи и себя в центре. Другой для него — объект. Это мир страдающего эгоиста.';
      else if (t < 0.7) msg = '<b>Покрывало истончается.</b> Так видит гений (особенно в музыке) или тот, кто сострадает: границы между «я» и «другим» становятся условными.';
      else msg = '<b>Мир как воля.</b> За всеми вещами — одна вечная, ничем не обоснованная воля. Её не доказывают, а постигают интуицией.';
      q('.wg-out').innerHTML = msg;
    }
    q('.a').addEventListener('input', draw); draw();
  }

  /* ---------- философия: три пути ---------- */
  function threepaths(box) {
    var P = [
      { i: '🎼', n: 'Гений и искусство', s: 'Делает покрывало прозрачным на время', t: 'Гений — посредник между богом и человеком (даймоний Сократа). Высшее искусство — <b>музыка</b>: она выражает саму волю, а не представление. Но выход временный: музыка кончается.' },
      { i: '🤝', n: 'Сострадание', s: 'Основа этики', t: 'Я чувствую, что другой — не объект для меня, а такое же проявление единой воли. Отсюда <b>этика отказа от эгоизма</b>.' },
      { i: '🕯️', n: 'Аскеза', s: 'Отрицание воли', t: 'Отказ от желаний: нет желаний — нет и страдания. Близко к буддийской <b>нирване</b>. Самый полный, но самый трудный путь.' }
    ];
    var q = shell(box, 'Три пути из мира представлений', 'Нажми на путь, чтобы вспомнить, как он работает.', '<div class="wg-chips"></div><div class="wg-out">Выбери путь.</div>');
    var cur = -1;
    function draw() {
      var c = q('.wg-chips'); c.innerHTML = '';
      P.forEach(function (p, k) {
        var b = document.createElement('button');
        b.className = 'wg-chip' + (k === cur ? ' on' : '');
        b.innerHTML = '<span style="font-size:24px">' + p.i + '</span><br><b>' + (k + 1) + '. ' + p.n + '</b><small>' + p.s + '</small>';
        b.onclick = function () { cur = k; draw(); q('.wg-out').innerHTML = P[k].t; };
        c.appendChild(b);
      });
    }
    draw();
  }

  /* ---------- философия: Аполлон и Дионис ---------- */
  function apollodionysus(box) {
    var q = shell(box, 'Аполлоническое и дионисийское', 'По Ницше, греческая трагедия рождается из равновесия двух начал. Сдвинь баланс.',
      '<svg viewBox="0 0 640 160"></svg><div class="wg-ctl"><label><span class="n">☀️ Аполлон ↔ Дионис 🍇</span><input class="a" type="range" min="0" max="100" value="50"><b class="av"></b></label></div><div class="wg-out"></div>');
    function draw() {
      var d = +q('.a').value / 100, svg = q('svg');
      q('.av').textContent = Math.round(d * 100) + '%';
      svg.innerHTML = '';
      svg.appendChild(el('rect', { x: 20, y: 20, width: 300 * (1 - d) + 20, height: 120, rx: 16, fill: v('--gold'), opacity: 0.25 + 0.6 * (1 - d) }));
      svg.appendChild(el('rect', { x: 620 - (300 * d + 20), y: 20, width: 300 * d + 20, height: 120, rx: 16, fill: v('--accent'), opacity: 0.25 + 0.6 * d }));
      [['АПОЛЛОН', 'мера', 'форма', 'разум', 40, 'start'], ['ДИОНИС', 'хаос', 'экстаз', 'поток', 600, 'end']].forEach(function (a) {
        svg.appendChild(el('text', { x: a[4], y: 56, 'text-anchor': a[5], style: 'font-size:26px;font-weight:700' }, a[0]));
        svg.appendChild(el('text', { x: a[4], y: 92, 'text-anchor': a[5], style: 'font-size:20px' }, a[1] + ' · ' + a[2]));
        svg.appendChild(el('text', { x: a[4], y: 122, 'text-anchor': a[5], style: 'font-size:20px' }, a[3]));
      });
      var x = 20 + 600 * d; line(svg, x, 15, x, 145, '--ink', 3);
      var msg;
      if (d < 0.3) msg = '<b>Перевес Аполлона:</b> порядок, разум, красивая форма — но без жизненной силы. Так Ницше видел рационализм и позитивизм своего времени.';
      else if (d > 0.7) msg = '<b>Перевес Диониса:</b> опьянение, хаос, растворение личности в потоке жизни. Сила есть, а формы нет.';
      else msg = '<b>Гармония двух начал</b> — это и есть античная трагедия. Дионисийское даёт творчество, а творчество — это свобода; аполлоническое даёт ему форму.';
      q('.wg-out').innerHTML = msg;
    }
    q('.a').addEventListener('input', draw); draw();
  }

  /* ===== История политических учений: Марсилий Падуанский ===== */
  function hbtn(txt, on) { var b = document.createElement('button'); b.className = 'wg-chip' + (on ? ' on' : ''); b.innerHTML = txt; return b; }

  /* ---------- лента событий ---------- */
  function marsTimeline(box) {
    var ev = [
      { y: '≈1275–1290', t: 'Рождение', d: 'Марсилий (Марсилио деи Майнардини) родился в Падуе — богатом торговом городе Северной Италии, где горожане сами выбирали городское руководство.' },
      { y: '1312–1313', t: 'Ректор Парижского университета', d: '<b>[ДОБАВЛЕНО]</b> Марсилий — медик и философ, учился в Падуе, в 1312–1313 гг. был ректором Парижского университета.' },
      { y: '1324', t: '«Защитник мира»', d: 'Выходит трактат <b>«Defensor pacis»</b> («Защитник мира»). В это время папа <b>Иоанн XXII</b> спорит с баварским князем <b>Людвигом IV</b> за право утверждать короля.' },
      { y: '1326–1327', t: 'Бегство и осуждение', d: 'Авторство раскрыто. Марсилий бежит к Людвигу Баварскому. Папа отлучает его от церкви и осуждает как еретика (<b>[ДОБАВЛЕНО]</b> булла 1327 г.).' },
      { y: '17.01.1328', t: 'Коронация в Риме', d: 'Людвиг Баварский входит в Рим и коронуется императорской короной от имени римского народа. Затем объявляет Иоанна XXII низложенным и ставит «своего» папу (<b>[ДОБАВЛЕНО]</b> антипапа Николай V).' },
      { y: '1342', t: 'Смерть', d: 'Марсилий умирает в Мюнхене, при дворе Людвига. <b>[ДОБАВЛЕНО]</b> Незадолго до смерти пишет «Малого защитника» (Defensor minor).' },
      { y: 'XVI в.', t: 'Реформация', d: 'Через 200 лет идеи Марсилия берут на вооружение протестантские страны, выступавшие против папства. <b>[ДОБАВЛЕНО]</b> В 1535 г. трактат перевели на английский при Генрихе VIII.' }
    ];
    var q = shell(box, 'Лента событий', 'Нажимай на даты: жизнь Марсилия на фоне спора папы и императора.', '<div class="wg-chips"></div><div class="wg-out"></div>');
    var cur = 2;
    function draw() {
      var c = q('.wg-chips'); c.innerHTML = '';
      ev.forEach(function (e, k) {
        var b = hbtn('<b>' + e.y + '</b><small>' + e.t + '</small>', k === cur);
        b.style.flex = '1 1 110px';
        b.onclick = function () { cur = k; draw(); }; c.appendChild(b);
      });
      q('.wg-out').innerHTML = '<b>' + ev[cur].y + ' — ' + ev[cur].t + '.</b> ' + ev[cur].d;
    }
    draw();
  }

  /* ---------- две модели власти ---------- */
  function marsPower(box) {
    var M = {
      pope: { n: 'Папская доктрина', nodes: ['Бог', 'Папа (полнота власти)', 'Император, короли, князья', 'Народ'], side: null,
        out: 'Власть идёт <b>сверху вниз</b>. Папа получает её от Бога и сам утверждает светских правителей. Церковь вмешивается в политику, судит и собирает налоги. По Марсилию, именно это и разрушает мир в Италии.' },
      mars: { n: 'Модель Марсилия', nodes: ['Народ — законодатель', 'Правитель — исполнитель', 'Чиновники и суды', 'Все, включая духовенство'], side: 'Церковь: учит вере, без принуждения',
        out: 'Власть идёт <b>снизу вверх</b>. Народ (его «лучшая часть») принимает законы и выбирает правителя. Правитель подотчётен и может быть смещён <b>по закону</b>. Церковь только учит вере и сама подчиняется государственному суду.' }
    };
    var cur = 'mars';
    var q = shell(box, 'Откуда берётся власть', 'Переключай модели и сравни, в какую сторону течёт власть.', '<div class="wg-chips"></div><svg viewBox="0 0 360 300"></svg><div class="wg-out"></div>');
    function draw() {
      var c = q('.wg-chips'); c.innerHTML = '';
      ['pope', 'mars'].forEach(function (k) { var b = hbtn('<b>' + M[k].n + '</b>', k === cur); b.onclick = function () { cur = k; draw(); }; c.appendChild(b); });
      var m = M[cur], svg = q('svg'); svg.innerHTML = '';
      var col = cur === 'mars' ? '--ok' : '--bad';
      m.nodes.forEach(function (t, i) {
        var y = 16 + i * 70, x = 30, w = m.side ? 210 : 300;
        svg.appendChild(el('rect', { x: x, y: y, width: w, height: 44, rx: 12, fill: v('--panel'), stroke: v(i === 0 ? col : '--line'), 'stroke-width': i === 0 ? 2.5 : 1.5 }));
        svg.appendChild(el('text', { x: x + w / 2, y: y + 27, 'text-anchor': 'middle' }, t));
        if (i < m.nodes.length - 1) {
          var ax = x + w / 2; line(svg, ax, y + 46, ax, y + 66, col, 3);
          svg.appendChild(el('path', { d: 'M' + (ax - 6) + ' ' + (y + 60) + ' L' + ax + ' ' + (y + 68) + ' L' + (ax + 6) + ' ' + (y + 60), fill: 'none', stroke: v(col), 'stroke-width': 3 }));
        }
      });
      if (m.side) {
        svg.appendChild(el('rect', { x: 248, y: 86, width: 106, height: 114, rx: 12, fill: v('--panel'), stroke: v('--gold'), 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
        ['Церковь:', 'учит вере,', 'без права', 'принуждения'].forEach(function (t, i) { svg.appendChild(el('text', { x: 301, y: 116 + i * 20, 'text-anchor': 'middle' }, t)); });
      }
      q('.wg-out').innerHTML = m.out;
    }
    draw();
  }

  /* ---------- кто решает по Марсилию ---------- */
  function marsWho(box) {
    var R = ['Народ-законодатель', 'Правитель', 'Церковный собор', 'Папа'];
    var S = [
      { s: 'Принять новый закон', a: 0, e: 'Законодатель — народ, то есть собрание граждан или их «лучшая часть». Правитель закон только исполняет.' },
      { s: 'Наказать священника за кражу', a: 1, e: 'Духовенство подчиняется государственному суду. Принуждение — дело правителя, а не церкви.' },
      { s: 'Решить спорный вопрос веры', a: 2, e: 'Вопросы веры решает общий церковный собор, а не папа единолично. Созывает собор светская власть.' },
      { s: 'Сместить правителя, нарушающего закон', a: 0, e: 'Народ, который избрал правителя, может его сместить. Причём по закону, а не силой.' },
      { s: 'Назначить епископа в город', a: 1, e: 'Назначения в церкви должны идти под контролем светской власти той территории, где назначают.' },
      { s: 'Утвердить светского короля', a: 0, e: 'Королевское достоинство даётся выборами, а не папским утверждением. Именно об этом спорили Иоанн XXII и Людвиг Баварский.' }
    ];
    var i = 0, score = 0, done = false;
    var q = shell(box, 'Кто решает? (по Марсилию)', 'Выбери, кому Марсилий отдаёт решение в каждой ситуации.', '<div class="wg-out wq"></div><div class="wg-chips"></div><div class="wg-out wr" style="display:none"></div>');
    function draw() {
      var c = q('.wg-chips'), r = q('.wr');
      if (i >= S.length) {
        q('.wq').innerHTML = 'Результат: <b>' + score + ' из ' + S.length + '</b>. ' + (score === S.length ? 'Отлично!' : 'Пройди ещё раз, чтобы закрепить.');
        c.innerHTML = ''; r.style.display = 'none';
        var b = hbtn('<b>Заново</b>'); b.onclick = function () { i = 0; score = 0; done = false; draw(); }; c.appendChild(b); return;
      }
      q('.wq').innerHTML = '<small style="color:var(--muted)">' + (i + 1) + ' / ' + S.length + '</small><br><b>' + S[i].s + '</b>';
      c.innerHTML = '';
      R.forEach(function (t, k) {
        var b = hbtn('<b>' + t + '</b>');
        if (done) { if (k === S[i].a) b.className += ' on'; else b.className += ' off'; }
        b.onclick = function () {
          if (done) return; done = true;
          var ok = k === S[i].a; if (ok) score++;
          r.style.display = ''; r.innerHTML = (ok ? '✅ Верно. ' : '❌ Нет: <b>' + R[S[i].a] + '</b>. ') + S[i].e;
          draw();
          var nx = hbtn('<b>Дальше ›</b>'); nx.onclick = function () { i++; done = false; r.style.display = 'none'; draw(); }; q('.wg-chips').appendChild(nx);
        };
        c.appendChild(b);
      });
    }
    draw();
  }

  var REG = { budget: budget, marginal: marginal, supplydemand: supplydemand, externality: externality, maya: maya, threepaths: threepaths, apollodionysus: apollodionysus, 'mars-timeline': marsTimeline, 'mars-power': marsPower, 'mars-who': marsWho };
  window.HubWidgets = {
    add: function (name, fn) { REG[name] = fn; },
    register: function (name, fn) { REG[name] = fn; },
    mountAll: function (root) {
      Array.prototype.forEach.call(root.querySelectorAll('.wg-slot'), function (slot) {
        var fn = REG[slot.getAttribute('data-w')];
        if (fn) { slot.classList.remove('wg-slot'); fn(slot); } else slot.textContent = '';
      });
    }
  };
})();
