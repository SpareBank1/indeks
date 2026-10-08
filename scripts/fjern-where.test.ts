import assert from 'node:assert/strict';
import { test } from 'node:test';
import { harAnkerIWhere, transformer, transformerCss } from './fjern-where.ts';

/* Én fikstur per regel i fjern-where.ts. Spesifisiteten etter transformasjonen står i
   kommentaren, siden det er den regelen handler om. */

const tilfeller: [string, string, string][] = [
    ['anker pakkes ut', ":where(.ix-button[data-variant='primary']:hover)", ".ix-button[data-variant='primary']:hover"], // 0,3,0
    ['dual target deles', ':where(ix-grid, .ix-grid)', 'ix-grid, .ix-grid'],
    ['dual target med pseudo-element', ':where(ix-spinner, .ix-spinner)::before', 'ix-spinner::before, .ix-spinner::before'],
    ['dual target fulgt av mer blir :is()', ":where(ix-radio-group, .ix-radio-group) input[type='radio']", ":is(ix-radio-group, .ix-radio-group) :where(input[type='radio'])"],
    ['nakent barn pakkes med tilstanden', ':where(.ix-text-field) > input:disabled', '.ix-text-field > :where(input:disabled)'], // 0,1,0
    ['tilstand på ankeret', ':where(.ix-text-field[data-has-prefix]) > input', '.ix-text-field[data-has-prefix] > :where(input)'], // 0,2,0
    ['kombinator inni :where()', ':where(.ix-read-more > summary)', '.ix-read-more > :where(summary)'],
    ['annen komponent er kontekst', ':where(.ix-button .ix-spinner)', '.ix-button :where(.ix-spinner)'], // 0,1,0
    ['annen komponent-tagg er kontekst', ':where(.ix-message ix-icon[data-badge])', '.ix-message :where(ix-icon[data-badge])'],
    ['samme blokk beholdes', ':where(.ix-accordion__item:first-child) .ix-accordion__header', '.ix-accordion__item:first-child .ix-accordion__header'],
    ['modifier er samme blokk', ':where(.ix-card--clickable) .ix-card__chevron', '.ix-card--clickable .ix-card__chevron'],
    ['søsken-elementer pakkes', ":where(.ix-checkbox input[type='checkbox']:checked + label)", ".ix-checkbox :where(input[type='checkbox']:checked) + :where(label)"],
    ['pseudo-element på barn', ':where(.ix-checkbox) label::before', '.ix-checkbox :where(label)::before'],
    ['tilstand i :where() etter ankeret', '.ix-chip[data-removable]:where(:hover)', '.ix-chip[data-removable]:hover'],
    ['allerede riktig form står', '.ix-text-field > :where(input:disabled)', '.ix-text-field > :where(input:disabled)'],
    ['uten :where() står urørt', '.ix-table th', '.ix-table th'],
];

for (const [navn, inn, ut] of tilfeller) {
    test(navn, () => {
        const r = transformer(inn);
        assert.equal(r.selektor, ut);
        assert.equal(r.manuell, false);
    });
}

test('uten anker blir manuell og står urørt', () => {
    const inn = ":where(input[type='radio']:checked + label)";
    assert.deepEqual(transformer(inn), { selektor: inn, manuell: true });
});

test('idempotent', () => {
    for (const [, inn] of tilfeller) {
        const en = transformer(inn).selektor;
        assert.equal(transformer(en).selektor, en);
    }
});

test('bevarer formatering og nesting i en hel fil', () => {
    const css = `:where(.ix-text-field) > input,
:where(.ix-text-field__input) {
    color: red;

    &:hover {
        color: blue;
    }
}
`;
    const { css: ut } = transformerCss(css, 'test.css');
    assert.equal(
        ut,
        `.ix-text-field > :where(input),
.ix-text-field__input {
    color: red;

    &:hover {
        color: blue;
    }
}
`,
    );
});

test('--check finner ankre i :where()', () => {
    assert.equal(harAnkerIWhere(':where(.ix-button)'), true);
    assert.equal(harAnkerIWhere('.ix-button, :where(ix-grid)'), true);
    assert.equal(harAnkerIWhere('.ix-text-field > :where(input)'), false);
});
