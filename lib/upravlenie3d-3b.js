/* Дополнительные 3D-модели: «Теория управления. Лекция 3». Помощники — lib/upravlenie3d-common.js. */
(function () {
  'use strict';
  if (!window.TU3) return;
  var U = window.TU3, reg = U.reg;

  /* ---------- 1. Одно движение — четыре названия ---------- */
  reg('tu3-names', {
    title: 'Одно движение — четыре названия', lead: 'В центре — общая идея начала XX века: изучать и улучшать труд научно. Четыре страны назвали её по-своему. Нажми на флаг.',
    radius: 16, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.IcosahedronGeometry(1.1, 1), '#f0c36b', 'Общая идея: научно организовать труд и управление.', { flatShading: true }).position.y = 1.6;
      var C = [['США', 'научный менеджмент', '#7aa2ff', 'Тейлор: Scientific Management.'], ['Франция', 'научная организация\nтруда', '#4cc38a', 'Отсюда и русское «НОТ».'], ['Германия', 'рационализация', '#f0c36b', 'Упор на стандарты и экономию.'], ['Россия', 'научное управление', '#ef6b5b', 'Главный заказчик — государство.']];
      c.flags = C.map(function (k, i) {
        var a = i / 4 * Math.PI * 2 + 0.4, x = Math.sin(a) * 5, z = Math.cos(a) * 5;
        c.mesh(new T.CylinderGeometry(0.9, 1, 0.5, 20), '#5b6a99', null).position.set(x, 0.25, z);
        var p = c.mesh(new T.CylinderGeometry(0.05, 0.05, 3, 8), '#ddd'); p.position.set(x, 2, z);
        var f = c.box3(1.6, 1, 0.05, k[2], [x + 0.8, 3, z], '<b>' + k[0] + '</b> — «' + k[1].replace('\n', ' ') + '». ' + k[3]);
        f.lookAt(0, 3, 0);
        c.label(k[0] + '\n' + k[1], [x, 4.4, z], 0.42, k[2]);
        U.link(c, [x * 0.8, 0.9, z * 0.8], [x * 0.25, 1.4, z * 0.25], k[2], 0.05);
        return f;
      });
      c.onFrame(function (t) { c.flags.forEach(function (f, i) { f.rotation.z = Math.sin(t * 2 + i) * 0.05; }); });
    },
    chips: [
      { t: 'США', on: function (c) { c.pick(c.flags[0]); } }, { t: 'Франция', on: function (c) { c.pick(c.flags[1]); } },
      { t: 'Германия', on: function (c) { c.pick(c.flags[2]); } }, { t: 'Россия', on: function (c) { c.pick(c.flags[3]); } }
    ]
  });

  /* ---------- 2. Большие циклы Кондратьева ---------- */
  reg('tu3-kondratiev', {
    title: 'Длинные волны Кондратьева', lead: 'Лента — экономика за 250 лет. Каждый гребень — подъём на новой большой технологии, каждая впадина — спад, когда она исчерпана. Волна длится 45–60 лет.',
    radius: 22, phi: 1.1, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      var pts = []; for (var k = 0; k <= 200; k++) { var x = -11 + k * 0.11; pts.push([x, 1.5 + Math.sin((x + 11) / 22 * Math.PI * 2 * 4.5 - 1.2) * 1.3 + (x + 11) * 0.05, 0]); }
      U.tube(c, pts, '#7aa2ff', 0.12, false, 'Экономика живёт волнами по полвека.');
      var tech = [['паровая машина', 1800, '#c46a3a'], ['железные дороги', 1850, '#8a8f9e'], ['электричество', 1900, '#f0c36b'], ['автомобиль, нефть', 1950, '#ef6b5b'], ['компьютер', 2000, '#4cc38a']];
      c.tops = tech.map(function (t, i) {
        var x = -11 + (t[1] - 1780) / 250 * 22;
        var best = pts.reduce(function (b, p) { return Math.abs(p[0] - x) < 2.2 && p[1] > b[1] ? p : b; }, [x, -9]);
        var m = c.box3(0.8, 0.8, 0.8, t[2], [best[0], best[1] + 0.9, 0], '<b>Около ' + t[1] + ' г.: ' + t[0] + '</b>. Новая технология запускает подъём, потом её потенциал исчерпывается — спад.');
        c.label(t[0], [best[0], best[1] + 2, 0], 0.4, t[2]);
        return m;
      });
      for (var y = 1800; y <= 2025; y += 50) c.label(String(y), [-11 + (y - 1780) / 250 * 22, -0.6, 0], 0.35, '#9aa2c0');
      c.box3(23, 0.1, 3, '--panel2', [0, -0.1, 0], 'Время.');
      c.onFrame(function (t) { c.tops.forEach(function (m, i) { m.rotation.y = t + i; }); });
    },
    hint: 'Даты технологий — примерные. Кондратьев (1892–1938) — теория больших циклов, прогнозирование и планирование.'
  });

  /* ---------- 3. Богданов: закон наименьших (бочка) ---------- */
  reg('tu3-barrel', {
    title: 'Богданов: закон наименьших', lead: 'Бочка из досок разной высоты. Вода вытекает через самую низкую доску — прочность целого задаёт слабейшее звено. Нарасти слабую доску или «организуй» бочку.',
    radius: 15, phi: 1.05, targetY: 1.8,
    build: function (c) {
      var T = c.THREE, S = c.state = { fix: 0 };
      var H = [3.4, 3.1, 3.6, 1.6, 3.3, 3.5, 3.0, 3.4, 3.2, 3.6, 2.9, 3.3];
      c.staves = H.map(function (h, i) {
        var a = i / H.length * Math.PI * 2, m = c.box3(0.62, h, 0.18, i === 3 ? '#ef6b5b' : '#a8743f', [Math.sin(a) * 1.6, h / 2, Math.cos(a) * 1.6], i === 3 ? '<b>Самое слабое звено.</b> Именно оно определяет, сколько воды удержит вся бочка.' : 'Доска бочки — часть системы.');
        m.rotation.y = a; m.userData.h = h; return m;
      });
      [0.5, 2.6].forEach(function (y) { var r = c.mesh(new T.TorusGeometry(1.7, 0.06, 6, 40), '#555'); r.rotation.x = Math.PI / 2; r.position.y = y; });
      var water = c.mesh(new T.CylinderGeometry(1.5, 1.5, 1, 32), '#4a90e2', 'Уровень воды = высота самой низкой доски.', { transparent: true, opacity: 0.75 });
      var drops = []; for (var k = 0; k < 6; k++) { var d = U.glow(c, '#4a90e2', 0.12); drops.push(d); }
      c.onFrame(function (t) {
        var low = 99; c.staves.forEach(function (m, i) { var target = i === 3 ? (S.fix ? 3.3 : 1.6) : m.userData.h; var cur = m.scale.y * m.userData.h; var nh = cur + (target - cur) * 0.06; m.scale.y = nh / m.userData.h; m.position.y = nh / 2; low = Math.min(low, nh); });
        water.scale.y = low - 0.1; water.position.y = (low - 0.1) / 2;
        var a = 3 / 12 * Math.PI * 2;
        drops.forEach(function (d, i) { var k = U.W(t * 0.8 + i / 6); d.visible = !S.fix || low < 3; d.position.set(Math.sin(a) * (1.7 + k * 1.2), low - k * k * low, Math.cos(a) * (1.7 + k * 1.2)); });
      });
    },
    chips: [
      { t: 'Слабое звено', small: 'как есть', on: function (c) { c.state.fix = 0; c.say('Одиннадцать досок высокие, одна низкая — и вода стоит только до неё. <b>Закон наименьших</b>: прочность цепи определяется самым слабым звеном.'); } },
      { t: 'Укрепить', small: 'организация', on: function (c) { c.state.fix = 1; c.say('Нарастили слабую доску — бочка держит почти до верха. Хорошая организация делает <b>целое больше суммы частей</b> (позже это назовут синергией).'); } }
    ]
  });

  /* ---------- 4. АСУ: компьютер собирает данные с заводов ---------- */
  reg('tu3-asu', {
    title: 'АСУ 1960–1980-х', lead: 'В центре — вычислительный центр. Заводы отправляют данные (синие шарики), центр рассчитывает план и отправляет его обратно (жёлтые). Это автоматизированная система управления.',
    radius: 19, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      c.box3(2.4, 2.6, 1.6, '#3e4a6b', [0, 1.3, 0], '<b>Вычислительный центр (ЭВМ)</b>: собирает данные, считает варианты плана — экономико-математические методы.');
      for (var r = 0; r < 4; r++) for (var k = 0; k < 4; k++) c.box3(0.3, 0.15, 0.04, k % 2 ? '#4cc38a' : '#ef6b5b', [-0.6 + k * 0.4, 0.6 + r * 0.5, 0.82], null);
      c.label('ЭВМ', [0, 3.3, 0], 0.55, '#7aa2ff');
      var F = 6;
      for (var i = 0; i < F; i++) {
        var a = i / F * Math.PI * 2, x = Math.sin(a) * 7, z = Math.cos(a) * 7;
        c.box3(1.6, 1, 1.2, '#6b5b4a', [x, 0.5, z], 'Завод. Отчёт уходит в центр, плановое задание приходит обратно.');
        c.mesh(new T.CylinderGeometry(0.12, 0.15, 1, 8), '#6b5b4a').position.set(x + 0.4, 1.4, z);
        var up = U.curve(c, [[x, 1.2, z], [x * 0.5, 2.8, z * 0.5], [0, 2.2, 0]]), dn = U.curve(c, [[0, 2.4, 0], [x * 0.5, 3.6, z * 0.5], [x, 1.3, z]]);
        U.tube(c, up.points.map(function (p) { return [p.x, p.y, p.z]; }), '#7aa2ff', 0.03, false);
        U.movers(c, up, '#7aa2ff', 0.25, 2, 0.15); U.movers(c, dn, '#f0c36b', 0.2, 1, 0.17);
      }
    },
    hint: 'Управленческий бум: кибернетика, системный анализ, моделирование, программно-целевое планирование, АСУ.'
  });

  /* ---------- 5. Программно-целевое планирование ---------- */
  reg('tu3-program', {
    title: 'Программно-целевое планирование', lead: 'Сначала ставят большую цель (башня), потом под неё собирают ресурсы из разных министерств. Нажми «Собрать программу».',
    radius: 19, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { go: 0, k: 0 };
      var goal = c.mesh(new T.CylinderGeometry(0.6, 1.2, 4, 8), '#f0c36b', '<b>Цель программы</b>: например, освоить нефть Западной Сибири.'); goal.position.y = 2;
      c.label('ЦЕЛЬ', [0, 4.8, 0], 0.6, '#f0c36b');
      var M = [['деньги', '#4cc38a'], ['кадры', '#c9b6f0'], ['техника', '#7aa2ff'], ['транспорт', '#ff8f66'], ['жильё', '#ef6b5b']];
      c.blocks = M.map(function (m, i) {
        var a = i / M.length * Math.PI * 2, x = Math.sin(a) * 7, z = Math.cos(a) * 7;
        c.box3(1.8, 1.2, 1.4, '#3a4270', [x, 0.6, z], 'Министерство: даёт ресурс «' + m[0] + '».');
        c.label(m[0], [x, 2, z], 0.45, m[1]);
        var b = c.box3(0.8, 0.8, 0.8, m[1], [x, 1.6, z], 'Ресурс «' + m[0] + '» для программы.'); b.userData.home = [x, 1.6, z]; b.userData.a = a; return b;
      });
      c.onFrame(function () {
        S.k += ((S.go ? 1 : 0) - S.k) * 0.03;
        c.blocks.forEach(function (b, i) { var h = b.userData.home, a = b.userData.a, tx = Math.sin(a) * 1.6, tz = Math.cos(a) * 1.6; b.position.set(h[0] + (tx - h[0]) * S.k, 1.6 + S.k * (0.2 + i * 0.6) + Math.sin(S.k * Math.PI) * 2, h[2] + (tz - h[2]) * S.k); });
      });
    },
    chips: [
      { t: 'Разрозненно', small: 'каждый сам', on: function (c) { c.state.go = 0; c.say('Каждое министерство планирует своё — ресурсы распылены.'); } },
      { t: 'Собрать программу', small: 'под цель', on: function (c) { c.state.go = 1; c.say('<b>Программа</b>: под одну цель стягивают деньги, людей и сроки из разных ведомств.'); } }
    ]
  });
})();
