// Vercel Edge Function — RFQ submission intake for /get-a-quote.html.
//
// This lives outside src/ on purpose: the site itself is a fully static
// Astro build (see CLAUDE.md), and Vercel deploys any file under /api at
// the project root as a serverless/edge function independently of that,
// with zero framework config. Using the Edge runtime (not the Node
// runtime) gets us the standard Request/Response/FormData Web APIs for
// free, so multipart parsing needs no extra dependency.
//
// What's real right now: full server-side validation, file type/size
// checks, a lightweight anti-spam gate, and a generated RFQ reference
// number returned to the caller. What's stubbed: the three integration
// points below (email, HubSpot, file storage) are no-ops until their
// environment variables are configured — each one logs what it *would*
// do so this is easy to find and wire up later. See CLAUDE.md for the
// exact env vars each one needs.

import { isValidRfqFile, isValidWorkEmail, RFQ_FILE_MAX_BYTES, type RfqProductMeta, type RfqSubmission } from '../src/lib/rfq';

export const config = { runtime: 'edge' };

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const MAX_TEXT_LENGTH = 4000;
const MAX_SHORT_LENGTH = 200;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function str(formData: FormData, key: string, max = MAX_SHORT_LENGTH): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function generateReference(): string {
  const year = new Date().getUTCFullYear();
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `RFQ-${year}-${random}`;
}

/** Stub — send the internal "New RFQ" notification once RESEND_API_KEY (or
 * equivalent) is configured. Subject format per spec:
 * "New RFQ — [Hotel Name] — [Country] — [RFQ Reference]". */
async function notifyHadaraTeam(submission: RfqSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.info('[rfq] notifyHadaraTeam: RESEND_API_KEY not set, skipping internal email', submission.system.reference);
    return;
  }
  // TODO: send via Resend (or chosen provider) to the internal inbox, subject:
  // `New RFQ — ${submission.property.companyName} — ${submission.property.country} — ${submission.system.reference}`
}

/** Stub — send the customer-facing confirmation email once configured. */
async function confirmToCustomer(submission: RfqSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.info('[rfq] confirmToCustomer: RESEND_API_KEY not set, skipping', submission.system.reference);
    return;
  }
  // TODO: send a confirmation email to submission.contact.workEmail with the reference number.
}

/** Stub — create/update Contact, Company and a Deal in HubSpot once configured. */
async function syncToHubSpot(submission: RfqSubmission): Promise<void> {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.info('[rfq] syncToHubSpot: HUBSPOT_ACCESS_TOKEN not set, skipping', submission.system.reference);
    return;
  }
  // TODO: Contact (email/name/phone) -> Company (companyName/country) -> Deal (reference, categories, notes).
}

/** Stub — persist the uploaded file once BLOB_READ_WRITE_TOKEN (Vercel Blob) or
 * equivalent object storage is configured. Until then, the file is validated
 * but its bytes are discarded after this request — only its metadata is kept. */
