/* Дополнительные 3D-модели: «Теория управления. Лекция 4». Помощники — lib/upravlenie3d-common.js. */
(function () {
  'use strict';
  if (!window.TU3) return;
  var U = window.TU3, reg = U.reg;

  /* ---------- 1. Винер: ракета с обратной связью ---------- */
  reg('tu4-rocket', {
    title: 'Винер: самонаводящаяся ракета', lead: 'Цель движется. Ракета постоянно сравнивает, где она есть и где цель, и поправляет курс — это обратная связь. Выключи её и посмотри, куда полетит ракета.',
    radius: 14, phi: 1.1, targetY: 2.5, theta: 0.1,
    build: function (c) {
      var T = c.THREE, S = c.state = { fb: 1, p: new T.Vector3(-8, 2, 0), v: new T.Vector3(1, 0, 0), t0: 0, last: 0 };
      var tgt = c.mesh(new T.TorusGeometry(0.7, 0.18, 10, 30), '#ef6b5b', '<b>Цель</b> — желаемое состояние. Она движется: среда меняется.');
      var rk = new T.Group(); rk.scale.setScalar(1.8); c.root.add(rk);
      var body = new T.Mesh(new T.CylinderGeometry(0.2, 0.25, 1.4, 12), c.mat('#e8e8e8')); body.rotation.z = -Math.PI / 2; rk.add(body);
      var nose = new T.Mesh(new T.ConeGeometry(0.2, 0.5, 12), c.mat('#7aa2ff')); nose.rotation.z = -Math.PI / 2; nose.position.x = 0.95; rk.add(nose);
      body.userData.info = '<b>Ракета</b>: сама сравнивает своё положение с положением цели и корректирует курс.';
      var trail = []; for (var i = 0; i < 40; i++) { var d = c.mesh(new T.SphereGeometry(0.1, 6, 4), '#f0c36b'); trail.push(d); }
      var ti = 0;
      c.onFrame(function (t) {
        var dt = Math.min(0.05, t - S.last); S.last = t;
        var tp = new T.Vector3(6 + Math.sin(t * 0.7) * 1.5, 2.5 + Math.sin(t * 1.1) * 1.5, Math.cos(t * 0.6) * 3); tgt.position.copy(tp); tgt.rotation.y = t;
        if (S.fb) { var want = tp.clone().sub(S.p).normalize(); S.v.lerp(want, 0.06).normalize(); }
        S.p.addScaledVector(S.v, dt * 5);
        if (S.p.distanceTo(tp) < 0.8 || S.p.length() > 16) { S.p.set(-8, 2, 0); S.v.set(1, 0.05, 0.1).normalize(); }
        rk.position.copy(S.p); rk.quaternion.setFromUnitVectors(new T.Vector3(1, 0, 0), S.v);
        ti = (ti + 1) % trail.length; trail[ti].position.copy(S.p);
      });
    },
    chips: [
      { t: 'С обратной связью', on: function (c) { c.state.fb = 1; c.say('Ракета каждый миг получает информацию о цели и поправляет курс — попадает, даже если цель движется.'); } },
      { t: 'Без обратной связи', on: function (c) { c.state.fb = 0; c.say('Курс задали один раз и больше не проверяют — ракета пролетает мимо. Так и организация, которая не слушает сигналы среды.'); } }
    ]
  });

  /* ---------- 2. Вуз как открытая сложная система ---------- */
  reg('tu4-university', {
    title: 'Вуз как система подсистем', lead: 'Четыре подсистемы вуза связаны между собой. Нажми «Сорвать расписание» — сбой одной подсистемы раскачает все остальные.',
    radius: 17, phi: 1.05, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { broken: 0 };
      c.mesh(new T.CylinderGeometry(1.4, 1.4, 0.6, 32), '#f0c36b', '<b>Вуз</b> — открытая сложная система.').position.y = 0.3;
      var P = [['кадровая', 'преподаватели', '#7aa2ff'], ['финансовая', 'бюджет', '#4cc38a'], ['информационная', 'сайт, расписание', '#ef6b5b'], ['культурная', 'традиции, студжизнь', '#c9b6f0']];
      c.subs = P.map(function (p, i) {
        var a = i / 4 * Math.PI * 2 + 0.78, x = Math.sin(a) * 4.5, z = Math.cos(a) * 4.5;
        var m = c.box3(1.8, 1.8, 1.8, p[2], [x, 1, z], '<b>' + p[0] + ' подсистема</b>: ' + p[1] + '.');
        m.userData.base = [x, 1, z];
        c.label(p[0], [x, 2.6, z], 0.45, p[2]);
        U.link(c, [x * 0.7, 0.8, z * 0.7], [x * 0.3, 0.5, z * 0.3], '#9aa2c0', 0.06);
        return m;
      });
      for (var i = 0; i < 4; i++) { var a = c.subs[i].userData.base, b = c.subs[(i + 1) % 4].userData.base; U.link(c, a, b, '#9aa2c0', 0.04); }
      c.onFrame(function (t) {
        c.subs.forEach(function (m, i) {
          var hit = S.broken && (i === 2 || t % 3 > i * 0.6), amp = S.broken ? (i === 2 ? 0.25 : 0.1) : 0;
          m.position.x = m.userData.base[0] + Math.sin(t * 20 + i) * amp; m.rotation.z = Math.sin(t * 13 + i) * amp * 0.5;
          if (m.material.emissive) m.material.emissive.setRGB(S.broken && hit ? 0.35 : 0, 0, 0);
        });
      });
    },
    chips: [
      { t: 'Норма', on: function (c) { c.state.broken = 0; c.say('Подсистемы работают согласованно — вуз функционирует как целое.'); } },
      { t: 'Сорвать расписание', on: function (c) { c.state.broken = 1; c.say('Сломалась информационная подсистема (расписание) — страдают все: преподаватели не знают пар, деньги тратятся впустую, студенты недовольны. В системе <b>нет независимых частей</b>.'); } }
    ]
  });

  /* ---------- 3. Уровни управляющей подсистемы и три потока ---------- */
  reg('tu4-levels', {
    title: 'Кто управляет и чем обмениваются', lead: 'Слева — уровни управляющей подсистемы. Справа — управляемая. Между ними три потока: информация (синий), ресурсы (жёлтый), координация процессов (зелёный).',
    radius: 20, phi: 1.05, targetY: 3,
    build: function (c) {
      var T = c.THREE;
      var L = [['Руководство', 'стратегические решения', 2.2, '#f0c36b'], ['Среднее звено', 'тактика, координация подразделений', 3.4, '#7aa2ff'], ['Линейные руководители', 'оперативное управление отделами', 4.6, '#5b7fd9']];
      L.forEach(function (l, i) { var y = 6 - i * 1.6; c.box3(l[2], 1.1, 2, l[3], [-4, y, 0], '<b>' + l[0] + '</b>: ' + l[1] + '.'); c.label(l[0], [-4, y + 0.9, 1.2], 0.4, l[3]); });
      c.box3(1.6, 1, 1.6, '#c9b6f0', [-7.2, 2, 1.8], '<b>Руководители проектов</b>.'); c.label('проекты', [-7.2, 2.9, 1.8], 0.4, '#c9b6f0');
      c.box3(1.6, 1, 1.6, '#9aa2c0', [-1, 2, 1.8], '<b>Службы поддержки</b>: информационное, техническое, кадровое сопровождение.'); c.label('службы', [-1, 2.9, 1.8], 0.4);
      c.box3(5, 3, 3, '#4cc38a', [5, 1.5, 0], '<b>Управляемая подсистема</b>: преобразует ресурсы в результат.'); c.label('управляемая', [5, 3.6, 0], 0.5, '#4cc38a');
      var F = [['#7aa2ff', 4.6, 'Информационный поток: данные и отчёты.'], ['#f0c36b', 3.2, 'Ресурсный поток: материалы и деньги.'], ['#4cc38a', 1.8, 'Процессуальный поток: координация задач между подразделениями.']];
      F.forEach(function (f, i) {
        var cv = U.curve(c, [[-1.6, f[1], -0.6 + i * 0.6], [0.8, f[1] + 0.4, -0.6 + i * 0.6], [2.5, f[1] - 1.5, -0.6 + i * 0.6]]);
        U.tube(c, cv.points.map(function (p) { return [p.x, p.y, p.z]; }), f[0], 0.05, false, '<b>' + f[2] + '</b>');
        U.movers(c, cv, f[0], 0.2 + i * 0.05, 3, 0.15);
      });
    },
    hint: 'Функции управляющей подсистемы: планирование, организация, мотивация, контроль.'
  });

  /* ---------- 4. Саймон: ограниченная рациональность ---------- */
  reg('tu4-simon', {
    title: 'Саймон: «достаточно хороший» выбор', lead: 'Столбики — 30 вариантов решения, высота — их качество (скрыто, пока не проверишь). Человек проверяет варианты по одному и останавливается на первом «достаточно хорошем».',
    radius: 19, phi: 1.0, targetY: 1.5,
    build: function (c) {
      var T = c.THREE, S = c.state = { mode: 0, i: 0, acc: 0, last: 0, stop: -1 };
      var Q = []; for (var k = 0; k < 30; k++) Q.push(0.6 + ((k * 37) % 23) / 23 * 3.4);
      Q[24] = 4.6;
      c.bars = Q.map(function (q, k) {
        var x = -7.5 + (k % 10) * 1.65, z = -2 + Math.floor(k / 10) * 2;
        var m = c.box3(1, q, 1, '#3a4270', [x, q / 2, z], 'Вариант ' + (k + 1) + '. Качество: ' + q.toFixed(1)); m.userData.q = q; return m;
      });
      var bar = c.box3(17, 0.05, 6.5, '#f0c36b', [0, 3, 0], '<b>Порог «достаточно хорошо»</b>.'); bar.material.transparent = true; bar.material.opacity = 0.18;
      c.label('порог «достаточно хорошо»', [0, 3.5, 3.5], 0.45, '#f0c36b');
      var eye = U.glow(c, '#ffffff', 0.3);
      c.onFrame(function (t) {
        var dt = Math.min(0.1, t - S.last); S.last = t; S.acc += dt;
        if (S.acc > 0.35) {
          S.acc = 0;
          if (S.stop < 0) {
            var m = c.bars[S.i]; m.material.color.set(m.userData.q >= 3 ? '#4cc38a' : '#7aa2ff');
            if (S.mode === 0 && m.userData.q >= 3) S.stop = S.i;
            S.i++; if (S.i >= c.bars.length) S.stop = 24;
          } else { S.hold = (S.hold || 0) + 1; if (S.hold > 10) { S.hold = 0; S.i = 0; S.stop = -1; c.bars.forEach(function (b) { b.material.color.set('#3a4270'); }); } }
        }
        var cur = c.bars[Math.min(S.stop >= 0 ? S.stop : S.i, 29)];
        eye.position.set(cur.position.x, cur.userData.q + 0.6, cur.position.z);
        if (S.stop === 24 && S.mode) c.bars[24].material.color.set('#f0c36b');
      });
    },
    chips: [
      { t: 'Человек', small: 'ограниченная рациональность', on: function (c) { var s = c.state; s.mode = 0; s.i = 0; s.stop = -1; c.bars.forEach(function (b) { b.material.color.set('#3a4270'); }); c.say('Человек не может перебрать всё: время и внимание ограничены. Он берёт <b>первый вариант выше порога</b>. Нобелевская премия Саймона — 1978.'); } },
      { t: 'Идеальный расчёт', small: 'перебрать всё', on: function (c) { var s = c.state; s.mode = 1; s.i = 0; s.stop = -1; c.bars.forEach(function (b) { b.material.color.set('#3a4270'); }); c.say('«Экономический человек» перебрал бы все 30 вариантов и нашёл лучший (жёлтый). В жизни на это нет ни времени, ни информации.'); } }
    ]
  });

  /* ---------- 5. Связи ограничивают свободу: оркестр ---------- */
  reg('tu4-orchestra', {
    title: 'Оркестр: связи ограничивают свободу', lead: 'Музыканты-шарики. Поодиночке каждый прыгает в своём ритме. В оркестре все подчиняются дирижёру и общему темпу — свободы меньше, зато получается симфония.',
    radius: 17, phi: 1.0, targetY: 1,
    build: function (c) {
      var T = c.THREE, S = c.state = { band: 0 };
      var cols = ['#7aa2ff', '#4cc38a', '#f0c36b', '#ff8f66', '#c9b6f0', '#ef6b5b'];
      c.m = [];
      for (var r = 0; r < 3; r++) for (var k = 0; k < 6; k++) {
        var a = -1.1 + k * 0.44, R = 3 + r * 1.6, s = c.mesh(new T.SphereGeometry(0.35, 16, 12), cols[k], 'Музыкант. В оркестре играет только свою партию и в общем темпе.');
        s.userData.home = [Math.sin(a) * R, 0.4, Math.cos(a) * R - 4]; s.userData.ph = Math.random() * 6; s.userData.f = 1 + Math.random() * 2; c.m.push(s);
      }
      var cond = c.mesh(new T.CapsuleGeometry(0.35, 0.9, 4, 10), '#ffffff', '<b>Дирижёр</b> — управляющая подсистема: задаёт общий темп и координирует.'); cond.position.set(0, 0.8, -5.5);
      var baton = c.mesh(new T.CylinderGeometry(0.03, 0.03, 1.2, 6), '#ddd'); baton.position.set(0.5, 1.6, -5.5);
      c.onFrame(function (t) {
        cond.visible = baton.visible = !!S.band; baton.rotation.z = Math.sin(t * 4) * 0.8;
        c.m.forEach(function (s, i) {
          var h = s.userData.home, y;
          if (S.band) { y = 0.4 + Math.abs(Math.sin(t * 4)) * 0.8; s.position.set(h[0], y, h[2]); }
          else { s.position.set(h[0] + Math.sin(t * s.userData.f + s.userData.ph) * 0.8, 0.4 + Math.abs(Math.sin(t * s.userData.f * 2 + s.userData.ph)) * 1.4, h[2] + Math.cos(t * s.userData.f * 0.7 + s.userData.ph) * 0.8); }
        });
      });
    },
    chips: [
      { t: 'Каждый сам', small: 'полная свобода', on: function (c) { c.state.band = 0; c.say('Каждый свободен, но вместе выходит шум.'); } },
      { t: 'Оркестр', small: 'связи и дирижёр', on: function (c) { c.state.band = 1; c.say('Связи <b>ограничивают степень свободы</b> элементов — зато система умеет то, чего не может ни один элемент в одиночку.'); } }
    ]
  });
})();
