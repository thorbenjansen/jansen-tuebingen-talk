const slides = Array.from(document.querySelectorAll(".slide"));
const progress = document.getElementById("progressBar");
const badge = document.getElementById("slideBadge");
const pathwayRail = document.querySelector(".pathway-rail");
const stageLinks = Array.from(document.querySelectorAll("[data-stage-link]"));
const stageGroups = Array.from(document.querySelectorAll("[data-stage-group]"));
const stageSubnavs = Array.from(document.querySelectorAll("[data-stage-subnav]"));
const helpButton = document.querySelector("[data-help]");
const literatureButton = document.querySelector("[data-literature]");
const helpPopover = document.getElementById("helpPopover");
const literaturePopover = document.getElementById("literaturePopover");
const helpSlideTitle = document.getElementById("helpSlideTitle");
const helpBody = document.getElementById("helpBody");
const literatureSlideTitle = document.getElementById("literatureSlideTitle");
const literatureList = document.getElementById("literatureList");
const structureIndex = slides.findIndex((slide) => slide.id === "structure");
const pathwayStages = new Set(stageLinks.map((link) => link.dataset.stageLink));
const stageLabels = {
  intro: "Einordnung und Leitfrage",
  diagnosis: "Diagnostik",
  intervention: "Intervention",
  process: "Prozessdaten",
  outlook: "Ausblick",
};
const pathwayMilestones = {
  diagnosis: [
    { id: "teacher-assessment", title: "Lehrkräfteurteile" },
    { id: "diagnostic-accuracy", title: "Förderung von Lehrkräften" },
    { id: "corpora", title: "Automatisiertes Assessment" },
  ],
  intervention: [
    { id: "feedback-intervention", title: "Drittmittelprojekt" },
    { id: "effectiveness-question", title: "Individuelle Feedbacknutzung" },
    { id: "effectiveness-engagement-results", title: "Wirkung und Moderatoren" },
  ],
  process: [
    { id: "writing-processes", title: "Freie KI-Nutzung" },
    { id: "pisa", title: "PISA-Assessment" },
    { id: "pisa-score-distributions", title: "PISA-Schreibstudie" },
  ],
  outlook: [
    { id: "theory-extensions", title: "Theorie-Erweiterungen" },
    { id: "leseband", title: "Drittmittelprojekt" },
    { id: "closing", title: "Schluss" },
  ],
};

function slideNumberLabel(index) {
  return document.documentElement.lang === "de" ? `Folie ${index + 1}` : `Slide ${index + 1}`;
}

function navTitle(slide) {
  const explicit = slide.dataset.navTitle;
  if (explicit) return explicit;
  const eyebrow = slide.querySelector(".eyebrow")?.textContent?.trim();
  if (eyebrow) return eyebrow.replace(/\s*\|\s*/g, " | ");
  return slide.querySelector("h1")?.textContent?.trim() || "Abschnitt";
}

function slideTitle(slide) {
  return slide?.querySelector("h1")?.textContent?.trim() || navTitle(slide) || "Aktuelle Folie";
}

function slideContextLabel(index, slide) {
  const stage = stageLabels[slide?.dataset.stage] || "Abschnitt";
  return `${slideNumberLabel(index)} · ${stage}`;
}

function popoverIsOpen() {
  return helpPopover?.classList.contains("is-open") || literaturePopover?.classList.contains("is-open");
}

