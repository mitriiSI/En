/* 3D-модели к конспекту «Экономика. Конкуренция» (лекция 09.11), часть 2: совершенная конкуренция в долгом периоде,
   барьеры, монополия, монопсония. В Markdown: @@graph:ko-sunk3d@@ @@graph:ko-longrun3d@@ @@graph:ko-barriers3d@@
   @@graph:ko-natural3d@@ @@graph:ko-cartel3d@@ @@graph:ko-monotown3d@@ @@graph:ko-choice3d@@
   Нужен lib/ekonomika-firma3d.js (window.FirmaKit). */
(function () {
  'use strict';
  var K = window.FirmaKit;
  if (!K || !window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.22) * 1.3, col); }; b(c); };
    K.reg(name, opts);
  }
  var C = K.C, person = K.person, coin = K.coin, stack = K.stack, house = K.house, factory = K.factory;

  /* ======================= Безвозвратные издержки ======================= */
  reg('ko-sunk3d', {
    autorotate: false,
    title: 'Безвозвратные издержки держат фирму на рынке', lead: 'Пример лектора: владелец кафе заказал чашки и вывески со своим фирменным рисунком. Дела пошли плохо — но продать всё это некому. Деньги «утонули», и он будет бороться до последнего.',
    radius: 11, phi: 1.0, theta: 0.2, targetY: 1.2, height: 430, hint: 'Нажми на предмет или кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iH = '<b>Кафе.</b> Вложения в него частично <b>безвозвратные</b>: при уходе с рынка их не вернуть.';
      house(c, 0, -1.5, C.CREAM, iH, null, 1.8);
      var iCup = '<b>Чашки с фирменным рисунком</b> нужны только этому кафе. Другому владельцу они ни к чему — продать их нельзя. Это <b>безвозвратные (невозвратные) издержки</b>.';
      var cups = [];
      for (var i = 0; i < 5; i++) {
        var g = K.group(c, -2.4 + i * 1.2, 0, 1.8);
        var cup = c.mesh(new T.CylinderGeometry(0.32, 0.24, 0.5, 20), C.WHITE, iCup); cup.position.y = 0.25; g.add(cup);
        var pic = c.mesh(new T.SphereGeometry(0.1, 10, 8), C.WOOD, iCup); pic.position.set(0, 0.28, 0.3); g.add(pic);
        var h = c.mesh(new T.TorusGeometry(0.13, 0.04, 8, 16), C.WHITE, iCup); h.position.set(0.34, 0.27, 0); g.add(h);
        cups.push(g);
      }
      var iS = '<b>Вывеска с названием</b> — тоже безвозвратные издержки.';
      c.box3(2.4, 0.5, 0.1, C.RED, [0, 2.7, -0.55], iS); c.label('ВЫВЕСКА', [0, 2.7, -0.3], 0.18);
      var water = c.mesh(new T.CylinderGeometry(1.2, 1.2, 0.05, 30), '#3a7bd5', 'Деньги «утонули»: вернуть их, уйдя с рынка, нельзя.', { transparent: true, opacity: 0.6 }); water.position.set(4.2, 0.05, 1.5);
      var cs = stack(c, 4.2, 1.5, 4, 'Деньги, вложенные в чашки и вывеску.');
      c.S = { mode: 0, cs: cs };
      c.onFrame(function (t) {
        cs.forEach(function (m, i) { var ty = c.S.mode === 1 ? -0.4 - i * 0.05 : 0.06 + i * 0.11; m.position.y = K.lerp(m.position.y, ty, 0.05); });
        cups.forEach(function (g, i) { g.position.y = c.S.mode === 2 ? Math.abs(Math.sin(t * 3 + i)) * 0.2 : 0; });
      });
    },
    chips: [
      { t: 'Вложил', on: function (c) { c.S.mode = 0; c.say('Владелец вложил деньги в оборудование, которое подходит только его кафе.'); } },
      { t: 'Дела плохи', on: function (c) { c.S.mode = 1; c.say('Если уйти с рынка, эти деньги не вернуть: чашки с его рисунком и вывеску никто не купит. Это <b>высокие безвозвратные издержки</b> — барьер <b>выхода</b> с рынка.'); } },
      { t: 'Будет бороться', on: function (c) { c.S.mode = 2; c.say('Поэтому он будет «напрягаться изо всех сил»: снижать цены, менять ассортимент — но бороться. На рынке совершенной конкуренции таких издержек нет: <b>вход и выход свободны</b>.'); } }
    ]
  });

  /* ======================= Долгосрочное равновесие P = MC = min AC ======================= */
  reg('ko-longrun3d', {
    autorotate: false,
    title: 'Совершенная конкуренция в долгом периоде: P = MC = min AC', lead: 'U-образная кривая средних издержек AC, кривая предельных издержек MC и горизонтальная линия цены P. Нажимай сценарии и смотри, куда «съезжает» цена.',
    radius: 13, phi: 1.25, theta: 0, targetY: 2.4, targetX: 0.5, height: 440, hint: 'Нажимай сценарии.',
    build: function (c) {
      var T = c.THREE; c.ground(7.5);
      K.axes(c, -4, 0, 9, 5.6, null, 'Q', 'P, издержки');
      var ac = [], mc = [];
      for (var i = 0; i <= 24; i++) { var x = 0.4 + i * 0.32; ac.push([-4 + x, 1.6 + 0.16 * Math.pow(x - 4, 2), 0]); }
      for (var j = 0; j <= 20; j++) { var x2 = 1.2 + j * 0.3; mc.push([-4 + x2, 1.0 + 0.03 * Math.pow(x2 - 1.2, 2.4), 0]); }
      K.tube(c, ac, C.BLUE, '<b>AC — средние издержки</b> на единицу. Сначала падают (эффект масштаба), потом растут.', null, 0.07);
      K.tube(c, mc, C.RED, '<b>MC — предельные издержки</b>: затраты на ещё одну единицу. MC пересекает AC в её <b>минимуме</b>.', null, 0.07);
      c.label('AC', [3.8, 4.6, 0], 0.22, '#5b8def'); c.label('MC', [2.6, 5.4, 0], 0.22, '#e0645a');
      var dot = K.glow(c, C.GOLD, 0.2, '<b>Точка минимума AC.</b> Здесь MC = AC = P: фирма производит с самыми низкими средними издержками, а экономическая прибыль равна нулю (остаётся только нормальная прибыль).');
      dot.position.set(0, 1.6, 0);
      var pl = c.box3(9, 0.06, 0.06, C.GREEN, [0.5, 1.6, 0], '<b>P — рыночная цена.</b> Для фирмы при совершенной конкуренции это горизонтальная линия: P = MR.');
      var pL = c.label('P', [5.2, 1.6, 0], 0.22, '#4cc38a');
      var arrows = c.label('', [0, 0, 0], 0.01); arrows.visible = false;
      var inL = c.label('новые фирмы входят →', [2, 5.8, 0], 0.18, '#f0c36b'); inL.visible = false;
      var outL = c.label('← часть фирм уходит', [2, 5.8, 0], 0.18, '#f0c36b'); outL.visible = false;
      c.S = { p: 1.6 };
      c.onFrame(function () {
        pl.position.y = K.lerp(pl.position.y, c.S.p, 0.03); pL.position.y = pl.position.y;
        if (c.S.auto && Math.abs(pl.position.y - c.S.p) < 0.02) { c.S.p = 1.6; c.S.auto = false; inL.visible = outL.visible = false; }
      });
      c.S.inL = inL; c.S.outL = outL;
    },
    chips: [
      { t: 'Цена выше min AC', on: function (c) { c.S.p = 3.2; c.S.auto = false; c.S.inL.visible = true; c.S.outL.visible = false; c.say('Цена выше средних издержек → фирмы получают <b>экономическую прибыль</b>. Вход свободный, поэтому на рынок приходят <b>новые фирмы</b>, предложение растёт, цена падает…'); setTimeout(function () { c.S.auto = true; c.S.p = 1.6; }, 2200); } },
      { t: 'Цена ниже min AC', on: function (c) { c.S.p = 0.8; c.S.auto = false; c.S.outL.visible = true; c.S.inL.visible = false; c.say('Цена ниже средних издержек → <b>убытки</b>. Выход свободный, часть фирм уходит, предложение падает, цена растёт…'); setTimeout(function () { c.S.auto = true; c.S.p = 1.6; }, 2200); } },
      { t: 'Равновесие', on: function (c) { c.S.p = 1.6; c.S.inL.visible = c.S.outL.visible = false; c.setView(0, 1.25, 8, 1.8, 0, 0); c.say('В итоге цена останавливается в минимуме средних издержек: <b>MC = AC = P</b> (лектор: «предельные издержки должны быть равны средним издержкам и равны цене»).'); } }
    ]
  });

  /* ======================= Барьеры входа ======================= */
  reg('ko-barriers3d', {
    title: 'Барьеры входа на рынок', lead: 'Почему на рынок несовершенной конкуренции не войти «просто так». Каждый столб — отдельный барьер. Новичок пытается пройти.',
    radius: 13, phi: 1.0, theta: 0.3, targetY: 1.2, height: 430, hint: 'Нажми на барьер.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var B = [
        ['стартовый капитал', C.GOLD, '<b>Большой стартовый капитал.</b> Пример лектора: на рынке сотовой связи новую компанию «просто так» не организовать — нужны огромные деньги.'],
        ['патенты', C.BLUE, '<b>Патенты</b> на изобретения охраняются государством: производить чужой запатентованный товар нельзя.'],
        ['лицензии', C.PURPLE, '<b>Лицензии</b>: без разрешения государства в отрасль не войти (связь, банки, лекарства).'],
        ['ограничение среды', C.GREEN, '<b>Физическое ограничение среды</b>, которое ограничивает число обслуживающих организаций: в одном городе не проложишь пять параллельных водопроводов.']
      ];
      c.S = { B: B };
      B.forEach(function (b, i) {
        var z = -3.6 + i * 2.4;
        c.box3(0.6, 2 + i * 0.3, 1.8, b[1], [0, 1 + i * 0.15, z], b[2]);
        c.label(b[0], [0, 2.9 + i * 0.3, z], 0.2);
      });
      var iM = '<b>Рынок</b> с несовершенной конкуренцией: здесь уже работают несколько крупных фирм.';
      factory(c, 4, -1.2, C.STONE, iM, null, 0.8); factory(c, 4, 1.6, C.STONE, iM, null, 0.8);
      var nb = person(c, -4.5, 0, C.ORANGE, '<b>Новичок</b> хочет войти, но упирается в барьеры.', null, 1);
      c.onFrame(function (t) { nb.position.x = -4.5 + Math.abs(Math.sin(t * 1.2)) * 3.6; nb.position.z = Math.sin(t * 0.3) * 3; });
    },
    chips: [0, 1, 2, 3].map(function (i) { return { t: ['Капитал', 'Патенты', 'Лицензии', 'Среда'][i], on: function (c) { c.say(c.S.B[i][2]); } }; })
  });

  /* ======================= Естественная монополия ======================= */
  reg('ko-natural3d', {
    autorotate: false,
    title: 'Естественная монополия: одна сеть дешевле пяти', lead: 'Естественная монополия возникает, когда единственный производитель обслуживает рынок эффективнее, чем несколько фирм. Сравни одну водопроводную сеть и пять параллельных.',
    radius: 13, phi: 0.95, theta: 0.2, targetY: 1, height: 430, hint: 'Переключай один / много.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iH = '<b>Дома</b> получают воду.';
      for (var i = 0; i < 5; i++) house(c, 4, -3.6 + i * 1.8, C.CREAM, iH, null, 0.8);
      var iP = '<b>Водопровод</b> — огромные постоянные затраты (трубы под всем городом). Чем больше домов подключено к одной сети, тем дешевле обходится каждый кубометр.';
      var one = [], many = [];
      one.push(c.link([-4, 0.3, 0], [3.4, 0.3, 0], C.SILVER, 0.16, iP));
      for (var k = 0; k < 5; k++) one.push(c.link([3, 0.3, 0], [3.4, 0.3, -3.6 + k * 1.8], C.SILVER, 0.1, iP));
      var iM = '<b>Пять фирм — пять сетей:</b> каждая тянет свои трубы по всему городу. Затраты впятеро больше, а воды столько же. Конкуренция здесь <b>неэффективна</b>.';
      for (var f = 0; f < 5; f++) {
        var z = -2 + f;
        many.push(c.link([-4, 0.3 + f * 0.25, z], [3.4, 0.3 + f * 0.25, z], [C.RED, C.BLUE, C.GOLD, C.GREEN, C.PURPLE][f], 0.1, iM));
      }
      var st = factory(c, -5, 0, C.BLUE, '<b>Водоканал</b> — естественная монополия.', null, 0.8);
      var cost = c.label('затраты: 1×', [-1, 2.6, 0], 0.24, '#4cc38a');
      var cost5 = c.label('затраты: 5×', [-1, 2.6, 0], 0.24, '#e0645a');
      c.S = { many: false };
      c.onFrame(function () { many.forEach(function (m) { m.visible = c.S.many; }); one.forEach(function (m) { m.visible = !c.S.many; }); cost.visible = !c.S.many; cost5.visible = c.S.many; });
    },
    chips: [
      { t: 'Одна сеть', on: function (c) { c.S.many = false; c.say('Одна фирма обслуживает весь город с наименьшими средними издержками — это <b>естественная монополия</b> (водопровод, электросети, железные дороги, метро).'); } },
      { t: 'Пять сетей', on: function (c) { c.S.many = true; c.say('Если бы здесь конкурировали пять фирм, каждая строила бы свою сеть, и вода стоила бы гораздо дороже. Поэтому естественную монополию не разбивают, а <b>регулируют</b> её цены.'); } }
    ]
  });

  /* ======================= Картель ======================= */
  reg('ko-cartel3d', {
    autorotate: false,
    title: 'Картель и синдикат: соперники объединились', lead: 'Картель — фирмы договариваются о цене и делят рынок. Синдикат — ещё и продают через одну общую контору. Нажимай кнопки.',
    radius: 12, phi: 1.0, theta: 0.2, targetY: 1.4, height: 420, hint: 'Сравни конкуренцию и сговор.',
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var F = [C.RED, C.BLUE, C.GOLD, C.GREEN];
      var firms = [], bars = [];
      F.forEach(function (col, i) {
        var a = i / 4 * Math.PI * 2 + Math.PI / 4, x = 3.6 * Math.cos(a), z = 3.6 * Math.sin(a);
        firms.push(factory(c, x, z, col, '<b>Фирма-участник.</b> Формально самостоятельна.', null, 0.6));
        var b = c.box3(0.4, 1, 0.4, col, [x * 0.45, 0.5, z * 0.45], 'Цена этой фирмы.'); bars.push(b);
      });
      var table = c.mesh(new T.CylinderGeometry(1.1, 1.1, 0.1, 28), C.WOOD, '<b>«Стол переговоров».</b> Картель — соглашение о ценах, объёмах выпуска, разделе рынка. В России запрещён законом «О защите конкуренции».');
      table.position.y = 0.9;
      var tl = c.label('договор о цене', [0, 2.2, 0], 0.2, '#f0c36b');
      var office = c.box3(1.4, 1.2, 1.4, C.PURPLE, [0, 0.6, 0], '<b>Общая сбытовая контора синдиката.</b> Фирмы сами производят, но продаёт всю продукцию только она.');
      var ol = c.label('общая контора сбыта', [0, 2.2, 0], 0.2, '#a78bfa');
      var boxes = firms.map(function (f) { return c.box3(0.35, 0.35, 0.35, C.CREAM, [0, 0.3, 0], 'Продукция фирмы едет в общую контору.'); });
      c.S = { cartel: false, synd: false };
      c.onFrame(function (t) {
        bars.forEach(function (b, i) {
          var h = c.S.cartel ? 3 : 1 + 0.25 * Math.sin(t * 1.5 + i * 1.7);
          b.scale.y = K.lerp(b.scale.y, h, 0.06); b.position.y = b.scale.y / 2;
        });
        table.visible = tl.visible = c.S.cartel && !c.S.synd;
        office.visible = ol.visible = c.S.synd;
        boxes.forEach(function (b, i) { b.visible = c.S.synd; var k = (t * 0.35 + i / 4) % 1, f = firms[i].position; b.position.set(K.lerp(f.x, 0, k), 0.3, K.lerp(f.z, 0, k)); });
      });
    },
    chips: [
      { t: 'Конкуренция', on: function (c) { c.S.cartel = false; c.S.synd = false; c.say('Каждая фирма сама решает, какую цену назначить: цены «пляшут», каждая старается переманить покупателя.'); } },
      { t: 'Картель', on: function (c) { c.S.cartel = true; c.S.synd = false; c.say('<b>Картель:</b> фирмы договорились держать одинаково <b>высокую</b> цену. Покупателю некуда уйти — по сути, это монополия, «склеенная» из нескольких фирм.'); } },
      { t: 'Синдикат', on: function (c) { c.S.cartel = true; c.S.synd = true; c.say('<b>Синдикат:</b> фирмы сами производят, но продают через <b>одну общую контору</b>. Лектор: в России конца XIX — начала XX века это была самая распространённая форма монополии.'); } }
    ]
  });

  /* ======================= Моногород ======================= */
  reg('ko-monotown3d', {
    title: 'Моногород: единственная работа в городе', lead: 'Лектор: в Москве такая ситуация редкость, а в маленьких городах встречается часто — один завод, один работодатель. Он и есть монопсонист на рынке труда.',
    radius: 13, phi: 0.95, theta: 0.3, targetY: 1, height: 430, hint: 'Нажми на завод или жителей.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var f = factory(c, 0, 0, C.STONE, '<b>Градообразующее предприятие</b> — единственный крупный работодатель. Других покупателей труда нет, поэтому оно может платить <b>меньше</b>.', null, 1.3);
      K.smoke(c, f, 4);
      var iH = '<b>Жители</b> продают свой труд. Продавцов много, а покупатель один — это <b>монопсония</b>.';
      var ppl = [];
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2, x = 5.4 * Math.cos(a), z = 5.4 * Math.sin(a);
        house(c, x * 1.15, z * 1.15, C.CREAM, iH, null, 0.6);
        ppl.push([person(c, x, z, C.BLUE, iH, null, 0.7), x, z]);
      }
      c.onFrame(function (t) { ppl.forEach(function (p, i) { var k = (Math.sin(t * 0.6 + i) + 1) / 2; p[0].position.set(K.lerp(p[1], p[1] * 0.45, k), 0, K.lerp(p[2], p[2] * 0.45, k)); }); });
    },
    chips: [
      { t: 'Почему монопсония', on: function (c) { c.say('Труд продают многие, а «покупает» один завод. Он может диктовать зарплату: уйти работнику некуда.'); } },
      { t: 'Пример лектора', on: function (c) { c.say('Ещё пример монопсонии из лекции: единственное в районе <b>предприятие по переработке сельхозпродукции</b>. Фермеров много, а сдать молоко или зерно больше некуда — покупатель может <b>занижать цену</b>.'); } }
    ]
  });

  /* ======================= Выбор при конкуренции и монополии ======================= */
  reg('ko-choice3d', {
    autorotate: false,
    title: 'Конкуренция = выбор, монополия = «хочешь — покупай»', lead: 'Слева — улица с несколькими магазинами, справа — единственный магазин района. Лектор: при монополии выбора нет — «хочешь — покупай, не хочешь — не покупай».',
    radius: 13, phi: 1.0, theta: 0, targetY: 1, height: 420, hint: 'Нажми кнопку.',
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iA = '<b>Несколько магазинов</b> — покупатель выбирает, где лучше и дешевле.';
      [-5.2, -3.4, -1.6].forEach(function (x, i) { house(c, x, -1.5, [C.RED, C.BLUE, C.GREEN][i], iA, null, 0.9); });
      var iB = '<b>Единственный магазин</b> в маленьком городе или отдельном районе — <b>доминирующее положение</b> на рынке.';
      house(c, 3.4, -1.5, C.GOLD, iB, null, 1.5);
      c.label('выбор', [-3.4, 2.4, -1.5], 0.24, '#4cc38a'); c.label('нет выбора', [3.4, 3.2, -1.5], 0.24, '#e0645a');
      c.link([0, 0, -4], [0, 0.05, 4], C.GREY, 0.04, null);
      var a = person(c, -3.4, 2, C.SKIN, 'Покупатель ходит между магазинами.', null, 0.9);
      var b = person(c, 3.4, 2, C.SKIN, 'Покупатель: «хочешь — покупай, не хочешь — не покупай».', null, 0.9);
      c.onFrame(function (t) { a.position.x = -3.4 + Math.sin(t * 0.8) * 1.8; b.position.z = 2 + Math.sin(t * 0.8) * 0.3; });
    },
    chips: [
      { t: 'Монополия', on: function (c) { c.say('<b>Монополия</b> возникает, когда фирма занимает <b>доминирующее положение</b> на рынке данного товара. Конкуренция предполагает свободу выбора, а при монополии выбора нет вообще.'); } }
    ]
  });
})();
