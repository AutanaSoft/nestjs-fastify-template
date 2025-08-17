# Build stage - Using Alpine for optimized build
FROM node:alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Development stage - Using Microsoft's official devcontainer image
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm AS development

# Set working directory
WORKDIR /usr/src/app

# Switch to node user
USER node

# Expose port
EXPOSE 4200

# Keep container running for devcontainer
CMD ["sh", "-c", "while sleep 1000; do :; done"]

# Production stage
FROM node:alpine AS production

# Install pnpm and wget for health checks
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache wget

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --production

# Copy built application and prisma schema from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs && chown -R nestjs:nodejs logs

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /usr/src/app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4200

# Start the application
CMD ["node", "dist/main"]