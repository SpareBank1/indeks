import { useCallback, useEffect, useRef, useState } from 'react';

export type ComponentType = 'form';

export function useFocus<T extends HTMLElement = HTMLInputElement>() {
    const [isFocused, setIsFocused] = useState(false);
    const focusOrigin = useRef<'mouse' | 'keyboard' | null>(null);
    const elementRef = useRef<T>(null);

    const getFocusClasses = useCallback(
        (componentType: ComponentType) => {
            return {
                [`indeks-focus--${componentType}`]: isFocused,
                'indeks-focus--outline': isFocused && focusOrigin.current === 'keyboard',
            };
        },
        [isFocused]
    );

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseDown = () => {
            focusOrigin.current = 'mouse';
        };

        const handleFocus = () => {
            setIsFocused(true);
            // If no mouse down was registered, it's likely keyboard focus
            if (focusOrigin.current !== 'mouse') {
                focusOrigin.current = 'keyboard';
            }
        };

        const handleBlur = () => {
            setIsFocused(false);
            focusOrigin.current = null;
        };

        document.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('focus', handleFocus);
        element.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('focus', handleFocus);
            element.removeEventListener('blur', handleBlur);
        };
    }, []);

    return {
        ref: elementRef,
        getFocusClasses,
        focusOrigin: focusOrigin.current,
        isFocused,
    };
}
