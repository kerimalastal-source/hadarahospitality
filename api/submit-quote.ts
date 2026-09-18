// Vercel Edge Function — RFQ submission intake for /get-a-quote.html.
//
// This lives outside src/ on purpose: the site itself is a fully static
// Astro build (see CLAUDE.md), and Vercel deploys any file under /api at
// the project root as a serverless/edge function independently of that,
// with zero framework config. Using the Edge runtime (not the Node
// runtime) gets us the standard Request/Response/FormData Web APIs for
// free, so multipart parsing needs no extra dependency.
//
// The uploaded RFQ file itself never passes through this function's body:
// the browser uploads it directly to Vercel Blob storage before calling
// this endpoint (see api/blob-upload.ts and the "Client uploads" section
// of src/scripts/rfq-form.ts), and only the resulting URL + metadata are
// submitted here as plain form fields. That split exists because
// @vercel/blob needs the Node.js runtime, which this Edge function isn't —
// see api/blob-upload.ts's top comment for the full story.
//
// What's real right now: full server-side validation, a lightweight
// anti-spam gate, and a generated RFQ reference number returned to the
// caller. What's stubbed: email and HubSpot sync are no-ops until their
// environment variables are configured — each one logs what it *would* do
// so this is easy to find and wire up later. See CLAUDE.md for the exact
// env vars each one needs.

import { isValidRfqBlobUrl, isValidWorkEmail, type RfqProductMeta, type RfqSubmission } from '../src/lib/rfq.js';
import { CONTACT_EMAIL } from '../src/config.js';

export const config = { runtime: 'edge' };

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const MAX_TEXT_LENGTH = 4000;
const MAX_SHORT_LENGTH = 200;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Sends via the Resend API (https://resend.com). Throws on failure so the
 * caller's try/catch can log it — a failed email must never fail the RFQ
 * submission itself, since the submission was already validated. */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const from = process.env.RESEND_FROM_EMAIL || 'HADARA Hospitality <onboarding@resend.dev>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!response.ok) {
    throw new Error(`Resend API error ${response.status}: ${await response.text().catch(() => '')}`);
  }
}

function row(label: string, value?: string): string {
  if (!value) return '';
  return `<tr><td style="padding:5px 16px 5px 0;color:#626a72;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:5px 0;font-size:13px;color:#1e2a38">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`;
}

function fileRow(file?: { name: string; size: number; url: string } | null): string {
  if (!file) return '';
  const sizeLabel = `${(file.size / 1024).toFixed(0)} KB`;
  const value = `<a href="${escapeHtml(file.url)}" style="color:#8b6634">${escapeHtml(file.name)}</a> (${sizeLabel})`;
  return `<tr><td style="padding:5px 16px 5px 0;color:#626a72;font-size:13px;white-space:nowrap;vertical-align:top">Attached file</td><td style="padding:5px 0;font-size:13px;color:#1e2a38">${value}</td></tr>`;
}

