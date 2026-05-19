# Main Talk HTML Maintenance Guide

This folder is the hand-maintainable version of the Tuebingen talk. If a task refers to `web.html`, treat this folder's `index.html` as the current editable web talk unless an actual `web.html` file is added later.

## Files

- `index.html`: the slide content and slide order. This is the main file to edit.
- `style.css`: the shared visual language and slide-specific layouts.
- `script.js`: lightweight navigation, progress, fullscreen, and dialog behavior.
- `assets/`: curated assets that belong to this maintainable talk.
- `../jansen_tuebingen_talk_html/`: older/generated source deck with extracted media and a data-driven renderer. Use it as an asset/media source, not as the first place for hand edits.

## Current Architecture

The maintainable talk is plain HTML/CSS/JS. Slides are vertical full-screen sections:

```html
<section class="slide ..." id="stable-slide-id" data-stage="stage-name">
  ...
</section>
```

The script finds every `.slide` in DOM order, updates the top progress bar, updates the `Slide N` badge, highlights the stage rail using `data-stage`, and wires `[data-open]` buttons to matching `<dialog>` elements.

Do not assume there is a build step. Edits should work by opening `index.html` directly or serving the folder locally.

## Design Language

The talk has a restrained editorial research style:

- Eggshell page background: `--paper: #fdfcfc`.
- Black text, warm gray secondary text, pale gray hairline rules.
- Serif display headings via `--display` and sans-serif UI/body via `--ui`.
- Cards are mostly white or translucent white, with 18-22px radius, `1px` hairline borders, and the shared `--shadow`.
- Accent color is used sparingly: blue `--blue` for active/highlight states, coral only for rare challenge emphasis.
- Avoid saturated table headers, dense blue fills, decorative gradients, and mobile-app patterns. This is a beamer/large-screen talk.
- The talk is intentionally not mobile-first. `html, body` have `min-width: 1180px`.

## Core Slide Chrome

Every page gets:

- fixed `.topbar` with the Jansen brand,
- fixed `.progress` / `#progressBar`,
- optional `.pathway-rail` after the structure slide,
- full-height `.slide` sections with `height: 100vh`, `min-height: 720px`, and `scroll-snap-align: start`.

Avoid custom topbars or per-slide progress elements. Use the existing chrome.

## Stages And Navigation

Valid `data-stage` values currently used:

- `opening`
- `needs`
- `development`
- `pilot`
- `efficacy`
- `effectiveness`
- `scaling`
- `theory`

The right-side pathway rail uses links with `data-stage-link`. If you add a new stage, update both the rail in `index.html` and `script.js` assumptions only if necessary. If you add a normal slide inside an existing stage, simply set `data-stage` correctly.

The rail is hidden automatically on:

- `.structure` slides,
- `.learning-progression` slides,
- slides that contain `.mini-pathway`.

## Existing Slide Patterns

Prefer these patterns before inventing a new one.

### Section / Roadmap

Use `.structure`, `.cycle-card`, `.stage-row`, `.mini-pathway`, `.evidence-step`.

Best for: talk structure, study-stage transitions, “where are we?” slides.

### Evidence Overview

Use `.evidence-step` with `.mini-pathway` and either `.evidence-boxes`, `.needs-frame`, `.needs-group`, `.basis-frame`, or `.basis-group`.

Best for: grouped study evidence, literature-to-method transitions.

### Interim Conclusion

Use `.interim` and `.interim-summary`.

Best for: literature connection / challenge / contribution summaries.

### Image-Dominant Slide

Use `.image-slide`, `.wide-figure`, `.full-model`, `.formative-picture`, `.trace-tool figure`, or `.feedback-model-figure`.

Best for: models, screenshots, diagrams, procedure graphics.

### Two-Card / Multi-Card Layout

Use `.two-cards`, `.study-card`, `.corpus-card`, `.project-grid`, `.feedback-claims`, `.challenge-cards`.

Best for: side-by-side studies, claims, project details, challenges.

### Project / Grant Slide

Use `.project`, `.supporter-logos`, `.project-grid`, `.people-strip`.

Best for: grant acquisition, team, funder logos.

### PISA / Task Slide

Use `.pisa`, `.pisa-grid`, `.compact`.

Best for: task screenshots and short dataset facts.

### Modal Detail

Use native dialogs:

```html
<button type="button" data-open="modal-id">...</button>
<dialog id="modal-id" class="modal">
  <button type="button" data-close>Close</button>
  ...
</dialog>
```

`script.js` wires these automatically. For very large scrollable images, confirm browser support in the target environment; if native `<dialog>` is not enough, use the CSS `:target` pattern from the slide-builder prototype.

## Tables

Tables should look like the talk, not like copied PowerPoint tables:

- white or near-white card,
- hairline gray dividers,
- muted uppercase headers,
- subtle alternating pale rows only if needed,
- no saturated teal/blue header bands unless the surrounding slide already uses that exact visual language.

Recommended base:

```html
<table class="talk-table">
  <caption>Short descriptive caption</caption>
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

If adding a new table style, define it once in `style.css` and reuse it. Do not inline styles.

## Asset Rules

- Put new durable assets in `assets/` when they belong to this maintainable deck.
- It is okay for existing slides to reference `../jansen_tuebingen_talk_html/assets/...`; this deck already does that heavily.
- For new slides, prefer copying curated assets into this folder's `assets/` so future moves are less brittle.
- Use descriptive filenames, e.g. `pisa_paste_events_quality.png`, not `image42.png`.
- Always write meaningful `alt` text.

## Editing Workflow For Future Agents

1. Identify the target slide by `id`, not visual order.
2. Read the relevant HTML section and nearby CSS before editing.
3. Reuse an existing slide pattern where possible.
4. Keep changes scoped: content in `index.html`, shared presentation rules in `style.css`, behavior in `script.js`.
5. If a slide-builder prototype exists, port only the approved content/style into this main deck.
6. Do not paste full screenshot slides when text or tables should be selectable HTML.
7. After editing, verify at a beamer viewport, at minimum `1280x720`; preferably also `1600x900`.
8. Check that the topbar, slide badge, pathway rail, and dialogs still behave.

## Local Preview

From this folder:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/
```

Opening `index.html` directly also works for static slides, but local serving is better for browser checks.

## Structural Notes

There are two talk implementations:

- `jansen_tuebingen_talk_html/`: older generated deck. It has a tiny `index.html`, a large `slides-data.js`, a large `app.js`, and a very large `style.css`. It is harder to hand edit because rendering logic and generated slide data interact.
- `jansen_tuebingen_talk_html_maintainable/`: current hand-editable deck. Prefer this for future production work.

The slow part of editing is structural: presentation content, layout, and QA all happen in raw HTML/CSS. To keep work fast, iterate new slides in `jansen_tuebingen_talk_slide_builder/`, then integrate approved slides into this maintainable deck using the patterns above.

## Common Pitfalls

- Do not add a new slide without an `id` and `data-stage`.
- Do not use mobile layout assumptions; this deck is for large screens.
- Do not create one-off CSS unless an existing class cannot reasonably handle the slide.
- Do not let long text push content below the 16:9 viewport; reduce copy before reducing typography.
- Do not leave dialog content inaccessible: provide a close button and clear `alt` text.
- Do not hand-edit the generated `slides-data.js` deck unless the task explicitly targets that implementation.

