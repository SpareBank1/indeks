# @sb1/indeks-web

## 0.12.0

## 0.11.0

## 0.10.0

### Minor Changes

-   abb20ac: Semantiske navn for `info_i` og `priority_high`

    `ICON_NAMES` får to nye semantiske navn slik at statusikonene kan brukes uten å oppgi det rå Material Design-navnet:

    -   `info` peker nå på `info_i`-glyfen (kanonisk, slått sammen med `info` per ikonbruksanalysen).
    -   `utropstegn` peker på `priority_high` (slått sammen med `exclamation`).

    Message bruker disse semantiske navnene internt (`name` i stedet for `materialdesignname`), og dokumentasjon/eksempler er oppdatert tilsvarende.

## 0.9.1

## 0.9.0

### Minor Changes

-   f0707b4: Legg til `RadioGroup` og `RadioButton` med full støtte for tilstander, orientering og a11y.

    -   `@sb1/indeks-css`: `radio-group.css` skrevet om — alle tilstander (default, hover, focus, selected, error, readOnly, disabled), vertikal/horisontal orientering, touch-mål 44×44 px, `prefers-reduced-motion`.
    -   `@sb1/indeks-web`: ny `<ix-radio-group>` web component (ARIA-lim) som setter `role="radiogroup"`, `aria-labelledby`, `aria-describedby`, `aria-live="polite"` og synkroniserer `aria-invalid`, `name`, `disabled`, `required` og `aria-required` på riktig nivå. Blokkerer tastatur-endringer i `readonly`-tilstand.
    -   `@sb1/indeks-react`: `RadioGroup` skrevet om til compound-mønster med `RadioButton`-barn. Støtter kontrollert/ukontrollert bruk, `legend`, `description`, `errorMessage`, `orientation`, `hideLegend`, `disabled`, `readOnly`, `required`. Erstatter den gamle flat-array-API-en (breaking endring i komponentens API, men ikke i typenavn).

## 0.8.0

## 0.7.0

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

### Patch Changes

-   f4f1fed: Fix peerDep
