# Typografi

Vi deler opp typografi i Indeks etter tre kategorier: overskrifter, brødtekst og "annet".

## Overskrifter

For overskrifter har vi en egen komponent: `Heading`.

Heading-nivå kan spesifiseres med `as`-propen:

```jsx
<Heading as="h1">Dette er en H1</Text>
```

Størrelse kan overstyres med `size`:

```jsx
<Heading as="h1" size="lg">Dette er en H1 som ser ut som en h2</Text>

<Heading as="h2" size="md">Dette er en H3 som ser ut som en h3</Text>
```

Heading-nivå og størrelse henger logisk sammen, men i praksis er det ikke alltid den semantiske betydningen av overskriften samsvarer med hvordan overskriften er plassert i det visuelle hierarkiet. Derfor er det mulig å spesifisere både heading-nivå og størrelse uavhengig av hverandre.

De forskjellige størrelsene er basert på tilsvarende heading-nivå. Dette er de tilgjengelige propene og hvordan de henger sammen:

| Størrelse (`size`)  | Heading-nivå (`as`)  |
| ------------------- | -------------------- |
| `2xl`               | `h1`                 |
| `xl`                | `h2`                 |
| `lg`                | `h3`                 |
| `md`                | `h4`                 |
| `sm`                | `h5`                 |
| `xs`                | `h6`                 |


### Spacing i overskrifter

- Alle overskrifter kommer uten noe spacing.
- Hvis du ønsker spacing kan du legge til propen `spacing` (boolean), som gir riktig spacing-verdi i forhold til størrelsen.
- Du kan også bruke [spacing-variabler](/docs/grunnleggende/tokens/utilities#spacing) eller util-klasser til å sette margin selv.

## Brødtekst

Brødtekster lages med `Text`-komponenten.

<!-- Brødtekst har et set med styles:

- `Body` - default tekst style
- `Lead` - Ingress - Innledende tekst
- `SubLead` - For en litt mindre innledende tekst
- `SmallText` -
- `MicroText` - -->

```jsx
<Text>Dette er en tekst</Text>
```

### Eget element

Tekst rendres som standard i en paragraph (`<p>`), men elementet kan overstyres ved behov med `as`-propen:

```jsx
<Text as="span">Dette er en tekst i en span</Text>
```

### Linjehøyde

Standard linjehøyde er 1.2. Brødtekst som er lengre enn noen få linjer trenger større linjehøyde for bedre lesbarhet, og kan overstyres til 1.4 med `long`-propen:

```jsx
<Text long={true}>Dette er en lang tekst</Text>
```

### Bold og emphasized tekst

For å utheve tekst kan man bruke `<strong>`og `<em>` taggene for henholdsvis fet og kursiv tekst. Disse har i tillegg semantisk betydning, i motsetning til `<b>` og `<i>` som ikke er semantiske og derfor bare skal brukes når ting visuelt skal se annerledes ut uten at det har semantisk betydning.

```jsx
<Text>Dette er en tekst hvor deler av setningen er <strong>uthevet med fet skrift</strong></Text>

<Text>Dette er en tekst hvor deler av setningen er <em>uthevet med kursiv skrift</em></Text>
```

Du kan utheve en hel setning eller paragraf dersom den ikke skal ligge i en `<p>` med `as`-propen:

```jsx
<Text as="strong">Dette er en tekst hvor hele teksten er uthevet</Text>

<Text as="em">Dette er en tekst hvor hele teksten er uthevet</Text>
```

Det finnes også utility-klasser for fet og kursiv tekst:

- `.ix-text-bold`
- `.ix-text-italic`

## Annet

- Tekst i knapper, chips, badges, etc
- Label i forms
- Linktext

### Label

Labels som hører til skjemaelementer skal bruke `Label`-komponenten.

### Tekst i knapper og annet ræl

Tekst i knapper, chips, badges, osv styles med en egen utility-klasse.

### Lenker

- Brukes til navigasjon
- Skal være tydelig klikkbare
- Når skal vi bruke lenker og når skal vi bruke knapper?
- Lenker kan lages med `Link` - enten med tekst eller ikoner eller begge deler
- Lenker i overskrifter osv kan legges til med `as`

Ting som må lages:

- Link ( finnes som linkText må endres)
- Label (finnes må styles riktig) og samme styling for chips og button text

- utils for:
    - line-height
    - font-weight
        - light - skal ikke tilbyes
        - regular
        - medium
        - bold - skal ikke tilbyes
    - font-size
