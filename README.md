# Playwright Automation Framework with API Injection

Production-grade test automation framework for **Practice Software Testing (Toolshop)** that combines UI testing with API injection for faster, more reliable tests.

## 🏗️ Architecture

This framework follows a **hybrid testing approach** that combines:
- **API Layer**: RESTful API clients for all backend operations
- **UI Layer**: Page Object Model pattern for UI interactions
- **Hybrid Testing**: API setup + UI validation for comprehensive coverage

### Key Features

- ✅ **API Injection**: Speed up tests by setting up data via API instead of UI
- ✅ **Backend Validation**: Verify UI data matches backend records
- ✅ **Dynamic Test Data**: No hardcoded values - fetch live data from API
- ✅ **State Persistence Testing**: Verify UI reflects external API changes
- ✅ **Comprehensive Logging**: All API responses saved to `/messages` directory
- ✅ **Error Handling**: Retry logic and detailed error logging

## 📁 Project Structure

```
PlaywrightAutomation/
├── api/
│   ├── clients/          # API client classes
│   ├── models/           # Data models
│   └── utils/            # API utilities
├── ui/
│   ├── pages/            # Page Object classes
│   └── helpers/          # UI helper utilities
├── tests/
│   ├── scenarios/        # Test scenario files
│   └── fixtures/         # Test data fixtures
├── messages/             # API responses and error logs
│   ├── api-responses/    # Successful API responses
│   └── error-messages/   # API error logs
├── config/               # Configuration files
└── playwright.config.js  # Playwright configuration
```

## 🚀 Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Scenario
```bash
# Scenario 1: End-to-End Purchase Validation
npm run test:scenario1

# Scenario 2: Product Inventory Accuracy
npm run test:scenario2

# Scenario 3: User State Persistence
npm run test:scenario3
```

### Run in UI Mode (Interactive)
```bash
npm run test:ui
```

### Run in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## 📋 Test Scenarios

### Scenario 1: End-to-End Purchase Validation
**Goal**: Automate complete purchase workflow and validate UI confirmation matches backend order.

**Flow**:
1. Register user via API
2. Login via UI
3. Select product and add to cart via UI
4. Complete checkout via UI
5. Capture Order ID and Total from UI confirmation
6. Fetch order from API
7. Validate Order ID and Total match between UI and API

**Challenge**: Ensures data integrity between frontend display and backend records.

### Scenario 2: Product Inventory Accuracy
**Goal**: Verify search/category filter displays exact backend inventory without hardcoding.

**Flow**:
1. Fetch products by category/search from API
2. Apply same filter via UI
3. Compare UI results with API results
4. Assert exact match (count and names)

**Challenge**: Dynamic validation ensures UI always reflects current backend state.

### Scenario 3: User State Persistence
**Goal**: Verify UI reflects external API changes (cart items, profile address).

**Flow**:
1. Create user and login
2. Inject cart items or update address via API
3. Login via UI
4. Navigate to checkout page (to view cart)
5. Verify UI displays API-injected data

**Challenge**: Ensures real-time synchronization between backend and frontend.

## 🔧 Configuration

### API Configuration
Edit `config/api.config.js` to modify:
- Base URL
- Endpoints
- Timeouts
- Retry counts

### Playwright Configuration
Edit `playwright.config.js` to modify:
- Test directory
- Browsers
- Timeouts
- Screenshots/videos

## 📊 API Response Logging

All API responses are automatically saved to `/messages/api-responses/` directory with:
- Timestamp
- Endpoint
- Method
- Status code
- Response data

Error messages are saved to `/messages/error-messages/` for debugging.

## 🛠️ Framework Components

### API Clients
- `AuthClient`: User authentication (login, register, logout)
- `ProductClient`: Product and category operations (search, filter, get by category)
- `CartClient`: Cart management (add items, get cart, update, remove)
- `OrderClient`: Order/invoice operations (get orders, get by ID, create)
- `UserClient`: User profile and address management

### Page Objects
- `LoginPage`: User login
- `RegisterPage`: User registration
- `HomePage`: Product search and category filtering
- `ProductPage`: Product details and add to cart
- `CheckoutPage`: Checkout process and cart viewing
- `InvoicePage`: Order confirmation and invoice details
- `ProfilePage`: User profile and address management


## 🔍 Debugging

### View API Responses
Check `/messages/api-responses/` for all API calls made during tests. Files are named with endpoint and timestamp.

### View Errors
Check `/messages/error-messages/` for detailed error logs with stack traces.

### Playwright Trace
Run tests with `--trace on` to view detailed execution traces:
```bash
playwright test --trace on
```

### Run Tests in Headed Mode
To see the browser during test execution:
```bash
npm run test:headed
```

### Debug Mode
Step through tests interactively:
```bash
npm run test:debug
```

## 📝 Best Practices

1. **Unique Test Data**: Each test uses unique email addresses to avoid conflicts
2. **API First**: Use API for setup and validation, UI for user flow testing
3. **Error Handling**: All API calls include retry logic and error logging
4. **Isolation**: Each test is independent and cleans up after itself
5. **Dynamic Data**: Never hardcode expected values - fetch from API
6. **Simplified Code**: Framework uses clean, readable code without excessive debugging/logging
7. **Page Object Model**: All UI interactions abstracted into reusable Page Objects

## 🐛 Troubleshooting

### Tests Failing Due to Selectors
- Framework uses `data-test` attributes and semantic selectors
- Check actual page structure and update selectors in Page Objects if needed
- Use Playwright Inspector (`npm run test:debug`) to identify correct selectors

### API Endpoint Changes
- Update endpoints in `config/api.config.js`
- Verify API documentation at: https://api.practicesoftwaretesting.com/api/documentation
- Check `/messages/error-messages/` for API error details

### Authentication Issues
- Check token expiration handling
- Verify API credentials and base URL

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Practice Software Testing API Docs](https://api.practicesoftwaretesting.com/api/documentation)
- [Toolshop Application](https://practicesoftwaretesting.com)

## 📄 License

ISC

## 🤝 Contributing

This is a production-grade framework template. Customize as needed for your specific requirements.

---

**Note**: Update selectors in Page Objects based on actual Toolshop UI structure. API endpoints may need verification against the actual API documentation.
