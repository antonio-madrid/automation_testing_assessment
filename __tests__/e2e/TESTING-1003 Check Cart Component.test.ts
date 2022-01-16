import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import CartComponent from '../../src/pages/components/CartComponent/CartComponent';
import CartCheckoutComponent from '../../src/pages/components/CartComponent/CartComponents/CartCheckoutComponent';
import CartIconComponent from '../../src/pages/components/CartComponent/CartComponents/CartIconComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../../src/validationData/IndexPageData';

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
  let cartCheckoutComponent: CartCheckoutComponent;

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

  describe('Step 1 - Go to Index page', () => {
    it('Should go to Index', async () => {
      indexPage = new IndexPage(page);

      await page.goto(baseUrl.href);
      await indexPage.waitUntilIsDisplayed();

      const currentTitle = await indexPage.getTitle();

      expect(currentTitle).toBe(expectedTitle);
    });

    describe('Step 2 - Open and Close Cart Component', () => {
      it('Should show cart component when clicking its icon', async () => {
        cartIconComponent = new CartIconComponent(page);
        await cartIconComponent.clickClosedCartIconSelector();

        cartComponent = new CartComponent(page);
        // If element is not into the DOM, Playwright will throw an error captured by Jest, indicating which element failed to load
        await cartComponent.waitUntilCartIsOpened();
      });

      it('Should close cart when clicking "X" button', async () => {
        await cartIconComponent.clickCloseCartIconSelector();
        await cartComponent.waitUntilCartIsNotOpened();
      });

      describe('Check dialog', () => {
        it('Should check out nothing', async () => {
          await cartIconComponent.clickClosedCartIconSelector();
          await cartComponent.waitUntilCartIsOpened();

          cartCheckoutComponent = new CartCheckoutComponent(page);

          let dialogMsg: string;
          page.once('dialog', async (dialog) => {
            dialogMsg = dialog.message();
            dialog.accept();
          });

          await cartCheckoutComponent.clickCheckout();

          expect(dialogMsg).toEqual('Add some product in the cart!');
        });
      });
    });
  });
});
