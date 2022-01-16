import { Page } from 'playwright';
import BasePage, { Selector } from '../../../BasePage';

export default class ShirtComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly freeShippingSelector: Selector = {
    name: `${this.className}.freeShippingSelector`,
    value: 'div.shelf-stopper >> text="Free shipping"'
  };

  private readonly addToCartSelector: Selector = {
    name: `${this.className}.addToCartSelector`,
    value: 'div.shelf-item__buy-btn >> text="Add to cart"'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.freeShippingSelector);
  }

  public async getFirstFreeShippingSelectorText() {
    return this.page.locator(this.freeShippingSelector.value).first().innerText();
  }

  public async getAllFreeShippingTexts() {
    // Locators strictness = locator throw an error if more than element is pointed, but it can handle multiple elements with special methods
    return this.page.locator(this.freeShippingSelector.value).allInnerTexts();
  }

  public async getAllAddToCartTexts() {
    return this.page.locator(this.addToCartSelector.value).allInnerTexts();
  }

  public async getAllItemNames() {
    return this.page.locator('p.shelf-item__title').allInnerTexts();
  }
}
