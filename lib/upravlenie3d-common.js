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

/* Блок заданий подключается через тот же реестр виджетов, что и модели курса. */
(function () {
  'use strict';
  if (!window.HubWidgets || !window.HubTests) return;

  const subject = 'upravlenie';
  const prefix = '#/s/' + subject;
  const obsolete = /^(?:test(?:-l[1-6]|-intensive)?|practice-recall)$/;
  let jumpToAssignments = new URLSearchParams(location.search).has('zadaniya');
  if (jumpToAssignments) {
    const url = new URL(location.href);
    url.searchParams.delete('zadaniya');
    history.replaceState(history.state, '', url);
  }

  function migrateOldRoute() {
    const match = /^#\/?s\/upravlenie\/(g\/tests|test(?:-l([1-6])|-intensive)?|practice-recall)\/?$/.exec(location.hash);
    if (!match) return;
    jumpToAssignments = Boolean(match[2]);
    location.replace(match[2] ? prefix + '/l' + match[2] : prefix);
  }
  window.addEventListener('hashchange', migrateOldRoute);
  migrateOldRoute();

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'media/upravlenie-cases/lecture.css?v=1';
  document.head.append(stylesheet);

  function courseItems(api) {
    return Object.assign({}, api, {
      itemsOf: sid => api.itemsOf(sid).filter(item => sid !== subject || !obsolete.test(item.id))
    });
  }

  function addButton(container, click) {
    if (!container) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ib';
    button.textContent = 'Задания';
    button.addEventListener('click', event => {
      event.stopPropagation();
      click();
    });
    container.append(button);
  }

  function showAssignments(slot) {
    const doc = slot.closest('.doc');
    doc.querySelector('.u2-seg [data-m="full"]')?.click();
    const section = slot.closest('.u2-body');
    if (section?.hidden) section.previousElementSibling?.click();
    slot.scrollIntoView({ block: 'start' });
  }

  if (window.UI2) {
    const renderSubject = UI2.sub;
    UI2.sub = function (view, sid, api) {
      const result = renderSubject.call(this, view, sid, sid === subject ? courseItems(api) : api);
      if (sid === subject) {
        view.querySelectorAll('.u2-lec[data-item^="upravlenie/l"]').forEach(card => {
          if (!/^upravlenie\/l[1-6]$/.test(card.dataset.item)) return;
          addButton(card.querySelector('.u2-ic'), () => {
            jumpToAssignments = true;
            location.hash = '#/s/' + card.dataset.item;
          });
        });
      }
      return result;
    };

    const renderLecture = UI2.lecture;
    UI2.lecture = function (view, item, sid, api) {
      return renderLecture.call(this, view, item, sid, sid === subject ? courseItems(api) : api);
    };
  }

  function mountAssignments(slot, lesson) {
    slot.classList.add('tu-assignments', 'u2-keep');
    const quiz = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = 'Задачи со своим ответом';
    const frame = document.createElement('iframe');
    frame.title = 'Задачи со своим ответом. Лекция ' + lesson;
    frame.src = 'media/upravlenie-cases/index.html?lesson=' + lesson;
    frame.loading = 'lazy';
    frame.addEventListener('load', () => {
      const main = frame.contentDocument?.querySelector('main');
      if (!main) return;
      const setHeight = () => {
        frame.style.height = Math.ceil(main.getBoundingClientRect().height) + 'px';
      };
      setHeight();
      const observer = new ResizeObserver(setHeight);
      observer.observe(main);
      frame.contentWindow.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    });
    slot.append(quiz, heading, frame);

    HubTests.load('data/tests/upravlenie.json').then(bank => {
      const exercises = bank.questions.filter(question => question.t === 'l' + lesson);
      if (!exercises.length) throw new Error('No exercises');
      HubTests.run(quiz, exercises, {
        title: 'Ситуационный тест',
        key: 'upravlenie/assignments-l' + lesson
      });
    }).catch(() => {
      quiz.textContent = 'Не удалось загрузить тест. Обнови страницу.';
    });

    const doc = slot.closest('.doc');
    const toolbar = doc.querySelector('.u2-lhead .u2-ic');
    if (toolbar) {
      addButton(toolbar, () => showAssignments(slot));
    } else {
      const nav = document.createElement('div');
      const title = doc.querySelector('h1');
      if (title) title.after(nav);
      else doc.prepend(nav);
      addButton(nav, () => showAssignments(slot));
    }
    if (jumpToAssignments) {
      jumpToAssignments = false;
      requestAnimationFrame(() => showAssignments(slot));
    }
  }

  for (let lesson = 1; lesson <= 6; lesson++) {
    HubWidgets.register('test-tu-lesson__l' + lesson, slot => mountAssignments(slot, lesson));
  }
})();
