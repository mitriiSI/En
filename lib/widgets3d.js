/* 3D-сцены и визуализации для конспектов (three.js подгружается только когда нужен).
   В конспекте (Markdown) отдельной строкой:
     @@graph:mars-city3d@@   @@graph:mars-pyramid3d@@   @@graph:mars-organism3d@@   @@graph:mars-demos@@   @@graph:mars-network@@ */
(function () {
  'use strict';
  if (!window.HubWidgets || !HubWidgets.register) return;

  /* ---------- общая обвязка ---------- */
  var threeP = null, live = [];
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!threeP) threeP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = 'lib/three.min.js';
      s.onload = function () { res(window.THREE); }; s.onerror = function () { threeP = null; rej(); };
      document.head.appendChild(s);
    });
    return threeP;
  }
  function hasGL() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function css(n, d) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || d; }
  function shell(box, badge, title, lead, top, bottom) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">' + badge + '</span><b>' + title + '</b></div><p class="wg-lead">' + lead + '</p>' +
      (top || '') + '<div class="w3d"><div class="w3d-load">Загрузка 3D…</div><div class="w3d-hint">Крути пальцем · нажимай на объекты</div></div>' + (bottom || '') + '<div class="wg-out"></div>';
    return function (s) { return box.querySelector(s); };
  }
  function chip(txt, on) { var b = document.createElement('button'); b.className = 'wg-chip' + (on ? ' on' : ''); b.innerHTML = txt; return b; }
  function sweep() { live = live.filter(function (s) { if (document.body.contains(s.host)) return true; s.kill(); return false; }); }

  function boot(q, o, build) {
    var host = q('.w3d');
    if (!hasGL()) { host.querySelector('.w3d-load').textContent = 'Это устройство не поддерживает 3D (WebGL).'; return; }
    sweep();
    loadThree().then(function (T) { host.querySelector('.w3d-load').remove(); build(stage(T, host, o)); })
      .catch(function () { host.querySelector('.w3d-load').textContent = 'Не удалось загрузить 3D.'; });
  }

  function stage(T, host, o) {
    var ratio = o.ratio || 0.8;
    function size() { var w = host.clientWidth || 320, h = Math.round(Math.min(w * ratio, 460)); host.style.height = h + 'px'; return [w, h]; }
    var wh = size();
    var r = new T.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(wh[0], wh[1]);
    host.insertBefore(r.domElement, host.firstChild);
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(o.fov || 40, wh[0] / wh[1], 0.1, 300);
    sc.add(new T.HemisphereLight(0xffffff, 0x3a4256, 0.95));
    var dl = new T.DirectionalLight(0xffffff, 0.85); dl.position.set(6, 12, 7); sc.add(dl);
    var t0 = o.target || [0, 1, 0];
    var st = { theta: o.theta == null ? 0.7 : o.theta, phi: o.phi || 1.0, rad: o.rad || 14, target: new T.Vector3(t0[0], t0[1], t0[2]), auto: true };
    function place() {
      cam.position.set(st.target.x + st.rad * Math.sin(st.phi) * Math.sin(st.theta), st.target.y + st.rad * Math.cos(st.phi), st.target.z + st.rad * Math.sin(st.phi) * Math.cos(st.theta));
      cam.lookAt(st.target);
    }
    var cv = r.domElement, down = null, moved = 0, pickables = [], onPick = null;
    cv.style.touchAction = 'pan-y';
    cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; moved = 0; st.auto = false; });
    cv.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y; moved += Math.abs(dx) + Math.abs(dy);
      st.theta -= dx * 0.009; st.phi = Math.max(0.2, Math.min(1.5, st.phi - dy * 0.006)); down = { x: e.clientX, y: e.clientY };
    });
    cv.addEventListener('pointerup', function (e) { if (down && moved < 10 && onPick) pick(e); down = null; });
    cv.addEventListener('pointercancel', function () { down = null; });
    cv.addEventListener('wheel', function (e) { e.preventDefault(); st.rad = Math.max(o.minR || 6, Math.min(o.maxR || 40, st.rad * (1 + Math.sign(e.deltaY) * 0.08))); }, { passive: false });
    var rc = new T.Raycaster(), v2 = new T.Vector2();
    function pick(e) {
      var b = cv.getBoundingClientRect();
      v2.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1);
      rc.setFromCamera(v2, cam);
      var h = rc.intersectObjects(pickables, true);
      for (var i = 0; i < h.length; i++) { var ob = h[i].object; while (ob && !ob.userData.key) ob = ob.parent; if (ob && ob.visible !== false) { onPick(ob.userData.key, ob); return; } }
    }
    var labels = [], tmp = new T.Vector3();
    function label(obj, text, dy) {
      var d = document.createElement('div'); d.className = 'w3d-lb'; d.textContent = text; host.appendChild(d);
      var L = { o: obj, d: d, dy: dy || 0, remove: function () { d.remove(); labels.splice(labels.indexOf(L), 1); } };
      labels.push(L); return L;
    }
    function drawLabels() {
      var W = host.clientWidth, H = host.clientHeight;
      labels.forEach(function (L) {
        if (!L.o.visible || !L.o.parent) { L.d.style.display = 'none'; return; }
        L.o.getWorldPosition(tmp); tmp.y += L.dy; tmp.project(cam);
        if (tmp.z > 1) { L.d.style.display = 'none'; return; }
        L.d.style.display = ''; L.d.style.transform = 'translate(-50%,-100%) translate(' + ((tmp.x + 1) / 2 * W).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * H).toFixed(1) + 'px)';
      });
    }
    var frames = [], vis = false, raf = 0, clock = new T.Clock(), dead = false;
    function loop() {
      raf = 0; if (dead || !vis) return;
      if (!document.body.contains(host)) { sweep(); return; }
      var dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
      if (st.auto) st.theta += dt * (o.spin == null ? 0.18 : o.spin);
      frames.forEach(function (f) { f(dt, t); });
      place(); r.render(sc, cam); drawLabels();
      raf = requestAnimationFrame(loop);
    }
    var io = new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (vis && !raf) { clock.getDelta(); raf = requestAnimationFrame(loop); } });
    io.observe(host);
    var ro = new ResizeObserver(function () { var s = size(); r.setSize(s[0], s[1]); cam.aspect = s[0] / s[1]; cam.updateProjectionMatrix(); });
    ro.observe(host);
    var S = {
      T: T, scene: sc, cam: cam, st: st, host: host, label: label,
      frame: function (f) { frames.push(f); }, pickable: function (ob) { pickables.push(ob); }, onPick: function (f) { onPick = f; },
      mat: function (c, ex) { var m = new T.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.04 }); if (ex) for (var k in ex) m[k] = ex[k]; return m; },
      kill: function () { dead = true; io.disconnect(); ro.disconnect(); try { r.dispose(); r.forceContextLoss(); } catch (e) {} }
    };
    live.push(S); place();
    return S;
  }
  function glow(group, color, on) {
    group.traverse(function (m) { if (m.material && m.material.emissive) { m.material.emissive.set(on ? color : 0x000000); m.material.emissiveIntensity = on ? 0.35 : 0; } });
  }
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  /* ---------- 1. Падуя XIV века ---------- */
  function city(box) {
    var q = shell(box, '3D', 'Падуя XIV века', 'Город-коммуна, где вырос Марсилий. Покрути город и нажимай на здания: кто здесь чем управлял.');
    boot(q, { rad: 24, phi: 0.92, target: [0, 0.6, 0], ratio: 0.82, minR: 10, maxR: 40 }, function (S) {
      var T = S.T, sc = S.scene, R = rnd(7), groups = {};
      var INFO = {
        ragione: '<b>Палаццо делла Раджоне</b> — ратуша и суд (<b>[ДОБАВЛЕНО]</b> построен в 1218–1219 гг.). Здесь заседали выборные органы коммуны. Граждане сами избирали руководство — на этот опыт опирается Марсилий: власть идёт от граждан.',
        basilica: '<b>Базилика святого Антония</b> (<b>[ДОБАВЛЕНО]</b> строилась с 1232 г.). По Марсилию, церковь учит вере и ведёт к спасению души, но не судит, не собирает налоги и не назначает власть.',
        univ: '<b>Падуанский университет</b> (<b>[ДОБАВЛЕНО]</b> основан в 1222 г.). Здесь Марсилий изучал медицину и философию — отсюда его сравнение: государство — организм, правитель — врач.',
        market: '<b>Рынок и гильдии.</b> Купцы и ремесленники — основа богатства города. С ростом капитала горожанам нужно было больше, чем «налоги в обмен на защиту». Главы гильдий входили в «лучшую часть» граждан, которая голосует.',
        walls: '<b>Городские стены.</b> Защита — древняя функция власти: налоги в обмен на безопасность. Но города Северной Италии хотели большего — самоуправления.',
        houses: '<b>Дома горожан.</b> Из десятков тысяч жителей голосовали лишь несколько сотен: главы семей, корпораций, гильдий.'
      };
      function G(key) { var g = new T.Group(); g.userData.key = key; groups[key] = g; sc.add(g); S.pickable(g); return g; }
      function box(g, w, h, d, x, z, c, y) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), S.mat(c)); m.position.set(x, (y || 0) + h / 2, z); g.add(m); return m; }

      var ground = new T.Mesh(new T.CylinderGeometry(12, 12.6, 0.5, 56), S.mat('#7d9a5c')); ground.position.y = -0.25; sc.add(ground);
      var river = new T.Mesh(new T.TorusGeometry(10.5, 0.38, 6, 60, Math.PI * 1.1), S.mat('#4f86c6', { roughness: 0.25, metalness: 0.2 }));
      river.rotation.x = Math.PI / 2; river.rotation.z = 0.4; river.position.y = 0.03; sc.add(river);

      var walls = G('walls'), wc = '#cdb68a', n = 40, WR = 8.8;
      for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, b = new T.Mesh(new T.BoxGeometry(1.45, 1.1, 0.45), S.mat(wc)); b.position.set(Math.sin(a) * WR, 0.55, Math.cos(a) * WR); b.rotation.y = a; walls.add(b); }
      for (var k = 0; k < 7; k++) {
        var a2 = k / 7 * Math.PI * 2 + 0.25, tw = new T.Mesh(new T.CylinderGeometry(0.55, 0.68, 2.1, 12), S.mat(wc)); tw.position.set(Math.sin(a2) * WR, 1.05, Math.cos(a2) * WR); walls.add(tw);
        var cap = new T.Mesh(new T.ConeGeometry(0.75, 0.9, 12), S.mat('#9c4b37')); cap.position.set(tw.position.x, 2.55, tw.position.z); walls.add(cap);
      }

      var rag = G('ragione');
      box(rag, 4.4, 1.9, 1.8, 0, 0, '#d79f68');
      var roof = new T.Mesh(new T.CylinderGeometry(0.9, 0.9, 4.5, 20), S.mat('#7f8a98', { metalness: 0.3, roughness: 0.4 })); roof.rotation.z = Math.PI / 2; roof.position.set(0, 1.9, 0); roof.scale.set(0.65, 1, 1); rag.add(roof);
      for (var p = -1.8; p <= 1.81; p += 0.6) { var col = new T.Mesh(new T.BoxGeometry(0.12, 0.9, 0.08), S.mat('#f2e2c4')); col.position.set(p, 0.45, 0.93); rag.add(col); }

      var bas = G('basilica'); bas.position.set(4.3, 0, -3.2); bas.rotation.y = -0.5;
      box(bas, 2.6, 1.7, 3.6, 0, 0, '#eadfc8');
      [-1, 0, 1].forEach(function (zz) { var d = new T.Mesh(new T.SphereGeometry(0.62, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), S.mat('#a7b3bf', { metalness: 0.3, roughness: 0.45 })); d.position.set(0, 1.7, zz * 1.1); bas.add(d); });
      [[-1.1, -1.9], [1.1, -1.9]].forEach(function (pp) { var m = new T.Mesh(new T.CylinderGeometry(0.17, 0.2, 3.2, 8), S.mat('#eadfc8')); m.position.set(pp[0], 1.6, pp[1]); bas.add(m); var c2 = new T.Mesh(new T.ConeGeometry(0.24, 0.6, 8), S.mat('#a7b3bf')); c2.position.set(pp[0], 3.5, pp[1]); bas.add(c2); });

      var uni = G('univ'); uni.position.set(-4.4, 0, -2.6); uni.rotation.y = 0.35;
      box(uni, 3, 1.4, 0.6, 0, -1.2, '#e6caa0'); box(uni, 3, 1.4, 0.6, 0, 1.2, '#e6caa0'); box(uni, 0.6, 1.4, 1.8, -1.2, 0, '#e6caa0'); box(uni, 0.6, 1.4, 1.8, 1.2, 0, '#e6caa0');
      box(uni, 0.7, 2.8, 0.7, 1.2, -1.2, '#d9b787');
      var ucap = new T.Mesh(new T.ConeGeometry(0.55, 0.7, 4), S.mat('#9c4b37')); ucap.position.set(1.2, 3.15, -1.2); ucap.rotation.y = Math.PI / 4; uni.add(ucap);

      var mk = G('market'); mk.position.set(-1.2, 0, 3.4);
      var awn = ['#e05d4b', '#f0c36b', '#4f86c6', '#4cc38a', '#b07ad8', '#e8955a'];
      for (var s = 0; s < 6; s++) {
        var sx = (s % 3) * 1.25 - 1.25, sz = Math.floor(s / 3) * 1.4 - 0.7;
        box(mk, 0.9, 0.55, 0.7, sx, sz, '#a97c50');
        var aw = new T.Mesh(new T.ConeGeometry(0.75, 0.55, 4), S.mat(awn[s])); aw.position.set(sx, 0.85, sz); aw.rotation.y = Math.PI / 4; mk.add(aw);
      }

      var hs = G('houses'), placed = 0, tries = 0, keep = [[0, 0, 3.2], [4.3, -3.2, 2.8], [-4.4, -2.6, 2.6], [-1.2, 3.4, 2.4]];
      var walls2 = ['#e9d6b4', '#e2c39b', '#f0e0c6', '#d9b48c'];
      while (placed < 70 && tries < 2000) {
        tries++;
        var x = (R() * 2 - 1) * 7.6, z = (R() * 2 - 1) * 7.6;
        if (x * x + z * z > 7.4 * 7.4) continue;
        if (keep.some(function (c) { var dx = x - c[0], dz = z - c[1]; return dx * dx + dz * dz < c[2] * c[2]; })) continue;
        var w = 0.6 + R() * 0.5, h = 0.6 + R() * 0.9, d = 0.6 + R() * 0.5;
        box(hs, w, h, d, x, z, walls2[placed % 4]);
        var rf = new T.Mesh(new T.ConeGeometry(Math.max(w, d) * 0.75, 0.45, 4), S.mat('#a8503a')); rf.position.set(x, h + 0.22, z); rf.rotation.y = Math.PI / 4; hs.add(rf);
        if (R() < 0.12) { var tt = new T.Mesh(new T.BoxGeometry(0.35, 2.4 + R(), 0.35), S.mat('#c9a77c')); tt.position.set(x + w / 2, (2.4) / 2, z); hs.add(tt); }
        placed++;
      }

      S.label(rag, 'Ратуша', 2.9); S.label(bas, 'Собор', 2.6); S.label(uni, 'Университет', 3.2); S.label(mk, 'Рынок', 1.5);
      var sel = null;
      S.onPick(function (key) {
        if (sel) glow(groups[sel], 0, false);
        sel = key; glow(groups[key], css('--accent', '#7aa2ff'), true);
        q('.wg-out').innerHTML = INFO[key];
      });
      q('.wg-out').innerHTML = 'Нажми на ратушу, собор, университет, рынок, дома или стены.';
    });
  }

  /* ---------- 2. Пирамида власти ---------- */
  function pyramid(box) {
    var MODELS = {
      pope: {
        n: 'Папская доктрина', flow: -1, color: '--bad',
        tiers: [
          { t: 'Народ', d: 'Народ только подчиняется. Его воля — не источник власти.' },
          { t: 'Короли и князья', d: 'Светские правители получают власть с одобрения папы. Отсюда спор Иоанна XXII с Людвигом Баварским.' },
          { t: 'Папа', d: 'Папа претендует на «полноту власти» (<b>[ДОБАВЛЕНО]</b> plenitudo potestatis): утверждает королей, судит, собирает налоги.' }
        ],
        top: 'Бог', topD: 'Источник власти в папской доктрине. Власть спускается <b>сверху вниз</b>: от Бога через папу к князьям и народу.',
        out: 'Частицы — это власть. Здесь она <b>стекает сверху вниз</b>: от Бога через папу. Церковь — вершина пирамиды.'
      },
      mars: {
        n: 'Модель Марсилия', flow: 1, color: '--ok',
        tiers: [
          { t: 'Народ', d: 'Основа и источник власти. Государство исполняет волю народа здесь, на земле.' },
          { t: 'Законодатель', d: '«Лучшая часть» граждан (<b>[ДОБАВЛЕНО]</b> valentior pars): главы семей, гильдий, корпораций. Принимают закон после дебатов и отвечают за его текст.' },
          { t: 'Правитель', d: 'Избирается, исполняет закон и применяет принуждение. Подотчётен и может быть смещён — по закону, а не силой.' }
        ],
        church: 'Церковь стоит <b>отдельно</b>: учит вере и ведёт к спасению души, но не имеет принудительной власти и сама подчиняется суду государства.',
        out: 'Частицы — это власть. Здесь она <b>поднимается снизу вверх</b>: от народа к правителю. Церковь вынесена за пределы пирамиды.'
      }
    };
    var cur = 'mars';
    var q = shell(box, '3D', 'Пирамида власти', 'Переключай модели: смотри, куда течёт власть. Нажимай на ярусы.', '<div class="wg-chips"></div>');
    boot(q, { rad: 16, phi: 1.2, target: [1.3, 3.2, 0], ratio: 1, minR: 9, maxR: 30, spin: 0.22 }, function (S) {
      var T = S.T, sc = S.scene, built = new T.Group(), labels = [], grow = 0;
      sc.add(built);
      var base = new T.Mesh(new T.CylinderGeometry(7.5, 7.8, 0.3, 48), S.mat('#3d4560')); base.position.y = -0.15; sc.add(base);
      var NP = 220, pos = new Float32Array(NP * 3), ph = [];
      for (var i = 0; i < NP; i++) ph.push({ p: Math.random(), a: Math.random() * Math.PI * 2, s: 0.12 + Math.random() * 0.15 });
      var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
      var pm = new T.PointsMaterial({ size: 0.32, transparent: true, opacity: 0.95, depthWrite: false });
      var pts = new T.Points(pg, pm); sc.add(pts);
      var H = 6.3, B = 3.4;
      function build() {
        var M = MODELS[cur];
        while (built.children.length) built.remove(built.children[0]);
        labels.forEach(function (L) { L.remove(); }); labels = [];
        var tc = cur === 'mars' ? ['#4f7cc0', '#5f9fd6', '#f0c36b'] : ['#8a8fa8', '#b07ad8', '#e9e3d6'];
        M.tiers.forEach(function (tr, k) {
          var w = (3 - k) / 3 * B * 2, h = H / 3;
          var m = new T.Mesh(new T.BoxGeometry(w, h * 0.96, w), S.mat(tc[k]));
          m.position.y = k * h + h / 2; m.userData.key = 't' + k; built.add(m);
          labels.push(S.label(m, tr.t, 0.1));
        });
        if (M.top) {
          var g = new T.Mesh(new T.SphereGeometry(0.55, 24, 16), S.mat('#ffe6a0', { emissive: new T.Color('#ffcf5a'), emissiveIntensity: 0.9 }));
          g.position.y = H + 0.8; g.userData.key = 'top'; built.add(g);
          var halo = new T.Mesh(new T.TorusGeometry(0.85, 0.06, 8, 40), S.mat('#ffcf5a', { emissive: new T.Color('#ffcf5a'), emissiveIntensity: 0.8 })); halo.rotation.x = Math.PI / 2; halo.position.y = H + 0.8; built.add(halo);
          labels.push(S.label(g, M.top, 0.8));
        }
        if (M.church) {
          var ch = new T.Group(); ch.userData.key = 'church'; ch.position.set(5, 0, -0.5);
          var c1 = new T.Mesh(new T.CylinderGeometry(0.7, 0.8, 2.6, 16), S.mat('#eadfc8')); c1.position.y = 1.3; ch.add(c1);
          var c2 = new T.Mesh(new T.ConeGeometry(0.85, 1.2, 16), S.mat('#a7b3bf')); c2.position.y = 3.2; ch.add(c2);
          var cr1 = new T.Mesh(new T.BoxGeometry(0.08, 0.6, 0.08), S.mat('#f0c36b')); cr1.position.y = 4.05; ch.add(cr1);
          var cr2 = new T.Mesh(new T.BoxGeometry(0.34, 0.08, 0.08), S.mat('#f0c36b')); cr2.position.y = 4.1; ch.add(cr2);
          var ring = new T.Mesh(new T.TorusGeometry(1.4, 0.05, 6, 48), S.mat(css('--gold', '#f0c36b'))); ring.rotation.x = Math.PI / 2; ring.position.y = 0.05; ch.add(ring);
          built.add(ch); labels.push(S.label(ch, 'Церковь', 4.4));
        }
        pm.color.set(css(M.color, '#4cc38a'));
        built.scale.y = 0.01; grow = 0;
        q('.wg-out').innerHTML = M.out;
      }
      S.pickable(built);
      S.onPick(function (key, ob) {
        var M = MODELS[cur];
        built.children.forEach(function (c) { glow(c, 0, false); });
        glow(ob, css('--accent', '#7aa2ff'), true);
        if (key === 'top') q('.wg-out').innerHTML = '<b>' + M.top + '.</b> ' + M.topD;
        else if (key === 'church') q('.wg-out').innerHTML = '<b>Церковь.</b> ' + M.church;
        else { var t = M.tiers[+key.slice(1)]; q('.wg-out').innerHTML = '<b>' + t.t + '.</b> ' + t.d; }
      });
      S.frame(function (dt) {
        if (grow < 1) { grow = Math.min(1, grow + dt * 1.8); built.scale.y = 0.01 + 0.99 * (1 - Math.pow(1 - grow, 3)); }
        var M = MODELS[cur], top = H + (M.top ? 0.8 : 0.2);
        for (var i = 0; i < NP; i++) {
          var o = ph[i]; o.p += M.flow * o.s * dt; if (o.p > 1) o.p -= 1; if (o.p < 0) o.p += 1;
          var y = o.p * top, rr = (1 - Math.min(1, y / (H + 0.3))) * B * 1.2 + 0.35;
          o.a += dt * 0.4;
          pos[i * 3] = Math.cos(o.a) * rr; pos[i * 3 + 1] = y + 0.1; pos[i * 3 + 2] = Math.sin(o.a) * rr;
        }
        pg.attributes.position.needsUpdate = true;
      });
      function chips() {
        var c = q('.wg-chips'); c.innerHTML = '';
        ['pope', 'mars'].forEach(function (k) { var b = chip('<b>' + MODELS[k].n + '</b>', k === cur); b.onclick = function () { cur = k; chips(); build(); }; c.appendChild(b); });
      }
      chips(); build();
    });
  }

  /* ---------- 3. Государство-организм ---------- */
  function organism(box) {
    var LAYERS = [
      { n: 'Семья', d: 'В самодостаточном доме отец распоряжается всем, как считает нужным.' },
      { n: 'Деревенская община', d: 'Отец уже не своеволен: действует через правовую культуру, у него доля полномочий и ответственности.' },
      { n: 'Городская община', d: 'Граждане, гильдии, корпорации. Споры решаются через закон.' },
      { n: 'Совершенное государство', d: 'Высшая, самодостаточная общность (по Аристотелю). Её здоровье — мир между частями.' }
    ];
    var q = shell(box, '3D', 'Государство — живой организм', 'Двигай ползунок раздоров и смотри, как «заболевает» государство. Потом вызови правителя-врача.',
      '', '<div class="wg-ctl"><label><span class="n">Раздоры</span><input type="range" min="0" max="100" value="70" class="c"><b class="cv">70</b></label></div><div class="wg-chips"></div>');
    boot(q, { rad: 15, phi: 1.1, target: [0, 0, 0], ratio: 0.8, minR: 8, maxR: 26, spin: 0.12 }, function (S) {
      var T = S.T, sc = S.scene, c = 0.7, heal = false, focus = -1;
      var ok = new T.Color(css('--ok', '#4cc38a')), bad = new T.Color(css('--bad', '#ef6b5b')), mix = new T.Color();
      var radii = [0.9, 1.8, 2.8, 4.1], shells = [];
      radii.forEach(function (r, i) {
        var m = new T.Mesh(new T.SphereGeometry(r, 40, 28), new T.MeshStandardMaterial({ color: ok.clone(), transparent: true, opacity: [0.55, 0.3, 0.2, 0.12][i], roughness: 0.4, depthWrite: false, side: T.DoubleSide }));
        m.userData.key = 'l' + i; sc.add(m); shells.push(m);
        if (i === 3) { var wf = new T.Mesh(new T.SphereGeometry(r * 1.002, 24, 16), new T.MeshBasicMaterial({ color: ok.clone(), wireframe: true, transparent: true, opacity: 0.14 })); m.add(wf); m.userData.wf = wf; }
      });
      var NP = 260, pos = new Float32Array(NP * 3), vel = [];
      for (var i = 0; i < NP; i++) {
        var u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, rr = 1 + Math.random() * 2.8, s = Math.sqrt(1 - u * u);
        pos[i * 3] = s * Math.cos(a) * rr; pos[i * 3 + 1] = u * rr; pos[i * 3 + 2] = s * Math.sin(a) * rr;
        vel.push(new T.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4));
      }
      var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
      var pm = new T.PointsMaterial({ size: 0.13, color: ok.clone() }); sc.add(new T.Points(pg, pm));
      var doc = S.label(shells[3], 'Государство', 4.3);
      function text() {
        var v = Math.round(c * 100);
        q('.c').value = v; q('.cv').textContent = v;
        var msg = v < 20 ? '<b>Здоровый организм:</b> части не конфликтуют, граждане верят в закон и решают споры через него. Это и есть внутренний мир — основа гражданского счастья.'
          : v < 60 ? '<b>Организм нездоров:</b> споры копятся. Правитель-врач должен снимать конфликты, начиная с самого нижнего уровня — с семьи и общины.'
          : '<b>Тяжёлая болезнь — раздоры и война.</b> По Марсилию, так «заболела» Италия из-за политических амбиций духовенства и папы. Гражданскую войну остановить намного труднее, чем сменить правителя.';
        if (focus >= 0) msg = '<b>' + LAYERS[focus].n + '.</b> ' + LAYERS[focus].d + '<br><br>' + msg;
        q('.wg-out').innerHTML = msg;
      }
      q('.c').addEventListener('input', function () { c = this.value / 100; heal = false; text(); });
      var cc = q('.wg-chips');
      var hb = chip('<b>🩺 Правитель-врач</b><small>издать закон и рассудить</small>'); hb.onclick = function () { heal = true; }; cc.appendChild(hb);
      LAYERS.forEach(function (L, k) { var b = chip('<b>' + L.n + '</b>'); b.style.flex = '1 1 120px'; b.onclick = function () { focus = focus === k ? -1 : k; Array.prototype.forEach.call(cc.children, function (x, j) { x.classList.toggle('on', j === k + 1 && focus === k); }); text(); }; cc.appendChild(b); });
      S.frame(function (dt, t) {
        if (heal) { c = Math.max(0, c - dt * 0.35); if (c === 0) heal = false; text(); }
        mix.copy(ok).lerp(bad, c);
        var beat = 1 + 0.03 * Math.pow(Math.max(0, Math.sin(t * (2 + 6 * c))), 8);
        shells.forEach(function (m, i) {
          m.material.color.copy(mix);
          var dim = focus >= 0 && focus !== i;
          m.material.opacity = (dim ? 0.05 : [0.55, 0.3, 0.2, 0.12][i]) + (focus === i ? 0.25 : 0);
          var w = c * 0.09 * Math.sin(t * (5 + i * 1.7) + i);
          m.scale.set(beat * (1 + w), beat * (1 - w), beat * (1 + w * 0.6));
          m.position.set(c * 0.12 * Math.sin(t * 9 + i * 2), c * 0.12 * Math.cos(t * 11 + i), 0);
          if (m.userData.wf) m.userData.wf.material.color.copy(mix);
        });
        pm.color.copy(mix);
        var maxV = 0.25 + 2.6 * c;
        for (var i = 0; i < NP; i++) {
          var v = vel[i];
          v.x += (Math.random() - 0.5) * c * 6 * dt; v.y += (Math.random() - 0.5) * c * 6 * dt; v.z += (Math.random() - 0.5) * c * 6 * dt;
          var l = v.length(); if (l > maxV) v.multiplyScalar(maxV / l);
          var x = pos[i * 3] + v.x * dt, y = pos[i * 3 + 1] + v.y * dt, z = pos[i * 3 + 2] + v.z * dt, r = Math.sqrt(x * x + y * y + z * z);
          if (r > 3.95 || r < 1.0) { v.multiplyScalar(-1); x = pos[i * 3]; y = pos[i * 3 + 1]; z = pos[i * 3 + 2]; }
          pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
        }
        pg.attributes.position.needsUpdate = true;
      });
      text();
    });
  }

  /* ---------- 4. «Демос численностью полпроцента» (2D) ---------- */
  function demos(box) {
    var STEPS = [
      { n: 'Все жители', k: 10000 },
      { n: 'Минус женщины', k: 5000 },
      { n: 'Минус дети и несовершеннолетние', k: 3000 },
      { n: 'Минус неграждане: рабы, слуги, чужеземцы', k: 1200 },
      { n: 'Только «лучшие»: главы семей, гильдий, корпораций', k: 60 }
    ];
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Визуал</span><b>Кто голосует в городе XIV века</b></div><p class="wg-lead">Город на 50 000 жителей, одна точка = 5 человек. Нажимай фильтры по порядку. Числа условные.</p><div class="wg-chips"></div><canvas class="wg-dots"></canvas><div class="wg-out"></div>';
    var cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), step = 0, shown = 10000, anim = 0;
    var rank = [], R = rnd(11); for (var i = 0; i < 10000; i++) rank.push(i);
    for (i = 9999; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = rank[i]; rank[i] = rank[j]; rank[j] = t; }
    function draw() {
      var W = cv.clientWidth || 320, dpr = Math.min(2, window.devicePixelRatio || 1), cols = 125, rows = 80, cell = W / cols, H = Math.round(cell * rows);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var ox = (W - cols * cell) / 2, oy = (H - rows * cell) / 2;
      var on = css(step === 4 ? '--gold' : '--accent', '#7aa2ff'), off = css('--line', '#2b3154');
      for (var i = 0; i < 10000; i++) {
        var x = ox + (i % cols) * cell + cell / 2, y = oy + Math.floor(i / cols) * cell + cell / 2, alive = rank[i] < shown;
        ctx.fillStyle = alive ? on : off;
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.6, cell * (alive && step === 4 ? 0.62 : 0.36)), 0, 6.283); ctx.fill();
      }
    }
    function chips() {
      var c = box.querySelector('.wg-chips'); c.innerHTML = '';
      STEPS.forEach(function (s, k) {
        var b = chip('<b>' + (k + 1) + '. ' + s.n + '</b><small>' + (s.k * 5).toLocaleString('ru-RU') + ' чел.</small>', k <= step);
        b.style.flex = '1 1 140px'; b.onclick = function () { step = k; chips(); go(); }; c.appendChild(b);
      });
    }
    function go() {
      var from = shown, to = STEPS[step].k, t0 = performance.now();
      cancelAnimationFrame(anim);
      (function f(now) { var p = Math.min(1, (now - t0) / 700); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); draw(); if (p < 1) anim = requestAnimationFrame(f); })(t0);
      var people = to * 5, pct = (people / 50000 * 100);
      box.querySelector('.wg-out').innerHTML = 'Осталось <b>' + people.toLocaleString('ru-RU') + '</b> из 50 000 — <b>' + pct.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' %</b>.' +
        (step === 4 ? ' Это и есть «лучшая часть» граждан, которая выбирает правителя. Лектор: <b>«Демос численностью полпроцента — это не очень демос»</b>. Поэтому говорят о представительной демократии.' : '');
    }
    chips(); go();
    if (window.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(cv);
  }

  /* ---------- 5. Церковь как сеть (2D) ---------- */
  function network(box) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(t, a, txt) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; }
    var C = { 'Лондон': [92, 58], 'Париж': [122, 94], 'Кёльн': [168, 70], 'Прага': [226, 80], 'Краков': [276, 74], 'Вена': [246, 108], 'Мюнхен': [198, 106], 'Падуя': [204, 136], 'Лион': [146, 128], 'Толедо': [78, 196], 'Лиссабон': [40, 206], 'Рим': [212, 192], 'Авиньон': [134, 160], 'Неаполь': [236, 210] };
    var cur = 'Авиньон';
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">Визуал</span><b>Церковь — сеть по всей Европе</b></div><p class="wg-lead">Схема, а не точная карта. Золотые точки — налоги и десятина в центр, синие — указы и назначения из центра.</p><div class="wg-chips"></div><svg viewBox="0 0 320 240"></svg><div class="wg-out"></div>';
    var svg = box.querySelector('svg'), dots = [], raf = 0, t0 = 0, vis = false;
    function build() {
      svg.innerHTML = ''; dots = [];
      var c = C[cur];
      Object.keys(C).forEach(function (n) {
        if (n === cur) return;
        var p = C[n];
        svg.appendChild(el('line', { x1: p[0], y1: p[1], x2: c[0], y2: c[1], stroke: 'var(--line)', 'stroke-width': 1.5 }));
        for (var k = 0; k < 2; k++) {
          var d = el('circle', { r: k ? 2.6 : 2.2, fill: k ? 'var(--gold)' : 'var(--accent)' }); svg.appendChild(d);
          dots.push({ e: d, a: p, b: c, inw: !!k, ph: Math.random(), sp: 0.18 + Math.random() * 0.15 });
        }
      });
      Object.keys(C).forEach(function (n) {
        var p = C[n], ctr = n === cur;
        svg.appendChild(el('circle', { cx: p[0], cy: p[1], r: ctr ? 9 : 4.5, fill: ctr ? 'var(--gold)' : 'var(--panel)', stroke: ctr ? 'var(--gold)' : 'var(--accent)', 'stroke-width': 2 }));
        if (ctr) svg.appendChild(el('text', { x: p[0], y: p[1] + 4, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--bg)' }, '✝'));
        svg.appendChild(el('text', { x: p[0], y: p[1] - (ctr ? 13 : 8), 'text-anchor': 'middle', 'font-size': ctr ? 12 : 10, 'font-weight': ctr ? 700 : 400 }, n));
      });
      box.querySelector('.wg-out').innerHTML = cur === 'Авиньон'
        ? '<b>[ДОБАВЛЕНО]</b> В 1309–1377 гг. папы жили не в Риме, а в <b>Авиньоне</b>. Иоанн XXII, противник Людвига Баварского, правил именно оттуда. Сеть та же: в каждом крупном городе — епископ, грамотные клирики, документы на латыни, сбор десятины.'
        : 'Классический центр — <b>Рим</b>. По словам лектора, до Нового времени ни у одного государства не было такой налоговой базы, такой сети и таких кадров: единые документы, единый язык (латынь), грамотные священники в каждом городе.';
    }
    function tick(now) {
      raf = 0; if (!vis || !document.body.contains(box)) return;
      var dt = Math.min(0.05, (now - (t0 || now)) / 1000); t0 = now;
      dots.forEach(function (d) {
        d.ph = (d.ph + d.sp * dt) % 1;
        var f = d.inw ? d.ph : 1 - d.ph, x = d.a[0] + (d.b[0] - d.a[0]) * f, y = d.a[1] + (d.b[1] - d.a[1]) * f;
        d.e.setAttribute('cx', x.toFixed(1)); d.e.setAttribute('cy', y.toFixed(1));
      });
      raf = requestAnimationFrame(tick);
    }
    function chips() {
      var c = box.querySelector('.wg-chips'); c.innerHTML = '';
      [['Авиньон', 'центр в 1324 году'], ['Рим', 'классический центр']].forEach(function (x) { var b = chip('<b>' + x[0] + '</b><small>' + x[1] + '</small>', x[0] === cur); b.onclick = function () { cur = x[0]; chips(); build(); }; c.appendChild(b); });
    }
    chips(); build();
    new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (vis && !raf) { t0 = 0; raf = requestAnimationFrame(tick); } }).observe(svg);
  }

  HubWidgets.register('mars-network', network);
  HubWidgets.register('mars-city3d', city);
  HubWidgets.register('mars-pyramid3d', pyramid);
  HubWidgets.register('mars-organism3d', organism);
  HubWidgets.register('mars-demos', demos);
})();
