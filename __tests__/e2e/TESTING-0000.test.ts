import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} first e2e test`, () => {
  // Browser conf
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  // Pages

  beforeAll(async () => {
    browser = await WebDriver.getInstance();
    context = await WebDriver.getContext(browser);
    page = await context.newPage();
  });

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });

  describe('Step 1 - Go to Wikipedia', () => {
    it('Should go to Wikipedia', async () => {
      await page.goto('https://www.wikipedia.org');

      const title = await page.title();

      // await page.pause();

      // expect(title).toBe('React Shopping Cart');
    });
  });
});
