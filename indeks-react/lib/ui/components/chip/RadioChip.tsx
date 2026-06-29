import { forwardRef, type JSX } from 'react';
import { RadioButton, type RadioButtonProps } from '../form/radio-group/RadioButton';

export type RadioChipProps = RadioButtonProps;

// Ett valg i en RadioChipGroup. Tynn wrapper over RadioButton — checked/onChange
// flyter fra RadioGroup-context, og <ix-radio-group> wirer id/name/htmlFor.
// Eksisterer som egen komponent for chip-familie-gjenkjenning (jf. Chip / RemovableChip).
export const RadioChip = forwardRef<HTMLInputElement, RadioChipProps>(function RadioChip(
    props,
    ref
): JSX.Element {
    return <RadioButton ref={ref} {...props} />;
});
