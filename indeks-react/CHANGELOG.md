# @sb1/indeks-react

## 0.16.0

### Minor Changes

-   14f0782: Legg til CheckboxGroup — en gruppe relaterte checkboxer der flere kan velges samtidig. Ny `<ix-checkbox-group>`-web component eier ARIA-limet (role=group, legend via `aria-labelledby`, description/error via `aria-describedby`, `aria-invalid` på host, id+`htmlFor`-kobling, disabled/readonly-propagering med per-knapp-bevaring og observer for dynamisk tilføyde valg). React via `<CheckboxGroup legend="…">` med `<CheckboxButton value="…" label="…">`; `value` er et array (flervalg). Bruker `role="group"` framfor `<fieldset>` for å unngå Safari-layoutbugger, på linje med RadioGroup. CSS via `ix-checkbox-group` (container/legend/description/error/items + disabled/readonly-tilstand); checkbox-itemene gjenbruker eksisterende `.ix-checkbox`-styling. Ingen hardkodet tekst — `legend`/`label` er påkrevde i18n-props.

    Checkbox-CSS støtter nå også naken `<input type="checkbox">` inni `.ix-checkbox` — `.ix-checkbox__input`-klassen på inputen er valgfri (dual-targeting, som radio-group). Rettet samtidig en feil der deaktivert checkbox-label refererte et udefinert token (`--ix-color-foreground-main-readonly`); deaktiverte labels får nå korrekt dempet farge via `--ix-color-foreground-main-read-only`.

    Checkbox-indikatoren tegnes nå med CSS-pseudo-elementer på `<label>` (boks + hake/strek via `mask-image`), togglet av nabo-kombinatoren `input:checked`/`:indeterminate` — samme modell som radio-group. Det dekorative `.ix-checkbox__box`-spanet er fjernet, og `.ix-checkbox__label`-spanet er erstattet av en ren `<label>` som søsken til inputen (`.ix-checkbox__label` beholdes som valgfri styling-hook). Strukturen er nå `<div class="ix-checkbox"><input type="checkbox"><label></label></div>`. Konsumenter som skrev egne `.ix-checkbox`-spans i håndskrevet HTML må oppdatere markupen til denne flate strukturen.

-   14f0782: Legg til Chip (button chip) — en liten, interaktiv komponent for raske handlinger og hurtigvalg, presentert kompakt i en pill-form. Button chip fungerer som en knapp og har ingen vedvarende valgt tilstand. Tilgjengelig som CSS-klasse `.ix-chip` (med `data-size="sm"` for liten størrelse) og React-komponent `<Chip>` med polymorfisk `as`-prop (f.eks. `as="a"` for lenke-chips). Etablerer den felles chip-grunnmuren som removable, radio og checkbox chip bygger videre på.
-   9e32c0c: Ny Modal-komponent — et dialogvindu som krever brukerens oppmerksomhet. Bygger på native `<dialog>` åpnet med `showModal()`, som gir fokus-trap, Escape-lukking, top-layer-rendering, fokus-retur til trigger og inert bakgrunn gratis.

    -   **CSS** (`@sb1/indeks-css`): `.ix-modal` med sub-regioner (`__header`, `__title`, `__close`, `__body`, `__footer`, `__button-group`), størrelser via `data-size` (`small`/`medium`/`large`/`full`), dempet `::backdrop`, mobile-first (nær full bredde på mobil, `max-width` fra 768px), og fade/scale-inn som progressiv forbedring som respekterer `prefers-reduced-motion`.
    -   **Web** (`@sb1/indeks-web`): atferds-modul (ikke en web component) som gir ren-HTML-brukere deklarativ åpning/lukking via `data-modal-open`/`data-modal-close`, bakgrunnslukking som standard (slå av med `data-no-close-on-backdrop`), og scroll-lås på `<body>`.
    -   **React** (`@sb1/indeks-react`): `Modal` i Radix-stil med underkomponentene `Modal.Header`, `Modal.Title`, `Modal.Description`, `Modal.Body`, `Modal.Footer`, `Modal.ButtonGroup` og `Modal.CloseButton`. Kan brukes både kontrollert (`open`/`onOpenChange`) og ukontrollert (`defaultOpen` — komponenten eier tilstanden selv), med `size` og `closeOnBackdropClick` (på som standard). `Modal.Title` kobles automatisk til dialogen via `aria-labelledby`, og valgfri `Modal.Description` via `aria-describedby`.
    -   **Åpningsfokus** (React + Web): ved åpning settes fokus på selve dialogen, ikke på lukk-knappen (som ellers ville fått `showModal()`-auto-fokuset). Sett `autofocus` på et element inni modalen for å fokusere det i stedet.

