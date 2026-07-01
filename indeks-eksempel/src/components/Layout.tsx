import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { SubMenu } from './SubMenu';

export default function Layout() {
    const location = useLocation();
    const [activeArea, setActiveArea] = useState<'eksempelsider' | 'internTesting'>(
        location.pathname.includes('/eksempelsider') ? 'eksempelsider' : 'internTesting'
    );

    const examplePageMenuItems = [
        { path: 'oversikt', label: 'Oversikt' },
        { path: 'betaling', label: 'Betaling' },
        { path: 'betal', label: 'Betal' },
    ];

    const internalTestingMenuItems = [
        { path: 'oversikt', label: 'Oversikt' },
        { path: 'spacing-eksempler', label: 'Spacing-eksempler' },
        { path: 'responsiv-layout', label: 'Responsiv layout' },
        { path: 'spacing-responsiv', label: 'Responsiv spacing' },
        { path: 'grid-komponent', label: 'Grid-komponent' },
        { path: 'typografi-eksempler', label: 'Typografi-eksempler' },
        { path: 'fargeskalaer-eksempler', label: 'Fargeskalaer' },
    ];

    return (
        <div className="">
            <nav className="ix-stack-horizontal ix-color-surface-main-default ix-p-md ix-border-bottom-default ix-gap-md">
                <Header activeArea={activeArea} setActiveArea={setActiveArea} />
                {activeArea === 'eksempelsider' && (
                    <SubMenu menuItems={examplePageMenuItems} basePath="/eksempelsider" />
                )}
                {activeArea === 'internTesting' && (
                    <SubMenu menuItems={internalTestingMenuItems} basePath="/internTesting" />
                )}
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
