# Next.js 15.5.0 Performance Optimization Guide

A comprehensive, step-by-step guide for analyzing and optimizing your SaaS application's performance.

---

## 📊 Phase 1: Performance Analysis & Measurement

### Tools You'll Need

#### 1. **Lighthouse (Chrome DevTools)**

- **Purpose**: Overall performance scoring, Core Web Vitals
- **How to use**:
  - Open Chrome DevTools (F12)
  - Navigate to "Lighthouse" tab
  - Select "Performance" category
  - Run audit for both mobile and desktop

#### 2. **Next.js Built-in Analytics**

- **Purpose**: Real User Monitoring (RUM)
- **How to use**:
  ```bash
  # Already visible in your build output
  npm run build
  ```
  - Check route sizes and First Load JS
  - Identify routes exceeding 244 kB (red flag)

#### 3. **Chrome DevTools Performance Tab**

- **Purpose**: Runtime performance, JavaScript execution time
- **How to use**:
  - Open DevTools → Performance tab
  - Record while interacting with your app
  - Analyze flame charts for bottlenecks

#### 4. **WebPageTest**

- **Purpose**: Real-world performance testing
- **URL**: https://www.webpagetest.org
- **How to use**: Test from multiple locations and devices

#### 5. **Bundle Analyzer**

- **Purpose**: Visualize bundle composition
- **Setup**:

  ```bash
  npm install --save-dev @next/bundle-analyzer
  ```

  Create `next.config.mjs` wrapper:

  ```javascript
  import withBundleAnalyzer from "@next/bundle-analyzer";

  const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });

  export default bundleAnalyzer({
    // your existing next.config
  });
  ```

  Run analysis:

  ```bash
  ANALYZE=true npm run build
  ```

---

## 🔍 Phase 2: Initial Analysis (Based on Your Build Output)

### Current Issues Identified

> [!WARNING] > **Critical Issues Found in Your Build**

#### 1. **Large First Load JS (364 kB)**

Your app route has 364 kB First Load JS, which is **49% larger** than the recommended 244 kB threshold.

**Impact**: Slower initial page load, poor mobile performance

#### 2. **Heavy Middleware (91.1 kB)**

Your middleware bundle is quite large, which affects every request.

**Impact**: Increased server response time

#### 3. **Multiple Large Routes**

Several routes exceed optimal sizes:

- `/app` - 364 kB
- `/sign-in` - 363 kB
- `/app/pricing` - 308 kB
- `/blogs` - 331 kB
- `/app/subscription` - 308 kB

#### 4. **Large Shared Chunks**

- First Load JS shared by all: 285 kB
- Multiple chunks over 50 kB

---

## 🛠️ Phase 3: Optimization Strategies

### Strategy 1: Code Splitting & Dynamic Imports

#### What to Optimize

Heavy components that aren't immediately needed on page load.

#### Implementation

**Before:**

```typescript
import HeavyComponent from "@/components/HeavyComponent";
import Chart from "@/components/Chart";
import RichTextEditor from "@/components/RichTextEditor";

export default function Page() {
  return (
    <div>
      <HeavyComponent />
      <Chart data={data} />
      <RichTextEditor />
    </div>
  );
}
```

**After:**

```typescript
import dynamic from "next/dynamic";

// Dynamic import with loading state
const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Only if component doesn't need SSR
});

const Chart = dynamic(() => import("@/components/Chart"), {
  loading: () => <div className="skeleton-chart" />,
});

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false, // Rich text editors often don't need SSR
});

export default function Page() {
  return (
    <div>
      <HeavyComponent />
      <Chart data={data} />
      <RichTextEditor />
    </div>
  );
}
```

#### Common Candidates for Dynamic Import

- 📊 Chart libraries (recharts, chart.js)
- 📝 Rich text editors (TipTap, Slate, Quill)
- 🗺️ Maps (Google Maps, Mapbox)
- 📅 Date pickers
- 🎨 Color pickers
- 📹 Video players
- 💬 Chat widgets
- 🔔 Notification systems

---

### Strategy 2: Optimize Third-Party Scripts

#### What to Optimize

Analytics, tracking, and external scripts.

#### Implementation

**Use Next.js Script Component:**

