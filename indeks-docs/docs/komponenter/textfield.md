# Textfield

`TextField` er satt sammen av flere mindre byggesteiner: `Field` er den ytre beholderen som holder delene sammen og styrer layout. Inni ligger en `label` som beskriver feltet, et valgfritt `description`-element for hjelpetekst, selve `input`-elementet for tekstinput, og en `errorMessage` for feilmeldinger. Når du bruker custom elementet `<ix-field>`, blir disse delene automatisk koblet sammen (via `for`-attributt og `aria-describedby`) slik at skjermlesere kan formidle riktig kontekst til brukeren.

Komponenten kan brukes på tre måter: som ren HTML og CSS med Indeks sine CSS-klasser, som et Custom Element (web component), eller som en React-komponent. I HTML/CSS- og React-variantene må du selv sørge for å koble label og input (`for`/`id`) og knytte hjelpetekst og feilmelding til feltet med `aria-describedby`.

## Egnet til

* Kortere tekstinput (én linje)
* Input med klart forventet format

## Uegnet til

* Lengre fritekst (bruk `TextArea` i stedet)
* Komplekse eller sammensatte input (f.eks. dato med flere felt)
* Valg fra forhåndsdefinerte alternativer (bruk `select`, `radio` eller `checkbox`)

## Retningslinjer

### Tydelige labels gir forutsigbarhet

Alle `TextField` skal ha en synlig og beskrivende `label`. Labelen skal forklare hva brukeren skal skrive inn, ikke hva de skal gjøre. For eksempel bør man skrive “E-postadresse” i stedet for “Skriv inn e-post”. 

Når labelen beskriver selve dataen, blir skjemaet lettere å skanne og forstå. Brukeren kan raskt orientere seg uten å måtte lese hele setninger eller tolke handlinger. Dette er spesielt viktig i skjemaer med mange felter, der god struktur og tydelig språk reduserer kognitiv belastning og risiko for feil.

### Unngå bruk av placeholder

Placeholder anbefales ikke brukt som bærer av viktig informasjon. Når brukeren begynner å skrive, forsvinner teksten, og eventuell veiledning går tapt. Dette kan føre til usikkerhet og feil. Dersom det er behov for å forklare format eller krav, bør dette gjøres gjennom hjelpetekst som alltid er synlig.

### Hjelpetekst gir støtte der det trengs

Hjelpetekst brukes for å gi brukeren ekstra kontekst, som krav til format eller innhold. Den skal være kort, konkret og plassert nær feltet. God hjelpetekst kan redusere feil og behov for feilmeldinger i etterkant.

### Feilmeldinger skal hjelpe, ikke bare varsle

Når noe går galt, skal feilmeldingen forklare hva som er feil og hvordan det kan rettes. Generelle meldinger som “Feil input” gir liten verdi. Klare og konkrete tilbakemeldinger gjør det enklere for brukeren å komme videre uten frustrasjon.

### Validering bør ikke forstyrre

Validering bør skje på en måte som ikke avbryter brukeren unødvendig. For tidlig validering kan oppleves som støy, spesielt mens brukeren fortsatt skriver. Derfor bør validering skje når brukeren forlater feltet (blur), eller helst ved innsending av skjema.

### Bredden på feltet påvirker forståelsen

Tekstfeltets bredde bør tilpasses det brukeren forventes å skrive inn. Smale felt signaliserer korte verdier, som postnummer, mens bredere felt signaliserer lengre input som navn eller e-postadresse. Når flere felt vises sammen, bidrar variasjon i bredde til å gjøre skjemaet lettere å skanne og forstå. Lik bredde på alle felt kan gjøre det vanskeligere å orientere seg.

### Prefix og suffix må ikke stå alene

Prefix og suffix kan brukes for å gi ekstra kontekst, som valuta eller enhet. Likevel blir ikke denne informasjonen nødvendigvis lest opp av skjermlesere. Derfor må samme informasjon også inkluderes i labelen. For eksempel bør et felt med “kr” som prefix ha en label som “Beløp i kroner”. Dette sikrer at alle brukere får samme forståelse av hva som forventes.

## Tilgjengelighet / universell utforming

### Semantisk struktur og kobling mellom label og felt

Hvert TextField må ha en korrekt programmessig kobling mellom label og input (`<label for="">` og unik id). Dette gjør at skjermlesere kan formidle hva feltet gjelder når brukeren navigerer i skjemaet. Uten denne koblingen mister feltet kontekst, og det blir vanskelig å forstå hva som skal fylles inn.

### Beskrivelser og feilmeldinger må være tilgjengelige

