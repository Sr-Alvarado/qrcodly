# Monorepo Deployment Guide

## Architecture

- **Vercel** → `apps/frontend` (Next.js 16)
- **Northflank** → `apps/backend` (Fastify + Node.js) + **MySQL addon**
- **Upstash** → Redis (cache, rate limiting, sessions)
- **Cloudflare R2** → File storage (already configured)

---

## 1. Frontend — Vercel

### Project Settings (Dashboard)

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `apps/frontend` |
| Install Command | *(leave empty — uses `vercel.json`)* |
| Build Command | *(leave empty — uses `vercel.json`)* |

### Environment Variables (Vercel Dashboard)

```
NODE_ENV=production
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.northflank.app/api/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
INTERNAL_API_SECRET=...(generate new 64-char hex)
NEXT_PUBLIC_GOOGLE_API_KEY=...(optional)
```

**Do NOT add these to Vercel:**
- `DB_PASSWORD`
- `REDIS_URL`
- `S3_UPLOAD_SECRET`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `ANALYTICS_ENCRYPTION_KEY`

These are backend-only secrets.

### What `apps/frontend/vercel.json` does

- Runs `pnpm install` from monorepo root so `workspace:*` dependencies resolve
- Builds `packages/shared` and `packages/db` first
- Builds the Next.js app
- Outputs to `.next/` for Vercel deployment

---

## 2. Backend — Northflask

### Project Settings (Dashboard)

| Setting | Value |
|---|---|
| Runtime | Node.js 22+ |
| Root Directory | `apps/backend` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm run build:shared-packages && cd apps/backend && pnpm run build` |
| Start Command | `cd apps/backend && pnpm run start` |
| Port | `8080` (or whatever Northflask assigns) |

### Environment Variables (Northflask Dashboard)

Copy everything from `apps/backend/.env` EXCEPT:
- Remove `API_HOST=0.0.0.0` (Northflask handles binding)
- Change `API_PORT` to match Northflask port (e.g., `8080`)
- Change `BASE_URL` and `BACKEND_URL` to your Northflask domain
- Change `FRONTEND_URL` to your Vercel domain
- Use **production** Clerk keys (`pk_live_` / `sk_live_`)
- Keep TiDB, Redis, S3, JWT, etc. exactly as they are

**Example production `.env`:**

```env
NODE_ENV=production
API_PORT=8080
BASE_URL=https://api.yourapp.com
BACKEND_URL=https://api.yourapp.com
FRONTEND_URL=https://yourapp.com

CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

JWT_SECRET=...(same as before)
COOKIE_SECRET=...(same as before)
INTERNAL_API_SECRET=...(same as before)
ANALYTICS_ENCRYPTION_KEY=...(same as before)

DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=...
DB_PASSWORD=...
DB_NAME=qrcodly

REDIS_URL=rediss://...

S3_ENDPOINT=...
S3_REGION=auto
S3_UPLOAD_KEY=...
S3_UPLOAD_SECRET=...
S3_BUCKET_NAME=wosh-cut
S3_PUBLIC_URL=https://pub-....r2.dev

DISABLE_RATE_LIMITING=false
```

---

## 3. Clerk Production Migration

Clerk has **separate environments** per application (Development vs Production).

### Steps

1. Go to Clerk Dashboard → Your App → **Configure** → **Environments**
2. Switch to **Production** environment
3. Copy the new **Publishable Key** (`pk_live_...`) and **Secret Key** (`sk_live_...`)
4. Add your Vercel domain to **Authorized domains**
5. Add redirect URLs:
   - `https://yourapp.com/sign-up`
   - `https://yourapp.com/sign-in`
   - `https://yourapp.com/sso-callback`
6. **Enable API Keys feature** in production (same as you did in dev)
7. If using webhooks, update webhook URL to production backend
8. Update env vars in both Vercel and Northflask with new live keys

### Important

- Development users **do not** exist in Production
- You will need to create new accounts in production
- API Keys created in dev **do not** carry over

---

## 4. CORS / Security

After deployment, backend CORS is configured in `apps/backend/src/core/server.ts`:

```ts
await this.server.register(fastifyCors, {
    origin: true,  // ← change this in production
});
```

For production, restrict to your exact frontend domain:

```ts
origin: env.FRONTEND_URL,
```

---

## 5. Build Order (Monorepo)

Both platforms must build workspace packages before the app:

```bash
# Root level
pnpm run build:shared-packages  # builds packages/shared + packages/db

# Then each app builds itself
```

`vercel.json` and Northflask Build Command handle this automatically.

---

## 6. Post-Deployment Checklist

- [ ] Frontend loads without 500 errors
- [ ] Backend responds to `/health` or `/api/v1` (check via curl)
- [ ] Short URL redirects work (`yourapp.com/xxxxx`)
- [ ] QR code creation works end-to-end
- [ ] Images load from R2 public domain
- [ ] Clerk auth works (sign up / sign in)
- [ ] API Key creation works in production Clerk
- [ ] Rate limiting active (`DISABLE_RATE_LIMITING=false`)
