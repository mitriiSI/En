(function () {
  'use strict';

  const BLUE = '#568bff';
  const ORANGE = '#ffac59';
  const MINT = '#61d8cb';
  const GRID = '#536982';
  const BANK = 'data/tests/ekonomika-faktory-proizvodstva.json';
  const TOPIC = 'faktory-proizvodstva';
  const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const fmt = value => number.format(value);
  let three, webgl;

  function cdnThree() {
    if (window.THREE) return Promise.resolve();
    if (!three) {
      const load = (src, timeout) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        function failed() {
          clearTimeout(timer);
          script.remove();
          reject(new Error('Three.js unavailable'));
        }
        const timer = setTimeout(failed, timeout);
        script.src = src;
        script.onload = () => {
          clearTimeout(timer);
          if (window.THREE) resolve();
          else failed();
        };
        script.onerror = failed;
        document.head.appendChild(script);
      });
      three = load('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.min.js', 4000)
        .catch(() => load('lib/three.min.js', 6500));
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
    baseline.material.color.set(GRID);
    baseline.material.vertexColors = false;
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
      title: 'Модель 2. Производственная функция Кобба — Дугласа',
      lead: 'Синяя поверхность — выпуск Y, бирюзовая линия — изменение L при фиксированном K, оранжевая — один и тот же выпуск при разных сочетаниях ресурсов.',
      build: production
    },
    'ef-hiring3d': {
      title: 'Модель 1. Где фирма перестаёт нанимать',
      lead: 'Схема, не точные данные. Синяя поверхность — MRP при разных ценах изделия, оранжевая плоскость — MRC. Меняй цену и расходы на смену, чтобы найти их пересечение.',
      build: hiring
    },
    'ef-capital3d': {
      title: 'Модель 4. Наращение и дисконтирование',
      lead: 'Синяя поверхность — множитель стоимости для всех ставок и сроков. Оранжевая линия — одна выбранная ставка, маркер — нужный срок.',
      build: capital
    },
    'ef-funds3d': {
      title: 'Модель 3. Движение основных фондов за год',
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
      fetch('data/sections.json').then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      }).then(data => {
        const section = data.sections.find(item => item.id === 'ekonomika');
        const deck = section.items.find(item => item.id === TOPIC + '-cards').cards;
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

  function hasWebGL() {
    if (webgl === undefined) {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        webgl = Boolean(gl);
        if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (_) {
        webgl = false;
      }
    }
    return webgl;
  }

  // Use the same model geometry and controls when the browser has no GPU context.
  function canvasScene(box, opts) {
    const T = window.THREE;
    const root = new T.Group();
    const camera = new T.PerspectiveCamera(40, 1, .1, 100);
    const labels = [];
    const target = new T.Vector3(0, opts.targetY, 0);
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">3D</span><b></b></div>' +
      '<p class="wg-lead"></p><canvas tabindex="0" aria-label="3D-модель. Стрелки вращают, плюс и минус меняют масштаб." ' +
      'style="display:block;width:100%;height:350px;border-radius:14px;touch-action:none;cursor:grab;background:radial-gradient(circle at 50% 35%,var(--panel2),var(--bg))"></canvas>' +
      '<div class="wg-out"></div>';
    box.querySelector('.wg-h b').textContent = opts.title;
    box.querySelector('.wg-lead').textContent = opts.lead;
    const canvas = box.querySelector('canvas');
    const out = box.querySelector('.wg-out');
    const pen = canvas.getContext('2d');
    let azimuth = opts.theta, polar = opts.phi, distance = opts.radius;
    let frame = 0, inView = true;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function paint() {
      frame = 0;
      if (!box.isConnected || !inView || !pen || !canvas.clientWidth) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const radius = distance * Math.max(1, 1.25 / camera.aspect);
      camera.position.set(radius * Math.sin(polar) * Math.sin(azimuth),
        opts.targetY + radius * Math.cos(polar), radius * Math.sin(polar) * Math.cos(azimuth));
      camera.lookAt(target);
      camera.updateMatrixWorld();
      root.updateMatrixWorld(true);
      pen.setTransform(dpr, 0, 0, dpr, 0, 0);
      pen.clearRect(0, 0, w, h);
      function project(v) {
        v.project(camera);
        return [(v.x + 1) * w / 2, (1 - v.y) * h / 2, v.z];
      }
      const point = new T.Vector3();
      const faces = [], lines = [];
      for (const object of root.children) {
        if (!object.visible) continue;
        const geo = object.geometry;
        const shape = geo.getAttribute('position');
        const points = Array.from({ length: shape.count }, (_, i) =>
          project(point.fromBufferAttribute(shape, i).applyMatrix4(object.matrixWorld)));
        const color = object.material.color;
        const alpha = object.material.opacity;
        if (object.isLine) {
          lines.push({ points, color: color.getStyle(), alpha, segments: object.isLineSegments, overlay: object.renderOrder > 0 });
          continue;
        }
        const index = geo.getIndex()?.array;
        const normals = geo.getAttribute('normal');
        const palette = Array.from({ length: 8 }, (_, i) => color.clone().multiplyScalar(.5 + i * .09).getStyle());
        for (let i = 0; i < (index ? index.length : points.length); i += 3) {
          const a = index ? index[i] : i;
          const b = index ? index[i + 1] : i + 1;
          const c = index ? index[i + 2] : i + 2;
          const shade = normals ? Math.abs(normals.getX(a) * .3 + normals.getY(a) * .77 + normals.getZ(a) * .55) : .8;
          const [p, q, r] = [points[a], points[b], points[c]];
          if (object.material.side === T.FrontSide &&
              (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) >= 0) continue;
          faces.push({ p, q, r, depth: (p[2] + q[2] + r[2]) / 3, alpha,
            color: palette[clamp(Math.round(shade * 7), 0, 7)] });
        }
      }
      function drawLine(line) {
        pen.beginPath();
        line.points.forEach(([x, y], i) => {
          if (i === 0 || (line.segments && i % 2 === 0)) pen.moveTo(x, y);
          else pen.lineTo(x, y);
        });
        pen.lineWidth = line.overlay ? 2 : 1;
        pen.strokeStyle = line.color;
        pen.globalAlpha = line.overlay ? 1 : Math.min(.64, line.alpha);
        pen.stroke();
      }
      lines.filter(line => !line.overlay).forEach(drawLine);
      faces.sort((a, b) => b.depth - a.depth).forEach(({ p, q, r, alpha, color }) => {
        pen.beginPath();
        pen.moveTo(p[0], p[1]);
        pen.lineTo(q[0], q[1]);
        pen.lineTo(r[0], r[1]);
        pen.closePath();
        pen.fillStyle = color;
        pen.globalAlpha = alpha;
        pen.fill();
      });
      lines.filter(line => line.overlay).forEach(drawLine);
      pen.globalAlpha = 1;
      pen.font = '600 13px system-ui';
      pen.textAlign = 'center';
      pen.textBaseline = 'middle';
      labels.forEach(({ text, position, color }) => {
        const [x, y] = project(position.clone());
        const tw = pen.measureText(text).width;
        pen.fillStyle = '#111b31';
        pen.fillRect(x - tw / 2 - 5, y - 9, tw + 10, 18);
        pen.fillStyle = color;
        pen.fillText(text, x, y);
      });
    }
    function redraw() {
      if (inView && !frame) frame = requestAnimationFrame(paint);
    }
    function mesh(geometry, color, info, extra) {
      const object = new T.Mesh(geometry, new T.MeshStandardMaterial({ color, ...extra }));
      root.add(object);
      return object;
    }
    opts.build({
      root, out, THREE: T, mesh,
      label: (text, pos, size, color = '#edf1ff') => labels.push({ text, position: new T.Vector3(...pos), color }),
      link: (a, b, color) => root.add(new T.Line(
        new T.BufferGeometry().setFromPoints([new T.Vector3(...a), new T.Vector3(...b)]),
        new T.LineBasicMaterial({ color })
      )),
      say: text => { out.innerHTML = text; redraw(); }
    });
    if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(canvas);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!canvas.isConnected) observer.disconnect();
        if (inView) redraw();
      });
      observer.observe(canvas);
    }
    const drag = new Map();
    const gap = () => {
      const [a, b] = drag.values();
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    const zoom = factor => { distance = clamp(distance * factor, 7, 33); redraw(); };
    canvas.addEventListener('pointerdown', event => {
      if (drag.size === 2) return;
      canvas.setPointerCapture(event.pointerId);
      drag.set(event.pointerId, event);
    });
    canvas.addEventListener('pointermove', event => {
      const previous = drag.get(event.pointerId);
      if (!previous) return;
      const oldGap = drag.size === 2 ? gap() : null;
      drag.set(event.pointerId, event);
      if (oldGap) {
        zoom(oldGap / Math.max(1, gap()));
      } else {
        azimuth -= (event.clientX - previous.clientX) * .008;
        polar = clamp(polar - (event.clientY - previous.clientY) * .006, .2, 1.5);
        redraw();
      }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name =>
      canvas.addEventListener(name, event => drag.delete(event.pointerId)));
    canvas.addEventListener('wheel', event => {
      event.preventDefault();
      zoom(Math.exp(clamp(event.deltaY, -200, 200) * .002));
    }, { passive: false });
    canvas.addEventListener('keydown', event => {
      const actions = {
        ArrowLeft: () => { azimuth += .15; },
        ArrowRight: () => { azimuth -= .15; },
        ArrowUp: () => { polar = clamp(polar + .12, .2, 1.5); },
        ArrowDown: () => { polar = clamp(polar - .12, .2, 1.5); },
        '+': () => zoom(.9), '=': () => zoom(.9), '-': () => zoom(1.1)
      };
      if (!actions[event.key]) return;
      event.preventDefault();
      actions[event.key]();
      redraw();
    });
    redraw();
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
      const config = {
        ...opts, autorotate: false, height: 350, radius: 17, targetY: 2.25, phi: .96, theta: .68,
        hint: 'Меняй параметры под моделью.',
        build: c => opts.build(box, c)
      };
      if (!hasWebGL()) canvasScene(box, config);
      else window.HubScene3d(box, config);
    }).catch(() => {
      box.style.minHeight = '';
      intro.textContent = 'Не удалось загрузить модель. Проверь подключение к интернету.';
    }));
  };
})();
