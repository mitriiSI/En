(function () {
  'use strict';
  var RED = '#e36a69', PURPLE = '#aa8af2', GREEN = '#56bd91', BLUE = '#5d9ef3';
  var ORANGE = '#f28b45', GOLD = '#edba69', GREY = '#8797b6', WOOD = '#976847';

  var scenes = {};
  window.HubStolypin3d = function (name, element) {
    HubScene3d(element, scenes[name]);
  };
  function reg(name, options) {
    scenes[name] = options;
    var element = document.getElementById(name);
    if (element) HubScene3d(element, options);
  }
  function group(c) {
    var object = new c.THREE.Group();
    c.root.add(object);
    return object;
  }
  function into(group, mesh) {
    group.add(mesh);
    return mesh;
  }
  function house(c, x, z, color, info, scale) {
    var T = c.THREE;
    var building = group(c);
    building.position.set(x, 0, z);
    building.scale.setScalar(scale);
    into(building, c.box3(0.94, 0.49, 0.74, color, [0, 0.245, 0], info));
    var profile = new T.Shape();
    profile.moveTo(-0.57, 0); profile.lineTo(0, 0.36);
    profile.lineTo(0.57, 0); profile.closePath();
    var roof = c.mesh(new T.ExtrudeGeometry(profile, { depth: 0.89, bevelEnabled: false }), '#6f4a39', info);
    roof.position.set(0, 0.48, -0.445);
    into(building, roof);
    into(building, c.box3(0.18, 0.30, 0.025, '#5c453b', [0.19, 0.15, 0.38], info));
    into(building, c.box3(0.16, 0.15, 0.027, '#d2e4da', [-0.2, 0.31, 0.381], info));
    return building;
  }

  var convocations = [
    { title: 'I Дума', date: '26 июня 1906', seats: [18, 0, 102, 176, 0, 0, 191] },
    { title: 'II Дума', date: 'февраль — июнь 1907', seats: [65, 37, 104, 98, 44, 10, 160] },
    { title: 'III Дума', date: '1907', seats: [19, 0, 14, 54, 154, 121, 80] }
  ];
  var factions = [
    ['Социал-демократы', RED], ['Эсеры', PURPLE], ['Трудовики', GREEN],
    ['Кадеты', BLUE], ['Октябристы', ORANGE], ['Правые и умеренно правые', GOLD],
    ['Другие депутаты', GREY]
  ];

  reg('rx-duma-convocations3d', {
    title: 'Кто заседал в первых Думах',
    lead: 'Выбери созыв и нажми на сектор. Каждое кресло соответствует одному депутату в учётном срезе. Рассадка условная.',
    radius: 19, phi: 0.81, theta: 0, targetY: 0.1, autorotate: false, height: 365,
    build: function (c) {
      var T = c.THREE;
      var shape = new T.Shape();
      shape.moveTo(0, 0); shape.lineTo(0.19, 0); shape.lineTo(0.19, 0.12);
      shape.lineTo(0.065, 0.12); shape.lineTo(0.065, 0.29); shape.lineTo(0, 0.29); shape.closePath();
      var chair = new T.ExtrudeGeometry(shape, { depth: 0.17, bevelEnabled: false });
      chair.translate(-0.095, 0, -0.085);
      var places = [];
      for (var row = 0; row < 9; row++) {
        var radius = 2.55 + row * 0.62;
        var count = 30 + row * 8;
        var stage = c.mesh(new T.RingGeometry(radius - 0.29, radius + 0.29, 56, 1, 0.10, Math.PI - 0.2), row % 2 ? '#35425e' : '#303b53');
        stage.rotation.x = -Math.PI / 2;
        stage.position.set(0, row * 0.12, 2.55);
        for (var place = 0; place < count; place++) {
          var angle = 0.12 + (Math.PI - 0.24) * (place + 0.5) / count;
          places.push({ angle: angle, radius: radius, height: row * 0.12 + 0.025 });
        }
      }
      places.sort(function (a, b) { return b.angle - a.angle; });
      c.ground(8.6, '#202a3e');
      c.box3(2.05, 0.46, 0.8, WOOD, [0, 0.23, 2.5], 'Условное положение председательского стола.');
      c.label('Председатель', [0, 0.85, 2.5], 0.60);

      var display = factions.map(function (faction) {
        var seats = new T.InstancedMesh(chair, c.mat(faction[1], { roughness: 0.32 }), 518);
        seats.instanceMatrix.setUsage(T.DynamicDrawUsage);
        seats.frustumCulled = false;
        c.root.add(seats);
        return seats;
      });
      var dummy = new T.Object3D();
      c.selectConvocation = function (index) {
        c.pick(null);
        var data = convocations[index];
        var total = data.seats.reduce(function (sum, number) { return sum + number; }, 0);
        var usable = places.filter(function (_, n) {
          return Math.floor((n + 1) * total / places.length) > Math.floor(n * total / places.length);
        });
        var cursor = 0;
        var descriptions = data.seats.map(function (number, factionIndex) {
          var seats = display[factionIndex];
          var faction = factions[factionIndex];
          seats.count = number;
          seats.userData.info = '<b>' + faction[0] + '</b> — ' + number + ' из ' + total + ' депутатов.';
          for (var seat = 0; seat < number; seat++) {
            var p = usable[cursor++];
            dummy.position.set(Math.cos(p.angle) * p.radius, p.height, 2.55 - Math.sin(p.angle) * p.radius);
            dummy.rotation.y = p.angle + Math.PI;
            dummy.updateMatrix();
            seats.setMatrixAt(seat, dummy.matrix);
          }
          seats.instanceMatrix.needsUpdate = true;
          if (seats.computeBoundingSphere) seats.computeBoundingSphere();
          return number ? faction[0] + ' · ' + number : '';
        }).filter(Boolean);
        c.say('<b>' + data.title + '</b> · ' + data.date + ' · ' + total + ' мест<br>' + descriptions.join(' · '));
      };
      c.selectConvocation(0);
    },
    chips: convocations.map(function (data, index) {
      return { t: data.title, small: data.date, on: function (c) { c.selectConvocation(index); } };
    })
  });

  reg('rx-land-strip3d', {
    title: 'Чересполосица, отруб и хутор',
    lead: 'Оранжевым показана земля одного двора. Площадь этих полос одинакова во всех положениях. Размеры условные.',
    radius: 14.5, phi: 0.75, theta: 0.2, targetY: 0.15, autorotate: false, height: 360,
    build: function (c) {
      var T = c.THREE;
      c.ground(7.1, '#263d38');
      var neighboring = 'Соседний участок. В передельной общине полосы одного двора могли находиться в разных полях.';
      [[-3.7, -0.55], [-1.0, 1.28], [1.0, -1.15], [3.5, 1.3]].forEach(function (field, number) {
        c.box3(1.5, 0.055, 3.15, number % 2 ? '#506241' : '#495642', [field[0], 0.03, field[1]], neighboring);
      });
      var strips = [];
      var scattered = [[-4.55, -0.55], [-2.0, 1.28], [1.9, -1.15], [4.38, 1.3]];
      var landInfo = 'Одна из четырёх равновеликих полос двора. Их положение меняется при землеустройстве.';
      scattered.forEach(function (position, index) {
        var strip = group(c);
        strip.position.set(position[0], 0.15, position[1]);
        into(strip, c.box3(0.69, 0.14, 3.15, index % 2 ? '#b87536' : '#d18d41', [0, 0, 0], landInfo));
        for (var furrow = -2; furrow <= 2; furrow++) {
          into(strip, c.box3(0.028, 0.018, 3.05, '#744329', [furrow * 0.117, 0.079, 0], landInfo));
        }
        strips.push(strip);
      });
      c.label('Деревня', [-3.4, 1.15, 3.45], 0.60);
      house(c, -4.0, 3.85, '#87909a', 'Соседний двор в деревне.', 1.05);
      house(c, -3.4, 4.65, '#8d919c', 'Соседний двор в деревне.', 0.83);
      var home = house(c, -2.65, 3.75, '#dfab63', 'Дом семьи. При выделе на хутор его переносят на отдельный участок.', 1.12);
      var estate = c.mesh(new T.CylinderGeometry(0.74, 0.74, 0.06, 24), '#7e6948');
      estate.position.y = 0.033;
      var slider = document.createElement('input');
      slider.type = 'range'; slider.min = '0'; slider.max = '2'; slider.step = '0.01'; slider.value = '0';
      slider.style.width = 'min(100%, 27ch)';
      slider.setAttribute('aria-label', 'Переход от чересполосицы к отрубу и хутору');
      var control = document.createElement('label');
      control.className = 'wg-lead'; control.style.display = 'grid';
      control.appendChild(document.createTextNode('Переход между формами землепользования'));
      control.appendChild(slider);
      c.out.before(control);
      var goal = 0, stage = 0, label = -1;
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var descriptions = [
        '<b>Чересполосица.</b> Четыре полосы лежат в разных местах. Семья живёт в деревне.',
        '<b>Отруб.</b> Земля собрана в единый участок. Семья продолжает жить в деревне.',
        '<b>Хутор.</b> Дом и хозяйство перенесены на отдельный земельный участок.'
      ];
      c.selectLand = function (next) { goal = next; slider.value = String(next); };
      slider.addEventListener('input', function () { goal = stage = Number(slider.value); });
      c.onFrame(function () {
        stage = reduce || Math.abs(goal - stage) < 0.004 ? goal : stage + (goal - stage) * 0.09;
        var consolidate = Math.min(stage, 1), move = Math.max(0, stage - 1);
        strips.forEach(function (strip, index) {
          strip.position.x = T.MathUtils.lerp(scattered[index][0], 0.95 + index * 0.69, consolidate);
          strip.position.z = T.MathUtils.lerp(scattered[index][1], 0.15, consolidate);
          strip.position.y = 0.15 + Math.sin(consolidate * Math.PI) * (0.45 + index * 0.1);
        });
        home.position.x = T.MathUtils.lerp(-2.65, 2.0, move);
        home.position.z = T.MathUtils.lerp(3.75, 1.04, move);
        estate.position.x = home.position.x;
        estate.position.z = home.position.z;
        if (label !== Math.round(stage)) {
          label = Math.round(stage);
          c.say(descriptions[label]);
          slider.setAttribute('aria-valuetext', ['Чересполосица', 'Отруб', 'Хутор'][label]);
        }
      });
    },
    chips: ['Чересполосица', 'Отруб', 'Хутор'].map(function (name, index) {
      return { t: name, on: function (c) { c.selectLand(index); } };
    })
  });
})();
