import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Singleton connection — avoids exhausting the pool in dev (hot reload).
// max: 1 keeps each build worker / serverless function to a single connection
// so concurrent prerendering doesn't exhaust the Supabase pooler (pool_size 15).
// prepare: false makes it safe with either Supabase pooler mode.
const globalForDb = globalThis as unknown as { _pgClient?: postgres.Sql };
const client =
  globalForDb._pgClient ??
  postgres(process.env.DATABASE_URL, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
  });
if (process.env.NODE_ENV !== "production") globalForDb._pgClient = client;

export const db = drizzle(client, { schema });
