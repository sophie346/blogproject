# OneAuto Blog (Blog1CA)

Next.js blog that loads published posts from the OneAuto API.

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Purpose |
|----------|---------|
| `ONEAUTO_API_BASE` | API host (default: `https://oneauto-backend.onechanneladmin.com`) |
| `ONEAUTO_CLIENTNAME` | Org header for client DB (default: `oneauto`) |
| `WEBSITE_LABEL` | Required website label for blog queries |
| `ONEAUTO_AUTH_TOKEN` | Optional Firebase Bearer token |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — hero + paginated blog list
- `/blog/[slug]` — article detail with SEO metadata
