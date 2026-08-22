# Google Sign-In setup

The portfolio uses Google OpenID Connect only to verify identity. The application still creates
the normal Neon-backed `portfolio_session` cookie and uses `portfolio_auth.users` as the canonical
profile source.

## Environment variables

Add these to local `.env.local` and to Vercel Production/Preview as appropriate:

```env
GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

Keep `GOOGLE_CLIENT_SECRET` server-only. Do not use a `NEXT_PUBLIC_` prefix.

For production, set `GOOGLE_REDIRECT_URI` to the deployed HTTPS callback URL:

```text
https://YOUR_DEPLOYED_DOMAIN/api/auth/google/callback
```

The project does not assume a production domain. Replace the placeholder with the actual Vercel
domain or custom domain before adding it to Google Cloud.

## Google Cloud Console

Create an OAuth client with application type **Web application**. Add the matching values under:

- Authorized JavaScript origins: `http://localhost:3000` and the production site origin.
- Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback` and the production
  callback URL.

The local and production redirect URIs must match exactly, including scheme, host, port, and path.

## Account-linking policy

Google identities are matched by `auth_provider = 'google'` and Google's stable `sub` value. A new
verified Google email creates a normal portfolio user. If that verified email already belongs to a
password account, the Google identity is linked to that same Neon user, preserving the existing
password hash, role, profile data, and sessions. A duplicate user is not created. If the email is
already associated with a different Google identity, the merge is refused.

## Flow

1. `/api/auth/google/start` creates a short-lived HttpOnly state cookie and redirects to Google.
2. `/api/auth/google/callback` validates state, exchanges the code server-side, and reads the
   verified Google profile from Google's userinfo endpoint.
3. The canonical Neon user is found or created and its Google profile fields are synchronized.
4. The existing server-side `portfolio_session` cookie is created and the user returns to the
   requested portfolio route.
