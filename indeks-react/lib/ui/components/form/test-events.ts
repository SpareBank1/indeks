import type { Mock } from 'vitest';

// Delt test-hjelper for de event-baserte form-handlerne (onChange/onBlur). Alle
// form-feltene rapporterer via et event der verdien ligger i `target.value` — noen
// ekte DOM-events (RadioGroup/CheckboxGroup), noen syntetiske (Combobox/TextField, se
// `synthetic-events.ts`). Testene plukket eventet ut med `mock.calls[0][0]` /
// `mock.lastCall![0]`, som er kryptisk. Disse to leser det samme, men med lesbart navn.
//
// Kun for test — importeres aldri fra library-kode (holdes ute av bundle og .d.ts).

type FieldEventLike = {
    type: string;
    target: { name: string; value: unknown; checked?: boolean };
};

/** Første event en spy-handler ble kalt med (typisk «kalt én gang»-asserter). */
export function firstEvent<E = FieldEventLike>(mock: Mock): E {
    return mock.mock.calls[0][0] as E;
}

/** Siste event en spy-handler ble kalt med (typisk «etter flere endringer»-asserter). */
export function lastEvent<E = FieldEventLike>(mock: Mock): E {
    return mock.mock.lastCall![0] as E;
}
