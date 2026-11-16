# Rubuto Yvan — Portfolio

Personal portfolio with a private admin portal. Next.js 14 (App Router), Three.js via React Three Fiber, Framer Motion, Tailwind, Satoshi.

- **Design:** red / black / grey, sharp edges, framed grids with `+` registration marks, dark **and** light themes.
- **3D:** grey cube-wave hero, dotted globe (About), floating faceted shards (footer). Scenes pause when off-screen and respect `prefers-reduced-motion`.
- **Admin (`/admin`):** projects (images, screenshot capture, GitHub import, link checker), profile/hero, approach, skills, journey, testimonials, an encrypted contact inbox, backups and version history.

## Run locally

```bash
bun install
cp .env.example .env.local   # then set ADMIN_PASSWORD and ADMIN_SECRET
bun dev                      # http://localhost:3000 — admin at /admin
```

`ADMIN_SECRET` must be 32+ random characters: `openssl rand -base64 32`.

## Where content lives

Everything the admin edits is validated by `lib/content/schema.ts` and stored by `lib/content/storage.ts`, which picks a driver automatically:

| Where it runs | Driver | Content | Images | Inbox |
| --- | --- | --- | --- | --- |
| `bun dev` (no Blob token) | **local** | `content/portfolio.json` | `public/uploads/` | `content/.inbox/` (gitignored) |
| Vercel + Blob store | **blob** | versioned snapshots in `cms/content/` | `cms/uploads/` | `cms/inbox/` |
| Vercel without Blob | **read-only** | bundled `content/portfolio.json` | — | messages are logged only |

Local edits change `content/portfolio.json` and `public/uploads/`, so you can commit them like code and they ship with the next deploy. (Under `next start`, files added to `public/` after the build aren't served — use `bun dev` for local editing.)

## Deploy (Vercel)

1. Add environment variables (Project → Settings → Environment Variables): `ADMIN_PASSWORD`, `ADMIN_SECRET`. Use different values from your local ones.
2. Create a **Blob** store (Storage → Create → Blob) and connect it to the project — this adds `BLOB_READ_WRITE_TOKEN`.
3. Redeploy. The admin on the live site now saves straight to Blob; changes go live instantly (on-demand revalidation, no redeploy).

Optional: `GITHUB_TOKEN` (higher API limits for repo import), `MICROLINK_API_KEY` (more than ~50 screenshot captures/day), `NEXT_PUBLIC_SITE_URL`.

## Security notes

- `/admin` and `/api/admin` are gated by middleware **and** every page, server action and route handler re-verifies the session (HMAC-signed, HttpOnly, `SameSite=Strict`, 7 days). Changing `ADMIN_PASSWORD` or `ADMIN_SECRET` signs out every session.
- Login attempts are rate-limited and delayed; uploads are size-limited and checked by magic bytes (no SVG).
- Contact messages are AES-256-GCM encrypted at rest with a key derived from `ADMIN_SECRET` (rotating the secret makes old messages unreadable).
- Every link is validated as `https:`/`http:` (`mailto:`/`tel:` for socials) before it can be saved.

## Fonts

Satoshi is loaded from the official Fontshare API (`app/layout.tsx`). Its ITF Free Font License allows web use but not redistributing the font files through a public repository, so the files are intentionally **not** committed. A metric-matched fallback (`app/globals.css`) prevents layout shift while it loads.

## Scripts

```bash
bun dev          # development
bun run build    # production build
bun run lint     # ESLint
```
