const learnerCards = Array.from(document.querySelectorAll("[data-learner-card]"));
const modeButtons = Array.from(document.querySelectorAll("[data-focus-mode]"));
const insight = document.querySelector("#focusInsight");
const classPlot = document.querySelector("#classPlot");
const timelinePlot = document.querySelector("#timelinePlot");
const classSpread = document.querySelector("#classSpread");
const classInterpretation = document.querySelector("#classInterpretation");
const timelineButtons = Array.from(document.querySelectorAll("[data-active-learner]"));
const timelineInterpretation = document.querySelector("#timelineInterpretation");
const simInputs = Array.from(document.querySelectorAll("[data-sim]"));
const selectedChips = new Set();

const insights = {
  inter: {
    title: "Interindividuelle Perspektive",
    text: "Die gleiche Note sagt zuerst: Beide liegen im selben Leistungsbereich. Sie sagt noch nicht, ob beide denselben Lernprozess oder Förderbedarf haben.",
  },
  intra: {
    title: "Intraindividuelle Perspektive",
    text: "Mira und Lina unterscheiden sich im Verlauf: Stabilität, Schwankung und Entwicklungsrichtung verändern die Bedeutung derselben Note.",
  },
  process: {
    title: "Prozessperspektive",
    text: "Für Förderung zählt, wie Leistung entsteht: Motivation, Aufgabenbedingungen, Strategieeinsatz und Feedbacknutzung erklären den nächsten Schritt.",
  },
};

const baseScores = [41, 44, 46, 47, 49, 51, 52, 53, 55, 56, 57, 58, 58, 59, 60, 61, 62, 63, 65, 66, 67, 69, 71, 73, 76, 79, 83, 87];
const mira = [48, 51, 53, 55, 57, 59];
const lina = [66, 43, 71, 49, 64, 58];

function setMode(mode) {
  modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.focusMode === mode));
  insight.innerHTML = `<b>${insights[mode].title}</b><span>${insights[mode].text}</span>`;
}

function selectLearner(id) {
  learnerCards.forEach((card) => card.classList.toggle("is-selected", card.dataset.learnerCard === id));
}

