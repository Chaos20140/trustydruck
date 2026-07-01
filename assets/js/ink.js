/* ============================================================
   TRUSTYDRUCK — "NASSDRUCK" WebGL2 Ink-Fluid Engine
   A real Navier–Stokes dye fluid. Dye is stored as C/M/Y ink
   densities and composited SUBTRACTIVELY (Beer–Lambert) over
   warm paper, so C+M→blue, C+Y→green, M+Y→red — real print mix.
   Self-hosted, no dependencies. Degrades to a CSS fallback.
   ============================================================ */
(function () {
  "use strict";

  const canvas = document.getElementById("ink");
  if (!canvas) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMem = (navigator.deviceMemory || 8) <= 2;
  const stage = canvas.closest("[data-ink-stage]") || canvas.parentElement;

  // ---- capability gate -> otherwise leave the CSS fallback visible ----
  let gl;
  try {
    gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: "high-performance" });
  } catch (e) { gl = null; }
  if (!gl || !gl.getExtension("EXT_color_buffer_float") || reduce || lowMem) {
    document.documentElement.classList.add("no-ink");
    return;
  }
  document.documentElement.classList.add("has-ink");

  // ---------- tuning ----------
  const small = matchMedia("(max-width: 820px), (pointer: coarse)").matches;
  const SIM = lowMem ? 80 : small ? 110 : 160;   // velocity grid
  const DYE = lowMem ? 320 : small ? 448 : 640;  // dye grid
  const PRESSURE_ITER = small ? 14 : 20;
  const VELOCITY_DISS = 0.9;          // damp motion so ink pools, not explodes
  const DYE_DISS = 0.82;              // ink stays wet a few seconds, then "dries" back to paper
  const PRESSURE_DECAY = 0.82;
  const CURL = 12;                    // vorticity — organic swirl (gentle)
  const SPLAT = 0.0011;               // splat radius (relative)
  const FORCE = 5200;                 // pointer velocity gain
  const VCAP = 340;                   // clamp splat velocity magnitude
  const DPR = Math.min(devicePixelRatio || 1, 2);

  // CMY ink loadout the "nib" cycles through (channel densities: r=C, g=M, b=Y)
  const INKS = [
    [1.0, 0.05, 0.0],  // Cyan
    [0.05, 1.0, 0.06], // Magenta
    [0.0, 0.06, 1.0],  // Yellow
    [0.9, 0.55, 0.0],  // brand electric blue (C + a bit of M)
    [0.85, 0.9, 0.0],  // over-ink pop
  ];

  // ---------- gl helpers ----------
  const quad = (() => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const i = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    return b;
  })();

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + "\n" + src);
    return s;
  }
  function program(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let k = 0; k < n; k++) { const info = gl.getActiveUniform(p, k); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }

  const VERT = `#version 300 es
  precision highp float;
  in vec2 aPos; out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
  uniform vec2 texel;
  void main(){ vUv = aPos*0.5+0.5; vL=vUv-vec2(texel.x,0.0); vR=vUv+vec2(texel.x,0.0);
    vT=vUv+vec2(0.0,texel.y); vB=vUv-vec2(0.0,texel.y); gl_Position=vec4(aPos,0.0,1.0); }`;

  const F_HEAD = `#version 300 es
  precision highp float; precision highp sampler2D;
  in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 o;`;

  const P = {
    splat: program(VERT, `${F_HEAD}
      uniform sampler2D uTarget; uniform float aspect; uniform vec3 color;
      uniform vec2 point; uniform float radius;
      void main(){ vec2 p=vUv-point; p.x*=aspect;
        vec3 splat=exp(-dot(p,p)/radius)*color;
        o=vec4(texture(uTarget,vUv).xyz+splat,1.0); }`),
    advect: program(VERT, `${F_HEAD}
      uniform sampler2D uVel; uniform sampler2D uSrc; uniform vec2 texel;
      uniform float dt; uniform float diss;
      void main(){ vec2 c=vUv-dt*texture(uVel,vUv).xy*texel;
        o=texture(uSrc,c)/(1.0+diss*dt); }`),
    diverge: program(VERT, `${F_HEAD}
      uniform sampler2D uVel;
      void main(){ float l=texture(uVel,vL).x; float r=texture(uVel,vR).x;
        float t=texture(uVel,vT).y; float b=texture(uVel,vB).y;
        o=vec4(0.5*(r-l+t-b),0.0,0.0,1.0); }`),
    curl: program(VERT, `${F_HEAD}
      uniform sampler2D uVel;
      void main(){ float l=texture(uVel,vL).y; float r=texture(uVel,vR).y;
        float t=texture(uVel,vT).x; float b=texture(uVel,vB).x;
        o=vec4(0.5*(r-l-(t-b)),0.0,0.0,1.0); }`),
    vort: program(VERT, `${F_HEAD}
      uniform sampler2D uVel; uniform sampler2D uCurl; uniform float curl; uniform float dt;
      void main(){ float l=texture(uCurl,vL).x; float r=texture(uCurl,vR).x;
        float t=texture(uCurl,vT).x; float b=texture(uCurl,vB).x; float c=texture(uCurl,vUv).x;
        vec2 f=0.5*vec2(abs(t)-abs(b),abs(r)-abs(l));
        f/=length(f)+0.0001; f*=curl*c; f.y*=-1.0;
        vec2 v=texture(uVel,vUv).xy+f*dt; v=clamp(v,-1000.0,1000.0);
        o=vec4(v,0.0,1.0); }`),
    pressure: program(VERT, `${F_HEAD}
      uniform sampler2D uPress; uniform sampler2D uDiv;
      void main(){ float l=texture(uPress,vL).x; float r=texture(uPress,vR).x;
        float t=texture(uPress,vT).x; float b=texture(uPress,vB).x; float d=texture(uDiv,vUv).x;
        o=vec4((l+r+t+b-d)*0.25,0.0,0.0,1.0); }`),
    grad: program(VERT, `${F_HEAD}
      uniform sampler2D uPress; uniform sampler2D uVel;
      void main(){ float l=texture(uPress,vL).x; float r=texture(uPress,vR).x;
        float t=texture(uPress,vT).x; float b=texture(uPress,vB).x;
        vec2 v=texture(uVel,vUv).xy-vec2(r-l,t-b);
        o=vec4(v,0.0,1.0); }`),
    clear: program(VERT, `${F_HEAD}
      uniform sampler2D uTex; uniform float value;
      void main(){ o=texture(uTex,vUv)*value; }`),
    // subtractive CMY display over warm paper + wet specular + grain + vignette
    display: program(VERT, `${F_HEAD}
      uniform sampler2D uDye; uniform vec2 texel; uniform vec3 paper; uniform float time; uniform float grain;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main(){
        vec3 d = max(texture(uDye,vUv).xyz, 0.0);
        // Beer-Lambert subtractive: C absorbs R, M absorbs G, Y absorbs B
        float k = 2.05;
        vec3 col = paper * exp(-d * k);
        // wet specular: highlight along ink gradient (edges of a wet pool)
        float dl=length(texture(uDye,vL).xyz), dr=length(texture(uDye,vR).xyz);
        float dt=length(texture(uDye,vT).xyz), db=length(texture(uDye,vB).xyz);
        vec2 g = vec2(dr-dl, dt-db);
        float edge = clamp(length(g)*2.2, 0.0, 1.0);
        float ink = clamp(length(d)*0.9, 0.0, 1.0);
        col += edge*ink*vec3(0.16,0.17,0.19);            // glossy wet rim
        col -= edge*ink*vec3(0.05);                       // and a touch of shadow
        // paper grain
        float n = hash(vUv*vec2(1400.0,900.0)+time*0.01);
        col += (n-0.5)*grain;
        // subtle vignette
        vec2 q = vUv-0.5; col *= 1.0 - dot(q,q)*0.35;
        o = vec4(clamp(col,0.0,1.0), 1.0);
      }`),
  };

  // ---------- framebuffers ----------
  function fbo(w, h, internal, format, type, filter) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb: f, w, h, texel: [1 / w, 1 / h] };
  }
  function dbl(w, h, internal, format, type, filter) {
    let a = fbo(w, h, internal, format, type, filter), b = fbo(w, h, internal, format, type, filter);
    return { get r() { return a; }, get w() { return b; }, swap() { const t = a; a = b; b = t; } };
  }

  const F = gl.RGBA16F, FF = gl.RGBA, T = gl.HALF_FLOAT;
  const RG = gl.RG16F, RGF = gl.RG, R = gl.R16F, RF = gl.RED;
  const L = gl.LINEAR, N = gl.NEAREST;
  let velocity, dye, divergence, curlF, pressure;

  function allocate() {
    velocity = dbl(SIM, SIM, RG, RGF, T, L);
    dye = dbl(DYE, DYE, F, FF, T, L);
    divergence = fbo(SIM, SIM, R, RF, T, N);
    curlF = fbo(SIM, SIM, R, RF, T, N);
    pressure = dbl(SIM, SIM, R, RF, T, N);
  }
  allocate();

  // ---------- draw plumbing ----------
  function bindQuad(prog) {
    gl.useProgram(prog.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const loc = gl.getAttribLocation(prog.p, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }
  function draw(target) {
    if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb); gl.viewport(0, 0, target.w, target.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
  function tex(unit, texture) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture); return unit; }

  // ---------- simulation step ----------
  function step(dt) {
    gl.disable(gl.BLEND);

    // curl
    bindQuad(P.curl);
    gl.uniform2f(P.curl.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.curl.u.uVel, tex(0, velocity.r.tex));
    draw(curlF);

    // vorticity
    bindQuad(P.vort);
    gl.uniform2f(P.vort.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.vort.u.uVel, tex(0, velocity.r.tex));
    gl.uniform1i(P.vort.u.uCurl, tex(1, curlF.tex));
    gl.uniform1f(P.vort.u.curl, CURL);
    gl.uniform1f(P.vort.u.dt, dt);
    draw(velocity.w); velocity.swap();

    // divergence
    bindQuad(P.diverge);
    gl.uniform2f(P.diverge.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.diverge.u.uVel, tex(0, velocity.r.tex));
    draw(divergence);

    // decay pressure
    bindQuad(P.clear);
    gl.uniform1i(P.clear.u.uTex, tex(0, pressure.r.tex));
    gl.uniform1f(P.clear.u.value, PRESSURE_DECAY);
    draw(pressure.w); pressure.swap();

    // pressure jacobi
    bindQuad(P.pressure);
    gl.uniform2f(P.pressure.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.pressure.u.uDiv, tex(0, divergence.tex));
    for (let i = 0; i < PRESSURE_ITER; i++) {
      gl.uniform1i(P.pressure.u.uPress, tex(1, pressure.r.tex));
      draw(pressure.w); pressure.swap();
    }

    // subtract gradient
    bindQuad(P.grad);
    gl.uniform2f(P.grad.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.grad.u.uPress, tex(0, pressure.r.tex));
    gl.uniform1i(P.grad.u.uVel, tex(1, velocity.r.tex));
    draw(velocity.w); velocity.swap();

    // advect velocity
    bindQuad(P.advect);
    gl.uniform2f(P.advect.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.advect.u.uVel, tex(0, velocity.r.tex));
    gl.uniform1i(P.advect.u.uSrc, tex(0, velocity.r.tex));
    gl.uniform1f(P.advect.u.dt, dt);
    gl.uniform1f(P.advect.u.diss, VELOCITY_DISS);
    draw(velocity.w); velocity.swap();

    // advect dye
    bindQuad(P.advect);
    gl.uniform2f(P.advect.u.texel, velocity.r.texel[0], velocity.r.texel[1]);
    gl.uniform1i(P.advect.u.uVel, tex(0, velocity.r.tex));
    gl.uniform1i(P.advect.u.uSrc, tex(1, dye.r.tex));
    gl.uniform1f(P.advect.u.dt, dt);
    gl.uniform1f(P.advect.u.diss, DYE_DISS);
    draw(dye.w); dye.swap();
  }

  function splat(x, y, dx, dy, color) {
    const aspect = canvas.width / canvas.height;
    // velocity
    bindQuad(P.splat);
    gl.uniform1f(P.splat.u.aspect, aspect);
    gl.uniform2f(P.splat.u.point, x, y);
    gl.uniform1f(P.splat.u.radius, SPLAT);
    gl.uniform3f(P.splat.u.color, dx, dy, 0);
    gl.uniform1i(P.splat.u.uTarget, tex(0, velocity.r.tex));
    draw(velocity.w); velocity.swap();
    // dye
    bindQuad(P.splat);
    gl.uniform3f(P.splat.u.color, color[0], color[1], color[2]);
    gl.uniform1i(P.splat.u.uTarget, tex(0, dye.r.tex));
    draw(dye.w); dye.swap();
  }

  const paper = [0.960, 0.945, 0.905];
  function render() {
    bindQuad(P.display);
    gl.uniform2f(P.display.u.texel, dye.r.texel[0], dye.r.texel[1]);
    gl.uniform3f(P.display.u.paper, paper[0], paper[1], paper[2]);
    gl.uniform1f(P.display.u.time, perfNow());
    gl.uniform1f(P.display.u.grain, 0.05);
    gl.uniform1i(P.display.u.uDye, tex(0, dye.r.tex));
    draw(null);
  }

  // ---------- pointer + auto ink ----------
  let inkIdx = 0, lastInkSwap = 0;
  const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, down: false, moved: false };

  function currentInk(boost) {
    const c = INKS[inkIdx];
    const g = (boost || 10);
    return [c[0] * g, c[1] * g, c[2] * g];
  }
  function toUv(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return [(clientX - r.left) / r.width, 1 - (clientY - r.top) / r.height];
  }
  function onMove(clientX, clientY) {
    const [x, y] = toUv(clientX, clientY);
    pointer.dx = x - pointer.x;
    pointer.dy = y - pointer.y;
    pointer.x = x; pointer.y = y; pointer.moved = true;
  }
  function capVel(vx, vy) {
    const m = Math.hypot(vx, vy);
    return m > VCAP ? [vx / m * VCAP, vy / m * VCAP] : [vx, vy];
  }
  addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); }, { passive: true });
  addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) { const [x, y] = toUv(t.clientX, t.clientY); pointer.x = x; pointer.y = y; burst(x, y); } }, { passive: true });
  addEventListener("mousedown", () => { pointer.down = true; }, { passive: true });
  addEventListener("mouseup", () => { pointer.down = false; }, { passive: true });

  function burst(x, y) {
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * 6.28, r = Math.random() * 0.03;
      splat(x + Math.cos(a) * r, y + Math.sin(a) * r, Math.cos(a) * 130, Math.sin(a) * 130, currentInk(15));
      inkIdx = (inkIdx + 1) % INKS.length;
    }
  }

  // ---------- loop ----------
  let running = true, last = 0, autoT = 0, seeded = false, t0 = 0, __frames = 0;
  let slowMs = 0, degraded = false;
  function degrade() {
    degraded = true; running = false;
    canvas.style.display = "none";                 // reveal the static CSS ink fallback
    document.documentElement.classList.add("ink-degraded");
  }
  function perfNow() { return (last - t0) / 1000; }

  function seed() {
    // opening "wet" fill so the wordmark emerges from ink
    const pts = [[0.34, 0.5], [0.52, 0.44], [0.66, 0.52], [0.46, 0.36], [0.6, 0.4]];
    pts.forEach((p, i) => {
      inkIdx = i % INKS.length;
      splat(p[0], p[1], (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, currentInk(11));
    });
    seeded = true;
  }

  function frame(now) {
    __frames++;
    if (!t0) t0 = now;
    if (!running) { last = now; requestAnimationFrame(frame); return; }
    let dt = (now - last) / 1000;
    if (!isFinite(dt) || dt <= 0) dt = 0.016;
    // FPS watchdog: if we sustain <~22fps for ~2.5s, drop to the static fallback
    if (seeded && __frames > 20) {
      if (dt > 0.045) { slowMs += dt * 1000; if (slowMs > 2500) return degrade(); }
      else slowMs = Math.max(0, slowMs - 40);
    }
    dt = Math.min(dt, 0.033);
    last = now;

    if (!seeded) seed();

    // ink loadout cycles so consecutive strokes mix
    if (now - lastInkSwap > 900) { inkIdx = (inkIdx + 1) % INKS.length; lastInkSwap = now; }

    // pointer painting
    if (pointer.moved && (Math.abs(pointer.dx) + Math.abs(pointer.dy) > 0.0002)) {
      const [vx, vy] = capVel(pointer.dx * FORCE, pointer.dy * FORCE);
      splat(pointer.x, pointer.y, vx, vy, currentInk(pointer.down ? 16 : 11));
      pointer.moved = false;
    }

    // gentle autonomous ink so it's alive without a cursor (kept away from the top nav area)
    autoT += dt;
    if (autoT > 2.4) {
      autoT = 0;
      const x = 0.12 + Math.random() * 0.76, y = 0.08 + Math.random() * 0.56;
      const ang = Math.random() * 6.28;
      splat(x, y, Math.cos(ang) * 70, Math.sin(ang) * 70, currentInk(7));
      inkIdx = (inkIdx + 1) % INKS.length;
    }

    step(dt);
    render();
    requestAnimationFrame(frame);
  }

  // ---------- resize ----------
  function resize() {
    const w = Math.floor(stage.clientWidth * DPR);
    const h = Math.floor(stage.clientHeight * DPR);
    if (w === 0 || h === 0) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
  resize();

  // pause when offscreen / tab hidden (battery + thermal)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => { running = e.isIntersecting && !document.hidden; }), { threshold: 0.01 })
      .observe(stage);
  }
  document.addEventListener("visibilitychange", () => { running = !document.hidden; });

  // tiny public API for the "Neu einfärben" button
  window.TDInk = { burst: () => burst(0.5, 0.55) };

  requestAnimationFrame(frame);
})();
