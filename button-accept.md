Akseptansekriterier – Button
Generell oppførsel

    Button skal brukes for å utføre en handling.

    Button skal alltid trigge én primær handling per instans.

    Button skal ikke brukes til navigasjon mellom sider (bruk Link der dette er hensiktsmessig).

    Button skal støtte variantene primary, secondary, tertiary, danger, danger-secondary og danger-tertiary.

    Button skal støtte størrelsene small, medium og large.

    Button skal kunne rendres med kun tekst, kun ikon eller tekst + ikon.

    Button skal kunne brukes både på lys og mørk bakgrunn.

Interaksjon

    Button skal kunne aktiveres med:

        Museklikk

        Tastatur (Enter og Space)

        Pekeenheter (touch)

    Button skal ha tydelig visuell hover-tilstand.

    Button skal ha tydelig visuell active-tilstand ved trykk eller Space.

    Button i disabled-tilstand:

        Skal ikke være klikkbar

        Skal ikke kunne fokuseres

        Skal ikke trigge handling via tastatur eller mus

    Når Button inneholder ikon:

        Ikonet skal ikke være klikkbart separat

        Hele knappen skal være ett interaksjonsområde

Tilgjengelighet (WCAG)

    Button skal være semantisk korrekt implementert som <button>.

    Button skal ha et tilgjengelig navn:

        Tekstinnhold brukes som accessible name

        Ikon-knapp uten synlig tekst skal ha aria-label

    Kontrastkrav:

        Tekst og ikon i Button skal ha minimum kontrast 4.5:1 mot bakgrunnen

        Disabled-tilstand er unntatt kontrastkrav, men skal fortsatt være tydelig

    Fokus:

        Button skal ha tydelig fokusmarkering

        Fokusmarkering skal være synlig på både lys og mørk bakgrunn

    Button skal være tilgjengelig for skjermlesere og annonseres som "knapp".

Visuell tilstand

    Button skal støtte følgende states:

        default

        hover

        active

        disabled

    Alle states skal være visuelt tydelige og konsistente på tvers av:

        Varianter (primary, secondary, osv.)

        Størrelser (small, medium, large)

    Danger-varianter skal visuelt kommunisere destruktiv handling tydeligere enn øvrige varianter.

    Tertiary-varianter skal ha lavere visuell prominens enn primary og secondary.

Struktur og innhold

    Button-tekst:

        Skal være kort og handlingsorientert

        Skal bruke aktiv form (f.eks. “Lagre”, “Send søknad”)

    Ikon:

        Skal plasseres til venstre for tekst som standard

        Skal være visuelt sentrert sammen med teksten

    Avstand mellom ikon og tekst skal være konsistent på tvers av størrelser.

    Innholdet i Button skal alltid være sentrert horisontalt og vertikalt.

Responsiv oppførsel

    Button skal fungere likt på mobil, nettbrett og desktop.

    Treffflate:

        Skal være minimum 44×44 px på touch-enheter

    Button skal ikke endre funksjon eller semantikk basert på skjermstørrelse.

    Tekst skal ikke brytes over flere linjer uten eksplisitt støtte for dette.

API / fleksibilitet

    Button skal støtte props for:

        variant

        size

        icon

        iconPosition

        disabled

    Button skal kunne brukes både som:

        Submit-knapp i skjema (type="submit")

        Standard handling (type="button")

    Det skal ikke være mulig å kombinere flere variant-typer samtidig.