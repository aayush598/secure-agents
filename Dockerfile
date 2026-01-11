# ==============================
# Base
# ==============================
FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat

# ==============================
# Dependencies
# ==============================
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* ./

# Use npm (since you run npm scripts)
RUN npm ci

# ==============================
# Build
# ==============================
FROM base AS builder
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ==============================
# Runtime
# ==============================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
