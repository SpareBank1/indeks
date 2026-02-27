import { HStack } from '@sb1/indeks-react';
import React from 'react';
import { SpacingProvider, useSpacing } from '../contexts/SpacingContext';
import Layout from './Layout';

const BodyContent: React.FC = () => {
    const { updateSpacing } = useSpacing();
    const [fontSize, setFontSize] = React.useState(16);

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

        //document.documentElement.style.setProperty('--ix-base-font-size', `${newFontSize}px`);

        document.documentElement.style.fontSize = `${newFontSize}px`;

        setTimeout(() => {
            updateSpacing();
        }, 50);
    };
    return (
        <div className="ix-body ix-density--default ix-scala-system regard-color-scheme-preference" style={{ fontSize: '16px' }}>
            <HStack className="ix-gap-lg ix-p-md ix-border-bottom-default" justifyContent="center">
                <HStack className="ix-gap-sm" alignItems="center">
                    <label htmlFor="sizeDropdown">Density:</label>
                    <select
                        id="sizeDropdown"
                        className="size-dropdown ix-border-default"
                        defaultValue="ix-density--default"
                        onChange={handleDensityChange}
                    >
                        <option value="ix-density--compact">Compact</option>
                        <option value="ix-density--default">Default</option>
                        <option value="ix-density--comfortable">Comfortable</option>
                    </select>
                </HStack>
                <HStack className="ix-gap-sm" alignItems="center">
                    <label htmlFor="fontSizeSlider">Base font size:</label>
                    <input
                        id="fontSizeSlider"
                        type="range"
                        min="14"
                        max="32"
                        step="1"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        style={{ width: '120px' }}
                    />
                    <span style={{ minWidth: '40px', fontSize: '14px' }}>{fontSize}px</span>
                </HStack>
                <HStack className="ix-gap-sm" alignItems="center">
                    <label htmlFor="theme">Theme:</label>
                    <select
                        id="theme"
                        className="theme-dropdown ix-border-default"
                        defaultValue="sb1"
                        onChange={handleThemeChange}
                    >
                        <option value="sb1">SpareBank 1</option>
                        <option value="kredittbanken">Kredittbanken</option>
                        <option value="bnbank">BN Bank</option>
                        <option value="lofavor">LO Favør</option>
                        <option value="coop">Coop</option>
                        <option value="sbm">SBM</option>
                    </select>
                </HStack>
            </HStack>
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
