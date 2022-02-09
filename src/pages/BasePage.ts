import { ElementHandle, Locator, Page } from 'playwright';
import { Selector } from '../core/models/Selector';

/** It contains Page Object common methods */
export default abstract class {
  protected page: Page;

  private locators: Map<Selector, Locator>;

  protected constructor(page: Page) {
    this.page = page;
    this.locators = new Map();
  }

  public abstract waitUntilIsDisplayed(): void;

  private async throwCustomError(selector: Selector) {
    const redFontCode = '\x1b[31m';
    const restoreTerminalColorCode = '\x1b[0m';
    throw Error(redFontCode + selector.name + ' not found' + restoreTerminalColorCode);
  }

  /** It waits for elements to be present in DOM, if not, returns an error */
  protected async waitUntilIsDisplayedBase(selector: Selector) {
    try {
      await this.page.waitForSelector(selector.value, {
        state: 'attached',
        timeout: 7500
      });
    } catch (error) {
      this.throwCustomError(selector);
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
      this.throwCustomError(selector);
    }
  }

  /** It returns a Locator by given Select and stores a copy into a Map in order to avoid extra operations. */
  protected async getLocator(selector: Selector) {
    if (this.locators.has(selector)) {
      return this.locators.get(selector);
    } else {
      const isElementPresent = await this.isElementPresent(selector);
      if (isElementPresent) {
        const locator = this.page.locator(selector.value);
        this.locators.set(selector, locator);
        return locator;
      } else {
        this.throwCustomError(selector);
      }
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

  protected async getComputedCSSProperty(selector: Selector, cssProperty: string): Promise<string> {
    const locator = await this.getLocator(selector);
    const element = (await locator.elementHandle()) as ElementHandle<HTMLElement>;

    return element.evaluate(
      async (HTMLElement, args) => {
        const htmlElement = HTMLElement as Element;
        const cssProp = args[0];
        return window.getComputedStyle(htmlElement)[cssProp];
      },
      [cssProperty]
    );
  }
}
