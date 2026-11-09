import type { JSX, ReactNode } from 'react';

export type RowTrailingLabelProps = {
    /** Verdien, f.eks. et beløp. */
    label: ReactNode;
    subtitle?: ReactNode;
    /** En `<Tag>` under verdien. Kan stå sammen med subtitle, men én av dem er som regel nok. */
    tag?: ReactNode;
};

/** Verdi med valgfri subtitle eller Tag, høyrejustert. */
export function RowTrailingLabel({ label, subtitle, tag }: RowTrailingLabelProps): JSX.Element {
    return (
        <>
            <span className="ix-row__trailing-label">{label}</span>
            {subtitle && <span className="ix-row__trailing-subtitle">{subtitle}</span>}
            {tag}
        </>
    );
}
