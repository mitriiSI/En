/* Общие помощники для 3D-моделей «Теории управления» (файлы upravlenie3d-*b.js). */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubScene3d) return;
  function reg(name, opts) {
    var b = opts.build; opts.radius = (opts.radius || 16) * 1.2;
    opts.build = function (c) { var L = c.label; c.label = function (t, p, s, col) { return L(t, p, (s || 0.9) * 1.7, col); }; b(c); };
    HubWidgets.register(name, function (box) { HubScene3d(box, opts); });
  }
  function W(x) { x = x % 1; return x < 0 ? x + 1 : x; }
  function V(T, a) { return new T.Vector3(a[0], a[1], a[2]); }
  function arrow(c, a, b, col, info, r) {
    var T = c.THREE, A = V(T, a), B = V(T, b), d = B.clone().sub(A), len = d.length(); r = r || 0.08;
    var g = new T.Group();
    var sh = new T.Mesh(new T.CylinderGeometry(r, r, Math.max(0.01, len - 0.45), 10), c.mat(col)); sh.position.y = (len - 0.45) / 2; g.add(sh);
    var hd = new T.Mesh(new T.ConeGeometry(r * 3.2, 0.45, 14), c.mat(col)); hd.position.y = len - 0.225; g.add(hd);
    g.position.copy(A); g.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    if (info) g.userData.info = info; c.root.add(g); return g;
  }
  function link(c, a, b, col, r, info, parent) {
    var T = c.THREE, A = V(T, a), B = V(T, b), d = B.clone().sub(A);
    var m = new T.Mesh(new T.CylinderGeometry(r || 0.05, r || 0.05, d.length(), 6), c.mat(col || '#9aa2c0'));
    m.position.copy(A.clone().add(B).multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    if (info) m.userData.info = info; (parent || c.root).add(m); return m;
  }
  function curve(c, pts, closed) { var T = c.THREE; return new T.CatmullRomCurve3(pts.map(function (p) { return V(T, p); }), !!closed); }
  function tube(c, pts, col, r, closed, info) { var cv = curve(c, pts, closed); var m = c.mesh(new c.THREE.TubeGeometry(cv, 120, r || 0.06, 8, !!closed), col, info); m.userData.curve = cv; return m; }
  function glow(c, col, size) { return c.mesh(new c.THREE.SphereGeometry(size || 0.2, 14, 10), col, null, { emissive: c.color(col), emissiveIntensity: 0.7 }); }
  function movers(c, cv, col, speed, n, size) {
    var arr = []; for (var i = 0; i < (n || 1); i++) arr.push(glow(c, col, size));
    c.onFrame(function (t) { arr.forEach(function (s, i) { s.position.copy(cv.getPointAt(W(t * speed + i / arr.length))); }); });
    return arr;
  }
  window.TU3 = { reg: reg, W: W, V: V, arrow: arrow, link: link, curve: curve, tube: tube, glow: glow, movers: movers };
})();

