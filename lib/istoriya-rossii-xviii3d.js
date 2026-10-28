/* 3D-модели и мини-тест к конспекту «Российская империя в XVIII веке (1725–1801): окна возможностей, перевороты, просвещённый абсолютизм» (История России, лекция 12, 09.10).
   В Markdown: @@graph:ru12-window3d@@ @@graph:ru12-windows3d@@ @@graph:ru12-pause3d@@ @@graph:ru12-favorite3d@@ @@graph:ru12-throne3d@@
   @@graph:ru12-conditions3d@@ @@graph:ru12-1730s3d@@ @@graph:ru12-guard3d@@ @@graph:ru12-councils3d@@ @@graph:ru12-commission3d@@
   @@graph:ru12-pool3d@@ @@graph:ru12-physio3d@@ @@graph:ru12-catherine3d@@ @@graph:ru12-paul3d@@ @@graph:ru12-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa', WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', WATER = '#3d7fc4', GUARD = '#2f6e4a';
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 1.45, col); }; b(c); };
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
  function crown(c, p, s, y) {
    var T = c.THREE; s = s || 1;
    var k = c.mesh(new T.CylinderGeometry(0.2 * s, 0.24 * s, 0.18 * s, 8, 1, true), GOLD, null, { metalness: 0.6, roughness: 0.3, side: T.DoubleSide });
    k.position.y = (y || 1.4) * s; p.add(k); return k;
  }
  function guardsman(c, x, z, info, g, s) {
    var p = person(c, x, z, GUARD, info, g, s);
    var T = c.THREE, hat = c.mesh(new T.CylinderGeometry(0.16 * (s || 1), 0.2 * (s || 1), 0.32 * (s || 1), 10), '#1d1f2b', info);
    hat.position.y = 1.42 * (s || 1); p.add(hat);
    var gun = c.mesh(new T.CylinderGeometry(0.03, 0.03, 1.2 * (s || 1), 6), '#3b2a1e', info); gun.position.set(0.3 * (s || 1), 0.9 * (s || 1), 0); p.add(gun);
    return p;
  }
  function throne(c, x, z, info, g, s) {
    var T = c.THREE; s = s || 1;
    var t = new T.Group(); (g || c.root).add(t); t.position.set(x, 0, z);
    var seat = c.mesh(new T.BoxGeometry(1.2 * s, 0.5 * s, 1 * s), '#8e2b2b', info); seat.position.y = 0.45 * s; t.add(seat);
    var back = c.mesh(new T.BoxGeometry(1.2 * s, 1.6 * s, 0.2 * s), '#8e2b2b', info); back.position.set(0, 1.2 * s, -0.45 * s); t.add(back);
    var top = c.mesh(new T.SphereGeometry(0.18 * s, 12, 8), GOLD, info, { metalness: 0.6, roughness: 0.3 }); top.position.set(0, 2.1 * s, -0.45 * s); t.add(top);
    var st = c.mesh(new T.BoxGeometry(1.8 * s, 0.2 * s, 1.6 * s), GOLD, info); st.position.y = 0.1 * s; t.add(st);
    return t;
  }
  function house(c, x, z, col, info, g, s, roof) {
    var T = c.THREE; s = s || 1;
    var h = new T.Group(); (g || c.root).add(h); h.position.set(x, 0, z);
    var b = c.mesh(new T.BoxGeometry(1 * s, 0.8 * s, 1 * s), col, info); b.position.y = 0.4 * s; h.add(b);
    var r = c.mesh(new T.ConeGeometry(0.8 * s, 0.6 * s, 4), roof || '#7a4b32', info); r.position.y = 1.1 * s; r.rotation.y = Math.PI / 4; h.add(r);
    return h;
  }
  function scroll(c, x, y, z, info, g, s) {
    var T = c.THREE; s = s || 1;
    var sc = new T.Group(); (g || c.root).add(sc); sc.position.set(x, y, z);
    var p = c.mesh(new T.BoxGeometry(1.1 * s, 1.5 * s, 0.04), '#f3e7c9', info); sc.add(p);
    [-1, 1].forEach(function (k) { var r = c.mesh(new T.CylinderGeometry(0.08 * s, 0.08 * s, 1.3 * s, 10), WOOD, info); r.rotation.z = Math.PI / 2; r.position.y = k * 0.78 * s; sc.add(r); });
    for (var i = 0; i < 5; i++) { var l = c.mesh(new T.BoxGeometry(0.75 * s, 0.05 * s, 0.02), '#6b5a4a', info); l.position.set(0, (0.45 - i * 0.22) * s, 0.04); sc.add(l); }
    return sc;
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
  function wig(c, p, s) { var T = c.THREE, w = c.mesh(new T.SphereGeometry(0.26 * (s || 1), 12, 8), '#f4f1ea'); w.position.y = 1.18 * (s || 1); w.scale.set(1.05, 0.8, 1.1); p.add(w); return w; }
  function fadeAll(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
  }
  function keysOf(G) { return Object.keys(G); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ======================= 1. Окно возможностей ======================= */
  reg('ru12-window3d', {
    title: 'Окно возможностей', lead: 'Стена — правящая элита. Пока она монолитна, внизу никто не может пробиться к решениям. Нажимай шаги по порядку: транзит власти → раскол элиты → окно открыто.',
    radius: 17, phi: 1.1, theta: 0.5, targetY: 2, height: 420, hint: 'Начни с «1. Закрыто».',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var wi = '<b>Правящая элита.</b> Пока она едина, решения принимает узкий круг, а остальным путь наверх закрыт.';
      var L = c.box3(4.2, 4, 0.8, STONE, [-2.1, 2, 0], wi), R = c.box3(4.2, 4, 0.8, STONE, [2.1, 2, 0], wi);
      c.wallL = L; c.wallR = R;
      c.label('элита', [0, 4.9, 0], 0.6);
      /* наверху — стол решений */
      var ti = '<b>Принятие государственных решений.</b> Через окно возможностей сюда могут попасть те, кто раньше не входил в элиту.';
      var tab = c.mesh(new T.CylinderGeometry(1.6, 1.6, 0.25, 30), WOOD, ti); tab.position.set(0, 0.8, -4.5);
      throne(c, 0, -6.3, '<b>Власть монарха.</b> При транзите власти её права нужно заново «обосновать» — нужна дополнительная легитимация.', null, 0.9);
      c.label('решения', [0, 2.2, -4.5], 0.5, '#f0c36b');
      /* контрэлита и народ */
      var ci = '<b>Контрэлита и активная часть населения.</b> Когда окно открыто, они могут быть услышаны, легально влиять на решения и войти в элиту.';
      c.crowd = [];
      for (var i = 0; i < 7; i++) c.crowd.push(person(c, -3 + i, 4 + (i % 2) * 0.8, i % 3 === 0 ? PURPLE : BLUE, ci, null, 0.8));
      c.label('контрэлита и «народ»', [0, 2.4, 5], 0.5, '#c9b8ff');
      /* социальный лифт */
      var li = '<b>Социальный лифт</b> — новый путь в элиту для тех, кто раньше не был к ней близок.';
      c.lift = c.box3(1.2, 0.15, 1.2, GOLD, [5.2, 0.1, 2.5], li);
      c.liftPole = c.box3(0.12, 4, 0.12, GREY, [5.9, 2, 2.5], li);
      c.liftMan = person(c, 5.2, 2.5, PURPLE, li, null, 0.7);
      /* молния раскола */
      var bolt = c.mesh(new T.ConeGeometry(0.25, 1.6, 4), RED, '<b>Раскол элиты</b> — обязательное условие: одной из групп нужна поддержка снизу, и она «открывает окно».'); bolt.position.set(0, 6, 0.6); bolt.rotation.z = Math.PI; c.bolt = bolt; bolt.visible = false;
      c.open = 0; c.goal = 0; c.liftGoal = 0;
      c.onFrame(function (t) {
        c.open += (c.goal - c.open) * 0.05;
        L.position.x = -2.1 - c.open * 1.6; R.position.x = 2.1 + c.open * 1.6;
        L.rotation.z = c.split ? Math.sin(t * 6) * 0.01 : 0;
        bolt.position.y = 6 + Math.sin(t * 5) * 0.2;
        c.crowd.forEach(function (p, i) {
          var go = Math.max(0, c.open - 0.6) / 0.4;
          var k = go > 0 ? ((t * 0.25 + i / 7) % 1) : 0;
          p.position.z = go > 0 ? lerp(4, -3.2, k) : 4 + (i % 2) * 0.8 + Math.sin(t * 2 + i) * 0.05;
          p.position.x = go > 0 ? lerp(-3 + i, (i - 3) * 0.35, k) : -3 + i;
        });
        c.lift.position.y += (c.liftGoal * 3.8 + 0.1 - c.lift.position.y) * 0.05;
        c.liftMan.position.y = c.lift.position.y + 0.08;
      });
    },
    chips: [
      { t: '1. Закрыто', on: function (c) { c.goal = 0; c.liftGoal = 0; c.split = false; c.bolt.visible = false; c.setView(0.5, 1.1, 17, 2); c.say('Система <b>долго не менялась</b> и стала мешать развитию, но элита едина — окна нет.'); } },
      { t: '2. Транзит власти', on: function (c) { c.goal = 0.15; c.split = false; c.bolt.visible = false; c.setView(-0.3, 1.0, 15, 1.5, 0, -4); c.say('<b>Транзит власти</b> (смена правителя) — самый частый повод. Особенно опасен в <b>слабой институциональной среде</b>, когда нет твёрдого закона о наследовании.'); } },
      { t: '3. Раскол элиты', on: function (c) { c.goal = 0.4; c.split = true; c.bolt.visible = true; c.setView(0.2, 1.1, 14, 3); c.say('<b>Раскол в элите</b> — обязательное условие. Одной из сторон нужна <b>дополнительная легитимация</b> — поддержка тех, кто ниже.'); } },
      { t: '4. Окно открыто', on: function (c) { c.goal = 1; c.liftGoal = 1; c.split = true; c.bolt.visible = true; c.setView(0.9, 1.0, 18, 1.5); c.say('Окно открыто: активная часть населения участвует в решениях, <b>контрэлита</b> может быть услышана и войти в элиту, появляются <b>социальные лифты</b>. Складываются несколько «вариантов будущего».'); } }
    ]
  });

  /* ======================= 2. Окна возможностей в истории России ======================= */
  reg('ru12-windows3d', {
    title: 'Окна возможностей в истории России', lead: 'Лента времени 1540–1770. Каждая арка — окно. Высота — сколько оно было открыто. 1725 — замурованная арка: окно не открылось.',
    radius: 22, phi: 1.1, theta: 0.35, targetY: 2, height: 420, hint: 'Нажми на арку.',
    build: function (c) {
      var T = c.THREE, X = function (y) { return (y - 1655) * 0.085; };
      c.box3(X(1775) - X(1535), 0.25, 1.4, '-panel2', [(X(1775) + X(1535)) / 2, 0.12, 0], null);
      [1550, 1600, 1650, 1700, 1750].forEach(function (y) { c.label(String(y), [X(y), 0.6, 1.3], 0.38, '#b9c0d8'); });
      var W = [
        ['rada', 1547, 1560, GREEN, '«Избранная рада»', '<b>«Избранная рада», 1547–1560.</b> Итог — первые элементы <b>сословно-представительной монархии</b>.'],
        ['smuta', 1598, 1618, BLUE, 'Смута', '<b>Смутное время, 1598–1618.</b> Итог — закрепление <b>сословной монархии</b>.'],
        ['sofia', 1682, 1689, PURPLE, 'Софья', '<b>Правление Софьи, 1682–1689.</b> Поворот к <b>абсолютной монархии</b>; отдельные элементы «окна» растянулись на всё правление Петра I.'],
        ['p1725', 1725, 1727, DARK, '1725 — нет', '<b>1725: смерть Петра I — окно НЕ открылось.</b> Появились признаки «закупоривания» элиты и остановки модернизации.'],
        ['a1730', 1730, 1730.2, GOLD, '1730', '<b>1730: призвание Анны Иоанновны и «Кондиции».</b> Окно было открыто меньше месяца: с 2 по 25 февраля.'],
        ['k1767', 1767, 1768, RED, '1767', '<b>1767: Уложенная комиссия Екатерины II.</b> Окно открывают «сверху» — по идеям просвещённого абсолютизма.']
      ];
      c.arches = {};
      W.forEach(function (w) {
        var g = group(c); c.arches[w[0]] = g;
        var x0 = X(w[1]), x1 = Math.max(X(w[2]), x0 + 0.5), h = 1.5 + (w[2] - w[1]) * 0.18, cx = (x0 + x1) / 2, wd = x1 - x0 + 0.8;
        into(g, c.box3(0.3, h, 0.9, w[3], [cx - wd / 2, h / 2 + 0.25, 0], w[5]));
        into(g, c.box3(0.3, h, 0.9, w[3], [cx + wd / 2, h / 2 + 0.25, 0], w[5]));
        into(g, c.box3(wd + 0.3, 0.3, 0.9, w[3], [cx, h + 0.4, 0], w[5]));
        if (w[0] === 'p1725') into(g, c.box3(wd - 0.1, h, 0.5, '#6b5a4a', [cx, h / 2 + 0.25, 0], w[5]));
        else { var glass = into(g, c.box3(wd - 0.15, h - 0.1, 0.06, '#cfe6ff', [cx, h / 2 + 0.25, 0], w[5])); glass.material.transparent = true; glass.material.opacity = 0.3; }
        into(g, c.label(w[4], [cx, h + 1.2, 0], 0.45));
      });
      c.onFrame(function (t) { c.arches.a1730.position.y = Math.abs(Math.sin(t * 2)) * 0.2; });
    },
    chips: [
      { t: 'Вся лента', on: function (c) { fadeAll(c.arches, keysOf(c.arches)); c.setView(0.35, 1.1, 22, 2); c.say('Окно открывается редко. За 220 лет — всего несколько раз, и каждое оставило след в устройстве власти.'); } },
      { t: '1547', small: 'Рада', on: function (c) { fadeAll(c.arches, ['rada']); c.setView(0.1, 1.0, 12, 2, (1553 - 1655) * 0.085, 0); c.pick(c.arches.rada.children[0]); } },
      { t: '1598', small: 'Смута', on: function (c) { fadeAll(c.arches, ['smuta']); c.setView(0.1, 1.0, 12, 2, (1608 - 1655) * 0.085, 0); c.pick(c.arches.smuta.children[0]); } },
      { t: '1682', small: 'Софья', on: function (c) { fadeAll(c.arches, ['sofia']); c.setView(0.1, 1.0, 12, 2, (1686 - 1655) * 0.085, 0); c.pick(c.arches.sofia.children[0]); } },
      { t: '1725', small: 'не открылось', on: function (c) { fadeAll(c.arches, ['p1725']); c.setView(0.1, 1.0, 11, 1.5, (1726 - 1655) * 0.085, 0); c.pick(c.arches.p1725.children[0]); } },
      { t: '1730', small: 'Кондиции', on: function (c) { fadeAll(c.arches, ['a1730']); c.setView(0.1, 1.0, 11, 1.5, (1730 - 1655) * 0.085, 0); c.pick(c.arches.a1730.children[0]); } },
      { t: '1767', small: 'Комиссия', on: function (c) { fadeAll(c.arches, ['k1767']); c.setView(0.1, 1.0, 11, 1.5, (1767 - 1655) * 0.085, 0); c.pick(c.arches.k1767.children[0]); } }
    ]
  });

  /* ======================= 3. Модернизационная пауза второй половины 1720-х ======================= */
  reg('ru12-pause3d', {
    title: 'Модернизационная пауза 1725–1730', lead: 'Всё, что построил Пётр, начинает «сдуваться»: флот тонет, школы пустеют, Сенат опускается, а над ним вырастает узкий Верховный тайный совет.',
    radius: 19, phi: 1.0, theta: 0.6, targetY: 1.5, height: 420, hint: 'Нажми на кнопку — увидишь, что именно откатилось.',
    build: function (c) {
      var T = c.THREE, G = { cap: group(c), fleet: group(c), school: group(c), senate: group(c), vts: group(c) };
      c.ground(9.5);
      /* столица: Петербург и Москва, звезда столицы переезжает */
      var ci = '<b>Столица фактически перенесена обратно в Москву</b> (двор Петра II жил в Москве).';
      into(G.cap, c.box3(1.6, 0.6, 1.6, '#a9c2f5', [-6, 0.3, 3], ci)); into(G.cap, c.label('Петербург', [-6, 1.5, 3], 0.4));
      into(G.cap, c.box3(1.6, 0.6, 1.6, '#e6c79a', [-6, 0.3, -3], ci)); into(G.cap, c.label('Москва', [-6, 1.5, -3], 0.4));
      var star = into(G.cap, c.mesh(new T.OctahedronGeometry(0.45), GOLD, ci, { emissive: '#ffb000', emissiveIntensity: 0.4 }));
      /* флот */
      var fi = '<b>Флот бездействует</b> и фактически перестаёт существовать: корабли гниют в гавани.';
      var sea = into(G.fleet, c.mesh(new T.CylinderGeometry(2.4, 2.4, 0.1, 30), WATER, fi)); sea.position.set(-1, 0.05, 4.5);
      var ship = new T.Group(); G.fleet.add(ship); ship.position.set(-1, 0.4, 4.5);
      var hull = c.mesh(new T.BoxGeometry(2, 0.5, 0.7), WOOD, fi); ship.add(hull);
      var mast = c.mesh(new T.CylinderGeometry(0.05, 0.05, 1.8, 6), '#3b2a1e', fi); mast.position.y = 1; ship.add(mast);
      var sail = c.mesh(new T.BoxGeometry(0.05, 1, 0.9), '#f4f1ea', fi); sail.position.y = 1.1; ship.add(sail);
      into(G.fleet, c.label('флот', [-1, 2.8, 4.5], 0.45));
      /* школы и академия */
      var si = '<b>Резко падает финансирование Академии и всех типов школ.</b>';
      var school = house(c, 3.5, 4, '#c8b48a', si, G.school, 1.4, '#5a6b8a');
      var coins = []; for (var i = 0; i < 5; i++) { var co = into(G.school, c.mesh(new T.CylinderGeometry(0.22, 0.22, 0.07, 14), GOLD, si, { metalness: 0.6 })); coins.push(co); }
      into(G.school, c.label('школы и Академия', [3.5, 3.2, 4], 0.4));
      /* Сенат */
      var se = '<b>Сенат</b> переименован из «Правительствующего» в «Высокий», потерял большую часть полномочий, должность <b>генерал-прокурора упразднена</b>.';
      var senate = into(G.senate, c.box3(2.4, 2.2, 2, '#d9d4c7', [3, 1.1, -2.5], se));
      var cols = []; for (var k = 0; k < 4; k++) cols.push(into(G.senate, c.box3(0.2, 2.2, 0.2, '#f4f1ea', [2.1 + k * 0.6, 1.1, -1.4], se)));
      into(G.senate, c.label('Сенат', [3, 3.4, -2.5], 0.45));
      /* Верховный тайный совет */
      var vi = '<b>Верховный тайный совет</b> (1726) — узкий круг приближённых, которые <b>узурпировали право</b> принимать государственные решения.';
      var vt = into(G.vts, c.mesh(new T.CylinderGeometry(1.3, 1.3, 0.2, 24), '#5b2b2b', vi)); vt.position.set(0, 4.6, -2.5);
      c.vtsPeople = [];
      for (var j = 0; j < 6; j++) { var a = j / 6 * Math.PI * 2; c.vtsPeople.push(person(c, Math.cos(a) * 1.5, -2.5 + Math.sin(a) * 1.5, '#7a2f2f', vi, G.vts, 0.6, 4.5)); }
      into(G.vts, c.label('Верховный тайный совет', [0, 6.6, -2.5], 0.45, '#ffb4ae'));
      c.groups = G;
      c.onFrame(function (t) {
        var k = (Math.sin(t * 0.6) * 0.5 + 0.5);
        star.position.set(-6, 1.3 + Math.sin(t * 3) * 0.1, lerp(3, -3, k)); star.rotation.y = t;
        ship.position.y = 0.4 - k * 0.55; ship.rotation.z = k * 0.35;
        coins.forEach(function (co, i) { var u = (t * 0.4 + i / 5) % 1; co.position.set(3.5 + 1.2 - u * 0.2, 2.6 - u * 2.6, 4 + (i - 2) * 0.3); co.material.opacity = 1 - u; co.material.transparent = true; });
        senate.scale.y = 1 - k * 0.45; senate.position.y = 1.1 * senate.scale.y; cols.forEach(function (cl) { cl.scale.y = senate.scale.y; cl.position.y = 1.1 * senate.scale.y; });
        G.vts.rotation.y = 0; c.vtsPeople.forEach(function (p, i) { p.position.y = 4.5 + Math.sin(t * 2 + i) * 0.05; });
      });
    },
    chips: [
      { t: 'Всё сразу', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.6, 1.0, 19, 1.5); c.say('После 1725 г. — <b>модернизационная пауза</b>. Главный показатель отката и незавершённости реформ — <b>фаворитизм</b>.'); } },
      { t: 'Столица', on: function (c) { fadeAll(c.groups, ['cap']); c.setView(-1.1, 0.9, 11, 1, -6, 0); c.say('Столица фактически вернулась в <b>Москву</b>.'); } },
      { t: 'Флот', on: function (c) { fadeAll(c.groups, ['fleet']); c.setView(0.4, 0.9, 10, 0.8, -1, 4.5); c.say('<b>Флот бездействует</b> и фактически перестаёт существовать.'); } },
      { t: 'Школы', on: function (c) { fadeAll(c.groups, ['school']); c.setView(0.9, 0.9, 10, 1.5, 3.5, 4); c.say('Финансирование <b>Академии и школ</b> резко падает.'); } },
      { t: 'Сенат', on: function (c) { fadeAll(c.groups, ['senate']); c.setView(1.6, 0.95, 11, 1.5, 3, -2.5); c.say('Сенат стал не «Правительствующим», а «Высоким» и <b>потерял полномочия</b>; генерал-прокурора нет.'); } },
      { t: 'ВТС', small: 'Верховный тайный совет', on: function (c) { fadeAll(c.groups, ['vts']); c.setView(0.2, 0.85, 11, 4.5, 0, -2.5); c.say('<b>Верховный тайный совет</b>: решения принимает узкий круг вокруг монарха. Модель «император — работник на троне» больше не работает.'); } }
    ]
  });

  /* ======================= 4. Фаворитизм ======================= */
  reg('ru12-favorite3d', {
    title: 'Как работает фаворитизм', lead: 'Слева — государственные учреждения. Справа — трон. Обычно доклады идут прямо к монарху (синие стрелки). Фаворит встаёт между ними и решает всё сам (красные).',
    radius: 17, phi: 1.05, theta: 0.3, targetY: 1.5, height: 420, hint: 'Сравни «Институты» и «Фаворит».',
    build: function (c) {
      var T = c.THREE, G = { inst: group(c), fav: group(c), corr: group(c) };
      c.ground(9);
      var ii = '<b>Учреждения</b> (коллегии, Сенат). Их место в управлении определено законом и регламентом.';
      ['Сенат', 'Коллегии', 'Губернии'].forEach(function (n, i) { into(G.inst, c.box3(1.6, 1.4 + i * 0.3, 1.4, STONE, [-5.5, (1.4 + i * 0.3) / 2, -2.5 + i * 2.5], ii)); into(G.inst, c.label(n, [-5.5, 2.6 + i * 0.3, -2.5 + i * 2.5], 0.4)); });
      var ti = '<b>Монарх.</b> Решает сам или через учреждения — так задумано.';
      var th = throne(c, 5.5, 0, ti); th.rotation.y = -Math.PI / 2;
      var mon = person(c, 5.3, 0, '#8e2b2b', ti, null, 1, 0.55); crown(c, mon, 1, 1.42);
      [-2.5, 0, 2.5].forEach(function (z) { arrow(c, [-4.5, 1.2, z], [4.3, 1.4, z * 0.2], BLUE, 'Обычный путь: доклад из учреждения <b>прямо к монарху</b>.', G.inst, 0.06); });
      var fi = '<b>Фаворит.</b> Его место определяет не чин и пост, а <b>только доверие монарха</b>.';
      var fav = person(c, 1.5, 0, RED, fi, G.fav, 1.3);
      into(G.fav, c.label('фаворит', [1.5, 2.6, 0], 0.5, '#ffb4ae'));
      var lens = into(G.fav, c.mesh(new T.TorusGeometry(0.7, 0.08, 10, 30), GOLD, '<b>А) Избирательно информирует монарха</b>: решает, что тот узнает о делах в государстве.')); lens.position.set(0, 1.6, 0); lens.rotation.y = Math.PI / 2;
      arrow(c, [1.9, 1.6, 0.4], [4.3, 1.6, 0.4], RED, '<b>Б) Предлагает решения</b> проблем, стоящих перед государством.', G.fav, 0.08);
      arrow(c, [1.2, 0.8, -0.4], [-4.5, 0.8, -2], RED, '<b>В) Принимает решения от имени государя</b> — и рассылает их в учреждения.', G.fav, 0.08);
      arrow(c, [1.2, 0.8, 0.4], [-4.5, 0.8, 2.6], RED, '<b>В) Решения от имени государя.</b>', G.fav, 0.08);
      var ci = '<b>Главная опасность:</b> институциональная среда управления подменяется <b>личными отношениями</b>, как правило, <b>коррупционными</b>.';
      c.coins = [];
      for (var i = 0; i < 8; i++) c.coins.push(into(G.corr, c.mesh(new T.CylinderGeometry(0.2, 0.2, 0.06, 14), GOLD, ci, { metalness: 0.6 })));
      c.groups = G;
      c.onFrame(function (t) {
        lens.rotation.x = t; fav.rotation.y = Math.sin(t) * 0.4;
        c.coins.forEach(function (co, i) { var a = t * 1.2 + i / 8 * Math.PI * 2; co.position.set(1.5 + Math.cos(a) * 1.3, 1.2 + Math.sin(t * 2 + i) * 0.3, Math.sin(a) * 1.3); co.rotation.x = t * 2; });
      });
    },
    chips: [
      { t: 'Институты', on: function (c) { fadeAll(c.groups, ['inst']); c.setView(0.3, 1.05, 17, 1.5); c.say('Нормальная схема: учреждения действуют по закону и докладывают монарху.'); } },
      { t: 'Фаворит', on: function (c) { fadeAll(c.groups, ['inst', 'fav']); c.setView(0.5, 1.0, 14, 1.5, 1, 0); c.say('<b>Фаворитизм</b> — исключительное право принимать решения государственного уровня у одного человека, выбранного <b>субъективным решением монарха</b>.'); } },
      { t: 'А · фильтр', on: function (c) { fadeAll(c.groups, ['fav']); c.setView(1.2, 1.0, 8, 1.6, 0.5, 0); c.say('<b>А)</b> Фаворит <b>избирательно информирует</b> монарха — «кольцо-фильтр».'); } },
      { t: 'Б · советы', on: function (c) { fadeAll(c.groups, ['fav']); c.setView(0.6, 1.0, 9, 1.6, 3, 0.4); c.say('<b>Б)</b> Предлагает государю решения.'); } },
      { t: 'В · решения', on: function (c) { fadeAll(c.groups, ['fav', 'inst']); c.setView(-0.4, 1.0, 13, 1, -1.5, 0); c.say('<b>В)</b> Принимает решения <b>от имени государя</b>.'); } },
      { t: 'Опасность', on: function (c) { fadeAll(c.groups, ['fav', 'corr']); c.setView(0.3, 0.8, 9, 1.4, 1.5, 0); c.say('Вместо закона — <b>личные связи</b> и коррупция. Монеты кружат вокруг фаворита.'); } }
    ]
  });

  /* ======================= 5. Карусель трона 1725–1801 ======================= */
  var RULERS = [
    ['e1', 'Екатерина I', 1725, 1727, '#c97b9a', '<b>Екатерина I (1725–1727)</b>, вдова Петра I. Возведена гвардией при поддержке Меншикова. Фаворит — <b>А. Д. Меншиков</b>.', 1],
    ['p2', 'Пётр II', 1727, 1730, '#7fb3e0', '<b>Пётр II (1727–1730)</b>, внук Петра I, мальчик. Фавориты — сначала (навязанный) <b>Меншиков</b>, затем <b>князь И. А. Долгоруков</b>. Умер от оспы в 14 лет.', 0],
    ['a', 'Анна Иоанновна', 1730, 1740, '#d9a441', '<b>Анна Иоанновна (1730–1740)</b>, дочь Ивана V. Призвана Верховным тайным советом с «Кондициями», которые разорвала. Фаворит — <b>Э. И. Бирон</b>.', 0],
    ['i6', 'Иван VI', 1740, 1741, '#9aa3c0', '<b>Иван VI Антонович (1740–1741)</b>, младенец, регент — Бирон. Через 3 недели Миних с сотней гвардейцев свергает Бирона, через год — переворот Елизаветы.', 1],
    ['el', 'Елизавета', 1741, 1761, '#e07f5a', '<b>Елизавета Петровна (1741–1761)</b>, дочь Петра I. К власти привела рота Преображенского полка. Фавориты — <b>А. Г. Разумовский</b>, затем <b>И. И. Шувалов</b>.', 1],
    ['p3', 'Пётр III', 1761, 1762, '#8bb878', '<b>Пётр III (1761–1762)</b>, внук Петра I, стал императором по завещанию Елизаветы. Через полгода — гвардейский переворот, отречение и смерть.', 0],
    ['e2', 'Екатерина II', 1762, 1796, '#a78bfa', '<b>Екатерина II (1762–1796)</b>. Пришла к власти гвардейским переворотом. «Просвещённый абсолютизм», Уложенная комиссия.', 1],
    ['pv', 'Павел I', 1796, 1801, '#5b8def', '<b>Павел I (1796–1801)</b>. «Модернизационная окрошка» (на лекции не успели — по слайдам). Указ о престолонаследии. [ДОБАВЛЕНО] Убит заговорщиками-гвардейцами в 1801 г. — последний переворот века.', 0]
  ];
  reg('ru12-throne3d', {
    title: 'Карусель трона 1725–1801', lead: 'В центре — трон, по кругу — восемь правителей. Ширина сектора — сколько лет правил. Зелёные гвардейцы стоят там, где власть сменилась переворотом.',
    radius: 19, phi: 0.85, theta: 0.2, targetY: 1, height: 440, hint: 'Нажми на правителя или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      throne(c, 0, 0, '<b>Трон.</b> Закон Петра 1722 г. разрешал монарху назначать наследника, но твёрдого порядка не было — трон стал «призом» для гвардии.', null, 1);
      var total = 1801 - 1725, a0 = 0; c.sect = {}; c.ang = {};
      var gi = '<b>Гвардия.</b> Именно она решала, кто сядет на трон: 1725, 1740, 1741, 1762, [ДОБАВЛЕНО] 1801.';
      RULERS.forEach(function (r, i) {
        var w = (r[3] - r[2]) / total * Math.PI * 2, g = group(c); c.sect[r[0]] = g;
        var m = into(g, c.mesh(new T.CylinderGeometry(7, 7, 0.4, 48, 1, false, a0, w - 0.02), r[4], r[5])); m.position.y = 0.2;
        var mid = a0 + w / 2; c.ang[r[0]] = mid;
        var px = Math.sin(mid) * 5.3, pz = Math.cos(mid) * 5.3;
        var p = person(c, px, pz, r[4], r[5], g, 1.1, 0.4); crown(c, p, 1.1, 1.42);
        into(g, c.label(r[1] + '\n' + r[2] + '–' + r[3], [Math.sin(mid) * 7.6, 2.4, Math.cos(mid) * 7.6], 0.4));
        if (r[6]) guardsman(c, Math.sin(a0 + 0.06) * 6.4, Math.cos(a0 + 0.06) * 6.4, gi, g, 0.9);
        a0 += w;
      });
      guardsman(c, Math.sin(-0.08) * 6.4, Math.cos(-0.08) * 6.4, '<b>1801</b> [ДОБАВЛЕНО]: заговор гвардейских офицеров, Павел I убит — последний дворцовый переворот.', c.sect.pv, 0.9);
      c.marker = c.mesh(new T.ConeGeometry(0.35, 0.8, 12), GOLD, null); c.marker.rotation.x = Math.PI;
      c.focus = null;
      c.onFrame(function (t) {
        var a = c.focus != null ? c.ang[c.focus] : t * 0.3;
        c.marker.position.set(Math.sin(a) * 5.3, 3.4 + Math.sin(t * 4) * 0.15, Math.cos(a) * 5.3);
      });
    },
    chips: [
      { t: 'Все', on: function (c) { c.focus = null; fadeAll(c.sect, keysOf(c.sect)); c.setView(0.2, 0.85, 19, 1); c.say('За 76 лет — 8 правителей и <b>5 гвардейских переворотов</b>. Самые долгие сектора — Елизавета и Екатерина II.'); } }
    ].concat(RULERS.map(function (r) {
      return { t: r[1], small: r[2] + '–' + r[3], on: function (c) { c.focus = r[0]; fadeAll(c.sect, [r[0]]); var a = c.ang[r[0]]; c.setView(a, 0.95, 11, 1.5, Math.sin(a) * 4, Math.cos(a) * 4); c.say(r[5]); } };
    }))
  });

  /* ======================= 6. Кондиции 1730 ======================= */
  reg('ru12-conditions3d', {
    title: 'Февраль 1730: Кондиции против самодержавия', lead: 'Три проекта на одном столе: Кондиции «верховников» (8 человек решают всё), проект дворянства (Сенат из 21 и собрание из 100 персон) и самодержавие. Нажимай даты.',
    radius: 16, phi: 1.0, theta: 0.4, targetY: 1.6, height: 430, hint: 'Начни с «2 февраля».',
    build: function (c) {
      var T = c.THREE, G = { vts: group(c), dvor: group(c), auto: group(c) };
      c.ground(8);
      var tab = c.box3(9, 0.3, 3.4, WOOD, [0, 1, 0], 'Стол, за которым в Москве решали судьбу власти в феврале 1730 г.');
      [[-4.2, -1.4], [4.2, -1.4], [-4.2, 1.4], [4.2, 1.4]].forEach(function (q) { c.box3(0.25, 1, 0.25, WOOD, [q[0], 0.5, q[1]]); });
      var vi = '<b>Кондиции (зачитаны 2 февраля).</b> Без согласия Верховного тайного совета (8 персон) императрица не может: начинать войну, заключать мир, вводить налоги, жаловать чины выше полковника, распоряжаться гвардией, отнимать у дворян жизнь и имущество без суда, раздавать вотчины, тратить казну. Подписали 97 дворян.';
      var sc = scroll(c, -3, 2.2, 0, vi, G.vts, 1); c.scrollL = sc;
      c.halfA = into(G.vts, c.box3(0.55, 1.5, 0.04, '#f3e7c9', [-3.27, 2.2, 0.06], vi)); c.halfB = into(G.vts, c.box3(0.55, 1.5, 0.04, '#f3e7c9', [-2.73, 2.2, 0.06], vi));
      c.halfA.visible = c.halfB.visible = false;
      for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; person(c, -3 + Math.cos(a) * 1.6, -3 + Math.sin(a) * 0.9, '#7a2f2f', vi, G.vts, 0.55); }
      into(G.vts, c.label('Кондиции · 8 «верховников»', [-3, 3.6, -1.5], 0.42, '#ffb4ae'));
      var di = '<b>Проект дворянства (4 февраля).</b> Составил <b>В. Н. Татищев</b>, подписали 288 человек. Высшее правление (Сенат/Совет) — <b>21 персона</b>; второе правительство — <b>100 персон</b>, собирается три раза в год; законы обсуждают все коллегии и представляют императрице. Зачатки представительного правления.';
      scroll(c, 0, 2.2, 0, di, G.dvor, 1);
      for (var j = 0; j < 21; j++) person(c, -1.5 + (j % 7) * 0.5, -3.2 - Math.floor(j / 7) * 0.6, BLUE, di, G.dvor, 0.4);
      into(G.dvor, c.label('Проект дворян · 21 + 100', [0, 3.6, -1.5], 0.42, '#9dbcff'));
      var ai = '<b>25 февраля.</b> Гвардейцы и 166 дворян подают челобитную о сохранении самодержавия. По сообщению Татищева, подполковник Преображенского полка <b>С. А. Салтыков</b> <b>надорвал</b> Кондиции. Лектор: «Никто не бросал, никто не топтал — надорвал». Так они и хранятся в архиве. Окно закрылось.';
      var anna = person(c, 3, 0, '#d9a441', ai, G.auto, 1.1, 1.15); c.crownA = crown(c, anna, 1.1, 1.42); c.crownA.visible = false;
      for (var k = 0; k < 5; k++) guardsman(c, 2 + k * 0.5, 2.8, ai, G.auto, 0.7);
      into(G.auto, c.label('Анна и гвардия', [3, 4, 0], 0.42, '#f0c36b'));
      c.groups = G; c.torn = 0;
      c.onFrame(function (t) {
        if (c.torn) {
          c.torn = Math.min(1, c.torn + 0.01);
          c.halfA.position.set(-3.27 - c.torn * 0.6, 2.2 - c.torn * 1.0, 0.3 + c.torn); c.halfA.rotation.z = c.torn * 1.2;
          c.halfB.position.set(-2.73 + c.torn * 0.4, 2.2 - c.torn * 1.0, 0.4 + c.torn * 1.2); c.halfB.rotation.z = -c.torn * 1.4;
        }
        if (c.crownA.visible) c.crownA.rotation.y = t;
      });
      c.tear = function (on) { c.scrollL.visible = !on; c.halfA.visible = c.halfB.visible = on; c.torn = on ? 0.001 : 0; if (!on) { c.halfA.position.set(-3.27, 2.2, 0.06); c.halfB.position.set(-2.73, 2.2, 0.06); c.halfA.rotation.z = c.halfB.rotation.z = 0; } c.crownA.visible = on; };
    },
    chips: [
      { t: 'Кризис', on: function (c) { c.tear(false); fadeAll(c.groups, keysOf(c.groups)); c.setView(0.4, 1.0, 16, 1.6); c.say('Трон переходит не по закону Петра, а по родству со <b>слабыми основаниями</b>. Элита расколота: старая знать против «птенцов Петра», русские против иностранцев, ВТС против остальных дворян. «Народ» — это столичное дворянство и гвардия, около <b>800 человек</b>.'); } },
      { t: '2 февраля', small: 'Кондиции', on: function (c) { c.tear(false); fadeAll(c.groups, ['vts']); c.setView(-0.3, 1.0, 10, 2, -3, -1); c.pick(c.scrollL.children[0]); } },
      { t: '4 февраля', small: 'проект дворян', on: function (c) { c.tear(false); fadeAll(c.groups, ['dvor']); c.setView(0.1, 1.0, 10, 2, 0, -1.5); c.say('<b>Проект дворянства</b> (Татищев, 288 подписей): высшее правление из 21 персоны и «правительство» из 100, законы обсуждают коллегии. Альтернатива и Кондициям, и самодержавию.'); } },
      { t: '25 февраля', small: 'надорваны', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.tear(true); c.setView(0.6, 1.0, 13, 1.8, 0, 0); c.say('<b>25 февраля</b>: челобитная 166 дворян о самодержавии, Кондиции <b>надорваны</b> (С. А. Салтыков; по древней традиции надорванный документ недействителен). Окно закрылось — самодержавие восстановлено.'); } }
    ]
  });

  /* ======================= 7. 1730-е: государство и власть ======================= */
  reg('ru12-1730s3d', {
    title: '1730-е: государство и власть', lead: 'Две башни. Левая — «Государство»: учреждения, которые восстанавливают. Правая — «Власть»: тайная полиция и расправы. Справа сзади — проект Волынского, который не дожил до реализации.',
    radius: 18, phi: 1.0, theta: 0.5, targetY: 2, height: 430, hint: 'Нажми на этаж башни.',
    build: function (c) {
      var T = c.THREE, G = { st: group(c), pw: group(c), vol: group(c) };
      c.ground(9);
      var S = [
        ['1730 · Сенат', '#d9d4c7', '<b>1730.</b> Сенат воссоздан как <b>высший орган государственной власти</b>.'],
        ['1731 · Кабинет министров', '#a9c2f5', '<b>1731. Кабинет министров:</b> Миних — армия и флот, Остерман — внешняя политика, князь Черкасский и Головкин — внутренние дела.'],
        ['1732 · Морская комиссия', '#7fb3e0', '<b>1732.</b> Воинская морская комиссия — началось <b>воссоздание флота</b>.']
      ];
      S.forEach(function (s, i) { into(G.st, c.box3(2.6, 1.2, 2.6, s[1], [-3.5, 0.6 + i * 1.25, 0], s[2])); into(G.st, c.label(s[0], [-3.5 - 2.6, 0.7 + i * 1.25, 1.5], 0.36)); });
      for (var m = 0; m < 4; m++) person(c, -4.4 + m * 0.6, 0.6, BLUE, S[1][2], G.st, 0.35, 1.85 + 0.6);
      into(G.st, c.label('ГОСУДАРСТВО', [-3.5, 5, 0], 0.5, '#9dbcff'));
      var P = [
        ['1730 · Тайная канцелярия', '#3a3f55', '<b>1730.</b> Создана <b>Канцелярия тайных розыскных дел</b> — политический сыск.'],
        ['1739 · Долгоруковы', '#5b2b2b', '<b>1739.</b> Казнь четырёх князей <b>Долгоруковых</b> — расправа с «верховниками».'],
        ['1740 · дело Волынского', '#7a2f2f', '<b>1739–1740.</b> Дело кабинет-министра <b>А. П. Волынского</b>, казнён 27 июня 1740 г.']
      ];
      P.forEach(function (s, i) { into(G.pw, c.box3(2.6, 1.2, 2.6, s[1], [2, 0.6 + i * 1.25, 0], s[2])); into(G.pw, c.label(s[0], [2 + 2.6, 0.7 + i * 1.25, 1.5], 0.36, '#ffb4ae')); });
      var eye = into(G.pw, c.mesh(new T.SphereGeometry(0.45, 16, 12), '#f4f1ea', P[0][2])); eye.position.set(2, 4.4, 0);
      var pupil = into(G.pw, c.mesh(new T.SphereGeometry(0.22, 12, 10), '#1d1f2b', P[0][2]));
      into(G.pw, c.label('ВЛАСТЬ', [2, 5.4, 0], 0.5, '#ffb4ae'));
      var vi = '<b>«Генеральный проект о поправлении внутренних государственных дел»</b> (1738–1739) — А. П. Волынский писал его с ведома императрицы и обсуждал с кругом единомышленников (Соймонов, Еропкин, Хрущёв и др.). 13 апреля 1740 г. отставлен (интрига Остермана и требование Бирона), 27 июня казнён вместе с Хрущёвым и Еропкиным.';
      var sc = scroll(c, 0, 1.6, -4.5, vi, G.vol, 1.3);
      c.circle = [];
      for (var k = 0; k < 10; k++) { var a = k / 10 * Math.PI * 2; c.circle.push(person(c, Math.cos(a) * 1.8, -4.5 + Math.sin(a) * 1.2, '#c8b48a', vi, G.vol, 0.55)); }
      into(G.vol, c.label('проект Волынского', [0, 3.6, -4.5], 0.42, '#f0c36b'));
      c.groups = G; c.volGone = false;
      c.onFrame(function (t) {
        var dx = Math.sin(t * 0.7) * 0.25; pupil.position.set(2 + dx, 4.4, 0.32);
        c.circle.forEach(function (p, i) { p.visible = !(c.volGone && i < 3); p.position.y = c.volGone ? 0 : Math.abs(Math.sin(t * 2 + i)) * 0.08; });
        sc.rotation.y = Math.sin(t * 0.5) * 0.3;
      });
    },
    chips: [
      { t: 'Обе башни', on: function (c) { c.volGone = false; fadeAll(c.groups, keysOf(c.groups)); c.setView(0.5, 1.0, 18, 2); c.say('1730-е: государство восстанавливают (Сенат, Кабинет, флот), но рядом растёт <b>власть страха</b> — тайный сыск и казни.'); } },
      { t: 'Государство', on: function (c) { fadeAll(c.groups, ['st']); c.setView(-0.4, 1.0, 11, 2, -3.5, 0); c.say('Сенат (1730), <b>Кабинет министров</b> (1731): Миних, Остерман, Черкасский, Головкин; Морская комиссия (1732).'); } },
      { t: 'Власть', on: function (c) { fadeAll(c.groups, ['pw']); c.setView(0.6, 1.0, 11, 2, 2, 0); c.say('<b>Тайная канцелярия</b> (1730), казнь Долгоруковых (1739), дело Волынского (1739–1740).'); } },
      { t: 'Волынский', small: 'реформа вне окна', on: function (c) { c.volGone = true; fadeAll(c.groups, ['vol']); c.setView(0.1, 0.95, 10, 1.5, 0, -4.5); c.say('<b>Попытка преобразований вне «окна возможностей»</b>: проект пишут в узком кругу, без раскола элиты и без опоры снизу. Итог — интрига и казнь. Без окна реформы не проходят.'); } }
    ]
  });

  /* ======================= 8. Гвардия решает ======================= */
  reg('ru12-guard3d', {
    title: 'Гвардия и перевороты: институциональная ловушка', lead: 'Дворец и казармы гвардии. Каждый переворот — отряд, идущий от казарм ко дворцу. Кольцо в небе — ловушка: переворот не может стать законом, но без него власть не меняется.',
    radius: 19, phi: 1.0, theta: 0.7, targetY: 1.5, height: 430, hint: 'Нажми на год.',
    build: function (c) {
      var T = c.THREE; c.ground(9.5);
      var pi = '<b>Императорский дворец</b> — цель каждого переворота.';
      c.box3(5, 2.2, 2.6, '#e6c79a', [3.5, 1.1, 0], pi); c.box3(1.4, 3.2, 1.4, '#e6c79a', [3.5, 1.6, 0], pi);
      var dome = c.mesh(new T.SphereGeometry(0.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), GOLD, pi, { metalness: 0.5 }); dome.position.set(3.5, 3.2, 0);
      c.label('дворец', [3.5, 4.7, 0], 0.45);
      var bi = '<b>Казармы гвардии</b> (Преображенский, Семёновский полки). Гвардия выросла из петровских «потешных» и стала решать, кто будет править.';
      house(c, -5, -1.8, '#2f6e4a', bi, null, 1.6, '#1d3b2a'); house(c, -5, 1.8, '#2f6e4a', bi, null, 1.6, '#1d3b2a');
      c.label('казармы гвардии', [-5, 3.4, 0], 0.45, '#7fe0a8');
      c.squad = []; for (var i = 0; i < 6; i++) c.squad.push(guardsman(c, -3.5, 0, bi, null, 0.75));
      var li = '<b>Институциональная ловушка.</b> Переворот не может стать институтом (законом), но без переворота смена власти не происходит. Постепенно сама гвардия превращается в «институт», где согласуют, кому править.';
      var ring = c.mesh(new T.TorusGeometry(2, 0.14, 10, 50), RED, li); ring.position.set(0, 6, 0); ring.rotation.x = Math.PI / 2;
      var beads = []; for (var k = 0; k < 4; k++) { var bd = c.mesh(new T.SphereGeometry(0.28, 12, 10), GOLD, li); beads.push(bd); }
      c.label('ловушка', [0, 7.2, 0], 0.45, '#ffb4ae');
      c.ring = ring; c.run = 0; c.who = null;
      c.target = person(c, 3.5, 2, '#8e2b2b', pi, null, 1); c.tc = crown(c, c.target, 1, 1.42);
      c.onFrame(function (t) {
        c.run = Math.min(1, c.run + 0.006);
        c.squad.forEach(function (s, i) { s.position.set(lerp(-3.5, 2, c.run) - (i % 3) * 0.6, 0, -0.7 + Math.floor(i / 3) * 1.4); s.position.y = Math.abs(Math.sin(t * 8 + i)) * 0.1 * (c.run < 1 ? 1 : 0); });
        c.target.position.y = c.run > 0.95 ? -0.6 * (c.run - 0.95) / 0.05 : 0; c.target.visible = c.run < 0.999 || !c.who;
        ring.rotation.z = t * 0.5; beads.forEach(function (b, k) { var a = t * 0.8 + k / 4 * Math.PI * 2; b.position.set(Math.cos(a) * 2, 6, Math.sin(a) * 2); });
      });
      c.go = function (who, col) { c.who = who; c.run = 0; c.target.children[0].material.color.set(col); };
    },
    chips: [
      { t: '1740', small: 'Миних → Бирон', on: function (c) { c.go('b', '#7a4b32'); c.setView(0.7, 1.0, 15, 1); c.say('<b>9 ноября 1740 г.</b> Анна завещала трон младенцу Ивану Антоновичу при регенте Бироне (16 октября) и на следующий день умерла. Через три недели <b>Миних с отрядом в 100 гвардейцев</b> свергает Бирона.'); } },
      { t: '1741', small: 'Елизавета', on: function (c) { c.go('i', '#9aa3c0'); c.setView(0.7, 1.0, 15, 1); c.say('<b>25 ноября 1741 г.</b> <b>Рота Преображенского полка</b> свергает Ивана Антоновича и приводит к власти Елизавету Петровну.'); } },
      { t: '1762', small: 'Екатерина II', on: function (c) { c.go('p', '#8bb878'); c.setView(0.7, 1.0, 15, 1); c.say('25 декабря 1761 г. умирает Елизавета, по завещанию правит <b>Пётр III</b>. Летом 1762 г. — <b>гвардейский переворот</b>, отречение и смерть Петра III. На слайде — письмо <b>Алексея Орлова</b> Екатерине: «Матушка… его нет на свете».'); } },
      { t: 'Ловушка', on: function (c) { c.setView(0.3, 0.6, 14, 4.5); c.pick(c.ring); } },
      { t: 'Чем плохо', on: function (c) { c.setView(0.7, 1.0, 19, 1.5); c.say('Зависимость от гвардии: легитимация власти замыкается на узком слое (<b>«отрыв от реальности»</b> — Меншиков предлагал не платить чиновникам жалованье: «хватит взяток»); <b>нигилизм к закону</b> сверху и снизу — сила выше закона; невозможна <b>последовательная политика и реформы</b>; растёт <b>фаворитизм</b>.'); } }
    ]
  });

  /* ======================= 9. Проекты Миниха и Панина ======================= */
  reg('ru12-councils3d', {
    title: 'Проекты Совета: Миних и Панин', lead: 'Две попытки «упорядочить» самодержавие без переворотов. Слева — двухуровневый «Совет Её Величества» Миниха. Справа — Императорский совет Панина. Оба так и не заработали.',
    radius: 18, phi: 1.0, theta: 0.4, targetY: 1.8, height: 420, hint: 'Нажми на уровень пирамиды.',
    build: function (c) {
      var T = c.THREE, G = { min: group(c), pan: group(c) };
      c.ground(9);
      var lo = '<b>Миних, низший уровень:</b> главы департаментов Совета решают «не особенно важные дела» сами — чтобы «облегчать труды императрицы».';
      var hi = '<b>Миних, высший уровень:</b> совет из <b>пяти лиц</b> докладывает императрице суть дел и по её решениям готовит указы Сенату. По сути — <b>Совет министров</b>. Императрица одобрила, но в действие мера не введена. Лектор: Екатерина похвалила проект и положила <b>в ящик стола</b>.';
      into(G.min, c.box3(4.4, 1, 4.4, '#a9c2f5', [-4, 0.5, 0], lo));
      into(G.min, c.box3(2.8, 1, 2.8, BLUE, [-4, 1.5, 0], hi));
      for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; person(c, -4 + Math.cos(a) * 1.9, Math.sin(a) * 1.9, '#7fb3e0', lo, G.min, 0.5, 1); }
      for (var j = 0; j < 5; j++) { var b = j / 5 * Math.PI * 2; person(c, -4 + Math.cos(b) * 1.1, Math.sin(b) * 1.1, BLUE, hi, G.min, 0.55, 2); }
      var em = person(c, -4, 0, '#d9a441', 'Императрица на вершине.', G.min, 0.8, 2); crown(c, em, 0.8, 1.42);
      into(G.min, c.label('проект Миниха', [-4, 4.2, 0], 0.45, '#9dbcff'));
      var pi = '<b>Проект Н. И. Панина: Императорский совет.</b> Все дела, которые требуют решения самого самодержца — доклады, проекты, прошения, сведения о государстве, — идут через совет. Текст написан для указа, императрица его <b>подписала, а потом отвергла</b>. [ДОБАВЛЕНО] 1762 г., Екатерина II.';
      var tb = into(G.pan, c.mesh(new T.CylinderGeometry(1.8, 1.8, 0.25, 30), '#8e6b3b', pi)); tb.position.set(4, 1, 0);
      into(G.pan, c.box3(0.3, 1, 0.3, WOOD, [4, 0.5, 0], pi));
      for (var k = 0; k < 7; k++) { var cA = k / 7 * Math.PI * 2; person(c, 4 + Math.cos(cA) * 2.3, Math.sin(cA) * 2.3, PURPLE, pi, G.pan, 0.65); }
      c.signed = into(G.pan, scroll(c, 4, 2, 0, pi, null, 0.9));
      into(G.pan, c.label('проект Панина', [4, 4.2, 0], 0.45, '#c9b8ff'));
      c.groups = G;
      c.onFrame(function (t) { c.signed.rotation.y = t * 0.8; c.signed.position.y = 2.2 + Math.sin(t * 2) * 0.15; });
    },
    chips: [
      { t: 'Оба проекта', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.4, 1.0, 18, 1.8); c.say('Общая идея — дать монарху <b>постоянный совет</b>, чтобы решения шли по процедуре, а не через фаворита.'); } },
      { t: 'Миних', on: function (c) { fadeAll(c.groups, ['min']); c.setView(-0.5, 0.9, 11, 1.5, -4, 0); c.say('Двухуровневый «Совет Её Величества»: мелочи решают департаменты, важное — совет из пяти при императрице. <b>Одобрено, но не введено.</b>'); } },
      { t: 'Панин', on: function (c) { fadeAll(c.groups, ['pan']); c.setView(0.8, 0.9, 11, 1.5, 4, 0); c.pick(c.signed.children[0]); } }
    ]
  });

  /* ======================= 10. Уложенная комиссия и Наказ ======================= */
  reg('ru12-commission3d', {
    title: 'Уложенная комиссия 1767 и «Наказ»', lead: 'Зал депутатов полукругом. На кафедре — «Наказ» Екатерины II. Из книги вылетают страницы — цитаты из европейских просветителей.',
    radius: 18, phi: 0.95, theta: 0.0, targetY: 1.2, height: 430, hint: 'Нажми на депутатов или на книгу.',
    build: function (c) {
      var T = c.THREE, G = { hall: group(c), nakaz: group(c), src: group(c) };
      c.ground(9);
      var GR = [['дворяне', BLUE], ['горожане', GOLD], ['гос. крестьяне', GREEN], ['казаки', RED], ['народы', PURPLE]];
      var di = function (n) { return '<b>Депутаты: ' + n + '.</b> [ДОБАВЛЕНО] В комиссию избрали около 570 депутатов от дворян, городов, государственных крестьян, казаков и «инородцев». Крепостные крестьяне своих депутатов не имели.'; };
      for (var row = 0; row < 3; row++) for (var i = 0; i < 13; i++) {
        var a = Math.PI * (0.15 + i / 12 * 0.7), r = 4 + row * 1.2, g = GR[(i + row) % 5];
        person(c, Math.cos(a) * r, Math.sin(a) * r * 0.9 + 1, g[1], di(g[0]), G.hall, 0.55, row * 0.35);
      }
      for (var row2 = 0; row2 < 3; row2++) into(G.hall, c.mesh(new T.CylinderGeometry(4.3 + row2 * 1.2, 4.3 + row2 * 1.2, 0.3, 40, 1, false, -Math.PI * 0.35 + Math.PI / 2, Math.PI * 0.7), STONE, null)).position.set(0, row2 * 0.35 - 0.05, 1);
      var ni = '<b>«Наказ» Уложенной комиссии.</b> Из 526 статей [число — ДОБАВЛЕНО] <b>294 — цитаты</b> из трактата Монтескьё «О духе законов». С 1767 по 1796 г. издавался по-русски <b>восемь раз</b>. Ст. 6: «<b>Россия есть Европейская держава</b>».';
      into(G.nakaz, c.box3(1.6, 1.2, 1, WOOD, [0, 0.6, -2.5], ni));
      var book = new T.Group(); G.nakaz.add(book); book.position.set(0, 1.4, -2.5);
      var pL = c.mesh(new T.BoxGeometry(0.9, 0.08, 1.1), '#f3e7c9', ni); pL.position.x = -0.46; pL.rotation.z = 0.15; book.add(pL);
      var pR = c.mesh(new T.BoxGeometry(0.9, 0.08, 1.1), '#f3e7c9', ni); pR.position.x = 0.46; pR.rotation.z = -0.15; book.add(pR);
      into(G.nakaz, c.label('«Наказ»', [0, 2.8, -2.5], 0.5, '#f0c36b'));
      var SRC = [['Монтескьё', '«О духе законов» — 294 статьи Наказа.'], ['Вольтер', 'Переписывался с Екатериной.'], ['Беккариа', '«О преступлениях и наказаниях». По словам лектора, из его трудов взята часть «Наказа».'], ['Дидро', 'Энциклопедист, гостил у Екатерины.'], ['д’Аламбер', 'Соредактор «Энциклопедии».']];
      c.pages = SRC.map(function (s, k) {
        var info = '<b>' + s[0] + '.</b> ' + s[1] + ' Наказ ссылается на него.';
        var p = into(G.src, c.mesh(new T.BoxGeometry(0.6, 0.8, 0.03), '#fffaf0', info));
        into(G.src, c.label(s[0], [0, 0, 0], 0.32)); p.lbl = G.src.children[G.src.children.length - 1];
        return p;
      });
      c.groups = G;
      c.onFrame(function (t) {
        pL.rotation.z = 0.15 + Math.sin(t * 2) * 0.08; pR.rotation.z = -0.15 - Math.sin(t * 2) * 0.08;
        c.pages.forEach(function (p, k) {
          var a = t * 0.4 + k / 5 * Math.PI * 2;
          p.position.set(Math.cos(a) * 2.6, 3.4 + Math.sin(t + k) * 0.4, -2.5 + Math.sin(a) * 1.4); p.rotation.y = -a;
          p.lbl.position.set(p.position.x, p.position.y + 0.8, p.position.z);
        });
      });
    },
    chips: [
      { t: 'Комиссия', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0, 0.95, 18, 1.2); c.say('<b>Уложенная комиссия</b> — инструмент «окна возможностей». Но окно открывают не обстоятельства, а <b>взгляды самой императрицы</b> — концепция просвещённого абсолютизма.'); } },
      { t: 'Депутаты', on: function (c) { fadeAll(c.groups, ['hall']); c.setView(0.2, 0.8, 13, 1, 0, 3); c.say('Депутаты от разных сословий. [ДОБАВЛЕНО] Комиссия заседала с 1767 г., новое Уложение так и не приняла; в 1768 г. её распустили под предлогом войны с Турцией.'); } },
      { t: '«Наказ»', on: function (c) { fadeAll(c.groups, ['nakaz']); c.setView(0, 0.9, 8, 1.5, 0, -2.5); c.say('«Наказ»: ст. 1 — закон христианский учит делать добро; ст. 3 — каждого гражданина должны охранять законы; ст. 6 — «<b>Россия есть Европейская держава</b>».'); } },
      { t: 'Источники', on: function (c) { fadeAll(c.groups, ['src', 'nakaz']); c.setView(0.3, 0.85, 11, 3, 0, -2.5); c.say('Монтескьё (294 статьи), а также Вольтер, Беккариа, Дидро, д’Аламбер — <b>европейское Просвещение</b> в русском законодательстве.'); } }
    ]
  });

  /* ======================= 11. Физиократы: три класса Кенэ ======================= */
  reg('ru12-physio3d', {
    title: 'Кенэ: три класса и круговорот богатства', lead: 'Поле — производительный класс. Замок — землевладельцы (вместе с монархом). Мастерская — «бесплодный» класс. Золотые шарики — деньги и продукт, которые бегут по кругу.',
    radius: 16, phi: 1.0, theta: 0.5, targetY: 1, height: 420, hint: 'Нажми на класс.',
    build: function (c) {
      var T = c.THREE, G = { prod: group(c), land: group(c), ster: group(c) };
      c.ground(8);
      var P = [0, 0, 4], L = [-4, 0, -2.5], S = [4, 0, -2.5];
      var pi = '<b>Производительный класс</b> — те, кто возделывает землю. По Кенэ, только они создают новое богатство нации: обеспечивают его «ежегодное возрождение» и платят доход землевладельцам.';
      var field = into(G.prod, c.box3(4, 0.2, 2.6, '#6b8e3a', [P[0], 0.1, P[2]], pi));
      c.wheat = []; for (var i = 0; i < 20; i++) { var w = into(G.prod, c.mesh(new T.ConeGeometry(0.1, 0.7, 6), '#e3c25a', pi)); w.position.set(P[0] - 1.6 + (i % 5) * 0.8, 0.55, P[2] - 0.9 + Math.floor(i / 5) * 0.6); c.wheat.push(w); }
      into(G.prod, c.label('производительный', [P[0], 2, P[2]], 0.45, '#7fe0a8'));
      var li = '<b>Класс землевладельцев</b> — монарх, собственники земли, сборщики десятины. Живут на доход от земли (продукт за вычетом затрат на новое производство).';
      into(G.land, c.box3(2, 2, 2, STONE, [L[0], 1, L[2]], li));
      [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].forEach(function (q) { into(G.land, c.mesh(new T.CylinderGeometry(0.3, 0.3, 2.8, 10), STONE, li)).position.set(L[0] + q[0], 1.4, L[2] + q[1]); });
      var kc = new T.Group(); G.land.add(kc); kc.position.set(L[0], 2.2, L[2]); crown(c, kc, 1.6, 0.2);
      into(G.land, c.label('землевладельцы + монарх', [L[0], 3.8, L[2]], 0.45, '#f0c36b'));
      var si = '<b>«Бесплодный» класс</b> — все, кто занят не в сельском хозяйстве: ремесленники, торговцы. Их затраты оплачивают два других класса; нового богатства они, по Кенэ, не создают.';
      house(c, S[0], S[2], '#9a8a7a', si, G.ster, 1.8, '#5a4a3a');
      var gear = into(G.ster, c.mesh(new T.TorusGeometry(0.5, 0.15, 6, 10), GREY, si)); gear.position.set(S[0], 2.8, S[2]);
      into(G.ster, c.label('«бесплодный»', [S[0], 3.8, S[2]], 0.45));
      arrow(c, [P[0] - 1, 1, P[2] - 1.2], [L[0] + 1, 1.2, L[2] + 1], GOLD, 'Доход (рента) идёт от земледельцев к землевладельцам.', G.prod);
      arrow(c, [L[0] + 1.2, 1.4, L[2]], [S[0] - 1.2, 1.4, S[2]], '#c9a050', 'Землевладельцы покупают изделия «бесплодного» класса.', G.land);
      arrow(c, [S[0] - 0.6, 0.8, S[2] + 1.2], [P[0] + 1.2, 0.8, P[2] - 1.2], '#c9a050', '«Бесплодный» класс покупает у земледельцев продовольствие и сырьё.', G.ster);
      c.balls = []; for (var b = 0; b < 9; b++) c.balls.push(c.mesh(new T.SphereGeometry(0.16, 10, 8), GOLD, null, { emissive: '#ffb000', emissiveIntensity: 0.3 }));
      c.groups = G;
      var path = [P, L, S];
      c.onFrame(function (t) {
        c.wheat.forEach(function (w, i) { w.rotation.z = Math.sin(t * 2 + i) * 0.15; });
        gear.rotation.z = t * 2;
        c.balls.forEach(function (bl, i) {
          var u = (t * 0.12 + i / 9) % 1, seg = Math.floor(u * 3), k = u * 3 - seg, A = path[seg], B = path[(seg + 1) % 3];
          bl.position.set(lerp(A[0], B[0], k), 1.6 + Math.sin(k * Math.PI) * 1.2, lerp(A[2], B[2], k));
        });
      });
    },
    chips: [
      { t: 'Круговорот', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.5, 1.0, 16, 1); c.say('Франсуа <b>Кенэ</b> (1694–1774) — глава физиократов. Богатство нации рождается <b>на земле</b> и бежит по кругу между тремя классами.'); } },
      { t: 'Производительный', on: function (c) { fadeAll(c.groups, ['prod']); c.setView(0.2, 0.9, 9, 0.5, 0, 4); c.say('Земледельцы — единственный класс, который создаёт <b>новое</b> богатство.'); } },
      { t: 'Землевладельцы', on: function (c) { fadeAll(c.groups, ['land']); c.setView(-0.6, 0.9, 9, 1.5, -4, -2.5); c.say('Монарх входит в класс землевладельцев. Отсюда интерес «просвещённых» монархов к сельскому хозяйству: <b>Вольное экономическое общество</b>, генеральное межевание.'); } },
      { t: '«Бесплодный»', on: function (c) { fadeAll(c.groups, ['ster']); c.setView(1.2, 0.9, 9, 1.5, 4, -2.5); c.say('Ремесло и торговля, по Кенэ, только перерабатывают созданное на земле.'); } }
    ]
  });

  /* ======================= 12. Екатерина II: модернизация и архаизация ======================= */
  reg('ru12-catherine3d', {
    title: 'Весы Екатерины II', lead: 'Левая чаша — модернизация, правая — архаизация. Нажимай кнопки — чаши наполняются кубиками реформ. Сверху — «мудрец на троне».',
    radius: 17, phi: 1.0, theta: 0.2, targetY: 2.5, height: 440, hint: 'Нажми на кубик — узнаешь, что это за реформа.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var si = 'Весы: модернизация и архаизация шли <b>одновременно</b>.';
      c.box3(0.3, 4.5, 0.3, GOLD, [0, 2.25, 0], si);
      var beam = new T.Group(); c.root.add(beam); beam.position.set(0, 4.5, 0); c.beam = beam;
      var bm = c.mesh(new T.BoxGeometry(8, 0.2, 0.3), GOLD, si); beam.add(bm);
      function pan(x) { var p = new T.Group(); c.root.add(p); var d = c.mesh(new T.CylinderGeometry(1.9, 1.6, 0.2, 24), '#c9a050', si); p.add(d); [0, 2.1, 4.2].forEach(function (a) { var r = c.link([0, 0, 0], [Math.cos(a) * 1.7, 1.8, Math.sin(a) * 1.7], '#9a8a7a', 0.025); p.add(r); }); return p; }
      c.panL = pan(-4); c.panR = pan(4);
      c.label('модернизация', [-4, 6, 0], 0.5, '#7fe0a8'); c.label('архаизация', [4, 6, 0], 0.5, '#ffb4ae');
      var MOD = [
        ['Вольность дворянства', '<b>Манифест о вольности дворянства (1762)</b> — дворяне освобождены от обязательной службы. [ДОБАВЛЕНО] Подписан ещё Петром III, Екатерина подтвердила.'],
        ['Губернская реформа', '<b>Губернская реформа</b> [1775 — ДОБАВЛЕНО]: разделили административные, финансовые и судебные органы — первые шаги к разделению властей.'],
        ['Городская реформа', '<b>Городская реформа (1785)</b>: «шестигласная дума» — городское самоуправление.'],
        ['Секуляризация', '<b>Секуляризация церковных земель</b> [1764 — ДОБАВЛЕНО]: земли церкви перешли государству.'],
        ['ВЭО', '<b>Вольное экономическое общество (1765)</b> — первый элемент гражданского общества.'],
        ['Ассигнации', '<b>Ассигнации</b> — первые бумажные деньги [1769 — ДОБАВЛЕНО].'],
        ['Межевание', '<b>Генеральное межевание</b>: права на землю зафиксированы.'],
        ['Школы', '<b>Школы в уездах и губерниях</b>, Воспитательный дом, женское образование (вдохновитель — И. И. Бецкой).']
      ];
      var ARC = [
        ['Раздача земель', '<b>Раздача государственных земель дворянам</b> — вместе с живущими на них крестьянами.'],
        ['Закрепощение', '<b>Закрепощение крестьян Поволжья и Украины.</b>'],
        ['Приписные', '<b>Подтверждено право собственности на «приписных крестьян»</b> на заводах.'],
        ['Запрет жалоб', '<b>Запрет крестьянам жаловаться на помещиков</b> [1767 — ДОБАВЛЕНО].'],
        ['Фаворитизм', 'В реальности <b>главным принципом управления стал фаворитизм</b>.']
      ];
      c.cubesL = MOD.map(function (m, i) { var b = c.box3(0.7, 0.7, 0.7, GREEN, [0, 0, 0], m[1]); b.visible = false; b.slot = i; return b; });
      c.cubesR = ARC.map(function (m, i) { var b = c.box3(0.7, 0.7, 0.7, RED, [0, 0, 0], m[1]); b.visible = false; b.slot = i; return b; });
      var wi = '<b>«Мудрец на троне»</b>: постоянно учится, переписывается с Вольтером и Дидро, пишет трактаты и пьесы, издаёт журнал, уважает обычаи народа, следует принципу «<b>закон карает — монарх милует</b>».';
      var emp = person(c, 0, 0, PURPLE, wi, null, 1.1, 4.7); crown(c, emp, 1.1, 1.42);
      var bk = c.mesh(new T.BoxGeometry(0.5, 0.08, 0.35), '#f3e7c9', wi); bk.position.set(0.35, 5.6, 0.25);
      c.nL = 0; c.nR = 0; c.tilt = 0;
      c.onFrame(function (t) {
        var goal = (c.nL - c.nR * 1.4) * 0.05; c.tilt += (goal - c.tilt) * 0.05; beam.rotation.z = c.tilt;
        var yl = 4.5 + Math.sin(-c.tilt) * -4, yr = 4.5 + Math.sin(-c.tilt) * 4;
        c.panL.position.set(-4 * Math.cos(c.tilt), 4.5 - 4 * Math.sin(c.tilt) - 1.9, 0); c.panR.position.set(4 * Math.cos(c.tilt), 4.5 + 4 * Math.sin(c.tilt) - 1.9, 0);
        function stack(arr, pan, n) { arr.forEach(function (b, i) { b.visible = i < n; var col = i % 3, row = Math.floor(i / 3); b.position.set(pan.position.x - 0.8 + col * 0.8, pan.position.y + 0.45 + row * 0.75, (row % 2) * 0.3 - 0.15); }); }
        stack(c.cubesL, c.panL, c.nL); stack(c.cubesR, c.panR, c.nR);
        bk.rotation.y = Math.sin(t) * 0.3;
      });
    },
    chips: [
      { t: 'Модернизация', on: function (c) { c.nL = 8; c.nR = 0; c.setView(-0.4, 1.0, 13, 2.5, -2, 0); c.say('Модернизация II пол. XVIII в.: вольность дворянства, губернская и городская реформы, секуляризация, ВЭО, ассигнации, межевание, школы.'); } },
      { t: 'Архаизация', on: function (c) { c.nR = 5; c.setView(0.4, 1.0, 13, 2.5, 2, 0); c.say('Одновременно — <b>архаизация</b>: раздача земель с крестьянами, закрепощение Поволжья и Украины, приписные, запрет жалоб на помещиков, фаворитизм.'); } },
      { t: 'Итог', on: function (c) { c.nL = 8; c.nR = 5; c.setView(0.2, 1.0, 17, 2.5); c.say('Чаши почти уравновешены: модернизация шла <b>для верхов</b>, а для крестьян — ещё больше несвободы. Как и при Петре.'); } },
      { t: 'Мудрец на троне', on: function (c) { c.setView(0.3, 0.9, 8, 5.2, 0, 0); c.say('<b>«Мудрец на троне»</b> — образ правителя просвещённого абсолютизма: учится, переписывается с Вольтером и Дидро, пишет, «закон карает — монарх милует».'); } },
      { t: 'Сброс', on: function (c) { c.nL = 0; c.nR = 0; c.setView(0.2, 1.0, 17, 2.5); c.say('Чаши пусты. Нажимай «Модернизация» и «Архаизация».'); } }
    ]
  });

  /* ======================= 13. «Модернизационная окрошка» Павла I ======================= */
  reg('ru12-paul3d', {
    title: '«Модернизационная окрошка» Павла I', lead: 'Миска — политика Павла. Зелёные кубики — «больше свободы и прав», красные — «меньше». Над миской — единственный институт, который Павел признавал: самодержавная власть.',
    radius: 15, phi: 1.0, theta: 0.4, targetY: 1.8, height: 430, hint: 'Нажми на кубик в миске.',
    build: function (c) {
      var T = c.THREE, G = { more: group(c), less: group(c), auto: group(c) };
      c.ground(7);
      var bi = '«Окрошка» — в одной миске перемешаны противоположные меры: одни дают свободу, другие её отнимают.';
      var bowl = c.mesh(new T.SphereGeometry(3, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), '#d9d4c7', bi, { side: T.DoubleSide }); bowl.position.y = 3;
      var soup = c.mesh(new T.CylinderGeometry(2.85, 2.85, 0.1, 32), '#e8e0c8', bi); soup.position.y = 2.4;
      var MORE = [
        'Указ о <b>трёхдневной барщине</b> [1797 — ДОБАВЛЕНО].', '<b>Запрет продавать крестьян без земли</b>.', 'Купцы <b>выбирают советников</b> в Коммерц-коллегию.', 'Право <b>эмигрантам из Франции</b> селиться в России.', '<b>Свобода вероисповедания</b> в Польше, права <b>старообрядцам</b>.'
      ];
      var LESS = [
        '<b>Запрет ввоза книг и журналов</b> из-за границы.', 'Все дворяне <b>возвращены на службу</b> из отпусков.', 'Дворяне лишены большей части привилегий самоуправления; <b>телесные наказания для дворян</b> восстановлены.', '<b>Запрет «круглых шляп»</b>.', 'Армейская форма <b>по прусскому образцу</b>.'
      ];
      c.bits = [];
      MORE.forEach(function (m, i) { var b = into(G.more, c.box3(0.6, 0.6, 0.6, GREEN, [0, 0, 0], '<b>Больше свободы:</b> ' + m)); b.ph = i * 1.3; c.bits.push(b); });
      LESS.forEach(function (m, i) { var b = into(G.less, c.box3(0.6, 0.6, 0.6, RED, [0, 0, 0], '<b>Меньше свободы:</b> ' + m)); b.ph = 0.6 + i * 1.3; c.bits.push(b); });
      var ai = '<b>Единственный институт — самодержавная власть.</b> «В России вельможа — тот, с кем я говорю, и только в то время, когда я с ним говорю». Закрепил её <b>Указом о престолонаследии</b> [1797 — ДОБАВЛЕНО] и законами об императорской фамилии; восстановил упразднённые Екатериной коллегии; стал главой <b>Мальтийского ордена</b>.';
      var cr = new T.Group(); G.auto.add(cr); cr.position.set(0, 5.6, 0);
      var band = c.mesh(new T.CylinderGeometry(0.9, 1, 0.6, 12, 1, true), GOLD, ai, { metalness: 0.6, roughness: 0.3, side: T.DoubleSide }); cr.add(band);
      for (var k = 0; k < 6; k++) { var sp = c.mesh(new T.ConeGeometry(0.15, 0.5, 6), GOLD, ai, { metalness: 0.6 }); var a = k / 6 * Math.PI * 2; sp.position.set(Math.cos(a) * 0.9, 0.5, Math.sin(a) * 0.9); cr.add(sp); }
      var cross = c.mesh(new T.BoxGeometry(0.9, 0.9, 0.12), '#f4f1ea', '<b>Мальтийский крест.</b> Павел — гроссмейстер Мальтийского ордена: «заимствование» института.'); cross.position.set(2.6, 5.2, 0); cross.rotation.z = Math.PI / 4; G.auto.add(cross);
      into(G.auto, c.label('самодержавие', [0, 7, 0], 0.5, '#f0c36b'));
      var spoon = c.mesh(new T.CylinderGeometry(0.08, 0.08, 4, 8), '#9aa3c0', bi);
      c.groups = G;
      c.onFrame(function (t) {
        c.bits.forEach(function (b, i) { var a = t * 0.6 + b.ph; var r = 1.2 + (i % 3) * 0.5; b.position.set(Math.cos(a) * r, 2.75 + Math.sin(t * 2 + i) * 0.12, Math.sin(a) * r); b.rotation.set(t + i, t * 0.7, 0); });
        spoon.position.set(Math.cos(t) * 1.2, 3.6, Math.sin(t) * 1.2); spoon.rotation.set(Math.sin(t) * 0.4, 0, Math.cos(t) * 0.4);
        cr.rotation.y = t * 0.5; cross.rotation.y = t;
      });
    },
    chips: [
      { t: 'Вся миска', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.4, 1.0, 15, 1.8); c.say('Павел I (1796–1801): одни меры <b>расширяют права</b>, другие <b>отнимают</b> — всё вперемешку.'); } },
      { t: 'Больше свободы', on: function (c) { fadeAll(c.groups, ['more']); c.setView(0.4, 0.6, 10, 2.6); c.say('Трёхдневная барщина, запрет продажи крестьян без земли, выборные советники купцов, приём французских эмигрантов, свобода веры.'); } },
      { t: 'Меньше свободы', on: function (c) { fadeAll(c.groups, ['less']); c.setView(0.4, 0.6, 10, 2.6); c.say('Запрет иностранных книг, все дворяне — на службу, телесные наказания для дворян, запрет круглых шляп, прусская форма.'); } },
      { t: 'Самодержавие', on: function (c) { fadeAll(c.groups, ['auto']); c.setView(0.4, 0.9, 9, 5.6); c.say('Павел не признавал важности никаких институтов, <b>кроме самодержавной власти</b>.'); } },
      { t: 'Институт ≠ институция', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.8, 1.0, 15, 2); c.say('<b>Институт</b> — комплекс норм поведения (правила, традиции, обряды). <b>Институция</b> — формальное объединение людей внутри института. Самодержавие — институт; коллегия или орден — институции.'); } }
    ]
  });

  /* ======================= 14. «Бассейн без воды»: логика охранителя ======================= */
  reg('ru12-pool3d', {
    title: '«Бассейн без воды»: спор о крепостном праве', lead: 'Анекдот лектора. Бассейн построен, а воды нет: «научатся плавать — нальём». Слева на трибуне — Коробьин, справа — князь Щербатов. Переключай две логики.',
    radius: 17, phi: 1.0, theta: 0.35, targetY: 0.8, height: 430, hint: 'Нажми «Логика охранителя», потом «Как в реальности».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var pi = '<b>Бассейн</b> — права и свободы. Охранитель: «сначала научитесь быть гражданами, потом получите права». Лектор: в реальности права <b>добывали</b>, а потом <b>учились</b> быть гражданами — через много ошибок.';
      var W = 6, D = 3.6, H = 1.2;
      c.box3(W + 0.6, 0.2, D + 0.6, '#dcdfe6', [0, 0.1, 0], pi);
      [[0, -(D / 2 + 0.15), W + 0.6, 0.3], [0, D / 2 + 0.15, W + 0.6, 0.3]].forEach(function (q) { c.box3(q[2], H, q[3], '#e8eef8', [q[0], H / 2 + 0.1, q[1]], pi); });
      [[-(W / 2 + 0.15), 0], [W / 2 + 0.15, 0]].forEach(function (q) { c.box3(0.3, H, D, '#e8eef8', [q[0], H / 2 + 0.1, q[1]], pi); });
      var water = c.mesh(new T.BoxGeometry(W - 0.05, 1, D - 0.05), WATER, '<b>Вода</b> — реальные права. Только в воде можно научиться плавать.', { transparent: true, opacity: 0.7 });
      water.position.y = 0.2; water.scale.y = 0.01; c.water = water;
      c.swimmers = [];
      for (var i = 0; i < 6; i++) c.swimmers.push(person(c, -2.2 + i * 0.9, 2.8, '#c8b48a', '<b>Крестьяне</b> — по Щербатову, «в детском состоянии»: без помещика перессорятся и всё развалят.', null, 0.6));
      var ki = '<b>Депутат Г. С. Коробьин</b> [имя — ДОБАВЛЕНО; лектор не вспомнил фамилию] предлагал <b>ограничить крепостное право</b>.';
      c.box3(1, 1, 1, '#a9c2f5', [-5.5, 0.5, -1], ki); person(c, -5.5, -1, BLUE, ki, null, 0.9, 1);
      c.label('Коробьин', [-5.5, 3.2, -1], 0.4, '#9dbcff');
      var si = '<b>Князь М. М. Щербатов</b> — историк, «первый русский консерватор». Логика охранителя: народ груб и не готов, без помещика всё развалится, нельзя давать много прав — выберут не тех.';
      c.box3(1, 1, 1, '#e6c79a', [5.5, 0.5, -1], si); var sh = person(c, 5.5, -1, '#8e2b2b', si, null, 0.9, 1); wig(c, sh, 0.9);
      c.label('Щербатов', [5.5, 3.2, -1], 0.4, '#ffb4ae');
      var mi = '<b>Купцы</b> тоже потребовали себе <b>крепостных</b>: «у нас мало рабочих рук».';
      for (var m = 0; m < 3; m++) person(c, 4 + m * 0.7, 3, GOLD, mi, null, 0.7);
      c.label('купцы', [4.7, 2.2, 3], 0.36, '#f0c36b');
      c.wl = 0; c.goalW = 0; c.mode = 0;
      c.onFrame(function (t) {
        c.wl += (c.goalW - c.wl) * 0.03;
        water.scale.y = Math.max(0.01, c.wl * (H - 0.15)); water.position.y = 0.2 + water.scale.y / 2;
        c.swimmers.forEach(function (s, i) {
          if (c.mode === 1) { var k = Math.min(1, Math.max(0, c.wl * 1.2)); var a = t * 0.6 + i; s.position.set(Math.cos(a) * 2 * k + (-2.2 + i * 0.9) * (1 - k), 0.2 + c.wl * (H - 0.15) - 0.45 * k + Math.sin(t * 4 + i) * 0.05 * k, Math.sin(a) * 1 * k + 2.8 * (1 - k)); s.rotation.z = k * Math.sin(t * 3 + i) * 0.4; }
          else { s.position.set(-2.2 + i * 0.9, Math.abs(Math.sin(t * 3 + i)) * 0.05, 2.8); s.rotation.z = 0; }
        });
      });
    },
    chips: [
      { t: 'Логика охранителя', on: function (c) { c.goalW = 0; c.mode = 0; c.setView(0.3, 0.8, 14, 0); c.say('«<b>Почему воды нет?</b>» — «Так они плавать не умеют. Научатся — нальём». Так рассуждает Щербатов: сначала стань гражданином, потом получишь права. Но без воды плавать не научиться.'); } },
      { t: 'Как в реальности', on: function (c) { c.goalW = 1; c.mode = 1; c.setView(0.3, 0.7, 13, 0); c.say('В реальности <b>сначала права</b> (вода), а <b>потом люди учатся</b> ими пользоваться — с ошибками, барахтаясь. Иначе «готовность» не наступит никогда.'); } },
      { t: 'Тупик Екатерины', on: function (c) { c.goalW = 0.15; c.mode = 0; c.setView(0.9, 1.0, 16, 1); c.say('Отменить крепостное право — значит отнять крестьян у вооружённого дворянства, которое уже свергало Меншикова, Бирона, Миниха и Петра III. Выход: началась <b>война с Турцией</b>, комиссию отложили — и больше не собрали.'); } }
    ]
  });

  /* ======================= Мини-тест ======================= */
  HubWidgets.register('ru12-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Россия 1725–1801</b></div><p class="wg-lead">12 вопросов по лекции 12.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Обязательное условие, чтобы «окно возможностей» открылось?', ['Война', 'Раскол в элите', 'Неурожай'], 1, 'Одной из групп элиты нужна поддержка снизу — дополнительная легитимация.'],
      ['Самый частый повод для «окна возможностей»?', ['Транзит власти', 'Денежная реформа', 'Восстание крестьян'], 0, 'Особенно в слабой институциональной среде, когда нет твёрдого закона о наследовании.'],
      ['Что произошло со «окном» после смерти Петра I?', ['Открылось на 10 лет', 'Не открылось', 'Открылось Уложенной комиссией'], 1, 'Наоборот: «закупоривание» элиты и модернизационная пауза.'],
      ['Что из этого — НЕ признак паузы 1720-х?', ['Флот бездействует', 'Создан Кабинет министров', 'Сенат стал «Высоким»'], 1, 'Кабинет министров — 1731, уже при Анне.'],
      ['Чем определяется положение фаворита?', ['Чином по Табели о рангах', 'Только доверием монарха', 'Решением Сената'], 1, 'Не постом и чином, а личным доверием.'],
      ['Фаворит Анны Иоанновны?', ['Бирон', 'Разумовский', 'Шувалов'], 0, 'Разумовский и Шувалов — фавориты Елизаветы.'],
      ['Сколько человек было в Верховном тайном совете по Кондициям?', ['8', '21', '100'], 0, '21 и 100 — из проекта дворянства (Татищев).'],
      ['Кто, по рассказу Татищева, надорвал Кондиции?', ['Миних', 'С. А. Салтыков', 'Бирон'], 1, 'Подполковник Преображенского полка, 25 февраля 1730 г.'],
      ['Почему реформа Волынского провалилась?', ['Не хватило денег', 'Её пытались провести вне «окна возможностей»', 'Её отменил Сенат'], 1, 'Узкий круг, без раскола элиты и опоры снизу — интрига и казнь в 1740 г.'],
      ['Институциональная ловушка XVIII века — это…', ['Крепостное право', 'Переворот не может стать законом, но без него власть не меняется', 'Фаворитизм'], 1, 'Отсюда растущая роль гвардии.'],
      ['Сколько статей «Наказа» — цитаты из Монтескьё?', ['94', '294', '526'], 1, '294 статьи из «О духе законов».'],
      ['Что из этого — «архаизация» при Екатерине II?', ['Городская реформа 1785 г.', 'Запрет крестьянам жаловаться на помещиков', 'Вольное экономическое общество'], 1, 'А ещё — закрепощение Поволжья и Украины, раздача земель.']
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
