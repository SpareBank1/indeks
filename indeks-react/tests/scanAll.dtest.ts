import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// const context = await browser.newContext();
// const page = await context.newPage();

// const getLinks = (heading: string) =>
//   page
//     .getByRole("heading", { name: heading })
//     .locator("//following-sibling::ul")
//     .getByRole("link");

// Fetch JSON using Node.js built-in fetch
console.log('Fetching stories');

let stories;
try {
  const response = await fetch('http://localhost:9009/index.json');
  stories = await response.json();
} catch (error) {
  throw new Error('Failed to fetch stories: ' + (error instanceof Error ? error.message : String(error)));
}

type StoryEntry = {
  id: string;
  name: string;
  title: string;
  type: string;
  [key: string]: unknown;
};

const componentStories = Object.values(stories.entries)
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

// console.log("Component Stories:", componentStories);


test.describe('Test all components', () => {
  //   test.beforeAll(async ({ page }) => {
  //     // const context = await browser.newContext();
  //     // page = await context.newPage();
  //     await goToLandingPage(page);
  //   });

  // test.afterAll(async () => {
  //     await page.close();
  // });

  Object.entries(componentStories).forEach(([title, stories]) => {
    test.describe(title, () => {
      stories.forEach((story) => {
        test(story.name, async ({ page }) => {
          console.log(`Testing story: ${story.name}`);
          await page.goto(
            `http://localhost:9009/iframe.html?globals=scheme%3Aboth&args=&id=${story.id}&viewMode=story`,
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
            .analyze();

          expect(
            accessibilityScanResults.violations
            // ,
            // `To add exception add them as ${story.id}`
          ).toEqual([]);
        });
      });
    });
  });

  //   test("Accordion", async ({ page }) => {
  //     await page.goto("http://localhost:9009/", { timeout: 10000 });

  //     const links = await page.getByRole("link");
  //     console.log("Page loaded successfully", links);
  //   });
});

// TODO contrast test does not work
