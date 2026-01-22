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

  test('Category filter displays exact backend inventory', async ({ page }) => {
    const categories = await productClient.getAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    let testCategory = null;
    let apiProducts = [];
    
    for (const category of categories) {
      const categoryId = category.id || category.category_id;
      apiProducts = await productClient.getCategoryProducts(categoryId);
      if (apiProducts.length > 0 && apiProducts.length < 10) {
        testCategory = category;
        break;
      }
    }
    
    if (!testCategory) {
      test.skip('No suitable category found');
      return;
    }

    const apiNames = apiProducts.map(p => p.name || p.title).filter(Boolean).sort();
    const categorySlug = testCategory.slug || testCategory.name.toLowerCase().replace(/\s+/g, '-');
    
    await page.goto(`https://practicesoftwaretesting.com/#/category/${categorySlug}`);
    await page.waitForLoadState('domcontentloaded');

    const uiNames = (await homePage.getProductNames()).map(n => n.trim()).filter(Boolean).sort();
    const uiCount = await homePage.getProductCount();

    expect(uiCount).toBeGreaterThanOrEqual(apiProducts.length);
    apiNames.forEach(name => {
      expect(uiNames.map(n => n.toLowerCase())).toContain(name.toLowerCase());
    });
  });

  test('Search functionality displays exact backend results', async ({ page }) => {
    const allProducts = await productClient.getAllProducts();
    expect(allProducts.length).toBeGreaterThan(0);

    const searchTerm = (allProducts[0].name || allProducts[0].title).split(' ')[0];
    const apiResults = await productClient.searchProducts(searchTerm);
    const apiNames = apiResults.map(p => p.name || p.title).filter(Boolean).sort();

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

  test('Empty search results handled correctly', async ({ page }) => {
    const uniqueSearchTerm = `NonExistent_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const apiResults = await productClient.searchProducts(uniqueSearchTerm);
    
    await homePage.goto();
    await homePage.searchProduct(uniqueSearchTerm);

    const uiCount = await homePage.getProductCount();
    expect(uiCount).toBe(apiResults.length);
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
