const slides = Array.from(document.querySelectorAll(".slide"));
const progressBar = document.querySelector("#progressBar");
const slideBadge = document.querySelector("#slideBadge");
const railSlideCounter = document.querySelector("#railSlideCounter");
const railQr = document.querySelector("#railQr");
const pathwayRail = document.querySelector(".pathway-rail");
const railInfoToggle = document.querySelector("[data-rail-info]");
const stageLinks = Array.from(document.querySelectorAll("[data-stage-link]"));
const currentStage = document.querySelector("#currentStage");
const currentSlideTitle = document.querySelector("#currentSlideTitle");
const currentStageNote = document.querySelector("#currentStageNote");
const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const lightboxFigure = document.querySelector(".lightbox-figure");
const glossaryButtons = Array.from(document.querySelectorAll("[data-glossary]"));
const glossaryPopover = document.querySelector("#glossaryPopover");
const glossaryCard = document.querySelector(".glossary-card");
const glossaryTitle = document.querySelector("#glossaryTitle");
const glossarySlideTitle = document.querySelector("#glossarySlideTitle");
const glossaryFunctions = document.querySelector("#glossaryFunctions");
const glossaryTerms = document.querySelector("#glossaryTerms");
let lightboxTrigger = null;
let glossaryTrigger = null;
const talkStartIndex = Math.max(0, slides.findIndex((slide) => slide.id === "titel-lehrprobe-start"));
const talkSlideCount = Math.max(1, slides.length - talkStartIndex);

const stageMeta = {
  vorlauf: {
    label: "Einordnung",
    note: "Curriculum und Lehrveranstaltung vor Beginn der Lehrprobe",
  },
  problemfall: {
    label: "Problemfall",
    note: "Anlass, Auftrag und Beratungsfall",
  },
  aktivierung: {
    label: "Aktivierung",
    note: "Eigene diagnostische Vermutung und Lernziel",
  },
  "begriff-inter": {
    label: "Begriff 1 interindividuell",
    note: "Vergleich zwischen Lernenden, Gruppen und Schulen",
  },
  "begriff-intra": {
    label: "Begriff 2 intraindividuell",
    note: "Verlauf innerhalb einer Person über Zeit, Fächer und Aufgaben",
  },
  forschungsanker: {
    label: "Forschungsanker",
    note: "Empirische und theoretische Begründung der Perspektive",
  },
  sicherung: {
    label: "Sicherung",
    note: "Rückbindung an verantwortbare Beratung",
  },
  transfer: {
    label: "Transfer",
    note: "Anschluss an Folgesitzung und weitere Professionalisierung",
  },
};

const stageFirstSlides = new Map();
slides.forEach((slide, index) => {
  const stage = slide.dataset.stage;
  if (stage && !stageFirstSlides.has(stage)) {
    stageFirstSlides.set(stage, index + 1);
  }
});

stageLinks.forEach((link) => {
  const firstSlide = stageFirstSlides.get(link.dataset.stageLink);
  const startLabel = link.querySelector("[data-stage-start]");
  const talkSlide = firstSlide ? firstSlide - talkStartIndex : null;
  if (firstSlide && startLabel) {
    startLabel.textContent = `ab Folie ${talkSlide}`;
    link.setAttribute("title", `${link.textContent.trim().replace(/\s+/g, " ")}, ab Folie ${talkSlide}`);
  } else if (talkSlide) {
    link.setAttribute("title", `${link.textContent.trim().replace(/\s+/g, " ")}, ab Folie ${talkSlide}`);
  }
});

const slideFunctions = {
  titel: {
    content: "Eröffnet den Titel und die zentrale Leitidee: gleiche Noten können in der Schulpsychologie unterschiedliche Bedeutungen haben.",
    didactic: "Bietet vor der curricularen Einordnung eine ruhige Orientierung und setzt die Hauptfrage der Sitzung.",
  },
  "curriculum-einordnung": {
    content: "Verortet die Lehrprobe im 2. Semester in der Einführung in die Differentielle und Persönlichkeitspsychologie.",
    didactic: "Macht transparent, warum die Einheit eine Grundlage für Pädagogische Psychologie, Diagnostik und Gutachten bildet.",
  },
  "lehrveranstaltung-einordnung": {
    content: "Zeigt den Platz der Sitzung innerhalb der geplanten Vorlesung zu Schulleistung, Personmerkmalen, Motivation, Kontext und pädagogischem Handeln.",
    didactic: "Gibt den Studierenden einen Advance Organizer: Die heutige Sitzung ist Sitzung 2 im Block Schulleistung verstehen.",
  },
  "titel-lehrprobe-start": {
    content: "Markiert den eigentlichen Start der Lehrprobe nach den Einordnungsfolien.",
    didactic: "Setzt Aufmerksamkeit neu auf die Beratungsfrage und trennt Vorrahmung von Lehrvortrag.",
  },
  "gesellschaftspolitischer-start": {
    content: "Rahmt Schulübergänge als öffentlich diskutierte und schulpsychologisch relevante Entscheidungsmomente.",
    didactic: "Erzeugt Relevanz über einen authentischen Anlass, bevor die rechtliche und diagnostische Problemstellung folgt.",
  },
  "auftrag-schulpsychologie": {
    content: "Zeigt Schullaufbahnberatung als Kernauftrag schulpsychologischer Praxis.",
    didactic: "Begründet, warum die folgende Durchschnittsnotenfrage nicht nur schulorganisatorisch, sondern berufspraktisch relevant ist.",
  },
  uebertrittsschwelle: {
    content: "Verbindet den schulpsychologischen Auftrag zur Schullaufbahnberatung mit der formalen bayerischen Durchschnittsnotenschwelle.",
    didactic: "Macht sichtbar, warum aus einer rechtlichen Schwelle eine diagnostische Beratungsfrage wird.",
  },
  fall: {
    content: "Führt Mira, Anna und Nina als Beratungsfälle ein: alle mit Durchschnitt 2,2 und derselben Frage nach dem Gymnasium.",
    didactic: "Öffnet ein Problem, das bewusst unterbestimmt bleibt und Informationsbedarf erzeugt.",
  },
  "didaktisches-konzept": {
    content: "Erklärt die Seitenleistenphasen: Problemfall, Aktivierung, Begriff 1 interindividuell, Begriff 2 intraindividuell, Forschungsanker, Sicherung und Transfer.",
    didactic: "Macht die Lernbewegung sichtbar, damit die Studierenden verstehen, wie der Fall über zwei Begriffe in Forschung und Beratung überführt wird.",
  },
  "aktivierung-1": {
    content: "Lässt die Studierenden formulieren, welche Daten sie vor einer Empfehlung erheben würden.",
    didactic: "Aktiviert Vorwissen und sammelt intuitive diagnostische Hypothesen, die später fachlich geordnet werden.",
  },
  studiumsanschluss: {
    content: "Zeigt, welches Vorwissen aus dem 1. Semester und der letzten Vorlesung anschließt und wo die Fallfrage im Studium wiederkehrt.",
    didactic: "Stärkt Relevanz und Erwartungswert, indem die Fallfrage als wiederkehrendes Studien- und Praxisproblem sichtbar wird.",
  },
  lernziele: {
    content: "Benennt das eine zentrale Lernziel: die Bedeutung individueller Unterschiede für die Schulpsychologie verstehen.",
    didactic: "Reduziert Komplexität auf einen klaren Fokus, bevor die beiden Begriffe interaktiv aufgebaut und forschungsbezogen verankert werden.",
  },
  "live-klassen-demo": {
    content: "Visualisiert interindividuelle Unterschiede zwischen Schulen: Mittelwert, Streuung und Outcome können variieren.",
    didactic: "Erlaubt durch Regler und Outcome-Wechsel, die Bedeutung von Bezugsgruppen aktiv zu erkunden.",
  },
  interventionspassung: {
    content: "Zeigt, dass Interventionen für unterschiedliche Lernendenprofile unterschiedlich passend sein können.",
    didactic: "Übersetzt individuelle Unterschiede in eine praktische Passungsfrage für Unterricht und Beratung.",
  },
  "vera-daten": {
    content: "Nutzt VERA 3 als Beispiel dafür, dass interindividuelle Unterschiede aus Daten nicht automatisch verständlich werden.",
    didactic: "Begründet, warum Datenkompetenz und diagnostisches Training für Lehrkräfte relevant sind.",
  },
  "highest-performance": {
    content: "Zeigt anhand von Höchstleistungsforschung, dass Verläufe oft informativer sind als aktuelle Einzelwerte.",
    didactic: "Stärkt den Blick auf intraindividuelle Entwicklung und bereitet die Kritik an Einzelnoten vor.",
  },
  "gleiche-note": {
    content: "Spitzt zu, dass eine einzelne Note stabile Kompetenz, kurzfristigen Einbruch oder individuellen Fortschritt verdecken kann.",
    didactic: "Verdichtet die Problematik von Einzelnoten als Übergang zur Verlaufsvisualisierung.",
  },
  "live-profile-demo": {
    content: "Visualisiert 18 Leistungsergebnisse über das Schuljahr: derselbe Mittelwert 2,2 kann sehr unterschiedliche Profile haben.",
    didactic: "Macht intraindividuelle Unterschiede über Zeit, Fächer und Schwankungen aktiv manipulierbar.",
  },
  arbeitsmodell: {
    content: "Nutzt SEVT als Landkarte dafür, warum dieselbe Situation zwischen Personen und innerhalb einer Person unterschiedlich gedeutet wird.",
    didactic: "Formalisiert den Grundgedanken der Sitzung, ohne SEVT vollständig zu lehren; die Theorie wird später detailliert aufgegriffen.",
  },
  interindividuell: {
    content: "Sichert die interindividuelle Perspektive: Wir vergleichen verschiedene Lernende miteinander.",
    didactic: "Verdichtet nach Modell und Beispielen die Leitfrage: Wer unterscheidet sich von wem?",
  },
  intraindividuell: {
    content: "Sichert die intraindividuelle Perspektive: Wir betrachten dieselbe Person über Zeit, Situationen oder Aufgaben.",
    didactic: "Kontrastiert zur Vergleichsfrage und fixiert die Entwicklungsfrage: Wann unterscheidet sich eine Person von sich selbst?",
  },
  anwendung: {
    content: "Überträgt beide Perspektiven zurück auf die Empfehlung: Kontext, Vergleich und Verlauf müssen gemeinsam berücksichtigt werden.",
    didactic: "Sichert die Beratungslogik an den Ausgangsfällen Mira, Anna und Nina.",
  },
  "visible-learning-ausblick": {
    content: "Verbindet die Bedeutung intra- und interindividueller Unterschiede mit dem Visible-Learning-Lehrbuchprojekt.",
    didactic: "Öffnet den Transfer von der Lehrprobe in ein größeres Evidenzprogramm: Für wen, unter welchen Bedingungen und in welchem Verlauf?",
  },
  schluss: {
    content: "Leitet zur nächsten Sitzung zu Intelligenz und kognitiven Fähigkeiten im Schulkontext über.",
    didactic: "Bietet drei gestufte Zugänge, damit Studierende selbstständig an die Anschlussfrage weiterarbeiten können.",
  },
};

