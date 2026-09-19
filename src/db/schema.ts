// Drizzle schema for the HADARA Partner Portal (/portal/*) and the
// anonymous live-visitor tracking feature (see visitorEvents below — the
// one table here that isn't portal-specific, but lives in this same file/DB
// since it's the site's only database). Used by portal pages/API routes
// under src/pages/portal/ and src/pages/portal-actions/, plus
// api/submit-quote.ts and portal-actions/track-visit.ts for visitorEvents.
// See CLAUDE.md's "Partner Portal" and "Live visitor tracking" sections.
import { pgTable, uuid, text, integer, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';

export const portalUserRole = pgEnum('portal_user_role', ['customer', 'staff']);
export const portalUserStatus = pgEnum('portal_user_status', ['pending', 'approved', 'rejected']);
export const orderStatus = pgEnum('order_status', [
  'quote_requested',
  'samples_sent',
  'quote_in_preparation',
  'quoted',
  'confirmed',
  'in_production',
  'shipped',
  'delivered',
]);
export const documentKind = pgEnum('document_kind', ['customer_upload', 'catalog']);

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  country: text('country'),
  city: text('city'),
  roomCount: integer('room_count'),
  annualGuestsEstimate: integer('annual_guests_estimate'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const portalUsers = pgTable('portal_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  companyId: uuid('company_id').references(() => companies.id),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: portalUserRole('role').notNull().default('customer'),
  status: portalUserStatus('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .references(() => companies.id)
    .notNull(),
  reference: text('reference').notNull(),
  status: orderStatus('status').notNull().default('quote_requested'),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => portalUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderStatusEvents = pgTable('order_status_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  status: orderStatus('status').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  fileUrl: text('file_url').notNull(),
  amount: text('amount'),
  currency: text('currency'),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
});

export const portalDocuments = pgTable('portal_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .references(() => companies.id)
    .notNull(),
  orderId: uuid('order_id').references(() => orders.id),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  uploadedBy: uuid('uploaded_by').references(() => portalUsers.id),
  kind: documentKind('kind').notNull().default('customer_upload'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});

// One row per page view from an anonymous site visitor (never the Partner
// Portal itself — see track-visit.ts). Deliberately holds no PII: sessionId
// is a random UUID generated client-side and kept only in sessionStorage
// (cleared when the browser tab closes, never a persistent cookie);
// country/city are derived from Vercel's edge geo headers, never a raw IP.
// A visitor who submits an RFQ or signs up for the Partner Portal is
// identified through those existing, separate flows — this table only ever
// answers "where are anonymous visitors coming from and where do they go."
export const visitorEvents = pgTable(
  'visitor_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: text('session_id').notNull(),
    path: text('path').notNull(),
    locale: text('locale'),
    referrer: text('referrer'),
    country: text('country'),
    city: text('city'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('visitor_events_session_id_idx').on(table.sessionId), index('visitor_events_created_at_idx').on(table.createdAt)],
);
