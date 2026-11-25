---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Table: ny komponent for strukturerte data i rader og kolonner, med variantene Basic, Single select, Multi select og Expandable, og sortering per kolonne. Tabellen kan ha tittel, toolbar med søk, filtre og handlinger, footer og paginering, og har tilstander for loading, skeleton og ingen treff. `data-sticky` fester første kolonne eller handlingskolonnen ved vannrett rulling, og `data-density` gir compact eller comfortable.

Web componenten `<ix-table>` eier atferden: sorteringssyklusen med `aria-sort`, utvalget med velg alle og indeterminate, telling og opplesning av utvalget, klikk på raden, ekspandering, justering per kolonne og rulleområdet. Utvalget gjelder på tvers av filtre og sider og kan settes med `setSelection()` og `clearSelection()`. I HTML sorterer den radene selv og sender `sort-change`. Med `data-sort-controlled` sender den `sort-request`, og den som eier radene sorterer. Endringen leses opp med tekster konsumenten sender inn (`sortLabels` i React, `sort-*-label` i HTML). Den sender også `selection-change` og `expand-change`.

**Breaking:** React-komponenten `Table` erstatter placeholderen med samme navn. `size`-propen og det hardkodede innholdet er borte, og tabellen bygges nå med `Table.Header`, `Table.HeaderCell`, `Table.Body`, `Table.Row` og `Table.Cell`. I CSS er `.ix-table__row`, `.ix-table__cell` og `.ix-table[data-size]` fjernet, og `.ix-table` står nå på wrapperen rundt tabellen, ikke på `<table>`. Markup fra placeholderen må skrives om etter eksemplene i docs.

Radio: ny frittstående `.ix-radio` for radioer utenfor `ix-radio-group`. Radiogruppen bruker samme indikator, uten endringer i utseende eller markup.

Icon: ikoner vises nå i forced-colors (høykontrast) og får systemfargen til teksten rundt seg, også i lenker og deaktiverte knapper. De var en maske over bakgrunnsfargen, og den byttes til Canvas, så ikonene ble usynlige.
