# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]


















# # Use Node.js LTS version
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy the rest of the application code
# COPY . .

# # Copy .env.dev file
# COPY ./envconfig/.env.dev ./.env

# # Generate Prisma Client
# RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Start a new stage for a smaller production image
# FROM node:18-alpine

# WORKDIR /app

# # Copy built assets from builder stage
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.env ./
# COPY --from=builder /app/prisma ./prisma

# # Install production dependencies
# RUN npm ci --only=production

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD ["npm", "start"]