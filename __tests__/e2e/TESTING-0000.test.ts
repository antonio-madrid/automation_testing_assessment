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

  describe('Step 1 - Go to Index', () => {
    it('Should go to Index', async () => {
      await page.goto('http://localhost:3000/');

      const title = await page.title();

      // await page.pause();

      expect(title).toBe('React Shopping Cart');
    });
  });
});
