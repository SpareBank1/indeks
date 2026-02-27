#!/bin/sh

# Sync tokens with Figma: choose direction

printf "Sync direction (default: From Figma):\n"
printf "Press Enter to sync from Figma, or type 'to' to sync to Figma.\n"
printf "To Figma? (type 'to' to sync to Figma): "
read choice

if [ "$choice" = "to" ]; then
    tsx scripts/figma-api/sync_tokens_to_figma.ts
else
    tsx scripts/figma-api/sync_figma_to_tokens.ts
fi
