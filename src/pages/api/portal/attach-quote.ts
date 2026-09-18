import type { APIRoute } from 'astro';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../db/client';
import { quotes, orders, portalUsers } from '../../../db/schema';
import { requireStaff } from '../../../lib/portal-auth';
import { isValidPortalBlobUrl } from '../../../lib/portal';
import { notifyNewQuote } from '../../../lib/portal-email';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireStaff(context);
  if (result instanceof Response) return new Response('Unauthorized', { status: 401 });

  const body = await context.request.json().catch(() => null);
  const orderId = typeof body?.orderId === 'string' ? body.orderId : '';
  const fileUrl = typeof body?.fileUrl === 'string' ? body.fileUrl : '';
  const amount = typeof body?.amount === 'string' && body.amount ? body.amount : null;
  const currency = typeof body?.currency === 'string' && body.currency ? body.currency : null;

  if (!orderId || !fileUrl || !isValidPortalBlobUrl(fileUrl)) {
    return new Response(JSON.stringify({ error: 'invalid_request' }), { status: 400 });
  }

  await db.insert(quotes).values({ orderId, fileUrl, amount, currency });

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (order) {
    const recipients = await db
      .select({ email: portalUsers.email })
      .from(portalUsers)
      .where(and(eq(portalUsers.companyId, order.companyId), eq(portalUsers.role, 'customer'), eq(portalUsers.status, 'approved')));
    notifyNewQuote(recipients.map((r) => r.email), order.reference).catch((error) => console.error('[portal] notifyNewQuote failed', error));
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
