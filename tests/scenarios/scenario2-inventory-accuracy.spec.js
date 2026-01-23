import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/clients/authClient.js';
import { ProductClient } from '../../api/clients/productClient.js';
import { HomePage } from '../../ui/pages/HomePage.js';

test.describe('Scenario 2: Product Inventory Accuracy', () => {
  let productClient;
  let homePage;

  test.beforeEach(async ({ page, request }) => {
    const authClient = new AuthClient(request);
    productClient = new ProductClient(request, authClient);
    homePage = new HomePage(page);
  });

  test('Search functionality displays exact backend results', async ({ page }) => {
    const allProducts = await productClient.getAllProducts();
    expect(allProducts.length).toBeGreaterThan(0);

    const searchTerm = (allProducts[0].name || allProducts[0].title).split(' ')[0];
    const apiResults = await productClient.searchProducts(searchTerm);
    const apiNames = apiResults.map(p => p.name || p.title).filter(Boolean).sort();

    await homePage.goto();
    page.pause();
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


  test('Product list matches API inventory without filters', async ({ page }) => {
    const apiProducts = await productClient.getAllProducts();
    expect(apiProducts.length).toBeGreaterThan(0);
    
    const apiNames = apiProducts.map(p => p.name || p.title).filter(Boolean).sort();

    await homePage.goto();
    const uiNames = (await homePage.getProductNames()).map(n => n.trim()).filter(Boolean).sort();

    uiNames.forEach(name => {
      expect(apiNames.map(n => n.toLowerCase())).toContain(name.toLowerCase());
    });
  });
});
