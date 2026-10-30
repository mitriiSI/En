/* 3D-модели: Теория управления, лекция 3 — тектология Богданова.
   @@graph:tu3-complexes@@ @@graph:tu3-ingression@@ @@graph:tu3-biregulator@@ @@graph:tu3-egression@@ */
(function () {
  'use strict';
  if (!window.TU3) return;
  var U = window.TU3, reg = U.reg;
  var BLUE = '#5b8def', RED = '#ef6b5b', GOLD = '#f0c36b', GREEN = '#4fc3a1', GREY = '#8b93b5', PURPLE = '#b07cff', WOOD = '#a8743f';

  /* ---------- 1. Три комплекса: больше, равно, меньше суммы ---------- */
  reg('tu3-complexes', {
    title: 'Три типа комплексов', lead: 'Два человека и бревно. Переключай: организованный, нейтральный и дезорганизованный комплекс. Справа — «счётчик результата».',
    radius: 9.5, phi: 1.05, theta: 0.35, targetY: 1.4, targetX: 1.8,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 'org' };
      c.ground(9);
      function person(x, col, info) {
        var g = new T.Group(); c.root.add(g);
        var b = c.mesh(new T.CylinderGeometry(0.3, 0.38, 1.3, 12), col, info); b.position.y = 0.65; g.add(b);
        var h = c.mesh(new T.SphereGeometry(0.32, 14, 10), '#f1d2b6', info); h.position.y = 1.6; g.add(h);
        g.position.x = x; return g;
      }
      S.a = person(-1.6, BLUE, '<b>Участник 1.</b> Его собственная сила — 1 «единица».');
      S.b = person(1.6, GREEN, '<b>Участник 2.</b> Его сила — тоже 1 «единица».');
      S.log = c.mesh(new T.CylinderGeometry(0.28, 0.28, 4.6, 14), WOOD, '<b>Бревно.</b> Одному не поднять: нужна организация.');
      S.log.rotation.z = Math.PI / 2; S.log.position.y = 0.3;
      S.up = [U.arrow(c, [-1.6, 0.4, 0.9], [-1.6, 2.4, 0.9], BLUE, 'Усилие участника 1 направлено туда же, куда у второго — вверх.'), U.arrow(c, [1.6, 0.4, 0.9], [1.6, 2.4, 0.9], GREEN, 'Усилие участника 2 — тоже вверх.')];
      S.out = [U.arrow(c, [-1.4, 1.0, 0.9], [-3.4, 1.0, 0.9], BLUE, 'Тянет влево.'), U.arrow(c, [1.4, 1.0, 0.9], [3.4, 1.0, 0.9], GREEN, 'Тянет вправо — усилия гасят друг друга.')];
      S.own = [U.arrow(c, [-2.6, 0.4, 0.9], [-2.6, 1.6, 0.9], BLUE, 'Работает сам по себе.'), U.arrow(c, [2.6, 0.4, 0.9], [2.6, 1.6, 0.9], GREEN, 'Работает сам по себе.')];
      // счётчик результата: столбики «сумма частей» и «целое»
      c.label('сумма | целое', [5, 3.8, -1], 0.4);
      c.box3(0.7, 2, 0.7, GREY, [4.4, 1, -1], '<b>Сумма частей</b> = 2: каждый работает сам по себе.');
      S.whole = c.box3(0.7, 1, 0.7, GOLD, [5.6, 0.5, -1], '<b>Целое</b> — то, что реально получилось вместе.');
      S.wl = 3;
      c.onFrame(function (t) {
        var m = S.mode, target = m === 'org' ? 3 : m === 'neu' ? 2 : 0.6;
        S.wl += (target - S.wl) * 0.06; S.whole.scale.y = S.wl; S.whole.position.y = S.wl / 2;
        var lift = m === 'org' ? 1.6 + Math.sin(t * 2) * 0.1 : m === 'neu' ? 0.3 : 0.3;
        S.log.position.y += (lift - S.log.position.y) * 0.05;
        S.log.position.x = m === 'dis' ? Math.sin(t * 6) * 0.15 : 0;
        S.log.visible = m !== 'neu';
        S.a.position.x = m === 'neu' ? -2.6 : -1.6; S.b.position.x = m === 'neu' ? 2.6 : 1.6;
        S.up.forEach(function (a) { a.visible = m === 'org'; });
        S.out.forEach(function (a) { a.visible = m === 'dis'; });
        S.own.forEach(function (a) { a.visible = m === 'neu'; });
      });
    },
    chips: [
      { t: 'Организованный', small: 'целое > суммы', on: function (c) { c.state.mode = 'org'; c.say('Вместе подняли бревно, которое ни один не сдвинет в одиночку. Целое (3) <b>больше</b> суммы частей (2) — это и есть организация, позже — <b>синергия</b>.'); } },
      { t: 'Нейтральный', small: 'целое = сумме', on: function (c) { c.state.mode = 'neu'; c.say('Каждый копает свою грядку. Друг другу не помогают и не мешают: целое <b>равно</b> сумме частей.'); } },
      { t: 'Дезорганизованный', small: 'целое < суммы', on: function (c) { c.state.mode = 'dis'; c.say('Тянут бревно в разные стороны — усилия гасят друг друга. Целое <b>меньше</b> суммы частей. Так выглядит плохо организованная команда.'); } }
    ]
  });

  /* ---------- 2. Конъюгация, ингрессия, дезингрессия ---------- */
  reg('tu3-ingression', {
    title: 'Ингрессия и дезингрессия', lead: 'Два комплекса — синий и красный. Посмотри, как они соединяются напрямую, через «клей» и как их разводит «буфер».',
    radius: 7.5, phi: 1.05, theta: 0.6, targetY: 1,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 'con' };
      c.ground(9);
      function cluster(x, col, info) { var g = new T.Group(); c.root.add(g); for (var i = 0; i < 7; i++) { var m = c.mesh(new T.SphereGeometry(0.35, 14, 10), col, info); m.position.set(Math.cos(i) * 0.7, 0.6 + (i % 3) * 0.45, Math.sin(i * 1.7) * 0.7); g.add(m); } g.position.x = x; return g; }
      S.A = cluster(-2.2, BLUE, '<b>Комплекс А</b> — например, отдел продаж.');
      S.B = cluster(2.2, RED, '<b>Комплекс Б</b> — например, производство.');
      S.glue = c.box3(1.4, 0.5, 0.8, GOLD, [0, 1.1, 0], '<b>Ингрессия:</b> промежуточное звено-связка. Как цемент между кирпичами или переводчик между людьми разных языков.');
      S.wall = c.box3(0.3, 2.6, 2.6, GREY, [0, 1.3, 0], '<b>Дезингрессия:</b> звено-буфер разделяет и гасит противоположные активности. Как изоляция на проводе или нейтральная полоса.');
      S.sparks = []; for (var k = 0; k < 6; k++) S.sparks.push(U.glow(c, '#ff9a5a', 0.12));
      c.onFrame(function (t) {
        var m = S.mode;
        var tx = m === 'con' ? 0.9 : m === 'ing' ? 1.6 : 2.4;
        S.A.position.x += (-tx - S.A.position.x) * 0.06; S.B.position.x += (tx - S.B.position.x) * 0.06;
        S.glue.visible = m === 'ing'; S.wall.visible = m === 'dez';
        S.glue.rotation.y = Math.sin(t) * 0.1;
        S.sparks.forEach(function (s, i) { var u = U.W(t * 0.7 + i / 6); s.visible = m === 'dez'; s.position.set((i % 2 ? 1 : -1) * (1.8 - u * 1.5), 1 + Math.sin(i) * 0.6, Math.cos(i * 2) * 0.8); });
      });
    },
    chips: [
      { t: 'Конъюгация', small: 'сцепление', on: function (c) { c.state.mode = 'con'; c.say('<b>Конъюгация</b> — комплексы соединяются напрямую. Обратное действие — <b>дизъюнкция</b>, разъединение.'); } },
      { t: 'Ингрессия', small: '«клей»', on: function (c) { c.state.mode = 'ing'; c.say('Сами они не сцепляются, но <b>промежуточное звено</b> связывает их. Руководитель, который «сводит» два отдела, работает как ингрессия.'); } },
      { t: 'Дезингрессия', small: '«буфер»', on: function (c) { c.state.mode = 'dez'; c.say('Активности направлены друг против друга (искры). <b>Звено-буфер</b> разводит их и не даёт конфликту разрушить систему.'); } }
    ]
  });

  /* ---------- 3. Бирегулятор — прообраз обратной связи ---------- */
  reg('tu3-biregulator', {
    title: 'Бирегулятор: термостат и батарея', lead: 'Две части регулируют друг друга. Нажми «Похолодало» — посмотри, как система сама возвращается к равновесию.',
    radius: 6, phi: 1.05, theta: 0.4, targetY: 1.4,
    build: function (c) {
      var T = c.THREE, S = c.state = { temp: 0, kick: 0, on: 0 };
      c.ground(8);
      var rad = new T.Group(); c.root.add(rad);
      for (var i = 0; i < 7; i++) { var f = c.mesh(new T.BoxGeometry(0.22, 1.6, 0.5), '#d8dce6', '<b>Батарея</b> — исполнитель: греет, когда получает сигнал.'); f.position.set(-3 + i * 0.3, 0.9, 0); rad.add(f); }
      S.rad = rad;
      var th = c.box3(0.9, 1.2, 0.3, '#2b2f3a', [2.4, 1.6, 0], '<b>Термостат</b> — измеряет температуру и включает или выключает батарею.');
      S.screen = c.box3(0.6, 0.4, 0.05, GREEN, [2.4, 1.75, 0.17], null);
      S.therm = c.mesh(new T.CylinderGeometry(0.12, 0.12, 1, 12), RED, '<b>Температура в комнате.</b>'); S.therm.position.set(0.4, 0.5, 1.2);
      c.box3(0.34, 3, 0.05, '#ffffff', [0.4, 1.5, 1.05], '<b>Шкала:</b> середина — нужная температура.');
      c.box3(0.6, 0.04, 0.06, GOLD, [0.4, 1.5, 1.1], 'Нужная температура (равновесие).');
      var cv1 = U.curve(c, [[-1.8, 2.2, 0], [0.3, 3.2, 0], [2.2, 2.4, 0]]);
      var cv2 = U.curve(c, [[2.2, 1.0, 0], [0.3, 0.2, -0.6], [-1.8, 1.0, 0]]);
      U.tube(c, cv1.getPoints(30).map(function (v) { return [v.x, v.y, v.z]; }), '#9aa2c0', 0.04, false, 'Информация о температуре идёт к термостату.');
      U.tube(c, cv2.getPoints(30).map(function (v) { return [v.x, v.y, v.z]; }), '#9aa2c0', 0.04, false, 'Команда «включить/выключить» идёт к батарее.');
      U.movers(c, cv1, GOLD, 0.35, 2, 0.12); S.cmd = U.movers(c, cv2, RED, 0.35, 2, 0.12);
      c.onFrame(function (t) {
        S.temp += S.kick; S.kick *= 0.9;
        S.on = S.temp < -0.05 ? 1 : 0;
        S.temp += S.on ? 0.01 : 0; S.temp *= 0.995;
        var h = Math.max(0.15, 1.5 + S.temp * 1.4); S.therm.scale.y = h; S.therm.position.y = h / 2;
        S.therm.material.color.set(S.temp < -0.05 ? BLUE : RED);
        S.screen.material.color.set(S.on ? '#ff9a5a' : GREEN);
        S.rad.children.forEach(function (f) { f.material.color.set(S.on ? '#ffb27a' : '#d8dce6'); });
        S.cmd.forEach(function (m) { m.visible = !!S.on; });
      });
    },
    chips: [
      { t: 'Похолодало', small: 'возмущение', on: function (c) { c.state.kick = -0.06; c.say('Открыли окно — температура упала. Термостат это <b>заметил</b> и включил батарею. Как только стало тепло, он её выключит.'); } },
      { t: 'Равновесие', small: 'подвижное', on: function (c) { c.state.kick = 0; c.say('Система не стоит на месте, а колеблется около нужной температуры и возвращается к ней — <b>подвижное равновесие</b>.'); } },
      { t: 'Связь с Винером', small: '1948', on: function (c) { c.say('Части регулируют <b>друг друга</b>: батарея меняет температуру, температура — работу батареи. Богданов назвал это <b>бирегулятором</b>; через 30 лет Винер опишет то же как <b>обратную связь</b>.'); } }
    ]
  });

  /* ---------- 4. Эгрессия и дегрессия ---------- */
  reg('tu3-egression', {
    title: 'Эгрессия и дегрессия', lead: 'Слева — центр и периферия (эгрессия). Справа — скелет, который держит живую часть (дегрессия). Нажми «Выросли», чтобы увидеть, как скелет начинает сковывать.',
    radius: 11, phi: 1.05, theta: 0.2, targetY: 1.6,
    build: function (c) {
      var T = c.THREE, S = c.state = { grow: 0, g: 0 };
      c.ground(10);
      // эгрессия: центр + периферия
      var hub = c.mesh(new T.SphereGeometry(0.6, 18, 14), GOLD, '<b>Центр</b> — наиболее активная и опытная часть: руководитель, мозг, лидер группы.', { emissive: c.color(GOLD), emissiveIntensity: 0.3 });
      hub.position.set(-3.2, 1.6, 0);
      S.per = [];
      for (var i = 0; i < 6; i++) {
        var a = i / 6 * Math.PI * 2, p = [-3.2 + Math.cos(a) * 2, 1.6 + Math.sin(a) * 0.4, Math.sin(a) * 2];
        var m = c.mesh(new T.SphereGeometry(0.3, 12, 10), BLUE, '<b>Периферия</b> — следует за центром, выполняет.'); m.position.set(p[0], p[1], p[2]); S.per.push(m);
        U.link(c, [-3.2, 1.6, 0], p, '#9aa2c0', 0.04);
      }
      c.label('Эгрессия · центр', [-3.2, 3.4, 0], 0.4);
      // дегрессия: каркас-клетка + мягкая живая часть
      var cage = new T.Group(); c.root.add(cage);
      var edges = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.2, 2.2, 2.2)), new T.LineBasicMaterial({ color: '#c8ccd8' }));
      cage.add(edges);
      [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(function (q) { var post = c.mesh(new T.CylinderGeometry(0.07, 0.07, 2.2, 8), '#c8ccd8', '<b>Скелет</b> — прочная, малоподвижная часть: законы, устав, традиции.'); post.position.set(q[0], 0, q[1]); cage.add(post); });
      cage.position.set(3.2, 1.2, 0);
      S.soft = c.mesh(new T.SphereGeometry(0.8, 24, 18), PURPLE, '<b>Живая, пластичная часть</b> — люди, процессы, идеи. Скелет её держит и защищает.', { transparent: true, opacity: 0.85 });
      S.soft.position.set(3.2, 1.2, 0);
      c.label('Дегрессия · скелет', [3.2, 3.4, 0], 0.4);
      c.onFrame(function (t) {
        hub.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
        S.per.forEach(function (m, i) { m.position.y = 1.6 + Math.sin(t * 2 + i) * 0.15; });
        S.g += (S.grow - S.g) * 0.04;
        var r = 1 + S.g * 0.75; S.soft.scale.set(Math.min(r, 1.38), r * 1.15, Math.min(r, 1.38));
        S.soft.material.color.set(S.g > 0.5 ? RED : PURPLE);
      });
    },
    chips: [
      { t: 'Эгрессия', small: 'центр', on: function (c) { c.setView(0.3, 1.0, 5, 1.6, -3.2, 0); c.say('<b>Эгрессия</b> — централистическая форма: центр ведёт, периферия следует. «Кто главный».'); } },
      { t: 'Дегрессия', small: 'скелет', on: function (c) { c.state.grow = 0; c.setView(0.6, 1.0, 5, 1.3, 3.2, 0); c.say('<b>Дегрессия</b> — скелетная форма: прочная часть держит и защищает пластичную. «На чём всё держится».'); } },
      { t: 'Выросли', small: 'скелет сковывает', on: function (c) { c.state.grow = 1; c.setView(0.6, 1.0, 5, 1.3, 3.2, 0); c.say('Живая часть выросла, а скелет остался прежним — он <b>сковывает</b> развитие. Так устаревшие правила мешают растущей организации: скелет пора перестраивать.'); } }
    ]
  });
})();
