/* 3D-модели и мини-тест к конспекту «Философия жизни: Фридрих Ницше» (Философия, 28.10).
   В Markdown: @@graph:nz-tragedy3d@@ @@graph:nz-tower3d@@ @@graph:nz-exchange3d@@ @@graph:nz-mountain3d@@
   @@graph:nz-will3d@@ @@graph:nz-herd3d@@ @@graph:nz-rope3d@@ @@graph:nz-meta3d@@ @@graph:nz-bank3d@@
   @@graph:nz-tablets3d@@ @@graph:nz-scales3d@@ @@graph:nz-sea3d@@ @@graph:nz-return3d@@ @@graph:nz-quiz@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa',
    WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', WINE = '#8e3b6e', SAND = '#d8b878';
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 1.9, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function group(c) { var g = new c.THREE.Group(); c.root.add(g); return g; }
  function into(g, m) { g.add(m); return m; }
  function person(c, x, z, col, info, g, s, y) {
    var T = c.THREE; s = s || 1; y = y || 0;
    var p = new T.Group(); (g || c.root).add(p); p.position.set(x, y, z);
    var b = c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info); b.position.y = 0.45 * s; p.add(b);
    var h = c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), '#e8c6a0', info); h.position.y = 1.12 * s; p.add(h);
    return p;
  }
  function arrow(c, a, b, col, info, g, rad) {
    var T = c.THREE, A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]), dir = B.clone().sub(A).normalize();
    var head = B.clone().sub(dir.clone().multiplyScalar(0.45));
    var s = c.link(a, [head.x, head.y, head.z], col, rad || 0.07, info);
    var cone = c.mesh(new T.ConeGeometry((rad || 0.07) * 3, 0.5, 14), col, info);
    cone.position.copy(B).sub(dir.clone().multiplyScalar(0.25)); cone.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    if (g) { g.add(s); g.add(cone); }
    return [s, cone];
  }
  function fade(groups, keep) {
    Object.keys(groups).forEach(function (k) {
      var off = keep.indexOf(k) < 0;
      groups[k].traverse(function (x) { if (x.material) { x.material.transparent = true; x.material.opacity = off ? (x.isSprite ? 0.25 : 0.15) : 1; if (!x.isSprite) x.material.depthWrite = !off; } });
    });
  }
  function glow(c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); }

  /* ======================= 1. Рождение трагедии ======================= */
  reg('nz-tragedy3d', {
    title: 'Рождение трагедии: Аполлон + Дионис', lead: 'Греческий театр. Слева — светлый храм Аполлона (мера, форма), справа — вихрь Диониса (поток, экстаз). На сцене они встречаются — так рождается трагедия.',
    radius: 18, phi: 1.0, theta: 0.2, targetY: 1.6, height: 420, hint: 'Нажми на храм, вихрь или сцену.',
    build: function (c) {
      var T = c.THREE, G = { ap: group(c), di: group(c), st: group(c) };
      c.ground(9);
      var iA = '<b>Аполлоническое начало.</b> Аполлон — бог света, красоты и меры. Это <b>порядок, форма, гармония космоса</b>, ясный сон-образ. Всё имеет границы.';
      into(G.ap, c.box3(3.4, 0.3, 2.4, STONE, [-4.6, 0.15, -1], iA));
      for (var i = 0; i < 4; i++) for (var j = 0; j < 2; j++) { var col = into(G.ap, c.mesh(new T.CylinderGeometry(0.16, 0.18, 2.2, 14), PAPER, iA)); col.position.set(-5.9 + i * 0.86, 1.4, -1.9 + j * 1.8); }
      var roof = into(G.ap, c.mesh(new T.CylinderGeometry(0.01, 2.1, 0.8, 4), STONE, iA)); roof.position.set(-4.6, 2.9, -1); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.75);
      var sun = into(G.ap, glow(c, GOLD, 0.55, iA)); sun.position.set(-4.6, 4.6, -1);
      into(G.ap, c.label('Аполлон\nмера · форма', [-4.6, 5.9, -1], 0.42, '#f0c36b'));
      var iD = '<b>Дионисийское начало.</b> Дионис — бог вина и экстаза. Это <b>стихия свободы и творчества</b>, хаос, поток жизни, в котором человек растворяет свои границы.';
      var parts = [];
      for (var k = 0; k < 70; k++) { var p = into(G.di, c.mesh(new T.SphereGeometry(0.09 + Math.random() * 0.08, 8, 6), k % 3 ? WINE : PURPLE, iD, { emissive: k % 3 ? WINE : PURPLE, emissiveIntensity: 0.4 })); p.userData.a = Math.random() * 6.28; p.userData.r = 0.4 + Math.random() * 1.6; p.userData.h = Math.random() * 4; p.userData.s = 0.6 + Math.random(); parts.push(p); }
      var vine = into(G.di, c.mesh(new T.TorusKnotGeometry(0.7, 0.12, 90, 10, 2, 5), GREEN, iD)); vine.position.set(4.6, 1.4, -1);
      into(G.di, c.label('Дионис\nпоток · экстаз', [4.6, 5.9, -1], 0.42, '#d6a6ff'));
      var iS = '<b>Сцена трагедии.</b> Хор (дионисийская стихия) поёт, а герой на сцене — ясный аполлонический образ. Трагедия — <b>союз двух начал</b>. По Ницше, когда победил чистый разум (Сократ), трагедия умерла.';
      var stage = into(G.st, c.mesh(new T.CylinderGeometry(2.4, 2.4, 0.35, 40, 1, false, 0, Math.PI), STONE, iS)); stage.position.set(0, 0.17, 2.5); stage.rotation.y = Math.PI / 2;
      for (var r = 0; r < 4; r++) { var step = into(G.st, c.mesh(new T.TorusGeometry(3.4 + r * 0.7, 0.18, 6, 40, Math.PI), STONE, iS)); step.rotation.x = -Math.PI / 2; step.position.set(0, 0.2 + r * 0.35, 2.5); step.rotation.z = Math.PI; }
      var hero = person(c, 0, 2.2, GOLD, iS, G.st, 1.1, 0.35);
      for (var h = 0; h < 6; h++) person(c, -1.5 + h * 0.6, 3.8, WINE, iS, G.st, 0.6, 0.35);
      into(G.st, c.label('трагедия', [0, 2.6, 2.4], 0.4));
      c.onFrame(function (t) {
        parts.forEach(function (p) { var a = p.userData.a + t * p.userData.s; p.position.set(4.6 + Math.cos(a) * p.userData.r, 0.4 + ((p.userData.h + t * 0.6) % 4.2), -1 + Math.sin(a) * p.userData.r); });
        vine.rotation.y = t * 0.8; sun.scale.setScalar(1 + 0.06 * Math.sin(t * 2));
      });
    },
    chips: [
      { t: 'Аполлон', small: 'мера', on: function (c) { c.setView(-0.5, 1.0, 12, 2, -4); c.say('<b>Аполлон:</b> порядок, форма, гармония, свет, красота. Это то, что позже стало классическим рационализмом.'); } },
      { t: 'Дионис', small: 'поток', on: function (c) { c.setView(0.6, 1.0, 12, 2, 4); c.say('<b>Дионис:</b> стихия свободы и творчества. Ницше ставит её выше: именно здесь жизнь.'); } },
      { t: 'Трагедия', small: 'синтез', on: function (c) { c.setView(0, 0.9, 13, 1, 0, 2); c.say('<b>Трагедия</b> — гармония двух начал. Книга: «Рождение трагедии из духа музыки» (1872), посвящена Вагнеру.'); } }
    ]
  });

  /* ======================= 2. Башня рационализма ======================= */
  reg('nz-tower3d', {
    title: 'Башня классической философии и молот Ницше', lead: 'Классическая философия строила мир как башню на «последнем основании» — разуме. Блоки: механицизм, редукционизм, рационализм. Нажми «Удар молотом».',
    radius: 15, phi: 1.1, theta: 0.5, targetY: 2.4, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var base = c.box3(3.2, 0.7, 3.2, DARK, [0, 0.35, 0], '<b>Последнее основание.</b> Философы искали основу, из которой логически выводится всё. Например, <b>закон достаточного основания</b> (Лейбниц; у Шопенгауэра — «О четверояком корне закона достаточного основания»): у всего есть причина.');
      c.state = { blocks: [], hit: 0 };
      var data = [
        ['Разум', '<b>Разум как основа бытия.</b> Мир устроен разумно, и разум может его полностью познать.', BLUE],
        ['Механицизм', '<b>Механицизм</b> — мир как машина: всё объясняется движением частей по законам механики.', GREY],
        ['Редукционизм', '<b>Редукционизм</b> — сведение сложного к простому: жизнь к химии, человека к механизму.', PURPLE],
        ['Рационализм', '<b>Рационализм</b> — вера, что разумом можно понять всё, в том числе мораль.', GREEN],
        ['Мораль из разума', '<b>Мораль выводится логически</b> из «достаточного основания». Ницше: нет, мораль — не вывод разума, а то, что выросло из жизни (генеалогия морали).', GOLD]
      ];
      data.forEach(function (d, i) {
        var b = c.box3(2.6 - i * 0.3, 0.8, 2.6 - i * 0.3, d[2], [0, 1.1 + i * 0.85, 0], d[1]);
        var l = c.label(d[0], [0, 1.1 + i * 0.85, 1.6], 0.32); b.userData.l = l; b.userData.home = b.position.clone();
        b.userData.v = new T.Vector3((Math.random() - 0.5) * 0.12, 0.05 + Math.random() * 0.05, (Math.random() - 0.5) * 0.12); c.state.blocks.push(b);
      });
      base.userData.keep = true;
      var hammer = new T.Group(); c.root.add(hammer);
      var hh = c.mesh(new T.BoxGeometry(1.2, 0.6, 0.6), '#5a5f70', '<b>Философия молотом.</b> Подзаголовок книги Ницше «Сумерки идолов, или Как философствуют молотом» (1888). Молотом простукивают «идолов» — и слышат, что они пусты.'); hammer.add(hh);
      var hd = c.mesh(new T.CylinderGeometry(0.08, 0.08, 2.2, 8), WOOD); hd.position.set(0.9, -0.6, 0); hd.rotation.z = Math.PI / 2.6; hammer.add(hd);
      hammer.position.set(4, 6.5, 0); c.state.hammer = hammer;
      c.onFrame(function () {
        var s = c.state;
        if (s.hit > 0) { s.hit++; hammer.rotation.z = Math.min(1.2, s.hit * 0.08);
          if (s.hit > 12) s.blocks.forEach(function (b) { b.position.add(b.userData.v); b.userData.v.y -= 0.004; if (b.position.y < 0.4) { b.position.y = 0.4; b.userData.v.set(0, 0, 0); } b.rotation.x += b.userData.v.x; b.userData.l.position.set(b.position.x, b.position.y, b.position.z + 1.4); }); }
        else if (s.hit < 0) { hammer.rotation.z *= 0.9; s.blocks.forEach(function (b) { b.position.lerp(b.userData.home, 0.1); b.rotation.x *= 0.9; b.userData.l.position.set(b.position.x, b.position.y, b.position.z + 1.6); }); }
      });
    },
    chips: [
      { t: '🔨 Удар молотом', small: 'Ницше', on: function (c) { var s = c.state; s.hit = 1; s.blocks.forEach(function (b, i) { b.userData.v.set((Math.random() - 0.5) * 0.14, 0.04 + i * 0.015, (Math.random() - 0.5) * 0.14); }); c.say('Ницше и философия жизни — реакция на <b>кризис европейской культуры</b> и «бездушного» рационализма. В основе мира не разум, а <b>жизнь</b>: поток, который не сводится к механизму.'); } },
      { t: '↺ Собрать', small: 'классика', on: function (c) { c.state.hit = -1; c.say('Классическая картина: всё стоит на разуме и выводится из «последних оснований».'); } }
    ]
  });

  /* ======================= 3. Золотое правило как обмен ======================= */
  reg('nz-exchange3d', {
    title: '«Любовь к ближнему» как обмен и «любовь к дальнему»', lead: 'Слева два человека обмениваются монетами: «я тебе не делаю плохо — и ты мне». Справа — луч к далёкой звезде: любовь к тому, кем человек может стать.',
    radius: 17, phi: 1.05, theta: 0.15, targetY: 1.6, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iG = '<b>Золотое правило нравственности:</b> «Не делай другому того, чего не желаешь себе». По Ницше, это по сути <b>обмен</b>: я не делаю плохого другому, потому что хочу, чтобы он не делал плохого мне. Мораль-сделка.';
      var a = person(c, -5.2, 0, BLUE, iG, null, 1.3), b = person(c, -1.8, 0, GREEN, iG, null, 1.3);
      var coins = [];
      for (var i = 0; i < 3; i++) { var m = c.mesh(new T.CylinderGeometry(0.28, 0.28, 0.07, 24), GOLD, iG, { metalness: 0.7, roughness: 0.3 }); m.rotation.x = Math.PI / 2; m.userData.o = i / 3; coins.push(m); }
      c.label('ближний ⇄ ближний', [-3.5, 3.2, 0], 0.4);
      var iF = '<b>Любовь к дальнему.</b> Заратустра: «Я учу вас не любви к ближнему, а любви к дальнему». Дальний — это <b>сверхчеловек</b>, будущий человек, которым нужно стать.';
      var star = glow(c, GOLD, 0.6, iF); star.position.set(6, 5.2, -4);
      var z = person(c, 2.6, 1.5, PURPLE, iF, null, 1.3);
      var beam = c.link([2.6, 1.6, 1.5], [6, 5.2, -4], GOLD, 0.05, iF); beam.material.emissive = new T.Color(GOLD); beam.material.emissiveIntensity = 0.5;
      c.label('дальний: сверхчеловек', [6, 6.4, -4], 0.4, '#f0c36b');
      c.onFrame(function (t) {
        coins.forEach(function (m) { var k = (t * 0.4 + m.userData.o) % 1, dir = Math.floor((t * 0.4 + m.userData.o)) % 2; var x = dir ? -4.8 + k * 2.6 : -2.2 - k * 2.6; m.position.set(x, 1.4 + Math.sin(k * Math.PI) * 1.0, 0); m.rotation.z = t * 4; });
        star.scale.setScalar(1 + 0.1 * Math.sin(t * 3));
      });
    }
  });

  /* ======================= 4. Гора Заратустры ======================= */
  reg('nz-mountain3d', {
    title: 'Заратустра спускается с горы', lead: 'Десять лет Заратустра жил в пещере на горе. Потом спустился к людям в город — рассказать о трёх идеях. Нажимай на светящиеся шары.',
    radius: 20, phi: 1.0, theta: 0.6, targetY: 2.5, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(10);
      var iM = '<b>«Так говорил Заратустра. Книга для всех и ни для кого»</b> (1883–1885). Обычно на книге указан адресат: «для младшего школьного возраста», «для студентов». А здесь — <b>абсолютный адрес</b>: для всех и ни для кого.';
      var mt = c.mesh(new T.ConeGeometry(4, 7, 7), '#6f6a62', iM); mt.position.set(-4, 3.5, -2);
      var snow = c.mesh(new T.ConeGeometry(1.4, 2.4, 7), PAPER, iM); snow.position.set(-4, 6.0, -2);
      var cave = c.mesh(new T.SphereGeometry(0.6, 14, 10, 0, Math.PI), '#1a1a22', 'Пещера, где Заратустра провёл 10 лет в одиночестве. С ним орёл (гордость) и змея (мудрость).'); cave.position.set(-3.1, 4.0, 0.5);
      var iZ = '<b>Заратустра</b> (Зороастр) — древний иранский пророк, основатель зороастризма. Ницше берёт имя древнего пророка, чтобы провозгласить <b>совсем другую «религию»</b> — без Бога.';
      var z = person(c, -3.1, 0.6, PURPLE, iZ, null, 0.9, 3.4); c.state = { z: z, t0: 0 };
      var path = [];
      for (var k = 0; k <= 20; k++) { var u = k / 20; path.push(new T.Vector3(-3.1 + u * 7.5, 3.4 * (1 - u) * (1 - u), 0.6 + u * 1.5)); }
      c.state.path = path;
      var iC = '<b>Город.</b> Жители не слушают Заратустру: они хотят покоя, уюта и безопасности.';
      [[3, 1], [4.5, 3], [5.6, 0.6], [3.4, 3.6], [6, 2.4]].forEach(function (p, i) { c.box3(1, 1 + (i % 3) * 0.4, 1, [STONE, SAND, GREY][i % 3], [p[0], 0.5 + (i % 3) * 0.2, p[1]], iC); });
      var ideas = [
        ['Воля к власти', '<b>Воля к власти</b> — главный инстинкт жизни: стремление расти, усиливаться, творить. Не желание командовать людьми!', RED, [1, 5.5, -2]],
        ['Сверхчеловек', '<b>Сверхчеловек</b> — тот, кем человек должен стать: творец собственных ценностей. Не раса и не царь, а <b>преображение</b> человека.', GOLD, [3.5, 6.5, -2.6]],
        ['Вечное возвращение', '<b>Вечное возвращение</b> — мысль, что всё повторится бесконечно. Проверка: смог бы ты захотеть прожить свою жизнь снова, точно так же?', BLUE, [6, 5.5, -2]]
      ];
      ideas.forEach(function (d) { var g = glow(c, d[2], 0.55, d[1]); g.position.set(d[3][0], d[3][1], d[3][2]); c.label(d[0], [d[3][0], d[3][1] + 1, d[3][2]], 0.34); });
      c.onFrame(function (t) { var k = (t * 0.08) % 1.2; k = Math.min(1, k); var i = Math.min(19, Math.floor(k * 20)), f = k * 20 - i; var p = c.state.path[i].clone().lerp(c.state.path[i + 1], f); z.position.copy(p); });
    }
  });

  /* ======================= 5. Воля к власти ======================= */
  reg('nz-will3d', {
    title: 'Воля к власти — это воля к жизни', lead: 'Два растения. Одно тянется вверх и разрастается (воля к власти высока). Другое под колпаком «ты должен» (воля ослаблена). Переключай кнопками силу инстинкта жизни.',
    radius: 13, phi: 1.1, theta: 0.3, targetY: 2, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var iS = '<b>Сильная жизнь.</b> Воля к власти — <b>физиологическое</b> понятие, не социальное: это рост, усиление, творчество. Как растение тянется к свету и раздвигает камни.';
      var iW = '<b>«Домашний» человек.</b> Подчинился нормам христианской морали и утратил свободу и творчество. Его инстинкты жизни подавлены.';
      var stems = [], leaves = [];
      function plant(x, col, info) { var st = c.mesh(new T.CylinderGeometry(0.1, 0.16, 1, 10), '#3d8a4a', info); st.position.set(x, 0.5, 0); var lf = c.mesh(new T.IcosahedronGeometry(0.7, 1), col, info); stems.push(st); leaves.push(lf); }
      plant(-2.2, GREEN, iS); plant(2.2, '#7d9a6a', iW);
      var jar = c.mesh(new T.CylinderGeometry(1.1, 1.1, 2.4, 24, 1, true), '#bcd3ff', iW, { transparent: true, opacity: 0.25, side: T.DoubleSide }); jar.position.set(2.2, 1.2, 0);
      var lid = c.mesh(new T.CylinderGeometry(1.15, 1.15, 0.12, 24), GREY, iW); lid.position.set(2.2, 2.45, 0);
      c.label('«ты должен»', [2.2, 3.1, 0], 0.32, '#ffb3ab');
      c.label('«я хочу · я творю»', [-2.2, 5.6, 0], 0.32, '#7fe0a8');
      var sun = glow(c, GOLD, 0.5, 'Свет — сама жизнь.'); sun.position.set(-2.2, 6.6, -1.5);
      c.state = { k: 0.8 };
      c.onFrame(function (t) {
        var k = c.state.k, h1 = 1 + k * 3.2, h2 = Math.min(2.1, 0.6 + (1 - k) * 0.4 + 0.6);
        stems[0].scale.y = h1; stems[0].position.y = h1 / 2; leaves[0].position.set(-2.2, h1 + 0.3, 0); leaves[0].scale.setScalar(0.6 + k * 0.9); leaves[0].rotation.y = t * 0.4;
        stems[1].scale.y = h2 * 0.8; stems[1].position.y = h2 * 0.4; leaves[1].position.set(2.2, h2 * 0.8 + 0.15, 0); leaves[1].scale.setScalar(0.5); leaves[1].scale.y = 0.35;
      });
    },
    chips: [
      { t: 'Слабая', small: 'подавлена', on: function (c) { c.state.k = 0.1; c.say('Воля к власти подавлена: человек живёт по чужим правилам, боится, «сдерживает свою силу».'); } },
      { t: 'Средняя', small: '', on: function (c) { c.state.k = 0.5; c.say('Обычный человек: что-то хочет, но больше всего ценит покой и безопасность.'); } },
      { t: 'Сильная', small: 'жизнь', on: function (c) { c.state.k = 1; c.say('<b>Всё, что усиливает инстинкты жизни, — ценно.</b> Так Ницше переоценивает ценности.'); } }
    ]
  });

  /* ======================= 6. Стадо ======================= */
  reg('nz-herd3d', {
    title: 'Стадо и свободный дух', lead: 'Внутри ограды — одинаковые фигурки «стада»: безопасно, но несвободно. На холме — свободный дух. Нажми «Поднять ограду» и посмотри, что происходит со свободой.',
    radius: 18, phi: 1.0, theta: 0.4, targetY: 1.2, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(9, '#3c5a3a');
      var iH = '<b>Стадо.</b> Ницше намеренно резок: «стадо», «стадный инстинкт», «стадный человек». Добро для стада — всё, что ему <b>полезно</b>; зло — всё, что <b>опасно</b> для его существования.';
      var herd = [];
      for (var i = 0; i < 24; i++) { var p = person(c, -4 + (i % 6) * 1.1 + (Math.random() - 0.5) * 0.3, -2 + Math.floor(i / 6) * 1.1, '#b9bfd6', iH, null, 0.6); p.userData.ph = Math.random() * 6; herd.push(p); }
      var iF = '<b>Ограда = мораль «ты должен, ты обязан».</b> Она обещает <b>универсальное уютное счастье</b> и безопасность. Но любая безопасность покупается ценой свободы.';
      var posts = [], rails = [];
      for (var k = 0; k < 20; k++) { var a = k / 20 * Math.PI * 2; var po = c.mesh(new T.BoxGeometry(0.15, 1, 0.15), WOOD, iF); po.position.set(-1.25 + Math.cos(a) * 4, 0.5, -0.35 + Math.sin(a) * 3); posts.push(po); }
      for (var r = 0; r < 2; r++) { var ring = c.mesh(new T.TorusGeometry(1, 0.05, 6, 48), WOOD, iF); ring.rotation.x = Math.PI / 2; ring.scale.set(4, 3, 1); ring.position.set(-1.25, 0.4 + r * 0.4, -0.35); rails.push(ring); }
      var hill = c.mesh(new T.SphereGeometry(2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#4f7a46', 'Холм за оградой.'); hill.position.set(5.5, 0, 3);
      var iS = '<b>Свободный дух.</b> Сильный, свободный, лучший человек для стада всегда <b>опасен и раздражает</b>: он разрушает привычный порядок.';
      var free = person(c, 5.5, 3, GOLD, iS, null, 1.1, 1.9);
      c.label('свободный дух', [5.5, 5, 3], 0.36, '#f0c36b');
      c.label('стадо: безопасность', [-1.25, 3.2, -0.35], 0.36);
      c.state = { h: 1 };
      c.onFrame(function (t) {
        var h = c.state.h;
        posts.forEach(function (p) { p.scale.y += (h - p.scale.y) * 0.08; p.position.y = p.scale.y / 2; });
        rails.forEach(function (r, i) { r.position.y += ((0.4 + i * 0.4) * h + (h > 1.5 ? i * 0.6 : 0) - r.position.y) * 0.08; });
        herd.forEach(function (p) { var amp = 0.12 / h; p.position.y = Math.abs(Math.sin(t * 2 + p.userData.ph)) * amp; });
        free.rotation.y = t * 0.6;
      });
    },
    chips: [
      { t: 'Поднять ограду', small: 'больше безопасности', on: function (c) { c.state.h = 2.6; c.say('Чем выше ограда, тем спокойнее — и тем меньше движения. Горожане говорят Заратустре: «Мы хотим, чтобы настало время, когда нечего будет бояться».'); } },
      { t: 'Опустить', small: 'больше свободы', on: function (c) { c.state.h = 0.4; c.say('Свобода всегда связана с риском и ответственностью. Свободный человек <b>одинок</b>.'); } }
    ]
  });

  /* ======================= 7. Канат над пропастью ======================= */
  reg('nz-rope3d', {
    title: 'Человек — канат над пропастью', lead: '«Человек — это канат, натянутый между животным и сверхчеловеком, канат над пропастью». Канатоходец идёт по нему на глазах у толпы на рынке.',
    radius: 18, phi: 1.05, theta: 0.25, targetY: 2, height: 420,
    build: function (c) {
      var T = c.THREE;
      var iA = '<b>Пропасть.</b> «Если долго смотреть в бездну, бездна тоже смотрит в тебя» («По ту сторону добра и зла»). Путь к сверхчеловеку опасен.';
      var cl1 = c.box3(3, 4, 4, '#6f6a62', [-6, 0, 0], 'Берег <b>животного</b>: инстинкты без творчества.'); var cl2 = c.box3(3, 4, 4, '#6f6a62', [6, 0, 0], 'Берег <b>сверхчеловека</b>: творец своих ценностей.');
      var abyss = c.mesh(new T.CylinderGeometry(3, 1.5, 6, 32, 1, true), '#111219', iA, { side: T.BackSide }); abyss.position.set(0, -1, 0);
      var eye = glow(c, '#ff5a5a', 0.3, iA); eye.position.set(0, -3.4, 0);
      var rope = c.link([-4.5, 2, 0], [4.5, 2, 0], '#d9c08a', 0.04, '<b>Канат = человек.</b> Человек — не цель, а <b>переход</b>: «Человек есть нечто, что должно преодолеть».');
      var beast = c.mesh(new T.BoxGeometry(1.2, 0.7, 0.6), '#7a5a3a', 'Животное.'); beast.position.set(-6, 2.4, 0);
      var s = glow(c, GOLD, 0.45, 'Сверхчеловек — цель, «смысл земли».'); s.position.set(6, 3, 0);
      c.label('животное', [-6, 3.8, 0], 0.36); c.label('сверхчеловек', [6, 4.2, 0], 0.36, '#f0c36b');
      var iW = '<b>Канатоходец.</b> Его сбил шут, и он разбился. Толпа разбежалась, а Заратустра остался с умирающим: «Ты сделал опасность своим ремеслом, в этом нет ничего презренного». Тот, кто рискует, — уважаем.';
      var walker = person(c, -4, 0, PURPLE, iW, null, 0.7, 2.05);
      var pole = c.mesh(new T.CylinderGeometry(0.03, 0.03, 2.2, 6), WOOD, iW); pole.rotation.z = Math.PI / 2; pole.position.y = 0.6; walker.add(pole);
      for (var i = 0; i < 9; i++) person(c, -3 + i * 0.75, 4.5, '#9aa1b8', 'Толпа на рынке ждёт: упадёт или нет?', null, 0.55, -1.8);
      c.label('толпа на рынке', [0, -0.2, 4.5], 0.3);
      c.state = { fall: 0 };
      c.onFrame(function (t) {
        if (c.state.fall) { c.state.fall += 0.05; walker.position.y = Math.max(-3, 2.05 - c.state.fall * c.state.fall); walker.rotation.z += 0.08; }
        else { var x = -4 + ((t * 0.5) % 8); walker.position.set(x, 2.05, 0); walker.rotation.z = Math.sin(t * 3) * 0.12; }
        eye.material.emissiveIntensity = 0.4 + 0.4 * Math.abs(Math.sin(t));
      });
    },
    chips: [
      { t: 'Идёт', small: 'риск', on: function (c) { c.state.fall = 0; c.say('Человек идёт от животного к сверхчеловеку. Остановиться посередине — тоже опасно.'); } },
      { t: 'Падение', small: 'шут', on: function (c) { c.state.fall = 0.01; c.say('Канатоходец упал. Но погибнуть, рискуя, — достойнее, чем жить «маленьким уютным счастьем».'); } },
      { t: 'Бездна', small: 'взгляд', on: function (c) { c.setView(0.2, 0.35, 12, -1); c.say('«Если долго смотреть в бездну, бездна тоже смотрит в тебя».'); } }
    ]
  });

  /* ======================= 8. Три превращения духа ======================= */
  reg('nz-meta3d', {
    title: 'Три превращения духа: верблюд → лев → ребёнок', lead: 'Образ из «Так говорил Заратустра». Дух сначала несёт чужие ценности, потом их отвергает, потом творит свои. Переключай стадии.',
    radius: 13, phi: 1.05, theta: 0, targetY: 1.4, height: 400,
    build: function (c) {
      var T = c.THREE, G = { camel: group(c), lion: group(c), child: group(c) };
      var d = c.mesh(new T.CylinderGeometry(8, 8, 0.2, 48), SAND, 'Пустыня — место одиночества духа.'); d.position.y = -0.1;
      var iC = '<b>Верблюд — «Ты должен».</b> Дух, который послушно несёт на себе тяжесть чужих ценностей и заповедей.';
      into(G.camel, c.box3(2, 0.9, 0.8, '#c49a5a', [-4, 1.4, 0], iC));
      [[-4.7, -0.3], [-4.7, 0.3], [-3.3, -0.3], [-3.3, 0.3]].forEach(function (p) { into(G.camel, c.box3(0.2, 1, 0.2, '#c49a5a', [p[0], 0.5, p[1]], iC)); });
      var hump = into(G.camel, c.mesh(new T.SphereGeometry(0.45, 14, 10), '#b48a4a', iC)); hump.position.set(-4, 2, 0);
      var neck = into(G.camel, c.box3(0.3, 1.2, 0.3, '#c49a5a', [-2.8, 2.2, 0], iC)); neck.rotation.z = -0.4;
      var load = into(G.camel, c.box3(1, 0.8, 1, '#6b4a3a', [-4, 2.75, 0], iC));
      into(G.camel, c.label('«ты должен»', [-4, 3.8, 0], 0.32, '#ffb3ab'));
      var iL = '<b>Лев — «Я хочу».</b> Дух сбрасывает груз и сражается с драконом «Ты должен». Лев завоёвывает свободу, но <b>ещё не умеет творить</b> новое.';
      into(G.lion, c.box3(1.8, 0.9, 0.8, '#d6a347', [0, 1.4, 0], iL));
      var mane = into(G.lion, c.mesh(new T.TorusGeometry(0.55, 0.3, 10, 20), '#9a5a1a', iL)); mane.position.set(1.1, 1.9, 0); mane.rotation.y = Math.PI / 2;
      var head = into(G.lion, c.mesh(new T.SphereGeometry(0.45, 14, 10), '#d6a347', iL)); head.position.set(1.1, 1.9, 0);
      [[-0.6, -0.3], [-0.6, 0.3], [0.6, -0.3], [0.6, 0.3]].forEach(function (p) { into(G.lion, c.box3(0.22, 1, 0.22, '#d6a347', [p[0], 0.5, p[1]], iL)); });
      var broken = into(G.lion, c.box3(0.9, 0.7, 0.9, '#6b4a3a', [-1.4, 0.35, 1], iL)); broken.rotation.set(0.4, 0.6, 0.3);
      into(G.lion, c.label('«я хочу»', [0, 3.2, 0], 0.32, '#f0c36b'));
      var iK = '<b>Ребёнок — «Я есмь».</b> Невинность, новое начало, игра, «святое да» жизни. Ребёнок — символ <b>творчества</b>: он не боится создавать собственный смысл.';
      var kid = person(c, 4, 0, '#7fd6a8', iK, G.child, 1);
      var blocks = [];
      for (var i = 0; i < 5; i++) { var b = into(G.child, c.box3(0.4, 0.4, 0.4, [RED, BLUE, GOLD, GREEN, PURPLE][i], [4.8 + (i % 2) * 0.2, 0.2 + i * 0.4, 0.6], iK)); blocks.push(b); }
      into(G.child, c.label('«я есмь · я творю»', [4.2, 3.2, 0], 0.32, '#7fe0a8'));
      c.state = { G: G };
      c.onFrame(function (t) { blocks.forEach(function (b, i) { b.rotation.y = t * 0.5 + i; }); kid.position.y = Math.abs(Math.sin(t * 3)) * 0.15; mane.rotation.x = t; });
    },
    chips: [
      { t: '🐪 Верблюд', small: 'ты должен', on: function (c) { fade(c.state.G, ['camel']); c.setView(-0.3, 1.05, 9, 1.6, -4); c.say('Верблюд несёт ценности, которые ему дали: мораль долга.'); } },
      { t: '🦁 Лев', small: 'я хочу', on: function (c) { fade(c.state.G, ['lion']); c.setView(0, 1.05, 9, 1.6, 0); c.say('Лев разрушает «ты должен». Свобода «от» — но пока не свобода «для».'); } },
      { t: '🧒 Ребёнок', small: 'я творю', on: function (c) { fade(c.state.G, ['child']); c.setView(0.3, 1.05, 9, 1.4, 4); c.say('Ребёнок создаёт новые ценности. Это и есть путь к сверхчеловеку.'); } },
      { t: 'Все', small: '', on: function (c) { fade(c.state.G, ['camel', 'lion', 'child']); c.setView(0, 1.05, 13, 1.4, 0); c.say('Верблюд → лев → ребёнок.'); } }
    ]
  });

  /* ======================= 9. Банк добродетели ======================= */
  reg('nz-bank3d', {
    title: 'Мораль как «плата с процентами»', lead: 'Ницше описывает христианскую мораль как сделку: вклад здесь (вера, надежда, добродетель) — выплата там. Нажми на вклады и посмотри, куда идёт «процент».',
    radius: 17, phi: 1.0, theta: 0.3, targetY: 2.6, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iE = '<b>Земная жизнь.</b> По Ницше, христианство учит жертвовать этой, единственной жизнью ради жизни «там». Тело презирается, сила и свобода объявлены опасными.';
      c.box3(6, 0.4, 3, '#4b6a4a', [0, 0.2, 0], iE); c.label('земная жизнь', [0, 0.9, 2], 0.34);
      var cloud = c.mesh(new T.SphereGeometry(1.4, 20, 14), PAPER, '<b>Царство Божие.</b> Плата за веру, надежду и добродетель — <b>вечная жизнь</b>. «Большие проценты»: вклад конечный, выплата вечная.'); cloud.position.set(-3, 6, -1); cloud.scale.set(1.6, 0.8, 1);
      c.label('вечная жизнь', [-3, 7.4, -1], 0.36, '#f0c36b');
      var pit = c.mesh(new T.CylinderGeometry(1.4, 0.6, 1, 24), '#5a1e1e', '<b>Вечные муки</b> — «плата» за зло, а злом объявлены сила, жизнь, свобода.', { emissive: '#5a1e1e', emissiveIntensity: 0.6 }); pit.position.set(3.6, 5.6, -1);
      c.label('вечные муки', [3.6, 6.8, -1], 0.36, '#ffb3ab');
      var coins = [];
      [['вера', -1.6, 'up'], ['надежда', -0.4, 'up'], ['добродетель', 0.8, 'up'], ['сила · свобода', 2.2, 'down']].forEach(function (d, i) {
        var m = c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.1, 24), d[2] === 'up' ? GOLD : RED, (d[2] === 'up' ? '<b>' + d[0] + '</b> — «вклад», за который обещана вечная жизнь.' : '<b>Сила, жизнь, свобода</b> — то, что Ницше ценит, а мораль рабов объявляет злом.'), { metalness: 0.6, roughness: 0.3 });
        m.userData.x = d[1]; m.userData.up = d[2] === 'up'; m.userData.o = i * 0.25; coins.push(m); c.label(d[0], [d[1], 1.2, 1], 0.26);
      });
      c.onFrame(function (t) { coins.forEach(function (m) { var k = (t * 0.25 + m.userData.o) % 1; var tx = m.userData.up ? -3 : 3.6; m.position.set(m.userData.x + (tx - m.userData.x) * k, 0.6 + k * 5, -k); m.rotation.x = t * 3; }); });
    }
  });

  /* ======================= 10. Скрижали и молот ======================= */
  reg('nz-tablets3d', {
    title: 'Старые скрижали: «добро и зло»', lead: 'Скрижали — каменные таблицы с правилами, которые кажутся вечными. Заратустра разбивает их молотом и предлагает писать новые. Нажми «Разбить».',
    radius: 13, phi: 1.1, theta: 0.2, targetY: 2, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var iT = '<b>Старые скрижали</b>: добро и зло, праведное и грешное, «нужно» и «нельзя». Они кажутся незыблемыми. Ницше: эти ценности когда-то <b>создали люди</b> — значит, их можно переоценить.';
      var pieces = [];
      [-1.3, 1.3].forEach(function (x, j) {
        for (var i = 0; i < 4; i++) { var p = c.box3(1.1, 0.75, 0.3, STONE, [x + (i % 2 ? 0.28 : -0.28), 1 + Math.floor(i / 2) * 0.78 + 0.4, 0], iT); p.userData.home = p.position.clone(); p.userData.v = new T.Vector3(); pieces.push(p); }
      });
      var l1 = c.label('ДОБРО', [-1.3, 3.3, 0.3], 0.34), l2 = c.label('ЗЛО', [1.3, 3.3, 0.3], 0.34);
      var newT = c.box3(1.6, 2, 0.25, '#fff4d6', [0, -2, -1.8], '<b>Новые скрижали</b> пишет сам человек-творец. Цель — не покой, а жизнь, рост, творчество. «По ту сторону добра и зла».');
      var nl = c.label('новые ценности', [0, -2, -1.5], 0.3, '#7a5a00');
      var hammer = new T.Group(); c.root.add(hammer);
      hammer.add(c.mesh(new T.BoxGeometry(1, 0.5, 0.5), '#5a5f70', 'Молот Заратустры.'));
      var hd = c.mesh(new T.CylinderGeometry(0.07, 0.07, 1.8, 8), WOOD); hd.position.y = -1; hammer.add(hd);
      hammer.position.set(3, 5, 0.6);
      c.state = { on: 0, pieces: pieces, newT: newT, nl: nl, l: [l1, l2], hammer: hammer };
      c.onFrame(function () {
        var s = c.state;
        if (s.on > 0) {
          s.on++; s.hammer.position.lerp(new T.Vector3(0, 3.8, 0.6), 0.2); s.hammer.rotation.z = -0.6;
          if (s.on > 10) { s.pieces.forEach(function (p) { p.position.add(p.userData.v); p.userData.v.y -= 0.01; if (p.position.y < 0.15) { p.position.y = 0.15; p.userData.v.multiplyScalar(0.5); } p.rotation.x += p.userData.v.z; }); s.l.forEach(function (l) { l.material.opacity = Math.max(0, l.material.opacity - 0.03); }); s.newT.position.y += (1.2 - s.newT.position.y) * 0.05; s.nl.position.y = s.newT.position.y + 1.4; }
        } else { s.hammer.position.lerp(new T.Vector3(3, 5, 0.6), 0.1); s.hammer.rotation.z *= 0.9; s.pieces.forEach(function (p) { p.position.lerp(p.userData.home, 0.12); p.rotation.x *= 0.85; }); s.l.forEach(function (l) { l.material.opacity = 1; }); s.newT.position.y += (-2 - s.newT.position.y) * 0.1; s.nl.position.y = s.newT.position.y + 1.4; }
      });
    },
    chips: [
      { t: '🔨 Разбить', small: 'переоценка', on: function (c) { c.state.on = 1; c.state.pieces.forEach(function (p) { p.userData.v.set((Math.random() - 0.5) * 0.25, 0.1 + Math.random() * 0.1, (Math.random() - 0.5) * 0.25); }); c.say('<b>Переоценка всех ценностей.</b> Цель жизни высшего человека — воля к власти: творчество, созидание.'); } },
      { t: '↺ Вернуть', small: 'старая мораль', on: function (c) { c.state.on = 0; c.say('Старые скрижали снова на месте: они кажутся вечными.'); } }
    ]
  });

  /* ======================= 11. Мораль господ и рабов + власть/ответственность ======================= */
  reg('nz-scales3d', {
    title: 'Высший человек и маленький человек', lead: 'Весы: на одной чаше — власть, на другой — ответственность. Высший человек берёт обе. «Маленький человек» хочет власти, но без ответственности.',
    radius: 14, phi: 1.05, theta: 0.2, targetY: 2.2, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var iB = '<b>Весы власти и ответственности.</b> Лектор: «Решение — только ваше. Не говорите "это решили родители". Ваша свобода — и как следствие ваша ответственность».';
      c.mesh(new T.CylinderGeometry(0.12, 0.2, 3.4, 12), GREY, iB).position.set(0, 1.7, 0);
      var beam = new T.Group(); c.root.add(beam); beam.position.set(0, 3.4, 0);
      beam.add(c.mesh(new T.BoxGeometry(5, 0.14, 0.14), GREY, iB));
      var pans = [-2.4, 2.4].map(function (x, i) {
        var g = new T.Group(); beam.add(g); g.position.x = x;
        var pan = c.mesh(new T.CylinderGeometry(0.9, 0.7, 0.12, 24), i ? GREEN : RED, iB); pan.position.y = -1.4; g.add(pan);
        var str = c.mesh(new T.CylinderGeometry(0.02, 0.02, 1.4, 6), GREY); str.position.y = -0.7; g.add(str);
        var w = c.mesh(new T.BoxGeometry(0.8, 0.6, 0.6), i ? GREEN : RED, i ? '<b>Ответственность</b> за решение — только твоя.' : '<b>Власть</b> — право решать.'); w.position.y = -1.05; g.add(w); g.userData.w = w;
        return g;
      });
      c.label('власть', [-2.4, 4.2, 0], 0.32, '#ffb3ab'); c.label('ответственность', [2.4, 4.2, 0], 0.32, '#7fe0a8');
      c.state = { beam: beam, pans: pans, tilt: 0 };
      c.onFrame(function () { var s = c.state; s.beam.rotation.z += (s.tilt - s.beam.rotation.z) * 0.06; s.pans.forEach(function (p) { p.rotation.z = -s.beam.rotation.z; }); });
    },
    chips: [
      { t: 'Высший человек', small: 'мораль господ', on: function (c) { var s = c.state; s.tilt = 0; s.pans[1].userData.w.visible = true; c.say('<b>Мораль господ</b> (сильных): «хорошо» — это сила, благородство, творчество, щедрость. Высший человек сам решает и сам отвечает. Он одинок.'); } },
      { t: 'Маленький человек', small: 'мораль рабов', on: function (c) { var s = c.state; s.tilt = 0.35; s.pans[1].userData.w.visible = false; c.say('<b>«Маленький человек — демократ»</b>: хочет власти, но не хочет ответственности. <b>Мораль рабов</b> рождается из зависти и мести сильным (ресентимент): «добро» — слабость, смирение; «зло» — сила.'); } }
    ]
  });

  /* ======================= 12. Человек — грязный поток, сверхчеловек — море ======================= */
  reg('nz-sea3d', {
    title: 'Сверхчеловек — это море', lead: '«Человек — это грязный поток. Нужно быть морем, чтобы принять в себя грязный поток и не стать нечистым». Смотри, как мутные капли растворяются в море.',
    radius: 16, phi: 0.95, theta: 0.6, targetY: 0.5, height: 400,
    build: function (c) {
      var T = c.THREE;
      var iS = '<b>Сверхчеловек — море.</b> Не царь и не раса, а предельно <b>абстрактный идеал</b>: человек, который вмещает в себя всё — и остаётся собой. «Любовь к дальнему» — любовь к нему.';
      var sea = c.mesh(new T.CylinderGeometry(6, 6, 0.4, 64), '#2f6fb3', iS, { transparent: true, opacity: 0.85 }); sea.position.set(2, -0.2, 0);
      var iR = '<b>Человек — грязный поток</b>: страхи, зависть, мелкие желания.';
      var bank = c.box3(5, 1.6, 1.6, '#6f6a62', [-6.5, 0.6, 0], iR);
      var river = c.mesh(new T.BoxGeometry(5, 0.2, 0.9), '#7a6a4a', iR); river.position.set(-6.5, 1.5, 0);
      var drops = [];
      for (var i = 0; i < 30; i++) { var d = c.mesh(new T.SphereGeometry(0.14, 8, 6), '#7a6a4a', iR); d.userData.o = i / 30; drops.push(d); }
      c.label('человек: поток', [-6.5, 2.6, 0], 0.34); c.label('сверхчеловек: море', [2, 1.6, 0], 0.36, '#9fd0ff');
      var waves = [];
      for (var w = 0; w < 4; w++) { var r = c.mesh(new T.TorusGeometry(1 + w * 1.2, 0.03, 6, 64), '#bfe0ff', iS); r.rotation.x = Math.PI / 2; r.position.set(2, 0.05, 0); waves.push(r); }
      c.onFrame(function (t) {
        drops.forEach(function (d) { var k = (t * 0.25 + d.userData.o) % 1; d.position.set(-4 + k * 6, 1.6 - k * k * 1.6, (Math.sin(d.userData.o * 30) * 0.3)); var col = new T.Color('#7a6a4a').lerp(new T.Color('#2f6fb3'), Math.max(0, (k - 0.5) * 2)); d.material.color.copy(col); d.scale.setScalar(1 - Math.max(0, k - 0.7) * 3); });
        waves.forEach(function (r, i) { var s = 1 + ((t * 0.3 + i * 0.25) % 1) * 0.6; r.scale.set(s, s, s); r.material.transparent = true; r.material.opacity = 1 - ((t * 0.3 + i * 0.25) % 1); });
      });
    }
  });

  /* ======================= 13. Вечное возвращение ======================= */
  reg('nz-return3d', {
    title: 'Вечное возвращение', lead: 'Моменты твоей жизни — бусины на кольце. Кольцо вращается бесконечно, и всё повторяется. Нажми «Да» или «Нет»: хотел бы ты прожить это снова?',
    radius: 13, phi: 0.9, theta: 0, targetY: 1.5, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(5.5);
      var iR = '<b>Вечное возвращение.</b> Демон говорит: «Эту жизнь ты должен будешь прожить ещё раз и ещё бесчисленное количество раз». Кто может сказать на это <b>«да»</b> — тот любит жизнь (amor fati, «люби свою судьбу»).';
      var ring = c.mesh(new T.TorusGeometry(3, 0.08, 10, 80), GOLD, iR, { emissive: GOLD, emissiveIntensity: 0.3 }); ring.position.y = 1.6; ring.rotation.x = Math.PI / 2.4;
      var holder = new T.Group(); c.root.add(holder); holder.position.y = 1.6; holder.rotation.x = Math.PI / 2.4;
      var names = ['рождение', 'детство', 'школа', 'универ', 'любовь', 'ошибка', 'успех', 'старость'], beads = [];
      names.forEach(function (n, i) {
        var a = i / names.length * Math.PI * 2;
        var b = c.mesh(new T.SphereGeometry(0.32, 16, 12), [BLUE, GREEN, PURPLE, GOLD, RED, GREY, GREEN, STONE][i], iR); b.position.set(Math.cos(a) * 3, Math.sin(a) * 3, 0); holder.add(b); beads.push(b);
      });
      c.label('и снова… и снова…', [0, 4.6, 0], 0.4); c.state = { holder: holder, ans: null };
      var me = person(c, 0, 0, PURPLE, 'Это ты. Как бы ты встретил весть о вечном повторении?', null, 1);
      c.onFrame(function (t) {
        var s = c.state; s.holder.rotation.z = t * 0.6;
        beads.forEach(function (b, i) { b.scale.setScalar(1 + 0.15 * Math.sin(t * 2 + i)); });
        me.rotation.y = s.ans === 'no' ? Math.PI : 0; me.position.y = s.ans === 'yes' ? Math.abs(Math.sin(t * 4)) * 0.3 : 0;
      });
    },
    chips: [
      { t: '«Да!»', small: 'amor fati', on: function (c) { c.state.ans = 'yes'; c.say('Если ты готов сказать «да» каждому моменту, даже ошибкам, — ты живёшь так, как хотел бы жить вечно. Это <b>утверждение жизни</b>.'); } },
      { t: '«Нет…»', small: 'ужас', on: function (c) { c.state.ans = 'no'; c.say('Если мысль о повторении пугает, значит, живёшь не так, как хочешь. Ницше: живи так, чтобы хотеть повторения.'); } }
    ]
  });

  /* ======================= Тест ======================= */
  HubWidgets.register('nz-quiz', function (box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Тест</span><b>Философия Ницше</b></div><p class="wg-lead">12 вопросов по лекции 28.10.</p><div class="wg-out q" style="margin-top:0;font-size:16px"></div><div class="wg-chips" style="margin-top:10px"></div><div class="wg-out r" style="display:none"></div>';
    var Q = [
      ['Какие два начала Ницше выделяет в «Рождении трагедии»?', ['Добро и зло', 'Аполлоническое и дионисийское', 'Воля и представление'], 1, 'Аполлон — мера, форма, порядок; Дионис — стихия свободы и творчества.'],
      ['Кому посвящено «Рождение трагедии из духа музыки»?', ['Шопенгауэру', 'Гёте', 'Вагнеру'], 2, 'Ницше был близким другом Рихарда Вагнера, позже они разошлись.'],
      ['На что была реакцией философия жизни?', ['На кризис европейской культуры и рационализма', 'На Французскую революцию', 'На появление марксизма'], 0, 'Против механицизма, редукционизма и рационализма классической философии.'],
      ['Главный объект критики в «По ту сторону добра и зла»?', ['Античная философия', 'Христианская мораль', 'Наука'], 1, 'Христианская мораль с её «ослабляющими» принципами, прежде всего любовью к ближнему.'],
      ['Как Ницше оценивает золотое правило «не делай другому…»?', ['Как высшую мудрость', 'Как обмен, мораль-сделку', 'Как закон природы'], 1, '«Я не делаю плохого другому, потому что хочу, чтобы он не делал плохого мне».'],
      ['Чему учит Заратустра вместо любви к ближнему?', ['Любви к себе', 'Любви к дальнему', 'Любви к Богу'], 1, 'Дальний — сверхчеловек, будущий человек.'],
      ['Подзаголовок «Так говорил Заратустра»?', ['Книга для всех и ни для кого', 'Книга для свободных умов', 'Опыт переоценки ценностей'], 0, 'Лектор назвала это «абсолютным адресом».'],
      ['Три главные идеи «Заратустры»?', ['Воля, представление, аскеза', 'Воля к власти, сверхчеловек, вечное возвращение', 'Вера, надежда, любовь'], 1, 'Вера, надежда, любовь — традиционные христианские ценности, которые Ницше критикует.'],
      ['Что такое воля к власти?', ['Желание командовать людьми', 'Воля к жизни, инстинкт роста и творчества', 'Стремление к богатству'], 1, 'Это физиологическое, а не социальное понятие.'],
      ['Что для «стада» является добром?', ['То, что полезно стаду', 'То, что истинно', 'То, что красиво'], 0, 'А злом — всё, что опасно для его существования, то есть сильный и свободный человек.'],
      ['«Маленький человек — демократ» потому что…', ['любит выборы', 'хочет власти, но не хочет ответственности', 'боится власти'], 1, 'Лектор: ответственность за решение — только ваша.'],
      ['Какой образ сверхчеловека использует Ницше?', ['Царь на троне', 'Море, которое принимает грязный поток и не становится нечистым', 'Солдат в строю'], 1, 'Сверхчеловек — предельно абстрактный идеал, преображение человека.']
    ];
    var i = 0, score = 0, done = false, qo = box.querySelector('.q'), ch = box.querySelector('.wg-chips'), res = box.querySelector('.r');
    function btn(h) { var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 160px'; b.innerHTML = h; ch.appendChild(b); return b; }
    function draw() {
      ch.innerHTML = '';
      if (i >= Q.length) { qo.innerHTML = 'Готово! Правильно <b>' + score + ' из ' + Q.length + '</b>.' + (score === Q.length ? ' Отлично!' : score >= 9 ? ' Хорошо, перечитай ошибки.' : ' Стоит повторить конспект.'); res.style.display = 'none'; btn('<b>Ещё раз ↺</b>').onclick = function () { i = 0; score = 0; done = false; draw(); }; return; }
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
