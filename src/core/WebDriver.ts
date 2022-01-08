import playwright, { Browser, BrowserContext, BrowserType, LaunchOptions, Page } from 'playwright';

export enum Browsers {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox'
}

export interface BrowserOptions extends LaunchOptions {
  browserType?: Browsers;
}

export default class WebDriver {
  public static async getInstance(options?: BrowserOptions) {
    let browserType = process.env.BROWSER_TYPE ? process.env.BROWSER_TYPE : Browsers.CHROMIUM;
    if (options && options.browserType) {
      browserType = options.browserType;
    }

    let headless: boolean;
    if (options && options.headless) {
      headless = options.headless;
    } else {
      headless = process.env.HEADLESS === 'false' ? false : true;
    }
    if (global.env === 'prod') {
      headless = true;
    }

    let slowMo: number;
    if (options && options.slowMo) {
      slowMo = options.slowMo;
    } else {
      slowMo = 10;
    }

    let browser: Browser;
    const max_retries = 5;

    for (let i = 0; i < max_retries; i++) {
      try {
        browser = await (playwright[browserType] as BrowserType).launch({
          headless,
          slowMo,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-features=site-per-process'
          ]
        });
        if (browser) {
          return browser;
        }
      } catch (error) {
        console.error(error);
        console.warn('Unable to open playwright, retrying...');
      }

      console.warn('Max retries executed, will not try again');
      return undefined;
    }
  }

  public static async getContext(browser: Browser) {
    return browser.newContext();
  }
}
