/* ============================================================
   TRUSTYDRUCK — Electric Neon Studio · interactions
   Vanilla JS, no dependencies. Progressive enhancement.
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Header shrink on scroll ---- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const burger = $(".burger");
  const closeMenu = () => document.body.classList.remove("menu-open");
  if (burger) {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", document.body.classList.contains("menu-open"));
    });
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  }

  /* ---- Scroll reveal ---- */
  const revs = $$(".reveal");
  if (revs.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revs.forEach((r) => io.observe(r));
  } else {
    revs.forEach((r) => r.classList.add("in"));
  }

  /* ---- Animated counters ---- */
  const nums = $$("[data-count]");
  if (nums.length && "IntersectionObserver" in window && !reduce) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const dur = 1400;
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.firstChild.nodeValue = Math.round(target * eased).toString();
            if (p < 1) requestAnimationFrame(step);
            else el.firstChild.nodeValue = target.toString();
          };
          // keep suffix node intact
          if (!el.querySelector("small") && suffix) {
            el.textContent = "0";
            const s = document.createElement("small");
            s.textContent = suffix;
            el.appendChild(s);
          }
          requestAnimationFrame(step);
          io2.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io2.observe(n));
  }

  /* ---- Custom cursor (fine pointer only) ---- */
  const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (finePointer && !reduce) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot"; ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let rx = 0, ry = 0, x = 0, y = 0;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("a,button,.svc,.shot,input,textarea,.info-card");
      document.body.classList.toggle("cursor-hover", !!t);
    });
  }

  /* ---- Smooth-scroll same-page anchors + offset ---- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      closeMenu();
      const top = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---- Cookie note ---- */
  const cookie = $(".cookie");
  if (cookie) {
    let ok = false;
    try { ok = localStorage.getItem("td_cookie_ok") === "1"; } catch (e) {}
    if (!ok) setTimeout(() => cookie.classList.add("show"), 900);
    $$("[data-cookie]").forEach((b) =>
      b.addEventListener("click", () => {
        try { localStorage.setItem("td_cookie_ok", "1"); } catch (e) {}
        cookie.classList.remove("show");
      })
    );
  }

  /* ---- Contact form (no backend → mailto compose) ---- */
  const form = $("#contact-form");
  if (form) {
    const status = $(".form-status", form);
    const show = (msg, ok) => {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status show " + (ok ? "ok" : "err");
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const msg = (data.get("message") || "").toString().trim();
      const consent = form.querySelector('[name="consent"]');
      if (!name || !email || !msg) return show("Bitte Name, E-Mail und Nachricht ausfüllen.", false);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return show("Bitte eine gültige E-Mail-Adresse angeben.", false);
      if (consent && !consent.checked) return show("Bitte der Datenschutzerklärung zustimmen.", false);
      const subject = `Anfrage von ${name}` + (data.get("service") ? ` – ${data.get("service")}` : "");
      const body =
        `Name: ${name}\nE-Mail: ${email}\nTelefon: ${data.get("phone") || "-"}\n` +
        `Leistung: ${data.get("service") || "-"}\n\nNachricht:\n${msg}`;
      window.location.href =
        `mailto:info@trustydruck.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      show("Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage. Alternativ: info@trustydruck.de", true);
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
