// Shows the signed-in portal customer/staff's name in place of "Partner
// Portal" in the header nav, site-wide. Loaded from BaseLayout.astro on
// every page, so it also runs on /portal/* pages — but those already get
// the name server-rendered (see Header.astro's portalUserName prop, which
// also adds the .nav-portal-signed-in class), so the guard below skips the
// fetch there and only actually does anything on a static marketing page,
// which has no server-side auth context of its own to render this
// synchronously.
const link = document.querySelector<HTMLAnchorElement>('a[href="/portal/dashboard"]');
if (link && !link.classList.contains('nav-portal-signed-in')) {
  fetch('/portal-actions/whoami')
    .then((response) => response.json())
    .then(({ name }: { name: string | null }) => {
      if (name) {
        link.textContent = name;
        link.classList.add('nav-portal-signed-in');
      }
    })
    .catch(() => {});
}
