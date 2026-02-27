import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';
import './fill-block.css';

interface FillSingleBlockProps {
    variant: 'disabled' | 'read-only';
    className?: 'interactive';
    children?: React.ReactNode;
}

export const FillSingleBlock: React.FC<FillSingleBlockProps> = ({ variant, className, children }) => {
    return (
        <tr className="ix-color-background-default">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-p-xs ix-font-size-sm',
                        `ix-color-fill-${className}-${variant}`
                    )}
                    style={{
                        width: `100px`,
                        height: `100px`,
                    }}
                >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>
                    ix-color-fill-{className}-<Text as="strong">{variant}</Text>
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">{children}</td>
        </tr>
    );
};
