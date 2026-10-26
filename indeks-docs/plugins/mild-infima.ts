import type { Plugin } from '@docusaurus/types';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import postcss from 'postcss';

/* Infima (Docusaurus' CSS) styler nakne elementer — a, a:hover, table, h1, p,
   [type='checkbox'] — med spesifisitet 0,0,1 eller høyere. Det slår Indeks-regler i
   :where() og flate klasseregler mot a:hover (0,1,1), så komponentene i docs ser
   annerledes ut enn hos konsumentene.

   Vi deler Infima i to ved bygg:
   - klasser.css erstatter originalen på samme plass i lasterekkefølgen, så navbar,
     sidebar og temaets CSS-moduler overstyrer den som før.
   - elementer.css har elementreglene pakket i :where() og importeres i custom.css
     (via aliaset @mild-infima) etter indeks-css. Spesifisitet 0 taper mot alle
     Indeks-regler med klasse utenfor :where(). Fordi fila lastes sist, slår den
     fortsatt resetten, så docs-tekst beholder marger og lenker. Indeks-regler som
     fortsatt står helt i :where(), taper som før. */

const mappe = path.resolve(__dirname, '../node_modules/.cache/mild-infima');

const fraPreset = createRequire(require.resolve('@docusaurus/preset-classic'));
const fraTema = createRequire(fraPreset.resolve('@docusaurus/theme-classic'));
const infimaFil = fraTema.resolve('infima/dist/css/default/default.css');

const erElementregel = (selector: string) => !/[.#]/.test(selector);

function delInfima() {
    const klasser = postcss.parse(readFileSync(infimaFil, 'utf-8'));
    const elementer = postcss.root();

    klasser.walkRules((rule) => {
        if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
        // :root og html[data-theme='dark'] har bare variabler; de må beholde spesifisiteten.
        if (rule.nodes.every((node) => node.type !== 'decl' || node.prop.startsWith('--'))) return;

        const treff = rule.selectors.filter(erElementregel);
        if (treff.length === 0) return;
        if (rule.parent?.type !== 'root') throw new Error(`Infima: elementregel i at-regel: ${rule.selector}`);
        if (treff.some((s) => s.includes('::'))) throw new Error(`Infima: pseudo-element i :where(): ${rule.selector}`);

        elementer.append(rule.clone({ selectors: treff.map((s) => `:where(${s})`) }));
        const rest = rule.selectors.filter((s) => !erElementregel(s));
        if (rest.length > 0) rule.selectors = rest;
        else rule.remove();
    });

    mkdirSync(mappe, { recursive: true });
    writeFileSync(path.join(mappe, 'klasser.css'), klasser.toString());
    writeFileSync(path.join(mappe, 'elementer.css'), elementer.toString());
}

export default function mildInfima(): Plugin {
    delInfima();
    return {
        name: 'mild-infima',
        configureWebpack() {
            return {
                resolve: { alias: { [infimaFil]: path.join(mappe, 'klasser.css'), '@mild-infima': mappe } },
            };
        },
    };
}
