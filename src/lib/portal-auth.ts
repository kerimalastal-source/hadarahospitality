// Shared helper for portal pages/API routes: resolves the signed-in Clerk
// user to their portal_users row, so each page can check approval status
// and role without repeating the same query. See src/middleware.ts for the
// "must be signed in" perimeter check this builds on.
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { portalUsers, type portalUserRole, type portalUserStatus } from '../db/schema';

export interface PortalIdentity {
  id: string;
  clerkUserId: string;
  companyId: string | null;
  fullName: string;
  email: string;
  role: (typeof portalUserRole.enumValues)[number];
  status: (typeof portalUserStatus.enumValues)[number];
}

/** Structural shape shared by both the `Astro` global (in .astro frontmatter)
 * and a real `APIContext` (in src/pages/portal-actions/*.ts), so these helpers
 * work in either. */
interface PortalAuthContext {
  locals: App.Locals;
  redirect(path: string, status?: number): Response;
}

export async function getPortalIdentity(context: PortalAuthContext): Promise<PortalIdentity | null> {
  const { userId } = context.locals.auth();
  if (!userId) return null;

  const [row] = await db.select().from(portalUsers).where(eq(portalUsers.clerkUserId, userId)).limit(1);
  return row ?? null;
}

/**
 * Redirects a customer whose account isn't approved yet to /portal/pending,
 * and anyone with no portal_users row at all to sign-up. Returns the
 * identity when the caller can proceed.
 */
export async function requireApprovedPortalUser(context: PortalAuthContext): Promise<PortalIdentity | Response> {
  const identity = await getPortalIdentity(context);
  if (!identity) return context.redirect('/portal/sign-up');
  if (identity.status !== 'approved') return context.redirect('/portal/pending');
  return identity;
}

export async function requireStaff(context: PortalAuthContext): Promise<PortalIdentity | Response> {
  const result = await requireApprovedPortalUser(context);
  if (result instanceof Response) return result;
  if (result.role !== 'staff') return context.redirect('/portal/dashboard');
  return result;
}
