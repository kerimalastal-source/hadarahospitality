import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { portalDocuments } from '../../db/schema';
import { requireApprovedPortalUser } from '../../lib/portal-auth';
import { isValidPortalBlobUrl } from '../../lib/portal';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const result = await requireApprovedPortalUser(context);
  if (result instanceof Response) return new Response('Unauthorized', { status: 401 });
  const identity = result;
  if (!identity.companyId) return new Response('No company on account', { status: 400 });

  const body = await context.request.json().catch(() => null);
  const fileUrl = typeof body?.fileUrl === 'string' ? body.fileUrl : '';
  const fileName = typeof body?.fileName === 'string' ? body.fileName : '';
  if (!fileUrl || !fileName || !isValidPortalBlobUrl(fileUrl)) {
    return new Response(JSON.stringify({ error: 'invalid_upload' }), { status: 400 });
  }

  await db.insert(portalDocuments).values({
    companyId: identity.companyId,
    fileUrl,
    fileName,
    uploadedBy: identity.id,
    kind: 'customer_upload',
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
