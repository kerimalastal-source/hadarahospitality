// Shared Country -> City cascading-dropdown behavior, used by the RFQ form
// (src/scripts/rfq-form.ts) and the portal's onboarding/profile forms
// (src/scripts/portal-company-fields.ts). The City select starts disabled
// with a "select a country first" option; choosing a country repopulates it
// with just that country's cities (from CITIES_BY_COUNTRY) and enables it.
import { CITIES_BY_COUNTRY } from '../data/cities';

export function wireCountryCity(countrySelect: HTMLSelectElement | null, citySelect: HTMLSelectElement | null) {
  if (!countrySelect || !citySelect) return;
  const lockedPlaceholder = citySelect.querySelector<HTMLOptionElement>('option[value=""]')?.textContent ?? '';
  const readyPlaceholder = citySelect.dataset.readyPlaceholder ?? lockedPlaceholder;

  countrySelect.addEventListener('change', () => {
    const cities = CITIES_BY_COUNTRY[countrySelect.value] ?? [];
    const previousValue = citySelect.value;
    citySelect.innerHTML = '';
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = cities.length ? readyPlaceholder : lockedPlaceholder;
    citySelect.appendChild(placeholderOption);
    for (const city of cities) {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    }
    citySelect.disabled = cities.length === 0;
    if (cities.includes(previousValue)) citySelect.value = previousValue;
  });
}
