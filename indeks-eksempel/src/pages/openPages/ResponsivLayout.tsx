import { Heading } from '@sb1/indeks-react';
import React from 'react';

const ResponsivLayout: React.FC = () => {
    return (
        <div className="ix-p-md ix-color-background-default">
            <Heading as="h1" addRecommendedSpacing>Responsiv layout</Heading>

            <Heading as="h2" addRecommendedSpacing>
                Responsiv grid
            </Heading>

            <div className="ix-grid ix-grid-cols-12 ix-gap-md ix-max-w-xl ix-mx-auto ix-mb-3xl ix-color-fill-danger-default">
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    1
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    2
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    3
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    4
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    5
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    6
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    7
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    8
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    9
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    10
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    11
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-1 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    12
                </div>
            </div>

            <div className="ix-grid ix-grid-cols-12 ix-gap-md ix-max-w-xl ix-mx-auto ix-mb-3xl ix-color-fill-danger-default">
                <div className="ix-col-span-4 ix-sm-col-span-2 ix-md-col-span-3 ix-lg-col-span-4 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    1
                </div>
                <div className="ix-col-span-8 ix-sm-col-span-2 ix-md-col-span-3 ix-lg-col-span-4 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    2
                </div>
                <div className="ix-col-span-8 ix-sm-col-span-4 ix-md-col-span-6 ix-lg-col-span-4 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    3
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-4 ix-md-col-span-2 ix-lg-col-span-2 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    4
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-3 ix-md-col-span-4 ix-lg-col-span-8 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    5
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-3 ix-md-col-span-2 ix-lg-col-span-2 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    6
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-4 ix-md-col-span-4 ix-lg-col-span-3 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    7
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-2 ix-md-col-span-4 ix-lg-col-span-3 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    8
                </div>
                <div className="ix-col-span-6 ix-sm-col-span-4 ix-md-col-span-4 ix-lg-col-span-3 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    9
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-8 ix-md-col-span-4 ix-lg-col-span-3 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    10
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-6 ix-md-col-span-6 ix-lg-col-span-8 ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    11
                </div>
                <div className="ix-col-span-4 ix-sm-col-span-6 ix-md-col-span-6 ix-lg-col-span-4 ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    12
                </div>
            </div>

            <Heading as={'h2'} className="ix-mb-md">
                Responsiv flex
            </Heading>

            <div
                className="
                ix-flex
                ix-gap-md
                ix-sm-justify-center
                ix-md-justify-end
                ix-lg-justify-between
                ix-xl-justify-evenly
                ix-max-w-xl
                ix-mx-auto
                ix-mb-3xl
                ix-p-sm
                ix-color-fill-danger-default"
            >
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    Element 1
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle">
                    Element 2
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    Element 3
                </div>
            </div>

            <div
                className="
                ix-flex
                ix-gap-md
                ix-justify-stretch
                ix-max-w-xl
                ix-mx-auto
                ix-mb-3xl
                ix-p-sm
                ix-color-fill-danger-default"
            >
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default ix-flex-grow ix-md-flex-grow-0">
                    Element 1
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle ix-flex-grow ix-sm-flex-grow-0     ix-md-flex-grow-0 ix-lg-flex-grow">
                    Element 2
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default ix-md-flex-grow ix-lg-flex-grow-0">
                    Element 3
                </div>
            </div>

            <div
                className="
                ix-flex
                ix-gap-md
                ix-justify-around
                ix-items-center
                ix-sm-flex-col
                ix-md-flex-row
                ix-lg-flex-col                
                ix-max-w-xl
                ix-mx-auto
                ix-mb-3xl
                ix-p-sm
                ix-color-fill-danger-default"
            >
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default">
                    Element 1
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-default ix-color-foreground-main-default-main-subtle ix-lg-self-stretch">
                    Element 2
                </div>
                <div className="ix-p-sm ix-text-center ix-color-fill-main-subtle ix-color-foreground-main-default ix-sm-self-start ix-lg-self-end">
                    Element 3
                </div>
            </div>
        </div>
    );
};

export default ResponsivLayout;
