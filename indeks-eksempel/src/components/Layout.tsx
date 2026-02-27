import { HStack } from '@sb1/indeks-react';
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
        { path: 'typografi-eksempler', label: 'Typografi-eksempler' },
        { path: 'fargeskalaer-eksempler', label: 'Fargeskalaer' },
    ];

    return (
        <div className="">
            <HStack as="nav" surfaceColor="main" padding="md" gap="md" className="ix-border-bottom-default">
                <Header activeArea={activeArea} setActiveArea={setActiveArea} />
                {activeArea === 'eksempelsider' && (
                    <SubMenu menuItems={examplePageMenuItems} basePath="/eksempelsider" />
                )}
                {activeArea === 'internTesting' && (
                    <SubMenu menuItems={internalTestingMenuItems} basePath="/internTesting" />
                )}
            </HStack>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
