import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

const defaultProps = {
    page: 1,
    count: 10,
    previousLabel: 'Forrige',
    nextLabel: 'Neste',
    ariaLabel: 'Sidenavigering',
    pageLabel: (page: number) => `Side ${page}`,
};

describe('Pagination', () => {
    it('rendrer ikke når count er 1', () => {
        const { container } = render(<Pagination {...defaultProps} count={1} />);
        expect(container.firstElementChild).toBeNull();
    });

    it('rendrer nav-element med aria-label', () => {
        render(<Pagination {...defaultProps} />);
        const nav = screen.getByRole('navigation', { name: 'Sidenavigering' });
        expect(nav.tagName).toBe('NAV');
        expect(nav.getAttribute('aria-label')).toBe('Sidenavigering');
    });

    it('sender className videre til rot-element', () => {
        const { container } = render(<Pagination {...defaultProps} className="custom" />);
        expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
    });

    it('markerer aktiv side med aria-current="page"', () => {
        render(<Pagination {...defaultProps} page={3} />);
        const activeButton = screen.getByRole('button', { name: 'Side 3' });
        expect(activeButton.getAttribute('aria-current')).toBe('page');
    });

    it('deaktiverer forrige-knapp på første side', () => {
        render(<Pagination {...defaultProps} page={1} />);
        const prevButton = screen.getByRole('button', { name: 'Forrige' });
        expect(prevButton.hasAttribute('disabled')).toBe(true);
    });

    it('deaktiverer neste-knapp på siste side', () => {
        render(<Pagination {...defaultProps} page={10} />);
        const nextButton = screen.getByRole('button', { name: 'Neste' });
        expect(nextButton.hasAttribute('disabled')).toBe(true);
    });

    it('kaller onPageChange ved klikk på sidetall', () => {
        const onPageChange = vi.fn();
        render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'Side 5' }));
        expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('kaller onPageChange ved klikk på forrige', () => {
        const onPageChange = vi.fn();
        render(<Pagination {...defaultProps} page={5} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'Forrige' }));
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('kaller onPageChange ved klikk på neste', () => {
        const onPageChange = vi.fn();
        render(<Pagination {...defaultProps} page={5} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'Neste' }));
        expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('viser ellipsis ved mange sider', () => {
        const { container } = render(<Pagination {...defaultProps} page={5} count={20} />);
        const ellipses = container.querySelectorAll('.ix-pagination__ellipsis');
        expect(ellipses.length).toBeGreaterThan(0);
        ellipses.forEach((el) => {
            expect(el.getAttribute('aria-hidden')).toBe('true');
        });
    });

    it('viser tekst på forrige/neste når prevNextTexts er true', () => {
        render(<Pagination {...defaultProps} prevNextTexts />);
        expect(screen.getByRole('button', { name: 'Forrige' }).textContent).toContain('Forrige');
        expect(screen.getByRole('button', { name: 'Neste' }).textContent).toContain('Neste');
    });

    it('viser alle sider uten ellipsis når count er liten', () => {
        const { container } = render(<Pagination {...defaultProps} count={5} />);
        for (let i = 1; i <= 5; i++) {
            expect(screen.getByRole('button', { name: `Side ${i}` })).toBeDefined();
        }
        expect(container.querySelector('.ix-pagination__ellipsis')).toBeNull();
    });
});
