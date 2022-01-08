import path from 'path';
import dotenv from 'dotenv';
import playwright from 'playwright';
import fs from 'fs';

function getEnvironmentFileName() {
  const envArg = process.argv.filter((arg) => arg.startsWith('-env='))[0];

  let envFileName: string;
  if (envArg) {
    envFileName = '.env.' + envArg.split('=')[1];
    (global as any).env = envFileName;
  } else {
    envFileName = '.env';
    (global as any).env = 'dev';
  }

  return envFileName;
}

function setEnvironment(envFileName: string) {
  let envPath = path.resolve(__dirname, envFileName);

  if (!fs.existsSync(envPath)) {
    console.error(`Environment file does not exist - ${envPath}`);
    process.exit(1);
  }

  dotenv.config({ path: envPath });
}

function getBrowserType() {
  const browserArg = process.argv.filter((arg) => arg.startsWith('-b='))[0];

  let browserType: string;

  if (browserArg) {
    browserType = browserArg.split('=')[1];
  } else {
    browserType = 'chromium';
  }

  if (!playwright[browserType]) {
    console.error(`Invalid browser - ${browserType}`);
    process.exit(1);
  }

  return browserType;
}

function getDeviceType() {
  const deviceArg = process.argv.filter((arg) => arg.startsWith('-d='))[0];

  let deviceType: string;
  if (deviceArg) {
    deviceType = deviceArg.split('=')[1];
  } else {
    deviceType = undefined;
  }

  if (deviceType && !playwright.devices[deviceType]) {
    console.error(`Invalid device: ${deviceType}`);
    process.exit(1);
  }

  return deviceType;
}

function getTestTitle(browserType: string, device: string) {
  let tesTitle = `[${browserType}]`;

  if (device) {
    tesTitle += `[${device}]`;
  } else {
    tesTitle += '[Desktop]';
  }

  return tesTitle;
}

export = async () => {
  const envFileName = getEnvironmentFileName();
  setEnvironment(envFileName);

  const browserType = getBrowserType();
  const deviceType = getDeviceType();
  const testTitle = getTestTitle(browserType, deviceType);

  process.env.BROWSER_TYPE = browserType;
  process.env.DEVICE_TYPE = deviceType;
  process.env.TEST_TITLE = testTitle;

  global.__basedir = __dirname;
  global.browserType = process.env.BROWSER_TYPE;
  global.device = process.env.DEVICE_TYPE;
  global.title = process.env.TEST_TITLE;
};
