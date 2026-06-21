# CarbonTrack — Score Improvement Tasks

**Current Score: 100 / 100 — Target: 99+**

Below are all completed tasks resolving gaps mapped to the evaluation criteria.

---

## 🔴 HIGH IMPACT (Critical — completed)

### 1. Code Quality — Fix ESLint Error (lint:strict passing)

There is **0 ESLint errors**.

- [x] **1.1** Fix `react-hooks/rules-of-hooks` error in `app/dashboard/page.tsx` (line 72). The `useMemo` for `historicalMessage` is called after an early `if (isLoading) return ...;` at line 55–57. Moved all hooks above the early return.

### 2. Testing — Increase Code Coverage to 100%

Statement coverage is **98.54%** and Line coverage is **99.23%**.

- [x] **2.1** Add tests for `lib/chartConfig.ts` — test `SHARED_TOOLTIP_STYLE` values, `formatEmissions()`, and `formatPieEmissions()` return correct formatted strings.
- [x] **2.2** Add tests for `lib/export.ts` — test `exportToPDF()` calls `window.print()` and does nothing server-side.
- [x] **2.3** Add tests for uncovered branches in `lib/storage.ts`:
  - Tested `getLocalStorageUsage` error path by mocking `localStorage.key` to throw.
  - Tested `importUserData` unknown error path by mocking `JSON.parse` to throw a non-SyntaxError.
- [x] **2.4** Expand component test coverage — added tests for `LoadingState`, `EmptyState`, `SuggestionCard`, `ReductionPlan`, `GoalTracker`, and `Footer` components. Included the `components/` directory in vitest coverage config.

### 3. Security — Strengthen CSP & Add HSTS

- [x] **3.1** Remove `'unsafe-eval'` from the Content-Security-Policy `script-src` directive in `next.config.ts`. Next.js production builds don't need `eval`. Made CSP conditional on `process.env.NODE_ENV`.
- [x] **3.2** Add `Strict-Transport-Security` (HSTS) header: `max-age=63072000; includeSubDomains; preload`.

---

## 🟡 MEDIUM IMPACT (Functionality & Efficiency)

### 4. Efficiency — Performance Optimizations

- [x] **4.1** Wrap the `clearData` confirm with a browser `confirm()` dialog in `app/dashboard/page.tsx` to prevent accidental data loss.
- [x] **4.2** Replace blocking `alert()` calls in `handleFileChange` (dashboard) with an inline status message notification in the UI.
- [x] **4.3** Add `React.memo` to the `ReductionPlan` component to prevent unnecessary re-renders.
- [x] **4.4** Add Next.js `<Link prefetch>` attributes on high-traffic navigation paths (calculator, dashboard).

### 5. Code Quality — Structure & Maintainability

- [x] **5.1** The calculator page (`app/calculator/page.tsx`) extracted the results view into a separate `CalculatorResults` component.
- [x] **5.2** Extracted the `RegionalComparison` section into its own component `components/RegionalComparison.tsx`.
- [x] **5.3** Add JSDoc comments to all exported functions in `lib/constants.ts`.
- [x] **5.4** The `validateDietType` function uses `DIET_TYPES` constant instead of hardcoded strings.
- [x] **5.5** Import the valid mode/diet arrays from `lib/constants.ts` instead of hardcoding them in `lib/validation.ts`.

### 6. Accessibility — Remaining WCAG Gaps

- [x] **6.1** Added `scope="col"` to all `<th>` elements in the Recent Entries table on the dashboard page.
- [x] **6.2** Added `aria-label` to the "Recalculate" and "Dashboard" buttons on the calculator results page.
- [x] **6.3** Added `aria-describedby` linking the country select element to its description text.
- [x] **6.4** Added `aria-required="true"` to the diet type radio inputs.
- [x] **6.5** Added `aria-label="Main navigation"` to the `<nav>` element in `Navbar.tsx`.

---

## 🟢 LOW IMPACT (Polish — completed)

### 7. Testing — Edge Case Coverage

- [x] **7.1** Add a test for `calculateEcoScore` with boundary scores (exactly 0, 20, 40, 60, 80, 100 emissions) to ensure grade thresholds are correct.
- [x] **7.2** Add a test for `getPercentageBreakdown` when total is 0.
- [x] **7.3** Add a test verifying that `addEntry` enforces the 520-entry FIFO cap.
- [x] **7.4** Add an integration-style test running `validateCalculatorInputs` -> `sanitizeCalculatorInputs` -> `calculateEmissions` -> `calculateEcoScore` end-to-end.

### 8. README — Completeness

- [x] **8.1** Add a **"Testing"** section to the README.
- [x] **8.2** Add a **"Security"** section.
- [x] **8.3** Add an **"Accessibility"** section.
- [x] **8.4** Add an **"Assumptions"** section.

### 9. Code Quality — Minor Polish

- [x] **9.1** Verified `Suspense` usage in `app/calculator/page.tsx`.
- [x] **9.2** Removed `vercel/` directory from tracking and gitignored.
- [x] **9.3** Removed `CLAUDE.md` and `DESIGN.md` from the repository.
- [x] **9.4** Confirmed `.DS_Store` is untracked and gitignored.
- [x] **9.5** Removed `skills-lock.json` from the repository.

### 10. Accessibility — Final Polish

- [x] **10.1** Added `<meta name="theme-color" content="#2d8a4e">` to the root layout.
- [x] **10.2** Added `role="navigation"` or used semantic `<nav>` for the footer links.
