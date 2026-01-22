export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('id=email')
    this.passwordInput = page.locator('id=password');
    this.loginButton = page.locator('data-test=login-submit');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // await this.page.waitForURL('https://practicesoftwaretesting.com/account', { timeout: 15000 });
  }

}
