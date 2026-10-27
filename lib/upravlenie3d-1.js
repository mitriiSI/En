/* 3D-модели: «Теория управления. Лекция 1. Понятие управления».
   Движок — HubScene3d (lib/scene3d.js). В Markdown: @@graph:tu1-cycle@@ и т. д. */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    /* под экран телефона: камера чуть дальше, подписи крупнее */
    var b = opts.build; opts.radius = (opts.radius || 16) * 1.2;
    opts.build = function (c) { var L = c.label; c.label = function (t, p, s, col) { return L(t, p, (s || 0.9) * 1.7, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function W(x) { x = x % 1; return x < 0 ? x + 1 : x; }
  function V(T, a) { return new T.Vector3(a[0], a[1], a[2]); }
  function arrow(c, a, b, col, info, r) {
    var T = c.THREE, A = V(T, a), B = V(T, b), d = B.clone().sub(A), len = d.length(); r = r || 0.08;
    var g = new T.Group();
    var sh = new T.Mesh(new T.CylinderGeometry(r, r, Math.max(0.01, len - 0.45), 10), c.mat(col)); sh.position.y = (len - 0.45) / 2; g.add(sh);
    var hd = new T.Mesh(new T.ConeGeometry(r * 3.2, 0.45, 14), c.mat(col)); hd.position.y = len - 0.225; g.add(hd);
    g.position.copy(A); g.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    if (info) g.userData.info = info; c.root.add(g); return g;
  }
  function tube(c, pts, col, r, closed, info) {
    var T = c.THREE, cv = new T.CatmullRomCurve3(pts.map(function (p) { return V(T, p); }), !!closed);
    var m = c.mesh(new T.TubeGeometry(cv, 120, r || 0.06, 8, !!closed), col, info); m.userData.curve = cv; return m;
  }
  function mover(c, curve, col, speed, size, phase) {
    var T = c.THREE, s = c.mesh(new T.SphereGeometry(size || 0.22, 16, 12), col, null, { emissive: c.color(col), emissiveIntensity: 0.7 });
    c.onFrame(function (t) { s.position.copy(curve.getPointAt(W(((t * (speed || 0.1)) + (phase || 0)) % 1))); });
    return s;
  }

  /* ---------- 1. Пять атрибутов управления + обратная связь ---------- */
  reg('tu1-cycle', {
    title: 'Управление: субъект → воздействие → объект → результат', lead: 'Светящийся шарик — управляющее воздействие. Он уходит от субъекта к объекту и возвращается по обратной связи. Нажимай на детали.',
    radius: 20, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.box3(16, 0.3, 9, '--panel2', [0, -0.15, 0], 'Управление — целенаправленное воздействие субъекта на объект для изменения или сохранения его состояния.');
      var tw = c.mesh(new T.CylinderGeometry(1, 1.3, 4, 8), '#7aa2ff', '<b>Субъект</b> — тот, кто, обладая полномочиями, компетенциями и средствами, принимает решение о цели и реализует его. Пример: тренер.');
      tw.position.set(-5.5, 2, 0);
      var top = c.mesh(new T.ConeGeometry(1.3, 1.2, 8), '#5b7fd9', '<b>Субъект</b> управления.'); top.position.set(-5.5, 4.6, 0);
      for (var i = 0; i < 9; i++) {
        c.box3(1, 1, 1, '#4cc38a', [4.2 + (i % 3) * 1.15, 0.5 + Math.floor(i / 3) * 1.1, -1.15 + (i % 3 === 1 ? 0 : 0) + Math.floor(i / 3) * 0], '<b>Объект</b> — то, на что направлено управленческое воздействие. Пример: команда.');
      }
      var flag = c.mesh(new T.CylinderGeometry(0.06, 0.06, 3, 8), '#ddd', null); flag.position.set(0, 6, -2.5);
      var cloth = c.mesh(new T.BoxGeometry(1.6, 1, 0.05), '#f0c36b', '<b>Цель</b> — желаемое состояние объекта. Бывают стратегические, тактические, оперативные цели.'); cloth.position.set(0.8, 7, -2.5);
      c.label('ЦЕЛЬ', [0, 8.2, -2.5], 0.7, '#f0c36b');
      c.label('СУБЪЕКТ', [-5.5, 6, 0], 0.7, '#7aa2ff');
      c.label('ОБЪЕКТ', [5.4, 4.2, 0], 0.7, '#4cc38a');
      var fwd = tube(c, [[-4.3, 3, 0.3], [0, 4.2, 1.2], [3.8, 2.6, 0.3]], '#f0c36b', 0.07, false, '<b>Управляющее воздействие</b> — целенаправленное действие субъекта для изменения состояния объекта: формы, сроки, технологии, механизмы, инструменты.');
      arrow(c, [3.2, 2.9, 0.4], [3.9, 2.55, 0.3], '#f0c36b');
      var back = tube(c, [[4.5, 0.4, 2.2], [0, 0.4, 3.6], [-4.6, 0.6, 1.6]], '#ef6b5b', 0.07, false, '<b>Обратная связь</b>: субъект узнаёт, что стало с объектом. Без неё не понять, достигнута ли цель.');
      arrow(c, [-3.8, 0.55, 2.1], [-4.6, 0.6, 1.6], '#ef6b5b');
      c.label('воздействие', [0, 5, 1.2], 0.55, '#f0c36b');
      c.label('обратная связь → результат', [0, 1.3, 3.8], 0.55, '#ef6b5b');
      var loop = new T.CatmullRomCurve3([[-4.3, 3, 0.3], [0, 4.2, 1.2], [3.8, 2.6, 0.3], [4.5, 0.4, 2.2], [0, 0.4, 3.6], [-4.6, 0.6, 1.6]].map(function (p) { return V(T, p); }), true);
      mover(c, loop, '#ffffff', 0.12, 0.25);
      c.onFrame(function (t) { cloth.rotation.y = Math.sin(t * 2) * 0.25; });
    },
    chips: [
      { t: 'Цель', small: 'что хотим', on: function (c) { c.setView(0.1, 1.2, 15, 5); c.say('<b>Цель</b> — желаемое состояние объекта. Пример: «выйти в финал».'); } },
      { t: 'Субъект', small: 'кто управляет', on: function (c) { c.setView(-0.7, 1.15, 13, 2); c.say('<b>Субъект</b> — тренер: у него есть полномочия, компетенции и средства.'); } },
      { t: 'Объект', small: 'чем управляют', on: function (c) { c.setView(0.8, 1.15, 13, 1.5); c.say('<b>Объект</b> — команда. Управлять можно, чтобы <b>изменить</b> или чтобы <b>сохранить</b> её состояние.'); } },
      { t: 'Обратная связь', small: 'результат', on: function (c) { c.setView(0.2, 0.75, 16, 0.5); c.say('<b>Результат</b> — изменение состояния объекта. Информация о нём возвращается субъекту — так цикл замыкается.'); } }
    ]
  });

  /* ---------- 2. Пять требований к информации ---------- */
  reg('tu1-info', {
    title: 'Решение стоит на пяти колоннах информации', lead: 'Плита — управленческое решение. Колонны — требования к информации. Убери одну и посмотри, что станет с решением.',
    radius: 17, phi: 1.1, targetY: 2.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { off: -1, tilt: 0 };
      c.box3(12, 0.3, 6, '--panel2', [0, -0.15, 0], 'Решение настолько хорошо, насколько хороша информация, на которой оно основано.');
      var names = [['Достоверность', 'нет ошибок и умышленных искажений'], ['Полнота', 'учтено всё важное'], ['Регулярность', 'данные собираются систематически'], ['Единообразие', 'одна методика — данные можно сравнивать'], ['Детальность', 'детальность и разнообразие данных']];
      var cols = ['#7aa2ff', '#4cc38a', '#f0c36b', '#c9b6f0', '#ff8f66'];
      c.pillars = names.map(function (n, i) {
        var p = c.mesh(new T.CylinderGeometry(0.45, 0.55, 3.6, 20), cols[i], '<b>' + n[0] + '</b> — ' + n[1] + '.');
        p.position.set(-4.4 + i * 2.2, 1.8, 0);
        c.label(n[0], [-4.4 + i * 2.2, -0.7, 1.9], 0.48, cols[i]);
        return p;
      });
      var slab = c.plate = new T.Group();
      var sm = new T.Mesh(new T.BoxGeometry(11.5, 0.5, 3.4), c.mat('#e8dcc4')); sm.castShadow = true; slab.add(sm);
      sm.userData.info = '<b>Управленческое решение.</b> Держится, пока все требования к информации выполнены.';
      slab.position.set(0, 3.85, 0); c.root.add(slab);
      c.label('РЕШЕНИЕ', [0, 5.2, 0], 0.7, '#f0c36b');
      c.onFrame(function () {
        c.pillars.forEach(function (p, i) { var target = S.off === i ? 0.15 : 1; p.scale.y += (target - p.scale.y) * 0.08; p.position.y = 1.8 * p.scale.y; });
        var goal = S.off < 0 ? 0 : (S.off - 2) * -0.07; S.tilt += (goal - S.tilt) * 0.06;
        slab.rotation.z = S.tilt; slab.position.y = 3.85 - (S.off < 0 ? 0 : 0.35);
      });
    },
    chips: [
      { t: 'Все на месте', small: 'норма', on: function (c) { c.state.off = -1; c.say('Все пять требований выполнены — на такое решение можно опираться.'); } },
      { t: 'Без достоверности', small: 'искажения', on: function (c) { c.state.off = 0; c.say('Если данные искажены, решение «съезжает»: руководитель лечит не ту болезнь.'); } },
      { t: 'Без единообразия', small: 'разные методики', on: function (c) { c.state.off = 3; c.say('Регионы считают безработицу по разным методикам — сравнивать цифры бессмысленно, решение кренится.'); } }
    ]
  });

  /* ---------- 3. Место науки управления: фундамент и надстройка ---------- */
  reg('tu1-sciences', {
    title: 'Фундаментальные и прикладные науки', lead: 'Нижний ярус — фундаментальные науки, верхний — прикладные. Теория управления — в фундаменте, прикладные направления управления — над ней.',
    radius: 21, phi: 1.05, targetY: 2.5,
    build: function (c) {
      var fund = ['философия', 'математика', 'кибернетика', 'история', 'социология', 'психология', 'демография', 'эконом. теория', 'политология'];
      var appl = ['статистика', 'финансы', 'право', 'учёт', 'конфликтология', 'исслед. операций', 'информатика', 'инноватика', 'психол. управления'];
      fund.forEach(function (n, i) {
        var x = -8 + i * 2, m = c.box3(1.8, 1.4, 3, '#4a5a8c', [x, 0.7, 0], '<b>' + n + '</b> — фундаментальная наука: отвечает «почему так устроено».');
        if (i % 2 === 0) c.label(n, [x, 1.9, 1.9], 0.38);
      });
      c.box3(5, 1.6, 3.4, '#f0c36b', [0, 2.3, 0], '<b>Теория управления</b> — фундаментальные основы управления. Она в фундаменте, на ней стоят прикладные направления.');
      c.label('ТЕОРИЯ УПРАВЛЕНИЯ', [0, 3.6, 1.9], 0.6, '#f0c36b');
      appl.forEach(function (n, i) {
        var x = -8 + i * 2;
        c.box3(1.7, 1.2, 2.6, '#4cc38a', [x, 4.6, 0], '<b>' + n + '</b> — прикладная наука: отвечает «что с этим делать».');
        if (i % 2 === 1) c.label(n, [x, 5.6, 1.7], 0.38);
      });
      c.box3(5, 1.2, 2.8, '#7aa2ff', [0, 6.0, 0], '<b>Прикладные направления науки управления</b>: проектное, финансовое, стратегическое управление и др.');
      c.label('фундаментальные', [-10.5, 0.7, 0], 0.5, '#9aa2c0');
      c.label('прикладные', [-10.5, 4.6, 0], 0.5, '#4cc38a');
    },
    chips: [
      { t: 'Фундамент', small: 'почему?', on: function (c) { c.setView(0.4, 1.35, 18, 1); c.say('<b>Фундаментальные</b> (методологические) науки объясняют, как устроен мир. Сюда входит и теория управления.'); } },
      { t: 'Надстройка', small: 'что делать?', on: function (c) { c.setView(0.4, 0.8, 18, 5); c.say('<b>Прикладные</b> науки превращают знания в инструменты: учёт, финансы, исследование операций.'); } },
      { t: 'Теория управления', small: 'центр', on: function (c) { c.setView(0, 1.1, 10, 3); c.say('Управление — <b>социальная</b> наука (изучает человека и общество) и опирается на множество соседних наук: она <b>междисциплинарна</b>.'); } }
    ]
  });

  /* ---------- 4. Функции управления: Файоль и современный подход ---------- */
  reg('tu1-functions', {
    title: 'Колесо функций управления', lead: 'Внутреннее кольцо — пять функций Файоля. Внешнее — функции, которые добавляет современный подход. Колесо крутится: функции повторяются по кругу.',
    radius: 18, phi: 0.75, targetY: 0,
    build: function (c) {
      var T = c.THREE, S = c.state = { outer: 1 };
      var inner = new T.Group(), outer = new T.Group(); c.root.add(inner); c.root.add(outer);
      var f5 = [['Предвидение', 'прогнозировать и готовить будущее, планировать'], ['Организация', 'выстроить структуру и ресурсы под цель'], ['Распорядительство', 'чтобы организация действовала по своим намерениям'], ['Координация', 'связать все виды деятельности, привести средства к цели'], ['Контроль', 'проверить, что цель достигается по плану']];
      var cols = ['#7aa2ff', '#4cc38a', '#f0c36b', '#c9b6f0', '#ef6b5b'];
      f5.forEach(function (f, i) {
        var a0 = i / 5 * Math.PI * 2;
        var m = new T.Mesh(new T.CylinderGeometry(4, 4, 0.8, 32, 1, false, a0 + 0.03, Math.PI * 2 / 5 - 0.06), c.mat(cols[i]));
        m.castShadow = true; m.userData.info = '<b>' + f[0] + '</b> (Файоль): ' + f[1] + '.'; inner.add(m);
        var a = a0 + Math.PI / 5, lb = c.label(f[0], [Math.sin(a) * 2.6, 0.9, Math.cos(a) * 2.6], 0.45); c.root.remove(lb); inner.add(lb);
      });
      var hub = c.mesh(new T.CylinderGeometry(1.1, 1.1, 1.1, 24), '#e8dcc4', '«Управлять — значит предвидеть, организовывать, распоряжаться, координировать и контролировать» (А. Файоль).'); c.root.remove(hub); inner.add(hub);
      var extra = ['Планирование', 'Мотивация', 'Коммуникация', 'Принятие решений', 'Обучение', 'Организация', 'Координация', 'Контроль'];
      extra.forEach(function (n, i) {
        var a = i / extra.length * Math.PI * 2;
        var m = new T.Mesh(new T.BoxGeometry(1.6, 0.6, 0.9), c.mat(i === 1 || i === 2 || i === 3 || i === 4 ? '#ff8f66' : '#5b6a99'));
        m.position.set(Math.sin(a) * 6.2, 0, Math.cos(a) * 6.2); m.rotation.y = a; m.castShadow = true;
        m.userData.info = '<b>' + n + '</b> — функция в современном подходе' + (i >= 1 && i <= 4 ? '. Её у Файоля в явном виде не было.' : '.');
        outer.add(m);
        var lb = c.label(n, [Math.sin(a) * 6.2, 0.9, Math.cos(a) * 6.2], 0.42); c.root.remove(lb); outer.add(lb);
      });
      c.onFrame(function (t) { inner.rotation.y = t * 0.15; outer.rotation.y = -t * 0.08; outer.scale.setScalar(outer.scale.x + (S.outer - outer.scale.x) * 0.08); outer.visible = outer.scale.x > 0.05; });
    },
    chips: [
      { t: 'Файоль', small: '5 функций', on: function (c) { c.state.outer = 0.01; c.setView(0, 0.6, 12, 0); c.say('Классика: <b>предвидение, организация, распорядительство, координация, контроль</b>.'); } },
      { t: 'Современно', small: 'больше функций', on: function (c) { c.state.outer = 1; c.setView(0.5, 0.75, 18, 0); c.say('Современные подходы добавляют <b>мотивацию, коммуникацию, принятие решений, обучение</b> (оранжевые блоки).'); } }
    ]
  });

  /* ---------- 5. Теория ⊂ наука ⊂ практика ⊂ деятельность ---------- */
  reg('tu1-nested', {
    title: 'Матрёшка: теория, наука, практика', lead: 'Внутри — теория управления (ТУ), вокруг — наука (НУ), ещё шире — практика (ПУ), а всё вместе — управленческая деятельность. Нажимай на оболочки.',
    radius: 16, phi: 1.1, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      var L = [[1.3, '#f0c36b', 'ТУ', '<b>Теория управления</b> — ядро: законы, понятия, принципы.'], [2.6, '#7aa2ff', 'НУ', '<b>Наука управления</b> — шире теории: собирает данные, проверяет гипотезы, строит модели.'], [3.9, '#4cc38a', 'ПУ', '<b>Практика управления</b> — то, что реально делают управленцы.'], [5.2, '#c9b6f0', 'деятельность', '<b>Управленческая деятельность</b> объединяет всё. Теория без практики пуста, практика без теории слепа.']];
      c.shells = L.map(function (l, i) {
        var m = c.mesh(new T.SphereGeometry(l[0], 40, 28, 0, Math.PI * 1.5), l[1], l[3], { transparent: true, opacity: i === 0 ? 1 : 0.45, side: T.DoubleSide, depthWrite: i === 0 });
        m.rotation.y = -Math.PI / 4;
        c.label(l[2], [0, l[0] + 0.2, 0], 0.6, l[1]);
        return m;
      });
      c.onFrame(function (t) { c.shells.forEach(function (s, i) { s.rotation.y = -Math.PI / 4 + Math.sin(t * 0.4 + i) * 0.2; }); });
    },
    chips: [
      { t: 'ТУ', small: 'ядро', on: function (c) { c.setView(0.6, 1.1, 8, 0); c.say(c.shells[0].userData.info); } },
      { t: 'НУ', small: 'наука', on: function (c) { c.setView(0.6, 1.1, 11, 0); c.say(c.shells[1].userData.info); } },
      { t: 'ПУ', small: 'практика', on: function (c) { c.setView(0.6, 1.1, 14, 0); c.say(c.shells[2].userData.info); } },
      { t: 'Всё вместе', small: 'деятельность', on: function (c) { c.setView(0.6, 1.1, 17, 0); c.say(c.shells[3].userData.info); } }
    ]
  });

  /* ---------- 6. Смена парадигмы ---------- */
  reg('tu1-paradigm', {
    title: 'Смена парадигмы управления', lead: 'Слева — чем управляли раньше: труд, капитал, земля. Справа — новые факторы: информация, знания, качество. Нажми «Сдвиг», и центр тяжести переедет.',
    radius: 20, phi: 1.05, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { k: 0 };
      var beam = new T.Group(); beam.position.y = 3.2; c.root.add(beam);
      var bar = new T.Mesh(new T.BoxGeometry(14, 0.3, 0.6), c.mat('#9aa2c0')); bar.userData.info = 'Весы парадигмы: на что делает ставку управление.'; beam.add(bar);
      var piv = c.mesh(new T.ConeGeometry(0.9, 3, 4), '#5b6a99', 'Опора весов.'); piv.position.y = 1.5;
      function pan(x, col) { var p = new T.Mesh(new T.CylinderGeometry(2.3, 2.3, 0.25, 32), c.mat(col)); p.position.set(x, -0.5, 0); p.castShadow = true; beam.add(p); return p; }
      var L = pan(-5.5, '#6b5b4a'), R = pan(5.5, '#3e6b8f');
      function put(grp, geo, col, x, y, z, info) { var m = new T.Mesh(geo, c.mat(col, { metalness: 0.2 })); m.position.set(x, y, z); m.castShadow = true; m.userData.info = info; grp.add(m); return m; }
      put(L, new T.BoxGeometry(1, 1.2, 1), '#c46a3a', -1, 0.75, 0, '<b>Труд</b> — традиционный фактор производства.');
      put(L, new T.CylinderGeometry(0.5, 0.5, 0.9, 20), '#f0c36b', 0.6, 0.6, -0.6, '<b>Капитал</b> — традиционный фактор.');
      put(L, new T.BoxGeometry(1.6, 0.3, 1.6), '#5aa36a', 0.4, 0.3, 0.9, '<b>Земля</b> — традиционный фактор.');
      put(R, new T.OctahedronGeometry(0.7), '#7aa2ff', -1, 0.9, 0, '<b>Информация</b> — новый фактор управления.');
      put(R, new T.IcosahedronGeometry(0.65), '#c9b6f0', 0.7, 0.9, -0.5, '<b>Знания</b> — новый фактор: опыт, компетенции, нематериальные активы.');
      put(R, new T.TorusKnotGeometry(0.38, 0.13, 60, 8), '#4cc38a', 0.4, 0.9, 1, '<b>Качество</b> — новый фактор управления.');
      c.label('труд · капитал · земля\nфункционирование', [-5.5, 7, 0], 0.55, '#ff8f66');
      c.label('информация · знания · качество\nразвитие, инновации', [5.5, 7, 0], 0.55, '#7aa2ff');
      c.onFrame(function (t) { var g = 0.18 - S.k * 0.36; beam.rotation.z += (g - beam.rotation.z) * 0.04; L.rotation.z = -beam.rotation.z; R.rotation.z = -beam.rotation.z; R.children.forEach(function (m, i) { m.rotation.y = t + i; }); });
    },
    chips: [
      { t: 'Раньше', small: 'традиционно', on: function (c) { c.state.k = 0; c.say('Управляли трудом, капиталом и землёй, а главной задачей было <b>функционирование</b>: чтобы завтра работало как сегодня.'); } },
      { t: 'Сдвиг', small: 'новая парадигма', on: function (c) { c.state.k = 1; c.say('Теперь в центре — <b>информация, знания, качество</b>, управление <b>развитием</b> и инновациями. Госорганы и НКО заимствуют методы бизнеса (New Public Management).'); } }
    ]
  });
})();
