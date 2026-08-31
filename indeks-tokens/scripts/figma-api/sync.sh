#!/bin/sh

# Velger retning for token-sync mot Figma.
#
#   pnpm sync                     spør om retning (standard: fra Figma)
#   pnpm sync fra                 henter fra Figma uten å spørre
#   pnpm sync fra --output mappe  henter fra Figma til valgt mappe
#   pnpm sync til                 skriver til Figma (krever bekreftelse)

set -e

direction=''
case "$1" in
    -*) ;; # flagg – la det gå videre til tsx-scriptet
    ?*)
        direction="$1"
        shift
        ;;
esac

if [ -z "$direction" ]; then
    printf '\033[1mToken-sync mot Figma\033[0m\n\n'
    printf '  \033[1m1\033[0m  Figma  \033[1m→\033[0m  kode    leser variabler fra Figma til tokens/colors/from-figma  \033[2m(standard)\033[0m\n'
    printf '  \033[1m2\033[0m  kode   \033[1m→\033[0m  Figma    skriver theme-tokens inn i Figma-fila\n\n'
    printf 'Velg retning [1]: '
    read -r direction
fi

case "$direction" in
    2 | til | to | to-figma)
        printf '\n\033[1m→ Synker TIL Figma (kode → Figma)\033[0m\n\n'
        exec tsx scripts/figma-api/sync_tokens_to_figma.ts "$@"
        ;;
    1 | fra | from | from-figma | '')
        printf '\n\033[1m← Synker FRA Figma (Figma → kode)\033[0m\n\n'
        exec tsx scripts/figma-api/sync_figma_to_tokens.ts "$@"
        ;;
    *)
        printf '\033[1;31mUkjent retning: %s\033[0m (bruk 1/fra eller 2/til)\n' "$direction"
        exit 1
        ;;
esac
