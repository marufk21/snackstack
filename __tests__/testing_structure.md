# SnackStack Testing Folder Structure
https://chatgpt.com/c/69ef1cdc-c26c-83e8-887b-f83e30362efd

## Recommended `__tests__` Directory Structure

```
__tests__/
├── unit/                          # ⚡ Pure logic, isolated components
│   ├── components/                # Component rendering & behavior
│   │   ├── ui/                    # shadcn/ui wrapper tests
│   │   │   └── button.test.tsx
│   │   ├── dashboard/             # Dashboard feature components
│   │   │   ├── note-card.test.tsx
│   │   │   ├── note-editor.test.tsx
│   │   │   └── sidebar.test.tsx
│   │   ├── landing/               # Landing page components
│   │   │   ├── hero.test.tsx
│   │   │   └── pricing-card.test.tsx
│   │   ├── auth/                  # Auth-related components
│   │   │   └── login-form.test.tsx
│   │   └── subscription/          # Subscription UI
│   │       └── plan-selector.test.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.test.ts
│   │   ├── use-image-upload.test.ts
│   │   ├── use-stripe-checkout.test.ts
│   │   └── use-subscription.test.ts
│   │
│   ├── stores/                    # Zustand stores
│   │   └── use-app-store.test.ts
│   │
│   ├── lib/                       # Utility functions & pure logic
│   │   ├── utils/
│   │   │   ├── index.test.ts
│   │   │   ├── notes.test.ts
│   │   │   ├── rate-limit.test.ts
│   │   │   ├── api-protection.test.ts
│   │   │   └── subscription-check.test.ts
│   │   └── validations/
│   │       └── index.test.ts
│   │
│   └── server/                    # Server-side pure logic
│       └── api/
│           ├── notes.test.ts
│           ├── ai-suggestion.test.ts
│           └── upload.test.ts
│
├── integration/                   # 🔗 Multiple units working together
│   ├── api/                       # API route handler tests
│   │   ├── notes/
│   │   │   └── route.test.ts      # CRUD operations for notes
│   │   ├── ai-suggestion/
│   │   │   └── route.test.ts      # AI suggestion endpoint
│   │   ├── auth/
│   │   │   └── route.test.ts      # Auth callback/session
│   │   ├── stripe/
│   │   │   └── route.test.ts      # Stripe webhook & checkout
│   │   ├── subscription/
│   │   │   └── route.test.ts      # Subscription management
│   │   └── upload/
│   │       └── route.test.ts      # Image upload flow
│   │
│   ├── db/                        # Database interaction tests
│   │   ├── notes.test.ts          # Prisma note queries
│   │   └── user.test.ts           # Prisma user queries
│   │
│   └── flows/                     # Multi-component interactions
│       ├── note-creation.test.tsx  # Form → API → Store update
│       └── subscription-flow.test.tsx
│
└── e2e/                           # 🌐 Full user journey (Playwright)
    ├── fixtures/                  # Shared test fixtures & helpers
    │   ├── auth.fixture.ts        # Login/auth setup
    │   └── test-data.ts           # Seed data for e2e
    │
    ├── pages/                     # Page Object Models
    │   ├── landing.page.ts
    │   ├── dashboard.page.ts
    │   ├── login.page.ts
    │   └── notes.page.ts
    │
    ├── specs/                     # Actual test specs
    │   ├── auth.spec.ts           # Sign up, login, logout
    │   ├── notes-crud.spec.ts     # Create, read, update, delete notes
    │   ├── ai-suggestion.spec.ts  # AI suggestion feature
    │   ├── subscription.spec.ts   # Stripe checkout & plan management
    │   └── landing.spec.ts        # Landing page rendering & navigation
    │
    └── playwright.config.ts       # Playwright-specific config
```

---

## Testing Layers Explained

### 1. Unit Tests (`__tests__/unit/`)

> [!TIP]
> Start here — these are the fastest, cheapest, and most valuable tests.

| What to Test | Tool | Example |
|---|---|---|
| Utility functions | Jest | `cn()`, `formatDate()`, `slugify()` |
| Validation schemas | Jest | Zod schema `.parse()` / `.safeParse()` |
| Zustand stores | Jest | State transitions, actions |
| Custom hooks | Jest + `renderHook` | `useMobile`, `useSubscription` |
| Components (render) | Jest + RTL | Does it render? Props → output? |
| Rate limiter logic | Jest | Token bucket behavior |

**Config:** Uses your existing `jest.config.js` (needs TypeScript support added).

---

### 2. Integration Tests (`__tests__/integration/`)

> [!IMPORTANT]
> These test multiple units working together — API routes with DB, component flows with stores.

| What to Test | Tool | Example |
|---|---|---|
| API route handlers | Jest + `next/test` or supertest | POST `/api/notes` creates a note |
| DB queries via Prisma | Jest + test DB | `createNote()`, `getNotesByUser()` |
| Component → API flows | Jest + RTL + MSW | Form submit → API call → UI update |
| Auth-protected routes | Jest + mocked auth | Middleware blocks unauthenticated |

**Mocking:** Use [MSW (Mock Service Worker)](https://mswjs.io/) for API mocking in component tests.  
**Database:** Use a separate test database or Prisma's `--preview` features.

---

### 3. E2E Tests (`__tests__/e2e/`)

> [!NOTE]
> These run against a real browser — slowest but highest confidence. Add these last.

| What to Test | Tool | Example |
|---|---|---|
| Full user journeys | Playwright | Sign up → Create note → Delete note |
| Stripe checkout flow | Playwright | Click plan → Stripe form → Redirect |
| Cross-page navigation | Playwright | Landing → Login → Dashboard |
| Responsive layouts | Playwright | Mobile vs desktop viewports |

---

## Config Updates Needed

### 1. Update `jest.config.js` (Unit + Integration)

```js
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterSetup: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Separate unit and integration via projects
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/__tests__/unit/**/*.test.{ts,tsx}"],
      testEnvironment: "jsdom",
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/__tests__/integration/**/*.test.{ts,tsx}"],
      testEnvironment: "node", // API routes run in Node
    },
  ],
};

module.exports = createJestConfig(config);
```

### 2. Update `package.json` scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "playwright test --config __tests__/e2e/playwright.config.ts",
    "test:all": "pnpm test:unit && pnpm test:integration && pnpm test:e2e"
  }
}
```

### 3. Install Additional Dependencies

```bash
# TypeScript support for Jest
pnpm add -D ts-jest @types/jest

# MSW for API mocking in integration tests
pnpm add -D msw

# Playwright for E2E (install later when ready)
pnpm add -D @playwright/test
npx playwright install
```

---

## Naming Conventions

| Convention | Example |
|---|---|
| Test files | `kebab-case.test.ts` / `.test.tsx` |
| Describe blocks | `describe("NoteCard", ...)` — component name |
| Test names | `it("should render note title", ...)` |
| Fixtures | `kebab-case.fixture.ts` |
| Page objects (e2e) | `kebab-case.page.ts` |

---

## Priority Order

1. **Unit tests for `lib/utils/`** — pure functions, easy wins
2. **Unit tests for Zustand store** — state logic
3. **Unit tests for hooks** — `renderHook` based
4. **Unit tests for components** — rendering & interaction
5. **Integration tests for API routes** — CRUD endpoints
6. **Integration tests for DB** — Prisma queries
7. **E2E tests** — full user journeys (add last)

> [!CAUTION]
> Don't try to set up all three layers at once. Get unit tests green first, then add integration, then e2e.
