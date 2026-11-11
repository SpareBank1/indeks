# Komponentillustrasjoner

Illustrasjonene på kortene i komponentoversikten (`/docs/komponenter`). Hver
illustrasjon er en enkel tegning av en type komponent, ikke den ekte
komponenten. Derfor trenger den ikke endres når komponenten får ny radius,
farge eller avstand.

Denne fila er spesifikasjonen. Når du lager en ny illustrasjon, med eller uten
hjelp fra en språkmodell, starter du her: les stilen, finn motivet i
[Motiver](#motiver), og skriv koden med byggeklossene.

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

Alt tegnes med disse fire fra `byggeklosser.tsx`. Ingen egne `<path>` eller
hex-farger. Mangler du et tegn, legg det til i `glyfer` og i lista under.

| Byggekloss | Props                                       | Brukes til                        |
| ---------- | ------------------------------------------- | --------------------------------- |
| `Flate`    | `x y w h`, `fyll`, `kant`, `r` (standard 8) | felt, knapper, paneler, celler    |
| `Tekst`    | `x y w`, `fyll` (standard `lys`)            | én linje tekst, alltid 8 høy      |
| `Prikk`    | `cx cy`, `r` (standard 10), `fyll`, `kant`  | radio, statusikon, punkt, avatar  |
| `Glyf`     | `navn x y`, `farge` (standard `mørk`)       | chevron, pil, kryss og andre tegn |

Glyfer, tegnet som strek i en 16 × 16-boks: `chevron-ned`, `chevron-opp`,
`chevron-høyre`, `chevron-venstre`, `pil-høyre`, `pil-venstre`, `pil-opp`,
`kryss`, `pluss` og `hake`.

## Mål

| Element         | Mål                                                         |
| --------------- | ----------------------------------------------------------- |
| Felt og knapp   | høyde 44, radius 8, bredde 136–160                          |
| Panel           | `fyll="hvit"` med `kant="lys"`, eller `mørk` for det aktive |
| Tekst           | bredde 32–152; overskrift `mørk`, brødtekst `lys`           |
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

Én linje per komponent i `src/data/komponenter.tsx`. **Ferdig** betyr at
illustrasjonen finnes i `illustrasjoner.tsx`, og beskrivelsen er da fasit.
**Forslag** er ikke tegnet ennå. Merket **ny byggekloss** trenger en form vi
ikke har.

### Ferdig

- **Button**: én mørk flate (136 × 44) midt i rammen med en hvit tekststrek
  sentrert i.
- **Grid**: to rader celler med radius 6. Øverst lys, mørk og lys; nederst en
  bred lys og en mørk. Viser at celler kan ha ulik bredde.
- **Message**: lys flate med mørk kant. Mørk prikk med lys strek oppe til
  venstre (statusikonet), en mørk overskriftsstrek og to hvite tekststreker
  ved siden av.
- **RadioGroup**: to rader. Øverst en hvit prikk med mørk kant og mørk
  valgt-markør, og en mørk tekststrek. Nederst en hvit prikk med lys kant og en
  kortere lys tekststrek.
- **Tabs**: tre fanetitler på rad, den første mørk og de andre lyse. Lys
  skillelinje under, med en mørk indikator under den første. Tre lyse
  tekststreker under.
- **TextField**: mørk ledetekst, hvitt felt med mørk kant, lys verdi og en mørk
  markør i feltet, og en lys hjelpetekst under.

### Forslag

- **Accordion**: hvitt panel med lys kant, delt i tre rader med lyse
  skillelinjer. Øverste rad åpen: `chevron-opp`, mørk tittel og en lys
  tekststrek under. To lukkede rader med `chevron-ned` og lys tittel.
- **Card**: hvitt panel med lys kant. Øverst en lys flate som bilde, under en
  mørk tittel og to lyse tekststreker.
- **Checkbox**: én rad: mørk avkrysningsboks med hvit `hake` og en mørk
  tekststrek.
- **CheckboxGroup**: to rader som Checkbox, den øverste avkrysset og mørk, den
  nederste en hvit boks med mørk kant og lys tekststrek.
- **Chip**: to piller på rad (radius 22). Den første mørk med hvit tekststrek,
  den andre hvit med mørk kant og lys tekststrek.
- **Combobox**: hvitt felt med mørk kant med lys tekststrek og `chevron-ned`.
  Under, et hvitt panel med lys kant med tre rader; den første har lys flate
  bak og mørk tekststrek (markert treff).
- **DateField**: hvitt panel med lys kant og mørk overskriftsstrek. Under, et
  rutenett med 4 × 5 små lyse flater (radius 3), én av dem mørk.
- **Divider**: lys tekststrek, mørk skillelinje i full bredde, lys tekststrek.
- **DropdownMenu**: hvit knapp med mørk kant, mørk tekststrek og `chevron-ned`.
  Under, et hvitt panel med lys kant og tre lyse tekststreker.
- **Icon**: stor lys ring (lys `Prikk` radius 40 med en bakgrunnsfarget
  `Prikk` radius 30 oppå) med en mørk trekant, en mørk prikk og en mørk firkant
  inni. **Ny byggekloss**: trekant, og en `fyll` som er bakgrunnsfargen.
- **InteractiveIcon**: lys prikk (radius 22) med en mørk glyf i midten, for
  eksempel `pluss`.
- **Label**: mørk tekststrek over et hvitt felt med lys kant. Det er
  ledeteksten som er poenget, så feltet er lyst.
- **Modal**: hele bakgrunnen dempet med en lys flate. Midt på et hvitt panel med
  mørk tittel og `kryss` oppe til høyre, to lyse tekststreker, og nederst en
  mørk og en hvit knapp med mørk kant.
- **Pagination**: `chevron-venstre`, fire små kvadrater (32 × 32) der det andre
  er mørkt og de andre hvite med lys kant, og `chevron-høyre`.
- **PhoneNumberField**: mørk ledetekst over to felt på rad: et smalt hvitt felt
  med lys tekststrek og `chevron-ned`, og et bredt hvitt felt med mørk kant og
  lys tekststrek.
- **Popover**: hvit knapp med mørk kant. Over den et hvitt panel med lys kant
  og to lyse tekststreker. **Ny byggekloss**: pil fra panel til knapp.
- **ProgressBar**: mørk ledetekst, en lys flate (høyde 12, radius 6) med en
  mørk del som dekker 60 %, og en kort lys tekststrek under.
- **ReadMore**: `chevron-ned` og en mørk tekststrek med lys understrek-linje.
  Under, to lyse tekststreker.
- **Select**: mørk ledetekst, hvitt felt med mørk kant med lys tekststrek og
  `chevron-ned`.
- **Spinner**: lys ring (radius 28, ringbredde 8) med en mørk bue over en
  firedel av ringen. **Ny byggekloss**: bue.
- **Stack**: tre lyse flater (radius 6) i full bredde stablet med lik avstand,
  den midterste mørk.
- **Surface**: stort hvitt panel med lys kant, med mørk tittel og to lyse
  tekststreker inni.
- **Tag**: to små piller på rad (høyde 24, radius 12), lyse, med mørk
  tekststrek.
- **TextArea**: mørk ledetekst over et høyt hvitt felt (høyde 72) med mørk kant
  og tre lyse tekststreker.
- **Tooltip**: mørk flate med to hvite tekststreker. Under, en lys prikk med en
  mørk strek i (info-knappen). **Ny byggekloss**: pil fra flate til prikk.
- **Typografi**: mørk overskrift (`Flate` med høyde 16 og radius 8, det eneste
  unntaket fra 8-høy tekst), under tre lyse tekststreker med ulik lengde.
- **ValidationMessage**: hvitt felt med mørk kant og lys tekststrek. Under, en
  mørk prikk med hvit strek og en mørk tekststrek (feilmeldingen).

## Lage en ny

1. Finn motivet over. Mangler det, skriv beskrivelsen først, i samme form som
   de andre: hvilke byggeklosser, hvilken farge, og hva som er mørkt.
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
   `src/data/komponenter.tsx`, og flytt motivet fra **Forslag** til **Ferdig**.
5. Se på kortet i lyst og mørkt tema ved siden av de andre. Det skal se ut som
   samme familie.

### Til en språkmodell

Gi modellen hele denne fila, `byggeklosser.tsx` og to av de ferdige
illustrasjonene som eksempel, og be om én illustrasjon om gangen:

> Lag `<Navn>Illustrasjon` i `illustrasjoner.tsx` etter motivet for `<Navn>` i
> README.md. Bruk bare byggeklossene, hold deg innenfor rammen, og bruk målene
> i tabellen. Gi tilbake koden og en kort beskrivelse av motivet i samme form
> som under **Ferdig**.
