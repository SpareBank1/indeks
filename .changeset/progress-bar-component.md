---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Ny ProgressBar-komponent — viser fremdrift i én sammenhengende prosess (opplasting, validering, onboarding). Rent informativ og ikke-interaktiv, med tre tilstander: `active` (pågående 0–100 %), `success` (fullført) og `error` (feilet).

- **CSS** (`@sb1/indeks-css`): `.ix-progress-bar` (dual-target `:where(ix-progress-bar, .ix-progress-bar)`) med sub-regioner (`__header`, `__label`, `__value`, `__track`, `__fill`, `__support`). Fyllgrad via lokal `--ii-progress-bar-fill`, linjehøyde via `--ii-progress-bar-height` (fast, reduseres ikke på noen skjerm). `active` bruker `--ix-color-fill-main-default` på fyllet; `success`/`error` kobler `--ix-color-status-fill` via `data-status`-kaskaden. Mobile-first (full bredde, fungerer fra 320 px), myk overgang på fyllet som respekterer `prefers-reduced-motion`.
- **Web** (`@sb1/indeks-web`): `<ix-progress-bar>` DOM-generator som eier og genererer all indre struktur — forfatteren skriver kun host-elementet med attributter (`value`, `data-state`, `label`, `data-support-text`, `data-show-value`, `data-value-text`). Klamper ugyldige verdier (< 0 → 0, > 100 → 100, ikke-numerisk → 0). I `active` settes `role="progressbar"` med `aria-valuenow`/`aria-valuemin`/`aria-valuemax` og `aria-labelledby`/`aria-describedby`; i `success`/`error` fjernes rollen og value-attributtene, `data-status` (success/danger) settes, og et dekorativt `<ix-icon data-badge>` (check/priority_high) vises alltid. Støtteteksten er en stabil `role="status"`-live-region så overgangen annonseres uten å flytte fokus.
- **React** (`@sb1/indeks-react`): `ProgressBar` — tynn wrapper som rendrer `<ix-progress-bar>` og mapper props (`value`, `state`, `label`, `supportText`, `showValue`, `valueText`, `className`) til attributter. All logikk (klamping, ARIA, ikon) eies av web componenten.

Tilgjengelighet: web componenten advarer i dev når `active` mangler tilgjengelig navn (`label`/`aria-label`) og når `success`/`error` mangler støttetekst (stille overgang). På iOS byttes `active`-rollen til `role="img"` med verdien bakt inn i `aria-label`, siden VoiceOver ikke leser løpende `aria-valuenow`-endringer på en `progressbar` — gjenbrukbar `isIOS()` i `indeks-web/lib/utils/platform.ts`.
