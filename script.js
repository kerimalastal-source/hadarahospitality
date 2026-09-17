const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
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
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const subject = `HADARA Hospitality quotation request — ${values.hotel}`;
  const body = `Name: ${values.name}\nEmail: ${values.email}\nHotel / company: ${values.hotel}\nCountry: ${values.country}\nCollection: ${values.category}\n\nProject details:\n${values.details || 'Not specified'}`;
  window.location.href = `mailto:partnerships@hadarahospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
