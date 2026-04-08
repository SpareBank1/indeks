# Retningslinjer for Indeks designsystem

Disse retningslinjene er ikke arkitekturbeslutninger, men konvensjoner teamet har blitt enige om.

## Komponent co-location

Alle filer relatert til en komponent ligger sammen:

```
lib/components/Button/
├── Button.tsx
├── Button.stories.tsx
└── Button.test.ts
```

Komponenter grupperes i kategorier: `Typography/`, `Layout/`, `Form/`, `Components/`.
Delte utilities ligger i `lib/utils/`.

## Språkvalg i kode og dokumentasjon

**Kode** skrives på engelsk: komponentnavn (`Button`, `Card`), props (`variant`, `size`), CSS-klasser (`.ix-button`), token-navn, variabelnavn.

**Dokumentasjon** skrives på norsk: ADR-er, README, docs, kommentarer, commits, PR-beskrivelser, issues, code reviews.

Engelske fagbegrep brukes i norsk tekst (props, tokens, hooks, components). Eksempel: *"Button-komponenten har en `variant`-prop som styrer utseendet."*

## AI-bruk og ansvar

Den som genererer innhold med AI er fullt ansvarlig for resultatet. AI er et verktøy, ikke en unnskyldning.

- Alt AI-generert innhold skal gjennomgås og forstås før commit
- Samme kvalitetskrav gjelder uavhengig av opphav
- "AI skrev det" er ikke en gyldig forklaring på feil
