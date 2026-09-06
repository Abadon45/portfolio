# Portfolio audit — 6 September 2026

The project builds successfully and has substantial reusable foundations. The most valuable next work is fixing authentication and checkout defects, making the demos dependable, and presenting stronger case-study evidence. A framework rewrite is unnecessary.

## Scope and evidence

Reviewed root guidance, route inventory, shared shell/theme, portfolio content, authentication helpers and callbacks, payment handlers, ecommerce state/data/checkout, upload parsing, package configuration, and representative operational components. This is a broad code and runtime audit, not an exhaustive penetration test or certification of every authenticated workflow.

- Node 22.23.2 in Ubuntu WSL; installed Next.js 16.3.3.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; 43 static pages generated, dynamic routes listed successfully.
- Production Playwright smoke checks at 390px and 1440px: `/`, `/solar`, `/nightcurrent`, `/fulfillmentos`, `/aws`, `/payments`, `/saas-platform`, `/saas-platform/landing`, `/twc-ecommerce`, `/twc-ecommerce/shop`, `/twc-ecommerce/checkout`, `/twc-ecommerce/thank-you`, `/login`, `/dashboard`, `/profile`. Public pages returned 200; dashboard/profile redirected anonymous visitors to login.
- No uncaught page errors or completed broken images in those initial-load samples. This does not cover lazy images after scrolling or all console/network warnings.
- Ecommerce overflow reproduced: 390px viewport, 499px document width. Other sampled pages had no horizontal overflow.
- Home light-mode persistence checked after reload; full visual contrast review of every theme, dialog, and state remains outstanding.
- `npm audit --json`: five high-severity package entries, zero critical. These include transitive chains, not five independently demonstrated application exploits.
- Lint unavailable as configured: script invokes removed `next lint`; no supported ESLint setup. No application test script or CI workflow found; one catalogue discovery fixture test exists.
- Authenticated admin/teacher mutations, live OAuth completion, real payments, email delivery, and webhook delivery were not exercised. No test account was provided, and these checks would create external state. No deployment metrics, Lighthouse/Core Web Vitals, axe scan, or full keyboard/screen-reader audit was performed.
- Application code was not changed. Existing untracked skill and catalogue-preview files were preserved.

## Priority 1: security and account reliability

### 1. OAuth callbacks can redirect to an external origin

`app/api/auth/microsoft/start/route.ts:6` and equivalent Google/GitHub/Facebook helpers accept paths beginning with `/` except literal `//`. Callback handlers then decode the saved value again (`app/api/auth/microsoft/callback/route.ts:125`). A value such as `/%2fevil.example` passes the first check but becomes `//evil.example` when decoded. Local reproduction using the actual validation/transformation pattern resolves it to `https://evil.example`.

Use one canonical same-origin URL validator, reject backslashes and external origins, and validate again immediately before redirecting. Avoid extra decoding. Clear short-lived OAuth cookies after consumption. Add regression cases for encoded slashes, backslashes, malformed escapes, and external URLs. Effort: small.

### 2. Microsoft identity linking relies on an email match

`app/api/auth/microsoft/callback/route.ts:88` reads Graph `mail` or `userPrincipalName`, then automatically links an existing account with the same email. This makes an email-like profile attribute the authority for attaching an identity to an existing account. Require an authenticated account-linking flow or separate mailbox verification; identify the provider principal with stable, tenant-aware identifiers. This is a code-level security concern; an account takeover was not attempted. Effort: medium.

