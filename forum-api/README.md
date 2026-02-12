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
