import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as nodeScrypt,
  timingSafeEqual as compareSecrets,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getNeonSql } from "./neon";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "portfolio_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OTP_MAX_AGE_MINUTES = 10;

export type PortfolioUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  displayName: string;
  username: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  authProvider: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
};

type UserRow = Record<string, unknown>;

function toUser(row: UserRow): PortfolioUser {
  return {
    id: String(row.id),
    email: String(row.email),
    firstName: row.first_name ? String(row.first_name) : null,
    lastName: row.last_name ? String(row.last_name) : null,
    fullName: row.full_name ? String(row.full_name) : null,
    displayName: String(row.display_name),
    username: row.username ? String(row.username) : null,
    phone: row.phone ? String(row.phone) : null,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    role: String(row.role),
    authProvider: String(row.auth_provider ?? "password"),
    emailVerified: Boolean(row.email_verified_at),
    isActive: row.is_active !== false,
    lastLogin: row.last_login ? new Date(String(row.last_login)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, storedKey] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !storedKey) return false;

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expectedKey = Buffer.from(storedKey, "hex");
  return (
    expectedKey.length === derivedKey.length &&
    compareSecrets(derivedKey, expectedKey)
  );
}

export async function findUserByEmail(email: string) {
  const sql = getNeonSql();
  const rows = await sql`
    select id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, password_hash, email_verified_at, is_active,
      last_login, created_at
    from portfolio_auth.users
    where email = ${normalizeEmail(email)}
    limit 1
  `;

  return rows[0] ?? null;
}

export async function findUserByGoogleId(providerUserId: string) {
  const sql = getNeonSql();
  const rows = await sql`
    select id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, email_verified_at, is_active, last_login, created_at
    from portfolio_auth.users
    where auth_provider = 'google' and provider_user_id = ${providerUserId}
    limit 1
  `;

  return rows[0] ?? null;
}

export async function createGoogleUser(profile: {
  providerUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatarUrl: string | null;
}) {
  const sql = getNeonSql();
  const rows = await sql`
    insert into portfolio_auth.users
      (id, email, first_name, last_name, full_name, display_name, avatar_url,
       password_hash, role, auth_provider, provider_user_id, email_verified_at)
    values
      (${randomUUID()}, ${profile.email}, ${profile.firstName}, ${profile.lastName},
       ${profile.fullName}, ${profile.fullName}, ${profile.avatarUrl},
       '', 'viewer', 'google', ${profile.providerUserId}, now())
    returning id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, email_verified_at, is_active, last_login, created_at
  `;

  return rows[0] ?? null;
}

export async function linkGoogleIdentityToUser(
  userId: string,
  providerUserId: string,
  profile: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string;
    avatarUrl: string | null;
  },
) {
  const sql = getNeonSql();
  const rows = await sql`
    update portfolio_auth.users
    set auth_provider = 'google',
      provider_user_id = ${providerUserId},
      first_name = coalesce(${profile.firstName}, first_name),
      last_name = coalesce(${profile.lastName}, last_name),
      full_name = coalesce(${profile.fullName}, full_name),
      display_name = coalesce(nullif(display_name, ''), ${profile.fullName}),
      avatar_url = coalesce(${profile.avatarUrl}, avatar_url),
      email_verified_at = now(),
      last_login = now(),
      updated_at = now()
    where id = ${userId}
      and auth_provider = 'password'
      and provider_user_id is null
    returning id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, email_verified_at, is_active, last_login, created_at
  `;

  return rows[0] ?? null;
}

export async function synchronizeGoogleUser(
  userId: string,
  profile: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string;
    avatarUrl: string | null;
  },
) {
  const sql = getNeonSql();
  const rows = await sql`
    update portfolio_auth.users
    set email = ${profile.email},
      first_name = ${profile.firstName},
      last_name = ${profile.lastName},
      full_name = ${profile.fullName},
      display_name = ${profile.fullName},
      avatar_url = ${profile.avatarUrl},
      email_verified_at = coalesce(email_verified_at, now()),
      last_login = now(),
      updated_at = now()
    where id = ${userId} and auth_provider = 'google'
    returning id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, email_verified_at, is_active, last_login, created_at
  `;

  return rows[0] ?? null;
}

