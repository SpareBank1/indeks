import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Icon } from '../../icons';
import { Button } from './Button';

describe('Button', () => {
    it('skal rendre som button som standard med riktig className', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeDefined();
        expect(button.tagName).toBe('BUTTON');
        expect(button.classList).toContain('ix-button');
    });

    it('skal rendre som lenke når as="a"', () => {
        render(
            <Button as="a" href="https://example.com">
                Go to example
            </Button>
        );
        const link = screen.getByRole('link', { name: 'Go to example' });
        expect(link).toBeDefined();
        expect(link.tagName).toBe('A');
        expect(link.attributes.getNamedItem('href')?.value).toBe('https://example.com');
    });

    it('skal videresende ekstra props til elementet', () => {
        render(
            <Button id="custom-id" data-test="test-value">
                Test Button
            </Button>
        );
        const button = screen.getByRole('button', { name: 'Test Button' });
        expect(button.attributes.getNamedItem('id')?.value).toBe('custom-id');
        expect(button.attributes.getNamedItem('data-test')?.value).toBe('test-value');
    });

    it('skal videresende role når satt', () => {
        render(<Button role="menuitem">Role Button</Button>);
        const button = screen.getByRole('menuitem');
        expect(button).toBeDefined();
    });
});

describe('Button disabled-tilstand', () => {
    it('skal ha disabled-attributt når disabled=true', () => {
        render(<Button disabled>Deaktivert</Button>);
        const button = screen.getByRole('button', { name: 'Deaktivert' });
        expect(button).toHaveProperty('disabled', true);
    });

    it('skal ikke aktiveres når disabled', () => {
        render(<Button disabled>Deaktivert</Button>);
        const button = screen.getByRole('button', { name: 'Deaktivert' });
        expect(button.getAttribute('disabled')).not.toBeNull();
    });
});

describe('Button loading-tilstand', () => {
    let button: HTMLElement;

    beforeEach(() => {
        render(
            <Button loading loadingLabel="Laster">
                Send inn
            </Button>
        );
        button = screen.getByRole('button');
    });

    it('skal vise loadingLabel som innhold ved loading', () => {
        expect(screen.getByText('Laster')).toBeDefined();
    });

    it('skal være deaktivert', () => {
        expect(button).toHaveProperty('disabled', true);
    });

    it('skal ha aria-label satt til loadingLabel', () => {
        expect(button.attributes.getNamedItem('aria-label')?.value).toBe('Laster');
    });

    it('skal rendre Spinner inni knappen', () => {
        const spinner = button.getElementsByClassName('ix-spinner')[0];
        expect(spinner).toBeDefined();
        expect(spinner.getAttribute('aria-hidden')).toBe('true');
    });

    it('skal sette data-loading=true', () => {
        expect(button.getAttribute('data-loading')).toBe('true');
    });
});




describe('Button varianter', () => {
    it('skal sette data-variant=primary som standard', () => {
        render(<Button>Primary Button</Button>);
        const button = screen.getByRole('button', { name: 'Primary Button' });
        expect(button.getAttribute('data-variant')).toBe('primary');
    });

    it('skal sette data-variant=secondary', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        const button = screen.getByRole('button', { name: 'Secondary Button' });
        expect(button.getAttribute('data-variant')).toBe('secondary');
    });

    it('skal sette data-variant=tertiary', () => {
        render(<Button variant="tertiary">Tertiary Button</Button>);
        const button = screen.getByRole('button', { name: 'Tertiary Button' });
        expect(button.getAttribute('data-variant')).toBe('tertiary');
    });

    it('skal sette data-danger=true ved danger=true', () => {
        render(<Button danger>Danger Button</Button>);
        const button = screen.getByRole('button', { name: 'Danger Button' });
        expect(button.getAttribute('data-danger')).toBe('true');
    });

    it('skal ikke sette data-danger uten danger-prop', () => {
        render(<Button>Normal Button</Button>);
        const button = screen.getByRole('button', { name: 'Normal Button' });
        expect(button.hasAttribute('data-danger')).toBe(false);
    });
});

describe('Button størrelser', () => {
    it('skal ikke sette data-size for medium (standard)', () => {
        render(<Button>Medium Button</Button>);
        const button = screen.getByRole('button', { name: 'Medium Button' });
        expect(button.hasAttribute('data-size')).toBe(false);
    });

    it('skal sette data-size=sm', () => {
        render(<Button size="sm">Small Button</Button>);
        const button = screen.getByRole('button', { name: 'Small Button' });
        expect(button.getAttribute('data-size')).toBe('sm');
    });

    it('skal sette data-size=lg', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByRole('button', { name: 'Large Button' });
        expect(button.getAttribute('data-size')).toBe('lg');
    });
});

describe('Button med ikon', () => {
    it('skal rendre ikon inne i knappen', () => {
        render(
            <Button>
                <Icon name="home" />
                Primary Button
            </Button>
        );
        const button = screen.getByRole('button', { name: 'Primary Button' });
        const icon = button.getElementsByClassName('ix-icon')[0];
        expect(icon).toBeDefined();
    });
});

describe('Button bredde', () => {
    it('skal ha full-bredde-klasse ved width=full', () => {
        render(<Button width="full">Full Width Button</Button>);
        const button = screen.getByRole('button', { name: 'Full Width Button' });
        expect(button.classList).toContain('ix-w-full');
    });
});
