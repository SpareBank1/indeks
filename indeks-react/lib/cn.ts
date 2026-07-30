// `cn` — slår sammen betingede CSS-klassenavn til én streng.
//
// VIKTIG: Denne implementasjonen dupliseres bevisst med indeks-web (lib/utils/cn.ts)
// og holdes i synk via cn.sync.test.ts. IKKE importer fra @sb1/indeks-web i
// library-kode — web lastes fra CDN som en separat pakke, og en import ville dratt
// web-bundelen inn i React-bundelen. Se icon-types.ts for samme mønster.

export interface ClassDictionary {
    // Verdien tolkes kun som truthy/falsy — nøkkelen tas med når verdien er truthy.
    [key: string]: unknown;
}

export type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    const klasser: string[] = [];

    for (const input of inputs) {
        if (!input) continue;

        if (typeof input === 'string' || typeof input === 'number') {
            klasser.push(String(input));
        } else if (Array.isArray(input)) {
            const nøstet = cn(...input);
            if (nøstet) klasser.push(nøstet);
        } else if (typeof input === 'object') {
            for (const nøkkel in input) {
                if (input[nøkkel]) klasser.push(nøkkel);
            }
        }
    }

    return klasser.join(' ');
}
