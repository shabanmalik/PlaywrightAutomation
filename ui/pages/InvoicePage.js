export class InvoicePage {
  constructor(page) {
    this.page = page;
    this.detailButton = page.locator('a[href^="/account/invoices/"]');
    this.invoiceNo = page.locator('id=invoice_number');
    this.totalAmount = page.locator('id=total');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/account/invoices');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickDetailPage() {
    await this.detailButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.detailButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getOrderId() {
    await this.invoiceNo.waitFor({ state: 'visible', timeout: 10000 });
    const invoiceNoText = await this.invoiceNo.inputValue().catch(() => 
      this.invoiceNo.textContent()
    );
    
    const match = invoiceNoText.match(/INV-(\d+)/i) || invoiceNoText.match(/(\d+)/);
    return match ? match[1] : invoiceNoText.trim();
  }

  async getTotalAmount() {
    await this.totalAmount.waitFor({ state: 'visible', timeout: 10000 });
    const totalText = await this.totalAmount.inputValue().catch(() => 
      this.totalAmount.textContent()
    );
    
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }
}
