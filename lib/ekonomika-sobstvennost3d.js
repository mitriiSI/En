/* 3D-модели к конспекту «Экономика. Собственность».
   В Markdown: @@graph:o5-triad3d@@ @@graph:o5-traditions3d@@ @@graph:o5-bundle3d@@ @@graph:o5-specif3d@@
   @@graph:o5-coase3d@@ @@graph:o5-regimes3d@@ @@graph:o5-commons3d@@ @@graph:o5-privat3d@@
   Нужен lib/ekonomika-osnovy-kit.js (window.OsnovyKit). */
(function () {
  'use strict';
  var K = window.OsnovyKit;
  if (!K) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, house = K.house, factory = K.factory;

  function car(c, x, z, col, info, g) {
    var T = c.THREE, p = K.group(c, x, 0, z); if (g) { c.root.remove(p); g.add(p); }
    p.add(c.box3(2.0, 0.55, 1.0, col, [0, 0.55, 0], info)); p.add(c.box3(1.1, 0.45, 0.9, col, [-0.1, 1.05, 0], info));
    p.add(c.box3(1.0, 0.35, 0.92, '#9fd3ff', [-0.1, 1.05, 0], info));
    [[-0.65, 0.5], [-0.65, -0.5], [0.65, 0.5], [0.65, -0.5]].forEach(function (q) { var w = c.mesh(new T.CylinderGeometry(0.25, 0.25, 0.15, 14), C.DARK, info); w.rotation.x = Math.PI / 2; w.position.set(q[0], 0.25, q[1]); p.add(w); });
    return p;
  }

  /* ======================= 1. Владение, пользование, распоряжение ======================= */
  reg('o5-triad3d', {
    autorotate: false,
    title: 'Владение, пользование, распоряжение', lead: 'Машина и три права на неё. Ключи в руке — владение. Поездка — пользование. Табличка «Продаю» — распоряжение, вплоть до смены собственника. Посмотри, чего не хватает арендатору.',
    radius: 13, phi: 1.0, theta: 0.4, targetY: 1.0, height: 440, hint: 'Нажми на право кнопкой.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var road = c.box3(12, 0.04, 2.2, C.DARK, [0, 0.02, 1.2], 'Дорога');
      for (var i = 0; i < 6; i++) c.box3(0.8, 0.05, 0.1, C.WHITE, [-5 + i * 2, 0.03, 1.2], 'Дорога');
      var auto = car(c, 0, 1.2, C.RED, '<b>Машина</b> — объект собственности.');
      var iV = '<b>Владение</b> — физическое обладание вещью. Ключи у тебя, машина в твоём гараже.';
      var owner = person(c, -2.4, -1.4, C.BLUE, '<b>Собственник</b>', null, 1.1);
      var keys = c.mesh(new T.TorusGeometry(0.15, 0.04, 8, 16), C.GOLD, iV, { metalness: 0.6 }); keys.position.set(-2.0, 1.0, -1.2);
      var iS = '<b>Распоряжение</b> — право совершать с вещью любые действия, вплоть до изменения принадлежности: продать, подарить, разобрать.';
      var sign = K.group(c, 3, 0, -1.6); sign.add(c.link([0, 0, 0], [0, 1.4, 0], C.WOOD, 0.05, iS)); sign.add(c.box3(1.4, 0.7, 0.06, C.WHITE, [0, 1.6, 0], iS));
      c.label('ПРОДАЮ', [3, 1.6, -1.5], 0.18, '#e0645a');
      var buyer = person(c, 4.6, -1.0, C.GOLD, '<b>Покупатель</b> — к нему перейдёт собственность.', null, 1.0);
      c.S = { m: 'own', rent: false };
      var renter = person(c, 0, 0, C.GREEN, '<b>Арендатор</b>: владеет и пользуется, но распоряжаться (продать) не может.', null, 0.9); renter.visible = false;
      c.onFrame(function (t) {
        var m = c.S.m;
        keys.rotation.y = t * 2; keys.visible = m === 'own' || m === 'all';
        auto.position.x = m === 'use' || m === 'rent' ? -4 + ((t * 0.25) % 1) * 8 : K.lerp(auto.position.x, 0, 0.05);
        sign.visible = m === 'sell' || m === 'all'; buyer.visible = m === 'sell';
        sign.rotation.y = Math.sin(t) * 0.2;
        renter.visible = m === 'rent'; renter.position.set(auto.position.x, 0.5, 1.2);
      });
    },
    chips: [
      { t: 'Владение', on: function (c) { c.S.m = 'own'; c.say('<b>Владение</b> — физическое обладание вещью.'); } },
      { t: 'Пользование', on: function (c) { c.S.m = 'use'; c.say('<b>Пользование</b> — извлечение полезных свойств вещи: ты на ней ездишь.'); } },
      { t: 'Распоряжение', on: function (c) { c.S.m = 'sell'; c.say('<b>Распоряжение</b> — любые действия, <b>вплоть до изменения принадлежности</b>. Только собственник может продать машину.'); } },
      { t: 'Арендатор', on: function (c) { c.S.m = 'rent'; c.say('<b>[ДОБАВЛЕНО]</b> Арендатор владеет и пользуется (ездит), но <b>распоряжаться не может</b>: табличка «Продаю» исчезла. Распоряжение — главный признак собственника.'); } }
    ]
  });

  /* ======================= 2. Две традиции ======================= */
  reg('o5-traditions3d', {
    autorotate: false,
    title: 'Континентальная и англосаксонская традиции', lead: 'Слева — собственность как цельный блок: один хозяин владеет всем (Кодекс Наполеона). Справа — пучок палочек-прав, которые можно раздать разным людям: арендатору, банку, наследнику.',
    radius: 14, phi: 1.0, theta: 0.1, targetY: 1.3, height: 440, hint: 'Нажми «Разделить пучок».',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iC = '<b>Континентальная традиция</b> (континентальное право, Кодекс Наполеона): собственник <b>один</b>; экономика рассматривается с двух равных сторон — общественной и частной.';
      var block = c.box3(1.8, 1.8, 1.8, C.STONE, [-3.4, 1.2, 0], iC);
      var ped = c.mesh(new T.CylinderGeometry(1.4, 1.5, 0.3, 30), C.SILVER, iC); ped.position.set(-3.4, 0.15, 0);
      var own1 = person(c, -3.4, 1.8, C.BLUE, '<b>Единственный собственник</b>. ' + iC, null, 1.0);
      c.label('континентальная', [-3.4, 3.2, 0], 0.22, '#5b8def');
      var iA = '<b>Англосаксонская традиция</b>: собственность — <b>пучок частичных правомочий</b>. Может укрепляться (спецификация новых прав) или ослабевать.';
      var sticks = [], cols = [C.GOLD, C.GREEN, C.RED, C.PURPLE, C.ORANGE, C.BLUE, C.TEA];
      for (var i = 0; i < 7; i++) { var s = c.link([0, -0.9, 0], [0, 0.9, 0], cols[i], 0.09, iA); sticks.push(s); }
      var band = c.mesh(new T.TorusGeometry(0.35, 0.05, 8, 20), C.WOOD, iA); band.rotation.x = Math.PI / 2; band.position.set(3.4, 1.2, 0);
      var takers = [['арендатор', -1.5], ['банк', 0], ['наследник', 1.5]].map(function (q, i) { var p = person(c, 3.4 + q[1] * 1.2, 2.6, [C.GREEN, C.SILVER, C.PURPLE][i], '<b>' + q[0] + '</b> получил одно из правомочий.', null, 0.85); p.visible = false; c.label(q[0], [3.4 + q[1] * 1.2, 1.9, 2.6], 0.15); return p; });
      c.label('англосаксонская', [3.4, 3.2, 0], 0.22, '#f0c36b');
      c.S = { split: false };
      c.onFrame(function (t) {
        block.rotation.y = t * 0.3;
        sticks.forEach(function (s, i) {
          var a = i * Math.PI * 2 / 7, tgt;
          if (c.S.split && i < 3) tgt = [3.4 + (i - 1) * 1.5 * 1.2, 1.2, 2.0];
          else tgt = [3.4 + Math.cos(a) * 0.22, 1.2, Math.sin(a) * 0.22];
          s.position.x = K.lerp(s.position.x, tgt[0], 0.06); s.position.y = K.lerp(s.position.y, tgt[1], 0.06); s.position.z = K.lerp(s.position.z, tgt[2], 0.06);
        });
        takers.forEach(function (p) { p.visible = c.S.split; });
      });
    },
    chips: [
      { t: 'Континентальная', on: function (c) { c.S.split = false; c.setView(-0.3, 1.0, 9, 1.3, -3.4, 0); c.say('Собственность — <b>цельный кирпич</b>: собственник один, у него вся полнота власти.'); } },
      { t: 'Пучок прав', on: function (c) { c.S.split = false; c.setView(0.3, 1.0, 9, 1.3, 3.4, 0); c.say('Собственность — <b>пучок правомочий</b>. Каждая палочка — отдельное право (пользоваться, получать доход, передавать…).'); } },
      { t: 'Разделить пучок', on: function (c) { c.S.split = true; c.setView(0.3, 1.0, 10, 1.3, 3.4, 1); c.say('Права можно раздать разным людям: пользование — арендатору, право взыскания — банку (залог), право на наследство — наследнику. У собственника остаётся часть пучка.'); } }
    ]
  });

  /* ======================= 3. Пучок Оноре ======================= */
  var HON = ['владение', 'пользование', 'управление', 'доход', 'суверен', 'безопасность', 'наследство', 'бессрочность', 'взыскание', 'остаточный\nхарактер', 'запрет\nвреда'];
  var HONI = [
    'исключительный физический контроль над вещью', 'применение полезных свойств вещи для себя', 'решать, кто и как будет использовать вещь',
    'обладать результатами от использования вещи', 'отчуждать, потреблять, изменять или уничтожать вещь', 'защита от экспроприации и вреда со стороны внешней среды',
    'передать вещь по наследству', 'обладать вещью без ограничения срока', 'вещь можно передать в залог или взыскать в уплату долга (это обязанность!)',
    'право на восстановление нарушенных прав: суды и процедуры', 'нельзя использовать вещь во вред внешней среде (это обязанность!)'
  ];
  reg('o5-bundle3d', {
    title: 'Пучок прав Оноре: 11 элементов', lead: 'Одиннадцать светящихся стержней — одиннадцать элементов права собственности по Оноре. Кнопкой «Короткий перечень» оставь только 5 прав, которыми пользуются экономисты.',
    radius: 15, phi: 0.95, theta: 0.2, targetY: 1.3, height: 460, hint: 'Нажми на стержень — узнаешь, что это за право.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var core = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.4, 20), C.WOOD, '<b>Право собственности</b> — пучок из 11 элементов (Оноре).'); core.position.y = 0.2;
      var rods = [];
      HON.forEach(function (h, i) {
        var a = i * Math.PI * 2 / 11, x = Math.cos(a) * 4.6, z = Math.sin(a) * 4.6;
        var info = '<b>' + (i + 1) + '. Право: ' + h.replace('\n', ' ') + '</b> — ' + HONI[i] + '.';
        var col = i === 8 || i === 10 ? C.RED : i < 3 ? C.GOLD : C.BLUE;
        var r = c.mesh(new T.CylinderGeometry(0.12, 0.12, 2.2, 12), col, info, { emissive: col, emissiveIntensity: 0.3 }); r.position.set(x, 1.3, z);
        c.label((i + 1) + '. ' + h, [x * 1.13, 2.8, z * 1.13], 0.14);
        rods.push([r, x, z, i]);
      });
      c.S = { mode: 'all' };
      var SHORT = [1, 3, 4, 4, 4]; // использование≈пользование, доход, изменение формы≈суверен, передача, отчуждение
      c.onFrame(function (t) {
        rods.forEach(function (q) {
          var i = q[3], keep = c.S.mode === 'all' || (c.S.mode === 'three' && i < 3) || (c.S.mode === 'short' && (i === 1 || i === 3 || i === 4));
          var tx = keep ? q[1] : q[1] * 0.1, tz = keep ? q[2] : q[2] * 0.1;
          q[0].position.x = K.lerp(q[0].position.x, tx, 0.05); q[0].position.z = K.lerp(q[0].position.z, tz, 0.05);
          q[0].scale.y = K.lerp(q[0].scale.y, keep ? 1 : 0.05, 0.06);
          q[0].rotation.y = t;
        });
      });
    },
    chips: [
      { t: 'Все 11', on: function (c) { c.S.mode = 'all'; c.say('<b>Полное определение</b> прав собственности — 11 элементов юриста <b>Оноре</b>. Красные — №9 (взыскание) и №11 (запрет вредного использования) — это скорее <b>обязанности</b> собственника.'); } },
      { t: 'Свести к трём', on: function (c) { c.S.mode = 'three'; c.say('11 элементов можно <b>агрегировать в три</b>: <b>владение, пользование, распоряжение</b>.'); } },
      { t: 'Короткий перечень', on: function (c) { c.S.mode = 'short'; c.say('<b>Экономисты используют короткий перечень (5 прав):</b> использование актива; получение дохода; изменение физической формы и местоположения; передача другим по взаимосогласованной цене; отчуждение. Запоминалка: «Иван Получил Изменённый Подарок Отца».'); } }
    ]
  });

  /* ======================= 4. Спецификация и размывание ======================= */
  reg('o5-specif3d', {
    autorotate: false,
    title: 'Спецификация и размывание прав', lead: 'Два дачных участка. Слева границы чёткие: забор, табличка — права специфицированы, хозяин спокойно строит. Справа границы размыты: соседи спорят, вложений нет.',
    radius: 15, phi: 0.95, theta: 0.15, targetY: 1.0, height: 460, hint: 'Нажимай кнопки.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iS = '<b>Спецификация</b> — точное определение субъекта, объекта, способа наделения собственностью и отдельных правомочий.';
      var iB = '<b>Размывание прав собственности</b> — права неточно определены и плохо защищены.';
      c.box3(4.4, 0.06, 4.4, '#5d8f4a', [-3.2, 0.03, 0], iS); c.box3(4.4, 0.06, 4.4, '#5d8f4a', [3.2, 0.03, 0], iB);
      for (var i = 0; i < 9; i++) { var a = i / 8; c.box3(0.12, 0.8, 0.12, C.WOOD, [-5.4 + a * 4.4, 0.4, -2.2], iS); c.box3(0.12, 0.8, 0.12, C.WOOD, [-5.4 + a * 4.4, 0.4, 2.2], iS); c.box3(0.12, 0.8, 0.12, C.WOOD, [-5.4, 0.4, -2.2 + a * 4.4], iS); c.box3(0.12, 0.8, 0.12, C.WOOD, [-1.0, 0.4, -2.2 + a * 4.4], iS); }
      var h1 = house(c, -3.2, -0.4, C.CREAM, iS + ' Хозяин уверен, что результат достанется ему, поэтому строит дом и сажает сад.', null, 1.1);
      K.tree(c, -4.3, 1.1, iS, null, 0.8); K.tree(c, -2.0, 1.2, iS, null, 0.7);
      var fog = []; for (var f = 0; f < 6; f++) { var m = c.mesh(new T.SphereGeometry(0.8, 14, 10), '#cfd3dd', iB, { transparent: true, opacity: 0.35 }); m.position.set(1.2 + f * 0.8, 0.4, (f % 2 ? 1 : -1) * 2.2); fog.push(m); }
      var n1 = person(c, 2.3, 0, C.RED, '<b>Сосед А</b>: «Это моя земля!» ' + iB, null, 0.9), n2 = person(c, 4.1, 0, C.GOLD, '<b>Сосед Б</b>: «Нет, моя!» ' + iB, null, 0.9);
      var shack = c.box3(0.8, 0.6, 0.8, C.GREY, [3.2, 0.3, -1.4], 'Никто не строит хороший дом: вдруг отнимут?');
      var wall = c.box3(4.6, 2.4, 0.3, C.STONE, [-3.2, 1.2, -2.6], '<b>Слишком дорогая защита</b>: бетонная стена за миллион ради грядки. Выигрыш не окупает издержки.'); wall.visible = false;
      c.S = { wall: wall, fog: fog };
      c.onFrame(function (t) { n1.rotation.z = 0.2 * Math.sin(t * 5); n2.rotation.z = -0.2 * Math.sin(t * 5); fog.forEach(function (m, i) { m.position.y = 0.4 + 0.15 * Math.sin(t + i); }); });
    },
    chips: [
      { t: 'Специфицированы', on: function (c) { c.S.wall.visible = false; c.setView(-0.3, 0.95, 9, 1, -3.2, 0); c.say('Чёткие границы и документы → хозяин уверен, что результат его, и <b>вкладывает</b> в участок.'); } },
      { t: 'Размыты', on: function (c) { c.S.wall.visible = false; c.setView(0.3, 0.95, 9, 1, 3.2, 0); c.say('Границы неясны, права плохо защищены → споры и <b>нет вложений</b>: зачем строить, если отнимут?'); } },
      { t: 'Где остановиться', on: function (c) { c.S.wall.visible = true; c.setView(-0.3, 0.95, 11, 1.2, -3.2, 0); c.say('Спецификация должна идти <b>до того предела, где дальнейший выигрыш от преодоления размытости не окупает связанных с этим издержек</b>. Бетонная стена за миллион вокруг дачи — уже перебор.'); } }
    ]
  });

  /* ======================= 5. Теорема Коуза ======================= */
  reg('o5-coase3d', {
    autorotate: false,
    title: 'Теорема Коуза: фабрика и прачечная', lead: 'Дым фабрики пачкает бельё прачечной: убыток 100 тыс. в год. Фильтр стоит 40 тыс. Кому бы ни отдали право, при низких трансакционных издержках фильтр поставят — меняется только, кто платит.',
    radius: 15, phi: 1.0, theta: 0.2, targetY: 1.4, height: 460, hint: 'Сравни три ситуации кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>Фабрика</b> дымит — это отрицательный внешний эффект.';
      var f = factory(c, -3.2, -0.5, C.STONE, iF, null, 0.9);
      var puffs = K.smoke(c, f, 5);
      var filter = c.mesh(new T.CylinderGeometry(0.32, 0.32, 0.5, 16), C.GREEN, '<b>Фильтр</b> за 40 тыс. ₽ убирает дым.', { emissive: C.GREEN, emissiveIntensity: 0.3 }); filter.position.set(-3.2 + 0.68, 2.75, -0.5 - 0.32); filter.visible = false;
      var iL = '<b>Прачечная</b> сушит бельё. Без фильтра теряет 100 тыс. ₽ в год.';
      var l = K.group(c, 3.2, 0, -0.5); l.add(c.box3(2.2, 1.4, 1.6, C.CREAM, [0, 0.7, 0], iL));
      var rope = c.link([1.8, 1.8, 1.4], [4.6, 1.8, 1.4], C.GREY, 0.02, iL);
      var sheets = []; for (var i = 0; i < 4; i++) sheets.push(c.box3(0.5, 0.7, 0.03, C.WHITE, [2.1 + i * 0.7, 1.4, 1.4], iL));
      var coins = []; for (var k = 0; k < 4; k++) coins.push(coin(c, 0, 0, 0, '<b>Платёж</b> за фильтр.', null, 0.18));
      var wall = c.box3(0.3, 2.6, 4, C.RED, [0, 1.3, 0.3], '<b>Высокие трансакционные издержки</b>: договориться слишком дорого (много сторон, суды, юристы).', { transparent: true, opacity: 0.6 }); wall.visible = false;
      var who = c.label('', [0, 4.2, 0], 0.22, '#f0c36b');
      c.S = { st: 0, filter: filter, wall: wall, sheets: sheets };
      c.onFrame(function (t) {
        var st = c.S.st, fil = st === 1 || st === 2;
        f.userData.on = !fil;
        sheets.forEach(function (s, i) { s.material.color.set(fil ? C.WHITE : '#8b8f99'); s.rotation.y = 0.2 * Math.sin(t * 2 + i); });
        coins.forEach(function (m, i) {
          var q = (t * 0.45 + i / 4) % 1; m.visible = st === 1 || st === 2;
          var from = st === 2 ? [3.2, -0.5] : [-3.2, -0.5], to = [-3.2 + 0.68, -0.82];
          if (st === 1) { from = [-3.2, 1.0]; }
          m.position.set(K.lerp(from[0], to[0], q), 1.4 + Math.sin(q * Math.PI) * 1.4 + (st === 1 ? q * 0.8 : 0), K.lerp(from[1], to[1], q)); m.rotation.x = t * 3;
        });
        c.S.filter.visible = fil; c.S.wall.visible = st === 3;
      });
    },
    chips: [
      { t: 'Без договора', on: function (c) { c.S.st = 0; c.say('Дым идёт, бельё серое: прачечная теряет 100 тыс. ₽. Ресурсы размещены <b>неэффективно</b> — фильтр за 40 тыс. решил бы проблему.'); } },
      { t: 'Право у прачечной', on: function (c) { c.S.st = 1; c.say('Право на чистый воздух — у прачечной. Фабрике выгоднее <b>самой купить фильтр за 40</b>, чем платить 100 компенсации. Фильтр стоит.'); } },
      { t: 'Право у фабрики', on: function (c) { c.S.st = 2; c.say('Право дымить — у фабрики. Тогда <b>прачечная сама заплатит 40</b> на фильтр: это дешевле, чем терять 100. Фильтр всё равно стоит! <b>Теорема Коуза:</b> при чётких правах и низких трансакционных издержках ресурсы размещаются оптимально.'); } },
      { t: 'Высокие ТИ', on: function (c) { c.S.st = 3; c.say('Если <b>трансакционные издержки высоки</b> (договориться невозможно — стена), рынок не справится. Тогда нужно государство: принцип <b>«нарушитель платит»</b> (штраф, налог).'); } }
    ]
  });

  /* ======================= 6. Режимы собственности ======================= */
  var REG = [
    { t: 'частная', col: C.BLUE, info: '<b>Частная:</b> основа рынка; все издержки и выгоды — на собственнике, <b>наибольшая мотивация</b>. Минусы: неравенство; не обеспечивает экономический и социальный оптимум; нуждается в ограничениях государства.', icon: function (c, g) { house(c, 0, 0, C.CREAM, REG[0].info, g, 0.8); } },
    { t: 'государственная', col: C.RED, info: '<b>Государственная:</b> совладельцы — граждане, но они <b>не имеют права</b> продать или передать свою долю и право участия.', icon: function (c, g) { K.flag(c, 0, 0, REG[1].info, g, 1.6); g.add(c.box3(0.8, 0.5, 0.6, C.STONE, [0.5, 0.25, 0], REG[1].info)); } },
    { t: 'групповая', col: C.GOLD, info: '<b>Групповая:</b> поощряет поведение, выгоды от которого достаются одному участнику группы, а издержки ложатся на всех.', icon: function (c, g) { for (var i = 0; i < 3; i++) person(c, -0.35 + i * 0.35, 0, i === 1 ? C.GOLD : C.GREY, REG[2].info, g, 0.55); } },
    { t: 'общая', col: C.TEA, info: '<b>Общая:</b> свободный доступ; «первый пришёл — первый воспользовался» → <b>сверхиспользование</b>. Неустойчива: эволюционирует в частную или государственную.', icon: function (c, g) { K.tree(c, -0.3, 0, REG[3].info, g, 0.6); K.tree(c, 0.3, 0.2, REG[3].info, g, 0.5); } },
    { t: 'коммунальная', col: C.PURPLE, info: '<b>Коммунальная (общинная):</b> исключительными правами обладает группа лиц; оформляется <b>ритуальными взаимодействиями</b> (обычаями общины).', icon: function (c, g) { var f = K.glow(c, C.ORANGE, 0.2, REG[4].info); f.position.y = 0.3; g.add(f); for (var i = 0; i < 4; i++) { var a = i * Math.PI / 2; person(c, Math.cos(a) * 0.6, Math.sin(a) * 0.6, C.PURPLE, REG[4].info, g, 0.45); } } }
  ];
  reg('o5-regimes3d', {
    title: 'Режимы собственности', lead: 'В центре — ресурс. Вокруг — пять режимов: кто имеет к нему доступ и кто отвечает за последствия.',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1, height: 440, hint: 'Нажми на постамент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var res = c.mesh(new T.DodecahedronGeometry(0.7), C.GOLD, '<b>Ресурс</b> — земля, завод, лес. Режим собственности определяет, кто и как им пользуется.', { metalness: 0.4, emissive: C.GOLD, emissiveIntensity: 0.15 }); res.position.y = 1.0;
      K.ring(c, REG, 5.2);
      c.onFrame(function (t) { res.rotation.y = t * 0.5; res.rotation.x = t * 0.3; });
    },
    chips: K.ringChips(REG, ['Частная', 'Государственная', 'Групповая', 'Общая', 'Коммунальная'])
  });

  /* ======================= 7. Трагедия общин ======================= */
  reg('o5-commons3d', {
    autorotate: false,
    title: 'Общая собственность: сверхиспользование пастбища', lead: 'Общее пастбище, доступ свободный. Каждый пастух добавляет коров: выгода — ему, а траву едят все. Трава тает. Потом пастбище делят — и трава восстанавливается.',
    radius: 14, phi: 0.95, theta: 0.3, targetY: 0.6, height: 450, hint: 'Добавляй коров, потом — «Поделить».',
    build: function (c) {
      var T = c.THREE;
      var grass = c.mesh(new T.CylinderGeometry(6, 6, 0.2, 48), '#4f9a4a', '<b>Общее пастбище</b> — общая собственность: свободный доступ, «первый пришёл — первый воспользовался».'); grass.position.y = -0.1;
      var fences = []; for (var i = 0; i < 3; i++) { var a = i * Math.PI * 2 / 3; var fc = c.box3(6, 0.6, 0.08, C.WOOD, [Math.cos(a) * 3, 0.3, Math.sin(a) * 3], 'Забор: пастбище поделили на частные участки.'); fc.rotation.y = -a; fc.visible = false; fences.push(fc); }
      var cows = [];
      for (var k = 0; k < 18; k++) {
        var g = K.group(c, 0, 0, 0), info = 'Корова. Каждый пастух думает: «Ещё одна корова — мне выгода, а траву едим все».';
        g.add(c.box3(0.9, 0.45, 0.4, k % 2 ? C.WHITE : C.WOOD, [0, 0.55, 0], info)); g.add(c.box3(0.3, 0.3, 0.3, C.DARK, [0.55, 0.7, 0], info));
        [[-0.3, 0.12], [-0.3, -0.12], [0.3, 0.12], [0.3, -0.12]].forEach(function (q) { g.add(c.box3(0.08, 0.35, 0.08, C.DARK, [q[0], 0.17, q[1]], info)); });
        g.visible = false; cows.push([g, Math.random() * 6, 1.5 + Math.random() * 3.5]);
      }
      c.S = { n: 3, split: false, grass: grass, fences: fences, h: 1 };
      c.onFrame(function (t) {
        var n = c.S.split ? 6 : c.S.n;
        cows.forEach(function (q, i) { q[0].visible = i < n; var a = q[1] + t * 0.1; q[0].position.set(Math.cos(a) * q[2], 0, Math.sin(a) * q[2]); q[0].rotation.y = -a; });
        var target = c.S.split ? 1 : Math.max(0, 1 - Math.max(0, c.S.n - 4) / 12);
        c.S.h = K.lerp(c.S.h, target, 0.02);
        grass.material.color.set('#4f9a4a').lerp(new T.Color('#8a6a3b'), 1 - c.S.h);
        fences.forEach(function (f) { f.visible = c.S.split; });
      });
    },
    chips: [
      { t: '+3 коровы', on: function (c) { c.S.split = false; c.S.n = Math.min(18, c.S.n + 3); c.say('Коров: <b>' + c.S.n + '</b>. ' + (c.S.n > 6 ? 'Трава вытаптывается и желтеет — <b>сверхиспользование</b>.' : 'Пока травы хватает.')); } },
      { t: 'Сброс', on: function (c) { c.S.split = false; c.S.n = 3; c.say('Мало коров — трава восстанавливается.'); } },
      { t: 'Поделить', on: function (c) { c.S.split = true; c.say('Общая собственность <b>неустойчива</b> и эволюционирует в <b>частную</b> (пастбище поделили — каждый бережёт свой участок) или <b>государственную</b> (ввели правила выпаса). [ДОБАВЛЕНО] Это называют «трагедией общин».'); } }
    ]
  });

  /* ======================= 8. Приватизация ======================= */
  var PR = [
    { t: 'продажа\n(аукцион)', col: C.GOLD, info: '<b>1. Продажа</b> государственных предприятий в частные руки — через <b>аукционы</b> и <b>конкурсные торги</b>.', icon: function (c, g) { var T = c.THREE; var h = c.mesh(new T.CylinderGeometry(0.18, 0.18, 0.5, 12), C.WOOD, PR[0].info); h.rotation.z = Math.PI / 2; h.position.y = 0.8; g.add(h); g.add(c.link([0, 0, 0], [0, 0.75, 0], C.WOOD, 0.05, PR[0].info)); } },
    { t: 'выкуп\nакций', col: C.BLUE, info: '<b>2. Выкуп акций</b> государственных предприятий.', icon: function (c, g) { K.paper(c, 0, 0.4, 0, PR[1].info, g, C.PAPER, 0.7, 0.5); K.coin(c, 0.3, 0.55, 0.2, PR[1].info, g, 0.18); } },
    { t: 'акции\nработникам', col: C.GREEN, info: '<b>3. Продажа акций работникам</b> предприятий. Лектор (тема «Фирма»): личное участие работников в собственности даёт наибольшую мотивацию.', icon: function (c, g) { person(c, 0, 0, C.GREEN, PR[2].info, g, 0.75); } },
    { t: 'акции\nнаселению', col: C.PURPLE, info: '<b>4. Распространение акций среди населения.</b> [ДОБАВЛЕНО] Пример — российская ваучерная приватизация 1992–1994 годов.', icon: function (c, g) { for (var i = 0; i < 3; i++) person(c, -0.4 + i * 0.4, 0, C.PURPLE, PR[3].info, g, 0.5); } },
    { t: 'аренда', col: C.ORANGE, info: '<b>5. Сдача</b> государственных предприятий <b>в аренду</b>.', icon: function (c, g) { var k = c.mesh(new c.THREE.TorusGeometry(0.2, 0.06, 8, 16), C.GOLD, PR[4].info, { metalness: 0.5 }); k.position.y = 0.8; g.add(k); g.add(c.box3(0.08, 0.5, 0.08, C.GOLD, [0, 0.35, 0], PR[4].info)); } }
  ];
  reg('o5-privat3d', {
    title: 'Разгосударствление и пять видов приватизации', lead: 'В центре — государственный завод с флагом. Пять дорог ведут из госсобственности в частную. Приватизация — форма разгосударствления.',
    radius: 16, phi: 0.95, theta: 0.3, targetY: 1, height: 450, hint: 'Нажми на вид приватизации.',
    build: function (c) {
      c.ground(9);
      var iG = '<b>Государственное предприятие.</b> Разгосударствление — переход госсобственности в другие формы; приватизация — передача её отдельным физическим или юридическим лицам.';
      var f = factory(c, 0, 0, C.STONE, iG, null, 0.8); K.smoke(c, f, 2);
      var fl = K.flag(c, -0.8, 0.5, iG, null, 2.6);
      var pos = K.ring(c, PR, 6);
      var cubes = PR.map(function (p) { return c.box3(0.3, 0.3, 0.3, p.col, [0, 0, 0], p.info); });
      c.onFrame(function (t) { cubes.forEach(function (m, i) { var q = (t * 0.3 + i / 5) % 1; m.position.set(K.lerp(0, pos[i][0], q), 0.6 + Math.sin(q * Math.PI) * 1.4, K.lerp(0, pos[i][1], q)); m.rotation.y = t * 2; }); fl.rotation.y = Math.sin(t) * 0.2; });
    },
    chips: K.ringChips(PR, ['Аукцион', 'Выкуп акций', 'Работникам', 'Населению', 'Аренда'])
  });
})();
