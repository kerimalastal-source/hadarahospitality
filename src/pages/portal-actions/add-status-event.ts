import type { APIRoute } from 'astro';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db/client';
import { orders, orderStatusEvents, portalUsers } from '../../db/schema';
import { requireStaff } from '../../lib/portal-auth';
import { ORDER_STATUS_STAGES, type OrderStatus } from '../../lib/portal';
import { notifyOrderStatusUpdated } from '../../lib/portal-email';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireStaff(context);
  if (result instanceof Response) return result;

  const form = await context.request.formData();
  const orderId = String(form.get('orderId') ?? '');
  const statusInput = String(form.get('status') ?? '');
  const note = String(form.get('note') ?? '').trim();
  if (!orderId || !(ORDER_STATUS_STAGES as readonly string[]).includes(statusInput)) {
    return new Response('Bad request', { status: 400 });
  }
  const status = statusInput as OrderStatus;

  await db.insert(orderStatusEvents).values({ orderId, status, note: note || null });
  const [order] = await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, orderId)).returning();

  if (order) {
    const recipients = await db
      .select({ email: portalUsers.email })
      .from(portalUsers)
      .where(and(eq(portalUsers.companyId, order.companyId), eq(portalUsers.role, 'customer'), eq(portalUsers.status, 'approved')));
    notifyOrderStatusUpdated(recipients.map((r) => r.email), order.reference, status, note || null).catch((error) =>
      console.error('[portal] notifyOrderStatusUpdated failed', error),
    );
  }

  return context.redirect(`/portal/admin/orders/${orderId}/edit`);
};
