/* 3D-модели и мини-тест к конспекту «Экономика. Деньги» (лекция 12.10).
   В Markdown: @@graph:dg-liquidity3d@@ @@graph:dg-hanskin3d@@ @@graph:dg-approaches3d@@ @@graph:dg-barter3d@@
   @@graph:dg-forms3d@@ @@graph:dg-metals3d@@ @@graph:dg-functions3d@@ @@graph:dg-diversify3d@@ @@graph:dg-assign3d@@
   @@graph:dg-veksel3d@@ @@graph:dg-emoney3d@@ @@graph:dg-fisher3d@@ @@graph:dg-system3d@@ @@graph:dg-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa',
    WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', SILVER = '#c9ced8', RUST = '#a0522d', JADE = '#3fae8c', FUR = '#7a4e2d';
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
  function fade(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
  }
  function glow(c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); }
  function coin(c, x, y, z, info, g, r, col) {
    var m = c.mesh(new c.THREE.CylinderGeometry(r || 0.4, r || 0.4, 0.1, 28), col || GOLD, info, { metalness: 0.25, roughness: 0.35, emissive: col || GOLD, emissiveIntensity: 0.12 });
    m.position.set(x, y, z); if (g) g.add(m); return m;
  }
  function stack(c, x, z, n, info, g, col) { var arr = []; for (var i = 0; i < n; i++) arr.push(coin(c, x, 0.06 + i * 0.11, z, info, g, 0.4, col)); return arr; }
  function bill(c, x, y, z, info, g, col) { var m = c.box3(1.2, 0.04, 0.6, col || GREEN, [x, y, z], info); if (g) g.add(m); return m; }
  function cow(c, x, z, info, g) {
    var T = c.THREE, p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    var body = c.box3(1.2, 0.6, 0.55, '#f2efe8', [0, 0.75, 0], info); p.add(body);
    var head = c.box3(0.4, 0.4, 0.4, '#f2efe8', [0.75, 0.95, 0], info); p.add(head);
    var spot = c.box3(0.4, 0.62, 0.57, '#333', [-0.2, 0.75, 0], info); p.add(spot);
    [[-0.45, -0.2], [-0.45, 0.2], [0.45, -0.2], [0.45, 0.2]].forEach(function (q) { var l = c.box3(0.12, 0.45, 0.12, '#333', [q[0], 0.22, q[1]], info); p.add(l); });
    return p;
  }
  function tractor(c, x, z, info, g) {
    var T = c.THREE, p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    p.add(c.box3(1.3, 0.55, 0.7, RED, [0, 0.7, 0], info));
    p.add(c.box3(0.5, 0.55, 0.6, '#9fd3ff', [-0.3, 1.25, 0], info));
    [[-0.4, 0.42, 0.42], [0.45, 0.28, 0.28]].forEach(function (w) {
      [-0.42, 0.42].forEach(function (zz) { var wh = c.mesh(new T.CylinderGeometry(w[1], w[1], 0.18, 20), DARK, info); wh.rotation.x = Math.PI / 2; wh.position.set(w[0], w[2], zz); p.add(wh); });
    });
    return p;
  }

  /* ======================= 1. Ликвидность ======================= */
  reg('dg-liquidity3d', {
    title: 'Лестница ликвидности', lead: 'Чем выше столбик, тем дольше превращать актив в деньги. Наличные — мгновенно, квартира — месяцы.',
    radius: 14, phi: 1.1, theta: 0.35, targetY: 1.6, height: 400, hint: 'Нажми на любой столбик.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var A = [
        ['Наличные', 0.15, GREEN, '<b>Наличные</b> — абсолютная ликвидность. Сразу можно расплатиться, ничего не теряя.'],
        ['Карта', 0.3, BLUE, '<b>Деньги на карте</b> — почти так же ликвидны: платёж за секунды.'],
        ['Вклад', 1.0, PURPLE, '<b>Вклад (депозит)</b> — снять можно быстро, но при досрочном снятии часто теряются проценты.'],
        ['Золото', 1.8, GOLD, '<b>Золото</b> — продать можно за день-два, но по цене покупки банка, она ниже цены продажи.'],
        ['Акции', 1.4, '#e39b5b', '<b>Акции</b> — продаются на бирже быстро, но цена может оказаться ниже, чем вы ждали.'],
        ['Машина', 2.8, RED, '<b>Машина</b> — продажа занимает недели; срочно — только со скидкой.'],
        ['Квартира', 4.2, STONE, '<b>Квартира</b> — самый дорогой и наименее ликвидный актив: продажа — месяцы.']
      ];
      var bars = [];
      A.forEach(function (a, i) {
        var x = -6 + i * 2;
        var b = c.box3(1.2, a[1], 1.2, a[2], [x, a[1] / 2, 0], a[3]); b.userData.h = a[1]; bars.push(b);
        c.label(a[0], [x, a[1] + 0.7, 0], 0.32);
      });
      stack(c, -6, 1.6, 4, A[0][3]);
      arrow(c, [-7, 0.3, 2.2], [7, 0.3, 2.2], GREY, 'Слева направо ликвидность <b>падает</b>: время на превращение в деньги растёт.');
      c.label('ликвидность падает →', [0, 0.9, 2.6], 0.3, '#8b93b5');
      c.onFrame(function (t) { bars.forEach(function (b, i) { var s = 1 + 0.04 * Math.sin(t * 2 + i); b.scale.y = s; b.position.y = b.userData.h * s / 2; }); });
    },
    chips: [
      { t: 'Самое ликвидное', on: function (c) { c.setView(-0.5, 1.0, 10, 1, -5); c.say('<b>Наличные и карта.</b> Деньги — это и есть мера ликвидности: они сами абсолютно ликвидны.'); } },
      { t: 'Наименее', on: function (c) { c.setView(0.7, 1.0, 11, 2, 5); c.say('<b>Машина и квартира.</b> Дорого, но «на обед сегодня» их не потратишь — сначала продай.'); } },
      { t: 'Всё', on: function (c) { c.setView(0.35, 1.1, 14, 1.6, 0); c.say('Ликвидность — <b>способность быстро обменяться</b> на деньги без потери стоимости.'); } }
    ]
  });

  /* ======================= 2. Кожаные деньги Китая ======================= */
  reg('dg-hanskin3d', {
    title: 'Кожаные деньги императора', lead: 'Дворец императора Хань. Чтобы попасть на аудиенцию, князь должен поднести нефритовый диск на куске кожи белого оленя с каймой. Кожу продаёт только казна — и очень дорого.',
    radius: 12, phi: 1.05, theta: 0.5, targetY: 1.4, height: 400, hint: 'Нажми на императора, кожу, нефрит или казну.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5, '#5a2a2a');
      var iE = '<b>Император У-ди (династия Хань, II в. до н. э.).</b> Ему нужны были деньги на войны, и он придумал обязательный «пропуск» на аудиенцию.';
      c.box3(3, 0.5, 2, RED, [0, 0.25, -3], iE); c.box3(3, 1.6, 0.3, RED, [0, 1.3, -3.9], iE);
      person(c, 0, -3.1, GOLD, iE, null, 1.3, 0.5);
      c.label('император', [0, 3.3, -3], 0.3);
      var iS = '<b>Кусок кожи белого оленя</b> с вышитой каймой (≈ 30 × 30 см). Казна продавала его за <b>400 000 медных монет</b>. Ценность ему придала не полезность, а <b>указ государства</b> — как у современных бумажных денег.';
      var skin = c.box3(1.6, 0.06, 1.6, PAPER, [0, 1.2, 0.2], iS);
      [[0, 0.81], [0, -0.81], [0.81, 0], [-0.81, 0]].forEach(function (q) { var e = c.box3(q[0] ? 0.12 : 1.72, 0.08, q[0] ? 1.72 : 0.12, RED, [q[0], 1.24, 0.2 + q[1]], iS); });
      var iJ = '<b>Нефритовый диск (би)</b> — традиционный подарок императору. Без кожаной подставки его не принимали.';
      var jade = c.mesh(new T.TorusGeometry(0.35, 0.16, 16, 32), JADE, iJ); jade.rotation.x = Math.PI / 2; jade.position.set(0, 1.4, 0.2);
      var prince = person(c, 0, 1.5, BLUE, '<b>Князь</b> идёт на аудиенцию. Он вынужден купить кожу у казны — фактически это скрытый налог.', null, 1.1);
      c.box3(1.8, 1.0, 0.3, WOOD, [0, 0.5, 0.9], 'Подставка.');
      var iT = '<b>Казна.</b> Единственный продавец кожи. Белых оленей держали в императорском парке, поэтому подделать «деньги» было трудно.';
      var tr = c.box3(1.6, 1.4, 1.2, WOOD, [-4.5, 0.7, 0.5], iT); c.box3(1.7, 0.2, 1.3, GOLD, [-4.5, 1.1, 0.5], iT);
      stack(c, -4.5, 2.2, 6, iT);
      c.label('казна', [-4.5, 2.8, 0.5], 0.3);
      var deer = c.mesh(new T.ConeGeometry(0.5, 1.2, 4), '#f6f3ee', '<b>Белый олень</b> — редкое животное, его кожа стала «деньгами».'); deer.position.set(4.4, 0.6, 0.6); deer.rotation.z = Math.PI / 2;
      c.mesh(new T.SphereGeometry(0.3, 12, 10), '#f6f3ee', '<b>Белый олень</b>').position.set(5.1, 1.1, 0.6);
      c.label('белый олень', [4.6, 2, 0.6], 0.3);
      c.label('400 000 монет', [0, 2.3, 0.2], 0.32, '#f0c36b');
      c.onFrame(function (t) { jade.rotation.z = t * 0.6; prince.position.z = 1.5 + 0.2 * Math.sin(t * 1.5); });
    }
  });

  /* ======================= 3. Два подхода ======================= */
  reg('dg-approaches3d', {
    title: 'Субъективный и объективный подход', lead: 'Слева люди садятся за стол и договариваются: «пусть деньгами будет это». Справа деньги «вырастают» сами — по ступеням обмена.',
    radius: 14, phi: 1.05, theta: 0.2, targetY: 1.5, height: 400, hint: 'Нажми на стол или на ступени.',
    build: function (c) {
      var T = c.THREE, G = { s: group(c), o: group(c) }; c.ground(9);
      var iS = '<b>Субъективный (рационалистический) подход.</b> Деньги — <b>изобретение</b>, результат соглашения людей. Как будто однажды собрались и договорились.';
      var tbl = into(G.s, c.mesh(new T.CylinderGeometry(1.5, 1.5, 0.15, 32), WOOD, iS)); tbl.position.set(-4, 1, 0);
      into(G.s, c.mesh(new T.CylinderGeometry(0.15, 0.15, 1, 10), WOOD, iS)).position.set(-4, 0.5, 0);
      for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; person(c, -4 + Math.cos(a) * 2.1, Math.sin(a) * 2.1, [BLUE, RED, GREEN, PURPLE, GREY][i], iS, G.s); }
      var scroll = into(G.s, c.box3(1.2, 0.05, 0.8, PAPER, [-4, 1.12, 0], iS));
      into(G.s, c.label('«договорились»', [-4, 3.3, 0], 0.32));
      var iO = '<b>Объективный (эволюционный) подход — Маркс.</b> Деньги — результат развития товарно-денежных отношений. Никто их не придумывал: из массы товаров постепенно выделился один. Лектор: «это гораздо более научно».';
      var steps = [];
      for (var k = 0; k < 4; k++) steps.push(into(G.o, c.box3(1.2, 0.5 + k * 0.6, 1.6, [STONE, '#c9b48a', '#d8b878', GOLD][k], [2 + k * 1.3, (0.5 + k * 0.6) / 2, 0], iO)));
      var cn = into(G.o, coin(c, 5.9, 3.0, 0, iO, null, 0.5)); cn.rotation.x = Math.PI / 2;
      into(G.o, c.label('«выросли сами»', [4, 4.2, 0], 0.32));
      into(G.o, c.label('Маркс', [4, 3.5, 0], 0.28, '#f0c36b'));
      c.onFrame(function (t) { cn.rotation.z = t; scroll.rotation.y = 0.3 * Math.sin(t); });
      c.userData = G;
    },
    chips: [
      { t: 'Субъективный', small: 'договор', on: function (c) { fade(c.userData, ['s']); c.setView(-0.3, 1.0, 11, 1.2, -4); c.say('<b>Субъективный:</b> деньги придумали, «как колесо».'); } },
      { t: 'Объективный', small: 'Маркс', on: function (c) { fade(c.userData, ['o']); c.setView(0.5, 1.0, 11, 1.5, 4); c.say('<b>Объективный:</b> деньги выросли сами, «как тропинка в парке».'); } },
      { t: 'Оба', on: function (c) { fade(c.userData, ['s', 'o']); c.setView(0.2, 1.05, 14, 1.5, 0); c.say('Лектор считает научным <b>объективный</b> подход.'); } }
    ]
  });

  /* ======================= 4. Бартер ======================= */
  reg('dg-barter3d', {
    title: 'Бартер: проблема «найти друг друга»', lead: 'У Ивана трактор, ему нужна корова. У Петра корова, но ему нужна не трактор, а курица. Обмен не складывается. Нажми «Деньги» — и цепочка сразу работает.',
    radius: 12, phi: 1.0, theta: 0.3, targetY: 1, height: 400, hint: 'Нажимай кнопки внизу.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iI = '<b>Иван</b>: есть трактор, нужна корова.', iP = '<b>Пётр</b>: есть корова, нужна курица (а не трактор!).', iM = '<b>Марья</b>: есть курица, нужен трактор.';
      person(c, -4, 0, BLUE, iI, null, 1.2); tractor(c, -4, 1.8, iI); c.label('Иван', [-4, 2.4, 0], 0.3);
      person(c, 4, 0, RED, iP, null, 1.2); cow(c, 4, 1.8, iP); c.label('Пётр', [4, 2.4, 0], 0.3);
      person(c, 0, -4, GREEN, iM, null, 1.2); var hen = glow(c, '#fff4d6', 0.35, iM); hen.position.set(1.2, 0.4, -4); c.label('Марья', [0, 2.4, -4], 0.3);
      var q = c.label('?', [0, 2.2, 0.8], 0.9, '#e0645a');
      var G = { a: group(c), m: group(c) };
      arrow(c, [-3.2, 1.6, 0], [3.2, 1.6, 0], RED, 'Иван хочет корову, но Петру трактор не нужен — <b>нет двойного совпадения потребностей</b>.', G.a);
      var cn = coin(c, 0, 0.8, 0, '<b>Деньги</b> — всеобщий эквивалент. Каждый продаёт своё за деньги и покупает нужное. Искать «того самого» партнёра не надо.', G.m, 0.6);
      arrow(c, [-3.2, 0.8, 0.3], [-0.8, 0.8, 0.3], GOLD, null, G.m); arrow(c, [0.8, 0.8, 0.3], [3.2, 0.8, 0.3], GOLD, null, G.m); arrow(c, [0, 0.8, -0.8], [0, 0.8, -3.2], GOLD, null, G.m);
      G.m.visible = false;
      c.userData = { G: G, q: q, cn: cn };
      c.onFrame(function (t) { cn.rotation.y = t * 2; q.position.y = 2.2 + 0.15 * Math.sin(t * 3); });
    },
    chips: [
      { t: 'Бартер', small: 'Т — Т', on: function (c) { c.userData.G.m.visible = false; c.userData.G.a.visible = true; c.userData.q.visible = true; c.say('<b>Бартер</b>: товар на товар. Нужно, чтобы двое нашли друг друга — это редкость.'); } },
      { t: 'Деньги', small: 'Т — Д — Т', on: function (c) { c.userData.G.m.visible = true; c.userData.G.a.visible = false; c.userData.q.visible = false; c.say('<b>С деньгами</b> каждый продаёт своё и покупает нужное. Цепочка замыкается.'); } }
    ]
  });

  /* ======================= 5. Формы стоимости ======================= */
  reg('dg-forms3d', {
    title: 'Четыре формы стоимости (Маркс)', lead: 'Лестница от случайного обмена к деньгам. На каждой ступени свой «сюжет» обмена.',
    radius: 15, phi: 1.0, theta: 0.5, targetY: 1.8, height: 420, hint: 'Нажимай ступени или кнопки внизу.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var I = [
        '<b>1. Простая (случайная) форма.</b> 1 топор = 20 кг зерна. Обмен редкий и случайный.',
        '<b>2. Развёрнутая (полная) форма.</b> 1 топор = 20 кг зерна = 2 овцы = 5 м ткани… Один товар меняют на множество.',
        '<b>3. Всеобщая форма.</b> Из массы товаров <b>выделился один</b> (скот, шкурки). Все товары выражают стоимость через него.',
        '<b>4. Денежная форма.</b> Роль всеобщего эквивалента <b>закрепилась за золотом и серебром</b>.'
      ];
      var cols = [STONE, '#c9b48a', FUR, GOLD];
      for (var k = 0; k < 4; k++) {
        var x = -6 + k * 4, h = 0.4 + k * 0.8;
        c.box3(3.4, h, 3, cols[k] === FUR ? '#9b7a5a' : cols[k] === GOLD ? '#d8b878' : cols[k], [x, h / 2, 0], I[k]);
        c.label(['простая', 'развёрнутая', 'всеобщая', 'денежная'][k], [x, h + 2.4, 0], 0.3);
      }
      var y1 = 0.4, y2 = 1.2, y3 = 2.0, y4 = 2.8;
      // 1: топор и зерно
      c.box3(0.15, 0.9, 0.15, WOOD, [-6.6, y1 + 0.45, 0], I[0]); c.box3(0.5, 0.3, 0.12, SILVER, [-6.5, y1 + 0.85, 0], I[0]);
      c.mesh(new T.ConeGeometry(0.45, 0.7, 14), '#e7cf86', I[0]).position.set(-5.4, y1 + 0.35, 0);
      arrow(c, [-6.2, y1 + 0.5, 0.8], [-5.6, y1 + 0.5, 0.8], GREY, I[0]);
      // 2: один ко многим
      c.box3(0.5, 0.5, 0.5, SILVER, [-2, y2 + 0.25, 0], I[1]);
      [[-1, -1], [-1, 1], [-3, -1], [-3, 1]].forEach(function (p, i) { var o = c.box3(0.35, 0.35, 0.35, [GREEN, '#e7cf86', PAPER, RED][i], [p[0], y2 + 0.18, p[1]], I[1]); c.link([-2, y2 + 0.25, 0], [p[0], y2 + 0.18, p[1]], GREY, 0.03, I[1]); });
      // 3: многие к одному (шкурка)
      var fur = c.box3(0.7, 0.12, 0.45, FUR, [2, y3 + 0.4, 0], I[2]);
      [[1, -1], [1, 1], [3, -1], [3, 1]].forEach(function (p, i) { c.box3(0.35, 0.35, 0.35, [GREEN, '#e7cf86', PAPER, RED][i], [p[0], y3 + 0.18, p[1]], I[2]); arrow(c, [p[0], y3 + 0.25, p[1]], [2 + (p[0] - 2) * 0.25, y3 + 0.35, p[1] * 0.25], GREY, I[2], null, 0.03); });
      // 4: золото
      var g = coin(c, 6, y4 + 0.9, 0, I[3], null, 0.7); g.rotation.x = Math.PI / 2;
      stack(c, 6.9, 0.9, 0, I[3]);
      var gl = glow(c, GOLD, 0.15, I[3]); gl.position.set(6, y4 + 0.9, 0);
      c.onFrame(function (t) { g.rotation.z = t; fur.rotation.y = 0.4 * Math.sin(t); });
    },
    chips: [
      { t: '1', small: 'простая', on: function (c) { c.setView(0.4, 1.0, 9, 1, -6); c.say('<b>Простая:</b> 1 топор = 20 кг зерна.'); } },
      { t: '2', small: 'развёрнутая', on: function (c) { c.setView(0.4, 1.0, 9, 1.5, -2); c.say('<b>Развёрнутая:</b> один товар = много разных товаров.'); } },
      { t: '3', small: 'всеобщая', on: function (c) { c.setView(0.4, 1.0, 9, 2.3, 2); c.say('<b>Всеобщая:</b> все товары — через один (шкурку, скот).'); } },
      { t: '4', small: 'денежная', on: function (c) { c.setView(0.4, 1.0, 9, 3.2, 6); c.say('<b>Денежная:</b> эквивалент — золото и серебро.'); } }
    ]
  });

  /* ======================= 6. Почему металлы ======================= */
  reg('dg-metals3d', {
    title: 'Почему деньгами стали металлы', lead: 'Четыре постамента — четыре свойства. Кнопка «Разрезать» показывает делимость: слиток делится без потерь, шкурка — нет.',
    radius: 14, phi: 1.0, theta: 0.3, targetY: 1.3, height: 410, hint: 'Нажми на постамент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var P = [
        ['сохраняемость', '<b>Сохраняемость.</b> Металлы устойчивы к коррозии. Железо ржавеет, зерно гниёт, а золото лежит тысячи лет.'],
        ['редкость', '<b>Редкость.</b> Золота мало, поэтому даже маленький кусочек ценен. Большую стоимость легко унести.'],
        ['однородность', '<b>Однородность.</b> Любой грамм золота такой же, как другой. Не надо спорить, чья шкурка лучше.'],
        ['делимость', '<b>Делимость.</b> Две половинки слитка вместе стоят как целый. Разрезанная шкурка потеряла ценность.']
      ];
      P.forEach(function (p, i) { var x = -6 + i * 4; c.box3(2.6, 0.8, 2.6, STONE, [x, 0.4, 0], p[1]); c.label(p[0], [x, 3.1, 0], 0.3); });
      c.box3(0.9, 0.35, 0.5, RUST, [-6.7, 1, 0], '<b>Железо</b> ржавеет — плохо хранит стоимость.');
      c.box3(0.9, 0.35, 0.5, GOLD, [-5.3, 1, 0], P[0][1]).material.metalness = 0.2;
      var sm = c.box3(0.4, 0.2, 0.25, GOLD, [-2, 0.9, 0], P[1][1]); sm.material.metalness = 0.2;
      c.mesh(new T.DodecahedronGeometry(0.9), '#8d8d8d', '<b>Камень</b> того же веса — ничего не стоит. Редкость решает.').position.set(-1.4, 1.6, -0.6);
      for (var i = 0; i < 3; i++) { var b = c.box3(0.7, 0.3, 0.4, GOLD, [2, 0.95 + i * 0.32, 0], P[2][1]); b.material.metalness = 0.2; }
      var L = c.box3(0.6, 0.35, 0.5, GOLD, [5.7, 1, -0.5], P[3][1]), R = c.box3(0.6, 0.35, 0.5, GOLD, [6.3, 1, -0.5], P[3][1]);
      L.material.metalness = R.material.metalness = 0.2;
      var F1 = c.box3(0.6, 0.08, 0.6, FUR, [5.7, 0.84, 0.7], '<b>Шкурка куницы.</b> Разрезали — и она никому не нужна.'), F2 = c.box3(0.6, 0.08, 0.6, FUR, [6.3, 0.84, 0.7], '<b>Шкурка куницы.</b> Разрезали — и она никому не нужна.');
      var st = { cut: 0, cur: 0 };
      c.userData = st;
      c.onFrame(function () {
        st.cur += (st.cut - st.cur) * 0.08;
        L.position.x = 5.7 - st.cur * 0.6; R.position.x = 6.3 + st.cur * 0.6;
        F1.position.x = 5.7 - st.cur * 0.5; F2.position.x = 6.3 + st.cur * 0.5; F1.rotation.z = st.cur * 0.5; F2.rotation.z = -st.cur * 0.5;
        F1.material.color.set(st.cur > 0.5 ? '#5a3b25' : FUR); F2.material.color.copy(F1.material.color);
      });
    },
    chips: [
      { t: 'Разрезать', small: 'делимость', on: function (c) { c.userData.cut = 1; c.setView(0.3, 1.0, 8, 1, 6); c.say('Слиток: <b>½ + ½ = 1</b>. Шкурка: <b>½ + ½ = 0</b>. Поэтому деньги — металл.'); } },
      { t: 'Собрать', on: function (c) { c.userData.cut = 0; c.setView(0.3, 1.0, 14, 1.3, 0); c.say('Сохраняемость, редкость, однородность, делимость — <b>вопрос на экзамене</b>.'); } }
    ]
  });

  /* ======================= 7. Пять функций ======================= */
  reg('dg-functions3d', {
    title: 'Пять функций денег', lead: 'В центре — монета. Вокруг неё по орбите летают пять функций. Нажми на любую.',
    radius: 12, phi: 0.9, theta: 0.3, targetY: 1.4, height: 420, hint: 'Нажми на предмет на орбите.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var center = coin(c, 0, 1.6, 0, '<b>Деньги</b> — всеобщий эквивалент. Выполняют пять функций.', null, 1.0); center.rotation.x = Math.PI / 2;
      var F = [
        ['мера\nстоимости', BLUE, '<b>1. Мера стоимости.</b> Деньги измеряют стоимость товаров (ценник). Работают <b>мысленно</b>: деньги не нужно держать в руках.', function (g) { g.add(c.box3(2, 0.1, 0.35, '#ffd27a', [0, 0, 0])); for (var i = 0; i < 9; i++) g.add(c.box3(0.04, 0.1, 0.2, DARK, [-0.9 + i * 0.225, 0.08, 0])); }],
        ['средство\nобращения', GREEN, '<b>2. Средство обращения.</b> Т — Д — Т. Деньги и товар движутся <b>одновременно</b>: заплатил — сразу получил.', function (g) { var a = c.mesh(new T.TorusGeometry(0.5, 0.08, 10, 30, Math.PI * 1.6), GREEN); g.add(a); }],
        ['средство\nплатежа', PURPLE, '<b>3. Средство платежа.</b> Движение денег <b>разъединено во времени</b> с движением товара: кредит, рассрочка, зарплата, налоги.', function (g) { g.add(c.box3(1, 1.1, 0.15, PAPER, [0, 0, 0])); g.add(c.box3(1, 0.25, 0.17, RED, [0, 0.45, 0])); }],
        ['средство\nнакопления', GOLD, '<b>4. Средство накопления (сбережения).</b> Отложить сейчас — потратить потом. Лектор: <b>самая сложная</b> функция (инфляция «съедает» сбережения).', function (g) { g.add(c.box3(1, 1, 1, DARK, [0, 0, 0])); var d = c.mesh(new T.CylinderGeometry(0.25, 0.25, 0.1, 20), SILVER); d.rotation.x = Math.PI / 2; d.position.z = 0.52; g.add(d); }],
        ['мировые\nденьги', RED, '<b>5. Мировые деньги.</b> Обслуживают торговлю между странами. Раньше — золото, сейчас — ведущие валюты.', function (g) { g.add(c.mesh(new T.SphereGeometry(0.6, 24, 16), '#3b7dd8')); var r = c.mesh(new T.TorusGeometry(0.62, 0.04, 8, 30), GREEN); r.rotation.x = 1.2; g.add(r); }]
      ];
      var sats = [];
      F.forEach(function (f, i) {
        var g = new T.Group(); c.root.add(g); f[3](g);
        g.traverse(function (x) { if (x.isMesh) x.userData.info = f[2]; });
        g.userData.info = f[2];
        var lb = c.label(f[0], [0, 0, 0], 0.4, f[1]);
        sats.push({ g: g, lb: lb, a: i / 5 * Math.PI * 2 });
      });
      c.onFrame(function (t) {
        center.rotation.z = t * 0.8;
        sats.forEach(function (s) { var a = s.a + t * 0.25, x = Math.cos(a) * 4.6, z = Math.sin(a) * 4.6; s.g.position.set(x, 1.6, z); s.g.rotation.y = -a; s.lb.position.set(x, 3.1, z); });
      });
    }
  });

  /* ======================= 8. Диверсификация ======================= */
  reg('dg-diversify3d', {
    title: 'Не складывай все яйца в одну корзину', lead: 'Слева все сбережения в одной корзине, справа — в четырёх: квартира, золото, депозит, акции. Нажми «Уронить корзину».',
    radius: 11, phi: 1.0, theta: 0.2, targetY: 1, height: 400, hint: 'Нажми на корзину или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      function basket(x, z, col, info) { var b = c.mesh(new T.CylinderGeometry(0.9, 0.6, 0.8, 20, 1, true), col, info, { side: T.DoubleSide }); b.position.set(x, 0.4, z); return b; }
      function eggs(x, z, n, info) { var arr = []; for (var i = 0; i < n; i++) { var e = c.mesh(new T.SphereGeometry(0.22, 12, 10), '#fff8e8', info); e.scale.y = 1.3; e.position.set(x + (i % 3 - 1) * 0.4, 0.6 + Math.floor(i / 3) * 0.3, z + ((i * 7) % 3 - 1) * 0.25); arr.push(e); } return arr; }
      var iOne = '<b>Всё в одном месте.</b> Упадёт эта корзина — потеряешь всё.';
      var b1 = basket(-4, 0, WOOD, iOne), e1 = eggs(-4, 0, 8, iOne);
      c.label('всё в одном', [-4, 2.5, 0], 0.3);
      var names = [['квартира', STONE], ['золото', GOLD], ['депозит', PURPLE], ['акции', '#e39b5b']], bs = [], es = [];
      names.forEach(function (n, i) {
        var x = 1.5 + (i % 2) * 3, z = -1.5 + Math.floor(i / 2) * 3, info = '<b>' + n[0] + '</b> — одна из корзин. Диверсификация: если одна «упадёт», остальные уцелеют.';
        bs.push(basket(x, z, n[1], info)); es.push(eggs(x, z, 2, info)); c.label(n[0], [x, 2, z], 0.26);
      });
      var st = { drop: 0, cur: 0 }; c.userData = st;
      c.onFrame(function () {
        st.cur += (st.drop - st.cur) * 0.06;
        b1.rotation.z = st.cur * 1.4; b1.position.y = 0.4 - st.cur * 0.1;
        e1.forEach(function (e, i) { e.position.x = -4 + (i % 3 - 1) * 0.4 + st.cur * (1 + i * 0.25); e.position.y = Math.max(0.2, 0.6 + Math.floor(i / 3) * 0.3 - st.cur * 0.8); e.scale.y = 1.3 - st.cur * 0.8; });
        bs[3].rotation.z = st.cur * 1.4;
        es[3].forEach(function (e, i) { e.position.y = Math.max(0.2, 0.6 - st.cur * 0.4); e.scale.y = 1.3 - st.cur * 0.8; });
      });
    },
    chips: [
      { t: 'Уронить корзину', on: function (c) { c.userData.drop = 1; c.say('Одна корзина упала. <b>Слева потеряно всё</b>, справа — только «акции», 3 из 4 корзин целы.'); } },
      { t: 'Поднять', on: function (c) { c.userData.drop = 0; c.say('Лектор: «и квартира, и золото, и депозит» — сбережения лучше <b>разделить</b>.'); } }
    ]
  });

  /* ======================= 9. Ассигнации ======================= */
  reg('dg-assign3d', {
    title: 'Ассигнации Екатерины II (1769)', lead: 'Печатный станок выпускает ассигнации. Чем выше стопка бумажных денег, тем ниже «серебряная» цена одного бумажного рубля.',
    radius: 11, phi: 1.05, theta: 0.4, targetY: 1.5, height: 400, hint: 'Нажимай годы внизу.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iP = '<b>Печатный станок.</b> Ассигнации печатали, чтобы оплатить войны (с Турцией). Сначала их свободно меняли на монеты.';
      c.box3(2, 1.6, 1.6, DARK, [-3.5, 0.8, 0], iP); c.box3(2.4, 0.3, 2, WOOD, [-3.5, 1.8, 0], iP);
      var press = c.box3(1.6, 0.3, 1.4, SILVER, [-3.5, 2.4, 0], iP);
      c.label('станок', [-3.5, 3.4, 0], 0.3);
      var iN = '<b>Ассигнации в обращении.</b> Их печатали всё больше, а товаров больше не становилось.';
      var notes = []; for (var i = 0; i < 30; i++) { var n = bill(c, 0, 0.05 + i * 0.07, 0, iN, null, '#c9d6a0'); n.rotation.y = (i % 5) * 0.06; n.visible = false; notes.push(n); }
      c.label('ассигнации', [0, 3.2, 0], 0.3);
      var iR = '<b>Сколько стоил 1 бумажный рубль в серебре.</b> 1769 — почти 1 рубль. К 1815 году — около 20 копеек.';
      var silver = c.box3(1, 1, 1, SILVER, [3.5, 0.5, 0], iR); silver.material.metalness = 0.2;
      var lbl = c.label('1 ₽ = 100 коп.', [3.5, 3, 0], 0.3, '#c9ced8');
      var st = { n: 3, v: 1 }; c.userData = { st: st, set: function (n, v, t) { st.n = n; st.v = v; lbl.material.map.dispose(); c.root.remove(lbl); lbl = c.label(t, [3.5, 3, 0], 0.3, '#c9ced8'); } };
      c.onFrame(function (t) {
        notes.forEach(function (n, i) { n.visible = i < st.n; });
        silver.scale.y += (st.v - silver.scale.y) * 0.06; silver.position.y = silver.scale.y / 2;
        press.position.y = 2.4 + 0.2 * Math.abs(Math.sin(t * 3));
      });
    },
    chips: [
      { t: '1769', on: function (c) { c.userData.set(3, 1, '1 ₽ ≈ 100 коп.'); c.say('<b>1769, Екатерина II</b> — первые бумажные деньги России. Меняются на монеты один к одному.'); } },
      { t: '1790-е', on: function (c) { c.userData.set(14, 0.7, '1 ₽ ≈ 70 коп.'); c.say('Войны и расходы — ассигнаций печатают всё больше, курс падает.'); } },
      { t: '1815', on: function (c) { c.userData.set(30, 0.2, '1 ₽ ≈ 20 коп.'); c.say('После войны 1812 года бумажный рубль стоит около <b>20 копеек</b> серебром. Это инфляция: денег больше, товаров нет.'); } }
    ]
  });

  /* ======================= 10. Вексель и банкнота ======================= */
  reg('dg-veksel3d', {
    title: 'Вексель переходит из рук в руки', lead: 'Купец А должен купцу Б и пишет вексель. Б расплачивается этим векселем с В. А банк выпускает свой вексель — банкноту, которой верят все.',
    radius: 13, phi: 1.0, theta: 0.3, targetY: 1.2, height: 410, hint: 'Нажми на людей, бумагу или банк.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var iA = '<b>Должник (А)</b> выписал вексель: «обязуюсь уплатить 1000 рублей через 3 месяца».', iB = '<b>Б</b> получил вексель и может не ждать срока: расплатиться им с В.', iC = '<b>В</b> получит деньги с А, когда наступит срок.';
      person(c, -5, 2, BLUE, iA, null, 1.2); person(c, -1.5, 2, GREEN, iB, null, 1.2); person(c, 2, 2, PURPLE, iC, null, 1.2);
      c.label('А', [-5, 2.2, 2], 0.3); c.label('Б', [-1.5, 2.2, 2], 0.3); c.label('В', [2, 2.2, 2], 0.3);
      var iV = '<b>Вексель</b> — письменное долговое обязательство: <b>сумма долга и срок уплаты</b>. Может переходить из рук в руки.';
      var v = c.box3(0.9, 0.04, 0.6, PAPER, [-5, 1.6, 2], iV);
      var iBank = '<b>Банк.</b> Банкнота — это <b>вексель банка</b>: обещание выплатить владельцу деньги (раньше — золото). Ей верят все, поэтому она ходит как деньги.';
      c.box3(3.2, 2, 2.2, STONE, [4.8, 1, -2.2], iBank);
      for (var i = 0; i < 4; i++) c.mesh(new T.CylinderGeometry(0.15, 0.15, 2, 12), PAPER, iBank).position.set(3.6 + i * 0.8, 1, -1.05);
      c.mesh(new T.ConeGeometry(2.3, 0.8, 4), STONE, iBank).position.set(4.8, 2.4, -2.2);
      c.label('банк', [4.8, 3.5, -2.2], 0.3);
      var notes = []; for (var k = 0; k < 4; k++) { var n = bill(c, 1 - k * 1.6, 0.5, -2.2, iBank, null, '#9fd3a8'); notes.push(n); }
      c.onFrame(function (t) {
        var p = (t * 0.25) % 1, x = p < 0.5 ? -5 + p * 2 * 3.5 : -1.5 + (p - 0.5) * 2 * 3.5;
        v.position.x = x; v.position.y = 1.6 + 0.4 * Math.sin(p * Math.PI * 2 * 2);
        notes.forEach(function (n, i) { n.position.x = 3 - ((t * 0.8 + i * 1.6) % 6.4); n.position.y = 0.5 + 0.15 * Math.sin(t * 3 + i); });
      });
    }
  });

  /* ======================= 11. Электронные деньги ======================= */
  reg('dg-emoney3d', {
    title: 'Три вида электронных денег', lead: 'Три башни: банк с безналичными счетами, цепочка блоков криптовалюты (без государства) и Центробанк с цифровыми кошельками.',
    radius: 14, phi: 1.0, theta: 0.25, targetY: 1.6, height: 420, hint: 'Нажми на башню или кнопку.',
    build: function (c) {
      var T = c.THREE, G = { b: group(c), k: group(c), d: group(c) }; c.ground(9);
      var iB = '<b>1. Безналичные деньги.</b> Обычные рубли в виде записей на счетах коммерческого банка. Все операции отслеживаются.';
      for (var i = 0; i < 4; i++) into(G.b, c.box3(1.6, 0.6, 1.2, DARK, [-5, 0.35 + i * 0.7, 0], iB));
      for (var j = 0; j < 4; j++) into(G.b, c.box3(0.2, 0.08, 0.02, GREEN, [-5.5, 0.4 + j * 0.7, 0.62], iB));
      into(G.b, c.label('банк\nсчета', [-5, 3.8, 0], 0.28));
      var iK = '<b>2. Криптовалюты (виртуальные валюты).</b> Выпускает не государство: записи хранятся в цепочке блоков у тысяч участников. Курс сильно колеблется.';
      var chain = []; for (var k = 0; k < 6; k++) { var bl = into(G.k, c.box3(0.7, 0.7, 0.7, '#e39b5b', [0, 0.5, -2.5 + k * 1.0], iK)); chain.push(bl); if (k) into(G.k, c.link([0, 0.5, -3 + k * 1.0], [0, 0.5, -2.5 + k * 1.0 - 0.35], GREY, 0.05, iK)); }
      into(G.k, c.label('криптовалюта', [0, 2.2, 0], 0.28));
      var iD = '<b>3. Цифровая валюта центрального банка.</b> Цифровой рубль выпускает сам Банк России, он хранится в цифровом кошельке на его платформе. Можно платить <b>даже без интернета</b> (офлайн-режим).';
      into(G.d, c.box3(2.4, 1.6, 2, STONE, [5, 0.8, 0], iD));
      into(G.d, c.mesh(new T.ConeGeometry(1.8, 0.8, 4), STONE, iD)).position.set(5, 2, 0);
      into(G.d, c.label('ЦБ\nцифровой ₽', [5, 3.5, 0], 0.28));
      var phone = into(G.d, c.box3(0.5, 0.9, 0.08, DARK, [5, 1, 2.2], iD)); into(G.d, c.box3(0.4, 0.7, 0.02, '#9fd3ff', [5, 1, 2.25], iD));
      var off = into(G.d, c.label('офлайн ✓', [5, 1.9, 2.2], 0.22, '#4cc38a'));
      c.userData = G;
      c.onFrame(function (t) { chain.forEach(function (b, i) { b.position.y = 0.5 + 0.15 * Math.sin(t * 2 + i); b.rotation.y = t * 0.5 + i; }); phone.rotation.y = 0.4 * Math.sin(t); });
    },
    chips: [
      { t: 'Безнал', on: function (c) { fade(c.userData, ['b']); c.setView(0.2, 1, 10, 1.5, -5); c.say('Рубли на карте — <b>записи в базе банка</b>.'); } },
      { t: 'Крипта', on: function (c) { fade(c.userData, ['k']); c.setView(0.9, 1, 10, 1, 0); c.say('<b>Криптовалюта</b> — без государства и ЦБ.'); } },
      { t: 'Цифровой ₽', on: function (c) { fade(c.userData, ['d']); c.setView(0.2, 1, 10, 1.5, 5); c.say('Закон — с <b>1 августа 2023</b>; массовое внедрение — с <b>1 сентября 2026</b>.'); } },
      { t: 'Все', on: function (c) { fade(c.userData, ['b', 'k', 'd']); c.setView(0.25, 1, 14, 1.6, 0); c.say('Три вида: безналичные, криптовалюты, цифровые валюты ЦБ.'); } }
    ]
  });

  /* ======================= 12. Уравнение обмена ======================= */
  reg('dg-fisher3d', {
    title: 'Весы Фишера: M · V = P · Q', lead: 'Слева — деньги (сколько их × сколько раз потратили), справа — товары (цена × количество). Весы всегда в равновесии. Попробуй напечатать денег.',
    radius: 13, phi: 1.05, theta: 0.15, targetY: 2, height: 420, hint: 'Нажимай кнопки — следи за ценниками.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iS = '<b>Уравнение обмена</b> Ирвинга Фишера: M·V = P·Q. Сумма потраченных денег равна стоимости купленных товаров.';
      c.box3(0.4, 3.6, 0.4, WOOD, [0, 1.8, 0], iS); c.mesh(new T.ConeGeometry(1, 0.6, 4), WOOD, iS).position.set(0, 0.3, 0);
      var beam = new T.Group(); c.root.add(beam); beam.position.set(0, 3.7, 0);
      beam.add(c.box3(8, 0.18, 0.3, GOLD, [0, 0, 0], iS));
      var pl = new T.Group(), pr = new T.Group(); beam.add(pl); beam.add(pr); pl.position.x = -3.6; pr.position.x = 3.6;
      [pl, pr].forEach(function (p) { var d = c.mesh(new T.CylinderGeometry(1.3, 1.3, 0.1, 30), SILVER, iS); d.position.y = -1.6; p.add(d); p.add(c.link([0, 0, 0], [0, -1.55, 0], GREY, 0.03)); });
      var iM = '<b>M</b> — масса денег. <b>V</b> — скорость обращения: сколько раз за год одна купюра переходит из рук в руки.';
      var coins = []; for (var i = 0; i < 12; i++) { var cn = coin(c, (i % 3 - 1) * 0.5, -1.5 + Math.floor(i / 3) * 0.11, 0, iM, null, 0.3); pl.add(cn); coins.push(cn); }
      var iQ = '<b>Q</b> — количество товаров. <b>P</b> — уровень цен (высота ценников).';
      var goods = []; for (var g = 0; g < 4; g++) { var b = c.box3(0.5, 0.5, 0.5, [RED, BLUE, GREEN, PURPLE][g], [(g % 2 - 0.5) * 0.7, -1.3, (Math.floor(g / 2) - 0.5) * 0.7], iQ); pr.add(b); goods.push(b); }
      var tags = goods.map(function (b) { var t = c.box3(0.12, 0.6, 0.12, GOLD, [b.position.x, -0.7, b.position.z], iQ); pr.add(t); return t; });
      var ml = c.label('M·V', [-3.6, 5, 0], 0.4), pq = c.label('P·Q', [3.6, 5, 0], 0.4);
      var st = { m: 1, q: 1, p: 1, tilt: 0 }; c.userData = st;
      c.onFrame(function (t) {
        var nm = Math.round(6 * st.m); coins.forEach(function (x, i) { x.visible = i < nm; x.rotation.y = t * 2 * (i % 2 ? 1 : -1); });
        var nq = Math.round(2 * st.q); goods.forEach(function (x, i) { x.visible = i < nq; tags[i].visible = i < nq; });
        var target = st.m / (st.p * st.q); st.tiltGoal = Math.max(-0.25, Math.min(0.25, (target - 1) * 0.25));
        st.tilt += ((st.tiltGoal || 0) - st.tilt) * 0.05; beam.rotation.z = st.tilt;
        pl.rotation.z = pr.rotation.z = -st.tilt;
        tags.forEach(function (x) { x.scale.y += (st.p - x.scale.y) * 0.05; x.position.y = -1.05 + 0.3 * x.scale.y; });
      });
    },
    chips: [
      { t: 'Напечатать деньги', small: 'M × 2', on: function (c) { var s = c.userData; s.m = 2; s.q = 1; s.p = 1; c.say('Денег стало вдвое больше, товаров — столько же. Весы перекосило…'); setTimeout(function () { s.p = 2; c.say('…и <b>цены выросли вдвое</b> — равновесие вернулось. Это <b>инфляция</b>.'); }, 1800); } },
      { t: 'Больше товаров', small: 'M и Q × 2', on: function (c) { var s = c.userData; s.m = 2; s.q = 2; s.p = 1; c.say('Денег и товаров стало вдвое больше — <b>цены не меняются</b>.'); } },
      { t: 'Сброс', on: function (c) { var s = c.userData; s.m = 1; s.q = 1; s.p = 1; c.say('M · V = P · Q.'); } }
    ]
  });

  /* ======================= 13. Денежные системы ======================= */
  reg('dg-system3d', {
    title: 'Денежные системы: от металла к цифре', lead: 'Лента времени. Столбы — ключевые даты денежной истории России и Англии. Над лентой — типы систем: два металла, один металл, бумага и кредит.',
    radius: 15, phi: 1.0, theta: 0.2, targetY: 1.5, height: 420, hint: 'Нажми на столб или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(10);
      c.box3(18, 0.15, 0.6, DARK, [0, 0.1, 2], 'Лента времени.');
      var D = [
        [1769, 'ассигнации', '#c9d6a0', '<b>1769</b> — Екатерина II выпускает ассигнации, первые бумажные деньги России.'],
        [1816, 'Англия: золото', GOLD, '<b>1816</b> — Англия вводит золотой стандарт (действовал до 1914).'],
        [1897, 'реформа Витте', GOLD, '<b>1897</b> — реформа С. Ю. Витте: в России золотой стандарт, рубль свободно меняется на золото.'],
        [1914, 'конец размена', RED, '<b>1914</b> — Первая мировая: размен на золото прекращён в Англии и России.'],
        [2023, 'цифровой ₽', BLUE, '<b>1 августа 2023</b> — закон о цифровом рубле вступил в силу.'],
        [2026, 'массово', PURPLE, '<b>1 сентября 2026</b> — массовое внедрение цифрового рубля крупнейшими банками.']
      ];
      D.forEach(function (d, i) {
        var x = -7.5 + i * 3, h = 1 + i * 0.35;
        c.box3(0.5, h, 0.5, d[2], [x, h / 2, 2], d[3]);
        c.label(d[0] + '\n' + d[1], [x, h + 0.9, 2], 0.24);
      });
      var iBi = '<b>Биметаллизм</b> — всеобщий эквивалент из <b>двух металлов</b>: золота и серебра.';
      var iMo = '<b>Монометаллизм</b> — <b>один металл</b>. Золотой стандарт: бумажные деньги свободно меняются на золото.';
      var iPa = '<b>Бумажно-кредитная система</b> — золото ушло из обращения, в ходу бумажные, кредитные и электронные деньги. Держится на доверии к государству.';
      coin(c, -6.4, 0.9, -2.5, iBi, null, 0.6).rotation.x = Math.PI / 2; coin(c, -5, 0.9, -2.5, iBi, null, 0.6, SILVER).rotation.x = Math.PI / 2;
      c.label('биметаллизм', [-5.7, 2.2, -2.5], 0.28);
      coin(c, 0, 0.9, -2.5, iMo, null, 0.7).rotation.x = Math.PI / 2;
      c.label('монометаллизм', [0, 2.2, -2.5], 0.28);
      bill(c, 5.5, 0.9, -2.5, iPa, null).rotation.x = Math.PI / 2; c.box3(0.5, 0.9, 0.08, DARK, [6.6, 0.6, -2.5], iPa);
      c.label('бумажно-кредитная', [6, 2.2, -2.5], 0.28);
      arrow(c, [-4, 0.9, -2.5], [-1, 0.9, -2.5], GREY, null); arrow(c, [1, 0.9, -2.5], [4.6, 0.9, -2.5], GREY, null);
    },
    chips: [
      { t: 'Металл', on: function (c) { c.setView(-0.1, 1.0, 11, 1, -3, -1); c.say('<b>Металлические системы</b>: биметаллизм и монометаллизм (золотой стандарт).'); } },
      { t: 'Бумага', on: function (c) { c.setView(0.4, 1.0, 11, 1, 5, -1); c.say('<b>Бумажно-кредитная система</b> — как сейчас.'); } },
      { t: 'Лента', on: function (c) { c.setView(0.2, 1.0, 15, 1.5, 0, 0); c.say('1769 → 1816 → 1897 → 1914 → 2023 → 2026.'); } }
    ]
  });

  /* ======================= Мини-тест ======================= */
  HubWidgets.register('dg-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Деньги</b></div><p class="wg-lead">12 вопросов по лекции 12.10.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Деньги по определению лектора — это…', ['изобретение правительства', 'результат развития товарно-денежных отношений', 'любая бумага с печатью'], 1, 'Из массы товаров выделился товар — всеобщий эквивалент.'],
      ['Что такое ликвидность?', ['Способность быстро обменяться на деньги без потерь', 'Количество денег в стране', 'Доходность вклада'], 0, 'Лектор просила сказать просто: «способность обменяться».'],
      ['Какой подход к происхождению денег у Маркса?', ['Субъективный', 'Объективный (эволюционный)', 'Психологический'], 1, 'Деньги выросли из развития обмена, их никто не придумывал.'],
      ['Главная проблема бартера?', ['Высокие налоги', 'Нужно найти того, кому нужен твой товар и у кого есть нужный тебе', 'Инфляция'], 1, 'Это проблема двойного совпадения потребностей.'],
      ['Какая форма стоимости идёт третьей?', ['Развёрнутая', 'Денежная', 'Всеобщая'], 2, 'Простая → развёрнутая → всеобщая → денежная.'],
      ['Почему делимость важна для денег?', ['Две половинки слитка стоят как целый', 'Металл легко гнуть', 'Монеты круглые'], 0, 'Разрезанная шкурка теряет ценность, а слиток — нет.'],
      ['Деньги и товар движутся одновременно. Какая это функция?', ['Средство платежа', 'Средство обращения', 'Мера стоимости'], 1, 'Средство платежа — когда есть разрыв во времени.'],
      ['Какую функцию лектор назвала самой сложной?', ['Средство накопления', 'Мировые деньги', 'Мера стоимости'], 0, 'Сбережения — золото, депозит, недвижимость; главное — диверсификация.'],
      ['Когда в России появились бумажные деньги?', ['1704, Пётр I', '1769, Екатерина II', '1897, Витте'], 1, 'Ассигнации Екатерины II.'],
      ['Банкнота — это…', ['вексель банка', 'чек покупателя', 'монета из бумаги'], 0, 'Вексель — письменное долговое обязательство с суммой и сроком.'],
      ['Чем цифровой рубль отличается от рубля на карте?', ['Его выпускает криптобиржа', 'Он хранится на платформе ЦБ, можно платить офлайн', 'Это то же самое'], 1, 'Закон о цифровом рубле — с 1 августа 2023 года.'],
      ['В уравнении M·V = P·Q буква V — это…', ['объём товаров', 'скорость обращения денег', 'уровень цен'], 1, 'Сколько раз за год одна купюра переходит из рук в руки.']
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