const glossaryBySlide = {
  titel: [
    ["Differentielle Psychologie", "Teilgebiet der Psychologie, das Unterschiede zwischen Menschen und Unterschiede innerhalb einer Person beschreibt und erklärt."],
    ["Individuelle Unterschiede", "Unterschiede zwischen Lernenden oder innerhalb einer Person über Zeit, Fächer, Aufgaben und Situationen."],
    ["Schulpsychologie", "Psychologische Praxis im Schulsystem, etwa Diagnostik, Beratung und Unterstützung von Bildungsentscheidungen."],
    ["Schulleistung", "Beobachtbares Ergebnis schulischen Lernens, etwa Noten, Testergebnisse, Produkte oder Aufgabenlösungen."],
  ],
  "curriculum-einordnung": [
    ["Curriculum", "Geplanter Zusammenhang von Studieninhalten, Lernzielen und Prüfungsanforderungen in einem Studiengang."],
    ["P2.1", "Position im Studienplan: Einführung in die Differentielle und Persönlichkeitspsychologie im zweiten Semester."],
    ["Professionalisierung", "Aufbau fachlicher Grundlagen, damit spätere Beratung, Diagnostik und Gutachten begründet erfolgen."],
    ["Gutachten", "Schriftliche Integration diagnostischer Befunde für eine schulpsychologische Fragestellung."],
  ],
  "lehrveranstaltung-einordnung": [
    ["Schulleistung", "Oberbegriff für sichtbare und messbare Leistungen, etwa Noten, Tests und Kompetenzstände."],
    ["Bezugsnormen", "Vergleichsmaßstäbe für Leistung: sozial, kriterial oder individuell."],
    ["Personmerkmale", "Relativ stabile oder situationsabhängige Merkmale, die Lernen mit erklären können."],
    ["Person-Umwelt-Passung", "Frage, wie Lernvoraussetzungen, Unterricht, Klasse und schulischer Kontext zusammenpassen."],
  ],
  "titel-lehrprobe-start": [
    ["Noten", "Verdichtete schulische Leistungsurteile, die ohne Kontext nur begrenzt diagnostisch aussagekräftig sind."],
    ["Interindividuell", "Zwischen Personen oder Gruppen: Wer unterscheidet sich von wem?"],
    ["Intraindividuell", "Innerhalb einer Person: Wann oder wodurch unterscheidet sich eine Person von sich selbst?"],
    ["Beratung", "Professionelle Unterstützung von Entscheidungen, bei der Informationen erhoben, gedeutet und kommuniziert werden."],
  ],
  "gesellschaftspolitischer-start": [
    ["Schulübergang", "Entscheidungsmoment zwischen Schularten oder Bildungswegen."],
    ["Übertrittszeugnis", "Zeugnis am Ende der Grundschule, das in Bayern für den weiteren Bildungsweg bedeutsam ist."],
    ["Schullaufbahnberatung", "Beratung zu passenden Bildungswegen, Übergängen und schulischen Entscheidungen."],
    ["Kennwert", "Ein einzelner Zahlenwert, der komplexe Informationen verdichtet."],
  ],
  "auftrag-schulpsychologie": [
    ["Schullaufbahnberatung", "Beratung zu Bildungswegen und Übergängen unter Einbezug diagnostischer Informationen."],
    ["Eignung", "Einschätzung, ob aktuelle Voraussetzungen, Entwicklung und Kontext zu einem Bildungsweg passen."],
    ["Diagnostisches Urteil", "Fachlich begründete Einschätzung auf Basis mehrerer Informationen."],
    ["Beratungsanlass", "Konkrete Frage, wegen der schulpsychologische Unterstützung gesucht wird."],
  ],
  uebertrittsschwelle: [
    ["Schullaufbahnberatung", "Schulpsychologische Beratung zur Passung von Bildungswegen, Voraussetzungen und Entwicklung."],
    ["Entscheidungsschwelle", "Grenzwert, ab dem eine formale Entscheidung anders ausfällt."],
    ["Gesamtdurchschnittsnote", "Zusammenfassender Mittelwert mehrerer Jahresfortgangsnoten."],
    ["Formale Eignungsschwelle", "Administrativ festgelegter Grenzwert; er ersetzt keine psychologische Einzelfallklärung."],
    ["Schwellenwert", "Numerische Grenze, die Komplexität reduziert und diagnostisch ergänzt werden sollte."],
  ],
  fall: [
    ["Beratungsfall", "Konkrete Situation, an der diagnostisches Denken geübt wird."],
    ["Notendurchschnitt", "Zusammenfassung mehrerer Noten in einer Zahl."],
    ["Gymnasialempfehlung", "Beratungsbezogene Einschätzung, ob der Bildungsweg Gymnasium verantwortbar erscheint."],
    ["Informationsbedarf", "Das, was zusätzlich erhoben werden muss, bevor eine Empfehlung begründet ist."],
  ],
  "didaktisches-konzept": [
    ["Problemfall", "Ausgangspunkt: Gleiche Durchschnitte reichen für die Beratung nicht aus."],
    ["Aktivierung", "Kurze Denkphase, in der eigene Informationsbedarfe formuliert werden."],
    ["Begriff 1 interindividuell", "Vergleichsperspektive: Unterschiede zwischen Lernenden, Gruppen oder Schulen."],
    ["Begriff 2 intraindividuell", "Verlaufsperspektive: Unterschiede innerhalb einer Person über Zeit, Fächer oder Aufgaben."],
    ["Forschungsanker", "Empirische und theoretische Begründung, warum die beiden Perspektiven diagnostisch zählen."],
    ["Sicherung", "Verdichtung in Beratungslogik."],
    ["Transfer", "Anschluss an Evidenzprogramm und nächste Sitzung."],
  ],
  "aktivierung-1": [
    ["Zusatzinformation", "Information, die über den Durchschnitt hinausgeht und eine Empfehlung absichert."],
    ["Klassenvergleich", "Einordnung einer Person im Vergleich zur Klasse oder Schule."],
    ["Verlauf", "Entwicklung eines Leistungs- oder Motivationswerts über Zeit."],
    ["Selbstkonzept", "Einschätzung einer Person, wie gut sie in einem Bereich ist."],
  ],
  studiumsanschluss: [
    ["EWS", "Erziehungswissenschaftliches Studium mit psychologischen und pädagogischen Grundlagen des Lehrberufs."],
    ["Bezugsnormen", "Maßstäbe, mit denen Leistung als sozialer Vergleich, Kriterium oder Entwicklung gelesen wird."],
    ["Befundlage", "Gesamtheit der Informationen, die eine diagnostische Empfehlung stützen oder begrenzen."],
    ["Studienanschluss", "Späterer Ort im Studium, an dem dieselbe Fallfrage wieder relevant wird."],
  ],
  lernziele: [
    ["Lernziel", "Beschreibung dessen, was Lernende nach der Einheit verstehen oder können sollen."],
    ["Individuelle Unterschiede", "Unterschiede zwischen Lernenden und Unterschiede innerhalb einer Person."],
    ["Bedeutung", "Warum ein Konzept für professionelles Handeln relevant ist."],
  ],
  "live-klassen-demo": [
    ["Interindividuelle Unterschiede", "Unterschiede zwischen Personen, Klassen oder Schulen."],
    ["Mittelwert", "Durchschnittliche Ausprägung eines Outcomes in einer Gruppe."],
    ["Streuung", "Wie stark Personen innerhalb einer Gruppe voneinander abweichen."],
    ["Outcome", "Ziel- oder Ergebnisvariable, zum Beispiel Leistung, Motivation, Selbstkonzept oder Gewissenhaftigkeit."],
    ["Bezugsgruppe", "Gruppe, mit der eine Person verglichen wird."],
  ],
  interventionspassung: [
    ["Intervention", "Gezielte pädagogische oder psychologische Maßnahme zur Unterstützung von Lernen, Motivation oder Verhalten."],
    ["Passung", "Übereinstimmung zwischen Unterstützung, Lernendenprofil und Situation."],
    ["Moderation", "Wenn eine Wirkung davon abhängt, für wen oder unter welchen Bedingungen eine Maßnahme eingesetzt wird."],
    ["Adaptivität", "Anpassung von Unterstützung an individuelle Voraussetzungen, Ziele oder Verläufe."],
  ],
  "vera-daten": [
    ["VERA 3", "Vergleichsarbeiten in der dritten Jahrgangsstufe; sie liefern standardisierte Kompetenzinformationen."],
    ["Datenvisualisierung", "Grafische Aufbereitung von Testergebnissen."],
    ["Kompetenzstufe", "Einordnung von Testleistungen in fachliche Niveaustufen."],
    ["Datenkompetenz", "Fähigkeit, Daten sachgerecht zu lesen, zu deuten und auf pädagogische Fragen zu beziehen."],
    ["Interindividuelle Unterschiede", "Unterschiede zwischen Lernenden oder Gruppen, die in Leistungsdaten sichtbar werden können."],
  ],
  "highest-performance": [
    ["Intraindividueller Verlauf", "Entwicklung einer Person über Zeit, statt nur ihr aktueller Leistungsstand."],
    ["Momentaufnahme", "Ein einzelner Wert zu einem Zeitpunkt; er kann Entwicklung verdecken."],
    ["Höchstleistung", "Außergewöhnlich hohes Leistungsniveau in einem Bereich."],
    ["Vorhersagekraft", "Ausmaß, in dem eine Information spätere Leistung oder Entwicklung erklärt."],
  ],
  "gleiche-note": [
    ["Einzelnote", "Ein einzelner Leistungswert, der ohne Kontext oder Verlauf leicht überinterpretiert wird."],
    ["Leistungsstand", "Aktueller Stand einer Leistung zu einem bestimmten Zeitpunkt."],
    ["Kurzfristiger Einbruch", "Vorübergehende Verschlechterung, die nicht den üblichen Leistungsstand abbildet."],
    ["Individueller Fortschritt", "Verbesserung im Vergleich zur eigenen früheren Leistung."],
  ],
  "live-profile-demo": [
    ["18 Leistungsergebnisse", "Mehrere Leistungsnachweise über das Schuljahr; sie zeigen mehr als ein Durchschnittswert."],
    ["Intraindividuelle Unterschiede", "Unterschiede innerhalb einer Person über Zeit, Fächer oder Situationen hinweg."],
    ["Fachspezifisches Profil", "Muster, bei dem Leistungen je nach Fach unterschiedlich ausfallen."],
    ["Zeitmarker", "Markierungen der Reihenfolge einzelner Leistungsergebnisse."],
    ["Mittelwertgleichheit", "Gleicher Durchschnitt trotz unterschiedlicher Einzelwerte und Verläufe."],
  ],
  arbeitsmodell: [
    ["SEVT", "Situated Expectancy-Value Theory: Theorie zu Erwartungen, Werten, Zielen, Selbstkonzept, Kontext und Leistungsentscheidungen."],
    ["Erfolgserwartung", "Einschätzung, ob man eine Aufgabe erfolgreich bewältigen kann."],
    ["Subjektiver Aufgabenwert", "Bedeutung, Interesse, Nutzen oder Kosten, die eine Person einer Aufgabe zuschreibt."],
    ["Interindividuell im Modell", "Linke Modellbereiche: Lernende bringen unterschiedliche Erfahrungen und Voraussetzungen mit."],
    ["Intraindividuell im Modell", "Mittlere Modellbereiche: dieselbe Person deutet Aufgaben je nach Situation unterschiedlich."],
  ],
  interindividuell: [
    ["Interindividuell", "Zwischen Personen: Wer unterscheidet sich von wem?"],
    ["Vergleichsfrage", "Diagnostische Frage nach Unterschieden zwischen Lernenden oder Gruppen."],
    ["Vorwissen", "Bereits vorhandenes Wissen, das Lernen erleichtern oder begrenzen kann."],
    ["Motivation", "Bereitschaft und Ausrichtung, sich mit einer Aufgabe zu beschäftigen."],
  ],
  intraindividuell: [
    ["Intraindividuell", "Innerhalb einer Person: Wann oder wodurch unterscheidet sich eine Person von sich selbst?"],
    ["Entwicklungsfrage", "Diagnostische Frage nach Veränderung über Zeit, Aufgaben oder Situationen."],
    ["Anstrengung", "Eingesetzte Mühe oder Aktivität bei einer Aufgabe."],
    ["Schwankung", "Unterschiedliche Ausprägung desselben Merkmals innerhalb einer Person."],
  ],
  anwendung: [
    ["Empfehlung", "Beratungsbezogene Einschätzung, welche schulische Entscheidung verantwortbar ist."],
    ["Kontext", "Rahmenbedingungen wie Bezugsgruppe, Aufgabe, Klasse, Schule oder Familiensituation."],
    ["Berücksichtigung", "Eine Information wird nicht nur erhoben, sondern aktiv in die Entscheidung einbezogen."],
    ["Verantwortbarkeit", "Die fachliche Begründbarkeit einer Empfehlung auf Basis ausreichender Befunde."],
  ],
  "visible-learning-ausblick": [
    ["Visible Learning", "Forschungsprogramm und Buchreihe, die Evidenz zu Einflüssen auf Lernen und Leistung bündelt."],
    ["Variable", "Merkmal, das zwischen Personen, Klassen oder Situationen variieren kann."],
    ["Kontext", "Rahmenbedingungen, in denen Lernen stattfindet."],
    ["Moderation", "Dass ein Zusammenhang je nach Person, Kontext oder Bedingung anders ausfallen kann."],
    ["Evidenzprogramm", "Systematische Sammlung und Ordnung empirischer Befunde."],
  ],
  schluss: [
    ["Intelligenz", "Allgemeine kognitive Leistungsfähigkeit, die schulisches Lernen mit erklären kann."],
    ["Kognitive Fähigkeiten", "Spezifische Denk- und Lernvoraussetzungen, etwa Schlussfolgern oder Arbeitsgedächtnis."],
    ["Vorwissen", "Bereits vorhandenes fachliches oder sprachliches Wissen."],
    ["Gestufte Zugänge", "Drei unterschiedlich komplexe Einstiege: Kurs, Video und wissenschaftlicher Artikel."],
  ],
};

