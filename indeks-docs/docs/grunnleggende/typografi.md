# Typografi

## Våre fonter
Skrifttypene våre er egenutviklet og bygget på det samme sirkulære formspråket som resten av merkevaren. Det er derfor de er gjenkjennelige som SpareBank 1, og en av de tydeligste forskjellene mellom våre flater og konkurrentenes.

Vi bruker to fonter: SpareBank 1 Title til de største overskriftene og SpareBank 1 til all øvrig tekst.

### SpareBank 1 Title
Brukes på de største overskriftene og er derfor ekstra distinkt. Fonten kjennetegnes av tydelige, sirkulære former som skaper kontrast mot de smalere bokstavene og gir et sterkt visuelt uttrykk. SpareBank 1 Title skal ikke brukes i lengre brødtekster, da den ikke er optimalisert for lesbarhet i mengdetekst.

### SpareBank 1
I brødtekst og lengre tekster bruker vi en mindre distinkt font som er optimalisert for lesbarhet i mengdetekst.

Begge fontene er tilgjengelige i Figma og kan brukes direkte, uten behov for lokal installasjon.

## Store bokstaver og kursiv
Unngå å bruke tekst med kun store bokstaver, da dette gir dårligere lesbarhet. Det samme gjelder kursiv, som ikke bør brukes i overskrifter eller i større tekstmengder, ettersom det kan gjøre teksten vanskeligere å lese.

## Fontstørrelse
Basestørrelsen er alltid 16px (`1rem`) og skalerer ikke med skjermstørrelsen. Overskriftsstørrelsene er faste og beregnes ut fra basestørrelsen, slik at proporsjonene er konsistente på tvers av enheter og kontekster.

## Størrelse på overskrifter og semantikk
Du står fritt til å velge størrelse på overskrifter basert på behov og kontekst. Semantikk og visuell utforming er bevisst holdt adskilt, slik at riktig HTML-struktur kan brukes uavhengig av ønsket uttrykk.

## Linjelengde
Begrens linjelengden. WCAG anbefaler det, og både for lange og for korte linjer bryter leseflyten: er linjen for lang, mister øyet starten på den neste, og er den for kort, blir teksten hakkete.

På større skjermer er 50 til 75 tegn per linje målet, mellomrom inkludert. På mobil ligger det lavere, typisk 35 til 50 tegn. Under 20 tegn blir det for mange linjeskift.

## Linjehøyde
Standard linjehøyde i Indeks er 1.2. Brødtekst som er lengre enn noen få linjer trenger større linjehøyde for bedre lesbarhet, og kan overstyres til 1.4 med henholdsvis `Text/Body long/md - regular` i Figma, `long`-propen i `Text`-komponenten, eller CSS-klassen `.ix-text--long`.

## Venstrestilt tekst er standard
Venstrestilt tekst gir best lesbarhet. Midtstilt tekst kan på lengre tekster gjør det vanskeligere å lese, men kan brukes varsomt på korte tekstmengder, for eksempel i overskrifter med enkel støttetekst.

## Farge på tekst
| Token | Brukes til |
|---|---|
| `--ix-color-foreground-main-emphasis` | Overskrifter, der hierarkiet skal være tydelig |
| `--ix-color-foreground-main-default` | Brødtekst og vanlig tekst |
| `--ix-color-foreground-main-subtle` | Støttetekst og sekundær informasjon |

## Stiler
I Indeks bruker vi fire typografiske stiler: Heading, BodyLong, BodyShort og Label. Beskrivelse av når og hvordan de ulike stilene brukes, finner du under typografikomponentene.

