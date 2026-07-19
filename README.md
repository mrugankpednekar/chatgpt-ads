# ContextAds

Brand marketing site (static Next.js app) in `website/` — landing page, about, and methodology.

## Deploy (Vercel)

- **Root directory:** `website`
- **Production:** https://www.getcontextads.com

Optional environment variable:

- `NEXT_PUBLIC_BOOK_DEMO_URL` — "Book a demo" CTA link (defaults to Calendly)

## Local development

```bash
cd website
cp .env.local.example .env.local
npm install
npm run dev
```
