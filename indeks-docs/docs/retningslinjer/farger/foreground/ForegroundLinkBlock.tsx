import { Text } from '@sb1/indeks-react';
import clsx from 'clsx';
import React from 'react';

export const ForegroundLinkBlock: React.FC = () => {
    return (
        <table>
            <tbody>
                <tr className="ix-color-background-default ix-mb-xs">
                    <td className="ix-p-0">
                        <div
                            className={clsx(
                                'ix-flex ix-flex-col ix-p-sm ix-justify-center',
                                `ix-color-foreground-link-default`
                            )}
                            style={{
                                width: `150px`,
                                height: `30px`,
                            }}
                        >
                            <div className={`ix-color-foreground-link-default`}>Default tekst</div>
                        </div>
                    </td>
                    <td className="ix-p-sm ix-color-surface-main-default">
                        <div>
                            ix-color-foreground-link-<Text as="strong">default</Text>
                        </div>
                    </td>
                </tr>
                <tr className="ix-color-background-default ix-mb-xs">
                    <td className="ix-p-0">
                        <div
                            className={clsx(
                                'ix-flex ix-flex-col ix-p-sm ix-justify-center',
                                `ix-color-foreground-link-hover`
                            )}
                            style={{
                                width: `150px`,
                                height: `30px`,
                            }}
                        >
                            <div style={{ color: 'var(--ix-color-foreground-link-hover)' }}>Hover tekst</div>
                        </div>
                    </td>
                    <td className="ix-p-sm ix-color-surface-main-default">
                        <div>
                            ix-color-foreground-link-<Text as="strong">hover</Text>
                        </div>
                    </td>
                </tr>
                <tr className="ix-color-background-default ix-mb-xs">
                    <td className="ix-p-0">
                        <div
                            className={clsx(
                                'ix-flex ix-flex-col ix-p-sm ix-justify-center',
                                `ix-color-foreground-link-active`
                            )}
                            style={{
                                width: `150px`,
                                height: `30px`,
                            }}
                        >
                            <div style={{ color: 'var(--ix-color-foreground-link-active)' }}>Active tekst</div>
                        </div>
                    </td>
                    <td className="ix-p-sm ix-color-surface-main-default">
                        <div>
                            ix-color-foreground-link-<Text as="strong">active</Text>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
