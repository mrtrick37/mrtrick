#!/usr/bin/env bash
# Simple test to create a discussion via the forum-api proxy
# Usage: PROXY_BASE=http://localhost:3000 GITHUB_OWNER=mrtrick37 GITHUB_REPO=mrtrick ./test_create.sh

set -euo pipefail

PROXY_BASE=${PROXY_BASE:-http://localhost:3000}
OWNER=${GITHUB_OWNER:-mrtrick37}
REPO=${GITHUB_REPO:-mrtrick}

TITLE="Test discussion from script $(date -Iseconds)"
BODY="This is a test discussion created by test_create.sh on $(hostname)."

echo "Posting to $PROXY_BASE/discussions for $OWNER/$REPO"
curl -s -X POST "$PROXY_BASE/discussions" -H "Content-Type: application/json" -d "{\"owner\":\"$OWNER\",\"repo\":\"$REPO\",\"title\":\"$TITLE\",\"body\":\"$BODY\"}" | jq || true