function closePopovers() {
  [helpPopover, literaturePopover].forEach((popover) => {
    popover?.classList.remove("is-open");
    popover?.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("talk-popover-open");
}

function openPopover(popover) {
  closePopovers();
  popover?.classList.add("is-open");
  popover?.setAttribute("aria-hidden", "false");
  document.body.classList.add("talk-popover-open");
  popover?.querySelector(".talk-popover-card")?.focus();
}

function setHelpArticle(title, text) {
  const article = document.createElement("article");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");
  heading.textContent = title;
  paragraph.textContent = text;
  article.append(heading, paragraph);
  return article;
}

function visibleSlideReferences(slide) {
  const selectors = [
    ".reference-line span",
    ".ref",
    ".inline-ref",
    ".story-reference-rail span",
    ".story-reference-rail p",
    ".quality-reference span",
  ];
  const references = selectors
    .flatMap((selector) => Array.from(slide?.querySelectorAll(selector) || []))
    .map((node) => node.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((text) => !/^Folie\s+\d+/i.test(text));
  return Array.from(new Set(references));
}

function renderHelp() {
  const index = activeIndex();
  const slide = slides[index];
  helpSlideTitle.textContent = `${slideContextLabel(index, slide)} · ${slideTitle(slide)}`;
  const heading = navTitle(slide);
  const lead = slide?.querySelector(".lmu-lead, .lead, h2, .question-lead, .model-subtitle")?.textContent?.replace(/\s+/g, " ").trim();
  helpBody.replaceChildren(
    setHelpArticle("Funktion", `${heading}${lead ? `: ${lead}` : ""}`),
    setHelpArticle("Steuerung", "Pfeile oben oder Tastatur: ↑/↓, Page Up/Page Down und Leertaste navigieren durch die Folien. Vollbild öffnet oder verlässt den Präsentationsmodus."),
    setHelpArticle("Literatur", "Der Literatur-Button öffnet das vollständige Verzeichnis. Quellen zeigt die auf der aktuellen Folie sichtbaren Kurzverweise.")
  );
}

function renderLiterature() {
  const index = activeIndex();
  const slide = slides[index];
  const references = visibleSlideReferences(slide);
  literatureSlideTitle.textContent = `${slideContextLabel(index, slide)} · ${slideTitle(slide)}`;
  literatureList.replaceChildren();
  if (!references.length) {
    const item = document.createElement("li");
    item.textContent = "Auf dieser Folie sind keine sichtbaren Kurzverweise gesetzt.";
    literatureList.append(item);
    return;
  }
  references.forEach((reference) => {
    const item = document.createElement("li");
    item.textContent = reference;
    literatureList.append(item);
  });
}

function buildPathwaySubnav() {
  stageSubnavs.forEach((subnav) => {
    const stage = subnav.dataset.stageSubnav;
    const stageSlides = slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide, index }) => index > structureIndex && slide.dataset.stage === stage);
    const stageMilestones = (pathwayMilestones[stage] || [])
      .map((milestone) => {
        const index = slides.findIndex((slide) => slide.id === milestone.id);
        const slide = slides[index];
        if (index < 0 || slide?.dataset.stage !== stage) return null;
        return { ...milestone, index };
      })
      .filter(Boolean);
    subnav.replaceChildren(
      ...stageMilestones.map((milestone) => {
        const link = document.createElement("a");
        link.href = `#${milestone.id}`;
        link.dataset.milestoneStage = stage;
        link.dataset.milestoneId = milestone.id;
        link.dataset.slideLink = String(milestone.index);
        link.innerHTML = `<span class="pathway-subtitle">${milestone.title}</span>`;
        return link;
      })
    );
    const range = document.querySelector(`[data-stage-range="${stage}"]`);
    if (range && stageSlides.length) {
      const first = stageSlides[0].index + 1;
      const last = stageSlides[stageSlides.length - 1].index + 1;
      range.textContent = first === last ? slideNumberLabel(first - 1) : `${first}-${last}`;
    }
  });
}

function activeIndex() {
  const y = window.scrollY + window.innerHeight * 0.42;
  let index = 0;
  slides.forEach((slide, i) => {
    if (slide.offsetTop <= y) index = i;
  });
  return index;
}

function updateChrome() {
  const index = activeIndex();
  const slide = slides[index];
  const stage = slide?.dataset.stage;
  const hideRail = slide?.classList.contains("structure") ||
    slide?.classList.contains("learning-progression") ||
    slide?.classList.contains("lmu-transition-slide") ||
    slide?.classList.contains("interim") ||
    Boolean(slide?.querySelector(".mini-pathway"));
  const railAvailable = structureIndex >= 0 && index > structureIndex && pathwayStages.has(stage) && !hideRail;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  badge.textContent = slideNumberLabel(index);
  document.body.classList.toggle("hide-pathway-rail", hideRail);
  pathwayRail?.classList.toggle("is-available", Boolean(railAvailable));
  stageGroups.forEach((group) => group.classList.toggle("is-active", railAvailable && group.dataset.stageGroup === stage));
  stageLinks.forEach((link) => link.classList.toggle("is-active", railAvailable && link.dataset.stageLink === stage));
  const activeStageMilestones = Array.from(document.querySelectorAll(`[data-milestone-stage="${stage}"]`))
    .map((node) => Number(node.dataset.slideLink))
    .sort((a, b) => a - b);
  document.querySelectorAll("[data-slide-link]").forEach((link) => {
    if (!railAvailable || link.dataset.milestoneStage !== stage) {
      link.classList.remove("is-active");
      return;
    }
    const linkIndex = Number(link.dataset.slideLink);
    const nextIndex = activeStageMilestones.find((milestoneIndex) => milestoneIndex > linkIndex) ?? Infinity;
    link.classList.toggle("is-active", index >= linkIndex && index < nextIndex);
  });
}

function go(delta) {
  const index = Math.max(0, Math.min(slides.length - 1, activeIndex() + delta));
  slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("[data-prev]").addEventListener("click", () => go(-1));
document.querySelector("[data-next]").addEventListener("click", () => go(1));
document.querySelector("[data-fullscreen]").addEventListener("click", () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

helpButton?.addEventListener("click", () => {
  renderHelp();
  openPopover(helpPopover);
});

literatureButton?.addEventListener("click", () => {
  renderLiterature();
  openPopover(literaturePopover);
});

document.querySelectorAll("[data-popover-close]").forEach((button) => {
  button.addEventListener("click", closePopovers);
});

document.addEventListener("keydown", (event) => {
  if (popoverIsOpen()) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePopovers();
    }
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
    return;
  }
  if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    go(1);
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    go(-1);
  }
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.open);
    dialog?.showModal();
    if (dialog) dialog.scrollTop = 0;
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog")?.close());
});

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
buildPathwaySubnav();
updateChrome();