Object.assign(slideFunctions, {
  titel: {
    content: "Eröffnet die Leitfrage der gesamten Website: Gleiche Noten können diagnostisch Unterschiedliches bedeuten.",
    didactic: "Setzt Thema und Ton, bevor die curriculare Einordnung beginnt.",
  },
  "curriculum-einordnung": {
    content: "Verortet die Lehrprobe im 2. Semester der Vorlesung P2.1 Differentielle und Persönlichkeitspsychologie.",
    didactic: "Macht sichtbar, dass die Einheit Grundlagen für spätere pädagogische Psychologie, Diagnostik und Gutachten vorbereitet.",
  },
  "lehrveranstaltung-einordnung": {
    content: "Zeigt, wie die Sitzung in die Lehrveranstaltung Schulleistung verstehen eingebettet ist.",
    didactic: "Gibt einen Advance Organizer für die Kurslogik und entlastet die eigentliche Lehrprobe.",
  },
  "titel-lehrprobe-start": {
    content: "Markiert den Start des eigentlichen Lehrvortrags und wiederholt die Leitfrage.",
    didactic: "Trennt organisatorische Vorinformation von der Lehrprobe und bündelt Aufmerksamkeit.",
  },
  "gesellschaftspolitischer-start": {
    content: "Rahmt Schulübergänge als gesellschaftlich diskutierte und schulpsychologisch relevante Entscheidungsmomente.",
    didactic: "Schafft Relevanz durch einen authentischen öffentlichen Anlass.",
  },
  "auftrag-schulpsychologie": {
    content: "Zeigt Schullaufbahnberatung als Kernauftrag der Schulpsychologie.",
    didactic: "Verbindet den Fall mit beruflicher Verantwortung statt mit abstrakter Notenkritik.",
  },
  uebertrittsschwelle: {
    content: "Verbindet den Auftrag der Schulpsychologie mit der formalen Durchschnittsnote als institutioneller Entscheidungsschwelle.",
    didactic: "Erzeugt die Spannung zwischen rechtlicher Schwelle und diagnostischer Einzelfallberatung auf einer gemeinsamen Problemfolie.",
  },
  fall: {
    content: "Stellt Mira, Anna und Nina als Beratungsfälle mit gleichem Notendurchschnitt und gleicher Übergangsfrage vor.",
    didactic: "Macht die Problemfrage offen: Welche Daten fehlen, bevor eine Empfehlung verantwortbar ist?",
  },
  "didaktisches-konzept": {
    content: "Erklärt die sieben Phasen der Lehrprobe: Problemfall, Aktivierung, Begriff 1 interindividuell, Begriff 2 intraindividuell, Forschungsanker, Sicherung und Transfer.",
    didactic: "Macht die Lernbewegung explizit, damit die Seitenleiste als Orientierungshilfe genutzt werden kann.",
  },
  "aktivierung-1": {
    content: "Fordert eine erste Diagnosehypothese: Welche Daten braucht die Beratung zusätzlich zur Durchschnittsnote?",
    didactic: "Aktiviert Vorwissen und erzeugt einen eigenen Informationsbedarf vor der fachlichen Modellierung.",
  },
  studiumsanschluss: {
    content: "Verknüpft die Fallfrage mit Vorwissen aus dem Studium und späteren Anschlussstellen.",
    didactic: "Zeigt, warum die Einheit nicht isoliert ist, sondern in EWS, Didaktik, Diagnostik und Beratung wiederkehrt.",
  },
  lernziele: {
    content: "Benennt das zentrale Lernziel der Sitzung: Bedeutung individueller Unterschiede für die Schulpsychologie verstehen.",
    didactic: "Fokussiert die Aufmerksamkeit auf einen einzigen Zielpunkt.",
  },
  "live-klassen-demo": {
    content: "Visualisiert interindividuelle Unterschiede zwischen Schulen durch Mittelwert, Streuung und Outcome.",
    didactic: "Erlaubt eine Live-Manipulation, damit Vergleichsrahmen nicht nur erklärt, sondern gesehen werden.",
  },
  interventionspassung: {
    content: "Zeigt, dass Interventionen je nach individuellem Profil unterschiedlich gut passen können.",
    didactic: "Übersetzt individuelle Unterschiede in eine praktische Passungsfrage für Unterricht und Beratung.",
  },
  "vera-daten": {
    content: "Nutzt VERA 3 als Beispiel, dass interindividuelle Unterschiede aus Daten nicht automatisch lesbar sind.",
    didactic: "Begründet, warum Datenkompetenz und Training für Lehrkräfte diagnostisch wichtig sind.",
  },
  "highest-performance": {
    content: "Zeigt an Forschung zu Höchstleistung, dass Verläufe oft aussagekräftiger sind als aktuelle Einzelwerte.",
    didactic: "Stärkt die intraindividuelle Perspektive: Entwicklung über Zeit zählt für Beratung und Visible Learning.",
  },
  "gleiche-note": {
    content: "Spitzt zu, dass eine einzelne Note stabile Kompetenz, kurzfristigen Einbruch oder individuellen Fortschritt verdecken kann.",
    didactic: "Bereitet die intraindividuelle Live-Grafik vor, indem die Mehrdeutigkeit eines Einzelwerts sichtbar wird.",
  },
  "live-profile-demo": {
    content: "Visualisiert 18 Leistungsergebnisse im bayerischen Übergangszeugnis als unterschiedliche Verlaufsprofile bei gleichem Mittelwert.",
    didactic: "Macht durch den Profilregler erfahrbar, wie derselbe Durchschnitt diagnostisch verschiedene Geschichten enthalten kann.",
  },
  arbeitsmodell: {
    content: "Ordnet die Bedeutung individueller Unterschiede mit der Situated Expectancy-Value Theory als Arbeitsmodell.",
    didactic: "Formalisiert die Grundidee der Sitzung und verweist auf eine spätere vertiefende Vorlesung zu Motivation und Selbstkonzept.",
  },
  interindividuell: {
    content: "Sichert die interindividuelle Perspektive als Vergleich zwischen Lernenden.",
    didactic: "Verdichtet den Begriff in einer visuellen Frage: Wer unterscheidet sich von wem?",
  },
  intraindividuell: {
    content: "Sichert die intraindividuelle Perspektive als Vergleich einer Person mit sich selbst über Zeit, Aufgaben oder Situationen.",
    didactic: "Verdichtet den Begriff in einer visuellen Entwicklungsfrage.",
  },
  anwendung: {
    content: "Führt die Perspektiven zur Beratung zurück: Empfehlung braucht interindividuelle, intraindividuelle und Kontextinformationen.",
    didactic: "Sichert den Beratungsnutzen der Stunde an den Ausgangsfällen Mira, Anna und Nina.",
  },
  "visible-learning-ausblick": {
    content: "Verbindet die Perspektive mit dem Lehrbuchprojekt zur Erweiterung von Visible Learning mit John Hattie und Jens Möller.",
    didactic: "Öffnet wissenschaftlichen Transfer: Aus dem Fall wird eine breitere Evidenzfrage.",
  },
  schluss: {
    content: "Leitet zur nächsten Sitzung über Intelligenz und kognitive Fähigkeiten im Schulkontext über.",
    didactic: "Bietet drei zunehmend komplexe Einstiege und führt die Diagnoseperspektive weiter.",
  },
});

