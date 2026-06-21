# CarbonTrack — Carbon Footprint Awareness Platform

CarbonTrack is a modern, responsive web application designed to help individuals understand, track, and systematically reduce their carbon footprint through simple actions and personalized insights.

It uses a warm, nature-inspired light design system with a clean, grid-based aesthetic, rich transitions, and interactive components.

---

## 📖 Table of Contents
1. [Features](#-features)
2. [Architecture & Design](#-architecture--design)
3. [Folder Structure](#-folder-structure)
4. [Getting Started](#-getting-started)
5. [Testing & Verification](#-testing--verification)
6. [Deployment](#-deployment)
7. [Methodology & Emission Factors](#-methodology--emission-factors)

---

## ✨ Features

- **Carbon Calculator**: An intuitive 3-step questionnaire calculating weekly carbon emissions across transportation, household energy, and dietary habits.
- **Interactive Dashboard**: Aggregated insights and rich visualizations including:
  - **Weekly Trend**: Area chart showing total weekly footprint over time.
  - **Latest Breakdown**: Pie chart illustrating transport vs. energy vs. diet contribution.
  - **Monthly Comparison**: Stacked bar chart showing month-over-month comparisons.
  - **Eco-Score**: A 0–100 score and letter grade (A-F) based on ecological performance.
- **AI-Powered Insights**: Custom suggestions tailored to user inputs with estimated weekly CO₂ savings.
- **30-Day Reduction Plan**: A progressive day-by-day roadmap with concrete actionable steps for carbon reduction.
- **Privacy-First**: No databases, no user accounts, and no tracking. All data resides safely in your browser's `localStorage`.

---

## 🏗️ Architecture & Design

### Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (vanilla CSS variables configuration)
- **Charts**: Recharts (with shared tooltip configurations)
- **Icons**: Lucide React

### Performance Optimization
- **Dynamic Code Splitting**: Heavy dependencies like Recharts are dynamically loaded via `next/dynamic` with `ssr: false` to reduce initial Javascript bundle size and speed up page interactive times.
- **Progressive Loading**: Skeletons are wrapped around dynamic chart imports via `<Suspense>` boundaries to ensure layout stability during lazy loading.
- **Component Memoization**: Key visual elements including all charts (`EmissionPieChart`, `EmissionTrendChart`, `MonthlyBarChart`), layout cards (`StatCard`), and SVG rings (`EcoScoreRing`) are optimized with `React.memo` to prevent unnecessary re-renderings.
- **Calculation Memoization**: Circular ring circumference/offsets, suggestions, and reduction plans are memoized with `useMemo` hooks to avoid costly recalculations on state changes.
- **Image Optimization**: Pre-configured to utilize the Next.js native `next/image` wrapper (`<Image />`) for modern WebP compression, lazy-loading, and layout stability should static graphic assets be added to the codebase in the future.

### System Diagram
```text
+--------------------------------------------------------------+
|                         Web Browser                          |
+--------------------------------------------------------------+
                               |
       +-----------------------+-----------------------+
       |                                               |
       v                                               v
+--------------+                               +---------------+
| Next.js Pages| <--- [Client State Hooks] --> |  Components   |
+--------------+                               +---------------+
       |                                               |
       |                                               |
       v                                               v
+---------------+                             +----------------+
|  Storage Lib  | <====== [JSON Storage] =====> |  localStorage  |
|  (storage.ts) |                             |   (Browser)    |
+---------------+                             +----------------+
       |
       +=================[Calculations]================+
       |                                               |
       v                                               v
+------------------+                          +----------------+
| calculations.ts  |                          | suggestions.ts |
| (CO2 & Score)    |                          | (AI Insights)  |
+------------------+                          +----------------+
```

---

## 📂 Folder Structure

```text
carbon-footprint/
├── app/                  # Next.js Pages and App Router setup
│   ├── calculator/       # Carbon Footprint Calculator Page
│   ├── dashboard/        # Interactive Dashboard Page
│   ├── error.tsx         # Global Error Boundary Page
│   ├── globals.css       # Core Design Tokens & Stylesheet
│   ├── layout.tsx        # Root HTML Wrapper (Navbar & Footer)
│   ├── loading.tsx       # Root Route Transition Spinner
│   ├── not-found.tsx     # Custom 404 Page
│   └── page.tsx          # Homepage
├── components/           # Reusable UI & Chart Components
│   ├── EcoScoreRing.tsx  # Circular score indicator
│   ├── EmissionPieChart.tsx
│   ├── EmissionTrendChart.tsx
│   ├── EmptyState.tsx
│   ├── Footer.tsx
│   ├── LoadingState.tsx
│   ├── MonthlyBarChart.tsx
│   ├── Navbar.tsx
│   ├── ReductionPlan.tsx
│   └── StatCard.tsx
├── hooks/                # Custom React Hooks
│   └── useUserData.ts    # Stateful localStorage wrapper
├── lib/                  # Helper modules and constants
│   ├── calculations.ts   # Carbon emission & Eco-score algorithms
│   ├── chartConfig.ts    # Shared Recharts style utilities
│   ├── constants.ts      # Thresholds & emission factors
│   ├── storage.ts        # localStorage read/write helpers
│   ├── suggestions.ts    # AI Recommendation engines
│   └── validation.ts     # Input validation layers
├── types/                # TypeScript Interfaces
└── public/               # Static assets & icons
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or npm 9+

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd carbon-footprint
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Verify codebase integrity and code style conformance:

### Linting
To check for syntax, type, and code-style issues:
```bash
npm run lint
```

To run the strict lint command enforcing zero warnings:
```bash
npm run lint:strict
```

### Build Production Bundle
To build the application for deployment:
```bash
npm run build
```

---

## 🌐 Deployment

CarbonTrack is optimized for easy deployment on **Vercel** or other static/node hosts.

To deploy on Vercel:
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root folder.
3. Follow the interactive prompts to link and deploy.

---

## 📊 Methodology & Emission Factors

All emission calculations are based on standard industry averages derived from EPA and Greenhouse Gas Protocol documentation.

### 🚗 1. Transportation
Emissions are calculated per week based on travel distance:
- **Car**: `0.171 kg CO₂ / km` (based on average passenger vehicle emissions)
- **Public Transit**: `0.046 kg CO₂ / km` (average shared train/bus transit intensity)
- **Bike/Walk**: `0 kg CO₂ / km` (zero emission mode)

$$\text{Transport Emissions} = \text{Distance (km)} \times \text{Factor (kg/km)}$$

### ⚡ 2. Household Energy
Electricity is annualized and converted to weekly averages:
- **Electricity**: `0.453 kg CO₂ / kWh` (based on global average grid emission factors)
- Calculation:
  $$\text{Energy Emissions} = \frac{\text{Monthly Consumption (kWh)} \times 0.453 \times 12}{52}$$

### 🥗 3. Dietary Choices
Daily dietary footprints are scaled to weekly amounts:
- **Mixed (Meat & Vegetables)**: `4.5 kg CO₂ / day`
- **Vegetarian**: `2.5 kg CO₂ / day`
- **Vegan**: `1.5 kg CO₂ / day`
- Calculation:
  $$\text{Diet Emissions} = \text{Daily Footprint} \times 7$$

---
*Built for a greener future.* 🌍
