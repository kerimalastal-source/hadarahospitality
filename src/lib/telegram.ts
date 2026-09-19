// Shared Telegram sender for real-time mobile notifications — new-visitor
// pings (portal-actions/track-visit.ts) and new-RFQ alerts
// (api/submit-quote.ts). Same silent-no-op-until-configured convention as
// src/lib/email.ts: a missing token/chat id must never break the feature
// that's trying to notify, only skip the notification. See CLAUDE.md's
// "Live visitor tracking" section for how to create the bot and find the
// chat id.
function telegramBotToken(): string | undefined {
  return (import.meta as { env?: Record<string, string | undefined> }).env?.TELEGRAM_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN;
}

function telegramChatId(): string | undefined {
  return (import.meta as { env?: Record<string, string | undefined> }).env?.TELEGRAM_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID;
}

export function hasTelegramConfigured(): boolean {
  return Boolean(telegramBotToken() && telegramChatId());
}

/** Sends via the Telegram Bot API. Throws on failure so the caller's
 * .catch() can log it — a failed notification must never fail the feature
 * that triggered it (the visit was already tracked, the RFQ already saved). */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = telegramBotToken();
  const chatId = telegramChatId();
  if (!token || !chatId) return;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!response.ok) {
    throw new Error(`Telegram API error ${response.status}: ${await response.text().catch(() => '')}`);
  }
}
