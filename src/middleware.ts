// Astro's own middleware (a different system from the root-level
// middleware.ts, which is a raw Vercel Edge Middleware for i18n redirects —
// the two run at different layers and don't conflict). This one only guards
// /portal/*: anything but the public sign-in/sign-up pages requires a signed-
// in Clerk session. Per-page approval-status checks (pending vs approved
// customers) happen in each page itself via a DB lookup — see
// src/lib/portal-auth.ts.
import { clerkMiddleware } from '@clerk/astro/server';

const PUBLIC_PORTAL_PATHS = ['/portal/sign-in', '/portal/sign-up'];

export const onRequest = clerkMiddleware((auth, context) => {
  const { pathname } = context.url;
  if (!pathname.startsWith('/portal/')) return;
  if (PUBLIC_PORTAL_PATHS.some((path) => pathname.startsWith(path))) return;

  const { userId } = auth();
  if (!userId) {
    return context.redirect('/portal/sign-in');
  }
});
