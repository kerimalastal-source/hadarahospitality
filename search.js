const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const status = document.querySelector('#search-status');
const list = document.querySelector('#search-results-list');

const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let index = [];
try {
  const res = await fetch('/search-index.json');
  index = await res.json();
} catch {
  status.textContent = 'Search is temporarily unavailable.';
}

function renderResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    status.textContent = '';
    list.innerHTML = '';
    return;
  }
  const matches = index.filter((item) =>
    item.title.toLowerCase().includes(q) ||
    (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
    (item.category && item.category.toLowerCase().includes(q))
  );
  status.textContent = matches.length
    ? `${matches.length} result${matches.length === 1 ? '' : 's'} for "${query}"`
    : `No results for "${query}". Try a different term, or contact us directly.`;
  list.innerHTML = matches.map((item) => `<a class="search-result" href="${item.url}"><span class="search-result-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt || '')}</p></a>`).join('');
}

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
