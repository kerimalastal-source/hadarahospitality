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
  navigation.querySelectorAll('a').forEach((link) => {
    // .nav-products-cat toggles its own preview panel on mobile instead of
    // navigating away (see the .nav-products-cat-item block below) — closing
    // the whole mobile nav on that same click would defeat the toggle.
    if (link.classList.contains('nav-products-cat')) return;
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Products nav dropdown: on desktop this is a pure-CSS hover/focus flyout
// (see .nav-products-cat-item in global.css), but touch devices have no
// hover, so on mobile tapping a category toggles its own preview panel open
// instead of following the link straight to /products#<category>.
document.querySelectorAll<HTMLElement>('.nav-products-cat-item').forEach((item) => {
  const toggle = item.querySelector<HTMLAnchorElement>('.nav-products-cat');
  toggle?.addEventListener('click', (event) => {
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    event.preventDefault();
    const willOpen = !item.classList.contains('open');
    item.parentElement?.querySelectorAll('.nav-products-cat-item.open').forEach((other) => {
      if (other !== item) other.classList.remove('open');
    });
    item.classList.toggle('open', willOpen);
  });
});

document.querySelectorAll<HTMLElement>('.lang-switcher').forEach((switcher) => {
  const toggle = switcher.querySelector<HTMLButtonElement>('[data-lang-toggle]');
  const menu = switcher.querySelector<HTMLElement>('[data-lang-menu]');
  if (!toggle || !menu) return;
  const close = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    if (!switcher.contains(event.target as Node)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
});

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

const backToTopButton = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
if (backToTopButton) {
  const toggleVisibility = () => backToTopButton.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
  backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const AUTO_SCROLL_SPEED = 0.35; // px per frame, a gentle drift
    let direction: 1 | -1 = 1;
    let paused = false;
    let resumeTimer: number | undefined;

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const scheduleResume = (delay: number) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, delay);
    };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', () => scheduleResume(300));
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', () => scheduleResume(1500));
    track.addEventListener('wheel', () => scheduleResume(2000), { passive: true });
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', () => scheduleResume(1000));
    prevButton.addEventListener('click', () => scheduleResume(2500));
    nextButton.addEventListener('click', () => scheduleResume(2500));

    // scrollLeft rounds to whole pixels, so a sub-pixel-per-frame drift needs
    // its own float accumulator or the increments get rounded away to zero.
    // scrollTo(..., { behavior: 'auto' }) is used instead of a plain
    // `track.scrollLeft = x` assignment because the track's CSS
    // scroll-behavior: smooth (kept for the arrow buttons) also applies to
    // direct property writes per spec — animating every single frame's
    // near-zero delta queues up and visibly lags instead of drifting.
    let scrollPos = track.scrollLeft;
    const step = () => {
      if (paused) {
        scrollPos = track.scrollLeft;
      } else {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll > 0) {
          scrollPos += direction * AUTO_SCROLL_SPEED;
          if (scrollPos >= maxScroll) {
            scrollPos = maxScroll;
            direction = -1;
          } else if (scrollPos <= 0) {
            scrollPos = 0;
            direction = 1;
          }
          track.scrollTo({ left: scrollPos, behavior: 'auto' });
        }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
});
