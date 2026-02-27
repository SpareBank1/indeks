import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Icon } from '../../icons';
import { Button } from './Button';

describe('Button', () => {
    it('should render as a button by default with correct className', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeDefined();
        expect(button.tagName).toBe('BUTTON');
        expect(button.classList).toContain('ix-button');
    });

    it('should render as a link when "as" prop is set to "a"', () => {
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

    it('should pass additional props to the rendered element', () => {
        render(
            <Button id="custom-id" data-test="test-value">
                Test Button
            </Button>
        );
        const button = screen.getByRole('button', { name: 'Test Button' });
        expect(button.attributes.getNamedItem('id')?.value).toBe('custom-id');
        expect(button.attributes.getNamedItem('data-test')?.value).toBe('test-value');
    });

    it('should pass on role when set', () => {
        render(<Button role="submit">Role Button</Button>);
        const button = screen.getByRole('submit');
        expect(button).toBeDefined();
    });

    /** TODO: Disabled state */
});

describe('Button loading state', () => {
    let button: HTMLElement;

    beforeEach(() => {
        render(
            <Button loading loadingLabel="Laster">
                Submit
            </Button>
        );
        button = screen.getByRole('button');
    });

    it('should show loading state when loading is true', () => {
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('and should be disabled for screen readers', () => {
        expect(button.attributes.getNamedItem('aria-disabled')?.value).toBe('true');
    });

    it('should have an aria-label attribute for accessibility', () => {
        expect(button.attributes.getNamedItem('aria-label')?.value).toBe('Laster');
    });
});

describe('Button variants', () => {
    it('should render primary button by default', () => {
        render(<Button>Primary Button</Button>);
        const button = screen.getByRole('button', { name: 'Primary Button' });
        expect(button.classList).toContain('ix-button--primary');
    });

    it('should render secondary button when variant is set to secondary', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        const button = screen.getByRole('button', { name: 'Secondary Button' });
        expect(button.classList).toContain('ix-button--secondary');
    });

    it('should render tertiary button when variant is set to tertiary', () => {
        render(<Button variant="tertiary">Tertiary Button</Button>);
        const button = screen.getByRole('button', { name: 'Tertiary Button' });
        expect(button.classList).toContain('ix-button--tertiary');
    });

    it('should render danger button when variant is set to danger', () => {
        render(<Button danger>Danger Button</Button>);
        const button = screen.getByRole('button', { name: 'Danger Button' });
        expect(button.classList).toContain('ix-button--primary-danger');
    });
});

describe('Button sizes', () => {
    it('should render button with medium size by default', () => {
        render(<Button>Medium Button</Button>);
        const button = screen.getByRole('button', { name: 'Medium Button' });
        expect(button.classList).toContain('ix-button');
    });

    it('should render button with small size when size prop is set to small', () => {
        render(<Button size="sm">Small Button</Button>);
        const button = screen.getByRole('button', { name: 'Small Button' });
        expect(button.classList.contains('ix-button--sm')).toBe(true);
    });

    it('should render button with large size when size prop is set to large', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByRole('button', { name: 'Large Button' });
        expect(button.classList).toContain('ix-button--lg');
    });
});

describe('Button with icon', () => {
    it('should render button with icon', () => {
        render(
            <Button>
                <Icon name="hjem" />
                Primary Button
            </Button>
        );
        const button = screen.getByRole('button', { name: 'Primary Button' });
        const icon = button.getElementsByClassName('ix-icon')[0];
        expect(icon).toBeDefined();
    });

    it.skip('should render icon-only class when button has only an icon', () => {
        render(
            <Button>
                <Icon name="hjem" />
            </Button>
        );
        const button = screen.getByRole('button');
        expect(button.classList).toContain('ix-button--icon-only');
    });
});

describe('Button width', () => {
    it('should render button with full width when width prop is set to full', () => {
        render(<Button width="full">Full Width Button</Button>);
        const button = screen.getByRole('button', { name: 'Full Width Button' });
        expect(button.classList).toContain('ix-w-full');
    });
});
