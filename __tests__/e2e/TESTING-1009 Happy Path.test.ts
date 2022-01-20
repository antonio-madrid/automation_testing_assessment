import { Browser, BrowserContext, Page } from 'playwright';
import WebDriver from '../../src/core/WebDriver';
import CartComponent from '../../src/pages/components/CartComponent/CartComponent';
import CartCheckoutComponent from '../../src/pages/components/CartComponent/CartComponents/CartCheckoutComponent';
import CartIconComponent from '../../src/pages/components/CartComponent/CartComponents/CartIconComponent';
import CartListComponent from '../../src/pages/components/CartComponent/CartComponents/CartListComponent';
import ShelfComponent from '../../src/pages/components/ShelfComponent/ShelfComponent';
import ShirtComponent from '../../src/pages/components/ShelfComponent/ShirtComponent/ShirtComponent';
import SizeSelectorComponent, {
  SizeType
} from '../../src/pages/components/SizeSelectorComponent/SizeSelectorComponent';
import IndexPage from '../../src/pages/IndexPage';
import URLBuilder from '../../src/tools/URLBuilder';

jest.setTimeout(300000);

describe(`${process.env.TEST_TITLE} first e2e test`, () => {
  // Browser conf
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Pages
  let indexPage: IndexPage;
  let sizeSelectorComponent: SizeSelectorComponent;
  let shelfComponent: ShelfComponent;
  let cartComponent: CartComponent;
  let shirtComponent: ShirtComponent;
  let cartIconComponent: CartIconComponent;
  let cartCheckoutComponent: CartCheckoutComponent;
  let cartListComponent: CartListComponent;

  let baseUrl: URL;

  beforeAll(async () => {
    browser = await WebDriver.getInstance();
    context = await WebDriver.getContext(browser);
    page = await context.newPage();

    let urlBuilder: URLBuilder;
    urlBuilder = new URLBuilder();
    baseUrl = urlBuilder.getURL();
  });

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });

  describe('Step 1 - Go to Index', () => {
    it('Should have main page displayed', async () => {
      await page.goto(baseUrl.href);

      indexPage = new IndexPage(page);
      await indexPage.waitUntilIsDisplayed();
    });

    it('Should have Size component displayed', async () => {
      sizeSelectorComponent = new SizeSelectorComponent(page);
      await sizeSelectorComponent.waitUntilIsDisplayed();
    });

    it('Should have Shelf component displayed', async () => {
      shelfComponent = new ShelfComponent(page);
      await shelfComponent.waitUntilIsDisplayed();
    });

    it('Should have Cart component displayed', async () => {
      cartComponent = new CartComponent(page);
      await cartComponent.waitUntilIsDisplayed();
    });
  });

  describe('Step 2 - Click XS shirt button', () => {
    it('Should have one single item displayed', async () => {
      await sizeSelectorComponent.selectSize(SizeType.XS);
      shirtComponent = new ShirtComponent(page);

      // Workaround to let actions happen, I could not be able to avoid the using of explicit wait in this part
      await page.waitForTimeout(1000);

      const currentNumberOfItemsShown = await shirtComponent.getNumberOfItemsShown();
      expect(currentNumberOfItemsShown).toBe(1);
    });

    it('Should have item with title "Cat Tee Black T-Shirt"', async () => {
      const expectedItemTitle = 'Cat Tee Black T-Shirt';

      const currentItemsTitles = await shirtComponent.getAllItemsTitles();
      const currentItemTite = currentItemsTitles[0];

      expect(currentItemTite).toEqual(expectedItemTitle);
    });

    it('Should have item with price "10.90"', async () => {
      const expectedItemPrice = '$10.90';

      const currentItemsPrices = await shirtComponent.getAllItemsPrices();
      const currentItemPrice = currentItemsPrices[0];

      expect(currentItemPrice).toEqual(expectedItemPrice);
    });

    it('Should have item with "Free shipping" label', async () => {
      const expectedFreeShippingText = 'Free shipping';

      const currentFreeShippingsTexts = await shirtComponent.getAllFreeShippingTexts();
      const currentFreeShippingText = currentFreeShippingsTexts[0];

      expect(currentFreeShippingText).toEqual(expectedFreeShippingText);
    });

    it('Should have item with its proper image', async () => {
      // Using Jest image comparator, Playwright has a better implementation,
      // but in order to use it, you have to dismiss Jest as a test runner
      const currentSnapshot = await page.screenshot();
      expect(currentSnapshot).toMatchSnapshot();
    });
  });

  describe('Step 3 - Click "Add to cart"', () => {
    it('Should click "Add to cart" and open Cart component', async () => {
      await shirtComponent.clickAddToCart();

      cartIconComponent = new CartIconComponent(page);
      await cartComponent.waitUntilCartIsOpened();
    });

    it('Should have cart icon with number 1', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();
      expect(currentCartIconNumber).toBe('1');
    });

    describe('SubStep - Check out new item added', () => {
      it('Should have its price as $ 10.90', async () => {
        cartListComponent = new CartListComponent(page);
        const expectedItemPrice = '$ 10.90';

        const currentItemPrice = await cartListComponent.getFirstItemPrice();
        expect(currentItemPrice).toEqual(expectedItemPrice);
      });

      it('Should have its title as "Cat Tee Black T-Shirt"', async () => {
        const expectedItemName = 'Cat Tee Black T-Shirt';

        const currentItemName = await cartListComponent.getItemTitle();

        expect(currentItemName).toEqual(expectedItemName);
      });

      it('Should have a cross button visible', async () => {
        const isCrossBtnVisible = await cartListComponent.isItemCrossBtnVisible();
        expect(isCrossBtnVisible).toBeTruthy();
      });

      it('Should have its "Quantity" number as 1', async () => {
        const expectedQuantity = await cartListComponent.getItemQuantity();
        expect(expectedQuantity).toContain('Quantity: 1');
      });

      it('Should have a minus button disabled', async () => {
        const isMinusBtnDisabled = await cartListComponent.isMinusBtnDisabled();
        expect(isMinusBtnDisabled).toBeTruthy();
      });

      it('Should have its proper image', async () => {
        const thumbImg = await cartListComponent.getItemThumbImg();
        expect(thumbImg).toMatchSnapshot();
      });
    });

    it('Should have Cart Checkout component with subtotal as "$ 10.90"', async () => {
      cartCheckoutComponent = new CartCheckoutComponent(page);
      const expectedSubtotal = '$ 10.90';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();
      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 4 - Click "CHECKOUT" button', () => {
    it('Should click "CHECKOUT" button, display a dialog and click OK', async () => {
      const expectedDialogMsg = 'Checkout - Subtotal: $ 10.90';

      let currentDialogMsg: string;
      page.once('dialog', async (dialog) => {
        currentDialogMsg = dialog.message();
        dialog.accept();
      });

      await cartCheckoutComponent.clickCheckout();

      expect(currentDialogMsg).toEqual(expectedDialogMsg);
    });
  });

  describe('Step 5 - Click cross button of new item', () => {
    it('Should click cross button of new item and shelf would be empty', async () => {
      await cartListComponent.clickItemCrossBtn();

      await cartListComponent.waitUntilShelfIsEmpty();
    });

    it('Should have cart icon with number 0', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('0');
    });

    it('Should appears "Add some products in the cart" message on item list', async () => {
      const expectedShelfEmptyMsg = 'Add some products in the cart';
      const currentShelfEmptyMsg = await cartListComponent.getShelfEmptyMsg();

      expect(currentShelfEmptyMsg).toContain(expectedShelfEmptyMsg);
    });

    it('Should have checkout subtotal as "$ 0.00"', async () => {
      const expectedSubtotal = '$ 0.00';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 6 - Click "CHECKOUT" button', () => {
    it('Should click "CHECKOUT and show a prompt', async () => {
      const expectedDialogMsg = 'Add some product in the cart!';

      let currentDialogMsg: string;
      page.once('dialog', async (dialog) => {
        currentDialogMsg = dialog.message();
        dialog.accept();
      });

      await cartCheckoutComponent.clickCheckout();

      expect(currentDialogMsg).toEqual(expectedDialogMsg);
    });
  });

  describe('Step 7 - Click "Ok" on displayed prompt', () => {
    it('Should have shelf empty', async () => {
      await cartListComponent.waitUntilShelfIsEmpty();
    });

    // TODO: extract repetead functions: same on line 230 onwards
    it('Should have cart icon with number 0', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('0');
    });

    it('Should appears "Add some products in the cart" message on item list', async () => {
      const expectedShelfEmptyMsg = 'Add some products in the cart';
      const currentShelfEmptyMsg = await cartListComponent.getShelfEmptyMsg();

      expect(currentShelfEmptyMsg).toContain(expectedShelfEmptyMsg);
    });

    it('Should have checkout subtotal as "$ 0.00"', async () => {
      const expectedSubtotal = '$ 0.00';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 8 - Click cross icon on left checkout component corner', () => {
    it('Should click on cart cross icon', async () => {
      await cartIconComponent.clickCloseCartIcon();

      await cartComponent.waitUntilCartIsNotOpened();
    });
  });

  describe('Step 9 - Click cart icon on right corner', () => {
    it('Should click on cart icon and open cart component', async () => {
      await cartIconComponent.clickClosedCartIcon();

      await cartComponent.waitUntilCartIsOpened();
    });

    it('Should have cart icon with number 0', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('0');
    });

    it('Should appears "Add some products in the cart" message on item list', async () => {
      const expectedShelfEmptyMsg = 'Add some products in the cart';
      const currentShelfEmptyMsg = await cartListComponent.getShelfEmptyMsg();

      expect(currentShelfEmptyMsg).toContain(expectedShelfEmptyMsg);
    });

    it('Should have checkout subtotal as "$ 0.00"', async () => {
      const expectedSubtotal = '$ 0.00';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Click "Add to cart" on item displayed on shelf', () => {
    it('Click "Add to cart" on item displayed on shelf', async () => {
      await shirtComponent.clickAddToCart();

      await cartListComponent.waitUntilIsDisplayed();
    });

    // TODO: Extract functions, same than line 130 onwards
    it('Should have cart icon with number 1', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();
      expect(currentCartIconNumber).toBe('1');
    });

    describe('SubStep - Check out new item added', () => {
      it('Should have its price as $ 10.90', async () => {
        cartListComponent = new CartListComponent(page);
        const expectedItemPrice = '$ 10.90';

        const currentItemPrice = await cartListComponent.getFirstItemPrice();
        expect(currentItemPrice).toEqual(expectedItemPrice);
      });

      it('Should have its title as "Cat Tee Black T-Shirt"', async () => {
        const expectedItemName = 'Cat Tee Black T-Shirt';

        const currentItemName = await cartListComponent.getItemTitle();

        expect(currentItemName).toEqual(expectedItemName);
      });

      it('Should have a cross button visible', async () => {
        const isCrossBtnVisible = await cartListComponent.isItemCrossBtnVisible();
        expect(isCrossBtnVisible).toBeTruthy();
      });

      it('Should have its "Quantity" number as 1', async () => {
        const expectedQuantity = await cartListComponent.getItemQuantity();
        expect(expectedQuantity).toContain('Quantity: 1');
      });

      it('Should have a minus button disabled', async () => {
        const isMinusBtnDisabled = await cartListComponent.isMinusBtnDisabled();
        expect(isMinusBtnDisabled).toBeTruthy();
      });

      it('Should have its proper image', async () => {
        const thumbImg = await cartListComponent.getItemThumbImg();
        expect(thumbImg).toMatchSnapshot();
      });
    });
  });

  describe('Step 12 - Click "CHECKOUT" button', () => {
    it('Should click "CHECKOUT" button, display a dialog and click OK', async () => {
      const expectedDialogMsg = 'Checkout - Subtotal: $ 10.90';

      let currentDialogMsg: string;
      page.once('dialog', async (dialog) => {
        currentDialogMsg = dialog.message();
        dialog.accept();
      });

      await cartCheckoutComponent.clickCheckout();

      expect(currentDialogMsg).toEqual(expectedDialogMsg);
    });
  });

  describe('Step 13 - Click plus button on new element of cart list', () => {
    it('Should click plus button of item and increase the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 2';
      await cartListComponent.clickItemPlusBtn();

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 14 and 15 - Click "Checkout"', () => {
    it('Should click "CHECKOUT" button, display a dialog and click OK', async () => {
      const expectedDialogMsg = 'Checkout - Subtotal: $ 21.80';

      let currentDialogMsg: string;
      page.once('dialog', async (dialog) => {
        currentDialogMsg = dialog.message();
        dialog.accept();
      });

      await cartCheckoutComponent.clickCheckout();

      expect(currentDialogMsg).toEqual(expectedDialogMsg);
    });

    it('Should quantity as 2', async () => {
      const expectedItemQuantity = 'Quantity: 2';

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 16 - Click minus button on new element of cart list', () => {
    it('Should click minus button of item and decrease the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 1';
      await cartListComponent.clickItemMinusBtn();

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 10.90"', async () => {
      const expectedSubtotal = '$ 10.90';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 17 and 18 - Click "Checkout"', () => {
    it('Should click "CHECKOUT" button, display a dialog and click OK', async () => {
      const expectedDialogMsg = 'Checkout - Subtotal: $ 10.90';

      let currentDialogMsg: string;
      page.once('dialog', async (dialog) => {
        currentDialogMsg = dialog.message();
        dialog.accept();
      });

      await cartCheckoutComponent.clickCheckout();

      expect(currentDialogMsg).toEqual(expectedDialogMsg);
    });

    it('Should quantity as 1', async () => {
      const expectedItemQuantity = 'Quantity: 1';

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 10.90"', async () => {
      const expectedSubtotal = '$ 10.90';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  // TODO: extract repeated code to its own function
  describe('Step 19 - Click cross icon on left checkout component corner', () => {
    it('Should click on cart cross icon', async () => {
      await cartIconComponent.clickCloseCartIcon();

      await cartComponent.waitUntilCartIsNotOpened();
    });

    it('Should have cart icon with number 1', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('1');
    });
  });

  describe('Step 20 - Click cart icon on right corner', () => {
    it('Should click on cart icon and open cart component', async () => {
      await cartIconComponent.clickClosedCartIcon();

      await cartComponent.waitUntilCartIsOpened();
    });

    it('Should quantity as 1', async () => {
      const expectedItemQuantity = 'Quantity: 1';

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have checkout subtotal as "$ 10.90"', async () => {
      const expectedSubtotal = '$ 10.90';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 21 - Click plus button on new element of cart list', () => {
    it('Should click plus button of item and increase the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 2';
      await cartListComponent.clickItemPlusBtn();

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 22 - Click cross icon on left checkout component corner', () => {
    it('Should click on cart cross icon', async () => {
      await cartIconComponent.clickCloseCartIcon();

      await cartComponent.waitUntilCartIsNotOpened();
    });

    it('Should have cart icon with number 2', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('2');
    });
  });

  describe('Step 23 - Click cart icon on right corner', () => {
    it('Should click on cart icon and open cart component', async () => {
      await cartIconComponent.clickClosedCartIcon();

      await cartComponent.waitUntilCartIsOpened();
    });

    it('Should quantity as 2', async () => {
      const expectedItemQuantity = 'Quantity: 2';

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have checkout subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 24 - Click plus button on new element of cart list 8 times', () => {
    it('Should click plus button of item and increase the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 10';
      await cartListComponent.clickItemPlusBtn(8);

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 109.00"', async () => {
      const expectedSubtotal = '$ 109.00';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 25 - Click minus button on new element of cart list 8 times', () => {
    it('Should click minus button of item and decrease the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 2';
      await cartListComponent.clickItemMinusBtn(8);

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 26 - Click plus button on new element of cart list 997 times', () => {
    it('Should click plus button of item and increase the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 999';
      await cartListComponent.clickItemPlusBtn(997);

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 10889.10"', async () => {
      const expectedSubtotal = '$ 10889.10';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 27 - Click cross icon on left checkout component corner', () => {
    it('Should click on cart cross icon', async () => {
      await cartIconComponent.clickCloseCartIcon();

      await cartComponent.waitUntilCartIsNotOpened();
    });

    it('Should have cart icon with number 999', async () => {
      const currentCartIconNumber = await cartIconComponent.getCartIconNumber();

      expect(currentCartIconNumber).toEqual('999');
    });
  });

  describe('Step 28 - Click cart icon on right corner', () => {
    it('Should click on cart icon and open cart component', async () => {
      await cartIconComponent.clickClosedCartIcon();

      await cartComponent.waitUntilCartIsOpened();
    });

    it('Should quantity as 999', async () => {
      const expectedItemQuantity = 'Quantity: 999';

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have checkout subtotal as "$ 10889.10"', async () => {
      const expectedSubtotal = '$ 10889.10';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe('Step 29 - Click minus button on new element of cart list 997 times', () => {
    it('Should click minus button of item and decrease the quantity', async () => {
      const expectedItemQuantity = 'Quantity: 2';
      await cartListComponent.clickItemMinusBtn(997);

      const currentItemQuantity = await cartListComponent.getItemQuantity();

      expect(currentItemQuantity).toContain(expectedItemQuantity);
    });

    it('Should have subtotal as "$ 21.80"', async () => {
      const expectedSubtotal = '$ 21.80';

      const currentSubtotal = await cartCheckoutComponent.getSubtotal();

      expect(currentSubtotal).toEqual(expectedSubtotal);
    });
  });

  describe.skip('Final step -  Click plus button 1000000 times', () => {
    // This step blocks my laptop.
    // Maximum items added were 1645
    it('Should click plus button 1000000 times', async () => {
      await cartListComponent.clickItemPlusBtn(1000000);

      const expectedQuantity = '1000000';
      const currentQuantity = await cartListComponent.getItemQuantity();

      expect(currentQuantity).toEqual(expectedQuantity);
    });
  });
});
