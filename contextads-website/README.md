# ContextAds — Marketing site

Single-page landing matching the product demo: wordmark, two lines of copy, Sign in CTA.

Product app: `../chatgpt-ads-simulator/`

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Runs on http://localhost:3001. Set `NEXT_PUBLIC_APP_URL` to the product app (default `http://localhost:3000`).

## Deploy (Vercel)

- **Root directory:** `contextads-website`
- **Environment:** `NEXT_PUBLIC_APP_URL=https://app.yourdomain.com`
