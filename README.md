# ContextAds

Single Next.js app in `chatgpt-ads-simulator/` — marketing site, sign-in, and product workspace.

## Deploy (Vercel)

- **Root directory:** `chatgpt-ads-simulator`
- **Production:** https://www.getcontextads.com

Required environment variables (Production):

- `AUTH_ALLOWED_EMAILS` — comma-separated allowed sign-in emails
- `AUTH_PASSWORD` — shared password for those emails
- `AUTH_SESSION_SECRET` — random string for session signing
- `OPENAI_API_KEY` — optional; enables live AI drafting/simulation

## Local development

```bash
cd chatgpt-ads-simulator
cp .env.local.example .env.local
npm install
npm run dev
```
