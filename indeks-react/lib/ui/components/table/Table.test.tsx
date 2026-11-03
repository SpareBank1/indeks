import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
    it('sets data-size, md by default', () => {
        const { container } = render(<Table />);
        expect(container.querySelector('table')?.dataset.size).toBe('md');
    });

    it('sets data-size from size', () => {
        const { container } = render(<Table size="sm" />);
        expect(container.querySelector('table')?.dataset.size).toBe('sm');
    });

    it('has only the block class besides className', () => {
        const { container } = render(<Table className="custom" />);
        expect(container.querySelector('table')?.className).toBe('ix-table custom');
    });
});
