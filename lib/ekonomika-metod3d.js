/* 3D-модели к конспекту «Экономика. Тема II. Институционализм, Кейнс, монетаризм; метод; блага».
   В Markdown: @@graph:o2-instit3d@@ @@graph:o2-veblen3d@@ @@graph:o2-transact3d@@ @@graph:o2-keynes3d@@ @@graph:o2-monet3d@@
   @@graph:o2-posnorm3d@@ @@graph:o2-logic3d@@ @@graph:o2-dialectic3d@@ @@graph:o2-functions3d@@ @@graph:o2-goods3d@@
   @@graph:o2-public3d@@ @@graph:o2-freerider3d@@
   Нужен lib/ekonomika-osnovy-kit.js (window.OsnovyKit). */
(function () {
  'use strict';
  var K = window.OsnovyKit;
  if (!K) return;
  var C = K.C, reg = K.reg, person = K.person, coin = K.coin, stack = K.stack, house = K.house, factory = K.factory;

  /* ======================= 1. Институты и институции ======================= */
  reg('o2-instit3d', {
    autorotate: false,
    title: 'Правила игры: институты и институции', lead: 'В центре — рынок, где люди торгуют. Слева — писаные правила (закон, суд, договор). Справа — неписаные (обычай, мораль, традиция). Без них сделки разваливаются.',
    radius: 15, phi: 1.0, theta: 0.1, targetY: 1.2, height: 430, hint: 'Нажми на правило или кнопку. Попробуй «Убрать правила».',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iM = '<b>Рынок</b> — люди меняются товарами. Сделки держатся на правилах: формальных и неформальных.';
      var stall = K.group(c, 0, 0, 0);
      stall.add(c.box3(2.2, 0.9, 1.0, C.WOOD, [0, 0.45, 0], iM));
      stall.add(c.box3(2.4, 0.08, 1.3, C.RED, [0, 2.0, 0], iM));
      [[-1.05, 0.55], [1.05, 0.55], [-1.05, -0.45], [1.05, -0.45]].forEach(function (q) { stall.add(c.link([q[0], 0.9, q[1]], [q[0], 2.0, q[1]], C.WOOD, 0.04, iM)); });
      var buyer = person(c, -0.6, 1.4, C.BLUE, iM), seller = person(c, 0.6, -1.2, C.GOLD, iM);
      var deal = coin(c, 0, 1.3, 0.6, iM, null, 0.22); deal.rotation.x = Math.PI / 2;
      var iF = '<b>Институты</b> (формальные правила): право, законы, суды, общественные организации. Записаны и защищаются государством.';
      var iI = '<b>Институции</b> (неформальные правила): мораль, обычаи, традиции. Нигде не записаны, но люди их соблюдают.';
      var left = [], right = [];
      left.push(K.book(c, -5, 0, -1.6, C.RED, '<b>Закон</b> — формальное правило. Например, Гражданский кодекс определяет, как заключать договор купли-продажи.'));
      var court = K.group(c, -5.2, 0, 1.4); left.push(court);
      court.add(c.box3(1.6, 0.25, 1.1, C.STONE, [0, 0.12, 0], '<b>Суд</b> защищает договор. Если сосед не заплатил — можно взыскать долг.'));
      for (var i = 0; i < 4; i++) court.add(c.link([-0.6 + i * 0.4, 0.25, 0.35], [-0.6 + i * 0.4, 1.3, 0.35], C.WHITE, 0.07, '<b>Суд</b> защищает договор. Если сосед не заплатил — можно взыскать долг.'));
      var roof = c.mesh(new T.ConeGeometry(1.1, 0.5, 4), C.STONE, '<b>Суд</b> защищает договор.'); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.6); roof.position.y = 1.55; court.add(roof);
      var docu = K.group(c, -3.2, 0, 0); left.push(docu);
      docu.add(c.box3(0.7, 0.04, 0.95, C.PAPER, [0, 0.9, 0], '<b>Договор</b> — формальный институт сделки.'));
      docu.add(c.link([0, 0, 0], [0, 0.88, 0], C.WOOD, 0.04, '<b>Договор</b> — формальный институт сделки.'));
      c.label('институты\n(формальные)', [-4.8, 3.0, 0], 0.22, '#e0645a');
      var hands = K.group(c, 3.4, 0, 0); right.push(hands);
      hands.add(person(c, -0.4, 0, C.PURPLE, iI, hands, 0.9)); hands.add(person(c, 0.4, 0, C.TEA, iI, hands, 0.9));
      var shake = K.glow(c, C.GOLD, 0.15, '<b>Рукопожатие</b> — обычай: «слово дано — сделка заключена». Это неформальное правило.'); shake.position.set(0, 0.75, 0.25); hands.add(shake);
      var tradition = K.group(c, 5.2, 0, -1.6); right.push(tradition);
      var cake = c.mesh(new T.CylinderGeometry(0.55, 0.6, 0.5, 24), C.CREAM, '<b>Традиция</b> — например, приносить угощение в гости. Это институция.'); cake.position.y = 0.3; tradition.add(cake);
      for (var j = 0; j < 5; j++) { var cd = c.mesh(new T.CylinderGeometry(0.03, 0.03, 0.3, 6), C.RED, '<b>Традиция</b> — институция.'); cd.position.set(Math.cos(j * 1.25) * 0.35, 0.7, Math.sin(j * 1.25) * 0.35); tradition.add(cd); }
      var heart = K.glow(c, C.RED, 0.3, '<b>Мораль</b> — «обманывать стыдно». Даже без суда многие честно возвращают долги.'); heart.position.set(5.2, 1.0, 1.5); right.push(heart);
      c.label('институции\n(неформальные)', [4.8, 3.0, 0], 0.22, '#a78bfa');
      c.S = { off: false };
      c.onFrame(function (t) {
        var off = c.S.off;
        deal.position.x = off ? 0 : Math.sin(t * 2) * 0.6; deal.position.y = off ? 0.15 : 1.3; deal.rotation.z = t * 3;
        buyer.rotation.z = off ? 0.6 : 0; seller.rotation.z = off ? -0.6 : 0;
        left.concat(right).forEach(function (o) { o.visible = !off; });
        heart.scale.setScalar(1 + 0.12 * Math.sin(t * 5));
      });
    },
    chips: [
      { t: 'Институты', on: function (c) { c.S.off = false; c.setView(-0.9, 1.0, 9, 1.2, -3.5, 0); c.say('<b>Институты</b> — формальные правила и организации: право, законы, общественные организации.'); } },
      { t: 'Институции', on: function (c) { c.S.off = false; c.setView(0.9, 1.0, 9, 1.2, 3.5, 0); c.say('<b>Институции</b> — неформальные правила: мораль, обычаи, традиции.'); } },
      { t: 'Убрать правила', on: function (c) { c.S.off = true; c.setView(0.1, 1.0, 13, 1.0, 0, 0); c.say('<b>[ДОБАВЛЕНО]</b> Без правил никто никому не доверяет: монета упала, люди отвернулись. Поэтому институционалисты говорят: экономика — это не только ресурсы и цены, но и <b>правила</b>.'); } },
      { t: 'Вернуть', on: function (c) { c.S.off = false; c.setView(0.1, 1.0, 15, 1.2, 0, 0); c.say('Правила вернулись — торговля снова идёт.'); } }
    ]
  });

  /* ======================= 2. Веблен ======================= */
  reg('o2-veblen3d', {
    autorotate: false,
    title: 'Веблен: статус напоказ и хозяин, которого нет', lead: 'Слева — «праздный класс»: человек покупает не вещь, а статус. Справа — абсентеистская собственность: хозяин далеко, заводом управляют наёмные менеджеры.',
    radius: 15, phi: 1.0, theta: 0, targetY: 1.2, height: 430, hint: 'Нажми на кнопку или на фигуру.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iS = '<b>Показное потребление</b> — покупка ради того, чтобы показать статус. По Веблену, цель человека — показать людям своё положение.';
      var rich = person(c, -3.5, 0.5, C.PURPLE, iS, null, 1.25);
      K.crown(c, -3.5, 1.65, 0.5, iS);
      var podium = c.mesh(new T.CylinderGeometry(1.3, 1.4, 0.3, 30), C.GOLD, iS, { metalness: 0.4 }); podium.position.set(-3.5, 0.15, 0.5); rich.position.y = 0.3;
      var watchers = [];
      for (var i = 0; i < 4; i++) { var a = Math.PI * 0.2 + i * 0.35; watchers.push(person(c, -3.5 + 3 * Math.cos(a), 0.5 + 3 * Math.sin(a), C.GREY, '<b>Окружающие</b> смотрят. Ради их взгляда и делается покупка.', null, 0.85)); }
      var price = c.label('цена ↑ → хотят ещё больше', [-3.5, 3.2, 0.5], 0.2, '#f0c36b');
      var iA = '<b>Абсентеистская собственность</b> — собственность отделена от производства. Собственник <b>не участвует</b> в управлении своим производством.';
      var f = factory(c, 3.8, -0.8, C.STONE, iA, null, 0.9); K.smoke(c, f, 3);
      person(c, 2.9, 1.1, C.BLUE, '<b>Наёмный менеджер</b> реально управляет заводом.', null, 0.95);
      person(c, 4.7, 1.1, C.BLUE, '<b>Наёмный менеджер</b> реально управляет заводом.', null, 0.95);
      var owner = K.group(c, 6.6, 0, 3.2);
      owner.add(person(c, 0, 0, C.GOLD, '<b>Собственник</b> живёт далеко (на яхте, в другой стране). Получает доход, а на заводе не бывает.', owner, 1));
      var yacht = c.mesh(new T.BoxGeometry(1.8, 0.35, 0.8), C.WHITE, '<b>Собственник</b> далеко.'); yacht.position.y = -0.1; owner.add(yacht);
      var coins = [];
      for (var k = 0; k < 4; k++) coins.push(coin(c, 0, 0, 0, '<b>Доход</b> от завода уходит к собственнику.', null, 0.2));
      var dash = [];
      for (var d = 0; d < 6; d++) dash.push(c.box3(0.25, 0.04, 0.08, C.GREY, [K.lerp(4.4, 6.4, d / 5), 0.05, K.lerp(0.4, 3.0, d / 5)], iA));
      c.label('хозяина нет', [6.6, 2.4, 3.2], 0.2, '#e39b5b');
      c.S = { a: 0 };
      c.onFrame(function (t) {
        rich.rotation.y = t * 0.6; podium.rotation.y = -t * 0.3;
        watchers.forEach(function (w, i) { w.lookAt && w.lookAt(-3.5, 0.5, 0.5); w.position.y = 0.04 * Math.sin(t * 3 + i); });
        price.position.y = 3.2 + 0.1 * Math.sin(t * 2);
        coins.forEach(function (m, i) { var q = (t * 0.35 + i / 4) % 1; m.position.set(K.lerp(3.8, 6.6, q), 2.4 + Math.sin(q * Math.PI) * 0.8, K.lerp(-0.8, 3.2, q)); m.rotation.x = t * 3; });
        owner.position.y = 0.1 * Math.sin(t * 1.5);
      });
    },
    chips: [
      { t: 'Показное потребление', on: function (c) { c.setView(-0.4, 1.0, 9, 1.4, -3.5, 0.5); c.say('<b>[ДОБАВЛЕНО] Эффект Веблена:</b> некоторые товары (люксовые часы, сумки) покупают <b>больше, когда они дорожают</b>. Высокая цена — сигнал статуса. Это исключение из закона спроса.'); } },
      { t: 'Абсентеизм', on: function (c) { c.setView(0.6, 1.0, 10, 1.2, 4.6, 1); c.say('Абсентеистская собственность: «absent» — отсутствующий. Хозяин только получает доход, а управляют наёмные менеджеры. Та же проблема — у акционерных обществ (тема «Фирма»).'); } },
      { t: 'Против homo economicus', on: function (c) { c.setView(0, 1.0, 15, 1.2, 0, 0); c.say('Институционалисты <b>отрицают homo economicus</b>: человек не холодный калькулятор. Им движут привычки, статус, мода, правила.'); } }
    ]
  });

  /* ======================= 3. Трансакционные издержки ======================= */
  reg('o2-transact3d', {
    autorotate: false,
    title: 'Трансакционные издержки: цена самой сделки', lead: 'Покупатель идёт к продавцу машины. На каждом шаге — поиск, переговоры, договор, проверка — из кошелька «утекают» монеты. Это не цена машины, а цена сделки.',
    radius: 15, phi: 0.95, theta: 0.1, targetY: 1.0, height: 430, hint: 'Нажми на этап пути или на кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var st = [
        ['поиск', C.BLUE, '<b>1. Поиск информации:</b> время на объявления, звонки, поездки на осмотр.'],
        ['переговоры', C.GOLD, '<b>2. Переговоры:</b> торг о цене и условиях.'],
        ['договор', C.PURPLE, '<b>3. Оформление договора:</b> нотариус, госпошлина, бумаги.'],
        ['контроль', C.GREEN, '<b>4. Контроль и защита:</b> проверить у механика, нет ли обмана; при обмане — суд.']
      ];
      c.S = { k: 0, st: st };
      var path = [];
      st.forEach(function (s, i) {
        var x = -5 + i * 3.3;
        var p = c.mesh(new T.CylinderGeometry(0.9, 1.0, 0.25, 28), s[1], s[2]); p.position.set(x, 0.13, 0); path.push([x, 0]);
        c.label(s[0], [x, 2.4, 0], 0.22);
        var g = K.group(c, x, 0.25, 0);
        if (i === 0) { var lens = c.mesh(new T.TorusGeometry(0.3, 0.07, 10, 24), C.SILVER, s[2]); lens.position.set(0, 0.9, 0); g.add(lens); g.add(c.link([0.2, 0.7, 0], [0.5, 0.3, 0], C.WOOD, 0.06, s[2])); }
        if (i === 1) { var b1 = c.mesh(new T.SphereGeometry(0.3, 12, 8), C.WHITE, s[2]); b1.position.set(-0.3, 1.0, 0); b1.scale.set(1.3, 0.8, 0.5); g.add(b1); var b2 = c.mesh(new T.SphereGeometry(0.3, 12, 8), C.WHITE, s[2]); b2.position.set(0.35, 1.3, 0); b2.scale.set(1.3, 0.8, 0.5); g.add(b2); }
        if (i === 2) { var pp = c.box3(0.7, 0.04, 0.9, C.PAPER, [0, 0.5, 0], s[2]); g.add(pp); pp.rotation.x = -0.6; var pen = c.box3(0.06, 0.06, 0.6, C.DARK, [0.25, 0.65, 0], s[2]); g.add(pen); pen.rotation.y = 0.6; }
        if (i === 3) { var sh = c.mesh(new T.CylinderGeometry(0.45, 0.3, 0.12, 6), C.GREEN, s[2]); sh.rotation.x = Math.PI / 2; sh.position.y = 0.8; g.add(sh); }
      });
      var car = K.group(c, 6.0, 0, -2.6);
      var iC = '<b>Машина</b> — сам товар. Её цена — 500 тысяч. Трансакционные издержки платятся <b>сверх</b> этой цены.';
      car.add(c.box3(2.0, 0.55, 1.0, C.RED, [0, 0.55, 0], iC)); car.add(c.box3(1.1, 0.45, 0.9, C.RED, [-0.1, 1.05, 0], iC));
      [[-0.65, 0.5], [-0.65, -0.5], [0.65, 0.5], [0.65, -0.5]].forEach(function (q) { var w = c.mesh(new T.CylinderGeometry(0.25, 0.25, 0.15, 14), C.DARK, iC); w.rotation.x = Math.PI / 2; w.position.set(q[0], 0.25, q[1]); car.add(w); });
      var buyer = person(c, -5, 0, C.BLUE, '<b>Покупатель</b> с кошельком.', null, 1.05);
      var wallet = [];
      for (var k = 0; k < 8; k++) wallet.push(coin(c, 0, 0, 0, '<b>Монеты</b> кошелька. Часть уходит на сделку, а не на машину.', null, 0.18));
      var lost = [];
      for (var m = 0; m < 4; m++) { var lc = coin(c, 0, 0, 0, '<b>Потерянные монеты</b> — трансакционные издержки.', null, 0.18, C.RED); lc.visible = false; lost.push(lc); }
      c.onFrame(function (t) {
        var x = -5 + ((t * 0.35) % 1) * 9.9 * Math.min(1, c.S.k === 0 ? 1 : 0) ;
        if (c.S.k > 0) x = -5 + (c.S.k - 1) * 3.3;
        buyer.position.x = K.lerp(buyer.position.x, x, 0.08); buyer.position.y = 0.25;
        var stage = Math.max(0, Math.min(4, Math.floor((buyer.position.x + 5.5) / 3.3) + 1));
        var keep = 8 - stage * 1.5;
        wallet.forEach(function (w, i) { w.visible = i < keep; w.position.set(buyer.position.x + 0.55, 0.3 + i * 0.1, 0.55); });
        lost.forEach(function (l, i) { l.visible = i < stage; var q = (t * 0.6 + i * 0.25) % 1; l.position.set(-5 + i * 3.3, 0.4 + q * 1.8, -0.9); l.rotation.x = t * 4; l.material.opacity = 1; });
      });
    },
    chips: [
      { t: 'Весь путь', on: function (c) { c.S.k = 0; c.setView(0.1, 0.95, 15, 1.0, 0, 0); c.say('Чем дальше покупатель идёт к сделке, тем больше монет теряет по дороге — это и есть <b>трансакционные издержки</b>, «издержки совершения сделок».'); } }
    ].concat([0, 1, 2, 3].map(function (i) { return { t: ['Поиск', 'Переговоры', 'Договор', 'Контроль'][i], on: function (c) { c.S.k = i + 1; c.setView(0.2, 0.95, 8, 1.0, -5 + i * 3.3, 0); c.say(c.S.st[i][2]); } }; }))
  });

  /* ======================= 4. Кейнс ======================= */
  reg('o2-keynes3d', {
    autorotate: false,
    title: 'Кейнс: государство подкачивает спрос', lead: 'Насос — это экономика. Высота столба — эффективный спрос, его уровень определяет, сколько заводов работает. Включай инструменты государства и смотри, как спрос растёт.',
    radius: 15, phi: 1.0, theta: 0.2, targetY: 1.6, height: 450, hint: 'Сначала нажми «Кризис», потом включай инструменты.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var iD = '<b>Эффективный спрос</b> — главная категория Кейнса: сколько товаров реально купят при данных доходах.';
      var glass = c.mesh(new T.CylinderGeometry(1.1, 1.1, 4.4, 32, 1, true), '#9fd3ff', iD, { transparent: true, opacity: 0.18, side: T.DoubleSide }); glass.position.y = 2.2;
      var liquid = c.mesh(new T.CylinderGeometry(1.0, 1.0, 1, 32), C.BLUE, iD, { emissive: C.BLUE, emissiveIntensity: 0.25 });
      c.label('спрос', [0, 5.0, 0], 0.26);
      var fs = [], smokes = [];
      for (var i = 0; i < 4; i++) { var a = Math.PI + i * 0.55 - 0.8; var f = factory(c, 5.3 * Math.cos(a) + 1.5, 5.3 * Math.sin(a) * 0.7 + 0.5, C.STONE, '<b>Завод.</b> Работает, только когда хватает спроса. Иначе — закрыт, рабочие уволены.', null, 0.55); fs.push(f); smokes.push(K.smoke(c, f, 2)); }
      var tools = [
        ['ставка ↓', C.GOLD, '<b>Процентная ставка.</b> Снизили ставку → кредит дешевле → фирмы берут кредиты и вкладывают в производство (<b>инвестиции</b>).', [-3.6, -2.6]],
        ['налоги ↓', C.GREEN, '<b>Налоги.</b> Снизили налоги → у людей и фирм остаётся больше денег → они больше покупают.', [-4.2, 0.6]],
        ['госзакупки ↑', C.RED, '<b>Государственные закупки.</b> Государство само заказывает дороги, школы, технику → заводы получают заказы.', [-2.6, 3.4]]
      ];
      c.S = { on: [0, 0, 0], crisis: false, tools: tools };
      var pipes = [];
      tools.forEach(function (tl, i) {
        var bld = K.group(c, tl[3][0], 0, tl[3][1]);
        bld.add(c.box3(1.2, 1.2, 1.0, C.WHITE, [0, 0.6, 0], tl[2]));
        var dome = c.mesh(new T.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), tl[1], tl[2]); dome.position.y = 1.2; bld.add(dome);
        c.label(tl[0], [tl[3][0], 2.3, tl[3][1]], 0.2);
        var drops = [];
        for (var k = 0; k < 4; k++) { var d = K.glow(c, tl[1], 0.13, tl[2]); drops.push(d); }
        pipes.push(drops);
      });
      c.onFrame(function (t) {
        var lvl = c.S.crisis ? 0.8 : 2.0;
        lvl += (c.S.on[0] + c.S.on[1] + c.S.on[2]) * 0.8;
        if (!c.S.crisis && !c.S.on[0] && !c.S.on[1] && !c.S.on[2]) lvl = 2.4;
        liquid.scale.y = K.lerp(liquid.scale.y, lvl, 0.05); liquid.position.y = liquid.scale.y / 2;
        var working = Math.round(liquid.scale.y / 4.4 * 4.4);
        fs.forEach(function (f, i) { f.userData.on = i < working; f.children.forEach(function (ch) { if (ch.material && ch.material.color) ch.material.opacity = 1; }); f.position.y = i < working ? 0 : -0.25; });
        pipes.forEach(function (drops, i) {
          var p = tools[i][3];
          drops.forEach(function (d, k) { var q = (t * 0.5 + k / 4) % 1; d.visible = !!c.S.on[i]; d.position.set(K.lerp(p[0], 0, q), 1.6 + Math.sin(q * Math.PI) * 2.2, K.lerp(p[1], 0, q)); });
        });
      });
    },
    chips: [
      { t: 'Кризис', on: function (c) { c.S.crisis = true; c.S.on = [0, 0, 0]; c.setView(0.2, 1.0, 15, 1.6, 0, 0); c.say('<b>Кризис:</b> люди боятся тратить → спрос падает → заводы закрываются → доходы падают ещё сильнее. Кейнс: рынок может сам <b>не выбраться</b> из этой спирали.'); } },
      { t: 'Ставка ↓', on: function (c) { c.S.crisis = true; c.S.on[0] = 1; c.say(c.S.tools[0][2]); } },
      { t: 'Налоги ↓', on: function (c) { c.S.crisis = true; c.S.on[1] = 1; c.say(c.S.tools[1][2]); } },
      { t: 'Госзакупки ↑', on: function (c) { c.S.crisis = true; c.S.on[2] = 1; c.say(c.S.tools[2][2] + ' Кейнс был <b>за дешёвый кредит и расширение государственных закупок</b>.'); } }
    ]
  });

  /* ======================= 5. Монетаризм ======================= */
  reg('o2-monet3d', {
    autorotate: false,
    title: 'Монетаризм: деньги и цены', lead: 'Кран — центральный банк, он выпускает деньги. Слева — полка с товарами (их количество растёт медленно). Справа — ценник. Если денег льётся больше, чем растут товары, ценник ползёт вверх — инфляция.',
    radius: 14, phi: 1.0, theta: 0.15, targetY: 1.8, height: 450, hint: 'Сравни три режима крана.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iB = '<b>Центральный банк</b> регулирует количество денег в экономике. Для монетаристов это главное.';
      var bank = K.group(c, 0, 0, -2.6);
      bank.add(c.box3(3.2, 0.3, 1.6, C.STONE, [0, 0.15, 0], iB));
      for (var i = 0; i < 5; i++) bank.add(c.link([-1.2 + i * 0.6, 0.3, 0.5], [-1.2 + i * 0.6, 2.4, 0.5], C.WHITE, 0.1, iB));
      var roof = c.mesh(new T.ConeGeometry(2.1, 0.8, 4), C.STONE, iB); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.55); roof.position.y = 2.8; bank.add(roof);
      c.label('ЦБ', [0, 3.7, -2.6], 0.3);
      var pipe = c.link([0, 3.0, -1.6], [0, 3.0, 0], C.SILVER, 0.18, iB);
      var tap = c.link([0, 3.0, 0], [0, 2.4, 0], C.SILVER, 0.18, iB);
      var iM = '<b>Деньги в обращении.</b> Чем быстрее их выпускают, тем выше цены (если товаров больше не стало).';
      var drops = [];
      for (var k = 0; k < 10; k++) { var m = coin(c, 0, 0, 0, iM, null, 0.2); drops.push(m); }
      var pile = c.mesh(new T.ConeGeometry(1.2, 1, 24), C.GOLD, iM, { metalness: 0.3 }); pile.position.y = 0.5;
      var iG = '<b>Товары.</b> Экономика растёт медленно — примерно на 3 % в год.';
      var shelf = K.group(c, -4, 0, 0.6), boxes = [];
      shelf.add(c.box3(0.1, 2.6, 1.0, C.WOOD, [-1.1, 1.3, 0], iG)); shelf.add(c.box3(0.1, 2.6, 1.0, C.WOOD, [1.1, 1.3, 0], iG));
      for (var r = 0; r < 3; r++) shelf.add(c.box3(2.3, 0.08, 1.0, C.WOOD, [0, 0.3 + r * 0.9, 0], iG));
      for (var b = 0; b < 9; b++) { var bx = c.box3(0.5, 0.5, 0.5, [C.RED, C.BLUE, C.GREEN][b % 3], [-0.65 + (b % 3) * 0.65, 0.6 + Math.floor(b / 3) * 0.9, 0], iG); shelf.add(bx); boxes.push(bx); }
      c.label('товары', [-4, 3.2, 0.6], 0.22);
      var iP = '<b>Уровень цен.</b> По Фридману, инфляция — всегда результат слишком быстрого роста денежной массы.';
      var tagStick = c.link([4, 0, 0.6], [4, 1.2, 0.6], C.GREY, 0.05, iP);
      var tag = c.box3(1.4, 0.8, 0.08, C.WHITE, [4, 1.6, 0.6], iP);
      var price = c.label('цены', [4, 1.6, 1.0], 0.22, '#e0645a');
      c.S = { flow: 1, label: price, stag: false };
      c.onFrame(function (t) {
        var fl = c.S.flow;
        drops.forEach(function (d, i) { var q = (t * (0.4 + fl * 0.4) + i / drops.length) % 1; d.visible = i < 2 + fl * 3; d.position.set(0.15 * Math.sin(i * 7), 2.3 - q * 2.0, 0.15 * Math.cos(i * 5)); d.rotation.x = t * 3; });
        var target = 0.6 + fl * 0.5; pile.scale.setScalar(K.lerp(pile.scale.x, target, 0.04)); pile.position.y = pile.scale.y / 2;
        var ty = 1.6 + (fl - 1) * 0.9 + (c.S.stag ? 0.4 : 0);
        tag.position.y = K.lerp(tag.position.y, ty, 0.05); price.position.y = tag.position.y; tagStick.scale.y = (tag.position.y - 0.4) / 1.2; tagStick.position.y = (tag.position.y - 0.4) / 2;
        boxes.forEach(function (bx, i) { bx.visible = i < (c.S.stag ? 5 : 9); });
      });
    },
    chips: [
      { t: 'Правило Фридмана', on: function (c) { c.S.flow = 1; c.S.stag = false; c.say('<b>[ДОБАВЛЕНО] Монетарное правило:</b> денежная масса растёт медленно и ровно — примерно как растёт экономика (3–5 % в год). Тогда цены стабильны.'); } },
      { t: 'Печатаем много', on: function (c) { c.S.flow = 2.6; c.S.stag = false; c.say('Денег стало намного больше, а товаров — столько же. Каждый рубль «покупает» меньше: <b>цены растут, инфляция</b>.'); } },
      { t: 'Стагфляция', on: function (c) { c.S.flow = 2.2; c.S.stag = true; c.say('<b>Стагфляция</b> = падение производства (товаров на полке меньше) + инфляция (ценник растёт). Главная проблема для монетаристов. Кейнсианское «добавим денег» тут только разгоняет цены.'); } }
    ]
  });

  /* ======================= 6. Позитивная и нормативная ======================= */
  reg('o2-posnorm3d', {
    autorotate: false,
    title: 'Позитивная и нормативная экономика', lead: 'Утверждения падают сверху. Слева — корзина «что есть» (факты, можно проверить). Справа — «что должно быть» (оценки и рецепты). Нажми на кнопку-утверждение — оно полетит в нужную корзину.',
    radius: 14, phi: 1.0, theta: 0, targetY: 1.6, height: 440, hint: 'Выбери утверждение кнопкой.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var iP = '<b>Позитивная (дескриптивная) экономика</b> — что <b>есть</b>. Без оценок, только констатация факта. Можно проверить цифрами.';
      var iN = '<b>Нормативная экономика</b> — что <b>должно быть</b>. Есть оценочные суждения, рецепты действий.';
      var b1 = c.mesh(new T.CylinderGeometry(1.6, 1.2, 1.4, 32, 1, true), C.BLUE, iP, { side: T.DoubleSide }); b1.position.set(-3.2, 0.7, 0);
      var b2 = c.mesh(new T.CylinderGeometry(1.6, 1.2, 1.4, 32, 1, true), C.ORANGE, iN, { side: T.DoubleSide }); b2.position.set(3.2, 0.7, 0);
      c.label('что ЕСТЬ\n(позитивная)', [-3.2, 2.2, 0], 0.22, '#5b8def'); c.label('что ДОЛЖНО БЫТЬ\n(нормативная)', [3.2, 2.2, 0], 0.22, '#e39b5b');
      var ruler = K.group(c, -3.2, 2.9, 0.0); ruler.add(c.box3(1.6, 0.12, 0.3, C.GOLD, [0, 0, 0], iP + ' Символ — линейка: измеряем.'));
      for (var i = 0; i < 7; i++) ruler.add(c.box3(0.03, 0.12, 0.31, C.DARK, [-0.7 + i * 0.23, 0.03, 0], iP));
      var scales = K.group(c, 3.2, 2.9, 0);
      scales.add(c.link([0, -0.3, 0], [0, 0.3, 0], C.SILVER, 0.04, iN)); var beam = c.box3(1.4, 0.06, 0.06, C.SILVER, [0, 0.3, 0], iN + ' Символ — весы: оцениваем.'); scales.add(beam);
      var ball = K.glow(c, C.WHITE, 0.28, 'Утверждение');
      ball.position.set(0, 5, 0);
      c.S = { goal: null, t0: 0, ball: ball, txt: null };
      c.onFrame(function (t) {
        scales.rotation.z = 0.15 * Math.sin(t * 1.5); ruler.rotation.y = t * 0.5;
        if (c.S.goal != null) {
          var g = c.S.goal; ball.position.x = K.lerp(ball.position.x, g, 0.06); ball.position.y = K.lerp(ball.position.y, 0.8, 0.04);
          ball.material.color.set(g < 0 ? C.BLUE : C.ORANGE); ball.material.emissive.set(g < 0 ? C.BLUE : C.ORANGE);
        }
      });
    },
    chips: [
      ['«Безработица — 3 %»', -3.2, 'Это <b>позитивное</b> утверждение: факт, его можно проверить по статистике.'],
      ['«Надо снизить налоги»', 3.2, 'Это <b>нормативное</b>: слово «надо» — рецепт действия и оценка.'],
      ['«Цены выросли на 8 %»', -3.2, '<b>Позитивное</b>: измеряется статистикой.'],
      ['«Богатые платят слишком мало»', 3.2, '<b>Нормативное</b>: «слишком мало» — оценочное суждение, с ним можно спорить, но нельзя доказать измерением.'],
      ['«Ставка 16 % → кредитов меньше»', -3.2, '<b>Позитивное</b>: причинно-следственное утверждение, его можно проверить на данных.']
    ].map(function (q) { return { t: q[0], on: function (c) { c.S.ball.position.set(0, 5, 0); c.S.goal = q[1]; c.say(q[2]); } }; })
  });

  /* ======================= 7. Методы логики ======================= */
  reg('o2-logic3d', {
    autorotate: false,
    title: 'Анализ и синтез, индукция и дедукция', lead: 'Целое — башня из кубиков (например, цена хлеба). Анализ разбирает её на части, синтез собирает обратно. Индукция идёт от многих случаев к общему правилу, дедукция — от правила к конкретному случаю.',
    radius: 13, phi: 1.0, theta: 0.2, targetY: 1.4, height: 430, hint: 'Нажимай кнопки-методы.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      var parts = [
        [C.GOLD, '<b>Мука</b> — часть цены хлеба.'], [C.BLUE, '<b>Зарплата пекаря</b> — часть цены.'],
        [C.PURPLE, '<b>Аренда пекарни</b> — часть цены.'], [C.RED, '<b>Электричество</b> — часть цены.'], [C.GREEN, '<b>Прибыль</b> — часть цены.']
      ];
      var cubes = parts.map(function (p, i) { return c.box3(1.0, 0.6, 1.0, p[0], [0, 0.3 + i * 0.62, 0], p[1]); });
      c.label('цена хлеба', [0, 3.8, 0], 0.22);
      var small = [], big = K.glow(c, C.GOLD, 0.45, '<b>Общее правило</b> (закон).');
      big.position.set(0, 3.2, -3); big.visible = false;
      for (var i = 0; i < 6; i++) { var s = K.glow(c, C.SILVER, 0.18, '<b>Отдельный случай</b> (факт).'); s.position.set(-2.5 + i, 0.4, -3); s.visible = false; small.push(s); }
      var rule = c.label('', [0, 4.2, -3], 0.2); rule.visible = false;
      c.S = { mode: 'whole' };
      c.onFrame(function (t) {
        var m = c.S.mode;
        cubes.forEach(function (cb, i) {
          var a = i * 2 * Math.PI / 5, tgt;
          if (m === 'an') tgt = [3 * Math.cos(a), 0.4, 3 * Math.sin(a)];
          else tgt = [0, 0.3 + i * 0.62, 0];
          cb.visible = m === 'whole' || m === 'an' || m === 'syn';
          cb.position.x = K.lerp(cb.position.x, tgt[0], 0.06); cb.position.y = K.lerp(cb.position.y, tgt[1], 0.06); cb.position.z = K.lerp(cb.position.z, tgt[2], 0.06);
          cb.rotation.y = m === 'an' ? t * 0.8 : K.lerp(cb.rotation.y, 0, 0.1);
        });
        var ind = m === 'ind', ded = m === 'ded';
        big.visible = ind || ded; small.forEach(function (s) { s.visible = ind || ded; });
        small.forEach(function (s, i) {
          var q = (t * 0.4 + i / 6) % 1;
          if (ind) { s.position.set(K.lerp(-2.5 + i, 0, q), 0.4 + q * 2.8, -3); }
          if (ded) { s.position.set(K.lerp(0, -2.5 + i, q), 3.2 - q * 2.8, -3); }
        });
        big.scale.setScalar(1 + 0.1 * Math.sin(t * 3));
      });
    },
    chips: [
      { t: 'Анализ', on: function (c) { c.S.mode = 'an'; c.setView(0.2, 0.9, 12, 1.0, 0, 0); c.say('<b>Анализ</b> — расчленение, разложение целого на части. Цену хлеба разобрали на муку, зарплату, аренду, энергию, прибыль.'); } },
      { t: 'Синтез', on: function (c) { c.S.mode = 'syn'; c.setView(0.2, 1.0, 12, 1.4, 0, 0); c.say('<b>Синтез</b> — объединение частей в целое. Например, из данных по всем отраслям собирают ВВП страны.'); } },
      { t: 'Индукция', on: function (c) { c.S.mode = 'ind'; c.setView(0.0, 1.05, 11, 1.8, 0, -3); c.say('<b>Индукция</b> — от частного к общему: «в сотне магазинов скидка увеличила продажи» → общее правило «скидки увеличивают продажи».'); } },
      { t: 'Дедукция', on: function (c) { c.S.mode = 'ded'; c.setView(0.0, 1.05, 11, 1.8, 0, -3); c.say('<b>Дедукция</b> — от общего к частному: закон спроса (цена ↑ → спрос ↓) → «если подорожает кофе, его купят меньше».'); } }
    ]
  });

  /* ======================= 8. Диалектика ======================= */
  reg('o2-dialectic3d', {
    autorotate: false,
    title: 'Три закона диалектики', lead: 'Слева — количество переходит в качество: монеты копятся, и в какой-то момент — скачок. В центре — единство и борьба противоположностей. Справа — отрицание отрицания: развитие по спирали.',
    radius: 15, phi: 1.0, theta: 0, targetY: 1.6, height: 440, hint: 'Нажми на закон кнопкой или на модель.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var i1 = '<b>Переход количества в качество.</b> Пример из лекции: <b>количество денег меняет человека</b>. Накапливается количество — и в какой-то момент происходит скачок, появляется новое качество.';
      var coins = [];
      for (var i = 0; i < 12; i++) coins.push(coin(c, -4.5, 0.06 + i * 0.11, 0, i1, null, 0.45));
      var house2 = house(c, -4.5, 0, C.GOLD, i1 + ' Горстка монет превратилась в дом — уже совсем другое качество жизни.', null, 1.3); house2.visible = false;
      c.label('количество →\nкачество', [-4.5, 3.3, 0], 0.2);
      var i2 = '<b>Единство и борьба противоположностей.</b> Продавец тянет цену вверх, покупатель — вниз. Из этого противоречия рождается рыночная цена.';
      var rope = c.link([-1.5, 1.0, 0], [1.5, 1.0, 0], C.WOOD, 0.05, i2);
      var p1 = person(c, -1.7, 0, C.GOLD, '<b>Продавец</b> хочет цену повыше.' + ' ' + i2), p2 = person(c, 1.7, 0, C.BLUE, '<b>Покупатель</b> хочет цену пониже.' + ' ' + i2);
      var knot = K.glow(c, C.RED, 0.2, i2 + ' Узел — цена.');
      c.label('борьба\nпротивоположностей', [0, 3.3, 0], 0.2);
      var i3 = '<b>Отрицание отрицания.</b> Новое отрицает старое, а потом само отрицается следующим этапом. Развитие идёт по спирали: как будто возвращается к старому, но на новом уровне.';
      var pts = []; for (var k = 0; k <= 60; k++) { var a = k / 60 * Math.PI * 5; pts.push([4.5 + Math.cos(a) * 0.9, 0.2 + k / 60 * 2.6, Math.sin(a) * 0.9]); }
      K.tube(c, pts, C.PURPLE, i3, null, 0.06);
      var runner = K.glow(c, C.GOLD, 0.18, i3);
      var st = [['бартер', 0.35], ['деньги', 1.4], ['цифровой\nобмен', 2.6]];
      st.forEach(function (s) { c.label(s[0], [6.0, s[1] + 0.2, 0], 0.15, '#a78bfa'); });
      c.label('спираль', [4.5, 3.6, 0], 0.2);
      c.S = { q: 0 };
      c.onFrame(function (t) {
        var n = Math.floor((t * 2) % 16);
        coins.forEach(function (m, j) { m.visible = j < n && n < 13; });
        house2.visible = n >= 13; house2.rotation.y = t;
        var sh = 0.25 * Math.sin(t * 2);
        p1.position.x = -1.7 + sh; p2.position.x = 1.7 + sh; rope.position.x = sh; knot.position.set(sh, 1.0, 0);
        var q = (t * 0.12) % 1, a = q * Math.PI * 5; runner.position.set(4.5 + Math.cos(a) * 0.9, 0.2 + q * 2.6, Math.sin(a) * 0.9);
      });
    },
    chips: [
      { t: 'Количество → качество', on: function (c) { c.setView(0, 1.0, 8, 1.4, -4.5, 0); c.say('Вода нагревается до 99° — всё ещё вода; на 100° — скачок, пар. Так и монеты: копятся, копятся — и вдруг новое качество (дом, другой образ жизни).'); } },
      { t: 'Противоположности', on: function (c) { c.setView(0, 1.0, 8, 1.4, 0, 0); c.say('<b>[ДОБАВЛЕНО]</b> Интересы продавца и покупателя противоположны, но друг без друга они не существуют (единство). Их «борьба» двигает рынок.'); } },
      { t: 'Отрицание отрицания', on: function (c) { c.setView(0, 1.0, 8, 1.6, 4.5, 0); c.say('<b>[ДОБАВЛЕНО]</b> Бартер → деньги (отрицание бартера) → прямые цифровые расчёты (отрицание наличных; снова похоже на прямой обмен, но на новом уровне).'); } }
    ]
  });

  /* ======================= 9. Функции экономической теории ======================= */
  var fItems = [
    { t: 'методологическая', col: C.BLUE, info: '<b>Методологическая функция:</b> экономическая теория — фундамент для всех функциональных и отраслевых экономических наук (финансы, бухучёт, маркетинг…).', icon: function (c, g) { [0, 1, 2].forEach(function (k) { g.add(c.box3(1.2 - k * 0.3, 0.3, 1.2 - k * 0.3, k ? C.STONE : C.BLUE, [0, 0.15 + k * 0.3, 0], fItems[0].info)); }); } },
    { t: 'идеологическая', col: C.RED, info: '<b>Идеологическая функция:</b> обосновывает смысл глобальных экономических процессов, цели развития государства и общества.', icon: function (c, g) { K.flag(c, 0, 0, fItems[1].info, g, 1.6); } },
    { t: 'познавательная', col: C.GOLD, info: '<b>Познавательная функция:</b> изучает и объясняет экономику, представляет знания в обобщённом, систематизированном виде.', icon: function (c, g) { K.book(c, 0, 0, 0, C.GOLD, fItems[2].info, g, 1.1); var l = K.glow(c, C.GOLD, 0.2, fItems[2].info); l.position.y = 0.7; g.add(l); } },
    { t: 'практическая', col: C.GREEN, info: '<b>Практическая функция:</b> даёт рекомендации, предлагает выбор действий, объясняет, какой должна быть экономика (нормативная теория).', icon: function (c, g) { K.gear(c, 0, 0.6, 0, C.GREEN, fItems[3].info, g, 1); } },
    { t: 'прогнозная', col: C.PURPLE, info: '<b>Прогнозная функция:</b> предсказывает развитие экономики — что будет с ценами, ростом, занятостью.', icon: function (c, g) { var T = c.THREE; var b = c.mesh(new T.SphereGeometry(0.45, 20, 14), '#9fd3ff', fItems[4].info, { transparent: true, opacity: 0.6, emissive: C.PURPLE, emissiveIntensity: 0.3 }); b.position.y = 0.75; g.add(b); g.add(c.box3(0.7, 0.25, 0.7, C.WOOD, [0, 0.12, 0], fItems[4].info)); } }
  ];
  reg('o2-functions3d', {
    title: 'Пять функций экономической теории', lead: 'В центре — экономическая теория. Вокруг — пять её функций. Запоминалка: «Мама Идёт Покупать Пять Пирожков».',
    radius: 15, phi: 0.95, theta: 0.3, targetY: 1, height: 430, hint: 'Нажми на постамент или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var core = K.book(c, 0, 0.2, 0, C.BLUE, '<b>Экономическая теория</b> — наука, у которой пять функций.', null, 1.8);
      var orb = K.glow(c, C.GOLD, 0.3, '<b>Экономическая теория</b>'); orb.position.y = 1.4;
      c.label('экономическая\nтеория', [0, 2.4, 0], 0.22);
      K.ring(c, fItems, 5.2);
      c.onFrame(function (t) { orb.position.y = 1.4 + 0.15 * Math.sin(t * 2); core.rotation.y = t * 0.3; });
    },
    chips: K.ringChips(fItems, ['Методологическая', 'Идеологическая', 'Познавательная', 'Практическая', 'Прогнозная'])
  });

  /* ======================= 10. Классификация благ ======================= */
  reg('o2-goods3d', {
    autorotate: false,
    title: 'Пары благ: субституты, комплементы, свободные и экономические', lead: 'Четыре стола — четыре пары. Нажми кнопку: на столе произойдёт «событие», и ты увидишь, как ведёт себя пара.',
    radius: 15, phi: 0.95, theta: 0.2, targetY: 1, height: 450, hint: 'Нажми на кнопку-пару.',
    build: function (c) {
      var T = c.THREE; c.ground(8.5);
      var tables = [[-3.6, -2.4], [3.6, -2.4], [-3.6, 2.4], [3.6, 2.4]];
      tables.forEach(function (p) { c.box3(3.0, 0.15, 2.0, C.WOOD, [p[0], 0.7, p[1]], 'Стол с парой благ'); c.link([p[0], 0, p[1]], [p[0], 0.7, p[1]], C.WOOD, 0.1, 'Стол'); });
      var iS = '<b>Взаимозаменяемые (субституты)</b> — «одно <b>вместо</b> другого»: чай и кофе. Подорожал кофе → покупают больше чая.';
      var tea = c.mesh(new T.CylinderGeometry(0.3, 0.25, 0.5, 18), C.TEA, iS); tea.position.set(-4.3, 1.05, -2.4);
      var cof = c.mesh(new T.CylinderGeometry(0.3, 0.25, 0.5, 18), '#6f4e37', iS); cof.position.set(-2.9, 1.05, -2.4);
      c.label('чай | кофе', [-3.6, 2.2, -2.4], 0.18);
      var iC = '<b>Взаимодополняемые (комплементарные)</b> — «одно <b>вместе</b> с другим»: принтер и картридж, машина и бензин.';
      var pr = c.box3(1.1, 0.5, 0.8, C.SILVER, [3.2, 1.05, -2.4], iC); var cart = c.box3(0.35, 0.3, 0.3, C.DARK, [4.4, 1.0, -2.4], iC);
      c.label('принтер + картридж', [3.6, 2.2, -2.4], 0.18);
      var iF = '<b>Свободное благо</b> — есть в избытке, бесплатно: воздух, солнечный свет. <b>Экономическое (ограниченное)</b> — его меньше, чем хотят: за него платят.';
      var sun = K.glow(c, C.GOLD, 0.45, iF); sun.position.set(-4.3, 1.9, 2.4);
      var bread = c.mesh(new T.SphereGeometry(0.35, 16, 10), C.POTATO, iF); bread.scale.set(1.5, 0.7, 0.9); bread.position.set(-2.9, 1.0, 2.4);
      var tagB = c.label('₽', [-2.9, 1.6, 2.4], 0.2, '#f0c36b');
      c.label('солнце | хлеб', [-3.6, 2.8, 2.4], 0.18);
      var iL = '<b>Долговременные</b> служат годами (холодильник). <b>Кратковременные</b> исчезают при потреблении (мороженое).';
      var fr = c.box3(0.7, 1.3, 0.6, C.WHITE, [3.0, 1.45, 2.4], iL);
      var ice = c.mesh(new T.ConeGeometry(0.2, 0.5, 12), C.POTATO, iL); ice.rotation.x = Math.PI; ice.position.set(4.3, 1.1, 2.4);
      var scoop = c.mesh(new T.SphereGeometry(0.22, 12, 10), C.CREAM, iL); scoop.position.set(4.3, 1.42, 2.4);
      c.label('холодильник | мороженое', [3.6, 2.6, 2.4], 0.18);
      c.S = { ev: '' };
      c.onFrame(function (t) {
        var e = c.S.ev;
        var cs = e === 'sub' ? 0.6 + 0.4 * Math.abs(Math.sin(t)) : 1; cof.scale.setScalar(cs); tea.scale.setScalar(e === 'sub' ? 2 - cs : 1);
        var ps = e === 'comp' ? 0.6 + 0.4 * Math.abs(Math.sin(t)) : 1; pr.scale.setScalar(ps); cart.scale.setScalar(ps);
        sun.scale.setScalar(1 + 0.1 * Math.sin(t * 3)); tagB.visible = true;
        scoop.scale.setScalar(e === 'dur' ? Math.max(0.05, 1 - ((t * 0.3) % 1)) : 1);
      });
    },
    chips: [
      { t: 'Субституты', on: function (c) { c.S.ev = 'sub'; c.setView(-0.6, 0.9, 8, 1.2, -3.6, -2.4); c.say('Цена кофе растёт → кофе (коричневый) покупают меньше, а чай (зелёный) — больше. ' + 'Это <b>субституты</b>.'); } },
      { t: 'Комплементы', on: function (c) { c.S.ev = 'comp'; c.setView(0.6, 0.9, 8, 1.2, 3.6, -2.4); c.say('Подорожали картриджи → принтеров тоже покупают меньше: они нужны <b>вместе</b>. Это <b>комплементы</b>.'); } },
      { t: 'Свободное / экономическое', on: function (c) { c.S.ev = 'free'; c.setView(-0.6, 0.9, 8, 1.4, -3.6, 2.4); c.say('Солнечный свет — <b>свободное</b> благо: его хватает всем. Хлеб — <b>экономическое</b>: его производят из ограниченных ресурсов, поэтому есть цена.'); } },
      { t: 'Долго- / кратковременные', on: function (c) { c.S.ev = 'dur'; c.setView(0.6, 0.9, 8, 1.4, 3.6, 2.4); c.say('Мороженое «тает» при потреблении — <b>кратковременное</b> благо. Холодильник стоит годами — <b>долговременное</b>.'); } }
    ]
  });

  /* ======================= 11. Частные, клубные, общественные ======================= */
  reg('o2-public3d', {
    autorotate: false,
    title: 'Конкурентность и исключаемость: четыре вида благ', lead: 'Пол поделён на четыре клетки. По одной оси — можно ли не пустить того, кто не заплатил (исключаемость). По другой — уменьшается ли благо, когда им пользуются (конкурентность).',
    radius: 15, phi: 0.85, theta: 0.15, targetY: 0.6, height: 460, hint: 'Нажми на клетку или кнопку.',
    build: function (c) {
      var T = c.THREE;
      var cells = [
        [-2.6, -2.6, C.BLUE, 'частное', '<b>Частное благо</b> — конкурентное и исключаемое. Бутерброд: съел я — тебе не досталось; не заплатил — не получишь.'],
        [2.6, -2.6, C.ORANGE, 'перегружаемое', '<b>Перегружаемое общественное благо</b> — неисключаемое, но конкурентное: бесплатная дорога. Пускают всех, но в час пик она «кончается» — пробка.'],
        [-2.6, 2.6, C.PURPLE, 'клубное', '<b>Клубное благо</b> — общественное благо с <b>ограниченным доступом</b>: можно ввести плату. Бассейн по абонементу, платное ТВ.'],
        [2.6, 2.6, C.GREEN, 'общественное', '<b>Общественное благо</b> — неконкурентное и неисключаемое: маяк, оборона, уличное освещение. Производится в госсекторе и прибыли не приносит.']
      ];
      c.S = { cells: cells };
      cells.forEach(function (q) { c.box3(5.0, 0.2, 5.0, q[2], [q[0], -0.1, q[1]], q[4]); c.label(q[3], [q[0], 2.6, q[1]], 0.22); });
      c.label('исключаемые ← → неисключаемые', [0, 0.4, -5.6], 0.18, '#8b93b5');
      c.label('конкурентные ↑ / неконкурентные ↓', [-5.8, 0.4, 0], 0.16, '#8b93b5');
      var sand = K.group(c, -2.6, 0, -2.6);
      sand.add(c.box3(1.0, 0.15, 0.7, C.POTATO, [0, 0.1, 0], cells[0][4])); sand.add(c.box3(0.9, 0.1, 0.6, C.RED, [0, 0.22, 0], cells[0][4])); sand.add(c.box3(1.0, 0.15, 0.7, C.POTATO, [0, 0.35, 0], cells[0][4]));
      var eater = person(c, -3.6, -2.0, C.BLUE, cells[0][4]);
      var road = c.box3(4.6, 0.05, 1.2, C.DARK, [2.6, 0.05, -2.6], cells[1][4]);
      var cars = []; for (var i = 0; i < 6; i++) cars.push(c.box3(0.6, 0.35, 0.4, [C.RED, C.GOLD, C.WHITE][i % 3], [0, 0.25, -2.6], cells[1][4]));
      var pool = c.mesh(new T.CylinderGeometry(1.2, 1.2, 0.2, 28), '#5bc0ff', cells[2][4]); pool.position.set(-2.6, 0.1, 2.6);
      var gate = c.box3(0.1, 1.2, 1.8, C.SILVER, [-1.0, 0.6, 2.6], cells[2][4] + ' Турникет — исключаемость: без абонемента не пройдёшь.');
      var lh = K.group(c, 2.6, 0, 2.6);
      var tower = c.mesh(new T.CylinderGeometry(0.3, 0.5, 2.4, 16), C.WHITE, cells[3][4]); tower.position.y = 1.2; lh.add(tower);
      lh.add(c.box3(0.62, 0.3, 0.62, C.RED, [0, 1.0, 0], cells[3][4]));
      var lamp = K.glow(c, C.GOLD, 0.25, cells[3][4]); lamp.position.y = 2.6; lh.add(lamp);
      var beam = c.mesh(new T.ConeGeometry(0.6, 3.5, 16, 1, true), C.GOLD, cells[3][4], { transparent: true, opacity: 0.25, emissive: C.GOLD, emissiveIntensity: 0.6 }); beam.rotation.z = Math.PI / 2; beam.position.set(1.8, 2.6, 0); var piv = K.group(c, 2.6, 0, 2.6); piv.add(beam);
      var ships = [K.group(c, 5, 0, 4.5), K.group(c, 5, 0, 0.9)];
      ships.forEach(function (s) { s.add(c.box3(0.9, 0.25, 0.4, C.WOOD, [0, 0.15, 0], 'Корабли видят свет маяка — все сразу, и свет не «кончается».')); });
      c.onFrame(function (t) {
        var k = (t * 0.25) % 1; sand.scale.setScalar(Math.max(0.05, 1 - k)); eater.rotation.y = t;
        cars.forEach(function (m, i) { m.position.x = 0.5 + ((t * 0.6 + i * 0.16) % 1) * 4.2 * (0.5 + 0.5 * Math.cos(t * 0.5) * 0.2); });
        piv.rotation.y = t * 0.8;
      });
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Частное', 'Перегружаемое', 'Клубное', 'Общественное'][i], on: function (c) { var q = c.S.cells[i]; c.setView(Math.atan2(q[0], q[1] + 6), 0.85, 8, 0.6, q[0], q[1]); c.say(q[4]); } }; })
  });

  /* ======================= 12. Безбилетник ======================= */
  reg('o2-freerider3d', {
    autorotate: false,
    title: 'Проблема безбилетника', lead: 'Жильцы скидываются на домофон. Цель — заполнить копилку. Чем больше «безбилетников» (серых — пользуются, но не платят), тем меньше шансов, что домофон вообще появится.',
    radius: 14, phi: 1.0, theta: 0.2, targetY: 1.2, height: 440, hint: 'Меняй число безбилетников кнопками.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iH = '<b>Подъезд.</b> Домофон — благо для всех жильцов, отказать в пользовании соседу нельзя.';
      var bld = K.group(c, 0, 0, -3);
      bld.add(c.box3(5.5, 4.0, 1.2, C.STONE, [0, 2.0, 0], iH));
      for (var r = 0; r < 3; r++) for (var col = 0; col < 5; col++) bld.add(c.box3(0.6, 0.6, 0.05, '#9fd3ff', [-2.2 + col * 1.1, 1.3 + r * 1.0, 0.62], iH));
      bld.add(c.box3(1.0, 1.4, 0.06, C.WOOD, [0, 0.7, 0.62], iH));
      var iP = '<b>Домофон</b> — появляется, только если собрали всю сумму.';
      var phone = c.box3(0.35, 0.5, 0.1, C.DARK, [0.8, 1.0, -2.35], iP); var led = K.glow(c, C.GREEN, 0.07, iP); led.position.set(0.8, 1.15, -2.29);
      var iB = '<b>Копилка.</b> Нужно собрать 10 взносов.';
      var jar = c.mesh(new T.CylinderGeometry(0.8, 0.8, 1.8, 24, 1, true), '#9fd3ff', iB, { transparent: true, opacity: 0.25, side: T.DoubleSide }); jar.position.set(3.8, 0.9, 1);
      var fill = c.mesh(new T.CylinderGeometry(0.75, 0.75, 1, 24), C.GOLD, iB, { metalness: 0.3 }); fill.position.set(3.8, 0, 1);
      var ppl = [];
      for (var i = 0; i < 10; i++) { var a = Math.PI * 0.75 + i * 0.16; ppl.push(person(c, -1.0 + 4.6 * Math.cos(a), 1.6 + 2.2 * Math.sin(a) - 0.6, C.BLUE, 'Жилец', null, 0.85)); }
      var flying = []; for (var k = 0; k < 10; k++) flying.push(coin(c, 0, 0, 0, '<b>Взнос</b> 500 ₽.', null, 0.16));
      c.S = { riders: 2 };
      c.onFrame(function (t) {
        var R = c.S.riders, paid = 10 - R;
        ppl.forEach(function (p, i) { var rider = i < R; p.children.forEach(function (m, j) { if (j === 0) m.material.color.set(rider ? C.GREY : C.BLUE); }); p.children[0].userData.info = rider ? '<b>Безбилетник</b>: «Всё равно поставят — буду пользоваться бесплатно». Получает выгоду от чужих взносов, не платя.' : '<b>Честный жилец</b> заплатил свою долю.'; p.children[1].userData.info = p.children[0].userData.info; p.position.y = rider ? 0 : 0.05 * Math.sin(t * 4 + i); });
        flying.forEach(function (m, i) { var q = (t * 0.4 + i / 10) % 1, from = ppl[i].position; m.visible = i >= R; m.position.set(K.lerp(from.x, 3.8, q), 1.0 + Math.sin(q * Math.PI) * 1.2, K.lerp(from.z, 1, q)); m.rotation.x = t * 3; });
        var h = paid / 10 * 1.7; fill.scale.y = K.lerp(fill.scale.y, Math.max(0.02, h), 0.05); fill.position.y = fill.scale.y / 2;
        var ok = paid >= 10; phone.visible = ok; led.visible = ok && Math.sin(t * 6) > 0;
      });
    },
    chips: [
      { t: 'Все платят', on: function (c) { c.S.riders = 0; c.say('Все 10 жильцов заплатили — копилка полна, <b>домофон установлен</b>.'); } },
      { t: '2 безбилетника', on: function (c) { c.S.riders = 2; c.say('Двое решили «проехаться зайцем». Денег не хватает — <b>домофона нет ни у кого</b>, даже у честных.'); } },
      { t: '6 безбилетников', on: function (c) { c.S.riders = 6; c.say('Если каждый рассуждает как безбилетник, общественное благо почти не производится. По лекции: проблема безбилетника <b>приводит к тому, что количество благ уменьшается</b>.'); } },
      { t: 'Выход — налоги', on: function (c) { c.S.riders = 0; c.say('<b>[ДОБАВЛЕНО]</b> Рынок эту проблему не решает. Поэтому общественные блага оплачивают из <b>налогов</b>: платят все обязательно.'); } }
    ]
  });
})();
