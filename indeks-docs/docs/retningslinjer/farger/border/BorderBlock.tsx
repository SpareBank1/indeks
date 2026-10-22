import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';
import './border-block.css';

interface BorderBlockProps {
    variant: string;
    level?: 'default' | 'emphasis';
}

export const BorderBlock: React.FC<BorderBlockProps> = ({ variant, level = 'default' }) => {
    // Bare main har to nivåer; statusene heter default/hover/active.
    const state = variant === 'main' ? `${level}-` : '';
    return (
        <tr className="ix-color-background-default">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-p-xs ix-font-size-sm',
                        'ix-mb-2xs',
                        `ix-color-surface-${variant}-default`,
                        'border-hover',
                        `border-hover--${variant}-${level}`
                    )}
                    style={{
                        width: `100px`,
                        height: `100px`,
                    }}
                >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} {variant === 'main' && level}
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>
                    var(--ix-color-border-{variant}-<Text as="strong">{level}</Text>)
                </div>
                <div>
                    var(--ix-color-border-{variant}-<Text as="strong">{state}hover</Text>)
                </div>
                <div>
                    var(--ix-color-border-{variant}-<Text as="strong">{state}active</Text>)
                </div>
            </td>
        </tr>
    );
};
