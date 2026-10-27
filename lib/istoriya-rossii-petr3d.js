/* 3D-модели и мини-тест к конспекту «Россия в I четверти XVIII века: петровская модернизация» (История России, лекция 11, 07.10).
   В Markdown: @@graph:ru11-ways3d@@ @@graph:ru11-race3d@@ @@graph:ru11-england3d@@ @@graph:ru11-transition3d@@
   @@graph:ru11-xvii3d@@ @@graph:ru11-paths3d@@ @@graph:ru11-expansion3d@@ @@graph:ru11-regular3d@@ @@graph:ru11-ranks3d@@
   @@graph:ru11-split3d@@ @@graph:ru11-swap3d@@ @@graph:ru11-spb3d@@ @@graph:ru11-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa', WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', WATER = '#3d7fc4';
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
  function wig(c, p, s) { var T = c.THREE, w = c.mesh(new T.SphereGeometry(0.26 * (s || 1), 12, 8), '#f4f1ea'); w.position.y = 1.18 * (s || 1); w.scale.set(1.05, 0.8, 1.1); p.add(w); return w; }
  function house(c, x, z, col, info, g, s, roof) {
    var T = c.THREE; s = s || 1;
    var h = new T.Group(); (g || c.root).add(h); h.position.set(x, 0, z);
    var b = c.mesh(new T.BoxGeometry(1 * s, 0.8 * s, 1 * s), col, info); b.position.y = 0.4 * s; h.add(b);
    var r = c.mesh(new T.ConeGeometry(0.8 * s, 0.6 * s, 4), roof || '#7a4b32', info); r.position.y = 1.1 * s; r.rotation.y = Math.PI / 4; h.add(r);
    return h;
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
  function sheep(c, x, z, g) {
    var T = c.THREE, info = '<b>Овцы на огороженных полях.</b> Земля стала пастбищем: шерсть выгоднее хлеба. «Овцы съели людей» — крестьян-арендаторов сгоняли с земли.';
    var s = new T.Group(); (g || c.root).add(s); s.position.set(x, 0, z);
    var b = c.mesh(new T.SphereGeometry(0.32, 12, 10), '#f3f1ea', info); b.scale.set(1.3, 0.9, 0.9); b.position.y = 0.42; s.add(b);
    var h = c.mesh(new T.SphereGeometry(0.15, 10, 8), '#2b2b33', info); h.position.set(0.42, 0.5, 0); s.add(h);
    [[-0.2, -0.12], [-0.2, 0.12], [0.2, -0.12], [0.2, 0.12]].forEach(function (q) { var l = c.mesh(new T.CylinderGeometry(0.04, 0.04, 0.25, 6), '#2b2b33', info); l.position.set(q[0], 0.12, q[1]); s.add(l); });
    return s;
  }
  function fadeAll(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
  }
  function keysOf(G) { return Object.keys(G); }

  /* ======================= 1. Четыре способа существования ======================= */
  reg('ru11-ways3d', {
    title: 'Четыре способа жить во времени', lead: 'Круг из четырёх секторов. Зелёный поднят выше всех — инновация. Синий — пандус, по которому догоняют. Серый — под колпаком. Тёмный — провал назад.',
    radius: 15, phi: 0.95, theta: 0.6, targetY: 1, height: 400, hint: 'Нажми на сектор или на кнопку.',
    build: function (c) {
      var T = c.THREE, G = { inn: group(c), mod: group(c), cons: group(c), arch: group(c) };
      c.ground(7.5);
      var D = [
        ['inn', GREEN, 1.6, 0, '<b>Инновация</b> — опережающее развитие. Общество <b>само создаёт новое</b>: Греция, Италия XIV–XV вв., Голландия XVII в., США XIX в.'],
        ['mod', BLUE, 0.9, Math.PI / 2, '<b>Модернизация</b> — догоняющее развитие. Общество <b>перенимает</b> то, что придумали другие: Рим, Япония XX в., Южная Корея, Сингапур, Китай.'],
        ['arch', DARK, 0.15, Math.PI, '<b>Архаизация</b> — <b>возвращение к ранним формам</b> общественной жизни. Откат назад.'],
        ['cons', GREY, 0.5, Math.PI * 1.5, '<b>Консервация</b> — <b>отказ от развития</b>. Всё сохраняют как есть, ничего не меняют.']
      ];
      D.forEach(function (d) {
        var m = into(G[d[0]], c.mesh(new T.CylinderGeometry(5, 5, d[2], 40, 1, false, d[3], Math.PI / 2 - 0.04), d[1], d[4]));
        m.position.y = d[2] / 2;
      });
      /* инновация: ракета вверх */
      var iI = D[0][4];
      var rocket = new T.Group(); G.inn.add(rocket);
      var rb = c.mesh(new T.CylinderGeometry(0.3, 0.3, 1.4, 14), '#f4f1ea', iI); rocket.add(rb);
      var rn = c.mesh(new T.ConeGeometry(0.3, 0.6, 14), RED, iI); rn.position.y = 1; rocket.add(rn);
      var fl = c.mesh(new T.ConeGeometry(0.22, 0.6, 10), GOLD, iI, { emissive: '#ff8a00', emissiveIntensity: 0.6 }); fl.rotation.x = Math.PI; fl.position.y = -1; rocket.add(fl);
      rocket.position.set(2.2, 2.6, 2.2);
      into(G.inn, c.label('Инновация\nопережающее', [2.6, 5.4, 2.6], 0.6, '#7fe0a8'));
      /* модернизация: пандус и бегущий человек */
      var iM = D[1][4];
      var ramp = into(G.mod, c.mesh(new T.BoxGeometry(3.4, 0.2, 1.2), '#a9c2f5', iM)); ramp.position.set(2.4, 1.35, -2.4); ramp.rotation.set(0, Math.PI / 4, 0.3);
      var runner = person(c, 1.5, -1.5, GOLD, iM, G.mod, 0.8, 0.9);
      into(G.mod, c.label('Модернизация\nдогоняющее', [2.8, 4.4, -2.8], 0.6, '#9dbcff'));
      /* консервация: шкатулка под колпаком */
      var iC = D[3][4];
      into(G.cons, c.box3(1, 0.7, 1, WOOD, [-2.3, 0.85, 2.3], iC));
      var dome = into(G.cons, c.mesh(new T.SphereGeometry(1.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#cfe6ff', iC, { transparent: true, opacity: 0.35 })); dome.position.set(-2.3, 0.5, 2.3);
      into(G.cons, c.label('Консервация\nотказ', [-2.8, 3.2, 2.8], 0.6, '#c4c9de'));
      /* архаизация: избушка проваливается */
      var iA = D[2][4];
      var hut = house(c, -2.3, -2.3, '#6b5a4a', iA, G.arch, 1.1);
      into(G.arch, c.label('Архаизация\nоткат', [-2.8, 3, -2.8], 0.6, '#b6a68f'));
      /* круговые стрелки в центре */
      var ring = c.mesh(new T.TorusGeometry(1.1, 0.12, 10, 40, Math.PI * 1.6), GOLD, 'Общество может переходить из одного состояния в другое: модернизация может перерасти в инновацию, а может откатиться в архаику.');
      ring.rotation.x = Math.PI / 2; ring.position.y = 2.2;
      c.groups = G;
      c.onFrame(function (t) {
        rocket.position.y = 2.8 + Math.sin(t * 1.5) * 0.4; fl.scale.y = 1 + Math.sin(t * 12) * 0.25;
        var k = (t * 0.25) % 1; runner.position.set(1.2 + k * 2.4, 1 + k * 1.1, -1.2 - k * 2.4);
        hut.position.y = -0.2 - (Math.sin(t * 0.8) * 0.5 + 0.5) * 0.5;
        ring.rotation.z = t * 0.8;
      });
    },
    chips: [
      { t: 'Все четыре', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.6, 0.95, 15, 1); c.say('Два способа — <b>развитие</b> (инновация и модернизация), два — <b>его отсутствие</b> (консервация и архаизация).'); } },
      { t: 'Инновация', on: function (c) { fadeAll(c.groups, ['inn']); c.setView(0.8, 0.9, 11, 2, 1.5, 1.5); c.say('<b>Инновация</b>: общество само включает «резервные» знания и уходит вперёд. <b>Опережающее</b> развитие.'); } },
      { t: 'Модернизация', on: function (c) { fadeAll(c.groups, ['mod']); c.setView(2.3, 0.9, 11, 1.5, 1.5, -1.5); c.say('<b>Модернизация</b>: другие обогнали, и общество <b>берёт чужие</b> технологии, чтобы догнать. Петровская Россия — здесь.'); } },
      { t: 'Консервация', on: function (c) { fadeAll(c.groups, ['cons']); c.setView(-0.8, 0.9, 11, 1, -1.5, 1.5); c.say('<b>Консервация</b>: всё «под колпаком», перемен нет.'); } },
      { t: 'Архаизация', on: function (c) { fadeAll(c.groups, ['arch']); c.setView(-2.3, 0.9, 11, 1, -1.5, -1.5); c.say('<b>Архаизация</b>: возврат к ранним формам жизни. У Петра её элементы были прямо внутри модернизации — крепостное право.'); } }
    ]
  });

  /* ======================= 2. Лестница модернизации ======================= */
  reg('ru11-race3d', {
    title: 'Лестница модернизации', lead: 'Зелёная лестница — страна-лидер, она строит ступени сама. Синяя — догоняющая страна: идёт по шести шагам модернизации. Жми на шаги по порядку.',
    radius: 17, phi: 1.05, theta: 0.9, targetY: 2.5, height: 420, hint: 'Начни с «1. Вызов».',
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var STEPS = [
        ['Вызов', 'Другие <b>обогнали</b>. Угроза потерять богатство и политические преимущества — это «цивилизационный вызов».'],
        ['Раскол элиты', 'Элита делится: сторонники <b>прогресса</b> против сторонников <b>консервации и архаики</b>.'],
        ['Заимствование', 'Сторонники прогресса с помощью власти или денег <b>перенимают чужие технологии</b> и инструменты.'],
        ['Ментальный сдвиг', '<b>Ментальный сдвиг</b>: значительная часть людей решает, что «как раньше жить не нужно».'],
        ['Догнали', 'Общество <b>догоняет</b> тех, у кого училось.'],
        ['Свои инновации', 'Теперь можно <b>создавать своё</b>: модернизация перерастает в инновационное развитие.']
      ];
      c.steps = [];
      STEPS.forEach(function (s, i) {
        var m = c.box3(1.6, 0.6 * (i + 1), 1.8, i === 5 ? GREEN : BLUE, [-4 + i * 1.6, 0.3 * (i + 1), 1.6], '<b>Шаг ' + (i + 1) + '. ' + s[0] + '.</b> ' + s[1]);
        c.steps.push(m);
        c.label(String(i + 1), [-4 + i * 1.6, 0.6 * (i + 1) + 0.6, 2.6], 0.5, '#cfe0ff');
      });
      /* лидер: зелёная лестница сзади и выше */
      var lead = '<b>Страна-лидер</b> (инновационное развитие): «резервные» знания включаются, она сама строит новые ступени и уходит вперёд. Пример — Англия, Голландия XVII в.';
      for (var i = 0; i < 7; i++) c.box3(1.6, 0.6 * (i + 3), 1.4, '#3f9e6f', [-4 + i * 1.6, 0.3 * (i + 3), -1.6], lead);
      c.label('лидер', [6.4, 6.4, -1.6], 0.55, '#7fe0a8');
      var leader = person(c, 5.6, -1.6, GREEN, lead, null, 1, 0.6 * 9);
      var newStep = c.box3(1.6, 0.4, 1.4, '#7fe0a8', [7.2, 5.6, -1.6], lead);
      c.walker = person(c, -4, 1.6, GOLD, '<b>Догоняющая страна</b> — например, Россия при Петре.', null, 1, 0.6);
      c.goalStep = 0;
      var wy = 0.6, wx = -4;
      c.onFrame(function (t) {
        var gx = -4 + c.goalStep * 1.6, gy = 0.6 * (c.goalStep + 1);
        wx += (gx - wx) * 0.05; wy += (gy - wy) * 0.05;
        c.walker.position.set(wx, wy + Math.abs(Math.sin(t * 6)) * 0.08 * Math.min(1, Math.abs(gx - wx)), 1.6);
        newStep.scale.y = 0.5 + 0.5 * Math.sin(t * 2); newStep.position.y = 5.4 + newStep.scale.y * 0.2;
        leader.rotation.y = Math.sin(t) * 0.4;
      });
    },
    chips: [0, 1, 2, 3, 4, 5].map(function (i) {
      var n = ['Вызов', 'Раскол элиты', 'Заимствование', 'Ментальный сдвиг', 'Догнали', 'Свои инновации'][i];
      return { t: (i + 1) + '. ' + n, on: function (c) { c.goalStep = i; c.pick(c.steps[i]); c.setView(0.9 - i * 0.12, 1.0, 14, 1.5 + i * 0.5, -3 + i * 1.6, 0); } };
    }).concat([{ t: 'Лидер', on: function (c) { c.setView(-0.3, 1.0, 16, 4, 3, -1.6); c.say('<b>Лидер</b> не ждёт: пока догоняющая страна идёт по шагам, он строит новые ступени. Поэтому догнать — мало, нужно дойти до <b>своих инноваций</b>.'); } }])
  });

  /* ======================= 3. Англия: четыре ступени ======================= */
  reg('ru11-england3d', {
    title: 'Англия: от овец к мануфактурам', lead: 'Четыре платформы — четыре ступени английской модернизации. На первой пасутся овцы и лежит знаменитый мешок с шерстью.',
    radius: 19, phi: 1.0, theta: 0.35, targetY: 1.5, height: 420, hint: 'Нажимай ступени по порядку.',
    build: function (c) {
      var T = c.THREE, G = { soc: group(c), pol: group(c), ment: group(c), tech: group(c) };
      c.ground(10);
      var X = [-6, -2, 2, 6];
      var cols = ['#7fbf6a', '#c26a5a', '#a78bfa', '#c9a15a'];
      var H = [0.4, 0.9, 1.4, 1.9];
      var info = [
        '<b>1. Социальная модернизация.</b> Огораживание земель, арендаторов заменяют <b>наёмными работниками</b>. «Овцы съели людей».',
        '<b>2. Политическая модернизация.</b> Революция <b>1640</b> г. и <b>«Славная революция» 1688</b> г.: конец абсолютной монархии.',
        '<b>3. Ментальный сдвиг.</b> Религиозность сменяется <b>политическим мышлением</b> («английское Просвещение»). Первый прорыв к инновациям.',
        '<b>4. Технологическая революция.</b> Ткацкие мануфактуры, Англия вытесняет Голландию, Испанию и Португалию с морей. Потом металлургия. Второй прорыв.'
      ];
      var K = ['soc', 'pol', 'ment', 'tech'];
      K.forEach(function (k, i) { into(G[k], c.box3(3.4, H[i], 3.4, cols[i], [X[i], H[i] / 2, 0], info[i])); into(G[k], c.label(['Земля', 'Власть', 'Сознание', 'Техника'][i], [X[i], H[i] + 2.6, 0], 0.55)); });
      /* 1: забор, овцы, мешок */
      for (var f = 0; f < 8; f++) { var a = f / 8 * Math.PI * 2; into(G.soc, c.box3(0.1, 0.5, 0.1, WOOD, [X[0] + Math.cos(a) * 1.5, H[0] + 0.25, Math.sin(a) * 1.5], info[0])); }
      var fence = into(G.soc, c.mesh(new T.TorusGeometry(1.5, 0.04, 6, 40), WOOD, info[0])); fence.rotation.x = Math.PI / 2; fence.position.set(X[0], H[0] + 0.4, 0);
      var flock = [];
      for (var s = 0; s < 4; s++) { var sh = sheep(c, X[0] + (s % 2 - 0.5) * 1.1, (Math.floor(s / 2) - 0.5) * 1.1, G.soc); sh.position.y = H[0]; flock.push(sh); }
      var woolInfo = '<b>Мешок с шерстью</b> (Woolsack). Лектор: «даже спикер английского парламента сидит на мешке с шерстью». Это сиденье председателя Палаты лордов с XIV века — символ того, что богатство Англии — шерсть.';
      var wool = into(G.soc, c.mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(0.45, 0.9, 6, 12) : new T.CylinderGeometry(0.45, 0.45, 1.4, 12), '#b5262d', woolInfo)); wool.rotation.z = Math.PI / 2; wool.position.set(X[0], 0.45, 2.6);
      into(G.soc, c.label('мешок с шерстью', [X[0], 1.4, 2.9], 0.38, '#ffb3b3'));
      /* 2: парламент и падающая корона */
      into(G.pol, c.box3(2.4, 1.0, 1.2, STONE, [X[1], H[1] + 0.5, -0.4], info[1]));
      into(G.pol, c.box3(0.5, 2.2, 0.5, STONE, [X[1] + 0.9, H[1] + 1.1, -0.4], info[1]));
      into(G.pol, c.box3(1.6, 0.06, 1.0, '#2f6b3a', [X[1], H[1] + 0.03, 0.8], info[1]));
      var crown = new T.Group(); G.pol.add(crown);
      var cr = c.mesh(new T.CylinderGeometry(0.4, 0.35, 0.35, 12, 1, true), GOLD, '<b>Абсолютная монархия ликвидирована</b>: власть короля ограничена парламентом.', { side: T.DoubleSide, metalness: 0.7, roughness: 0.3 }); crown.add(cr);
      for (var p = 0; p < 6; p++) { var sp = c.mesh(new T.ConeGeometry(0.07, 0.25, 6), GOLD, null, { metalness: 0.7 }); var b = p / 6 * Math.PI * 2; sp.position.set(Math.cos(b) * 0.37, 0.28, Math.sin(b) * 0.37); crown.add(sp); }
      /* 3: книга и лампа */
      into(G.ment, c.box3(1.4, 0.2, 1.0, '#f3efe6', [X[2], H[2] + 0.1, 0], info[2]));
      into(G.ment, c.box3(1.5, 0.12, 1.1, '#5a3d8a', [X[2], H[2] + 0.02, 0], info[2]));
      var bulb = into(G.ment, c.mesh(new T.SphereGeometry(0.4, 16, 12), '#fff2b0', info[2], { emissive: '#ffd34d', emissiveIntensity: 0.8 })); bulb.position.set(X[2], H[2] + 1.6, 0);
      var church = into(G.ment, c.mesh(new T.ConeGeometry(0.3, 1.2, 8), GREY, 'Раньше мир объясняли через <b>религию</b>. Теперь — через политику, право, разум.')); church.position.set(X[2] - 1.1, H[2] + 0.6, -1);
      /* 4: фабрика, дым, корабль */
      into(G.tech, c.box3(2.2, 1.0, 1.4, '#8a5a3c', [X[3], H[3] + 0.5, -0.5], info[3]));
      var chim = into(G.tech, c.box3(0.35, 1.8, 0.35, '#5b3a26', [X[3] + 0.7, H[3] + 0.9, -0.7], info[3]));
      var smoke = [];
      for (var q = 0; q < 4; q++) { var sm = into(G.tech, c.mesh(new T.SphereGeometry(0.25, 10, 8), '#c9ccd6', info[3], { transparent: true, opacity: 0.6 })); smoke.push(sm); }
      var ship = new T.Group(); G.tech.add(ship);
      var hull = c.mesh(new T.BoxGeometry(1.4, 0.35, 0.5), WOOD, '<b>Морская торговля</b>: Англия вытесняет Голландию, Испанию и Португалию.'); ship.add(hull);
      var mast = c.mesh(new T.CylinderGeometry(0.04, 0.04, 1.2, 6), '#5b3a26'); mast.position.y = 0.7; ship.add(mast);
      var sail = c.mesh(new T.PlaneGeometry(0.8, 0.7), '#f4f1ea', null, { side: T.DoubleSide }); sail.position.y = 0.8; sail.rotation.y = Math.PI / 2; ship.add(sail);
      for (var i = 0; i < 3; i++) arrow(c, [X[i] + 1.8, H[i] + 0.6, 1.9], [X[i + 1] - 1.8, H[i + 1] + 0.6, 1.9], GOLD, null, null, 0.06);
      c.groups = G;
      c.onFrame(function (t) {
        flock.forEach(function (s, i) { s.position.x = X[0] + Math.sin(t * 0.5 + i * 1.7) * 0.8; s.position.z = Math.cos(t * 0.4 + i * 2.1) * 0.8; s.rotation.y = -t * 0.5 - i; });
        var k = (t * 0.3) % 1; crown.position.set(X[1] - 0.3, H[1] + 3.2 - k * 2.6, 0.6); crown.rotation.z = k * 1.2; crown.visible = k < 0.95;
        bulb.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 3);
        smoke.forEach(function (sm, i) { var u = (t * 0.4 + i / 4) % 1; sm.position.set(X[3] + 0.7 + u * 0.6, H[3] + 2 + u * 1.8, -0.7); sm.scale.setScalar(0.6 + u); sm.material.opacity = 0.6 * (1 - u); });
        ship.position.set(X[3] + Math.sin(t * 0.5) * 1.2, H[3] + 0.2, 1.2); ship.rotation.y = Math.cos(t * 0.5) > 0 ? 0 : Math.PI;
      });
    },
    chips: [
      { t: '1. Земля', small: 'огораживания', on: function (c) { fadeAll(c.groups, ['soc']); c.setView(0.3, 0.95, 10, 1, -6, 0.5); c.say('<b>Огораживания.</b> Протестанты «стали иначе вести себя в экономике»: поля огородили и пустили <b>овец</b>. Англия XVI века — бедная страна, к концу XVII — богатая.'); } },
      { t: '2. Власть', small: '1640 и 1688', on: function (c) { fadeAll(c.groups, ['pol']); c.setView(0.3, 0.95, 10, 1.5, -2, 0); c.say('<b>Политическая модернизация</b>: революция 1640 г. и Славная революция 1688 г. Корона больше не правит одна.'); } },
      { t: '3. Сознание', small: 'ментальный сдвиг', on: function (c) { fadeAll(c.groups, ['ment']); c.setView(0.3, 0.95, 10, 2, 2, 0); c.say('<b>Ментальный сдвиг</b>: на место религиозного объяснения мира приходит <b>политическое мышление</b>. Первый прорыв к инновациям.'); } },
      { t: '4. Техника', small: 'мануфактуры', on: function (c) { fadeAll(c.groups, ['tech']); c.setView(0.3, 0.95, 10, 2.5, 6, 0); c.say('<b>Технологическая революция</b>: ткацкие, затем металлургические мануфактуры, господство на морях. Второй прорыв.'); } },
      { t: 'Весь путь', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0.35, 1.0, 19, 1.5, 0, 0); c.say('Порядок: <b>земля → власть → сознание → техника</b>. Машины пришли последними — сначала поменялись правила жизни.'); } }
    ]
  });

  /* ======================= 4. Способы институционального перехода ======================= */
  reg('ru11-transition3d', {
    title: 'Способы институционального перехода', lead: 'Четыре плитки: переход «сверху» или «снизу», сам или под давлением извне. Стрелки показывают, откуда идёт перемена.',
    radius: 16, phi: 0.85, theta: 0.0, targetY: 0.5, height: 420, hint: 'Нажми на плитку или кнопку.',
    build: function (c) {
      var T = c.THREE, G = { su: group(c), eu: group(c), sd: group(c), ed: group(c) };
      var D = [
        ['su', -2.6, -2.6, '#4f7be0', '«Сверху», самостоятельно', 'Просвещённый\nабсолютизм', '<b>«Сверху», самостоятельно</b>: государство само проводит перемены. Пример — <b>просвещённый абсолютизм</b> европейских государств XVIII в. Сюда же — Пётр.', true],
        ['eu', 2.6, -2.6, '#e0645a', '«Сверху», извне', 'Колонии', '<b>«Сверху», под воздействием извне</b>: модель <b>навязана победителем</b> (агрессором). Пример — действия европейских государств в их колониях.', true],
        ['sd', -2.6, 2.6, '#4cc38a', '«Снизу», самостоятельно', 'Англия XVII в.', '<b>«Снизу», самостоятельно</b>: общество меняется само. Пример — <b>Англия XVII в.</b>', false],
        ['ed', 2.6, 2.6, '#f0c36b', '«Снизу», извне', 'Голландия XVII в.', '<b>«Снизу», под воздействием извне</b>: модель складывается <b>в сопротивлении агрессору</b>. Пример — <b>Голландия XVII в.</b> в борьбе с Испанией.', false]
      ];
      D.forEach(function (d) {
        var g = G[d[0]];
        into(g, c.box3(4.6, 0.3, 4.6, d[3], [d[1], 0.15, d[2]], d[6]));
        into(g, c.label(d[4], [d[1], 4.4, d[2]], 0.42));
        into(g, c.label(d[5], [d[1], 0.8, d[2] + 1.6], 0.42, '#ffe7a8'));
        for (var i = 0; i < 6; i++) person(c, d[1] - 1.2 + (i % 3) * 1.2, d[2] - 0.6 + Math.floor(i / 3) * 1.0, '#d9d4c7', d[6], g, 0.7, 0.3);
        if (d[7]) { /* сверху: стрелка вниз */ arrow(c, [d[1], 4, d[2] - 0.6], [d[1], 1.7, d[2] - 0.6], d[0] === 'su' ? '#9dbcff' : '#ffb3a8', d[6], g, 0.1); }
        else { arrow(c, [d[1], 0.5, d[2] - 0.6], [d[1], 3.3, d[2] - 0.6], d[0] === 'sd' ? '#7fe0a8' : '#ffe7a8', d[6], g, 0.1); }
        if (d[0] === 'eu' || d[0] === 'ed') { var ag = c.mesh(new T.ConeGeometry(0.5, 1.0, 4), '#7a2a2a', '<b>Внешняя сила</b>: победитель-агрессор.'); ag.position.set(d[1] + 1.9, 0.8, d[2] - 1.9); g.add(ag); }
      });
      c.label('Сам', [-2.6, 0.5, -5.6], 0.55, '#c4c9de'); c.label('Извне', [2.6, 0.5, -5.6], 0.55, '#c4c9de');
      var ring = c.mesh(new T.TorusGeometry(0.6, 0.1, 8, 30), GREY, 'Способы могут сменять друг друга.'); ring.rotation.x = Math.PI / 2; ring.position.y = 0.5;
      c.groups = G;
      c.onFrame(function (t) { ring.rotation.z = t; });
    },
    chips: [
      { t: 'Все', on: function (c) { fadeAll(c.groups, keysOf(c.groups)); c.setView(0, 0.85, 16, 0.5, 0, 0); c.say('Две оси: <b>кто начинает</b> (государство сверху или общество снизу) и <b>откуда импульс</b> (изнутри или от внешней силы).'); } },
      { t: 'Сверху, сам', on: function (c) { fadeAll(c.groups, ['su']); c.setView(-0.4, 0.8, 10, 1, -2.6, -2.6); c.say('Пётр — это <b>«сверху», самостоятельно</b>: государство само насаждает новые институты. Так же — просвещённый абсолютизм XVIII в.'); } },
      { t: 'Сверху, извне', on: function (c) { fadeAll(c.groups, ['eu']); c.setView(0.4, 0.8, 10, 1, 2.6, -2.6); c.say('Модель <b>навязана победителем</b> — колонии европейских стран.'); } },
      { t: 'Снизу, сам', on: function (c) { fadeAll(c.groups, ['sd']); c.setView(-0.4, 0.8, 10, 1, -2.6, 2.6); c.say('<b>Англия XVII в.</b>: перемены рождаются в самом обществе.'); } },
      { t: 'Снизу, извне', on: function (c) { fadeAll(c.groups, ['ed']); c.setView(0.4, 0.8, 10, 1, 2.6, 2.6); c.say('<b>Голландия XVII в.</b>: новая модель складывается в борьбе с агрессором (Испанией).'); } }
    ]
  });

  /* ======================= 5. XVII век: дорога и «консервант» ======================= */
  reg('ru11-xvii3d', {
    title: 'XVII век: дорога к переменам', lead: 'Телега едет по дороге XVII века мимо вех. Сзади к ней привязана гиря «крепостное право» — она тормозит всё движение.',
    radius: 19, phi: 1.0, theta: 0.25, targetY: 1, targetX: 0, height: 420, hint: 'Нажми на веху или кнопку.',
    build: function (c) {
      var T = c.THREE, X = function (y) { return (y - 1650) * 0.15; };
      c.ground(10);
      c.box3(16, 0.08, 1.4, '#b49a72', [0, 0.04, 0], 'Дорога XVII века: от первых попыток к слою реформаторов.');
      var EV = [
        [1600, 'Годунов', 'Начало века: <b>Борис Годунов</b> (царь 1598–1605) понимает выгоду европейских новшеств: зовёт иностранцев, посылает юношей учиться за границу [ДОБАВЛЕНО].', 'early'],
        [1606, 'Лжедмитрий I', '<b>Лжедмитрий I</b> (1605–1606) — тоже пытается вводить европейские порядки при дворе.', 'early'],
        [1632, 'Полки нового строя', '<b>Полки нового строя</b> (солдатские, рейтарские) — армия по европейскому образцу с иностранными офицерами.', 'mid'],
        [1649, 'Уложение', '<b>Соборное уложение 1649</b> [ДОБАВЛЕНО]: законодательное закрепление <b>крепостного права</b>.', 'mid'],
        [1654, 'Раскол', '<b>Церковный раскол</b>: государственное православие против старообрядчества.', 'mid'],
        [1682, 'Местничество', '<b>1682 — отмена местничества</b>: должности больше не делят по знатности предков. Разрядные книги сожгли [ДОБАВЛЕНО].', 'late'],
        [1687, 'Академия', '<b>Славяно-греко-латинская академия</b> (1687) — первое высшее учебное заведение в Москве.', 'late'],
        [1689, 'В. Голицын', '<b>Василий Голицын</b> — фаворит Софьи, автор первых планов модернизации.', 'late'],
        [1694, 'Немецкая слобода', '<b>Пётр в Немецкой слободе</b>: здесь он видит альтернативные формы управления, армии и быта.', 'late']
      ];
      c.posts = {};
      EV.forEach(function (e, i) {
        var col = e[3] === 'early' ? BLUE : e[3] === 'mid' ? PURPLE : GREEN, z = i % 2 ? -1.6 : 1.6;
        var post = c.box3(0.25, 1.8 + (i % 3) * 0.4, 0.25, col, [X(e[0]), 0.9 + (i % 3) * 0.2, z], e[2]);
        c.box3(1.1, 0.5, 0.12, col, [X(e[0]), 1.9 + (i % 3) * 0.4, z], e[2]);
        c.label(e[0] + '\n' + e[1], [X(e[0]), 2.9 + (i % 3) * 0.4, z], 0.38);
        (c.posts[e[3]] = c.posts[e[3]] || []).push(post);
      });
      /* телега и гиря */
      var cart = new T.Group(); c.root.add(cart);
      var ci = '<b>Россия XVII века</b> едет к сближению с Европой.';
      var body = c.mesh(new T.BoxGeometry(1.2, 0.5, 0.8), WOOD, ci); body.position.y = 0.6; cart.add(body);
      var wheels = [];
      [[-0.45, 0.45], [0.45, 0.45], [-0.45, -0.45], [0.45, -0.45]].forEach(function (w) { var wh = c.mesh(new T.TorusGeometry(0.25, 0.06, 6, 16), '#3b2a1e', ci); wh.position.set(w[0], 0.3, w[1]); cart.add(wh); wheels.push(wh); });
      var wi = '<b>Крепостное право — «консервант»</b> натурального хозяйства и главное препятствие для перехода «снизу». Ещё два тормоза: <b>православное сознание</b>, враждебное переменам, и <b>низкая грамотность</b> даже в элите.';
      var weight = c.mesh(new T.SphereGeometry(0.55, 16, 12), '#2b2d38', wi, { metalness: 0.6, roughness: 0.4 });
      var lbl = c.label('крепостное\nправо', [0, 2.2, 0], 0.4, '#ff9f9f');
      var chain = c.mesh(new T.CylinderGeometry(0.03, 0.03, 1, 6), '#777', wi);
      c.cart = cart;
      c.onFrame(function (t) {
        var k = (t * 0.045) % 1, slow = k < 0.6 ? k : 0.6 + (k - 0.6) * 0.35;
        var x = -8 + slow / 0.74 * 16;
        cart.position.set(x, 0, 0);
        wheels.forEach(function (w) { w.rotation.z = -x * 4; });
        weight.position.set(x - 2.0, 0.55, 0); lbl.position.set(x - 2.0, 1.8, 0);
        chain.position.set(x - 1.3, 0.55, 0); chain.rotation.z = Math.PI / 2; chain.scale.y = 1.4;
      });
    },
    chips: [
      { t: 'Начало века', on: function (c) { c.setView(0.2, 0.95, 10, 1.5, -6.5, 0); c.say('<b>Начало века</b>: осмысление преимуществ европейских новшеств, первые попытки — <b>Годунов</b> и <b>Лжедмитрий I</b>.'); } },
      { t: 'II–III четверти', on: function (c) { c.setView(0.2, 0.95, 10, 1.5, 0, 0); c.say('<b>Точечные заимствования</b> в экономике, армии, быту элиты. Начинается <b>раскол элиты</b> на сторонников и противников прогресса.'); } },
      { t: 'Конец века', on: function (c) { c.setView(0.2, 0.95, 10, 1.5, 5.5, 0); c.say('<b>Слой реформаторов</b>: отмена местничества, академия, планы Голицына, Пётр в Немецкой слободе.'); } },
      { t: 'Тормоза', on: function (c) { c.setView(1.3, 1.0, 12, 1, 0, 0); c.say('Три препятствия: <b>крепостное право</b> («консервант»), <b>православное сознание</b> (враждебно к переменам от «иноверцев»), <b>неграмотность</b>.'); } }
    ]
  });

  /* ======================= 6. Два пути на вершину ======================= */
  reg('ru11-paths3d', {
    title: 'Два пути модернизации', lead: 'Гора «Модернизация». Слева — пологий серпантин эволюционных реформ: шар катится и съезжает обратно. Справа — крутой подъём «революции сверху»: шар толкает государственный молот.',
    radius: 18, phi: 1.05, theta: 0, targetY: 2.5, height: 420, hint: 'Сравни два пути.',
    build: function (c) {
      var T = c.THREE, G = { evo: group(c), rev: group(c) };
      c.ground(9);
      var mi = '<b>Вершина</b> — успешная модернизация: новые институты прижились.';
      var mt = c.mesh(new T.ConeGeometry(4, 6, 24), '#7b8a6a', mi); mt.position.y = 3;
      var cap = c.mesh(new T.ConeGeometry(1.2, 1.8, 24), '#f4f1ea', mi); cap.position.y = 5.1;
      c.label('успех', [0, 6.8, 0], 0.5, '#7fe0a8');
      /* эволюционный серпантин */
      var ei = '<b>Вариант 1 — эволюционный</b>: выборочные реформы, медленное «вживление» новых институтов. Так пытались Иран, Турция, Китай в XVIII–XIX вв. Итог везде <b>отрицательный</b>: архаика победила.';
      var pts = [];
      for (var i = 0; i <= 60; i++) { var u = i / 60, a = -Math.PI * 0.9 + u * Math.PI * 2.6, r = 4.1 - u * 2.6; pts.push(new T.Vector3(Math.sin(a) * r, 0.2 + u * 4.2, Math.cos(a) * r)); }
      var curve = new T.CatmullRomCurve3(pts);
      into(G.evo, c.mesh(new T.TubeGeometry(curve, 120, 0.12, 8, false), '#9dbcff', ei));
      var ballE = into(G.evo, c.mesh(new T.SphereGeometry(0.35, 16, 12), BLUE, ei));
      into(G.evo, c.label('Иран · Турция · Китай\nXVIII–XIX вв.', [-5.5, 2.4, 2], 0.42, '#9dbcff'));
      /* революция сверху: прямой крутой путь */
      var ri = '<b>Вариант 2 — «революция сверху»</b>: насаждение новых институтов государственным насилием. Так Пётр. В XX в.: Турция (половинчато), Тайвань, Южная Корея, Сингапур, Гонконг (успешно).';
      into(G.rev, c.link([3.9, 0.2, 1.55], [0.65, 5.2, 0.26], '#ffb3a8', 0.13, ri));
      var ballR = into(G.rev, c.mesh(new T.SphereGeometry(0.35, 16, 12), RED, ri));
      var hammer = new T.Group(); G.rev.add(hammer);
      var hh = c.mesh(new T.BoxGeometry(0.9, 0.45, 0.45), '#4a4f63', ri, { metalness: 0.6 }); hammer.add(hh);
      var hs = c.mesh(new T.CylinderGeometry(0.07, 0.07, 1.4, 8), WOOD, ri); hs.position.y = -0.7; hammer.add(hs);
      into(G.rev, c.label('Пётр I · Тайвань · Корея\nСингапур · Гонконг', [6.5, 2.4, 2.5], 0.42, '#ffb3a8'));
      c.groups = G;
      c.onFrame(function (t) {
        var k = (t * 0.12) % 1, u = k < 0.7 ? k / 0.7 * 0.75 : 0.75 * (1 - (k - 0.7) / 0.3);
        var p = curve.getPoint(u); ballE.position.set(p.x, p.y + 0.3, p.z);
        var q = Math.min(1, ((t * 0.12) % 1) * 1.3), s = new T.Vector3(3.9, 0.2, 1.55).lerp(new T.Vector3(0.65, 5.2, 0.26), q);
        ballR.position.set(s.x, s.y + 0.35, s.z);
        hammer.position.set(s.x + 0.9, s.y + 1.0, s.z + 0.3); hammer.rotation.z = 0.6 + Math.max(0, Math.sin(t * 6)) * 0.8;
      });
    },
    chips: [
      { t: 'Эволюция', small: 'вариант 1', on: function (c) { fadeAll(c.groups, ['evo']); c.setView(-0.7, 1.0, 14, 2.5); c.say('Медленные выборочные реформы. Шар каждый раз <b>скатывается обратно</b>: архаика сильнее.'); } },
      { t: 'Революция сверху', small: 'вариант 2', on: function (c) { fadeAll(c.groups, ['rev']); c.setView(0.9, 1.0, 14, 2.5); c.say('Крутой путь с <b>государственным насилием</b>. Именно его выбрал <b>Пётр</b>.'); } },
      { t: 'Сравнить', on: function (c) { fadeAll(c.groups, ['evo', 'rev']); c.setView(0, 1.05, 18, 2.5); c.say('Лекция: эволюционный путь в XVIII–XIX вв. <b>везде провалился</b>, «революция сверху» в XX в. дала успех в Азии.'); } }
    ]
  });

  /* ======================= 7. От экспансии к модернизации: карта ======================= */
  reg('ru11-expansion3d', {
    title: 'Сначала модернизация — потом экспансия', lead: 'Упрощённая карта: Москва в центре, Чёрное море на юге, Балтика на северо-западе, Европа на западе. Пройди события по порядку.',
    radius: 20, phi: 0.75, theta: 0, targetY: 0, height: 440, hint: 'Нажимай кнопки по порядку.',
    build: function (c) {
      var T = c.THREE, G = { crimea: group(c), azov: group(c), emb: group(c), narva: group(c), mod: group(c), win: group(c) };
      c.box3(22, 0.2, 16, '#6f8a5a', [0, -0.1, 0], 'Земли Русского государства и соседей (схема, без масштаба).');
      var sea = function (x, z, sx, sz, name, info) { var m = c.mesh(new T.CylinderGeometry(1, 1, 0.12, 32), WATER, info); m.scale.set(sx, 1, sz); m.position.set(x, 0.05, z); c.label(name, [x, 0.8, z], 0.45, '#cfe6ff'); return m; };
      sea(1, 6.2, 4.5, 1.6, 'Чёрное море', '<b>Чёрное море</b>: выход закрыт Крымским ханством и Османской империей.');
      sea(-1.8, 3.4, 0.9, 0.6, 'Азовское', '<b>Азовское море</b> и крепость Азов.');
      sea(-6.5, -4.5, 2.2, 2.6, 'Балтика', '<b>Балтийское море</b>: побережье у Швеции.');
      var city = function (x, z, name, col, info) { var m = c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.5, 16), col || GOLD, info); m.position.set(x, 0.25, z); c.label(name, [x, 1.1, z], 0.42); return m; };
      city(0, -1, 'Москва', GOLD, '<b>Москва</b>. Пётр победил Софью (1689), но элита ещё мыслит <b>логикой экспансии</b>.');
      city(-3, 4.5, 'Азов', '#c9c9c9', '<b>Азов</b>: 1695 — неудача, 1696 — взят [ДОБАВЛЕНО].');
      city(1, 4.3, 'Крым', '#c9c9c9', '<b>Крымское ханство</b> — вассал Османской империи.');
      city(-7.5, -2, 'Нарва', '#c9c9c9', '<b>Нарва</b>: 1700 — тяжёлое поражение от шведов [ДОБАВЛЕНО].');
      city(-9.5, 1.5, 'Европа', BLUE, '<b>Европа</b>: Голландия, Англия, Вена — цели Великого посольства.');
      /* походы */
      arrow(c, [0, 0.6, -0.5], [0.8, 0.6, 3.7], RED, '<b>Крымские походы</b> В. Голицына (1687, 1689) — неудача [ДОБАВЛЕНО].', G.crimea, 0.12);
      var x1 = into(G.crimea, c.label('✕', [0.8, 1.6, 3.4], 0.9, '#ff6b6b'));
      arrow(c, [-0.3, 0.6, -0.3], [-2.8, 0.6, 4.0], '#ff9f6b', '<b>Азовские походы</b> Петра (1695–1696).', G.azov, 0.12);
      arrow(c, [-0.4, 0.6, -1.2], [-9.1, 0.6, 1.3], BLUE, '<b>Великое посольство</b> (1697–1698): Пётр сам учится в Голландии и Англии, нанимает мастеров.', G.emb, 0.1);
      arrow(c, [-0.5, 0.6, -1.4], [-7.1, 0.6, -2.1], RED, '<b>Начало войны со Швецией</b>, Нарва (1700).', G.narva, 0.12);
      into(G.narva, c.label('✕ Нарва', [-7.5, 2.2, -2], 0.7, '#ff6b6b'));
      /* модернизация: заводы и корабли вокруг Москвы */
      var mi = '<b>Поворот: «сначала модернизация — потом экспансия».</b> Новая армия, флот, мануфактуры, рекрутские наборы, государство-механизм.';
      var factories = [];
      [[1.6, -2.2], [2.4, -0.4], [-1.6, -2.4], [1.2, 1.2]].forEach(function (p) { var f = into(G.mod, c.box3(0.8, 0.6, 0.6, '#8a5a3c', [p[0], 0.3, p[1]], mi)); var ch = into(G.mod, c.box3(0.18, 0.9, 0.18, '#5b3a26', [p[0] + 0.25, 0.75, p[1]], mi)); factories.push(ch); });
      for (var i = 0; i < 8; i++) person(c, -1 + (i % 4) * 0.5, -2.8 - Math.floor(i / 4) * 0.5, '#2f6b3a', mi, G.mod, 0.5);
      into(G.mod, c.label('мануфактуры\nрегулярная армия', [2.8, 2.2, -2.4], 0.42, '#ffe7a8'));
      /* победа */
      arrow(c, [-0.6, 0.6, -1.6], [-6.4, 0.6, -3.8], GREEN, '<b>Выход к Балтике</b>: основан Петербург (1703), Полтава (1709), Ништадтский мир (1721) [ДОБАВЛЕНО].', G.win, 0.14);
      into(G.win, c.label('Петербург\n1703', [-5.6, 2.0, -3.6], 0.5, '#7fe0a8'));
      c.groups = G;
      c.onFrame(function (t) { factories.forEach(function (f, i) { f.scale.y = 1 + 0.15 * Math.sin(t * 3 + i); }); x1.material.opacity = 0.6 + 0.4 * Math.sin(t * 4); });
    },
    chips: [
      { t: '1. Крым', small: '1687, 1689', on: function (c) { fadeAll(c.groups, ['crimea']); c.setView(0.2, 0.8, 14, 0, 0.5, 2); c.say('Софья и Голицын тоже сторонники модернизации, но действуют в <b>логике экспансии</b>: походы на Крым — неудачи.'); } },
      { t: '2. Азов', small: '1695–96', on: function (c) { fadeAll(c.groups, ['crimea', 'azov']); c.setView(-0.2, 0.8, 14, 0, -1.5, 2); c.say('Победа Петра над Софьей <b>не сразу</b> привела к модернизации: снова поход на юг — к Азову.'); } },
      { t: '3. Посольство', small: '1697–98', on: function (c) { fadeAll(c.groups, ['emb']); c.setView(-0.6, 0.8, 16, 0, -4.5, 0); c.say('<b>Великое посольство</b>: искали союзников против турок, а нашли идеи и мастеров.'); } },
      { t: '4. Нарва', small: '1700', on: function (c) { fadeAll(c.groups, ['narva']); c.setView(-0.8, 0.8, 13, 0, -4, -1.5); c.say('<b>Поражения на Чёрном и Балтийском морях стали триггером</b> поворота.'); } },
      { t: '5. Поворот', on: function (c) { fadeAll(c.groups, ['mod']); c.setView(0.4, 0.75, 11, 0, 0.5, -1); c.say('Логика меняется: <b>«сначала модернизация — потом экспансия»</b>.'); } },
      { t: '6. Балтика', on: function (c) { fadeAll(c.groups, ['mod', 'win']); c.setView(-0.6, 0.75, 16, 0, -3, -2); c.say('Перестроенная страна выигрывает Северную войну и выходит к морю.'); } }
    ]
  });

  /* ======================= 8. Регулярное государство: часовой механизм ======================= */
  reg('ru11-regular3d', {
    title: 'Регулярное государство', lead: 'Государство-механизм: наверху император, под ним Сенат, вокруг крутятся шестерёнки коллегий, внизу — губернии. Синод — отдельная шестерня того же механизма.',
    radius: 17, phi: 0.95, theta: 0.3, targetY: 2.5, height: 440, hint: 'Нажми на деталь механизма.',
    build: function (c) {
      var T = c.THREE, G = { imp: group(c), sen: group(c), col: group(c), gub: group(c), syn: group(c), old: group(c) };
      c.ground(8.5);
      function gear(r, teeth, col, info, g) {
        var gr = new T.Group(); g.add(gr);
        gr.add(c.mesh(new T.CylinderGeometry(r, r, 0.3, 24), col, info, { metalness: 0.5, roughness: 0.35 }));
        for (var i = 0; i < teeth; i++) { var a = i / teeth * Math.PI * 2, tt = c.mesh(new T.BoxGeometry(0.22, 0.3, 0.3), col, info, { metalness: 0.5 }); tt.position.set(Math.cos(a) * (r + 0.1), 0, Math.sin(a) * (r + 0.1)); tt.rotation.y = -a; gr.add(tt); }
        return gr;
      }
      var ii = '<b>Император</b> (титул с 1721 [ДОБАВЛЕНО]). Институция «царь» превращена в институцию «император» — основа <b>императорской власти</b>.';
      into(G.imp, c.box3(1.2, 0.8, 1.2, '#7a2230', [0, 5.4, 0], ii));
      var crown = into(G.imp, c.mesh(new T.CylinderGeometry(0.5, 0.42, 0.45, 12, 1, true), GOLD, ii, { side: T.DoubleSide, metalness: 0.8, roughness: 0.25 })); crown.position.set(0, 6.05, 0);
      into(G.imp, c.label('Император', [0, 7.0, 0], 0.5, '#ffe7a8'));
      var si = '<b>Сенат</b> (1711 [ДОБАВЛЕНО]) — заменил Боярскую думу. Орган, ориентированный на <b>реализацию воли монарха</b>, а не на компромисс знати.';
      var senate = gear(1.4, 14, '#c94c4c', si, G.sen); senate.position.set(0, 4.2, 0);
      into(G.sen, c.label('Сенат', [2.2, 4.4, 0], 0.45));
      var ci = '<b>Коллегии</b> (1717–1721 [ДОБАВЛЕНО]) — заменили приказы. Каждая ведает своей отраслью по <b>регламенту</b>, решения принимаются коллегиально. В идеале — «рациональная бюрократия».';
      var cols = [];
      var names = ['Военная', 'Адмиралтейская', 'Иностранных дел', 'Камер', 'Юстиц', 'Берг', 'Мануфактур', 'Коммерц', 'Штатс-контор'];
      names.forEach(function (n, i) { var a = i / names.length * Math.PI * 2, gg = gear(0.6, 8, '#5b8def', '<b>' + n + '-коллегия</b>. ' + ci, G.col); gg.position.set(Math.cos(a) * 3.3, 2.7, Math.sin(a) * 3.3); cols.push(gg); });
      into(G.col, c.label('коллегии', [0, 3.6, 3.6], 0.45, '#9dbcff'));
      var gi = '<b>Губернии</b> (1708, 8 губерний [ДОБАВЛЕНО]) и <b>провинции</b> (1719): страна разделена на единообразные части, как полки в армии.';
      var gubs = [];
      for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2 + 0.2; gubs.push(into(G.gub, c.box3(1.0, 0.6, 1.0, '#4cc38a', [Math.cos(a) * 6, 0.3, Math.sin(a) * 6], gi))); }
      into(G.gub, c.label('губернии', [0, 1.4, 6.8], 0.45, '#7fe0a8'));
      var syi = '<b>Синод</b> (1721 [ДОБАВЛЕНО]) — заменил патриаршество. Бюрократический орган, вписанный в императорскую власть: церковь подчинена государству.';
      var syn = gear(0.8, 10, PURPLE, syi, G.syn); syn.position.set(-3.8, 4.6, -2.6);
      var cross = into(G.syn, c.box3(0.12, 0.8, 0.12, GOLD, [-3.8, 5.4, -2.6], syi)); into(G.syn, c.box3(0.5, 0.12, 0.12, GOLD, [-3.8, 5.55, -2.6], syi));
      into(G.syn, c.label('Синод', [-4.8, 5.8, -2.6], 0.45, '#d4c2ff'));
      /* старое: дума и приказы (призраки) */
      var oi = 'Было до Петра: <b>Боярская дума</b> (компромисс знати) и <b>приказы</b> («выполнение поручений»), без единой системы.';
      var oldD = into(G.old, c.box3(2.4, 0.8, 1.4, WOOD, [5.5, 0.4, -4.5], oi)); into(G.old, c.label('Дума и приказы\n(было)', [5.5, 1.8, -4.5], 0.4, '#d9b38c'));
      for (var o = 0; o < 5; o++) into(G.old, c.box3(0.6, 0.4 + Math.random() * 0.5, 0.6, '#a07850', [4 + o * 0.7, 0.3, -3.2 + (o % 2) * 0.4], oi));
      /* вал */
      c.link([0, 0, 0], [0, 5.0, 0], '#9aa2c0', 0.12, 'Вал механизма: всё вращается от воли императора.');
      c.groups = G;
      c.onFrame(function (t) {
        senate.rotation.y = t * 0.6; syn.rotation.y = -t * 0.9;
        cols.forEach(function (g, i) { g.rotation.y = (i % 2 ? 1 : -1) * t * 1.3; });
        gubs.forEach(function (g, i) { g.position.y = 0.3 + Math.abs(Math.sin(t * 2 + i)) * 0.15; });
      });
    },
    chips: [
      { t: 'Вся машина', on: function (c) { fadeAll(c.groups, ['imp', 'sen', 'col', 'gub', 'syn']); c.setView(0.3, 0.95, 17, 2.5); c.say('<b>Регулярное государство</b>: каждая деталь на своём месте и работает по уставу. За Петра — <b>3314</b> указов, регламентов, уставов.'); } },
      { t: 'Император', on: function (c) { fadeAll(c.groups, ['imp']); c.setView(0.3, 0.8, 9, 5.5); c.say('Царь → <b>император</b>. Вся машина крутится от его воли.'); } },
      { t: 'Сенат', on: function (c) { fadeAll(c.groups, ['sen', 'imp']); c.setView(0.5, 0.85, 9, 4.3); c.say('<b>Сенат</b> вместо Думы: не место для споров знати, а исполнитель воли монарха.'); } },
      { t: 'Коллегии', on: function (c) { fadeAll(c.groups, ['col']); c.setView(0.3, 0.7, 12, 2.7); c.say('<b>Коллегии</b> вместо приказов: отрасли, регламенты, коллегиальность — шаг к рациональной бюрократии.'); } },
      { t: 'Губернии', on: function (c) { fadeAll(c.groups, ['gub']); c.setView(0.3, 0.6, 16, 0.5); c.say('<b>Губернии и провинции</b>: страна поделена по единому образцу.'); } },
      { t: 'Синод', on: function (c) { fadeAll(c.groups, ['syn']); c.setView(-0.9, 0.85, 9, 4.8, -3.8, -2.6); c.say('<b>Синод</b> вместо патриарха: церковь — шестерня государства.'); } },
      { t: 'Что было', on: function (c) { fadeAll(c.groups, ['old']); c.setView(1.8, 0.9, 10, 0.5, 5, -4); c.say('До Петра: Дума и множество приказов — без единой системы.'); } }
    ]
  });

  /* ======================= 9. Табель о рангах ======================= */
  reg('ru11-ranks3d', {
    title: 'Табель о рангах: лестница из 14 ступеней', lead: 'Три параллельные лестницы — военная, статская (гражданская) и придворная служба. Человек поднимается по ступеням за службу, а не за знатность. Золотая ступень — где служба даёт потомственное дворянство.',
    radius: 13, phi: 1.1, theta: 0.7, targetY: 3, height: 440, hint: 'Нажми на ступень или кнопку.',
    build: function (c) {
      var T = c.THREE, G = { mil: group(c), civ: group(c), court: group(c) };
      c.ground(9);
      var L = [['mil', -3, '#c94c4c', 'Военная', 'армия и флот'], ['civ', 0, BLUE, 'Статская', 'гражданская служба'], ['court', 3, PURPLE, 'Придворная', 'двор']];
      var RN = { mil: { 14: 'фендрик/прапорщик', 1: 'генерал-фельдмаршал' }, civ: { 14: 'коллежский регистратор', 8: 'коллежский асессор', 1: 'канцлер' }, court: { 1: 'обер-камергер' } };
      L.forEach(function (l) {
        for (var cl = 14; cl >= 1; cl--) {
          var lvl = 14 - cl, noble = (l[0] === 'mil' && cl === 14) || (l[0] === 'civ' && cl === 8);
          var nm = RN[l[0]][cl] ? ' (' + RN[l[0]][cl] + ')' : '';
          var info = '<b>' + l[3] + ' служба, ' + cl + '-й класс</b>' + nm + '.' + (noble ? ' <b>Здесь служба даёт потомственное дворянство</b> [ДОБАВЛЕНО].' : '') + ' Табель о рангах — 1722 [ДОБАВЛЕНО].';
          into(G[l[0]], c.box3(2.4, 0.38, 0.9, noble ? GOLD : l[2], [l[1], 0.19 + lvl * 0.42, -lvl * 0.45 + 3], info));
        }
        into(G[l[0]], c.label(l[3] + '\n' + l[4], [l[1], 7.6, -3.4], 0.42));
      });
      c.label('14 класс', [5.2, 0.4, 3], 0.4, '#c4c9de'); c.label('1 класс', [5.2, 5.9, -2.9], 0.4, '#c4c9de');
      c.climber = person(c, -3, 3, GOLD, 'Человек незнатного рода может подняться по лестнице — это <b>«социальный лифт»</b>.', null, 0.9, 0.4);
      c.line = 'mil'; c.groups = G;
      var X = { mil: -3, civ: 0, court: 3 };
      c.onFrame(function (t) {
        var k = (t * 0.07) % 1, lvl = Math.floor(k * 14);
        c.climber.position.set(X[c.line], 0.4 + lvl * 0.42, 3 - lvl * 0.45);
      });
    },
    chips: [
      { t: 'Военная', on: function (c) { c.line = 'mil'; fadeAll(c.groups, ['mil']); c.setView(0.4, 1.05, 13, 3, -3, 0); c.say('<b>Военная</b> лестница: уже первый офицерский чин (14 класс) делал человека <b>потомственным дворянином</b>.'); } },
      { t: 'Статская', on: function (c) { c.line = 'civ'; fadeAll(c.groups, ['civ']); c.setView(0.4, 1.05, 13, 3, 0, 0); c.say('<b>Статская</b> (гражданская) служба: потомственное дворянство — с <b>8 класса</b>. Чиновник — новая фигура петровского государства.'); } },
      { t: 'Придворная', on: function (c) { c.line = 'court'; fadeAll(c.groups, ['court']); c.setView(0.4, 1.05, 13, 3, 3, 0); c.say('<b>Придворная</b> служба при дворе императора.'); } },
      { t: 'Смысл', on: function (c) { fadeAll(c.groups, ['mil', 'civ', 'court']); c.setView(0.7, 1.1, 18, 3); c.say('Главная идея: место определяет <b>служба и выслуга</b>, а не род (как при местничестве). Корпус чиновников из дворян.'); } }
    ]
  });

  /* ======================= 10. Культурный раскол ======================= */
  reg('ru11-split3d', {
    title: 'Две России: культурный раскол', lead: 'Маленький высокий остров — европеизированная элита в париках. Большая равнина внизу — около 90% населения, крестьяне, у которых ничего не поменялось. Между ними трещина.',
    radius: 18, phi: 1.0, theta: 0.5, targetY: 1.5, height: 420, hint: 'Нажми на остров, равнину или трещину.',
    build: function (c) {
      var T = c.THREE, G = { elite: group(c), folk: group(c), state: group(c) };
      var ei = '<b>Элита</b> (дворяне, чиновники, офицеры): европейское платье, парики, науки, ассамблеи. Здесь шла вся модернизация. Это «<b>Россия-2</b>».';
      var fi = '<b>Около 90% населения</b> — крестьяне. Петр <b>сознательно отказался</b> от культурных преобразований для них. Им достались только повинности: подушная подать, рекрутчина, стройки.';
      into(G.elite, c.mesh(new T.CylinderGeometry(2.2, 2.6, 2.4, 24), '#9aa7c9', ei)).position.set(-4, 1.2, -1);
      for (var i = 0; i < 5; i++) { var p = person(c, -4.8 + (i % 3) * 0.8, -1.5 + Math.floor(i / 3) * 0.9, ['#2f4fa8', '#7a2230', '#2f6b3a'][i % 3], ei, G.elite, 0.7, 2.4); wig(c, p, 0.7); }
      var pal = into(G.elite, c.box3(1.6, 0.8, 0.8, '#e8d9b5', [-3.6, 2.8, -1.9], ei)); into(G.elite, c.mesh(new T.ConeGeometry(0.15, 0.9, 8), GOLD, ei)).position.set(-3.6, 3.6, -1.9);
      into(G.elite, c.label('элита ≈ 10%', [-4, 5.0, -1], 0.5, '#cfe0ff'));
      into(G.folk, c.box3(9, 0.3, 9, '#8a7a55', [3.5, 0.15, 1], fi));
      var huts = [];
      for (var j = 0; j < 10; j++) huts.push(house(c, 0.2 + (j % 5) * 1.6, -2 + Math.floor(j / 5) * 2.4, '#7a6048', fi, G.folk, 0.7, '#a08a5a'));
      for (var k = 0; k < 14; k++) person(c, 0.6 + (k % 7) * 1.0, 2.6 + Math.floor(k / 7) * 1.1, '#9b8460', fi, G.folk, 0.6, 0.3);
      into(G.folk, c.label('народ ≈ 90%', [3.5, 2.8, 3.2], 0.5, '#ffe7a8'));
      var ci = '<b>Культурный раскол</b> между элитой и остальной страной: разная одежда, язык, образ жизни. Понятия «свобода» и «петровская модернизация» несовместимы.';
      var crack = c.mesh(new T.BoxGeometry(0.4, 0.5, 9), '#1b1d26', ci); crack.position.set(-1.2, 0.1, 1); crack.rotation.y = 0.15;
      var dome = into(G.state, c.mesh(new T.SphereGeometry(8.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), '#d6a43a', '<b>Огосударствление</b> всех проявлений общественной жизни: государство накрывает всё — службу, церковь, хозяйство, быт.', { transparent: true, opacity: 0.12, side: T.DoubleSide, depthWrite: false }));
      dome.position.set(0, 0, 0.5); dome.visible = false;
      c.dome = dome;
      c.onFrame(function (t) { crack.scale.x = 1 + 0.3 * Math.sin(t * 2); });
    },
    chips: [
      { t: 'Элита', on: function (c) { c.dome.visible = false; c.setView(0.3, 0.9, 9, 2.5, -4, -1); c.say('<b>Модернизация шла только здесь</b>: управленческая элита, дворянство, чиновники, предприниматели — поставщики государства.'); } },
      { t: 'Народ', on: function (c) { c.dome.visible = false; c.setView(0.8, 0.8, 12, 0.5, 3.5, 1); c.say('<b>90% населения</b>: крепостное право сохранено и унифицировано, повинности закреплены за каждым слоем.'); } },
      { t: 'Раскол', on: function (c) { c.dome.visible = false; c.setView(0.1, 0.9, 13, 1, -1.2, 1); c.say('Итог: <b>культурный раскол</b> — элита и народ живут как будто в двух разных странах.'); } },
      { t: 'Огосударствление', on: function (c) { c.dome.visible = true; c.setView(0.5, 1.1, 22, 2); c.say('Ещё один итог: <b>огосударствление</b> — всё общественное подчинено государству.'); } }
    ]
  });

  /* ======================= 11. Уничтожено → создано ======================= */
  reg('ru11-swap3d', {
    title: 'Что уничтожили и что создали', lead: 'Семь пьедесталов. Коричневые блоки — старые институты, синие — петровские. Нажми «Реформа»: старое уходит под землю, новое поднимается.',
    radius: 12, phi: 1.15, theta: 0.0, targetY: 1.2, height: 420, hint: 'Нажми «Реформа» или на пару.',
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var P = [
        ['Боярская\nдума', 'Сенат', 'Было: <b>Боярская дума</b> — орган компромиссов между высшими сословиями.', 'Стало: <b>Сенат</b> — орган исполнения воли монарха.'],
        ['Приказы', 'Коллегии', 'Было: <b>приказы</b> — работали по принципу «выполнения поручений».', 'Стало: <b>коллегии</b> — (в идеале) рациональная бюрократия по регламентам.'],
        ['Патриарх', 'Синод', 'Было: <b>патриаршество</b> — «симфония» царя и патриарха по византийскому образцу.', 'Стало: <b>Синод</b> — бюрократический орган внутри императорской власти.'],
        ['Царь', 'Император', 'Было: институция <b>«царь»</b>.', 'Стало: <b>«император»</b> — основа института императорской власти.'],
        ['Боярство', 'Дворянство', 'Было: <b>боярство</b> — высшая группа, крупнейший актор в экономике и политике.', 'Стало: <b>дворянство (помещики)</b> — главный институт в землевладении, военной и гражданской службе.'],
        ['Ополчение', 'Гвардия\nи флот', 'Было: <b>дворянское ополчение</b> как способ организации конницы.', 'Стало: <b>гвардия</b> (школа и «социальный лифт»), <b>драгунские полки</b>, <b>военный флот</b>.'],
        ['Холопство', 'Повинности\nдля всех', 'Было: <b>холопство</b> — форма рабства, не связанная с землёй.', 'Стало: <b>институт государственных повинностей</b> для всех сословий. Холопов записали в податное сословие.']
      ];
      c.oldB = []; c.newB = []; c.pairs = P;
      P.forEach(function (p, i) {
        var a = (i - 3) * 0.42, x = Math.sin(a) * 7, z = -Math.cos(a) * 7 + 5;
        c.box3(1.6, 0.4, 1.6, STONE, [x, 0.2, z], p[2] + ' → ' + p[3]);
        var o = c.box3(1.3, 1.6, 1.3, '#8a5a3b', [x, 1.2, z], p[2]); o.userData.base = [x, z];
        var n = c.box3(1.3, 1.9, 1.3, '#4f7be0', [x, -1.2, z], p[3]);
        var lo = c.label(p[0], [x, 2.5, z], 0.4, '#e8c9a8'), ln = c.label(p[1], [x, 2.7, z], 0.4, '#cfe0ff'); ln.visible = false;
        c.oldB.push([o, lo]); c.newB.push([n, ln]);
      });
      c.label('итог: Петербург — столица европейского типа', [0, 0.4, 1.5], 0.3, '#ffe7a8');
      c.state = 0; var s = 0;
      c.onFrame(function () {
        s += (c.state - s) * 0.04;
        c.oldB.forEach(function (o) { o[0].position.y = 1.2 - s * 2.6; o[1].visible = s < 0.5; });
        c.newB.forEach(function (n) { n[0].position.y = -1.2 + s * 2.6; n[1].visible = s >= 0.5; });
      });
    },
    chips: [
      { t: 'До Петра', on: function (c) { c.state = 0; c.setView(0, 1.15, 12, 1.2); c.say('Старые институты: Дума, приказы, патриарх, царь, боярство, ополчение, холопство.'); } },
      { t: 'Реформа ▶', on: function (c) { c.state = 1; c.setView(0, 1.15, 12, 1.5); c.say('Новые институты: <b>Сенат, коллегии, Синод, император, дворянство, гвардия и флот, повинности для всех</b>.'); } },
      { t: 'Пара за парой', on: function (c) { var i = c._pp = ((c._pp == null ? -1 : c._pp) + 1) % 7, p = c.pairs[i]; var a = (i - 3) * 0.42; c.setView(-a, 0.95, 8, 1.5, Math.sin(a) * 7, -Math.cos(a) * 7 + 5); c.say('<b>' + (i + 1) + '/7.</b> ' + p[2] + '<br>' + p[3]); } }
    ]
  });

  /* ======================= 12. Санкт-Петербург ======================= */
  reg('ru11-spb3d', {
    title: 'Санкт-Петербург: прогресс в камне', lead: 'Нева, Петропавловская крепость с золотым шпилем, Адмиралтейство с корабликом, прямые улицы и каналы. Город сам стал институтом движения к прогрессу.',
    radius: 20, phi: 0.85, theta: 0.6, targetY: 0.5, height: 420, hint: 'Нажми на здание.',
    build: function (c) {
      var T = c.THREE;
      c.box3(22, 0.2, 16, '#7d8a6a', [0, -0.1, 0], 'Санкт-Петербург основан в <b>1703</b> г. [ДОБАВЛЕНО] на отвоёванных у Швеции землях в устье Невы.');
      var ni = '<b>Нева</b> и Финский залив — тот самый выход к Балтике, ради которого шла Северная война.';
      var river = c.mesh(new T.BoxGeometry(22, 0.12, 3), WATER, ni); river.position.set(0, 0.05, 0); river.rotation.y = 0.1;
      var fi = '<b>Петропавловская крепость</b> — с неё начался город в 1703 г. [ДОБАВЛЕНО]. Шестиугольник бастионов, в центре собор с золотым шпилем.';
      var fort = c.mesh(new T.CylinderGeometry(2.4, 2.6, 0.7, 6), '#b8a68a', fi); fort.position.set(-2, 0.35, -3.6);
      var cath = c.box3(0.9, 1.2, 1.8, '#f0d9b5', [-2, 1.3, -3.6], fi);
      var spire = c.mesh(new T.ConeGeometry(0.22, 3.2, 10), GOLD, fi, { metalness: 0.9, roughness: 0.2, emissive: '#7a5a10', emissiveIntensity: 0.3 }); spire.position.set(-2, 3.5, -3.1);
      c.label('Петропавловская\nкрепость', [-2, 5.8, -3.6], 0.45);
      var ai = '<b>Адмиралтейство</b> — верфь, где строили военный флот. Символ: <b>кораблик на шпиле</b>. Флот — новый институт петровской эпохи.';
      c.box3(5, 0.9, 1.0, '#f0e1b8', [2.5, 0.45, 3.2], ai);
      var as = c.mesh(new T.ConeGeometry(0.18, 2.4, 8), GOLD, ai, { metalness: 0.9, roughness: 0.2 }); as.position.set(2.5, 2.3, 3.2);
      var boat = c.box3(0.4, 0.12, 0.15, GOLD, [2.5, 3.6, 3.2], ai);
      c.label('Адмиралтейство', [2.5, 4.4, 3.2], 0.45);
      var gi = 'Прямые <b>«регулярные»</b> улицы и каналы по плану — город как чертёж «регулярного государства». Каменное строительство, европейская архитектура.';
      for (var i = 0; i < 4; i++) c.box3(0.3, 0.1, 6, WATER, [-6 + i * 3.5, 0.06, 6], gi);
      for (var r = 0; r < 3; r++) for (var q = 0; q < 5; q++) c.box3(1.4, 0.6 + ((r + q) % 3) * 0.3, 1.2, ['#e6c79a', '#d9b0a0', '#c9d3e6'][(r + q) % 3], [-7.5 + q * 3.5 + 1.6, 0.3, 4.4 + r * 1.6], gi);
      var ships = [];
      for (var s = 0; s < 3; s++) {
        var sh = new T.Group(); c.root.add(sh);
        var hull = c.mesh(new T.BoxGeometry(1.2, 0.3, 0.4), WOOD, '«Окно в Европу»: торговые и военные корабли идут по Неве в Балтику.'); sh.add(hull);
        var sail = c.mesh(new T.PlaneGeometry(0.6, 0.7), '#f4f1ea', null, { side: T.DoubleSide }); sail.position.y = 0.55; sail.rotation.y = Math.PI / 2; sh.add(sail);
        ships.push(sh);
      }
      c.label('«окно в Европу» →', [-8, 1.2, 0.8], 0.45, '#cfe6ff');
      c.onFrame(function (t) {
        ships.forEach(function (sh, i) { var k = ((t * 0.05) + i / 3) % 1; sh.position.set(10 - k * 20, 0.25, (k * 20 - 10) * -0.1 + (i - 1) * 0.6); });
        boat.rotation.y = t;
      });
    },
    chips: [
      { t: 'Крепость', on: function (c) { c.setView(0.6, 0.85, 10, 2, -2, -3.6); c.say('<b>Петропавловская крепость</b> — 1703 [ДОБАВЛЕНО]: начало города.'); } },
      { t: 'Адмиралтейство', on: function (c) { c.setView(0.2, 0.85, 10, 1.5, 2.5, 3.2); c.say('<b>Адмиралтейство</b> — верфь военного флота. Флот — новый институт.'); } },
      { t: 'Регулярный город', on: function (c) { c.setView(0.0, 0.6, 14, 0.5, -1, 5.5); c.say('Улицы и каналы по линейке: <b>город-чертёж</b>, как и «регулярное государство».'); } },
      { t: 'Смысл', on: function (c) { c.setView(0.6, 0.85, 20, 0.5); c.say('Лекция: Петербург — <b>особая форма институализации самого движения к прогрессу</b>, столица европейского типа [столица с 1712–1713 — ДОБАВЛЕНО].'); } }
    ]
  });

  /* ======================= Мини-тест ======================= */
  HubWidgets.register('ru11-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Петровская модернизация</b></div><p class="wg-lead">10 вопросов по лекции 11.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Общество перенимает технологии тех, кто его обогнал. Это…', ['Инновация', 'Модернизация', 'Консервация'], 1, 'Модернизация — догоняющее развитие.'],
      ['Что такое «ментальный сдвиг»?', ['Смена правителя', 'Убеждение, что «как раньше жить не нужно»', 'Отмена крепостного права'], 1, 'Так его определял лектор. Пример на Руси — принятие христианства при Владимире.'],
      ['Когда модернизация бывает успешной (по лекции)?', ['Когда есть деньги', 'Когда сопровождается институциональным переходом', 'Когда её проводит царь'], 1, 'Институциональный переход — замена модели социального поведения на принципиально иную.'],
      ['Первый пример модернизации, перешедшей в инновации?', ['Голландия XVII в.', 'Англия II пол. XVII в.', 'Франция XVIII в.'], 1, 'Огораживания → революции 1640 и 1688 → ментальный сдвиг → мануфактуры.'],
      ['Что значит «овцы съели людей»?', ['Голод в Англии', 'Огораживания: поля отдали под пастбища, крестьян согнали', 'Чума'], 1, 'Земля пошла под шерсть, арендаторов заменили наёмными работниками.'],
      ['Какое событие 1682 г. — шаг к «рациональной бюрократии»?', ['Отмена местничества', 'Соборное уложение', 'Табель о рангах'], 0, 'Должности перестали делить по знатности предков.'],
      ['Главный «консервант» архаики в России XVII в.?', ['Православие', 'Крепостное право', 'Неграмотность'], 1, 'Все три — препятствия, но «консервантом» назван именно крепостной строй.'],
      ['Какой путь выбрал Пётр?', ['Эволюционный', '«Революция сверху»', '«Снизу», под давлением извне'], 1, 'Насаждение новых институтов государственным насилием.'],
      ['Что стало триггером поворота к «сначала модернизация — потом экспансия»?', ['Великое посольство', 'Поражения на Чёрном и Балтийском морях', 'Смерть Софьи'], 1, 'В том числе Нарва 1700 г.'],
      ['Что пришло на смену приказам?', ['Сенат', 'Коллегии', 'Синод'], 1, 'Сенат заменил Боярскую думу, Синод — патриаршество.']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 160px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 7 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
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
