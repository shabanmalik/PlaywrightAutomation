export class HomePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('id=search-query');
    this.categoryFilter = page.locator('select[name="category"]');
    this.productCards = page.locator('[data-test="product-card"], .product-card');
    this.productNames = page.locator('[data-test="product-name"], .product-name');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async searchProduct(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectCategory(categoryName) {
    if (await this.categoryFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.categoryFilter.selectOption(categoryName);
    } else {
      await this.page.goto(`https://practicesoftwaretesting.com/category/${categoryName}`);
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductNames() {
    await this.productNames.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    return await this.productNames.allTextContents();
  }

  async getProductCount() {
    return await this.productCards.count() || await this.productNames.count();
  }

  async clickProduct(productName) {
    await this.page.locator(`text=${productName}`).first().click();
  }
}
