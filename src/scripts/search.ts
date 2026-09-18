export {};

interface SearchEntry {
  type: string;
  title: string;
  url: string;
  excerpt?: string;
  category?: string;
}

const form = document.querySelector<HTMLFormElement>('#search-form');
const input = document.querySelector<HTMLInputElement>('#search-input');
const statusEl = document.querySelector<HTMLElement>('#search-status');
const list = document.querySelector<HTMLElement>('#search-results-list');

const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let index: SearchEntry[] = [];
try {
  const res = await fetch('/search-index.json');
  index = await res.json();
} catch {
  if (statusEl) statusEl.textContent = 'Search is temporarily unavailable.';
}

function renderResults(query: string) {
  if (!statusEl || !list) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    statusEl.textContent = '';
    list.innerHTML = '';
    return;
  }
  const matches = index.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)),
  );
  statusEl.textContent = matches.length
    ? `${matches.length} result${matches.length === 1 ? '' : 's'} for "${query}"`
    : `No results for "${query}". Try a different term, or contact us directly.`;
  list.innerHTML = matches
    .map(
      (item) =>
        `<a class="search-result" href="${item.url}"><span class="search-result-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt || '')}</p></a>`,
    )
    .join('');
}

if (input && form) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  if (initialQuery) {
    input.value = initialQuery;
    renderResults(initialQuery);
  }

  input.addEventListener('input', () => renderResults(input.value));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderResults(input.value);
  });
}
