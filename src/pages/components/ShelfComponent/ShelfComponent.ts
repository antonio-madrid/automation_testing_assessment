import { Page } from 'playwright';
import { Selector } from '../../../core/models/Selector';
import BasePage from '../../BasePage';

// Idea to have this component as a Facade of its subcomponents
export default class ShelfComponent extends BasePage {
  private readonly className = this.constructor.name;

  // Selectors
  private readonly shelfContainer: Selector = {
    name: `${this.className}.shelfContainer`,
    value: 'div.shelf-container'
  };

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await super.waitUntilIsDisplayedBase(this.shelfContainer);
  }
}
