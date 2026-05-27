# Memry — marketing site

Static marketing site for **Memry**, a mobile app for collecting and curating things people want to remember, keep, and display.

Four pages, no build step:

- `index.html` — hero, feature tour, example collections, launch block
- `support.html` — contact + FAQ
- `privacy.html` — privacy policy (Sign in with Apple + iCloud model)
- `terms.html` — terms of use

Shared assets in `assets/` (CSS, JS, screen captures).

## Local preview

Pure static — open `index.html` directly, or run any static server:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Use these settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
4. Deploy. Cloudflare Pages will pick up `_headers`, `_redirects`, and `sitemap.xml` automatically.

Update the production domain in two places before launch:

- `robots.txt` — `Sitemap:` line
- `sitemap.xml` — all `<loc>` entries

## File map

```
.
├── _headers          Cloudflare Pages: CSP, HSTS, cache rules
├── _redirects        Cloudflare Pages: clean-URL aliases + 404 fallback
├── robots.txt        Crawlers
├── sitemap.xml       Search engines
├── index.html        Home
├── privacy.html      Privacy policy
├── support.html      Support + FAQ
├── terms.html        Terms of use
└── assets/
    ├── site.css      Shared stylesheet
    ├── site.js       Interactions (mobile nav, word cycle, phone state, etc.)
    └── screens/      App screenshots used in the hero + feature panels
```

## Brand system

- Surface: warm white (`#FAFAFA`), near-black ink (`#111`)
- Type: Geist (UI), Archivo Black (display), Instrument Serif italic (accents), Geist Mono (labels)
- Pastel grounds: blush, mint, butter, sky, lilac, peach, sage, rose, cream
- Warm accents: cocoa, mustard, tomato, navy, forest, plum, clay, hotpink

All tokens defined as CSS custom properties in `assets/site.css`.

---

© Memry. All rights reserved.
