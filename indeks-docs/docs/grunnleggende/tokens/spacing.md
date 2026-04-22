# Spacing

Spacing-systemet i Indeks sikrer konsistente avstander mellom elementer på tvers av flater. Systemet er bygget på en skalerbar grunnverdi og kan justeres for ulike skjermstørrelser og behov for mer eller mindre kompakt visning.

## Grunnverdier

Spacing-systemet bruker følgende grunnverdier:

- **Mobil**: 16px (1rem)
- **Tablet**: 17px (1.063rem)
- **Desktop**: 18px (1.125)

Det betyr at størrelsen `md` fungerer som et referansepunkt i skalaen, og at øvrige størrelser beregnes relativt til denne. Typografi bruker `rem`, mens spacing er definert i `px`, men begge følger den samme underliggende skalaen for å sikre konsistente proporsjoner på tvers av systemet.

## Density-moduser

Spacing-systemet i Indeks kan justeres basert på hvor kompakt eller romslig (desinsity) en flate skal være. Dette gjør det mulig å vise mer eller mindre innhold på samme flate, uten å gå på bekostning av lesbarhet. Indeks støtter tre ulike moduser som påvirker alle spacing-verdier.

- **Default**: Standard visning med balanserte spacing-verdier som gir god lesbarhet og tydelig struktur. Dette er anbefalt valg for de fleste flater og brukstilfeller.

- **Compact**: Kompakt visning med reduserte spacing-verdier. Er godt egnet for flater med behov for høy informasjonstetthet, som for eksempel rådgiverflater og andre interne systemer. Et kompakt område kan settes ved bruk av klassen `ix-density--compact`.

- **Comfortable**: Komfortabel visning med økte spacing-verdier som gir et mer romslig uttrykk. Egner seg godt for åpne nettsider, salgskanaler og kampanjer, der innholdet skal få mer luft og oppmerksomhet. Et komfortabelt område kan settes ved bruk av klassen `ix-density--comfortable`.

```html
<!-- Standard -->
<div class="ix-body ix-density--default">...</div>

<!-- Kompakt -->
<div class="ix-body ix-density--compact">...</div>

<!-- Komfortabel -->
<div class="ix-body ix-density--comfortable">...</div>
```

## Spacing-skala

Spacing-tokens følger en konsistent, skalerbar skala fra `2xs` til `4xl`. Skalaen er bygget for å dekke både små justeringer og større avstander, og brukes konsekvent på tvers av komponenter og flater.

| Token | Beskrivelse    | Default | Compact | Comfortable |
| ----- | -------------- | ------- | ------- | ----------- |
| `2xs` | Ekstra liten   | 4px     | 2px     | 6px         |
| `xs`  | Liten          | 7px     | 4px     | 9px         |
| `sm`  | Small          | 11px    | 9px     | 14px        |
| `md`  | Medium         | 16px    | 13px    | 20px        |
| `lg`  | Large          | 23px    | 18px    | 29px        |
| `xl`  | Extra large    | 32px    | 26px    | 41px        |
| `2xl` | 2x extra large | 46px    | 36px    | 58px        |
| `3xl` | 3x extra large | 66px    | 52px    | 83px        |
| `4xl` | 4x extra large | 106px   | 83px    | 133px       |

_Verdiene over er for mobil. På tablet og desktop økes alle verdier proporsjonalt._

Bak kulissene er spacing-verdiene basert på en beregnet skala som strekker seg fra –13 til 19, med baseverdiene som utgangspunkt. De ulike density-modusene justerer verdiene ved å flytte seg opp eller ned i skalaen, noe som gjør det mulig å endre spacing konsekvent uten å definere nye verdier.

## Bruk

### Utility-klasser

