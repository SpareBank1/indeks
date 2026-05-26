import { Button, Card, Form, Heading, HStack, Select, TextField } from '@sb1/indeks-react';

const kontoOptions = [
    { value: 'brukskonto', label: 'Brukskonto - 1234 56 78901' },
    { value: 'sparekonto', label: 'Sparekonto - 1234 56 78902' },
    { value: 'bsu', label: 'BSU - 1234 56 78903' },
];

export default function PMRegistrerBetaling() {
    return (
        <div className="ix-max-w-sm ix-m-auto ix-py-xl">
            <Card className="ix-m-auto ix-mb-5xl ix-p-lg ix-color-surface-main-default">
                <Heading as="h1" addRecommendedSpacing>
                    Betale
                </Heading>
                <Form>
                    <Select label="Fra konto" placeholder="Velg konto" options={kontoOptions} />
                    <Select label="Til konto" placeholder="Velg konto" options={kontoOptions} />
                    <div className="ix-grid ix-grid-cols-3 ">
                        <TextField label="Kroner" className="ix-col-span-2 " />
                        <TextField label="Øre" />
                    </div>
                    <HStack className="ix-align-flex-end">
                        <TextField label="Dato" className="ix-flex-grow ix-p" />
                        <Button variant="secondary" size="lg">
                            I dag
                        </Button>
                    </HStack>
                    <TextField label="KID eller Beskrivelse" placeholder="Vises hos mottaker. Opptil 140 tegn." />
                    <div className="ix-grid ix-grid-cols-2 ix-mt-lg">
                        <Button variant="secondary" size="lg">
                            Legg til godkjenning
                        </Button>
                        <Button variant="primary" size="lg" className="ix-ml-md">
                            Betal
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
