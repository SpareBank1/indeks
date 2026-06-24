# @sb1/indeks-react

## 0.10.0

### Minor Changes

-   abb20ac: Semantiske navn for `info_i` og `priority_high`

    `ICON_NAMES` får to nye semantiske navn slik at statusikonene kan brukes uten å oppgi det rå Material Design-navnet:

    -   `info` peker nå på `info_i`-glyfen (kanonisk, slått sammen med `info` per ikonbruksanalysen).
    -   `utropstegn` peker på `priority_high` (slått sammen med `exclamation`).

    Message bruker disse semantiske navnene internt (`name` i stedet for `materialdesignname`), og dokumentasjon/eksempler er oppdatert tilsvarende.

-   abb20ac: Ny komponent: Message

    Message formidler status eller resultatet av en handling (info, success, warning, danger) inline, tett på relevant innhold. Komponenten støtter valgfri tittel og lukkeknapp, og kan strekkes til full bredde av forelderen.

    -   HTML-først og CSS-drevet — fullt brukbar uten React via `.ix-message`-klassen (ingen web component).
    -   Status settes med `status`-prop / `data-status`, som kobler fargevariablene (`--ix-color-status-*`) automatisk; meldingsflaten bruker status-`surface`. Statusikon injiseres av CSS per `data-status`; farge er aldri eneste signal.
    -   Statusikonet vises som en `ix-icon`-badge (`data-badge`): en sirkel i status-`fill` med en lys glyf oppå. Sirkelfargen følger `data-status`, og glyfen settes med det semantiske navnet `name` (`info`, `hake`, `utropstegn`).
    -   Full bredde (`fullWidth` / `data-full-width`): meldingen strekker seg til full bredde av forelderen i stedet for å krympe til innholdsbredden (f.eks. i en vertikal `VStack`/`ix-stack`). Avrundede hjørner beholdes.
    -   Annonsering for skjermlesere skjer via den obligatoriske `MessageRegion`-wrapperen (se eget changeset) — det synlige elementet har ingen `role`/`aria-live`.
    -   React skjuler meldingen selv når lukkeknappen klikkes; `onClose` kalles i tillegg for ev. opprydding.
    -   Innhold (inkl. lenker via Indeks-lenken `LinkText`) skrives som children; tittelen bruker «headline xs»-typografi og samme tekstfarge som brødteksten.

-   abb20ac: Ny `MessageRegion`-wrapper for pålitelig skjermleser-annonsering av `Message`. `Message` setter ikke lenger `role`/`aria-live` på det synlige elementet — i stedet annonseres meldingsteksten gjennom én stabil, alltid-tilstedeværende `polite` live-region som `MessageRegion` eier. Hver melding legges til som en egen node (`aria-atomic="false"`), slik at flere meldinger som dukker opp tett etter hverandre alle leses opp fortløpende i tur i stedet for at den siste overskriver de andre. Dynamisk innsatte meldinger annonseres automatisk; meldinger til stede ved sidelast er stille med mindre den nye `announceOnPageLoad`-propen er satt. Ny `announceText`-prop overstyrer den opplest teksten.

## 0.9.1

## 0.9.0

### Minor Changes

-   f0707b4: Legg til `RadioGroup` og `RadioButton` med full støtte for tilstander, orientering og a11y.

    -   `@sb1/indeks-css`: `radio-group.css` skrevet om — alle tilstander (default, hover, focus, selected, error, readOnly, disabled), vertikal/horisontal orientering, touch-mål 44×44 px, `prefers-reduced-motion`.
    -   `@sb1/indeks-web`: ny `<ix-radio-group>` web component (ARIA-lim) som setter `role="radiogroup"`, `aria-labelledby`, `aria-describedby`, `aria-live="polite"` og synkroniserer `aria-invalid`, `name`, `disabled`, `required` og `aria-required` på riktig nivå. Blokkerer tastatur-endringer i `readonly`-tilstand.
    -   `@sb1/indeks-react`: `RadioGroup` skrevet om til compound-mønster med `RadioButton`-barn. Støtter kontrollert/ukontrollert bruk, `legend`, `description`, `errorMessage`, `orientation`, `hideLegend`, `disabled`, `readOnly`, `required`. Erstatter den gamle flat-array-API-en (breaking endring i komponentens API, men ikke i typenavn).

-   f0707b4: Legg til `ValidationMessage`-komponent for feilmeldinger i form-komponenter. Rendrer `<span data-field="error">` slik at den styles av Indeks-CSS og kobles automatisk via `aria-describedby` når den ligger inne i `<ix-field>` eller `<ix-radio-group>`.

## 0.8.0

### Minor Changes

-   8a3159e: Ny komponent - checkbox

## 0.7.0

### Minor Changes

-   2acdfbd: Button viser nå en spinner ved `loading=true`. Spinneren skalerer automatisk
    med knappens font-size og erstatter eventuelle ikoner i `children`. Ved bruk
    direkte i HTML må konsumenten selv plassere `<span class="ix-spinner" aria-hidden>`
    inni knappen og sette `disabled` + `data-loading="true"`.

## 0.6.0

### Minor Changes

-   2348f42: Legg til ix-icon komponent

## 0.5.0

### Minor Changes

-   9a41a0e: Legg til tooltip

## 0.4.0

## 0.3.1

## 0.3.0

### Minor Changes

-   31fea2e: Legg til TextArea og oppdater TextField

    Gå mer bort fra BEM der det ikke trengs.
    Implementer IxField som wrapper inputkomponentene

## 0.2.21

## 0.2.20

## 0.2.19

## 0.2.18

## 0.2.17

## 0.2.16

## 0.2.15

## 0.2.14

## 0.2.13

## 0.2.12

## 0.2.11

## 0.2.10

## 0.2.9

## 0.2.8

## 0.2.7

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.1

## 0.2.0

### Minor Changes

-   2efc4fc: Fiks bygg

## 0.1.3

## 0.1.2

## 0.1.1

## 0.1.0
