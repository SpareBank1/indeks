import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch', () => {
    it('rendrer en checkbox med role="switch" og label', () => {
        render(<ToggleSwitch label="Motta varsler" />);
        const toggle = screen.getByRole('switch', { name: 'Motta varsler' });
        expect(toggle.getAttribute('type')).toBe('checkbox');
    });

    it('kobler label til input med generert id', () => {
        render(<ToggleSwitch label="Motta varsler" />);
        const toggle = screen.getByRole('switch');
        expect(toggle.id).toBeTruthy();
        expect(document.querySelector('label')?.htmlFor).toBe(toggle.id);
    });

    it('bruker angitt id', () => {
        render(<ToggleSwitch label="Test" id="varsler" />);
        expect(screen.getByRole('switch').id).toBe('varsler');
    });

    it('bruker ariaLabel som navn uten synlig label', () => {
        render(<ToggleSwitch ariaLabel="Wifi" />);
        expect(screen.getByRole('switch', { name: 'Wifi' })).toBeDefined();
        expect(document.querySelector('label')?.textContent).toBe('');
    });

    it('utelater data-label-placement for standardplasseringen', () => {
        const { container } = render(<ToggleSwitch label="Test" />);
        expect(container.querySelector('.ix-toggle-switch')?.hasAttribute('data-label-placement')).toBe(false);
    });

    it('setter data-label-placement="right"', () => {
        const { container } = render(<ToggleSwitch label="Test" labelPlacement="right" />);
        expect(container.querySelector('.ix-toggle-switch')?.getAttribute('data-label-placement')).toBe('right');
    });

    it('rendrer uten ix-field når description mangler', () => {
        const { container } = render(<ToggleSwitch label="Test" className="egen" />);
        const root = container.firstElementChild;
        expect(root?.classList.contains('ix-toggle-switch')).toBe(true);
        expect(root?.classList.contains('egen')).toBe(true);
    });

    it('legger description inni switchen og ix-field rundt', () => {
        const { container } = render(<ToggleSwitch label="Test" description="Vi sender SMS" className="egen" />);
        const root = container.firstElementChild;
        expect(root?.tagName.toLowerCase()).toBe('ix-field');
        expect(root?.getAttribute('class')).toBe('egen');
        const desc = root?.querySelector('.ix-toggle-switch > [data-field="description"]');
        expect(desc?.textContent).toBe('Vi sender SMS');
    });

    it('setter disabled på input og data-disabled på ix-field', () => {
        const { container } = render(<ToggleSwitch label="Test" description="Info" disabled />);
        expect((screen.getByRole('switch') as HTMLInputElement).disabled).toBe(true);
        expect(container.firstElementChild?.hasAttribute('data-disabled')).toBe(true);
    });

    it('støtter defaultChecked (ukontrollert)', () => {
        render(<ToggleSwitch label="Test" defaultChecked />);
        const toggle = screen.getByRole('switch') as HTMLInputElement;
        expect(toggle.checked).toBe(true);
        fireEvent.click(toggle);
        expect(toggle.checked).toBe(false);
    });

    it('støtter checked (kontrollert) og kaller onChange med event', () => {
        const onChange = vi.fn();
        render(<ToggleSwitch label="Test" checked={false} onChange={onChange} />);
        fireEvent.click(screen.getByRole('switch'));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target).toBe(screen.getByRole('switch'));
    });

    it('toggler ved klikk på label', () => {
        render(<ToggleSwitch label="Motta varsler" />);
        fireEvent.click(screen.getByText('Motta varsler'));
        expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
    });

    it('videresender name og value til native input', () => {
        render(<ToggleSwitch label="Test" name="varsler" value="ja" />);
        const toggle = screen.getByRole('switch');
        expect(toggle.getAttribute('name')).toBe('varsler');
        expect(toggle.getAttribute('value')).toBe('ja');
    });

    it('videresender ref til input', () => {
        const ref = createRef<HTMLInputElement>();
        render(<ToggleSwitch label="Test" ref={ref} />);
        expect(ref.current).toBe(screen.getByRole('switch'));
    });
});
