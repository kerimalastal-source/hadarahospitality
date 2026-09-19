import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { companies } from '../../db/schema';
import { requireApprovedPortalUser } from '../../lib/portal-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireApprovedPortalUser(context);
  if (result instanceof Response) return result;
  const identity = result;
  if (!identity.companyId) return context.redirect('/portal/profile');

  const form = await context.request.formData();
  const name = String(form.get('name') ?? '').trim();
  const country = String(form.get('country') ?? '').trim();
  if (!name) return context.redirect('/portal/profile');

  await db.update(companies).set({ name, country: country || null }).where(eq(companies.id, identity.companyId));
  return context.redirect('/portal/profile');
};
