import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Singleton connection — avoids exhausting the pool in dev (hot reload)
const globalForDb = globalThis as unknown as { _pgClient?: postgres.Sql };
const client = globalForDb._pgClient ?? postgres(process.env.DATABASE_URL);
if (process.env.NODE_ENV !== "production") globalForDb._pgClient = client;

export const db = drizzle(client, { schema });
