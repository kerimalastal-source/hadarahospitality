// Shared constants for the Partner Portal, mirroring the RFQ pattern in
// src/lib/rfq.ts: one place for values used by both a page/script and an
// upload endpoint, so they can't drift.

/** Path prefix every portal document upload is stored under in the Blob
 * store, so api/blob-upload.ts can allow it alongside RFQ_BLOB_PATH_PREFIX. */
export const PORTAL_BLOB_PATH_PREFIX = 'portal/';

export const PORTAL_FILE_MAX_BYTES = 10 * 1024 * 1024;
export const PORTAL_FILE_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

/** True for a URL that actually looks like a Vercel Blob public URL — same
 * check as isValidRfqBlobUrl in src/lib/rfq.ts, so the upload-document API
 * doesn't trust an arbitrary client-supplied fileUrl. */
export function isValidPortalBlobUrl(url: string): boolean {
  return /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(url);
}

export const ORDER_STATUS_STAGES = [
  'quote_requested',
  'samples_sent',
  'quote_in_preparation',
  'quoted',
  'confirmed',
  'in_production',
  'shipped',
  'delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUS_STAGES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  quote_requested: 'Received / under review',
  samples_sent: 'Samples sent',
  quote_in_preparation: 'Quote in preparation',
  quoted: 'Quote sent',
  confirmed: 'Confirmed',
  in_production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

/** Parses an optional numeric form field (room count, annual guests
 * estimate) into a positive integer, or null when blank/invalid — these
 * columns are nullable, so "not provided" must stay null rather than 0. */
export function parsePositiveInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
