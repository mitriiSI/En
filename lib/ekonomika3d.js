/* 3D-модели для конспекта «Экономика. Тема I». Используют движок HubScene3d (lib/scene3d.js).
   В Markdown: @@graph:eco-oikos@@ и т. д. */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) { HubWidgets.register(name, function (box) { HubScene3d(box, opts); }); }

  /* ---------- 1. Ойкос: дом + закон ---------- */
  reg('eco-oikos', {
    title: 'Ойкос + номос = экономика', lead: 'Греческий дом-хозяйство. Нажимай на детали: так рождается слово «экономика».',
    radius: 19, phi: 1.05, targetY: 2,
    hint: 'Нажми на дом, свиток или амфору.',
    build: function (c) {
      var T = c.THREE;
      c.box3(9, 0.5, 9, '#d9cdb5', [0, 0.25, 1.5], '<b>Ойкос</b> (οἶκος) — дом, хозяйство, семья со всем имуществом.');
      for (var i = 0; i < 6; i++) {
        var col = c.mesh(new T.CylinderGeometry(0.28, 0.32, 3.4, 16), '#f1eadb', '<b>Ойкос</b> — дом как хозяйственная единица: семья, рабы, земля, запасы.');
        col.position.set(-3.75 + i * 1.5, 2.2, 2.4);
      }
      c.box3(9, 3.4, 0.3, '#e8dcc4', [0, 2.2, -2.6], '<b>Ойкос</b> — дом. Хозяйство велось внутри семьи.');
      var roof = c.mesh(new T.CylinderGeometry(3.4, 3.4, 9.6, 3, 1), '#b5583e', '<b>Ойкос</b> — дом, хозяйство.');
      roof.rotation.z = Math.PI / 2; roof.rotation.x = Math.PI / 2; roof.scale.set(1, 1, 0.42); roof.position.set(0, 4.85, -0.1);
      var pts = []; for (var k = 0; k <= 12; k++) { var y = k / 12 * 1.6; pts.push(new T.Vector2(0.15 + 0.5 * Math.sin(y * 1.9 + 0.2), y)); }
      var amph = c.mesh(new T.LatheGeometry(pts, 24), '#c46a3a', '<b>Запасы хозяйства</b>: зерно, масло, вино. Ксенофонт учил, как разумно ими распоряжаться.');
      amph.position.set(-2, 0.5, 4.2);
      var scroll = c.mesh(new T.CylinderGeometry(0.35, 0.35, 2.2, 20), '#f3e3b0', '<b>Номос</b> (νόμος) — закон, правило. «Ойкономия» = правила ведения хозяйства.');
      scroll.rotation.z = Math.PI / 2; scroll.position.set(2, 1.1, 4.2);
      c.label('οἶκος — дом', [-3, 6.9, 0], 0.8);
      c.label('νόμος — закон', [3, 6.9, 0], 0.8);
      c.label('Ксенофонт, «Ойкономикос»', [0, -0.6, 6.3], 0.6, '#f0c36b');
      c.onFrame(function (t) { scroll.rotation.x = Math.sin(t) * 0.3; });
    },
    chips: [
      { t: 'Ойкос', small: 'дом', on: function (c) { c.setView(0.2, 1.15, 13, 2.5); c.say('<b>Ойкос</b> — не просто здание, а всё хозяйство семьи: люди, земля, запасы.'); } },
      { t: 'Номос', small: 'закон', on: function (c) { c.setView(0.35, 0.72, 14, 1); c.say('<b>Номос</b> — правило. Вместе: <b>экономика = правила ведения хозяйства</b>.'); } },
      { t: 'Ксенофонт', small: 'IV в. до н. э.', on: function (c) { c.setView(-0.6, 1.2, 16, 1.6); c.say('Слово ввёл <b>Ксенофонт</b> в трактате «Ойкономикос» («Домострой»): как хозяину управлять домом и имением.'); } }
    ]
  });

  /* ---------- 2. Аристотель: экономика и хрематистика ---------- */
  reg('eco-aristotle', {
    title: 'Аристотель: замкнутый круг и бесконечная спираль', lead: 'Слева хозяйство «для жизни»: товар → деньги → товар, и круг замыкается. Справа хрематистика: деньги → товар → больше денег, и спираль не кончается.',
    radius: 18, phi: 1.12, targetY: 2.4,
    build: function (c) {
      var T = c.THREE;
      c.box3(16, 0.3, 7, '--panel2', [0, -0.15, 0], 'Две логики хозяйства по Аристотелю.');
      var ring = c.mesh(new T.TorusGeometry(2.2, 0.08, 8, 64), '#7aa2ff', '<b>Экономика (самообеспечение)</b>: обмен нужен, чтобы получить нужную вещь. Цель достигнута — обмен останавливается.');
      ring.rotation.x = Math.PI / 2; ring.position.set(-4.3, 1, 0);
      [['Товар', 0], ['Деньги', 2.09], ['Товар', 4.19]].forEach(function (n) {
        var g = n[0] === 'Деньги' ? new T.CylinderGeometry(0.45, 0.45, 0.18, 24) : new T.BoxGeometry(0.7, 0.7, 0.7);
        var m = c.mesh(g, n[0] === 'Деньги' ? '#f0c36b' : '#4cc38a', n[0] === 'Деньги' ? 'Деньги здесь — только посредник обмена.' : 'Товар — то, что нужно семье для жизни.');
        m.position.set(-4.3 + Math.cos(n[1]) * 2.2, 1.2, Math.sin(n[1]) * 2.2);
      });
      var tok = c.mesh(new T.SphereGeometry(0.28, 16, 12), '#ffffff');
      c.label('Т → Д → Т', [-4.3, 4.2, 0], 0.8, '#7aa2ff');
      c.label('естественно', [-4.3, 3.3, 0], 0.55);
      var coins = [];
      for (var i = 0; i < 40; i++) {
        var a = i * 0.55, r = 1.2 + i * 0.03;
        var m = c.mesh(new T.CylinderGeometry(0.35, 0.35, 0.12, 20), '#f0c36b', '<b>Хрематистика</b>: деньги ради денег. «Д → Т → Д′», где Д′ больше Д. Предела нет — Аристотель считал это неестественным.', { metalness: 0.6, roughness: 0.3 });
        m.position.set(4.3 + Math.cos(a) * r, 0.2 + i * 0.11, Math.sin(a) * r); m.visible = false; coins.push(m);
      }
      c.label('Д → Т → Д′', [4.3, 6.4, 0], 0.8, '#f0c36b');
      c.label('без предела', [4.3, 5.5, 0], 0.55);
      c.onFrame(function (t) {
        var a = (t * 1.3) % (Math.PI * 2); tok.position.set(-4.3 + Math.cos(a) * 2.2, 1.6, Math.sin(a) * 2.2);
        var n = Math.floor((t * 6) % 52); coins.forEach(function (m, k) { m.visible = k < n; });
      });
    },
    chips: [
      { t: 'Самообеспечение', small: 'круг', on: function (c) { c.setView(-0.4, 1.1, 14, 1.5); c.say('<b>Экономика в узком смысле:</b> продал зерно, купил ткань — потребность закрыта, цепочка кончилась.'); } },
      { t: 'Хрематистика', small: 'спираль', on: function (c) { c.setView(0.5, 1.05, 16, 3); c.say('<b>Хрематистика:</b> вложил деньги, получил больше денег, вложил снова. Остановиться незачем — цель не вещь, а сумма.'); } }
    ]
  });

  /* ---------- 3. Меркантилизм: золото, торговля, пошлины ---------- */
  reg('eco-mercant', {
    title: 'Меркантилизм: страна-копилка', lead: 'Корабли увозят товары (экспорт) и привозят золото, другие привозят чужие товары (импорт) и увозят золото. Переключай политику.',
    radius: 23, phi: 0.95, targetY: 0.5,
    hint: 'Выбери политику кнопками ниже.',
    build: function (c) {
      var T = c.THREE, S = c.state = { exp: 1, imp: 1, duty: false, gold: 6 };
      var sea = c.mesh(new T.CylinderGeometry(11, 11, 0.2, 64), '#2c5d8f', 'Море торговли.', { roughness: 0.3 }); sea.position.y = -0.2;
      var land = c.mesh(new T.CylinderGeometry(4, 4.6, 1, 48), '#5aa36a', '<b>Наша страна.</b> Меркантилисты: страна богатеет, если продаёт больше, чем покупает.'); land.position.y = 0.4;
      c.box3(1.6, 1.2, 1.2, '#7a4a22', [0, 1.5, 0], '<b>Казна.</b> Богатство = золото и серебро в казне.');
      var bars = [];
      for (var i = 0; i < 24; i++) {
        var b = c.mesh(new T.BoxGeometry(0.5, 0.22, 0.26), '#f0c36b', 'Золото в казне — главный показатель богатства для меркантилиста.', { metalness: 0.7, roughness: 0.25 });
        b.position.set(-0.55 + (i % 3) * 0.55, 2.2 + Math.floor(i / 3) * 0.24, 0); bars.push(b);
      }
      var wall = c.mesh(new T.TorusGeometry(4.4, 0.25, 8, 64), '#bf5b4a', '<b>Протекционизм:</b> пошлины и запреты защищают своих производителей от чужих товаров.'); wall.rotation.x = Math.PI / 2; wall.position.y = 1.1; wall.visible = false;
      function ship(col) {
        var g = new T.Group();
        var hull = new T.Mesh(new T.BoxGeometry(1.4, 0.5, 0.6), c.mat(col)); g.add(hull);
        var mast = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1.3, 6), c.mat('#5b3b20')); mast.position.y = 0.8; g.add(mast);
        var sail = new T.Mesh(new T.PlaneGeometry(0.8, 0.9), c.mat('#f5f0e6', { side: T.DoubleSide })); sail.position.set(0, 0.9, 0.05); g.add(sail);
        c.root.add(g); return g;
      }
      var out = [ship('#4cc38a'), ship('#4cc38a'), ship('#4cc38a')], inn = [ship('#7d6a9c'), ship('#7d6a9c'), ship('#7d6a9c')];
      out.forEach(function (s) { s.children[0].userData.info = '<b>Экспорт:</b> везём свои товары за границу, обратно — золото.'; });
      inn.forEach(function (s) { s.children[0].userData.info = '<b>Импорт:</b> чужие товары к нам, а наше золото — за границу.'; });
      c.label('экспорт → золото к нам', [-7, 3.5, 4], 0.6, '#4cc38a');
      c.label('импорт → золото уходит', [7, 3.5, -4], 0.6, '#c9b6f0');
      c.onFrame(function (t) {
        out.forEach(function (s, k) { var a = t * 0.35 * S.exp + k * 2.1, r = 4.8 + ((t * 0.5 * S.exp + k) % 5); s.visible = S.exp > 0; s.position.set(Math.cos(a) * r, 0.2, Math.sin(a) * r); s.rotation.y = -a; });
        inn.forEach(function (s, k) {
          var a = -t * 0.35 + k * 2.1, prog = ((t * 0.5 + k) % 5), r = 9.8 - prog;
          if (S.duty && r < 5.4) r = 5.4 + Math.abs(Math.sin(t * 3 + k)) * 0.4;
          s.visible = S.imp > 0; s.position.set(Math.cos(a) * r, 0.2, Math.sin(a) * r); s.rotation.y = a;
        });
        var target = Math.max(1, Math.min(24, 8 + (S.exp - (S.duty ? 0.2 : S.imp)) * 9));
        S.gold += (target - S.gold) * 0.01;
        bars.forEach(function (b, k) { b.visible = k < Math.round(S.gold); });
        wall.visible = S.duty;
      });
    },
    chips: [
      { t: 'Баланс 0', small: 'экспорт = импорт', on: function (c) { c.state.exp = 1; c.state.imp = 1; c.state.duty = false; c.say('Сколько продали, столько и купили: золота в казне не прибавляется.'); } },
      { t: 'Больше экспорта', small: 'активный баланс', on: function (c) { c.state.exp = 1.6; c.state.imp = 0.6; c.state.duty = false; c.say('<b>Активный торговый баланс:</b> продаём больше, чем покупаем, разница копится в казне золотом. Мечта меркантилиста.'); } },
      { t: 'Пошлины', small: 'протекционизм', on: function (c) { c.state.exp = 1.3; c.state.imp = 1; c.state.duty = true; c.say('<b>Протекционизм:</b> государство ставит пошлины и запреты — чужие корабли разворачиваются, свои производители защищены.'); } }
    ]
  });

  /* ---------- 4. Физиократы: кругооборот Кенэ ---------- */
  reg('eco-physio', {
    title: 'Кенэ: экономика как кругооборот', lead: 'Три класса общества и потоки между ними: золотые шарики — деньги, зелёные — продукт. Новое богатство рождается только на поле.',
    radius: 18, phi: 0.9, targetY: 0.8,
    build: function (c) {
      var T = c.THREE;
      var P = { farm: [0, 0, 4.5], lord: [-4.6, 0, -3], craft: [4.6, 0, -3] };
      var farm = c.mesh(new T.CylinderGeometry(2.4, 2.6, 0.5, 40), '#6bbf59', '<b>Производительный класс — фермеры.</b> Только земля даёт <b>чистый продукт</b>: урожай больше, чем затрачено семян и труда.'); farm.position.set(P.farm[0], 0.25, P.farm[2]);
      for (var i = 0; i < 30; i++) { var w = c.mesh(new T.ConeGeometry(0.08, 0.7, 5), '#e8c454', farm.userData.info); var a = Math.random() * 6.28, r = Math.random() * 2.1; w.position.set(P.farm[0] + Math.cos(a) * r, 0.85, P.farm[2] + Math.sin(a) * r); }
      var lord = c.mesh(new T.CylinderGeometry(2, 2.2, 0.5, 40), '#9a8bc4', '<b>Класс собственников — землевладельцы</b> (король, дворяне, церковь). Получают ренту от фермеров и тратят её.'); lord.position.set(P.lord[0], 0.25, P.lord[2]);
      var tower = c.mesh(new T.CylinderGeometry(0.6, 0.7, 2.4, 12), '#c9c2dc', lord.userData.info); tower.position.set(P.lord[0], 1.7, P.lord[2]);
      var cap = c.mesh(new T.ConeGeometry(0.85, 1, 12), '#6b5aa0', lord.userData.info); cap.position.set(P.lord[0], 3.4, P.lord[2]);
      var craft = c.mesh(new T.CylinderGeometry(2, 2.2, 0.5, 40), '#c98f5a', '<b>«Бесплодный» класс — ремесленники и торговцы.</b> По Кенэ, они лишь переделывают то, что дала земля, но нового богатства не создают.'); craft.position.set(P.craft[0], 0.25, P.craft[2]);
      c.box3(1.6, 1.3, 1.3, '#e0b88a', [P.craft[0], 1.15, P.craft[2]], craft.userData.info);
      c.label('Фермеры', [P.farm[0], 2.4, P.farm[2]], 0.7, '#6bbf59');
      c.label('Землевладельцы', [P.lord[0], 4.6, P.lord[2]], 0.7, '#c9b6f0');
      c.label('Ремесленники', [P.craft[0], 2.6, P.craft[2]], 0.7, '#e0b88a');
      var flows = [['farm', 'lord', '#f0c36b', 'рента'], ['lord', 'farm', '#f0c36b', 'покупка еды'], ['lord', 'craft', '#f0c36b', 'покупка изделий'], ['craft', 'farm', '#f0c36b', 'покупка сырья'], ['farm', 'craft', '#4cc38a', 'сырьё'], ['craft', 'lord', '#4cc38a', 'изделия']];
      var dots = [];
      flows.forEach(function (f, k) {
        var a = new T.Vector3().fromArray(P[f[0]]), b = new T.Vector3().fromArray(P[f[1]]);
        var mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 2 + (k % 2) * 0.8; mid.add(mid.clone().setY(0).multiplyScalar(-0.25));
        var curve = new T.QuadraticBezierCurve3(a.clone().setY(0.8), mid, b.clone().setY(0.8));
        var tube = c.mesh(new T.TubeGeometry(curve, 30, 0.03, 6), f[2], (f[2] === '#4cc38a' ? 'Поток <b>продукта</b>: ' : 'Поток <b>денег</b>: ') + f[3] + '.', { transparent: true, opacity: 0.5 });
        for (var j = 0; j < 4; j++) { var d = c.mesh(new T.SphereGeometry(0.17, 12, 8), f[2], tube.userData.info); d.userData.c = curve; d.userData.o = j / 4 + k * 0.07; dots.push(d); }
      });
      c.onFrame(function (t) { dots.forEach(function (d) { d.position.copy(d.userData.c.getPoint((t * 0.18 + d.userData.o) % 1)); }); });
    },
    chips: [
      { t: 'Чистый продукт', small: 'земля', on: function (c) { c.setView(0, 0.9, 11, 0.6); c.say('Сеял 1 мешок — собрал 3. Излишек и есть <b>прибавочный (чистый) продукт</b>. По Кенэ, его даёт только природа.'); } },
      { t: 'Кругооборот', small: '«Экономическая таблица»', on: function (c) { c.setView(0.4, 0.55, 18, 0.8); c.say('Деньги и товары идут по кругу между классами, как кровь по телу (Кенэ был врачом). «Экономическая таблица», 1758.'); } }
    ]
  });

  /* ---------- 5. Булавочная фабрика Смита ---------- */
  reg('eco-pins', {
    title: 'Булавочная фабрика Адама Смита', lead: 'Сверху один мастер делает булавку целиком. Снизу десять рабочих, у каждого одна операция. Следи за счётчиками.',
    radius: 19, phi: 1.0, targetY: 0.8,
    build: function (c) {
      var T = c.THREE;
      c.box3(14, 0.3, 2.2, '#8a8fa8', [0, 0.6, -3], 'Один мастер: тянет проволоку, режет, точит, делает головку — всё сам.');
      c.box3(14, 0.3, 2.2, '#8a8fa8', [0, 0.6, 2.5], '<b>Разделение труда:</b> операции поделены, каждый доводит свою до автоматизма.');
      function worker(x, z, col) {
        var b = c.mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(0.3, 0.8, 4, 10) : new T.CylinderGeometry(0.3, 0.3, 1.4, 10), col, 'Рабочий.');
        b.position.set(x, 1.6, z); var h = c.mesh(new T.SphereGeometry(0.26, 14, 10), '#e8c6a0'); h.position.set(x, 2.6, z); return b;
      }
      var solo = worker(-6, -4.3, '#bf5b4a'); solo.userData.info = '<b>Один мастер:</b> по Смиту, максимум около <b>20 булавок в день</b>, а то и одна.';
      var ops = ['тянет', 'выпрямляет', 'режет', 'точит', 'головка', 'насадка', 'белит', 'чистит', 'втыкает', 'упаковывает'];
      ops.forEach(function (o, k) { var w = worker(-6.3 + k * 1.4, 4, '#4f7be0'); w.userData.info = 'Операция «' + o + '». Одна простая операция — быстрее руки и меньше потерь времени на переходы.'; });
      var pins = [];
      for (var i = 0; i < 46; i++) { var p = c.mesh(new T.CylinderGeometry(0.04, 0.04, 0.9, 6), '#d8dbe6', 'Булавка.', { metalness: 0.8, roughness: 0.2 }); p.rotation.z = Math.PI / 2; pins.push(p); }
      var slowPin = c.mesh(new T.CylinderGeometry(0.04, 0.04, 0.9, 6), '#d8dbe6', 'Булавка мастера-одиночки.', { metalness: 0.8 }); slowPin.rotation.z = Math.PI / 2;
      var lblA = c.label('1 мастер: ~20 в день', [0, 3.4, -3], 0.5, '#ef6b5b');
      var lblB = c.label('10 рабочих: ~48 000 в день', [0, 3.9, 2.5], 0.5, '#7aa2ff');
      c.onFrame(function (t) {
        pins.forEach(function (p, k) { var x = ((t * 2.2 + k * 0.32) % 15) - 7.5; p.position.set(x, 0.85, 2.5); });
        slowPin.position.set(-6 + ((t * 0.25) % 1) * 12, 0.85, -3);
      });
    },
    chips: [
      { t: 'Один мастер', small: '~20 шт.', on: function (c) { c.setView(0.15, 1.05, 15, 1); c.say('Делая булавку целиком, рабочий постоянно переключается между операциями и инструментами.'); } },
      { t: 'Десять рабочих', small: '~48 000 шт.', on: function (c) { c.setView(-0.2, 1.0, 17, 1.2); c.say('Десять человек вместе делают около <b>48 000</b> булавок — по 4 800 на человека. Это в <b>240 раз</b> больше, чем 20.'); } },
      { t: 'Почему?', small: '3 причины', on: function (c) { c.setView(0.6, 0.8, 19, 0.8); c.say('По Смиту: 1) <b>навык</b> растёт от повторения; 2) <b>нет потерь времени</b> на переходы; 3) простую операцию легче <b>доверить машине</b>.'); } }
    ]
  });

  /* ---------- 6. Предельная полезность: бутерброды ---------- */
  reg('eco-marginal3d', {
    title: 'Предельная полезность в 3D', lead: 'Башенки — польза от 1-го, 2-го, 3-го… бутерброда. Прозрачная плита — цена. Выбирай цену: зелёные бутерброды выгодно покупать.',
    radius: 17, phi: 1.05, targetY: 2,
    build: function (c) {
      var T = c.THREE, MU = [10, 6, 3, 1, 0.3, -2]; c.state = { price: 4, cols: [] };
      c.box3(14, 0.2, 4, '--panel2', [0, -0.1, 0], 'Ось: номер бутерброда.');
      MU.forEach(function (u, k) {
        var x = -6 + k * 2.4, h = Math.abs(u) * 0.55 + 0.05;
        var m = c.mesh(new T.BoxGeometry(1.6, h, 1.6), '#8a8fa8', '<b>' + (k + 1) + '-й бутерброд</b>: дополнительная польза ' + u + '. ' + (k === 0 ? 'Когда голоден, первый — самый ценный.' : u > 0 ? 'Меньше, чем у предыдущего: голод уже слабее.' : u === 0.3 ? 'Почти ноль: уже сыт.' : 'Отрицательная: переел, стало хуже.'));
        m.position.set(x, u >= 0 ? h / 2 : -h / 2 - 0.2, 0); c.state.cols.push([m, u]);
        var bread = c.mesh(new T.BoxGeometry(1.5, 0.25, 1.3), '#d9a35b', m.userData.info); bread.position.set(x, (u >= 0 ? h : 0) + 0.2, 0);
        c.label(String(k + 1), [x, -0.6, 1.6], 0.6);
      });
      var plate = c.mesh(new T.BoxGeometry(15, 0.06, 4.6), '#ef6b5b', 'Плита = <b>цена</b> бутерброда в «единицах пользы».', { transparent: true, opacity: 0.35 });
      c.onFrame(function () {
        var y = c.state.price * 0.55; plate.position.y += (y - plate.position.y) * 0.1;
        c.state.cols.forEach(function (p) { p[0].material.color.set(p[1] > c.state.price ? '#4cc38a' : '#8a8fa8'); });
      });
    },
    chips: [
      { t: 'Цена 1', on: function (c) { c.state.price = 1; c.say('Цена 1: выгодны три бутерброда — у них польза больше цены. Четвёртый уже не стоит денег.'); } },
      { t: 'Цена 4', on: function (c) { c.state.price = 4; c.say('Цена 4: берём два. Покупаем, <b>пока предельная полезность выше цены</b>.'); } },
      { t: 'Цена 8', on: function (c) { c.state.price = 8; c.say('Цена 8: стоит купить только первый. Дорогой товар покупают меньше — отсюда закон спроса.'); } }
    ]
  });

  /* ---------- 7. Карта школ ---------- */
  reg('eco-schools', {
    title: 'Где искать богатство: путь экономической мысли', lead: 'Каждая школа отвечает на вопрос «откуда богатство?». Нажимай на шары: от Ксенофонта до маржинализма.',
    radius: 26, phi: 1.1, targetY: 4.5,
    build: function (c) {
      var T = c.THREE;
      var S = [
        ['Ксенофонт', 'IV в. до н. э.', '#9aa2c0', 'Ввёл слово «экономика»: управление домом и имением.'],
        ['Аристотель', 'IV в. до н. э.', '#9aa2c0', 'Экономика (для жизни) против хрематистики (деньги ради денег).'],
        ['Меркантилизм', 'XVI–XVII вв.', '#f0c36b', 'Богатство = <b>золото</b>, источник — торговля. Протекционизм.'],
        ['Физиократы', 'Кенэ, 1758', '#6bbf59', 'Богатство = <b>земля</b>. Только сельское хозяйство даёт чистый продукт.'],
        ['Смит', '1776', '#4f7be0', 'Богатство = <b>труд</b> и разделение труда. Невидимая рука рынка.'],
        ['Милль', '1848', '#4f7be0', 'Итог классической школы, главный учебник на десятилетия.'],
        ['Ист. школа', '1840-е', '#c98f5a', 'У каждой страны свой путь; общих законов нет.'],
        ['Маркс', '1867', '#ef6b5b', '«Капитал»: законы капитализма, эксплуатация наёмного труда.'],
        ['Маржинализм', '1870-е', '#b07cff', 'Вопрос «как?», предельные величины, математика.']
      ];
      var prev = null;
      S.forEach(function (s, k) {
        var a = k * 0.72, r = 5.5, y = k * 1.05;
        var p = new T.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
        var m = c.mesh(new T.SphereGeometry(0.62, 24, 16), s[2], '<b>' + s[0] + '</b> (' + s[1] + '). ' + s[3]); m.position.copy(p);
        c.label(s[0], [p.x, p.y + 1.1, p.z], 0.5);
        if (prev) { var tube = c.mesh(new T.TubeGeometry(new T.LineCurve3(prev, p), 4, 0.06, 6), '#9aa2c0'); }
        prev = p;
      });
      var end = prev;
      [['Кембридж', 'Маршалл', -1], ['Австрия', 'Менгер, Бём-Баверк, Визер', 0], ['Лозанна', 'Вальрас, Парето', 1]].forEach(function (b) {
        var p = new T.Vector3(end.x + b[2] * 2.6, end.y + 2.6, end.z + 1.2);
        c.mesh(new T.TubeGeometry(new T.LineCurve3(end, p), 4, 0.05, 6), '#b07cff');
        var m = c.mesh(new T.SphereGeometry(0.45, 20, 14), '#b07cff', '<b>' + b[0] + 'ская школа</b>: ' + b[1] + '.'); m.position.copy(p);
        c.label(b[0], [p.x, p.y + 0.95, p.z], 0.5);
      });
      c.label('золото → земля → труд → предельная польза', [0, -1.4, 0], 0.55, '#f0c36b');
    },
    chips: [
      { t: 'Золото', small: 'меркантилисты', on: function (c) { c.setView(-1.3, 1.1, 19, 2.2); c.say('Меркантилисты: богатство — это <b>деньги</b>, значит, надо больше продавать и копить золото.'); } },
      { t: 'Земля', small: 'физиократы', on: function (c) { c.setView(-1.9, 1.1, 19, 3.2); c.say('Физиократы: золото — лишь средство. Настоящее богатство даёт <b>земля</b>.'); } },
      { t: 'Труд', small: 'классики', on: function (c) { c.setView(-2.6, 1.1, 19, 4.5); c.say('Смит и Милль: богатство создаёт <b>труд</b>, а разделение труда умножает его.'); } },
      { t: 'Предел', small: 'маржинализм', on: function (c) { c.setView(-3.6, 1.0, 21, 8.5); c.say('Маржиналисты: ценность определяет <b>польза последней единицы</b>. Три школы: Кембридж, Австрия, Лозанна.'); } }
    ]
  });

  /* ---------- 8. Внешние эффекты: завод, река, пасека ---------- */
  reg('eco-extern3d', {
    title: 'Внешние эффекты: завод на реке и пасека у сада', lead: 'Завод сбрасывает отходы — платят рыбаки ниже по течению. Пчёлы опыляют чужой сад — пользу получает сосед. Ни то ни другое не входит в цену.',
    radius: 21, phi: 0.95, targetY: 0.5,
    build: function (c) {
      var T = c.THREE; c.state = { tax: false };
      c.box3(18, 0.4, 12, '#6aa85a', [0, -0.2, 0], 'Земля.');
      var river = c.mesh(new T.BoxGeometry(18, 0.12, 2.4), '#3b7fd0', 'Река. Вниз по течению — рыбаки.', { roughness: 0.2 }); river.position.set(0, 0.06, -1.5);
      var segs = [];
      for (var i = 0; i < 12; i++) { var s = c.mesh(new T.BoxGeometry(1.5, 0.14, 2.4), '#3b7fd0', '<b>Отрицательный внешний эффект:</b> грязная вода — ущерб тем, кто не участвовал в сделке.', { transparent: true, opacity: 0.9 }); s.position.set(-8.25 + i * 1.5, 0.08, -1.5); segs.push(s); }
      c.box3(3, 2.4, 2.2, '#8a8fa8', [-6.5, 1.2, -4.3], '<b>Завод.</b> Его издержки — сырьё и зарплата. Ущерб реке в цену не входит.');
      var chimney = c.mesh(new T.CylinderGeometry(0.3, 0.4, 2.6, 12), '#6b7085', 'Завод.'); chimney.position.set(-5.6, 3.6, -4.6);
      var smoke = []; for (var j = 0; j < 10; j++) { var p = c.mesh(new T.SphereGeometry(0.35, 10, 8), '#555a66', 'Дым и стоки — внешние издержки.', { transparent: true, opacity: 0.5 }); smoke.push(p); }
      var boat = c.box3(1.6, 0.4, 0.7, '#a36a3a', [6.5, 0.35, -1.5], '<b>Рыбаки</b> ниже по течению: улов падает, а завод им не платит.');
      c.label('рыбаки платят за чужое', [6.5, 2, -1.5], 0.55, '#ef6b5b');
      var hive = c.box3(1, 1, 1, '#e3b23c', [-4, 0.5, 4], '<b>Пасека.</b> Пасечник продаёт мёд, а пчёлы бесплатно опыляют соседский сад.');
      var trees = [];
      for (var k = 0; k < 6; k++) {
        var x = 1 + (k % 3) * 2.4, z = 2.8 + Math.floor(k / 3) * 2.2;
        var tr = c.mesh(new T.CylinderGeometry(0.15, 0.2, 1.2, 8), '#6b4a2b', '<b>Положительный внешний эффект:</b> сад даёт больше яблок благодаря чужим пчёлам.'); tr.position.set(x, 0.6, z);
        var cr = c.mesh(new T.SphereGeometry(0.85, 16, 12), '#4f9a4a', tr.userData.info); cr.position.set(x, 1.7, z); trees.push(cr);
      }
      c.label('сосед получает пользу даром', [3.4, 3.4, 3.8], 0.55, '#4cc38a');
      var bees = []; for (var b = 0; b < 14; b++) { var be = c.mesh(new T.SphereGeometry(0.1, 8, 6), '#ffd23a'); be.userData.o = Math.random() * 6; bees.push(be); }
      c.onFrame(function (t) {
        var dirt = c.state.tax ? 0.25 : 1;
        segs.forEach(function (s, i) { var k = Math.max(0, 1 - i / 11) * dirt; s.material.color.set('#3b7fd0').lerp(new T.Color('#5a4a2a'), k * 0.85); });
        smoke.forEach(function (p, i) { var ph = ((t * 0.4 + i / 10) % 1); p.visible = ph < dirt + 0.05; p.position.set(-5.6 + ph * 2, 5 + ph * 3, -4.6 - ph); p.scale.setScalar(0.6 + ph * 1.5); });
        bees.forEach(function (be, i) { var a = t * 1.5 + be.userData.o, tx = 1 + (i % 3) * 2.4, tz = 2.8 + (i % 2) * 2.2, k = (Math.sin(a * 0.5) + 1) / 2; be.position.set(-4 + (tx + 4) * k + Math.sin(a * 3) * 0.3, 1.4 + Math.sin(a * 5) * 0.3, 4 + (tz - 4) * k + Math.cos(a * 3) * 0.3); });
        trees.forEach(function (tr, i) { tr.scale.setScalar(1 + 0.05 * Math.sin(t * 2 + i)); });
      });
    },
    chips: [
      { t: 'Без налога', small: 'провал рынка', on: function (c) { c.state.tax = false; c.setView(-0.4, 0.9, 16, 0.5); c.say('Завод не платит за грязь — продукция дешёвая, её производят <b>слишком много</b>. Это <b>провал рынка</b>.'); } },
      { t: 'Налог Пигу', small: 'ущерб в цене', on: function (c) { c.state.tax = true; c.setView(-0.4, 0.9, 16, 0.5); c.say('<b>[ДОБАВЛЕНО]</b> Пигу предложил налог, равный ущербу. Грязное производство дорожает, его становится меньше, река чище.'); } },
      { t: 'Пасека', small: 'польза даром', on: function (c) { c.setView(2.2, 0.9, 12, 1); c.say('Пчёлы опыляют чужой сад. Сосед получает пользу бесплатно, поэтому пасек на рынке <b>меньше</b>, чем было бы выгодно обществу.'); } }
    ]
  });
})();