```typescript
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* Load analytics after page is interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />

        {/* Load non-critical scripts lazily */}
        <Script
          src="https://widget.intercom.io/widget/APP_ID"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

**Strategy Options:**

- `beforeInteractive`: Critical scripts (rare)
- `afterInteractive`: Analytics, tracking (most common)
- `lazyOnload`: Chat widgets, social media embeds
- `worker`: Offload to Web Worker (experimental)

---

### Strategy 3: Image Optimization

#### What to Optimize

All images in your application.

#### Implementation

**Always use Next.js Image component:**

```typescript
import Image from 'next/image';

// ❌ Bad
<img src="/hero.jpg" alt="Hero" />

// ✅ Good
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Or import image for auto blur
/>

// ✅ Better - For below-fold images
<Image
  src="/feature.jpg"
  alt="Feature"
  width={800}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

**Configure next.config.js:**

```javascript
export default {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};
```

---

### Strategy 4: Font Optimization

#### What to Optimize

Custom fonts loading.

#### Implementation

**Use next/font:**

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Benefits:**

- Automatic font optimization
- Zero layout shift
- No flash of unstyled text (FOUT)
- Self-hosted fonts (privacy + performance)

---

### Strategy 5: Reduce JavaScript Bundle Size

#### What to Optimize

Large dependencies and unused code.

#### Implementation Steps

**1. Analyze your bundle:**

```bash
ANALYZE=true npm run build
```

**2. Replace heavy libraries:**

| Heavy Library        | Lightweight Alternative           | Size Reduction |
| -------------------- | --------------------------------- | -------------- |
| Moment.js (232 kB)   | date-fns (13 kB) or Day.js (7 kB) | ~90%           |
| Lodash (full, 71 kB) | lodash-es (tree-shakeable)        | ~80%           |
| Axios (13 kB)        | Native fetch                      | 100%           |
| Material-UI          | Tailwind CSS + Headless UI        | ~70%           |

**3. Use tree-shakeable imports:**

```typescript
// ❌ Bad - imports entire library
import _ from "lodash";
import * as dateFns from "date-fns";

// ✅ Good - only imports what you need
import debounce from "lodash/debounce";
import { format, parseISO } from "date-fns";
```

**4. Enable tree-shaking in next.config.js:**

```javascript
export default {
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};
```

---

### Strategy 6: Optimize Middleware

#### What to Optimize

Your 91.1 kB middleware bundle.

#### Implementation

**Current Issue:**
Large middleware affects every request.

**Solutions:**

**1. Reduce middleware scope:**

```typescript
// middleware.ts
export const config = {
  matcher: [
    // Only run on specific routes
    "/app/:path*",
    "/admin/:path*",
    "/api/:path*",
    // Exclude static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

**2. Lazy load heavy logic:**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only import heavy auth logic when needed
  if (request.nextUrl.pathname.startsWith("/app")) {
    const { checkAuth } = await import("@/lib/auth-middleware");
    return checkAuth(request);
  }

  return NextResponse.next();
}
```

**3. Move logic to API routes when possible:**
Instead of doing heavy processing in middleware, delegate to API routes.

---

### Strategy 7: Database Query Optimization

#### What to Optimize

Slow database queries, N+1 problems.

#### Implementation

**1. Use React Server Components for data fetching:**

```typescript
// app/dashboard/page.tsx
async function getData() {
  // Fetch on server, no client-side JavaScript needed
  const data = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return data;
}

export default async function Dashboard() {
  const data = await getData();

  return <DashboardUI data={data} />;
}
```

**2. Implement proper caching:**

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;

// Or use fetch with cache
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 }, // Cache for 1 hour
});
```

**3. Use Partial Prerendering (PPR):**

```typescript
// next.config.js
export default {
  experimental: {
    ppr: true,
  },
};

// app/dashboard/page.tsx
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div>
      {/* Static shell renders immediately */}
      <Header />

      {/* Dynamic content streams in */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}
```

---

### Strategy 8: Implement Streaming & Suspense

#### What to Optimize

Time to First Byte (TTFB) and perceived performance.

#### Implementation

```typescript
// app/blog/[slug]/page.tsx
import { Suspense } from "react";

async function BlogPost({ slug }) {
  const post = await fetchPost(slug);
  return <Article post={post} />;
}

async function Comments({ slug }) {
  // Slow query - don't block page render
  const comments = await fetchComments(slug);
  return <CommentList comments={comments} />;
}

