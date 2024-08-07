# Build stage
FROM node:18.17.0 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with retry logic
RUN npm ci --verbose || npm ci --verbose || npm ci --verbose

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18.17.0-slim AS production

# Install OpenSSL and other necessary packages
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port the app runs on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node -e "require('http').request('http://localhost:3000/api/health', (r) => { if (r.statusCode !== 200) throw new Error() }).end()" || exit 1

# Start the application
CMD ["npm", "start"]