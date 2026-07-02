import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InteractiveIcon } from './InteractiveIcon';

describe('InteractiveIcon', () => {
    it('rendrer som button med klassen ix-interactive-icon', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" />);
        const button = screen.getByRole('button', { name: 'Hjem' });
        expect(button.tagName).toBe('BUTTON');
        expect(button.classList).toContain('ix-interactive-icon');
    });

    it('setter aria-label på knappen', () => {
        render(<InteractiveIcon name="home" aria-label="Gå hjem" />);
        expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Gå hjem');
    });

    it('har type=button', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" />);
        expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    });

    it('rendrer ix-icon med riktig name', () => {
        render(<InteractiveIcon name="close" aria-label="Lukk" />);
        const icon = screen.getByRole('button').getElementsByClassName('ix-icon')[0];
        expect(icon).toBeDefined();
        expect(icon.getAttribute('name')).toBe('close');
    });

    it('setter data-status for info', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" status="info" />);
        expect(screen.getByRole('button').getAttribute('data-status')).toBe('info');
    });

    it('setter data-status for danger', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" status="danger" />);
        expect(screen.getByRole('button').getAttribute('data-status')).toBe('danger');
    });

    it('utelater data-status for default', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" />);
        expect(screen.getByRole('button').hasAttribute('data-status')).toBe(false);
    });

    it('videresender onClick', () => {
        const onClick = vi.fn();
        render(<InteractiveIcon name="home" aria-label="Hjem" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('videresender disabled', () => {
        render(<InteractiveIcon name="home" aria-label="Hjem" disabled />);
        expect(screen.getByRole('button')).toHaveProperty('disabled', true);
    });
});
