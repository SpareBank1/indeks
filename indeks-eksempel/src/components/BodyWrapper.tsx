import React, { useEffect } from 'react';
import { SpacingProvider, useSpacing } from '../contexts/SpacingContext';
import Layout from './Layout';
import { SettingsPopover } from './SettingsPopover';

const BodyContent: React.FC = () => {
    const { updateSpacing } = useSpacing();
    const [fontSize, setFontSize] = React.useState(16);
    const [nativeMode, setNativeMode] = React.useState(false);
    const [density, setDensity] = React.useState('default');

    useEffect(() => {
        if (nativeMode) {
            document.body.classList.add('ix-native');
        } else {
            document.body.classList.remove('ix-native');
        }
    }, [nativeMode]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const style = document.createElement('link');
        style.setAttribute('href', `./themes/${event.target.value}.css`);
        style.setAttribute('rel', 'stylesheet');
        document.head.appendChild(style);
    };

    const handleDensityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const bodyDiv = document.getElementsByClassName('ix-body')[0];
        const selectedDensity = event.target.value;
        setDensity(selectedDensity);
        if (selectedDensity) {
            (bodyDiv as HTMLElement)?.setAttribute('data-density', selectedDensity);
        } else {
            (bodyDiv as HTMLElement)?.removeAttribute('data-density');
        }
        setTimeout(() => {
            updateSpacing();
        }, 50);
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFontSize = parseInt(event.target.value);
        setFontSize(newFontSize);
        document.documentElement.style.fontSize = `${newFontSize}px`;
        setTimeout(() => {
            updateSpacing();
        }, 50);
    };

    return (
        <div className="ix-body ix-scala-system regard-color-scheme-preference" data-density="default" style={{ fontSize: '16px' }}>
            <SettingsPopover
                onDensityChange={handleDensityChange}
                onFontSizeChange={handleFontSizeChange}
                onThemeChange={handleThemeChange}
                onNativeChange={setNativeMode}
                density={density}
                fontSize={fontSize}
                nativeMode={nativeMode}
            />
            <Layout />
        </div>
    );
};

const BodyWrapper: React.FC = () => {
    return (
        <SpacingProvider>
            <BodyContent />
        </SpacingProvider>
    );
};

export default BodyWrapper;
