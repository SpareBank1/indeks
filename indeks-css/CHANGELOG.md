# @sb1/indeks-css

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

-   abb20ac: Ny `data-badge`-variant på `ix-icon`

    `<ix-icon data-badge>` rendrer ikonet som en badge — en glyf på en farget sirkel.
    Selve elementet blir sirkelen, og glyfen flyttes til `::before` (to paint-lag fordi
    ett `mask-image` kun gir ett lag). Variabler for tilpasning:
    `--ix-icon-badge-background` (sirkel, default `currentColor`),
    `--ix-icon-badge-foreground` (glyf, default `--ix-color-foreground-inverse-default`),
    `--ix-icon-badge-size` (default 32px) og `--ix-icon-badge-glyph-size`
    (default `--ix-font-size-lg`). Glyfen leser `--ii-icon-url`, så badgen virker både
    navn/web-component-drevet og rent CSS-drevet. Settes `data-status` på elementet,
    bruker sirkelen statusfargen (`--ix-color-status-fill`) automatisk.

-   abb20ac: Ny komponent: Message

    Message formidler status eller resultatet av en handling (info, success, warning, danger) inline, tett på relevant innhold. Komponenten støtter valgfri tittel og lukkeknapp, og kan strekkes til full bredde av forelderen.

    -   HTML-først og CSS-drevet — fullt brukbar uten React via `.ix-message`-klassen (ingen web component).
    -   Status settes med `status`-prop / `data-status`, som kobler fargevariablene (`--ix-color-status-*`) automatisk; meldingsflaten bruker status-`surface`. Statusikon injiseres av CSS per `data-status`; farge er aldri eneste signal.
    -   Statusikonet vises som en `ix-icon`-badge (`data-badge`): en sirkel i status-`fill` med en lys glyf oppå. Sirkelfargen følger `data-status`, og glyfen settes med det semantiske navnet `name` (`info`, `hake`, `utropstegn`).
    -   Full bredde (`fullWidth` / `data-full-width`): meldingen strekker seg til full bredde av forelderen i stedet for å krympe til innholdsbredden (f.eks. i en vertikal `VStack`/`ix-stack`). Avrundede hjørner beholdes.
    -   Annonsering for skjermlesere skjer via den obligatoriske `MessageRegion`-wrapperen (se eget changeset) — det synlige elementet har ingen `role`/`aria-live`.
    -   React skjuler meldingen selv når lukkeknappen klikkes; `onClose` kalles i tillegg for ev. opprydding.
    -   Innhold (inkl. lenker via Indeks-lenken `LinkText`) skrives som children; tittelen bruker «headline xs»-typografi og samme tekstfarge som brødteksten.

### Patch Changes

-   abb20ac: Fiks lenkefarge i `.ix-link-text`

    `.ix-link-text` pekte på et udefinert token (`--ix-color-foreground-interactive-link`) og
    arvet derfor brødtekstfargen i stedet for lenkefargen. Bruker nå
    `--ix-color-foreground-link-default` (og `--ix-color-foreground-link-active` for `--active`),
    og legger til en `:hover`-regel med `--ix-color-foreground-link-hover`.

-   abb20ac: Sentrer Message-innhold vertikalt mot statusikonet

    `.ix-message` brukte `align-items: flex-start`, så en kort melding (kun tittel
    eller én linje) ble toppjustert mens det 32px høye statusikonet stakk ut under.
    Roten sentrerer nå innholdet vertikalt (`align-items: center`), mens statusikonet
    og lukkeknappen selv-justerer til toppen (`align-self: flex-start`) slik at de
    fortsatt flukter med tittelen når meldingen går over flere linjer.

## 0.9.1

### Patch Changes

-   d2ab9f9: `ix-icon` viser ikke lenger en farget boks før web-componenten laster. Masken har nå en gjennomsiktig fallback (`--ii-icon-url` ikke satt), så ikonet er usynlig til `<ix-icon>` oppgraderes og setter ikon-URL-en.

## 0.9.0

### Minor Changes

-   f0707b4: Legg til `RadioGroup` og `RadioButton` med full støtte for tilstander, orientering og a11y.

    -   `@sb1/indeks-css`: `radio-group.css` skrevet om — alle tilstander (default, hover, focus, selected, error, readOnly, disabled), vertikal/horisontal orientering, touch-mål 44×44 px, `prefers-reduced-motion`.
    -   `@sb1/indeks-web`: ny `<ix-radio-group>` web component (ARIA-lim) som setter `role="radiogroup"`, `aria-labelledby`, `aria-describedby`, `aria-live="polite"` og synkroniserer `aria-invalid`, `name`, `disabled`, `required` og `aria-required` på riktig nivå. Blokkerer tastatur-endringer i `readonly`-tilstand.
    -   `@sb1/indeks-react`: `RadioGroup` skrevet om til compound-mønster med `RadioButton`-barn. Støtter kontrollert/ukontrollert bruk, `legend`, `description`, `errorMessage`, `orientation`, `hideLegend`, `disabled`, `readOnly`, `required`. Erstatter den gamle flat-array-API-en (breaking endring i komponentens API, men ikke i typenavn).

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

### Minor Changes

-   8dabdba: Inline `@sb1/indeks-tokens` og `@sb1/indeks-utils` i den bygde CSS-filen
    (`dist/npm/index.css`). Konsumenter trenger nå kun å installere
    `@sb1/indeks-css` — tokens og utils er ikke lenger separate
    `dependencies`, men er bundlet inn i hoved-CSS-en.

    Dette forenkler også oppsett av VSCode-autocomplete: peker man til
    `node_modules/@sb1/indeks-css/dist/npm/index.css`, får man alle
    klassenavn og CSS-variabler i én fil.

    CDN-bygget er uendret — det beholder fortsatt `@import` mot
    `cdn.sparebank1.no/indeks/tokens/<v>/index.css` og tilsvarende for utils
    slik at nettleseren kan parallellaste og cache dem granulært.

    Bundle-størrelsen for `@sb1/indeks-css`-npm-pakken øker fra ~21 KB til
    ~130 KB fordi tokens (~37 KB) og utils (~72 KB) nå inngår. Brotli-
    komprimert leveranse i produksjon tar seg av størrelsen.

