import { type JSX } from 'react';
import { CheckboxGroup, type CheckboxGroupProps } from '../form/checkbox-group/CheckboxGroup';

export interface CheckboxChipGroupProps extends Omit<CheckboxGroupProps, 'variant'> {
    /** @default "md" */
    size?: 'sm' | 'md';
}

// Checkbox chip-gruppe — flere valg samtidig. Tynn wrapper over CheckboxGroup som
// låser variant="chip". All ARIA, name-propagering, tastatur og id-generering eies
// av <ix-checkbox-group>-web componenten via CheckboxGroup; her settes bare
// chip-stylingen. Bruk CheckboxChip for hvert valg.
export function CheckboxChipGroup({ size = 'md', ...props }: CheckboxChipGroupProps): JSX.Element {
    return <CheckboxGroup {...props} variant="chip" size={size} />;
}
