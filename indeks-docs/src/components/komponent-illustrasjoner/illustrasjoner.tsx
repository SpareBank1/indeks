import React from 'react';
import { Bue, Flate, Glyf, Illustrasjon, Prikk, Ring, Tekst, Trekant } from './byggeklosser';

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

export const AccordionIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={60} y={24} w={160} h={112} fyll="hvit" kant="lys" />
        <Glyf navn="chevron-opp" x={72} y={34} />
        <Tekst x={96} y={38} w={88} fyll="mørk" />
        <Tekst x={72} y={58} w={128} />
        <Flate x={61} y={76} w={158} h={2} fyll="lys" r={0} />
        <Glyf navn="chevron-ned" x={72} y={83} />
        <Tekst x={96} y={87} w={80} />
        <Flate x={61} y={106} w={158} h={2} fyll="lys" r={0} />
        <Glyf navn="chevron-ned" x={72} y={113} />
        <Tekst x={96} y={117} w={64} />
    </Illustrasjon>
);

export const CardIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={24} w={128} h={112} fyll="hvit" kant="lys" />
        <Flate x={82} y={30} w={116} h={52} fyll="lys" r={4} />
        <Tekst x={88} y={94} w={72} fyll="mørk" />
        <Tekst x={88} y={110} w={104} />
        <Tekst x={88} y={122} w={72} />
    </Illustrasjon>
);

export const CheckboxIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={69} w={22} h={22} fyll="mørk" r={4} />
        <Glyf navn="hake" x={79} y={72} farge="hvit" />
        <Tekst x={110} y={76} w={96} fyll="mørk" />
    </Illustrasjon>
);

export const CheckboxGroupIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={84} y={51} w={22} h={22} fyll="mørk" r={4} />
        <Glyf navn="hake" x={87} y={54} farge="hvit" />
        <Tekst x={118} y={58} w={88} fyll="mørk" />
        <Flate x={84} y={87} w={22} h={22} fyll="hvit" kant="mørk" r={4} />
        <Tekst x={118} y={94} w={64} />
    </Illustrasjon>
);

export const ChipIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={56} y={60} w={80} h={40} fyll="mørk" r={20} />
        <Tekst x={76} y={76} w={40} fyll="hvit" />
        <Flate x={144} y={60} w={80} h={40} fyll="hvit" kant="mørk" r={20} />
        <Tekst x={164} y={76} w={40} />
    </Illustrasjon>
);

export const ComboboxIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={60} y={24} w={160} h={40} fyll="hvit" kant="mørk" />
        <Glyf navn="søk" x={72} y={36} />
        <Tekst x={96} y={40} w={64} />
        <Flate x={60} y={72} w={160} h={64} fyll="hvit" kant="lys" />
        <Flate x={64} y={76} w={152} h={20} fyll="lys" r={4} />
        <Tekst x={76} y={82} w={80} fyll="mørk" />
        <Tekst x={76} y={104} w={96} />
        <Tekst x={76} y={120} w={64} />
    </Illustrasjon>
);

export const DateFieldIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={24} w={128} h={112} fyll="hvit" kant="lys" />
        <Tekst x={88} y={36} w={56} fyll="mørk" />
        {[0, 1, 2, 3].flatMap((rad) =>
            [0, 1, 2, 3, 4].map((kol) => (
                <Flate
                    key={`${rad}-${kol}`}
                    x={88 + kol * 22}
                    y={56 + rad * 18}
                    w={16}
                    h={12}
                    fyll={rad === 1 && kol === 2 ? 'mørk' : 'lys'}
                    r={3}
                />
            ))
        )}
    </Illustrasjon>
);

export const DividerIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={56} y={44} w={120} />
        <Flate x={56} y={79} w={168} h={2} fyll="mørk" r={0} />
        <Tekst x={56} y={108} w={144} />
    </Illustrasjon>
);

export const DropdownMenuIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={84} y={24} w={112} h={40} fyll="hvit" kant="mørk" />
        <Tekst x={100} y={40} w={56} fyll="mørk" />
        <Glyf navn="chevron-ned" x={164} y={36} />
        <Flate x={84} y={72} w={112} h={64} fyll="hvit" kant="lys" />
        <Tekst x={100} y={86} w={72} />
        <Tekst x={100} y={102} w={56} />
        <Tekst x={100} y={118} w={64} />
    </Illustrasjon>
);

export const IconIllustrasjon = () => (
    <Illustrasjon>
        <Ring cx={140} cy={80} r={44} bredde={10} />
        <Trekant x={129} y={52} w={22} h={20} />
        <Prikk cx={127} cy={95} r={9} fyll="mørk" />
        <Flate x={144} y={86} w={18} h={18} fyll="mørk" r={3} />
    </Illustrasjon>
);

export const InteractiveIconIllustrasjon = () => (
    <Illustrasjon>
        <Prikk cx={140} cy={80} r={24} fyll="lys" />
        <Glyf navn="pluss" x={132} y={72} />
    </Illustrasjon>
);

export const LabelIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={60} y={48} w={88} fyll="mørk" />
        <Flate x={60} y={68} w={160} h={44} fyll="hvit" kant="lys" />
    </Illustrasjon>
);

export const ModalIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={0} y={0} w={280} h={160} fyll="lys" r={0} />
        <Flate x={72} y={24} w={136} h={112} fyll="hvit" kant="lys" />
        <Tekst x={84} y={36} w={72} fyll="mørk" />
        <Glyf navn="kryss" x={180} y={32} />
        <Tekst x={84} y={60} w={112} />
        <Tekst x={84} y={76} w={88} />
        <Flate x={84} y={100} w={52} h={24} fyll="mørk" r={6} />
        <Flate x={144} y={100} w={52} h={24} fyll="hvit" kant="mørk" r={6} />
    </Illustrasjon>
);

