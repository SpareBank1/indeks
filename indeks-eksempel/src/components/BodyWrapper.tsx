import React, { useEffect } from 'react';
import { ColorOverrideProvider, useColorOverrides } from '../contexts/ColorOverrideContext';
import { SpacingProvider, useSpacing } from '../contexts/SpacingContext';
import Layout from './Layout';
import { SettingsPopover } from './SettingsPopover';

const THEME_STORAGE_KEY = 'indeks-eksempel-theme';
const THEME_LINK_ID = 'active-theme-stylesheet';

const BodyContent: React.FC = () => {
    const { updateSpacing } = useSpacing();
    const { resetColors } = useColorOverrides();
    const [fontSize, setFontSize] = React.useState(16);
    const [nativeMode, setNativeMode] = React.useState(false);
    const [theme, setTheme] = React.useState(() => localStorage.getItem(THEME_STORAGE_KEY) ?? 'sb1');

    useEffect(() => {
        if (nativeMode) {
            document.body.classList.add('ix-native');
        } else {
            document.body.classList.remove('ix-native');
        }
    }, [nativeMode]);

    // Behold valgt theme på tvers av sidebytte og reload: bruk én styrt <link>
    // og persistér valget i localStorage.
    useEffect(() => {
        let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement('link');
            link.id = THEME_LINK_ID;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `./themes/${theme}.css`;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    const handleDensityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const bodyDiv = document.getElementsByClassName('ix-body')[0];
        const selectedDensity = event.target.value;
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
                onResetColors={resetColors}
                fontSize={fontSize}
                nativeMode={nativeMode}
                theme={theme}
            />
            <Layout />
        </div>
    );
};

const BodyWrapper: React.FC = () => {
    return (
        <SpacingProvider>
            <ColorOverrideProvider>
                <BodyContent />
            </ColorOverrideProvider>
        </SpacingProvider>
    );
};

export default BodyWrapper;
