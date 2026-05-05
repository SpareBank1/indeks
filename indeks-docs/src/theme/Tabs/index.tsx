import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import OriginalTabs from '@theme-original/Tabs';
import type TabsType from '@theme/Tabs';
import type { ComponentProps } from 'react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import styles from './styles.module.css';

type TabsProps = ComponentProps<typeof TabsType>;

type TabItemLikeProps = { value?: string; children?: ReactNode };

// Når Tabs har groupId="variant" viser vi kun den valgte varianten —
// bruker har valgt React eller HTML globalt via preferences.
// Den ikke-valgte varianten rendres likevel med display:none slik at
// overskrifts-ankere og lenker inn i innholdet fortsatt er gyldige.
export default function Tabs(props: TabsProps) {
    const { preferences } = usePreferences();

    if (props.groupId === 'variant') {
        const children = Children.toArray(props.children);
        const rendered = children.map((child, idx) => {
            if (!isValidElement<TabItemLikeProps>(child)) return null;
            const match = child.props?.value === preferences.variant;
            const variantLabel = child.props?.value ?? `variant-${idx}`;
            return (
                <div
                    key={variantLabel}
                    className={match ? styles.active : styles.inactive}
                    aria-hidden={match ? undefined : true}
                    data-variant={variantLabel}
                >
                    {(child as ReactElement<TabItemLikeProps>).props.children}
                </div>
            );
        });
        // Hvis ingen TabItem matcher preferansen, fall tilbake til original Tabs
        // så bruker ikke står uten innhold.
        const hasMatch = children.some(
            (c) => isValidElement<TabItemLikeProps>(c) && c.props?.value === preferences.variant
        );
        if (!hasMatch) return <OriginalTabs {...props} />;
        return <>{rendered}</>;
    }

    return <OriginalTabs {...props} />;
}
