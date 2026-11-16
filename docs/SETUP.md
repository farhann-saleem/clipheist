# ClipHeist setup: where everything lives

| Piece | Where | Address |
|---|---|---|
| Landing + pricing (React) + Polar webhook function | Vercel, root directory `frontend` | https://clipheist.site |
| Clipping app (PeakCut) + its Postgres + Caddy HTTPS | AWS EC2 `clipheist-app`, eu-north-1, m7i-flex.large | https://app.clipheist.site (Elastic IP 56.228.122.243) |
| Users, plans, clip credits, orders, waitlist | Supabase project `muuwhviicxjrwxkdfylc` (Stockholm) | https://muuwhviicxjrwxkdfylc.supabase.co |
| Payments | Polar org `clip-heist` (production) | IDs in [POLAR.md](POLAR.md) |
| Google sign-in | Google Cloud OAuth client `48829640373-f3t2k3cd…` | used by Supabase (website) and PeakCut (app) |

## How a sale flows

1. Visitor browses freely. **Join the waitlist / Sign in** opens a window: pick a plan, see the real early-access
   spots left (first 100), and **Continue with Google** (Google's own button on clipheist.site, popup, no redirect;
   the ID token goes to Supabase with `signInWithIdToken`).
2. First sign-in creates a `profiles` row (plan `free`, 3 clips) and a `waitlist` row (database trigger).
3. Buying opens Polar checkout (email pre-filled when signed in, launch discount pre-applied).
4. Polar sends `order.paid` to `https://clipheist.site/api/polar-webhook` (Vercel function, signature checked).
5. The function upserts the order into `orders`; a trigger sets the profile's plan and `clips_total`.
   Paid before ever signing in? The plan is applied the moment they sign in with that email.
6. The navbar and pricing page show "Plan · N clips". The app on AWS reads the same profile later.

## Vercel environment variables (Project → Settings → Environment Variables, all environments)

| Name | Value | Secret? |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://muuwhviicxjrwxkdfylc.supabase.co` | no (public) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_uVlja32cdSjP942bAxewgw_6Zl4UBQk` | no (public) |
| `VITE_GOOGLE_CLIENT_ID` | `48829640373-f3t2k3cdlafto9jpadlji3ke39bfgs46.apps.googleusercontent.com` | no (public) |
| `SUPABASE_URL` | `https://muuwhviicxjrwxkdfylc.supabase.co` | no |
| `SUPABASE_SECRET_KEY` | copy from `backend/.env` | **yes** |
| `POLAR_WEBHOOK_SECRET` | copy from `backend/.env` | **yes** |

`VITE_` values are built into the website. The other three are only for `api/polar-webhook.js` (server side).
Redeploy after adding them.

## One-time dashboard steps

### Supabase
1. **SQL Editor → New query →** paste [`supabase/schema.sql`](../supabase/schema.sql) → **Run**. Then the same with
   [`supabase/002_early_access.sql`](../supabase/002_early_access.sql) (100-spot counter + chosen plan).
2. **Authentication → Sign In / Providers → Google → Enable**. Client ID and Client Secret: from the
   `client_secret_….json` file in the repo root (`client_id`, `client_secret`). Save.
3. **Authentication → URL Configuration**
   - Site URL: `https://clipheist.site`
   - Redirect URLs: `https://clipheist.site/**`, `https://www.clipheist.site/**`, `http://localhost:5500/**`

### Google Cloud Console → APIs & Services → Credentials → the OAuth client
- **Authorized JavaScript origins:** `https://clipheist.site`, `https://app.clipheist.site`, `http://localhost:5500`
- **Authorized redirect URIs:**
  - `https://muuwhviicxjrwxkdfylc.supabase.co/auth/v1/callback` (website sign-in, via Supabase)
  - `https://app.clipheist.site/auth/google/callback` (app sign-in)
  - `https://app.clipheist.site/oauth/youtube/callback` (YouTube connect, later)
- **OAuth consent screen:** app name ClipHeist, support email, logo `assets/logos/1-cut-512.png`,
  home page `https://clipheist.site`, privacy/terms links once those pages exist. Scopes: email, profile, openid
  only (no review needed). Publishing status: **In production**, otherwise only test users can sign in.

### Polar
- Webhook endpoint `ClipHeist orders` → `https://clipheist.site/api/polar-webhook`, events
  `order.paid`, `order.refunded`, `order.updated` (created 2026-11-17, secret in `backend/.env`).

## Server (AWS)

- SSH: `ssh -i ~/.ssh/clip.pem ubuntu@56.228.122.243`
- App folder: `~/clipheist/backend` (`docker compose ps`, `docker compose logs -f app`)
- Config: `~/clipheist/backend/.env` (600, secrets). Add `PEAKCUT_AI_*` there when the Gemini key exists, then
  `docker compose up -d`.
- Update code: from the repo, `rsync` `backend/` and `peakcut-ui/` to `~/clipheist/` (excluding `.env`, `data`,
  `.venv`), then `sudo docker compose up -d --build`.
- First admin: sign in once at https://app.clipheist.site, then
  `sudo docker compose exec app python -m studio.admin grant <your email>`.

## Secrets: where they are (never in git, never in chat)

| Secret | Local | Server | Vercel |
|---|---|---|---|
| Supabase secret key | `backend/.env` | `.env` | `SUPABASE_SECRET_KEY` |
| Polar access token | `backend/.env` | `.env` | – |
| Polar webhook secret | `backend/.env` | `.env` | `POLAR_WEBHOOK_SECRET` |
| Google client secret | `client_secret_….json` | `.env` | Supabase dashboard |
| SSH key | `~/.ssh/clip.pem` (+ `clip.pem` in repo root, git-ignored) | – | – |
