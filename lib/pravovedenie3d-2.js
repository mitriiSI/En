/* 3D-модели и мини-тест к конспекту «Формы права: законы, подзаконные акты, нормативные договоры» (Правоведение, 06.10).
   В Markdown: @@graph:fp-map3d@@ @@graph:fp-law-sub3d@@ @@graph:fp-votes3d@@ @@graph:fp-ukaz3d@@ @@graph:fp-who-what3d@@
   @@graph:fp-time3d@@ @@graph:fp-dogovor3d@@ @@graph:fp-england3d@@ @@graph:fp-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) { HubWidgets.register(name, function (box) { HubScene3d(box, opts); }); }
  function group(c) { var g = new c.THREE.Group(); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  function person(c, x, z, col, info, g, s) {
    var T = c.THREE; s = s || 1;
    var b = c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info); b.position.set(x, 0.45 * s, z);
    var h = c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), '#e8c6a0', info); h.position.set(x, 1.12 * s, z);
    if (g) { g.add(b); g.add(h); }
    return [b, h];
  }
  function sheet(c, col, info) {
    var T = c.THREE, m = c.mesh(new T.BoxGeometry(0.7, 0.04, 0.95), col || '#f3efe6', info);
    var line = c.mesh(new T.BoxGeometry(0.5, 0.045, 0.05), '#9aa2c0'); line.position.set(0, 0, -0.25); m.add(line);
    var l2 = line.clone(); l2.position.z = -0.05; m.add(l2);
    var l3 = line.clone(); l3.position.z = 0.15; l3.scale.x = 0.6; m.add(l3);
    return m;
  }
  function fadeAll(groups, keep) { Object.keys(groups).forEach(function (k) { var on = keep.indexOf(k) < 0; groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = on ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !on; } }); }); }

  /* ---------- 1. Карта форм права: пять островов вокруг суда ---------- */
  reg('fp-map3d', {
    title: 'Где «живут» нормы права', lead: 'Пять островов — пять форм права. Самый большой у нас — нормативный акт. Нажми на остров или на кнопку.',
    radius: 20, phi: 0.9, theta: 0.3, targetY: 0.8, height: 400,
    build: function (c) {
      var T = c.THREE, G = {};
      var data = [
        ['npa', 'Нормативный\nакт', '#4f7be0', 3.2, 0, '<b>Нормативный правовой акт</b> — закон, указ, постановление, приказ. В России и континентальной Европе — <b>главная</b> форма права.'],
        ['dog', 'Нормативный\nдоговор', '#4cc38a', 2.0, 1, '<b>Нормативный договор</b> — соглашение сторон с общими правилами: международный, Федеративный 1992 г., коллективный договор.'],
        ['prec', 'Прецедент', '#ef6b5b', 1.9, 2, '<b>Судебный прецедент</b> — решение суда по делу, обязательное для похожих дел. Главная форма в Англии и США.'],
        ['obych', 'Обычай', '#f0c36b', 1.6, 3, '<b>Правовой обычай</b> — правило из долгой практики, признанное государством. Пример — обычаи делового оборота (ст. 5 ГК РФ).'],
        ['doct', 'Доктрина,\nрелигия', '#b07cff', 1.6, 4, '<b>Доктрина</b> (труды учёных) и <b>религиозные тексты</b> (Коран и Сунна в мусульманском праве).']
      ];
      c.ground(10, '#16304a');
      data.forEach(function (d) {
        var g = group(c); G[d[0]] = g; var a = d[4] * Math.PI * 2 / 5 + 0.3, R = d[4] ? 6 : 0;
        var x = d[4] ? Math.sin(a) * R : 0, z = d[4] ? Math.cos(a) * R : 0;
        var isl = into(g, c.mesh(new T.CylinderGeometry(d[3], d[3] * 1.15, 0.6, 32), d[2], d[5])); isl.position.set(x, 0.3, z);
        if (d[0] === 'npa') { for (var i = 0; i < 4; i++) { var b = into(g, c.box3(2.2 - i * 0.45, 0.45, 1.4 - i * 0.25, ['#2f4fa8', '#3b62c4', '#5b84e8', '#9ab5ff'][i], [0, 0.85 + i * 0.45, 0], d[5])); } }
        else if (d[0] === 'dog') { into(g, c.box3(0.5, 1.2, 0.5, '#2e8a60', [x - 0.6, 1.2, z], d[5])); into(g, c.box3(0.5, 1.2, 0.5, '#2e8a60', [x + 0.6, 1.2, z], d[5])); into(g, c.box3(1.4, 0.25, 0.3, '#e8c6a0', [x, 1.6, z], d[5])); }
        else if (d[0] === 'prec') { var gav = into(g, c.mesh(new T.CylinderGeometry(0.25, 0.25, 1.1, 14), '#8a5a3c', d[5])); gav.rotation.z = Math.PI / 2; gav.position.set(x, 1.4, z); into(g, c.box3(0.12, 1, 0.12, '#5b3a26', [x, 0.9, z], d[5])); g.userData.gav = gav; }
        else if (d[0] === 'obych') { for (var k = 0; k < 3; k++) person(c, x - 0.6 + k * 0.6, z, '#c49a3a', d[5], g, 0.7); }
        else { into(g, c.box3(1.2, 0.3, 0.9, '#6a4fb0', [x, 0.75, z], d[5])); into(g, c.box3(1.1, 0.25, 0.85, '#f3efe6', [x, 0.98, z], d[5])); }
        into(g, c.label(d[1], [x, d[0] === 'npa' ? 3.3 : 2.6, z], 0.5, '#eef0f8'));
      });
      c.groups = G;
      c.onFrame(function (t) { var g = G.prec.userData.gav; if (g) g.rotation.x = Math.sin(t * 3) * 0.4; });
    },
    chips: [
      { t: 'Все формы', on: function (c) { fadeAll(c.groups, Object.keys(c.groups)); c.setView(0.3, 0.9, 20, 0.8, 0, 0); c.say('Пять форм права. В центре — нормативный акт: у нас он главный.'); } },
      { t: 'Россия', on: function (c) { fadeAll(c.groups, ['npa', 'dog']); c.setView(0.3, 0.9, 16, 0.8, 0, 0); c.say('В России главное — <b>нормативные акты</b> и <b>нормативные договоры</b>. Обычай — редко, прецедент официально не признан.'); } },
      { t: 'Англия', on: function (c) { fadeAll(c.groups, ['prec', 'npa']); c.setView(2.6, 0.9, 16, 0.8, 0, 0); c.say('В Англии — <b>прецедент</b> плюс акты парламента (публичные и <b>частные</b>).'); } },
      { t: 'Мусульманское', on: function (c) { fadeAll(c.groups, ['doct', 'obych']); c.setView(-1.6, 0.9, 16, 0.8, 0, 0); c.say('Мусульманское право: <b>Коран, Сунна</b>, труды богословов и обычай.'); } }
    ]
  });

  /* ---------- 2. Закон и подзаконные акты: колонна и «полки» на ней ---------- */
  reg('fp-law-sub3d', {
    title: 'Закон и подзаконные акты', lead: 'Колонна «Конституция → закон» держит на себе полки подзаконных актов. Нажми «Противоречие» — бракованная полка падает.',
    radius: 16, phi: 1.05, theta: 0.5, targetY: 2.4, height: 400,
    build: function (c) {
      var T = c.THREE, G = { base: group(c), sub: group(c), bad: group(c) };
      c.ground(7);
      var iK = '<b>Конституция</b> — фундамент: высшая юридическая сила, прямое действие (ст. 15).';
      var iZ = '<b>Закон</b> — принимает парламент (или народ на референдуме), особая процедура, высшая сила после Конституции, регулирует <b>самое важное</b>.';
      into(G.base, c.box3(4.5, 0.8, 4.5, '#c8a24a', [0, 0.4, 0], iK)); into(G.base, c.label('КОНСТИТУЦИЯ', [0, 1.05, 2.6], 0.45, '#f0c36b'));
      into(G.base, c.mesh(new T.CylinderGeometry(0.9, 1.1, 5, 24), '#4f7be0', iZ)).position.set(0, 3.3, 0);
      into(G.base, c.label('ЗАКОН', [0, 6.2, 0], 0.6, '#9ab5ff'));
      var subs = [
        ['Указ Президента', '#ef6b5b', 4.8, 0, '<b>Указы и распоряжения Президента</b> (ст. 90). Не могут противоречить Конституции и законам.'],
        ['Постановление\nПравительства', '#4cc38a', 3.8, 2.1, '<b>Постановления и распоряжения Правительства</b> (ст. 115) — на основании и во исполнение законов и указов.'],
        ['Приказ\nминистерства', '#b07cff', 2.8, 4.2, '<b>Ведомственные акты</b> — приказы, инструкции. Касаются прав граждан — регистрация в Минюсте.'],
        ['Акт субъекта,\nмуниципальный', '#f0c36b', 1.9, 0.9, '<b>Акты субъектов и муниципальные акты</b> — по своим вопросам, в рамках закона.']
      ];
      subs.forEach(function (s, i) {
        var a = s[3]; var sh = into(G.sub, c.box3(2.4, 0.18, 1.2, s[1], [Math.cos(a) * 2.0, s[2], Math.sin(a) * 2.0], s[4])); sh.rotation.y = -a;
        into(G.sub, c.label(s[0], [Math.cos(a) * 3.0, s[2] + 0.6, Math.sin(a) * 3.0], 0.36, '#eef0f8'));
      });
      var iB = '<b>Подзаконный акт, противоречащий закону</b>, можно оспорить в суде — его признают недействующим. Прав всегда закон.';
      var bad = into(G.bad, c.box3(2.2, 0.18, 1.1, '#888c99', [-2.0, 3.3, -0.8], iB)); var bl = into(G.bad, c.label('приказ «против закона»', [-2.8, 4.0, -1.0], 0.34, '#ff9a8a'));
      c.groups = G; c.badFall = 0; c.bad = bad; c.bl = bl;
      c.onFrame(function () { if (c.badFall) { c.badFall = Math.min(1, c.badFall + 0.02); bad.position.y = 3.3 - c.badFall * 3.1; bad.rotation.z = c.badFall * 1.2; bl.position.y = 4.0 - c.badFall * 3.0; } });
    },
    chips: [
      { t: 'Закон', small: 'опора', on: function (c) { fadeAll(c.groups, ['base']); c.setView(0.5, 1.05, 14, 3); c.say('<b>Закон</b> держит всю систему. Только он регулирует права и свободы, налоги, преступления и наказания.'); } },
      { t: 'Подзаконные', small: 'полки', on: function (c) { fadeAll(c.groups, ['base', 'sub']); c.setView(1.4, 1.0, 15, 3); c.say('<b>Подзаконные акты</b> принимаются «на основании и во исполнение» закона. Принять их проще и быстрее.'); } },
      { t: 'Противоречие', small: 'что будет', on: function (c) { fadeAll(c.groups, ['base', 'sub', 'bad']); c.badFall = 0.01; c.setView(-0.6, 1.0, 14, 2.5); c.say('Полка «против закона» не держится: акт ниже не может спорить с актом выше. Суд признает его недействующим.'); } },
      { t: 'Сброс', on: function (c) { fadeAll(c.groups, Object.keys(c.groups)); c.badFall = 0; c.bad.position.y = 3.3; c.bad.rotation.z = 0; c.bl.position.y = 4.0; c.setView(0.5, 1.05, 16, 2.4); c.say('Нажми на любую полку.'); } }
    ]
  });

  /* ---------- 3. Голосование: ФЗ, ФКЗ, поправка (450 мест Думы + СФ) ---------- */
  reg('fp-votes3d', {
    title: 'Сколько голосов нужно', lead: 'Полукруг — 450 мест Госдумы, справа — Совет Федерации, сзади — 89 субъектов. Выбери вид закона: загорятся нужные голоса.',
    radius: 22, phi: 0.85, theta: 0.0, targetY: 0, height: 410,
    build: function (c) {
      var T = c.THREE; c.ground(11, '#1b2236');
      var seats = [], geo = new T.BoxGeometry(0.28, 0.35, 0.28), n = 0;
      var iD = '<b>Государственная Дума</b>: 450 депутатов. ФЗ — больше половины (226), ФКЗ и поправка — 2/3 (300).';
      for (var row = 0; row < 9 && n < 450; row++) {
        var R = 3 + row * 0.62, cnt = Math.round(Math.PI * R / 0.42);
        for (var k = 0; k < cnt && n < 450; k++, n++) { var a = Math.PI * (k + 0.5) / cnt; var m = c.mesh(geo, '#3a4058', iD); m.position.set(-Math.cos(a) * R - 1.5, 0.18 + row * 0.08, -Math.sin(a) * R + 3); seats.push(m); }
      }
      seats.sort(function (p, q) { return p.position.x - q.position.x; });
      var sf = [], iS = '<b>Совет Федерации</b>: по два представителя от субъекта и др. ФЗ — больше половины, ФКЗ и поправка — 3/4.';
      for (var j = 0; j < 100; j++) { var s = c.mesh(geo, '#3a4058', iS); s.position.set(6.2 + (j % 10) * 0.38, 0.18, -1 + Math.floor(j / 10) * 0.38); sf.push(s); }
      var reg89 = [], iR = '<b>Субъекты РФ</b>: поправка к гл. 3–8 Конституции вступает в силу, только если её одобрят законодательные органы <b>2/3</b> субъектов.';
      for (var r = 0; r < 89; r++) { var g = c.mesh(new T.CylinderGeometry(0.15, 0.15, 0.3, 8), '#3a4058', iR); g.position.set(-6 + (r % 30) * 0.42, 0.15, -6 - Math.floor(r / 30) * 0.45); reg89.push(g); }
      c.label('Госдума · 450', [-1.5, 2.2, 3], 0.55, '#9ab5ff'); c.label('Совет\nФедерации', [7.9, 1.7, 0.8], 0.45, '#f0c36b'); c.label('Субъекты РФ · 89', [0, 1.1, -7.6], 0.45, '#4cc38a');
      var veto = c.label('', [0, 4.2, 0], 0.6, '#eef0f8');
      c.light = function (gd, sfShare, regShare, vetoText, col) {
        seats.forEach(function (m, i) { m.material.color.set(i < gd ? col : '#3a4058'); });
        sf.forEach(function (m, i) { m.material.color.set(i < Math.ceil(sfShare * 100) ? col : '#3a4058'); });
        reg89.forEach(function (m, i) { m.material.color.set(i < Math.ceil(regShare * 89) ? '#4cc38a' : '#3a4058'); });
        c.root.remove(veto); veto = c.label(vetoText, [0, 4.4, 0], 0.55, '#eef0f8');
      };
      c.light(0, 0, 0, 'Выбери вид закона', '#4f7be0');
    },
    chips: [
      { t: 'Федеральный закон', small: '1/2 + 1/2', on: function (c) { c.light(226, 0.51, 0, 'ФЗ: вето Президента возможно', '#4f7be0'); c.say('<b>ФЗ</b>: Дума — 226 из 450, Совет Федерации — больше половины (или молчит 14 дней). Президент может наложить <b>вето</b>, его преодолевают 2/3 обеих палат.'); } },
      { t: 'ФКЗ', small: '2/3 + 3/4', on: function (c) { c.light(300, 0.75, 0, 'ФКЗ: вето невозможно', '#ef6b5b'); c.say('<b>ФКЗ</b>: Дума — 300 из 450 (2/3), Совет Федерации — 3/4. Президент <b>обязан</b> подписать за 14 дней.'); } },
      { t: 'Поправка гл. 3–8', small: '+ 2/3 регионов', on: function (c) { c.light(300, 0.75, 2 / 3, 'Поправка: ещё 2/3 регионов', '#b07cff'); c.say('<b>Закон о поправке</b> к гл. 3–8: как ФКЗ, плюс одобрение <b>2/3 субъектов</b> (60 из 89). Главы 1, 2, 9 так не меняются — только Конституционное Собрание.'); } }
    ]
  });

  /* ---------- 4. Путь указа Президента: конвейер согласований ---------- */
  reg('fp-ukaz3d', {
    title: 'Как рождается указ Президента', lead: 'Проект едет по конвейеру: министерства → Минфин → правовое управление → подпись → публикация. Лектор: «и только потом Президент его подписал».',
    radius: 18, phi: 1.0, theta: 0.35, targetY: 1, height: 390,
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var belt = c.box3(16, 0.25, 1.4, '#2a2f44', [0, 0.6, 0], 'Конвейер согласований. Указ принимается <b>проще, чем закон</b>: без голосования палат.');
      var st = [
        [-6.5, '#9aa2c0', 'Проект', '<b>1. Проект</b> готовит министерство или Администрация Президента.'],
        [-3.2, '#4cc38a', 'Министерства', '<b>2. Согласование</b> с заинтересованными ведомствами: «есть ли какие-то мнения…» (лектор).'],
        [0, '#f0c36b', 'Минфин', '<b>3. Минфин</b> — «если там деньги…» (лектор). Указ не должен требовать денег, которых нет в бюджете.'],
        [3.2, '#6fa0ff', 'Правовое\nуправление', '<b>4. Государственно-правовое управление</b> проверяет: не противоречит ли проект Конституции и законам.'],
        [6.5, '#ef6b5b', 'Подпись\n+ 7 дней', '<b>5. Подпись Президента</b> и официальное опубликование. Нормативный указ вступает в силу <b>через 7 дней</b>.']
      ];
      st.forEach(function (s) {
        c.box3(1.8, 1.8, 0.4, s[1], [s[0], 1.6, -1.2], s[3]);
        c.box3(0.3, 1.0, 0.3, '#444a60', [s[0], 0.5, -1.2], s[3]);
        c.label(s[2], [s[0], 3.2, -1.2], 0.42, '#eef0f8');
      });
      person(c, 6.5, -2.4, '#222838', '<b>Президент</b> подписывает указ последним.', null, 1.1);
      var doc = sheet(c, '#fff4d6', 'Проект указа едет по конвейеру.'); var seal = c.mesh(new T.CylinderGeometry(0.2, 0.2, 0.1, 16), '#c0392b'); seal.visible = false; doc.add(seal); seal.position.set(0.15, 0.06, 0.25);
      var stamps = [];
      for (var i = 0; i < 4; i++) { var m = c.mesh(new T.BoxGeometry(0.12, 0.05, 0.12), st[i + 1][1]); m.visible = false; doc.add(m); m.position.set(-0.25 + i * 0.13, 0.05, 0.35); stamps.push(m); }
      c.onFrame(function (t) {
        var q = (t * 0.09) % 1, x = -7.5 + q * 15.5; doc.position.set(x, 0.78 + Math.abs(Math.sin(t * 6)) * 0.03, 0);
        stamps.forEach(function (m, i) { m.visible = x > st[i + 1][0]; }); seal.visible = x > 6.5;
      });
    },
    chips: [
      { t: 'Весь путь', on: function (c) { c.setView(0.35, 1.0, 18, 1); c.say('Пять шагов. На каждом станке документ получает «отметку» согласования.'); } },
      { t: 'Минфин', on: function (c) { c.setView(0.1, 0.95, 9, 1.5, 0, 0); c.say('«Если там деньги — Министерство финансов». Без его визы указ, требующий расходов, не пройдёт.'); } },
      { t: 'Подпись', on: function (c) { c.setView(0.6, 0.95, 9, 1.5, 6.5, 0); c.say('Подпись и публикация. Указ — быстрее закона: не нужны чтения в Думе и одобрение Совета Федерации.'); } }
    ]
  });

  /* ---------- 5. Кто что издаёт: органы и их «оружие» ---------- */
  reg('fp-who-what3d', {
    title: 'Кто какой акт издаёт', lead: 'Пять зданий — пять органов власти. Над каждым крутятся их документы. Нажми на здание.',
    radius: 19, phi: 0.95, theta: 0.2, targetY: 1.5, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var B = [
        [-6, '#ef6b5b', 'Президент', ['указ', 'распоряжение'], '<b>Президент</b>: <b>указы</b> (важные и нормативные) и <b>распоряжения</b> (оперативные). Ст. 90.'],
        [-3, '#6fa0ff', 'Госдума', ['закон', 'постановление'], '<b>Государственная Дума</b>: принимает <b>законы</b>, по своим вопросам — <b>постановления</b> (амнистия, согласие на назначение премьера).'],
        [0, '#f0c36b', 'Совет\nФедерации', ['одобрение', 'постановление'], '<b>Совет Федерации</b>: одобряет законы, по своим вопросам — <b>постановления</b> (назначение выборов Президента, утверждение военного положения).'],
        [3, '#4cc38a', 'Правительство', ['постановление', 'распоряжение'], '<b>Правительство</b>: <b>постановления</b> (нормативные, например ПДД) и <b>распоряжения</b>. Ст. 115.'],
        [6, '#b07cff', 'Министерство', ['приказ', 'инструкция'], '<b>Министерства и ведомства</b>: <b>приказы, инструкции, положения</b>. Если касаются прав граждан — регистрация в Минюсте.']
      ];
      var spin = [];
      B.forEach(function (b, i) {
        var h = [3.2, 2.6, 2.4, 2.8, 2.0][i];
        c.box3(2.0, h, 1.8, b[1], [b[0], h / 2, 0], b[4]);
        for (var k = 0; k < 4; k++) c.box3(0.2, h * 0.9, 0.2, '#e8e8f0', [b[0] - 0.75 + k * 0.5, h * 0.45, 0.95], b[4]);
        c.box3(2.2, 0.3, 2.0, '#d9dbe6', [b[0], h + 0.15, 0], b[4]);
        c.label(b[2], [b[0], h + 0.9, 0], 0.42, '#eef0f8');
        var g = new T.Group(); g.position.set(b[0], h + 2.2, 0); c.root.add(g);
        b[3].forEach(function (d, j) { var sp = c.label(d, [Math.cos(j * Math.PI) * 1.0, 0, Math.sin(j * Math.PI) * 1.0], 0.32, '#ffe9a8'); c.root.remove(sp); g.add(sp); });
        spin.push(g);
      });
      c.onFrame(function (t) { spin.forEach(function (g, i) { g.rotation.y = t * 0.8 + i; g.position.y += Math.sin(t * 2 + i) * 0.003; }); });
    },
    chips: [
      { t: 'Президент', on: function (c) { c.setView(-0.3, 1.0, 10, 2, -6, 0); c.say('<b>Указ</b> и <b>распоряжение</b>.'); } },
      { t: 'Палаты', on: function (c) { c.setView(0, 1.0, 11, 2, -1.5, 0); c.say('Дума — <b>законы</b>; обе палаты по своим вопросам — <b>постановления</b>. Постановление палаты — не закон.'); } },
      { t: 'Правительство', on: function (c) { c.setView(0.3, 1.0, 10, 2, 3, 0); c.say('<b>Постановление</b> (нормативное) и <b>распоряжение</b> (текущее).'); } },
      { t: 'Все', on: function (c) { c.setView(0.2, 0.95, 19, 1.5, 0, 0); c.say('Название документа подсказывает, кто его издал и какая у него сила.'); } }
    ]
  });

  /* ---------- 6. Закон во времени: шкала и обратная сила ---------- */
  reg('fp-time3d', {
    title: 'Закон во времени', lead: 'Шкала времени: принят → подписан → опубликован → +10 дней → вступил в силу. Кнопки показывают отложенное вступление и обратную силу.',
    radius: 18, phi: 1.0, theta: 0.15, targetY: 1, height: 400,
    build: function (c) {
      var T = c.THREE, G = { line: group(c), delay: group(c), back: group(c) }; c.ground(10);
      into(G.line, c.box3(17, 0.2, 0.5, '#3a4058', [0, 0.3, 0], 'Шкала времени.'));
      var pts = [
        [-7, '#9aa2c0', 'принят\nДумой', 'Госдума <b>приняла</b> закон, Совет Федерации одобрил.'],
        [-4.5, '#f0c36b', 'подписан', 'Президент <b>подписал</b> (14 дней).'],
        [-2, '#6fa0ff', 'опубликован', '<b>Официальное опубликование</b>: «Российская газета», «Собрание законодательства», pravo.gov.ru. Без публикации — не применяется.'],
        [1.5, '#4cc38a', 'вступил\nв силу', '<b>Вступление в силу</b> — по общему правилу через <b>10 дней</b> после опубликования (указ — 7 дней).']
      ];
      pts.forEach(function (p) { into(G.line, c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.6, 20), p[1], p[3])).position.set(p[0], 0.6, 0); into(G.line, c.label(p[2], [p[0], 1.8, 0], 0.4, '#eef0f8')); });
      into(G.line, c.label('+10 дней', [-0.25, 0.9, 0.9], 0.36, '#9ab5ff'));
      var iDel = '<b>Отложенное вступление в силу</b>: закон сам назначает дату («с 1 января…») или откладывает отдельные статьи, чтобы все успели подготовиться. Ещё вариант — <b>отсылка</b>: «порядок установит Правительство».';
      into(G.delay, c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.6, 20), '#b07cff', iDel)).position.set(6, 0.6, 0);
      into(G.delay, c.label('отложенная\nстатья', [6, 1.8, 0], 0.4, '#c9a5ff'));
      var clock = into(G.delay, c.mesh(new T.TorusGeometry(0.6, 0.08, 8, 32), '#b07cff', iDel)); clock.position.set(6, 3.2, 0);
      var hand = into(G.delay, c.box3(0.06, 0.5, 0.06, '#eef0f8', [6, 3.2, 0], iDel));
      var iB = '<b>Обратная сила</b>: закон, который <b>смягчает</b> ответственность, распространяется и на прошлые дела. Закон, который <b>устанавливает или отягчает</b> ответственность, обратной силы <b>не имеет</b> (ст. 54).';
      var arrG = into(G.back, c.box3(7, 0.15, 0.15, '#4cc38a', [-2, 1.2, 1.6], iB)); into(G.back, c.label('смягчает ← ДА', [-4, 1.7, 1.6], 0.38, '#4cc38a'));
      var arrR = into(G.back, c.box3(7, 0.15, 0.15, '#ef6b5b', [-2, 1.2, -1.6], iB)); into(G.back, c.label('ухудшает ← НЕТ', [-4, 1.7, -1.6], 0.38, '#ef6b5b'));
      var wall = into(G.back, c.box3(0.2, 2.0, 0.9, '#ef6b5b', [-5.6, 1.0, -1.6], iB));
      var walker = person(c, 1.5, 0, '#e8e8f0', 'Это мы — живём по закону, который уже действует.', null, 0.8);
      c.groups = G; G.delay.visible = true;
      c.onFrame(function (t) { hand.rotation.z = -t * 2; hand.position.set(6 + Math.sin(-t * 2) * -0.25 * 0, 3.2, 0); var x = -7.5 + ((t * 0.12) % 1) * 15; walker[0].position.x = x; walker[1].position.x = x; });
    },
    chips: [
      { t: 'Обычный путь', on: function (c) { fadeAll(c.groups, ['line']); c.setView(0.15, 1.0, 16, 1); c.say('Принят → подписан → опубликован → <b>через 10 дней</b> вступил в силу.'); } },
      { t: 'Отложенный', on: function (c) { fadeAll(c.groups, ['line', 'delay']); c.setView(0.6, 1.0, 13, 1.5, 3, 0); c.say('Лектор: «в федеральном законе всё прописано… но дальше пишете, что…» — например, что статья заработает позже или после отдельного закона.'); } },
      { t: 'Обратная сила', on: function (c) { fadeAll(c.groups, ['line', 'back']); c.setView(-0.3, 0.9, 14, 1, -2, 0); c.say('Назад во времени проходит только <b>смягчающий</b> закон. Ухудшающий упирается в стену ст. 54.'); } }
    ]
  });

  /* ---------- 7. Нормативный договор: рукопожатие порождает правило для многих ---------- */
  reg('fp-dogovor3d', {
    title: 'Нормативный договор', lead: 'Две стороны жмут руки — и рождается правило для многих людей. Сравни с обычным договором «один на один».',
    radius: 17, phi: 1.0, theta: 0.3, targetY: 1.2, height: 390,
    build: function (c) {
      var T = c.THREE, G = { norm: group(c), civ: group(c) }; c.ground(9);
      var iN = '<b>Нормативный договор</b>: стороны договариваются об <b>общих правилах</b> для неопределённого круга лиц. Примеры: коллективный договор, Федеративный договор 1992 г., международный договор.';
      person(c, -4.2, -1, '#4f7be0', '<b>Сторона 1</b>: работодатель / Российская Федерация / государство А.', G.norm, 1.3);
      person(c, -1.8, -1, '#4cc38a', '<b>Сторона 2</b>: профсоюз / субъект РФ / государство Б.', G.norm, 1.3);
      into(G.norm, c.box3(1.6, 0.18, 0.18, '#e8c6a0', [-3, 1.1, -1], iN));
      var rules = []; for (var i = 0; i < 12; i++) { var p = person(c, -6 + (i % 6) * 1.0, 2 + Math.floor(i / 6) * 1.1, ['#6fa0ff', '#4cc38a', '#f0c36b', '#b07cff'][i % 4], iN, G.norm, 0.65); rules.push(p); }
      var big = into(G.norm, sheet(c, '#dff7ea', iN)); big.scale.set(2.2, 1, 2.2); big.position.set(-3, 2.6, -1);
      into(G.norm, c.label('правило для многих', [-3, 3.6, -1], 0.45, '#4cc38a'));
      var iC = '<b>Обычный (гражданско-правовой) договор</b>: «я продаю тебе велосипед». Касается только двоих и одной сделки — <b>нормы права не создаёт</b>.';
      person(c, 3, -0.5, '#ef6b5b', iC, G.civ, 1.1); person(c, 5, -0.5, '#f0c36b', iC, G.civ, 1.1);
      var bike = new T.Group(); G.civ.add(bike);
      [-0.5, 0.5].forEach(function (x) { var w = c.mesh(new T.TorusGeometry(0.35, 0.05, 8, 24), '#222838', iC); w.position.set(x, 0.4, 0); bike.add(w); });
      var fr = c.box3(1.0, 0.06, 0.06, '#ef6b5b', [0, 0.6, 0], iC); bike.add(fr); bike.position.set(4, 0, 0.8);
      into(G.civ, c.label('один на один', [4, 2.4, -0.5], 0.45, '#ff9a8a'));
      c.groups = G;
      c.onFrame(function (t) { big.position.y = 2.6 + Math.sin(t * 1.5) * 0.15; big.rotation.y = t * 0.4; bike.position.x = 4 + Math.sin(t) * 0.6; });
    },
    chips: [
      { t: 'Нормативный', on: function (c) { fadeAll(c.groups, ['norm']); c.setView(0.1, 1.0, 12, 1.5, -3, 0); c.say('Стороны договорились — правило действует для всех работников (или всех регионов, или всех граждан двух стран), даже для тех, кто придёт потом.'); } },
      { t: 'Обычный', on: function (c) { fadeAll(c.groups, ['civ']); c.setView(0.5, 1.0, 10, 1, 4, 0); c.say('Купля-продажа — частное дело двоих. Это <b>не</b> форма права.'); } },
      { t: 'Сравнить', on: function (c) { fadeAll(c.groups, ['norm', 'civ']); c.setView(0.3, 1.0, 17, 1.2, 0, 0); c.say('Главный вопрос: договор создаёт <b>общее правило</b> или решает <b>одну сделку</b>?'); } }
    ]
  });

  /* ---------- 8. Англия: публичный и частный акт, языки права ---------- */
  reg('fp-england3d', {
    title: 'Англия: частный закон и язык права', lead: 'Слева Парламент выпускает публичный акт для всей страны и частный — для одной компании или города. Справа — три языка английского права.',
    radius: 19, phi: 0.95, theta: 0.25, targetY: 1.4, height: 410,
    build: function (c) {
      var T = c.THREE, G = { parl: group(c), lang: group(c) }; c.ground(10);
      var iP = '<b>Парламент Великобритании</b> принимает публичные и частные акты.';
      into(G.parl, c.box3(4, 2, 2, '#c8b07a', [-4.5, 1, -2], iP));
      into(G.parl, c.box3(0.8, 4.5, 0.8, '#b39a62', [-2.4, 2.25, -2], '<b>Башня Елизаветы</b> («Биг-Бен») при Вестминстерском дворце.'));
      var face = into(G.parl, c.mesh(new T.CircleGeometry(0.3, 24), '#f3efe6', iP)); face.position.set(-2.4, 3.9, -1.59);
      into(G.parl, c.mesh(new T.ConeGeometry(0.6, 1, 4), '#6a5a3a', iP)).position.set(-2.4, 5, -2);
      var iPub = '<b>Публичный акт</b> (public general act) — для <b>всей страны</b>, как наш закон.';
      var iPri = '<b>Частный акт</b> (private act) — касается <b>конкретного</b> лица, компании, города, имения: например, разрешение провести железную дорогу через конкретные земли. Лектор: «Парламент принимает так называемый частный закон».';
      var pub = into(G.parl, sheet(c, '#dfe6ff', iPub)); pub.scale.set(1.6, 1, 1.6);
      var pri = into(G.parl, sheet(c, '#ffe1dc', iPri));
      into(G.parl, c.label('публичный', [-6.5, 2.6, 1.5], 0.4, '#9ab5ff')); into(G.parl, c.label('частный', [-2.5, 2.6, 1.5], 0.4, '#ff9a8a'));
      var town = into(G.parl, c.box3(0.9, 0.9, 0.9, '#ef6b5b', [-2.5, 0.45, 3], iPri));
      var crowd = []; for (var i = 0; i < 8; i++) crowd.push(person(c, -7.6 + (i % 4) * 0.7, 2.8 + Math.floor(i / 4) * 0.8, '#6fa0ff', iPub, G.parl, 0.6));
      var L = [
        [3, 'Латынь', '#b07cff', 'Записи судов и законы долго велись на <b>латыни</b>.'],
        [5.2, 'Law French', '#4f7be0', 'После 1066 г. — <b>юридический французский</b>. Отсюда слова <i>attorney, plaintiff, mortgage</i>.'],
        [7.4, 'English', '#4cc38a', '<b>Английский</b> — «язык простого люда» (лектор). Устные суды на английском с 1362 г., окончательно — с 1731 г.']
      ];
      L.forEach(function (l, i) { var h = [2.4, 2.0, 1.2 + 0.0][i]; into(G.lang, c.box3(1.6, h, 1.6, l[2], [l[0], h / 2, -1], l[3])); into(G.lang, c.label(l[1], [l[0], h + 0.6, -1], 0.42, '#eef0f8')); });
      into(G.lang, c.label('1066 → 1362 → 1731', [5.2, 3.8, -1], 0.42, '#f0c36b'));
      var grow = G.lang.children[4];
      c.groups = G;
      c.onFrame(function (t) {
        var q = (t * 0.3) % 1; pub.position.set(-4.5 - q * 2, 2.3 - q * 1.5, -1 + q * 3.5); pri.position.set(-3.5 + q * 1.0, 2.3 - q * 1.6, -1 + q * 3.5);
        var k = (Math.sin(t * 0.7) + 1) / 2; grow.scale.y = 0.6 + k * 1.6; grow.position.y = grow.scale.y * 0.6;
      });
    },
    chips: [
      { t: 'Публичный и частный', on: function (c) { fadeAll(c.groups, ['parl']); c.setView(0.3, 0.95, 13, 1.5, -4.5, 0); c.say('Публичный акт — для всех. Частный — для одного адресата (компания, город, имение).'); } },
      { t: 'Языки права', on: function (c) { fadeAll(c.groups, ['lang']); c.setView(0.1, 0.95, 12, 1.5, 5.2, 0); c.say('Латынь и французский веками вытесняли английский из судов. Английский «вырастает» к 1731 году.'); } },
      { t: 'Всё', on: function (c) { fadeAll(c.groups, ['parl', 'lang']); c.setView(0.25, 0.95, 19, 1.4, 0, 0); c.say('Нажми на любой объект.'); } }
    ]
  });

  /* ---------- Мини-тест ---------- */
  HubWidgets.register('fp-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Формы права</b></div><p class="wg-lead">10 вопросов по лекции 06.10.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Кто издаёт указы?', ['Правительство', 'Президент', 'Госдума'], 1, 'Указы и распоряжения — Президент (ст. 90).'],
      ['Какой акт издаёт Правительство?', ['Постановление', 'Указ', 'Закон'], 0, 'Постановления и распоряжения (ст. 115).'],
      ['Сколько голосов Думы нужно для ФКЗ?', ['226', '300', '450'], 1, '2/3 от 450 = 300. Плюс 3/4 Совета Федерации.'],
      ['Может ли Президент наложить вето на ФКЗ?', ['Да', 'Нет'], 1, 'Обязан подписать в течение 14 дней.'],
      ['Чем подзаконный акт отличается от закона?', ['Сильнее закона', 'Принимается на основании и во исполнение закона', 'Его принимает только народ'], 1, 'Он ниже закона и не может ему противоречить.'],
      ['Перед подписанием указа, требующего денег, проект обязательно согласуют с…', ['Минфином', 'Минобороны', 'Центробанком'], 0, '«Если там деньги — Министерство финансов» (лектор).'],
      ['Коллективный договор работодателя и профсоюза — это…', ['Нормативный договор', 'Гражданско-правовой договор', 'Указ'], 0, 'Содержит общие правила для всех работников.'],
      ['Закон, усиливающий наказание, имеет обратную силу?', ['Да', 'Нет'], 1, 'Ст. 54 Конституции: не имеет.'],
      ['Что такое «частный акт» в Англии?', ['Закон для одной компании, города, лица', 'Тайный закон', 'Закон, принятый королём'], 0, 'Private act — для конкретного адресата.'],
      ['Что сильнее при противоречии?', ['Федеральный закон', 'Международный договор РФ', 'Указ'], 1, 'Ч. 4 ст. 15: применяется договор (но Конституция выше).']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 120px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 7 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
      qo.innerHTML = '<small style="color:var(--muted)">Вопрос ' + (i + 1) + ' из ' + Q.length + '</small><br>' + Q[i][0];
      Q[i][1].forEach(function (t, k) {
        btn('<b>' + t + '</b>').onclick = function () {
          if (done) return; done = true; var ok = k === Q[i][2]; if (ok) score++;
          Array.prototype.forEach.call(ch.children, function (x, j) { if (j === Q[i][2]) x.classList.add('on'); else if (j === k) x.classList.add('off'); });
          res.style.display = ''; res.innerHTML = (ok ? '✅ Верно. ' : '❌ Правильно: <b>' + Q[i][1][Q[i][2]] + '</b>. ') + Q[i][3];
          btn('<b>Дальше ›</b>').onclick = function () { i++; done = false; res.style.display = 'none'; draw(); };
        };
      });
    }
    draw();
  });
})();
