import { Page } from 'playwright';
import BasePage, { Selector } from '../../../BasePage';

export default class CartCheckoutComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly checkoutBtnSelector: Selector = {
    name: `${this.className}.checkoutBtnSelector`,
    value: 'div.buy-btn >> text="Checkout"'
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
}
