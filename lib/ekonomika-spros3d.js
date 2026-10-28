/* 3D-модели и мини-тест к конспекту «Экономика. Спрос и предложение» (лекция 19.10).
   В Markdown: @@graph:ss-need3d@@ @@graph:ss-curve3d@@ @@graph:ss-factors3d@@ @@graph:ss-income3d@@ @@graph:ss-giffen3d@@
   @@graph:ss-luxury3d@@ @@graph:ss-expect3d@@ @@graph:ss-ads3d@@ @@graph:ss-substitutes3d@@ @@graph:ss-complements3d@@
   @@graph:ss-buyers3d@@ @@graph:ss-shift3d@@ @@graph:ss-exceptions3d@@ @@graph:ss-pricegap3d@@ @@graph:ss-supplyfactors3d@@
   @@graph:ss-supply3d@@ @@graph:ss-labor3d@@ @@graph:ss-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa',
    WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', SILVER = '#c9ced8', ORANGE = '#e39b5b',
    POTATO = '#c9a46a', MEAT = '#c0504d', CREAM = '#f6e7c8', TEA = '#7fb069', COFFEE = '#6f4e37';
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 2.6, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function group(c) { var g = new c.THREE.Group(); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  function person(c, x, z, col, info, g, s, y) {
    var T = c.THREE; s = s || 1; y = y || 0;
    var p = new T.Group(); (g || c.root).add(p); p.position.set(x, y, z);
    var b = c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info); b.position.y = 0.45 * s; p.add(b);
    var h = c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), '#e8c6a0', info); h.position.y = 1.12 * s; p.add(h);
    return p;
  }
  function arrow(c, a, b, col, info, g, rad) {
    var T = c.THREE, A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]), dir = B.clone().sub(A).normalize();
    var head = B.clone().sub(dir.clone().multiplyScalar(0.45));
    var s = c.link(a, [head.x, head.y, head.z], col, rad || 0.07, info);
    var cone = c.mesh(new T.ConeGeometry((rad || 0.07) * 3, 0.5, 14), col, info);
    cone.position.copy(B).sub(dir.clone().multiplyScalar(0.25)); cone.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    if (g) { g.add(s); g.add(cone); }
    return [s, cone];
  }
  function glow(c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); }
  function coin(c, x, y, z, info, g, r, col) {
    var m = c.mesh(new c.THREE.CylinderGeometry(r || 0.4, r || 0.4, 0.1, 28), col || GOLD, info, { metalness: 0.25, roughness: 0.35, emissive: col || GOLD, emissiveIntensity: 0.12 });
    m.position.set(x, y, z); if (g) g.add(m); return m;
  }
  function stack(c, x, z, n, info, g, col) { var arr = []; for (var i = 0; i < n; i++) arr.push(coin(c, x, 0.06 + i * 0.11, z, info, g, 0.4, col)); return arr; }
  function bill(c, x, y, z, info, g, col) { var m = c.box3(1.2, 0.04, 0.6, col || GREEN, [x, y, z], info); if (g) g.add(m); return m; }
  /* Кривая-трубка по точкам [x,y,z] */
  function tube(c, pts, col, info, g, r) {
    var T = c.THREE, cv = new T.CatmullRomCurve3(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2] || 0); }));
    var m = c.mesh(new T.TubeGeometry(cv, 90, r || 0.09, 10, false), col, info, { emissive: col, emissiveIntensity: 0.18 });
    m.userData.curve = cv; if (g) g.add(m); return m;
  }
  /* Оси графика: P вверх, Q вправо, начало в (ox, 0, oz) */
  function axes(c, ox, oz, w, h, g, xl, yl) {
    var iA = 'Оси графика: по вертикали — <b>цена (P)</b>, по горизонтали — <b>количество (Q)</b>.';
    arrow(c, [ox, 0.05, oz], [ox + w, 0.05, oz], GREY, iA, g, 0.05);
    arrow(c, [ox, 0, oz], [ox, h, oz], GREY, iA, g, 0.05);
    var a = c.label(yl || 'P (цена)', [ox, h + 0.5, oz], 0.26, '#8b93b5'), b = c.label(xl || 'Q (количество)', [ox + w, -0.5, oz], 0.26, '#8b93b5');
    if (g) { g.add(a); g.add(b); }
  }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function icecream(c, x, z, info, g, s) {
    var T = c.THREE; s = s || 1; var p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    var cone = c.mesh(new T.ConeGeometry(0.25 * s, 0.8 * s, 14), '#d9a35b', info); cone.rotation.x = Math.PI; cone.position.y = 0.4 * s; p.add(cone);
    var ball = c.mesh(new T.SphereGeometry(0.3 * s, 16, 12), '#f7c6d9', info); ball.position.y = 0.95 * s; p.add(ball);
    return p;
  }
  function car(c, x, z, col, info, g) {
    var T = c.THREE, p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    p.add(c.box3(1.8, 0.45, 0.9, col, [0, 0.45, 0], info));
    p.add(c.box3(1.0, 0.4, 0.8, '#9fd3ff', [-0.1, 0.85, 0], info));
    [[-0.6, 0.45], [-0.6, -0.45], [0.6, 0.45], [0.6, -0.45]].forEach(function (q) { var w = c.mesh(new T.CylinderGeometry(0.22, 0.22, 0.15, 16), DARK, info); w.rotation.x = Math.PI / 2; w.position.set(q[0], 0.22, q[1]); p.add(w); });
    return p;
  }

  /* ======================= 1. Потребность и спрос ======================= */
  reg('ss-need3d', {
    title: 'Хочу ≠ спрос', lead: 'Все пятеро хотят «Мерседес». Но только у тех, кто стоит с монетами, хватает денег. Их желание — это и есть спрос.',
    radius: 14, phi: 1.05, theta: 0.35, targetY: 1.2, height: 400, hint: 'Нажми на человека или на машину.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iC = '<b>«Мерседес»</b> — пример лектора. Хотят все, но купить может только тот, у кого есть деньги.';
      var m = car(c, 0, -3, SILVER, iC); m.scale.set(1.6, 1.6, 1.6);
      c.label('«Мерседес»', [0, 2.6, -3], 0.32);
      var P = [
        [-4, BLUE, false], [-2, RED, true], [0, GREEN, false], [2, PURPLE, true], [4, ORANGE, false]
      ];
      var bubbles = [];
      P.forEach(function (p, i) {
        var info = p[2] ? '<b>Хочет и может заплатить</b> — это <b>спрос</b> (платёжеспособная потребность).' : '<b>Хочет, но денег нет</b> — это просто <b>потребность</b>. На рынок она не влияет.';
        person(c, p[0], 2, p[1], info, null, 1.1);
        var b = glow(c, p[2] ? GREEN : GREY, 0.22, info); b.position.set(p[0], 2.2, 2); bubbles.push(b);
        if (p[2]) { stack(c, p[0] + 0.6, 2.6, 5, info); }
        c.label(p[2] ? 'спрос' : 'хочу', [p[0], 3.1, 2], 0.26, p[2] ? '#4cc38a' : '#8b93b5');
      });
      arrow(c, [-2, 1.2, 1.3], [-0.6, 1.2, -1.8], GREEN, 'Покупатель с деньгами реально выходит на рынок.');
      arrow(c, [2, 1.2, 1.3], [0.6, 1.2, -1.8], GREEN, 'Покупатель с деньгами реально выходит на рынок.');
      c.onFrame(function (t) { bubbles.forEach(function (b, i) { b.position.y = 2.2 + 0.12 * Math.sin(t * 2 + i); }); });
    },
    chips: [
      { t: 'Потребность', on: function (c) { c.setView(0.35, 1.05, 14, 1.2, 0); c.say('<b>Потребность</b> — «хочу». У всех пятерых есть потребность в «Мерседесе».'); } },
      { t: 'Спрос', on: function (c) { c.setView(0.1, 0.95, 9, 1.4, 0, 2); c.say('<b>Спрос</b> — «хочу <i>и могу</i> заплатить». Только двое из пяти.'); } }
    ]
  });

  /* ======================= 2. Кривая спроса ======================= */
  reg('ss-curve3d', {
    autorotate: false,
    title: 'Кривая спроса', lead: 'Шарик — покупатель на кривой спроса. Цена выше → он покупает меньше. Каждая точка — величина спроса, вся линия — спрос.',
    radius: 13, phi: 1.2, theta: 0.15, targetY: 2.5, targetX: 0, height: 420, hint: 'Выбери цену кнопкой или нажми на кривую.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      axes(c, -4, 0, 8.5, 6);
      var iD = '<b>Кривая спроса D</b> идёт сверху вниз: чем выше цена, тем меньше покупают. Это <b>закон спроса</b>.';
      var d = tube(c, [[-3.5, 5.5], [-1.5, 3.4], [1, 1.9], [4, 0.8]], BLUE, iD);
      c.label('D (спрос)', [4.3, 1.5, 0], 0.3, '#5b8def');
      var ball = glow(c, GOLD, 0.28, '<b>Величина спроса</b> — одна точка на кривой: сколько купят по этой цене.');
      var hl = c.link([0, 0, 0], [1, 0, 0], GOLD, 0.03), vl = c.link([0, 0, 0], [0, 1, 0], GOLD, 0.03);
      c.userData = { u: 0.5, goal: 0.5 };
      c.onFrame(function () {
        var u = c.userData; u.u = lerp(u.u, u.goal, 0.06);
        var p = d.userData.curve.getPoint(u.u); ball.position.copy(p);
        hl.position.set((-4 + p.x) / 2, p.y, 0); hl.scale.set(1, Math.max(0.01, p.x + 4), 1); hl.rotation.z = Math.PI / 2;
        vl.position.set(p.x, p.y / 2, 0); vl.scale.set(1, Math.max(0.01, p.y), 1);
      });
      for (var i = 0; i < 4; i++) icecream(c, -3 + i * 1.6, 3, 'Товар — мороженое. Чем оно дешевле, тем больше его купят.', null, 0.8);
    },
    chips: [
      { t: 'Цена высокая', on: function (c) { c.userData.goal = 0.08; c.say('Цена <b>высокая</b> → величина спроса <b>маленькая</b>: покупают мало.'); } },
      { t: 'Средняя', on: function (c) { c.userData.goal = 0.5; c.say('Средняя цена — средняя величина спроса.'); } },
      { t: 'Цена низкая', on: function (c) { c.userData.goal = 0.95; c.say('Цена <b>низкая</b> → величина спроса <b>большая</b>. Это и есть закон спроса.'); } }
    ]
  });

  /* ======================= 3. Колесо факторов спроса ======================= */
  reg('ss-factors3d', {
    title: 'Восемь факторов спроса', lead: 'В центре — спрос. Вокруг — восемь факторов с лекции. Цена (золотой) — главный: она двигает точку по кривой, остальные сдвигают всю кривую.',
    radius: 14, phi: 0.85, theta: 0.3, targetY: 0.8, height: 420, hint: 'Нажми на любой столбик.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var core = glow(c, BLUE, 0.9, '<b>Спрос</b> — платёжеспособная потребность. На него влияют восемь факторов.'); core.position.y = 1.2;
      c.label('СПРОС', [0, 2.6, 0], 0.34);
      var F = [
        ['1. Цена', GOLD, '<b>Цена</b> — главный фактор. Цена ↑ → величина спроса ↓. Движение <b>по</b> кривой.'],
        ['2. Доход', GREEN, '<b>Доход.</b> Нормальные товары: доход ↑ → спрос ↑. Низшие: доход ↑ → спрос ↓.'],
        ['3. Вкусы', PURPLE, '<b>Вкусы и предпочтения</b> — субъективны. Любишь кино — ходишь в кино.'],
        ['4. Ожидания', ORANGE, '<b>Ожидания.</b> Ждём подорожания красной рыбы — покупаем сегодня. Ждём удешевления — откладываем.'],
        ['5. Реклама', RED, '<b>Реклама</b> (колебания расходов на неё) обычно повышает спрос.'],
        ['6. Заменители', TEA, '<b>Цены на товары-заменители</b> (чай ↔ кофе). <b>Прямая</b> связь.'],
        ['7. Комплементы', '#6fb3d9', '<b>Цены на взаимодополняемые товары</b> (машина + бензин). <b>Обратная</b> связь.'],
        ['8. Покупатели', STONE, '<b>Число покупателей.</b> Больше людей — больше спрос.']
      ];
      var bars = [];
      F.forEach(function (f, i) {
        var a = i / F.length * Math.PI * 2, x = Math.cos(a) * 5, z = Math.sin(a) * 5, h = i === 0 ? 2.6 : 1.6;
        var b = c.box3(0.9, h, 0.9, f[1], [x, h / 2, z], f[2]); b.userData.h = h; bars.push(b);
        c.link([x * 0.2, 1.2, z * 0.2], [x * 0.85, 0.8, z * 0.85], i === 0 ? GOLD : GREY, 0.04, f[2]);
        c.label(f[0], [x, h + 0.6, z], 0.27);
      });
      c.onFrame(function (t) { core.rotation.y = t * 0.4; bars.forEach(function (b, i) { var s = 1 + 0.05 * Math.sin(t * 2 + i); b.scale.y = s; b.position.y = b.userData.h * s / 2; }); });
    }
  });

  /* ======================= 4. Доход: нормальные и низшие ======================= */
  reg('ss-income3d', {
    title: 'Доход меняется — что покупаем?', lead: 'Столбики — сколько покупают. Слева нормальные товары, в центре «соль и электричество», справа низшие. Нажми «Доход ↑» или «Доход ↓».',
    radius: 15, phi: 1.1, theta: 0.25, targetY: 1.4, height: 420, hint: 'Нажми кнопку, чтобы изменить доход.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var G = [
        ['мясо', MEAT, 'n', '<b>Мясо</b> — нормальный товар: разбогатели — покупаем больше.'],
        ['мороженое', '#f7c6d9', 'n', '<b>Мороженое</b> — пример лектора: доход вырос вдвое — мороженого купим больше.'],
        ['смартфон', BLUE, 'n', '<b>Новый смартфон</b> — нормальный товар: разбогатев, меняют телефон на «Самсунг» или айфон.'],
        ['соль', '#ffffff', 'z', '<b>Соль, корица</b>: «два килограмма корицы вы не купите». Спрос почти не зависит от дохода.'],
        ['свет', GOLD, 'z', '<b>Электричество</b>: разбогатев, вы не включите все люстры. Потребляют сколько нужно.'],
        ['маргарин', '#f2e28a', 'i', '<b>Маргарин</b> — низший товар: доход упал — вместо сливочного масла берут маргарин.'],
        ['дешёвое масло', '#d9c25b', 'i', '<b>Дешёвое растительное масло</b> — низший товар.'],
        ['кнопочный тел.', DARK, 'i', '<b>Кнопочный телефон</b> — низший: разбогатев, его меняют на смартфон.']
      ];
      c.userData = { k: 0, goal: 0, bars: [] };
      G.forEach(function (g, i) {
        var x = -7 + i * 2, b = c.box3(1.3, 1, 1.3, g[1], [x, 1, 0], g[3]); b.userData.type = g[2]; c.userData.bars.push(b);
        c.label(g[0], [x, -0.1, 1.4], 0.24);
      });
      c.box3(5.6, 0.06, 0.2, GREEN, [-5, 0.03, -1.3], '<b>Нормальные товары</b>: спрос растёт вместе с доходом.');
      c.label('нормальные', [-5, 0.6, -1.5], 0.28, '#4cc38a');
      c.box3(3.6, 0.06, 0.2, GREY, [0, 0.03, -1.3], 'Спрос почти не зависит от дохода.');
      c.label('почти не меняются', [0, 0.6, -1.5], 0.28, '#8b93b5');
      c.box3(5.6, 0.06, 0.2, RED, [5, 0.03, -1.3], '<b>Низшие товары</b>: спрос падает при росте дохода и растёт при его снижении.');
      c.label('низшие', [5, 0.6, -1.5], 0.28, '#e0645a');
      var wallet = stack(c, 0, 3.2, 3, 'Доход покупателя.');
      c.onFrame(function () {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        u.bars.forEach(function (b) {
          var h = b.userData.type === 'n' ? 2 + 1.4 * u.k : b.userData.type === 'i' ? 2 - 1.3 * u.k : 2 + 0.1 * u.k;
          b.scale.y = h; b.position.y = h / 2;
        });
        wallet.forEach(function (w, i) { w.visible = i < Math.round(3 + 2 * u.k); });
      });
      for (var j = 3; j < 5; j++) wallet.push(coin(c, 0, 0.06 + j * 0.11, 3.2, 'Доход покупателя.'));
    },
    chips: [
      { t: 'Доход ↑', on: function (c) { c.userData.goal = 1; c.say('Доход <b>вырос</b>: нормальные товары покупают больше, низшие — меньше. Соль и свет — почти так же.'); } },
      { t: 'Доход ↓', on: function (c) { c.userData.goal = -1; c.say('Доход <b>упал</b>: отказываются от мяса и мороженого, переходят на маргарин и дешёвое масло.'); } },
      { t: 'Как было', on: function (c) { c.userData.goal = 0; c.say('Исходный доход.'); } }
    ]
  });

  /* ======================= 5. Товар Гиффена ======================= */
  reg('ss-giffen3d', {
    title: 'Ирландская семья и картофель', lead: 'Бюджет семьи — монеты. Картофель дорожает, денег на мясо уже не хватает — и семья покупает картофеля ещё больше. Спрос растёт вместе с ценой.',
    radius: 13, phi: 1.05, theta: 0.4, targetY: 1.2, height: 420, hint: 'Нажми «Картофель дорожает».',
    build: function (c) {
      var T = c.THREE; c.ground(8, '#4a5a3a');
      var iH = '<b>Ирландская крестьянская семья, XIX век.</b> Основная еда — картофель. Во время Великого голода (1845–1849) он дорожал, а его покупали ещё больше.';
      c.box3(3, 1.6, 2.2, STONE, [-3.5, 0.8, -2.5], iH);
      var roof = c.mesh(new T.ConeGeometry(2.2, 1.2, 4), '#b8a26b', iH); roof.position.set(-3.5, 2.2, -2.5); roof.rotation.y = Math.PI / 4;
      person(c, -1.5, -1.5, GREEN, iH); person(c, -0.8, -1.8, BLUE, iH, null, 0.7);
      var iP = '<b>Картофель</b> — самый дешёвый продукт. При бедности его доля в бюджете огромная.';
      var iM = '<b>Мясо</b> — дорогое. Когда картофель дорожает, на мясо денег не остаётся совсем.';
      c.userData = { k: 0, goal: 0, pot: [], meat: [] };
      for (var i = 0; i < 12; i++) { var p = c.mesh(new T.SphereGeometry(0.28, 10, 8), POTATO, iP); p.scale.set(1.2, 0.85, 1); p.position.set(1.5 + (i % 4) * 0.6, 0.25 + Math.floor(i / 4) * 0.45, 1 + (i % 2) * 0.3); c.userData.pot.push(p); }
      for (var j = 0; j < 4; j++) { var m = c.box3(0.6, 0.3, 0.45, MEAT, [5 + (j % 2) * 0.7, 0.15 + Math.floor(j / 2) * 0.32, 1], iM); c.userData.meat.push(m); }
      c.label('картофель', [2.4, 2.2, 1], 0.28); c.label('мясо', [5.3, 1.4, 1], 0.28);
      var priceTag = c.box3(0.15, 1, 0.15, RED, [2.4, 3, -0.5], 'Цена картофеля.'); c.userData.tag = priceTag;
      c.label('цена картофеля', [2.4, 4.4, -0.5], 0.24, '#e0645a');
      stack(c, -3.5, 1.5, 6, 'Бюджет семьи не меняется. Если картофель дорожает, денег на остальное становится меньше.');
      c.onFrame(function () {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        var nP = Math.round(8 + 4 * u.k), nM = Math.round(3 - 3 * u.k);
        u.pot.forEach(function (p, i) { p.visible = i < nP; });
        u.meat.forEach(function (m, i) { m.visible = i < nM; });
        var h = 1 + 1.5 * u.k; u.tag.scale.y = h; u.tag.position.y = 2.6 + h / 2;
      });
    },
    chips: [
      { t: 'Картофель дорожает', on: function (c) { c.userData.goal = 1; c.say('Цена картофеля ↑ → мяса купить уже не на что → картофеля покупают <b>больше</b>. Это <b>товар Гиффена</b>.'); } },
      { t: 'Как было', on: function (c) { c.userData.goal = 0; c.say('Обычный бюджет: немного мяса, много картофеля.'); } },
      { t: 'Россия 90-х', on: function (c) { c.userData.goal = 1; c.say('Пример лектора: в 90-е в России резко выросло потребление картофеля. Отказывались от мяса и сажали картофель на дачах.'); } }
    ]
  });

  /* ======================= 6. Роскошь: номера ======================= */
  reg('ss-luxury3d', {
    title: 'Аукцион «красивых» номеров', lead: 'Номер с одинаковыми цифрами покупают за огромные деньги только ради престижа. Подешевеет — перестанет быть роскошью и спрос пропадёт.',
    radius: 12, phi: 1.1, theta: 0.3, targetY: 1.3, height: 400, hint: 'Нажми на номер или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iN = '<b>«Красивый» номер</b> (пример лектора). Сейчас такие продают на аукционах. Платят не за кусок металла, а за <b>статус</b>.';
      var plate = c.box3(3, 0.7, 0.1, '#ffffff', [0, 2.2, 0], iN);
      c.label('А 777 АА', [0, 2.2, 0.15], 0.38, '#222');
      c.box3(0.15, 2, 0.15, DARK, [0, 1, -0.1], iN);
      var iB = '<b>Покупатели на аукционе.</b> Чем выше цена, тем престижнее номер — <b>эффект Веблена</b>.';
      c.userData = { k: 0, goal: 0, hands: [] };
      for (var i = 0; i < 6; i++) { var a = -0.9 + i * 0.36; var p = person(c, Math.sin(a) * 5, Math.cos(a) * 5 - 1, [BLUE, RED, GREEN, PURPLE, ORANGE, GREY][i], iB); var hnd = c.box3(0.12, 0.6, 0.12, GOLD, [Math.sin(a) * 5, 1.9, Math.cos(a) * 5 - 1], iB); c.userData.hands.push(hnd); }
      var ps = stack(c, 3, 0, 10, 'Цена номера.'); c.userData.stack = ps;
      c.label('цена', [3, 2.1, 0], 0.26);
      c.onFrame(function (t) {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        u.stack.forEach(function (s, i) { s.visible = i < Math.round(10 - 8 * u.k); });
        u.hands.forEach(function (h, i) { h.visible = u.k < 0.5 || i === 0; h.position.y = 1.9 + 0.1 * Math.sin(t * 3 + i); });
        plate.rotation.y = 0.2 * Math.sin(t);
      });
    },
    chips: [
      { t: 'Дорого', on: function (c) { c.userData.goal = 0; c.say('Номер <b>дорогой</b> — желающих много: это престиж.'); } },
      { t: 'Подешевел', on: function (c) { c.userData.goal = 1; c.say('«Если дёшево — какая же это роскошь?» Престиж исчез, и <b>спрос упал</b> вместе с ценой.'); } }
    ]
  });

  /* ======================= 7. Ожидания ======================= */
  reg('ss-expect3d', {
    title: 'Ожидания покупателей', lead: 'Слева — новости «красная рыба подорожает»: очередь сегодня. Справа — «завтра мороженое подешевеет»: сегодня никто не покупает.',
    radius: 15, phi: 1.05, theta: 0.15, targetY: 1.2, height: 400, hint: 'Нажми на очередь, прилавок или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iF = '<b>Ждут подорожания</b> красной рыбы → бегут покупать <b>сейчас</b>. Спрос сегодня растёт.';
      c.box3(2.4, 1, 1, WOOD, [-4, 0.5, -1.5], iF);
      for (var i = 0; i < 3; i++) { var f = c.mesh(new T.ConeGeometry(0.25, 1.2, 10), '#f08a6b', iF); f.rotation.z = Math.PI / 2; f.position.set(-4.8 + i * 0.8, 1.2, -1.5); }
      c.label('красная рыба ↑ завтра', [-4, 2.6, -1.5], 0.27, '#e0645a');
      var q = [];
      for (var j = 0; j < 6; j++) q.push(person(c, -4, -0.2 + j * 0.8, [BLUE, RED, GREEN, PURPLE, ORANGE, GREY][j], iF, null, 0.9));
      var iI = '<b>Ждут удешевления</b> мороженого → сегодня <b>не покупают</b>, ждут завтра. Спрос сегодня падает.';
      c.box3(2.4, 1, 1, '#9fd3ff', [4, 0.5, -1.5], iI);
      for (var k = 0; k < 3; k++) icecream(c, 3.2 + k * 0.8, -1.5, iI, null, 0.7).position.y = 1;
      c.label('мороженое ↓ завтра', [4, 2.6, -1.5], 0.27, '#4cc38a');
      var w = person(c, 4.5, 2.8, BLUE, iI, null, 0.9); var w2 = person(c, 3.5, 3.2, GREEN, iI, null, 0.9);
      c.label('ждём…', [4, 2.4, 3], 0.26, '#8b93b5');
      c.onFrame(function (t) { q.forEach(function (p, i) { p.position.z = -0.2 + i * 0.8 + 0.1 * Math.sin(t * 4 + i); }); w.rotation.y = t; });
    },
    chips: [
      { t: 'Ждём подорожания', on: function (c) { c.setView(-0.3, 1.0, 10, 1, -4); c.say('Слух о подорожании → покупают заранее → <b>спрос сейчас ↑</b>.'); } },
      { t: 'Ждём удешевления', on: function (c) { c.setView(0.4, 1.0, 10, 1, 4); c.say('Знаем, что завтра будет дешевле → откладываем покупку → <b>спрос сейчас ↓</b>.'); } }
    ]
  });

  /* ======================= 8. Реклама и вклад ======================= */
  reg('ss-ads3d', {
    title: '«20 % годовых»: что под звёздочкой', lead: 'Большой щит — реклама вклада. Внизу — мелкий шрифт: ставка только 2 месяца. Столбики показывают, сколько вы реально получите.',
    radius: 14, phi: 1.1, theta: 0.2, targetY: 2, height: 420, hint: 'Нажми на щит или столбик.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iAd = '<b>Реклама вклада</b> — пример лектора. Реклама повышает спрос на товар (здесь — на вклад).';
      c.box3(5, 2.6, 0.2, '#1f3c88', [-3, 3, -2], iAd);
      c.box3(0.2, 1.8, 0.2, DARK, [-4.5, 0.9, -2], iAd); c.box3(0.2, 1.8, 0.2, DARK, [-1.5, 0.9, -2], iAd);
      c.label('20 %*', [-3, 3.3, -1.8], 0.7, '#f0c36b');
      c.label('*только 2 месяца', [-3, 2.1, -1.8], 0.2, '#c9ced8');
      var B = [
        ['20 % — в рекламе', 3.4, GOLD, '<b>20 % годовых</b> — столько платят, если ставка держится <b>весь год</b>.'],
        ['14 % — ключевая ЦБ', 2.4, BLUE, '<b>Ключевая ставка ЦБ</b> — 14 % (октябрь 2026). С ней и надо сравнивать.'],
        ['≈3,3 % — реально', 0.6, RED, '<b>20 % : 12 × 2 ≈ 3,3 %</b> — столько вы получите за 2 месяца. Подсказка лектора: делите на 12 и умножайте на число месяцев.']
      ];
      var bars = [];
      B.forEach(function (b, i) {
        var x = 1.5 + i * 2.2, m = c.box3(1.3, b[1], 1.3, b[2], [x, b[1] / 2, 0.5], b[3]); m.userData.h = b[1]; bars.push(m);
        c.label(b[0], [x, b[1] + 0.6, 0.5], 0.24);
      });
      person(c, -3, 2, GREEN, 'Покупатель, который увидел рекламу. Читайте мелкий шрифт!');
      c.onFrame(function (t) { bars.forEach(function (b, i) { var s = 1 + 0.03 * Math.sin(t * 2 + i); b.scale.y = s; b.position.y = b.userData.h * s / 2; }); });
    },
    chips: [
      { t: 'Реклама', on: function (c) { c.setView(-0.2, 1.1, 10, 2.5, -3); c.say('Большая цифра привлекает покупателей — <b>реклама повышает спрос</b>.'); } },
      { t: 'Считаем', on: function (c) { c.setView(0.3, 1.05, 10, 1.5, 3.7); c.say('20 % : 12 = 1,67 % в месяц; × 2 месяца ≈ <b>3,3 %</b> от суммы вклада.'); } }
    ]
  });

  /* ======================= 9. Заменители ======================= */
  reg('ss-substitutes3d', {
    title: 'Чай и кофе — заменители', lead: 'Чай дорожает — люди переходят на кофе. Цена чая и спрос на кофе движутся в одну сторону: это прямая связь.',
    radius: 13, phi: 1.1, theta: 0.2, targetY: 1.4, height: 400, hint: 'Нажми «Чай дорожает».',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      function cup(x, col, info) {
        var g = new T.Group(); c.root.add(g); g.position.set(x, 0, -1);
        var m = c.mesh(new T.CylinderGeometry(0.7, 0.55, 1.1, 24), '#f4f1ea', info); m.position.y = 0.55; g.add(m);
        var d = c.mesh(new T.CylinderGeometry(0.62, 0.62, 0.05, 24), col, info); d.position.y = 1.05; g.add(d);
        var h = c.mesh(new T.TorusGeometry(0.3, 0.08, 10, 20), '#f4f1ea', info); h.position.set(0.75, 0.6, 0); g.add(h);
        return g;
      }
      var iT = '<b>Чай.</b> Если он резко подорожает, тем, кому всё равно, что пить, выгоднее перейти на кофе.';
      var iK = '<b>Кофе.</b> Спрос на него растёт, когда дорожает чай. А вслед за спросом растёт и цена кофе.';
      cup(-3, TEA, iT); cup(3, COFFEE, iK);
      c.label('чай', [-3, 2, -1], 0.3); c.label('кофе', [3, 2, -1], 0.3);
      c.userData = { k: 0, goal: 0 };
      var pT = c.box3(0.8, 1, 0.8, RED, [-3.6, 0.5, 2], 'Цена чая.'); c.label('цена чая', [-3.6, -0.3, 2.8], 0.22);
      var dK = c.box3(0.8, 1, 0.8, GREEN, [3.6, 0.5, 2], 'Спрос на кофе.'); c.label('спрос на кофе', [3.6, -0.3, 2.8], 0.22);
      var people = [];
      for (var i = 0; i < 6; i++) people.push(person(c, -1.5 + (i % 3) * 0.6, 1 + Math.floor(i / 3) * 0.7, [BLUE, RED, GREEN, PURPLE, ORANGE, GREY][i], 'Покупатели: им всё равно, чай или кофе.', null, 0.7));
      arrow(c, [-1.6, 2.6, 0], [1.6, 2.6, 0], GREY, '<b>Прямая связь:</b> цена одного ↑ → спрос на другой ↑.');
      c.onFrame(function () {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        var h1 = 1 + 2 * u.k; pT.scale.y = h1; pT.position.y = h1 / 2;
        var h2 = 1 + 2 * u.k; dK.scale.y = h2; dK.position.y = h2 / 2;
        people.forEach(function (p, i) { p.position.x = lerp(-3.4, 2.6, u.k) + (i % 3) * 0.6; });
      });
    },
    chips: [
      { t: 'Чай дорожает', on: function (c) { c.userData.goal = 1; c.say('Цена чая ↑ → покупатели переходят на кофе → спрос на кофе ↑. <b>Прямая связь.</b>'); } },
      { t: 'Как было', on: function (c) { c.userData.goal = 0; c.say('Обычные цены.'); } }
    ]
  });

  /* ======================= 10. Комплементы ======================= */
  reg('ss-complements3d', {
    title: 'Машина и бензин — комплементы', lead: 'Без бензина машина не поедет. Бензин дорожает — машины покупают реже. Цена одного и спрос на другой идут в разные стороны: обратная связь.',
    radius: 13, phi: 1.1, theta: 0.25, targetY: 1.3, height: 400, hint: 'Нажми «Бензин дорожает».',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iG = '<b>Бензин.</b> Его покупают вместе с машиной: один товар дополняет другой.';
      var iC = '<b>Автомобили.</b> Когда бензин дорожает, ездить дороже — спрос на машины падает.';
      c.box3(1, 2, 0.8, RED, [-4, 1, -1], iG); c.box3(0.3, 0.4, 0.3, DARK, [-4, 2.2, -1], iG);
      c.mesh(new T.TorusGeometry(0.3, 0.05, 8, 16), DARK, iG).position.set(-3.4, 1.4, -1);
      c.label('бензин', [-4, 3, -1], 0.3);
      c.userData = { k: 0, goal: 0, cars: [] };
      for (var i = 0; i < 4; i++) c.userData.cars.push(car(c, 1.5 + (i % 2) * 2.4, -1.5 + Math.floor(i / 2) * 1.8, [BLUE, GREEN, PURPLE, SILVER][i], iC));
      c.label('спрос на машины', [2.7, 2.4, -0.6], 0.28);
      var pG = c.box3(0.8, 1, 0.8, RED, [-4, 0.5, 2], 'Цена бензина.'); c.label('цена бензина', [-4, -0.3, 2.8], 0.22);
      arrow(c, [-2.6, 2.6, 0], [0.4, 2.6, 0], GREY, '<b>Обратная связь:</b> цена одного ↑ → спрос на другой ↓.');
      c.mesh(new T.BoxGeometry(0.9, 0.6, 0.12), DARK, 'Ноутбук и зарядка — ещё один пример лектора.').position.set(-1.2, 0.35, 2.4);
      c.label('ноутбук + зарядка', [-1.2, 1.1, 2.4], 0.2, '#8b93b5');
      c.onFrame(function () {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        var h = 1 + 2 * u.k; pG.scale.y = h; pG.position.y = h / 2;
        u.cars.forEach(function (m, i) { m.visible = i < Math.round(4 - 3 * u.k); });
      });
    },
    chips: [
      { t: 'Бензин дорожает', on: function (c) { c.userData.goal = 1; c.say('Цена бензина ↑ → спрос на автомобили ↓. <b>Обратная связь.</b>'); } },
      { t: 'Как было', on: function (c) { c.userData.goal = 0; c.say('Обычные цены.'); } }
    ]
  });

  /* ======================= 11. Число покупателей ======================= */
  reg('ss-buyers3d', {
    title: 'Две аудитории, два киоска мороженого', lead: 'Пример лектора: мороженое продают в двух аудиториях. Где спрос больше? Там, где больше людей.',
    radius: 15, phi: 1.0, theta: 0.2, targetY: 1, height: 400, hint: 'Нажми на аудиторию.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      function room(x, n, info, lab) {
        c.box3(5, 0.1, 5, '#2c3350', [x, 0.05, 0], info);
        c.box3(1.2, 1, 0.6, '#9fd3ff', [x, 0.5, -2], info); icecream(c, x, -2, info, null, 0.6).position.y = 1;
        for (var i = 0; i < n; i++) person(c, x - 1.8 + (i % 5) * 0.9, -0.6 + Math.floor(i / 5) * 0.9, [BLUE, RED, GREEN, PURPLE, ORANGE][i % 5], info, null, 0.7);
        c.label(lab, [x, 2.6, -2], 0.28);
      }
      room(-3.2, 3, '<b>Мало людей</b> — мало покупателей — спрос небольшой.', 'мало людей');
      room(3.2, 15, '<b>Много людей</b> — больше покупателей — спрос больше. Число покупателей — важнейший фактор спроса.', 'много людей');
    }
  });

  /* ======================= 12. Сдвиг кривой и движение по ней ======================= */
  reg('ss-shift3d', {
    autorotate: false,
    title: 'Движение по кривой или сдвиг кривой?', lead: 'Цена меняется — шарик едет по кривой (меняется величина спроса). Меняется доход или другой фактор — переезжает вся кривая (меняется спрос).',
    radius: 13, phi: 1.2, theta: 0.15, targetY: 2.6, height: 440, hint: 'Нажимай кнопки по очереди.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      axes(c, -4.5, 0, 9.5, 6.2);
      var ghost = tube(c, [[-4, 5.5], [-2, 3.4], [0.5, 1.9], [3.5, 0.8]], GREY, 'Исходная кривая спроса D₁.');
      ghost.material.transparent = true; ghost.material.opacity = 0.35;
      c.label('D₁', [3.8, 1.4, 0], 0.28, '#8b93b5');
      var g = new T.Group(); c.root.add(g);
      var d = tube(c, [[-4, 5.5], [-2, 3.4], [0.5, 1.9], [3.5, 0.8]], BLUE, '<b>Кривая спроса.</b> Её сдвигают все факторы, кроме цены.', g);
      var dl = c.label('D₂', [3.8, 1.4, 0], 0.28, '#5b8def'); g.add(dl);
      var ball = glow(c, GOLD, 0.27, 'Точка — величина спроса при текущей цене.');
      c.userData = { u: 0.35, ug: 0.35, sx: 0, sg: 0 };
      c.onFrame(function () {
        var s = c.userData; s.u = lerp(s.u, s.ug, 0.06); s.sx = lerp(s.sx, s.sg, 0.06);
        g.position.x = s.sx; dl.visible = Math.abs(s.sx) > 0.3;
        var p = d.userData.curve.getPoint(s.u); ball.position.set(p.x + s.sx, p.y, p.z);
      });
    },
    chips: [
      { t: 'Цена ↓', on: function (c) { c.userData.ug = 0.8; c.say('Цена <b>упала</b> → шарик съехал вниз по кривой → <b>величина спроса</b> выросла. Кривая на месте.'); } },
      { t: 'Цена ↑', on: function (c) { c.userData.ug = 0.12; c.say('Цена <b>выросла</b> → движение <b>по</b> кривой вверх → величина спроса ↓.'); } },
      { t: 'Доход ↑', on: function (c) { c.userData.sg = 2.2; c.say('Любители мороженого <b>разбогатели</b>, цена та же → вся кривая <b>сдвинулась вправо</b>: спрос вырос.'); } },
      { t: 'Чай подешевел', on: function (c) { c.userData.sg = -1.8; c.say('Например, подешевел заменитель → кривая спроса <b>сдвинулась влево</b>: спрос упал.'); } },
      { t: 'Сброс', on: function (c) { c.userData.ug = 0.35; c.userData.sg = 0; c.say('Исходное положение.'); } }
    ]
  });

  /* ======================= 13. Исключения из закона спроса ======================= */
  reg('ss-exceptions3d', {
    title: 'Исключения из закона спроса', lead: 'Четыре витрины — четыре случая, когда «дороже → меньше покупают» не работает: ажиотаж, новинка, устаревший товар, товар Гиффена.',
    radius: 15, phi: 1.05, theta: 0.2, targetY: 1.2, height: 420, hint: 'Нажми на витрину или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var iA = '<b>1. Ажиотажный спрос.</b> 24 февраля 2022 года: цены росли, а спрос всё равно рос — люди боялись, что дальше будет ещё дороже или товар исчезнет.';
      c.box3(2.2, 2, 0.6, WOOD, [-6, 1, -1], iA);
      for (var i = 0; i < 4; i++) person(c, -6.6 + (i % 2) * 1.1, 0.4 + Math.floor(i / 2) * 0.9, [RED, BLUE, GREEN, ORANGE][i], iA, null, 0.75);
      c.label('ажиотаж', [-6, 2.8, -1], 0.27);
      var iP = '<b>2. Цена как показатель качества.</b> Айфон 17 не может стоить дешевле, чем 16 или 13: он новее и лучше. Новинку покупают дороже именно поэтому.';
      var ph = c.box3(0.9, 1.7, 0.12, DARK, [-2, 1.4, -1], iP); c.box3(0.8, 1.55, 0.13, '#5b8def', [-2, 1.4, -0.99], iP);
      c.label('айфон 17', [-2, 2.8, -1], 0.27);
      var iW = '<b>3. Устаревший товар.</b> Пишущая машинка дешевле компьютера, но её не покупают: на компьютере быстрее и ошибки исправляются автоматически.';
      c.box3(1.6, 0.5, 1.1, '#2f2f2f', [2, 0.25, -1], iW); c.box3(1.4, 0.7, 0.1, '#2f2f2f', [2, 0.8, -1.5], iW);
      c.box3(1, 0.1, 0.8, PAPER, [2, 1.25, -1.4], iW).rotation.x = -0.5;
      c.label('пишущая машинка', [2, 2.8, -1], 0.27);
      var iG = '<b>4. Товары Гиффена.</b> Картофель у бедных семей: дорожает — а его покупают больше, потому что на мясо денег не остаётся.';
      for (var j = 0; j < 9; j++) { var p = c.mesh(new T.SphereGeometry(0.28, 10, 8), POTATO, iG); p.scale.set(1.2, 0.85, 1); p.position.set(5.4 + (j % 3) * 0.6, 0.25 + Math.floor(j / 3) * 0.4, -1); }
      c.label('Гиффен', [6, 2.8, -1], 0.27);
      c.box3(17, 0.08, 0.4, RED, [0, 0.04, 1.6], 'Во всех четырёх случаях закон спроса <b>не действует</b>.');
    },
    chips: [
      { t: 'Ажиотаж', on: function (c) { c.setView(-0.4, 1.0, 9, 1, -6); c.say('Паника: цена ↑, а спрос всё равно ↑.'); } },
      { t: 'Новинка', on: function (c) { c.setView(-0.1, 1.0, 9, 1.2, -2); c.say('Дорогое = новое и лучшее.'); } },
      { t: 'Устарело', on: function (c) { c.setView(0.1, 1.0, 9, 1, 2); c.say('Подешевело, но никому не нужно.'); } },
      { t: 'Гиффен', on: function (c) { c.setView(0.4, 1.0, 9, 1, 6); c.say('Бедность: цена ↑ — покупают больше.'); } }
    ]
  });

  /* ======================= 14. Цена спроса и цена предложения ======================= */
  reg('ss-pricegap3d', {
    title: 'Потолок покупателя и пол продавца', lead: 'Аренда жилья: покупатель готов платить максимум 20 тысяч, хозяин согласен минимум на 17. Сделка возможна в зелёной зоне между ними.',
    radius: 12, phi: 1.2, theta: 0.3, targetY: 2.2, height: 420, hint: 'Нажми на плиту или человека.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var iD = '<b>Цена спроса — 20 тысяч.</b> Максимум, который покупатель готов заплатить. Выше — не снимет.';
      var iS = '<b>Цена предложения — 17 тысяч.</b> Минимум, за который продавец согласен сдать. Ниже — не отдаст.';
      var iZ = '<b>Зона сделки</b> — от 17 до 20 тысяч. Здесь обоим выгодно договориться.';
      c.box3(4, 0.15, 3, BLUE, [0, 4, 0], iD); c.label('цена спроса: 20 тыс.', [3.6, 4, 0], 0.26, '#5b8def');
      c.box3(4, 0.15, 3, ORANGE, [0, 1.6, 0], iS); c.label('цена предложения: 17 тыс.', [3.6, 1.6, 0], 0.26, '#e39b5b');
      var z = c.box3(3.8, 2.2, 2.8, GREEN, [0, 2.8, 0], iZ); z.material.transparent = true; z.material.opacity = 0.25;
      c.label('сделка', [0, 2.8, 0], 0.3, '#4cc38a');
      person(c, -3.5, 1, BLUE, '<b>Покупатель</b> (снимает жильё).', null, 1.2);
      person(c, -3.5, -1.2, ORANGE, '<b>Продавец</b> (сдаёт жильё).', null, 1.2);
      c.box3(2, 1.4, 1.6, STONE, [0, 0.7, 0], 'Квартира.');
      var r = c.mesh(new T.ConeGeometry(1.6, 0.8, 4), RED, 'Квартира.'); r.position.set(0, 1.8, 0); r.rotation.y = Math.PI / 4; r.scale.set(0.9, 1, 0.75);
      var pin = glow(c, GOLD, 0.22, 'Итоговая цена договора — где-то внутри зоны.');
      c.onFrame(function (t) { pin.position.set(-2.4, 2.8 + 0.9 * Math.sin(t), 0); });
    }
  });

  /* ======================= 15. Факторы предложения ======================= */
  reg('ss-supplyfactors3d', {
    title: 'Завод и факторы предложения', lead: 'Завод выпускает товар. Вокруг — факторы: цена, ресурсы, технологии, налоги (НДС 22 %), цены других товаров, ожидания, число продавцов.',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1.2, height: 420, hint: 'Нажми на завод или на столбик.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>Производитель (продавец).</b> Сколько он предложит, зависит от факторов вокруг.';
      c.box3(3, 1.6, 2, STONE, [0, 0.8, 0], iF);
      var pipe = c.mesh(new T.CylinderGeometry(0.3, 0.35, 2.2, 14), '#a0522d', iF); pipe.position.set(1, 2.7, -0.4);
      c.box3(0.9, 0.9, 0.1, '#9fd3ff', [-0.7, 0.9, 1.01], iF);
      var smoke = [];
      for (var s = 0; s < 4; s++) { var m = c.mesh(new T.SphereGeometry(0.3, 10, 8), '#cfd3dc', null); smoke.push(m); }
      var F = [
        ['цена ↑', GOLD, '<b>Цена</b> — главный фактор (лектор). Цена ↑ → хотят производить и продавать больше.', 1],
        ['ресурсы', '#a0522d', '<b>Цены на ресурсы</b> [доб.]: сырьё и труд дороже → предложение ↓.', -1],
        ['технологии', GREEN, '<b>Технологии</b> (лектор): лучше технологии → дешевле производить → предложение ↑.', 1],
        ['налоги 22 %', RED, '<b>Налоги</b>: с 2026 года НДС — 22 %. Налоги ↑ → предложение ↓; субсидии — наоборот.', -1],
        ['другие товары', PURPLE, '<b>Цены на другие товары</b> [доб.]: выгоднее делать другое → этого товара предложат меньше.', -1],
        ['ожидания', ORANGE, '<b>Ожидания продавцов</b> [доб.]: ждут роста цен — придерживают товар.', -1],
        ['продавцы', BLUE, '<b>Число продавцов</b> [доб.]: больше продавцов → предложение ↑.', 1]
      ];
      F.forEach(function (f, i) {
        var a = i / F.length * Math.PI * 2 + 0.3, x = Math.cos(a) * 5.3, z = Math.sin(a) * 5.3, h = 1.6;
        c.box3(0.9, h, 0.9, f[1], [x, h / 2, z], f[2]);
        c.label(f[0] + (f[3] > 0 ? ' ↑' : ' ↓'), [x, h + 0.6, z], 0.25, f[3] > 0 ? '#4cc38a' : '#e0645a');
      });
      c.onFrame(function (t) { smoke.forEach(function (m, i) { var k = (t * 0.4 + i / 4) % 1; m.position.set(1 + k * 0.6, 3.9 + k * 2, -0.4); m.scale.setScalar(0.6 + k); m.material.transparent = true; m.material.opacity = 1 - k; }); });
    }
  });

  /* ======================= 16. Кривая предложения ======================= */
  reg('ss-supply3d', {
    autorotate: false,
    title: 'Кривая предложения', lead: 'Кривая S идёт вверх: чем выше цена, тем больше товара предлагают. При высокой цене на рынок приходят новые продавцы.',
    radius: 13, phi: 1.2, theta: 0.15, targetY: 2.6, height: 420, hint: 'Выбери цену кнопкой.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      axes(c, -4.5, 0, 9.5, 6.2);
      var iS = '<b>Кривая предложения S</b> идёт снизу вверх. <b>Закон предложения:</b> чем выше цена, тем больше количество предлагаемого товара.';
      var s = tube(c, [[-3.8, 0.8], [-1, 2], [1.5, 3.5], [4, 5.6]], ORANGE, iS);
      c.label('S (предложение)', [4, 6.3, 0], 0.28, '#e39b5b');
      var d = tube(c, [[-3.8, 5.6], [-1, 3.5], [1.5, 2], [4, 0.8]], BLUE, '<b>Кривая спроса D</b> для сравнения: она идёт вниз.');
      d.material.transparent = true; d.material.opacity = 0.4;
      c.label('D', [4.3, 1.3, 0], 0.26, '#5b8def');
      var ball = glow(c, GOLD, 0.27, 'Величина предложения при данной цене.');
      c.userData = { u: 0.3, goal: 0.3, sellers: [] };
      for (var i = 0; i < 6; i++) c.userData.sellers.push(person(c, -3 + i * 1.2, 3, [ORANGE, RED, PURPLE, GREEN, BLUE, GREY][i], 'Продавцы. При высокой цене их становится больше.', null, 0.75));
      c.onFrame(function () {
        var u = c.userData; u.u = lerp(u.u, u.goal, 0.06);
        ball.position.copy(s.userData.curve.getPoint(u.u));
        u.sellers.forEach(function (p, i) { p.visible = i < 1 + Math.round(5 * u.u); });
      });
    },
    chips: [
      { t: 'Цена низкая', on: function (c) { c.userData.goal = 0.05; c.say('Низкая цена — продавать невыгодно, предлагают мало.'); } },
      { t: 'Цена высокая', on: function (c) { c.userData.goal = 0.95; c.say('Высокая цена — выгодно: производят больше, приходят новые продавцы.'); } }
    ]
  });

  /* ======================= 17. Предложение труда ======================= */
  reg('ss-labor3d', {
    autorotate: false,
    title: 'Предложение труда загибается назад', lead: 'По вертикали — оплата за час, по горизонтали — сколько часов человек готов работать. Сначала рост оплаты = больше часов, потом человек выбирает отдых.',
    radius: 13, phi: 1.2, theta: 0.15, targetY: 2.8, height: 440, hint: 'Нажимай кнопки — оплата растёт.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      axes(c, -4.5, 0, 9.5, 6.6, null, 'часы работы', 'оплата за час');
      var iL = '<b>Кривая предложения труда</b> — единственное исключение из закона предложения (лектор). При высокой оплате человек начинает работать <b>меньше</b>.';
      var L = tube(c, [[-3.8, 0.6], [-1.5, 1.6], [0.8, 2.8], [2.2, 4], [2, 5.1], [0.6, 6]], PURPLE, iL);
      c.label('8 ч', [-1.5, 0.9, 0.6], 0.24, '#8b93b5'); c.label('12 ч', [0.8, 2.1, 0.6], 0.24, '#8b93b5'); c.label('«хоть 16!»', [2.6, 3.4, 0.6], 0.24, '#8b93b5');
      c.label('дальше — меньше', [-0.2, 6.3, 0.4], 0.24, '#e0645a');
      var ball = glow(c, GOLD, 0.27, 'Работник.');
      var clock = c.mesh(new T.CylinderGeometry(0.7, 0.7, 0.12, 30), PAPER, 'В сутках только 24 часа: при высоком доходе человек ценит свободное время.');
      clock.rotation.x = Math.PI / 2; clock.position.set(-3, 5, -1);
      var hand = c.box3(0.06, 0.55, 0.06, DARK, [-3, 5.25, -0.92], null);
      c.userData = { u: 0.2, goal: 0.2 };
      c.onFrame(function (t) {
        var u = c.userData; u.u = lerp(u.u, u.goal, 0.05);
        ball.position.copy(L.userData.curve.getPoint(u.u));
        hand.rotation.z = -t; hand.position.set(-3 + 0.27 * Math.sin(t), 5 + 0.27 * Math.cos(t), -0.92);
      });
    },
    chips: [
      { t: 'Оплата низкая', on: function (c) { c.userData.goal = 0.15; c.say('Мало платят — работают около 8 часов.'); } },
      { t: 'Оплата ×2', on: function (c) { c.userData.goal = 0.5; c.say('«Почему бы не работать 12 часов?» Рост оплаты → больше часов (эффект замещения).'); } },
      { t: 'Очень высокая', on: function (c) { c.userData.goal = 0.98; c.say('Денег и так хватает — человек выбирает отдых и работает <b>меньше</b> (эффект дохода). Кривая загнулась назад.'); } }
    ]
  });

  /* ======================= Мини-тест ======================= */
  HubWidgets.register('ss-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Спрос и предложение</b></div><p class="wg-lead">12 вопросов по лекции 19.10.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Спрос — это…', ['любое желание человека', 'платёжеспособная потребность', 'количество товара на складе'], 1, '«Хочу и могу заплатить». Пример лектора — «Мерседес».'],
      ['Цена спроса — это…', ['минимальная цена продавца', 'максимальная цена, которую готов заплатить покупатель', 'средняя цена на рынке'], 1, 'Пример: готов платить за жильё не больше 20 тысяч.'],
      ['Закон спроса: при росте цены величина спроса…', ['растёт', 'падает', 'не меняется'], 1, 'Кривая спроса идёт сверху вниз.'],
      ['Нормальный товар — это товар, спрос на который…', ['растёт с ростом дохода', 'покупают нормальные люди', 'имеет хорошее качество'], 0, 'Лектор просила не путать: это только про связь спроса и дохода.'],
      ['Маргарин, дешёвое масло, кнопочный телефон — это…', ['нормальные товары', 'предметы роскоши', 'низшие товары'], 2, 'Доход ↑ — спрос на них ↓.'],
      ['Чай подорожал. Что со спросом на кофе?', ['Вырастет — прямая связь', 'Упадёт — обратная связь', 'Не изменится'], 0, 'Заменители: цена одного ↑ → спрос на другой ↑.'],
      ['Бензин подорожал. Что со спросом на автомобили?', ['Вырастет', 'Упадёт — обратная связь', 'Не изменится'], 1, 'Комплементы: цена одного ↑ → спрос на другой ↓.'],
      ['Любители мороженого разбогатели, цена та же. Что происходит на графике?', ['Движение по кривой', 'Сдвиг кривой спроса вправо', 'Сдвиг кривой влево'], 1, 'Все факторы, кроме цены, сдвигают кривую.'],
      ['Банк обещает 20 % годовых, но только 2 месяца. Сколько вы получите?', ['20 %', 'около 3,3 %', '40 %'], 1, '20 : 12 × 2 ≈ 3,3 %.'],
      ['Что из этого — исключение из закона спроса?', ['Ажиотажный спрос', 'Подешевевшее мороженое', 'Рост числа покупателей'], 0, 'Ещё: цена как показатель качества, устаревшие товары, товары Гиффена.'],
      ['Закон предложения: чем выше цена, тем…', ['меньше предлагают', 'больше предлагают', 'продавцы уходят с рынка'], 1, 'Кривая предложения идёт вверх.'],
      ['Единственное исключение из закона предложения (по лектору)?', ['Предложение труда', 'Предложение золота', 'Предложение хлеба'], 0, 'При очень высокой оплате человек выбирает отдых и работает меньше.']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 160px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 9 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
      qo.innerHTML = '<small style="color:var(--muted)">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + Q[i][0];
      Q[i][1].forEach(function (t, k) {
        btn('<b>' + t + '</b>').onclick = function () {
          if (done) return; done = true; var ok = k === Q[i][2]; if (ok) score++;
          Array.prototype.forEach.call(ch.children, function (x, j) { if (j === Q[i][2]) x.classList.add('on'); else if (j === k) x.classList.add('off'); });
          res.style.display = ''; res.innerHTML = (ok ? '✅ Верно. ' : '❌ Правильно: <b>' + Q[i][1][Q[i][2]] + '</b>. ') + Q[i][3];
          btn('<b>Дальше ›</b>').onclick = function () { i++; done = false; res.style.display = 'none'; draw(); };
        };
      });
    }
    draw();
  });
})();