Object.assign(glossaryBySlide, {
  titel: [
    ["Differentielle Psychologie", "Beschreibt und erklärt Unterschiede zwischen Menschen und Unterschiede innerhalb einer Person."],
    ["Interindividuell", "Vergleich zwischen Personen, Klassen, Schulen oder Gruppen."],
    ["Intraindividuell", "Vergleich einer Person mit sich selbst über Zeit, Aufgaben, Fächer oder Situationen."],
    ["Schulpsychologie", "Psychologische Diagnostik, Beratung und Unterstützung im Schulsystem."],
  ],
  "curriculum-einordnung": [
    ["Curriculum", "Geplanter Zusammenhang von Studieninhalten, Lernzielen und späterer Professionalisierung."],
    ["P2.1", "Vorlesung Einführung in die Differentielle und Persönlichkeitspsychologie im zweiten Semester."],
    ["Pädagogische Psychologie", "Späterer Anschluss: Lernen, Motivation, Selbstkonzept und Entwicklung im Unterricht."],
    ["Gutachten", "Späterer Anschluss: Befunde begründet und adressatengerecht integrieren."],
  ],
  "lehrveranstaltung-einordnung": [
    ["Schulleistung", "Sichtbare und messbare Ergebnisse schulischen Lernens, zum Beispiel Noten, Tests oder Kompetenzen."],
    ["Bezugsnorm", "Maßstab, mit dem Leistung beurteilt wird: sozial, kriterial oder individuell."],
    ["Personmerkmal", "Merkmal einer lernenden Person, etwa Fähigkeit, Vorwissen, Motivation oder Selbstbild."],
    ["Diagnostisches Urteil", "Fachlich begründete Einschätzung auf Basis mehrerer Befunde."],
  ],
  "titel-lehrprobe-start": [
    ["Note", "Verdichtetes Leistungsurteil; ohne Kontext und Verlauf diagnostisch begrenzt."],
    ["Individuelle Unterschiede", "Unterschiede zwischen Lernenden oder innerhalb einer Person."],
    ["Beratung", "Professionelle Unterstützung einer Entscheidung durch Erheben, Deuten und Kommunizieren von Befunden."],
  ],
  "gesellschaftspolitischer-start": [
    ["Schulübergang", "Entscheidungsmoment zwischen Bildungswegen oder Schularten."],
    ["Übertrittszeugnis", "Zeugnis, das in Bayern für den weiteren Bildungsweg besonders bedeutsam ist."],
    ["Schullaufbahnberatung", "Beratung zur Passung von Bildungswegen, Voraussetzungen und Entwicklung."],
  ],
  "auftrag-schulpsychologie": [
    ["Kernauftrag", "Zentrale berufliche Aufgabe schulpsychologischer Praxis."],
    ["Eignung", "Einschätzung, ob Voraussetzungen, Entwicklung und Kontext zu einem Bildungsweg passen."],
    ["Diagnostische Befundlage", "Gesamtheit der Informationen, die eine Empfehlung stützen oder begrenzen."],
  ],
  uebertrittsschwelle: [
    ["Schullaufbahnberatung", "Beratung zur Frage, welcher Bildungsweg zu Voraussetzungen, Entwicklung und Kontext passt."],
    ["Entscheidungsschwelle", "Grenzwert, ab dem eine formale Entscheidung anders ausfällt."],
    ["Durchschnittsnote", "Mittelwert mehrerer Leistungsurteile; verdichtet viele Einzelinformationen."],
    ["Formale Eignung", "Administrativ definierte Eignung, die psychologische Beratung nicht ersetzt."],
  ],
  fall: [
    ["Beratungsfall", "Konkrete Situation, an der diagnostisches Denken geübt wird."],
    ["Notendurchschnitt", "Zusammenfassung mehrerer Noten in einer Zahl."],
    ["Informationsbedarf", "Zusätzliche Daten, die vor einer verantwortbaren Empfehlung fehlen."],
  ],
  "didaktisches-konzept": [
    ["Problemfall", "Warum reicht der Durchschnitt nicht?"],
    ["Aktivierung", "Welche Information fehlt?"],
    ["Begriff 1 interindividuell", "Wer unterscheidet sich von wem?"],
    ["Begriff 2 intraindividuell", "Wann unterscheidet sich eine Person von sich selbst?"],
    ["Forschungsanker", "Welche Evidenz und welches Modell begründen die Diagnoseperspektive?"],
    ["Sicherung", "Was folgt für Beratung?"],
    ["Transfer", "Wo geht die Frage weiter?"],
  ],
  "aktivierung-1": [
    ["Zusatzinformation", "Information, die über die Durchschnittsnote hinausgeht."],
    ["Klassenvergleich", "Einordnung einer Person im Vergleich zur Klasse oder Schule."],
    ["Verlauf", "Entwicklung eines Werts über Zeit."],
    ["Selbstkonzept", "Einschätzung der eigenen Fähigkeit in einem Bereich."],
  ],
  studiumsanschluss: [
    ["Vorwissen", "Wissen aus früheren Sitzungen oder Studienanteilen, an das neue Inhalte anschließen."],
    ["EWS", "Erziehungswissenschaftliches Studium mit psychologischen und pädagogischen Grundlagen."],
    ["Befundlage", "Welche Daten eine Empfehlung tatsächlich tragen."],
    ["Anschlussstelle", "Späterer Ort im Studium, an dem dieselbe Frage erneut relevant wird."],
  ],
  lernziele: [
    ["Lernziel", "Zentrale Aussage darüber, was nach der Einheit verstanden werden soll."],
    ["Individuelle Unterschiede", "Unterschiede zwischen Lernenden und Unterschiede innerhalb einer Person."],
    ["Schulpsychologische Bedeutung", "Relevanz eines Konzepts für Beratung, Diagnostik und Entscheidungen in der Schule."],
  ],
  "live-klassen-demo": [
    ["Interindividuelle Unterschiede", "Unterschiede zwischen Personen, Klassen oder Schulen."],
    ["Mittelwert", "Durchschnittliche Ausprägung eines Outcomes in einer Gruppe."],
    ["Streuung", "Wie stark Werte innerhalb einer Gruppe auseinanderliegen."],
    ["Outcome", "Ergebnisvariable, zum Beispiel Leistung, Motivation, Selbstkonzept oder Gewissenhaftigkeit."],
    ["Bezugsgruppe", "Gruppe, mit der eine Person verglichen wird."],
  ],
  interventionspassung: [
    ["Intervention", "Gezielte pädagogische oder psychologische Unterstützung."],
    ["Passung", "Übereinstimmung zwischen Maßnahme, Lernendenprofil und Situation."],
    ["Moderation", "Eine Wirkung hängt davon ab, für wen oder unter welchen Bedingungen sie auftritt."],
    ["Adaptivität", "Anpassung von Unterstützung an individuelle Voraussetzungen und Verläufe."],
  ],
  "vera-daten": [
    ["VERA 3", "Vergleichsarbeiten in der dritten Jahrgangsstufe mit standardisierten Kompetenzinformationen."],
    ["Datenkompetenz", "Fähigkeit, Daten zu lesen, zu deuten und auf pädagogische Fragen zu beziehen."],
    ["Interindividuelle Unterschiede", "Unterschiede zwischen Lernenden oder Gruppen in Leistungsdaten."],
    ["Informationsentnahme", "Erkennen, welche diagnostische Aussage aus einer Darstellung tatsächlich folgt."],
  ],
  "highest-performance": [
    ["Intraindividueller Verlauf", "Entwicklung einer Person über Zeit statt nur aktueller Stand."],
    ["Momentaufnahme", "Ein einzelner Wert zu einem Zeitpunkt."],
    ["Vorhersagekraft", "Ausmaß, in dem eine Information spätere Entwicklung erklärt."],
    ["Visible Learning", "Evidenzprogramm, das fragt, für wen und unter welchen Bedingungen etwas wirkt."],
  ],
  "gleiche-note": [
    ["Einzelnote", "Ein einzelner Leistungswert, der ohne Kontext leicht überinterpretiert wird."],
    ["Stabile Kompetenz", "Eine Note passt zu einem relativ konstanten Leistungsstand."],
    ["Kurzfristiger Einbruch", "Ein vorübergehender Leistungsabfall, der den üblichen Stand verdeckt."],
    ["Individueller Fortschritt", "Verbesserung im Vergleich zur eigenen früheren Leistung."],
  ],
  "live-profile-demo": [
    ["18 Leistungsergebnisse", "Mehrere Leistungsnachweise über das Schuljahr, die mehr zeigen als ein Durchschnitt."],
    ["Fachspezifisches Profil", "Leistungen fallen je nach Fach unterschiedlich aus."],
    ["Zeitmarker", "Markierung, wann ein Leistungsergebnis erhoben wurde."],
    ["Mittelwertgleichheit", "Gleicher Durchschnitt trotz sehr unterschiedlicher Einzelwerte und Verläufe."],
  ],
  arbeitsmodell: [
    ["SEVT", "Situated Expectancy-Value Theory: Modell zu Erwartungen, Werten, Zielen, Selbstkonzept und Kontext."],
    ["Erfolgserwartung", "Einschätzung, ob man eine Aufgabe erfolgreich bewältigen kann."],
    ["Subjektiver Aufgabenwert", "Bedeutung, Interesse, Nutzen oder Kosten, die eine Aufgabe für eine Person hat."],
    ["Interindividuell im Modell", "Linke Modellbereiche: Lernende bringen unterschiedliche Erfahrungen und Voraussetzungen mit."],
    ["Intraindividuell im Modell", "Mittlere Modellbereiche: dieselbe Person deutet Aufgaben je nach Situation unterschiedlich."],
  ],
  interindividuell: [
    ["Interindividuell", "Zwischen Personen: Wer unterscheidet sich von wem?"],
    ["Vergleichsfrage", "Diagnostische Frage nach Unterschieden zwischen Lernenden oder Gruppen."],
    ["Profil", "Muster mehrerer Merkmale einer Person oder Gruppe."],
  ],
  intraindividuell: [
    ["Intraindividuell", "Innerhalb einer Person: Wann oder wodurch unterscheidet sich eine Person von sich selbst?"],
    ["Entwicklungsfrage", "Diagnostische Frage nach Veränderung über Zeit, Aufgaben oder Situationen."],
    ["Schwankung", "Unterschiedliche Ausprägung desselben Merkmals innerhalb einer Person."],
  ],
  anwendung: [
    ["Empfehlung", "Beratungsbezogene Einschätzung, welche schulische Entscheidung verantwortbar ist."],
    ["Kontext", "Rahmenbedingungen wie Bezugsgruppe, Aufgabe, Klasse, Schule oder Familie."],
    ["Verantwortbarkeit", "Fachliche Begründbarkeit einer Empfehlung auf Basis ausreichender Befunde."],
  ],
  "visible-learning-ausblick": [
    ["Visible Learning", "Buch- und Evidenzprogramm zu Einflüssen auf Lernen und Leistung."],
    ["Variable", "Merkmal, das zwischen Personen, Klassen oder Situationen variieren kann."],
    ["Kontext", "Rahmenbedingungen, in denen Lernen stattfindet."],
    ["Moderation", "Ein Zusammenhang fällt je nach Person, Kontext oder Bedingung anders aus."],
  ],
  schluss: [
    ["Intelligenz", "Allgemeine kognitive Leistungsfähigkeit, die schulisches Lernen mit erklären kann."],
    ["Kognitive Fähigkeiten", "Spezifische Denk- und Lernvoraussetzungen, etwa Schlussfolgern oder Arbeitsgedächtnis."],
    ["Gestufte Zugänge", "Drei unterschiedlich komplexe Einstiege: Kurs, Video und wissenschaftlicher Artikel."],
  ],
});

