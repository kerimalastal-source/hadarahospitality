// Multi-product selection on /products: check a checkbox next to any
// product to add it to a running selection, then "Request a quote for
// selected products" sends the whole set to /get-a-quote at once, where
// src/scripts/rfq-form.ts's applySelectionFromSession() pre-checks the
// matching category chips + specific-product checkboxes. Only imported
// from ProductsListView.astro, so this only ever runs on /products.
// The `export {}` keeps this file's top-level names (STORAGE_KEY, etc.)
// scoped to itself for TypeScript — with no import/export of its own, tsc
// otherwise treats a .ts file as a global script and its top-level
// consts collide with same-named ones in any other script-mode file
// (see recently-viewed.ts's own STORAGE_KEY, a completely unrelated
// feature that happened to pick the same name).
export {};

const STORAGE_KEY = 'hadara_rfq_selection';

interface SelectedProduct {
  slug: string;
  name: string;
  category: string;
}

function getSelection(): SelectedProduct[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SelectedProduct[]) : [];
  } catch {
    return [];
  }
}

function setSelection(items: SelectedProduct[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private browsing / storage disabled — selection just won't persist
    // across the navigation to /get-a-quote, which degrades harmlessly.
  }
  render(items);
}

const checkboxes = document.querySelectorAll<HTMLInputElement>('[data-select-product]');
const bar = document.querySelector<HTMLElement>('#rfq-selection-bar');
const countEl = bar?.querySelector<HTMLElement>('[data-selection-count]');
const clearButton = bar?.querySelector<HTMLButtonElement>('[data-selection-clear]');
const ctaLink = bar?.querySelector<HTMLAnchorElement>('[data-selection-cta]');
const ctaBaseHref = ctaLink?.getAttribute('href') ?? '';

function render(items: SelectedProduct[]) {
  if (bar) bar.hidden = items.length === 0;
  document.body.classList.toggle('has-selection-bar', items.length > 0);
  if (countEl) countEl.textContent = String(items.length);
  if (ctaLink) ctaLink.href = `${ctaBaseHref}?fromSelection=1`;
}

if (checkboxes.length > 0 && bar) {
  const initial = getSelection();
  const initialSlugs = new Set(initial.map((item) => item.slug));
  checkboxes.forEach((checkbox) => {
    if (checkbox.dataset.slug && initialSlugs.has(checkbox.dataset.slug)) checkbox.checked = true;
    checkbox.addEventListener('change', () => {
      const { slug, name, rfqCategory: category } = checkbox.dataset;
      if (!slug || !name || !category) return;
      const current = getSelection().filter((item) => item.slug !== slug);
      if (checkbox.checked) current.push({ slug, name, category });
      setSelection(current);
    });
  });

  clearButton?.addEventListener('click', () => {
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // See setSelection() above.
    }
    render([]);
  });

  render(initial);
}
