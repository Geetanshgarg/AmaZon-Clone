# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.18.0

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy root package files
COPY package.json package-lock.json ./
COPY turbo.json ./   
# Copy package files from all workspaces
COPY packages ./packages
COPY apps/server ./apps/server

# Install dependencies with npm ci
RUN npm ci

# Build the server and its dependencies
RUN turbo build --filter=server

# Runtime stage
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy packages (needed for runtime)
COPY packages ./packages
COPY apps/server ./apps/server


# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Run as non-root user
USER node

EXPOSE 8000

CMD ["node", "apps/server/dist/index.mjs"]
