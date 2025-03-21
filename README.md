
## Installation

1. **Clone the repository** (if needed):
   ```sh
   git clone https://github.com/your-repo/google-playwright-test.git
   cd google-playwright-test
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Ensure Playwright is installed**:
   ```sh
   npx playwright --version
   ```

4. **Install browsers for testing** (if not installed yet):
   ```sh
   npx playwright install
   ```

---

## Project Structure

```
/google-playwright-test/
 ├── tests/                # Test scripts
 │    ├── googleTest.spec.js
 ├── pages/                # Page Object Model (POM)
 │    ├── GooglePage.js
 │    ├── ExtensionsPage.js
 │    ├── SearchResultsPage.js
 ├── utils/                # Additional utilities
 │    ├── helpers.js
 ├── package.json          # Dependencies and scripts
 ├── playwright.config.js  # Playwright configuration
 ├── README.md             # Project documentation
```

---

## Running Tests

### **Run all tests**
```sh
npx playwright test
```

###  **Run a specific test**
```sh
npx playwright test tests/googleStable.spec.js
```

### **Run tests in debug mode**
```sh
npx playwright test --debug
```

### **Run tests in headed mode (visible browser)**
```sh
npx playwright test --headed
```



## Configuration in `playwright.config.js`
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // 60 seconds per test
  use: {
    headless: false, // Run browser in visible mode
    viewport: { width: 1280, height: 720 },
    video: 'on', // Record video of tests
    screenshot: 'only-on-failure' // Capture screenshot only if the test fails
  }
});
```
