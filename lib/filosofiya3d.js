/* 3D-модели и схемы для конспектов (философия).
   В Markdown пишется отдельной строкой, например: @@graph:cave3d@@
   three.js подгружается только когда на странице есть 3D-блок. */
(function () {
  'use strict';
  if (!window.HubWidgets || !HubWidgets.register) return;

  /* ---------- общее ---------- */
  var threeP = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!threeP) threeP = new Promise(function (ok, bad) {
      var s = document.createElement('script'); s.src = 'lib/three.min.js';
      s.onload = function () { ok(window.THREE); }; s.onerror = bad;
      document.head.appendChild(s);
    });
    return threeP;
  }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }
  function isLight() { return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches; }
  function shell(box, title, lead, extra, badge) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">' + (badge || 'Интерактив') + '</span><b>' + title + '</b></div><p class="wg-lead">' + lead + '</p>' + extra;
    return function (s) { return box.querySelector(s); };
  }
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, txt) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; return e; }

  /* Сцена: холст, вращение пальцем по горизонтали, анимация только когда блок виден. */
  function stage(host, opts) {
    opts = opts || {};
    var T = window.THREE;
    var wrap = document.createElement('div'); wrap.className = 'wg3';
    var hint = document.createElement('span'); hint.className = 'wg3-hint'; hint.textContent = opts.hint || '↔ Покрути пальцем';
    var renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false }); }
    catch (e) { host.innerHTML = '<div class="wg-out">3D не поддерживается на этом устройстве.</div>'; return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (opts.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; }
    wrap.appendChild(renderer.domElement); wrap.appendChild(hint); host.appendChild(wrap);
    var scene = new T.Scene();
    scene.background = new T.Color(opts.bg || css('--panel2'));
    var camera = new T.PerspectiveCamera(opts.fov || 45, 4 / 3, 0.1, 200);
    var pivot = new T.Group(); scene.add(pivot);
    var yaw = opts.yaw || 0, tilt = 0, vy = 0, drag = null, auto = opts.autoRotate || 0;
    var cv = renderer.domElement;
    cv.style.touchAction = 'pan-y';
    cv.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; hint.style.opacity = 0; });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY };
      vy = dx * 0.008; yaw += vy;
      if (opts.tilt) tilt = Math.max(-0.5, Math.min(0.5, tilt + dy * 0.004));
    });
    window.addEventListener('pointerup', function () { drag = null; });
    function size() {
      var w = wrap.clientWidth || 600, h = Math.round(Math.min(w * (opts.ratio || 0.72), 440));
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(wrap); else window.addEventListener('resize', size);
    var frames = [], visible = true, running = false, t0 = performance.now(), last = t0;
    function loop(now) {
      if (!visible || !document.body.contains(wrap)) { running = false; return; }
      var dt = Math.min(0.05, (now - last) / 1000), t = (now - t0) / 1000; last = now;
      if (!drag) { vy *= 0.94; yaw += vy + auto * dt; }
      pivot.rotation.y = yaw; pivot.rotation.x = tilt;
      for (var i = 0; i < frames.length; i++) frames[i](t, dt);
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(wrap);
    start();
    return { T: T, scene: scene, camera: camera, pivot: pivot, renderer: renderer, onFrame: function (f) { frames.push(f); } };
  }
  function label(T, text, opt) {
    opt = opt || {};
    var c = document.createElement('canvas'), x = c.getContext('2d'), fs = 64;
    x.font = '700 ' + fs + 'px system-ui, -apple-system, Segoe UI, sans-serif';
    var w = Math.ceil(x.measureText(text).width) + 48; c.width = w; c.height = fs + 40;
    x.font = '700 ' + fs + 'px system-ui, -apple-system, Segoe UI, sans-serif';
    if (opt.bg) { x.fillStyle = opt.bg; var r = 26; x.beginPath(); x.moveTo(r, 0); x.arcTo(w, 0, w, c.height, r); x.arcTo(w, c.height, 0, c.height, r); x.arcTo(0, c.height, 0, 0, r); x.arcTo(0, 0, w, 0, r); x.fill(); }
    x.fillStyle = opt.color || '#fff'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(text, w / 2, c.height / 2 + 2);
    var tex = new T.CanvasTexture(c); tex.anisotropy = 4;
    var m = new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: opt.depthTest !== false });
    var s = new T.Sprite(m), h = opt.size || 0.4; s.scale.set(h * w / c.height, h, 1);
    return s;
  }
  function lazy3d(name, title, lead, extra, build) {
    HubWidgets.register(name, function (box) {
      var q = shell(box, title, lead, '<div class="wg3-slot"><div class="wg3-load">Загружаю 3D…</div></div>' + (extra || ''), '3D');
      loadThree().then(function () {
        var slot = q('.wg3-slot'); slot.innerHTML = '';
        build(slot, q);
      }, function () { q('.wg3-slot').innerHTML = '<div class="wg-out">Не удалось загрузить 3D. Проверь интернет и обнови страницу.</div>'; });
    });
  }
  function ease(a, b, k) { return a + (b - a) * k; }

  /* ---------- 1. Пещера Платона ---------- */
  lazy3d('cave3d', 'Пещера Платона',
    'Узники видят на стене только тени. Так и мы живём в мире представлений. Переключай взгляд кнопками.',
    '<div class="wg-chips wg-seg"><button class="wg-chip on" data-s="0">👁 Взгляд узника</button><button class="wg-chip" data-s="1">🔥 Обернуться</button><button class="wg-chip" data-s="2">☀️ Выйти из пещеры</button></div><div class="wg-out"></div>',
    function (slot, q) {
      var S = stage(slot, { shadows: true, bg: '#07080f', hint: '↔ Покрути пальцем', ratio: 0.75 }); if (!S) return;
      var T = S.T, P = S.pivot;
      var stone = new T.MeshStandardMaterial({ color: 0x6b5a4a, roughness: 0.95 });
      var floor = new T.Mesh(new T.PlaneGeometry(16, 20), stone); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; P.add(floor);
      var wall = new T.Mesh(new T.PlaneGeometry(16, 8), new T.MeshStandardMaterial({ color: 0xa8906f, roughness: 1 })); wall.position.set(0, 4, -6); wall.receiveShadow = true; P.add(wall);
      [-1, 1].forEach(function (s) { var side = new T.Mesh(new T.PlaneGeometry(20, 8), stone); side.position.set(8 * s, 4, 3); side.rotation.y = -s * Math.PI / 2; P.add(side); });
      var roof = new T.Mesh(new T.PlaneGeometry(16, 20), stone); roof.position.set(0, 8, 3); roof.rotation.x = Math.PI / 2; P.add(roof);
      // выход к солнцу
      var sun = new T.Mesh(new T.CircleGeometry(1.6, 40), new T.MeshBasicMaterial({ color: 0xfff1c2 })); sun.position.set(0, 4.5, 12.9); sun.rotation.y = Math.PI; P.add(sun);
      var exitWall = new T.Mesh(new T.RingGeometry(1.6, 12, 48), new T.MeshBasicMaterial({ color: 0x3a2a1c })); exitWall.position.set(0, 4.5, 13); exitWall.rotation.y = Math.PI; P.add(exitWall);
      var daylight = new T.PointLight(0xfff0cc, 0, 30); daylight.position.set(0, 5, 11); P.add(daylight);
      var ideas = label(T, 'мир идей · воля', { size: 0.6, color: '#3a2a00', bg: 'rgba(255,236,170,.95)' }); ideas.position.set(0, 4.5, 12.6); P.add(ideas);
      // огонь
      var fire = new T.SpotLight(0xffa040, 2.2, 30, 0.95, 0.7, 1.2); fire.position.set(0, 1.1, 5); fire.castShadow = true; fire.shadow.mapSize.set(1024, 1024); fire.shadow.bias = -0.002; fire.shadow.camera.near = 0.5; fire.shadow.camera.far = 30;
      fire.target.position.set(0, 2.2, -6); P.add(fire); P.add(fire.target);
      var glow = new T.PointLight(0xff8a30, 0.6, 8, 2); glow.position.set(0, 1, 5); P.add(glow);
      var flames = [];
      for (var i = 0; i < 7; i++) {
        var f = new T.Mesh(new T.ConeGeometry(0.18 + Math.random() * 0.15, 0.7 + Math.random() * 0.6, 8), new T.MeshBasicMaterial({ color: i % 2 ? 0xffcf4a : 0xff6a1a, transparent: true, opacity: 0.85 }));
        f.position.set((Math.random() - 0.5) * 0.6, 0.45, 5 + (Math.random() - 0.5) * 0.6); f.userData.ph = Math.random() * 6; P.add(f); flames.push(f);
      }
      var logs = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1.2, 8), new T.MeshStandardMaterial({ color: 0x3a2412 })); logs.rotation.z = Math.PI / 2; logs.position.set(0, 0.08, 5); P.add(logs);
      P.add(new T.AmbientLight(0x5a4a60, 0.6));
      // невысокая стена и «вещи», которые проносят вдоль неё
      var low = new T.Mesh(new T.BoxGeometry(10, 1, 0.3), stone); low.position.set(0, 0.5, 1); low.castShadow = true; low.receiveShadow = true; P.add(low);
      var geos = [new T.BoxGeometry(0.6, 0.6, 0.6), new T.SphereGeometry(0.38, 24, 16), new T.ConeGeometry(0.38, 0.8, 24), new T.TorusGeometry(0.3, 0.11, 12, 32), new T.TorusKnotGeometry(0.22, 0.08, 64, 8)];
      var cols = [0xe0a96d, 0x8fb8ff, 0xf07a6a, 0x7fd6a8, 0xd9a2ff];
      var things = geos.map(function (g, k) {
        var m = new T.Mesh(g, new T.MeshStandardMaterial({ color: cols[k], roughness: 0.5 })); m.castShadow = true;
        var stick = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.9, 6), new T.MeshStandardMaterial({ color: 0x2b1d12 })); stick.position.y = -0.6; stick.castShadow = true; m.add(stick);
        m.userData.off = k * 1.6; P.add(m); return m;
      });
      // узники
      var skin = new T.MeshStandardMaterial({ color: 0x8a7462, roughness: 0.9 });
      for (var j = 0; j < 4; j++) {
        var g = new T.Group();
        var body = new T.Mesh(new T.CylinderGeometry(0.28, 0.36, 1.0, 12), skin); body.position.y = 0.5;
        var head = new T.Mesh(new T.SphereGeometry(0.22, 16, 12), skin); head.position.y = 1.2;
        g.add(body); g.add(head); g.position.set(-2.4 + j * 1.6, 0, -2.6); P.add(g);
        var chain = new T.Mesh(new T.TorusGeometry(0.33, 0.04, 6, 20), new T.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.4 })); chain.rotation.x = Math.PI / 2; chain.position.set(-2.4 + j * 1.6, 0.45, -2.6); P.add(chain);
      }
      var shadowsLbl = label(T, 'тени = представления', { size: 0.5, color: '#2a1f14', bg: 'rgba(255,240,210,.75)' }); shadowsLbl.position.set(0, 4.6, -5.9); P.add(shadowsLbl);
      var thingsLbl = label(T, 'сами вещи', { size: 0.4, color: '#fff', bg: 'rgba(0,0,0,.55)' }); thingsLbl.position.set(0, 2.8, 1); thingsLbl.visible = false; P.add(thingsLbl);
      var views = [
        { p: [0, 2.4, 0.2], l: [0, 2.4, -6], t: '<b>Взгляд узника.</b> Узники с рождения прикованы и видят только тени на стене. Для них тени и есть реальность. У Шопенгауэра это <b>мир как представление</b>: мы видим образы вещей в своём сознании, а не сам мир.' },
        { p: [5.5, 3.6, -3.5], l: [0, 1.4, 2.4], t: '<b>Обернуться.</b> За спиной — огонь и вещи, которые проносят вдоль стены. Тень оказывается лишь отражением. Это первый шаг философа: понять, что видимое — не последняя реальность.' },
        { p: [0, 3.4, 5.6], l: [0, 4.5, 13], t: '<b>Выход к солнцу.</b> У Платона это мир идей. Шопенгауэр называл своими учителями Платона и Канта, но за покровом у него не разумные идеи, а <b>слепая воля</b>.' }
      ];
      var cur = 0, cp = new T.Vector3().fromArray(views[0].p), cl = new T.Vector3().fromArray(views[0].l);
      function set(k) {
        cur = k; q('.wg-out').innerHTML = views[k].t;
        Array.prototype.forEach.call(q('.wg-seg').children, function (b, i) { b.classList.toggle('on', i === k); });
      }
      q('.wg-seg').onclick = function (e) { var b = e.target.closest('[data-s]'); if (b) set(+b.dataset.s); };
      set(0);
      S.onFrame(function (t) {
        things.forEach(function (m) { var x = ((t * 0.5 + m.userData.off) % 8) - 4; m.position.set(x, 1.7, 1); m.rotation.y = t + m.userData.off; });
        flames.forEach(function (f) { var s = 0.8 + 0.35 * Math.sin(t * 9 + f.userData.ph) + 0.15 * Math.sin(t * 23 + f.userData.ph); f.scale.set(1, s, 1); });
        fire.intensity = 2.1 + 0.3 * Math.sin(t * 11) + 0.2 * Math.sin(t * 27);
        var v = views[cur]; cp.lerp(new T.Vector3().fromArray(v.p), 0.05); cl.lerp(new T.Vector3().fromArray(v.l), 0.05);
        S.camera.position.copy(cp); S.camera.lookAt(cl);
        var day = cur === 2 ? 1 : 0; daylight.intensity = ease(daylight.intensity, day * 2.5, 0.04);
        thingsLbl.visible = cur === 1;
      });
    });

  /* ---------- 2. Воля под покрывалом ---------- */
  lazy3d('will3d', 'Мир как воля: что под покрывалом',
    'Внизу — океан воли, сверху — покрывало с отдельными «вещами». Сдвигай ползунок и смотри, как все вещи оказываются нитями одного потока.',
    '<div class="wg-ctl"><label><span class="n">Прозрачность покрывала</span><input class="a" type="range" min="0" max="100" value="15"><b class="av"></b></label></div><div class="wg-out"></div>',
    function (slot, q) {
      var S = stage(slot, { autoRotate: 0.12, ratio: 0.72, tilt: true }); if (!S) return;
      var T = S.T, P = S.pivot, acc = new T.Color(css('--accent')), gold = new T.Color(css('--gold'));
      S.camera.position.set(0, 4.6, 7.4); S.camera.lookAt(0, 0.4, 0);
      P.add(new T.AmbientLight(0xffffff, 0.7)); var dl = new T.DirectionalLight(0xffffff, 0.8); dl.position.set(3, 6, 4); S.scene.add(dl);
      var N = 70, pos = new Float32Array(N * N * 3), base = [];
      for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) { var k = (i * N + j) * 3; pos[k] = (i / (N - 1) - 0.5) * 9; pos[k + 2] = (j / (N - 1) - 0.5) * 9; }
      var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
      var pm = new T.PointsMaterial({ color: acc, size: 0.09, transparent: true, opacity: 0.9, blending: isLight() ? T.NormalBlending : T.AdditiveBlending, depthWrite: false });
      var sea = new T.Points(pg, pm); sea.position.y = -0.6; P.add(sea);
      var veil = new T.Mesh(new T.PlaneGeometry(8, 8, 1, 1), new T.MeshStandardMaterial({ color: new T.Color(css('--panel')).lerp(acc, 0.12), transparent: true, opacity: 0.85, side: T.DoubleSide, roughness: 0.6 }));
      veil.rotation.x = -Math.PI / 2; veil.position.y = 1.2; P.add(veil);
      var names = ['Я', 'Другой', 'Деньги', 'Слава', 'Наука', 'Дом'], cubes = [], threads = [];
      names.forEach(function (n, k) {
        var a = k / names.length * Math.PI * 2, r = 2.3;
        var m = new T.Mesh(new T.BoxGeometry(0.7, 0.7, 0.7), new T.MeshStandardMaterial({ color: gold, transparent: true, roughness: 0.4 }));
        m.position.set(Math.cos(a) * r, 1.6, Math.sin(a) * r); P.add(m); cubes.push(m);
        var l = label(T, n, { size: 0.32, color: '#fff', bg: 'rgba(20,24,48,.8)' }); l.position.set(0, 0.7, 0); m.add(l);
        var lg = new T.BufferGeometry().setFromPoints([new T.Vector3(m.position.x, 1.25, m.position.z), new T.Vector3(m.position.x * 0.2, -0.6, m.position.z * 0.2)]);
        var th = new T.Line(lg, new T.LineBasicMaterial({ color: acc, transparent: true, opacity: 0 })); P.add(th); threads.push(th);
      });
      var will = label(T, 'ВОЛЯ', { size: 0.7, color: '#fff', bg: 'rgba(47,91,217,.85)', depthTest: false }); will.position.set(0, -0.1, 0); P.add(will);
      function out() {
        var t = +q('.a').value; q('.av').textContent = t + '%';
        q('.wg-out').innerHTML = t < 35 ? '<b>Мир как представление.</b> Видны только отдельные вещи. Каждый считает себя центром, другой для него — объект. Это мир страдающих эгоистов.'
          : t < 75 ? '<b>Покрывало истончается.</b> Так мир видит гений или тот, кто сострадает: под вещами угадывается общее движение.'
          : '<b>Всё — проявления одной воли.</b> «Я», «другой», деньги и слава — нити одного слепого потока. Отсюда и сострадание: причиняя боль другому, воля ранит саму себя.';
      }
      q('.a').addEventListener('input', out); out();
      S.onFrame(function (t) {
        var k = +q('.a').value / 100, amp = 0.25 + 0.55 * k, p = pg.attributes.position.array;
        for (var i = 0; i < p.length; i += 3) { var x = p[i], z = p[i + 2]; p[i + 1] = amp * (Math.sin(x * 0.9 + t * 1.3) * 0.6 + Math.sin(z * 1.3 - t * 1.1) * 0.4 + Math.sin((x + z) * 0.7 + t * 0.7) * 0.5); }
        pg.attributes.position.needsUpdate = true;
        veil.material.opacity = 0.88 * (1 - k);
        cubes.forEach(function (m, n) { m.material.opacity = 1 - 0.75 * k; m.rotation.y = t * 0.5 + n; m.position.y = 1.6 + 0.08 * Math.sin(t * 2 + n); });
        threads.forEach(function (l) { l.material.opacity = Math.max(0, (k - 0.35) * 1.5); });
        will.material.opacity = Math.max(0, (k - 0.5) * 2); pm.size = 0.08 + 0.05 * k;
      });
    });

  /* ---------- 3. Маятник: страдание и скука ---------- */
  lazy3d('pendulum3d', 'Маятник жизни: страдание ↔ скука',
    'Образ Шопенгауэра: жизнь качается между страданием (желание не исполнено) и скукой (исполнено). Счастье — только миг посередине.',
    '<div class="wg-chips wg-seg"><button class="wg-chip" data-k="1">✨ Исполнить желание</button><button class="wg-chip" data-k="-1">🎯 Новое желание</button></div><div class="wg-out"></div>',
    function (slot, q) {
      var S = stage(slot, { ratio: 0.7 }); if (!S) return;
      var T = S.T, P = S.pivot, bad = new T.Color(css('--bad')), acc = new T.Color(css('--accent')), ok = new T.Color(css('--ok')), gold = new T.Color(css('--gold'));
      S.camera.position.set(0, 2.2, 8.2); S.camera.lookAt(0, 1.6, 0);
      P.add(new T.AmbientLight(0xffffff, 0.6)); var dl = new T.DirectionalLight(0xffffff, 0.9); dl.position.set(2, 6, 5); S.scene.add(dl);
      var L = 3.4, top = new T.Vector3(0, 4.6, 0);
      var beam = new T.Mesh(new T.BoxGeometry(3, 0.15, 0.4), new T.MeshStandardMaterial({ color: 0x8890a8 })); beam.position.copy(top); P.add(beam);
      var arm = new T.Group(); arm.position.copy(top); P.add(arm);
      var rod = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, L, 8), new T.MeshStandardMaterial({ color: 0xb8bed0, metalness: 0.6 })); rod.position.y = -L / 2; arm.add(rod);
      var bob = new T.Mesh(new T.SphereGeometry(0.42, 32, 24), new T.MeshStandardMaterial({ color: gold, metalness: 0.5, roughness: 0.3 })); bob.position.y = -L; arm.add(bob);
      function arc(a0, a1, color) {
        var g = new T.RingGeometry(L - 0.25, L + 0.25, 40, 1, -Math.PI / 2 + a0, a1 - a0);
        var m = new T.Mesh(g, new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.7, side: T.DoubleSide })); m.position.copy(top); m.position.z = -0.5; P.add(m); return m;
      }
      var A = 0.95;
      var zs = arc(-A, -0.08, bad), zh = arc(-0.08, 0.08, ok), zb = arc(0.08, A, acc);
      var l1 = label(T, 'СТРАДАНИЕ', { size: 0.45, color: '#fff', bg: 'rgba(200,60,50,.85)' }); l1.position.set(-2.5, 0.9, -0.4); P.add(l1);
      var l2 = label(T, 'СКУКА', { size: 0.45, color: '#fff', bg: 'rgba(47,91,217,.85)' }); l2.position.set(2.5, 0.9, -0.4); P.add(l2);
      var l3 = label(T, 'счастье?', { size: 0.36, color: '#fff', bg: 'rgba(40,150,100,.85)' }); l3.position.set(0, 0.55, -0.4); P.add(l3);
      var th = -0.8, w = 0, trailN = 40, trail = [], tg = new T.BufferGeometry(), tp = new Float32Array(trailN * 3);
      tg.setAttribute('position', new T.BufferAttribute(tp, 3));
      P.add(new T.Line(tg, new T.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.6 })));
      q('.wg-seg').onclick = function (e) { var b = e.target.closest('[data-k]'); if (!b) return; w += 1.6 * +b.dataset.k; };
      var zone = '';
      S.onFrame(function (t, dt) {
        var steps = 4; for (var s = 0; s < steps; s++) { var h = dt / steps; w += (-9.8 / L * Math.sin(th)) * h; th += w * h; }
        if (Math.abs(th) > 1.3) { th = Math.sign(th) * 1.3; w *= -0.5; }
        arm.rotation.z = th;
        var bx = top.x + Math.sin(th) * L, by = top.y - Math.cos(th) * L;
        trail.unshift([bx, by]); if (trail.length > trailN) trail.pop();
        for (var i = 0; i < trailN; i++) { var p = trail[Math.min(i, trail.length - 1)]; tp[i * 3] = p[0]; tp[i * 3 + 1] = p[1]; tp[i * 3 + 2] = 0; }
        tg.attributes.position.needsUpdate = true;
        var z = th < -0.08 ? 's' : th > 0.08 ? 'b' : 'h';
        zs.material.opacity = z === 's' ? 0.9 : 0.35; zb.material.opacity = z === 'b' ? 0.9 : 0.35; zh.material.opacity = z === 'h' ? 1 : 0.4;
        if (z !== zone && z !== 'h') {
          zone = z;
          q('.wg-out').innerHTML = z === 's' ? '<b>Страдание.</b> Желание ещё не исполнено: нам чего-то не хватает, и это мучит.' : '<b>Скука.</b> Желание исполнено — и радость тут же гаснет. Воля требует нового желания.';
        }
      });
    });

  /* ---------- 4. Аполлон и Дионис ---------- */
  lazy3d('apollo3d', 'Аполлоническое и дионисийское',
    'По Ницше, греческая трагедия рождается из союза двух начал. Слева — кристалл Аполлона, справа — хаос Диониса. Сдвинь баланс.',
    '<div class="wg-ctl"><label><span class="n">☀️ Аполлон ↔ Дионис 🍇</span><input class="a" type="range" min="0" max="100" value="50"><b class="av"></b></label></div><div class="wg-out"></div>',
    function (slot, q) {
      var S = stage(slot, { autoRotate: 0.25, ratio: 0.72, tilt: true }); if (!S) return;
      var T = S.T, P = S.pivot, gold = new T.Color(css('--gold')), purple = new T.Color('#9b5cff');
      S.camera.position.set(0, 0.6, 6.4); S.camera.lookAt(0, 0, 0);
      P.add(new T.AmbientLight(0xffffff, 0.45)); var dl = new T.DirectionalLight(0xffffff, 1.0); dl.position.set(3, 4, 5); S.scene.add(dl);
      var pl = new T.PointLight(0xb070ff, 1.2, 12); pl.position.set(-2, -1, 3); S.scene.add(pl);
      var crystal = new T.Mesh(new T.IcosahedronGeometry(1.25, 0), new T.MeshStandardMaterial({ color: gold, metalness: 0.6, roughness: 0.25, flatShading: true }));
      var wire = new T.LineSegments(new T.EdgesGeometry(crystal.geometry), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })); crystal.add(wire);
      P.add(crystal);
      var bg = new T.IcosahedronGeometry(1.25, 4), bpos = bg.attributes.position.array.slice();
      var blob = new T.Mesh(bg, new T.MeshStandardMaterial({ color: purple, roughness: 0.35, metalness: 0.1, transparent: true, emissive: purple, emissiveIntensity: 0.25 }));
      P.add(blob);
      var M = 500, pp = new Float32Array(M * 3), seeds = [];
      for (var i = 0; i < M; i++) seeds.push([Math.random() * Math.PI * 2, (Math.random() - 0.5) * 2, Math.random(), Math.random() * 6]);
      var pgeo = new T.BufferGeometry(); pgeo.setAttribute('position', new T.BufferAttribute(pp, 3));
      var pts = new T.Points(pgeo, new T.PointsMaterial({ color: 0xffffff, size: 0.075, transparent: true, opacity: 0.95 })); P.add(pts);
      function out() {
        var d = +q('.a').value; q('.av').textContent = d + '%';
        q('.wg-out').innerHTML = d < 30 ? '<b>Перевес Аполлона:</b> мера, форма, ясность, разум. Красиво, но мертво. Так Ницше видел рационализм и позитивизм своего времени.'
          : d > 70 ? '<b>Перевес Диониса:</b> экстаз, хаос, растворение личности в потоке жизни. Сила есть, а формы нет.'
          : '<b>Гармония двух начал</b> — это и есть античная трагедия. Дионисийское даёт творчество, а творчество — это свобода; аполлоническое даёт ему форму.';
      }
      q('.a').addEventListener('input', out); out();
      S.onFrame(function (t) {
        var d = +q('.a').value / 100, a = bg.attributes.position.array;
        crystal.scale.setScalar(Math.max(0.001, 1.15 - d)); crystal.rotation.set(t * 0.3, t * 0.4, 0);
        for (var i = 0; i < a.length; i += 3) {
          var x = bpos[i], y = bpos[i + 1], z = bpos[i + 2];
          var n = 1 + d * 0.45 * (Math.sin(x * 3 + t * 2.1) * Math.sin(y * 3.4 + t * 1.7) + 0.6 * Math.sin(z * 4.2 - t * 2.6));
          a[i] = x * n; a[i + 1] = y * n; a[i + 2] = z * n;
        }
        bg.attributes.position.needsUpdate = true; bg.computeVertexNormals();
        blob.scale.setScalar(0.25 + d * 0.95); blob.material.opacity = 0.25 + 0.7 * d;
        for (var j = 0; j < M; j++) {
          var s = seeds[j], ang = s[0] + t * (0.4 + s[2] * 0.3);
          var ox = Math.cos(ang) * 2.1, oy = s[1] * 0.12, oz = Math.sin(ang) * 2.1;
          var r = 1.4 + s[2] * 1.6, cx = Math.cos(ang * 1.7 + s[3]) * r, cy = Math.sin(t * 0.9 + s[3]) * r * 0.8, cz = Math.sin(ang * 1.3 + s[3] * 2) * r;
          pp[j * 3] = ease(ox, cx, d); pp[j * 3 + 1] = ease(oy, cy, d); pp[j * 3 + 2] = ease(oz, cz, d);
        }
        pgeo.attributes.position.needsUpdate = true;
        pts.material.color.copy(gold).lerp(purple, d);
      });
    });

  /* ---------- 5. Лента жизни (2D) ---------- */
  HubWidgets.register('lifelines', function (box) {
    var P = [
      ['Гёте', 1749, 1832, 'Друг семьи: бывал в салоне матери Шопенгауэра в Веймаре.'],
      ['Гегель', 1770, 1831, 'Главный соперник. Шопенгауэр ставил свои лекции на то же время — и проиграл.'],
      ['Шопенгауэр', 1788, 1860, '«Мир как воля и представление» (1819). Признание пришло только в старости.', 1],
      ['Вагнер', 1813, 1883, 'Композитор. Под влиянием Шопенгауэра совершил революцию в музыке.'],
      ['Дильтей', 1833, 1911, 'Философия жизни: понимание через переживание.'],
      ['Ницше', 1844, 1900, '«Шопенгауэр написал это для меня». «Рождение трагедии из духа музыки» (1872).', 1],
      ['Зиммель', 1858, 1918, 'Философия жизни и культуры.'],
      ['Бергсон', 1859, 1941, 'Жизненный порыв, интуиция.']
    ];
    var EV = [[1819, 'Мир как воля…'], [1820, 'лекции против Гегеля'], [1851, 'слава'], [1872, 'Рождение трагедии']];
    var q = shell(box, 'Кто когда жил', 'Двигай год и смотри, кто из героев лекции жив и сколько ему лет. Нажми на имя — появится подсказка.',
      '<svg viewBox="0 0 640 400"></svg><div class="wg-ctl"><label><span class="n">Год</span><input class="a" type="range" min="1749" max="1941" value="1820"><b class="av"></b></label></div><div class="wg-out"></div>', 'Схема');
    var sel = 2, X0 = 1745, X1 = 1945, L = 118, R = 626;
    function X(y) { return L + (y - X0) / (X1 - X0) * (R - L); }
    function draw() {
      var yr = +q('.a').value, svg = q('svg'); q('.av').textContent = yr; svg.innerHTML = '';
      for (var d = 1750; d <= 1940; d += 50) {
        svg.appendChild(el('line', { x1: X(d), x2: X(d), y1: 18, y2: 360, stroke: 'var(--line)' }));
        svg.appendChild(el('text', { x: X(d), y: 384, 'text-anchor': 'middle', style: 'font-size:16px;fill:var(--muted)' }, d));
      }
      P.forEach(function (p, k) {
        var y = 34 + k * 41, alive = yr >= p[1] && yr <= p[2], g = el('g', { style: 'cursor:pointer' });
        g.appendChild(el('rect', { x: X(p[1]), y: y - 12, width: X(p[2]) - X(p[1]), height: 24, rx: 12, fill: p[4] ? 'var(--gold)' : 'var(--accent)', opacity: alive ? 0.95 : 0.3, stroke: k === sel ? 'var(--ink)' : 'none', 'stroke-width': 2 }));
        g.appendChild(el('text', { x: L - 8, y: y + 6, 'text-anchor': 'end', style: 'font-size:17px;font-weight:' + (k === sel ? 800 : 600) + ';fill:var(--ink)' }, p[0]));
        if (alive) g.appendChild(el('text', { x: Math.min(X(p[2]) - 6, Math.max(X(yr) + 8, X(p[1]) + 6)), y: y + 6, 'text-anchor': X(yr) + 60 > X(p[2]) ? 'end' : 'start', style: 'font-size:15px;font-weight:700;fill:#fff' }, (yr - p[1]) + ' лет'));
        g.addEventListener('click', function () { sel = k; draw(); });
        svg.appendChild(g);
      });
      EV.forEach(function (e, k) {
        svg.appendChild(el('circle', { cx: X(e[0]), cy: 12 + 0 * k, r: 4, fill: 'var(--bad)' }));
      });
      svg.appendChild(el('line', { x1: X(yr), x2: X(yr), y1: 14, y2: 362, stroke: 'var(--bad)', 'stroke-width': 3 }));
      var ev = EV.filter(function (e) { return Math.abs(e[0] - yr) <= 2; })[0];
      var p = P[sel], st = yr < p[1] ? 'ещё не родился' : yr > p[2] ? 'уже умер' : (yr - p[1]) + ' лет';
      q('.wg-out').innerHTML = (ev ? '📌 <b>' + ev[0] + ': ' + ev[1] + '</b><br>' : '') + '<b>' + p[0] + '</b> (' + p[1] + '–' + p[2] + '), в ' + yr + ' — ' + st + '. ' + p[3];
    }
    q('.a').addEventListener('input', draw); draw();
  });

  /* ---------- 6. Две аудитории: Гегель и Шопенгауэр ---------- */
  HubWidgets.register('halls', function (box) {
    var q = shell(box, 'Берлин, 1820: лекции в одно время', 'Шопенгауэр назначил свой курс на тот же час, что и Гегель. Нажми «Звонок» и посмотри, куда пойдут студенты.',
      '<svg viewBox="0 0 640 360"></svg><div class="wg-chips"><button class="wg-chip on" id="bell" style="text-align:center">🔔 Звонок</button></div><div class="wg-out">Студенты в коридоре ждут начала.</div>', 'Анимация');
    var svg = q('svg'), dots = [], N = 48, raf = 0;
    function room(x, title, color) {
      svg.appendChild(el('rect', { x: x, y: 20, width: 270, height: 190, rx: 18, fill: 'var(--panel2)', stroke: color, 'stroke-width': 3 }));
      svg.appendChild(el('text', { x: x + 135, y: 52, 'text-anchor': 'middle', style: 'font-size:20px;font-weight:800;fill:var(--ink)' }, title));
      svg.appendChild(el('rect', { x: x + 110, y: 204, width: 50, height: 12, fill: 'var(--panel)' }));
    }
    function reset() {
      svg.innerHTML = '';
      room(30, 'Гегель', 'var(--accent)'); room(340, 'Шопенгауэр', 'var(--gold)');
      svg.appendChild(el('rect', { x: 10, y: 250, width: 620, height: 96, rx: 16, fill: 'var(--panel2)', opacity: 0.6 }));
      svg.appendChild(el('text', { x: 320, y: 340, 'text-anchor': 'middle', style: 'font-size:15px;fill:var(--muted)' }, 'коридор'));
      svg.appendChild(el('text', { x: 165, y: 196, 'text-anchor': 'middle', class: 'cH', style: 'font-size:18px;font-weight:700;fill:var(--accent)' }, ''));
      svg.appendChild(el('text', { x: 475, y: 196, 'text-anchor': 'middle', class: 'cS', style: 'font-size:18px;font-weight:700;fill:var(--gold)' }, ''));
      dots = [];
      for (var i = 0; i < N; i++) {
        var c = el('circle', { r: 7, fill: 'var(--muted)' });
        var d = { c: c, x: 30 + Math.random() * 580, y: 268 + Math.random() * 56, to: i < 3 ? 1 : 0, delay: Math.random() * 1.2, k: i };
        c.setAttribute('cx', d.x); c.setAttribute('cy', d.y); svg.appendChild(c); dots.push(d);
      }
      dots.sort(function () { return Math.random() - 0.5; });
    }
    reset();
    q('#bell').onclick = function () {
      cancelAnimationFrame(raf); reset();
      var hi = 0, si = 0;
      dots.forEach(function (d) {
        var rx = d.to ? 340 : 30, slot = d.to ? si++ : hi++;
        d.tx = rx + 30 + (slot % 10) * 23; d.ty = 76 + Math.floor(slot / 10) * 20;
        d.c.setAttribute('fill', d.to ? 'var(--gold)' : 'var(--accent)');
      });
      var t0 = performance.now();
      (function step(now) {
        var t = (now - t0) / 1000, done = true;
        dots.forEach(function (d) {
          var k = Math.max(0, Math.min(1, (t - d.delay) / 1.4)); if (k < 1) done = false;
          var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var door = (d.to ? 475 : 165), mid = k < 0.5;
          var x = mid ? ease(d.x, door, e * 2) : ease(door, d.tx, (e - 0.5) * 2), y = mid ? ease(d.y, 230, e * 2) : ease(230, d.ty, (e - 0.5) * 2);
          d.c.setAttribute('cx', x); d.c.setAttribute('cy', y);
        });
        if (done) {
          svg.querySelector('.cH').textContent = (N - 3) + ' слушателей';
          svg.querySelector('.cS').textContent = 'единицы';
          q('.wg-out').innerHTML = 'Почти все пошли к знаменитому Гегелю. На курс Шопенгауэра записались <b>единицы</b>, и курс быстро закрылся. Обиду на Гегеля он пронёс через всю жизнь.';
        } else raf = requestAnimationFrame(step);
      })(t0);
    };
  });

  /* ---------- 7. Карта идей ---------- */
  HubWidgets.register('ideamap', function (box) {
    var N = {
      plato: [110, 50, 'Платон', 'Мир теней и мир идей. Один из двух «учителей» Шопенгауэра.'],
      kant: [320, 50, 'Кант', 'Мы знаем только явления, а не вещь в себе. Второй «учитель».'],
      india: [530, 50, 'Индия', 'Брахманизм и буддизм: покрывало Майи, нирвана.'],
      will: [320, 150, 'ВОЛЯ', 'Вечная, слепая, ничем не обоснованная основа мира. Постигается интуицией.'],
      rep: [320, 245, 'Представление', 'Мир, каким он видится нам: отдельные вещи под покрывалом Майи.'],
      ego: [320, 340, 'Страдающий эгоист', 'Каждый видит себя центром, а другого — объектом. Желания не кончаются → страдание.'],
      pess: [540, 340, 'Пессимизм', 'Счастье — лишь временное отсутствие страдания. Маятник: страдание ↔ скука.'],
      genius: [110, 440, 'Гений, музыка', 'Путь 1. Делает покрывало прозрачным на время. Музыка выражает саму волю.'],
      comp: [320, 440, 'Сострадание', 'Путь 2. Другой — та же воля, что и я. Этика отказа от эгоизма.'],
      asc: [530, 440, 'Аскеза', 'Путь 3. Отрицание воли, угасание желаний. Близко к нирване.'],
      wagner: [110, 540, 'Вагнер', 'Музыка как прямой голос воли.'],
      nietz: [470, 540, 'Ницше', 'Берёт волю и музыку, но вместо отказа от воли — её утверждение через творчество.']
    };
    var E = [['plato', 'will'], ['kant', 'will'], ['india', 'rep'], ['will', 'rep'], ['rep', 'ego'], ['ego', 'pess'], ['ego', 'genius'], ['ego', 'comp'], ['ego', 'asc'], ['genius', 'wagner'], ['genius', 'nietz'], ['will', 'nietz', 1]];
    var q = shell(box, 'Карта идей Шопенгауэра', 'Нажми на любой узел: подсветятся связи и появится пояснение.', '<svg viewBox="0 0 640 580"></svg><div class="wg-out">Начни с узла «ВОЛЯ».</div>', 'Схема');
    var svg = q('svg'), sel = 'will';
    function draw() {
      svg.innerHTML = '';
      var defs = el('defs', {}); var mk = el('marker', { id: 'ar', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 12, markerHeight: 12, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' });
      mk.appendChild(el('path', { d: 'M0 0L10 5L0 10z', fill: 'var(--muted)' })); defs.appendChild(mk); svg.appendChild(defs);
      E.forEach(function (e) {
        var a = N[e[0]], b = N[e[1]], on = e[0] === sel || e[1] === sel;
        var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len;
        var st = { stroke: on ? 'var(--accent)' : 'var(--muted)', 'stroke-opacity': on ? 1 : 0.45, 'stroke-width': on ? 4 : 2.5, fill: 'none', 'marker-end': 'url(#ar)' };
        if (e[2]) { st.d = 'M' + (a[0] + 70) + ' ' + a[1] + ' C 640 ' + a[1] + ' 640 ' + b[1] + ' ' + (b[0] + 50) + ' ' + (b[1] - 20); svg.appendChild(el('path', st)); return; }
        st.x1 = a[0] + ux * 30; st.y1 = a[1] + uy * 26; st.x2 = b[0] - ux * 34; st.y2 = b[1] - uy * 28;
        svg.appendChild(el('line', st));
      });
      Object.keys(N).forEach(function (k) {
        var n = N[k], on = k === sel, near = E.some(function (e) { return (e[0] === sel && e[1] === k) || (e[1] === sel && e[0] === k); });
        var w = Math.max(110, n[2].length * 12 + 30), g = el('g', { style: 'cursor:pointer' });
        g.appendChild(el('rect', { x: n[0] - w / 2, y: n[1] - 24, width: w, height: 48, rx: 24, fill: on ? 'var(--accent)' : k === 'will' ? 'var(--gold)' : 'var(--panel2)', stroke: near ? 'var(--accent)' : 'var(--line)', 'stroke-width': near ? 3 : 1.5 }));
        g.appendChild(el('text', { x: n[0], y: n[1] + 7, 'text-anchor': 'middle', style: 'font-size:19px;font-weight:700;fill:' + (on || k === 'will' ? '#fff' : 'var(--ink)') }, n[2]));
        g.addEventListener('click', function () { sel = k; draw(); });
        svg.appendChild(g);
      });
      q('.wg-out').innerHTML = '<b>' + N[sel][2] + '.</b> ' + N[sel][3];
    }
    draw();
  });
})();
