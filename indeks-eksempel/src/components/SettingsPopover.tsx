import { Icon, VStack } from '@sb1/indeks-react';
import React, { useEffect, useRef, useState } from 'react';

interface SettingsPopoverProps {
    onDensityChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onFontSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onThemeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onNativeChange: (enabled: boolean) => void;
    fontSize: number;
    nativeMode: boolean;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
    onDensityChange,
    onFontSizeChange,
    onThemeChange,
    onNativeChange,
    fontSize,
    nativeMode,
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    return (
        <div className="settings-popover-wrapper" ref={wrapperRef}>
            <button
                className="settings-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Innstillinger"
            >
                <Icon materialDesignName="settings" />
            </button>

            {open && (
                <div className="settings-popover">
                    <VStack gap="md">
                        <label htmlFor="sizeDropdown">
                            Density:
                            <select
                                id="sizeDropdown"
                                className="ix-border-default"
                                defaultValue="ix-density--default"
                                onChange={onDensityChange}
                            >
                                <option value="ix-density--compact">Compact</option>
                                <option value="ix-density--default">Default</option>
                                <option value="ix-density--comfortable">Comfortable</option>
                            </select>
                        </label>

                        <label htmlFor="fontSizeSlider">
                            Font size:
                            <input
                                id="fontSizeSlider"
                                type="range"
                                min="14"
                                max="32"
                                step="1"
                                value={fontSize}
                                onChange={onFontSizeChange}
                                style={{ width: '80px' }}
                            />
                            <span style={{ minWidth: '36px', fontSize: '14px' }}>{fontSize}px</span>
                        </label>

                        <label htmlFor="theme">
                            Theme:
                            <select
                                id="theme"
                                className="ix-border-default"
                                defaultValue="sb1"
                                onChange={onThemeChange}
                            >
                                <option value="sb1">SpareBank 1</option>
                                <option value="kredittbanken">Kredittbanken</option>
                                <option value="bnbank">BN Bank</option>
                                <option value="lofavor">LO Favør</option>
                                <option value="coop">Coop</option>
                                <option value="sbm">SBM</option>
                            </select>
                        </label>

                        <label htmlFor="nativeToggle">
                            <input
                                id="nativeToggle"
                                type="checkbox"
                                checked={nativeMode}
                                onChange={(e) => onNativeChange(e.target.checked)}
                            />
                            Native-modus
                        </label>
                    </VStack>
                </div>
            )}
        </div>
    );
};
