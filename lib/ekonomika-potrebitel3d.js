/* 3D-модели к конспекту «Экономика. Олигополия, монопсония, антитрестовское законодательство. Теория поведения потребителя» (лекция 16.11), часть 2.
   В Markdown: @@graph:pt-traits3d@@ @@graph:pt-twoways3d@@ @@graph:pt-glasses3d@@ @@graph:pt-gossen1-3d@@
   @@graph:pt-gossen2-3d@@ @@graph:pt-indiff3d@@ @@graph:pt-budget3d@@ @@graph:pt-demand3d@@ @@graph:pt-checkout3d@@
   Нужен lib/ekonomika-firma3d.js (window.FirmaKit). */
(function () {
  'use strict';
  var K = window.FirmaKit;
  if (!K || !window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.22) * 1.3, col); }; b(c); };
    K.reg(name, opts);
  }
  var C = K.C, person = K.person, coin = K.coin, stack = K.stack;

  /* ======================= 1. Четыре характеристики потребительского поведения ======================= */
  reg('pt-traits3d', {
    autorotate: false,
    title: 'Что определяет поведение потребителя', lead: 'Потребитель в центре, вокруг — четыре характеристики его поведения из лекции. Нажми на шар.',
    radius: 11, phi: 0.95, theta: 0, targetY: 1.2, height: 430, hint: 'Нажми на шар или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(6.5);
      person(c, 0, 0, C.BLUE, '<b>Потребитель</b> (домашнее хозяйство) решает: что купить, сколько, хватит ли денег.', null, 1.4);
      var P = [
        ['доход', C.GOLD, '<b>1. Спрос зависит от уровня дохода.</b> Чем больше денег, тем больше и разнообразнее покупки.'],
        ['максимум\nполезности', C.GREEN, '<b>2. Каждый потребитель стремится максимизировать совокупную (общую) полезность</b> — получить от своих денег как можно больше удовлетворения.'],
        ['ясные\nпредпочтения', C.PURPLE, '<b>3. Средний потребитель имеет отчётливую систему предпочтений.</b> Бывают люди, для которых «чая не существует», только кофе, — но теория говорит об <b>усреднённом</b> потребителе.'],
        ['заменители\nи дополнения', C.RED, '<b>4. На спрос влияет наличие или отсутствие взаимодополняемых и взаимозаменяемых товаров</b> (кофе и сахар — дополняют; чай и кофе — заменяют).']
      ];
      c.S = { b: [] };
      P.forEach(function (p, i) {
        var a = i * Math.PI / 2 + Math.PI / 4, x = Math.cos(a) * 3.3, z = Math.sin(a) * 3.3;
        var s = K.glow(c, p[1], 0.55, p[2]); s.position.set(x, 1.4, z); c.S.b.push(s);
        c.link([0, 1.2, 0], [x, 1.4, z], C.GREY, 0.03, null);
        c.label(p[0], [x, 2.7, z], 0.26);
      });
      c.onFrame(function (t) { c.S.b.forEach(function (s, i) { s.position.y = 1.4 + Math.sin(t * 1.5 + i) * 0.15; }); });
    },
    chips: [0, 1, 2, 3].map(function (i) {
      return { t: ['Доход', 'Полезность', 'Предпочтения', 'Заменители'][i], on: function (c) { var s = c.S.b[i]; c.pick(s); c.say(s.userData.info); } };
    })
  });

  /* ======================= 2. Два подхода: кардиналистский и ординалистский ======================= */
  reg('pt-twoways3d', {
    autorotate: false,
    title: 'Два подхода к полезности: посчитать или упорядочить', lead: 'Слева — кардиналисты: полезность можно измерить числом (в «ютилах»). Справа — ординалисты: посчитать нельзя, но наборы благ можно расставить по местам.',
    radius: 16, phi: 1.05, theta: 0, targetY: 1.6, height: 440, hint: 'Нажми на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iC = '<b>Кардиналистский (количественный) подход:</b> полезность можно измерить. Единица — условный <b>ютиль</b> (от англ. utility — полезность). Чем больше полезность, тем выше число.';
      var vals = [10, 7, 4, 2];
      vals.forEach(function (v, i) {
        var h = v * 0.25, b = c.box3(0.7, h, 0.7, C.GOLD, [-5.2 + i * 0.95, h / 2, 0], iC);
        c.label(v + ' ют.', [-5.2 + i * 0.95, h + 0.4, 0], 0.17);
      });
      c.label('КАРДИНАЛИСТЫ\n«посчитаем»', [-3.8, 4, 0], 0.22, '#f0c36b');
      var iO = '<b>Ординалистский (порядковый) подход:</b> полезность посчитать нельзя, но потребитель может <b>сравнить</b> наборы благ и <b>ранжировать</b> их по степени предпочтительности: 1-е, 2-е, 3-е место.';
      [[2.2, 1.6, '2'], [3.6, 2.4, '1'], [5, 1.0, '3']].forEach(function (p) {
        c.box3(1.3, p[1], 1.3, C.BLUE, [p[0], p[1] / 2, 0], iO);
        c.label(p[2] + '-е место', [p[0], p[1] + 0.45, 0], 0.17);
      });
      c.label('ОРДИНАЛИСТЫ\n«расставим по местам»', [3.6, 4, 0], 0.22, '#5b8def');
    },
    chips: [
      { t: 'Кардиналисты', on: function (c) { c.setView(0, 1.05, 8, 1.4, -3.8, 0); c.say('Кардиналисты: полезность можно рассчитать и измерить; она представлена количественной оценкой. Это прежде всего <b>австрийская школа</b> (субъективная теория ценности, вторая половина XIX века) и <b>законы Госсена</b>.'); } },
      { t: 'Ординалисты', on: function (c) { c.setView(0, 1.05, 8, 1.4, 3.6, 0); c.say('Ординалисты очень сомневались, что полезность можно посчитать: очки для близорукого бесценны, а другому «вообще не нужны». Но наборы благ можно <b>ранжировать</b>. Среди ординалистов лектор назвала <b>Парето</b>. Их инструменты — <b>кривые безразличия</b> и <b>бюджетная линия</b>.'); } },
      { t: 'Рациональный', on: function (c) { c.setView(0, 1.05, 12, 1.4, 0, 0); c.say('Оба подхода рассматривают <b>рационального</b> потребителя: он покупает нужные вещи, а не всё подряд, и его бюджет <b>ограничен</b>.'); } }
    ]
  });

  /* ======================= 3. Очки: от чего зависит субъективная полезность ======================= */
  reg('pt-glasses3d', {
    autorotate: false,
    title: 'Очки: почему полезность субъективна', lead: 'Пример лектора: для того, кто плохо видит, очки — огромная полезность, а для человека с хорошим зрением — почти никакой. Нажми на три фактора полезности.',
    radius: 7.5, phi: 1.0, theta: 0.15, targetY: 1.1, height: 430, hint: 'Нажимай факторы по очереди.',
    build: function (c) {
      var T = c.THREE; c.ground(6);
      function glasses(x, z, info) {
        var g = K.group(c, x, 1.0, z);
        [-0.32, 0.32].forEach(function (dx) { var r = c.mesh(new T.TorusGeometry(0.25, 0.04, 10, 28), C.DARK, info); r.position.x = dx; g.add(r); var l = c.mesh(new T.CircleGeometry(0.23, 24), '#9fd3ff', info, { transparent: true, opacity: 0.5 }); l.position.x = dx; g.add(l); });
        g.add(c.link([-0.07, 0, 0], [0.07, 0, 0], C.DARK, 0.03, info));
        return g;
      }
      c.S = { gl: [] };
      for (var i = 0; i < 4; i++) c.S.gl.push(glasses(-1.5 + i * 1, 0, 'Очки. Чем меньше их у человека, тем ценнее каждые.'));
      person(c, -3.2, 0.5, C.BLUE, 'Человек, который <b>без очков не может прочитать ничего</b>. Для него очки — огромная полезность.', null, 1.1);
      person(c, 3.2, 0.5, C.GREEN, 'Человек с хорошим зрением: очки ему «вообще не нужны» — полезность почти нулевая.', null, 1.1);
      var bar = c.box3(0.5, 1, 0.5, C.GOLD, [0, 0.5, -1.6], 'Высота столбика — <b>полезность ещё одной пары очков</b>.');
      c.S.bar = bar; c.S.h = 3; c.S.th = 3; c.S.n = 1;
      c.onFrame(function () {
        c.S.h = K.lerp(c.S.h, c.S.th, 0.06); bar.scale.y = c.S.h; bar.position.y = c.S.h / 2;
        c.S.gl.forEach(function (g, i) { g.visible = i < c.S.n; });
      });
    },
    chips: [
      { t: '1. Значимость', on: function (c) { c.S.n = 1; c.S.th = 3.2; c.say('<b>Фактор 1 — степень значимости блага:</b> насколько важна потребность, которую оно удовлетворяет. Без очков не прочитать ни строчки — значит, полезность огромная.'); } },
      { t: '2. Запас', on: function (c) { c.S.n = 4; c.S.th = 0.8; c.say('<b>Фактор 2 — имеющийся запас блага.</b> Если у меня несколько пар очков, потеря одной — не трагедия. Если пара единственная — потеря очень болезненна.'); } },
      { t: '3. Насыщение', on: function (c) { c.S.n = 4; c.S.th = 0.3; c.say('<b>Фактор 3 — степень насыщения потребности данным благом.</b> Когда потребность уже удовлетворена, каждая следующая единица почти ничего не добавляет.'); } }
    ]
  });

  /* ======================= 4. Первый закон Госсена ======================= */
  reg('pt-gossen1-3d', {
    autorotate: false,
    title: 'Первый закон Госсена: каждое следующее пирожное — «менее вкусное»', lead: 'Золотые столбики — предельная полезность MU каждого следующего пирожного: она убывает. Синяя башня — общая полезность TU: растёт, но всё медленнее. Добавляй пирожные кнопкой.',
    radius: 13, phi: 1.1, theta: 0.15, targetY: 2, height: 450, hint: 'Нажимай «+1 пирожное».',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var MU = [5, 4, 3, 2, 1, 0, -1];
      c.S = { n: 0, mu: [], tu: [], cakes: [] };
      MU.forEach(function (m, i) {
        var x = -5 + i * 1.2, h = Math.max(Math.abs(m) * 0.5, 0.05);
        var info = m > 0 ? '<b>' + (i + 1) + '-е пирожное</b>: предельная полезность MU = ' + m + ' ют.' : m === 0 ? '<b>' + (i + 1) + '-е пирожное</b>: MU = 0 — больше не хочется. Здесь <b>общая полезность максимальна</b>.' : '<b>' + (i + 1) + '-е пирожное</b>: MU < 0 — уже плохо. Общая полезность начинает падать.';
        var b = c.box3(0.7, h, 0.7, m >= 0 ? C.GOLD : C.RED, [x, m >= 0 ? h / 2 : -h / 2 + 0.02, 1], info); b.visible = false; c.S.mu.push(b);
        var cake = c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.25, 18), C.CREAM, info); cake.position.set(x, 0.13, 2.4); cake.visible = false; c.S.cakes.push(cake);
        var cr = c.mesh(new T.SphereGeometry(0.1, 10, 8), C.RED, info); cr.position.set(0, 0.2, 0); cake.add(cr);
      });
      var tuSum = 0;
      MU.forEach(function (m, i) {
        tuSum += m; var x = -5 + i * 1.2, h = tuSum * 0.25;
        var b = c.box3(0.5, h, 0.5, C.BLUE, [x, h / 2, -1], 'Общая полезность TU после ' + (i + 1) + '-го пирожного = <b>' + tuSum + ' ют.</b>'); b.visible = false; c.S.tu.push(b);
      });
      c.label('MU', [-6.2, 1.5, 1], 0.24, '#f0c36b'); c.label('TU', [-6.2, 2.5, -1], 0.24, '#5b8def');
      for (var k = 0; k < 3; k++) { c.S.mu[k].visible = c.S.tu[k].visible = c.S.cakes[k].visible = true; } c.S.n = 3;
    },
    chips: [
      { t: '+1 пирожное', on: function (c) { if (c.S.n >= 7) return; var i = c.S.n++; c.S.mu[i].visible = c.S.tu[i].visible = c.S.cakes[i].visible = true; var m = [5, 4, 3, 2, 1, 0, -1][i]; c.say(i === 0 ? 'Первое пирожное — самое вкусное: <b>MU = 5</b>.' : m > 0 ? 'Каждое следующее приносит меньше удовольствия: <b>MU = ' + m + '</b>. Общая полезность растёт, но медленнее.' : m === 0 ? '<b>MU = 0</b> — сыт. Общая полезность <b>максимальна</b>.' : 'MU стала <b>отрицательной</b> — общая полезность падает. Как мальчики из «Ералаша», объевшиеся сладким.'); } },
      { t: 'Закон', on: function (c) { c.say('<b>Первый закон Госсена (закон убывающей предельной полезности):</b> величина полезности каждой дополнительной единицы блага <b>уменьшается</b>. Положения: 1) полезность убывает; 2) каждую единицу сравнивают с первой.'); } },
      { t: 'Сначала', on: function (c) { c.S.n = 0; c.S.mu.concat(c.S.tu, c.S.cakes).forEach(function (b) { b.visible = false; }); c.say('Начнём сначала.'); } }
    ]
  });

  /* ======================= 5. Второй закон Госсена: обед в столовой ======================= */
  reg('pt-gossen2-3d', {
    autorotate: false,
    title: 'Второй закон Госсена: обед в столовой', lead: 'У студента 4 «рубля». Каждый рубль можно потратить на салат, суп или второе. Столбик — полезность следующего рубля, потраченного на это блюдо. Рациональный выбор — каждый раз брать самый высокий столбик.',
    radius: 12, phi: 1.1, theta: 0.1, targetY: 1.6, height: 450, hint: 'Нажимай «Потратить рубль».',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      c.S = { D: [['салат', C.GREEN, [6, 3, 1]], ['суп', C.ORANGE, [8, 5, 2]], ['второе', C.RED, [9, 6, 3]]], k: [0, 0, 0], bars: [], plates: [], left: 4 };
      c.S.D.forEach(function (d, i) {
        var x = -3 + i * 3;
        var p = c.mesh(new T.CylinderGeometry(0.9, 0.7, 0.15, 28), C.WHITE, '<b>' + d[0] + '</b>'); p.position.set(x, 0.08, 1.8); c.S.plates.push(p);
        var b = c.box3(0.9, 1, 0.9, d[1], [x, 0.5, -0.5], 'Полезность <b>следующего рубля</b>, потраченного на ' + d[0] + '.'); c.S.bars.push(b);
        c.label(d[0], [x, -0.5, 2.8], 0.22);
      });
      c.S.coins = stack(c, 3.9, 2.6, 4, 'Деньги студента: <b>4 рубля</b> — бюджет ограничен.');
      c.onFrame(function () {
        c.S.D.forEach(function (d, i) { var v = d[2][c.S.k[i]] || 0.2, h = v * 0.4; var b = c.S.bars[i]; b.scale.y = K.lerp(b.scale.y, h, 0.08); b.position.y = b.scale.y / 2; c.S.plates[i].scale.setScalar(1 + c.S.k[i] * 0.15); });
        c.S.coins.forEach(function (m, i) { m.visible = i < c.S.left; });
      });
    },
    chips: [
      { t: 'Потратить рубль', on: function (c) {
        if (c.S.left <= 0) { c.say('Деньги кончились. Итог: <b>салат 1, суп 1, второе 2</b>. Последний рубль на каждое блюдо дал почти одинаковую полезность (6, 5, 6) — это и есть <b>равновесие по Госсену</b>.'); return; }
        var best = 0, bv = -1; c.S.D.forEach(function (d, i) { var v = d[2][c.S.k[i]] || 0; if (v > bv) { bv = v; best = i; } });
        c.S.k[best]++; c.S.left--;
        c.say('Рубль ушёл на <b>' + c.S.D[best][0] + '</b> (полезность ' + bv + '). Следующий рубль на это блюдо даст уже меньше — первый закон Госсена.');
      } },
      { t: 'Закон', on: function (c) { c.say('<b>Второй закон Госсена:</b> при стремлении к максимизации общей полезности <b>предельные полезности всех потребляемых благ (в расчёте на рубль) должны быть одинаковы</b>: MU₁/P₁ = MU₂/P₂ = … Нерациональный покупатель хватает всё с прилавка и тратит всё на одно; рациональный — берёт салат, суп, второе.'); } },
      { t: 'Сначала', on: function (c) { c.S.k = [0, 0, 0]; c.S.left = 4; c.say('Снова 4 рубля.'); } }
    ]
  });

  /* ======================= 6. Карта кривых безразличия ======================= */
  reg('pt-indiff3d', {
    autorotate: false,
    title: 'Кривые безразличия: «мне всё равно, какой набор»', lead: 'По осям — количество благ A и B. Все точки одной кривой дают потребителю одинаковую полезность. Чем дальше кривая от начала координат, тем она лучше. Несколько кривых — карта безразличия.',
    radius: 12, phi: 1.25, theta: 0, targetY: 2.3, targetX: 0.5, height: 450, hint: 'Нажимай кнопки.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      K.axes(c, -3, 0, 7, 5.5, null, 'благо A', 'благо B');
      c.S = { curves: [] };
      [[2.2, C.GREEN, 'U₁'], [3.6, C.GOLD, 'U₂'], [5.2, C.RED, 'U₃']].forEach(function (u, j) {
        var pts = []; for (var i = 0; i <= 24; i++) { var x = 0.35 + i * 0.25; var y = u[0] * u[0] / (x * 3.2); if (y < 5.3) pts.push([-3 + x, y, 0]); }
        var m = K.tube(c, pts, u[1], '<b>Кривая безразличия ' + u[2] + '.</b> Любая её точка — набор благ A и B с <b>одинаковой полезностью</b>. ' + (j ? 'Она дальше от начала координат, чем предыдущая, — наборы на ней <b>лучше</b>.' : ''));
        c.S.curves.push(m); var e = pts[pts.length - 1]; c.label(u[2], [e[0] + 0.4, e[1] + 0.3, 0], 0.22);
      });
      var p1 = K.glow(c, C.BLUE, 0.17, 'Набор 1: <b>много B, мало A</b>.'); p1.position.set(-3 + 0.8, 3.6 * 3.6 / (0.8 * 3.2), 0.1);
      var p2 = K.glow(c, C.BLUE, 0.17, 'Набор 2: <b>мало B, много A</b>. Та же кривая — та же полезность. Потребителю всё равно.'); p2.position.set(-3 + 3.5, 3.6 * 3.6 / (3.5 * 3.2), 0.1);
    },
    chips: [
      { t: 'Всё равно', on: function (c) { c.say('<b>Кривая безразличия</b> показывает разные комбинации двух экономических благ, имеющих <b>одинаковую полезность</b> для потребителя. Меньше одного — зато больше другого.'); } },
      { t: 'Карта', on: function (c) { c.say('Несколько кривых образуют <b>карту безразличия</b>. Чем дальше кривая от начала координат, тем больше полезность.'); } },
      { t: 'Свойства', on: function (c) { c.say('Свойства: кривые безразличия <b>никогда не пересекаются</b>, имеют <b>отрицательный наклон</b> и [ДОБАВЛЕНО] обычно <b>выпуклы к началу координат</b>.'); } }
    ]
  });

  /* ======================= 7. Бюджетная линия и равновесие ======================= */
  reg('pt-budget3d', {
    autorotate: false,
    title: 'Бюджетная линия и равновесие потребителя', lead: 'Хочется на самую дальнюю кривую, но денег не хватает. Бюджетная линия показывает, что можно купить на весь доход. Равновесие — точка, где бюджетная линия касается самой высокой доступной кривой безразличия.',
    radius: 12, phi: 1.25, theta: 0, targetY: 2.3, targetX: 0.5, height: 460, hint: 'Меняй доход и цену.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      K.axes(c, -3, 0, 7, 5.5, null, 'благо A', 'благо B');
      [[2.2, C.GREEN], [3.0, C.GOLD], [3.8, C.RED]].forEach(function (u) {
        var pts = []; for (var i = 0; i <= 24; i++) { var x = 0.35 + i * 0.25; var y = u[0] * u[0] / (x * 2); if (y < 5.3) pts.push([-3 + x, y, 0]); }
        K.tube(c, pts, u[1], 'Кривая безразличия.', null, 0.05);
      });
      var line = c.link([-3, 4, 0.05], [1, 0, 0.05], C.BLUE, 0.07, '<b>Бюджетная линия</b>: все наборы, которые можно купить на весь доход. Она несёт объективную информацию о <b>ценах</b> и о <b>доходе</b>.');
      var dot = K.glow(c, C.WHITE, 0.2, '<b>Равновесие потребителя</b> — точка касания бюджетной линии и кривой безразличия.');
      c.S = { I: 1, pA: 1, cur: [1, 1], line: line, dot: dot };
      c.onFrame(function () {
        c.S.cur[0] = K.lerp(c.S.cur[0], c.S.I, 0.06); c.S.cur[1] = K.lerp(c.S.cur[1], c.S.pA, 0.06);
        var yb = 4 * c.S.cur[0], xa = 4 * c.S.cur[0] / c.S.cur[1];
        var A = new T.Vector3(-3, yb, 0.05), B = new T.Vector3(-3 + xa, 0, 0.05);
        line.position.copy(A).add(B).multiplyScalar(0.5); line.scale.y = A.distanceTo(B) / Math.hypot(4, 4);
        line.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
        dot.position.set(-3 + xa / 2, yb / 2, 0.1);
      });
    },
    chips: [
      { t: 'Равновесие', on: function (c) { c.S.I = 1; c.S.pA = 1; c.say('<b>Точка касания</b> бюджетной линии и кривой безразличия — <b>равновесие потребителя</b>: самый желанный набор из тех, что <b>по карману</b>.'); } },
      { t: 'Доход ↑', on: function (c) { c.S.I = 1.3; c.say('Доход вырос — бюджетная линия <b>сдвинулась параллельно вправо</b>: доступна более высокая кривая безразличия.'); } },
      { t: 'Цена A ↓', on: function (c) { c.S.I = 1; c.S.pA = 0.65; c.say('Благо A подешевело — линия <b>повернулась</b>: на те же деньги A можно купить больше.'); } }
    ]
  });

  /* ======================= 8. Классификация спроса Лейбенстайна ======================= */
  reg('pt-demand3d', {
    autorotate: false,
    title: 'Классификация спроса Лейбенстайна', lead: 'Дерево: спрос делится на функциональный и нефункциональный, а нефункциональный — на социальный, спекулятивный и нерациональный. Социальный включает три эффекта.',
    radius: 12.5, phi: 1.15, theta: 0, targetY: 3.1, targetX: 0.8, height: 470, hint: 'Нажми на узел дерева.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      function node(x, y, col, text, info, s) { x *= 0.85; var m = c.box3((s || 1.2) * 0.8, 0.45, 0.45, col, [x, y, 0], info); c.label(text, [x, y + 0.75, 0], text.indexOf('\n') > 0 ? 0.3 : 0.2); return m; }
      c.S = {};
      node(0, 5.0, C.SILVER, 'спрос', '<b>Потребительский спрос.</b> Его классифицировал американский экономист <b>Харви Лейбенстайн</b> (родился в России).', 1.4);
      c.S.f = node(-4, 3.3, C.GREEN, 'функцио-\nнальный', '<b>Функциональный спрос</b> — спрос на то, что реально нужно, ради полезных свойств самого товара.');
      c.S.n = node(2.5, 3.3, C.GREY, 'нефунк-\nциональный', '<b>Нефункциональный спрос</b> слабо связан с полезными свойствами товара.');
      c.link([0, 4.8, 0], [-3.4, 3.5, 0], C.GREY, 0.04); c.link([0, 4.8, 0], [2.125, 3.5, 0], C.GREY, 0.04);
      c.S.s = node(-0.5, 2, C.BLUE, 'социаль-\nный', '<b>Социальный спрос</b> связан с отношением других покупателей к товару.');
      c.S.sp = node(3, 2, C.GOLD, 'спекуля-\nтивный', '<b>Спекулятивный спрос</b> — из-за высоких инфляционных ожиданий: «скупить, пока не подорожало».');
      c.S.ir = node(6, 2, C.PURPLE, 'нерацио-\nнальный', '<b>Нерациональный спрос</b> — незапланированный, из-за внезапного желания, настроения, каприза.');
      [-0.5, 3, 6].forEach(function (x) { c.link([2.125, 3.1, 0], [x * 0.85, 2.2, 0], C.GREY, 0.04); });
      c.S.b = node(-3, 0.7, C.BLUE, 'присоеди-\nнения', '<b>Эффект присоединения к большинству</b> («эффект вагона»): все покупают — и я покупаю. Лектор: по сути это <b>мода</b> (кроссовки с белой подошвой).');
      c.S.sn = node(-0.5, 0.7, C.BLUE, 'сноба', '<b>Эффект сноба</b> — ровно наоборот: все с длинными волосами — я наголо; все в одинаковых кроссовках — я с ирокезом. Выделиться из всех.');
      c.S.v = node(2, 0.7, C.BLUE, 'Веблена', '<b>Эффект Веблена</b> — престижное, <b>демонстративное</b> потребление: золотые часы, сверкающий дорогой телефон — чтобы все видели статус.');
      [-3, -0.5, 2].forEach(function (x) { c.link([-0.425, 1.8, 0], [x * 0.85, 0.9, 0], C.GREY, 0.04); });
    },
    chips: [
      { t: 'Функц.', on: function (c) { c.pick(c.S.f); c.say(c.S.f.userData.info); } },
      { t: 'Присоединения', on: function (c) { c.pick(c.S.b); c.say(c.S.b.userData.info); } },
      { t: 'Сноба', on: function (c) { c.pick(c.S.sn); c.say(c.S.sn.userData.info + ' <b>Не путайте эффект сноба и эффект Веблена!</b>'); } },
      { t: 'Веблена', on: function (c) { c.pick(c.S.v); c.say(c.S.v.userData.info); } },
      { t: 'Спекулятивный', on: function (c) { c.pick(c.S.sp); c.say(c.S.sp.userData.info + ' Пример лектора: в феврале 2022 года магазины опустошали — скупали впрок.'); } },
      { t: 'Нерациональный', on: function (c) { c.pick(c.S.ir); c.say(c.S.ir.userData.info); } }
    ]
  });

  /* ======================= 9. Касса: нерациональный спрос ======================= */
  reg('pt-checkout3d', {
    autorotate: false,
    title: 'Почему у кассы лежат жвачки и шоколадки', lead: 'Маркетологи знают про нерациональный спрос. Всё нужное уже в корзине, человек расслабился в очереди — и тут под рукой мелочи.',
    radius: 10, phi: 1.05, theta: 0.3, targetY: 1.2, height: 420, hint: 'Нажми «В очередь».',
    build: function (c) {
      var T = c.THREE; c.ground(6);
      c.box3(3, 0.9, 1, C.DARK, [0, 0.45, -1], '<b>Касса.</b> Здесь покупатель уже «выполнил программу» и расслабился.');
      var iS = '<b>Стойка у кассы</b>: жвачки, шоколадки, игрушки — товары для <b>нерационального</b> (импульсного) спроса.';
      c.box3(0.9, 1.6, 0.6, C.RED, [-2.2, 0.8, -0.3], iS);
      var items = [];
      for (var i = 0; i < 6; i++) { var it = c.box3(0.25, 0.15, 0.2, [C.GOLD, C.GREEN, C.PURPLE][i % 3], [-2.35 + (i % 2) * 0.3, 0.5 + Math.floor(i / 2) * 0.45, 0.05], iS); items.push(it); }
      var cart = c.box3(0.9, 0.6, 0.6, C.SILVER, [2.5, 0.5, 1.2], '<b>Корзина</b> с запланированными покупками — рациональная часть похода в магазин.');
      var buyer = person(c, 3.4, 1.2, C.BLUE, 'Покупатель.', null, 1);
      c.S = { k: 0, items: items, cart: cart, buyer: buyer };
      c.onFrame(function (t) {
        var x = K.lerp(3.4, -1.2, Math.min(c.S.k, 1));
        buyer.position.x = K.lerp(buyer.position.x, x, 0.04); cart.position.x = buyer.position.x - 0.9;
        if (c.S.k > 1) { items[0].position.x = K.lerp(items[0].position.x, cart.position.x, 0.05); items[0].position.y = K.lerp(items[0].position.y, 0.9, 0.05); items[0].position.z = K.lerp(items[0].position.z, 1.2, 0.05); }
      });
    },
    chips: [
      { t: 'В очередь', on: function (c) { c.S.k = 1; c.say('Всё нужное уже в корзине — «рациональность» выполнена. Человек стоит в очереди и расслабился…'); } },
      { t: 'Схватил', on: function (c) { c.S.k = 2; c.say('…и хватает шоколадку или жвачку. Это <b>нерациональный спрос</b>: незапланированный, из-за внезапного желания или настроения. Поэтому эти товары и кладут у касс.'); } },
      { t: 'Государство', on: function (c) { c.say('Иногда спрос ограничивают <b>законом</b> (запреты) или <b>акцизами</b> — косвенными налогами, которые делают товар дороже (табак, алкоголь; обсуждается акциз на сладкие напитки).'); } }
    ]
  });
})();

