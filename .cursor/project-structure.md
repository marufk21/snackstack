# Project Structure

## Folder Architecture

```
SnackStack/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   ├── (landing)/         # Landing page route group
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard components
│   └── auth/             # Authentication components
├── lib/                  # Shared utilities
│   ├── constants/        # App constants
│   ├── database/         # Database utilities
│   ├── server/           # Server-side utilities
│   ├── services/         # Service layer
│   ├── utils/            # General utilities
│   └── validations/      # Zod schemas
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── config/               # Configuration files
├── server/               # Server-side code
│   ├── api/             # Server API logic
│   ├── db/              # Database schema & migrations
│   └── services/        # Business logic services
└── providers/           # React context providers
```

## Folder Guidelines

### `/app` Directory (Next.js App Router)

**Route Groups** - Use parentheses for organizing routes without affecting URL structure:

- `(auth)/` - Authentication pages (sign-in, sign-up)
- `(dashboard)/` - Protected dashboard pages
- `(landing)/` - Public marketing pages

**API Routes** - Follow RESTful patterns:

```
api/
├── notes/
│   ├── route.ts          # GET /api/notes, POST /api/notes
│   ├── [id]/route.ts     # GET/PUT/DELETE /api/notes/[id]
│   └── public/[slug]/route.ts
├── stripe/
│   ├── webhook/route.ts
│   └── create-checkout-session/route.ts
└── upload/route.ts
```

### `/components` Directory

**Organization by Feature**:

```
components/
├── ui/                   # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── notification.tsx
├── landing/              # Landing page specific
│   ├── hero.tsx
│   ├── cta.tsx
│   ├── testimonials.tsx
│   └── index.ts         # Export barrel
├── dashboard/            # Dashboard specific
│   ├── note-card.tsx
│   ├── note-editor.tsx
│   └── note-view-modal.tsx
└── auth/                 # Authentication specific
    ├── auth-check.tsx
    ├── error-boundary.tsx
    └── redirect-handler.tsx
```

**Component Naming**:

- Use kebab-case for files: `note-editor.tsx`
- Use PascalCase for components: `NoteEditor`
- Group related components in feature folders

### `/lib` Directory

**Utilities Organization**:

```
lib/
├── constants/
│   └── index.ts         # App-wide constants
├── database/
│   ├── client.ts        # Database client setup
│   ├── queries.ts       # Database query functions
│   └── index.ts         # Exports
├── server/              # Server-side only utilities
│   ├── cloudinary.ts
│   └── index.ts
├── services/            # Business logic layer
│   ├── query-client.ts
│   └── index.ts
├── utils/               # General utilities
│   ├── index.ts         # cn() and common utils
│   ├── notes.ts         # Note-specific utilities
│   ├── rate-limit.ts    # Rate limiting
│   └── cloudinary-client.ts
└── validations/         # Zod schemas
    └── index.ts
```

### `/hooks` Directory

Custom React hooks with clear naming:

```
hooks/
├── use-posthog.ts           # PostHog integration
├── use-stripe-checkout.ts   # Stripe checkout logic
├── use-image-upload.ts      # Image upload functionality
└── use-image-upload-mutation.ts
```

### `/stores` Directory

Zustand stores for global state:

```
stores/
├── use-app-store.ts         # Global app state
└── use-note-editor-store.ts # Note editor state
```

### `/config` Directory

Configuration files for external services:

```
config/
├── app.ts               # App configuration
├── auth.ts              # Clerk authentication
├── database.ts          # Database configuration
├── stripe.ts            # Stripe configuration
├── stripe-client.ts     # Client-side Stripe
├── cloudinary.ts        # Cloudinary configuration
└── index.ts             # Export barrel
```

### `/server` Directory

Server-side logic separated from client code:

```
server/
├── api/                 # Server API logic
│   ├── notes.ts
│   ├── ai-suggestion.ts
│   ├── upload.ts
│   └── index.ts
├── db/                  # Database related
│   ├── schema.prisma    # Prisma schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Database seeding
└── services/            # Business logic services
```

## File Organization Rules

### 1. Barrel Exports

Use `index.ts` files to create clean import paths:

```typescript
// components/landing/index.ts
export { Hero } from "./hero";
export { CTA } from "./cta";
export { Testimonials } from "./testimonials";

// Usage
import { Hero, CTA, Testimonials } from "@/components/landing";
```

### 2. Feature-Based Organization

Group related functionality together:

```
dashboard/
├── components/
│   ├── note-card.tsx
│   ├── note-editor.tsx
│   └── note-list.tsx
├── hooks/
│   └── use-notes.ts
└── stores/
    └── use-note-store.ts
```

### 3. Shared vs Feature-Specific

- **Shared**: Goes in `/lib`, `/components/ui`, `/hooks`
- **Feature-specific**: Goes in feature folders

### 4. Import Path Aliases

Use configured aliases for clean imports:

```typescript
// tsconfig.json paths
{
  "@/*": ["./"],
  "@/components/*": ["./components/*"],
  "@/lib/*": ["./lib/*"],
  "@/hooks/*": ["./hooks/*"],
  "@/stores/*": ["./stores/*"],
  "@/config/*": ["./config/*"],
  "@/server/*": ["./server/*"]
}
```

## Best Practices

### 1. Keep Related Code Together

- Components should be near their related hooks and utilities
- Feature-specific code should be grouped together

### 2. Use Descriptive Folder Names

- Avoid generic names like `components/common`
- Use specific names like `components/dashboard`

### 3. Maintain Consistent Depth

- Don't nest folders too deeply (max 3-4 levels)
- Use flat structures when possible

### 4. Separate Concerns

- Keep client and server code separate
- Separate business logic from UI components
- Keep utilities pure and reusable

### 5. Documentation

- Add README.md files for complex folders
- Use TypeScript for self-documenting code
- Keep folder structure documented and up-to-date
