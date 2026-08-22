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
    user_type text not null default 'regular_user',
    setup_completed boolean not null default true,
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
  ,add column if not exists user_type text not null default 'regular_user'
  ,add column if not exists setup_completed boolean not null default true
`;

await sql`
  update portfolio_auth.users
  set user_type = 'regular_user'
  where user_type is null or user_type = ''
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
  create table if not exists portfolio_auth.teacher_schedules (
    id text primary key,
    user_id text not null references portfolio_auth.users(id) on delete cascade,
    name text not null,
    academic_period text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists portfolio_auth.teacher_schedule_entries (
    id text primary key,
    schedule_id text not null references portfolio_auth.teacher_schedules(id) on delete cascade,
    teacher_name text not null default '',
    year_level text not null default 'All Year Levels',
    day text not null,
    start_time text not null,
    end_time text not null,
    subject text not null,
    section text,
    room text,
    notes text,
    created_at timestamptz not null default now()
  )
`;

await sql`
alter table portfolio_auth.teacher_schedule_entries
add column if not exists teacher_name text not null default '',
add column if not exists year_level text not null default 'All Year Levels'
`;

await sql`
  create table if not exists portfolio_auth.sned_languages (
    id text primary key,
    code text not null unique,
    name text not null,
    description text not null,
    sort_order integer not null default 0
  )
`;

await sql`
  create table if not exists portfolio_auth.sned_categories (
    id text primary key,
    language_id text not null references portfolio_auth.sned_languages(id) on delete cascade,
    name text not null,
    slug text not null,
    description text not null,
    sort_order integer not null default 0,
    unique(language_id, slug)
  )
`;

await sql`
  create table if not exists portfolio_auth.sned_items (
    id text primary key,
    category_id text not null references portfolio_auth.sned_categories(id) on delete cascade,
    word text not null,
    slug text not null,
    description text not null,
    image_url text,
    image_alt text,
    video_url text,
    video_provider text,
    source_name text,
    source_url text,
    creator text,
    license text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    is_demo boolean not null default false,
    sort_order integer not null default 0,
    unique(category_id, slug)
  )
`;

await sql`
  create table if not exists portfolio_auth.sned_progress (
    user_id text not null references portfolio_auth.users(id) on delete cascade,
    item_id text not null references portfolio_auth.sned_items(id) on delete cascade,
    completed boolean not null default false,
    completed_at timestamptz,
    practice_count integer not null default 0,
    updated_at timestamptz not null default now(),
    primary key (user_id, item_id)
  )
`;

await sql`
  create index if not exists portfolio_auth_sned_categories_language_idx
  on portfolio_auth.sned_categories(language_id, sort_order)
`;

await sql`
  create index if not exists portfolio_auth_sned_items_category_idx
  on portfolio_auth.sned_items(category_id, status, sort_order)
`;

await sql`
  insert into portfolio_auth.sned_languages (id, code, name, description, sort_order)
  values
    ('sned-asl', 'asl', 'American Sign Language', 'A visual learning library for ASL vocabulary.', 1),
    ('sned-fsl', 'fsl', 'Filipino Sign Language', 'A visual learning library for FSL vocabulary.', 2)
  on conflict (id) do update set name = excluded.name, description = excluded.description
`;

await sql`
  insert into portfolio_auth.sned_categories (id, language_id, name, slug, description, sort_order)
  values
    ('sned-asl-alphabet', 'sned-asl', 'Alphabet', 'alphabet', 'Explore letter-by-letter sign lessons.', 1),
    ('sned-asl-greetings', 'sned-asl', 'Greetings', 'greetings', 'Practice everyday greeting vocabulary.', 2),
    ('sned-fsl-alphabet', 'sned-fsl', 'Alphabet', 'alphabet', 'Explore letter-by-letter sign lessons.', 1),
    ('sned-fsl-greetings', 'sned-fsl', 'Greetings', 'greetings', 'Practice everyday greeting vocabulary.', 2)
  on conflict (id) do update set name = excluded.name, description = excluded.description
`;

const snedItems = [
  ...['A', 'B', 'C', 'D', 'E'].flatMap((word, index) => [
    {
      id: `sned-asl-alphabet-${word.toLowerCase()}`,
      categoryId: 'sned-asl-alphabet',
      word,
      slug: word.toLowerCase(),
      description: `Demo visual placeholder for the ASL letter ${word}.`,
      sortOrder: index + 1,
    },
    {
      id: `sned-fsl-alphabet-${word.toLowerCase()}`,
      categoryId: 'sned-fsl-alphabet',
      word,
      slug: word.toLowerCase(),
      description: `Demo visual placeholder for the FSL letter ${word}.`,
      sortOrder: index + 1,
    },
  ]),
  {
    id: 'sned-asl-greetings-hello', categoryId: 'sned-asl-greetings', word: 'Hello', slug: 'hello',
    description: 'Demo visual placeholder for the ASL greeting Hello.', sortOrder: 1,
  },
  {
    id: 'sned-asl-greetings-thank-you', categoryId: 'sned-asl-greetings', word: 'Thank you', slug: 'thank-you',
    description: 'Demo visual placeholder for the ASL phrase Thank you.', sortOrder: 2,
  },
  {
    id: 'sned-fsl-greetings-hello', categoryId: 'sned-fsl-greetings', word: 'Hello', slug: 'hello',
    description: 'Demo visual placeholder for the FSL greeting Hello.', sortOrder: 1,
  },
  {
    id: 'sned-fsl-greetings-thank-you', categoryId: 'sned-fsl-greetings', word: 'Thank you', slug: 'thank-you',
    description: 'Demo visual placeholder for the FSL phrase Thank you.', sortOrder: 2,
  },
];

for (const item of snedItems) {
  await sql`
    insert into portfolio_auth.sned_items
      (id, category_id, word, slug, description, image_alt, status, is_demo, sort_order)
    values
      (${item.id}, ${item.categoryId}, ${item.word}, ${item.slug}, ${item.description},
       ${`${item.word} demo visual`}, 'published', true, ${item.sortOrder})
    on conflict (id) do update set
      word = excluded.word,
      description = excluded.description,
      image_alt = excluded.image_alt,
      status = excluded.status,
      is_demo = excluded.is_demo,
      sort_order = excluded.sort_order
  `;
}

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