Full oversikt over utility-klassene finner du [i oversikten over utility-klasser](/docs/utility-klasser/oversikt#spacing).

### CSS Custom Properties

Spacing finnes også i variabler: `--ix-spacing-{size}`. Variablene skiller ikke mellom padding, margin eller gap. 

```css
.min-komponent {
    padding: var(--ix-spacing-md);
    margin-bottom: var(--ix-spacing-lg);
    gap: (var--ix-spacing-md);
}
```
## Migreringsguider

### Migrere fra FFE

Indeks sine verdier på spacing-variabler justerer seg etter skjermstørrelse og [density-modus](#density-moduser).

| FFE-token         | Indeks-tokens    | FFE verdi | Indeks verdi mobil | Indeks verdi desktop |
| ----------------- | ---------------- | --------- | ------------------ | -------------------- |
| `ffe-spacing-2xs` | `ix-spacing-2xs` | 4px       | 4px                | 4px                  |
| `ffe-spacing-xs`  | `ix-spacing-xs`  | 8px       | 7px                | 8px                  |
|                   | `ix-spacing-sm`  |           | 11px               | 13px                 |
| `ffe-spacing-sm`  | `ix-spacing-md`  | 16px      | 16px               | 18px                 |
| `ffe-spacing-md`  | `ix-spacing-lg`  | 24px      | 23px               | 26px                 |
| `ffe-spacing-lg`  | `ix-spacing-xl`  | 32px      | 32px               | 36px                 |
| `ffe-spacing-xl`  | `ix-spacing-xl`  | 40px      | 32px               | 36px                 |
| `ffe-spacing-2xl` | `ix-spacing-2xl` | 48px      | 46px               | 52px                 |
| `ffe-spacing-3xl` |                  | 64px      |                    |                      |
| `ffe-spacing-4xl` | `ix-spacing-3xl` | 80px      | 66px               | 74px                 |
|                   | `ix-spacing-4xl` |           | 105px              | 118px                |
| `ffe-spacing-5xl` |                  | 160px     |                    |                      |

Det er mulig å migrere til disse spacing-variablene ved bruk av search-replace-all, men det er viktig å dobbeltsjekke endringen (også på flere skjermstørrelser), da oversettelsen ikke er direkte for alle variablene.

### Migrere fra tailwind

Hvis prosjektet ditt er satt opp med tailwind som bruker spacing-skalaen fra FFE slik som det her:

```
{   0: 0,
    0.5: spacing.spacing2xs,
    1: spacing.spacing,
    2: spacing.spacingSm,
    3: spacing.spacingMd,
    4: spacing.spacingLg,
    5: spacing.spacingXl,
    6: spacing.spacing2xl,
    8: spacing.spacing3xl,
    10: spacing.spacing4xl,
    20: spacing.spacing5xl
}
```

Kan du ta utgangspunkt i disse tabellene:

### Padding

Verdiene er de samme for `pt`, `pb`, `pl` og `pr`. Se [responsiv spacing](/docs/utility-klasser/oversikt#responsiv-spacing) for padding på forskjellige skjermstørrelser.

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks verdi mobil | Indeks desktop |
| -------------- | ------------------ | ------------------ | ------------------ | -------------- |
| `p-0`          | `ix-p-0`           | 0px                | 0px                | 0px            |
| `p-0.5`        | `ix-p-2xs`         | 4px                | 4px                | 4px            |
| `p-1`          | `ix-p-xs`          | 8px                | 7px                | 8px            |
|                | `ix-p-sm`          |                    | 11px               | 13px           |
| `p-2`          | `ix-p-md`          | 16px               | 16px               | 18px           |
| `p-3`          | `ix-p-lg`          | 24px               | 23px               | 26px           |
| `p-4`          | `ix-p-xl`          | 32px               | 32px               | 36px           |
| `p-5`          | `ix-p-xl`          | 40px               | 32px               | 36px           |
| `p-6`          | `ix-p-2xl`         | 48px               | 46px               | 52px           |
| `p-8`          |                    | 64px               |                    |                |
| `p-10`         | `ix-p-3xl`         | 80px               | 66px               | 74px           |
|                | `ix-p-4xl`         |                    | 105px              | 118px          |
| `p-20`         |                    | 160px              |                    |                |

### Margin

Verdiene er de samme for `mt`, `mb`, `ml` og `mr`. Se [responsiv spacing](/docs/utility-klasser/oversikt#responsiv-spacing) for margin på forskjellige skjermstørrelser.

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks verdi mobil | Indeks desktop |
| -------------- | ------------------ | ------------------ | ------------------ | -------------- |
| `m-0`          | `ix-m-0`           | 0px                | 0px                | 0px            |
| `m-0.5`        | `ix-m-2xs`         | 4px                | 4px                | 4px            |
| `m-1`          | `ix-m-xs`          | 8px                | 7px                | 8px            |
|                | `ix-m-sm`          |                    | 11px               | 13px           |
| `m-2`          | `ix-m-md`          | 16px               | 16px               | 18px           |
| `m-3`          | `ix-m-lg`          | 24px               | 23px               | 26px           |
| `m-4`          | `ix-m-xl`          | 32px               | 32px               | 36px           |
| `m-5`          | `ix-m-xl`          | 40px               | 32px               | 36px           |
| `m-6`          | `ix-m-2xl`         | 48px               | 46px               | 52px           |
| `m-8`          |                    | 64px               |                    |                |
| `m-10`         | `ix-m-3xl`         | 80px               | 66px               | 74px           |
|                | `ix-m-4xl`         |                    | 105px              | 118px          |
| `m-20`         |                    | 160px              |                    |                |

### Gap

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks verdi mobil | Indeks desktop |
| -------------- | ------------------ | ------------------ | ------------------ | -------------- |
| `gap-0`        | `ix-gap-0`         | 0px                | 0px                | 0px            |
| `gap-0.5`      | `ix-gap-2xs`       | 4px                | 4px                | 4px            |
| `gap-1`        | `ix-gap-xs`        | 8px                | 7px                | 8px            |
|                | `ix-gap-sm`        |                    | 11px               | 13px           |
| `gap-2`        | `ix-gap-md`        | 16px               | 16px               | 18px           |
| `gap-3`        | `ix-gap-lg`        | 24px               | 23px               | 26px           |
| `gap-4`        | `ix-gap-xl`        | 32px               | 32px               | 36px           |
| `gap-5`        | `ix-gap-xl`        | 40px               | 32px               | 36px           |
| `gap-6`        | `ix-gap-2xl`       | 48px               | 46px               | 52px           |
| `gap-8`        |                    | 64px               |                    |                |
| `gap-10`       | `ix-gap-3xl`       | 80px               | 66px               | 74px           |
|                | `ix-gap-4xl`       |                    | 105px              | 118px          |
| `gap-20`       |                    | 160px              |                    |                |

Ta gjerne kontakt med oss om du har andre behov enn det Indeks tilbyr.
