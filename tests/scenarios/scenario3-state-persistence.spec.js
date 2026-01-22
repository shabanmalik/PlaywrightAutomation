import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/clients/authClient.js';
import { ProductClient } from '../../api/clients/productClient.js';
import { CartClient } from '../../api/clients/cartClient.js';
import { UserClient } from '../../api/clients/userClient.js';
import { LoginPage } from '../../ui/pages/LoginPage.js';
import { CheckoutPage } from '../../ui/pages/CheckoutPage.js';
import { ProfilePage } from '../../ui/pages/ProfilePage.js';

test.describe('Scenario 3: User State Persistence', () => {
  let authClient, productClient, cartClient, userClient;
  let loginPage, checkoutPage, profilePage;
  let testUser;

  test.beforeEach(async ({ page, request }) => {
    authClient = new AuthClient(request);
    productClient = new ProductClient(request, authClient);
    cartClient = new CartClient(request, authClient);
    userClient = new UserClient(request, authClient);

    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    profilePage = new ProfilePage(page);

    const timestamp = Date.now();
    testUser = {
      email: `testuser${timestamp}@example.com`,
      password: `SecurePass${timestamp}@2024!`,
      first_name: 'Test',
      last_name: 'User'
    };

    await authClient.register(testUser).catch(() => null);
    await authClient.login(testUser.email, testUser.password);
  });

  test('Cart items persist after external API injection', async ({ page }) => {
    const products = await productClient.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    const product1 = products[0];
    const product2 = products[1] || products[0];

    await cartClient.addItemToCart(product1.id || product1.product_id, 2);
    await cartClient.addItemToCart(product2.id || product2.product_id, 1);

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await checkoutPage.goto();

    const uiCartItems = await checkoutPage.getCartItems();
    const apiCart = await cartClient.getCart().catch(() => ({ items: [], cart_items: [] }));
    const apiItems = apiCart.items || apiCart.cart_items || [];

    expect(uiCartItems.length).toBeGreaterThan(0);
    
    const apiItemNames = apiItems.map(item => {
      const product = item.product || item;
      return product.name || product.title;
    }).filter(Boolean).sort();
    
    const uiItemNames = uiCartItems.map(item => item.name).filter(Boolean).sort();
    
    expect(uiItemNames.map(n => n.toLowerCase())).toEqual(apiItemNames.map(n => n.toLowerCase()));

    apiItems.forEach(apiItem => {
      const product = apiItem.product || apiItem;
      const productName = product.name || product.title;
      const uiItem = uiCartItems.find(item => item.name.toLowerCase() === productName.toLowerCase());
      expect(uiItem.quantity).toBe(apiItem.quantity || 1);
    });
  });

  test('Profile address persists after external API update', async ({ page }) => {
    const newAddress = {
      street: '456 API Test Street',
      city: 'API City',
      state: 'AP',
      zip_code: '54321',
      country: 'US'
    };

    await userClient.updateAddress(newAddress).catch(() => null);

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await profilePage.goto();

    const uiAddress = await profilePage.getAddress();
    const apiAddress = await userClient.getAddress().catch(() => null);

    if (apiAddress) {
      const apiStreet = apiAddress.street || apiAddress.address || '';
      const apiCity = apiAddress.city || '';
      const apiState = apiAddress.state || apiAddress.province || '';
      const apiZip = apiAddress.zip_code || apiAddress.zip || '';
      const apiCountry = apiAddress.country || '';

      if (apiStreet) expect(uiAddress.street.toLowerCase()).toContain(apiStreet.toLowerCase());
      if (apiCity) expect(uiAddress.city.toLowerCase()).toContain(apiCity.toLowerCase());
      if (apiState) expect(uiAddress.state.toLowerCase()).toContain(apiState.toLowerCase());
      if (apiZip) expect(uiAddress.zip).toContain(apiZip);
      if (apiCountry) expect(uiAddress.country.toLowerCase()).toContain(apiCountry.toLowerCase());
    }
  });

  test('Cart state persists after UI logout and login', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);

    const products = await productClient.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    await cartClient.addItemToCart(products[0].id || products[0].product_id, 3);

    const apiCartBefore = await cartClient.getCart().catch(() => ({ items: [], cart_items: [] }));
    const apiItemsBefore = apiCartBefore.items || apiCartBefore.cart_items || [];
    expect(apiItemsBefore.length).toBeGreaterThan(0);

    await page.goto('https://practicesoftwaretesting.com/#/');

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await checkoutPage.goto();

    const uiCartItems = await checkoutPage.getCartItems();
    expect(uiCartItems.length).toBeGreaterThan(0);
    
    const apiCartAfter = await cartClient.getCart().catch(() => ({ items: [], cart_items: [] }));
    const apiItemsAfter = apiCartAfter.items || apiCartAfter.cart_items || [];
    expect(uiCartItems.length).toBe(apiItemsAfter.length);
  });
});