function svg(tag, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function scoreToX(score) {
  return 72 + ((score - 35) / 60) * 620;
}

function drawClassPlot() {
  const spread = Number(classSpread.value);
  const adjusted = baseScores.map((score, index) => {
    const center = 60;
    const factor = 0.62 + spread / 110;
    return center + (score - center) * factor + Math.sin(index * 1.7) * 1.4;
  });

  classPlot.replaceChildren();
  classPlot.append(
    svg("line", { x1: 72, y1: 285, x2: 692, y2: 285, stroke: "#d9d6d2", "stroke-width": 2 }),
    svg("text", { x: 72, y: 322, class: "axis-label" }),
    svg("text", { x: 638, y: 322, class: "axis-label" }),
    svg("text", { x: 300, y: 54, class: "plot-label" })
  );
  classPlot.children[1].textContent = "niedriger";
  classPlot.children[2].textContent = "höher";
  classPlot.children[3].textContent = "Aktueller Leistungswert im Klassenvergleich";

  adjusted.forEach((score, index) => {
    const dot = svg("circle", {
      class: "dot",
      cx: scoreToX(score),
      cy: 238 - (index % 7) * 19,
      r: 9,
      fill: "#dfe8df",
      stroke: "#aebbad",
      "stroke-width": 1,
      opacity: 0.9,
    });
    classPlot.append(dot);
  });

  [
    { label: "Mira", y: 122, color: "#6a2f1d" },
    { label: "Lina", y: 154, color: "#315f8f" },
  ].forEach((item) => {
    classPlot.append(svg("circle", { cx: scoreToX(58), cy: item.y, r: 15, fill: item.color }));
    const text = svg("text", { x: scoreToX(58) + 22, y: item.y + 5, class: "plot-label" });
    text.textContent = `${item.label}: Note 3`;
    classPlot.append(text);
  });

  const hetero = spread < 35 ? "relativ homogen" : spread > 72 ? "stark heterogen" : "moderat heterogen";
  classInterpretation.textContent = `Die Klasse wirkt ${hetero}. Mira und Lina haben denselben aktuellen Wert; daraus folgt noch keine identische Förderung.`;
}

function yFor(score) {
  return 300 - ((score - 35) / 45) * 230;
}

function makePath(values) {
  return values.map((value, index) => `${index === 0 ? "M" : "L"} ${82 + index * 118} ${yFor(value)}`).join(" ");
}

function drawTimeline(mode = "mira") {
  timelinePlot.replaceChildren();
  timelinePlot.append(
    svg("line", { x1: 70, y1: 300, x2: 690, y2: 300, stroke: "#d9d6d2", "stroke-width": 2 }),
    svg("line", { x1: 70, y1: 70, x2: 70, y2: 300, stroke: "#d9d6d2", "stroke-width": 2 })
  );

  ["A1", "A2", "A3", "A4", "A5", "A6"].forEach((label, index) => {
    const text = svg("text", { x: 72 + index * 118, y: 330, class: "axis-label" });
    text.textContent = label;
    timelinePlot.append(text);
  });

  const showMira = mode === "mira" || mode === "both";
  const showLina = mode === "lina" || mode === "both";

  if (showMira) {
    timelinePlot.append(svg("path", { d: makePath(mira), class: "mira-line" }));
  }
  if (showLina) {
    timelinePlot.append(svg("path", { d: makePath(lina), class: "lina-line" }));
  }

  [
    ...(showMira ? mira.map((value, index) => ({ value, index, color: "#6a2f1d" })) : []),
    ...(showLina ? lina.map((value, index) => ({ value, index, color: "#315f8f" })) : []),
  ].forEach((point) => {
    timelinePlot.append(svg("circle", { cx: 82 + point.index * 118, cy: yFor(point.value), r: 10, fill: point.color }));
  });

  const text = svg("text", { x: 96, y: 48, class: "plot-label" });
  text.textContent = mode === "both" ? "Mira: stabil steigend | Lina: stark schwankend" : mode === "mira" ? "Mira: stabiler Entwicklungsverlauf" : "Lina: hohe intraindividuelle Schwankung";
  timelinePlot.append(text);

  timelineInterpretation.textContent =
    mode === "mira"
      ? "Mira zeigt einen moderaten, stabilen Anstieg. Die Note 3 kann hier ein Zwischenstand in einer positiven Entwicklung sein."
      : mode === "lina"
        ? "Lina zeigt starke Schwankungen. Die Note 3 kann hier ein instabiler Moment sein und verlangt Prozess- und Situationsdiagnostik."
        : "Im direkten Vergleich wird sichtbar: Interindividuell gleicher Wert, intraindividuell unterschiedliche Entwicklungslogik.";
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function updateSimulator() {
  const values = Object.fromEntries(simInputs.map((input) => [input.dataset.sim, Number(input.value)]));
  const performance = clamp(values.prior * 0.34 + values.strategy * 0.27 + values.motivation * 0.2 + values.feedback * 0.16 - values.stress * 0.13 + 12);
  const engagement = clamp(values.motivation * 0.38 + values.feedback * 0.25 + values.strategy * 0.22 - values.stress * 0.12 + 20);

  document.querySelector("#performanceMeter").style.width = `${performance}%`;
  document.querySelector("#engagementMeter").style.width = `${engagement}%`;
  document.querySelector("#performanceValue").textContent = performance;
  document.querySelector("#engagementValue").textContent = engagement;

  let focus = "Nächster Schritt und Zielklarheit verbinden.";
  if (values.stress > 70) focus = "Prüfungsdruck senken und Leistung über mehrere Situationen prüfen.";
  if (values.motivation < 40) focus = "Wert und Selbstwirksamkeit stärken, bevor reine Leistungskorrektur dominiert.";
  if (values.strategy < 40) focus = "Strategieeinsatz sichtbar machen und Feedback in Handlungsschritte übersetzen.";
  if (values.feedback < 35) focus = "Feedback präzisieren: Ziel, aktueller Stand und nächster Schritt müssen erkennbar sein.";
  document.querySelector("#supportFocus").textContent = focus;
}

function updateRecommendation() {
  const items = Array.from(selectedChips);
  const meter = Math.min(100, items.length * 18);
  document.querySelector("#readinessMeter").style.width = `${meter}%`;

  if (items.length < 3) {
    document.querySelector("#recommendationText").textContent = "Wähle mindestens drei Informationsquellen, um eine Förderentscheidung zu begründen.";
    return;
  }

  const hasProcess = items.some((item) => ["Feedbacknutzung", "Strategieeinsatz", "Aufgabentyp"].includes(item));
  const hasIntra = items.includes("Verlauf über Zeit");
  const hasPerson = items.some((item) => ["Motivation", "Selbstkonzept"].includes(item));
  const profile = hasIntra && hasProcess && hasPerson ? "entwicklungs- und prozessorientiert" : hasIntra ? "verlaufsorientiert" : "vergleichsorientiert";
  document.querySelector("#recommendationText").textContent = `Die Empfehlung ist ${profile}: Neben ${items.slice(0, -1).join(", ")} und ${items.at(-1)} sollte Förderung an konkreten Lernbedingungen ansetzen.`;
}

modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.focusMode)));
learnerCards.forEach((card) => card.addEventListener("click", () => selectLearner(card.dataset.learnerCard)));
classSpread.addEventListener("input", drawClassPlot);
timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timelineButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    drawTimeline(button.dataset.activeLearner);
  });
});
simInputs.forEach((input) => input.addEventListener("input", updateSimulator));
document.querySelectorAll("[data-chip]").forEach((button) => {
  button.addEventListener("click", () => {
    const chip = button.dataset.chip;
    if (selectedChips.has(chip)) {
      selectedChips.delete(chip);
    } else {
      selectedChips.add(chip);
    }
    button.classList.toggle("is-selected", selectedChips.has(chip));
    updateRecommendation();
  });
});

setMode("inter");
drawClassPlot();
drawTimeline("mira");
updateSimulator();
updateRecommendation();
