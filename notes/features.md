# Portfolio Feature Roadmap

This roadmap uses `twcako-frontend` as a reference, but filters the ideas for a portfolio site. The goal is to show ecommerce, SaaS, API, and frontend experience clearly without adding features that make the site feel like a product dashboard.

## Already Covered

- Component/data separation for maintainability.
- Theme picker with persisted color preferences.
- Improved section animation and scroll-to-top affordance.
- Makefile commands for local development.
- Contribution and commit-message guardrails.
- TWC Ako and related projects represented as portfolio experience.

## P0: Highest Impact

### Case Study Pages

Add dedicated case study routes for the strongest projects:

- TWC Ako Platform
- TWC Ako Backend/API Maintenance
- Legacy TWC E-Commerce
- GameBox / Vendics business work

Each case study should answer:

- Problem
- Role
- Stack
- Key features
- Constraints
- Outcome or impact

This is the best next feature because it turns the portfolio from a resume page into proof of senior product thinking.

### SEO And Sharing

Borrow the reference project's richer `layout.tsx` metadata approach:

- `metadataBase`
- canonical URL
- Open Graph image
- Twitter card data
- `robots`
- JSON-LD for `Person` and `ProfessionalService`
- `sitemap.ts`
- `robots.ts`

This matters because the portfolio should look professional when shared in Messenger, LinkedIn, email, or job applications.

### Resume Download And Print View

Add a clear resume download button and a print-friendly route or stylesheet.

Recommended approach:

- Keep the interactive portfolio as the main page.
- Add `/resume` as a cleaner resume view.
- Add a downloadable PDF later if the content is stable.

### Contact Reliability

The Gmail compose link is better than a plain `mailto`, but the contact area should also support:

- copy email button
- copied state feedback
- direct LinkedIn/GitHub buttons if available
- optional contact form only if there is a real backend or form service

This borrows from the reference project's copy-to-clipboard patterns without adding unnecessary account or messaging systems.

### Accessibility And Reduced Motion

Improve the animated UI with:

- `prefers-reduced-motion` support
- visible focus states
- keyboard-friendly theme picker
- semantic section landmarks
- contrast checks for all theme palettes

This protects the polish of the animations on lower-end devices and for users who prefer less motion.

### Mobile Navigation Pass

Audit the portfolio at common mobile widths and add a compact navigation pattern if links feel crowded.

Recommended checks:

- 360px mobile
- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

## P1: Strong Follow-Ups

### Project Filtering

Add lightweight filters for project cards:

- Frontend
- Backend/API
- Ecommerce
- SaaS
- Operations

This lets visitors quickly connect experience to what they are hiring for.

### Skill-To-Project Mapping

Make the skills section more evidence-driven by linking each major skill to projects where it was used.

Example:

- Next.js -> TWC Ako Platform, Portfolio
- Django APIs -> TWC Ako Backend, Legacy E-Commerce
- Ecommerce -> TWC Ako, Legacy Storefront, GameBox operations

### Privacy-Friendly Analytics

Add analytics only after deployment, and only if useful.

Good options:

- Vercel Analytics
- Plausible

If analytics or tracking scripts are added, add a small privacy/cookie notice inspired by the reference project's `CookieConsentBanner`.

### Performance Hardening

After visual content is added:

- use `next/image` for important images
- add explicit image sizes
- optimize Open Graph assets
- run Lighthouse
- check layout shift on mobile

### CI And Quality Checks

Add a simple GitHub Actions workflow once the repo is pushed:

- install
- build
- typecheck
- lint if supported

The local commit hook is helpful, but CI catches issues after pushing or when working from another machine.

## P2: Optional

### Notes Or Blog

Add MDX notes only if there is a real writing habit or SEO goal. Good topics would be lessons from ecommerce, API maintenance, and rebuilding legacy flows.

### Visual Regression Tests

Use Playwright screenshots if the theme picker and responsive layouts keep changing. This is helpful later, not urgent now.

### PWA Manifest

A manifest is useful for apps, but optional for a portfolio. Add it only if the site becomes more app-like.

## Do Not Port From The Reference

These `twcako-frontend` features are impressive but unnecessary for this portfolio:

- cart and checkout systems
- auth flows
- user dashboards
- supplier dashboards
- admin tables
- notifications
- payment gateway settings
- media library management

They should be represented as case study content, not rebuilt as working portfolio features.

## Recommended Next Build Order

1. Add case study routes and link project cards to them.
2. Add richer metadata, Open Graph, JSON-LD, sitemap, and robots files.
3. Add resume route/download and copy-email action.
4. Run responsive/accessibility pass across mobile and desktop.
5. Add analytics and privacy notice only after deployment.
