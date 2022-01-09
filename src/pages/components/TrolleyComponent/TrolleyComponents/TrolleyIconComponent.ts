import { Page } from 'playwright';
import BasePage, { Selector } from '../../../BasePage';

export default class TrolleyIconComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly logoSelector: Selector = {
    name: `${this.className}.logoSelector`,
    value: ''
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.logoSelector);
  }

  public async doSomething() {}

  private async doSomethingPrivately() {}
}
