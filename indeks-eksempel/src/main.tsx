import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
// Registrerer alle ix-* custom elements fra lokal indeks-web (via vite-alias),
// slik at eksempelappen alltid kjører repoets nåværende WC-kode i stedet for en
// pinnet CDN-versjon. Må importeres før React rendrer så elementene er definert.
import '@sb1/indeks-web';
import './index.css';

import BodyWrapper from './components/BodyWrapper';
import { ErrorBoundary } from './components/ErrorBoundary';
import OpenPagesWrapper from './components/OpenPagesWrapper';
import FargeskalaerEksempler from './pages/openPages/FargeskalaerEksempler';
import FormValidering from './pages/openPages/FormValidering';
import OpenPagesOverview from './pages/openPages/Oversikt';
import ResponsivLayout from './pages/openPages/ResponsivLayout';
import ResponsivSpacing from './pages/openPages/ResponsivSpacing';
import SpacingEksempler from './pages/openPages/SpacingEksempler';
import TypografiEksempler from './pages/openPages/TypografiEksempler';
import PMBetaling from './pages/pm/betaling/Betaling';
import PMOversikt from './pages/pm/oversikt/Oversikt';
import PMRegistrerBetaling from './pages/pm/RegistrerBetaling';
import PMWrapper from './pages/pm/Wrapper';
import GridKomponent from './pages/openPages/GridKomponent';

const router = createHashRouter([
    {
        element: <BodyWrapper />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                path: '',
                element: <PMWrapper />,
            },
            {
                path: 'eksempelsider',
                element: <PMWrapper />,
                children: [
                    {
                        path: 'oversikt',
                        element: <PMOversikt />,
                    },
                    {
                        path: 'betaling',
                        element: <PMBetaling />,
                    },
                    {
                        path: 'betal',
                        element: <PMRegistrerBetaling />,
                    },
                ],
            },
            {
                path: 'internTesting',
                element: <OpenPagesWrapper />,
                children: [
                    {
                        path: 'oversikt',
                        element: <OpenPagesOverview />,
                    },
                    {
                        path: 'spacing-eksempler',
                        element: <SpacingEksempler />,
                    },
                    {
                        path: 'responsiv-layout',
                        element: <ResponsivLayout />,
                    },
                    {
                        path: 'spacing-responsiv',
                        element: <ResponsivSpacing />,
                    },
                    {
                        path: 'grid-komponent',
                        element: <GridKomponent />,
                    },
                    {
                        path: 'typografi-eksempler',
                        element: <TypografiEksempler />,
                    },
                    {
                        path: 'fargeskalaer-eksempler',
                        element: <FargeskalaerEksempler />,
                    },
                    {
                        path: 'form-validering',
                        element: <FormValidering />,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
