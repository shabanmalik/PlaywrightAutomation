import { test, expect } from '@playwright/test';
import { ProductClient } from '../../api/clients/productClient.js';
import { HomePage } from '../../ui/pages/HomePage.js';

test.describe('Scenario 2: Product Inventory Accuracy', () => {
  let productClient;
  let homePage;

  test.beforeEach(async ({ page, request }) => {
    productClient = new ProductClient(request);
    homePage = new HomePage(page);
  });

  test('Search functionality displays exact backend results', async ({ page }) => {
    const allProducts = await productClient.getAllProducts();
    expect(allProducts.length).toBeGreaterThan(0);
    const searchTerm = allProducts[0].name;
    const apiResults = await productClient.searchProducts(searchTerm);
    const apiNames = apiResults.map(p => p.name).filter(Boolean).sort();
    
    await homePage.goto();
    await homePage.searchProduct(searchTerm);

    const uiNames = (await homePage.getProductNames()).map(n => n.trim()).filter(Boolean).sort();
    const uiCount = await homePage.getProductCount();

    expect(uiCount).toBe(apiResults.length);
    
    const uiNamesLower = uiNames.map(n => n.toLowerCase());
    const apiNamesLower = apiNames.map(n => n.toLowerCase());
    apiNamesLower.forEach(apiName => {
      expect(uiNamesLower).toContain(apiName);
    });
  });

});
