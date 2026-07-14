# Spacing

Spacing-systemet i Indeks sikrer konsistente avstander mellom elementer på tvers av flater. Systemet bruker faste px-verdier som justeres på tre breakpoints, og kan tilpasses behov for mer eller mindre kompakt visning.

## Breakpoints

Spacing er **mobile-first** og bruker tre breakpoints:

- **Mobil**: grunnverdi (opptil 768px)
- **Tablet**: fra `768px`
- **Desktop**: fra `1024px`

De minste verdiene (`2xs`–`lg`) er like på alle breakpoints. Kun de store verdiene (`xl`–`5xl`) øker på tablet og desktop, slik at layouten får mer luft på større skjermer uten at små detaljavstander endrer seg.

Fontstørrelser er faste og skalerer **ikke** med skjermbredden — grunnstørrelsen er alltid 16px (`1rem`). Spacing er definert i `px`, mens typografi bruker `rem`.

## Density-moduser

Spacing-systemet i Indeks kan justeres basert på hvor kompakt eller romslig (desinsity) en flate skal være. Dette gjør det mulig å vise mer eller mindre innhold på samme flate, uten å gå på bekostning av lesbarhet. Indeks støtter tre ulike moduser som påvirker alle spacing-verdier.

- **Default**: Standard visning med balanserte spacing-verdier som gir god lesbarhet og tydelig struktur. Dette er anbefalt valg for de fleste flater og brukstilfeller.

- **Compact**: Kompakt visning med reduserte spacing-verdier. Er godt egnet for flater med behov for høy informasjonstetthet, som for eksempel rådgiverflater og andre interne systemer. Et kompakt område kan settes ved bruk av attributtet `data-density="compact"`.

- **Comfortable**: Komfortabel visning med økte spacing-verdier som gir et mer romslig uttrykk. Egner seg godt for åpne nettsider, salgskanaler og kampanjer, der innholdet skal få mer luft og oppmerksomhet. Et komfortabelt område kan settes ved bruk av attributtet `data-density="comfortable"`.

```html
<!-- Standard -->
<div class="ix-body" data-density="default">...</div>

<!-- Kompakt -->
<div class="ix-body" data-density="compact">...</div>

<!-- Komfortabel -->
<div class="ix-body" data-density="comfortable">...</div>
```

## Spacing-skala

Spacing-tokens følger en konsistent skala fra `2xs` til `5xl`, med faste px-verdier. `2xs`–`lg` er like på alle breakpoints; kun `xl`–`5xl` øker på tablet og desktop.

### Mobil (grunnverdi)

| Token | Beskrivelse    | Default | Compact | Comfortable |
| ----- | -------------- | ------- | ------- | ----------- |
| `2xs` | Ekstra liten   | 4px     | 2px     | 8px         |
| `xs`  | Liten          | 8px     | 4px     | 12px        |
| `sm`  | Small          | 12px    | 8px     | 16px        |
| `md`  | Medium         | 16px    | 12px    | 24px        |
| `lg`  | Large          | 24px    | 16px    | 32px        |
| `xl`  | Extra large    | 32px    | 24px    | 40px        |
| `2xl` | 2x extra large | 40px    | 32px    | 48px        |
| `3xl` | 3x extra large | 48px    | 40px    | 64px        |
| `4xl` | 4x extra large | 64px    | 48px    | 80px        |
| `5xl` | 5x extra large | 80px    | 64px    | 96px        |

### Tablet (fra 768px)

| Token | Default | Compact | Comfortable |
| ----- | ------- | ------- | ----------- |
| `xl`  | 40px    | 32px    | 48px        |
| `2xl` | 48px    | 40px    | 64px        |
| `3xl` | 64px    | 48px    | 80px        |
| `4xl` | 80px    | 64px    | 96px        |
| `5xl` | 96px    | 80px    | 128px       |

### Desktop (fra 1024px)

| Token | Default | Compact | Comfortable |
| ----- | ------- | ------- | ----------- |
| `xl`  | 48px    | 32px    | 64px        |
| `2xl` | 64px    | 40px    | 80px        |
| `3xl` | 80px    | 48px    | 96px        |
| `4xl` | 96px    | 64px    | 128px       |
| `5xl` | 128px   | 80px    | 128px       |

