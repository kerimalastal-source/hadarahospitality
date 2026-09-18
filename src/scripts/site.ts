import { CONTACT_EMAIL } from '../config';

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#navigation');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }),
  );
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const quoteForm = document.querySelector<HTMLFormElement>('#quote-form');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)) as Record<string, string>;
  const subject = `HADARA Hospitality quotation request — ${values.hotel}`;
  const body = `Name: ${values.name}\nEmail: ${values.email}\nHotel / company: ${values.hotel}\nCountry: ${values.country}\nCollection: ${values.category}\n\nProject details:\n${values.details || 'Not specified'}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
if (quoteForm) {
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product');
  const category = params.get('category');
  const categoryField = quoteForm.querySelector<HTMLSelectElement>('[name="category"]');
  if (category && categoryField && [...categoryField.options].some((option) => option.value === category)) {
    categoryField.value = category;
  }
  if (product) {
    const detailsField = quoteForm.querySelector<HTMLTextAreaElement>('[name="details"]');
    if (detailsField) detailsField.value = `Product interest: ${product}\n\n`;
  }
}

const lazyBgEls = document.querySelectorAll<HTMLElement>('[data-bg]');
if (lazyBgEls.length && 'IntersectionObserver' in window) {
  const lazyBgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        const url = `url('${target.dataset.bg}')`;
        target.style.backgroundImage = url;
        target.style.setProperty('--card-image', url);
        observer.unobserve(target);
      });
    },
    { rootMargin: '250px 0px' },
  );
  lazyBgEls.forEach((el) => lazyBgObserver.observe(el));
} else {
  lazyBgEls.forEach((el) => {
    const url = `url('${el.dataset.bg}')`;
    el.style.backgroundImage = url;
    el.style.setProperty('--card-image', url);
  });
}

document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)) as Record<string, string>;
  const subject = `HADARA Hospitality contact — ${values.subject}`;
  const body = `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll<HTMLElement>('[data-carousel-track]').forEach((track) => {
  const wrapper = track.parentElement;
  const prevButton = wrapper?.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const nextButton = wrapper?.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (!prevButton || !nextButton) return;

  const scrollByOneCard = (direction: 1 | -1) => {
    const card = track.querySelector<HTMLElement>(':scope > *');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0');
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  const updateArrowState = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prevButton.addEventListener('click', () => scrollByOneCard(-1));
  nextButton.addEventListener('click', () => scrollByOneCard(1));
  track.addEventListener('scroll', updateArrowState);
  window.addEventListener('resize', updateArrowState);
  updateArrowState();
});
