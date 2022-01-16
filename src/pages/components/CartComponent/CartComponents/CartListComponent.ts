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

  private readonly itemTitleSelector: Selector = {
    name: `${this.className}.itemTitleSelector`,
    value: 'div.shelf-item__details >> p.title'
  };

  private readonly itemCrossBtnSelector: Selector = {
    name: `${this.className}.itemCrossBtnSelector`,
    value: 'div.shelf-item__del'
  };

  private readonly itemQuantitySelector: Selector = {
    name: `${this.className}.itemCrossBtnSelector`,
    value: 'div.shelf-item__details >> p.desc'
  };

  private readonly itemMinusBtnSelector: Selector = {
    name: `${this.className}.itemMinusBtnSelector`,
    value: 'button.change-product-button >> text="-"'
  };

  private readonly itemThumbSelector: Selector = {
    name: `${this.className}.itemThumbSelector`,
    value:
      'div.float-cart__shelf-container >> div.shelf-item >> div.shelf-item__thumb >> img[alt="Cat Tee Black T-Shirt"]'
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

  public async getItemTitle() {
    const itemTitleLocator = await super.getLocator(this.itemTitleSelector);
    return itemTitleLocator.innerText();
  }

  public async isItemCrossBtnVisible() {
    const crossBtnLocator = await super.getLocator(this.itemCrossBtnSelector);
    return crossBtnLocator.isVisible();
  }

  public async isMinusBtnDisabled() {
    const itemMinusBtnSelector = await super.getLocator(this.itemMinusBtnSelector);
    return itemMinusBtnSelector.isDisabled();
  }

  public async getItemQuantity() {
    const quantityLocator = await super.getLocator(this.itemQuantitySelector);
    return quantityLocator.innerText();
  }

  public async getItemThumbImg() {
    const thumbLocator = await super.getLocator(this.itemThumbSelector);
    return thumbLocator.screenshot();
  }
}
