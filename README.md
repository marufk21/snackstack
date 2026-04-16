# 🍔 SnackStack

AI-powered notes and blogging platform built with Next.js 15, featuring subscription management, rich text editing, and modern SaaS architecture.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)

## 🔗 Live Demo

- 🌐 **Landing Page:** https://snackstack-gold.vercel.app/
- 🛠️ **Admin Blog Management:** https://snackstack-gold.vercel.app/admin
- 👤 **User Dashboard Login:** https://snackstack-gold.vercel.app/sign-in
- 🗺️ **Sitemap:** https://snackstack-gold.vercel.app/sitemap.xml

## 📸 Screenshots

<table>
  <tr>
    <td colspan="2" align="center">
      <b>🏠 Landing Page</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 172220.png" width="100%" style="border-radius:8px"/>
    </td>
  </tr>
  <tr><td colspan="2"><br/></td></tr>
  <tr>
    <td align="center" width="50%">
      <b>📊 User Dashboard</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 173038.png" width="100%" style="border-radius:8px"/>
    </td>
    <td align="center" width="50%">
      <b>🤖 AI Note Assistant</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 173141.png" width="100%" style="border-radius:8px"/>
    </td>
  </tr>
  <tr><td colspan="2"><br/></td></tr>
  <tr>
    <td align="center" width="50%">
      <b>💳 Pricing Plans</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 172418.png" width="100%" style="border-radius:8px"/>
    </td>
    <td align="center" width="50%">
      <b>📝 Blog Management</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 174033.png" width="100%" style="border-radius:8px"/>
    </td>
  </tr>
  <tr><td colspan="2"><br/></td></tr>
  <tr>
    <td colspan="2" align="center">
      <b>✍️ Create Blog Post</b><br/><br/>
      <img src="public/readme/Screenshot 2026-04-16 174056.png" width="80%" style="border-radius:8px"/>
    </td>
  </tr>
</table>

## ✨ Features

- 🧠 **AI-Powered Notes** - Intelligent content suggestions with Google Gemini API
- 📝 **Rich Text Editor** - CKEditor & TipTap with markdown support
- 📚 **Blog Management** - Full admin dashboard for blog posts
- 💳 **Stripe Payments** - Subscription management and billing
- 🔐 **Authentication** - Google OAuth via NextAuth.js v5
- 📊 **Analytics** - PostHog integration for user tracking
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 📁 **File Storage** - Appwrite for images and media
- 🌓 **Dark Mode** - System-aware theme switching
- 📱 **Responsive** - Mobile-first design

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.0 with App Router & React 19
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS v4.1, Radix UI
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5 with Google OAuth
- **Payments:** Stripe
- **Storage:** Appwrite
- **AI:** Google Gemini API
- **Analytics:** PostHog
- **State:** Zustand, TanStack Query
- **Editors:** CKEditor 5, TipTap

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/snackstack.git
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
3. **Appwrite**: Create account at [appwrite.io](https://appwrite.io/) and set up project
4. **Stripe**: Get API keys from [Stripe Dashboard](https://stripe.com/)
5. **Gemini API**: Get key from [Google AI Studio](https://ai.google.dev/)
6. **PostHog**: Sign up at [posthog.com](https://posthog.com/)

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
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

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
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── sign-in/             # Sign-in page
│   │   └── sign-up/             # Sign-up page
│   ├── (dashboard)/             # Protected dashboard routes
│   │   └── app/                 # Main app
│   │       ├── admin/           # Admin panel
│   │       ├── pricing/         # Pricing page
│   │       ├── subscription/    # Subscription management
│   │       ├── layout.tsx       # Dashboard layout
│   │       └── page.tsx         # Dashboard home
│   ├── (landing)/               # Public landing pages
│   │   ├── admin/               # Admin dashboard
│   │   │   └── blogs-dashboard/ # Blog management
│   │   ├── blogs/               # Public blog pages
│   │   ├── layout.tsx           # Landing layout
│   │   └── page.tsx             # Landing home
│   ├── api/                     # API Routes
│   │   ├── ai-suggestion/       # AI suggestions
│   │   ├── auth/                # NextAuth handlers
│   │   ├── cron/                # Scheduled jobs
│   │   ├── folders/             # Folder management
│   │   ├── notes/               # Notes CRUD
│   │   ├── stripe/              # Stripe webhooks
│   │   ├── subscription/        # Subscription API
│   │   └── upload/              # File uploads
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── not-found.tsx            # 404 page
│   ├── robots.ts                # Robots.txt
│   └── sitemap.ts               # Sitemap generation
│
├── components/                   # React Components
│   ├── auth/                    # Auth components
│   ├── dashboard/               # Dashboard components
│   ├── landing/                 # Landing components
│   ├── subscription/            # Subscription components
│   └── ui/                      # UI components (25+ files)
│
├── config/                       # Configuration
│   ├── auth.ts                  # NextAuth config
│   ├── database.ts              # Database config
│   ├── stripe.ts                # Stripe config
│   └── appwrite.ts              # Appwrite config
│
├── server/                       # Server-side code
│   ├── db/                      # Database
│   │   └── schema.prisma        # Prisma schema
│   └── lib/                     # Server libraries
│       └── generated/prisma/    # Generated Prisma client
│
├── providers/                    # React Providers
│   ├── query-provider.tsx       # TanStack Query
│   └── posthog-provider.tsx     # PostHog analytics
│
├── stores/                       # Zustand stores
│   └── use-app-store.ts         # Global state
│
├── lib/                          # Utilities
│   ├── utils.ts                 # Helper functions
│   ├── appwrite/                # Appwrite utilities
│   └── validations/             # Zod schemas
│
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── public/                       # Static assets
│
├── middleware.ts                 # Route protection
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
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