export async function createPendingUser({
  email,
  displayName,
  passwordHash,
}: {
  email: string;
  displayName: string;
  passwordHash: string;
}) {
  const sql = getNeonSql();
  const userId = randomUUID();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashSessionToken(code);

  await sql.transaction([
    sql`
      insert into portfolio_auth.users
        (id, email, display_name, password_hash, role, email_verified_at)
      values
        (${userId}, ${email}, ${displayName}, ${passwordHash}, 'viewer', null)
    `,
    sql`
      insert into portfolio_auth.email_verifications
        (id, user_id, code_hash, expires_at)
      values
        (${randomUUID()}, ${userId}, ${codeHash}, now() + ${OTP_MAX_AGE_MINUTES} * interval '1 minute')
    `,
  ]);

  return { userId, code };
}

export async function verifyEmailCode(email: string, code: string) {
  const sql = getNeonSql();
  const rows = await sql`
    select u.id, u.email, u.first_name, u.last_name, u.full_name, u.display_name,
      u.username, u.phone, u.avatar_url, u.role, u.auth_provider, u.email_verified_at,
      u.is_active, u.last_login, u.created_at
    from portfolio_auth.users u
    join portfolio_auth.email_verifications v on v.user_id = u.id
    where u.email = ${normalizeEmail(email)}
      and v.code_hash = ${hashSessionToken(code)}
      and v.expires_at > now()
    order by v.created_at desc
    limit 1
  `;

  if (!rows[0]) return null;

  await sql.transaction([
    sql`
      update portfolio_auth.users
      set email_verified_at = now(), updated_at = now()
      where id = ${String(rows[0].id)}
    `,
    sql`
      delete from portfolio_auth.email_verifications
      where user_id = ${String(rows[0].id)}
    `,
  ]);

  return rows[0];
}

export async function updateCurrentPortfolioUser({
  firstName,
  lastName,
  displayName,
  phone,
}: {
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
}) {
  const currentUser = await getCurrentPortfolioUser();
  if (!currentUser) return null;

  const sql = getNeonSql();
  const rows = await sql`
    update portfolio_auth.users
    set first_name = ${firstName},
      last_name = ${lastName},
      full_name = ${displayName},
      display_name = ${displayName},
      phone = ${phone},
      updated_at = now()
    where id = ${currentUser.id} and is_active = true
    returning id, email, first_name, last_name, full_name, display_name, username, phone,
      avatar_url, role, auth_provider, email_verified_at, is_active, last_login, created_at
  `;

  return rows[0] ? toUser(rows[0]) : null;
}

export async function sendEmailVerificationCode(
  email: string,
  code: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email delivery is not configured.");
    }
    return { developmentCode: code };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Confirm your portfolio account",
      text: `Your email confirmation code is ${code}. It expires in ${OTP_MAX_AGE_MINUTES} minutes.`,
    }),
  });

  if (!response.ok) throw new Error("Email delivery failed.");
  return {};
}

export async function createSession(userId: string) {
  const sql = getNeonSql();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);

  await sql`
    insert into portfolio_auth.sessions (id, user_id, token_hash, expires_at)
    values (
      ${randomUUID()},
      ${userId},
      ${tokenHash},
      now() + interval '30 days'
    )
  `;

  await sql`
    update portfolio_auth.users
    set last_login = now(), updated_at = now()
    where id = ${userId}
  `;

  return token;
}

export async function getCurrentPortfolioUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sql = getNeonSql();
  const rows = await sql`
    select u.id, u.email, u.display_name, u.role, u.created_at
    from portfolio_auth.sessions s
    join portfolio_auth.users u on u.id = s.user_id
    where s.token_hash = ${hashSessionToken(token)}
      and s.expires_at > now()
    limit 1
  `;

  return rows[0] ? toUser(rows[0]) : null;
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const sql = getNeonSql();
    await sql`
      delete from portfolio_auth.sessions
      where token_hash = ${hashSessionToken(token)}
    `;
  }
}

export function setSessionCookie(response: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  const value = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  response.headers.append("Set-Cookie", value);
}

export function clearSessionCookie(response: Response) {
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
}

export function publicUser(row: UserRow) {
  return toUser(row);
}

export function normalizedAuthEmail(email: string) {
  return normalizeEmail(email);
}
