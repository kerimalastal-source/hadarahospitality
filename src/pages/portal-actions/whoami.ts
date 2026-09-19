// Lets the header nav (src/scripts/portal-nav-name.ts, loaded site-wide via
// BaseLayout.astro) show the signed-in person's name in place of "Partner
// Portal" on every page, not just /portal/* — a static marketing page has
// no server-side auth context of its own to render this synchronously, so
// it does one small best-effort fetch here instead. Cheap for the vast
// majority of anonymous visitors: getPortalIdentity() returns immediately
// with no DB query when there's no Clerk session at all.
import type { APIRoute } from 'astro';
import { getPortalIdentity } from '../../lib/portal-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const identity = await getPortalIdentity(context);
  return new Response(JSON.stringify({ name: identity?.fullName ?? null }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
};
