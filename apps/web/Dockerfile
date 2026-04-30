# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.18.0
# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

ARG NEXT_PUBLIC_SERVER_URL=http://localhost:8000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy root package files
COPY . .
# Install dependencies
RUN npm ci

# Build the web app and its dependencies
RUN turbo build --filter=web

# Runtime stage
FROM node:${NODE_VERSION}-alpine


WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
# COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json



EXPOSE 3000

WORKDIR /app/apps/web

CMD ["npm", "start"]
