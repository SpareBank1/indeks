# Komponentillustrasjoner

Illustrasjonene på kortene i komponentoversikten (`/docs/komponenter`). De viser
hva en komponent er, ikke nøyaktig hvordan den ser ut. Derfor trenger de ikke
endres når komponenten får ny radius, farge eller avstand.

## Regler

- **Bare byggeklossene.** Bruk `Flate`, `Tekst`, `Prikk` og `Glyf` fra
  `byggeklosser.tsx`. Ingen egne `<path>`, ikoner, fonter, skygger eller
  hex-farger. Mangler du et tegn, legg det til i `glyfer`.
- **Tre farger.** `mørk` og `lys` blå, og `hvit` for flater og tekst på mørk
  bakgrunn.
- **Mørk er poenget.** Bruk `mørk` på det som er valgt, aktivt eller primært,
  og på overskrifter og ledetekst. Alt annet er `lys`.
- **Tekst er streker.** Ekte ord må oversettes og får ulik lengde. `Tekst` er
  alltid 8 høy.
- **Grovt, ikke likt.** Tegn motivet slik du ville gjort det på en tavle. Hvis
  du lurer på om en detalj må med, la den være ute.

## Rammen

- `viewBox` er `0 0 280 160`, samme forhold som mediaflaten i Card.
- Motivet holder seg innenfor `x` 40–240 og `y` 24–136 og er sentrert rundt
  (140, 80).
- Bruk 4-rutenett for posisjon og størrelse. Avstanden mellom tekstlinjer er
  20, og mellom grupper 36.

## Mål

| Element        | Mål                                         |
| -------------- | ------------------------------------------- |
| Felt og knapp  | høyde 44, radius 8                          |
| Panel          | `fyll="hvit"` med `kant="lys"` eller `mørk` |
| Tekst          | høyde 8, bredde 32–152                      |
| Prikk          | radius 10–11, valgt-markør radius 5         |
| Skillelinje    | `Flate` med høyde 2, `fyll="lys"`, `r={0}`  |
| Celle i layout | `Flate` med radius 6                        |
| Glyf           | 16 × 16, strek 2,5                          |

## Farger

| Farge  | Token                             |
| ------ | --------------------------------- |
| `mørk` | `--ix-color-fill-main-default`    |
| `lys`  | `--ix-color-fill-main-subtle`     |
| `hvit` | `--ix-color-surface-main-default` |

Bakgrunnen bak illustrasjonen er `--ix-color-background-tinted`. Fargene er
tokens, så mørkt tema følger med. I høykontrast blir de `CanvasText`,
`GrayText` og `Canvas`.

## Glyfer

`chevron-ned`, `chevron-opp`, `chevron-høyre`, `chevron-venstre`, `pil-høyre`,
`pil-venstre`, `pil-opp`, `kryss`, `pluss` og `hake`.

## Lage en ny

1. Skisser motivet i rammen over, gjerne på rutepapir.
2. Legg til en eksport i `illustrasjoner.tsx`:

    ```tsx
    export const SelectIllustrasjon = () => (
        <Illustrasjon>
            <Tekst x={60} y={36} w={56} fyll="mørk" />
            <Flate x={60} y={56} w={160} h={44} fyll="hvit" kant="mørk" />
            <Tekst x={76} y={74} w={64} />
            <Glyf navn="chevron-ned" x={192} y={70} />
        </Illustrasjon>
    );
    ```

3. Sett `illustrasjon: SelectIllustrasjon` på komponenten i
   `src/data/komponenter.tsx`.
4. Se på kortet i lyst og mørkt tema ved siden av de andre. Det skal se ut som
   samme familie.