-   97d39ef: Ny ProgressBar-komponent — viser fremdrift i én sammenhengende prosess (opplasting, validering, onboarding). Rent informativ og ikke-interaktiv, med tre tilstander: `active` (pågående 0–100 %), `success` (fullført) og `error` (feilet).

    -   **CSS** (`@sb1/indeks-css`): `.ix-progress-bar` (dual-target `:where(ix-progress-bar, .ix-progress-bar)`) med sub-regioner (`__header`, `__label`, `__value`, `__track`, `__fill`, `__support`). Fyllgrad via lokal `--ii-progress-bar-fill`, linjehøyde via `--ii-progress-bar-height` (fast, reduseres ikke på noen skjerm). `active` bruker `--ix-color-fill-main-default` på fyllet; `success`/`error` kobler `--ix-color-status-fill` via `data-status`-kaskaden. Mobile-first (full bredde, fungerer fra 320 px), myk overgang på fyllet som respekterer `prefers-reduced-motion`.
    -   **Web** (`@sb1/indeks-web`): `<ix-progress-bar>` DOM-generator som eier og genererer all indre struktur — forfatteren skriver kun host-elementet med attributter (`value`, `data-state`, `label`, `data-support-text`, `data-show-value`, `data-value-text`). Klamper ugyldige verdier (< 0 → 0, > 100 → 100, ikke-numerisk → 0). I `active` settes `role="progressbar"` med `aria-valuenow`/`aria-valuemin`/`aria-valuemax` og `aria-labelledby`/`aria-describedby`; i `success`/`error` fjernes rollen og value-attributtene, `data-status` (success/danger) settes, og et dekorativt `<ix-icon data-badge>` (check/priority_high) vises alltid. Støtteteksten er en stabil `role="status"`-live-region så overgangen annonseres uten å flytte fokus.
    -   **React** (`@sb1/indeks-react`): `ProgressBar` — tynn wrapper som rendrer `<ix-progress-bar>` og mapper props (`value`, `state`, `label`, `supportText`, `showValue`, `valueText`, `className`) til attributter. All logikk (klamping, ARIA, ikon) eies av web componenten.

    Tilgjengelighet: web componenten advarer i dev når `active` mangler tilgjengelig navn (`label`/`aria-label`) og når `success`/`error` mangler støttetekst (stille overgang). På iOS byttes `active`-rollen til `role="img"` med verdien bakt inn i `aria-label`, siden VoiceOver ikke leser løpende `aria-valuenow`-endringer på en `progressbar` — gjenbrukbar `isIOS()` i `indeks-web/lib/utils/platform.ts`.

-   2aa00ff: Ny ReadMore-komponent — én frittstående vis/skjul-seksjon for utdypende, sekundær informasjon. Bygger på native `<details>`/`<summary>`, så tastatur, fokus og åpen/lukket-annonsering kommer gratis uten JavaScript eller ekstra ARIA. Til forskjell fra Accordion (en gruppe seksjoner) er ReadMore én enkelt seksjon med en venstrestilt label og chevron _foran_ teksten.

    -   **CSS** (`@sb1/indeks-css`): `.ix-read-more` på `<details>` med `__label` (`<summary>`, chevron via `::before`) og `__content`. Hover/active-flate rundt labelen, `:focus-visible`-fokusring, 44 px touch-mål, og myk åpne/lukke-animasjon som progressiv forbedring (`::details-content` + `interpolate-size`) som respekterer `prefers-reduced-motion`.
    -   **React** (`@sb1/indeks-react`): `<ReadMore label="…" defaultOpen>…</ReadMore>` — en tynn `forwardRef`-wrapper over native `<details>`. `label` tar `ReactNode` (kan inneholde et prefiks-ikon), `children` er innholdet som avsløres, `defaultOpen` speiler `<details open>`. Ingen hardkodet tekst — all tekst sendes inn av konsumenten (i18n).

