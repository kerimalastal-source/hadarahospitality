// "Recently viewed" strip on product pages — a purely client-side
// browsing-history list, stored in localStorage only (never sent to or
// read by a server), so a visitor can get back to a product they looked
// at earlier without hunting through the catalog again. Only imported
// from ProductView.astro. Reuses the .related-card/.related-card-
// placeholder styling from the "You may also like" section above it —
// deliberately skips the data-bg lazy-load path in site.ts (its
// IntersectionObserver only ever queries the DOM once, at that script's
// own init time, so elements this script injects afterwards would never
// be picked up) and just sets the background image directly instead,
// same as that script's own no-IntersectionObserver fallback.
// See product-selection.ts's own comment for why this file needs its own
// `export {}` — without it, this file's top-level names leak into the
// same global scope TypeScript gives every import/export-less .ts file.
export {};

const STORAGE_KEY = 'hadara_recently_viewed';
const MAX_STORED = 6;
const DISPLAY_COUNT = 3;

interface ViewedProduct {
  slug: string;
  name: string;
  image: string;
}

const section = document.querySelector<HTMLElement>('#recently-viewed-section');
const grid = document.querySelector<HTMLElement>('#recently-viewed-grid');

if (section && grid) {
  const currentSlug = section.dataset.currentSlug ?? '';
  const current: ViewedProduct = {
    slug: currentSlug,
    name: section.dataset.currentName ?? '',
    image: section.dataset.currentImage ?? '',
  };

  let stored: ViewedProduct[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    stored = raw ? JSON.parse(raw) : [];
  } catch {
    stored = [];
  }

  // Render whatever was already there (excluding the product page a
  // visitor is currently on) before recording this visit, so the strip
  // shows other things they looked at, not the page they're already on.
  const toShow = stored.filter((item) => item.slug !== currentSlug).slice(0, DISPLAY_COUNT);
  if (toShow.length > 0) {
    const match = window.location.pathname.match(/^(\/[a-z]{2})?\/products\//);
    const localePrefix = match?.[1] ?? '';
    toShow.forEach((item) => {
      const link = document.createElement('a');
      link.href = `${localePrefix}/products/${item.slug}`;
      link.className = item.image ? 'related-card' : 'related-card related-card-placeholder';
      if (item.image) link.style.setProperty('--card-image', `url('${item.image}')`);
      const span = document.createElement('span');
      span.textContent = item.name;
      link.appendChild(span);
      grid.appendChild(link);
    });
    section.hidden = false;
  }

  if (currentSlug) {
    const updated = [current, ...stored.filter((item) => item.slug !== currentSlug)].slice(0, MAX_STORED);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Private browsing / storage disabled — the strip just won't
      // persist across visits, which degrades harmlessly.
    }
  }
}
