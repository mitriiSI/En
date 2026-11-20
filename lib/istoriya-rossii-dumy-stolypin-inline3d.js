/* 3D-движок для интерактивов конспектов (на three.js, грузится только когда нужен).
   Регистрирует фабрику HubWidgets.scene3d(box, opts):
     opts.title, opts.lead       — заголовок и подсказка
     opts.build(ctx)             — строит сцену; ctx: THREE, root, color(), mat(), box3(), label(), pick(), cam, setView()
     opts.chips                  — [{t, small, on(ctx)}] кнопки под сценой
     opts.height                 — высота сцены (по умолчанию 360)
   Управление: тянуть — вращать, щипок/колесо — приблизить, тап по детали — пояснение. */
(function () {
  'use strict';
  function CanvasSceneRenderer(THREE) {
    this.domElement = document.createElement('canvas');
    this.shadowMap = {};
    var canvas = this.domElement;
    var context = canvas.getContext('2d');
    var ratio = 1;
    var matrix = new THREE.Matrix4();
    var point = new THREE.Vector3();
    var last = -Infinity;
    this.getContext = function () { return { isContextLost: function () { return false; } }; };
    this.setPixelRatio = function (value) { ratio = value; };
    this.setSize = function (w, h) { canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio); };
    this.render = function (scene, camera) {
      var now = performance.now();
      if (now - last < 40) return;
      last = now;
      context.clearRect(0, 0, canvas.width, canvas.height);
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      var faces = [], labels = [];
      function screen(x, y, z, world) {
        point.set(x, y, z).applyMatrix4(world).project(camera);
        return [canvas.width * (1 + point.x) / 2, canvas.height * (1 - point.y) / 2, point.z];
      }
      function color(material, light) {
        var paint = material.color.clone().multiplyScalar(light);
        return '#' + paint.getHexString();
      }
      function addFace(points, fill, layer) {
        if (points.some(function (p) { return p[2] < -1 || p[2] > 1; })) return;
        faces.push({ points: points, fill: fill, layer: layer || 0, depth: points.reduce(function (sum, p) { return sum + p[2]; }, 0) / points.length });
      }
      function seat(world, palette) {
        var vertices = [[-.095,0,-.085],[.095,0,-.085],[.095,.12,-.085],[-.095,.12,-.085],[-.095,0,.085],[.095,0,.085],[.095,.12,.085],[-.095,.12,.085],[-.095,.29,-.085],[-.03,.29,-.085],[-.03,.29,.085],[-.095,.29,.085]].map(function (p) { return screen(p[0],p[1],p[2],world); });
        [[0,1,2,3],[4,5,6,7],[2,6,7,3],[3,7,11,8],[8,9,10,11],[1,5,6,2]].forEach(function (ids, i) { addFace(ids.map(function (id) { return vertices[id]; }), palette[i % 3]); });
      }
      scene.traverse(function (object) {
        if (!object.visible) return;
        if (object.isSprite && object.material.map && object.material.map.image) {
          var center = screen(0, 0, 0, object.matrixWorld);
          var edge = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld).add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(object.scale.x)).project(camera);
          labels.push({ image: object.material.map.image, center: center, width: Math.abs((edge.x + 1) * canvas.width / 2 - center[0]) });
          return;
        }
        if (!object.isMesh) return;
        var palette = [color(object.material, .82), color(object.material, .96), color(object.material, 1.06)];
        if (object.isInstancedMesh) {
          for (var i = 0; i < object.count; i++) {
            object.getMatrixAt(i, matrix);
            matrix.premultiply(object.matrixWorld);
            seat(matrix, palette);
          }
          return;
        }
        var geometry = object.geometry, positions = geometry.attributes.position;
        var normals = geometry.attributes.normal;
        var index = geometry.index;
        var points = Array.from({ length: positions.count }, function (_, i) {
          return screen(positions.getX(i), positions.getY(i), positions.getZ(i), object.matrixWorld);
        });
        var count = index ? index.count : points.length;
        var layer = object.position.y < 0 ? -2 : geometry.type === 'RingGeometry' ? -1 : 0;
        for (var j = 0; j + 2 < count; j += 3) {
          var a = index ? index.getX(j) : j, b = index ? index.getX(j+1) : j+1, c = index ? index.getX(j+2) : j+2;
          var shade = normals && normals.getY(a) > .45 ? 2 : normals && normals.getZ(a) > .4 ? 1 : 0;
          addFace([points[a], points[b], points[c]], palette[shade], layer);
        }
      });
      faces.sort(function (a, b) { return a.layer - b.layer || b.depth - a.depth; });
      faces.forEach(function (face) {
        context.beginPath();
        face.points.forEach(function (p, i) { if (i) context.lineTo(p[0],p[1]); else context.moveTo(p[0],p[1]); });
        context.closePath();
        context.fillStyle = face.fill;
        context.fill();
      });
      labels.forEach(function (label) {
        var w = label.width, h = w * label.image.height / label.image.width;
        if (w > 0 && label.center[2] > -1 && label.center[2] < 1) context.drawImage(label.image, label.center[0]-w/2, label.center[1]-h/2, w, h);
      });
    };
  }
  var loading = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!loading) loading = new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = 'lib/three.min.js';
      s.onload = function () { ok(window.THREE); }; s.onerror = fail; document.head.appendChild(s);
    });
    return loading;
  }
  /* Один общий WebGL-контекст на все модели страницы. Браузеры держат не больше ~16 контекстов
     (iPhone — ещё меньше), и в длинных конспектах лишние модели гасли. Теперь каждая сцена рисуется
     общим рендерером и копируется в свой обычный 2D-холст. */
  var shared = null;
  function sharedRenderer(THREE) {
    if (shared && !shared.getContext().isContextLost()) return shared;
    try {
      shared = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      shared = new CanvasSceneRenderer(THREE);
    }
    shared.shadowMap.enabled = true;
    shared.domElement.addEventListener('webglcontextlost', function (e) { e.preventDefault(); }, false);
    return shared;
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
      var dpr = Math.min(window.HubEco ? HubEco.dpr() : 2, window.devicePixelRatio || 1);
      var view2d = document.createElement('canvas'), g2 = view2d.getContext('2d');
      view2d.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
      function sizeView(w, h) { W = w; H = h; view2d.width = Math.round(w * dpr); view2d.height = Math.round(h * dpr); }
      sizeView(W, H);
      host.insertBefore(view2d, host.firstChild);
      var renderer = {
        render: function (sc, cm) {
          var R = sharedRenderer(THREE), cv = R.domElement;
          if (cv.width !== view2d.width || cv.height !== view2d.height) { R.setPixelRatio(dpr); R.setSize(W, H, false); }
          R.render(sc, cm);
          g2.clearRect(0, 0, view2d.width, view2d.height);
          g2.drawImage(cv, 0, 0, view2d.width, view2d.height);
        },
        setSize: function (w, h) { sizeView(w, h); },
        dispose: function () {},
        domElement: view2d
      };
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
          var xp = document.documentElement.classList.contains('xp'), FONT = xp ? 'Tahoma,Verdana,sans-serif' : 'system-ui,-apple-system,sans-serif';
          var cv = document.createElement('canvas'), g = cv.getContext('2d'), fs = 64;
          g.font = (xp ? '400 ' : '600 ') + fs + 'px ' + FONT;
          var lines = String(text).split('\n'), w = Math.max.apply(null, lines.map(function (l) { return g.measureText(l).width; })) + 40;
          cv.width = w; cv.height = lines.length * fs * 1.2 + 24;
          g.font = (xp ? '400 ' : '600 ') + fs + 'px ' + FONT;
          g.fillStyle = xp ? '#ffffe1' : 'rgba(15,18,32,.78)'; var r = xp ? 4 : 22;
          g.beginPath(); g.moveTo(r, 0); g.arcTo(cv.width, 0, cv.width, cv.height, r); g.arcTo(cv.width, cv.height, 0, cv.height, r); g.arcTo(0, cv.height, 0, 0, r); g.arcTo(0, 0, cv.width, 0, r); g.fill();
          if (xp) { g.strokeStyle = '#000'; g.lineWidth = 4; g.stroke(); }
          g.fillStyle = xp ? '#000' : (col || '#eef0f8'); g.textBaseline = 'top';
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
          obj.traverse(function (x) { if (x.material && !x.isSprite) { if (x.material.transparent !== !!on) x.material.needsUpdate = true; /* без перекомпиляции шейдер с OPAQUE игнорирует прозрачность */ x.material.transparent = !!on; x.material.opacity = on ? (op || 0.18) : 1; x.material.depthWrite = !on; } });
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
      var raf = 0, lastF = 0;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf) { lastF = 0; raf = requestAnimationFrame(loop); } }).observe(host);
      if ('ResizeObserver' in window) new ResizeObserver(function () { var w = host.clientWidth; if (w) { cam.aspect = w / host.clientHeight; cam.updateProjectionMatrix(); renderer.setSize(w, host.clientHeight); } }).observe(host);
      function loop(now) {
        raf = 0;
        if (!document.body.contains(host)) { renderer.dispose(); return; }
        if (!visible) return;   /* вне экрана цикл останавливается и запускается снова, когда блок появится */
        if (auto && !goal && HubEco.skip(now, lastF)) { raf = requestAnimationFrame(loop); return; }
        var df = lastF ? Math.min(4, (now - lastF) / 16.7) : 1; lastF = now;
        raf = requestAnimationFrame(loop);
        var t = Math.max(0, (now - t0) / 1000); /* rAF может дать время чуть раньше t0 — без этого индексы анимаций уходили в минус */
        if (auto) view.th += 0.0025 * df;
        if (goal) {
          var k = 1 - Math.pow(0.92, df); view.th += (goal.th - view.th) * k; view.ph += (goal.ph - view.ph) * k; view.r += (goal.r - view.r) * k; view.tgt.y += (goal.ty - view.tgt.y) * k; view.tgt.x += (goal.tx - view.tgt.x) * k; view.tgt.z += (goal.tz - view.tgt.z) * k;
          if (Math.abs(goal.th - view.th) + Math.abs(goal.r - view.r) + Math.abs(goal.tx - view.tgt.x) < 0.01) goal = null;
        }
        anim.forEach(function (f) { f(t); });
        place(); renderer.render(scene, cam);
      }
      loop(t0);
    }).catch(function () { host.innerHTML = '<div style="padding:20px;color:var(--muted)">3D не загрузилось. Проверь интернет и обнови страницу.</div>'; });
  }
  window.HubStolypinScene = scene3d;
})();
(function () {
  'use strict';
  var RED = '#e36a69', PURPLE = '#aa8af2', GREEN = '#56bd91', BLUE = '#5d9ef3';
  var ORANGE = '#f28b45', GOLD = '#edba69', GREY = '#8797b6', WOOD = '#976847';

  var scenes = {};
  window.HubStolypin3d = function (name, element) {
    HubStolypinScene(element, scenes[name]);
  };
  function reg(name, options) {
    scenes[name] = options;
    var element = document.getElementById(name);
    if (element) HubStolypinScene(element, options);
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
