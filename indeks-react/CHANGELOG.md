# @sb1/indeks-react

## 0.15.0

### Minor Changes

-   129ee83: Ikon: `name` bruker nå Material Design-navn direkte, norsk-alias-mappingen er fjernet

    Ikoner identifiseres nå med Material Design-navnet (= SVG-filnavnet) direkte, både i `<Icon>` (React) og `<ix-icon>` (web component). Den norske alias-mappingen (`ICON_NAMES`) er fjernet.

    **Migrering — bytt norsk alias til Material Design-navn:**

    | Før (`name`)    | Etter (`name`)        |
    | --------------- | --------------------- |
    | `hjem`          | `home`                |
    | `meny`          | `menu`                |
    | `sparing`       | `savings`             |
    | `lukk`          | `close`               |
    | `pil-hoyre`     | `chevron_right`       |
    | `pil-venstre`   | `chevron_left`        |
    | `pil-ned`       | `keyboard_arrow_down` |
    | `legg-til`      | `add`                 |
    | `hake`          | `check`               |
    | `apne-ekstern`  | `open_in_new`         |
    | `bankkonto`     | `account_balance`     |
    | `rediger`       | `edit`                |
    | `betalingskort` | `credit_card`         |
    | `slett`         | `delete`              |
    | `last-ned`      | `download`            |
    | `e-post`        | `mail`                |
    | `betaling`      | `payments`            |
    | `info`          | `info_i`              |
    | `sok`           | `search`              |
    | `innstillinger` | `settings`            |
    | `bil`           | `directions_car`      |
    | `feil`          | `error`               |
    | `utropstegn`    | `priority_high`       |

    **Andre breaking changes:**

    -   **`materialDesignName`-propen (React) og `materialdesignname`-attributtet (web) er fjernet.** Bruk `name` — det tar nå det samme Material Design-navnet. Erstatt `materialDesignName="foo"` med `name="foo"`.
    -   **`ICON_NAMES` og typen `IconValue` er fjernet.** For autocomplete på de vanligste ikonene, bruk den nye `COMMON_ICON_NAMES` / `CommonIconName`. `name` godtar fortsatt hvilken som helst Material Design-streng.
    -   **`availableMaterialDesignIconNames` (runtime-array) er fjernet** fra `@sb1/indeks-react` (fjerner ~100 kB fra bundelen). Typen `MaterialDesignIconName` beholdes.

    Typen `IconName` er nå `CommonIconName | (string & {})`: de mest brukte SB1-ikonene autofullføres, mens alle andre Material Design-navn godtas uten typefeil.

## 0.14.0

### Minor Changes

-   a73dbc2: Card: byttbart chevron-ikon på klikkbart kort.

    -   **`chevronIcon`-prop** lar deg bytte ut chevronen som viser at kortet er klikkbart.
        Chevronen er et ekte `ix-icon` (klassen `.ix-card__chevron`) med `pil-hoyre` som standard,
        i stedet for et hardkodet tegn.

-   a73dbc2: Gjør det tydelig at et `Card` er klikkbart, også på touch. Før viste `.ix-card--clickable` at kortet var klikkbart kun ved `:hover` — men hover finnes ikke på mobil, så et klikkbart kort så helt likt ut som et statisk. Nå har klikkbart kort alltid en synlig chevron som viser at det kan trykkes. Kortet er flatt (ingen skygge): `:hover` gir en bakgrunnstone, `:active` viser at kortet trykkes (viktig på touch, der `:hover` mangler), og `:focus-visible` gir en fokusring. Hover-overgangen er konsistent for alle klikkbare varianter — også `<a>` — uavhengig av global anker-styling (f.eks. en `a { transition: color }`-regel fra en CSS-reset). `prefers-reduced-motion` respekteres.

    React-wrapperen `<Card>` rendrer nå et ekte semantisk element — `<a>` ved `href`, `<button>` ved `onClick`, ellers `<div>` — i stedet for en `<div>` med `role`/`onClick`/`window.location.href`. Dette gir korrekt rolle, tastaturstøtte og fokus gratis, og fjerner den tidligere `javascript:`-XSS-risikoen.

## 0.13.0

### Minor Changes

-   3e5f688: Ny komponent: Accordion

    Accordion viser og skjuler innhold i seksjoner. Den bygger på native `<details>`/`<summary>`, så tastatur (Tab, Enter/Space) og skjermleser-semantikk (disclosure med åpen/lukket-tilstand) fungerer uten ekstra ARIA — og uten JavaScript.

    -   Ren CSS: ingen web-komponent. Seksjonene er uavhengige (flere kan stå åpne samtidig). Den myke åpne/lukke-animasjonen er en progressiv CSS-enhancement (`interpolate-size` + `::details-content`); nettlesere uten støtte hopper bare åpent/lukket, fortsatt fullt funksjonelt.
    -   React-laget er et tynt, compound-API: `Accordion` (en `<div class="ix-accordion">`) med `Accordion.Item` (→ `<details>`), `Accordion.Header` (→ `<summary>`) og `Accordion.Content`. `defaultOpen` på `Accordion.Item` speiler native `<details open>`.
    -   Fullt brukbar uten React via klassene `.ix-accordion`, `.ix-accordion__item`, `.ix-accordion__header` og `.ix-accordion__content` på native `<details>`/`<summary>`.
    -   Visuelle states (default, hover, active, focus, expanded) er definert; en chevron roterer for å vise tilstand, og animasjonen respekterer `prefers-reduced-motion`. Fokusring kun på header.
    -   Bevisst avvik fra akseptansekriteriene: header er `<summary>` framfor `<button aria-expanded aria-controls>`. Native disclosure oppfyller samme intensjon (fokuserbar knapp, Enter/Space, annonsert tilstand) uten eksplisitt aria-kobling, siden innholdet ligger inne i samme `<details>`. Dokumentert i tilgjengelighets-tabellen.

## 0.12.0

### Minor Changes

-   16d448a: Ny Grid-komponent for todimensjonal layout

    Grid er en layout-primitiv for å stable innhold i to dimensjoner. Den finnes som:

    -   Custom element: `<ix-grid cols="3" gap="md">`
    -   CSS-klasse: `.ix-grid` med modifier-klasser
    -   React-komponent: `<Grid cols={3} gap="md">`

    Støtter faste kolonner (1-12), responsiv layout (auto-fit/auto-fill), align/justify, og colspan/rowspan på barn.

## 0.11.0

### Minor Changes

-   bae9da7: Legg til InteractiveIcon — en klikkbar ikon-flate (icon button) som wrapper et `ix-icon` i et native `<button>`. Gir visuell feedback ved hover, trykk og fokus, med fargetone styrt av `status` (`default` | `info` | `success` | `warning` | `danger`). Krever `aria-label`. Tilgjengelig som CSS-klasse `.ix-interactive-icon` og React-komponent `<InteractiveIcon>`.

    I tillegg eksponerer status-fargesystemet (`@sb1/indeks-utils`) nå `--ix-color-status-fill-subtle-hover` og `--ix-color-status-fill-subtle-active`, slik at subtle-fyll kan reagere på hover/trykk per status.

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
