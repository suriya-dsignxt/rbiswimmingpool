# Rebuild Infraa — Pixel-Faithful Static Website Clone

This project is a static HTML/CSS/JS implementation based on the supplied screenshots for the Rebuild Infraa swimming pool landing page.

## Files

```text
rebuild-infraa-pool-clone/
├── index.html
├── styles.css
├── main.js
├── README.md
└── assets/
    ├── logo-rbi.svg
    ├── hero-pool.svg
    ├── portrait-magesh.svg
    ├── pool-skimmer.svg
    ├── pool-overflow.svg
    ├── pool-infinity.svg
    ├── pool-concrete.svg
    ├── pool-prefab.svg
    ├── pool-kids.svg
    ├── pool-renovation.svg
    ├── pool-maintenance.svg
    ├── gallery-1.svg
    ├── gallery-2.svg
    ├── gallery-3.svg
    ├── gallery-4.svg
    └── video-pool.svg
```

## Sections Implemented

1. Hero + header navigation
2. Why Chennai Chooses Us feature collage
3. Pool Types We Build cards
4. Who We Build For grid
5. Our Process timeline
6. Engineering-led authority section
7. Comparison table
8. Site Stories gallery
9. Video preview section
10. Client testimonials
11. FAQ accordion
12. Free Pool Design lead form
13. Final CTA
14. Footer

## Component Class Names

- Header: `.site-header`, `.brand`, `.main-nav`, `.menu-toggle`
- Hero: `.hero`, `.hero-bg`, `.hero-overlay`, `.hero-content`, `.hero-tags`, `.hero-actions`
- Generic headings: `.center-head`, `.pill`, `.section-subtitle`, `.light-head`
- Cards: `.why-card`, `.pool-card`, `.testimonial-card`
- Forms: `.quote-form`, `.form-grid`, `.is-invalid`
- CTA/buttons: `.btn`, `.btn-gold`, `.btn-light`, `.btn-blue`, `.btn-call`, `.btn-submit`
- FAQ: `.faq-list`, `.faq-item`, `.faq-answer`
- Footer: `.site-footer`, `.footer-grid`, `.footer-brand`, `.footer-bottom`

## Assets Used

The supplied screenshots were used as visual references. Since original production image files were not supplied separately, local SVG placeholders are included for all photo areas and the logo. Replace SVG files in `/assets` with the final brand images using the same file names to keep layout intact.

## How to Run Locally

Open `index.html` directly in a browser, or run a local server:

```bash
cd rebuild-infraa-pool-clone
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Exactness Verification Notes

Primary desktop reference: the screenshots supplied in sequence.

Recommended checks:

- Header/logo/nav alignment within ±3–5px on the main desktop viewport.
- Section heading alignment and vertical spacing within ±3–5px.
- Card widths, row spacing, border radius, and table column proportions within ±3–5px.
- FAQ first item should open by default.
- Lead form grid should match the two-column screenshot layout on desktop and stack cleanly on mobile.

## Accessibility Notes

- Semantic sections and headings are used.
- Navigation has an `aria-label`.
- Mobile menu button uses `aria-expanded`.
- FAQ items are keyboard-clickable buttons.
- Form fields use visible labels and required validation.
- Decorative SVG icons are contained in reusable symbols.
