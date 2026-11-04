/* 3D-модели к конспекту «Экономика. Фирма» (лекция 02.11), часть 2: издержки и прибыль.
   В Markdown: @@graph:fi-computer3d@@ @@graph:fi-explicit3d@@ @@graph:fi-fcvc3d@@ @@graph:fi-cleaner3d@@ @@graph:fi-afc3d@@
   @@graph:fi-ttt3d@@ @@graph:fi-mc3d@@ @@graph:fi-extra3d@@ @@graph:fi-profit3d@@ @@graph:fi-rent3d@@ @@graph:fi-scale3d@@ @@graph:fi-lrac3d@@
   Нужен lib/ekonomika-firma3d.js (window.FirmaKit). */
(function () {
  'use strict';
  var K = window.FirmaKit;
  if (!K || !window.HubWidgets || !window.HubScene3d) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, stack = K.stack, house = K.house, factory = K.factory;

  /* ======================= 18. Из чего складываются издержки ======================= */
  reg('fi-computer3d', {
    title: 'Из чего складывается себестоимость компьютера', lead: 'Пример лектора — компьютер. В него «вошли» железо, труд рабочих, кусочек износа станка и энергия. Всё это в деньгах и есть издержки.',
    radius: 14, phi: 1.0, theta: 0.3, targetY: 1.2, height: 430, hint: 'Нажми на источник затрат или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iL = '<b>Компьютер</b> — готовый продукт. Его <b>себестоимость</b> — это все текущие затраты на изготовление и продажу в денежной форме.';
      var lap = K.group(c, 0, 0.6, 0);
      lap.add(c.box3(2.4, 0.12, 1.6, C.SILVER, [0, 0, 0], iL));
      var scr = K.group(c, 0, 0.6, -0.8); scr.rotation.x = -0.25; lap.add(scr); scr.position.set(0, 0.06, -0.78);
      scr.add(c.box3(2.4, 1.5, 0.08, C.DARK, [0, 0.75, 0], iL)); scr.add(c.box3(2.2, 1.3, 0.02, '#5b8def', [0, 0.75, 0.05], iL));
      c.box3(0.8, 0.6, 0.8, C.STONE, [0, 0.3, 0], iL);
      var S = [
        [-3.6, -2, C.SILVER, 'материалы', '<b>Материальные затраты:</b> железо, пластик, сырьё. Лектор: «Сколько железа в компьютере — это тоже издержки на его производство».'],
        [-3.6, 2.2, C.BLUE, 'труд', '<b>Труд.</b> Компьютер собирали руки работников → в издержки входит <b>заработная плата</b>.'],
        [3.6, -2, C.ORANGE, 'износ станка', '<b>Амортизация.</b> Станок, на котором делали детали, изнашивается. Износ в денежном выражении — <b>амортизационные отчисления</b>. В цену одного компьютера входит только <b>его доля</b> износа станка.'],
        [3.6, 2.2, C.GOLD, 'энергия', '<b>Топливо и электроэнергия</b> — тоже часть себестоимости.']
      ];
      var g0 = K.group(c, -3.6, 0, -2);
      for (var i = 0; i < 3; i++) g0.add(c.box3(1.2 - i * 0.2, 0.3, 0.6, C.SILVER, [0, 0.15 + i * 0.3, 0], S[0][4]));
      person(c, -3.6, 2.2, C.BLUE, S[1][4], null, 1.1);
      var g2 = K.group(c, 3.6, 0, -2);
      g2.add(c.box3(1.6, 0.8, 1.0, C.DARK, [0, 0.4, 0], S[2][4]));
      var sp = c.mesh(new T.CylinderGeometry(0.15, 0.15, 0.9, 12), C.SILVER, S[2][4]); sp.position.set(0.3, 1.25, 0); g2.add(sp);
      var wear = c.mesh(new T.TorusGeometry(0.45, 0.08, 8, 30), C.RED, S[2][4]); wear.rotation.x = Math.PI / 2; wear.position.set(0.3, 1.0, 0); g2.add(wear);
      var bolt = K.group(c, 3.6, 0, 2.2);
      var b1 = c.mesh(new T.ConeGeometry(0.3, 1.2, 4), C.GOLD, S[3][4], { emissive: C.GOLD, emissiveIntensity: 0.5 }); b1.position.set(0, 1.3, 0); b1.rotation.z = 0.4; bolt.add(b1);
      var b2 = c.mesh(new T.ConeGeometry(0.3, 1.2, 4), C.GOLD, S[3][4], { emissive: C.GOLD, emissiveIntensity: 0.5 }); b2.position.set(0.15, 0.5, 0); b2.rotation.z = Math.PI + 0.4; bolt.add(b2);
      S.forEach(function (s) { c.label(s[3], [s[0], 2.6, s[1]], 0.22); });
      var cubes = S.map(function (s) { var m = c.box3(0.25, 0.25, 0.25, s[2], [s[0], 1, s[1]], s[4]); return m; });
      var segs = [], H = [1.2, 1.0, 0.5, 0.4], y = 0;
      S.forEach(function (s, i) { var m = c.box3(0.8, H[i], 0.8, s[2], [0, y + H[i] / 2, -3.6], s[4]); y += H[i]; segs.push(m); m.visible = false; });
      var segL = c.label('себестоимость', [0, y + 0.6, -3.6], 0.22, '#f0c36b'); segL.visible = false;
      c.S = { only: -1, cost: false };
      c.onFrame(function (t) {
        cubes.forEach(function (m, i) {
          var k = (t * 0.4 + i * 0.25) % 1, s = S[i];
          m.position.set(K.lerp(s[0], 0, k), 0.9 + Math.sin(k * Math.PI) * 1.2, K.lerp(s[1], 0, k));
          m.visible = c.S.only < 0 || c.S.only === i;
        });
        wear.scale.setScalar(1 - ((t * 0.05) % 0.5));
        segs.forEach(function (m) { m.visible = c.S.cost; }); segL.visible = c.S.cost;
      });
      c.S.S = S;
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Материалы', 'Труд', 'Амортизация', 'Энергия'][i], on: function (c) { c.S.only = i; c.S.cost = false; c.say(c.S.S[i][4]); } }; }).concat([
      { t: 'Себестоимость', on: function (c) { c.S.only = -1; c.S.cost = true; c.setView(0.3, 1.0, 12, 1.4, 0, -1.5); c.say('<b>Себестоимость</b> (термин отечественной литературы) — всё это вместе в денежной форме: материалы, топливо, энергия, зарплата, амортизация и прочие затраты.'); } }
    ])
  });

  /* ======================= 19. Явные и неявные издержки ======================= */
  reg('fi-explicit3d', {
    autorotate: false,
    title: 'Явные и неявные (альтернативные) издержки', lead: 'Слева — деньги, которые предприниматель реально платит. Справа — призрачные монеты: доход, от которого он отказался, используя своё помещение и своё время.',
    radius: 13, phi: 1.0, theta: 0, targetY: 1.2, targetX: 0.3, height: 430, hint: 'Сравни левую и правую часть кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iE = '<b>Предприниматель</b> открыл мастерскую в своём гараже.';
      person(c, 0, 0.6, C.BLUE, iE, null, 1.15);
      var iX = '<b>Явные (бухгалтерские, внешние) издержки</b> — платежи другим: поставщикам, работникам, банку. Лектор: «то, что вынуто из кармана».';
      person(c, -3.8, -1.4, C.RED, iX, null, 1); person(c, -3.8, 1.4, C.ORANGE, iX, null, 1);
      c.box3(1.4, 0.8, 0.9, C.WOOD, [-4.8, 0.4, 0], iX);
      c.label('явные', [-3.8, 2.7, 0], 0.28, '#e0645a');
      var iI = '<b>Неявные (альтернативные, скрытые, внутренние) издержки</b> — доход, от которого отказались ради своего дела. Из кармана они не вынуты, но тоже являются издержками.';
      var gar = K.group(c, 2.8, 0, -2.4);
      gar.add(c.box3(2.2, 1.4, 1.6, C.STONE, [0, 0.7, 0], iI));
      gar.add(c.box3(1.6, 1.0, 0.04, C.SILVER, [0, 0.55, 0.81], iI));
      c.label('свой гараж:\nмог бы сдать', [2.8, 2.4, -2.4], 0.2, '#a78bfa');
      var office = K.group(c, 4.9, 0, 0.2);
      office.add(c.box3(1.0, 1.8, 1.0, '#9fd3ff', [0, 0.9, 0], iI));
      c.label('своё время:\nмог бы работать\nпо найму', [4.9, 2.9, 0.2], 0.18, '#a78bfa');
      c.label('неявные', [3.9, 4.3, -1.2], 0.28, '#a78bfa');
      var real = [], ghost = [];
      for (var i = 0; i < 4; i++) { var m = coin(c, 0, 1.4, 0.6, iX, null, 0.3); m.rotation.x = Math.PI / 2; real.push(m); }
      for (var j = 0; j < 4; j++) { var g = c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.1, 24), C.PURPLE, iI, { transparent: true, opacity: 0.45, emissive: C.PURPLE, emissiveIntensity: 0.4 }); g.rotation.x = Math.PI / 2; ghost.push(g); }
      c.S = { show: 'both' };
      c.onFrame(function (t) {
        var s = c.S.show;
        real.forEach(function (m, i) { var k = (t * 0.4 + i / 4) % 1; m.visible = s !== 'imp'; m.position.set(K.lerp(0, -3.6, k), 1.4 + Math.sin(k * Math.PI), K.lerp(0.6, i % 2 ? 1.4 : -1.4, k)); m.rotation.z = t * 3; });
        ghost.forEach(function (m, i) { var k = (t * 0.3 + i / 4) % 1, z = i % 2 ? 0.2 : -2.4; m.visible = s !== 'exp'; m.position.set(K.lerp(i % 2 ? 4.9 : 2.8, 0.6, k), 2.3 + 0.4 * Math.sin(k * Math.PI), K.lerp(z, 0.6, k)); m.rotation.z = t * 2; m.material.opacity = 0.5 * (1 - k * 0.7); });
      });
    },
    chips: [
      { t: 'Явные', on: function (c) { c.S.show = 'exp'; c.say('<b>Бухгалтерские = явные = внешние издержки</b>: фактические платежи поставщикам, работникам, банку. Их видно в бухгалтерских документах.'); } },
      { t: 'Неявные', on: function (c) { c.S.show = 'imp'; c.say('<b>Альтернативные = неявные = скрытые издержки</b>: гараж можно было сдать, а самому работать по найму. Эти деньги не получены — это <b>упущенная выгода</b>. <b>[ДОБАВЛЕНО]</b> Пример с гаражом и работой по найму.'); } },
      { t: 'Вместе', on: function (c) { c.S.show = 'both'; c.say('<b>Экономические (общие) издержки = явные + неявные.</b> Именно их лектор вычитает из выручки, когда считает экономическую прибыль.'); } }
    ]
  });

  /* ======================= 19б. Трансакционные, организационные, трансформационные ======================= */
  reg('fi-ttt3d', {
    autorotate: false,
    title: 'Три вида издержек: сделка, организация, превращение', lead: 'Швейная фирма. Слева заключают сделку с поставщиком ткани, в центре мастер организует работу, справа на конвейере ткань превращается в куртку.',
    radius: 15, phi: 1.0, theta: 0.15, targetY: 1.2, height: 420, hint: 'Нажми на участок или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iT = '<b>Трансакционные издержки</b> — издержки по совершению сделки: найти поставщика, договориться, подписать договор, проверить исполнение.';
      var iO = '<b>Организационные издержки</b> — издержки по организации производственного процесса: управление, планирование, контроль.';
      var iF = '<b>Трансформационные издержки</b> — издержки превращения исходных ресурсов в готовую продукцию. Именно они делятся на <b>постоянные</b> и <b>переменные</b>.';
      var a = person(c, -5.6, 0.3, C.BLUE, iT, null, 1), b = person(c, -4.0, 0.3, C.RED, iT, null, 1);
      a.rotation.z = -0.1; b.rotation.z = 0.1;
      var doc = K.paper(c, -4.8, 1.0, 0.9, iT, null, C.PAPER, 0.7, 0.5); doc.rotation.x = -1.2;
      var hand = K.glow(c, C.GOLD, 0.16, iT); hand.position.set(-4.8, 0.85, 0.3);
      var truck = K.group(c, -4.8, 0, -2.2); truck.add(c.box3(1.8, 0.9, 1.0, C.PURPLE, [0, 0.75, 0], iT)); truck.add(c.box3(0.7, 0.7, 1.0, C.ORANGE, [1.25, 0.6, 0], iT));
      [[-0.6, 0.5], [-0.6, -0.5], [1.2, 0.5], [1.2, -0.5]].forEach(function (q) { var w = c.mesh(new T.CylinderGeometry(0.22, 0.22, 0.14, 14), C.DARK, iT); w.rotation.x = Math.PI / 2; w.position.set(q[0], 0.22, q[1]); truck.add(w); });
      c.label('сделка', [-4.8, 2.6, 0], 0.26, '#5b8def');
      person(c, 0, 0.8, C.GREEN, iO, null, 1.1);
      var board = c.box3(1.6, 1.1, 0.05, C.PAPER, [0, 1.9, -1.0], iO);
      c.link([0, 0, -1.02], [0, 1.4, -1.02], C.WOOD, 0.04, iO);
      [[-0.45, 2.2], [0.45, 2.2], [0, 1.65]].forEach(function (p) { c.box3(0.35, 0.22, 0.06, C.BLUE, [p[0], p[1], -0.95], iO); });
      c.label('организация', [0, 3.1, 0], 0.26, '#4cc38a');
      var belt = c.box3(4.2, 0.2, 1.0, C.DARK, [4.6, 0.6, 0.6], iF);
      c.box3(0.15, 0.6, 0.15, C.SILVER, [2.8, 0.3, 0.6], iF); c.box3(0.15, 0.6, 0.15, C.SILVER, [6.4, 0.3, 0.6], iF);
      var mach = c.box3(1.2, 1.4, 1.4, C.SILVER, [4.6, 1.4, 0.6], iF);
      c.label('превращение', [4.6, 3.1, 0.6], 0.26, '#e39b5b');
      var items = [];
      for (var i = 0; i < 3; i++) {
        var cloth = c.box3(0.7, 0.08, 0.6, C.PURPLE, [2.8, 0.75, 0.6], '<b>Ткань</b> — исходный ресурс.');
        var jacket = K.group(c, 0, 0, 0);
        jacket.add(c.box3(0.6, 0.6, 0.25, C.TEA, [0, 0, 0], '<b>Куртка</b> — готовая продукция.'));
        jacket.add(c.box3(0.18, 0.5, 0.2, C.TEA, [-0.38, -0.05, 0], '<b>Куртка</b> — готовая продукция.'));
        jacket.add(c.box3(0.18, 0.5, 0.2, C.TEA, [0.38, -0.05, 0], '<b>Куртка</b> — готовая продукция.'));
        items.push([cloth, jacket]);
      }
      c.onFrame(function (t) {
        hand.position.y = 0.85 + 0.06 * Math.sin(t * 6);
        items.forEach(function (it, i) {
          var k = (t * 0.2 + i / 3) % 1, x = K.lerp(2.9, 6.3, k);
          it[0].visible = x < 4.6; it[1].visible = x >= 4.6;
          it[0].position.x = x; it[1].position.set(x, 1.05, 0.6);
        });
      });
      c.S = { info: [iT, iO, iF], x: [-4.8, 0, 4.6] };
    },
    chips: [0, 1, 2].map(function (i) { return { t: ['Трансакционные', 'Организационные', 'Трансформационные'][i], on: function (c) { c.setView(0.15, 1.0, 8, 1.2, c.S.x[i], 0.3); c.say(c.S.info[i]); } }; })
      .concat([{ t: 'Все три', on: function (c) { c.setView(0.15, 1.0, 15, 1.2, 0, 0); c.say('Одна фирма — три вида издержек: <b>договориться</b> (трансакционные), <b>организовать</b> (организационные), <b>произвести</b> (трансформационные). <b>[ДОБАВЛЕНО]</b> Пример со швейной фирмой.'); } }])
  });

  /* ======================= 20. Постоянные и переменные издержки ======================= */
  reg('fi-fcvc3d', {
    autorotate: false,
    title: 'Постоянные, переменные и общие издержки', lead: 'Каждый столбик — издержки при выпуске Q. Синяя часть (FC) одинакова всегда, даже при Q = 0. Оранжевая (VC) растёт вместе с выпуском.',
    radius: 14, phi: 1.2, theta: 0.35, targetY: 2.4, targetX: 0, height: 430, hint: 'Нажми на часть столбика или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      K.axes(c, -5.3, 0, 11, 7.2);
      var iF = '<b>Постоянные издержки (FC)</b> не зависят от объёма производства: аренда, свет в аудитории, оклад охранника. Их платят, даже если ничего не производят.';
      var iV = '<b>Переменные издержки (VC)</b> зависят от объёма: сырьё, электроэнергия на станках, сдельная оплата. Больше выпуск — больше VC.';
      var FC = 1.5, F = [], V = [];
      for (var q = 0; q <= 6; q++) {
        var x = -4.5 + q * 1.6, vc = 0.55 * q + 0.05 * q * q;
        var f = c.box3(0.9, FC, 0.9, C.BLUE, [x, FC / 2, 0], iF); F.push(f);
        var v = c.box3(0.9, Math.max(0.01, vc), 0.9, C.ORANGE, [x, FC + vc / 2, 0], iV); v.visible = q > 0; V.push(v);
        c.label('Q=' + q, [x, -0.45, 0.8], 0.16, '#8b93b5');
      }
      c.label('FC', [-5.9, FC / 2, 0.5], 0.24, '#5b8def'); c.label('VC', [5.7, 4, 0], 0.24, '#e39b5b'); c.label('TC = FC + VC', [4.6, 7.0, 0], 0.22, '#f0c36b');
      var tc = K.tube(c, [0, 1, 2, 3, 4, 5, 6].map(function (q) { return [-4.5 + q * 1.6, FC + 0.55 * q + 0.05 * q * q + 0.05, 0.5]; }), C.GOLD, '<b>Общие (валовые) издержки TC = FC + VC.</b>', null, 0.06);
      c.S = { F: F, V: V, tc: tc };
    },
    chips: [
      { t: 'FC', on: function (c) { c.S.F.forEach(function (m) { c.ghost(m, false); }); c.S.V.forEach(function (m) { c.ghost(m, true); }); c.say('<b>Постоянные издержки</b> — одинаковая синяя полоса при любом Q. Лектор: студенты встанут и уйдут, а <b>свет в аудитории будет гореть</b>.'); } },
      { t: 'VC', on: function (c) { c.S.F.forEach(function (m) { c.ghost(m, true); }); c.S.V.forEach(function (m) { c.ghost(m, false); }); c.say('<b>Переменные издержки</b> растут с выпуском. Пример лектора — выплавка алюминия: чем больше металла, тем больше электроэнергии.'); } },
      { t: 'Q = 0', on: function (c) { c.S.F.forEach(function (m) { c.ghost(m, false); }); c.S.V.forEach(function (m) { c.ghost(m, false); }); c.setView(0.4, 1.15, 8, 1.2, -4.5, 0); c.say('Ничего не произвели (Q = 0), а издержки уже есть — это <b>FC</b>. Пример лектора: пока собирали деньги и выпускали акции пирожковой, пирожков не пекли, а <b>аренду платили</b>.'); } },
      { t: 'TC', on: function (c) { c.S.F.forEach(function (m) { c.ghost(m, false); }); c.S.V.forEach(function (m) { c.ghost(m, false); }); c.setView(0.35, 1.2, 14, 2.4, 0, 0); c.say('<b>Общие издержки TC = FC + VC</b> — золотая линия по верхушкам столбиков. <b>[ДОБАВЛЕНО]</b> формула.'); } }
    ]
  });

  /* ======================= 21. Одна и та же уборщица ======================= */
  reg('fi-cleaner3d', {
    autorotate: false,
    title: 'Постоянные или переменные? Зависит от договора', lead: 'Аудитория: горит свет, работает уборщица. Справа — ванна для выплавки алюминия. Лектор показала: деление на постоянные и переменные условно.',
    radius: 14, phi: 0.95, theta: 0.35, targetY: 1, height: 430, hint: 'Выбери ситуацию кнопкой.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iD = '<b>Аудитория.</b>';
      for (var r = 0; r < 3; r++) for (var k = 0; k < 2; k++) c.box3(2.0, 0.7, 0.6, C.WOOD, [-4 + k * 2.6, 0.35, -2.4 + r * 1.4], iD);
      var iLamp = '<b>Свет в аудитории</b> горит, сколько бы студентов ни сидело. Это <b>постоянные</b> издержки.';
      c.link([-2.7, 0, -3.6], [-2.7, 3.2, -3.6], C.SILVER, 0.05, iLamp); c.link([-2.7, 3.2, -3.6], [-2.7, 3.2, -0.6], C.SILVER, 0.04, iLamp);
      var lamp = K.glow(c, C.GOLD, 0.35, iLamp); lamp.position.set(-2.7, 2.9, -0.6);
      var tiles = [];
      for (var i = 0; i < 12; i++) { var t = c.box3(0.95, 0.04, 0.95, C.STONE, [-4.8 + (i % 6) * 1.0, 0.02, 2.0 + Math.floor(i / 6) * 1.0], 'Квадратные метры пола.'); tiles.push(t); }
      var iC = '<b>Уборщица.</b> Если платят за убранные м² — это <b>переменные</b> издержки. Если оклад — <b>постоянные</b>.';
      var cl = person(c, -4.8, 2.0, C.PURPLE, iC, null, 1);
      var mop = c.link([0.3, 0.1, 0.3], [0.3, 1.3, 0.1], C.WOOD, 0.04, iC); cl.add(mop);
      var iA = '<b>Выплавка алюминия</b> (электролиз): чем больше металла, тем больше электроэнергии. Это <b>переменные</b> издержки.';
      c.box3(2.2, 0.9, 1.4, C.DARK, [4.3, 0.45, 0], iA);
      var liq = c.box3(2.0, 0.05, 1.2, C.SILVER, [4.3, 0.92, 0], iA);
      var bars = []; for (var b = 0; b < 6; b++) { var m = c.box3(0.3, 0.2, 0.6, C.SILVER, [3.4 + b * 0.38, 0.1, 1.8], iA); m.visible = false; bars.push(m); }
      var en = c.mesh(new T.CylinderGeometry(0.35, 0.35, 1, 20), C.GOLD, '<b>Расход электроэнергии</b> растёт вместе с выпуском алюминия.', { emissive: C.GOLD, emissiveIntensity: 0.4 }); en.position.set(6.2, 0.5, -0.6);
      var pay = stack(c, -1.4, 3.2, 1, '<b>Оплата уборщицы.</b>');
      c.label('Al', [4.3, 1.8, 0], 0.26);
      c.S = { mode: 'light' };
      c.onFrame(function (tm) {
        var m = c.S.mode;
        lamp.material.emissiveIntensity = m === 'light' ? 0.6 + 0.3 * Math.sin(tm * 4) : 0.6;
        var n = m === 'piece' ? Math.floor((tm * 1.5) % 13) : 0;
        tiles.forEach(function (tl, i) { tl.material.color.set(i < n ? C.GREEN : C.STONE); });
        if (m === 'piece') { var idx = Math.max(0, n - 1); cl.position.set(-4.8 + (idx % 6) * 1.0, 0, 2.0 + Math.floor(idx / 6) * 1.0); }
        var want = m === 'piece' ? 1 + n : 4;
        while (pay.length < want) pay.push(coin(c, -1.4, 0.06 + pay.length * 0.11, 3.2, '<b>Оплата уборщицы.</b>'));
        pay.forEach(function (p, i) { p.visible = i < want; });
        var al = m === 'al' ? Math.floor((tm * 1.2) % 7) : 0;
        bars.forEach(function (b, i) { b.visible = i < al; });
        var h = m === 'al' ? 0.4 + al * 0.5 : 0.4; en.scale.y = K.lerp(en.scale.y, h, 0.1); en.position.y = en.scale.y / 2;
        liq.material.emissive.set(m === 'al' ? '#ff9a3c' : '#000000');
      });
    },
    chips: [
      { t: 'Свет горит', on: function (c) { c.S.mode = 'light'; c.setView(0.35, 0.95, 10, 1.4, -2.7, -1); c.say('Свет горит при любом числе студентов → <b>постоянные</b> издержки.'); } },
      { t: 'Уборщица на окладе', on: function (c) { c.S.mode = 'salary'; c.setView(0.35, 0.95, 10, 1, -2.5, 2.5); c.say('Пример лектора: уборщица на окладе. Она зашла, посмотрела, что всё чисто, и ушла. Зарплата та же → <b>постоянные</b> издержки.'); } },
      { t: 'Платят за м²', on: function (c) { c.S.mode = 'piece'; c.setView(0.35, 0.95, 10, 1, -2.5, 2.5); c.say('Если зарплата уборщицы зависит от <b>числа убранных квадратных метров</b>, это <b>переменные</b> издержки: больше метров — больше монет.'); } },
      { t: 'Алюминий', on: function (c) { c.S.mode = 'al'; c.setView(0.4, 0.95, 9, 1, 4.6, 0.4); c.say('Выплавка алюминия электролизом: чем больше выпуск, тем больше электричества → <b>переменные</b> издержки.'); } }
    ]
  });

  /* ======================= 22. Средние постоянные издержки ======================= */
  reg('fi-afc3d', {
    autorotate: false,
    title: 'Средние издержки: аренда «размазывается» по пирожкам', lead: 'Синяя плита — аренда пирожковой за месяц (постоянные издержки). Чем больше пирожков испекли, тем меньше аренды приходится на один пирожок.',
    radius: 12, phi: 1.0, theta: 0.3, targetY: 1.2, height: 400, hint: 'Выбери, сколько пирожков испекли.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Доля аренды на один пирожок</b> — средние постоянные издержки AFC = FC / Q.';
      var slices = [], pies = [];
      for (var i = 0; i < 8; i++) {
        var s = c.mesh(new T.BoxGeometry(1, 1.2, 1.2), C.BLUE, iS); s.position.y = 2.2; slices.push(s);
        var p = c.mesh(new T.SphereGeometry(0.38, 16, 12), C.POTATO, '<b>Пирожок.</b>'); p.scale.y = 0.6; p.position.set(0, 0.25, 0.9); pies.push(p);
      }
      c.label('аренда FC', [-4.2, 3.4, 0], 0.24, '#5b8def'); c.label('пирожки', [-4.6, 0.6, 1.6], 0.2, '#c9a46a');
      c.S = { q: 1 };
      c.onFrame(function () {
        var q = c.S.q, w = 8 / q;
        slices.forEach(function (s, i) {
          var on = i < q; s.visible = on; pies[i].visible = on;
          if (!on) return;
          var x = -4 + (i + 0.5) * w;
          s.scale.x = K.lerp(s.scale.x, w - 0.15, 0.1); s.position.x = K.lerp(s.position.x, x, 0.1);
          pies[i].position.x = s.position.x;
        });
      });
    },
    chips: [1, 2, 4, 8].map(function (q) {
      return { t: q + ' пирож.', on: function (c) { c.S.q = q; c.say('Аренда 8000 ₽, испекли <b>' + q + '</b> → на один пирожок приходится <b>' + (8000 / q) + ' ₽</b> аренды. <b>AFC = FC / Q</b> падает с ростом выпуска. <b>[ДОБАВЛЕНО]</b> Цифры условные.'); } };
    })
  });

  /* ======================= 23. Кривые MC, AVC, ATC ======================= */
  reg('fi-mc3d', {
    autorotate: false,
    title: 'Предельные и средние издержки', lead: 'Красная линия — предельные издержки MC. Она проходит через самые нижние точки средних издержек AVC и ATC. Зелёная линия — предельный доход MR.',
    radius: 13, phi: 1.25, theta: 0.15, targetY: 2.2, targetX: 0.3, height: 430, hint: 'Нажми на кривую или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      K.axes(c, -4.6, 0, 10, 5.6, null, 'Q (выпуск)', '₽ на 1 шт.');
      var X = function (q) { return -4.2 + q; }, Y = function (v) { return v * 0.65; };
      var MC = function (q) { return 3 - 1.2 * q + 0.18 * q * q; }, AVC = function (q) { return 3 - 0.6 * q + 0.06 * q * q; }, ATC = function (q) { return 6 / q + AVC(q); };
      function pts(f, a, b) { var r = []; for (var q = a; q <= b + 1e-9; q += 0.25) r.push([X(q), Y(f(q)), 0]); return r; }
      var iMC = '<b>Предельные издержки MC</b> — дополнительные издержки на производство <b>ещё одной</b> единицы продукции (маржинальные издержки).';
      var iA = '<b>Средние переменные издержки AVC = VC / Q.</b>', iT = '<b>Средние общие издержки ATC = TC / Q.</b> Их минимум — самый дешёвый в расчёте на единицу выпуск.';
      K.tube(c, pts(MC, 0.5, 8.1), C.RED, iMC);
      K.tube(c, pts(AVC, 0.5, 8.6), C.ORANGE, iA, null, 0.06);
      K.tube(c, pts(ATC, 1.35, 8.6), C.BLUE, iT);
      var P = 3.5, iMR = '<b>Предельный доход MR</b> — сколько добавит к выручке ещё одна единица. <b>[ДОБАВЛЕНО]</b> На конкурентном рынке MR равен цене.';
      c.link([X(0.3), Y(P), 0], [X(9.2), Y(P), 0], C.GREEN, 0.06, iMR);
      c.label('MC', [X(8.2), Y(MC(8.1)) + 0.5, 0], 0.26, '#e0645a'); c.label('ATC', [X(1.5), Y(ATC(1.5)) + 0.4, 0], 0.24, '#5b8def'); c.label('AVC', [X(0.4), Y(AVC(0.5)) - 0.5, 0], 0.22, '#e39b5b'); c.label('MR = P', [X(9.6), Y(P), 0], 0.22, '#4cc38a');
      var mAVC = K.glow(c, C.ORANGE, 0.17, '<b>Минимум AVC</b>: здесь MC пересекает AVC.'); mAVC.position.set(X(5), Y(AVC(5)), 0);
      var mATC = K.glow(c, C.BLUE, 0.17, '<b>Минимум ATC</b>: здесь MC пересекает ATC. Лектор: точка, где минимальные средние издержки совпадают с предельными.'); mATC.position.set(X(6.27), Y(ATC(6.27)), 0);
      var opt = K.glow(c, C.GOLD, 0.24, '<b>MC = MR</b> — оптимальный объём выпуска: дальше каждая единица добавляет к издержкам больше, чем к выручке.'); opt.position.set(X(7.06), Y(P), 0);
      var ball = K.glow(c, C.RED, 0.22, iMC);
      var v1 = c.link([0, 0, 0], [0, 1, 0], C.GOLD, 0.025); v1.visible = false;
      c.S = { run: true, X: X, Y: Y, MC: MC, mAVC: mAVC, mATC: mATC, opt: opt };
      c.onFrame(function (t) {
        var q = c.S.run ? 0.6 + ((t * 0.6) % 7.4) : c.S.q || 7.06;
        ball.position.set(X(q), Y(MC(q)), 0);
        v1.visible = !c.S.run; if (!c.S.run) { v1.position.set(X(q), Y(MC(q)) / 2, 0); v1.scale.y = Y(MC(q)); }
      });
    },
    chips: [
      { t: 'MC', on: function (c) { c.S.run = true; c.say('<b>Предельные издержки</b> — издержки на одну дополнительную единицу. Красный шарик бежит по кривой MC: сначала она снижается, потом растёт.'); } },
      { t: 'Минимумы', on: function (c) { c.S.run = false; c.S.q = 6.27; c.pick(c.S.mATC); c.say('MC пересекает AVC и ATC в их <b>самых нижних точках</b>. Пока MC ниже средних, средние снижаются. Когда MC выше средних, средние растут. <b>[ДОБАВЛЕНО]</b> объяснение.'); } },
      { t: 'MC = MR', on: function (c) { c.S.run = false; c.S.q = 7.06; c.pick(c.S.opt); c.say('Лектор: расширяться имеет смысл, пока <b>предельные издержки не сравнялись с предельным доходом</b>. Объём, который выбирает фирма: <b>MC = MR = P</b> — точка оптимального выпуска.'); } }
    ]
  });

  /* ======================= 24. Ещё одна партия пирожков ======================= */
  reg('fi-extra3d', {
    autorotate: false,
    title: 'Стоит ли печь ещё одну партию?', lead: 'Для каждой новой партии пирожков: зелёный столбик — сколько она добавит к выручке (MR), красный — сколько добавит к издержкам (MC). Для новых партий нужны мука, сгущёнка, курица, корица, а потом и новое помещение.',
    radius: 14, phi: 1.1, theta: 0.3, targetY: 1.6, height: 430, hint: 'Выбери партию.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var MRv = 2.5, MCv = [1.2, 1.8, 2.5, 3.8], pairs = [];
      var iR = '<b>MR</b> — дополнительный доход от ещё одной партии.', iC = '<b>MC</b> — дополнительные издержки на ещё одну партию: мука, сгущёнка, курица, корица, а для 4-й партии — аренда нового помещения.';
      MCv.forEach(function (mc, i) {
        var x = -4.5 + i * 3;
        var r = c.box3(0.8, MRv, 0.8, C.GREEN, [x - 0.5, MRv / 2, 0], iR), m = c.box3(0.8, mc, 0.8, C.RED, [x + 0.5, mc / 2, 0], iC);
        c.label('партия ' + (i + 1), [x, -0.5, 1], 0.18, '#8b93b5');
        pairs.push([r, m]);
      });
      c.label('MR', [-6.4, MRv, 0], 0.24, '#4cc38a');
      c.link([-6, MRv, 0], [6, MRv, 0], C.GREEN, 0.02, iR);
      var ing = K.group(c, -3.6, 0, 2.6);
      ing.add(c.box3(0.9, 1.1, 0.6, C.WHITE, [0, 0.55, 0], '<b>Мука.</b>'));
      var can = c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.6, 20), '#9fd3ff', '<b>Сгущёнка.</b>'); can.position.set(1.2, 0.3, 0); ing.add(can);
      var ch = c.mesh(new T.SphereGeometry(0.45, 14, 10), C.ORANGE, '<b>Курица.</b>'); ch.scale.set(1.2, 0.8, 1); ch.position.set(2.4, 0.4, 0); ing.add(ch);
      for (var k = 0; k < 3; k++) { var cn = c.mesh(new T.CylinderGeometry(0.06, 0.06, 0.8, 8), C.WOOD, '<b>Корица.</b>'); cn.rotation.z = Math.PI / 2; cn.position.set(3.6, 0.1 + k * 0.12, 0); ing.add(cn); }
      var room = house(c, 6.6, 0.8, C.STONE, '<b>Новое помещение</b> взяли в аренду. Именно оно сделало 4-ю партию невыгодной.', null, 1.1); room.visible = false;
      c.S = { pairs: pairs, room: room };
    },
    chips: [0, 1, 2, 3].map(function (i) {
      var txt = [
        '<b>Партия 1:</b> MC = 1,2 < MR = 2,5 → печём, она приносит прибыль.',
        '<b>Партия 2:</b> MC = 1,8 < MR = 2,5 → всё ещё выгодно.',
        '<b>Партия 3:</b> MC = MR = 2,5 → это <b>граница</b>. Здесь и надо остановиться: точка оптимального объёма.',
        '<b>Партия 4:</b> MC = 3,8 > MR. Пример лектора: закупили всё, арендовали новое помещение, а дополнительные затраты превысили дополнительный доход. Расширяться не стоило.'
      ][i];
      return { t: 'Партия ' + (i + 1), on: function (c) {
        c.S.pairs.forEach(function (p, j) { c.ghost(p[0], j !== i); c.ghost(p[1], j !== i); });
        c.S.room.visible = i === 3; c.say(txt + ' <b>[ДОБАВЛЕНО]</b> Цифры условные.');
      } };
    })
  });

  /* ======================= 25. Три прибыли ======================= */
  reg('fi-profit3d', {
    autorotate: false,
    title: 'Бухгалтерская, экономическая и нормальная прибыль', lead: 'Зелёный столбик — выручка. Рядом — из чего она складывается: явные издержки (красный), неявные (фиолетовый) и то, что осталось сверху (золотой).',
    radius: 12, phi: 1.2, theta: 0.35, targetY: 2.8, height: 430, hint: 'Сравни три вида прибыли кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iTR = '<b>Выручка (TR)</b> — все деньги от продаж.';
      var tr = c.box3(1.4, 6, 1.4, C.GREEN, [-3, 3, 0], iTR); c.label('выручка', [-3, 6.6, 0], 0.24, '#4cc38a');
      var iE = '<b>Явные (бухгалтерские) издержки.</b>', iI = '<b>Неявные (альтернативные) издержки.</b> Нормальная прибыль равна им.', iP = '<b>Экономическая прибыль</b> = выручка − (явные + неявные).';
      var e = c.box3(1.4, 3, 1.4, C.RED, [0, 1.5, 0], iE), im = c.box3(1.4, 1.8, 1.4, C.PURPLE, [0, 3.9, 0], iI), ep = c.box3(1.4, 1.2, 1.4, C.GOLD, [0, 5.4, 0], iP);
      c.label('явные', [1.4, 1.5, 0.8], 0.2, '#e0645a'); c.label('неявные', [1.5, 3.9, 0.8], 0.2, '#a78bfa'); var lep = c.label('экон. прибыль', [1.7, 5.4, 0.8], 0.2, '#f0c36b');
      var iB = '<b>Бухгалтерская прибыль</b> = выручка − явные издержки. Она больше экономической на величину неявных издержек.';
      var br = c.box3(0.35, 3, 0.35, C.GOLD, [2.4, 4.5, 0], iB); br.material.transparent = true; br.material.opacity = 0.6;
      var lb = c.label('бухгалтерская\nприбыль', [3.9, 4.5, 0], 0.24, '#f0c36b');
      c.S = { mode: 'acc', e: e, im: im, ep: ep, br: br, lb: lb, lep: lep, epH: 1.2 };
      c.onFrame(function () {
        var S = c.S, target = S.mode === 'norm' ? 0.01 : 1.2;
        S.epH = K.lerp(S.epH, target, 0.06); ep.scale.y = S.epH / 1.2; ep.position.y = 4.8 + S.epH / 2;
        var top = 4.8 + S.epH; br.scale.y = (top - 3) / 3; br.position.y = 3 + (top - 3) / 2;
        tr.scale.y = top / 6; tr.position.y = top / 2;
        lep.visible = S.epH > 0.2;
      });
    },
    chips: [
      { t: 'Бухгалтерская', on: function (c) { c.S.mode = 'acc'; c.ghost(c.S.e, true); c.ghost(c.S.im, false); c.ghost(c.S.ep, false); c.pick(c.S.br); c.say('<b>Бухгалтерская прибыль = выручка − явные (бухгалтерские) издержки.</b> Сюда входит и то, что на самом деле покрывает неявные издержки.'); } },
      { t: 'Экономическая', on: function (c) { c.S.mode = 'acc'; c.ghost(c.S.e, true); c.ghost(c.S.im, true); c.ghost(c.S.ep, false); c.say('Лектор: <b>экономическая прибыль — разница между выручкой от продаж и общими издержками</b>, то есть бухгалтерскими плюс альтернативными.'); } },
      { t: 'Нормальная', on: function (c) { c.S.mode = 'norm'; c.ghost(c.S.e, true); c.ghost(c.S.im, false); c.ghost(c.S.ep, false); c.say('Выручка покрыла явные и неявные издержки, экономическая прибыль = 0. То, что получил предприниматель, — <b>нормальная прибыль</b>, равная альтернативным издержкам. Её называют «нулевой», хотя она <b>совсем не равна нулю</b>.'); } }
    ]
  });
  /* ======================= 26. Рентабельность ======================= */
  reg('fi-rent3d', {
    autorotate: false,
    title: 'Рентабельность: прибыль «над чертой», затраты «под чертой»', lead: 'Рентабельность — дробь: прибыль в числителе, затраты в знаменателе. Золотой блок над пластиной — прибыль, красный под ней — затраты. Две фирмы, цифры условные.',
    radius: 13, phi: 1.2, theta: 0.2, targetY: 2.6, height: 420, hint: 'Сравни фирмы кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iP = '<b>Прибыль</b> — числитель дроби.', iC = '<b>Затраты</b> — знаменатель дроби.', iL = '<b>Черта дроби.</b> Рентабельность = прибыль / затраты × 100 %.';
      var F = [[-2.6, 100, 20, 'А'], [2.6, 300, 30, 'Б']];
      c.S = { x: [] };
      F.forEach(function (f) {
        var hc = f[1] / 60, hp = f[2] / 12, x = f[0];
        c.box3(1.4, hc, 1.4, C.RED, [x, hc / 2, 0], iC);
        c.box3(2.2, 0.08, 1.8, C.DARK, [x, hc + 0.15, 0], iL);
        c.box3(1.4, hp, 1.4, C.GOLD, [x, hc + 0.25 + hp / 2, 0], iP);
        c.label('фирма ' + f[3] + ': ' + Math.round(f[2] / f[1] * 100) + ' %', [x, hc + hp + 1.0, 0], 0.26, '#f0c36b');
        c.label('затраты ' + f[1], [x + 1.7, hc / 2, 0.8], 0.18, '#e0645a'); c.label('прибыль ' + f[2], [x + 1.7, hc + 0.3 + hp / 2, 0.8], 0.18, '#f0c36b');
        c.S.x.push(x);
      });
    },
    chips: [
      { t: 'Фирма А', on: function (c) { c.setView(0.2, 1.15, 8, 2, c.S.x[0], 0); c.say('Фирма А: прибыль 20 при затратах 100 → <b>рентабельность 20 %</b>. Каждый вложенный рубль принёс 20 копеек прибыли.'); } },
      { t: 'Фирма Б', on: function (c) { c.setView(0.2, 1.15, 10, 3, c.S.x[1], 0); c.say('Фирма Б: прибыль 30 при затратах 300 → <b>рентабельность 10 %</b>.'); } },
      { t: 'Сравнить', on: function (c) { c.setView(0.2, 1.2, 13, 2.6, 0, 0); c.say('У фирмы Б прибыль <b>больше</b>, а работает она <b>менее эффективно</b>: рентабельность вдвое ниже. Поэтому эффективность меряют не прибылью, а рентабельностью. <b>[ДОБАВЛЕНО]</b> Пример и цифры.'); } }
    ]
  });

  /* ======================= 27. Эффект масштаба: метро ======================= */
  reg('fi-scale3d', {
    autorotate: false,
    title: 'Эффект масштаба: чем больше пассажиров, тем дешевле поездка', lead: 'Пример лектора — метро. Станция и поезд стоят одинаково, сколько бы людей ни ехало. Столбик справа — себестоимость одной поездки.',
    radius: 13, phi: 1.05, theta: 0.3, targetY: 1.4, targetX: -0.4, height: 420, hint: 'Выбери, сколько людей проходит через станцию за день.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iSt = '<b>Станция и поезд</b> — огромные затраты, которые почти не зависят от числа пассажиров.';
      c.box3(9, 0.5, 2.4, C.STONE, [-1, 0.25, -0.4], iSt);
      var train = K.group(c, -1, 0, -2.6);
      for (var i = 0; i < 3; i++) { train.add(c.box3(2.6, 1.3, 1.2, C.BLUE, [-2.8 + i * 2.8, 0.95, 0], iSt)); for (var w = 0; w < 3; w++) train.add(c.box3(0.5, 0.4, 0.02, '#9fd3ff', [-3.6 + i * 2.8 + w * 0.8, 1.15, 0.61], iSt)); }
      c.label('М', [-5.2, 3.0, -0.4], 0.4, '#e0645a');
      var crowd = [], seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var k = 0; k < 70; k++) { var p = person(c, -5 + rnd() * 8, -1.2 + rnd() * 1.6, [C.RED, C.GREEN, C.PURPLE, C.ORANGE, C.TEA][k % 5], '<b>Пассажиры.</b> Чем их больше, тем меньше затрат приходится на одну поездку.', null, 0.45, 0.5); p.visible = false; crowd.push(p); }
      var bar = c.mesh(new T.CylinderGeometry(0.6, 0.6, 1, 28), C.GOLD, '<b>Себестоимость одной поездки</b> = все затраты метро / число поездок.'); bar.position.x = 4.6;
      c.label('1 поездка', [4.6, -0.5, 0.9], 0.2, '#f0c36b');
      c.S = { n: 3, h: 5.5, target: 5.5 };
      c.onFrame(function () {
        crowd.forEach(function (p, i) { p.visible = i < c.S.n; });
        c.S.h = K.lerp(c.S.h, c.S.target, 0.06); bar.scale.y = c.S.h; bar.position.y = c.S.h / 2;
      });
    },
    chips: [
      { t: '20 человек', on: function (c) { c.S.n = 3; c.S.target = 5.5; c.say('Если бы на метро ездили <b>20 человек</b>, каждая поездка стоила бы безумных денег: вся стоимость станции и поездов делится на 20.'); } },
      { t: '1 000', on: function (c) { c.S.n = 22; c.S.target = 1.6; c.say('Пассажиров больше — затраты делятся на большее число поездок, и <b>средние издержки падают</b>.'); } },
      { t: '80 000', on: function (c) { c.S.n = 70; c.S.target = 0.2; c.say('Лектор: через одну новую станцию ежедневно проходит <b>больше 80 тысяч человек</b>. Себестоимость одной поездки становится маленькой. Это и есть <b>положительный эффект масштаба</b>.'); } }
    ]
  });

  /* ======================= 28. Кривая долгосрочных средних издержек ======================= */
  reg('fi-lrac3d', {
    autorotate: false,
    title: 'Положительный и отрицательный эффект масштаба', lead: 'Внизу фабрики растут слева направо. Кривая — средние издержки при каждом размере фабрики. Сначала они падают (зелёный участок), потом растут (красный).',
    radius: 12.5, phi: 1.35, theta: 0.12, targetY: 2.0, targetX: 0.3, height: 430, hint: 'Нажми на участок кривой или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      K.axes(c, -5, 0, 10.4, 5.6, null, 'размер', '₽ на 1 шт.');
      var X = function (q) { return -4.6 + q; }, Y = function (v) { return v * 0.7; }, L = function (q) { return 2 + 0.11 * (q - 5) * (q - 5); };
      function pts(f, a, b) { var r = []; for (var q = a; q <= b + 1e-9; q += 0.25) r.push([X(q), Y(f(q)), 0]); return r; }
      var iP = '<b>Положительный эффект масштаба:</b> фирма растёт — средние издержки на единицу <b>снижаются</b>.';
      var iN = '<b>Отрицательный эффект масштаба:</b> фирма растёт — средние издержки <b>растут</b>: управление усложняется, фирма теряет гибкость, мешают локальные интересы.';
      var iZ = '<b>Постоянная отдача [ДОБАВЛЕНО]:</b> рост фирмы почти не меняет средние издержки.';
      var g = K.tube(c, pts(L, 0.4, 4.2), C.GREEN, iP), z = K.tube(c, pts(L, 4.2, 5.8), C.GREY, iZ), r = K.tube(c, pts(L, 5.8, 9.6), C.RED, iN);
      c.label('LRAC', [X(9.8), Y(L(9.6)) + 0.4, 0], 0.24, '#e0645a');
      [1, 3, 5, 7, 9].forEach(function (q, i) { var f = factory(c, X(q), -1.8, C.STONE, i < 2 ? iP : i > 2 ? iN : iZ, null, 0.25 + i * 0.12); });
      var cell = K.tube(c, pts(function (q) { return 0.6 + 7 / (q + 0.6); }, 0.4, 9.6), C.PURPLE, '<b>Сотовая связь:</b> средние издержки минимальны только при <b>очень большом</b> объёме. Пока абонентов было мало, телефоны были тяжёлыми «чемоданами», а звонок стоил очень дорого.', null, 0.07);
      cell.visible = false;
      var cl = c.label('сотовая связь', [X(8.6), Y(0.6 + 7 / 9.2) + 0.5, 0], 0.2, '#a78bfa'); cl.visible = false;
      c.S = { g: g, z: z, r: r, cell: cell, cl: cl };
    },
    chips: [
      { t: 'Положительный', on: function (c) { c.S.cell.visible = c.S.cl.visible = false; c.ghost(c.S.r, true); c.ghost(c.S.z, true); c.ghost(c.S.g, false); c.say('Лектор: эффект масштаба <b>положительный</b>, если при увеличении размеров предприятия средние издержки <b>уменьшаются</b>. Пример — метро.'); } },
      { t: 'Отрицательный', on: function (c) { c.S.cell.visible = c.S.cl.visible = false; c.ghost(c.S.g, true); c.ghost(c.S.z, true); c.ghost(c.S.r, false); c.say('<b>Отрицательный</b> — если средние издержки <b>увеличиваются</b>. Причины по лектору: управление усложняется, взаимодействие между подразделениями ухудшается, фирма менее гибкая, больше противоречий, трудности передачи информации, появляются локальные интересы.'); } },
      { t: 'Сотовая связь', on: function (c) { c.S.cell.visible = c.S.cl.visible = true; c.ghost(c.S.g, true); c.ghost(c.S.z, true); c.ghost(c.S.r, true); c.say('В разных отраслях эффект масштаба проявляется по-разному. Есть отрасли, где средние издержки минимальны только при <b>очень большом</b> объёме производства, — например, <b>сотовая связь</b>.'); } },
      { t: 'Вся кривая', on: function (c) { c.S.cell.visible = c.S.cl.visible = false; [c.S.g, c.S.z, c.S.r].forEach(function (m) { c.ghost(m, false); }); c.say('<b>Эффект масштаба</b> — снижение затрат на единицу продукции при укрупнении производства. Лектор: «Запишите, спрошу на экзамене».'); } }
    ]
  });
})();
