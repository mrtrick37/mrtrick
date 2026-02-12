#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <forum-api-base-url>"
  echo "Example: $0 https://forum.example.com"
  exit 1
fi
URL=$1
FILE=community.html
if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found. Run from the mrtrick directory." >&2
  exit 2
fi
# Replace the PROXY_BASE line in community.html (simple sed)
perl -0777 -pe "s/(const PROXY_BASE = )'';/\1'$URL';/s" -i "$FILE"
echo "Set PROXY_BASE to $URL in $FILE"
