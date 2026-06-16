import { createContext, useContext } from 'react';

export type RadioGroupContextValue = {
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue | null {
    return useContext(RadioGroupContext);
}
