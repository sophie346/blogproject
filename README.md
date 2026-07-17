# Multi-tenant blog (`commonblog`)

Host **+ path prefix** select the site. BFF identity matches ChannelAdmin:

| Field | Header | Meaning |
|-------|--------|---------|
| `clientName` | `clientname` | Organization |
| `label` | `label` | Website (one org → many sites) |

Unknown Host/path → **Coming soon**.

## Current mounts (`src/constants/tenants.ts`)

| URL | Org | Label |
|-----|-----|-------|
| `http://localhost:3000/` | `oneauto` | `oneauto` |
| `http://localhost:3000/blog` | `oneauto` | `oneauto` |
| `https://onetruckparts.com/blog` | `oneauto` | `oneauto` |
| `https://nexustruckupgrades.com/blog` | `1p0248qcm3j1k401` | `nexus` |

## Multiple blogs on one domain

Add another row in `SITES` with a different `pathPrefix` + `label`:

```ts
{
  id: "oneauto-blogs2",
  hosts: ["localhost", "onetruckparts.com", "www.onetruckparts.com"],
  pathPrefix: "/blogs2",
  themeKey: "oneauto",
  clientName: "oneauto",
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
