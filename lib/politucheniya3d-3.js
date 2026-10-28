/* 3D-модели к конспекту «Средневековье и Аврелий Августин» (движок HubScene3d).
   В Markdown: @@graph:aug-timeline3d@@ @@graph:aug-rome3d@@ @@graph:aug-map3d@@ @@graph:aug-history3d@@
   @@graph:aug-will3d@@ @@graph:aug-dam3d@@ @@graph:aug-cities3d@@ @@graph:aug-court3d@@ @@graph:aug-war3d@@
   @@graph:aug-time3d@@ @@graph:aug-knowledge3d@@ @@graph:aug-horizon3d@@ @@graph:aug-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build;
    /* подписи крупнее: сцены смотрят с телефона */
    opts.build = function (c) { var lab = c.label; c.label = function (t, pos, size, col) { return lab(t, pos, (size || 0.9) * 1.55, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function group(c, x, y, z) { var g = new c.THREE.Group(); g.position.set(x || 0, y || 0, z || 0); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  /* человечек: тело + голова, возвращает группу */
  function person(c, x, z, col, info, h) {
    var T = c.THREE, g = group(c, x, 0, z); h = h || 1;
    into(g, c.mesh(new T.CylinderGeometry(0.26 * h, 0.36 * h, 1.05 * h, 12), col, info)).position.y = 0.53 * h;
    into(g, c.mesh(new T.SphereGeometry(0.25 * h, 14, 10), '#e8c6a0', info)).position.y = 1.3 * h;
    return g;
  }
  function cross(c, g, col, info, s) {
    var T = c.THREE; s = s || 1;
    into(g, c.mesh(new T.BoxGeometry(0.16 * s, 1.1 * s, 0.16 * s), col, info, { metalness: 0.6, roughness: 0.3 }));
    into(g, c.mesh(new T.BoxGeometry(0.7 * s, 0.16 * s, 0.16 * s), col, info, { metalness: 0.6, roughness: 0.3 })).position.y = 0.18 * s;
  }

  /* ---------- 1. Лента времени ---------- */
  reg('aug-timeline3d', {
    title: 'Лента времени: от Августина до раскола церквей', lead: 'Столбики — события. Высота показывает, как далеко от рождения Августина. Нажми на столбик или кнопку.',
    radius: 22, phi: 0.95, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(11);
      var E = [
        [354, 'Рождение Августина', '<b>354</b> — Августин родился в Тагасте (Северная Африка). <b>[ДОБАВЛЕНО]</b>', '#7aa2ff'],
        [387, 'Крещение', '<b>387</b> — крестился в Милане у епископа Амвросия. <b>[ДОБАВЛЕНО]</b>', '#7aa2ff'],
        [396, 'Епископ Гиппона', '<b>395/396</b> — епископ Гиппона. Пишет против ариан, донатистов, пелагиан.', '#7aa2ff'],
        [400, '«Исповедь»', '<b>Около 397–400</b> — «Исповедь». В 11-й книге — размышления о времени. <b>[ДОБАВЛЕНО]</b>', '#b07cff'],
        [410, 'Аларих берёт Рим', '<b>410</b> — вестготы Алариха грабят Рим. Язычники винят христиан. <b>[ДОБАВЛЕНО]</b>', '#ef6b5b'],
        [426, '«О граде Божием»', '<b>413–426</b> — «О граде Божием», 22 книги: ответ тем, кто винил христиан. <b>[ДОБАВЛЕНО]</b>', '#f0c36b'],
        [430, 'Смерть Августина', '<b>430</b> — Августин умирает в осаждённом вандалами Гиппоне. <b>[ДОБАВЛЕНО]</b>', '#7aa2ff'],
        [476, 'Конец Западной Римской империи', '<b>476</b> — свергнут последний император Запада. Начало Средневековья. <b>[ДОБАВЛЕНО]</b>', '#ef6b5b'],
        [1054, 'Раскол церквей', '<b>1054</b> — Великая схизма: западная (католическая) и восточная (православная) церкви разошлись. Один из поводов — спор о том, исходит ли Святой Дух «и от Сына» (филиокве).', '#4fc3a1']
      ];
      var bars = [];
      E.forEach(function (e, i) {
        var a = -Math.PI * 0.95 + i / (E.length - 1) * Math.PI * 1.9, r = 7.5;
        var h = 0.6 + Math.log(1 + (e[0] - 350)) * 0.75;
        var b = c.mesh(new T.CylinderGeometry(0.45, 0.45, h, 20), e[3], e[2]); b.position.set(Math.sin(a) * r, h / 2, Math.cos(a) * r);
        c.label(e[0] + '\n' + e[1], [Math.sin(a) * r, h + 1.1, Math.cos(a) * r], 0.7);
        bars.push(b);
      });
      var core = c.mesh(new T.SphereGeometry(1.4, 24, 16), '#f0c36b', '<b>Аврелий Августин (354–430)</b> — главный из западных отцов церкви. Его идеи определили политическую мысль Средневековья.', { emissive: new T.Color('#5a4410'), metalness: 0.3 });
      core.position.y = 1.6; c.label('Августин', [0, 3.6, 0], 0.7, '#f0c36b');
      c.onFrame(function (t) { core.position.y = 1.6 + Math.sin(t * 1.5) * 0.2; bars.forEach(function (b, i) { b.rotation.y = t * 0.3 + i; }); });
      c.state = { bars: bars, E: E };
    },
    chips: [
      { t: '354–430', small: 'жизнь', on: function (c) { c.setView(-2.2, 0.9, 20, 1.5); c.pick(c.state.bars[0]); } },
      { t: '410', small: 'падение Рима', on: function (c) { c.setView(0.1, 0.9, 20, 1.5); c.pick(c.state.bars[4]); } },
      { t: '1054', small: 'раскол', on: function (c) { c.setView(2.6, 0.9, 20, 1.5); c.pick(c.state.bars[8]); } }
    ]
  });

  /* ---------- 2. Падение Рима ---------- */
  reg('aug-rome3d', {
    title: 'Почему наступило Средневековье', lead: 'Рим теряет силу, но на развалинах остаётся церковь. Переключай этапы.',
    radius: 20, phi: 0.95, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.ground(10, '#8a7f66');
      var wall = [], cols = [];
      for (var i = 0; i < 24; i++) { var a = i / 24 * Math.PI * 2; var w = c.mesh(new T.BoxGeometry(1.7, 1.6, 0.5), '#cfc4a8', '<b>Стены Рима</b>: армия, налоги, дороги, чиновники — «техника» государства.'); w.position.set(Math.sin(a) * 6.5, 0.8, Math.cos(a) * 6.5); w.rotation.y = a; wall.push(w); }
      for (var k = 0; k < 6; k++) { var a2 = k / 6 * Math.PI * 2; var cl = c.mesh(new T.CylinderGeometry(0.3, 0.35, 3, 14), '#e8e0cc', '<b>Храм языческих богов</b>: старая идеология. Её кризис — одна из причин распада, по словам лектора.'); cl.position.set(-2.5 + Math.sin(a2) * 1.6, 1.5, -1 + Math.cos(a2) * 1.6); cols.push(cl); }
      var roof = c.mesh(new T.ConeGeometry(2.4, 1, 6), '#e8e0cc', cols[0].userData.info); roof.position.set(-2.5, 3.5, -1);
      var ch = group(c, 2.6, 0, 1.2);
      var CI = '<b>Церковь</b>: единая сеть епископов по всей бывшей империи. Христианство заново объяснило, <b>зачем</b> объединять большие территории.';
      into(ch, c.mesh(new T.BoxGeometry(2, 2, 3), '#f3efe6', CI)).position.y = 1;
      var rf = into(ch, c.mesh(new T.CylinderGeometry(0, 1.5, 1.2, 4), '#bf5b4a', CI)); rf.position.y = 2.6; rf.rotation.y = Math.PI / 4;
      var cg = new T.Group(); cg.position.set(0, 3.9, 0); ch.add(cg); cross(c, cg, '#f0c36b', CI, 1);
      var goths = [];
      for (var g = 0; g < 10; g++) { goths.push(person(c, 12, 0, '#6b4a2a', '<b>Вестготы Алариха</b>, 410 год: Рим впервые за 800 лет взят врагом. <b>[ДОБАВЛЕНО]</b>', 0.7)); }
      c.state = { m: 0 };
      c.onFrame(function (t) {
        var m = c.state.m;
        wall.forEach(function (w, i) { var fall = m >= 1 && i % 3 === 0; w.rotation.x += ((fall ? 1.3 : 0) - w.rotation.x) * 0.05; w.position.y += ((fall ? 0.3 : 0.8) - w.position.y) * 0.05; });
        cols.forEach(function (cl, i) { var fall = m >= 2 && i % 2 === 0; cl.rotation.z += ((fall ? 1.4 : 0) - cl.rotation.z) * 0.04; });
        roof.visible = m < 2;
        goths.forEach(function (p, i) { var target = m >= 1 ? 3 + (i % 5) * 0.8 : 12; p.position.x += (target - p.position.x) * 0.03; p.position.z = -5 + Math.floor(i / 5) * 1.2 + (m >= 1 ? 3 : 0); });
        ch.scale.setScalar(m === 2 ? 1.2 + Math.sin(t * 2) * 0.03 : 1);
      });
    },
    chips: [
      { t: 'Империя', small: 'до 410', on: function (c) { c.state.m = 0; c.setView(0.6, 0.95, 20, 1); c.say('Рим держится на армии, налогах и вере в старых богов.'); } },
      { t: '410 год', small: 'Аларих', on: function (c) { c.state.m = 1; c.setView(1.2, 0.85, 18, 1); c.say('<b>[ДОБАВЛЕНО]</b> Вестготы грабят Рим. Язычники говорят: это кара за то, что отреклись от старых богов. Августин отвечает книгой «О граде Божием».'); } },
      { t: 'Средневековье', small: 'остаётся церковь', on: function (c) { c.state.m = 2; c.setView(0.3, 0.9, 16, 1.5); c.say('Старая идеология рухнула, а <b>церковь</b> осталась. Она снова даёт смысл единому государству.'); } }
    ]
  });

  /* ---------- 3. Карта жизни Августина ---------- */
  reg('aug-map3d', {
    title: 'Путь Августина по Средиземноморью', lead: 'Города, где жил Августин. Нажми на флажок. [ДОБАВЛЕНО: биография по источникам]',
    radius: 22, phi: 0.8, targetY: 0,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(18, 0.3, 14), '#3b6ea8', 'Средиземное море.', { roughness: 0.4 }).position.y = -0.3;
      c.mesh(new T.BoxGeometry(17, 0.5, 4), '#d8c48a', 'Северная Африка — родина Августина.').position.set(0, 0, 5);
      c.mesh(new T.BoxGeometry(2.6, 0.5, 7), '#7fb26a', 'Италия.').position.set(1.5, 0, -2.5);
      c.mesh(new T.BoxGeometry(8, 0.5, 3), '#7fb26a', 'Европа.').position.set(-1, 0, -6);
      var P = [
        ['Тагаст', -2.5, 5.6, '<b>Тагаст</b> (Алжир): здесь Августин родился в 354 году. Мать — христианка Моника.', '#7aa2ff'],
        ['Карфаген', 1.2, 3.6, '<b>Карфаген</b>: учёба и преподавание риторики. Увлечение манихейством.', '#b07cff'],
        ['Рим', 1.6, -1.8, '<b>Рим</b>: преподаёт риторику (383).', '#ef6b5b'],
        ['Милан', 0.6, -4.8, '<b>Милан</b>: встреча с епископом Амвросием и крещение (387).', '#4fc3a1'],
        ['Гиппон', -1, 4, '<b>Гиппон</b>: Августин — епископ с 395/396 и до смерти (430). Здесь написаны «Исповедь» и «О граде Божием».', '#f0c36b']
      ];
      var pts = [];
      P.forEach(function (p) {
        c.mesh(new T.CylinderGeometry(0.07, 0.07, 1.5, 8), '#ffffff', p[3]).position.set(p[1], 1, p[2]);
        var f = c.mesh(new T.BoxGeometry(0.9, 0.55, 0.06), p[4], p[3]); f.position.set(p[1] + 0.45, 1.5, p[2]);
        c.label(p[0], [p[1], 2.4, p[2]], 0.5); pts.push(new T.Vector3(p[1], 0.5, p[2]));
      });
      var curve = new T.CatmullRomCurve3(pts);
      c.mesh(new T.TubeGeometry(curve, 80, 0.06, 6), '#f0c36b', 'Путь Августина: Африка → Италия → снова Африка.');
      var dot = c.mesh(new T.SphereGeometry(0.25, 14, 10), '#ffffff', 'Августин в пути.');
      var H = ['Ариане', 'Донатисты', 'Пелагиане', 'Манихеи'], hz = [];
      H.forEach(function (h, i) {
        var info = { 'Ариане': '<b>Ариане</b>: считали, что Сын (Христос) не равен Отцу. Осуждены на Никейском соборе (325).', 'Донатисты': '<b>Донатисты</b>: считали, что таинство недействительно, если священник грешен. Сильны были именно в Африке.', 'Пелагиане': '<b>Пелагиане</b>: человек может спастись своими силами, без благодати. Августин — главный их противник.', 'Манихеи': '<b>Манихеи</b>: мир — борьба двух равных начал, добра и зла. Августин был манихеем 9 лет, потом спорил с ними.' }[h] + ' <b>[ДОБАВЛЕНО]</b> Лектор: Августин писал против ариан, донатистов и других еретиков.';
        var s = c.mesh(new T.OctahedronGeometry(0.45), '#ef6b5b', info); hz.push(s); c.label(h, [0, 0, 0], 0.4, '#ff9a8a').userData.follow = s;
      });
      var labels = c.root.children.filter(function (o) { return o.isSprite && o.userData.follow; });
      c.onFrame(function (t) {
        var k = (t * 0.06) % 1; var p = curve.getPoint(k); dot.position.set(p.x, 1, p.z);
        hz.forEach(function (s, i) { var a = t * 0.4 + i * Math.PI / 2; s.position.set(-1 + Math.cos(a) * 2.6, 2.2, 4 + Math.sin(a) * 1.4); s.rotation.y = t; });
        labels.forEach(function (l) { l.position.set(l.userData.follow.position.x, 2.9, l.userData.follow.position.z); });
      });
    },
    chips: [
      { t: 'Африка', small: 'детство и епископство', on: function (c) { c.setView(0.2, 0.75, 13, 0, -1); c.say('Августин родился и умер в Африке. Красные кристаллы — ереси, с которыми он спорил в Гиппоне.'); } },
      { t: 'Италия', small: 'Рим и Милан', on: function (c) { c.setView(-0.3, 0.75, 13, 0, 1); c.say('В Милане Августин слушает проповеди Амвросия и в 387 году принимает крещение.'); } }
    ]
  });

  /* ---------- 4. Круг или прямая ---------- */
  reg('aug-history3d', {
    title: 'История: круг или прямая', lead: 'Слева — циклическое время (всё повторяется). Справа — христианская линейная история с началом и концом.',
    radius: 26, phi: 1.0, targetY: 2, targetX: 2.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(13);
      var CI = '<b>Циклическое время</b>: античность и восточные религии. Всё повторяется, душа проходит бесконечную череду перевоплощений. Цели нет — есть круг.';
      var ring = c.mesh(new T.TorusGeometry(2.6, 0.16, 12, 64), '#9aa0b4', CI); ring.position.set(-6, 2.5, 0);
      c.label('Круг', [-6, 5.6, 0], 0.6);
      var ball = c.mesh(new T.SphereGeometry(0.35, 16, 12), '#7aa2ff', 'Душа бесконечно перевоплощается и возвращается к началу.');
      var stages = [
        ['Сотворение', '<b>Сотворение мира</b> «из ничего» (креационизм). Начало истории.', '#4fc3a1'],
        ['Грехопадение', '<b>Грехопадение</b> Адама и Евы. Природа человека повреждена — отсюда несовершенство государства.', '#ef6b5b'],
        ['Христос', '<b>Пришествие Христа</b> — центр истории, путь к спасению открыт.', '#f0c36b'],
        ['Церковь', '<b>Время церкви</b>: два града перемешаны, люди выбирают свободно.', '#b07cff'],
        ['Конец света', '<b>Конец света и Страшный суд</b>. Град Божий окончательно отделён от земного. Цель — спасение.', '#ffffff']
      ];
      var line = c.link([1, 0.6, 3], [11, 0.6, -3], '#c9a24a', 0.08, '<b>Линейная история</b>: у неё есть начало, смысл и конец. Это даёт истории <b>цель</b> и оптимизм.');
      var marks = [];
      stages.forEach(function (s, i) {
        var x = 1 + i * 2.5, z = 3 - i * 1.5, h = 0.8 + i * 0.7;
        var m = c.mesh(new T.CylinderGeometry(0.5, 0.6, h, 20), s[2], s[1]); m.position.set(x, h / 2, z); marks.push(m);
        c.label(s[0], [x, h + 0.8, z], 0.5);
      });
      var arrow = c.mesh(new T.ConeGeometry(0.4, 1, 16), '#c9a24a', line.userData.info); arrow.position.set(11.5, 0.6, -3.3); arrow.rotation.z = -Math.PI / 2; arrow.rotation.y = Math.atan2(1.5, 2.5);
      c.label('Прямая', [6, 5.6, 0], 0.6, '#f0c36b');
      var walker = c.mesh(new T.SphereGeometry(0.3, 16, 12), '#f0c36b', 'Человечество движется к концу истории.');
      c.state = { mode: 2 };
      c.onFrame(function (t) {
        var a = t * 1.2; ball.position.set(-6 + Math.cos(a) * 2.6, 2.5 + Math.sin(a) * 2.6, 0);
        ring.rotation.y = Math.sin(t * 0.3) * 0.4;
        var k = (t * 0.08) % 1; walker.position.set(1 + k * 10, 1 + Math.sin(k * Math.PI) * 0.5 + k * 3, 3 - k * 6);
        marks.forEach(function (m, i) { m.material.emissiveIntensity = 1; m.scale.y = 1 + (Math.abs(k * 4 - i) < 0.5 ? 0.15 : 0); });
      });
    },
    chips: [
      { t: 'Круг', small: 'перевоплощения', on: function (c) { c.setView(-0.3, 1.0, 13, 2.5, -6); c.say('В круге нет конечной цели: всё возвращается. Лектор: христиане противопоставили этому «бесконечной очереди перевоплощений» линейную историю.'); } },
      { t: 'Прямая', small: 'христианство', on: function (c) { c.setView(0.6, 1.0, 17, 2, 6); c.say('Сотворение → грехопадение → Христос → конец света. У истории есть <b>цель — спасение</b>, а значит и смысл.'); } },
      { t: 'Не достроен', small: 'роль человека', on: function (c) { c.setView(0.3, 0.9, 22, 1.5, 2); c.say('Лектор: Бог творит мир, но <b>творение не завершено</b>. Чтобы его завершить, нужно участие людей в истории.'); } }
    ]
  });

  /* ---------- 5. Свобода воли ---------- */
  reg('aug-will3d', {
    title: 'Свобода воли: развилка', lead: 'Человек стоит на развилке. Бог даёт свет, но не толкает. Нажимай кнопки.',
    radius: 18, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var road = c.mesh(new T.BoxGeometry(1.4, 0.1, 5), '#9a8f78', 'Жизненный путь человека.'); road.position.set(0, 0.05, 3);
      var up = c.mesh(new T.BoxGeometry(1.2, 0.1, 6), '#e8dcb0', '<b>Путь к Богу</b>: вера, благодать, любовь к Богу. Ведёт к Граду Божьему.'); up.position.set(-2.2, 0.06, -2.5); up.rotation.set(0, 0.5, 0);
      var down = c.mesh(new T.BoxGeometry(1.2, 0.1, 6), '#5b4a5e', '<b>Путь против Бога</b>: любовь к себе, гордыня. Лектор: действуя против Бога, человек «теряет разум», и Бог может наказать.'); down.position.set(2.2, 0.06, -2.5); down.rotation.set(0, -0.5, 0);
      var man = person(c, 0, 1.2, '#7aa2ff', '<b>Человек</b>: у него есть <b>разум и свобода воли</b>. Он может творить, а может убить и разрушить.', 1);
      var light = c.mesh(new T.SphereGeometry(1, 24, 16), '#fff3c4', '<b>Бог</b>: даёт свободу и благодать. Лектор: Бог <b>может</b> отнять свободу воли, но <b>не хочет</b> — иначе не было бы человеческой истории.', { emissive: new T.Color('#c9a24a'), emissiveIntensity: 0.9 });
      light.position.set(0, 6.5, -4);
      var rays = []; for (var i = 0; i < 10; i++) { var r = c.mesh(new T.CylinderGeometry(0.03, 0.03, 5.5, 6), '#fff3c4', light.userData.info, { transparent: true, opacity: 0.4 }); rays.push(r); }
      var chain = []; for (var k = 0; k < 6; k++) { var l = c.mesh(new T.TorusGeometry(0.22, 0.06, 8, 16), '#8a8f9c', '<b>Если бы Бог отнял свободу</b>, человек стал бы куклой на цепи. Ни заслуги, ни вины — и никакой истории.', { metalness: 0.8 }); l.visible = false; chain.push(l); }
      c.state = { m: 0 };
      c.onFrame(function (t) {
        var m = c.state.m, tx = 0, tz = 1.2, ty = 0;
        if (m === 1) { var k = (t * 0.25) % 1; tx = -2.4 * k * 1.6; tz = 1.2 - k * 5; ty = 0; }
        if (m === 2) { var q = (t * 0.25) % 1; tx = 2.4 * q * 1.6; tz = 1.2 - q * 5; ty = 0; }
        man.position.set(tx, ty, tz);
        rays.forEach(function (r, i) { var a = i / 10 * Math.PI * 2 + t * 0.2; r.position.set(man.position.x * 0.5 + Math.cos(a) * 0.6, 4, (man.position.z - 4) * 0.5 + Math.sin(a) * 0.6); r.rotation.x = -0.45; r.visible = m !== 3; });
        chain.forEach(function (l, i) { l.visible = m === 3; l.position.set(man.position.x, 1.9 + i * 0.36, man.position.z); l.rotation.y = i % 2 ? Math.PI / 2 : 0; });
      });
    },
    chips: [
      { t: 'Развилка', small: 'выбор', on: function (c) { c.state.m = 0; c.setView(0.4, 1.0, 16, 1.5); c.say('Отношения Бога и человека — <b>не отношения равных</b>. Но выбор пути остаётся за человеком.'); } },
      { t: 'К Богу', small: 'благодать', on: function (c) { c.state.m = 1; c.setView(-0.5, 0.95, 15, 2); c.say('Спастись нельзя только обрядами. Нужны вера и <b>благодать</b> — дар Бога.'); } },
      { t: 'Против Бога', small: 'грех', on: function (c) { c.state.m = 2; c.setView(0.8, 0.95, 15, 1); c.say('Человек свободен и в зле. Бог может наказать, но не превращает его в куклу.'); } },
      { t: 'Без свободы?', small: 'кукла', on: function (c) { c.state.m = 3; c.setView(0.2, 1.0, 13, 2.5); c.say('Может ли Бог отнять свободу? <b>Может, но не хочет</b>: свобода и делает историю человеческой.'); } }
    ]
  });

  /* ---------- 6. Государство как плотина ---------- */
  reg('aug-dam3d', {
    title: 'Государство — вынужденное зло', lead: 'Красные шарики — грех и насилие. Стена — государственная власть: суд, закон, наказание. Сравни мир без неё и с ней.',
    radius: 20, phi: 0.95, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(10);
      var people = [];
      for (var i = 0; i < 14; i++) { var p = person(c, -6 + (i % 7) * 2, i < 7 ? -3 : 3, i % 3 ? '#7aa2ff' : '#4fc3a1', '<b>Люди</b>: у каждого разум и свобода, но и первородный грех. Без власти они вредят друг другу.', 0.8); people.push(p); }
      var WI = '<b>Государство</b>: суд, законы, наказание, армия. Лектор: власть одних людей над другими — <b>не лучшее в человеке</b>, но это <b>вынужденное зло</b> для выживания в грешном мире.';
      var wall = c.mesh(new T.BoxGeometry(14, 1.6, 0.5), '#c9a24a', WI, { metalness: 0.3 }); wall.position.set(0, 0.8, 0);
      var crown = c.mesh(new T.TorusGeometry(0.6, 0.15, 8, 6), '#f0c36b', WI, { metalness: 0.8, roughness: 0.2 }); crown.rotation.x = Math.PI / 2; crown.position.set(0, 2.3, 0);
      c.label('Государство', [0, 3.3, 0], 0.55, '#f0c36b');
      var sins = []; for (var s = 0; s < 18; s++) { var b = c.mesh(new T.SphereGeometry(0.18, 10, 8), '#ef6b5b', '<b>Грех</b>: жадность, насилие, гордыня. По Августину, без власти они разрушили бы общество.'); sins.push(b); }
      c.state = { on: true };
      c.onFrame(function (t) {
        var on = c.state.on;
        wall.scale.y += ((on ? 1 : 0.02) - wall.scale.y) * 0.08; wall.visible = wall.scale.y > 0.05; crown.visible = on;
        sins.forEach(function (b, i) {
          var side = i % 2 ? 1 : -1, k = ((t * 0.35) + i / 18) % 1;
          var z = side * (3 - k * 6);
          if (on && side * z < 0.4) z = side * (0.4 + Math.abs(Math.sin(t * 3 + i)) * 0.3);
          b.position.set(-6 + (i % 7) * 2 + Math.sin(t + i) * 0.3, 1 + Math.sin(k * Math.PI) * 1.2, z);
        });
        people.forEach(function (p, i) { p.rotation.z = on ? 0 : Math.sin(t * 4 + i) * 0.12; });
      });
    },
    chips: [
      { t: 'Есть государство', small: 'порядок', on: function (c) { c.state.on = true; c.setView(0.5, 0.95, 19, 1.2); c.say('Задачи государства: <b>правопорядок</b>, <b>защита от внешней агрессии</b>, помощь в христианской жизни, <b>меньше насилия</b>.'); } },
      { t: 'Нет государства', small: 'хаос', on: function (c) { c.state.on = false; c.setView(0.9, 0.85, 17, 1.2); c.say('Грех свободно летит от одних людей к другим. <b>[ДОБАВЛЕНО]</b> Августин: «Что такое государства без справедливости, как не большие разбойничьи шайки?»'); } }
    ]
  });

  /* ---------- 7. Два града ---------- */
  reg('aug-cities3d', {
    title: 'Два града: Божий и земной', lead: 'Внизу — земной град, вверху — Град Божий. Золотые человечки принадлежат Граду Божьему, но живут внизу среди всех.',
    radius: 24, phi: 1.1, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(10, '#6f6a5a');
      var EI = '<b>Град земной</b>: сообщество тех, кто любит <b>себя</b> «вплоть до презрения к Богу». Империи, войны, налоги, слава.';
      for (var i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2, r = 4 + (i % 3) * 1.6, h = 1 + (i * 7 % 5) * 0.5; c.box3(1, h, 1, i % 4 ? '#a88f6e' : '#8b6b5a', [Math.cos(a) * r, h / 2, Math.sin(a) * r], EI); }
      var tower = c.mesh(new T.CylinderGeometry(0.8, 1.1, 4, 8), '#8b6b5a', EI + ' Высокая башня — гордыня и жажда власти.'); tower.position.set(0, 2, 0);
      c.label('Град земной', [6, 4, 0], 0.6);
      var HI = '<b>Град Божий</b>: сообщество тех, кто любит <b>Бога</b> «вплоть до презрения к себе». Вне времени и вне конкретного государства. <b>Идеал и образец</b>, к которому должно стремиться государство.';
      var sky = group(c, 0, 9, 0);
      into(sky, c.mesh(new T.CylinderGeometry(5, 5.4, 0.4, 48), '#fff6d8', HI, { emissive: new T.Color('#6b5a1f'), emissiveIntensity: 0.5 }));
      for (var k = 0; k < 12; k++) { var a2 = k / 12 * Math.PI * 2; var w = into(sky, c.mesh(new T.CylinderGeometry(0.22, 0.22, 2.2, 10), '#f3efe6', HI)); w.position.set(Math.cos(a2) * 4.3, 1.3, Math.sin(a2) * 4.3); }
      var dome = into(sky, c.mesh(new T.SphereGeometry(2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), '#f0c36b', HI, { metalness: 0.6, roughness: 0.25 })); dome.position.y = 0.2;
      var cg = new T.Group(); cg.position.set(0, 2.9, 0); sky.add(cg); cross(c, cg, '#f0c36b', HI, 1.2);
      c.label('Град Божий', [6, 10.5, 0], 0.6, '#f0c36b');
      var citizens = [];
      for (var p = 0; p < 18; p++) { var a3 = p * 2.4, rr = 2.4 + (p % 4) * 1.5, gold = p % 3 === 0; var f = person(c, Math.cos(a3) * rr, Math.sin(a3) * rr, gold ? '#f0c36b' : '#7a8296', gold ? '<b>Гражданин Града Божьего</b>: живёт в обычном городе среди остальных. До конца истории грады <b>перемешаны</b>, их не разделить.' : '<b>Житель земного града</b>: любовь к себе, к власти, к земным благам.', 0.6); f.userData.gold = gold; citizens.push(f); }
      var beam = c.mesh(new T.CylinderGeometry(0.15, 1.6, 8, 24, 1, true), '#fff3c4', 'Связь градов: государство должно стремиться к Граду Божьему как к образцу.', { transparent: true, opacity: 0.18, side: T.DoubleSide }); beam.position.y = 5;
      c.state = { m: 0 };
      c.onFrame(function (t) {
        sky.position.y = 9 + Math.sin(t) * 0.2; sky.rotation.y = t * 0.1;
        citizens.forEach(function (f, i) {
          var rise = c.state.m === 2 && f.userData.gold;
          f.position.y += ((rise ? 9.4 : 0) - f.position.y) * 0.03;
          f.visible = !(c.state.m === 2 && !f.userData.gold && Math.sin(t * 3 + i) > 2);
        });
        beam.visible = c.state.m !== 2;
      });
    },
    chips: [
      { t: 'Две любви', small: 'главная формула', on: function (c) { c.state.m = 0; c.setView(0.6, 1.1, 24, 3); c.say('<b>[ДОБАВЛЕНО]</b> «Два града созданы двумя родами любви: земной — любовью к себе вплоть до презрения к Богу, небесный — любовью к Богу вплоть до презрения к себе».'); } },
      { t: 'Перемешаны', small: 'в истории', on: function (c) { c.state.m = 1; c.setView(0.9, 0.7, 16, 1); c.say('Пока идёт история, граждане обоих градов живут рядом. Ни одно государство не является «Градом Божьим» целиком, даже в церкви есть грешники.'); } },
      { t: 'Конец истории', small: 'разделение', on: function (c) { c.state.m = 2; c.setView(0.4, 1.2, 26, 5); c.say('На Страшном суде грады окончательно разделятся. Граждане Града Божьего обретают вечный мир.'); } }
    ]
  });

  /* ---------- 8. Церковный суд и светская власть ---------- */
  reg('aug-court3d', {
    title: 'Кто наказывает: церковь или князь', lead: 'Слева церковный суд (без меча), справа светская власть (с мечом). Посмотри, куда идёт осуждённый.',
    radius: 18, phi: 1.0, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var CI = '<b>Церковный суд</b>: выносит приговор. Лектор: у церкви <b>нет армии и полиции</b>, священники сами никого не казнили и не сжигали.';
      c.box3(3.6, 0.6, 2.2, '#f3efe6', [-4, 0.3, 0], CI);
      var bishop = person(c, -4, -0.3, '#b07cff', CI, 1.1);
      var mitre = c.mesh(new T.ConeGeometry(0.28, 0.6, 12), '#f3efe6', CI); mitre.position.set(-4, 2.2, -0.3);
      var book = c.box3(0.9, 0.15, 0.6, '#c9a24a', [-4, 0.75, 0.6], '<b>Приговор</b>: человек признан еретиком.');
      c.label('Церковь', [-4, 3.5, 0], 0.55, '#c49bff');
      var SI = '<b>Светская власть</b>: у неё есть меч — право принуждать и казнить. Наказание исполняет она.';
      c.box3(3.6, 0.6, 2.2, '#8b6b5a', [4, 0.3, 0], SI);
      var prince = person(c, 4, -0.3, '#bf5b4a', SI, 1.1);
      var crown = c.mesh(new T.TorusGeometry(0.28, 0.08, 8, 6), '#f0c36b', SI, { metalness: 0.8 }); crown.rotation.x = Math.PI / 2; crown.position.set(4, 2.15, -0.3);
      var sword = c.mesh(new T.BoxGeometry(0.1, 1.8, 0.22), '#c8ccd8', SI, { metalness: 0.9, roughness: 0.2 }); sword.position.set(4.7, 1.6, 0.2);
      c.label('Князь', [4, 3.5, 0], 0.55, '#ff9a8a');
      var man = person(c, -4, 2, '#9aa0b4', '<b>Осуждённый</b>: церковь «передаёт его в руки светской власти». <b>[ДОБАВЛЕНО]</b> лат. <i>relaxatio ad brachium saeculare</i>.', 0.9);
      var bridge = c.mesh(new T.BoxGeometry(8, 0.08, 0.8), '#c9a24a', 'Передача осуждённого из церковного суда светской власти.', { transparent: true, opacity: 0.5 }); bridge.position.set(0, 0.05, 2);
      c.state = { m: 0 };
      c.onFrame(function (t) {
        var k = c.state.m === 1 ? (t * 0.2) % 1 : 0;
        man.position.set(-4 + k * 8, 0, 2);
        sword.rotation.z = c.state.m === 1 && k > 0.85 ? -0.8 : 0;
        book.rotation.y = t * 0.6;
      });
    },
    chips: [
      { t: 'Приговор', small: 'церковный суд', on: function (c) { c.state.m = 0; c.setView(-0.4, 1.0, 14, 1.2, -3); c.say('Церковь судит за преступления против веры, но сама не наказывает телесно.'); } },
      { t: 'Передача', small: 'светской власти', on: function (c) { c.state.m = 1; c.setView(0.3, 1.0, 18, 1.2); c.say('Осуждённого передают князю, и казнит уже он. Лектор и студенты: так церковь будто <b>снимала с себя ответственность</b>.'); } }
    ]
  });

  /* ---------- 9. Справедливая война ---------- */
  reg('aug-war3d', {
    title: 'Справедливая война: весы', lead: 'Положи на весы условия. Война справедлива, только если перевешивает защита и мир. Нажимай кнопки.',
    radius: 17, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE;
      c.ground(8);
      var base = c.mesh(new T.CylinderGeometry(0.25, 0.6, 4, 16), '#c9a24a', 'Весы справедливости.', { metalness: 0.6 }); base.position.y = 2;
      var beam = group(c, 0, 4.1, 0);
      into(beam, c.mesh(new T.BoxGeometry(7, 0.18, 0.18), '#c9a24a', 'Коромысло весов.', { metalness: 0.6 }));
      var L = new T.Group(), R = new T.Group(); L.position.x = -3.4; R.position.x = 3.4; beam.add(L); beam.add(R);
      function pan(g, col, info) { into(g, c.mesh(new T.CylinderGeometry(1.2, 1.2, 0.12, 24), col, info)).position.y = -1.6; into(g, c.mesh(new T.CylinderGeometry(0.02, 0.02, 1.6, 6), '#c9a24a', info)).position.y = -0.8; }
      pan(L, '#4fc3a1', '<b>Чаша «справедливо»</b>: защита отечества, законная власть, цель — мир.');
      pan(R, '#ef6b5b', '<b>Чаша «несправедливо»</b>: грабёж, месть, жажда славы и добычи.');
      c.label('Справедливо', [-3.4, 0.4, 1.5], 0.45, '#7be0c0'); c.label('Несправедливо', [3.4, 0.4, 1.5], 0.45, '#ff9a8a');
      var W = {
        def: [L, '#4fc3a1', '<b>Защита отечества</b>, отражение нападения — критерий, который назвал лектор.'],
        auth: [L, '#7aa2ff', '<b>[ДОБАВЛЕНО] Законная власть</b>: войну объявляет правитель, а не частное лицо.'],
        aim: [L, '#f0c36b', '<b>[ДОБАВЛЕНО] Правильное намерение</b>: цель — мир, а не месть. Соответствует идее Града Божьего.'],
        loot: [R, '#ef6b5b', '<b>Грабёж и добыча</b> — делает войну несправедливой.'],
        rev: [R, '#b0475a', '<b>Месть и ненависть</b> — делают войну несправедливой.']
      };
      var blocks = {};
      Object.keys(W).forEach(function (k, i) { var w = W[k]; var b = c.mesh(new T.BoxGeometry(0.7, 0.5, 0.7), w[1], w[2]); w[0].add(b); b.position.set(((i % 3) - 1) * 0.75, -1.3, 0); b.visible = false; blocks[k] = b; });
      c.state = { on: {} };
      c.onFrame(function (t) {
        var l = 0, r = 0; Object.keys(blocks).forEach(function (k) { blocks[k].visible = !!c.state.on[k]; if (c.state.on[k]) { if (W[k][0] === L) l++; else r++; } });
        var tilt = Math.max(-0.35, Math.min(0.35, (r - l) * 0.12));
        beam.rotation.z += (tilt - beam.rotation.z) * 0.06;
        L.rotation.z = -beam.rotation.z; R.rotation.z = -beam.rotation.z;
      });
      c.verdict = function () { var l = 0, r = 0; Object.keys(c.state.on).forEach(function (k) { if (c.state.on[k]) { if (W[k][0] === L) l++; else r++; } }); return r > 0 ? '❌ Есть корыстная цель — война <b>несправедлива</b>.' : l >= 2 ? '✅ Война <b>справедлива</b>: защита и стремление к миру.' : 'Условий пока мало. Добавь ещё.'; };
    },
    chips: [
      { t: '+ Защита', small: 'отечества', on: function (c) { c.state.on.def = !c.state.on.def; c.say('Защита от нападения. ' + c.verdict()); } },
      { t: '+ Законная власть', small: 'правитель', on: function (c) { c.state.on.auth = !c.state.on.auth; c.say('<b>[ДОБАВЛЕНО]</b> Войну объявляет законный правитель. ' + c.verdict()); } },
      { t: '+ Цель — мир', small: 'намерение', on: function (c) { c.state.on.aim = !c.state.on.aim; c.say('Цель — восстановить мир. ' + c.verdict()); } },
      { t: '+ Добыча', small: 'грабёж', on: function (c) { c.state.on.loot = !c.state.on.loot; c.say('Добыча и грабёж. ' + c.verdict()); } },
      { t: '+ Месть', small: 'ненависть', on: function (c) { c.state.on.rev = !c.state.on.rev; c.say('Месть. ' + c.verdict()); } }
    ]
  });

  /* ---------- 10. Время ---------- */
  reg('aug-time3d', {
    title: 'Что такое время по Августину', lead: 'Прошлого уже нет, будущего ещё нет. Есть только «сейчас» — светящаяся точка. Нажми на части.',
    radius: 18, phi: 1.1, targetY: 1.5,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var past = []; for (var i = 0; i < 12; i++) { var p = c.mesh(new T.BoxGeometry(0.5, 0.5, 0.5), '#7aa2ff', '<b>Прошлое</b>: его уже нет. <b>[ДОБАВЛЕНО]</b> Оно живёт только в <b>памяти</b> души.', { transparent: true }); past.push(p); }
      var fut = []; for (var k = 0; k < 12; k++) { var f = c.mesh(new T.SphereGeometry(0.3, 12, 8), '#b07cff', '<b>Будущее</b>: его ещё нет. <b>[ДОБАВЛЕНО]</b> Оно живёт в <b>ожидании</b>.', { transparent: true, opacity: 0.35 }); fut.push(f); }
      var now = c.mesh(new T.SphereGeometry(0.75, 24, 16), '#f0c36b', '<b>Настоящее</b>: единственное, что у нас есть. <b>[ДОБАВЛЕНО]</b> Это <b>внимание</b> души.', { emissive: new T.Color('#8a6a10'), emissiveIntensity: 0.8 }); now.position.set(0, 1.5, 0);
      c.label('Память', [-5, 3.4, 0], 0.55, '#7aa2ff'); c.label('Сейчас', [0, 3.2, 0], 0.55, '#f0c36b'); c.label('Ожидание', [5, 3.4, 0], 0.55, '#c49bff');
      var soul = c.mesh(new T.TorusGeometry(7, 0.06, 8, 80), '#f0c36b', '<b>Душа</b> удерживает все три времени: прошлое в памяти, будущее в ожидании.', { transparent: true, opacity: 0.4 }); soul.rotation.x = Math.PI / 2; soul.position.y = 1.5;
      c.state = { speed: 1 };
      var clock = 0, last = 0;
      c.onFrame(function (t) {
        var dt = t - last; last = t; clock += dt * c.state.speed;
        past.forEach(function (p, i) { var k = ((clock * 0.15) + i / 12) % 1; p.position.set(-1 - k * 7, 1.5 - k * 0.6, Math.sin(i) * 0.6); p.material.opacity = 1 - k; p.rotation.y = clock; });
        fut.forEach(function (f, i) { var k = ((clock * 0.15) + i / 12) % 1; f.position.set(8 - k * 7, 1.5 + (1 - k) * 0.6, Math.cos(i) * 0.6); f.material.opacity = 0.1 + k * 0.5; });
        now.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
      });
    },
    chips: [
      { t: 'Три времени', small: 'память · внимание · ожидание', on: function (c) { c.state.speed = 1; c.setView(0.3, 1.1, 18, 1.5); c.say('<b>[ДОБАВЛЕНО]</b> «Исповедь», кн. 11: «Что такое время? Если никто не спрашивает — знаю; если хочу объяснить — не знаю».'); } },
      { t: 'В радости', small: 'быстро', on: function (c) { c.state.speed = 3; c.say('Лектор: скорость течения времени меняется. В радости оно летит.'); } },
      { t: 'В беде', small: 'медленно', on: function (c) { c.state.speed = 0.2; c.say('В тюрьме или в беде время тянется. Это <b>психологическое</b> время.'); } }
    ]
  });

  /* ---------- 11. Предел познания ---------- */
  reg('aug-knowledge3d', {
    title: 'Познание: бесконечное приближение', lead: 'Ступени — шаги науки внутри творения. Каждая ближе к золотой полосе — истине, но ни одна её не достигает.',
    radius: 19, phi: 1.3, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      c.ground(9);
      var TI = '<b>Истина</b> (основание мира — Бог). Наука к ней приближается, но, по словам лектора, никогда её не достигнет полностью.';
      var truth = c.mesh(new T.BoxGeometry(11, 0.12, 2.4), '#f0c36b', TI, { transparent: true, opacity: 0.55, emissive: new T.Color('#6b5a1f') }); truth.position.set(0, 6, 0);
      c.label('Истина', [0, 7, 0], 0.6, '#f0c36b');
      var steps = [];
      for (var i = 0; i < 10; i++) { var h = 6 * (1 - Math.pow(0.65, i + 1)); var s = c.mesh(new T.BoxGeometry(1, 0.18, 1.6), i < 3 ? '#7aa2ff' : i < 6 ? '#4fc3a1' : '#b07cff', '<b>Шаг познания №' + (i + 1) + '</b>: высота ' + (h / 6 * 100).toFixed(1) + '% до истины. Каждый новый шаг меньше прежнего — до конца не дойти.'); s.position.set(-4.5 + i * 1, h, 0); steps.push(s); }
      var climber = person(c, -4.5, 0, '#ef6b5b', '<b>Учёный</b> поднимается к истине.', 0.6);
      var bang = c.mesh(new T.IcosahedronGeometry(0.8, 1), '#ff9a5a', '<b>Большой взрыв</b>: начало модели Вселенной. Лектор: что было «до» него, мы не знаем — наука работает <b>внутри творения</b>.', { emissive: new T.Color('#7a2a0a'), flatShading: true }); bang.position.set(4.5, 1.2, -3.5);
      c.label('Большой взрыв', [4.5, 2.8, -3.5], 0.45);
      c.onFrame(function (t) {
        var k = (t * 0.6) % 10, i = Math.floor(k), s = steps[i];
        climber.position.set(s.position.x, s.position.y + 0.09, 0);
        bang.rotation.y = t; bang.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
      });
    },
    chips: [
      { t: 'Лестница', small: 'асимптота', on: function (c) { c.setView(0.2, 1.3, 19, 3); c.say('Каждая ступень ближе к истине, но разрыв никогда не исчезает. Это как идти к горизонту.'); } },
      { t: 'Большой взрыв', small: 'граница науки', on: function (c) { c.setView(1.0, 1.1, 12, 1.5, 3); c.say('Человек не может создать «из ничего». Научное познание заключено <b>в рамках творения</b>.'); } }
    ]
  });

  /* ---------- 12. Цель за горизонтом ---------- */
  reg('aug-horizon3d', {
    title: 'Цель за горизонтом', lead: 'Люди идут к светящейся цели. Убери её и посмотри, что станет с колонной.',
    radius: 22, phi: 1.15, targetY: 1,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(14, 0.2, 26), '#5f6b4a', 'Земля.').position.y = -0.1;
      c.mesh(new T.BoxGeometry(2, 0.05, 26), '#a89f84', 'Дорога — путь государства.').position.y = 0.03;
      var GI = '<b>Загоризонтная цель</b>: у христиан — Град Божий и спасение. Её нельзя достичь на земле, но к ней можно бесконечно идти.';
      var star = c.mesh(new T.OctahedronGeometry(1.2), '#fff3c4', GI, { emissive: new T.Color('#c9a24a'), emissiveIntensity: 1 }); star.position.set(0, 4, -13);
      var halo = c.mesh(new T.SphereGeometry(2.2, 20, 12), '#fff3c4', GI, { transparent: true, opacity: 0.15 }); halo.position.copy(star.position);
      var ppl = [];
      for (var i = 0; i < 24; i++) { var p = person(c, 0, 0, i % 4 ? '#7aa2ff' : '#4fc3a1', '<b>Граждане</b>: пока цель видна, все идут в одну сторону.', 0.55); p.userData.seed = i; ppl.push(p); }
      c.state = { goal: true };
      c.onFrame(function (t) {
        var g = c.state.goal; star.visible = halo.visible = g; star.rotation.y = t;
        ppl.forEach(function (p, i) {
          var row = Math.floor(i / 3), col = i % 3 - 1;
          var tx, tz;
          if (g) { tx = col * 0.7; tz = 8 - row * 1.4 - ((t * 0.6) % 1.4); }
          else { var a = i * 2.39 + t * 0.15 * (i % 2 ? 1 : -1); tx = Math.cos(a) * (3 + (i % 5)); tz = Math.sin(a) * (3 + (i % 5)) + 2; }
          p.position.x += (tx - p.position.x) * 0.04; p.position.z += (tz - p.position.z) * 0.04;
          p.rotation.y = g ? Math.PI : Math.atan2(tx - p.position.x, tz - p.position.z);
        });
      });
    },
    chips: [
      { t: 'Цель видна', small: 'общий курс', on: function (c) { c.state.goal = true; c.setView(0.2, 1.15, 22, 1); c.say('Лектор: без плана и идеи, куда оно движется, государство <b>не может существовать</b>.'); } },
      { t: 'Цель исчезла', small: '1980-е', on: function (c) { c.state.goal = false; c.setView(0.6, 0.9, 20, 1); c.say('Лектор: в 1980-е в СССР исчезла загоризонтная цель, коммунисты сами отказались от идеи — и система <b>рассыпалась</b>.'); } }
    ]
  });

  /* ---------- Мини-тест ---------- */
  HubWidgets.register('aug-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Августин и средневековая мысль</b></div><p class="wg-lead">10 вопросов по лекции. Выбери ответ.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Как лектор объяснил наступление Средневековья?', ['Кризис римской государственности и старой идеологии', 'Изобретение книгопечатания', 'Победа ислама в Европе'], 0, 'Христианство заново дало смысл объединению больших территорий.'],
      ['Что такое провиденциализм?', ['Мир создан из ничего', 'Бог (Провидение) направляет историю', 'Душа перевоплощается бесконечно'], 1, 'Креационизм — про сотворение, провиденциализм — про управление историей.'],
      ['Какой представляли историю христиане?', ['Круг, всё повторяется', 'Линия с началом, смыслом и концом', 'Хаос без смысла'], 1, 'Сотворение → грехопадение → Христос → конец света.'],
      ['Может ли Бог отнять у человека свободу воли (по лектору)?', ['Не может', 'Может и делает это', 'Может, но не хочет'], 2, 'Свобода и делает историю человеческой.'],
      ['Чем является государство для Августина?', ['Совершенным творением разума', 'Несовершенным институтом, вынужденным злом', 'Градом Божьим на земле'], 1, 'Оно отражает пороки человеческой природы.'],
      ['Что создало Град земной?', ['Любовь к себе вплоть до презрения к Богу', 'Любовь к Богу', 'Страх перед врагами'], 0, 'Град Божий — любовь к Богу вплоть до презрения к себе.'],
      ['Кто исполнял казнь осуждённого церковным судом?', ['Сами священники', 'Светская власть', 'Никто, казней не было'], 1, 'Церковь передавала осуждённого в руки светской власти.'],
      ['Какой критерий справедливой войны назвал лектор?', ['Захват богатых земель', 'Распространение веры силой', 'Защита отечества от нападения'], 2, 'И война должна соответствовать идее Града Божьего.'],
      ['Что, по Августину, есть у нас из трёх времён?', ['Только настоящее', 'Только прошлое', 'Только будущее'], 0, 'Прошлого уже нет, будущего ещё нет.'],
      ['Почему, по мнению лектора, рассыпалась советская система?', ['Из-за нехватки армии', 'Исчезла загоризонтная цель', 'Из-за слишком сильных репрессий'], 1, 'Без большой цели государство не может существовать.']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 100%'; b.style.textAlign = 'left'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 7 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; var b = btn('<b>Ещё раз ↺</b>'); b.style.textAlign = 'center'; b.onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
      qo.innerHTML = '<small style="color:var(--muted)">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + Q[i][0];
      Q[i][1].forEach(function (t, k) {
        btn(t).onclick = function () {
          if (done) return; done = true; var ok = k === Q[i][2]; if (ok) score++;
          Array.prototype.forEach.call(ch.children, function (x, j) { if (j === Q[i][2]) x.classList.add('on'); else if (j === k) x.classList.add('off'); });
          res.style.display = ''; res.innerHTML = (ok ? '✅ Верно. ' : '❌ Правильно: <b>' + Q[i][1][Q[i][2]] + '</b>. ') + Q[i][3];
          var n = btn('<b>Дальше ›</b>'); n.style.textAlign = 'center'; n.onclick = function () { i++; done = false; res.style.display = 'none'; draw(); };
        };
      });
    }
    draw();
  });
})();
