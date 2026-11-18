/* 3D-модели к конспекту «Жан Боден» (История полит. учений, 18.11), движок HubScene3d.
   В Markdown: @@graph:bod-timeline3d@@ @@graph:bod-sources3d@@ @@graph:bod-careers3d@@ @@graph:bod-history3d@@
   @@graph:bod-epochs3d@@ @@graph:bod-progress3d@@ @@graph:bod-justice3d@@ @@graph:bod-forms3d@@
   @@graph:bod-education3d@@ @@graph:bod-slavery3d@@ @@graph:bod-sovereign3d@@ @@graph:bod-territory3d@@
   @@graph:bod-religion3d@@ @@graph:bod-seven3d@@ @@graph:bod-demon3d@@ @@graph:bod-theatre3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var lab = c.label; c.label = function (t, pos, size, col) { return lab(t, pos, (size || 0.9) * 1.55, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function into(g, m) { g.add(m); return m; }
  function person(c, x, z, col, info, h, parent) {
    var T = c.THREE, g = new T.Group(); g.position.set(x, 0, z); (parent || c.root).add(g); h = h || 1;
    into(g, c.mesh(new T.CylinderGeometry(0.26 * h, 0.36 * h, 1.05 * h, 12), col, info)).position.y = 0.53 * h;
    into(g, c.mesh(new T.SphereGeometry(0.25 * h, 14, 10), '#e8c6a0', info)).position.y = 1.3 * h;
    g.userData.info = info;
    return g;
  }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function opacity(g, op) {
    g.traverse(function (x) {
      if (x.material && !x.isSprite) { var on = op < 0.99; if (x.material.transparent !== on) x.material.needsUpdate = true; x.material.transparent = on; x.material.opacity = op; x.material.depthWrite = !on; }
      if (x.isSprite) x.material.opacity = Math.max(op, 0.05);
    });
  }

  /* ---------- 1. Спираль жизни ---------- */
  reg('bod-timeline3d', {
    title: 'Жизнь Жана Бодена: спираль лет', lead: 'Спираль идёт снизу вверх по годам. Синий — служба и политика, фиолетовый — книги, красный — войны и суды. Нажми на шар или кнопку.',
    radius: 24, phi: 1.0, targetY: 4, height: 400,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var E = [
        [1530, 'Рождение', '<b>≈1530</b> — Жан Боден родился в <b>Анже</b> в не очень знатной семье. <b>[ДОБАВЛЕНО: город; год точно не известен — 1529 или 1530]</b>', '#f0c36b'],
        [1545, 'Кармелиты', 'В юности — <b>орден кармелитов</b>: классическое образование, латынь, греческий, древнееврейский. Читает <b>первоисточники в оригинале</b>.', '#7aa2ff'],
        [1559, 'Речь в Тулузе', '<b>1559</b> — <b>речь о воспитании юношества</b> перед сенатом и народом Тулузы: добродетель невозможна без просвещения.', '#b07cff'],
        [1562, 'Присяга', '<b>1562</b> — возвращение в <b>Париж</b>, адвокат Парижского парламента; публичная <b>присяга католической вере</b>. Лектор: скорее <b>прагматизм</b>, чем беспринципность.', '#7aa2ff'],
        [1566, '«Метод»', '<b>1566</b> — <b>«Метод лёгкого познания истории»</b>: человек с разумом и свободой воли — двигатель истории; три эпохи.', '#b07cff'],
        [1568, 'Малеструа', '<b>1568</b> — «Ответ на парадоксы Малеструа»: цены растут из-за притока серебра и золота из Америки. <b>[ДОБАВЛЕНО]</b>', '#b07cff'],
        [1572, 'Варфоломеевская ночь', '<b>1572</b> — Варфоломеевская ночь: массовое убийство гугенотов. Боден против духа религиозных войн. <b>[ДОБАВЛЕНО: дата]</b>', '#ef6b5b'],
        [1576, '«Шесть книг»', '<b>1576</b> — <b>«Шесть книг о государстве»</b>: суверенитет. В том же году — депутат от <b>третьего сословия</b> в Генеральных штатах в Блуа. <b>[ДОБАВЛЕНО: Блуа]</b>', '#b07cff'],
        [1578, 'Жанна Арвилье', '<b>1578</b> — процесс над <b>Жанной Арвилье</b>, обвинённой в колдовстве. <b>[ДОБАВЛЕНО]</b>', '#ef6b5b'],
        [1580, '«Демономания»', '<b>1580</b> — <b>«Демономания колдунов»</b>: ведьма — слуга дьявола; Боден защищает доносы и пытки.', '#ef6b5b'],
        [1587, 'Прокурор в Лане', '<b>Королевский прокурор в Лане</b> — должность перешла от <b>тестя</b>: пример наследования должностей в сословном обществе. <b>[ДОБАВЛЕНО: ≈1587]</b>', '#7aa2ff'],
        [1588, '«Беседа семерых»', '<b>≈1588</b> — <b>«Беседа семерых»</b>: семь людей разной веры спорят о религии и расходятся в мире. <b>[ДОБАВЛЕНО: год]</b>', '#b07cff'],
        [1594, 'Индекс', '<b>1594</b> — «Демономания» внесена церковью в <b>Индекс запрещённых книг</b>. <b>[ДОБАВЛЕНО: год]</b>', '#ef6b5b'],
        [1596, '«Театр природы», смерть', '<b>1596</b> — издан <b>«Театр всей природы»</b>; Боден умер в Лане от <b>чумы</b>. <b>[ДОБАВЛЕНО: причина смерти]</b>', '#f0c36b']
      ];
      var balls = [], pts = [];
      E.forEach(function (e, i) {
        var a = i * 0.72, r = 6.2, y = 0.6 + i * 0.6;
        var big = i === 0 || i === 4 || i === 7 || i === 13;
        var b = c.mesh(new T.SphereGeometry(big ? 0.62 : 0.45, 20, 14), e[3], e[2], { emissive: new T.Color(e[3]).multiplyScalar(0.15) });
        b.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
        c.label(e[0] + ' · ' + e[1], [Math.sin(a) * r, y + 0.85, Math.cos(a) * r], 0.42);
        balls.push(b); pts.push(b.position.clone());
      });
      c.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 140, 0.07, 8), '#9aa3c0', 'Время идёт по спирали вверх.');
      var col = c.mesh(new T.CylinderGeometry(0.45, 0.65, 8.2, 20), '#e8e0cc', '<b>Жан Боден (≈1530–1596)</b>: юрист, историк, философ, экономист. Главное понятие — <b>суверенитет</b>.');
      col.position.y = 4.1;
      c.label('Боден', [0, 8.8, 0], 0.6, '#f0c36b');
      c.state = { balls: balls };
      c.onFrame(function (t) { balls.forEach(function (b, i) { b.position.y = 0.6 + i * 0.6 + Math.sin(t * 2 + i) * 0.07; }); });
    },
    chips: [
      { t: '1562', small: 'присяга', on: function (c) { c.setView(2.2, 1.0, 18, 2.4); c.pick(c.state.balls[3]); } },
      { t: '1566', small: '«Метод»', on: function (c) { c.setView(2.9, 1.0, 18, 3); c.pick(c.state.balls[4]); } },
      { t: '1576', small: 'суверенитет', on: function (c) { c.setView(5.0, 1.0, 18, 4.8); c.pick(c.state.balls[7]); } },
      { t: '1580', small: 'ведьмы', on: function (c) { c.setView(6.5, 1.0, 18, 6); c.pick(c.state.balls[9]); } },
      { t: '1596', small: 'финал', on: function (c) { c.setView(9.4, 0.95, 18, 8.4); c.pick(c.state.balls[13]); } }
    ]
  });

  /* ---------- 2. Оригинал и перевод ---------- */
  reg('bod-sources3d', {
    title: 'Первоисточник и перевод: что теряется', lead: 'Слева — текст на языке оригинала (много цветов-оттенков). Он проходит через «фильтры» перевода и пересказа и теряет краски. Нажимай кнопки.',
    radius: 18, phi: 1.05, theta: 0.2, targetY: 1.4,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var COLS = ['#ff8a1f', '#7aa2ff', '#4fc3a1', '#f0c36b', '#b07cff', '#ef6b5b'];
      var MEAN = ['смысл', 'интонация', 'игра слов', 'ритм', 'намёк', 'настроение'];
      var src = c.box3(1.6, 2.2, 0.25, '#e8e0cc', [-5.5, 1.4, 0], '<b>Первоисточник</b> на языке оригинала (латынь, греческий, древнееврейский). Боден читал древних авторов именно так.');
      c.label('Оригинал', [-5.5, 3.1, 0], 0.45, '#f0c36b');
      var f1 = c.box3(0.15, 2.6, 2.6, '#9fd6ff', [-1.5, 1.4, 0], '<b>Фильтр 1 — перевод.</b> Переводчик передаёт общий смысл, но теряет оттенки и игру слов.'); opacity(f1, 0.35);
      var f2 = c.box3(0.15, 2.6, 2.6, '#9fd6ff', [2.2, 1.4, 0], '<b>Фильтр 2 — пересказ, учебник, «вторые источники».</b> Остаётся только сюжет.'); opacity(f2, 0.35);
      c.label('перевод', [-1.5, 3.1, 0], 0.4); c.label('пересказ', [2.2, 3.1, 0], 0.4);
      var dst = c.box3(1.6, 2.2, 0.25, '#7d8496', [5.6, 1.4, 0], '<b>Читатель переводов</b> понимает общий смысл, но не «гармонию» текста — не почему автор сказал именно так.');
      var bits = [];
      for (var i = 0; i < 18; i++) {
        var k = i % 6;
        var s = c.mesh(new T.SphereGeometry(0.2, 12, 8), COLS[k], 'Оттенок текста: <b>' + MEAN[k] + '</b>.', { emissive: new T.Color(COLS[k]).multiplyScalar(0.2) });
        s.userData.k = k; s.userData.ph = i / 18; bits.push(s);
      }
      c.state = { m: 0 };
      c.onFrame(function (t) {
        bits.forEach(function (s, i) {
          var p = (t * 0.12 + s.userData.ph) % 1, x = -5.5 + p * 11.1;
          s.position.set(x, 1.4 + Math.sin(i * 1.7) * 0.8, Math.cos(i * 2.3) * 0.8);
          var lost = c.state.m === 0 ? 0 : (x > -1.5 && s.userData.k >= 3 ? 1 : 0) + (x > 2.2 && s.userData.k >= 1 ? 1 : 0);
          s.visible = c.state.m === 2 ? x < -5 || !lost : true;
          s.material.color.set(lost ? '#7d8496' : COLS[s.userData.k]);
        });
      });
    },
    chips: [
      { t: 'Оригинал', on: function (c) { c.state.m = 0; c.setView(-0.6, 1.0, 11, 1.4, -4); c.say('В оригинале все оттенки на месте: смысл, интонация, игра слов, ритм, намёк, настроение. Поэтому Боден учил <b>древние языки</b>.'); } },
      { t: 'Через переводы', on: function (c) { c.state.m = 1; c.setView(0.2, 1.05, 18, 1.4); c.say('После перевода часть оттенков <b>сереет</b>, после пересказа остаётся почти только <b>смысл</b>. Лектор: «без языка невозможно полностью погрузиться в замысел и настроение автора».'); } },
      { t: 'Что дошло', on: function (c) { c.state.m = 2; c.setView(0.6, 1.0, 11, 1.4, 4); c.say('До читателя «через вторые руки» доходит в основном <b>общий смысл</b>. Понять можно, но <b>гармонию</b> текста — нет.'); } }
    ]
  });

  /* ---------- 3. Шестерёнки карьер ---------- */
  reg('bod-careers3d', {
    title: 'Юрист, дипломат, учёный: шестерёнки усиливают друг друга', lead: 'Три шестерёнки — три занятия Бодена. Крутятся вместе: одно занятие не мешает другому, а наполняет и усиливает его.',
    radius: 15, phi: 1.1, theta: 0.1, targetY: 2.6,
    build: function (c) {
      var T = c.THREE;
      function gear(x, y, r, col, info, name) {
        var g = new T.Group(); g.position.set(x, y, 0); c.root.add(g);
        into(g, c.mesh(new T.CylinderGeometry(r, r, 0.4, 32), col, info, { metalness: 0.5, roughness: 0.35 })).rotation.x = Math.PI / 2;
        var n = Math.round(r * 9);
        for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; var tt = into(g, c.mesh(new T.BoxGeometry(0.3, 0.38, 0.4), col, info, { metalness: 0.5 })); tt.position.set(Math.cos(a) * (r + 0.15), Math.sin(a) * (r + 0.15), 0); tt.rotation.z = a; }
        into(g, c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.6, 16), '#2b3350', info)).rotation.x = Math.PI / 2;
        c.label(name, [x, y + r + 0.9, 0.4], 0.42);
        g.userData.info = info; return g;
      }
      var A = gear(-2.6, 2.4, 1.8, '#7aa2ff', '<b>Юрист:</b> Тулуза, адвокат Парижского парламента, королевский прокурор в Лане. Практика права даёт материал для теории государства.', 'Юрист');
      var B = gear(1.05, 3.4, 1.2, '#ff8a1f', '<b>Дипломат:</b> миссии и посольства (<b>[ДОБАВЛЕНО]</b> польское посольство 1573 г., поездка в Англию). В XVI веке складывается вся система дипломатических связей.', 'Дипломат');
      var C = gear(1.3, 0.55, 1.0, '#4fc3a1', '<b>Учёный:</b> история, право, экономика, религия, натурфилософия. Теория помогает в практике.', 'Учёный');
      c.state = { gs: [A, B, C], sp: 1 };
      c.onFrame(function (t) { var s = c.state.sp; A.rotation.z = t * 0.5 * s; B.rotation.z = -t * 0.75 * s; C.rotation.z = -t * 0.9 * s; });
    },
    chips: [
      { t: 'Юрист', on: function (c) { c.state.sp = 1; c.pick(c.state.gs[0].children[0]); } },
      { t: 'Дипломат', on: function (c) { c.state.sp = 1; c.pick(c.state.gs[1].children[0]); } },
      { t: 'Учёный', on: function (c) { c.state.sp = 1; c.pick(c.state.gs[2].children[0]); } },
      { t: 'Вместе быстрее', on: function (c) { c.state.sp = 3; c.say('Мысль лектора: бывает, человек занят одним делом, а его привлекают к другому — дипломатическому, политическому. Это <b>не мешает</b>, а <b>наполняет</b> и даже <b>усиливает</b>.'); } }
    ]
  });

  /* ---------- 4. Ошибки разума в истории ---------- */
  reg('bod-history3d', {
    title: 'История: путь разума, ошибок и исправлений', lead: 'Шар — человек с разумом и свободой воли. Он идёт по извилистой дороге. Ошибка разума сбивает курс и «застывает» в законах (серые блоки). Разум может её исправить.',
    radius: 20, phi: 0.9, theta: 0.5, targetY: 0.8,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var P = [], P2 = [];
      for (var i = 0; i <= 40; i++) { var x = -8 + i * 0.4; P.push(new T.Vector3(x, 0.15, Math.sin(i * 0.35) * 1.2)); P2.push(new T.Vector3(x, 0.15, Math.sin(i * 0.35) * 1.2 + (x > -2 && x < 4 ? Math.sin((x + 2) / 6 * Math.PI) * 4 : 0))); }
      var right = new T.CatmullRomCurve3(P), wrong = new T.CatmullRomCurve3(P2);
      c.mesh(new T.TubeGeometry(right, 120, 0.12, 8), '#4fc3a1', '<b>Естественный порядок вещей</b> — путь, от которого человек постоянно отклоняется. История — не прямая линия.');
      var wr = c.mesh(new T.TubeGeometry(wrong, 120, 0.12, 8), '#ef6b5b', '<b>Искажённый ход истории</b>: заблуждение о том, куда должно двигаться государство.');
      var man = c.mesh(new T.SphereGeometry(0.45, 20, 14), '#f0c36b', '<b>Человек, обладающий разумом и свободой воли</b> — источник и двигатель истории. Богатство народа — не золото и серебро, а такие люди.', { emissive: new T.Color('#f0c36b').multiplyScalar(0.3) });
      var err = c.mesh(new T.OctahedronGeometry(0.5), '#ef6b5b', '<b>Ошибка разума</b>: ложное представление, заблуждение.'); err.position.set(-2, 1.4, 0);
      c.label('ошибка разума', [-2, 2.4, 0], 0.4, '#ef6b5b');
      var laws = [];
      ['закон', 'институт', 'нравы'].forEach(function (n, k) { var b = c.box3(1.2, 0.9, 0.9, '#7d8496', [0.5 + k * 1.6, 0.45, 4.6], '<b>' + n + '</b>: ошибка переходит в законы и социальные институты и порождает <b>искажённые нравы</b>.'); laws.push(b); c.label(n, [0.5 + k * 1.6, 1.4, 4.6], 0.35); });
      var lamp = c.mesh(new T.SphereGeometry(0.35, 16, 12), '#9fd6ff', '<b>Сила разума</b>: анализ своих ошибок и пороков. Без него даже не начинается исправление.', { emissive: new T.Color('#2f8cff').multiplyScalar(0.6) }); lamp.position.set(4, 3, 2);
      c.state = { m: 0, k: 0, wr: wr, err: err, laws: laws, lamp: lamp };
      c.onFrame(function (t) {
        var m = c.state.m, u = (t * 0.07) % 1;
        c.state.k = lerp(c.state.k, m >= 1 && m < 3 ? 1 : 0, 0.04);
        var a = right.getPointAt(u), b = wrong.getPointAt(u);
        man.position.set(lerp(a.x, b.x, c.state.k), 0.6, lerp(a.z, b.z, c.state.k));
        wr.visible = m >= 1; err.visible = m >= 1; err.rotation.y = t;
        laws.forEach(function (l, i) { var on = m >= 2 ? 1 : 0.01; l.scale.y = lerp(l.scale.y, on, 0.05); l.position.y = l.scale.y * 0.45; l.material.color.set(m === 3 ? '#4fc3a1' : '#7d8496'); });
        lamp.visible = m === 3; lamp.position.y = 3 + Math.sin(t * 2) * 0.2;
      });
    },
    chips: [
      { t: 'Разум и воля', on: function (c) { c.state.m = 0; c.setView(0.5, 0.9, 20, 0.8); c.say('Человек с <b>разумом и свободой воли</b> идёт по истории. Путь извилист: ошибки, противоречия, пороки — свойства человеческой природы.'); } },
      { t: 'Ошибка', on: function (c) { c.state.m = 1; c.pick(c.state.err); } },
      { t: 'Ошибка в законах', on: function (c) { c.state.m = 2; c.setView(0.1, 0.8, 16, 0.8, 2, 3); c.say('Ошибка не исчезает: она <b>переходит в законы и институты</b>, и история идёт по искажённому пути. Как ответ на контрольной: подробный, старательный — но <b>на другой вопрос</b>.'); } },
      { t: 'Исправление', on: function (c) { c.state.m = 3; c.pick(c.state.lamp); } }
    ]
  });

  /* ---------- 5. Три эпохи ---------- */
  reg('bod-epochs3d', {
    title: 'Три эпохи истории по Бодену', lead: 'Глобус с тремя поясами: юго-восток, средняя полоса (Греция и Рим), север. Свет переходит от эпохи к эпохе. Нажимай кнопки.',
    radius: 16, phi: 1.05, theta: 0.3, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      var globe = c.mesh(new T.SphereGeometry(3, 40, 30), '#1f3f6f', 'Мир народов. Боден связывал характер народов с <b>климатом</b>. <b>[ДОБАВЛЕНО]</b>', { roughness: 0.8 });
      var Z = [
        ['Юго-восток', -0.75, '#f0c36b', '<b>Эпоха 1 — народы юго-востока</b> (от Ближнего Востока до Персии): религия, познание <b>законов Вселенной</b> (<b>[ДОБАВЛЕНО]</b> астрономия, математика).'],
        ['Греция и Рим', 0.25, '#7aa2ff', '<b>Эпоха 2 — народы средней полосы</b>: Греция и Рим создают <b>государства</b> и <b>юридические системы</b>.'],
        ['Север', 1.15, '#ff8a1f', '<b>Эпоха 3 — народы севера</b>: <b>военное искусство</b>, <b>ремёсла</b>, новейшие <b>изобретения</b>.']
      ];
      var rings = [];
      Z.forEach(function (z, i) {
        var lat = z[1], r = 3.02 * Math.cos(lat), y = 3.02 * Math.sin(lat);
        var ring = c.mesh(new T.TorusGeometry(r, 0.22, 10, 60), z[2], z[3], { emissive: new T.Color(z[2]).multiplyScalar(0.1) });
        ring.rotation.x = Math.PI / 2; ring.position.y = y; rings.push(ring);
        c.label((i + 1) + '. ' + z[0], [r + 1.6, y, 0], 0.42, z[2]);
      });
      var star = c.mesh(new T.SphereGeometry(0.35, 16, 12), '#ffffff', 'Свет «вершины» истории переходит от одной эпохи к другой.', { emissive: new T.Color('#ffffff') });
      c.state = { m: 0, rings: rings, star: star };
      c.onFrame(function (t) {
        globe.rotation.y = t * 0.15;
        var m = c.state.m, lat = m ? Z[m - 1][1] : Z[Math.floor(t / 3) % 3][1];
        star.position.set(Math.cos(t) * 3.5 * Math.cos(lat), 3.4 * Math.sin(lat) + 0.2, Math.sin(t) * 3.5 * Math.cos(lat));
        rings.forEach(function (r, i) { var on = m ? m - 1 === i : Math.floor(t / 3) % 3 === i; r.material.emissive.set(on ? Z[i][2] : '#000000').multiplyScalar(on ? 0.6 : 1); });
      });
    },
    chips: [
      { t: '1. Юго-восток', small: 'религия, знание', on: function (c) { c.state.m = 1; c.pick(c.state.rings[0]); } },
      { t: '2. Греция, Рим', small: 'государство, право', on: function (c) { c.state.m = 2; c.pick(c.state.rings[1]); } },
      { t: '3. Север', small: 'война, ремёсла', on: function (c) { c.state.m = 3; c.pick(c.state.rings[2]); } },
      { t: 'XVI век', small: 'рубеж', on: function (c) { c.state.m = 0; c.say('По словам лектора, люди XVI века находились на <b>рубеже третьей и четвёртой</b> эпохи. Боден верил: в мире есть <b>развитие</b>.'); } }
    ]
  });

  /* ---------- 6. Лестница прогресса ---------- */
  reg('bod-progress3d', {
    title: 'Прогресс: лестница вверх, а не «золотой век» позади', lead: 'Ступени — эпохи. На верхней — изобретения, которых не знали древние: компас, книгопечатание, порох. Рядом — миф о «золотом веке», который Боден отвергал.',
    radius: 17, phi: 1.05, theta: 0.6, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var steps = [];
      for (var i = 0; i < 5; i++) steps.push(c.box3(2.2, 0.6 + i * 0.8, 2.4, ['#3b4a6b', '#465a82', '#52699a', '#5e79b3', '#6b89cc'][i], [-4.4 + i * 2.2, (0.6 + i * 0.8) / 2, 0], 'Ступень развития. История идёт <b>вверх</b>, хотя и с ошибками и падениями.'));
      var top = 0.6 + 4 * 0.8;
      var comp = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.18, 30), '#c9d2e0', '<b>Компас</b> (магнит) — навигация, морские пути, географические открытия. <b>[ДОБАВЛЕНО]</b>', { metalness: 0.7 }); comp.position.set(4.4, top + 0.2, -0.8);
      var needle = c.mesh(new T.BoxGeometry(0.8, 0.05, 0.08), '#ef6b5b', 'Стрелка компаса.'); needle.position.set(4.4, top + 0.33, -0.8);
      var press = c.box3(0.8, 0.8, 0.8, '#7a4a20', [4.4, top + 0.4, 0.2], '<b>Книгопечатание</b> — книги, которые «изменили жизнь людей». <b>[ДОБАВЛЕНО]</b>');
      var can = c.mesh(new T.CylinderGeometry(0.16, 0.22, 1.1, 14), '#2b2b2b', '<b>Порох</b> и пушки — военное превосходство. Испанская и Британская империи без них не сложились бы.', { metalness: 0.6 }); can.rotation.z = Math.PI / 2.4; can.position.set(4.4, top + 0.35, 1.0);
      c.label('изобретения', [4.4, top + 1.4, 0], 0.42, '#ff8a1f');
      var gold = c.mesh(new T.SphereGeometry(0.9, 24, 16), '#f0c36b', '<b>Миф о «золотом веке»</b>: будто в древности всё было лучше, а дальше — только упадок. Боден его <b>отвергал</b>. <b>[ДОБАВЛЕНО]</b>', { metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.8 }); gold.position.set(-6.5, 3.5, 0);
      c.label('«золотой век»?', [-6.5, 4.8, 0], 0.4, '#f0c36b');
      var climber = person(c, -4.4, 0, '#7aa2ff', 'Человечество поднимается по ступеням — через конфликты, силу и открытия.');
      c.state = { m: 0, gold: gold, comp: comp, press: press, can: can };
      c.onFrame(function (t) {
        var p = (t * 0.15) % 1, k = Math.min(4, Math.floor(p * 5));
        climber.position.set(-4.4 + p * 8.8, 0.6 + k * 0.8 - 0.02, 0);
        needle.rotation.y = Math.sin(t * 1.3) * 0.5;
        gold.material.opacity = c.state.m === 1 ? 0.25 + Math.abs(Math.sin(t * 2)) * 0.3 : 0.8;
      });
    },
    chips: [
      { t: 'Миф о прошлом', on: function (c) { c.state.m = 1; c.pick(c.state.gold); } },
      { t: 'Компас', on: function (c) { c.state.m = 0; c.pick(c.state.comp); } },
      { t: 'Печать', on: function (c) { c.state.m = 0; c.pick(c.state.press); } },
      { t: 'Порох', on: function (c) { c.state.m = 0; c.pick(c.state.can); } },
      { t: 'Сила → нормы', on: function (c) { c.state.m = 0; c.say('Победитель приносит <b>новшества</b>. Пример лектора: после Второй мировой Германии и Японии написали конституции и навязали правила торговли — и это помогло их развитию. Сила ломает старое, но в итоге ведёт к <b>закону и норме</b>.'); } }
    ]
  });

  /* ---------- 7. Справедливость: арка из разных камней ---------- */
  reg('bod-justice3d', {
    title: 'Справедливость — не равенство: арка из разных камней', lead: 'Слева — башня из одинаковых кубиков (равенство). Справа — арка из камней разного размера, сложенных по местам (объединение разнородного). Нажимай кнопки.',
    radius: 18, phi: 1.1, theta: 0.2, targetY: 2.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var eq = [];
      for (var i = 0; i < 7; i++) { var b = c.box3(0.9, 0.9, 0.9, '#9aa3c0', [-5, 0.45 + i * 0.92, 0], '<b>Равенство</b>: все одинаковые. Боден: справедливость <b>не равна равенству</b> — мы не равны по природе.'); b.userData.i = i; eq.push(b); }
      c.label('равенство', [-5, 7.4, 0], 0.4);
      var arch = [], N = 11, R = 3.3;
      for (var k = 0; k < N; k++) {
        var a = Math.PI - k / (N - 1) * Math.PI, big = 1 + Math.abs(Math.sin(k * 1.9)) * 0.6;
        var col = k === 5 ? '#ff8a1f' : ['#7aa2ff', '#4fc3a1', '#b07cff', '#f0c36b'][k % 4];
        var info = k === 5 ? '<b>Замковый камень</b> — монарх: держит всю арку. «Монарх — для гражданского общества, а общество — для монарха».' : 'Камень своей формы и размера — <b>сословие, группа</b>. Разные, но каждый на своём месте.';
        var s = c.mesh(new T.BoxGeometry(0.75 * big, 1.0, 1.1), col, info);
        s.position.set(3 + Math.cos(a) * R, 0.5 + Math.sin(a) * R, 0); s.rotation.z = a - Math.PI / 2; s.userData.home = s.position.clone(); arch.push(s);
      }
      c.label('объединение разнородного', [3, 5.2, 0], 0.4, '#ff8a1f');
      var sc = c.mesh(new T.CylinderGeometry(0.05, 0.05, 2.2, 8), '#c9d2e0', '<b>[ДОБАВЛЕНО] Гармоническая справедливость</b> = арифметическое равенство + геометрическая пропорция, как ноты в аккорде.'); sc.position.set(0, 1.1, 3.5);
      var beam = c.mesh(new T.BoxGeometry(3, 0.08, 0.15), '#c9d2e0', 'Весы справедливости.'); beam.position.set(0, 2.2, 3.5);
      var pl = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.06, 20), '#7aa2ff', '<b>Арифметика:</b> всем поровну.'), pr = c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.06, 20), '#ff8a1f', '<b>Геометрия:</b> каждому по заслугам и положению.');
      c.label('гармония', [0, 3, 3.5], 0.38);
      c.state = { m: 0, arch: arch };
      c.onFrame(function (t) {
        var m = c.state.m;
        eq.forEach(function (b) { var off = m === 1 ? Math.sin(t * 3 + b.userData.i) * 0.05 * b.userData.i : 0; b.position.x = -5 + off; b.rotation.z = off * 0.15; });
        arch.forEach(function (s, i) { var h = s.userData.home; s.position.y = m === 2 && i !== 5 ? h.y + Math.sin(t * 2 + i) * 0.04 : h.y; s.scale.setScalar(m === 3 && i === 5 ? 1 + Math.sin(t * 4) * 0.1 : 1); });
        var tilt = Math.sin(t * 1.2) * 0.12; beam.rotation.z = tilt;
        pl.position.set(-1.4, 2.2 - Math.sin(tilt) * 1.4 - 0.4, 3.5); pr.position.set(1.4, 2.2 + Math.sin(tilt) * 1.4 - 0.4, 3.5);
      });
    },
    chips: [
      { t: 'Равенство', on: function (c) { c.state.m = 1; c.setView(-0.3, 1.1, 13, 3, -4); c.say('Одинаковые кубики в высокой башне качаются. Боден <b>отвергает</b> идею, что справедливость — это равенство (позже социалисты будут с этим спорить).'); } },
      { t: 'Разнородное', on: function (c) { c.state.m = 2; c.setView(0.3, 1.1, 13, 2.5, 3); c.say('Мы <b>не равны по природе</b>. Лучшее устройство <b>копирует природу</b> — соединяет разное так, чтобы оно держалось вместе и выдерживало внешние вызовы.'); } },
      { t: 'Замковый камень', on: function (c) { c.state.m = 3; c.pick(c.state.arch[5]); } },
      { t: 'Мечта', on: function (c) { c.state.m = 0; c.say('<b>Полная справедливость недостижима.</b> Общество будет жить с классами и элементом неравенства, но с <b>идеей и мечтой о справедливости</b>. «Можно отнять всё, кроме мечты».'); } }
    ]
  });

  /* ---------- 8. Десять человек без председателя ---------- */
  reg('bod-forms3d', {
    title: 'Почему монархия: «10 человек не договорятся»', lead: 'Десять человек за круглым столом. Без председателя и регламента — бесконечный спор. С тем, кто принимает решение, — результат. Пример лектора.',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var table = c.mesh(new T.CylinderGeometry(2.4, 2.4, 0.15, 40), '#5a3a20', 'Круглый стол: 10 равных участников.'); table.position.y = 1;
      var ppl = [], bubbles = [];
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2, p = person(c, Math.sin(a) * 3.3, Math.cos(a) * 3.3, ['#7aa2ff', '#4fc3a1', '#b07cff', '#ef6b5b', '#f0c36b'][i % 5], 'Участник. У каждого своё мнение и своя правда.');
        p.rotation.y = a + Math.PI; ppl.push(p);
        var b = c.mesh(new T.SphereGeometry(0.28, 12, 8), '#ffffff', '«Спор»: каждый тянет в свою сторону.', { transparent: true, opacity: 0.8 }); b.position.set(Math.sin(a) * 3.3, 2.1, Math.cos(a) * 3.3); bubbles.push(b);
      }
      var chair = c.mesh(new T.CylinderGeometry(0.6, 0.6, 2.6, 16), '#ff8a1f', '<b>Тот, кто принимает решение</b>: председатель, ведущий — у Бодена монарх. Нужна <b>иерархия</b> и <b>право принять решение</b>.', { emissive: new T.Color('#ff8a1f').multiplyScalar(0.25) });
      var crown = c.mesh(new T.TorusGeometry(0.45, 0.12, 8, 16), '#f0c36b', 'Монарх отвечает за <b>баланс</b>: правильные законы, согласованные с совестью людей, единство, согласование интересов сословий.', { metalness: 0.8 }); crown.rotation.x = Math.PI / 2;
      var doc = c.box3(1, 0.05, 0.7, '#e8e0cc', [0, 1.12, 0], '<b>Решение принято.</b>');
      c.state = { m: 0, chair: chair, crown: crown };
      c.onFrame(function (t) {
        var m = c.state.m;
        bubbles.forEach(function (b, i) { b.visible = m === 0; b.position.y = 2.1 + Math.abs(Math.sin(t * 5 + i)) * 0.5; });
        ppl.forEach(function (p, i) { p.rotation.y = (i / 10 * Math.PI * 2 + Math.PI) + (m === 0 ? Math.sin(t * 3 + i) * 0.6 : 0); });
        var h = m >= 1 ? 1 : 0; chair.scale.y = lerp(chair.scale.y, h || 0.01, 0.06); chair.position.y = 1 + chair.scale.y * 1.3;
        crown.visible = m >= 1; crown.position.y = 1 + chair.scale.y * 2.6 + 0.3; crown.rotation.z = t;
        doc.visible = m >= 1;
      });
    },
    chips: [
      { t: 'Без председателя', on: function (c) { c.state.m = 0; c.say('Десять равных — и <b>бесконечные споры</b>. Лектор: «даже 10 человек не договорятся, не будет никакого результата». Демократия, по Бодену, слишком <b>нестабильна</b>.'); } },
      { t: 'С решающим', on: function (c) { c.state.m = 1; c.pick(c.state.chair); } },
      { t: 'Задача монарха', on: function (c) { c.state.m = 2; c.pick(c.state.crown); } }
    ]
  });

  /* ---------- 9. Мост поколений: образование ---------- */
  reg('bod-education3d', {
    title: 'Образование: мост между поколениями', lead: 'Слева — опыт прошлых поколений (книги-первоисточники). Справа — ученики. Учитель — мост. Три опоры моста — три вида образования.',
    radius: 18, phi: 1.05, theta: 0.35, targetY: 1.6,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var shelf = [];
      for (var i = 0; i < 8; i++) shelf.push(c.box3(0.3, 1 + (i % 3) * 0.2, 0.8, ['#8a2a2a', '#2a4a8a', '#2a6a4a', '#7a5a2a'][i % 4], [-6.4 + i * 0.34, 2.6, 0], '<b>Классическая философия и история</b> — «коллективная учительница жизни», подлинные источники знания.'));
      c.box3(3.2, 2, 1.2, '#3a2c22', [-5.2, 1, 0], 'Опыт прошлых поколений.');
      c.label('первоисточники', [-5.2, 4, 0], 0.4);
      var deck = c.box3(6.4, 0.25, 1.6, '#c9d2e0', [0, 2.2, 0], '<b>Мост — учитель.</b> Он направляет учеников к подлинным источникам. Так происходит <b>встреча поколений</b>.');
      var P = [['Гражданское', '#7aa2ff', 'даёт <b>государство</b> — учебные заведения.'], ['Домашнее', '#4fc3a1', 'даёт <b>семья</b>.'], ['Нравственное', '#ff8a1f', 'привычка к <b>усилию</b> во всех жизненных ситуациях.']];
      var piers = P.map(function (p, k) { var x = -2 + k * 2; var m = c.box3(0.5, 2.1, 0.8, p[1], [x, 1.05, 0], '<b>' + p[0] + ' образование</b> ' + p[2]); c.label(p[0], [x, 3.0, 0.9], 0.34, p[1]); return m; });
      var kids = [];
      for (var j = 0; j < 4; j++) kids.push(person(c, 4.6 + (j % 2) * 0.9, -0.6 + Math.floor(j / 2) * 1.2, '#9aa3c0', 'Ученик. Одной жизни мало, чтобы самому понять суть истории, философии, политики и права: <b>не хватает времени</b>.', 0.8));
      var orb = c.mesh(new T.SphereGeometry(0.25, 14, 10), '#f0c36b', 'Знание переходит по мосту.', { emissive: new T.Color('#f0c36b').multiplyScalar(0.5) });
      c.state = { m: 0, piers: piers, deck: deck };
      c.onFrame(function (t) { var p = (t * 0.25) % 1; orb.position.set(-5 + p * 10, 2.6 + Math.sin(p * Math.PI) * 0.6, 0); kids.forEach(function (k, i) { k.position.y = c.state.m === 1 ? Math.abs(Math.sin(t * 4 + i)) * 0.15 : 0; }); });
    },
    chips: [
      { t: 'Учитель', on: function (c) { c.state.m = 1; c.pick(c.state.deck); } },
      { t: 'Гражданское', on: function (c) { c.state.m = 0; c.pick(c.state.piers[0]); } },
      { t: 'Домашнее', on: function (c) { c.state.m = 0; c.pick(c.state.piers[1]); } },
      { t: 'Нравственное', on: function (c) { c.state.m = 0; c.pick(c.state.piers[2]); } }
    ]
  });

  /* ---------- 10. Рабство: сразу или постепенно ---------- */
  reg('bod-slavery3d', {
    title: 'Рабство: освобождать сразу или постепенно?', lead: 'Сосуд «объём справедливости». Освободить всех сразу — поток переливается и угрожает государству. Постепенно, по ступеням, — сосуд наполняется ровно.',
    radius: 19, phi: 1.05, theta: 0.3, targetY: 1.8,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var glass = c.mesh(new T.CylinderGeometry(1.6, 1.6, 4, 32, 1, true), '#9fd6ff', '<b>Сосуд — общий объём справедливости</b> в государстве. Цель — чтобы он рос.', { transparent: true, opacity: 0.25, side: T.DoubleSide, depthWrite: false }); glass.position.y = 2;
      var water = c.mesh(new T.CylinderGeometry(1.5, 1.5, 1, 32), '#2f8cff', 'Справедливость растёт.', { transparent: true, opacity: 0.8 }); water.position.y = 0.5;
      var spill = [];
      for (var i = 0; i < 20; i++) { var d = c.mesh(new T.SphereGeometry(0.18, 10, 8), '#ef6b5b', '<b>Освободить всех сразу</b>: десятки миллионов людей без образования и навыков, кроме тяжёлого физического труда. Это угроза и им, и государству.'); d.visible = false; d.userData.a = i / 20 * Math.PI * 2; spill.push(d); }
      var ST = ['Человечное обращение', 'Права', 'Обучение', 'Работа, служба', 'Свобода'];
      var steps = ST.map(function (s, k) { var b = c.box3(1.2, 0.4 + k * 0.5, 1.2, ['#4a5a7a', '#56709a', '#6386b8', '#6f9cd6', '#4fc3a1'][k], [-5.5 + k * 0.01, 0, 0], 'Шаг ' + (k + 1) + ': <b>' + s + '</b>.'); b.position.set(2.7 + k * 0.95, (0.4 + k * 0.5) / 2, 0.6 - k * 0.9); c.label(s, [2.7 + k * 0.95, 0.75 + k * 0.5 + (k % 2) * 0.4, 0.6 - k * 0.9], 0.28); return b; });
      var chain = [];
      for (var j = 0; j < 6; j++) { var l = c.mesh(new T.TorusGeometry(0.3, 0.08, 8, 16), '#7d8496', '<b>Цепь рабства.</b> Рабство вредно, опасно и бесполезно: раб не будет делать квалифицированную работу — у него нет мотивации.', { metalness: 0.7 }); l.position.set(-4 + j * 0.45, 0.4, 2.5); l.rotation.y = j % 2 ? Math.PI / 2 : 0; chain.push(l); }
      c.state = { m: 0, lvl: 1, glass: glass };
      c.onFrame(function (t) {
        var m = c.state.m;
        var target = m === 1 ? 4.6 : m === 2 ? 1 + ((t * 0.25) % 3) : 1;
        c.state.lvl = lerp(c.state.lvl, target, m === 1 ? 0.2 : 0.03);
        var L = Math.min(c.state.lvl, 4); water.scale.y = L; water.position.y = L / 2;
        spill.forEach(function (d, i) { d.visible = m === 1; var p = ((t * 0.8) + i / 20) % 1; d.position.set(Math.cos(d.userData.a) * (1.7 + p * 3), 4 - p * 4, Math.sin(d.userData.a) * (1.7 + p * 3)); });
        chain.forEach(function (l, i) { var gone = m === 2 ? Math.min(6, Math.floor((t * 0.25) % 3 * 2)) : (m === 1 ? 6 : 0); l.visible = i >= gone; });
      });
    },
    chips: [
      { t: 'Рабство', on: function (c) { c.state.m = 0; c.say('Невозможно в <b>гражданском состоянии</b> отделить часть людей и обращаться с ними как со скотом. Рабство <b>вредно и небезопасно</b> для государства. <b>[ДОБАВЛЕНО]</b> Боден — один из первых противников рабства.'); } },
      { t: 'Всех сразу', on: function (c) { c.state.m = 1; c.say('Поток переливается: огромная масса неподготовленных людей станет <b>угрожать самому государству</b>. Свобода без опыта свободы — удар, а не благо.'); } },
      { t: 'Постепенно', on: function (c) { c.state.m = 2; c.say('Сначала человечное обращение и конец насилию → права → обучение → работа или служба → свобода. Как с <b>ребёнком</b>: свободу дают по чуть-чуть, и он чувствует её как <b>рост</b>.'); } }
    ]
  });

  /* ---------- 11. Лестница законов и суверен ---------- */
  reg('bod-sovereign3d', {
    title: 'Суверен между законами', lead: 'Три яруса законов. Сверху — законы Бога, ниже — законы природы, ещё ниже — человеческие законы. Суверен (корона) стоит над человеческими, но под Божьими и естественными.',
    radius: 18, phi: 1.1, theta: 0.5, targetY: 2.8, height: 400,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var L = [
        ['Законы Бога', '#f0c36b', 5.6, '<b>Законы Бога.</b> Нарушить нельзя: это преступление перед мирозданием. Власть, действующая против них, настроит против себя всех и вся.'],
        ['Законы природы', '#4fc3a1', 3.8, '<b>Естественные законы.</b> Нельзя противостоять природному мироустройству: экономика вопреки законам природы — и люди вымрут.'],
        ['Человеческие законы', '#7aa2ff', 1.2, '<b>Человеческие законы.</b> Суверен может их менять, но нарушать крайне нежелательно.']
      ];
      var tiers = L.map(function (l, i) { var w = 3 + i * 1.6; var m = c.mesh(new T.CylinderGeometry(w * 0.55, w * 0.6, 0.5, 6), l[1], l[3], { emissive: new T.Color(l[1]).multiplyScalar(0.1) }); m.position.y = l[2]; c.label(l[0], [w * 0.6 + 1.6, l[2], 0], 0.4, l[1]); return m; });
      var crown = new T.Group(); crown.position.y = 2.6; c.root.add(crown);
      var CI = '<b>Суверен</b>: абсолютная и постоянная власть (<b>[ДОБАВЛЕНО]</b>). Хозяин человеческих законов, но <b>слуга</b> законов Бога и природы. Боден — не сторонник произвола.';
      into(crown, c.mesh(new T.CylinderGeometry(0.9, 0.9, 0.6, 20, 1, true), '#f0c36b', CI, { metalness: 0.8, roughness: 0.25, side: T.DoubleSide }));
      for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; var sp = into(crown, c.mesh(new T.ConeGeometry(0.16, 0.5, 8), '#f0c36b', CI, { metalness: 0.8 })); sp.position.set(Math.sin(a) * 0.9, 0.5, Math.cos(a) * 0.9); }
      crown.userData.info = CI;
      var H = [['налоги', '#9fd6ff', 'Продукт воли суверена: <b>налоги</b>.'], ['оборона', '#9fd6ff', 'Продукт воли суверена: <b>оборона</b>.'], ['финансы', '#9fd6ff', 'Продукт воли суверена: <b>финансовая политика</b>.'], ['забота о слабых', '#ff8a1f', '<b>Закон-аксиома</b>: забота о слабых, поддержка, помощь, защита. Из римского права и христианской морали — <b>нельзя отменить</b>, самые устойчивые.']];
      var blocks = H.map(function (h, k) { var a = k / 4 * Math.PI * 2 + 0.4; var b = c.box3(0.9, 0.6, 0.6, h[1], [Math.sin(a) * 2.6, 1.75, Math.cos(a) * 2.6], h[2]); c.label(h[0], [Math.sin(a) * 2.6, 2.4, Math.cos(a) * 2.6], 0.3, h[1]); return b; });
      var MARKS = ['законы', 'война и мир', 'назначения', 'высший суд', 'помилование', 'монета', 'налоги'];
      var gems = MARKS.map(function (m, k) { var a = k / 7 * Math.PI * 2; var g = c.mesh(new T.OctahedronGeometry(0.22), '#b07cff', '<b>[ДОБАВЛЕНО] Признак суверенитета:</b> ' + m + '.', { emissive: new T.Color('#b07cff').multiplyScalar(0.3) }); g.userData.a = a; g.visible = false; return g; });
      c.state = { m: 0, tiers: tiers, crown: crown, blocks: blocks };
      c.onFrame(function (t) {
        crown.rotation.y = t * 0.5; crown.position.y = 2.6 + Math.sin(t * 1.5) * 0.08;
        blocks.forEach(function (b, i) { b.rotation.y = c.state.m === 2 && i === 3 ? t : 0; });
        gems.forEach(function (g) { g.visible = c.state.m === 3; var a = g.userData.a + t * 0.6; g.position.set(Math.sin(a) * 1.6, 2.9, Math.cos(a) * 1.6); g.rotation.y = t * 2; });
      });
    },
    chips: [
      { t: 'Законы Бога', on: function (c) { c.state.m = 0; c.pick(c.state.tiers[0]); } },
      { t: 'Законы природы', on: function (c) { c.state.m = 0; c.pick(c.state.tiers[1]); } },
      { t: 'Суверен', on: function (c) { c.state.m = 1; c.pick(c.state.crown.children[0]); } },
      { t: 'Закон-аксиома', on: function (c) { c.state.m = 2; c.pick(c.state.blocks[3]); } },
      { t: 'Признаки', small: 'добавлено', on: function (c) { c.state.m = 3; c.say('<b>[ДОБАВЛЕНО]</b> Права суверена по «Шести книгам»: издавать законы, объявлять войну и мир, назначать высших должностных лиц, быть последней судебной инстанцией, миловать, чеканить монету, вводить налоги.'); } }
    ]
  });

  /* ---------- 12. Неделимый суверенитет ---------- */
  reg('bod-territory3d', {
    title: 'Суверенитет неделим: одна страна или лоскутное одеяло', lead: 'Плитки — провинции. В единой стране все соединены с центром. В раздробленной — анклавы со своими флагами не подчиняются центру (пример лектора: Сомали, Афганистан).',
    radius: 17, phi: 0.85, theta: 0.3, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      var tiles = [], G = 5;
      for (var i = 0; i < G; i++) for (var j = 0; j < G; j++) {
        var tile = c.box3(1.6, 0.4, 1.6, '#3b5a8a', [(i - 2) * 1.75, 0, (j - 2) * 1.75], 'Провинция. При едином суверенитете подчиняется одному центру.');
        tile.userData.i = i; tile.userData.j = j; tile.userData.h = Math.abs(Math.sin(i * 3.1 + j * 1.7)); tiles.push(tile);
      }
      var cap = c.mesh(new T.CylinderGeometry(0.4, 0.5, 1.8, 16), '#f0c36b', '<b>Единый центр</b>: одна верховная власть на всей территории. Боден против выборности губернаторов и парламента, контролирующего правительство.', { metalness: 0.6 }); cap.position.y = 1.1;
      var links = [];
      tiles.forEach(function (tl) { if (tl.userData.i === 2 && tl.userData.j === 2) return; var l = c.link([0, 1.5, 0], [tl.position.x, 0.3, tl.position.z], '#f0c36b', 0.03, 'Связь с центром.'); links.push(l); });
      var flags = [];
      [[0, 0], [4, 1], [1, 4], [3, 3], [0, 3]].forEach(function (p, k) {
        var x = (p[0] - 2) * 1.75, z = (p[1] - 2) * 1.75;
        var pole = c.mesh(new T.CylinderGeometry(0.04, 0.04, 1.6, 6), '#c9d2e0', 'Анклав.'); pole.position.set(x, 1, z);
        var fl = c.box3(0.7, 0.45, 0.04, ['#ef6b5b', '#4fc3a1', '#b07cff', '#ff8a1f', '#9fd6ff'][k], [x + 0.37, 1.55, z], '<b>Самоуправляемый анклав</b>: свои вожди, не подчиняются центру. Горный ландшафт помогает им держаться.');
        flags.push(pole, fl);
      });
      c.state = { m: 0, cap: cap };
      c.onFrame(function (t) {
        var m = c.state.m;
        tiles.forEach(function (tl) { var up = m === 1 ? tl.userData.h * 1.6 : 0; tl.scale.y = lerp(tl.scale.y, 1 + up * 3, 0.05); tl.position.y = (tl.scale.y - 1) * 0.2; tl.material.color.set(m === 1 ? (tl.userData.h > 0.5 ? '#6b5a3a' : '#4a6a4a') : '#3b5a8a'); });
        links.forEach(function (l) { l.visible = m === 0; });
        flags.forEach(function (f) { f.visible = m === 1; });
        cap.visible = m === 0; cap.rotation.y = t;
      });
    },
    chips: [
      { t: 'Единая страна', on: function (c) { c.state.m = 0; c.pick(c.state.cap); } },
      { t: 'Раздробленная', on: function (c) { c.state.m = 1; c.say('Номинально суверенитет есть, но <b>нет единого правительства</b>, которое контролирует всю территорию. Весь народ не участвует в создании единой власти. Пример лектора — <b>Сомали, Афганистан</b>.'); } },
      { t: 'Франция', on: function (c) { c.state.m = 0; c.say('Благодаря идее единого центра <b>Франция</b> с большим трудом, через войны XVI–XVII веков, сложилась как <b>единое государство</b>. Лектор вспомнил кардинала <b>Ришелье</b>.'); } }
    ]
  });

  /* ---------- 13. Гора и тропы: естественная религия ---------- */
  reg('bod-religion3d', {
    title: 'Одна вершина — разные тропы', lead: 'На вершине — единый Бог. К нему ведут тропы разных конфессий. Если все идут к одной вершине, враждовать — значит противоречить своему же Богу.',
    radius: 19, phi: 1.0, theta: 0.4, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var mount = c.mesh(new T.ConeGeometry(5, 6, 48), '#3b4a6b', 'Путь к истине.', { roughness: 0.9 }); mount.position.y = 3;
      var top = c.mesh(new T.SphereGeometry(0.55, 24, 16), '#ffffff', '<b>Единый Бог.</b> Если люди верят в одного и того же Бога, их религиозные системы должны <b>сближаться</b>. Опора — Николай Кузанский, «О мире веры».', { emissive: new T.Color('#f0c36b').multiplyScalar(0.8) }); top.position.y = 6.3;
      var P = [['католики', '#ef6b5b'], ['гугеноты', '#7aa2ff'], ['лютеране', '#4fc3a1'], ['иудеи', '#f0c36b'], ['мусульмане', '#b07cff']];
      var walkers = [], paths = [];
      P.forEach(function (p, k) {
        var a0 = k / 5 * Math.PI * 2, pts = [];
        for (var s = 0; s <= 30; s++) { var u = s / 30, r = 5.1 * (1 - u) + 0.3, a = a0 + u * 2.4; pts.push(new T.Vector3(Math.sin(a) * r, u * 6 + 0.05, Math.cos(a) * r)); }
        var curve = new T.CatmullRomCurve3(pts);
        paths.push(c.mesh(new T.TubeGeometry(curve, 60, 0.07, 6), p[1], 'Тропа: <b>' + p[0] + '</b>.'));
        var w = c.mesh(new T.SphereGeometry(0.25, 12, 8), p[1], '<b>' + p[0] + '</b> идут к той же вершине.'); w.userData.curve = curve; w.userData.k = k; walkers.push(w);
        c.label(p[0], [Math.sin(a0) * 6.6, 0.6, Math.cos(a0) * 6.6], 0.35, p[1]);
      });
      var fire = [];
      for (var f = 0; f < 10; f++) { var fl = c.mesh(new T.ConeGeometry(0.2, 0.6, 8), '#ff5a1f', '<b>Религиозная война</b>: когда на знамёнах появляются религиозные символы — прямое насилие. Варфоломеевская ночь (1572).', { emissive: new T.Color('#ff5a1f').multiplyScalar(0.6) }); fl.userData.a = f / 10 * Math.PI * 2; fire.push(fl); }
      c.state = { m: 0, top: top };
      c.onFrame(function (t) {
        var m = c.state.m;
        walkers.forEach(function (w) { var u = m === 1 ? 0.15 : ((t * 0.06 + w.userData.k * 0.13) % 1) * 0.95; var p = w.userData.curve.getPointAt(u); w.position.set(p.x, p.y + 0.25, p.z); });
        fire.forEach(function (fl, i) { fl.visible = m === 1; var a = fl.userData.a; fl.position.set(Math.sin(a) * 4.4, 1.2 + Math.abs(Math.sin(t * 6 + i)) * 0.3, Math.cos(a) * 4.4); });
        top.scale.setScalar(m === 2 ? 1.3 + Math.sin(t * 3) * 0.15 : 1);
      });
    },
    chips: [
      { t: 'Война', on: function (c) { c.state.m = 1; c.say('<b>Разъединение религий</b> — одна из причин войн. Вместо пути к вершине — огонь у подножия. Боден <b>не поддерживал</b> дух религиозных войн.'); } },
      { t: 'Единый Бог', on: function (c) { c.state.m = 2; c.pick(c.state.top); } },
      { t: 'Естественная религия', on: function (c) { c.state.m = 0; c.say('<b>Естественная религия</b> должна объединить всех в пространстве государства, в экономике и политических ценностях. Все мировые религии признают единого Бога, мораль, совесть и свободу человека. Но Боден понимал: <b>пока это невозможно</b>.'); } }
    ]
  });

  /* ---------- 14. Беседа семерых ---------- */
  reg('bod-seven3d', {
    title: '«Беседа семерых»: спор без вражды', lead: '<b>[ДОБАВЛЕНО]</b> Семь собеседников разной веры за одним столом. Нажми на каждого — кто он и что защищает. В конце они расходятся в мире.',
    radius: 14, phi: 0.95, theta: 0.2, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.ground(7);
      var table = c.mesh(new T.CylinderGeometry(2.2, 2.2, 0.15, 7), '#5a3a20', 'Общий стол: все говорят, никто не применяет силу.'); table.position.y = 1;
      var S = [['Католик', '#ef6b5b', 'защищает Римскую церковь.'], ['Лютеранин', '#4fc3a1', 'защищает учение Лютера.'], ['Кальвинист', '#7aa2ff', 'защищает учение Кальвина (как гугеноты).'], ['Иудей', '#f0c36b', 'защищает веру Ветхого Завета.'], ['Мусульманин', '#b07cff', 'защищает ислам.'], ['Естественная религия', '#ff8a1f', 'считает, что истинна простая вера в единого Бога, общая для всех.'], ['Скептик', '#9aa3c0', 'сомневается во всех вероучениях.']];
      var ppl = S.map(function (s, k) { var a = k / 7 * Math.PI * 2; var p = person(c, Math.sin(a) * 3, Math.cos(a) * 3, s[1], '<b>' + s[0] + '</b> ' + s[2]); p.rotation.y = a + Math.PI; c.label(s[0], [Math.sin(a) * 3.6, 2.2, Math.cos(a) * 3.6], 0.3, s[1]); return p; });
      var dove = c.mesh(new T.SphereGeometry(0.3, 14, 10), '#ffffff', '<b>Итог беседы:</b> никто никого не переубедил, но все расходятся <b>в мире</b>. Модель терпимости.', { emissive: new T.Color('#ffffff').multiplyScalar(0.4) });
      c.state = { m: 0, ppl: ppl, dove: dove, k: 0 };
      c.onFrame(function (t) {
        var sp = Math.floor(t / 1.5) % 7;
        ppl.forEach(function (p, i) { p.position.y = c.state.m === 0 && i === sp ? 0.15 + Math.abs(Math.sin(t * 6)) * 0.1 : 0; });
        dove.visible = c.state.m === 1; dove.position.set(Math.sin(t) * 1.2, 2.6 + Math.sin(t * 2) * 0.3, Math.cos(t) * 1.2);
      });
    },
    chips: [
      { t: 'Спор', on: function (c) { c.state.m = 0; c.say('Каждый по очереди защищает свою веру. <b>[ДОБАВЛЕНО]</b> Книга около 1588 г., при жизни Бодена не издавалась — слишком смелая.'); } },
      { t: 'Финал', on: function (c) { c.state.m = 1; c.pick(c.state.dove); } }
    ]
  });

  /* ---------- 15. Суд над «ведьмой» ---------- */
  reg('bod-demon3d', {
    title: '«Демономания»: суд, который нельзя выиграть', lead: 'Зал суда. Весы почти всегда склоняются в одну сторону: доносы, пытки, подозрение даже к судье-скептику. Справа — книга, которую потом запретила сама церковь.',
    radius: 16, phi: 1.05, theta: 0.4, targetY: 1.6,
    build: function (c) {
      var T = c.THREE;
      c.box3(12, 0.2, 9, '#2a2230', [0, -0.1, 0], 'Суд XVI века.');
      var bench = c.box3(3.6, 1.4, 1, '#5a3a20', [0, 0.7, -2.6], 'Судейская скамья. Суд, <b>легитимированный церковью</b>, — по Бодену, законный способ «изгнать нечистую силу».');
      var judge = person(c, 0, -3.2, '#2b2b3a', '<b>Судья.</b> Боден считал: можно осуждать, если соблюдены <b>правильные процедуры</b>.', 1.15);
      judge.position.y = 0.3;
      var acc = person(c, 0, 1.6, '#c9b8a0', '<b>Обвинённая.</b> По Бодену, ведьма творит зло не сама, а <b>поступив на службу дьяволу</b>. <b>[ДОБАВЛЕНО]</b> Пример книги — Жанна Арвилье (1578).');
      var shadow = c.mesh(new T.ConeGeometry(0.9, 2.6, 16), '#000000', '«Тень дьявола» — то, в чём обвиняют. Доказать обратное почти невозможно.', { transparent: true, opacity: 0.45 }); shadow.position.set(0, 1.3, 2.4);
      var beam = c.mesh(new T.BoxGeometry(3.4, 0.08, 0.12), '#c9d2e0', 'Весы правосудия.', { metalness: 0.7 }); beam.position.set(-3.6, 2.6, 0);
      c.mesh(new T.CylinderGeometry(0.05, 0.05, 2.6, 8), '#c9d2e0', 'Весы.').position.set(-3.6, 1.3, 0);
      var pa = c.mesh(new T.CylinderGeometry(0.55, 0.55, 0.06, 20), '#ef6b5b', '<b>Обвинение</b>: доносы (Боден их поощрял), пытки (защищал), подозрение к судье-скептику.');
      var pb = c.mesh(new T.CylinderGeometry(0.55, 0.55, 0.06, 20), '#4fc3a1', '<b>Защита.</b> Лектор: где граница между осуждением преступника и осуждением человека, который просто <b>не понравился</b>, — например, у него есть земля?');
      var notes = [];
      for (var i = 0; i < 6; i++) { var n = c.box3(0.35, 0.02, 0.25, '#e8e0cc', [0, 0, 0], '<b>Донос.</b>'); n.userData.i = i; notes.push(n); }
      var book = c.box3(1.1, 0.3, 1.5, '#5a2a2a', [4, 0.95, 0], '<b>«Демономания колдунов» (1580).</b> <b>[ДОБАВЛЕНО: 1594]</b> Католическая церковь внесла её в <b>Индекс запрещённых книг</b> — нашли расхождения с учением.');
      c.box3(1.4, 0.8, 1.4, '#3a2c22', [4, 0.4, 0], 'Подставка.');
      var lock = c.mesh(new T.TorusGeometry(0.85, 0.06, 8, 30), '#7d8496', 'Цепь Индекса.', { metalness: 0.8 }); lock.position.set(4, 0.95, 0); lock.rotation.y = Math.PI / 2;
      var jq = person(c, -2.2, -3.2, '#2b2b3a', '<b>Судья-скептик.</b> Тот, кто сомневается в колдовстве или мягок к ведьмам, по Бодену, <b>сам заслуживает костра</b> — значит, он с ними заодно.', 1.0);
      c.state = { m: 0, book: book, judge: judge, jq: jq };
      c.onFrame(function (t) {
        var m = c.state.m, tilt = m >= 1 ? 0.35 : Math.sin(t) * 0.05;
        beam.rotation.z = lerp(beam.rotation.z, tilt, 0.05);
        pa.position.set(-3.6 - 1.5, 2.6 - Math.sin(beam.rotation.z) * 1.5 - 0.5, 0); pb.position.set(-3.6 + 1.5, 2.6 + Math.sin(beam.rotation.z) * 1.5 - 0.5, 0);
        notes.forEach(function (n, i) { n.visible = m >= 1; var p = ((t * 0.4) + i / 6) % 1; n.position.set(-5.1 + Math.sin(i) * 0.2, pa.position.y + 0.1 + (1 - p) * 2.5, Math.cos(i) * 0.2); n.rotation.y = t + i; });
        jq.traverse(function (x) { if (x.material && x.material.emissive) x.material.emissive.set(m === 2 ? '#ef6b5b' : '#000000').multiplyScalar(m === 2 ? 0.4 + Math.sin(t * 5) * 0.2 : 1); });
        shadow.scale.y = 1 + Math.sin(t * 2) * 0.05;
        lock.rotation.x = t * 0.4;
      });
    },
    chips: [
      { t: 'Обвинение', on: function (c) { c.state.m = 1; c.setView(-0.3, 1.0, 12, 2, -2.5); c.say('Весы склоняются к обвинению: Боден <b>поощрял доносы</b>, <b>защищал пытки</b> и считал, что государство вправе «очищать» страну. Оправдаться было крайне сложно.'); } },
      { t: 'Судья-скептик', on: function (c) { c.state.m = 2; c.pick(c.state.jq.children[0]); } },
      { t: 'Индекс', on: function (c) { c.state.m = 0; c.pick(c.state.book); } },
      { t: 'Урок', on: function (c) { c.state.m = 0; c.say('Тот же человек призывал к <b>терпимости</b> между христианами и был против <b>рабства</b> — и требовал жёстко судить ведьм. Урок лектора: когда государство насаждает религиозную нетерпимость, под удар может попасть <b>любой неугодный</b>.'); } }
    ]
  });

  /* ---------- 16. Театр природы ---------- */
  reg('bod-theatre3d', {
    title: '«Театр всей природы»: мир-механизм', lead: 'Сцена театра. На ней — механизм мира из шестерёнок причин и следствий. Свет сверху — Бог-Творец. Человек — сотворец на сцене. Сбоку — пустой Марс.',
    radius: 18, phi: 1.05, theta: 0.3, targetY: 2.4, height: 400,
    build: function (c) {
      var T = c.THREE;
      var stage = c.box3(10, 0.6, 5, '#5a3a20', [0, 0.3, 0], '<b>Театр мира</b>: Вселенная, где правят Бог-Творец и человек — сотворец более низкого порядка.');
      c.box3(0.6, 6, 0.6, '#7a2a2a', [-5.2, 3, -2.2], 'Кулиса.'); c.box3(0.6, 6, 0.6, '#7a2a2a', [5.2, 3, -2.2], 'Кулиса.');
      c.box3(11, 0.8, 0.6, '#7a2a2a', [0, 6.2, -2.2], 'Портал сцены.');
      function gear(x, y, z, r, col, info) { var g = new T.Group(); g.position.set(x, y, z); c.root.add(g); into(g, c.mesh(new T.CylinderGeometry(r, r, 0.25, 24), col, info, { metalness: 0.6, roughness: 0.3 })).rotation.x = Math.PI / 2; var n = Math.round(r * 8); for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, tt = into(g, c.mesh(new T.BoxGeometry(0.22, 0.3, 0.25), col, info, { metalness: 0.6 })); tt.position.set(Math.cos(a) * (r + 0.1), Math.sin(a) * (r + 0.1), 0); tt.rotation.z = a; } return g; }
      var GI = '<b>Мир-механизм</b>, насыщенный причинно-следственными связями. Может существовать и развиваться по своим законам: Бог вмешивается, когда хочет, но может и не вмешиваться. <b>[ДОБАВЛЕНО]</b> Близко к деизму.';
      var g1 = gear(-1.5, 2.8, -1.5, 1.4, '#c9a04a', GI), g2 = gear(0.9, 3.6, -1.5, 0.9, '#c9a04a', GI), g3 = gear(1.2, 1.7, -1.5, 0.7, '#c9a04a', GI);
      var light = c.mesh(new T.ConeGeometry(2.2, 4.5, 32, 1, true), '#fff3c0', '<b>Бог-Творец</b> — изначальный создатель. <b>Бог природы</b> — то, что мы видим вокруг: вся природа — проявление Бога. Это <b>не пантеизм</b>.', { transparent: true, opacity: 0.18, side: T.DoubleSide, depthWrite: false, emissive: new T.Color('#fff3c0').multiplyScalar(0.3) }); light.position.set(0, 4.5, 0.5);
      var sun = c.mesh(new T.SphereGeometry(0.4, 16, 12), '#fff3c0', 'Источник света — Творец.', { emissive: new T.Color('#fff3c0') }); sun.position.set(0, 7, 0.5);
      var man = person(c, 2.8, 1, '#4fc3a1', '<b>Человек — сотворец.</b> Опираясь на силы и разум, он вправе менять мир — без «греховных» последствий. Природа не отделена от человека.', 1.1); man.position.y = 0.6;
      var tool = c.mesh(new T.BoxGeometry(0.1, 0.9, 0.1), '#c9d2e0', 'Инструмент: человек участвует в преобразовании мира.', { metalness: 0.7 }); tool.position.set(3.2, 1.8, 1);
      var flowers = [];
      for (var i = 0; i < 6; i++) { var fl = c.mesh(new T.SphereGeometry(0.18, 10, 8), ['#ef6b5b', '#f0c36b', '#b07cff'][i % 3], '<b>Красота мироздания</b>: этика и эстетика — проявление божественного в природе.'); fl.position.set(-3.5 + i * 0.5, 0.8, 1.6); flowers.push(fl); }
      var mars = c.mesh(new T.SphereGeometry(1, 24, 16), '#b5532f', '<b>Марс</b> (пример лектора): там явно не хватает красоты — нет даже двух людей, между которыми развивалась бы политическая история.', { roughness: 0.95 }); mars.position.set(6.2, 4.4, 1.5);
      c.label('Марс', [6.2, 5.8, 1.5], 0.4, '#ff8a1f');
      c.state = { m: 0, gs: [g1, g2, g3], light: light, man: man, mars: mars };
      c.onFrame(function (t) {
        var sp = c.state.m === 1 ? 1.2 : 0.4;
        g1.rotation.z = t * sp; g2.rotation.z = -t * sp * 1.55; g3.rotation.z = -t * sp * 2;
        light.material.opacity = c.state.m === 2 ? 0.3 + Math.sin(t * 2) * 0.08 : 0.15;
        tool.rotation.z = c.state.m === 3 ? Math.sin(t * 6) * 0.5 : 0;
        flowers.forEach(function (f, i) { f.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.15); });
        mars.rotation.y = t * 0.2;
      });
    },
    chips: [
      { t: 'Механизм', on: function (c) { c.state.m = 1; c.pick(c.state.gs[0].children[0]); } },
      { t: 'Творец', on: function (c) { c.state.m = 2; c.pick(c.state.light); } },
      { t: 'Человек', on: function (c) { c.state.m = 3; c.pick(c.state.man.children[0]); } },
      { t: 'Марс', on: function (c) { c.state.m = 0; c.setView(1.0, 1.0, 10, 4, 5.5); c.pick(c.state.mars); } }
    ]
  });
})();
