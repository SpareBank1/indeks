import { type ReactNode } from 'react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

export function MobilbankOnly({ children, fallback = null }: Props) {
    const { preferences } = usePreferences();
    if (!preferences.mobilbank) return <>{fallback}</>;
    return <>{children}</>;
}

export default MobilbankOnly;
