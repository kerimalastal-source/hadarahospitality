import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { orders, orderStatusEvents } from '../../db/schema';
import { requireStaff } from '../../lib/portal-auth';
import { ORDER_STATUS_STAGES, type OrderStatus } from '../../lib/portal';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireStaff(context);
  if (result instanceof Response) return result;
  const identity = result;

  const form = await context.request.formData();
  const companyId = String(form.get('companyId') ?? '');
  const reference = String(form.get('reference') ?? '').trim();
  const notes = String(form.get('notes') ?? '').trim();
  const statusInput = String(form.get('status') ?? '');
  const status = (ORDER_STATUS_STAGES as readonly string[]).includes(statusInput) ? (statusInput as OrderStatus) : 'quote_requested';

  if (!companyId || !reference) return new Response('Missing required fields', { status: 400 });

  const [order] = await db
    .insert(orders)
    .values({ companyId, reference, status, notes: notes || null, createdBy: identity.id })
    .returning({ id: orders.id });
  await db.insert(orderStatusEvents).values({ orderId: order.id, status });

  return context.redirect(`/portal/admin/orders/${order.id}/edit`);
};
