import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';

interface ForegroundBlockProps {
    variant: string;
    contrast?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export const ForegroundBlock: React.FC<ForegroundBlockProps> = ({ variant, contrast, children, className }) => {
    return (
        <tr className="ix-color-background-default ix-mb-xs">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-align-center ix-p-xs',
                        { className },
                        { ['ix-color-fill-main-default']: contrast }
                    )}
                    style={{
                        width: `150px`,
                        height: `100px`,
                    }}
                >
                    <Text size="sm" className={className}>
                        {variant} tekst
                    </Text>
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>{className}</div>
            </td>
            <td className="ix-w-sm">{children}</td>
        </tr>
    );
};
