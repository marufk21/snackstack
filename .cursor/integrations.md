# Third-Party Integrations

## Stripe (Payments)

### Configuration

Use the configured Stripe clients from `/config/stripe.ts` and `/config/stripe-client.ts`:

```typescript
// Server-side (API routes)
import { stripe } from "@/config/stripe";

// Client-side (components)
import { stripePromise } from "@/config/stripe-client";
```

### Payment Flow

**Creating Checkout Sessions**:

```typescript
// app/api/stripe/create-checkout-session/route.ts
import { stripe } from "@/config/stripe";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscription/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

**Client-side Checkout**:

```typescript
// hooks/use-stripe-checkout.ts
import { loadStripe } from "@stripe/stripe-js";
import { stripePromise } from "@/config/stripe-client";

export function useStripeCheckout() {
  const redirectToCheckout = async (priceId: string) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return { redirectToCheckout };
}
```

### Webhook Handling

```typescript
// app/api/stripe/webhook/route.ts
import { stripe } from "@/config/stripe";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
```

## Cloudinary (File Upload)

### Configuration

Use utilities from `/lib/utils/cloudinary-client.ts`:

```typescript
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/utils/cloudinary-client";
```

### Upload Flow

**Server-side Upload API**:

```typescript
// app/api/upload/route.ts
import { uploadToCloudinary } from "@/lib/server/cloudinary";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, {
      folder: `snackstack/${userId}`,
      resource_type: "auto",
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

**Client-side Upload Hook**:

```typescript
// hooks/use-image-upload.ts
import { useMutation } from "@tanstack/react-query";

type UploadResult = {
  url: string;
  publicId: string;
};

export function useImageUpload() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
  });
}
```

### Image Component Usage

```typescript
import { CldImage } from "next-cloudinary";

export default function ImageDisplay({ publicId }: { publicId: string }) {
  return (
    <CldImage
      src={publicId}
      width={400}
      height={300}
      alt="Uploaded image"
      crop="fill"
      gravity="auto"
    />
  );
}
```

## Gemini AI (AI Suggestions)

Follow patterns in `/server/api/ai-suggestion.ts`:

### API Integration

```typescript
// app/api/ai-suggestion/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt, context } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancedPrompt = `
      Context: ${context}
      
      User request: ${prompt}
      
      Please provide a helpful suggestion based on the context and request.
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
```

### Client-side Usage

```typescript
import { useMutation } from "@tanstack/react-query";

type SuggestionRequest = {
  prompt: string;
  context: string;
};

export function useAISuggestion() {
  return useMutation({
    mutationFn: async ({ prompt, context }: SuggestionRequest) => {
      const response = await fetch("/api/ai-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI suggestion");
      }

      const { suggestion } = await response.json();
      return suggestion;
    },
  });
}
```

## PostHog (Analytics)

Use the custom hook from `/hooks/use-posthog.ts`:

### Configuration

```typescript
// providers/posthog-provider.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function PostHogProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

### Event Tracking

```typescript
// hooks/use-posthog.ts
import { usePostHog } from "posthog-js/react";

export function useAnalytics() {
  const posthog = usePostHog();

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    posthog?.capture(eventName, properties);
  };

  const identifyUser = (userId: string, traits?: Record<string, any>) => {
    posthog?.identify(userId, traits);
  };

  return { trackEvent, identifyUser };
}
```

**Usage in Components**:

```typescript
import { useAnalytics } from "@/hooks/use-posthog";

export default function NoteEditor() {
  const { trackEvent } = useAnalytics();

  const handleSave = () => {
    // Save logic
    trackEvent("note_saved", {
      noteId: note.id,
      wordCount: note.content.length,
    });
  };

  return (
    <div>
      <button onClick={handleSave}>Save Note</button>
    </div>
  );
}
```

## Clerk (Authentication)

### User Management

```typescript
import { clerkClient } from "@clerk/nextjs";

// Get user data
const user = await clerkClient.users.getUser(userId);

// Update user metadata
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    subscriptionTier: "premium",
  },
});
```

### Webhooks

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET!);

  try {
    const evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    });

    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
```

## Environment Variables

### Required Variables

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI
GEMINI_API_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=
```

### Environment Validation

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## Error Handling & Monitoring

### Integration Error Patterns

```typescript
// Generic integration error handling
class IntegrationError extends Error {
  constructor(message: string, public service: string, public code?: string) {
    super(message);
    this.name = "IntegrationError";
  }
}

// Usage
try {
  await stripe.checkout.sessions.create(sessionData);
} catch (error) {
  throw new IntegrationError(
    "Failed to create checkout session",
    "stripe",
    error.code
  );
}
```

### Rate Limiting for External APIs

```typescript
// Simple rate limiter for external API calls
class APIRateLimiter {
  private calls: number = 0;
  private resetTime: number = Date.now() + 60000; // 1 minute

  async checkLimit(maxCalls: number = 100) {
    if (Date.now() > this.resetTime) {
      this.calls = 0;
      this.resetTime = Date.now() + 60000;
    }

    if (this.calls >= maxCalls) {
      throw new Error("Rate limit exceeded");
    }

    this.calls++;
  }
}
```