export default function BlogPage({ params }) {
  return (
    <div>
      {/* Post content loads first */}
      <Suspense fallback={<ArticleSkeleton />}>
        <BlogPost slug={params.slug} />
      </Suspense>

      {/* Comments stream in later */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments slug={params.slug} />
      </Suspense>
    </div>
  );
}
```

---

### Strategy 9: Optimize CSS

#### What to Optimize

Unused CSS, large stylesheets.

#### Implementation

**1. Use CSS Modules or Tailwind CSS:**
Both are automatically optimized by Next.js.

**2. Remove unused Tailwind classes:**

```javascript
// tailwind.config.js
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // This ensures only used classes are included
};
```

**3. Lazy load CSS for dynamic components:**

```typescript
const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  ssr: false,
});
// CSS is automatically code-split with the component
```

---

### Strategy 10: API Route Optimization

#### What to Optimize

Slow API responses, inefficient data processing.

#### Implementation

**1. Use Edge Runtime for fast APIs:**

```typescript
// app/api/user/route.ts
export const runtime = "edge";

export async function GET(request: Request) {
  // Runs on edge, closer to users
  const data = await fetchUserData();
  return Response.json(data);
}
```

**2. Implement proper caching:**

```typescript
export async function GET(request: Request) {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
```

**3. Use streaming for large responses:**

```typescript
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const data = await fetchLargeDataset();

      for (const item of data) {
        controller.enqueue(encoder.encode(JSON.stringify(item) + "\n"));
      }

      controller.close();
    },
  });

  return new Response(stream);
}
```

---

## 📋 Phase 4: Implementation Checklist

### Week 1: Analysis & Quick Wins

- [ ] Run Lighthouse audit on all major pages
- [ ] Analyze bundle with `@next/bundle-analyzer`
- [ ] Identify largest dependencies
- [ ] Convert all `<img>` to `<Image>`
- [ ] Implement `next/font` for custom fonts
- [ ] Add proper `loading` and `priority` to images
- [ ] Optimize third-party scripts with `next/script`

### Week 2: Code Splitting

- [ ] Identify heavy components (charts, editors, etc.)
- [ ] Implement dynamic imports for heavy components
- [ ] Add loading states for dynamic components
- [ ] Test that functionality still works
- [ ] Measure bundle size reduction

### Week 3: Middleware & API Optimization

- [ ] Reduce middleware scope with matcher config
- [ ] Lazy load heavy middleware logic
- [ ] Convert appropriate API routes to Edge Runtime
- [ ] Implement API response caching
- [ ] Add database query optimization

### Week 4: Advanced Optimizations

- [ ] Implement Streaming & Suspense
- [ ] Enable Partial Prerendering (if stable)
- [ ] Optimize database queries
- [ ] Add proper cache headers
- [ ] Implement ISR where appropriate

### Week 5: Monitoring & Fine-tuning

- [ ] Set up real user monitoring
- [ ] Configure Core Web Vitals tracking
- [ ] A/B test optimizations
- [ ] Document performance budget
- [ ] Create performance monitoring dashboard

---

## 🎯 Phase 5: Specific Fixes for Your App

### Fix 1: Reduce `/app` Route Size (364 kB → <244 kB)

**Likely culprits:**

- Dashboard components
- Chart libraries
- Rich text editors
- UI component libraries

**Action plan:**

```typescript
// app/app/page.tsx or app/app/layout.tsx

// 1. Dynamic import heavy components
const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), {
  loading: () => <ChartsSkeleton />,
});

const NotesEditor = dynamic(() => import("@/components/NotesEditor"), {
  ssr: false,
});

// 2. Lazy load admin-only components
const AdminPanel = dynamic(() => import("@/components/AdminPanel"), {
  ssr: false,
});

// 3. Use Suspense for data-heavy sections
export default function AppLayout({ children }) {
  return (
    <div>
      <Sidebar /> {/* Keep static */}
      <Suspense fallback={<MainSkeleton />}>{children}</Suspense>
    </div>
  );
}
```

### Fix 2: Optimize Middleware (91.1 kB)

**Check your middleware.ts:**

```typescript
// middleware.ts

// ❌ Avoid importing heavy libraries
import { someHeavyLibrary } from "heavy-package"; // Bad!

// ✅ Use lightweight alternatives or lazy load
export async function middleware(request: NextRequest) {
  // Only load when needed
  if (needsAuth) {
    const { verifyAuth } = await import("@/lib/lightweight-auth");
    return verifyAuth(request);
  }
}

