/* 3D-модели: «Теория управления. Лекция 4. Системный подход». Движок — HubScene3d. */
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
  function link(c, a, b, col, r, info, parent) {
    var T = c.THREE, A = V(T, a), B = V(T, b), d = B.clone().sub(A);
    var m = new T.Mesh(new T.CylinderGeometry(r || 0.05, r || 0.05, d.length(), 6), c.mat(col || '#9aa2c0'));
    m.position.copy(A.clone().add(B).multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    if (info) m.userData.info = info; (parent || c.root).add(m); return m;
  }
  function loopMover(c, pts, col, speed, n) {
    var T = c.THREE, cv = new T.CatmullRomCurve3(pts.map(function (p) { return V(T, p); }), true), arr = [];
    for (var i = 0; i < (n || 1); i++) arr.push(c.mesh(new T.SphereGeometry(0.2, 14, 10), col, null, { emissive: c.color(col), emissiveIntensity: 0.7 }));
    c.onFrame(function (t) { arr.forEach(function (s, i) { s.position.copy(cv.getPointAt(W(((t * speed) + i / arr.length) % 1))); }); });
    return cv;
  }

  /* ---------- 1. Термины: элемент, подсистема, связь, структура ---------- */
  reg('tu4-terms', {
    title: 'Анатомия системы', lead: 'Шарики — элементы. Прозрачные коробки — подсистемы. Палочки — связи. Всё вместе, с порядком расположения, — структура. Нажимай на части или кнопки.',
    radius: 18, phi: 1.05, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      var groups = [[-4, '#7aa2ff', 'кадровая'], [0, '#4cc38a', 'финансовая'], [4, '#f0c36b', 'информационная']];
      c.els = []; c.subs = []; c.links = [];
      var all = [];
      groups.forEach(function (g, gi) {
        var sub = c.mesh(new T.BoxGeometry(3.4, 3.4, 3.4), g[1], '<b>Подсистема</b> (' + g[2] + ') — часть системы, комплекс элементов, объединённых <b>целевым единством</b> и общностью процессов.', { transparent: true, opacity: 0.16, depthWrite: false });
        sub.position.set(g[0], 1.9, 0); c.subs.push(sub);
        c.label(g[2], [g[0], 4.1, 0], 0.45, g[1]);
        var pts = [[-0.8, -0.8, 0.6], [0.8, -0.6, -0.6], [0, 0.8, 0.2], [-0.6, 0.5, -0.9]];
        var loc = pts.map(function (p) {
          var e = c.mesh(new T.SphereGeometry(0.36, 18, 12), g[1], '<b>Элемент</b> — составная <b>неделимая</b> часть системы. Его действие в системе — <b>функция</b>.');
          e.position.set(g[0] + p[0], 1.9 + p[1], p[2]); c.els.push(e); return [g[0] + p[0], 1.9 + p[1], p[2]];
        });
        for (var i = 0; i < loc.length; i++) for (var j = i + 1; j < loc.length; j++) c.links.push(link(c, loc[i], loc[j], '#d0d4e8', 0.04, '<b>Связь</b> — взаимодействие элементов. Связи <b>ограничивают свободу</b> элементов, зато дают общий результат.'));
        all.push(loc[2]);
      });
      c.links.push(link(c, all[0], all[1], '#ef6b5b', 0.07, '<b>Связь между подсистемами.</b> Через такие связи система работает как целое.'));
      c.links.push(link(c, all[1], all[2], '#ef6b5b', 0.07, '<b>Связь между подсистемами.</b>'));
      c.box3(13, 0.2, 5, '--panel2', [0, -0.1, 0], '<b>Структура</b> — строение и порядок: иерархия, соподчинённость, «картина связей и их стабильностей».');
    },
    chips: [
      { t: 'Элемент', small: 'неделимая часть', on: function (c) { c.pick(c.els[2]); c.setView(-0.2, 1.1, 9, 2); } },
      { t: 'Подсистема', small: 'общая цель', on: function (c) { c.pick(c.subs[1]); c.setView(0, 1.1, 11, 2); } },
      { t: 'Связи', small: 'ограничивают', on: function (c) { c.pick(c.links[c.links.length - 1]); c.setView(0.5, 0.9, 14, 2); } },
      { t: 'Структура', small: 'порядок', on: function (c) { c.setView(0.3, 0.5, 18, 1); c.say('<b>Структура</b> — как всё расставлено и связано. <b>Состояние</b> — снимок системы сейчас, <b>развитие</b> — изменение снимков во времени.'); } }
    ]
  });

  /* ---------- 2. Синергия: 2 + 2 = 5 ---------- */
  reg('tu4-synergy', {
    title: 'Синергия: когда 2 + 2 = 5', lead: 'Четыре человека тянут груз. Стрелки — их усилия, жёлтая стрелка — итог. Скоординируй их или пусти вразнобой.',
    radius: 17, phi: 0.7, targetY: 0,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 1 };
      var cargo = c.box3(2, 1.4, 2, '#9a6b3a', [0, 0.7, 0], '<b>Общая задача.</b> Синергия не возникает сама — её создаёт <b>координация</b>.');
      c.people = []; c.arrows = [];
      for (var i = 0; i < 4; i++) {
        var p = c.mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(0.35, 0.9, 6, 12) : new T.CylinderGeometry(0.35, 0.35, 1.6, 12), '#c9b6f0', 'Участник. Тянет с силой 1.');
        c.people.push(p);
        var g = new T.Group(); var sh = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1, 8), c.mat('#7aa2ff')); sh.position.y = 0.5; g.add(sh);
        var hd = new T.Mesh(new T.ConeGeometry(0.25, 0.4, 12), c.mat('#7aa2ff')); hd.position.y = 1.1; g.add(hd); c.root.add(g); c.arrows.push(g);
      }
      var res = new T.Group(); var rs = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 1, 10), c.mat('#f0c36b')); rs.position.y = 0.5; res.add(rs);
      var rh = new T.Mesh(new T.ConeGeometry(0.4, 0.6, 14), c.mat('#f0c36b')); rh.position.y = 1.2; res.add(rh); res.position.set(0, 1.6, 0); c.root.add(res);
      res.userData.info = 'Итог усилий.';
      c.score = null;
      var cur = [0, 0, 0, 0];
      c.onFrame(function (t) {
        var ang = S.mode ? [-0.25, -0.08, 0.08, 0.25] : [0.2, 2.6, -1.9, 4.0];
        var sx = 0, sz = 0;
        for (var i = 0; i < 4; i++) {
          cur[i] += (ang[i] - cur[i]) * 0.05;
          var dx = Math.sin(cur[i]), dz = -Math.cos(cur[i]);
          var px = (i - 1.5) * 1.3 + dx * 2.2, pz = -1.6 + dz * 2.2;
          c.people[i].position.set(px, 0.8, pz);
          var a = c.arrows[i]; a.position.set(px, 1.9, pz); a.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(dx, 0, dz)); a.scale.set(1, 1.6, 1);
          sx += dx; sz += dz;
        }
        var mag = Math.hypot(sx, sz) * (S.mode ? 1.25 : 1);
        res.scale.set(1, Math.max(0.05, mag * 1.1), 1); if (mag > 0.01) res.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(sx, 0, sz).normalize());
        cargo.position.x = Math.sin(t) * 0.05 * mag;
      });
    },
    chips: [
      { t: 'Вместе', small: '2 + 2 = 5', on: function (c) { c.state.mode = 1; c.say('Все тянут в одну сторону, усилия согласованы: результат <b>больше суммы</b> частей. Это <b>системный эффект (синергия)</b>.'); } },
      { t: 'Вразнобой', small: '2 + 2 = 1', on: function (c) { c.state.mode = 0; c.say('Без координации усилия гасят друг друга — итоговая стрелка почти исчезла. Задача управленца — чтобы все тянули в одну сторону.'); } }
    ]
  });

  /* ---------- 3. Виды систем ---------- */
  reg('tu4-types', {
    title: 'Виды систем: три пары', lead: 'Выбери пару: открытая и закрытая, простая и сложная, сетевая и иерархическая. Слева — первые, справа — вторые.',
    radius: 17, phi: 1.05, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { pair: 0 };
      c.sets = [new T.Group(), new T.Group(), new T.Group()]; c.sets.forEach(function (g) { c.root.add(g); });
      function add(g, m, info) { m.castShadow = true; m.userData.info = info; g.add(m); return m; }
      /* открытая / закрытая */
      var g0 = c.sets[0];
      var open = add(g0, new T.Mesh(new T.SphereGeometry(1.6, 28, 18), c.mat('#4cc38a', { transparent: true, opacity: 0.55 })), '<b>Открытая система</b> активно взаимодействует со средой: получает ресурсы, отдаёт результаты. Пример — современная организация.');
      open.position.set(-4, 2, 0);
      var closed = add(g0, new T.Mesh(new T.BoxGeometry(2.6, 2.6, 2.6), c.mat('#8a8f9e', { metalness: 0.6, roughness: 0.3 })), '<b>Закрытая система</b> не взаимодействует со средой. Пример — старое механическое устройство.');
      closed.position.set(4, 1.5, 0);
      c.flows = [];
      for (var i = 0; i < 10; i++) { var f = new T.Mesh(new T.SphereGeometry(0.15, 10, 8), c.mat(i % 2 ? '#f0c36b' : '#7aa2ff')); g0.add(f); c.flows.push(f); }
      /* сложная / простая */
      var g1 = c.sets[1], pts = [];
      for (var k = 0; k < 14; k++) { var p = [-4 + Math.sin(k * 2.4) * 1.8, 2 + Math.cos(k * 1.7) * 1.4, Math.sin(k * 3.1) * 1.6]; pts.push(p); add(g1, new T.Mesh(new T.SphereGeometry(0.22, 12, 8), c.mat('#ff8f66')), '<b>Сложная система</b>: множество элементов с разнообразными, часто <b>непредсказуемыми</b> взаимодействиями.').position.set(p[0], p[1], p[2]); }
      for (var a = 0; a < 14; a++) for (var b = a + 1; b < 14; b++) if ((a * 7 + b) % 4 === 0) link(c, pts[a], pts[b], '#ff8f66', 0.03, null, g1);
      var sp = [[3, 1, 0], [5, 1, 0], [4, 3, 0]];
      sp.forEach(function (p) { add(g1, new T.Mesh(new T.SphereGeometry(0.4, 16, 12), c.mat('#7aa2ff')), '<b>Простая система</b>: мало элементов, чёткие и предсказуемые связи.').position.set(p[0], p[1], p[2]); });
      link(c, sp[0], sp[1], '#7aa2ff', 0.06, null, g1); link(c, sp[1], sp[2], '#7aa2ff', 0.06, null, g1); link(c, sp[2], sp[0], '#7aa2ff', 0.06, null, g1);
      /* сетевая / иерархическая */
      var g2 = c.sets[2], np = [];
      for (var n = 0; n < 6; n++) { var an = n / 6 * Math.PI * 2, q = [-4 + Math.cos(an) * 1.8, 1.5, Math.sin(an) * 1.8]; np.push(q); add(g2, new T.Mesh(new T.SphereGeometry(0.35, 14, 10), c.mat('#4cc38a')), '<b>Сетевая система</b>: горизонтальные связи, <b>децентрализованное</b> управление.').position.set(q[0], q[1], q[2]); }
      for (var u = 0; u < 6; u++) { link(c, np[u], np[(u + 1) % 6], '#4cc38a', 0.05, null, g2); link(c, np[u], np[(u + 2) % 6], '#4cc38a', 0.03, null, g2); }
      var hp = [[4, 4, 0], [3, 2.5, 0], [5, 2.5, 0], [2.5, 1, 0], [3.5, 1, 0], [4.5, 1, 0], [5.5, 1, 0]];
      hp.forEach(function (p, i) { add(g2, new T.Mesh(new T.BoxGeometry(0.6, 0.6, 0.6), c.mat('#7aa2ff')), '<b>Иерархическая система</b>: чёткая <b>вертикальная</b> структура управления.').position.set(p[0], p[1], p[2]); if (i) link(c, hp[Math.floor((i - 1) / 2)], p, '#7aa2ff', 0.05, null, g2); });
      c.lab = [[ 'открытая', 'закрытая' ], [ 'сложная', 'простая' ], [ 'сетевая', 'иерархическая' ]].map(function (pr, i) {
        var l1 = c.label(pr[0], [-4, 4.6, 0], 0.55, '#4cc38a'), l2 = c.label(pr[1], [4, 5, 0], 0.55, '#9aa2c0');
        c.root.remove(l1); c.root.remove(l2); c.sets[i].add(l1); c.sets[i].add(l2);
      });
      c.onFrame(function (t) {
        c.sets.forEach(function (g, i) { g.visible = S.pair === i; });
        c.flows.forEach(function (f, i) { var k = ((t * 0.3) + i / 10) % 1, inn = i % 2 === 0, r = inn ? 5 - k * 3.4 : 1.6 + k * 3.4, a = i * 0.63; f.position.set(-4 + Math.cos(a) * r, 2 + Math.sin(a * 2) * 0.4, Math.sin(a) * r); });
        c.sets[1].rotation.y = Math.sin(t * 0.3) * 0.1;
      });
    },
    chips: [
      { t: 'Открытая / закрытая', small: 'среда', on: function (c) { c.state.pair = 0; c.say('Синие шарики втекают (ресурсы), жёлтые вытекают (результаты) — так живёт <b>открытая</b> система. Закрытая — глухой ящик.'); } },
      { t: 'Сложная / простая', small: 'связи', on: function (c) { c.state.pair = 1; c.say('Слева — клубок связей <b>сложной</b> системы, справа — треугольник <b>простой</b>.'); } },
      { t: 'Сеть / иерархия', small: 'управление', on: function (c) { c.state.pair = 2; c.say('<b>Сеть</b> — все со всеми по горизонтали. <b>Иерархия</b> — дерево подчинения сверху вниз.'); } }
    ]
  });

  /* ---------- 4. Прямая и обратная связь: термостат ---------- */
  reg('tu4-feedback', {
    title: 'Термостат: прямая и обратная связь', lead: 'Цель — 22 °C. Датчик меряет температуру (обратная связь), термостат решает (управляющая подсистема), батарея греет (управляемая). Убери датчик и посмотри, что будет.',
    radius: 17, phi: 1.05, targetY: 1.8,
    build: function (c) {
      var T = c.THREE, S = c.state = { sensor: 1, temp: 17, heat: 1 };
      c.box3(10, 0.2, 6, '#3a4270', [0, -0.1, 0], 'Комната — объект управления.');
      c.box3(10, 4, 0.2, '#2a3050', [0, 2, -3], 'Стена.');
      var heater = new T.Group(); heater.position.set(-3, 0.3, -2.5); c.root.add(heater);
      for (var i = 0; i < 7; i++) { var f = new T.Mesh(new T.BoxGeometry(0.3, 1.6, 0.4), c.mat('#e8dcc4', { emissive: new T.Color('#ff5a2a'), emissiveIntensity: 0 })); f.position.set(i * 0.38, 0.8, 0); f.castShadow = true; f.userData.info = '<b>Батарея</b> — управляемая подсистема: выполняет воздействие (греет).'; heater.add(f); }
      var box = c.box3(1.2, 1.6, 0.3, '#7aa2ff', [2.5, 2.5, -2.8], '<b>Термостат</b> — управляющая подсистема: сравнивает факт с целью и принимает решение.');
      var sensor = c.mesh(new T.SphereGeometry(0.3, 16, 12), '#4cc38a', '<b>Датчик</b> — канал обратной связи: сообщает текущее состояние объекта.'); sensor.position.set(3.5, 1.2, 1.5);
      var thermoTube = c.mesh(new T.CylinderGeometry(0.18, 0.18, 4, 16), '#ffffff', 'Шкала температуры.', { transparent: true, opacity: 0.3 }); thermoTube.position.set(-4.4, 2.2, 1.5);
      var merc = c.mesh(new T.CylinderGeometry(0.13, 0.13, 1, 12), '#ef6b5b', 'Текущая температура.'); merc.position.set(-4.4, 0.7, 1.5);
      var goalRing = c.mesh(new T.TorusGeometry(0.3, 0.05, 6, 20), '#f0c36b', '<b>Цель</b> — 22 °C.'); goalRing.rotation.x = Math.PI / 2;
      var yOf = function (tc) { return 0.2 + (tc - 14) / 16 * 4; };
      goalRing.position.set(-4.4, yOf(22), 1.5);
      c.label('цель 22°', [-5.6, yOf(22), 1.5], 0.4, '#f0c36b');
      arrow(c, [2.5, 1.6, -2.6], [-0.4, 1.3, -2.5], '#f0c36b', '<b>Прямая связь</b>: команда от термостата к батарее.');
      c.fb = arrow(c, [3.5, 1.6, 1.3], [2.8, 2.2, -2.5], '#4cc38a', '<b>Обратная связь</b>: информация о температуре идёт в термостат.');
      c.readout = null;
      c.onFrame(function () {
        var known = S.sensor ? S.temp : 17;
        S.heat = known < 22 ? 1 : 0;
        S.temp += (S.heat ? 0.03 : -0.02);
        S.temp = Math.max(15, Math.min(30, S.temp));
        heater.children.forEach(function (f) { f.material.emissiveIntensity = S.heat * 0.7; });
        var top = yOf(S.temp), h = top - 0.2; merc.scale.y = h; merc.position.y = 0.2 + h / 2;
        sensor.visible = c.fb.visible = !!S.sensor;
      });
    },
    chips: [
      { t: 'С датчиком', small: 'есть обратная связь', on: function (c) { c.state.sensor = 1; c.say('Температура держится около <b>22 °C</b>: холодно — греем, жарко — выключаем. Цикл замкнут.'); } },
      { t: 'Без датчика', small: 'связи нет', on: function (c) { c.state.sensor = 0; c.say('Без обратной связи термостат «думает», что холодно, и греет бесконечно — комната перегревается. <b>Без обратной связи невозможна корректировка.</b>'); } }
    ]
  });

  /* ---------- 5. Организация как система: вход → процессы → выход ---------- */
  reg('tu4-org', {
    title: 'Организация как система', lead: 'Слева входят ресурсы, в центре — процессы преобразования (управляемая подсистема), справа выходят продукты. Сверху — управляющая подсистема. Всё окружено внешней средой.',
    radius: 22, phi: 1.05, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.TorusGeometry(10, 0.12, 6, 80), '#9aa2c0', '<b>Внешняя среда</b>: рынок, граждане, законы, другие системы.').rotation.x = Math.PI / 2;
      c.label('внешняя среда', [0, 0.5, 10], 0.5, '#9aa2c0');
      c.box3(5, 2.6, 3.5, '#4cc38a', [0, 1.3, 0], '<b>Управляемая подсистема</b>: процессы преобразования — технологические, административные, интеллектуальные, социальные. Плюс структура, компетенции, резервы.');
      c.label('процессы', [0, 3, 1.9], 0.5);
      c.box3(5, 1.2, 3.5, '#7aa2ff', [0, 6, 0], '<b>Управляющая подсистема</b>: стратегия, анализ среды, планирование, решения, организация, контроль, мотивация, коммуникации.');
      c.label('управляющая подсистема', [0, 7.1, 0], 0.5, '#7aa2ff');
      c.box3(2, 2, 2, '#c46a3a', [-7, 1, 0], '<b>Вход — ресурсы</b>: люди, финансы, технологии, информация, материальные средства, инфраструктура; требования и нормативы извне.');
      c.label('ресурсы', [-7, 2.6, 0], 0.5, '#ff8f66');
      c.box3(2, 2, 2, '#f0c36b', [7, 1, 0], '<b>Выход</b>: продукты, услуги, решения, отчёты, эффекты. Должны соответствовать требованиям управляющей подсистемы и среды.');
      c.label('продукция, услуги', [7, 2.6, 0], 0.5, '#f0c36b');
      arrow(c, [-1, 5.3, 0.4], [-1, 2.8, 0.4], '#7aa2ff', '<b>Управляющие воздействия</b>: решения, планы, ресурсы, инструкции.', 0.1);
      arrow(c, [1, 2.8, 0.4], [1, 5.3, 0.4], '#ef6b5b', '<b>Обратная связь</b>: отчёты, показатели, отзывы, контрольные данные.', 0.1);
      loopMover(c, [[-7, 1, 0], [-3, 1, 0], [0, 1.4, 1], [3, 1, 0], [7, 1, 0], [7, -0.4, 0], [-7, -0.4, 0]], '#ffffff', 0.08, 5);
    },
    chips: [
      { t: 'Вход', small: 'ресурсы', on: function (c) { c.setView(-0.9, 1.1, 12, 1); c.say('Обеспечить ресурсами и условиями должна <b>управляющая</b> подсистема.'); } },
      { t: 'Выход', small: 'результат', on: function (c) { c.setView(0.9, 1.1, 12, 1); c.say('У коммерческой организации цель — <b>прибыль</b>, у некоммерческой — цели <b>учредителей</b>, а на выходе ещё и <b>общественные блага</b>.'); } },
      { t: 'Обратная связь', small: 'наверх', on: function (c) { c.setView(0.2, 1.3, 11, 4); c.say('Без обратной связи (красная стрелка) невозможна корректировка.'); } }
    ]
  });

  /* ---------- 6. Цикл управления ---------- */
  reg('tu4-cycle', {
    title: 'Цикл управления', lead: 'Восемь станций по кругу. Верхняя дуга (синяя) — работа управляющей подсистемы, нижняя (зелёная) — управляемой. Шарик проходит весь цикл и начинает снова.',
    radius: 17, phi: 0.75, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      var st = [['Цель', '#7aa2ff', 'Желаемый результат.'], ['План', '#7aa2ff', 'Как достичь цели.'], ['Решения, указания', '#7aa2ff', 'Выбор из альтернатив.'], ['Распределение задач и ресурсов', '#7aa2ff', 'Кто, чем и когда.'], ['Процессы, производство результата', '#4cc38a', 'Это делает управляемая подсистема.'], ['Информация о выполнении', '#ef6b5b', 'Обратная связь наверх.'], ['Анализ результатов', '#7aa2ff', 'Сравнить факт с планом.'], ['Снова цель', '#f0c36b', 'Цель уточняется, цикл повторяется.']];
      var pts = [];
      c.st = st.map(function (s, i) {
        var a = i / st.length * Math.PI * 2, x = Math.sin(a) * 5, z = Math.cos(a) * 5;
        pts.push([x, 0.6, z]);
        var m = c.mesh(new T.CylinderGeometry(0.8, 0.9, 0.6 + (s[1] === '#4cc38a' ? 0.8 : 0), 24), s[1], '<b>' + (i + 1) + '. ' + s[0] + '</b>. ' + s[2]); m.position.set(x, 0.3, z);
        c.label((i + 1) + '. ' + s[0], [x * 1.25, 1.6, z * 1.25], 0.4, s[1]);
        return m;
      });
      c.mesh(new T.TorusGeometry(5, 0.06, 6, 80), '#9aa2c0').rotation.x = Math.PI / 2;
      loopMover(c, pts, '#ffffff', 0.07, 1);
      c.label('управляющая\nподсистема', [0, 2.5, 0], 0.5, '#7aa2ff');
    },
    chips: [
      { t: 'Управляющая', small: 'шаги 1–4, 7', on: function (c) { c.setView(0.5, 0.6, 16, 0); c.say('Цель, план, решения, распределение задач и анализ результатов — работа <b>управляющей</b> подсистемы.'); } },
      { t: 'Управляемая', small: 'шаг 5', on: function (c) { c.pick(c.st[4]); } },
      { t: 'Обратная связь', small: 'шаг 6', on: function (c) { c.pick(c.st[5]); } }
    ]
  });

  /* ---------- 7. Система здравоохранения ---------- */
  reg('tu4-health', {
    title: 'Пример: система здравоохранения', lead: 'Наверху — Министерство здравоохранения. Ниже — региональные министерства, ещё ниже — больницы и поликлиники. Жёлтые шарики идут вниз (бюджеты, стандарты), красные — вверх (статистика, жалобы).',
    radius: 22, phi: 1.05, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.box3(3, 2, 2, '#7aa2ff', [0, 8, 0], '<b>Минздрав — управляющая подсистема</b>: стратегия (качество, снижение смертности, доступность помощи), нормативы и стандарты, бюджеты, задания регионам, контроль.');
      c.label('Минздрав', [0, 9.6, 0], 0.55, '#7aa2ff');
      var R = [-6, 0, 6], down = [], up = [];
      R.forEach(function (x, i) {
        c.box3(2.2, 1.4, 1.6, '#5b7fd9', [x, 4.6, 0], '<b>Региональное министерство</b> — часть управляемой подсистемы и одновременно управляет своими больницами.');
        c.label('регион ' + (i + 1), [x, 5.7, 0], 0.4);
        [-1.4, 1.4].forEach(function (dx, k) {
          var h = c.box3(1.4, 1.2, 1.2, '#4cc38a', [x + dx, 0.6, 0], '<b>' + (k ? 'Поликлиника' : 'Больница') + '</b>: использует финансы, персонал, оборудование и оказывает медицинскую помощь населению.');
          var cross = c.box3(0.5, 0.15, 0.04, '#ef6b5b', [x + dx, 0.9, 0.62]); var cross2 = c.box3(0.15, 0.5, 0.04, '#ef6b5b', [x + dx, 0.9, 0.62]);
          down.push([[0, 7, 0.4], [x, 5.3, 0.4], [x + dx, 1.2, 0.4]]); up.push([[x + dx, 1.2, -0.4], [x, 3.9, -0.4], [0, 7, -0.4]]);
        });
      });
      var pd = [], pu = [];
      down.forEach(function (p) { pd.push({ cv: new T.CatmullRomCurve3(p.map(function (q) { return V(T, q); })), m: c.mesh(new T.SphereGeometry(0.17, 10, 8), '#f0c36b', null, { emissive: c.color('#f0c36b'), emissiveIntensity: 0.7 }) }); });
      up.forEach(function (p) { pu.push({ cv: new T.CatmullRomCurve3(p.map(function (q) { return V(T, q); })), m: c.mesh(new T.SphereGeometry(0.17, 10, 8), '#ef6b5b', null, { emissive: c.color('#ef6b5b'), emissiveIntensity: 0.7 }) }); });
      c.label('↓ бюджеты, стандарты, задания', [-8, 7.5, 0], 0.42, '#f0c36b');
      c.label('↑ статистика, отчёты, жалобы', [8, 7.5, 0], 0.42, '#ef6b5b');
      c.onFrame(function (t) {
        pd.forEach(function (o, i) { o.m.position.copy(o.cv.getPointAt(W((t * 0.15 + i * 0.17) % 1))); });
        pu.forEach(function (o, i) { o.m.position.copy(o.cv.getPointAt(W((t * 0.12 + i * 0.13) % 1))); });
      });
    },
    chips: [
      { t: 'Вниз', small: 'прямая связь', on: function (c) { c.setView(-0.3, 1.0, 18, 4); c.say('Минздрав задаёт стратегию, стандарты и бюджеты и распределяет задания регионам.'); } },
      { t: 'Вверх', small: 'обратная связь', on: function (c) { c.setView(0.4, 1.0, 18, 4); c.say('Статистика заболеваемости, отчёты о бюджете, оценки качества, <b>жалобы граждан</b> возвращаются в министерство — для корректировки политики и ресурсов.'); } }
    ]
  });

  /* ---------- 8. Узкое место и локальная оптимизация ---------- */
  reg('tu4-bottleneck', {
    title: 'Узкое место и локальная оптимизация', lead: 'Цех A делает детали, цех B собирает из них машины. Ускорь A — и посмотри, что вырастет: выпуск или гора деталей на складе.',
    radius: 20, phi: 1.0, targetY: 1,
    build: function (c) {
      var T = c.THREE, S = c.state = { a: 1, b: 1, pile: 0, out: 0, accA: 0, accB: 0 };
      c.box3(16, 0.2, 3, '#3a4270', [0, -0.1, 0], 'Конвейер.');
      c.box3(2.6, 2.4, 2.6, '#7aa2ff', [-5.5, 1.2, 0], '<b>Цех A</b> — делает детали.');
      c.box3(2.6, 2.4, 2.6, '#ff8f66', [3, 1.2, 0], '<b>Цех B</b> — собирает. Самое медленное звено — <b>узкое место</b>: оно определяет скорость всей системы.');
      c.label('цех A', [-5.5, 3, 0], 0.5, '#7aa2ff'); c.label('цех B', [3, 3, 0], 0.5, '#ff8f66');
      c.label('склад', [-1.2, 3, 0], 0.45, '#9aa2c0'); c.label('выпуск', [7, 3, 0], 0.45, '#4cc38a');
      c.pileM = []; c.outM = [];
      for (var i = 0; i < 30; i++) { var p = c.box3(0.4, 0.4, 0.4, '#9aa2c0', [-2.2 + (i % 5) * 0.45, 0.2 + Math.floor(i / 5) * 0.42, 0.5 - (Math.floor(i / 5) % 2) * 0.4], '<b>Незавершённые детали на складе</b> — замороженные деньги.'); p.visible = false; c.pileM.push(p); }
      for (var j = 0; j < 12; j++) { var o = c.box3(0.8, 0.5, 0.5, '#4cc38a', [5.8 + (j % 3) * 0.9, 0.25 + Math.floor(j / 3) * 0.55, 0], '<b>Готовые машины</b> — то, ради чего работает система.'); o.visible = false; c.outM.push(o); }
      var last = 0;
      c.onFrame(function (t) {
        var dt = Math.min(0.1, t - last); last = t;
        S.accA += dt * S.a; S.accB += dt * S.b;
        if (S.accA > 1) { S.accA -= 1; S.pile++; }
        if (S.accB > 1) { S.accB -= 1; if (S.pile > 0) { S.pile--; S.out++; } }
        if (S.out > 11) S.out = 0;
        if (S.pile > 29) S.pile = 29;
        c.pileM.forEach(function (m, i) { m.visible = i < S.pile; });
        c.outM.forEach(function (m, i) { m.visible = i < S.out; });
      });
    },
    chips: [
      { t: 'Баланс', small: 'A = B', on: function (c) { var s = c.state; s.a = 1; s.b = 1; s.pile = 0; s.out = 0; c.say('Цеха работают в одном темпе: склад пустой, выпуск идёт ровно.'); } },
      { t: 'Ускорить A', small: 'локально', on: function (c) { var s = c.state; s.a = 2.5; s.b = 1; s.pile = 0; s.out = 0; c.say('<b>Локальная оптимизация</b>: цех A стал быстрее, но B — нет. Растёт гора деталей, а выпуск тот же.'); } },
      { t: 'Ускорить B', small: 'узкое место', on: function (c) { var s = c.state; s.a = 2.5; s.b = 2.5; s.pile = 0; s.out = 0; c.say('Расширили <b>узкое место</b> — и выпуск вырос. Системный подход: оптимизировать систему целиком, а не отдельный цех.'); } }
    ]
  });
})();
