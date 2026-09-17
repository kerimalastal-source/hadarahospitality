const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Use the official black HADARA logo in the site header across all pages.
const headerBrand = document.querySelector('.site-header .brand');
if (headerBrand) {
  headerBrand.innerHTML = '<img src="/assets/hadara-logo-black.svg" alt="HADARA Hospitality" class="hadara-header-logo">';
  headerBrand.style.width = '118px';
  headerBrand.style.height = '64px';
  headerBrand.style.display = 'flex';
  headerBrand.style.alignItems = 'center';
  headerBrand.style.justifyContent = 'center';
  const logo = headerBrand.querySelector('.hadara-header-logo');
  logo.style.display = 'block';
  logo.style.width = '100%';
  logo.style.height = '100%';
  logo.style.objectFit = 'contain';
}

// Every generated product page gets a direct, product-specific PDF technical sheet.
const productMatch = window.location.pathname.match(/\/products\/([^/]+)\.html$/);
if (productMatch) {
  const heroWrap = document.querySelector('.pdp-hero .wrap');
  const quoteButton = heroWrap?.querySelector('.button');
  if (heroWrap && quoteButton) {
    const actions = document.createElement('div');
    actions.className = 'pdp-actions';
    quoteButton.parentNode.insertBefore(actions, quoteButton);
    actions.appendChild(quoteButton);
    const sheet = document.createElement('a');
    sheet.className = 'button button-gold technical-sheet-download';
    sheet.href = `/technical-sheets/${productMatch[1]}.pdf`;
    sheet.download = `${productMatch[1]}-technical-sheet.pdf`;
    sheet.textContent = 'Download Technical Sheet ↓';
    actions.appendChild(sheet);
  }
}

const quoteForm = document.querySelector('#quote-form');
quoteForm?.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const subject = `HADARA Hospitality quotation request — ${values.hotel}`;
  const body = `Name: ${values.name}\nEmail: ${values.email}\nHotel / company: ${values.hotel}\nCountry: ${values.country}\nCollection: ${values.category}\n\nProject details:\n${values.details || 'Not specified'}`;
  window.location.href = `mailto:partnerships@hadarahospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
if (quoteForm) {
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product');
  const category = params.get('category');
  const categoryField = quoteForm.querySelector('[name="category"]');
  if (category && categoryField && [...categoryField.options].some(option => option.value === category)) categoryField.value = category;
  if (product) quoteForm.querySelector('[name="details"]').value = `Product interest: ${product}\n\n`;
}
const lazyBgEls = document.querySelectorAll('[data-bg]');
if (lazyBgEls.length && 'IntersectionObserver' in window) {
  const lazyBgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const url = `url('${entry.target.dataset.bg}')`;
      entry.target.style.backgroundImage = url;
      entry.target.style.setProperty('--card-image', url);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '250px 0px' });
  lazyBgEls.forEach(el => lazyBgObserver.observe(el));
} else {
  lazyBgEls.forEach(el => {
    const url = `url('${el.dataset.bg}')`;
    el.style.backgroundImage = url;
    el.style.setProperty('--card-image', url);
  });
}
document.querySelector('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const subject = `HADARA Hospitality contact — ${values.subject}`;
  const body = `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`;
  window.location.href = `mailto:partnerships@hadarahospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
