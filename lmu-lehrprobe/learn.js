const miraSchoolSlider = document.querySelector("#miraSchoolSlider");
const linaSchoolSlider = document.querySelector("#linaSchoolSlider");
const classPlot = document.querySelector("#classPlot");
const timelinePlot = document.querySelector("#timelinePlot");
const betweenText = document.querySelector("#betweenText");
const withinText = document.querySelector("#withinText");
const diagnosisTitle = document.querySelector("#diagnosisTitle");
const diagnosisText = document.querySelector("#diagnosisText");

const miraSchoolShape = [43, 46, 48, 50, 51, 52, 53, 54, 55, 56, 56, 57, 58, 59, 60, 61, 63, 65, 67, 69, 72, 74];
const linaSchoolShape = [42, 45, 47, 49, 51, 53, 54, 55, 57, 59, 60, 61, 62, 64, 66, 68, 69, 71, 73, 75, 78, 80];
const subjects = ["D", "M", "D", "H", "D", "D", "M", "D", "H", "D", "D", "M", "D", "H", "D", "D", "M", "H"];
const stableProfile = [57, 58, 58, 59, 58, 59, 57, 58, 60, 58, 59, 58, 59, 60, 58, 59, 58, 60];
const subjectProfile = [58, 50, 59, 67, 57, 58, 49, 59, 66, 58, 59, 51, 58, 68, 57, 58, 50, 67];
const subjectMeta = {
  D: { label: "Deutsch", color: "#6a2f1d" },
  M: { label: "Mathe", color: "#315f8f" },
  H: { label: "Heimatkunde", color: "#4c7b55" },
};

