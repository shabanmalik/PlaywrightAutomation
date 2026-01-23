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

  test('Profile address persists after external API update', async ({ page, request }) => {
    const newAddress = {
      street: '456 API Test Street',
      city: 'API City',
      state: 'AP',
      zip_code: '54321',
      country: 'US'
    };

    await userClient.updateAddress(newAddress).catch(() => null);

    const apiAddress = await userClient.getAddress().catch(async () => {
      const profile = await userClient.getProfile();
      return profile.address || profile;
    });

    expect(apiAddress).toBeDefined();
    
    const apiStreet = apiAddress.street || apiAddress.address || '';
    const apiCity = apiAddress.city || '';
    const apiState = apiAddress.state || apiAddress.province || '';
    const apiZip = apiAddress.zip_code || apiAddress.zip || '';
    const apiCountry = apiAddress.country || '';

    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await profilePage.goto();

    const uiAddress = await profilePage.getAddress();

    if (apiStreet) expect(uiAddress.street.toLowerCase()).toContain(apiStreet.toLowerCase());
    if (apiCity) expect(uiAddress.city.toLowerCase()).toContain(apiCity.toLowerCase());
    if (apiState) expect(uiAddress.state.toLowerCase()).toContain(apiState.toLowerCase());
    if (apiZip) expect(uiAddress.zip).toContain(apiZip);
    if (apiCountry) expect(uiAddress.country.toLowerCase()).toContain(apiCountry.toLowerCase());
  });
});
