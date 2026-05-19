const slides = Array.from(document.querySelectorAll(".slide"));
const progress = document.getElementById("progressBar");
const badge = document.getElementById("slideBadge");
const pathwayRail = document.querySelector(".pathway-rail");
const stageLinks = Array.from(document.querySelectorAll("[data-stage-link]"));
const structureIndex = slides.findIndex((slide) => slide.id === "structure");
const pathwayStages = new Set(stageLinks.map((link) => link.dataset.stageLink));

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
  const hideRail = slide?.classList.contains("structure") || slide?.classList.contains("learning-progression") || Boolean(slide?.querySelector(".mini-pathway"));
  const railAvailable = structureIndex >= 0 && index > structureIndex && pathwayStages.has(stage) && !hideRail;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  badge.textContent = `Slide ${index + 1}`;
  document.body.classList.toggle("hide-pathway-rail", hideRail);
  pathwayRail?.classList.toggle("is-available", Boolean(railAvailable));
  stageLinks.forEach((link) => link.classList.toggle("is-active", railAvailable && link.dataset.stageLink === stage));
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

document.addEventListener("keydown", (event) => {
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
updateChrome();
