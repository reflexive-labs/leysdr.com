# Deployment — leysdr.com

The site is a fully static Astro build (`dist/`) served from **AWS S3 + CloudFront**. The
setup mirrors sierragridteam.org.

## How deploys run

- **Automatic:** `.github/workflows/deploy.yml` runs when the **CI** workflow succeeds on
  `main`. It builds, checks the AWS account, syncs `dist/` to S3 (fingerprinted assets cached
  as immutable, HTML/XML/TXT/JSON revalidated on every request), then invalidates CloudFront.
- **Manual:** run the **Deploy** workflow from the Actions tab (_Run workflow_).

## GitHub configuration

Set under **Settings → Secrets and variables → Actions**. Only the keys are secrets.

| Name                    | Kind     | Value               |
| ----------------------- | -------- | ------------------- |
| `AWS_ACCESS_KEY_ID`     | Secret   | deploy IAM user key |
| `AWS_SECRET_ACCESS_KEY` | Secret   | deploy IAM user key |
| `AWS_REGION`            | Variable | `us-east-1`         |
| `AWS_ACCOUNT_ID`        | Variable | 12-digit account ID |
| `S3_BUCKET_NAME`        | Variable | bucket name         |
| `CF_DISTRO_ID`          | Variable | distribution ID     |

The deploy aborts if the authenticated account differs from `AWS_ACCOUNT_ID`.

## CloudFront expectations

Infra is provisioned separately (Terraform). The site assumes:

- Default root object `index.html`, with the bucket private behind Origin Access Control.
- Custom error responses **403 → `/403.html`** and **404 → `/404.html`**, both returning
  status 404. A missing object behind OAC returns 403, so both are needed; `403.html` is a
  build-time copy of `404.html` (see `astro.config.mjs`).
- If more pages are added, a viewer-request CloudFront Function that maps `/page` to
  `/page/index.html` (the same one sierragridteam.org uses). Today the site is one page.
