/*
 * CSS-utdragene som sammenligningene på Spesifisitet-siden bygger på.
 *
 * Vertsreglene er kopiert fra kilden, med faste verdier i stedet for variablene
 * deres:
 * - Infima 0.2.0-alpha.45, dist/css/default/default.css: `h1..h6` på linje 989,
 *   `h2` på 1006, `a` og `a:hover` på 1229–1240.
 * - Swagger UI 5.33.1, swagger-ui-dist/swagger-ui.css. Alt der er scopet under
 *   `.swagger-ui`; den eneste globale regelen er `html.dark-mode`.
 *
 * Indeks-utdragene er forenklede versjoner av button.css, text-field.css og
 * heading.css, med selektorformen hvert alternativ foreslår. Farger og mål er
 * faste verdier, så iframene ikke trenger tokens.
 */

export const INFIMA = `/* Infima: a, a:hover og h2 */
a {
    color: #3578e5;
    text-decoration: none;
    transition: color 0.2s;
}
a:hover {                 /* 0,1,1 */
    color: #1d68e1;
    text-decoration: underline;
}
h1, h2, h3, h4, h5, h6 {
    color: #1c1e21;
    margin: 40px 0 20px;
}
h2 { font-size: 32px; }`;

export const SWAGGER = `/* Swagger UI: scopet normalize */
.swagger-ui button, .swagger-ui input, .swagger-ui select {   /* 0,1,1 */
    font-family: sans-serif;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
}`;

/* Tailwind 4 legger alt i lag. Rekkefølgen deklareres først i theme.css. */
export const TAILWIND = `/* Tailwind 4: utilities ligger i et lag */
@layer theme, base, components, utilities;
@layer utilities {
    .p-0 { padding: 0; }
}`;

/* Felles for alle knappealternativene. */
const KNAPP_BASIS = `display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;`;

const HEADING = `font-size: 20px;
    margin: 0;
    color: #002776;`;

export const KNAPP_MARKUP = `<a class="ix-button" data-variant="primary" href="#">Lenke som knapp</a>
<h2 class="ix-heading">Overskrift</h2>`;

/** Dagens form: alt i :where(), 0,0,0. */
export const KNAPP_DAGENS = `:where(.ix-button) {                                /* 0,0,0 */
    ${KNAPP_BASIS}
}
:where(.ix-button[data-variant='primary']) {        /* 0,0,0 */
    background: #002776;
    color: #ffffff;
}
:where(.ix-button[data-variant='primary']:hover) {  /* 0,0,0 */
    background: #001a50;
}
:where(.ix-heading) {                               /* 0,0,0 */
    ${HEADING}
}`;

/** Ankerklasse utenfor :where(), alt annet inni. Flat 0,1,0. */
export const KNAPP_FLAT = `.ix-button {                                        /* 0,1,0 */
    ${KNAPP_BASIS}
}
.ix-button:where([data-variant='primary']) {        /* 0,1,0 */
    background: #002776;
    color: #ffffff;
}
.ix-button:where([data-variant='primary']:hover) {  /* 0,1,0 */
    background: #001a50;
}
.ix-heading {                                       /* 0,1,0 */
    ${HEADING}
}`;

/** Som flat, men tilstanden står utenfor :where(). Hover blir 0,2,0. */
export const KNAPP_TILSTAND_LOFTET = `.ix-button {                                        /* 0,1,0 */
    ${KNAPP_BASIS}
}
.ix-button:where([data-variant='primary']) {        /* 0,1,0 */
    background: #002776;
    color: #ffffff;
}
.ix-button:hover:where([data-variant='primary']) {  /* 0,2,0 */
    background: #001a50;
    color: #ffffff;
    text-decoration: none;
}
.ix-heading {                                       /* 0,1,0 */
    ${HEADING}
}`;

/** Varianten står utenfor :where(). 0,2,0 i hvile, 0,3,0 på hover. */
export const KNAPP_VARIANT_ESKALERT = `.ix-button {                                        /* 0,1,0 */
    ${KNAPP_BASIS}
}
.ix-button[data-variant='primary'] {                /* 0,2,0 */
    background: #002776;
    color: #ffffff;
}
.ix-button[data-variant='primary']:hover {          /* 0,3,0 */
    background: #001a50;
}`;

/** Flat, men hele indeks ligger i et lag. */
export const KNAPP_LAG = `@layer indeks {
${KNAPP_FLAT.replace(/^/gm, '    ')}
}`;

/** Bare skrifttypen, for Swagger-sammenligningen. Georgia så forskjellen synes. */
export const SWAGGER_DAGENS = `:where(.ix-button) {           /* 0,0,0 */
    ${KNAPP_BASIS}
    font-family: Georgia, serif;
}`;

export const SWAGGER_FLAT = `.ix-button {                   /* 0,1,0 */
    ${KNAPP_BASIS}
    font-family: Georgia, serif;
}`;

export const SWAGGER_MARKUP = `<button class="ix-button">Utenfor .swagger-ui</button>
<div class="swagger-ui">
    <button class="ix-button">Inne i .swagger-ui</button>
</div>`;

export const KONSUMENT_KNAPP = `.min-knapp {                   /* 0,1,0 */
    background: #b00020;
}`;

