/* 3D-модели: «Теория управления. Лекция 3. Развитие управленческой мысли в России». Движок — HubScene3d. */
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

  /* ---------- 1. Карта эпох ---------- */
  reg('tu3-timeline', {
    title: 'Девять эпох российской управленческой мысли', lead: 'Колонны стоят по времени. Высота — условная «активность» науки: видно расцвет 1920-х, провал 1930–1950-х и бум 1960–1980-х.',
    radius: 24, phi: 1.1, targetY: 2.5,
    build: function (c) {
      var E = [
        ['Средние века', 1, '#8a8f9e', 'Преднаучный период: «Русская правда», «Домострой» — правила хозяйства и поведения.'],
        ['XVII–XVIII вв.', 2, '#9a7b5b', 'Ордин-Нащокин, Посошков, Ломоносов: основы экономической, финансовой и управленческой мысли.'],
        ['XIX в.', 3, '#c46a3a', 'Университеты: камералистика, первые курсы «учения об управлении».'],
        ['рубеж XIX–XX', 4, '#f0c36b', 'Научная организация труда приходит в Россию.'],
        ['1920-е', 7, '#4cc38a', 'Расцвет: НОТ, Гастев, Керженцев, Богданов, четыре научные школы.'],
        ['1930–1950-е', 2.2, '#ef6b5b', 'Административно-командная система: научная дискуссия сужается, многие учёные репрессированы.'],
        ['1960–1980-е', 6.5, '#7aa2ff', 'Управленческий бум: кибернетика, математика, системный подход, АСУ.'],
        ['конец 1980-х', 4, '#c9b6f0', 'Перестройка: поиск новой системы управления.'],
        ['с 1990-х', 5, '#ff8f66', 'Три пути: заимствовать, адаптировать или создать своё.']
      ];
      c.cols = E.map(function (e, i) {
        var a = -1.1 + i * 0.275, x = Math.sin(a) * 11, z = Math.cos(a) * 11 - 9;
        var m = c.box3(1.6, e[1], 1.6, e[2], [x, e[1] / 2, z], '<b>' + e[0] + '.</b> ' + e[3]);
        c.label(e[0], [x, e[1] + 0.7, z], 0.45, e[2]);
        return m;
      });
      c.box3(24, 0.1, 6, '--panel2', [0, -0.05, -1], 'Лента времени.');
    },
    chips: [
      { t: '1920-е', small: 'расцвет', on: function (c) { c.pick(c.cols[4]); c.setView(-0.1, 1.15, 14, 3.5); } },
      { t: '1930–1950-е', small: 'спад', on: function (c) { c.pick(c.cols[5]); c.setView(0.15, 1.15, 14, 2); } },
      { t: '1960–1980-е', small: 'бум', on: function (c) { c.pick(c.cols[6]); c.setView(0.35, 1.15, 14, 3.5); } }
    ]
  });

  /* ---------- 2. Четыре школы 1920-х ---------- */
  reg('tu3-schools', {
    title: 'Четыре научные школы 1920-х', lead: 'Четыре колонны держат общую крышу — науку об управлении 1920-х. Нажми на колонну, чтобы увидеть представителей.',
    radius: 18, phi: 1.1, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      var S = [
        ['НОТ', '#f0c36b', 'Гастев, Керженцев, Ерманский, Журавский', 'рациональная организация труда и времени'],
        ['Социально-психологическая', '#4cc38a', 'Витке, Щёголев, Дрезен', 'человек и коллектив в организации'],
        ['Административно-организационная', '#7aa2ff', 'Дунаевский, Розмирович', 'устройство управленческого аппарата'],
        ['Тектологическая', '#c9b6f0', 'Богданов', 'всеобщая наука об организации']
      ];
      c.pil = S.map(function (s, i) {
        var a = i / 4 * Math.PI * 2 + Math.PI / 4, x = Math.sin(a) * 3.2, z = Math.cos(a) * 3.2;
        var m = c.mesh(new T.CylinderGeometry(0.7, 0.85, 5, 20), s[1], '<b>' + s[0] + ' школа</b>. ' + s[2] + '. Главное: ' + s[3] + '.');
        m.position.set(x, 2.5, z);
        c.label(s[0], [x * 1.45, 1.2, z * 1.45], 0.42, s[1]);
        return m;
      });
      var roof = c.mesh(new T.CylinderGeometry(0.2, 5, 1.6, 4), '#e8dcc4', 'Общая крыша: в 1920-е СССР — одна из мировых столиц науки об управлении. ЦИТ Гастева — первый в мире институт такого рода.');
      roof.rotation.y = Math.PI / 4; roof.position.y = 5.8;
      c.box3(9, 0.4, 9, '#3a4270', [0, 0, 0], 'Основание: потребность восстановить хозяйство после Гражданской войны.');
      c.label('1920-е', [0, 7.4, 0], 0.7, '#f0c36b');
    },
    chips: [
      { t: 'НОТ', small: 'труд и время', on: function (c) { c.pick(c.pil[0]); } },
      { t: 'Соц.-психол.', small: 'коллектив', on: function (c) { c.pick(c.pil[1]); } },
      { t: 'Адм.-орг.', small: 'аппарат', on: function (c) { c.pick(c.pil[2]); } },
      { t: 'Тектология', small: 'Богданов', on: function (c) { c.pick(c.pil[3]); } }
    ]
  });

  /* ---------- 3. Гастев: узкая база и 7 трудовых установок ---------- */
  reg('tu3-gastev', {
    title: 'ЦИТ Гастева: удар молотком', lead: 'В центре — тренажёр ЦИТ: молоток бьёт по наковальне по выверенной траектории. Вокруг — семь трудовых установок, по которым идёт светящийся шарик.',
    radius: 18, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      var anv = c.box3(2, 1, 1, '#5b6170', [0, 0.9, 0], '<b>Наковальня-тренажёр ЦИТ.</b> Сначала стойка, хват и траектория — и только потом настоящий инструмент.');
      c.box3(1.2, 0.8, 0.8, '#454a57', [0, 0.2, 0], 'Основание тренажёра.');
      var pivot = new T.Group(); pivot.position.set(-1.8, 1.9, 0); c.root.add(pivot);
      var handle = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 2.2, 10), c.mat('#9a6b3a')); handle.rotation.z = Math.PI / 2; handle.position.x = 1.1; pivot.add(handle);
      var head = new T.Mesh(new T.BoxGeometry(0.4, 0.6, 0.4), c.mat('#9aa2c0', { metalness: 0.7, roughness: 0.3 })); head.position.x = 2.1; head.castShadow = true; pivot.add(head);
      head.userData.info = '<b>«Узкая база»</b>: начать с простейшего движения и довести его до совершенства. Так ЦИТ за месяцы готовил рабочего, на которого раньше уходили годы.';
      var arc = []; for (var k = 0; k <= 20; k++) { var a = -0.1 + k / 20 * 1.6; arc.push(new T.Vector3(-1.8 + Math.cos(a) * 2.1, 1.9 + Math.sin(a) * 2.1, 0.4)); }
      c.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(arc), 40, 0.03, 6), '#f0c36b', 'Выверенная траектория удара.');
      var U = ['Планировать действие', 'Выполнять точно', 'Контролировать результат', 'Экономить движения', 'Поддерживать рабочее место', 'Анализировать ошибки', 'Повышать мастерство'];
      var ring = [];
      U.forEach(function (u, i) {
        var a = i / 7 * Math.PI * 2, x = Math.sin(a) * 6, z = Math.cos(a) * 6;
        c.box3(1.3, 0.5, 1.3, '#4cc38a', [x, 0.25, z], '<b>Установка ' + (i + 1) + ':</b> ' + u.toLowerCase() + '.');
        c.label((i + 1) + '. ' + u, [x, 1.1, z], 0.38, '#4cc38a');
        ring.push(new T.Vector3(x, 0.8, z));
      });
      var cv = new T.CatmullRomCurve3(ring, true);
      var dot = c.mesh(new T.SphereGeometry(0.22, 14, 10), '#ffffff', null, { emissive: c.color('#ffffff'), emissiveIntensity: 0.8 });
      c.onFrame(function (t) { var s = (t * 1.6) % 1; pivot.rotation.z = s < 0.6 ? 1.5 - s / 0.6 * 1.6 : -0.1 + (s - 0.6) / 0.4 * 1.6; dot.position.copy(cv.getPointAt(W((t * 0.06) % 1))); });
    },
    chips: [
      { t: 'Тренажёр', small: 'узкая база', on: function (c) { c.setView(0, 1.25, 8, 1.6); c.say('Гастев: рабочий — <b>активный участник</b> производства, а не «придаток машины». Его учат самого думать, как сделать лучше.'); } },
      { t: 'Установки', small: '7 шагов', on: function (c) { c.setView(0.4, 0.75, 18, 0.5); c.say('Цикл установок по кругу — прообраз <b>кайдзен</b> и бережливого производства: постоянное улучшение.'); } }
    ]
  });

  /* ---------- 4. Административная ёмкость Дунаевского ---------- */
  reg('tu3-capacity', {
    title: 'Административная ёмкость руководителя', lead: 'Сосуд — ёмкость руководителя. Каждый шарик — подчинённый или поручение. Добавляй подчинённых: когда сосуд переполнен, контроль теряется. Делегирование делит нагрузку.',
    radius: 16, phi: 1.05, targetY: 2.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { n: 5, split: 0 };
      function vessel(x) {
        var g = new T.Group(); g.position.x = x; c.root.add(g);
        var glass = new T.Mesh(new T.CylinderGeometry(1.4, 1.2, 4, 32, 1, true), c.mat('#9fc0ff', { transparent: true, opacity: 0.25, side: T.DoubleSide })); glass.position.y = 2; g.add(glass);
        glass.userData.info = '<b>Административная ёмкость</b> (Ф. Дунаевский) — способность руководителя обрабатывать информацию, принимать решения, координировать и контролировать.';
        var bot = new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 0.15, 32), c.mat('#7aa2ff')); bot.position.y = 0.07; g.add(bot);
        return g;
      }
      c.v1 = vessel(0); c.v2 = vessel(4); c.v2.visible = false;
      c.balls = [];
      for (var i = 0; i < 16; i++) { var b = c.mesh(new T.SphereGeometry(0.42, 16, 12), '#f0c36b', 'Подчинённый или поручение.'); c.balls.push(b); }
      var head = c.mesh(new T.SphereGeometry(0.5, 20, 14), '#c9b6f0', 'Руководитель.'); head.position.set(0, 5, -2);
      c.status = c.label('норма', [0, 5.8, 0], 0.6, '#4cc38a');
      c.onFrame(function (t) {
        var n = S.n, cap = 7;
        c.v2.visible = !!S.split;
        c.balls.forEach(function (b, i) {
          b.visible = i < n;
          var inSecond = S.split && i >= Math.ceil(n / 2), k = inSecond ? i - Math.ceil(n / 2) : i;
          var x = (inSecond ? 4 : 0) + ((k % 3) - 1) * 0.8, y = 0.55 + Math.floor(k / 3) * 0.75, z = (Math.floor(k / 3) % 2) * 0.35 - 0.15;
          if (k >= cap + 1) { y = 0.5 + Math.abs(Math.sin(t * 2 + i)) * 0.3; x = (inSecond ? 4 : 0) + 2 + (k - cap) * 0.5; z = 1.6; }
          b.position.x += (x - b.position.x) * 0.1; b.position.y += (y - b.position.y) * 0.1; b.position.z += (z - b.position.z) * 0.1;
          b.material.color.set(k >= cap ? '#ef6b5b' : '#f0c36b');
        });
      });
    },
    chips: [
      { t: '5 человек', small: 'норма', on: function (c) { c.state.n = 5; c.state.split = 0; c.say('5 подчинённых — укладывается в <b>норму управляемости</b> (span of control, обычно 5–7 для сложной работы).'); } },
      { t: '12 человек', small: 'перегруз', on: function (c) { c.state.n = 12; c.state.split = 0; c.say('Сосуд переполнен: решения запаздывают, контроль теряется — красные шарики «переливаются» через край.'); } },
      { t: 'Делегировать', small: '+ уровень', on: function (c) { c.state.n = 12; c.state.split = 1; c.say('Выход: <b>делегировать</b> полномочия или добавить уровень управления — нагрузка делится на два сосуда.'); } }
    ]
  });

  /* ---------- 5. Командная система: спринтер, а не марафонец ---------- */
  reg('tu3-command', {
    title: 'Административно-командная система', lead: 'Пирамида — вертикаль приказов: центр → наркоматы → тресты → заводы. Справа — объём производства (оранжевый) и качество/инновации (синий) во времени.',
    radius: 22, phi: 1.05, targetY: 2.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { t0: 0 };
      var lv = [['Центр, Госплан', 1, '#ef6b5b'], ['Наркоматы (отрасли)', 3, '#c46a3a'], ['Тресты', 5, '#9a7b5b'], ['Заводы', 8, '#6b5b4a']];
      lv.forEach(function (l, i) {
        var y = 6.5 - i * 1.8;
        for (var k = 0; k < l[1]; k++) c.box3(0.9, 0.9, 0.9, l[2], [-6 + (k - (l[1] - 1) / 2) * 1.1, y, 0], '<b>' + l[0] + '.</b> Вертикальное подчинение, директивное планирование, отраслевой принцип.');
        c.label(l[0], [-11.5, y, 0], 0.42, l[2]);
        if (i < 3) arrow(c, [-6, y - 0.5, 0.8], [-6, y - 1.35, 0.8], '#f0c36b', 'Приказы идут только <b>сверху вниз</b>. Самостоятельность предприятий ограничена.');
      });
      c.box3(9, 0.1, 0.1, '#9aa2c0', [5, 0, 0]); c.box3(0.1, 7, 0.1, '#9aa2c0', [0.5, 3.5, 0]);
      c.label('время →', [9.2, -0.5, 0], 0.4, '#9aa2c0');
      c.qty = []; c.qual = [];
      for (var i = 0; i < 10; i++) {
        var h = i < 4 ? 0.6 + i * 1.5 : 5.1 + (i - 4) * 0.12, q = Math.max(0.3, 2.5 - i * 0.2);
        c.qty.push(c.box3(0.35, h, 0.6, '#ff8f66', [1.1 + i * 0.85, h / 2, -0.4], '<b>Объём производства («вал»)</b>: быстрый мобилизационный рывок, потом рост замедляется.'));
        c.qual.push(c.box3(0.35, q, 0.6, '#7aa2ff', [1.1 + i * 0.85, q / 2, 0.5], '<b>Качество и инновации</b>: формализм, искажение отчётности, низкое качество — для долгого развития система не годится.'));
      }
      c.label('рывок', [3.2, 6.6, 0], 0.5, '#ff8f66');
      c.onFrame(function (t) {
        var k = ((t - S.t0) * 2.5) % 14;
        c.qty.forEach(function (m, i) { m.visible = i < k; }); c.qual.forEach(function (m, i) { m.visible = i < k; });
      });
    },
    chips: [
      { t: 'Спринт', small: 'мобилизация', on: function (c) { c.setView(0.6, 1.05, 14, 3); c.say('Плюсы: быстрая мобилизация ресурсов, новые отрасли, оборона, кадры. Это <b>спринтер</b>.'); } },
      { t: 'Марафон', small: 'издержки', on: function (c) { c.setView(0.9, 1.0, 13, 2); c.say('Минусы: централизация, ведомственность, формализм, страх, низкое качество. Для <b>марафона</b> — стабильного и инновационного развития — нужна другая организация.'); } }
    ]
  });

  /* ---------- 6. Канторович: линейное программирование ---------- */
  reg('tu3-kantorovich', {
    title: 'Канторович: лучший план при ограничениях', lead: 'Учебный пример. Плоский многоугольник — все планы, которые станки позволяют выполнить (x — фанера марки A, y — марки B). Высота крыши — выпуск 3x + 2y. Оптимум — в самой высокой вершине.',
    radius: 17, phi: 0.95, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, s = 2.3, hz = 0.38;
      var P = [[0, 0], [3, 0], [2, 2], [1.5, 2.5], [0, 3]];
      function f(p) { return 3 * p[0] + 2 * p[1]; }
      var base = [], roof = [];
      P.forEach(function (p) { base.push(new T.Vector3(p[0] * s - 3.4, 0, -p[1] * s + 3.4)); roof.push(new T.Vector3(p[0] * s - 3.4, 0.2 + f(p) * hz, -p[1] * s + 3.4)); });
      function fan(pts) { var g = new T.BufferGeometry(), a = []; for (var i = 1; i < pts.length - 1; i++) [pts[0], pts[i], pts[i + 1]].forEach(function (v) { a.push(v.x, v.y, v.z); }); g.setAttribute('position', new T.Float32BufferAttribute(a, 3)); g.computeVertexNormals(); return g; }
      c.mesh(fan(base), '#3e6b8f', '<b>Область допустимых планов</b>: x + y ≤ 4, 2x + y ≤ 6, x + 3y ≤ 9 — ограничения по станкам и сырью.', { side: T.DoubleSide });
      c.mesh(fan(roof), '#f0c36b', '<b>Целевая функция</b> 3x + 2y — сколько продукции даёт план. Её надо сделать максимальной.', { side: T.DoubleSide, transparent: true, opacity: 0.75 });
      for (var i = 0; i < P.length; i++) {
        var a = base[i], b = roof[i], h = b.y;
        var m = c.mesh(new T.CylinderGeometry(0.05, 0.05, h, 6), '#9aa2c0'); m.position.set(a.x, h / 2, a.z);
        var best = i === 2;
        var v = c.mesh(new T.SphereGeometry(best ? 0.32 : 0.2, 18, 12), best ? '#4cc38a' : '#e8dcc4', 'План (' + P[i][0] + '; ' + P[i][1] + '): выпуск = ' + f(P[i]) + (best ? '. <b>Это оптимум!</b>' : '.'), best ? { emissive: c.color('#4cc38a'), emissiveIntensity: 0.6 } : null);
        v.position.copy(b);
        c.label('(' + P[i][0] + '; ' + P[i][1] + ') → ' + f(P[i]), [b.x, b.y + 0.6, b.z], 0.38, best ? '#4cc38a' : '#eef0f8');
      }
      c.label('x — фанера A', [3, -0.4, 3.2], 0.45, '#9aa2c0');
      c.label('y — фанера B', [-3.6, -0.4, -2], 0.45, '#9aa2c0');
    },
    chips: [
      { t: 'Ограничения', small: 'станки', on: function (c) { c.setView(0.3, 0.25, 15, 0.5); c.say('Сверху видно многоугольник: любой план внутри выполним. Ленинградский фанерный трест, <b>1939</b>.'); } },
      { t: 'Оптимум', small: 'вершина', on: function (c) { c.setView(0.9, 1.2, 12, 2); c.say('Лучший план всегда в <b>вершине</b> многоугольника — здесь (2; 2), выпуск 10. Так родилось <b>линейное программирование</b>. Нобелевская премия — <b>1975</b>.'); } }
    ]
  });

  /* ---------- 7. Три пути после 1990-х ---------- */
  reg('tu3-roads', {
    title: 'Развилка 1990-х: три дороги', lead: 'Из одной точки расходятся три дороги. Нажми на дорогу, чтобы прочитать, куда она ведёт.',
    radius: 19, phi: 0.9, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.CylinderGeometry(0.9, 0.9, 0.4, 24), '#f0c36b', '<b>1990-е</b>: старая система разрушена, нужна новая теория управления.').position.set(0, 0.2, 5);
      c.label('1990', [0, 1.1, 5], 0.6, '#f0c36b');
      var R = [['Заимствование', 'копировать западные теории менеджмента как есть', '#7aa2ff', -1], ['Адаптация', 'приспособить западные теории к российскому социокультурному и историческому контексту', '#4cc38a', 0], ['Своя теория', 'создавать и развивать российскую теорию управления', '#ff8f66', 1]];
      c.roads = R.map(function (r) {
        var g = new T.Group(); c.root.add(g);
        var road = new T.Mesh(new T.BoxGeometry(1.4, 0.12, 9), c.mat(r[2])); road.position.z = -4.5; road.receiveShadow = true; g.add(road);
        road.userData.info = '<b>' + r[0] + '</b>: ' + r[1] + '.';
        g.position.set(0, 0.06, 4.5); g.rotation.y = r[3] * 0.55;
        var post = new T.Mesh(new T.BoxGeometry(2.6, 0.8, 0.1), c.mat('#e8dcc4')); post.position.set(0, 1.3, -9); g.add(post); post.userData.info = road.userData.info;
        var lb = c.label(r[0], [0, 2.3, -9], 0.55, r[2]); c.root.remove(lb); g.add(lb);
        return road;
      });
    },
    chips: [
      { t: 'Заимствовать', small: '1', on: function (c) { c.pick(c.roads[0]); } },
      { t: 'Адаптировать', small: '2', on: function (c) { c.pick(c.roads[1]); } },
      { t: 'Своё', small: '3', on: function (c) { c.pick(c.roads[2]); } }
    ]
  });
})();