export const PaginationIllustrasjon = () => (
    <Illustrasjon>
        <Glyf navn="chevron-venstre" x={40} y={72} />
        {[0, 1, 2, 3].map((i) =>
            i === 1 ? (
                <Flate key={i} x={64 + i * 40} y={64} w={32} h={32} fyll="mørk" r={6} />
            ) : (
                <Flate key={i} x={64 + i * 40} y={64} w={32} h={32} fyll="hvit" kant="lys" r={6} />
            )
        )}
        <Glyf navn="chevron-høyre" x={224} y={72} />
    </Illustrasjon>
);

export const PhoneNumberFieldIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={44} y={36} w={72} fyll="mørk" />
        <Flate x={44} y={56} w={60} h={44} fyll="hvit" kant="lys" />
        <Tekst x={56} y={74} w={20} />
        <Glyf navn="chevron-ned" x={82} y={70} />
        <Flate x={112} y={56} w={124} h={44} fyll="hvit" kant="mørk" />
        <Tekst x={128} y={74} w={72} />
    </Illustrasjon>
);

export const PopoverIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={72} y={24} w={136} h={64} fyll="hvit" kant="lys" />
        <Trekant x={132} y={87} w={16} h={10} retning="ned" fyll="hvit" />
        <Tekst x={88} y={40} w={80} fyll="mørk" />
        <Tekst x={88} y={60} w={104} />
        <Flate x={96} y={104} w={88} h={32} fyll="hvit" kant="mørk" />
        <Tekst x={116} y={116} w={48} fyll="mørk" />
    </Illustrasjon>
);

export const ProgressBarIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={60} y={48} w={72} fyll="mørk" />
        <Flate x={60} y={72} w={160} h={12} fyll="lys" r={6} />
        <Flate x={60} y={72} w={96} h={12} fyll="mørk" r={6} />
        <Tekst x={60} y={100} w={48} />
    </Illustrasjon>
);

export const ReadMoreIllustrasjon = () => (
    <Illustrasjon>
        <Glyf navn="chevron-ned" x={60} y={44} />
        <Tekst x={84} y={48} w={96} fyll="mørk" />
        <Flate x={84} y={60} w={96} h={2} fyll="mørk" r={1} />
        <Tekst x={60} y={84} w={160} />
        <Tekst x={60} y={104} w={120} />
    </Illustrasjon>
);

export const SelectIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={60} y={48} w={56} fyll="mørk" />
        <Flate x={60} y={68} w={160} h={44} fyll="hvit" kant="mørk" />
        <Tekst x={76} y={86} w={64} />
        <Glyf navn="chevron-ned" x={192} y={82} />
    </Illustrasjon>
);

export const SpinnerIllustrasjon = () => (
    <Illustrasjon>
        <Ring cx={140} cy={80} r={32} />
        <Bue cx={140} cy={80} r={32} fra={0} til={100} />
    </Illustrasjon>
);

export const StackIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={56} y={30} w={168} h={28} fyll="lys" r={6} />
        <Flate x={56} y={66} w={168} h={28} fyll="mørk" r={6} />
        <Flate x={56} y={102} w={168} h={28} fyll="lys" r={6} />
    </Illustrasjon>
);

export const SurfaceIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={52} y={28} w={176} h={104} fyll="hvit" kant="lys" r={12} />
        <Tekst x={72} y={48} w={88} fyll="mørk" />
        <Tekst x={72} y={68} w={136} />
        <Tekst x={72} y={88} w={112} />
        <Tekst x={72} y={108} w={72} />
    </Illustrasjon>
);

export const TagIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={68} w={60} h={24} fyll="lys" r={12} />
        <Tekst x={88} y={76} w={36} fyll="mørk" />
        <Flate x={144} y={68} w={60} h={24} fyll="lys" r={12} />
        <Tekst x={156} y={76} w={36} fyll="mørk" />
    </Illustrasjon>
);

export const TextAreaIllustrasjon = () => (
    <Illustrasjon>
        <Tekst x={60} y={28} w={56} fyll="mørk" />
        <Flate x={60} y={48} w={160} h={80} fyll="hvit" kant="mørk" />
        <Tekst x={76} y={64} w={128} />
        <Tekst x={76} y={84} w={104} />
        <Tekst x={76} y={104} w={72} />
    </Illustrasjon>
);

export const TooltipIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={76} y={28} w={128} h={48} fyll="mørk" />
        <Trekant x={132} y={75} w={16} h={10} retning="ned" />
        <Tekst x={92} y={40} w={96} fyll="hvit" />
        <Tekst x={92} y={56} w={72} fyll="hvit" />
        <Prikk cx={140} cy={112} r={12} fyll="lys" />
        <Flate x={138} y={106} w={4} h={12} fyll="mørk" r={2} />
    </Illustrasjon>
);

export const TypografiIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={60} y={40} w={120} h={16} fyll="mørk" />
        <Tekst x={60} y={72} w={160} />
        <Tekst x={60} y={92} w={136} />
        <Tekst x={60} y={112} w={96} />
    </Illustrasjon>
);

export const ValidationMessageIllustrasjon = () => (
    <Illustrasjon>
        <Flate x={60} y={36} w={160} h={44} fyll="hvit" kant="mørk" />
        <Tekst x={76} y={54} w={64} />
        <Prikk cx={70} cy={104} r={10} fyll="mørk" />
        <Flate x={68} y={97} w={4} h={8} fyll="hvit" r={2} />
        <Prikk cx={70} cy={110} r={2} fyll="hvit" />
        <Tekst x={88} y={100} w={120} fyll="mørk" />
    </Illustrasjon>
);
