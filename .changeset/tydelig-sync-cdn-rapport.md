---
'@sb1/indeks-react': minor
'@sb1/indeks-css': patch
'@sb1/indeks-web': patch
'@sb1/indeks-tokens': patch
'@sb1/indeks-utils': patch
---

`indeks-react sync-cdn` rapporterer nå hva den faktisk fant

Tidligere endte kommandoen på «Ingen drift funnet.» både når alle CDN-URL-er var i takt og når den ikke hadde funnet en eneste URL — to helt ulike situasjoner med samme grønne svar. Nå skiller den mellom utfallene:

- **URL-er funnet, alle i takt:** `Alle 5 CDN-URL-er i 2 fil(er) bruker samme versjon som installert @sb1/indeks-react (0.22.0).`
- **Ingen URL-er funnet:** sier det eksplisitt, forklarer at det er forventet i et npm-basert prosjekt, og skriver ut et ferdig CDN-oppsett med installert versjon pluss lenke til utvikler-guiden.
- **Ingen filer skannet:** advarer om at `--root`/`--include`/`--exclude` kan være feil, i stedet for å melde at alt er i orden.
- **Ulik versjon:** viser hvilken versjon hver URL gikk fra og til.

I tillegg kommer en `Pakkestatus` for de tre versjonslåste pakkene (`@sb1/indeks-react`, `@sb1/indeks-css`, `@sb1/indeks-web`): versjon i bruk, om den hentes fra CDN eller npm, om du er på siste versjon på npm, og om CDN-en har artefaktene for versjonen ennå. Nettverksoppslagene er «best effort», påvirker aldri exit-koden, og kan skrus av med `--offline`.

Nytt flagg `--require-urls` gir exit 1 når ingen CDN-URL-er blir funnet, for prosjekter som vet at de bruker CDN. Ugyldig `--root` gir nå exit 2 i stedet for å passere stille på null filer.

URL-er på den gamle formen `…/indeks/css/<versjon>.css` blir gjenkjent og migrert til `…/indeks/css/<versjon>/index.css`. Den flate formen finnes ikke på CDN-en (den svarer 403), men var dokumentert i READMEene våre — de er nå rettet i `indeks-css`, `indeks-react`, `indeks-tokens`, `indeks-utils` og `indeks-web`. Merk at `--check` derfor kan feile i et prosjekt som tidligere passerte; i så fall lastet ikke stilarket, og `npm run sync-indeks` retter det.

`@sb1/indeks-tokens` og `@sb1/indeks-utils` har egne versjoner og blir aldri skrevet om til react-versjonen. De blir nå rapportert til slutt i stedet for å forsvinne i stillhet.
