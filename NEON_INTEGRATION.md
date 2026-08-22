# Neon integration

The portfolio now has a server-only Neon boundary. It is intentionally disconnected until a
database URL and the real schema are verified.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to the connection string copied from Neon Console.
3. Set `NEON_INSPECT_SECRET` to a long random value.
4. Start the app with `npm run dev`.
5. Check `GET /api/saas/neon/health`.

The database URL must stay server-only. Never rename it to `NEXT_PUBLIC_DATABASE_URL` and never
commit `.env.local`.

## SaaS demo schema

The portfolio owns the `saas_demo` schema. Bootstrap or reseed it with:

```bash
node --env-file=.env.local scripts/bootstrap-saas-demo.mjs
```

This creates synthetic products, inventory movements, orders, price requests, settlements, payouts,
affiliate links, and a subscription. It does not modify the `neon_auth` schema.

The ecommerce catalog is stored separately in `saas_demo.store_products`. Bootstrap it from the
existing sanitized ecommerce JSON with:

```bash
node --env-file=.env.local scripts/bootstrap-ecommerce-products.mjs
```

## Portfolio authentication model

The portfolio authentication demo owns the `portfolio_auth` schema. Bootstrap it with:

```bash
node --env-file=.env.local scripts/bootstrap-portfolio-auth.mjs
```

This creates `portfolio_auth.users` and `portfolio_auth.sessions`, then seeds the demo account
`demo@portfolio.local` with password `DemoPass123!`. Passwords are stored as scrypt hashes; the
browser receives only an HttpOnly, SameSite=Lax session cookie. The login page is `/login` and the
auth highlight on the portfolio links there.

This is a portfolio demonstration model, not a replacement for the production TWCako Django/Auth.js
system. Do not reuse the demo credentials or schema for real users without adding registration,
email verification, rate limiting, password reset, session cleanup, and backend authorization.

## Schema discovery

Use the protected endpoint to list tables:

```bash
curl -H "x-neon-inspect-secret: YOUR_SECRET" \
  http://localhost:3000/api/saas/neon/tables
```

This is intentionally limited to table metadata. It does not return customer, order, financial,
or media data.

## Integration order

The SaaS route still uses sanitized fixtures until the schema is verified. Integrate in this order:

1. Read-only products and supplier products
2. Read-only inventory and movements
3. Read-only orders
4. Settlements and payouts
5. Subscription and plan features
6. Authenticated mutations

Do not run Prisma or Drizzle migrations against the existing Django database. The backend already
owns that schema. Add a separate ORM only if the portfolio receives its own Neon schema.

## Current endpoints

- `GET /api/saas/neon/health` — connection status and database time
- `GET /api/saas/neon/tables` — protected table metadata inspection
- `GET /api/saas/data` — normalized SaaS workspace data
- `POST /api/saas/products` — create a product
- `PATCH /api/saas/products/:id` — update or archive a product
- `POST /api/saas/inventory` — record a stock movement
- `POST /api/saas/actions` — save a payout, price request, or affiliate link
- `GET /api/ecommerce/products` — normalized storefront catalog
- `GET /api/ecommerce/products/:slug` — normalized storefront product detail
- `POST /api/ecommerce/products/:slug/images` — protected product image upload

## Vercel Blob images

The product model stores image URLs in `saas_demo.store_products.images`. The upload route uses
Vercel Blob's server SDK and accepts a multipart form field named `file`. Create a Blob store in
the Vercel project, set its access mode to public for storefront images, and add the generated
the generated Blob store ID to `.env.local` and Vercel project environment variables. Vercel may
provide `BLOB_UPLOAD_SECRET_STORE_ID` for OIDC-based access; older setups may instead provide
`BLOB_READ_WRITE_TOKEN`. Also set a separate random `BLOB_UPLOAD_SECRET`; callers must send it as
`x-blob-upload-secret`.

Example request:

```bash
curl -X POST \
  -H "x-blob-upload-secret: YOUR_UPLOAD_SECRET" \
  -F "file=@./product.jpg" \
  http://localhost:3000/api/ecommerce/products/PRODUCT_SLUG/images
```

Server uploads are limited to 4.5 MB by Vercel Functions. For larger files, add a client-upload
flow using Vercel Blob's token exchange instead of sending the file through this route.
