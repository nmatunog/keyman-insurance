# Deploy & GitHub ↔ Cloudflare

## Option A — Connect Git in Cloudflare Dashboard (recommended for PR previews)

Your project already exists: **keyman-insurance**  
Repo: **https://github.com/nmatunog/keyman-insurance**

### Steps

1. Open **[Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)**.
2. Click project **`keyman-insurance`** (not Create new).
3. Go to **Settings** → **Builds** (or **Builds & deployments**).
4. Under **Git repository**, click **Connect to Git** or **Manage** → **Connect Git repository**.
5. Choose **GitHub** → authorize **Cloudflare Workers and Pages** if prompted.
6. Select account **`nmatunog`** → repository **`keyman-insurance`** → **Begin setup**.
7. Configure build (static site — no framework):

   | Setting | Value |
   |---------|--------|
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *(leave empty)* |
   | Build output directory | `/` |

8. Save. Cloudflare runs a production deploy from `main`.

### After connecting

- Every **push to `main`** → production deploy  
- **Pull requests** → preview URLs (if enabled in Settings → Builds)  
- You can turn off “automatic deployments” later and rely on GitHub Actions only

### If “Connect Git” is greyed out

The project was created via CLI. Use **Manage** on the existing project, or:

1. **Settings → Builds → Manage** → **Connect Git repository**  
2. Or uninstall/reinstall the [Cloudflare Workers and Pages GitHub App](https://github.com/settings/installations) and reconnect (see [Cloudflare docs](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)).

---

## Option B — GitHub Actions (already in this repo)

Workflow: `.github/workflows/deploy-cloudflare-pages.yml`

### One-time secrets (GitHub)

1. **Cloudflare API token**  
   - [Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)  
   - **Create Token** → template **Edit Cloudflare Workers** (includes Pages)  
   - Copy token → GitHub repo **Settings → Secrets → Actions** → `CLOUDFLARE_API_TOKEN`

2. **Account ID**  
   - Workers & Pages overview → right sidebar **Account ID**  
   - GitHub secret: `CLOUDFLARE_ACCOUNT_ID` = `66e72ecb625c7e76d017a366156ec53f` *(from your Pages project)*

3. Push to `main` — Actions tab should show **Deploy to Cloudflare Pages**.

---

## Manual deploy (local)

```bash
cd /Users/nmatunog2/Business-insurance
npx wrangler pages deploy . --project-name=keyman-insurance --branch=main
```

## Live URLs

- https://keyman-insurance.pages.dev/
- https://keyman-insurance.pages.dev/keyman/
