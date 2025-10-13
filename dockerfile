FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client (this needs to happen after copying source code)
RUN pnpm prisma generate --schema=server/db/schema.prisma

# Build the application
RUN pnpm build

# Runtime stage - only set environment variables at runtime
# This prevents sensitive data from being baked into the image layers
EXPOSE 3000

CMD ["pnpm", "start"]