# AI-Powered Note Editor

A modern, full-stack AI-powered note editor built with Next.js 15, TypeScript, and integrated with OpenAI for intelligent writing assistance.

## ✨ Features

### Core Functionality

- **Markdown Editor**: Full-featured markdown editor with live preview
- **Auto-save**: Automatic saving every 10 seconds when changes are detected
- **Image Uploads**: Seamless image uploads via Cloudinary integration
- **AI Suggestions**: OpenAI-powered writing assistance with multiple modes
- **Responsive Design**: Works perfectly on desktop and mobile devices

### AI-Powered Features

- **Improve**: Enhance clarity, structure, and readability of existing content
- **Continue**: AI continues writing in your style and tone
- **Summarize**: Generate concise bullet-point summaries
- **Expand**: Add more details, examples, and explanations

### Technical Features

- **Real-time State Management**: Zustand store for editor state
- **Data Fetching**: TanStack Query for efficient server state management
- **TypeScript**: Full type safety throughout the application
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Secure user authentication with Clerk
- **SEO-Friendly**: Slug-based URLs for note sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+
- PostgreSQL database
- Clerk account for authentication
- Cloudinary account for image uploads
- OpenAI API key for AI features

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/snackstack"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"
```

### Installation & Setup

1. **Install dependencies**:

```bash
pnpm install
```

2. **Generate Prisma client**:

```bash
pnpm prisma generate --schema=server/db/schema.prisma
```

3. **Run database migrations**:

```bash
pnpm prisma migrate dev --schema=server/db/schema.prisma
```

4. **Start development server**:

```bash
pnpm dev
```

## 📁 Project Structure

```
app/
├── notes/                    # Notes routes
│   ├── page.tsx             # Notes list page
│   ├── new/                 # New note creation
│   ├── edit/[id]/          # Edit existing note
│   ├── [slug]/             # View note by slug
│   └── layout.tsx          # Notes layout
├── api/
│   ├── notes/              # CRUD API routes
│   │   ├── route.ts        # GET, POST notes
│   │   └── [id]/route.ts   # GET, PUT, DELETE note
│   └── ai-suggestion/      # AI suggestion API
│       └── route.ts        # POST AI suggestions

components/
├── notes/
│   └── note-editor.tsx     # Main editor component
└── ui/                     # Reusable UI components

stores/
└── use-note-editor-store.ts # Editor state management

server/
└── db/
    └── schema.prisma       # Database schema
```

## 🎯 Usage Guide

### Creating a New Note

1. Navigate to `/notes`
2. Click "New Note" button
3. Enter title and content in markdown
4. Auto-save will handle saving automatically
5. Use AI suggestions to enhance your writing

### Editing Notes

1. Go to `/notes` to see all your notes
2. Click "Edit" on any note
3. Make changes - auto-save will preserve your work
4. Use AI features to improve, continue, or expand content

### AI Features

- **Improve**: Highlight text and click "Improve with AI" to enhance clarity
- **Continue**: Place cursor where you want to continue and click "Continue"
- **Summarize**: Select content and click "Summarize" for bullet points
- **Expand**: Select content and click "Expand" for more details

### Image Uploads

- Click the image upload button in the editor
- Select or drag & drop images
- Images are automatically uploaded to Cloudinary
- Image URLs are saved with your notes

## 🔧 API Endpoints

### Notes CRUD

- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### AI Suggestions

- `POST /api/ai-suggestion` - Generate AI suggestions
  - Body: `{ content: string, type: "improve" | "continue" | "summarize" | "expand" }`

## 🗄️ Database Schema

```prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  slug      String   @unique
  imageUrl  String?
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([slug])
}
```

## 🎨 Key Components

### NoteEditor

The main editor component with:

- Markdown text editor with auto-resize
- Real-time auto-save functionality
- Image upload integration
- AI suggestion buttons
- Save status indicators

### Note Display

React Markdown renderer with:

- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Custom styling for better readability
- Image display support

### State Management

Zustand store managing:

- Current note content
- Editor state (dirty, saving, etc.)
- AI suggestion state
- Auto-save timing

## 🚀 Deployment

The app is ready for deployment on Vercel, Netlify, or any platform supporting Next.js:

1. **Build the application**:

```bash
pnpm build
```

2. **Set environment variables** on your hosting platform

3. **Deploy** using your preferred method

## 🔍 Troubleshooting

### Common Issues

1. **Prisma Client Not Found**:

   ```bash
   pnpm prisma generate --schema=server/db/schema.prisma
   ```

2. **Database Connection Issues**:

   - Verify `DATABASE_URL` in environment variables
   - Ensure PostgreSQL is running

3. **AI Suggestions Not Working**:

   - Check `OPENAI_API_KEY` is valid
   - Verify API key has sufficient credits

4. **Image Upload Failing**:
   - Confirm Cloudinary credentials
   - Check upload preset configuration

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the SnackStack template and follows the same licensing terms.

---

**Built with ❤️ using Next.js 15, TypeScript, Prisma, and OpenAI**
