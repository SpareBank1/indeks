import { Grid, Heading } from '@sb1/indeks-react';
import React from 'react';

const GridKomponent: React.FC = () => {
    return (
        <div className="ix-p-md ix-color-background-default">
            <Heading as="h1" addRecommendedSpacing>Grid-komponent</Heading>

            <Grid cols={3} gap="md" className="ix-mb-md">
                <div className="ix-p-md ix-color-surface-main-default">1</div>
                <div className="ix-p-md ix-color-surface-main-default">2</div>
                <div className="ix-p-md ix-color-surface-main-default">3</div>
            </Grid>

            <Grid cols={4} gap="md" className="ix-mb-md">
                <div className="ix-p-md ix-color-surface-main-default">1</div>
                <div className="ix-p-md ix-color-surface-main-default">2</div>
                <div className="ix-p-md ix-color-surface-main-default">3</div>
                <div className="ix-p-md ix-color-surface-main-default">4</div>
            </Grid>

            <Grid cols={6} gap="md" className="ix-mb-md">
                <div className="ix-p-md ix-color-surface-main-default">1</div>
                <div className="ix-p-md ix-color-surface-main-default">2</div>
                <div className="ix-p-md ix-color-surface-main-default">3</div>
                <div className="ix-p-md ix-color-surface-main-default">4</div>
                <div className="ix-p-md ix-color-surface-main-default">5</div>
                <div className="ix-p-md ix-color-surface-main-default">6</div>
            </Grid>

            <Grid cols={12} gap="md" className="ix-mb-md">
                {Array.from({ length: 12 }, (_, index) => (
                    <div key={index} className="ix-p-md ix-color-surface-main-default">
                        {index + 1}
                    </div>
                ))}
            </Grid>

            <Heading as="h2" addRecommendedSpacing>Colspan (12 kolonner by default)</Heading>
            <Grid gap="md" className="ix-mb-md">
                <Grid.Item colspan={4} className="ix-p-md ix-color-surface-main-default">
                    1 (colspan=4)
                </Grid.Item>
                <Grid.Item colspan={8} className="ix-p-md ix-color-surface-main-default">
                    2 (colspan=8)
                </Grid.Item>
                <Grid.Item colspan={6} className="ix-p-md ix-color-surface-main-default">
                    3 (colspan=6)
                </Grid.Item>
                <Grid.Item colspan={6} className="ix-p-md ix-color-surface-main-default">
                    4 (colspan=6)
                </Grid.Item>
                <Grid.Item colspan="full" className="ix-p-md ix-color-surface-main-default">
                    5 (colspan=full)
                </Grid.Item>
            </Grid>
        </div>
    );
};

export default GridKomponent;
