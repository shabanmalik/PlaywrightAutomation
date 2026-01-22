export class ProductPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('id=btn-add-to-cart');
    this.cartCount = page.locator('id=lblCartCount');
    this.productName = page.locator('[data-test=product-name]');
    this.productPrice = page.locator('[data-test=unit-price]');
  }

  async addToCart() {
    await this.productName.waitFor({ state: 'visible', timeout: 15000 });
    await this.addToCartButton.click();
  }

  async waitForCartUpdated() {
    await this.cartCount.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getProductName() {
    return await this.productName.textContent();
  }

  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }
}
