import { Locator, Page } from 'playwright';

export interface Selector {
  name: string;
  value: string;
}

export enum WaitOptions {
  ATTACHED = 'attached',
  DETACHED = 'detached',
  VISIBLE = 'visible',
  HIDDEN = 'hidden'
}

/** It contains Page Object common methods */
export default abstract class {
  protected page: Page;

  private locators: Map<Selector, Locator>;

  protected constructor(page: Page) {
    this.page = page;
    this.locators = new Map();
  }

  public abstract waitUntilIsDisplayed(): void;

  /** It waits for elements to be present in DOM, if not, returns an error */
  protected async waitUntilIsDisplayedBase(selector: Selector) {
    try {
      await this.page.waitForSelector(selector.value, {
        state: 'attached',
        timeout: 7500
      });
    } catch (error) {
      const redFontCode = '\x1b[31m';
      const restoreTerminalcolorCode = '\x1b[0m';
      throw Error(redFontCode + selector.name + 'not found' + restoreTerminalcolorCode);
    }
  }

  /** It not waits for elements to be present in DOM, if not, returns an error */
  protected async waitUntilIsNotDisplayedBase(selector: Selector) {
    try {
      await this.page.waitForSelector(selector.value, {
        state: 'detached',
        timeout: 7500
      });
    } catch (error) {
      const redFontCode = '\x1b[31m';
      const restoreTerminalcolorCode = '\x1b[0m';
      throw Error(
        redFontCode + selector.name + ' not detached from HTML DOM' + restoreTerminalcolorCode
      );
    }
  }

  /** It returns a Locator by given Select and stores a copy into a Map in order to avoid extra operations. */
  protected async getLocator(selector: Selector) {
    if (this.locators.has(selector)) {
      return this.locators.get(selector);
    } else {
      const locator = this.page.locator(selector.value);
      this.locators.set(selector, locator);
      return locator;
    }
  }

  /** It checks when a Locator is not present in order to secure some operations. */
  protected async isElementPresent(selector: Selector) {
    const isLocatorPresent = await this.page.$(selector.value);

    if (isLocatorPresent) {
      return true;
    } else {
      return false;
    }
  }
}
