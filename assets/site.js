const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const toast = document.querySelector("[data-toast]");

const citations = {
  diverseverification2026: `@misc{agrawal2026diverseverification,
  title={Three Agents Are Not Three Verifiers: Measuring Common-Mode Failure in LLM Verification},
  author={Agrawal, Adarsh},
  year={2026},
  url={https://addarshh.github.io/papers/diverse-verification/diverse-verification.pdf}
}`,
  branchcredit2026: `@misc{agrawal2026branchcredit,
  title={When Process Credit Cannot Matter: Auditing Decision Authority in Verifier-Guided Repair},
  author={Agrawal, Adarsh},
  year={2026},
  url={https://addarshh.github.io/papers/branch-credit/branch-credit-camera-ready.pdf}
}`,
  paretoproof2026: `@misc{agrawal2026paretoproof,
  title={ParetoProof: When Does Pareto Selection Help Maintain Lean Proofs?},
  author={Agrawal, Adarsh},
  year={2026},
  url={https://addarshh.github.io/papers/pareto-proof/pareto-proof.pdf}
}`,
  proofdebt2026: `@misc{agrawal2026proofdebt,
  title={ProofDebt: When Does Memory Help Continual Software Repair?},
  author={Agrawal, Adarsh},
  year={2026},
  url={https://addarshh.github.io/papers/proofdebt/proofdebt-camera-ready.pdf}
}`,
  intentshield2026: `@misc{agrawal2026intentshield,
  title={When Correctness Feedback Erases Evidence: Phase-Separated Completeness Auditing in Verus},
  author={Agrawal, Adarsh},
  year={2026},
  url={https://addarshh.github.io/papers/intent-shield/intent-shield-camera-ready.pdf}
}`,
  incident2026: `@misc{agrawal2026incidentmemory,
  title={Incident Memory: Training-Free Operational Memory through Sequential Pattern Mining and Velocity-Stratified Retrieval},
  author={Agrawal, Adarsh and Babu, Rahul Suresh},
  year={2026},
  eprint={2609.01616},
  archivePrefix={arXiv},
  primaryClass={cs.IR},
  url={https://arxiv.org/abs/2609.01616}
}`,
  selfhealing2026: `@misc{babu2026selfhealing,
  title={Self-Healing Agentic Orchestrators for Reliable Tool-Augmented Large Language Model Systems},
  author={Babu, Rahul Suresh and Agrawal, Adarsh},
  year={2026},
  eprint={2606.01416},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2606.01416}
}`,
  schema2026: `@misc{agrawal2026schemafirst,
  title={Schema-First Retrieval: Embedding Catalogs for Natural Language Analytics},
  author={Agrawal, Adarsh and Indukuri, Shashank},
  year={2026},
  eprint={2606.28387},
  archivePrefix={arXiv},
  primaryClass={cs.IR},
  url={https://arxiv.org/abs/2606.28387}
}`,
  grounded2026: `@misc{indukuri2026grounded,
  title={Grounded Optimization: A Layered Engineering Framework for Reducing LLM Hallucination in Automated Personal Document Rewriting},
  author={Indukuri, Shashank and Agrawal, Adarsh},
  year={2026},
  eprint={2607.01457},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2607.01457}
}`,
  mlcommons2024: `@misc{vidgen2024mlcommons,
  title={Introducing v0.5 of the AI Safety Benchmark from MLCommons},
  author={Vidgen, Bertie and Agrawal, Adarsh and others},
  year={2024},
  eprint={2404.12241},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2404.12241}
}`
};

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  siteNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.setAttribute("title", open ? "Close navigation" : "Open navigation");
  menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
  document.body.classList.toggle("menu-open", open);
  window.lucide?.createIcons();
}

menuToggle?.addEventListener("click", () => {
  setMenu(!siteNav?.classList.contains("is-open"));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setMenu(false);
});

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
