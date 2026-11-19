/* 3D-модели: «Теория управления. Лекция 5» — дополнение по презентации «Организация как объект управления».
   В Markdown: @@graph:tu5b-system@@ @@graph:tu5b-criteria@@ @@graph:tu5b-elements@@ @@graph:tu5b-fdm@@
   @@graph:tu5b-mintzberg@@ @@graph:tu5b-public@@ @@graph:tu5b-flat@@ @@graph:tu5b-holacracy@@ */
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
  function paint(obj, col, glow) {
    obj.traverse(function (x) {
      if (!x.material || x.isSprite || !x.material.color) return;
      if (x.geometry && x.geometry.type === 'SphereGeometry' && x.material.color.getHexString() === 'e8c6a0') return;
      x.material.color.set(col);
      if (x.material.emissive) { x.material.emissive.set(glow ? col : '#000000'); x.material.emissiveIntensity = glow ? 0.35 : 0; }
    });
  }
  function ease(cur, goal, k) { return cur + (goal - cur) * (k || 0.08); }

  /* ---------- 1. Организация как социально-техническая система ---------- */
  reg('tu5b-system', {
    title: 'Организация — социально-техническая система', lead: 'Слева входят ресурсы, справа выходят продукция и услуги. Сверху «тянет» цель. Внутри работают <b>люди</b> и <b>техника</b> вместе.',
    radius: 18, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(9);
      var soc = c.box3(2.2, 2.4, 2.6, '#ef8f5b', [-1.15, 1.2, 0], '<b>Социальная часть</b>: люди, их знания, отношения, мотивация, культура.');
      var tec = c.box3(2.2, 2.4, 2.6, '#7aa2ff', [1.15, 1.2, 0], '<b>Техническая часть</b>: оборудование, технологии, процессы, информационные системы.');
      c.label('люди', [-1.15, 2.9, 0], 0.4, '#ef8f5b'); c.label('техника', [1.15, 2.9, 0], 0.4, '#7aa2ff');
      man(c, -1.6, 2.4, 0.5, '#ef8f5b', '<b>Человек</b> в организации — не «ресурс», а участник со своей волей и целями.', 0.7);
      man(c, -0.7, 2.4, 0.5, '#ef8f5b', '<b>Человек</b> в организации.', 0.7);
      var gear = c.mesh(new T.TorusGeometry(0.55, 0.18, 8, 16), '#7aa2ff', '<b>Техника и технологии.</b>'); gear.position.set(1.15, 3.0, 0.6);
      var IN = [['человеческие', '#4cc38a', 0], ['материальные', '#f0c36b', 1], ['информационные', '#c9b6f0', 2]];
      c.inputs = IN.map(function (r, i) {
        var z = (i - 1) * 2.2, geo = i === 0 ? new T.SphereGeometry(0.42, 16, 12) : i === 1 ? new T.BoxGeometry(0.7, 0.7, 0.7) : new T.OctahedronGeometry(0.5);
        var m = c.mesh(geo, r[1], '<b>Вход: ' + r[0] + ' ресурсы.</b> Без них организация не может работать.'); m.position.set(-7, 0.6, z);
        c.label(r[0], [-7, 1.6, z], 0.32, r[1]);
        var cv = U.curve(c, [[-6.4, 0.6, z], [-4.5, 0.9, z * 0.6], [-2.4, 1.2, z * 0.2]]);
        U.tube(c, [[-6.4, 0.6, z], [-4.5, 0.9, z * 0.6], [-2.4, 1.2, z * 0.2]], r[1], 0.05);
        return U.movers(c, cv, r[1], 0.3, 2, 0.16);
      });
      c.label('ресурсы', [-7, 3.2, 0], 0.42, '#ffffff');
      var OUT = [['продукция', '#4cc38a', -1.2], ['услуги', '#f0c36b', 1.2]];
      c.outputs = OUT.map(function (r) {
        var z = r[2], m = c.mesh(r[0] === 'продукция' ? new T.BoxGeometry(0.8, 0.8, 0.8) : new T.SphereGeometry(0.45, 16, 12), r[1], '<b>Выход: ' + r[0] + '.</b> Ради этого организация и существует.');
        m.position.set(7, 0.6, z); c.label(r[0], [7, 1.6, z], 0.34, r[1]);
        var cv = U.curve(c, [[2.4, 1.2, z * 0.2], [4.5, 0.9, z * 0.7], [6.4, 0.6, z]]);
        U.tube(c, [[2.4, 1.2, z * 0.2], [4.5, 0.9, z * 0.7], [6.4, 0.6, z]], r[1], 0.05);
        return U.movers(c, cv, r[1], 0.3, 2, 0.16);
      });
      var goal = c.mesh(new T.OctahedronGeometry(0.7), '#f0c36b', '<b>Цели.</b> Определяют, какие ресурсы брать и что выпускать.', { emissive: c.color('#f0c36b'), emissiveIntensity: 0.4 });
      goal.position.set(0, 6, 0); c.label('цели', [0, 7.1, 0], 0.42, '#f0c36b');
      U.arrow(c, [0, 5.3, 0], [0, 2.7, 0], '#f0c36b', '<b>Цель направляет</b> всю работу системы.');
      c.onFrame(function (t) {
        goal.rotation.y = t; gear.rotation.z = t * 1.5;
        c.inputs.forEach(function (a) { a.forEach(function (s) { s.visible = S.mode !== 2; }); });
        c.outputs.forEach(function (a) { a.forEach(function (s) { s.visible = S.mode !== 0 || true; }); });
        var g = S.mode === 3 ? 1.4 + Math.sin(t * 4) * 0.1 : 1; goal.scale.setScalar(g);
        soc.scale.y = S.mode === 1 ? 1 + Math.sin(t * 3) * 0.06 : 1; tec.scale.y = S.mode === 1 ? 1 + Math.cos(t * 3) * 0.06 : 1;
      });
    },
    chips: [
      { t: 'Входы', small: '3 вида ресурсов', on: function (c) { c.state.mode = 0; c.setView(-0.7, 1.0, 15, 1.5); c.say('На вход организация получает <b>человеческие, материальные и информационные</b> ресурсы. Это слева.'); } },
      { t: 'Внутри', small: 'люди + техника', on: function (c) { c.state.mode = 1; c.setView(0, 1.1, 10, 2); c.say('<b>Социально-техническая</b> система: внутри работают <b>люди</b> (социальная часть) с помощью <b>техники</b> (техническая часть). Одна без другой не работает.'); } },
      { t: 'Выходы', small: 'продукция, услуги', on: function (c) { c.state.mode = 2; c.setView(0.7, 1.0, 15, 1.5); c.say('На выходе — <b>продукция и услуги</b>. Если их никто не берёт, система не нужна.'); } },
      { t: 'Цели', small: 'сверху', on: function (c) { c.state.mode = 3; c.setView(0, 0.8, 17, 3); c.say('<b>Цель</b> — то, ради чего организация создана. Определение со слайда: система, созданная для достижения целей через <b>согласованную деятельность людей</b> и <b>использование ресурсов</b>.'); } }
    ]
  });

  /* ---------- 2. 8 критериев классификации + гибридный ---------- */
  reg('tu5b-criteria', {
    title: 'Одна организация — восемь «срезов»', lead: 'В центре — организация. Вокруг — 8 критериев со слайда. Нажми на кнопку: увидишь, как её описывает каждый критерий. «Гибрид» — комбинация нескольких.',
    radius: 19, phi: 0.9, targetY: 1,
    build: function (c) {
      var T = c.THREE, S = c.state = { on: [] };
      c.ground(9);
      var core = c.mesh(new T.CylinderGeometry(1.4, 1.4, 1.6, 6), '#f0c36b', '<b>Организация.</b> Например, МГУ: государственная, третичный сектор, учреждение, крупная, некоммерческая, общественная (образовательная), бюджетная, формальная.');
      core.position.y = 0.8; c.label('организация', [0, 2.2, 0], 0.42, '#f0c36b');
      var K = [['собственность', 'государственные, муниципальные, общественные, арендные, частные, групповые, смешанные'],
        ['сектор', 'первичный (сырьё), вторичный (обработка), третичный (услуги), IT'],
        ['правовое положение', 'полное товарищество, товарищество на вере, ООО, ОДО, АО, дочерние и зависимые'],
        ['размер', 'крупные, средние, малые'],
        ['прибыль', 'коммерческие, некоммерческие'],
        ['профиль', 'общественные, хозяйственные'],
        ['финансирование', 'бюджетные, внебюджетные'],
        ['регистрация', 'формальные, неформальные']];
      var COL = ['#7aa2ff', '#4cc38a', '#c9b6f0', '#ef8f5b', '#f0c36b', '#e88bb0', '#5fd0d0', '#b0c46b'];
      c.seg = K.map(function (k, i) {
        var a = i / 8 * Math.PI * 2, x = Math.sin(a) * 6, z = Math.cos(a) * 6;
        var m = c.box3(1.6, 0.8, 1.6, COL[i], [x, 0.4, z], '<b>Критерий ' + (i + 1) + ': ' + k[0] + '.</b> Виды: ' + k[1] + '.');
        m.userData.base = COL[i]; c.label(k[0], [x, 1.5, z], 0.34, COL[i]);
        var l = U.link(c, [x * 0.3, 0.8, z * 0.3], [x * 0.85, 0.5, z * 0.85], COL[i], 0.05);
        return { m: m, l: l, x: x, z: z };
      });
      c.onFrame(function (t) {
        c.seg.forEach(function (s, i) {
          var on = S.on.indexOf(i) >= 0, h = on ? 2.2 + Math.sin(t * 3 + i) * 0.15 : 0.8;
          s.m.scale.y = ease(s.m.scale.y, h / 0.8); s.m.position.y = s.m.scale.y * 0.4;
          s.m.material.emissive.set(on ? s.m.userData.base : '#000000'); s.m.material.emissiveIntensity = on ? 0.35 : 0;
          s.l.visible = on;
        });
        core.rotation.y = t * 0.3;
      });
    },
    chips: [
      { t: 'Собственность', small: 'кому принадлежит', on: function (c) { c.state.on = [0]; c.say('<b>По форме собственности</b>: государственные, муниципальные, общественные, арендные, частные, групповые, смешанные.'); } },
      { t: 'Сектор', small: 'сырьё → услуги', on: function (c) { c.state.on = [1]; c.say('<b>По сектору</b>: первичный — добыча (сельское, лесное, рыбное хозяйство, уголь); вторичный — обрабатывающая промышленность; третичный — услуги (банки, страхование, образование); отдельно — IT.'); } },
      { t: 'Право и размер', small: 'ГК, размер', on: function (c) { c.state.on = [2, 3]; c.say('<b>По правовому положению</b>: полное товарищество, товарищество на вере, ООО, ОДО, АО, дочерние и зависимые общества. <b>По размеру</b>: крупные, средние, малые.'); } },
      { t: 'Деньги', small: 'прибыль, бюджет', on: function (c) { c.state.on = [4, 6]; c.say('<b>По отношению к прибыли</b>: коммерческие / некоммерческие. <b>По источникам финансирования</b>: бюджетные / внебюджетные. Не путай: некоммерческая может быть и внебюджетной (частный фонд).'); } },
      { t: 'Профиль, статус', small: '', on: function (c) { c.state.on = [5, 7]; c.say('<b>По профилю</b>: общественные / хозяйственные. <b>По статусу регистрации</b>: формальные (зарегистрированы) / неформальные (кружок, инициативная группа).'); } },
      { t: 'Гибрид', small: '+1 критерий', on: function (c) { c.state.on = [0, 3, 4, 6]; c.say('<b>Гибридная классификация</b> — берёшь несколько критериев и комбинируешь. Например: «государственная + крупная + некоммерческая + бюджетная». Главное — <b>обосновать</b>, зачем выбраны именно эти признаки.'); } }
    ]
  });

  /* ---------- 3. Шесть элементов структуры ---------- */
  reg('tu5b-elements', {
    title: 'Шесть элементов организационной структуры', lead: 'Одна и та же организация: руководитель, три начальника, девять работников. Кнопки показывают каждый элемент структуры по очереди.',
    radius: 18, phi: 1.1, targetY: 2.4,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(8);
      var FC = ['#7aa2ff', '#4cc38a', '#ef8f5b'], FN = ['финансы', 'производство', 'маркетинг'];
      c.top = man(c, 0, 4.6, 0, '#f0c36b', '<b>Руководитель</b> — вершина иерархии.', 1.1);
      c.mid = []; c.low = []; c.links = []; c.frames = []; c.docs = []; c.orbs = [];
      [-4, 0, 4].forEach(function (x, i) {
        var m = man(c, x, 2.4, 0, FC[i], '<b>Начальник отдела «' + FN[i] + '»</b>.', 0.95); m.userData.col = FC[i]; c.mid.push(m);
        c.links.push(U.link(c, [0, 4.6, 0], [x, 3.5, 0], '#9aa2c0', 0.05));
        var fr = c.mesh(new T.BoxGeometry(3.6, 0.06, 2.4), FC[i], '<b>Группировка</b>: отдел «' + FN[i] + '».', { transparent: true, opacity: 0.5 }); fr.position.set(x, 0.05, 0.6); c.frames.push(fr);
        c.label(FN[i], [x, -0.5, 1.9], 0.3, FC[i]);
        [-1.1, 0, 1.1].forEach(function (dx) {
          var w = man(c, x + dx, 0, 0.6, FC[i], '<b>Работник</b> отдела «' + FN[i] + '».', 0.75); w.userData.col = FC[i]; c.low.push(w);
          c.links.push(U.link(c, [x, 2.4, 0], [x + dx, 0.9, 0.6], '#9aa2c0', 0.03));
        });
        var d = c.box3(0.7, 0.9, 0.04, '#ffffff', [x + 1.4, 3.1, 0.3], '<b>Формализация</b>: положение об отделе, должностные инструкции, штатное расписание.'); c.docs.push(d);
      });
      for (var i = 0; i < 4; i++) { var o = U.glow(c, '#f0c36b', 0.18); c.orbs.push(o); }
      c.onFrame(function (t) {
        var m = S.mode;
        c.mid.concat(c.low).forEach(function (p) { paint(p, m === 0 || m === 1 ? p.userData.col : '#9aa2c0', false); });
        c.frames.forEach(function (f) { f.visible = m === 1; });
        c.links.forEach(function (l) { l.material.color.set(m === 2 ? '#f0c36b' : '#9aa2c0'); });
        c.docs.forEach(function (d) { d.visible = m === 5; d.rotation.y = Math.sin(t * 2) * 0.3; });
        c.orbs.forEach(function (o, i) {
          if (m === 3) { var a = t * 1.5 + i * 1.57; o.visible = true; o.position.set(Math.sin(a) * 0.8, 6.1, Math.cos(a) * 0.8); }
          else if (m === 33) { o.visible = i < 3; if (i < 3) o.position.set([-4, 0, 4][i], 3.9 + Math.sin(t * 3 + i) * 0.2, 0); }
          else o.visible = false;
        });
        var k = m === 4 ? 1.25 + Math.sin(t * 4) * 0.08 : 1; c.mid[1].scale.setScalar(k);
        c.low.forEach(function (w, i) { if (m === 4 && i >= 3 && i < 6) paint(w, '#ef6b5b', true); });
      });
    },
    chips: [
      { t: 'Специализация', small: '1', on: function (c) { c.state.mode = 0; c.setView(0, 1.1, 15, 2.2); c.say('<b>1. Разделение труда и специализация.</b> Каждый делает своё: цвет — профессия. Финансист не стоит у станка, инженер не ведёт бухгалтерию.'); } },
      { t: 'Группировка', small: '2', on: function (c) { c.state.mode = 1; c.setView(0.2, 0.75, 15, 1); c.say('<b>2. Группировка деятельности</b>: людей объединяют в департаменты — по функциям, регионам, продуктам. Здесь — по функциям.'); } },
      { t: 'Иерархия', small: '3', on: function (c) { c.state.mode = 2; c.setView(0, 1.25, 15, 2.6); c.say('<b>3. Иерархия</b> — цепь командования: кто кому подчиняется. Золотые линии — порядок подчинения сверху вниз.'); } },
      { t: 'Централизация', small: '4', on: function (c) { c.state.mode = 3; c.setView(0, 1.0, 14, 4); c.say('<b>4. Централизация</b>: все решения (золотые шарики) — у руководителя наверху. Нажми «Децентрализация», чтобы отдать их вниз.'); } },
      { t: 'Децентрализация', small: '4', on: function (c) { c.state.mode = 33; c.setView(0, 1.0, 14, 3); c.say('<b>Децентрализация</b>: право решать передано начальникам отделов. Решения быстрее и ближе к делу, но сложнее координировать.'); } },
      { t: 'Ширина контроля', small: '5', on: function (c) { c.state.mode = 4; c.setView(0, 1.0, 10, 1.6); c.say('<b>5. Ширина контроля</b> (норма управляемости) — сколько подчинённых у одного руководителя. У этого начальника — трое (красные).'); } },
      { t: 'Формализация', small: '6', on: function (c) { c.state.mode = 5; c.setView(0.3, 1.0, 13, 2.6); c.say('<b>6. Формализация</b> — насколько правила и процедуры записаны: положения об отделах, должностные инструкции, штатное расписание (белые листы).'); } }
    ]
  });

  /* ---------- 4. Функциональная — дивизиональная — матричная ---------- */
  reg('tu5b-fdm', {
    title: 'Функции и продукты: три способа сложить одно и то же', lead: 'Слева — функциональная (сначала функции, внутри продукты). В центре — дивизиональная (наоборот). Справа — матрица: оба деления сразу.',
    radius: 24, phi: 1.0, targetY: 2,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(13);
      var FC = ['#7aa2ff', '#5fd0d0', '#c9b6f0'], PC = ['#ef8f5b', '#f0c36b', '#4cc38a'];
      function tree(x0, topCols, botCols, topName, botName, title) {
        var g = [];
        g.push(c.box3(1.6, 0.6, 1, '#ffffff', [x0, 5, 0], '<b>' + title + '</b>: руководитель.'));
        [-2.2, 0, 2.2].forEach(function (dx, i) {
          g.push(c.box3(1.3, 0.6, 1, topCols[i], [x0 + dx, 3.2, 0], '<b>' + topName + ' ' + (i + 1) + '</b> — верхний уровень деления.'));
          g.push(U.link(c, [x0, 4.7, 0], [x0 + dx, 3.5, 0], '#9aa2c0', 0.04));
          [-0.6, 0, 0.6].forEach(function (ddx, j) {
            g.push(c.box3(0.5, 0.5, 0.5, botCols[j], [x0 + dx + ddx, 1.4, 0], '<b>' + botName + ' ' + (j + 1) + '</b> внутри подразделения «' + topName + ' ' + (i + 1) + '».'));
            g.push(U.link(c, [x0 + dx, 2.9, 0], [x0 + dx + ddx, 1.65, 0], '#9aa2c0', 0.025));
          });
        });
        c.label(title, [x0, 6.3, 0], 0.4, '#ffffff');
        return g;
      }
      c.A = tree(-9, FC, PC, 'Функция', 'Продукт', 'функциональная');
      c.B = tree(0, PC, FC, 'Продукт', 'Функция', 'дивизиональная');
      c.M = [];
      for (var i = 0; i < 3; i++) {
        c.M.push(c.box3(0.5, 3.6, 0.5, FC[i], [7 + i * 1.6, 2.9, -1.6], '<b>Функция ' + (i + 1) + '</b> — вертикаль матрицы.'));
        c.M.push(c.box3(4.6, 0.5, 0.5, PC[i], [8.6, 4.4 - i * 1.4, -0.3], '<b>Продукт (проект) ' + (i + 1) + '</b> — горизонталь матрицы.'));
        for (var j = 0; j < 3; j++) {
          var cell = man(c, 7 + j * 1.6, 3.85 - i * 1.4, 0.4, '#e6e6f0', '<b>Сотрудник</b> на пересечении функции ' + (j + 1) + ' и продукта ' + (i + 1) + ': у него <b>два руководителя</b>.', 0.45);
          c.M.push(cell);
        }
      }
      c.label('матричная', [8.6, 6.3, 0], 0.4, '#ffffff');
      c.onFrame(function (t) {
        [c.A, c.B, c.M].forEach(function (grp, k) {
          var on = S.mode === 0 || S.mode === k + 1;
          grp.forEach(function (o) { o.traverse(function (x) { if (x.material && !x.isSprite) { x.material.transparent = !on; x.material.opacity = on ? 1 : 0.18; } }); });
        });
      });
    },
    chips: [
      { t: 'Все три', small: 'сравнить', on: function (c) { c.state.mode = 0; c.setView(0, 1.0, 24, 2); c.say('Одни и те же «кирпичики» — <b>функции</b> (синие оттенки) и <b>продукты</b> (тёплые цвета). Разница только в том, что стоит <b>наверху</b>.'); } },
      { t: 'Функциональная', small: 'Ф → П', on: function (c) { c.state.mode = 1; c.setView(-0.35, 1.0, 13, 2.6); c.say('<b>Функциональная</b>: наверху — функции (финансы, производство, маркетинг). Внутри каждой может быть продуктовое или региональное деление.'); } },
      { t: 'Дивизиональная', small: 'П → Ф', on: function (c) { c.state.mode = 2; c.setView(0, 1.0, 13, 2.6); c.say('<b>Дивизиональная</b>: наверху — продукты (или регионы). Внутри каждого дивизиона — своя <b>функциональная</b> структура. Отсюда минус: функции <b>дублируются</b>.'); } },
      { t: 'Матричная', small: 'Ф × П', on: function (c) { c.state.mode = 3; c.setView(0.35, 1.05, 12, 2.8); c.say('<b>Матричная</b> = функциональная + дивизиональная одновременно. Каждый сотрудник на пересечении: функциональный начальник + руководитель проекта.'); } }
    ]
  });

  /* ---------- 5. Минцберг: 5 частей и 6 конфигураций ---------- */
  reg('tu5b-mintzberg', {
    title: 'Минцберг: какая часть организации «тянет одеяло»', lead: 'Классическая схема Минцберга: вершина, средняя линия, операционное ядро, по бокам — техноструктура и вспомогательный персонал, вокруг — идеология. Выбери тип структуры — главная часть вырастет.',
    radius: 18, phi: 1.15, targetY: 2.8,
    build: function (c) {
      var T = c.THREE, S = c.state = { k: -1 };
      c.ground(8);
      var P = [];
      P.push(c.mesh(new T.CylinderGeometry(0.4, 1.6, 1.4, 24), '#f0c36b', '<b>Стратегическая вершина</b> — высшее руководство. Главная в <b>простой структуре</b>.')); P[0].position.set(0, 6.2, 0);
      P.push(c.mesh(new T.CylinderGeometry(0.55, 0.55, 2.6, 18), '#7aa2ff', '<b>Средняя линия</b> — менеджеры среднего звена. Главная в <b>дивизиональной форме</b>.')); P[1].position.set(0, 4.1, 0);
      P.push(c.mesh(new T.CylinderGeometry(3.2, 3.4, 1.4, 32), '#4cc38a', '<b>Операционное ядро</b> — те, кто делает основную работу (врачи, учителя, рабочие). Главное в <b>профессиональной бюрократии</b>.')); P[2].position.set(0, 2.1, 0);
      P.push(c.mesh(new T.SphereGeometry(1.2, 20, 14), '#c9b6f0', '<b>Техноструктура</b> — аналитики, которые пишут стандарты и правила (плановики, нормировщики). Главная в <b>машинной бюрократии</b>.')); P[3].position.set(-3.4, 4.2, 0); P[3].scale.set(1, 1.4, 0.8);
      P.push(c.mesh(new T.SphereGeometry(1.2, 20, 14), '#ef8f5b', '<b>Вспомогательный персонал</b> — юристы, PR, IT-поддержка, столовая. Главный в <b>адхократии</b>.')); P[4].position.set(3.4, 4.2, 0); P[4].scale.set(1, 1.4, 0.8);
      var aura = c.mesh(new T.TorusGeometry(5.2, 0.12, 8, 80), '#e88bb0', '<b>Идеология</b> — общие ценности, «дух» организации. Главная в <b>миссионерской форме</b>.', { emissive: c.color('#e88bb0'), emissiveIntensity: 0.3 });
      aura.position.y = 4; P.push(aura);
      P.forEach(function (p) { p.userData.s0 = p.scale.clone(); });
      c.label('вершина', [0, 7.5, 0], 0.36, '#f0c36b'); c.label('средняя линия', [1.9, 4.6, 0.8], 0.3, '#7aa2ff');
      c.label('операционное ядро', [0, 0.6, 3.4], 0.34, '#4cc38a'); c.label('техноструктура', [-3.4, 6.2, 0], 0.32, '#c9b6f0');
      c.label('вспомогательные', [3.4, 6.2, 0], 0.32, '#ef8f5b'); c.label('идеология', [5.4, 5.2, 0], 0.32, '#e88bb0');
      c.onFrame(function (t) {
        P.forEach(function (p, i) {
          var on = S.k === i, k = on ? 1.45 + Math.sin(t * 4) * 0.06 : (S.k < 0 ? 1 : 0.85);
          p.scale.set(p.userData.s0.x * ease(p.scale.x / p.userData.s0.x, k), p.userData.s0.y * ease(p.scale.y / p.userData.s0.y, k), p.userData.s0.z * ease(p.scale.z / p.userData.s0.z, k));
          p.material.emissiveIntensity = on ? 0.5 : (i === 5 ? 0.3 : 0);
          if (p.material.emissive && i !== 5) p.material.emissive.set(on ? p.material.color : '#000000');
        });
        aura.rotation.z = t * 0.2; aura.rotation.x = Math.PI / 2 + Math.sin(t) * 0.1;
      });
    },
    chips: [
      { t: 'Простая', small: 'вершина', on: function (c) { c.state.k = 0; c.say('<b>Простая структура</b>: главная — <b>стратегическая вершина</b>, стремление к <b>централизации</b>. Пример: маленькая фирма, где всё решает владелец.'); } },
      { t: 'Машинная бюр.', small: 'техноструктура', on: function (c) { c.state.k = 3; c.say('<b>Машинная бюрократия</b>: во главе — <b>техноструктура</b>, стремление к <b>стандартизации</b>. Пример: завод, почта, фастфуд — всё по инструкциям.'); } },
      { t: 'Проф. бюр.', small: 'операц. ядро', on: function (c) { c.state.k = 2; c.say('<b>Профессиональная бюрократия</b>: власть у <b>операционного ядра</b>, ценнее всего — <b>профессионализм</b>. Пример: больница, университет.'); } },
      { t: 'Дивизиональная', small: 'средняя линия', on: function (c) { c.state.k = 1; c.say('<b>Дивизиональная форма</b>: главная — <b>средняя линия</b>, растёт роль среднего звена (руководители дивизионов).'); } },
      { t: 'Адхократия', small: 'вспомогательные', on: function (c) { c.state.k = 4; c.say('<b>Адхократия</b>: главный — <b>вспомогательный персонал</b>, стремление к <b>сотрудничеству с внешними</b> организациями. Команды собираются под задачу.'); } },
      { t: 'Миссионерская', small: 'идеология', on: function (c) { c.state.k = 5; c.say('<b>Миссионерская форма</b>: во главе — <b>ценности и идеология</b>. Людей держит не приказ, а общая идея.'); } }
    ]
  });

  /* ---------- 6. Публичная организация: от Вебера к сети ---------- */
  reg('tu5b-public', {
    title: 'Госорган: от бюрократической пирамиды к сети партнёрства', lead: 'Сначала — пирамида Вебера: жёсткая иерархия и процедуры. Потом структура «раскрывается» навстречу бизнесу, НКО и гражданам.',
    radius: 20, phi: 1.05, targetY: 2.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(10);
      c.blocks = [];
      var rows = [[0], [-1.5, 1.5], [-3, 0, 3], [-4.5, -1.5, 1.5, 4.5]];
      rows.forEach(function (r, lvl) {
        r.forEach(function (x) {
          var b = c.box3(1.3, 0.8, 1.3, lvl === 0 ? '#f0c36b' : '#7aa2ff', [x, 6 - lvl * 1.6, 0], lvl === 0 ? '<b>Руководитель ведомства.</b>' : '<b>Подразделение</b> ведомства.');
          b.userData.p0 = [x, 6 - lvl * 1.6, 0]; var a = (c.blocks.length / 10) * Math.PI * 2; b.userData.p1 = lvl === 0 ? [0, 1.6, 0] : [Math.sin(a) * 3.2, 1.2, Math.cos(a) * 3.2];
          c.blocks.push(b);
        });
      });
      var docs = []; for (var i = 0; i < 6; i++) { var d = c.box3(0.6, 0.8, 0.04, '#ffffff', [-6 + i * 0.25, 1 + i * 0.12, 1.5], '<b>Процедуры и отчётность</b>: высокая формализация.'); docs.push(d); }
      c.docs = docs;
      var P = [['бизнес', '#4cc38a'], ['НКО', '#ef8f5b'], ['граждане', '#e88bb0'], ['другие ведомства', '#c9b6f0'], ['СМИ, общ. контроль', '#5fd0d0']];
      c.part = P.map(function (p, i) {
        var a = i / P.length * Math.PI * 2 + 0.3, x = Math.sin(a) * 8, z = Math.cos(a) * 8;
        var m = c.mesh(new T.SphereGeometry(0.75, 18, 12), p[1], '<b>' + p[0] + '</b> — заинтересованная сторона и партнёр по сети.'); m.position.set(x, 1, z);
        var lb = c.label(p[0], [x, 2.3, z], 0.36, p[1]);
        var l = U.link(c, [x * 0.45, 1.2, z * 0.45], [x * 0.9, 1, z * 0.9], p[1], 0.06);
        return { m: m, l: l };
      });
      var mission = c.mesh(new T.TorusGeometry(1, 0.08, 8, 40), '#f0c36b', '<b>Миссия — общественное служение.</b>', { emissive: c.color('#f0c36b'), emissiveIntensity: 0.6 }); mission.position.y = 7.2;
      c.onFrame(function (t) {
        var net = S.mode === 2 ? 1 : 0;
        c.blocks.forEach(function (b) { var p0 = b.userData.p0, p1 = b.userData.p1; b.position.x = ease(b.position.x, net ? p1[0] : p0[0], 0.05); b.position.y = ease(b.position.y, net ? p1[1] : p0[1], 0.05); b.position.z = ease(b.position.z, net ? p1[2] : p0[2], 0.05); });
        c.docs.forEach(function (d, i) { d.visible = S.mode === 0; d.rotation.z = Math.sin(t + i) * 0.1; });
        c.part.forEach(function (p, i) { var on = S.mode >= 1; p.m.scale.setScalar(on ? 1 + Math.sin(t * 2 + i) * 0.08 : 0.6); p.l.visible = S.mode === 2; });
        mission.rotation.y = t; mission.position.y = S.mode === 2 ? 3.4 : 7.2;
      });
    },
    chips: [
      { t: 'Бюрократия', small: 'Вебер', on: function (c) { c.state.mode = 0; c.setView(0, 1.1, 18, 3); c.say('<b>Традиционная бюрократическая структура</b> (Макс Вебер): жёсткая иерархия, чёткая власть, процедуры. Внутренняя среда: <b>высокая формализация</b>, ориентация на <b>процедуры и отчётность</b>.'); } },
      { t: 'Среда', small: 'стейкхолдеры', on: function (c) { c.state.mode = 1; c.setView(0.4, 0.8, 22, 2); c.say('Вокруг — <b>множество заинтересованных сторон</b>: граждане, бизнес, НКО, другие ведомства, СМИ. Политическая среда (партии, выборы), общественные ожидания, <b>общественный контроль</b>.'); } },
      { t: 'Сеть', small: 'партнёрство', on: function (c) { c.state.mode = 2; c.setView(0.2, 0.75, 22, 1.5); c.say('Современная адаптация: <b>сетевые, проектные, гибридные</b> структуры партнёрства — взаимодействие власти с бизнесом, НКО, институтами гражданского общества. «Цифровое правительство» — горизонтальное и межведомственное.'); } }
    ]
  });

  /* ---------- 7. Высокая vs плоская ---------- */
  reg('tu5b-flat', {
    title: 'Высокая и плоская структура: сколько этажей пройдёт решение', lead: 'Слева — высокая структура (пример со слайда — коммерческий банк, 5 уровней). Справа — плоская (2 уровня). Шарик — решение, которое идёт от работника наверх и обратно.',
    radius: 22, phi: 1.1, targetY: 3,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0 };
      c.ground(11);
      var names = ['президент', 'вице-президенты', 'директора департ.', 'начальники управл.', 'начальники отделов'];
      var tall = [];
      names.forEach(function (n, i) {
        var w = 1 + i * 0.9, b = c.box3(w, 0.7, 1.2, i === 0 ? '#f0c36b' : '#7aa2ff', [-5.5, 7.2 - i * 1.6, 0], '<b>' + n + '</b> — уровень ' + (i + 1) + ' из 5.'); tall.push(b);
        c.label(n, [-5.5 - w / 2 - 1.8, 7.2 - i * 1.6, 0], 0.28, '#9aa2c0');
        if (i) U.link(c, [-5.5, 7.2 - (i - 1) * 1.6 - 0.35, 0], [-5.5, 7.2 - i * 1.6 + 0.35, 0], '#9aa2c0', 0.05);
      });
      var work1 = man(c, -5.5, 0, 0, '#4cc38a', '<b>Исполнитель</b> в высокой структуре.', 0.8);
      U.link(c, [-5.5, 0.9, 0], [-5.5, 0.9 + 0.3 + 0.45, 0], '#9aa2c0', 0.05);
      var flatTop = c.box3(1.6, 0.7, 1.2, '#f0c36b', [5.5, 4.2, 0], '<b>Президент</b> плоской структуры.');
      var dirs = ['сбыт', 'маркетинг', 'финансы'].map(function (n, i) {
        var x = 3 + i * 2.5, b = c.box3(1.6, 0.7, 1.2, '#7aa2ff', [x, 2.4, 0], '<b>Директор: ' + n + '</b>. Сразу под президентом.');
        U.link(c, [5.5, 3.85, 0], [x, 2.75, 0], '#9aa2c0', 0.05); c.label(n, [x, 1.6, 0.8], 0.28, '#7aa2ff'); return b;
      });
      var work2 = man(c, 5.5, 0, 0.3, '#4cc38a', '<b>Исполнитель</b> в плоской структуре.', 0.8);
      U.link(c, [5.5, 2.05, 0], [5.5, 0.9, 0.3], '#9aa2c0', 0.04);
      c.label('высокая', [-5.5, 8.6, 0], 0.44, '#ffffff'); c.label('плоская', [5.5, 5.6, 0], 0.44, '#ffffff');
      var cv1 = U.curve(c, [[-5.3, 0.9, 0.7], [-5.3, 4, 0.7], [-5.3, 7.2, 0.7], [-5.7, 4, 0.7], [-5.7, 0.9, 0.7]]);
      var cv2 = U.curve(c, [[5.7, 0.9, 0.7], [5.7, 2.4, 0.7], [5.6, 4.2, 0.7], [5.3, 2.4, 0.7], [5.3, 0.9, 0.7]]);
      var o1 = U.glow(c, '#ef6b5b', 0.22), o2 = U.glow(c, '#ef6b5b', 0.22);
      var t1 = 0, t2 = 0;
      c.onFrame(function (t) {
        var run = S.mode === 2;
        if (run) { t1 = (t1 + 0.0035) % 1; t2 = (t2 + 0.0035 * 2.6) % 1; }
        o1.visible = o2.visible = run; o1.position.copy(cv1.getPointAt(t1)); o2.position.copy(cv2.getPointAt(t2));
        tall.forEach(function (b, i) { b.material.emissive.set(S.mode === 0 ? '#7aa2ff' : '#000000'); b.material.emissiveIntensity = S.mode === 0 ? 0.25 + Math.sin(t * 3 - i) * 0.15 : 0; });
        dirs.concat([flatTop]).forEach(function (b) { b.material.emissive.set(S.mode === 1 ? '#4cc38a' : '#000000'); b.material.emissiveIntensity = S.mode === 1 ? 0.3 : 0; });
      });
    },
    chips: [
      { t: 'Высокая', small: '5 уровней', on: function (c) { c.state.mode = 0; c.setView(-0.4, 1.05, 15, 4); c.say('<b>Высокая структура</b> (коммерческий банк): президент → вице-президенты → директора департаментов → начальники управлений → начальники отделов. Много этажей — у каждого начальника мало подчинённых.'); } },
      { t: 'Плоская', small: '2 уровня', on: function (c) { c.state.mode = 1; c.setView(0.4, 1.05, 13, 2.5); c.say('<b>Плоская структура</b> (горизонтальная, процессная): минимум промежуточных руководителей. Уровней меньше, <b>зоны контроля шире</b>, команды автономнее.'); } },
      { t: 'Гонка решений', small: 'скорость', on: function (c) { c.state.mode = 2; c.setView(0, 1.05, 22, 3); c.say('Шарик — вопрос от работника, на который нужен ответ сверху. В плоской структуре он возвращается <b>гораздо быстрее</b>: плюсы — скорость, меньше бюрократии, выше вовлечённость. Риск — проблемы с <b>координацией, стандартизацией, контролем</b>.'); } }
    ]
  });

  /* ---------- 8. Холакратия: круги вместо пирамиды ---------- */
  reg('tu5b-holacracy', {
    title: 'Холакратия: круги и роли вместо пирамиды', lead: 'Большой круг — вся организация. Внутри — круги-команды, в них — роли (шарики). Один человек может держать роли в нескольких кругах. Сравни с пирамидой.',
    radius: 20, phi: 0.95, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 1 };
      c.ground(10);
      var big = c.mesh(new T.TorusGeometry(7.5, 0.12, 8, 100), '#f0c36b', '<b>Главный круг</b> — вся организация и её цель.'); big.rotation.x = Math.PI / 2; big.position.y = 0.3;
      var CC = [['продукт', '#7aa2ff', -3.3, -1.5], ['маркетинг', '#4cc38a', 3.3, -1.5], ['операции', '#ef8f5b', 0, 3.6]];
      c.circles = CC.map(function (q) {
        var r = c.mesh(new T.TorusGeometry(2.4, 0.09, 8, 60), q[1], '<b>Круг «' + q[0] + '»</b> — самоуправляемая команда. Сама распределяет роли и решает, как работать.'); r.rotation.x = Math.PI / 2; r.position.set(q[2], 0.3, q[3]);
        c.label(q[0], [q[2], 1.6, q[3] + 2.6], 0.36, q[1]);
        var roles = [0, 1, 2].map(function (k) { var a = k / 3 * Math.PI * 2, m = c.mesh(new T.SphereGeometry(0.4, 16, 12), q[1], '<b>Роль</b> в круге «' + q[0] + '»: не должность, а зона ответственности.'); m.position.set(q[2] + Math.sin(a) * 1.3, 0.6, q[3] + Math.cos(a) * 1.3); return m; });
        return { r: r, roles: roles, x: q[2], z: q[3], col: q[1] };
      });
      var p = man(c, 0, 0, 0, '#e88bb0', '<b>Человек</b> держит роли в двух кругах сразу — «продукт» и «маркетинг».', 0.9);
      c.p = p;
      c.l1 = U.link(c, [0, 0.8, 0], [-3.3 + Math.sin(Math.PI * 2 / 3) * 1.3, 0.6, -1.5 + Math.cos(Math.PI * 2 / 3) * 1.3], '#e88bb0', 0.04);
      c.l2 = U.link(c, [0, 0.8, 0], [3.3 + Math.sin(Math.PI * 4 / 3) * 1.3, 0.6, -1.5 + Math.cos(Math.PI * 4 / 3) * 1.3], '#e88bb0', 0.04);
      c.pyr = [];
      [[0, 6.5], [-2, 4.8], [2, 4.8], [-3, 3.1], [-1, 3.1], [1, 3.1], [3, 3.1]].forEach(function (q, i) { c.pyr.push(c.box3(1.1, 0.6, 1.1, i ? '#9aa2c0' : '#f0c36b', [q[0] - 12, q[1], 0], '<b>Традиционная пирамида</b>: должности и подчинение.')); });
      c.onFrame(function (t) {
        var circ = S.mode !== 0;
        c.circles.forEach(function (q, i) { q.r.visible = circ; q.roles.forEach(function (r, k) { r.visible = circ; r.position.y = 0.6 + Math.sin(t * 2 + k + i) * 0.15; }); q.r.rotation.z = t * 0.2 * (i % 2 ? 1 : -1); });
        big.visible = circ; p.visible = c.l1.visible = c.l2.visible = S.mode === 2;
        c.pyr.forEach(function (b) { b.visible = S.mode === 0; });
      });
    },
    chips: [
      { t: 'Пирамида', small: 'как было', on: function (c) { c.state.mode = 0; c.setView(-0.9, 1.05, 14, 4, -12, 0); c.say('Привычная <b>иерархия</b>: должности, начальники, цепь подчинения.'); } },
      { t: 'Круги', small: 'холакратия', on: function (c) { c.state.mode = 1; c.setView(0, 0.8, 18, 1, 0, 0); c.say('<b>Холакратия</b>: децентрализованное управление, автономные команды — «круги», минимум традиционной иерархии. Круги вложены друг в друга.'); } },
      { t: 'Роли', small: 'один — много ролей', on: function (c) { c.state.mode = 2; c.setView(0.3, 0.9, 13, 1, 0, 0); c.say('Вместо должности — <b>роли</b>. Один человек (розовый) может держать роли в разных кругах. Похожие модели: <b>социократия</b> и <b>Shared Governance</b> — решения принимают совместно, больше горизонтальных связей.'); } }
    ]
  });
})();
