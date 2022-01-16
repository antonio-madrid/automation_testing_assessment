import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import CartComponent from '../../src/pages/components/CartComponent/CartComponent';
import ShelfComponent from '../../src/pages/components/ShelfComponent/ShelfComponent';
import ShirtComponent from '../../src/pages/components/ShelfComponent/ShirtComponent/ShirtComponent';
import SizeSelectorComponent, {
  SizeType
} from '../../src/pages/components/SizeSelectorComponent/SizeSelectorComponent';
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
  let shirtComponent: ShirtComponent;

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

  describe('Step 1 - Go to Index', () => {
    it('Should have main page displayed', async () => {
      await page.goto(baseUrl.href);

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
    it('Should have one single item displayed', async () => {
      await sizeSelectorComponent.selectSize(SizeType.XS);
      shirtComponent = new ShirtComponent(page);

      // Workaround to let actions happen, I could not be able to avoid the using of explicit wait in this part
      await page.waitForTimeout(1000);

      const currentNumberOfItemsShown = await shirtComponent.getNumberOfItemsShown();
      expect(currentNumberOfItemsShown).toBe(1);
    });

    it('Should have item with title "Cat Tee Black T-Shirt"', async () => {
      const expectedItemName = 'Cat Tee Black T-Shirt';

      const currentItemsNames = await shirtComponent.getAllItemsNames();
      const currentItemName = currentItemsNames[0];

      expect(currentItemName).toEqual(expectedItemName);
    });

    it('Should have item with price "10.90"', async () => {
      const expectedItemPrice = '$10.90';

      const currentItemsPrices = await shirtComponent.getAllItemsPrices();
      const currentItemPrice = currentItemsPrices[0];

      expect(currentItemPrice).toEqual(expectedItemPrice);
    });

    it('Should have item with "Free shipping" label', async () => {
      const expectedFreeShippingText = 'Free shipping';

      const currentFreeShippingsTexts = await shirtComponent.getAllFreeShippingTexts();
      const currentFreeShippingText = currentFreeShippingsTexts[0];

      expect(currentFreeShippingText).toEqual(expectedFreeShippingText);
    });

    it('Should have item with its proper image', async () => {
      // Using Jest image comparator, Playwright has a better implementation,
      // but in order to use it, you have to dismiss Jest as a test runner
      const currentSnapshot = await page.screenshot();
      expect(currentSnapshot).toMatchSnapshot();
    });
  });

  describe('Step 3 - ', () => {});
});
