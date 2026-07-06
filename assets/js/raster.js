/* ============================================================
   TRUSTYDRUCK — "RASTER" halftone-loupe engine (Canvas2D)
   The image lives as a coarse black halftone on warm paper.
   The cursor is a loupe that locally tightens the screen,
   snaps dots to real ink density and rotates the screen angle
   (15° K-screen) → the photo "develops" into register.
   No WebGL. Degrades to the real colour <img>.
   ============================================================ */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMem = (navigator.deviceMemory || 8) <= 2;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const PAPER = "#f0eadc";
  const INK = "#16130e";
  const SPOT = "#da3a1f";

  const stages = Array.from(document.querySelectorAll("[data-loupe]"));
  if (!stages.length) return;
  if (!document.createElement("canvas").getContext) return; // no canvas → <img> stays

  stages.forEach(setup);

  function setup(stage) {
    const img = stage.querySelector("img");
    const canvas = stage.querySelector("canvas");
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const DPR = Math.min(devicePixelRatio || 1, 1.5);
    const P_REST = lowMem ? 12 : 10;     // resting screen pitch (css px)
    const P_FINE = 6;                    // loupe screen pitch (css px)
    const R = (lowMem ? 120 : 155);      // loupe radius (css px)
    const ANGLE = 15 * Math.PI / 180;    // K-screen angle inside the loupe

    let W = 0, H = 0, lum = null, lumW = 0, lumH = 0;
    const rest = document.createElement("canvas");
    const rctx = rest.getContext("2d");
    let ready = false, running = true, raf = 0;
    const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, inside: false };
    let pulse = 0, drift = 0;

    function build() {
      const r = stage.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      rest.width = canvas.width; rest.height = canvas.height;

      // sample source luminance (object-fit: cover) into a small buffer
      lumW = Math.max(2, Math.round(W / 3)); lumH = Math.max(2, Math.round(H / 3));
      const sc = document.createElement("canvas"); sc.width = lumW; sc.height = lumH;
      const sctx = sc.getContext("2d");
      const ir = img.naturalWidth / img.naturalHeight, fr = lumW / lumH;
      let sw, sh, sx, sy;
      if (ir > fr) { sh = img.naturalHeight; sw = sh * fr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
      else { sw = img.naturalWidth; sh = sw / fr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
      try { sctx.drawImage(img, sx, sy, sw, sh, 0, 0, lumW, lumH); } catch (e) { return false; }
      let data;
      try { data = sctx.getImageData(0, 0, lumW, lumH).data; } catch (e) { return false; } // tainted → bail to <img>
      lum = new Float32Array(lumW * lumH);
      for (let i = 0; i < lumW * lumH; i++) {
        const r8 = data[i * 4], g8 = data[i * 4 + 1], b8 = data[i * 4 + 2];
        let l = (0.299 * r8 + 0.587 * g8 + 0.114 * b8) / 255;
        l = Math.pow(l, 0.82);            // gentle gamma so paper stays airy
        lum[i] = l;
      }
      renderRest();
      ready = true;
      return true;
    }

    function sampleDark(px, py) { // px,py in css px → darkness 0..1
      let ix = (px / W * lumW) | 0, iy = (py / H * lumH) | 0;
      if (ix < 0) ix = 0; else if (ix >= lumW) ix = lumW - 1;
      if (iy < 0) iy = 0; else if (iy >= lumH) iy = lumH - 1;
      return 1 - lum[iy * lumW + ix];
    }

    function renderRest() {
      rctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      rctx.fillStyle = PAPER; rctx.fillRect(0, 0, W, H);
      rctx.fillStyle = INK;
      const maxR = P_REST * 0.62;
      for (let y = P_REST / 2; y < H; y += P_REST) {
        for (let x = P_REST / 2; x < W; x += P_REST) {
          const d = sampleDark(x, y);
          const rad = d * maxR;
          if (rad > 0.35) { rctx.beginPath(); rctx.arc(x, y, rad, 0, 6.2832); rctx.fill(); }
        }
      }
    }

    function frame() {
      if (!ready) { raf = requestAnimationFrame(frame); return; }
      if (!running) { raf = requestAnimationFrame(frame); return; }
      // blit the resting halftone (one call)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(rest, 0, 0);

      // loupe target: cursor (fine) or a slow roaming drift (touch/idle)
      if (!fine || !m.inside) {
        drift += 0.006;
        m.tx = 0.5 + Math.cos(drift) * 0.33;
        m.ty = 0.5 + Math.sin(drift * 1.3) * 0.28;
      }
      m.x += (m.tx - m.x) * 0.18; m.y += (m.ty - m.y) * 0.18;
      const cx = m.x * W, cy = m.y * H;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip();
      // fresh paper under the loupe, then the fine, rotated screen
      ctx.fillStyle = PAPER; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.translate(cx, cy); ctx.rotate(ANGLE);
      ctx.fillStyle = INK;
      const maxR = P_FINE * 0.6, span = Math.ceil(R / P_FINE) + 1;
      for (let gy = -span; gy <= span; gy++) {
        for (let gx = -span; gx <= span; gx++) {
          let lx = gx * P_FINE, ly = gy * P_FINE;
          // back-rotate to source space for sampling
          const wx = cx + lx * Math.cos(ANGLE) - ly * Math.sin(ANGLE);
          const wy = cy + lx * Math.sin(ANGLE) + ly * Math.cos(ANGLE);
          const dd = Math.hypot(wx - cx, wy - cy);
          if (dd > R) continue;
          const d = sampleDark(wx, wy);
          let rad = d * maxR;
          if (pulse > 0.001) { const k = 1 + pulse * 1.4; lx *= k; ly *= k; } // click impression
          if (rad > 0.3) { ctx.beginPath(); ctx.arc(lx, ly, rad, 0, 6.2832); ctx.fill(); }
        }
      }
      ctx.restore();

      // spot-red focus ring on the loupe edge
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832);
      ctx.strokeStyle = SPOT; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.9; ctx.stroke(); ctx.globalAlpha = 1;

      if (pulse > 0.001) pulse *= 0.9; else pulse = 0;
      raf = requestAnimationFrame(frame);
    }

    // ---- reduced-motion / low-mem: static resting halftone, no loop ----
    function staticOnly() {
      if (!build()) { showImg(); return; }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(rest, 0, 0);
      stage.classList.add("raster-on");
    }
    function showImg() { stage.classList.add("raster-fallback"); } // CSS reveals the <img>

    // ---- pointer ----
    if (fine) {
      stage.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        m.tx = (e.clientX - r.left) / r.width; m.ty = (e.clientY - r.top) / r.height; m.inside = true;
      });
      stage.addEventListener("mouseleave", () => { m.inside = false; });
      stage.addEventListener("mousedown", () => { pulse = 1; });
    }
    stage.addEventListener("touchmove", (e) => {
      const t = e.touches[0]; if (!t) return; const r = stage.getBoundingClientRect();
      m.tx = (t.clientX - r.left) / r.width; m.ty = (t.clientY - r.top) / r.height; m.inside = true;
    }, { passive: true });
    stage.addEventListener("touchend", () => { m.inside = false; });

    // ---- resize (debounced) ----
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (build()) { if (reduce || lowMem) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(rest, 0, 0); } } }, 180); }, { passive: true });

    // ---- pause offscreen / hidden ----
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((e) => { running = e.isIntersecting && !document.hidden; }), { threshold: 0.01 }).observe(stage);
    document.addEventListener("visibilitychange", () => { running = !document.hidden; });

    // ---- go (once the image is decoded) ----
    const start = () => {
      if (reduce || lowMem) { staticOnly(); return; }
      if (!build()) { showImg(); return; }
      stage.classList.add("raster-on");
      raf = requestAnimationFrame(frame);
    };
    if (img.complete && img.naturalWidth) start();
    else img.addEventListener("load", start, { once: true });
    img.addEventListener("error", showImg, { once: true });
  }
})();
