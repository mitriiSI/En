/* 3D-модели: «Теория управления. Лекция 2. Западные школы управления». Движок — HubScene3d. */
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

  /* ---------- 1. Лестница школ XX века ---------- */
  reg('tu2-schools', {
    title: 'Лестница западных школ управления', lead: 'Каждая ступень — школа. Новая школа появляется, когда старая перестаёт объяснять реальность. Нажми на ступень.',
    radius: 24, phi: 1.05, targetY: 3,
    build: function (c) {
      var S = [
        ['Научное управление', '1885–1920', '#7aa2ff', 'Тейлор, Гант, Гилбреты, Эмерсон: научное изучение операций, нормы, стандарты, оплата по результату.'],
        ['Административная', '1920–1950', '#5b7fd9', 'Файоль, Вебер: принципы управления всей организацией, функции, иерархия, бюрократия.'],
        ['Человеческие отношения', '1930–1950', '#4cc38a', 'Фоллетт, Мейо, Ретлисбергер: Хоторнский эксперимент, человек как личность, группа.'],
        ['Поведенческие науки', '1950 —', '#2ea36e', 'Маслоу, Макгрегор, Херцберг: закономерности поведения и мотивации.'],
        ['Эмпирическая', '1950 —', '#f0c36b', 'Друкер и др.: обобщать опыт реальных компаний, менеджер как профессия.'],
        ['Количественная', '1950 —', '#ff8f66', 'Исследование операций, модели, математика и ЭВМ для решений.'],
        ['Системный подход', '1960 —', '#c9b6f0', 'Организация как открытая система взаимосвязанных частей.'],
        ['Ситуационный', '1960 —', '#ef6b5b', '«Всё зависит от обстоятельств»: нет одного лучшего способа.']
      ];
      S.forEach(function (s, i) {
        var h = 0.8 + i * 0.85, x = -9.8 + i * 2.8;
        c.box3(2.6, h, 4, s[2], [x, h / 2, 0], '<b>' + s[0] + '</b> (' + s[1] + '). ' + s[3]);
        c.label((i + 1) + '. ' + s[0] + '\n' + s[1], [x, h + 1, 0], 0.42, s[2]);
      });
      c.label('классика', [-8.4, -0.6, 2.6], 0.5, '#9aa2c0');
      c.label('человек', [-1.4, -0.6, 2.6], 0.5, '#4cc38a');
      c.label('модели и системы', [7, -0.6, 2.6], 0.5, '#c9b6f0');
    },
    chips: [
      { t: 'Классика', small: '1–2', on: function (c) { c.setView(-0.4, 1.1, 14, 1.5); c.say('<b>Классические школы</b>: научное управление (Тейлор) и административная (Файоль, плюс теория бюрократии Вебера).'); } },
      { t: 'Человек', small: '3–4', on: function (c) { c.setView(0, 1.1, 14, 2.5); c.say('Школы <b>человеческих отношений</b> и <b>поведенческих наук</b>: от «рабочий — винтик» к мотивации и группе.'); } },
      { t: 'Модели', small: '5–8', on: function (c) { c.setView(0.5, 1.05, 16, 4.5); c.say('<b>Эмпирическая, количественная, системный и ситуационный подходы</b>: опыт, математика, целое, контекст.'); } }
    ]
  });

  /* ---------- 2. Тейлор и Шмидт ---------- */
  reg('tu2-taylor', {
    title: 'Тейлор и рабочий Шмидт: 12,5 → 47 тонн', lead: 'Штабель слева — чугун, который Шмидт грузил за день до хронометража. Справа — после: научный метод, ритм работы и отдыха, оплата по результату.',
    radius: 19, phi: 1.1, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { after: 1 };
      c.box3(16, 0.3, 8, '--panel2', [0, -0.15, 0], 'Bethlehem Steel, 1899.');
      function stack(x, n, col, info) {
        var arr = [];
        for (var i = 0; i < n; i++) { var m = c.box3(1.1, 0.35, 0.45, col, [x + (i % 4) * 1.15 - 1.7, 0.18 + Math.floor(i / 8) * 0.37, (Math.floor(i / 4) % 2) * 0.5 - 0.25], info); arr.push(m); }
        return arr;
      }
      c.before = stack(-4.5, 13, '#8a8f9e', '<b>До:</b> около 12,5 т чугуна в день. Метод «как привык».');
      c.after = stack(4.5, 47, '#c46a3a', '<b>После:</b> 47 т в день. Тейлор хронометрировал движения, подобрал ритм работы и отдыха.');
      var w0 = c.box3(0.8, 2, 0.8, '#f0c36b', [-4.5, 1, 2.8], 'Заработок до — 100 %.');
      var w1 = c.box3(0.8, 3.2, 0.8, '#f0c36b', [4.5, 1.6, 2.8], 'Заработок после — около 160 % (+60 %). Принцип: <b>оплата по результатам</b>.');
      c.label('до: 12,5 т', [-4.5, 4.3, 0], 0.6);
      c.label('после: 47 т', [4.5, 7.2, 0], 0.6, '#ff8f66');
      c.label('+60 % к зарплате', [4.5, 4, 2.8], 0.5, '#f0c36b');
      var watch = c.mesh(new T.CylinderGeometry(0.8, 0.8, 0.2, 32), '#e8dcc4', '<b>Хронометраж</b> — научное изучение затрат времени и движений. Принцип Тейлора №1.', { metalness: 0.4 });
      watch.rotation.x = Math.PI / 2; watch.position.set(0, 3.5, 0);
      var hg = new T.BoxGeometry(0.06, 0.65, 0.05); hg.translate(0, 0.3, 0);
      var hand = c.mesh(hg, '#ef6b5b'); hand.position.set(0, 3.5, 0.13);
      c.onFrame(function (t) {
        hand.rotation.z = -t * 2;
        var n = S.after ? Math.min(47, Math.floor((t * 12) % 70)) : 0;
        c.after.forEach(function (m, i) { m.visible = i < n; });
      });
    },
    chips: [
      { t: 'По старинке', small: 'до', on: function (c) { c.state.after = 0; c.say('Без нормирования рабочий грузит, «как привык»: около <b>12,5 т</b> в день.'); } },
      { t: 'Научно', small: 'после', on: function (c) { c.state.after = 1; c.say('Хронометраж + ритм отдыха + стандарт + оплата по результату = <b>47 т</b> и <b>+60 %</b> к заработку. Выгодно и хозяину, и рабочему — так Тейлор понимал задачу менеджмента.'); } }
    ]
  });

  /* ---------- 3. Диаграмма Ганта в 3D ---------- */
  reg('tu2-gantt', {
    title: 'Диаграмма Ганта', lead: 'Каждая полоса — работа, длина — сколько она длится. Красная плоскость — «сегодня»: видно, что идёт параллельно, а что ждёт предыдущего шага.',
    radius: 20, phi: 0.85, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      var tasks = [['Проект цеха', 0, 3, '#7aa2ff'], ['Закупка станков', 2, 4, '#f0c36b'], ['Обучение рабочих', 3, 3, '#4cc38a'], ['Монтаж', 6, 3, '#ff8f66'], ['Пробный запуск', 9, 2, '#c9b6f0']];
      c.box3(13, 0.1, 7, '--panel2', [0, -0.05, 0], 'Ось времени — недели.');
      for (var w = 0; w <= 11; w++) { c.box3(0.04, 0.12, 7, '#2b3154', [-5.5 + w, 0.02, 0]); if (w % 2 === 0) c.label('нед. ' + (w + 1), [-5.5 + w, 0.3, 3.9], 0.35, '#9aa2c0'); }
      tasks.forEach(function (t, i) {
        var z = -2.6 + i * 1.3;
        c.box3(t[2], 0.6, 0.8, t[3], [-5.5 + t[1] + t[2] / 2, 0.4, z], '<b>' + t[0] + '</b>: с ' + (t[1] + 1) + '-й недели, ' + t[2] + ' нед.');
        c.label(t[0], [-7.5, 0.6, z], 0.4, t[3]);
      });
      var now = c.mesh(new T.BoxGeometry(0.06, 2, 7), '#ef6b5b', 'Линия «сегодня».', { transparent: true, opacity: 0.6 });
      c.onFrame(function (t) { var x = -5.5 + (t * 0.8) % 11; now.position.set(x, 1, 0); });
    },
    chips: [
      { t: 'Параллельно', small: 'одновременно', on: function (c) { c.setView(0.2, 0.7, 15, 0); c.say('Закупка станков и обучение рабочих идут <b>параллельно</b> — это экономит время.'); } },
      { t: 'Последовательно', small: 'одно за другим', on: function (c) { c.setView(0.9, 0.9, 16, 0); c.say('Монтаж начинается только <b>после</b> закупки, запуск — после монтажа. Задержка одной полосы сдвигает все следующие.'); } }
    ]
  });

  /* ---------- 4. Скалярная цепь и мостик Файоля ---------- */
  reg('tu2-fayol', {
    title: 'Скалярная цепь и «мостик Файоля»', lead: 'Сотрудник F хочет договориться с сотрудником P из соседнего отдела. По цепи сообщение идёт вверх до общего начальника и вниз. По мостику — напрямую.',
    radius: 20, phi: 1.1, targetY: 3,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      var A = [0, 8, 0], L = [[-2, 6, 0], [-4, 4, 0], [-6, 2, 0]], R = [[2, 6, 0], [4, 4, 0], [6, 2, 0]];
      function node(p, col, name, info) { var m = c.mesh(new T.SphereGeometry(0.55, 24, 16), col, info); m.position.set(p[0], p[1], p[2]); c.label(name, [p[0], p[1] + 0.95, p[2]], 0.45, col); return m; }
      node(A, '#f0c36b', 'A — директор', '<b>A</b> — общий начальник. Вершина скалярной цепи.');
      ['B', 'C', 'F'].forEach(function (n, i) { node(L[i], '#7aa2ff', n, '<b>' + n + '</b> — ступень левой ветви иерархии.'); });
      ['O', 'N', 'P'].forEach(function (n, i) { node(R[i], '#4cc38a', n, '<b>' + n + '</b> — ступень правой ветви иерархии.'); });
      var all = [L[2], L[1], L[0], A, R[0], R[1], R[2]];
      for (var i = 0; i < all.length - 1; i++) {
        var a = all[i], b = all[i + 1];
        var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
        var m = c.mesh(new T.CylinderGeometry(0.08, 0.08, len, 8), '#9aa2c0', '<b>Скалярная цепь</b> — иерархия от директора до рабочего. Приказы идут по ступенькам.');
        m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0); m.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
      }
      var br = c.mesh(new T.BoxGeometry(11, 0.25, 0.9), '#ef6b5b', '<b>Мостик Файоля</b>: F и P договариваются напрямую, если их начальники не против. Быстрее и цепь не нарушена.', { transparent: true, opacity: 0.85 });
      br.position.set(0, 2, 0);
      c.label('мостик', [0, 2.7, 0.6], 0.5, '#ef6b5b');
      var path = new T.CatmullRomCurve3(all.map(function (p) { return V(T, p); }), false, 'catmullrom', 0.01);
      var msg = c.mesh(new T.SphereGeometry(0.3, 16, 12), '#ffffff', null, { emissive: c.color('#ffffff'), emissiveIntensity: 0.8 });
      c.onFrame(function (t) {
        br.visible = S.mode === 1;
        if (S.mode === 0) msg.position.copy(path.getPointAt(W((t * 0.12) % 1)));
        else { var k = (t * 0.45) % 1; msg.position.set(-6 + 12 * k, 2.5, 0); }
      });
    },
    chips: [
      { t: 'По цепи', small: '6 шагов', on: function (c) { c.state.mode = 0; c.say('F → C → B → A → O → N → P: шесть передач. Надёжно, но <b>медленно</b>.'); } },
      { t: 'Мостик', small: '1 шаг', on: function (c) { c.state.mode = 1; c.say('<b>Мостик Файоля</b>: F и P говорят напрямую, держа начальников в курсе. Принцип единства распорядительства не нарушен.'); } }
    ]
  });

  /* ---------- 5. Хоторнский эксперимент ---------- */
  reg('tu2-hawthorne', {
    title: 'Хоторнский эффект', lead: 'Два цеха: в опытном меняют свет, в контрольном — нет. Столбики — выработка. Смотри: она растёт везде, потому что на людей обратили внимание.',
    radius: 19, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { light: 1, t0: 0 };
      [-4, 4].forEach(function (x, k) {
        c.box3(6.5, 0.2, 5, k ? '#2a3050' : '#33395e', [x, 0, 0], k ? '<b>Контрольный цех</b>: свет не меняли.' : '<b>Опытный цех</b>: свет меняли.');
        c.label(k ? 'контрольная группа' : 'опытная группа', [x, -0.5, 3], 0.5);
        for (var i = 0; i < 4; i++) { c.box3(0.9, 0.9, 0.9, '#c9b6f0', [x - 2.2 + i * 1.45, 0.55, 1.4], 'Работница. Когда с ней советуются, она чувствует себя частью важной группы.'); }
      });
      var lamp = c.mesh(new T.SphereGeometry(0.6, 20, 14), '#fff3b0', '<b>Освещение.</b> Свет ярче — выработка растёт. Свет тусклее — тоже растёт. Значит, дело не в лампах.', { emissive: c.color('#fff3b0'), emissiveIntensity: 1 });
      lamp.position.set(-4, 5.5, 0);
      var pl = new T.PointLight(0xfff0b0, 1.5, 12); pl.position.copy(lamp.position); c.root.add(pl);
      c.bars = [[], []];
      [-4, 4].forEach(function (x, k) {
        for (var i = 0; i < 6; i++) {
          var b = c.box3(0.6, 1, 0.6, k ? '#4cc38a' : '#7aa2ff', [x - 2.2 + i * 0.9, 0.6, -1.4], '<b>Выработка</b> растёт в обоих цехах.');
          c.bars[k].push(b);
        }
      });
      c.onFrame(function (t) {
        var lv = S.light; lamp.material.emissiveIntensity = 0.2 + lv; pl.intensity = 0.3 + lv * 1.5;
        c.bars.forEach(function (row) { row.forEach(function (b, i) { var h = 1 + i * 0.45 + Math.sin(t + i) * 0.05; b.scale.y = h; b.position.y = 0.1 + h / 2; }); });
      });
    },
    chips: [
      { t: 'Свет ярче', small: 'опыт 1', on: function (c) { c.state.light = 1.4; c.say('Свет прибавили — выработка выросла. Но и в контрольном цехе тоже!'); } },
      { t: 'Свет тусклее', small: 'опыт 2', on: function (c) { c.state.light = 0.15; c.say('Свет убавили почти до лунного — а выработка <b>всё равно росла</b>.'); } },
      { t: 'Вывод', small: 'эффект', on: function (c) { c.setView(0.6, 0.9, 13, 1); c.say('<b>Хоторнский эффект</b>: людей мотивирует внимание, участие в решениях и отношения в группе. Отсюда — школа человеческих отношений (Мейо, Ретлисбергер).'); } }
    ]
  });

  /* ---------- 6. Пирамида Маслоу ---------- */
  reg('tu2-maslow', {
    title: 'Пирамида потребностей Маслоу', lead: 'Пять ярусов снизу вверх. Пока нижний ярус не закрыт, верхний мало мотивирует. Нажми на ярус или выбери кнопку.',
    radius: 17, phi: 1.15, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      var L = [['Физиологические', 'еда, сон, тепло → достойная зарплата, условия труда', '#c46a3a'], ['Безопасность', 'стабильность → надёжный контракт, охрана труда', '#f0c36b'], ['Принадлежность', 'группа, дружба → команда, коллектив', '#4cc38a'], ['Уважение', 'признание, статус → похвала, карьерный рост', '#7aa2ff'], ['Самоактуализация', 'реализовать себя → интересные, творческие задачи', '#c9b6f0']];
      c.levels = L.map(function (l, i) {
        var r0 = 5 - i, r1 = 4 - i;
        var m = c.mesh(new T.CylinderGeometry(r1 * 0.95 + 0.05, r0 * 0.95, 1.2, 4), l[2], '<b>' + (i + 1) + '. ' + l[0] + '</b>: ' + l[1] + '.');
        m.rotation.y = Math.PI / 4; m.position.y = 0.6 + i * 1.25;
        c.label(l[0], [0, 0.6 + i * 1.25, r0 * 0.7 + 0.8], 0.45, l[2]);
        return m;
      });
    },
    chips: [
      { t: 'Низ', small: '1–2', on: function (c) { c.pick(c.levels[0]); c.setView(0.3, 1.3, 14, 1); c.say('Голодного не мотивирует похвала. Сначала — <b>зарплата и безопасность</b>. У Херцберга это «гигиенические» факторы: убирают недовольство, но не зажигают.'); } },
      { t: 'Середина', small: '3', on: function (c) { c.pick(c.levels[2]); c.setView(0.3, 1.15, 13, 3); c.say('<b>Принадлежность</b> — то, что открыл Хоторнский эксперимент: важна группа и отношения.'); } },
      { t: 'Верх', small: '4–5', on: function (c) { c.pick(c.levels[4]); c.setView(0.3, 0.9, 12, 5); c.say('<b>Уважение и самоактуализация</b> — у Херцберга «мотиваторы»: признание, рост, интересная работа. По Макгрегору это теория <b>Y</b>.'); } }
    ]
  });

  /* ---------- 7. Ситуационный подход: механистическая vs органическая ---------- */
  reg('tu2-contingency', {
    title: 'Всё зависит от обстоятельств', lead: 'Слева — механистическая структура (жёсткая иерархия), справа — органическая (плоская сеть). Переключай среду: спокойная или бурная. Пол качается — это изменчивость среды.',
    radius: 22, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { storm: 0 };
      var Lg = new T.Group(), Rg = new T.Group(); Lg.position.x = -5; Rg.position.x = 5; c.root.add(Lg); c.root.add(Rg);
      function add(g, geo, col, p, info) { var m = new T.Mesh(geo, c.mat(col)); m.position.set(p[0], p[1], p[2]); m.castShadow = true; m.userData.info = info; g.add(m); return m; }
      var mInfo = '<b>Механистическая структура</b> (Бёрнс и Сталкер): жёсткая иерархия, инструкции. Хороша в <b>стабильной</b> среде.';
      var oInfo = '<b>Органическая структура</b>: плоская, гибкая, горизонтальные связи. Хороша в <b>бурной</b> среде.';
      c.baseL = add(Lg, new T.BoxGeometry(7, 0.3, 6), '#3a4270', [0, 0, 0], 'Среда механистической организации.');
      c.baseR = add(Rg, new T.BoxGeometry(7, 0.3, 6), '#3a4270', [0, 0, 0], 'Среда органической организации.');
      var rows = [1, 2, 4];
      rows.forEach(function (n, lvl) { for (var i = 0; i < n; i++) add(Lg, new T.BoxGeometry(0.9, 0.9, 0.9), '#7aa2ff', [(i - (n - 1) / 2) * 1.5, 5 - lvl * 1.9, 0], mInfo); });
      var pts = [];
      for (var i = 0; i < 7; i++) { var a = i / 7 * Math.PI * 2; pts.push([Math.cos(a) * 2.3, 1 + (i % 2) * 0.6, Math.sin(a) * 2]); add(Rg, new T.SphereGeometry(0.5, 18, 12), '#4cc38a', pts[i], oInfo); }
      for (var j = 0; j < 7; j++) for (var k = j + 1; k < 7; k += 2) {
        var a = V(T, pts[j]), b = V(T, pts[k]), d = b.clone().sub(a), m = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, d.length(), 6), c.mat('#9aa2c0'));
        m.position.copy(a.clone().add(b).multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); Rg.add(m);
      }
      c.label('механистическая', [-5, 7, 0], 0.55, '#7aa2ff');
      c.label('органическая', [5, 4, 0], 0.55, '#4cc38a');
      c.onFrame(function (t) {
        var amp = S.storm ? 0.16 : 0.01;
        [Lg, Rg].forEach(function (g, i) { g.rotation.z = Math.sin(t * 2.2 + i) * amp; g.rotation.x = Math.cos(t * 1.7 + i) * amp; });      });
    },
    chips: [
      { t: 'Стабильная среда', small: 'тихо', on: function (c) { c.state.storm = 0; c.say('В стабильной среде выигрывает <b>механистическая</b> структура: инструкции, порядок, предсказуемость.'); } },
      { t: 'Бурная среда', small: 'шторм', on: function (c) { c.state.storm = 1; c.say('Среда бурлит — жёсткая пирамида шатается. Выигрывает <b>органическая</b>: быстрые горизонтальные связи. Вывод ситуационного подхода: <b>нет одного лучшего способа</b>.'); } },
      { t: 'Моклер', small: '3 шага', on: function (c) { c.setView(0, 1.0, 20, 3); c.say('Модель Моклера: 1) <b>модель ситуации</b> (контекстуальные переменные) → 2) <b>модель связей</b> с организацией → 3) <b>решение</b>. Как у врача: диагноз → механизм → лечение.'); } }
    ]
  });
})();
