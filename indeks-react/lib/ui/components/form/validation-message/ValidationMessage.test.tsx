import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ValidationMessage } from './ValidationMessage';

describe('ValidationMessage', () => {
    it('rendrer span med data-field="error"', () => {
        const { container } = render(<ValidationMessage>Du må velge et alternativ</ValidationMessage>);
        const el = container.querySelector('span[data-field="error"]');
        expect(el).not.toBeNull();
    });

    it('rendrer children som tekst', () => {
        const { getByText } = render(<ValidationMessage>Feltet er påkrevd</ValidationMessage>);
        expect(getByText('Feltet er påkrevd')).not.toBeNull();
    });

    it('rendrer fortsatt span når children mangler', () => {
        const { container } = render(<ValidationMessage />);
        const el = container.querySelector('span[data-field="error"]');
        expect(el).not.toBeNull();
        expect(el?.textContent).toBe('');
    });

    it('rendrer fortsatt span når children er tom string', () => {
        const { container } = render(<ValidationMessage>{''}</ValidationMessage>);
        const el = container.querySelector('span[data-field="error"]');
        expect(el).not.toBeNull();
    });

    it('setter id på span-elementet', () => {
        const { container } = render(<ValidationMessage id="my-error">Feil</ValidationMessage>);
        const el = container.querySelector('span[data-field="error"]');
        expect(el?.id).toBe('my-error');
    });

    it('legger til className', () => {
        const { container } = render(<ValidationMessage className="custom-class">Feil</ValidationMessage>);
        const el = container.querySelector('span[data-field="error"]');
        expect(el?.classList.contains('custom-class')).toBe(true);
    });

    it('forwarder ref til span-elementet', () => {
        const ref = createRef<HTMLSpanElement>();
        render(<ValidationMessage ref={ref}>Feil</ValidationMessage>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
        expect(ref.current?.getAttribute('data-field')).toBe('error');
    });

    it('spreader ukjente HTML-attributter videre til span', () => {
        const { container } = render(<ValidationMessage data-testid="min-feil">Feil</ValidationMessage>);
        const el = container.querySelector('span[data-field="error"]');
        expect(el?.getAttribute('data-testid')).toBe('min-feil');
    });

    it('rendrer et dekorativt badge-ikon når det finnes innhold', () => {
        const { container } = render(<ValidationMessage>Feil</ValidationMessage>);
        const icon = container.querySelector('ix-icon[data-badge]');
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute('data-status')).toBe('danger');
        expect(icon?.getAttribute('name')).toBe('close');
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('rendrer ikke ikon når children er tom', () => {
        const { container } = render(<ValidationMessage>{''}</ValidationMessage>);
        expect(container.querySelector('ix-icon[data-badge]')).toBeNull();
    });

    it('rendrer ikke ikon når showIcon er false', () => {
        const { container } = render(<ValidationMessage showIcon={false}>Feil</ValidationMessage>);
        expect(container.querySelector('ix-icon[data-badge]')).toBeNull();
    });
});
