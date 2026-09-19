// Staff-only read endpoint behind /portal/admin/live-visitors
// (src/scripts/portal-live-visitors.ts polls this every few seconds). Groups
// the last hour of visitorEvents by sessionId into one row per anonymous
// visitor, with their full page-path trail in order — see CLAUDE.md's "Live
// visitor tracking" section.
import type { APIRoute } from 'astro';
import { sql } from 'drizzle-orm';
import { db } from '../../db/client';
import { requireStaff } from '../../lib/portal-auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const result = await requireStaff(context);
  if (result instanceof Response) return result;

  const rows = await db.execute(sql`
    select
      session_id as "sessionId",
      min(created_at) as "firstSeen",
      max(created_at) as "lastSeen",
      count(*)::int as "pageviews",
      array_agg(path order by created_at) as "paths",
      (array_agg(country order by created_at))[1] as "country",
      (array_agg(city order by created_at))[1] as "city",
      (array_agg(locale order by created_at))[1] as "locale",
      (array_agg(referrer order by created_at))[1] as "referrer"
    from visitor_events
    where created_at > now() - interval '60 minutes'
    group by session_id
    order by max(created_at) desc
    limit 40
  `);

  return new Response(JSON.stringify({ ok: true, sessions: rows.rows }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
