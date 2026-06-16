# @sb1/indeks-react

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