delete slideFunctions.begriffe;
delete slideFunctions.evidenz;
delete glossaryBySlide.begriffe;
delete glossaryBySlide.evidenz;

function nearestSlideIndex() {
  if (!slides.length) return 0;

  const viewportAnchor = window.innerHeight * 0.42;
  let bestIndex = 0;
  let bestScore = Infinity;

  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    const distance = Math.abs(rect.top - viewportAnchor);
    const score = distance - visibleHeight * 0.18;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function updateChrome() {
  if (!slides.length) return;

  const index = nearestSlideIndex();
  const slide = slides[index];
  const talkIndex = index - talkStartIndex;
  const isTalkSlide = talkIndex >= 0;
  const progress = talkSlideCount <= 1 ? 1 : Math.max(0, talkIndex) / (talkSlideCount - 1);

  if (progressBar) progressBar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
  const slideLabel = isTalkSlide ? `Folie ${talkIndex + 1} / ${talkSlideCount}` : `Einordnung ${index + 1} / ${talkStartIndex}`;
  if (slideBadge) slideBadge.textContent = slideLabel;
  if (railSlideCounter) railSlideCounter.textContent = slideLabel;
  railQr?.classList.toggle("is-hidden", index > talkStartIndex);

  const stage = slide?.dataset.stage;
  const meta = stageMeta[stage] ?? stageMeta.problemfall;
  if (currentStage) currentStage.textContent = meta.label;
  if (currentSlideTitle) {
    currentSlideTitle.textContent = slide?.querySelector("h1")?.textContent ?? "Lehrvortrag";
  }
  if (currentStageNote) currentStageNote.textContent = meta.note;
  if (glossaryButtons.length) {
    const count = (glossaryBySlide[slide?.id] ?? []).length;
    glossaryButtons.forEach((button) => {
      button.title = `${count} Begriffe zur aktuellen Folie`;
    });
  }

  stageLinks.forEach((link) => {
    link.classList.toggle("is-active", isTalkSlide && link.dataset.stageLink === stage);
  });
}

let chromeUpdateFrame = 0;

function scheduleChromeUpdate() {
  if (chromeUpdateFrame) window.cancelAnimationFrame(chromeUpdateFrame);
  chromeUpdateFrame = window.requestAnimationFrame(() => {
    chromeUpdateFrame = 0;
    updateChrome();
  });
}

function closeRailInfo() {
  pathwayRail?.classList.remove("is-info-open");
  railInfoToggle?.setAttribute("aria-expanded", "false");
}

function toggleRailInfo() {
  if (!pathwayRail || !railInfoToggle) return;

  const isOpen = pathwayRail.classList.toggle("is-info-open");
  railInfoToggle.setAttribute("aria-expanded", String(isOpen));
}

function go(delta) {
  const index = nearestSlideIndex();
  const next = Math.max(0, Math.min(slides.length - 1, index + delta));
  slides[next].scrollIntoView({ behavior: "smooth", block: "start" });
}

function initLiveClassDemo() {
  const classMeanSlider = document.querySelector("#classMeanSlider");
  const classSpreadSlider = document.querySelector("#classSpreadSlider");
  const outcomeButtons = Array.from(document.querySelectorAll("[data-outcome]"));
  const outcomeTitle = document.querySelector("#liveOutcomeTitle");
  const profileSlider = document.querySelector("#profilePatternSlider");
  const profileLabels = Array.from(document.querySelectorAll(".live-profile-labels span"));
  const classPlot = document.querySelector("#liveClassPlot");
  const timelinePlot = document.querySelector("#liveTimelinePlot");

  if (!classPlot && !timelinePlot) return;

  let activeOutcome = "leistung";
  const distributionShape = [-1.55, -1.28, -1.06, -0.88, -0.72, -0.57, -0.42, -0.28, -0.14, 0, 0.13, 0.27, 0.41, 0.56, 0.71, 0.87, 1.05, 1.25, 1.48, 1.7, 1.94, 2.18];
  const outcomeMeta = {
    leistung: {
      title: "Leistung im Schul- und Klassenkontext",
      axis: "Ausprägung des Leistungsoutcomes",
      low: "niedriger",
      high: "höher",
      hero: "Ø 2,2",
      preset: { mean: 10, spread: 42 },
    },
    motivation: {
      title: "Motivation im Schul- und Klassenkontext",
      axis: "Ausprägung der Motivation",
      low: "geringer",
      high: "stärker",
      hero: "aktuell ähnlich",
      preset: { mean: -12, spread: 32 },
    },
    selbstkonzept: {
      title: "Akademisches Selbstkonzept im Schul- und Klassenkontext",
      axis: "Ausprägung des akademischen Selbstkonzepts",
      low: "niedriger",
      high: "höher",
      hero: "aktuell ähnlich",
      preset: { mean: 18, spread: 24 },
    },
    gewissenhaftigkeit: {
      title: "Gewissenhaftigkeit im Schul- und Klassenkontext",
      axis: "Ausprägung der Gewissenhaftigkeit",
      low: "geringer",
      high: "stärker",
      hero: "aktuell ähnlich",
      preset: { mean: 0, spread: 76 },
    },
  };
  const subjects = ["D", "M", "D", "H", "D", "D", "M", "D", "H", "D", "D", "M", "D", "H", "D", "D", "M", "H"];
  const timeLabels = ["Sep", "Sep", "Okt", "Okt", "Nov", "Nov", "Dez", "Dez", "Jan", "Jan", "Feb", "Feb", "Mär", "Mär", "Apr", "Apr", "Mai", "Mai"];
  const subjectMeta = {
    D: { label: "Deutsch", color: "#6a2f1d" },
    M: { label: "Mathe", color: "#315f8f" },
    H: { label: "Heimatkunde", color: "#4c7b55" },
  };
  const meanTarget = 58;

  const makeSvg = (tag, attrs = {}) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  const scoreToX = (score) => 80 + ((score - 30) / 60) * 740;
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const normalizeMean = (values) => {
    const shift = meanTarget - mean(values);
    return values.map((value) => value + shift);
  };
  const profileX = (index) => 92 + index * 41.8;
  const profileY = (value) => 302 - ((value - 44) / 28) * 210;
  const pathForProfile = (values) => values.map((value, index) => `${index === 0 ? "M" : "L"} ${profileX(index)} ${profileY(value)}`).join(" ");
  const profileExamples = [
    {
      label: "Profil: stabil um den Durchschnitt",
      values: normalizeMean([57.5, 58.2, 58.1, 58.7, 57.9, 58.4, 57.6, 58.3, 58.8, 57.8, 58.2, 57.7, 58.1, 58.9, 57.9, 58.2, 57.8, 58.7]),
    },
    {
      label: "Profil: schwächer begonnen, später besser",
      values: normalizeMean([50, 49, 51, 50, 52, 53, 54, 55, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67]),
    },
    {
      label: "Profil: starke Unterschiede zwischen Fächern",
      values: normalizeMean([58, 49, 59, 67, 57, 58, 50, 59, 66, 58, 59, 50, 58, 67, 57, 58, 49, 66]),
    },
    {
      label: "Profil: starke Schwankungen innerhalb der Fächer",
      values: normalizeMean([50, 67, 65, 48, 61, 49, 52, 66, 63, 47, 64, 50, 52, 68, 49, 65, 67, 51]),
    },
  ];

  function interpolatedProfile() {
    const sliderValue = Number(profileSlider.value);
    const lowerIndex = Math.floor(sliderValue);
    const upperIndex = Math.min(profileExamples.length - 1, lowerIndex + 1);
    const mix = sliderValue - lowerIndex;
    return profileExamples[lowerIndex].values.map((value, index) => value * (1 - mix) + profileExamples[upperIndex].values[index] * mix);
  }

  function distributionScores(meanValue, spreadValue) {
    return distributionShape.map((z, index) => meanValue + z * spreadValue + Math.sin(index * 1.7) * 0.7);
  }

  function drawClassPlot() {
    if (!classPlot || !classMeanSlider || !classSpreadSlider) return;

    const meta = outcomeMeta[activeOutcome];
    const meanDifference = Number(classMeanSlider.value);
    const spread = 4 + Number(classSpreadSlider.value) * 0.14;
    const miraMean = 56 - meanDifference * 0.55;
    const annaMean = 56;
    const ninaMean = 56 + meanDifference * 0.55;
    const miraScores = distributionScores(miraMean, spread);
    const annaScores = distributionScores(annaMean, spread);
    const ninaScores = distributionScores(ninaMean, spread);
    const miraScore = 58;
    const annaScore = 58;
    const ninaScore = 58;

    if (outcomeTitle) outcomeTitle.textContent = meta.title;
    classPlot.replaceChildren();
    classPlot.append(
      makeSvg("line", { x1: 80, y1: 435, x2: 820, y2: 435, class: "live-guide-line" }),
      makeSvg("text", { x: 80, y: 468, class: "live-axis-label" }),
      makeSvg("text", { x: 748, y: 468, class: "live-axis-label" }),
      makeSvg("text", { x: 274, y: 40, class: "live-plot-label" })
    );
    classPlot.children[1].textContent = meta.low;
    classPlot.children[2].textContent = meta.high;
    classPlot.children[3].textContent = meta.axis;

    [
      { label: "Miras Schule A / Klasse 4a", scores: miraScores, meanValue: miraMean, row: 118, color: "#dfe8df", stroke: "#aebbad", hero: miraScore, name: "Mira", heroColor: "#6a2f1d" },
      { label: "Annas Schule B / Klasse 4b", scores: annaScores, meanValue: annaMean, row: 252, color: "#f4e5d9", stroke: "#d6b39c", hero: annaScore, name: "Anna", heroColor: "#b6784b" },
      { label: "Ninas Schule C / Klasse 4c", scores: ninaScores, meanValue: ninaMean, row: 386, color: "#e9edf4", stroke: "#b4c1d1", hero: ninaScore, name: "Nina", heroColor: "#315f8f" },
    ].forEach((group) => {
      const label = makeSvg("text", { x: 74, y: group.row - 38, class: "live-plot-label" });
      label.textContent = group.label;
      classPlot.append(label);
      classPlot.append(makeSvg("line", { x1: scoreToX(group.meanValue), y1: group.row - 42, x2: scoreToX(group.meanValue), y2: group.row + 42, class: "live-mean-line" }));

      group.scores.forEach((score, index) => {
        classPlot.append(makeSvg("circle", {
          cx: scoreToX(score),
          cy: group.row + ((index % 5) - 2) * 9,
          r: 9,
          fill: group.color,
          stroke: group.stroke,
          "stroke-width": 1,
        }));
      });

      classPlot.append(makeSvg("circle", { cx: scoreToX(group.hero), cy: group.row, r: 17, fill: group.heroColor }));
      const heroLabel = makeSvg("text", { x: scoreToX(group.hero) + 20, y: group.row + 5, class: "live-plot-label" });
      heroLabel.textContent = `${group.name}: ${meta.hero}`;
      const meanLabel = makeSvg("text", { x: scoreToX(group.meanValue) + 10, y: group.row + 58, class: "live-muted-label" });
      meanLabel.textContent = "Gruppenmittel";
      classPlot.append(heroLabel);
      classPlot.append(meanLabel);
    });
  }

  function drawTimeline() {
    if (!timelinePlot || !profileSlider) return;

    const values = interpolatedProfile();
    const nearestProfileIndex = Math.round(Number(profileSlider.value));
    const meanY = profileY(meanTarget);

    timelinePlot.replaceChildren();
    profileLabels.forEach((label, index) => label.classList.toggle("is-active", index === nearestProfileIndex));

    const titleNode = makeSvg("text", { x: 70, y: 34, class: "live-plot-label" });
    titleNode.textContent = profileExamples[nearestProfileIndex].label;
    timelinePlot.append(titleNode);
    const meanLabel = makeSvg("text", { x: 690, y: 34, class: "live-plot-label" });
    meanLabel.textContent = "Mittelwert immer 2,2";
    timelinePlot.append(meanLabel);

    timelinePlot.append(
      makeSvg("line", { x1: 70, y1: 320, x2: 830, y2: 320, class: "live-guide-line" }),
      makeSvg("line", { x1: 70, y1: 70, x2: 70, y2: 320, class: "live-guide-line" }),
      makeSvg("line", { x1: 70, y1: meanY, x2: 830, y2: meanY, class: "live-mean-line" })
    );

    const meanText = makeSvg("text", { x: 770, y: meanY - 8, class: "live-muted-label" });
    meanText.textContent = "Ø 2,2";
    timelinePlot.append(meanText);
    timelinePlot.append(makeSvg("path", { d: pathForProfile(values), class: "live-mira-line" }));

    values.forEach((value, index) => {
      const subject = subjectMeta[subjects[index]];
      const x = profileX(index);
      const y = profileY(value);
      timelinePlot.append(makeSvg("circle", { cx: x, cy: y, r: 7.5, fill: subject.color }));
      const valueLabel = makeSvg("text", { x: x - 5, y: y - 11, class: "live-time-label" });
      valueLabel.textContent = String(index + 1);
      timelinePlot.append(valueLabel);
      const monthLabel = makeSvg("text", { x: x - 10, y: 350, class: "live-time-label" });
      monthLabel.textContent = timeLabels[index];
      timelinePlot.append(monthLabel);
      const subjectLabel = makeSvg("text", { x: x - 3.5, y: 375, class: "live-subject-label" });
      subjectLabel.textContent = subjects[index];
      timelinePlot.append(subjectLabel);
    });

    [
      { key: "D", x: 78 },
      { key: "M", x: 200 },
      { key: "H", x: 318 },
    ].forEach((item) => {
      const meta = subjectMeta[item.key];
      timelinePlot.append(makeSvg("circle", { cx: item.x, cy: 410, r: 5.5, fill: meta.color }));
      const label = makeSvg("text", { x: item.x + 10, y: 414, class: "live-muted-label" });
      label.textContent = `${item.key} ${meta.label}`;
      timelinePlot.append(label);
    });
  }

  function updateLiveDemo() {
    drawClassPlot();
    drawTimeline();
  }

  classMeanSlider?.addEventListener("input", updateLiveDemo);
  classSpreadSlider?.addEventListener("input", updateLiveDemo);
  profileSlider?.addEventListener("input", updateLiveDemo);
  outcomeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeOutcome = button.dataset.outcome ?? "leistung";
      outcomeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      const preset = outcomeMeta[activeOutcome]?.preset;
      if (preset && classMeanSlider && classSpreadSlider) {
        classMeanSlider.value = String(preset.mean);
        classSpreadSlider.value = String(preset.spread);
      }
      updateLiveDemo();
    });
  });
  updateLiveDemo();
}

