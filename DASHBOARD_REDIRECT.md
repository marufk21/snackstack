# Dashboard Redirect Implementation

This document explains how the user-specific dashboard redirect functionality works in the SnackStack application.

## Overview

After a user signs in or signs up with Clerk, they are automatically redirected to their own personalized dashboard page at `/dashboard/[userId]` where `[userId]` is their unique Clerk user ID.

## Implementation Details

### 1. Dynamic Dashboard Route

- **Location**: `app/(dashboard)/dashboard/[userId]/page.tsx`
- **Purpose**: Renders the user-specific dashboard page
- **Features**:
  - Displays personalized welcome message with user's name
  - Validates that the user can only access their own dashboard
  - Redirects unauthorized users to their correct dashboard
  - Shows loading state while user data is being fetched

### 2. Redirect Handler Component

- **Location**: `components/auth/redirect-handler.tsx`
- **Purpose**: Handles client-side redirects from generic `/dashboard` to user-specific dashboard
- **Features**:
  - Uses Clerk's `useUser` hook to get current user information
  - Automatically redirects users from `/dashboard` to `/dashboard/[userId]`
  - Only triggers redirects when user data is fully loaded

### 3. Middleware Updates

- **Location**: `middleware.ts`
- **Purpose**: Handles server-side redirects and route protection
- **Features**:
  - Redirects authenticated users from public routes to their dashboard
  - Redirects users from generic `/dashboard` to their specific dashboard
  - Protects all dashboard routes with authentication

### 4. Layout Integration

- **Location**: `app/layout.tsx`
- **Purpose**: Wraps the entire application with the redirect handler
- **Features**:
  - Integrates the `RedirectHandler` component
  - Maintains existing Clerk configuration
  - Ensures redirects work across all pages

## User Flow

1. **Sign In/Sign Up**: User completes authentication with Clerk
2. **Initial Redirect**: Clerk redirects to `/dashboard` (as configured)
3. **Middleware Check**: Middleware detects user is authenticated and redirects to `/dashboard/[userId]`
4. **Dashboard Rendering**: User sees their personalized dashboard with their name and data
5. **Access Control**: If user tries to access another user's dashboard, they're redirected to their own

## Security Features

- **User Validation**: Each dashboard page validates that the user can only access their own data
- **Automatic Redirects**: Unauthorized access attempts are automatically redirected
- **Route Protection**: All dashboard routes are protected by Clerk authentication
- **Client & Server Side**: Both client and server-side validation for maximum security

## Testing

To test the redirect functionality:

1. Start the development server: `npm run dev`
2. Navigate to the sign-in page
3. Complete authentication
4. Verify you're redirected to `/dashboard/[your-user-id]`
5. Try accessing `/dashboard` directly - should redirect to your specific dashboard
6. Try accessing another user's dashboard URL - should redirect to your own

## Configuration

The redirect URLs are configured in `app/layout.tsx`:

```tsx
<ClerkProvider
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
>
```

The middleware and redirect handler then take care of redirecting to the user-specific URL.
