/* 3D-модели и мини-тест к конспекту «Эпоха Возрождения и Реформации» (История полит. учений, 27.10).
   В Markdown: @@graph:ren-timeline3d@@ @@graph:ren-press3d@@ @@graph:ren-sawmill3d@@ @@graph:ren-army3d@@
   @@graph:ren-globe3d@@ @@graph:ren-ladder3d@@ @@graph:ren-theses3d@@ @@graph:ren-cosmos3d@@
   @@graph:ren-prince3d@@ @@graph:ren-teutoburg3d@@ @@graph:ren-utopia3d@@ @@graph:ren-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) { HubWidgets.register(name, function (box) { HubScene3d(box, opts); }); }
  function group(c) { var g = new c.THREE.Group(); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  function figure(c, x, z, col, info, h, g) {
    var T = c.THREE; h = h || 1;
    var b = c.mesh(new T.CylinderGeometry(0.28 * h, 0.38 * h, 1.1 * h, 12), col, info); b.position.set(x, 0.55 * h, z);
    var hd = c.mesh(new T.SphereGeometry(0.27 * h, 14, 10), '#e8c6a0', info); hd.position.set(x, 1.35 * h, z);
    if (g) { g.add(b); g.add(hd); }
    return [b, hd];
  }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function fade(g, on) { g.traverse(function (x) { if (x.material && !x.isSprite) { x.material.transparent = true; x.material.opacity = on ? 0.15 : 1; x.material.depthWrite = !on; x.material.needsUpdate = true; } if (x.isSprite) x.material.opacity = on ? 0.3 : 1; }); }

  /* ---------- 1. Лента времени мыслителей ---------- */
  reg('ren-timeline3d', {
    title: 'Лента времени: кто когда жил', lead: 'Каждый брусок — годы жизни. Цвет — направление. Вертикальные столбы — главные события эпохи.',
    radius: 19, phi: 0.9, theta: 0.25, targetY: 0.8, height: 400,
    hint: 'Нажми на брусок или выбери направление.',
    build: function (c) {
      var T = c.THREE;
      function X(y) { return (y - 1450) / 24; }
      c.box3(17, 0.2, 9.5, '--panel2', [0, -0.1, 0], 'Шкала 1260–1640 годов.');
      for (var y = 1300; y <= 1600; y += 50) { var tk = c.box3(0.06, 0.05, 9.4, '--line', [X(y), 0.03, 0]); c.label(String(y), [X(y), 0.4, 4.9], 0.55, '#9aa2c0'); }
      var G = { hum: { col: '#f0c36b', z: -3, name: 'Гуманисты' }, nat: { col: '#6fa0ff', z: -1, name: 'Натурфилософы' }, ref: { col: '#ef6b5b', z: 1, name: 'Реформация' }, pol: { col: '#4cc38a', z: 3, name: 'О государстве' } };
      var P = [
        ['hum', 'Данте', 1265, 1321, '<b>Данте Алигьери</b> (1265–1321). Человек творит свою судьбу; «последний поэт Средневековья и первый поэт Нового времени».'],
        ['hum', 'Петрарка', 1304, 1374, '<b>Франческо Петрарка</b> (1304–1374). Критикует схоластику и ссылки на авторитеты.'],
        ['hum', 'Пико', 1463, 1494, '<b>Пико делла Мирандола</b> (1463–1494). «Речь о достоинстве человека»: человек сам выбирает своё место.'],
        ['hum', 'Эразм', 1466, 1536, '<b>Эразм Роттердамский</b> (1466–1536). «Похвала глупости» (1509): ничего не принимать на веру.'],
        ['hum', 'Монтень', 1533, 1592, '<b>Мишель де Монтень</b> (1533–1592). «Опыты»: опыт лучше авторитета; писал по-французски.'],
        ['nat', 'Кузанский', 1401, 1464, '<b>Николай Кузанский</b> (1401–1464). Бог связан с природой; Вселенная бесконечна.'],
        ['nat', 'Коперник', 1473, 1543, '<b>Николай Коперник</b> (1473–1543). Гелиоцентризм: в центре Солнце.'],
        ['nat', 'Бруно', 1548, 1600, '<b>Джордано Бруно</b> (1548–1600). Бесконечность миров, Бог во всём. Сожжён в 1600 г.'],
        ['ref', 'Лютер', 1483, 1546, '<b>Мартин Лютер</b> (1483–1546). 95 тезисов (1517), Библия на немецком.'],
        ['pol', 'Макиавелли', 1469, 1527, '<b>Никколо Макиавелли</b> (1469–1527). «Государь» (1513): политика — самостоятельная сфера.'],
        ['pol', 'Т. Мор', 1478, 1535, '<b>Томас Мор</b> (1478–1535). «Утопия» (1516). Казнён за отказ признать Акт о супрематии.'],
        ['pol', 'Кампанелла', 1568, 1639, '<b>Томмазо Кампанелла</b> (1568–1639). «Город Солнца» (1602): закрытое идеальное государство.']
      ];
      var groups = {}, lanes = {};
      Object.keys(G).forEach(function (k) { groups[k] = group(c); lanes[k] = []; c.label(G[k].name, [X(1262), 0.5, G[k].z], 0.55, G[k].col); });
      P.forEach(function (p) {
        var lv = 0, L = lanes[p[0]];
        while (L.some(function (q) { return q[0] === lv && !(p[2] > q[2] + 6 || p[3] < q[1] - 6); })) lv++;
        L.push([lv, p[2], p[3]]);
        var w = (p[3] - p[2]) / 24, h = 0.55, yy = 0.35 + lv * 1.2;
        var m = into(groups[p[0]], c.box3(w, h, 0.9, G[p[0]].col, [X((p[2] + p[3]) / 2), yy, G[p[0]].z + (lv % 2 ? 0.0 : 0)], p[4]));
        into(groups[p[0]], c.label(p[1], [X((p[2] + p[3]) / 2), yy + 0.75, G[p[0]].z], 0.55));
      });
      var E = [[1450, 'Печатный станок', '<b>~1450</b> — Гутенберг: книгопечатание ускорило распространение текстов примерно в 1000 раз.'],
        [1492, 'Колумб', '<b>1492</b> — Колумб достигает Америки. Великие географические открытия.'],
        [1517, '95 тезисов', '<b>1517</b> — Лютер прибивает 95 тезисов к двери церкви в Виттенберге. Начало Реформации.'],
        [1605, 'Газета', '<b>1605</b> — первая газета в Европе. Тиражи — несколько сотен экземпляров.']];
      E.forEach(function (e, i) {
        var col = c.mesh(new T.CylinderGeometry(0.07, 0.07, 6.5, 8), '#c8ccd8', e[2], { transparent: true, opacity: 0.7 }); col.position.set(X(e[0]), 3.25, -4.6 + (i % 2) * 0.2);
        var top = c.mesh(new T.OctahedronGeometry(0.28), '#ffffff', e[2], { emissive: 0x333333 }); top.position.set(X(e[0]), 6.6, -4.6 + (i % 2) * 0.2);
        c.label(e[1], [X(e[0]), 7.3, -4.6], 0.55, '#eef0f8');
        c.onFrame(function (t) { top.rotation.y = t + i; });
      });
      c.groups = groups;
    },
    chips: [
      { t: 'Все', on: function (c) { Object.keys(c.groups).forEach(function (k) { fade(c.groups[k], false); }); c.setView(0.25, 0.9, 19, 0.8); c.say('Вся эпоха: от Данте (XIII–XIV вв.) до Кампанеллы (XVII в.).'); } },
      { t: 'Гуманисты', on: function (c) { Object.keys(c.groups).forEach(function (k) { fade(c.groups[k], k !== 'hum'); }); c.setView(-0.2, 0.85, 15, 1, -1, -2); c.say('<b>Гуманисты</b>: человек в центре мира, критика схоластики и авторитетов.'); } },
      { t: 'Природа', on: function (c) { Object.keys(c.groups).forEach(function (k) { fade(c.groups[k], k !== 'nat'); }); c.setView(0, 0.85, 15, 1, 1, -1); c.say('<b>Натурфилософы</b>: Вселенная бесконечна, природа подчиняется законам.'); } },
      { t: 'Государство', on: function (c) { Object.keys(c.groups).forEach(function (k) { fade(c.groups[k], k !== 'pol' && k !== 'ref'); }); c.setView(0.5, 0.85, 15, 1, 1.5, 2); c.say('<b>Реформация и учения о государстве</b>: Лютер, Макиавелли, Мор, Кампанелла.'); } }
    ]
  });

  /* ---------- 2. Печатный станок vs переписчик ---------- */
  reg('ren-press3d', {
    title: 'Печатный станок против переписчика', lead: 'Слева монах переписывает книгу от руки, справа станок Гутенберга. Сравни, сколько страниц выходит за день.',
    radius: 17, phi: 1.05, theta: 0.3, targetY: 1.8,
    hint: 'Нажми «Работать» и следи за стопками страниц.',
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      /* переписчик */
      var desk = c.box3(1.8, 0.12, 1.1, '#8a5a35', [-4, 1.2, 0], '<b>Переписчик</b>: книгу копируют от руки. <b>[ДОБАВЛЕНО]</b> Несколько страниц в день, одна книга — месяцы работы.');
      c.box3(0.12, 1.2, 0.12, '#6b4426', [-4.7, 0.6, 0.4]); c.box3(0.12, 1.2, 0.12, '#6b4426', [-3.3, 0.6, 0.4]); c.box3(0.12, 1.2, 0.12, '#6b4426', [-4.7, 0.6, -0.4]); c.box3(0.12, 1.2, 0.12, '#6b4426', [-3.3, 0.6, -0.4]);
      figure(c, -4, 1.3, '#5a4a7a', desk.userData.info, 1.1);
      var quill = c.mesh(new T.ConeGeometry(0.05, 0.6, 6), '#ffffff', desk.userData.info); quill.position.set(-3.8, 1.55, 0.2); quill.rotation.z = -0.5;
      c.label('Переписчик', [-4, 3.2, 0], 0.5);
      /* станок */
      var info = '<b>Печатный станок</b>: винт прижимает лист к набору из металлических литер. По словам лектора, крупные типографии выпускали <b>до 3600 страниц в день</b>.';
      c.box3(0.35, 4.2, 0.35, '#7a5230', [2.2, 2.1, -0.9], info); c.box3(0.35, 4.2, 0.35, '#7a5230', [2.2, 2.1, 0.9], info);
      c.box3(0.35, 4.2, 0.35, '#7a5230', [5.2, 2.1, -0.9], info); c.box3(0.35, 4.2, 0.35, '#7a5230', [5.2, 2.1, 0.9], info);
      c.box3(3.4, 0.4, 2.2, '#6b4426', [3.7, 4.2, 0], info);
      var bed = c.box3(3.2, 0.3, 2, '#5c3b22', [3.7, 1.1, 0], '<b>Талер</b> — плита, на которой лежит набор.');
      var type = c.box3(1.6, 0.12, 1.2, '#9aa2b8', [3.7, 1.32, 0], '<b>Набор из литер</b>: каждая буква — отдельный металлический брусочек. Набор можно разобрать и собрать новую страницу.', { metalness: 0.8, roughness: 0.3 });
      var screw = c.mesh(new T.CylinderGeometry(0.15, 0.15, 1.8, 12), '#c8ccd8', '<b>Винт</b> — как в прессе для винограда.', { metalness: 0.8 }); screw.position.set(3.7, 3.2, 0);
      var lever = c.mesh(new T.CylinderGeometry(0.06, 0.06, 2.2, 8), '#6b4426', 'Рычаг: печатник тянет его, винт опускает плиту.'); lever.rotation.z = Math.PI / 2; lever.position.set(3.7, 3.0, 0);
      var platen = c.box3(1.8, 0.2, 1.4, '#7a5230', [3.7, 2.2, 0], '<b>Пресс (пиан)</b> прижимает бумагу к набору.');
      figure(c, 5.9, 1.3, '#4f7be0', info, 1.1);
      c.label('Станок Гутенберга', [3.7, 5, 0], 0.5, '#f0c36b');
      var pileA = c.box3(0.8, 0.01, 0.6, '#f3efe6', [-4.2, 1.27, -0.2], 'Стопка переписанных страниц.');
      var pileB = c.box3(0.9, 0.01, 0.7, '#f3efe6', [6.6, 0.01, -1.6], 'Стопка напечатанных страниц.');
      c.state = { run: false, tA: 0, nA: 0, nB: 0, last: 0 };
      c.onFrame(function (t) {
        var s = c.state, dt = Math.min(0.05, t - (s.last || t)); s.last = t;
        if (!s.run) return;
        s.tA += dt;
        quill.position.x = -3.8 + Math.sin(t * 9) * 0.15;
        var p = (Math.sin(t * 6) + 1) / 2; platen.position.y = 1.55 + p * 0.65; screw.position.y = 2.6 + p * 0.65;
        lever.position.set(3.7, 3.0 + p * 0.6, 0); lever.rotation.y = p * 1.2;
        s.nA = Math.min(3, s.tA * 0.08); s.nB = Math.min(3600, s.tA * 160);
        pileA.scale.y = 1 + s.nA * 6; pileA.position.y = 1.27 + s.nA * 0.03;
        pileB.scale.y = 1 + s.nB / 12; pileB.position.y = s.nB / 2400;
        if (Math.floor(t * 4) !== Math.floor((t - dt) * 4)) c.say('За день: переписчик — <b>' + s.nA.toFixed(1) + '</b> стр., станок — <b>' + Math.round(s.nB) + '</b> стр. Разница — в сотни и тысячи раз.');
      });
    },
    chips: [
      { t: 'Работать', small: 'запустить день', on: function (c) { c.state.run = true; c.state.tA = 0; c.setView(0.3, 1.05, 17, 1.8); } },
      { t: 'Литеры', small: 'секрет станка', on: function (c) { c.state.run = false; c.setView(0.1, 0.55, 8, 1.3, 3.7); c.say('Секрет — <b>подвижные литеры</b>. Буквы отливают из металла заранее, страницу собирают как конструктор и печатают сколько угодно копий.'); } },
      { t: 'А читатель?', small: 'грамотность', on: function (c) { c.state.run = false; c.setView(-0.6, 1, 15, 1.8); c.say('В начале XVII века в Священной Римской империи читал только <b>каждый четвёртый</b>. Книгам нужен грамотный читатель — отсюда запрос на школы.'); } }
    ]
  });

  /* ---------- 3. Ветряная лесопилка ---------- */
  reg('ren-sawmill3d', {
    title: 'Ветряная лесопилка и флот Нидерландов', lead: 'Ветер крутит крылья, кривошип превращает вращение в движение пилы вверх-вниз. Доски идут на корабли.',
    radius: 19, phi: 1.0, theta: 0.5, targetY: 2.5, height: 380,
    build: function (c) {
      var T = c.THREE;
      c.ground(9, '#7fb26a');
      var tw = c.mesh(new T.CylinderGeometry(1.1, 1.6, 4.5, 8), '#b9865a', '<b>Башня мельницы.</b> Внутри — вал и кривошипно-шатунный механизм.'); tw.position.set(-2, 2.25, 0);
      var cap = c.mesh(new T.ConeGeometry(1.3, 1.2, 8), '#6b4426', tw.userData.info); cap.position.set(-2, 5.1, 0);
      var hub = c.mesh(new T.SphereGeometry(0.3, 12, 10), '#333', 'Ось крыльев.'); hub.position.set(-2, 4.6, 1.3);
      var wings = new T.Group(); wings.position.set(-2, 4.6, 1.45); c.root.add(wings);
      for (var i = 0; i < 4; i++) { var wg = c.mesh(new T.BoxGeometry(0.5, 3.2, 0.05), '#f3efe6', '<b>Крылья</b> ловят ветер — бесплатную энергию.'); wg.position.set(0, 1.7, 0); var arm = new T.Group(); arm.rotation.z = i * Math.PI / 2; arm.add(wg); wings.add(arm); }
      var crank = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.15, 16), '#c8ccd8', '<b>Кривошип</b>: вращение превращается в возвратно-поступательное движение.', { metalness: 0.7 }); crank.rotation.x = Math.PI / 2; crank.position.set(1.2, 1.2, 0.8);
      var rod = c.mesh(new T.CylinderGeometry(0.06, 0.06, 1.6, 8), '#c8ccd8', '<b>Шатун</b> тянет раму с пилой.', { metalness: 0.7 });
      var frame = c.box3(1.6, 0.12, 0.12, '#6b4426', [2.2, 2.2, 0.3], 'Рама пилы.');
      var saw = c.mesh(new T.BoxGeometry(0.05, 1.6, 0.4), '#d8dce8', '<b>Пила</b> ходит вверх-вниз без людей.', { metalness: 0.9, roughness: 0.2 });
      var log = c.mesh(new T.CylinderGeometry(0.45, 0.45, 4, 14), '#a0703f', '<b>Бревно</b> медленно подаётся под пилу.'); log.rotation.z = Math.PI / 2; log.position.set(2.2, 1.0, 0.3);
      c.box3(5, 0.5, 1.4, '#6b4426', [2.6, 0.25, 0.3], 'Станина лесопилки.');
      var boards = []; for (var b = 0; b < 12; b++) { var bd = c.box3(2.4, 0.08, 0.5, '#d9b07a', [6.2, 0.1 + b * 0.1, -1.5], 'Доски: их выпуск вырос в тысячи раз.'); bd.visible = false; boards.push(bd); }
      /* корабль */
      var ship = new T.Group(); ship.position.set(1, 0.1, -5.5); c.root.add(ship);
      var hull = c.mesh(new T.BoxGeometry(3.5, 0.8, 1.1), '#6b4426', '<b>Флот Соединённых провинций</b>: дешёвые доски позволили построить флот, сравнимый с английским.'); hull.position.y = 0.4; ship.add(hull);
      var mast = c.mesh(new T.CylinderGeometry(0.06, 0.06, 2.6, 8), '#6b4426', hull.userData.info); mast.position.y = 2; ship.add(mast);
      var sail = c.mesh(new T.BoxGeometry(0.05, 1.5, 1.6), '#f3efe6', hull.userData.info); sail.position.set(0.05, 2.1, 0); sail.rotation.y = Math.PI / 2; ship.add(sail);
      ship.scale.set(0.01, 0.01, 0.01);
      var men = [figure(c, 4.6, 2.2, '#bf5b4a', '<b>Ручная пила</b>: два пильщика за день распиливают лишь несколько брёвен.', 0.9), figure(c, 4.6, 3.2, '#bf5b4a', '<b>Ручная пила</b>: два пильщика за день распиливают лишь несколько брёвен.', 0.9)];
      c.state = { wind: 1, k: 0, ships: 0, mode: 1, last: 0 };
      c.onFrame(function (t) {
        var s = c.state, dt = Math.min(0.05, t - (s.last || t)); s.last = t;
        var sp = s.mode === 0 ? 0 : s.wind; s.k += dt * sp * 2.2;
        wings.rotation.z = -s.k; crank.rotation.y = s.k * 2;
        var a = s.k * 2, px = 1.2 + Math.cos(a) * 0.4, py = 1.2 + Math.sin(a) * 0.4;
        var sy = 2.2 + Math.sin(a) * 0.4; frame.position.y = sy; saw.position.set(2.2, sy - 0.8, 0.3);
        rod.position.set((px + 2.2) / 2 - 0.4, (py + sy) / 2, 0.8); rod.rotation.z = Math.atan2(2.2 - 0.4 - px, sy - py) * -1;
        var cut = (s.k * 0.05) % 1; log.position.x = 4 - cut * 3.6;
        var nb = s.mode === 0 ? 1 : Math.min(12, Math.floor(s.k * 0.6) % 13); boards.forEach(function (bd, i) { bd.visible = i < nb; });
        men.forEach(function (m, i) { m.forEach(function (p) { p.visible = s.mode === 0; }); });
        var target = s.mode === 2 ? 1.3 : 0.01; var sc = ship.scale.x + (target - ship.scale.x) * 0.05; ship.scale.set(sc, sc, sc); ship.position.y = 0.1 + Math.sin(t * 1.5) * 0.08;
      });
    },
    chips: [
      { t: 'Ручная пила', small: 'до машин', on: function (c) { c.state.mode = 0; c.setView(0.9, 1.0, 15, 1.5, 3); c.say('Пилят вручную: медленно, тяжело, досок мало. Дерево и железо дороги.'); } },
      { t: 'Ветер', small: 'лесопилка', on: function (c) { c.state.mode = 1; c.state.wind = 1.4; c.setView(0.5, 1.0, 19, 2.5); c.say('<b>Ветряная лесопилка</b>: энергия ветра поднимает и опускает пилы. По словам лектора, производство досок выросло в <b>тысячи</b> раз. <b>[ДОБАВЛЕНО]</b> Изобретатель — Корнелис Корнелисзон, патент 1594 г.'); } },
      { t: 'Флот', small: 'итог', on: function (c) { c.state.mode = 2; c.state.wind = 1.4; c.setView(-0.2, 0.95, 21, 1.5, 0, -2); c.say('Дешёвые доски → корабли → морская держава. Маленькие Нидерланды построили флот, сравнимый с английским. <b>Техника меняет политику.</b>'); } }
    ]
  });

  /* ---------- 4. Рыцарь против мушкетёров ---------- */
  reg('ren-army3d', {
    title: 'Почему мушкет изменил войну', lead: 'Слева рыцарь, которого учили 20 лет. Справа крестьяне с мушкетами: их обучают за несколько недель и набирают каждый месяц.',
    radius: 20, phi: 1.0, theta: 0.2, targetY: 1.3,
    build: function (c) {
      var T = c.THREE;
      c.box3(18, 0.2, 9, '#6d8f55', [0, -0.1, 0], 'Поле боя.');
      var kInfo = '<b>Рыцарь</b>: учился владеть оружием с детства, около <b>20 лет</b>. Новое поколение рыцарей — раз в 20 лет. Дорого и долго.';
      var horse = c.box3(2.2, 1, 0.8, '#6b4a2a', [-5.5, 1.1, 0], kInfo);
      [[-6.3, 0.3], [-6.3, -0.3], [-4.7, 0.3], [-4.7, -0.3]].forEach(function (p) { c.box3(0.2, 0.8, 0.2, '#5a3d22', [p[0], 0.4, p[1]], kInfo); });
      c.box3(0.6, 0.7, 0.5, '#6b4a2a', [-4.2, 1.8, 0], kInfo);
      var kn = c.mesh(new T.CylinderGeometry(0.3, 0.38, 1, 12), '#c8ccd8', kInfo, { metalness: 0.8, roughness: 0.3 }); kn.position.set(-5.5, 2.1, 0);
      var helm = c.mesh(new T.SphereGeometry(0.3, 14, 10), '#c8ccd8', kInfo, { metalness: 0.8, roughness: 0.3 }); helm.position.set(-5.5, 2.85, 0);
      var lance = c.mesh(new T.CylinderGeometry(0.05, 0.05, 4, 8), '#d9b07a', kInfo); lance.rotation.z = Math.PI / 2 - 0.15; lance.position.set(-3.8, 2.3, 0.4);
      c.label('Рыцарь · 20 лет учёбы', [-5.5, 4, 0], 0.5, '#f0c36b');
      var mInfo = '<b>Стрелок с мушкетом</b>: крестьянина обучают за <b>несколько недель</b>. Набирать можно каждый месяц — армия становится массовой.';
      var sq = [];
      for (var i = 0; i < 48; i++) {
        var x = 1 + (i % 8) * 0.85, z = -2.6 + Math.floor(i / 8) * 1;
        var f = figure(c, x, z, '#4f7be0', mInfo, 0.6);
        var gun = c.mesh(new T.CylinderGeometry(0.03, 0.03, 0.9, 6), '#333', mInfo); gun.rotation.z = Math.PI / 2.4; gun.position.set(x - 0.2, 0.75, z + 0.2);
        f.push(gun); f.forEach(function (p) { p.visible = false; }); sq.push(f);
      }
      c.label('Мушкетёры · несколько недель', [4, 3, -3.2], 0.5, '#7aa2ff');
      var smoke = []; for (var s = 0; s < 8; s++) { var sm = c.mesh(new T.SphereGeometry(0.3, 10, 8), '#e8e8f0', 'Пороховой дым.', { transparent: true, opacity: 0.5 }); sm.visible = false; smoke.push(sm); }
      c.state = { mode: 0, t0: 0, last: 0, shown: 1 };
      c.onFrame(function (t) {
        var st = c.state; if (!st.t0) st.t0 = t; var el = t - st.t0;
        var n = st.mode === 0 ? 0 : st.mode === 1 ? Math.min(48, Math.floor(el * 4) + 1) : 48;
        sq.forEach(function (f, i) { f.forEach(function (p) { p.visible = i < n; }); });
        if (st.mode === 1 && n !== st.shown) { st.shown = n; c.say('Набрано стрелков: <b>' + n + '</b>. Каждые несколько недель — новый отряд. Рыцарей за это время: <b>0</b> новых.'); }
        smoke.forEach(function (sm, i) { sm.visible = st.mode === 2; if (st.mode === 2) { var k = ((el * 0.6) + i / 8) % 1; sm.position.set(1 + (i % 8) * 0.85 - 1 - k * 2, 0.9 + k * 1.2, 2.6 - (i % 3)); sm.scale.setScalar(0.5 + k * 1.5); sm.material.opacity = 0.6 * (1 - k); } });
        if (st.mode === 2) { kn.rotation.z = Math.min(1.2, el * 0.6); kn.position.y = 2.1 - Math.min(1, el * 0.5) * 0.4; }
        else { kn.rotation.z = 0; kn.position.y = 2.1; }
      });
    },
    chips: [
      { t: 'Рыцарь', small: '20 лет', on: function (c) { c.state.mode = 0; c.state.t0 = 0; c.setView(-0.4, 1.0, 13, 1.8, -5); c.say('Профессиональный воин: дорогой, редкий, учится всю жизнь.'); } },
      { t: 'Набор', small: 'каждый месяц', on: function (c) { c.state.mode = 1; c.state.t0 = 0; c.state.shown = 0; c.setView(0.5, 0.95, 16, 1, 3.5); } },
      { t: 'Залп', small: 'итог', on: function (c) { c.state.mode = 2; c.state.t0 = 0; c.setView(0.15, 1.0, 20, 1.3); c.say('Массовая армия стрелков сильнее горстки рыцарей. Войны становятся затяжными и массовыми, в XVII веке появляются <b>регулярные армии</b>. Пример из России — пищали против Девлет-Гирея (<b>[ДОБАВЛЕНО]</b> Молоди, 1572).'); } }
    ]
  });

  /* ---------- 5. Глобус открытий ---------- */
  reg('ren-globe3d', {
    title: 'Великие географические открытия', lead: 'Компас позволил уходить в открытое море на недели. Выбери экспедицию — корабль пройдёт её маршрут.',
    radius: 15, phi: 1.2, theta: -0.4, targetY: 0, autorotate: false, height: 380,
    hint: 'Выбери экспедицию. Глобус можно крутить.',
    build: function (c) {
      var T = c.THREE, R = 4;
      function V(lat, lon, r) { var a = lat * Math.PI / 180, b = lon * Math.PI / 180; r = r || R; return new T.Vector3(r * Math.cos(a) * Math.cos(b), r * Math.sin(a), -r * Math.cos(a) * Math.sin(b)); }
      var earth = new T.Group(); c.root.add(earth);
      into(earth, c.mesh(new T.SphereGeometry(R, 48, 32), '#2f6db0', 'Мировой океан. До компаса моряки держались берега.', { roughness: 0.5 }));
      [[52, 15, 1.6, 'Европа'], [8, 20, 2.6, 'Африка'], [48, -100, 2.4, 'Северная Америка'], [-15, -60, 2.2, 'Южная Америка'], [50, 90, 3, 'Азия'], [22, 78, 1.2, 'Индия'], [-25, 134, 1.4, 'Австралия']].forEach(function (k) {
        var m = into(earth, c.mesh(new T.SphereGeometry(1, 16, 12), '#7fb26a', k[3] + '.')); m.position.copy(V(k[0], k[1], R - 0.15 * k[2])); m.scale.set(k[2] * 0.55, k[2] * 0.55, k[2] * 0.55); m.lookAt(0, 0, 0); m.scale.z *= 0.35;
      });
      var routes = {
        dias: { col: '#f0c36b', p: [[38.7, -9], [20, -20], [0, -12], [-20, 8], [-34.6, 18.5], [-33.5, 26]], i: '<b>[ДОБАВЛЕНО] Бартоломеу Диаш, 1488</b>: огибает мыс Доброй Надежды — юг Африки.' },
        col: { col: '#ef6b5b', p: [[37.2, -6.9], [28, -16], [27, -40], [25, -60], [24, -75]], i: '<b>[ДОБАВЛЕНО] Христофор Колумб, 1492</b>: через Атлантику к Багамским островам. Он думал, что доплыл до Индии.' },
        gama: { col: '#4cc38a', p: [[38.7, -9], [15, -25], [-15, -25], [-34.6, 18.5], [-26, 38], [-4, 41], [11.2, 75.8]], i: '<b>[ДОБАВЛЕНО] Васко да Гама, 1498</b>: вокруг Африки в Индию (Каликут). Морской путь за пряностями.' },
        mag: { col: '#b07cff', p: [[37.4, -6], [5, -28], [-23, -42], [-52.5, -69], [-30, -95], [-5, -140], [13.4, 144.8], [10.3, 124], [-8, 108], [-34.6, 18.5], [10, -20], [37.4, -6]], i: '<b>[ДОБАВЛЕНО] Экспедиция Магеллана, 1519–1522</b>: первое кругосветное плавание. Доказано на практике, что Земля — шар.' }
      };
      var curves = {};
      Object.keys(routes).forEach(function (k) {
        var r = routes[k], pts = [];
        for (var i = 0; i < r.p.length - 1; i++) for (var s = 0; s < 12; s++) { var a = V(r.p[i][0], r.p[i][1]), b = V(r.p[i + 1][0], r.p[i + 1][1]); pts.push(a.clone().lerp(b, s / 12).normalize().multiplyScalar(R + 0.12)); }
        pts.push(V(r.p[r.p.length - 1][0], r.p[r.p.length - 1][1], R + 0.12));
        var cv = new T.CatmullRomCurve3(pts); curves[k] = cv;
        var tube = into(earth, c.mesh(new T.TubeGeometry(cv, 200, 0.05, 6), r.col, r.i)); tube.visible = false; r.tube = tube;
      });
      var ship = into(earth, c.mesh(new T.ConeGeometry(0.15, 0.45, 8), '#ffffff', 'Каравелла.')); ship.visible = false;
      /* компас */
      var cb = c.mesh(new T.CylinderGeometry(1, 1, 0.3, 32), '#8a5a35', '<b>Морской компас</b>: стрелка всегда указывает на север. Можно неделями идти в открытом море, а не держаться берега.'); cb.position.set(6.5, -2.5, 2);
      var face = c.mesh(new T.CylinderGeometry(0.85, 0.85, 0.05, 32), '#f3efe6', cb.userData.info); face.position.set(6.5, -2.33, 2);
      var needle = c.mesh(new T.BoxGeometry(1.4, 0.06, 0.12), '#ef6b5b', cb.userData.info); needle.position.set(6.5, -2.27, 2);
      c.label('Компас', [6.5, -1.4, 2], 0.45);
      c.state = { k: null, t0: 0 };
      c.onFrame(function (t) {
        needle.rotation.y = Math.sin(t * 0.8) * 0.25;
        var st = c.state; if (!st.k) { earth.rotation.y = t * 0.08; return; }
        if (!st.t0) st.t0 = t; var u = ((t - st.t0) * 0.07) % 1, cv = curves[st.k];
        var p = cv.getPoint(u), q = cv.getPoint(Math.min(1, u + 0.01)); ship.position.copy(p); ship.lookAt(q); ship.rotateX(Math.PI / 2);
      });
      c.show = function (k) { Object.keys(routes).forEach(function (x) { routes[x].tube.visible = x === k; }); ship.visible = true; c.state.k = k; c.state.t0 = 0; c.say(routes[k].i); };
      c.routes = routes;
    },
    chips: [
      { t: 'Диаш', small: '1488', on: function (c) { c.show('dias'); c.setView(-0.6, 1.5, 15, 0); } },
      { t: 'Колумб', small: '1492', on: function (c) { c.show('col'); c.setView(-1.2, 1.1, 15, 0); } },
      { t: 'Да Гама', small: '1498', on: function (c) { c.show('gama'); c.setView(-0.9, 1.5, 15, 0); } },
      { t: 'Магеллан', small: '1519–1522', on: function (c) { c.show('mag'); c.setView(0.6, 1.9, 17, 0); } }
    ]
  });

  /* ---------- 6. Лестница бытия Пико ---------- */
  reg('ren-ladder3d', {
    title: 'Пико делла Мирандола: человек без готового места', lead: 'У каждого существа своя ступень. Только у человека её нет — он сам выбирает, подняться или опуститься.',
    radius: 12, phi: 1.2, theta: 0.6, targetY: 3.8, height: 400,
    build: function (c) {
      var T = c.THREE;
      var S = [
        ['Камень', '#9aa2b8', 'Камень: просто существует.'], ['Растение', '#4cc38a', 'Растение: живёт и растёт.'], ['Животное', '#c98a4b', 'Животное (лев): чувствует и действует по природе. Его место навсегда задано.'],
        ['', '--panel2', ''], ['Ангел', '#e8e8f0', 'Ангел: чистый разум, тоже на своём месте.'], ['Бог', '#f0c36b', 'Бог — вершина лестницы.']
      ];
      S.forEach(function (s, i) {
        if (!s[0]) return;
        var st = c.box3(2.6, 0.4, 2.4, i === 5 ? '#f0c36b' : '#6a7090', [-5 + i * 2, 0.2 + i * 1.3, 0], '<b>Ступень ' + (i + 1) + '.</b> ' + s[2]);
        var y = 0.4 + i * 1.3, x = -5 + i * 2, inf = st.userData.info;
        if (i === 0) { var r = c.mesh(new T.DodecahedronGeometry(0.5), s[1], inf); r.position.set(x, y + 0.5, 0); }
        if (i === 1) { var tr = c.mesh(new T.ConeGeometry(0.5, 1.4, 10), s[1], inf); tr.position.set(x, y + 0.9, 0); c.mesh(new T.CylinderGeometry(0.1, 0.1, 0.3, 6), '#6b4426', inf).position.set(x, y + 0.15, 0); }
        if (i === 2) { c.box3(1.3, 0.6, 0.6, s[1], [x, y + 0.6, 0], inf); var hd = c.mesh(new T.SphereGeometry(0.45, 12, 10), '#a0602b', inf); hd.position.set(x + 0.8, y + 1, 0); }
        if (i === 4) { figure(c, x, 0, s[1], inf, 0.9).forEach(function (p) { p.position.y += y; }); var w1 = c.mesh(new T.BoxGeometry(0.05, 0.9, 0.6), '#ffffff', inf); w1.position.set(x - 0.35, y + 1.1, -0.3); w1.rotation.x = 0.5; var w2 = c.mesh(new T.BoxGeometry(0.05, 0.9, 0.6), '#ffffff', inf); w2.position.set(x + 0.35, y + 1.1, -0.3); w2.rotation.x = 0.5; }
        if (i === 5) { var g = c.mesh(new T.SphereGeometry(0.6, 20, 14), '#fff3c4', inf, { emissive: 0xf0c36b, emissiveIntensity: 0.8 }); g.position.set(x, y + 1, 0); c.onFrame(function (t) { g.scale.setScalar(1 + Math.sin(t * 2) * 0.08); }); }
        c.label(s[0], [x, y + 2.3, 0], 0.6);
      });
      var hInfo = '<b>Человек.</b> По Пико, Бог сказал Адаму: «Не даю тебе ни определённого места, ни собственного образа… чтобы ты сам, по своей воле, выбрал себе место» (<b>[ДОБАВЛЕНО]</b> пересказ «Речи о достоинстве человека», 1486).';
      var man = new T.Group(); c.root.add(man);
      var plat = c.mesh(new T.CylinderGeometry(0.9, 0.9, 0.15, 24), '#7aa2ff', hInfo, { transparent: true, opacity: 0.7 }); man.add(plat);
      var hb = c.mesh(new T.CylinderGeometry(0.28, 0.38, 1.1, 12), '#4f7be0', hInfo); hb.position.y = 0.6; man.add(hb);
      var hh = c.mesh(new T.SphereGeometry(0.27, 14, 10), '#e8c6a0', hInfo); hh.position.y = 1.4; man.add(hh);
      var hl = c.label('Человек', [0, 2.3, 0], 0.5, '#7aa2ff'); man.add(hl);
      c.state = { goal: 3 };
      man.position.set(-5 + 3 * 2, 0.4 + 3 * 1.3, 1.6);
      c.onFrame(function (t) {
        var g = c.state.goal, gx = -5 + g * 2, gy = 0.4 + g * 1.3 + Math.sin(t * 2) * 0.1;
        man.position.x += (gx - man.position.x) * 0.05; man.position.y += (gy - man.position.y) * 0.05; plat.rotation.y = t;
      });
    },
    chips: [
      { t: 'Вниз', small: 'к зверю', on: function (c) { c.state.goal = 2; c.say('Человек может <b>опуститься</b> до животного — жить только инстинктами.'); } },
      { t: 'Свобода', small: 'выбор', on: function (c) { c.state.goal = 3; c.say('Своей ступени у человека нет. Это и есть его <b>достоинство</b> — свобода самому определять, кем быть.'); } },
      { t: 'Вверх', small: 'к ангелам', on: function (c) { c.state.goal = 4.2; c.say('Человек может <b>подняться</b> к ангелам — через разум, знание и труд над собой. Он не объясняет мир, а <b>перестраивает</b> его и себя.'); } }
    ]
  });

  /* ---------- 7. 95 тезисов ---------- */
  reg('ren-theses3d', {
    title: 'Виттенберг, 1517: 95 тезисов', lead: 'Лютер прибивает тезисы к двери церкви. Нажми на лист — увидишь главные тезисы. Кнопки показывают, против чего он выступал и что предлагал.',
    radius: 17, phi: 1.1, theta: 0.35, targetY: 2.6, height: 380,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var ch = '<b>[ДОБАВЛЕНО] Замковая церковь в Виттенберге.</b> 31 октября 1517 года Лютер прибил к её двери 95 тезисов.';
      c.box3(6, 4.5, 3, '#d8d2c4', [0, 2.25, -1.5], ch);
      var roof = c.mesh(new T.ConeGeometry(4.3, 2, 4), '#8a3b2e', ch); roof.position.set(0, 5.5, -1.5); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.55;
      c.box3(1.6, 7.5, 1.6, '#cfc8b8', [2.6, 3.75, -2.2], ch);
      var spire = c.mesh(new T.ConeGeometry(1.1, 2.6, 8), '#3d5a6e', ch); spire.position.set(2.6, 8.8, -2.2);
      var d1 = c.box3(0.9, 2.4, 0.15, '#6b4426', [-0.46, 1.2, 0.05], 'Дверь церкви. В университетском городе на двери вывешивали объявления о диспутах.');
      var d2 = c.box3(0.9, 2.4, 0.15, '#6b4426', [0.46, 1.2, 0.05], d1.userData.info);
      var th = '<b>Главные тезисы:</b><br>• путь к прощению — <b>покаяние</b>, а не деньги;<br>• папа не может прощать наказания, кроме наложенных им самим (5);<br>• папа не может отпустить ни одного греха — только объявить прощение Божье (6);<br>• покаяние налагается только на живых, не на умерших;<br>• осуждены те, кто верит, что индульгенции дают спасение (32).';
      var sheet = c.box3(0.7, 0.95, 0.03, '#f3efe6', [0.46, 1.6, 0.16], th);
      for (var l = 0; l < 7; l++) c.box3(0.5, 0.03, 0.01, '#555', [0.46, 1.95 - l * 0.11, 0.18], th);
      var lu = figure(c, 1.5, 1.3, '#2b2b2b', '<b>Мартин Лютер</b> (1483–1546). Лектор сравнил его со студентом, которому не принимают курсовую: «взял и прибил».', 1.1);
      var hammer = new T.Group(); hammer.position.set(1.05, 1.7, 0.6); c.root.add(hammer);
      var hh = c.mesh(new T.BoxGeometry(0.3, 0.14, 0.14), '#555', 'Молоток.', { metalness: 0.7 }); hh.position.set(-0.35, 0, 0); hammer.add(hh);
      var hs = c.mesh(new T.CylinderGeometry(0.03, 0.03, 0.5, 6), '#8a5a35', 'Молоток.'); hs.rotation.z = Math.PI / 2; hs.position.x = -0.1; hammer.add(hs);
      /* индульгенции */
      var ind = new T.Group(); ind.position.set(-3.6, 0, 1.6); c.root.add(ind);
      var chestI = '<b>Индульгенции</b> — грамоты о прощении грехов за деньги. Лютер: прощение нельзя купить. Это удар по доходам Рима.';
      into(ind, c.box3(1.2, 0.7, 0.8, '#7a5230', [0, 0.35, 0], chestI));
      var coins = []; for (var i = 0; i < 6; i++) { var co = into(ind, c.mesh(new T.CylinderGeometry(0.14, 0.14, 0.04, 16), '#f0c36b', chestI, { metalness: 0.9, roughness: 0.2 })); co.rotation.x = Math.PI / 2; coins.push(co); }
      var cross = []; [0.8, -0.8].forEach(function (r) { var x = into(ind, c.box3(1.8, 0.12, 0.12, '#ef6b5b', [0, 1, 0.5], 'Лютер против торговли прощением.')); x.rotation.z = r; x.visible = false; cross.push(x); });
      c.label('Индульгенции', [-3.6, 2.4, 1.6], 0.42);
      /* Библия */
      var bib = new T.Group(); bib.position.set(3.6, 0, 2); c.root.add(bib);
      var bI = '<b>Библия на немецком.</b> Лютер перевёл её, чтобы каждый грамотный читал сам, без посредника. Лектор: начало <b>демократизации христианства</b>.';
      into(bib, c.mesh(new T.CylinderGeometry(0.7, 0.8, 0.9, 16), '#8a5a35', bI)).position.y = 0.45;
      var pl = into(bib, c.box3(0.6, 0.1, 0.8, '#6b2a2a', [-0.3, 1.0, 0], bI)), pr = into(bib, c.box3(0.6, 0.1, 0.8, '#6b2a2a', [0.3, 1.0, 0], bI));
      var readers = []; for (var r = 0; r < 5; r++) { var a = r / 5 * Math.PI * 2; var f = figure(c, 3.6 + Math.cos(a) * 1.7, 2 + Math.sin(a) * 1.7, ['#4f7be0', '#bf5b4a', '#4cc38a', '#b07cff', '#c98a4b'][r], bI, 0.7); f.forEach(function (p) { p.visible = false; }); readers.push(f); }
      c.label('Библия для всех', [3.6, 2.4, 2], 0.42);
      c.state = { mode: 0, t0: 0 };
      c.onFrame(function (t) {
        var st = c.state; if (!st.t0) st.t0 = t; var el = t - st.t0;
        var hit = st.mode === 0 && el < 3; hammer.rotation.z = hit ? Math.abs(Math.sin(el * 6)) * 0.9 : 0.3;
        sheet.scale.setScalar(st.mode === 0 ? Math.min(1, 0.2 + el * 0.4) : 1);
        coins.forEach(function (co, i) { var k = ((t * 0.5) + i / 6) % 1; co.position.set(0, 2 - k * 1.6, 0); co.visible = st.mode === 1 ? el < 2.5 : true; });
        cross.forEach(function (x) { x.visible = st.mode === 1 && el > 2.5; });
        var op = st.mode === 2 ? Math.min(1, el) : 0; pl.rotation.z = op * 0.5; pr.rotation.z = -op * 0.5;
        readers.forEach(function (f, i) { f.forEach(function (p) { p.visible = st.mode === 2 && el > 0.5 + i * 0.4; }); });
      });
    },
    chips: [
      { t: 'Тезисы', small: '31.10.1517', on: function (c) { c.state.mode = 0; c.state.t0 = 0; c.setView(0.25, 1.15, 9, 1.6, 0.5); c.say('Лютер прибивает тезисы к двери. Нажми на белый лист, чтобы прочитать главное.'); } },
      { t: 'Индульгенции', small: 'против', on: function (c) { c.state.mode = 1; c.state.t0 = 0; c.setView(-0.5, 1.1, 10, 1.2, -3.6); c.say('Монеты падают в сундук — так церковь продавала прощение. Лютер: <b>покаяние, а не деньги</b>.'); } },
      { t: 'Библия', small: 'для всех', on: function (c) { c.state.mode = 2; c.state.t0 = 0; c.setView(0.7, 1.05, 10, 1.2, 3.6); c.say('Перевод Библии на родной язык — как iPhone, который «дал интернет в руки». Привычная практика меняется — это и есть революция.'); } },
      { t: 'Политика', small: 'чья власть…', on: function (c) { c.state.mode = 0; c.state.t0 = -10; c.setView(0.35, 0.9, 19, 3); c.say('Политический смысл: независимость национальных церквей от Рима. <b>«Чья власть, того и вера»</b> (<b>[ДОБАВЛЕНО]</b> закреплено Аугсбургским миром, 1555).'); } }
    ]
  });

  /* ---------- 8. От Птолемея к Бруно ---------- */
  reg('ren-cosmos3d', {
    title: 'Земля, Солнце и бесконечность миров', lead: 'Переключай картины мира: Земля в центре → Солнце в центре (Коперник) → бесконечно много миров (Бруно).',
    radius: 22, phi: 0.9, theta: 0.4, targetY: 0, height: 380, autorotate: false,
    build: function (c) {
      var T = c.THREE;
      var B = {
        sun: c.mesh(new T.SphereGeometry(0.9, 24, 16), '#ffd25a', '<b>Солнце.</b> У Коперника — центр системы.', { emissive: 0xffa500, emissiveIntensity: 0.7 }),
        earth: c.mesh(new T.SphereGeometry(0.45, 20, 14), '#3d7fd9', '<b>Земля.</b> В старой картине — неподвижный центр творения; у Коперника — одна из планет.'),
        mer: c.mesh(new T.SphereGeometry(0.2, 12, 10), '#b8b0a0', 'Меркурий.'), ven: c.mesh(new T.SphereGeometry(0.35, 14, 10), '#e8c48a', 'Венера.'),
        mar: c.mesh(new T.SphereGeometry(0.3, 14, 10), '#d0603a', 'Марс.'), jup: c.mesh(new T.SphereGeometry(0.7, 18, 12), '#d9b98a', 'Юпитер.'), sat: c.mesh(new T.SphereGeometry(0.6, 18, 12), '#e0cf9a', 'Сатурн.')
      };
      var ring = c.mesh(new T.TorusGeometry(0.95, 0.08, 6, 30), '#cdbb88', 'Кольца Сатурна.'); ring.rotation.x = 1.2;
      var geo = { earth: 0, mer: 1.8, ven: 2.8, sun: 4, mar: 5.2, jup: 6.4, sat: 7.6 }, hel = { sun: 0, mer: 1.6, ven: 2.6, earth: 3.7, mar: 4.8, jup: 6.3, sat: 7.8 };
      var speed = { sun: 0.25, earth: 0.25, mer: 1, ven: 0.6, mar: 0.18, jup: 0.08, sat: 0.05 };
      var orbits = {};
      Object.keys(B).forEach(function (k) { var o = c.mesh(new T.TorusGeometry(1, 0.015, 4, 96), '#9aa2c0', null, { transparent: true, opacity: 0.4 }); o.rotation.x = Math.PI / 2; orbits[k] = o; });
      var sphere = c.mesh(new T.SphereGeometry(9.5, 32, 20), '#2a3060', '<b>«Твердь» — сфера неподвижных звёзд.</b> В средневековой картине мир конечен и замкнут.', { transparent: true, opacity: 0.18, side: T.BackSide, wireframe: true });
      var sg = new T.BufferGeometry(), arr = [];
      for (var i = 0; i < 900; i++) { var u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = 14 + Math.random() * 40, s = Math.sqrt(1 - u * u); arr.push(r * s * Math.cos(a), r * u, r * s * Math.sin(a)); }
      sg.setAttribute('position', new T.Float32BufferAttribute(arr, 3));
      var stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 0.25 })); c.root.add(stars);
      var worlds = [];
      for (var w = 0; w < 7; w++) {
        var g = new T.Group(), a2 = w / 7 * Math.PI * 2, rr = 18 + (w % 3) * 6; g.position.set(Math.cos(a2) * rr, (w % 2 ? 3 : -3), Math.sin(a2) * rr); c.root.add(g);
        var st = c.mesh(new T.SphereGeometry(0.6, 14, 10), '#fff0b0', '<b>Бруно:</b> каждая звезда — солнце со своими планетами. Миров бесконечно много.', { emissive: 0xffcc66, emissiveIntensity: 0.7 }); g.add(st);
        var p1 = c.mesh(new T.SphereGeometry(0.22, 10, 8), '#6fa0ff', st.userData.info); g.add(p1); var p2 = c.mesh(new T.SphereGeometry(0.18, 10, 8), '#ef6b5b', st.userData.info); g.add(p2);
        g.userData = { p1: p1, p2: p2, ph: w }; worlds.push(g);
      }
      var lab = c.label('Земля в центре', [0, 6, 0], 0.7, '#f0c36b');
      c.state = { mode: 0, k: 0 };
      c.onFrame(function (t) {
        var st = c.state; st.k += ((st.mode === 0 ? 0 : 1) - st.k) * 0.03; var k = st.k;
        var cg = new T.Vector3(0, 0, 0), sunPos = new T.Vector3(Math.cos(t * speed.sun) * geo.sun, 0, Math.sin(t * speed.sun) * geo.sun);
        Object.keys(B).forEach(function (n) {
          var gp = n === 'earth' ? cg.clone() : new T.Vector3(Math.cos(t * speed[n] + n.length) * geo[n], 0, Math.sin(t * speed[n] + n.length) * geo[n]);
          if (n === 'sun') gp = sunPos.clone();
          var hp = n === 'sun' ? new T.Vector3() : new T.Vector3(Math.cos(t * speed[n] + n.length) * hel[n], 0, Math.sin(t * speed[n] + n.length) * hel[n]);
          B[n].position.copy(gp.lerp(hp, k));
          var orr = lerp(geo[n], hel[n], k); orbits[n].scale.set(Math.max(0.01, orr), Math.max(0.01, orr), 1); orbits[n].visible = orr > 0.2;
        });
        ring.position.copy(B.sat.position);
        sphere.visible = st.mode === 0; sphere.material.opacity = 0.18 * (1 - k);
        worlds.forEach(function (g) { g.visible = st.mode === 2; var d = g.userData; d.p1.position.set(Math.cos(t + d.ph) * 1.4, 0, Math.sin(t + d.ph) * 1.4); d.p2.position.set(Math.cos(t * 0.6 + d.ph) * 2.2, 0, Math.sin(t * 0.6 + d.ph) * 2.2); });
        stars.visible = st.mode === 2; stars.rotation.y = t * 0.01;
      });
      c.setLab = function (s) { c.root.remove(lab); lab = c.label(s, [0, 6, 0], 0.7, '#f0c36b'); };
    },
    chips: [
      { t: 'Птолемей', small: 'Земля в центре', on: function (c) { c.state.mode = 0; c.setLab('Земля в центре'); c.setView(0.4, 0.9, 22, 0); c.say('Старая картина: Земля — неподвижный центр, всё вращается вокруг неё, мир закрыт сферой звёзд. Церковь опиралась на буквальное толкование Писания.'); } },
      { t: 'Коперник', small: 'Солнце в центре', on: function (c) { c.state.mode = 1; c.setLab('Солнце в центре'); c.setView(0.4, 0.8, 22, 0); c.say('<b>Коперник (1473–1543):</b> в центре — Солнце. Земля — лишь одна из планет. Подорвано представление о Земле как единственном центре творения.'); } },
      { t: 'Бруно', small: 'миров много', on: function (c) { c.state.mode = 2; c.setLab('Бесконечность миров'); c.setView(0.4, 0.75, 50, 0); c.say('<b>Бруно (1548–1600):</b> Вселенная бесконечна, звёзд-солнц бесчисленно много, у каждого свои миры. Бог — во всём. За это его сожгли в 1600 году.'); } },
      { t: 'Кузанский', small: 'бесконечность', on: function (c) { c.state.mode = 2; c.setLab('Природа бесконечна'); c.setView(1.2, 1.2, 40, 0); c.say('<b>Николай Кузанский (1401–1464)</b> раньше всех сказал: бесконечность — божественный атрибут природы. Значит, природу можно и нужно изучать.'); } }
    ]
  });

  /* ---------- 9. Государь: лев и лиса ---------- */
  reg('ren-prince3d', {
    title: 'Государь Макиавелли: лев и лиса', lead: '<b>[ДОБАВЛЕНО]</b> В XVIII главе «Государя» правителю советуют быть одновременно львом и лисой. Нажимай на кнопки.',
    radius: 17, phi: 1.05, theta: 0.2, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var LI = '<b>Лев — сила.</b> «Лев не умеет уберечься от капканов». Одной силы мало: её надо применять с умом.';
      var lion = new T.Group(); lion.position.set(-3.5, 0, 0); c.root.add(lion);
      into(lion, c.box3(2.2, 1, 1, '#d9a04a', [0, 1.3, 0], LI));
      [[-0.8, 0.35], [-0.8, -0.35], [0.8, 0.35], [0.8, -0.35]].forEach(function (p) { into(lion, c.box3(0.3, 0.9, 0.3, '#c98a3b', [p[0], 0.45, p[1]], LI)); });
      var mane = into(lion, c.mesh(new T.SphereGeometry(0.85, 16, 12), '#9a5a20', LI)); mane.position.set(1.3, 1.9, 0);
      var lh = into(lion, c.mesh(new T.SphereGeometry(0.55, 16, 12), '#e0b060', LI)); lh.position.set(1.6, 1.9, 0);
      var lt = into(lion, c.mesh(new T.CylinderGeometry(0.06, 0.06, 1.4, 6), '#c98a3b', LI)); lt.position.set(-1.5, 1.6, 0); lt.rotation.z = 0.8;
      c.label('Лев · сила', [-3.5, 3.4, 0], 0.5);
      var FI = '<b>Лиса — хитрость.</b> «Лиса не умеет защититься от волков». Нужно распознавать ловушки, договариваться, обманывать противника.';
      var fox = new T.Group(); fox.position.set(3.5, 0, 0); c.root.add(fox);
      into(fox, c.box3(1.6, 0.6, 0.6, '#e0703a', [0, 0.9, 0], FI));
      [[-0.6, 0.2], [-0.6, -0.2], [0.6, 0.2], [0.6, -0.2]].forEach(function (p) { into(fox, c.box3(0.15, 0.6, 0.15, '#3a2a20', [p[0], 0.3, p[1]], FI)); });
      var fh = into(fox, c.mesh(new T.SphereGeometry(0.38, 14, 10), '#e0703a', FI)); fh.position.set(1, 1.3, 0);
      var sn = into(fox, c.mesh(new T.ConeGeometry(0.17, 0.5, 10), '#f3efe6', FI)); sn.position.set(1.4, 1.25, 0); sn.rotation.z = -Math.PI / 2;
      [0.15, -0.15].forEach(function (z) { var e = into(fox, c.mesh(new T.ConeGeometry(0.11, 0.35, 4), '#c05020', FI)); e.position.set(0.95, 1.7, z); });
      var tail = into(fox, c.mesh(new T.ConeGeometry(0.28, 1.3, 10), '#e0703a', FI)); tail.position.set(-1.2, 1.1, 0); tail.rotation.z = -1.1;
      c.label('Лиса · хитрость', [3.5, 2.8, 0], 0.5);
      var PI = '<b>Государь</b> соединяет силу и хитрость. Его «мораль» — эффективность: удержать власть и сохранить государство.';
      var pr = figure(c, 0, -1.5, '#6b2a8a', PI, 1.3);
      var crown = c.mesh(new T.TorusGeometry(0.3, 0.09, 8, 6), '#f0c36b', PI, { metalness: 0.8 }); crown.rotation.x = Math.PI / 2; crown.position.set(0, 2.25, -1.5);
      c.label('Государь', [0, 3.2, -1.5], 0.5, '#f0c36b');
      var mask = c.mesh(new T.SphereGeometry(0.32, 14, 10, 0, Math.PI), '#f3efe6', '<b>Маска морали.</b> Политика говорит языком морали, чтобы достучаться до каждого, но в борьбе государей действует иначе.'); mask.position.set(0, 1.75, -1.15); mask.visible = false;
      c.state = { mode: 0 };
      c.onFrame(function (t) {
        var m = c.state.mode;
        lion.position.x = m === 2 ? -1.6 : -3.5; fox.position.x = m === 2 ? 1.6 : 3.5;
        lion.scale.setScalar(m === 1 ? 0.7 : 1 + (m === 0 ? Math.sin(t * 3) * 0.03 : 0)); fox.scale.setScalar(m === 0 ? 0.7 : 1 + (m === 1 ? Math.sin(t * 3) * 0.03 : 0));
        tail.rotation.x = Math.sin(t * 4) * 0.3; mask.visible = m === 3; crown.rotation.z = t;
      });
    },
    chips: [
      { t: 'Лев', small: 'сила', on: function (c) { c.state.mode = 0; c.setView(-0.4, 1.05, 12, 1.5, -2.5); c.pick(null); c.say('Сила армии и принуждения. Но лев попадёт в капкан, если не видит ловушек.'); } },
      { t: 'Лиса', small: 'хитрость', on: function (c) { c.state.mode = 1; c.setView(0.5, 1.05, 12, 1.2, 2.5); c.say('Дипломатия, хитрость, умение распознать заговор. Но лиса беззащитна перед волками.'); } },
      { t: 'Государь', small: 'оба', on: function (c) { c.state.mode = 2; c.setView(0.2, 1.0, 14, 1.5); c.say('Государь соединяет обоих. Цель борьбы — <b>получение власти</b>. Но когда власть получена, <b>чистым насилием</b> пользоваться нельзя — оно разрушает порядок.'); } },
      { t: 'Мораль', small: 'язык власти', on: function (c) { c.state.mode = 3; c.setView(0, 1.0, 12, 1.8, 0, -1); c.say('Политика — <b>самостоятельная сфера</b>. Она использует язык морали, но мораль государя — <b>эффективность</b> на должности. Фразы «цель оправдывает средства» в «Государе» нет (<b>[ДОБАВЛЕНО]</b>).'); } }
    ]
  });

  /* ---------- 10. Тевтобургский лес ---------- */
  reg('ren-teutoburg3d', {
    title: 'Пример лектора: римская колонна в германском лесу', lead: '<b>[ДОБАВЛЕНО]</b> Тевтобургский лес, 9 г. н. э. Колонна Вара растянулась по узкой дороге. Германцы ждут в лесу.',
    radius: 20, phi: 0.85, theta: 0.6, targetY: 0.5,
    build: function (c) {
      var T = c.THREE;
      c.box3(18, 0.2, 10, '#4f6b3a', [0, -0.1, 0], 'Германия — чужая территория, где римлян не любят.');
      var path = new T.CatmullRomCurve3([new T.Vector3(-8, 0.05, 2), new T.Vector3(-4, 0.05, 0), new T.Vector3(0, 0.05, 1), new T.Vector3(4, 0.05, -0.5), new T.Vector3(8, 0.05, 1)]);
      c.mesh(new T.TubeGeometry(path, 60, 0.55, 6), '#a08a60', '<b>Узкая лесная дорога.</b> Колонна растянулась на километры, без разведки и прикрытия.', { roughness: 0.9 }).scale.y = 0.15;
      for (var i = 0; i < 70; i++) {
        var x = -8.5 + Math.random() * 17, z = -4.8 + Math.random() * 9.6, p = path.getPoint(Math.min(1, Math.max(0, (x + 8) / 16)));
        if (Math.abs(z - p.z) < 1.3) continue;
        var tr = c.mesh(new T.ConeGeometry(0.5, 1.8, 8), '#2f5a2a', 'Густой лес: здесь римский строй не работает.'); tr.position.set(x, 0.9, z);
      }
      var RI = '<b>Римская колонна Вара.</b> Ошибки по лектору: надменность («германцы разбегутся от одного нашего вида»), неправильное движение колонны, удалённость от баз и <b>неучёт общественного мнения</b>.';
      var legion = []; for (var j = 0; j < 20; j++) { var s = c.box3(0.3, 0.5, 0.3, '#bf3b2e', [0, 0.3, 0], RI); legion.push(s); }
      var GI = '<b>Германцы Арминия.</b> Обучены римскому военному делу, сплочены, выбрали выгодную позицию.';
      var ger = []; for (var g = 0; g < 16; g++) { var t2 = g / 16, pp = path.getPoint(0.2 + t2 * 0.6), side = g % 2 ? 1 : -1; var m = c.box3(0.3, 0.5, 0.3, '#3b5ab0', [pp.x, 0.3, pp.z + side * 2.4], GI); m.userData.home = [pp.x, pp.z + side * 2.4]; m.userData.road = [pp.x, pp.z + side * 0.5]; m.visible = false; ger.push(m); }
      c.state = { mode: 0, t0: 0 };
      c.onFrame(function (t) {
        var st = c.state; if (!st.t0) st.t0 = t; var el = t - st.t0;
        var head = st.mode === 0 ? Math.min(0.85, 0.15 + el * 0.06) : 0.75;
        legion.forEach(function (s, i) { var u = Math.max(0, head - i * 0.03); var p = path.getPoint(u); s.position.set(p.x, 0.3 + (st.mode === 0 ? Math.abs(Math.sin(t * 6 + i)) * 0.05 : 0), p.z); s.visible = !(st.mode === 2 && i % 3 !== 0); });
        ger.forEach(function (m, i) { m.visible = st.mode >= 1; var k = st.mode >= 1 ? Math.min(1, el * 0.5) : 0; m.position.x = lerp(m.userData.home[0], m.userData.road[0], k); m.position.z = lerp(m.userData.home[1], m.userData.road[1], k); });
      });
    },
    chips: [
      { t: 'Колонна', small: 'марш', on: function (c) { c.state.mode = 0; c.state.t0 = 0; c.setView(0.6, 0.85, 20, 0.5); c.say('Легионы идут длинной колонной по лесной дороге, уверенные в своём превосходстве.'); } },
      { t: 'Засада', small: 'удар', on: function (c) { c.state.mode = 1; c.state.t0 = 0; c.setView(0.9, 0.7, 14, 0.5, 2); c.say('Германцы выходят из леса со всех сторон. Строй развалился — колонну режут по частям.'); } },
      { t: 'Вывод', small: 'по Макиавелли', on: function (c) { c.state.mode = 2; c.state.t0 = 0; c.setView(0.4, 0.95, 22, 0.5); c.say('Если местные враждебны, демонстрация силы бесполезна. Нужно учитывать <b>общественное мнение</b> и выбирать другие средства — так рассуждает «Государь».'); } }
    ]
  });

  /* ---------- 11. Утопия и Город Солнца ---------- */
  reg('ren-utopia3d', {
    title: 'Утопия Мора и Город Солнца Кампанеллы', lead: 'Слева — остров Утопия, справа — Город Солнца за семью стенами. Сравни, как они связаны с внешним миром.',
    radius: 22, phi: 0.85, theta: 0.3, targetY: 0.5, height: 380,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(22, 0.3, 14), '#2f6db0', 'Море.', { roughness: 0.4 }).position.y = -0.3;
      var U = new T.Group(); U.position.set(-5, 0, 0); c.root.add(U);
      var UI = '<b>Утопия Томаса Мора (1516)</b>: остров-полумесяц. Все обязаны трудиться, частной собственности нет, нарушителей высылают. <b>[ДОБАВЛЕНО]</b> На острове 54 города.';
      var isl = into(U, c.mesh(new T.TorusGeometry(3.2, 1, 10, 48, Math.PI * 1.6), '#7fb26a', UI)); isl.rotation.x = Math.PI / 2; isl.rotation.z = Math.PI * 0.7; isl.scale.z = 0.35;
      for (var i = 0; i < 18; i++) { var a = Math.PI * 0.7 + (i + 0.5) / 18 * Math.PI * 1.6; var h = into(U, c.box3(0.35, 0.4 + (i % 3) * 0.15, 0.35, '#f3efe6', [Math.cos(a) * 3.2, 0.5, -Math.sin(a) * 3.2], UI)); }
      c.label('Утопия', [-5, 2.6, 0], 0.55, '#7aa2ff');
      var S = new T.Group(); S.position.set(5.5, 0, 0); c.root.add(S);
      var SI = '<b>Город Солнца Кампанеллы (1602)</b>: семь кругов стен на холме. Всю жизнь жителей регламентируют мудрецы во главе с «Солнцем». Город закрыт.';
      into(S, c.mesh(new T.CylinderGeometry(3.6, 4, 0.6, 40), '#9b8f6a', SI)).position.y = 0.1;
      for (var k = 0; k < 7; k++) { var r = 3.4 - k * 0.42; var w = into(S, c.mesh(new T.CylinderGeometry(r, r, 0.45, 40, 1, true), '#d8d2c4', SI, { side: T.DoubleSide })); w.position.y = 0.6 + k * 0.28; }
      var dome = into(S, c.mesh(new T.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#f0c36b', '<b>Храм в центре</b>: власть мудреца-метафизика. Лектор сравнил с идеями чучхе: вождь, который будто бы всё знает и умеет.', { metalness: 0.6, roughness: 0.3 })); dome.position.y = 2.6;
      c.label('Город Солнца', [5.5, 4, 0], 0.55, '#f0c36b');
      var ships = []; for (var s = 0; s < 4; s++) { var sh = c.mesh(new T.ConeGeometry(0.2, 0.6, 6), '#ffffff', '<b>Обратная связь</b>: корабли приходят и уходят — люди, товары, идеи. Открытая система может адаптироваться.'); sh.rotation.x = Math.PI / 2; ships.push(sh); }
      var dots = []; for (var d = 0; d < 10; d++) { var dt = c.mesh(new T.SphereGeometry(0.12, 8, 6), '#ef6b5b', '<b>Закрытость</b>: никто не выходит и не входит. Система воспроизводит себя, но почти не меняется.'); dots.push(dt); }
      c.state = { mode: 0 };
      c.onFrame(function (t) {
        var m = c.state.mode;
        ships.forEach(function (sh, i) { var k = ((t * 0.12) + i / 4) % 1; var ang = i * 1.6; sh.visible = m !== 1; sh.position.set(-5 + Math.cos(ang) * (1 + k * 7), 0, Math.sin(ang) * (1 + k * 5)); });
        dots.forEach(function (dt, i) { var a = t * (0.6 + i * 0.05) + i; var r = 0.9 + (i % 4) * 0.55; dt.visible = m !== 0; dt.position.set(5.5 + Math.cos(a) * r, 1.1 + (i % 4) * 0.3, Math.sin(a) * r); });
      });
    },
    chips: [
      { t: 'Утопия', small: 'Мор', on: function (c) { c.state.mode = 0; c.setView(-0.2, 0.85, 14, 0.5, -5); c.say('Идеальное государство на острове. Нереально, но это <b>взгляд в будущее</b>. Мор был против Реформации и казнён за отказ признать Акт о супрематии.'); } },
      { t: 'Город Солнца', small: 'Кампанелла', on: function (c) { c.state.mode = 1; c.setView(0.6, 0.8, 12, 1.2, 5.5); c.say('Жители не выбирают ничего сверх плана. По лектору, это другая версия гуманизма, которая противоречит его идеалам свободы.'); } },
      { t: 'Устойчивость', small: 'открыто vs закрыто', on: function (c) { c.state.mode = 2; c.setView(0.3, 0.85, 22, 0.5); c.say('Система прочна, когда есть <b>канал обратной связи</b> (слева) или когда она <b>полностью закрыта</b> (справа). Но закрытая плохо адаптируется к миру вокруг.'); } }
    ]
  });

  /* ---------- Мини-тест ---------- */
  HubWidgets.register('ren-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Кто это сказал или сделал?</b></div><p class="wg-lead">Выбери мыслителя. 8 вопросов по лекции.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var O = ['Пико', 'Лютер', 'Макиавелли', 'Т. Мор', 'Бруно', 'Монтень'];
    var Q = [['Человеку не дано готового места: он сам выбирает, подняться к ангелам или опуститься к зверю.', 0, '«Речь о достоинстве человека», 1486.'],
      ['Прибил 95 тезисов к двери церкви в Виттенберге.', 1, '31 октября 1517 года.'],
      ['Политика — самостоятельная сфера; мораль государя — эффективность.', 2, '«Государь», 1513.'],
      ['Описал идеальное государство на острове, где все обязаны трудиться.', 3, '«Утопия», 1516.'],
      ['Миров бесконечно много, Бог — во всём. Сожжён в 1600 году.', 4, 'Пантеизм, бесконечность Вселенной.'],
      ['Писал по-французски, а не на латыни; опыт лучше авторитета.', 5, '«Опыты»; книгу внесли в Индекс запрещённых книг.'],
      ['Перевёл Библию на родной язык — «начало демократизации христианства».', 1, 'Каждый грамотный мог читать сам.'],
      ['Отказался признать Акт о супрематии Генриха VIII и был казнён.', 3, 'В 1935 году канонизирован.']];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 100px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 6 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
      qo.innerHTML = '<small style="color:var(--muted)">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + Q[i][0];
      O.forEach(function (t, k) {
        btn('<b>' + t + '</b>').onclick = function () {
          if (done) return; done = true; var ok = k === Q[i][1]; if (ok) score++;
          Array.prototype.forEach.call(ch.children, function (x, j) { if (j === Q[i][1]) x.classList.add('on'); else if (j === k) x.classList.add('off'); });
          res.style.display = ''; res.innerHTML = (ok ? '✅ Верно. ' : '❌ Правильно: <b>' + O[Q[i][1]] + '</b>. ') + Q[i][2];
          btn('<b>Дальше ›</b>').onclick = function () { i++; done = false; res.style.display = 'none'; draw(); };
        };
      });
    }
    draw();
  });
})();
