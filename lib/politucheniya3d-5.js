/* 3D-модели к конспекту «Никколо Макиавелли: государство, политика и мораль» (История полит. учений, 10.11), движок HubScene3d.
   В Markdown: @@graph:mak-timeline3d@@ @@graph:mak-militia3d@@ @@graph:mak-study3d@@ @@graph:mak-state3d@@
   @@graph:mak-moral3d@@ @@graph:mak-choice3d@@ @@graph:mak-weak3d@@ @@graph:mak-prophets3d@@ @@graph:mak-checks3d@@
   @@graph:mak-measure3d@@ @@graph:mak-lionfox3d@@ @@graph:mak-interests3d@@ @@graph:mak-cycle3d@@
   @@graph:mak-airbag3d@@ @@graph:mak-iceberg3d@@ */
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
  function person(c, x, z, col, info, h, parent) {
    var T = c.THREE, g = new T.Group(); g.position.set(x, 0, z); (parent || c.root).add(g); h = h || 1;
    into(g, c.mesh(new T.CylinderGeometry(0.26 * h, 0.36 * h, 1.05 * h, 12), col, info)).position.y = 0.53 * h;
    into(g, c.mesh(new T.SphereGeometry(0.25 * h, 14, 10), '#e8c6a0', info)).position.y = 1.3 * h;
    g.userData.info = info;
    return g;
  }
  function fade(g, op) {
    g.traverse(function (x) {
      if (x.material && !x.isSprite) { var on = op < 1; if (x.material.transparent !== on) x.material.needsUpdate = true; x.material.transparent = on; x.material.opacity = op; x.material.depthWrite = !on; }
      if (x.isSprite) x.material.opacity = Math.max(op, 0.05);
    });
  }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function spear(c, g, x, y, z, info) {
    var T = c.THREE;
    var s = into(g, c.mesh(new T.CylinderGeometry(0.03, 0.03, 2.4, 6), '#8a6a40', info)); s.position.set(x, y, z);
    var tip = into(g, c.mesh(new T.ConeGeometry(0.08, 0.3, 6), '#c9d2e0', info, { metalness: 0.7 })); tip.position.set(x, y + 1.35, z);
  }

  /* ---------- 1. Лента жизни ---------- */
  reg('mak-timeline3d', {
    title: 'Жизнь Макиавелли: спираль лет', lead: 'Спираль идёт снизу вверх по годам. Цвет: синий — Флоренция, зелёный — служба, красный — угрозы, фиолетовый — книги. Нажми на шар или кнопку.',
    radius: 23, phi: 1.0, targetY: 3.6, height: 400,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var E = [
        [1469, 'Рождение', '<b>3 мая 1469</b> — Никколо Макиавелли родился во Флоренции, в семье юриста Бернардо. <b>[ДОБАВЛЕНО]</b>', '#f0c36b'],
        [1494, 'Медичи изгнаны', '<b>1494</b> — рубеж: Медичи изгнаны, во Флоренции республика. Народным «пророком» становится монах <b>Савонарола</b>.', '#7aa2ff'],
        [1498, 'Секретарь', '<b>1498</b> — Савонаролу казнят. Макиавелли <b>со второй попытки</b> становится секретарём <b>Второй канцелярии</b> (внешние и военные дела).', '#4fc3a1'],
        [1500, 'Посол во Франции', '<b>1500</b> — миссия к королю Людовику XII. Тяжёлые условия для Флоренции удалось <b>смягчить</b>. <b>[ДОБАВЛЕНО: год, король]</b>', '#4fc3a1'],
        [1502, 'Чезаре Борджиа', '<b>1502</b> — к Флоренции подходят войска <b>Чезаре Борджиа</b>. Макиавелли как дипломат оценивает военную угрозу.', '#ef6b5b'],
        [1506, 'Народная милиция', '<b>1505–1506</b> — по его проекту создана <b>народная милиция</b>. Ей управляет <b>Совет девяти</b>.', '#4fc3a1'],
        [1512, 'Медичи вернулись', '<b>1512</b> — испанцы разбили милицию при Прато, <b>Медичи вернулись</b>, Макиавелли уволен. <b>[ДОБАВЛЕНО: Прато]</b>', '#ef6b5b'],
        [1513, 'Дыба, ссылка, «Государь»', '<b>1513</b> — обвинён в заговоре, пытан на <b>дыбе</b>, сослан в имение. Пишет <b>«Государя»</b> и письмо Веттори о «вечерах с древними».', '#b07cff'],
        [1517, '«Рассуждения»', '<b>≈1513–1517</b> — <b>«Рассуждения о первой декаде Тита Ливия»</b>: книга о республике на примере Рима. <b>[ДОБАВЛЕНО: годы]</b>', '#b07cff'],
        [1520, 'Историограф', '<b>1520</b> — получает должность <b>историографа</b> и пишет «Историю Флоренции» (заказ кардинала Джулио Медичи). <b>[ДОБАВЛЕНО: год]</b>', '#7aa2ff'],
        [1521, '«О военном искусстве»', '<b>1521</b> — трактат <b>«О военном искусстве»</b>. Ещё раньше — комедия «Мандрагора». <b>[ДОБАВЛЕНО]</b>', '#b07cff'],
        [1526, 'Стены города', '<b>1526</b> — секретарь коллегии «Пяти попечителей стен»: его советы по <b>укреплению стен</b> сыграли героическую роль. <b>[ДОБАВЛЕНО: год]</b>', '#4fc3a1'],
        [1527, 'Смерть', '<b>21 июня 1527</b> — умер во Флоренции. <b>[ДОБАВЛЕНО]</b>', '#f0c36b'],
        [1559, 'Индекс', '<b>1559</b> — «Государь» внесён в <b>Индекс запрещённых книг</b>.', '#ef6b5b']
      ];
      var balls = [], pts = [];
      E.forEach(function (e, i) {
        var a = i * 0.72, r = 6.2, y = 0.6 + i * 0.58;
        var big = e[0] === 1469 || e[0] === 1513 || e[0] === 1527;
        var b = c.mesh(new T.SphereGeometry(big ? 0.62 : 0.45, 20, 14), e[3], e[2], { emissive: new T.Color(e[3]).multiplyScalar(0.15) });
        b.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
        c.label(e[0] + ' · ' + e[1], [Math.sin(a) * r, y + 0.85, Math.cos(a) * r], 0.42);
        balls.push(b); pts.push(b.position.clone());
      });
      c.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 140, 0.07, 8), '#9aa3c0', 'Время идёт по спирали вверх.');
      var col = c.mesh(new T.CylinderGeometry(0.45, 0.65, 7.6, 20), '#e8e0cc', '<b>Никколо Макиавелли (1469–1527)</b>: секретарь Флорентийской республики, дипломат, историк, драматург, основатель политической науки Нового времени.');
      col.position.y = 3.8;
      c.label('Макиавелли', [0, 8.2, 0], 0.6, '#f0c36b');
      c.state = { balls: balls };
      c.onFrame(function (t) { balls.forEach(function (b, i) { b.position.y = 0.6 + i * 0.58 + Math.sin(t * 2 + i) * 0.07; }); });
    },
    chips: [
      { t: '1498', small: 'служба', on: function (c) { c.setView(1.4, 1.0, 18, 1.8); c.pick(c.state.balls[2]); } },
      { t: '1506', small: 'милиция', on: function (c) { c.setView(3.6, 1.0, 18, 3.5); c.pick(c.state.balls[5]); } },
      { t: '1513', small: 'падение и книги', on: function (c) { c.setView(5.0, 1.0, 18, 4.6); c.pick(c.state.balls[7]); } },
      { t: '1559', small: 'Индекс', on: function (c) { c.setView(9.4, 0.95, 18, 8); c.pick(c.state.balls[13]); } }
    ]
  });

  /* ---------- 2. Наёмники и милиция ---------- */
  reg('mak-militia3d', {
    title: 'Наёмники или своя милиция', lead: 'Слева — наёмники у сундука с золотом, справа — флорентийское ополчение в красно-белой форме. Нажимай на кнопки по порядку.',
    radius: 20, phi: 1.0, theta: 0.15, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var MI = '<b>Наёмник</b> воюет за деньги. Кончились деньги — уходит; первое поражение — разбегается.';
      var chest = c.box3(1.4, 0.8, 0.9, '#7a4a20', [-4.5, 0.4, 0], '<b>Казна.</b> На наёмниках трудно удерживать суверенитет: всё держится на деньгах.');
      var coins = [];
      for (var i = 0; i < 12; i++) { var co = c.mesh(new T.CylinderGeometry(0.22, 0.22, 0.07, 14), '#f0c36b', 'Золото — единственное, что держит наёмников.', { metalness: 0.8, roughness: 0.25 }); co.position.set(-4.5 + (i % 4 - 1.5) * 0.3, 0.85 + Math.floor(i / 4) * 0.08, (i % 3 - 1) * 0.2); coins.push(co); }
      var merc = [];
      for (var k = 0; k < 6; k++) { var a = k / 6 * Math.PI * 2; var m = person(c, -4.5 + Math.sin(a) * 2.2, Math.cos(a) * 2.2, '#7d8496', MI); spear(c, m, 0.4, 1.2, 0, MI); m.userData.home = [m.position.x, m.position.z]; m.userData.a = a; merc.push(m); }
      c.label('Наёмники', [-4.5, 3, 0], 0.5);
      var MIL = '<b>Народная милиция</b> (1506): граждане в красно-белой форме, с кирасами и пиками. Получают жалованье, выступают по приказу. <b>[ДОБАВЛЕНО: детали формы]</b>';
      var mil = [];
      for (var r = 0; r < 3; r++) for (var q = 0; q < 4; q++) {
        var p = person(c, 2.6 + q * 0.9, -1.4 + r * 1.1, r % 2 ? '#f3efe6' : '#c8332f', MIL);
        into(p, c.mesh(new T.SphereGeometry(0.32, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#c9d2e0', MIL, { metalness: 0.7 })).position.y = 0.95;
        spear(c, p, 0.38, 1.3, 0, MIL); mil.push(p);
      }
      c.label('Ополчение', [3.95, 3.3, 0], 0.5, '#ff8a1f');
      var table = c.mesh(new T.CylinderGeometry(1.1, 1.1, 0.15, 30), '#5a3a20', '<b>Совет девяти</b> — орган, который управлял милицией в мирное время. Над ним — <b>Большой совет</b> республики.'); table.position.set(4, 0.8, 3.6);
      var nine = [];
      for (var n = 0; n < 9; n++) { var an = n / 9 * Math.PI * 2; var s = c.mesh(new T.SphereGeometry(0.17, 12, 8), '#7aa2ff', 'Один из <b>девяти</b> членов совета по делам милиции.'); s.position.set(4 + Math.sin(an) * 0.85, 1.05, 3.6 + Math.cos(an) * 0.85); nine.push(s); }
      c.label('Совет девяти', [4, 1.9, 3.6], 0.4);
      c.state = { m: 0, k: 0 };
      c.onFrame(function (t) {
        var m = c.state.m;
        c.state.k = lerp(c.state.k, m === 1 ? 1 : 0, 0.03);
        var k = c.state.k;
        coins.forEach(function (co, i) { co.visible = i >= Math.round(k * 12); });
        merc.forEach(function (p) { var a = p.userData.a, d = 2.2 + k * 6; p.position.x = -4.5 + Math.sin(a) * d; p.position.z = Math.cos(a) * d; p.rotation.y = k > 0.05 ? a : a + Math.PI; });
        mil.forEach(function (p, i) { p.position.y = m === 2 ? Math.abs(Math.sin(t * 4 + i * 0.5)) * 0.12 : 0; });
        nine.forEach(function (s, i) { s.scale.setScalar(m === 3 ? 1 + Math.sin(t * 3 + i) * 0.2 : 1); });
      });
    },
    chips: [
      { t: 'Наёмники', small: 'пока есть деньги', on: function (c) { c.state.m = 0; c.setView(-0.4, 1.0, 13, 1, -4); c.say('Пока казна полна, наёмники стоят вокруг сундука. Но они служат <b>деньгам</b>, а не республике.'); } },
      { t: 'Деньги кончились', on: function (c) { c.state.m = 1; c.setView(0, 0.8, 22, 1, -3); c.say('Золото исчезает — наёмники <b>расходятся</b>. При первом поражении они <b>разбегаются</b>. Вывод Макиавелли: так суверенитет не удержать.'); } },
      { t: 'Ополчение', small: '1506', on: function (c) { c.state.m = 2; c.setView(0.6, 1.0, 13, 1.2, 4); c.say('Макиавелли предложил гонфалоньеру создать <b>народную милицию</b> по римскому образцу. Граждане защищают свой дом. Позже ополчение ~<b>10 месяцев</b> держало осаду города (1529–1530).'); } },
      { t: 'Совет девяти', on: function (c) { c.state.m = 3; c.setView(0.9, 0.9, 10, 1, 4, 3); c.say('В мирное время милицией управлял <b>Совет девяти</b>. Так армия подчинялась республике, а не одному полководцу.'); } }
    ]
  });

  /* ---------- 3. Вечера с древними ---------- */
  reg('mak-study3d', {
    title: 'Вечер в кабинете: разговор с древними', lead: 'По письму к Веттори (1513). Днём — грязная одежда и быт, вечером — «царские одежды» и беседа с авторами античности.',
    radius: 15, phi: 1.0, theta: 0.4, targetY: 1.4,
    build: function (c) {
      var T = c.THREE;
      c.box3(12, 0.2, 9, '#3a2c22', [0, -0.1, 0], 'Кабинет в ссылке, имение под Флоренцией.');
      var desk = c.box3(3.2, 0.15, 1.6, '#6b4428', [0, 1.1, 0], '<b>Рабочий стол.</b> Здесь Макиавелли выписывает мысли из книг: «Я здесь переношу из книг».');
      [[-1.4, -0.6], [-1.4, 0.6], [1.4, -0.6], [1.4, 0.6]].forEach(function (p) { c.box3(0.15, 1.05, 0.15, '#4a2e1a', [p[0], 0.52, p[1]]); });
      var books = [];
      var BC = ['#8a2a2a', '#2a4a8a', '#2a6a4a', '#7a5a2a', '#5a2a7a', '#8a2a2a', '#2a4a8a', '#2a6a4a', '#7a5a2a', '#5a2a7a'];
      for (var i = 0; i < 10; i++) { var b = c.box3(0.2, 0.62, 0.45, BC[i], [-1.3 + i * 0.22, 1.5, -0.45], '<b>Тит Ливий, книга ' + (i + 1) + '.</b> Первые 10 книг «Истории Рима» — <b>первая декада</b>. Её и комментирует Макиавелли в «Рассуждениях».'); books.push(b); }
      c.label('Первая декада Ливия', [-0.3, 2.3, -0.45], 0.4);
      var candle = c.mesh(new T.CylinderGeometry(0.08, 0.08, 0.4, 10), '#f3efe6', 'Свеча: работа идёт вечером и ночью.'); candle.position.set(1.2, 1.38, 0.3);
      var flame = c.mesh(new T.ConeGeometry(0.07, 0.22, 10), '#ffb347', 'Свеча.', { emissive: new T.Color('#ff8a1f') }); flame.position.set(1.2, 1.7, 0.3);
      var lamp = new T.PointLight(0xffb060, 0, 8); lamp.position.set(1.2, 2, 0.3); c.root.add(lamp);
      var MI = '<b>Макиавелли.</b> На пороге кабинета он сбрасывает повседневную одежду, покрытую грязью, и надевает «царские придворные одежды» — из уважения к собеседникам.';
      var me = person(c, 0, 1.4, '#7a6a55', MI, 1.15);
      var ANC = [['Ливий', 'историк Рима'], ['Плутарх', 'жизнеописания'], ['Ромул', 'основатель Рима'], ['Цицерон', 'оратор республики'], ['Ксенофонт', 'о правлении']];
      var ghosts = [];
      ANC.forEach(function (a, k) {
        var an = -1.1 + k * 0.55, gx = Math.sin(an) * 4, gz = -Math.cos(an) * 4;
        var gi = '<b>' + a[0] + '</b> (' + a[1] + '). Макиавелли «спрашивает о причинах их поступков, а они по своей человечности отвечают». <b>[ДОБАВЛЕНО: имена]</b>';
        var g = person(c, gx, gz, '#d8dceb', gi, 1.25);
        var col = into(g, c.mesh(new T.CylinderGeometry(0.18, 0.18, 2.6, 10), '#e8e0cc', gi)); col.position.set(0, 1.3, -0.6);
        g.add(c.label(a[0], [0, 2.5, 0], 0.38)); g.lookAt(0, 0, 1.4);
        fade(g, 0.15); ghosts.push(g);
      });
      c.state = { m: 0, me: me, ghosts: ghosts };
      c.onFrame(function (t) {
        var m = c.state.m;
        flame.scale.y = 1 + Math.sin(t * 13) * 0.15; flame.visible = m > 0; lamp.intensity = m > 0 ? 1.6 + Math.sin(t * 11) * 0.2 : 0;
        me.children[0].material.color.set(m === 0 ? '#7a6a55' : '#9a1f3a');
        ghosts.forEach(function (g, i) { var op = m >= 2 ? 0.95 : (m === 1 ? 0.35 : 0.12); fade(g, op); g.position.y = m >= 2 ? Math.sin(t * 1.5 + i) * 0.08 : 0; });
        books.forEach(function (b, i) { b.position.y = 1.5 + (m === 3 ? Math.max(0, Math.sin(t * 3 - i * 0.4)) * 0.25 : 0); });
      });
    },
    chips: [
      { t: 'День', small: 'быт', on: function (c) { c.state.m = 0; c.setView(0.4, 1.0, 13, 1.4); c.say('Днём — хозяйство, разговоры в таверне, одежда «в грязи и пыли». Ссылка, но не тюрьма.'); } },
      { t: 'Вечер', small: '«царские одежды»', on: function (c) { c.state.m = 1; c.setView(0.1, 0.95, 9, 1.6, 0, 1); c.pick(c.state.me.children[0]); } },
      { t: 'Беседа', small: 'с древними', on: function (c) { c.state.m = 2; c.setView(0, 0.8, 15, 1.8); c.say('«Я вхожу в старинный двор древних мужей… и питаюсь той пищей, для которой рождён». Книги — собеседники. Лектор: <b>классический пример интеллектуала</b> с чётким графиком.'); } },
      { t: 'Декада', small: '10 книг', on: function (c) { c.state.m = 3; c.setView(-0.3, 0.9, 8, 1.6, -0.3, -0.4); c.say('<b>Декада</b> — 10 книг. Первая декада Ливия — первые 10 книг его «Истории». Отсюда название: «Рассуждения о первой декаде Тита Ливия».'); } }
    ]
  });

  /* ---------- 4. Государство как политическое состояние общества ---------- */
  reg('mak-state3d', {
    title: 'Государство = политическое состояние общества', lead: 'Пирамида снизу вверх: люди → их отношения → власть, учреждения и законы → государство. Сбоку — «рукоделие»: КПИ и отчёты.',
    radius: 18, phi: 1.0, theta: 0.5, targetY: 2.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var L = [
        [4.2, '#4f6b8a', 'Люди', '<b>Общество — люди.</b> По Аристотелю, человек — «политическое животное»: он живёт среди других.'],
        [3.3, '#4fc3a1', 'Отношения', '<b>Отношения между людьми.</b> Торговля, семья, дружба, споры. Но не всякие отношения — это ещё государство.'],
        [2.4, '#7aa2ff', 'Власть · учреждения · законы', '<b>Власть, учреждения и законы</b> упорядочивают отношения. Только отношения, которые <b>регулируются</b> ими, образуют государство.'],
        [1.4, '#f0c36b', 'Государство', '<b>Государство — политическое состояние общества</b> (Макиавелли). Для него это <b>высшее состояние развития</b> общества.']
      ];
      var lv = [];
      L.forEach(function (l, i) {
        var m = c.mesh(new T.CylinderGeometry(l[0] * 0.78, l[0], 0.9, 6), l[1], l[3]); m.position.y = 0.45 + i * 0.95; lv.push(m);
        c.label(l[2], [l[0] + 0.6, 0.6 + i * 0.95, 0], 0.4);
      });
      var shield = c.mesh(new T.SphereGeometry(4.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), '#5cc8ff', '<b>Последний, но самый значимый институт.</b> К государству обращаются в вопросах <b>безопасности, жизни и смерти, здоровья</b>.', { transparent: true, opacity: 0.12, depthWrite: false });
      shield.visible = false;
      var gears = [];
      var GI = '<b>«Рукоделие» государства</b>: распоряжения, ресурсы, ответственные, проекты, отчётность, <b>КПИ</b>, финансовый год. Это нужно, но этого <b>мало</b>, чтобы понять государство.';
      [[6.2, 1.2, 0.8], [7.2, 1.9, 0.55], [6.5, 2.6, 0.45]].forEach(function (g) {
        var m = c.mesh(new T.TorusGeometry(g[2], 0.14, 8, 12), '#9aa3c0', GI, { metalness: 0.6 }); m.position.set(g[0], g[1], 1.5); gears.push(m);
      });
      c.label('КПИ, отчёты', [6.7, 3.4, 1.5], 0.4);
      c.state = { lv: lv, f: -1, shield: shield, gears: gears };
      c.onFrame(function (t) {
        lv.forEach(function (m, i) { var s = c.state.f === i ? 1.08 : 1; m.scale.x = m.scale.z = lerp(m.scale.x, s, 0.1); m.rotation.y = t * 0.08 * (i % 2 ? 1 : -1); });
        gears.forEach(function (g, i) { g.rotation.z = t * (i % 2 ? -1.2 : 1.2); });
        shield.material.opacity = 0.1 + Math.sin(t * 2) * 0.04;
      });
    },
    onPick: function (obj, c) { c.state.f = c.state.lv.indexOf(obj); },
    chips: [
      { t: 'Аристотель', small: 'политическое животное', on: function (c) { c.state.shield.visible = false; c.setView(0.5, 1.15, 16, 1); c.pick(c.state.lv[0]); } },
      { t: 'Макиавелли', small: 'политическое состояние', on: function (c) { c.state.shield.visible = false; c.setView(0.5, 0.9, 14, 3); c.pick(c.state.lv[3]); } },
      { t: 'Рукоделие', small: 'КПИ', on: function (c) { c.state.shield.visible = false; c.setView(1.2, 1.0, 10, 2, 5, 1); c.pick(c.state.gears[0]); } },
      { t: 'Последний институт', on: function (c) { c.state.shield.visible = true; c.setView(0.4, 0.9, 20, 2); c.pick(c.state.shield); } }
    ]
  });

  /* ---------- 5. Политика и мораль ---------- */
  reg('mak-moral3d', {
    title: 'Политика — механизм, мораль — в людях', lead: 'В центре крутится механизм политики. Вокруг — люди со светильниками: только они носители морали. Нажимай кнопки.',
    radius: 19, phi: 1.0, theta: 0.3, targetY: 1.6,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var GI = '<b>Политика</b> — как механизм или закон природы. Она <b>не человек</b>, поэтому сама не может быть носителем морали.';
      var gears = [];
      [[0, 2.2, 1.3, 1], [1.95, 2.9, 0.8, -1.6], [-1.75, 1.3, 0.75, -1.7]].forEach(function (g) {
        var m = c.mesh(new T.TorusGeometry(g[2], 0.22, 10, 14), '#9aa3c0', GI, { metalness: 0.7, roughness: 0.3 }); m.position.set(g[0], g[1], 0); m.userData.sp = g[3]; gears.push(m);
        for (var k = 0; k < 10; k++) { var a = k / 10 * Math.PI * 2; var tooth = c.box3(0.22, 0.32, 0.3, '#9aa3c0', [0, 0, 0], GI); tooth.position.set(Math.cos(a) * (g[2] + 0.25), Math.sin(a) * (g[2] + 0.25), 0); tooth.rotation.z = a; m.add(tooth); }
      });
      c.label('Политика', [0, 4.3, 0], 0.5);
      var PI = '<b>Носители морали — люди.</b> Мы оцениваем политику через мораль (в собраниях, советах, на площади). Это можно и нужно делать. Но мораль — в нас, а не в механизме.';
      var people = [], lights = [];
      for (var i = 0; i < 7; i++) {
        var a = i / 7 * Math.PI * 2, p = person(c, Math.sin(a) * 6, Math.cos(a) * 6, '#7aa2ff', PI);
        var l = into(p, c.mesh(new T.SphereGeometry(0.2, 12, 8), '#ffd27a', PI, { emissive: new T.Color('#c08a20') })); l.position.set(0, 1.85, 0);
        p.lookAt(0, 0, 0); people.push(p); lights.push(l);
      }
      var WI = '<b>Волк убивает зайца</b> не из злобы. Он не «совершает зло», но и добра не делает. Так же, по лектору, действуют законы политики.';
      var wolf = group(c, -3.2, 0, 2.8);
      into(wolf, c.box3(1.3, 0.55, 0.5, '#6b6f7a', [0, 0.75, 0], WI));
      into(wolf, c.mesh(new T.ConeGeometry(0.28, 0.7, 8), '#6b6f7a', WI)).position.set(0.85, 0.95, 0);
      wolf.children[1].rotation.z = -Math.PI / 2;
      [[-0.45, 0.18], [-0.45, -0.18], [0.45, 0.18], [0.45, -0.18]].forEach(function (q) { into(wolf, c.box3(0.12, 0.5, 0.12, '#55585f', [q[0], 0.25, q[1]], WI)); });
      var hare = group(c, -1.2, 0, 2.8);
      into(hare, c.mesh(new T.SphereGeometry(0.35, 12, 10), '#e8dcc8', WI)).position.y = 0.4;
      [0.1, -0.1].forEach(function (z) { var e = into(hare, c.mesh(new T.CylinderGeometry(0.05, 0.07, 0.5, 6), '#e8dcc8', WI)); e.position.set(0.15, 0.95, z); });
      wolf.visible = hare.visible = false;
      var CI = '<b>Совет восьмидесяти</b> приговорил к смерти тех, кто пытался захватить власть. Для них — ужасно. Для республики — правильное действие: иначе переворот или <b>гражданская война</b>.';
      var council = [];
      for (var r = 0; r < 80; r++) { var ca = Math.PI * (0.15 + 0.7 * (r % 20) / 19), rr = 3 + Math.floor(r / 20) * 0.45; var s = c.mesh(new T.SphereGeometry(0.13, 8, 6), '#c8332f', CI); s.position.set(Math.cos(ca) * rr, 0.25 + Math.floor(r / 20) * 0.15, -Math.sin(ca) * rr); s.visible = false; council.push(s); }
      c.state = { m: 0, people: people, gears: gears };
      c.onFrame(function (t) {
        var m = c.state.m;
        gears.forEach(function (g) { g.rotation.z = t * g.userData.sp * 0.6; g.visible = m !== 3; });
        lights.forEach(function (l, i) { l.scale.setScalar(m === 1 ? 1.4 + Math.sin(t * 3 + i) * 0.2 : 1); });
        wolf.visible = hare.visible = m === 2;
        if (m === 2) { var k = (t * 0.5) % 1; hare.position.x = -1.2 + k * 3; wolf.position.x = -3.4 + k * 3.1; hare.position.y = Math.abs(Math.sin(t * 8)) * 0.3; }
        council.forEach(function (s) { s.visible = m === 3; });
      });
    },
    chips: [
      { t: 'Механизм', small: 'политика', on: function (c) { c.state.m = 0; c.setView(0.1, 1.0, 12, 2.3); c.pick(c.state.gears[0]); } },
      { t: 'Люди', small: 'носители морали', on: function (c) { c.state.m = 1; c.setView(0.6, 0.85, 20, 1.2); c.say('Мы <b>можем оценивать</b> политику с помощью морали. Но <b>моральной по своей природе</b> политика быть не может: у неё нет совести, она не человек.'); } },
      { t: 'Волк и заяц', on: function (c) { c.state.m = 2; c.setView(0.2, 0.95, 10, 0.8, -1, 2.8); c.say('<b>Волк убивает зайца</b> не потому, что злой. Это закон природы. Политика тоже подчиняется своим законам, их надо изучать.'); } },
      { t: 'Совет 80', small: 'Флоренция', on: function (c) { c.state.m = 3; c.setView(0, 0.8, 12, 0.6, 0, -2); c.say('<b>Совет восьмидесяти</b> казнил заговорщиков. Морально это ужасно для них. Политически — спасение республики от переворота и гражданской войны.'); } }
    ]
  });

  /* ---------- 6. По необходимости или по выбору ---------- */
  reg('mak-choice3d', {
    title: 'Два капитана: по выбору и по необходимости', lead: 'Левый корабль идёт по курсу к флагам побед. Правый болтает волнами, он только догоняет ситуацию.',
    radius: 16, phi: 0.95, theta: 0.25, targetY: 0.5,
    build: function (c) {
      var T = c.THREE;
      var sea = c.mesh(new T.PlaneGeometry(22, 12, 40, 20), '#1f4f8a', '<b>Море обстоятельств.</b> Волны — это события, на которые политику приходится отвечать.', { roughness: 0.4, metalness: 0.2 });
      sea.rotation.x = -Math.PI / 2;
      function ship(col, info) {
        var g = group(c, 0, 0, 0);
        into(g, c.box3(2, 0.5, 0.8, col, [0, 0.25, 0], info));
        into(g, c.mesh(new T.CylinderGeometry(0.05, 0.05, 2.2, 6), '#5a3a20', info)).position.set(0, 1.4, 0);
        var sail = into(g, c.mesh(new T.PlaneGeometry(1.2, 1.4), '#f3efe6', info, { side: T.DoubleSide })); sail.position.set(0, 1.6, 0.02); sail.rotation.y = Math.PI / 2;
        return g;
      }
      var FI = '<b>По свободному выбору.</b> Политик знает законы развития общества и пользуется ими: сам ставит цели и ведёт государство <b>от победы к победе</b>.';
      var NI = '<b>По необходимости.</b> «Ведомый политик»: его постоянно подталкивают обстоятельства, он <b>догоняет ситуацию</b>, а не ведёт её.';
      var a = ship('#4fc3a1', FI), b = ship('#ef6b5b', NI); a.scale.setScalar(1.6); b.scale.setScalar(1.6);
      var wheel = into(a, c.mesh(new T.TorusGeometry(0.3, 0.05, 6, 12), '#f0c36b', FI)); wheel.position.set(-0.8, 0.8, 0); wheel.rotation.y = Math.PI / 2;
      var flags = [];
      for (var i = 0; i < 3; i++) {
        var fx = -6 + i * 4, fz = -3.2;
        c.mesh(new T.CylinderGeometry(0.06, 0.06, 2, 6), '#9aa3c0', 'Цель, поставленная самим политиком.').position.set(fx, 1, fz);
        var f = c.mesh(new T.PlaneGeometry(0.8, 0.5), '#f0c36b', '<b>Победа ' + (i + 1) + '.</b> Цели ставит сам политик.', { side: T.DoubleSide }); f.position.set(fx + 0.4, 1.7, fz); flags.push(f);
      }
      c.label('по выбору', [-6, 3.2, -3.2], 0.6, '#4fc3a1');
      c.label('по необходимости', [3, 4.4, 2.8], 0.5, '#ef6b5b');
      c.state = { a: a, b: b };
      c.onFrame(function (t) {
        var pos = sea.geometry.attributes.position;
        for (var i = 0; i < pos.count; i++) { var x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.sin(x * 0.8 + t * 1.6) * 0.15 + Math.cos(y * 0.9 + t) * 0.1); }
        pos.needsUpdate = true;
        var k = (t * 0.08) % 1;
        a.position.set(-8 + k * 14, Math.sin(t * 1.6) * 0.06, -1.8); a.rotation.y = 0; a.rotation.z = Math.sin(t * 1.4) * 0.04;
        b.position.set(3 + Math.sin(t * 0.7) * 1.6, Math.sin(t * 2.2) * 0.12, 2.6 + Math.cos(t * 0.5) * 0.8);
        b.rotation.y = Math.sin(t * 0.6) * 2.2; b.rotation.z = Math.sin(t * 2.1) * 0.15; b.rotation.x = Math.cos(t * 1.7) * 0.1;
        flags.forEach(function (f, i) { f.rotation.y = Math.sin(t * 3 + i) * 0.3; });
      });
    },
    chips: [
      { t: 'По выбору', on: function (c) { c.setView(0, 0.9, 14, 0.5, -2, -1.8); c.pick(c.state.a.children[0]); } },
      { t: 'По необходимости', on: function (c) { c.setView(0.5, 0.9, 12, 0.5, 3, 2.6); c.pick(c.state.b.children[0]); } },
      { t: 'Источник', on: function (c) { c.setView(0.25, 0.95, 16, 0.5); c.say('«Люди действуют либо по необходимости, либо по свободному выбору» — «Рассуждения», кн. I. <b>[ДОБАВЛЕНО: ссылка]</b>'); } }
    ]
  });

  /* ---------- 7. Два слабых правителя подряд ---------- */
  reg('mak-weak3d', {
    title: 'Два слабых правителя подряд', lead: 'Каждая башня — череда правителей. Крупный блок — сильный правитель, маленький — слабый. Какая башня устоит?',
    radius: 16, phi: 1.05, theta: 0.2, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      function tower(x, seq, title) {
        var g = group(c, x, 0, 0), y = 0, blocks = [];
        seq.forEach(function (s, i) {
          var strong = s === 'S', w = strong ? 1.8 : 0.75, h = strong ? 1.1 : 0.9;
          var info = strong ? '<b>Сильный правитель.</b> Держит государство и может «вытянуть» слабость предшественника.' : '<b>Слабый правитель.</b> Один — государство переживёт, если следом придёт сильный.';
          var b = into(g, c.box3(w, h, w, strong ? '#4fc3a1' : '#ef6b5b', [0, y + h / 2, 0], info)); b.userData.y0 = y + h / 2; blocks.push(b); y += h;
        });
        g.add(c.label(title, [0, y + 0.8, 0], 0.42));
        return { g: g, blocks: blocks };
      }
      var A = tower(-3, ['S', 'W', 'S', 'W', 'S'], 'сильный ↔ слабый');
      var B = tower(3, ['S', 'S', 'W', 'W', 'S'], 'два слабых подряд');
      B.blocks[2].userData.info = B.blocks[3].userData.info = '<b>Два слабых подряд</b> — и государство не удерживается («Рассуждения», кн. I, гл. 19). На семинаре вспомнили: Иван Грозный → Фёдор → <b>Смута</b>; Александр III → Николай II.';
      c.state = { m: 0, A: A, B: B, k: 0 };
      c.onFrame(function (t) {
        c.state.k = lerp(c.state.k, c.state.m === 1 ? 1 : 0, 0.04);
        var k = c.state.k;
        A.g.rotation.z = Math.sin(t * 2) * 0.01;
        B.blocks.forEach(function (b, i) {
          if (i < 3) { b.position.x = 0; b.rotation.z = 0; b.position.y = b.userData.y0; return; }
          b.rotation.z = k * (i === 3 ? 0.9 : 1.6); b.position.x = k * (i === 3 ? 0.9 : 2.2); b.position.y = lerp(b.userData.y0, i === 3 ? 2.2 : 0.6, k);
        });
        B.blocks[3].position.x += Math.sin(t * 6) * 0.03 * (1 - k);
      });
    },
    chips: [
      { t: 'Чередование', small: 'устоит', on: function (c) { c.state.m = 0; c.setView(-0.3, 1.0, 11, 2.5, -3); c.say('После слабого приходит сильный — и государство выдерживает. «Государство может удержаться при одном слабом правителе, если за ним следует сильный».'); } },
      { t: 'Два слабых', small: 'рушится', on: function (c) { c.state.m = 1; c.setView(0.3, 1.0, 12, 2.2, 3); c.pick(c.state.B.blocks[3]); } },
      { t: 'Сравнить', on: function (c) { c.state.m = 0; c.setView(0.2, 1.05, 16, 2); c.say('Нажми «Два слабых», чтобы увидеть обрушение. <b>[ДОБАВЛЕНО]</b> «Рассуждения», кн. I, гл. 19.'); } }
    ]
  });

  /* ---------- 8. Вооружённые и безоружные пророки ---------- */
  reg('mak-prophets3d', {
    title: 'Вооружённый и безоружный пророк', lead: '«Все вооружённые пророки побеждали, а безоружные погибали» («Государь», гл. 6). Слева — пророк с войском, справа — Савонарола.',
    radius: 18, phi: 1.0, theta: 0.15, targetY: 1.6,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var AI = '<b>Вооружённый пророк</b> (Моисей, Кир, Тесей, Ромул — <b>[ДОБАВЛЕНО]</b>). Когда народ перестаёт верить, его можно удержать силой. Поэтому он побеждает.';
      c.mesh(new T.CylinderGeometry(1.1, 1.3, 0.6, 20), '#6b7a8f', AI).position.set(-3.5, 0.3, 0);
      var arm = person(c, -3.5, 0, '#2a4a8a', AI, 1.3); arm.position.y = 0.6;
      spear(c, arm, 0.55, 1.4, 0, AI);
      var sh = into(arm, c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.08, 18), '#c9d2e0', AI, { metalness: 0.7 })); sh.rotation.z = Math.PI / 2; sh.position.set(-0.45, 0.9, 0.1);
      var army = [];
      for (var i = 0; i < 8; i++) { var p = person(c, -5.5 + (i % 4) * 1.3, 1.8 + Math.floor(i / 4) * 1.1, '#3a5a9a', 'Войско, которое поддерживает пророка.', 0.8); spear(c, p, 0.3, 1, 0, 'Войско.'); army.push(p); }
      var UI = '<b>Безоружный пророк — Савонарола.</b> Пока народ верил, он правил Флоренцией. Когда вера угасла, удержать власть было нечем. В <b>1498</b> его казнили.';
      c.mesh(new T.CylinderGeometry(1.1, 1.3, 0.6, 20), '#6b7a8f', UI).position.set(3.5, 0.3, 0);
      var un = person(c, 3.5, 0, '#3a2a20', UI, 1.3); un.position.y = 0.6;
      var book = into(un, c.box3(0.5, 0.08, 0.35, '#8a2a2a', [0.35, 1.0, 0.3], UI));
      var crowd = [];
      for (var j = 0; j < 8; j++) { var q = person(c, 2 + (j % 4) * 1.1, 2 + Math.floor(j / 4) * 1.1, '#a0a8c0', 'Народ: сначала верит пророку, потом отворачивается.', 0.75); q.lookAt(3.5, 0, 0); crowd.push(q); }
      var fire = [];
      for (var f = 0; f < 6; f++) { var fl = c.mesh(new T.ConeGeometry(0.25, 0.9, 8), f % 2 ? '#ff8a1f' : '#ef6b5b', 'Казнь Савонаролы на площади Синьории, 1498. <b>[ДОБАВЛЕНО]</b>', { emissive: new T.Color('#a03000') }); fl.position.set(3.5 + Math.sin(f) * 0.7, 0.9, Math.cos(f) * 0.7); fl.visible = false; fire.push(fl); }
      c.state = { m: 0, arm: arm, un: un };
      c.onFrame(function (t) {
        var m = c.state.m;
        crowd.forEach(function (q, i) { var tgt = m >= 1 ? Math.atan2(q.position.x - 3.5, q.position.z) : Math.atan2(3.5 - q.position.x, -q.position.z); q.rotation.y = lerp(q.rotation.y, tgt, 0.05); });
        fire.forEach(function (fl, i) { fl.visible = m === 2; fl.scale.y = 1 + Math.sin(t * 10 + i) * 0.25; });
        army.forEach(function (p, i) { p.position.y = m === 3 ? Math.abs(Math.sin(t * 5 + i)) * 0.1 : 0; });
        un.rotation.z = lerp(un.rotation.z, m === 2 ? 0.25 : 0, 0.05);
      });
    },
    chips: [
      { t: 'Вооружённый', on: function (c) { c.state.m = 3; c.setView(-0.3, 1.0, 11, 1.4, -3.5, 1); c.pick(c.state.arm.children[0]); } },
      { t: 'Народ отвернулся', on: function (c) { c.state.m = 1; c.setView(0.3, 0.95, 11, 1.2, 3.5, 1); c.say('Вера народа переменчива. У безоружного пророка нет средства удержать её, когда она угасает.'); } },
      { t: 'Савонарола', small: '1498', on: function (c) { c.state.m = 2; c.setView(0.2, 0.95, 9, 1.4, 3.5); c.pick(c.state.un.children[0]); } },
      { t: 'Вывод', on: function (c) { c.state.m = 3; c.setView(0.15, 1.0, 18, 1.5); c.say('Для объединения Италии нужен <b>вооружённый</b> государь — но <b>добродетельный и просвещённый</b>. Антиморальную политику Макиавелли <b>не проповедовал</b>.'); } }
    ]
  });

  /* ---------- 9. Модель нарушителя и мера наказания ---------- */
  reg('mak-checks3d', {
    title: 'Модель нарушителя: сдержки и мера наказания', lead: 'В центре — власть. Вокруг — сдержки. Красный шар — возможный нарушитель: он пробует вырваться. Внизу — весы наказания.',
    radius: 19, phi: 0.9, theta: 0.4, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var throne = c.box3(1.2, 1.4, 1.2, '#6b2a8a', [0, 0.7, 0], '<b>Власть.</b> Государь — обычный человек со своими мотивами. В политике максимальные риски и ресурсы, поэтому надеяться на его безупречность нельзя.');
      var crown = c.mesh(new T.TorusGeometry(0.35, 0.1, 8, 6), '#f0c36b', 'Власть.', { metalness: 0.8 }); crown.rotation.x = Math.PI / 2; crown.position.y = 1.6;
      var CH = [['Законы', '<b>Законы</b> работают 24/7 и ограничивают любого правителя.'], ['Суды', '<b>Суды</b>: люди могут защищаться от произвола, опираясь на закон.'], ['Народ', '<b>Народ</b> имеет право сопротивляться вреду — это тоже сдержка.'], ['Знать / сенат', '<b>Другие центры власти</b> — знать, сенат — уравновешивают правителя.']];
      var posts = [];
      CH.forEach(function (h, i) {
        var a = i / 4 * Math.PI * 2 + Math.PI / 4, x = Math.sin(a) * 3.4, z = Math.cos(a) * 3.4;
        var p = c.mesh(new T.CylinderGeometry(0.3, 0.35, 2.2, 12), '#4fc3a1', h[1]); p.position.set(x, 1.1, z); posts.push(p);
        c.label(h[0], [x, 2.7, z], 0.4);
      });
      var ring = c.mesh(new T.TorusGeometry(3.4, 0.07, 6, 60), '#4fc3a1', '<b>Сдержки и противовесы</b> соединены в кольцо.'); ring.rotation.x = Math.PI / 2; ring.position.y = 1.6;
      var bad = c.mesh(new T.SphereGeometry(0.35, 16, 12), '#ef6b5b', '<b>Нарушитель.</b> Систему проектируют, представляя, как худший правитель может её испортить, — и ставят заслоны заранее.', { emissive: new T.Color('#5a1010') });
      var beam = c.box3(5, 0.12, 0.3, '#c9a24a', [0, 0.4, 5.6], '<b>Весы наказания.</b> Ищем золотую середину.');
      var pivot = c.mesh(new T.ConeGeometry(0.3, 0.4, 4), '#9aa3c0', 'Опора весов.'); pivot.position.set(0, 0.2, 5.6);
      var crowd = [];
      for (var i = 0; i < 6; i++) { var s = c.mesh(new T.SphereGeometry(0.2, 10, 8), '#ef6b5b', 'Нарушения закона.'); s.position.set(-4 + i * 0.4, 0.3, 7); s.visible = false; crowd.push(s); }
      c.state = { m: 0, k: 0, beam: beam, bad: bad, throne: throne };
      c.onFrame(function (t) {
        var m = c.state.m;
        var a = t * 0.9, r = 0.9 + Math.abs(Math.sin(t * 1.3)) * 2.2;
        bad.visible = m <= 1;
        bad.position.set(Math.sin(a) * r, 1.6, Math.cos(a) * r);
        posts.forEach(function (p, i) { var d = Math.hypot(bad.position.x - p.position.x, bad.position.z - p.position.z); p.scale.y = m === 1 && d < 1.5 ? 1.15 : 1; });
        var tilt = m === 2 ? -0.35 : m === 3 ? 0.35 : 0;
        beam.rotation.z = lerp(beam.rotation.z, tilt, 0.05);
        crowd.forEach(function (s, i) { s.visible = m === 2 || m === 3; s.material.color.set(m === 3 ? '#9aa3c0' : '#ef6b5b'); s.position.y = 0.3 + (m === 2 ? Math.abs(Math.sin(t * 5 + i)) * 0.6 : 0); s.position.x = m === 3 ? -4 + i * 0.4 - Math.sin(t + i) * 0.3 - 1 : -4 + i * 0.4; });
      });
    },
    chips: [
      { t: 'Модель нарушителя', on: function (c) { c.state.m = 0; c.setView(0.4, 0.9, 16, 1.2); c.pick(c.state.bad); } },
      { t: 'Сдержки', on: function (c) { c.state.m = 1; c.setView(0.8, 0.7, 14, 1.4); c.say('Если правитель захочет делать хорошее — <b>честь и хвала</b>, сдержки не помешают. Если захочет вредить — сдержки остановят.'); } },
      { t: 'Слабое наказание', on: function (c) { c.state.m = 2; c.setView(0.1, 1.0, 10, 0.6, -1.5, 5.8); c.say('Наказание <b>слабое, приемлемое</b> — люди склонны <b>нарушать</b> закон: нарушения прыгают и множатся.'); } },
      { t: 'Чрезмерное', on: function (c) { c.state.m = 3; c.setView(0.1, 1.0, 10, 0.6, -1.5, 5.8); c.say('Наказание <b>чрезмерное</b> — тоже плохо: страх и ненависть к власти. Задача государя — <b>золотая середина</b>, отделять хорошие поступки от плохих с помощью закона.'); } },
      { t: 'Середина', on: function (c) { c.state.m = 4; c.setView(0.1, 1.0, 10, 0.6, 0, 5.6); c.say('<b>Баланс.</b> Право и закон — основа работы государя; насилие не исчезает, но оно не главное средство.'); } }
    ]
  });

  /* ---------- 10. Мерило правителя ---------- */
  reg('mak-measure3d', {
    title: 'Чем измерить хорошего правителя', lead: 'Слева — старые мерила: божья благодать, знатность, площадь земель. Справа — мерило Макиавелли: согласие народа и радость жизни.',
    radius: 16, phi: 1.0, theta: 0.1, targetY: 2.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      c.mesh(new T.CylinderGeometry(0.15, 0.3, 4, 10), '#9aa3c0', 'Стойка весов.').position.y = 2;
      var beam = group(c, 0, 4, 0);
      into(beam, c.box3(7, 0.15, 0.25, '#c9a24a', [0, 0, 0], 'Коромысло весов.'));
      function pan(x) {
        var g = new T.Group(); g.position.set(x, 0, 0); beam.add(g);
        into(g, c.link([0, 0, 0], [-0.6, -1.6, 0], '#9aa3c0', 0.03)); into(g, c.link([0, 0, 0], [0.6, -1.6, 0], '#9aa3c0', 0.03));
        var p = into(g, c.mesh(new T.CylinderGeometry(1, 0.8, 0.15, 24), '#c9a24a', 'Чаша весов.')); p.position.y = -1.65;
        return g;
      }
      var L = pan(-3.3), R = pan(3.3);
      var OI = ['<b>Божественная благодать</b> — старое мерило: власть дана свыше. Макиавелли его не принимает.', '<b>Знатность происхождения</b> — «правильная» династия. Тоже не мерило.', '<b>Площадь земель</b> — сколько территорий у правителя. Тоже не главное.'];
      var halo = into(L, c.mesh(new T.TorusGeometry(0.35, 0.06, 8, 24), '#f0c36b', OI[0], { emissive: new T.Color('#6a5010') })); halo.position.set(-0.4, -1.1, 0); halo.rotation.x = Math.PI / 2;
      var tree = into(L, c.mesh(new T.ConeGeometry(0.3, 0.8, 8), '#4f8a4f', OI[1])); tree.position.set(0.35, -1.15, 0.2);
      var land = into(L, c.box3(0.7, 0.15, 0.5, '#8a6a3a', [0, -1.5, -0.3], OI[2]));
      var NI = '<b>Согласие народа</b> с правителем, с законностью его действий и с законами — главное мерило эффективности.';
      var ppl = [];
      for (var i = 0; i < 6; i++) { var p = person(c, -0.6 + (i % 3) * 0.6, -0.25 + Math.floor(i / 3) * 0.5, '#7aa2ff', NI, 0.45, R); p.position.y = -1.57; ppl.push(p); }
      var JI = '<b>Радость от самой жизни</b>, процветание — не любой ценой, а в рамках возможностей. Это и есть интерес государя.';
      var sun = into(R, c.mesh(new T.SphereGeometry(0.3, 14, 10), '#ffd27a', JI, { emissive: new T.Color('#a07010') })); sun.position.set(0.7, -0.5, 0);
      c.label('старое мерило', [-3.3, 1.2, 0], 0.4); c.label('мерило Макиавелли', [3.3, 1.2, 0], 0.4, '#f0c36b');
      c.state = { m: 0, beam: beam, L: L, R: R, ppl: ppl, halo: halo };
      c.onFrame(function (t) {
        var m = c.state.m, tilt = m === 0 ? 0.18 : m === 1 ? -0.22 : 0;
        beam.rotation.z = lerp(beam.rotation.z, tilt, 0.04);
        L.rotation.z = -beam.rotation.z; R.rotation.z = -beam.rotation.z;
        halo.rotation.z = t; sun.rotation.y = t;
        ppl.forEach(function (p, i) { p.position.y = -1.57 + (m === 1 ? Math.abs(Math.sin(t * 4 + i)) * 0.1 : 0); });
        fade(L, m === 2 ? 0.2 : 1);
      });
    },
    chips: [
      { t: 'Старое мерило', on: function (c) { c.state.m = 0; c.setView(-0.3, 1.0, 10, 2.5, -3.3); c.pick(c.state.halo); } },
      { t: 'Макиавелли', small: 'согласие народа', on: function (c) { c.state.m = 1; c.setView(0.3, 1.0, 10, 2.5, 3.3); c.pick(c.state.ppl[0].children[0]); } },
      { t: 'Расколдовать', small: 'политику', on: function (c) { c.state.m = 2; c.setView(0, 1.0, 14, 2.5); c.say('Макиавелли <b>«расколдовывает» политику</b>: снимает с неё мистику и нормативную идеальность. Не «град земной по образу Града Божьего» (Августин), а человеческое дело с интересами и расчётом.'); } }
    ]
  });

  /* ---------- 11. Лев, лиса, волки и капкан ---------- */
  reg('mak-lionfox3d', {
    title: 'Лев, лиса, волки и капкан', lead: '«Государь», гл. 18: лев не видит капкана, лиса беззащитна перед волками. Посмотри каждый сценарий.',
    radius: 18, phi: 0.95, theta: 0.3, targetY: 0.8,
    build: function (c) {
      var T = c.THREE;
      c.box3(18, 0.2, 10, '#3f5a32', [0, -0.1, 0], 'Политическое поле.');
      function animal(col, len, h, info) {
        var g = group(c, 0, 0, 0);
        into(g, c.box3(len, h * 0.6, h * 0.5, col, [0, h, 0], info));
        [[-len * 0.35, 0.15], [-len * 0.35, -0.15], [len * 0.35, 0.15], [len * 0.35, -0.15]].forEach(function (q) { into(g, c.box3(0.12, h, 0.12, col, [q[0], h / 2, q[1] * h * 1.4], info)); });
        var hd = into(g, c.mesh(new T.SphereGeometry(h * 0.35, 12, 10), col, info)); hd.position.set(len / 2 + 0.15, h * 1.25, 0);
        return g;
      }
      var LI = '<b>Лев — сила.</b> Действует решительно, <b>отпугивает волков</b>. Но «лев не умеет уберечься от капканов».';
      var FI = '<b>Лиса — хитрость.</b> Замечает капкан, обходит волков и даже <b>приводит волков к капкану</b>. Но сама от волков не защитится.';
      var WI = '<b>Волки</b> — враги государя: соперники, заговорщики, чужие армии.';
      var lion = animal('#d9a04a', 2, 1, LI);
      var mane = into(lion, c.mesh(new T.SphereGeometry(0.6, 14, 10), '#9a5a20', LI)); mane.position.set(1.05, 1.25, 0);
      var fox = animal('#e0703a', 1.4, 0.6, FI);
      var tail = into(fox, c.mesh(new T.ConeGeometry(0.2, 1, 8), '#e0703a', FI)); tail.position.set(-0.95, 0.8, 0); tail.rotation.z = -1.2;
      var wolves = [];
      for (var i = 0; i < 3; i++) wolves.push(animal('#6b6f7a', 1.5, 0.7, WI));
      var TI = '<b>Капкан</b> — ловушка: заговор, обман, невыгодный договор. Силой его не одолеть, его надо <b>заметить</b>.';
      var trap = group(c, 2, 0, 0);
      into(trap, c.mesh(new T.CylinderGeometry(0.9, 0.9, 0.08, 24), '#55585f', TI, { metalness: 0.7 })).position.y = 0.05;
      var jawA = into(trap, c.mesh(new T.TorusGeometry(0.85, 0.06, 6, 20, Math.PI), '#9aa3c0', TI, { metalness: 0.8 }));
      var jawB = into(trap, c.mesh(new T.TorusGeometry(0.85, 0.06, 6, 20, Math.PI), '#9aa3c0', TI, { metalness: 0.8 }));
      c.label('капкан', [2, 1.3, 0], 0.4);
      c.state = { m: 0, t0: 0, now: 0, lion: lion, fox: fox };
      c.onFrame(function (t) {
        c.state.now = t; var m = c.state.m, k = Math.min(1, ((t - c.state.t0) * 0.25) % 1.4);
        lion.visible = m === 0 || m === 3; fox.visible = m >= 1;
        var shut = 0;
        if (m === 0) { lion.position.set(-6 + k * 8, 0, 0); shut = k > 0.95 ? 1 : 0; wolves.forEach(function (w, i) { w.position.set(5 + i * 0.6 + k * 2, 0, -3 + i * 3); w.rotation.y = 0; }); }
        if (m === 1) { fox.position.set(-6 + k * 12, 0, Math.sin(Math.min(1, Math.max(0, (k - 0.55) * 3)) * Math.PI) * 2.2); wolves.forEach(function (w, i) { w.position.set(0 + i * 1.2, 0, -4); w.rotation.y = Math.PI / 2; }); }
        if (m === 2) { fox.position.set(-2 + k * 8, 0, 2.4 * Math.sin(k * Math.PI)); wolves.forEach(function (w, i) { var kk = Math.max(0, k - 0.12 * (i + 1)); w.position.set(-5 + kk * 7.4, 0, 0.3 * (i - 1)); w.rotation.y = 0; }); shut = k > 0.9 ? 1 : 0; }
        if (m === 3) { lion.position.set(-1.5, 0, 1.5); fox.position.set(-1.5, 0, -1); wolves.forEach(function (w, i) { w.position.set(5 + i * 0.7 + Math.sin(t) * 0.3, 0, -3 + i * 3); w.rotation.y = 0; }); lion.scale.setScalar(1 + Math.sin(t * 3) * 0.03); }
        jawA.rotation.x = lerp(-Math.PI / 2, -0.1, shut); jawB.rotation.x = lerp(-Math.PI / 2, -Math.PI + 0.1, shut); jawA.position.y = jawB.position.y = 0.1;
        tail.rotation.x = Math.sin(t * 5) * 0.3;
      });
    },
    chips: [
      { t: 'Лев', small: 'только сила', on: function (c) { c.state.m = 0; c.state.t0 = c.state.now; c.setView(0.2, 0.9, 16, 0.8); c.pick(c.state.lion.children[0]); } },
      { t: 'Лиса', small: 'видит капкан', on: function (c) { c.state.m = 1; c.state.t0 = c.state.now; c.setView(0.2, 0.9, 16, 0.8); c.pick(c.state.fox.children[0]); } },
      { t: 'Волки в капкан', on: function (c) { c.state.m = 2; c.state.t0 = c.state.now; c.setView(0.6, 0.85, 15, 0.8, 1); c.say('Лиса «и волков обойдёт, и капкан заметит, а иногда и <b>приведёт волков к капкану</b>». Это действие <b>хитростью, а не силой</b>.'); } },
      { t: 'Государь', small: 'оба', on: function (c) { c.state.m = 3; c.setView(0.3, 1.0, 14, 0.8); c.say('Государь должен быть <b>и львом, и лисой</b>. Сам Макиавелли, по лектору, проявил себя лисой, но львом не стал — хотя понимал, что без армии (ополчения) и стен не обойтись.'); } }
    ]
  });

  /* ---------- 12. Государь и группы интересов ---------- */
  reg('mak-interests3d', {
    title: '«Короля играет свита»: баланс интересов', lead: 'Государь стоит на круглой платформе. Канаты тянут группы интересов. Если одна тянет сильнее — платформа кренится.',
    radius: 18, phi: 0.9, theta: 0.5, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var plat = group(c, 0, 1.2, 0);
      into(plat, c.mesh(new T.CylinderGeometry(1.6, 1.6, 0.2, 30), '#c9a24a', '<b>Решения государя</b> складываются из баланса интересов вокруг него.'));
      var king = person(c, 0, 0, '#6b2a8a', '<b>Государь</b> действует не в одиночку. Он правит на основе интересов, прежде всего <b>знати</b>.', 1.1, plat);
      var cr = into(king, c.mesh(new T.TorusGeometry(0.25, 0.07, 8, 6), '#f0c36b', 'Государь.', { metalness: 0.8 })); cr.rotation.x = Math.PI / 2; cr.position.y = 1.65;
      c.mesh(new T.CylinderGeometry(0.2, 0.3, 1.1, 10), '#9aa3c0', 'Опора.').position.y = 0.55;
      var G = [
        ['Знать', '#b07cff', '<b>Знать</b> — главная группа интересов вокруг государя.', 1.4],
        ['Армия', '#ef6b5b', '<b>Военные.</b> Без полководцев не обходился ни Александр, ни Цезарь, ни Наполеон.', 1],
        ['Финансисты', '#f0c36b', '<b>Финансисты</b>: казна, налоги, займы.', 1],
        ['Народ', '#7aa2ff', '<b>Народ.</b> Его согласие — мерило успеха правителя.', 1],
        ['Родня', '#4fc3a1', '<b>Родственники.</b> Им доверяли столицу, пока государь в походе: иначе армию по возвращении могли объявить изменниками. Лектор: в XXI веке раздача ролей родне выглядит странно.', 1]
      ];
      var grp = [];
      G.forEach(function (g, i) {
        var a = i / G.length * Math.PI * 2, x = Math.sin(a) * 6, z = Math.cos(a) * 6;
        var team = group(c, x, 0, z);
        for (var k = 0; k < 3; k++) { var p = person(c, (k - 1) * 0.6, 0, g[1], g[2], 0.8, team); }
        team.lookAt(0, 0, 0);
        c.label(g[0], [x, 2.2, z], 0.42);
        var rope = c.link([x * 0.82, 1, z * 0.82], [Math.sin(a) * 1.6, 1.25, Math.cos(a) * 1.6], '#d8c8a0', 0.04, g[2]);
        grp.push({ team: team, a: a, w: g[3], base: [x, z], rope: rope });
      });
      c.state = { m: 0, grp: grp, king: king };
      c.onFrame(function (t) {
        var m = c.state.m, fx = 0, fz = 0;
        grp.forEach(function (g, i) {
          var w = m === 1 && i === 0 ? 3 : m === 2 ? 1 : g.w;
          fx += Math.sin(g.a) * w; fz += Math.cos(g.a) * w;
          g.team.position.y = Math.abs(Math.sin(t * 3 + i)) * 0.05 * w;
        });
        plat.rotation.x = lerp(plat.rotation.x, fz * 0.05, 0.05); plat.rotation.z = lerp(plat.rotation.z, -fx * 0.05, 0.05);
      });
    },
    chips: [
      { t: 'Свита', small: 'вокруг государя', on: function (c) { c.state.m = 0; c.setView(0.5, 0.9, 18, 1.2); c.say('Группы интересов вокруг государя <b>определяют</b> его решения. Отсюда выражение «<b>короля играет свита</b>».'); } },
      { t: 'Перекос', small: 'знать тянет', on: function (c) { c.state.m = 1; c.setView(0.1, 1.1, 16, 1.2); c.say('Если одна группа тянет сильнее остальных, платформа кренится: решения начинают служить ей одной. Это <b>конфликт интересов</b>.'); } },
      { t: 'Баланс', on: function (c) { c.state.m = 2; c.setView(0.5, 0.9, 18, 1.2); c.pick(c.state.king.children[0]); } }
    ]
  });

  /* ---------- 13. Круговорот форм правления и смешанное правление ---------- */
  reg('mak-cycle3d', {
    title: 'Круговорот форм правления и римское смешанное правление', lead: 'Шар бежит по кругу: каждая правильная форма вырождается в свою противоположность. В центре — храм смешанного правления на трёх колоннах.',
    radius: 20, phi: 0.85, theta: 0.3, targetY: 1.4, height: 400,
    build: function (c) {
      var T = c.THREE;
      c.ground(9.5);
      var F = [
        ['Монархия', '#4fc3a1', '<b>Монархия</b> (самодержавие) — правление одного ради общего блага.'],
        ['Тирания', '#ef6b5b', '<b>Тирания.</b> Через несколько поколений самодержавие вырождается: правитель служит только себе. Народ свергает тиранов.'],
        ['Аристократия', '#4fc3a1', '<b>Аристократия</b> — призвали «лучших».'],
        ['Олигархия', '#ef6b5b', '<b>Олигархия.</b> Знать стремится закрепиться у власти любой ценой, капитал управляет сам для себя.'],
        ['Народное правление', '#4fc3a1', '<b>Народное правление</b> — власть многих.'],
        ['Распущенность', '#ef6b5b', '<b>Распущенность (анархия)</b>: временное народное правление нестабильно, в нём хаос. Его заканчивает призыв сильного или «лучших» — и круг повторяется.']
      ];
      var nodes = [];
      F.forEach(function (f, i) {
        var a = i / 6 * Math.PI * 2, x = Math.sin(a) * 6.5, z = Math.cos(a) * 6.5;
        var n = c.mesh(i % 2 ? new T.OctahedronGeometry(0.6) : new T.SphereGeometry(0.6, 18, 12), f[1], f[2]); n.position.set(x, 0.8, z); nodes.push(n);
        c.label(f[0], [x, 1.9, z], 0.42);
      });
      var ring = c.mesh(new T.TorusGeometry(6.5, 0.06, 6, 80), '#9aa3c0', '<b>Губительный круговорот</b>: движение из крайности в крайность — от тирании одного к «тирании» толпы.'); ring.rotation.x = Math.PI / 2; ring.position.y = 0.8;
      var runner = c.mesh(new T.SphereGeometry(0.3, 14, 10), '#f0c36b', 'Государство движется по кругу форм.', { emissive: new T.Color('#6a5010') });
      var temple = group(c, 0, 0, 0);
      into(temple, c.box3(4.2, 0.3, 2.6, '#d8d2c0', [0, 0.15, 0], '<b>Смешанное правление</b> — выход, который находят мудрые законодатели.'));
      var COL = [['Консулы', '<b>Консулы</b> — элемент <b>монархии</b>.'], ['Сенат', '<b>Сенат</b> — элемент <b>аристократии</b>.'], ['Трибуны', '<b>Народные трибуны</b> — элемент <b>народного правления</b>, механизм обратной связи народа с сенатом.']];
      var cols = [];
      COL.forEach(function (cc, i) { var m = into(temple, c.mesh(new T.CylinderGeometry(0.3, 0.35, 2.6, 14), '#efe8d8', cc[1])); m.position.set(-1.4 + i * 1.4, 1.6, 0); cols.push(m); temple.add(c.label(cc[0], [-1.4 + i * 1.4, 1.2, 1.4], 0.35)); });
      var roof = into(temple, c.mesh(new T.ConeGeometry(2.8, 1, 4), '#c9b88a', '<b>Рим</b>: конфликт патрициев и плебеев при смешанной форме делал республику свободной и сильной.')); roof.position.y = 3.4; roof.rotation.y = Math.PI / 4; roof.scale.z = 0.6;
      var sparta = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.3, 16), '#c8332f', '<b>Спарта</b>: законы Ликурга продержались <b>более 800 лет</b> — благодаря смешанной форме.'); sparta.position.set(0, 0.15, 3.4);
      c.label('Спарта · 800 лет', [0, 0.8, 3.4], 0.35);
      c.state = { m: 0, nodes: nodes, cols: cols, roof: roof, sparta: sparta };
      c.onFrame(function (t) {
        var m = c.state.m, a = t * 0.5;
        runner.visible = m === 0;
        runner.position.set(Math.sin(a) * 6.5, 0.8 + Math.abs(Math.sin(a * 3)) * 0.3, Math.cos(a) * 6.5);
        nodes.forEach(function (n, i) { var d = Math.abs(((a / (Math.PI * 2) * 6 - i) % 6 + 6) % 6); n.scale.setScalar(m === 0 && (d < 0.4 || d > 5.6) ? 1.35 : 1); n.rotation.y = t; });
        cols.forEach(function (cl, i) { cl.scale.y = m === 2 ? 1 + Math.sin(t * 2 + i * 2) * 0.03 : 1; });
        c.state.cols[2].material.emissive.setHex(m === 3 ? 0x225588 : 0x000000);
        temple.scale.setScalar(lerp(temple.scale.x, m >= 1 ? 1.15 : 1, 0.05));
      });
    },
    chips: [
      { t: 'Круговорот', on: function (c) { c.state.m = 0; c.setView(0.3, 0.75, 22, 0.8); c.say('Три правильные формы — <b>монархия, аристократия, народное правление</b> — вырождаются в <b>тиранию, олигархию, распущенность</b>. И всё повторяется. <b>[ДОБАВЛЕНО]</b> «Рассуждения», кн. I, гл. 2 (вслед за Полибием).'); } },
      { t: 'Спарта', small: '800 лет', on: function (c) { c.state.m = 1; c.setView(0.1, 0.9, 10, 0.6, 0, 3); c.pick(c.state.sparta); } },
      { t: 'Рим', small: '3 колонны', on: function (c) { c.state.m = 2; c.setView(0.2, 0.95, 12, 1.8); c.pick(c.state.roof); } },
      { t: 'Трибуны', small: 'вера в механизм', on: function (c) { c.state.m = 3; c.setView(0.5, 0.95, 9, 1.6, 1.4); c.say('Лектор: <b>вера</b> плебеев, что они могут достучаться до власти через трибунов, была <b>сильнее</b> самого механизма. «<b>Вера в механизм важнее, чем сам механизм</b>».'); } }
    ]
  });

  /* ---------- 14. Культура — подушка безопасности ---------- */
  reg('mak-airbag3d', {
    title: 'Культура — подушка безопасности государства', lead: 'Образ лектора: государство, как автомобиль, врезается в стену кризиса. Смягчит ли удар подушка — культура?',
    radius: 17, phi: 1.0, theta: -0.45, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.box3(16, 0.2, 6, '#3a3f4a', [0, -0.1, 0], 'Дорога истории.');
      var wall = c.box3(0.8, 3.2, 5, '#8a4a3a', [6, 1.6, 0], '<b>Стена кризиса</b>: падение власти, двоевластие, смута.');
      c.label('кризис', [6, 3.8, 0], 0.45, '#ef6b5b');
      var car = group(c, 0, 0, 0);
      var CI = '<b>Государство</b> — автомобиль, в котором едут все: «водитель» (власть) и «пассажиры» (граждане).';
      into(car, c.box3(3, 0.8, 1.6, '#2f8cff', [0, 0.7, 0], CI));
      into(car, c.box3(1.6, 0.7, 1.5, '#5cc8ff', [-0.2, 1.45, 0], CI));
      [[-1, 0.8], [-1, -0.8], [1, 0.8], [1, -0.8]].forEach(function (q) { var w = into(car, c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.25, 16), '#222', CI)); w.rotation.x = Math.PI / 2; w.position.set(q[0], 0.35, q[1]); });
      var pas = [];
      [[-0.6, 0.35], [-0.6, -0.35], [0.3, 0.35], [0.3, -0.35]].forEach(function (q) { var p = into(car, c.mesh(new T.SphereGeometry(0.2, 10, 8), '#e8c6a0', 'Граждане.')); p.position.set(q[0], 1.5, q[1]); pas.push(p); });
      var AI = '<b>Культура</b> — подушка безопасности. Она удерживает гражданский дух и гражданскую добродетель, когда власть рушится. Общество оказывается <b>самоорганизующейся системой</b> со своими нормами.';
      var bag = into(car, c.mesh(new T.SphereGeometry(1.05, 24, 16), '#fff4d6', AI, { emissive: new T.Color('#5a4010') })); bag.position.set(1.35, 1.7, 0); bag.scale.setScalar(0.01);
      var bagLabel = c.label('культура', [1.35, 3.1, 0], 0.45, '#ff8a1f'); car.add(bagLabel);
      c.state = { m: 0, t0: 0, now: 0, bag: bag };
      c.onFrame(function (t) {
        c.state.now = t; var m = c.state.m, k = Math.min(1, (t - c.state.t0) * 0.45);
        var x = -6 + k * 9.6; car.position.x = Math.min(x, 3.6);
        var hit = x >= 3.55;
        bag.visible = m === 0;
        bag.scale.setScalar(lerp(bag.scale.x, hit && m === 0 ? 1 : 0.01, 0.25)); bagLabel.visible = bag.visible && bag.scale.x > 0.5;
        pas.forEach(function (p, i) {
          if (hit && m === 1) { p.position.x = lerp(p.position.x, 2.6 + i * 0.3, 0.08); p.position.y = lerp(p.position.y, 0.6 + (i % 2) * 1.2, 0.08); }
          else if (!hit) { p.position.x = [-0.6, -0.6, 0.3, 0.3][i]; p.position.y = 1.5; }
        });
        car.rotation.z = hit && m === 1 ? lerp(car.rotation.z, 0.18, 0.1) : lerp(car.rotation.z, 0, 0.1);
        wall.position.x = 6 + (hit ? Math.sin(t * 40) * 0.02 : 0);
      });
    },
    chips: [
      { t: 'С культурой', on: function (c) { c.state.m = 0; c.state.t0 = c.state.now; c.setView(-0.45, 1.0, 14, 1.2, 2); c.say('Удар есть, но подушка смягчает его для всех. Поэтому <b>устойчивее</b> государства, где культуру поддерживают: она — горизонт возможностей и планирования.'); } },
      { t: 'Без культуры', on: function (c) { c.state.m = 1; c.state.t0 = c.state.now; c.setView(-0.45, 1.0, 14, 1.2, 2); c.say('Без подушки кризис бьёт по всем. Отсюда у Макиавелли в числе порицаемых — <b>«враги литературы»</b> («Рассуждения», кн. I, гл. 10).'); } },
      { t: 'Подушка', small: 'что это', on: function (c) { c.state.m = 0; c.setView(-0.6, 1.0, 8, 1.4, 3.6); c.pick(c.state.bag); } }
    ]
  });

  /* ---------- 15. Айсберг политики ---------- */
  reg('mak-iceberg3d', {
    title: 'Айсберг политики: видимое и скрытое', lead: 'Над водой — то, что видно всем. Под водой — латентные процессы: больше половины всех решений. Покрути модель снизу.',
    radius: 18, phi: 1.2, theta: 0.4, targetY: -0.5, height: 400,
    build: function (c) {
      var T = c.THREE;
      var top = c.mesh(new T.ConeGeometry(1.8, 2.6, 7), '#e8f4ff', '<b>Видимая политика</b>: выборы, заседания Госдумы, Общественной палаты, речи, публичные суды.', { roughness: 0.3 }); top.position.y = 1.3;
      var under = c.mesh(new T.ConeGeometry(3.6, 6, 7), '#8fc6ee', '<b>Скрытая часть</b> — больше половины: согласование интересов, обсуждение поправок, подковёрная борьба, служебные инструкции, закрытые дела. Недоступна для контроля.', { roughness: 0.3, transparent: true, opacity: 0.85 }); under.rotation.x = Math.PI; under.position.y = -3;
      var water = c.mesh(new T.CylinderGeometry(8, 8, 0.05, 48), '#1f6fbf', 'Поверхность: граница публичности.', { transparent: true, opacity: 0.35, depthWrite: false });
      var up = [['выборы', 1.6, 2.6], ['Госдума', -1.4, 1.8], ['речи', 0.4, 3.0]];
      up.forEach(function (u) { c.label(u[0], [u[1], u[2], 1.2], 0.4); });
      var dn = [['согласование интересов', 2.2, -1.4], ['поправки', -2.4, -2.2], ['служебные инструкции', 1.8, -3.4], ['закрытые дела', -1.8, -4.4], ['подковёрная борьба', 0.6, -5.4]];
      var dl = dn.map(function (d) { return c.label(d[0], [d[1], d[2], 2.6], 0.38, '#9fd6ff'); });
      var meter = c.box3(0.3, 0.01, 0.3, '#ff8a1f', [6, 0, 0], '<b>Больше 50%</b> всех обсуждений, решений и исполнения скрыты — по оценке лектора.');
      c.label('>50% скрыто', [6, -6.5, 0], 0.4, '#ff8a1f');
      c.state = { m: 0, top: top, under: under, dl: dl, meter: meter };
      c.onFrame(function (t) {
        var m = c.state.m;
        top.rotation.y = under.rotation.y = t * 0.15;
        water.position.y = Math.sin(t * 1.5) * 0.04;
        var h = m >= 2 ? 6 : 0.01; meter.scale.y = lerp(meter.scale.y, h * 100, 0.05); meter.position.y = -meter.scale.y * 0.005;
        dl.forEach(function (l, i) { l.visible = m >= 1; });
      });
    },
    chips: [
      { t: 'Над водой', on: function (c) { c.state.m = 0; c.setView(0.4, 1.0, 12, 1.5); c.pick(c.state.top); } },
      { t: 'Под водой', on: function (c) { c.state.m = 1; c.setView(0.4, 1.45, 16, -3); c.pick(c.state.under); } },
      { t: 'Больше половины', on: function (c) { c.state.m = 2; c.setView(1.2, 1.3, 20, -2.5); c.say('Если взять за 100% все обсуждения и решения, больше половины — в скрытой фазе. Поэтому <b>власть не может быть абсолютно открытой</b>, даже в прозрачной демократии. Прямая демократия возможна только в маленьком сообществе.'); } }
    ]
  });
})();
