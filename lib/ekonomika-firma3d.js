/* 3D-модели к конспекту «Экономика. Фирма: классификация и организационно-правовые формы» (лекция 02.11).
   В Markdown: @@graph:fi-classes3d@@ @@graph:fi-gk3d@@ @@graph:fi-sector3d@@ @@graph:fi-capital3d@@ @@graph:fi-property3d@@
   @@graph:fi-sole3d@@ @@graph:fi-credit3d@@ @@graph:fi-partners3d@@ @@graph:fi-aksakal3d@@ @@graph:fi-jsc3d@@
   @@graph:fi-stake3d@@ @@graph:fi-nominal3d@@ @@graph:fi-pies3d@@ @@graph:fi-stable3d@@ @@graph:fi-managers3d@@
   @@graph:fi-tax3d@@ @@graph:fi-unitary3d@@
   Общие помощники лежат в window.FirmaKit — ими пользуется и второй файл (издержки и прибыль). */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var K = {};
  K.C = {
    BLUE: '#5b8def', RED: '#e0645a', GOLD: '#f0c36b', GREEN: '#4cc38a', GREY: '#8b93b5', PURPLE: '#a78bfa',
    WOOD: '#8a5a3b', STONE: '#d9d4c7', DARK: '#3a3f55', PAPER: '#f4f1ea', SILVER: '#c9ced8', ORANGE: '#e39b5b',
    POTATO: '#c9a46a', CREAM: '#f6e7c8', TEA: '#7fb069', SKIN: '#e8c6a0', WHITE: '#f7f7f2'
  };
  var C = K.C;
  K.reg = function (name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 2.6, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  };
  K.group = function (c, x, y, z) { var g = new c.THREE.Group(); c.root.add(g); g.position.set(x || 0, y || 0, z || 0); return g; };
  K.lerp = function (a, b, k) { return a + (b - a) * k; };
  K.person = function (c, x, z, col, info, g, s, y) {
    var T = c.THREE; s = s || 1; y = y || 0;
    var p = new T.Group(); (g || c.root).add(p); p.position.set(x, y, z);
    var b = c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info); b.position.y = 0.45 * s; p.add(b);
    var h = c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), C.SKIN, info); h.position.y = 1.12 * s; p.add(h);
    return p;
  };
  K.arrow = function (c, a, b, col, info, g, rad) {
    var T = c.THREE, A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]), dir = B.clone().sub(A).normalize();
    var head = B.clone().sub(dir.clone().multiplyScalar(0.45));
    var s = c.link(a, [head.x, head.y, head.z], col, rad || 0.07, info);
    var cone = c.mesh(new T.ConeGeometry((rad || 0.07) * 3, 0.5, 14), col, info);
    cone.position.copy(B).sub(dir.clone().multiplyScalar(0.25)); cone.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    var grp = new T.Group(); (g || c.root).add(grp); grp.add(s); grp.add(cone);
    return grp;
  };
  K.glow = function (c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); };
  K.coin = function (c, x, y, z, info, g, r, col) {
    var m = c.mesh(new c.THREE.CylinderGeometry(r || 0.4, r || 0.4, 0.1, 28), col || C.GOLD, info, { metalness: 0.25, roughness: 0.35, emissive: col || C.GOLD, emissiveIntensity: 0.12 });
    m.position.set(x, y, z); if (g) g.add(m); return m;
  };
  K.stack = function (c, x, z, n, info, g, col, r) { var a = []; for (var i = 0; i < n; i++) a.push(K.coin(c, x, 0.06 + i * 0.11, z, info, g, r || 0.4, col)); return a; };
  K.house = function (c, x, z, col, info, g, s) {
    var T = c.THREE; s = s || 1; var p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    p.add(c.box3(1.1 * s, 0.8 * s, 1.0 * s, col || C.CREAM, [0, 0.4 * s, 0], info));
    var roof = c.mesh(new T.ConeGeometry(0.88 * s, 0.6 * s, 4), C.RED, info); roof.position.y = 1.1 * s; roof.rotation.y = Math.PI / 4; p.add(roof);
    p.add(c.box3(0.25 * s, 0.4 * s, 0.04, C.WOOD, [0, 0.2 * s, 0.51 * s], info));
    return p;
  };
  K.factory = function (c, x, z, col, info, g, s) {
    var T = c.THREE; s = s || 1; var p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    p.add(c.box3(2.4 * s, 1.3 * s, 1.6 * s, col || C.STONE, [0, 0.65 * s, 0], info));
    var r1 = c.mesh(new T.CylinderGeometry(0.01, 0.95 * s, 0.6 * s, 4), C.DARK, info); r1.rotation.y = Math.PI / 4; r1.scale.set(1.3, 1, 0.85); r1.position.y = 1.6 * s; p.add(r1);
    var ch = c.mesh(new T.CylinderGeometry(0.15 * s, 0.2 * s, 1.3 * s, 12), C.DARK, info); ch.position.set(0.75 * s, 1.95 * s, -0.35 * s); p.add(ch);
    for (var i = 0; i < 3; i++) p.add(c.box3(0.4 * s, 0.35 * s, 0.03, '#9fd3ff', [-0.75 * s + i * 0.75 * s, 0.8 * s, 0.81 * s], info));
    p.userData.chimney = [0.75 * s, 2.7 * s, -0.35 * s];
    return p;
  };
  K.smoke = function (c, f, n) {
    var puffs = [], T = c.THREE, base = f.userData.chimney;
    for (var i = 0; i < (n || 4); i++) { var m = c.mesh(new T.SphereGeometry(0.22, 12, 8), '#cfd3dd', null, { transparent: true, opacity: 0.7 }); f.add(m); puffs.push(m); }
    f.userData.on = true;
    c.onFrame(function (t) {
      puffs.forEach(function (m, i) {
        var k = ((t * 0.35 + i / puffs.length) % 1);
        m.visible = f.userData.on !== false;
        m.position.set(base[0] + k * 0.6, base[1] + k * 1.6, base[2]);
        m.scale.setScalar(0.6 + k * 1.2); m.material.opacity = 0.7 * (1 - k);
      });
    });
    return puffs;
  };
  K.paper = function (c, x, y, z, info, g, col, w, d) { var m = c.box3(w || 0.8, 0.03, d || 0.55, col || C.PAPER, [x, y, z], info); if (g) g.add(m); return m; };
  K.flag = function (c, x, z, info, g, h) {
    var T = c.THREE, p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z); h = h || 2.6;
    p.add(c.link([0, 0, 0], [0, h, 0], C.SILVER, 0.04, info));
    [C.WHITE, C.BLUE, C.RED].forEach(function (col, i) { p.add(c.box3(0.9, 0.18, 0.03, col, [0.47, h - 0.12 - i * 0.18, 0], info)); });
    return p;
  };
  K.sector = function (c, r, h, a0, a1, col, info, g) {
    var T = c.THREE, s = new T.Shape(); s.moveTo(0, 0); s.absarc(0, 0, r, a0, a1, false); s.lineTo(0, 0);
    var geo = new T.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 40 });
    geo.rotateX(-Math.PI / 2);
    var m = c.mesh(geo, col, info); if (g) g.add(m); return m;
  };
  /* Кривая-трубка по точкам [x,y,z] */
  K.tube = function (c, pts, col, info, g, r) {
    var T = c.THREE, cv = new T.CatmullRomCurve3(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2] || 0); }));
    var m = c.mesh(new T.TubeGeometry(cv, 120, r || 0.08, 10, false), col, info, { emissive: col, emissiveIntensity: 0.18 });
    m.userData.curve = cv; if (g) g.add(m); return m;
  };
  K.axes = function (c, ox, oz, w, h, g, xl, yl) {
    var iA = 'Оси графика: по вертикали — <b>' + (yl || 'издержки') + '</b>, по горизонтали — <b>' + (xl || 'объём выпуска Q') + '</b>.';
    K.arrow(c, [ox, 0.05, oz], [ox + w, 0.05, oz], C.GREY, iA, g, 0.05);
    K.arrow(c, [ox, 0, oz], [ox, h, oz], C.GREY, iA, g, 0.05);
    c.label(yl || 'издержки, ₽', [ox, h + 0.5, oz], 0.24, '#8b93b5'); c.label(xl || 'Q (выпуск)', [ox + w, -0.5, oz], 0.24, '#8b93b5');
  };
  /* Плавная анимация к цели: obj.position / obj.scale */
  K.toward = function (c, obj, key, target, k) {
    c.onFrame(function () { var v = obj[key], t = target(); if (!t) return; v.x = K.lerp(v.x, t[0], k || 0.07); v.y = K.lerp(v.y, t[1], k || 0.07); v.z = K.lerp(v.z, t[2], k || 0.07); });
  };
  window.FirmaKit = K;
  var reg = K.reg, person = K.person, arrow = K.arrow, glow = K.glow, coin = K.coin, stack = K.stack, house = K.house, factory = K.factory;

  /* ======================= 1. Пять классификаций ======================= */
  reg('fi-classes3d', {
    title: 'Как можно классифицировать фирмы', lead: 'В центре — фирма. Вокруг — пять признаков, по которым лектор её классифицировала. Шестой — организационно-правовая форма — разобран ниже отдельно.',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1, height: 420, hint: 'Нажми на постамент или выбери признак кнопкой.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var f = factory(c, 0, 0, C.STONE, '<b>Фирма</b> — одну и ту же фирму можно описать по разным признакам. Каждый признак отвечает на свой вопрос.', null, 0.9);
      K.smoke(c, f, 3);
      c.label('Фирма', [0, 3.3, 0], 0.34);
      var items = [
        ['ГК РФ, ст. 50', C.RED, '<b>1. По Гражданскому кодексу (ст. 50):</b> коммерческие и некоммерческие организации.'],
        ['Цель', C.GOLD, '<b>2. По цели:</b> коммерческие стремятся получить <b>максимальную прибыль</b>, некоммерческие удовлетворяют <b>социальные, общественные потребности</b>.'],
        ['Вид деятельности', C.BLUE, '<b>3. По виду хозяйственной деятельности:</b> промышленные, строительные, транспортные, сельскохозяйственные… Решает правило <b>50 %</b> продукции.'],
        ['Чей капитал', C.PURPLE, '<b>4. По принадлежности капитала:</b> национальные, иностранные и совместные (смешанный капитал).'],
        ['Форма собственности', C.GREEN, '<b>5. По форме собственности:</b> государственные, муниципальные, частные, смешанные (коллективные).']
      ];
      c.S = { pos: [] };
      items.forEach(function (it, i) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / 5, x = 5.4 * Math.cos(a), z = 5.4 * Math.sin(a);
        c.S.pos.push([x, z]);
        var ped = c.mesh(new T.CylinderGeometry(1.0, 1.1, 0.35, 32), it[1], it[2]); ped.position.set(x, 0.18, z);
        c.link([0, 0.1, 0], [x, 0.1, z], C.GREY, 0.04, it[2]);
        var g = K.group(c, x, 0.35, z);
        if (i === 0) { g.add(c.box3(1.1, 0.28, 0.8, C.RED, [0, 0.15, 0], it[2])); g.add(c.box3(1.0, 0.06, 0.72, C.PAPER, [0, 0.32, 0], it[2])); }
        if (i === 1) { [[0.75, C.RED], [0.5, C.PAPER], [0.25, C.RED]].forEach(function (r, k) { var d = c.mesh(new T.CylinderGeometry(r[0], r[0], 0.08, 32), r[1], it[2]); d.rotation.x = Math.PI / 2; d.position.set(0, 0.85, k * 0.05); g.add(d); }); g.add(c.link([0, 0, 0], [0, 0.85, -0.05], C.WOOD, 0.05, it[2])); }
        if (i === 2) { g.add(c.box3(0.5, 0.5, 0.5, C.SILVER, [-0.45, 0.25, 0], it[2])); var w = c.mesh(new T.ConeGeometry(0.25, 0.7, 10), C.TEA, it[2]); w.position.set(0.1, 0.35, 0.2); g.add(w); g.add(c.box3(0.6, 0.3, 0.35, C.ORANGE, [0.5, 0.15, -0.3], it[2])); }
        if (i === 3) { stack(c, -0.3, 0, 5, it[2], g, C.BLUE, 0.3); stack(c, 0.35, 0, 3, it[2], g, C.GOLD, 0.3); }
        if (i === 4) { house(c, -0.25, 0, C.CREAM, it[2], g, 0.6); K.flag(c, 0.45, 0, it[2], g, 1.3).scale.set(0.6, 1, 0.6); }
        c.label((i + 1) + '. ' + it[0], [x, 2.3, z], 0.24);
      });
      c.S.items = items;
    },
    chips: [0, 1, 2, 3, 4].map(function (i) {
      return { t: ['ГК РФ', 'Цель', 'Деятельность', 'Капитал', 'Собственность'][i], on: function (c) { var p = c.S.pos[i]; c.setView(Math.atan2(p[0], p[1]), 0.95, 8, 1, p[0], p[1]); c.say(c.S.items[i][2]); } };
    }).concat([{ t: 'Все пять', on: function (c) { c.setView(0.3, 0.95, 15, 1, 0, 0); c.say('Одну фирму можно описать сразу по пяти признакам, например: <b>коммерческая</b>, цель — прибыль, <b>промышленная</b>, с <b>иностранным</b> капиталом, <b>частная</b>.'); } }])
  });

  /* ======================= 2. ГК РФ, статья 50 ======================= */
  reg('fi-gk3d', {
    title: 'Статья 50 ГК РФ: два лагеря', lead: 'Слева — коммерческие организации (цель — прибыль), справа — некоммерческие. Над каждым лагерем — его цель.',
    radius: 13.5, phi: 0.9, theta: 0, targetY: 0.8, height: 430, hint: 'Нажми на блок — узнаешь, что это за форма.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      c.box3(6.4, 0.2, 6.2, '#4a4430', [-3.4, 0.1, 0], 'Лагерь <b>коммерческих</b> организаций: их главная цель — получение прибыли.');
      c.box3(6.4, 0.2, 6.2, '#2f4a3b', [3.4, 0.1, 0], 'Лагерь <b>некоммерческих</b> организаций: прибыль — не цель, они удовлетворяют общие потребности своих членов.');
      var L = [
        ['Товарищества', 'Хозяйственные <b>товарищества</b>: полное и товарищество на вере (коммандитное).'],
        ['Общества\nООО, АО', 'Хозяйственные <b>общества</b>: общество с ограниченной ответственностью и акционерное общество.'],
        ['Хоз.\nпартнёрства', '<b>Хозяйственные партнёрства</b> — тоже коммерческая форма по ст. 50.'],
        ['Производств.\nкооперативы', '<b>Производственные кооперативы</b> (артели): члены вместе работают и делят доход.'],
        ['ГУП / МУП', '<b>Государственные и муниципальные унитарные предприятия.</b> Имущество им не принадлежит.'],
        ['Крестьянские\n(фермерские)', '<b>[ДОБАВЛЕНО]</b> Крестьянские (фермерские) хозяйства — их ст. 50 тоже называет среди коммерческих.']
      ];
      var R = [
        ['ЖСК', '<b>Жилищно-строительный кооператив (ЖСК)</b>: люди объединяются, чтобы построить дом и получить в нём квартиры.'],
        ['Гаражные', '<b>Гаражные кооперативы</b> — для общих гаражей.'],
        ['Взаимного\nстрахования', '<b>Общества взаимного страхования</b>: члены страхуют друг друга из общих взносов.'],
        ['Кредитные', '<b>[ДОБАВЛЕНО]</b> Кредитные кооперативы: члены дают займы друг другу.'],
        ['Фонды\nпроката', '<b>Фонды проката</b> — объединения, которые дают вещи напрокат. Лектор: сегодня это называют <b>шеринговой экономикой</b>.'],
        ['С/х потреб.\nкооперативы', '<b>Сельскохозяйственные потребительские кооперативы.</b> Пример лектора из СССР: сдаёшь в кооператив яйца или молоко — получаешь право купить дефицитный товар.']
      ];
      c.S = { L: [], R: [] };
      function blocks(arr, x0, col, store) {
        arr.forEach(function (it, i) {
          var x = x0 + (i % 2) * 2.8 - 1.4, z = -1.9 + Math.floor(i / 2) * 1.9;
          var b = c.box3(2.2, 0.6, 1.2, col, [x, 0.5, z], it[1]); store.push(b);
          c.label(it[0], [x, 1.45, z], 0.2);
        });
      }
      blocks(L, -3.4, C.GOLD, c.S.L);
      blocks(R, 3.4, C.TEA, c.S.R);
      var g1 = coin(c, -3.4, 4.6, 0, '<b>Цель коммерческой организации — прибыль.</b>', null, 0.75); g1.rotation.x = Math.PI / 2;
      c.label('цель — прибыль', [-3.4, 5.7, 0], 0.26, '#f0c36b');
      var hp = K.group(c, 3.4, 3.8, 0);
      [-0.7, 0, 0.7].forEach(function (x, i) { person(c, x, 0, [C.BLUE, C.PURPLE, C.RED][i], '<b>Цель некоммерческой организации</b> — общие, социальные потребности её членов.', hp, 0.8); });
      c.label('цель — общие нужды', [3.4, 5.7, 0], 0.26, '#7fb069');
      c.label('Коммерческие', [-3.4, 0.6, 3.6], 0.3, '#f0c36b'); c.label('Некоммерческие', [3.4, 0.6, 3.6], 0.3, '#7fb069');
      c.onFrame(function (t) { g1.rotation.z = t; });
    },
    chips: [
      { t: 'Коммерческие', on: function (c) { c.setView(0, 0.85, 10, 1, -3.4, 0); c.say('<b>Коммерческие</b> (ст. 50, п. 2): хозяйственные товарищества и общества, хозяйственные партнёрства, производственные кооперативы, ГУП и МУП.'); } },
      { t: 'Некоммерческие', on: function (c) { c.setView(0, 0.85, 10, 1, 3.4, 0); c.say('<b>Некоммерческие</b>: прежде всего потребительские кооперативы: ЖСК, гаражные, общества взаимного страхования, фонды проката, сельскохозяйственные потребительские.'); } },
      { t: 'Фонд проката', on: function (c) { c.setView(0.2, 0.8, 6, 0.8, 2.0, 1.9); c.pick(c.S.R[4]); } },
      { t: 'Обе стороны', on: function (c) { c.setView(0, 0.9, 15, 0.8, 0, 0); c.say('Главный водораздел — <b>цель</b>: прибыль или общие нужды.'); } }
    ]
  });

  /* ======================= 3. Правило 50 % ======================= */
  reg('fi-sector3d', {
    autorotate: false,
    title: 'Правило 50 %: промышленность или сельское хозяйство?', lead: 'У агрофирмы есть и поля, и цех. К какой отрасли её отнести, решает то, чего она выпускает больше половины.',
    radius: 13, phi: 1.05, theta: 0.25, targetY: 1.6, height: 400, hint: 'Выбери долю кнопкой — столбик покажет, куда отнесут фирму.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var f = factory(c, -4, -1.5, C.STONE, '<b>Цех</b> — промышленная часть фирмы.', null, 0.8); K.smoke(c, f, 3);
      for (var i = 0; i < 6; i++) for (var j = 0; j < 3; j++) { var w = c.mesh(new T.ConeGeometry(0.18, 0.7, 8), C.TEA, '<b>Поле</b> — сельскохозяйственная часть фирмы.'); w.position.set(-5.2 + i * 0.45, 0.35, 1.2 + j * 0.5); }
      c.label('цех', [-4, 3.4, -1.5], 0.24); c.label('поле', [-4, 1.3, 2.9], 0.24);
      var iB = '<b>Промышленная продукция</b> (синий цвет).', iG = '<b>Сельскохозяйственная продукция</b> (зелёный цвет).';
      var H = 5;
      var blue = c.mesh(new T.CylinderGeometry(0.9, 0.9, 1, 32), C.BLUE, iB), green = c.mesh(new T.CylinderGeometry(0.9, 0.9, 1, 32), C.GREEN, iG);
      blue.position.x = green.position.x = 2.2;
      var ring = c.mesh(new T.TorusGeometry(1.05, 0.05, 8, 40), C.GOLD, 'Отметка <b>50 %</b> — граница, по которой решают, к какой отрасли отнести фирму.');
      ring.rotation.x = Math.PI / 2; ring.position.set(2.2, H / 2, 0);
      c.label('50 %', [3.7, H / 2, 0], 0.24, '#f0c36b');
      var lb = c.label('промышленная', [2.2, H + 0.9, 0], 0.28, '#5b8def'), lg = c.label('сельскохозяйственная', [2.2, H + 0.9, 0], 0.28, '#4cc38a');
      c.S = { k: 0.7, cur: 0.7 };
      c.onFrame(function () {
        c.S.cur = K.lerp(c.S.cur, c.S.k, 0.06);
        var hb = Math.max(0.01, H * c.S.cur), hg = Math.max(0.01, H - hb);
        blue.scale.y = hb; blue.position.y = hb / 2; green.scale.y = hg; green.position.y = hb + hg / 2;
        lb.visible = c.S.cur > 0.5; lg.visible = !lb.visible;
      });
    },
    chips: [
      { t: '70 % — цех', on: function (c) { c.S.k = 0.7; c.say('Цех даёт <b>70 %</b> продукции → фирму относят к <b>промышленности</b>, хотя у неё есть поля.'); } },
      { t: '30 % — цех', on: function (c) { c.S.k = 0.3; c.say('Поле даёт <b>70 %</b> продукции → фирма <b>сельскохозяйственная</b>, хотя у неё есть цех.'); } },
      { t: 'Почему 50 %', on: function (c) { c.S.k = 0.52; c.say('Критерий лектора: если <b>больше 50 %</b> продукции относится к одной отрасли, туда фирму и относят. Так же определяют транспортные, строительные и другие фирмы.'); } }
    ]
  });

  /* ======================= 4. Чей капитал ======================= */
  reg('fi-capital3d', {
    title: 'Национальные, иностранные и совместные фирмы', lead: 'Монеты перед фирмой — её капитал. Синие — отечественные, золотые — иностранные.',
    radius: 12, phi: 1.0, theta: 0.2, targetY: 1.2, height: 380, hint: 'Нажми на фирму или стопку монет.',
    build: function (c) {
      c.ground(8.5);
      var D = [
        [-4.5, 'Национальная', '<b>Национальная фирма</b>: весь капитал отечественный. Пример лектора — «Роскосмос».', [C.BLUE, C.BLUE, C.BLUE, C.BLUE, C.BLUE, C.BLUE]],
        [0, 'Иностранная', '<b>Иностранная фирма</b>: капитал из-за рубежа. Лектор: сейчас иностранных инвестиций в России мало.', [C.GOLD, C.GOLD, C.GOLD, C.GOLD, C.GOLD, C.GOLD]],
        [4.5, 'Совместная', '<b>Совместное предприятие</b>: капитал смешанный, часть отечественная, часть иностранная.', [C.BLUE, C.GOLD, C.BLUE, C.GOLD, C.BLUE, C.GOLD]]
      ];
      c.S = { x: [] };
      D.forEach(function (d) {
        c.S.x.push(d[0]);
        factory(c, d[0], -1.2, C.STONE, d[2], null, 0.75);
        d[3].forEach(function (col, i) { coin(c, d[0], 0.06 + i * 0.11, 1.4, d[2], null, 0.45, col); });
        c.label(d[1], [d[0], 3.2, -1.2], 0.26);
      });
      c.S.D = D;
      c.label('капитал — всё, что приносит доход', [0, 4.4, -1.2], 0.22, '#8b93b5');
    },
    chips: [0, 1, 2].map(function (i) { return { t: ['Национальная', 'Иностранная', 'Совместная'][i], on: function (c) { c.setView(0.15, 1.0, 7.5, 1, c.S.x[i], 0); c.say(c.S.D[i][2]); } }; })
  });

  /* ======================= 5. Формы собственности ======================= */
  reg('fi-property3d', {
    title: 'Кому принадлежит фирма', lead: 'Четыре формы собственности, которые назвала лектор: государственная, муниципальная, частная и смешанная.',
    radius: 13, phi: 1.0, theta: 0.15, targetY: 1.2, height: 390, hint: 'Нажми на здание.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Государственная собственность</b>: владелец — государство (Российская Федерация или субъект РФ).',
        iM = '<b>Муниципальная собственность</b>: владелец — город или район (муниципалитет).',
        iP = '<b>Частная собственность</b>: владелец — частное лицо или частная компания.',
        iX = '<b>Смешанная (коллективная) собственность</b>: часть принадлежит государству, часть — частным владельцам; или фирма принадлежит коллективу.';
      var s = K.group(c, -5, 0, -0.5);
      s.add(c.box3(2.0, 1.6, 1.4, C.STONE, [0, 0.8, 0], iS));
      for (var i = 0; i < 4; i++) { var col = c.mesh(new T.CylinderGeometry(0.1, 0.1, 1.5, 10), C.WHITE, iS); col.position.set(-0.75 + i * 0.5, 0.75, 0.8); s.add(col); }
      var ped = c.mesh(new T.CylinderGeometry(0.01, 1.3, 0.5, 4), C.STONE, iS); ped.rotation.y = Math.PI / 4; ped.scale.set(1.1, 1, 0.8); ped.position.set(0, 1.85, 0); s.add(ped);
      K.flag(c, 0, 0, iS, s, 3.2);
      var m = K.group(c, -1.7, 0, -0.5);
      m.add(c.box3(1.6, 1.2, 1.2, C.CREAM, [0, 0.6, 0], iM));
      var tw = c.box3(0.5, 0.9, 0.5, C.CREAM, [0, 1.65, 0], iM); m.add(tw);
      var clock = c.mesh(new T.CylinderGeometry(0.18, 0.18, 0.04, 20), C.GOLD, iM); clock.rotation.x = Math.PI / 2; clock.position.set(0, 1.75, 0.27); m.add(clock);
      var p = K.group(c, 1.7, 0, -0.5); house(c, 0, 0, C.CREAM, iP, p, 1.1); person(c, 1.0, 0.8, C.BLUE, iP, p, 0.9);
      var x = K.group(c, 5, 0, -0.5);
      x.add(c.box3(0.9, 1.3, 1.2, C.STONE, [-0.45, 0.65, 0], iX)); x.add(c.box3(0.9, 1.3, 1.2, C.CREAM, [0.45, 0.65, 0], iX));
      K.flag(c, -0.6, 0, iX, x, 2.2).scale.set(0.7, 1, 0.7); person(c, 0.9, 0.9, C.PURPLE, iX, x, 0.8); person(c, 0.3, 1.1, C.GREEN, iX, x, 0.8);
      [['Государственная', -5], ['Муниципальная', -1.7], ['Частная', 1.7], ['Смешанная', 5]].forEach(function (l) { c.label(l[0], [l[1], 3.9, -0.5], 0.22); });
      c.S = { info: [iS, iM, iP, iX], x: [-5, -1.7, 1.7, 5] };
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Государственная', 'Муниципальная', 'Частная', 'Смешанная'][i], on: function (c) { c.setView(0.1, 1.0, 7, 1.2, c.S.x[i], 0); c.say(c.S.info[i]); } }; })
  });

  /* ======================= 6. Единоличная фирма ======================= */
  reg('fi-sole3d', {
    autorotate: false,
    title: 'Единоличная фирма: один человек — за всё', lead: 'Хозяин лавки — и собственник, и предприниматель. Ему достаётся весь доход. Но если фирма разорится, кредиторы заберут и лавку, и его дом.',
    radius: 14, phi: 1.0, theta: 0.35, targetY: 1.2, height: 420, hint: 'Нажми «Весь доход» или «Разорение».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iShop = '<b>Лавка</b> — вся фирма принадлежит одному человеку.';
      var shop = K.group(c, 0, 0, -1.5);
      shop.add(c.box3(2.6, 1.5, 1.6, C.CREAM, [0, 0.75, 0], iShop));
      var aw = c.box3(2.8, 0.1, 0.8, C.RED, [0, 1.45, 1.1], iShop); aw.rotation.x = 0.35; shop.add(aw);
      shop.add(c.box3(1.2, 0.6, 0.04, '#9fd3ff', [-0.5, 0.75, 0.81], iShop));
      c.label('лавка (фирма)', [0, 3.1, -1.5], 0.24);
      var iO = '<b>Собственник и предприниматель — одно лицо.</b> Он владеет всем имуществом, ведёт дело в своих интересах и сам за всё отвечает.';
      var owner = person(c, 0, 1.3, C.BLUE, iO, null, 1.15);
      var crown = c.mesh(new T.CylinderGeometry(0.2, 0.26, 0.2, 6), C.GOLD, iO, { emissive: C.GOLD, emissiveIntensity: 0.3 }); crown.position.y = 1.45; owner.add(crown);
      c.label('собственник =\nпредприниматель', [0, 2.25, 1.3], 0.2, '#f0c36b');
      var iH = '<b>Личное имущество</b> хозяина: дом, машина, сбережения. При неограниченной ответственности оно тоже под ударом.';
      var h = house(c, -4.2, 1.2, C.CREAM, iH, null, 1.2);
      c.label('его дом', [-4.2, 2.4, 1.2], 0.22);
      var coins = stack(c, 1.6, 1.6, 1, '<b>Весь доход</b> фирмы достаётся собственнику.');
      var flying = []; for (var i = 0; i < 4; i++) { var cc = coin(c, 0, 1, -0.5, '<b>Доход</b> лавки идёт хозяину.', null, 0.3); cc.visible = false; flying.push(cc); }
      var cred = []; for (var j = 0; j < 3; j++) { var p = person(c, 5.2, -1.5 + j * 1.5, C.RED, '<b>Кредиторы</b> — те, кому фирма должна. Они забирают имущество в счёт долга.', null, 1); p.visible = false; cred.push(p); }
      var credL = c.label('кредиторы', [5.2, 2.2, 0], 0.24, '#e0645a'); credL.visible = false;
      c.S = { mode: 'none', n: 1 };
      c.onFrame(function (t) {
        var S = c.S;
        flying.forEach(function (m, i) {
          m.visible = S.mode === 'income';
          var k = (t * 0.5 + i / 4) % 1; m.position.set(K.lerp(0, 1.6, k), 1.6 + Math.sin(k * Math.PI) * 1.2, K.lerp(-0.5, 1.6, k));
        });
        if (S.mode === 'income' && coins.length < 9 && Math.random() < 0.03) coins.push(coin(c, 1.6, 0.06 + coins.length * 0.11, 1.6, '<b>Весь доход</b> фирмы достаётся собственнику.'));
        var bust = S.mode === 'bust';
        cred.forEach(function (p) { p.visible = bust; }); credL.visible = bust;
        h.position.x = K.lerp(h.position.x, bust ? 3.6 : -4.2, 0.03); h.position.z = K.lerp(h.position.z, bust ? 2.6 : 1.2, 0.03);
        shop.position.x = K.lerp(shop.position.x, bust ? 2.2 : 0, 0.03);
        coins.forEach(function (m) { m.visible = !bust; });
      });
    },
    chips: [
      { t: 'Весь доход', on: function (c) { c.S.mode = 'income'; c.setView(0.35, 1.0, 11, 1.2, 0.5, 0.5); c.say('Собственник получает <b>весь доход</b>: всё, что остаётся после расчётов, — его. Отсюда <b>сильная мотивация</b>.'); } },
      { t: 'Разорение', on: function (c) { c.S.mode = 'bust'; c.setView(0.6, 1.0, 14, 1.2, 0.5, 0.5); c.say('<b>Неограниченная ответственность:</b> если фирма разорилась, хозяин теряет не только вложенный капитал, но и <b>личное имущество</b>. Кредиторы забирают и лавку, и дом.'); } },
      { t: 'Сначала', on: function (c) { c.S.mode = 'none'; c.setView(0.35, 1.0, 14, 1.2, 0, 0); c.say('Единоличная фирма — <b>старейшая</b> форма: собственник и предприниматель — одно лицо.'); } }
    ]
  });

  /* ======================= 7. Кредит под залог ======================= */
  reg('fi-credit3d', {
    autorotate: false,
    title: 'Почему единоличнику трудно взять кредит', lead: 'Банк даёт деньги только под залог (обычно дом) или под поручительство. Если долг не вернуть, банк продаст залог.',
    radius: 12.5, phi: 1.0, theta: 0.25, targetY: 1.3, height: 420, hint: 'Пройди по кнопкам по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iB = '<b>Банк.</b> Просто так кредит не дают: нужен залог или поручитель.';
      var bank = K.group(c, 4, 0, -1.5);
      bank.add(c.box3(2.6, 0.25, 1.8, C.STONE, [0, 0.12, 0], iB)); bank.add(c.box3(2.6, 0.3, 1.8, C.STONE, [0, 2.0, 0], iB));
      for (var i = 0; i < 4; i++) { var col = c.mesh(new T.CylinderGeometry(0.13, 0.13, 1.6, 12), C.WHITE, iB); col.position.set(-0.95 + i * 0.63, 1.05, 0.7); bank.add(col); }
      var roof = c.mesh(new T.CylinderGeometry(0.01, 1.6, 0.6, 4), C.STONE, iB); roof.rotation.y = Math.PI / 4; roof.scale.set(1.15, 1, 0.8); roof.position.set(0, 2.45, 0); bank.add(roof);
      c.label('банк', [4, 3.4, -1.5], 0.26);
      var iE = '<b>Предприниматель</b> хочет расширить фирму, но своих денег мало — это первый недостаток единоличной фирмы.';
      person(c, -2.5, 1.2, C.BLUE, iE, null, 1.1);
      c.label('предприниматель', [-2.5, 2.1, 1.2], 0.2, '#5b8def');
      var iH = '<b>Залог</b> — имущество, которое банк заберёт и продаст, если долг не вернут. Его стоимость должна соответствовать сумме кредита.';
      var h = house(c, -4.3, -1.2, C.CREAM, iH, null, 1.2);
      c.label('залог', [-4.3, 2.3, -1.2], 0.24, '#f0c36b');
      var money = K.group(c, 4, 0, 0);
      for (var j = 0; j < 4; j++) money.add(c.box3(1.0, 0.06, 0.5, C.GREEN, [0, 0.4 + j * 0.08, 0], '<b>Кредит</b> — деньги банка, которые надо вернуть с процентами.'));
      var iG = '<b>Поручитель</b> обещает заплатить, если заёмщик не сможет. Лектор: «Категорически не рекомендую становиться поручителем» — разве что за самых близких.';
      var gp = person(c, -0.8, 3.2, C.PURPLE, iG, null, 1.0), gh = house(c, -2.6, 4.2, C.CREAM, iG, null, 0.9);
      c.label('поручитель', [-0.8, 2.1, 3.2], 0.22, '#a78bfa');
      var linkH = c.link([-4.3, 0.6, -1.2], [4, 0.6, -1.2], C.GOLD, 0.03, iH); linkH.visible = false;
      var warn = K.glow(c, C.RED, 0.25, iG); warn.position.set(-2.6, 2.2, 4.2); warn.visible = false;
      c.S = { step: 0 };
      c.onFrame(function (t) {
        var s = c.S.step;
        money.position.x = K.lerp(money.position.x, s >= 1 ? -1.4 : 4, 0.04);
        linkH.visible = s >= 1;
        h.position.x = K.lerp(h.position.x, s === 2 ? 2.4 : -4.3, 0.03);
        warn.visible = s === 3; warn.position.y = 2.2 + 0.15 * Math.sin(t * 4);
        gh.position.x = K.lerp(gh.position.x, s === 3 ? 1.6 : -2.6, 0.03);
      });
    },
    chips: [
      { t: '1. Кредит под залог', on: function (c) { c.S.step = 1; c.say('Банк дал деньги, а дом стал <b>залогом</b>. Стоимость залога должна соответствовать сумме кредита.'); } },
      { t: '2. Не вернул', on: function (c) { c.S.step = 2; c.say('Заёмщик не справился с обязательствами → банк <b>реализует залог</b> и засчитывает его в счёт долга.'); } },
      { t: '3. Поручитель', on: function (c) { c.S.step = 3; c.say('Вместо залога бывает <b>поручительство</b>. Если заёмщик не платит, <b>все его обязательства падают на поручителя</b> — вплоть до его дома.'); } },
      { t: 'Сначала', on: function (c) { c.S.step = 0; c.say('Своих денег мало, а взять кредит без залога нельзя — отсюда <b>ограниченность материальных и финансовых ресурсов</b>.'); } }
    ]
  });

  /* ======================= 8. Полное товарищество и товарищество на вере ======================= */
  reg('fi-partners3d', {
    autorotate: false,
    title: 'Полное товарищество и товарищество на вере', lead: 'Слева — полные товарищи: каждый отвечает всем своим имуществом. Справа к полным товарищам добавились вкладчики-коммандитисты: они рискуют только вкладом.',
    radius: 15, phi: 0.95, theta: 0, targetY: 1, height: 430, hint: 'Нажми «Банкротство» и сравни, что теряет каждый.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>Полный товарищ</b> (лектор называет их ещё <b>комплементариями</b>): при разорении отвечает <b>всем личным имуществом</b> — неограниченная ответственность.';
      var iK = '<b>Вкладчик (коммандитист):</b> рискует только своим <b>вкладом</b>. Личное имущество остаётся неприкосновенным.';
      c.box3(6.2, 0.15, 5.6, '#3d3a52', [-3.4, 0.08, 0], '<b>Полное товарищество</b> (ст. 69 ГК РФ): все участники — полные товарищи.');
      c.box3(6.2, 0.15, 5.6, '#2f4a3b', [3.4, 0.08, 0], '<b>Товарищество на вере</b>, или коммандитное (ст. 82 ГК РФ): полные товарищи + вкладчики-коммандитисты.');
      var lost = [], kept = [], vk = [];
      [-5, -3.4, -1.8].forEach(function (x) { person(c, x, 0.9, C.BLUE, iF, null, 0.95); lost.push(house(c, x, -1.4, C.CREAM, iF, null, 0.8)); });
      [1.6, 3.0].forEach(function (x) { person(c, x, 0.9, C.BLUE, iF, null, 0.95); lost.push(house(c, x, -1.4, C.CREAM, iF, null, 0.8)); });
      [4.4, 5.6].forEach(function (x, i) {
        person(c, x, 1.6, C.PURPLE, iK, null, 0.95); kept.push(house(c, x, -1.4, C.CREAM, iK, null, 0.8));
        vk.push(coin(c, x, 0.3, 2.6, '<b>Вклад коммандитиста</b> — только им он и рискует.', null, 0.35));
      });
      c.label('Полное (ст. 69)', [-3.4, 3.0, 0], 0.26); c.label('На вере (ст. 82)', [3.4, 3.0, 0], 0.26);
      c.label('полные товарищи', [2.3, 2.1, 0.9], 0.18, '#5b8def'); c.label('вкладчики', [5.0, 2.1, 1.9], 0.18, '#a78bfa');
      var shields = kept.map(function (h) { var s = c.mesh(new T.TorusGeometry(0.85, 0.05, 8, 32), C.GREEN, iK, { emissive: C.GREEN, emissiveIntensity: 0.6 }); s.rotation.x = Math.PI / 2; s.position.set(h.position.x, 0.2, h.position.z); s.visible = false; return s; });
      c.S = { bust: false };
      c.onFrame(function () {
        var b = c.S.bust;
        lost.forEach(function (h) { h.position.y = K.lerp(h.position.y, b ? -1.4 : 0, 0.04); });
        vk.forEach(function (m) { m.scale.setScalar(K.lerp(m.scale.x, b ? 0.01 : 1, 0.06)); });
        shields.forEach(function (s) { s.visible = b; });
      });
    },
    chips: [
      { t: 'Полное', on: function (c) { c.S.bust = false; c.setView(0, 0.9, 9, 1, -3.4, 0); c.say('<b>Полное товарищество</b> (ст. 69 ГК РФ): все участники несут ответственность целиком, полностью — <b>всем имуществом</b>.'); } },
      { t: 'На вере', on: function (c) { c.S.bust = false; c.setView(0, 0.9, 9, 1, 3.4, 0); c.say('<b>Товарищество на вере</b> (ст. 82 ГК РФ) сочетает два типа участников: <b>полные товарищи</b> отвечают всем имуществом, <b>вкладчики-коммандитисты</b> — только вкладом.'); } },
      { t: 'Банкротство', on: function (c) { c.S.bust = true; c.setView(0, 0.95, 15, 1, 0, 0); c.say('Фирма разорилась: дома <b>полных товарищей</b> уходят в счёт долгов. <b>Вкладчики</b> потеряли только монету-вклад — их дома под зелёной защитой.'); } },
      { t: 'Сначала', on: function (c) { c.S.bust = false; c.setView(0, 0.95, 15, 1, 0, 0); c.say('Сравни, кто чем рискует.'); } }
    ]
  });

  /* ======================= 9. Партнёры и культура ======================= */
  reg('fi-aksakal3d', {
    autorotate: false,
    title: 'Почему партнёрства распадаются', lead: 'Четыре партнёра тянут общий камень — фирму. Если все слушают старшего («аксакала»), камень едет. Если каждый тянет в свою сторону, он стоит на месте.',
    radius: 11, phi: 0.85, theta: 0.4, targetY: 0.6, height: 400, hint: 'Переключай режимы кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Общее дело</b> партнёрства. Лектор: успех зависит от того, умеют ли партнёры договариваться.';
      var stone = c.mesh(new T.DodecahedronGeometry(0.9, 0), C.STONE, iS); stone.position.y = 0.9;
      c.S = { mode: 'one', ang: [0, 0, 0, 0] };
      var P = [], R = [];
      for (var i = 0; i < 4; i++) {
        var p = person(c, 0, 0, [C.BLUE, C.RED, C.GREEN, C.PURPLE][i], i === 0 ? '<b>Старший партнёр</b> («аксакал»). Где принято слушать старшего, партнёрство устойчиво.' : '<b>Партнёр.</b> Если у каждого «свобода и воля», согласия нет и дело стоит.', null, 1);
        P.push(p); R.push(c.link([0, 0.7, 0], [1, 0.7, 0], C.WOOD, 0.03));
      }
      c.onFrame(function (t) {
        var one = c.S.mode === 'one';
        stone.position.x = one ? ((t * 0.8) % 9) - 4.5 : Math.sin(t * 7) * 0.08;
        stone.rotation.z = one ? -t * 0.9 : 0;
        P.forEach(function (p, i) {
          var a = one ? (i - 1.5) * 0.35 : i * Math.PI / 2 + 0.4, d = one ? 2.4 : 2.4;
          var px = stone.position.x + Math.cos(a) * d, pz = Math.sin(a) * d;
          if (one) { px = stone.position.x + 2.2 + (i % 2) * 0.6; pz = (i - 1.5) * 0.9; }
          p.position.set(px, 0, pz); p.rotation.z = one ? -0.25 : -0.25 * Math.cos(a);
          var A = new T.Vector3(stone.position.x, 0.9, 0), B = new T.Vector3(px, 0.75, pz), r = R[i];
          r.position.copy(A).add(B).multiplyScalar(0.5); r.scale.y = A.distanceTo(B); r.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
        });
      });
    },
    chips: [
      { t: 'Слушают старшего', on: function (c) { c.S.mode = 'one'; c.say('Лектор: если национальная культура такая, что слово старшего — закон, <b>партнёрство, скорее всего, будет существовать</b>.'); } },
      { t: 'Каждый сам по себе', on: function (c) { c.S.mode = 'many'; c.say('Если у каждого партнёра «свобода и воля в голове», <b>ничего хорошего не получается</b>. Совет лектора: подумайте, прежде чем брать в бизнес друзей и родственников.'); } }
    ]
  });

  /* ======================= 10. Акционерное общество: ответственность ограничена ======================= */
  reg('fi-jsc3d', {
    autorotate: false,
    title: 'Акционерное общество: рискуешь только акциями', lead: 'Пирожковая — акционерное общество. У каждого акционера в руках акция, за спиной — его дом. Нажми «Разорение»: акции сгорят, а дома останутся.',
    radius: 14, phi: 0.95, theta: 0.2, targetY: 1.2, height: 430, hint: 'Нажми «Дивиденды» или «Разорение».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>Акционерное общество</b> — юридическое лицо с уставным капиталом, которое существует <b>независимо от собственников</b>.';
      var f = factory(c, 0, -0.6, C.CREAM, iF, null, 1); K.smoke(c, f, 4);
      c.label('АО «Пирожковая»', [0, 3.6, -0.6], 0.28);
      var iA = '<b>Акционер.</b> Его ответственность ограничена стоимостью принадлежащих ему акций. Конфисковать его личное имущество за долги АО нельзя.';
      var papers = [], homes = [], divs = [];
      [-5, -2.6, 2.6, 5].forEach(function (x, i) {
        var z = i === 0 || i === 3 ? 1.2 : 2.6;
        person(c, x, z, [C.BLUE, C.RED, C.GREEN, C.PURPLE][i], iA, null, 1);
        var p = K.paper(c, x + 0.45, 0.9, z + 0.3, '<b>Акция</b> — ценная бумага: даёт право на часть прибыли (дивиденд) и голос на собрании.', null, C.PAPER, 0.6, 0.42); p.rotation.x = -1.1; papers.push(p);
        homes.push(house(c, x, z - 2.4, C.CREAM, iA, null, 0.75));
        var d = coin(c, 0, 1.5, -0.6, '<b>Дивиденд</b> — часть прибыли, которую распределяют между акционерами.', null, 0.25); d.visible = false; d.userData.to = [x, z]; divs.push(d);
      });
      var shields = homes.map(function (h) { var s = c.mesh(new T.TorusGeometry(0.75, 0.05, 8, 32), C.GREEN, '<b>Личное имущество акционера в безопасности.</b>', { emissive: C.GREEN, emissiveIntensity: 0.6 }); s.rotation.x = Math.PI / 2; s.position.set(h.position.x, 0.15, h.position.z); s.visible = false; return s; });
      c.S = { mode: 'none' };
      c.onFrame(function (t) {
        var m = c.S.mode, bust = m === 'bust';
        f.scale.y = K.lerp(f.scale.y, bust ? 0.25 : 1, 0.04); f.userData.on = !bust;
        papers.forEach(function (p) { p.scale.setScalar(K.lerp(p.scale.x, bust ? 0.01 : 1, 0.06)); });
        shields.forEach(function (s) { s.visible = bust; });
        divs.forEach(function (d, i) {
          d.visible = m === 'div'; var k = (t * 0.45 + i * 0.25) % 1, to = d.userData.to;
          d.position.set(K.lerp(0, to[0], k), 1.5 + Math.sin(k * Math.PI) * 1.5, K.lerp(-0.6, to[1], k));
        });
      });
    },
    chips: [
      { t: 'Дивиденды', on: function (c) { c.S.mode = 'div'; c.say('Часть прибыли АО распределяется в виде <b>дивидендов</b>. Сколько и будут ли вообще — решает <b>общее собрание акционеров</b>. Дивиденд выражают в процентах к номинальной цене акции.'); } },
      { t: 'Разорение', on: function (c) { c.S.mode = 'bust'; c.say('АО разорилось: акционеры теряют <b>только то, что вложили, покупая акции</b>. Больше ничего: конфискация их имущества запрещена.'); } },
      { t: 'Сначала', on: function (c) { c.S.mode = 'none'; c.say('Ограниченная ответственность — главное преимущество АО перед другими формами.'); } }
    ]
  });

  /* ======================= 11. Пакеты акций ======================= */
  reg('fi-stake3d', {
    autorotate: false,
    title: 'Контрольный и блокирующий пакеты', lead: 'Круг — все акции компании. Одна акция — один голос. Выбери пакет: его доля приподнимется над кругом.',
    radius: 12, phi: 0.75, theta: 0.2, targetY: 0.3, height: 400, hint: 'Кнопки поднимают нужную часть «пирога».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var TAU = Math.PI * 2, r = 4;
      var iC = '<b>Контрольный пакет — 50 % + 1 акция.</b> Его владелец проводит решения общего собрания, для которых нужно простое большинство.';
      var iB = '<b>Блокирующий пакет — 25 % + 1 акция.</b> Его владелец может не дать принять решение, для которого нужно больше трёх четвертей голосов.';
      var iS = '<b>Мелкие акционеры.</b> У каждого мало голосов, поэтому функциями контроля они фактически не обладают.';
      var big = K.sector(c, r, 0.6, 0, TAU * 0.505, C.BLUE, iC);
      var blk = K.sector(c, r, 0.6, TAU * 0.505, TAU * 0.76, C.RED, iB);
      var small = [];
      for (var i = 0; i < 8; i++) small.push(K.sector(c, r, 0.6, TAU * (0.76 + i * 0.03), TAU * (0.76 + (i + 1) * 0.03) - 0.01, [C.GREEN, C.TEA][i % 2], iS));
      var lc = c.label('50 % + 1', [1.5, 1.6, -1.8], 0.3, '#5b8def'), lb = c.label('25 % + 1', [-2.6, 1.6, 1.2], 0.3, '#e0645a'), ls = c.label('мелкие', [1.2, 1.6, 2.8], 0.26, '#4cc38a');
      c.S = { up: '' };
      c.onFrame(function () {
        var u = c.S.up;
        big.position.y = K.lerp(big.position.y, u === 'c' ? 1.0 : 0, 0.08);
        blk.position.y = K.lerp(blk.position.y, u === 'b' ? 1.0 : 0, 0.08);
        small.forEach(function (m) { m.position.y = K.lerp(m.position.y, u === 's' ? 1.0 : 0, 0.08); });
      });
      lc.position.set(Math.cos(Math.PI * 0.5) * 2.2 + 1.2, 1.6, -Math.sin(Math.PI * 0.5) * 2.2);
      lb.position.set(Math.cos(TAU * 0.63) * 2.4, 1.6, -Math.sin(TAU * 0.63) * 2.4);
      ls.position.set(Math.cos(TAU * 0.88) * 2.6, 1.6, -Math.sin(TAU * 0.88) * 2.6);
    },
    chips: [
      { t: 'Контрольный', on: function (c) { c.S.up = 'c'; c.say('<b>Контрольный пакет = 50 % + 1 акция.</b> Больше половины голосов — значит, большинство на собрании за тобой.'); } },
      { t: 'Блокирующий', on: function (c) { c.S.up = 'b'; c.say('<b>Блокирующий пакет = 25 % + 1 акция.</b> Его владелец может сказать «это решение не принимаем», и постановление общего собрания не пройдёт. <b>[ДОБАВЛЕНО]</b> Речь о важных решениях, где нужно ¾ голосов (например, изменение устава).'); } },
      { t: 'Мелкие', on: function (c) { c.S.up = 's'; c.say('Мелкие и средние держатели акций <b>функциями контроля не обладают</b>: голосов слишком мало. Это один из недостатков АО.'); } }
    ]
  });

  /* ======================= 12. Номинал и курс ======================= */
  reg('fi-nominal3d', {
    autorotate: false,
    title: 'Номинал акции и её реальная цена', lead: 'На бланке написано «1000 ₽» — это номинал. А столбик справа — цена, по которой акцию реально покупают на бирже. Она скачет.',
    radius: 12, phi: 1.15, theta: 0.3, targetY: 2, height: 400, hint: 'Выбери событие — посмотри, что станет с ценой.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iN = '<b>Номинальная цена</b> — то, что написано на акции. Реальная цена может с ней не совпадать.';
      var cert = K.group(c, -2.4, 0, 0);
      var b = c.box3(2.4, 3.2, 0.06, C.PAPER, [0, 1.8, 0], iN); cert.add(b);
      cert.add(c.box3(2.0, 0.1, 0.07, C.GOLD, [0, 3.0, 0.01], iN)); cert.add(c.box3(2.0, 0.1, 0.07, C.GOLD, [0, 0.6, 0.01], iN));
      var seal = c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.05, 24), C.RED, iN); seal.rotation.x = Math.PI / 2; seal.position.set(0.6, 1.0, 0.05); cert.add(seal);
      c.label('АКЦИЯ\nноминал 1000 ₽', [-2.4, 2.2, 0.3], 0.26, '#f0c36b');
      var iP = '<b>Курс (рыночная цена) акции</b> зависит от капитализации компании, от политической обстановки, от новостей.';
      var col = c.mesh(new T.CylinderGeometry(0.7, 0.7, 1, 32), C.GREEN, iP);
      col.position.x = 1.8;
      var nom = c.mesh(new T.TorusGeometry(0.85, 0.05, 8, 40), C.GOLD, iN); nom.rotation.x = Math.PI / 2; nom.position.set(1.8, 2, 0);
      c.label('номинал', [3.3, 1.7, 0], 0.18, '#f0c36b');
      var lab = c.label('курс', [1.8, 0, 0], 0.26);
      c.S = { p: 1000, cur: 1000 };
      c.onFrame(function () {
        c.S.cur = K.lerp(c.S.cur, c.S.p, 0.05);
        var h = c.S.cur / 500; col.scale.y = h; col.position.y = h / 2; lab.position.y = h + 0.9;
        col.material.color.set(c.S.cur >= 1000 ? C.GREEN : C.RED);
      });
    },
    chips: [
      { t: 'Номинал', on: function (c) { c.S.p = 1000; c.say('Цена совпала с номиналом — <b>1000 ₽</b>. Так бывает далеко не всегда.'); } },
      { t: 'Дела идут хорошо', on: function (c) { c.S.p = 2200; c.say('Компания растёт, её капитализация увеличилась → акцию покупают уже за <b>2200 ₽</b>, хотя на ней написано 1000.'); } },
      { t: '«Трамп сказал…»', on: function (c) { c.S.p = 450; c.say('Пример лектора: политик сказал что-то — и курс упал до <b>450 ₽</b>. С самой компанией при этом ничего не случилось: курс зависит и от <b>политической обстановки</b>.'); } }
    ]
  });

  /* ======================= 13. Пирожковая: деньги быстро ======================= */
  reg('fi-pies3d', {
    autorotate: false,
    title: 'Пирожковая: как АО быстро собирает деньги', lead: 'Пример лектора: студенты основали АО «Пирожковая». Выпустили 1000 акций по номиналу 1000 ₽. Реклама сработала — акции раскупили по 2000 ₽.',
    radius: 14, phi: 1.0, theta: 0.25, targetY: 1.4, height: 430, hint: 'Нажимай кнопки по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>АО «Пирожковая»</b> — пример лектора.';
      var f1 = factory(c, -3.5, -1.5, C.CREAM, iF, null, 0.9); K.smoke(c, f1, 3);
      var iP = '<b>Пирожок</b> — продукция нашего АО.';
      var tray = c.box3(2.2, 0.08, 1.2, C.SILVER, [-3.5, 0.9, 1.3], iP);
      c.box3(0.2, 0.86, 0.2, C.DARK, [-3.5, 0.43, 1.3], iP);
      for (var i = 0; i < 6; i++) { var p = c.mesh(new T.SphereGeometry(0.22, 14, 10), C.POTATO, iP); p.scale.y = 0.55; p.position.set(-4.2 + (i % 3) * 0.7, 1.05, 1.0 + Math.floor(i / 3) * 0.55); }
      var iS = '<b>Пачка акций</b> — 1000 акций номиналом 1000 ₽.';
      var stacks = [];
      for (var j = 0; j < 5; j++) { var g = K.group(c, 0.2 + j * 0.0, 0, 0); for (var k = 0; k < 6; k++) g.add(K.paper(c, 0, 0.05 + k * 0.05, 0, iS, null, C.PAPER, 0.7, 0.5)); g.position.set(-0.6, 0, -1.6 + j * 0.8); stacks.push(g); }
      var buyers = []; for (var b = 0; b < 5; b++) buyers.push(person(c, 4.5, -1.6 + b * 0.8, [C.BLUE, C.RED, C.GREEN, C.PURPLE, C.ORANGE][b], '<b>Покупатели акций.</b> Поверили рекламе и платят выше номинала.', null, 0.9));
      var iK = '<b>Капитал АО.</b> Высота столбика — сколько денег собрано.';
      var bar1 = c.mesh(new T.CylinderGeometry(0.5, 0.5, 1, 24), C.GOLD, iK), bar2 = c.mesh(new T.CylinderGeometry(0.5, 0.5, 1, 24), C.GOLD, iK);
      bar1.position.set(1.8, 0, 2.8); bar2.position.set(3.1, 0, 2.8);
      var l1 = c.label('по номиналу\n1 млн ₽', [1.8, 3.2, 2.8], 0.18), l2 = c.label('продали\n2 млн ₽', [3.1, 5.2, 2.8], 0.18, '#f0c36b');
      var f2 = factory(c, 3.5, -4.2, C.CREAM, '<b>Вторая пирожковая</b> — расширение на деньги от <b>нового выпуска акций</b>.', null, 0.8); f2.visible = false;
      c.S = { step: 0 };
      c.onFrame(function () {
        var s = c.S.step;
        stacks.forEach(function (g, i) { var tx = s >= 2 ? 3.8 : -0.6; g.position.x = K.lerp(g.position.x, tx, 0.04 + i * 0.006); });
        var h1 = s >= 1 ? 2 : 0.01, h2 = s >= 2 ? 4 : 0.01;
        bar1.scale.y = K.lerp(bar1.scale.y, h1, 0.06); bar1.position.y = bar1.scale.y / 2;
        bar2.scale.y = K.lerp(bar2.scale.y, h2, 0.06); bar2.position.y = bar2.scale.y / 2;
        l1.visible = s >= 1; l2.visible = s >= 2; f2.visible = s >= 3;
      });
    },
    chips: [
      { t: '1. Выпуск', on: function (c) { c.S.step = 1; c.say('Выпустили <b>1000 акций</b>, на каждой написали <b>1000 ₽</b>. По номиналу это 1 млн ₽.'); } },
      { t: '2. Продажа', on: function (c) { c.S.step = 2; c.say('Реклама обещала хороший доход → акции купили по <b>2000 ₽</b>. Собрали <b>2 млн ₽</b> — вдвое больше номинала. <b>Средства привлекаются быстро.</b>'); } },
      { t: '3. Расширение', on: function (c) { c.S.step = 3; c.setView(0.4, 1.0, 15, 1.4, 0, -1); c.say('Дела пошли хорошо — решили расширяться. Деньги взяли от <b>нового выпуска акций</b>: раз компания уже себя показала, они тоже продадутся выше номинала.'); } },
      { t: 'Сначала', on: function (c) { c.S.step = 0; c.setView(0.25, 1.0, 14, 1.4, 0, 0); c.say('Начнём с пустой кассы.'); } }
    ]
  });

  /* ======================= 14. Устойчивость АО ======================= */
  reg('fi-stable3d', {
    autorotate: false,
    title: 'Акционеры меняются — компания работает', lead: 'Вокруг фабрики — акционеры. Один продаёт свои акции и уходит, на его место приходит новый. Дым из трубы не прекращается.',
    radius: 11.5, phi: 0.9, theta: 0.3, targetY: 1, height: 400, hint: 'Нажми «Продать акции».',
    build: function (c) {
      c.ground(8.5);
      var f = factory(c, 0, 0, C.CREAM, '<b>АО существует независимо от акционеров.</b> Кто бы ни владел акциями, компания продолжает работать.', null, 1); K.smoke(c, f, 4);
      var iA = '<b>Акционер</b> может продать свои акции другому человеку, но не может забрать свою долю имущества и закрыть компанию.';
      var ring = [];
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 + 0.3; ring.push(person(c, Math.cos(a) * 3.6, Math.sin(a) * 3.6, [C.BLUE, C.RED, C.GREEN, C.PURPLE, C.ORANGE, C.TEA][i], iA, null, 0.95)); }
      var newbie = person(c, 8, 0, C.GOLD, '<b>Новый акционер</b> купил акции — для компании ничего не изменилось.', null, 0.95);
      var leaving = ring[0], home = [leaving.position.x, leaving.position.z];
      c.S = { sold: false };
      c.onFrame(function () {
        var s = c.S.sold;
        leaving.position.x = K.lerp(leaving.position.x, s ? 8 : home[0], 0.03); leaving.position.z = K.lerp(leaving.position.z, s ? -3 : home[1], 0.03);
        newbie.position.x = K.lerp(newbie.position.x, s ? home[0] : 8, 0.03); newbie.position.z = K.lerp(newbie.position.z, s ? home[1] : 3, 0.03);
      });
    },
    chips: [
      { t: 'Продать акции', on: function (c) { c.S.sold = true; c.say('Акционер продал акции и ушёл, пришёл новый. <b>Устойчивость АО:</b> компания работает независимо от того, кто её акционеры.'); } },
      { t: 'Вернуть', on: function (c) { c.S.sold = false; c.say('Лектор: «Это не значит, что все мы будем любить пирожки и стоять у печи». Акционер — владелец, а не обязательно работник.'); } }
    ]
  });

  /* ======================= 15. Угроза от менеджеров ======================= */
  reg('fi-managers3d', {
    autorotate: false,
    title: 'Недостаток АО: менеджеры и «перелив» капитала', lead: 'Бак слева — капитал нашей пирожковой. Менеджер у крана может «перелить» его в дочернюю компанию. Мелкие акционеры с маленькими флажками-голосами помешать не могут.',
    radius: 14, phi: 1.0, theta: 0.3, targetY: 1.6, height: 430, hint: 'Нажми «Перелить капитал».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iM = '<b>Капитал АО «Пирожковая»</b>.', iD = '<b>Дочерняя компания</b>, куда высшие менеджеры могут вывести капитал в своих интересах.';
      function tank(x, info) {
        var g = c.mesh(new T.CylinderGeometry(1.2, 1.2, 3.2, 32, 1, true), '#9fd3ff', info, { transparent: true, opacity: 0.25, side: T.DoubleSide }); g.position.set(x, 1.6, 0);
        var liq = c.mesh(new T.CylinderGeometry(1.12, 1.12, 1, 32), C.GOLD, info, { emissive: C.GOLD, emissiveIntensity: 0.2 }); liq.position.x = x;
        return liq;
      }
      var L1 = tank(-3.2, iM), L2 = tank(3.2, iD);
      c.label('наше АО', [-3.2, 3.9, 0], 0.26); c.label('«дочка»', [3.2, 3.9, 0], 0.26);
      c.link([-2.0, 0.5, 0], [2.0, 0.5, 0], C.SILVER, 0.12, '<b>Труба</b> — сделки, через которые капитал уходит в другую компанию.');
      var valve = c.mesh(new T.TorusGeometry(0.35, 0.07, 8, 24), C.RED, '<b>Кран</b> в руках менеджеров.'); valve.position.set(0, 1.0, 0);
      c.link([0, 0.5, 0], [0, 1.0, 0], C.SILVER, 0.06);
      var iMg = '<b>Высший менеджер.</b> Лектор: менеджеры могут действовать из собственных интересов, а не ради компании.';
      person(c, 0.9, 0.3, C.DARK, iMg, null, 1.1);
      var iS = '<b>Мелкий акционер:</b> одна акция — один голос. Его флажок-голос слишком мал, чтобы контролировать менеджеров.';
      var flags = [];
      for (var i = 0; i < 5; i++) { var x = -4 + i * 1.1; person(c, x, 3.4, [C.BLUE, C.RED, C.GREEN, C.PURPLE, C.TEA][i], iS, null, 0.8); flags.push(c.link([x + 0.3, 0.5, 3.4], [x + 0.3, 1.2, 3.4], C.GREY, 0.03, iS)); c.box3(0.3, 0.2, 0.02, C.GOLD, [x + 0.45, 1.1, 3.4], iS); }
      c.S = { pour: false, a: 2.6 };
      c.onFrame(function (t) {
        c.S.a = K.lerp(c.S.a, c.S.pour ? 0.5 : 2.6, 0.02);
        var a = c.S.a, b = 3.1 - a;
        L1.scale.y = a; L1.position.y = a / 2 + 0.02; L2.scale.y = b; L2.position.y = b / 2 + 0.02;
        valve.rotation.y = c.S.pour ? t * 3 : 0;
      });
    },
    chips: [
      { t: 'Перелить капитал', on: function (c) { c.S.pour = true; c.say('Менеджеры «переливают» капитал нашей пирожковой в <b>дочерние компании</b>. Акционеры теряют, а помешать мелкие держатели не могут.'); } },
      { t: 'Вернуть', on: function (c) { c.S.pour = false; c.say('Лектор: человек всегда хочет, чтобы ему было хорошо, и в этом нет ничего плохого. Но <b>средства</b> для этого могут быть разные.'); } }
    ]
  });

  /* ======================= 16. Двойное налогообложение ======================= */
  reg('fi-tax3d', {
    title: 'Двойное налогообложение', lead: 'Монета прибыли идёт от фирмы к акционеру и проходит две налоговые «рамки». Первая — налог на прибыль фирмы. Вторая — налог на дивиденды акционера.',
    radius: 14, phi: 1.05, theta: 0.15, targetY: 1.2, height: 400, autorotate: false, hint: 'Нажми на рамку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var f = factory(c, -5.2, 0, C.CREAM, '<b>АО</b> получило прибыль.', null, 0.75); K.smoke(c, f, 3);
      person(c, 5.4, 0, C.BLUE, '<b>Акционер</b> получает то, что осталось после двух налогов.', null, 1.1);
      var i1 = '<b>Налог 1 — налог на прибыль.</b> Его платит само АО, как все предприятия.';
      var i2 = '<b>Налог 2 — налог на дивиденды.</b> Акционер платит налог с полученного дохода. Если акционер — компания, она платит налог на прибыль с дивидендов.';
      [[-1.8, C.RED, i1, 'налог на прибыль'], [1.8, C.PURPLE, i2, 'налог на дивиденды']].forEach(function (g) {
        c.link([g[0], 0, -1], [g[0], 2.6, -1], g[1], 0.1, g[2]); c.link([g[0], 0, 1], [g[0], 2.6, 1], g[1], 0.1, g[2]); c.link([g[0], 2.6, -1], [g[0], 2.6, 1], g[1], 0.1, g[2]);
        c.label(g[3], [g[0], 3.3, 0], 0.22);
      });
      var coins = []; for (var i = 0; i < 4; i++) { var m = coin(c, 0, 1.2, 0, 'Прибыль на пути к акционеру.', null, 0.55); m.rotation.x = Math.PI / 2; coins.push(m); }
      c.onFrame(function (t) {
        coins.forEach(function (m, i) {
          var k = (t * 0.18 + i / 4) % 1, x = K.lerp(-4, 4.6, k); m.position.x = x; m.rotation.y = t * 2;
          var s = x < -1.8 ? 1 : x < 1.8 ? 0.75 : 0.62; m.scale.set(s, 1, s);
        });
      });
    },
    chips: [
      { t: 'Налог 1', on: function (c) { c.setView(0.2, 1.0, 8, 1.2, -1.8, 0); c.say('<b>Налог на прибыль</b> платит само акционерное общество.'); } },
      { t: 'Налог 2', on: function (c) { c.setView(0.2, 1.0, 8, 1.2, 1.8, 0); c.say('С того, что дошло до акционера в виде дивиденда, он платит <b>налог на доход</b>. Один и тот же рубль прибыли обложен дважды.'); } },
      { t: 'Весь путь', on: function (c) { c.setView(0.15, 1.05, 14, 1.2, 0, 0); c.say('<b>Двойное налогообложение</b> — последний недостаток АО, названный лектором. Монета уменьшается на каждой рамке.'); } }
    ]
  });

  /* ======================= 17. Унитарное и казённое предприятие ======================= */
  reg('fi-unitary3d', {
    autorotate: false,
    title: 'Унитарное предприятие: имущество не его', lead: 'Слева — государство, собственник имущества. Справа — предприятие, которое этим имуществом только управляет. У казённого предприятия «поводок» короче.',
    radius: 14, phi: 1.0, theta: 0.2, targetY: 1.3, height: 420, hint: 'Сравни два типа кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Собственник</b> — государство или муниципалитет. Имущество остаётся его собственностью.';
      var s = K.group(c, -4.5, 0, 0);
      s.add(c.box3(2.0, 1.6, 1.4, C.STONE, [0, 0.8, 0], iS));
      for (var i = 0; i < 4; i++) { var col = c.mesh(new T.CylinderGeometry(0.1, 0.1, 1.5, 10), C.WHITE, iS); col.position.set(-0.75 + i * 0.5, 0.75, 0.8); s.add(col); }
      K.flag(c, 0, 0, iS, s, 3.2);
      c.label('собственник', [-4.5, 3.9, 0], 0.24);
      var iE = '<b>ГУП / МУП</b> — коммерческая организация, <b>не наделённая правом собственности</b> на закреплённое за ней имущество.';
      var f = factory(c, 3.2, -0.5, C.CREAM, iE, null, 0.9); K.smoke(c, f, 3);
      c.label('предприятие', [3.2, 3.4, -0.5], 0.24);
      var iP = '<b>Имущество неделимо</b> — его нельзя разделить на вклады или доли, даже между работниками. Отсюда слово «унитарное» (единое). <b>[ДОБАВЛЕНО]</b>';
      var prop = c.box3(1.4, 1.0, 1.0, C.GOLD, [0.6, 0.5, 1.8], iP);
      c.label('имущество', [0.6, 1.6, 1.8], 0.2, '#f0c36b');
      var chain = c.link([-3.5, 1.0, 0.4], [0.6, 1.0, 1.8], C.SILVER, 0.05, '<b>Связь с собственником.</b>');
      var tight = c.link([-3.5, 1.4, 0.4], [0.6, 1.4, 1.8], C.RED, 0.11, '<b>Право оперативного управления</b> — более жёсткая связь: казённое предприятие распоряжается имуществом только с согласия собственника и по его заданию. <b>[ДОБАВЛЕНО]</b>');
      tight.visible = false;
      var hand = c.link([0.6, 1.0, 1.8], [2.4, 1.0, 0.2], C.GREEN, 0.05, '<b>Право хозяйственного ведения</b> — предприятие само управляет имуществом в рамках закона, но не владеет им. <b>[ДОБАВЛЕНО]</b>');
      c.S = { k: false, shake: 0 };
      c.onFrame(function (t) {
        tight.visible = c.S.k; hand.material.color.set(c.S.k ? C.GREY : C.GREEN);
        if (c.S.shake > 0) { c.S.shake -= 1; prop.position.x = 0.6 + Math.sin(t * 40) * 0.08; } else prop.position.x = 0.6;
      });
    },
    chips: [
      { t: 'ГУП / МУП', on: function (c) { c.S.k = false; c.say('Обычное унитарное предприятие работает с имуществом на праве <b>хозяйственного ведения</b> [ДОБАВЛЕНО]. Но собственником остаётся государство или муниципалитет.'); } },
      { t: 'Казённое', on: function (c) { c.S.k = true; c.say('<b>Казённое предприятие</b> — разновидность унитарного. Лектор: ему предоставлено право <b>оперативного управления</b> имуществом. Это более жёсткий «поводок».'); } },
      { t: 'Разделить имущество?', on: function (c) { c.S.shake = 60; c.say('Нельзя: имущество унитарного предприятия <b>неделимо</b> и не распределяется по долям. <b>[ДОБАВЛЕНО]</b>'); } }
    ]
  });
})();
