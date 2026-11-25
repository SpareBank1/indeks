import { useId, type HTMLAttributes, type JSX, type ReactNode, type TdHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import { useTableContext } from './TableContext';

/** `value` og `selectLabel` hører sammen: en rad som kan velges, må ha et navn. */
type TableRowSelectProps =
    | {
          /** Radens nøkkel i utvalget. Påkrevd med valg. */
          value: string;
          /** Tilgjengelig navn på valgkontrollen, f.eks. «Velg Strømleverandør». */
          selectLabel: string;
      }
    | { value?: undefined; selectLabel?: undefined };

/** `expandedContent` og `expandLabel` hører sammen: knappen som åpner, må ha et navn. */
type TableRowExpandProps =
    | {
          /** Innholdet som vises når raden ekspanderes. */
          expandedContent: ReactNode;
          /** Tilgjengelig navn på ekspanderingsknappen, f.eks. «Vis detaljer for Boliglån». */
          expandLabel: string;
          /** Åpen ved start. Web componenten eier tilstanden etterpå. */
          defaultExpanded?: boolean;
      }
    | { expandedContent?: undefined; expandLabel?: undefined; defaultExpanded?: undefined };

export type TableRowProps = TableRowSelectProps &
    TableRowExpandProps & {
        /** `Table.Cell` per kolonne. */
        children: ReactNode;
    } & Omit<HTMLAttributes<HTMLTableRowElement>, 'children'>;

/**
 * En rad. Med valg eller ekspandering får den kontrollen i første kolonne, og
 * klikk på raden aktiverer den.
 */
export function TableRow({
    value,
    selectLabel,
    expandedContent,
    expandLabel,
    defaultExpanded = false,
    children,
    ...rest
}: TableRowProps): JSX.Element {
    const { variant, selectedKeys, name } = useTableContext();
    const controlId = useId();
    const selectable = variant === 'multi-select' || variant === 'single-select';
    const expandable = variant === 'expandable' && expandedContent != null;

    return (
        <>
            <tr {...rest}>
                {selectable && (
                    <td className="ix-table__control">
                        <div className={variant === 'multi-select' ? 'ix-checkbox' : 'ix-radio'}>
                            {/* Startverdi. Web componenten eier checked etterpå, også når raden rendres på nytt. */}
                            <input
                                type={variant === 'multi-select' ? 'checkbox' : 'radio'}
                                id={controlId}
                                name={name}
                                value={value}
                                defaultChecked={value !== undefined && selectedKeys.has(value)}
                            />
                            <label htmlFor={controlId}>
                                <span className="ix-sr-only">{selectLabel}</span>
                            </label>
                        </div>
                    </td>
                )}
                {variant === 'expandable' && (
                    <td className="ix-table__control">
                        {expandable && (
                            <button
                                type="button"
                                className="ix-table__expand"
                                aria-expanded={defaultExpanded ? 'true' : 'false'}
                                aria-label={expandLabel}
                            >
                                <Icon name="keyboard_arrow_down" size="sm" />
                            </button>
                        )}
                    </td>
                )}
                {children}
            </tr>
            {expandable && (
                <tr className="ix-table__expanded" hidden={!defaultExpanded}>
                    <td>
                        <div className="ix-table__expanded-content">{expandedContent}</div>
                    </td>
                </tr>
            )}
        </>
    );
}

export type TableCellProps = {
    /** Beskrivende tekst under innholdet, f.eks. et kontonummer. */
    description?: ReactNode;
    /** Overstyrer kolonnens justering for denne cellen. */
    align?: 'start' | 'end';
    /** Cellen er overskrift for raden (`<th scope="row">`). */
    rowHeader?: boolean;
    children?: ReactNode;
} & Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'children'>;

/** En celle. Justeringen arves fra kolonnens `Table.HeaderCell`. */
export function TableCell({ description, align, rowHeader = false, children, ...rest }: TableCellProps): JSX.Element {
    const Tag = rowHeader ? 'th' : 'td';
    return (
        <Tag scope={rowHeader ? 'row' : undefined} data-align={align} {...rest}>
            {children}
            {description != null && <span className="ix-table__description">{description}</span>}
        </Tag>
    );
}
