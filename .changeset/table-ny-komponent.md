---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Table: ny komponent for strukturerte data i rader og kolonner, med variantene Basic, Single select, Multi select og Expandable, og sortering per kolonne. Tabellen kan ha tittel, toolbar med søk, filtre og handlinger, footer og paginering, og har tilstander for loading, skeleton og ingen treff. `data-sticky` fester første kolonne eller handlingskolonnen ved vannrett rulling, og `data-density` gir compact eller comfortable.

Web componenten `<ix-table>` eier atferden: sorteringssyklusen med `aria-sort`, velg alle med indeterminate, telling og opplesning av utvalget, klikk på raden, ekspandering, justering per kolonne og rulleområdet. Den sender `sort-change`, `selection-change` og `expand-change`. I HTML sorterer den radene selv, med mindre `sort-change` avbrytes.

**Breaking:** React-komponenten `Table` erstatter placeholderen med samme navn. `size`-propen og det hardkodede innholdet er borte, og tabellen bygges nå med `Table.Header`, `Table.HeaderCell`, `Table.Body`, `Table.Row` og `Table.Cell`. I CSS er `.ix-table__row`, `.ix-table__cell` og `.ix-table[data-size]` fjernet, og `.ix-table` står nå på wrapperen rundt tabellen, ikke på `<table>`. Markup fra placeholderen må skrives om etter eksemplene i docs.

Radio: ny frittstående `.ix-radio` for radioer utenfor `ix-radio-group`. Radiogruppen bruker samme indikator, uten endringer i utseende eller markup.

Icon: ikoner vises nå i forced-colors (høykontrast). De var en maske over bakgrunnsfargen, og den byttes til Canvas, så ikonene ble usynlige.
