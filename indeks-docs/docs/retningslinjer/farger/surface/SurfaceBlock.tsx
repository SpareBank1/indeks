import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';
import './surface-block.css';

interface SurfaceBlockProps {
    variant: string;
}

export const SurfaceBlock: React.FC<SurfaceBlockProps> = ({ variant }) => {
    return (
        <tr className="ix-color-background-default ix-mb-xs">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-p-xs ix-font-size-sm',
                        `ix-color-surface-${variant}-default`,
                        'surface-hover',
                        `surface-hover--${variant}`
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
                    ix-color-surface-{variant}-<Text as="strong">default</Text>
                </div>
                <div>
                    ix-color-surface-{variant}-<Text as="strong">hover</Text>
                </div>
                <div>
                    ix-color-surface-{variant}-<Text as="strong">active</Text>
                </div>
            </td>
        </tr>
    );
};
