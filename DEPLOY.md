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

**Production domain:** [https://joingiya.com/](https://joingiya.com/)

| Page | URL |
|------|-----|
| GIYA home + Academy | https://joingiya.com/ |
| Keyman Reference | https://joingiya.com/keyman/ |

Preview hostname: https://keyman-insurance.pages.dev/

---

## Custom domain: joingiya.com

Connect **joingiya.com** to the existing Pages project **keyman-insurance** (one-time in the dashboard).

### Prerequisites

- Domain **joingiya.com** is on the **same Cloudflare account** as the Pages project (`66e72ecb625c7e76d017a366156ec53f`), **or** you will add the CNAME records Cloudflare shows after setup.

### Steps

1. Open **[Workers & Pages → keyman-insurance → Custom domains](https://dash.cloudflare.com/66e72ecb625c7e76d017a366156ec53f/pages/view/keyman-insurance/domains)**.
2. Click **Set up a custom domain**.
3. Enter **`joingiya.com`** → **Continue** → confirm DNS (Cloudflare usually creates the records automatically if the zone is on your account).
4. Repeat for **`www.joingiya.com`** (recommended). The repo `_redirects` sends `www` → apex.
5. Wait until both domains show **Active** (often 1–5 minutes).

### If the domain is not on Cloudflare yet

1. Add site **joingiya.com** in **[Websites](https://dash.cloudflare.com/)** and point nameservers at your registrar to Cloudflare.
2. After the zone is active, complete the Custom domains steps above.

### If status stays “Verifying”

- In **DNS** for `joingiya.com`, ensure a **proxied** CNAME for the apex/www points to **`keyman-insurance.pages.dev`** (exact target shown in the Custom domains UI).
- Do not only add a DNS record without also adding the domain under **Pages → Custom domains**.

### After activation

- Production: **https://joingiya.com/** and **https://joingiya.com/keyman/**
- `keyman-insurance.pages.dev` continues to work as a preview URL.

---

## DNS cleanup (joingiya.com zone)

Do this **after** Pages custom domains (`joingiya.com` and `www.joingiya.com`) are **Active**.

1. Open **[joingiya.com → DNS → Records](https://dash.cloudflare.com/7b74ea384bc2ff38a5fb532c3b1c3e48/joingiya.com/dns)**.
2. **Delete** only these legacy Namecheap/parking records (Edit → Delete on each row):

   | Type | Name | Content (approx.) | Why |
   |------|------|-------------------|-----|
   | **A** | `joingiya.com` | `162.255.119.111` | Old parking/hosting IP |
   | **CNAME** | `www` | `parkingpage.namecheap.com` (or similar) | Namecheap parking page |

3. **Do not delete:**

   - **MX** records pointing to `eforward1`–`eforward5.registrar-servers.com` (email forwarding), unless you no longer use `@joingiya.com` email.
   - Records created for **Pages** (often CNAME to `keyman-insurance.pages.dev` or shown in **Pages → Custom domains**).

4. After cleanup, test:

   - https://joingiya.com/
   - https://www.joingiya.com/ (should reach the site or redirect to apex)

If the site stops loading, re-check **Pages → Custom domains** and restore any CNAME Cloudflare shows there.
