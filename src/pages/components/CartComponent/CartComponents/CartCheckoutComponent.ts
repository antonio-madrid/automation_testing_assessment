import { Page } from 'playwright';
import { Selector } from '../../../../core/models/Selector';
import BasePage from '../../../BasePage';

export default class CartCheckoutComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly checkoutBtnSelector: Selector = {
    name: `${this.className}.checkoutBtnSelector`,
    value: 'div.buy-btn >> text="Checkout"'
  };

  private readonly subtotalSelector: Selector = {
    name: `${this.className}.subtotalSelector`,
    value: 'p.sub-price__val'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.checkoutBtnSelector);
  }

  public async clickCheckout() {
    const checkoutBtnLocator = await super.getLocator(this.checkoutBtnSelector);
    await checkoutBtnLocator.click();
  }

  public async getSubtotal() {
    const subtotalLocator = await super.getLocator(this.subtotalSelector);
    return subtotalLocator.innerText();
  }
}
