// Shared Resend sender — extracted from api/submit-quote.ts (which now
// imports from here too) so the Partner Portal's own notification emails
// (src/lib/portal-email.ts) don't duplicate this. Same silent-no-op-until-
// configured behavior: a missing RESEND_API_KEY must never break the
// feature that's trying to send, only skip the email.
export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function resendApiKey(): string | undefined {
  return (import.meta as { env?: Record<string, string | undefined> }).env?.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
}

function resendFromAddress(): string {
  const fromEnv = (import.meta as { env?: Record<string, string | undefined> }).env?.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL;
  return fromEnv || 'HADARA Hospitality <onboarding@resend.dev>';
}

export function hasResendConfigured(): boolean {
  return Boolean(resendApiKey());
}

/** Sends via the Resend API (https://resend.com). Throws on failure so the
 * caller's try/catch can log it — a failed email must never fail the
 * feature that triggered it, since that feature's own work already
 * succeeded (the RFQ was saved, the order status was updated, ...). */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = resendApiKey();
  if (!apiKey) return;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: resendFromAddress(), to, subject, html }),
  });
  if (!response.ok) {
    throw new Error(`Resend API error ${response.status}: ${await response.text().catch(() => '')}`);
  }
}
