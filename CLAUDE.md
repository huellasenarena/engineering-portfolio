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
- **Fonts:** Playfair Display (serif, headings) + Inter (sans, body), loaded from Google Fonts.
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
│   └── utils.ts         # getLangFromUrl, useTranslations(t), getAlternateUrl
├── data/
│   └── projects.ts      # Project[] data + CaseStudyContent model + projectUrl() helper
├── layouts/
│   └── Layout.astro     # <head>: SEO, Open Graph, canonical, hreflang, favicons, JS-ready flag, scroll-reveal observer
├── components/
│   ├── Header.astro     # fixed header, nav, language toggle, scroll-to-top logo
│   ├── Hero.astro       # tagline + CTAs + background photo SLIDESHOW + parallax
│   ├── Projects.astro   # grid of ProjectCard
│   ├── ProjectCard.astro# card; links to case-study page OR opens a modal; cursor spotlight
│   ├── CaseStudy.astro  # full case-study renderer (used by the dedicated pages)
│   ├── About.astro      # short bio + languages (2×2)
│   └── Contact.astro    # LinkedIn / GitHub / CV links (some disabled placeholders)
└── pages/
    ├── index.astro              # ES home
    ├── en/index.astro           # EN home
    ├── proyectos/[slug].astro   # ES case-study pages (getStaticPaths over projects w/ caseStudy)
    └── en/projects/[slug].astro # EN case-study pages
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
Edit `src/data/projects.ts`. Each `Project` has short `es`/`en` (title, problem, solution), a `stack` array, optional `link` (live demo), optional `github`, and optional `caseStudy`.

- **Project WITHOUT `caseStudy`** → card opens a modal with the short problem/solution (e.g. Vocab App).
- **Project WITH `caseStudy`** → card links to a dedicated page at `/proyectos/<slug>` (ES) and `/en/projects/<slug>` (EN). The page renders `CaseStudy.astro`: tagline, meta, animated metrics, overview, problem, numbered solution steps, optional ASCII architecture diagram, stack table, challenges, results, and a closing statement.
- **`wip: true`** → greyed-out "in progress" card (e.g. the Vertex AI placeholder).
- Each project needs an icon entry in the `icons` map in `ProjectCard.astro`, keyed by `slug`. If the slug changes, update that key too.

### Current project status
| Project | Slug | Status |
|---|---|---|
| Qué Mal Poema | `que-mal-poema` | ✅ Full case study. Live quemalpoema.com, repo `qmp` (public). Source: `~/Desktop/qmp/portfolio-case-study.md` |
| Personalized News Reader / Noticias Personalizadas | `news-reader` | ✅ Full case study. Repo `europresse-reader` is **PRIVATE** → no code link shown; no public live URL (behind Google OAuth). Source: `~/Desktop/actualités/portfolio-case-study.md` |
| Vocab | `vocab-app` | ✅ Full case study. Live demo `huellasenarena.github.io/vocab-app`, repo `vocab-app` (public). Source: `~/Desktop/vocab-app/portfolio-case-study.md` |
| ML en Vertex AI | `vertex-ml` | ⏳ Placeholder, `wip: true` ("Por definir") |

> Note: "News Reader" and "Europresse Reader" are the **same project** — it was renamed. Don't re-add it as a separate card.

---

## Design & content rules (important constraints)

- **No email on the site** (privacy). Contact is via GitHub (+ LinkedIn/CV when ready). If a contact form is ever added, route it through a backend relay, never expose the address.
- **LinkedIn** is a disabled "Próximamente" placeholder — profile is dormant, reactivating in a few weeks. To enable: in `Contact.astro` set `linkedinAvailable = true` and put the real URL in `linkedinUrl`.
- **CV (ES + EN)** are disabled "Próximamente" placeholders. To enable: drop `cv-es.pdf` / `cv-en.pdf` in `public/` and set `cvAvailable = true` in `Contact.astro`.
- **Do NOT highlight teaching** (Inspirit AI) — Jack is positioned as a builder, not an educator. Teaching can live on the CV, not the site.
- **No university branding in the hero.** USC appears once in the About body, not as a badge.
- **No headshot/selfie.** Personality comes from his B&W photography (he's a photographer).
- Spanish is **not** his native language. Levels: English native, Spanish B2/C1, French DALF C1, Greek B2.
- Tone: clean, fast, careful typography, technical but warm. Dark theme, single terracotta accent (`--accent: #c47c5a`).

---

## Animations (all respect `prefers-reduced-motion`)

- **Hero entrance:** tagline / subtitle / CTAs stagger-fade on load (CSS).
- **Hero parallax:** background shifts slower than scroll. Gated OFF under reduced-motion.
- **Hero slideshow:** cross-fades between the photos in `heroPhotos` (Hero.astro) every 6.5s. Runs even under reduced-motion (an opacity fade isn't "motion"; it just becomes an instant swap there). If it "doesn't change," wait 6.5s and confirm there are ≥2 photos.
- **Card spotlight:** a soft terracotta glow follows the cursor on project cards (`--mx`/`--my` updated on mousemove).
- **Count-up:** case-study metrics count from 0 when scrolled into view.
- **Section-title underline:** an accent line draws in under each section title on reveal.
- **Scroll-reveal:** sections/cards fade-up via IntersectionObserver. The hidden state is gated behind a `.js` class (set in `<head>`) so content is still visible if JS fails.

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

- [ ] Fill in the **Vertex AI** project when ready (remove `wip`, add content).
- [ ] Enable **LinkedIn** when the profile is reactivated.
- [ ] Add **CV** PDFs (ES + EN) and flip `cvAvailable`.
- [ ] Decide whether to make the `europresse-reader` repo public (currently no code link on its case study).
- [ ] Optional: delete the duplicate Route 53 hosted zone.
```