-   14f0782: Legg til Removable chip — en chip som representerer et aktivt valg og kan fjernes. Hele chipen er fjern-knappen (klikk / Enter / Mellomrom fjerner), og krysset er et dekorativt CSS-ikon. CSS via `.ix-chip[data-removable]` (krysset legges til med `::after`, ingen ekstra markup); React via `<RemovableChip removeLabel="..." onRemove={...}>`. Det tilgjengelige navnet komponeres som «[label] [removeLabel]» — `removeLabel` er påkrevd og må sendes inn på brukerens språk (i18n, ingen hardkodet fallback).
-   bee3cd1: Forenklet spacing- og font-systemet betraktelig. Spacing bruker nå faste px-verdier på tre mobile-first breakpoints (mobil, tablet fra `768px`, desktop fra `1024px`) i stedet for kontinuerlig fluid `clamp()`-skalering. De minste verdiene (`2xs`–`lg`) er like på alle breakpoints; kun `xl`–`5xl` øker på tablet og desktop. Ny `5xl`-spacing-token med tilhørende utility-klasser (`.ix-{m,p,gap}-5xl` + responsive varianter og `ix-stack`/`ix-grid` `gap="5xl"`), og `GapSize`-typen i React inkluderer nå `5xl`.

    Fontstørrelsen er nå fast 16px (`1rem`) og skalerer ikke lenger opp til 18px med skjermbredden. Overskriftsstørrelsene beholder samme modulære skala, men er nå faste rem-verdier. Alle spacing- og fontstørrelser er dermed endret — dobbeltsjekk flater på flere skjermstørrelser og density-moduser.

-   c411121: Legg til Tabs — faner som lar brukeren veksle mellom likeverdige innholdsseksjoner på samme side uten navigasjon. Supplerer SegmentedControl (som brukes til gjensidig utelukkende tilstander/filtre).

    -   **@sb1/indeks-web**: fire nye custom elements (`<ix-tabs>`, `<ix-tab-list>`, `<ix-tab>`, `<ix-tab-panel>`) som ARIA-lim i light DOM. `<ix-tabs>` er koordinatoren som setter `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby` og `aria-orientation`, genererer stabile IDer, og eier manuell aktivering: roving `tabindex` (én tab-stopp), pil venstre/høyre + Home/End flytter kun fokus og hopper over deaktiverte faner, Enter/Mellomrom (og klikk) aktiverer. Fane kobles til panel via delt `data-value` (ellers `aria-controls`, ellers posisjon), så koblingen er uavhengig av DOM-rekkefølge. Panelet gjøres ikke fokuserbart — det er ikke en egen tab-stopp. Ekte brukeraktivering sender et bubbling `change`-event; init og ekstern (kontrollert) synk gjør det ikke. En MutationObserver re-wirer ved struktur-endring og reconcile-r ved ekstern `aria-selected`-endring. `disabled`-attributt på `<ix-tab>` speiles til `aria-disabled` slik at ren HTML-bruk får konsistent dempet styling og skjermleser-tilstand. `disconnectedCallback` rydder observers og lyttere.
    -   **@sb1/indeks-css**: ny `tabs.css` med dual-target (`:where(ix-tabs, .ix-tabs)` osv.). Understrek-indikator på hver fane som er synlig i alle tilstander: passiv er en tynn (1 px) grå linje (`--ix-color-border-main-default`), hover og aktiv blir tykkere (2 px) — hover mørkere grå (`--ix-color-border-main-hover`), aktiv i brand-farge (`--ix-color-fill-main-default`). Padding kompenserer for tykkelses-endringen så etiketten ikke hopper. Passiv tekst via `--ix-color-foreground-main-subtle`. Horisontal scroll ved overflow (én rad, siden får ingen horisontal scroll ned til 320 px), 44×44 px touch-mål, fokusring med offset innover, og `prefers-reduced-motion`-håndtering.
    -   **@sb1/indeks-react**: compound `Tabs` / `Tabs.List` / `Tabs.Tab` / `Tabs.Panel` — tynt lag over web componentene. Kontrollert (`value` + `onChange`) og ukontrollert (`defaultValue`); `onChange` bygges bro fra WC-ens `change`-event via `aria-selected`. Ingen hardkodet tekst — `ariaLabel` er påkrevd for kun-ikon-faner (i18n).

