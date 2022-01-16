import { Page } from 'playwright';
import BasePage, { Selector } from '../../BasePage';

export enum SizeType {
  XS = 'XS',
  S = 'S',
  M = 'M',
  ML = 'ML',
  L = 'L',
  X = 'X',
  XL = 'XL',
  XXL = 'XXL'
}

export default class SizeSelectorComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly titleSelector: Selector = {
    name: `${this.className}.title`,
    value: 'h4.title >>  text=Sizes'
  };

  private readonly buttonBaseSelector: Selector = {
    name: this.className,
    value: 'span.checkmark >> text="'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.titleSelector);
  }

  /** It reduces repetitive code, creating selectors on the fly. Alternative is getting lot of boiler plate code and selectors around the class, having almost the same code. */
  private getSizeButtonSelector(buttonType: SizeType) {
    const buttonSelector: Selector = {
      name: `${this.buttonBaseSelector.name}.${buttonType}`,
      value: `${this.buttonBaseSelector.value}${buttonType}"`
    };

    return buttonSelector;
  }

  /** It reduces repetitive code, creating selectors on the fly. Alternative is getting lots of getters for the purpose. */
  public async getButtonInputValue(sizeType: SizeType) {
    const buttonSelector = this.getSizeButtonSelector(sizeType);
    const buttonLocator = await super.getLocator(buttonSelector);

    return buttonLocator.innerText();
  }

  public async selectSize(sizeType: SizeType) {
    const buttonSelector = this.getSizeButtonSelector(sizeType);
    const buttonLocator = await super.getLocator(buttonSelector);
    await buttonLocator.click();
  }

  public async getTitleText() {
    const titleLocator = await super.getLocator(this.titleSelector);
    return titleLocator.innerText();
  }

  public async getFirstButtonColor() {
    const firstButtonLocator = this.page
      .locator('.filters-available-size label .checkmark')
      .first();

    const computerizedCSSstyle = await firstButtonLocator.evaluate((HTMLElement) => {
      const element = HTMLElement as Element;
      return window.getComputedStyle(element);
    });

    return computerizedCSSstyle.backgroundColor;
  }

  public async getSizeElements() {
    const properLocator = this.page.locator('.filters-available-size label .checkmark');
    return properLocator.elementHandles();
  }
}
