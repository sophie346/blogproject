# Multi-tenant blog (`commonblog`)

Host **+ path prefix** select the site. Only identity is configured in code
(`src/constants/tenants.ts`). Brand, copy, theme, and sections come from
ChannelAdmin → **Blogs → Settings**.

| Field | Header | Where defined |
|-------|--------|---------------|
| `clientName` | `clientname` | `tenants.ts` mount |
| `label` | `label` | `tenants.ts` mount |
| brand / copy / theme | — | Admin blog settings API |

Unknown Host/path → **Coming soon**.

## Current mounts (`src/constants/tenants.ts`)

| URL | clientName | label |
|-----|------------|-------|
| `http://localhost:3000/` | `oneauto` | `oneauto` |
| `http://localhost:3000/blog` | `oneauto` | `oneauto` |
| `https://onetruckparts.com/blog` | `oneauto` | `oneauto` |
| `https://nexustruckupgrades.com/blog` | `1p0248qcm3j1k401` | `nexus` |

## Admin

Website settings → **Blogs** → nested tabs:

- **Posts** — create / edit / delete posts
- **Settings** — brand, homepage copy, theme, sections, SEO

APIs:

- Admin: `GET/POST /inventory/blogs/settings?label=`
- Storefront: `GET /prod/blog-settings?label=`

## Setup

```bash
npm install
npm run dev
```

## Deploy

- Branch `cicd-prod` → trigger `commonblog-ui-prod`
- Image / Deployment: `commonblog`
