import { Heading, Text } from '@sb1/indeks-react';

export default function TypografiEksempler() {
    return (
        <div className="ix-p-lg">
            <div
                className="ix-grid ix-justify-center ix-m-auto ix-mb-lg ix-p-md ix-row-gap-0"
                style={{ gridTemplateColumns: 'minmax(auto, 800px)' }}
            >
                <Heading as="h1" addRecommendedSpacing>
                    Typografi i digital produktutvikling
                </Heading>
                <Text addRecommendedSpacing long>
                    Typografi handler om mer enn bare valg av skrifttyper - det er en sentral del av brukeropplevelsen i
                    digitale produkter. God typografi bidrar til lesbarhet, tilgjengelighet, merkevareidentitet og ikke
                    minst brukervennlighet. I digital produktutvikling blir derfor typografi et strategisk virkemiddel
                    for å skape intuitive og engasjerende grensesnitt.
                </Text>
                <Heading as="h2" addRecommendedSpacing>
                    Samspill med utvikling
                </Heading>
                <Text addRecommendedSpacing long size="xs">
                    Typografiske valg må kunne implementeres effektivt i kode. Et tett samarbeid mellom designere og
                    utviklere sikrer at typografiske prinsipper ikke bare ser bra ut i designverktøyet, men også
                    fungerer godt i praksis. Variabler i CSS, typografiske tokens og komponentbasert utvikling (f.eks. i
                    React eller Flutter) gjør det lettere å håndheve typografiske retningslinjer.
                </Text>
                <Heading as="h3" addRecommendedSpacing>
                    Designsystemer og konsistens
                </Heading>
                <Text addRecommendedSpacing long>
                    Moderne digitale produkter bygger ofte på designsystemer, der typografiske prinsipper er nøye
                    definert for å sikre konsistens på tvers av flater og plattformer. Hierarki, skala og stil (f.eks.
                    bruk av bold for titler og regular for brødtekst) er med på å guide brukeren visuelt og gi
                    strukturell oversikt.
                </Text>
                <Heading as="h4" addRecommendedSpacing>
                    Tilgjengelighet og universell utforming
                </Heading>
                <Text addRecommendedSpacing long>
                    Typografi spiller en nøkkelrolle i universell utforming. For personer med nedsatt syn eller
                    lesevansker kan valg av skrifttype og kontrast være avgjørende for om en tjeneste er brukbar. Ved å
                    følge WCAG-retningslinjene for fargebruk og tekstkontrast, kan man sikre at innholdet er
                    tilgjengelig for alle brukere – uavhengig av funksjonsevne.
                </Text>
                <Heading as="h5" addRecommendedSpacing>
                    Responsiv og skalerbar typografi
                </Heading>
                <Text addRecommendedSpacing long>
                    I en verden hvor digitale produkter brukes på alt fra smartklokker til 4K-skjermer, må typografi
                    være fleksibel. Skalerbar typografi (f.eks. bruk av relative enheter som rem eller em) og responsive
                    typografiske skalaer gjør det mulig å tilpasse tekstens utseende til ulike skjermstørrelser uten at
                    det går på bekostning av lesbarheten.
                </Text>
                <Heading as="h6" addRecommendedSpacing>
                    Merkevare og emosjonell respons
                </Heading>
                <Text addRecommendedSpacing long size="sm">
                    Liten tekst: Typografi er også et bærende element i merkevarebygging. En distinkt typografisk stil
                    kan gi produktet personlighet og skape gjenkjennelse. Sans-serif-fonten i en bankapp kan formidle
                    trygghet og profesjonalitet, mens en leken skrifttype i en barneapp kan skape en følelse av moro og
                    kreativitet.
                </Text>
                <Heading as="h6" addRecommendedSpacing>
                    Oppsummering
                </Heading>
                <Text addRecommendedSpacing long size="xs">
                    Mikro-tekst: Typografi er en kritisk komponent i digital produktutvikling som påvirker alt fra
                    brukervennlighet og tilgjengelighet til merkevare og estetikk. Gjennom bevisste typografiske valg
                    kan man skape digitale opplevelser som både er funksjonelle, vakre og inkluderende.
                </Text>
            </div>
        </div>
    );
}
