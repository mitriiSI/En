/* 3D-модели к конспекту «Фома Аквинский и схоластика» (13.10), движок HubScene3d.
   В Markdown: @@graph:foma-timeline3d@@ @@graph:foma-univ3d@@ @@graph:foma-method3d@@ @@graph:foma-faith3d@@
   @@graph:foma-universals3d@@ @@graph:foma-proofs3d@@ @@graph:foma-laws3d@@ @@graph:foma-state3d@@
   @@graph:foma-power3d@@ @@graph:foma-forms3d@@ @@graph:foma-body3d@@ @@graph:foma-ideas3d@@
   @@graph:foma-crusade3d@@ @@graph:foma-orders3d@@ @@graph:foma-americas3d@@ @@graph:foma-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var lab = c.label; c.label = function (t, pos, size, col) { return lab(t, pos, (size || 0.9) * 1.55, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function group(c, x, y, z) { var g = new c.THREE.Group(); g.position.set(x || 0, y || 0, z || 0); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  function person(c, x, z, col, info, h) {
    var T = c.THREE, g = group(c, x, 0, z); h = h || 1;
    into(g, c.mesh(new T.CylinderGeometry(0.26 * h, 0.36 * h, 1.05 * h, 12), col, info)).position.y = 0.53 * h;
    into(g, c.mesh(new T.SphereGeometry(0.25 * h, 14, 10), '#e8c6a0', info)).position.y = 1.3 * h;
    g.userData.info = info;
    return g;
  }
  function crown(c, g, y, s, info) {
    var T = c.THREE; s = s || 1;
    var r = into(g, c.mesh(new T.CylinderGeometry(0.32 * s, 0.28 * s, 0.22 * s, 16, 1, true), '#f0c36b', info, { metalness: 0.7, roughness: 0.25, side: T.DoubleSide })); r.position.y = y;
    for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; var p = into(g, c.mesh(new T.ConeGeometry(0.07 * s, 0.2 * s, 6), '#f0c36b', info, { metalness: 0.7 })); p.position.set(Math.sin(a) * 0.3 * s, y + 0.18 * s, Math.cos(a) * 0.3 * s); }
  }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ---------- 1. Лента времени ---------- */
  reg('foma-timeline3d', {
    title: 'Лента времени: Фома и его эпоха', lead: 'Спираль идёт снизу вверх по годам. Нажми на шар или кнопку.',
    radius: 22, phi: 1.0, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var E = [
        [1088, 'Болонский университет', '<b>1088</b> — по традиции год основания <b>Болонского</b> университета, старейшего в Европе. Сильнее всего там было право. <b>[ДОБАВЛЕНО]</b>', '#7aa2ff'],
        [1200, 'Парижский университет', '<b>Около 1200</b> — складывается <b>Парижский</b> университет: главный центр богословия и философии. Здесь учил Фома. <b>[ДОБАВЛЕНО]</b>', '#7aa2ff'],
        [1204, 'Разграбление Константинополя', '<b>1204</b> — крестоносцы <b>Четвёртого крестового похода</b> берут и грабят христианский Константинополь. Лектор приводил это как пример, что поход шёл ради богатства. Добыча уходит в Венецию.', '#ef6b5b'],
        [1225, 'Рождение Фомы', '<b>1225</b> — Фома родился в замке Роккасекка под Аквино (Южная Италия), в знатной семье. <b>[ДОБАВЛЕНО: место]</b>', '#f0c36b'],
        [1244, 'Доминиканец', '<b>1244</b> — вопреки семье вступает в нищенствующий орден <b>доминиканцев</b>. Родные держали его взаперти около года. <b>[ДОБАВЛЕНО]</b>', '#b07cff'],
        [1256, 'Магистр в Париже', '<b>1256</b> — магистр богословия Парижского университета. Учился у <b>Альберта Великого</b>. <b>[ДОБАВЛЕНО]</b>', '#b07cff'],
        [1265, '«Сумма теологии»', '<b>1265–1273</b> — главный труд, <b>«Сумма теологии»</b>. Осталась незаконченной. Рядом — «Сумма против язычников» и трактат «О правлении государей». <b>[ДОБАВЛЕНО]</b>', '#4fc3a1'],
        [1274, 'Смерть Фомы', '<b>1274</b> — умер по дороге на Лионский собор, около 49 лет.', '#f0c36b'],
        [1323, 'Канонизация', '<b>1323</b> — причислен к лику святых. С <b>1879</b> его учение (томизм) — официальная философия католической церкви. <b>[ДОБАВЛЕНО]</b>', '#4fc3a1']
      ];
      var balls = [];
      var pts = [];
      E.forEach(function (e, i) {
        var a = i * 0.8, r = 6, y = 0.6 + i * 0.75;
        var b = c.mesh(new T.SphereGeometry(e[0] === 1225 || e[0] === 1274 ? 0.7 : 0.5, 20, 14), e[3], e[2], { emissive: new T.Color(e[3]).multiplyScalar(0.15) });
        b.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
        c.label(e[0] + ' · ' + e[1], [Math.sin(a) * r, y + 1, Math.cos(a) * r], 0.5);
        balls.push(b); pts.push(new T.Vector3(Math.sin(a) * r, y, Math.cos(a) * r));
      });
      c.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 120, 0.08, 8), '#9aa3c0', 'Время идёт по спирали вверх.');
      var col = c.mesh(new T.CylinderGeometry(0.5, 0.7, 6.5, 20), '#e8e0cc', '<b>Фома Аквинский (1225–1274)</b>: «ангельский доктор», главный систематизатор схоластики.');
      col.position.y = 3.25;
      c.label('Фома', [0, 7.2, 0], 0.7, '#f0c36b');
      c.onFrame(function (t) { balls.forEach(function (b, i) { b.position.y = 0.6 + i * 0.75 + Math.sin(t * 2 + i) * 0.08; }); });
      c.state = { balls: balls };
    },
    chips: [
      { t: '1225–1274', small: 'жизнь', on: function (c) { c.setView(2.6, 1.0, 18, 2.5); c.pick(c.state.balls[3]); } },
      { t: '1265', small: '«Сумма теологии»', on: function (c) { c.setView(4.8, 0.95, 18, 5); c.pick(c.state.balls[6]); } },
      { t: '1204', small: 'крестоносцы', on: function (c) { c.setView(1.6, 1.0, 18, 2); c.pick(c.state.balls[2]); } }
    ]
  });

  /* ---------- 2. Средневековый университет ---------- */
  reg('foma-univ3d', {
    title: 'Как устроен средневековый университет', lead: 'Сначала все учатся на нижнем «артистическом» факультете, потом поднимаются на один из трёх высших. Переключай.',
    radius: 20, phi: 0.95, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(10, '#8a7f66');
      var base = c.mesh(new T.BoxGeometry(12, 1.6, 6), '#d9cfb4', '<b>Факультет свободных искусств</b> (артистический). Первые годы все учат <b>латынь</b>, грамматику, риторику, логику (тривиум) и арифметику, геометрию, астрономию, музыку (квадривиум). Лектор: без логики и философии дальше учиться просто невозможно.');
      base.position.y = 0.8;
      c.label('Свободные искусства + латынь', [0, 2.2, 3.4], 0.45);
      var F = [
        [-4, 'Богословие', '#b07cff', '<b>Теология</b> — высший, «царский» факультет. Здесь учил Фома.'],
        [0, 'Право', '#7aa2ff', '<b>Право</b> (римское и каноническое). Центр — Болонья.'],
        [4, 'Медицина', '#4fc3a1', '<b>Медицина</b>. Центры — Салерно и Монпелье. <b>[ДОБАВЛЕНО]</b>']
      ];
      var towers = [];
      F.forEach(function (f) {
        var t = c.mesh(new T.BoxGeometry(2.6, 3, 2.6), f[2], f[3]); t.position.set(f[0], 3.1, 0);
        var r = c.mesh(new T.ConeGeometry(2, 1.4, 4), '#bf5b4a', f[3]); r.position.set(f[0], 5.3, 0); r.rotation.y = Math.PI / 4;
        c.label(f[1], [f[0], 6.6, 0], 0.5);
        towers.push(t);
      });
      var books = [];
      for (var i = 0; i < 6; i++) { var bk = c.mesh(new T.BoxGeometry(0.8, 0.15, 0.6), ['#bf5b4a', '#7aa2ff', '#4fc3a1'][i % 3], '<b>Книги</b> — рукописные и дорогие. Доступ к библиотеке давал университет; читать нужно было на <b>латыни</b>.'); bk.position.set(-5 + i * 2, 1.7, 2.3); books.push(bk); }
      var st = [];
      for (var k = 0; k < 9; k++) st.push(person(c, -5 + (k % 9) * 1.2, 4.5, '#3d4a6b', '<b>Студенты</b> съезжались со всей Европы: общий язык — латынь, общий диплом признавали везде.', 0.6));
      c.state = { m: 0, st: st };
      c.onFrame(function (t) {
        st.forEach(function (p, k) {
          var target = c.state.m === 0 ? [-5 + k * 1.2, 0, 4.5] : [F[k % 3][0] + (Math.floor(k / 3) - 1) * 0.7, 4.6, 1.6];
          p.position.x = lerp(p.position.x, target[0], 0.04); p.position.y = lerp(p.position.y, target[1], 0.04); p.position.z = lerp(p.position.z, target[2], 0.04);
        });
        books.forEach(function (b, i) { b.rotation.y = Math.sin(t + i) * 0.3; });
      });
    },
    chips: [
      { t: 'Ступень 1', small: 'свободные искусства', on: function (c) { c.state.m = 0; c.setView(0.3, 0.95, 18, 1.5); c.say('Первые годы — общая подготовка: латынь, логика, философия. Это фундамент.'); } },
      { t: 'Ступень 2', small: 'высшие факультеты', on: function (c) { c.state.m = 1; c.setView(0.5, 0.8, 20, 3.5); c.say('Потом студент выбирает <b>богословие, право или медицину</b>.'); } }
    ]
  });

  /* ---------- 3. Схоластический метод ---------- */
  reg('foma-method3d', {
    title: 'Схоластический метод: лестница из 5 ступеней', lead: 'Так построена каждая статья «Суммы теологии» — и так же можно строить курсовую. Нажимай ступени по порядку.',
    radius: 18, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var S = [
        ['1. Вопрос', '#7aa2ff', '<b>1. Вопрос</b> (quaestio): чётко ставим проблему. Например: «Нужен ли человеку закон?»'],
        ['2. Возражения', '#ef6b5b', '<b>2. Возражения</b>: собираем все мнения <b>против</b> будущего ответа, честно и в полной силе. Лектор: это как обзор литературы в курсовой — все взгляды на проблему.'],
        ['3. Авторитеты', '#f0c36b', '<b>3. «Но против этого»</b> (sed contra): мнения авторитетов — Писание, Аристотель, отцы церкви. Лектор: это как первый параграф курсовой, где разобраны позиции по проблеме.'],
        ['4. Свой ответ', '#4fc3a1', '<b>4. Собственный ответ</b> (respondeo): решение автора. В курсовой это исследовательская часть.'],
        ['5. Ответы на возражения', '#7fb26a', '<b>5. Ответы на возражения</b>: опираясь на свой вывод, разбираем <b>каждое</b> возражение из шага 2. Поэтому метод научный: знание прирастает, а не просто пересказывается.']
      ];
      var steps = [];
      S.forEach(function (s, i) {
        var m = c.mesh(new T.BoxGeometry(3, 0.8 + i * 0.9, 3), s[1], s[2]);
        m.position.set(-5.6 + i * 2.8, (0.8 + i * 0.9) / 2, 0);
        c.label(s[0], [-5.6 + i * 2.8, 1.4 + i * 0.9, 0], 0.42);
        steps.push(m);
      });
      var obj = [];
      for (var k = 0; k < 4; k++) { var o = c.mesh(new T.OctahedronGeometry(0.3), '#ef6b5b', 'Возражение: ещё одно мнение против. Его нельзя пропустить.'); obj.push(o); }
      var bulb = c.mesh(new T.SphereGeometry(0.6, 20, 14), '#ffffff', '<b>Новое знание</b>: вывод, который выдержал все возражения.', { emissive: new T.Color('#665a20') });
      var walker = person(c, -5.6, 0,'#3d4a6b', 'Исследователь поднимается по ступеням метода.', 0.7);
      c.state = { k: 0 };
      c.onFrame(function (t) {
        var k = c.state.k;
        var tx = -5.6 + k * 2.8, ty = 0.8 + k * 0.9;
        walker.position.x = lerp(walker.position.x, tx, 0.06); walker.position.y = lerp(walker.position.y, ty, 0.06);
        obj.forEach(function (o, i) {
          var a = t + i * Math.PI / 2, gone = k >= 4;
          o.position.set(-2.8 + Math.cos(a) * 1.2, (gone ? 0.3 : 3) + Math.sin(a * 2) * 0.3, Math.sin(a) * 1.2 + 2);
          o.visible = k >= 1; o.rotation.y = t * 2; o.material.color.set(gone ? '#4a5a4a' : '#ef6b5b');
        });
        bulb.visible = k >= 3; bulb.position.set(k >= 4 ? 5.6 : 2.8, 5.8 + Math.sin(t * 2) * 0.2, 0);
      });
      c.state.steps = steps;
    },
    onPick: function (obj, c) { var i = c.state.steps.indexOf(obj); if (i >= 0) c.state.k = i; },
    chips: [
      { t: 'Вопрос', on: function (c) { c.state.k = 0; c.pick(c.state.steps[0]); } },
      { t: 'Возражения', on: function (c) { c.state.k = 1; c.pick(c.state.steps[1]); } },
      { t: 'Авторитеты', on: function (c) { c.state.k = 2; c.pick(c.state.steps[2]); } },
      { t: 'Свой ответ', on: function (c) { c.state.k = 3; c.pick(c.state.steps[3]); } },
      { t: 'Разбор', small: 'возражений', on: function (c) { c.state.k = 4; c.pick(c.state.steps[4]); } }
    ]
  });

  /* ---------- 4. Вера и разум ---------- */
  reg('foma-faith3d', {
    title: 'Вера и разум: две дороги на одну гору', lead: 'Разум (философия) и откровение (теология) ведут к одной истине. Переключай дороги.',
    radius: 20, phi: 0.9, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(10, '#5e7a4a');
      var mount = c.mesh(new T.ConeGeometry(5, 8, 7), '#9aa3b5', '<b>Гора истины</b>. Истина одна, поэтому вера и разум не могут противоречить друг другу.', { flatShading: true });
      mount.position.y = 4;
      var top = c.mesh(new T.SphereGeometry(0.7, 20, 14), '#f0c36b', '<b>Бог — высшая истина</b>. Часть истин о нём разум может доказать (что Бог есть), часть дана только откровением (Троица).', { emissive: new T.Color('#5a4410') });
      top.position.y = 8.5;
      function road(sign, col, info) {
        var pts = []; for (var i = 0; i <= 40; i++) { var k = i / 40, a = sign * k * Math.PI * 2.2, r = 5.3 * (1 - k) + 0.6; pts.push(new T.Vector3(Math.sin(a) * r, 0.2 + k * 8, Math.cos(a) * r)); }
        var cur = new T.CatmullRomCurve3(pts);
        var m = c.mesh(new T.TubeGeometry(cur, 160, 0.16, 8), col, info); return { m: m, cur: cur };
      }
      var R = road(1, '#7aa2ff', '<b>Дорога разума — философия.</b> Опирается на природные способности человека и опыт, её выводы можно проверить. Лектор: разум не ослаблен грехом, им можно и нужно пользоваться.');
      var F = road(-1, '#b07cff', '<b>Дорога веры — теология.</b> Опирается на откровение (Писание). Ведёт к истинам, недоступным разуму.');
      var a = c.mesh(new T.SphereGeometry(0.35, 14, 10), '#7aa2ff', 'Философ идёт путём разума.');
      var b = c.mesh(new T.SphereGeometry(0.35, 14, 10), '#b07cff', 'Богослов идёт путём веры.');
      c.label('Разум', [5.5, 1.2, 1], 0.55, '#9fc0ff'); c.label('Вера', [-5.5, 1.2, 1], 0.55, '#d6b3ff');
      c.state = { R: R, F: F, show: 2 };
      c.onFrame(function (t) {
        var k = (t * 0.07) % 1;
        var p1 = R.cur.getPoint(k), p2 = F.cur.getPoint(k);
        a.position.set(p1.x, p1.y + 0.35, p1.z); b.position.set(p2.x, p2.y + 0.35, p2.z);
        a.visible = R.m.visible = c.state.show !== 1; b.visible = F.m.visible = c.state.show !== 0;
      });
    },
    chips: [
      { t: 'Разум', small: 'философия', on: function (c) { c.state.show = 0; c.pick(c.state.R.m); } },
      { t: 'Вера', small: 'теология', on: function (c) { c.state.show = 1; c.pick(c.state.F.m); } },
      { t: 'Вместе', small: 'гармония', on: function (c) { c.state.show = 2; c.setView(0.4, 0.8, 20, 4); c.say('<b>Гармония веры и разума</b> — главный принцип Фомы. Философия — «служанка богословия», но служанка с собственными ногами.'); } }
    ]
  });

  /* ---------- 5. Спор об универсалиях ---------- */
  reg('foma-universals3d', {
    title: 'Где живёт «человек вообще»? Спор об универсалиях', lead: 'Универсалия — общее понятие («человек», «стол»). Три ответа на вопрос, где оно существует.',
    radius: 18, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var idea = c.mesh(new T.IcosahedronGeometry(1, 0), '#f0c36b', '<b>Универсалия «человек»</b> — общая сущность всех людей.', { emissive: new T.Color('#4a3a10'), flatShading: true });
      var men = [];
      for (var i = 0; i < 5; i++) men.push(person(c, -4 + i * 2, 1.5, ['#7aa2ff', '#ef6b5b', '#4fc3a1', '#b07cff', '#e0915a'][i], 'Конкретный человек: Пётр, Мария, Иван… Материальное воплощение.', 1.1));
      var cores = men.map(function (m) { var s = c.mesh(new T.IcosahedronGeometry(0.22, 0), '#f0c36b', '<b>Умеренный реализм Фомы</b>: общее существует <b>в самих вещах</b> — в каждом человеке есть «человечность».', { emissive: new T.Color('#6a5010') }); return s; });
      var head = c.mesh(new T.SphereGeometry(0.9, 18, 12), '#e8c6a0', '<b>Номинализм</b>: общие понятия — только слова (nomen — «имя») в нашей голове.');
      var word = c.label('«человек» — только слово', [0, 0, 0], 0.4);
      c.state = { m: 1 };
      c.onFrame(function (t) {
        var m = c.state.m;
        idea.visible = m === 0; idea.position.set(0, 6 + Math.sin(t) * 0.2, 0); idea.rotation.y = t * 0.6;
        cores.forEach(function (s, i) { s.visible = m === 1; s.position.set(men[i].position.x, 1.2, men[i].position.z + 0.4); s.rotation.y = t * 2; });
        head.visible = m === 2; head.position.set(0, 5, -2); word.visible = m === 2; word.position.set(0, 6.4, -2);
      });
    },
    chips: [
      { t: 'Реализм', small: 'до вещей (Платон)', on: function (c) { c.state.m = 0; c.setView(0.2, 1.1, 18, 3); c.say('<b>Крайний реализм</b> (от Платона): общее существует <b>до вещей</b>, отдельно, в мире идей. Сначала идея, потом материальное.'); } },
      { t: 'Фома', small: 'в вещах', on: function (c) { c.state.m = 1; c.setView(0.2, 0.9, 14, 1); c.say('<b>Умеренный реализм Фомы</b> (от Аристотеля): общее реально, но существует <b>в самих вещах</b>. Идея и материя связаны и зависят друг от друга. В уме Бога — до вещей, в мире — в вещах, в нашем уме — после вещей.'); } },
      { t: 'Номинализм', small: 'после вещей', on: function (c) { c.state.m = 2; c.setView(0.2, 1.0, 16, 3); c.say('<b>Номинализм</b> (позже — Оккам): реальны только отдельные вещи, а общее — лишь <b>имя</b>. <b>[ДОБАВЛЕНО]</b>'); } }
    ]
  });

  /* ---------- 6. Пять доказательств бытия Бога ---------- */
  reg('foma-proofs3d', {
    title: 'Пять путей к Богу', lead: 'Пять доказательств Фомы. Каждое идёт от мира, который мы видим, к его первопричине. Нажми на путь.',
    radius: 22, phi: 0.95, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(11);
      var god = c.mesh(new T.SphereGeometry(1.2, 28, 18), '#f0c36b', '<b>Бог</b> — первый двигатель, первая причина, необходимое бытие, высшее совершенство и разумный устроитель.', { emissive: new T.Color('#6a5010') });
      god.position.y = 3.5;
      var objs = [], P = [
        ['1. Движение', '#7aa2ff', '<b>1. От движения.</b> Всё движущееся движимо чем-то другим. Цепочка не может уходить в бесконечность — значит, есть <b>первый двигатель</b>, сам неподвижный. Движение переходит из возможности в действительность.'],
        ['2. Причина', '#ef6b5b', '<b>2. От причины.</b> У всего есть причина, у причины — своя причина… Нужна <b>первая причина</b>, которая сама ничем не вызвана.'],
        ['3. Необходимость', '#4fc3a1', '<b>3. От возможности и необходимости.</b> Всё вокруг может быть, а может и не быть. Если бы всё существовало лишь «по возможности», однажды не было бы ничего. Значит, есть бытие <b>необходимое</b>, независимое ни от чего. Лектор: вероятность, что такой сложный мир сложился случайно, стремится к нулю — как если бы на свалке ветер сам собрал новейший самолёт.'],
        ['4. Степени', '#b07cff', '<b>4. От степеней совершенства.</b> Мы сравниваем: лучше, хуже, благороднее. Значит, есть мерило — <b>абсолютное совершенство</b>, источник всех ценностей.'],
        ['5. Цель', '#e0915a', '<b>5. От цели (от устройства мира).</b> Природа слепа, но действует разумно и целесообразно, как стрела, которую направил лучник. Значит, есть <b>разумный устроитель</b>. Лектор вспомнил Булгакова («Мастер и Маргарита»): без плана, составленного не человеком, сложное государство рассыпалось бы — у каждого, даже у правителя, лишь фрагмент информации.']
      ];
      P.forEach(function (p, i) {
        var a = i / 5 * Math.PI * 2, r = 8;
        var g = group(c, Math.sin(a) * r, 0, Math.cos(a) * r);
        var m;
        if (i === 0) { m = into(g, c.mesh(new T.TorusGeometry(0.8, 0.25, 10, 8), p[1], p[2])); m.position.y = 1.2; }
        else if (i === 1) { for (var d = 0; d < 4; d++) { var dm = into(g, c.mesh(new T.BoxGeometry(0.25, 1.4, 0.8), p[1], p[2])); dm.position.set(-1 + d * 0.65, 0.7, 0); } m = g.children[0]; }
        else if (i === 2) { m = into(g, c.mesh(new T.BoxGeometry(1.4, 1.4, 1.4), p[1], p[2])); m.position.y = 0.7; }
        else if (i === 3) { for (var s = 0; s < 4; s++) { var sm = into(g, c.mesh(new T.BoxGeometry(0.5, 0.4 + s * 0.5, 0.5), p[1], p[2])); sm.position.set(-0.9 + s * 0.6, (0.4 + s * 0.5) / 2, 0); } m = g.children[3]; }
        else { var arrow = into(g, c.mesh(new T.ConeGeometry(0.3, 1, 10), p[1], p[2])); arrow.rotation.z = -Math.PI / 2; arrow.position.y = 1.2; m = arrow; into(g, c.mesh(new T.CylinderGeometry(0.06, 0.06, 2, 6), p[1], p[2])).rotation.z = Math.PI / 2; g.children[1].position.set(-1, 1.2, 0); }
        g.lookAt(0, 0, 0);
        c.label(p[0], [Math.sin(a) * r, 3, Math.cos(a) * r], 0.5);
        c.link([Math.sin(a) * (r - 1.2), 1.2, Math.cos(a) * (r - 1.2)], [Math.sin(a) * 1.3, 3.3, Math.cos(a) * 1.3], '#f0c36b', 0.05, p[2]);
        g.userData.info = p[2];
        objs.push({ g: g, m: m, i: i });
      });
      c.state = { objs: objs };
      c.onFrame(function (t) {
        god.scale.setScalar(1 + Math.sin(t * 2) * 0.04);
        objs[0].m.rotation.z = t; objs[2].m.rotation.y = t * 0.5;
        var dm = objs[1].g.children; for (var d = 0; d < 4; d++) dm[d].rotation.z = Math.max(0, Math.min(1.2, Math.sin(t - d * 0.4) * 1.5)) * -1;
      });
    },
    chips: [
      { t: '1', small: 'движение', on: function (c) { c.setView(0, 0.9, 18, 1.5); c.pick(c.state.objs[0].m); } },
      { t: '2', small: 'причина', on: function (c) { c.setView(1.25, 0.9, 18, 1.5); c.pick(c.state.objs[1].m); } },
      { t: '3', small: 'необходимость', on: function (c) { c.setView(2.5, 0.9, 18, 1.5); c.pick(c.state.objs[2].m); } },
      { t: '4', small: 'степени', on: function (c) { c.setView(3.77, 0.9, 18, 1.5); c.pick(c.state.objs[3].m); } },
      { t: '5', small: 'цель', on: function (c) { c.setView(5.03, 0.9, 18, 1.5); c.pick(c.state.objs[4].m); } }
    ]
  });

  /* ---------- 7. Четыре вида законов ---------- */
  reg('foma-laws3d', {
    title: 'Пирамида законов Фомы', lead: 'Четыре уровня. Каждый нижний должен опираться на верхний. Нажми на уровень.',
    radius: 18, phi: 1.0, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var L = [
        ['Человеческий закон', '#7aa2ff', 6, '<b>4. Человеческий (позитивный) закон</b> — законы государства. Регулирует отношения между людьми. Должен опираться на все верхние уровни. Если он противоречит естественному закону, это уже не закон, а «извращение закона». <b>[ДОБАВЛЕНО: формулировка]</b>'],
        ['Естественный закон', '#4fc3a1', 4.6, '<b>3. Естественный закон</b> — та часть вечного закона, которую человек постигает <b>разумом</b>. Он заложен в природе: сохранять жизнь, продолжать род, жить в обществе, искать истину. Отсюда идея прав, с которыми человек рождается (на жизнь, на свободу).'],
        ['Божественный закон', '#b07cff', 3.2, '<b>2. Божественный закон</b> — данный в откровении, в Священном Писании (Ветхий и Новый Завет). Ведёт человека к вечному блаженству. Лектор: многое зависит от перевода — как текст читают, так его и понимают.'],
        ['Вечный закон', '#f0c36b', 1.8, '<b>1. Вечный закон</b> — замысел Бога, по которому устроен весь мир. Лектор сравнил его с <b>физическими законами и константами</b>: скорость света была такой и миллиард лет назад, и человек не может её изменить.']
      ];
      var lv = [];
      L.forEach(function (l, i) {
        var m = c.mesh(new T.CylinderGeometry(l[2] * 0.55, l[2] * 0.6, 1.2, 6), l[1], l[3]);
        m.position.y = 0.6 + i * 1.3; lv.push(m);
        c.label(l[0], [l[2] * 0.62 + 1.6, 0.8 + i * 1.3, 0], 0.42);
      });
      var star = c.mesh(new T.OctahedronGeometry(0.6), '#ffffff', 'Источник всех законов — Бог.', { emissive: new T.Color('#666633') });
      star.position.y = 6.4;
      c.state = { lv: lv, f: -1 };
      c.onFrame(function (t) {
        star.rotation.y = t;
        lv.forEach(function (m, i) { var tgt = c.state.f === i ? 1.12 : 1; m.scale.x = m.scale.z = lerp(m.scale.x, tgt, 0.1); m.rotation.y = t * 0.1 * (i % 2 ? 1 : -1); });
      });
    },
    onPick: function (obj, c) { c.state.f = c.state.lv.indexOf(obj); },
    chips: [
      { t: 'Вечный', on: function (c) { c.state.f = 3; c.pick(c.state.lv[3]); } },
      { t: 'Божественный', on: function (c) { c.state.f = 2; c.pick(c.state.lv[2]); } },
      { t: 'Естественный', on: function (c) { c.state.f = 1; c.pick(c.state.lv[1]); } },
      { t: 'Человеческий', on: function (c) { c.state.f = 0; c.pick(c.state.lv[0]); } }
    ]
  });

  /* ---------- 8. Государство и общее благо ---------- */
  reg('foma-state3d', {
    title: 'Государство: несовершенная копия идеала', lead: 'Над миром — идеальная «форма» государства в замысле Бога. Под ней — бесконечная череда реальных, несовершенных воплощений.',
    radius: 20, phi: 1.0, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var ideal = c.mesh(new T.DodecahedronGeometry(1.4, 0), '#f0c36b', '<b>Идеал государства</b> — универсалия в замысле Бога. Государство создано по природе и по замыслу, а значит, не может быть <b>абсолютным злом</b> (в отличие от «вынужденного зла» у Августина).', { emissive: new T.Color('#5a4410'), flatShading: true });
      ideal.position.y = 7.5;
      var copies = [], C = ['#7aa2ff', '#ef6b5b', '#4fc3a1', '#b07cff', '#e0915a', '#9aa3c0', '#7fb26a'];
      for (var i = 0; i < 7; i++) {
        var a = i / 7 * Math.PI * 2;
        var m = c.mesh(new T.DodecahedronGeometry(0.8, 0), C[i], '<b>Реальное государство</b> — материальное и потому несовершенное воплощение идеала. Лектор: даже самый способный человек не идеален; так и государство — бесконечная череда форм и систем.', { flatShading: true });
        m.position.set(Math.sin(a) * 6, 1, Math.cos(a) * 6);
        m.scale.set(1 + (i % 3) * 0.2, 0.6 + (i % 2) * 0.4, 1 - (i % 3) * 0.15);
        c.link([Math.sin(a) * 6, 1.6, Math.cos(a) * 6], [0, 7, 0], '#f0c36b', 0.03, 'Каждое государство тянется к идеалу, но никогда его не достигает.');
        copies.push(m);
      }
      var good = c.mesh(new T.TorusGeometry(2.4, 0.18, 12, 48), '#4fc3a1', '<b>Цель государства — общее благо</b>: организовать жизнь людей на основе <b>неповреждённого разума</b> и <b>справедливости</b>.');
      good.position.y = 4; good.rotation.x = Math.PI / 2;
      c.label('Общее благо', [0, 4.9, 0], 0.5, '#8fe0c5');
      c.onFrame(function (t) { ideal.rotation.y = t * 0.4; copies.forEach(function (m, i) { m.rotation.y = t * 0.3 + i; }); good.rotation.z = t * 0.2; });
    },
    chips: [
      { t: 'Идеал', on: function (c) { c.setView(0.4, 0.7, 14, 7); c.say('Государство — от Бога и по природе человека: человек — существо общественное. Значит, оно <b>не абсолютное зло</b>.'); } },
      { t: 'Реальность', on: function (c) { c.setView(0.4, 1.1, 18, 1); c.say('Все реальные государства — <b>несовершенные материальные формы</b> одной идеи.'); } },
      { t: 'Цель', on: function (c) { c.setView(0.4, 0.9, 14, 4); c.say('<b>Общее благо</b> — главная задача власти. Справедливость вытекает из природы человека, но без Бога её трудно построить. Начинать справедливость нужно с себя.'); } }
    ]
  });

  /* ---------- 9. Три элемента власти ---------- */
  reg('foma-power3d', {
    title: 'Три элемента власти: сущность, происхождение, использование', lead: 'Фома разбирает власть на три части. Сущность всегда от Бога, а вот получить и использовать власть можно плохо. Переключай случаи.',
    radius: 18, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var K = [
        ['Сущность', '#f0c36b', '<b>Сущность власти</b> — сам порядок господства и подчинения. Он установлен Богом, поэтому сам по себе всегда благ.'],
        ['Происхождение', '#7aa2ff', '<b>Происхождение</b> — как власть получена: законно (по праву, выборами, наследованием) или нет (захват, обман).'],
        ['Использование', '#4fc3a1', '<b>Использование</b> — как правитель ею пользуется: ради общего блага или ради себя.']
      ];
      var pil = [];
      K.forEach(function (k, i) {
        var m = c.mesh(new T.CylinderGeometry(0.8, 0.9, 4, 20), k[1], k[2]); m.position.set(-4 + i * 4, 2, 0); pil.push(m);
        c.label(k[0], [-4 + i * 4, 4.9, 0], 0.5);
      });
      var roof = c.mesh(new T.BoxGeometry(11, 0.5, 2.4), '#d9cfb4', '<b>Власть</b> держится на трёх опорах.'); roof.position.y = 4.25;
      var king = person(c, 0, 0, '#bf5b4a', 'Правитель.', 1); king.position.y = 4.5; crown(c, king, 1.6, 1, 'Правитель.');
      c.state = { mode: 0, pil: pil };
      c.onFrame(function (t) {
        var md = c.state.mode;
        var bad1 = md === 1 || md === 3, bad2 = md === 2 || md === 3;
        pil[1].material.color.set(bad1 ? '#6b3030' : '#7aa2ff'); pil[2].material.color.set(bad2 ? '#6b3030' : '#4fc3a1');
        var tilt = (bad1 ? 0.08 : 0) + (bad2 ? 0.12 : 0);
        roof.rotation.z = lerp(roof.rotation.z, -tilt + Math.sin(t * 3) * tilt * 0.2, 0.08);
        king.rotation.z = roof.rotation.z; king.position.x = roof.rotation.z * -6;
      });
    },
    chips: [
      { t: 'Всё законно', on: function (c) { c.state.mode = 0; c.say('Власть получена законно и служит общему благу — <b>подчиняться нужно</b>.'); } },
      { t: 'Захвачена', small: 'но правит хорошо', on: function (c) { c.state.mode = 1; c.say('Власть <b>получена неправильно</b>, но используется правильно. Фома: её можно признать, особенно если потом её узаконили. <b>[ДОБАВЛЕНО: уточнено по «Сумме теологии»]</b>'); } },
      { t: 'Злоупотребляет', on: function (c) { c.state.mode = 2; c.say('Власть законная, но <b>используется во зло</b>. Приказам, которые противоречат Божьему закону, подчиняться нельзя.'); } },
      { t: 'Тиран', on: function (c) { c.state.mode = 3; c.say('Власть и захвачена, и используется во зло — это <b>тирания</b>. Народ вправе сопротивляться тирану (через законные органы), а не каждый по своему усмотрению. <b>[ДОБАВЛЕНО: детали из «О правлении государей»]</b>'); } }
    ]
  });

  /* ---------- 10. Шесть форм правления ---------- */
  reg('foma-forms3d', {
    title: 'Шесть форм правления (по Аристотелю и Фоме)', lead: 'Слева — правильные формы (служат общему благу), справа — их искажения. Высота башен — сколько человек правит.',
    radius: 22, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(11);
      var F = [
        ['Монархия', 1, '#f0c36b', '<b>Монархия</b> — правит один ради общего блага. Лучшая форма по Фоме.'],
        ['Аристократия', 3, '#7aa2ff', '<b>Аристократия</b> — правят немногие лучшие ради общего блага.'],
        ['Полития', 7, '#4fc3a1', '<b>Полития</b> — правит большинство ради общего блага.'],
        ['Тирания', 1, '#6b3030', '<b>Тирания</b> — один правит ради себя. Худшая форма: искажение лучшей.'],
        ['Олигархия', 3, '#7a4040', '<b>Олигархия</b> — немногие богатые правят ради своей выгоды.'],
        ['Демократия', 7, '#8a5050', '<b>Демократия</b> (в смысле Аристотеля и Фомы) — толпа бедных правит в своих интересах, подавляя остальных.']
      ];
      var cols = [];
      F.forEach(function (f, i) {
        var side = i < 3 ? -1 : 1, row = i % 3;
        var x = side * 4.5, z = -4 + row * 4;
        var base = c.mesh(new T.BoxGeometry(3.4, 0.4, 3), f[2], f[3]); base.position.set(x, 0.2, z);
        for (var p = 0; p < f[1]; p++) { var a = p / f[1] * Math.PI * 2, rr = f[1] > 1 ? 1 : 0; var pp = person(c, x + Math.sin(a) * rr, z + Math.cos(a) * rr, f[2], f[3], 0.7); pp.position.y = 0.4; if (f[1] === 1) crown(c, pp, 1.2, 0.8, f[3]); }
        c.label(f[0], [x, 2.6, z], 0.45, i < 3 ? '#cfe2ff' : '#ffb3b3');
        cols.push(base);
      });
      c.label('Правильные', [-4.5, 4, -6.5], 0.55, '#8fe0c5'); c.label('Неправильные', [4.5, 4, -6.5], 0.55, '#ff9a8a');
      var wall = c.mesh(new T.BoxGeometry(0.2, 2, 12), '#9aa3c0', 'Граница: <b>ради общего блага</b> или <b>ради себя</b>.'); wall.position.y = 1;
      c.state = { cols: cols };
    },
    chips: [
      { t: 'Лучшая', small: 'монархия', on: function (c) { c.setView(-0.6, 0.9, 14, 1, -4.5, -4); c.pick(c.state.cols[0]); } },
      { t: 'Худшая', small: 'тирания', on: function (c) { c.setView(0.6, 0.9, 14, 1, 4.5, -4); c.pick(c.state.cols[3]); } },
      { t: 'Все шесть', on: function (c) { c.setView(0, 1.0, 22, 1, 0, 0); c.say('Критерий: власть служит <b>общему благу</b> (слева) или <b>интересам правящих</b> (справа). Число правителей — второй признак.'); } }
    ]
  });

  /* ---------- 11. Монархия как организм ---------- */
  reg('foma-body3d', {
    title: 'Почему монархия лучше: одна голова, одно солнце', lead: 'Фома ищет образец единства в природе и в мироздании. Переключай аналогии.',
    radius: 18, phi: 1.0, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var body = group(c, -3.5, 0, 0);
      var BI = '<b>Организм</b>: много органов, но одна голова (у Фомы — одно сердце) управляет телом. Так и государством лучше управлять одному.';
      into(body, c.mesh(new T.CylinderGeometry(0.9, 1.1, 3, 16), '#e8c6a0', BI)).position.y = 2.5;
      var hd = into(body, c.mesh(new T.SphereGeometry(0.75, 20, 14), '#f0c36b', '<b>Голова</b> — правитель: принимает решения за всё тело.', { emissive: new T.Color('#3a2a08') })); hd.position.y = 4.7;
      [[-1.3, 3, 0.4], [1.3, 3, -0.4], [-0.5, 0.5, 0], [0.5, 0.5, 0]].forEach(function (p, i) { var l = into(body, c.mesh(new T.CylinderGeometry(0.25, 0.25, 2.2, 10), '#e8c6a0', 'Части тела (сословия) выполняют каждая свою работу.')); l.position.set(p[0], p[1] + (i < 2 ? 0 : 0.6), 0); l.rotation.z = p[2]; });
      var sys = group(c, 3.5, 3, 0);
      var sun = into(sys, c.mesh(new T.SphereGeometry(0.9, 24, 16), '#f0c36b', '<b>Мироздание</b>: один Бог управляет всем миром. Монархия повторяет этот порядок: один правитель на земле.', { emissive: new T.Color('#7a5a10') }));
      var pl = []; for (var i = 0; i < 4; i++) { var p = into(sys, c.mesh(new T.SphereGeometry(0.28, 14, 10), ['#7aa2ff', '#4fc3a1', '#ef6b5b', '#b07cff'][i], 'Всё в мире движется вокруг одного центра.')); pl.push(p); }
      var bees = group(c, 0, 0, 4);
      var hive = into(bees, c.mesh(new T.SphereGeometry(0.9, 14, 10), '#e0b050', '<b>Пчёлы</b>: у роя одна матка (у Фомы — «царь пчёл»). Так и в природе единоначалие. <b>[ДОБАВЛЕНО: пример из «О правлении государей»]</b>')); hive.position.y = 1; hive.scale.y = 1.3;
      c.label('Тело', [-3.5, 6, 0], 0.5); c.label('Мироздание', [3.5, 5, 0], 0.5); c.label('Улей', [0, 2.8, 4], 0.45);
      c.onFrame(function (t) { pl.forEach(function (p, i) { var a = t * (0.8 - i * 0.12) + i * 1.5, r = 1.6 + i * 0.6; p.position.set(Math.cos(a) * r, Math.sin(a * 0.5) * 0.2, Math.sin(a) * r); }); hd.position.y = 4.7 + Math.sin(t * 2) * 0.05; });
    },
    chips: [
      { t: 'Тело', on: function (c) { c.setView(-0.4, 0.95, 12, 2.5, -3.5, 0); c.say('В теле много органов, но одна голова. Без неё — разлад.'); } },
      { t: 'Мироздание', on: function (c) { c.setView(0.6, 0.9, 12, 3, 3.5, 0); c.say('Один Бог правит миром → один правитель в государстве. <b>Монархия ближе всего к божественному порядку.</b>'); } },
      { t: 'Ограничения', on: function (c) { c.setView(0, 1.0, 18, 2, 0, 0); c.say('Но монарх у Фомы <b>ограничен</b>: законами, божественным законом и церковью. В духовных делах он ниже папы. Лучшая — <b>смешанная</b> форма: монарх + знать + представители народа. <b>[ДОБАВЛЕНО: о смешанной форме]</b>'); } }
    ]
  });

  /* ---------- 12. Как распространяются идеи ---------- */
  reg('foma-ideas3d', {
    title: 'Идея без тиража — не сила', lead: 'Лектор: любое новое учение нуждается в тиражировании и в людях, которые его несут. Посмотри, как одна книга превращается в сеть.',
    radius: 20, phi: 0.9, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var press = c.mesh(new T.BoxGeometry(1.6, 1.6, 1.6), '#9aa3c0', '<b>Печатный станок</b> (Гутенберг, около 1450). Первые книги печатали с благословения церкви, а светская печать стала для Европы выходом за прежние рамки. Переводы Библии на родные языки — один из двигателей Реформации. <b>[ДОБАВЛЕНО: даты]</b>');
      press.position.y = 0.8;
      var nodes = [], links = [];
      for (var i = 0; i < 24; i++) {
        var ring = i < 6 ? 3 : i < 14 ? 5.5 : 8, a = i * 2.4;
        var n = c.mesh(new T.BoxGeometry(0.5, 0.15, 0.35), ['#bf5b4a', '#7aa2ff', '#4fc3a1'][i % 3], 'Книга (или газета) попадает в новый город. Вокруг неё собираются люди, которые несут идею дальше.');
        n.position.set(Math.cos(a) * ring, 0.2, Math.sin(a) * ring); n.visible = false; nodes.push(n);
      }
      c.state = { k: 0, nodes: nodes };
      c.onFrame(function (t) {
        var shown = Math.min(24, Math.floor(c.state.k));
        nodes.forEach(function (n, i) { n.visible = i < shown; n.position.y = 0.2 + (i < shown ? Math.abs(Math.sin(t * 2 + i)) * 0.2 : 0); });
        if (c.state.run && c.state.k < 24) c.state.k += 0.05;
        press.position.y = 0.8 + Math.abs(Math.sin(t * 4)) * 0.05 * (c.state.run ? 1 : 0);
      });
    },
    chips: [
      { t: 'Печатать', small: 'запустить', on: function (c) { c.state.k = 0; c.state.run = true; c.setView(0.4, 1.0, 20, 0); c.say('Тираж расходится по городам. Лектор привёл пример: в 1900–1917 годах ленинская газета развозилась по регионам, и вокруг неё складывались партийные ячейки. <b>Идея, которую никто не несёт, не становится движущей силой истории.</b>'); } },
      { t: 'Фома', small: 'и Рим', on: function (c) { c.state.k = 24; c.setView(0.4, 0.8, 16, 0); c.say('Учение Фомы поддержал <b>Рим</b>: оно решало задачу <b>примирить новую науку</b> (Аристотеля) с верой церкви и тем укрепить её учение.'); } }
    ]
  });

  /* ---------- 13. Крестовые походы и Венеция ---------- */
  reg('foma-crusade3d', {
    title: 'Четвёртый крестовый поход: богатство вместо веры', lead: 'Венецианский флот везёт крестоносцев не в Иерусалим, а в Константинополь. Запусти поход.',
    radius: 24, phi: 0.85, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(22, 0.3, 14), '#3b6ea8', 'Средиземное море.', { roughness: 0.4 }).position.y = -0.3;
      c.mesh(new T.BoxGeometry(8, 0.5, 4), '#7fb26a', 'Западная Европа.').position.set(-6, 0, -5);
      c.mesh(new T.BoxGeometry(2.4, 0.5, 6), '#7fb26a', 'Италия.').position.set(-2.5, 0, -1);
      c.mesh(new T.BoxGeometry(8, 0.5, 4), '#d8c48a', 'Малая Азия.').position.set(7, 0, -1);
      c.mesh(new T.BoxGeometry(4, 0.5, 3), '#d8c48a', 'Святая земля.').position.set(8, 0, 4.5);
      function city(x, z, col, name, info) { var m = c.mesh(new T.CylinderGeometry(0.5, 0.6, 1.4, 12), col, info); m.position.set(x, 0.9, z); c.label(name, [x, 2.3, z], 0.5); return m; }
      var ven = city(-2, -3.5, '#4fc3a1', 'Венеция', '<b>Венеция</b> — торговая республика. Она построила флот для похода и получила главную выгоду: добычу, торговые привилегии и опорные пункты. Многие сокровища Константинополя и сейчас в Венеции.');
      var con = city(3, -2.4, '#f0c36b', 'Константинополь', '<b>Константинополь</b> — столица православной Византии. В <b>1204</b> году его взяли и разграбили <b>христиане-крестоносцы</b>. Подорваны экономика и авторитет города; в 1453 он пал под ударом турок. Лектор: это нарушение естественного права — христианин грабит христианина без причины.');
      var jer = city(8, 4.5, '#b07cff', 'Иерусалим', '<b>Иерусалим</b> — официальная цель крестовых походов. В 1204 году до него так и не дошли.');
      var fleet = [];
      for (var i = 0; i < 6; i++) { var sh = group(c, -2, 0.2, -3); into(sh, c.mesh(new T.BoxGeometry(0.9, 0.3, 0.35), '#6b4a2a', 'Корабли венецианцев с крестоносцами.')); var s = into(sh, c.mesh(new T.BoxGeometry(0.05, 0.6, 0.5), '#f3efe6', 'Корабли венецианцев с крестоносцами.')); s.position.y = 0.45; fleet.push(sh); }
      var cur = new T.CatmullRomCurve3([new T.Vector3(-2, 0.2, -3), new T.Vector3(-1, 0.2, 1), new T.Vector3(1.5, 0.2, 3), new T.Vector3(3.5, 0.2, 1), new T.Vector3(3, 0.2, -1.6)]);
      c.mesh(new T.TubeGeometry(cur, 60, 0.05, 6), '#ef6b5b', 'Реальный маршрут 1202–1204.');
      var gold = [];
      for (var g = 0; g < 8; g++) gold.push(c.mesh(new T.BoxGeometry(0.3, 0.2, 0.2), '#f0c36b', 'Добыча из Константинополя уходит в Венецию.', { metalness: 0.8, roughness: 0.2 }));
      c.state = { run: 0, t0: 0 };
      c.onFrame(function (t) {
        var k = c.state.run ? Math.min(1, (t - c.state.t0) * 0.12) : 0;
        fleet.forEach(function (sh, i) { var kk = Math.max(0, k - i * 0.03); var p = cur.getPoint(kk); sh.position.set(p.x + (i % 2) * 0.3, 0.2, p.z + (i % 3) * 0.3); var p2 = cur.getPoint(Math.min(1, kk + 0.01)); sh.lookAt(p2.x, 0.2, p2.z); sh.rotateY(Math.PI / 2); });
        gold.forEach(function (gd, i) { gd.visible = k >= 1; var q = ((t * 0.25 + i / 8) % 1); gd.position.set(lerp(3, -2, q), 1.2 + Math.sin(q * Math.PI) * 2, lerp(-2.4, -3.5, q)); });
        con.material.color.set(k >= 1 ? '#8a5050' : '#f0c36b');
      });
      c.state.con = con; c.state.ven = ven; c.state.jer = jer;
    },
    chips: [
      { t: 'Поход', small: '1202–1204', on: function (c) { c.state.run = 1; c.state.t0 = performance.now() / 1000 - 0.01; c.setView(0.3, 0.8, 20, 0); c.say('Крестоносцам нечем платить Венеции за флот — и поход сворачивает на христианский Константинополь.'); } },
      { t: 'Венеция', small: 'выгодоприобретатель', on: function (c) { c.pick(c.state.ven); } },
      { t: 'Цель', small: 'Иерусалим', on: function (c) { c.pick(c.state.jer); } }
    ]
  });

  /* ---------- 14. Рим и ордена ---------- */
  reg('foma-orders3d', {
    title: 'Рим против полуавтономных орденов', lead: 'Церковь держится на едином механизме. Сетевой орден с деньгами и войском — «полшага к расколу». Переключай этапы.',
    radius: 22, phi: 0.9, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.ground(11);
      var rome = c.mesh(new T.CylinderGeometry(1.4, 1.8, 2.6, 8), '#f0c36b', '<b>Рим</b> — центр единой церкви. Учение Фомы помогало ему: соединяло науку с верой и давало единое, логически обоснованное толкование власти.', { metalness: 0.3 });
      rome.position.y = 1.3;
      var dome = c.mesh(new T.SphereGeometry(1.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#f3efe6', rome.userData.info); dome.position.y = 2.6;
      c.label('Рим', [0, 4.3, 0], 0.6, '#f0c36b');
      var ord = group(c, 6, 0, -3), OI = '<b>Тевтонский орден</b>: рыцари-монахи вели квазиколониальные походы в Прибалтику и обращали местных в католичество. Сеть замков, свои финансы, своё войско.';
      into(ord, c.mesh(new T.BoxGeometry(2, 2.4, 2), '#e8e0cc', OI)).position.y = 1.2;
      for (var i = 0; i < 4; i++) { var tw = into(ord, c.mesh(new T.CylinderGeometry(0.35, 0.35, 3, 10), '#cfc4a8', OI)); tw.position.set(i % 2 ? 1 : -1, 1.5, i < 2 ? 1 : -1); }
      var crossB = into(ord, c.mesh(new T.BoxGeometry(1.2, 0.25, 0.05), '#222', OI)); crossB.position.set(0, 2, 1.03);
      var crossV = into(ord, c.mesh(new T.BoxGeometry(0.25, 1.2, 0.05), '#222', OI)); crossV.position.set(0, 2, 1.03);
      c.label('Орден', [6, 4, -3], 0.55);
      var net = [];
      for (var k = 0; k < 7; k++) { var a = k / 7 * Math.PI * 2; var n = c.mesh(new T.BoxGeometry(0.6, 0.8, 0.6), '#cfc4a8', 'Замок ордена: часть <b>сетевой структуры</b>.'); n.position.set(6 + Math.cos(a) * 3.2, 0.4, -3 + Math.sin(a) * 2.4); net.push(n); c.link([6, 0.3, -3], [n.position.x, 0.3, n.position.z], '#9aa3c0', 0.03, 'Связи внутри ордена.'); }
      var coins = [];
      for (var j = 0; j < 6; j++) coins.push(c.mesh(new T.CylinderGeometry(0.25, 0.25, 0.08, 16), '#f0c36b', 'Деньги: дань Риму или собственная казна ордена.', { metalness: 0.8, roughness: 0.2 }));
      var crack = c.mesh(new T.BoxGeometry(0.15, 0.05, 7), '#ef6b5b', '<b>Раскол</b>: если орден потребует «своего» папу, единство церкви рухнет.'); crack.position.set(3, 0.06, -1.5); crack.rotation.y = 0.6;
      c.state = { m: 0 };
      c.onFrame(function (t) {
        var m = c.state.m;
        coins.forEach(function (cn, i) {
          var q = (t * 0.3 + i / 6) % 1, dir = m === 0 ? 1 : -1;
          var from = [6, -3], to = [0, 0]; if (dir < 0) { var tmp = from; from = to; to = tmp; }
          cn.position.set(lerp(from[0], to[0], q), 1 + Math.sin(q * Math.PI) * 2, lerp(from[1], to[1], q)); cn.rotation.x = t * 3; cn.visible = m < 2;
        });
        crack.visible = m === 2; crack.scale.x = 1 + Math.sin(t * 6) * 0.3;
        ord.scale.setScalar(lerp(ord.scale.x, m === 0 ? 1 : 1.35, 0.05));
      });
    },
    chips: [
      { t: 'Сегодня', small: 'дань Риму', on: function (c) { c.state.m = 0; c.say('Орден приносит Риму доход и новые земли. Всё выглядит как служба.'); } },
      { t: 'Завтра', small: 'своя казна', on: function (c) { c.state.m = 1; c.say('Сеть замков, деньги, войско — орден растёт и копит силу <b>для себя</b>.'); } },
      { t: 'Угроза', small: 'раскол', on: function (c) { c.state.m = 2; c.say('Лектор: «сегодня они приносят дань, а завтра потребуют выбрать своего папу». Это <b>полшага к расколу</b>. Поэтому Рим поддержал единое учение Фомы.'); } }
    ]
  });

  /* ---------- 15. Цивилизаторская миссия ---------- */
  reg('foma-americas3d', {
    title: 'Цивилизаторская миссия: неравенство под копирку', lead: 'Слева — община без классов, справа — европейский порядок. Запусти «миссию» и посмотри, что переносится через океан.',
    radius: 22, phi: 0.95, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(24, 0.3, 12), '#3b6ea8', 'Атлантический океан.', { roughness: 0.4 }).position.y = -0.3;
      c.mesh(new T.BoxGeometry(7, 0.5, 10), '#7fb26a', 'Америка.').position.set(-8, 0, 0);
      c.mesh(new T.BoxGeometry(7, 0.5, 10), '#c9b98a', 'Европа (Испания, Португалия).').position.set(8, 0, 0);
      var EU = [], AM = [];
      var lord = person(c, 8, -2, '#bf5b4a', '<b>Собственник земли</b> — верх сословной пирамиды.', 1.2); lord.position.y = 2.2; crown(c, lord, 1.85, 1, lord.userData.info);
      c.mesh(new T.BoxGeometry(4, 2, 4), '#d9cfb4', 'Европейская <b>сословная пирамида</b>: кто владеет землёй — и кто на ней работает.').position.set(8, 1.25, -2);
      for (var i = 0; i < 6; i++) EU.push(person(c, 6 + (i % 3) * 2, 2 + Math.floor(i / 3) * 1.4, '#6b5a4a', 'Крестьяне, работающие на чужой земле.', 0.8));
      for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; AM.push(person(c, -8 + Math.cos(a) * 2.4, Math.sin(a) * 2.4, '#d08a4a', '<b>Община</b>: нет классов и сословий, только простое разделение труда — охота, зачатки земледелия.', 0.8)); }
      var fire = c.mesh(new T.ConeGeometry(0.4, 0.9, 8), '#ff9a4a', 'Общий очаг общины.', { emissive: new T.Color('#aa4400') }); fire.position.set(-8, 0.7, 0);
      var ship = group(c, 4, 0.2, 0);
      into(ship, c.mesh(new T.BoxGeometry(2, 0.5, 0.8), '#6b4a2a', 'Каравелла: везёт веру, войско и порядок.'));
      var sail = into(ship, c.mesh(new T.BoxGeometry(0.06, 1.4, 1.1), '#f3efe6', 'Парус с крестом: миссия «освящена» Писанием.')); sail.position.y = 1;
      var pyr = c.mesh(new T.ConeGeometry(1.8, 2, 4), '#bf5b4a', '<b>Скопированная пирамида</b>: собственники и работники, все пороки раннеклассового общества — на новой земле.'); pyr.position.set(-8, -3, 0);
      var germs = []; for (var g = 0; g < 10; g++) germs.push(c.mesh(new T.IcosahedronGeometry(0.15, 0), '#8fe05a', '<b>Болезни</b>, от которых у местных не было защиты.'));
      c.label('Америка', [-8, 4, -4], 0.55); c.label('Европа', [8, 4.5, -4], 0.55);
      c.state = { run: 0, t0: 0 };
      c.onFrame(function (t) {
        var k = c.state.run ? Math.min(1, (t - c.state.t0) * 0.15) : 0;
        ship.position.x = lerp(4, -4, k); ship.position.y = 0.2 + Math.sin(t * 2) * 0.05;
        var done = k >= 1;
        pyr.position.y = lerp(pyr.position.y, done ? 1.25 : -3, 0.03); pyr.rotation.y = t * 0.2;
        AM.forEach(function (p, i) { var a = i / 8 * Math.PI * 2 + (done ? 0 : t * 0.2); var r = done ? 3.3 : 2.4; p.position.x = lerp(p.position.x, -8 + Math.cos(a) * r, 0.05); p.position.z = lerp(p.position.z, Math.sin(a) * r, 0.05); });
        fire.visible = !done;
        germs.forEach(function (gm, i) { gm.visible = done; var a = t + i; gm.position.set(-8 + Math.cos(a) * (1 + i * 0.3), 1 + Math.sin(a * 2) * 0.5, Math.sin(a) * (1 + i * 0.3)); });
      });
    },
    chips: [
      { t: 'До', small: 'община', on: function (c) { c.state.run = 0; c.setView(-0.5, 0.9, 14, 1, -8, 0); c.say('У многих народов Америки не было классов и сословий — только простое разделение труда внутри общины.'); } },
      { t: 'Миссия', small: 'через океан', on: function (c) { c.state.run = 1; c.state.t0 = performance.now() / 1000 - 0.01; c.setView(0.2, 0.95, 22, 1, 0, 0); c.say('Испанская корона сделала учение Фомы идеологией: языческие государства <b>вне</b> божественного замысла, их надо «цивилизовать».'); } },
      { t: 'После', small: 'копия Европы', on: function (c) { c.state.run = 1; c.state.t0 = performance.now() / 1000 - 10; c.setView(-0.4, 0.9, 14, 1.5, -8, 0); c.say('Лектор: миссия оказалась «не такой цивилизованной». Неравенство собственников и работников перенесли <b>как под копирку</b>, а с ним пришли и болезни.'); } }
    ]
  });

  /* ---------- Тест ---------- */
  HubWidgets.register('foma-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Фома Аквинский и схоластика</b></div><p class="wg-lead">10 вопросов по лекции. Выбери ответ.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Годы жизни Фомы Аквинского?', ['354–430', '1225–1274', '1285–1342'], 1, '354–430 — Августин, 1285–1342 — Марсилий Падуанский.'],
      ['Что учили на нижнем факультете средневекового университета?', ['Только богословие', 'Латынь, логику, философию (свободные искусства)', 'Медицину'], 1, 'Без этой базы на высших факультетах учиться было невозможно.'],
      ['Что идёт в схоластическом методе сразу после вопроса?', ['Ответ автора', 'Возражения — все мнения против', 'Цитата из Библии'], 1, 'Вопрос → возражения → «но против» → ответ.'],
      ['Как Фома соотносит веру и разум?', ['Они враждуют', 'Это две дороги к одной истине', 'Разум полностью испорчен грехом'], 1, 'Гармония веры и разума: истина одна.'],
      ['Где существуют универсалии по Фоме?', ['Только в словах', 'Только в мире идей до вещей', 'В самих вещах (умеренный реализм)'], 2, 'Только в словах — номинализм, до вещей — крайний реализм.'],
      ['Какое доказательство говорит о «первом двигателе»?', ['Первое — от движения', 'Четвёртое — от степеней', 'Пятое — от цели'], 0, 'Цепочка движений не может уходить в бесконечность.'],
      ['С чем лектор сравнил вечный закон?', ['С конституцией', 'С физическими законами и константами', 'С церковными канонами'], 1, 'Например, скорость света человек изменить не может.'],
      ['Какой закон человек постигает разумом?', ['Естественный', 'Божественный', 'Вечный целиком'], 0, 'Естественный закон — часть вечного, доступная разуму.'],
      ['Какая форма правления лучшая по Фоме?', ['Демократия', 'Монархия', 'Олигархия'], 1, 'Один правитель, как один Бог в мире и одна голова в теле.'],
      ['Что, по лектору, было главной целью Четвёртого крестового похода на деле?', ['Освобождение Иерусалима', 'Богатство: Константинополь разграблен', 'Крещение язычников'], 1, 'Главную выгоду получила Венеция.']
    ];
    var i = 0, score = 0, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 100%'; b.style.textAlign = 'left'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = ''; res.style.display = 'none';
      if (i >= Q.length) {
        qo.innerHTML = 'Результат: <b>' + score + ' из ' + Q.length + '</b>. ' + (score >= 8 ? 'Отлично!' : score >= 5 ? 'Неплохо, повтори слабые места.' : 'Перечитай конспект и попробуй снова.');
        btn('Пройти заново').onclick = function () { i = 0; score = 0; draw(); }; return;
      }
      var q = Q[i], answered = false;
      qo.innerHTML = '<small style="opacity:.6">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + q[0];
      q[1].forEach(function (a, k) {
        var b = btn(a);
        b.onclick = function () {
          if (answered) return; answered = true;
          if (k === q[2]) { score++; b.classList.add('on'); res.innerHTML = '✅ Верно. ' + q[3]; }
          else { b.style.opacity = '.5'; ch.children[q[2]].classList.add('on'); res.innerHTML = '❌ Правильно: <b>' + q[1][q[2]] + '</b>. ' + q[3]; }
          res.style.display = 'block';
          var nx = btn(i + 1 < Q.length ? 'Дальше →' : 'Итог'); nx.style.flex = '1 1 100%'; nx.onclick = function () { i++; draw(); };
        };
      });
    }
    draw();
  });
})();
