# ==============================================================================
# Build Stage
# ==============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package definition
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# ==============================================================================
# Production Stage
# ==============================================================================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package definition
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
