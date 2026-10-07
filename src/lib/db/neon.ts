/**
 * Neon PostgreSQL access (server-side only).
 *
 * - Uses the HTTP transport of `@neondatabase/serverless` (plain `fetch`, no raw TCP), which is
 *   what Cloudflare Workers/OpenNext requires. Never import this module from a Client Component.
 * - Reads `DATABASE_URL` only (never `NEXT_PUBLIC_*`). On Cloudflare it must be a Worker secret;
 *   `.env.local` on a developer machine does NOT exist in production.
 * - Read-only by construction: the only exported executor is a parameterised `SELECT` runner and
 *   `assertReadOnlySql` rejects anything else before it reaches the network.
 * - Errors are sanitised: neither the URL, the password nor driver messages leave this module.
 */
import { neon } from "@neondatabase/serverless";

export type SqlRow = Record<string, unknown>;

/** Parameterised query runner. `text` MUST use $1..$n placeholders; values go only in `params`. */
export type SqlQuery = (text: string, params: readonly unknown[]) => Promise<SqlRow[]>;

/** DATABASE_URL missing/malformed. Message never contains the value. */
export class DatabaseConfigError extends Error {
  readonly code = "DATABASE_CONFIG" as const;
  constructor(reason: string) {
    super(`Database configuration error: ${reason}`);
    this.name = "DatabaseConfigError";
  }
}

/** Query/network/auth failure. The underlying driver error is deliberately NOT retained. */
export class DatabaseQueryError extends Error {
  readonly code = "DATABASE_QUERY" as const;
  constructor() {
    super("Database query failed.");
    this.name = "DatabaseQueryError";
  }
}

export function readDatabaseUrl(env: Record<string, string | undefined> = process.env): string {
  const url = env.DATABASE_URL?.trim();
  if (!url) throw new DatabaseConfigError("DATABASE_URL is not set");
  if (!/^postgres(ql)?:\/\//i.test(url)) throw new DatabaseConfigError("DATABASE_URL is not a postgres URL");
  return url;
}

/** Defence in depth: this module only ever runs a single SELECT / WITH ... SELECT statement. */
export function assertReadOnlySql(text: string): void {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!/^(select|with)\b/i.test(normalized)) {
    throw new DatabaseQueryError();
  }
  // Single statement only (a trailing semicolon is tolerated).
  if (normalized.replace(/;\s*$/, "").includes(";")) {
    throw new DatabaseQueryError();
  }
  if (/\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|copy|merge|call|do)\b/i.test(normalized)) {
    throw new DatabaseQueryError();
  }
}

export function createNeonExecutor(databaseUrl: string): SqlQuery {
  const sql = neon(databaseUrl);
  return async (text, params) => {
    assertReadOnlySql(text);
    try {
      const rows = await sql.query(text, [...params]);
      return rows as SqlRow[];
    } catch {
      // Drop the driver error entirely: it can contain host names or server messages.
      throw new DatabaseQueryError();
    }
  };
}

let cachedExecutor: SqlQuery | null = null;

/** Lazily-created process-wide executor. Throws DatabaseConfigError if DATABASE_URL is unusable. */
export function getNeonExecutor(): SqlQuery {
  if (!cachedExecutor) cachedExecutor = createNeonExecutor(readDatabaseUrl());
  return cachedExecutor;
}

/** Test seam only. */
export function resetNeonExecutorForTests(): void {
  cachedExecutor = null;
}
