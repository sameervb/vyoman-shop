import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

// Lazy singleton — only created on first use (not at module load time)
let _db: ReturnType<typeof getDb> | null = null;

export function getDbClient() {
  if (!_db) _db = getDb();
  return _db;
}

// Named exports that match drizzle's table structure for direct use in route handlers
export { schema };
export { orders, orderItems } from "./schema";

// Default export for convenience — use getDbClient() in server code
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    return (getDbClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
