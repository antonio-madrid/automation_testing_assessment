import { Page } from 'playwright';
import { Selector } from '../../../../core/models/Selector';
import BasePage from '../../../BasePage';

export default class CartIconComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly closedCartIconSelector: Selector = {
    name: `${this.className}.closedCartIconSelector`,
    value: 'span.bag.bag--float-cart-closed'
  };

  private readonly closeCartIconSelector: Selector = {
    name: `${this.className}.closeCartIconSelector`,
    value: '.float-cart__close-btn'
  };

  private readonly cartIconNumberSelector: Selector = {
    name: `${this.className}.cartIconNumberSelector`,
    value: 'span.bag__quantity'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.closedCartIconSelector);
  }

  public async clickClosedCartIcon() {
    const closedCartIconLocator = await super.getLocator(this.closedCartIconSelector);
    await closedCartIconLocator.click();
  }

  public async clickCloseCartIcon() {
    const closeCartIconLocator = await super.getLocator(this.closeCartIconSelector);
    await closeCartIconLocator.click();
  }

  public async getCartIconNumber() {
    const cartIconNumberLocator = await super.getLocator(this.cartIconNumberSelector);
    return cartIconNumberLocator.first().innerText();
  }
}
