import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
    it('rendrer uten feil', () => {
        const { container } = render(<Grid>Innhold</Grid>);
        expect(container.querySelector('ix-grid')).toBeTruthy();
    });

    it('sender className videre som class', () => {
        const { container } = render(<Grid className="custom">Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('class')).toBe('custom');
    });

    it('setter cols-attributt', () => {
        const { container } = render(<Grid cols={3}>Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('cols')).toBe('3');
    });

    it('setter cols-attributt med string-verdi', () => {
        const { container } = render(<Grid cols="auto-fit-md">Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('cols')).toBe('auto-fit-md');
    });

    it('setter rows-attributt', () => {
        const { container } = render(<Grid rows={2}>Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('rows')).toBe('2');
    });

    it('setter gap-attributt', () => {
        const { container } = render(<Grid gap="lg">Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('gap')).toBe('lg');
    });

    it('setter align-attributt', () => {
        const { container } = render(<Grid align="center">Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('align')).toBe('center');
    });

    it('setter justify-attributt', () => {
        const { container } = render(<Grid justify="end">Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.getAttribute('justify')).toBe('end');
    });

    it('setter inline-attributt', () => {
        const { container } = render(<Grid inline>Innhold</Grid>);
        const grid = container.querySelector('ix-grid');
        expect(grid?.hasAttribute('inline')).toBe(true);
    });

    it('rendrer som native element med as-prop', () => {
        const { container } = render(<Grid as="section">Innhold</Grid>);
        const section = container.querySelector('section');
        expect(section).toBeTruthy();
        expect(section?.classList.contains('ix-grid')).toBe(true);
    });

    it('setter CSS-klasser for cols med as-prop', () => {
        const { container } = render(
            <Grid as="div" cols={4}>
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-grid-cols-4')).toBe(true);
    });

    it('setter CSS-klasser for auto-fit cols med as-prop', () => {
        const { container } = render(
            <Grid as="div" cols="auto-fit-lg">
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-grid-auto-fit-lg')).toBe(true);
    });

    it('setter CSS-klasser for rows med as-prop', () => {
        const { container } = render(
            <Grid as="div" rows={3}>
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-grid-rows-3')).toBe(true);
    });

    it('setter CSS-klasser for align med as-prop', () => {
        const { container } = render(
            <Grid as="div" align="stretch">
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-grid-align-stretch')).toBe(true);
    });

    it('setter CSS-klasser for justify med as-prop', () => {
        const { container } = render(
            <Grid as="div" justify="center">
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-grid-justify-center')).toBe(true);
    });

    it('setter CSS-klasse for inline med as-prop', () => {
        const { container } = render(
            <Grid as="div" inline>
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('ix-inline-grid')).toBe(true);
    });

    it('utelater gap-klasse for md (standardverdi) med as-prop', () => {
        const { container } = render(
            <Grid as="div" gap="md">
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.className).not.toContain('ix-gap-');
    });

    it('sender className videre med as-prop', () => {
        const { container } = render(
            <Grid as="div" className="custom">
                Innhold
            </Grid>,
        );
        const div = container.querySelector('div');
        expect(div?.classList.contains('custom')).toBe(true);
        expect(div?.classList.contains('ix-grid')).toBe(true);
    });
});

describe('Grid.Item', () => {
    it('rendrer uten feil', () => {
        const { container } = render(<Grid.Item>Innhold</Grid.Item>);
        expect(container.querySelector('div')).toBeTruthy();
    });

    it('setter colspan-klasse', () => {
        const { container } = render(<Grid.Item colspan={4}>Innhold</Grid.Item>);
        const item = container.querySelector('div');
        expect(item?.classList.contains('ix-col-span-4')).toBe(true);
    });

    it('setter colspan full', () => {
        const { container } = render(<Grid.Item colspan="full">Innhold</Grid.Item>);
        const item = container.querySelector('div');
        expect(item?.classList.contains('ix-col-span-full')).toBe(true);
    });

    it('setter rowspan-klasse', () => {
        const { container } = render(<Grid.Item rowspan={2}>Innhold</Grid.Item>);
        const item = container.querySelector('div');
        expect(item?.classList.contains('ix-row-span-2')).toBe(true);
    });

    it('kombinerer colspan og rowspan', () => {
        const { container } = render(
            <Grid.Item colspan={6} rowspan={2}>
                Innhold
            </Grid.Item>,
        );
        const item = container.querySelector('div');
        expect(item?.classList.contains('ix-col-span-6')).toBe(true);
        expect(item?.classList.contains('ix-row-span-2')).toBe(true);
    });

    it('sender className videre', () => {
        const { container } = render(<Grid.Item className="custom">Innhold</Grid.Item>);
        const item = container.querySelector('div');
        expect(item?.classList.contains('custom')).toBe(true);
    });

    it('rendrer som annet element med as-prop', () => {
        const { container } = render(
            <Grid.Item as="section" colspan={3}>
                Innhold
            </Grid.Item>,
        );
        const section = container.querySelector('section');
        expect(section).toBeTruthy();
        expect(section?.classList.contains('ix-col-span-3')).toBe(true);
    });
});
