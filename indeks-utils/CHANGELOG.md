# @sb1/indeks-utils

## 0.8.0

### Minor Changes

-   bee3cd1: Forenklet spacing- og font-systemet betraktelig. Spacing bruker nå faste px-verdier på tre mobile-first breakpoints (mobil, tablet fra `768px`, desktop fra `1024px`) i stedet for kontinuerlig fluid `clamp()`-skalering. De minste verdiene (`2xs`–`lg`) er like på alle breakpoints; kun `xl`–`5xl` øker på tablet og desktop. Ny `5xl`-spacing-token med tilhørende utility-klasser (`.ix-{m,p,gap}-5xl` + responsive varianter og `ix-stack`/`ix-grid` `gap="5xl"`), og `GapSize`-typen i React inkluderer nå `5xl`.

    Fontstørrelsen er nå fast 16px (`1rem`) og skalerer ikke lenger opp til 18px med skjermbredden. Overskriftsstørrelsene beholder samme modulære skala, men er nå faste rem-verdier. Alle spacing- og fontstørrelser er dermed endret — dobbeltsjekk flater på flere skjermstørrelser og density-moduser.

### Patch Changes

-   3139022: `neutral` er den eksplisitte nøytral-verdien i status-farge-systemet — samme main-flate
    som ellers, ingen nye fargetokens.

    -   **`--ix-color-status-*`** har `neutral` i samme selektor-gruppe som `:root`, så nøytral
        virker i ren HTML/CSS uten `data-status` (fallback fra `:root`).
    -   **Delt `Status`-type** (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`)
        eksporteres fra `@sb1/indeks-react`. `Surface` bruker den med `neutral` som default og
        setter `data-status` direkte.

    For ren HTML: et `.ix-surface` uten `data-status` inni en `[data-status]`-forelder
    arver forelderens statusfarge — sett `data-status="neutral"` for å bryte arven.

-   3139022: Renamer `Box` til `Surface`, og ferdigstiller og dokumenterer komponenten. `Surface` er en enkel visuell flate for gruppering av innhold — bevisst enklere enn `Card` (ingen elevation eller klikk-affordanse), og bygget i sin helhet på utility-klasser med et godt React-API på toppen.

    Nytt:

    -   **Statusfarge via `data-status`.** `.ix-surface` gir nå main-flaten alene, og statusfargene (`info`/`success`/`warning`/`danger`) settes med `data-status` i HTML og `status`-prop i React — samme status-system som `Message` (`--ix-color-status-*`). Erstatter den tidligere `surfaceColor`-propen / `.ix-color-surface-*`-klassene på flaten.
    -   **`radius`-prop** på `Surface` og tilhørende `ix-radius-*`-utility-klasser (`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle`) i `@sb1/indeks-utils`, basert på de eksisterende border-radius-tokenene.
    -   **`direction`-prop** (`row`/`column`, standard `column`) for å legge innhold ved siden av hverandre uten egen CSS.

    **Breaking:** `Box`-eksporten er fjernet fra `@sb1/indeks-react` — bruk `Surface` i stedet, og CSS-klassen `.ix-box` er erstattet av `.ix-surface`. `surfaceColor`-propen er byttet ut med `status` (`neutral`/`info`/`success`/`warning`/`danger`); `neutral` gir den nøytrale main-flaten.

-   Updated dependencies [bee3cd1]
    -   @sb1/indeks-tokens@0.7.0

## 0.7.0

### Minor Changes

-   a73dbc2: Nye `ix-radius-*`-utility-klasser (`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle`) i `@sb1/indeks-utils`, basert på de eksisterende border-radius-tokenene.

## 0.6.0

### Minor Changes

-   bae9da7: Legg til InteractiveIcon — en klikkbar ikon-flate (icon button) som wrapper et `ix-icon` i et native `<button>`. Gir visuell feedback ved hover, trykk og fokus, med fargetone styrt av `status` (`default` | `info` | `success` | `warning` | `danger`). Krever `aria-label`. Tilgjengelig som CSS-klasse `.ix-interactive-icon` og React-komponent `<InteractiveIcon>`.

    I tillegg eksponerer status-fargesystemet (`@sb1/indeks-utils`) nå `--ix-color-status-fill-subtle-hover` og `--ix-color-status-fill-subtle-active`, slik at subtle-fyll kan reagere på hover/trykk per status.

## 0.5.1

### Patch Changes

-   abb20ac: Legg til hover- og active-trinn for status-`surface`

    `data-status` kobler nå også `--ix-color-status-surface-hover` og
    `--ix-color-status-surface-active` (med tilhørende
    `.ix-color-status-surface-hover`- og `.ix-color-status-surface-active`-utilities)
    for hver status, slik at komponenter kan bruke hover-/active-trinnet av
    status-`surface` uten å mappe det selv. Additiv endring — eksisterende variabler
    er uendret.

## 0.5.0

### Minor Changes

-   8a3159e: Ny komponent - checkbox

## 0.4.0

### Minor Changes

-   9a41a0e: Legg til tooltip

## 0.3.0

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

### Patch Changes

-   Updated dependencies [8dabdba]
    -   @sb1/indeks-tokens@0.6.0

## 0.2.1

### Patch Changes

-   Updated dependencies [bc00000]
    -   @sb1/indeks-tokens@0.5.1

## 0.2.0

### Minor Changes

-   31fea2e: Legg til TextArea og oppdater TextField

    Gå mer bort fra BEM der det ikke trengs.
    Implementer IxField som wrapper inputkomponentene

### Patch Changes

-   Updated dependencies [31fea2e]
    -   @sb1/indeks-tokens@0.5.0

## 0.1.22

### Patch Changes

-   Updated dependencies [090d027]
    -   @sb1/indeks-tokens@0.4.18

## 0.1.21

### Patch Changes

-   Updated dependencies [52b0118]
    -   @sb1/indeks-tokens@0.4.17

## 0.1.20

### Patch Changes

-   Updated dependencies [88af357]
    -   @sb1/indeks-tokens@0.4.16

## 0.1.19

### Patch Changes

-   Updated dependencies [954ac6e]
    -   @sb1/indeks-tokens@0.4.15

## 0.1.18

### Patch Changes

-   Updated dependencies [5b6e379]
    -   @sb1/indeks-tokens@0.4.14

## 0.1.17

### Patch Changes

-   Updated dependencies [59fa1cc]
    -   @sb1/indeks-tokens@0.4.13

## 0.1.16

### Patch Changes

-   Updated dependencies [c4da976]
    -   @sb1/indeks-tokens@0.4.12

## 0.1.15

### Patch Changes

-   Updated dependencies [f869f4e]
    -   @sb1/indeks-tokens@0.4.11

## 0.1.14

### Patch Changes

-   Updated dependencies [aaab805]
    -   @sb1/indeks-tokens@0.4.10

## 0.1.13

### Patch Changes

-   Updated dependencies [f695cb3]
    -   @sb1/indeks-tokens@0.4.9

## 0.1.12

### Patch Changes

-   Updated dependencies [93b4c27]
    -   @sb1/indeks-tokens@0.4.8

## 0.1.11

### Patch Changes

-   Updated dependencies [b5e9699]
    -   @sb1/indeks-tokens@0.4.7

## 0.1.10

### Patch Changes

-   Updated dependencies [52af259]
    -   @sb1/indeks-tokens@0.4.6

## 0.1.9

### Patch Changes

-   Updated dependencies [455a8ad]
    -   @sb1/indeks-tokens@0.4.5

## 0.1.8

### Patch Changes

-   Updated dependencies [9270342]
    -   @sb1/indeks-tokens@0.4.4

## 0.1.7

### Patch Changes

-   Updated dependencies [fa9392c]
    -   @sb1/indeks-tokens@0.4.3

## 0.1.6

### Patch Changes

-   Updated dependencies [b4570a0]
    -   @sb1/indeks-tokens@0.4.2

## 0.1.5

### Patch Changes

-   Updated dependencies [9fce105]
    -   @sb1/indeks-tokens@0.4.1

## 0.1.4

### Patch Changes

-   Updated dependencies [77fdff6]
-   Updated dependencies [a24b3f8]
-   Updated dependencies [3a4b45d]
    -   @sb1/indeks-tokens@0.4.0

## 0.1.3

### Patch Changes

-   Updated dependencies [01a700c]
    -   @sb1/indeks-tokens@0.3.0

## 0.1.2

### Patch Changes

-   Updated dependencies [288ea64]
    -   @sb1/indeks-tokens@0.2.0

## 0.1.1

### Patch Changes

-   Updated dependencies [0c13f36]
    -   @sb1/indeks-tokens@0.1.1

## 0.1.0

### Minor Changes

-   4ee4990: Trigge release riktig

### Patch Changes

-   Updated dependencies [4ee4990]
    -   @sb1/indeks-tokens@0.1.0

## 0.0.3

### Patch Changes

-   fda6a83: Trigger bygg for å teste deploy
-   Updated dependencies [fda6a83]
    -   @sb1/indeks-tokens@0.0.3
