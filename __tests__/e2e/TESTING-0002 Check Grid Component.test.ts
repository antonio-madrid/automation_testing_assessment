import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import ShelfComponent from '../../src/pages/components/ShelfComponent/ShelfComponent';
import ShirtComponent from '../../src/pages/components/ShelfComponent/ShirtComponent/ShirtComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../validationData/IndexPageData';
import {
  expectedAddToCartText,
  expectedFreeShippingText,
  itemTitles
} from '../validationData/ShirtComponentData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} It checks Grid Component.`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let gridComponent: ShelfComponent;
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

      const currentTitle = await indexPage.getTitle();

      expect(currentTitle).toBe(expectedTitle);
    });

    describe('Step 2 - Check all "Free shipping" labels texts', () => {
      it('Should check all Free Shippings labels texts', async () => {
        shirtComponent = new ShirtComponent(page);

        const currentTexts = await shirtComponent.getAllFreeShippingTexts();

        currentTexts.forEach((currentText) => {
          expect(currentText).toBe(expectedFreeShippingText);
        });
      });
    });

    describe('Step 3 - Check all "Add to cart" labels texts', () => {
      it('Should check all "Add to cart" labels texts', async () => {
        const currentTexts = await shirtComponent.getAllAddToCartTexts();

        currentTexts.forEach((currentText) => expect(currentText).toBe(expectedAddToCartText));
      });
    });

    describe('Step 4 - Check all item titles', () => {
      it('Should not have any item title repeated', async () => {
        const currentItemTitles = await shirtComponent.getAllItemNames();

        // This test always fails because 'Cat Tee Black T-Shirt' is repeated, that's an error
        expect(currentItemTitles).toHaveLength(new Set(currentItemTitles).size);
      });

      it('Should have all item titles ok', async () => {
        const currentItemTitles = await shirtComponent.getAllItemNames();

        const expectedItemsTitle = itemTitles;

        expect(currentItemTitles).toEqual(expectedItemsTitle);
      });
    });
  });
});
