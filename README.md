# 🍔 SnackStack - AI-Powered Notes SaaS

A modern, full-stack web application starter template built with Next.js 15, featuring AI-powered note-taking capabilities, authentication, database integration, state management, image uploads, and a beautiful UI with dark mode support.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=flat-square&logo=cloudinary)

## 🚀 Overview

SnackStack is a production-ready AI-powered note-taking SaaS application that combines the best modern web development tools and practices. It provides a solid foundation for building scalable web applications with built-in authentication, database connectivity, state management, and a responsive UI, enhanced with AI capabilities for intelligent note-taking.

### ✨ Key Features

- **🧠 AI-Powered Note-Taking**: Intelligent suggestions, content enhancement, and organization powered by Google Gemini
- **🔐 Authentication**: Secure user authentication with Clerk (sign up, sign in, user management)
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS and custom components
- **🌓 Dark Mode**: Built-in theme switching with next-themes and smooth transitions
- **📊 State Management**: Global state management with Zustand and persistence
- **🔄 Data Fetching**: Efficient data fetching and caching with TanStack Query (React Query)
- **🗄️ Database**: PostgreSQL integration with Prisma ORM
- **📸 Image Upload**: Cloudinary integration for image uploads and management
- **🔔 Notifications**: Toast notification system with multiple types
- **📱 Responsive**: Mobile-first design that works on all devices
- **⚡ Performance**: Optimized with Next.js 15 Turbopack
- **🎭 Animations**: Smooth animations with Framer Motion
- **🛡️ Type Safety**: Full TypeScript support throughout the codebase
- **🎯 Dashboard**: Complete dashboard with analytics, quick actions, and activity feed

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15.5.0](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.0
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/) with PostCSS
- **UI Components**: Custom components with [Radix UI](https://www.radix-ui.com/) primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.23.12
- **Icons**: [Lucide React](https://lucide.dev/) 0.541.0
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) 0.4.6

### Backend & Database

- **ORM**: [Prisma](https://www.prisma.io/) 6.15.0
- **Database**: PostgreSQL (configurable)
- **API**: Next.js API Routes
- **Image CDN**: [Cloudinary](https://cloudinary.com/) 2.7.0
- **AI**: [Google Gemini](https://ai.google.dev/) for AI-powered suggestions

### Authentication & Authorization

- **Auth Provider**: [Clerk](https://clerk.com/) 6.31.4 for complete user management
- **Middleware**: Protected routes with Clerk middleware

### State Management & Data Fetching

- **Global State**: [Zustand](https://zustand-demo.pmnd.rs/) 5.0.8 with persistence
- **Server State**: [TanStack Query](https://tanstack.com/query) 5.85.5
- **API Client**: [Axios](https://axios-http.com/) 1.11.0
- **Forms**: [TanStack Form](https://tanstack.com/form) 1.19.2

### Development Tools

- **Package Manager**: pnpm (recommended) / npm / yarn
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Hot Reload**: Next.js Fast Refresh with Turbopack
- **Utilities**: [clsx](https://github.com/lukeed/clsx) 2.1.1, [tailwind-merge](https://github.com/dcastil/tailwind-merge) 3.3.1

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

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/snackstack?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set up the database

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

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
   - Update the `DATABASE_URL` in `.env.local`

2. **Cloud PostgreSQL** (Recommended for production):
   - Use services like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/)
   - Copy the connection string to `DATABASE_URL`

### Clerk Authentication Setup

1. Create a [Clerk](https://clerk.com/) account
2. Create a new application
3. Copy your API keys from the Clerk dashboard
4. Add the keys to your `.env.local` file
5. Configure your application URLs in Clerk dashboard

### Cloudinary Setup (for Image Uploads)

1. Create a [Cloudinary](https://cloudinary.com/) account
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add the credentials to your `.env.local` file
4. The app will automatically use these for image uploads

### Google Gemini API Setup (for AI Features)

1. Create a [Google AI](https://ai.google.dev/) account
2. Get your API key from the Google AI Studio
3. Add the key to your `.env.local` file as `GEMINI_API_KEY`
4. The app will automatically use this for AI-powered suggestions

## 📖 Usage Guide

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm prisma generate    # Generate Prisma client
pnpm prisma migrate dev # Run migrations in development
pnpm prisma studio      # Open Prisma Studio GUI
pnpm prisma db push     # Push schema changes (skip migrations)

# Type Checking
pnpm type-check   # Run TypeScript compiler check
```

### Key Features Implementation

#### 🧠 AI-Powered Note-Taking

- Intelligent writing suggestions with AI enhancement
- Content summarization and expansion
- Note continuation and improvement
- Rate-limited API access to prevent abuse
- Integration with Google Gemini for natural language processing

#### 🔐 Authentication

- Sign up/Sign in pages at `/sign-up` and `/sign-in`
- Protected routes automatically redirect to sign-in
- User button component for account management
- Middleware configuration in `middleware.ts`

#### 🎨 Theme Switching

- Toggle between light and dark modes
- Theme preference persisted to localStorage
- Smooth transitions between themes
- Custom theme provider in `components/ui/theme-provider.tsx`

#### 📊 State Management

- Global app state with Zustand in `stores/use-app-store.ts`
- Note editor state management with `stores/use-note-editor-store.ts`
- Server state caching with React Query
- Optimistic updates for better UX

#### 🗄️ Database Operations

- Define models in `server/db/schema.prisma`
- Type-safe database queries with Prisma Client
- Generated types in `lib/generated/prisma`

#### 📸 Image Upload System

- Cloudinary integration for image storage and optimization
- Drag-and-drop image upload component
- Automatic image optimization and format conversion
- File validation (type, size limits)
- Upload progress indicators and error handling

#### 🔔 Notification System

- Toast notifications with multiple types (success, error, warning, info)
- Global notification state management with Zustand
- Auto-dismiss functionality with customizable timing
- Notification container component for consistent UI

#### 🎨 Theme System

- Light/dark mode switching with system preference detection
- Smooth theme transitions with CSS animations
- Persistent theme preference in localStorage
- Custom theme provider with next-themes integration

## 📁 Project Structure

```
snackstack/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/       # Clerk sign-in page
│   │   └── sign-up/       # Clerk sign-up page
│   ├── (dashboard)/       # Protected dashboard route
│   │   └── dashboard/     # Dashboard page
│   ├── (landing)/         # Landing page
│   │   └── page.tsx       # Landing page
│   └── api/               # API routes
│       ├── ai-suggestion/ # AI suggestion endpoint
│       └── upload/        # Image upload endpoint
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card component
│   │   ├── badge.tsx     # Badge component
│   │   ├── image-upload.tsx # Image upload component
│   │   ├── notification.tsx # Notification system
│   │   ├── theme-provider.tsx # Theme provider
│   │   └── theme-toggle-button.tsx # Theme toggle
│   ├── auth/             # Authentication components
│   │   └── auth-check.tsx # Authentication checker
│   ├── dashboard/        # Dashboard components
│   │   ├── note-card.tsx # Note card component
│   │   ├── note-editor.tsx # Note editor component
│   │   ├── note-bottom-bar.tsx # Note editor bottom bar
│   │   └── note-view-modal.tsx # Note view modal
│   └── landing/          # Landing page components
│       └── navbar.tsx    # Navigation component
├── lib/                  # Utility functions
│   ├── utils.ts         # Helper functions
│   ├── query-client.ts  # React Query setup
│   ├── generated/       # Generated Prisma types
│   └── utils/           # Additional utilities
│       └── cloudinary.ts # Cloudinary integration
├── server/               # Server-side code
│   ├── db/              # Database schema
│   │   └── schema.prisma # Prisma schema file
│   ├── providers/       # Context providers
│   │   └── query-provider.tsx
│   └── services/        # Server services
├── stores/              # Zustand stores
│   ├── use-app-store.ts # Global app state
│   └── use-note-editor-store.ts # Note editor state
├── public/              # Static assets
│   ├── fonts/           # Custom fonts
│   ├── icons/           # Icon files
│   └── images/          # Image assets
├── middleware.ts        # Next.js middleware
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
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

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Clerk](https://clerk.com/) for authentication
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Google AI](https://ai.google.dev/) for the Gemini API
- All the open-source contributors

## 📞 Support

- 📧 Email: support@snackstack.dev
- 💬 Discord: [Join our community](https://discord.gg/snackstack)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/snackstack/issues)

---

Built with ❤️ by the SnackStack Team