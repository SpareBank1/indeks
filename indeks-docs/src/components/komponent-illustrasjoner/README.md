# Komponentillustrasjoner

Illustrasjonene på kortene i komponentoversikten (`/docs/komponenter`). De viser
hva en komponent er, ikke nøyaktig hvordan den ser ut. Derfor trenger de ikke
endres når komponenten får ny radius, farge eller avstand.

## Regler

- **Bare byggeklossene.** Bruk `Flate`, `Tekst` og `Prikk` fra `byggeklosser.tsx`.
  Ingen egne `<path>`, ikoner, fonter, skygger eller hex-farger.
- **Tekst er streker.** Ekte ord må oversettes og får ulik lengde. `Tekst` er
  alltid 8 høy.
- **Ett poeng per illustrasjon.** Bruk aksentfargen bare på det som er
  komponentens poeng, som valgt radio, aktiv fane eller fremdriften.
- **Grovt, ikke likt.** Skriv motivet slik du ville tegnet det på en tavle. Hvis
  du lurer på om en detalj må med, la den være ute.

## Rammen

- `viewBox` er `0 0 280 160`, samme forhold som mediaflaten i Card.
- Motivet holder seg innenfor `x` 20–260 og `y` 20–140 og er sentrert rundt
  (140, 80).
- Bruk 8-rutenett for posisjon og størrelse. Avstanden mellom rader er 24–36.

## Mål

| Element         | Mål                              |
| --------------- | -------------------------------- |
| Felt og knapp   | høyde 40, radius 8               |
| Tekst           | høyde 8, bredde 64–208           |
| Prikk           | radius 10, valgt-markør radius 5 |
| Strek (divider) | `Flate` med høyde 2, `t="kant"`  |
| Celle i layout  | `Flate` med `t="aksent-svak"`    |

## Toner

| `t`           | Brukes til                             |
| ------------- | -------------------------------------- |
| `standard`    | felt, paneler og tomme prikker (kant)  |
| `kant`        | streker og skillelinjer                |
| `tekst`       | vanlig tekst og ledetekst              |
| `tekst-svak`  | plassholder og brødtekst i paneler     |
| `aksent`      | det som er valgt, aktivt eller primært |
| `aksent-svak` | bakgrunnsflater og layoutceller        |
| `invers`      | tekst på `aksent`                      |

Fargene er Indeks-tokens i `byggeklosser.module.css`, så mørkt tema og
høykontrast følger med.

## Lage en ny

1. Skisser motivet i rammen over, gjerne på rutepapir.
2. Legg til en eksport i `illustrasjoner.tsx`:

    ```tsx
    export const TextFieldIllustrasjon = () => (
        <Illustrasjon>
            <Tekst x={52} y={44} w={72} />
            <Flate x={52} y={68} w={176} h={40} />
            <Tekst x={68} y={84} w={96} t="tekst-svak" />
        </Illustrasjon>
    );
    ```

3. Sett `illustrasjon: TextFieldIllustrasjon` på komponenten i
   `src/data/komponenter.tsx`.
4. Se på kortet i lyst og mørkt tema ved siden av de andre. Det skal se ut som
   samme familie.
