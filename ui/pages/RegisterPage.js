export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('id=first_name')
    this.lastName = page.locator('id=last_name')
    this.dob = page.locator('id=dob')
    this.street = page.locator('id=street')
    this.postalCode = page.locator('id=postal_code')
    this.city = page.locator('id=city')
    this.state = page.locator('id=state')
    this.country = page.locator('id=country')
    this.phone = page.locator('id=phone')
    this.email = page.locator('id=email')
    this.password = page.locator('id=password')
    this.submitButton = page.locator('[data-test="register-submit"]')

    
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/register');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async registerUser(firstName, lastName, email, password) {
    await this.firstName.fill(firstName)
    await this.lastName.fill(lastName)
    await this.dob.fill('2000-12-12')
    await this.street.fill('ABC Test Street')
    await this.postalCode.fill('75400');
    await this.city.fill('Karachi');
    await this.state.fill('Sindh');
    await this.country.selectOption('Pakistan');
    await this.phone.fill('011212312');
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('https://practicesoftwaretesting.com/auth/login', { timeout: 15000 });
  }

}