// ✅ Limit scope
export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
```

### Fix 3: Optimize Shared Chunks (285 kB)

**This is your core bundle shared by all pages.**

**Strategies:**

1. **Remove unused dependencies:**

   ```bash
   npm uninstall unused-package-1 unused-package-2
   ```

2. **Use lighter alternatives:**

   - Replace Moment.js with date-fns
   - Replace Lodash with native methods
   - Replace heavy UI libraries with Tailwind + Headless UI

3. **Enable package optimization:**
   ```javascript
   // next.config.js
   export default {
     experimental: {
       optimizePackageImports: [
         "@mui/material",
         "@mui/icons-material",
         "lucide-react",
         "date-fns",
       ],
     },
   };
   ```

---

## 📊 Phase 6: Measuring Success

### Key Metrics to Track

#### Core Web Vitals

| Metric                              | Good    | Needs Improvement | Poor    |
| ----------------------------------- | ------- | ----------------- | ------- |
| **LCP** (Largest Contentful Paint)  | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| **FID** (First Input Delay)         | ≤ 100ms | 100ms - 300ms     | > 300ms |
| **CLS** (Cumulative Layout Shift)   | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms     | > 500ms |

#### Next.js Specific Metrics

- **First Load JS**: Target < 244 kB (you're at 364 kB)
- **Route Size**: Each route < 100 kB ideally
- **Middleware Size**: < 50 kB ideally (you're at 91.1 kB)

### Monitoring Tools

**1. Vercel Analytics (if using Vercel):**

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**2. Google Analytics 4 with Web Vitals:**

```typescript
// app/layout.tsx
import { sendGTMEvent } from "@next/third-parties/google";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    sendGTMEvent({
      event: "web-vitals",
      event_category: "Web Vitals",
      event_action: metric.name,
      event_value: Math.round(metric.value),
      event_label: metric.id,
    });
  });
}
```

---

## 🚀 Phase 7: Advanced Techniques

### Technique 1: Route Segment Config

Optimize individual routes:

```typescript
// app/blog/page.tsx

// Static generation
export const dynamic = "force-static";

// Revalidate every hour
export const revalidate = 3600;

// Use edge runtime
export const runtime = "edge";

// Optimize fetch cache
export const fetchCache = "default-cache";
```

### Technique 2: Parallel Data Fetching

```typescript
// ❌ Sequential (slow)
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  return { user, posts, comments };
}

// ✅ Parallel (fast)
async function getData() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  return { user, posts, comments };
}
```

### Technique 3: Preload Critical Resources

```typescript
// app/layout.tsx
import { preload } from "react-dom";

export default function RootLayout({ children }) {
  // Preload critical resources
  preload("/fonts/inter.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/api/user", { as: "fetch" });

  return <html>{children}</html>;
}
```

### Technique 4: Service Worker for Offline Support

```typescript
// public/sw.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/app",
        "/styles/main.css",
        "/scripts/main.js",
      ]);
    })
  );
});
```

---

## 📚 Resources & Tools

### Essential Reading

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Monitoring

- [Vercel Analytics](https://vercel.com/analytics)
- [Google Analytics 4](https://analytics.google.com/)
- [Sentry Performance](https://sentry.io/for/performance/)

---

## ✅ Success Criteria

After implementing these optimizations, you should achieve:

- ✅ **First Load JS**: < 244 kB (currently 364 kB)
- ✅ **Lighthouse Score**: > 90 (Performance)
- ✅ **LCP**: < 2.5s
- ✅ **FID/INP**: < 100ms
- ✅ **CLS**: < 0.1
- ✅ **Middleware**: < 50 kB (currently 91.1 kB)
- ✅ **All routes**: Green in build output

---

## 🎓 Learning Path for Beginners

### Month 1: Foundations

- Week 1: Understand Core Web Vitals
- Week 2: Learn Chrome DevTools Performance tab
- Week 3: Master Lighthouse audits
- Week 4: Study Next.js optimization docs

### Month 2: Implementation

- Week 1: Image & font optimization
- Week 2: Code splitting & dynamic imports
- Week 3: Bundle analysis & reduction
- Week 4: Caching strategies

### Month 3: Advanced

- Week 1: Streaming & Suspense
- Week 2: Edge runtime & middleware
- Week 3: Database optimization
- Week 4: Monitoring & analytics

---

> [!TIP] > **Start Small**: Don't try to implement everything at once. Start with quick wins (images, fonts, third-party scripts), measure the impact, then move to more complex optimizations.

> [!IMPORTANT] > **Always Measure**: Before and after each optimization, measure the impact. Use Lighthouse and build output to track progress.

> [!CAUTION] > **Test Thoroughly**: Performance optimizations can sometimes break functionality. Always test after implementing changes, especially with dynamic imports and code splitting.
