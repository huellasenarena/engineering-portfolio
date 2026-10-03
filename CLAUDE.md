# CLAUDE.md — Engineering Portfolio (jackstefoto.com)

Personal portfolio site for **Jack Stefanou**, a full-stack developer specializing in AI.
Goal: convince technical recruiters and hiring managers, in ~30 seconds, that he builds
real end-to-end products — and can explain them clearly. Targeting on-site roles in
Bogotá, Colombia (nearshoring market). Reads as **an engineer who builds**, not a teacher.

- **Live:** https://jackstefoto.com (also https://huellasenarena.github.io/engineering-portfolio/)
- **Repo:** https://github.com/huellasenarena/engineering-portfolio
- **Owner GitHub:** `huellasenarena` (NOT `JNS99` — that was an early mistake, now corrected)

---

## Tech stack

- **Astro** (static output, zero JS by default) + **vanilla CSS** (scoped per component). No CSS framework, no build-heavy tooling.
- **i18n:** built-in Astro i18n. Spanish default at `/`, English at `/en/`. Language toggle in header.
- **Fonts:** Georgia (system) for everything + system mono for technical bits. No web fonts.
- **Styles:** `src/styles/tokens.css` + `base.css` are COPIES from `~/Desktop/estilo` (run `~/Desktop/estilo/sync.sh src/styles`; don't edit them here). Portfolio-only rules go in `global.css` or component `<style>`.
- **Hosting:** GitHub Pages via GitHub Actions. **Node 22 required** (Astro needs >=22.12; CI uses 22 — do not drop to 20, it fails the build).

```bash
npm run dev      # local dev at localhost:4321 (/ = ES, /en/ = EN)
npm run build    # static build into dist/
npm run preview  # preview the built site
```

Deploy is automatic: push to `main` → `.github/workflows/deploy.yml` builds and publishes.

---

## Project structure

```
src/
├── i18n/
│   ├── ui.ts            # ALL UI strings (es + en). Single source of truth for copy.
│   └── utils.ts         # getLangFromUrl, useTranslations(t), getAlternateUrl, pageUrl(page, lang)
├── data/
│   └── projects.ts      # Project[] data + CaseStudyContent model + projectUrl() helper
├── layouts/
│   └── Layout.astro     # <head>: SEO, Open Graph, canonical, hreflang, favicons
├── components/
│   ├── Header.astro     # static text nav (QMP-style), `current` prop underlines the active page, ES / EN at the right
│   ├── Hero.astro       # home: tagline + photo SLIDESHOW below (uncropped, object-fit: contain)
│   ├── Projects.astro   # list (<ul>) of ProjectCard
│   ├── ProjectCard.astro# list item: title link (case study / live site) + one line + stack in mono
│   ├── CaseStudy.astro  # full case-study renderer (used by the dedicated pages)
│   ├── About.astro      # short bio + languages (list with thin lines)
│   └── Contact.astro    # LinkedIn / GitHub / CV links (some disabled placeholders)
└── pages/
    ├── index.astro              # ES home (Hero only)        ↔ en/index.astro
    ├── proyectos/index.astro    # ES projects list            ↔ en/projects/index.astro
    ├── proyectos/[slug].astro   # ES case studies             ↔ en/projects/[slug].astro
    ├── sobre-mi.astro           # ES about                    ↔ en/about.astro
    └── contacto.astro           # ES contact                  ↔ en/contact.astro
public/
├── CNAME                 # jackstefoto.com (custom domain for GitHub Pages)
├── favicon.svg           # JS monogram
├── favicon-16/32.png, apple-touch-icon.png  # raster fallbacks (Safari)
├── og-image.jpg          # 1200×630 social preview (cropped from fountain photo)
└── photos/               # compressed hero photos (fountain, jet, skater, street, building-night)
```

---

## Content: how to edit

**All copy** lives in `src/i18n/ui.ts` (`ui.es` / `ui.en`) and `src/data/projects.ts`. Components pull strings via `t('key')`. To change wording, edit those two files — not the components.

### Adding / editing a project
Edit `src/data/projects.ts`. Each `Project` has `title`, `summary` (one line for the list, taken from Jack's text), a `stack` array, optional `link` (live site), optional `github` or `repoNote` (shown instead of a code link for a private repo), and optional `caseStudy`.

- **Project WITHOUT `caseStudy`** → title links to `link` (live site) if present, otherwise plain text.
- **Project WITH `caseStudy`** → card links to `/proyectos/<slug>`. `CaseStudy.astro` renders: title, site/code links, Jack's `sections` (each a heading + paragraphs; `*x*` = italics; `diagram: true` puts the diagram at the end of that section, otherwise it gets its own "Arquitectura" section), then the stack table.
- Paragraphs starting with `[lo escribe Jack` are markers: visible only in `npm run dev`.
- **`wip: true`** → greyed-out "in progress" list item.

### Current project status
Case studies now hold **Jack's own text** (Oct 2026): his sections (Motivación / Lo que hice / Lo que aprendí), then the ASCII diagram and the stack table. The AI-written `portfolio-case-study.md` files in each repo are reference only — facts to check against, not copy.

| Project | Slug | Status |
|---|---|---|
| Vocab (BYOV) | `vocab-app` | Live byov.net, repo `vocab-app` (public) |
| Lectora de periodismo | `news-reader` | Live link to the Pi (login wall). Repo `europresse-reader` stays **PRIVATE** (Jack's email in history; code about getting past anti-bot protections) → shows "disponible a pedido" note |
| Qué Mal Poema | `que-mal-poema` | Live quemalpoema.com, repo `qmp` (public) |
| A mí me strofa | `a-mi-me-strofa` | Live quemalpoema.com/site/mestrofa.html, repo `a-mi-mestrofa` (public). Replaced the Vertex AI placeholder |

> Note: "News Reader" and "Europresse Reader" are the **same project** — it was renamed. Don't re-add it as a separate card.

---

## Design & content rules (important constraints)

- **No email on the site** (privacy). Contact is via GitHub (+ LinkedIn/CV when ready). If a contact form is ever added, route it through a backend relay, never expose the address.
- **LinkedIn** is a disabled "Próximamente" placeholder — profile is dormant, reactivating in a few weeks. To enable: in `Contact.astro` set `linkedinAvailable = true` and put the real URL in `linkedinUrl`.
- **CV (ES + EN)**: the source is two Google Docs ("Hoja de vida — Jack Stefanou (ES)" / "Resume — Jack Stefanou (EN)"), shared as "anyone with the link can view". `.github/workflows/actualizar-cv.yml` exports them daily (6:00 Bogotá, or by hand from Actions) to `public/cv-es.pdf` / `cv-en.pdf`, commits only if the text changed, then triggers `deploy.yml` (a bot push doesn't trigger it by itself). Doc IDs are repo variables `CV_ES_ID` / `CV_EN_ID`. `Contact.astro` shows the links only when both PDFs exist; otherwise "Próximamente". A last step re-enables the workflow via the API on every run, so GitHub's 60-day inactivity shutoff never kicks in. To edit the CV, edit the Google Doc, not the PDF.
- **Do NOT highlight teaching** (Inspirit AI) — Jack is positioned as a builder, not an educator. Teaching can live on the CV, not the site.
- **No university branding in the hero.** USC appears once in the About body, not as a badge.
- **No headshot/selfie.** Personality comes from his B&W photography (he's a photographer).
- Spanish is **not** his native language. Levels: English native, Spanish DELE C1 (passed), French DALF C1, Greek B2.
- **Copy is Jack's.** Never write or rewrite site text for him; he writes first, Claude reviews and suggests. Leave `[lo escribe Jack: …]` markers for missing text. (Current copy in `ui.ts` / `projects.ts` is provisional, mostly AI-drafted, and will be rewritten by Jack.)

---

## Estilo

@~/Desktop/estilo/estilo.md

### Excepciones en este proyecto
- Mono (`--mono`) is used for the technical layer: stack lists, stack table, architecture diagrams.
- **Wider page:** `--ancho: 1200px` (set in `global.css`), so photos are bigger. Long text stays at `--ancho-texto`.
- **One page per section:** home (tagline + photos), Proyectos, Sobre mí, Contacto. No duplicate links: the nav is the only way to Proyectos/Contacto; GitHub lives on Contacto.
- **Bigger type than QMP where photos dominate:** nav 1.05rem (name 1.15rem), home tagline 2.1rem.
- **Photo captions:** `heroPhotos` in `Hero.astro` has `caption: { es, en }` per photo. Empty = nothing shown on the live site; `npm run dev` shows a `[pie de foto…]` marker. Jack writes them.
- Home keeps the photo slideshow (cross-fade every 6.5s); photo sits below the tagline, nothing on top, **never cropped** (`object-fit: contain`, aligned left). Not all photos are B&W (the fountain is color, on purpose).
- Bilingual: ES at `/`, EN at `/en/`; the ES / EN toggle sits at the right of the nav (where QMP shows the date).
- Mockups of the target design: https://claude.ai/artifact/FdpjJMiwQ1xcnt2bhpEy9e

---

## Animations

Only one: the **hero slideshow** cross-fades between the photos in `heroPhotos` (Hero.astro) every 6.5s. Under reduced-motion `base.css` removes the transition, so it becomes an instant swap. Everything else (parallax, count-up, scroll-reveal, card spotlight, etc.) was removed on purpose — see the Estilo.

---

## SEO / social

`Layout.astro` emits per-page: `<title>`, description, canonical, Open Graph (title/desc/url/image/locale), Twitter card, and `hreflang` (self + alternate + x-default). The case-study pages pass an explicit `altPath`/`altUrl` so the language toggle and hreflang map `proyectos` ↔ `projects` correctly (the path segment differs by language).

OG/Twitter image: `/og-image.jpg` (1200×630).

---

## Domain & DNS (jackstefoto.com)

- Registrar + DNS: **AWS Route 53** (NOT Cloudflare). Custom domain set in GitHub Pages; `public/CNAME` holds `jackstefoto.com`.
- DNS records (in the hosted zone the domain is actually delegated to):
  - 4 × **A** @ → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - **CNAME** `www` → `huellasenarena.github.io`
- HTTPS: Let's Encrypt cert issued by GitHub Pages; "Enforce HTTPS" enabled.

### ⚠️ Gotcha that bit us once
There were **two hosted zones** for the domain in Route 53. The A records were added to one, but the registered domain was delegated (NS) to the other → site didn't resolve. Fix was to point the registered domain's name servers to the zone that has the records (Route 53 → Registered domains → edit name servers). **A leftover duplicate zone may still exist** (NS `ns-1027.awsdns-00.org…`) and can be deleted to avoid the $0.50/mo and future confusion. Always confirm `whois`/registrar NS == hosted-zone NS.

---

## Assets

- **Photos:** originals were 8–11 MB each (full-res camera JPEGs). Compressed in-place with `sips` (max 2400px, quality ~72) to ~0.3–0.6 MB. If adding new photos, compress them the same way — a slow portfolio undercuts the "I build fast products" pitch.
- **Favicon:** SVG (`favicon.svg`, JS monogram). Safari does NOT reliably render SVG favicons that use `<text>`, so PNG fallbacks (`favicon-16/32.png`, `apple-touch-icon.png`) were rasterized via `qlmanage` and referenced in `Layout.astro`. Browsers cache favicons hard — hard-refresh to see changes.

---

## Next steps / TODO

- [ ] **English is hidden** (`showEnglish = false` in `src/i18n/utils.ts`; `/en/` pages deleted, restore from git history before commit "Jack's own text"). Comes back when Jack writes the English version.
- [ ] Open points Jack will write (dev-only `[lo escribe Jack: …]` markers in `projects.ts`):
  - A mí me strofa: the bridge before the "dos explicaciones" (model wins but accuracy = majority floor); 0,410 is with 40 training poems, macro-F1; only the logistic regression was trained.
  - Vocab: the result after the strategy change.
  - Vocab: "gratis" vs BYOK.
  - (About) what he's looking for is now one line; may refine.
- [ ] Enable **LinkedIn** when the profile is reactivated.
- [ ] Run "Actualizar CV" once by hand after the first push.
- [ ] Decide whether to make the `europresse-reader` repo public (currently no code link on its case study).
- [ ] Optional: delete the duplicate Route 53 hosted zone.
```
