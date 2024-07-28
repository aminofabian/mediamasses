# Use Node.js LTS version
FROM node:lts AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Prisma db push
RUN npx prisma generate --schema=./prisma/schema.prisma
# Build the Next.js app to the 'dist' folder

#Build
RUN npm run build

# Use a smaller base image for production
FROM node:lts-slim AS production

# Set working directory
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app /app

# Install production dependencies only
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application from the 'dist' folder
CMD ["npm", "run", "start"]
