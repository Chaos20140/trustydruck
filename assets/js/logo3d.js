/* ============================================================
   TRUSTYDRUCK — 3D-Bildmarke (v5 signature)
   The Trustydruck mark (from the favicon's SVG paths) extruded in
   real 3D, tilting toward the cursor with a slow idle drift. Uses
   the self-hosted Three.js already vendored for the loupe (shared
   lazy-load). Desktop-only; mobile/no-WebGL keep the flat <img>.
   ============================================================ */
(function () {
  "use strict";
  var stage = document.querySelector("[data-logo3d]");
  if (!stage) return;

  var force = /[?&](loupe|gl3d)=1/.test(location.search);
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lowMem = (navigator.deviceMemory || 8) <= 2;
  var fine = matchMedia("(pointer: fine)").matches;
  var wide = innerWidth >= 900;
  var webgl2 = (function () { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();
  if (reduce || lowMem || !webgl2) return;
  if (!force && (!fine || !wide)) return;

  function whenReady(fn) {
    var go = function () {
      if (window.THREE) return fn();
      var existing = document.querySelector('script[data-three]');
      if (existing) { existing.addEventListener("load", fn, { once: true }); existing.addEventListener("error", function () {}, { once: true }); return; }
      var s = document.createElement("script");
      s.src = "assets/js/vendor/three.min.js"; s.setAttribute("data-three", "1");
      s.onload = fn; s.onerror = function () {};
      document.head.appendChild(s);
    };
    var idle = window.requestIdleCallback || function (c) { return setTimeout(c, 300); };
    if (document.readyState === "complete") idle(go, { timeout: 1800 });
    else addEventListener("load", function () { idle(go, { timeout: 1800 }); }, { once: true });
  }
  whenReady(build);

  function build() {
    var THREE = window.THREE;
    if (!THREE) return;
    var canvas = document.createElement("canvas");
    canvas.className = "l3-canvas";
    stage.appendChild(canvas);

    var renderer, scene, camera, group, raf = 0, alive = true, running = true;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch (e) { teardown(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
    camera.position.set(0, 0, 62);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(0.5, 0.9, 0.8); scene.add(key);
    var rim = new THREE.DirectionalLight(0xda3a1f, 0.5); rim.position.set(-0.8, -0.3, 0.4); scene.add(rim);

    // mark geometry from the favicon paths (SVG y-down -> three y-up: px=x-32, py=32-y)
    function blade() {
      var s = new THREE.Shape();
      s.moveTo(-15, -13); s.lineTo(9, 17); s.lineTo(9, -1);
      s.quadraticCurveTo(9, -13, -3, -13); s.closePath(); return s;
    }
    function tri() {
      var s = new THREE.Shape();
      s.moveTo(-17, -13); s.lineTo(1, -13); s.lineTo(-12, 2); s.closePath(); return s;
    }
    var exOpt = { depth: 7, bevelEnabled: true, bevelThickness: 0.7, bevelSize: 0.6, bevelSegments: 2, steps: 1 };
    var gBlade = new THREE.ExtrudeGeometry(blade(), exOpt);
    var gTri = new THREE.ExtrudeGeometry(tri(), exOpt);
    // centre the whole mark on origin (bbox centre ~ (-4, 2), depth 7)
    gBlade.translate(4, -2, -3.5);
    gTri.translate(4, -2, -3.5 + 0.6);

    var mBlade = new THREE.MeshPhongMaterial({ color: 0x16130e, shininess: 42, specular: 0x2a2620 });
    var mTri = new THREE.MeshPhongMaterial({ color: 0xf0eadc, shininess: 26, specular: 0x555049 });
    group = new THREE.Group();
    group.add(new THREE.Mesh(gBlade, mBlade));
    group.add(new THREE.Mesh(gTri, mTri));
    group.scale.setScalar(1.15);
    scene.add(group);

    function resize() {
      var r = stage.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }

    var tx = 0, ty = 0, rx = 0, ry = 0, lastMove = -1e9, t0 = performance.now();
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      lastMove = performance.now();
    }, { passive: true });
    stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { running = en.isIntersecting; }); }, { threshold: 0.01 });
    io.observe(stage);
    document.addEventListener("visibilitychange", function () { running = !document.hidden; });
    var ro = ("ResizeObserver" in window) ? new ResizeObserver(resize) : null;

    var slow = 0, lastT = performance.now();
    function frame() {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!running) return;
      var now = performance.now();
      var dt = Math.min(50, now - lastT); lastT = now;
      if (dt > 40) { slow++; if (slow > 240) { teardown(); return; } } else if (slow > 0) slow -= 2;

      var idleR = 0;
      if (now - lastMove > 1600) { idleR = Math.sin((now - t0) * 0.0004) * 0.5; }
      var targetY = tx * 1.1 + idleR;
      var targetX = ty * 0.9;
      ry += (targetY - ry) * 0.07;
      rx += (targetX - rx) * 0.07;
      group.rotation.y = ry;
      group.rotation.x = rx;
      renderer.render(scene, camera);
    }

    canvas.addEventListener("webglcontextlost", function (ev) { ev.preventDefault(); teardown(); }, false);

    try {
      resize(); stage.classList.add("l3-on");
      if (ro) ro.observe(stage); else addEventListener("resize", resize, { passive: true });
      frame();
    } catch (e) { teardown(); }

    function teardown() {
      alive = false; running = false; cancelAnimationFrame(raf);
      try { if (io) io.disconnect(); } catch (e) {}
      try { if (ro) ro.disconnect(); } catch (e) {}
      try { gBlade.dispose(); gTri.dispose(); mBlade.dispose(); mTri.dispose(); renderer.dispose(); } catch (e) {}
      stage.classList.remove("l3-on");
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }
})();
