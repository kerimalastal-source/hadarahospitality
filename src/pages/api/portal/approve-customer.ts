import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { portalUsers } from '../../../db/schema';
import { requireStaff } from '../../../lib/portal-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireStaff(context);
  if (result instanceof Response) return result;

  const form = await context.request.formData();
  const userId = String(form.get('userId') ?? '');
  const decision = String(form.get('decision') ?? '');
  if (!userId || (decision !== 'approved' && decision !== 'rejected')) {
    return new Response('Bad request', { status: 400 });
  }

  await db.update(portalUsers).set({ status: decision }).where(eq(portalUsers.id, userId));
  return context.redirect('/portal/admin/customers');
};