function openLightboxSource({ src, alt = "Vergrößerte Abbildung", focus = "", trigger = null }) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxTrigger = trigger;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = alt;
  lightboxFigure?.classList.toggle("is-focus-center", focus === "center");
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxFigure?.focus();
}

function openLightbox(image) {
  openLightboxSource({
    src: image.currentSrc || image.src,
    alt: image.alt || "Vergrößerte Abbildung",
    focus: image.dataset.lightboxFocus,
    trigger: image,
  });
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxFigure?.classList.remove("is-focus-center");
  document.body.classList.remove("lightbox-open");
  lightboxTrigger?.focus();
  lightboxTrigger = null;
}

function glossaryIsOpen() {
  return glossaryPopover?.classList.contains("is-open");
}

function renderGlossary(slide) {
  if (!glossaryTitle || !glossarySlideTitle || !glossaryFunctions || !glossaryTerms) return;

  const terms = glossaryBySlide[slide?.id] ?? [];
  const functions = slideFunctions[slide?.id];
  glossaryTitle.textContent = "Funktionen & Begriffe";
  glossarySlideTitle.textContent = slide?.querySelector("h1")?.textContent ?? "Aktuelle Folie";
  glossaryFunctions.replaceChildren();
  glossaryTerms.replaceChildren();

  [
    ["Inhaltliche Funktion", functions?.content ?? "Diese Folie trägt einen inhaltlichen Schritt der Lehrprobe."],
    ["Didaktische Funktion", functions?.didactic ?? "Diese Folie unterstützt Orientierung, Aktivierung oder Sicherung im Lernprozess."],
  ].forEach(([label, text]) => {
    const article = document.createElement("article");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    h3.textContent = label;
    p.textContent = text;
    article.append(h3, p);
    glossaryFunctions.append(article);
  });

  if (terms.length) {
    const termsHeading = document.createElement("dt");
    termsHeading.className = "glossary-terms-heading";
    termsHeading.textContent = terms.length === 1 ? "Begriff" : "Begriffe";
    glossaryTerms.append(termsHeading);
  }

  terms.forEach(([term, definition]) => {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = definition;
    glossaryTerms.append(dt, dd);
  });
}

