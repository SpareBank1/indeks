import React, { useEffect } from 'react';
import { SpacingProvider, useSpacing } from '../contexts/SpacingContext';
import Layout from './Layout';
import { SettingsPopover } from './SettingsPopover';

const BodyContent: React.FC = () => {
    const { updateSpacing } = useSpacing();
    const [fontSize, setFontSize] = React.useState(16);
    const [nativeMode, setNativeMode] = React.useState(false);

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
        bodyDiv?.classList.remove('ix-density--compact', 'ix-density--default', 'ix-density--comfortable');
        const selectedDensity = event.target.value;
        if (selectedDensity) {
            bodyDiv?.classList.add(selectedDensity);
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
        <div className="ix-body ix-density--default ix-scala-system regard-color-scheme-preference" style={{ fontSize: '16px' }}>
            <SettingsPopover
                onDensityChange={handleDensityChange}
                onFontSizeChange={handleFontSizeChange}
                onThemeChange={handleThemeChange}
                onNativeChange={setNativeMode}
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
