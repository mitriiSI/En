/* 3D-модели и мини-тест к конспекту «Культура России в XVIII веке» (История России, лекция 16.10).
   В Markdown: @@graph:ru14-rome3d@@ @@graph:ru14-imperium3d@@ @@graph:ru14-flags3d@@ @@graph:ru14-europe3d@@ @@graph:ru14-school3d@@
   @@graph:ru14-smolny3d@@ @@graph:ru14-styles3d@@ @@graph:ru14-garden3d@@ @@graph:ru14-dutch3d@@ @@graph:ru14-baroque3d@@
   @@graph:ru14-classic3d@@ @@graph:ru14-portrait3d@@ @@graph:ru14-sentiment3d@@ @@graph:ru14-university3d@@
   @@graph:ru14-orders3d@@ @@graph:ru14-genres3d@@ @@graph:ru14-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa', WOOD = '#8a5a3b',
    STONE = '#d9d4c7', WHITE = '#f4f1ea', DARK = '#3a3f55', WATER = '#3d7fc4', GUARD = '#2f6e4a', AZURE = '#7fc4e8', BROWN = '#7a5236', OLIVE = '#6f8f4e', SKY = '#8fbfe6';
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 1.45, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function group(c, x, y, z) { var g = new c.THREE.Group(); c.root.add(g); if (x != null) g.position.set(x, y || 0, z || 0); return g; }
  function into(g, m) { g.add(m); return m; }
  function at(m, x, y, z) { m.position.set(x, y, z); return m; }
  function person(c, x, z, col, info, g, s, y) {
    var T = c.THREE; s = s || 1; y = y || 0;
    var p = new T.Group(); (g || c.root).add(p); p.position.set(x, y, z);
    p.add(at(c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info), 0, 0.45 * s, 0));
    p.add(at(c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), '#e8c6a0', info), 0, 1.12 * s, 0));
    return p;
  }
  function beard(c, p, s) { var T = c.THREE; s = s || 1; var b = c.mesh(new T.ConeGeometry(0.2 * s, 0.5 * s, 10), '#5a3b25'); b.rotation.x = Math.PI; b.position.set(0, 0.85 * s, 0.13 * s); p.add(b); return b; }
  function wig(c, p, s) { var w = c.mesh(new c.THREE.SphereGeometry(0.26 * (s || 1), 12, 8), WHITE); w.position.y = 1.18 * (s || 1); w.scale.set(1.05, 0.8, 1.1); p.add(w); return w; }
  function column(c, g, x, z, h, col, info, r) {
    var T = c.THREE; r = r || 0.18;
    into(g, at(c.mesh(new T.CylinderGeometry(r, r * 1.1, h, 14), col || WHITE, info), x, h / 2 + 0.15, z));
    into(g, at(c.mesh(new T.BoxGeometry(r * 3, 0.15, r * 3), col || WHITE, info), x, 0.075, z));
    into(g, at(c.mesh(new T.BoxGeometry(r * 3, 0.15, r * 3), col || WHITE, info), x, h + 0.22, z));
  }
  function pediment(c, g, x, y, z, w, col, info) {
    var T = c.THREE, sh = new T.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, w * 0.22); sh.lineTo(-w / 2, 0);
    var m = c.mesh(new T.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: false }), col || WHITE, info); m.position.set(x, y, z - 0.2); g.add(m); return m;
  }
  function dome(c, g, x, y, z, r, col, info, onion) {
    var T = c.THREE, d;
    if (onion) { d = c.mesh(new T.SphereGeometry(r, 16, 12), col, info, { metalness: 0.5, roughness: 0.3 }); d.scale.set(1, 1.25, 1); d.position.set(x, y + r, z); g.add(d);
      var sp = c.mesh(new T.ConeGeometry(r * 0.35, r * 1.3, 10), col, info, { metalness: 0.5, roughness: 0.3 }); sp.position.set(x, y + r * 2.6, z); g.add(sp); }
    else { d = c.mesh(new T.SphereGeometry(r, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), col, info); d.position.set(x, y, z); g.add(d); }
    return d;
  }
  function spire(c, g, x, y, z, h, info) {
    var T = c.THREE;
    into(g, at(c.mesh(new T.ConeGeometry(0.25, h, 8), GOLD, info, { metalness: 0.7, roughness: 0.25 }), x, y + h / 2, z));
    into(g, at(c.mesh(new T.SphereGeometry(0.12, 8, 6), GOLD, info, { metalness: 0.7 }), x, y + h + 0.1, z));
  }
  function flagMesh(c, w, h, tex, info) {
    var T = c.THREE, geo = new T.PlaneGeometry(w, h, 16, 8);
    var m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: tex, side: T.DoubleSide, roughness: 0.8 }));
    m.userData.info = info; m.castShadow = true; m.userData.base = geo.attributes.position.array.slice(); return m;
  }
  function wave(m, t, amp) {
    var p = m.geometry.attributes.position, b = m.userData.base;
    for (var i = 0; i < p.count; i++) { var x = b[i * 3]; p.array[i * 3 + 2] = Math.sin(x * 2.2 - t * 3) * amp * (x - b[0] + 0.2) * 0.25; }
    p.needsUpdate = true; m.geometry.computeVertexNormals();
  }
  function canvasTex(c, w, h, draw) {
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    var t = new c.THREE.CanvasTexture(cv); if (c.THREE.SRGBColorSpace) t.colorSpace = c.THREE.SRGBColorSpace; return t;
  }
  function fade(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
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
  function arc(c, a, b, hgt, col, info, g) {
    var T = c.THREE, A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]);
    var M = A.clone().add(B).multiplyScalar(0.5); M.y += hgt;
    var curve = new T.QuadraticBezierCurve3(A, M, B);
    var m = c.mesh(new T.TubeGeometry(curve, 30, 0.05, 6, false), col, info); (g || c.root).add(m); m.userData.curve = curve; return m;
  }
  function keys(G) { return Object.keys(G); }

  /* ======================= 1. От Византии к Риму ======================= */
  reg('ru14-rome3d', {
    title: 'Смена культурного образца: от Византии к Риму',
    lead: 'Слева — Москва, «Третий Рим» (наследница Византии): купола, царь, Боярская дума. Справа — Петербург по образцу языческого Рима. Нажимай шаги: что именно Пётр «взял у Рима».',
    radius: 22, phi: 1.05, theta: 0.2, targetY: 2, height: 440, hint: 'Начни с «Москва — Третий Рим».',
    build: function (c) {
      var T = c.THREE; c.ground(11);
      var G = { mos: group(c, -5.5, 0, 0), ces: group(c), gua: group(c), sen: group(c), arc: group(c), plan: group(c), imp: group(c) };
      var mi = '<b>Москва — «Третий Рим».</b> Образец — православная Византия («Второй Рим»): царь, Боярская дума, храмы с куполами, славянская книжность.';
      into(G.mos, c.box3(3, 2, 2.4, WHITE, [0, 1, 0], mi));
      dome(c, G.mos, 0, 2, 0, 0.75, GOLD, mi, true);
      [[-1.1, -0.9], [1.1, -0.9], [-1.1, 0.9], [1.1, 0.9]].forEach(function (p) { into(G.mos, c.box3(0.5, 0.6, 0.5, WHITE, [p[0], 2.3, p[1]], mi)); dome(c, G.mos, p[0], 2.6, p[1], 0.3, '#2e6fb5', mi, true); });
      into(G.mos, c.label('Москва — Третий Рим\n(Византия)', [0, 5.6, 0], 0.5, '#f0c36b'));
      /* Рим справа: князь-кесарь */
      var ci = '<b>Князь-кесарь Ф. Ю. Ромодановский.</b> Перестав собирать Думу, Пётр на время отлучек (за границу, на войну) оставлял наместником «князя-кесаря» — аналог «младшего цезаря» в Риме.';
      var kp = person(c, 2, 3.5, '#8e2b2b', ci, G.ces, 1.1); beard(c, kp, 1.1);
      into(G.ces, at(c.mesh(new T.TorusGeometry(0.22, 0.05, 6, 14), GOLD, ci, { metalness: 0.6 }), 2, 1.55, 3.5)).rotation.x = Math.PI / 2;
      into(G.ces, c.label('князь-кесарь', [2, 2.4, 3.5], 0.42));
      /* гвардия-преторианцы */
      var gi = '<b>Гвардия.</b> Потешные Семёновский и Преображенский полки в 1700 г. получили имя гвардии — по традиции Рима: <b>преторианцы</b> — личная охрана консулов, потом императоров.';
      for (var i = 0; i < 4; i++) { var gp = person(c, 3.4 + i * 0.6, 1.5, GUARD, gi, G.gua, 0.85); into(gp, at(c.mesh(new T.CylinderGeometry(0.03, 0.03, 1.1, 6), '#3b2a1e', gi), 0.28, 0.8, 0)); }
      into(G.gua, c.label('гвардия = преторианцы', [4.3, 2.3, 1.5], 0.4));
      /* Сенат */
      var si = '<b>Сенат (1711).</b> Учреждён во время Прутского похода — орган управления с римским именем.';
      into(G.sen, c.box3(2.6, 0.3, 1.6, STONE, [5.2, 0.15, -1.6], si));
      for (var k = 0; k < 5; k++) column(c, G.sen, 4.2 + k * 0.5, -1.1, 1.5, WHITE, si, 0.1);
      into(G.sen, c.box3(2.6, 0.25, 1.6, STONE, [5.2, 1.95, -1.6], si)); pediment(c, G.sen, 5.2, 2.07, -1.1, 2.6, STONE, si);
      into(G.sen, c.label('Сенат', [5.2, 3.2, -1.6], 0.45));
      /* Триумфальная арка */
      var ai = '<b>Триумфальные арки.</b> Победы отмечали проходом войск под триумфальной аркой — как в Риме.';
      into(G.arc, c.box3(0.7, 2.6, 0.8, '#c9b48a', [0.6, 1.3, -3.5], ai)); into(G.arc, c.box3(0.7, 2.6, 0.8, '#c9b48a', [2.6, 1.3, -3.5], ai));
      into(G.arc, c.box3(2.7, 0.8, 0.8, '#c9b48a', [1.6, 3, -3.5], ai));
      into(G.arc, at(c.mesh(new T.TorusGeometry(0.6, 0.12, 6, 20, Math.PI), '#b49a6c', ai), 1.6, 2.6, -3.5)).rotation.z = 0;
      c.marchers = []; for (var m = 0; m < 3; m++) c.marchers.push(person(c, 1.6, -1.5, GUARD, ai, G.arc, 0.6));
      into(G.arc, c.label('триумфальная арка', [1.6, 4.2, -3.5], 0.42));
      /* регулярная планировка */
      var pi = '<b>Петербург строят по образам Рима:</b> регулярная (прямоугольная) планировка, ордерная архитектура (колонны), скульптура в городском пространстве.';
      for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) into(G.plan, c.box3(0.8, 0.4 + ((a + b) % 2) * 0.3, 0.8, '#e6c79a', [7.6 + a * 1.1, 0.25, 2 + b * 1.1], pi));
      into(G.plan, c.label('регулярный город', [8.7, 1.6, 3.1], 0.4));
      /* император */
      var ii = '<b>Император.</b> После Северной войны (1721) Сенат подносит Петру титул <b>Императора Всероссийского</b>. Imperator — обладатель <b>imperium</b>, власти над территорией, завоёванной военной силой.';
      c.crown = into(G.imp, at(c.mesh(new T.CylinderGeometry(0.6, 0.75, 0.6, 10, 1, true), GOLD, ii, { metalness: 0.7, roughness: 0.25, side: T.DoubleSide }), 4.5, 6.5, 1));
      into(G.imp, at(c.mesh(new T.SphereGeometry(0.2, 10, 8), RED, ii), 4.5, 7, 1));
      c.laurel = into(G.imp, at(c.mesh(new T.TorusGeometry(0.85, 0.09, 8, 24), GREEN, ii), 4.5, 6.5, 1)); c.laurel.rotation.x = Math.PI / 2;
      into(G.imp, c.label('Император', [4.5, 7.8, 1], 0.5, '#f0c36b'));
      into(c.root, c.label('Петербург — новый Рим', [4.5, 9, -3], 0.55, '#9dbcff'));
      c.G = G; c.t0 = 0;
      c.onFrame(function (t) {
        c.crown.rotation.y = t * 0.6; c.laurel.rotation.z = t * 0.6;
        c.marchers.forEach(function (p, i) { var k = (t * 0.25 + i / 3) % 1; p.position.set(1.6 + (i - 1) * 0.35, 0, lerp(-1.2, -5.5, k)); });
      });
    },
    chips: [
      { t: 'Москва — Третий Рим', on: function (c) { fade(c.G, ['mos']); c.setView(0.3, 1.0, 13, 2, -5.5, 0); c.say('Старый образец: <b>«Москва — Третий Рим»</b> (Второй — Византия). Власть священна, правитель — православный царь, советуется с Боярской думой.'); } },
      { t: '1. Князь-кесарь', on: function (c) { fade(c.G, ['ces']); c.setView(0.4, 1.0, 10, 1.5, 2, 3.5); c.pick(c.G.ces.children[0].children[0]); } },
      { t: '2. Гвардия', on: function (c) { fade(c.G, ['gua']); c.setView(0.4, 1.0, 10, 1.5, 4.3, 1.5); c.pick(c.G.gua.children[0].children[0]); } },
      { t: '3. Сенат', on: function (c) { fade(c.G, ['sen']); c.setView(0.4, 1.0, 10, 1.5, 5.2, -1.6); c.pick(c.G.sen.children[0]); } },
      { t: '4. Арка', on: function (c) { fade(c.G, ['arc']); c.setView(0.6, 1.1, 11, 2, 1.6, -3.5); c.pick(c.G.arc.children[0]); } },
      { t: '5. Город', on: function (c) { fade(c.G, ['plan']); c.setView(0.4, 0.8, 10, 0.5, 8.7, 3.1); c.pick(c.G.plan.children[0]); } },
      { t: '6. Император', on: function (c) { fade(c.G, ['imp']); c.setView(0.2, 1.2, 12, 6, 4.5, 1); c.pick(c.crown); } },
      { t: 'Всё вместе', on: function (c) { fade(c.G, keys(c.G)); c.setView(0.2, 1.05, 22, 2, 0, 0); c.say('Пётр меняет <b>сам образец</b>: не православная Византия, а <b>имперский Рим</b>. Кесарь, гвардия, Сенат, триумф, регулярный город и титул императора — всё это римские знаки.'); } }
    ]
  });
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ======================= 2. Царь или император ======================= */
  reg('ru14-imperium3d', {
    title: 'Царь и император: в чём разница',
    lead: 'Царь (от «цезарь») — помазанник, власть дана Богом. Император — от латинского imperium: власть над землями, взятыми военной силой. Сравни две «основы» власти.',
    radius: 15, phi: 1.1, theta: 0.3, targetY: 1.6, height: 400, hint: 'Нажми на постамент.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var zi = '<b>Царь.</b> Власть освящена церковью — царь венчается на царство, он «помазанник Божий». Образец — византийский василевс.';
      var ii = '<b>Император</b> (лат. imperator) — обладатель <b>imperium</b>: высшей военной и государственной власти. Империя изначально — территория, <b>завоёванная военной силой</b>. Пётр получает титул после победы в Северной войне (1721).';
      var L = group(c, -3, 0, 0), R = group(c, 3, 0, 0); c.L = L; c.R = R;
      into(L, c.box3(2.6, 1, 2.6, STONE, [0, 0.5, 0], zi));
      var cr = into(L, at(c.mesh(new T.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), GOLD, zi, { metalness: 0.6, roughness: 0.3 }), 0, 1.3, 0));
      into(L, at(c.mesh(new T.CylinderGeometry(0.6, 0.6, 0.18, 18), '#6b4a2e', zi), 0, 1.25, 0));
      into(L, at(c.mesh(new T.BoxGeometry(0.08, 0.5, 0.08), GOLD, zi), 0, 2.05, 0)); into(L, at(c.mesh(new T.BoxGeometry(0.3, 0.08, 0.08), GOLD, zi), 0, 2.1, 0));
      into(L, c.label('царь: от Бога', [0, 3, 0], 0.5, '#f0c36b'));
      for (var r = 0; r < 6; r++) { var ray = into(L, c.box3(0.06, 1.2, 0.06, '#ffe9a8', [Math.cos(r) * 0.2, 3.9, Math.sin(r) * 0.2], zi)); ray.rotation.z = (r - 2.5) * 0.25; }
      into(R, c.box3(2.6, 1, 2.6, STONE, [0, 0.5, 0], ii));
      var lr = into(R, at(c.mesh(new T.TorusGeometry(0.55, 0.12, 8, 24), GREEN, ii), 0, 1.6, 0)); lr.rotation.x = Math.PI / 2;
      var sw = into(R, at(c.mesh(new T.BoxGeometry(0.12, 1.8, 0.04), '#c9d1e6', ii, { metalness: 0.8, roughness: 0.2 }), 0, 2.2, 0)); c.sw = sw;
      into(R, c.label('император: от победы', [0, 3.6, 0], 0.5, '#9dbcff'));
      /* карта завоеваний */
      for (var k = 0; k < 7; k++) { var tile = into(R, c.box3(0.7, 0.12, 0.7, k < 3 ? GREEN : '#8b93b5', [Math.cos(k * 0.9) * 2.2, 0.06, Math.sin(k * 0.9) * 2.2 + 0.5], ii)); }
      c.onFrame(function (t) { sw.rotation.y = t; cr.rotation.y = t * 0.3; });
    },
    chips: [
      { t: 'Царь', on: function (c) { c.setView(-0.3, 1.0, 9, 1.8, -3, 0); c.pick(c.L.children[0]); } },
      { t: 'Император', on: function (c) { c.setView(0.6, 1.0, 9, 1.8, 3, 0); c.pick(c.R.children[0]); } },
      { t: 'Зачем Петру', on: function (c) { c.setView(0.3, 1.1, 15, 1.6, 0, 0); c.say('Титул «император» ставит Россию в один ряд с <b>европейскими державами</b> и опирается не на церковную традицию, а на <b>военную победу и государство</b>. Это часть того же поворота «от Византии к Риму».'); } }
    ]
  });

  /* ======================= 3. Флаги ======================= */
  reg('ru14-flags3d', {
    title: 'Флаги: откуда взялись Андреевский флаг и триколор',
    lead: 'Петровская символика собрана из европейских образцов. Сравни пары флагов — они развеваются на ветру.',
    radius: 16, phi: 1.2, theta: 0, targetY: 3, height: 420, hint: 'Нажми на флаг.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      function saltire(bg, fg) { return canvasTex(c, 256, 170, function (g, w, h) { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = fg; g.lineWidth = 30; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke(); }); }
      function tri(a, b, d) { return canvasTex(c, 256, 170, function (g, w, h) { g.fillStyle = a; g.fillRect(0, 0, w, h / 3); g.fillStyle = b; g.fillRect(0, h / 3, w, h / 3); g.fillStyle = d; g.fillRect(0, 2 * h / 3, w, h / 3 + 1); }); }
      var F = [
        [-5.4, 2.5, saltire('#1f4fa8', '#ffffff'), '<b>Флаг Шотландии</b> — белый косой крест святого Андрея на синем.', 'Шотландия'],
        [-1.8, 2.5, saltire('#ffffff', '#2f6fc0'), '<b>Андреевский флаг</b> — военно-морской флаг России: синий косой крест св. Андрея на белом. Тот же святой и тот же крест, что у Шотландии, только цвета поменяны.', 'Андреевский'],
        [1.8, 2.5, tri('#d62828', '#ffffff', '#21468b'), '<b>Флаг Голландии</b> — красно-бело-синий. Пётр учился кораблестроению в Голландии.', 'Голландия'],
        [5.4, 2.5, tri('#ffffff', '#2f6fc0', '#d62828'), '<b>Бело-сине-красный флаг</b> (торговый флаг при Петре) — те же три цвета, что у голландцев, но в другом порядке. На слайде — боевое знамя петровского времени с двуглавым орлом поверх триколора.', 'Россия']
      ];
      c.flags = [];
      F.forEach(function (f, i) {
        c.box3(0.1, 5, 0.1, '#d9d4c7', [f[0] - 1.3, 2.5, 0], f[3]);
        var m = flagMesh(c, 2.4, 1.6, f[2], f[3]); m.position.set(f[0] - 0.05, 4.1, 0); c.root.add(m); c.flags.push(m);
        c.label(f[4], [f[0], 0.7, 0.8], 0.45);
      });
      c.link([-5.4, 5.4, 0], [-1.8, 5.4, 0], GOLD, 0.04, '<b>Пара 1:</b> один святой Андрей Первозванный.');
      c.link([1.8, 5.4, 0], [5.4, 5.4, 0], GOLD, 0.04, '<b>Пара 2:</b> одни и те же три цвета.');
      c.onFrame(function (t) { c.flags.forEach(function (m, i) { wave(m, t + i, 0.6); }); });
    },
    chips: [
      { t: 'Крест св. Андрея', on: function (c) { c.setView(0, 1.25, 10, 3, -3.6, 0); c.pick(c.flags[1]); } },
      { t: 'Три цвета', on: function (c) { c.setView(0, 1.25, 10, 3, 3.6, 0); c.pick(c.flags[3]); } },
      { t: 'Вывод', on: function (c) { c.setView(0, 1.2, 16, 3, 0, 0); c.say('Даже государственные символы Пётр берёт у <b>европейских морских держав</b>. Слайд называется «Российское настоящее — это Европа».'); } }
    ]
  });

  /* ======================= 4. «Российское настоящее — это Европа» ======================= */
  reg('ru14-europe3d', {
    title: '«Российское настоящее — это Европа»',
    lead: 'Что менялось в повседневной жизни служилых людей. Нажимай на кнопки — боярин превращается в петровского дворянина.',
    radius: 13, phi: 1.1, theta: 0.4, targetY: 1.4, height: 430, hint: 'Начни с «Боярин».',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var bi = '<b>Боярин XVII века:</b> борода, длинный кафтан и шуба, высокая шапка.';
      var di = '<b>Петровский дворянин:</b> без бороды, парик, камзол и короткий кафтан польского, немецкого или голландского покроя, шпага, орден.';
      var B = group(c, -2, 0, 0), D = group(c, 2, 0, 0); c.B = B; c.D = D;
      var bp = person(c, 0, 0, '#8e2b2b', bi, B, 1.5); beard(c, bp, 1.5);
      into(bp, at(c.mesh(new T.CylinderGeometry(0.5, 0.65, 1.1, 14), '#6b2020', bi), 0, 0.55, 0));
      into(bp, at(c.mesh(new T.CylinderGeometry(0.2, 0.26, 0.55, 12), '#4a3020', bi), 0, 2.05, 0));
      B.add(c.label('боярин', [0, 3, 0], 0.45));
      var dp = person(c, 0, 0, '#c0392b', di, D, 1.5); wig(c, dp, 1.5);
      into(dp, at(c.mesh(new T.CylinderGeometry(0.33, 0.42, 0.55, 12), GOLD, di), 0, 0.95, 0));
      var swd = into(dp, at(c.mesh(new T.BoxGeometry(0.05, 0.05, 0.9), '#c9d1e6', di, { metalness: 0.8 }), 0.42, 0.65, 0.1)); swd.rotation.x = 0.6;
      c.order = into(dp, at(c.mesh(new T.OctahedronGeometry(0.12), '#5b8def', di, { metalness: 0.5 }), -0.15, 1.15, 0.38));
      var lab = c.label('дворянин', [0, 3, 0], 0.45); D.add(lab);
      /* язык */
      var li = '<b>Язык.</b> Из официальной речи уходят славянизмы и слова с греческими корнями; на смену идут романо-германские термины. Морские слова — из голландского: <b>драить, гавань, фарватер, гюйс, рейд</b>.';
      c.words = group(c); ['гавань', 'драить', 'фарватер', 'рейд', 'вахта', 'флаг'].forEach(function (w, i) { var s = c.label(w, [Math.cos(i) * 4, 3 + (i % 3) * 0.6, Math.sin(i) * 4], 0.42, '#9dbcff'); c.words.add(s); });
      c.wordBox = c.box3(0.4, 0.4, 0.4, BLUE, [4, 0.2, -2.6], li); c.label('язык', [4, 1, -2.6], 0.4);
      /* ассамблея */
      var ai = '<b>Ассамблеи</b> (с 1718 г.) — социализация элиты помимо службы. Там предписано «пить, курить, танцевать, играть в карты». Приходили с жёнами и дочерьми — для Руси это было новостью.';
      var tab = c.mesh(new T.CylinderGeometry(1, 1, 0.12, 24), WOOD, ai); tab.position.set(-4, 0.8, -2.5); c.root.add(tab);
      c.root.add(at(c.mesh(new T.CylinderGeometry(0.1, 0.15, 0.8, 8), WOOD, ai), -4, 0.4, -2.5));
      for (var k = 0; k < 4; k++) { var card = c.mesh(new T.BoxGeometry(0.25, 0.02, 0.35), WHITE, ai); card.position.set(-4 + Math.cos(k * 1.6) * 0.5, 0.88, -2.5 + Math.sin(k * 1.6) * 0.5); card.rotation.y = k; c.root.add(card); }
      c.dancers = [person(c, -5.6, -1, PURPLE, ai, null, 0.7), person(c, -5.1, -1, BLUE, ai, null, 0.7)];
      c.label('ассамблея', [-4, 2, -2.5], 0.42);
      /* академия */
      var ki = '<b>Наука.</b> Пётр отправил в Парижскую академию наук карту Каспийского моря, составленную при нём, и был избран её почётным членом (1717) — первый русский академик. Затем он основал Академию наук в Петербурге (1724); первые академики — приглашённые иностранцы, в основном немцы.';
      c.box3(1.4, 1, 1, STONE, [4, 0.5, 2.6], ki); pediment(c, c.root, 4, 1, 3.1, 1.4, STONE, ki); c.label('Академия', [4, 2, 2.6], 0.4);
      c.mode = 0;
      c.onFrame(function (t) {
        c.words.rotation.y = t * 0.15;
        c.order.rotation.y = t * 2;
        c.dancers.forEach(function (d, i) { d.position.x = -5.35 + Math.cos(t * 1.5 + i * Math.PI) * 0.4; d.position.z = -1 + Math.sin(t * 1.5 + i * Math.PI) * 0.4; });
      });
    },
    chips: [
      { t: 'Боярин', on: function (c) { c.setView(-0.4, 1.0, 8, 1.6, -2, 0); c.pick(c.B.children[0].children[0]); } },
      { t: 'Дворянин', on: function (c) { c.setView(0.4, 1.0, 8, 1.6, 2, 0); c.say('<b>На госслужбе бороды запрещены</b>; костюм — польского, немецкого или голландского покроя. За отличия — <b>ордена и медали европейского образца</b> (первый — орден Андрея Первозванного, 1698).'); } },
      { t: 'Язык', on: function (c) { c.setView(0.9, 1.1, 12, 3, 0, 0); c.pick(c.wordBox); } },
      { t: 'Ассамблея', on: function (c) { c.setView(-0.9, 1.0, 9, 1, -4.5, -2); c.pick(c.dancers[0].children[0]); } },
      { t: 'Академия', on: function (c) { c.setView(0.9, 1.0, 8, 1, 4, 2.6); c.pick(c.root.children.filter(function (x) { return x.userData && x.userData.info && /Наука/.test(x.userData.info); })[0]); } }
    ]
  });

  /* ======================= 5. Образование ======================= */
  reg('ru14-school3d', {
    title: 'Образование при Петре: профессиональное',
    lead: 'В центре — Россия и её новые школы, по краям — европейские города, куда ехали учиться. Дуги показывают, кто и куда ехал.',
    radius: 22, phi: 0.9, theta: 0.2, targetY: 0, height: 440, hint: 'Нажми на кнопку или на школу.',
    build: function (c) {
      var T = c.THREE;
      c.box3(20, 0.2, 13, '-panel2', [0, -0.1, 0], null);
      var S = [
        [6, -1, 'Азов 1686', '<b>Мореходная школа, Азов, 1686</b> (так на слайде).'],
        [3.5, -3.5, 'Навигацкая 1701', '<b>Школа математических и навигацких наук</b> — Москва, 1701 (Сухарева башня). С 1715 г. старшие классы — в Петербурге (Морская академия): артиллерия, мореходство, инженерное дело.'],
        [5.2, -4.8, 'Лекарская 1706', '<b>Лекарская (медицинская) школа</b> — Москва, 1706.'],
        [3, -6, 'Шляхетский 1731', '<b>Сухопутный шляхетский корпус</b> — Петербург, 1731 (уже при Анне Иоанновне). Готовил офицеров из дворян.'],
        [6.8, -3, 'цифирные 1715', '<b>Всесословные «цифирные школы»</b> (с 1714–1715 гг.) — начальное образование: грамота, счёт, начала геометрии.']
      ];
      c.schools = [];
      S.forEach(function (s, i) { var m = c.box3(0.8, 0.6 + i * 0.1, 0.8, i === 4 ? GREEN : GOLD, [s[0], 0.35, s[1]], s[3]); c.schools.push(m); c.label(s[2], [s[0], 1.4, s[1]], 0.36); });
      c.label('Россия', [5, 2.6, -3.5], 0.6, '#f0c36b');
      var E = [
        ['Амстердам', -5, -2, 0], ['Лондон', -8, -4, 0], ['Венеция', -3, 4.5, 0],
        ['Рига', 1, -1, 1], ['Ревель', 1.5, -3, 1], ['Стокгольм', -1, -5, 1],
        ['Женева', -6, 3, 2], ['Берн', -4.5, 2, 2], ['Болонья', -1.5, 5.5, 2], ['Париж', -7.5, 0.5, 2]
      ];
      var COL = [BLUE, PURPLE, RED];
      var INFO = ['<b>Дворяне по направлению от государства</b> — Амстердам, Лондон, Венеция: кораблестроение, навигация, военное дело.',
        '<b>«Приказные люди»</b> (будущие чиновники) — Рига, Ревель, Стокгольм: учились канцелярскому делу, шведскому устройству коллегий.',
        '<b>Дворяне по собственному почину</b> — Женева, Берн, Болонья, Париж.'];
      c.G = { 0: group(c), 1: group(c), 2: group(c) };
      E.forEach(function (e) {
        var g = c.G[e[3]];
        into(g, at(c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.3, 14), COL[e[3]], INFO[e[3]]), e[1], 0.15, e[2]));
        into(g, c.label(e[0], [e[1], 0.9, e[2]], 0.36));
        into(g, arc(c, [5, 0.3, -3.5], [e[1], 0.3, e[2]], 2.5 + Math.abs(e[1]) * 0.2, COL[e[3]], INFO[e[3]], g));
      });
      c.dots = [];
      [0, 1, 2].forEach(function (k) { var d = c.mesh(new T.SphereGeometry(0.16, 10, 8), WHITE, null); c.G[k].add(d); c.dots.push(d); });
      c.onFrame(function (t) {
        [0, 1, 2].forEach(function (k) {
          var tubes = c.G[k].children.filter(function (x) { return x.userData.curve; });
          var idx = Math.floor(t * 0.4) % tubes.length, f = (t * 0.4) % 1;
          c.dots[k].position.copy(tubes[idx].userData.curve.getPoint(f));
        });
      });
    },
    chips: [
      { t: 'Школы в России', on: function (c) { fade(c.G, []); c.setView(0.3, 0.9, 12, 0, 5, -3.5); c.say('Петровские школы — <b>профессиональные</b>: каждая готовит под конкретную службу (флот, артиллерия, медицина, армия). Общего «гуманитарного» образования пока нет.'); } },
      { t: 'По приказу', on: function (c) { fade(c.G, ['0']); c.setView(-0.4, 0.9, 18, 0, -2, 0); c.say(c.G[0].children[0].userData.info); } },
      { t: 'Приказные', on: function (c) { fade(c.G, ['1']); c.setView(0.2, 0.9, 14, 0, 1, -3); c.say(c.G[1].children[0].userData.info); } },
      { t: 'По своей воле', on: function (c) { fade(c.G, ['2']); c.setView(-0.6, 0.9, 16, 0, -4, 3); c.say(c.G[2].children[0].userData.info); } },
      { t: 'Цифирные', on: function (c) { fade(c.G, []); c.setView(0.6, 1.0, 9, 0, 6.8, -3); c.pick(c.schools[4]); } }
    ]
  });

  /* ======================= 6. Бецкой и «новая порода людей» ======================= */
  reg('ru14-smolny3d', {
    title: 'Бецкой: «новая порода людей» и Смольный институт',
    lead: 'Идея эпохи Просвещения: если забрать ребёнка из старой среды и воспитать в закрытом заведении, вырастет «новый человек». Четыре возраста Смольного — четыре цвета платьев.',
    radius: 18, phi: 1.0, theta: 0.5, targetY: 1.2, height: 430, hint: 'Нажимай шаги по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var hi = '<b>Семья и «старая среда».</b> По мысли Бецкого, она передаёт ребёнку грубость и предрассудки — поэтому детей надо от неё изолировать.';
      c.home = house(c, -6, 2.5, '#a07a55', hi, 1.6);
      c.label('семья, «старая среда»', [-6, 2.6, 2.5], 0.4);
      var wi = '<b>Закрытое учебное заведение.</b> Ребёнок попадает сюда маленьким и живёт годами, почти не видясь с родными. Так воспитывают «новую породу людей».';
      var wall = c.mesh(new T.TorusGeometry(4, 0.25, 6, 40), STONE, wi); wall.rotation.x = Math.PI / 2; wall.position.set(1.5, 0.3, 0); c.root.add(wall);
      var bi = '<b>Смольный институт благородных девиц</b> (1764) — первое в России государственное учебное заведение для девушек. Его организатор — <b>И. И. Бецкой</b>, помощник Екатерины II по делам образования.';
      c.box3(3, 1.6, 1.4, '#f0e2c0', [1.5, 0.8, -2.2], bi); pediment(c, c.root, 1.5, 1.6, -1.5, 3, '#f0e2c0', bi);
      for (var k = 0; k < 4; k++) column(c, c.root, 0.5 + k * 0.66, -1.35, 1.3, WHITE, bi, 0.09);
      c.label('Смольный', [1.5, 3, -2.2], 0.45, '#f0c36b');
      var AGES = [['кофейный', '#7a5236', '6–9 лет'], ['голубой', '#7fb2e6', '9–12'], ['серый', '#9aa0a8', '12–15'], ['белый', '#f4f1ea', '15–18']];
      var ai = '<b>Четыре «возраста» по три года</b> — у каждого свой цвет платья: кофейный, голубой, серый, белый. Девочку принимали в 6 лет и выпускали в 18 — 12 лет почти без семьи.';
      c.girls = [];
      AGES.forEach(function (a, i) {
        for (var j = 0; j < 3; j++) { var g = person(c, -0.5 + i * 1.3, 1 + j * 0.6, a[1], ai, null, 0.55 + i * 0.12); c.girls.push(g); }
        c.label(a[0] + '\n' + a[2], [-0.5 + i * 1.3, 2.4, 3.2], 0.32);
      });
      var di = '<b>Иван Иванович Бецкой</b> (1704–1795) — внебрачный сын фельдмаршала И. Ю. Трубецкого (отсюда «урезанная» фамилия Бецкой). Получил образование в Европе, вдохновлялся идеями Просвещения (Локк, Руссо).';
      c.betskoy = person(c, -3, -2, '#3a3f55', di, null, 1.2); wig(c, c.betskoy, 1.2);
      c.label('Бецкой', [-3, 2.4, -2], 0.42);
      c.step = 2;
      c.onFrame(function (t) {
        c.girls.forEach(function (g, i) { g.position.y = c.step >= 2 ? Math.abs(Math.sin(t * 2 + i)) * 0.06 : 0; g.visible = c.step >= 2; });
      });
    },
    chips: [
      { t: '1. Идея', on: function (c) { c.step = 1; c.setView(-0.2, 1.0, 11, 1.2, -3, -1); c.pick(c.betskoy.children[0]); } },
      { t: '2. Изоляция', on: function (c) { c.step = 2; c.setView(0.5, 1.0, 16, 1, -1, 1); c.say('Ребёнка забирают из «старой среды» и помещают в закрытое заведение. Внутри растут <b>новые люди</b> — так мыслил Бецкой и вся эпоха Просвещения: человека можно «переделать» воспитанием.'); } },
      { t: '3. Четыре возраста', on: function (c) { c.step = 2; c.setView(0.1, 0.9, 10, 0.8, 1.5, 2); c.pick(c.girls[0].children[0]); } },
      { t: '4. Смольный', on: function (c) { c.step = 2; c.setView(0.2, 1.0, 10, 1.4, 1.5, -2); c.say(c.root.children.filter(function (x) { return x.userData && x.userData.info && /Смольный институт/.test(x.userData.info); })[0].userData.info + ' Сначала обучение казалось обременительным, но вскоре стало <b>престижным</b>.'); } }
    ]
  });
  function house(c, x, z, col, info, s) {
    var T = c.THREE; s = s || 1;
    var h = new T.Group(); c.root.add(h); h.position.set(x, 0, z);
    h.add(at(c.mesh(new T.BoxGeometry(1 * s, 0.8 * s, 1 * s), col, info), 0, 0.4 * s, 0));
    var r = c.mesh(new T.ConeGeometry(0.8 * s, 0.6 * s, 4), '#7a4b32', info); r.position.y = 1.1 * s; r.rotation.y = Math.PI / 4; h.add(r);
    return h;
  }

  /* ======================= 7. Лента стилей ======================= */
  reg('ru14-styles3d', {
    title: 'Стили XVIII века на одной ленте',
    lead: 'Лента времени 1700–1800. Каждый блок — стиль и его «посыл». Высота — насколько стиль государственный.',
    radius: 22, phi: 1.05, theta: 0.3, targetY: 1.5, height: 420, hint: 'Нажми на блок или кнопку.',
    build: function (c) {
      var T = c.THREE, X = function (y) { return (y - 1750) * 0.16; };
      c.box3(X(1805) - X(1695), 0.2, 2, '-panel2', [0, 0.1, 0], null);
      [1700, 1725, 1750, 1775, 1800].forEach(function (y) { c.label(String(y), [X(y), 0.5, 1.6], 0.38, '#b9c0d8'); });
      var S = [
        ['dutch', 1700, 1730, AZURE, 3, 'Голландское\nбарокко', '<b>Петровское (голландское) барокко, ~1700–1730.</b> Посыл: «Россия — Европа». Строго, по-деловому: шпиль Петропавловского собора, Меншиковский дворец, Летний сад.'],
        ['baroque', 1730, 1762, GOLD, 3.6, 'Барокко\n(Растрелли)', '<b>Пышное барокко, II четверть — середина XVIII в.</b> (Анна, особенно Елизавета). Посыл: «Россия стала великой державой — теперь можно отдыхать и праздновать». Гармония — в движении.'],
        ['classic', 1762, 1800, '#e9e4d6', 4.2, 'Классицизм', '<b>Классицизм, II половина XVIII в.</b> (Екатерина II). Посыл: «государство выбирает, что прекрасно, объясняет почему и показывает, как этого достичь». Гармония — в покое и симметрии; цель искусства — наставление.'],
        ['senti', 1780, 1800, '#f2a7b8', 1.6, 'Сентиментализм', '<b>Сентиментализм, конец XVIII в.</b> — первый <b>негосударственный</b> вариант элитарной эстетики: чувство важнее разума, частная жизнь интереснее истории государства.']
      ];
      c.G = {};
      S.forEach(function (s) {
        var g = group(c); c.G[s[0]] = g; var x0 = X(s[1]), x1 = X(s[2]), z = s[0] === 'senti' ? -1.4 : 0;
        var m = into(g, c.box3(x1 - x0 - 0.1, s[4], s[0] === 'senti' ? 0.9 : 1.4, s[3], [(x0 + x1) / 2, s[4] / 2 + 0.2, z], s[6]));
        into(g, c.label(s[5], [(x0 + x1) / 2, s[4] + 1, z], 0.42));
        g.userData.main = m;
      });
      c.onFrame(function (t) { c.G.baroque.userData.main.rotation.y = Math.sin(t * 2) * 0.05; });
    },
    chips: [
      { t: 'Вся лента', on: function (c) { fade(c.G, keys(c.G)); c.setView(0.3, 1.05, 22, 1.5, 0, 0); c.say('Три государственных стиля сменяют друг друга, а в конце века появляется первый <b>частный</b> — сентиментализм.'); } },
      { t: 'Голландское барокко', on: function (c) { fade(c.G, ['dutch']); c.setView(0.1, 1.0, 11, 1.5, -5.6, 0); c.pick(c.G.dutch.userData.main); } },
      { t: 'Барокко', on: function (c) { fade(c.G, ['baroque']); c.setView(0.1, 1.0, 11, 1.8, -0.7, 0); c.pick(c.G.baroque.userData.main); } },
      { t: 'Классицизм', on: function (c) { fade(c.G, ['classic']); c.setView(0.1, 1.0, 11, 2, 3.8, 0); c.pick(c.G.classic.userData.main); } },
      { t: 'Сентиментализм', on: function (c) { fade(c.G, ['senti']); c.setView(0.3, 1.0, 9, 1, 6.4, -1.4); c.pick(c.G.senti.userData.main); } }
    ]
  });

  /* ======================= 8. Летний сад и Петергоф ======================= */
  reg('ru14-garden3d', {
    title: 'Регулярный сад: «новый образ мира»',
    lead: 'Летний сад и Петергоф: прямые аллеи, стриженые боскеты, мраморные статуи античных богов и аллегорий, фонтаны. Природа подчинена разуму и геометрии.',
    radius: 24, phi: 0.95, theta: 0.6, targetY: 0.8, height: 440, hint: 'Нажми на статую или фонтан.',
    build: function (c) {
      var T = c.THREE; c.box3(16, 0.2, 21, '#3f6b3a', [0, -0.1, 2], null);
      var bi = '<b>Боскеты и аллеи.</b> Регулярный (французский) парк: всё симметрично, кусты подстрижены в геометрические формы. Человек упорядочивает природу.';
      for (var a = -1; a <= 1; a += 2) for (var k = 0; k < 6; k++) { c.box3(0.9, 0.9, 1.6, '#2e5a2c', [a * 1.6, 0.45, -6 + k * 2.4], bi); c.box3(0.9, 0.9, 1.6, '#2e5a2c', [a * 4.5, 0.45, -6 + k * 2.4], bi); }
      c.box3(1.8, 0.05, 16, '#d8c9a8', [0, 0.03, 0], bi);
      var si = '<b>Мраморные статуи</b> Летнего сада привезены из Италии при Петре: античные боги, аллегории (Правосудие, Мир, Слава, Навигация). Скульптура в городском пространстве — новинка для России: в православной традиции круглой скульптуры почти не было.';
      c.statues = [];
      for (var i = 0; i < 6; i++) {
        var x = (i % 2 ? 1 : -1) * 2.9, z = -5 + Math.floor(i / 2) * 4;
        c.box3(0.6, 0.6, 0.6, '#cfc8b8', [x, 0.3, z], si);
        var st = person(c, x, z, WHITE, si, null, 0.9, 0.6); c.statues.push(st);
        var arm = c.mesh(new T.CylinderGeometry(0.05, 0.05, 0.6, 6), WHITE, si); arm.position.set(0.25, 1.1, 0); arm.rotation.z = -0.9; st.add(arm);
      }
      var fi = '<b>Фонтаны Петергофа.</b> Большой каскад и «Самсон, раздирающий пасть льву» — аллегория победы над Швецией под Полтавой (в день Самсона-странноприимца, 27 июня 1709 г.).';
      var pool = c.mesh(new T.CylinderGeometry(1.6, 1.6, 0.3, 30), WATER, fi); pool.position.set(0, 0.15, 10); c.root.add(pool);
      c.samson = person(c, 0, 10, GOLD, fi, null, 1, 0.3); c.samson.children.forEach(function (x) { x.material.metalness = 0.7; x.material.roughness = 0.3; });
      c.jet = c.mesh(new T.CylinderGeometry(0.05, 0.12, 3, 8), '#cfe9ff', fi); c.jet.position.set(0, 2.6, 10); c.jet.material.transparent = true; c.jet.material.opacity = 0.75; c.root.add(c.jet);
      c.drops = []; for (var d = 0; d < 14; d++) { var dr = c.mesh(new T.SphereGeometry(0.07, 6, 4), '#cfe9ff', fi); c.root.add(dr); c.drops.push(dr); }
      c.label('Летний сад', [0, 2.6, -6], 0.5); c.label('Петергоф: «Самсон»', [0, 4.9, 10], 0.45, '#f0c36b');
      c.onFrame(function (t) {
        c.jet.scale.y = 1 + Math.sin(t * 6) * 0.05;
        c.drops.forEach(function (d, i) { var k = (t * 0.7 + i / 14) % 1, a = i * 0.45; d.position.set(Math.cos(a) * k * 1.4, 4.1 + 1.2 * k - 5 * k * k, 10 + Math.sin(a) * k * 1.4); });
      });
    },
    chips: [
      { t: 'Аллеи', on: function (c) { c.setView(0, 0.7, 16, 0.5, 0, -2); c.say(c.root.children[1].userData.info); } },
      { t: 'Статуи', on: function (c) { c.setView(0.6, 1.0, 7, 1, -2.9, -1); c.pick(c.statues[2].children[0]); } },
      { t: 'Самсон', on: function (c) { c.setView(0.2, 1.0, 9, 2, 0, 10); c.pick(c.samson.children[0]); } }
    ]
  });

  /* ======================= 9. Голландское барокко ======================= */
  reg('ru14-dutch3d', {
    title: 'Эстетика голландского барокко',
    lead: 'Три постройки со слайда: Петропавловский собор со шпилем, Меншиковский дворец и Сухарева башня. Общее — шпиль, строгий фасад, ориентация на протестантский Север, а не на Византию.',
    radius: 20, phi: 1.1, theta: 0.2, targetY: 3, height: 460, hint: 'Нажми на здание.',
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var G = { pp: group(c, -5, 0, 0), men: group(c, 1, 0, 1), suh: group(c, 6, 0, -1) }; c.G = G;
      var pi = '<b>Петропавловский собор</b> (Д. Трезини, 1712–1733). Вместо привычных куполов — высокий золочёный <b>шпиль</b> (122 м): так строили лютеранские храмы Северной Европы. Внутри — не иконостас-стена, а резной золочёный иконостас-триумфальная арка.';
      into(G.pp, c.box3(2.6, 2.2, 4, '#f1d9a0', [0, 1.1, 0], pi));
      into(G.pp, c.box3(1.6, 3.2, 1.6, '#f1d9a0', [0, 3.8, 1.2], pi)); into(G.pp, c.box3(1.2, 1.4, 1.2, '#f1d9a0', [0, 6.1, 1.2], pi));
      spire(c, G.pp, 0, 6.8, 1.2, 5.5, pi);
      into(G.pp, c.label('Петропавловский собор', [0, 13.4, 1.2], 0.45, '#f0c36b'));
      var mi = '<b>Меншиковский (Большой) дворец в Ораниенбауме</b> — загородная резиденция А. Д. Меншикова (1710–1727): широкий фасад, полукруглые галереи, «голландские» крыши.';
      into(G.men, c.box3(4, 1.6, 1.6, '#f0e2c0', [0, 0.8, 0], mi)); into(G.men, c.box3(4.2, 0.3, 1.8, '#5b8a6e', [0, 1.75, 0], mi));
      into(G.men, c.box3(1.2, 2.4, 1.4, '#f0e2c0', [0, 1.2, 0.2], mi)); dome(c, G.men, 0, 2.4, 0.2, 0.45, '#5b8a6e', mi);
      [-1, 1].forEach(function (s) { var gal = c.mesh(new T.TorusGeometry(2.6, 0.3, 6, 18, Math.PI / 2), '#f0e2c0', mi); gal.rotation.x = Math.PI / 2; gal.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI; gal.position.set(s * 2, 0.3, 2.6); G.men.add(gal); });
      into(G.men, c.label('Меншиковский дворец', [0, 3.6, 0], 0.42));
      var si = '<b>Сухарева башня</b> (Москва, 1692–1695, перестроена при Петре). В ней разместили <b>Школу математических и навигацких наук</b> (1701). Снесена в 1934 г.';
      into(G.suh, c.box3(3, 1.6, 2, '#b34a3a', [0, 0.8, 0], si)); into(G.suh, c.box3(2, 1.4, 1.6, '#b34a3a', [0, 2.3, 0], si));
      into(G.suh, c.box3(1.2, 2.4, 1.2, '#b34a3a', [0, 4.2, 0], si)); into(G.suh, c.box3(0.8, 1, 0.8, WHITE, [0, 5.9, 0], si));
      spire(c, G.suh, 0, 6.4, 0, 1.6, si);
      into(G.suh, at(c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.06, 20), WHITE, si), 0, 4.6, 0.62)).rotation.x = Math.PI / 2;
      into(G.suh, c.label('Сухарева башня', [0, 8.8, 0], 0.42));
    },
    chips: [
      { t: 'Шпиль', on: function (c) { fade(c.G, ['pp']); c.setView(0.3, 1.2, 16, 5, -5, 0); c.pick(c.G.pp.children[0]); } },
      { t: 'Меншиковский', on: function (c) { fade(c.G, ['men']); c.setView(0.1, 1.0, 11, 1.5, 1, 1); c.pick(c.G.men.children[0]); } },
      { t: 'Сухарева башня', on: function (c) { fade(c.G, ['suh']); c.setView(-0.3, 1.1, 13, 4, 6, -1); c.pick(c.G.suh.children[0]); } },
      { t: 'Вместе', on: function (c) { fade(c.G, keys(c.G)); c.setView(0.2, 1.1, 20, 3, 0, 0); c.say('<b>Новый образ мира</b> — в камне. Голландия для Петра — образец деловой, морской, протестантской Европы. Отсюда шпили и строгие фасады вместо шатров и луковичных глав.'); } }
    ]
  });

  /* ======================= 10. Барокко Растрелли ======================= */
  reg('ru14-baroque3d', {
    title: 'Барокко: гармония в движении',
    lead: 'Смольный собор Растрелли. Фасад «играет»: выступы, колонны пучками, пять глав, яркий цвет. Барокко ловит момент перехода — поэтому всё кажется в движении.',
    radius: 18, phi: 1.1, theta: 0.3, targetY: 3, height: 460, hint: 'Нажимай принципы барокко.',
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var ci = '<b>Смольный собор</b> (Ф.-Б. Растрелли, с 1748 г., при Елизавете). Пять глав — дань русской традиции, но в «одежде» европейского барокко: изгибы, пучки колонн, белое на голубом.';
      c.body = c.box3(3.2, 3.4, 3.2, AZURE, [0, 1.7, 0], ci);
      c.cols = [];
      for (var s = 0; s < 4; s++) for (var k = -1; k <= 1; k += 2) {
        var a = s * Math.PI / 2, x = Math.cos(a) * 1.75 + Math.sin(a) * k * 1.1, z = Math.sin(a) * 1.75 - Math.cos(a) * k * 1.1;
        var col = c.mesh(new T.CylinderGeometry(0.13, 0.13, 3.2, 10), WHITE, ci); col.position.set(x, 1.7, z); c.root.add(col); c.cols.push(col);
      }
      c.drum = c.mesh(new T.CylinderGeometry(1.1, 1.2, 1.6, 16), AZURE, ci); c.drum.position.y = 4.2; c.root.add(c.drum);
      c.domes = [dome(c, c.root, 0, 5, 0, 1, '#6aa6d8', ci, true)];
      [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].forEach(function (p) {
        var tw = c.mesh(new T.CylinderGeometry(0.45, 0.5, 1.4, 12), AZURE, ci); tw.position.set(p[0], 4.1, p[1]); c.root.add(tw);
        c.domes.push(dome(c, c.root, p[0], 4.8, p[1], 0.45, '#6aa6d8', ci, true));
      });
      c.cross = c.mesh(new T.BoxGeometry(0.08, 0.7, 0.08), GOLD, ci, { metalness: 0.7 }); c.cross.position.y = 8.1; c.root.add(c.cross);
      var vi = '<b>Волюты и картуши</b> — завитки и лепнина, которые «перетекают» друг в друга. Нарушение спокойной формы выявляет идеал.';
      c.volutes = []; for (var v = 0; v < 8; v++) { var tor = c.mesh(new T.TorusGeometry(0.28, 0.07, 6, 16, Math.PI * 1.5), WHITE, vi); var b = v * Math.PI / 4; tor.position.set(Math.cos(b) * 1.75, 3.55, Math.sin(b) * 1.75); tor.rotation.y = -b; c.root.add(tor); c.volutes.push(tor); }
      c.label('Смольный собор', [0, 9.2, 0], 0.5, '#9dbcff');
      c.motion = 0;
      c.onFrame(function (t) {
        var m = c.motion;
        c.cols.forEach(function (x, i) { x.position.y = 1.7 + Math.sin(t * 2 + i * 0.8) * 0.15 * m; });
        c.volutes.forEach(function (x, i) { x.rotation.z = Math.sin(t * 1.5 + i) * 0.4 * m; });
        c.domes.forEach(function (d, i) { d.scale.set(1 + Math.sin(t * 2 + i) * 0.06 * m, 1.25 + Math.cos(t * 2 + i) * 0.08 * m, 1 + Math.sin(t * 2 + i) * 0.06 * m); });
        c.drum.rotation.y = t * 0.2 * m;
      });
    },
    chips: [
      { t: 'Гармония — в движении', on: function (c) { c.motion = 1; c.setView(0.3, 1.1, 14, 3.5); c.say('Барокко: понимать гармонию как <b>статичное равновесие — ложно</b>. Настоящая гармония — в постоянном движении, в <b>переходе</b> от одной формы к другой.'); } },
      { t: 'Сюжет перехода', on: function (c) { c.motion = 1; c.setView(1.2, 1.0, 10, 3.5); c.pick(c.volutes[0]); } },
      { t: 'Задача искусства', on: function (c) { c.motion = 0.3; c.setView(-0.4, 1.2, 15, 4); c.say('Задача искусства — <b>зафиксировать процесс перехода</b> (формы, чувства, явления), показать красоту жизни, насыщенной движением. Достигается <b>композицией</b>; цвет, свет и фактура создают иллюзию реальности.'); } },
      { t: 'Растрелли', on: function (c) { c.motion = 0; c.setView(0.3, 1.1, 18, 3); c.pick(c.body); } }
    ]
  });

  /* ======================= 11. Классицизм ======================= */
  reg('ru14-classic3d', {
    title: 'Классицизм: гармония в покое',
    lead: 'Дом Пашкова (В. Баженов) — образец классицизма. Строгая симметрия и трёхчастная композиция: центр + два крыла. Включи «барокко» и «классицизм» — увидишь разницу.',
    radius: 18, phi: 1.1, theta: 0.2, targetY: 2, height: 440, hint: 'Нажми на часть здания.',
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var G = { left: group(c), center: group(c), right: group(c) }; c.G = G;
      var ci = '<b>Центр</b> — главная часть с колоннами, фронтоном и бельведером (круглая башенка с куполом). Здесь «идеал».';
      var wi = '<b>Крылья</b> симметричны и подчинены центру. <b>Трёхчастная композиция</b> закрепляет идеал.';
      into(G.center, c.box3(3, 3, 2.4, WHITE, [0, 1.5, 0], ci));
      for (var k = 0; k < 4; k++) column(c, G.center, -1.05 + k * 0.7, 1.4, 2.6, WHITE, ci, 0.15);
      pediment(c, G.center, 0, 3, 1.4, 3, WHITE, ci);
      into(G.center, at(c.mesh(new T.CylinderGeometry(0.9, 0.9, 1.2, 20), WHITE, ci), 0, 3.6, 0));
      dome(c, G.center, 0, 4.2, 0, 0.9, '#6f8f8a', ci);
      c.wings = [];
      [-1, 1].forEach(function (s) {
        var g = s < 0 ? G.left : G.right;
        var w = into(g, c.box3(2.4, 2, 2, WHITE, [s * 3.6, 1, 0], wi)); c.wings.push(w);
        into(g, c.box3(1.2, 1.4, 0.2, '#d9d4c7', [s * 2.1, 0.7, 1.1], wi));
        pediment(c, g, s * 3.6, 2, 1.0, 2.4, WHITE, wi);
      });
      var hi = '<b>Холм и сад</b> — дом стоит над городом, как «идеал над реальностью».';
      c.box3(12, 0.6, 5, '#4f7a46', [0, -0.25, 0], hi);
      c.label('Дом Пашкова', [0, 6.2, 0], 0.5, '#f0c36b');
      c.mode = 0;
      c.onFrame(function (t) {
        var m = c.mode; // 1 = барокко-нарушение
        c.wings.forEach(function (w, i) { w.position.y = 1 + (m ? Math.sin(t * 2 + i * 2) * 0.4 : 0); w.rotation.y = m ? Math.sin(t + i) * 0.25 : w.rotation.y * 0.9; });
        G.center.rotation.y = m ? Math.sin(t * 0.8) * 0.12 : G.center.rotation.y * 0.9;
      });
    },
    chips: [
      { t: 'Классицизм', on: function (c) { c.mode = 0; c.setView(0.2, 1.1, 18, 2); c.say('Гармония — <b>отражение идеала в реальном мире</b>. Идеал абстрактен, но связан с реальностью: отрицая то, что есть, показывает, <b>как должно быть</b>. Красота — не в движении, а в том, чтобы показать <b>должное</b> в существующем.'); } },
      { t: 'Если бы барокко', on: function (c) { c.mode = 1; c.setView(0.4, 1.1, 18, 2); c.say('Для сравнения — «барочное» движение: формы колеблются и перетекают. Классицизм такого не допускает: всё неподвижно, симметрично, на своём месте.'); } },
      { t: 'Центр', on: function (c) { c.mode = 0; c.setView(0.1, 1.0, 10, 3, 0, 0); c.pick(c.G.center.children[0]); } },
      { t: 'Три части', on: function (c) { c.mode = 0; c.setView(0, 1.25, 16, 1.5); c.pick(c.wings[0]); } },
      { t: 'Цель — наставление', on: function (c) { c.mode = 0; c.setView(-0.3, 1.0, 14, 2); c.say('Цель искусства — <b>наставление</b>. Главный сюжет — <b>героический</b>. Основа гармонии — <b>композиция</b>. Государство решает, что прекрасно, объясняет почему и показывает, как этого достичь.'); } }
    ]
  });

  /* ======================= 12. Портрет: парадный, психологический, сентиментальный ======================= */
  reg('ru14-portrait3d', {
    title: 'Три портрета: парадный → психологический → сентиментальный',
    lead: 'Три рамы — три эпохи портрета. Парадный показывает должность, психологический — душу, сентиментальный — частную жизнь. Внизу — три цвета классицизма.',
    radius: 16, phi: 1.15, theta: 0, targetY: 2.6, height: 440, hint: 'Нажми на портрет.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      function frame(x, info, bg) {
        var g = group(c, x, 0, 0);
        into(g, c.box3(2.8, 3.6, 0.2, GOLD, [0, 2.8, 0], info)).material.metalness = 0.5;
        into(g, c.box3(2.4, 3.2, 0.1, bg, [0, 2.8, 0.12], info));
        return g;
      }
      var pi = '<b>Парадный портрет.</b> Человек как носитель <b>должности и статуса</b>: в полный рост, мантия, ордена, колонны и драпировки, жест власти. Классицизм: три плана и три цвета — коричневый, зелёный, голубой (Левицкий, Боровиковский, портреты Екатерины II и вельмож).';
      var si = '<b>Психологический портрет</b> — высшее достижение второй половины XVIII века. Ф. С. Рокотов, «Портрет Струйской» (1772): лицо из полутьмы, «полуулыбка, полуплач», глаза «как два тумана» (стихи Н. Заболоцкого). Рядом на слайде — «Дама в голубом» Гейнсборо.';
      var ni = '<b>Сентиментализм</b> — первый <b>негосударственный</b> вариант элитарной эстетики: чувство важнее разума, частная жизнь интереснее государственной истории, «переживание» важнее «воспитания». Д. Г. Левицкий, портреты <b>смолянок</b> — воспитанниц Смольного в живых позах.';
      var A = frame(-3.6, pi, '#5a3e2b'), B = frame(0, si, '#1f2a24'), C = frame(3.6, ni, '#6c8a6a'); c.F = [A, B, C];
      /* парадный: фигура в рост + колонна + мантия */
      var pf = person(c, 0, 0.25, '#c0392b', pi, A, 1.6, 1.05); wig(c, pf, 1.6);
      into(A, at(c.mesh(new T.ConeGeometry(0.7, 1.6, 14, 1, true), '#e8e0d0', pi, { side: T.DoubleSide }), 0.05, 1.85, 0.2));
      into(A, at(c.mesh(new T.CylinderGeometry(0.12, 0.12, 2.8, 10), '#b9a37a', pi), -0.85, 2.8, 0.25));
      into(A, at(c.mesh(new T.BoxGeometry(0.06, 0.6, 0.02), BLUE, pi), 0.05, 2.6, 0.55)).rotation.z = 0.6;
      /* психологический: только лицо в полутьме */
      c.face = into(B, at(c.mesh(new T.SphereGeometry(0.6, 20, 16), '#ead2b8', si, { emissive: '#3a2a20', emissiveIntensity: 0.2 }), 0, 3.1, 0.35));
      into(B, at(c.mesh(new T.SphereGeometry(0.66, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#3b2a22', si), 0, 3.2, 0.3));
      into(B, at(c.mesh(new T.ConeGeometry(0.9, 1.2, 16), '#b9a58a', si), 0, 2, 0.3));
      c.eyes = [-0.2, 0.2].map(function (dx) { return into(B, at(c.mesh(new T.SphereGeometry(0.08, 10, 8), '#33405a', si), dx, 3.18, 0.88)); });
      c.mist = into(B, at(c.mesh(new T.PlaneGeometry(2.2, 3), '#0f1220', si), 0, 2.8, 0.9)); c.mist.material.transparent = true; c.mist.material.opacity = 0.3;
      /* сентиментальный: смолянка танцует */
      c.dancer = person(c, 0, 0.3, '#c9a7c2', ni, C, 1.3, 1.1);
      into(c.dancer, at(c.mesh(new T.ConeGeometry(0.55, 0.9, 16), '#d9c2b0', ni), 0, 0.35, 0));
      into(C, at(c.mesh(new T.SphereGeometry(0.5, 10, 8), '#4f7a46', ni), -0.7, 1.6, 0.25));
      c.label('парадный', [-3.6, 5.1, 0], 0.45); c.label('психологический', [0, 5.1, 0], 0.45); c.label('сентиментализм', [3.6, 5.1, 0], 0.45);
      /* три цвета классицизма */
      var ti = '<b>Три цвета классицизма</b> соответствуют трём частям композиции: <b>коричневый</b> (передний план), <b>зелёный</b> (средний), <b>голубой</b> (дальний).';
      c.tri = [BROWN, OLIVE, SKY].map(function (col, i) { return c.box3(1.4, 0.3, 1, col, [-5 + i * 1.5, 0.15, 3], ti); });
      c.label('3 плана = 3 цвета', [-3.5, 1, 3], 0.38);
      c.onFrame(function (t) {
        c.mist.material.opacity = 0.25 + Math.sin(t * 0.8) * 0.15;
        c.eyes.forEach(function (e, i) { e.scale.y = Math.sin(t * 1.3) > 0.97 ? 0.2 : 1; });
        c.dancer.rotation.y = Math.sin(t * 1.2) * 0.6; c.dancer.position.x = Math.sin(t * 0.8) * 0.3;
      });
    },
    chips: [
      { t: 'Парадный', on: function (c) { c.setView(-0.3, 1.2, 8, 2.8, -3.6, 0); c.pick(c.F[0].children[0]); } },
      { t: 'Три цвета', on: function (c) { c.setView(-0.2, 0.8, 8, 0.5, -3.5, 3); c.pick(c.tri[1]); } },
      { t: 'Психологический', on: function (c) { c.setView(0, 1.3, 7, 3, 0, 0); c.pick(c.face); } },
      { t: 'Смолянки', on: function (c) { c.setView(0.3, 1.2, 8, 2.8, 3.6, 0); c.pick(c.F[2].children[0]); } }
    ]
  });

  /* ======================= 13. Государственная эстетика: оды ======================= */
  reg('ru14-sentiment3d', {
    title: 'Кто решает, что прекрасно?',
    lead: 'Весы эпохи. Чем ближе к концу века, тем сильнее перевешивает частное чувство. Нажимай периоды — чаша сдвигается.',
    radius: 15, phi: 1.1, theta: 0.3, targetY: 2.5, height: 420, hint: 'Нажимай периоды по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var bi = '<b>Весы эстетики.</b> Левая чаша — государство и разум, правая — частное чувство.';
      c.box3(0.3, 4, 0.3, GREY, [0, 2, 0], bi); c.box3(1.6, 0.3, 1.6, GREY, [0, 0.15, 0], bi);
      c.beam = new T.Group(); c.beam.position.y = 4; c.root.add(c.beam);
      c.beam.add(at(c.mesh(new T.BoxGeometry(7, 0.18, 0.25), GOLD, bi, { metalness: 0.5 }), 0, 0, 0));
      var si = '<b>Государство и разум.</b> Оды Тредиаковского (1728), Сумарокова (1743) и Ломоносова (1747) прославляют Россию и монарха; «Фелица» Державина (1782) — наставление императрице, «как пышно и правдиво жить».';
      var pi = '<b>Частное чувство.</b> Сентиментализм: чувство важнее разума, переживание важнее воспитания (Карамзин, «Бедная Лиза», 1792; портреты Левицкого и Боровиковского).';
      c.pans = [-3.2, 3.2].map(function (x, i) {
        var g = new T.Group(); c.root.add(g);
        g.add(at(c.mesh(new T.CylinderGeometry(1.1, 0.8, 0.25, 20), i ? '#f2a7b8' : BLUE, i ? pi : si), 0, 0, 0));
        g.add(at(c.mesh(new T.CylinderGeometry(0.02, 0.02, 1.4, 4), GREY, null), 0, 0.7, 0));
        return g;
      });
      c.crown = c.mesh(new T.CylinderGeometry(0.4, 0.5, 0.45, 8, 1, true), GOLD, si, { metalness: 0.7, side: T.DoubleSide }); c.pans[0].add(c.crown); c.crown.position.y = 0.4;
      var heart = new T.Shape(); heart.moveTo(0, -0.3); heart.bezierCurveTo(0.5, 0.1, 0.35, 0.5, 0, 0.25); heart.bezierCurveTo(-0.35, 0.5, -0.5, 0.1, 0, -0.3);
      c.heart = c.mesh(new T.ExtrudeGeometry(heart, { depth: 0.2, bevelEnabled: false }), RED, pi); c.heart.position.set(-0.1, 0.5, 0); c.heart.scale.set(1.5, 1.5, 1.5); c.pans[1].add(c.heart);
      c.label('государство', [-3.2, 6.3, 0], 0.45, '#9dbcff'); c.label('чувство', [3.2, 6.3, 0], 0.45, '#ffb4c4');
      c.tilt = 0.25; c.cur = 0.25; c.heartS = 0.4;
      c.onFrame(function (t) {
        c.cur += (c.tilt - c.cur) * 0.05; c.beam.rotation.z = c.cur;
        [-3.2, 3.2].forEach(function (x, i) { c.pans[i].position.set(x * Math.cos(c.cur), 4 + x * Math.sin(c.cur) - 1.4, 0); });
        var s = c.heartS * (1 + Math.sin(t * 4) * 0.05); c.heart.scale.set(s * 3, s * 3, 1);
        c.crown.rotation.y = t;
      });
    },
    chips: [
      { t: 'Пётр I', on: function (c) { c.tilt = 0.3; c.heartS = 0.3; c.say('Искусство служит делу: «Россия — Европа». Частной эстетики нет — есть служба.'); } },
      { t: 'Анна и Елизавета', on: function (c) { c.tilt = 0.25; c.heartS = 0.35; c.say('«Россия стала великой европейской державой — <b>теперь можно отдыхать и праздновать</b>». Оды: Тредиаковский, «Стихи похвальные России» (1728); Сумароков — ода Елизавете (1743): «Оставим брани и победы, кровавый меч приял покой».'); } },
      { t: 'Екатерина II', on: function (c) { c.tilt = 0.32; c.heartS = 0.3; c.pick(c.pans[0].children[0]); } },
      { t: 'Конец века', on: function (c) { c.tilt = -0.15; c.heartS = 0.55; c.pick(c.pans[1].children[0]); } }
    ]
  });

  /* ======================= 14. Московский университет: цепочка людей ======================= */
  reg('ru14-university3d', {
    title: 'Московский университет: от Шувалова до Пушкина',
    lead: 'Здание университета в центре, вокруг — люди и учреждения, которые выросли из него. Светящийся шарик бежит по цепочке «учитель → ученик».',
    radius: 20, phi: 1.0, theta: 0.4, targetY: 1.5, height: 450, hint: 'Нажимай шаги по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var ui = '<b>Московский университет</b> — 1755 г., указ Елизаветы в Татьянин день. Инициатор и первый куратор — <b>И. И. Шувалов</b>; проект — вместе с <b>Ломоносовым</b>.';
      var G = group(c); c.uni = G;
      into(G, c.box3(4, 2, 2, '#f0e2c0', [0, 1, 0], ui)); into(G, c.box3(1.6, 2.8, 2.2, '#f0e2c0', [0, 1.4, 0.1], ui));
      for (var k = 0; k < 4; k++) column(c, G, -0.55 + k * 0.37, 1.25, 2.3, WHITE, ui, 0.08);
      dome(c, G, 0, 2.8, 0.1, 0.8, '#6f8f8a', ui);
      into(G, c.label('Московский университет 1755', [0, 4.6, 0], 0.48, '#f0c36b'));
      var P = [
        ['shuv', -6, 2, '#8e2b2b', 'Шувалов', '<b>И. И. Шувалов</b> — фаворит Елизаветы. Написал проект и документы, добился указа; первый <b>куратор</b>: средства и главные вопросы. Текущей работой ведает <b>директор</b>.'],
        ['lom', -6, -2, '#3a3f55', 'Ломоносов', '<b>М. В. Ломоносов</b> — соавтор проекта университета. Сам когда-то учился в Германии и едва не попал там в армию к вербовщикам.'],
        ['her', 5, -3, '#5b8def', 'Херасков', '<b>М. М. Херасков</b> — пасынок князя Трубецкого, выпускник Шляхетского корпуса, потом <b>куратор</b> университета. Создал <b>Вольное российское собрание</b> (первое литературное общество), руководил типографией, основал <b>Благородный пансион</b>. Автор слов «Коль славен…».'],
        ['pans', 7, 0.5, GOLD, 'Благородный пансион', '<b>Благородный пансион</b> (1779): мальчики с ~9 лет готовятся к университету; выпускникам — преимущества при поступлении на службу. По образцу — пансионы при гимназиях (Казань).'],
        ['turg', 4, 3.6, PURPLE, 'И. П. Тургенев', '<b>И. П. Тургенев</b> — директор университета; при нём первое студенческое литературное общество, где был молодой <b>Жуковский</b>.'],
        ['zhuk', 0, 5.5, GREEN, 'Жуковский', '<b>В. А. Жуковский</b> — выпускник Благородного пансиона, поэт, позже наставник Пушкина.'],
        ['push', -4, 4.5, RED, 'Пушкин', '<b>А. С. Пушкин</b> — его «Послание Александру Тургеневу» замыкает цепочку: литература вырастает из круга Московского университета.'],
        ['mur', -7.5, 0, '#a07a55', 'Муравьёв', '<b>М. Н. Муравьёв</b> — поэт и товарищ министра народного просвещения, попечитель университета; покровитель <b>Карамзина</b>.']
      ];
      c.P = {}; c.pos = {};
      P.forEach(function (p) {
        var g = group(c); c.P[p[0]] = g; c.pos[p[0]] = [p[1], 0.8, p[2]];
        if (p[0] === 'pans') { into(g, c.box3(1.4, 1, 1.2, '#e6c79a', [p[1], 0.5, p[2]], p[5])); pediment(c, g, p[1], 1, p[2] + 0.6, 1.4, '#e6c79a', p[5]); }
        else { var pp = person(c, p[1], p[2], p[3], p[5], g, 1); wig(c, pp, 1); }
        into(g, c.label(p[4], [p[1], 2.2, p[2]], 0.4));
      });
      var chain = [['shuv', 'U'], ['lom', 'U'], ['U', 'her'], ['her', 'pans'], ['pans', 'turg'], ['turg', 'zhuk'], ['zhuk', 'push'], ['mur', 'U']];
      c.curves = [];
      chain.forEach(function (e) {
        var a = e[0] === 'U' ? [0, 1.5, 0] : c.pos[e[0]], b = e[1] === 'U' ? [0, 1.5, 0] : c.pos[e[1]];
        c.curves.push(arc(c, a, b, 1.5, '#9dbcff', 'Связь «учреждение — человек» или «учитель — ученик».').userData.curve);
      });
      c.dot = c.mesh(new T.SphereGeometry(0.2, 12, 8), GOLD, null, { emissive: '#ffb000', emissiveIntensity: 0.6 });
      c.onFrame(function (t) { var i = Math.floor(t * 0.5) % c.curves.length; c.dot.position.copy(c.curves[i].getPoint((t * 0.5) % 1)); });
    },
    chips: [
      { t: '1. Основание', on: function (c) { fade(c.P, ['shuv', 'lom']); c.setView(-0.6, 1.0, 13, 1.5, -3, 0); c.pick(c.uni.children[0]); } },
      { t: '2. Херасков', on: function (c) { fade(c.P, ['her']); c.setView(0.8, 1.0, 10, 1.5, 4, -2); c.pick(c.P.her.children[0].children[0]); } },
      { t: '3. Пансион', on: function (c) { fade(c.P, ['pans']); c.setView(1.2, 1.0, 9, 1, 6, 0.5); c.pick(c.P.pans.children[0]); } },
      { t: '4. До Пушкина', on: function (c) { fade(c.P, ['turg', 'zhuk', 'push']); c.setView(0.1, 1.0, 13, 1.5, 0, 4); c.say('Цепочка: <b>Тургенев</b> → студенческое общество с <b>Жуковским</b> → <b>Пушкин</b> (послание А. Тургеневу). Литература вырастает из одного «гнезда» — Московского университета.'); } },
      { t: 'Муравьёв', on: function (c) { fade(c.P, ['mur']); c.setView(-1.2, 1.0, 9, 1.5, -7, 0); c.pick(c.P.mur.children[0].children[0]); } },
      { t: 'Всё', on: function (c) { fade(c.P, keys(c.P)); c.setView(0.4, 1.0, 20, 1.5, 0, 0); c.say('Университет — не только учёба. Вокруг него возникают <b>вольные общества</b>, пансион, типография — первые ростки независимой от двора культурной жизни.'); } }
    ]
  });

  /* ======================= 15. Ордера колонн ======================= */
  reg('ru14-orders3d', {
    title: 'Три ордера: дорический, ионический, коринфский',
    lead: 'Классицизм обязательно использует ордер — систему «колонна + балка». Сравни капители: от строгой к пышной.',
    radius: 13, phi: 1.2, theta: 0, targetY: 2.4, height: 420, hint: 'Нажми на капитель.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      function base(x, info, h, r) { c.box3(1.3, 0.25, 1.3, STONE, [x, 0.125, 0], info); var col = c.mesh(new T.CylinderGeometry(r * 0.85, r, h, 20), WHITE, info); col.position.set(x, 0.25 + h / 2, 0); for (var f = 0; f < 12; f++) { var a = f / 12 * Math.PI * 2, fl = c.mesh(new T.BoxGeometry(0.04, h * 0.96, 0.04), '#e4dfd2', info); fl.position.set(x + Math.cos(a) * r * 0.93, 0.25 + h / 2, Math.sin(a) * r * 0.93); } return 0.25 + h; }
      var di = '<b>Дорический ордер</b> — самый простой и «мужественный»: капитель — плоская «подушка» и квадратная плита. Без базы (у греков).';
      var ii = '<b>Ионический ордер</b> — стройнее, капитель с двумя спиральными <b>волютами</b> (завитками).';
      var ki = '<b>Коринфский ордер</b> — самый пышный: капитель в виде корзины из листьев <b>аканта</b>.';
      var y = base(-3.2, di, 3.2, 0.42);
      c.dor = c.mesh(new T.CylinderGeometry(0.62, 0.42, 0.3, 20), WHITE, di); c.dor.position.set(-3.2, y + 0.15, 0); c.box3(1.3, 0.25, 1.3, WHITE, [-3.2, y + 0.42, 0], di);
      y = base(0, ii, 3.5, 0.36);
      c.ion = c.box3(1.1, 0.25, 0.8, WHITE, [0, y + 0.12, 0], ii);
      [-1, 1].forEach(function (s) { var v = c.mesh(new T.TorusGeometry(0.2, 0.08, 8, 20), WHITE, ii); v.position.set(s * 0.55, y + 0.05, 0.1); });
      c.box3(1.3, 0.15, 1, WHITE, [0, y + 0.32, 0], ii);
      y = base(3.2, ki, 3.7, 0.33);
      c.kor = c.mesh(new T.CylinderGeometry(0.55, 0.36, 0.7, 16), WHITE, ki); c.kor.position.set(3.2, y + 0.35, 0);
      for (var l = 0; l < 10; l++) { var a = l / 10 * Math.PI * 2, leaf = c.mesh(new T.ConeGeometry(0.1, 0.45, 5), '#e9efe0', ki); leaf.position.set(3.2 + Math.cos(a) * 0.45, y + 0.3 + (l % 2) * 0.25, Math.sin(a) * 0.45); leaf.rotation.z = -Math.cos(a) * 0.4; leaf.rotation.x = Math.sin(a) * 0.4; }
      c.box3(1.3, 0.18, 1.3, WHITE, [3.2, y + 0.8, 0], ki);
      c.label('дорический', [-3.2, 0.9, 1.2], 0.4); c.label('ионический', [0, 0.9, 1.2], 0.4); c.label('коринфский', [3.2, 0.9, 1.2], 0.4);
    },
    chips: [
      { t: 'Дорический', on: function (c) { c.setView(-0.3, 1.2, 6, 3.4, -3.2, 0); c.pick(c.dor); } },
      { t: 'Ионический', on: function (c) { c.setView(0, 1.2, 6, 3.8, 0, 0); c.pick(c.ion); } },
      { t: 'Коринфский', on: function (c) { c.setView(0.3, 1.2, 6, 4.2, 3.2, 0); c.pick(c.kor); } },
      { t: 'Правило', on: function (c) { c.setView(0, 1.2, 13, 2.4, 0, 0); c.say('В классицизме ордер — <b>обязателен</b>: центральная часть здания выделяется колоннадой и фронтоном. Ордера не смешивают как попало — каждому своё место (дорический ниже, коринфский выше). Это та же идея правил и иерархии, что и в литературе.'); } }
    ]
  });

  /* ======================= 16. Высокие и низкие жанры ======================= */
  reg('ru14-genres3d', {
    title: 'Лестница жанров классицизма',
    lead: 'Наверху — высокие жанры (о героях, торжественным языком), внизу — низкие (о быте, простым языком). Перемешивать нельзя. А если всё-таки смешать — получится ирои-комическая поэма.',
    radius: 15, phi: 1.1, theta: 0.6, targetY: 2.5, height: 440, hint: 'Нажми на ступень.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var S = [
        ['Ода', GOLD, '<b>Ода</b> — высокий жанр: прославляет монарха, победу, науку. Ломоносов, Державин («Фелица»).'],
        ['Трагедия', GOLD, '<b>Трагедия</b> — высокий жанр: герой выбирает между долгом и чувством, побеждает долг. Сумароков.'],
        ['Поэма', '#d9d4c7', '<b>Поэма</b> — может быть «средней»: «Душенька» Богдановича — лёгкий пересказ мифа об Амуре и Психее. По ней учили русский язык.'],
        ['Комедия', '#8b93b5', '<b>Комедия</b> — низкий жанр: высмеивает пороки, герои — обычные люди. Фонвизин, «Недоросль».'],
        ['Басня, сатира', '#8b93b5', '<b>Басня и сатира</b> — низкие жанры, простой язык, мораль. Позже — Крылов.']
      ];
      c.steps = [];
      S.forEach(function (s, i) { var h = (5 - i) * 0.9; var m = c.box3(3.2, h, 1.6, s[1], [0, h / 2, (i - 2) * 1.6], s[2]); c.steps.push(m); c.label(s[0], [0, h + 0.5, (i - 2) * 1.6], 0.42); });
      c.label('высокие', [-3, 5, -3.2], 0.45, '#f0c36b'); c.label('низкие', [-3, 1.3, 3.2], 0.45, '#b9c0d8');
      var hi = '<b>Ирои-комическая поэма</b>: высоким, героическим слогом рассказано о низком — получается смешно. Так нарушают правило, чтобы рассмешить (В. Майков, «Елисей, или Раздражённый Вакх»).';
      c.mix = c.mesh(new T.OctahedronGeometry(0.45), PURPLE, hi, { emissive: '#7b5cff', emissiveIntensity: 0.3 }); c.mix.position.set(3, 2.5, 0);
      c.label('ирои-комическое', [3, 3.5, 0], 0.4, '#c9b8ff');
      c.onFrame(function (t) { c.mix.rotation.y = t; c.mix.position.y = 2.5 + Math.sin(t * 2) * 1.6; });
    },
    chips: [
      { t: 'Высокие', on: function (c) { c.setView(0.6, 1.0, 10, 3.5, 0, -2.4); c.pick(c.steps[0]); } },
      { t: '«Душенька»', on: function (c) { c.setView(0.8, 1.0, 9, 2, 0, 0); c.pick(c.steps[2]); } },
      { t: 'Низкие', on: function (c) { c.setView(0.6, 1.0, 10, 1, 0, 2.4); c.pick(c.steps[3]); } },
      { t: 'Смешать', on: function (c) { c.setView(1.2, 1.0, 10, 2.5, 2, 0); c.pick(c.mix); } }
    ]
  });

  /* ======================= Мини-тест ======================= */
  HubWidgets.register('ru14-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Культура России в XVIII веке</b></div><p class="wg-lead">15 вопросов по лекции 16.10.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Какой образец культуры Пётр I заменил на «римский»?', ['Византийский', 'Голландский', 'Французский'], 0, '«Москва — Третий Рим» наследовала Византии («Второму Риму»). Пётр ориентируется на Рим имперский.'],
      ['Кого Пётр оставлял наместником во время отлучек?', ['Боярскую думу', 'Князя-кесаря Ромодановского', 'Сенат'], 1, 'Аналог «младшего цезаря» в Риме.'],
      ['С чем связано название «гвардия»?', ['С преторианцами Рима', 'С рыцарскими орденами', 'Со стрельцами'], 0, 'Преторианцы — личная охрана консулов, потом императоров.'],
      ['Что изначально означает слово «император»?', ['Помазанник Божий', 'Обладатель власти над завоёванной территорией', 'Глава Сената'], 1, 'Imperium — власть над землёй, взятой военной силой.'],
      ['Андреевский флаг похож на флаг…', ['Голландии', 'Шотландии', 'Швеции'], 1, 'Косой крест святого Андрея, но цвета поменяны.'],
      ['Каким было петровское образование?', ['Общим гуманитарным', 'Профессиональным', 'Только церковным'], 1, 'Школы под конкретную службу: навигация, артиллерия, медицина.'],
      ['Где предписано «пить, курить, танцевать, играть в карты»?', ['На ассамблеях', 'В Сенате', 'В цифирных школах'], 0, 'Ассамблеи — социализация элиты помимо службы.'],
      ['Главный посыл культуры II четверти XVIII в.?', ['Россия — Европа', 'Россия стала великой державой — можно праздновать', 'Чувство важнее разума'], 1, 'Оды Тредиаковского и Сумарокова.'],
      ['Барокко считает, что гармония — это…', ['Статичное равновесие', 'Постоянное движение, переход', 'Симметрия трёх частей'], 1, 'Задача искусства — зафиксировать переход.'],
      ['Цель искусства в классицизме?', ['Развлечение', 'Наставление', 'Выражение личного чувства'], 1, 'Государство выбирает, что прекрасно, и объясняет почему.'],
      ['Высшее достижение живописи II половины XVIII в. (по слайдам)?', ['Икона', 'Психологический портрет', 'Пейзаж'], 1, 'Рокотов, «Портрет Струйской».'],
      ['Кто был инициатором и первым куратором Московского университета?', ['Ломоносов', 'И. И. Шувалов', 'Бецкой'], 1, 'Фаворит Елизаветы; проект — вместе с Ломоносовым, 1755 г.'],
      ['Что основал Херасков при Московском университете?', ['Смольный институт', 'Благородный пансион', 'Академию художеств'], 1, 'А ещё — Вольное российское собрание, первое литературное общество.'],
      ['Самая сентиментальная повесть на русском языке?', ['«Душенька»', '«Бедная Лиза»', '«Фелица»'], 1, 'Н. М. Карамзин, 1792.'],
      ['Первый негосударственный вариант элитарной эстетики?', ['Классицизм', 'Сентиментализм', 'Голландское барокко'], 1, 'Частная жизнь интереснее истории государства.']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 160px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 11 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
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