_`Compact` har samme verdier på tablet og desktop._

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
| `ffe-spacing-xs`  | `ix-spacing-xs`  | 8px       | 8px                | 8px                  |
|                   | `ix-spacing-sm`  |           | 12px               | 12px                 |
| `ffe-spacing-sm`  | `ix-spacing-md`  | 16px      | 16px               | 16px                 |
| `ffe-spacing-md`  | `ix-spacing-lg`  | 24px      | 24px               | 24px                 |
| `ffe-spacing-lg`  | `ix-spacing-xl`  | 32px      | 32px               | 48px                 |
| `ffe-spacing-xl`  | `ix-spacing-xl`  | 40px      | 32px               | 48px                 |
| `ffe-spacing-2xl` | `ix-spacing-2xl` | 48px      | 40px               | 64px                 |
| `ffe-spacing-3xl` | `ix-spacing-3xl` | 64px      | 48px               | 80px                 |
| `ffe-spacing-4xl` | `ix-spacing-4xl` | 80px      | 64px               | 96px                 |
| `ffe-spacing-5xl` | `ix-spacing-5xl` | 160px     | 80px               | 128px                |

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
| `p-1`          | `ix-p-xs`          | 8px                | 8px                | 8px            |
|                | `ix-p-sm`          |                    | 12px               | 12px           |
| `p-2`          | `ix-p-md`          | 16px               | 16px               | 16px           |
| `p-3`          | `ix-p-lg`          | 24px               | 24px               | 24px           |
| `p-4`          | `ix-p-xl`          | 32px               | 32px               | 48px           |
| `p-5`          | `ix-p-xl`          | 40px               | 32px               | 48px           |
| `p-6`          | `ix-p-2xl`         | 48px               | 40px               | 64px           |
| `p-8`          | `ix-p-3xl`         | 64px               | 48px               | 80px           |
| `p-10`         | `ix-p-4xl`         | 80px               | 64px               | 96px           |
| `p-20`         | `ix-p-5xl`         | 160px              | 80px               | 128px          |

### Margin

Verdiene er de samme for `mt`, `mb`, `ml` og `mr`. Se [responsiv spacing](/docs/utility-klasser/oversikt#responsiv-spacing) for margin på forskjellige skjermstørrelser.

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks verdi mobil | Indeks desktop |
| -------------- | ------------------ | ------------------ | ------------------ | -------------- |
| `m-0`          | `ix-m-0`           | 0px                | 0px                | 0px            |
| `m-0.5`        | `ix-m-2xs`         | 4px                | 4px                | 4px            |
| `m-1`          | `ix-m-xs`          | 8px                | 8px                | 8px            |
|                | `ix-m-sm`          |                    | 12px               | 12px           |
| `m-2`          | `ix-m-md`          | 16px               | 16px               | 16px           |
| `m-3`          | `ix-m-lg`          | 24px               | 24px               | 24px           |
| `m-4`          | `ix-m-xl`          | 32px               | 32px               | 48px           |
| `m-5`          | `ix-m-xl`          | 40px               | 32px               | 48px           |
| `m-6`          | `ix-m-2xl`         | 48px               | 40px               | 64px           |
| `m-8`          | `ix-m-3xl`         | 64px               | 48px               | 80px           |
| `m-10`         | `ix-m-4xl`         | 80px               | 64px               | 96px           |
| `m-20`         | `ix-m-5xl`         | 160px              | 80px               | 128px          |

### Gap

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks verdi mobil | Indeks desktop |
| -------------- | ------------------ | ------------------ | ------------------ | -------------- |
| `gap-0`        | `ix-gap-0`         | 0px                | 0px                | 0px            |
| `gap-0.5`      | `ix-gap-2xs`       | 4px                | 4px                | 4px            |
| `gap-1`        | `ix-gap-xs`        | 8px                | 8px                | 8px            |
|                | `ix-gap-sm`        |                    | 12px               | 12px           |
| `gap-2`        | `ix-gap-md`        | 16px               | 16px               | 16px           |
| `gap-3`        | `ix-gap-lg`        | 24px               | 24px               | 24px           |
| `gap-4`        | `ix-gap-xl`        | 32px               | 32px               | 48px           |
| `gap-5`        | `ix-gap-xl`        | 40px               | 32px               | 48px           |
| `gap-6`        | `ix-gap-2xl`       | 48px               | 40px               | 64px           |
| `gap-8`        | `ix-gap-3xl`       | 64px               | 48px               | 80px           |
| `gap-10`       | `ix-gap-4xl`       | 80px               | 64px               | 96px           |
| `gap-20`       | `ix-gap-5xl`       | 160px              | 80px               | 128px          |

Ta gjerne kontakt med oss om du har andre behov enn det Indeks tilbyr.
