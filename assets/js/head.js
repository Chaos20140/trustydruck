/* Runs before body paints. Marks JS available (scroll-reveal styles apply)
   and — if the preloader already ran this session — hides it up front so it
   never flashes again on internal navigation. */
(function () {
  var el = document.documentElement;
  el.classList.add("js");
  try { if (sessionStorage.getItem("td_loaded") === "1") el.classList.add("preloaded"); } catch (e) {}
})();
