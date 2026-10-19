# Emmanuel "Noy" Pangan Portfolio

Next.js portfolio site generated from the resume and technical documentation in:

`\\wsl.localhost\Ubuntu\home\abadon45\Dev\twcako-frontend\docs`

## Run

```bash
npm install
npm run dev
```

## Canonical site URL

Canonical metadata, `robots.txt`, and the sitemap use `NEXT_PUBLIC_SITE_URL` when it is set. In Vercel, configure this variable for Production as `https://emmanuelpanganportfolio.vercel.app` if you want an explicit override. The application falls back to that stable production domain when the variable is absent, and uses `http://localhost:3000` in development. Do not use Vercel's deployment-specific `VERCEL_URL` as the canonical origin.

## Contents

- Next.js App Router
- TypeScript resume data
- Responsive portfolio and resume page
- TWC Ako case studies based on local documentation

## Customize

- Update portfolio content in `app/data/portfolio.ts`.
- Update portfolio components in `app/components/portfolio`.
- Update theme palettes in `app/theme/portfolioTheme.ts`.
- Review planned improvements in `notes/features.md`.
