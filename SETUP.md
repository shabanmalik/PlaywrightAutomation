# Quick Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

3. **Verify Setup**
   ```bash
   npm test
   ```

## Project Structure Overview

```
PlaywrightAutomation/
├── api/                    # API client layer
│   ├── clients/           # API client classes (Auth, Product, Cart, Order, User)
│   └── utils/             # API utilities (ApiHelper, TokenManager)
├── ui/                     # UI automation layer
│   └── pages/             # Page Object classes
│       ├── LoginPage.js
│       ├── RegisterPage.js
│       ├── HomePage.js
│       ├── ProductPage.js
│       ├── CheckoutPage.js (handles checkout and cart viewing)
│       ├── InvoicePage.js
│       └── ProfilePage.js
├── tests/
│   └── scenarios/         # Test scenario files
│       ├── scenario1-purchase-validation.spec.js
│       ├── scenario2-inventory-accuracy.spec.js
│       └── scenario3-state-persistence.spec.js
├── messages/              # API response logs
│   ├── api-responses/     # Successful API calls
│   └── error-messages/    # Error logs
└── config/                # Configuration files
```

## Running Your First Test

### Test Scenario 1: Purchase Validation
```bash
npm run test:scenario1
```

This test will:
- Create a user via API
- Complete a purchase via UI
- Validate order details match between UI and API

### Test Scenario 2: Inventory Accuracy
```bash
npm run test:scenario2
```

This test will:
- Fetch products from API
- Verify UI search/category filter matches API results

### Test Scenario 3: State Persistence
```bash
npm run test:scenario3
```

This test will:
- Inject data via API
- Verify UI reflects the changes

## Important Notes

1. **API Endpoints**: The framework uses endpoints from `https://api.practicesoftwaretesting.com`
   - Verify endpoints match actual API documentation
   - Update `config/api.config.js` if endpoints differ

2. **UI Selectors**: Page Objects use clean, simplified selectors
   - If tests fail due to selectors, update selectors in `ui/pages/` files
   - Check actual page structure using browser dev tools
   - Framework uses `data-test` attributes where available for reliable selectors

3. **Test Data**: All tests use unique email addresses to avoid conflicts
   - Format: `testuser{timestamp}@example.com`
   - No cleanup needed between test runs

4. **API Responses**: All API calls are logged to `/messages/api-responses/`
   - Useful for debugging
   - Check these files if tests fail

## Troubleshooting

### Issue: "Cannot find module" errors
- Ensure `package.json` has `"type": "module"`
- Verify all imports use `.js` extension

### Issue: Tests timeout
- Increase timeout in `playwright.config.js`
- Check network connectivity to API

### Issue: Selectors not found
- Update selectors in Page Object files
- Use Playwright Inspector: `npm run test:debug`

### Issue: API authentication fails
- Verify API base URL in `config/api.config.js`
- Check API documentation for authentication requirements

## Next Steps

1. Run all scenarios to verify setup:
   ```bash
   npm run test:scenario1
   npm run test:scenario2
   npm run test:scenario3
   ```

2. Review API responses in `/messages/api-responses/` for debugging

3. Customize selectors in `ui/pages/` based on actual UI structure

4. Add more test scenarios as needed

## Framework Features

- **API Injection**: Speed up tests by setting up data via API
- **Backend Validation**: Verify UI data matches backend records
- **Dynamic Test Data**: Fetch live data from API instead of hardcoding
- **State Persistence**: Verify UI reflects external API changes
- **Clean Code**: Simplified, readable code without excessive logging

## Support

- API Documentation: https://api.practicesoftwaretesting.com/api/documentation
- Playwright Docs: https://playwright.dev
- Framework README: See `README.md`
