import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import GridComponent from '../../src/pages/components/GridComponent/GridComponent';
import ShirtComponent from '../../src/pages/components/GridComponent/ShirtComponent/ShirtComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../validationData/IndexPageData';
import {
  expectedAddToCartText,
  expectedFreeShippingText
} from '../validationData/ShirtComponentData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} It checks Grid Component.`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let gridComponent: GridComponent;
  let shirtComponent: ShirtComponent;

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

      const title = await indexPage.getTitle();

      expect(title).toBe(expectedTitle);
    });

    describe('Step 2 - Check all "Free shipping" labels texts', () => {
      it('Should check all Free Shippings labels texts', async () => {
        shirtComponent = new ShirtComponent(page);

        const texts = await shirtComponent.getAllFreeShippingTexts();

        texts.forEach((text) => {
          expect(text).toBe(expectedFreeShippingText);
        });
      });
      describe('Step 3 - Check all "Add to cart" labels texts', () => {
        it('Should check all "Add to cart" labels texts', async () => {
          const texts = await shirtComponent.getAllAddToCartTexts();

          texts.forEach((text) => expect(text).toBe(expectedAddToCartText));
        });
      });
    });
  });
});
