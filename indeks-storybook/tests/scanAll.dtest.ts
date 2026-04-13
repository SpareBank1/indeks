import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// Allowlist: bare story-titler som er oppført her blir testet.
// Legg til nye titler etter hvert som komponenter er klare for skjermbilde- og UU-testing.
const ALLOWED_STORY_TITLES: string[] = ['Form/TextField', 'Form/TextArea'];

console.log('Fetching stories');

let stories;
try {
    const response = await fetch('http://localhost:9009/index.json');
    stories = await response.json();
} catch (error) {
    throw new Error('Failed to fetch stories: ' + (error instanceof Error ? error.message : String(error)), {
        cause: error,
    });
}

type StoryEntry = {
    id: string;
    name: string;
    title: string;
    type: string;
    [key: string]: unknown;
};

const allStories = Object.values(stories.entries)
    .filter(
        (value): value is StoryEntry =>
            typeof value === 'object' && value !== null && 'type' in value && value['type'] === 'story'
    )
    .reduce((acc: Record<string, StoryEntry[]>, value: StoryEntry) => {
        if (!acc[value.title]) {
            acc[value.title] = [];
        }
        acc[value.title].push(value);
        return acc;
    }, {});

// Filtrer ned til bare de komponentene som er i allowlisten
const componentStories =
    ALLOWED_STORY_TITLES.length > 0
        ? Object.fromEntries(Object.entries(allStories).filter(([title]) => ALLOWED_STORY_TITLES.includes(title)))
        : allStories;

test.describe('Test all components', () => {
    Object.entries(componentStories).forEach(([title, stories]) => {
        test.describe(title, () => {
            stories.forEach((story) => {
                test(story.name, async ({ page }, testInfo) => {
                    const isMobile = testInfo.project.name.startsWith('mobile-');
                    const device = isMobile ? 'mobile' : 'desktop';
                    console.log(`Testing story: ${story.name} (${device})`);
                    await page.goto(
                        `http://localhost:9009/iframe.html?globals=scheme%3Aboth%3Bdevice%3A${device}&args=&id=${story.id}&viewMode=story`,
                        {
                            timeout: 10000,
                        }
                    );
                    await page.locator('#storybook-root').isVisible();

                    const storiesContainer = page.locator('#stories-container');
                    await storiesContainer.waitFor({ state: 'visible' });
                    await expect(storiesContainer).toHaveScreenshot();

                    const accessibilityScanResults = await new AxeBuilder({
                        page,
                    })
                        .disableRules(['heading-order', 'page-has-heading-one', 'landmark-one-main', 'region'])
                        // Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
                        // TODO: Vurder om vi likevel ønsker tilstrekkelig kontrast på disabled-felter.
                        .exclude('[disabled]')
                        .exclude('[aria-disabled="true"]')
                        .exclude('ix-field:has(:disabled)')
                        .analyze();

                    expect(accessibilityScanResults.violations).toEqual([]);
                });
            });
        });
    });
});
