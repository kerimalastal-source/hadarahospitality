// Anonymous visitor-tracking beacon, called from every marketing page (see
// src/scripts/visitor-track.ts, loaded globally via BaseLayout.astro) —
// despite living under portal-actions/ (chosen only to reuse that existing
// non-/api/, non-/portal/*-gated route namespace, see CLAUDE.md's "Route
// namespacing" lesson), this has nothing to do with the Partner Portal
// itself and needs no auth: it tracks anonymous public-site visitors, not
// signed-in customers/staff.
//
// Stores no PII — sessionId is a random UUID the client keeps only in
// sessionStorage, country/city come from Vercel's edge geo headers, never a
// raw IP. See src/db/schema.ts's visitorEvents comment and CLAUDE.md's
// "Live visitor tracking" section.
import type { APIRoute } from 'astro';
import { eq, lt, sql } from 'drizzle-orm';
import { db } from '../../db/client';
import { visitorEvents } from '../../db/schema';
import { escapeHtml } from '../../lib/email';
import { hasTelegramConfigured, sendTelegramMessage } from '../../lib/telegram';

export const prerender = false;

const MAX_LEN = 300;

function str(value: unknown, max = MAX_LEN): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

async function notifyNewVisitor(path: string, country: string | null, city: string | null, locale: string | null, referrer: string | null): Promise<void> {
  if (!hasTelegramConfigured()) return;
  const where = [city, country].filter((v): v is string => Boolean(v)).map(escapeHtml).join(', ') || 'غير معروف';
  const lines = [
    '🆕 <b>زائر جديد دخل الموقع</b>',
    `📍 من: ${where}`,
    `📄 الصفحة: ${escapeHtml(path)}`,
    locale ? `🌐 اللغة: ${escapeHtml(locale)}` : '',
    referrer ? `↩️ المصدر: ${escapeHtml(referrer)}` : '↩️ المصدر: مباشر',
  ].filter(Boolean);
  await sendTelegramMessage(lines.join('\n'));
}

export const POST: APIRoute = async (context) => {
  let body: { sessionId?: unknown; path?: unknown; locale?: unknown; referrer?: unknown };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const sessionId = str(body.sessionId, 100);
  const path = str(body.path);
  if (!sessionId || !path) {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  const locale = str(body.locale, 10);
  const referrer = str(body.referrer, 500);
  const country = context.request.headers.get('x-vercel-ip-country');
  const city = context.request.headers.get('x-vercel-ip-city');
  const cityDecoded = city ? decodeURIComponent(city) : null;

  const [existing] = await db.select({ id: visitorEvents.id }).from(visitorEvents).where(eq(visitorEvents.sessionId, sessionId)).limit(1);
  const isNewSession = !existing;

  await db.insert(visitorEvents).values({ sessionId, path, locale, referrer, country, city: cityDecoded });

  if (isNewSession) {
    notifyNewVisitor(path, country, cityDecoded, locale, referrer).catch((error) => console.error('[track-visit] notifyNewVisitor failed', error));
  }

  // Best-effort housekeeping — this table has no other retention/cleanup
  // job, so occasionally trim events older than 30 days on write rather
  // than letting it grow forever. Low probability so it doesn't add
  // latency to most requests; failure here must never affect the response.
  if (Math.random() < 0.01) {
    db.delete(visitorEvents)
      .where(lt(visitorEvents.createdAt, sql`now() - interval '30 days'`))
      .catch((error) => console.error('[track-visit] cleanup failed', error));
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
};
