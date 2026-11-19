/* 3D-модели к конспекту «Кризис европейской культуры: экзистенциализм Кьеркегора» (Философия, 18.11), часть 1.
   В Markdown: @@graph:kf-temple3d@@ @@graph:kf-forces3d@@ @@graph:kf-machine3d@@ @@graph:kf-clock3d@@
   @@graph:kf-crossroad3d@@ @@graph:kf-cage3d@@ @@graph:kf-essence3d@@ @@graph:kf-function3d@@
   @@graph:kf-stages3d@@ @@graph:kf-abraham3d@@ @@graph:kf-alone3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa',
    WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', ORANGE = '#f08a3c', STEEL = '#9aa3b8';
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
  function fade(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
  }
  function glow(c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ======================= 1. Храм европейской культуры ======================= */
  reg('kf-temple3d', {
    title: 'Храм европейской культуры', lead: 'Европейский мир стоит на двух колоннах: Античность (разум, наука) и христианство (ценность каждого человека). Крыша — гуманизм. Нажми «Кризис» и посмотри, что происходит с человеком под крышей.',
    radius: 12, phi: 1.05, theta: 0.35, targetY: 2.6, height: 420, hint: 'Нажми на колонну, крышу или человека.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iA = '<b>Колонна 1 — Античность.</b> Греки дали Европе <b>рациональность</b>: веру в разум, логику, научное знание. Через знание человек строит понятный и безопасный мир.';
      var iC = '<b>Колонна 2 — христианство.</b> Дало идею <b>ценности каждой личности</b>: человек создан по образу Божию, его душа бессмертна. Отсюда уважение к индивиду.';
      var iR = '<b>Крыша — гуманизм.</b> Общественная жизнь основана на <b>уважении к личности</b>. Человека защищают институты (право, государство, церковь), он <b>уверен в будущем</b>.';
      var iP = '<b>Европейский человек</b> до кризиса: «мир — это порядок, устойчивость, безопасность». Он ещё не всё знает, но не сомневается, что разум знает путь.';
      c.box3(7, 0.4, 3.4, STONE, [0, 0.2, 0], 'Фундамент: вера, что мир устроен разумно и человеку в нём есть место.');
      var colA = c.mesh(new T.CylinderGeometry(0.45, 0.55, 4.2, 18), STONE, iA); colA.position.set(-2.4, 2.5, 0);
      var colB = c.mesh(new T.CylinderGeometry(0.45, 0.55, 4.2, 18), GOLD, iC); colB.position.set(2.4, 2.5, 0);
      var roof = c.mesh(new T.CylinderGeometry(0.01, 4.4, 1.3, 4), PAPER, iR); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.55); roof.position.set(0, 5.3, 0);
      var me = person(c, 0, 0.3, BLUE, iP, null, 1, 0.4);
      c.label('Античность\nразум · наука', [-2.4, -0.3, 2.2], 0.32, '#cfd6ff');
      c.label('Христианство\nценность личности', [2.4, -0.3, 2.2], 0.32, '#f0c36b');
      c.label('ГУМАНИЗМ', [0, 6.6, 0], 0.4, '#eef0f8');
      var cracks = [];
      for (var i = 0; i < 6; i++) { var cr = c.mesh(new T.BoxGeometry(0.06, 0.7, 0.06), RED, '<b>Трещины</b> — кризис: разум и вера перестают давать опору.', { emissive: RED, emissiveIntensity: 0.6 }); cr.position.set(i < 3 ? -2.4 : 2.4, 1.4 + (i % 3) * 1.1, 0.5); cr.rotation.z = (i % 2 ? 0.5 : -0.5); cr.visible = false; cracks.push(cr); }
      c.state = { k: 0, goal: 0 };
      c.onFrame(function (t) {
        var s = c.state; s.k += (s.goal - s.k) * 0.05; var k = s.k;
        colA.rotation.z = k * 0.18; colB.rotation.z = -k * 0.12; colA.position.x = -2.4 - k * 0.3;
        roof.position.y = 5.3 - k * 0.9; roof.rotation.z = k * 0.15;
        cracks.forEach(function (cr) { cr.visible = k > 0.3; });
        me.position.x = Math.sin(t * 9) * 0.06 * k; me.rotation.y = k > 0.5 ? Math.sin(t * 2) * 1.2 : 0;
      });
    },
    chips: [
      { t: 'Порядок', small: 'до XIX в.', on: function (c) { c.state.goal = 0; c.say('Мир — <b>порядок</b>, у человека есть опора: знание, вера, институты. Будущее кажется гарантированным.'); } },
      { t: 'Кризис', small: 'XIX–XX вв.', on: function (c) { c.state.goal = 1; c.say('<b>Кризис европейской культуры:</b> обе колонны трещат. Человек теряет уверенность в будущем и <b>уважение к себе</b>. Он чувствует себя <b>заброшенным в чужой мир</b>.'); } }
    ]
  });

  /* ======================= 2. Силы кризиса ======================= */
  reg('kf-forces3d', {
    title: 'Откуда пришёл кризис', lead: 'Четыре удара по «храму» европейского человека. Нажимай кнопки, чтобы подсветить каждую причину.',
    radius: 13.6, phi: 0.95, theta: 0.2, targetY: 1.3, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var G = { cls: group(c), mach: group(c), war: group(c), col: group(c) };
      var iK = '<b>Классы вместо сословий.</b> Сословное общество сменилось классовым. Два главных класса — <b>буржуазия и пролетариат</b> — находятся в конфликте. «Буржуазия порождает своего могильщика» (Маркс). Отсюда революции.';
      for (var i = 0; i < 3; i++) person(c, -5 + i * 0.7, -2.2, GOLD, iK, G.cls, 0.8);
      for (var j = 0; j < 4; j++) person(c, -5.3 + j * 0.7, -0.6, GREY, iK, G.cls, 0.8);
      into(G.cls, c.label('буржуазия ↔ пролетариат', [-4.3, 2.2, -1.4], 0.3));
      var iM = '<b>Машина.</b> Человек создал машину, а машина подчинила человека. Труд стал тяжёлым, нетворческим, <b>отчуждённым</b> — «на грани выживания».';
      into(G.mach, c.box3(2.2, 1.6, 1.6, STEEL, [4.2, 0.8, -2], iM));
      var pipe = into(G.mach, c.mesh(new T.CylinderGeometry(0.25, 0.3, 2.4, 12), DARK, iM)); pipe.position.set(4.9, 2.6, -2.3);
      var gear = into(G.mach, c.mesh(new T.TorusGeometry(0.7, 0.18, 8, 12), GREY, iM)); gear.position.set(3.6, 2.4, -1.2);
      into(G.mach, c.label('машина', [4.2, 4.4, -2], 0.3));
      var iW = '<b>Войны.</b> Мировые войны показали, что разум и наука служат и разрушению. Предчувствие катастрофы было уже в конце XIX века.';
      var fire = []; for (var f = 0; f < 10; f++) { var fl = into(G.war, c.mesh(new T.ConeGeometry(0.25, 0.9, 8), f % 2 ? RED : ORANGE, iW, { emissive: ORANGE, emissiveIntensity: 0.5 })); fl.position.set(-4.4 + (f % 4) * 0.4, 0.45, 2.6 + Math.floor(f / 4) * 0.4); fire.push(fl); }
      into(G.war, c.label('войны и революции', [-3.8, 2.0, 3], 0.3));
      var iCo = '<b>Колонии.</b> Европа решила, что нашла «лучшую модель жизни», и стала навязывать её странам третьего мира. <b>Знание превращается в насилие</b> над неевропейскими народами.';
      var globe = into(G.col, c.mesh(new T.SphereGeometry(1, 24, 16), BLUE, iCo)); globe.position.set(4, 1.2, 2.6);
      var ring = into(G.col, c.mesh(new T.TorusGeometry(1.35, 0.05, 6, 40), GOLD, iCo)); ring.position.copy(globe.position); ring.rotation.x = 1.2;
      into(G.col, c.label('колонии', [4, 2.9, 2.6], 0.3));
      var me = person(c, 0, 0.3, BLUE, 'Европейский человек под ударами со всех сторон.', null, 1.2);
      c.state = { G: G };
      c.onFrame(function (t) { gear.rotation.z = t * 1.5; ring.rotation.z = t; globe.rotation.y = t * 0.3; fire.forEach(function (fl, i) { fl.scale.y = 0.8 + 0.4 * Math.abs(Math.sin(t * 5 + i)); }); me.rotation.y = t * 0.5; });
    },
    chips: [
      { t: 'Классы', on: function (c) { fade(c.state.G, ['cls']); c.say('Сословия → классы. Конфликт буржуазии и пролетариата ведёт к революциям. Человек перестаёт быть уверен в своём месте.'); } },
      { t: 'Машина', on: function (c) { fade(c.state.G, ['mach']); c.say('Машина и <b>отчуждённый труд</b>: человек — придаток станка.'); } },
      { t: 'Войны', on: function (c) { fade(c.state.G, ['war']); c.say('Войны: разум, обещавший безопасность, создал оружие.'); } },
      { t: 'Колонии', on: function (c) { fade(c.state.G, ['col']); c.say('Европейская модель навязывается силой. Знание → насилие.'); } },
      { t: 'Все', on: function (c) { fade(c.state.G, ['cls', 'mach', 'war', 'col']); c.say('Все четыре силы вместе = <b>кризис европейской культуры</b>.'); } }
    ]
  });

  /* ======================= 3. Отчуждение ======================= */
  reg('kf-machine3d', {
    title: 'Отчуждение: человек у конвейера', lead: 'Человек стоит у ленты, коробки едут мимо, огромная шестерня крутится сама. Человек — лишь деталь машины. Кнопки показывают, от чего он отчуждён.',
    radius: 11.2, phi: 1.05, theta: 0.5, targetY: 1.6, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iB = '<b>Конвейер.</b> Труд стал однообразным и нетворческим. Человек не видит результата своей работы — он делает одну операцию.';
      c.box3(9, 0.25, 1.2, DARK, [0, 0.9, 0], iB);
      var boxes = []; for (var i = 0; i < 6; i++) { var b = c.box3(0.6, 0.5, 0.6, WOOD, [0, 1.3, 0], '<b>Продукт</b> принадлежит не работнику. Он уезжает мимо него.'); boxes.push(b); }
      var gear = c.mesh(new T.TorusGeometry(1.8, 0.35, 8, 14), STEEL, '<b>Машина</b> крутится сама. Изобретённая человеком, она теперь задаёт ему ритм. «Люди против машин, машины против людей».'); gear.position.set(0, 3.6, -2);
      var me = person(c, 0, 1.3, BLUE, '<b>Рабочий.</b> «Человек — единственное существо, которое способно творить». А здесь от него требуется только повторять движение.', null, 1);
      var walls = {};
      var spots = { trud: [0, 1.4, 0.75], prod: [2.5, 1.6, 0], other: [-2.6, 1.0, 1.8], self: [0, 1.1, 1.8] };
      Object.keys(spots).forEach(function (k) { var w = c.mesh(new T.BoxGeometry(1.6, 2.2, 0.06), '#bcd3ff', null, { transparent: true, opacity: 0 }); w.position.set(spots[k][0], spots[k][1], spots[k][2]); walls[k] = w; });
      person(c, -2.6, 2.8, GREY, '<b>Другие люди</b> — тоже детали. Между людьми — конкуренция, а не общение.', null, 0.9);
      c.state = { boxes: boxes, walls: walls, on: null };
      c.onFrame(function (t) {
        gear.rotation.z = t * 0.8;
        boxes.forEach(function (b, i) { var x = ((t * 0.9 + i * 1.5) % 9) - 4.5; b.position.x = x; });
        me.rotation.y = Math.sin(t * 4) * 0.4;
        Object.keys(walls).forEach(function (k) { var w = walls[k]; w.material.opacity += ((c.state.on === k ? 0.45 : 0) - w.material.opacity) * 0.1; });
      });
    },
    chips: [
      { t: 'Труд', on: function (c) { c.state.on = 'trud'; c.say('Отчуждение от <b>труда</b>: работа не радует и не развивает, это «труд на грани выживания».'); } },
      { t: 'Продукт', on: function (c) { c.state.on = 'prod'; c.say('Отчуждение от <b>продукта</b>: сделанное уезжает и принадлежит другому.'); } },
      { t: 'Другие', on: function (c) { c.state.on = 'other'; c.say('Отчуждение от <b>других людей</b>: вместо общения — конкуренция.'); } },
      { t: 'Сам себя', on: function (c) { c.state.on = 'self'; c.say('Отчуждение от <b>самого себя</b>: человек перестаёт быть творцом, теряет уважение к себе. <b>[ДОБАВЛЕНО]</b> Четыре вида отчуждения описал Маркс (1844).'); } }
    ]
  });

  /* ======================= 4. Мир-механизм ======================= */
  reg('kf-clock3d', {
    title: 'Мир-механизм без часовщика', lead: 'Новое время представило мир как огромные часы, а Бога — как часовщика, который завёл их. Нажми «Часовщик ушёл»: человек остаётся один внутри шестерёнок.',
    radius: 11.2, phi: 1.15, theta: 0.1, targetY: 2.6, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var iM = '<b>Мир-механизм.</b> Наука Нового времени объяснила мир как машину: всё движется по законам. Удобно и понятно — но в механизме <b>нет смысла</b> и нет места для человека.';
      var gears = [];
      [[0, 2.8, 2.2, 0.25], [2.6, 4.6, 1.2, -0.45], [-2.5, 4.4, 1.3, 0.4], [2.4, 1.2, 1.0, -0.6]].forEach(function (g) {
        var m = c.mesh(new T.TorusGeometry(g[2], 0.18, 8, 12 + Math.round(g[2] * 4)), g[2] > 2 ? GOLD : STEEL, iM); m.position.set(g[0], g[1], -0.5); m.userData.sp = g[3]; gears.push(m);
        for (var k = 0; k < 6; k++) { var sp = c.mesh(new T.BoxGeometry(0.08, g[2] * 2, 0.08), DARK, iM); sp.rotation.z = k * Math.PI / 6; m.add(sp); sp.position.set(0, 0, 0); }
      });
      var me = person(c, 0, 0.3, BLUE, '<b>Человек</b> внутри механизма. Когда «часовщик» уходит, он чувствует себя <b>заброшенным</b>: мир крутится, но ему нет до человека дела.', null, 0.9, 0);
      var maker = person(c, -4.6, 0, GOLD, '<b>Бог-часовщик</b> (деизм XVIII века): Бог создал мир, завёл его и больше не вмешивается. Лектор: человек понял, что заброшен, а «часовщик» ушёл.', null, 1.6);
      var halo = glow(c, GOLD, 0.35, 'Бог-часовщик'); halo.position.set(-4.6, 3.4, 0);
      c.state = { gone: 0, goal: 0 };
      c.onFrame(function (t) {
        var s = c.state; s.gone += (s.goal - s.gone) * 0.05;
        gears.forEach(function (g) { g.rotation.z = t * g.userData.sp; });
        maker.traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = 1 - s.gone * 0.95; } });
        halo.material.transparent = true; halo.material.opacity = 1 - s.gone; maker.position.x = -4.6 - s.gone * 3;
        me.rotation.y = s.gone > 0.5 ? Math.sin(t * 1.5) * 2 : 0;
      });
    },
    chips: [
      { t: 'Часовщик есть', on: function (c) { c.state.goal = 0; c.say('Пока есть Творец, у механизма есть смысл и автор. Человек знает, зачем он здесь.'); } },
      { t: 'Часовщик ушёл', on: function (c) { c.state.goal = 1; c.say('Мир продолжает крутиться, но <b>смысла больше никто не гарантирует</b>. Это ощущение <b>заброшенности</b> — ключевое слово экзистенциализма.'); } }
    ]
  });

  /* ======================= 5. Перекрёсток ценностей ======================= */
  reg('kf-crossroad3d', {
    title: 'Ценности рухнули: куда идти?', lead: 'Старые ценности больше не работают. Перед человеком развилка. Нажимай кнопки — человек пойдёт по выбранной дороге.',
    radius: 12.8, phi: 0.85, theta: 0, targetY: 0.8, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var roads = { a: [-4.5, -4], b: [4.5, -4], c: [0, -5] };
      c.box3(1.1, 0.06, 4, '#c9b58a', [0, 0.03, 2.5], 'Дорога, по которой шёл европейский человек.');
      var iA = '<b>Путь 1 — отчаяние.</b> «Ценности не работают, я один, опоры нет». Человек падает в пустоту.';
      var iB = '<b>Путь 2 — «ценностей нет, делай что хочешь».</b> Всё дозволено. Это нигилизм в худшем смысле: хаос.';
      var iC = '<b>Путь 3 — создать ценности самому.</b> Ницше: разбить старые скрижали <b>молотом</b> и творить новые. Экзистенциализм: <b>выбрать себя</b> и отвечать за выбор.';
      function road(a, b, info) { var dx = b[0] - a[0], dz = b[2] - a[2], L = Math.sqrt(dx * dx + dz * dz); var r = c.box3(1.1, 0.06, L, '#c9b58a', [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.03, (a[2] + b[2]) / 2], info); r.rotation.y = Math.atan2(dx, dz); r.rotation.x = -Math.atan2(b[1] - a[1], L); return r; }
      road([0, 0, 0.5], [roads.a[0], 0, roads.a[1]], iA); road([0, 0, 0.5], [roads.b[0], 0, roads.b[1]], iB); road([0, 0, 0.5], [roads.c[0], 1.6, roads.c[1]], iC);
      var pit = c.mesh(new T.CylinderGeometry(1.4, 0.4, 0.1, 24), '#111', iA); pit.position.set(roads.a[0], 0.05, roads.a[1]);
      c.label('отчаяние', [roads.a[0], 1.4, roads.a[1]], 0.32, '#ffb3ab');
      for (var i = 0; i < 9; i++) { var cb = c.box3(0.5, 0.5, 0.5, [RED, PURPLE, ORANGE][i % 3], [roads.b[0] + (Math.random() - 0.5) * 2.4, 0.25 + Math.random() * 1.2, roads.b[1] + (Math.random() - 0.5) * 2], iB); cb.rotation.set(Math.random() * 3, Math.random() * 3, 0); }
      c.label('«делай что хочешь»', [roads.b[0], 2.4, roads.b[1]], 0.32, '#e0b0ff');
      var hill = c.mesh(new T.CylinderGeometry(0.8, 1.6, 1.6, 20), '#4f7a46', iC); hill.position.set(roads.c[0], 0.8, roads.c[1]);
      var ham = c.box3(0.9, 0.35, 0.35, GREY, [0, 2.4, roads.c[1]], 'Молот Ницше: «философствовать молотом».'); var hs = c.box3(0.12, 1.1, 0.12, WOOD, [0, 1.9, roads.c[1]], 'Молот Ницше.');
      c.label('творить себя', [roads.c[0], 3.4, roads.c[1]], 0.32, '#7fe0a8');
      var me = person(c, 0, 2.5, BLUE, 'Человек на развилке.', null, 1);
      c.state = { me: me, path: null, k: 0 };
      c.onFrame(function (t) {
        var s = c.state; ham.rotation.z = Math.sin(t * 3) * 0.4;
        if (!s.path) { me.position.set(0, 0, 2.5 - Math.min(2, s.k)); s.k = Math.min(2, s.k + 0.02); return; }
        s.k = Math.min(1, s.k + 0.012); var r = roads[s.path], k = s.k;
        var y = s.path === 'c' ? 1.6 * k : (s.path === 'a' && k > 0.85 ? -(k - 0.85) * 12 : 0);
        me.position.set(lerp(0, r[0], k), y, lerp(0.5, r[1], k));
      });
    },
    chips: [
      { t: 'Отчаяние', on: function (c) { c.state.path = 'a'; c.state.k = 0; c.say('Человек проваливается в отчаяние: опоры нет, мир чужой.'); } },
      { t: 'Всё дозволено', on: function (c) { c.state.path = 'b'; c.state.k = 0; c.say('«Ценностей нет — делай что хочешь». Свобода без ответственности превращается в хаос.'); } },
      { t: 'Творить', on: function (c) { c.state.path = 'c'; c.state.k = 0; c.say('Путь вверх: <b>переоценить ценности</b> (Ницше) и <b>выбрать себя</b> (Кьеркегор). Трудно, но это единственный путь к себе.'); } }
    ]
  });

  /* ======================= 6. Страх свободы ======================= */
  reg('kf-cage3d', {
    title: 'Страх свободы', lead: 'Дверь клетки открыта, снаружи — простор. Но человек не спешит выходить. Почему? Нажми кнопки.',
    radius: 10.4, phi: 1.05, theta: 0.5, targetY: 1.5, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6, '#3c5a3a');
      var iC = '<b>Клетка = привычные нормы.</b> Тесно, зато всё решено за тебя: «это правильно, это неправильно». Безопасно.';
      for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; if (i === 0 || i === 13) continue; var bar = c.mesh(new T.CylinderGeometry(0.05, 0.05, 3, 8), STEEL, iC); bar.position.set(-1 + Math.cos(a) * 1.6, 1.5, Math.sin(a) * 1.6); }
      var top = c.mesh(new T.TorusGeometry(1.6, 0.07, 6, 40), STEEL, iC); top.rotation.x = Math.PI / 2; top.position.set(-1, 3, 0);
      var bot = top.clone(); bot.position.y = 0.05; c.root.add(bot);
      var door = new T.Group(); c.root.add(door); door.position.set(-1 + 1.6, 0, 0);
      for (var d = 0; d < 3; d++) { var db = c.mesh(new T.CylinderGeometry(0.05, 0.05, 3, 8), GOLD, 'Дверь открыта: человек <b>свободен</b>.'); db.position.set(0, 1.5, -0.35 + d * 0.35); door.add(db); }
      var me = person(c, -1, 0, BLUE, 'Человек. «Мы хотим быть свободными» — но боимся свободы.', null, 1);
      var sun = glow(c, GOLD, 0.6, '<b>Свобода.</b> Там нет правил «можно / нельзя». Нет и того, на кого переложить ответственность.'); sun.position.set(4.5, 4, -1);
      c.label('свобода = ответственность', [3.5, 5.2, -1], 0.3, '#f0c36b');
      c.state = { open: 0, out: 0, go: 0, gout: 0 };
      c.onFrame(function (t) {
        var s = c.state; s.open += (s.go - s.open) * 0.06; s.out += (s.gout - s.out) * 0.03;
        door.rotation.y = -s.open * 1.6; me.position.x = -1 + s.out * 4.5; me.position.y = s.out > 0.9 ? 0 : 0;
        me.rotation.y = s.go && !s.gout ? Math.sin(t * 2) * 0.8 : 0;
      });
    },
    chips: [
      { t: 'Открыть дверь', on: function (c) { c.state.go = 1; c.state.gout = 0; c.say('Дверь открыта, но человек мнётся. <b>Свобода пугает</b>: снаружи нет готовых ответов и некому сказать «ты прав».'); } },
      { t: 'Выйти', on: function (c) { c.state.go = 1; c.state.gout = 1; c.say('Выйти — значит взять <b>ответственность за себя</b>. Так экзистенциализм понимает свободу.'); } },
      { t: 'Назад', on: function (c) { c.state.go = 0; c.state.gout = 0; c.say('Человек возвращается в клетку: безопасность ценой свободы. Это уже было у Ницше («стадо»).'); } }
    ]
  });

  /* ======================= 7. Существование и сущность ======================= */
  reg('kf-essence3d', {
    title: 'Человек делает сам себя', lead: 'Слева нож: сначала чертёж (сущность), потом вещь. Справа человек: никакого чертежа нет, он строит себя из выборов. Жми «Сделать выбор».',
    radius: 11.2, phi: 1.1, theta: 0.2, targetY: 2, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iK = '<b>Вещь.</b> Мастер сначала придумал, <b>для чего</b> нож (сущность), а потом сделал его (существование). У вещи сущность предшествует существованию.';
      var bp = c.box3(2.2, 0.04, 1.6, '#2d5fb5', [-2.4, 0.02, 0.5], iK);
      c.label('чертёж', [-2.4, 0.6, 1.6], 0.34);
      var blade = c.box3(0.18, 1.6, 0.05, STEEL, [-2.4, 2.6, 0], iK); var hd = c.box3(0.28, 0.9, 0.2, WOOD, [-2.4, 1.4, 0], iK);
      c.label('вещь:\nсначала замысел', [-2.4, 4.3, 0], 0.4, '#cfd6ff');
      var iH = '<b>Человек.</b> Его заранее не «спроектировали». Он сначала <b>существует</b> (экзистенция), а кем станет — решает сам. «Ты делаешь выбор и делаешь самого себя».';
      var me = person(c, 2.2, 0, BLUE, iH, null, 1);
      c.label('человек:\nсначала живёт', [2.2, 5.4, 0], 0.4, '#7fe0a8');
      var names = ['учёба', 'друзья', 'профессия', 'любовь', 'ошибка', 'поступок', 'вера', 'бунт'];
      c.state = { blocks: [], me: me, names: names, add: function () {
        var n = c.state.blocks.length; if (n >= 7) return;
        var b = c.box3(1.4, 0.45, 1.4, [GREEN, GOLD, PURPLE, BLUE, RED, ORANGE, STONE][n], [2.2, 0.22 + n * 0.45, 0], '<b>Выбор: «' + names[n] + '»</b>. Каждый выбор становится частью тебя, и вернуть его нельзя.');
        var l = c.label(names[n], [3.6, 0.22 + n * 0.45, 0.6], 0.34); c.state.blocks.push(b, l); } };
      c.onFrame(function (t) { blade.rotation.y = t * 0.7; var n = c.state.blocks.length / 2; me.position.y += (n * 0.45 - me.position.y) * 0.1; });
    },
    chips: [
      { t: 'Сделать выбор', small: '+1', on: function (c) { c.state.add(); c.say('Выбор сделан — человек стал выше на одну ступень. <b>Метод существования человека — выбор</b>, и выбор, который уже не отменить.'); } },
      { t: 'Сначала', on: function (c) { c.state.blocks.forEach(function (b) { c.root.remove(b); }); c.state.blocks = []; c.say('Человек без выборов — только возможность. <b>[ДОБАВЛЕНО]</b> Сартр позже скажет: «существование предшествует сущности».'); } }
    ]
  });

  /* ======================= 8. Человек больше функции ======================= */
  reg('kf-function3d', {
    title: 'Человек больше любой своей функции', lead: 'Вокруг человека — «маски»: человек политический, экономический, социальная роль. Каждая закрывает только часть. Нажми «Снять маски».',
    radius: 9.6, phi: 1.1, theta: 0.3, targetY: 1.6, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(5);
      var me = person(c, 0, 0, BLUE, '<b>Конкретный человек</b> во всём многообразии. Экзистенциализм интересуется именно им, а не «человеком вообще».', null, 1.6);
      var masks = [];
      [['политический', RED, 0], ['экономический', GOLD, 2.1], ['роль в обществе', GREY, 4.2]].forEach(function (m) {
        var g = new T.Group(); c.root.add(g); g.rotation.y = m[2];
        var p = c.mesh(new T.CylinderGeometry(1.4, 1.4, 2.6, 20, 1, true, 0, 1.8), m[1], '<b>Человек ' + m[0] + '.</b> Любое определение ограничено: назвав человека «политическим», мы отбрасываем всё остальное.', { transparent: true, opacity: 0.75, side: T.DoubleSide }); p.position.y = 1.3; g.add(p);
        var l = c.label(m[0], [Math.sin(m[2] + 0.9) * 2.3, 2.9, Math.cos(m[2] + 0.9) * 2.3], 0.34); masks.push({ g: g, p: p, l: l });
      });
      var core = glow(c, GOLD, 0.25, '<b>Экзистенция</b> — то, что нельзя свести к функции: сама жизнь человека, его <b>возможности</b>.'); core.position.y = 1.3;
      c.state = { off: 0, goal: 0 };
      c.onFrame(function (t) {
        var s = c.state; s.off += (s.goal - s.off) * 0.05;
        masks.forEach(function (m, i) { m.g.rotation.y = i * 2.1 + t * 0.2; m.g.position.y = s.off * 4; m.p.material.opacity = 0.75 * (1 - s.off); m.l.material.opacity = 1 - s.off; });
        core.scale.setScalar(1 + s.off * 2 + Math.sin(t * 2) * 0.1);
      });
    },
    chips: [
      { t: 'Снять маски', on: function (c) { c.state.goal = 1; c.say('Без масок виден <b>конкретный человек</b>: его функции — лишь возможности, а не он сам.'); } },
      { t: 'Надеть', on: function (c) { c.state.goal = 0; c.say('Общество видит человека как функцию: избиратель, работник, потребитель.'); } }
    ]
  });

  /* ======================= 9. Три стадии ======================= */
  reg('kf-stages3d', {
    title: 'Три стадии Кьеркегора', lead: 'Три площадки на разной высоте: эстетическая, этическая, религиозная. Между ними — пропасть отчаяния. Перейти можно только прыжком. Жми «Прыжок».',
    radius: 14, phi: 1.0, theta: 0.5, targetY: 1.6, height: 440,
    build: function (c) {
      var T = c.THREE; c.ground(9);
      var P = [[-5, 0.3], [0, 0.9], [5, 1.5]];
      var iE = '<b>1. Эстетическая стадия.</b> Человек живёт <b>наслаждением</b> и тем, как его оценят другие. Образ — <b>Дон Жуан</b>. Каждое удовольствие быстро кончается → <b>разочарование и отчаяние</b>.';
      var iT = '<b>2. Этическая стадия.</b> Жизнь по <b>долгу</b>, выбор себя, ответственность. Образ — <b>Сократ</b>: беседы, ирония, «я знаю, что ничего не знаю». Но и разум не снимает отчаяния.';
      var iR = '<b>3. Религиозная стадия.</b> Вера как личное отношение к Богу — через <b>абсурд</b>, страх и трепет. Образ — <b>Авраам</b>.';
      var cols = [PURPLE, BLUE, GOLD], infos = [iE, iT, iR], names = ['эстетическая\nДон Жуан', 'этическая\nСократ', 'религиозная\nАвраам'];
      P.forEach(function (p, i) { var pl = c.mesh(new T.CylinderGeometry(1.8, 1.8, p[1] * 2, 24), cols[i], infos[i]); pl.position.set(p[0], p[1], 0); c.label(names[i], [p[0], p[1] * 2 + 2.6, 0], 0.5); });
      var car = new T.Group(); c.root.add(car); car.position.set(-5, 0.7, 0);
      for (var k = 0; k < 6; k++) { var s = c.mesh(new T.SphereGeometry(0.22, 12, 8), [RED, ORANGE, PURPLE][k % 3], iE, { emissive: RED, emissiveIntensity: 0.3 }); s.position.set(Math.cos(k) * 1.2, 0.3, Math.sin(k) * 1.2); car.add(s); }
      var col = c.mesh(new T.CylinderGeometry(0.2, 0.25, 1.4, 14), STONE, iT); col.position.set(0.9, 2.5, -0.8);
      var lt = glow(c, GOLD, 0.45, iR); lt.position.set(5, 4.6, 0);
      [-2.5, 2.5].forEach(function (x) { var gap = c.mesh(new T.BoxGeometry(1.4, 0.05, 3), '#0b0b12', '<b>Пропасть отчаяния.</b> Переход на следующую стадию — не вывод разума, а <b>прыжок</b> (скачок), выбор.'); gap.position.set(x, 0.03, 0); });
      var me = person(c, -5, 0, BLUE, 'Человек на пути к себе.', null, 1.3, 0.6);
      c.state = { i: 0, k: 1, P: P };
      c.onFrame(function (t) {
        var s = c.state; car.rotation.y = t * 1.2; lt.scale.setScalar(1 + 0.15 * Math.sin(t * 2));
        s.k = Math.min(1, s.k + 0.015); var a = P[Math.max(0, s.i - 1)], b = P[s.i], k = s.k;
        if (s.i === 0) { me.position.set(-5, 0.6, 0); return; }
        me.position.set(lerp(a[0], b[0], k), lerp(a[1] * 2, b[1] * 2, k) + Math.sin(k * Math.PI) * 2.5, 0);
      });
    },
    chips: [
      { t: 'Прыжок', small: 'на стадию выше', on: function (c) { var s = c.state; if (s.i < 2) { s.i++; s.k = 0; } c.say(s.i === 1 ? 'Разочаровавшись в удовольствиях, человек делает <b>выбор</b> и переходит к этической стадии.' : 'Отчаяние этического человека (разум не спасает от одиночества) ведёт к <b>прыжку веры</b>.'); } },
      { t: 'Сначала', on: function (c) { c.state.i = 0; c.state.k = 1; c.say('Эстетик живёт мгновением. «Счастье на минуту, а потом отчаяние».'); } }
    ]
  });

  /* ======================= 10. Авраам ======================= */
  reg('kf-abraham3d', {
    title: 'Авраам на горе Мориа', lead: 'Бог потребовал от Авраама принести в жертву единственного сына Исаака. Авраам пошёл. Посмотри на эту историю глазами этики и глазами веры.',
    radius: 10, phi: 1.0, theta: 0.4, targetY: 3, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iM = '<b>Гора Мориа.</b> Три дня пути Авраам <b>молчал</b>: объяснить это никому нельзя.';
      var mt = c.mesh(new T.ConeGeometry(4.2, 3, 9), '#6f6a62', iM); mt.position.set(0, 1.5, 0);
      var top = c.mesh(new T.CylinderGeometry(1.6, 1.6, 0.3, 16), '#6f6a62', iM); top.position.set(0, 2.4, 0);
      var alt = c.box3(1.2, 0.5, 0.7, STONE, [0, 2.8, 0], '<b>Жертвенник.</b>');
      var isa = person(c, 0, 0, PAPER, '<b>Исаак</b> — сын, рождённый Аврааму в старости по обещанию Бога.', null, 0.55, 3.05); isa.rotation.z = Math.PI / 2; isa.position.x = 0.3;
      var ab = person(c, -1.2, 0.2, PURPLE, '<b>Авраам — «рыцарь веры».</b> Кьеркегор («Страх и трепет», 1843): Авраам не перестал верить и <b>не разочаровался</b> в Боге, хотя разумом это понять невозможно.', null, 1.4, 2.55);
      var knife = c.box3(0.06, 0.6, 0.05, STEEL, [-0.6, 4.2, 0.2], 'Нож.');
      var ang = glow(c, '#ffffff', 0.4, '<b>Ангел</b> остановил руку Авраама.'); ang.position.set(0, 6.5, 0.5); ang.visible = false;
      var ram = c.mesh(new T.SphereGeometry(0.4, 12, 10), PAPER, '<b>Баран</b>, запутавшийся рогами в кустах, — его принесли в жертву вместо Исаака.'); ram.position.set(1.6, 2.8, 0.6); ram.visible = false;
      c.state = { ang: ang, ram: ram, knife: knife };
      c.onFrame(function (t) { ang.position.y = 6.5 + Math.sin(t * 2) * 0.2; knife.rotation.z = Math.sin(t) * 0.1; });
    },
    chips: [
      { t: 'Глазами этики', on: function (c) { c.state.ang.visible = false; c.state.ram.visible = false; c.say('С точки зрения морали Авраам — <b>убийца</b>. Общий закон («не убий») его осуждает. Этика не может это оправдать.'); } },
      { t: 'Глазами веры', on: function (c) { c.say('С точки зрения веры Авраам — <b>рыцарь веры</b>: он верит вопреки разуму, <b>«силою абсурда»</b>. Путь к Богу у Кьеркегора — не через рассуждение, а через молчание, страх и трепет.'); } },
      { t: 'Развязка', on: function (c) { c.state.ang.visible = true; c.state.ram.visible = true; c.say('Ангел остановил руку, Исаак жив. Но Авраам не знал этого заранее — в этом и есть <b>прыжок веры</b>.'); } }
    ]
  });

  /* ======================= 11. Одиночество ======================= */
  reg('kf-alone3d', {
    title: 'Никто не проживёт жизнь за тебя', lead: 'Человек в светлом круге. Вокруг — люди, они готовы помочь. Нажми «Позвать на помощь»: они подойдут, но в круг войти не смогут.',
    radius: 11.2, phi: 0.8, theta: 0, targetY: 0.8, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iC = '<b>Круг экзистенции.</b> «Это не отменяет твоего одиночества: ты проживаешь <b>одну жизнь</b> — свою, а не чью-то». Ответственность за себя нельзя переложить.';
      var ring = c.mesh(new T.TorusGeometry(1.6, 0.06, 8, 60), GOLD, iC, { emissive: GOLD, emissiveIntensity: 0.5 }); ring.rotation.x = Math.PI / 2; ring.position.y = 0.05;
      var me = person(c, 0, 0, BLUE, '<b>Я.</b> Кьеркегор осознал <b>богооставленность</b> человека: на что бы ты ни надеялся, выбирать и отвечать будешь сам.', null, 1.1);
      var others = [];
      for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; var p = person(c, Math.cos(a) * 5, Math.sin(a) * 5, [GREY, GREEN, PURPLE, ORANGE][i % 4], 'Другие люди: семья, друзья, учителя. Они могут быть рядом, но не могут <b>выбрать за тебя</b>.', null, 0.9); p.userData.a = a; others.push(p); }
      c.state = { r: 5, goal: 5 };
      c.onFrame(function (t) {
        var s = c.state; s.r += (s.goal - s.r) * 0.05;
        others.forEach(function (p) { p.position.set(Math.cos(p.userData.a) * s.r, 0, Math.sin(p.userData.a) * s.r); p.lookAt(0, 0, 0); });
        ring.scale.setScalar(1 + 0.03 * Math.sin(t * 3));
      });
    },
    chips: [
      { t: 'Позвать на помощь', on: function (c) { c.state.goal = 2.1; c.say('Люди подошли совсем близко — и остановились у границы. Поддержать можно, <b>прожить за тебя — нельзя</b>.'); } },
      { t: 'Отпустить', on: function (c) { c.state.goal = 5; c.say('Одиночество — не наказание, а условие свободы: только ты отвечаешь за свою жизнь.'); } }
    ]
  });
})();
