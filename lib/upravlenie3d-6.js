/* 3D-модели: «Теория управления. Лекция 6. Функции управления» (17.11). Движок — HubScene3d, помощники — TU3.
   В Markdown: @@graph:tu6-fayol@@ @@graph:tu6-posdcorb@@ @@graph:tu6-matrix@@ @@graph:tu6-classify@@ @@graph:tu6-cycle@@
   @@graph:tu6-smart@@ @@graph:tu6-horizons@@ @@graph:tu6-pdca@@ @@graph:tu6-gears@@ @@graph:tu6-motivation@@
   @@graph:tu6-control@@ @@graph:tu6-budget@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d || !window.TU3) return;
  var U = window.TU3, reg = U.reg;

  function man(c, x, y, z, col, info, s) {
    var T = c.THREE, g = new T.Group(); s = s || 1;
    var b = new T.Mesh(new T.CylinderGeometry(0.22 * s, 0.32 * s, 0.85 * s, 12), c.mat(col)); b.position.y = 0.43 * s; b.castShadow = true; g.add(b);
    var h = new T.Mesh(new T.SphereGeometry(0.22 * s, 14, 10), c.mat('#e8c6a0')); h.position.y = 1.05 * s; h.castShadow = true; g.add(h);
    g.position.set(x, y, z); if (info) g.userData.info = info; c.root.add(g); return g;
  }
  /* шестерёнка: тор + зубцы; возвращает группу */
  function gear(c, r, col, info, teeth) {
    var T = c.THREE, g = new T.Group(), m = c.mat(col);
    var disc = new T.Mesh(new T.CylinderGeometry(r, r, 0.4, 32), m); disc.rotation.x = Math.PI / 2; g.add(disc);
    var n = teeth || Math.round(r * 8);
    for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, t = new T.Mesh(new T.BoxGeometry(0.28, 0.32, 0.4), m); t.position.set(Math.cos(a) * (r + 0.12), Math.sin(a) * (r + 0.12), 0); t.rotation.z = a; g.add(t); }
    var hub = new T.Mesh(new T.CylinderGeometry(r * 0.25, r * 0.25, 0.5, 16), c.mat('#2a2f45')); hub.rotation.x = Math.PI / 2; g.add(hub);
    g.traverse(function (x) { x.castShadow = true; });
    if (info) g.userData.info = info; c.root.add(g); return g;
  }
  function glowOn(m, on, col, k) { if (!m.material || !m.material.emissive) return; m.material.emissive.set(on ? (col || m.material.color) : '#000000'); m.material.emissiveIntensity = on ? (k || 0.45) : 0; }
  function glowTree(o, on, col, k) { o.traverse(function (x) { if (x.material && !x.isSprite) glowOn(x, on, col, k); }); }
  function ease(a, b, k) { return a + (b - a) * (k || 0.08); }

  /* ---------- 1. Пять функций Файоля ---------- */
  reg('tu6-fayol', {
    title: 'Файоль: пять функций управления', lead: 'Пять шестерёнок вращаются вместе: если одна остановится — встанет всё. Нажми на шестерёнку или на кнопку.',
    radius: 17, phi: 1.2, targetY: 2.5,
    build: function (c) {
      var S = c.state = { k: -1 };
      c.ground(8);
      var F = [['предвидение', '#7aa2ff', 'изучать будущее и составлять программу действий. Сегодня — <b>планирование</b>.'],
        ['организация', '#4cc38a', 'строить «двойной организм» — материальный и социальный: люди, ресурсы, структура.'],
        ['распорядительство', '#ef8f5b', 'приводить организацию в действие, отдавать распоряжения. Сегодня — <b>руководство, мотивация</b>.'],
        ['координация', '#c9b6f0', 'связывать, объединять и согласовывать все действия и усилия.'],
        ['контроль', '#f0c36b', 'следить, чтобы всё происходило по принятой программе, правилам и приказам.']];
      c.g = F.map(function (f, i) {
        var a = i / 5 * Math.PI * 2 + Math.PI / 2, x = Math.cos(a) * 3.6, y = 3 + Math.sin(a) * 3.0;
        var g = gear(c, 1.25, f[1], '<b>' + (i + 1) + '. ' + f[0] + '</b> — ' + f[2], 10); g.position.set(x, y, 0);
        c.label(f[0], [x, y - 1.95, 0.6], 0.34, f[1]);
        return g;
      });
      var core = c.mesh(new c.THREE.SphereGeometry(0.8, 20, 14), '#ffffff', '<b>Управление</b> по Файолю = предвидеть + организовывать + распоряжаться + координировать + контролировать. «Общее и промышленное управление» (1916).');
      core.position.set(0, 3, 0);
      c.onFrame(function (t) {
        c.g.forEach(function (g, i) { g.rotation.z = t * (i % 2 ? 0.8 : -0.8); var on = S.k === i; g.scale.setScalar(ease(g.scale.x, on ? 1.25 : 1)); glowTree(g, on); });
        core.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      });
    },
    chips: [
      { t: 'Предвидение', small: '= планирование', on: function (c) { c.setView(0, 1.3, 15, 3); c.state.k = 0; c.say('<b>Предвидение</b>: изучать будущее и составлять программу действий. Это то, что сегодня называют <b>планированием</b>.'); } },
      { t: 'Организация', small: '', on: function (c) { c.setView(0, 1.3, 15, 3); c.state.k = 1; c.say('<b>Организация</b>: создать «двойной организм» предприятия — материальный (оборудование, сырьё) и социальный (люди, структура).'); } },
      { t: 'Распорядительство', small: '= руководство', on: function (c) { c.setView(0, 1.3, 15, 3); c.state.k = 2; c.say('<b>Распорядительство</b>: привести организацию в действие. Сегодня ближе всего — <b>руководство</b> и <b>мотивация</b>.'); } },
      { t: 'Координация', small: '', on: function (c) { c.setView(0, 1.3, 15, 3); c.state.k = 3; c.say('<b>Координация</b>: связать и согласовать все действия, чтобы части не мешали друг другу.'); } },
      { t: 'Контроль', small: '', on: function (c) { c.setView(0, 1.3, 15, 3); c.state.k = 4; c.say('<b>Контроль</b>: проверять, всё ли идёт по программе. Названия у Файоля «непривычные», но суть функций та же, что и сегодня.'); } }
    ]
  });

  /* ---------- 2. POSDCORB ---------- */
  reg('tu6-posdcorb', {
    title: 'POSDCORB: семь букв — семь функций', lead: 'Гьюлик и Урвик (1937) — последователи Файоля. Нажимай на кнопки: блоки складываются в слово. Цветом показано, откуда функция «пришла» у Файоля.',
    radius: 19, phi: 1.15, targetY: 1.6,
    build: function (c) {
      var T = c.THREE, S = c.state = { n: 7, k: -1 };
      c.ground(9);
      var L = [['P', 'Planning', 'планирование', '#7aa2ff', 'у Файоля — предвидение'],
        ['O', 'Organizing', 'организация', '#4cc38a', 'у Файоля — организация'],
        ['S', 'Staffing', 'кадры: подбор, расстановка, обучение', '#5fd0d0', 'новая функция: у Файоля её не было отдельно'],
        ['D', 'Directing', 'руководство', '#ef8f5b', 'у Файоля — распорядительство'],
        ['CO', 'Coordinating', 'координация', '#c9b6f0', 'у Файоля — координация'],
        ['R', 'Reporting', 'отчётность, информирование', '#e88bb0', 'новая функция: информировать руководство и подчинённых'],
        ['B', 'Budgeting', 'бюджетирование', '#f0c36b', 'новая функция: финансовое планирование, учёт и контроль']];
      c.b = L.map(function (l, i) {
        var x = (i - 3) * 2, w = l[0].length > 1 ? 1.9 : 1.5;
        var b = c.box3(w, 1.6, 1, l[3], [x, 0.8, 0], '<b>' + l[0] + ' — ' + l[1] + '</b>: ' + l[2] + '. ' + l[4] + '.');
        c.label(l[0], [x, 0.85, 0.75], 0.62, '#ffffff'); c.label(l[2].split(':')[0], [x, 2.2, 0], 0.27, l[3]);
        b.userData.x = x; return b;
      });
      c.onFrame(function (t) {
        c.b.forEach(function (b, i) {
          var on = i < S.n, y = on ? 0.8 : 6 + i * 0.4;
          b.position.y = ease(b.position.y, y, 0.07); b.visible = b.position.y < 9;
          var hi = S.k === i; glowOn(b, hi); b.scale.y = hi ? 1.2 + Math.sin(t * 4) * 0.05 : 1;
        });
      });
    },
    chips: [
      { t: 'Собрать', small: 'все 7', on: function (c) { c.state.n = 7; c.state.k = -1; c.setView(0, 1.15, 17, 1.4); c.say('<b>P-O-S-D-CO-R-B</b>: планирование, организация, кадры, руководство, координация, отчётность, бюджетирование. Не 5 функций, как у Файоля, а 7.'); } },
      { t: 'S', small: 'кадры', on: function (c) { c.state.n = 7; c.state.k = 2; c.setView(-0.2, 1.1, 10, 1.4); c.say('<b>S — Staffing</b>: подбор, расстановка, обучение кадров. Новая функция — сегодня её выполняет отдел кадров / управление персоналом.'); } },
      { t: 'R', small: 'отчётность', on: function (c) { c.state.n = 7; c.state.k = 5; c.setView(0.25, 1.1, 10, 1.4); c.say('<b>R — Reporting</b>: держать в курсе руководство и подчинённых — отчёты, исследования, информирование.'); } },
      { t: 'B', small: 'бюджет', on: function (c) { c.state.n = 7; c.state.k = 6; c.setView(0.4, 1.1, 10, 1.4); c.say('<b>B — Budgeting</b>: бюджетирование — финансовое планирование, учёт и контроль. Сегодня оно стало целой системой.'); } },
      { t: 'Разобрать', small: 'по буквам', on: function (c) { c.state.n = 0; c.state.k = -1; c.say('Блоки улетели. Нажми «Собрать» и проговори вслух расшифровку каждой буквы — так запоминается быстрее.'); } }
    ]
  });

  /* ---------- 3. Матрица функций у разных авторов ---------- */
  reg('tu6-matrix', {
    title: 'Матрица: какие функции выделяют разные авторы', lead: 'Ряды — авторы, столбцы — функции. Есть кубик — функция у автора есть. Две функции стоят «стеной» у всех: планирование и организация.',
    radius: 22, phi: 1.0, targetY: 1.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(11);
      var FN = ['планирование', 'организация', 'кадры', 'руководство', 'координация', 'мотивация', 'контроль', 'отчётность', 'бюджет'];
      var AU = [['Файоль', [1, 1, 0, 1, 1, 0, 1, 0, 0]], ['Гьюлик, Урвик', [1, 1, 1, 1, 1, 0, 0, 1, 1]], ['Кунц, О\'Доннел', [1, 1, 1, 1, 0, 0, 1, 0, 0]], ['Мескон и др.', [1, 1, 0, 0, 0, 1, 1, 0, 0]]];
      c.cubes = [];
      FN.forEach(function (f, j) { c.label(f, [(j - 4) * 1.9, 0.2, 5.2], 0.28, j < 2 ? '#f0c36b' : '#9aa2c0'); });
      AU.forEach(function (a, i) {
        var z = (i - 1.5) * 2.4; c.label(a[0], [-10.6, 0.6, z], 0.32, '#ffffff');
        a[1].forEach(function (v, j) {
          if (!v) return;
          var col = j < 2 ? '#f0c36b' : '#7aa2ff', m = c.box3(1.3, 1.3, 1.3, col, [(j - 4) * 1.9, 0.65, z], '<b>' + a[0] + '</b>: функция «' + FN[j] + '». ' + (j < 2 ? 'Есть у <b>всех</b> авторов.' : ''));
          m.userData.j = j; c.cubes.push(m);
        });
      });
      c.onFrame(function (t) {
        c.cubes.forEach(function (m) {
          var j = m.userData.j, all = j < 2, rare = j === 7 || j === 8 || j === 5;
          var on = S.mode === 1 ? all : S.mode === 2 ? rare : false;
          glowOn(m, on); m.position.y = 0.65 + (on ? 0.4 + Math.sin(t * 3 + j) * 0.15 : 0);
        });
      });
      /* [ДОБАВЛЕНО] наборы функций по учебникам */
    },
    chips: [
      { t: 'Матрица', small: 'обзор', on: function (c) { c.state.mode = 0; c.setView(0, 1.0, 22, 1); c.say('Классификаций <b>очень много</b>. Лектор не даёт им оценок: любой «ряд» матрицы показывает, какие виды деятельности обязательны в управлении. <b>[ДОБАВЛЕНО]</b> Наборы функций авторов — по учебникам.'); } },
      { t: 'Есть у всех', small: 'планирование, организация', on: function (c) { c.state.mode = 1; c.setView(-0.3, 0.9, 16, 1); c.say('<b>Планирование</b> и <b>организация</b> «путешествуют» из квадрата в квадрат — они есть совершенно везде.'); } },
      { t: 'Редкие', small: 'у 1–2 авторов', on: function (c) { c.state.mode = 2; c.setView(0.3, 0.9, 16, 1); c.say('Есть и <b>редкие</b> функции: например, бюджетирование, отчётность, мотивация, лидерство, обучение. Их выделяют, когда позволяет размер организации и содержание управленческого труда.'); } }
    ]
  });

  /* ---------- 4. Классификации функций ---------- */
  reg('tu6-classify', {
    title: 'Семь способов разложить функции', lead: 'В центре — функции управления. Каждое кольцо — один критерий классификации. Нажми на кнопку: кольцо поднимется, и появятся виды функций.',
    radius: 19, phi: 1.0, targetY: 2.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { k: -1 };
      c.ground(9);
      var K = [['по содержанию', '#7aa2ff', ['планирование', 'организация', 'контроль']],
        ['общие / специальные', '#4cc38a', ['общие', 'специальные']],
        ['по уровню', '#ef8f5b', ['высший', 'средний', 'линейный']],
        ['по объекту', '#c9b6f0', ['финансы', 'персонал', 'производство']],
        ['внутренние / внешние', '#5fd0d0', ['внутренние', 'внешние']],
        ['базовые / связующие', '#f0c36b', ['базовые', 'связующие']],
        ['традиционные / современные', '#e88bb0', ['традиционные', 'современные']]];
      var core = c.mesh(new T.CylinderGeometry(0.9, 0.9, 5.6, 24), '#ffffff', '<b>Функции управления.</b> Одни и те же функции можно разложить по-разному — смотря какой критерий выбрать.'); core.position.y = 2.8;
      c.rings = K.map(function (k, i) {
        var r = c.mesh(new T.TorusGeometry(1.9, 0.18, 10, 50), k[1], '<b>Критерий: ' + k[0] + '.</b>'); r.rotation.x = Math.PI / 2; r.userData.y0 = 0.5 + i * 0.75; r.position.y = r.userData.y0;
        var kids = k[2].map(function (n, j) {
          var a = j / k[2].length * Math.PI * 2, m = c.box3(1.6, 0.5, 0.7, k[1], [Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2], '<b>' + n + '</b> (' + k[0] + ').');
          var lb = c.label(n, [Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2], 0.3, k[1]); m.userData.a = a; m.userData.lb = lb; return m;
        });
        return { r: r, kids: kids, name: k[0] };
      });
      c.onFrame(function (t) {
        c.rings.forEach(function (q, i) {
          var on = S.k === i, y = on ? 6.4 : q.r.userData.y0;
          q.r.position.y = ease(q.r.position.y, y); q.r.scale.setScalar(ease(q.r.scale.x, on ? 1.3 : 1));
          q.kids.forEach(function (m) {
            m.visible = on; var a = m.userData.a + t * 0.3; m.position.set(Math.cos(a) * 4.2, q.r.position.y, Math.sin(a) * 4.2);
            if (m.userData.lb) { m.userData.lb.visible = on; m.userData.lb.position.set(m.position.x, m.position.y + 0.8, m.position.z); }
          });
        });
      });
    },
    chips: [
      { t: 'Содержание', small: '1', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 0; c.say('<b>По содержанию</b>: планирование, организация, мотивация, контроль и т. д. — то, что в матрице авторов.'); } },
      { t: 'Общие / спец.', small: '2', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 1; c.say('<b>Общие</b> есть везде, даже в маленьком коллективе. <b>Специальные</b> — когда разделение управленческого труда развито, позволяют <b>размеры, цели и ресурсы</b> организации.'); } },
      { t: 'Уровень', small: '3', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 2; c.say('<b>По уровню управления</b>: одни функции только наверху, а непосредственное руководство и контроль операций — на <b>линейном</b> (низовом) уровне.'); } },
      { t: 'Объект', small: '4', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 3; c.say('<b>По объекту</b>: управление финансами, персоналом, производством… Но внутри — <b>те же</b> планирование, организация, контроль!'); } },
      { t: 'Внутр. / внешн.', small: '5', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 4; c.say('<b>Внутренние</b> и <b>внешние</b>: организация — открытая система. Внешняя функция — например, взаимодействие бизнеса и власти. Такую классификацию предлагает автор учебника.'); } },
      { t: 'Базовые / связ.', small: '6', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 5; c.say('<b>По месту в цикле</b>: базовые и <b>связующие</b> (коммуникация, принятие решений) — они присутствуют на каждом этапе каждой базовой функции.'); } },
      { t: 'Трад. / совр.', small: '7', on: function (c) { c.setView(0.3, 1.05, 17, 3.5); c.state.k = 6; c.say('<b>Оценочная</b>: традиционные и «прогрессивные». Время летит: управление качеством или знаниями когда-то было новинкой, а теперь — классика.'); } }
    ]
  });

  /* ---------- 5. Управленческий цикл ---------- */
  reg('tu6-cycle', {
    title: 'Управленческий цикл: базовые функции и связующие процессы', lead: 'По кольцу бегут четыре базовые функции. В центре — связующие: коммуникация и принятие решений. Лучи от центра показывают: они нужны на каждом шаге.',
    radius: 18, phi: 0.95, targetY: 1.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(8);
      var F = [['планирование', '#7aa2ff', 'Определить цели, пути, ресурсы. <b>Отправная точка</b> цикла.'], ['организация', '#4cc38a', 'Распределить задачи, полномочия, ответственность, ресурсы.'], ['мотивация', '#ef8f5b', 'Побудить людей действовать, совместив цели организации и их потребности.'], ['контроль', '#f0c36b', 'Сравнить результаты с целями; при отклонении — скорректировать.']];
      c.st = F.map(function (f, i) {
        var a = -i / 4 * Math.PI * 2 + Math.PI / 2, x = Math.cos(a) * 5, z = Math.sin(a) * 5;
        var m = c.mesh(new T.CylinderGeometry(1.1, 1.1, 0.9, 24), f[1], '<b>' + f[0] + '</b> — базовая функция. ' + f[2]); m.position.set(x, 0.45, z);
        c.label(f[0], [x, 1.6, z], 0.38, f[1]); return m;
      });
      var ring = U.tube(c, [[0, 0.45, 5], [5, 0.45, 0], [0, 0.45, -5], [-5, 0.45, 0]], '#9aa2c0', 0.07, true, '<b>Цикл замкнутый</b> — это целостность. Нельзя сказать «здесь закончился контроль, началось планирование»: процесс непрерывный.');
      var run = U.movers(c, ring.userData.curve, '#ffffff', 0.12, 3, 0.2);
      var hub = c.mesh(new T.SphereGeometry(1.1, 20, 14), '#c9b6f0', '<b>Связующие процессы</b>: коммуникация и принятие решений. Связывают весь цикл.', { emissive: c.color('#c9b6f0'), emissiveIntensity: 0.3 }); hub.position.y = 2.2;
      c.label('коммуникация', [-1.5, 3.7, 0], 0.32, '#c9b6f0'); c.label('решения', [1.5, 3.7, 0], 0.32, '#c9b6f0');
      c.rays = c.st.map(function (m) { return U.link(c, [0, 2.2, 0], [m.position.x, 0.9, m.position.z], '#c9b6f0', 0.05); });
      c.onFrame(function (t) {
        var k = Math.floor((t * 0.12 * 4) % 4);
        c.st.forEach(function (m, i) { var on = S.mode === 0 ? i === (3 - k + 1) % 4 || false : S.mode === 2 && i === 0; glowOn(m, on); m.scale.y = on ? 1.3 : 1; });
        c.rays.forEach(function (r) { r.visible = S.mode === 1; });
        hub.scale.setScalar(S.mode === 1 ? 1.25 + Math.sin(t * 3) * 0.08 : 1);
        run.forEach(function (s) { s.visible = S.mode !== 1; });
      });
    },
    chips: [
      { t: 'Цикл', small: 'непрерывный', on: function (c) { c.state.mode = 0; c.setView(0.4, 0.9, 16, 1); c.say('Функции <b>взаимосвязаны</b> и реализуются <b>непрерывно</b>. Цикл замкнутый — это целостность. <b>[ДОБАВЛЕНО]</b> Четыре базовые функции — по Мескону, Альберту и Хедоури.'); } },
      { t: 'Связующие', small: 'на каждом шаге', on: function (c) { c.state.mode = 1; c.setView(0.2, 0.7, 14, 1.5); c.say('<b>Связующие</b> процессы — коммуникация и принятие решений — присутствуют на <b>каждом этапе</b>, при реализации <b>каждой</b> базовой функции.'); } },
      { t: 'Старт', small: 'планирование', on: function (c) { c.state.mode = 2; c.setView(1.57, 0.9, 13, 1); c.say('С чего начинается управление? <b>С планирования</b>, а не с мотивации. Без него остальные звенья цикла не имеют смысла.'); } }
    ]
  });

  /* ---------- 6. SMART ---------- */
  reg('tu6-smart', {
    title: 'SMART: из тумана — в мишень', lead: 'Слева — «облако» расплывчатой цели. Включай критерии по одному: облако сжимается и превращается в точную мишень. Когда все пять — стрела попадает.',
    radius: 17, phi: 1.15, targetY: 2.6,
    build: function (c) {
      var T = c.THREE, S = c.state = { on: [0, 0, 0, 0, 0] };
      c.ground(8);
      var L = [['S', 'конкретная', '#7aa2ff'], ['M', 'измеримая', '#4cc38a'], ['A', 'достижимая', '#ef8f5b'], ['R', 'значимая', '#c9b6f0'], ['T', 'ограничена во времени', '#f0c36b']];
      c.L = L.map(function (l, i) {
        var x = (i - 2) * 2.1, b = c.box3(1.5, 1.5, 1.5, l[2], [x, 0.75, 3], '<b>' + l[0] + '</b> — ' + l[1] + '.');
        c.label(l[0], [x, 0.8, 3.8], 0.6, '#ffffff'); c.label(l[1], [x, 1.9, 3], 0.26, l[2]); return b;
      });
      var cloud = new T.Group(); for (var i = 0; i < 14; i++) { var s = new T.Mesh(new T.SphereGeometry(0.5 + Math.random() * 0.5, 14, 10), c.mat('#9aa2c0', { transparent: true, opacity: 0.55 })); s.position.set((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5); cloud.add(s); }
      cloud.position.set(0, 4.5, -2); cloud.userData.info = '<b>Расплывчатая цель</b>: «хорошо учиться», «построить общество знаний». Каждый понимает её по-своему.'; c.root.add(cloud); c.cloud = cloud;
      var tg = new T.Group(); ['#ef6b5b', '#ffffff', '#ef6b5b', '#ffffff', '#ef6b5b'].forEach(function (col, i) { var r = new T.Mesh(new T.CylinderGeometry(1.6 - i * 0.3, 1.6 - i * 0.3, 0.12 + i * 0.02, 32), c.mat(col)); r.rotation.x = Math.PI / 2; r.position.z = i * 0.02; tg.add(r); });
      tg.position.set(0, 4.5, -2); tg.userData.info = '<b>SMART-цель</b>: «сдать зачёт 24 декабря, ответив на все вопросы карточки».'; c.root.add(tg); c.tg = tg;
      var arrow = U.arrow(c, [0, 4.5, 7], [0, 4.5, 5.6], '#f0c36b', '<b>Стрела</b> попадает, только если цель соответствует всем пяти критериям.', 0.07); c.arrow = arrow;
      c.onFrame(function (t) {
        var n = S.on.reduce(function (a, b) { return a + b; }, 0), k = n / 5;
        c.L.forEach(function (b, i) { glowOn(b, !!S.on[i]); b.position.y = S.on[i] ? 1 + Math.sin(t * 3 + i) * 0.1 : 0.75; });
        c.cloud.scale.setScalar(ease(c.cloud.scale.x, 1 - k * 0.95)); c.cloud.rotation.y = t * 0.3; c.cloud.visible = k < 1;
        c.tg.scale.setScalar(ease(c.tg.scale.x, Math.max(0.01, k)));
        var z = n === 5 ? ((t * 0.5) % 1) : 0; c.arrow.position.z = n === 5 ? 7 - z * 7.6 : 7; c.arrow.visible = n === 5;
      });
    },
    chips: [
      { t: 'S', small: 'конкретная', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on[0] = 1; c.say('<b>S — Specific, конкретная.</b> Все понимают её одинаково. Пример лектора: «общество знаний» — у каждого автора своё понимание, такая цель не годится.'); } },
      { t: 'M', small: 'измеримая', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on[1] = 1; c.say('<b>M — Measurable, измеримая.</b> Какие параметры измерить, чтобы понять, что цель достигнута.'); } },
      { t: 'A', small: 'достижимая', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on[2] = 1; c.say('<b>A — Achievable, достижимая.</b> Не «заоблачная»: понятно, <b>когда</b> и <b>какими ресурсами</b> её достичь.'); } },
      { t: 'R', small: 'значимая', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on[3] = 1; c.say('<b>R — Relevant, значимая.</b> Ведёт к нужному изменению объекта, а не «делать ради делать».'); } },
      { t: 'T', small: 'срок', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on[4] = 1; c.say('<b>T — Time-bound, ограничена во времени.</b> Любой управленческий процесс ограничен по времени и заканчивается достижением цели.'); } },
      { t: 'Сброс', small: 'снова туман', on: function (c) { c.setView(0, 1.2, 15, 3); c.state.on = [0, 0, 0, 0, 0]; c.say('Цель снова расплывчатая. Включи пять критериев по порядку и проговори каждый.'); } }
    ]
  });

  /* ---------- 7. Горизонты планирования ---------- */
  reg('tu6-horizons', {
    title: 'Горизонты планирования: от нацпроекта до квартала', lead: 'Лестница: наверху — стратегические цели, внизу — оперативные шаги. Шарик идёт снизу вверх: только через короткие шаги можно добраться до большой цели.',
    radius: 19, phi: 1.1, targetY: 3,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(9);
      var G = [['национальные цели развития', '#f0c36b', 'стратегический уровень государства'], ['национальные проекты', '#ef8f5b', 'стратегия → проекты'], ['федеральные и региональные проекты, госпрограммы', '#c9b6f0', 'сложная иерархия внутри нацпроектов'], ['год', '#7aa2ff', 'оперативный горизонт'], ['полугодие, квартал', '#5fd0d0', 'оперативный горизонт'], ['месяц', '#4cc38a', 'оперативный горизонт']];
      var ST = [['диплом через 4 года', '#f0c36b'], ['курс', '#ef8f5b'], ['', '#c9b6f0'], ['сессия', '#7aa2ff'], ['промежуточная аттестация', '#5fd0d0'], ['семинары, тесты', '#4cc38a']];
      c.steps = G.map(function (g, i) {
        var lvl = 5 - i, b = c.box3(3, 0.6, 2.2, g[1], [-5 + lvl * 2, 0.3 + lvl * 1.1, 0], '<b>' + g[0] + '</b> — ' + g[2] + '.');
        b.scale.y = 1; b.position.y = 0.3 + lvl * 1.1;
        var l1 = c.label(g[0], [-5 + lvl * 2, 1.1 + lvl * 1.1, -1.4], 0.27, g[1]);
        var l2 = ST[i][0] ? c.label(ST[i][0], [-5 + lvl * 2, 1.1 + lvl * 1.1, 1.4], 0.27, '#ffffff') : null;
        return { b: b, l1: l1, l2: l2 };
      });
      var pts = c.steps.slice().reverse().map(function (s) { return [s.b.position.x, s.b.position.y + 0.6, 0]; });
      var cv = U.curve(c, pts); c.ball = U.movers(c, cv, '#ffffff', 0.15, 1, 0.25);
      c.label('стратегия', [6, 7.6, 0], 0.4, '#f0c36b'); c.label('оперативный уровень', [-6.3, 0.2, 1.6], 0.36, '#4cc38a');
      c.onFrame(function (t) {
        c.steps.forEach(function (s) { s.l1.visible = S.mode !== 1; if (s.l2) s.l2.visible = S.mode === 1; });
      });
    },
    chips: [
      { t: 'Госуправление', small: 'нацпроекты', on: function (c) { c.state.mode = 0; c.setView(0, 1.1, 18, 3.5); c.say('<b>Стратегическое</b> планирование государства: национальные цели развития → национальные проекты → федеральные и региональные проекты, госпрограммы. <b>Оперативное</b>: месяц, квартал, полугодие, год — что делать на каждом шаге.'); } },
      { t: 'Твоя учёба', small: 'пример лектора', on: function (c) { c.state.mode = 1; c.setView(0.2, 1.1, 18, 3.5); c.say('Пример лектора: сессии и промежуточная аттестация — <b>оперативный</b> уровень. Через 4 года — диплом: <b>стратегическая</b> цель. Если сессии — «ерунда», то и диплом — «ерунда».'); } }
    ]
  });

  /* ---------- 8. Колесо PDCA ---------- */
  reg('tu6-pdca', {
    title: 'Цикл PDCA (Шухарта — Деминга): колесо, которое катится вверх', lead: 'Колесо из четырёх секторов катится вверх по склону — каждый оборот улучшает результат. Клин под колесом — закреплённый стандарт, чтобы не скатиться назад.',
    radius: 18, phi: 1.2, targetY: 3,
    build: function (c) {
      var T = c.THREE, S = c.state = { k: -1 };
      c.ground(9);
      var ramp = c.mesh(new T.BoxGeometry(14, 0.3, 4), '#2f3550', '<b>Склон</b> — рост качества и результатов.'); ramp.rotation.z = 0.32; ramp.position.set(0, 2.1, 0);
      var Q = [['P', 'Plan — планировать', '#7aa2ff'], ['D', 'Do — делать', '#4cc38a'], ['C', 'Check — проверять', '#f0c36b'], ['A', 'Act — воздействовать, корректировать', '#ef8f5b']];
      var wheel = new T.Group(); c.root.add(wheel); c.wheel = wheel; c.q = [];
      Q.forEach(function (q, i) {
        var m = new T.Mesh(new T.CylinderGeometry(1.8, 1.8, 0.8, 24, 1, false, i * Math.PI / 2, Math.PI / 2 - 0.04), c.mat(q[2]));
        m.rotation.x = Math.PI / 2; m.userData.info = '<b>' + q[0] + ' — ' + q[1] + '</b>.'; m.castShadow = true; wheel.add(m); c.q.push(m);
        var a = i * Math.PI / 2 + Math.PI / 4, lb = c.label(q[0], [0, 0, 0], 0.6, '#ffffff'); wheel.add(lb); lb.position.set(Math.sin(a) * 1.05, Math.cos(a) * 1.05, 0.6);
      });
      var wedge = c.mesh(new T.ConeGeometry(0.7, 1.2, 3), '#c9b6f0', '<b>Клин — стандарт.</b> Достигнутое закрепляют, чтобы не откатиться назад.'); c.wedge = wedge;
      c.p = 0;
      c.onFrame(function (t) {
        c.p = (c.p + 0.0018) % 1; var x = -5.5 + c.p * 11, y = 2.1 + Math.tan(0.32) * x + 0.17 + 1.8 / Math.cos(0.32);
        wheel.position.set(x - Math.sin(0.32) * 1.8, y - (1 - Math.cos(0.32)) * 0, 0); wheel.rotation.z = -c.p * 14;
        wedge.position.set(x - 2.3, 2.1 + Math.tan(0.32) * (x - 2.3) + 0.75, 0); wedge.rotation.z = 0.32 + Math.PI / 2;
        c.q.forEach(function (m, i) { glowOn(m, S.k === i); });
      });
    },
    chips: [
      { t: 'P', small: 'план', on: function (c) { c.setView(0, 1.3, 13, 4); c.state.k = 0; c.say('<b>Plan</b> — анализ, цели, задачи, сроки, мероприятия.'); } },
      { t: 'D', small: 'выполнение', on: function (c) { c.setView(0, 1.3, 13, 4); c.state.k = 1; c.say('<b>Do</b> — реализуем план. Здесь включаются и другие функции — организация, мотивация. Поэтому PDCA иногда называют <b>циклом управления</b>.'); } },
      { t: 'C', small: 'проверка', on: function (c) { c.setView(0, 1.3, 13, 4); c.state.k = 2; c.say('<b>Check</b> — проверяем, насколько получилось то, что хотели. В некоторых вариантах вместо Check пишут <b>Study</b> — PDSA.'); } },
      { t: 'A', small: 'коррекция', on: function (c) { c.setView(0, 1.3, 13, 4); c.state.k = 3; c.say('<b>Act</b> — воздействуем: исправляем отклонения и закрепляем удачное. И снова P. <b>[ДОБАВЛЕНО]</b> Цикл предложил У. Шухарт, распространил Э. Деминг.'); } }
    ]
  });

  /* ---------- 9. Организация как функция: шестерёнки ---------- */
  reg('tu6-gears', {
    title: 'Организация — не кучка шестерёнок, а механизм', lead: 'Шестерёнки сгруппированы в корпусе: каждая делает своё и каждая нужна. Попробуй убрать одну или добавить лишнюю.',
    radius: 16, phi: 1.25, targetY: 3,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(8);
      var box = c.mesh(new T.BoxGeometry(11, 6.5, 0.3), '#2f3550', '<b>Корпус</b> — структура: шестерёнки закреплены в определённом порядке.'); box.position.set(0, 3.5, -0.6);
      var G = [[-3.4, 3.6, 1.4, '#7aa2ff', 'задачи'], [-0.95, 4.9, 1.0, '#4cc38a', 'исполнители'], [1.2, 3.4, 1.3, '#ef8f5b', 'полномочия'], [3.6, 4.8, 1.0, '#c9b6f0', 'ответственность'], [0.4, 1.4, 0.9, '#f0c36b', 'ресурсы']];
      c.g = G.map(function (q, i) { var g = gear(c, q[2], q[3], '<b>' + q[4] + '</b> — одна из «шестерёнок» функции организации: распределить задачи, найти исполнителей, наделить полномочиями, делегировать ответственность, распределить ресурсы.', Math.round(q[2] * 8)); g.position.set(q[0], q[1], 0); c.label(q[4], [q[0], q[1] - q[2] - 0.6, 0.5], 0.3, q[3]); g.userData.dir = i % 2 ? 1 : -1; g.userData.r = q[2]; return g; });
      c.dup = gear(c, 1.0, '#ef6b5b', '<b>Дублирующая</b> функция: лишние затраты на содержание и на координацию.', 8); c.dup.position.set(4.6, 2.2, 0.5); c.dupL = c.label('дубль', [4.6, 0.8, 0.8], 0.32, '#ef6b5b');
      c.onFrame(function (t) {
        var run = S.mode !== 1;
        c.g.forEach(function (g, i) { if (run) g.rotation.z = t * g.userData.dir / g.userData.r; var gone = S.mode === 1 && i === 2; g.visible = !gone; });
        c.dup.visible = c.dupL.visible = S.mode === 2; c.dup.rotation.z = t * 0.3; c.dup.position.y = 2.2 + Math.sin(t * 4) * 0.15;
        glowTree(c.dup, S.mode === 2, '#ef6b5b', 0.5);
      });
    },
    chips: [
      { t: 'Механизм', small: 'всё работает', on: function (c) { c.setView(0, 1.35, 13, 3.2); c.state.mode = 0; c.say('Каждая шестерёнка делает свою работу и каждая нужна, но смысл появляется, только когда они <b>определённым образом сгруппированы</b>. Это и есть функция организации.'); } },
      { t: 'Убрать одну', small: 'нет полномочий', on: function (c) { c.setView(0, 1.35, 13, 3.2); c.state.mode = 1; c.say('Убрали «полномочия» — механизм встал. Ответственность без полномочий не работает: исполнитель не может сделать то, за что с него спрашивают.'); } },
      { t: 'Дубль', small: 'лишняя', on: function (c) { c.setView(0, 1.35, 13, 3.2); c.state.mode = 2; c.say('Лишняя шестерёнка — <b>дублирование</b>. Затраты не только на её содержание, но и на <b>координацию</b>: вопросы приходится согласовывать наверху. Хорошая организация — без дублей.'); } }
    ]
  });

  /* ---------- 10. Мотивация: мост между человеком и организацией ---------- */
  reg('tu6-motivation', {
    title: 'Мотивация — мост между потребностями человека и целями организации', lead: 'Слева — человек и его потребности, справа — организация и её цели. Мотивация — мост, по которому идёт энергия. Посмотри, что ломает мост.',
    radius: 19, phi: 1.1, targetY: 2.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(9);
      var p = man(c, -6, 0, 0, '#ef8f5b', '<b>Человек</b>: у него свои потребности, ценности, мотивы.', 1.6);
      var org = c.box3(2.6, 3.2, 2.6, '#7aa2ff', [6, 1.6, 0], '<b>Организация</b>: у неё свои цели — производительность, результат.');
      c.label('потребности', [-6, 2.8, 0], 0.36, '#ef8f5b'); c.label('цели организации', [6, 3.8, 0], 0.36, '#7aa2ff');
      var STEP = [['потребности', '#ef8f5b'], ['ценности', '#e88bb0'], ['мотивы', '#c9b6f0'], ['стимулы', '#f0c36b']];
      c.planks = STEP.map(function (s, i) {
        var x = -3.6 + i * 2.4, m = c.box3(2.2, 0.35, 2, s[1], [x, 2, 0], '<b>' + s[0] + '</b>. Мотивация начинается с <b>выявления потребностей</b>; стимулы — в самом конце.');
        c.label(s[0], [x, 2.7, 1.2], 0.3, s[1]); m.userData.x = x; return m;
      });
      var cv = U.curve(c, [[-5.2, 2.4, 0], [-1, 2.5, 0], [3, 2.5, 0], [4.7, 2.4, 0]]);
      c.flow = U.movers(c, cv, '#ffffff', 0.25, 4, 0.18);
      c.onFrame(function (t) {
        var broken = S.mode === 1 || S.mode === 2;
        c.planks.forEach(function (m, i) {
          var drop = S.mode === 1 && i === 2 ? 1 : S.mode === 2 && i === 3 ? 1 : 0;
          m.position.y = ease(m.position.y, drop ? 0.2 : 2); m.rotation.z = ease(m.rotation.z, drop ? 0.6 : 0);
          glowOn(m, S.mode === 3 && i === 0);
        });
        c.flow.forEach(function (s) { s.visible = !broken; });
        p.position.y = S.mode === 3 ? Math.abs(Math.sin(t * 3)) * 0.3 : 0;
      });
    },
    chips: [
      { t: 'Мост', small: 'работает', on: function (c) { c.setView(0, 1.15, 17, 2); c.state.mode = 0; c.say('Мотивация — «шлюз» между <b>целями человека</b> и <b>целями организации</b>. Человек, удовлетворяя свои потребности, одновременно достигает целей организации.'); } },
      { t: 'Несправедливость', small: 'мост рушится', on: function (c) { c.setView(0, 1.15, 17, 2); c.state.mode = 1; c.say('Если человек считает, что с ним поступили <b>несправедливо</b>, — внутренний протест, потом конфликт. Мост рушится. <b>[ДОБАВЛЕНО]</b> Теория справедливости Адамса.'); } },
      { t: 'Пустые обещания', small: 'нет стимула', on: function (c) { c.setView(0, 1.15, 17, 2); c.state.mode = 2; c.say('Обещали повысить зарплату, должность, отправить на обучение — и не сделали. Стимул «провалился», доверие тоже.'); } },
      { t: 'С чего начать', small: 'потребности', on: function (c) { c.setView(0, 1.15, 17, 2); c.state.mode = 3; c.say('Мотивация начинается <b>не со стимулов</b>, а с <b>выявления потребностей</b>, которые связаны с системой ценностей. Универсального рецепта нет: люди разные.'); } }
    ]
  });

  /* ---------- 11. Контроль ---------- */
  reg('tu6-control', {
    title: 'Контроль: сравнить факт с целью и решить, что менять', lead: 'Зелёная линия — план (цель), шарик — фактический результат. Шкала показывает отклонение. Выбери, что делать при отклонении.',
    radius: 18, phi: 1.15, targetY: 2.6,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(9);
      var plan = U.tube(c, [[-7, 0.5, 0], [-3, 2, 0], [1, 3.4, 0], [5, 4.8, 0], [7, 5.4, 0]], '#4cc38a', 0.08, false, '<b>План (цель)</b>: нормативы, стандарты, целевые показатели.');
      c.label('цель', [7.4, 6.2, 0], 0.4, '#4cc38a');
      var fact = c.mesh(new T.SphereGeometry(0.35, 18, 12), '#ef8f5b', '<b>Факт</b> — результат на текущем этапе.', { emissive: c.color('#ef8f5b'), emissiveIntensity: 0.5 });
      var dev = U.link(c, [0, 0, 0], [0, 1, 0], '#ef6b5b', 0.06, '<b>Отклонение</b> факта от плана.');
      var gauge = c.mesh(new T.TorusGeometry(1.4, 0.12, 8, 40, Math.PI), '#9aa2c0', '<b>Сравнение</b> — ядро контроля.'); gauge.position.set(-5, 5.5, 0);
      var needle = c.box3(0.1, 1.3, 0.1, '#ef6b5b', [-5, 5.5, 0.1], '<b>Стрелка</b>: насколько факт отличается от плана.'); c.needle = needle;
      c.label('отклонение', [-5, 4.4, 0.3], 0.3, '#ef6b5b');
      var goalBox = c.box3(0.9, 0.9, 0.9, '#4cc38a', [7, 5.4, 0], '<b>Цель</b>.'); c.goalBox = goalBox;
      c.t0 = 0;
      c.onFrame(function (t) {
        c.t0 = (c.t0 + 0.002) % 1; var u = c.t0, cv = plan.userData.curve, p = cv.getPointAt(u);
        var off = S.mode === 1 ? -1.4 * Math.min(1, u * 2) : S.mode === 2 ? -1.4 * Math.max(0, 1 - u * 2.2) : S.mode === 3 ? -1.2 * Math.min(1, u * 2) : 0;
        fact.position.set(p.x, p.y + off, 0.3);
        dev.visible = Math.abs(off) > 0.05; if (dev.visible) { dev.position.set(p.x, p.y + off / 2, 0.3); dev.scale.y = Math.abs(off); }
        needle.rotation.z = -off * 0.9; needle.position.set(-5 + Math.sin(-off * 0.9) * -0.6, 5.5 + Math.cos(off * 0.9) * 0.6 - 0.6, 0.1);
        c.goalBox.position.y = ease(c.goalBox.position.y, S.mode === 3 ? 4.2 : 5.4, 0.04);
      });
    },
    chips: [
      { t: 'По плану', small: 'нет отклонений', on: function (c) { c.state.mode = 0; c.say('<b>Контроль</b> (мониторинг) — наблюдение и сопоставление результатов на разных этапах с целями. ❗ Не надзор и не наказание.'); } },
      { t: 'Отклонение', small: 'факт отстаёт', on: function (c) { c.state.mode = 1; c.say('Факт ушёл ниже плана — <b>отклонение</b>. Важно: информация должна быть <b>объективной</b>, показатели — <b>понятными и обоснованными</b>, контроль — <b>своевременным</b>.'); } },
      { t: 'Менять процесс', small: 'путь 1', on: function (c) { c.state.mode = 2; c.say('Путь 1: <b>изменить процесс</b> достижения цели — и факт возвращается к плану.'); } },
      { t: 'Менять цель', small: 'путь 2', on: function (c) { c.state.mode = 3; c.say('Путь 2: <b>изменить саму цель</b> (зелёный куб опустился), если она оказалась недостижимой. Это тоже результат контроля.'); } }
    ]
  });

  /* ---------- 12. Бюджетирование как система ---------- */
  reg('tu6-budget', {
    title: 'Бюджетирование: свой маленький цикл управления', lead: 'Монеты-бюджет проходят три этапа: бюджетное планирование, бюджетная организация (распределение по подразделениям) и бюджетный контроль.',
    radius: 18, phi: 1.1, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { k: -1 };
      c.ground(9);
      var B = [['бюджетное планирование', '#7aa2ff', -5], ['бюджетная организация', '#4cc38a', 0], ['бюджетный контроль', '#f0c36b', 5]];
      c.st = B.map(function (b) { var m = c.mesh(new T.CylinderGeometry(1.5, 1.5, 0.6, 28), b[1], '<b>' + b[0] + '</b>.'); m.position.set(b[2], 0.3, 0); c.label(b[0], [b[2], 1.4, 1.6], 0.32, b[1]); return m; });
      c.depts = [-1.4, 0, 1.4].map(function (dx) { return c.box3(0.9, 0.9, 0.9, '#4cc38a', [dx, 0.45, -3], '<b>Подразделение</b>: получает свою часть бюджета.'); });
      c.coins = [];
      for (var i = 0; i < 6; i++) { var m = c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.1, 20), '#f0c36b', '<b>Деньги</b> бюджета.', { emissive: c.color('#f0c36b'), emissiveIntensity: 0.3, metalness: 0.6 }); m.rotation.x = Math.PI / 2; c.coins.push(m); }
      var cv = U.curve(c, [[-5, 1.2, 0], [-2.5, 2.6, 0], [0, 1.2, 0], [0, 1.2, -3], [2.5, 2.6, -1.5], [5, 1.2, 0], [0, 4, 1.5], [-5, 1.2, 0]], true);
      c.onFrame(function (t) {
        c.coins.forEach(function (m, i) { m.position.copy(cv.getPointAt(U.W(t * 0.08 + i / 6))); m.rotation.z = t * 3; });
        c.st.forEach(function (m, i) { glowOn(m, S.k === i); m.scale.y = S.k === i ? 1.6 : 1; });
      });
    },
    chips: [
      { t: 'Планирование', small: '1', on: function (c) { c.setView(0, 1.0, 17, 1.5); c.state.k = 0; c.say('<b>Бюджетное планирование</b>: сколько денег нужно и на что.'); } },
      { t: 'Организация', small: '2', on: function (c) { c.setView(0, 1.0, 17, 1.5); c.state.k = 1; c.say('<b>Бюджетная организация</b>: распределить бюджет по подразделениям и ответственным.'); } },
      { t: 'Контроль', small: '3', on: function (c) { c.setView(0, 1.0, 17, 1.5); c.state.k = 2; c.say('<b>Бюджетный контроль</b>: сравнить, сколько потратили, с тем, что планировали. Бюджетирование сегодня выделилось как <b>самостоятельная</b> функция и может быть целой системой.'); } }
    ]
  });
})();
