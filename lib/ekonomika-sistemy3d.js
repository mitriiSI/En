/* 3D-модели к конспекту «Экономика. Экономические системы» (лекция 05.10).
   В Markdown: @@graph:o4-system3d@@ @@graph:o4-factors3d@@ @@graph:o4-formations3d@@ @@graph:o4-forces3d@@
   @@graph:o4-coord3d@@ @@graph:o4-types3d@@ @@graph:o4-ordo3d@@ @@graph:o4-neweco3d@@
   Нужен lib/ekonomika-osnovy-kit.js (window.OsnovyKit). */
(function () {
  'use strict';
  var K = window.OsnovyKit;
  if (!K) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, house = K.house, factory = K.factory;

  /* ======================= 1. Экономическая система: связи ======================= */
  reg('o4-system3d', {
    autorotate: false,
    title: 'Экономическая система — сеть связей', lead: 'Производители (заводы) и потребители (дома) связаны нитями. По нитям бегут товары и деньги. Система — это не отдельные элементы, а их связи. Три вопроса экономики: что, как и для кого производить?',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1, height: 440, hint: 'Нажми на вопрос-кнопку или на элемент.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iP = '<b>Производитель</b> — фирма, завод.', iC = '<b>Потребитель</b> — домохозяйство.';
      var prod = [[-4, -2.5], [0, -3.6], [4, -2.5]], cons = [[-4.2, 2.6], [-1.4, 3.6], [1.4, 3.6], [4.2, 2.6]];
      prod.forEach(function (p) { factory(c, p[0], p[1], C.STONE, iP, null, 0.55); });
      cons.forEach(function (p) { house(c, p[0], p[1], C.CREAM, iC, null, 0.8); });
      var iL = '<b>Связь</b> между производителем и потребителем. Именно упорядоченные связи и образуют экономическую систему.';
      var runners = [];
      prod.forEach(function (p, i) { cons.forEach(function (q, j) {
        if ((i + j) % 2 === 0 || i === 1) {
          c.link([p[0], 0.15, p[1]], [q[0], 0.15, q[1]], C.GREY, 0.025, iL);
          var g = c.box3(0.2, 0.2, 0.2, C.RED, [0, 0, 0], '<b>Товар</b> идёт к потребителю.'), m = coin(c, 0, 0, 0, '<b>Деньги</b> идут к производителю.', null, 0.13);
          runners.push([p, q, g, m, Math.random()]);
        }
      }); });
      var q = c.label('что?  как?  для кого?', [0, 3.0, 0], 0.26, '#f0c36b');
      c.onFrame(function (t) {
        runners.forEach(function (r) { var k = (t * 0.3 + r[4]) % 1; r[2].position.set(K.lerp(r[0][0], r[1][0], k), 0.35, K.lerp(r[0][1], r[1][1], k)); r[3].position.set(K.lerp(r[1][0], r[0][0], k), 0.45, K.lerp(r[1][1], r[0][1], k)); r[3].rotation.x = t * 3; });
        q.position.y = 3.0 + 0.1 * Math.sin(t * 2);
      });
    },
    chips: [
      { t: 'Что?', on: function (c) { c.say('<b>Что производить?</b> Хлеб или танки, смартфоны или тракторы — и в каком количестве.'); } },
      { t: 'Как?', on: function (c) { c.say('<b>Как производить?</b> Руками или машинами, из каких ресурсов, по какой технологии.'); } },
      { t: 'Для кого?', on: function (c) { c.say('<b>Для кого производить?</b> Как распределить готовые блага между людьми.'); } },
      { t: 'Система', on: function (c) { c.say('<b>Экономическая система</b> — особым образом упорядоченная система связей между производителями и потребителями благ и услуг. Каждая система отвечает на три вопроса по-своему.'); } }
    ]
  });

  /* ======================= 2. Четыре фактора системы ======================= */
  var SF = [
    { t: 'структура\nсобственности', col: C.GOLD, info: '<b>1. Структура собственности</b> — кому принадлежат земля, заводы, ресурсы (частным лицам, государству, общине).', icon: function (c, g) { var k = c.mesh(new c.THREE.TorusGeometry(0.25, 0.07, 10, 20), C.GOLD, SF[0].info, { metalness: 0.5 }); k.position.y = 0.8; g.add(k); g.add(c.box3(0.1, 0.6, 0.1, C.GOLD, [0, 0.35, 0], SF[0].info)); } },
    { t: 'принятие\nрешений', col: C.RED, info: '<b>2. Система мер по принятию хозяйственных решений</b> — приказы, распоряжения, указы или свободный выбор каждого.', icon: function (c, g) { var p = c.box3(0.6, 0.04, 0.8, C.PAPER, [0, 0.5, 0], SF[1].info); p.rotation.x = -0.5; g.add(p); var st = c.mesh(new c.THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), C.RED, SF[1].info); st.position.set(0.15, 0.6, 0.1); g.add(st); } },
    { t: 'информация и\nкоординация', col: C.BLUE, info: '<b>3. Механизмы обеспечения информацией и координацией</b> — как узнать, что нужно производить: через цены (рынок) или через план (государство).', icon: function (c, g) { g.add(c.link([0, 0, 0], [0, 1.0, 0], C.SILVER, 0.04, SF[2].info)); var d = c.mesh(new c.THREE.ConeGeometry(0.35, 0.3, 16, 1, true), C.BLUE, SF[2].info, { side: c.THREE.DoubleSide }); d.position.y = 1.1; d.rotation.x = Math.PI; g.add(d); } },
    { t: 'цели и\nмотивация', col: C.GREEN, info: '<b>4. Механизмы постановки целей и побуждения людей к труду</b> — почему люди работают: ради прибыли и зарплаты, по приказу или по обычаю.', icon: function (c, g) { [[0.4, C.RED], [0.27, C.WHITE], [0.14, C.RED]].forEach(function (r, i) { var d = c.mesh(new c.THREE.CylinderGeometry(r[0], r[0], 0.06, 24), r[1], SF[3].info); d.rotation.x = Math.PI / 2; d.position.set(0, 0.7, i * 0.03); g.add(d); }); } }
  ];
  reg('o4-factors3d', {
    title: 'Что определяет экономическую систему', lead: 'Четыре «опоры» под платформой экономики. От их сочетания складываются уклады: патриархальный, мелкотоварный, государственный.',
    radius: 15, phi: 0.95, theta: 0.4, targetY: 1, height: 430, hint: 'Нажми на опору или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Экономическая система</b> держится на четырёх факторах.';
      var plat = c.mesh(new T.CylinderGeometry(1.4, 1.4, 0.3, 32), C.SILVER, iS); plat.position.y = 1.6;
      c.label('экономическая\nсистема', [0, 2.6, 0], 0.22);
      var pos = K.ring(c, SF, 5);
      pos.forEach(function (p, i) { c.link([p[0] * 0.25, 1.5, p[1] * 0.25], [p[0], 0.4, p[1]], SF[i].col, 0.06, SF[i].info); });
      c.onFrame(function (t) { plat.rotation.y = t * 0.4; });
    },
    chips: K.ringChips(SF, ['Собственность', 'Решения', 'Информация', 'Мотивация'], [
      { t: 'Уклады', on: function (c) { c.S.focus = -1; c.setView(0.4, 0.95, 15, 1, 0, 0); c.say('<b>Уклады</b> — результат разных сочетаний факторов: <b>патриархальный</b> (семья сама производит и потребляет), <b>мелкотоварный</b> (ремесленник продаёт свой товар), <b>государственный</b>. [ДОБАВЛЕНО] Примеры укладов.'); } }
    ])
  });

  /* ======================= 3. Формации и цивилизации ======================= */
  reg('o4-formations3d', {
    autorotate: false,
    title: 'Лестница формаций и три цивилизации', lead: 'Слева — пять ступеней формационного подхода (Маркс): смена формаций зависит от того, у кого средства производства. Справа — три эпохи цивилизационного подхода: чем работают люди.',
    radius: 16, phi: 1.0, theta: 0.15, targetY: 1.6, height: 460, hint: 'Выбери подход кнопкой и нажимай на ступени.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var F = [
        ['первобытнообщинная', C.WOOD, '<b>Первобытнообщинная</b>: собственность общая, классов нет.'],
        ['рабовладельческая', C.ORANGE, '<b>Рабовладельческая</b>: рабовладелец владеет и средствами производства, и самим работником.'],
        ['феодальная', C.GOLD, '<b>Феодальная</b>: феодал владеет землёй, крестьянин зависим от него.'],
        ['капиталистическая', C.BLUE, '<b>Капиталистическая</b>: капиталист владеет заводом, рабочий свободен, но продаёт свою рабочую силу.'],
        ['коммунистическая', C.RED, '<b>Коммунистическая</b> (по Марксу): общественная собственность, классов нет.']
      ];
      F.forEach(function (f, i) { c.box3(1.4, 0.5 + i * 0.5, 1.6, f[1], [-6 + i * 1.4, (0.5 + i * 0.5) / 2, 0], f[2]); c.label(f[0], [-6 + i * 1.4, 0.8 + i * 0.5, 1.2], 0.13); });
      var climber = person(c, -6, 0.5, C.WHITE, 'Общество поднимается по ступеням формаций.', null, 0.6);
      var Z = [
        ['доиндустриальное', 2.6, '<b>Доиндустриальное (аграрное)</b>: главный ресурс — земля, ручной труд.'],
        ['индустриальное', 4.6, '<b>Индустриальное</b>: главное — заводы, машины, капитал.'],
        ['постиндустриальное', 6.6, '<b>Постиндустриальное</b>: главное — знания, информация, услуги.']
      ];
      K.tree(c, 2.2, -0.8, Z[0][2], null, 0.9); c.box3(1.4, 0.06, 1.2, '#6b4f2e', [2.6, 0.03, 0.6], Z[0][2]);
      var plough = c.box3(0.8, 0.1, 0.1, C.WOOD, [2.6, 0.25, 0.6], Z[0][2]); plough.rotation.z = 0.4;
      var fa = factory(c, 4.6, 0, C.STONE, Z[1][2], null, 0.55); K.smoke(c, fa, 2);
      var dc = K.group(c, 6.6, 0, 0); for (var r = 0; r < 3; r++) { dc.add(c.box3(0.5, 1.8, 0.8, C.DARK, [-0.6 + r * 0.6, 0.9, 0], Z[2][2])); }
      var leds = []; for (var l = 0; l < 9; l++) { var led = K.glow(c, l % 2 ? C.BLUE : C.GREEN, 0.05, Z[2][2]); led.position.set(6.0 + (l % 3) * 0.6, 0.4 + Math.floor(l / 3) * 0.5, 0.42); leds.push(led); }
      Z.forEach(function (z) { c.label(z[0], [z[1], 2.6, 0], 0.15, '#9fd3ff'); });
      c.S = { F: F, Z: Z, step: -1 };
      c.onFrame(function (t) {
        var s = c.S.step < 0 ? Math.floor((t * 0.4) % 5) : c.S.step;
        climber.position.x = K.lerp(climber.position.x, -6 + s * 1.4, 0.06); climber.position.y = K.lerp(climber.position.y, 0.5 + s * 0.5, 0.06);
        leds.forEach(function (m, i) { m.visible = Math.sin(t * 6 + i * 1.7) > -0.3; });
      });
    },
    chips: [
      { t: 'Формационный', on: function (c) { c.S.step = -1; c.setView(0.1, 1.0, 10, 1.4, -3.2, 0); c.say('<b>Формационный подход:</b> общество делится на классы по доступу к средствам производства. 5 формаций: первобытнообщинная → рабовладельческая → феодальная → капиталистическая → коммунистическая.'); } },
      { t: 'Цивилизационный', on: function (c) { c.setView(0.2, 1.0, 10, 1.2, 4.6, 0); c.say('<b>Цивилизационный подход:</b> классов нет, развитие идёт со сменой цивилизаций; критерий — степень индустриального развития: доиндустриальное → индустриальное → постиндустриальное.'); } }
    ].concat([0, 1, 2, 3, 4].map(function (i) { return { t: String(i + 1), small: 'формация', on: function (c) { c.S.step = i; c.setView(0.1, 1.0, 9, 1.4, -6 + i * 1.4, 0); c.say(c.S.F[i][2]); } }; }))
  });

  /* ======================= 4. Способ производства ======================= */
  reg('o4-forces3d', {
    autorotate: false,
    title: 'Способ производства = производительные силы + производственные отношения', lead: 'Работник (люди) молотком (средство труда) обрабатывает бревно (предмет труда) — это производительные силы. Золотая цепочка к хозяину — производственные отношения: кому принадлежат средства производства.',
    radius: 13, phi: 1.0, theta: 0.3, targetY: 1.2, height: 440, hint: 'Нажми на элемент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var iW = '<b>Люди, занятые в производстве</b> — часть производительных сил.';
      var w = person(c, -0.8, 0.4, C.BLUE, iW, null, 1.2);
      var iT = '<b>Средство труда</b> — то, <b>чем</b> человек воздействует на предмет (молоток, станок, компьютер).';
      var hammer = K.group(c, -0.2, 1.2, 0.4);
      hammer.add(c.link([0, 0, 0], [0.9, 0, 0], C.WOOD, 0.05, iT)); hammer.add(c.box3(0.2, 0.35, 0.2, C.SILVER, [0.9, 0, 0], iT));
      var iO = '<b>Предмет труда</b> — то, <b>на что</b> направлен труд (бревно, металл, данные).';
      var log = c.mesh(new T.CylinderGeometry(0.3, 0.3, 1.6, 16), C.WOOD, iO); log.rotation.x = Math.PI / 2; log.position.set(0.9, 0.3, 0.4);
      c.box3(1.0, 0.3, 1.0, C.STONE, [0.9, 0.15, 0.4], iO);
      c.label('производительные силы', [0, 3.0, 0.4], 0.2, '#5b8def');
      var iR = '<b>Производственные отношения</b> — отношения людей по поводу собственности на средства производства. Их характер определяется господствующей формой собственности.';
      var owner = person(c, 3.8, -2, C.GOLD, '<b>Собственник средств производства</b>. ' + iR, null, 1.2);
      K.crown(c, 3.8, 1.55, -2, iR);
      var links = []; for (var i = 0; i < 8; i++) { var r = c.mesh(new T.TorusGeometry(0.15, 0.04, 8, 14), C.GOLD, iR, { metalness: 0.5 }); links.push(r); }
      c.label('производственные отношения', [3.4, 2.9, -2], 0.18, '#f0c36b');
      var cloth = c.mesh(new T.CylinderGeometry(2.0, 2.0, 2.6, 24, 1, true), C.PURPLE, 'Производственные отношения как «одежда» общества.', { transparent: true, opacity: 0.18, side: T.DoubleSide }); cloth.position.set(0.3, 1.3, 0.4);
      c.S = { grow: 0 };
      c.onFrame(function (t) {
        hammer.rotation.z = -0.6 + 0.6 * Math.abs(Math.sin(t * 3));
        links.forEach(function (r, i) { var k = i / 7; r.position.set(K.lerp(0.9, 3.8, k), 0.8 + Math.sin(k * Math.PI) * 0.6, K.lerp(0.4, -2, k)); r.rotation.y = i % 2 ? Math.PI / 2 : 0; r.rotation.x = t * 0.5; });
        var g = c.S.grow; w.scale.setScalar(K.lerp(w.scale.x, 1 + g * 0.6, 0.05));
        cloth.visible = g > 0; cloth.scale.set(1, 1, 1); cloth.material.opacity = g > 0 ? 0.18 + 0.1 * Math.sin(t * 6) : 0;
      });
    },
    chips: [
      { t: 'Производит. силы', on: function (c) { c.S.grow = 0; c.setView(0.3, 1.0, 8, 1.0, 0, 0.4); c.say('<b>Производительные силы</b> = средства производства (средства труда + предметы труда) + люди, занятые в производстве.'); } },
      { t: 'Производ. отношения', on: function (c) { c.S.grow = 0; c.setView(0.5, 1.0, 9, 1.2, 2.4, -1); c.say('<b>Характер производственных отношений определяется господствующей формой собственности на средства производства.</b>'); } },
      { t: 'Силы переросли', on: function (c) { c.S.grow = 1; c.setView(0.3, 1.0, 11, 1.4, 0.5, 0); c.say('По Марксу: производительные силы, развиваясь, <b>перестают соответствовать</b> производственным отношениям, перерастают их — и происходит <b>переход в следующую формацию</b>. Как тело, которое выросло из одежды.'); } }
    ]
  });

  /* ======================= 5. Спонтанный порядок и иерархия ======================= */
  reg('o4-coord3d', {
    autorotate: false,
    title: '🎙 Два способа координации: спонтанный порядок и иерархия', lead: 'Слева люди сами находят друг друга по ценовым сигналам — никто не командует (спонтанный порядок). Справа приказ спускается сверху вниз по пирамиде (иерархия). Это то, что лектор говорила 05.10.',
    radius: 16, phi: 0.95, theta: 0.1, targetY: 1.5, height: 460, hint: 'Сравни две стороны кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iS = '<b>Спонтанный порядок</b> — порядок, который не зависит от чьих-либо намерений и планов. Возник естественным путём. Основа: свобода потребителя, свобода предпринимательства, личный интерес.';
      var dots = [];
      for (var i = 0; i < 14; i++) { var p = person(c, -4 + Math.cos(i) * 2.5, Math.sin(i * 1.7) * 2.5, i % 2 ? C.BLUE : C.GOLD, iS, null, 0.6); dots.push([p, Math.random() * 6, Math.random() * 6]); }
      var sig = []; for (var s = 0; s < 6; s++) { var m = c.label('₽', [0, 0, 0], 0.14, '#f0c36b'); sig.push(m); }
      c.label('спонтанный порядок', [-4, 3.0, 0], 0.22, '#5b8def');
      var iH = '<b>Иерархия</b> — отношения между субъектами задаются сверху (вертикально) и определяют все изменения экономической системы.';
      var levels = [[1, 2.6], [3, 1.5], [6, 0.4]], nodes = [];
      levels.forEach(function (L, li) { for (var k = 0; k < L[0]; k++) { var x = 4 + (k - (L[0] - 1) / 2) * 1.0; var pp = person(c, x, 0, li === 0 ? C.RED : C.GREY, iH, null, 0.6, L[1]); nodes.push([pp, li]); c.box3(0.7, 0.1, 0.7, C.SILVER, [x, L[1] - 0.05, 0], iH); if (li > 0) { var parentX = 4 + (Math.floor(k / (L[0] / levels[li - 1][0])) - (levels[li - 1][0] - 1) / 2) * 1.0; c.link([parentX, levels[li - 1][1], 0], [x, L[1] + 0.7, 0], C.GREY, 0.02, iH); } } });
      var orders = []; for (var o = 0; o < 6; o++) { var pa = c.box3(0.25, 0.03, 0.32, C.PAPER, [4, 3.3, 0], '<b>Приказ</b> идёт сверху вниз.'); orders.push(pa); }
      c.label('иерархия', [4, 4.2, 0], 0.22, '#e0645a');
      c.S = { side: 'both' };
      c.onFrame(function (t) {
        dots.forEach(function (d, i) { var a = t * 0.3 + d[1]; d[0].position.x = -4 + Math.cos(a) * (1.4 + Math.sin(t * 0.2 + d[2]) * 1.0); d[0].position.z = Math.sin(a * 1.3) * (1.4 + Math.cos(t * 0.25 + d[2]) * 1.0); });
        sig.forEach(function (m, i) { var a = dots[i * 2][0].position, b = dots[i * 2 + 1][0].position, k = (t * 0.6 + i / 6) % 1; m.position.set(K.lerp(a.x, b.x, k), 1.4 + Math.sin(k * Math.PI) * 0.4, K.lerp(a.z, b.z, k)); });
        orders.forEach(function (pa, i) { var k = (t * 0.35 + i / 6) % 1, tx = 4 + (i - 2.5) * 1.0; pa.position.set(K.lerp(4, tx, k), K.lerp(3.3, 1.6, k), 0.4); pa.rotation.y = t; });
        var sd = c.S.side; dots.forEach(function (d) { d[0].visible = sd !== 'h'; }); sig.forEach(function (m) { m.visible = sd !== 'h'; });
        nodes.forEach(function (n) { n[0].visible = sd !== 's'; }); orders.forEach(function (o2) { o2.visible = sd !== 's'; });
      });
    },
    chips: [
      { t: 'Спонтанный порядок', on: function (c) { c.S.side = 's'; c.setView(-0.4, 0.95, 10, 1.2, -4, 0); c.say('🎙 «Спонтанный порядок — порядок, который <b>не зависит от чьих-либо намерений и планов</b>. Он возник <b>естественным путём</b> в процессе развития цивилизации. <b>Эволюция</b> представляет собой именно спонтанный порядок». Информация передаётся <b>ценовыми сигналами</b> (₽).'); } },
      { t: 'Иерархия', on: function (c) { c.S.side = 'h'; c.setView(0.4, 0.95, 10, 1.6, 4, 0); c.say('🎙 «Существует и другая система ответа на основные экономические вопросы — <b>иерархия</b>. Отношения между субъектами <b>задаются сверху, вертикально</b>». Пример из документа: экономика Египта, Северной Кореи, фирма, где всё решает начальник.'); } },
      { t: 'В жизни — смесь', on: function (c) { c.S.side = 'both'; c.setView(0.1, 0.95, 16, 1.5, 0, 0); c.say('🎙 «<b>В чистом виде не существует ни спонтанного порядка, ни иерархии</b>». [ДОБАВЛЕНО] Внутри любой рыночной фирмы — иерархия, а в любой плановой экономике есть стихийный «чёрный рынок».'); } }
    ]
  });

  /* ======================= 6. Четыре типа систем ======================= */
  reg('o4-types3d', {
    autorotate: false,
    title: 'Четыре типа экономических систем', lead: 'Четыре острова. Традиционный — хижины и обычай. Командный — пирамида приказов. Рыночный — прилавки и цены. Смешанный — рынок плюс государство. Нажми на остров.',
    radius: 17, phi: 0.9, theta: 0.3, targetY: 0.8, height: 470, hint: 'Нажми на остров или кнопку.',
    build: function (c) {
      var T = c.THREE;
      var water = c.mesh(new T.CylinderGeometry(9.5, 9.5, 0.1, 64), '#2a4f7a', 'Море'); water.position.y = -0.1; water.castShadow = false;
      var I = [
        [-4, -3.4, '#c9a46a', 'традиционная', '<b>Традиционная:</b> ресурсы используются по традициям и обычаям. Многоукладность. Плюсы: предсказуемость, стабильность. Минусы: неспособность к прогрессу, застой, ручной труд.'],
        [4, -3.4, C.RED, 'командная', '<b>Командная (иерархия):</b> что, как и для кого — система приказов. Ресурсы — госсобственность, планирование <b>директивное</b> (обязательное). Примеры: Древний Египет, Северная Корея.'],
        [-4, 3.4, C.BLUE, 'рыночная', '<b>Рыночная:</b> товарно-денежные отношения, господство частной собственности, свободная конкуренция. Производители решают сами, на свой страх и риск. Цена — сигнал.'],
        [4, 3.4, C.GREEN, 'смешанная', '<b>Смешанная:</b> рынок + активное государство (Франция, Великобритания, Германия). Госрасходы > 40 % ВВП. Сейчас господствует во всех странах.']
      ];
      c.S = { I: I };
      I.forEach(function (q) { var isl = c.mesh(new T.CylinderGeometry(2.8, 3.1, 0.5, 40), q[2], q[4]); isl.position.set(q[0], 0.1, q[1]); c.label(q[3], [q[0], 3.2, q[1]], 0.22); });
      var t1 = K.group(c, -4, 0.35, -3.4);
      [[-0.9, 0], [0.8, 0.5], [0, -1]].forEach(function (p) { var h = c.mesh(new T.ConeGeometry(0.6, 1.0, 10), C.WOOD, I[0][4]); h.position.set(p[0], 0.5, p[1]); t1.add(h); });
      var fire = K.glow(c, C.ORANGE, 0.2, I[0][4]); fire.position.set(-4, 0.6, -2.6);
      var t2 = K.group(c, 4, 0.35, -3.4);
      for (var s = 0; s < 4; s++) t2.add(c.box3(2.2 - s * 0.5, 0.35, 2.2 - s * 0.5, C.STONE, [0, 0.18 + s * 0.35, 0], I[1][4]));
      t2.add(person(c, 0, 0, C.RED, I[1][4], t2, 0.6, 1.4));
      var t3 = K.group(c, -4, 0.35, 3.4);
      [[-0.9, -0.5], [0.9, -0.5], [0, 0.9]].forEach(function (p, i) { t3.add(c.box3(1.0, 0.5, 0.6, C.WOOD, [p[0], 0.25, p[1]], I[2][4])); t3.add(c.box3(1.1, 0.06, 0.7, [C.RED, C.GOLD, C.PURPLE][i], [p[0], 1.1, p[1]], I[2][4])); });
      var coins3 = []; for (var k = 0; k < 4; k++) coins3.push(coin(c, 0, 0, 0, I[2][4], null, 0.15));
      var t4 = K.group(c, 4, 0.35, 3.4);
      t4.add(c.box3(0.9, 0.5, 0.6, C.WOOD, [-0.8, 0.25, 0.3], I[3][4])); t4.add(c.box3(1.0, 0.06, 0.7, C.GOLD, [-0.8, 1.0, 0.3], I[3][4]));
      t4.add(c.box3(1.0, 1.0, 0.8, C.STONE, [0.8, 0.5, -0.3], I[3][4])); var dm = c.mesh(new T.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), C.GREEN, I[3][4]); dm.position.set(0.8, 1.0, -0.3); t4.add(dm);
      K.flag(c, 0.8, -0.3, I[3][4], t4, 2.2);
      c.onFrame(function (t) {
        fire.scale.setScalar(1 + 0.3 * Math.sin(t * 8));
        coins3.forEach(function (m, i) { var a = t + i * Math.PI / 2; m.position.set(-4 + Math.cos(a) * 1.2, 1.4, 3.4 + Math.sin(a) * 1.2); m.rotation.x = t * 3; });
      });
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Традиционная', 'Командная', 'Рыночная', 'Смешанная'][i], on: function (c) { var q = c.S.I[i]; c.setView(Math.atan2(q[0], q[1]), 0.9, 8, 0.8, q[0], q[1]); c.say(q[4]); } }; })
  });

  /* ======================= 7. Ордолиберализм ======================= */
  reg('o4-ordo3d', {
    autorotate: false,
    title: 'Ордолиберализм: государство — судья на поле', lead: 'Фирмы соревнуются (рынок), а государство-судья следит за тремя правилами: поддерживать конкуренцию, охранять собственность и помогать бедным, обеспечивать «здоровые деньги».',
    radius: 15, phi: 0.95, theta: 0.2, targetY: 1, height: 450, hint: 'Нажми на правило-кнопку.',
    build: function (c) {
      var T = c.THREE;
      var field = c.box3(11, 0.15, 7, '#3f8a4f', [0, -0.07, 0], '<b>Поле</b> — рынок, где идёт конкуренция.');
      c.box3(0.06, 0.16, 7, C.WHITE, [0, 0, 0], 'Поле'); var cc = c.mesh(new T.TorusGeometry(1.2, 0.04, 6, 40), C.WHITE, 'Поле'); cc.rotation.x = Math.PI / 2; cc.position.y = 0.05;
      var players = []; for (var i = 0; i < 6; i++) players.push(person(c, 0, 0, i < 3 ? C.BLUE : C.GOLD, '<b>Фирмы</b> конкурируют. Государство само «голы не забивает» — заводами не управляет.', null, 0.75));
      var ref = person(c, 0, -2.2, C.DARK, '<b>Государство-судья</b>: устанавливает и поддерживает хозяйственный порядок.', null, 0.95);
      var whistle = K.glow(c, C.SILVER, 0.1, 'Свисток судьи');
      var giant = person(c, 3.6, 1.8, C.RED, '<b>Монополист</b> — слишком большой игрок. Судья ограничивает его, чтобы сохранить конкуренцию.', null, 1.5); giant.visible = false;
      var poor = person(c, -4.6, 3.0, C.GREY, '<b>Малоимущий</b> получает помощь — перераспределение доходов.', null, 0.8);
      var help = []; for (var h = 0; h < 3; h++) help.push(coin(c, 0, 0, 0, 'Перераспределение доходов в пользу малоимущих', null, 0.14));
      var ball = c.mesh(new T.SphereGeometry(0.22, 18, 12), C.WHITE, '<b>«Здоровые деньги»</b> — мяч должен быть нормальным: государство не допускает инфляции.');
      c.S = { r: 0 };
      c.onFrame(function (t) {
        players.forEach(function (p, i) { var a = t * 0.5 + i; p.position.set(Math.cos(a * 1.1) * (2 + i * 0.4), 0, Math.sin(a) * 2.2); });
        ball.position.set(Math.cos(t * 0.9) * 2.5, 0.22 + Math.abs(Math.sin(t * 3)) * 0.4, Math.sin(t * 1.3) * 1.8);
        var bs = c.S.r === 3 ? 1 + 0.3 * Math.sin(t * 5) : 1; ball.scale.setScalar(bs);
        ref.position.x = ball.position.x * 0.5; whistle.position.set(ref.position.x + 0.2, 1.2, -2.0);
        giant.visible = c.S.r === 1; if (giant.visible) giant.scale.setScalar(K.lerp(giant.scale.x, 0.75, 0.01));
        help.forEach(function (m, i) { var k = (t * 0.4 + i / 3) % 1; m.visible = c.S.r === 2; m.position.set(K.lerp(ref.position.x, -4.6, k), 1.4 + Math.sin(k * Math.PI), K.lerp(-2.2, 3.0, k)); });
      });
    },
    chips: [
      { t: '1. Конкуренция', on: function (c) { c.S.r = 1; c.say('Государство обязано <b>охранять (поддерживать) конкуренцию</b>: не давать одному игроку стать монополистом. Великан постепенно «уменьшается» до нормального размера.'); } },
      { t: '2. Собственность и бедные', on: function (c) { c.S.r = 2; c.say('Государство обязано <b>охранять частную собственность</b> и <b>перераспределять доходы в пользу малоимущих</b>.'); } },
      { t: '3. Здоровые деньги', on: function (c) { c.S.r = 3; c.say('Государство обязано обеспечивать <b>«здоровые деньги»</b>, т. е. <b>не допускать инфляции</b>. Концепция ордолиберализма, 30–40-е годы XX века.'); } }
    ]
  });

  /* ======================= 8. Новая экономика ======================= */
  reg('o4-neweco3d', {
    autorotate: false,
    title: 'Новая экономика: человек рядом с производством', lead: 'Робот-манипулятор сам собирает детали, а человек стоит рядом у экрана — он контролёр и регулировщик. Над всем — облако данных: знания стали главным ресурсом.',
    radius: 14, phi: 1.0, theta: 0.4, targetY: 1.4, height: 450, hint: 'Нажми на элемент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iR = '<b>Автоматизированное производство.</b> Человек выведен непосредственно из производства.';
      var base = c.mesh(new T.CylinderGeometry(0.6, 0.7, 0.4, 20), C.DARK, iR); base.position.set(0, 0.2, 0);
      var arm = K.group(c, 0, 0.4, 0);
      var a1 = c.box3(0.3, 1.6, 0.3, C.ORANGE, [0, 0.8, 0], iR); arm.add(a1);
      var joint = K.group(c, 0, 1.6, 0); arm.add(joint);
      var a2 = c.box3(1.4, 0.25, 0.25, C.ORANGE, [0.7, 0, 0], iR); joint.add(a2);
      var claw = c.box3(0.3, 0.3, 0.3, C.SILVER, [1.4, -0.2, 0], iR); joint.add(claw);
      var belt = c.box3(5, 0.2, 1, C.DARK, [1.5, 0.5, 2], iR);
      var parts = []; for (var i = 0; i < 4; i++) parts.push(c.box3(0.4, 0.3, 0.4, C.BLUE, [0, 0.75, 2], iR));
      var iH = '<b>Человек — контролёр и регулировщик.</b> Приоритет личности работника; ценятся знания.';
      person(c, -3, 1.5, C.GREEN, iH, null, 1.1);
      var scr = c.box3(1.2, 0.8, 0.06, '#5b8def', [-3, 1.6, 0.6], iH); scr.rotation.y = 0.3;
      var iD = '<b>Знания</b> — качественно новый ресурс. <b>Конкуренция информационных сетей</b> — новый тип конкуренции.';
      var cloud = K.group(c, 0, 4.2, 0);
      [[0, 0, 0, 0.9], [0.9, -0.1, 0, 0.7], [-0.9, -0.1, 0, 0.7], [0.3, 0.4, 0, 0.6]].forEach(function (p) { var s = c.mesh(new T.SphereGeometry(p[3], 18, 12), '#cfe3ff', iD, { transparent: true, opacity: 0.85 }); s.position.set(p[0], p[1], p[2]); cloud.add(s); });
      var bits = []; for (var b = 0; b < 8; b++) bits.push(c.box3(0.12, 0.12, 0.12, C.PURPLE, [0, 0, 0], iD));
      c.label('знания', [0, 5.4, 0], 0.22, '#a78bfa');
      c.onFrame(function (t) {
        arm.rotation.y = Math.sin(t * 0.8) * 1.2; joint.rotation.z = -0.4 + 0.3 * Math.sin(t * 1.6);
        parts.forEach(function (p, i) { p.position.x = -1 + ((t * 0.4 + i / 4) % 1) * 5; });
        bits.forEach(function (m, i) { var k = (t * 0.5 + i / 8) % 1, x = i % 2 ? -3 : 0; m.position.set(K.lerp(0, x, k) + Math.sin(i) * 0.4, K.lerp(3.6, 1.8, k), K.lerp(0, i % 2 ? 0.6 : 0, k)); });
        cloud.position.y = 4.2 + 0.1 * Math.sin(t);
      });
    },
    chips: [
      { t: 'Роль человека', on: function (c) { c.say('Радикально изменилась роль человека: он <b>выведен непосредственно из производства</b>, находится <b>рядом в роли контролёра и регулировщика</b>. Приоритет — личность работника.'); } },
      { t: 'Знания', on: function (c) { c.say('Со второй половины XX века — <b>экономика знаний</b> (цифровая). Новый ресурс — <b>знания</b>, новый тип конкуренции — <b>конкуренция информационных сетей</b>, новый фактор — <b>время</b>.'); } },
      { t: 'Ещё черты', on: function (c) { c.say('Преобладают <b>услуги и информация</b>; главная — <b>сфера потребления</b>; растёт роль <b>институтов</b>; коллективные формы собственности вытесняют индивидуальную; хозяйства становятся <b>открытыми</b>.'); } }
    ]
  });
})();
