/* ============================================================
   TRUSTYDRUCK — NASSDRUCK · interactions (vanilla, no deps)
   ============================================================ */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* header shrink */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", scrollY > 20);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  const burger = $(".burger");
  const closeMenu = () => document.body.classList.remove("menu-open");
  if (burger) {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", document.body.classList.contains("menu-open"));
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
    addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  }

  /* scroll reveal */
  const revs = $$(".reveal");
  if (revs.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revs.forEach((r) => io.observe(r));
  } else revs.forEach((r) => r.classList.add("in"));

  /* smooth anchors */
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const t = document.getElementById(id.slice(1)); if (!t) return;
    e.preventDefault(); closeMenu();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", id);
  }));

  /* kinetic draggable titles — grab, throw, spring back */
  if (!reduce) $$(".kinetic").forEach((el) => {
    let dragging = false, sx = 0, sy = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, px = 0, py = 0;
    const spring = () => {
      vx += (0 - x) * 0.12; vy += (0 - y) * 0.12; vx *= 0.82; vy *= 0.82;
      x += vx; y += vy;
      el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(x * 0.02).toFixed(3)}deg)`;
      if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > 0.4) raf = requestAnimationFrame(spring);
      else { el.style.transform = ""; }
    };
    const down = (cx, cy) => { dragging = true; sx = cx - x; sy = cy - y; px = cx; py = cy; cancelAnimationFrame(raf); el.setPointerCapture && 0; };
    const move = (cx, cy) => {
      if (!dragging) return;
      vx = cx - px; vy = cy - py; px = cx; py = cy;
      x = cx - sx; y = cy - sy;
      x = Math.max(-120, Math.min(120, x)); y = Math.max(-80, Math.min(80, y));
      el.style.transform = `translate(${x}px,${y}px) rotate(${(x * 0.02).toFixed(3)}deg)`;
    };
    const up = () => { if (!dragging) return; dragging = false; raf = requestAnimationFrame(spring); };
    el.addEventListener("pointerdown", (e) => { down(e.clientX, e.clientY); });
    addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  });

  /* re-ink button -> triggers a fresh ink burst on the fluid canvas */
  $$("[data-reink]").forEach((b) => b.addEventListener("click", () => window.TDInk && window.TDInk.burst()));

  /* cookie */
  const cookie = $(".cookie");
  if (cookie) {
    let ok = false; try { ok = localStorage.getItem("td_cookie_ok") === "1"; } catch (e) {}
    if (!ok) setTimeout(() => cookie.classList.add("show"), 900);
    $$("[data-cookie]").forEach((b) => b.addEventListener("click", () => {
      try { localStorage.setItem("td_cookie_ok", "1"); } catch (e) {}
      cookie.classList.remove("show");
    }));
  }

  /* contact form -> mailto compose (no backend) */
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

  /* year */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
