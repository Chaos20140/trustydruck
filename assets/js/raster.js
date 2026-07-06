/* ============================================================
   TRUSTYDRUCK — "RASTER" develop engine (Canvas2D)
   The image rests as a coarse black halftone on warm paper and
   "develops" into the real photo on hover (desktop) / on scroll
   into view (touch). No moving loupe. Degrades to the colour <img>.
   ============================================================ */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMem = (navigator.deviceMemory || 8) <= 2;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const PAPER = "#f0eadc";
  const INK = "#16130e";

  const stages = Array.from(document.querySelectorAll("[data-loupe]"));
  if (!stages.length) return;
  if (!document.createElement("canvas").getContext) { stages.forEach((s) => s.classList.add("raster-fallback")); return; }

  stages.forEach((stage) => {
    const img = stage.querySelector("img");
    const canvas = stage.querySelector("canvas");
    if (!img || !canvas) return;
    // reduced-motion / low memory → clean colour photo, no halftone
    if (reduce || lowMem) { stage.classList.add("raster-fallback"); return; }
    const ctx = canvas.getContext("2d", { alpha: false });
    const DPR = Math.min(devicePixelRatio || 1, 1.5);
    const P = lowMem ? 12 : 10; // screen pitch (css px)

    function build() {
      const r = stage.getBoundingClientRect();
      const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
      if (!W || !H) return false;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";

      // sample source luminance (object-fit: cover)
      const lw = Math.max(2, Math.round(W / 3)), lh = Math.max(2, Math.round(H / 3));
      const sc = document.createElement("canvas"); sc.width = lw; sc.height = lh;
      const sctx = sc.getContext("2d");
      const ir = img.naturalWidth / img.naturalHeight, fr = lw / lh;
      let sw, sh, sx, sy;
      if (ir > fr) { sh = img.naturalHeight; sw = sh * fr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
      else { sw = img.naturalWidth; sh = sw / fr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
      let data;
      try { sctx.drawImage(img, sx, sy, sw, sh, 0, 0, lw, lh); data = sctx.getImageData(0, 0, lw, lh).data; }
      catch (e) { return false; } // tainted / decode issue → colour <img>

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = INK;
      const maxR = P * 0.62;
      for (let y = P / 2; y < H; y += P) {
        for (let x = P / 2; x < W; x += P) {
          let ix = (x / W * lw) | 0, iy = (y / H * lh) | 0;
          if (ix >= lw) ix = lw - 1; if (iy >= lh) iy = lh - 1;
          const l = data[(iy * lw + ix) * 4], g = data[(iy * lw + ix) * 4 + 1], b = data[(iy * lw + ix) * 4 + 2];
          const lum = Math.pow((0.299 * l + 0.587 * g + 0.114 * b) / 255, 0.82);
          const rad = (1 - lum) * maxR;
          if (rad > 0.35) { ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill(); }
        }
      }
      return true;
    }

    const start = () => {
      if (build()) stage.classList.add("raster-on");
      else stage.classList.add("raster-fallback");
    };
    if (img.complete && img.naturalWidth) start();
    else { img.addEventListener("load", start, { once: true }); img.addEventListener("error", () => stage.classList.add("raster-fallback"), { once: true }); }

    // touch: develop when it scrolls into view
    if (coarse && "IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) stage.classList.add("developed"); }), { threshold: 0.35 }).observe(stage);
    }

    // rebuild on resize (keeps the halftone crisp)
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (stage.classList.contains("raster-on")) build(); }, 200); }, { passive: true });
  });
})();
