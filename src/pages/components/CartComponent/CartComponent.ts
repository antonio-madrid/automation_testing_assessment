import { Page } from 'playwright';
import BasePage, { Selector, WaitOptions } from '../../BasePage';

export default class CartComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly cartComponentSelector: Selector = {
    name: `${this.className}.cartComponentSelector`,
    value: 'div.float-cart'
  };

  private readonly openedCartComponentSelector: Selector = {
    name: `${this.className}.openedCartComponentSelector`,
    value: '.float-cart.float-cart--open'
  };
  // float-cart float-cart--open

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.cartComponentSelector);
  }

  public async waitUntilCartIsOpened() {
    await super.waitUntilIsDisplayedBase(this.openedCartComponentSelector);
  }

  public async waitUntilCartIsNotOpened() {
    await super.waitUntilIsNotDisplayedBase(this.openedCartComponentSelector);
  }
}
