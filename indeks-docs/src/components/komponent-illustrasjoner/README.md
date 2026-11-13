# Komponentillustrasjoner

Illustrasjonene på kortene i komponentoversikten (`/docs/komponenter`). Hver
illustrasjon er en enkel tegning av en type komponent, ikke den ekte
komponenten. Derfor trenger den ikke endres når komponenten får ny radius,
farge eller avstand.

Denne fila er spesifikasjonen. Når du lager en ny illustrasjon, med eller uten
hjelp fra en språkmodell, starter du her: les stilen, skriv motivet under
[Motiver](#motiver), og tegn det med byggeklossene.

## Stil

- **Flatt og grovt.** Tegn motivet slik du ville gjort det på en tavle. Ingen
  skygger, gradienter, ekte ikoner, fonter eller bilder. Hvis du lurer på om en
  detalj må med, la den være ute.
- **Tre farger.** `mørk` og `lys` blå, og `hvit` for flater og for tekst på
  mørk bakgrunn.
- **Mørk er poenget.** Bruk `mørk` på det som er valgt, aktivt eller primært,
  og på overskrifter og ledetekst. Alt annet er `lys`. Det skal være lett å se
  hva komponenten gjør med ett blikk.
- **Tekst er streker.** Ekte ord må oversettes og får ulik lengde. Én linje
  tekst er én avrundet strek, alltid 8 høy.
- **Ett motiv.** Én komponent i én tilstand, sentrert. Vis ikke flere
  varianter, og vis ikke siden rundt komponenten.
- **Samme familie.** En ny illustrasjon skal se ut som om den er tegnet av
  samme person som de andre: samme mål, samme farger og samme mengde detaljer.

## Rammen

- `viewBox` er `0 0 280 160`, samme forhold som mediaflaten i Card.
- Motivet holder seg innenfor `x` 40–240 og `y` 24–136 og er sentrert rundt
  (140, 80). Et smalt motiv kan være mye mindre enn rammen, som Button.
- Bruk 4-rutenett for posisjon og størrelse.
- Avstanden mellom tekstlinjer er 20 (fra topp til topp), og mellom grupper 36.

## Byggeklosser

Alt tegnes med byggeklossene i `byggeklosser.tsx`. Ingen egne `<path>` eller
hex-farger. Mangler du et tegn, legg det til i `glyfer` og i lista under.
Mangler du en form, lag en ny byggekloss og beskriv den her.

| Byggekloss | Props                                             | Brukes til                               |
| ---------- | ------------------------------------------------- | ---------------------------------------- |
| `Flate`    | `x y w h`, `fyll`, `kant`, `r` (standard 8)       | felt, knapper, paneler, celler           |
| `Tekst`    | `x y w`, `fyll` (standard `lys`)                  | én linje tekst, alltid 8 høy             |
| `Prikk`    | `cx cy`, `r` (standard 10), `fyll`, `kant`        | radio, statusikon, punkt, avatar         |
| `Glyf`     | `navn x y`, `farge` (standard `mørk`)             | chevron, pil, kryss og andre tegn        |
| `Trekant`  | `x y w h`, `retning` (`opp`/`ned`), `fyll`        | spiss på hjelpetekst og popover          |
| `Ring`     | `cx cy r`, `bredde` (standard 8), `farge` (`lys`) | ring rundt ikon, spor for spinner        |
| `Bue`      | `cx cy r fra til`, `bredde`, `farge` (`mørk`)     | del av en ring; grader med klokka fra 12 |

Glyfer, tegnet som strek i en 16 × 16-boks: `chevron-ned`, `chevron-opp`,
`chevron-høyre`, `chevron-venstre`, `pil-høyre`, `pil-venstre`, `pil-opp`,
`kryss`, `pluss`, `hake` og `søk`.

## Mål

| Element         | Mål                                                         |
| --------------- | ----------------------------------------------------------- |
| Felt og knapp   | høyde 44, radius 8, bredde 136–160                          |
| Panel           | `fyll="hvit"` med `kant="lys"`, eller `mørk` for det aktive |
| Tekst           | bredde 20–160; overskrift `mørk`, brødtekst `lys`           |
| Prikk           | radius 10–11; valgt-markør radius 5                         |
| Avkrysningsboks | `Flate` 22 × 22, radius 4                                   |
| Skillelinje     | `Flate` med høyde 2, `fyll="lys"`, `r={0}`                  |
| Celle i layout  | `Flate` med radius 6                                        |
| Glyf            | 16 × 16, strek 2,5                                          |

## Farger

| Farge  | Token                             |
| ------ | --------------------------------- |
| `mørk` | `--ix-color-fill-main-default`    |
| `lys`  | `--ix-color-fill-main-subtle`     |
| `hvit` | `--ix-color-surface-main-default` |

Bakgrunnen bak illustrasjonen er `--ix-color-background-tinted`. Fargene er
tokens, så mørkt tema følger med. I høykontrast blir de `CanvasText`,
`GrayText` og `Canvas`.

## Motiver

Én linje per komponent i `src/data/komponenter.tsx`, i samme rekkefølge som
`illustrasjoner.tsx`. Beskrivelsen er fasit: endrer du en illustrasjon, endrer
du beskrivelsen også. Lager du en ny, skriver du beskrivelsen først.

- **Accordion**: hvitt panel med lys kant, delt i tre rader med lyse
  skillelinjer. Øverste rad er åpen: `chevron-opp`, mørk tittel og en lys
  tekststrek under. To lukkede rader med `chevron-ned` og lys tittel.
- **Button**: én mørk flate (136 × 44) midt i rammen med en hvit tekststrek
  sentrert i.
- **Card**: hvitt panel med lys kant. Øverst en lys flate som bilde, under en
  mørk tittel og to lyse tekststreker.
- **Checkbox**: én rad: mørk avkrysningsboks med hvit `hake` og en mørk
  tekststrek.
- **CheckboxGroup**: to rader som Checkbox. Den øverste er avkrysset og mørk,
  den nederste er en hvit boks med mørk kant og en lys tekststrek.
- **Chip**: to piller på rad (høyde 40, radius 20). Den første er mørk med hvit
  tekststrek, den andre hvit med mørk kant og lys tekststrek.
- **Combobox**: hvitt felt med mørk kant, med `søk` og en lys tekststrek. Under,
  et hvitt panel med lys kant med tre rader. Den første har lys flate bak og
  mørk tekststrek (markert treff).
- **DateField**: hvitt panel med lys kant og mørk overskriftsstrek. Under, et
  rutenett med 4 × 5 små lyse flater (16 × 12, radius 3), én av dem mørk.
- **Divider**: lys tekststrek, mørk skillelinje i full bredde, lys tekststrek.
- **DropdownMenu**: hvit knapp med mørk kant, mørk tekststrek og `chevron-ned`.
  Under, et hvitt panel med lys kant og tre lyse tekststreker.
- **Grid**: to rader celler med radius 6. Øverst lys, mørk og lys, nederst en
  bred lys og en mørk. Viser at celler kan ha ulik bredde.
- **Icon**: lys `Ring` (radius 44, bredde 10) med en mørk trekant, en mørk prikk
  og en mørk firkant inni.
- **InteractiveIcon**: lys prikk (radius 24) med en mørk `pluss` i midten.
- **Label**: mørk tekststrek over et hvitt felt med lys kant. Ledeteksten er
  poenget, så feltet er lyst.
- **Message**: lys flate med mørk kant. Mørk prikk med lys strek oppe til
  venstre (statusikonet), en mørk overskriftsstrek og to hvite tekststreker
  ved siden av.
- **Modal**: hele rammen er en lys flate (dempet bakgrunn). Midt på et hvitt
  panel med mørk tittel og `kryss` oppe til høyre, to lyse tekststreker, og
  nederst en mørk knapp og en hvit knapp med mørk kant.
- **Pagination**: `chevron-venstre`, fire kvadrater (32 × 32, radius 6) der det
  andre er mørkt og de andre hvite med lys kant, og `chevron-høyre`.
- **PhoneNumberField**: mørk ledetekst over to felt på rad: et smalt hvitt felt
  med lys kant, kort tekststrek og `chevron-ned`, og et bredt hvitt felt med
  mørk kant og lys tekststrek.
- **Popover**: hvitt panel med lys kant, mørk tittel og lys tekststrek, med en
  hvit `Trekant` som peker ned mot en hvit knapp med mørk kant og mørk
  tekststrek.
- **ProgressBar**: mørk ledetekst, en lys flate (høyde 12, radius 6) med en
  mørk del som dekker 60 %, og en kort lys tekststrek under.
- **RadioGroup**: to rader. Øverst en hvit prikk med mørk kant og mørk
  valgt-markør, og en mørk tekststrek. Nederst en hvit prikk med lys kant og en
  kortere lys tekststrek.
- **ReadMore**: `chevron-ned` og en mørk tekststrek med mørk understrek. Under,
  to lyse tekststreker.
- **Select**: mørk ledetekst, hvitt felt med mørk kant med lys tekststrek og
  `chevron-ned`.
- **Spinner**: lys `Ring` (radius 32) med en mørk `Bue` fra 0 til 100 grader.
- **Stack**: tre flater (168 × 28, radius 6) stablet med lik avstand, den
  midterste mørk og de andre lyse.
- **Surface**: stort hvitt panel med lys kant (radius 12), med mørk tittel og
  tre lyse tekststreker inni.
- **Tabs**: tre fanetitler på rad, den første mørk og de andre lyse. Lys
  skillelinje under, med en mørk indikator under den første. Tre lyse
  tekststreker under.
- **Tag**: to små lyse piller på rad (høyde 24, radius 12), med mørk
  tekststrek.
- **TextArea**: mørk ledetekst over et høyt hvitt felt (høyde 80) med mørk kant
  og tre lyse tekststreker.
- **TextField**: mørk ledetekst, hvitt felt med mørk kant, lys verdi og en mørk
  markør i feltet, og en lys hjelpetekst under.
- **Tooltip**: mørk flate med to hvite tekststreker og en mørk `Trekant` som
  peker ned mot en lys prikk med mørk strek (info-knappen).
- **Typografi**: mørk overskrift (`Flate` med høyde 16 og radius 8, det eneste
  unntaket fra 8-høy tekst), under tre lyse tekststreker med ulik lengde.
- **ValidationMessage**: hvitt felt med mørk kant og lys tekststrek. Under, en
  mørk prikk med hvitt utropstegn og en mørk tekststrek (feilmeldingen).

## Lage en ny

1. Skriv beskrivelsen under [Motiver](#motiver) først, i samme form som de
   andre: hvilke byggeklosser, hvilken farge, og hva som er mørkt.
2. Skisser det i rammen, gjerne på rutepapir, og regn ut koordinatene.
3. Legg til en eksport i `illustrasjoner.tsx`:

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

4. Sett `illustrasjon: SelectIllustrasjon` på komponenten i
   `src/data/komponenter.tsx`.
5. Se på kortet i lyst og mørkt tema ved siden av de andre. Det skal se ut som
   samme familie.

### Til en språkmodell

Gi modellen hele denne fila, `byggeklosser.tsx` og to av de ferdige
illustrasjonene som eksempel, og be om én illustrasjon om gangen:

> Lag `<Navn>Illustrasjon` i `illustrasjoner.tsx` etter motivet for `<Navn>` i
> README.md. Bruk bare byggeklossene, hold deg innenfor rammen, og bruk målene
> i tabellen. Gi tilbake koden og en kort beskrivelse av motivet i samme form
> som under **Motiver**.
