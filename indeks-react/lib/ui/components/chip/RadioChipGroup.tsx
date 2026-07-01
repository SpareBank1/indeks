import { type JSX } from 'react';
import { RadioGroup, type RadioGroupProps } from '../form/radio-group/RadioGroup';

export interface RadioChipGroupProps extends Omit<RadioGroupProps, 'variant' | 'orientation'> {
    /** @default "md" */
    size?: 'sm' | 'md';
}

// Radio chip-gruppe — kun ett valg om gangen. Tynn wrapper over RadioGroup som
// låser variant="chip". All ARIA, name-synkronisering, tastatur og id-generering
// eies av <ix-radio-group>-web componenten via RadioGroup; her settes bare
// chip-stylingen. Bruk RadioChip for hvert valg.
export function RadioChipGroup({ size = 'md', ...props }: RadioChipGroupProps): JSX.Element {
    return <RadioGroup {...props} variant="chip" size={size} />;
}
