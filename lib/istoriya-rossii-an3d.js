/* Дополнительные 3D-модели: История России. Александр I и Николай I (лекция 21.10).
   @@graph:ru-caucasus3d@@ @@graph:ru-catchup3d@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  var S = window.HubScene3d, add = window.HubWidgets.add;
  var BLUE = '#5b8def', RED = '#e0645a', GOLD = '#f0c36b', GREEN = '#4cc38a', GREY = '#8b93b5', PURPLE = '#a78bfa', STONE = '#d9d4c7';

  /* ============ Кавказская война: горы + полоса трёх царствований ============ */
  add('ru-caucasus3d', function (box) {
    var flag, banner;
    S(box, {
      title: 'Кавказская война 1817–1864', lead: 'Почти 50 лет и три императора. Нажимай на горы, полосу царствований и аул Гуниб.',
      radius: 20, phi: 0.95, theta: 0.5, targetY: 0.8,
      hint: 'Война началась при <b>Александре I</b>, шла <b>всё правление Николая I</b> и закончилась при <b>Александре II</b>.',
      build: function (c) {
        var T = c.THREE;
        var land = c.mesh(new T.BoxGeometry(22, 0.3, 10), '#5b6b48'); land.position.y = -0.15; land.receiveShadow = true;
        var peaks = [[-6, 3.2], [-3.5, 4.2], [-1, 3.6], [1.5, 4.8], [4, 3.9], [6.5, 3.1], [-8, 2.4], [8.5, 2.6]];
        peaks.forEach(function (p, i) {
          var m = c.mesh(new T.ConeGeometry(1.6 + (i % 3) * 0.3, p[1], 7), i % 2 ? '#7b6f63' : '#6c6157',
            '<b>Горы Северного Кавказа.</b> Горцы воевали малыми отрядами, знали каждую тропу — регулярной армии было трудно победить быстро.');
          m.position.set(p[0], p[1] / 2, -2.2 + (i % 2) * 0.8);
          var cap = c.mesh(new T.ConeGeometry(0.55, 0.9, 7), '#f4f4f4'); cap.position.set(p[0], p[1] - 0.4, -2.2 + (i % 2) * 0.8);
        });
        // полоса царствований
        var X = function (y) { return (y - 1840.5) * 0.42; };
        function seg(a, b, color, name, info) {
          c.box3(X(b) - X(a), 0.3, 0.9, color, [(X(a) + X(b)) / 2, 0.15, 3], info);
          c.label(name, [(X(a) + X(b)) / 2, 1.1, 3], 0.75);
        }
        seg(1817, 1825, BLUE, 'Александр I', '<b>Александр I</b> (до 1825): война начинается — генерал Ермолов строит крепости и продвигается в горы.');
        seg(1825, 1855, RED, 'Николай I', '<b>Николай I</b> (1825–1855): вся его эпоха — время войны. Шамиль создаёт своё государство — имамат.');
        seg(1855, 1864, GREEN, 'Александр II', '<b>Александр II</b>: в 1859 г. Шамиль сдаётся в ауле Гуниб, в 1864 г. война окончена.');
        [1817, 1834, 1859, 1864].forEach(function (y) { c.label(String(y), [X(y), 0.5, 4.2], 0.6); });
        // аул Гуниб
        var aul = new T.Group(); c.root.add(aul);
        for (var k = 0; k < 6; k++) { var h = 0.35 + (k % 3) * 0.15, b = c.mesh(new T.BoxGeometry(0.45, h, 0.45), STONE, '<b>Аул Гуниб</b> — здесь в 1859 г. Шамиль сдался князю Барятинскому.'); b.position.set(X(1859) + (k % 3 - 1) * 0.5, 1.6 + h / 2 + Math.floor(k / 3) * 0.1, -0.6 + Math.floor(k / 3) * 0.5); aul.add(b); }
        var rock = c.mesh(new T.CylinderGeometry(1.1, 1.5, 1.6, 8), '#7b6f63'); rock.position.set(X(1859), 0.8, -0.35);
        c.label('Гуниб', [X(1859), 3.0, -0.4], 0.65);
        // знамя газавата
        banner = new T.Group(); c.root.add(banner);
        var pole = c.mesh(new T.CylinderGeometry(0.05, 0.05, 2.4, 6), '#3a2c22'); pole.position.set(X(1834), 1.2, 1); banner.add(pole);
        flag = c.mesh(new T.BoxGeometry(1.0, 0.6, 0.04), '#2f8f4e', '<b>Газават</b> — священная война за веру. Имам Шамиль (глава имамата с 1834 г.) объединил горские общины не только оружием, но и религией.');
        flag.position.set(X(1834) + 0.5, 2.1, 1); banner.add(flag);
        c.label('Шамиль · газават', [X(1834), 3.1, 1], 0.65);
        c.onFrame(function (t) { flag.rotation.y = Math.sin(t * 2) * 0.25; flag.scale.x = 1 + Math.sin(t * 3) * 0.05; });
      },
      chips: [
        { t: '1817', small: 'начало', on: function (c) { c.setView(0.3, 0.9, 12, 1, X0(1817), 0); c.say('<b>1817:</b> начало войны при Александре I. Россия закрепляется на Кавказе после войн с Персией и Турцией.'); } },
        { t: 'Шамиль', small: 'газават', on: function (c) { c.setView(0.6, 0.85, 10, 1.5, X0(1834), 0); c.say('<b>Имам Шамиль</b> объявил газават и создал собственное течение в исламе. Война шла все 30 лет правления Николая I.'); } },
        { t: '1859', small: 'Гуниб', on: function (c) { c.setView(0.9, 0.8, 9, 1.5, X0(1859), 0); c.say('<b>1859:</b> Шамиль сдаётся в ауле Гуниб. Его встретили с почётом и поселили в Калуге.'); } },
        { t: '1864', small: 'конец', on: function (c) { c.setView(0.6, 1.0, 19, 0.5, 0, 0); c.say('<b>1864:</b> война окончена — почти <b>50 лет</b> и три царствования.'); } }
      ]
    });
    function X0(y) { return (y - 1840.5) * 0.42; }
  });

  /* ============ Опоздавшая модернизация: лидер и догоняющий ============ */
  add('ru-catchup3d', function (box) {
    var leader, russia, mode = 'both';
    S(box, {
      title: 'Опоздавшая модернизация', lead: 'Две лестницы. Европа сама строит новые ступени (инновации). Россия поднимается по ступеням, которые Европа уже прошла.',
      radius: 14, phi: 0.9, theta: 0.6, targetY: 1.5,
      hint: 'Лектор: решения николаевской эпохи <b>предлагались ещё в 1760–1770-е</b>. Это «решения позавчерашнего дня».',
      build: function (c) {
        var T = c.THREE;
        var floor = c.mesh(new T.BoxGeometry(14, 0.2, 9), '#3b4152'); floor.position.y = -0.1; floor.receiveShadow = true;
        var EU = ['мануфактуры', 'паровая машина', 'железные дороги', 'фабрики', 'конституции'];
        var RU = ['идеи 1760-х', 'уложение', 'финансы Канкрина', 'железные дороги', 'реформы 1860-х'];
        // Европа: ступени вдоль X
        for (var e = 0; e < 5; e++) {
          c.box3(1.6, 0.6 * (e + 1), 1.4, BLUE, [-4 + e * 1.7, 0.3 * (e + 1), -2.6], '<b>Европа:</b> ' + EU[e] + '. Лидер сам создаёт новое — <b>инновации</b>.');
          c.label(EU[e], [-4 + e * 1.7, 0.6 * (e + 1) + 0.55, -2.6], 0.48);
        }
        for (var r = 0; r < 5; r++) {
          c.box3(1.6, 0.6 * (r + 1), 1.4, RED, [-4 + r * 1.7, 0.3 * (r + 1), 2.6], '<b>Россия:</b> ' + RU[r] + '. Перенимает то, что у лидера уже есть, — <b>догоняющая модернизация</b>.');
          c.label(RU[r], [-4 + r * 1.7, 0.6 * (r + 1) + 0.55, 2.6], 0.48);
        }
        c.label('Европа — лидер', [-6.2, 1.4, -2.6], 0.7);
        c.label('Россия — догоняет', [-6.2, 1.4, 2.6], 0.7);
        function walker(color) { var g = new T.Group(); c.root.add(g); var b = c.mesh(new T.CylinderGeometry(0.18, 0.22, 0.7, 10), color); b.position.y = 0.35; g.add(b); var h = c.mesh(new T.SphereGeometry(0.2, 12, 10), '#f1d2b6'); h.position.y = 0.9; g.add(h); return g; }
        leader = walker(BLUE); russia = walker(RED);
        c.onFrame(function (t) {
          var u = (t % 10) / 10;
          var le = Math.min(4, Math.floor(u * 7)), re = Math.max(0, Math.min(4, Math.floor(u * 7) - 2));
          leader.position.set(-4 + le * 1.7, 0.6 * (le + 1), -2.6);
          russia.position.set(-4 + re * 1.7, 0.6 * (re + 1), 2.6);
          leader.visible = mode !== 'ru'; russia.visible = mode !== 'eu';
        });
      },
      chips: [
        { t: 'Лидер', small: 'инновации', on: function (c) { mode = 'eu'; c.setView(0.3, 0.9, 12, 1.5, 0, -2); c.say('Страна-лидер сама изобретает новое: ей не на кого равняться.'); } },
        { t: 'Догоняющий', small: 'модернизация', on: function (c) { mode = 'ru'; c.setView(1.2, 0.9, 12, 1.5, 0, 2); c.say('Россия внедряет то, что у Европы уже есть: выставки, машины, железные дороги, финансовую реформу.'); } },
        { t: 'Разрыв', small: 'почему не догнали', on: function (c) { mode = 'both'; c.setView(0.75, 0.9, 16, 1.5, 0, 0); c.say('Пока Россия поднимается на ступень, лидер уже на следующей. Решения XVIII века воплощаются в XIX — <b>разрыв не сокращается</b>. Его покажет Крымская война.'); } }
      ]
    });
  });
})();
