---
'@sb1/indeks-css': minor
'@sb1/indeks-react': minor
---

Ny komponent: SystemMessage

SystemMessage formidler viktig informasjon på system-/flate-nivå (info, success, warning, danger) — systemstatus, vedlikehold, bekreftelser, advarsler eller feil — enten midlertidig eller mer vedvarende. Den er beslektet med Message, men er et eget, distinkt konsept: ikke utvidbar, kan plasseres som toppbanner, og kan være systemkritisk.

- HTML-først og CSS-drevet — fullt brukbar uten React via `.ix-system-message`-klassen (ingen web component). CSS-en er bevisst frittstående (duplisert fra Message) slik at de to kan divergere fritt senere.
- Status settes med `status`-prop / `data-status`, som kobler fargevariablene (`--ix-color-status-*`) automatisk via det delte status-colors-utility-systemet. Status-typen er generalisert som delt `Status` i indeks-react (`MessageStatus`/`SystemMessageStatus` er aliaser).
- `placement="top"` gir en full-bredde banner flush øverst på en side eller seksjon (uten runde hjørner/sidekanter); `inline` (standard) er et avrundet kort.
- Annonsering: ikke-kritiske meldinger annonseres høflig (køet) via den delte `MessageRegion`-wrapperen — det synlige elementet har da ingen `role`/`aria-live`. `critical` setter `role="alert"` (assertiv) på elementet, slik at kritiske meldinger leses umiddelbart uten å stjele fokus.
- Avbrytbar via `closeLabel`/`onClose` (lukkeknapp). React skjuler meldingen selv; persistens (at en lukket melding ikke dukker opp igjen) er konsumentens ansvar.
- Statusikonet vises som en `ix-icon`-badge (`data-badge`): sirkel i status-`fill` med en lys glyf oppå (`info_i`, `check`, `priority_high`). Farge er aldri eneste signal — teksten bærer budskapet.
