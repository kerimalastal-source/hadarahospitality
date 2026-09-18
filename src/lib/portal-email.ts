// Partner Portal notification emails — same Resend pattern as the RFQ
// system's notifyHadaraTeam/confirmToCustomer (src/lib/email.ts), just
// triggered from portal API routes instead of api/submit-quote.ts. Every
// call here is fire-and-forget from the caller's point of view: a failed or
// unconfigured email must never fail the action that triggered it (account
// approval, a status update, a new quote), since that action already
// succeeded in the database.
import { sendEmail, escapeHtml, hasResendConfigured } from './email';
import { ORDER_STATUS_LABELS, type OrderStatus } from './portal';
import { SITE_URL } from '../config';

function wrap(bodyHtml: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;color:#1e2a38">${bodyHtml}<p style="font-size:12px;color:#8b6634;margin-top:26px">HADARA Hospitality · Istanbul, Türkiye</p></div>`;
}

export async function notifyAccountApproved(to: string, fullName: string): Promise<void> {
  if (!hasResendConfigured()) return;
  const html = wrap(`
    <h2 style="margin:0 0 14px;font-size:20px">Welcome, ${escapeHtml(fullName)}.</h2>
    <p style="font-size:14px;line-height:1.7;color:#626a72">Your HADARA Partner Portal account has been approved — you can now sign in to track your orders, quotes and documents.</p>
    <p style="margin-top:22px"><a href="${SITE_URL}/portal/sign-in" style="background:#c5a059;color:#1e2a38;padding:12px 20px;text-decoration:none;font-weight:bold;font-size:13px">Sign in →</a></p>
  `);
  await sendEmail(to, 'Your HADARA Partner Portal account is approved', html);
}

export async function notifyOrderStatusUpdated(recipients: string[], reference: string, status: OrderStatus, note?: string | null): Promise<void> {
  if (!hasResendConfigured() || recipients.length === 0) return;
  const html = wrap(`
    <h2 style="margin:0 0 14px;font-size:20px">Order ${escapeHtml(reference)} updated</h2>
    <p style="font-size:14px;line-height:1.7;color:#626a72">New status: <strong>${escapeHtml(ORDER_STATUS_LABELS[status])}</strong></p>
    ${note ? `<p style="font-size:13px;color:#626a72">${escapeHtml(note)}</p>` : ''}
    <p style="margin-top:22px"><a href="${SITE_URL}/portal/orders" style="background:#c5a059;color:#1e2a38;padding:12px 20px;text-decoration:none;font-weight:bold;font-size:13px">View in the portal →</a></p>
  `);
  await Promise.allSettled(recipients.map((to) => sendEmail(to, `Order ${reference} — ${ORDER_STATUS_LABELS[status]}`, html)));
}

export async function notifyNewQuote(recipients: string[], reference: string): Promise<void> {
  if (!hasResendConfigured() || recipients.length === 0) return;
  const html = wrap(`
    <h2 style="margin:0 0 14px;font-size:20px">A new quote is ready</h2>
    <p style="font-size:14px;line-height:1.7;color:#626a72">A quote for order <strong>${escapeHtml(reference)}</strong> is now available in your partner portal.</p>
    <p style="margin-top:22px"><a href="${SITE_URL}/portal/quotes" style="background:#c5a059;color:#1e2a38;padding:12px 20px;text-decoration:none;font-weight:bold;font-size:13px">View quotes →</a></p>
  `);
  await Promise.allSettled(recipients.map((to) => sendEmail(to, `New quote — ${reference}`, html)));
}
