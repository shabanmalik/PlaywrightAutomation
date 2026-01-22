export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.proceedToCheckout1 = page.locator('[data-test=proceed-1]');
    this.proceedToCheckout2 = page.locator('[data-test=proceed-2]');
    this.proceedToCheckout3 = page.locator('[data-test=proceed-3]');

    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.addressInput = page.locator('input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"]');
    this.zipCodeInput = page.locator('input[name="zip_code"], input[name="zip"]');
    this.countrySelect = page.locator('select[name="country"]');
    this.paymentMethodSelect = page.locator('[data-test=payment-method]');
    this.confirmButton = page.locator('[data-test=finish]');
    this.paymentConfirmMessage = page.locator('[data-test=payment-success-message]');
    
    this.cartItemRows = page.locator('[data-test="cart-item"], .cart-item, tbody tr');
    this.cartItemNames = page.locator('[data-test="product-name"], .product-name');
    this.cartItemQuantities = page.locator('[data-test="quantity"], input[type="number"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/checkout');
    await this.page.waitForLoadState('domcontentloaded');
    await this.proceedToCheckout1.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickProceedButton1() {
    await this.proceedToCheckout1.click();
  }
   
  async clickProceedButton2() {
    await this.proceedToCheckout2.click();
  }

  async clickProceedButton3() {
    await this.proceedToCheckout3.click();
  }


  async fillShippingInfo(shippingData) {
    await this.firstNameInput.fill(shippingData.firstName);
    await this.lastNameInput.fill(shippingData.lastName);
    await this.addressInput.fill(shippingData.address);
    await this.cityInput.fill(shippingData.city);
    await this.stateInput.fill(shippingData.state);
    await this.zipCodeInput.fill(shippingData.zipCode);
    await this.countrySelect.selectOption(shippingData.country);
  }

  async selectPaymentMethod(method) {
    await this.paymentMethodSelect.selectOption(method);
  }

  async waitForPaymentConfirmationMessage() {
    await this.paymentConfirmMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getCartItems() {
    await this.page.waitForLoadState('domcontentloaded');
    const items = [];
    
    // Try multiple selectors for cart items
    const cartItemSelectors = [
      '[data-test="cart-item"]',
      '.cart-item',
      'tbody tr',
      'table tr',
      '[data-test="product-name"]'
    ];
    
    let cartItems = null;
    for (const selector of cartItemSelectors) {
      cartItems = this.page.locator(selector);
      const count = await cartItems.count();
      if (count > 0) {
        break;
      }
    }
    
    if (!cartItems || (await cartItems.count()) === 0) {
      // Try getting product names directly
      const productNames = this.page.locator('[data-test="product-name"], .product-name, td:has-text("")');
      const nameCount = await productNames.count();
      
      for (let i = 0; i < nameCount; i++) {
        const name = await productNames.nth(i).textContent().catch(() => '');
        if (name && name.trim()) {
          items.push({ name: name.trim(), quantity: 1 });
        }
      }
      return items;
    }
    
    const count = await cartItems.count();
    for (let i = 0; i < count; i++) {
      const row = cartItems.nth(i);
      const name = await row.locator('[data-test="product-name"], .product-name').first().textContent().catch(() => 
        row.textContent()
      ).catch(() => '');
      
      const quantityText = await row.locator('[data-test="quantity"], input[type="number"]').first().inputValue().catch(() => 
        row.locator('[data-test="quantity"], input[type="number"]').first().textContent()
      ).catch(() => '1');
      const quantity = parseInt(quantityText) || 1;
      
      if (name && name.trim()) {
        items.push({ name: name.trim(), quantity });
      }
    }
    
    return items;
  }
}
