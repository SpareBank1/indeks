import React from 'react';
import { Flate, Illustrasjon, Prikk, Tekst } from './byggeklosser';

// Se README.md i denne mappa før du lager en ny.

export const ButtonIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={60} w={128} h={40} t="aksent" />
        <Tekst x={108} y={76} w={64} t="invers" />
    </Illustrasjon>
);

export const TextFieldIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={52} y={44} w={72} />
        <Flate x={52} y={68} w={176} h={40} />
        <Tekst x={68} y={84} w={96} t="tekst-svak" />
    </Illustrasjon>
);

export const RadioGroupIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={76} y={32} w={96} />
        <Prikk cx={86} cy={76} />
        <Prikk cx={86} cy={76} r={5} t="aksent" />
        <Tekst x={108} y={72} w={72} />
        <Prikk cx={86} cy={112} />
        <Tekst x={108} y={108} w={96} />
    </Illustrasjon>
);

export const TabsIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={44} y={36} w={64} t="aksent" />
        <Tekst x={140} y={36} w={80} />
        <Flate x={28} y={58} w={224} h={2} t="kant" r={1} />
        <Flate x={36} y={56} w={80} h={4} t="aksent" r={2} />
        <Tekst x={28} y={84} w={208} t="tekst-svak" />
        <Tekst x={28} y={108} w={160} t="tekst-svak" />
    </Illustrasjon>
);

export const MessageIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={20} y={48} w={240} h={64} t="aksent-svak" />
        <Prikk cx={52} cy={80} t="aksent" />
        <Tekst x={76} y={76} w={152} />
    </Illustrasjon>
);

export const GridIllustrasjon = () => (
    <Illustrasjon>
        {[0, 1, 2].flatMap((kol) =>
            [0, 1].map((rad) => (
                <Flate key={`${kol}-${rad}`} x={20 + kol * 84} y={26 + rad * 60} w={72} h={48} t="aksent-svak" />
            ))
        )}
    </Illustrasjon>
);
