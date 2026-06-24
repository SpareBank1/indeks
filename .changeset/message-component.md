---
'@sb1/indeks-css': minor
'@sb1/indeks-react': minor
---

Ny komponent: Message

Message formidler status eller resultatet av en handling (info, success, warning, danger) inline, tett på relevant innhold. Komponenten støtter valgfri tittel og lukkeknapp, og kan gjøres utvidbar via native `<details>`/`<summary>`.

- HTML-først og CSS-drevet — fullt brukbar uten React via `.ix-message`-klassen (ingen web component).
- Status settes med `status`-prop / `data-status`, som kobler fargevariablene (`--ix-color-status-*`) automatisk; meldingsflaten bruker status-`surface`. Statusikon injiseres av CSS per `data-status`; farge er aldri eneste signal.
- Statusikonet vises som en `ix-icon`-badge (`data-badge`): en sirkel i status-`fill` med en lys glyf oppå. Sirkelfargen følger `data-status`, og glyfen settes med det semantiske navnet `name` (`info`, `hake`, `utropstegn`).
- Utvidbar: summary-headeren spenner full bredde, bruker status-`surface`, og tones til `surface-hover` ved hover og `surface-active` ved trykk. Fokusringen tegnes på selve summary; i ikke-utvidbar modus har kun lukkeknappen sin egen ring.
- Annonsering for skjermlesere skjer via den obligatoriske `MessageRegion`-wrapperen (se eget changeset) — det synlige elementet har ingen `role`/`aria-live`.
- React skjuler meldingen selv når lukkeknappen klikkes; `onClose` kalles i tillegg for ev. opprydding. Lukkeknappen brukes kun i ikke-utvidbar modus.
- Innhold (inkl. lenker via Indeks-lenken `LinkText`) skrives som children; tittelen bruker «headline xs»-typografi og samme tekstfarge som brødteksten.
