import { Browser, BrowserContext, Page } from 'playwright';
import { SizeType } from '../../src/core/models/SizeType';
import WebDriver from '../../src/core/WebDriver';
import SizeSelectorComponent from '../../src/pages/components/SizeSelectorComponent/SizeSelectorComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';
import Utils from '../../src/tools/Utils';
import { expectedTitle } from '../../src/validationData/IndexPageData';
import { expectedTitleTest } from '../../src/validationData/SizeComponentData';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} It checks Size Selector Component.`, () => {
  // Browser conf references
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let sizeComponent: SizeSelectorComponent;

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
  });

  describe('Step 2 - Check Size Component', () => {
    it('Should have the correct title', async () => {
      sizeComponent = new SizeSelectorComponent(page);

      const currentTitle = await sizeComponent.getTitleText();
      expect(currentTitle).toBe(expectedTitleTest);
    });
  });

  describe('Step 3 - Check size buttons text', () => {
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
    });
  });

  describe('Step 4 -  Check buttons color', () => {
    it('Should have first button as grey', async () => {
      const currentFirstBtnColor = await sizeComponent.getFirstButtonColor();
      const grey = 'rgb(236, 236, 236)';

      expect(currentFirstBtnColor).toEqual(grey);
    });

    it('Should have all buttons colors as grey', async () => {
      const elementHandles = await sizeComponent.getSizeElements();

      const grey = 'rgb(236, 236, 236)';

      // When using Jest, you cannot use Playwright assertions,
      // so this is a workaround to check CSS styles without using Playwright native assertions
      for (let elementHandle of elementHandles) {
        await elementHandle.evaluate(async (HTMLElement, expectedColor) => {
          const element = HTMLElement as Element;
          const currentColor = window.getComputedStyle(element).backgroundColor;

          if (currentColor !== expectedColor) {
            throw new Error('Size selector buttons are not grey');
          }
        }, grey);
      }

      // new implementation
      const utils = new Utils();
      await utils.checkCSSProperty(elementHandles[0], 'backgroundColor', grey);

      const expectedCSSPropDisplayValue = 'block';
      const currentCSSPropDisplayValue = await sizeComponent.getSizeButtonCSSpropertyValue(
        SizeType.L,
        'display'
      );

      expect(currentCSSPropDisplayValue).toEqual(expectedCSSPropDisplayValue);
    });
  });
});
