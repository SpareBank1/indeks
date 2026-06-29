import { createContext, useContext } from 'react';

export type CheckboxGroupContextValue = {
    name?: string;
    value?: string[];
    onChange?: (value: string, checked: boolean) => void;
};

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
    return useContext(CheckboxGroupContext);
}
