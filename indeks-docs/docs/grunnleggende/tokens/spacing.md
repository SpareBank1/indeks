# Spacing

Spacing-systemet i Indeks sikrer konsistente avstander mellom elementer på tvers av flater. Skalaen har faste verdier som tilpasser seg skjermstørrelse og behov for mer kompakt visning.

## Skjermstørrelse

Spacing-verdiene har to nivåer basert på skjermstørrelse:

- **Telefon** (under 768px): Litt tettere verdier som passer små skjermer.
- **Tablet og oppover** (768px og bredere): Litt romsligere verdier.

Størrelsen `md` er ankeret i skalaen: 16px på telefon og 20px på tablet og oppover. De øvrige størrelsene følger samme mønster. Byttet skjer automatisk ved 768px.

## Density-moduser

Spacing-systemet kan justeres basert på hvor kompakt en flate skal være. Indeks støtter to moduser:

- **Default**: Standard visning med balanserte spacing-verdier som gir god lesbarhet og tydelig struktur. Dette er anbefalt valg for de fleste flater og brukstilfeller.

- **Compact**: Kompakt visning med reduserte spacing-verdier. Er godt egnet for flater med behov for høy informasjonstetthet, som for eksempel rådgiverflater og andre interne systemer. Settes med attributtet `data-density="compact"`. Compact gjelder kun fra tablet og oppover (768px); på telefon brukes alltid standard-skalaen.

```html
<!-- Standard -->
<div class="ix-body" data-density="default">...</div>

<!-- Kompakt -->
<div class="ix-body" data-density="compact">...</div>
```

## Spacing-skala

Spacing-tokens følger en konsistent skala fra `none` til `4xl`. Skalaen dekker både små justeringer og større avstander, og brukes konsekvent på tvers av komponenter og flater.

| Token  | Beskrivelse    | Telefon | Tablet og oppover | Compact (tablet+) |
| ------ | -------------- | ------- | ----------------- | ----------------- |
| `none` | Ingen          | 0px     | 0px               | 0px               |
| `2xs`  | Ekstra liten   | 4px     | 4px               | 2px               |
| `xs`   | Liten          | 8px     | 8px               | 4px               |
| `sm`   | Small          | 12px    | 16px              | 6px               |
| `md`   | Medium         | 16px    | 20px              | 8px               |
| `lg`   | Large          | 24px    | 32px              | 12px              |
| `xl`   | Extra large    | 32px    | 40px              | 16px              |
| `2xl`  | 2x extra large | 48px    | 56px              | 24px              |
| `3xl`  | 3x extra large | 64px    | 80px              | 32px              |
| `4xl`  | 4x extra large | 96px    | 120px             | 48px              |

Verdiene er faste px-verdier. På telefon brukes alltid telefon-kolonnen uavhengig av density.

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

