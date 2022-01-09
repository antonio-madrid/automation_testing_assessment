import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import SizeComponent, { SizeType } from '../../src/pages/components/SizeComponent/SizeComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import { expectedTitle } from '../validationData/indexPageData';
import { expectedTitleTest } from '../validationData/sizeComponentData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} It checks all values of size component are ok.`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let sizeComponent: SizeComponent;

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

    describe('Step 2 - Check Size Component', () => {
      describe('Check Size Component title', () => {
        it('Should have the correct text', async () => {
          sizeComponent = new SizeComponent(page);

          const currentTitle = await sizeComponent.getTitleText();
          expect(currentTitle).toBe(expectedTitleTest);
        });
      });

      describe('Check size buttons text', () => {
        it('Should check that all buttons have the correct text', async () => {
          let currentValue = await sizeComponent.getButtonInputValue(SizeType.XS);
          expect(currentValue).toBe(SizeType.XS);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.S);
          expect(currentValue).toBe(SizeType.S);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.M);
          expect(currentValue).toBe(SizeType.M);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.ML);
          expect(currentValue).toBe(SizeType.ML);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.L);
          expect(currentValue).toBe(SizeType.L);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.XL);
          expect(currentValue).toBe(SizeType.XL);

          currentValue = await sizeComponent.getButtonInputValue(SizeType.XXL);
          expect(currentValue).toBe(SizeType.XXL);
          // await page.pause();
        });
      });
    });
  });
});
