## Installation

1. **Clone the repository** (if needed):

   ```sh
   git clone https://@bitbucket.org/phoenixinvicta/monetization_modules.git
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

### **Run a specific test**

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
import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 60000, // 60 seconds per test
  use: {
    headless: false, // Run browser in visible mode
    viewport: { width: 1280, height: 720 },
    video: "on", // Record video of tests
    screenshot: "only-on-failure", // Capture screenshot only if the test fails
  },
});
```
Iframe Validation Explained

This section explains the detailed checks we perform for the iframe with id #master22 during automated testing.

Attributes
	•	src: URL loaded in the iframe. We ensure it points to the expected domain (e.g., fivem.com.tr).
	•	sandbox: Security restrictions applied to the iframe. null means no restrictions.
	•	referrerPolicy: Controls whether referrer information is passed. no-referrer ensures privacy.
	•	allow: Permissions granted to the iframe (e.g., camera, location). null means no special permissions.
	•	className: CSS classes on the iframe, useful for styling/debugging.
	•	title: A title for accessibility. Recommended for screen readers.

Geometry
	•	position (x, y): Coordinates on the page to confirm iframe is rendered where expected.
	•	size (width, height): Ensures iframe is large enough and not hidden or collapsed.

CSS Styles
	•	display: Should not be none (which would hide it).
	•	visibility: Should be visible.
	•	opacity: Should be greater than 0. 0 would make the iframe invisible.
	•	zIndex: Indicates stacking order. Helps verify it is not hidden behind other elements.
	•	position: Should be absolute or appropriately styled for layout.
	•	pointerEvents: Should be auto so it can be interacted with.

Visibility
	•	intersectionRatio: A value from 0 to 1 showing how much of the iframe is visible in the viewport. 1 means fully visible.

DOM Order
	•	firstIframeId: The ID of the first iframe on the page.
	•	isFirst: Boolean value indicating whether iframe#master22 is the first iframe in the DOM.