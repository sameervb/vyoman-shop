#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Vyoman Shop — Push .env.local to Vercel
# Usage: npm run setup:env
# Run this after filling in all FILL_IN values in .env.local
# ─────────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
SCOPE="sameerbh08-7088s-projects"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  .env.local not found"
  exit 1
fi

# Check for unfilled values
if grep -q "^[^#].*=FILL_IN" "$ENV_FILE"; then
  echo "❌  Some values still say FILL_IN:"
  grep "^[^#].*=FILL_IN" "$ENV_FILE" | cut -d= -f1
  echo ""
  echo "Fill in those values in .env.local and run again."
  exit 1
fi

echo "📦  Pushing env vars to Vercel (production only)..."

while IFS= read -r line; do
  # Skip blank lines and comments
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

  KEY="${line%%=*}"
  VAL="${line#*=}"

  # Skip lines without a key or value
  [[ -z "$KEY" || -z "$VAL" ]] && continue

  echo "  → $KEY"
  vercel env add "$KEY" production \
    --value "$VAL" \
    --scope "$SCOPE" \
    --force \
    --yes 2>/dev/null || true

done < "$ENV_FILE"

echo ""
echo "✅  Done. Triggering production redeploy..."
vercel --prod --yes --scope "$SCOPE" 2>&1 | tail -3
