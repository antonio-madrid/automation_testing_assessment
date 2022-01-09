import { Page } from 'playwright';
import BasePage, { Selector } from '../../BasePage';

export enum SizeType {
  X = 'X',
  XS = 'XS',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export default class SizeComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly titleSelector: Selector = {
    name: `${this.className}.title`,
    value: 'h4.title >>  text=Sizes'
  };

  private readonly SbuttonSelector: Selector = {
    name: `${this.className}.Sbutton`,
    value: 'input[type=checkbox][value=S]'
  };

  private readonly MbuttonSelector: Selector = {
    name: `${this.className}.Mbutton`,
    value: 'input[type=checkbox][value=L]'
  };

  private readonly MLbuttonSelector: Selector = {
    name: `${this.className}.MLbutton`,
    value: 'input[type=checkbox][value=ML]'
  };

  private readonly XLbuttonSelector: Selector = {
    name: `${this.className}.XLbutton`,
    value: 'input[type=checkbox][value=XL]'
  };

  private readonly XXbuttonSelector: Selector = {
    name: `${this.className}.XXLbutton`,
    value: 'input[type=checkbox][value=XXL]'
  };

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

  private getSizeButtonSelector(buttonType: SizeType) {
    const buttonSelector: Selector = {
      name: `${this.buttonBaseSelector.name}.${buttonType}`,
      value: `${this.buttonBaseSelector.value}${buttonType}]`
    };

    return buttonSelector;
  }

  public async getXSbuttonInputValue() {
    const XSbuttonSelector = this.getSizeButtonSelector(SizeType.XS);
    const XSinputLocator = await super.getLocator(XSbuttonSelector);

    return XSinputLocator.inputValue();
  }

  public async getLbuttonInputValue() {
    const LbuttonSelector = this.getSizeButtonSelector(SizeType.L);
    const LinputLocator = await super.getLocator(LbuttonSelector);

    return LinputLocator.inputValue();
  }

  public async getButtonInputValue(sizeType: SizeType) {
    const buttonSelector = this.getSizeButtonSelector(sizeType);
    const inputLocator = await super.getLocator(buttonSelector);

    return inputLocator.inputValue();
  }

  public async selectLbutton() {
    const LbuttonSelector = this.getSizeButtonSelector(SizeType.L);
    const LinputLocator = await super.getLocator(LbuttonSelector);

    await LinputLocator.click();
  }
}