function renderInternalEmail(s: RfqSubmission): string {
  const sp = s.products.selectedProduct;
  const selectedProductLine = sp ? [sp.name, sp.material, sp.gsm].filter(Boolean).join(' — ') : undefined;
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;color:#1e2a38">
    <h2 style="margin:0 0 4px;font-size:20px">New RFQ — ${escapeHtml(s.property.companyName)}</h2>
    <p style="color:#626a72;font-size:13px;margin:0 0 22px">Reference <strong>${s.system.reference}</strong> · ${escapeHtml(s.system.submittedAt)}</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
      ${row('Full name', s.contact.fullName)}
      ${row('Work email', s.contact.workEmail)}
      ${row('Phone / WhatsApp', s.contact.phone)}
      ${row('Preferred contact', s.contact.preferredContact)}
      ${row('Company / hotel', s.property.companyName)}
      ${row('Property type', s.property.propertyType)}
      ${row('Hotel category', s.property.hotelCategory)}
      ${row('Rooms / keys', s.property.roomsKeys)}
      ${row('Country', s.property.country)}
      ${row('City', s.property.city)}
      ${row('Product categories', s.products.categories.join(', '))}
      ${row('Selected product', selectedProductLine)}
      ${row('Estimated quantity', s.products.estimatedQuantity)}
      ${row('Project type', s.project.projectType)}
      ${row('Delivery country', s.project.deliveryCountry)}
      ${row('Delivery city', s.project.deliveryCity)}
      ${row('Target delivery date', s.project.targetDeliveryDate)}
      ${row('Custom branding', s.project.customBranding)}
      ${row('Sample required', s.project.sampleRequired)}
      ${row('Notes / specifications', s.specifications.notes)}
      ${row('Additional message', s.specifications.additionalMessage)}
      ${fileRow(s.specifications.uploadedFile)}
      ${row('Source page', s.system.sourcePage)}
    </table>
  </div>`;
}

function renderCustomerEmail(s: RfqSubmission): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;color:#1e2a38">
    <h2 style="margin:0 0 14px;font-size:20px">Thank you, ${escapeHtml(s.contact.fullName)}.</h2>
    <p style="font-size:14px;line-height:1.7;color:#626a72">We've received your quote request for <strong>${escapeHtml(s.property.companyName)}</strong>. Our team will review your requirements and get back to you shortly.</p>
    <p style="font-size:13px;color:#626a72;margin-top:20px">Reference number</p>
    <p style="font:22px Georgia,serif;color:#1e2a38;margin:2px 0 22px">${s.system.reference}</p>
    <p style="font-size:12px;color:#8b6634">HADARA Hospitality · Istanbul, Türkiye</p>
  </div>`;
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

/** Sends the internal "New RFQ" notification to partnerships@hadarahospitality.com
 * (CONTACT_EMAIL) once RESEND_API_KEY is configured; a no-op until then. */
async function notifyHadaraTeam(submission: RfqSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.info('[rfq] notifyHadaraTeam: RESEND_API_KEY not set, skipping internal email', submission.system.reference);
    return;
  }
  const subject = `New RFQ — ${submission.property.companyName} — ${submission.property.country} — ${submission.system.reference}`;
  await sendEmail(process.env.RFQ_NOTIFY_EMAIL || CONTACT_EMAIL, subject, renderInternalEmail(submission));
}

/** Sends the customer-facing confirmation email once RESEND_API_KEY is configured. */
async function confirmToCustomer(submission: RfqSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.info('[rfq] confirmToCustomer: RESEND_API_KEY not set, skipping', submission.system.reference);
    return;
  }
  await sendEmail(submission.contact.workEmail, `We've received your request — ${submission.system.reference}`, renderCustomerEmail(submission));
}

/** Stub — create/update Contact, Company and a Deal in HubSpot once configured. */
async function syncToHubSpot(submission: RfqSubmission): Promise<void> {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.info('[rfq] syncToHubSpot: HUBSPOT_ACCESS_TOKEN not set, skipping', submission.system.reference);
    return;
  }
  // TODO: Contact (email/name/phone) -> Company (companyName/country) -> Deal (reference, categories, notes).
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

  // --- Uploaded file (optional field) --------------------------------------
  // Already uploaded to Blob storage client-side by this point (see the
  // top-of-file comment) — this is just the resulting metadata, sent as
  // plain form fields. isValidRfqBlobUrl() guards against trusting an
  // arbitrary client-supplied URL (e.g. embedding it in the internal email).
  const fileUrl = str(formData, 'fileUrl', 2000);
  const fileName = str(formData, 'fileName', 300);
  const fileSize = Number(str(formData, 'fileSize', 20));
  const fileType = str(formData, 'fileType', 200);
  const fileMeta =
    fileUrl && fileName && isValidRfqBlobUrl(fileUrl)
      ? { name: fileName, size: Number.isFinite(fileSize) ? fileSize : 0, type: fileType, url: fileUrl }
      : null;

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

  // allSettled, not all: one integration failing (e.g. email) must never stop
  // the others from running, and must never fail the submission itself — the
  // RFQ was already validated and has a reference number.
  const tasks: Promise<unknown>[] = [notifyHadaraTeam(submission), confirmToCustomer(submission), syncToHubSpot(submission)];
  const results = await Promise.allSettled(tasks);
  results.forEach((result) => {
    if (result.status === 'rejected') console.error('[rfq] post-submission integration error', reference, result.reason);
  });

  return json({ ok: true, reference, submittedAt: submission.system.submittedAt }, 200);
}
