const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const toast = document.querySelector("[data-toast]");

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

const sections = [...document.querySelectorAll("[data-section]")];
const railLinks = [...document.querySelectorAll(".rail-nav a")];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    railLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0, 0.1, 0.25]
  });

  sections.forEach((section) => observer.observe(section));
}

let toastTimer;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

document.querySelectorAll("[data-copy-citation]").forEach((button) => {
  button.addEventListener("click", async () => {
    const citation = citations[button.dataset.copyCitation];
    if (!citation) return;

    try {
      await navigator.clipboard.writeText(citation);
      showToast("BibTeX citation copied");
    } catch {
      showToast("Copy failed. Open the paper to export its citation.");
    }
  });
});

window.lucide?.createIcons();
