/* 3D-модели к конспекту «Кризис европейской культуры: психоанализ Фрейда» (Философия, 18.11), часть 2.
   В Markdown: @@graph:fr-iceberg3d@@ @@graph:fr-rider3d@@ @@graph:fr-scales3d@@ @@graph:fr-dam3d@@
   @@graph:fr-triangle3d@@ @@graph:fr-dream3d@@ @@graph:fr-body3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa',
    WOOD = '#8a5a3b', STONE = '#d9d4c7', DARK = '#3a3f55', PAPER = '#f4f1ea', ORANGE = '#f08a3c', ICE = '#cfe6ff', SEA = '#1d4f8a';
  function reg(name, opts) {
    var b = opts.build;
    opts.build = function (c) { var L = c.label; c.label = function (t, pos, size, col) { return L(t, pos, (size || 0.9) * 2.6, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function person(c, x, z, col, info, g, s, y) {
    var T = c.THREE; s = s || 1; y = y || 0;
    var p = new T.Group(); (g || c.root).add(p); p.position.set(x, y, z);
    var b = c.mesh(new T.CylinderGeometry(0.22 * s, 0.3 * s, 0.9 * s, 12), col, info); b.position.y = 0.45 * s; p.add(b);
    var h = c.mesh(new T.SphereGeometry(0.22 * s, 14, 10), '#e8c6a0', info); h.position.y = 1.12 * s; p.add(h);
    return p;
  }
  function glow(c, col, r, info) { return c.mesh(new c.THREE.SphereGeometry(r || 0.3, 20, 14), col, info, { emissive: col, emissiveIntensity: 0.6 }); }

  /* ======================= 1. Айсберг психики ======================= */
  reg('fr-iceberg3d', {
    title: 'Айсберг психики', lead: 'Над водой — сознание, у самой воды — предсознание, в глубине — бессознательное. Светящиеся шары — желания. Нажми «Вытеснить» и «Прорыв».',
    radius: 12, phi: 1.2, theta: 0.3, targetY: 0.2, height: 440, hint: 'Нажми на любой слой айсберга.',
    build: function (c) {
      var T = c.THREE;
      var iS = '<b>Сознание</b> — то, что я знаю о себе прямо сейчас. Это лишь верхушка айсберга.';
      var iP = '<b>Предсознание</b> — то, что сейчас не в фокусе, но легко вспоминается (номер телефона, вчерашний день).';
      var iU = '<b>Бессознательное</b> — огромное «хранилище»: желания, которые угрожают сознанию, и всё, что человек <b>вытеснил</b> — хочет забыть. Оно не исчезает, а действует незаметно.';
      var tip = c.mesh(new T.ConeGeometry(1.6, 2.4, 7), ICE, iS); tip.position.y = 1.4;
      var mid = c.mesh(new T.CylinderGeometry(1.6, 2.6, 1.2, 7), '#a9cdf2', iP); mid.position.y = -0.4;
      var deep = c.mesh(new T.CylinderGeometry(2.6, 1.2, 4.2, 7), '#5f8fc4', iU); deep.position.y = -3.1;
      var water = c.mesh(new T.CylinderGeometry(6, 6, 0.05, 40), SEA, 'Поверхность воды — граница сознания.', { transparent: true, opacity: 0.45 }); water.position.y = 0.2;
      c.label('сознание', [3.4, 2.2, 0], 0.32); c.label('предсознание', [4.0, -0.4, 0], 0.3); c.label('бессознательное', [4.4, -3.2, 0], 0.32, '#ffb3ab');
      var balls = [];
      for (var i = 0; i < 7; i++) { var b = glow(c, [RED, ORANGE, PURPLE][i % 3], 0.22, '<b>Желание.</b> Запретные желания и детские переживания вытесняются вниз, но продолжают «толкаться» к поверхности.'); b.userData = { a: i / 7 * 6.28, y: -3.5 + (i % 3) * 0.6 }; balls.push(b); }
      var lid = c.mesh(new T.CylinderGeometry(2.0, 2.0, 0.12, 24), GOLD, '<b>Цензура / вытеснение.</b> Защитный механизм: не пускает опасное желание в сознание.', { transparent: true, opacity: 0.8 }); lid.position.y = -1.2;
      c.state = { mode: 'calm' };
      c.onFrame(function (t) {
        var m = c.state.mode;
        balls.forEach(function (b, i) {
          var u = b.userData, y = u.y + Math.sin(t * 1.5 + i) * 0.3;
          if (m === 'push') y = -4.4 + (i % 3) * 0.3;
          if (m === 'burst' && i % 2 === 0) y = Math.min(2.2, -1 + ((t * 1.2 + i) % 3.5));
          b.position.x += (Math.cos(u.a + t * 0.2) * 1.3 - b.position.x) * 0.1; b.position.z += (Math.sin(u.a + t * 0.2) * 1.3 - b.position.z) * 0.1; b.position.y += (y - b.position.y) * 0.08;
        });
        lid.position.y = -1.2 + (m === 'burst' ? Math.sin(t * 12) * 0.08 : 0);
      });
    },
    chips: [
      { t: 'Вытеснить', on: function (c) { c.state.mode = 'push'; c.say('<b>Вытеснение:</b> то, что болезненно или запретно, уходит в бессознательное. Человек «не помнит», но это продолжает им управлять.'); } },
      { t: 'Прорыв', on: function (c) { c.state.mode = 'burst'; c.say('Вытесненное прорывается наверх в замаскированном виде: <b>сны, оговорки, симптомы, неврозы</b>.'); } },
      { t: 'Покой', on: function (c) { c.state.mode = 'calm'; c.say('Желания всегда в движении: бессознательное — не склад, а живая сила.'); } }
    ]
  });

  /* ======================= 2. Оно — Я — Сверх-Я ======================= */
  reg('fr-rider3d', {
    title: 'Оно, Я и Сверх-Я', lead: 'Конь — Оно (инстинкты), всадник — Я, сверху строгий наблюдатель — Сверх-Я (нормы). Нажимай кнопки и смотри, кто кем управляет.',
    radius: 10.4, phi: 1.1, theta: 0.6, targetY: 1.8, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(7);
      var iO = '<b>Оно (Ид)</b> — животные инстинкты и влечения. Живёт по <b>принципу удовольствия</b>: «хочу — сейчас». Не знает ни морали, ни времени.';
      var iJ = '<b>Я (Эго)</b> — <b>посредник</b> между животными инстинктами и социальными рамками. Живёт по <b>принципу реальности</b>. Фрейд: Я — как всадник, который сдерживает более сильного коня.';
      var iS = '<b>Сверх-Я (Супер-Эго)</b> — <b>внешние требования, ставшие внутренними нормами</b>: голос родителей, общества, совесть. Наказывает чувством вины.';
      var horse = new T.Group(); c.root.add(horse);
      var body = c.mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(0.6, 1.8, 6, 12) : new T.CylinderGeometry(0.6, 0.6, 2.6, 14), RED, iO); body.rotation.z = Math.PI / 2; body.position.y = 1.4; horse.add(body);
      var neck = c.mesh(new T.CylinderGeometry(0.25, 0.4, 1.2, 10), RED, iO); neck.position.set(1.4, 2.1, 0); neck.rotation.z = -0.6; horse.add(neck);
      var head = c.mesh(new T.BoxGeometry(0.9, 0.4, 0.4), RED, iO); head.position.set(1.95, 2.6, 0); head.rotation.z = -0.3; horse.add(head);
      [[-0.8, 0.4], [-0.8, -0.4], [0.8, 0.4], [0.8, -0.4]].forEach(function (l) { var leg = c.mesh(new T.CylinderGeometry(0.12, 0.1, 1.1, 8), '#b84a40', iO); leg.position.set(l[0], 0.55, l[1]); horse.add(leg); });
      var rider = person(c, -0.1, 0, BLUE, iJ, horse, 0.9, 1.95);
      var rein = c.link([0.15, 3.0, 0], [2.2, 2.6, 0], GOLD, 0.03, 'Поводья — контроль Я над влечениями.'); horse.add(rein);
      var eye = glow(c, GOLD, 0.5, iS); eye.position.set(-1.5, 5.6, -1);
      var tabs = c.box3(1.1, 1.4, 0.15, STONE, [-1.5, 4.3, -1], iS);
      c.label('Сверх-Я', [-1.5, 6.6, -1], 0.32, '#f0c36b'); c.label('Я', [-0.1, 4.0, 0.8], 0.3, '#cfd6ff'); c.label('Оно', [1.5, 0.5, 1.2], 0.3, '#ffb3ab');
      c.state = { mode: 'eq' };
      c.onFrame(function (t) {
        var m = c.state.mode;
        horse.position.x = m === 'id' ? Math.sin(t * 3) * 1.2 : 0; horse.rotation.z = m === 'id' ? Math.sin(t * 6) * 0.08 : 0;
        rider.rotation.z = m === 'id' ? -0.4 : (m === 'super' ? 0.3 : 0);
        rider.scale.y = m === 'super' ? 0.75 : 1;
        eye.scale.setScalar(m === 'super' ? 1.6 : 1); eye.position.y = m === 'super' ? 4.9 + Math.sin(t * 4) * 0.1 : 5.6;
      });
    },
    chips: [
      { t: 'Оно тянет', on: function (c) { c.state.mode = 'id'; c.say('Влечение сильнее: конь несётся, всадник еле держится. «Одно дело хотеть, другое — жить».'); } },
      { t: 'Сверх-Я давит', on: function (c) { c.state.mode = 'super'; c.say('Нормы давят на Я сверху: стыд, вина, «ты должен». Несоответствие требований и желаний — <b>источник неврозов</b>.'); } },
      { t: 'Равновесие', on: function (c) { c.state.mode = 'eq'; c.say('Здоровое Я находит компромисс между желанием, нормами и реальностью.'); } }
    ]
  });

  /* ======================= 3. Принцип удовольствия и реальности ======================= */
  reg('fr-scales3d', {
    title: 'Принцип удовольствия и принцип реальности', lead: 'Весы: слева «хочу» (удовольствие), справа «надо и можно» (реальность). Посмотри, как меняется равновесие с возрастом.',
    radius: 9.6, phi: 1.15, theta: 0.2, targetY: 2, height: 380,
    build: function (c) {
      var T = c.THREE; c.ground(5);
      var post = c.mesh(new T.CylinderGeometry(0.15, 0.3, 3, 12), WOOD, 'Весы психики.'); post.position.y = 1.5;
      var beam = new T.Group(); c.root.add(beam); beam.position.y = 3.1;
      var bar = c.mesh(new T.BoxGeometry(5, 0.15, 0.15), WOOD, null); beam.add(bar);
      var iP = '<b>Принцип удовольствия</b> — с ним человек рождается. Либидо стремится к тому, что приносит удовольствие, сразу и любой ценой.';
      var iR = '<b>Принцип реальности</b> — «наша жизнь ограничена». Все знают: <b>одно дело хотеть, другое — жить</b>. Удовольствие приходится откладывать.';
      var panL = c.mesh(new T.CylinderGeometry(0.9, 0.7, 0.2, 20), RED, iP); var panR = c.mesh(new T.CylinderGeometry(0.9, 0.7, 0.2, 20), BLUE, iR);
      var ballL = glow(c, ORANGE, 0.5, iP), cubeR = c.box3(0.8, 0.8, 0.8, STONE, [0, 0, 0], iR);
      var lL = c.label('хочу!', [0, 0, 0], 0.32, '#ffb3ab'), lR = c.label('надо / можно', [0, 0, 0], 0.3, '#cfd6ff');
      c.state = { a: 0.35, goal: 0.35 };
      c.onFrame(function (t) {
        var s = c.state; s.a += (s.goal - s.a) * 0.05; beam.rotation.z = s.a;
        var cL = Math.cos(s.a), sL = Math.sin(s.a), yL = 3.1 - 2.3 * sL - 0.9, yR = 3.1 + 2.3 * sL - 0.9;
        panL.position.set(-2.3 * cL, yL, 0); panR.position.set(2.3 * cL, yR, 0);
        ballL.position.set(-2.3 * cL, yL + 0.6, 0); cubeR.position.set(2.3 * cL, yR + 0.5, 0);
        lL.position.set(-2.3 * cL, ballL.position.y + 1.1, 0); lR.position.set(2.3 * cL, cubeR.position.y + 1.1, 0);
      });
    },
    chips: [
      { t: 'Младенец', on: function (c) { c.state.goal = 0.35; c.say('У младенца всё решает удовольствие: голоден — кричит. Чаша «хочу» перевешивает.'); } },
      { t: 'Взрослый', on: function (c) { c.state.goal = 0; c.say('Взрослый учитывает реальность: хочет, но умеет подождать. Это работа <b>Я</b>.'); } },
      { t: 'Подавление', on: function (c) { c.state.goal = -0.4; c.say('Если реальность и запреты полностью давят желание, жизненная энергия не исчезает — она уходит в <b>неврозы и симптомы</b>.'); } }
    ]
  });

  /* ======================= 4. Либидо, плотина и сублимация ======================= */
  reg('fr-dam3d', {
    title: 'Либидо: плотина или каналы', lead: 'Резервуар — энергия влечений (либидо). Если просто запереть её плотиной, давление растёт и вода пробивает трещины. Если прорыть каналы — она питает творчество.',
    radius: 12.8, phi: 0.95, theta: 0.3, targetY: 1, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var iL = '<b>Либидо</b> — у Фрейда энергия влечений (прежде всего сексуального), «живая энергетика» жизни. Её нельзя уничтожить — только направить.';
      var res = c.mesh(new T.CylinderGeometry(2, 2, 2, 28, 1, true), STONE, iL, { side: T.DoubleSide }); res.position.set(-3.5, 1, 0);
      var water = c.mesh(new T.CylinderGeometry(1.9, 1.9, 1, 28), '#4a8fe0', iL, { emissive: '#2a5fae', emissiveIntensity: 0.3 }); water.position.set(-3.5, 0.5, 0);
      var dam = c.box3(0.3, 2.2, 1.6, GREY, [-1.3, 1.1, 0], '<b>Плотина = вытеснение и запреты.</b> Энергию заперли, но она давит изнутри.');
      var names = [['творчество', GOLD], ['наука и работа', BLUE], ['спорт', GREEN]], chans = [], flows = [];
      names.forEach(function (n, i) {
        var z = (i - 1) * 2.2;
        var ch = c.link([-1.1, 0.15, 0], [3.2, 0.15, z], WOOD, 0.22, '<b>Сублимация</b> — переход сексуальной энергии в <b>несексуальную сферу</b>: ' + n[0] + '.'); chans.push(ch);
        var g = glow(c, n[1], 0.5, '<b>' + n[0] + '</b> — сюда направлена энергия при сублимации. По Фрейду, культура во многом построена на сублимации.'); g.position.set(3.8, 0.6, z);
        c.label(n[0], [4.2, 1.8, z], 0.34);
        var dots = []; for (var k = 0; k < 4; k++) { var d = c.mesh(new T.SphereGeometry(0.12, 8, 6), '#7fb6ff', null, { emissive: '#4a8fe0', emissiveIntensity: 0.6 }); d.visible = false; dots.push(d); } flows.push({ z: z, dots: dots, g: g });
      });
      var cracks = []; for (var j = 0; j < 4; j++) { var cr = glow(c, RED, 0.14, '<b>Невроз, симптом.</b> Вытесненная энергия прорывается в искажённой форме: тревога, навязчивости, боли «без причины».'); cr.position.set(-1.15, 0.5 + j * 0.45, -0.6 + j * 0.35); cr.visible = false; cracks.push(cr); }
      c.label('либидо', [-3.5, 2.9, 0], 0.32, '#7fb6ff');
      c.state = { mode: 'dam', p: 0.5 };
      c.onFrame(function (t) {
        var s = c.state, dam_ = s.mode === 'dam';
        s.p += ((dam_ ? 2 : 0.6) - s.p) * 0.01; water.scale.y = s.p * 1.6; water.position.y = s.p * 0.8;
        cracks.forEach(function (cr, i) { cr.visible = dam_ && s.p > 1.2; cr.scale.setScalar(1 + 0.4 * Math.sin(t * 8 + i)); });
        dam.position.y = dam_ ? 1.1 : 3.5;
        flows.forEach(function (f) { f.dots.forEach(function (d, k) { d.visible = !dam_; var u = (t * 0.5 + k / 4) % 1; d.position.set(-1.1 + u * 4.3, 0.4, f.z * u); }); f.g.scale.setScalar(dam_ ? 0.6 : 1 + 0.1 * Math.sin(t * 3)); });
      });
    },
    chips: [
      { t: 'Запереть', small: 'вытеснение', on: function (c) { c.state.mode = 'dam'; c.say('Энергия заперта, давление растёт — появляются трещины: <b>неврозы и психосоматика</b>.'); } },
      { t: 'Сублимировать', small: 'каналы', on: function (c) { c.state.mode = 'sub'; c.say('<b>Сублимация:</b> энергия уходит в творчество, социальное действие, спорт. Лектор: <b>сильная личность</b> сублимирует, а <b>слабая</b> защищается фантазиями.'); } }
    ]
  });

  /* ======================= 5. Треугольник семьи ======================= */
  reg('fr-triangle3d', {
    title: 'Семейный треугольник: Эдипов комплекс', lead: 'Ребёнок, мать и отец — вершины треугольника. Отношения в нём, по Фрейду, задают характер на всю жизнь. Переключай: мальчик / девочка.',
    radius: 9.6, phi: 0.9, theta: 0, targetY: 1.2, height: 400,
    build: function (c) {
      var T = c.THREE; c.ground(6);
      var iM = '<b>Мать</b> — первая любовь ребёнка: любовь, забота, тепло. Эта ранняя любовь потом переносится на другие объекты: учёбу, друзей, свою семью.';
      var iF = '<b>Отец</b> — защитник и одновременно соперник. Через него ребёнок усваивает запрет и нормы (так рождается Сверх-Я).';
      var mom = person(c, -2.6, -1.6, PURPLE, iM, null, 1.2), dad = person(c, 2.6, -1.6, BLUE, iF, null, 1.3);
      var kid = person(c, 0, 2, GOLD, '<b>Ребёнок.</b> Характер человека складывается в детстве: «вся жизнь — отработка детских драм».', null, 0.8);
      var lm = c.link([0, 0.8, 2], [-2.6, 0.8, -1.6], RED, 0.06, '<b>Влечение / любовь</b> к родителю противоположного пола.');
      var ld = c.link([0, 0.8, 2], [2.6, 0.8, -1.6], GREY, 0.06, '<b>Соперничество и защита</b> — отношение к родителю своего пола.');
      var lp = c.link([-2.6, 0.8, -1.6], [2.6, 0.8, -1.6], GREEN, 0.04, 'Отношения между родителями тоже влияют на ребёнка.');
      var heart = glow(c, RED, 0.25, 'Детская любовь.');
      c.label('мать', [-2.6, 2.4, -1.6], 0.3); c.label('отец', [2.6, 2.6, -1.6], 0.3); c.label('ребёнок', [0, 1.8, 2], 0.3);
      c.state = { boy: true };
      c.onFrame(function (t) {
        var to = c.state.boy ? [-2.6, -1.6] : [2.6, -1.6], u = (t * 0.4) % 1;
        heart.position.set(to[0] * u, 0.8 + Math.sin(u * Math.PI) * 0.6, 2 + (to[1] - 2) * u);
        lm.material.color.set(c.state.boy ? RED : GREY); ld.material.color.set(c.state.boy ? GREY : RED);
      });
    },
    chips: [
      { t: 'Мальчик', small: 'Эдип', on: function (c) { c.state.boy = true; c.say('<b>Эдипов комплекс</b> — любовь мальчика к матери и соперничество с отцом (по мифу о царе Эдипе). На нём построено множество художественных произведений.'); } },
      { t: 'Девочка', small: 'Электра', on: function (c) { c.state.boy = false; c.say('Девочка привязывается к отцу-защитнику. <b>[ДОБАВЛЕНО]</b> Название «комплекс Электры» предложил К. Г. Юнг; сам Фрейд его не принял.'); } }
    ]
  });

  /* ======================= 6. Сон — царская дорога ======================= */
  reg('fr-dream3d', {
    title: 'Сон — «царская дорога» к бессознательному', lead: 'Золотая дорога ведёт от спящего вниз, в пещеру бессознательного. По пути желания надевают маски-символы. Сравни явное и скрытое содержание сна.',
    radius: 12.8, phi: 1.0, theta: 0.5, targetY: 0.5, height: 420,
    build: function (c) {
      var T = c.THREE; c.ground(8);
      var bed = c.box3(2.2, 0.5, 1.2, PAPER, [-4.5, 0.25, 0], '<b>Спящий.</b> Во сне цензура ослабевает, и вытесненное поднимается наверх.');
      person(c, -4.5, 0, BLUE, 'Спящий.', null, 0.6, 0.5).rotation.z = Math.PI / 2;
      var pts = []; for (var i = 0; i <= 12; i++) { var u = i / 12; pts.push([-3.4 + u * 7.4, 0.08 - u * 0.02, Math.sin(u * 4) * 1.2]); }
      for (var k = 0; k < 12; k++) c.link(pts[k], pts[k + 1], GOLD, 0.18, '<b>«Сновидение — царская дорога к бессознательному»</b> (Фрейд, «Толкование сновидений», 1899/1900).');
      var cave = c.mesh(new T.SphereGeometry(1.6, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), '#1a1a26', '<b>Бессознательное:</b> вытесненные желания, детские переживания.'); cave.position.set(4.6, 0, 0);
      var masks = [], wishes = [];
      [[-1, ORANGE], [1, PURPLE], [2.6, RED]].forEach(function (m, i) {
        var mk = c.mesh(new T.ConeGeometry(0.4, 0.8, 4), m[1], '<b>Маска-символ.</b> Желание не показывается прямо, а переодевается: <b>сгущение, смещение, символ</b>. Это «явное содержание» сна.'); mk.position.set(m[0], 1.2, Math.sin((m[0] + 3.4) / 7.4 * 4) * 1.2); masks.push(mk);
        var w = glow(c, m[1], 0.25, '<b>Скрытое желание</b> — настоящий смысл сна, который ищет психоаналитик.'); w.position.copy(mk.position); w.visible = false; wishes.push(w);
      });
      c.label('явное → скрытое', [0.5, 2.8, 0], 0.32);
      c.state = { masks: masks, wishes: wishes };
      c.onFrame(function (t) { masks.forEach(function (m, i) { m.rotation.y = t + i; m.position.y = 1.2 + Math.sin(t * 2 + i) * 0.2; }); wishes.forEach(function (w, i) { w.position.y = masks[i].position.y; }); });
    },
    chips: [
      { t: 'Явное', small: 'что снилось', on: function (c) { c.state.masks.forEach(function (m) { m.visible = true; }); c.state.wishes.forEach(function (w) { w.visible = false; }); c.say('<b>Явное содержание</b> — сюжет сна, как мы его помним: странный, запутанный.'); } },
      { t: 'Скрытое', small: 'что значит', on: function (c) { c.state.masks.forEach(function (m) { m.visible = false; }); c.state.wishes.forEach(function (w) { w.visible = true; }); c.say('<b>Скрытое содержание</b> — вытесненное желание, которое сон исполняет в замаскированном виде. Толкование снимает маски.'); } }
    ]
  });

  /* ======================= 7. Психосоматика ======================= */
  reg('fr-body3d', {
    title: 'Болит тело — а причина в психике', lead: 'Человек жалуется на голову и живот. Под полом — корни этих болей: вытесненные переживания. Нажми «Найти корни».',
    radius: 10.4, phi: 1.2, theta: 0.3, targetY: 0.8, height: 420,
    build: function (c) {
      var T = c.THREE;
      var floor = c.mesh(new T.CylinderGeometry(4, 4, 0.1, 32), DARK, 'Граница сознания: то, что под ней, человек о себе не знает.', { transparent: true, opacity: 0.6 }); floor.position.y = 0;
      var me = person(c, 0, 0, BLUE, '<b>Пациент.</b> Лекарства не помогают: «болит тело, но причины — психические».', null, 2.2, 0.05);
      var spots = [[0, 2.55, 0.35, 'голова'], [0, 1.2, 0.5, 'живот'], [0.55, 1.6, 0.2, 'сердце']].map(function (s) { var g = glow(c, RED, 0.18, '<b>Симптом: ' + s[3] + '.</b> Соматический симптом может быть «языком» вытесненного конфликта.'); g.position.set(s[0], s[1], s[2]); return g; });
      var roots = [['детская\nтравма', -2, -2.5], ['вытесненное\nжелание', 0.5, -3.2], ['запрет\nСверх-Я', 2.5, -2.4]].map(function (r) {
        var g = glow(c, PURPLE, 0.35, '<b>' + r[0].replace('\n', ' ') + '.</b> Скрытая причина симптома. Психоанализ помогает её увидеть и <b>прожить заново</b>.'); g.position.set(r[1], r[2], 0); c.label(r[0], [r[1], r[2] - 0.9, 0.4], 0.34);
        var l = c.link([r[1], r[2], 0], [0, 1.2, 0], '#7d5fd0', 0.04, 'Связь симптома с причиной.'); l.visible = false; return { g: g, l: l };
      });
      c.state = { roots: roots };
      c.onFrame(function (t) { spots.forEach(function (s, i) { s.scale.setScalar(1 + 0.4 * Math.abs(Math.sin(t * 3 + i))); }); });
    },
    chips: [
      { t: 'Найти корни', on: function (c) { c.state.roots.forEach(function (r) { r.l.visible = true; }); c.setView(0.3, 1.45, 11, -0.8); c.say('<b>Психоаналитический метод:</b> через беседу, свободные ассоциации и сны дойти до причины. Фрейд начинал как врач — лечил <b>неврозы</b>.'); } },
      { t: 'Только тело', on: function (c) { c.state.roots.forEach(function (r) { r.l.visible = false; }); c.setView(0.3, 1.2, 10.4, 0.8); c.say('Если лечить только тело, симптом вернётся. Лектор: <b>если человек не хочет лечиться, ему никто не поможет</b> — лечение прежде всего работа самого человека.'); } }
    ]
  });
})();
