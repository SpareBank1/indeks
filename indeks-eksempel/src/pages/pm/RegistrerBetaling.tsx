import { Button, Card, Dropdown, Form, Heading, HStack, TextInput } from '@sb1/indeks-react';

export default function PMRegistrerBetaling() {
    return (
        <div className="ix-max-w-sm ix-m-auto ix-py-xl">
            <Card className="ix-m-auto ix-mb-5xl ix-p-lg ix-color-surface-main-default">
                <Heading as="h1" addRecommendedSpacing>
                    Betale
                </Heading>
                <Form>
                    <Dropdown label="Fra konto" placeholder="Velg konto" />
                    <Dropdown label="Til konto" placeholder="Ve konto" />
                    <div className="ix-grid ix-grid-cols-3 ">
                        <TextInput label="Kroner" className="ix-col-span-2 " />
                        <TextInput label="Øre" />
                    </div>
                    <HStack className="ix-align-flex-end">
                        <TextInput label="Dato" className="ix-flex-grow ix-p" />
                        <Button variant="secondary" size="lg">
                            I dag
                        </Button>
                    </HStack>
                    <TextInput label="KID eller Beskrivelse" placeholder="Vises hos mottaker. Opptil 140 tegn." />
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
