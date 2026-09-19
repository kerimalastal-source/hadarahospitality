// Client-side behavior for the RFQ form on /get-a-quote: product
// pre-selection from URL params, drag-and-drop file upload, submission via
// fetch (no more mailto:), and analytics event hooks. Guarded so this is a
// no-op import on every other page.
import { isValidRfqFile, RFQ_FILE_MAX_BYTES, RFQ_BLOB_PATH_PREFIX, LEGACY_CATEGORY_TO_RFQ_CATEGORY, type RfqProductMeta } from '../lib/rfq';
import { wireCountryCity } from './country-city';
import { upload } from '@vercel/blob/client';

const form = document.querySelector<HTMLFormElement>('#rfq-form');

if (form) {
  // --- Analytics hooks (no provider wired up yet — see CLAUDE.md) --------
  function track(event: string, detail?: Record<string, unknown> | RfqProductMeta) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
    console.debug('[analytics]', event, detail);
  }
  let startedTracked = false;
  form.addEventListener(
    'focusin',
    () => {
      if (startedTracked) return;
      startedTracked = true;
      track('quote_form_started');
    },
    { once: true },
  );

  // --- Anti-spam timing signal --------------------------------------------
  const renderedAtField = form.querySelector<HTMLInputElement>('#rfq-rendered-at');
  if (renderedAtField) renderedAtField.value = String(Date.now());
  const sourcePageField = form.querySelector<HTMLInputElement>('#rfq-source-page');
  if (sourcePageField) sourcePageField.value = window.location.pathname + window.location.search;

  // --- Product pre-selection from URL params ------------------------------
  const selectedProductBanner = form.querySelector<HTMLElement>('#rfq-selected-product');
  const selectedProductName = form.querySelector<HTMLElement>('#rfq-selected-product-name');
  const removeProductButton = form.querySelector<HTMLButtonElement>('#rfq-remove-product');
  const productMetaField = form.querySelector<HTMLInputElement>('#rfq-product-meta');
  let autoCheckedCategory: HTMLInputElement | null = null;

  // --- Category product pickers -------------------------------------------
  // Each category chip that has real catalog products gets its own picker
  // panel (data-category-products, server-rendered by GetAQuoteView.astro
  // from RFQ_CATEGORY_PRODUCTS) revealed only while that chip is checked —
  // unchecking it also clears any products picked from it, so a hidden
  // panel never silently keeps stale selections in the submitted form data.
  function syncCategoryProductsPanel(checkbox: HTMLInputElement) {
    const panel = form!.querySelector<HTMLElement>(`[data-category-products="${CSS.escape(checkbox.value)}"]`);
    if (!panel) return;
    panel.hidden = !checkbox.checked;
    if (!checkbox.checked) {
      panel.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => (input.checked = false));
    }
  }
  form.querySelectorAll<HTMLInputElement>('input[data-category-checkbox]').forEach((checkbox) => {
    syncCategoryProductsPanel(checkbox);
    checkbox.addEventListener('change', () => {
      syncCategoryProductsPanel(checkbox);
      track('product_category_expanded', { category: checkbox.value, expanded: checkbox.checked });
    });
  });

  function applyProductFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('product');
    if (!name) return;
    const meta: RfqProductMeta = {
      name,
      slug: params.get('slug') ?? undefined,
      category: params.get('category') ?? undefined,
      material: params.get('material') ?? undefined,
      gsm: params.get('gsm') ?? undefined,
      size: params.get('size') ?? undefined,
      sku: params.get('sku') ?? undefined,
    };

    if (selectedProductBanner && selectedProductName) {
      selectedProductName.textContent = name;
      selectedProductBanner.hidden = false;
    }
    if (productMetaField) productMetaField.value = JSON.stringify(meta);

    const legacyCategory = params.get('category');
    const rfqCategory = legacyCategory ? LEGACY_CATEGORY_TO_RFQ_CATEGORY[legacyCategory] : undefined;
    if (rfqCategory) {
      const checkbox = form?.querySelector<HTMLInputElement>(`input[name="categories"][value="${CSS.escape(rfqCategory)}"]`);
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        autoCheckedCategory = checkbox;
        syncCategoryProductsPanel(checkbox);
        // Also pre-select the exact product, if this category's picker has it.
        if (meta.slug) {
          const productCheckbox = form?.querySelector<HTMLInputElement>(`input[name="products"][data-slug="${CSS.escape(meta.slug)}"]`);
          if (productCheckbox) productCheckbox.checked = true;
        }
      }
    }
    track('product_selected', meta);
  }
  applyProductFromUrl();

  // Multi-product hand-off from the /products listing page's "Request a
  // quote for selected products" (src/scripts/product-selection.ts) —
  // gated on ?fromSelection=1 so stray sessionStorage data from earlier
  // browsing never silently pre-checks anything on an unrelated visit to
  // this page. Reuses the same category-chip + specific-product-checkbox
  // mechanism as applyProductFromUrl() above, just for several products
  // at once instead of one.
  function applySelectionFromSession() {
    if (new URLSearchParams(window.location.search).get('fromSelection') !== '1') return;
    let items: { slug: string; name: string; category: string }[] = [];
    try {
      const raw = sessionStorage.getItem('hadara_rfq_selection');
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }
    if (items.length === 0) return;

    for (const item of items) {
      const categoryCheckbox = form?.querySelector<HTMLInputElement>(`input[name="categories"][value="${CSS.escape(item.category)}"]`);
      if (!categoryCheckbox) continue;
      if (!categoryCheckbox.checked) {
        categoryCheckbox.checked = true;
        syncCategoryProductsPanel(categoryCheckbox);
      }
      const productCheckbox = form?.querySelector<HTMLInputElement>(`input[name="products"][data-slug="${CSS.escape(item.slug)}"]`);
      if (productCheckbox) productCheckbox.checked = true;
    }

    try {
      sessionStorage.removeItem('hadara_rfq_selection');
    } catch {
      // Private browsing / storage disabled — harmless, nothing to clean up.
    }
    track('product_selected', { count: items.length, source: 'multi-select' });
  }
  applySelectionFromSession();

  // Lets a page like /hotel-opening-package pre-select "Project Type"
  // without going through the product hand-off above — independent of
  // whether a `product` param is also present.
  function applyProjectTypeFromUrl() {
    const projectType = new URLSearchParams(window.location.search).get('projectType');
    if (!projectType) return;
    const select = form?.querySelector<HTMLSelectElement>('select[name="projectType"]');
    if (!select) return;
    const option = Array.from(select.options).find((o) => o.value === projectType);
    if (option) select.value = projectType;
  }
  applyProjectTypeFromUrl();

  // Lets /request-a-sample (and any product page's "Request a sample"
  // button) pre-select the "Sample Required" radio, independent of the
  // other hand-offs above.
  function applySampleRequiredFromUrl() {
    const value = new URLSearchParams(window.location.search).get('sampleRequired');
    if (!value) return;
    const radio = form?.querySelector<HTMLInputElement>(`input[name="sampleRequired"][value="${CSS.escape(value)}"]`);
    if (radio) radio.checked = true;
  }
  applySampleRequiredFromUrl();

  removeProductButton?.addEventListener('click', () => {
    if (selectedProductBanner) selectedProductBanner.hidden = true;
    if (productMetaField) productMetaField.value = '';
    if (autoCheckedCategory) {
      autoCheckedCategory.checked = false;
      syncCategoryProductsPanel(autoCheckedCategory);
      autoCheckedCategory = null;
    }
  });

  // --- Country -> City cascading dropdowns --------------------------------
  // Applies to both the Country/City pair (section 1) and the Required
  // Delivery Country/City pair (section 3). See src/scripts/country-city.ts.
  wireCountryCity(form.querySelector<HTMLSelectElement>('#rfq-country'), form.querySelector<HTMLSelectElement>('#rfq-city'));
  wireCountryCity(form.querySelector<HTMLSelectElement>('#rfq-delivery-country'), form.querySelector<HTMLSelectElement>('#rfq-delivery-city'));

  // --- File upload: drag-and-drop + validation ----------------------------
  const dropzone = form.querySelector<HTMLElement>('#rfq-dropzone');
  const fileInput = form.querySelector<HTMLInputElement>('#rfq-file-input');
  const fileChip = form.querySelector<HTMLElement>('#rfq-file-chip');
  const fileNameEl = form.querySelector<HTMLElement>('#rfq-file-name');
  const fileSizeEl = form.querySelector<HTMLElement>('#rfq-file-size');
  const fileRemoveButton = form.querySelector<HTMLButtonElement>('#rfq-file-remove');
  const uploadError = form.querySelector<HTMLElement>('#rfq-upload-error');

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function showUploadError(kind: 'type' | 'size') {
    if (!uploadError) return;
    uploadError.textContent = uploadError.dataset[kind === 'type' ? 'errorType' : 'errorSize'] ?? '';
    uploadError.hidden = false;
  }

  function clearFile() {
    if (fileInput) fileInput.value = '';
    if (fileChip) fileChip.hidden = true;
    if (dropzone) dropzone.hidden = false;
  }

  function handleFile(file: File | undefined) {
    if (uploadError) uploadError.hidden = true;
    if (!file) return;
    if (!isValidRfqFile(file)) {
      showUploadError(file.size > RFQ_FILE_MAX_BYTES ? 'size' : 'type');
      clearFile();
      return;
    }
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = formatBytes(file.size);
    if (fileChip) fileChip.hidden = false;
    if (dropzone) dropzone.hidden = true;
  }

  dropzone?.addEventListener('click', () => fileInput?.click());
  dropzone?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput?.click();
    }
  });
  fileInput?.addEventListener('change', () => handleFile(fileInput.files?.[0]));
  fileRemoveButton?.addEventListener('click', () => clearFile());

  ['dragover', 'dragenter'].forEach((eventName) =>
    dropzone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add('rfq-dropzone-active');
    }),
  );
  ['dragleave', 'dragend'].forEach((eventName) =>
    dropzone?.addEventListener(eventName, () => dropzone.classList.remove('rfq-dropzone-active')),
  );
  dropzone?.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('rfq-dropzone-active');
    const file = event.dataTransfer?.files?.[0];
    if (!file || !fileInput) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    handleFile(file);
  });

  // --- Submission -----------------------------------------------------------
  const categoriesError = form.querySelector<HTMLElement>('#rfq-categories-error');
  const formError = form.querySelector<HTMLElement>('#rfq-form-error');
  const submitButton = form.querySelector<HTMLButtonElement>('#rfq-submit');
  const submitLabel = submitButton?.querySelector<HTMLElement>('.rfq-submit-label');
  const successPanel = document.querySelector<HTMLElement>('#rfq-success');
  const referenceValue = document.querySelector<HTMLElement>('#rfq-reference-value');

  let submitting = false;
  function setSubmitting(value: boolean) {
    submitting = value;
    if (submitButton) submitButton.disabled = value;
    if (submitLabel) submitLabel.textContent = (value ? submitButton?.dataset.labelBusy : submitButton?.dataset.labelIdle) ?? submitLabel.textContent;
  }

  function showSuccess(reference: string) {
    form!.hidden = true;
    if (successPanel) {
      successPanel.hidden = false;
      successPanel.focus();
    }
    if (referenceValue) referenceValue.textContent = reference;
    track('quote_form_success', { reference });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (categoriesError) categoriesError.hidden = true;
    if (formError) formError.hidden = true;
    if (uploadError) uploadError.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const categories = data.getAll('categories');
    if (categories.length === 0) {
      if (categoriesError) {
        categoriesError.hidden = false;
        categoriesError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    track('quote_form_submitted');

    // --- Client upload: the file goes straight to Blob storage from here,
    // never through /api/submit-quote's own body — see that function's
    // top comment for why. A failed upload doesn't abort the whole
    // submission: the file was always optional, so the RFQ still goes
    // through without its attachment rather than blocking the visitor.
    data.delete('file');
    const selectedFile = fileInput?.files?.[0];
    if (selectedFile) {
      try {
        const blob = await upload(`${RFQ_BLOB_PATH_PREFIX}${selectedFile.name}`, selectedFile, {
          access: 'public',
          handleUploadUrl: '/api/blob-upload',
        });
        data.set('fileUrl', blob.url);
        data.set('fileName', selectedFile.name);
        data.set('fileSize', String(selectedFile.size));
        data.set('fileType', selectedFile.type);
        track('rfq_file_uploaded', { name: selectedFile.name, size: selectedFile.size, url: blob.url });
      } catch (error) {
        console.error('[rfq] file upload failed, continuing without attachment', error);
        if (uploadError) {
          uploadError.textContent = uploadError.dataset.errorUpload ?? '';
          uploadError.hidden = false;
        }
      }
    }

    try {
      const response = await fetch('/api/submit-quote', { method: 'POST', body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        if (formError) formError.hidden = false;
        setSubmitting(false);
        return;
      }
      showSuccess(result.reference as string);

      // Best-effort: if this visitor is a signed-in, onboarded portal
      // customer, also create a linked Order in their dashboard. Silently
      // no-ops for everyone else — never awaited, never blocks the success
      // state above either way.
      data.set('reference', result.reference as string);
      fetch('/portal-actions/link-quote-request', { method: 'POST', body: data }).catch(() => {});
    } catch {
      if (formError) formError.hidden = false;
      setSubmitting(false);
    }
  });
}
