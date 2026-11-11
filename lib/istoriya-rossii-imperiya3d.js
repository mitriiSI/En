/* 3D-модели к конспекту «Российская империя: народы, веры, окраины» (История России, лекция 11.11).
   В Markdown: @@graph:rui-empire3d@@ @@graph:rui-translatio3d@@ @@graph:rui-title3d@@ @@graph:rui-nation3d@@
   @@graph:rui-expansion3d@@ @@graph:rui-raskol3d@@ @@graph:rui-ostsee3d@@ @@graph:rui-mosaic3d@@ @@graph:rui-catherine3d@@
   @@graph:rui-colonists3d@@ @@graph:rui-finland3d@@ @@graph:rui-poland3d@@ @@graph:rui-dilemma3d@@ @@graph:rui-caucasus3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa', WOOD = '#8a5a3b',
    STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', SEA = '#2f6fa3', SAND = '#c9b27a', LAND = '#5d7a4e', ORANGE = '#f08a3c', WHITE = '#eef0f8',
    FOREST = '#2f5d3a', SNOW = '#f2f4f8';
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
  function crown(c, col, info, g, s) {
    var T = c.THREE, k = new T.Group(); s = s || 1; (g || c.root).add(k);
    k.add(c.mesh(new T.CylinderGeometry(0.45 * s, 0.4 * s, 0.3 * s, 16, 1, true), col || GOLD, info, { side: T.DoubleSide, metalness: 0.6, roughness: 0.3 }));
    for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2, sp = c.mesh(new T.ConeGeometry(0.09 * s, 0.3 * s, 6), col || GOLD, info, { metalness: 0.6, roughness: 0.3 }); sp.position.set(Math.cos(a) * 0.42 * s, 0.28 * s, Math.sin(a) * 0.42 * s); k.add(sp); }
    return k;
  }
  function cap(c, info, g, s) { /* шапка Мономаха: полусфера с мехом и крестом */
    var T = c.THREE, k = new T.Group(); s = s || 1; (g || c.root).add(k);
    var dome = c.mesh(new T.SphereGeometry(0.55 * s, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), GOLD, info, { metalness: 0.7, roughness: 0.3 }); dome.position.y = 0.25 * s; k.add(dome);
    var fur = c.mesh(new T.TorusGeometry(0.58 * s, 0.16 * s, 10, 28), '#5b3a26', info); fur.rotation.x = Math.PI / 2; fur.position.y = 0.25 * s; k.add(fur);
    var st = c.mesh(new T.CylinderGeometry(0.04 * s, 0.04 * s, 0.5 * s, 6), GOLD, info, { metalness: 0.7 }); st.position.y = 1.0 * s; k.add(st);
    var cr = c.mesh(new T.BoxGeometry(0.3 * s, 0.05 * s, 0.05 * s), GOLD, info, { metalness: 0.7 }); cr.position.y = 1.1 * s; k.add(cr);
    var gem = c.mesh(new T.SphereGeometry(0.08 * s, 10, 8), RED, info, { emissive: RED, emissiveIntensity: 0.4 }); gem.position.set(0, 0.5 * s, 0.45 * s); k.add(gem);
    return k;
  }
  function flag(c, pos, col, info, g, h) {
    var T = c.THREE, p = new T.Group(); (g || c.root).add(p); p.position.set(pos[0], pos[1] || 0, pos[2]); h = h || 1.6;
    var pole = c.mesh(new T.CylinderGeometry(0.04, 0.04, h, 6), '#cfd6ea', info); pole.position.y = h / 2; p.add(pole);
    var f = c.mesh(new T.PlaneGeometry(0.7, 0.45), col, info, { side: T.DoubleSide }); f.position.set(0.36, h - 0.25, 0); p.add(f);
    return p;
  }
  function arrow(c, a, b, col, info, g, rad) {
    var T = c.THREE, A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]), dir = B.clone().sub(A).normalize();
    var head = B.clone().sub(dir.clone().multiplyScalar(0.45));
    var s = c.link(a, [head.x, head.y, head.z], col, rad || 0.08, info);
    var cone = c.mesh(new T.ConeGeometry((rad || 0.08) * 3, 0.5, 14), col, info);
    cone.position.copy(B).sub(dir.clone().multiplyScalar(0.25)); cone.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    if (g) { g.add(s); g.add(cone); }
    return [s, cone];
  }
  function disc(c, r, col, pos, info, g, h) { var m = c.mesh(new c.THREE.CylinderGeometry(r, r, h || 0.12, 32), col, info); m.position.set(pos[0], pos[1], pos[2]); if (g) g.add(m); return m; }
  function house(c, x, z, col, info, g, s) {
    var T = c.THREE, p = new T.Group(); s = s || 1; (g || c.root).add(p); p.position.set(x, 0, z);
    var b = c.mesh(new T.BoxGeometry(0.8 * s, 0.6 * s, 0.7 * s), col || PAPER, info); b.position.y = 0.3 * s; p.add(b);
    var r = c.mesh(new T.ConeGeometry(0.62 * s, 0.45 * s, 4), '#7a3b2e', info); r.position.y = 0.82 * s; r.rotation.y = Math.PI / 4; p.add(r);
    return p;
  }
  function tower(c, x, z, col, info, g, h, top) {
    var T = c.THREE, p = new T.Group(); h = h || 2; (g || c.root).add(p); p.position.set(x, 0, z);
    var b = c.mesh(new T.CylinderGeometry(0.45, 0.55, h, 12), col || STONE, info); b.position.y = h / 2; p.add(b);
    var r = c.mesh(new T.ConeGeometry(0.6, 0.9, 12), top || '#2f6f5a', info); r.position.y = h + 0.45; p.add(r);
    return p;
  }
  function tree(c, x, z, info, g, s) {
    var T = c.THREE, p = new T.Group(); s = s || 1; (g || c.root).add(p); p.position.set(x, 0, z);
    var t = c.mesh(new T.CylinderGeometry(0.07 * s, 0.09 * s, 0.5 * s, 6), WOOD, info); t.position.y = 0.25 * s; p.add(t);
    var l = c.mesh(new T.ConeGeometry(0.4 * s, 1.1 * s, 8), FOREST, info); l.position.y = 0.95 * s; p.add(l);
    return p;
  }
  function fade(c, keep) {
    Object.keys(c.groups).forEach(function (k) { var off = keep.indexOf(k) < 0; c.groups[k].traverse(function (x) { if (x.material && x.isSprite) x.material.opacity = off ? 0.25 : 1; }); c.ghost(c.groups[k], off, 0.15); });
  }
  function all(c) { return Object.keys(c.groups); }
  function ball(c, col, r) { return c.mesh(new c.THREE.SphereGeometry(r || 0.18, 12, 10), col, null, { emissive: col, emissiveIntensity: 0.35 }); }

  /* ======================= 1. Что такое империя ======================= */
  reg('rui-empire3d', {
    title: 'Империя: метрополия и окраины', lead: 'В центре — метрополия, «ядро», откуда выросло государство. Вокруг — присоединённые земли: у каждой свой цвет, то есть свой статус, свои законы, иногда свои правители. Нити власти тянутся из центра, но окраины не перекрашены в цвет ядра.',
    radius: 20, phi: 0.95, theta: 0.3, targetY: 0.8, height: 420, hint: 'Нажми на центр, окраины, корону или шлем без короны.',
    build: function (c) {
      var T = c.THREE, G = { core: group(c), lands: group(c), uk: group(c) };
      c.ground(10.5);
      var iM = '<b>Метрополия</b> — та часть, <b>откуда государство возникает</b> и которая <b>управляет общей территорией</b>. Для России — Московское государство.';
      into(G.core, disc(c, 2, RED, [0, 0.3, 0], iM, null, 0.6));
      into(G.core, c.label('Метрополия', [0, 2.6, 0], 0.5, '#ffb0a8'));
      var cr = crown(c, GOLD, iM, G.core, 1.1); cr.position.set(0, 0.9, 0);
      var lands = [['Казань', GOLD, '<b>Бывшее ханство</b>: правитель звался <b>царём</b>. Входит в Россию как «царство» — отсюда «царь Казанский» в титуле.'],
        ['Тверь', '#c58a5a', '<b>Бывшее великое княжество</b>: вошло в Москву, но отчасти <b>сохраняет особенности</b>.'],
        ['Прибалтика', BLUE, '<b>Своё право</b>, немецкое дворянство, лютеранство — «европейский» край.'],
        ['Сибирь', SNOW, '<b>Традиционные общества</b>: родовые связи, ясак (дань мехами).'],
        ['Украина', '#7dc4e8', 'Вошла <b>по договору</b>: гетман, казачье самоуправление, своё право.'],
        ['Финляндия', '#9cc2ff', '<b>Автономия</b>: сейм, сенат, свои законы (XIX в.).']];
      var pucks = [];
      lands.forEach(function (L, i) {
        var a = i / lands.length * Math.PI * 2, x = Math.cos(a) * 6.3, z = Math.sin(a) * 6.3;
        var info = '<b>' + L[0] + '.</b> ' + L[2];
        var m = into(G.lands, c.mesh(new T.CylinderGeometry(1.1, 1.2, 0.5, 6), L[1], info)); m.position.set(x, 0.25, z); pucks.push(m);
        into(G.lands, c.label(L[0], [x, 1.5, z], 0.36, '#eef0f8'));
        into(G.core, c.link([0, 0.7, 0], [x, 0.55, z], '#f0c36b', 0.04, '<b>Нити власти</b>: управление идёт из центра, но порядки на месте остаются разными.'));
      });
      var iU = '<b>Британская империя</b>: императора <b>никогда не было</b> — был король. <b>Голландская</b> — вообще федерация «Соединённые провинции». Значит, империю делает не титул, а схема <b>«центр — окраины»</b>.';
      var hel = into(G.uk, c.mesh(new T.SphereGeometry(0.7, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), GREY, iU, { metalness: 0.5, roughness: 0.4 })); hel.position.set(8.4, 0.1, -6.5);
      into(G.uk, c.label('без императора —\nтоже империя', [8.4, 1.8, -6.5], 0.36, '#cfd6ea'));
      c.groups = G;
      c.onFrame(function (t) { pucks.forEach(function (m, i) { m.position.y = 0.25 + Math.sin(t * 1.5 + i) * 0.08; }); cr.rotation.y = t * 0.4; });
    },
    chips: [
      { t: 'Схема', on: function (c) { fade(c, all(c)); c.setView(0.3, 0.95, 20, 0.8); c.say('<b>Империя</b> = <b>метрополия</b> + присоединённые земли <b>со своим особым статусом</b>. Император — не обязательный признак.'); } },
      { t: 'Ядро', on: function (c) { fade(c, ['core']); c.setView(0.3, 0.8, 10, 0.8); c.say('Русь империей не была: <b>слабое феодальное образование</b>. С XV в. Москва освобождается от Орды и начинает <b>собирать</b> земли — становится имперским центром.'); } },
      { t: 'Окраины', on: function (c) { fade(c, ['lands']); c.setView(0.6, 0.9, 17, 0.5); c.say('Цвета разные: Москва <b>не перекрашивает</b> присоединённое. Свои правители, законы, обычаи — «коллекция» земель.'); } },
      { t: 'Британия', on: function (c) { fade(c, ['uk']); c.setView(1.0, 0.85, 9, 0.6, 8.4, -6.5); c.say('В Британской империи — <b>король</b>, у голландцев — <b>Соединённые провинции</b>. Империя ≠ император.'); } }
    ]
  });

  /* ======================= 2. Перенос империи ======================= */
  reg('rui-translatio3d', {
    title: 'Translatio imperii: Рим → Царьград → Москва', lead: 'Три города стоят в ряд с запада на восток. Над ними путешествует золотая сфера — «христианская империя». Она не исчезает, а переходит: из Рима в Константинополь, а после 1453 г. — в Москву. Шапка Мономаха — легендарный «знак передачи».',
    radius: 21, phi: 1.0, theta: 0.1, targetY: 1.2, height: 420, hint: 'Нажми на каждый город, на шапку Мономаха или на сферу.',
    build: function (c) {
      var T = c.THREE, G = { rome: group(c), cpl: group(c), msk: group(c), cap: group(c) };
      c.ground(11);
      var iR = '<b>Первый Рим.</b> Столица христианской империи. С точки зрения православных — <b>отпал от истинной веры</b> (разделение церквей 1054 г.).';
      for (var i = 0; i < 4; i++) { into(G.rome, c.box3(0.35, 2.2, 0.35, STONE, [-8.6 + i * 0.7, 1.1, 0], iR)); }
      into(G.rome, c.box3(3, 0.3, 1, STONE, [-7.55, 2.35, 0], iR)); into(G.rome, c.mesh(new T.ConeGeometry(1.7, 0.6, 3), STONE, iR)).position.set(-7.55, 2.8, 0);
      into(G.rome, c.label('I Рим', [-7.55, 4, 0], 0.48, '#eef0f8'));
      var iC = '<b>Второй Рим — Константинополь, Царьград.</b> Его жители называли себя <b>ромеями</b> — «римлянами». «Поехать в Царьград» = поехать к ромеям. В <b>1453 г.</b> город взяли <b>турки-османы</b>.';
      var dome = into(G.cpl, c.mesh(new T.SphereGeometry(1.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#c9b27a', iC)); dome.position.set(0, 1.4, 0);
      into(G.cpl, c.box3(2.8, 1.4, 2.8, STONE, [0, 0.7, 0], iC));
      [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]].forEach(function (p) { var m = into(G.cpl, c.mesh(new T.CylinderGeometry(0.12, 0.15, 3, 8), STONE, iC)); m.position.set(p[0], 1.5, p[1]); });
      into(G.cpl, c.label('II Рим — Царьград', [0, 4, 0], 0.48, '#eef0f8'));
      var iM = '<b>Третий Рим — Москва.</b> После падения Константинополя — <b>единственное православное царство</b>. Старец Филофей (1520-е): «два Рима пали, а третий стоит, а четвёртому не бывать».';
      tower(c, 7, 0, '#e8e2d4', iM, G.msk, 2.2, GOLD); tower(c, 8.3, 0.4, '#e8e2d4', iM, G.msk, 1.6, '#2f6f5a'); tower(c, 5.9, 0.5, '#e8e2d4', iM, G.msk, 1.4, '#2f6f5a');
      G.msk.children.forEach(function (p) { p.children[1] && p.children[1].geometry && (p.children[1].geometry = new T.SphereGeometry(0.55, 14, 10)); });
      into(G.msk, c.label('III Рим — Москва', [7.1, 4.2, 0], 0.48, '#ffb0a8'));
      var iCap = '<b>Шапка Мономаха.</b> Легенда: византийский император <b>Константин Мономах</b> прислал её внуку — киевскому князю <b>Владимиру Мономаху</b> — вместе с другими знаками царской власти. Лектор: <b>это легенда</b>; учёные датируют шапку XIII–XIV вв.';
      var k = cap(c, iCap, G.cap, 1.1); k.position.set(3.5, 0.1, 3.5);
      into(G.cap, c.label('шапка Мономаха', [3.5, 2, 3.5], 0.38, '#f0c36b'));
      var iS = '<b>«Христианская империя»</b> существует всегда. Меняется только её столица — это и есть <b>translatio imperii</b>, «перенос империи».';
      var orb = c.mesh(new T.SphereGeometry(0.5, 20, 14), GOLD, iS, { metalness: 0.8, roughness: 0.2, emissive: '#7a5a10', emissiveIntensity: 0.4 }); c.root.add(orb);
      [[-7.5, 0], [0, 0], [7.1, 0]].forEach(function (p, i, a) { if (i < 2) arrow(c, [p[0] + 1.5, 5.2, 0], [a[i + 1][0] - 1.5, 5.2, 0], '#f0c36b', iS, G.cap, 0.05); });
      c.groups = G;
      c.onFrame(function (t) {
        var k2 = (t % 9) / 9, x;
        x = k2 < 0.33 ? -7.55 + (k2 / 0.33) * 0 : k2 < 0.5 ? -7.55 + (k2 - 0.33) / 0.17 * 7.55 : k2 < 0.75 ? 0 : (k2 - 0.75) / 0.25 * 7.1;
        orb.position.set(Math.min(x, 7.1), 5.6 + Math.sin(t * 3) * 0.15, 0); orb.rotation.y = t;
      });
    },
    chips: [
      { t: 'Эстафета', on: function (c) { fade(c, all(c)); c.setView(0.1, 1.0, 21, 1.2); c.say('В христианской традиции <b>не центр определяет империю, а вера</b>. Империя вечна, а столица <b>переходит</b> — <i>translatio</i>, «перенос».'); } },
      { t: 'Рим', on: function (c) { fade(c, ['rome']); c.setView(-0.4, 0.95, 9, 1.5, -7.5, 0); c.say('<b>Первый Рим</b> — по православному взгляду, отступил от веры.'); } },
      { t: 'Царьград', on: function (c) { fade(c, ['cpl']); c.setView(0.2, 0.95, 9, 1.5, 0, 0); c.say('<b>Ромеи</b> — так называли себя византийцы. В <b>1453 г.</b> — турецкое завоевание.'); } },
      { t: 'Москва', on: function (c) { fade(c, ['msk', 'cap']); c.setView(0.6, 0.95, 11, 1.5, 6, 1.5); c.say('<b>Москва — Третий Рим.</b> По лектору, идея живёт и сегодня: «везде, где есть русские люди», — там и Россия.'); } }
    ]
  });

  /* ======================= 3. Титул: царство царств ======================= */
  reg('rui-title3d', {
    title: 'Титул: «царство царств»', lead: 'Башня из корон. Внизу — большая корона «императора и самодержца всероссийского». Над ней — короны бывших ханств: Казанского, Астраханского, Сибирского, потом Польши и Финляндии. Каждая корона — строчка в полном титуле. Слева — цепочка слова: Цезарь → цесарь → царь, кайзер.',
    radius: 14.5, phi: 1.05, theta: 0.35, targetY: 2.6, height: 430, hint: 'Нажми на любую корону или на слово «Цезарь».',
    build: function (c) {
      var T = c.THREE, G = { tower: group(c), word: group(c) };
      c.ground(8);
      var rows = [
        ['император и самодержец всероссийский', GOLD, 1.6, 'Главная строка титула. <b>Официально</b> Россия — империя с <b>1721 г.</b>: Пётр I после Северной войны.'],
        ['царь Казанский (1552)', '#e3c58a', 1.25, '<b>Казанское ханство</b> покорено в <b>1552 г.</b> Его правитель звался <b>царём</b> — и титул перешёл к московскому государю.'],
        ['царь Астраханский (1556)', '#d8b878', 1.1, '<b>Астраханское ханство</b> — 1556 г. Тоже конгломерат разных земель.'],
        ['царь Сибирский (1582)', '#e8e8f0', 1.0, '<b>Сибирское ханство</b>: поход Ермака 1582 г.'],
        ['царь Польский (1815)', '#e05a5a', 0.9, '<b>Царство Польское</b> — по решению Венского конгресса. Император правит им <b>как польский царь</b>, по польской конституции.'],
        ['великий князь Финляндский (1809)', '#9cc2ff', 0.8, '<b>Великое княжество Финляндское</b> — особый статус, свои законы.']];
      var cr = [];
      rows.forEach(function (r, i) {
        var k = crown(c, r[1], '<b>' + r[0] + '.</b> ' + r[3], G.tower, r[2]); k.position.set(0, 0.25 + i * 0.85, 0); cr.push(k);
        into(G.tower, c.label(r[0], [2.6 + (i === 0 ? 1.2 : 0.4), 0.35 + i * 0.85, 0], 0.27, i === 0 ? '#f0c36b' : '#eef0f8'));
      });
      into(G.tower, c.label('«Мы, Александр Павлович,\nимператор и самодержец\nвсероссийский…»', [0, 6.3, 0], 0.34, '#f0c36b'));
      var iW = '<b>Царь</b> — от <b>«цесарь»</b>, то есть <b>Цезарь</b>. От того же имени — немецкое <b>«кайзер»</b>. Первым венчался на царство <b>Иван IV</b> в <b>1547 г.</b>';
      var words = [['Caesar', 4.2], ['цесарь', 3.0], ['царь', 1.8]];
      words.forEach(function (w, i) { into(G.word, c.box3(1.8, 0.7, 0.5, i === 0 ? STONE : '#c8ccd8', [-5.5, w[1], 0], iW)); into(G.word, c.label(w[0], [-5.5, w[1], 0.5], 0.36, '#0f1220')); if (i < 2) arrow(c, [-5.5, w[1] - 0.4, 0], [-5.5, words[i + 1][1] + 0.4, 0], GOLD, iW, G.word, 0.04); });
      into(G.word, c.box3(1.8, 0.7, 0.5, '#c8ccd8', [-3.2, 3.0, 0], iW)); into(G.word, c.label('Kaiser', [-3.2, 3.0, 0.5], 0.36, '#0f1220'));
      arrow(c, [-4.7, 4.0, 0], [-3.4, 3.4, 0], GOLD, iW, G.word, 0.04);
      c.groups = G;
      c.onFrame(function (t) { cr.forEach(function (k, i) { k.rotation.y = t * (0.3 + i * 0.07) * (i % 2 ? -1 : 1); }); });
    },
    chips: [
      { t: 'Башня', on: function (c) { fade(c, all(c)); c.setView(0.35, 1.05, 14.5, 2.6); c.say('Полный титул — список <b>всех</b> присоединённых земель. Россия становится <b>«царством царств»</b>.'); } },
      { t: 'Ханства', on: function (c) { fade(c, ['tower']); c.setView(0.5, 1.0, 10, 1.8, 1, 0); c.say('Казань, Астрахань, Сибирь — бывшие ханства, «конгломераты» земель. Их правители — <b>цари</b>, отсюда строки титула.'); } },
      { t: 'Слово', on: function (c) { fade(c, ['word']); c.setView(-0.3, 1.0, 9, 3, -4.4, 0); c.say('<b>Цезарь → цесарь → царь</b>; и <b>кайзер</b> — тоже Цезарь.'); } }
    ]
  });

  /* ======================= 4. Нации и смешанные элиты ======================= */
  reg('rui-nation3d', {
    title: 'Нации поздно, элиты смешанные', lead: 'Слева — средневековье: родословное дерево знати, где корни разного цвета (половцы, славяне, нормандцы, финно-угры) сплетаются в одну крону. Справа — XIX век: «гражданская нация» — одинаковые фигурки под одним флагом, хотя происхождение у них разное. Посередине — богатырь из Мурома.',
    radius: 19, phi: 1.0, theta: 0.2, targetY: 1.2, height: 430, hint: 'Нажми на корни, крону, богатыря или граждан.',
    build: function (c) {
      var T = c.THREE, G = { tree: group(c), hero: group(c), civ: group(c), ship: group(c) };
      c.ground(10);
      var roots = [['половцы', ORANGE, 'Русские князья часто были <b>сыновьями половчанок</b>: жён брали из степи.'],
        ['славяне', RED, 'В Германии огромное число <b>баронов — славяне по происхождению</b>; немецкие фамилии на <b>-ов (-ow)</b>.'],
        ['нормандцы', BLUE, '<b>Английская аристократия</b> — потомки нормандцев, переселившихся из Франции.'],
        ['финно-угры', GREEN, 'Мурома, меря, весь — финно-угорские племена, растворившиеся в русских.']];
      var trunk = into(G.tree, c.mesh(new T.CylinderGeometry(0.35, 0.5, 3, 10), WOOD, '<b>Средневековая знать</b>: «в элите вообще нет этноса» — всё перемешано.')); trunk.position.set(-6, 1.5, 0);
      var crownM = into(G.tree, c.mesh(new T.SphereGeometry(1.8, 18, 12), FOREST, '<b>Крона — элита</b>. Она общая, хотя корни разные.')); crownM.position.set(-6, 3.9, 0);
      roots.forEach(function (r, i) {
        var a = i / 4 * Math.PI * 2 + 0.4, x = -6 + Math.cos(a) * 2.6, z = Math.sin(a) * 2.6;
        into(G.tree, c.link([-6, 0.2, 0], [x, 0.15, z], r[1], 0.14, '<b>' + r[0] + '.</b> ' + r[2]));
        into(G.tree, c.label(r[0], [x, 0.8, z], 0.32, '#eef0f8'));
      });
      into(G.tree, c.label('Средние века', [-6, 6.2, 0], 0.42, '#f0c36b'));
      var iH = '<b>Илья Муромец</b> — из <b>Мурома</b>. Мурома — племя <b>финно-угорское</b>, родня карелам, эстонцам, вепсам, а не славянам. И это <b>наш</b> главный богатырь.';
      var h = person(c, 0, 0, '#8a9bb5', iH, G.hero, 1.5);
      var shield = into(G.hero, c.mesh(new T.CylinderGeometry(0.5, 0.5, 0.08, 20), RED, iH)); shield.rotation.z = Math.PI / 2; shield.position.set(-0.5, 0.9, 0.2);
      var helm = into(G.hero, c.mesh(new T.ConeGeometry(0.33, 0.5, 12), '#c8ccd8', iH, { metalness: 0.7 })); helm.position.set(0, 2.1, 0);
      into(G.hero, c.label('Илья из Мурома', [0, 3, 0], 0.36, '#9fe0c0'));
      var iC = '<b>Гражданская нация</b> (XVIII–XIX вв.): «нация» = все <b>граждане</b>. Во Франции нет «провансальцев» и «бретонцев» — <b>все французы</b>, хотя по происхождению состав смешанный.';
      var cols = [ORANGE, RED, BLUE, GREEN, PURPLE, GOLD];
      for (var i = 0; i < 6; i++) { var p = person(c, 4.6 + (i % 3) * 1.1, -0.8 + Math.floor(i / 3) * 1.4, BLUE, iC, G.civ, 0.9); var dot = ball(c, cols[i], 0.12); dot.position.set(0, 0.5, 0.3); p.add(dot); }
      flag(c, [7.6, 0, -1.6], BLUE, iC, G.civ, 2.6);
      into(G.civ, c.label('XIX век: граждане', [5.7, 3.2, 0], 0.42, '#9cc2ff'));
      var iS = '<b>Затонувший корабль XVI в.</b> («Мэри Роуз», 1545): анализ останков показал, что заметная часть моряков — <b>не местные</b> по происхождению. Значит, «чистых» народов не было и тогда.';
      into(G.ship, c.box3(2.2, 0.5, 0.8, WOOD, [1.5, 0.25, 5], iS)); var m = into(G.ship, c.mesh(new T.CylinderGeometry(0.05, 0.05, 1.6, 6), WOOD, iS)); m.position.set(1.5, 1, 5); m.rotation.z = 0.5;
      into(G.ship, c.label('корабль 1545 г.', [1.5, 1.9, 5], 0.32, '#cfd6ea'));
      c.groups = G;
      c.onFrame(function (t) { crownM.scale.setScalar(1 + Math.sin(t * 1.2) * 0.03); h.rotation.y = Math.sin(t * 0.6) * 0.5; });
    },
    chips: [
      { t: 'Обзор', on: function (c) { fade(c, all(c)); c.setView(0.2, 1.0, 19, 1.2); c.say('Нации в современном смысле — <b>XVIII–XIX вв.</b> Слово было и раньше: «Священная Римская империя <b>германской нации</b>». Национализм и расизм — <b>XIX–XX вв.</b>'); } },
      { t: 'Элиты', on: function (c) { fade(c, ['tree', 'ship']); c.setView(-0.5, 1.0, 12, 2, -4, 1.5); c.say('Князья — сыновья половчанок, бароны — славяне, английская знать — нормандцы. <b>В средневековой элите нет этноса.</b>'); } },
      { t: 'Муромец', on: function (c) { fade(c, ['hero']); c.setView(0.2, 1.0, 7, 1.4, 0, 0); c.say('Мурома — <b>финно-угры</b>. Богатырь «не славянин» — и всё равно русский герой.'); } },
      { t: 'Граждане', on: function (c) { fade(c, ['civ']); c.setView(0.5, 1.0, 9, 1, 5.7, 0); c.say('Цветные точки — разное происхождение. Флаг один — <b>гражданская нация</b>.'); } }
    ]
  });

  /* ======================= 5. Расширение XVI–XVII вв. ======================= */
  reg('rui-expansion3d', {
    title: 'Расширение XVI–XVII вв.: восток и юг', lead: 'Красное ядро — Московское государство. На восток бегут стрелы к Казани, Астрахани и через Урал в Сибирь — до Тихого океана. На юг шаг за шагом сдвигается засечная черта: за ней распахивают чернозём. На юго-запад — Левобережная Украина (1654).',
    radius: 19, phi: 0.75, theta: 0.0, targetY: 0, height: 430, hint: 'Нажми на засечную черту, Сибирь, Казань или Украину.',
    build: function (c) {
      var T = c.THREE, G = { core: group(c), east: group(c), south: group(c), ukr: group(c) };
      c.ground(11, '#3b4a3a');
      into(G.core, c.box3(3.2, 0.7, 3, RED, [-4, 0.35, -1.5], '<b>Московское государство</b> к середине XVI в.'));
      into(G.core, c.label('Москва', [-4, 1.4, -1.5], 0.45, '#ffb0a8'));
      var iK = '<b>Казань (1552)</b> и <b>Астрахань (1556)</b> — бывшие ханства; вся Волга теперь русская.';
      into(G.east, c.box3(1.6, 0.5, 1.4, GOLD, [0, 0.25, -1.5], iK)); into(G.east, c.label('Казань', [0, 1.1, -1.5], 0.34, '#eef0f8'));
      into(G.east, c.box3(1.4, 0.5, 1.4, '#d8b878', [0.5, 0.25, 2.2], iK)); into(G.east, c.label('Астрахань', [0.5, 1.1, 2.2], 0.34, '#eef0f8'));
      var iU = '<b>Урал</b> — граница Европы и Азии.'; var ural = into(G.east, c.mesh(new T.ConeGeometry(0.8, 1.6, 4), GREY, iU)); ural.position.set(2.6, 0.8, -1.5);
      var iS = '<b>Сибирь</b>: поход Ермака (1582), потом казаки идут «встречь солнцу» и к 1640-м выходят к <b>Тихому океану</b>. Местные народы платят <b>ясак</b> — дань мехами.';
      into(G.east, c.box3(5, 0.35, 4, SNOW, [6.5, 0.18, -2.5], iS)); into(G.east, c.label('Сибирь', [6.5, 1, -2.5], 0.42, '#eef0f8'));
      into(G.east, c.box3(1, 0.2, 5, SEA, [9.8, 0.1, -2.5], '<b>Тихий океан</b> — предел движения на восток в XVII в.'));
      arrow(c, [-2.3, 0.9, -1.5], [-0.9, 0.9, -1.5], RED, iK, G.east, 0.08); arrow(c, [1, 0.9, -1.5], [4.2, 0.9, -2], RED, iS, G.east, 0.08); arrow(c, [6, 0.9, -2], [9.2, 0.9, -2], RED, iS, G.east, 0.08);
      var iZ = '<b>Засечная черта</b> — линия из лесных завалов, валов и крепостей против набегов крымских татар. Построили черту — за ней селятся крестьяне — черту строят южнее.';
      var line = new T.Group(); G.south.add(line);
      for (var i = 0; i < 9; i++) { var tr = into(line, c.mesh(new T.CylinderGeometry(0.06, 0.06, 1.3, 5), WOOD, iZ)); tr.rotation.z = Math.PI / 2; tr.rotation.y = (i % 2 ? 0.6 : -0.6); tr.position.set(-6.2 + i * 0.55, 0.3, 0); }
      tower(c, -6.6, 0, '#a0805a', iZ, line, 1.2, WOOD); tower(c, -1.4, 0, '#a0805a', iZ, line, 1.2, WOOD);
      into(G.south, c.label('засечная черта →', [-4, 2.2, 1], 0.36, '#f0c36b'));
      var iCh = '<b>Чернозём</b> — самые плодородные земли «Дикого поля». Освоение шло от засечных линий.';
      var field = into(G.south, c.box3(6, 0.1, 5, '#2b2016', [-4, 0.05, 4.8], iCh));
      var iUk = '<b>Левобережная Украина (1654)</b> — Переяславская рада: Гетманщина под властью царя, но <b>со своим</b> гетманом, казачьим войском и правом.';
      into(G.ukr, c.box3(2.6, 0.5, 2.4, '#7dc4e8', [-8.6, 0.25, 4], iUk)); into(G.ukr, c.label('Украина, 1654', [-8.6, 1.3, 4], 0.36, '#eef0f8'));
      arrow(c, [-5.5, 0.9, -0.2], [-7.6, 0.9, 2.8], RED, iUk, G.ukr, 0.08);
      c.groups = G;
      c.onFrame(function (t) { var k = (t % 10) / 10; line.position.z = k * 5.5; field.scale.z = 0.2 + k * 0.8; field.position.z = 2.3 + k * 2.5; });
    },
    chips: [
      { t: 'Карта', on: function (c) { fade(c, all(c)); c.setView(0, 0.75, 21, 0); c.say('XVII век: движение <b>на восток</b> и <b>на юг, юго-запад</b>.'); } },
      { t: 'Восток', on: function (c) { fade(c, ['core', 'east']); c.setView(0.3, 0.8, 15, 0, 3, -2); c.say('Волга — Урал — Сибирь — Тихий океан.'); } },
      { t: 'Юг', on: function (c) { fade(c, ['core', 'south']); c.setView(-0.2, 0.75, 12, 0, -4, 2.5); c.say('Засечная черта ползёт на юг, за ней распахивается <b>чернозём</b>.'); } },
      { t: 'Украина', on: function (c) { fade(c, ['core', 'ukr']); c.setView(-0.7, 0.8, 11, 0, -7, 2); c.say('<b>1654</b> — Украина входит <b>на договорных условиях</b>.'); } }
    ]
  });

  /* ======================= 6. Обряд, раскол, старообрядцы ======================= */
  reg('rui-raskol3d', {
    title: 'Обряд и раскол: две руки, две церкви', lead: 'Слева — католическая традиция: книга и кафедра, вера через философию и богословие. Справа — православная: обряд. Две руки показывают спор XVII в.: двуперстие старообрядцев против троеперстия Никона. За ними — восьмиконечный крест и купеческая лавка: старообрядческая этика труда.',
    radius: 15.5, phi: 1.0, theta: 0.15, targetY: 1.5, height: 430, hint: 'Нажми на руки, книгу, крест или лавку.',
    build: function (c) {
      var T = c.THREE, G = { cat: group(c), hands: group(c), cross: group(c), shop: group(c) };
      c.ground(9);
      var iC = '<b>Католичество</b>: очень важна <b>философия, богословие</b> — умение рационально объяснить божественные истины (схоластика, университеты).';
      into(G.cat, c.box3(1.2, 1.4, 0.8, WOOD, [-6, 0.7, 0], iC)); var bk = into(G.cat, c.box3(1.3, 0.12, 0.9, PAPER, [-6, 1.5, 0], iC)); bk.rotation.x = -0.3;
      into(G.cat, c.label('вера через разум', [-6, 2.6, 0], 0.36, '#9cc2ff'));
      function hand(x, n, col, info) {
        var p = new T.Group(); G.hands.add(p); p.position.set(x, 0, 0);
        into(p, c.mesh(new T.BoxGeometry(0.8, 1, 0.3), '#e8c6a0', info)).position.y = 1.2;
        for (var i = 0; i < 5; i++) { var up = i < n, f = c.mesh(new T.CylinderGeometry(0.08, 0.08, up ? 0.8 : 0.35, 8), '#e8c6a0', info); f.position.set(-0.3 + i * 0.15, up ? 2.1 : 1.8, up ? 0 : 0.18); if (!up) f.rotation.x = 1.2; p.add(f); }
        into(p, c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.6, 12), col, info)).position.y = 0.4;
        return p;
      }
      var iTwo = '<b>Двуперстие</b> — старый русский обряд. Старообрядцы считали его единственно правильным и не приняли реформу.';
      var iThree = '<b>Троеперстие</b> — по греческому образцу; ввёл патриарх <b>Никон</b> (1650-е). Для православия обряд — основа веры, поэтому смена жеста стала <b>расколом</b>.';
      var h2 = hand(-1.5, 2, '#7a3b2e', iTwo), h3 = hand(1.2, 3, BLUE, iThree);
      into(G.hands, c.label('двуперстие', [-1.5, 3.1, 0], 0.34, '#ffcf8a')); into(G.hands, c.label('троеперстие', [1.2, 3.1, 0], 0.34, '#9cc2ff'));
      var iX = '<b>Восьмиконечный крест</b> — его особенно почитают старообрядцы. Лектор говорил о преследованиях старой веры: старообрядцы уходили на Север, в Сибирь, на окраины.';
      into(G.cross, c.box3(0.18, 3.2, 0.18, GOLD, [4, 1.6, -0.5], iX)); into(G.cross, c.box3(0.9, 0.14, 0.14, GOLD, [4, 2.9, -0.5], iX)); into(G.cross, c.box3(1.5, 0.16, 0.16, GOLD, [4, 2.4, -0.5], iX));
      var sl = into(G.cross, c.box3(0.9, 0.14, 0.14, GOLD, [4, 0.9, -0.5], iX)); sl.rotation.z = -0.4;
      var iSh = '<b>Старообрядческая этика</b> похожа на <b>протестантскую</b>: главное — <b>выполнять свой долг</b>, служить Богу хорошей <b>профессиональной работой</b>. Отсюда купеческие династии (Морозовы, Рябушинские, Гучковы).';
      house(c, 6.3, 1.8, '#d6c4a0', iSh, G.shop, 1.6);
      var coins = []; for (var i = 0; i < 6; i++) { var cn = into(G.shop, c.mesh(new T.CylinderGeometry(0.22, 0.22, 0.07, 16), GOLD, iSh, { metalness: 0.8, roughness: 0.25 })); cn.position.set(6.3, 0.05 + i * 0.08, 3.3); coins.push(cn); }
      into(G.shop, c.label('труд = долг', [6.3, 2.8, 1.8], 0.36, '#f0c36b'));
      c.groups = G;
      c.onFrame(function (t) { h2.rotation.y = Math.sin(t) * 0.3; h3.rotation.y = -Math.sin(t) * 0.3; coins.forEach(function (cn, i) { cn.position.y = 0.05 + i * 0.08 * (1 + 0.5 * Math.sin(t * 0.8)); }); });
    },
    chips: [
      { t: 'Обзор', on: function (c) { fade(c, all(c)); c.setView(0.15, 1.0, 15.5, 1.5); c.say('Для православия главное — <b>обряд</b>: какие действия сопровождают веру. Поэтому реформа обряда расколола церковь.'); } },
      { t: 'Католики', on: function (c) { fade(c, ['cat']); c.setView(-0.4, 1.0, 7, 1.4, -6, 0); c.say('Католическая традиция ставит на первое место <b>богословие и философию</b>.'); } },
      { t: 'Раскол', on: function (c) { fade(c, ['hands', 'cross']); c.setView(0.1, 1.0, 9, 1.8, 1, 0); c.say('<b>Два</b> пальца против <b>трёх</b>. Несогласные с Никоном — <b>старообрядцы</b>.'); } },
      { t: 'Этика', on: function (c) { fade(c, ['shop']); c.setView(0.6, 1.0, 7, 1.2, 6.3, 2.3); c.say('Работа как служение — путь к капиталу. Похоже на <b>протестантскую этику</b> Макса Вебера.'); } }
    ]
  });

  /* ======================= 7. Остзейские немцы ======================= */
  reg('rui-ostsee3d', {
    title: 'Остзейские немцы: Европа внутри империи', lead: 'Слева — Прибалтика: шпили Риги и Ревеля, университет Дерпта. По мосту оттуда в Петербург идут офицеры и чиновники — остзейские немцы. Справа — Петербург и Балтийский флот: среди офицеров на кораблях множество немецких фамилий.',
    radius: 19, phi: 0.95, theta: 0.25, targetY: 1, height: 420, hint: 'Нажми на город, университет, фигурки или корабль.',
    build: function (c) {
      var T = c.THREE, G = { balt: group(c), bridge: group(c), spb: group(c) };
      c.ground(10);
      var iB = '<b>Эстляндия и Лифляндия</b> — с 1721 г. (Ништадтский мир). Пётр I <b>подтвердил права</b> немецкого дворянства и городов: своё право, лютеранство, немецкий язык, дворянское самоуправление.';
      [[-7, -1.5], [-5.8, -0.4], [-7.4, 0.8]].forEach(function (p, i) { var tw = tower(c, p[0], p[1], '#c8b8a0', iB, G.balt, 2 + i * 0.5, '#2f6f5a'); tw.children[1].geometry = new T.ConeGeometry(0.35, 1.6, 8); tw.children[1].position.y = 2 + i * 0.5 + 0.8; });
      house(c, -5.5, 1.8, '#e8e2d4', iB, G.balt, 1.2); house(c, -6.6, 2.3, '#d8c8b0', iB, G.balt, 1);
      into(G.balt, c.label('Рига · Ревель', [-6.6, 4.6, -0.3], 0.38, '#eef0f8'));
      var iU = '<b>Дерптский университет</b> (вновь открыт в <b>1802 г.</b>): преподавание на немецком. Лектор: в Прибалтике живут <b>практически как в Европе</b> — европейские города, театр, университеты.';
      into(G.balt, c.box3(2, 1, 1.2, '#f0ead8', [-8.2, 0.5, 3.2], iU)); for (var i = 0; i < 4; i++) into(G.balt, c.box3(0.15, 1, 0.15, STONE, [-8.9 + i * 0.47, 0.5, 3.85], iU));
      into(G.balt, c.label('университет', [-8.2, 1.6, 3.2], 0.32, '#eef0f8'));
      var iP = '<b>Остзейские немцы</b> — потомки рыцарей-крестоносцев. Огромный слой входит в <b>петербургский</b> военный и государственный аппарат.';
      into(G.bridge, c.box3(8, 0.15, 1, STONE, [-1, 0.4, 0], iP));
      var walkers = []; for (var k = 0; k < 4; k++) walkers.push(person(c, 0, 0, k % 2 ? DARK : '#2b3a66', iP, G.bridge, 0.7, 0.5));
      var iS = '<b>Петербург</b> — столица империи, «окно в Европу».';
      tower(c, 4.6, -1, '#e8e2d4', iS, G.spb, 2.6, GOLD).children[1].geometry = new T.ConeGeometry(0.2, 2.2, 8);
      into(G.spb, c.box3(3, 1, 1.2, '#e8d8a0', [5, 0.5, 1], iS)); into(G.spb, c.label('Петербург', [4.8, 4.5, -1], 0.4, '#f0c36b'));
      var iF = '<b>Флот.</b> Лектор: если посмотреть на офицеров флота — там <b>очень много остзейских немцев</b>. Беллинсгаузен, Крузенштерн — оттуда.';
      into(G.spb, c.box3(6, 0.1, 4, SEA, [7, 0.05, 4.5], iF));
      var ship = new T.Group(); G.spb.add(ship);
      into(ship, c.box3(2, 0.4, 0.6, WOOD, [0, 0.3, 0], iF)); into(ship, c.mesh(new T.CylinderGeometry(0.04, 0.04, 1.8, 6), WOOD, iF)).position.set(0, 1.3, 0);
      into(ship, c.mesh(new T.PlaneGeometry(0.9, 1), PAPER, iF, { side: T.DoubleSide })).position.set(0, 1.4, 0.05);
      into(ship, c.mesh(new T.PlaneGeometry(0.4, 0.25), WHITE, iF, { side: T.DoubleSide })).position.set(-0.9, 1, 0);
      into(G.spb, c.label('флот', [7, 1.9, 4.5], 0.36, '#9cc2ff'));
      c.groups = G;
      c.onFrame(function (t) { walkers.forEach(function (w, i) { var k = ((t * 0.12 + i / 4) % 1); w.position.set(-4.6 + k * 7.4, 0.5, (i % 2 ? 0.2 : -0.2)); }); ship.position.set(7 + Math.sin(t * 0.4) * 1.5, 0, 4.5 + Math.cos(t * 0.4) * 0.8); ship.rotation.y = -t * 0.4; });
    },
    chips: [
      { t: 'Обзор', on: function (c) { fade(c, all(c)); c.setView(0.25, 0.95, 19, 1); c.say('В XVIII в. в Россию едут <b>врачи, офицеры, инженеры, мастера</b>. А с Прибалтикой в элиту входит целый слой — <b>остзейские немцы</b>.'); } },
      { t: 'Прибалтика', on: function (c) { fade(c, ['balt']); c.setView(-0.5, 0.95, 10, 1.5, -6.6, 1); c.say('<b>Европейский край</b>: свои законы, лютеранство, университет, театр.'); } },
      { t: 'Служба', on: function (c) { fade(c, ['bridge', 'spb']); c.setView(0.4, 0.9, 13, 1, 2, 1); c.say('Империя их <b>не переделывала, а нанимала</b>: карьера в столице в обмен на верность.'); } }
    ]
  });

  /* ======================= 8. Империя-мозаика ======================= */
  reg('rui-mosaic3d', {
    title: 'Три мира в одной империи', lead: 'Три острова на одной плите. Синий — европейский мир: город с университетом. Красный — православный русский мир: храм и деревня. Зелёный — традиционный мир: юрты и чумы, где правят род и старейшины. Над всеми висит одна корона — но законы под ней разные.',
    radius: 18, phi: 0.9, theta: 0.4, targetY: 1, height: 420, hint: 'Нажми на каждый остров или на корону.',
    build: function (c) {
      var T = c.THREE, G = { eu: group(c), ru: group(c), tr: group(c), top: group(c) };
      c.ground(9.5);
      var pos = { eu: [-4.5, -2.2], ru: [4.5, -2.2], tr: [0, 4] };
      var iE = '<b>Европейский мир</b>: Прибалтика, Финляндия, Польша. Города, университеты, сословное самоуправление, <b>свои законы</b>.';
      into(G.eu, disc(c, 3, '#36518f', [pos.eu[0], 0.15, pos.eu[1]], iE, null, 0.3));
      tower(c, pos.eu[0] - 0.8, pos.eu[1], '#d8c8b0', iE, G.eu, 2.2, '#2f6f5a'); house(c, pos.eu[0] + 1, pos.eu[1] + 0.6, '#e8e2d4', iE, G.eu, 1.2); house(c, pos.eu[0] + 0.5, pos.eu[1] - 1.2, '#d8c8b0', iE, G.eu, 1);
      into(G.eu, c.label('европейский', [pos.eu[0], 3.6, pos.eu[1]], 0.38, '#9cc2ff'));
      var iR = '<b>Православный русский мир</b>: центр страны, крестьянская община, помещики, православная церковь.';
      into(G.ru, disc(c, 3, '#8f3636', [pos.ru[0], 0.15, pos.ru[1]], iR, null, 0.3));
      var ch = tower(c, pos.ru[0], pos.ru[1], WHITE, iR, G.ru, 1.8, GOLD); ch.children[1].geometry = new T.SphereGeometry(0.5, 14, 10);
      for (var i = 0; i < 3; i++) { var hh = c.box3(0.7, 0.55, 0.6, WOOD, [pos.ru[0] - 1.6 + i * 1.3, 0.55, pos.ru[1] + 1.5], iR); G.ru.add(hh); }
      into(G.ru, c.label('православный', [pos.ru[0], 3.6, pos.ru[1]], 0.38, '#ffb0a8'));
      var iT = '<b>Традиционный мир</b>: народы, которые, по словам лектора, ещё <b>не дошли до государственного состояния</b>; огромную силу имеют <b>родовые</b> связи и старейшины. Север, Сибирь, степь, горы.';
      into(G.tr, disc(c, 3, '#36703f', [pos.tr[0], 0.15, pos.tr[1]], iT, null, 0.3));
      for (var j = 0; j < 4; j++) { var a = j / 4 * Math.PI * 2; var y = into(G.tr, c.mesh(new T.ConeGeometry(0.6, 1.3, 10), j % 2 ? '#c9b27a' : '#9c8a6a', iT)); y.position.set(pos.tr[0] + Math.cos(a) * 1.6, 0.95, pos.tr[1] + Math.sin(a) * 1.6); }
      var fire = into(G.tr, c.mesh(new T.ConeGeometry(0.25, 0.6, 8), ORANGE, iT, { emissive: ORANGE, emissiveIntensity: 0.8 })); fire.position.set(pos.tr[0], 0.6, pos.tr[1]);
      into(G.tr, c.label('традиционный', [pos.tr[0], 3.2, pos.tr[1]], 0.38, '#9fe0c0'));
      var iK = '<b>Одна корона — три режима.</b> Одним законом нельзя одинаково управлять университетским городом, общинной деревней и кочевым родом.';
      var k = crown(c, GOLD, iK, G.top, 1.4); k.position.set(0, 5.6, 0);
      Object.keys(pos).forEach(function (p) { into(G.top, c.link([0, 5.5, 0], [pos[p][0], 2.6, pos[p][1]], '#f0c36b', 0.03, iK)); });
      c.groups = G;
      c.onFrame(function (t) { k.rotation.y = t * 0.5; fire.scale.y = 1 + Math.sin(t * 9) * 0.25; });
    },
    chips: [
      { t: 'Все три', on: function (c) { fade(c, all(c)); c.setView(0.4, 0.9, 18, 1); c.say('Внутри одной империи — <b>совершенно разные миры</b>. Поэтому и управление разное.'); } },
      { t: 'Европа', on: function (c) { fade(c, ['eu']); c.setView(-0.6, 0.9, 9, 1, -4.5, -2.2); c.say('Свои законы и самоуправление: Прибалтика, Финляндия, Польша.'); } },
      { t: 'Русь', on: function (c) { fade(c, ['ru']); c.setView(0.6, 0.9, 9, 1, 4.5, -2.2); c.say('Православный центр: община, помещик, церковь.'); } },
      { t: 'Род', on: function (c) { fade(c, ['tr']); c.setView(0.1, 0.85, 9, 1, 0, 4); c.say('Традиционные общества: <b>родовые связи</b> сильнее государства.'); } }
    ]
  });

  /* ======================= 9. Екатерина II: единый закон ======================= */
  reg('rui-catherine3d', {
    title: 'Екатерина II: «утюг единообразия»', lead: 'Плита — Левобережная Украина: пёстрые плитки — казачьи полки, гетманская булава, своё право. По ней едет большой «утюг» Просвещения с надписью «единый закон» — и за ним плитки становятся одинаковыми губерниями. Но под утюгом крестьяне оказываются прикованы к земле.',
    radius: 14, phi: 0.95, theta: 0.3, targetY: 0.8, height: 420, hint: 'Нажми на булаву, плитки, утюг или крестьянина с цепью.',
    build: function (c) {
      var T = c.THREE, G = { land: group(c), iron: group(c), ppl: group(c) };
      c.ground(9.5);
      var iL = '<b>Гетманщина</b> вошла в Россию в 1654 г. <b>по договорным статьям</b>: казачье самоуправление, своё право, полки.';
      var tiles = [], cols = ['#7dc4e8', '#e3c58a', '#a7d38a', '#e8a07a', '#c8a0e0', '#f0d070'];
      for (var x = 0; x < 6; x++) for (var z = 0; z < 4; z++) { var m = into(G.land, c.box3(1.3, 0.3, 1.3, cols[(x + z) % 6], [-4.2 + x * 1.5, 0.15, -2.6 + z * 1.5], iL)); m.userData.base = cols[(x + z) % 6]; tiles.push(m); }
      var iM = '<b>Гетманская булава</b> — символ власти гетмана. <b>1764</b>: Екатерина упраздняет гетманство; <b>1775</b>: ликвидирована Запорожская Сечь; <b>1781</b>: полки → наместничества.';
      var mace = new T.Group(); G.land.add(mace); mace.position.set(-4.2, 0.3, 2.6);
      into(mace, c.mesh(new T.CylinderGeometry(0.06, 0.06, 1.4, 8), GOLD, iM, { metalness: 0.7 })).position.y = 0.7;
      into(mace, c.mesh(new T.SphereGeometry(0.28, 14, 10), GOLD, iM, { metalness: 0.7 })).position.y = 1.5;
      into(G.land, c.label('гетман', [-4.2, 2.4, 2.6], 0.34, '#f0c36b'));
      var iI = '<b>Идея Просвещения: единый закон.</b> На всех территориях — одни и те же правила. Лектор: ликвидация украинской автономии — <b>«абсолютно антиевропейский поступок, но мотивы были именно просвещенческие»</b>.';
      var iron = new T.Group(); G.iron.add(iron);
      into(iron, c.mesh(new T.CylinderGeometry(1.0, 1.4, 0.7, 3), '#c8ccd8', iI, { metalness: 0.7, roughness: 0.3 })).rotation.y = Math.PI / 6;
      into(iron, c.box3(1.4, 0.25, 0.3, DARK, [0, 0.95, 0], iI));
      var lab = c.label('единый закон', [0, 2, 0], 0.36, '#f0c36b'); iron.add(lab);
      var iP = '<b>1783</b>: крестьяне Левобережья <b>прикреплены к земле</b> — крепостное право. «Хотели разумного порядка — получили закрепощение».';
      var peas = person(c, 4.6, 2.6, '#a08060', iP, G.ppl, 1);
      var chain = []; for (var k = 0; k < 5; k++) { var r = into(G.ppl, c.mesh(new T.TorusGeometry(0.1, 0.03, 6, 12), GREY, iP, { metalness: 0.7 })); r.position.set(4.6 + 0.2 + k * 0.17, 0.12, 2.6); r.rotation.y = k % 2 ? Math.PI / 2 : 0; chain.push(r); }
      into(G.ppl, c.box3(0.35, 0.35, 0.35, DARK, [5.6, 0.18, 2.6], iP));
      var iSt = '<b>Казачья старшина</b> (верхушка) получает права <b>российского дворянства</b> (1785) — её «встроили» в общий порядок.';
      var st = person(c, 3.2, 2.6, '#3a5ab0', iSt, G.ppl, 1.1); var hat = c.mesh(new T.CylinderGeometry(0.22, 0.2, 0.3, 10), '#5b3a26', iSt); hat.position.y = 1.4; st.add(hat);
      into(G.ppl, c.label('старшина → дворяне', [3.2, 2.2, 2.6], 0.3, '#9cc2ff')); into(G.ppl, c.label('крестьяне → крепостные', [5.2, 1.6, 3.6], 0.3, '#ffb0a8'));
      c.groups = G;
      c.onFrame(function (t) {
        var k = (t % 10) / 10, ix = -5 + k * 10.5; iron.position.set(ix, 0.65, 0);
        tiles.forEach(function (m) { m.material.color.set(m.position.x < ix - 0.6 ? '#9aa2b8' : m.userData.base); });
      });
    },
    chips: [
      { t: 'Идея', on: function (c) { fade(c, all(c)); c.setView(0.3, 0.95, 14, 0.8); c.say('<b>Единый закон</b> — идея Просвещения: на всех землях одни правила. Утюг делает пёстрое одинаковым.'); } },
      { t: 'Автономия', on: function (c) { fade(c, ['land']); c.setView(-0.3, 0.9, 12, 0.6, -1, 0); c.say('Гетманщина: <b>договор 1654 г.</b>, своё право, казачьи полки, гетман.'); } },
      { t: 'Итог', on: function (c) { fade(c, ['ppl', 'iron']); c.setView(0.5, 0.9, 9, 0.8, 4, 2); c.say('Старшина стала <b>дворянством</b>, крестьяне — <b>крепостными</b> (1783). Антиевропейский результат при просвещенческих мотивах.'); } }
    ]
  });

  /* ======================= 10. Колонисты ======================= */
  reg('rui-colonists3d', {
    title: 'Колонисты: свободная земля для Европы', lead: 'Слева — тесная Европа: домики стоят вплотную, свободной земли нет. По стрелке к востоку едут повозки колонистов — немцев и голландцев-меннонитов. Справа — широкая русская степь: колонии с мельницей появляются рядом с кочевьями башкир.',
    radius: 20, phi: 0.95, theta: 0.15, targetY: 0.6, height: 420, hint: 'Нажми на Европу, повозку, колонию или кочевье.',
    build: function (c) {
      var T = c.THREE, G = { eu: group(c), road: group(c), col: group(c), nom: group(c) };
      c.ground(10.5);
      var iE = 'В <b>Европе давно закончилась свободная земля</b> (лектор). Безземельным крестьянам ехать некуда.';
      into(G.eu, c.box3(4, 0.2, 4, '#5a6a50', [-7, 0.1, 0], iE));
      for (var x = 0; x < 4; x++) for (var z = 0; z < 4; z++) house(c, -8.4 + x * 0.95, -1.4 + z * 0.95, (x + z) % 2 ? PAPER : '#d8c8b0', iE, G.eu, 0.8);
      into(G.eu, c.label('тесная Европа', [-7, 2.2, 0], 0.38, '#eef0f8'));
      var iW = '<b>Манифест 1763 г.</b>: колонистам — земля, <b>свобода веры</b>, 30 лет без налогов, освобождение от военной службы. Ехали <b>немцы</b> и <b>голландцы-меннониты</b>.';
      var wag = []; for (var i = 0; i < 3; i++) { var w = new T.Group(); G.road.add(w); into(w, c.box3(0.9, 0.4, 0.5, WOOD, [0, 0.45, 0], iW)); var top = into(w, c.mesh(new T.CylinderGeometry(0.3, 0.3, 0.9, 12, 1, false, 0, Math.PI), PAPER, iW, { side: T.DoubleSide })); top.rotation.z = Math.PI / 2; top.position.y = 0.65; [-0.3, 0.3].forEach(function (dx) { var wh = into(w, c.mesh(new T.TorusGeometry(0.15, 0.04, 6, 12), DARK, iW)); wh.position.set(dx, 0.17, 0.27); }); wag.push(w); }
      arrow(c, [-4.6, 0.15, 0], [2.4, 0.15, 0], GOLD, iW, G.road, 0.06);
      var iC = '<b>Колонии</b>: поволжские немцы (Саратов, Камышин), меннониты на Хортице (с 1789 г.). Получили распаханную степь и «образцовое» хозяйство.';
      into(G.col, c.box3(7, 0.1, 6.5, '#7a8a4a', [6, 0.05, 0], iC));
      house(c, 5, -1, PAPER, iC, G.col, 1.1); house(c, 6.2, -1.3, '#e8e2d4', iC, G.col, 1.1); house(c, 5.6, 0.3, PAPER, iC, G.col, 1.1);
      var mill = new T.Group(); G.col.add(mill); mill.position.set(7.6, 0, -0.4);
      into(mill, c.mesh(new T.CylinderGeometry(0.35, 0.5, 2, 8), WOOD, iC)).position.y = 1;
      var blades = new T.Group(); mill.add(blades); blades.position.set(0, 1.9, 0.5);
      for (var b = 0; b < 4; b++) { var bl = c.mesh(new T.BoxGeometry(0.15, 1.6, 0.04), PAPER, iC); bl.position.y = 0.8; var pv = new T.Group(); pv.add(bl); pv.rotation.z = b * Math.PI / 2; blades.add(pv); }
      into(G.col, c.label('колонии', [6, 3.4, -0.5], 0.4, '#f0c36b'));
      var iN = 'Рядом — <b>кочевые</b> народы, например <b>башкиры</b>: у них свой, традиционный уклад.';
      [[5.2, 2.6], [7.2, 2.2]].forEach(function (p) { var y = into(G.nom, c.mesh(new T.CylinderGeometry(0.7, 0.75, 0.6, 14), '#e8dcc0', iN)); y.position.set(p[0], 0.4, p[1]); var r = into(G.nom, c.mesh(new T.ConeGeometry(0.75, 0.45, 14), '#c9b27a', iN)); r.position.set(p[0], 0.92, p[1]); });
      into(G.nom, c.label('башкиры', [6.2, 1.8, 2.6], 0.34, '#9fe0c0'));
      c.groups = G;
      c.onFrame(function (t) { wag.forEach(function (w, i) { var k = ((t * 0.08 + i / 3) % 1); w.position.set(-4.4 + k * 6.6, 0, (i - 1) * 0.6); }); blades.rotation.z = t * 1.2; });
    },
    chips: [
      { t: 'Путь', on: function (c) { fade(c, all(c)); c.setView(0.15, 0.95, 20, 0.6); c.say('Екатерина <b>приглашает колонистов</b>: в Европе земли нет, в России — сколько угодно.'); } },
      { t: 'Европа', on: function (c) { fade(c, ['eu']); c.setView(-0.4, 0.9, 8, 0.6, -7, 0); c.say('Тесно: свободная земля кончилась.'); } },
      { t: 'Колонии', on: function (c) { fade(c, ['col', 'nom']); c.setView(0.4, 0.9, 11, 0.8, 6, 0.5); c.say('Немцы и меннониты строят хозяйства; рядом — кочевья башкир.'); } }
    ]
  });

  /* ======================= 11. Финляндия ======================= */
  reg('rui-finland3d', {
    title: 'Финляндия: автономия и памятник царю', lead: 'Небольшой край у моря. В центре — Сенатская площадь Хельсинки: собор и памятник русскому императору. Рядом — здание сейма и сенат. Столбик монет растёт: после Крымской войны Финляндия показывает резкий экономический рост.',
    radius: 13, phi: 0.95, theta: 0.3, targetY: 1.3, height: 420, hint: 'Нажми на памятник, сейм, собор или монеты.',
    build: function (c) {
      var T = c.THREE, G = { sq: group(c), sejm: group(c), econ: group(c) };
      c.ground(8.5, '#4e6a5a');
      var iC = '<b>Великое княжество Финляндское</b> (с 1809 г.). Александр I на <b>Боргоском сейме</b> обещал сохранить её законы, лютеранскую веру и права сословий.';
      into(G.sq, c.box3(3.2, 1.6, 2, WHITE, [0, 0.8, -3], iC));
      for (var i = 0; i < 6; i++) into(G.sq, c.mesh(new T.CylinderGeometry(0.12, 0.12, 1.6, 8), WHITE, iC)).position.set(-1.3 + i * 0.52, 0.8, -1.9);
      var dm = into(G.sq, c.mesh(new T.SphereGeometry(0.8, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#4c9a7a', iC)); dm.position.set(0, 1.9, -3);
      into(G.sq, c.label('Хельсинки, Сенатская площадь', [0, 3.6, -3], 0.36, '#eef0f8'));
      var iM = '<b>Памятник Александру II</b> (1894). Лектор: Финляндия <b>очень почитает</b> русского императора — он дал ей самоуправление. Александр II в 1863 г. снова созвал <b>сейм</b>.';
      into(G.sq, c.box3(1, 1.2, 1, STONE, [0, 0.6, 0.5], iM));
      var st = person(c, 0, 0.5, '#2a3a5a', iM, G.sq, 1, 1.2);
      into(G.sq, c.label('памятник императору', [0, 3.3, 0.5], 0.32, '#f0c36b'));
      var iS = '<b>Сейм и Сенат</b>: свои законы, свои чиновники-финны, своё управление. Это и есть <b>автономия</b> — право самим решать внутренние дела.';
      into(G.sejm, c.box3(2.2, 1.2, 1.5, '#e8d8b0', [-4, 0.6, 0], iS)); into(G.sejm, c.mesh(new T.ConeGeometry(1.4, 0.6, 4), '#7a3b2e', iS)).position.set(-4, 1.5, 0);
      into(G.sejm, c.label('сейм', [-4, 2.5, 0], 0.34, '#9cc2ff'));
      flag(c, [-5.4, 0, 1.2], WHITE, iS, G.sejm, 2);
      var iE = '<b>Экономический рост</b> после Крымской войны: реформы дали Финляндии свой тип хозяйственного поведения, сохранившийся до XX в. С <b>1860 г.</b> — своя валюта, <b>марка</b>.';
      var coins = []; for (var k = 0; k < 10; k++) { var cn = into(G.econ, c.mesh(new T.CylinderGeometry(0.4, 0.4, 0.1, 18), GOLD, iE, { metalness: 0.8, roughness: 0.25 })); cn.position.set(4, 0.05 + k * 0.12, 0); coins.push(cn); }
      into(G.econ, c.label('марка, рост', [4, 2.4, 0], 0.34, '#f0c36b'));
      into(G.econ, c.box3(10, 0.05, 2, SEA, [0, 0.03, 4.5], '<b>Финский залив</b>.'));
      c.groups = G;
      c.onFrame(function (t) { var n = Math.floor((t * 1.5) % 11); coins.forEach(function (cn, i) { cn.visible = i < n; }); st.rotation.y = Math.sin(t * 0.4) * 0.3; });
    },
    chips: [
      { t: 'Обзор', on: function (c) { fade(c, all(c)); c.setView(0.3, 0.95, 13, 1.3); c.say('Отсталый край Европы получил <b>автономию</b> от Александра I — и стал одной из самых спокойных и богатеющих окраин.'); } },
      { t: 'Памятник', on: function (c) { fade(c, ['sq']); c.setView(0.1, 0.9, 8, 1.6, 0, -1); c.say('Памятник <b>Александру II</b> в центре Хельсинки — знак благодарности за самоуправление.'); } },
      { t: 'Сейм', on: function (c) { fade(c, ['sejm']); c.setView(-0.6, 0.9, 7, 1, -4, 0); c.say('Свои законы, сейм и сенат — <b>противоположность</b> екатерининской унификации Украины.'); } },
      { t: 'Рост', on: function (c) { fade(c, ['econ']); c.setView(0.6, 0.9, 7, 1, 4, 0); c.say('После Крымской войны — <b>резкий экономический прогресс</b>.'); } }
    ]
  });

  /* ======================= 12. Польша ======================= */
  reg('rui-poland3d', {
    title: 'Польша: конституция → восстания → реформа', lead: 'Три ступени по времени. 1815: Царство Польское с сеймом, Государственным советом и своей армией. 1830 и 1863: пламя восстаний, Константин Павлович бежит из Варшавы. 1864: Милютин раздаёт землю крестьянам — шляхта остаётся без опоры.',
    radius: 18.5, phi: 0.95, theta: 0.2, targetY: 1.4, height: 430, hint: 'Нажми на каждую ступень, на шляхтича и на крестьян.',
    build: function (c) {
      var T = c.THREE, G = { s1: group(c), s2: group(c), s3: group(c) };
      c.ground(10);
      var i1 = '<b>1815.</b> Венский конгресс: <b>Царство Польское</b> в составе России. Александр I даёт <b>конституцию</b>: <b>сейм</b>, <b>Государственный совет</b>, своя администрация и <b>своя армия</b>; главнокомандующий — великий князь <b>Константин Павлович</b>.';
      into(G.s1, c.box3(4, 0.6, 4, '#e8e8e8', [-6, 0.3, 0], i1)); into(G.s1, c.box3(4, 0.3, 4, '#d04848', [-6, 0.75, 0], i1));
      into(G.s1, c.box3(1.8, 1, 1.2, '#f0ead8', [-6.6, 1.4, -0.6], i1)); var b = into(G.s1, c.mesh(new T.ConeGeometry(1.2, 0.5, 4), '#7a3b2e', i1)); b.position.set(-6.6, 2.15, -0.6); b.rotation.y = Math.PI / 4;
      for (var i = 0; i < 3; i++) person(c, -5.2 + i * 0.5, 1.1, '#2b3a66', i1, G.s1, 0.55, 0.9);
      into(G.s1, c.label('1815: конституция,\nсейм, армия', [-6, 3.4, 0], 0.34, '#eef0f8'));
      var i2 = '<b>1830–1831</b> — Ноябрьское восстание: Константин Павлович <b>изгнан из Варшавы</b>; восстание подавлено, в <b>1832</b> конституция отменена (Органический статут). <b>1863–1864</b> — Январское восстание. Его готовила и возглавляла <b>шляхта</b>.';
      into(G.s2, c.box3(4, 1.4, 4, '#8f3636', [0, 0.7, 0], i2));
      var fl = []; for (var k = 0; k < 5; k++) { var f = into(G.s2, c.mesh(new T.ConeGeometry(0.35, 1.2, 8), k % 2 ? ORANGE : '#ffcf5a', i2, { emissive: ORANGE, emissiveIntensity: 0.9 })); f.position.set(-1.3 + k * 0.65, 2, (k % 2 ? 0.6 : -0.4)); fl.push(f); }
      var szl = person(c, 1.2, 1.3, '#6a2a2a', '<b>Шляхта</b> — польское дворянство, мечтавшее о независимой Польше. Главная сила восстаний.', G.s2, 0.9, 1.4);
      into(G.s2, c.label('1830 и 1863:\nвосстания', [0, 4, 0], 0.34, '#ffb0a8'));
      var i3 = '<b>1864.</b> Крестьянская реформа в Царстве Польском. <b>Николай Милютин</b> («красный») дал крестьянам землю <b>на лучших условиях</b>, чем русским в 1861 г. Цель — <b>ослабить шляхту</b>: крестьяне за Россию, а не за панов. Затем — <b>русификация</b>.';
      into(G.s3, c.box3(4, 2.2, 4, '#3f6d4a', [6, 1.1, 0], i3));
      var fields = []; for (var m = 0; m < 4; m++) { var fd = into(G.s3, c.box3(0.85, 0.06, 3.2, m % 2 ? '#c9b27a' : '#a7d38a', [4.7 + m * 0.9, 2.25, 0], i3)); fields.push(fd); }
      for (var p = 0; p < 3; p++) person(c, 4.9 + p * 1.1, 1.2, '#a08060', i3, G.s3, 0.6, 2.3);
      into(G.s3, c.label('1864: земля\nкрестьянам', [6, 4.6, 0], 0.34, '#9fe0c0'));
      arrow(c, [-3.8, 1.2, 2.4], [-2.2, 1.6, 2.4], GOLD, i2, G.s2, 0.05); arrow(c, [2.2, 1.9, 2.4], [3.8, 2.4, 2.4], GOLD, i3, G.s3, 0.05);
      c.groups = G;
      c.onFrame(function (t) { fl.forEach(function (f, i) { f.scale.y = 1 + Math.sin(t * 8 + i) * 0.3; }); szl.position.y = 1.4 + Math.abs(Math.sin(t * 2)) * 0.1; });
    },
    chips: [
      { t: 'Лестница', on: function (c) { fade(c, all(c)); c.setView(0.2, 0.95, 18.5, 1.4); c.say('Польша — пример того, как широкая автономия сменилась восстаниями и <b>русификацией</b>.'); } },
      { t: '1815', on: function (c) { fade(c, ['s1']); c.setView(-0.4, 0.9, 9, 1.4, -6, 0); c.say('Своя конституция, сейм, Госсовет, армия под командой <b>Константина Павловича</b>.'); } },
      { t: 'Восстания', on: function (c) { fade(c, ['s2']); c.setView(0.1, 0.9, 9, 2, 0, 0); c.say('<b>1830</b>: Константин бежит из Варшавы. <b>1863</b>: новое восстание шляхты.'); } },
      { t: '1864', on: function (c) { fade(c, ['s3']); c.setView(0.5, 0.9, 9, 2.5, 6, 0); c.say('<b>Милютин</b>: земля крестьянам → шляхта без опоры.'); } }
    ]
  });

  /* ======================= 13. Дилемма: развивать или русифицировать ======================= */
  reg('rui-dilemma3d', {
    title: 'Вечный вопрос: развивать или «сделать как все»?', lead: 'Весы империи. На левой чаше — «сохранить свою культуру»: разноцветные книги на родных языках. На правой — «привести к общему порядку»: одинаковые серые кубики — русский язык и общие правила. Весы всё время качаются: империя так и не выбрала один ответ.',
    radius: 11, phi: 1.0, theta: 0.2, targetY: 2, height: 420, hint: 'Нажми на левую чашу, правую чашу или на корни дерева.',
    build: function (c) {
      var T = c.THREE, G = { scale: group(c), roots: group(c) };
      c.ground(8);
      var iQ = 'В России всё время возникает <b>один и тот же вопрос</b>: как относиться к <b>нерусскому</b> и <b>неправославному</b> населению?';
      into(G.scale, c.mesh(new T.CylinderGeometry(0.15, 0.3, 3.4, 10), '#c8ccd8', iQ, { metalness: 0.6 })).position.set(0, 1.7, 0);
      var beam = new T.Group(); G.scale.add(beam); beam.position.set(0, 3.5, 0);
      into(beam, c.mesh(new T.BoxGeometry(6, 0.15, 0.15), '#c8ccd8', iQ, { metalness: 0.6 }));
      var iL = '<b>Путь 1: дать развиваться</b> — сохранять язык, традиции, свою культуру. Пример — <b>система Ильминского</b> (1860-е): школа и богослужение на родных языках народов Поволжья; Финляндия с её автономией.';
      var iR = '<b>Путь 2: унификация, русификация</b> — перевести на <b>русский язык</b>, общие законы, общую школу. Пример — Польша после 1863 г.';
      var panL = new T.Group(), panR = new T.Group(); beam.add(panL); beam.add(panR); panL.position.x = -2.8; panR.position.x = 2.8;
      [panL, panR].forEach(function (p, i) { var d = c.mesh(new T.CylinderGeometry(1, 0.8, 0.15, 24), '#c8ccd8', i ? iR : iL, { metalness: 0.6 }); d.position.y = -1.6; p.add(d); p.add(c.link([0, 0, 0], [0, -1.55, 0], '#c8ccd8', 0.025, i ? iR : iL)); });
      var bc = [RED, GREEN, BLUE, GOLD, PURPLE];
      for (var i = 0; i < 5; i++) { var bk = c.mesh(new T.BoxGeometry(0.22, 0.6, 0.45), bc[i], iL); bk.position.set(-0.5 + i * 0.25, -1.2, 0); bk.rotation.z = (i - 2) * 0.08; panL.add(bk); }
      for (var j = 0; j < 6; j++) { var cb = c.mesh(new T.BoxGeometry(0.35, 0.35, 0.35), GREY, iR); cb.position.set(-0.4 + (j % 3) * 0.4, -1.35 + Math.floor(j / 3) * 0.37, 0); panR.add(cb); }
      var lL = c.label('свою культуру', [0, 0.6, 0], 0.32, '#9fe0c0'); panL.add(lL);
      var lR = c.label('общий порядок', [0, 0.6, 0], 0.32, '#cfd6ea'); panR.add(lR);
      var iK = '<b>Ключевский</b>: великорусская народность сложилась при смешении славян с <b>финскими</b> племенами (меря, мурома, весь). Отсюда нерусские названия рек: <b>Ока, Клязьма, Кострома, Москва</b>. То есть «нерусское» — внутри самих русских.';
      var rc = [RED, GREEN, GREEN, ORANGE];
      rc.forEach(function (col, k) { var a = k / 4 * Math.PI * 2; into(G.roots, c.link([0, 0.05, 0], [Math.cos(a) * 3, 0.05, Math.sin(a) * 3], col, 0.12, iK)); });
      into(G.roots, c.label('Ключевский: корни', [0, 0.9, 3.4], 0.32, '#9fe0c0'));
      c.groups = G;
      c.onFrame(function (t) { var a = Math.sin(t * 0.7) * 0.18; beam.rotation.z = a; panL.rotation.z = -a; panR.rotation.z = -a; });
    },
    chips: [
      { t: 'Весы', on: function (c) { fade(c, all(c)); c.setView(0.2, 1.0, 11, 2); c.say('Империя качалась между двумя ответами — и к концу XIX в. всё сильнее склонялась к <b>русификации</b>.'); } },
      { t: 'Культура', on: function (c) { fade(c, ['scale']); c.setView(-0.4, 1.0, 8, 2.2, -2.5, 0); c.say('Развивать языки и традиции — <b>лояльность и спокойствие</b>, но разные законы в одной стране.'); } },
      { t: 'Порядок', on: function (c) { fade(c, ['scale']); c.setView(0.6, 1.0, 8, 2.2, 2.5, 0); c.say('Одинаковые правила — <b>проще управлять</b>, но растут обида и национализм.'); } },
      { t: 'Корни', on: function (c) { fade(c, ['roots']); c.setView(0.3, 0.7, 9, 0.2); c.say('<b>Ключевский</b>: у русских есть <b>финно-угорские</b> корни.'); } }
    ]
  });

  /* ======================= 14. Кавказ ======================= */
  reg('rui-caucasus3d', {
    title: 'Кавказ: просека, крепость, станица', lead: 'Горный хребет, через него — Военно-Грузинская дорога к Грузии. На равнине перед горами — лес, где укрываются горцы. Солдаты вырубают лес на расстояние ружейного выстрела, другие их охраняют; за просекой встаёт крепость, потом казачья станица — и линия сдвигается вперёд.',
    radius: 20, phi: 0.9, theta: 0.35, targetY: 1, height: 430, hint: 'Нажми на дорогу, лес, солдат, крепость или станицу.',
    build: function (c) {
      var T = c.THREE, G = { mnt: group(c), forest: group(c), army: group(c), line: group(c) };
      c.ground(10.5, '#4f5e45');
      var iM = '<b>Главный Кавказский хребет</b>. За ним — <b>Грузия</b> (в составе России с 1801 г.). Единственная связь — <b>Военно-Грузинская дорога</b>.';
      for (var i = 0; i < 6; i++) { var m = into(G.mnt, c.mesh(new T.ConeGeometry(1.6 + (i % 2) * 0.5, 3.4 + (i % 3) * 0.8, 6), i % 2 ? '#7d7d88' : '#8e8e9a', iM)); m.position.set(-7 + i * 2.8, 1.7, -5.5); var sn = into(G.mnt, c.mesh(new T.ConeGeometry(0.6, 0.9, 6), SNOW, iM)); sn.position.set(-7 + i * 2.8, 3.1 + (i % 3) * 0.8 - 0.3, -5.5); }
      var iR = '<b>Военно-Грузинская дорога</b> — главный путь в Закавказье. Горские общества постоянно <b>нападали</b> на дорогу и на российские земли.';
      into(G.mnt, c.box3(0.7, 0.06, 7, '#c9b27a', [1, 0.05, -4.5], iR)); into(G.mnt, c.label('Военно-Грузинская дорога', [1, 1.2, -2], 0.34, '#f0c36b'));
      var iF = '<b>Лес</b> — укрытие горцев: из него нападали летучими отрядами.';
      var trees = []; for (var x = 0; x < 9; x++) for (var z = 0; z < 3; z++) trees.push(tree(c, -7 + x * 1.2 + (z % 2) * 0.5, -2.2 + z * 1, iF, G.forest, 1));
      var iA = '<b>Метод Ермолова</b>: солдаты <b>рубят лес на расстояние ружейного выстрела</b> от дорог и крепостей, а <b>другие солдаты их охраняют</b>.';
      var axes = []; for (var s = 0; s < 3; s++) { var p = person(c, -5 + s * 1.3, 1.2, '#2b3a66', iA, G.army, 0.7); var ax = c.mesh(new T.BoxGeometry(0.08, 0.6, 0.08), WOOD, iA); ax.position.set(0.25, 0.7, 0); p.add(ax); axes.push(ax); }
      for (var q = 0; q < 2; q++) { var gd = person(c, -4.4 + q * 2.6, 2.2, '#3a4a2a', iA, G.army, 0.75); var gun = c.mesh(new T.CylinderGeometry(0.03, 0.03, 1, 6), WOOD, iA); gun.position.set(0.25, 0.8, 0); gun.rotation.x = 0.6; gd.add(gun); }
      var iK = '<b>Укреплённая линия</b>: крепости (Грозная, 1818) и посты. Непокорных жителей <b>вытесняют</b> с равнин.';
      var fort = new T.Group(); G.line.add(fort); fort.position.set(3.5, 0, 1.6);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { into(fort, c.box3(2.2, 0.8, 0.2, '#a0805a', [0, 0.4, p[1]], iK)).rotation.y = 0; into(fort, c.box3(0.2, 0.8, 2.2, '#a0805a', [p[0], 0.4, 0], iK)); });
      tower(c, 4.5, 2.6, '#a0805a', iK, G.line, 1.4, WOOD);
      into(G.line, c.label('крепость', [3.5, 2.2, 1.6], 0.34, '#eef0f8'));
      var iSt = 'Освоенная земля становится <b>новой линией</b>: туда переселяют <b>казаков</b> (например, кубанских) — появляются станицы.';
      house(c, 7, 3.5, PAPER, iSt, G.line, 1); house(c, 8, 2.8, '#e8e2d4', iSt, G.line, 1); house(c, 7.6, 4.4, PAPER, iSt, G.line, 0.9);
      into(G.line, c.label('казачья станица', [7.6, 1.9, 3.6], 0.34, '#9fe0c0'));
      c.groups = G;
      c.onFrame(function (t) {
        var k = (t % 12) / 12, cut = -7.5 + k * 11;
        trees.forEach(function (tr) { tr.visible = tr.position.x > cut || tr.position.z < -1.8; });
        axes.forEach(function (a, i) { a.rotation.z = Math.sin(t * 6 + i) * 0.6; });
        G.army.position.x = k * 6;
      });
    },
    chips: [
      { t: 'Метод', on: function (c) { fade(c, all(c)); c.setView(0.35, 0.9, 20, 1); c.say('Шаг за шагом: <b>просека → крепость → станица</b> → новая просека. Медленно и жестоко.'); } },
      { t: 'Дорога', on: function (c) { fade(c, ['mnt']); c.setView(0.1, 0.8, 13, 2, 1, -4.5); c.say('Связь с Грузией — только <b>Военно-Грузинская дорога</b>, на которую нападали горские общества.'); } },
      { t: 'Просека', on: function (c) { fade(c, ['forest', 'army']); c.setView(-0.3, 0.85, 11, 1, -2, 0); c.say('Лес вырубают <b>на ружейный выстрел</b>: из засады уже не напасть. Одни рубят, другие охраняют.'); } },
      { t: 'Линия', on: function (c) { fade(c, ['line']); c.setView(0.8, 0.85, 10, 1, 5.5, 2.5); c.say('Крепость и <b>казачья станица</b>. По словам лектора, это не геноцид в смысле уничтожения, а <b>вытеснение</b>; оценка выселения горцев в 1860-х и сегодня спорная.'); } }
    ]
  });
})();
