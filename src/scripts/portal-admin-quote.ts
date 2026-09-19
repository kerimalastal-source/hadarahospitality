// Staff-side quote-PDF upload on an order's admin edit page — same
// client-upload pattern as src/scripts/portal-documents.ts, posting to
// /portal-actions/attach-quote once the file is in Blob storage.
import { upload } from '@vercel/blob/client';
import { PORTAL_BLOB_PATH_PREFIX } from '../lib/portal';

const form = document.querySelector<HTMLFormElement>('#portal-quote-form');
const input = document.querySelector<HTMLInputElement>('#portal-quote-input');
const orderIdField = document.querySelector<HTMLInputElement>('#portal-quote-order-id');
const amountField = document.querySelector<HTMLInputElement>('#portal-quote-amount');
const currencyField = document.querySelector<HTMLInputElement>('#portal-quote-currency');
const submitButton = document.querySelector<HTMLButtonElement>('#portal-quote-submit');
const errorEl = document.querySelector<HTMLElement>('#portal-quote-error');

if (form && input && orderIdField) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = input.files?.[0];
    if (!file) return;
    if (errorEl) errorEl.style.display = 'none';
    if (submitButton) submitButton.disabled = true;

    try {
      const blob = await upload(`${PORTAL_BLOB_PATH_PREFIX}quotes/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
      });
      const response = await fetch('/portal-actions/attach-quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          orderId: orderIdField.value,
          fileUrl: blob.url,
          amount: amountField?.value || undefined,
          currency: currencyField?.value || undefined,
        }),
      });
      if (!response.ok) throw new Error('save_failed');
      window.location.reload();
    } catch {
      if (errorEl) {
        errorEl.textContent = 'Upload failed — please try again.';
        errorEl.style.display = 'block';
      }
      if (submitButton) submitButton.disabled = false;
    }
  });
}
