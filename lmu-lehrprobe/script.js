const slides = Array.from(document.querySelectorAll(".slide"));
const progressBar = document.querySelector("#progressBar");
const slideBadge = document.querySelector("#slideBadge");
const stageLinks = Array.from(document.querySelectorAll("[data-stage-link]"));

function nearestSlideIndex() {
  const midpoint = window.scrollY + window.innerHeight / 2;
  let bestIndex = 0;
  let bestDistance = Infinity;

  slides.forEach((slide, index) => {
    const center = slide.offsetTop + slide.offsetHeight / 2;
    const distance = Math.abs(center - midpoint);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function updateChrome() {
  const index = nearestSlideIndex();
  const slide = slides[index];
  const progress = slides.length <= 1 ? 1 : index / (slides.length - 1);

  progressBar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
  slideBadge.textContent = `Folie ${index + 1}`;

  const stage = slide?.dataset.stage;
  stageLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.stageLink === stage);
  });
}

function go(delta) {
  const index = nearestSlideIndex();
  const next = Math.max(0, Math.min(slides.length - 1, index + delta));
  slides[next].scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
document.querySelector("[data-next]")?.addEventListener("click", () => go(1));
document.querySelector("[data-fullscreen]")?.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    go(1);
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    go(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    slides[0].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (event.key === "End") {
    event.preventDefault();
    slides.at(-1).scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

updateChrome();
