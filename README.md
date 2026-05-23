# 🍔 SnackStack

AI-powered notes and blogging platform built with Next.js 15, featuring subscription management, rich text editing, and modern SaaS architecture.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)

## 🔗 Live Demo

- 🌐 **Landing Page:** https://snackstack-gold.vercel.app/
- 🛠️ **Admin Blog Management:** https://snackstack-gold.vercel.app/admin
- 👤 **User Dashboard Login:** https://snackstack-gold.vercel.app/sign-in
- 🗺️ **Sitemap:** https://snackstack-gold.vercel.app/sitemap.xml

## 📸 Screenshots

<div style="display:flex; gap:16px;">
    <img src="public/readme/Screenshot 2026-04-16 172220.png" width="19.65%" style="border-radius:8px"/>
    <img src="public/readme/Screenshot 2026-04-16 173038.png" width="16%" style="border-radius:8px"/>
    <img src="public/readme/Screenshot 2026-04-16 173141.png" width="9.80%" style="border-radius:8px"/>
    <img src="public/readme/Screenshot 2026-04-16 172418.png" width="13.10%" style="border-radius:8px"/>
    <img src="public/readme/Screenshot 2026-04-16 174033.png" width="17.80%" style="border-radius:8px"/>
    <img src="public/readme/Screenshot 2026-04-16 174056.png" width="12.30%" style="border-radius:8px"/>
</div>

## ✨ Features

- 🧠 **AI-Powered Notes** - Intelligent content suggestions with Google Gemini API
- 📝 **Rich Text Editor** - TipTap with markdown support and syntax highlighting
- 📚 **Blog Management** - Full admin dashboard for blog posts
- 💳 **Stripe Payments** - Subscription management with trial periods and billing
- 🔐 **Authentication** - Google OAuth via NextAuth.js v5 with Prisma adapter
- 📊 **Analytics** - PostHog integration for user tracking
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 📁 **File Storage** - Cloudinary and Appwrite for images and media
- 🌓 **Dark Mode** - System-aware theme switching with next-themes
- 🎨 **3D & Animation** - Three.js scenes with GSAP, Lenis smooth scroll, and Framer Motion
- 📱 **Responsive** - Mobile-first design with Tailwind CSS
- 🧪 **Testing** - Jest + React Testing Library for unit/integration, Playwright for E2E

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5 with App Router & React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, Radix UI, Framer Motion
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5 with Google OAuth
- **Payments:** Stripe with subscription tiers and trials
- **Storage:** Cloudinary, Appwrite
- **AI:** Google Gemini API
- **Analytics:** PostHog
- **State:** Zustand, TanStack Query
- **Editor:** TipTap with markdown, code highlighting, images, and links
- **3D:** Three.js, React Three Fiber, postprocessing
- **Animation:** GSAP, Lenis smooth scroll
- **Testing:** Jest, React Testing Library, Playwright, MSW
- **Validation:** Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/marufk21/snackstack.git
cd snackstack
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/snackstack?schema=public"

# NextAuth.js (Generate AUTH_SECRET with: openssl rand -base64 32)
AUTH_SECRET="your_auth_secret_key"
AUTH_GOOGLE_ID="your_google_oauth_client_id"
AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"

# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_APPWRITE_DATABASE_ID="your_database_id"
NEXT_PUBLIC_APPWRITE_COLLECTION_ID="your_collection_id"
NEXT_PUBLIC_APPWRITE_BUCKET_ID="your_bucket_id"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
NEXT_PUBLIC_STRIPE_PRICE_ID="your_price_id"

# PostHog
NEXT_PUBLIC_POSTHOG_KEY="your_posthog_project_key"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Quick Setup Guide

