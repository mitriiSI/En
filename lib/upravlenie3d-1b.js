/* Дополнительные 3D-модели: «Теория управления. Лекция 1». Помощники — lib/upravlenie3d-common.js. */
(function () {
  'use strict';
  if (!window.TU3) return;
  var U = window.TU3, reg = U.reg;

  /* ---------- 1. Пять управленческих революций ---------- */
  reg('tu1-revolutions', {
    title: 'Лестница управленческих революций', lead: 'Пять ступеней — пять революций. На каждой лежит символ эпохи. Шарик поднимается к пятой ступени, где управление становится профессией.',
    radius: 20, phi: 1.05, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      var R = [
        ['1. Функции внутри хозяйства', '#c46a3a', 'Жрецы Египта и Шумера ведут учёт урожая и запасов: управленческая функция выделилась внутри обычной деятельности.'],
        ['2. Законы, хартии', '#f0c36b', 'Законы Хаммурапи, хартии: управление получает нормативную основу.'],
        ['3. Административные системы', '#7aa2ff', 'Римская империя, китайская бюрократия: аппарат управления.'],
        ['4. Смена укладов', '#4cc38a', 'Промышленная революция: новые технологии и экономика требуют нового управления.'],
        ['5. Управление — профессия', '#c9b6f0', 'Конец XIX — начало XX века: наёмные менеджеры, управление как самостоятельный вид деятельности.']
      ];
      c.steps = R.map(function (r, i) {
        var x = -6 + i * 3, h = 0.8 + i * 1.1;
        var m = c.box3(2.8, h, 3.2, r[1], [x, h / 2, 0], '<b>' + r[0] + '</b>. ' + r[2]);
        c.label(r[0].replace(' — ', '\n').replace('. ', '.\n'), [x, h + 1.9 + (i % 2) * 1.4, 1.9], 0.38, r[1]);
        return [m, x, h];
      });
      var s = c.steps;
      var tab = c.box3(0.9, 0.6, 0.15, '#d9cdb5', [s[0][1], s[0][2] + 0.3, 0], 'Глиняная табличка учёта.'); tab.rotation.x = -0.3;
      var scr = c.mesh(new T.CylinderGeometry(0.25, 0.25, 1.4, 16), '#f3e3b0', 'Свиток закона.'); scr.rotation.z = Math.PI / 2; scr.position.set(s[1][1], s[1][2] + 0.25, 0);
      for (var k = 0; k < 4; k++) { var col = c.mesh(new T.CylinderGeometry(0.1, 0.1, 0.9, 10), '#e8dcc4', 'Здание администрации.'); col.position.set(s[2][1] - 0.6 + k * 0.4, s[2][2] + 0.45, 0); }
      c.box3(1.8, 0.15, 0.7, '#e8dcc4', [s[2][1], s[2][2] + 0.97, 0], 'Здание администрации.');
      c.box3(1.2, 0.8, 0.8, '#6b5b4a', [s[3][1], s[3][2] + 0.4, 0], 'Фабрика — промышленная революция.');
      var pipe = c.mesh(new T.CylinderGeometry(0.12, 0.15, 1, 10), '#6b5b4a', 'Фабричная труба.'); pipe.position.set(s[3][1] + 0.4, s[3][2] + 1.2, 0);
      c.box3(1, 0.7, 0.3, '#3a2b20', [s[4][1], s[4][2] + 0.35, 0], 'Портфель менеджера: управление стала профессией.');
      var cv = U.curve(c, s.map(function (p) { return [p[1], p[2] + 1.2, 1.2]; }));
      var ball = U.glow(c, '#ffffff', 0.25);
      c.onFrame(function (t) { ball.position.copy(cv.getPointAt(Math.min(1, U.W(t * 0.12) * 1.15))); });
    },
    chips: [
      { t: 'Древность', small: '1–2', on: function (c) { c.pick(c.steps[0][0]); c.setView(-0.5, 1.1, 14, 1.5); } },
      { t: 'Государство', small: '3–4', on: function (c) { c.pick(c.steps[2][0]); c.setView(0, 1.1, 14, 3); } },
      { t: 'Профессия', small: '5', on: function (c) { c.pick(c.steps[4][0]); c.setView(0.5, 1.05, 14, 5); } }
    ]
  });

  /* ---------- 2. Власть и авторитет ---------- */
  reg('tu1-authority', {
    title: 'Власть без авторитета и с ним', lead: 'Начальник на постаменте, вокруг — сотрудники. Переключай: при власти без авторитета люди отворачиваются, при авторитете — сами идут за лидером.',
    radius: 17, phi: 1.0, targetY: 1.2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.mesh(new T.CylinderGeometry(1.2, 1.4, 1.2, 24), '#5b6a99', '<b>Должность</b> — источник формальной власти.').position.y = 0.6;
      var boss = c.mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(0.45, 1.1, 6, 14) : new T.CylinderGeometry(0.45, 0.45, 2, 14), '#f0c36b', '<b>Руководитель.</b> Власть — право приказывать. Авторитет — готовность людей слушаться добровольно.');
      boss.position.y = 2.2;
      c.people = [];
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2, g = new T.Group();
        var body = new T.Mesh(T.CapsuleGeometry ? new T.CapsuleGeometry(0.3, 0.7, 6, 12) : new T.CylinderGeometry(0.3, 0.3, 1.3, 12), c.mat('#c9b6f0')); body.position.y = 0.7; body.castShadow = true; g.add(body);
        var nose = new T.Mesh(new T.ConeGeometry(0.12, 0.35, 8), c.mat('#9a7bd0')); nose.rotation.x = Math.PI / 2; nose.position.set(0, 1.1, 0.33); g.add(nose);
        body.userData.info = 'Сотрудник. Можно иметь власть над ним без авторитета: он подчиняется, но тихо саботирует.';
        g.position.set(Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2); g.userData.a = a; c.root.add(g); c.people.push(g);
      }
      c.lbl = c.label('власть без авторитета', [0, 4.3, 0], 0.55, '#ef6b5b');
      c.onFrame(function (t) {
        c.people.forEach(function (g, i) {
          var face = Math.atan2(-g.position.x, -g.position.z);
          var goal = S.mode ? face : face + Math.PI + Math.sin(i * 2.3) * 0.6;
          var dr = g.rotation.y - goal; dr = Math.atan2(Math.sin(dr), Math.cos(dr)); g.rotation.y -= dr * 0.06;
          var r = Math.hypot(g.position.x, g.position.z), rg = S.mode ? 2.8 : 4.6; var k = r + (rg - r) * 0.03;
          g.position.x = Math.cos(g.userData.a) * k; g.position.z = Math.sin(g.userData.a) * k;
          g.position.y = S.mode ? Math.abs(Math.sin(t * 3 + i)) * 0.1 : 0;
        });
      });
    },
    chips: [
      { t: 'Только власть', small: 'приказ', on: function (c) { c.state.mode = 0; c.say('Приказы есть, а доверия нет: люди отворачиваются и держат дистанцию. Это <b>власть без авторитета</b>.'); } },
      { t: 'Авторитет', small: 'уважение', on: function (c) { c.state.mode = 1; c.say('Люди сами поворачиваются к лидеру и подходят ближе — слушаются добровольно. Атрибуты отношения: власть, авторитет, лидерство, подчинение, <b>доверие</b>, конфликт, ответственность.'); } }
    ]
  });

  /* ---------- 3. Восемь задач теории управления ---------- */
  reg('tu1-tasks', {
    title: 'Восемь задач теории управления — тропинка', lead: 'Восемь камней-ступенек: узнать → описать → разобрать → объяснить → дать метод → предсказать → научить → посоветовать. Нажми на камень.',
    radius: 19, phi: 0.85, targetY: 0.5,
    build: function (c) {
      var T = c.THREE;
      var K = [['Познавательная', 'узнать', 'Получить новые знания об управлении.'], ['Описательная', 'описать', 'Определить основные тенденции развития управленческих процессов.'], ['Аналитическая', 'разобрать', 'Изучить факты, которые влияют на управленческие отношения.'], ['Объяснительная', 'объяснить', 'Объяснить, почему так происходит.'], ['Методологическая', 'дать метод', 'Научить, как правильно изучать управление.'], ['Прогностическая', 'предсказать', 'Построить наиболее вероятные сценарии развития.'], ['Образовательная', 'научить', 'Готовить управленцев.'], ['Практическая', 'посоветовать', 'Дать научно обоснованные рекомендации по совершенствованию управления.']];
      var cols = ['#7aa2ff', '#7aa2ff', '#4cc38a', '#4cc38a', '#f0c36b', '#f0c36b', '#ff8f66', '#ef6b5b'];
      var pts = [];
      c.stones = K.map(function (k, i) {
        var x = -7 + i * 2, z = Math.sin(i * 0.9) * 2.2, y = i * 0.25;
        var m = c.mesh(new T.CylinderGeometry(0.85, 0.95, 0.4 + y, 7), cols[i], '<b>' + (i + 1) + '. ' + k[0] + '</b> («' + k[1] + '»): ' + k[2]);
        m.position.set(x, (0.4 + y) / 2, z);
        c.label((i + 1) + '. ' + k[1], [x, 1.4 + y + (i % 2) * 1.1, z], 0.42, cols[i]);
        pts.push([x, 0.7 + y, z]);
        return m;
      });
      var cv = U.curve(c, pts);
      var walker = U.glow(c, '#ffffff', 0.3);
      c.onFrame(function (t) { var k = U.W(t * 0.08), p = cv.getPointAt(k); walker.position.set(p.x, p.y + Math.abs(Math.sin(k * Math.PI * 16)) * 0.6, p.z); });
    },
    chips: [
      { t: 'Познать', small: '1–4', on: function (c) { c.setView(-0.4, 0.9, 13, 0); c.say('Первые четыре задачи — <b>понять</b>: узнать, описать, разобрать, объяснить.'); } },
      { t: 'Применить', small: '5–8', on: function (c) { c.setView(0.4, 0.9, 13, 1); c.say('Вторые четыре — <b>использовать</b>: дать метод, предсказать, научить, посоветовать.'); } }
    ]
  });

  /* ---------- 4. Объект и предмет ---------- */
  reg('tu1-lenses', {
    title: 'Один объект — разные предметы', lead: 'В центре — организация (объект). На неё смотрят экономист и психолог, и каждый подсвечивает свою сторону (предмет). Переключай взгляд.',
    radius: 17, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { who: 0 };
      var bld = c.box3(3, 3, 3, '#9aa2c0', [0, 1.5, 0], '<b>Объект</b> — то, что изучаем: организация. Он один для всех наук.');
      c.faces = [];
      [['#f0c36b', [1.52, 1.5, 0], [0, Math.PI / 2, 0], 'деньги, затраты'], ['#c9b6f0', [0, 1.5, 1.52], [0, 0, 0], 'люди, мотивы'], ['#4cc38a', [-1.52, 1.5, 0], [0, -Math.PI / 2, 0], 'управление']].forEach(function (f) {
        var m = c.mesh(new T.PlaneGeometry(2.6, 2.6), f[0], 'Сторона «' + f[3] + '».', { transparent: true, opacity: 0.25, side: T.DoubleSide });
        m.position.set(f[1][0], f[1][1], f[1][2]); m.rotation.set(f[2][0], f[2][1], f[2][2]); c.faces.push(m);
      });
      function eye(pos, colr, name, info) {
        var g = new T.Group(); g.position.set(pos[0], pos[1], pos[2]); c.root.add(g);
        var h = new T.Mesh(new T.SphereGeometry(0.5, 18, 12), c.mat(colr)); h.userData.info = info; g.add(h);
        var lens = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.4, 16), c.mat('#222')); lens.rotation.z = Math.PI / 2; g.add(lens);
        g.lookAt(0, 1.5, 0); lens.position.z = 0.5; lens.rotation.set(Math.PI / 2, 0, 0);
        c.label(name, [pos[0], pos[1] + 1, pos[2]], 0.5, colr);
        return g;
      }
      eye([6, 2, 0], '#f0c36b', 'экономист', 'Экономист изучает организацию со стороны затрат, доходов, ресурсов.');
      eye([0, 2, 6], '#c9b6f0', 'психолог', 'Психолог — со стороны мотивов, отношений, поведения людей.');
      eye([-6, 2, 0], '#4cc38a', 'теория управления', 'Теория управления — со стороны закономерностей управления.');
      c.beams = [[6, 0], [0, 6], [-6, 0]].map(function (p, i) {
        var len = 4.5, m = c.mesh(new T.ConeGeometry(1.4, len, 24, 1, true), ['#f0c36b', '#c9b6f0', '#4cc38a'][i], null, { transparent: true, opacity: 0.18, side: T.DoubleSide, depthWrite: false });
        m.position.set(p[0] * 0.62, 1.8, p[1] * 0.62); m.lookAt(0, 1.8, 0); m.rotateX(Math.PI / 2); return m;
      });
      c.onFrame(function () { c.beams.forEach(function (b, i) { b.visible = S.who === i; }); c.faces.forEach(function (f, i) { f.material.opacity += ((S.who === i ? 0.9 : 0.15) - f.material.opacity) * 0.1; }); });
    },
    chips: [
      { t: 'Экономист', on: function (c) { c.state.who = 0; c.setView(1.57, 1.1, 14, 1.5); c.say('Объект тот же, а <b>предмет</b> — деньги и ресурсы.'); } },
      { t: 'Психолог', on: function (c) { c.state.who = 1; c.setView(0, 1.1, 14, 1.5); c.say('Объект тот же, а предмет — <b>люди и их мотивы</b>.'); } },
      { t: 'Теория управления', on: function (c) { c.state.who = 2; c.setView(-1.57, 1.1, 14, 1.5); c.say('Предмет теории управления — <b>закономерности управления</b> социально-экономическими отношениями.'); } }
    ]
  });

  /* ---------- 5. Горизонт целей ---------- */
  reg('tu1-horizon', {
    title: 'Горизонт целей: дорога к вершине', lead: 'Близкий флажок — оперативная цель (дни), средний — тактическая (месяцы), гора вдали — стратегическая (годы).',
    radius: 20, phi: 1.15, targetY: 2, theta: 0.25,
    build: function (c) {
      var T = c.THREE;
      c.box3(3, 0.1, 22, '#5b6170', [0, 0.05, -6], 'Дорога к цели.');
      c.box3(14, 0.05, 24, '#4f7a5a', [0, -0.03, -6], 'Поле.');
      function flag(z, h, col, name, info) {
        var p = c.mesh(new T.CylinderGeometry(0.06, 0.06, h, 8), '#ddd', info); p.position.set(1.8, h / 2, z);
        var f = c.box3(1.2, 0.7, 0.05, col, [2.4, h - 0.4, z], info);
        c.label(name, [1.8, h + 0.8, z], 0.5, col); return f;
      }
      c.f1 = flag(3, 2, '#4cc38a', 'оперативная · дни', '<b>Оперативная цель</b> — на дни: «составить расписание к понедельнику».');
      c.f2 = flag(-4, 3, '#f0c36b', 'тактическая · месяцы', '<b>Тактическая цель</b> — на месяцы: «открыть новую программу к сентябрю».');
      var mtn = c.mesh(new T.ConeGeometry(4, 7, 6), '#7a8ab8', '<b>Стратегическая цель</b> — на годы: «стать лучшим вузом страны». Тактические и оперативные цели — шаги к ней.');
      mtn.position.set(0, 3.5, -15);
      c.mesh(new T.ConeGeometry(1.3, 2.3, 6), '#ffffff', 'Вершина — стратегическая цель.').position.set(0, 5.85, -15);
      c.label('стратегическая · годы', [0, 8.2, -15], 0.6, '#7aa2ff');
      var cv = U.curve(c, [[0, 0.4, 5], [0, 0.4, -3], [0, 0.4, -10], [0, 4, -13.6], [0, 7.2, -15]]);
      var me = U.glow(c, '#ff8f66', 0.35);
      c.onFrame(function (t) { me.position.copy(cv.getPointAt(Math.min(1, U.W(t * 0.07) * 1.1))); });
    },
    chips: [
      { t: 'Дни', small: 'оперативная', on: function (c) { c.pick(c.f1); c.setView(0.5, 1.15, 10, 1); } },
      { t: 'Месяцы', small: 'тактическая', on: function (c) { c.pick(c.f2); c.setView(0.4, 1.1, 14, 2); } },
      { t: 'Годы', small: 'стратегическая', on: function (c) { c.setView(0.2, 1.2, 26, 3); c.say('Большая цель раскладывается на тактические и оперативные — так стратегия становится выполнимой.'); } }
    ]
  });
})();
