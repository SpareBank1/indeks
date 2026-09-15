---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Table er skrevet om fra skall til fungerende komponent, med sortering.

**Den gamle eksporten kunne ikke ta imot innhold.** `Table` deklarerte en `children`-prop men rendret den aldri; innholdet var hardkodede MDN-eksempeldata. CSS-en var ute av synk med markupen og krevde `.ix-table__cell` på hver enkelt celle, noe som er ubrukelig i håndskrevet HTML. Alt av API er derfor nytt, og ingenting er bakoverkompatibelt. Ingen konsumenter var koblet på den gamle versjonen.

**CSS styler elementene, ikke klasser per celle.** En ren `<table class="ix-table">` er fullt stylet uten en eneste klasse inne i tabellen. Varianter settes som data-attributter i stedet for BEM-modifikatorer: `data-density="sm|md|lg"`, `data-zebra`, `data-hover`, `data-sticky-header`, `data-sticky-column`. `border-collapse` er `separate`, som er påkrevd for at rammer skal følge med sticky-posisjonerte celler.

**Sortering ligger i en atferds-modul, ikke en web component.** `indeks-web/lib/table/table.ts` lytter delegert på `document` og er attributtdrevet, samme mønster som `tooltip.ts` og `modal.ts`. Valget er bevisst: sorteringstilstanden *er* `aria-sort` på `<th>`, så det finnes ingen instans-tilstand å huske mellom handlinger. En web component kunne heller ikke ligget inne i tabellen, siden HTML-parseren foster-parenter ukjente elementer ut av `<table>`.

Modulen sykler `aria-sort` toveis og sender en `ix-sort`-hendelse, men flytter rader bare når tabellen har `data-ix-sort-client`. React setter ikke attributtet som standard, fordi React eier `<tr>`-nodene sine — bruk `onSort` og sorter egne data. Statiske tabeller kan melde seg på med `clientSort`. Sorteringen annonseres i en delt live-region, med tekst fra `sortAscendingText` og `sortDescendingText` der `{column}` byttes ut med kolonnenavnet. Uten mal skjer ingen annonsering; det finnes ingen hardkodet tekst.

**React er en compound-komponent.** `Table.Caption`, `Table.ColumnGroup`, `Table.Column`, `Table.Head`, `Table.Body`, `Table.Foot`, `Table.Row`, `Table.ColumnHeader`, `Table.RowHeader` og `Table.Cell`. Egne komponenter for kolonne- og radoverskrift gjør riktig `scope` til det enkleste valget. `Table` rendrer også scroll-rammen rundt tabellen, som er fokuserbar slik at tastaturbrukere kan scrolle en bred tabell (WCAG 2.1.1), og som navngis automatisk fra `Table.Caption`.

**Kjente begrensninger.** Uthevet kolonne (`Table.Column highlighted`) kan ikke kombineres med `zebra`, `hover` eller `stickyHeader`: tabeller maler celle- og radbakgrunn over kolonnebakgrunnen. `stickyHeader` krever at høydebegrensningen står på scroll-rammen selv via `scrollStyle` eller `scrollClassName`, siden rammen er scroll-containeren i begge retninger.
