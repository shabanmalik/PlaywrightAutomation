export class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('id=search-query');
    this.productNames = page.locator('[data-test="product-name"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchProduct(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductNames() {
    await this.productNames.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    return await this.productNames.allTextContents();
  }

  async getProductCount() {
    return await this.productNames.count();
  }

  async clickProduct(productName) {
    await this.page.locator(`text=${productName}`).first().click();
  }
}
