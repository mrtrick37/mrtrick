mrtrick forum-api
=================

Small Express proxy that exposes two endpoints to safely use the GitHub Discussions API from the client-side site.

Prerequisites
-------------
- Node 16+
- A GitHub personal access token with `repo` scope (or `public_repo` for public repos). Set it to `GITHUB_TOKEN` environment variable.

How to get a GitHub Personal Access Token
------------------------------------------
1. Sign in to [github.com](https://github.com).
2. Click your profile photo (top-right) → **Settings**.
3. In the left sidebar, scroll down and click **Developer settings**.
4. Click **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
5. Give the token a descriptive note (e.g. `forum-api-token`).
6. Set an expiration date that suits your needs.
7. Under **Select scopes**, tick:
   - `public_repo` — for a public repository (recommended minimal scope).
   - `repo` — only if the repository is private.
8. Click **Generate token** at the bottom of the page.
9. **Copy the token immediately** — GitHub will not show it again.
10. Store it securely (e.g. a password manager or a secrets manager) and set it as the `GITHUB_TOKEN` environment variable as shown in the examples below.

> **Tip — Fine-grained tokens (newer option):** In step 4 you can also choose
> **Fine-grained tokens** for more granular control.  Grant *Read and write*
> access to **Discussions** for the target repository and no other permissions.

Endpoints
---------
- `GET /discussions?owner=OWNER&repo=REPO` — returns discussions using the GraphQL API.
- `POST /discussions` — create a discussion. JSON body: `{ owner, repo, title, body }`.

Deployment
----------
Deploy this as a small server (Vercel Serverless, Heroku, Fly, or any node host). After deployment, set `PROXY_BASE` in `community.html` to your deployed URL.

Examples
--------
Start locally (for testing):

```bash
GITHUB_TOKEN=ghp_xxx node index.js
# or
export GITHUB_TOKEN=ghp_xxx
node index.js
```

Then in `community.html` set `PROXY_BASE` to `http://localhost:3000` while testing.

Deploying to Fly (recommended)
------------------------------
1. Install `flyctl` and log in: `flyctl auth login`.
2. Create an app or use the name in `fly.toml`:

```bash
flyctl launch --name mrtrick-forum-api --no-deploy
```

3. Set the required secret on Fly (your GitHub token):

```bash
flyctl secrets set GITHUB_TOKEN=ghp_xxx
```

4. Deploy:

```bash
flyctl deploy --config fly.toml
```

Alternatively, push to the repo and the included GitHub Actions workflow will deploy automatically if you add the `FLY_API_TOKEN` secret in the repository settings. The workflow triggers on changes under `forum-api/**`.

