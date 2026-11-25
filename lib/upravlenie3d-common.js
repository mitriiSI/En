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