/* Встроенные интерактивы лекции о рынках факторов производства. */
(function () {
  'use strict';
  if (!window.HubWidgets) return;
  let faktory;
  ['ef-cobb3d', 'ef-hiring3d', 'ef-capital3d', 'ef-funds3d', 'ef-interest-line', 'ef-quiz', 'ef-cards'].forEach(id => {
    HubWidgets.register(id, box => {
      if (!faktory) {
        faktory = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'lib/ekonomika-faktory3d.js?v=8';
          script.onload = resolve;
          script.onerror = reject;
          document.head.append(script);
        }).catch(error => {
          faktory = null;
          throw error;
        });
      }
      faktory.then(() => {
        if (box.isConnected) window.HubFaktory(id, box);
      }).catch(() => {
        box.textContent = 'Не удалось загрузить интерактив.';
      });
    });
  });
})();

/* Учебная навигация конспектов по экономике. */
(function () {
  'use strict';
  var widgets = window.HubWidgets;
  if (!widgets) return;

  var mount = widgets.mountAll;
  var blocks;

  function showStudyTools(doc) {
    var intro = Array.from(doc.querySelectorAll('p > strong')).find(function (label) {
      return label.textContent.trim() === 'Перед чтением.';
    });
    var recall = Array.from(doc.querySelectorAll('h2')).find(function (heading) {
      return heading.textContent.trim() === 'Вспомни без конспекта';
    });
    if (!intro || !recall || doc.querySelector('.economics-study-tools')) return;

    var recallBody = recall.nextElementSibling;
    if (recallBody && recallBody.classList.contains('u2-body')) recallBody.classList.add('u2-all');

    var comparison;
    for (var heading of doc.querySelectorAll('h3')) {
      var label = heading.nextElementSibling;
      var table = label && label.nextElementSibling;
      if (!label || !/^\[?добавлено\]?$/i.test(label.textContent.trim()) || !table || !table.matches('table')) continue;
      if (!comparison) comparison = heading;
      label.classList.add('u2-keep');
      table.classList.add('u2-keep');
      if (table.nextElementSibling?.matches('p')) table.nextElementSibling.classList.add('u2-keep');
    }

    var tools = document.createElement('aside');
    tools.className = 'wg economics-study-tools';
    tools.setAttribute('aria-label', 'Как изучать лекцию');
    var introParagraph = intro.parentElement;
    var toc = doc.querySelector(':scope > .toc');
    var title = doc.querySelector(':scope > h1');
    if (toc) toc.before(tools);
    else if (title) title.after(tools);
    else doc.prepend(tools);
    tools.appendChild(introParagraph);
    var actions = document.createElement('div');
    actions.className = 'wg-chips';
    tools.appendChild(actions);

    function addJump(label, target) {
      if (!target) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'ib';
      button.textContent = label;
      button.addEventListener('click', function () {
        var body = target.parentElement.closest('.u2-body') ||
          (target.nextElementSibling?.matches('.u2-body') ? target.nextElementSibling : null);
        if (body?.hidden && body.previousElementSibling?.matches('.u2-sec')) body.previousElementSibling.click();
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'start' });
      });
      actions.appendChild(button);
    }

    addJump('Сравнить понятия', comparison);
    addJump('Вспомнить без конспекта', recall);
  }

  widgets.mountAll = function (root) {
    mount.call(this, root);
    var route = location.hash.match(/^#\/?s\/ekonomika\/([a-z0-9-]+)$/);
    var doc = route && root.querySelector('.page.doc');
    if (!doc) return;
    if (!/^(konkurenciya|potrebitel|lekciya-16-11)$/.test(route[1])) {
      showStudyTools(doc);
      return;
    }

    // На mitii.ru лекция от 16 ноября объединяет обе темы.
    blocks = blocks || fetch('media/ekonomika/study-notes.json').then(function (response) {
      if (!response.ok) throw new Error('Не удалось загрузить вопросы по экономике');
      return response.json();
    });
    blocks.then(function (study) {
      if (!doc.isConnected || doc.dataset.economicsStudy) return;
      var headings = Array.from(doc.querySelectorAll(':scope > h2'));
      if (!headings.length) return;
      doc.dataset.economicsStudy = 'true';

      var combined = route[1] === 'lekciya-16-11';
      var competition = route[1] === 'konkurenciya';
      var data = competition ? study.konkurenciya : study.potrebitel;
      var summary = headings.find(function (heading) { return /итоги/i.test(heading.textContent); });
      var end = summary || doc.querySelector(':scope > .pn');
      var first = headings[0];
      var consumerStart = headings.find(function (heading) { return /кто такой потребитель/i.test(heading.textContent); });
      var comparison = headings.find(function (heading) {
        return (competition ? /монополистическая конкуренция/ : /потребительский спрос/i).test(heading.textContent.toLowerCase());
      });
      function insert(markup, before) {
        if (!before) return;
        var fragment = document.createElement('section');
        fragment.className = 'u2-keep';
        fragment.innerHTML = markup;
        doc.insertBefore(fragment, before);
      }

      insert(combined ? data.combinedStart : data.start, first);
      if (combined) insert(study.konkurenciya.comparison, consumerStart || end);
      insert(data.comparison, comparison || end);
      insert(combined ? data.combinedRecall : data.recall, end);
      showStudyTools(doc);
    }).catch(function () { blocks = null; });
  };
})();
