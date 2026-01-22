import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/clients/authClient.js';
import { ProductClient } from '../../api/clients/productClient.js';
import { OrderClient } from '../../api/clients/orderClient.js';
import { LoginPage } from '../../ui/pages/LoginPage.js';
import { HomePage } from '../../ui/pages/HomePage.js';
import { ProductPage } from '../../ui/pages/ProductPage.js';
import { CheckoutPage } from '../../ui/pages/CheckoutPage.js';
import { InvoicePage } from '../../ui/pages/InvoicePage.js';
import { RegisterPage } from '../../ui/pages/RegisterPage.js';

test.describe('Scenario 1: End-to-End Purchase Validation', () => {
  let authClient, productClient, orderClient;
  let registerPage, loginPage, homePage, productPage, checkoutPage, invoicePage;
  let testUser;

  test.beforeEach(async ({ page, request }) => {
    authClient = new AuthClient(request);
    productClient = new ProductClient(request, authClient);
    orderClient = new OrderClient(request, authClient);

    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
    invoicePage = new InvoicePage(page);

    const timestamp = Date.now();
    testUser = {
      email: `testuser${timestamp}@example.com`,
      password: `SecurePass${timestamp}@2024!`,
      first_name: 'Test',
      last_name: 'User'
    };

  });

  test('Complete purchase workflow with backend validation', async ({ page }) => {
    await registerPage.goto();
    await registerPage.registerUser(testUser.first_name, testUser.last_name, testUser.email, testUser.password);
    await loginPage.login(testUser.email, testUser.password);

    const products = await productClient.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    const selectedProduct = products[0];

    await homePage.goto();
    await homePage.clickProduct(selectedProduct.name || selectedProduct.title);
    await productPage.addToCart();
    await productPage.waitForCartUpdated();

    await checkoutPage.goto();
    await checkoutPage.clickProceedButton1();
    await checkoutPage.clickProceedButton2();
    await checkoutPage.clickProceedButton3();
    await checkoutPage.selectPaymentMethod('cash-on-delivery');
    await checkoutPage.clickConfirmButton();
    await checkoutPage.waitForPaymentConfirmationMessage();
    await checkoutPage.clickConfirmButton();
    await invoicePage.goto();
    await invoicePage.clickDetailPage().catch(() => null);

    const uiOrderId = await invoicePage.getOrderId();
    const uiTotalAmount = await invoicePage.getTotalAmount();

    await authClient.login(testUser.email, testUser.password);
    
    const backendOrder = await orderClient.getOrderById(uiOrderId).catch(async () => {
      const allOrders = await orderClient.getAllOrders();
      return allOrders.find(order => {
        const invoiceNumber = order.invoice_number || '';
        return invoiceNumber.includes(uiOrderId) || invoiceNumber === `INV-${uiOrderId}`;
      }) || allOrders[allOrders.length - 1];
    });

    expect(backendOrder).toBeDefined();

    const normalize = (value) => value.toString().replace(/INV-/i, '').replace(/^0+/, '').trim();
    const backendInvoiceNumber = backendOrder.invoice_number || backendOrder.invoice_id;
    
    if (backendInvoiceNumber) {
      expect(normalize(backendInvoiceNumber)).toBe(normalize(uiOrderId));
    }
    
    const backendTotal = parseFloat(backendOrder.total || backendOrder.total_amount);
    expect(backendTotal).toBeCloseTo(uiTotalAmount, 2);
  });
});
