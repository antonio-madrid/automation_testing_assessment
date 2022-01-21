import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../../src/validationData/IndexPageData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} Trying out Docker network availability connection`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;

  let baseUrl: URL;

  beforeAll(async () => {
    browser = await WebDriver.getInstance();
    context = await WebDriver.getContext(browser);
    page = await context.newPage();

    let urlBuilder: URLBuilder;
    urlBuilder = new URLBuilder();
    baseUrl = urlBuilder.getURL();
  });

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });

  // Docker tests must be ran with flag env=prod
  describe('Step 1 -  Check connectivity going to Wikipedia main page and checking its title', () => {
    it('Should go to Wikipedia main page and check its title', async () => {
      const wikipediaUrl = 'https://www.wikipedia.org/';
      await page.goto(wikipediaUrl);

      const wikipediaTitleSelector = 'h1 >> span >> text="Wikipedia"';
      await page.waitForSelector(wikipediaTitleSelector);

      const wikipediaExpectedTitle = await page.innerText(wikipediaTitleSelector);
      expect(wikipediaExpectedTitle).toEqual('Wikipedia');
    });
  });

  describe('Step 2 - Check connectivity going to eCommerce Index page and checking its title', () => {
    it('Should go to eCommerce Index page and check its title', async () => {
      indexPage = new IndexPage(page);

      await page.goto(baseUrl.href);
      await indexPage.waitUntilIsDisplayed();

      const currentTitle = await indexPage.getTitle();

      expect(currentTitle).toBe(expectedTitle);
    });
  });
});