export const KONSUMENT_KNAPP_DOBBEL = `.min-knapp.min-knapp {         /* 0,2,0 */
    background: #b00020;
}`;

export const KONSUMENT_KNAPP_MARKUP = `<button class="ix-button min-knapp" data-variant="primary">Min knapp</button>`;

/* Tekstfelt. Grunnregelen er felles; det er tilstandsregelen som varierer. */
const FELT_BASIS = `.ix-text-field__input {        /* 0,1,0 */
    font: inherit;
    padding: 8px;
    border: 2px solid #767676;
    border-radius: 4px;
}`;

export const FELT_MARKUP = `<input class="ix-text-field__input mitt-felt" aria-label="Gyldig felt" value="Gyldig">
<input class="ix-text-field__input mitt-felt" aria-label="Ugyldig felt" aria-invalid="true" value="Ugyldig">`;

export const FELT_TILSTAND_FLAT = `${FELT_BASIS}
.ix-text-field__input:where([aria-invalid='true']) {   /* 0,1,0 */
    border-color: #c30000;
}`;

export const FELT_TILSTAND_BESKYTTET = `${FELT_BASIS}
.ix-text-field__input[aria-invalid='true'] {           /* 0,2,0 */
    border-color: #c30000;
}`;

export const KONSUMENT_FELT = `.mitt-felt {                   /* 0,1,0 */
    border-color: #002776;
}`;

/* BEM mot strukturelle selektorer. Konsumenten vil ha firkantede hjørner. */
export const BEM_MARKUP_REACT = `<div class="ix-text-field">
    <input aria-label="Felt" value="Slik rendrer React i dag">
</div>`;

export const BEM_MARKUP_KLASSE = `<div class="ix-text-field">
    <input class="ix-text-field__input" aria-label="Felt" value="Med BEM-klasse på input">
</div>`;

export const BEM_DAGENS = `:where(.ix-text-field) > input,          /* 0,0,1 */
:where(.ix-text-field__input) {          /* 0,0,0 */
    font: inherit;
    padding: 8px;
    border: 2px solid #767676;
    border-radius: 12px;
}`;

export const BEM_STRUKTURELL = `.ix-text-field > input,                  /* 0,1,1 */
.ix-text-field__input {                  /* 0,1,0 */
    font: inherit;
    padding: 8px;
    border: 2px solid #767676;
    border-radius: 12px;
}`;

export const BEM_PAKKET = `.ix-text-field > :where(input),          /* 0,1,0 */
.ix-text-field__input {                  /* 0,1,0 */
    font: inherit;
    padding: 8px;
    border: 2px solid #767676;
    border-radius: 12px;
}`;

export const KONSUMENT_BEM_STRUKTUR = `.ix-text-field > input {      /* 0,1,1 */
    border-radius: 0;
}`;

export const KONSUMENT_BEM_KLASSE = `.ix-text-field__input {       /* 0,1,0 */
    border-radius: 0;
}`;

/* Kontekst: en komponent inne i en annen. */
export const KONTEKST_MARKUP = `<div class="ix-card">
    <h2 class="ix-heading min-overskrift">Overskrift i kort</h2>
</div>`;

export const KONTEKST_ESKALERT = `.ix-heading {                  /* 0,1,0 */
    ${HEADING}
}
.ix-card .ix-heading {         /* 0,2,0 */
    color: #002776;
}`;

export const KONTEKST_PAKKET = `.ix-heading {                  /* 0,1,0 */
    ${HEADING}
}
.ix-card :where(.ix-heading) { /* 0,1,0 */
    color: #002776;
}`;

export const KONSUMENT_OVERSKRIFT = `.min-overskrift {              /* 0,1,0 */
    color: #b00020;
}`;

/* Reset. Lastes etter komponentene her, for å vise at rekkefølgen avgjør. */
export const RESET_MARKUP = `<h2 class="ix-heading">Overskrift</h2>`;

export const RESET_DAGENS = `:where(.ix-heading) {          /* 0,0,0, komponent */
    ${HEADING}
}
/* reset.css, lastet etter */
:where(h2) {                   /* 0,0,0 */
    margin: 0;
    font-size: inherit;
}`;

export const RESET_FLAT = `.ix-heading {                  /* 0,1,0, komponent */
    ${HEADING}
}
/* reset.css, lastet etter */
:where(h2) {                   /* 0,0,0 */
    margin: 0;
    font-size: inherit;
}`;

export const RESET_LAG = `:where(.ix-heading) {          /* 0,0,0, komponent uten lag */
    ${HEADING}
}
/* reset.css, lastet etter, men i et lag */
@layer ix-reset {
    h2 {                       /* 0,0,1 i laget */
        margin: 0;
        font-size: inherit;
    }
}`;

/* Konsumenten bruker Tailwind og legger indeks i et lag selv. */
export const LAG_MARKUP = `<a class="ix-button p-0" data-variant="primary" href="#">Knapp med p-0</a>`;

export const LAG_OPPSETT = `/* I konsumentens CSS, før alt annet */
@layer theme, base, indeks, components, utilities;`;

export const LAG_IMPORT_KOMMENTAR = `/* Tilsvarer @import '@sb1/indeks-css' layer(indeks); */
`;
