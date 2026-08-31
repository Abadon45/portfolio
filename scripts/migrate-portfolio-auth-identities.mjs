import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const sql = neon(databaseUrl);

await sql`
  create table if not exists portfolio_auth.user_identities (
    id text primary key,
    user_id text not null references portfolio_auth.users(id) on delete cascade,
    provider text not null,
    provider_user_id text not null,
    created_at timestamptz not null default now(),
    unique (provider, provider_user_id)
  )
`;

await sql`
  insert into portfolio_auth.user_identities (id, user_id, provider, provider_user_id)
  select md5(u.id || ':' || u.auth_provider || ':' || u.provider_user_id),
    u.id, u.auth_provider, u.provider_user_id
  from portfolio_auth.users u
  where u.provider_user_id is not null
  on conflict (provider, provider_user_id) do nothing
`;

console.log("Portfolio auth identity migration complete.");
