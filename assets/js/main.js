/* ============================================================
   TRUSTYDRUCK — "INK IN THE DARK" · motion orchestration
   Preloader · Lenis smooth scroll · GSAP ScrollTrigger ·
   custom cursor · magnetic buttons · reveals · parallax.
   Everything degrades gracefully (no GSAP/Lenis/JS → usable).
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

  // Hide reveals only when we can actually animate them (else they stay visible).
  if (hasST && !reduce) document.documentElement.classList.add("gsap");

  /* ---------------- always-on chrome (independent of motion) ---------------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", scrollY > 20);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  const burger = $(".burger");
  const closeMenu = () => { document.body.classList.remove("menu-open"); if (window.__lenis && !menuLocked()) window.__lenis.start(); };
  const menuLocked = () => document.body.classList.contains("menu-open");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open);
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
    addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  }

  // kinetic draggable titles
  if (!reduce) $$(".kinetic").forEach((el) => {
    let dragging = false, sx = 0, sy = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, px = 0, py = 0;
    const spring = () => {
      vx += (0 - x) * 0.12; vy += (0 - y) * 0.12; vx *= 0.82; vy *= 0.82; x += vx; y += vy;
      el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(x * 0.02).toFixed(3)}deg)`;
      if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > 0.4) raf = requestAnimationFrame(spring);
      else el.style.transform = "";
    };
    el.addEventListener("pointerdown", (e) => { dragging = true; sx = e.clientX - x; sy = e.clientY - y; px = e.clientX; py = e.clientY; cancelAnimationFrame(raf); });
    addEventListener("pointermove", (e) => { if (!dragging) return; vx = e.clientX - px; vy = e.clientY - py; px = e.clientX; py = e.clientY; x = Math.max(-120, Math.min(120, e.clientX - sx)); y = Math.max(-80, Math.min(80, e.clientY - sy)); el.style.transform = `translate(${x}px,${y}px) rotate(${(x * 0.02).toFixed(3)}deg)`; }, { passive: true });
    addEventListener("pointerup", () => { if (dragging) { dragging = false; raf = requestAnimationFrame(spring); } });
    addEventListener("pointercancel", () => { dragging = false; });
  });

  $$("[data-reink]").forEach((b) => b.addEventListener("click", () => window.TDInk && window.TDInk.burst()));

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

  // Set intro "from" states early so nothing flashes before the preloader lifts.
  const heroLines = $$(".hero h1 .line > span");
  const heroFades = $$("[data-hero-fade]");
  if (animate) {
    if (heroLines.length) window.gsap.set(heroLines, { yPercent: 115 });
    if (heroFades.length) window.gsap.set(heroFades, { opacity: 0, y: 26 });
  }

  /* ---------------- preloader ---------------- */
  function runPreloader(done) {
    let called = false;
    const finish = () => { if (called) return; called = true; done(); };
    const pl = $("#preloader");
    const mark = () => { try { sessionStorage.setItem("td_loaded", "1"); } catch (e) {} };
    // Only show the loader on the FIRST entry of a session; skip on internal navigation/reloads.
    const already = document.documentElement.classList.contains("preloaded") ||
      (() => { try { return sessionStorage.getItem("td_loaded") === "1"; } catch (e) { return false; } })();
    if (!pl || already) { if (pl) pl.style.display = "none"; document.body.style.overflow = ""; return finish(); }
    const bar = $(".pl-bar span", pl), count = $(".pl-count b", pl), logo = $(".pl-logo", pl);
    document.body.style.overflow = "hidden";
    const reveal = () => { mark(); pl.classList.add("done"); pl.style.display = "none"; document.body.style.overflow = ""; finish(); };

    if (reduce || !hasGSAP) {
      if (logo) logo.style.opacity = 1;
      pl.style.transition = "opacity .5s ease"; pl.style.opacity = "0";
      setTimeout(reveal, 500);
      return;
    }
    const g = window.gsap, obj = { v: 0 };
    const tl = g.timeline({ onComplete: () => { mark(); pl.style.display = "none"; document.body.style.overflow = ""; finish(); } });
    tl.to(logo, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to(obj, { v: 100, duration: 1.5, ease: "power1.inOut", onUpdate: () => { const v = Math.round(obj.v); if (count) count.textContent = v; if (bar) bar.style.width = v + "%"; } }, "-=0.2")
      .to(pl, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "+=0.15");
    // hard safety: never let the preloader trap the page
    setTimeout(() => { if (!called) { try { tl.kill(); } catch (e) {} reveal(); } }, 6000);
  }

  /* ---------------- motion (after preloader) ---------------- */
  function startMotion() {
    // Lenis smooth scroll
    if (hasLenis && !reduce && !coarse) {
      const lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, touchMultiplier: 1.6 });
      window.__lenis = lenis;
      if (hasST) {
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add((t) => lenis.raf(t * 1000));
        window.gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
      }
    }

    // anchor links via Lenis (or native)
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const t = document.getElementById(id.slice(1)); if (!t) return;
      e.preventDefault(); closeMenu();
      if (window.__lenis) window.__lenis.scrollTo(t, { offset: -80, duration: 1.1 });
      else scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    }));

    // hero intro (home only)
    if (animate && heroLines.length) {
      const tl = window.gsap.timeline({ delay: 0.05 });
      tl.to(heroLines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 });
      if (heroFades.length) tl.to(heroFades, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, "-=0.7");
    } else if (animate && heroFades.length) {
      window.gsap.to(heroFades, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 });
    }

    // scroll reveals
    if (hasST && !reduce) {
      $$(".reveal").forEach((el) => {
        const d = (parseFloat(el.dataset.d || 0) || 0) * 0.08;
        window.gsap.fromTo(el, { y: 42, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: d,
            scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      // parallax
      $$("[data-parallax] img").forEach((img) => {
        window.gsap.fromTo(img, { yPercent: -8, scale: 1.16 }, { yPercent: 8, scale: 1.16, ease: "none",
          scrollTrigger: { trigger: img.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true } });
      });
      // counters
      $$("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || "";
        const o = { v: 0 };
        window.gsap.to(o, { v: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
      });

      // A) kinetic word-reveal on section headings
      $$("h2.display.ink-title, [data-split]").forEach((el) => {
        if (el.closest(".hero") || el.classList.contains("reveal") || el.hasAttribute("data-marquee-line") || el.dataset.splitDone) return;
        el.dataset.splitDone = "1";
        const inners = splitHeading(el);
        if (!inners.length) return;
        window.gsap.set(inners, { yPercent: 118 });
        window.gsap.to(inners, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });

      // B) image clip-mask reveals (wipe up)
      $$(".proof .inner").forEach((inner) => {
        window.gsap.fromTo(inner, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: inner, start: "top 90%", once: true } });
      });

      // C) marquee bands react to scroll velocity
      const marquees = $$(".marquee");
      if (marquees.length) {
        let skew = 0;
        window.ScrollTrigger.create({ onUpdate: (self) => {
          const v = window.gsap.utils.clamp(-7, 7, self.getVelocity() / 320);
          if (Math.abs(v) > Math.abs(skew)) skew = v;
        }});
        window.gsap.ticker.add(() => { skew *= 0.9; marquees.forEach((m) => { m.style.transform = `skewX(${skew.toFixed(2)}deg)`; }); });
      }

      // D) statement line horizontal drift
      $$("[data-marquee-line]").forEach((el) => {
        window.gsap.fromTo(el, { xPercent: 7 }, { xPercent: -7, ease: "none",
          scrollTrigger: { trigger: el.closest(".statement") || el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // E) CMYK colour-resolve (raw ink separation -> full colour)
      $$("[data-cmyk]").forEach((el) => {
        window.gsap.fromTo(el, { "--cmyk": 1 }, { "--cmyk": 0, ease: "none",
          scrollTrigger: { trigger: el, start: "top 82%", end: "top 42%", scrub: true } });
      });

      // F) process line draws across as you scroll
      $$(".steps").forEach((steps) => {
        const line = document.createElement("div"); line.className = "proc-line"; steps.appendChild(line);
        window.gsap.fromTo(line, { width: "0%" }, { width: "100%", ease: "none",
          scrollTrigger: { trigger: steps, start: "top 82%", end: "bottom 62%", scrub: true } });
      });

      // refresh once images/layout settle
      addEventListener("load", () => window.ScrollTrigger.refresh());
      setTimeout(() => window.ScrollTrigger.refresh(), 1200);
    } else {
      $$(".reveal").forEach((e) => (e.style.opacity = 1));
    }
  }

  /* ---------------- custom cursor ---------------- */
  function initCursor() {
    if (coarse || reduce || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const dot = document.createElement("div"); dot.className = "cursor";
    const ring = document.createElement("div"); ring.className = "cursor-r";
    const cl = document.createElement("span"); cl.className = "cl"; cl.textContent = "Ansehen"; ring.appendChild(cl);
    document.body.append(dot, ring);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; }, { passive: true });
    const loop = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    addEventListener("mouseover", (e) => {
      const view = e.target.closest("[data-cursor='view'], .proof");
      const hov = e.target.closest("a,button,.magnetic,input,textarea,select,.kinetic");
      document.body.classList.toggle("cursor-view", !!view);
      document.body.classList.toggle("cursor-hover", !!hov && !view);
    });
    document.addEventListener("mouseleave", () => { document.body.classList.remove("cursor-hover", "cursor-view"); });
  }

  /* ---------------- magnetic buttons ---------------- */
  function initMagnetic() {
    if (coarse || reduce || !hasGSAP) return;
    $$(".magnetic").forEach((el) => {
      const strength = parseFloat(el.dataset.mag || 0.4);
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        window.gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => window.gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
    });
  }

  /* ---------------- helpers: split heading into word-masks ---------------- */
  function splitHeading(el) {
    const frag = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (tok === "") return;
          if (/^\s+$/.test(tok)) { frag.push(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "split-w";
          const inner = document.createElement("span"); inner.textContent = tok;
          w.appendChild(inner); frag.push(w);
        });
      } else if (node.nodeType === 1) {
        const w = document.createElement("span"); w.className = "split-w";
        const inner = document.createElement("span"); inner.appendChild(node.cloneNode(true));
        w.appendChild(inner); frag.push(w);
      }
    });
    el.textContent = "";
    frag.forEach((n) => el.appendChild(n));
    return Array.from(el.querySelectorAll(".split-w > span"));
  }

  /* ---------------- 3D tilt on cards ---------------- */
  function initTilt() {
    if (coarse || reduce || !hasGSAP) return;
    $$(".proof, .sep-cell").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        window.gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: "power2.out", transformPerspective: 900, transformOrigin: "center" });
      });
      card.addEventListener("mouseleave", () => window.gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" }));
    });
  }

  /* ---------------- go ---------------- */
  initCursor();
  initMagnetic();
  initTilt();
  runPreloader(startMotion);
})();
