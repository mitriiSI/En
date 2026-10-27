/* 3D-движок для интерактивов конспектов (на three.js, грузится только когда нужен).
   Регистрирует фабрику HubWidgets.scene3d(box, opts):
     opts.title, opts.lead       — заголовок и подсказка
     opts.build(ctx)             — строит сцену; ctx: THREE, root, color(), mat(), box3(), label(), pick(), cam, setView()
     opts.chips                  — [{t, small, on(ctx)}] кнопки под сценой
     opts.height                 — высота сцены (по умолчанию 360)
   Управление: тянуть — вращать, щипок/колесо — приблизить, тап по детали — пояснение. */
(function () {
  'use strict';
  var loading = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!loading) loading = new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = 'lib/three.min.js';
      s.onload = function () { ok(window.THREE); }; s.onerror = fail; document.head.appendChild(s);
    });
    return loading;
  }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }

  function scene3d(box, o) {
    box.className = 'wg';
    box.innerHTML = '<div class="wg-h"><span class="wg-badge">3D</span><b>' + o.title + '</b></div>' +
      '<p class="wg-lead">' + o.lead + '</p>' +
      '<div class="wg-3d" style="position:relative;height:' + (o.height || 360) + 'px;border-radius:14px;overflow:hidden;background:radial-gradient(circle at 50% 35%,var(--panel2),var(--bg));touch-action:none;cursor:grab">' +
      '<div class="wg-3d-load" style="position:absolute;inset:0;display:grid;place-items:center;color:var(--muted)">Загружаю 3D…</div>' +
      '<div style="position:absolute;right:10px;bottom:8px;font-size:11px;color:var(--muted);pointer-events:none">тяни · щипок · тап</div></div>' +
      '<div class="wg-chips" style="margin-top:10px"></div><div class="wg-out">' + (o.hint || 'Нажми на любую деталь модели.') + '</div>';
    var host = box.querySelector('.wg-3d'), out = box.querySelector('.wg-out'), chipsBox = box.querySelector('.wg-chips');

    loadThree().then(function (THREE) {
      host.querySelector('.wg-3d-load').remove();
      var W = host.clientWidth, H = host.clientHeight;
      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(W, H); renderer.shadowMap.enabled = true;
      host.insertBefore(renderer.domElement, host.firstChild);
      var scene = new THREE.Scene();
      var cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 500);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 0.85));
      var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(8, 14, 10); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024); var sc = sun.shadow.camera; sc.left = sc.bottom = -14; sc.right = sc.top = 14;
      scene.add(sun);
      var root = new THREE.Group(); scene.add(root);

      var view = { tx0: 0, th: o.theta != null ? o.theta : 0.6, ph: o.phi != null ? o.phi : 1.05, r: o.radius || 16, tgt: new THREE.Vector3(o.targetX || 0, o.targetY || 1, 0) };
      var goal = null, auto = o.autorotate !== false, picked = null, anim = [];
      function place() {
        var rr = view.r * Math.max(1, 1.3 / cam.aspect); /* узкий экран телефона — отодвигаем камеру */
        cam.position.set(view.tgt.x + rr * Math.sin(view.ph) * Math.sin(view.th), view.tgt.y + rr * Math.cos(view.ph), view.tgt.z + rr * Math.sin(view.ph) * Math.cos(view.th));
        cam.lookAt(view.tgt);
      }
      var ctx = {
        THREE: THREE, root: root, scene: scene, cam: cam, out: out,
        color: function (v) { return new THREE.Color(v.charAt(0) === '-' ? css(v.charAt(1) === '-' ? v : '-' + v) : v); },
        mat: function (c, extra) { var m = new THREE.MeshStandardMaterial(Object.assign({ color: ctx.color(c), roughness: 0.6, metalness: 0.1 }, extra || {})); return m; },
        mesh: function (geo, c, info, extra) {
          var m = new THREE.Mesh(geo, ctx.mat(c, extra)); m.castShadow = m.receiveShadow = true;
          if (info) m.userData.info = info; root.add(m); return m;
        },
        box3: function (w, h, d, c, pos, info) { var m = ctx.mesh(new THREE.BoxGeometry(w, h, d), c, info); m.position.set(pos[0], pos[1], pos[2]); return m; },
        label: function (text, pos, size, col) {
          var cv = document.createElement('canvas'), g = cv.getContext('2d'), fs = 64;
          g.font = '600 ' + fs + 'px system-ui,-apple-system,sans-serif';
          var lines = String(text).split('\n'), w = Math.max.apply(null, lines.map(function (l) { return g.measureText(l).width; })) + 40;
          cv.width = w; cv.height = lines.length * fs * 1.2 + 24;
          g.font = '600 ' + fs + 'px system-ui,-apple-system,sans-serif';
          g.fillStyle = 'rgba(15,18,32,.78)'; var r = 22;
          g.beginPath(); g.moveTo(r, 0); g.arcTo(cv.width, 0, cv.width, cv.height, r); g.arcTo(cv.width, cv.height, 0, cv.height, r); g.arcTo(0, cv.height, 0, 0, r); g.arcTo(0, 0, cv.width, 0, r); g.fill();
          g.fillStyle = col || '#eef0f8'; g.textBaseline = 'top';
          lines.forEach(function (l, i) { g.fillText(l, 20, 14 + i * fs * 1.2); });
          var tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4;
          var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
          var s = size || 0.9; sp.scale.set(s * cv.width / cv.height, s, 1); sp.position.set(pos[0], pos[1], pos[2]); sp.renderOrder = 10;
          root.add(sp); return sp;
        },
        setView: function (th, ph, r, ty, tx, tz) { goal = { th: th, ph: ph, r: r, ty: ty == null ? view.tgt.y : ty, tx: tx == null ? view.tgt.x : tx, tz: tz == null ? view.tgt.z : tz }; auto = false; },
        link: function (a, b, c, rad, info) {
          var A = new THREE.Vector3(a[0], a[1], a[2]), B = new THREE.Vector3(b[0], b[1], b[2]), len = A.distanceTo(B);
          var m = ctx.mesh(new THREE.CylinderGeometry(rad || 0.06, rad || 0.06, len, 12), c, info);
          m.position.copy(A).add(B).multiplyScalar(0.5);
          m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return m;
        },
        ghost: function (obj, on, op) {
          obj.traverse(function (x) { if (x.material && !x.isSprite) { x.material.transparent = !!on; x.material.opacity = on ? (op || 0.18) : 1; x.material.depthWrite = !on; } });
        },
        ground: function (size, c) {
          var g = ctx.mesh(new THREE.CylinderGeometry(size, size, 0.2, 64), c || '-panel2'); g.position.y = -0.1; g.castShadow = false; return g;
        },
        onFrame: function (fn) { anim.push(fn); },
        say: function (html) { out.innerHTML = html; },
        pick: function (obj) {
          if (picked && picked.material && picked.material.emissive) picked.material.emissive.setHex(0x000000);
          picked = obj;
          if (obj && obj.material && obj.material.emissive) obj.material.emissive.set(ctx.color('--gold')).multiplyScalar(0.35);
          if (obj && obj.userData.info) out.innerHTML = obj.userData.info;
          if (obj && o.onPick) o.onPick(obj, ctx);
        }
      };
      o.build(ctx);
      (o.chips || []).forEach(function (c, k) {
        var b = document.createElement('button'); b.className = 'wg-chip'; b.style.flex = '1 1 110px';
        b.innerHTML = '<b>' + c.t + '</b>' + (c.small ? '<small>' + c.small + '</small>' : '');
        b.onclick = function () { Array.prototype.forEach.call(chipsBox.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); c.on(ctx); };
        chipsBox.appendChild(b);
      });

      /* управление: вращение, масштаб, тап */
      var ptrs = {}, last = null, pinch = 0, moved = 0;
      var el = renderer.domElement;
      el.addEventListener('pointerdown', function (e) { el.setPointerCapture(e.pointerId); ptrs[e.pointerId] = [e.clientX, e.clientY]; last = [e.clientX, e.clientY]; moved = 0; auto = false; goal = null; host.style.cursor = 'grabbing'; });
      el.addEventListener('pointermove', function (e) {
        if (!ptrs[e.pointerId]) return;
        ptrs[e.pointerId] = [e.clientX, e.clientY];
        var ids = Object.keys(ptrs);
        if (ids.length === 2) {
          var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
          if (pinch) view.r = Math.max(4, Math.min(60, view.r * pinch / d)); pinch = d; moved += 10; return;
        }
        var dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY]; moved += Math.abs(dx) + Math.abs(dy);
        view.th -= dx * 0.008; view.ph = Math.max(0.15, Math.min(1.5, view.ph - dy * 0.006));
      });
      function up(e) {
        delete ptrs[e.pointerId]; pinch = 0; host.style.cursor = 'grab';
        if (moved < 6 && e.type === 'pointerup') {
          var r = el.getBoundingClientRect(), p = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
          var rc = new THREE.Raycaster(); rc.setFromCamera(p, cam);
          var hits = rc.intersectObjects(root.children, true);
          for (var i = 0; i < hits.length; i++) { var x = hits[i].object; while (x && !x.userData.info && x.parent) x = x.parent; if (x && x.userData.info) { ctx.pick(x); break; } }
        }
      }
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      el.addEventListener('wheel', function (e) { e.preventDefault(); view.r = Math.max(4, Math.min(60, view.r * (1 + e.deltaY * 0.001))); auto = false; }, { passive: false });

      var visible = true, t0 = performance.now();
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(host);
      if ('ResizeObserver' in window) new ResizeObserver(function () { var w = host.clientWidth; if (w) { cam.aspect = w / host.clientHeight; cam.updateProjectionMatrix(); renderer.setSize(w, host.clientHeight); } }).observe(host);
      (function loop(now) {
        if (!document.body.contains(host)) { renderer.dispose(); return; }
        requestAnimationFrame(loop);
        if (!visible) return;
        var t = (now - t0) / 1000;
        if (auto) view.th += 0.0025;
        if (goal) {
          var k = 0.08; view.th += (goal.th - view.th) * k; view.ph += (goal.ph - view.ph) * k; view.r += (goal.r - view.r) * k; view.tgt.y += (goal.ty - view.tgt.y) * k; view.tgt.x += (goal.tx - view.tgt.x) * k; view.tgt.z += (goal.tz - view.tgt.z) * k;
          if (Math.abs(goal.th - view.th) + Math.abs(goal.r - view.r) + Math.abs(goal.tx - view.tgt.x) < 0.01) goal = null;
        }
        anim.forEach(function (f) { f(t); });
        place(); renderer.render(scene, cam);
      })(t0);
    }).catch(function () { host.innerHTML = '<div style="padding:20px;color:var(--muted)">3D не загрузилось. Проверь интернет и обнови страницу.</div>'; });
  }
  window.HubScene3d = scene3d;
})();
