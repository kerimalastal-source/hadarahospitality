// Drizzle schema for the HADARA Partner Portal (/portal/*).
// The rest of the site has no database — this is the one place data lives,
// used only by portal pages/API routes under src/pages/portal/ and
// src/pages/portal-actions/. See CLAUDE.md's "Partner Portal" section.
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const portalUserRole = pgEnum('portal_user_role', ['customer', 'staff']);
export const portalUserStatus = pgEnum('portal_user_status', ['pending', 'approved', 'rejected']);
export const orderStatus = pgEnum('order_status', [
  'quote_requested',
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
