/* Общие помощники для 3D-моделей к ранним темам экономики (Тема II, потребности и КПВ, экономические системы,
   собственность, рынок). Строится поверх window.FirmaKit (lib/ekonomika-firma3d.js), поэтому подключается после него.
   window.OsnovyKit: всё из FirmaKit + ring(), ringChips(), bar(), pedestal(), tree(), tag(). */
(function () {
  'use strict';
  var F = window.FirmaKit;
  if (!F || !window.HubWidgets || !window.HubScene3d) return;
  var K = Object.assign({}, F), C = K.C;

  /* Постамент с цветной шайбой */
  K.pedestal = function (c, x, z, col, info, r) {
    var T = c.THREE, g = K.group(c, x, 0, z);
    var p = c.mesh(new T.CylinderGeometry(r || 1.0, (r || 1.0) * 1.1, 0.35, 32), col, info); p.position.y = 0.18; g.add(p);
    return g;
  };
  /* Столбик-диаграмма, которую можно плавно менять: bar.set(h) */
  K.bar = function (c, x, z, col, info, w, g) {
    var T = c.THREE, m = c.mesh(new T.BoxGeometry(w || 0.8, 1, w || 0.8), col, info);
    m.position.set(x, 0.5, z); if (g) g.add(m);
    var cur = 1, goal = 1;
    m.set = function (h) { goal = Math.max(0.02, h); };
    m.now = function () { return cur; };
    c.onFrame(function () { cur += (goal - cur) * 0.08; m.scale.y = cur; m.position.y = cur / 2; });
    return m;
  };
  /* Деревце (для «земли», природы) */
  K.tree = function (c, x, z, info, g, s) {
    var T = c.THREE; s = s || 1; var p = new T.Group(); (g || c.root).add(p); p.position.set(x, 0, z);
    var t = c.mesh(new T.CylinderGeometry(0.08 * s, 0.12 * s, 0.7 * s, 8), C.WOOD, info); t.position.y = 0.35 * s; p.add(t);
    var k = c.mesh(new T.ConeGeometry(0.45 * s, 1.1 * s, 10), C.TEA, info); k.position.y = 1.15 * s; p.add(k);
    return p;
  };
  /* Кольцо из постаментов вокруг центра. items: [{t: подпись, col, info, icon(c, g) }] */
  K.ring = function (c, items, R, opt) {
    opt = opt || {};
    var pos = [];
    items.forEach(function (it, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / items.length + (opt.rot || 0), x = R * Math.cos(a), z = R * Math.sin(a);
      pos.push([x, z]);
      var g = K.pedestal(c, x, z, it.col, it.info, opt.pr || 0.95);
      if (opt.links !== false) c.link([0, 0.1, 0], [x, 0.1, z], C.GREY, 0.035, it.info);
      var ig = K.group(c, x, 0.35, z); if (it.icon) it.icon(c, ig, it);
      c.label(it.t, [x, opt.ly || 2.5, z], opt.ls || 0.2, it.lc || '#eef0f8');
      it._g = ig;
    });
    c.S = c.S || {}; c.S.ringPos = pos; c.S.ringItems = items;
    c.onFrame(function (t) {
      items.forEach(function (it, i) { if (it._g) it._g.position.y = 0.35 + (c.S.focus === i ? 0.25 + 0.08 * Math.sin(t * 4) : 0); });
    });
    return pos;
  };
  /* Кнопки к кольцу: камера поворачивается к выбранному постаменту */
  K.ringChips = function (items, names, extra) {
    var chips = items.map(function (it, i) {
      return {
        t: names ? names[i] : it.t.replace(/\n/g, ' '), on: function (c) {
          var p = c.S.ringPos[i]; c.S.focus = i;
          c.setView(Math.atan2(p[0], p[1]), 0.95, 9, 1.2, p[0] * 0.55, p[1] * 0.55); c.say(it.info);
        }
      };
    });
    return chips.concat(extra || []);
  };
  /* Табличка-указатель с текстом над объектом */
  K.tag = function (c, text, x, y, z, col, size) { return c.label(text, [x, y, z], size || 0.2, col); };
  /* Книжка (закон) */
  K.book = function (c, x, y, z, col, info, g, s) {
    s = s || 1; var p = K.group(c, x, y, z); if (g) { c.root.remove(p); g.add(p); }
    p.add(c.box3(0.9 * s, 0.18 * s, 0.65 * s, col || C.RED, [0, 0.09 * s, 0], info));
    p.add(c.box3(0.84 * s, 0.14 * s, 0.6 * s, C.PAPER, [0.04 * s, 0.09 * s, 0], info));
    return p;
  };
  /* Корона (власть, статус) */
  K.crown = function (c, x, y, z, info, g, s) {
    var T = c.THREE; s = s || 1; var p = K.group(c, x, y, z); if (g) { c.root.remove(p); g.add(p); }
    var ring = c.mesh(new T.CylinderGeometry(0.35 * s, 0.35 * s, 0.2 * s, 20, 1, true), C.GOLD, info, { metalness: 0.5, roughness: 0.3, side: T.DoubleSide }); ring.position.y = 0.1 * s; p.add(ring);
    for (var i = 0; i < 5; i++) { var a = i * Math.PI * 2 / 5, sp = c.mesh(new T.ConeGeometry(0.09 * s, 0.28 * s, 6), C.GOLD, info, { metalness: 0.5, roughness: 0.3 }); sp.position.set(Math.cos(a) * 0.33 * s, 0.33 * s, Math.sin(a) * 0.33 * s); p.add(sp); }
    return p;
  };
  /* Шестерёнка */
  K.gear = function (c, x, y, z, col, info, g, s) {
    var T = c.THREE; s = s || 1; var p = K.group(c, x, y, z); if (g) { c.root.remove(p); g.add(p); }
    var d = c.mesh(new T.CylinderGeometry(0.45 * s, 0.45 * s, 0.2 * s, 24), col || C.SILVER, info); d.rotation.x = Math.PI / 2; p.add(d);
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, tth = c.box3(0.18 * s, 0.18 * s, 0.2 * s, col || C.SILVER, [Math.cos(a) * 0.52 * s, Math.sin(a) * 0.52 * s, 0], info); p.add(tth); tth.rotation.z = a; }
    return p;
  };
  window.OsnovyKit = K;
})();
