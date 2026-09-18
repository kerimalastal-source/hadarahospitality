import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { quotes } from '../../../db/schema';
import { requireStaff } from '../../../lib/portal-auth';
import { isValidPortalBlobUrl } from '../../../lib/portal';

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

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
