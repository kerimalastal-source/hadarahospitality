// Called from src/scripts/rfq-form.ts right after a successful
// /api/submit-quote — best-effort, fire-and-forget. If the visitor
// submitting "Request a quote" happens to be a signed-in, onboarded portal
// customer, this creates a real Order (visible in their /portal/dashboard)
// for the request instead of it only ever reaching the team as an email.
// For everyone else (anonymous visitors, or a signed-in user with no
// company yet) it silently no-ops — this must never affect the RFQ form's
// own success/failure UX either way.
import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { orders, orderStatusEvents } from '../../db/schema';
import { getPortalIdentity } from '../../lib/portal-auth';

export const prerender = false;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function str(formData: FormData, key: string, max = 300): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export const POST: APIRoute = async (context) => {
  const identity = await getPortalIdentity(context);
  if (!identity || !identity.companyId) {
    return json({ ok: true, linked: false }, 200);
  }

  const form = await context.request.formData();
  const reference = str(form, 'reference', 40);
  if (!reference) return json({ ok: false, error: 'missing_reference' }, 400);

  const categories = form.getAll('categories').filter((v): v is string => typeof v === 'string' && v.length > 0);
  const specificProducts = form.getAll('products').filter((v): v is string => typeof v === 'string' && v.length > 0);
  const summaryLines = [
    categories.length ? `Categories: ${categories.join(', ')}` : '',
    specificProducts.length ? `Specific products: ${specificProducts.join(', ')}` : '',
    str(form, 'estimatedQuantity', 300) && `Estimated quantity: ${str(form, 'estimatedQuantity', 300)}`,
    str(form, 'projectType', 200) && `Project type: ${str(form, 'projectType', 200)}`,
    str(form, 'deliveryCountry', 200) &&
      `Delivery: ${[str(form, 'deliveryCity', 200), str(form, 'deliveryCountry', 200)].filter(Boolean).join(', ')}`,
    str(form, 'targetDeliveryDate', 20) && `Target delivery date: ${str(form, 'targetDeliveryDate', 20)}`,
    str(form, 'notes', 4000) && `Notes: ${str(form, 'notes', 4000)}`,
  ].filter(Boolean);

  const [order] = await db
    .insert(orders)
    .values({
      companyId: identity.companyId,
      reference,
      status: 'quote_requested',
      notes: summaryLines.join('\n') || null,
      createdBy: identity.id,
    })
    .returning({ id: orders.id });
  await db.insert(orderStatusEvents).values({ orderId: order.id, status: 'quote_requested' });

  return json({ ok: true, linked: true }, 200);
};
