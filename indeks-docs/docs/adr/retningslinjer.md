# Retningslinjer for Indeks designsystem

Disse retningslinjene er ikke arkitekturbeslutninger, men konvensjoner teamet har blitt enige om.

## Hvor en komponent bor

Indeks er en monorepo (se [ADR-DS-001](./ADR-DS-001-monorepo-og-byggverktoy)), og en
komponent er ofte spredt over flere pakker etter ansvar:

```
indeks-css/css/components/<navn>/        # styling (.ix-<navn>)
indeks-web/lib/components/<navn>/        # web component (hvis komponenten trenger logikk)
indeks-react/lib/ui/                     # tynn React-wrapper (components/, layout/, typography/, icons/)
indeks-storybook/stories/                # <Navn>.stories.tsx
indeks-docs/docs/komponenter/<navn>.mdx  # dokumentasjon
```

React-komponentene grupperes i `indeks-react/lib/ui/` etter kategori (`components/`,
`layout/`, `typography/`, `icons/`). Delte React-hooks ligger i `indeks-react/lib/hooks/`
og delte typer i `indeks-react/lib/types/`.

## Språkvalg i kode og dokumentasjon

**Kode** skrives på engelsk: komponentnavn (`Button`, `Card`), props (`variant`, `size`), CSS-klasser (`.ix-button`), token-navn, variabelnavn.

**Dokumentasjon** skrives på norsk: ADR-er, README, docs, kommentarer, commits, PR-beskrivelser, issues, code reviews.

Engelske fagbegrep brukes i norsk tekst (props, tokens, hooks, components). Eksempel: *"Button-komponenten har en `variant`-prop som styrer utseendet."*

## AI-bruk og ansvar

Den som genererer innhold med AI er fullt ansvarlig for resultatet. AI er et verktøy, ikke en unnskyldning.

- Alt AI-generert innhold skal gjennomgås og forstås før commit
- Samme kvalitetskrav gjelder uavhengig av opphav
- "AI skrev det" er ikke en gyldig forklaring på feil
