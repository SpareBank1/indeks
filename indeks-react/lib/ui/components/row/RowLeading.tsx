import { cn } from '../../../cn';
import type { JSX, ReactNode } from 'react';
import { Icon } from '../../icons';
import type { IconName } from '../../icons/icon-types';

export type RowLeadingProps = { className?: string } & (
    | {
          variant: 'icon';
          icon: IconName;
          badgeIcon?: never;
          src?: never;
          alt?: never;
      }
    | {
          variant: 'icon-background';
          icon: IconName;
          /** Lite ikon nede til høyre, f.eks. `group` for en delt konto. Dekorativt. */
          badgeIcon?: IconName;
          src?: never;
          alt?: never;
      }
    | {
          variant: 'illustration' | 'image';
          src: string;
          /** Påkrevd. Bruk `alt=""` når bildet bare er pynt. */
          alt: string;
          icon?: never;
          badgeIcon?: never;
      }
);

/** Ikon, ikon på flate, illustrasjon eller bilde foran innholdet. Ikonene er dekorative. */
export function RowLeading(props: RowLeadingProps): JSX.Element {
    let content: ReactNode;
    if (props.variant === 'icon' || props.variant === 'icon-background') {
        content = (
            <>
                <Icon name={props.icon} aria-hidden />
                {props.variant === 'icon-background' && props.badgeIcon && (
                    <span className="ix-row__leading-badge">
                        <Icon name={props.badgeIcon} aria-hidden />
                    </span>
                )}
            </>
        );
    } else {
        content = <img src={props.src} alt={props.alt} />;
    }
    return (
        <span className={cn('ix-row__leading', props.className)} data-variant={props.variant}>
            {content}
        </span>
    );
}