-   c581479: Input-formatering på TextField / `ix-field` — viser en formatert versjon av verdien (beløp, telefon, kontonummer, fødselsnummer) mens den rå verdien er tilgjengelig for lagring, validering og innsending.

    -   **Vi formaterer, vi masker ikke.** Uansett modus vises ALT brukeren skriver — også ekstra tegn og tegn som ikke «hører hjemme» (en bokstav i et sifferfelt). Feil fanges av validering, ikke ved å droppe/avvise tastetrykk. `parse` er derfor tapsfri: den fjerner kun separatorene `format` setter inn.
    -   **To moduser, styrt av et `live`-flagg på formatteren:**
        -   **Blur (standard):** feltet viser formatert verdi når det ikke har fokus, og rå (redigerbar) verdi ved fokus — ingen caret-hopp mens man skriver (a11y-drevet, jf. GOV.UK). Egne pattern-strenger og `{format,parse}`-objekter er blur med mindre de setter `live: true`.
        -   **Live (opt-in):** separatorene bygger seg opp mens man skriver, med caret-styring i selve inputen. De seks innebygde variantene (`phone`, `amount`, `account`, `orgnr`, `ssn`, `date`) formaterer live.
    -   **Arkitektur — synlig input + skjult rå-mirror.** Den synlige `<input>` viser tekst for mennesker; en skjult `<input type="hidden">` bærer den rå verdien og feltets `name`. Synlig input får `${name}_formatted`. Dermed sender `<form>`-submit / `new FormData(form)` rå verdi under opprinnelig navn, og JS henter den formaterte visningen via `${name}_formatted`. `ix-field.rawValue` gir alltid rå verdi. (Erstatter det tidligere read-only overlayet — fjerner samtidig alignment-glipp for svært lange, horisontalt scrollende verdier.)
    -   **Web component** (`ix-field`): opt-in formatering som kun aktiveres når en formatter er satt. Tre måter å angi formatter, i presedens: `.formatter`-property (på `ix-field`) → `data-format="navn"` (registry) → `data-format-pattern="000 00 000"`. `data-format`/`data-format-pattern` settes på `<input>`, ikke på `<ix-field>`. Ny statisk `IxField.registerFormatter(navn, {format, parse, live?})` for delbare, team-egne varianter. `refreshFormat(raw?)` re-formaterer fra en rå verdi (brukes av controlled React); `rawValue`-getter for enkel avlesning. `disconnectedCallback` fjerner mirror, gjenoppretter `name` og setter synlig input tilbake til rå verdi.
    -   **Ny `formats`-modul** (eksportert fra `@sb1/indeks-web`): rene `{format, parse, live?}`-funksjoner, `createPatternFormatter` (`0`=siffer, `a`=bokstav, `*`=hva som helst, resten separatorer), `createAmountFormatter`/`amountFormatterForLocale` (tusenskille via `Intl.NumberFormat`), `registerFormat`/`resolveFormat`. Innebygde varianter: `phone`, `amount`, `account`, `orgnr`, `ssn`, `date` — alle `live`.
    -   **CSS** (`ix-text-field`): skjuler den skjulte rå-mirror-inputen (`input[type="hidden"]`). Overlay-reglene (`.ix-text-field__format` / `.ix-text-field__format-display`) er fjernet.
    -   **Per-felt modus-override:** `formatLive` (React) / `data-format-live` (HTML) overstyrer formatterens `live`-flagg på det enkelte feltet — slå live av på en innebygd variant, eller på for en egen pattern, uten å skrive en formatter. Utelatt = formatterens egen default.
    -   **React** (`TextField`): nye props `format` (variant-navn eller `{format, parse}`-objekt), `formatPattern` (pattern-streng — påvirker ikke det native `pattern`-valideringsattributtet) og `formatLive` (modus-override). `onChange` og controlled `value` er alltid rå (uten separatorer). Støtter både uncontrolled (`defaultValue`) og controlled (`value`); i formatter-modus eier `ix-field` DOM-verdien, og React seeder rå via `defaultValue`, reconcilerer controlled `value` via `refreshFormat()`, og leverer rå `onChange` via en native input-lytter.
    -   **A11y:** aldri `type="number"` (gir tom `.value` med separatorer) — bruk `type="text"`/`"tel"` + `inputMode`; format oppgis som tekst i `description`, ikke placeholder; formatering er visuell, ikke validering. Erstatter utdatert Cleave.js / react-number-format for felt-formatering.

