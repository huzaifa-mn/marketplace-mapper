# ==============================================================================
# Build Stage
# ==============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package definition files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# ==============================================================================
# Production Stage
# ==============================================================================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package definition files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies to keep image small
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Re-generate Prisma Client for production environment
RUN npx prisma generate

# Expose the API port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
