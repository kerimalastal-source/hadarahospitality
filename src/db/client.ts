// Neon Postgres client for the Partner Portal. Requires POSTGRES_URL
// (auto-injected once a Postgres database is created in the Vercel project's
// Storage tab — see CLAUDE.md's "Partner Portal" section).
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not set — create a Postgres database in the Vercel project Storage tab.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
