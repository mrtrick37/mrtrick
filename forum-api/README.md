mrtrick forum-api
=================

Small Express proxy that exposes two endpoints to safely use the GitHub Discussions API from the client-side site.

Prerequisites
-------------
- Node 16+
- A GitHub personal access token with `repo` scope (or `public_repo` for public repos). Set it to `GITHUB_TOKEN` environment variable.

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

