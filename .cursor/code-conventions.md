# Code Conventions

## General Guidelines

- **TypeScript Strict**: No `any` types unless absolutely necessary
- **Function Style**: Prefer function declarations over arrow functions for components
- **Naming**: Use descriptive variable and function names
- **Types**: Always add proper TypeScript types for props and return values
- **Const Assertions**: Use where appropriate for better type inference

## File Naming Conventions

| File Type  | Convention          | Example            |
| ---------- | ------------------- | ------------------ |
| Components | kebab-case + `.tsx` | `note-card.tsx`    |
| Utilities  | kebab-case + `.ts`  | `rate-limit.ts`    |
| API Routes | `route.ts`          | `route.ts`         |
| Pages      | `page.tsx`          | `page.tsx`         |
| Hooks      | kebab-case + `.ts`  | `use-posthog.ts`   |
| Stores     | kebab-case + `.ts`  | `use-app-store.ts` |

## Component Structure

```typescript
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks first
  const [state, setState] = useState<string>("");
  const { data, isLoading } = useQuery();
  const router = useRouter();

  // 2. Event handlers
  const handleClick = () => {
    // handler logic
  };

  const handleSubmit = async (data: FormData) => {
    // async handler logic
  };

  // 3. Early returns for loading/error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // 4. Main render
  return (
    <div className="flex flex-col gap-4 p-4">{/* component content */}</div>
  );
}

// Types at the bottom
type ComponentProps = {
  prop1: string;
  prop2: number;
  onSubmit?: (data: FormData) => void;
};
```

## Import Order

```typescript
// 1. React and Next.js imports
import { useState, useEffect } from "react";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

// 2. Third-party libraries
import { clsx } from "clsx";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

// 3. Internal utilities and configs
import { cn } from "@/lib/utils";
import { db } from "@/lib/database";
import { auth } from "@/config/auth";

// 4. Components (UI first, then feature components)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NoteCard } from "@/components/dashboard/note-card";

// 5. Types and interfaces
import type { Note, User } from "@/lib/types";

// 6. Relative imports
import "./component.css";
```

## TypeScript Guidelines

### Prefer Types over Interfaces

```typescript
// ✅ Good - Use type
type UserPreferences = {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
};

// ❌ Avoid - Interface
interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
}
```

### Strict Typing

```typescript
// ✅ Good - Specific types
type Status = "loading" | "success" | "error";
type ApiResponse<T> = {
  data: T;
  status: Status;
  message?: string;
};

// ❌ Avoid - Any type
type ApiResponse = {
  data: any;
  status: string;
  message?: string;
};
```

### Prop Types

```typescript
// ✅ Good - Clear prop types
type ButtonProps = {
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

// ✅ Good - Optional props clearly marked
type FormProps = {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
};
```

## Error Handling

### API Routes

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);

    const result = await processData(validatedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Component Error Handling

```typescript
export default function DataComponent({ id }: { id: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["data", id],
    queryFn: () => fetchData(id),
  });

  // Handle different states clearly
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

## Code Quality Rules

1. **Single Responsibility**: Keep functions focused on one task
2. **Pure Functions**: Prefer pure functions where possible
3. **Immutability**: Don't mutate props or state directly
4. **Descriptive Names**: Use clear, descriptive variable and function names
5. **Early Returns**: Use early returns to reduce nesting
6. **Type Safety**: Leverage TypeScript's type system fully
7. **Consistent Formatting**: Let Prettier handle formatting
8. **No Dead Code**: Remove unused imports, variables, and functions
