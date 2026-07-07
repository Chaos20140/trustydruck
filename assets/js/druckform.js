/* ============================================================
   TRUSTYDRUCK — "DIE DRUCKFORM" (v5 signature, subpage)
   The wordmark stands as a raised photopolymer printing plate.
   A raking press-room light follows the cursor across the relief;
   a mis-registered red plate snaps into register on first view.
   Raw WebGL2 single-quad emboss shader — NO Three.js dependency.
   Degrades to the static styled wordmark (.df-fallback).
   ============================================================ */
(function () {
  "use strict";
  var stage = document.querySelector("[data-druckform]");
  if (!stage) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lowMem = (navigator.deviceMemory || 8) <= 2;
  var canvas = stage.querySelector("canvas.df-canvas");
  if (!canvas || reduce || lowMem) return;

  var gl;
  try { gl = canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "high-performance" }); } catch (e) {}
  if (!gl) return;

  var DPR = Math.min(devicePixelRatio || 1, 1.6);
  var WORD = "TRUSTYDRUCK";
  var css = getComputedStyle(document.body);
  var FONT = (css.getPropertyValue("--f-display") || '"Bricolage Grotesque",sans-serif').trim();
  function hex(v, d) { v = (css.getPropertyValue(v) || d).trim(); var m = /^#?([0-9a-f]{6})$/i.exec(v.replace('#', '')); if (!m) v = d; var n = parseInt(v.replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  var PAPER = hex("--paper-2", "e7decb"), INK = hex("--ink", "16130e"), SPOT = hex("--spot", "da3a1f");

  var VS = "#version 300 es\nin vec2 p;out vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "#version 300 es",
    "precision highp float;",
    "in vec2 vUv;out vec4 o;",
    "uniform sampler2D uMask;uniform vec2 uRes;uniform vec2 uLight;uniform float uReg;",
    "uniform vec3 uPaper;uniform vec3 uInk;uniform vec3 uSpot;",
    "void main(){",
    "  vec2 tuv=vec2(vUv.x,1.0-vUv.y);",
    "  float h=texture(uMask,tuv).r;",
    "  vec2 e=1.6/uRes;",
    "  float hx=texture(uMask,tuv+vec2(e.x,0.)).r-texture(uMask,tuv-vec2(e.x,0.)).r;",
    "  float hy=texture(uMask,tuv+vec2(0.,e.y)).r-texture(uMask,tuv-vec2(0.,e.y)).r;",
    "  vec3 n=normalize(vec3(-hx*4.0, hy*4.0, 0.28));",
    "  vec3 L=normalize(vec3(uLight,0.9));",
    "  float diff=clamp(dot(n,L),0.0,1.0);",
    "  vec3 H=normalize(L+vec3(0.,0.,1.));",
    "  float spec=pow(max(dot(n,H),0.0),46.0);",
    "  float hr=texture(uMask,tuv+vec2(uReg*0.03,uReg*0.012)).r;",
    "  vec3 col=uPaper;",
    "  col=mix(col,uSpot,clamp(hr*uReg,0.0,1.0)*0.8);",
    "  vec3 metal=vec3(0.66,0.63,0.58);",
    "  vec3 letter=mix(uInk*0.55, metal, diff);",
    "  col=mix(col,letter,h);",
    "  col+=spec*h*0.9;",
    "  o=vec4(col,1.0);",
    "}"
  ].join("\n");

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; } return s; }
  var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.bindAttribLocation(prog, 0, "p"); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  var uMask = gl.getUniformLocation(prog, "uMask"), uRes = gl.getUniformLocation(prog, "uRes"),
    uLight = gl.getUniformLocation(prog, "uLight"), uReg = gl.getUniformLocation(prog, "uReg"),
    uPaper = gl.getUniformLocation(prog, "uPaper"), uInk = gl.getUniformLocation(prog, "uInk"), uSpot = gl.getUniformLocation(prog, "uSpot");
  gl.uniform3fv(uPaper, PAPER); gl.uniform3fv(uInk, INK); gl.uniform3fv(uSpot, SPOT);

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(uMask, 0);

  var W = 1, H = 1;
  function buildMask() {
    var r = stage.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * DPR)); H = Math.max(1, Math.round(r.height * DPR));
    canvas.width = W; canvas.height = H;
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uRes, W, H);
    var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    var c = oc.getContext("2d");
    c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    // fit the wordmark to ~88% width
    var size = H * 0.6;
    c.font = "800 " + size + "px " + FONT;
    var tw = c.measureText(WORD).width;
    size = size * Math.min((W * 0.9) / tw, (H * 0.72) / size);
    c.font = "800 " + size + "px " + FONT;
    c.textAlign = "center"; c.textBaseline = "middle";
    c.filter = "blur(" + (DPR * 1.6) + "px)";
    c.fillStyle = "#fff";
    c.fillText(WORD, W / 2, H / 2 + size * 0.02);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
  }

  var lx = 0, ly = 0.2, tlx = 0, tly = 0.2, lastMove = -1e9, regStart = -1, registered = false, running = true, alive = true, raf = 0, t0 = performance.now();

  stage.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect();
    tlx = ((e.clientX - r.left) / r.width - 0.5) * 2.0;
    tly = (0.5 - (e.clientY - r.top) / r.height) * 2.0;
    lastMove = performance.now();
  }, { passive: true });

  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { running = en.isIntersecting; if (en.isIntersecting && !registered) { registered = true; regStart = performance.now(); } }); }, { threshold: 0.08 });
  io.observe(stage);
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });

  var ro = ("ResizeObserver" in window) ? new ResizeObserver(function () { buildMask(); }) : null;

  function frame() {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (!running) return;
    var now = performance.now();
    if (now - lastMove > 1500) { var tt = (now - t0) * 0.001; tlx = Math.sin(tt * 0.6) * 0.7; tly = 0.2 + Math.cos(tt * 0.85) * 0.5; }
    lx += (tlx - lx) * 0.07; ly += (tly - ly) * 0.07;
    gl.uniform2f(uLight, lx, ly);
    var reg = 0.0;
    if (regStart > 0) { var rp = (now - regStart) / 1000; reg = rp >= 1 ? 0 : (1 - rp) * (1 - rp); if (rp >= 1) regStart = -1; }
    else if (!registered) reg = 1.0;
    gl.uniform1f(uReg, reg);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function go() {
    buildMask();
    stage.classList.add("df-on");
    if (ro) ro.observe(stage); else addEventListener("resize", buildMask, { passive: true });
    frame();
  }

  canvas.addEventListener("webglcontextlost", function (ev) { ev.preventDefault(); alive = false; cancelAnimationFrame(raf); stage.classList.remove("df-on"); }, false);

  // wait for the display font so the plate uses the real wordmark
  if (document.fonts && document.fonts.load) {
    Promise.race([
      document.fonts.load('800 100px ' + FONT).catch(function () {}),
      new Promise(function (r) { setTimeout(r, 1200); })
    ]).then(go);
  } else go();
})();