Microsoft cautions against email-like claims as authorization identifiers: [claims validation](https://learn.microsoft.com/en-us/entra/identity-platform/claims-validation).

### 3. Login and verification have no application-level attempt limits

`app/api/auth/login/route.ts:14`, `app/api/auth/register/route.ts:13`, `app/api/auth/verify-email/route.ts:12`, `lib/portfolioAuth.ts:336`.

No rate limiting or verification attempt counter was found. Six-digit codes use `Math.random()`. Add durable per-account and per-source limits, crypto-generated codes, bounded request fields, and atomic one-time consumption. Infrastructure rate limits were not inspected. Effort: medium.

### 4. Failed or expired email verification strands registrations

`app/api/auth/register/route.ts:36` creates the pending user before sending email. Delivery failure leaves the account in place; another registration returns 409. Codes expire after ten minutes, and no resend/recovery endpoint exists. Add a throttled resend flow for pending users and make delivery failure recoverable. Also return the updated verified user after verification: the helper currently returns the row selected before updating its verification timestamp. Effort: medium.

### 5. Inactive users can still receive sessions

`app/api/auth/login/route.ts:41`, `lib/portfolioAuth.ts:473`.

Login does not reject `is_active = false`, and current-user lookup does not exclude inactive users. Admin/dashboard/teacher helpers do check activity, so this is inconsistent session enforcement rather than a demonstrated admin bypass. Centralize rejection of inactive accounts and revoke sessions on deactivation. Effort: small.

### 6. Vulnerable spreadsheet parser is on an upload path

`package.json`, `app/api/teacher/schedule-generator/parse/route.ts:56`.

The installed `xlsx` 0.18.5 is flagged for prototype pollution and ReDoS, and parses teacher-supplied workbooks. The 5MB upload cap does not bound decompressed workbook size or parsing time. Replace/update the parser using a maintained distribution, constrain rows/cells and resource use, and test malformed/oversized workbooks. Teacher registration is self-selected, so the role gate is not a strong barrier against abusive uploads.

The other audit entries are Prisma and its `@prisma/config`, `deepmerge-ts`, and `mysql2` dependency chains. Assess reachability separately: this application uses Neon/PostgreSQL, so the MySQL advisory is not evidence of an exposed MySQL connection. Do not blindly apply audit's suggested Prisma major downgrade. Effort: medium.

### 7. Payment sandbox boundaries need server enforcement

`app/api/payments/stripe/checkout/route.ts:16`, `app/api/payments/xendit/invoice/route.ts:29`.

Anonymous callers can create provider sessions/invoices with caller-selected amounts and references. There is no server-enforced test-only mode, ownership association, rate limit, or creation idempotency. Arbitrary amounts can be intentional in a lab, but unrestricted provider calls should not depend solely on UI messaging or which key happens to be configured. Enforce a sandbox configuration and usage limits; if promoted to real commerce, derive prices from a server-owned order and enforce ownership. Effort: medium.

Webhook handlers verify signatures/tokens, which is good, but only log paid events. They do not persist order status or implement deduplication/fulfillment. Describe this accurately as a verification demonstration until those parts exist.

## Priority 2: commerce correctness and resilience

### 8. Completing one shop's checkout removes every shop's items

`app/twc-ecommerce/_components/CheckoutJourney.tsx:161`, `TwcStoreProvider.tsx:205`.

Checkout filters the selected shop, then calls the global `clearCart()`. Remove only the purchased lines and preserve unrelated shops. Regression: add items from two shops, purchase one, verify the other remains. Effort: small.

### 9. Resuming checkout loses its address and can reuse stale totals

`app/twc-ecommerce/_components/CheckoutJourney.tsx:63`, `TwcStoreProvider.tsx:167`.

The provider retains the quote, but the address lives in the page's local state. Navigate away and return: `activeCheckout` starts the page on payment while `address` is null. Confirmation can produce `undefined` address fields. Cart edits and shop changes also do not invalidate or recompute that quote, permitting item/amount disagreement.

Store a complete checkout snapshot with selected shop, lines, address, payment, and quote. Invalidate it on relevant changes. Validate completeness before confirmation. Effort: medium.

### 10. Shipping zones and product constraints are incomplete

`app/twc-ecommerce/_components/TwcStoreProvider.tsx:41` and `:191`.

Substring matching classifies Quezon province as Manila; similarly named cities can collide. `ISLAND` has rates but no path returns it. Use explicit province/city identifiers from the address directory. The fee calculation guesses package profiles from category/shop names despite stored weight/dimension/shipping fields. Confirm the intended demo contract before replacing these approximations.

Quantity changes ignore finite stock and minimum/maximum order quantity. Enforce these centrally while preserving unlimited Santé stock. Add table-driven shipping and quantity tests. Effort: medium.

### 11. Refresh loses cart, checkout, and receipt

`app/twc-ecommerce/_components/TwcStoreProvider.tsx:165`.

All transaction state is memory-only. Add a versioned, validated demo session if continuation is intended, with an explicit reset action and thoughtful handling of address data. At minimum explain an expired receipt and provide a useful recovery path. Effort: medium.

### 12. The advertised offline store depends on live database access

`app/twc-ecommerce/layout.tsx:12`, `lib/storeProductRepository.ts:161`, `app/data/portfolio.ts`.

The layout catches database failures as `[]`, making outages look like an empty shop. Add a typed sanitized fixture fallback or a clear unavailable/retry state. Label live and demo data accurately. Unlike this store, the SaaS page already has a fixture fallback pattern worth reusing.

The layout also loads the entire active catalogue, including descriptions and image arrays, into the client provider for every ecommerce entry route. The 16-item display sentinel limits rendering, not the initial database read or serialized payload. Introduce a bounded listing response, server pagination, and separate detail reads as catalogue size warrants. Measure payload sizes before choosing cache policy. Effort: medium.

## Priority 2: usability and accessibility

### 13. Ecommerce header overflows narrow screens

`app/twc-ecommerce/_components/TwcEshopNavbar.tsx:90`.

Browser-confirmed in the default Premium Beauty theme: a fixed minimum-width theme selector and adjacent controls push the document to 499px at a 390px viewport. Reflow the header or move the selector into the mobile drawer. Verify every storefront theme at 320/390/768px, with cart badges and long names. Effort: small.

### 14. Navigation and controls need semantic cleanup

`app/components/portfolio/ContactSection.tsx:78`: an `IconButton` sits inside a link, creating nested interactive elements. Use a decorative icon inside the single link.

`app/twc-ecommerce/_components/TwcCartDrawer.tsx:53`: shop-selection checkbox lacks an associated accessible label. Name it by shop; distinguish quantity buttons by product.

`app/components/portfolio/PortfolioPage.tsx:79`: section navigation uses imperative scrolling; provide real fragment links and a skip-to-main link. Several demo navigation buttons likewise should be links for open-in-new-tab behavior.

The ecommerce landing rendered three `h1` elements. Make the page title distinct from promotional section headings. Effort: small to medium.

### 15. Home animations do not honor reduced motion

`app/components/portfolio/SectionMotion.tsx:15`, `styles.ts:17`, `app/globals.css:6`.

The home section wrappers translate/fade content and smooth scrolling is unconditional. Add a shared reduced-motion policy covering Framer Motion and imperative/CSS scrolling. Ensure content remains visible if animation initialization fails. Nightcurrent and the particle component already contain useful reduced-motion handling. Effort: small.

### 16. Theme persistence needs a shared initialization boundary

`app/components/portfolio/PortfolioPage.tsx:40`.

Theme storage is read after the initial dark render and written in a separate mount effect. Stored light preference can flash through the default; storage calls are not protected against browser storage exceptions. Consolidate initialization/persistence and use a hydration-safe initial theme strategy. Validate all selectable custom color combinations rather than assuming a custom primary always yields readable text. Full contrast measurements remain outstanding. Effort: medium.

UI review reference: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Priority 3: performance, maintainability, and presentation

### 17. Optimize image delivery before speculative React tuning

`public/images/twc/wellness-category-bags.png` is 2.68MB; several other category/scene PNGs are 2–2.5MB. Their network impact depends on which theme/scene loads them. Generate appropriately sized WebP/AVIF variants, keep local fallbacks, lazy-load below-fold media, and use responsive image sizing. Avoid shipping full-resolution PNGs for small category tiles. Measure LCP and transferred bytes on production/mobile before and after. Effort: medium.

### 18. Re-establish automated quality gates

`package.json`: replace `next lint` with a supported ESLint command/config, add a formatter, pin the Node runtime and intentional dependency ranges instead of `latest`, and add CI for types/build/lint and a small meaningful regression suite. The lockfile exists, so pinned installs are already possible.

Prioritize tests for OAuth callback validation, account inactivity, checkout resume, multi-shop checkout, shipping zones, spreadsheet rejection, and anonymous access boundaries. Add Playwright mobile/theme smoke tests. TypeScript/build alone did not catch the defects above. [Next.js ESLint documentation](https://nextjs.org/docs/app/api-reference/config/eslint). Effort: medium.

### 19. Split the largest components along workflow boundaries

`app/saas-platform/_components/SaaSPlatformPage.tsx` is 2,780 lines; `SaaSLandingPage.tsx` 1,124; `FulfillmentOsPage.tsx` 1,004. Some ecommerce components compress whole JSX trees into long lines, contrary to repository guidance.

Extract focused domain panels, typed request helpers, and mutation hooks while preserving MUI and provider ownership. Format first, then refactor one tested workflow at a time. Avoid broad changes solely to reduce line counts. The pure schedule/shipping logic is especially suitable for focused regression coverage. Effort: medium to large.

### 20. Make the portfolio's strongest evidence easier to inspect

`app/data/portfolio.ts`, `app/components/portfolio/ProjectsSection.tsx`.

The featured project has no case-study link. Some “Open case study” links lead directly to login or a payment lab rather than an explanation of the historical work. Build two or three concise case studies with problem, your specific contribution, architecture, decisions, screenshots, and verified outcomes. Distinguish historical production work from what the current demo implements; for example, idempotent fulfillment and offline operation are not fully implemented here.

Retain the clear scope-of-ownership wording. Add a downloadable resume, a `mailto:` email action instead of requiring Gmail, and a direct demo action next to each case study. Avoid adding more equally weighted project cards before improving depth. Effort: medium.

### 21. Finish search and sharing metadata

`app/layout.tsx:13` provides title and description only. No sitemap, robots route, Open Graph image, canonical configuration, or structured profile data was found. Add deliberate public-route indexing and social previews; exclude account/admin utility pages from search. Product metadata already exists and can be extended consistently.

The homepage is dynamic because it reads the session. Consider a static public portfolio shell with a small independently loaded account control if production timing shows session rendering is a meaningful cost. This is an optimization candidate, not a measured bottleneck. Effort: small to medium.

## Recommended delivery sequence

1. **Secure access:** callback validation, safe identity linking, auth throttling/recovery, inactive-session enforcement, spreadsheet dependency remediation, explicit payment sandbox controls.
2. **Make commerce dependable:** complete checkout snapshot, selective cart removal, zone/quantity validation, fallback catalogue, mobile header repair, and regression tests.
3. **Improve portfolio impact:** stronger case studies and resume/contact actions, compressed media, metadata, reduced motion, keyboard semantics, and measured theme contrast.
4. **Reduce ongoing maintenance:** supported lint/format/CI setup, focused component extraction, and production performance/observability measurements.

Keep the existing Next.js/MUI architecture, typed data boundaries, server-side credentials, shared alerts, and centralized cart ownership. Those foundations are worth strengthening.
