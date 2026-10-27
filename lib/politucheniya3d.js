/* Дополнительные 3D-модели к конспекту «Марсилий Падуанский» (движок HubScene3d).
   В Markdown: @@graph:mars-europe3d@@ @@graph:mars-law3d@@ @@graph:mars-ladder3d@@ @@graph:mars-verona3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) { HubWidgets.register(name, function (box) { HubScene3d(box, opts); }); }
  function figure(c, x, z, col, info, h) {
    var T = c.THREE; h = h || 1;
    var b = c.mesh(new T.CylinderGeometry(0.28 * h, 0.38 * h, 1.1 * h, 12), col, info); b.position.set(x, 0.55 * h, z);
    var hd = c.mesh(new T.SphereGeometry(0.27 * h, 14, 10), '#e8c6a0', info); hd.position.set(x, 1.35 * h, z);
    return [b, hd];
  }

  /* ---------- Карта конфликта 1324–1328 ---------- */
  reg('mars-europe3d', {
    title: 'Европа 1324–1328: папа против императора', lead: 'Где жил папа, откуда пошёл Людвиг Баварский и где его короновали. Переключай годы.',
    radius: 20, phi: 0.8, targetY: 0,
    hint: 'Нажми на город или выбери год.',
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.BoxGeometry(16, 0.4, 14), '#3b6ea8', 'Средиземное море и Европа.', { roughness: 0.4 }).position.y = -0.3;
      var land = c.mesh(new T.BoxGeometry(14, 0.5, 7), '#7fb26a', 'Европа.'); land.position.set(0, 0, -3);
      var boot = c.mesh(new T.BoxGeometry(2.2, 0.5, 7), '#8cbf75', 'Италия: раздроблена на города и княжества.'); boot.position.set(2.6, 0, 2.8); boot.rotation.y = -0.45;
      var fr = c.mesh(new T.BoxGeometry(4.5, 0.5, 3), '#7fb26a', 'Юг Франции.'); fr.position.set(-4, 0, 1);
      var C = {
        paris: [-4, -3.6, 'Париж', '<b>[ДОБАВЛЕНО]</b> Париж: здесь Марсилий был ректором университета и написал «Защитника мира» (1324).'],
        munich: [2.2, -4.2, 'Бавария', '<b>Людвиг IV Баварский</b> — германский король. Папа отказывается его признать.'],
        avignon: [-3.4, 1.6, 'Авиньон', '<b>Папа Иоанн XXII</b> живёт не в Риме, а в Авиньоне (Авиньонское пленение пап, 1309–1377).'],
        padua: [2.4, -0.6, 'Падуя', '<b>Падуя</b> — родина Марсилия. Богатый торговый город, где горожане сами выбирали власть.'],
        rome: [3.6, 4.6, 'Рим', '<b>Рим, 17 января 1328 г.</b> Людвиг коронуется императором, затем низлагает папу и ставит своего.']
      };
      var pins = {};
      Object.keys(C).forEach(function (k) {
        var p = C[k];
        var pin = c.mesh(new T.CylinderGeometry(0.08, 0.08, 1.4, 8), '#ffffff', p[3]); pin.position.set(p[0], 0.9, p[1]);
        var head = c.mesh(new T.SphereGeometry(0.38, 16, 12), k === 'avignon' ? '#f0c36b' : k === 'munich' ? '#4f7be0' : k === 'paris' ? '#b07cff' : '#ef6b5b', p[3]); head.position.set(p[0], 1.7, p[1]);
        c.label(p[2], [p[0], 2.6, p[1]], 0.5); pins[k] = head;
      });
      var tiara = c.mesh(new T.ConeGeometry(0.35, 0.9, 16), '#f3efe6', C.avignon[3]); tiara.position.set(C.avignon[0], 2.4, C.avignon[1]);
      var crown = c.mesh(new T.TorusGeometry(0.4, 0.12, 8, 6), '#f0c36b', C.rome[3], { metalness: 0.8, roughness: 0.2 }); crown.rotation.x = Math.PI / 2; crown.visible = false;
      var path = new T.CatmullRomCurve3([new T.Vector3(2.2, 0.6, -4.2), new T.Vector3(2.3, 0.6, -2.2), new T.Vector3(2.4, 0.6, -0.6), new T.Vector3(3.2, 0.6, 2), new T.Vector3(3.6, 0.6, 4.6)]);
      var road = c.mesh(new T.TubeGeometry(path, 40, 0.08, 6), '#4f7be0', '<b>Итальянский поход Людвига, 1327–1328.</b> Спор решает сила, а не богословие.', { transparent: true, opacity: 0.85 }); road.visible = false;
      var army = []; for (var i = 0; i < 9; i++) { var a = c.mesh(new T.BoxGeometry(0.25, 0.35, 0.25), '#2f4fa8', road.userData.info); a.visible = false; army.push(a); }
      var book = c.box3(0.9, 0.2, 0.7, '#b07cff', [C.paris[0], 2.6, C.paris[1]], C.paris[3]); book.visible = false;
      c.state = { mode: 0, t0: 0 };
      c.onFrame(function (t) {
        var m = c.state.mode;
        book.visible = m === 0; if (m === 0) book.rotation.y = t;
        road.visible = m >= 1;
        army.forEach(function (a, i) { a.visible = m === 1; if (m === 1) { var k = ((t * 0.12) + i * 0.012) % 1; var p = path.getPoint(k); a.position.set(p.x + (i % 3 - 1) * 0.3, 0.75, p.z + (Math.floor(i / 3) - 1) * 0.3); } });
        crown.visible = m === 2; if (m === 2) { crown.position.set(C.rome[0], 2.6 + Math.sin(t * 2) * 0.15, C.rome[1]); crown.rotation.z = t; }
        tiara.position.y = m === 2 ? 2.4 + Math.max(-1.6, -((t * 0.5) % 2)) : 2.4;
      });
    },
    chips: [
      { t: '1324', small: 'трактат', on: function (c) { c.state.mode = 0; c.setView(-0.5, 0.85, 18, 0); c.say('<b>1324:</b> «Защитник мира». Марсилий доказывает: власть от народа, а не от папы. Его объявляют еретиком.'); } },
      { t: '1327–1328', small: 'поход', on: function (c) { c.state.mode = 1; c.setView(0.4, 0.75, 19, 0); c.say('Людвиг Баварский идёт походом в Италию. Марсилий — при нём, как советник.'); } },
      { t: '17.01.1328', small: 'коронация', on: function (c) { c.state.mode = 2; c.setView(0.7, 0.8, 14, 0.5); c.say('<b>Коронация в Риме</b> без папы. Затем Людвиг низлагает Иоанна XXII и ставит своего папу. Церковное признание легко потерять.'); } }
    ]
  });

  /* ---------- Законодатель и исполнитель ---------- */
  reg('mars-law3d', {
    title: 'Кто пишет закон, а кто его исполняет', lead: 'Слева — собрание граждан (законодатель), в центре — закон, справа — правитель (исполнитель). Нажимай на кнопки.',
    radius: 23, phi: 1.05, targetY: 1.2,
    build: function (c) {
      var T = c.THREE;
      c.mesh(new T.CylinderGeometry(9, 9, 0.3, 64), '--panel2', 'Государство.').position.y = -0.15;
      var people = [];
      for (var i = 0; i < 12; i++) { var f = figure(c, -6.2 + (i % 4) * 0.9, -1.4 + Math.floor(i / 4) * 1.1, '#4f7be0', '<b>Законодатель — народ</b> (<i>legislator humanus</i>): собрание граждан или его «весомейшая часть». Принимает закон после дебатов и отвечает за его текст.', 0.8); people.push(f); }
      c.label('Народ = законодатель', [-4.9, 2.6, 0], 0.55, '#7aa2ff');
      var ped = c.mesh(new T.CylinderGeometry(0.8, 1, 1.4, 20), '#d8d2c4', '<b>Закон</b> — главное в государстве. Он выше любого правителя.'); ped.position.set(0, 0.7, 0);
      var book = c.box3(1.4, 0.35, 1, '#c9a24a', [0, 1.6, 0], ped.userData.info);
      c.label('Закон', [0, 2.6, 0], 0.55, '#f0c36b');
      var rul = figure(c, 5.2, 0, '#bf5b4a', '<b>Исполнитель — правитель</b> (<i>pars principans</i>). Применяет закон и может принуждать, но подотчётен законодателю.', 1.3);
      var crown = c.mesh(new T.TorusGeometry(0.3, 0.09, 8, 6), '#f0c36b', rul[0].userData.info, { metalness: 0.8 }); crown.rotation.x = Math.PI / 2;
      var sword = c.mesh(new T.BoxGeometry(0.08, 1.6, 0.18), '#c8ccd8', '<b>Меч — принуждение.</b> Есть только у светской власти. У церкви принудительной власти нет.', { metalness: 0.8 });
      c.label('Правитель = исполнитель', [5.2, 3.6, 0], 0.55, '#ef6b5b');
      function arc(a, b, col, info, lift) { var mid = a.clone().add(b).multiplyScalar(0.5); mid.y += lift; var cv = new T.QuadraticBezierCurve3(a, mid, b); var m = c.mesh(new T.TubeGeometry(cv, 24, 0.06, 6), col, info); var d = c.mesh(new T.SphereGeometry(0.16, 10, 8), col, info); d.userData.c = cv; return [m, d]; }
      var A = [
        arc(new T.Vector3(-3.6, 1.6, 0), new T.Vector3(-0.8, 1.8, 0), '#7aa2ff', 'Народ <b>пишет</b> закон.', 1.5),
        arc(new T.Vector3(0.8, 1.8, 0), new T.Vector3(4.4, 1.8, 0), '#f0c36b', 'Правитель <b>получает</b> закон и применяет его.', 1.5),
        arc(new T.Vector3(4.6, 0.6, 1), new T.Vector3(-4.5, 0.6, 1.8), '#ef6b5b', 'Правитель <b>принуждает</b> исполнять закон.', -0.2),
        arc(new T.Vector3(-4.5, 2.4, -1.4), new T.Vector3(4.8, 3, -1), '#4cc38a', 'Народ <b>контролирует</b> правителя и может сместить его — по закону, а не силой.', 3.2)
      ];
      c.state = { swap: 0, her: false };
      c.onFrame(function (t) {
        A.forEach(function (a, i) { a[1].position.copy(a[0].geometry.parameters.path.getPoint((t * 0.25 + i * 0.25) % 1)); });
        if (c.state.req) { c.state.req = false; c.state.swap = t; rul[0].material.color.set('#bf5b4a'); }
        var s = c.state.swap ? Math.min(1, (t - c.state.swap) / 1.5) : 0, y = s < 0.5 ? -s * 2 * 2.2 : -(1 - s) * 2 * 2.2;
        rul[0].position.y = 0.55 * 1.3 + y; rul[1].position.y = 1.35 * 1.3 + y;
        if (s >= 0.5) { rul[0].material.color.set('#c97a3a'); }
        crown.position.set(5.2, 2.15 + y, 0); sword.position.set(5.85, 1.1 + y, 0.2);
        book.rotation.y = Math.sin(t) * 0.2;
        ped.material.color.set(c.state.her ? '#ef6b5b' : '#d8d2c4');
      });
    },
    chips: [
      { t: 'Кто главный?', small: 'законодатель', on: function (c) { c.state.her = false; c.setView(-0.4, 1.0, 21, 1.2); c.say('Первая причина закона — <b>народ</b>. Правитель только исполняет то, что решили граждане.'); } },
      { t: 'Сместить по закону', small: 'контроль', on: function (c) { c.state.her = false; c.state.req = true; c.setView(0.5, 1.0, 18, 1.5); c.say('Плохого правителя народ <b>смещает по закону</b> и выбирает нового. Кризис власти решается быстро, без гражданской войны.'); } },
      { t: 'Наследственная власть', small: 'против закона', on: function (c) { c.state.her = true; c.setView(0.2, 1.0, 21, 1.2); c.say('Если власть передаётся от отца к сыну, закон опирается на одну фигуру, а не на волю народа. Марсилий считал это противоречием идее законности.'); } }
    ]
  });

  /* ---------- Лестница общностей ---------- */
  reg('mars-ladder3d', {
    title: 'Лестница общностей: от семьи к государству', lead: 'По Аристотелю (и Марсилию) общность растёт ступенями. На каждой ступени власть всё больше держится на праве, а не на воле одного.',
    radius: 25, phi: 1.1, targetY: 2.5,
    build: function (c) {
      var T = c.THREE;
      var S = [
        ['Семья', 1, '#c98f5a', 'В самодостаточном доме <b>отец решает всё сам</b>, как хочет.'],
        ['Деревня', 5, '#b9a58a', 'В деревенской общине отец уже действует через <b>общие правила</b>: у него доля полномочий и доля ответственности.'],
        ['Город', 14, '#9aa2c0', 'Городская община: ремёсла, торговля, выборная администрация, суд.'],
        ['Государство', 26, '#7aa2ff', '<b>Совершенное государство</b> — самодостаточно и живёт по закону, который принял народ.']
      ];
      S.forEach(function (s, k) {
        var x = -6 + k * 4, h = 0.6 + k * 1.2, w = 3.4;
        var st = c.box3(w, h, w, s[2], [x, h / 2, 0], '<b>' + s[0] + '.</b> ' + s[3]);
        for (var i = 0; i < s[1]; i++) {
          var hx = x - 1.2 + (i % 5) * 0.6, hz = -1.2 + Math.floor(i / 5) * 0.6; if (s[1] === 1) { hx = x; hz = 0; }
          var hs = s[1] === 1 ? 1 : 0.4;
          c.box3(0.5 * hs * 2, 0.4 * hs * 2, 0.5 * hs * 2, '#f1eadb', [hx, h + 0.4 * hs, hz], st.userData.info);
          var rf = c.mesh(new T.ConeGeometry(0.42 * hs * 2, 0.4 * hs * 2, 4), '#b5583e', st.userData.info); rf.rotation.y = Math.PI / 4; rf.position.set(hx, h + 0.8 * hs * 2 + 0.2 * hs, hz);
        }
        if (k >= 2) { var wall = c.mesh(new T.TorusGeometry(1.7, 0.1, 6, 4), '#6b7085', st.userData.info); wall.rotation.x = Math.PI / 2; wall.rotation.z = Math.PI / 4; wall.position.set(x, h + 0.1, 0); }
        c.label(s[0], [x, h + 2.4, 0], 0.6);
      });
      var pole = c.mesh(new T.CylinderGeometry(0.05, 0.05, 2.2, 6), '#ddd', 'Флаг государства.'); pole.position.set(6, 5.2, 1.4);
      var flag = c.mesh(new T.PlaneGeometry(1, 0.6), '#ef6b5b', 'Государство: единая власть и единая иерархия органов.', { side: T.DoubleSide }); flag.position.set(6.5, 6, 1.4);
      c.onFrame(function (t) { flag.rotation.y = Math.sin(t * 2) * 0.3; });
    },
    chips: [
      { t: 'Семья', small: 'воля отца', on: function (c) { c.setView(-0.6, 1.0, 14, 1); c.say('В доме отец распоряжается всем, как хочет. Права здесь ещё почти нет.'); } },
      { t: 'Государство', small: 'власть закона', on: function (c) { c.setView(0.5, 1.0, 17, 4); c.say('Чем крупнее общность, тем больше всё держится на <b>правовой культуре</b>: полномочия и ответственность делятся, решает закон.'); } }
    ]
  });

  /* ---------- Верона: правовая определённость ---------- */
  reg('mars-verona3d', {
    title: 'Верона: как закон гасит вражду', lead: 'Дома Монтекки и Капулетти враждуют, на площади искры стычек. Нажми «Указ князя» — так выглядит правовая определённость.',
    radius: 22, phi: 1.0, targetY: 1.2,
    build: function (c) {
      var T = c.THREE; c.state = { decree: false, since: 0 };
      c.mesh(new T.BoxGeometry(16, 0.3, 10), '#cdb898', 'Площадь Вероны.').position.y = -0.15;
      function house(x, col, name) { var h = c.box3(3, 3.2, 3, col, [x, 1.6, -2.5], '<b>Дом ' + name + '.</b> Семейная вражда — главный враг гражданского мира.'); var r = c.mesh(new T.ConeGeometry(2.4, 1.4, 4), '#8a3b2a', h.userData.info); r.rotation.y = Math.PI / 4; r.position.set(x, 3.9, -2.5); c.label(name, [x, 5.3, -2.5], 0.6); return h; }
      house(-5, '#d7a26b', 'Монтекки'); house(5, '#b8c2d9', 'Капулетти');
      var A = [], B = [];
      for (var i = 0; i < 4; i++) { A.push(figure(c, -3 + i * 0.6, 1 + (i % 2) * 0.7, '#a35a2a', 'Сторонники Монтекки.', 0.8)); B.push(figure(c, 3 - i * 0.6, 1 + (i % 2) * 0.7, '#4f6fa8', 'Сторонники Капулетти.', 0.8)); }
      var sparks = []; for (var j = 0; j < 14; j++) { var s = c.mesh(new T.SphereGeometry(0.1, 8, 6), '#ffb030', '<b>Стычки:</b> пока нет правовой определённости, спор решают кулаками.', { emissive: new T.Color('#ff7a00'), emissiveIntensity: 0.8 }); s.userData.o = Math.random() * 6; sparks.push(s); }
      var prince = figure(c, 0, 4, '#7d4fd1', '<b>Князь Вероны</b> издаёт указ: вражда окончена, нарушителя ждут казнь или изгнание.', 1.2);
      var scroll = c.mesh(new T.CylinderGeometry(0.25, 0.25, 1.6, 16), '#f3e3b0', prince[0].userData.info); scroll.rotation.z = Math.PI / 2; scroll.position.set(0, 2.2, 4.2);
      var line = c.mesh(new T.BoxGeometry(0.15, 0.08, 8), '#f0c36b', '<b>Черта закона:</b> все знают правило и последствия. Это и есть правовая определённость.', { emissive: new T.Color('#f0c36b'), emissiveIntensity: 0.5 }); line.position.set(0, 0.05, 0); line.visible = false;
      c.onFrame(function (t) {
        var d = c.state.decree;
        sparks.forEach(function (s) { s.visible = !d; var a = t * 4 + s.userData.o; s.position.set(Math.sin(a) * 0.8, 1.2 + Math.abs(Math.sin(a * 1.7)) * 1.2, 1.3 + Math.cos(a * 1.3) * 0.6); });
        A.forEach(function (f, i) { var x = d ? -3.6 + i * 0.5 : -1.6 + i * 0.4 + Math.sin(t * 5 + i) * 0.15; f[0].position.x += (x - f[0].position.x) * 0.06; f[1].position.x = f[0].position.x; });
        B.forEach(function (f, i) { var x = d ? 3.6 - i * 0.5 : 1.6 - i * 0.4 + Math.sin(t * 5 + i) * 0.15; f[0].position.x += (x - f[0].position.x) * 0.06; f[1].position.x = f[0].position.x; });
        line.visible = d; scroll.rotation.x = d ? Math.sin(t * 2) * 0.2 : 0;
      });
    },
    chips: [
      { t: 'Вражда', small: 'нет закона', on: function (c) { c.state.decree = false; c.say('Без правил каждый сам решает, кто прав. Итог — стычки, кровь, гражданский раздор.'); } },
      { t: 'Указ князя', small: 'правовая определённость', on: function (c) { c.state.decree = true; c.say('Князь объявил правило и наказание. Все знают, что будет за нарушение, и стороны расходятся. Это <b>гражданский мир</b> — цель государства по Марсилию.'); } }
    ]
  });
})();
