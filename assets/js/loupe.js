/* ============================================================
   TRUSTYDRUCK — "FADENZÄHLER" (v5 signature)
   A printer's loupe that lifts the halftone into 3D. The hero
   image rests as a flat black raster of instanced ink-dots on
   warm paper; under the cursor-driven loupe the dots rise into
   glossy COLOURED pucks and the photo resolves "in Register".
   Self-hosted Three.js (window.THREE), lazy-injected only when
   the device can handle it. Any failure removes the GL canvas and
   the proven raster.js Canvas2D develop shows through untouched.
   ============================================================ */
(function () {
  "use strict";
  var stage = document.querySelector("[data-loupe3d]");
  if (!stage) return;

  var force = /[?&]loupe=1/.test(location.search);
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lowMem = (navigator.deviceMemory || 8) <= 2;
  var fine = matchMedia("(pointer: fine)").matches;
  var wide = innerWidth >= 900;
  var webgl2 = (function () { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();

  // Capability gate — otherwise raster.js already owns the hero (2D develop / static img).
  if (reduce || lowMem || !webgl2) return;
  if (!force && (!fine || !wide)) return;

  var img = stage.querySelector("img");
  if (!img) return;

  // lazy-inject Three only after the page is idle so LCP is never delayed
  function whenReady(fn) {
    var go = function () {
      if (window.THREE) return fn();
      var existing = document.querySelector('script[data-three]');
      if (existing) { existing.addEventListener("load", fn, { once: true }); return; }
      var s = document.createElement("script");
      s.src = "assets/js/vendor/three.min.js";
      s.setAttribute("data-three", "1");
      s.onload = fn;
      s.onerror = function () { /* stays on 2D raster */ };
      document.head.appendChild(s);
    };
    var idle = window.requestIdleCallback || function (c) { return setTimeout(c, 300); };
    if (document.readyState === "complete") idle(go, { timeout: 1500 });
    else addEventListener("load", function () { idle(go, { timeout: 1500 }); }, { once: true });
  }

  function start() {
    if (img.complete && img.naturalWidth) whenReady(build);
    else img.addEventListener("load", function () { whenReady(build); }, { once: true });
  }
  start();

  function build() {
    var THREE = window.THREE;
    if (!THREE) return;

    var canvas = document.createElement("canvas");
    canvas.className = "gl-canvas";
    stage.appendChild(canvas);

    var renderer, scene, camera, mesh, ring, geo, mat, tex, raf = 0, alive = true;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (e) { teardown(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0xf0eadc, 1);

    scene = new THREE.Scene();
    var FOV = 28;
    camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    var D = 1 / Math.tan((FOV * Math.PI / 180) / 2); // so plane height 2 fills view
    camera.position.set(0, 0, D);
    camera.lookAt(0, 0, 0);

    // texture from the same-origin <img> (no getImageData → no taint)
    tex = new THREE.Texture(img);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;

    var uniforms = {
      uPhoto: { value: tex },
      uLens: { value: new THREE.Vector2(0, 0) },
      uLensR: { value: 0.44 },
      uLift: { value: 0.42 },
      uMaxR: { value: 0.02 },
      uBase: { value: 0.02 },
      uRegister: { value: 1.0 },
      uInk: { value: new THREE.Color(0x16130e) },
      uLightDir: { value: new THREE.Vector3(0.3, 0.5, 0.9) },
    };

    var vert = [
      "attribute vec3 aOffset;",
      "attribute vec2 aUv;",
      "uniform sampler2D uPhoto;",
      "uniform vec2 uLens; uniform float uLensR; uniform float uLift;",
      "uniform float uMaxR; uniform float uBase; uniform float uRegister;",
      "uniform vec3 uInk;",
      "varying vec3 vColor; varying float vLens; varying vec3 vNormal;",
      "void main(){",
      "  vec3 tex;",
      "  vec2 off = vec2(uRegister*0.012, 0.0);",
      "  tex.r = texture2D(uPhoto, aUv + off).r;",
      "  tex.g = texture2D(uPhoto, aUv).g;",
      "  tex.b = texture2D(uPhoto, aUv - off).b;",
      "  float lum = pow(clamp(dot(tex, vec3(0.299,0.587,0.114)),0.0,1.0), 0.82);",
      "  float ink = 1.0 - lum;",
      "  float rad = clamp(ink,0.05,1.0) * uMaxR;",
      "  float d = distance(aOffset.xy, uLens);",
      "  float lens = 1.0 - smoothstep(uLensR*0.72, uLensR, d);",
      "  float lift = ink * uLift * lens;",
      "  vec3 p = position;",
      "  p.xy *= rad;",
      "  p.z *= (uBase + lift);",
      "  vec3 world = aOffset + p;",
      "  world.z += lift * 0.5;",
      "  vColor = mix(uInk, tex, lens);",
      "  vLens = lens;",
      "  vNormal = normalMatrix * normal;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);",
      "}"
    ].join("\n");

    var frag = [
      "precision highp float;",
      "uniform vec3 uLightDir;",
      "varying vec3 vColor; varying float vLens; varying vec3 vNormal;",
      "void main(){",
      "  vec3 n = normalize(vNormal);",
      "  vec3 L = normalize(uLightDir);",
      "  float diff = 0.62 + 0.38*max(dot(n,L),0.0);",
      "  vec3 H = normalize(L + vec3(0.0,0.0,1.0));",
      "  float spec = pow(max(dot(n,H),0.0), 30.0) * vLens * 0.85;",
      "  vec3 col = vColor*diff + vec3(1.0)*spec;",
      "  gl_FragColor = vec4(col, 1.0);",
      "}"
    ].join("\n");

    mat = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag });

    var COLS = 0, ROWS = 0, planeW = 0, planeH = 2;

    function buildGrid() {
      if (geo) { geo.dispose(); }
      var rect = stage.getBoundingClientRect();
      var aspect = Math.max(0.2, rect.width / Math.max(1, rect.height));
      planeW = 2 * aspect;
      // aim for ~44 columns, keep total instances bounded
      COLS = Math.max(12, Math.min(64, Math.round(44)));
      ROWS = Math.max(12, Math.round(COLS / aspect));
      if (COLS * ROWS > 3200) { ROWS = Math.floor(3200 / COLS); }
      var count = COLS * ROWS;
      uniforms.uMaxR.value = (planeW / COLS) * 0.62;

      var cyl = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
      cyl.rotateX(Math.PI / 2); // axis Y -> Z, caps face the camera

      geo = new THREE.InstancedBufferGeometry();
      geo.index = cyl.index;
      geo.attributes.position = cyl.attributes.position;
      geo.attributes.normal = cyl.attributes.normal;

      var offsets = new Float32Array(count * 3);
      var uvs = new Float32Array(count * 2);
      var i = 0;
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var u = (c + 0.5) / COLS, v = (r + 0.5) / ROWS;
          offsets[i * 3] = (u - 0.5) * planeW;
          offsets[i * 3 + 1] = (0.5 - v) * planeH;
          offsets[i * 3 + 2] = 0;
          uvs[i * 2] = u;
          uvs[i * 2 + 1] = 1.0 - v; // flip to match texture orientation
          i++;
        }
      }
      geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
      geo.setAttribute("aUv", new THREE.InstancedBufferAttribute(uvs, 2));
      geo.instanceCount = count;
      cyl.dispose();

      if (mesh) { scene.remove(mesh); }
      mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
    }

    // red focus ring (the loupe rim)
    var ringGeo = new THREE.RingGeometry(0.93, 1.0, 64);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xda3a1f, transparent: true, opacity: 0 });
    ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.08;
    scene.add(ring);

    function resize() {
      var rect = stage.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      buildGrid();
    }

    // ---- interaction state ----
    var tx = 0, ty = 0, lx = 0, ly = 0;     // target + eased loupe centre
    var over = false, lastMove = performance.now(), t0 = performance.now();
    var impulse = 0, impulseT = -1e9, registered = false;

    function toPlane(e) {
      var rect = stage.getBoundingClientRect();
      var u = (e.clientX - rect.left) / rect.width;
      var v = (e.clientY - rect.top) / rect.height;
      tx = (u - 0.5) * planeW;
      ty = (0.5 - v) * planeH;
      lastMove = performance.now();
    }
    stage.addEventListener("pointermove", function (e) { over = true; toPlane(e); }, { passive: true });
    stage.addEventListener("pointerenter", function () { over = true; });
    stage.addEventListener("pointerleave", function () { over = false; });
    stage.addEventListener("pointerdown", function () { impulseT = performance.now(); });

    // register-snap once when the hero first scrolls into view
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        running = en.isIntersecting;
        if (en.isIntersecting && !registered) { registered = true; regStart = performance.now(); }
      });
    }, { threshold: 0.01 });
    io.observe(stage);

    var running = true, regStart = -1;
    document.addEventListener("visibilitychange", function () { running = !document.hidden; });

    // ---- FPS watchdog ----
    var slowFrames = 0, lastT = performance.now();

    function frame() {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!running) return;

      var now = performance.now();
      var dt = Math.min(50, now - lastT); lastT = now;
      if (!force) {
        if (dt > 40) { slowFrames++; if (slowFrames > 240) { teardown(); return; } }
        else if (slowFrames > 0) slowFrames -= 2;
      }

      // idle → self-developing drift
      if (!over && now - lastMove > 1400) {
        var tt = (now - t0) * 0.001;
        tx = Math.sin(tt * 0.55) * planeW * 0.28;
        ty = Math.sin(tt * 0.9) * planeH * 0.26;
      }

      // eased loupe (heavy spring feel)
      lx += (tx - lx) * 0.11;
      ly += (ty - ly) * 0.11;
      uniforms.uLens.value.set(lx, ly);

      // click impression pulse
      var e = 0;
      if (now - impulseT < 320) { var k = (now - impulseT) / 320; e = Math.sin(k * Math.PI) * Math.exp(-k * 3); }
      var breathe = (!over && now - lastMove > 1400) ? (1.0 + 0.14 * Math.sin(now * 0.002)) : 1.0;
      uniforms.uLift.value = 0.42 * breathe * (1.0 - 0.55 * e);

      // register-snap 1 -> 0
      if (regStart > 0) {
        var rp = (now - regStart) / 1100;
        uniforms.uRegister.value = rp >= 1 ? 0 : (1 - rp) * (1 - rp);
        if (rp >= 1) regStart = -1;
      }

      // light + ring follow the loupe
      uniforms.uLightDir.value.set(lx * 0.35, 0.5 + ly * 0.2, 0.9);
      ring.position.x = lx; ring.position.y = ly;
      var rs = uniforms.uLensR.value;
      ring.scale.set(rs, rs, 1);
      var targetOp = (over || (now - lastMove < 1600)) ? 0.85 : 0.28;
      ringMat.opacity += (targetOp - ringMat.opacity) * 0.08;

      renderer.render(scene, camera);
    }

    canvas.addEventListener("webglcontextlost", function (ev) { ev.preventDefault(); teardown(); }, false);

    var ro = ("ResizeObserver" in window) ? new ResizeObserver(function () { resize(); }) : null;

    // go
    try {
      resize();
      stage.classList.add("loupe-on");
      if (ro) ro.observe(stage); else addEventListener("resize", resize, { passive: true });
      frame();
    } catch (e2) { teardown(); }

    function teardown() {
      alive = false;
      running = false;
      cancelAnimationFrame(raf);
      try { if (io) io.disconnect(); } catch (e) {}
      try { if (ro) ro.disconnect(); } catch (e) {}
      try { if (geo) geo.dispose(); } catch (e) {}
      try { if (ringGeo) ringGeo.dispose(); } catch (e) {}
      try { if (mat) mat.dispose(); } catch (e) {}
      try { if (tex) tex.dispose(); } catch (e) {}
      try { if (renderer) renderer.dispose(); } catch (e) {}
      stage.classList.remove("loupe-on");
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }
})();
