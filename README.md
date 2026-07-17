# OneAuto Blog (Blog1CA)

Next.js multi-tenant blog. Tenant identity comes from the request **Host** via `src/constants/tenants.ts` (no `.env`).

## Clients

Defined in `TENANTS` inside `src/constants/tenants.ts`:

| Key | `clientName` header | `label` |
|-----|---------------------|---------|
| `oneauto` | `oneauto` | `oneauto` |
| `nexus` | `1p0248qcm3j1k401` | `nexus` |

Host routing is in `TENANT_BY_HOST` (e.g. `onetruckparts.com` → oneauto, `nexustruckupgrades.com` → nexus). `localhost` → oneauto.

API base: `BLOG_API_BASE` in the same file.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — hero + paginated blog list
- `/blog/[slug]` — article detail with SEO metadata
- `/api/health` — GKE / LB health probe

## Deploy (GKE)

- **Branch:** `cicd-prod` → Cloud Build (`cloudbuild.yaml`)
- **Image:** `gcr.io/gentle-epoch-277301/commonblog:latest`
- **Deployment:** `commonblog` (manifest lives in onechanneladmin-latest `deploymentsAll/ui/deployment-commonblog.yaml`)

First-time apply (from monorepo):

```bash
kubectl apply -f deploymentsAll/ui/deployment-commonblog.yaml
```

Then push to `cicd-prod` (or run `gcloud builds submit --config=cloudbuild.yaml`).
