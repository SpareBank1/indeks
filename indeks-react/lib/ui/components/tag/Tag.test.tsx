import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
    it('rendrer som span med ix-tag-klasse og innhold', () => {
        render(<Tag>Label</Tag>);
        const tag = screen.getByText('Label');
        expect(tag.tagName).toBe('SPAN');
        expect(tag.classList.contains('ix-tag')).toBe(true);
    });

    it('setter default data-status og data-variant', () => {
        render(<Tag>Label</Tag>);
        const tag = screen.getByText('Label');
        expect(tag.getAttribute('data-status')).toBe('neutral');
        expect(tag.getAttribute('data-variant')).toBe('emphasis');
    });

    it('mapper variant til data-status', () => {
        render(<Tag variant="info">Label</Tag>);
        expect(screen.getByText('Label').getAttribute('data-status')).toBe('info');
    });

    it('mapper type til data-variant', () => {
        render(<Tag type="subtle">Label</Tag>);
        expect(screen.getByText('Label').getAttribute('data-variant')).toBe('subtle');
    });

    it('utelater data-size for default-størrelse md', () => {
        render(<Tag>Label</Tag>);
        expect(screen.getByText('Label').hasAttribute('data-size')).toBe(false);
    });

    it('setter data-size for sm og lg', () => {
        const { rerender } = render(<Tag size="sm">Label</Tag>);
        expect(screen.getByText('Label').getAttribute('data-size')).toBe('sm');
        rerender(<Tag size="lg">Label</Tag>);
        expect(screen.getByText('Label').getAttribute('data-size')).toBe('lg');
    });

    it('sender className videre til rot-elementet', () => {
        render(<Tag className="custom">Label</Tag>);
        expect(screen.getByText('Label').classList.contains('custom')).toBe(true);
    });

    it('videresender native attributter som id og aria-label', () => {
        render(
            <Tag id="min-tag" aria-label="Beskrivelse">
                Label
            </Tag>,
        );
        const tag = screen.getByText('Label');
        expect(tag.getAttribute('id')).toBe('min-tag');
        expect(tag.getAttribute('aria-label')).toBe('Beskrivelse');
    });

    it('rendrer som annet element via as-prop', () => {
        render(
            <Tag as="a" href="/side">
                Lenke-tag
            </Tag>,
        );
        const tag = screen.getByText('Lenke-tag');
        expect(tag.tagName).toBe('A');
        expect(tag.getAttribute('href')).toBe('/side');
    });

    it('forwarder ref til rot-elementet', () => {
        const ref = createRef<HTMLSpanElement>();
        render(<Tag ref={ref}>Label</Tag>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
        expect(ref.current?.textContent).toBe('Label');
    });

    it('rendrer children inkludert ikon-elementer', () => {
        render(
            <Tag>
                <span data-testid="ikon" />
                Pålogget
            </Tag>,
        );
        expect(screen.getByTestId('ikon')).toBeTruthy();
        expect(screen.getByText('Pålogget')).toBeTruthy();
    });
});
