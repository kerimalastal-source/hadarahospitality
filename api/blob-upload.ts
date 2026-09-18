// Vercel Node.js Function — issues short-lived client tokens for direct
// browser-to-Blob RFQ file uploads.
//
// Why a second function, on a different runtime, instead of doing this in
// api/submit-quote.ts: @vercel/blob (both its main export and its /client
// export) pulls in Node built-ins (node:stream, node:net, node:tls, the
// `undici` package, ...) that the Edge sandbox api/submit-quote.ts runs on
// rejects outright at build time — a real attempt at handling the upload
// there shipped and broke production (see CLAUDE.md's RFQ section for the
// story). This function has none of that constraint: it's on Vercel's
// default Node.js runtime (no `export const config` needed — Node.js is
// the default when a function doesn't opt into Edge).
//
// The flow: the browser (src/scripts/rfq-form.ts) calls @vercel/blob/client's
// upload(), pointing handleUploadUrl at this route. That client call first
// POSTs here to get a token (handled below), then uploads the file bytes
// straight to Vercel Blob storage — this function's body is never in that
// data path, so there's no multipart-parsing or payload-size concern here
// at all, on either runtime.
//
// Signature: the classic, always-supported Vercel Node.js Function shape,
// (req, res) — not the Web Request/Response signature api/submit-quote.ts
// uses, which is an Edge-only guarantee. Minimal local types below instead
// of depending on @vercel/node purely for typing (it pulls in ~100
// unrelated packages for what's otherwise a type-only import).

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { RFQ_BLOB_PATH_PREFIX, RFQ_FILE_MAX_BYTES, RFQ_FILE_MIME_TYPES } from '../src/lib/rfq.js';
import { PORTAL_BLOB_PATH_PREFIX, PORTAL_FILE_MAX_BYTES, PORTAL_FILE_MIME_TYPES } from '../src/lib/portal.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

// This endpoint is shared by two unrelated upload flows (RFQ attachments and
// Partner Portal documents) rather than duplicating the token-issuing logic —
// each pathname prefix maps to its own size/type limits.
const UPLOAD_PREFIXES = [
  { prefix: RFQ_BLOB_PATH_PREFIX, maxBytes: RFQ_FILE_MAX_BYTES, mimeTypes: RFQ_FILE_MIME_TYPES },
  { prefix: PORTAL_BLOB_PATH_PREFIX, maxBytes: PORTAL_FILE_MAX_BYTES, mimeTypes: PORTAL_FILE_MIME_TYPES },
];

interface VercelRequest extends IncomingMessage {
  body: HandleUploadBody;
}
interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    response.status(500).json({ error: 'storage_not_configured' });
    return;
  }

  try {
    const result = await handleUpload({
      request,
      body: request.body,
      onBeforeGenerateToken: async (pathname) => {
        const match = UPLOAD_PREFIXES.find(({ prefix }) => pathname.startsWith(prefix));
        if (!match) {
          throw new Error('Invalid upload path.');
        }
        return {
          access: 'public',
          addRandomSuffix: true,
          allowedContentTypes: match.mimeTypes,
          maximumSizeInBytes: match.maxBytes,
        };
      },
    });
    response.status(200).json(result);
  } catch (error) {
    response.status(400).json({ error: 'upload_failed', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}
