import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const sql = neon(databaseUrl);

await sql`create schema if not exists portfolio_auth`;

await sql`
  create table if not exists portfolio_auth.users (
    id text primary key,
    email text not null unique,
    first_name text,
    last_name text,
    full_name text,
    display_name text not null,
    username text,
    avatar_url text,
    phone text,
    password_hash text not null,
    role text not null default 'viewer',
    is_active boolean not null default true,
    last_login timestamptz,
    auth_provider text not null default 'password',
    provider_user_id text,
    email_verified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )
`;

await sql`
  alter table portfolio_auth.users
  add column if not exists email_verified_at timestamptz
`;

await sql`
  alter table portfolio_auth.users
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists full_name text,
  add column if not exists username text,
  add column if not exists avatar_url text,
  add column if not exists phone text,
  add column if not exists is_active boolean not null default true,
  add column if not exists last_login timestamptz,
  add column if not exists auth_provider text not null default 'password',
  add column if not exists provider_user_id text
`;

await sql`
  create unique index if not exists portfolio_auth_google_identity_idx
  on portfolio_auth.users(auth_provider, provider_user_id)
  where provider_user_id is not null
`;

await sql`
  create table if not exists portfolio_auth.sessions (
    id text primary key,
    user_id text not null references portfolio_auth.users(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists portfolio_auth.email_verifications (
    id text primary key,
    user_id text not null references portfolio_auth.users(id) on delete cascade,
    code_hash text not null,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create index if not exists portfolio_auth_sessions_user_id_idx
  on portfolio_auth.sessions(user_id)
`;

await sql`
  create index if not exists portfolio_auth_sessions_expires_at_idx
  on portfolio_auth.sessions(expires_at)
`;

const counts = await sql`
  select
    (select count(*)::int from portfolio_auth.users) as users,
    (select count(*)::int from portfolio_auth.sessions) as sessions
`;

console.log(JSON.stringify(counts[0], null, 2));