## 0.3.1

### Patch Changes

-   Updated dependencies [bc00000]
    -   @sb1/indeks-tokens@0.5.1
    -   @sb1/indeks-utils@0.2.1

## 0.3.0

### Minor Changes

-   31fea2e: Legg til TextArea og oppdater TextField

    Gå mer bort fra BEM der det ikke trengs.
    Implementer IxField som wrapper inputkomponentene

### Patch Changes

-   Updated dependencies [31fea2e]
    -   @sb1/indeks-tokens@0.5.0
    -   @sb1/indeks-utils@0.2.0

## 0.2.21

## 0.2.20

### Patch Changes

-   Updated dependencies [090d027]
    -   @sb1/indeks-tokens@0.4.18
    -   @sb1/indeks-utils@0.1.22

## 0.2.19

### Patch Changes

-   Updated dependencies [52b0118]
    -   @sb1/indeks-tokens@0.4.17
    -   @sb1/indeks-utils@0.1.21

## 0.2.18

### Patch Changes

-   Updated dependencies [88af357]
    -   @sb1/indeks-tokens@0.4.16
    -   @sb1/indeks-utils@0.1.20

## 0.2.17

### Patch Changes

-   Updated dependencies [954ac6e]
    -   @sb1/indeks-tokens@0.4.15
    -   @sb1/indeks-utils@0.1.19

## 0.2.16

### Patch Changes

-   Updated dependencies [5b6e379]
    -   @sb1/indeks-tokens@0.4.14
    -   @sb1/indeks-utils@0.1.18

## 0.2.15

### Patch Changes

-   Updated dependencies [59fa1cc]
    -   @sb1/indeks-tokens@0.4.13
    -   @sb1/indeks-utils@0.1.17

## 0.2.14

### Patch Changes

-   Updated dependencies [c4da976]
    -   @sb1/indeks-tokens@0.4.12
    -   @sb1/indeks-utils@0.1.16

## 0.2.13

### Patch Changes

-   Updated dependencies [f869f4e]
    -   @sb1/indeks-tokens@0.4.11
    -   @sb1/indeks-utils@0.1.15

## 0.2.12

### Patch Changes

-   Updated dependencies [aaab805]
    -   @sb1/indeks-tokens@0.4.10
    -   @sb1/indeks-utils@0.1.14

## 0.2.11

### Patch Changes

-   Updated dependencies [f695cb3]
    -   @sb1/indeks-tokens@0.4.9
    -   @sb1/indeks-utils@0.1.13

## 0.2.10

### Patch Changes

-   Updated dependencies [93b4c27]
    -   @sb1/indeks-tokens@0.4.8
    -   @sb1/indeks-utils@0.1.12

## 0.2.9

### Patch Changes

-   Updated dependencies [b5e9699]
    -   @sb1/indeks-tokens@0.4.7
    -   @sb1/indeks-utils@0.1.11

## 0.2.8

### Patch Changes

-   Updated dependencies [52af259]
    -   @sb1/indeks-tokens@0.4.6
    -   @sb1/indeks-utils@0.1.10

## 0.2.7

### Patch Changes

-   eef074e: trigge bygg

## 0.2.6

### Patch Changes

-   880bf55: trigger build

## 0.2.5

### Patch Changes

-   Updated dependencies [455a8ad]
    -   @sb1/indeks-tokens@0.4.5
    -   @sb1/indeks-utils@0.1.9

## 0.2.4

### Patch Changes

-   Updated dependencies [9270342]
    -   @sb1/indeks-tokens@0.4.4
    -   @sb1/indeks-utils@0.1.8

## 0.2.3

### Patch Changes

-   Updated dependencies [fa9392c]
    -   @sb1/indeks-tokens@0.4.3
    -   @sb1/indeks-utils@0.1.7

## 0.2.2

### Patch Changes

-   Updated dependencies [b4570a0]
    -   @sb1/indeks-tokens@0.4.2
    -   @sb1/indeks-utils@0.1.6

## 0.2.1

### Patch Changes

-   Updated dependencies [9fce105]
    -   @sb1/indeks-tokens@0.4.1
    -   @sb1/indeks-utils@0.1.5

## 0.2.0

### Patch Changes

-   Updated dependencies [77fdff6]
-   Updated dependencies [a24b3f8]
-   Updated dependencies [3a4b45d]
    -   @sb1/indeks-tokens@0.4.0
    -   @sb1/indeks-utils@0.1.4

## 0.1.3

### Patch Changes

-   Updated dependencies [01a700c]
    -   @sb1/indeks-tokens@0.3.0
    -   @sb1/indeks-utils@0.1.3

## 0.1.2

### Patch Changes

-   Updated dependencies [288ea64]
    -   @sb1/indeks-tokens@0.2.0
    -   @sb1/indeks-utils@0.1.2

## 0.1.1

### Patch Changes

-   Updated dependencies [0c13f36]
    -   @sb1/indeks-tokens@0.1.1
    -   @sb1/indeks-utils@0.1.1

## 0.1.0

### Minor Changes

-   4ee4990: Trigge release riktig

### Patch Changes

-   Updated dependencies [4ee4990]
    -   @sb1/indeks-tokens@0.1.0
    -   @sb1/indeks-utils@0.1.0
