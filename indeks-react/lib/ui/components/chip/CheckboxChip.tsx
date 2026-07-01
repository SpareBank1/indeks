import { forwardRef, type JSX } from 'react';
import { CheckboxButton, type CheckboxButtonProps } from '../form/checkbox-group/CheckboxButton';

export type CheckboxChipProps = CheckboxButtonProps;

// Ett valg i en CheckboxChipGroup. Tynn wrapper over CheckboxButton — checked/onChange
// flyter fra CheckboxGroup-context, og <ix-checkbox-group> wirer id/name/htmlFor.
// Eksisterer som egen komponent for chip-familie-gjenkjenning (jf. RadioChip).
export const CheckboxChip = forwardRef<HTMLInputElement, CheckboxChipProps>(function CheckboxChip(
    props,
    ref
): JSX.Element {
    return <CheckboxButton ref={ref} {...props} />;
});
