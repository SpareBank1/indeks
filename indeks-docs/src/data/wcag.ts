export interface WcagCriterion {
    title: string;
    level: 'A' | 'AA';
    defaultReason?: string;
}

/**
 * Alle 56 WCAG 2.2 kriterier på nivå A og AA.
 *
 * `defaultReason` er standardbegrunnelsen for hvorfor kriteriet ikke er relevant
 * for de fleste enkeltkomponenter. Komponent-JSON kan utelate `reason` i
 * notRelevant — da brukes defaultReason automatisk.
 */
export const wcagCriteria: Record<string, WcagCriterion> = {
    // ── 1. Oppfattbar ────────────────────────────────────────────────────

    '1.1.1': { title: 'Ikke-tekstlig innhold', level: 'A' },

    '1.2.1': { title: 'Bare lyd og bare video (forhåndsinnspilt)', level: 'A', defaultReason: 'Ingen medieelementer.' },
    '1.2.2': { title: 'Teksting (forhåndsinnspilt)', level: 'A', defaultReason: 'Ingen medieelementer.' },
    '1.2.3': { title: 'Synstolking eller mediealternativ (forhåndsinnspilt)', level: 'A', defaultReason: 'Ingen medieelementer.' },
    '1.2.4': { title: 'Teksting (direkte)', level: 'AA', defaultReason: 'Ingen medieelementer.' },
    '1.2.5': { title: 'Synstolking (forhåndsinnspilt)', level: 'AA', defaultReason: 'Ingen medieelementer.' },

    '1.3.1': { title: 'Informasjon og relasjoner', level: 'A' },
    '1.3.2': { title: 'Meningsfull rekkefølge', level: 'A' },
    '1.3.3': { title: 'Sensoriske egenskaper', level: 'A' },
    '1.3.4': { title: 'Visningsretning', level: 'AA', defaultReason: 'Ingen fast orientering — tilpasser seg visningsretning.' },
    '1.3.5': { title: 'Identifiser formål med inndata', level: 'AA' },

    '1.4.1': { title: 'Bruk av farge', level: 'A' },
    '1.4.2': { title: 'Styring av lyd', level: 'A', defaultReason: 'Ingen lydelementer.' },
    '1.4.3': { title: 'Kontrast (minimum)', level: 'AA' },
    '1.4.4': { title: 'Endre tekststørrelse', level: 'AA' },
    '1.4.5': { title: 'Bilder av tekst', level: 'AA', defaultReason: 'Ingen bilder av tekst.' },
    '1.4.10': { title: 'Omflyt', level: 'AA' },
    '1.4.11': { title: 'Kontrast for ikke-tekstlig innhold', level: 'AA' },
    '1.4.12': { title: 'Tekstavstand', level: 'AA' },
    '1.4.13': { title: 'Innhold ved hover eller fokus', level: 'AA' },

    // ── 2. Opererbar ─────────────────────────────────────────────────────

    '2.1.1': { title: 'Tastatur', level: 'A' },
    '2.1.2': { title: 'Ingen tastaturfelle', level: 'A' },
    '2.1.4': { title: 'Tastatursnarveier', level: 'A', defaultReason: 'Ingen egendefinerte tastatursnarveier.' },

    '2.2.1': { title: 'Justerbar hastighet', level: 'A', defaultReason: 'Ingen tidsbegrensede funksjoner.' },
    '2.2.2': { title: 'Pause, stopp, skjul', level: 'A', defaultReason: 'Ingen animasjon eller automatisk oppdatering.' },

    '2.3.1': { title: 'Terskelverdi på tre glimt', level: 'A', defaultReason: 'Ingen blinkende eller glimtende innhold.' },

    '2.4.1': { title: 'Hoppe over blokker', level: 'A', defaultReason: 'Sidekrav — gjelder ikke enkeltkomponenter.' },
    '2.4.2': { title: 'Sidetitler', level: 'A', defaultReason: 'Sidekrav — gjelder ikke enkeltkomponenter.' },
    '2.4.3': { title: 'Fokusrekkefølge', level: 'A' },
    '2.4.4': { title: 'Formål med lenke (i kontekst)', level: 'A' },
    '2.4.5': { title: 'Flere måter', level: 'AA', defaultReason: 'Sidekrav — gjelder ikke enkeltkomponenter.' },
    '2.4.6': { title: 'Overskrifter og ledetekster', level: 'AA' },
    '2.4.7': { title: 'Synlig fokus', level: 'AA' },
    '2.4.11': { title: 'Fokus ikke skjult (minimum)', level: 'AA', defaultReason: 'Ingen sticky/overlappende elementer som kan skjule fokus.' },

    '2.5.1': { title: 'Pekerbevegelser', level: 'A', defaultReason: 'Ingen drag-and-drop eller sveipebevegelser.' },
    '2.5.2': { title: 'Avbryt peker', level: 'A' },
    '2.5.3': { title: 'Label i navn', level: 'A' },
    '2.5.4': { title: 'Bevegelsesaktivering', level: 'A', defaultReason: 'Ingen bevegelsesbasert interaksjon.' },
    '2.5.6': { title: 'Samtidige inndatamekanismer', level: 'A' },
    '2.5.7': { title: 'Drabevegelser', level: 'A', defaultReason: 'Ingen drag-and-drop.' },
    '2.5.8': { title: 'Målstørrelse (minimum)', level: 'AA' },

    // ── 3. Forståelig ────────────────────────────────────────────────────

    '3.1.1': { title: 'Språk på siden', level: 'A', defaultReason: 'Sidekrav — gjelder ikke enkeltkomponenter.' },
    '3.1.2': { title: 'Språk på deler av innhold', level: 'AA', defaultReason: 'Komponenten setter ikke lang-attributt — innhold er på sidespråket.' },

    '3.2.1': { title: 'Ved fokus', level: 'A' },
    '3.2.2': { title: 'Ved inndata', level: 'A' },
    '3.2.3': { title: 'Konsistent navigasjon', level: 'AA', defaultReason: 'Sidekrav — gjelder ikke enkeltkomponenter.' },
    '3.2.4': { title: 'Konsistent identifikasjon', level: 'AA', defaultReason: 'Systemkrav — gjelder konsistens på tvers av sider, ikke enkeltkomponenter.' },
    '3.2.6': { title: 'Konsistent hjelp', level: 'A', defaultReason: 'Sidekrav — gjelder plassering av hjelpefunksjon på tvers av sider.' },

    '3.3.1': { title: 'Identifikasjon av feil', level: 'A' },
    '3.3.2': { title: 'Ledetekster eller instruksjoner', level: 'A' },
    '3.3.3': { title: 'Forslag ved feil', level: 'AA' },
    '3.3.4': { title: 'Forhindring av feil (juridisk, økonomisk, data)', level: 'AA', defaultReason: 'Flytkrav — gjelder bekreftelse/reversering av transaksjoner, ikke enkeltfelter.' },
    '3.3.7': { title: 'Redundant oppføring', level: 'A', defaultReason: 'Flytkrav — gjelder at brukeren ikke skal gjenta informasjon i en prosess.' },
    '3.3.8': { title: 'Tilgjengelig autentisering (minimum)', level: 'AA', defaultReason: 'Ikke en autentiseringskomponent.' },

    // ── 4. Robust ────────────────────────────────────────────────────────

    '4.1.2': { title: 'Navn, rolle, verdi', level: 'A' },
    '4.1.3': { title: 'Statusmeldinger', level: 'AA' },
};
