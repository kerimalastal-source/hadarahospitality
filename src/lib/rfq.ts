// Shared RFQ data model + constants, used by both the client-side form
// (src/scripts/rfq-form.ts) and the submission API (api/submit-quote.ts),
// so validation rules and allowed values stay in one place.

/** Product metadata a product page can hand off to the RFQ form via URL params.
 * Deliberately generic — not tied to any single product's field set — so future
 * fields (SKU, thread count, size, ...) can be added without touching the form. */
export interface RfqProductMeta {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  material?: string;
  gsm?: string;
  threadCount?: string;
  size?: string;
  sku?: string;
}

export interface RfqSubmission {
  contact: {
    fullName: string;
    workEmail: string;
    phone?: string;
    preferredContact?: string;
  };
  property: {
    companyName: string;
    propertyType: string;
    hotelCategory?: string;
    roomsKeys?: string;
    country: string;
    city?: string;
  };
  products: {
    categories: string[];
    selectedProduct?: RfqProductMeta;
    estimatedQuantity?: string;
  };
  project: {
    projectType?: string;
    deliveryCountry: string;
    deliveryCity?: string;
    targetDeliveryDate?: string;
    customBranding?: string;
    sampleRequired?: string;
  };
  specifications: {
    notes?: string;
    additionalMessage?: string;
    uploadedFile?: { name: string; size: number; type: string } | null;
  };
  system: {
    submittedAt: string;
    reference: string;
    sourcePage?: string;
    locale?: string;
  };
}

export const RFQ_FILE_MAX_BYTES = 10 * 1024 * 1024;
export const RFQ_FILE_EXTENSIONS = ['.pdf', '.xls', '.xlsx', '.doc', '.docx'];
export const RFQ_FILE_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function isValidRfqFile(file: { name: string; size: number; type: string }): boolean {
  if (file.size > RFQ_FILE_MAX_BYTES) return false;
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (RFQ_FILE_EXTENSIONS.includes(extension)) return true;
  return RFQ_FILE_MIME_TYPES.includes(file.type);
}

export function isValidWorkEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Maps a product page's legacy `?category=` value (CATEGORIES[key].formCategory
 * in src/data/products.ts) to the closest RFQ form product-category checkbox, so
 * arriving from a product page can pre-check the matching category. */
export const LEGACY_CATEGORY_TO_RFQ_CATEGORY: Record<string, string> = {
  'Towels & bath': 'Towels & Bath Linen',
  'Robes & slippers': 'Bathrobes',
  'Bed linen & bedding': 'Bed Linen',
  'Pillows & duvets': 'Pillows & Duvets',
  'Mattress protectors': 'Mattress Protectors',
  'Other hospitality essentials': 'Guest Room Accessories',
};
