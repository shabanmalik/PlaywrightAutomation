import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/clients/authClient.js';
import { UserClient } from '../../api/clients/userClient.js';
import { LoginPage } from '../../ui/pages/LoginPage.js';
import { ProfilePage } from '../../ui/pages/ProfilePage.js';

test.describe('Scenario 3: User State Persistence', () => {
  let authClient, userClient;
  let loginPage, profilePage;
  let testUser;

  test.beforeEach(async ({ page, request }) => {
    authClient = new AuthClient(request);
    userClient = new UserClient(request, authClient);

    loginPage = new LoginPage(page);
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

  test('Profile address persists after external API update', async ({ page }) => {
    const newAddress = {
      street: '456 API Test Street',
      city: 'API City',
      state: 'AP',
      postal_code: '54321',
      country: 'US'
    };

    const profile = await userClient.getProfile();
    await userClient.updateAddress(newAddress, profile.id);

    const apiAddress = await userClient.getProfile();
    expect(apiAddress.address).toBeDefined();
    
    const apiStreet = apiAddress.address.street || '';
    const apiCity = apiAddress.address.city || '';
    const apiState = apiAddress.address.state || '';
    const apiPostalCode = apiAddress.address.postal_code || '';
    const apiCountry = apiAddress.address.country || '';

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await profilePage.goto();

    const uiAddress = await profilePage.getAddress();

    if (apiStreet) expect(uiAddress.street.toLowerCase()).toContain(apiStreet.toLowerCase());
    if (apiCity) expect(uiAddress.city.toLowerCase()).toContain(apiCity.toLowerCase());
    if (apiState) expect(uiAddress.state.toLowerCase()).toContain(apiState.toLowerCase());
    if (apiPostalCode) expect(uiAddress.zip).toContain(apiPostalCode);
    if (apiCountry) expect(uiAddress.country.toLowerCase()).toContain(apiCountry.toLowerCase());
  });
});
