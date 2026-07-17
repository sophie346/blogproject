# Multi-tenant blog (`commonblog`)

Host **+ path prefix** select which client module to use. BFF identity matches ChannelAdmin and is defined **only** on the client (`src/clients/<name>.ts`):

| Field | Header | Where defined |
|-------|--------|---------------|
| `clientName` | `clientname` | Client definition |
| `label` | `label` | Client definition (optional per-mount override) |

Unknown Host/path → **Coming soon**.

## Current mounts (`src/constants/tenants.ts`)

Mounts point at a client module — they do not restate `clientName` / `label`.

| URL | Client module |
|-----|---------------|
| `http://localhost:3000/` | `oneauto` |
| `http://localhost:3000/blog` | `oneauto` |
| `https://onetruckparts.com/blog` | `oneauto` |
| `https://nexustruckupgrades.com/blog` | `nexus` |

## Multiple blogs on one domain

Add another row in `SITE_MOUNTS` with a different `pathPrefix` and optional `label` override:

```ts
{
  id: "oneauto-blogs2",
  hosts: ["localhost", "onetruckparts.com", "www.onetruckparts.com"],
  pathPrefix: "/blogs2",
  client: oneauto,
  label: "second-website-label",
  siteUrl: "https://onetruckparts.com/blogs2",
},
```

Then `/blogs` and `/blogs2` (or `/blog` + `/blogs2`) each send their own `clientname` + `label` to the BFF.

## Setup

```bash
npm install
npm run dev
```

- [http://localhost:3000/](http://localhost:3000/) → oneauto  
- [http://localhost:3000/blog](http://localhost:3000/blog) → oneauto  

## Deploy

- Branch `cicd-prod` → trigger `commonblog-ui-prod`
- Image / Deployment: `commonblog`
