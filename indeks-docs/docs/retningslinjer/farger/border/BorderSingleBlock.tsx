import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';
import './border-block.css';

interface BorderSingleBlockProps {
    variant: 'default' | 'emphasis';
    className?: 'main' | 'focus';
}

export const BorderSingleBlock: React.FC<BorderSingleBlockProps> = ({ variant, className }) => {
    return (
        <tr className="ix-color-background-default">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-p-xs ix-font-size-sm',
                        'ix-mb-2xs',
                        `ix-color-surface-${variant}-default`,
                        `border-single--${className}`,
                        `border-hover--${variant}`
                    )}
                    style={{
                        width: `100px`,
                        height: `100px`,
                    }}
                >
                    {className.charAt(0).toUpperCase() + className.slice(1)}
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>
                    var(--ix-color-border-{className}-<Text as="strong">{variant}</Text>)
                </div>
            </td>
        </tr>
    );
};
