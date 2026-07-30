// Delt form for de syntetiske change/blur-eventene som form-komponentene sender når
// de IKKE kan videresende et ekte DOM-event. To komponenter trenger dette:
//  - Combobox: verdien leses fra aria-selected på options — det finnes ingen native
//    input å videresende fra (og et ekte <select>-event ville lurt RHF, se Combobox).
//  - TextField (formatter-modus): den synlige inputen viser formatert tekst og er døpt
//    om til `${name}_formatted`, så et ekte event ville gitt feil target.value/name.
// RadioGroup/CheckboxGroup bruker IKKE dette — de sender ekte native events fra ekte
// <input>-elementer og trenger ingen stand-in.
//
// Hvorfor én felles form: React Hook Form leser kun `target.value` og `target.name`,
// så alle variantene virker med RHF i dag. Men enhver annen konsument som rører
// `currentTarget`, `nativeEvent`, `preventDefault()` e.l. i én delt handler så tidligere
// ulik oppførsel per felt (Combobox manglet f.eks. `value` på blur). Denne helperen gir
// samtlige felt samme form, og nye felt (f.eks. planlagt PhoneNumberField som komponerer
// Combobox) arver den gratis.
//
// VIKTIG: `target` har bevisst INGEN `type`-nøkkel. RHF sin `getEventValue` sjekker
// `event.target.type === 'checkbox'/'radio'` — et target som ligner en native input-type
// får RHF til å lese fra ref-en i stedet for `target.value`. Event-nivå `type` er trygt.

export type SyntheticFieldTarget<T> = {
    name: string;
    value: T;
    /** Kun satt der komponenten har en meningsfull input-id (TextField). */
    id?: string;
};

/**
 * React-lignende stand-in for et change/blur-event. `T` er verdien: `string` for de
 * fleste felt, `string | string[]` for Combobox (single/multi). `nativeEvent` er det
 * ekte DOM-eventet der ett finnes (TextField/Combobox har det), ellers `null`.
 */
export type SyntheticFieldEvent<T = string> = {
    target: SyntheticFieldTarget<T>;
    currentTarget: SyntheticFieldTarget<T>;
    type: string;
    nativeEvent: Event | null;
    preventDefault(): void;
    stopPropagation(): void;
    persist(): void;
};

/**
 * Bygger et {@link SyntheticFieldEvent}. `target.name` faller tilbake til `''` (RHF
 * bruker det til feltoppslag), og `currentTarget` peker på samme target-objekt som
 * `target` (som en boblet React-event der ingen re-target har skjedd).
 */
export function createFieldEvent<T>(
    type: string,
    target: { name?: string; value: T; id?: string },
    nativeEvent: Event | null = null
): SyntheticFieldEvent<T> {
    const resolved: SyntheticFieldTarget<T> = { name: target.name ?? '', value: target.value };
    if (target.id !== undefined) resolved.id = target.id;
    return {
        target: resolved,
        currentTarget: resolved,
        type,
        nativeEvent,
        preventDefault() {},
        stopPropagation() {},
        persist() {},
    };
}
