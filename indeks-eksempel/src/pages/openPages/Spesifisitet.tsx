import { Heading, Text, VStack } from '@sb1/indeks-react';
import type { ReactNode } from 'react';
import { Sammenligning } from './spesifisitet/Sammenligning';
import * as u from './spesifisitet/utdrag';
import './spesifisitet.css';

/*
 * Diskusjonsgrunnlag for spesifisitetsregelen i indeks-css: når skal vi bruke
 * :where(), og bør vi bruke @layer?
 *
 * Hver seksjon er én avgjørelse. De levende eksemplene er iframes med global
 * CSS, så spesifisitet og lag virker som i en ekte vert. `spesifisitet.spec.ts`
 * leser beregnet stil i hver iframe og holder påstandene i teksten sanne.
 */

function Seksjon({ id, tittel, children }: { id: string; tittel: string; children: ReactNode }) {
    return (
        <section id={id} aria-labelledby={`${id}-tittel`}>
            <VStack gap="md">
                <Heading as="h2" size="lg" id={`${id}-tittel`}>
                    {tittel}
                </Heading>
                {children}
            </VStack>
        </section>
    );
}

function Liste({ children }: { children: ReactNode }) {
    return <ul className="ix-list-disc ix-list-inside ix-text spesifisitet-liste">{children}</ul>;
}

function Forslag({ children }: { children: ReactNode }) {
    return (
        <div className="spesifisitet-forslag">
            <Text>
                <strong>Forslag: </strong>
                {children}
            </Text>
        </div>
    );
}

function Sporsmal({ children }: { children: ReactNode }) {
    return (
        <Text>
            <strong>Å avgjøre: </strong>
            {children}
        </Text>
    );
}

