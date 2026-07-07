/* ============================================================
   TRUSTYDRUCK — "RASTER" · motion orchestration
   Preloader (print into register) · Lenis · GSAP ScrollTrigger ·
   split-heading reveals · registration-wipe images · magnetic ·
   marquee-skew. Everything degrades gracefully.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";
  const animate = hasGSAP && !reduce;
  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);
  if (hasST && !reduce) document.documentElement.classList.add("gsap");

  /* ---- chrome (always) ---- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", scrollY > 20);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  /* ---- scroll-progress "registration" bar (always on) ---- */
  const prog = document.createElement("div"); prog.className = "scroll-prog"; document.body.appendChild(prog);
  const setProg = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0) + ")"; };
  setProg(); addEventListener("scroll", setProg, { passive: true }); addEventListener("resize", setProg, { passive: true });

  const burger = $(".burger");
  const closeMenu = () => { document.body.classList.remove("menu-open"); if (window.__lenis) window.__lenis.start(); };
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open);
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
    addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  }

  if (!reduce) $$(".kinetic").forEach((el) => {
    let dragging = false, sx = 0, sy = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, px = 0, py = 0;
    const spring = () => {
      vx += (0 - x) * 0.12; vy += (0 - y) * 0.12; vx *= 0.82; vy *= 0.82; x += vx; y += vy;
      el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(x * 0.02).toFixed(3)}deg)`;
      if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > 0.4) raf = requestAnimationFrame(spring); else el.style.transform = "";
    };
    el.addEventListener("pointerdown", (e) => { dragging = true; sx = e.clientX - x; sy = e.clientY - y; px = e.clientX; py = e.clientY; cancelAnimationFrame(raf); });
    addEventListener("pointermove", (e) => { if (!dragging) return; vx = e.clientX - px; vy = e.clientY - py; px = e.clientX; py = e.clientY; x = Math.max(-120, Math.min(120, e.clientX - sx)); y = Math.max(-80, Math.min(80, e.clientY - sy)); el.style.transform = `translate(${x}px,${y}px) rotate(${(x * 0.02).toFixed(3)}deg)`; }, { passive: true });
    addEventListener("pointerup", () => { if (dragging) { dragging = false; raf = requestAnimationFrame(spring); } });
    addEventListener("pointercancel", () => { dragging = false; });
  });

  const cookie = $(".cookie");
  if (cookie) {
    let ok = false; try { ok = localStorage.getItem("td_cookie_ok") === "1"; } catch (e) {}
    if (!ok) setTimeout(() => cookie.classList.add("show"), 1400);
    $$("[data-cookie]").forEach((b) => b.addEventListener("click", () => { try { localStorage.setItem("td_cookie_ok", "1"); } catch (e) {} cookie.classList.remove("show"); }));
  }

  const form = $("#contact-form");
  if (form) {
    const status = $(".form-status", form);
    const show = (m, ok) => { if (status) { status.textContent = m; status.className = "form-status show " + (ok ? "ok" : "err"); } };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const name = (d.get("name") || "").toString().trim();
      const email = (d.get("email") || "").toString().trim();
      const msg = (d.get("message") || "").toString().trim();
      const consent = form.querySelector('[name="consent"]');
      if (!name || !email || !msg) return show("Bitte Name, E-Mail und Nachricht ausfüllen.", false);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return show("Bitte eine gültige E-Mail-Adresse angeben.", false);
      if (consent && !consent.checked) return show("Bitte der Datenschutzerklärung zustimmen.", false);
      const subject = `Anfrage von ${name}` + (d.get("service") ? ` – ${d.get("service")}` : "");
      const body = `Name: ${name}\nE-Mail: ${email}\nTelefon: ${d.get("phone") || "-"}\nLeistung: ${d.get("service") || "-"}\n\nNachricht:\n${msg}`;
      location.href = `mailto:info@trustydruck.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      show("Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage. Alternativ: info@trustydruck.de", true);
      form.reset();
    });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---- intro from-states (hidden behind preloader) ---- */
  const heroLines = $$(".hero h1 .line > span");
  const heroFades = $$("[data-hero-fade]");
  if (animate) {
    if (heroLines.length) window.gsap.set(heroLines, { yPercent: 115 });
    if (heroFades.length) window.gsap.set(heroFades, { opacity: 0, y: 26 });
  }

  /* ---- preloader: print into register ---- */
  function runPreloader(done) {
    let called = false; const finish = () => { if (called) return; called = true; done(); };
    const pl = $("#preloader");
    const mark = () => { try { sessionStorage.setItem("td_loaded", "1"); } catch (e) {} };
    const already = document.documentElement.classList.contains("preloaded") || (() => { try { return sessionStorage.getItem("td_loaded") === "1"; } catch (e) { return false; } })();
    if (!pl || already) { if (pl) pl.style.display = "none"; document.body.style.overflow = ""; return finish(); }
    document.body.style.overflow = "hidden";
    const reveal = () => { mark(); pl.style.display = "none"; document.body.style.overflow = ""; finish(); };
    const g1 = $(".g1", pl), g2 = $(".g2", pl), real = $(".pl-real", pl);
    if (reduce || !hasGSAP) { pl.style.transition = "opacity .5s"; pl.style.opacity = "0"; setTimeout(reveal, 500); return; }
    const g = window.gsap;
    g.set(real, { opacity: 0 });
    g.set(g1, { x: -8, y: -5, opacity: 0.6 });
    g.set(g2, { x: 8, y: 5, opacity: 0.5 });
    const tl = g.timeline({ onComplete: reveal });
    tl.to([g1, g2], { x: 0, y: 0, opacity: 0, duration: 0.8, ease: "power3.inOut", delay: 0.35 })
      .to(real, { opacity: 1, duration: 0.25, ease: "power2.out" }, "-=0.25")
      .to(pl, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.4");
    setTimeout(() => { if (!called) { try { tl.kill(); } catch (e) {} reveal(); } }, 6000);
  }

  /* ---- helpers ---- */
  function splitHeading(el) {
    const frag = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (tok === "") return;
          if (/^\s+$/.test(tok)) { frag.push(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "split-w";
          const inner = document.createElement("span"); inner.textContent = tok; w.appendChild(inner); frag.push(w);
        });
      } else if (node.nodeType === 1) {
        const w = document.createElement("span"); w.className = "split-w";
        const inner = document.createElement("span"); inner.appendChild(node.cloneNode(true)); w.appendChild(inner); frag.push(w);
      }
    });
    el.textContent = ""; frag.forEach((n) => el.appendChild(n));
    return Array.from(el.querySelectorAll(".split-w > span"));
  }

  /* ---- motion (after preloader) ---- */
  function startMotion() {
    if (hasLenis && !reduce && !coarse) {
      const lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, touchMultiplier: 1.6 });
      window.__lenis = lenis;
      if (hasST) { lenis.on("scroll", window.ScrollTrigger.update); window.gsap.ticker.add((t) => lenis.raf(t * 1000)); window.gsap.ticker.lagSmoothing(0); }
      else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    }

    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const t = document.getElementById(id.slice(1)); if (!t) return;
      e.preventDefault(); closeMenu();
      if (window.__lenis) window.__lenis.scrollTo(t, { offset: -80, duration: 1.1 });
      else scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    }));

    if (animate && heroLines.length) {
      const tl = window.gsap.timeline({ delay: 0.05 });
      tl.to(heroLines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 });
      if (heroFades.length) tl.to(heroFades, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, "-=0.7");
    } else if (animate && heroFades.length) {
      window.gsap.to(heroFades, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 });
    }

    if (hasST && !reduce) {
      $$(".reveal").forEach((el) => {
        const d = (parseFloat(el.dataset.d || 0) || 0) * 0.08;
        window.gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: d, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      // kinetic word-reveal on section headings
      $$("h2.display.split, [data-split]").forEach((el) => {
        if (el.closest(".hero") || el.dataset.splitDone) return; el.dataset.splitDone = "1";
        const inners = splitHeading(el); if (!inners.length) return;
        window.gsap.set(inners, { yPercent: 118 });
        window.gsap.to(inners, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.04, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      // registration-wipe image reveals
      $$(".proof").forEach((p) => {
        window.gsap.fromTo(p, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power3.inOut", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
      });
      // parallax
      $$("[data-parallax] img").forEach((img) => {
        window.gsap.fromTo(img, { yPercent: -8, scale: 1.16 }, { yPercent: 8, scale: 1.16, ease: "none", scrollTrigger: { trigger: img.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true } });
      });
      // counters
      $$("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count) || 0, suffix = el.dataset.suffix || "", o = { v: 0 };
        window.gsap.to(o, { v: target, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
      });
      // marquee scroll-skew
      const marquees = $$(".marquee");
      if (marquees.length) {
        let skew = 0;
        window.ScrollTrigger.create({ onUpdate: (self) => { const v = window.gsap.utils.clamp(-6, 6, self.getVelocity() / 320); if (Math.abs(v) > Math.abs(skew)) skew = v; } });
        window.gsap.ticker.add(() => { skew *= 0.9; marquees.forEach((m) => { m.style.transform = `skewX(${skew.toFixed(2)}deg)`; }); });
      }
      // continuous scroll-life (scrub) so sections don't sit dead-still
      $$(".statement .st-block").forEach((el) => {
        window.gsap.fromTo(el, { yPercent: 11 }, { yPercent: -11, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      $$(".fl-wm").forEach((el) => {
        const f = el.closest(".site-footer"); if (!f) return;
        window.gsap.fromTo(el, { xPercent: -3 }, { xPercent: 3, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      $$(".rv-card").forEach((el, i) => {
        const sec = el.closest(".reviews"); if (!sec) return;
        const amp = (i % 2 === 0) ? 3 : -2.4;
        window.gsap.fromTo(el, { yPercent: -amp }, { yPercent: amp, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      });
      addEventListener("load", () => window.ScrollTrigger.refresh());
      setTimeout(() => window.ScrollTrigger.refresh(), 1200);
    } else {
      $$(".reveal").forEach((e) => (e.style.opacity = 1));
    }
  }

  /* ---- magnetic buttons ---- */
  function initMagnetic() {
    if (coarse || reduce || !hasGSAP) return;
    $$(".magnetic").forEach((el) => {
      const s = parseFloat(el.dataset.mag || 0.4);
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); window.gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * s, y: (e.clientY - (r.top + r.height / 2)) * s, duration: 0.5, ease: "power3.out" }); });
      el.addEventListener("mouseleave", () => window.gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
    });
  }

  /* ---- custom cursor: precise red dot + trailing ring (desktop) ---- */
  function initCursor() {
    if (coarse || reduce) return;
    const dot = document.createElement("div"); dot.className = "cursor-dot";
    const ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    const root = document.documentElement; root.classList.add("cursor-on");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
    const loop = () => { rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2; ring.style.transform = `translate(${rx.toFixed(2)}px,${ry.toFixed(2)}px)`; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    const HOV = "a,button,.magnetic,input,textarea,select,label,.rv-card,.why-card,.chip,[data-loupe3d],[data-logo3d]";
    addEventListener("mouseover", (e) => { if (e.target.closest && e.target.closest(HOV)) root.classList.add("cursor-hover"); }, { passive: true });
    addEventListener("mouseout", (e) => { if (e.target.closest && e.target.closest(HOV)) root.classList.remove("cursor-hover"); }, { passive: true });
    addEventListener("mousedown", () => root.classList.add("cursor-down"), { passive: true });
    addEventListener("mouseup", () => root.classList.remove("cursor-down"), { passive: true });
    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = ""; ring.style.opacity = ""; });
  }

  initMagnetic();
  initCursor();
  runPreloader(startMotion);
})();
