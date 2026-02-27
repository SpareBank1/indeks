import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';
import './fill-block.css';

interface FillBlockProps {
    variant: string;
    strength?: 'default' | 'subtle' | '';
    children?: React.ReactNode;
}

export const FillBlock: React.FC<FillBlockProps> = ({ variant, strength = 'default', children }) => {
    return (
        <tr className="ix-color-background-default ix-mb-xs">
            <td
                className="ix-p-0"
                style={{
                    width: `100px`,
                    height: `100px`,
                }}
            >
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-p-xs ix-font-size-sm',
                        `ix-color-fill-${variant}-${strength === '' ? 'default' : strength}`,
                        'fill-hover',
                        `fill-hover${strength === '' ? '' : '-'}${strength}--${variant}`,
                        strength === 'default' && 'ix-color-foreground-inverse-default'
                    )}
                    style={{
                        width: `100px`,
                        height: `100px`,
                    }}
                >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    {strength !== '' && strength !== 'default' ? ` - ${strength.charAt(0).toUpperCase() + strength.slice(1)}` : ''}
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default" style={{ minWidth: '20vw' }}>
                <div>
                    ix-color-fill-{variant}
                    {strength !== '' && strength !== 'default' ? `-${strength}` : ''}-<Text as="strong">default</Text>
                </div>
                <div>
                    ix-color-fill-{variant}
                    {strength !== '' && strength !== 'default' ? `-${strength}` : ''}-<Text as="strong">hover</Text>
                </div>
                <div>
                    ix-color-fill-{variant}
                    {strength !== '' && strength !== 'default' ? `-${strength}` : ''}-<Text as="strong">active</Text>
                </div>
            </td>
            {children && <td className="ix-p-sm ix-color-surface-main-default">{children}</td>}
        </tr>
    );
};