async function persistUploadedFile(file: File, reference: string): Promise<{ stored: boolean; url?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.info('[rfq] persistUploadedFile: no storage configured, discarding file bytes', reference, file.name);
    return { stored: false };
  }
  // TODO: upload `file` to Vercel Blob (or chosen storage) under a key namespaced by `reference`.
  return { stored: false };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_body', message: 'Expected multipart/form-data.' }, 400);
  }

  // --- Anti-spam: honeypot + minimum time-on-form -------------------------
  // Both signals indicate automated submission. We don't tell the caller
  // which check failed (or that one failed at all) — respond as if the
  // submission succeeded, but skip all real processing, so a bot has no
  // feedback loop to iterate against.
  const honeypot = str(formData, 'website');
  const renderedAtRaw = str(formData, 'formRenderedAt');
  const renderedAt = Number(renderedAtRaw);
  const tooFast = Number.isFinite(renderedAt) && Date.now() - renderedAt < 2000;
  if (honeypot || tooFast) {
    return json({ ok: true, reference: generateReference(), submittedAt: new Date().toISOString() }, 200);
  }

  // --- Required-field validation (never trust the client alone) ----------
  const fullName = str(formData, 'fullName');
  const workEmail = str(formData, 'workEmail');
  const companyName = str(formData, 'companyName');
  const propertyType = str(formData, 'propertyType');
  const country = str(formData, 'country');
  const deliveryCountry = str(formData, 'deliveryCountry');
  const categories = formData.getAll('categories').filter((v): v is string => typeof v === 'string' && v.length > 0);

  const missing: string[] = [];
  if (!fullName) missing.push('fullName');
  if (!workEmail) missing.push('workEmail');
  if (!companyName) missing.push('companyName');
  if (!propertyType) missing.push('propertyType');
  if (!country) missing.push('country');
  if (!deliveryCountry) missing.push('deliveryCountry');
  if (categories.length === 0) missing.push('categories');
  if (missing.length > 0) {
    return json({ ok: false, error: 'validation', fields: missing }, 400);
  }
  if (!isValidWorkEmail(workEmail)) {
    return json({ ok: false, error: 'validation', fields: ['workEmail'] }, 400);
  }

  // --- File validation (optional field) -----------------------------------
  const fileEntry = formData.get('file');
  let fileMeta: { name: string; size: number; type: string } | null = null;
  let uploadedFile: File | null = null;
  if (fileEntry instanceof File && fileEntry.size > 0) {
    if (!isValidRfqFile(fileEntry)) {
      return json(
        {
          ok: false,
          error: 'invalid_file',
          message: fileEntry.size > RFQ_FILE_MAX_BYTES ? 'File exceeds the 10 MB limit.' : 'Unsupported file type.',
        },
        400,
      );
    }
    uploadedFile = fileEntry;
    fileMeta = { name: fileEntry.name, size: fileEntry.size, type: fileEntry.type };
  }

  // --- Optional product metadata, passed through from a product page ------
  const productMetaRaw = str(formData, 'productMeta', 2000);
  let selectedProduct: RfqProductMeta | undefined;
  if (productMetaRaw) {
    try {
      const parsed = JSON.parse(productMetaRaw);
      if (parsed && typeof parsed === 'object') selectedProduct = parsed as RfqProductMeta;
    } catch {
      // Ignore malformed product metadata — it's a nice-to-have, not a required field.
    }
  }

  const reference = generateReference();
  const submission: RfqSubmission = {
    contact: {
      fullName,
      workEmail,
      phone: str(formData, 'phone') || undefined,
      preferredContact: str(formData, 'preferredContact') || undefined,
    },
    property: {
      companyName,
      propertyType,
      hotelCategory: str(formData, 'hotelCategory') || undefined,
      roomsKeys: str(formData, 'roomsKeys', 20) || undefined,
      country,
      city: str(formData, 'city') || undefined,
    },
    products: {
      categories,
      selectedProduct,
      estimatedQuantity: str(formData, 'estimatedQuantity', 300) || undefined,
    },
    project: {
      projectType: str(formData, 'projectType') || undefined,
      deliveryCountry,
      deliveryCity: str(formData, 'deliveryCity') || undefined,
      targetDeliveryDate: str(formData, 'targetDeliveryDate', 20) || undefined,
      customBranding: str(formData, 'customBranding', 20) || undefined,
      sampleRequired: str(formData, 'sampleRequired', 20) || undefined,
    },
    specifications: {
      notes: str(formData, 'notes', MAX_TEXT_LENGTH) || undefined,
      additionalMessage: str(formData, 'additionalMessage', MAX_TEXT_LENGTH) || undefined,
      uploadedFile: fileMeta,
    },
    system: {
      submittedAt: new Date().toISOString(),
      reference,
      sourcePage: str(formData, 'sourcePage', 300) || undefined,
      locale: str(formData, 'locale', 10) || undefined,
    },
  };

  try {
    const tasks: Promise<unknown>[] = [notifyHadaraTeam(submission), confirmToCustomer(submission), syncToHubSpot(submission)];
    if (uploadedFile) tasks.push(persistUploadedFile(uploadedFile, reference));
    await Promise.all(tasks);
  } catch (error) {
    // Integration stubs shouldn't be able to fail the submission itself —
    // the RFQ was validated and has a reference; log and move on.
    console.error('[rfq] post-submission integration error', reference, error);
  }

  return json({ ok: true, reference, submittedAt: submission.system.submittedAt }, 200);
}