export default function Spesifisitet() {
    return (
        <div className="ix-p-lg spesifisitet">
            <VStack gap="2xl">
                <VStack gap="md">
                    <Heading as="h1" size="xl">
                        Spesifisitet, :where() og lag
                    </Heading>
                    <Text long>
                        Komponent-CSS-en i indeks pakker nesten alt i <code>:where()</code>. Det gir
                        spesifisitet 0,0,0, så vertens elementregler som <code>a {'{}'}</code> og{' '}
                        <code>h2 {'{}'}</code> vinner over oss. Vi lapper det i Docusaurus i dag.
                    </Text>
                    <Text long>Kravene vi vurderer alternativene mot:</Text>
                    <Liste>
                        <li>Indeks vinner over Docusaurus og Swagger UI når indeks lastes etter dem.</li>
                        <li>Konsumenten overstyrer med én klasse.</li>
                        <li>Konsumenten skal ikke måtte gjenskape tilstander eller selektorformen vår.</li>
                    </Liste>
                    <Text long>
                        Hver seksjon under er én avgjørelse. Eksemplene er levende, så du kan holde musen over
                        knappene. «Vis CSS» viser reglene, med spesifisitet i kommentaren.
                    </Text>
                    <nav aria-label="Seksjoner">
                        <ol className="ix-list-decimal ix-list-inside ix-text spesifisitet-liste">
                            <li><a href="#vert">Mot vertens elementregler</a></li>
                            <li><a href="#rekkefolge">Rekkefølge</a></li>
                            <li><a href="#varianter">Overstyring av varianter</a></li>
                            <li><a href="#tilstander">Tilstander brukeren er avhengig av</a></li>
                            <li><a href="#bem">BEM-klasser mot strukturelle selektorer</a></li>
                            <li><a href="#kontekst">Kontekstselektorer</a></li>
                            <li><a href="#reset">Reset</a></li>
                            <li><a href="#lag">Lag for konsumenter som vil ha det</a></li>
                            <li><a href="#samlet">Samlet forslag</a></li>
                        </ol>
                    </nav>
                </VStack>

                <Seksjon id="vert" tittel="1. Mot vertens elementregler">
                    <Text long>
                        Infima setter farge på <code>a</code> og størrelse og marg på <code>h2</code>. En{' '}
                        <code>&lt;a class="ix-button"&gt;</code> får lenkefarge, og <code>ix-heading</code> får
                        Docusaurus-størrelse. Indeks lastes etter Infima i alle eksemplene.
                    </Text>
                    <Text long>
                        Infimas <code>a:hover</code> er 0,1,1, fordi pseudoklassen teller som en klasse. Den slår
                        derfor også en flat 0,1,0-regel. Hold musen over knappene.
                    </Text>
                    <Sammenligning
                        id="vert"
                        vertNavn="Infima"
                        vertCss={u.INFIMA}
                        markup={u.KNAPP_MARKUP}
                        hoyde={130}
                        alternativer={[
                            {
                                nokkel: 'dagens',
                                navn: 'Dagens :where() (0,0,0)',
                                indeksCss: u.KNAPP_DAGENS,
                                resultat: 'Infima vinner overalt: blå tekst på blå knapp, og stor overskrift med marg.',
                            },
                            {
                                nokkel: 'flat',
                                navn: 'Ankerklasse, flat (0,1,0)',
                                indeksCss: u.KNAPP_FLAT,
                                resultat: 'Indeks vinner i hvile. På hover vinner Infima: blå tekst og understrek.',
                            },
                            {
                                nokkel: 'loftet',
                                navn: 'Ankerklasse, tilstand løftet (0,2,0)',
                                indeksCss: u.KNAPP_TILSTAND_LOFTET,
                                resultat: 'Indeks vinner også på hover. Hover-regelen må selv sette farge og understrek.',
                            },
                            {
                                nokkel: 'lag',
                                navn: 'Hele indeks i @layer',
                                indeksCss: u.KNAPP_LAG,
                                resultat: 'Infima vinner overalt, fordi CSS uten lag slår CSS i lag uansett spesifisitet.',
                            },
                        ]}
                    />
                    <Heading as="h3" size="md">
                        Swagger UI
                    </Heading>
                    <Text long>
                        All CSS i Swagger UI er scopet under <code>.swagger-ui</code>. Det gjelder v3, v4 og
                        5.33.1, og den eneste globale regelen er <code>html.dark-mode</code>. Utenfor Swagger lekker
                        ingenting inn, så der vinner indeks allerede i dag. Inne i Swagger er normalize-reglene
                        0,1,1, og de slår enhver flat regel. Skriften i indeks-utdraget er Georgia, så forskjellen
                        synes.
                    </Text>
                    <Sammenligning
                        id="swagger"
                        vertNavn="Swagger UI"
                        vertCss={u.SWAGGER}
                        markup={u.SWAGGER_MARKUP}
                        hoyde={120}
                        alternativer={[
                            {
                                nokkel: 'dagens',
                                navn: 'Dagens :where() (0,0,0)',
                                indeksCss: u.SWAGGER_DAGENS,
                                resultat: 'Utenfor: indeks-skrift. Inne i: Swagger-skrift.',
                            },
                            {
                                nokkel: 'flat',
                                navn: 'Ankerklasse, flat (0,1,0)',
                                indeksCss: u.SWAGGER_FLAT,
                                resultat: 'Samme resultat. Ingen flat regel vinner inne i .swagger-ui.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>Dagens form taper mot alle elementregler hos verten.</li>
                        <li>Flat 0,1,0 slår elementregler, men ikke elementregler med pseudoklasse som <code>a:hover</code>, <code>input:focus</code> og <code>a:not([href])</code>.</li>
                        <li>Lag gjør konflikten verre, ikke bedre, så lenge verten ikke bruker lag.</li>
                        <li>Scopede regler som <code>.markdown a</code> og <code>.swagger-ui input</code> er utenfor rekkevidde for alle alternativene.</li>
                    </Liste>
                    <Forslag>ankerklasse utenfor <code>:where()</code>, og tilstander løftet til 0,2,0.</Forslag>
                    <Sporsmal>holder det å vinne over elementregler, eller må vi også vinne over pseudoklasser hos verten?</Sporsmal>
                </Seksjon>

                <Seksjon id="rekkefolge" tittel="2. Rekkefølge">
                    <Text long>
                        Når to regler har lik spesifisitet, vinner den som kommer sist. Med flat 0,1,0 har indeks og
                        konsumentens <code>.min-knapp</code> lik spesifisitet. Da avgjør det om konsumentens CSS
                        lastes før eller etter indeks.
                    </Text>
                    <Sammenligning
                        id="rekkefolge"
                        markup={u.KONSUMENT_KNAPP_MARKUP}
                        konsumentCss={u.KONSUMENT_KNAPP}
                        alternativer={[
                            {
                                nokkel: 'etter',
                                navn: 'Konsumenten lastes etter',
                                indeksCss: u.KNAPP_FLAT,
                                resultat: 'Konsumenten vinner: rød knapp.',
                            },
                            {
                                nokkel: 'for',
                                navn: 'Konsumenten lastes før',
                                indeksCss: u.KNAPP_FLAT,
                                konsumentForst: true,
                                resultat: 'Indeks vinner: blå knapp.',
                            },
                            {
                                nokkel: 'for-dobbel',
                                navn: 'Lastes før, med to klasser',
                                indeksCss: u.KNAPP_FLAT,
                                konsumentForst: true,
                                konsumentCss: u.KONSUMENT_KNAPP_DOBBEL,
                                resultat: 'Konsumenten vinner igjen: rød knapp.',
                            },
                        ]}
                    />
                    <Forslag>
                        vi dokumenterer at indeks lastes etter verten og før konsumentens egen CSS. Den som ikke kan
                        styre rekkefølgen, bruker to klasser.
                    </Forslag>
                    <Sporsmal>er det et rimelig krav til konsumentene?</Sporsmal>
                </Seksjon>

                <Seksjon id="varianter" tittel="3. Overstyring av varianter">
                    <Text long>
                        Konsumenten setter <code>.min-knapp {'{ background }'}</code> på en primary-knapp. Hvis
                        varianten står utenfor <code>:where()</code>, er den 0,2,0. Da må konsumenten skrive{' '}
                        <code>.min-knapp[data-variant='primary']</code>, og selektorformen vår blir et uoffisielt API.
                    </Text>
                    <Sammenligning
                        id="varianter"
                        markup={u.KONSUMENT_KNAPP_MARKUP}
                        konsumentCss={u.KONSUMENT_KNAPP}
                        alternativer={[
                            {
                                nokkel: 'flat',
                                navn: 'Variant og hover flat',
                                indeksCss: u.KNAPP_FLAT,
                                resultat: 'Rød i hvile og på hover.',
                            },
                            {
                                nokkel: 'eskalert',
                                navn: 'Variant eskalert (0,2,0)',
                                indeksCss: u.KNAPP_VARIANT_ESKALERT,
                                resultat: 'Blå. Konsumentens klasse taper.',
                            },
                            {
                                nokkel: 'loftet',
                                navn: 'Variant flat, hover løftet',
                                indeksCss: u.KNAPP_TILSTAND_LOFTET,
                                resultat: 'Rød i hvile, mørkeblå på hover. Konsumenten må skrive .min-knapp:hover selv.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>Varianten er konsumentens eget valg. Overstyrer de den, er det med vilje.</li>
                        <li>En klasse treffer bare elementet den står på, ikke alle knapper av samme variant.</li>
                        <li>Den som vil endre alle primary-knapper, skriver <code>.ix-button[data-variant='primary']</code> selv.</li>
                    </Liste>
                    <Forslag>varianter flat, inne i <code>:where()</code>.</Forslag>
                    <Sporsmal>skal en konsumentklasse kunne overstyre en variant uten å kjenne selektoren?</Sporsmal>
                </Seksjon>

                <Seksjon id="tilstander" tittel="4. Tilstander brukeren er avhengig av">
                    <Text long>
                        Noen tilstander er pynt, som hover og active. Andre bærer informasjon: fokus, deaktivert og
                        ugyldig. Forsvinner de, er det et WCAG-brudd. Her setter konsumenten en kantfarge på alle
                        feltene sine, og det ugyldige feltet mister den røde kanten.
                    </Text>
                    <Sammenligning
                        id="tilstander"
                        markup={u.FELT_MARKUP}
                        konsumentCss={u.KONSUMENT_FELT}
                        hoyde={130}
                        alternativer={[
                            {
                                nokkel: 'flat',
                                navn: 'Tilstand flat (0,1,0)',
                                indeksCss: u.FELT_TILSTAND_FLAT,
                                resultat: 'Begge feltene får blå kant. Feilen synes ikke lenger.',
                            },
                            {
                                nokkel: 'beskyttet',
                                navn: 'Tilstand beskyttet (0,2,0)',
                                indeksCss: u.FELT_TILSTAND_BESKYTTET,
                                resultat: 'Det gyldige feltet får blå kant, det ugyldige beholder rød.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>Beskyttet betyr at konsumenten ikke kan slette tilstanden ved et uhell.</li>
                        <li>Vil de endre den med vilje, skriver de samme selektor, eller bruker <code>--ix-</code>-variabler.</li>
                        <li>Seksjon 1 trekker samme vei: tilstander på 0,2,0 slår også <code>a:hover</code> hos verten.</li>
                    </Liste>
                    <Forslag>
                        <code>:focus-visible</code>, <code>:disabled</code> og <code>[aria-invalid]</code> løftes til
                        0,2,0. Hover og active også, hvis seksjon 1 krever det.
                    </Forslag>
                    <Sporsmal>hvilke tilstander er beskyttet, og skal hover og active med?</Sporsmal>
                </Seksjon>

                <Seksjon id="bem" tittel="5. BEM-klasser mot strukturelle selektorer">
                    <Text long>
                        CSS-en for tekstfelt, textarea, checkbox og radio støtter både{' '}
                        <code>.ix-text-field &gt; input</code> og <code>.ix-text-field__input</code>. React og
                        web-komponentene setter ikke BEM-klassene på disse elementene, men de gjør det for de fleste
                        andre komponenter. Konsumenten må da skrive den strukturelle selektoren, og strukturen vår blir
                        API. Konsumenten vil ha firkantede hjørner.
                    </Text>
                    <Sammenligning
                        id="bem"
                        hoyde={90}
                        markup={u.BEM_MARKUP_KLASSE}
                        konsumentCss={u.KONSUMENT_BEM_KLASSE}
                        alternativer={[
                            {
                                nokkel: 'dagens',
                                navn: 'Dagens React-markup',
                                markup: u.BEM_MARKUP_REACT,
                                indeksCss: u.BEM_DAGENS,
                                konsumentCss: u.KONSUMENT_BEM_STRUKTUR,
                                resultat: 'Virker, men konsumenten må kjenne strukturen.',
                            },
                            {
                                nokkel: 'strukturell',
                                navn: 'BEM-klasse, strukturell selektor beholdt',
                                indeksCss: u.BEM_STRUKTURELL,
                                resultat: 'Runde hjørner. .ix-text-field > input er 0,1,1 og slår klassen.',
                            },
                            {
                                nokkel: 'pakket',
                                navn: 'BEM-klasse, elementet i :where()',
                                indeksCss: u.BEM_PAKKET,
                                resultat: 'Firkantet. Begge selektorene er 0,1,0.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>BEM gir konsumenten et stabilt mål å overstyre, men løser ikke tilstandene i seksjon 4.</li>
                        <li>Håndskrevet HTML uten klasser på barna må fortsatt virke, så den strukturelle selektoren blir.</li>
                        <li>Barnet må pakkes i <code>:where()</code>, ellers er den strukturelle selektoren sterkere enn BEM-klassen.</li>
                    </Liste>
                    <Text long>Funnet underveis, rettes separat:</Text>
                    <Liste>
                        <li>Kommentaren i <code>radio-group.css</code> sier at React setter BEM-klassene. Det gjør den ikke.</li>
                        <li><code>ix-card__action</code> og <code>ix-table__header</code> rendres, men har ingen CSS.</li>
                    </Liste>
                    <Forslag>
                        React og web-komponentene setter alltid BEM-klassen, og den strukturelle selektoren pakker
                        barnet: <code>.ix-text-field &gt; :where(input)</code>.
                    </Forslag>
                    <Sporsmal>skal BEM-klassene være offentlig API for overstyring?</Sporsmal>
                </Seksjon>

                <Seksjon id="kontekst" tittel="6. Kontekstselektorer">
                    <Text long>
                        Når en komponent står inne i en annen, skriver vi av og til <code>.ix-card .ix-heading</code>.
                        Den er 0,2,0 bare fordi to komponenter møtes, ikke fordi den betyr noe mer. Da taper
                        konsumentens <code>.min-overskrift</code> uten grunn. I dag finnes slike regler blant annet i{' '}
                        <code>spinner.css</code>, <code>date-field.css</code> og <code>combobox.css</code>.
                    </Text>
                    <Sammenligning
                        id="kontekst"
                        markup={u.KONTEKST_MARKUP}
                        konsumentCss={u.KONSUMENT_OVERSKRIFT}
                        alternativer={[
                            {
                                nokkel: 'eskalert',
                                navn: '.ix-card .ix-heading (0,2,0)',
                                indeksCss: u.KONTEKST_ESKALERT,
                                resultat: 'Blå. Konsumenten taper.',
                            },
                            {
                                nokkel: 'pakket',
                                navn: '.ix-card :where(.ix-heading) (0,1,0)',
                                indeksCss: u.KONTEKST_PAKKET,
                                resultat: 'Rød. Konsumenten vinner.',
                            },
                        ]}
                    />
                    <Forslag>
                        kontekstselektorer pakker målet i <code>:where()</code>. Dette er det eneste stedet{' '}
                        <code>:where()</code> blir igjen utenom varianter.
                    </Forslag>
                    <Sporsmal>pakke dem, eller unngå kontekstselektorer helt?</Sporsmal>
                </Seksjon>

                <Seksjon id="reset" tittel="7. Reset">
                    <Text long>
                        Resetten skal tape mot alt. I dag er både resetten og komponentene 0,0,0, så det er
                        rekkefølgen som avgjør. Det virker bare fordi utils lastes før css. I eksemplene under lastes
                        resetten etter komponentene, for å vise hva som skjer når rekkefølgen glipper.
                    </Text>
                    <Sammenligning
                        id="reset"
                        markup={u.RESET_MARKUP}
                        alternativer={[
                            {
                                nokkel: 'dagens',
                                navn: 'Dagens: begge 0,0,0',
                                indeksCss: u.RESET_DAGENS,
                                resultat: 'Resetten vinner: overskriften mister størrelsen.',
                            },
                            {
                                nokkel: 'flat',
                                navn: 'Komponent 0,1,0, reset i :where()',
                                indeksCss: u.RESET_FLAT,
                                resultat: 'Komponenten vinner uansett rekkefølge.',
                            },
                            {
                                nokkel: 'lag',
                                navn: 'Reset i @layer ix-reset',
                                indeksCss: u.RESET_LAG,
                                resultat: 'Komponenten vinner, selv på 0,0,0.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>Når komponentene er 0,1,0, virker begge. Laget er da en ekstra sikring, ikke en nødvendighet.</li>
                        <li>Med laget kan resetten skrives som vanlige selektorer, uten <code>:where()</code>.</li>
                        <li>Laget taper også mot vertens CSS. For en reset er det riktig.</li>
                        <li>Utilities og komponenter er begge 0,1,0, så utilities må lastes etter komponentene. Det gjelder uansett.</li>
                    </Liste>
                    <Forslag>reset i <code>@layer ix-reset</code>, uten <code>:where()</code>.</Forslag>
                    <Sporsmal>lag eller <code>:where()</code> for resetten?</Sporsmal>
                </Seksjon>

                <Seksjon id="lag" tittel="8. Lag for konsumenter som vil ha det">
                    <Text long>
                        Tailwind 4 legger utilities i <code>@layer utilities</code>. Indeks uten lag slår dem, så{' '}
                        <code>p-0</code> virker ikke på en indeks-knapp. Konsumenten kan legge indeks i et lag selv ved
                        import, uten at vi endrer noe. Da taper indeks mot Tailwind, men også mot Infima.
                    </Text>
                    <Sammenligning
                        id="lag"
                        vertNavn="Infima og Tailwind"
                        vertCss={`${u.INFIMA}\n${u.TAILWIND}`}
                        markup={u.LAG_MARKUP}
                        alternativer={[
                            {
                                nokkel: 'uten',
                                navn: 'Indeks uten lag',
                                indeksCss: u.KNAPP_FLAT,
                                resultat: 'p-0 virker ikke. Infima taper.',
                            },
                            {
                                nokkel: 'med',
                                navn: 'Konsumenten importerer i lag',
                                oppsett: u.LAG_OPPSETT,
                                indeksCss: u.LAG_IMPORT_KOMMENTAR + u.KNAPP_LAG,
                                resultat: 'p-0 virker. Infima vinner også: blå tekst.',
                            },
                        ]}
                    />
                    <Text long>Avveininger:</Text>
                    <Liste>
                        <li>Valget ligger hos konsumenten, og standarden er uendret.</li>
                        <li>Med lag må konsumenten også legge annen tredjeparts-CSS i lag for at indeks skal vinne over den.</li>
                        <li>
                            En <code>&lt;link&gt;</code> fra CDN kan ikke legges i lag. Konsumenten må bruke{' '}
                            <code>@import url(...) layer(indeks)</code>.
                        </li>
                    </Liste>
                    <Forslag>indeks leveres uten lag, og vi dokumenterer import i lag for Tailwind og andre som bruker lag.</Forslag>
                    <Sporsmal>holder dokumentasjon, eller skal vi levere en egen fil i lag?</Sporsmal>
                </Seksjon>

                <Seksjon id="samlet" tittel="9. Samlet forslag">
                    <Text long>Hvis forslagene over velges, blir regelen slik:</Text>
                    <Liste>
                        <li>Ankerklassen står utenfor <code>:where()</code> og gir 0,1,0.</li>
                        <li>Varianter står inne i <code>:where()</code> og holder seg på 0,1,0.</li>
                        <li>Tilstander brukeren er avhengig av står utenfor og gir 0,2,0.</li>
                        <li>Barn som er nakne elementer pakkes: <code>.ix-text-field &gt; :where(input)</code>.</li>
                        <li>Kontekstselektorer pakker målet: <code>.ix-card :where(.ix-heading)</code>.</li>
                        <li>Reset ligger i <code>@layer ix-reset</code>.</li>
                        <li>Indeks lastes etter verten, og konsumenten kan legge indeks i lag selv.</li>
                    </Liste>
                    <Text long>Avhengigheter mellom valgene:</Text>
                    <Liste>
                        <li>Seksjon 1 og 4 henger sammen: løftes tilstander for å slå <code>a:hover</code>, er hover beskyttet også mot konsumenten.</li>
                        <li>Seksjon 5 virker bare sammen med seksjon 4. BEM gir et mål å overstyre, men tilstandene må beskyttes for seg.</li>
                        <li>Velges lag i seksjon 7, trenger vi ikke dele utils i egne eksporter for reset og utilities.</li>
                    </Liste>
                    <Text long>
                        Overstyring via <code>--ix-</code>-variabler er det ryddigste for den som vil endre en
                        tilstand med vilje. Det henger sammen med navnespørsmålet i issue #217 og avgjøres der.
                    </Text>
                </Seksjon>
            </VStack>
        </div>
    );
}
