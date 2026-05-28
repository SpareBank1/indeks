Button lar brukeren utføre en handling, som å sende inn et skjema, lagre endringer eller navigere videre i en prosess.
Egnet til

    Handlinger som skjer umiddelbart (f.eks. lagre, sende, bekrefte)

    Navigasjon mellom steg i en prosess

    Primære og sekundære handlinger i en visning

    Handlinger som påvirker innhold eller systemtilstand

Uegnet til

    Navigasjon til nye sider uten at noe utføres (bruk lenke)

    Handlinger som ikke er tilgjengelige eller ikke kan utføres

    Som visuell dekorasjon uten funksjon

    For mange samtidige valg

Retningslinjer

Bruk riktig komponent: handling vs navigasjon
Knapper skal brukes når brukeren utfører en handling som påvirker systemet, for eksempel å lagre, sende eller bekrefte noe.

Dersom brukeren kun skal navigere til en ny side eller visning uten at noe behandles, skal lenke brukes i stedet. Dette skillet er viktig både for forventninger og tilgjengelighet.

Tydelig handling i label gir forutsigbarhet
Knappetekst skal beskrive hva som skjer når brukeren klikker. Den bør være handlingsorientert og konkret.

For eksempel er “Lagre endringer” tydeligere enn “OK”, fordi den forklarer hva handlingen faktisk gjør.

Unngå generiske labels
Generiske tekster som “OK”, “Send” eller “Neste” kan være uklare uten kontekst.

Der det er mulig, bør teksten spesifisere hva som skjer, som “Send søknad” eller “Gå til betaling”.

Teksten skal være kort og énlinjet
Knappetekst skal være kort og presis, og skal aldri brytes over flere linjer.

Korte tekster gjør knapper lettere å skanne og sikrer at layouten holder seg stabil på tvers av skjermstørrelser.

Hierarki skaper struktur og prioritering
Knapper skal ha et tydelig visuelt hierarki som viser hva som er viktigst å gjøre.

    Primærknapp brukes til hovedhandlingen i en visning

    Sekundærknapp brukes til alternative handlinger

    Tertiærknapp brukes til mindre viktige eller støttende handlinger

    Destruktiv knapp brukes til handlinger som sletter eller endrer data permanent

Dersom en tertiær knapp brukes alene, skal den alltid kombineres med ikon. Dette sikrer at den fremstår som en handling og ikke forveksles med vanlig tekst.

Én primær handling per visning
Hver side eller seksjon bør ha én tydelig primær handling. Denne bør fremheves visuelt slik at det er klart hva brukeren skal gjøre videre.

Flere primære knapper skaper konkurranse om oppmerksomheten og gjør det vanskeligere å ta en beslutning.

Plassering og rekkefølge påvirker valg
Når flere knapper plasseres ved siden av hverandre, skal primærknappen stå først. Dette gjør det tydelig hvilken handling som er viktigst.

Et unntak er navigasjon mellom steg, som “Forrige” og “Neste”. Her skal den sekundære knappen “Forrige” stå først, etterfulgt av primærknappen “Neste”. Dette samsvarer med brukerens forventning om retning og progresjon.

Ikonknapper krever ekstra tydelighet
Knapper som kun består av ikon er forbeholdt løsninger for mer erfarne brukere, siden handlingen ikke beskrives med tekst.

Unntak kan gjøres for godt etablerte ikoner, som lukk eller slett. Likevel må knappen alltid ha en tilgjengelig tekst, for eksempel gjennom aria-label, title eller tooltip.

Dette sikrer at alle brukere forstår hva handlingen gjør.

Bekreft destruktive handlinger
Handlinger som sletter eller endrer data permanent bør enten kreve en ekstra bekreftelse eller tydelig merkes som destruktive.

Ikke bruk disabled uten forklaring
Disabled knapper kan være vanskelig å forstå, spesielt hvis det ikke er tydelig hvorfor de ikke kan brukes.

Vurder om handlingen heller bør skjules, eller om det bør forklares hva som mangler for at knappen skal bli aktiv.

Tilpass bredde til innhold og kontekst
Knapper bør som hovedregel tilpasse seg innholdet sitt.

Full bredde kan brukes der det gir mening, for eksempel på mobil, men bør brukes bevisst for å unngå at alle handlinger fremstår som like viktige.
Tilgjengelighet / universell utforming

Semantisk korrekt element
Knapper skal implementeres med <button> når de utløser en handling. Lenker (<a>) skal kun brukes for navigasjon.

Navn og rolle må være tydelig
Knappens tekst, eller alternativ tekst via aria-label, må tydelig beskrive handlingen. Dette er avgjørende for skjermlesere.

Tydelig fokus og tastaturnavigasjon
Knapper skal være fullt opererbare med tastatur (Tab, Enter, Space). Fokusindikatoren må være tydelig og ha god kontrast.

Ikke stol på farge alene
Forskjeller mellom knappetyper må ikke kun kommuniseres med farge. Det må også være tydelig gjennom tekst og eventuelt ikon.

Tilstrekkelig størrelse og klikkeflate
Knapper skal ha en klikkeflate på minimum 44x44px for å være enkle å bruke på touch-enheter.

Tilbakemelding på handling
Når en knapp aktiveres, skal brukeren få tydelig tilbakemelding, som lasting eller bekreftelse. Dette hindrer usikkerhet og gjentatte klikk.

Vær bevisst på bruk av disabled
Dersom en knapp er deaktivert, må det være tydelig hvorfor, og hva som skal til for å aktivere den.

Dette gir en mer forutsigbar og forståelig brukeropplevelse.