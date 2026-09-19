// Creates the company + portal_users ("pending") rows right after Clerk
// sign-up — see src/pages/portal/onboarding.astro, the only page that posts
// here. A signed-in user with no portal_users row yet lands here first;
// this is what actually puts them in the approval queue.
import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { companies, portalUsers } from '../../db/schema';
import { getPortalIdentity } from '../../lib/portal-auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { userId } = context.locals.auth();
  if (!userId) return context.redirect('/portal/sign-in');

  const existing = await getPortalIdentity(context);
  if (existing) return context.redirect(existing.status === 'approved' ? '/portal/dashboard' : '/portal/pending');

  const form = await context.request.formData();
  const fullName = String(form.get('fullName') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const companyName = String(form.get('companyName') ?? '').trim();
  const country = String(form.get('country') ?? '').trim();

  if (!fullName || !email || !companyName || !country) {
    return new Response('Missing required fields', { status: 400 });
  }

  const [company] = await db.insert(companies).values({ name: companyName, country }).returning({ id: companies.id });
  await db.insert(portalUsers).values({
    clerkUserId: userId,
    companyId: company.id,
    fullName,
    email,
    role: 'customer',
    status: 'pending',
  });

  return context.redirect('/portal/pending');
};
