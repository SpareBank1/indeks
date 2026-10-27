import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lesAllowliste, sjekkCss, sjekkSelektor, splittSelektorer } from './check-css-selektorer.ts';

test('selektorer som følger regelen, gir ingen brudd', () => {
    for (const s of [
        '.ix-checkbox input:checked + label',
        ":is(ix-radio-group, .ix-radio-group)[data-variant='chip'][data-state='readonly'] input + label",
        '.ix-modal__title',
        '.ix-modal__actions > *',
        ':is(.ix-a, .ix-b):hover',
        "input[type='checkbox']",
    ]) {
        assert.deepEqual(sjekkSelektor(s), [], s);
    }
});

test(':where() gir brudd', () => {
    assert.deepEqual(sjekkSelektor(':where(.ix-button)'), ['where']);
    assert.deepEqual(sjekkSelektor('.ix-text-field > :where(input)'), ['where']);
});

test('BEM-modifier gir brudd, men ikke -- inni en attributtverdi', () => {
    assert.deepEqual(sjekkSelektor('.ix-table--sm td'), ['modifier']);
    assert.deepEqual(sjekkSelektor('.ix-link-text--no-underline:hover'), ['modifier']);
    assert.deepEqual(sjekkSelektor(".ix-x[data-variant='a--b']"), []);
    assert.deepEqual(sjekkSelektor('.ix-modal__title'), []);
});

test('[type] på input inni en komponent gir brudd', () => {
    assert.deepEqual(sjekkSelektor(".ix-checkbox input[type='checkbox']:checked + label"), ['type']);
    assert.deepEqual(sjekkSelektor('ix-radio-group input[type="radio"]'), ['type']);
    assert.deepEqual(sjekkSelektor(".ix-text-field input[type='text']"), []);
});

test('én selektor kan bryte flere regler', () => {
    assert.deepEqual(sjekkSelektor(":where(.ix-radio--disabled) input[type='radio']"), ['where', 'modifier', 'type']);
});

test('selektorlister splittes bare på toppnivå', () => {
    assert.deepEqual(splittSelektorer(":is(.a, .b) > c, .d[data-x='e, f']"), [':is(.a, .b) > c', ".d[data-x='e, f']"]);
});

test('sjekkCss gir linjenummer per selektor og hopper over keyframes', () => {
    const css = `.ix-ok {}\n\n:where(.ix-a),\n.ix-b--c {}\n@keyframes spinn { from {} to {} }\n`;
    assert.deepEqual(
        sjekkCss(css, 'x.css').map((b) => [b.linje, b.regel]),
        [
            [3, 'where'],
            [3, 'modifier'],
        ],
    );
});

test('allowlisten tåler kommentarer og blanke linjer', () => {
    assert.deepEqual(lesAllowliste('# gruppe\na.css\n\n  b.css  # kommentar\n'), ['a.css', 'b.css']);
});
