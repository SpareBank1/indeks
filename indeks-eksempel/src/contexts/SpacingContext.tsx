import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface SpacingContextType {
    resolvedSpacing: { [key: string]: string };
    updateSpacing: () => void;
    isLoading: boolean;
}

const SpacingContext = createContext<SpacingContextType | undefined>(undefined);

export const useSpacing = () => {
    const context = useContext(SpacingContext);
    if (!context) {
        throw new Error('useSpacing must be used within a SpacingProvider');
    }
    return context;
};

export const spacingVars = [
    // Padding left
    'ix-pl-2xs',
    'ix-pl-xs',
    'ix-pl-sm',
    'ix-pl-md',
    'ix-pl-lg',
    'ix-pl-xl',
    'ix-pl-2xl',
    'ix-pl-3xl',
    'ix-pl-4xl',
    // General padding
    'ix-p-2xs',
    'ix-p-xs',
    'ix-p-sm',
    'ix-p-md',
    'ix-p-lg',
    'ix-p-xl',
    'ix-p-2xl',
    'ix-p-3xl',
    'ix-p-4xl',
    //margin bottom
    'ix-mb-2xs',
    'ix-mb-xs',
    'ix-mb-sm',
    'ix-mb-md',
    'ix-mb-lg',
    'ix-mb-xl',
    'ix-mb-2xl',
    'ix-mb-3xl',
    'ix-mb-4xl',
    // gap
    'ix-gap-2xs',
    'ix-gap-xs',
    'ix-gap-sm',
    'ix-gap-md',
    'ix-gap-lg',
    'ix-gap-xl',
    'ix-gap-2xl',
    'ix-gap-3xl',
    'ix-gap-4xl',
];

interface SpacingProviderProps {
    children: React.ReactNode;
}

export const SpacingProvider: React.FC<SpacingProviderProps> = ({ children }) => {
    console.log('SpacingProvider rendered');
    const [resolvedSpacing, setResolvedSpacing] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    const getResolvedSpacingValue = useCallback((variableName: string): string => {
        const element = document.getElementsByClassName(variableName)[0];
        if (element) {
            if (variableName.startsWith('ix-mb-')) {
                const marginBottom = getComputedStyle(element).marginBottom;
                const numMarginBottom = parseFloat(marginBottom);
                return `${Math.round(numMarginBottom)}px`;
            } else if (variableName.startsWith('ix-gap-')) {
                const gap = getComputedStyle(element).gap;
                const numGap = parseFloat(gap);
                return `${Math.round(numGap)}px`;
            } else {
                const width = getComputedStyle(element).width;
                const numWidth = parseFloat(width);
                return `${Math.round(numWidth)}px`;
            }
        }
        return '0px';
    }, []);

    const updateSpacing = useCallback(() => {
        setIsLoading(true);

        // Use requestAnimationFrame to ensure DOM updates are complete
        requestAnimationFrame(() => {
            const values: { [key: string]: string } = {};
            spacingVars.forEach((utilClass) => {
                values[utilClass] = getResolvedSpacingValue(utilClass);
            });
            setResolvedSpacing(values);
            setIsLoading(false);
        });
    }, [getResolvedSpacingValue]);

    useEffect(() => {
        // Initial update
        updateSpacing();

        // Listen for window resize
        const handleResize = () => {
            updateSpacing();
        };

        // Listen for class changes on document element (for mode switching)
        const handleClassChange = () => {
            updateSpacing();
        };

        // Create a MutationObserver to watch for class changes on documentElement
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    handleClassChange();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [updateSpacing]);

    const value: SpacingContextType = {
        resolvedSpacing,
        updateSpacing,
        isLoading,
    };

    return <SpacingContext.Provider value={value}>{children}</SpacingContext.Provider>;
};

export default SpacingContext;
