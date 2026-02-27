import { Text } from '@sb1/indeks-react';
import React from 'react';

interface ForegroundStatusBlockProps {
    variant: string;
    children?: React.ReactNode;
}

export const ForegroundStatusBlock: React.FC<ForegroundStatusBlockProps> = ({ variant, children }) => {
    return (
        <tr className="ix-color-background-default ix-mb-xs">
            <td className="ix-p-0">
                <div
                    className={`ix-flex ix-align-center ix-p-sm ix-font-size-sm ix-color-foreground-${variant}-default`}
                    style={{
                        width: `150px`,
                        height: `30px`,
                    }}
                >
                    <div className={`ix-color-foreground-${variant}-default`}>
                        {variant.charAt(0).toUpperCase() + variant.slice(1)} tekst
                    </div>
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>
                    ix-color-foreground-{variant}-<Text as="strong">default</Text>
                </div>
            </td>
        </tr>
    );
};
