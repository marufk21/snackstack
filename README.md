# 🍔 SnackStack - AI-Powered Notes & Blogging Platform

A production-ready, full-stack SaaS application built with Next.js 15, featuring AI-powered note-taking, blog management system, subscription/payment processing, analytics, and 3D graphics capabilities. A complete platform combining modern web development practices with cutting-edge technologies.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-green?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)
![Appwrite](https://img.shields.io/badge/Appwrite-1.6-F02E65?style=flat-square&logo=appwrite)
![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?style=flat-square&logo=stripe)

## 🚀 Overview

SnackStack is a comprehensive, production-ready SaaS platform that combines AI-powered note-taking with a full-featured blog management system. Built with modern web technologies, it includes authentication, subscription management, payment processing, analytics tracking, and even 3D graphics capabilities. Perfect for building scalable SaaS applications or as a learning resource for modern full-stack development.

### ✨ Key Features

#### Core Functionality
- **🧠 AI-Powered Note-Taking**: Intelligent content suggestions, enhancement, and organization powered by Google Gemini API
- **📝 Rich Text Editing**: Advanced note editor with CKEditor and TipTap integration, supporting markdown, formatting, images, and links
- **📚 Blog Management System**: Full-featured admin dashboard for creating, editing, viewing, and managing blog posts
- **💳 Subscription & Payments**: Complete Stripe integration with checkout, billing portal, subscription management, and webhook handling
- **🔐 Authentication**: Secure Google OAuth authentication via NextAuth.js v5 with session management
- **📊 Analytics & Tracking**: PostHog integration for user behavior analytics, event tracking, and insights

#### Technical Features
- **🗄️ Database**: PostgreSQL with Prisma ORM, including User, Note, Subscription, Account, and Session models
- **📁 File Management**: Appwrite integration for image and file storage with CDN delivery
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS v4.1 and Radix UI components
- **🌓 Dark/Light Mode**: System-aware theme switching with next-themes and smooth transitions
- **📊 State Management**: Global and local state management with Zustand stores (app state, note editor state)
- **🔄 Data Fetching**: Efficient server state caching with TanStack Query (React Query)
- **🔔 Notification System**: Toast notifications with success, error, warning, and info states
- **🎭 3D Graphics**: Three.js with React Three Fiber for 3D visualizations and effects
- **🛡️ Type Safety**: Full TypeScript strict mode throughout the entire codebase
- **⚡ Performance**: Optimized with Next.js 15 Turbopack and image optimization
- **🎨 Animations**: Smooth UI animations with Framer Motion
- **📱 Responsive Design**: Mobile-first approach that works seamlessly on all devices
- **🔒 Protected Routes**: Middleware-based route protection and authentication checks
- **⏰ Cron Jobs**: Automated subscription status checks and periodic tasks
- **🚀 Edge-Compatible**: Designed to work with edge runtime for optimal performance

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15.5.0](https://nextjs.org/) with App Router and React 19.1.0
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/) with PostCSS and custom animations
- **UI Components**: Custom components with [Radix UI](https://www.radix-ui.com/) primitives (Dialog, Alert, Avatar, Tabs, Tooltip, etc.)
- **Rich Text Editors**: 
  - [CKEditor 5](https://ckeditor.com/) (Classic Build 44.3.0)
  - [TipTap](https://tiptap.dev/) 3.10.5 with extensions (Image, Link, Starter Kit)
- **3D Graphics**: [Three.js](https://threejs.org/) 0.180.0 with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) 9.4.0
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.23.12 and GSAP 3.13.0
- **Icons**: 
  - [Lucide React](https://lucide.dev/) 0.541.0
  - [Tabler Icons](https://tabler-icons.io/) 3.35.0
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) 0.4.6 with system detection
- **Markdown**: React Markdown with syntax highlighting (rehype-highlight, remark-gfm)

### Backend & Database

- **ORM**: [Prisma](https://www.prisma.io/) 6.15.0 with custom output path
- **Database**: PostgreSQL with optimized indexes and relations
- **API**: Next.js 15 API Routes (REST)
- **File Storage**: [Appwrite](https://appwrite.io/) 21.3.0 for images and file management
- **AI**: [Google Gemini API](https://ai.google.dev/) 0.24.1 for intelligent content suggestions
- **Payment Processing**: [Stripe](https://stripe.com/) 18.5.0 (server) and @stripe/stripe-js 7.9.0 (client)
- **Analytics**: [PostHog](https://posthog.com/) (JS SDK 1.268.4, Node SDK 5.9.1)

### Authentication & Security

- **Auth Provider**: [NextAuth.js v5](https://next-auth.js.org/) (beta.25) with Google OAuth
- **Adapter**: @auth/prisma-adapter 2.7.4 for database integration
- **Session Strategy**: JWT-based sessions with edge compatibility
- **Middleware**: Custom NextAuth middleware for protected routes
- **Validation**: [Zod](https://zod.dev/) 4.1.0 for schema validation

### State Management & Data Fetching

- **Global State**: [Zustand](https://zustand-demo.pmnd.rs/) 5.0.8 with localStorage persistence
- **Server State**: [TanStack Query](https://tanstack.com/query) 5.85.5 with devtools
- **API Client**: [Axios](https://axios-http.com/) 1.11.0 for HTTP requests
- **Forms**: [TanStack Form](https://tanstack.com/form) 1.19.2 for complex form handling

### Development Tools & Utilities

- **Package Manager**: pnpm (recommended), npm, or yarn
- **Build Tool**: Next.js 15 with Turbopack for ultra-fast builds
- **Type Checking**: TypeScript strict mode with incremental builds
- **Database Tools**: Prisma Studio, migrations, and seeding scripts
- **Utilities**: 
  - [clsx](https://github.com/lukeed/clsx) 2.1.1 for conditional classes
  - [tailwind-merge](https://github.com/dcastil/tailwind-merge) 3.3.1 for class merging
  - [class-variance-authority](https://cva.style/) 0.7.1 for component variants
  - [server-only](https://www.npmjs.com/package/server-only) 0.0.1 for server-side code protection
- **Node Scripts**: Custom TypeScript scripts for database management (seed, reset, fixes)

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

### 3. Set up environment variables

Create a `.env` or `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/snackstack?schema=public"

# NextAuth.js Authentication (v5)
AUTH_SECRET="your_auth_secret_key"  # Generate with: openssl rand -base64 32
AUTH_GOOGLE_ID="your_google_oauth_client_id"
AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"
NEXTAUTH_URL="http://localhost:3000"  # Your app URL

# Appwrite (for file storage and blog management)
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_APPWRITE_DATABASE_ID="your_database_id"
NEXT_PUBLIC_APPWRITE_COLLECTION_ID="your_collection_id"
NEXT_PUBLIC_APPWRITE_BUCKET_ID="your_bucket_id"

# Google Gemini API (for AI-powered features)
GEMINI_API_KEY="your_gemini_api_key"

# Stripe Payment Processing
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
NEXT_PUBLIC_STRIPE_PRICE_ID="your_price_id"  # For subscription pricing

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY="your_posthog_project_key"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"  # or your self-hosted instance

# Application URLs (for production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client (uses custom schema path)
pnpm prisma generate --schema=server/db/schema.prisma

# Run database migrations
pnpm prisma migrate dev --schema=server/db/schema.prisma

# (Optional) Seed the database with sample data
pnpm db:seed

# (Optional) Reset database and reseed
pnpm db:reset
```

**Note**: Prisma client is generated to `server/lib/generated/prisma` directory.

### 5. Run the development server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Environment Setup

### Database Configuration

1. **Local PostgreSQL**:
   - Install PostgreSQL on your machine
   - Create a new database: `CREATE DATABASE snackstack;`
   - Update the `DATABASE_URL` in `.env` or `.env.local`

2. **Cloud PostgreSQL** (Recommended for production):
   - Use services like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Railway](https://railway.app/), or [Vercel Postgres](https://vercel.com/storage/postgres)
   - Copy the connection string to `DATABASE_URL`
   - Ensure the connection string includes `?schema=public`

### NextAuth.js Authentication Setup

1. **Generate AUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Add the generated value to `AUTH_SECRET` in your `.env` file

2. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy the Client ID and Client Secret to `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`

### Appwrite Setup (for File Storage & Blog Management)

1. Create an [Appwrite](https://appwrite.io/) account (Cloud or self-hosted)
2. Create a new project and note the Project ID
3. Create a new database and note the Database ID
4. Create a collection for blogs and note the Collection ID
5. Create a storage bucket for images and note the Bucket ID
6. Set appropriate permissions for your collections and buckets
7. Add all credentials to your `.env` file:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT` (e.g., `https://cloud.appwrite.io/v1`)
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
   - `NEXT_PUBLIC_APPWRITE_COLLECTION_ID`
   - `NEXT_PUBLIC_APPWRITE_BUCKET_ID`

### Stripe Setup (for Subscription & Payments)

1. Create a [Stripe](https://stripe.com/) account
2. Get your API keys from the Stripe Dashboard:
   - `STRIPE_SECRET_KEY` (starts with `sk_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_`)
3. Create a subscription product and pricing plan
4. Copy the Price ID to `NEXT_PUBLIC_STRIPE_PRICE_ID`
5. Set up webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `customer.subscription.*`, `invoice.*`, `checkout.session.completed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`
6. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### Google Gemini API Setup (for AI Features)

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new API key
4. Add the key to your `.env` file as `GEMINI_API_KEY`
5. The app uses Gemini for intelligent note suggestions and content enhancement

### PostHog Setup (for Analytics)

1. Create a [PostHog](https://posthog.com/) account (Cloud or self-hosted)
2. Create a new project
3. Copy your Project API Key to `NEXT_PUBLIC_POSTHOG_KEY`
4. If using PostHog Cloud, set `NEXT_PUBLIC_POSTHOG_HOST` to `https://us.i.posthog.com`
5. If self-hosting, use your instance URL
6. Analytics will automatically track page views, user events, and feature usage

## 📖 Usage Guide

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack (http://localhost:3000)
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server

# Database Management
pnpm prisma generate --schema=server/db/schema.prisma  # Generate Prisma client
pnpm prisma migrate dev --schema=server/db/schema.prisma  # Create & run migrations
pnpm prisma studio --schema=server/db/schema.prisma  # Open Prisma Studio GUI
pnpm prisma db push --schema=server/db/schema.prisma  # Push schema changes (skip migrations)

# Custom Database Scripts
pnpm db:seed              # Seed the database with sample data
pnpm db:reset             # Reset database and reseed
pnpm db:fix-email-verified  # Fix email verified column
pnpm db:fix-schema        # Fix complete database schema
pnpm db:quick-fix         # Quick schema fix
```

### Key Features Implementation

#### 🧠 AI-Powered Note-Taking

- **Intelligent Suggestions**: Context-aware content suggestions using Google Gemini API
- **Content Enhancement**: AI-powered text improvement and refinement
- **Smart Continuation**: Automatic note completion based on context
- **Rate Limiting**: Built-in protection against API abuse with rate limiting
- **API Endpoint**: `/api/ai-suggestion` for AI processing
- **Editor Integration**: Seamless integration with TipTap and CKEditor

#### 📝 Rich Note Editor

- **Dual Editor Support**: CKEditor 5 and TipTap for different use cases
- **Markdown Support**: Full markdown syntax support with live preview
- **Image Embedding**: Direct image uploads and embedding in notes
- **Link Management**: Easy link insertion and editing
- **Auto-save**: Automatic note saving with optimistic updates
- **Note States**: Create, edit, view, and delete notes with proper state management
- **Slug Generation**: Automatic URL-friendly slug generation for each note

#### 📚 Blog Management System

- **Admin Dashboard**: Full-featured admin panel at `/admin/blogs-dashboard`
- **Blog CRUD**: Create, read, update, and delete blog posts
- **Rich Content**: Support for images, formatting, and markdown
- **Public/Private**: Control blog post visibility
- **View Counter**: Track blog post views
- **Appwrite Storage**: Images and media stored in Appwrite buckets
- **SEO Friendly**: Automatic sitemap generation and SEO metadata

#### 💳 Subscription & Payments

- **Stripe Checkout**: Seamless subscription checkout flow
- **Billing Portal**: Customer portal for subscription management
- **Webhook Handling**: Real-time subscription status updates via webhooks
- **Usage Tracking**: Monitor notes created per billing period
- **Multiple Plans**: Support for different subscription tiers (basic, pro, enterprise)
- **Trial Support**: Built-in free trial functionality
- **Subscription Status**: Real-time subscription status checking
- **Pricing Page**: Dedicated pricing page at `/app/pricing`

#### 🔐 Authentication

- **Google OAuth**: Secure authentication with Google Sign-In
- **NextAuth.js v5**: Modern authentication with edge compatibility
- **JWT Sessions**: Efficient JWT-based session management
- **Protected Routes**: Middleware-based route protection in `middleware.ts`
- **Sign In/Up Pages**: Custom authentication pages at `/sign-in` and `/sign-up`
- **Session Callbacks**: Custom session and JWT callbacks for user data
- **Auto Redirect**: Authenticated users auto-redirect to app dashboard
- **Prisma Adapter**: Seamless database integration for user management

#### 📊 Analytics & Tracking

- **PostHog Integration**: Comprehensive user behavior tracking
- **Event Tracking**: Custom event tracking for key user actions
- **Page Views**: Automatic page view tracking
- **User Insights**: Understand user journey and engagement
- **Proxy Setup**: Privacy-friendly analytics with custom proxy configuration

#### 🗄️ Database Architecture

- **5 Core Models**: User, Note, Subscription, Account, Session
- **Optimized Indexes**: Performance-tuned database queries
- **Relations**: Proper foreign key relationships and cascading deletes
- **Custom Output**: Prisma client generated to `server/lib/generated/prisma`
- **Type Safety**: Full TypeScript types generated from schema
- **Migrations**: Version-controlled database schema changes
- **Seeding**: Sample data seeding with custom scripts

#### 📁 File & Image Management

- **Appwrite Storage**: Cloud file storage with CDN delivery
- **Image Upload API**: Dedicated endpoint at `/api/upload`
- **Bucket Management**: Organized storage with bucket separation
- **File Validation**: Type and size validation for uploads
- **CDN Delivery**: Fast image delivery via Appwrite CDN
- **Blog Images**: Integrated image storage for blog posts

#### 🎨 UI/UX Features

- **Theme System**: Light/dark mode with system preference detection
- **Smooth Animations**: Framer Motion for fluid UI transitions
- **3D Effects**: Three.js integration for 3D visualizations
- **Responsive Design**: Mobile-first design that adapts to all screens
- **Toast Notifications**: User feedback with success/error/warning states
- **Loading States**: Skeleton loaders and progress indicators
- **Error Boundaries**: Graceful error handling throughout the app
- **Notification Container**: Global notification management system

#### 📊 State Management

- **Global State**: Zustand store in `stores/use-app-store.ts`
- **Editor State**: Dedicated note editor store in `stores/use-note-editor-store.ts`
- **Server State**: TanStack Query for server data caching and sync
- **Local Persistence**: State persisted to localStorage where appropriate
- **Optimistic Updates**: Instant UI updates with background sync
- **React Query DevTools**: Development tools for debugging server state

## 📁 Project Structure

```
snackstack/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with all providers
│   ├── globals.css              # Global Tailwind CSS v4 styles
│   ├── back-button.tsx          # Reusable back button
│   ├── not-found.tsx            # Custom 404 page
│   ├── robots.ts                # Robots.txt configuration
│   ├── sitemap.ts               # Dynamic sitemap generation
│   ├── (auth)/                  # Authentication route group
│   │   ├── sign-in/             # Google OAuth sign-in page
│   │   └── sign-up/             # Google OAuth sign-up page
│   ├── (dashboard)/             # Protected dashboard routes
│   │   └── app/                 # Main app dashboard
│   │       ├── page.tsx         # Dashboard home
│   │       ├── layout.tsx       # Dashboard layout
│   │       ├── new/             # Create new note
│   │       ├── pricing/         # Subscription pricing page
│   │       └── subscription/    # Subscription management
│   ├── (landing)/               # Public landing pages
│   │   ├── page.tsx             # Landing home page
│   │   ├── layout.tsx           # Landing layout
│   │   ├── blogs/               # Public blog pages
│   │   └── admin/               # Admin panel
│   │       ├── page.tsx         # Admin dashboard
│   │       └── blogs-dashboard/ # Blog management
│   │           ├── page.tsx     # Blog list
│   │           ├── new-blog/    # Create blog post
│   │           ├── edit-blog/   # Edit blog post
│   │           └── view-blog/   # View blog post
│   ├── notes/                   # Note-related pages
│   └── api/                     # API Routes
│       ├── ai-suggestion/       # AI content suggestions
│       │   └── route.ts
│       ├── notes/               # Notes CRUD operations
│       │   ├── route.ts         # List & create notes
│       │   └── [id]/route.ts    # Get, update, delete note
│       ├── upload/              # File/image upload
│       │   └── route.ts
│       ├── stripe/              # Stripe payment webhooks
│       │   ├── create-checkout-session/
│       │   ├── create-portal-session/
│       │   └── webhook/
│       ├── subscription/        # Subscription status
│       │   └── status/route.ts
│       ├── cron/                # Scheduled jobs
│       │   └── check-subscriptions/
│       └── auth/                # NextAuth.js handlers
│           └── [...nextauth]/route.ts
│
├── components/                   # React Components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button with variants
│   │   ├── card.tsx             # Card layouts
│   │   ├── badge.tsx            # Status badges
│   │   ├── notification.tsx     # Toast notification system
│   │   ├── theme-provider.tsx   # Dark/light theme provider
│   │   └── theme-toggle-button.tsx # Theme switcher
│   ├── auth/                    # Auth-related components
│   │   ├── auth-check.tsx       # Auth state checker
│   │   ├── redirect-handler.tsx # Redirect logic
│   │   └── error-boundary.tsx   # Error boundary wrapper
│   ├── dashboard/               # Dashboard components
│   │   ├── note-card.tsx        # Note display card
│   │   ├── note-editor.tsx      # Rich text editor
│   │   ├── note-bottom-bar.tsx  # Editor toolbar
│   │   └── note-view-modal.tsx  # Note preview modal
│   └── landing/                 # Landing page components
│       ├── navbar.tsx           # Navigation bar
│       └── richtext-editor.tsx  # CKEditor/TipTap wrapper
│
├── server/                       # Server-side code
│   ├── db/                      # Database
│   │   └── schema.prisma        # Prisma schema (User, Note, Subscription, etc.)
│   ├── lib/                     # Server libraries
│   │   └── generated/           # Generated Prisma client
│   │       └── prisma/          # Custom output location
│   ├── api/                     # Server API utilities
│   └── axios/                   # Axios configuration
│
├── config/                       # Configuration files
│   ├── auth.ts                  # NextAuth.js configuration
│   ├── database.ts              # Database client setup
│   ├── appwrite.ts              # Appwrite client config
│   ├── stripe.ts                # Stripe server config
│   ├── stripe-client.ts         # Stripe client config
│   ├── cloudinary.ts            # Cloudinary config (if used)
│   ├── app.ts                   # App-wide configuration
│   └── index.ts                 # Config exports
│
├── providers/                    # React Context Providers
│   ├── query-provider.tsx       # TanStack Query provider
│   └── posthog-provider.tsx     # PostHog analytics provider
│
├── stores/                       # Zustand State Stores
│   ├── use-app-store.ts         # Global application state
│   └── use-note-editor-store.ts # Note editor state
│
├── lib/                          # Shared utilities
│   ├── utils.ts                 # Helper functions (cn, etc.)
│   ├── appwrite/                # Appwrite utilities
│   └── validations/             # Zod validation schemas
│
├── hooks/                        # Custom React hooks
│
├── types/                        # TypeScript type definitions
│
├── scripts/                      # Database & utility scripts
│   ├── add-email-verified-column.ts
│   ├── fix-database-schema-complete.ts
│   └── quick-fix-schema.ts
│
├── public/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   ├── icons/                   # Icon files
│   ├── images/                  # Image assets
│   └── Tasks.md                 # Project tasks
│
├── middleware.ts                 # NextAuth & route protection
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── components.json               # Shadcn/UI configuration
├── postcss.config.mjs            # PostCSS configuration
├── docker-compose.yml            # Docker setup
├── dockerfile                    # Docker image definition
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies & scripts
└── pnpm-lock.yaml                # pnpm lock file
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

SnackStack can be deployed to any platform that supports Next.js:

- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

### Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Enable Clerk production mode
- [ ] Configure CORS and security headers
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the incredible App Router and React 19 integration
- [Vercel](https://vercel.com/) for seamless hosting, deployment, and edge runtime
- [NextAuth.js](https://next-auth.js.org/) for modern, flexible authentication
- [Prisma](https://www.prisma.io/) for the excellent type-safe ORM
- [Appwrite](https://appwrite.io/) for backend-as-a-service and file storage
- [Stripe](https://stripe.com/) for robust payment processing infrastructure
- [Google AI](https://ai.google.dev/) for the powerful Gemini API
- [PostHog](https://posthog.com/) for product analytics and insights
- [TanStack](https://tanstack.com/) for Query and Form libraries
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Three.js](https://threejs.org/) and [PMND](https://pmnd.rs/) for 3D graphics libraries
- [Tailwind CSS](https://tailwindcss.com/) team for the amazing v4 release
- All open-source contributors who make projects like this possible

## 📚 Learning Resources

This project serves as an excellent reference for:
- **Full-Stack SaaS Architecture**: Complete SaaS implementation with auth, payments, and analytics
- **Next.js 15 App Router**: Modern React patterns with Server Components and Actions
- **Subscription Management**: Stripe integration with webhook handling and billing
- **AI Integration**: Implementing AI features with rate limiting and error handling
- **Multi-Provider Setup**: Combining multiple third-party services (Stripe, Appwrite, PostHog)
- **TypeScript Best Practices**: Strict typing, Zod validation, and type generation
- **State Management**: Combining server state (React Query) with client state (Zustand)
- **Database Design**: Prisma schema design with relations and optimized indexes

## 📞 Support & Contributing

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/snackstack/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/snackstack/discussions)
- 📖 **Documentation**: Check this README and inline code comments
- 🤝 **Contributing**: Pull requests are welcome! See contribution guidelines above

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

1. **Environment Variables**: Ensure all required environment variables are set before running
2. **Database Migrations**: Always run Prisma migrations before starting the app
3. **Stripe Webhooks**: For local development, use Stripe CLI for webhook testing
4. **Appwrite Setup**: Configure permissions properly for security
5. **Production Ready**: While feature-complete, review and adjust security settings for your use case
6. **API Rate Limiting**: AI endpoints have rate limiting - adjust as needed
7. **Cost Considerations**: Be aware of costs for Stripe, Appwrite, PostHog, and Google Gemini API

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies**

*Last Updated: November 2024*