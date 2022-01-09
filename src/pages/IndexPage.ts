import { Page } from 'playwright';
import BasePage from './BasePage';

export default class IndexPage extends BasePage {
  private readonly className = this.constructor.name;

  public constructor(page: Page) {
    super(page);
  }

  public async waitUntilIsDisplayed() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  public async getTitle() {
    return this.page.title();
  }
}
