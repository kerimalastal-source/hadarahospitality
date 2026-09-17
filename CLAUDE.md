# HADARA Hospitality — project context

Code-built replacement for the old Wix site at hadarahospitality.com. The
owner communicates in Arabic; reply to them in Arabic and keep this file's
prose in English so it stays easy to scan.

- **Repo**: `kerimalastal-source/hadarahospitality`
- **Live**: https://hadarahospitality.vercel.app (Vercel auto-deploys `main`
  on every push; no custom domain connected yet — deferred until the whole
  site is finished)
- **Stack**: Vite static multi-page site, no framework. No backend.

## Architecture

- Root `.html` files are hand-authored pages (`index.html`, `about.html`,
  `products.html`, `get-a-quote.html`, `contact.html`, `faq.html`,
  `privacy-policy.html`, `404.html`, `search.html`).
- `products/*.html` and `blog/*.html` are **generated**, not hand-edited.
  They're produced by `scripts/build-products.mjs` and
  `scripts/build-blog.mjs` from the data arrays in `data/products.mjs`
  (`PRODUCTS`, `CATEGORIES`) and `data/blog.mjs` (`ARTICLES`). To change a
  product or article, edit the data file and re-run the generator — never
  hand-edit the generated HTML.
- Other generated `public/` assets: `sitemap.xml` (`build-sitemap.mjs`),
  `search-index.json` (`build-search-index.mjs`), and
  `public/technical-sheets/*.pdf` (`build-technical-sheets.mjs`, one PDF
  per product). All of these are committed to git, same as the hand-authored
  pages — this repo's convention is that every `npm run generate` output
  gets tracked, not gitignored.
- `npm run generate` chains all five generators and runs automatically via
  `predev`/`prebuild`. **Running `npm run build` locally will rewrite every
  generated file in place** (products/, blog/, public/sitemap.xml,
  public/search-index.json, public/technical-sheets/). Before committing,
  diff what actually changed and only stage what's actually part of your
  task — see "Known issue" below for why this matters.
- `vite.config.js` lists every page explicitly in `rollupOptions.input`,
  plus a `pageEntries()` helper that globs `products/*.html` and
  `blog/*.html`.
- Client-side only: the quote and contact forms build a `mailto:` link in
  `script.js` — nothing is sent to or stored on a server. `search.js` does
  client-side substring search over `search-index.json`. No cookies, no
  analytics (Google Analytics is explicitly deferred, no GA4 ID supplied).

## Brand system

- Colors (CSS vars in `styles.css`): `--navy:#1e2a38`, `--gold:#c5a059`,
  `--cream:#f1ebe4`, plus `--ink`/`--muted`.
- Fonts: Playfair Display (serif — headings/emphasis) + DM Sans (body).
- Sharp corners everywhere (no `border-radius`), except the WhatsApp float
  button and the round-arrow circles.
- Product/collection images are `data-bg="URL"` divs, lazy-loaded via an
  `IntersectionObserver` in `script.js` (not `<img>` tags).
- Images are currently reused directly from the old Wix account's media
  library (`static.wixstatic.com` URLs) — see "Known issue" below.

## Git workflow for this repo

- Working branch: `claude/githup-marboota-wbnp18`. Every feature is built
  on this branch, pushed, opened as a PR against `main`, and merged after
  asking the owner — **except** they've pre-authorized merging without
  asking for small/low-risk or explicitly-requested items (they'll say so).
- **Before starting any new work**, sync first — `main` moves via
  squash-merge (or, now, regular merge commits) between sessions, so local
  history diverges fast:
  ```
  git fetch origin main
  git stash push -u        # only if you have uncommitted WIP
  git reset --hard origin/main
  git stash pop             # if you stashed
  ```
- After building, rebuild (`npm run build`) to verify, then **check `git
  diff --stat` before staging** — `npm run build` regenerates all
  generator-driven files, and you don't want to accidentally bundle
  unrelated regenerated output into a scoped PR (see "Known issue").
- Push with `git push -u origin claude/githup-marboota-wbnp18
  --force-with-lease`, open the PR via the GitHub MCP tool, then ask the
  owner (in Arabic) whether to merge — e.g. "بدك أدمج وأنشر؟" — unless
  told in advance to merge directly.
- After a merge, update this file if anything material changed (new
  pending item resolved, new known issue found, new convention adopted) —
  **do this as a habit on every publish**, not just when asked. Small
  wording-only updates don't need their own PR/ask cycle; fold them into
  the same push as the feature that prompted them.

## Known issue (unresolved as of 2026-09-17)

A commit made directly on `main` outside a Claude session ("Add structured
product SEO schema", `c1df3a1`) rewrote `scripts/build-products.mjs` to add
JSON-LD schema, but in the process also stripped the inline SVG icons (nav
search icon, WhatsApp float icon) in favor of plain text, and minified the
output — **without regenerating the actual `products/*.html` files to
match**. So right now the checked-in product pages still have the working
SVG icons (they just predate the script change), but running
`scripts/build-products.mjs` today would regenerate them *without* those
icons, which `styles.css`'s `.whatsapp-float svg` / `.nav-search svg` rules
expect. Don't run `npm run generate` (or `npm run build`, which triggers it
via `prebuild`) and commit the product-page output until this is
reconciled — either restore the SVGs in the current script template, or
move the icons into CSS so plain-text markup still looks right. Ask the
owner which direction they want before fixing it, since it's their own
recent change.

## Pending / deferred (owner-blocked, don't guess)

- **"شركاء النجاح" (Partners of Success) homepage section** — 10 hotel-chain
  logos. Explicitly deferred by the owner ("خلص سيبك منه بنعمله بعدين").
  Blocked on: (a) the exact names of the specific hotel properties they
  have real documented relationships with, (b) the actual approved logo
  files. Do not fabricate trademarked logos or invent partnership claims.
- **Arabic version of the site** — raised as a low-priority audit item,
  deferred pending a decision on URL structure/scope/translation source.
- **Google Analytics** — deferred ("خليها مرحلة اخرى"), no GA4 ID yet.
- **Certifications / testimonials sections** — owner confirmed no real
  content exists yet; do not fabricate.
- **Self-hosting product/blog images off the Wix account** — flagged as a
  real business risk (single point of failure), not yet resolved; this
  sandbox can't fetch `static.wixstatic.com` to re-host the files locally.
- **Custom domain** (`hadarahospitality.com` → Vercel) — deferred until the
  whole site is finished.

## Sandbox quirks

- Outbound HTTPS to `static.wixstatic.com`, `unsplash.com`, `usrfiles.com`,
  `hadarahospitality.com` and most external domains is blocked. Wix API
  calls route through Wix's own signed infrastructure and work fine.
  `mcp__Vercel__web_fetch_vercel_url` works for verifying the live
  `*.vercel.app` deployment. For local visual verification, use Playwright
  with `page.route()` to stub blocked image requests.
