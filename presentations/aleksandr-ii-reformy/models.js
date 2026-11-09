/* 3D-сцены презентации: один общий canvas, модель меняется вместе со слайдом.
   Прогресс p (0…1) приходит от прокрутки, модель можно крутить пальцем или мышью. */
window.Deck3D = (function () {
  'use strict';
  const T = window.THREE;
  const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const std = (color, o) => new T.MeshStandardMaterial(Object.assign({ color, roughness: .55, metalness: .15 }, o || {}));
  const GOLD = () => std(0xf0c36b, { metalness: .85, roughness: .3 });
  const STEEL = () => std(0x9aa3b5, { metalness: .9, roughness: .35 });
  const WOOD = () => std(0x6b4526, { roughness: .8 });
  const STONE = () => std(0xd9d3c4, { roughness: .75 });
  const add = (p, m, x, y, z) => { m.position.set(x || 0, y || 0, z || 0); p.add(m); return m; };
  const box = (p, w, h, d, m, x, y, z) => add(p, new T.Mesh(new T.BoxGeometry(w, h, d), m), x, y, z);
  const cyl = (p, a, b, h, m, x, y, z, s) => add(p, new T.Mesh(new T.CylinderGeometry(a, b, h, s || 28), m), x, y, z);
  const ball = (p, r, m, x, y, z) => add(p, new T.Mesh(new T.SphereGeometry(r, 24, 18), m), x, y, z);

  /* ---------- порванная цепь ---------- */
  function chain() {
    const g = new T.Group(), m = STEEL(), L = new T.Group(), R = new T.Group();
    g.add(L, R);
    const link = (p, x, a) => { const t = new T.Mesh(new T.TorusGeometry(.42, .11, 14, 40), m); t.scale.set(1.25, .8, 1); t.position.x = x; t.rotation.x = a; p.add(t); };
    for (let i = 1; i <= 4; i++) { link(L, -i * .82 - .05, i % 2 ? Math.PI / 2 : 0); link(R, i * .82 + .05, i % 2 ? Math.PI / 2 : 0); }
    const half = (s) => { const t = new T.Mesh(new T.TorusGeometry(.42, .11, 14, 24, Math.PI), GOLD()); t.scale.set(1.25, .8, 1); t.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(t); return t; };
    const a = half(1), b = half(-1);
    const N = 90, pos = new Float32Array(N * 3), dir = [];
    for (let i = 0; i < N; i++) dir.push(new T.Vector3().randomDirection().multiplyScalar(1.5 + Math.random() * 2.6));
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    const sparks = new T.Points(geo, new T.PointsMaterial({ color: 0xffd98a, size: .07, transparent: true, depthWrite: false }));
    g.add(sparks);
    return { g, swing: .75, cam: [0, 1.6, 12.5], update(p) {
      const k = ss(.18, .62, p);
      L.position.x = -k * 1.5; L.position.y = -k * .55; L.rotation.z = k * .32;
      R.position.x = k * 1.5; R.position.y = -k * .55; R.rotation.z = -k * .32;
      a.position.x = k * .55; a.position.y = k * .5; a.rotation.y = k * .8;
      b.position.x = -k * .55; b.position.y = -k * .3; b.rotation.y = -k * .8;
      const f = ss(.2, .75, p);
      dir.forEach((d, i) => { pos[i * 3] = d.x * f; pos[i * 3 + 1] = d.y * f; pos[i * 3 + 2] = d.z * f; });
      geo.attributes.position.needsUpdate = true;
      sparks.material.opacity = f > 0 ? (1 - ss(.72, 1, p)) : 0;
    } };
  }

  /* ---------- земельный надел ---------- */
  function plot() {
    const g = new T.Group();
    box(g, 7.4, .3, 7.4, std(0x2d2317, { roughness: .95 }), 0, -.2, 0);
    const dark = new T.Color(0x24492f), gold = new T.Color(0xe9bb5c), tiles = [];
    for (let x = 0; x < 6; x++) for (let z = 0; z < 6; z++) {
      const t = box(g, 1.08, .16, 1.08, std(0x24492f, { roughness: .9 }), -2.8 + x * 1.12, .03, -2.8 + z * 1.12);
      const nadel = x + z < 6 && x < 4;
      tiles.push({ t, at: nadel ? .08 + (x + z) * .055 : 9 });
    }
    const izba = new T.Group(); g.add(izba); izba.position.set(-2.1, .1, -2.1);
    box(izba, 1.15, .75, 1, WOOD(), 0, .38, 0);
    const roof = new T.Mesh(new T.ConeGeometry(.98, .62, 4), std(0x7c3a2a)); roof.rotation.y = Math.PI / 4; roof.position.y = 1.05; izba.add(roof);
    box(izba, .26, .3, .02, std(0xffd98a, { emissive: 0xffb84a, emissiveIntensity: .9 }), .24, .42, .51);
    const fence = new T.Group(); g.add(fence);
    const fm = WOOD();
    for (let i = 0; i < 11; i++) { box(fence, .07, .5, .07, fm, -3.35 + i * .46, .32, 3.35); box(fence, .07, .5, .07, fm, 3.35, .32, -3.35 + i * .46); }
    return { g, cam: [0, 10.5, 14.5], look: [0, 0, 0], update(p) {
      tiles.forEach(o => { const k = ss(o.at, o.at + .12, p); o.t.material.color.copy(dark).lerp(gold, k); o.t.scale.y = 1 + k * 1.6; o.t.position.y = .03 + k * .13; });
      const i = ss(.55, .78, p); izba.scale.setScalar(Math.max(.001, i));
      fence.scale.y = Math.max(.001, ss(.72, .95, p));
    } };
  }

  /* ---------- весы правосудия ---------- */
  function scales() {
    const g = new T.Group(), m = GOLD();
    cyl(g, 1.25, 1.55, .3, std(0x20283f, { metalness: .4 }), 0, -2.6, 0);
    cyl(g, .13, .2, 4.6, m, 0, -.4, 0);
    ball(g, .24, m, 0, 2.05, 0);
    const beam = new T.Group(); beam.position.y = 1.7; g.add(beam);
    box(beam, 5.2, .13, .13, m, 0, 0, 0);
    const pan = (x, load) => {
      const h = new T.Group(); h.position.x = x; beam.add(h);
      const inner = new T.Group(); h.add(inner);
      for (let i = 0; i < 3; i++) { const a = i * 2.094, c = cyl(inner, .012, .012, 2, STEEL(), Math.cos(a) * .42, -1, Math.sin(a) * .42, 6); c.rotation.set(-Math.sin(a) * .4, 0, Math.cos(a) * .4); }
      cyl(inner, 1, .72, .12, m, 0, -2.04, 0);
      const l = new T.Group(); l.position.y = -1.98; inner.add(l); load(l);
      return inner;
    };
    let grow;
    const left = pan(-2.5, l => { for (let i = 0; i < 5; i++) cyl(l, .5, .5, .13, GOLD(), 0, .07 + i * .14, 0); });
    const right = pan(2.5, l => { grow = new T.Group(); l.add(grow); const w = std(0xcdd4e6); for (let i = 0; i < 5; i++) cyl(grow, .5, .5, .13, w, 0, .07 + i * .14, 0); });
    return { g, cam: [0, .4, 15.5], update(p) {
      const k = ss(.12, .82, p), tilt = (1 - k) * .3;
      beam.rotation.z = tilt; left.rotation.z = right.rotation.z = -tilt;
      grow.scale.y = Math.max(.08, .08 + k * .92);
    } };
  }

  /* ---------- зал суда: из закрытой канцелярии в открытый процесс ---------- */
  function court() {
    const g = new T.Group();
    box(g, 9, .2, 7, std(0x2c2019, { roughness: .9 }), 0, -.1, 0);
    const walls = [], wm = std(0x3b3f52, { roughness: .9 });
    [[9, 3, .18, 0, 1.5, 3.4], [.18, 3, 7, -4.4, 1.5, 0], [.18, 3, 7, 4.4, 1.5, 0]].forEach(a => walls.push(box(g, a[0], a[1], a[2], wm, a[3], a[4], a[5])));
    box(g, 9, 3, .18, wm, 0, 1.5, -3.4);
    const judge = new T.Group(); g.add(judge); judge.position.set(0, 0, -2.5);
    box(judge, 3.2, 1, .8, WOOD(), 0, .5, 0);
    ball(judge, .24, std(0xe8cfae), 0, 1.3, -.1);
    const papers = new T.Group(); judge.add(papers);
    for (let i = 0; i < 9; i++) box(papers, .7, .03, .5, std(0xf1eadb), -.9, 1.02 + i * .04, 0).rotation.y = i * .25;
    const jury = new T.Group(); g.add(jury); jury.position.set(-3, 0, -.4);
    const heads = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
      const z = -1.5 + c * .62, x = -r * .75;
      box(jury, .46, .4 + r * .3, .46, WOOD(), x, .2 + r * .15, z);
      heads.push(ball(jury, .17, std(0xcaa987), x, .68 + r * .3, z));
    }
    const pros = new T.Group(), def = new T.Group(); g.add(pros, def);
    const stand = (p, col) => { box(p, .6, .95, .4, WOOD(), 0, .47, 0); ball(p, .2, std(0xe8cfae), 0, 1.45, -.4); box(p, .46, .68, .24, std(col), 0, .9, -.4).position.y = .95; };
    stand(pros, 0x54222a); pros.position.set(1.6, 0, .4);
    stand(def, 0x22365c); def.position.set(3.2, 0, .4);
    const pub = new T.Group(); g.add(pub); pub.position.z = 2.5;
    const pc = [0x6b6f80, 0x8b5c4a, 0x4c6a59, 0x77659a];
    for (let r = 0; r < 2; r++) { box(pub, 6.6, .36, .36, WOOD(), .3, .18, r * .72 - .3); for (let i = 0; i < 9; i++) ball(pub, .17, std(pc[(i + r) % 4]), -2.8 + i * .78, .6, r * .72 - .3); }
    let verdict = -1;
    return { g, cam: [0, 11, 16.5], look: [0, .4, 0], update(p, t) {
      const o = ss(.06, .32, p); walls.forEach(w => { w.scale.y = Math.max(.02, 1 - o); w.position.y = 1.5 * (1 - o); });
      papers.scale.y = Math.max(.1, 1 - ss(.1, .35, p) * .9);
      const j = ss(.3, .5, p); jury.scale.setScalar(Math.max(.001, j));
      const s = ss(.48, .66, p); pros.scale.setScalar(Math.max(.001, s)); def.scale.setScalar(Math.max(.001, s));
      pub.scale.setScalar(Math.max(.001, ss(.64, .84, p)));
      if (verdict >= 0) heads.forEach((h, i) => { const on = t - verdict > i * .16; h.material.color.set(on ? 0x8df0a8 : 0xcaa987); h.material.emissive.set(on ? 0x2ad36b : 0); h.material.emissiveIntensity = on ? .9 : 0; });
    }, action(t) { verdict = verdict < 0 ? t : -1; if (verdict < 0) heads.forEach(h => { h.material.color.set(0xcaa987); h.material.emissive.set(0); }); return verdict >= 0; } };
  }

  /* ---------- лестница: инстанции и социальный лифт ---------- */
  function stairs(n, figure) {
    const g = new T.Group(), steps = [], W = 8 / n;
    for (let i = 0; i < n; i++) {
      const h = .9 + i * 1.1;
      steps.push(box(g, W * .96, h, 3, std(0x27304b, { metalness: .3, emissive: 0xf0c36b, emissiveIntensity: 0 }), -4 + W / 2 + i * W, h / 2 - 2, 0));
    }
    const mover = new T.Group(); g.add(mover);
    if (figure) {
      const c = std(0xf6f2ea);
      add(mover, new T.Mesh(new T.ConeGeometry(.36, 1.15, 20), c), 0, .58, 0); ball(mover, .24, std(0xe8cfae), 0, 1.3, 0);
      box(mover, .46, .34, .1, std(0xe0574f), .36, .55, 0);
    } else {
      for (let i = 0; i < 6; i++) box(mover, .95, .025, .72, std(0xf1eadb), 0, .1 + i * .05, 0).rotation.y = i * .12;
      const seal = cyl(mover, .17, .17, .05, std(0xc2272d), .25, .42, 0); seal.rotation.z = .1;
    }
    const top = i => -2 + .9 + i * 1.1, cx = i => -4 + W / 2 + i * W;
    return { g, swing: .6, cam: [0, 3, 16], update(p) {
      const f = Math.max(0, Math.min(n - 1, p * n * 1.02 - .08)), i = Math.floor(f), k = ss(.15, .85, f - i), j = Math.min(n - 1, i + 1);
      mover.position.set(cx(i) + (cx(j) - cx(i)) * k, top(i) + (top(j) - top(i)) * k + Math.sin(k * Math.PI) * .75, 0);
      steps.forEach((s, q) => { s.material.emissiveIntensity = q <= Math.round(f) ? .32 : 0; });
    } };
  }

  /* ---------- университет ---------- */
  function university() {
    const g = new T.Group(), s = STONE();
    for (let i = 0; i < 3; i++) box(g, 8.4 - i * .4, .2, 4.6 - i * .4, s, 0, -2 + i * .2, 0);
    const wall = box(g, 6.8, 2.8, 3, std(0xb9a98e), 0, -.1, -.3);
    const lights = [];
    for (let i = 0; i < 5; i++) { if (i === 2) continue; lights.push(box(g, .46, .95, .03, std(0x20283f, { emissive: 0xffc25a, emissiveIntensity: 0 }), -2.5 + i * 1.25, -.1, 1.22)); }
    box(g, .8, 1.55, .04, WOOD(), 0, -.72, 1.22);
    const cols = [];
    for (let i = 0; i < 8; i++) {
      const c = new T.Group(); c.position.set(-3.5 + i, -1.55, 1.75); g.add(c);
      cyl(c, .2, .24, 2.75, s, 0, 1.38, 0); box(c, .56, .16, .56, s, 0, 2.82, 0); box(c, .56, .12, .56, s, 0, .05, 0);
      cols.push(c);
    }
    const top = new T.Group(); g.add(top);
    box(top, 8, .44, 4.3, s, 0, 1.55, .15);
    const shp = new T.Shape(); shp.moveTo(-4, 0); shp.lineTo(4, 0); shp.lineTo(0, 1.25); shp.closePath();
    const ped = new T.Mesh(new T.ExtrudeGeometry(shp, { depth: 4.3, bevelEnabled: false }), STONE()); ped.position.set(0, 1.77, -2); top.add(ped);
    return { g, cam: [0, 2.2, 20], update(p) {
      cols.forEach((c, i) => { c.scale.y = Math.max(.01, ss(.02 + i * .03, .2 + i * .03, p)); });
      const k = ss(.36, .58, p); top.position.y = (1 - k) * 4.5; top.visible = k > .001;
      ped.material.transparent = true; ped.material.opacity = k;
      lights.forEach((l, i) => { l.material.emissiveIntensity = ss(.6 + i * .08, .68 + i * .08, p) * 1.8; });
    } };
  }

  /* ---------- книга с датами ---------- */
  function book(data) {
    const g = new T.Group(), W = 3, D = 3.9;
    box(g, W * 2 + .3, .1, D + .2, std(0x54222a, { roughness: .6 }), 0, -.3, 0);
    box(g, W, .22, D, std(0xe8dfc9), -W / 2, -.14, 0); box(g, W, .22, D, std(0xe8dfc9), W / 2, -.14, 0);
    const tex = (a, b, flip) => {
      const c = document.createElement('canvas'); c.width = 768; c.height = 1000; const x = c.getContext('2d');
      if (flip) { x.translate(768, 1000); x.rotate(Math.PI); }
      x.fillStyle = '#f2e9d5'; x.fillRect(0, 0, 768, 1000); x.strokeStyle = '#b89a5a'; x.lineWidth = 4; x.strokeRect(40, 40, 688, 920);
      x.fillStyle = '#54222a'; x.textAlign = 'center'; x.font = '900 230px Georgia, serif'; x.fillText(a, 384, 450);
      x.fillStyle = '#2b2a33'; x.font = '58px Georgia, serif';
      let y = 590, line = ''; b.split(' ').forEach(w => { if (x.measureText(line + w).width > 610) { x.fillText(line, 384, y); y += 62; line = ''; } line += w + ' '; }); x.fillText(line, 384, y);
      const t = new T.CanvasTexture(c); t.anisotropy = 4; t.colorSpace = T.SRGBColorSpace; return t;
    };
    const blank = tex('', '');
    const pages = data.map((d, i) => {
      const P = new T.Group(); g.add(P);
      const front = new T.Mesh(new T.PlaneGeometry(W, D), new T.MeshStandardMaterial({ map: tex(d[0], d[1]), roughness: .9 })); front.rotation.x = -Math.PI / 2; front.position.x = W / 2; P.add(front);
      const back = new T.Mesh(new T.PlaneGeometry(W, D), new T.MeshStandardMaterial({ map: blank, roughness: .9 })); back.rotation.x = Math.PI / 2; back.position.x = W / 2; back.position.y = -.005; P.add(back);
      return P;
    });
    const n = data.length;
    return { g, swing: .3, cam: [0, 11.5, 9.5], look: [0, 0, .2], update(p) {
      const f = p * n;
      pages.forEach((P, i) => {
        const k = i < n - 1 ? ss(i + .55, i + 1, f) : 0;
        P.rotation.z = k * Math.PI;
        P.position.y = .01 + (1 - k) * (n - i) * .012 + k * i * .012;
      });
    } };
  }

  /* ---------- три колонны итогов ---------- */
  function pillars() {
    const g = new T.Group();
    box(g, 7.6, .28, 3.2, std(0x20283f, { metalness: .4 }), 0, -2.3, 0);
    const cols = [[0xf0c36b, -2.5], [0x8fb7ff, 0], [0x8df0a8, 2.5]].map(a => {
      const c = new T.Group(); c.position.set(a[1], -2.16, 0); g.add(c);
      const m = std(a[0], { metalness: .55, roughness: .35 });
      cyl(c, .58, .66, 4, m, 0, 2, 0); box(c, 1.5, .24, 1.5, m, 0, 4.1, 0); return c;
    });
    return { g, swing: .55, cam: [0, 1.6, 17], update(p) { cols.forEach((c, i) => { c.scale.y = Math.max(.01, ss(.04 + i * .28, .3 + i * .28, p)); }); } };
  }

  /* ---------- столбики монет: долг и проценты ---------- */
  function coins() {
    const g = new T.Group(), N = 112, A = 62;
    const geo = new T.CylinderGeometry(.42, .42, .12, 26);
    const a = new T.InstancedMesh(geo, GOLD(), A), b = new T.InstancedMesh(geo, std(0xc25a4a, { metalness: .8, roughness: .34 }), N - A);
    g.add(a, b);
    const slot = i => { const col = Math.floor(i / 10) ; const cx = (col % 4) * 1.05 - 1.6, cz = Math.floor(col / 4) * 1.05 - 1.5 ; return [cx, -2 + (i % 10) * .125 + (col >= 8 ? 0 : 0), cz]; };
    const M = new T.Matrix4(), Q = new T.Quaternion(), S = new T.Vector3(), V = new T.Vector3();
    return { g, cam: [0, 4, 12.5], look: [0, -.6, 0], update(p) {
      for (let i = 0; i < N; i++) {
        const st = i / N * .86, k = ss(st, st + .09, p), s = slot(i);
        V.set(s[0], s[1] + (1 - k) * 6, s[2]); S.setScalar(k > .001 ? 1 : .0001); M.compose(V, Q, S);
        if (i < A) a.setMatrixAt(i, M); else b.setMatrixAt(i - A, M);
      }
      a.instanceMatrix.needsUpdate = b.instanceMatrix.needsUpdate = true;
    } };
  }

  const BUILD = {
    chain, plot, scales, court, university, pillars, coins,
    instances: () => stairs(4, false), lift: () => stairs(3, true),
    women: () => book([['1858', 'Мариинское женское училище'], ['1869', 'Лубянские и Аларчинские курсы'], ['1872', 'Курсы Герье, женские врачебные курсы'], ['1878', 'Бестужевские курсы']]),
  };

  let R, scene, cam, wrap, cur, name, canvas, ok = false;
  const cache = {}, st = { yaw: 0, tilt: 0, vy: 0, drag: false, lx: 0, ly: 0, p: 0, np: 0 };

  function size() {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height;
    cam.fov = cam.aspect < .9 ? 46 : 34; cam.updateProjectionMatrix();
  }
  function init(c) {
    canvas = c;
    try { R = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); } catch (e) { canvas.style.display = 'none'; return false; }
    R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    if (T.ACESFilmicToneMapping) { R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.15; }
    scene = new T.Scene(); cam = new T.PerspectiveCamera(34, 1, .1, 100);
    scene.add(new T.HemisphereLight(0xdfe7ff, 0x2a2233, 1.4));
    const k = new T.DirectionalLight(0xfff0d6, 2.6); k.position.set(5, 9, 7); scene.add(k);
    const r = new T.DirectionalLight(0x7fb0ff, 1.3); r.position.set(-7, 3, -5); scene.add(r);
    wrap = new T.Group(); scene.add(wrap);
    size(); addEventListener('resize', size);
    canvas.addEventListener('pointerdown', e => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; st.vy = 0; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx, dy = e.clientY - st.ly; st.lx = e.clientX; st.ly = e.clientY;
      st.yaw += dx * .011; st.vy = dx * .011; st.tilt = Math.max(-.5, Math.min(.5, st.tilt + dy * .006));
    });
    const up = () => { st.drag = false; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    ok = true; requestAnimationFrame(loop);
    return true;
  }
  function show(n) {
    if (!ok || n === name) return;
    name = n;
    if (cur) wrap.remove(cur.g);
    cur = null; canvas.classList.toggle('on', !!n);
    if (!n) return;
    cur = cache[n] || (cache[n] = BUILD[n]());
    wrap.add(cur.g); st.yaw = 0; st.tilt = 0; st.vy = 0;
    cam.position.fromArray(cur.cam); const l = cur.look || [0, 0, 0]; cam.lookAt(l[0], l[1], l[2]);
    size();
    if (window.__deckTest) st.p = st.np;
  }
  const progress = p => { st.np = p; };
  let clock = 0, last = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (!cur) { last = now; return; }
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now; clock += dt;
    if (!st.drag) { st.vy *= .94; st.yaw += st.vy + (cur.swing ? 0 : dt * .26); }
    st.p += (st.np - st.p) * .14;
    wrap.rotation.y = st.yaw + (cur.swing ? Math.sin(clock * .55) * cur.swing : 0); wrap.rotation.x = st.tilt;
    cur.update(st.p, clock);
    R.render(scene, cam);
  }
  return { init, show, progress, action: () => (cur && cur.action ? cur.action(clock) : false) };
})();
