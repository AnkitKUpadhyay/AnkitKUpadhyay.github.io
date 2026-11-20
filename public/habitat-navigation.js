// Install before first paint so a document-to-document transition can start at the tapped bubble.
(() => {
  if (["/about", "/about/", "/about/index.html"].includes(location.pathname)) {
    location.replace("/contact/" + location.search + location.hash);
    return;
  }
  const barePage = ["/news", "/publications", "/contact"].includes(location.pathname);
  if (barePage) {
    location.replace(location.pathname + "/" + location.search + location.hash);
    return;
  }
  const root = document.documentElement;
  const motionKey = "habitat-motion";
  const portalKey = "portfolio-entry-bubble";
  root.classList.add("with-js");
  function syncMotion() {
    let saved;
    try {
      saved = localStorage.getItem(motionKey);
    } catch {
      /* Private browsing. */
    }
    root.dataset.motion =
      saved === "paused" ||
      (saved !== "running" && matchMedia("(prefers-reduced-motion: reduce)").matches)
        ? "paused"
        : "running";
  }
  syncMotion();

  function legacyLink() {
    if (location.pathname !== "/" && location.pathname !== "/index.html") return;
    const aliases = {
      "#news": "/news/",
      "#background": "/news/",
      "#publications": "/publications/",
      "#research": "/publications/",
      "#about": "/contact/",
      "#contact": "/contact/",
    };
    const paper = location.hash.startsWith("#paper-");
    const target = paper ? "/publications/" : aliases[location.hash];
    if (target)
      location.replace(
        target + location.search + (paper || location.hash === "#contact" ? location.hash : ""),
      );
  }
  legacyLink();
  window.addEventListener("hashchange", legacyLink);

  document.addEventListener("click", (event) => {
    const bubble = event.target.closest?.("a[data-bubble]");
    if (
      !bubble ||
      event.defaultPrevented ||
      event.button ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const rect = bubble.getBoundingClientRect();
    const origin = {
      path: bubble.pathname,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      r: rect.width / 2,
      time: Date.now(),
    };
    try {
      sessionStorage.setItem(portalKey, JSON.stringify(origin));
    } catch {
      /* Use the standard dissolve. */
    }
  });

  window.addEventListener("pagereveal", (event) => {
    syncMotion();
    const transition = event.viewTransition;
    if (!transition) return;
    // A redirect, rapid second navigation or reduced motion can skip the animation.
    transition.ready.catch(() => {});
    if (root.dataset.motion === "paused") {
      transition.skipTransition();
      return;
    }
    try {
      const origin = JSON.parse(sessionStorage.getItem(portalKey));
      sessionStorage.removeItem(portalKey);
      if (!origin || origin.path !== location.pathname || Date.now() - origin.time > 10000) return;
      root.style.setProperty("--portal-origin", origin.x + "px " + origin.y + "px");
      root.style.setProperty("--portal-radius", origin.r + "px");
      root.classList.add("through-bubble");
      const clearOrigin = () => root.classList.remove("through-bubble");
      transition.finished.then(clearOrigin, clearOrigin);
    } catch {
      /* Storage is optional for navigation. */
    }
  });
})();
