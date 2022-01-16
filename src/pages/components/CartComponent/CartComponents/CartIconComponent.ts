import { Page } from 'playwright';
import BasePage, { Selector } from '../../../BasePage';

export default class CartIconComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  // CSS Selector tip = to indicate more than one class, write each class without spaces and with its dot
  private readonly closedCartIconSelector: Selector = {
    name: `${this.className}.closedCartIconSelector`,
    value: 'span.bag.bag--float-cart-closed'
  };

  private readonly closeCartIconSelector: Selector = {
    name: `${this.className}.closeCartIconSelector`,
    value: '.float-cart__close-btn'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.closedCartIconSelector);
  }

  public async clickClosedCartIconSelector() {
    const closedCartIconLocator = await super.getLocator(this.closedCartIconSelector);
    await closedCartIconLocator.click();
  }

  public async clickCloseCartIconSelector() {
    const closeCartIconLocator = await super.getLocator(this.closeCartIconSelector);
    await closeCartIconLocator.click();
  }
}