(function () {
  'use strict';
  /* Задания курса используют стандартный экран тестов и оформление сайта. */
  function registerAssignments({ subject, lectures, bankPath, obsolete, previousTopic, topicAliases = {}, banks = [bankPath], caseFile }) {
    if (!window.HubTests) return;

    const prefix = '#/s/' + subject;
    const route = prefix + '/zadaniya';
    const assets = 'media/upravlenie-cases/';

    function migrateOldRoute() {
      const [section, id, group] = location.hash.replace(/^#\/?s\//, '').split('/');
      if (section !== subject || !(obsolete.test(id) || (id === 'g' && group === 'tests'))) return;
      const topic = previousTopic(id);
      location.replace(route + (topic ? '/' + topic : ''));
    }
    window.addEventListener('hashchange', migrateOldRoute);
    migrateOldRoute();

    const back = document.getElementById('back');
    back?.addEventListener('click', event => {
      if (location.hash !== route && !location.hash.startsWith(route + '/')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.hash = prefix;
    }, true);

    function renameClassicTile() {
      if (location.hash !== prefix) return;
      const tile = document.querySelector('[data-grp="' + subject + '/g/tests"]');
      if (!tile) return;
      tile.dataset.item = subject + '/zadaniya';
      delete tile.dataset.grp;
      tile.querySelector('h3').textContent = 'Задания';
      const count = tile.querySelector('p');
      if (count) count.textContent = lectures + ' лекций';
    }

    const view = document.getElementById('view');
    if (view) new MutationObserver(renameClassicTile).observe(view, { childList: true, subtree: true });

    if (window.UI2) {
      const renderSubject = UI2.sub;
      UI2.sub = function (view, sid, api) {
        if (sid !== subject) return renderSubject.call(this, view, sid, api);
        const scoped = Object.assign({}, api, {
          itemsOf: key => api.itemsOf(key).filter(item => key !== subject ||
            (item.id !== 'zadaniya' && !obsolete.test(item.id)))
        });
        const result = renderSubject.call(this, view, sid, scoped);
        const link = document.createElement('a');
        link.className = 'u2-test';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
        link.href = route;
        link.innerHTML = '<div><b>Задания</b><small>' + lectures + ' лекций</small></div><span class="u2-btn">Открыть</span>';
        const page = view.querySelector('.page');
        const list = page?.querySelector('.u2-list');
        if (list) list.before(link);
        else page?.append(link);
        return result;
      };

      const renderLecture = UI2.lecture;
      UI2.lecture = function (view, item, sid, api) {
        if (sid !== subject) return renderLecture.call(this, view, item, sid, api);
        const scoped = Object.assign({}, api, {
          itemsOf: key => api.itemsOf(key).filter(entry => key !== subject || !obsolete.test(entry.id))
        });
        return renderLecture.call(this, view, item, sid, scoped);
      };
    }

    const renderTest = HubTests.page;
    HubTests.page = function (view, item, footer) {
      if (item.id !== 'zadaniya' || item.src !== bankPath) return renderTest.call(this, view, item, footer);

      if (!document.getElementById('tu-assignment-style')) {
        const style = document.createElement('link');
        style.id = 'tu-assignment-style';
        style.rel = 'stylesheet';
        style.href = assets + 'lecture.css?v=2';
        document.head.append(style);
      }

      const page = document.createElement('div');
      page.className = 'page tu-assignments';
      page.innerHTML = '<label for="tu-lesson">Лекция</label><select id="tu-lesson" disabled></select>' +
        '<div style="margin-top: .8rem"><label for="tu-block">Набор вопросов</label><select id="tu-block" disabled></select></div>' +
        '<div class="tu-assignment-body"><p role="status">Загружаются задания…</p></div>';
      view.replaceChildren(page);
      const topics = page.querySelector('#tu-lesson');
      const blocks = page.querySelector('#tu-block');
      const body = page.querySelector('.tu-assignment-body');
      const lesson = location.hash.split('/')[4];

      Promise.all(banks.map(path => HubTests.load(path))).then(([bank, ...extra]) => {
        if (!page.isConnected) return;
        const available = new Map(bank.topics.map(topic => [topic.id, topic]));
        for (const source of extra) {
          for (const topic of source.topics) available.set(topic.id, topic);
        }
        for (const topic of available.values()) topics.add(new Option(topic.title, topic.id));
        const selected = available.has(lesson) ? lesson : topicAliases[lesson];
        if (available.has(selected)) topics.value = selected;
        topics.disabled = false;

        function draw() {
          const topic = topics.value;
          history.replaceState(history.state, '', route + '/' + topic);
          const quiz = document.createElement('div');
          const written = document.createElement('section');
          const heading = document.createElement('h3');
          heading.textContent = 'Задачи со своим ответом';
          const exercises = document.createElement('div');
          written.className = 'tu-written';
          written.append(heading, exercises);
          body.replaceChildren(quiz, written);
          const bankOverride = extra.find(source => source.topics.some(entry => entry.id === topic));
          const questions = (bankOverride || bank).questions.filter(question => question.t === topic);
          const blockSize = 12;
          blocks.replaceChildren();
          for (let start = 0; start < questions.length; start += blockSize) {
            const end = Math.min(start + blockSize, questions.length);
            blocks.add(new Option('Вопросы ' + (start + 1) + '–' + end, String(start)));
          }
          blocks.add(new Option('Все вопросы (' + questions.length + ')', 'all'));
          blocks.disabled = false;

          function drawQuiz() {
            const start = Number(blocks.value);
            const selected = blocks.value === 'all' ? questions : questions.slice(start, start + blockSize);
            HubTests.run(quiz, selected, {
              title: 'Тренировка по лекции',
              badge: 'Задания',
              key: subject + '/assignments-' + topic + '-' + blocks.value
            });
          }

          blocks.onchange = drawQuiz;
          drawQuiz();
          import(new URL(assets + 'app.js?v=8', document.baseURI).href).then(module => {
            if (exercises.isConnected) module.mount(exercises, caseFile ? (topic === 'lekciya-16-11' ? 'potrebitel' : topic) : topic.slice(1), caseFile);
          }).catch(() => {
            exercises.textContent = 'Не удалось загрузить письменные задачи. Обнови страницу.';
          });
        }

        topics.addEventListener('change', draw);
        draw();
      }).catch(() => {
        body.textContent = 'Не удалось загрузить задания. Обнови страницу.';
      });
    };
  }
  registerAssignments({
    subject: 'upravlenie', lectures: 6, bankPath: 'data/tests/upravlenie.json',
    obsolete: /^(?:test(?:-l[1-6]|-intensive)?|practice-recall)$/,
    previousTopic: id => /^test-l[1-6]$/.test(id) ? id.slice(5) : ''
  });
  registerAssignments({
    subject: 'ekonomika', lectures: 13, bankPath: 'data/tests/ekonomika.json',
    banks: ['data/tests/ekonomika.json', 'data/tests/ekonomika-faktory-proizvodstva.json'],
    obsolete: /^test(?:-[a-z0-9-]+)?$/,
    previousTopic: id => id.startsWith('test-') ? id.slice(5) : '',
    topicAliases: { 'lekciya-16-11': 'potrebitel', 'potrebitel': 'lekciya-16-11' },
    caseFile: '../../media/ekonomika/written-assignments.json?v=2'
  });

  (function () {
    const widgets = window.HubWidgets;
    if (!widgets) return;
    const mount = widgets.mountAll;
    widgets.mountAll = function (view) {
      if (location.hash.startsWith('#/s/ekonomika/')) {
        const topic = location.hash.split('/')[3];
        const href = '#/s/ekonomika/zadaniya/' + topic;
        const legacyLinks = view.querySelectorAll('a[href^="#/s/ekonomika/test-"]');
        for (const heading of view.querySelectorAll('.doc h2')) {
          if (heading.textContent !== 'Итоговый тест') continue;
          heading.textContent = 'Задания';
          const tocLabel = view.querySelector('[data-to="' + heading.id + '"] span');
          if (tocLabel) tocLabel.textContent = heading.textContent;
        }
        const slots = view.querySelectorAll('[data-w^="test-ekonomika__"], [data-w="ef-quiz"]');
        for (const slot of slots) {
          const previous = slot.previousElementSibling;
          if (previous?.matches('p, blockquote, .u2-card') &&
              /После каждого ответа.*«Тесты»/s.test(previous.textContent)) previous.remove();
          if (legacyLinks.length) {
            slot.remove();
            continue;
          }
          const link = document.createElement('a');
          link.href = href;
          link.textContent = 'Задания по лекции';
          const paragraph = document.createElement('p');
          paragraph.append(link);
          slot.replaceWith(paragraph);
        }
        for (const link of legacyLinks) {
          link.href = href;
          link.textContent = 'Задания по лекции';
        }
      }
      return mount.call(this, view);
    };
  })();
})();

/* Учебные примеры рядом с пояснениями в конспектах. */
(function () {
  'use strict';
  const widgets = window.HubWidgets;
  if (!widgets) return;

  function exampleParagraph(example) {
    const paragraph = document.createElement('p');
    paragraph.className = 'u2-keep worked-example';
    const note = document.createElement('span');
    note.className = 'u2-added';
    note.textContent = '[ДОБАВЛЕНО]';
    const title = document.createElement('strong');
    title.textContent = example.title + '.';
    const text = example.explanation || example.scene + ' ' + example.walkthrough;
    paragraph.append(note, ' ', title, ' ', text);
    if (example.transfer) {
      const question = document.createElement('span');
      question.textContent = example.transfer;
      paragraph.append(document.createElement('br'), question);
    }
    return paragraph;
  }

  function insertExamples(doc, examples) {
    const headings = [...doc.querySelectorAll(':scope > h2')];
    for (const example of examples) {
      const index = headings.findIndex(heading => heading.textContent.includes(example.section));
      const heading = headings[index];
      if (!heading) continue;

      const attached = heading.nextElementSibling;
      const body = attached?.classList.contains('u2-body') ? attached : null;
      const next = headings[index + 1] || doc.querySelector(':scope > .pn');
      const first = body ? body.firstElementChild : attached;
      const paragraph = exampleParagraph(example);

      // Сохраняем определение рядом с пояснением.
      if (!first || first === next) {
        if (body) body.append(paragraph);
        else heading.after(paragraph);
      } else if (first.matches('p, blockquote, .u2-card, .u2-exp')) {
        const explanation = first.nextElementSibling;
        if (explanation?.matches('blockquote, .u2-exp')) explanation.after(paragraph);
        else first.after(paragraph);
      } else {
        first.before(paragraph);
      }
    }
  }

  const mount = widgets.mountAll;
  let examples;
  widgets.mountAll = function (view) {
    const result = mount.call(this, view);
    const route = location.hash.match(/^#\/?s\/((?:upravlenie|ekonomika)\/[a-z0-9-]+)\/?$/);
    const doc = route && view.querySelector('.page.doc');
    if (!doc || doc.querySelector('.worked-example')) return result;

    examples ??= fetch('media/study/worked-examples.json?v=2').then(response => {
      if (!response.ok) throw new Error('Не удалось загрузить учебные примеры');
      return response.json();
    });

    examples.then(data => {
      if (!doc.isConnected || doc.querySelector('.worked-example')) return;
      const key = route[1];
      const sections = key === 'ekonomika/lekciya-16-11'
        ? [...data[key], ...data['ekonomika/potrebitel']]
        : data[key];
      if (sections) insertExamples(doc, sections);
    }).catch(() => { examples = undefined; });

    return result;
  };
})();
