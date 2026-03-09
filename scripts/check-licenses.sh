#!/usr/bin/env bash
# Sjekker at alle produksjonsavhengigheter har godkjente lisenser.
# Brukes i CI (pr-build-and-preview.yml) og kan kjøres lokalt.
#
# Bruk:
#   ./scripts/check-licenses.sh              # Kun terminal-output
#   PR_NUMBER=123 ./scripts/check-licenses.sh # + GitHub step summary og PR-kommentar (krever gh CLI)

set -euo pipefail

ALLOWED="0BSD MIT MIT-0 ISC BSD-2-Clause BSD-3-Clause Apache-2.0 CC0-1.0 CC-BY-3.0 CC-BY-4.0 BlueOak-1.0.0 Unlicense WTFPL Python-2.0 AFL-2.1"

# Pakker som ignoreres i lisenssjekken.
# Format: IGNORED_PACKAGES+=("pakkenavn")  # Kommentar som forklarer hvorfor
IGNORED_PACKAGES=()
IGNORED_PACKAGES+=("require-like")  # Ingen lisens i package.json; ubrukt transitiv avhengighet via Storybook. Har MIT lisens på github

LICENSE_JSON=$(pnpm licenses list --json --prod 2>/dev/null || true)

if [ -z "$LICENSE_JSON" ]; then
    echo "Kunne ikke hente lisensdata fra pnpm"
    exit 1
fi

# Bygg space-separert streng av ignorerte pakker til jq
IGNORED="${IGNORED_PACKAGES[*]:-}"

# Bruk jq til å gjøre hele sjekken: finn lisenser der ingen del av OR-uttrykket er godkjent,
# og filtrer ut pakker i ignoreringslisten
PROBLEMS=$(echo "$LICENSE_JSON" | jq -r --arg allowed "$ALLOWED" --arg ignored "$IGNORED" '
    ($allowed | split(" ")) as $allow |
    ($ignored | split(" ")) as $ignore |
    to_entries[] |
    .key as $license |
    ($license | gsub("[()]"; "") | split(" OR ")) as $parts |
    select([$parts[] | . as $p | $allow | any(. == $p)] | any | not) |
    .value[] |
    select(.name as $n | $ignore | any(. == $n) | not) |
    "| \(.name) | \(.versions | join(", ")) | \($license) |"
')

if [ -z "$PROBLEMS" ]; then
    echo "Alle produksjonsavhengigheter har godkjente lisenser."
    if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
        {
            echo "## Lisenssjekk"
            echo ""
            echo "Alle produksjonsavhengigheter har godkjente lisenser."
        } >> "$GITHUB_STEP_SUMMARY"
    fi
    exit 0
fi

BODY="## Lisenssjekk: Problematiske lisenser funnet

Følgende produksjonsavhengigheter har lisenser som ikke er på godkjentlisten:

| Pakke | Versjon | Lisens |
|-------|---------|--------|
${PROBLEMS}

> Vurder om lisensen er kompatibel med MIT før merge."

echo "$BODY"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    echo "$BODY" >> "$GITHUB_STEP_SUMMARY"
fi

if [ -n "${PR_NUMBER:-}" ] && command -v gh &>/dev/null; then
    gh pr comment "$PR_NUMBER" --body "$BODY"
fi

echo "::warning::Pakker med problematiske lisenser funnet"
