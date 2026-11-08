/* 3D-модели к конспекту «Экономика. Потребности и ресурсы, факторы производства, эффективность, КПВ».
   В Markdown: @@graph:o3-maslow3d@@ @@graph:o3-needs3d@@ @@graph:o3-factors3d@@ @@graph:o3-efficiency3d@@ @@graph:o3-ratios3d@@
   @@graph:o3-ppf3d@@ @@graph:o3-altcost3d@@ @@graph:o3-pareto3d@@ @@graph:o3-diminish3d@@
   Нужен lib/ekonomika-osnovy-kit.js (window.OsnovyKit). */
(function () {
  'use strict';
  var K = window.OsnovyKit;
  if (!K) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, house = K.house, factory = K.factory;

  /* КПВ: y = Ymax * sqrt(1 - (x/Xmax)^2) — выгнута наружу */
  function ppfY(x, X, Y) { var k = Math.min(1, Math.max(0, x / X)); return Y * Math.sqrt(1 - k * k); }

  /* ======================= 1. Пирамида Маслоу ======================= */
  var MAS = [
    ['физиологические', C.RED, '<b>I. Физиологические</b> (жизнеобеспечение): еда, вода, сон, тепло.'],
    ['безопасность', C.ORANGE, '<b>II. Безопасность</b> (экзистенциальные): жильё, стабильный доход, здоровье, защищённость.'],
    ['социальные контакты', C.GOLD, '<b>III. Социальные контакты:</b> семья, друзья, принадлежность к группе.'],
    ['уважение', C.GREEN, '<b>IV. Уважение:</b> признание, статус, самоуважение.'],
    ['самореализация', C.PURPLE, '<b>V. Самореализация:</b> раскрыть способности, творить, «стать тем, кем можешь».']
  ];
  reg('o3-maslow3d', {
    title: 'Пирамида потребностей Маслоу', lead: 'Пять ступеней. Человечек поднимается выше, только когда нижняя ступень «наполнена». Нажми «Подниматься», чтобы пройти путь, или выбери ступень.',
    radius: 14, phi: 1.05, theta: 0.5, targetY: 2.0, height: 460, hint: 'Нажми на ступень или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var steps = MAS.map(function (m, i) {
        var r0 = 4.2 - i * 0.8, r1 = r0 - 0.8;
        var s = c.mesh(new T.CylinderGeometry(r1 * 0.72, r0 * 0.72, 0.9, 4), m[1], m[2]); s.rotation.y = Math.PI / 4; s.position.y = 0.45 + i * 0.9;
        c.label(m[0], [0, 0.55 + i * 0.9, r0 * 0.55 + 0.4], 0.17);
        return s;
      });
      var hiker = person(c, 0, 2.5, C.BLUE, '<b>Человек</b> поднимается по пирамиде.', null, 0.7);
      c.S = { lvl: -1 };
      c.onFrame(function (t) {
        var L = c.S.lvl < 0 ? Math.floor((t * 0.35) % 5) : c.S.lvl;
        var r = (4.2 - L * 0.8 - 0.4) * 0.55;
        hiker.position.x = K.lerp(hiker.position.x, 0, 0.05); hiker.position.z = K.lerp(hiker.position.z, r, 0.05);
        hiker.position.y = K.lerp(hiker.position.y, 0.9 + L * 0.9, 0.05);
        steps.forEach(function (s, i) { s.material.emissive.set(i <= L ? MAS[i][1] : '#000000'); s.material.emissiveIntensity = i === L ? 0.45 + 0.2 * Math.sin(t * 4) : 0.15; });
      });
    },
    chips: [{ t: 'Подниматься', on: function (c) { c.S.lvl = -1; c.say('Сначала удовлетворяются нижние потребности, потом верхние. Голодному не до самореализации.'); } }].concat(
      MAS.map(function (m, i) { return { t: ['I', 'II', 'III', 'IV', 'V'][i] + '. ' + m[0].split(' ')[0], on: function (c) { c.S.lvl = i; c.setView(0.5, 1.0, 10, 0.9 + i * 0.9, 0, 0); c.say(m[2]); } }; }))
  });

  /* ======================= 2. Потребности растут, ресурсы ограничены ======================= */
  reg('o3-needs3d', {
    autorotate: false,
    title: 'Потребности безграничны, ресурсы ограничены', lead: 'Шар — потребности, он всё время раздувается (закон возвышения потребностей). Ящик — ресурсы, его размер почти не меняется. Разница между ними и есть ограниченность.',
    radius: 14, phi: 1.0, theta: 0.3, targetY: 1.8, height: 430, hint: 'Нажми на кнопку-этап.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var iN = '<b>Потребности</b> могут расти безгранично — действует всеобщий экономический закон возвышения потребностей.';
      var ball = c.mesh(new T.SphereGeometry(1, 32, 22), C.PURPLE, iN, { transparent: true, opacity: 0.55, emissive: C.PURPLE, emissiveIntensity: 0.25 }); ball.position.set(-2.4, 2, 0);
      c.label('потребности', [-2.4, 4.6, 0], 0.24, '#a78bfa');
      var iR = '<b>Ресурсы</b> ограничены: общество может предложить меньше ресурсов, чем готовы потребить люди.';
      var box = c.box3(2, 2, 2, C.WOOD, [2.6, 1, 0], iR);
      for (var i = 0; i < 4; i++) { var cc = coin(c, 2.6 - 0.5 + (i % 2) * 1.0, 2.07, -0.4 + Math.floor(i / 2) * 0.8, iR, null, 0.3); }
      c.label('ресурсы', [2.6, 3.4, 0], 0.24, '#e39b5b');
      var stages = ['телефон', 'мобильник с камерой', 'смартфон', 'смартфон с ИИ'];
      var lab = c.label('хочу: телефон', [-2.4, 0.4, 2.2], 0.2, '#f0c36b');
      c.S = { st: -1, lab: lab, stages: stages };
      c.onFrame(function (t) {
        var s = c.S.st < 0 ? (t * 0.25) % 4 : c.S.st;
        var r = 0.8 + s * 0.45; ball.scale.setScalar(K.lerp(ball.scale.x, r, 0.05)); ball.position.y = 0.2 + ball.scale.x;
        ball.rotation.y = t * 0.3;
      });
    },
    chips: [0, 1, 2, 3].map(function (i) {
      return { t: ['1990-е', '2005', '2015', 'сейчас'][i], on: function (c) { c.S.st = i; c.say('Хочу: <b>' + c.S.stages[i] + '</b>. Удовлетворили одну потребность — появилась следующая, «выше». А ресурсов (денег, металлов, времени) почти не прибавилось.'); } };
    }).concat([{ t: 'Вывод', on: function (c) { c.S.st = -1; c.say('<b>Главная проблема экономики:</b> потребности безграничны, ресурсы ограничены. Поэтому приходится <b>выбирать</b> — а у выбора есть альтернативные издержки.'); } }])
  });

  /* ======================= 3. Факторы производства ======================= */
  var FAC = [
    { t: 'земля', col: C.TEA, info: '<b>Земля</b> — невоспроизводимый фактор производства. Обобщающее понятие: все природные ресурсы (почва, лес, нефть, вода, руда). Доход — <b>рента</b> [ДОБАВЛЕНО].', icon: function (c, g) { K.tree(c, -0.3, 0, FAC[0].info, g, 0.8); K.tree(c, 0.35, 0.2, FAC[0].info, g, 0.6); } },
    { t: 'труд', col: C.BLUE, info: '<b>Труд</b> — использование физических и умственных способностей людей для производства благ; целесообразная деятельность, направленная на результат. Доход — <b>заработная плата</b> [ДОБАВЛЕНО].', icon: function (c, g) { person(c, 0, 0, C.BLUE, FAC[1].info, g, 0.9); } },
    { t: 'капитал', col: C.SILVER, info: '<b>Капитал</b> — то, что приносит доход: станки, здания, машины. Доход — <b>процент</b> [ДОБАВЛЕНО].', icon: function (c, g) { K.gear(c, 0, 0.6, 0, C.SILVER, FAC[2].info, g, 0.9); } },
    { t: 'предпринима-\nтельство', col: C.GOLD, info: '<b>Предпринимательство</b> — фактор, который ввёл <b>Йозеф Шумпетер</b>. Предприниматель соединяет остальные факторы, придумывает новое и рискует. Доход — <b>прибыль</b> [ДОБАВЛЕНО].', icon: function (c, g) { var b = K.glow(c, C.GOLD, 0.3, FAC[3].info); b.position.y = 0.9; g.add(b); g.add(c.link([0, 0, 0], [0, 0.6, 0], C.SILVER, 0.08, FAC[3].info)); } },
    { t: 'информация', col: C.PURPLE, info: '<b>Информация</b> — новый фактор производства: данные, знания, технологии.', icon: function (c, g) { for (var i = 0; i < 3; i++) g.add(c.box3(0.7, 0.12, 0.5, i % 2 ? C.PURPLE : C.DARK, [0, 0.1 + i * 0.16, 0], FAC[4].info)); } },
    { t: 'время', col: C.ORANGE, info: '<b>Время</b> — один из возможных факторов производства: его тоже не хватает, и его нельзя вернуть.', icon: function (c, g) { var T = c.THREE; var h = c.mesh(new T.ConeGeometry(0.3, 0.5, 14), C.ORANGE, FAC[5].info); h.position.y = 0.3; h.rotation.x = Math.PI; g.add(h); var h2 = c.mesh(new T.ConeGeometry(0.3, 0.5, 14), C.ORANGE, FAC[5].info); h2.position.y = 0.8; g.add(h2); } }
  ];
  reg('o3-factors3d', {
    title: 'Факторы производства', lead: 'Шесть постаментов — шесть факторов. Из каждого в центр летят кубики: на заводе они соединяются в готовый продукт. Раньше было три фактора (земля, труд, капитал), сейчас — больше.',
    radius: 16, phi: 0.95, theta: 0.3, targetY: 1, height: 450, hint: 'Нажми на фактор или кнопку.',
    build: function (c) {
      c.ground(9);
      var f = factory(c, 0, 0, C.STONE, '<b>Производство</b> соединяет факторы и делает из них блага.', null, 0.8); K.smoke(c, f, 3);
      var pos = K.ring(c, FAC, 6.2);
      var cubes = FAC.map(function (it, i) { return c.box3(0.3, 0.3, 0.3, it.col, [0, 1, 0], it.info); });
      var prod = c.box3(0.5, 0.5, 0.5, C.RED, [0, 0.3, 1.6], '<b>Готовое благо</b> — результат соединения факторов.');
      c.S.old = false;
      c.onFrame(function (t) {
        cubes.forEach(function (m, i) { var q = (t * 0.35 + i / 6) % 1; m.visible = !c.S.old || i < 3; m.position.set(K.lerp(pos[i][0], 0, q), 0.8 + Math.sin(q * Math.PI) * 1.5, K.lerp(pos[i][1], 0, q)); m.rotation.y = t * 2; });
        var q2 = (t * 0.35) % 1; prod.position.set(0, 0.3, 1.2 + q2 * 2.5); prod.visible = q2 < 0.9;
      });
    },
    chips: K.ringChips(FAC, ['Земля', 'Труд', 'Капитал', 'Предпринимательство', 'Информация', 'Время'], [
      { t: 'Раньше: только 3', on: function (c) { c.S.old = true; c.S.focus = -1; c.setView(0.3, 0.95, 16, 1, 0, 0); c.say('<b>Классическая тройка:</b> труд, земля, капитал. Предпринимательство (Шумпетер), информацию и время добавили позже.'); } },
      { t: 'Сейчас', on: function (c) { c.S.old = false; c.S.focus = -1; c.setView(0.3, 0.95, 16, 1, 0, 0); c.say('Сейчас выделяют больше факторов: к труду, земле и капиталу добавились <b>предпринимательство</b>, <b>информация</b> и <b>время</b>.'); } }
    ])
  });

  /* ======================= 4. Эффективность и результативность ======================= */
  reg('o3-efficiency3d', {
    autorotate: false,
    title: 'Эффективность и результативность', lead: 'Два лучника стреляют по мишени. Оба попали (результативны). Но один потратил 2 стрелы, а другой 8. Эффективность — это сколько ресурсов ушло на результат.',
    radius: 14, phi: 1.0, theta: 0.15, targetY: 1.4, height: 430, hint: 'Сравни лучников кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iT = '<b>Цель</b> — запланированный результат. <b>Результативность</b> — степень его достижения.';
      var tgt = K.group(c, 0, 0, -4);
      [[1.2, C.WHITE], [0.9, C.RED], [0.6, C.WHITE], [0.3, C.RED]].forEach(function (r, i) { var d = c.mesh(new T.CylinderGeometry(r[0], r[0], 0.1, 32), r[1], iT); d.rotation.x = Math.PI / 2; d.position.set(0, 1.6, i * 0.03); tgt.add(d); });
      tgt.add(c.link([0, 0, -0.1], [0, 1.0, -0.1], C.WOOD, 0.08, iT));
      var a = person(c, -2.5, 3, C.GREEN, '<b>Лучник А:</b> 2 стрелы — 1 попадание. Результативен и <b>эффективен</b>.', null, 1.05);
      var b = person(c, 2.5, 3, C.RED, '<b>Лучник Б:</b> 8 стрел — 1 попадание. Результативен, но <b>неэффективен</b>.', null, 1.05);
      var qa = [], qb = [];
      for (var i = 0; i < 2; i++) qa.push(c.box3(0.06, 0.06, 0.9, C.GOLD, [-2.5, 1.3, 3], 'Стрела лучника А'));
      for (var j = 0; j < 8; j++) qb.push(c.box3(0.06, 0.06, 0.9, C.GOLD, [2.5, 1.3, 3], 'Стрела лучника Б'));
      c.label('2 стрелы', [-2.5, 2.6, 3], 0.2, '#4cc38a'); c.label('8 стрел', [2.5, 2.6, 3], 0.2, '#e0645a');
      c.S = { who: 'both' };
      c.onFrame(function (t) {
        function fly(arr, x0, period) {
          arr.forEach(function (m, i) {
            var q = ((t * 0.5 - i * (1 / arr.length)) % 1 + 1) % 1, hit = i === arr.length - 1;
            var ex = hit ? 0 : (i % 2 ? 1.8 : -1.8) + Math.sin(i) * 0.5, ey = hit ? 1.6 : 0.3 + (i % 3) * 0.9;
            m.position.set(K.lerp(x0, ex, q), K.lerp(1.3, ey, q) + Math.sin(q * Math.PI) * 0.5, K.lerp(3, -3.9, q));
          });
        }
        fly(qa, -2.5); fly(qb, 2.5);
        qa.forEach(function (m) { m.visible = c.S.who !== 'b'; }); qb.forEach(function (m) { m.visible = c.S.who !== 'a'; });
      });
    },
    chips: [
      { t: 'Лучник А', on: function (c) { c.S.who = 'a'; c.say('Попал (результат достигнут), потратил мало ресурсов → <b>эффективность высокая</b>. Эффективность = результат ÷ затраты.'); } },
      { t: 'Лучник Б', on: function (c) { c.S.who = 'b'; c.say('Тоже попал — <b>результативен</b>. Но на результат ушло 8 стрел → <b>эффективность низкая</b>.'); } },
      { t: 'Max / min', on: function (c) { c.S.who = 'both'; c.say('Два правила рационального производства: ресурсы известны → <b>максимизируем результат</b>; результат известен → <b>минимизируем ресурсы</b>.'); } }
    ]
  });

  /* ======================= 5. Показатели эффективности ======================= */
  reg('o3-ratios3d', {
    autorotate: false,
    title: 'Четыре показателя эффективности пекарни', lead: 'Пекарня: 6 работников, оборудование на 600 тыс., издержки 1 млн, выручка 1,2 млн, прибыль 200 тыс. Выбери показатель — модель покажет, что на что делится.',
    radius: 14, phi: 1.0, theta: 0.2, targetY: 1.4, height: 440, hint: 'Нажми на показатель.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var bake = K.group(c, -3.2, 0, -0.5);
      var iB = '<b>Пекарня</b> — пример [ДОБАВЛЕНО].';
      bake.add(c.box3(3, 1.6, 2, C.CREAM, [0, 0.8, 0], iB)); var r = c.mesh(new T.ConeGeometry(2.2, 1, 4), C.RED, iB); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.7); r.position.y = 2.1; bake.add(r);
      var oven = c.box3(1.4, 1.0, 0.6, C.DARK, [-3.2, 0.5, 1.2], '<b>Основные фонды</b> (печь, здание) — 600 тыс. ₽.');
      var workers = []; for (var i = 0; i < 6; i++) workers.push(person(c, -4.6 + i * 0.55, 2.4, C.BLUE, '<b>Работники</b>: 6 человек.', null, 0.6));
      var bars = [
        ['выручка', C.GREEN, 1.2, '<b>Выручка</b> 1,2 млн ₽.'], ['издержки', C.RED, 1.0, '<b>Издержки</b> 1 млн ₽.'], ['прибыль', C.GOLD, 0.2, '<b>Прибыль</b> 200 тыс. ₽ = выручка − издержки.'], ['фонды', C.SILVER, 0.6, '<b>Стоимость основных фондов</b> 600 тыс. ₽.']
      ];
      c.S = { bars: [] };
      bars.forEach(function (b, i) { var m = K.bar(c, 1.2 + i * 1.1, 0, b[1], b[3], 0.7); m.set(b[2] * 3); c.label(b[0], [1.2 + i * 1.1, -0.1, 0.9], 0.15); c.S.bars.push(m); });
      var res = c.label('выбери показатель', [2.8, 4.6, 0], 0.22, '#f0c36b');
      c.S.res = res; c.S.workers = workers; c.S.oven = oven;
      c.onFrame(function (t) { res.position.y = 4.6 + 0.08 * Math.sin(t * 2); });
    },
    chips: [
      ['Производительность труда', 'Сколько продукции на одного работника. Например, 6 000 буханок в день ÷ 6 работников = <b>1 000 буханок на человека</b>.', [-1, -1, -1, -1], 'workers'],
      ['Рентабельность', '<b>Рентабельность = прибыль ÷ издержки</b> = 200 ÷ 1 000 = <b>20 %</b>. Каждый вложенный рубль приносит 20 копеек прибыли.', [0, 1, 1, 0], null],
      ['Фондоотдача', '<b>Фондоотдача = выручка от реализации ÷ стоимость основных фондов</b> = 1 200 ÷ 600 = <b>2</b>. Каждый рубль в оборудовании даёт 2 рубля выручки.', [1, 0, 0, 1], 'oven'],
      ['Фондовооружённость', '<b>Фондовооружённость = стоимость основных фондов ÷ среднесписочная численность работников</b> = 600 тыс. ÷ 6 = <b>100 тыс. ₽ на работника</b>.', [0, 0, 0, 1], 'workers']
    ].map(function (q) {
      return { t: q[0], on: function (c) {
        c.S.bars.forEach(function (b, i) { b.material.emissive.set(q[2][i] > 0 ? '#ffffff' : '#000000'); b.material.emissiveIntensity = q[2][i] > 0 ? 0.35 : 0; });
        c.S.workers.forEach(function (w) { w.position.y = q[3] === 'workers' ? 0.3 : 0; });
        c.S.oven.position.y = q[3] === 'oven' ? 0.9 : 0.5;
        c.say(q[1]);
      } };
    })
  });

  /* ======================= 6. КПВ ======================= */
  reg('o3-ppf3d', {
    autorotate: false,
    title: 'Кривая производственных возможностей', lead: 'По горизонтали — тракторы (X), по вертикали — хлеб (Y). Светящаяся кривая — КПВ: всё, что можно произвести, если использовать все ресурсы полностью и эффективно. Двигай шарик кнопками.',
    radius: 14, phi: 1.15, theta: 0.0, targetY: 2.2, targetX: 2.5, height: 460, hint: 'Нажми на точку или кнопку.',
    build: function (c) {
      var T = c.THREE;
      var X = 6, Y = 4.4, ox = -0.5;
      K.axes(c, ox, 0, X + 1, Y + 0.8, null, 'X — тракторы', 'Y — хлеб');
      var iK = '<b>КПВ</b> — геометрическое место точек, каждая из которых показывает максимально возможное использование ограниченных ресурсов.';
      var pts = []; for (var i = 0; i <= 40; i++) { var x = X * i / 40; pts.push([ox + x, ppfY(x, X, Y), 0]); }
      var curve = K.tube(c, pts, C.BLUE, iK, null, 0.07);
      var pts2 = []; for (var j = 0; j <= 40; j++) { var x2 = X * 1.25 * j / 40; pts2.push([ox + x2, ppfY(x2, X * 1.25, Y * 1.2), 0]); }
      var curve2 = K.tube(c, pts2, C.GREEN, '<b>Новая КПВ</b> после сдвига наружу: новые технологии или ресурсы.', null, 0.06); curve2.visible = false;
      var fill = new T.Shape(); fill.moveTo(0, 0); for (var k = 0; k <= 40; k++) { var xx = X * k / 40; fill.lineTo(xx, ppfY(xx, X, Y)); } fill.lineTo(0, 0);
      var area = c.mesh(new T.ShapeGeometry(fill), C.BLUE, '<b>Область под КПВ</b> — достижимо, но если точка внутри, часть ресурсов простаивает.', { transparent: true, opacity: 0.12, side: T.DoubleSide }); area.position.set(ox, 0, -0.05);
      var P = [
        ['A', [2.0, 1.6], C.RED, '<b>Точка A — внутри КПВ.</b> Ресурсы используются не полностью: безработица, простаивающие заводы. Неэффективно.'],
        ['B', [3.6, ppfY(3.6, X, Y)], C.GREEN, '<b>Точка B — на КПВ.</b> Все ресурсы используются полностью и эффективно. Больше одного товара можно получить только за счёт другого.'],
        ['C', [5.5, 3.8], C.PURPLE, '<b>Точка C — за КПВ.</b> Недостижимо при нынешних ресурсах и технологиях.']
      ];
      P.forEach(function (p) { var m = K.glow(c, p[2], 0.14, p[3]); m.position.set(ox + p[1][0], p[1][1], 0.05); c.label(p[0], [ox + p[1][0] + 0.3, p[1][1] + 0.4, 0], 0.18); });
      var ball = K.glow(c, C.GOLD, 0.22, 'Выбор общества');
      c.S = { goal: P[1][1], shift: 0, P: P, curve2: curve2, ox: ox };
      c.onFrame(function (t) {
        var g = c.S.goal; ball.position.x = K.lerp(ball.position.x, ox + g[0], 0.06); ball.position.y = K.lerp(ball.position.y, g[1], 0.06); ball.position.z = 0.2;
        curve2.visible = c.S.shift > 0; curve2.material.opacity = 1;
      });
    },
    chips: [
      { t: 'A: внутри', on: function (c) { c.S.goal = c.S.P[0][1]; c.say(c.S.P[0][3]); } },
      { t: 'B: на кривой', on: function (c) { c.S.goal = c.S.P[1][1]; c.say(c.S.P[1][3]); } },
      { t: 'C: за кривой', on: function (c) { c.S.goal = c.S.P[2][1]; c.say(c.S.P[2][3]); } },
      { t: 'Сдвиг наружу', on: function (c) { c.S.shift = 1; c.S.goal = c.S.P[2][1]; c.say('<b>КПВ не может перемещаться сама, без влияния извне.</b> [ДОБАВЛЕНО] Новые технологии, ресурсы, рост образования сдвигают её наружу — и точка C становится достижимой.'); } },
      { t: 'Сброс', on: function (c) { c.S.shift = 0; c.S.goal = c.S.P[1][1]; c.say('КПВ показывает: <b>ограниченность</b> ресурсов, <b>эффективность</b>, <b>выбор</b> и <b>альтернативные затраты</b>.'); } }
    ]
  });

  /* ======================= 7. Альтернативные издержки ======================= */
  reg('o3-altcost3d', {
    autorotate: false,
    title: 'Альтернативные издержки: чем жертвуем', lead: 'Страна двигается по КПВ вправо — делает больше тракторов. За каждый новый трактор приходится отдавать хлеб. Красные столбики — сколько хлеба потеряно за каждый следующий трактор. Они растут!',
    radius: 14, phi: 1.15, theta: 0.0, targetY: 2.2, targetX: 2.5, height: 460, hint: 'Шагай вправо кнопкой.',
    build: function (c) {
      var X = 6, Y = 4.4, ox = -0.5;
      K.axes(c, ox, 0, X + 1, Y + 0.8, null, 'X — тракторы', 'Y — хлеб');
      var pts = []; for (var i = 0; i <= 40; i++) { var x = X * i / 40; pts.push([ox + x, ppfY(x, X, Y), 0]); }
      K.tube(c, pts, C.BLUE, '<b>КПВ</b> выгнута наружу из-за закона возрастания альтернативных издержек.', null, 0.07);
      var steps = [0, 1.5, 3, 4.5, 6];
      var drops = [];
      for (var k = 1; k < steps.length; k++) {
        var y0 = ppfY(steps[k - 1], X, Y), y1 = ppfY(steps[k], X, Y), loss = y0 - y1;
        var m = c.box3(0.35, Math.max(0.05, loss), 0.35, C.RED, [ox + steps[k], y1 + loss / 2, 0.4], '<b>Альтернативные издержки</b> трактора №' + k + ': пришлось отказаться от ' + loss.toFixed(1) + ' ед. хлеба. Каждый следующий трактор обходится всё дороже.');
        m.visible = false; drops.push(m);
      }
      var ball = K.glow(c, C.GOLD, 0.22, 'Текущий выбор общества');
      c.S = { n: 0, drops: drops, steps: steps, X: X, Y: Y, ox: ox };
      c.onFrame(function () {
        var x = steps[c.S.n]; ball.position.x = K.lerp(ball.position.x, ox + x, 0.06); ball.position.y = K.lerp(ball.position.y, ppfY(x, X, Y), 0.06); ball.position.z = 0.2;
        drops.forEach(function (d, i) { d.visible = i < c.S.n; });
      });
    },
    chips: [
      { t: 'Шаг вправо', on: function (c) { c.S.n = Math.min(4, c.S.n + 1); var X = c.S.X, Y = c.S.Y, s = c.S.steps, n = c.S.n; var loss = ppfY(s[n - 1], X, Y) - ppfY(s[n], X, Y); c.say('Ещё +1,5 трактора стоили <b>' + loss.toFixed(1) + '</b> ед. хлеба. Это <b>альтернативные издержки</b> — то, чем пришлось пожертвовать.' + (n > 2 ? ' Потери растут: на тракторы переводят всё менее подходящие ресурсы (<b>закон возрастания альтернативных издержек</b>).' : '')); } },
      { t: 'Сначала', on: function (c) { c.S.n = 0; c.say('Всё в хлебе, тракторов ноль. Начинаем перераспределять ресурсы.'); } },
      { t: 'Пример: кино', on: function (c) { c.say('<b>Пример:</b> пошёл в кино (билет 500 ₽) вместо 3 часов работы курьером (1500 ₽). Альтернативные издержки кино — упущенные <b>1500 ₽</b> (лучшая из отвергнутых альтернатив), а вместе с билетом выбор стоил 2000 ₽.'); } }
    ]
  });

  /* ======================= 8. Оптимум Парето ======================= */
  reg('o3-pareto3d', {
    autorotate: false,
    title: 'Оптимум Парето: делим пиццу', lead: 'Двое делят пиццу из 8 кусков. Пока есть «ничьи» куски, можно улучшить положение одного, не ухудшая другого. Когда всё поделено — любое улучшение для одного ухудшает другого: это оптимум.',
    radius: 12, phi: 0.85, theta: 0.0, targetY: 0.8, height: 430, hint: 'Нажимай кнопки по порядку.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      c.box3(5, 0.15, 3.5, C.WOOD, [0, 0.6, 0], 'Стол');
      [[-2.2, -1.5], [2.2, -1.5], [-2.2, 1.5], [2.2, 1.5]].forEach(function (q) { c.link([q[0], 0, q[1]], [q[0], 0.6, q[1]], C.WOOD, 0.08, 'Стол'); });
      var A = person(c, -3.4, 0, C.BLUE, '<b>Аня</b>', null, 1.1), B = person(c, 3.4, 0, C.RED, '<b>Борис</b>', null, 1.1);
      var slices = [];
      for (var i = 0; i < 8; i++) { var s = K.sector(c, 1.2, 0.12, i * Math.PI / 4 + 0.03, (i + 1) * Math.PI / 4 - 0.03, C.POTATO, '<b>Кусок пиццы</b>'); s.position.set(0, 0.7, 0); slices.push(s); }
      var states = [
        [0, 0, 0, 0, 0, 0, 0, 0], // 0 — ничьё, 1 — Аня, 2 — Борис
        [1, 1, 1, 2, 2, 2, 0, 0],
        [1, 1, 1, 2, 2, 2, 1, 0],
        [1, 1, 1, 2, 2, 2, 1, 2],
        [1, 1, 1, 1, 2, 2, 1, 2]
      ];
      c.S = { st: 0, states: states };
      c.onFrame(function (t) {
        var s = states[c.S.st];
        slices.forEach(function (m, i) {
          var o = s[i], a = (i + 0.5) * Math.PI / 4, tx = o === 1 ? -1.9 : o === 2 ? 1.9 : 0, off = o ? 0.2 : 0;
          m.position.x = K.lerp(m.position.x, tx + Math.cos(a) * off, 0.07); m.position.z = K.lerp(m.position.z, -Math.sin(a) * off, 0.07);
          m.material.color.set(o === 1 ? '#8fb3ff' : o === 2 ? '#f29a92' : C.POTATO);
        });
      });
    },
    chips: [
      { t: '1. Делим', on: function (c) { c.S.st = 1; c.say('Аня 3 куска, Борис 3, ещё 2 «ничьих». <b>Не оптимум по Парето:</b> можно дать кусок одному, и никому не станет хуже.'); } },
      { t: '2. Кусок Ане', on: function (c) { c.S.st = 2; c.say('Ане стало лучше, Борису — не хуже. Это <b>Парето-улучшение</b>.'); } },
      { t: '3. Кусок Борису', on: function (c) { c.S.st = 3; c.say('Вся пицца поделена. Теперь <b>оптимум по Парето</b>: положение одного нельзя улучшить, не ухудшив положения другого.'); } },
      { t: '4. Отнять у Бориса', on: function (c) { c.S.st = 4; c.say('Ане +1, Борису −1. Это уже не улучшение по Парето. <b>[ДОБАВЛЕНО]</b> Важно: оптимум Парето не значит «справедливо» — «8 кусков у одного» тоже оптимально по Парето.'); } }
    ]
  });

  /* ======================= 9. Убывающая доходность и эффект масштаба ======================= */
  reg('o3-diminish3d', {
    autorotate: false,
    title: 'Закон убывающей доходности и эффект масштаба', lead: 'Огород фиксированного размера. Добавляем работников по одному: столбики урожая растут, но каждый следующий прирост (оранжевый) меньше прежнего. А если увеличить всё сразу — включается эффект масштаба.',
    radius: 15, phi: 1.0, theta: 0.25, targetY: 1.4, height: 450, hint: 'Добавляй работников, потом попробуй «Масштаб ×2».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iF = '<b>Огород</b> — фиксированный фактор (земля не растёт).';
      var plot = c.box3(4.2, 0.12, 3.2, '#6b4f2e', [-3, 0.06, 0], iF);
      for (var r = 0; r < 4; r++) c.box3(3.8, 0.1, 0.2, C.TEA, [-3, 0.17, -1.2 + r * 0.8], iF);
      var plot2 = c.box3(4.2, 0.12, 3.2, '#6b4f2e', [-3, 0.06, 3.5], 'Второй огород — при удвоении всех факторов.'); plot2.visible = false;
      var tractor = K.group(c, -1.5, 0, 3.5); tractor.add(c.box3(1.0, 0.6, 0.7, C.RED, [0, 0.5, 0], '<b>Трактор</b> — при большом масштабе можно купить технику и разделить труд.')); tractor.add(c.box3(0.4, 0.5, 0.6, C.DARK, [-0.5, 0.9, 0], 'Трактор')); tractor.visible = false;
      var ws = []; for (var i = 0; i < 5; i++) { var p = person(c, -4.6 + i * 0.8, 0, C.BLUE, '<b>Работник №' + (i + 1) + '</b>', null, 0.75); p.visible = false; ws.push(p); }
      var total = [100, 180, 240, 270, 280], add = [100, 80, 60, 30, 10];
      var tb = [], ab = [];
      for (var k = 0; k < 5; k++) {
        var b = K.bar(c, 1.0 + k * 1.0, -0.6, C.GOLD, '<b>Общий урожай</b> при ' + (k + 1) + ' работниках: ' + total[k] + ' кг.', 0.6); b.set(0.02); tb.push(b);
        var a = K.bar(c, 1.0 + k * 1.0, 0.6, C.ORANGE, '<b>Прирост</b> от работника №' + (k + 1) + ': +' + add[k] + ' кг. Каждый следующий даёт меньше.', 0.6); a.set(0.02); ab.push(a);
        c.label(String(k + 1), [1.0 + k * 1.0, -0.2, 1.5], 0.16, '#8b93b5');
      }
      c.label('общий урожай', [3, 4, -0.6], 0.18, '#f0c36b'); c.label('прирост', [3, 2.4, 1.2], 0.18, '#e39b5b');
      c.S = { n: 0, tb: tb, ab: ab, ws: ws, total: total, add: add, plot2: plot2, tractor: tractor };
      c.onFrame(function (t) { ws.forEach(function (w, i) { if (w.visible) w.rotation.z = 0.15 * Math.sin(t * 4 + i); }); tractor.position.x = -1.5 + Math.sin(t) * 1.2; });
    },
    chips: [
      { t: '+ работник', on: function (c) {
        var n = c.S.n = Math.min(5, c.S.n + 1);
        c.S.ws.forEach(function (w, i) { w.visible = i < n; }); c.S.plot2.visible = false; c.S.tractor.visible = false;
        c.S.tb.forEach(function (b, i) { b.set(i < n ? c.S.total[i] / 80 : 0.02); }); c.S.ab.forEach(function (b, i) { b.set(i < n ? c.S.add[i] / 80 : 0.02); });
        c.say('Работников: <b>' + n + '</b>. Урожай: <b>' + c.S.total[n - 1] + ' кг</b>, прирост от последнего: <b>+' + c.S.add[n - 1] + ' кг</b>.' + (n > 1 ? ' Прирост падает — <b>закон убывающей доходности</b>: огород не растёт, людям тесно.' : ''));
      } },
      { t: 'Сброс', on: function (c) { c.S.n = 0; c.S.ws.forEach(function (w) { w.visible = false; }); c.S.tb.concat(c.S.ab).forEach(function (b) { b.set(0.02); }); c.S.plot2.visible = false; c.S.tractor.visible = false; c.say('Начнём заново.'); } },
      { t: 'Масштаб ×2', on: function (c) { c.S.plot2.visible = true; c.S.tractor.visible = true; c.S.tb.forEach(function (b, i) { b.set(i < 2 ? (i ? 400 : 180) / 80 : 0.02); }); c.S.ab.forEach(function (b) { b.set(0.02); }); c.say('Удвоили <b>всё</b>: землю, людей, инструменты — и смогли купить трактор. Урожай вырос с 180 до 400 кг — <b>больше чем вдвое</b>. Это <b>закон роста доходности от масштаба</b>.'); } }
    ]
  });
})();
