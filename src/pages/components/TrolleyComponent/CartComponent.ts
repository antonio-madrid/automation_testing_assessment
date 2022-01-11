import { Page } from 'playwright';
import BasePage, { Selector, WaitOptions } from '../../BasePage';

export default class CartComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly cartComponentSelector: Selector = {
    name: `${this.className}.cartComponentSelector`,
    value: '.float-cart.float-cart--open'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.cartComponentSelector);
  }

  public async waitUntilIsNotDisplayed() {
    await super.waitUntilIsNotDisplayedBase(this.cartComponentSelector);
  }
}
