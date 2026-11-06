/* Эффекты оформления: liquid glass (блик за курсором, упругое нажатие, преломление),
   анимации при прокрутке, параллакс фона, полоса прогресса чтения. Без зависимостей. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ua = navigator.userAgent;

  /* ---------- преломление стекла (только Chromium: там backdrop-filter понимает SVG-фильтры) ---------- */
  var chromium = !!window.chrome && /Chrome\//.test(ua) && !/iP(hone|ad|od)|CriOS|FxiOS/.test(ua);
  function lensMap() {
    /* карта смещений «линзы»: у краёв скруглённого прямоугольника пиксели фона тянутся внутрь */
    var N = 256, c = document.createElement('canvas'); c.width = c.height = N;
    var g = c.getContext('2d'), img = g.createImageData(N, N), d = img.data;
    var r = 0.22, band = 0.2;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var u = (x + 0.5) / N * 2 - 1, v = (y + 0.5) / N * 2 - 1;
      var qx = Math.abs(u) - (1 - r), qy = Math.abs(v) - (1 - r);
      var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      var sd = Math.min(Math.max(qx, qy), 0) + Math.sqrt(ox * ox + oy * oy) - r; /* < 0 внутри */
      var t = Math.max(0, Math.min(1, 1 + sd / band));          /* 0 в центре, 1 на краю */
      var k = t * t * (3 - 2 * t);
      var len = Math.sqrt(u * u + v * v) || 1;
      var i = (y * N + x) * 4;
      d[i] = 128 - (u / len) * k * 127;
      d[i + 1] = 128 - (v / len) * k * 127;
      d[i + 2] = 128; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
  }
  function stretchMap() {
    /* вертикальная карта: чем выше пиксель, тем дальше снизу берётся картинка — строка «тянется» вверх */
    var c = document.createElement('canvas'); c.width = 4; c.height = 256;
    var g = c.getContext('2d'), img = g.createImageData(4, 256), d = img.data;
    for (var y = 0; y < 256; y++) {
      var t = 1 - y / 255, k = t * t;                       /* 1 сверху → 0 снизу */
      for (var x = 0; x < 4; x++) { var i = (y * 4 + x) * 4; d[i] = 128; d[i + 1] = 128 + k * 127; d[i + 2] = 128; d[i + 3] = 255; }
    }
    g.putImageData(img, 0, 0); return c.toDataURL();
  }
  function initRefract() {
    if (!chromium || reduce) return;
    var fe = document.getElementById('lg-map'); if (!fe) return;
    try {
      var url = lensMap();
      fe.setAttribute('href', url); fe.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);
      var sm = document.getElementById('lg-smap');
      if (sm) { var su = stretchMap(); sm.setAttribute('href', su); sm.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', su); }
      root.classList.add('lg-refract');
    } catch (e) {}
  }

  /* ---------- появление при прокрутке ---------- */
  var SEL = '.hero > *, .stats > .stat, .sec-h, .grid > .tile, .list > .row, .hits > .row, .toolbar, .empty, .doc > *, .tq-topics > *, .tq-res, .tq-err > li, .pn, .fc';
  var io = null, view = null;
  function variant(el) {
    if (el.matches('.doc > h2, .doc > blockquote, .list > .row')) return 'rv-l';
    if (el.matches('.doc > .wg, .doc > .wg-slot, .grid > .tile, .stats > .stat')) return 'rv-s';
    return '';
  }
  function onSeen(entries) {
    var k = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(k++ * 0.06, 0.42) + 's');
      el.classList.add('in'); io.unobserve(el);
      if (el.querySelector && el.querySelector('[data-count]')) countUp(el);
      setTimeout(function () { el.style.removeProperty('--d'); }, 1300);
    });
  }
  function scan() {
    if (!view) return;
    var els = view.querySelectorAll(SEL), vh = view.clientHeight, top = view.getBoundingClientRect().top, n = 0;
    Array.prototype.forEach.call(els, function (el) {
      if (el.classList.contains('rv')) return;
      if (reduce || !io) { el.classList.add('rv', 'in'); return; }
      var r = el.getBoundingClientRect();
      if (r.top - top < vh) el.style.setProperty('--d', Math.min(n++ * 0.055, 0.6) + 's'); /* первый экран — лесенкой */
      el.classList.add('rv'); var v = variant(el); if (v) el.classList.add(v);
      io.observe(el);
    });
  }
  function countUp(box) {
    Array.prototype.forEach.call(box.querySelectorAll('[data-count]'), function (b) {
      var to = +b.dataset.count, t0 = null;
      if (reduce || !to) return;
      function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1100, 1); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }

  /* ---------- прокрутка: параллакс фона, стеклянная шапка, прогресс чтения ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false; if (!view) return;
      var y = view.scrollTop, max = view.scrollHeight - view.clientHeight;
      if (!reduce) root.style.setProperty('--sy', Math.round(y));
      document.body.classList.toggle('scrolled', y > 8);
      var pr = document.querySelector('#prog i');
      if (pr) pr.style.setProperty('--p', document.body.classList.contains('sub') && max > 40 ? (y / max).toFixed(4) : 0);
      clearTimeout(onScroll.t); onScroll.t = setTimeout(revealVisible, 140);
    });
  }
  /* страховка: после резкого прыжка (оглавление, помощник) показать всё, что на экране */
  function revealVisible() {
    if (!view) return;
    var vr = view.getBoundingClientRect();
    Array.prototype.forEach.call(view.querySelectorAll('.rv:not(.in)'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom > vr.top && r.top < vr.bottom) { el.classList.add('in'); if (io) io.unobserve(el); }
    });
  }

  /* ---------- блик за курсором, наклон плиток, упругое нажатие ---------- */
  var GLASS = '.lg, header, .ib, .tile, .row, .modal, .card3, .tq-o, .tq-topic, .hp-go, .hp-next, #hp-fab, #ai-fab';
  var PRESS = '.ib, .tile, .row, .tq-o, .tq-topic, .wg-chip';
  var tilted = null, pending = null;
  function onMove(e) {
    pending = e;
    if (onMove.raf) return;
    onMove.raf = requestAnimationFrame(function () {
      onMove.raf = 0; var ev = pending; if (!ev || !ev.target || !ev.target.closest) return;
      var el = ev.target.closest(GLASS);
      if (el) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      }
      var tile = ev.pointerType === 'mouse' && !reduce ? ev.target.closest('.tile') : null;
      if (tilted && tilted !== tile) { tilted.style.removeProperty('--rx'); tilted.style.removeProperty('--ry'); }
      if (tile) {
        var b = tile.getBoundingClientRect();
        tile.style.setProperty('--rx', ((0.5 - (ev.clientY - b.top) / b.height) * 9).toFixed(2) + 'deg');
        tile.style.setProperty('--ry', (((ev.clientX - b.left) / b.width - 0.5) * 11).toFixed(2) + 'deg');
      }
      tilted = tile;
    });
  }
  function release() { Array.prototype.forEach.call(document.querySelectorAll('.press'), function (x) { x.classList.remove('press'); }); }
  function onDown(e) {
    var el = e.target.closest && e.target.closest(PRESS);
    if (el && !el.disabled && !reduce) el.classList.add('press');
    onMove(e);
  }

  function init() {
    view = document.getElementById('view'); if (!view) return;
    initRefract();
    if ('IntersectionObserver' in window) io = new IntersectionObserver(onSeen, { root: view, rootMargin: '0px 0px -3% 0px', threshold: 0 });
    /* каждая новая отрисовка экрана (замена содержимого #view) — заново размечаем элементы */
    new MutationObserver(function () {
      requestAnimationFrame(scan); onScroll();
    }).observe(view, { childList: true });
    view.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    ['pointerup', 'pointercancel', 'dragstart'].forEach(function (t) { document.addEventListener(t, release, { passive: true }); });
    window.addEventListener('blur', release);
    window.addEventListener('resize', onScroll, { passive: true });
    scan(); onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.HubFx = { scan: scan };
})();
