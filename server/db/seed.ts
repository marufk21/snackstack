import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

// Sample users data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
  },
];

// Sample notes data
const sampleNotes = [
  {
    title: "Getting Started with Next.js",
    content: `# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications easier. Here are some key features:

## Key Features
- **Server-side Rendering**: Improve SEO and performance
- **Static Site Generation**: Generate static pages at build time
- **API Routes**: Build your backend API alongside your frontend
- **File-based Routing**: Automatic routing based on file structure

## Installation
\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Best Practices
1. Use TypeScript for better development experience
2. Implement proper error handling
3. Optimize images with Next.js Image component
4. Use environment variables for configuration

Happy coding! 🚀`,
    slug: "getting-started-with-nextjs",
  },
  {
    title: "Database Design Principles",
    content: `# Database Design Principles

Good database design is crucial for building scalable applications. Here are some fundamental principles:

## Normalization
- **1NF**: Eliminate repeating groups
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies

## Key Principles
1. **Consistency**: Maintain data integrity
2. **Performance**: Design for query efficiency
3. **Scalability**: Plan for growth
4. **Security**: Protect sensitive data

## Best Practices
- Use appropriate data types
- Create proper indexes
- Implement foreign key constraints
- Regular backups and maintenance

## Tools & Technologies
- PostgreSQL for relational data
- Prisma for type-safe database access
- Redis for caching
- MongoDB for document storage

Remember: Good design today saves time tomorrow! ⏰`,
    slug: "database-design-principles",
  },
  {
    title: "React Hooks Deep Dive",
    content: `# React Hooks Deep Dive

React Hooks revolutionized how we write React components. Let's explore the most important ones:

## useState
\`\`\`typescript
const [count, setCount] = useState(0)
\`\`\`

## useEffect
\`\`\`typescript
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup logic
  }
}, [dependencies])
\`\`\`

## useContext
\`\`\`typescript
const value = useContext(MyContext)
\`\`\`

## Custom Hooks
Create reusable stateful logic:

\`\`\`typescript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  
  return { count, increment, decrement }
}
\`\`\`

## Rules of Hooks
1. Only call hooks at the top level
2. Only call hooks from React functions
3. Use ESLint plugin for validation

Hooks make React components more powerful and reusable! 🎣`,
    slug: "react-hooks-deep-dive",
  },
  {
    title: "API Security Best Practices",
    content: `# API Security Best Practices

Securing your APIs is crucial for protecting user data and maintaining trust.

## Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **OAuth 2.0**: Third-party authentication
- **Role-based Access Control**: Granular permissions

## Input Validation
\`\`\`typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
\`\`\`

## Rate Limiting
Prevent abuse and DDoS attacks:
- Implement rate limiting per IP
- Use Redis for distributed rate limiting
- Return appropriate HTTP status codes

## Security Headers
\`\`\`
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Strict-Transport-Security
\`\`\`

## Data Protection
1. Encrypt sensitive data
2. Use HTTPS everywhere
3. Sanitize user inputs
4. Implement proper logging

## Monitoring
- Log security events
- Monitor for suspicious activity
- Set up alerts for anomalies

Stay secure, stay trusted! 🔒`,
    slug: "api-security-best-practices",
  },
  {
    title: "TypeScript Tips and Tricks",
    content: `# TypeScript Tips and Tricks

TypeScript makes JavaScript development more robust and maintainable.

## Advanced Types

### Union Types
\`\`\`typescript
type Status = 'loading' | 'success' | 'error'
\`\`\`

### Intersection Types
\`\`\`typescript
type User = { name: string } & { email: string }
\`\`\`

### Mapped Types
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

## Utility Types
- \`Partial<T>\`: Make all properties optional
- \`Required<T>\`: Make all properties required
- \`Pick<T, K>\`: Pick specific properties
- \`Omit<T, K>\`: Omit specific properties

## Generic Constraints
\`\`\`typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
\`\`\`

## Type Guards
\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
\`\`\`

## Configuration Tips
- Enable strict mode
- Use path mapping
- Configure incremental compilation
- Set up proper linting

TypeScript = JavaScript with superpowers! ⚡`,
    slug: "typescript-tips-and-tricks",
  },
  {
    title: "Responsive Web Design",
    content: `# Responsive Web Design

Creating websites that work beautifully on all devices is essential in today's multi-device world.

## Mobile-First Approach
Start designing for mobile, then scale up:

\`\`\`css
/* Mobile styles first */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 2rem;
  }
}
\`\`\`

## Flexible Grid Systems
Use CSS Grid and Flexbox:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
\`\`\`

## Responsive Images
\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Description">
</picture>
\`\`\`

## Testing
- Use browser dev tools
- Test on real devices
- Use tools like BrowserStack
- Check performance on slow networks

Design for everyone, everywhere! 📱💻`,
    slug: "responsive-web-design",
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log("🧹 Cleaning existing data...");
    await prisma.note.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create notes for users
    console.log("📝 Creating notes...");
    let noteIndex = 0;

    for (const user of createdUsers) {
      // Create 1-2 notes per user
      const notesForUser = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < notesForUser && noteIndex < sampleNotes.length; i++) {
        const noteData = sampleNotes[noteIndex];

        const note = await prisma.note.create({
          data: {
            ...noteData,
            userId: user.id,
            imageUrl:
              Math.random() > 0.7
                ? `https://picsum.photos/800/400?random=${noteIndex}`
                : null,
          },
        });

        console.log(`✅ Created note: "${note.title}" for user ${user.name}`);
        noteIndex++;
      }
    }

    // Create some additional notes for the first user to show variety
    if (noteIndex < sampleNotes.length) {
      console.log("📚 Creating additional notes for demonstration...");
      const firstUser = createdUsers[0];

      while (noteIndex < sampleNotes.length) {
        const noteData = sampleNotes[noteIndex];

        const note = await prisma.note.create({
          data: {
            ...noteData,
            userId: firstUser.id,
            imageUrl:
              Math.random() > 0.5
                ? `https://picsum.photos/800/400?random=${noteIndex + 100}`
                : null,
          },
        });

        console.log(
          `✅ Created note: "${note.title}" for user ${firstUser.name}`
        );
        noteIndex++;
      }
    }

    console.log("🎉 Database seeding completed successfully!");

    // Show summary
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();

    console.log("\n📊 Summary:");
    console.log(`👥 Users created: ${userCount}`);
    console.log(`📝 Notes created: ${noteCount}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
