import { Page } from 'playwright';
import BasePage, { Selector } from '../../../BasePage';

export default class CartListComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly itemListContainerSelector: Selector = {
    name: `${this.className}.logoSelector`,
    value: 'div.float-cart__shelf-container'
  };

  private readonly itemsPriceSelector: Selector = {
    name: `${this.className}.itemsPriceSelector`,
    value: 'div.shelf-item__price'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.itemListContainerSelector);
  }

  public async getFirstItemPrice() {
    const itemsPriceLocator = await super.getLocator(this.itemsPriceSelector);
    const firstItemPriceLocator = itemsPriceLocator.locator('p');
    return firstItemPriceLocator.innerText();
  }
}