### Patch Changes

-   adffd40: Card har ny `openInNewTab`-prop som åpner href-lenken i ny fane (`target="_blank"` + `rel="noopener noreferrer"`). Dokumentasjonens "Eget chevron-ikon"-eksempel var misvisende — det viste `open_in_new`-ikon uten faktisk ny-fane-oppførsel, og er nå rettet. HTML-eksempel for statisk vs. klikkbart bruker `ix-stack` i stedet for inline flex.
-   14f0782: Legg til Checkbox chip — en gruppe chips der brukeren kan velge ett eller flere alternativer samtidig. Gjenbruker `ix-checkbox-group` (role=group, name-propagering, htmlFor-kobling og ARIA) med pill-styling via `data-variant="chip"` og firkant-indikator (tom firkant → fylt med hake + aksent på valgt). React via `<CheckboxGroup variant="chip" legend="…">` med `<CheckboxButton value="…" label="…">` (`value` er et array — flervalg). CSS via `ix-checkbox-group[data-variant="chip"]` (+ `data-size="sm"`). `CheckboxGroup` fikk `variant`/`size`-props som chip-wrapperne låser. Ingen ny ARIA-logikk eller hardkodet tekst — `legend`/`label` er påkrevde i18n-props.
-   adffd40: Message og Card brukte fortsatt semantiske ikonnavn etter overgangen til Material Design-navn, noe som ga 403 på ikonet i runtime. Message-lukkeknappen bruker nå `close` (var `lukk`), og Card-chevronen defaulter til `chevron_right` (var `pil-hoyre`). Dokumentasjon og eksempler er oppdatert tilsvarende (`open_in_new` i stedet for `apne-ekstern`).
-   adffd40: Message: lukkeknappen bruker nå `InteractiveIcon` (`.ix-interactive-icon`) i «sm» i stedet for en egen implementasjon. Krysset rendres via `ix-icon` (`lukk`), og touch-mål, hover og fokusring arves fra InteractiveIcon. Lukkeknappen har litt luft mot meldingens kant, og følger meldingens status i hover (arves via `data-status`). `.ix-message__close` beholdes kun for plassering. Ingen API-endring — `closeLabel` (React) / `aria-label` (HTML) fungerer som før.
-   3139022: `neutral` er den eksplisitte nøytral-verdien i status-farge-systemet — samme main-flate
    som ellers, ingen nye fargetokens.

    -   **`--ix-color-status-*`** har `neutral` i samme selektor-gruppe som `:root`, så nøytral
        virker i ren HTML/CSS uten `data-status` (fallback fra `:root`).
    -   **Delt `Status`-type** (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`)
        eksporteres fra `@sb1/indeks-react`. `Surface` bruker den med `neutral` som default og
        setter `data-status` direkte.

    For ren HTML: et `.ix-surface` uten `data-status` inni en `[data-status]`-forelder
    arver forelderens statusfarge — sett `data-status="neutral"` for å bryte arven.

-   14f0782: Legg til Radio chip — en gruppe chips der brukeren velger nøyaktig ett alternativ. Gjenbruker `ix-radio-group` (role=radiogroup, name-synkronisering, piltast-navigasjon og ARIA) med pill-styling via `data-variant="chip"` og sirkel-indikator (tom sirkel → fylt prikk + aksent på valgt). React via `<RadioGroup variant="chip" legend="…">` med `<RadioButton value="…" label="…">`. CSS via `ix-radio-group[data-variant="chip"]` (+ `data-size="sm"`). `RadioGroup` fikk `variant`/`size`-props. Ingen ny ARIA-logikk eller hardkodet tekst — `legend`/`label` er påkrevde i18n-props.
-   2aa00ff: ReadMore: vertikal skillelinje langs venstre kant av innholdet når seksjonen er åpen, som skiller det avdekkede innholdet visuelt fra labelen (`border-inline-start` på `.ix-read-more__content`, scopet til `[open]`). Fjernet den dokumenterte prefiks-ikon-varianten (story, docs-seksjon, a11y-omtale og test) — labelen er nå ren tekst.
-   3139022: Renamer `Box` til `Surface`, og ferdigstiller og dokumenterer komponenten. `Surface` er en enkel visuell flate for gruppering av innhold — bevisst enklere enn `Card` (ingen elevation eller klikk-affordanse), og bygget i sin helhet på utility-klasser med et godt React-API på toppen.

    Nytt:

    -   **Statusfarge via `data-status`.** `.ix-surface` gir nå main-flaten alene, og statusfargene (`info`/`success`/`warning`/`danger`) settes med `data-status` i HTML og `status`-prop i React — samme status-system som `Message` (`--ix-color-status-*`). Erstatter den tidligere `surfaceColor`-propen / `.ix-color-surface-*`-klassene på flaten.
    -   **`radius`-prop** på `Surface` og tilhørende `ix-radius-*`-utility-klasser (`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle`) i `@sb1/indeks-utils`, basert på de eksisterende border-radius-tokenene.
    -   **`direction`-prop** (`row`/`column`, standard `column`) for å legge innhold ved siden av hverandre uten egen CSS.

    **Breaking:** `Box`-eksporten er fjernet fra `@sb1/indeks-react` — bruk `Surface` i stedet, og CSS-klassen `.ix-box` er erstattet av `.ix-surface`. `surfaceColor`-propen er byttet ut med `status` (`neutral`/`info`/`success`/`warning`/`danger`); `neutral` gir den nøytrale main-flaten.

-   c411121: Tabs — justert understrek-indikator og fjernet deaktivert-tilstand (basert på design-tilbakemelding).

    -   **@sb1/indeks-css**: understreken tegnes nå med inset `box-shadow` i stedet for `border-bottom`, så den ikke tar layout-plass — etiketten står helt stille når linja endrer tykkelse. Passiv er 1 px, hover og aktiv/valgt er 3 px (tydeligere enn før). Padding-kompensasjonen og disabled-stilene (`opacity`/`cursor`/`pointer-events`) er fjernet. Fokusringen tegnes nå utover fanen (system-standard) i stedet for innover og avrundet — den doble linja mot understreken på en valgt+fokusert fane er borte; tablisten reserverer vertikal plass så ringen ikke klippes.
    -   **@sb1/indeks-web**: `<ix-tab>` støtter ikke lenger `disabled`/`aria-disabled` — speiling, hopp-over ved piltast-navigasjon og aktiverings-guard er fjernet. Piltast/Home/End navigerer over alle faner med loop rundt endene.
    -   **@sb1/indeks-react**: `Tabs.Tab` har ikke lenger `disabled`-prop.

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
