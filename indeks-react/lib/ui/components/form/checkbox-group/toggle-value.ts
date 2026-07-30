import { useCallback, useState, type ChangeEvent, type ChangeEventHandler } from 'react';

/**
 * Legger til eller fjerner en checkbox-verdi i et `string[]` ut fra change-eventet.
 * Krysses av (`event.target.checked`) → verdien legges til (uten duplikat); krysses
 * bort → verdien filtreres ut. Ren funksjon, trygg å bruke i en state-updater.
 *
 * `CheckboxGroup.onChange` er event-basert (verdien i `event.target.value`, av/på i
 * `event.target.checked`) så `{...register()}` kan spres rett på komponenten. Prisen er
 * at kontrollerte forbrukere selv må bygge neste array — denne funksjonen er den delte
 * oppskriften, brukt både internt i `CheckboxGroup` og av forbrukere via {@link useCheckboxGroup}.
 */
export function toggleValue(prev: string[], event: ChangeEvent<HTMLInputElement>): string[] {
    const { value, checked } = event.target;
    if (checked) return prev.includes(value) ? prev : [...prev, value];
    return prev.filter((v) => v !== value);
}

/**
 * Kontrollert `CheckboxGroup`-state uten React Hook Form. Returnerer `{ value, onChange }`
 * klar til å spres på komponenten, pluss `setValue` for å styre utvalget programmatisk.
 *
 * ```tsx
 * const kontakt = useCheckboxGroup(['epost']);
 * <CheckboxGroup legend="Kontakt meg via" options={...} {...kontakt} />
 * // kontakt.value er string[] — bruk det til å vise/skjule avhengige seksjoner.
 * ```
 *
 * Bruker du RHF er dette unødvendig: spre `{...register('felt')}` og les avhengige verdier
 * med `watch('felt')`. Denne hooken er for kontrollert bruk *uten* RHF.
 */
export function useCheckboxGroup(initial: string[] = []): {
    value: string[];
    setValue: (next: string[]) => void;
    onChange: ChangeEventHandler<HTMLInputElement>;
} {
    const [value, setValue] = useState<string[]>(initial);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => setValue((prev) => toggleValue(prev, event)),
        []
    );
    return { value, setValue, onChange };
}
