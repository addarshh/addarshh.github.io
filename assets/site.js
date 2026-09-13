const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const toast = document.querySelector("[data-toast]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const citations = {
  vidgen2024mlcommons: `@article{vidgen2024introducing,
  title={Introducing v0.5 of the AI Safety Benchmark from MLCommons},
  author={Vidgen, Bertie and Agrawal, Adarsh and others},
  journal={arXiv preprint arXiv:2404.12241},
  year={2024}
}`,
  babu2026selfhealing: `@article{babu2026selfhealing,
  title={Self-Healing Agentic Orchestrators for Reliable Tool-Augmented Large Language Model Systems},
  author={Babu, Raghavendra Sai and Agrawal, Adarsh},
  journal={arXiv preprint arXiv:2606.01416},
  year={2026}
}`,
  agrawal2026schema: `@article{agrawal2026schema,
  title={Schema-First Retrieval: Embedding Catalogs for Natural Language Analytics},
  author={Agrawal, Adarsh and Indukuri, Sai},
  journal={arXiv preprint arXiv:2606.28387},
  year={2026}
}`,
  indukuri2026grounded: `@article{indukuri2026grounded,
  title={Grounded Optimization: A Layered Engineering Framework for Reducing LLM Hallucination in Automated Personal Document Rewriting},
  author={Indukuri, Sai and Agrawal, Adarsh},
  journal={arXiv preprint arXiv:2607.01457},
  year={2026}
}`
};

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
    themeToggle.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}" aria-hidden="true"></i>`;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || systemTheme);

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  if (!mobileNav || !menuToggle) return;
  mobileNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.setAttribute("title", "Open navigation");
  menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  document.body.classList.remove("menu-open");
  window.lucide?.createIcons();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.setAttribute("title", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}" aria-hidden="true"></i>`;
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  window.lucide?.createIcons();
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

const observedSections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a[href^='#']")];

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0, 0.1, 0.3]
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

let toastTimer;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelectorAll("[data-copy-citation]").forEach((button) => {
  button.addEventListener("click", async () => {
    const key = button.dataset.copyCitation;
    const citation = citations[key];
    if (!citation) return;

    try {
      await navigator.clipboard.writeText(citation);
      button.classList.add("is-copied");
      button.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>Citation copied';
      showToast("BibTeX citation copied");
      window.lucide?.createIcons();
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.innerHTML = '<i data-lucide="copy" aria-hidden="true"></i>Cite';
        window.lucide?.createIcons();
      }, 1800);
    } catch {
      showToast("Copy failed. Open the paper to export its citation.");
    }
  });
});

function initResearchCanvas() {
  const canvas = document.querySelector("[data-research-canvas]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const map = canvas.parentElement;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let pointer = { x: -1000, y: -1000 };
  let startTime = performance.now();

  const colors = {
    light: {
      line: "rgba(17,17,17,0.18)",
      faint: "rgba(17,17,17,0.08)",
      blue: "#1747d1",
      red: "#e94b35",
      mint: "#57ba94",
      yellow: "#d6a500",
      node: "#111111",
      paper: "#ffffff"
    },
    dark: {
      line: "rgba(246,247,248,0.22)",
      faint: "rgba(246,247,248,0.08)",
      blue: "#6f98ff",
      red: "#ff7561",
      mint: "#7ce0ba",
      yellow: "#f5d66d",
      node: "#f6f7f8",
      paper: "#111214"
    }
  };

  function resize() {
    const rect = map.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function points() {
    return [
      { x: width * 0.22, y: height * 0.28, color: "blue", r: 9 },
      { x: width * 0.72, y: height * 0.34, color: "red", r: 10 },
      { x: width * 0.68, y: height * 0.72, color: "mint", r: 9 },
      { x: width * 0.23, y: height * 0.76, color: "yellow", r: 10 },
      { x: width * 0.48, y: height * 0.51, color: "node", r: 6 },
      { x: width * 0.41, y: height * 0.2, color: "node", r: 3 },
      { x: width * 0.82, y: height * 0.55, color: "node", r: 3 },
      { x: width * 0.43, y: height * 0.83, color: "node", r: 3 },
      { x: width * 0.12, y: height * 0.54, color: "node", r: 3 }
    ];
  }

  const connections = [
    [0, 4], [1, 4], [2, 4], [3, 4],
    [0, 5], [5, 1], [1, 6], [6, 2],
    [2, 7], [7, 3], [3, 8], [8, 0],
    [0, 2], [1, 3]
  ];

  function draw(time) {
    const palette = colors[root.dataset.theme === "dark" ? "dark" : "light"];
    const nodes = points();
    const elapsed = (time - startTime) / 1000;

    context.clearRect(0, 0, width, height);

    context.strokeStyle = palette.faint;
    context.lineWidth = 1;
    for (let x = width * 0.08; x < width; x += 34) {
      context.beginPath();
      context.moveTo(x, height * 0.08);
      context.lineTo(x, height * 0.92);
      context.stroke();
    }
    for (let y = height * 0.1; y < height; y += 34) {
      context.beginPath();
      context.moveTo(width * 0.04, y);
      context.lineTo(width * 0.96, y);
      context.stroke();
    }

    connections.forEach(([fromIndex, toIndex], index) => {
      const from = nodes[fromIndex];
      const to = nodes[toIndex];
      const distanceToLine = pointToSegmentDistance(pointer, from, to);
      const active = distanceToLine < 22;

      context.strokeStyle = active ? palette.blue : palette.line;
      context.lineWidth = active ? 2 : 1;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();

      if (!prefersReducedMotion.matches) {
        const progress = (elapsed * 0.12 + index * 0.087) % 1;
        const px = from.x + (to.x - from.x) * progress;
        const py = from.y + (to.y - from.y) * progress;
        context.fillStyle = palette[nodes[fromIndex].color] || palette.node;
        context.beginPath();
        context.arc(px, py, active ? 3.5 : 2.2, 0, Math.PI * 2);
        context.fill();
      }
    });

    nodes.forEach((node, index) => {
      const distance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
      const active = distance < 42;
      const color = palette[node.color] || palette.node;

      if (index < 4) {
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(node.x, node.y, node.r + 8 + (active ? 5 : 0), 0, Math.PI * 2);
        context.stroke();
      }

      context.fillStyle = color;
      context.beginPath();
      context.arc(node.x, node.y, node.r + (active ? 3 : 0), 0, Math.PI * 2);
      context.fill();

      context.fillStyle = palette.paper;
      context.beginPath();
      context.arc(node.x, node.y, Math.max(1.5, node.r * 0.28), 0, Math.PI * 2);
      context.fill();
    });

    if (!prefersReducedMotion.matches) {
      frame = requestAnimationFrame(draw);
    }
  }

  function pointToSegmentDistance(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
    const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
  }

  map.addEventListener("pointermove", (event) => {
    const rect = map.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (prefersReducedMotion.matches) draw(performance.now());
  });

  map.addEventListener("pointerleave", () => {
    pointer = { x: -1000, y: -1000 };
    if (prefersReducedMotion.matches) draw(performance.now());
  });

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion.matches) draw(performance.now());
  });

  const themeObserver = new MutationObserver(() => {
    if (prefersReducedMotion.matches) draw(performance.now());
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  resize();
  cancelAnimationFrame(frame);
  draw(performance.now());
}

initResearchCanvas();
window.lucide?.createIcons();