function openGlossary() {
  if (!glossaryPopover) return;

  glossaryTrigger = document.activeElement;
  renderGlossary(slides[nearestSlideIndex()]);
  glossaryPopover.classList.add("is-open");
  glossaryPopover.setAttribute("aria-hidden", "false");
  glossaryButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
  document.body.classList.add("glossary-open");
  glossaryCard?.focus();
}

function closeGlossary() {
  if (!glossaryPopover) return;

  glossaryPopover.classList.remove("is-open");
  glossaryPopover.setAttribute("aria-hidden", "true");
  glossaryButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
  document.body.classList.remove("glossary-open");
  glossaryTrigger?.focus();
  glossaryTrigger = null;
}

document.querySelectorAll(".deck img").forEach((image) => {
  if (image.dataset.noLightbox === "true") return;

  image.setAttribute("tabindex", "0");
  image.setAttribute("role", "button");
  image.setAttribute("title", "Zum Vergrößern klicken");
  image.addEventListener("click", () => openLightbox(image));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(image);
    }
  });
});

document.querySelectorAll("[data-lightbox-src]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLightboxSource({
      src: trigger.dataset.lightboxSrc,
      alt: trigger.dataset.lightboxAlt || trigger.textContent.trim() || "Vergrößerte Abbildung",
      focus: trigger.dataset.lightboxFocus,
      trigger,
    });
  });
});

