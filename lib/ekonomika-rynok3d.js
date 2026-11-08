/* 3D-модели к конспекту «Экономика. Рынок».
   В Markdown: @@graph:o6-market3d@@ @@graph:o6-conditions3d@@ @@graph:o6-division3d@@ @@graph:o6-circular3d@@
   @@graph:o6-tools3d@@ @@graph:o6-functions3d@@ @@graph:o6-structures3d@@ @@graph:o6-failures3d@@ @@graph:o6-proscons3d@@
   Нужен lib/ekonomika-osnovy-kit.js (window.OsnovyKit). */
(function () {
  'use strict';
  var K = window.OsnovyKit;
  if (!K) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, house = K.house, factory = K.factory;

  /* ======================= 1. Что такое рынок ======================= */
  reg('o6-market3d', {
    autorotate: false,
    title: 'Рынок — не только базар', lead: 'Четыре вида одного и того же: базарный прилавок, маркетплейс с курьером, биржа с табло, объявление. Везде покупатели и продавцы находят друг друга и договариваются о цене.',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1, height: 440, hint: 'Нажми на форму рынка.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var M = [
        [-3.6, -2.6, '<b>Базар</b>: прилавок, живой торг. Рынок — сфера взаимодействия спроса (покупатель) и предложения (продавец).'],
        [3.6, -2.6, '<b>Маркетплейс</b>: продавец и покупатель не видят друг друга, но рынок работает — через цены и рейтинги.'],
        [-3.6, 2.6, '<b>Биржа</b>: торгуют акциями, нефтью, валютой. Цена меняется каждую секунду — это <b>конъюнктура</b> спроса и предложения.'],
        [3.6, 2.6, '<b>Объявление</b> («Авито»): даже частная продажа велосипеда — рынок.']
      ];
      c.S = { M: M };
      var g0 = K.group(c, M[0][0], 0, M[0][1]); g0.add(c.box3(1.8, 0.8, 0.8, C.WOOD, [0, 0.4, 0], M[0][2])); for (var i = 0; i < 4; i++) { var ap = c.mesh(new T.SphereGeometry(0.15, 10, 8), [C.RED, C.GOLD, C.GREEN, C.ORANGE][i], M[0][2]); ap.position.set(-0.6 + i * 0.4, 0.95, 0); g0.add(ap); }
      person(c, M[0][0], M[0][1] + 1.0, C.BLUE, M[0][2], null, 0.8); person(c, M[0][0], M[0][1] - 1.0, C.GOLD, M[0][2], null, 0.8);
      var wh = c.box3(1.8, 1.2, 1.2, C.PURPLE, [M[1][0], 0.6, M[1][1]], M[1][2]);
      var box = c.box3(0.4, 0.4, 0.4, C.POTATO, [0, 0, 0], M[1][2]);
      var b = K.group(c, M[2][0], 0, M[2][1]); b.add(c.box3(2.2, 1.4, 0.15, C.DARK, [0, 1.0, 0], M[2][2]));
      var line = []; for (var k = 0; k < 8; k++) { var bar = c.box3(0.18, 0.2, 0.05, C.GREEN, [M[2][0] - 0.8 + k * 0.23, 0.8, M[2][1] + 0.1], M[2][2]); line.push(bar); }
      var sign = K.group(c, M[3][0], 0, M[3][1]); sign.add(c.link([0, 0, 0], [0, 1.2, 0], C.WOOD, 0.04, M[3][2])); sign.add(c.box3(1.0, 0.7, 0.05, C.PAPER, [0, 1.4, 0], M[3][2]));
      var bike = c.mesh(new T.TorusGeometry(0.3, 0.05, 8, 20), C.DARK, M[3][2]); bike.position.set(M[3][0] + 0.9, 0.35, M[3][1]); var bike2 = bike.clone(); bike2.position.x += 0.8; c.root.add(bike2);
      [['базар', 0], ['маркетплейс', 1], ['биржа', 2], ['объявление', 3]].forEach(function (q) { c.label(q[0], [M[q[1]][0], 2.4, M[q[1]][1]], 0.2); });
      var mid = coin(c, 0, 1, 0, '<b>Цена</b> — механизм, через который рынок связывает производство и потребление.', null, 0.45);
      c.onFrame(function (t) {
        var q = (t * 0.3) % 1; box.position.set(K.lerp(M[1][0], M[1][0] - 1.5, q), 0.3 + Math.sin(q * Math.PI) * 1.2, K.lerp(M[1][1], M[1][1] + 2, q));
        line.forEach(function (m, i) { var h = 0.2 + 0.5 * Math.abs(Math.sin(t * 2 + i)); m.scale.y = h / 0.2; m.material.color.set(Math.sin(t * 2 + i) > 0 ? C.GREEN : C.RED); });
        mid.rotation.x = t; mid.rotation.y = t * 0.7; mid.position.y = 1 + 0.15 * Math.sin(t * 2);
      });
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Базар', 'Маркетплейс', 'Биржа', 'Объявление'][i], on: function (c) { var q = c.S.M[i]; c.setView(Math.atan2(q[0], q[1]), 0.95, 8, 1, q[0], q[1]); c.say(q[2]); } }; })
  });

  /* ======================= 2. Условия возникновения рынка ======================= */
  var CND = [
    ['разделение\nтруда', C.BLUE, '<b>1. Разделение труда и специализация.</b> Если каждый делает всё сам, обмениваться незачем.'],
    ['частная\nсобственность', C.GOLD, '<b>2. Частная собственность.</b> Если субъекты не наделены правами собственности, рынок существовать не может.'],
    ['обособленность', C.GREEN, '<b>3. Экономическая обособленность</b> — возникает на основе частной собственности и зависит от разделения труда.'],
    ['свобода\nдействий', C.PURPLE, '<b>4. Свобода действий и свободные субъекты.</b> Раб или крепостной свободно торговать не может.'],
    ['деньги', C.ORANGE, '<b>5. Наличие денег.</b> Без них обмен — неудобный бартер.'],
    ['свобода\nцен', C.RED, '<b>6. Свобода ценообразования.</b> Если цены назначают сверху, рынок не работает.']
  ];
  reg('o6-conditions3d', {
    autorotate: false,
    title: 'Шесть колонн рынка (важный вопрос!)', lead: 'Крыша «Рынок» держится на шести колоннах-условиях. Убери любую — и крыша накренится. Запоминалка: «Рыбаки Часто Охотятся Своими Дырявыми Сетями».',
    radius: 15, phi: 1.0, theta: 0.25, targetY: 1.6, height: 450, hint: 'Нажми на колонну — она «уберётся».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var roof = c.box3(10, 0.4, 2.6, C.STONE, [0, 3.4, 0], '<b>Рынок</b> существует, только если выполнены все условия.');
      c.label('РЫНОК', [0, 4.1, 0], 0.3, '#f0c36b');
      var cols = CND.map(function (q, i) { var x = -4.2 + i * 1.68; var m = c.mesh(new T.CylinderGeometry(0.32, 0.38, 3.2, 18), q[1], q[2]); m.position.set(x, 1.6, 0); c.label(q[0], [x, 0.4, 1.3], 0.15); m.userData.idx = i; return m; });
      c.S = { off: -1, cols: cols };
      c.onFrame(function () {
        cols.forEach(function (m, i) { var off = c.S.off === i; m.scale.y = K.lerp(m.scale.y, off ? 0.05 : 1, 0.08); m.position.y = 1.6 * m.scale.y; });
        roof.rotation.z = K.lerp(roof.rotation.z, c.S.off < 0 ? 0 : (c.S.off < 3 ? 0.12 : -0.12), 0.05);
      });
    },
    onPick: function (obj, c) { if (obj.userData.idx != null) { c.S.off = c.S.off === obj.userData.idx ? -1 : obj.userData.idx; } },
    chips: CND.map(function (q, i) { return { t: String(i + 1) + '. ' + q[0].replace('\n', ' '), on: function (c) { c.S.off = i; c.say(q[2] + ' Колонна убрана — крыша рынка кренится.'); } }; }).concat([{ t: 'Все на месте', on: function (c) { c.S.off = -1; c.say('Все шесть условий выполнены — рынок стоит прочно.'); } }])
  });

  /* ======================= 3. Разделение труда ======================= */
  reg('o6-division3d', {
    autorotate: false,
    title: 'Четыре формы общественного разделения труда', lead: 'Дорожка истории: на каждом шаге от общего дела отделяется новая группа людей. Чем больше специализация, тем больше нужно меняться — тем важнее рынок.',
    radius: 16, phi: 0.95, theta: 0.15, targetY: 1, height: 450, hint: 'Нажимай этапы по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var S = [
        ['земледелие |\nскотоводство', '<b>1. Отделение земледелия от скотоводства.</b> Одни выращивают зерно, другие пасут скот — и меняются.'],
        ['ремесло |\nсельское хоз.', '<b>2. Отделение ремесла от сельского хозяйства.</b> Появляются гончары, кузнецы, ткачи.'],
        ['купцы', '<b>3. Выделение посредника — купца.</b> Торговый капитал отделяется от производства.'],
        ['НИОКР', '<b>4. Выделение НИОКР</b> — научно-исследовательских и опытно-конструкторских разработок.']
      ];
      c.S = { S: S, n: 0, groups: [] };
      S.forEach(function (s, i) {
        var x = -5.4 + i * 3.6, g = K.group(c, x, 0, 0); c.S.groups.push(g);
        var pd = c.mesh(new T.CylinderGeometry(1.3, 1.4, 0.25, 30), [C.TEA, C.WOOD, C.GOLD, C.PURPLE][i], s[1]); pd.position.y = 0.12; g.add(pd);
        c.label(s[0], [x, 3.0, 0], 0.17);
        if (i === 0) { K.tree(c, -0.5, 0, s[1], g, 0.6); var cow = c.box3(0.6, 0.35, 0.3, C.WHITE, [0.5, 0.5, 0], s[1]); g.add(cow); }
        if (i === 1) { var pot = c.mesh(new T.CylinderGeometry(0.25, 0.35, 0.6, 14), C.ORANGE, s[1]); pot.position.set(-0.4, 0.55, 0); g.add(pot); g.add(c.box3(0.5, 0.35, 0.35, C.DARK, [0.5, 0.4, 0], s[1])); }
        if (i === 2) { person(c, 0, 0, C.GOLD, s[1], g, 0.8, 0.25); g.add(c.box3(0.6, 0.4, 0.4, C.WOOD, [0.6, 0.45, 0], s[1])); }
        if (i === 3) { var fl = c.mesh(new T.CylinderGeometry(0.1, 0.3, 0.6, 14), '#9fd3ff', s[1], { transparent: true, opacity: 0.7 }); fl.position.set(-0.3, 0.55, 0); g.add(fl); K.gear(c, 0.5, 0.75, 0, C.SILVER, s[1], g, 0.6); }
        g.scale.setScalar(0.01);
      });
      c.onFrame(function (t) { c.S.groups.forEach(function (g, i) { var s = i < c.S.n ? 1 : 0.01; g.scale.setScalar(K.lerp(g.scale.x, s, 0.08)); g.rotation.y = i === c.S.n - 1 ? Math.sin(t) * 0.3 : 0; }); });
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: String(i + 1), small: ['земл./скот', 'ремесло', 'купцы', 'НИОКР'][i], on: function (c) { c.S.n = i + 1; c.say(c.S.S[i][1]); } }; }).concat([
      { t: 'Специализация', on: function (c) { c.S.n = 4; c.say('<b>Специализация</b> — ориентация производителей на изготовление отдельных продуктов и их элементов. Бывает подетальное и поузловое разделение. [ДОБАВЛЕНО] Булавки у Смита: 10 рабочих с разделением операций — 48 000 в день.'); } }
    ])
  });

  /* ======================= 4. Круговорот (схема Вальраса) ======================= */
  reg('o6-circular3d', {
    autorotate: false,
    title: 'Экономический круговорот (схема Вальраса)', lead: 'Слева — домохозяйства, справа — фирмы. Сверху — рынок товаров, снизу — рынок ресурсов. Кубики (реальные блага) бегут по кругу в одну сторону, монеты (деньги) — навстречу.',
    radius: 16, phi: 0.75, theta: 0.0, targetY: 0.5, height: 470, hint: 'Включай потоки и добавь государство с заграницей.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iH = '<b>Домашние хозяйства</b>: собственники факторов производства (прежде всего рабочей силы), стремятся к максимальному удовлетворению потребностей.';
      var iF = '<b>Фирмы</b>: используют факторы производства, чтобы изготовить продукцию и продать её.';
      house(c, -5, 0, C.CREAM, iH, null, 1.3); c.label('домохозяйства', [-5, 2.6, 0], 0.2);
      factory(c, 5, 0, C.STONE, iF, null, 0.8); c.label('фирмы', [5, 2.8, 0], 0.2);
      var iG = '<b>Рынок товаров и услуг</b>: фирмы продают, домохозяйства покупают.', iR = '<b>Рынок ресурсов</b>: домохозяйства продают труд, землю, капитал; фирмы платят зарплату, ренту, процент, прибыль.';
      c.box3(2.6, 0.3, 1.4, C.BLUE, [0, 0.15, -3.8], iG); c.label('рынок товаров', [0, 1.2, -3.8], 0.18, '#5b8def');
      c.box3(2.6, 0.3, 1.4, C.GREEN, [0, 0.15, 3.8], iR); c.label('рынок ресурсов', [0, 1.2, 3.8], 0.18, '#4cc38a');
      function ring(r) { var pts = []; for (var i = 0; i <= 64; i++) { var a = i / 64 * Math.PI * 2; pts.push([Math.cos(a) * 5 * r, 0.12, Math.sin(a) * 3.8 * r]); } return pts; }
      K.tube(c, ring(1.08), C.RED, '<b>Реальный поток</b>: ресурсы и товары.', null, 0.04); K.tube(c, ring(0.92), C.GOLD, '<b>Денежный поток</b>: доходы и расходы.', null, 0.04);
      var goods = [], money = [];
      for (var i = 0; i < 8; i++) { goods.push(c.box3(0.3, 0.3, 0.3, C.RED, [0, 0, 0], '<b>Реальные блага</b>: труд → фирмам, товары → домохозяйствам.')); money.push(coin(c, 0, 0, 0, '<b>Деньги</b>: зарплата → домохозяйствам, расходы на покупки → фирмам.', null, 0.18)); }
      var state = K.group(c, 0, 0, 0); state.add(c.box3(1.4, 1.0, 1.0, C.WHITE, [0, 0.5, 0], '<b>Государство</b>: собирает налоги, покупает товары, платит пенсии и зарплаты.')); var dm = c.mesh(new T.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), C.RED, '<b>Государство</b>'); dm.position.y = 1.0; state.add(dm); state.visible = false;
      var globe = c.mesh(new T.SphereGeometry(0.6, 20, 14), '#5bc0ff', '<b>Заграница</b>: экспорт и импорт.', { emissive: '#2a6fa8', emissiveIntensity: 0.3 }); globe.position.set(0, 1.0, -6.6); globe.visible = false;
      c.S = { real: true, mon: true, ext: false, state: state, globe: globe };
      c.onFrame(function (t) {
        goods.forEach(function (m, i) { var a = -(t * 0.25 + i / 8) * Math.PI * 2; m.visible = c.S.real; m.position.set(Math.cos(a) * 5.4, 0.35, Math.sin(a) * 4.1); m.rotation.y = t; });
        money.forEach(function (m, i) { var a = (t * 0.25 + i / 8) * Math.PI * 2; m.visible = c.S.mon; m.position.set(Math.cos(a) * 4.6, 0.35, Math.sin(a) * 3.5); m.rotation.x = t * 3; });
        state.visible = c.S.ext; globe.visible = c.S.ext; globe.rotation.y = t;
      });
    },
    chips: [
      { t: 'Реальный поток', on: function (c) { c.S.real = true; c.S.mon = false; c.say('<b>Реальные блага</b> движутся по кругу: домохозяйства → (труд) → фирмы → (товары) → домохозяйства.'); } },
      { t: 'Денежный поток', on: function (c) { c.S.real = false; c.S.mon = true; c.say('<b>Деньги</b> идут навстречу: фирмы платят доходы домохозяйствам, домохозяйства тратят их на товары фирм.'); } },
      { t: 'Оба', on: function (c) { c.S.real = true; c.S.mon = true; c.say('<b>Экономический круговорот</b> — круговое движение реальных благ, сопровождающееся встречным потоком денежных доходов и расходов.'); } },
      { t: '+ государство и заграница', on: function (c) { c.S.ext = true; c.setView(0.0, 0.75, 18, 0.5, 0, -1); c.say('Сейчас схема Вальраса <b>дополнена</b> государством и заграницей.'); } }
    ]
  });

  /* ======================= 5. Инструменты рынка ======================= */
  reg('o6-tools3d', {
    autorotate: false,
    title: 'Инструменты рынка: цена-светофор', lead: 'Поле клубники. Цена — светофор для фермеров: высокая цена — «зелёный», расширяем грядки; низкая — «красный», сокращаем. Никто не командует — направляет цена.',
    radius: 14, phi: 1.0, theta: 0.3, targetY: 1.2, height: 440, hint: 'Меняй цену кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var tl = K.group(c, -4, 0, -1); tl.add(c.link([0, 0, 0], [0, 2, 0], C.DARK, 0.06, 'Светофор-цена')); tl.add(c.box3(0.6, 1.4, 0.4, C.DARK, [0, 2.6, 0], 'Светофор-цена'));
      var red = K.glow(c, C.RED, 0.18, 'Низкая цена: сократить производство'), grn = K.glow(c, C.GREEN, 0.18, 'Высокая цена: расширить производство');
      red.position.set(-4, 3.0, -0.78); grn.position.set(-4, 2.2, -0.78);
      var rows = []; for (var r = 0; r < 8; r++) { var row = K.group(c, -1.5 + r * 0.8, 0, 0.5); for (var k = 0; k < 5; k++) { var be = c.mesh(new T.SphereGeometry(0.14, 8, 6), C.RED, '<b>Клубника</b> — объём производства зависит от цены.'); be.position.set(0, 0.15, -1.5 + k * 0.7); row.add(be); } rows.push(row); }
      var farmer = person(c, 4.6, 0.5, C.GOLD, '<b>Фермер</b> сам решает, сколько сажать, глядя на цену.', null, 1.0);
      var tag = c.label('цена: 300 ₽', [0, 3.2, 0], 0.22, '#f0c36b');
      c.S = { p: 1, tag: tag };
      c.onFrame(function (t) {
        var n = c.S.p === 2 ? 8 : c.S.p === 1 ? 5 : 2;
        rows.forEach(function (row, i) { var s = i < n ? 1 : 0.01; row.scale.setScalar(K.lerp(row.scale.x, s, 0.06)); });
        red.material.emissiveIntensity = c.S.p === 0 ? 1 : 0.05; grn.material.emissiveIntensity = c.S.p === 2 ? 1 : 0.05;
        farmer.rotation.y = Math.sin(t) * 0.5;
      });
    },
    chips: [
      { t: 'Цена высокая', on: function (c) { c.S.p = 2; c.say('<b>Цены</b> определяют объёмы производства: высокая цена — сигнал расширять грядки.'); } },
      { t: 'Цена средняя', on: function (c) { c.S.p = 1; c.say('Цена равновесная — производят столько, сколько покупают.'); } },
      { t: 'Цена низкая', on: function (c) { c.S.p = 0; c.say('Низкая цена — сигнал сокращать производство. Ресурсы уйдут туда, где нужнее.'); } },
      { t: 'Все инструменты', on: function (c) { c.say('<b>Инструменты рынка:</b> <b>цены</b>; <b>спрос</b> (платёжеспособная потребность) и <b>предложение</b> (количество товаров в продаже при данной цене); <b>конкуренция</b> (соперничество за лучший результат).'); } }
    ]
  });

  /* ======================= 6. Функции рынка ======================= */
  var FN = [
    { t: 'ценообразующая', col: C.GOLD, info: '<b>Ценообразующая:</b> из взаимодействия спроса и предложения формируется равновесная цена.', icon: function (c, g) { K.coin(c, 0, 0.6, 0, FN[0].info, g, 0.35).rotation.x = Math.PI / 2; } },
    { t: 'информационная', col: C.BLUE, info: '<b>Информационная:</b> даёт субъектам рынка информацию о ценах и др.', icon: function (c, g) { g.add(c.box3(0.8, 0.6, 0.06, C.DARK, [0, 0.6, 0], FN[1].info)); g.add(c.box3(0.7, 0.5, 0.02, '#5b8def', [0, 0.6, 0.04], FN[1].info)); } },
    { t: 'регулирующая', col: C.GREEN, info: '<b>Регулирующая:</b> воздействует на все сферы экономики, согласует производство и потребление.', icon: function (c, g) { K.gear(c, 0, 0.6, 0, C.GREEN, FN[2].info, g, 0.8); } },
    { t: 'санирующая', col: C.RED, info: '<b>Санирующая:</b> отсеивает неконкурентоспособные предприятия. Средний цикл малого бизнеса — не больше 5 лет.', icon: function (c, g) { var f = factory(c, 0, 0, C.GREY, FN[3].info, g, 0.35); f.rotation.z = 0.5; } },
    { t: 'посредническая', col: C.PURPLE, info: '<b>Посредническая:</b> рынок — посредник между производителями и потребителями.', icon: function (c, g) { person(c, -0.35, 0, C.GOLD, FN[4].info, g, 0.5); person(c, 0.35, 0, C.BLUE, FN[4].info, g, 0.5); } },
    { t: 'стимулирующая', col: C.ORANGE, info: '<b>Стимулирующая:</b> стимулирует участвовать в конкуренции и увеличивать доход.', icon: function (c, g) { var T = c.THREE; var a = c.mesh(new T.ConeGeometry(0.3, 0.6, 12), C.ORANGE, FN[5].info); a.position.y = 0.9; g.add(a); g.add(c.link([0, 0, 0], [0, 0.6, 0], C.ORANGE, 0.1, FN[5].info)); } },
    { t: 'социальная', col: C.TEA, info: '<b>Социальная:</b> [ДОБАВЛЕНО — в документе оборвано] дифференцирует доходы участников по результатам их деятельности.', icon: function (c, g) { [0.3, 0.6, 0.9].forEach(function (h, i) { g.add(c.box3(0.22, h, 0.22, C.TEA, [-0.3 + i * 0.3, h / 2, 0], FN[6].info)); }); } }
  ];
  reg('o6-functions3d', {
    title: 'Семь функций рынка', lead: 'В центре — рынок. Вокруг — его функции. Нажми на «санирующую»: слабая фирма-домик лежит на боку — рынок её отсеял.',
    radius: 16, phi: 0.95, theta: 0.3, targetY: 1, height: 450, hint: 'Нажми на постамент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var core = coin(c, 0, 1.2, 0, '<b>Рынок</b> выполняет семь функций.', null, 0.8); core.rotation.x = Math.PI / 2;
      c.label('рынок', [0, 2.6, 0], 0.24);
      K.ring(c, FN, 6);
      c.onFrame(function (t) { core.rotation.z = t; });
    },
    chips: K.ringChips(FN, ['Ценообразующая', 'Информационная', 'Регулирующая', 'Санирующая', 'Посредническая', 'Стимулирующая', 'Социальная'])
  });

  /* ======================= 7. Типы рынков ======================= */
  reg('o6-structures3d', {
    autorotate: false,
    title: 'Типы рынков по степени конкуренции', lead: 'Продавцы (жёлтые) и покупатели (синие). Меняй тип рынка — и смотри, сколько продавцов и покупателей остаётся.',
    radius: 15, phi: 0.95, theta: 0.2, targetY: 0.8, height: 450, hint: 'Нажми на тип рынка.',
    build: function (c) {
      c.ground(8.5);
      c.box3(0.15, 0.5, 9, C.SILVER, [0, 0.25, 0], 'Граница: слева продавцы, справа покупатели.');
      var sel = [], buy = [];
      for (var i = 0; i < 16; i++) sel.push(person(c, -1.5 - (i % 4) * 1.1, -3.3 + Math.floor(i / 4) * 2.2, C.GOLD, 'Продавец', null, 0.8));
      for (var j = 0; j < 16; j++) buy.push(person(c, 1.5 + (j % 4) * 1.1, -3.3 + Math.floor(j / 4) * 2.2, C.BLUE, 'Покупатель', null, 0.8));
      c.label('продавцы', [-3.2, 2.4, 0], 0.2, '#f0c36b'); c.label('покупатели', [3.2, 2.4, 0], 0.2, '#5b8def');
      c.S = { s: 16, b: 16, big: false, sel: sel, buy: buy };
      c.onFrame(function (t) {
        sel.forEach(function (p, i) { p.visible = i < c.S.s; var sc = c.S.s === 1 ? 1.8 : c.S.s <= 3 ? 1.3 : 0.8; p.scale.setScalar(K.lerp(p.scale.x, sc / 0.8, 0.06)); p.position.y = 0.05 * Math.sin(t * 3 + i); });
        buy.forEach(function (p, i) { p.visible = i < c.S.b; var sc = c.S.b === 1 ? 1.8 : 0.8; p.scale.setScalar(K.lerp(p.scale.x, sc / 0.8, 0.06)); });
      });
    },
    chips: [
      ['Монополия', 1, 16, '<b>Монополистический рынок:</b> одна фирма производит уникальный товар (РЖД, Роскосмос).'],
      ['Олигополия', 3, 16, '<b>Олигополия:</b> несколько крупных компаний делят рынок (операторы мобильной связи).'],
      ['Монопол. конкуренция', 10, 16, '<b>Монополистическая конкуренция:</b> множество фирм выпускают схожие, но различные товары разного качества (рынок одежды). Это современная конкуренция.'],
      ['Совершенная', 16, 16, '<b>Совершенная конкуренция:</b> утопическая модель — бесконечно много равных фирм с идентичными товарами. Ближе всего — сельхозтовары.'],
      ['Монопсония', 16, 1, '<b>Монопсония:</b> монополия покупателя — один покупатель (государственная закупка вооружения).']
    ].map(function (q) { return { t: q[0], on: function (c) { c.S.s = q[1]; c.S.b = q[2]; c.say(q[3]); } }; })
  });

  /* ======================= 8. Провалы рынка ======================= */
  var FL = [
    { t: 'монополии', col: C.RED, info: '<b>1. Не способен противостоять монополистическим тенденциям:</b> «рынок рождает монополии, а монополии убивают рынок».', icon: function (c, g) { person(c, 0, 0, C.RED, FL[0].info, g, 1.0); K.crown(c, 0, 1.25, 0, FL[0].info, g, 0.7); } },
    { t: 'общественные\nблага', col: C.GREEN, info: '<b>2. Не способен производить общественные блага</b> — из-за проблемы безбилетника.', icon: function (c, g) { var T = c.THREE; var t2 = c.mesh(new T.CylinderGeometry(0.15, 0.25, 1.2, 12), C.WHITE, FL[1].info); t2.position.y = 0.6; g.add(t2); var l = K.glow(c, C.GOLD, 0.15, FL[1].info); l.position.y = 1.3; g.add(l); } },
    { t: 'внешние\nэффекты', col: C.GREY, info: '<b>3. Не пригоден для устранения внешних эффектов</b> (экстерналий): дым завода, шум, загрязнение.', icon: function (c, g) { var f = factory(c, 0, 0, C.STONE, FL[2].info, g, 0.35); K.smoke(c, f, 3); } },
    { t: 'неравенство', col: C.GOLD, info: '<b>4. Не способен обеспечить социальные гарантии</b>, нейтрализовать чрезмерную дифференциацию доходов.', icon: function (c, g) { K.stack(c, -0.3, 0, 8, FL[3].info, g, C.GOLD, 0.25); K.stack(c, 0.35, 0, 1, FL[3].info, g, C.GOLD, 0.25); } },
    { t: 'асимметрия\nинформации', col: C.PURPLE, info: '<b>5. Асимметрия информации:</b> стороны обладают разной информацией в разном объёме. Продавец знает, что машина битая, покупатель — нет.', icon: function (c, g) { g.add(c.box3(0.7, 0.35, 0.4, C.RED, [0, 0.3, 0], FL[4].info)); var q = c.label('?', [0, 0, 0], 0.3, '#a78bfa'); c.root.remove(q); q.position.set(0, 1.0, 0); g.add(q); } }
  ];
  reg('o6-failures3d', {
    title: 'Пять провалов (фиаско) рынка', lead: 'В центре — рынок с трещиной. Вокруг — пять «сфер бессилия», где он сам не справляется. Все они — причины, почему нужно государство.',
    radius: 16, phi: 0.95, theta: 0.3, targetY: 1, height: 450, hint: 'Нажми на провал или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var a = c.mesh(new T.SphereGeometry(0.8, 20, 14, 0, Math.PI), C.BLUE, '<b>Рынок</b> — мощный механизм, но у него есть провалы.'); a.position.y = 1.0;
      var b = c.mesh(new T.SphereGeometry(0.8, 20, 14, Math.PI, Math.PI), C.BLUE, '<b>Рынок</b> — мощный механизм, но у него есть провалы.'); b.position.y = 1.0;
      K.ring(c, FL, 6);
      c.onFrame(function (t) { var s = 0.12 + 0.08 * Math.sin(t * 2); a.position.x = s; b.position.x = -s; a.rotation.y = b.rotation.y = t * 0.3; });
    },
    chips: K.ringChips(FL, ['Монополии', 'Общ. блага', 'Экстерналии', 'Неравенство', 'Асимметрия'])
  });

  /* ======================= 9. Достоинства и недостатки ======================= */
  reg('o6-proscons3d', {
    autorotate: false,
    title: 'Достоинства и недостатки рынка — на весах', lead: 'Слева — 4 достоинства (зелёные гири), справа — 5 недостатков (красные). Нажми на гирю, чтобы узнать, что это. Вывод: рынку нужны «руль и тормоза» — государство.',
    radius: 13, phi: 1.0, theta: 0.0, targetY: 1.8, height: 450, hint: 'Нажми на гирю.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      c.link([0, 0, 0], [0, 3, 0], C.SILVER, 0.1, 'Весы'); var beam = K.group(c, 0, 3, 0);
      beam.add(c.box3(6.4, 0.12, 0.12, C.SILVER, [0, 0, 0], 'Коромысло весов'));
      var P = ['гибкость', 'новые технологии', 'свобода', 'разнообразие'], N = ['неравенство', 'нет общ. благ', 'для богатых', 'тратит невоспр.\nресурсы', 'нет фунд. науки'];
      var pi = ['<b>Гибкость</b> — приспосабливается к меняющимся условиям.', '<b>Использование новых технологий.</b>', '<b>Независимость и свобода</b> производителей и потребителей.', '<b>Удовлетворяет разнообразные потребности</b> в нужном количестве и с высоким качеством.'];
      var ni = ['<b>Воспроизводит неравенство.</b>', '<b>Недопроизводство общественных благ.</b>', '<b>Ориентация прежде всего на тех, у кого есть деньги.</b>', '<b>Не сохраняет невоспроизводимые ресурсы.</b>', '<b>Не обеспечивает фундаментальные научные исследования.</b>'];
      var pans = [-3, 3].map(function (x) { var p = K.group(c, x, 0, 0); c.root.remove(p); beam.add(p); p.add(c.mesh(new T.CylinderGeometry(1.3, 1.1, 0.15, 24), C.SILVER, 'Чаша весов')); return p; });
      P.forEach(function (t, i) { var w = c.mesh(new T.CylinderGeometry(0.28, 0.35, 0.5, 14), C.GREEN, pi[i]); w.position.set(-0.6 + (i % 2) * 1.2, 0.35 + Math.floor(i / 2) * 0.55, 0); pans[0].add(w); });
      N.forEach(function (t, i) { var w = c.mesh(new T.CylinderGeometry(0.28, 0.35, 0.5, 14), C.RED, ni[i]); w.position.set(-0.7 + (i % 3) * 0.7, 0.35 + Math.floor(i / 3) * 0.55, 0); pans[1].add(w); });
      c.label('достоинства', [-3, 5.2, 0], 0.2, '#4cc38a'); c.label('недостатки', [3, 5.2, 0], 0.2, '#e0645a');
      c.onFrame(function (t) { beam.rotation.z = 0.08 * Math.sin(t * 0.8); pans.forEach(function (p, i) { p.position.y = -1.2; p.rotation.z = -beam.rotation.z; }); });
    },
    chips: [{ t: 'Вывод', on: function (c) { c.say('Рынок — отличный двигатель, но без руля и тормозов. Недостатки и провалы рынка исправляет государство — поэтому сегодня везде <b>смешанная экономика</b>.'); } }]
  });
})();
