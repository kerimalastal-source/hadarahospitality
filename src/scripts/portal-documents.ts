// Client-side upload for /portal/documents — same client-upload pattern as
// src/scripts/rfq-form.ts (bytes go straight to Vercel Blob, only the
// resulting URL is posted to our own API), reusing api/blob-upload.ts's
// now-shared token endpoint (see PORTAL_BLOB_PATH_PREFIX in src/lib/portal.ts).
import { upload } from '@vercel/blob/client';
import { PORTAL_BLOB_PATH_PREFIX } from '../lib/portal';

const form = document.querySelector<HTMLFormElement>('#portal-upload-form');
const input = document.querySelector<HTMLInputElement>('#portal-upload-input');
const submitButton = document.querySelector<HTMLButtonElement>('#portal-upload-submit');
const errorEl = document.querySelector<HTMLElement>('#portal-upload-error');

if (form && input) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = input.files?.[0];
    if (!file) return;
    if (errorEl) errorEl.style.display = 'none';
    if (submitButton) submitButton.disabled = true;

    try {
      const blob = await upload(`${PORTAL_BLOB_PATH_PREFIX}${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
      });
      const response = await fetch('/portal-actions/upload-document', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fileUrl: blob.url, fileName: file.name }),
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
