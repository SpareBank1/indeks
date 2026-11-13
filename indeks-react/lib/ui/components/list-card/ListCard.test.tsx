import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Row } from '../row/Row';
import { ListCard } from './ListCard';

describe('ListCard', () => {
    it('legger hver rad i sin egen li', () => {
        render(
            <ListCard>
                <Row title="Brukskonto" href="#" />
                <Row title="Sparekonto" href="#" />
                {false}
            </ListCard>
        );
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(2);
        expect(items[0].firstElementChild!.className).toBe('ix-row');
        expect(screen.getByRole('list').getAttribute('role')).toBe('list');
    });

    it('rendrer ikke header uten title og trailing', () => {
        const { container } = render(
            <ListCard>
                <Row title="Brukskonto" />
            </ListCard>
        );
        expect(container.querySelector('.ix-list-card__header')).toBeNull();
        expect(screen.getByRole('list').hasAttribute('aria-labelledby')).toBe(false);
    });

    it('gir lista navn fra tittelen, som er h3 som standard', () => {
        render(
            <ListCard title="Kontoer">
                <Row title="Brukskonto" />
            </ListCard>
        );
        expect(screen.getByRole('list', { name: 'Kontoer' })).toBeTruthy();
        expect(screen.getByRole('heading', { level: 3, name: 'Kontoer' }).className).toBe('ix-list-card__title');
    });

    it('bruker titleAs som element for tittelen', () => {
        render(
            <ListCard title="Kontoer" titleAs="h2">
                <Row title="Brukskonto" />
            </ListCard>
        );
        expect(screen.getByRole('heading', { level: 2, name: 'Kontoer' })).toBeTruthy();
    });

    it('viser trailing uten tittel, og lista får da ikke navn', () => {
        const { container } = render(
            <ListCard trailing="Totalt: 42 672 kr">
                <Row title="Brukskonto" />
            </ListCard>
        );
        expect(screen.getByText('Totalt: 42 672 kr').className).toBe('ix-list-card__trailing');
        expect(container.querySelector('.ix-list-card__title')).toBeNull();
        expect(screen.getByRole('list').hasAttribute('aria-labelledby')).toBe(false);
    });

    it('rendrer ikke en tom liste uten rader', () => {
        render(<ListCard title="Kontoer">{false}</ListCard>);
        expect(screen.queryByRole('list')).toBeNull();
    });

    it('sender className, native props og ref til roten', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(
            <ListCard ref={ref} className="egen" data-testid="kort">
                <Row title="Brukskonto" />
            </ListCard>
        );
        const root = container.firstElementChild!;
        expect(root.className).toBe('ix-list-card egen');
        expect(root.getAttribute('data-testid')).toBe('kort');
        expect(ref.current).toBe(root);
    });
});
