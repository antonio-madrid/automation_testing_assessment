import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import SizeSelectorComponent from '../../src/pages/components/SizeSelectorComponent/SizeSelectorComponent';
import URLBuilder from '../../src/tools/URLBuilder';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} first e2e test`, () => {
  // Browser conf
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  // Pages
  let sizeComponent: SizeSelectorComponent;

  let urlBuilder: URLBuilder;
  let url: URL;

  beforeAll(async () => {
    browser = await WebDriver.getInstance();
    context = await WebDriver.getContext(browser);
    page = await context.newPage();

    urlBuilder = new URLBuilder();
    url = urlBuilder.getURL();
  });

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });

  describe('Step 1 - Go to Index', () => {
    it('', async () => {});
  });

  describe('Step 2 - ', () => {
    it('', async () => {});
  });
});
