# CarbonTrack — 100/100 Score Task List

> **Goal**: Score 100/100 across all 6 evaluation criteria for PromptWars Virtual Challenge 3
> **Problem Statement**: Carbon Footprint Awareness Platform — help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## 1. Code Quality

### Current Gaps
- ❌ No `error.tsx` or `not-found.tsx` pages (Next.js App Router error boundaries missing)
- ❌ `eslint-disable` comments scattered in chart components (3 instances of `@typescript-eslint/no-explicit-any`)
- ❌ No input validation layer — raw `Number(e.target.value)` without bounds/NaN checks
- ❌ Repeated Recharts tooltip styling across 3 chart components (DRY violation)
- ❌ `useCallback` in calculator page has incomplete dependency array (`addEntry` but not reactive)
- ❌ No JSDoc comments on components — only lib functions are documented
- ❌ No comprehensive `README.md` with architecture diagram, setup, testing instructions
- ❌ Inconsistent file naming — mixed default/named exports from `LoadingState.tsx`

### Tasks

- [x] **1.1** Create [app/error.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/error.tsx) — global error boundary with "Something went wrong" UI and retry button
- [x] **1.2** Create [app/not-found.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/not-found.tsx) — custom 404 page with link back to home
- [x] **1.3** Create [app/loading.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/loading.tsx) — root loading state using `LoadingState` component
- [x] **1.4** Extract shared Recharts tooltip config into [lib/chartConfig.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/chartConfig.ts) — eliminate duplicated tooltip styles across [EmissionPieChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmissionPieChart.tsx), [EmissionTrendChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmissionTrendChart.tsx), [MonthlyBarChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/MonthlyBarChart.tsx)
- [x] **1.5** Fix `eslint-disable` comments — properly type Recharts formatter callbacks using generic Recharts types instead of `any`
- [x] **1.6** Add input validation utility in [lib/validation.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/validation.ts) — validate distance (0–2000), electricity (0–5000), diet type enum, return typed errors
- [x] **1.7** Add JSDoc comments to all 10 component files and the `useUserData` hook
- [x] **1.8** Separate `EmptyState` into its own file [components/EmptyState.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmptyState.tsx) — one component per file
- [x] **1.9** Update [README.md](file:///Users/sahil/Desktop/carbon-footprint/README.md) — add project overview, architecture section, features list, folder structure, testing instructions, deployment guide, emission factor sources
- [x] **1.10** Add `"lint:strict"` script in [package.json](file:///Users/sahil/Desktop/carbon-footprint/package.json) — `eslint . --max-warnings=0`

---

## 2. Security

### Current Gaps
- ❌ No input sanitization — `localStorage` stores raw user input
- ❌ No data schema validation on `localStorage.getItem()` parse — `JSON.parse(raw) as UserData` is an unsafe cast
- ❌ No `Content-Security-Policy` or security headers configured
- ❌ No rate limiting on `addEntry` — user can spam localStorage with unlimited entries
- ❌ `localStorage` data has no integrity check (could be tampered with in DevTools)
- ❌ No `rel="noopener noreferrer"` validation — only 1 external link exists (correct), but no policy
- ❌ Missing `dangerouslySetInnerHTML` safeguards (not currently used, but no CSP to prevent future XSS)

### Tasks

- [x] **2.1** Add Zod schema validation in [lib/storage.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/storage.ts) — validate parsed localStorage data against `UserData` schema before use; reject corrupted data gracefully
- [x] **2.2** Add input sanitization in [lib/validation.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/validation.ts) — clamp numeric inputs, reject NaN/Infinity, whitelist transport modes and diet types against enum
- [x] **2.3** Add security headers in [next.config.ts](file:///Users/sahil/Desktop/carbon-footprint/next.config.ts) — `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- [x] **2.4** Add entry limit cap in [lib/storage.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/storage.ts) — max 520 entries (10 years of weekly data); remove oldest when exceeded (FIFO)
- [x] **2.5** Add `try-catch` with specific error messages around all `JSON.parse` calls — currently silently returns default data with bare `catch {}` (no logging)
- [x] **2.6** Add localStorage storage quota check — warn user when approaching 5MB limit before data loss
- [x] **2.7** Add data export/import feature with JSON schema validation — so users can back up data securely

---

## 3. Efficiency

### Current Gaps
- ❌ Dashboard calls `loadUserData()` multiple times per render (inside `getRecentEntries` and `getMonthlyAggregates` — each reads from localStorage)
- ❌ No `React.memo` on any chart components — re-render on parent state changes even when props unchanged
- ❌ No code-splitting on heavy Recharts library — bundled into main chunk
- ❌ `generateSuggestions` and `generateReductionPlan` called on every render in calculator results (not memoized)
- ❌ All 30 reduction plan items render DOM nodes immediately (even when collapsed)
- ❌ No `Suspense` boundaries for progressive loading
- ❌ Stats band on home page uses `.map()` creating objects on every render (minor, no key optimization)
- ❌ SVG EcoScoreRing re-calculates circumference on every render (could be memoized)

### Tasks

- [x] **3.1** Refactor [lib/storage.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/storage.ts) — `getRecentEntries` and `getMonthlyAggregates` should accept `UserData` parameter instead of re-reading localStorage
- [x] **3.2** Add `React.memo` to chart components — [EmissionPieChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmissionPieChart.tsx), [EmissionTrendChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmissionTrendChart.tsx), [MonthlyBarChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/MonthlyBarChart.tsx), [EcoScoreRing.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EcoScoreRing.tsx), [StatCard.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/StatCard.tsx)
- [x] **3.3** Wrap chart imports with `next/dynamic` + `{ ssr: false }` in dashboard and calculator pages — lazy-load Recharts bundle
- [x] **3.4** Memoize `generateSuggestions` and `generateReductionPlan` calls in [calculator/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/calculator/page.tsx) using `useMemo`
- [x] **3.5** Add `Suspense` boundaries around dashboard chart sections for progressive loading
- [x] **3.6** Lazy-render reduction plan items beyond the first 7 — only mount DOM nodes when `expanded` is true (currently rendering but CSS-hidden is fine, but DOM savings matter)
- [x] **3.7** Memoize `circumference` and `offset` calculations in [EcoScoreRing.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EcoScoreRing.tsx) with `useMemo`
- [x] **3.8** Add `next/image` optimization if any images are added — currently none but good practice to set up

---

## 4. Testing

### Current Gaps
- ❌ **ZERO test files exist** — no unit tests, integration tests, or E2E tests
- ❌ No test framework configured (no Jest, Vitest, or Playwright in dependencies)
- ❌ No `test` script in `package.json`
- ❌ No CI configuration

### Tasks

- [x] **4.1** Install Vitest + React Testing Library — `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] **4.2** Create [vitest.config.ts](file:///Users/sahil/Desktop/carbon-footprint/vitest.config.ts) with path aliases and jsdom environment
- [x] **4.3** Add `"test"` and `"test:coverage"` scripts to [package.json](file:///Users/sahil/Desktop/carbon-footprint/package.json)
- [x] **4.4** Create [lib/__tests__/calculations.test.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/__tests__/calculations.test.ts):
  - Test `calculateEmissions` for all 3 transport modes × 3 diet types (9 combos)
  - Test `calculateEcoScore` boundary values (score 0, 20, 40, 60, 80, 100)
  - Test `annualizeEmissions` returns weekly × 52
  - Test `getPercentageBreakdown` sums to ~100, handles zero total
- [x] **4.5** Create [lib/__tests__/suggestions.test.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/__tests__/suggestions.test.ts):
  - Test suggestion generation for car user vs bike user vs public transit
  - Test high-electricity user gets "reduce electricity" suggestion
  - Test non-vegetarian gets "reduce meat" suggestion
  - Test reduction plan customization for vegetarian and bike users
- [x] **4.6** Create [lib/__tests__/storage.test.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/__tests__/storage.test.ts):
  - Test `loadUserData` returns default when localStorage empty
  - Test `addEntry` persists and increments entries
  - Test `clearAllData` removes storage
  - Test `getRecentEntries` returns correct count
  - Test `getMonthlyAggregates` groups correctly
  - Mock `localStorage` for all tests
- [x] **4.7** Create [lib/__tests__/validation.test.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/__tests__/validation.test.ts) — test the new validation utility (after 2.2 is done)
- [x] **4.8** Create [components/__tests__/EcoScoreRing.test.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/__tests__/EcoScoreRing.test.tsx) — renders correct score, grade, applies correct color
- [x] **4.9** Create [components/__tests__/StatCard.test.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/__tests__/StatCard.test.tsx) — renders label, value, unit, trend indicator
- [x] **4.10** Ensure all tests pass with `npm test` and achieve **>80% code coverage** on `lib/` directory

---

## 5. Accessibility

### Current Gaps
- ❌ Only **1 aria attribute** in entire codebase (`aria-label="Toggle menu"` on mobile nav)
- ❌ No `role` attributes anywhere
- ❌ Calculator transport/diet buttons act as radio groups but have no `role="radiogroup"` / `role="radio"` / `aria-checked`
- ❌ No `aria-label` on icon-only buttons (Clear Data trash button on dashboard)
- ❌ Charts have no `aria-label` or screen reader fallback — completely invisible to assistive tech
- ❌ No skip-to-content link
- ❌ No `focus-visible` ring styles — keyboard users cannot see focus state on buttons and links
- ❌ Color contrast not verified — eco-score colors on light backgrounds may fail WCAG 2.1 AA
- ❌ Table in dashboard has no `<caption>` or `aria-label`
- ❌ Loading spinner has no `role="status"` or `aria-live="polite"`
- ❌ Mobile menu has no `aria-expanded` on toggle button
- ❌ No `<form>` element wrapping calculator inputs — no `fieldset`/`legend` for grouped inputs
- ❌ Reduction plan "Show all 30 days" button has no `aria-expanded`

### Tasks

- [x] **5.1** Add skip-to-content link — hidden `<a href="#main-content">` at top of [layout.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/layout.tsx), with `id="main-content"` on `<main>`
- [x] **5.2** Add `role="radiogroup"` and `aria-label` to transport mode and diet type button groups in [calculator/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/calculator/page.tsx); add `role="radio"` and `aria-checked` to each option button
- [x] **5.3** Add `aria-label="Clear all data"` to trash button in [dashboard/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/dashboard/page.tsx)
- [x] **5.4** Add `aria-label` descriptions to all chart containers — e.g., `aria-label="Pie chart showing emission breakdown by category"` on [EmissionPieChart.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EmissionPieChart.tsx)
- [x] **5.5** Add `role="img"` and `aria-label` to SVG in [EcoScoreRing.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/EcoScoreRing.tsx) — `aria-label="Eco score: 72 out of 100, grade B"`
- [x] **5.6** Add `role="status"` and `aria-live="polite"` to loading spinner in [LoadingState.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/LoadingState.tsx)
- [x] **5.7** Add `aria-expanded={mobileOpen}` to mobile toggle button in [Navbar.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/Navbar.tsx)
- [x] **5.8** Add `<caption>` or `aria-label` to the Recent Entries table in [dashboard/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/dashboard/page.tsx)
- [x] **5.9** Wrap calculator inputs in `<form>` with `<fieldset>` and `<legend>` for each category (Transport, Energy, Diet)
- [x] **5.10** Add visible focus ring styles in [globals.css](file:///Users/sahil/Desktop/carbon-footprint/app/globals.css):
  ```css
  *:focus-visible {
    outline: 2px solid var(--color-brand-blue);
    outline-offset: 2px;
  }
  ```
- [x] **5.11** Add `aria-expanded` to "Show all 30 days" button in [ReductionPlan.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/ReductionPlan.tsx)
- [x] **5.12** Ensure all color contrasts meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text) — particularly check `--color-mute: #8a8a8a` against `--color-surface-0: #f7f7f2` (currently ~3.5:1, **FAILS AA**)
- [x] **5.13** Add `aria-current="page"` to active nav link in [Navbar.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/Navbar.tsx)
- [x] **5.14** Add screen-reader-only text alternatives for chart data — hidden `<table>` or `<dl>` summarizing chart data for each Recharts chart

---

## 6. Problem Statement Alignment

> **"Helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights"**

### Current Gaps
- ❌ No comparison to national/regional averages — only global average used (less relevant)
- ❌ No goal-setting feature — users cannot set a reduction target
- ❌ No progress tracking against goals — dashboard shows data but no "you're X% toward your goal"
- ❌ No data export/share feature — users cannot share their results or export data
- ❌ No educational content about carbon footprint — just calculator results
- ❌ No community/social features — problem says "simple actions" but no gamification or habit tracking
- ❌ Suggestions are generated but not trackable — no way to mark a suggestion as "done"
- ❌ No notification/reminder system for 30-day plan
- ❌ No carbon equivalency translations (e.g., "that's like driving 50km" or "equals 3 trees absorbing CO₂ for a year")

### Tasks

- [x] **6.1** Add **Carbon Equivalencies** to results page — translate total emissions into relatable terms:
  - 🌳 Trees needed to offset
  - ✈️ Equivalent flight distance
  - 🚗 Equivalent driving distance
  - 💡 Lightbulb hours
  
  Create [lib/equivalencies.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/equivalencies.ts) and display in [calculator/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/calculator/page.tsx) results section

- [x] **6.2** Add **Goal Setting** feature — let users set a weekly CO₂ reduction target:
  - Store goal in localStorage via [lib/storage.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/storage.ts)
  - Show progress bar on [dashboard/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/dashboard/page.tsx) — "You're X% toward your weekly goal"
  - Create [components/GoalTracker.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/GoalTracker.tsx)

- [x] **6.3** Add **Country/Region Comparison** — dropdown to select country, compare user's footprint against national average:
  - Add country averages data in [lib/constants.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/constants.ts)
  - Display comparison bar chart on results page

- [x] **6.4** Add **Suggestion Tracking** — allow users to check off completed suggestions:
  - Add `completedSuggestions: string[]` to `UserData` type
  - Checkbox UI on [SuggestionCard.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/SuggestionCard.tsx)
  - Show completion count on dashboard

- [x] **6.5** Add **Data Export** — "Download as PDF" or "Export as JSON" button on dashboard:
  - JSON export with full history
  - Create [lib/export.ts](file:///Users/sahil/Desktop/carbon-footprint/lib/export.ts)

- [x] **6.6** Add **Education/Tips Page** — [app/learn/page.tsx](file:///Users/sahil/Desktop/carbon-footprint/app/learn/page.tsx) with:
  - What is a carbon footprint?
  - Global warming basics
  - How daily actions contribute to emissions
  - Sources and methodology for emission factors used

- [x] **6.7** Add **30-Day Plan Progress Tracking** — checkboxes for each day in [ReductionPlan.tsx](file:///Users/sahil/Desktop/carbon-footprint/components/ReductionPlan.tsx):
  - Store completed days in localStorage
  - Show progress indicator "Day 7/30 — 23% complete"

- [x] **6.8** Add **Historical Comparison Badge** on dashboard — "Your emissions decreased 15% compared to your first entry! 🎉"

---

## Priority Execution Order

> [!IMPORTANT]
> The competition likely weighs **Testing** and **Accessibility** highest since these are the most commonly missed. Focus there first.

### Phase 1 — Critical Infrastructure (do first)
| # | Task | Category |
|---|------|----------|
| 4.1–4.3 | Set up Vitest + test scripts | Testing |
| 5.10 | Focus-visible ring styles | Accessibility |
| 5.1 | Skip-to-content link | Accessibility |
| 1.1–1.3 | Error/404/Loading pages | Code Quality |
| 2.3 | Security headers | Security |

### Phase 2 — Core Quality
| # | Task | Category |
|---|------|----------|
| 4.4–4.6 | Unit tests for lib/ | Testing |
| 5.2–5.9, 5.11–5.14 | All accessibility fixes | Accessibility |
| 2.1–2.2 | Zod validation + input sanitization | Security |
| 1.4–1.6 | DRY refactors + validation layer | Code Quality |
| 3.1–3.4 | Performance optimizations | Efficiency |

### Phase 3 — Problem Alignment Features
| # | Task | Category |
|---|------|----------|
| 6.1 | Carbon equivalencies | Alignment |
| 6.2 | Goal setting + tracker | Alignment |
| 6.4 | Suggestion tracking | Alignment |
| 6.7 | 30-day plan tracking | Alignment |
| 6.6 | Education/Learn page | Alignment |

### Phase 4 — Polish
| # | Task | Category |
|---|------|----------|
| 4.7–4.10 | Remaining tests + coverage | Testing |
| 3.5–3.8 | Suspense + memo optimizations | Efficiency |
| 2.4–2.7 | Storage limits + export | Security |
| 6.3, 6.5, 6.8 | Country comparison, export, badges | Alignment |
| 1.7–1.10 | Docs, JSDoc, README | Code Quality |

---

## Summary of Current Scores (Estimated)

| Criteria | Current (est.) | Target | Gap |
|----------|---------------|--------|-----|
| Code Quality | 65/100 | 100 | Missing error boundaries, DRY violations, no validation |
| Security | 45/100 | 100 | No input validation, unsafe JSON parse, no CSP headers |
| Efficiency | 60/100 | 100 | Redundant localStorage reads, no memo, no lazy loading |
| Testing | **0/100** | 100 | **Zero tests exist** |
| Accessibility | **15/100** | 100 | 1 aria-label total, no roles, no focus states, contrast fails |
| Problem Alignment | 55/100 | 100 | Calculator + dashboard exist but no goals, tracking, education |
| **Overall** | **~40/100** | **100** | |

> [!CAUTION]
> **Testing (0/100) and Accessibility (15/100) are the most critical gaps.** These alone could drop the total score to failing levels. Prioritize these above all else.