Hjelpetekst og feilmeldinger skal være programmessig koblet til feltet ved hjelp av aria-describedby. Dette sikrer at tilleggsinformasjon blir lest opp i riktig kontekst.

### Ikke stol på farge alene

Tilstander som feil, fokus eller validering må ikke kun kommuniseres med farge. Det må alltid finnes en tekstlig eller visuell indikator i tillegg, for eksempel ikon, tekst eller endring i form.

Dette er avgjørende for brukere med nedsatt syn eller fargeblindhet, og bidrar til at alle får samme informasjon.

### Tydelig fokus og tastaturnavigasjon

TextField må være fullt opererbart med tastatur. Brukeren skal kunne navigere til feltet med Tab, og det skal være tydelig når feltet har fokus.

Fokusindikatoren må ha god kontrast og være lett å oppdage. Dette er viktig for brukere som ikke benytter mus, og for å sikre god flyt i utfylling av skjema.

### Riktig input-type gir bedre støtte

Ved å bruke riktig HTML-attributt (`type="email"`, `type="tel"`, `type="search"` osv.) får brukeren bedre støtte fra både nettleser og hjelpemidler.

Dette gir blant annet riktig tastatur på mobil, og kan bidra til automatisk validering og utfylling. Det reduserer friksjon og gjør det enklere å fylle ut skjema korrekt.

### Number-input

`type="number"` kan gi uforutsigbar oppførsel på tvers av nettlesere, og introduserer ofte begrensninger som ikke nødvendigvis samsvarer med behovet i løsningen.

For enklere tilfeller, der det kun er behov for heltall, kan `inputmode="numeric"` (i ren HTML) eller `inputMode="numeric"` (i React) være et bedre alternativ. Dette gir brukeren et tilpasset talltastatur på mobil, samtidig som man beholder større kontroll over input og validering.

### Synlig og varig informasjon

Viktig informasjon skal ikke være avhengig av midlertidige elementer som placeholder.

All nødvendig informasjon må derfor være tilgjengelig gjennom label eller hjelpetekst, slik at brukeren alltid har tilgang til konteksten – uavhengig av hvor langt de har kommet i utfyllingen.

### Prefix og suffix må være forståelige for alle

Informasjon som vises som prefix eller suffix (f.eks. “kr” eller “%”) blir ikke alltid lest opp av skjermlesere. Derfor må samme informasjon også inkluderes i labelen.

For eksempel bør et felt ikke bare ha “kr” visuelt, men også en label som f.eks. “Beløp i kroner”. Dette sikrer at alle brukere får lik forståelse av hva som forventes.

### Skjule label visuelt

TextField skal alltid ha en label. I enkelte tilfeller kan labelen skjules visuelt ved å bruke en skjermleser-klasse (for eksempel `.ix-sr-only`) på selve label-elementet, for eksempel i tabeller der feltet får konteksten sin fra kolonneoverskriften.

Selv om labelen ikke er synlig, må den fortsatt være meningsfull og beskrivende. Skjermlesere leser fortsatt labelen, og den er avgjørende for at brukere skal forstå hva feltet gjelder. En skjult label må derfor aldri være tom eller generisk, men gi samme informasjon som en synlig label ville gjort.

### Input og formatering

Hvordan input håndteres og valideres har stor betydning for både tilgjengelighet og brukeropplevelse. Små valg her kan enten redusere friksjon – eller skape unødvendige hindringer.

Bruk `autocomplete` på felter som ber om personlig informasjon om brukeren som fyller ut skjemaet, som navn, e-post eller telefonnummer. Dette gjør det mulig for nettleseren å foreslå og fylle inn verdier automatisk, noe som forenkler utfyllingen betydelig. Samtidig skal `autocomplete` skrus av på felter som gjelder andre personer, som barn eller ektefelle. Dette er viktig både for personvern og for å oppfylle krav i WCAG 1.3.5.

Validering bør være så fleksibel som mulig. Brukeren bør få skrive inn informasjon på en måte som er naturlig for dem, så lenge verdien er forståelig. For eksempel bør telefonnumre med mellomrom, kontonumre med punktum eller e-postadresser med ekstra mellomrom på slutten fortsatt kunne håndteres. For streng validering skaper unødvendig frustrasjon og kan hindre brukeren i å fullføre oppgaven.

Dersom input formateres automatisk, må dette gjøres på en måte som ikke forstyrrer brukeren mens de skriver. Endringer i teksten bør ikke flytte markøren uventet eller gjøre det vanskelig å fortsette utfyllingen. Samtidig bør formateringen være synlig, slik at brukeren kan kontrollere at verdien er korrekt. Dette skaper trygghet og gir bedre kontroll over det som sendes inn.