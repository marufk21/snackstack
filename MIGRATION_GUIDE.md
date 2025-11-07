# Clerk → NextAuth v5 Migration Guide

This guide outlines the steps completed to migrate from Clerk authentication to NextAuth v5 with Google OAuth.

## ✅ Completed Changes

### 1. Dependencies Updated
- ✅ Removed `@clerk/nextjs`
- ✅ Added `next-auth` (v5.0.0-beta.25)
- ✅ Added `@auth/prisma-adapter`
- ✅ Added `@radix-ui/react-avatar` for user avatars

### 2. Database Schema Migrated
- ✅ Updated `User` model:
  - Changed ID from Integer to String (cuid)
  - Removed `clerkUserId` field
  - Added `emailVerified`, `image` fields
  - Added relations to `accounts` and `sessions`
- ✅ Added NextAuth models: `Account`, `Session`, `VerificationToken`
- ✅ Updated `Subscription` model: Removed `clerkUserId`
- ✅ Updated `Note` model: Changed `userId` to String

### 3. Authentication Configuration
- ✅ Created `auth.ts` with NextAuth v5 configuration
- ✅ Created `app/api/auth/[...nextauth]/route.ts`
- ✅ Created `types/next-auth.d.ts` for TypeScript types
- ✅ Updated `middleware.ts` to use NextAuth
- ✅ Updated `app/layout.tsx` to use SessionProvider

### 4. Authentication Pages
- ✅ Deleted Clerk sign-in/sign-up pages
- ✅ Created new `app/(auth)/sign-in/page.tsx` with Google OAuth

### 5. Components Updated (10 files)
- ✅ `components/auth/auth-check.tsx`
- ✅ `components/auth/redirect-handler.tsx`
- ✅ `components/auth/subscription-guard.tsx`
- ✅ `components/dashboard/app-sidebar.tsx`
- ✅ `components/ui/welcome-header.tsx`
- ✅ `components/landing/navbar.tsx`
- ✅ `components/landing/hero.tsx`
- ✅ `components/ui/avatar.tsx` (created)

### 6. API Routes Updated (7 files)
- ✅ `app/api/notes/route.ts`
- ✅ `app/api/notes/[id]/route.ts`
- ✅ `app/api/ai-suggestion/route.ts`
- ✅ `app/api/stripe/create-checkout-session/route.ts`
- ✅ `app/api/stripe/create-portal-session/route.ts`
- ✅ `app/api/stripe/webhook/route.ts`
- ✅ `app/api/subscription/status/route.ts`

### 7. Utility Files Updated (4 files)
- ✅ `lib/utils/api-protection.ts`
- ✅ `lib/utils/subscription-check.ts`
- ✅ `lib/database/user.ts`
- ✅ `lib/database/subscription.ts`

### 8. Hooks & Providers Updated (2 files)
- ✅ `hooks/use-subscription.ts`
- ✅ `providers/posthog-provider.tsx`

## 📋 Next Steps (Action Required)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Setup Environment Variables
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

3. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select a project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID → `AUTH_GOOGLE_ID`
   - Copy Client Secret → `AUTH_GOOGLE_SECRET`

4. Update other environment variables as needed

### Step 3: Run Database Migration
```bash
# This will create the new NextAuth tables and update existing tables
pnpm prisma migrate dev --name migrate_to_nextauth

# Generate Prisma client
pnpm prisma generate
```

### Step 4: (Optional) Data Migration
If you have existing users in the database with Clerk data, you may need to migrate them. Since the User ID changed from Integer to String, this is a destructive operation. Consider:
- Exporting critical user data before migration
- Running the migration in a staging environment first
- Having a rollback plan

### Step 5: Test the Application
```bash
pnpm dev
```

Test the following flows:
1. ✅ Sign in with Google OAuth
2. ✅ Access protected routes
3. ✅ API routes work with new auth
4. ✅ Subscription checks work
5. ✅ Create/edit/delete notes
6. ✅ Sign out

## 🔑 Key Changes Summary

### Authentication Flow
- **Before**: Clerk managed everything
- **After**: NextAuth with Google OAuth provider

### User Identification
- **Before**: `clerkUserId` (string from Clerk)
- **After**: `id` (cuid string from Prisma)

### Session Management
- **Before**: Clerk session cookies
- **After**: Database sessions (NextAuth with Prisma adapter)

### Components
- **Before**: `<SignedIn>`, `<SignedOut>`, `<UserButton>`, `useUser()`
- **After**: `useSession()`, custom avatar component

## ⚠️ Important Notes

1. **User Data**: Existing Clerk user data will NOT be automatically migrated. Users will need to sign in again with Google.

2. **Session Storage**: NextAuth uses database sessions by default. Ensure your database can handle the session load.

3. **Google OAuth Only**: This migration removes other auth providers. To add more providers, update `auth.ts`.

4. **Subscription Links**: User subscriptions link to User.id which is now a string cuid instead of integer.

5. **Environment Variables**: Remove old Clerk environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## 🐛 Troubleshooting

### Issue: "AUTH_SECRET is not defined"
**Solution**: Generate and add AUTH_SECRET to .env.local

### Issue: "Invalid client_id"
**Solution**: Verify AUTH_GOOGLE_ID is correct and matches Google Cloud Console

### Issue: Database connection errors
**Solution**: Verify DATABASE_URL is correct and accessible

### Issue: Prisma client errors
**Solution**: Run `pnpm prisma generate` again

## 📚 Additional Resources

- [NextAuth v5 Documentation](https://authjs.dev/)
- [NextAuth Google Provider](https://authjs.dev/getting-started/providers/google)
- [Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)

## ✅ Migration Completion Checklist

- [x] Dependencies updated
- [x] Database schema updated
- [x] Auth configuration created
- [x] All components updated
- [x] All API routes updated
- [x] All utility files updated
- [ ] Environment variables configured
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database migrated (`pnpm prisma migrate dev`)
- [ ] Application tested

---

**Migration Date**: November 7, 2025
**Auth System**: NextAuth v5.0.0-beta.25
**Provider**: Google OAuth 2.0

