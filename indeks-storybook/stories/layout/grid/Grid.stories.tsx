import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '@sb1/indeks-react';

const meta = {
    title: 'Layout/Grid',
    component: Grid,
    tags: ['autodocs'],
    args: {
        cols: 3,
        gap: 'md',
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">1</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">2</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">3</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">4</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">5</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">6</div>
            </>
        ),
    },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Cols2: Story = {
    args: { cols: 2 },
};

export const Cols4: Story = {
    tags: ['desktop-chromium'],
    args: { cols: 4 },
};

export const Cols6: Story = {
    args: { cols: 6 },
};

export const Cols12: Story = {
    args: {
        cols: 12,
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">1</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">2</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">3</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">4</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">5</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">6</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">7</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">8</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">9</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">10</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">11</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">12</div>
            </>
        ),
    },
};

export const AutoFitMd: Story = {
    tags: ['desktop-chromium'],
    args: {
        cols: 'auto-fit-md',
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Auto 1</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Auto 2</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Auto 3</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Auto 4</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Auto 5</div>
            </>
        ),
    },
};

export const AutoFillSm: Story = {
    args: {
        cols: 'auto-fill-sm',
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Fill 1</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Fill 2</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Fill 3</div>
            </>
        ),
    },
};

export const ColSpan: Story = {
    tags: ['desktop-chromium'],
    args: {
        cols: 12,
        children: (
            <>
                <Grid.Item colspan={4} className="ix-color-surface-info-default ix-px-md ix-py-2xs">
                    4 kolonner
                </Grid.Item>
                <Grid.Item colspan={8} className="ix-color-surface-info-default ix-px-md ix-py-2xs">
                    8 kolonner
                </Grid.Item>
                <Grid.Item colspan={6} className="ix-color-surface-info-default ix-px-md ix-py-2xs">
                    6 kolonner
                </Grid.Item>
                <Grid.Item colspan={6} className="ix-color-surface-info-default ix-px-md ix-py-2xs">
                    6 kolonner
                </Grid.Item>
                <Grid.Item colspan="full" className="ix-color-surface-info-default ix-px-md ix-py-2xs">
                    Full bredde
                </Grid.Item>
            </>
        ),
    },
};

export const Rows2: Story = {
    args: {
        cols: 3,
        rows: 2,
        style: { height: '200px' },
    },
};

export const GapLg: Story = {
    args: { gap: 'lg' },
};

export const GapNone: Story = {
    args: { gap: 'none' },
};

export const AlignCenter: Story = {
    args: {
        align: 'center',
        style: { height: '150px' },
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Kort</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-xl">Høy</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Kort</div>
            </>
        ),
    },
};

export const AlignStretch: Story = {
    tags: ['desktop-chromium'],
    args: {
        align: 'stretch',
        style: { height: '150px' },
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Strekkes</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Strekkes</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">Strekkes</div>
            </>
        ),
    },
};

export const JustifyCenter: Story = {
    args: {
        justify: 'center',
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs" style={{ width: '80px' }}>
                    Sentrert
                </div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs" style={{ width: '80px' }}>
                    Sentrert
                </div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs" style={{ width: '80px' }}>
                    Sentrert
                </div>
            </>
        ),
    },
};

export const Inline: Story = {
    args: {
        inline: true,
        cols: 2,
        children: (
            <>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">A</div>
                <div className="ix-color-surface-info-default ix-px-md ix-py-2xs">B</div>
            </>
        ),
    },
};

export const HTML: Story = {
    render: () => (
        <div
            dangerouslySetInnerHTML={{
                __html: `
      <ix-grid cols="3" gap="md">
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">1</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">2</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">3</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">4</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">5</div>
        <div class="ix-color-surface-info-default ix-px-md ix-py-2xs">6</div>
      </ix-grid>
    `,
            }}
        />
    ),
};
