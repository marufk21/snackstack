# API Guidelines

## API Routes

### RESTful Conventions

Follow standard HTTP methods and status codes:

| Method   | Purpose                | Example                 |
| -------- | ---------------------- | ----------------------- |
| `GET`    | Retrieve data          | `GET /api/notes`        |
| `POST`   | Create new resource    | `POST /api/notes`       |
| `PUT`    | Update entire resource | `PUT /api/notes/123`    |
| `PATCH`  | Partial update         | `PATCH /api/notes/123`  |
| `DELETE` | Remove resource        | `DELETE /api/notes/123` |

### Route Structure

```typescript
// app/api/notes/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    // Query logic here
    const notes = await fetchNotes({ page: parseInt(page) });

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    const note = await createNote(validatedData);

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
```

### Error Handling

**Standard Error Response Format**:

```typescript
type ApiError = {
  error: string;
  details?: unknown;
  code?: string;
};
```

**Error Status Codes**:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (unexpected errors)

### Request Validation

Always validate incoming data with Zod schemas:

```typescript
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  isPublic: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
  }
}
```

## Database Guidelines (Prisma)

### Client Usage

```typescript
import { db } from "@/lib/database/client";

// Always use the configured client
const notes = await db.note.findMany({
  where: { userId },
  select: {
    id: true,
    title: true,
    createdAt: true,
    // Only select needed fields
  },
});
```

### Query Patterns

**Single Record**:

```typescript
const note = await db.note.findUnique({
  where: { id: noteId },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});
```

**Multiple Records with Pagination**:

```typescript
const notes = await db.note.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  take: 10,
  skip: (page - 1) * 10,
});
```

**Complex Queries**:

```typescript
const notes = await db.note.findMany({
  where: {
    AND: [
      { userId },
      { isPublic: true },
      {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
    ],
  },
});
```

### Transactions

Use transactions for multi-table operations:

```typescript
const result = await db.$transaction(async (tx) => {
  const note = await tx.note.create({
    data: { title, content, userId },
  });

  await tx.activityLog.create({
    data: {
      action: "NOTE_CREATED",
      userId,
      resourceId: note.id,
    },
  });

  return note;
});
```

### Error Handling

```typescript
import { Prisma } from "@prisma/client";

try {
  const note = await db.note.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "Resource already exists" },
        { status: 409 }
      );
    }
  }

  throw error; // Re-throw unknown errors
}
```

## Authentication (Clerk)

### Server-Side Authentication

```typescript
import { auth } from "@clerk/nextjs";

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Proceed with authenticated user
  const notes = await db.note.findMany({
    where: { userId },
  });

  return NextResponse.json(notes);
}
```

### Client-Side Authentication

```typescript
import { useUser } from "@clerk/nextjs";

export default function ProtectedComponent() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) redirect("/sign-in");

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Route Protection

Use middleware for route-level protection:

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/notes/public/(.*)", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/((?!api|trpc))(_next|.+.\\w+$)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Rate Limiting

Implement rate limiting for API endpoints:

```typescript
import { rateLimit } from "@/lib/utils/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(10, "CACHE_TOKEN"); // 10 requests per minute
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Proceed with request
}
```

## API Response Patterns

### Success Responses

```typescript
// Single resource
return NextResponse.json(
  {
    data: note,
    message: "Note created successfully",
  },
  { status: 201 }
);

// List with pagination
return NextResponse.json({
  data: notes,
  pagination: {
    page,
    limit,
    total,
    hasNext: page * limit < total,
  },
});

// Simple success
return NextResponse.json({
  success: true,
  message: "Operation completed",
});
```

### Error Responses

```typescript
// Validation error
return NextResponse.json(
  {
    error: "Validation failed",
    details: zodError.errors,
  },
  { status: 400 }
);

// Authentication error
return NextResponse.json(
  {
    error: "Authentication required",
    code: "UNAUTHORIZED",
  },
  { status: 401 }
);

// Not found
return NextResponse.json(
  {
    error: "Resource not found",
    code: "NOT_FOUND",
  },
  { status: 404 }
);
```

## Security Best Practices

### Input Sanitization

```typescript
import { z } from "zod";

const sanitizeString = (str: string) => str.trim().replace(/[<>]/g, "");

const schema = z.object({
  title: z.string().transform(sanitizeString),
  content: z.string().transform(sanitizeString),
});
```

### SQL Injection Prevention

Always use Prisma's type-safe queries - never raw SQL with user input:

```typescript
// ✅ Safe - Prisma handles escaping
const notes = await db.note.findMany({
  where: { title: { contains: userInput } },
});

// ❌ Dangerous - Raw SQL with user input
const notes = await db.$queryRaw`
  SELECT * FROM notes WHERE title LIKE ${userInput}
`;
```

### CORS Configuration

```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);

  response.headers.set("Access-Control-Allow-Origin", "https://yourdomain.com");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
```