document.querySelectorAll("[data-lightbox-close]").forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

glossaryButtons.forEach((button) => {
  button.addEventListener("click", openGlossary);
});

railInfoToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleRailInfo();
});

document.addEventListener("click", (event) => {
  if (!pathwayRail?.classList.contains("is-info-open")) return;
  if (pathwayRail.contains(event.target)) return;
  closeRailInfo();
});

document.querySelectorAll("[data-glossary-close]").forEach((button) => {
  button.addEventListener("click", closeGlossary);
});

document.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
document.querySelector("[data-next]")?.addEventListener("click", () => go(1));
document.querySelector("[data-fullscreen]")?.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

const activationResponse = document.querySelector("#activationResponse");
if (activationResponse) {
  const storageKey = "lmu-lehrprobe-activation-response";
  activationResponse.value = localStorage.getItem(storageKey) ?? "";
  activationResponse.addEventListener("input", () => {
    localStorage.setItem(storageKey, activationResponse.value);
  });
  activationResponse.addEventListener("keydown", (event) => {
    event.stopPropagation();
  });
}

window.addEventListener("scroll", scheduleChromeUpdate, { passive: true });
window.addEventListener("resize", scheduleChromeUpdate);
window.addEventListener("load", scheduleChromeUpdate);
window.addEventListener("hashchange", scheduleChromeUpdate);
document.querySelectorAll(".slide img").forEach((image) => {
  if (!image.complete) {
    image.addEventListener("load", scheduleChromeUpdate, { once: true });
  }
});
window.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isEditable = activeElement?.matches?.("input, textarea, select, [contenteditable='true']");
  if (isEditable) return;

  if (lightbox?.classList.contains("is-open")) {
    if (event.key === "Escape" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      closeLightbox();
    }
    return;
  }

  if (event.key === "Escape" && pathwayRail?.classList.contains("is-info-open")) {
    closeRailInfo();
    return;
  }

  if (glossaryIsOpen()) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeGlossary();
    }
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(event.key)) {
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
  if (event.key === "Home") {
    event.preventDefault();
    slides[0].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (event.key === "End") {
    event.preventDefault();
    slides.at(-1).scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

initLiveClassDemo();
scheduleChromeUpdate();
