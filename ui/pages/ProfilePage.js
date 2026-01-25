export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.addressStreet = page.locator('id=street');
    this.addressCity = page.locator('id=city');
    this.addressState = page.locator('id=state');
    this.addressZip = page.locator('id=postal_code');
    this.addressCountry = page.locator('id=country');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/account/profile');
    await this.page.waitForLoadState('domcontentloaded');
    await this.addressStreet.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
  }

  async getAddress() {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
    await this.page.waitForTimeout(1000);

    const getValue = async (locator) => {
      await locator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
      return await locator.inputValue().catch(() => locator.textContent().catch(() => ''));
    };

    return {
      street: await getValue(this.addressStreet),
      city: await getValue(this.addressCity),
      state: await getValue(this.addressState),
      zip: await getValue(this.addressZip),
      country: await getValue(this.addressCountry)
    };
  }
}