function svg(tag, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function scoreToX(score) {
  return 70 + ((score - 35) / 50) * 620;
}

function scoreToY(score) {
  return 278 - ((score - 42) / 28) * 204;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function profileX(origin, index) {
  return origin + 28 + index * 15.2;
}

function profileY(value) {
  return 252 - ((value - 44) / 26) * 150;
}

function pathForProfile(values, origin) {
  return values.map((value, index) => `${index === 0 ? "M" : "L"} ${profileX(origin, index)} ${profileY(value)}`).join(" ");
}

function shiftedScores(shape, sliderValue) {
  const shift = -9 + Number(sliderValue) * 0.18;
  return shape.map((score, index) => score + shift + Math.sin(index * 1.7) * 0.8);
}

function drawClassPlot() {
  const miraScores = shiftedScores(miraSchoolShape, miraSchoolSlider.value);
  const linaScores = shiftedScores(linaSchoolShape, linaSchoolSlider.value);

  classPlot.replaceChildren();
  classPlot.append(
    svg("line", { x1: 70, y1: 270, x2: 690, y2: 270, class: "guide-line" }),
    svg("text", { x: 70, y: 302, class: "axis-label" }),
    svg("text", { x: 628, y: 302, class: "axis-label" }),
    svg("text", { x: 214, y: 36, class: "plot-label" })
  );
  classPlot.children[1].textContent = "niedriger";
  classPlot.children[2].textContent = "höher";
  classPlot.children[3].textContent = "Leistungswert im Schul- und Klassenkontext";

  [
    { label: "Miras Schule A / Klasse 4a", scores: miraScores, row: 112, color: "#dfe8df", stroke: "#aebbad", hero: 58, name: "Mira", heroColor: "#6a2f1d" },
    { label: "Linas Schule B / Klasse 4b", scores: linaScores, row: 206, color: "#e9edf4", stroke: "#b4c1d1", hero: 58, name: "Lina", heroColor: "#315f8f" },
  ].forEach((group) => {
    const label = svg("text", { x: 74, y: group.row - 38, class: "plot-label" });
    label.textContent = group.label;
    classPlot.append(label);

    group.scores.forEach((score, index) => {
      classPlot.append(svg("circle", {
        cx: scoreToX(score),
        cy: group.row + ((index % 5) - 2) * 9,
        r: 6.8,
        fill: group.color,
        stroke: group.stroke,
        "stroke-width": 1,
      }));
    });

    classPlot.append(svg("circle", { cx: scoreToX(group.hero), cy: group.row, r: 14, fill: group.heroColor }));
    const heroLabel = svg("text", { x: scoreToX(group.hero) + 20, y: group.row + 5, class: "plot-label" });
    heroLabel.textContent = `${group.name}: Ø 2,33 aus 18`;
    classPlot.append(heroLabel);
  });

  const miraMean = mean(miraScores);
  const linaMean = mean(linaScores);
  const comparison = linaMean > miraMean + 4 ? "leistungsstärkeren" : linaMean < miraMean - 4 ? "leistungsschwächeren" : "ähnlich leistungsstarken";
  betweenText.textContent = `Interindividuell: Der gleiche Durchschnitt liegt in zwei Schulen. Lina steht aktuell in einer ${comparison} Schule B; Mira und Lina behalten denselben eigenen Wert, aber der Vergleichsrahmen wandert.`;
}

function drawProfilePanel(origin, title, values, lineClass) {
  const titleNode = svg("text", { x: origin, y: 44, class: "plot-label" });
  titleNode.textContent = title;
  timelinePlot.append(titleNode);
  timelinePlot.append(svg("line", { x1: origin, y1: 252, x2: origin + 302, y2: 252, class: "guide-line" }));
  timelinePlot.append(svg("line", { x1: origin, y1: 88, x2: origin, y2: 252, class: "guide-line" }));
  timelinePlot.append(svg("path", { d: pathForProfile(values, origin), class: lineClass }));

  values.forEach((value, index) => {
    const subject = subjectMeta[subjects[index]];
    const x = profileX(origin, index);
    const y = profileY(value);
    timelinePlot.append(svg("circle", { cx: x, cy: y, r: 5.7, fill: subject.color }));
    const timeLabel = svg("text", { x: x - 3.5, y: y - 9, class: "time-label" });
    timeLabel.textContent = String(index + 1);
    timelinePlot.append(timeLabel);
    const subjectLabel = svg("text", { x: x - 3.5, y: 274, class: "subject-label" });
    subjectLabel.textContent = subjects[index];
    timelinePlot.append(subjectLabel);
  });
}

function drawTimeline() {
  timelinePlot.replaceChildren();
  drawProfilePanel(58, "Stabiles Profil: fachübergreifend ähnlich", stableProfile, "mira-line");
  drawProfilePanel(420, "Fachspezifisches Profil: Mathe anders als HSU", subjectProfile, "lina-line");

  [
    { key: "D", x: 78 },
    { key: "M", x: 178 },
    { key: "H", x: 278 },
  ].forEach((item) => {
    const meta = subjectMeta[item.key];
    timelinePlot.append(svg("circle", { cx: item.x, cy: 306, r: 5.5, fill: meta.color }));
    const label = svg("text", { x: item.x + 10, y: 310, class: "muted-label" });
    label.textContent = `${item.key} ${meta.label}`;
    timelinePlot.append(label);
  });

  withinText.textContent = "Intraindividuell: Die 18 Zeitmarker zeigen nicht nur Entwicklung, sondern auch Fachspezifik. Ein stabiler Durchschnitt kann fachübergreifend ähnlich sein oder starke Unterschiede zwischen Deutsch, Mathe und Heimatkunde verdecken.";
}

function updateDiagnosis() {
  const miraMean = mean(shiftedScores(miraSchoolShape, miraSchoolSlider.value));
  const linaMean = mean(shiftedScores(linaSchoolShape, linaSchoolSlider.value));
  const schoolPhrase = Math.abs(miraMean - linaMean) < 4 ? "ähnliche Schulkontexte" : linaMean > miraMean ? "eine leistungsstärkere Schule B" : "eine leistungsstärkere Schule A";

  diagnosisTitle.textContent = "Ein gleicher Durchschnitt ist diagnostisch unterbestimmt.";
  diagnosisText.textContent = `Vor einer Empfehlung brauche ich ${schoolPhrase}, die Position in der jeweiligen Klasse und den 18er-Verlauf nach Fächern.`;
}

function updateAll() {
  drawClassPlot();
  drawTimeline();
  updateDiagnosis();
}

miraSchoolSlider.addEventListener("input", updateAll);
linaSchoolSlider.addEventListener("input", updateAll);

updateAll();
