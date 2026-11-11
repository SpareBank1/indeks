import React from 'react';
import { Flate, Illustrasjon, Prikk, Tekst } from './byggeklosser';

// Se README.md i denne mappa før du lager en ny.

export const ButtonIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={72} y={58} w={136} h={44} fyll="mørk" />
        <Tekst x={108} y={76} w={64} fyll="hvit" />
    </Illustrasjon>
);

export const TextFieldIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={60} y={36} w={56} fyll="mørk" />
        <Flate x={60} y={56} w={160} h={44} fyll="hvit" kant="mørk" />
        <Tekst x={76} y={74} w={64} />
        <Flate x={152} y={68} w={3} h={20} fyll="mørk" r={1.5} />
        <Tekst x={60} y={116} w={104} />
    </Illustrasjon>
);

export const RadioGroupIllustrasjon = () => (
    <Illustrasjon>
        <Prikk cx={92} cy={62} r={11} fyll="hvit" kant="mørk" />
        <Prikk cx={92} cy={62} r={5} fyll="mørk" />
        <Tekst x={114} y={58} w={88} fyll="mørk" />
        <Prikk cx={92} cy={98} r={11} fyll="hvit" kant="lys" />
        <Tekst x={114} y={94} w={64} />
    </Illustrasjon>
);

export const TabsIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={56} y={36} w={48} fyll="mørk" />
        <Tekst x={124} y={36} w={48} />
        <Tekst x={192} y={36} w={32} />
        <Flate x={56} y={56} w={168} h={2} fyll="lys" r={0} />
        <Flate x={56} y={54} w={48} h={4} fyll="mørk" r={0} />
        <Tekst x={56} y={76} w={152} />
        <Tekst x={56} y={96} w={120} />
        <Tekst x={56} y={116} w={144} />
    </Illustrasjon>
);

export const MessageIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={44} y={36} w={192} h={88} fyll="lys" kant="mørk" />
        <Prikk cx={70} cy={62} r={10} fyll="mørk" />
        <Flate x={68} y={56} w={4} h={12} fyll="lys" r={2} />
        <Tekst x={92} y={58} w={112} fyll="mørk" />
        <Tekst x={92} y={78} w={124} fyll="hvit" />
        <Tekst x={92} y={98} w={80} fyll="hvit" />
    </Illustrasjon>
);

export const GridIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={44} y={32} w={56} h={44} fyll="lys" r={6} />
        <Flate x={108} y={32} w={64} h={44} fyll="mørk" r={6} />
        <Flate x={180} y={32} w={56} h={44} fyll="lys" r={6} />
        <Flate x={44} y={84} w={120} h={44} fyll="lys" r={6} />
        <Flate x={172} y={84} w={64} h={44} fyll="mørk" r={6} />
    </Illustrasjon>
);
