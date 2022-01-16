import { ElementHandle } from 'playwright';

export default class Utils {
  /** When using Jest, you cannot use Playwright assertions,
   * so this is a workaround to check CSS styles without using Playwright native assertions.
   * In addition, Playwright expect().toHaveCSS() does not compared computed CSS, in opposite this method */
  public async checkCSSProperty(
    element: ElementHandle<Node>,
    cssProperty: string,
    expectedValue: string
  ) {
    await element.evaluate(
      async (HTMLElement, args) => {
        const htmlElement = HTMLElement as Element;
        const cssProp = args[0];
        const currentCSSpropValue = window.getComputedStyle(htmlElement)[cssProp];

        const expecValue = args[1];
        if (currentCSSpropValue !== expecValue) {
          throw new Error(`Size selector buttons are not ${expecValue}`);
        }
      },
      [cssProperty, expectedValue]
    );
  }
}
