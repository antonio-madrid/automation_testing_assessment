import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import CartComponent from '../../src/pages/components/TrolleyComponent/CartComponent';
import CartIconComponent from '../../src/pages/components/TrolleyComponent/CartComponents/CartIconComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../validationData/IndexPageData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} It checks Cart Component.`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let cartIconComponent: CartIconComponent;
  let cartComponent: CartComponent;

  // Base URI building references
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

  describe('Step 1 - Go to Index page', () => {
    it('Should go to Index', async () => {
      indexPage = new IndexPage(page);

      await page.goto(url.href);
      await indexPage.waitUntilIsDisplayed();

      const currentTitle = await indexPage.getTitle();

      expect(currentTitle).toBe(expectedTitle);
    });

    describe('Step 2 - Open Cart Component', () => {
      it('Should show cart component when clicking its icon', async () => {
        cartIconComponent = new CartIconComponent(page);
        await cartIconComponent.clickClosedCartIconSelector();

        cartComponent = new CartComponent(page);
        // If element is not into the DOM, Playwright will throw an error captured by Jest, indicating which element failed to load
        await cartComponent.waitUntilIsDisplayed();
      });

      it('Should close cart when clicking "X" button', async () => {
        await cartIconComponent.clickCloseCartIconSelector();
        await cartComponent.waitUntilIsNotDisplayed();
      });
    });
  });
});
