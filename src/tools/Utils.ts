import { ElementHandle } from 'playwright';

export default class Utils {
  /** When using Jest, you cannot use Playwright assertions,
   * so this is a workaround to check CSS styles without using Playwright native assertions */
  public async checkCSSProperty(
    elementHandle: ElementHandle<Node>,
    cssProperty: string,
    expectedValue: string
  ) {
    await elementHandle.evaluate(
      async (HTMLElement, args) => {
        const element = HTMLElement as Element;
        const cssProp = args[0];
        const currentCSSpropValue = window.getComputedStyle(element)[cssProp];

        const expecValue = args[1];
        if (currentCSSpropValue !== expecValue) {
          throw new Error(`Size selector buttons are not ${expecValue}`);
        }
      },
      [cssProperty, expectedValue]
    );
  }
}
