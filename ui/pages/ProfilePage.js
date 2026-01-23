export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.addressStreet = page.locator('[data-test="address-street"], input[name="street"]');
    this.addressCity = page.locator('[data-test="address-city"], input[name="city"]');
    this.addressState = page.locator('[data-test="address-state"], input[name="state"]');
    this.addressZip = page.locator('[data-test="address-zip"], input[name="zip"], input[name="zip_code"]');
    this.addressCountry = page.locator('[data-test="address-country"], select[name="country"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/#/profile');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getAddress() {
    const getValue = async (locator) => {
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
