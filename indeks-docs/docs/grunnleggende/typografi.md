# Typografi

## Våre fonter
Vår egenutviklede skrifttype er en viktig del av identiteten vår. Den gjør at vi skiller oss tydelig fra konkurrentene, bygger personlighet og gir oss en gjenkjennelig stemme på tvers av flater. Skrifttypene er basert på vårt sirkulære formspråk og bidrar til å knytte identiteten tettere sammen.

Vi bruker to fonter: SpareBank 1 Title til de største overskriftene og SpareBank 1 til all øvrig tekst.

### SpareBank 1 Title
Brukes på de største overskriftene og er derfor ekstra distinkt. Fonten kjennetegnes av tydelige, sirkulære former som skaper kontrast mot de smalere bokstavene og gir et sterkt visuelt uttrykk. SpareBank 1 Title skal ikke brukes i lengre brødtekster, da den ikke er optimalisert for lesbarhet i mengdetekst.

### SpareBank 1
I brødtekst og lengre tekster bruker vi en mindre distinkt font som er optimalisert for lesbarhet i mengdetekst.

Begge fontene er tilgjengelige i Figma og kan brukes direkte, uten behov for lokal installasjon.

## Store bokstaver og kursiv
Unngå å bruke tekst med kun store bokstaver, da dette gir dårligere lesbarhet. Det samme gjelder kursiv, som ikke bør brukes i overskrifter eller i større tekstmengder, ettersom det kan gjøre teksten vanskeligere å lese.

## Responsiv
Typografien er responsiv og tilpasser seg ulike skjermstørrelser. Basestørrelsen er 18 px på desktop og 16 px på mobil, og skalerer automatisk mellom breakpoints for å sikre god lesbarhet på tvers av enheter og kontekster.

## Størrelse på overskrifter og semantikk
Du står fritt til å velge størrelse på overskrifter basert på behov og kontekst. Semantikk og visuell utforming er bevisst holdt adskilt, slik at riktig HTML-struktur kan brukes uavhengig av ønsket uttrykk.

## Linjelengde
WCAG anbefaler å begrense linjelengden for å sikre god lesbarhet og tilgjengelighet. Både for lange og for korte linjer kan ha negativ effekt på leseflyten.

Optimal linjelengde for brødtekst på større skjermer er mellom 50 og 75 tegn per linje, inkludert mellomrom. Dette gir en god balanse mellom flyt og lesbarhet, og gjør det enklere for øyet å finne starten på neste linje. Linjer som er for korte kan gjøre teksten hakkete, mens for lange linjer kan gjøre det mer krevende å følge teksten over tid.

På mobil anbefales kortere linjelengder, typisk 35–50 tegn per linje, for å sikre god lesbarhet på små skjermer. Unngå linjer med færre enn 20 tegn, da dette fører til mange linjeskift og gjør teksten mer krevende å lese.

## Linjehøyde
Standard linjehøyde i Indeks er 1.2. Brødtekst som er lengre enn noen få linjer trenger større linjehøyde for bedre lesbarhet, og kan overstyres til 1.4 med henholdsvis `Text/Body long/md - regular` i Figma, `long`-propen i `Text`-komponenten, eller CSS-klassen `.ix-text--long`. 

## Venstrestilt tekst er standard
Venstrestilt tekst gir best lesbarhet. Midtstilt tekst kan på lengre tekster gjør det vanskeligere å lese, men kan brukes varsomt på korte tekstmengder, for eksempel i overskrifter med enkel støttetekst.

## Farge på tekst
Bruk ix-color-foreground-main-emphasis på overskrifter for tydelig hierarki. Til brødtekst og vanlig tekst brukes ix-color-foreground-main-default, mens For mindre fremtredende tekst, som støttetekst eller sekundær informasjon, kan ix-color-foreground-main-subtle benyttes.

## Stiler
I Indeks bruker vi fire typografiske stiler: Heading, BodyLong, BodyShort og Label. Beskrivelse av når og hvordan de ulike stilene brukes, finner du under typografikomponentene.

