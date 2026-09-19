// Wires the Country -> City cascade on the portal's onboarding and profile
// forms (only one of the two exists on any given page, so the same ids are
// reused safely). Everything else on those forms is plain server-rendered
// HTML posted with a normal form submit — no other client behavior needed.
import { wireCountryCity } from './country-city';

wireCountryCity(
  document.querySelector<HTMLSelectElement>('#portal-country'),
  document.querySelector<HTMLSelectElement>('#portal-city'),
);