| FFE-token         | Indeks-tokens    | FFE verdi | Indeks telefon | Indeks tablet+ |
| ----------------- | ---------------- | --------- | -------------- | -------------- |
| `ffe-spacing-2xs` | `ix-spacing-2xs` | 4px       | 4px            | 4px            |
| `ffe-spacing-xs`  | `ix-spacing-xs`  | 8px       | 8px            | 8px            |
|                   | `ix-spacing-sm`  |           | 12px           | 16px           |
| `ffe-spacing-sm`  | `ix-spacing-md`  | 16px      | 16px           | 20px           |
| `ffe-spacing-md`  | `ix-spacing-lg`  | 24px      | 24px           | 32px           |
| `ffe-spacing-lg`  | `ix-spacing-xl`  | 32px      | 32px           | 40px           |
| `ffe-spacing-xl`  | `ix-spacing-xl`  | 40px      | 32px           | 40px           |
| `ffe-spacing-2xl` | `ix-spacing-2xl` | 48px      | 48px           | 56px           |
| `ffe-spacing-3xl` | `ix-spacing-3xl` | 64px      | 64px           | 80px           |
| `ffe-spacing-4xl` | `ix-spacing-4xl` | 80px      | 96px           | 120px          |
| `ffe-spacing-5xl` |                  | 160px     |                |                |

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

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks telefon | Indeks tablet+ |
| -------------- | ------------------ | ------------------ | -------------- | -------------- |
| `p-0`          | `ix-p-0`        | 0px                | 0px            | 0px            |
| `p-0.5`        | `ix-p-2xs`         | 4px                | 4px            | 4px            |
| `p-1`          | `ix-p-xs`          | 8px                | 8px            | 8px            |
|                | `ix-p-sm`          |                    | 12px           | 16px           |
| `p-2`          | `ix-p-md`          | 16px               | 16px           | 20px           |
| `p-3`          | `ix-p-lg`          | 24px               | 24px           | 32px           |
| `p-4`          | `ix-p-xl`          | 32px               | 32px           | 40px           |
| `p-5`          | `ix-p-xl`          | 40px               | 32px           | 40px           |
| `p-6`          | `ix-p-2xl`         | 48px               | 48px           | 56px           |
| `p-8`          | `ix-p-3xl`         | 64px               | 64px           | 80px           |
| `p-10`         | `ix-p-4xl`         | 80px               | 96px           | 120px          |
| `p-20`         |                    | 160px              |                |                |

### Margin

Verdiene er de samme for `mt`, `mb`, `ml` og `mr`. Se [responsiv spacing](/docs/utility-klasser/oversikt#responsiv-spacing) for margin på forskjellige skjermstørrelser.

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks telefon | Indeks tablet+ |
| -------------- | ------------------ | ------------------ | -------------- | -------------- |
| `m-0`          | `ix-m-0`        | 0px                | 0px            | 0px            |
| `m-0.5`        | `ix-m-2xs`         | 4px                | 4px            | 4px            |
| `m-1`          | `ix-m-xs`          | 8px                | 8px            | 8px            |
|                | `ix-m-sm`          |                    | 12px           | 16px           |
| `m-2`          | `ix-m-md`          | 16px               | 16px           | 20px           |
| `m-3`          | `ix-m-lg`          | 24px               | 24px           | 32px           |
| `m-4`          | `ix-m-xl`          | 32px               | 32px           | 40px           |
| `m-5`          | `ix-m-xl`          | 40px               | 32px           | 40px           |
| `m-6`          | `ix-m-2xl`         | 48px               | 48px           | 56px           |
| `m-8`          | `ix-m-3xl`         | 64px               | 64px           | 80px           |
| `m-10`         | `ix-m-4xl`         | 80px               | 96px           | 120px          |
| `m-20`         |                    | 160px              |                |                |

### Gap

| Tailwind-token | Indeks Util-klasse | FFE/Tailwind verdi | Indeks telefon | Indeks tablet+ |
| -------------- | ------------------ | ------------------ | -------------- | -------------- |
| `gap-0`        | `ix-gap-0`      | 0px                | 0px            | 0px            |
| `gap-0.5`      | `ix-gap-2xs`       | 4px                | 4px            | 4px            |
| `gap-1`        | `ix-gap-xs`        | 8px                | 8px            | 8px            |
|                | `ix-gap-sm`        |                    | 12px           | 16px           |
| `gap-2`        | `ix-gap-md`        | 16px               | 16px           | 20px           |
| `gap-3`        | `ix-gap-lg`        | 24px               | 24px           | 32px           |
| `gap-4`        | `ix-gap-xl`        | 32px               | 32px           | 40px           |
| `gap-5`        | `ix-gap-xl`        | 40px               | 32px           | 40px           |
| `gap-6`        | `ix-gap-2xl`       | 48px               | 48px           | 56px           |
| `gap-8`        | `ix-gap-3xl`       | 64px               | 64px           | 80px           |
| `gap-10`       | `ix-gap-4xl`       | 80px               | 96px           | 120px          |
| `gap-20`       |                    | 160px              |                |                |

Ta gjerne kontakt med oss om du har andre behov enn det Indeks tilbyr.
