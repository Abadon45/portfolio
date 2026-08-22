import { neon } from "@neondatabase/serverless";

export class NeonConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "NeonConfigurationError";
  }
}

export function isNeonConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getNeonSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new NeonConfigurationError();
  }

  return neon(databaseUrl);
}

export async function getNeonDatabaseTime() {
  const sql = getNeonSql();
  const rows = await sql`select now() as database_time`;

  return rows[0]?.database_time ?? null;
}

export async function listNeonTables() {
  const sql = getNeonSql();

  return sql`
    select table_schema, table_name
    from information_schema.tables
    where table_schema not in ('pg_catalog', 'information_schema')
    order by table_schema, table_name
  `;
}
