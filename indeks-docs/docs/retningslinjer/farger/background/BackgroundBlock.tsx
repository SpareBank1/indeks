import clsx from 'clsx';
import React from 'react';

interface BackgroundBlockProps {
    className: string;
    children?: React.ReactNode;
}

export const BackgroundBlock: React.FC<BackgroundBlockProps> = ({ className, children }) => {
    return (
        <tr className="ix-color-background-default ix-mb-xs">
            <td className="ix-p-0">
                <div
                    className={clsx(
                        'ix-flex ix-items-center ix-justify-center',
                        className
                    )}
                    style={{
                        width: `100px`,
                        height: `100px`,
                    }}
                >
                    {children}
                </div>
            </td>
            <td className="ix-p-sm ix-color-surface-main-default">
                <div>{className.toString()}</div>
            </td>
        </tr>
    );
};
