import { Button, Form, TextInput } from '@sb1/indeks-react';

export default function PMBoliglaanskalkulator() {
    return (
        <div className="ix-m-auto ix-m-md">
            <h1>PM - Boliglånskalkulator</h1>
            <p>Kalkuler månedlige boliglånsbetalinger.</p>

            <Form>
                <TextInput label="Lånebeløp (NOK)" />
                <TextInput label="Rente (%)" />
                <TextInput label="Antall år" />
                <Button
                    onClick={() => {
                        console.log('klikk');
                    }}
                >
                    Kalkuler
                </Button>

                <div className="ix-mt-4 ix-m-auto ix-surface-neutral ix-border-default ix-border-radius-xs ix-p-md">
                    <h3>Resultat:</h3>
                    <p>
                        <strong>Månedlig betaling: 15 000 NOK</strong>
                    </p>
                    <p>
                        <em>Implementer kalkulering med riktig state management</em>
                    </p>
                </div>
            </Form>
        </div>
    );
}
