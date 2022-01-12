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

  /** It serves as a base for all button selectors, the rest are created dynamically on the fly. */
  private readonly buttonBaseSelector: Selector = {
    name: this.className,
    value: 'input[type=checkbox][value='
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
      value: `${this.buttonBaseSelector.value}${buttonType}]`
    };

    return buttonSelector;
  }

  /** It reduces repetitive code, creating selectors on the fly. Alternative is getting lots of getters for the purpose. */
  public async getButtonInputValue(sizeType: SizeType) {
    const buttonSelector = this.getSizeButtonSelector(sizeType);
    const inputLocator = await super.getLocator(buttonSelector);

    return inputLocator.inputValue();
  }

  public async getTitleText() {
    const titleLocator = await super.getLocator(this.titleSelector);
    return titleLocator.innerText();
  }

  // TODO: WIP: somehow, element styles cannot be retrieved, neither by querySelector()
  public async checkStyle() {
    const properLocator = this.page.locator('.filters-available-size label .checkmark').first();

    const computerizedCSSstyle = await properLocator.evaluate((HTMLElement) => {
      const element = HTMLElement as Element;
      return window.getComputedStyle(element);
    });

    console.log(computerizedCSSstyle.backgroundColor);
  }
}
