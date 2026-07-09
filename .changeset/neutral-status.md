---
"@sb1/indeks-utils": patch
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

`neutral` er den eksplisitte nøytral-verdien i status-farge-systemet — samme main-flate
som ellers, ingen nye fargetokens.

- **`--ix-color-status-*`** har `neutral` i samme selektor-gruppe som `:root`, så nøytral
  virker i ren HTML/CSS uten `data-status` (fallback fra `:root`).
- **Delt `Status`-type** (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`)
  eksporteres fra `@sb1/indeks-react`. `Surface` bruker den med `neutral` som default og
  setter `data-status` direkte.

For ren HTML: et `.ix-surface` uten `data-status` inni en `[data-status]`-forelder
arver forelderens statusfarge — sett `data-status="neutral"` for å bryte arven.
