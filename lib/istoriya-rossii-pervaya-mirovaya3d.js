(function () {
  'use strict';
  const blue = '#70a9ee';
  const orange = '#ffab5f';
  const slate = '#778898';
  const dark = '#324755';

  const waters = [
    ['Чёрное море', 'С этого моря начинается показанный путь к Средиземному морю.', [1.65, 0, -4.3], 1.65, 0.95],
    ['Босфор', 'Босфор соединяет Чёрное и Мраморное моря. У южного выхода находится Константинополь.', [1.0, 0, -2.55], .36, 1.2],
    ['Мраморное море', 'Между Босфором и Дарданеллами лежит Мраморное море.', [.2, 0, -.72], 1.7, 1.03],
    ['Дарданеллы', 'Дарданеллы соединяют Мраморное и Эгейское моря.', [-1.35, 0, 1.0], .36, 1.13],
    ['Эгейское море', 'Из Эгейского моря путь продолжается в Средиземное море.', [-2.1, 0, 3.05], 1.85, 1.16]
  ];

  function mapLand(c, points, info) {
    const shape = new c.THREE.Shape();
    points.forEach(([x, z], index) => shape[index ? 'lineTo' : 'moveTo'](x, -z));
    shape.closePath();
    const shore = c.mesh(new c.THREE.ExtrudeGeometry(shape, { depth: .28, bevelEnabled: false }), slate, info);
    shore.rotation.x = -Math.PI / 2;
    shore.position.y = -.24;
  }

  function straits(c) {
    const T = c.THREE;
    c.box3(11, .2, 10.4, dark, [0, -.36, 0]);
    mapLand(c, [[-5,-5],[.1,-5],[-.2,-3.6],[.63,-2.7],[.56,-1.7],[-.87,-1.67],[-1.48,-.8],[-1.36,.25],[-1.87,1.31],[-2.57,1.7],[-3.15,2.03],[-3.96,2.98],[-5,3.05]], 'Европейская сторона. Подписанные моря и проливы образуют один морской путь.');
    mapLand(c, [[4.8,-5],[4.8,4.8],[-.45,4.8],[-.51,3.13],[-1.18,2.4],[-1.41,1.63],[-.88,.81],[-.49,.36],[.85,.41],[1.79,-.43],[1.9,-1.37],[1.32,-1.94],[1.25,-2.83],[1.9,-3.56],[3.12,-3.75],[3.4,-5]], 'Малоазийская сторона. Босфор и Дарданеллы отделяют её от европейского берега.');
    const path = new T.CatmullRomCurve3(waters.map((entry) => new T.Vector3(entry[2][0], .19, entry[2][2])));
    c.mesh(new T.TubeGeometry(path, 32, .045, 6, false), orange, 'Путь из Чёрного моря в Эгейское через Босфор и Дарданеллы.');
    const end = path.getPoint(1);
    const arrow = c.mesh(new T.ConeGeometry(.14, .38, 12), orange);
    arrow.position.copy(end);
    arrow.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), path.getTangent(1));
    const landmark = c.mesh(new T.CylinderGeometry(.15, .23, .36, 12), orange, 'Константинополь. На европейской стороне южного выхода из Босфора.');
    landmark.position.set(.21, .24, -1.82);
    c.label('Константинополь', [-1.4,.68,-2.05], .47, orange);
    const offsets = [[.15,0],[1.33,-.48],[2.45,.4],[2.65,.65],[-.05,.28]];
    const markers = waters.map(([name, explanation, [x, ,z], width, length], index) => {
      const marker = c.mesh(new T.CylinderGeometry(1, 1, .065, 20), blue, explanation);
      marker.scale.set(width, 1, length);
      marker.position.set(x, .02, z);
      const [dx, dz] = offsets[index];
      c.label(name, [x + dx, .58, z + dz], .52);
      return marker;
    });
    c.select = (index) => {
      markers.forEach((marker, i) => marker.material.color.set(i === index ? '#8abfff' : blue));
      c.pick(markers[index]);
    };
  }

  const spending = [
    ['Австро-Венгрия', 3.5, 12.0], ['Франция', 3.7, 25.9],
    ['Германия', 2.6, 54.1], ['Италия', 2.8, 21.7], ['Россия', 3.9, 27.9],
    ['Великобритания', 2.6, 37.5], ['Япония', 5.0, 32.2], ['США', .7, 29.4]
  ];
  const percent = (value) => value.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function bars(c) {
    const T = c.THREE;
    c.box3(10, .18, 4.3, dark, [0, -.09, 0]);
    const pairs = spending.map(([name], index) => {
      const x = (index % 4 - 1.5) * 2.3;
      const z = index < 4 ? -1.22 : .83;
      const bar = c.mesh(new T.CylinderGeometry(.27, .27, 1, 24), blue);
      const nameLabel = c.label(name.replace('Австро-Венгрия', 'Австро-\nВенгрия').replace('Великобритания', 'Велико-\nбритания'), [x,.25,z+.78], .43);
      nameLabel.renderOrder = 12;
      return { name, x, z, bar, valueLabel: null };
    });
    const grid = [1, 2, 3, 4].map((index) => {
      c.box3(9.2, .018, .025, slate, [0, index * .9, -1.93]);
      return c.label('', [-4.75,index*.9,-1.93], .29);
    });
    function update(budget) {
      const column = budget ? 2 : 1;
      const unit = budget ? 15 : 1.5;
      grid.forEach((label, i) => {
        c.root.remove(label);
        label.material.map.dispose();
        label.material.dispose();
        grid[i] = c.label(`${(i + 1) * unit}%`, [-4.75,(i + 1)*.9,-1.93], .37);
      });
      pairs.forEach(({ name, x, z, bar, valueLabel }, i) => {
        const value = spending[i][column];
        const height = value * .9 / unit;
        const unitLabel = budget ? 'расходов правительства' : 'ВВП';
        bar.scale.y = height;
        bar.position.set(x, height / 2, z);
        bar.material.color.set(budget ? orange : blue);
        bar.userData.info = `${name} — ${percent(value)}% ${unitLabel}. Средняя доля за 1870–1913 годы.`;
        if (valueLabel) {
          c.root.remove(valueLabel);
          valueLabel.material.map.dispose();
          valueLabel.material.dispose();
        }
        pairs[i].valueLabel = c.label(`${percent(value)}%`, [x,height+.24,z], .45);
      });
      c.say(budget ? 'Россия — 27,9%, Германия — 54,1% расходов правительства. Делим военные расходы на расходы правительства.' : 'Россия — 3,9%, Германия — 2,6% ВВП. Делим военные расходы на ВВП. При смене показателя меняется шкала: сравнивай подписи.');
    }
    c.select = update;
    update(false);
    c.out.closest('.wg').querySelector('.wg-3d').setAttribute('aria-label', 'Диаграмма военных расходов. Высота столбцов пропорциональна выбранному проценту. Точные числа приведены в таблице перед моделью.');
  }

  function institutions(c) {
    const T = c.THREE;
    const nodes = [
      ['Комитет Думы', -3.2, -1.7, slate, 'Временный комитет Думы участвовал в переговорах о создании правительства.'],
      ['Петросовет', 3.2, -1.7, blue, 'Совет рабочих и солдатских депутатов опирался на представителей заводов и частей гарнизона.'],
      ['Временное\nправительство', -3.2, 1.75, orange, 'Временное правительство во главе с Г. Е. Львовым осуществляло центральное управление.'],
      ['Гарнизон', 3.2, 1.75, slate, 'Переход частей гарнизона на сторону восстания изменил расстановку сил в столице.']
    ];
    c.box3(10, .24, 6.2, dark, [0,-.12,0]);
    nodes.forEach(([name,x,z,color,info]) => {
      const base = c.mesh(new T.CylinderGeometry(1.02, 1.17, .32, 6), color, info);
      base.position.set(x, .16, z);
      c.label(name, [x,.96,z], .56);
    });
    const lines = [
      [0,1,'Комитет и руководство Совета согласовывали условия создания правительства.'],
      [0,2,'Думский комитет участвовал в формировании кабинета Львова.'],
      [1,2,'Петросовет участвовал в согласовании программы правительства.'],
      [1,3,'Солдатские депутаты представляли гарнизон. Приказ № 1 закрепил выборы солдатских комитетов.']
    ].map(([from,to,info]) => c.link([nodes[from][1],.26,nodes[from][2]], [nodes[to][1],.26,nodes[to][2]], slate,.08,info));
    const stages = [
      [[0,3], '27 февраля (12 марта). Возникли Комитет Думы и Петросовет. Части гарнизона перешли на сторону восстания.'],
      [[3], '1 (14) марта. Приказ № 1 определял, как приказы Военной комиссии Думы соотносятся с решениями Петросовета, и предусматривал выборные комитеты.'],
      [[1,2,3], '2 (15) марта. Появился кабинет Львова. Совет сохранил самостоятельное влияние на гарнизон.']
    ];
    c.select = (stage) => {
      const [active, explanation] = stages[stage];
      lines.forEach((line, index) => {
        const selected = active.includes(index);
        line.material.color.set(selected ? orange : slate);
        line.scale.set(selected ? 1.7 : .66, 1, selected ? 1.7 : .66);
      });
      c.say(explanation);
    };
    c.select(0);
  }

  const models = {
    'ru-ww1-straits3d': {
      title: 'Модель 1. Путь через черноморские проливы',
      lead: '[ДОБАВЛЕНО] Географическая схема, берега и расстояния условны. Синий — акватория, оранжевый — путь и Константинополь, серый — суша.',
      radius: 17, targetY: 0, phi: .63, theta: -.24,
      hint: 'Выбери участок маршрута, чтобы увидеть, что он соединяет.',
      build: straits,
      chips: waters.map(([name], index) => ({ t: name, on: (c) => c.select(index) }))
    },
    'ru-ww1-spending3d': {
      title: 'Модель 2. Две доли военных расходов',
      lead: 'Данные со слайда. Высота — проценты. Синий — доля ВВП, оранжевый — доля расходов правительства.',
      radius: 16.5, targetY: 1.4, phi: .83, theta: .22,
      build: bars,
      chips: [{ t: '% ВВП', on: (c) => c.select(false) }, { t: '% расходов правительства', on: (c) => c.select(true) }]
    },
    'ru-ww1-power3d': {
      title: 'Модель 3. Как возникло двоевластие',
      lead: '[ДОБАВЛЕНО] Связи органов и гарнизона по датам. Синий — Петросовет, оранжевый — правительство и связи выбранного этапа, серый — остальные узлы и связи.',
      radius: 15, targetY: .6, phi: .66, theta: -.12,
      build: institutions,
      chips: ['27 февраля', '1 марта', '2 марта'].map((date, index) => ({ t: date, on: (c) => c.select(index) }))
    }
  };

  window.HubRussiaWW1 = function (name, box) {
    if (name === 'ru-ww1-cards') {
      window.HubStolypin3d('rx-stolypin-cards', box, 'pervaya-mirovaya');
      return;
    }
    window.HubStolypinScene(box, { height: 375, autorotate: false, ...models[name] });
  };
})();
