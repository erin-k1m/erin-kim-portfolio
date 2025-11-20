## Summary

This is a small, static, single-page portfolio site. It's organized around a "bookshelf" visual metaphore implemented in markup, CSS, and a single client-side script.

Use this file to guide code-writing agents so changes are safe, targeted, and immediately testable in-browser.

## Big picture (what to know before editing)

- Architecture: static files only — `index.html`, `style.css`, `script.js`, and an `images/` folder. There is no build system, package manager, or server-side code in the repo.
- Interaction pattern: DOM nodes in `index.html` (book wrappers with `data-project="..."`) map to entries in the `projects` object in `script.js`. Click a `.book-wrapper` to open the inspector overlay.
- Visual pattern: `style.css` uses CSS custom properties per `.book-wrapper` (e.g. `--book-tilt`, `--rand`, and `--thickness`) to vary appearance. Preserve those names when modifying per-book styling.

## Files to reference (quick pointers)

- `index.html` — the HTML structure. Add/remove books by editing the `.book-wrapper` elements and their `data-project` attributes.
- `script.js` — the `projects` object stores project metadata (title, image path, description). Example entry:

  project1: { title: "Ocean Painting", image: "images/ocean.jpg", description: "Watercolor study of waves." }

  If you add a `.book-wrapper` with `data-project="project9"`, add a matching `project9` entry in `script.js`.

- `style.css` — the single stylesheet. Per-book variations are done using CSS custom properties set on `.book-wrapper:nth-child(n) .book`. Keep existing variable names if you want consistent behavior.

## Common edits and exact examples

- Add a project (safe minimal steps):
  1. In `index.html` add a `.book-wrapper` with `data-project="projectX"` inside the shelf you want.
  2. In `script.js` add `projectX: { title: "Title", image: "images/<file>.jpg", description: "..." }`.
  3. Put the referenced image file in `images/` and confirm the filename.

- Change project text or image: update the `projects` object in `script.js` (no HTML structure changes required for content-only edits).

- Adjust per-book tilt/thickness: edit or add `--rand` and/or `--book-tilt` values in `style.css` under `.book-wrapper:nth-child(n) .book { --rand: ... }`.

## How to run and test locally

- No build step. Open `index.html` directly in a browser, or run a simple static server from the repo root to avoid CORS issues when testing images:

  python3 -m http.server 8000

  Then open `http://localhost:8000`.

## Conventions and gotchas (project-specific)

- `data-project` is the single source-of-truth link between HTML and JS — keep names consistent and avoid renaming without updating both files.
- `images/` is the canonical image location; `script.js` uses relative paths like `images/ocean.jpg`. Add new images there.
- `style.css` centralizes all visual rules. The stylesheet uses CSS custom properties to produce per-book differences; avoid renaming these variables unless you update all occurrences.
- The inspector overlay sets `inspectImage.src` directly from project entries. Make sure image paths are correct and include accessible `alt` text where appropriate (the current overlay has empty alt — consider filling it when adding images).

## What not to do without testing

- Do not change layout or transform rules in `style.css` without visually testing in a browser. Small transform changes can break the shelf appearance and interactions.
- Do not rename `inspector` element IDs (`inspector`, `inspectTitle`, `inspectImage`, `inspectDescription`, `closeInspector`) without updating `script.js` — the JS selects these IDs directly.

## Quick troubleshooting hints

- If clicking a book shows a blank inspector: confirm `data-project` value matches a key in `script.js` and the referenced `image` file exists in `images/`.
- If styles appear broken: check for accidental removal of `transform-style: preserve-3d`, `perspective` on `.book-wrapper`, or per-book CSS variables.

## When to ask the repo owner

- If you need to add a build system, test harness, or deploy pipeline — ask. This repository is intentionally static and small; adding tooling is a non-trivial structural change.

---

If you'd like, I can also add a tiny CONTRIBUTING or developer README with the exact local test commands and a checklist for adding a new project (HTML snippet + script.js entry + image). Want me to add that next?