1. **Database**: Use [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or local PostgreSQL
2. **Google OAuth**: Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
3. **Cloudinary**: Create account at [cloudinary.com](https://cloudinary.com/) for media storage
4. **Appwrite**: Create account at [appwrite.io](https://appwrite.io/) and set up project
5. **Stripe**: Get API keys from [Stripe Dashboard](https://stripe.com/)
6. **Gemini API**: Get key from [Google AI Studio](https://ai.google.dev/)
7. **PostHog**: Sign up at [posthog.com](https://posthog.com/)

### 3. Set up the database

```bash
pnpm prisma generate --schema=server/db/schema.prisma
pnpm prisma migrate dev --schema=server/db/schema.prisma
pnpm db:seed  # Optional: seed with sample data
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📖 Available Scripts

```bash
# Development
pnpm dev          # Start development server (Turbopack)
pnpm build        # Build for production (Turbopack)
pnpm start        # Start production server

# Testing
pnpm test         # Run Jest unit & integration tests
pnpm test:e2e     # Run Playwright E2E tests

# Database
pnpm prisma generate --schema=server/db/schema.prisma
pnpm prisma migrate dev --schema=server/db/schema.prisma
pnpm prisma studio --schema=server/db/schema.prisma
pnpm db:seed      # Seed database
pnpm db:reset     # Reset and reseed
```

## 📁 Project Structure

```
snackstack/
├── app/                          # Next.js App Router (routes only)
│   ├── (auth)/sign-in/          # Sign-in page
│   ├── (dashboard)/app/         # Protected dashboard (/app/*)
│   │   ├── admin/               # Debug/sync admin pages
│   │   ├── pricing/             # Pricing page
│   │   └── subscription/        # Subscription management
│   ├── (landing)/               # Public pages
│   │   ├── admin/blogs-dashboard/# Blog admin (new, edit, view)
│   │   └── blogs/               # Public blog listing & details
│   ├── api/                     # API route handlers
│   │   ├── ai-suggestion/       # Gemini AI suggestions
│   │   ├── auth/                # NextAuth handlers
│   │   ├── cron/                # Scheduled subscription checks
│   │   ├── notes/               # Notes CRUD
│   │   ├── stripe/              # Stripe checkout, portal, webhooks
│   │   ├── subscription/        # Subscription lifecycle
│   │   └── upload/              # Cloudinary file uploads
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout + metadata
│   └── not-found.tsx            # 404 page
│
├── components/
│   ├── ui/                      # Reusable primitives (shadcn/ui + custom)
│   ├── shared/                  # App-level components (auth, error-boundary)
│   ├── landing/                 # Landing page sections
│   └── dashboard/               # Dashboard feature components
│
├── server/                       # Backend code
│   ├── api/                     # Client-side Axios API wrappers
│   ├── auth/                    # NextAuth v5 configuration
│   ├── db/                      # Prisma schema, client, seed, config
│   ├── integrations/            # Third-party services
│   │   ├── appwrite/            # Appwrite blog CMS
│   │   ├── cloudinary/          # Cloudinary image upload
│   │   └── stripe/              # Stripe payments
│   ├── services/                # Business logic (user, subscription, notes)
│   └── utils/                   # Server utilities (rate-limit, api-protection, plan-limits)
│
├── lib/                          # Client-side utilities & configs
│   ├── cn.ts                    # Tailwind class merge utility
│   ├── query-client.ts          # TanStack Query config
│   ├── stripe-client.ts         # Client-safe Stripe config
│   ├── pricing.ts               # Pricing tier definitions
│   └── app-config.ts            # App configuration & env validation
│
├── hooks/                        # Shared React hooks
├── providers/                    # React context providers (Query, PostHog, Theme, Lenis, Framer)
├── stores/                       # Zustand store (theme, user, sidebar)
├── types/                        # TypeScript type declarations
├── __tests__/                    # Jest + Playwright test suites
├── public/                       # Static assets (images, icons, manifest)
│
├── middleware.ts                 # Auth route protection
├── next.config.ts                # Next.js + Turbopack config
└── package.json
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

Also works on [Netlify](https://www.netlify.com/), [Railway](https://railway.app/), [Render](https://render.com/), and other Next.js-compatible platforms.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 15 and modern web technologies**
