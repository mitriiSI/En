/* 3D-модели к конспекту «Экономика. Рыночное равновесие и эластичность» (лекция 26.10).
   В Markdown: @@graph:rv-zones3d@@ @@graph:rv-milk3d@@ @@graph:rv-balance3d@@ @@graph:rv-surplus3d@@ @@graph:rv-deficit3d@@
   @@graph:rv-cobweb3d@@ @@graph:rv-say3d@@ @@graph:rv-walras3d@@ @@graph:rv-competition3d@@ @@graph:rv-elastic3d@@
   @@graph:rv-gas3d@@ @@graph:rv-relative3d@@ @@graph:rv-degrees3d@@ @@graph:rv-tomato3d@@ @@graph:rv-revenue3d@@
   @@graph:rv-salt3d@@ @@graph:rv-dfactors3d@@ @@graph:rv-cross3d@@ @@graph:rv-income3d@@ @@graph:rv-supplytime3d@@
   @@graph:rv-sfactors3d@@ @@graph:rv-firm3d@@ @@graph:rv-theories3d@@ @@graph:rv-sme3d@@ */
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


  /* ---------- дополнительные помощники ---------- */
  /* Плоский многоугольник на плоскости графика (z), полупрозрачный */
  function poly(c, pts, col, info, op, z, g) {
    var T = c.THREE, geo = new T.BufferGeometry(), v = [];
    for (var i = 1; i < pts.length - 1; i++) [pts[0], pts[i], pts[i + 1]].forEach(function (p) { v.push(p[0], p[1], z || 0); });
    geo.setAttribute('position', new T.Float32BufferAttribute(v, 3)); geo.computeVertexNormals();
    var m = c.mesh(geo, col, info, { side: T.DoubleSide, emissive: col, emissiveIntensity: 0.25 });
    m.material.transparent = true; m.material.opacity = op || 0.35; m.material.depthWrite = false; m.castShadow = false;
    if (g) g.add(m); return m;
  }
  /* Прямые D и S «крестом», точка E в (0,3) */
  function cross(c, g) {
    var iD = '<b>D — кривая спроса.</b> Каждая точка — максимальная цена, которую покупатель готов заплатить за это количество (цена спроса).';
    var iS = '<b>S — кривая предложения.</b> Каждая точка — минимальная цена, за которую продавец готов продать (цена предложения).';
    tube(c, [[-3.6, 5.6], [0, 3], [3.6, 0.4]], BLUE, iD, g);
    tube(c, [[-3.6, 0.4], [0, 3], [3.6, 5.6]], ORANGE, iS, g);
    var a = c.label('D', [3.9, 0.2, 0], 0.3, '#5b8def'), b = c.label('S', [3.9, 5.8, 0], 0.3, '#e39b5b');
    if (g) { g.add(a); g.add(b); }
  }
  function box(c, x, y, z, col, info, s, g) { var m = c.box3(s || 0.5, s || 0.5, s || 0.5, col || WOOD, [x, y, z], info); if (g) g.add(m); return m; }
  function pillar(c, x, z, h, col, info, txt) {
    var m = c.box3(1.1, h, 1.1, col, [x, h / 2, z], info);
    c.label(txt, [x, h + 0.6, z], 0.22); return m;
  }

  /* ======================= 1. Четыре зоны ======================= */
  reg('rv-zones3d', {
    autorotate: false,
    title: 'Четыре зоны графика', lead: 'Кривые спроса D и предложения S делят график на четыре зоны. Нажимай кнопки или сами зоны.',
    radius: 13, phi: 1.35, theta: 0.05, targetY: 3, height: 440, hint: 'Нажми на цветную зону или на точку E.',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6);
      cross(c);
      var Z = {};
      Z.z1 = poly(c, [[0, 3], [3.6, 5.6], [3.6, 0.4]], GREY, '<b>Зона 1 — сделок нет.</b> Цена выше цены спроса и ниже цены предложения: покупатель не хочет платить так много, продавец не хочет продавать так дёшево.', 0.35, -0.02);
      Z.z2 = poly(c, [[-3.6, 5.6], [0, 3], [3.6, 5.6], [3.6, 6.4], [-3.6, 6.4]], RED, '<b>Зона 2 — излишек (затоваривание).</b> Цена высокая: продавать хотят многие, а покупать по такой цене — мало кто. Интерес только у продавца.', 0.35, -0.02);
      Z.z3 = poly(c, [[-3.6, 0.4], [0, 3], [3.6, 0.4], [3.6, 0.05], [-3.6, 0.05]], PURPLE, '<b>Зона 3 — дефицит.</b> Цена низкая: купить хотят многие, а продавать по такой цене почти никто не хочет. Интерес только у покупателя.', 0.35, -0.02);
      Z.z4 = poly(c, [[-3.6, 5.6], [0, 3], [-3.6, 0.4]], GREEN, '<b>Зона 4 — взаимовыгодные сделки.</b> Цена ниже цены спроса и выше цены предложения: и покупатель, и продавец согласны. Сделки идут, но не все.', 0.35, -0.02);
      var e = glow(c, GOLD, 0.3, '<b>E — точка равновесия.</b> Цена спроса = цене предложения. Здесь интересы покупателей и продавцов совпадают полностью.'); e.position.set(0, 3, 0.05);
      c.label('E', [0.5, 3.5, 0], 0.3, '#f0c36b');
      c.label('1', [2.6, 3, 0], 0.4); c.label('2', [0, 5.6, 0], 0.4); c.label('3', [0, 0.9, 0], 0.4); c.label('4', [-2.6, 3, 0], 0.4);
      c.userData = Z;
      c.onFrame(function (t) { e.scale.setScalar(1 + 0.15 * Math.sin(t * 3)); });
    },
    chips: [
      { t: 'Зона 1', on: function (c) { c.say('<b>Нет сделок.</b> Лектор: «Нет дураков-покупателей, которые купят дороже цены спроса, и нет продавцов, которые продадут дешевле цены предложения».'); } },
      { t: 'Зона 2', on: function (c) { c.say('<b>Излишек предложения.</b> Продавец охотно продал бы по такой цене, но покупателей не найти.'); } },
      { t: 'Зона 3', on: function (c) { c.say('<b>Дефицит.</b> Много желающих купить по маленькой цене, а товара мало.'); } },
      { t: 'Зона 4', on: function (c) { c.say('<b>Взаимовыгодные сделки.</b> Покупают и продают, но это ещё не идеал.'); } },
      { t: 'Точка E', on: function (c) { c.setView(0.05, 1.35, 8, 3, 0); c.say('<b>Равновесие.</b> Пересечение спроса и предложения устраивает всех лучше всего.'); } }
    ]
  });

  /* ======================= 2. Молоко: цена спроса и предложения ======================= */
  reg('rv-milk3d', {
    title: 'Молоко: потолок и пол', lead: 'Покупатель готов заплатить за пакет молока максимум 130 ₽. Продавец за 130 продаст, а за 129 — уже нет.',
    radius: 12, phi: 1.15, theta: 0.4, targetY: 2, height: 400, hint: 'Нажми на столбики или пакет.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iD = '<b>Цена спроса</b> — максимальная цена, которую покупатель готов заплатить за товар в этот день. Здесь — 130 ₽.';
      var iS = '<b>Цена предложения</b> — минимальная цена, за которую продавец согласен продать. Здесь — тоже 130 ₽: «за 129 не продам».';
      pillar(c, -1.8, 0, 4.3, BLUE, iD, 'цена спроса\n130 ₽');
      pillar(c, 1.8, 0, 4.3, ORANGE, iS, 'цена предложения\n130 ₽');
      var pk = new T.Group(); c.root.add(pk); pk.position.set(0, 0, 1.8);
      pk.add(c.box3(0.9, 1.6, 0.9, PAPER, [0, 0.8, 0], '<b>Пакет молока.</b> Пример лектора.'));
      var top = c.mesh(new T.ConeGeometry(0.66, 0.5, 4), BLUE, 'Пакет молока.'); top.rotation.y = Math.PI / 4; top.position.y = 1.85; pk.add(top);
      var e = glow(c, GOLD, 0.3, '<b>Совпали!</b> Цена спроса = цене предложения = 130 ₽. Это и есть <b>равновесная цена</b>.'); e.position.set(0, 4.3, 0);
      c.link([-1.8, 4.3, 0], [1.8, 4.3, 0], GOLD, 0.04, 'Линия равновесной цены.');
      c.onFrame(function (t) { pk.rotation.y = t * 0.6; e.position.y = 4.3 + 0.1 * Math.sin(t * 3); });
    }
  });

  /* ======================= 3. Весы равновесия ======================= */
  reg('rv-balance3d', {
    title: 'Равновесие — как весы', lead: 'Слева — величина спроса, справа — величина предложения. Меняй цену: весы уравновешены только при равновесной цене.',
    radius: 12, phi: 1.15, theta: 0.2, targetY: 2, height: 420, hint: 'Нажми кнопку с ценой.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      c.box3(0.4, 3, 0.4, DARK, [0, 1.5, 0], 'Опора весов — рынок.');
      var beam = new T.Group(); c.root.add(beam); beam.position.y = 3;
      beam.add(c.box3(6, 0.15, 0.3, SILVER, [0, 0, 0], 'Коромысло весов.'));
      var L = new T.Group(), R = new T.Group(); beam.add(L); beam.add(R); L.position.x = -2.8; R.position.x = 2.8;
      var iD = '<b>Чаша спроса:</b> сколько хотят купить по этой цене.', iS = '<b>Чаша предложения:</b> сколько хотят продать по этой цене.';
      [L, R].forEach(function (g, k) { g.add(c.link([0, 0, 0], [0, -1.2, 0], GREY, 0.03)); var p = c.mesh(new T.CylinderGeometry(0.9, 0.6, 0.2, 24), k ? ORANGE : BLUE, k ? iS : iD); p.position.y = -1.3; g.add(p); });
      var dB = [], sB = [];
      for (var i = 0; i < 6; i++) { var a = box(c, 0, 0, 0, BLUE, iD, 0.4); L.add(a); a.position.set((i % 3 - 1) * 0.45, -1.0 + Math.floor(i / 3) * 0.45, 0); dB.push(a); var b = box(c, 0, 0, 0, ORANGE, iS, 0.4); R.add(b); b.position.set((i % 3 - 1) * 0.45, -1.0 + Math.floor(i / 3) * 0.45, 0); sB.push(b); }
      c.label('спрос', [-2.8, 4, 0], 0.26, '#5b8def'); c.label('предложение', [2.8, 4, 0], 0.26, '#e39b5b');
      var tag = c.label('P = равновесная', [0, 5, 0], 0.3, '#f0c36b');
      c.userData = { d: 4, s: 4, ang: 0 };
      c.onFrame(function () {
        var u = c.userData; dB.forEach(function (b, i) { b.visible = i < u.d; }); sB.forEach(function (b, i) { b.visible = i < u.s; });
        var goal = (u.s - u.d) * 0.07; u.ang = lerp(u.ang, goal, 0.08); beam.rotation.z = u.ang;
        L.rotation.z = -u.ang; R.rotation.z = -u.ang;
      });
    },
    chips: [
      { t: 'Цена высокая', on: function (c) { c.userData.d = 2; c.userData.s = 6; c.say('Цена выше равновесной: предлагают <b>больше</b>, чем покупают → <b>излишек</b>. Перевешивает предложение.'); } },
      { t: 'Равновесная', on: function (c) { c.userData.d = 4; c.userData.s = 4; c.say('<b>Равновесная цена:</b> величина спроса = величине предложения. Весы ровно.'); } },
      { t: 'Цена низкая', on: function (c) { c.userData.d = 6; c.userData.s = 2; c.say('Цена ниже равновесной: хотят купить <b>больше</b>, чем есть → <b>дефицит</b>. Перевешивает спрос.'); } }
    ]
  });

  /* ======================= 4. Излишек: цена падает ======================= */
  reg('rv-surplus3d', {
    autorotate: false,
    title: 'Излишек → цена падает', lead: 'Цена выше равновесной — на складе копится непроданный товар. Продавцы снижают цену, и шарик-цена скатывается к точке E.',
    radius: 13, phi: 1.3, theta: 0.15, targetY: 3, height: 430, hint: 'Нажми «Запустить».',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6); cross(c);
      var iE = 'Излишек = величина предложения минус величина спроса при этой цене.';
      var line = c.link([-1.85, 4.4, 0], [1.85, 4.4, 0], RED, 0.06, '<b>Отрезок излишка</b> при высокой цене. ' + iE);
      var ball = glow(c, RED, 0.25, '<b>Текущая цена.</b> Она выше равновесной.');
      var boxes = []; for (var i = 0; i < 8; i++) boxes.push(box(c, -3 + (i % 4) * 0.6, 0.25 + Math.floor(i / 4) * 0.55, 2.5, WOOD, '<b>Непроданный товар</b> на складе — признак излишка.'));
      c.label('склад', [-2.1, 1.6, 2.5], 0.24);
      c.userData = { y: 4.4, goal: 4.4 };
      c.onFrame(function () {
        var u = c.userData; u.y = lerp(u.y, u.goal, 0.03); ball.position.set(0, u.y, 0.1);
        var w = (u.y - 3) / 1.4; line.scale.set(1, Math.max(0.01, w), 1); line.position.y = u.y;
        boxes.forEach(function (b, i) { b.visible = i < Math.round(w * 8); });
      });
    },
    chips: [
      { t: 'Запустить', on: function (c) { c.userData.y = 4.4; c.userData.goal = 3; c.say('Продавцы <b>снижают цену</b>, чтобы избавиться от излишка. Покупать начинают больше, производить — меньше. Цена приходит в E.'); } },
      { t: 'Сначала', on: function (c) { c.userData.y = 4.4; c.userData.goal = 4.4; c.say('Цена высокая, излишек большой.'); } }
    ]
  });

  /* ======================= 5. Дефицит: рынок и командная экономика ======================= */
  reg('rv-deficit3d', {
    title: 'Дефицит: два пути', lead: 'Слева — командная экономика: цену назначили сверху, товара мало, стоит очередь. Справа — рынок: цена поднимается, и очередь исчезает.',
    radius: 15, phi: 1.1, theta: 0.3, targetY: 1.2, height: 420, hint: 'Нажми на очередь, полку или ценник.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iQ = '<b>Очередь</b> — главный признак дефицита при административно-командной экономике. Цены устанавливают сверху, и они не меняются.';
      var iB = '<b>Чёрный рынок</b> — второй признак дефицита: товар перепродают «из-под полы» дороже официальной цены.';
      c.box3(2.5, 2, 0.6, WOOD, [-4, 1, -2], 'Пустая полка советского магазина.'); c.label('цена фиксирована', [-4, 2.7, -2], 0.22, '#e0645a');
      for (var i = 0; i < 7; i++) person(c, -4 + 0.0, -0.8 + i * 0.75, [BLUE, GREEN, PURPLE, ORANGE, RED, GREY, BLUE][i], iQ, null, 0.8);
      person(c, -6.3, 2.5, DARK, iB, null, 0.9); box(c, -5.8, 0.2, 2.5, WOOD, iB, 0.35); c.label('чёрный рынок', [-6.2, 1.8, 2.5], 0.2);
      c.label('командная экономика', [-4, 3.6, 0], 0.26);
      var iR = '<b>Рынок регулирует себя сам.</b> Никаких приказов: при дефиците цена растёт, часть покупателей уходит, продавцы везут больше товара.';
      var shelf = c.box3(2.5, 2, 0.6, WOOD, [4, 1, -2], iR);
      var goods = []; for (var j = 0; j < 6; j++) goods.push(box(c, 3.2 + (j % 3) * 0.8, 0.5 + Math.floor(j / 3) * 0.9, -1.6, GREEN, iR, 0.45));
      var tag = glow(c, GOLD, 0.25, '<b>Цена растёт</b> до равновесной.'); 
      var q = []; for (var k = 0; k < 4; k++) q.push(person(c, 4, -0.8 + k * 0.75, [BLUE, GREEN, PURPLE, ORANGE][k], iR, null, 0.8));
      c.label('рынок', [4, 3.6, 0], 0.26);
      c.onFrame(function (t) {
        var s = (Math.sin(t * 0.8) + 1) / 2; tag.position.set(5.6, 1 + s * 2, -2);
        q.forEach(function (p, i) { p.visible = i < 4 - Math.round(s * 3); });
        goods.forEach(function (g, i) { g.visible = i < 2 + Math.round(s * 4); });
      });
    }
  });

  /* ======================= 6. Паутинообразная модель ======================= */
  reg('rv-cobweb3d', {
    autorotate: false,
    title: 'Паутинообразная модель', lead: 'Фермер решает, сколько сажать, по <b>прошлогодней</b> цене. Цена прыгает то выше, то ниже, а путь сходится к точке E, рисуя «паутину».',
    radius: 13, phi: 1.35, theta: 0.05, targetY: 3, height: 440, hint: 'Нажми «Год за годом».',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6);
      var iD = '<b>D — спрос.</b> Сколько купят по этой цене в этом году.', iS = '<b>S — предложение.</b> Сколько вырастят по цене <b>прошлого</b> года.';
      tube(c, [[-3.6, 5.1], [0, 3], [3.6, 0.9]], BLUE, iD); tube(c, [[-3.6, 0.2], [0, 3], [3.6, 5.8]], ORANGE, iS);
      c.label('D', [3.9, 0.8, 0], 0.3, '#5b8def'); c.label('S', [3.9, 6, 0], 0.3, '#e39b5b');
      var d = function (q) { return 3 - q * (2.1 / 3.6); }, s = function (q) { return 3 + q * (2.8 / 3.6); }, sInv = function (p) { return (p - 3) * 3.6 / 2.8; };
      var pts = [], q = -2.8, p;
      pts.push([q, 0.2]);
      for (var i = 0; i < 12; i++) { p = d(q); pts.push([q, p]); q = sInv(p); pts.push([q, p]); }
      var segs = [];
      for (var k = 1; k < pts.length; k++) { var m = c.link([pts[k - 1][0], pts[k - 1][1], 0.06], [pts[k][0], pts[k][1], 0.06], RED, 0.045, k % 2 ? '<b>Вертикальный шаг:</b> урожай уже вырос, его надо продать — цена встаёт на кривую спроса.' : '<b>Горизонтальный шаг:</b> по новой цене фермеры решают, сколько сажать на следующий год.'); m.visible = false; segs.push(m); }
      var ball = glow(c, GOLD, 0.22, 'Рынок в этом году.');
      c.userData = { n: segs.length, all: segs.length, t0: 0, play: false };
      c.onFrame(function (t) {
        var u = c.userData; if (u.play && u.t0 < 0) u.t0 = t; if (u.play) { u.n = Math.min(segs.length, Math.floor((t - u.t0) * 1.6)); if (u.n >= segs.length) u.play = false; }
        segs.forEach(function (m, i) { m.visible = i < u.n; });
        var pp = pts[Math.min(u.n, pts.length - 1)]; ball.position.set(pp[0], pp[1], 0.12);
      });
    },
    chips: [
      { t: 'Год за годом', on: function (c) { c.userData.play = true; c.userData.t0 = -1; c.userData.n = 0; c.say('Неурожай → цена высокая → на следующий год посадили много → цена упала → посадили мало… Колебания затухают, и рынок приходит в E.'); } },
      { t: 'Вся паутина', on: function (c) { c.userData.play = false; c.userData.n = c.userData.all; c.say('Вся «паутина» сразу: каждый виток меньше предыдущего.'); } }
    ]
  });

  /* ======================= 7. Закон Сэя ======================= */
  reg('rv-say3d', {
    title: 'Закон Сэя', lead: 'Жан-Батист Сэй: «предложение создаёт свой собственный спрос». Произвёл товар → получил доход → потратил его на другие товары.',
    radius: 12, phi: 1.0, theta: 0.3, targetY: 1.2, height: 400, hint: 'Нажми на станцию цикла.',
    build: function (c) {
      var T = c.THREE; c.ground(6.5);
      var st = [
        ['производство', ORANGE, '<b>Производство (предложение).</b> Фабрика выпустила товар.'],
        ['доход', GOLD, '<b>Доход.</b> Продав товар, производитель и его работники получили деньги: зарплату, прибыль.'],
        ['спрос', BLUE, '<b>Спрос.</b> Эти деньги тратят на другие товары. Значит, предложение само «родило» спрос.']
      ];
      st.forEach(function (s, i) {
        var a = i / 3 * Math.PI * 2, x = Math.cos(a) * 3.2, z = Math.sin(a) * 3.2;
        c.box3(1.4, 1.2, 1.4, s[1], [x, 0.6, z], s[2]); c.label(s[0], [x, 1.8, z], 0.26);
      });
      var ring = c.mesh(new T.TorusGeometry(3.2, 0.06, 8, 80), GREY, 'Круговорот: товары → доходы → покупки → товары.'); ring.rotation.x = Math.PI / 2; ring.position.y = 0.3;
      var bs = []; for (var k = 0; k < 6; k++) bs.push(coin(c, 0, 0.35, 0, 'Деньги идут по кругу.', null, 0.25));
      c.onFrame(function (t) { bs.forEach(function (b, i) { var a = t * 0.7 + i * Math.PI / 3; b.position.set(Math.cos(a) * 3.2, 0.35, Math.sin(a) * 3.2); b.rotation.z = a; }); });
    }
  });

  /* ======================= 8. Вальрас и Маршалл ======================= */
  reg('rv-walras3d', {
    autorotate: false,
    title: 'Вальрас против Маршалла', lead: 'Как рынок приходит в равновесие? У <b>Вальраса</b> быстро меняется <b>цена</b> (шарик ездит вверх-вниз). У <b>Маршалла</b> быстрее меняется <b>количество</b> (шарик ездит влево-вправо).',
    radius: 14, phi: 1.3, theta: 0.0, targetY: 1.8, targetX: 0.1, height: 440, hint: 'Выбери учёного.',
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var gW = group(c), gM = group(c); gW.position.x = -3.5; gM.position.x = 3.3; gW.scale.setScalar(0.56); gM.scale.setScalar(0.56);
      [gW, gM].forEach(function (g) { axes(c, -4, 0, 8.5, 6.6, g); cross(c, g); });
      var lW = c.label('Вальрас', [-3.2, 4.4, 0], 0.32, '#5b8def'), lM = c.label('Маршалл', [3.6, 4.4, 0], 0.32, '#e39b5b');
      var bW = glow(c, BLUE, 0.3, '<b>Леон Вальрас</b> (Лозаннская школа): цены совершенно гибкие. Равновесие наступает за счёт колебаний <b>цены</b>. Цена — независимая переменная (аргумент), количество — функция.');
      var bM = glow(c, ORANGE, 0.3, '<b>Альфред Маршалл</b> (Кембриджская школа): цены недостаточно гибкие. При диспропорциях <b>объёмы меняются быстрее цен</b>. Количество — аргумент, цена — функция.');
      gW.add(bW); gM.add(bM);
      c.onFrame(function (t) { bW.position.set(0, 3 + 1.6 * Math.sin(t * 2) * Math.exp(-((t % 6) / 3)), 0.15); bM.position.set(1.8 * Math.sin(t * 2) * Math.exp(-((t % 6) / 3)), 3, 0.15); });
    },
    chips: [
      { t: 'Вальрас', on: function (c) { c.setView(0, 1.3, 7, 1.7, -3.2); c.say('<b>Вальрас:</b> цены гибкие, совершенная конкуренция, <b>общее равновесие</b> всех рынков сразу. Цена — аргумент.'); } },
      { t: 'Маршалл', on: function (c) { c.setView(0, 1.3, 7, 1.7, 3.6); c.say('<b>Маршалл:</b> цены негибкие, объёмы меняются быстрее; в краткосрочном периоде — несовершенная конкуренция; <b>частичное равновесие</b> одного рынка. Количество — аргумент.'); } },
      { t: 'Оба', on: function (c) { c.setView(0, 1.3, 14, 1.8, 0.1); c.say('Слева — Вальрас, справа — Маршалл.'); } }
    ]
  });

  /* ======================= 9. Совершенная и несовершенная конкуренция ======================= */
  reg('rv-competition3d', {
    title: 'Совершенная конкуренция и монополия', lead: 'Слева — рынок картошки: много одинаковых продавцов с одинаковым товаром. Справа — монополия: один продавец на весь рынок.',
    radius: 15, phi: 1.05, theta: 0.3, targetY: 1, height: 420, hint: 'Нажми на прилавок, картошку или магазин.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var iP = '<b>Совершенная конкуренция:</b> много продавцов и покупателей, товар <b>однородный</b> (картошка у всех одинаковая), вход и выход свободны. Никто не может сам диктовать цену.';
      for (var i = 0; i < 9; i++) {
        var x = -6.5 + (i % 3) * 1.8, z = -2 + Math.floor(i / 3) * 2;
        c.box3(1.3, 0.7, 0.8, WOOD, [x, 0.35, z], iP);
        for (var k = 0; k < 3; k++) { var p = c.mesh(new T.SphereGeometry(0.17, 10, 8), POTATO, iP); p.position.set(x - 0.35 + k * 0.35, 0.85, z); p.scale.set(1.2, 0.9, 1); }
        person(c, x, z - 0.7, GREEN, iP, null, 0.6);
      }
      c.label('совершенная конкуренция', [-4.7, 2.4, 0], 0.26, '#4cc38a');
      var iM = '<b>Монополия</b> — один продавец. Это <b>несовершенная</b> конкуренция. Не путай монополию с <b>монополистической конкуренцией</b> — там продавцов много, но товары немного разные.';
      var shop = c.box3(3.2, 2.6, 2.4, RED, [4.5, 1.3, 0], iM);
      c.box3(3.4, 0.3, 2.6, DARK, [4.5, 2.75, 0], iM); c.label('МОНОПОЛИЯ', [4.5, 3.6, 0], 0.3, '#e0645a');
      for (var j = 0; j < 5; j++) person(c, 2.6 + j * 0.9, 2.4, [BLUE, PURPLE, ORANGE, GREY, BLUE][j], 'Покупателям некуда идти — продавец один.', null, 0.7);
    }
  });

  /* ======================= 10. Что такое эластичность ======================= */
  reg('rv-elastic3d', {
    autorotate: false,
    title: 'Эластичность — степень реакции', lead: 'Цена на обеих картинках снижается одинаково. Но по пологой кривой количество меняется сильно (эластичный спрос), а по крутой — чуть-чуть (неэластичный).',
    radius: 14, phi: 1.3, theta: 0, targetY: 1.8, targetX: 0.1, height: 430, hint: 'Нажми «Снизить цену».',
    build: function (c) {
      var g1 = group(c), g2 = group(c); g1.position.x = -3.5; g2.position.x = 3.3; g1.scale.setScalar(0.56); g2.scale.setScalar(0.56);
      c.ground(10); axes(c, -4, 0, 8.5, 6.6, g1); axes(c, -4, 0, 8.5, 6.6, g2);
      var iE = '<b>Эластичный спрос</b>: маленькое изменение цены → большое изменение количества.';
      var iN = '<b>Неэластичный спрос</b>: цена изменилась, а количество почти то же.';
      tube(c, [[-3.8, 4.2], [3.8, 1.8]], BLUE, iE, g1); tube(c, [[-1.2, 6], [1.2, 0.3]], PURPLE, iN, g2);
      c.label('эластичный', [-3.2, 4.4, 0], 0.28, '#5b8def'); c.label('неэластичный', [3.6, 4.4, 0], 0.28, '#a78bfa');
      var b1 = glow(c, GOLD, 0.3, iE), b2 = glow(c, GOLD, 0.3, iN); g1.add(b1); g2.add(b2);
      c.userData = { k: 0, goal: 0 };
      c.onFrame(function () {
        var u = c.userData; u.k = lerp(u.k, u.goal, 0.05);
        var p = 3.6 - u.k * 1.2;
        b1.position.set((4.2 - p) / 2.4 * 7.6 - 3.8, p, 0.15);
        b2.position.set(-1.2 + (6 - p) / 5.7 * 2.4, p, 0.15);
      });
    },
    chips: [
      { t: 'Снизить цену', on: function (c) { c.userData.goal = 1; c.say('Цена упала одинаково. Слева шарик уехал далеко вправо — <b>эластично</b>. Справа почти на месте — <b>неэластично</b>.'); } },
      { t: 'Вернуть', on: function (c) { c.userData.goal = 0; c.say('Исходная цена.'); } }
    ]
  });

  /* ======================= 11. Бензин: краткий и долгий период ======================= */
  reg('rv-gas3d', {
    title: 'Бензин подорожал', lead: 'Сегодня водитель всё равно заправится — спрос неэластичный. Через год он может пересесть на метро — в долгом периоде спрос эластичнее.',
    radius: 14, phi: 1.1, theta: 0.3, targetY: 1.2, height: 420, hint: 'Выбери период.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Короткий период:</b> бак пустой, ехать надо. Человек заправится даже по высокой цене. Реакция слабая.';
      var iL = '<b>Длительный период:</b> человек успевает перестроиться: метро, электросамокат, экономичная машина. Реакция сильнее.';
      var gs = group(c); gs.position.x = -3.5;
      gs.add(c.box3(0.9, 2, 0.7, RED, [0, 1, 0], iS)); gs.add(c.box3(2.6, 0.15, 1.8, DARK, [0, 3, 0], iS));
      [-0.9, 0.9].forEach(function (x) { gs.add(c.box3(0.12, 3, 0.12, SILVER, [x, 1.5, 0.8], iS)); });
      var cr = car(c, -3.5, 2, BLUE, iS); c.label('сейчас', [-3.5, 4, 0], 0.28);
      var gl = group(c); gl.position.x = 3.5;
      gl.add(c.box3(3, 1.2, 1.2, '#d9534f', [0, 0.6, 0], iL)); gl.add(c.box3(2.8, 0.4, 1.25, '#9fd3ff', [0, 0.9, 0], iL));
      c.label('М', [3.5, 2.2, 0], 0.5, '#e0645a'); c.label('через год', [3.5, 4, 0], 0.28);
      person(c, 3.5, 2, BLUE, iL);
      c.onFrame(function (t) { cr.position.z = 2 + 0.05 * Math.sin(t * 6); });
    },
    chips: [
      { t: 'Сейчас', on: function (c) { c.setView(0.2, 1.1, 8, 1.2, -3.5); c.say('В <b>короткий период</b> эластичность выражена гораздо меньше.'); } },
      { t: 'Через год', on: function (c) { c.setView(0.2, 1.1, 8, 1.2, 3.5); c.say('В <b>длительный период</b> покупатели реагируют на цену сильнее.'); } }
    ]
  });

  /* ======================= 12. +20 рублей: относительное изменение ======================= */
  reg('rv-relative3d', {
    title: '+20 ₽ — много или мало?', lead: 'И бутерброд, и машина подорожали на 20 рублей. Для бутерброда это заметно, для машины — ничто. Поэтому эластичность считают в <b>процентах</b>.',
    radius: 13, phi: 1.15, theta: 0.3, targetY: 1.8, height: 420, hint: 'Нажми на столбик.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var iB = '<b>Бутерброд: 100 → 120 ₽.</b> Рост на 20 % — покупатель это почувствует.';
      var iC = '<b>Автомобиль: 2 000 000 → 2 000 020 ₽.</b> Рост на 0,001 % — никто не заметит.';
      c.box3(1.2, 1, 1.2, CREAM, [-3, 0.5, 0], iB); var add = c.box3(1.2, 0.2 * 1, 1.2, RED, [-3, 1.1, 0], iB);
      var bt = c.box3(1.4, 0.25, 1, '#d9a35b', [-3, 2.1, 2], iB); c.box3(1.3, 0.1, 0.9, '#c0504d', [-3, 2.28, 2], iB);
      c.label('+20 % ', [-3, 2.6, 0], 0.32, '#e0645a');
      car(c, 3, 2, SILVER, iC);
      c.box3(1.2, 4, 1.2, GREY, [3, 2, 0], iC); c.box3(1.2, 0.02, 1.2, RED, [3, 4.01, 0], iC);
      c.label('+0,001 %', [3, 4.6, 0], 0.32, '#8b93b5');
      c.label('E = %ΔQ ÷ %ΔP', [0, 5.3, 0], 0.34, '#f0c36b');
    }
  });

  /* ======================= 13. Пять степеней эластичности ======================= */
  reg('rv-degrees3d', {
    autorotate: false,
    title: 'Пять видов спроса по эластичности', lead: 'От вертикальной линии (лекарство — купят при любой цене) до горизонтальной (томатная паста для пиццерии — уходят к тому, кто чуть дешевле).',
    radius: 13, phi: 1.35, theta: 0.05, targetY: 3, height: 440, hint: 'Выбери вид спроса кнопкой.',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6);
      var T = c.THREE, L = {};
      L.v = tube(c, [[-1.5, 6], [-1.5, 0.2]], PURPLE, '<b>Абсолютно неэластичный спрос (E = 0).</b> Цена меняется, а количество — нет. Пример: жизненно важное лекарство.');
      L.n = tube(c, [[-2.6, 6], [0.4, 0.4]], BLUE, '<b>Неэластичный спрос (E &lt; 1).</b> Количество меняется в процентах <b>меньше</b>, чем цена. Хлеб, соль, бензин в короткий период.');
      var hp = []; for (var i = 0; i <= 20; i++) { var q = 0.9 + i * 0.15; hp.push([q - 4, 5.4 / q * 1.0 + 0.1]); }
      L.u = tube(c, hp.filter(function (p) { return p[1] < 6.2; }), GOLD, '<b>Единичная эластичность (E = 1).</b> Цена изменилась на 1 % — количество тоже на 1 %. Выручка не меняется.');
      L.e = tube(c, [[-3.8, 4.3], [3.8, 2.1]], GREEN, '<b>Эластичный спрос (E &gt; 1).</b> Количество меняется сильнее цены. Дорогие автомобили, украшения, путёвки.');
      L.h = tube(c, [[-3.8, 1.5], [4, 1.5]], RED, '<b>Абсолютно (совершенно) эластичный спрос (E = ∞).</b> Чуть выше цена — покупатель уходит совсем. Пиццерия покупает пасту тоннами и берёт у того, кто хоть немного дешевле.');
      c.userData = L;
    },
    chips: (function () {
      var t = [['E = 0', 'v', 'Абсолютно неэластичный: <b>лекарство</b> (пример лектора). Вертикальная линия.'], ['E < 1', 'n', 'Неэластичный: продукты питания — эластичность по цене низкая.'], ['E = 1', 'u', 'Единичная: изменения равны. Лектор предположила — шоколад, цветы.'], ['E > 1', 'e', 'Эластичный: дорогие автомобили, украшения.'], ['E = ∞', 'h', 'Совершенно эластичный: <b>томатная паста для пиццы</b>. Горизонтальная линия.']];
      return t.map(function (x) { return { t: x[0], on: function (c) { Object.keys(c.userData).forEach(function (k) { c.ghost(c.userData[k], k !== x[1], 0.12); }); c.say(x[2]); } }; })
        .concat([{ t: 'Все', on: function (c) { Object.keys(c.userData).forEach(function (k) { c.ghost(c.userData[k], false); }); c.say('Чем круче линия, тем менее эластичен спрос.'); } }]);
    })()
  });

  /* ======================= 14. Томатная паста ======================= */
  reg('rv-tomato3d', {
    title: 'Пиццерия выбирает пасту', lead: 'Два поставщика одинаковой томатной пасты. У второго цена чуть-чуть ниже. Пиццерия покупает десятки тонн — и уходит к нему вся.',
    radius: 14, phi: 1.1, theta: 0.25, targetY: 1.2, height: 420, hint: 'Нажми на бочки или пиццерию.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iA = '<b>Поставщик А:</b> 100 ₽ за кг.', iB = '<b>Поставщик Б:</b> 99 ₽ за кг. Разница копеечная, но на десятках тонн это большие деньги.';
      var iP = '<b>Пиццерия</b> — крупный покупатель. Для неё спрос на пасту конкретного продавца <b>совершенно эластичен</b>: чуть дороже — и покупать не будут вообще.';
      function barrels(x, col, info) { for (var i = 0; i < 4; i++) { var b = c.mesh(new T.CylinderGeometry(0.4, 0.4, 0.9, 18), col, info); b.position.set(x + (i % 2) * 0.9 - 0.45, 0.45, -2 + Math.floor(i / 2) * 0.9); } }
      barrels(-4, RED, iA); barrels(4, RED, iB);
      c.label('А: 100 ₽', [-4, 1.6, -1.5], 0.28); c.label('Б: 99 ₽', [4, 1.6, -1.5], 0.28, '#4cc38a');
      c.box3(3, 1.6, 2, CREAM, [0, 0.8, 3], iP); var roof = c.mesh(new T.ConeGeometry(2.2, 0.9, 4), RED, iP); roof.position.set(0, 2.05, 3); roof.rotation.y = Math.PI / 4;
      var pz = c.mesh(new T.CylinderGeometry(0.7, 0.7, 0.08, 28), '#e8b04a', iP); pz.position.set(0, 2.8, 3);
      c.label('пиццерия', [0, 3.5, 3], 0.26);
      var tr = car(c, 4, 0.8, GREEN, iB);
      c.onFrame(function (t) { var k = (t * 0.3) % 1; tr.position.set(4 - 4 * k, 0, 0.6 + 2 * k); pz.rotation.y = t; });
    }
  });

  /* ======================= 15. Эластичность и выручка ======================= */
  reg('rv-revenue3d', {
    autorotate: false,
    title: 'Снизить цену или поднять?', lead: 'Выручка = цена × количество — это площадь прямоугольника под точкой. При эластичном спросе снижение цены увеличивает выручку, при неэластичном — уменьшает.',
    radius: 13, phi: 1.35, theta: 0.05, targetY: 3, height: 440, hint: 'Выбери вид спроса и двигай цену.',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6);
      var dE = tube(c, [[-3.8, 4.3], [3.8, 2.1]], GREEN, '<b>Эластичный спрос.</b>'), dN = tube(c, [[-2.6, 6], [0.4, 0.4]], BLUE, '<b>Неэластичный спрос.</b>');
      var rect = c.box3(1, 1, 0.05, GOLD, [0, 0, -0.05], '<b>Выручка</b> = P × Q — площадь прямоугольника.'); rect.material.transparent = true; rect.material.opacity = 0.45;
      var ball = glow(c, GOLD, 0.25, 'Точка на кривой спроса.');
      var lab = c.label('выручка', [0, 6.4, 0], 0.3, '#f0c36b');
      c.userData = { el: true, p: 3.5, goal: 3.5, dE: dE, dN: dN };
      c.onFrame(function () {
        var u = c.userData; u.p = lerp(u.p, u.goal, 0.05); var p = u.p, q;
        if (u.el) q = (4.3 - p) / 2.2 * 7.6 - 3.8; else q = -2.6 + (6 - p) / 5.6 * 3;
        ball.position.set(q, p, 0.1);
        var w = q + 4; rect.scale.set(Math.max(0.01, w), Math.max(0.01, p), 1); rect.position.set(-4 + w / 2, p / 2, -0.05);
      });
    },
    chips: [
      { t: 'Эластичный', on: function (c) { var u = c.userData; u.el = true; u.p = u.goal = 3.5; c.ghost(u.dN, true, 0.12); c.ghost(u.dE, false); c.say('Эластичный спрос. Теперь снизь цену.'); } },
      { t: 'Неэластичный', on: function (c) { var u = c.userData; u.el = false; u.p = u.goal = 3.5; c.ghost(u.dE, true, 0.12); c.ghost(u.dN, false); c.say('Неэластичный спрос. Теперь снизь цену.'); } },
      { t: 'Снизить цену', on: function (c) { var u = c.userData; u.goal = u.el ? 2.4 : 1.5; c.say(u.el ? 'Цена ↓, а прямоугольник стал <b>шире и больше</b>: выручка выросла. Скидка выгодна.' : 'Цена ↓, количество почти то же — прямоугольник <b>уменьшился</b>. Скидка невыгодна.'); } },
      { t: 'Поднять цену', on: function (c) { var u = c.userData; u.goal = u.el ? 4.1 : 5.2; c.say(u.el ? 'Цена ↑ — покупатели разбежались, выручка упала.' : 'Цена ↑ — покупают почти столько же, выручка выросла. Так делают магазины у моря: «всё равно придут».'); } }
    ]
  });

  /* ======================= 16. Соль: много заменителей ======================= */
  reg('rv-salt3d', {
    title: 'Полка с солью', lead: 'Адыгейская, морская, мелкого помола, с чесноком, розовая гималайская… Чем больше заменителей, тем эластичнее спрос на каждую из них.',
    radius: 12, phi: 1.1, theta: 0.3, targetY: 1.5, height: 400, hint: 'Нажми на банку.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      c.box3(7, 0.15, 1.4, WOOD, [0, 0.9, 0], 'Полка магазина.'); c.box3(7, 0.15, 1.4, WOOD, [0, 2.5, 0], 'Полка магазина.');
      var names = ['адыгейская', 'морская', 'мелкая', 'крупная', 'с чесноком', 'йодированная', 'розовая', 'чёрная'];
      var cols = [STONE, '#9fd3ff', PAPER, SILVER, '#e8d9a8', '#cfe3ff', '#f7c6d9', DARK];
      var jars = [];
      names.forEach(function (n, i) {
        var x = -2.6 + (i % 4) * 1.75, y = i < 4 ? 1.45 : 3.05;
        var info = i === 6 ? '<b>Розовая гималайская соль.</b> Для того, кто ест только её, она незаменима — для него спрос неэластичен. Так работают <b>индивидуальные предпочтения</b>.' : '<b>Соль «' + n + '».</b> Если она подорожает, покупатель просто возьмёт соседнюю банку. Много заменителей → спрос эластичен.';
        var j = c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.9, 18), cols[i], info); j.position.set(x, y, 0); jars.push(j);
        c.label(n, [x, y + 0.75, 0.5], 0.18);
      });
      c.onFrame(function (t) { jars[6].position.y = 3.05 + 0.08 * Math.sin(t * 3); });
    }
  });

  /* ======================= 17. Факторы эластичности спроса ======================= */
  reg('rv-dfactors3d', {
    title: 'От чего зависит эластичность спроса', lead: 'Четыре колонны — четыре фактора. Чем выше колонна, тем сильнее этот фактор делает спрос эластичным.',
    radius: 14, phi: 1.1, theta: 0.25, targetY: 1.8, height: 420, hint: 'Нажми на колонну.',
    build: function (c) {
      c.ground(8);
      pillar(c, -4.5, 0, 3.6, GREEN, '<b>1. Заменители.</b> Чем больше товаров-заменителей, тем эластичнее спрос. Пример лектора — десяток видов соли на полке.', 'заменители');
      pillar(c, -1.5, 0, 2.8, BLUE, '<b>2. Значимость товара для покупателя.</b> Если без товара не обойтись (лекарство, любимая корица для булочек), спрос неэластичен.', 'значимость');
      pillar(c, 1.5, 0, 2.2, GOLD, '<b>3. Доля в бюджете.</b> Спички или соль занимают копейки — на их цену почти не смотрят. Машина или путёвка — заметная доля, реакция сильная. [ДОБАВЛЕНО]', 'доля в бюджете');
      pillar(c, 4.5, 0, 3.2, PURPLE, '<b>4. Время.</b> В длительном периоде спрос эластичнее: успеваешь найти замену. Пример — бензин.', 'время');
    }
  });

  /* ======================= 18. Перекрёстная эластичность ======================= */
  reg('rv-cross3d', {
    title: 'Перекрёстная эластичность', lead: 'Как цена одного товара влияет на спрос на <b>другой</b>. Заменители — знак «плюс», дополняющие товары — знак «минус».',
    radius: 14, phi: 1.1, theta: 0.25, targetY: 1.2, height: 420, hint: 'Нажми на товар.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iT = '<b>Чай подорожал</b> → часть людей перейдёт на кофе → спрос на кофе ↑. Заменители: <b>E перекрёстная &gt; 0</b>.';
      var iK = '<b>Кофе</b> — заменитель чая. Цена чая ↑ → спрос на кофе ↑.';
      var iC = '<b>Сахар</b> дополняет кофе. Кофе подорожал → кофе пьют меньше → сахара нужно меньше. Комплементы: <b>E перекрёстная &lt; 0</b>.';
      function cup(x, z, col, info) { var m = c.mesh(new T.CylinderGeometry(0.5, 0.38, 0.9, 20), PAPER, info); m.position.set(x, 0.45, z); var d = c.mesh(new T.CylinderGeometry(0.45, 0.45, 0.05, 20), col, info); d.position.set(x, 0.88, z); return m; }
      cup(-4, 0, TEA, iT); c.label('чай ↑ цена', [-4, 1.8, 0], 0.24, '#7fb069');
      cup(0, 0, COFFEE, iK); c.label('кофе', [0, 1.8, 0], 0.24);
      c.box3(1, 1, 1, PAPER, [4, 0.5, 0], iC); c.label('сахар', [4, 1.8, 0], 0.24);
      arrow(c, [-3.2, 1, 0], [-0.8, 1, 0], GREEN, iT); c.label('+', [-2, 1.6, 0], 0.4, '#4cc38a');
      arrow(c, [0.8, 1, 0], [3.2, 1, 0], RED, iC); c.label('−', [2, 1.6, 0], 0.4, '#e0645a');
      c.label('незаменимые / независимые: E ≈ 0', [0, 3, -1], 0.22, '#8b93b5');
    }
  });

  /* ======================= 19. Эластичность по доходу ======================= */
  reg('rv-income3d', {
    autorotate: false,
    title: 'Эластичность спроса по доходу', lead: 'Доход растёт (слева направо). Что происходит со спросом? У роскоши он растёт быстрее дохода, у нормальных товаров — медленнее, у низших — падает.',
    radius: 13, phi: 1.3, theta: 0.05, targetY: 3, height: 430, hint: 'Нажми на линию.',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6, null, 'доход', 'спрос');
      tube(c, [[-3.6, 0.6], [0, 1.8], [3.6, 6]], PURPLE, '<b>E &gt; 1 — предметы роскоши.</b> Спрос растёт быстрее дохода. Лектор: новые телефоны — люди даже берут кредиты, «спрос опережает доходы».');
      tube(c, [[-3.6, 0.6], [3.6, 3.4]], GREEN, '<b>0 &lt; E &lt; 1 — нормальные товары первой необходимости.</b> Спрос растёт, но медленнее дохода.');
      tube(c, [[-3.6, 2.4], [0, 2.1], [3.6, 0.7]], RED, '<b>E &lt; 0 — низшие товары.</b> Доход растёт — спрос падает (маргарин, кнопочный телефон). Лектор называла их «аномалией».');
      c.label('роскошь', [3.9, 6.2, 0], 0.24, '#a78bfa'); c.label('нормальные', [4.3, 3.5, 0], 0.24, '#4cc38a'); c.label('низшие', [4.1, 0.7, 0], 0.24, '#e0645a');
    }
  });

  /* ======================= 20. Эластичность предложения и время ======================= */
  reg('rv-supplytime3d', {
    autorotate: false,
    title: 'Предложение: три периода', lead: 'Главный фактор эластичности предложения — время. В мгновенном периоде продавец не может сделать больше товара, в длительном — может построить новые цеха.',
    radius: 13, phi: 1.35, theta: 0.05, targetY: 3, height: 440, hint: 'Выбери период.',
    build: function (c) {
      c.ground(8.5); axes(c, -4, 0, 8.5, 6.6); var L = {};
      L.m = tube(c, [[0, 0.3], [0, 6.2]], RED, '<b>Мгновенный период.</b> Предложение абсолютно неэластично: сколько товара есть, столько и продадут — хоть цена вдвое выше. Пример: свежая рыба на рынке к вечеру.');
      L.k = tube(c, [[-2, 0.5], [2, 6]], GOLD, '<b>Краткосрочный период.</b> Можно добавить рабочих и смен на тех же станках — предложение немного растёт.');
      L.d = tube(c, [[-3.8, 1.8], [3.8, 4.2]], GREEN, '<b>Длительный период.</b> Можно построить новые заводы, на рынок приходят новые фирмы — предложение эластично.');
      c.label('мгновенный', [0, 6.6, 0], 0.22, '#e0645a'); c.label('краткосрочный', [2.6, 6.2, 0], 0.22, '#f0c36b'); c.label('длительный', [4.2, 4.6, 0], 0.22, '#4cc38a');
      c.userData = L;
    },
    chips: [['Мгновенный', 'm'], ['Краткосрочный', 'k'], ['Длительный', 'd']].map(function (x) {
      return { t: x[0], on: function (c) { Object.keys(c.userData).forEach(function (k) { c.ghost(c.userData[k], k !== x[1], 0.12); }); c.say({ m: 'Кривая вертикальная — E = 0.', k: 'Кривая крутая — E &lt; 1.', d: 'Кривая пологая — E &gt; 1.' }[x[1]]); } };
    })
  });

  /* ======================= 21. Факторы эластичности предложения ======================= */
  reg('rv-sfactors3d', {
    title: 'Факторы эластичности предложения', lead: 'Что позволяет продавцу быстро нарастить выпуск, когда цена растёт?',
    radius: 15, phi: 1.1, theta: 0.25, targetY: 1.8, height: 420, hint: 'Нажми на колонну.',
    build: function (c) {
      c.ground(9);
      pillar(c, -5.4, 0, 3.8, GREEN, '<b>Время</b> — главный фактор. Чем больше времени на перестройку, тем эластичнее предложение.', 'время');
      pillar(c, -2.7, 0, 2.6, BLUE, '<b>Технология и мобильность ресурсов.</b> Легко ли перевести станки и людей на этот товар. [ДОБАВЛЕНО]', 'технология');
      pillar(c, 0, 0, 2.2, GOLD, '<b>Ставка процента.</b> Дешёвый кредит — проще расширить производство. Дорогой — расширяться невыгодно.', 'ставка %');
      pillar(c, 2.7, 0, 3.1, PURPLE, '<b>Резервные мощности.</b> Если есть простаивающие станки и склады, выпуск можно поднять быстро.', 'резервы');
      pillar(c, 5.4, 0, 2.4, ORANGE, '<b>Возможность хранить товар.</b> Скоропортящееся (молоко) нельзя придержать — предложение менее эластично. [ДОБАВЛЕНО]', 'хранение');
    }
  });

  /* ======================= 22. Рынок и фирма ======================= */
  reg('rv-firm3d', {
    title: 'Рынок — стихия, фирма — иерархия', lead: 'На рынке все равны и связаны договорами. На фирме — начальник и подчинённые: единоначалие.',
    radius: 15, phi: 1.05, theta: 0.3, targetY: 1.4, height: 420, hint: 'Нажми на человека или стрелку.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var iM = '<b>Рынок</b> — стихия, свобода: никто никому не приказывает, все связаны сделками. Поведение рынка трудно прогнозировать.';
      var ps = [];
      for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; ps.push([-4.5 + Math.cos(a) * 2.2, Math.sin(a) * 2.2]); person(c, ps[i][0], ps[i][1], [BLUE, GREEN, PURPLE, ORANGE, RED, GREY][i], iM, null, 0.8); }
      for (var j = 0; j < 6; j++) for (var k = j + 1; k < 6; k++) if ((j + k) % 2) c.link([ps[j][0], 0.6, ps[j][1]], [ps[k][0], 0.6, ps[k][1]], GOLD, 0.025, iM);
      c.label('рынок', [-4.5, 2.8, 0], 0.3);
      var iF = '<b>Фирма</b> — иерархия: подчинение нижестоящего вышестоящему. Действует административный метод: начальник говорит, что делать.';
      person(c, 4.5, 0, RED, '<b>Руководитель.</b> ' + iF, null, 1.1, 2.4);
      c.box3(1.6, 0.2, 1.6, STONE, [4.5, 2.3, 0], iF); c.box3(4.4, 0.2, 2.4, STONE, [4.5, 1.1, 0], iF);
      [3.2, 5.8].forEach(function (x) { person(c, x, 0, BLUE, '<b>Менеджер.</b> ' + iF, null, 0.9, 1.2); });
      [2.6, 3.8, 5.2, 6.4].forEach(function (x) { person(c, x, 1.8, GREEN, '<b>Работник.</b> Точно знает свои обязанности. ' + iF, null, 0.8); });
      arrow(c, [4.5, 3.4, 0.4], [3.4, 2.4, 0.4], RED, 'Приказ сверху вниз.'); arrow(c, [4.5, 3.4, 0.4], [5.6, 2.4, 0.4], RED, 'Приказ сверху вниз.');
      c.label('фирма', [4.5, 4.6, 0], 0.3);
    }
  });

  /* ======================= 23. Три теории фирмы ======================= */
  reg('rv-theories3d', {
    title: 'Почему возникают фирмы: три теории', lead: 'Три колонны — три объяснения. Нажми на каждую.',
    radius: 13, phi: 1.1, theta: 0.2, targetY: 1.8, height: 420, hint: 'Нажми на колонну или фигуру.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var i1 = '<b>1. Разделение труда</b> (Адам Смит). Когда каждый делает одну операцию, производительность растёт в разы. Пример Смита — булавочная мануфактура: 10 рабочих вместо 200 булавок делали 48 000 в день. [ДОБАВЛЕНО: цифры из «Богатства народов»]';
      var i2 = '<b>2. Снижение риска и неопределённости.</b> На фирме у каждого есть должность и обязанности — все знают, что делать. Это уменьшает неопределённость рынка. [ДОБАВЛЕНО] Эту теорию связывают с Фрэнком Найтом.';
      var i3 = '<b>3. Экономия трансакционных издержек</b> (Рональд Коуз, Оливер Уильямсон). Искать партнёров и заключать договоры на рынке дорого, а внутри фирмы всё под рукой.';
      pillar(c, -3.5, 0, 2.6, BLUE, i1, 'разделение труда');
      pillar(c, 0, 0, 2.6, GREEN, i2, 'риск ↓');
      pillar(c, 3.5, 0, 2.6, GOLD, i3, 'трансакционные\nиздержки ↓');
      for (var k = 0; k < 4; k++) person(c, -4.4 + k * 0.6, 1.8, [BLUE, GREEN, PURPLE, ORANGE][k], i1, null, 0.55);
      var pins = []; for (var p = 0; p < 6; p++) { var m = c.link([-4.3 + p * 0.3, 2.65, -1.4], [-4.3 + p * 0.3, 3.2, -1.4], SILVER, 0.02, i1); pins.push(m); }
      var sh = c.mesh(new T.OctahedronGeometry(0.4), GREEN, i2); sh.position.set(0, 3.5, 0);
      var cn = coin(c, 3.5, 3.4, 0, i3, null, 0.45); cn.rotation.x = Math.PI / 2;
      c.onFrame(function (t) { sh.rotation.y = t; cn.rotation.z = t * 1.5; });
    }
  });

  /* ======================= 24. Малый и средний бизнес ======================= */
  reg('rv-sme3d', {
    title: 'Сколько в России малых фирм', lead: 'Почти все компании — малый и средний бизнес (МСП). Крупных — единицы, но они большие.',
    radius: 14, phi: 1.05, theta: 0.3, targetY: 1.2, height: 420, hint: 'Нажми на здание.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Малые и средние предприятия</b> — по словам лектора, около 99 % всех компаний в России. Критерии: численность работников, доход (выручка), доля участия других организаций.';
      var iL = '<b>Крупное предприятие.</b> Их немного, но на них приходится большая часть производства.';
      for (var i = 0; i < 40; i++) { var x = -6 + (i % 8) * 1.1, z = -2.5 + Math.floor(i / 8) * 1.2; var h = 0.3 + (i * 37 % 5) * 0.12; c.box3(0.7, h, 0.7, [GREEN, TEA, '#5fb88a'][i % 3], [x, h / 2, z], iS); }
      c.box3(2.2, 5, 2.2, BLUE, [5.2, 2.5, 0], iL); c.box3(1.4, 1, 1.4, SILVER, [5.2, 5.5, 0], iL);
      c.label('МСП ≈ 99 %', [-2.2, 1.9, 0], 0.3, '#4cc38a'); c.label('крупные', [5.2, 6.5, 0], 0.28, '#5b8def');
    }
  });
})();
