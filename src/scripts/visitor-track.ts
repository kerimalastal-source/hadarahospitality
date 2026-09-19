export {};

// Anonymous page-view beacon, loaded on every marketing page (see
// BaseLayout.astro). Skips /portal/* — an authenticated staff/customer
// browsing the Partner Portal isn't the "anonymous visitor" this feature is
// about, and would otherwise clutter the live feed with the owner's own
// admin activity (including this very tracking page). See CLAUDE.md's
// "Live visitor tracking" section.
if (!window.location.pathname.startsWith('/portal')) {
  const SESSION_KEY = 'hadara_visitor_session';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  fetch('/portal-actions/track-visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      path: window.location.pathname,
      locale: document.documentElement.lang || null,
      referrer: document.referrer || null,
    }),
    keepalive: true,
  }).catch(() => {
    // Tracking must never affect the visitor's actual experience of the page.
  });
}
