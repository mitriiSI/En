(function () {
  'use strict';

  const BLUE = '#568bff';
  const ORANGE = '#ffac59';
  const MINT = '#61d8cb';
  const GRID = '#536982';
  const BANK = 'data/tests/ekonomika.json';
  const TOPIC = 'faktory-proizvodstva';
  const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const fmt = value => number.format(value);
  let three;

  function cdnThree() {
    if (window.THREE) return Promise.resolve();
    if (!three) {
      three = new Promise(resolve => {
        const script = document.createElement('script');
        const timer = setTimeout(() => {
          script.remove();
          resolve();
        }, 4000);
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.min.js';
        script.onload = script.onerror = () => {
          clearTimeout(timer);
          resolve();
        };
        document.head.appendChild(script);
      });
    }
    return three;
  }

  function visible(box, mount) {
    if (!('IntersectionObserver' in window)) {
      mount();
      return;
    }
    box.style.minHeight = '360px';
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      mount();
    }, { rootMargin: '12px' });
    observer.observe(box);
  }

  function axes(c, labels, top) {
    const T = c.THREE;
    const vertices = [];
    for (let tick = -4; tick <= 4; tick++) {
      vertices.push(-4, 0, tick, 4, 0, tick, tick, 0, -4, tick, 0, 4);
    }
    const floor = new T.BufferGeometry();
    floor.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    const grid = new T.LineSegments(floor, new T.LineBasicMaterial({ color: GRID, transparent: true, opacity: .52 }));
    c.root.add(grid);
    const origin = [-4, 0, 4];
    c.link(origin, [4.22, 0, 4], GRID, .028);
    c.link(origin, [-4, 0, -4.22], GRID, .028);
    c.link(origin, [-4, top + .3, 4], GRID, .028);
    c.label(labels[0], [3.2, .2, 4.6], .58);
    c.label(labels[1], [-4.15, .2, -4.1], .58);
    c.label(labels[2], [-4, top + .6, 4], .58);
  }

  function surface(c, color, opacity) {
    const T = c.THREE;
    const side = 32;
    const grid = new T.PlaneGeometry(8, 8, side, side);
    const points = grid.getAttribute('position');
    const mesh = c.mesh(grid, color, '', { side: T.DoubleSide, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    function update(f) {
      for (let j = 0; j <= side; j++) {
        for (let i = 0; i <= side; i++) {
          const x = i / side, z = j / side;
          points.setXYZ(j * (side + 1) + i, 8 * x - 4, f(x, z), 4 - 8 * z);
        }
      }
      points.needsUpdate = true;
      grid.computeVertexNormals();
    }
    return { mesh, update };
  }

  function trace(c, color) {
    const T = c.THREE;
    const positions = new T.BufferAttribute(new Float32Array(33 * 3), 3);
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', positions);
    const line = new T.Line(geo, new T.LineBasicMaterial({ color, depthTest: false }));
    line.frustumCulled = false;
    line.renderOrder = 5;
    c.root.add(line);
    return function (f) {
      for (let i = 0; i <= 32; i++) positions.setXYZ(i, ...f(i / 32));
      positions.needsUpdate = true;
    };
  }

  function marker(c, pos, color) {
    const point = c.mesh(new c.THREE.SphereGeometry(.14, 20, 14), color, '', { emissive: color, emissiveIntensity: .48, depthTest: false });
    point.position.set(...pos);
    point.renderOrder = 6;
    return point;
  }

  function controls(box, c, fields, draw) {
    const panel = document.createElement('div');
    panel.className = 'wg-chips';
    panel.style.cssText = 'margin:10px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(155px,100%),1fr));gap:8px';
    c.out.before(panel);
    c.out.setAttribute('aria-live', 'polite');
    const values = {};
    fields.forEach(field => {
      const label = document.createElement('label');
      label.className = 'wg-chip';
      label.style.cssText = 'display:block;text-align:left;padding:8px 10px;cursor:default;min-width:0';
      const caption = document.createElement('span');
      caption.textContent = field.label;
      const output = document.createElement('strong');
      output.style.marginLeft = '.4em';
      let input;
      if (field.choices) {
        input = document.createElement('select');
        field.choices.forEach(([value, title]) => input.add(new Option(title, value)));
      } else {
        input = document.createElement('input');
        input.type = 'range';
        input.min = field.min;
        input.max = field.max;
        input.step = field.step;
      }
      input.style.cssText = 'display:block;width:100%;margin:5px 0 0;accent-color:#568bff;color-scheme:dark';
      input.value = field.value;
      label.append(caption, output, input);
      panel.append(label);
      function read() {
        values[field.id] = field.choices ? input.value : Number(input.value);
        output.textContent = field.choices ? '' : fmt(values[field.id]) + (field.unit || '');
      }
      read();
      input.addEventListener(field.choices ? 'change' : 'input', () => {
        read();
        draw(values);
      });
    });
    draw(values);
  }

  function production(box, c) {
    axes(c, ['K · ед.', 'L · ед.', 'Y · ед.'], 6.2);
    const graph = surface(c, BLUE, .89);
    const laborSlice = trace(c, MINT);
    const isoquant = trace(c, ORANGE);
    const current = marker(c, [0, 0, 0], ORANGE);
    controls(box, c, [
      { id: 'capital', label: 'Капитал K', min: 1, max: 16, step: 1, value: 8 },
      { id: 'labor', label: 'Труд L', min: 1, max: 16, step: 1, value: 6 },
      { id: 'share', label: 'Показатель α', min: .2, max: .8, step: .05, value: .4 },
      { id: 'tech', label: 'Производительность A', min: .5, max: 1.5, step: .1, value: 1 }
    ], ({ capital, labor, share, tech }) => {
      const model = (k, l) => tech * k ** share * l ** (1 - share);
      const y = model(capital, labor);
      const hx = k => (k - 1) * 8 / 15 - 4;
      const hz = l => 4 - (l - 1) * 8 / 15;
      const hy = q => q * .25;
      graph.update((x, z) => hy(model(1 + 15 * x, 1 + 15 * z)));
      laborSlice(t => [hx(capital), hy(model(capital, 1 + 15 * t)), hz(1 + 15 * t)]);
      const kFor = l => (y / (tech * l ** (1 - share))) ** (1 / share);
      const from = Math.max(1, kFor(16));
      const to = Math.min(16, kFor(1));
      isoquant(t => {
        const k = from + (to - from) * t;
        const l = (y / (tech * k ** share)) ** (1 / (1 - share));
        return [hx(k), hy(y), hz(l)];
      });
      current.position.set(hx(capital), hy(y), hz(labor));
      c.say('<b>Y = ' + fmt(y) + ' ед.</b> При том же капитале ещё одна условная единица труда даёт ' +
        fmt(model(capital, labor + 1) - y) + ' ед. выпуска. Оранжевая линия соединяет наборы K и L с тем же выпуском.');
    });
  }

  function hiring(box, c) {
    axes(c, ['L · смены', 'P · ₽/изд.', '₽/смену'], 5.4);
    const output = surface(c, BLUE, .8);
    const costs = surface(c, ORANGE, .48);
    const selectedMRP = trace(c, MINT);
    const selectedCost = trace(c, ORANGE);
    const current = marker(c, [0, 0, 0], MINT);
    c.label('Синяя · MRP', [2.2, 5.3, -3.2], .56, BLUE);
    c.label('Оранжевая · MRC', [1.2, .45, 3.35], .56, ORANGE);
    controls(box, c, [
      { id: 'price', label: 'Цена изделия', min: 20, max: 80, step: 5, value: 50, unit: ' ₽' },
      { id: 'wage', label: 'Расход на смену', min: 325, max: 1000, step: 25, value: 600, unit: ' ₽' }
    ], ({ price, wage }) => {
      const mrp = (labor, p) => p * (20 - 1.5 * labor);
      const height = rub => rub / 300;
      const z = 4 - (price - 20) * 8 / 60;
      output.update((x, priceFraction) => height(mrp(x * 12, 20 + 60 * priceFraction)));
      costs.mesh.renderOrder = 2;
      costs.update(() => height(wage));
      selectedMRP(t => [8 * t - 4, height(mrp(t * 12, price)), z]);
      selectedCost(t => [8 * t - 4, height(wage), z]);
      const optimal = Math.min(12, Math.max(0, (20 - wage / price) / 1.5));
      current.position.set(optimal * 8 / 12 - 4, height(mrp(optimal, price)), z);
      const boundary = optimal === 0 ? 'Даже первая смена по краю модели не окупается.' :
        optimal === 12 ? 'На всём показанном диапазоне предельная выручка покрывает расходы.' :
        'До этой точки MRP выше MRC, после неё — ниже.';
      c.say('<b>L* = ' + fmt(optimal) + ' смены.</b> ' + boundary + ' Бирюзовое сечение показывает MRP при выбранной цене изделия.');
    });
  }

  function capital(box, c) {
    axes(c, ['n · периоды', 'r · %', 'Множитель'], 5.4);
    const graph = surface(c, BLUE, .85);
    const selected = trace(c, ORANGE);
    const current = marker(c, [0, 0, 0], ORANGE);
    c.label('1×', [-4, .88, 4.15], .46);
    controls(box, c, [
      { id: 'rate', label: 'Ставка за период', min: 0, max: 20, step: 1, value: 10, unit: ' %' },
      { id: 'periods', label: 'Периоды', min: 0, max: 10, step: 1, value: 3 },
      { id: 'amount', label: 'Исходная сумма', min: 1000, max: 10000, step: 500, value: 5000, unit: ' ₽' },
      { id: 'mode', label: 'Расчёт', choices: [['future', 'Будущая стоимость'], ['present', 'Текущая стоимость']], value: 'future' }
    ], ({ rate, periods, amount, mode }) => {
      const forward = mode === 'future';
      const multiplier = (n, r) => (1 + r / 100) ** (forward ? n : -n);
      const height = m => .88 * m;
      const z = 4 - rate * .4;
      const value = multiplier(periods, rate);
      graph.update((x, rf) => height(multiplier(10 * x, 20 * rf)));
      selected(t => [t * 8 - 4, height(multiplier(t * 10, rate)), z]);
      current.position.set(periods * .8 - 4, height(value), z);
      c.say('<b>' + (forward ? 'FV' : 'PV') + ' = ' + fmt(amount * value) + ' ₽.</b> При ставке ' + rate +
        ' % за период и n = ' + periods + ' множитель равен ' +
        value.toLocaleString('ru-RU', { maximumFractionDigits: 4 }) + '.');
    });
  }

  function funds(box, c) {
    const T = c.THREE;
    const baseline = new T.GridHelper(8, 8, GRID, GRID);
    baseline.position.y = -.02;
    c.root.add(baseline);
    c.label('Млн ₽', [-4, 5.8, 2.5], .56);
    const posts = [[-2.8, -1.15], [.35, .9], [2.9, -1.15]];
    const old = c.mesh(new T.BoxGeometry(1.35, 1, 1.35), BLUE, 'Фонды на начало года.');
    const left = c.mesh(new T.BoxGeometry(1.35, 1, 1.35), BLUE, 'Фонды, оставшиеся от начала года.');
    const arrived = c.mesh(new T.BoxGeometry(1.35, 1, 1.35), MINT, 'Стоимость новых фондов, введённых в течение года.');
    const retired = c.mesh(new T.BoxGeometry(1.1, 1, 1.1), ORANGE, 'Фонды, выбывшие в течение года.');
    c.label('Начало', [posts[0][0], .36, posts[0][1] + 1.05], .62);
    c.label('Выбытие', [posts[1][0], .36, posts[1][1] + 1.05], .56, ORANGE);
    c.label('Конец', [posts[2][0], .36, posts[2][1] + 1.05], .62);
    function resize(mesh, amount, bottom, [x, z]) {
      const height = amount / 29;
      mesh.visible = amount > 0;
      mesh.scale.y = height;
      mesh.position.set(x, bottom / 29 + height / 2, z);
    }
    controls(box, c, [
      { id: 'opening', label: 'Фонды на начало', min: 60, max: 120, step: 2, value: 100, unit: ' млн ₽' },
      { id: 'add', label: 'Введено за год', min: 0, max: 30, step: 2, value: 12, unit: ' млн ₽' },
      { id: 'remove', label: 'Ликвидировано за год', min: 0, max: 30, step: 2, value: 4, unit: ' млн ₽' }
    ], ({ opening, add, remove }) => {
      const rest = opening - remove;
      const closing = rest + add;
      resize(old, opening, 0, posts[0]);
      resize(retired, remove, 0, posts[1]);
      resize(left, rest, 0, posts[2]);
      resize(arrived, add, rest, posts[2]);
      c.say('<b>На конец года ' + closing + ' млн ₽.</b> Обновление: ' + add + ' ÷ ' + closing +
        ' ≈ ' + fmt(add / closing * 100) + ' %. Выбытие: ' + remove + ' ÷ ' + opening +
        ' ≈ ' + fmt(remove / opening * 100) + ' %.');
    });
  }

  function interestLine(box) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><b>Как растут 100 000 ₽ за три года</b></div>' +
      '<p class="wg-lead">Условная ставка 10 % в год. Синие точки — сумма на счёте, оранжевые подписи — проценты за очередной год.</p>' +
      '<svg viewBox="0 0 560 145" role="img" aria-label="От 100 000 рублей сегодня до 133 100 рублей через три года. Проценты по годам 10 000, 11 000 и 12 100 рублей." ' +
      'style="width:100%;height:auto;display:block;margin-top:8px"></svg>';
    const svg = box.querySelector('svg');
    const node = (tag, attrs, text) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
      if (text) element.textContent = text;
      return element;
    };
    svg.append(node('line', { x1: 65, y1: 73, x2: 496, y2: 73, stroke: GRID, 'stroke-width': 2 }));
    const points = [100000, 110000, 121000, 133100].map((amount, i, all) => {
      const x = 65 + i * 143;
      const g = node('g', { 'text-anchor': 'middle', 'font-family': 'system-ui', 'font-size': 21 });
      g.append(
        node('circle', { cx: x, cy: 73, r: 7, fill: BLUE }),
        node('text', { x, y: 105, fill: 'currentColor', 'font-weight': 650 }, fmt(amount) + ' ₽'),
        node('text', { x, y: 133, fill: 'currentColor' }, i ? i + (i === 1 ? ' год' : ' года') : 'сегодня')
      );
      if (i) g.append(node('text', { x: x - 72, y: 53, fill: ORANGE }, '+' + fmt(amount - all[i - 1])));
      svg.append(g);
      return g;
    });
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      points.forEach((point, index) => {
        if (point.animate) point.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 310, delay: index * 125, fill: 'both', easing: 'ease-out'
        });
      });
    }, { threshold: .42 });
    observer.observe(svg);
  }

  const models = {
    'ef-cobb3d': {
      title: 'Производственная функция Кобба — Дугласа',
      lead: 'Синяя поверхность — выпуск Y, бирюзовая линия — изменение L при фиксированном K, оранжевая — один и тот же выпуск при разных сочетаниях ресурсов.',
      build: production
    },
    'ef-hiring3d': {
      title: 'Где фирма перестаёт нанимать',
      lead: 'Схема, не точные данные. Синяя поверхность — MRP при разных ценах изделия, оранжевая плоскость — MRC. Меняй цену и расходы на смену, чтобы найти их пересечение.',
      build: hiring
    },
    'ef-capital3d': {
      title: 'Наращение и дисконтирование',
      lead: 'Синяя поверхность — множитель стоимости для всех ставок и сроков. Оранжевая линия — одна выбранная ставка, маркер — нужный срок.',
      build: capital
    },
    'ef-funds3d': {
      title: 'Движение основных фондов за год',
      lead: 'Синее — стоимость существующих фондов, бирюзовое — ввод, оранжевое — выбытие. Сравни, к какой из двух баз относится каждый поток.',
      build: funds
    }
  };

  function quiz(box) {
    box.textContent = 'Загрузка вопросов…';
    HubTests.load(BANK).then(data => {
      if (!box.isConnected) return;
      const questions = data.questions.filter(q => q.t === TOPIC && q.review);
      HubTests.run(box, questions, { title: 'Задачи по лекции', key: TOPIC + '/review' });
    }).catch(() => {
      box.textContent = 'Вопросы не загрузились. Открой полный тест по ссылке ниже.';
    });
  }

  function savedCards(box) {
    const key = 'hub.cards.ekonomika.' + TOPIC;
    box.className = 'wg';
    const details = document.createElement('details');
    const label = document.createElement('summary');
    label.textContent = 'Повторить карточки с сохранением прогресса';
    const body = document.createElement('div');
    details.append(label, body);
    box.append(details);
    details.addEventListener('toggle', () => {
      if (!details.open || body.childNodes.length) return;
      body.textContent = 'Загрузка карточек…';
      fetch('data/lecture-registrations.json').then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      }).then(data => {
        const deck = data.entries.find(entry => entry.section === 'ekonomika' && entry.item.id === TOPIC + '-cards').item.cards;
        const status = document.createElement('p');
        status.className = 'wg-lead';
        status.setAttribute('aria-live', 'polite');
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'wg-chip on';
        card.style.cssText = 'display:block;width:100%;min-height:80px;white-space:normal;text-align:left;padding:12px';
        const actions = document.createElement('div');
        actions.className = 'wg-chips';
        actions.style.marginTop = '8px';
        const button = (title, action) => {
          const element = document.createElement('button');
          element.type = 'button';
          element.className = 'wg-chip';
          element.textContent = title;
          element.onclick = action;
          actions.append(element);
          return element;
        };
        let states = {};
        try { states = JSON.parse(localStorage.getItem(key)) || {}; } catch (_) {}
        let remaining = deck.filter(item => states[item.q] !== 'known');
        let difficult = false;
        let flipped = false;
        const save = value => {
          if (!remaining[0]) return;
          states[remaining[0].q] = value;
          try { localStorage.setItem(key, JSON.stringify(states)); } catch (_) {}
          remaining.shift();
          flipped = false;
          draw();
        };
        const known = button('Знаю', () => save('known'));
        const repeat = button('Повторить', () => save('again'));
        const filter = button('Только трудные', () => {
          difficult = !difficult;
          remaining = deck.filter(item => difficult ? states[item.q] === 'again' : states[item.q] !== 'known');
          flipped = false;
          draw();
        });
        button('Сначала', () => {
          states = {};
          try { localStorage.removeItem(key); } catch (_) {}
          remaining = deck.slice();
          difficult = flipped = false;
          draw();
        });
        card.onclick = () => { flipped = !flipped; draw(); };
        function draw() {
          const current = remaining[0];
          const learned = deck.filter(item => states[item.q] === 'known').length;
          status.textContent = 'Выучено ' + learned + ' из ' + deck.length + ' · осталось в очереди ' + remaining.length;
          card.textContent = current ? (flipped ? current.a : current.q) : 'В этой очереди больше карточек нет.';
          card.disabled = !current;
          card.setAttribute('aria-label', (flipped ? 'Ответ. ' : 'Показать ответ. ') + card.textContent);
          known.disabled = repeat.disabled = !current || !flipped;
          filter.textContent = difficult ? 'Все оставшиеся' : 'Только трудные';
        }
        body.replaceChildren(status, card, actions);
        draw();
      }).catch(() => { body.textContent = 'Карточки не загрузились.'; });
    });
  }

  window.HubFaktory = function (id, box) {
    if (id === 'ef-quiz') return quiz(box);
    if (id === 'ef-cards') return savedCards(box);
    if (id === 'ef-interest-line') return interestLine(box);
    const opts = models[id];
    if (!opts) return;
    box.className = 'wg';
    const intro = document.createElement('p');
    intro.className = 'wg-lead';
    intro.textContent = opts.title;
    box.append(intro);
    visible(box, () => cdnThree().then(() => {
      if (!box.isConnected) return;
      box.style.minHeight = '';
      window.HubScene3d(box, {
        ...opts, autorotate: false, height: 350, radius: 17, targetY: 2.25, phi: .96, theta: .68,
        hint: 'Меняй параметры под моделью.',
        build: c => opts.build(box, c)
      });
    }));
  };
})();
