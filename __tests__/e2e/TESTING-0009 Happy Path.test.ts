import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import CartComponent from '../../src/pages/components/CartComponent/CartComponent';
import ShelfComponent from '../../src/pages/components/ShelfComponent/ShelfComponent';
import SizeSelectorComponent from '../../src/pages/components/SizeSelectorComponent/SizeSelectorComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} first e2e test`, () => {
  // Browser conf
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let sizeSelectorComponent: SizeSelectorComponent;
  let shelfComponent: ShelfComponent;
  let cartComponent: CartComponent;

  let url: URL;

  beforeAll(async () => {
    browser = await WebDriver.getInstance();
    context = await WebDriver.getContext(browser);
    page = await context.newPage();

    let urlBuilder: URLBuilder;
    urlBuilder = new URLBuilder();
    url = urlBuilder.getURL();
  });

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });

  describe('Step 1 - Go to Index', () => {
    it('Should have main page displayed', async () => {
      await page.goto(url.href);

      indexPage = new IndexPage(page);
      await indexPage.waitUntilIsDisplayed();
    });

    it('Should have Size component displayed', async () => {
      sizeSelectorComponent = new SizeSelectorComponent(page);
      await sizeSelectorComponent.waitUntilIsDisplayed();
    });

    it('Should have Shelf component displayed', async () => {
      shelfComponent = new ShelfComponent(page);
      await shelfComponent.waitUntilIsDisplayed();
    });

    it('Should have Cart component displayed', async () => {
      cartComponent = new CartComponent(page);
      await cartComponent.waitUntilIsDisplayed();
    });
  });

  describe('Step 2 - Click XS shirt button', () => {
    it('Should have One item is displayed', async () => {
      console.log('WIP');
    });
  });
});
